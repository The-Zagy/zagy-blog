import { NextApiHandler } from "next";
import githubCache from '../../utils/mdx'
// THIS API POINT IS TEMP WILL BE CONVERTED TO TRPC ROUTE
const handler: NextApiHandler = async (req, res) => {
    res.json({data: await githubCache.getTags()});
}
export default handler;
