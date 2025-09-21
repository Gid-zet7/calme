import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';
import { requireRole } from '@/lib/auth-utils';

export const dashboardRouter = createTRPCRouter({
  // Admin dashboard stats
  getAdminStats: protectedProcedure
    .query(async ({ ctx }) => {
      await requireRole('admin');
      
      // Get counts for dashboard stats
      const [
        totalPrograms,
        totalResources,
        totalNews,
        totalPsychologists,
        totalAppointments,
        totalUsers
      ] = await Promise.all([
        ctx.db.program.count(),
        ctx.db.resource.count(),
        ctx.db.newsItem.count(),
        ctx.db.psychologist.count(),
        ctx.db.appointment.count(),
        ctx.db.user.count()
      ]);

      return {
        totalPrograms,
        totalResources,
        totalNews,
        totalPsychologists,
        totalAppointments,
        totalUsers
      };
    }),

  // Psychologist dashboard stats
  getPsychologistStats: protectedProcedure
    .query(async ({ ctx }) => {
      await requireRole('psychologist');
      
      const userId = ctx.session?.user?.id;
      if (!userId) throw new Error('User not found');

      // Get psychologist's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const [
        todayAppointments,
        weekAppointments,
        totalAppointments,
        activeClients
      ] = await Promise.all([
        ctx.db.appointment.count({
          where: {
            psychologistId: userId,
            date: {
              gte: today,
              lt: tomorrow
            }
          }
        }),
        ctx.db.appointment.count({
          where: {
            psychologistId: userId,
            date: {
              gte: today,
              lt: nextWeek
            }
          }
        }),
        ctx.db.appointment.count({
          where: {
            psychologistId: userId
          }
        }),
        ctx.db.appointment.findMany({
          where: {
            psychologistId: userId,
            status: 'SCHEDULED'
          },
          select: {
            userId: true
          },
          distinct: ['userId']
        })
      ]);

      return {
        todayAppointments,
        weekAppointments,
        totalAppointments,
        activeClients: activeClients.length
      };
    }),

  // Get recent activities for admin dashboard
  getRecentActivities: protectedProcedure
    .query(async ({ ctx }) => {
      await requireRole('admin');
      
      // Get recent activities from different models
      const [recentPrograms, recentResources, recentNews, recentPsychologists] = await Promise.all([
        ctx.db.program.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            status: true
          }
        }),
        ctx.db.resource.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            isPublished: true
          }
        }),
        ctx.db.newsItem.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            isPublished: true
          }
        }),
        ctx.db.psychologist.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            isActive: true
          }
        })
      ]);

      // Combine and sort activities
      const activities = [
        ...recentPrograms.map(p => ({
          id: `program-${p.id}`,
          type: 'program',
          title: p.title,
          action: 'created',
          createdAt: p.createdAt,
          status: p.status
        })),
        ...recentResources.map(r => ({
          id: `resource-${r.id}`,
          type: 'resource',
          title: r.title,
          action: r.isPublished ? 'published' : 'created',
          createdAt: r.createdAt,
          status: r.isPublished ? 'published' : 'draft'
        })),
        ...recentNews.map(n => ({
          id: `news-${n.id}`,
          type: 'news',
          title: n.title,
          action: n.isPublished ? 'published' : 'created',
          createdAt: n.createdAt,
          status: n.isPublished ? 'published' : 'draft'
        })),
        ...recentPsychologists.map(p => ({
          id: `psychologist-${p.id}`,
          type: 'psychologist',
          title: `${p.firstName} ${p.lastName}`,
          action: 'added',
          createdAt: p.createdAt,
          status: p.isActive ? 'active' : 'inactive'
        }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
       .slice(0, 10);

      return activities;
    }),

  // Get psychologist's appointments
  getPsychologistAppointments: protectedProcedure
    .input(z.object({
      date: z.string().optional(),
      status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
      limit: z.number().min(1).max(100).default(20)
    }))
    .query(async ({ ctx, input }) => {
      await requireRole('psychologist');
      
      const userId = ctx.session?.user?.id;
      if (!userId) throw new Error('User not found');

      const where: any = {
        psychologistId: userId
      };

      if (input.date) {
        const date = new Date(input.date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        where.date = {
          gte: date,
          lt: nextDay
        };
      }

      if (input.status) {
        where.status = input.status;
      }

      const appointments = await ctx.db.appointment.findMany({
        where,
        take: input.limit,
        orderBy: { date: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true
            }
          }
        }
      });

      return appointments;
    })
});
