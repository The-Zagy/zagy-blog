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
    const user = await prisma.user.upsert({
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
        update: {}
    })
    await prisma.contributorsOnPosts.upsert({
        where: {
            postId_contributorId_isAuthor: {
                contributorId: user.id,
                postId: postSlug,
                isAuthor: true
            }
        },
        create: {
            isAuthor: true,
            postId: postSlug,
            contributorId: user.id
        },
        update: {}
    })
}
/**
 * create tags if not already exist, and assign them to the post
 */
export const upsertCategoryToPost = async (tag: string, postSlug: string) => {
    const tagDB = await prisma.tag.upsert({
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
        update: {}
    })
    await prisma.tagsOnPosts.upsert({
        where: {
            postId_tagId: {
                postId: postSlug,
                tagId: tagDB.name
            },
        },
        create: {
            postId: postSlug,
            tagId: tagDB.name
        },
        update: {}
    })
}

export const upsertPost = async (post: ParsedPost) => {
    console.log(post.meta.slug);
    return await prisma.post.upsert({
        where: {
            slug: post.meta.slug,
        },
        create: {
            slug: post.meta.slug,
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
    console.log('deleteddededededd', slug)
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
export const postsCount = async () => {
    return await prisma.post.count()
}