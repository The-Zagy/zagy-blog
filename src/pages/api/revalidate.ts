import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import GitHubFilesCache from '../../utils/mdx';
import { NUMBER_OF_POSTS_IN_A_PAGE } from "../../env/constants";

// TODO DADDY PLEASE USE JWT
const verifyToken = async (token: string): Promise<boolean> => {
    return true;
}
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.headers.authorization || !(typeof req.headers.authorization === 'string') || !await verifyToken(req.headers.authorization)) {
        return res.status(401).json({ message: "Invalid Token | Not authorized" });
    }

    if (!Array.isArray(req.body.slugs)) {
        return res.status(400).json({ messege: "an array of changed or added files must be supplied" })
    }
    const homePagesToBeRevalidated = new Set<number>;
    await GitHubFilesCache.updatePosts(/* postToBeUpdated */);
    for (const slug of req.body.slugs) {
        try {
            // await GitHubFilesCache.updatePosts(/* postToBeUpdated */);
            const githubFiles = await GitHubFilesCache.getPosts();
            const fileIndex = githubFiles.findIndex((i => i.meta.slug === slug));
            const isNewlyCreated = fileIndex === githubFiles.length - 1 ? true : false;
            if (!isNewlyCreated) {
                res.revalidate(`/blog/post/${githubFiles[fileIndex]?.meta.slug}`);
            }
            //update the posts page
            const pageNumber = Math.floor(fileIndex / NUMBER_OF_POSTS_IN_A_PAGE + 1) + 1;
            homePagesToBeRevalidated.add(pageNumber);
            return res.status(200).json({ messege: `update post ${githubFiles[fileIndex]?.meta.slug} and page number ${pageNumber}` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'error happend unknown' });
        }
        for (const page of homePagesToBeRevalidated) {
            res.revalidate(`/blog/${page}`);
        }
    }
}
export default handler;
