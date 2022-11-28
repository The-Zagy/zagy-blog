import { NextApiHandler } from "next";
import githubCache from '../../utils/mdx'
const handler: NextApiHandler = async (req, res) => {
    const tags = req.body.tags;
    if (!tags) {
        return res.status(400).json({messege: "must supply tags array"});
    }
    console.log('tags', tags);
    const data = await githubCache.getPostsByTag(...tags);
    console.log(data);
    res.json({data});
}
export default handler;
