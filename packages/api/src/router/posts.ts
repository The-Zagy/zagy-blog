import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from '@acme/db';
import { inferAsyncReturnType } from '@trpc/server';
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
const getLatestPosts = async () => {
    return await prisma.post.findMany({
        take: 4,
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            slug: true,
            title: true,
            bannerUrl: true,
            createdAt: true,
            readingTime: true,
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
    })
}

// posts router
export type PostsFromQuery = inferAsyncReturnType<typeof getPosts>
export const postsRouter = createTRPCRouter({
    getPosts: publicProcedure
        .input(z.object({
            ids: z.array(z.string()),
            searchInput: z.string()
        }))
        .query(({ input }) => getPosts(input.ids, input.searchInput)),
    getLatestPosts: publicProcedure.query(() => getLatestPosts())

})
