import { publicProcedure, createTRPCRouter } from '../trpc';
import { prisma } from '@acme/db';
const getTags = async () => {
    return await prisma.tag.findMany({ select: { name: true } });
}
export const tagsRouter = createTRPCRouter({
    getTags: publicProcedure
        .query(getTags)
})