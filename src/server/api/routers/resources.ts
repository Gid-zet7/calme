import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

export const resourcesRouter = createTRPCRouter({
  // Get S3 presigned upload URL (admin only)
  getPresignedUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileType: z.string().min(1),
        contentLength: z.number().min(1).max(50 * 1024 * 1024).optional(), // up to 50MB default
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });
      if (user?.role !== "ADMIN") throw new TRPCError({ code: "FORBIDDEN" });

      const s3 = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const objectKey = `resources/${Date.now()}-${input.fileName}`;
      const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: objectKey,
        ContentType: input.fileType,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 minutes

      const publicUrl = env.S3_PUBLIC_URL_BASE
        ? `${env.S3_PUBLIC_URL_BASE}/${objectKey}`
        : `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${objectKey}`;

      return { uploadUrl: url, objectKey, publicUrl };
    }),
  // Get all published resources
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        category: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, category, search } = input;

      const where = {
        isPublished: true,
        ...(category && { category }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const items = await ctx.db.resource.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
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

  // Admin list: get all resources (published and drafts)
  getAdminList: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.resource.findMany({
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get featured resources (for homepage)
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(3) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.resource.findMany({
        where: { isPublished: true },
        take: input.limit,
        orderBy: { downloadCount: "desc" },
      });
    }),

  // Get single resource
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const resource = await ctx.db.resource.findUnique({
        where: { id: input.id },
      });

      if (!resource || !resource.isPublished) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return resource;
    }),

  // Get categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.resource.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return categories.map(c => c.category);
  }),

  // Download resource (increment download count)
  download: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const resource = await ctx.db.resource.findUnique({
        where: { id: input.id },
      });

      if (!resource || !resource.isPublished) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Increment download count
      await ctx.db.resource.update({
        where: { id: input.id },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      });

      return resource;
    }),

  // Create resource (admin only)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        downloadUrl: z.string().optional(),
        category: z.string().min(1),
        fileSize: z.number().optional(),
        fileType: z.string().optional(),
        isPublished: z.boolean().default(true),
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

      return ctx.db.resource.create({
        data: input,
      });
    }),

  // Update resource (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        downloadUrl: z.string().optional(),
        category: z.string().min(1).optional(),
        fileSize: z.number().optional(),
        fileType: z.string().optional(),
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

      return ctx.db.resource.update({
        where: { id },
        data: updateData,
      });
    }),

  // Delete resource (admin only)
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

      return ctx.db.resource.delete({
        where: { id: input.id },
      });
    }),
});
