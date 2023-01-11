import { PostContributors, ParsedPost } from "./mdx";
import { prisma } from "../server/db/client";
//* file contains reused database quries

/**
 * create or update user if exist, suppose to be used with post creation to assign post author
 * @param contributers user
 * @param postSlug post slug(id) to connect user to
 */
export const  upsertUserToPost = async (contributers: PostContributors, postSlug: string) => {
    if (contributers === undefined)
        throw new Error('file with no contributors daddy');
    await prisma.user.upsert({
        where: {
            id: contributers.author.id?.toString() as string
        },
        create: {
            id: contributers.author.id?.toString() as string,
            handle: contributers.author.login as string,
            image: contributers.author.avatar_url as string,
            posts: {
                create: {
                    isAuthor: true,
                    postId: postSlug
                }
            }

        },
        update: {
            posts: {
                create: {
                    isAuthor: true,
                    postId: postSlug
                }
            }
        }
    })
}
/**
 * create tags if not already exist, and assign them to the post
 */
export const upsertCategoryToPost = async (tag: string, postSlug: string) => {
    await prisma.tag.upsert({
        where: {
            name: tag
        },
        create: {
            name: tag,
            posts: {
                create: {
                    postId: postSlug
                }
            }
        },
        update: {
            posts: {
                create: {
                    postId: postSlug
                }
            }
        }
    })
}

export const upsertPost = async (post: ParsedPost) => {
    console.log(post.meta.slug);
    return await prisma.post.upsert({
        where: {
            //todo post.meta.slug is not the slug we want, idk we wanted the slug to end with .mdx or not
            slug: post.meta.githubPath.split('/').pop() as string,
        },
        create: {
            // todo but here when creating we're using different slug , so all the code i type will use the slug that ends with .mdx like the create here till we decide what to do
            slug: post.meta.githubPath.split('/').pop() as string,
            title: post.meta.title,
            bannerUrl: post.meta.bannerUrl || 'str',
            description: post.meta.description,
            githubPath: post.meta.githubPath,
            code: post.code,
            keyWords: post.meta?.meta?.keywords || []
        },
        update: {
            title: post.meta.title,
            bannerUrl: post.meta.bannerUrl || 'str',
            description: post.meta.description,
            code: post.code,
            keyWords: post.meta?.meta?.keywords || []
        }
    })
}
export const deletePost = async (slug: string) => {
    await prisma.post.delete({
        where: {
            slug 
        },
        include: {
            contributors: true,
            tags: true,
        }
    })
}