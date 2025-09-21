import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

export const adminRouter = createTRPCRouter({
  // Get dashboard statistics
  getStats: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      const [programs, resources, news, psychologists, appointments] = await Promise.all([
        ctx.db.program.count(),
        ctx.db.resource.count(),
        ctx.db.newsItem.count(),
        ctx.db.psychologist.count(),
        ctx.db.appointment.count(),
      ]);

      return {
        programs,
        resources,
        news,
        psychologists,
        appointments,
      };
    }),

  // Programs CRUD
  getPrograms: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.program.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }),

  createProgram: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      startDate: z.date(),
      endDate: z.date(),
      maxParticipants: z.number().min(1),
      status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']),
      imageUrl: z.string().optional(),
      requirements: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.program.create({
        data: input,
      });
    }),

  updateProgram: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      maxParticipants: z.number().min(1).optional(),
      status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
      imageUrl: z.string().optional(),
      requirements: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      const { id, ...data } = input;
      return ctx.db.program.update({
        where: { id },
        data,
      });
    }),

  deleteProgram: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.program.delete({
        where: { id: input.id },
      });
    }),

  // Resources CRUD
  getResources: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.resource.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }),

  createResource: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      type: z.enum(['ARTICLE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'WORKSHOP']),
      url: z.string().url(),
      imageUrl: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.resource.create({
        data: input,
      });
    }),

  updateResource: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      type: z.enum(['ARTICLE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'WORKSHOP']).optional(),
      url: z.string().url().optional(),
      imageUrl: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      const { id, ...data } = input;
      return ctx.db.resource.update({
        where: { id },
        data,
      });
    }),

  deleteResource: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.resource.delete({
        where: { id: input.id },
      });
    }),

  // News CRUD
  getNews: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.newsItem.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }),

  createNews: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      excerpt: z.string().min(1),
      imageUrl: z.string().optional(),
      isPublished: z.boolean().default(false),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.newsItem.create({
        data: input,
      });
    }),

  updateNews: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      excerpt: z.string().min(1).optional(),
      imageUrl: z.string().optional(),
      isPublished: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      const { id, ...data } = input;
      return ctx.db.newsItem.update({
        where: { id },
        data,
      });
    }),

  deleteNews: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.newsItem.delete({
        where: { id: input.id },
      });
    }),

  // Psychologists CRUD
  getPsychologists: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.psychologist.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }),

  createPsychologist: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      specialization: z.string().min(1),
      bio: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      imageUrl: z.string().optional(),
      availability: z.array(z.string()),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.psychologist.create({
        data: input,
      });
    }),

  updatePsychologist: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      specialization: z.string().min(1).optional(),
      bio: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      imageUrl: z.string().optional(),
      availability: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      const { id, ...data } = input;
      return ctx.db.psychologist.update({
        where: { id },
        data,
      });
    }),

  deletePsychologist: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.psychologist.delete({
        where: { id: input.id },
      });
    }),

  // Get all appointments
  getAppointments: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      return ctx.db.appointment.findMany({
        include: {
          user: true,
          psychologist: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }),
});
