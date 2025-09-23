import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

export const psychologistRouter = createTRPCRouter({
  // Public: list active psychologists (for homepage)
  getPublic: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(12).default(3) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.psychologist.findMany({
        where: { isActive: true },
        take: input.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          specialization: true,
          bio: true,
          imageUrl: true,
          availability: true,
        },
      });
    }),
  // Get dashboard statistics
  getStats: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      // Check if user is psychologist
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'PSYCHOLOGIST') {
        throw new Error('Unauthorized');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const [todayAppointments, weekAppointments, totalAppointments] = await Promise.all([
        ctx.db.appointment.count({
          where: {
            psychologist: {
              user: {
                kindeId: ctx.session.user.kindeId,
              },
            },
            appointmentDate: {
              gte: today,
              lt: tomorrow,
            },
          },
        }),
        ctx.db.appointment.count({
          where: {
            psychologist: {
              user: {
                kindeId: ctx.session.user.kindeId,
              },
            },
            appointmentDate: {
              gte: weekStart,
              lt: weekEnd,
            },
          },
        }),
        ctx.db.appointment.count({
          where: {
            psychologist: {
              user: {
                kindeId: ctx.session.user.kindeId,
              },
            },
          },
        }),
      ]);

      return {
        todayAppointments,
        weekAppointments,
        totalAppointments,
      };
    }),

  // Get recent appointments
  getRecentAppointments: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(5) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'PSYCHOLOGIST') {
        throw new Error('Unauthorized');
      }

      return ctx.db.appointment.findMany({
        where: {
          psychologist: {
            user: {
              kindeId: ctx.session.user.kindeId,
            },
          },
        },
        include: {
          user: true,
        },
        orderBy: { appointmentDate: 'desc' },
        take: input.limit,
      });
    }),

  // Get all appointments for psychologist
  getAppointments: protectedProcedure
    .input(z.object({
      status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'PSYCHOLOGIST') {
        throw new Error('Unauthorized');
      }

      const where: any = {
        psychologist: {
          user: {
            kindeId: ctx.session.user.kindeId,
          },
        },
      };

      if (input.status) {
        where.status = input.status;
      }

      if (input.dateFrom || input.dateTo) {
        where.appointmentDate = {};
        if (input.dateFrom) {
          where.appointmentDate.gte = input.dateFrom;
        }
        if (input.dateTo) {
          where.appointmentDate.lte = input.dateTo;
        }
      }

      return ctx.db.appointment.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: { appointmentDate: 'desc' },
      });
    }),

  // Update appointment status
  updateAppointmentStatus: protectedProcedure
    .input(z.object({
      appointmentId: z.string(),
      status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'PSYCHOLOGIST') {
        throw new Error('Unauthorized');
      }

      // Verify the appointment belongs to this psychologist
      const appointment = await ctx.db.appointment.findFirst({
        where: {
          id: input.appointmentId,
          psychologist: {
            user: {
              kindeId: ctx.session.user.kindeId,
            },
          },
        },
      });

      if (!appointment) {
        throw new Error('Appointment not found or unauthorized');
      }

      return ctx.db.appointment.update({
        where: { id: input.appointmentId },
        data: {
          status: input.status,
          notes: input.notes,
        },
      });
    }),

  // Get psychologist profile
  getProfile: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { kindeId: ctx.session?.user?.id },
        select: { role: true },
      });

      if (user?.role !== 'PSYCHOLOGIST') {
        throw new Error('Unauthorized');
      }

      return ctx.db.psychologist.findFirst({
        where: {
          user: {
            kindeId: ctx.session.user.kindeId,
          },
        },
        include: {
          user: true,
        },
      });
    }),

  // Update psychologist profile
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      specialization: z.string().min(1).optional(),
      bio: z.string().min(1).optional(),
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

      if (user?.role !== 'PSYCHOLOGIST') {
        throw new Error('Unauthorized');
      }

      const psychologist = await ctx.db.psychologist.findFirst({
        where: {
          user: {
            kindeId: ctx.session.user.kindeId,
          },
        },
      });

      if (!psychologist) {
        throw new Error('Psychologist profile not found');
      }

      return ctx.db.psychologist.update({
        where: { id: psychologist.id },
        data: input,
      });
    }),
});
