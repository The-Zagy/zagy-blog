import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import GitHubFilesCache from '../../utils/mdx';
import { NUMBER_OF_POSTS_IN_A_PAGE } from "../../env/constants";

// TODO DADDY PLEASE USE JWT
const verifyToken = async (token: string): Promise<boolean> => {
    return true;
} 
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.secret ||!(typeof req.query.secret === 'string')|| !await verifyToken(req.query.secret)) {
        return res.status(401).json({message:"Invalid Token | Not authorized"});
    }
    if(!req.query.slug){
        return res.status(400).json({messege:"A slug must be supplied"})
    }

    try {
        await GitHubFilesCache.updatePosts();
        const githubFiles = await GitHubFilesCache.getPosts();
        const fileIndex = githubFiles.findIndex((i=>i.meta.slug===req.query.slug));
        const isNewlyCreated = fileIndex===githubFiles.length-1?true:false;
        if(!isNewlyCreated){
            res.revalidate(`/blog/post/${githubFiles[fileIndex]?.meta.slug}`);
        }
        //update the posts page
        const pageNumber = Math.floor(fileIndex/NUMBER_OF_POSTS_IN_A_PAGE+1)+1;
         res.revalidate(`/blog/${pageNumber}`);   
         return res.status(200).json({messege:`update post ${githubFiles[fileIndex]?.meta.slug} and page number ${pageNumber}`});
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'error happend unknown'});
    }
} 
export default handler;
