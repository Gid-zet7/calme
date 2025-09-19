import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const partnersRouter = createTRPCRouter({
  // Get all active partners
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.partner.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }),

  // Get single partner
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const partner = await ctx.db.partner.findUnique({
        where: { id: input.id },
      });

      if (!partner || !partner.isActive) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return partner;
    }),

  // Create partner (admin only)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        logoUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        isActive: z.boolean().default(true),
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

      return ctx.db.partner.create({
        data: input,
      });
    }),

  // Update partner (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        logoUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        isActive: z.boolean().optional(),
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

      return ctx.db.partner.update({
        where: { id },
        data: updateData,
      });
    }),

  // Delete partner (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
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

      return ctx.db.partner.delete({
        where: { id: input.id },
      });
    }),
});
