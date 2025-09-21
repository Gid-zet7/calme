import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  // Get current user
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const kindeUser = ctx.session?.user;
    if (!kindeUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Find or create user in database
    let user = await ctx.db.user.findUnique({
      where: { kindeId: kindeUser.id },
    });

    if (!user) {
      user = await ctx.db.user.create({
        data: {
          kindeId: kindeUser.id,
          email: kindeUser.email,
          firstName: kindeUser.given_name,
          lastName: kindeUser.family_name,
          imageUrl: kindeUser.picture,
        },
      });
    }

    return user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const kindeUser = ctx.session?.user;
      if (!kindeUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.db.user.update({
        where: { kindeId: kindeUser.id },
        data: input,
      });
    }),

  // Get user profile with role
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const kindeUser = ctx.session?.user;
    if (!kindeUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Find or create user in database
    let user = await ctx.db.user.findUnique({
      where: { kindeId: kindeUser.id },
    });

    if (!user) {
      user = await ctx.db.user.create({
        data: {
          kindeId: kindeUser.id,
          email: kindeUser.email,
          firstName: kindeUser.given_name,
          lastName: kindeUser.family_name,
          imageUrl: kindeUser.picture,
        },
      });
    }

    return user;
  }),

  // Check if user is admin
  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    const kindeUser = ctx.session?.user;
    if (!kindeUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await ctx.db.user.findUnique({
      where: { kindeId: kindeUser.id },
      select: { role: true },
    });

    return user?.role === "ADMIN";
  }),
});
