import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { env } from "@/env";

export const donationsRouter = createTRPCRouter({
  // Initialize Paystack payment
  initializePayment: publicProcedure
    .input(
      z.object({
        amount: z.number().min(1),
        email: z.string().email(),
        currency: z.string().default("USD"),
        donorName: z.string().optional(),
        isAnonymous: z.boolean().default(false),
        message: z.string().optional(),
        isMonthly: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Public donation - no authentication required
      let userId: string | undefined = undefined;

      // Check if Paystack is configured
      if (!env.PAYSTACK_SECRET_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Paystack is not configured. Please set PAYSTACK_SECRET_KEY in your environment variables.",
        });
      }

      // Convert amount to kobo (Paystack's smallest currency unit)
      const amountInKobo = Math.round(input.amount * 100);
      const reference = `calme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        // Prepare the request payload according to Paystack documentation
        const payload = {
          email: input.email,
          amount: amountInKobo,
          currency: "GHS",
          reference,
          callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/donate/success`,
          metadata: {
            donorName: input.donorName || "Anonymous",
            isAnonymous: input.isAnonymous,
            message: input.message || "",
            isMonthly: input.isMonthly,
            userId: userId || null,
            donationType: input.isMonthly ? "monthly" : "one-time",
          },
        };

        console.log("Initializing Paystack payment with payload:", {
          ...payload,
          amount: `${amountInKobo} kobo (${input.amount} ${input.currency})`,
        });

        const response = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          payload,
          {
            headers: {
              Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          // Create donation record with PENDING status
          const donation = await ctx.db.donation.create({
            data: {
              amount: input.amount,
              currency: input.currency,
              paymentMethod: "paystack",
              donorName: input.donorName,
              donorEmail: input.email,
              isAnonymous: input.isAnonymous,
              message: input.message,
              status: "PENDING",
              transactionId: response.data.data.reference,
              userId,
            },
          });

          return {
            authorizationUrl: response.data.data.authorization_url,
            reference: response.data.data.reference,
            donationId: donation.id,
          };
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to initialize payment",
          });
        }
      } catch (error: any) {
        console.error("Paystack initialization error:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
        
        if (error.response?.status === 403) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid Paystack API key. Please check your PAYSTACK_SECRET_KEY in your environment variables.",
          });
        }
        
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.message || "Invalid request parameters";
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Paystack validation error: ${errorMessage}`,
          });
        }
        
        if (error.response?.status === 401) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Paystack authentication failed. Please verify your API key.",
          });
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to initialize payment: ${error.response?.data?.message || error.message}`,
        });
      }
    }),

  // Verify Paystack payment
  verifyPayment: publicProcedure
    .input(z.object({ reference: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if Paystack is configured
      if (!env.PAYSTACK_SECRET_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Paystack is not configured. Please set PAYSTACK_SECRET_KEY in your environment variables.",
        });
      }

      try {
        console.log(`Verifying Paystack payment with reference: ${input.reference}`);
        
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${input.reference}`,
          {
            headers: {
              Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          const transaction = response.data.data;
          
          // Find the donation record
          const donation = await ctx.db.donation.findFirst({
            where: { transactionId: input.reference },
          });

          if (!donation) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Donation record not found",
            });
          }

          // Update donation status based on payment status
          const status = transaction.status === "success" ? "COMPLETED" : "FAILED";

          const updatedDonation = await ctx.db.donation.update({
            where: { id: donation.id },
            data: {
              status,
            },
          });

          return {
            success: transaction.status === "success",
            donation: updatedDonation,
            transaction,
          };
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Payment verification failed",
          });
        }
      } catch (error: any) {
        console.error("Paystack verification error:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
        
        if (error.response?.status === 403) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid Paystack API key. Please check your PAYSTACK_SECRET_KEY.",
          });
        }
        
        if (error.response?.status === 404) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Transaction reference not found. Please check the reference and try again.",
          });
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to verify payment: ${error.response?.data?.message || error.message}`,
        });
      }
    }),

  // Create donation (legacy - kept for backward compatibility)
  createDonation: publicProcedure
    .input(
      z.object({
        amount: z.number().min(1),
        currency: z.string().default("USD"),
        paymentMethod: z.string(),
        donorName: z.string().optional(),
        donorEmail: z.string().email().optional(),
        isAnonymous: z.boolean().default(false),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Public donation - no authentication required
      let userId: string | undefined = undefined;

      return ctx.db.donation.create({
        data: {
          ...input,
          userId,
          amount: input.amount,
        },
      });
    }),

  // Get user's donations
  getMyDonations: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const kindeUser = ctx.session?.user;
      if (!kindeUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const user = await ctx.db.user.findUnique({
        where: { kindeId: kindeUser.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const items = await ctx.db.donation.findMany({
        where: { userId: user.id },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get donation by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const donation = await ctx.db.donation.findUnique({
        where: { id: input.id },
      });

      if (!donation) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return donation;
    }),

  // Update donation status (admin only)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
        transactionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const kindeUser = ctx.session?.user;
      if (!kindeUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const user = await ctx.db.user.findUnique({
        where: { kindeId: kindeUser.id },
        select: { role: true },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...updateData } = input;

      return ctx.db.donation.update({
        where: { id },
        data: updateData,
      });
    }),

  // Get donation statistics (admin only)
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const kindeUser = ctx.session?.user;
    if (!kindeUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await ctx.db.user.findUnique({
      where: { kindeId: kindeUser.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const [totalDonations, totalAmount, completedDonations, pendingDonations] = await Promise.all([
      ctx.db.donation.count(),
      ctx.db.donation.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }),
      ctx.db.donation.count({ where: { status: "COMPLETED" } }),
      ctx.db.donation.count({ where: { status: "PENDING" } }),
    ]);

    return {
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      completedDonations,
      pendingDonations,
    };
  }),

  // Get recent donations (admin only)
  getRecent: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const kindeUser = ctx.session?.user;
      if (!kindeUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const user = await ctx.db.user.findUnique({
        where: { kindeId: kindeUser.id },
        select: { role: true },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const items = await ctx.db.donation.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
