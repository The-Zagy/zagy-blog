import { publicProcedure, router } from '../trpc';
import githubCache from '../../../utils/mdx';
const cache = githubCache.getInstance();
export const tagsRouter = router({
    getTags: publicProcedure
        .query(async () => {
            return await cache.getTags();
        })
})