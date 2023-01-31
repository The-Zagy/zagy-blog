import { authRouter } from "./router/auth";
import { postsRouter } from "./router/posts";
import { tagsRouter } from "./router/tags";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  tags: tagsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
