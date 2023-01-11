import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
// import { NUMBER_OF_POSTS_IN_A_PAGE } from "../../env/constants";
import { Githubfile, downloadAndParsePosts, } from "../../utils/mdx";
import { upsertPost, upsertCategoryToPost, upsertUserToPost, deletePost } from "../../utils/db";

// TODO DADDY PLEASE USE JWT
const verifyToken = async (_token: string): Promise<boolean> => {
    return true;
}
// assume for now that req body will be that structure 
interface RevalidateReqStructure  {
    added: string[];
    deleted: string[];
    modified: string[];
    renamed: string[];
}
// function to create filter function for downloadAndParsePosts
const createPostsFilter = (body: RevalidateReqStructure) => {
    return (val: Githubfile): boolean => {
        const hsh: {[k: string]: boolean} = {};
        for (const file of body.added) {
            hsh[file] = true;
        }
        for (const file of body.modified) {
            hsh[file] = true;
        }
        return val.path in  hsh;
    }
}
/**
 * how the re-validation will work
 * if new file created or file updated download and parse this file from github 
 * deleted file only delete it from the db
 * !need to know how the workflow map renamed and modified files
*/
// todo the handler is copy paste from seed main function so you can use the seed function here
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.headers.authorization || !(typeof req.headers.authorization === 'string') || !await verifyToken(req.headers.authorization)) {
        return res.status(401).json({ message: "Invalid Token | Not authorized" });
    }
    // remove deleted files from database and revalidate next.js cache
    for (const deletedPostPath of req.body.deleted as string[]) {
        const slug = deletedPostPath.split('/').at(-1) as string;
        await deletePost(slug);
        res.revalidate(`/blog/post/${slug}`);
    }
    if (req.body.added.length + req.body.modified.length > 0) {
        // download, parse and update database with the new created/modified files, and revalidate next cache for each post
        const posts = await downloadAndParsePosts(createPostsFilter(req.body as RevalidateReqStructure));
        for (const file of posts) {
            const post = await upsertPost(file);
            //update cache
            res.revalidate(`/blog/post/${post.slug}`)
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
            }
        }
    }
    res.end();
}
export default handler;