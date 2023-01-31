import { downloadAndParsePosts } from '@acme/mdx';
import { upsertPost, upsertCategoryToPost, upsertUserToPost } from '@acme/db';
// function rand(min: number, max: number) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
export async function seed() {
    const githubFiles = await downloadAndParsePosts();
    for (const file of githubFiles) {
        const post = await upsertPost(file);
        // add each file already exist tags
        if (file.meta.categories) {
            for (const tag of file.meta.categories) {
                await upsertCategoryToPost(tag, post.slug)
            }
        }
        // connect posts with autohrs and contributors
        if (file.meta.contributers) {
            // create author
            await upsertUserToPost(file.meta.contributers, post.slug);
            // console.log(file.meta.contributers.restOfContributers);
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