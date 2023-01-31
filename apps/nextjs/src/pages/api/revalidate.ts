import { NextApiHandler, } from "next";
const handler: NextApiHandler = async (req, res) => {
    if (req.headers.authorization !== process.env.SEED_PASS) {
        throw new Error('no or wrong password');
    }
    if (req.body && req.body.filePath) {
        console.dir('revalidate req body', req.body);
        await res.revalidate(req.body.filePath);
    }
    else {
        throw new Error("Body wasn't provided with correct data")
    }
    res.end();
}
export default handler;