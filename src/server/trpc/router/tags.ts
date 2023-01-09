import { publicProcedure, router } from '../trpc';
import { prisma } from '../../db/client';
const getTags = async () => {
    return await prisma.tag.findMany({select:{name:true}});
}
export const tagsRouter = router({
    getTags: publicProcedure
        .query(getTags)
})