import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { prisma } from '../../db/client';
import { AsyncReturnType } from '../../../utils/ts-bs'
const getPosts = async (ids: string[], searchInput: string) => {
    if (ids.length === 0 && searchInput.length === 0) return [];

    return await prisma.post.findMany(
        {
            where: {
                AND: [
                    {
                        title: {
                            contains: searchInput,
                            mode: "insensitive"
                        }
                    },
                    ...ids.map(id => ({
                        tags: {
                            some: {
                                tagId: {
                                    equals: id
                                }
                            }
                        }
                    }))
                ],
            },
            select: {
                id: true,
                slug: true,
                title: true,
                contributors: {
                    where: {
                        isAuthor: true
                    },

                    take: 1,
                    select: {
                        contributor: {
                            select: {
                                handle: true,
                                image: true,
                            }
                        }
                    }
                },
                tags: {
                    select: {
                        tag: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                description: true,
            }
        }
    );
}


// posts router
export type PostsFromQuery = AsyncReturnType<typeof getPosts>
export const postsRouter = router({
    getPosts: publicProcedure
        .input(z.object({
            ids: z.array(z.string()),
            searchInput: z.string()
        }))
        .query(({ input }) => getPosts(input.ids, input.searchInput)),

})
