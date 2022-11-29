import { publicProcedure, router } from '../trpc';
import githubCache from '../../../utils/mdx';

export const tagsRouter = router({
    getPostsByTag: publicProcedure
        .query(async () => {
            return await githubCache.getTags();
        })
})