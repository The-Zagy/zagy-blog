import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import path from 'path';
import { NUMBER_OF_POSTS_IN_A_PAGE } from "../../env/constants";
import { Githubfile, downloadAndParsePosts, } from "../../utils/mdx";
import { upsertPost, upsertCategoryToPost, upsertUserToPost, deletePost, postsCount } from "../../utils/db";
const isContentBaseDir = (file:string) => {
    const dir = path.parse(file).dir;
    const isDirectory = path.basename(dir) === 'blog';
    return isDirectory;
}
interface RevalidateReqStructure  {
    added: string[];
    deleted: string[];
    modified: string[];
    renamed: string[];
}
// function to create filter function for downloadAndParsePosts
const createPostsFilter = (body: RevalidateReqStructure) => {
    const hash: {[k: string]: boolean} = {};
    for (const file of body.added) {
        if(!isContentBaseDir(file)){
            const dir = path.parse(file).dir;
            hash[dir] = true;
            continue;
        }
        hash[file]= true;
    }
    for (const file of body.modified) {
        if(!isContentBaseDir(file)){
            const dir = path.parse(file).dir;
            hash[dir] = true;
            continue;
        }
        hash[file]= true;
    }
    for (const file of body.deleted) {
        if(!isContentBaseDir(file)){
            if (path.parse(file).ext !== '.mdx') {
                const dir = path.parse(file).dir;
                hash[dir] = true;
            }
        }
    }
    for (const file of body.deleted) {
        if(!isContentBaseDir(file)){
            if (path.parse(file).ext === '.mdx') {
                const dir = path.parse(file).dir;
                hash[dir] = false;
            }
        }
    }
    console.log('hash filter from the req body', hash)
    return (val: Githubfile): boolean => {
        return hash[val.path] || false ;
    }
}
const revalidateBlogHome = async (res: NextApiResponse) => {
    const pagesNumber = (await postsCount()) / NUMBER_OF_POSTS_IN_A_PAGE;
    for (let i = 1; i <= pagesNumber; ++i) {
        await res.revalidate(`/blog/${i}`);
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
    if (!req.headers.authorization || !(typeof req.headers.authorization === 'string') || req.headers.authorization !== process.env.SEED_PASS) {
        return res.status(401).json({ message: "Invalid Token | Not authorized" });
    }
    console.log('req body', req.body,'req body type', typeof req.body , 'req body added type', typeof req.body?.added);
    for (const k in req.body) {
        req.body[k] = JSON.parse(req.body[k]);
    }
    res.status(201).send('done elegantly');
    // remove deleted files from database and revalidate next.js cache
    
    for (const deletedPostPath of req.body.deleted as string[]) {
        let slug!: string;
        if(isContentBaseDir(deletedPostPath) ){
            slug = path.parse(deletedPostPath).name;
        }
        else{
            const ext = path.parse(deletedPostPath).ext;
            if (ext === '.mdx') {
                slug = path.basename(path.parse(deletedPostPath).dir);
            }
        }
        
        if(slug){
            await deletePost(slug);
            await res.revalidate(`/blog/post/${slug}`);
        }
    }

    if (req.body.added.length + req.body.modified.length + req.body.deleted.length > 0) {
        // download, parse and update database with the new created/modified files, and revalidate next cache for each post
        const posts = await downloadAndParsePosts(createPostsFilter(req.body as RevalidateReqStructure));
        for (const file of posts) {
            const post = await upsertPost(file);
            //update cache
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
            await res.revalidate(`/blog/post/${post.slug}`)
        }
    }
    await revalidateBlogHome(res);
}
export default handler;