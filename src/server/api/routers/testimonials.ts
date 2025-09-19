import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const testimonialsRouter = createTRPCRouter({
  // Get all approved testimonials
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get single testimonial
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const testimonial = await ctx.db.testimonial.findUnique({
        where: { id: input.id },
      });

      if (!testimonial || !testimonial.isApproved) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return testimonial;
    }),

  // Submit testimonial
  submitTestimonial: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        role: z.string().min(1),
        content: z.string().min(10),
        imageUrl: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.testimonial.create({
        data: {
          ...input,
          isApproved: false, // Requires admin approval
        },
      });
    }),

  // Get all testimonials (admin only)
  getAllForAdmin: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        approved: z.boolean().optional(),
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
        ...(input.approved !== undefined && { isApproved: input.approved }),
      };

      const items = await ctx.db.testimonial.findMany({
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

  // Approve testimonial (admin only)
  approve: protectedProcedure
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

      return ctx.db.testimonial.update({
        where: { id: input.id },
        data: { isApproved: true },
      });
    }),

  // Reject testimonial (admin only)
  reject: protectedProcedure
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

      return ctx.db.testimonial.delete({
        where: { id: input.id },
      });
    }),

  // Update testimonial (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        role: z.string().min(1).optional(),
        content: z.string().min(10).optional(),
        imageUrl: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        isApproved: z.boolean().optional(),
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

      return ctx.db.testimonial.update({
        where: { id },
        data: updateData,
      });
    }),

  // Delete testimonial (admin only)
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

      return ctx.db.testimonial.delete({
        where: { id: input.id },
      });
    }),
});
