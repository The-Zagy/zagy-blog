import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import githubCache from '../../../utils/mdx';

export const tagsRouter = router({
    getPostsByTag: publicProcedure
        .input(z.array(z.string()))
        .query(async ({ input }) => {
            return await githubCache.getPostsByTag(...input);
        })
})