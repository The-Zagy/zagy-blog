import { PrismaClient } from '@prisma/client'
import { downloadAndParsePosts } from '../src/utils/mdx';
const prisma = new PrismaClient()
// function rand(min: number, max: number) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
export async function main() {
    const githubFiles = await downloadAndParsePosts();
    for (const file of githubFiles) {
        const post = await prisma.post.create({
            data: {
                title: file.meta.title,
                bannerUrl: file.meta.bannerUrl || 'str',
                description: file.meta.description,
                githubPath: file.meta.githubPath,
                code: file.code,
                keyWords: file.meta?.meta?.keywords || []
            }
        })
        // add each file already exist tags
        if (file.meta.categories) {
            for (const tag of file.meta.categories) {
                await prisma.tag.upsert({
                    where: {
                        name: tag
                    },
                    create: {
                        name: tag,
                        posts: {
                            create: {
                                postId: post.id
                            }
                        }
                    },
                    update: {
                        posts: {
                            create: {
                                postId: post.id
                            }
                        }
                    }
                })
            }
        }
        // connect posts with autohrs and contributors
        if (file.meta.contributers) {
            // create author
            await prisma.user.upsert({
                where: {
                    id: file.meta.contributers.author.id?.toString() as string
                },
                create: {
                    id: file.meta.contributers.author.id?.toString() as string,
                    handle: file.meta.contributers.author.login as string,
                    image: file.meta.contributers.author.avatar_url as string,
                    posts: {
                        create: {
                            isAuthor: true,
                            postId: post.id
                        }
                    }

                },
                update: {
                    posts: {
                        create: {
                            isAuthor: true,
                            postId: post.id
                        }
                    }
                }
            })
            console.log(file.meta.contributers.restOfContributers);
            // for (const cont of file.meta.contributers.restOfContributers) {
            //     await prisma.user.upsert({
            //         where: {
            //             id: file.meta.contributers.author.id?.toString() as string
            //         },
            //         create: {
            //             id: cont.id?.toString() as string ,
            //             handle: cont.login as string,
            //             image: cont.avatar_url as string,
            //             posts: {
            //                 create: {
            //                     isAuthor: false,
            //                     postId: post.id
            //                 }
            //             }
            //         },
            //         update: {
            //             posts: {
            //                 create: {
            //                     isAuthor: false,
            //                     postId: post.id
            //                 }
            //             }
            //         }
            //     })
            // }
        }
    }
}

// main()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })