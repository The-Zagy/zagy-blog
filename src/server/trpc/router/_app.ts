import { router } from "../trpc";
import { authRouter } from "./auth";
import { tagsRouter } from "./tags";

export const appRouter = router({
  auth: authRouter,
  tags: tagsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
