import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const newsRouter = createTRPCRouter({
  // Get all published news
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        tag: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, tag } = input;

      const where = {
        isPublished: true,
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { summary: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(tag && { tags: { has: tag } }),
      };

      const items = await ctx.db.newsItem.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { publishedAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get single news item
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const newsItem = await ctx.db.newsItem.findUnique({
        where: { id: input.id },
      });

      if (!newsItem || !newsItem.isPublished) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return newsItem;
    }),

  // Get latest news (for homepage)
  getLatest: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(3) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.newsItem.findMany({
        where: { isPublished: true },
        take: input.limit,
        orderBy: { publishedAt: "desc" },
      });
    }),

  // Create news item (admin only)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        summary: z.string().min(1),
        imageUrl: z.string().optional(),
        author: z.string().min(1),
        tags: z.array(z.string()),
        isPublished: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.newsItem.create({
        data: {
          ...input,
          publishedAt: input.isPublished ? new Date() : null,
        },
      });
    }),

  // Update news item (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        summary: z.string().min(1).optional(),
        imageUrl: z.string().optional(),
        author: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...updateData } = input;

      return ctx.db.newsItem.update({
        where: { id },
        data: {
          ...updateData,
          publishedAt: input.isPublished ? new Date() : undefined,
        },
      });
    }),

  // Delete news item (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.newsItem.delete({
        where: { id: input.id },
      });
    }),
});
