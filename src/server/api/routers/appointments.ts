import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const appointmentsRouter = createTRPCRouter({
  // Get user's appointments
  getMyAppointments: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
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

      const where = {
        userId: user.id,
        ...(input.status && { status: input.status }),
      };

      const items = await ctx.db.appointment.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { date: "desc" },
        include: {
          psychologist: {
            select: {
              id: true,
              name: true,
              specialization: true,
              imageUrl: true,
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

  // Get available psychologists
  getPsychologists: publicProcedure
    .input(
      z.object({
        specialization: z.string().optional(),
        availability: z.string().optional(), // day of week
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        isActive: true,
        ...(input.specialization && { specialization: { contains: input.specialization, mode: "insensitive" as const } }),
        ...(input.availability && { availability: { has: input.availability } }),
      };

      return ctx.db.psychologist.findMany({
        where,
        orderBy: { name: "asc" },
      });
    }),

  // Get available time slots for a psychologist
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        psychologistId: z.string(),
        date: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { psychologistId, date } = input;

      // Get psychologist
      const psychologist = await ctx.db.psychologist.findUnique({
        where: { id: psychologistId },
      });

      if (!psychologist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Get existing appointments for the date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingAppointments = await ctx.db.appointment.findMany({
        where: {
          psychologistId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
        select: { date: true, duration: true },
      });

      // Generate available time slots (9 AM to 5 PM, 1-hour slots)
      const slots = [];
      const startHour = 9;
      const endHour = 17;

      for (let hour = startHour; hour < endHour; hour++) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, 0, 0, 0);

        // Check if slot is available
        const isBooked = existingAppointments.some(apt => {
          const aptTime = new Date(apt.date);
          return aptTime.getHours() === hour;
        });

        if (!isBooked) {
          slots.push({
            time: slotTime,
            displayTime: slotTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          });
        }
      }

      return slots;
    }),

  // Book appointment
  bookAppointment: protectedProcedure
    .input(
      z.object({
        psychologistId: z.string(),
        date: z.date(),
        duration: z.number().min(30).max(120).default(60),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      // Check if psychologist exists
      const psychologist = await ctx.db.psychologist.findUnique({
        where: { id: input.psychologistId },
      });

      if (!psychologist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check if slot is available
      const existingAppointment = await ctx.db.appointment.findFirst({
        where: {
          psychologistId: input.psychologistId,
          date: input.date,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      });

      if (existingAppointment) {
        throw new TRPCError({ 
          code: "CONFLICT", 
          message: "Time slot is already booked" 
        });
      }

      // Create appointment
      return ctx.db.appointment.create({
        data: {
          userId: user.id,
          psychologistId: input.psychologistId,
          date: input.date,
          duration: input.duration,
          notes: input.notes,
        },
        include: {
          psychologist: {
            select: {
              id: true,
              name: true,
              specialization: true,
              email: true,
            },
          },
        },
      });
    }),

  // Cancel appointment
  cancelAppointment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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

      const appointment = await ctx.db.appointment.findUnique({
        where: { id: input.id },
      });

      if (!appointment || appointment.userId !== user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (appointment.status === "CANCELLED") {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "Appointment is already cancelled" 
        });
      }

      return ctx.db.appointment.update({
        where: { id: input.id },
        data: { status: "CANCELLED" },
      });
    }),

  // Update appointment (admin/psychologist only)
  updateAppointment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
        notes: z.string().optional(),
        meetingLink: z.string().optional(),
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

      if (!user || !["ADMIN", "PSYCHOLOGIST"].includes(user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...updateData } = input;

      return ctx.db.appointment.update({
        where: { id },
        data: updateData,
      });
    }),
});
