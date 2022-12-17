import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
// import cache from '../../utils/cache';
// import { NUMBER_OF_POSTS_IN_A_PAGE } from "../../env/constants";

// TODO DADDY PLEASE USE JWT
const verifyToken = async (_token: string): Promise<boolean> => {
    return true;
}
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.headers.authorization || !(typeof req.headers.authorization === 'string') || !await verifyToken(req.headers.authorization)) {
        return res.status(401).json({ message: "Invalid Token | Not authorized" });
    }
    // if (!req.body.files || typeof req.body.file !== "string") return res.status(400).json({ messege: "string space separated file paths must be provided" })
    // const filePaths = req.body.files.split(" ");

    // const homePagesToBeRevalidated = new Set<number>;
    // // await cache.updatePosts(/* postToBeUpdated */);
    // for (const path of filePaths) {
    //     try {
    //         // await GitHubFilesCache.updatePosts(/* postToBeUpdated */);
    //         const githubFiles = await cache.getPosts();
    //         const fileIndex = githubFiles.findIndex((i => i.meta.githubPath === path));
    //         const isNewlyCreated = fileIndex === githubFiles.length - 1 ? true : false;
    //         await cache.updatePosts(path);
    //         if (!isNewlyCreated) {
    //             res.revalidate(`/blog/post/${githubFiles[fileIndex]?.meta.slug}`);
    //         }
    //         const pageNumber = Math.floor(fileIndex / NUMBER_OF_POSTS_IN_A_PAGE + 1) + 1;
    //         homePagesToBeRevalidated.add(pageNumber);
    //         return res.status(200).json({ messege: `update post ${githubFiles[fileIndex]?.meta.slug} and page number ${pageNumber}` });
    //     } catch (e) {
    //         console.log(e)
    //         res.status(500).json({ message: 'error happend unknown' });
    //     }
    //     for (const page of homePagesToBeRevalidated) {
    //         res.revalidate(`/blog/${page}`);
    //     }
    // }
    console.log(req.body);
    console.log(req.body.added);
    console.log(req.body.deleted)
    console.log(req.body.modified)
    res.end();
}
export default handler;
