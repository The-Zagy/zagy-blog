import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
// import cache from '../../utils/cache';
// import { NUMBER_OF_POSTS_IN_A_PAGE } from "../../env/constants";

import { main } from "../../../prisma/seed";
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await main();
    } catch (e) {
        console.log(e);
    }
    res.end();
}
export default handler;