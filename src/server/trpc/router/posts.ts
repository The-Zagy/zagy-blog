import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { prisma } from '../../db/client';
import {AsyncReturnType}  from '../../../utils/ts-bs'
const getPostsByTags = async (ids:string[]) => {
    return await prisma.post.findMany(
        {
            where:{
                tags:{
                    some:{
                        tagId:{
                            in:ids
                        }
                    }
                }
            },
            select: {
                id: true,
                slug: true,
                title: true,
                contributors: {where: {
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
                            select:{
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

const getPostByTitle = async (title: string) => {
    return await prisma.post.findMany({
        where: {
            title: {
                contains: title
            }
        },
        select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            contributors: {where: {
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
                        select:{
                            name: true,
                        }
                    }
                }
            },
        }
    })
}
// posts router
export type PostsFromQuery = AsyncReturnType<typeof getPostsByTags>
export const postsRouter = router({
    getPostsByTags: publicProcedure
        .input(z.array(z.string()))
        .query(({input})=>getPostsByTags(input)),
    getPostByTitle: publicProcedure
        .input(z.string())
        .query(({input})=>getPostByTitle(input))
})
