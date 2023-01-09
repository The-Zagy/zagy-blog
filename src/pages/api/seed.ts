import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import { main } from "../../../prisma/seed";
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.body.password !== process.env.SEED_PASS) 
            throw new Error('bitch go fuck yourself');
        await main();
    } catch (e) {
        console.log('bitch tried to hack us', e);
    }
    res.end();
}
export default handler;