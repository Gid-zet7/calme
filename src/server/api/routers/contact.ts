import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const contactRouter = createTRPCRouter({
  // Submit contact form
  submitContact: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(1),
        message: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contactSubmission.create({
        data: input,
      });
    }),

  // Get all contact submissions (admin only)
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
        search: z.string().optional(),
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

      const where = {
        ...(input.status && { status: input.status }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" as const } },
            { email: { contains: input.search, mode: "insensitive" as const } },
            { subject: { contains: input.search, mode: "insensitive" as const } },
            { message: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
      };

      const items = await ctx.db.contactSubmission.findMany({
        where,
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

  // Get single contact submission (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
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

      const submission = await ctx.db.contactSubmission.findUnique({
        where: { id: input.id },
      });

      if (!submission) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return submission;
    }),

  // Update contact submission status (admin only)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
        response: z.string().optional(),
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

      return ctx.db.contactSubmission.update({
        where: { id },
        data: updateData,
      });
    }),

  // Get contact statistics (admin only)
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

    const [total, newCount, inProgressCount, resolvedCount, closedCount] = await Promise.all([
      ctx.db.contactSubmission.count(),
      ctx.db.contactSubmission.count({ where: { status: "NEW" } }),
      ctx.db.contactSubmission.count({ where: { status: "IN_PROGRESS" } }),
      ctx.db.contactSubmission.count({ where: { status: "RESOLVED" } }),
      ctx.db.contactSubmission.count({ where: { status: "CLOSED" } }),
    ]);

    return {
      total,
      new: newCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      closed: closedCount,
    };
  }),
});
