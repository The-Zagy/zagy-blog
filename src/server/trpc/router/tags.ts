import { publicProcedure, router } from '../trpc';
import cache from '../../../utils/cache';
export const tagsRouter = router({
    getTags: publicProcedure
        .query(async () => {
            return await cache.getTags();
        })
})