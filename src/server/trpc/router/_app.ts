import { router } from "../trpc";
import { authRouter } from "./auth";
import { postsRouter } from "./posts";
import { tagsRouter } from "./tags";
export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  tags: tagsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
