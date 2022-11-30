import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import githubCache from '../../../utils/mdx';
const cache = githubCache.getInstance();
export const postsByTagRouter = router({
    getPostsByTag: publicProcedure
        .input(z.array(z.string()))
        .query(async ({ input }) => {
            return await cache.getPostsByTag(...input);
        })
})