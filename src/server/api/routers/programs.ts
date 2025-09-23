import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const programsRouter = createTRPCRouter({
  // Get all programs
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        upcomingOnly: z.boolean().default(false),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, upcomingOnly, search } = input;

      const where = {
        ...(upcomingOnly && { isUpcoming: true }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { location: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const items = await ctx.db.program.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { date: "asc" },
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

  // Get upcoming programs (for homepage)
  getUpcoming: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(5) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.program.findMany({
        where: { isUpcoming: true },
        take: input.limit,
        orderBy: { date: "asc" },
      });
    }),

  // Get single program
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const program = await ctx.db.program.findUnique({
        where: { id: input.id },
        include: {
          registrations: {
            where: { status: "CONFIRMED" },
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!program) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return program;
    }),

  // Register for program
  register: publicProcedure
    .input(
      z.object({
        programId: z.string(),
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const program = await ctx.db.program.findUnique({
        where: { id: input.programId },
      });

      if (!program) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (!program.isUpcoming) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "Program registration is closed" 
        });
      }

      // Check if already registered
      const existingRegistration = await ctx.db.programRegistration.findUnique({
        where: {
          programId_email: {
            programId: input.programId,
            email: input.email,
          },
        },
      });

      if (existingRegistration) {
        throw new TRPCError({ 
          code: "CONFLICT", 
          message: "Already registered for this program" 
        });
      }

      // Check capacity
      if (program.maxAttendees && program.currentAttendees >= program.maxAttendees) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "Program is at full capacity" 
        });
      }

      // Create registration
      const registration = await ctx.db.programRegistration.create({
        data: {
          programId: input.programId,
          userId: ctx.session?.user?.id || "anonymous",
          email: input.email,
          name: input.name,
          phone: input.phone,
        },
      });

      // Update program attendee count
      await ctx.db.program.update({
        where: { id: input.programId },
        data: {
          currentAttendees: {
            increment: 1,
          },
        },
      });

      return registration;
    }),

  // Create program (admin only)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        date: z.date(),
        location: z.string().min(1),
        isUpcoming: z.boolean().default(true),
        maxAttendees: z.number().optional(),
        videoUrl: z.string().optional(),
        leadPsychologistIds: z.array(z.string()).optional(),
        attendeeUserIds: z.array(z.string()).optional(),
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

      return ctx.db.program.create({
        data: ({
          title: input.title,
          description: input.description,
          content: input.content,
          imageUrl: input.imageUrl,
          date: input.date,
          location: input.location,
          isUpcoming: input.isUpcoming,
          maxAttendees: input.maxAttendees,
          videoUrl: input.videoUrl,
          leadPsychologists: input.leadPsychologistIds?.length ? {
            connect: input.leadPsychologistIds.map(id => ({ id }))
          } : undefined,
          attendees: input.attendeeUserIds?.length ? {
            connect: input.attendeeUserIds.map(id => ({ id }))
          } : undefined,
        }) as any,
      });
    }),

  // Update program (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        date: z.date().optional(),
        location: z.string().min(1).optional(),
        isUpcoming: z.boolean().optional(),
        maxAttendees: z.number().optional(),
        videoUrl: z.string().optional(),
        status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
        leadPsychologistIds: z.array(z.string()).optional(),
        attendeeUserIds: z.array(z.string()).optional(),
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

      return ctx.db.program.update({
        where: { id },
        data: ({
          ...updateData,
          leadPsychologists: input.leadPsychologistIds ? {
            set: input.leadPsychologistIds.map(pid => ({ id: pid }))
          } : undefined,
          attendees: input.attendeeUserIds ? {
            set: input.attendeeUserIds.map(uid => ({ id: uid }))
          } : undefined,
        }) as any,
      });
    }),

  // Delete program (admin only)
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

      return ctx.db.program.delete({
        where: { id: input.id },
      });
    }),
});
