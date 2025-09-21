import { postRouter } from "@/server/api/routers/post";
import { authRouter } from "@/server/api/routers/auth";
import { newsRouter } from "@/server/api/routers/news";
import { programsRouter } from "@/server/api/routers/programs";
import { resourcesRouter } from "@/server/api/routers/resources";
import { appointmentsRouter } from "@/server/api/routers/appointments";
import { donationsRouter } from "@/server/api/routers/donations";
import { contactRouter } from "@/server/api/routers/contact";
import { partnersRouter } from "@/server/api/routers/partners";
import { testimonialsRouter } from "@/server/api/routers/testimonials";
import { adminRouter } from "@/server/api/routers/admin";
import { psychologistRouter } from "@/server/api/routers/psychologist";
import { dashboardRouter } from "@/server/api/routers/dashboard";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  news: newsRouter,
  programs: programsRouter,
  resources: resourcesRouter,
  appointments: appointmentsRouter,
  donations: donationsRouter,
  contact: contactRouter,
  partners: partnersRouter,
  testimonials: testimonialsRouter,
  admin: adminRouter,
  psychologist: psychologistRouter,
  dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
