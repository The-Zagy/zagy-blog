import { NextFunction, Request, Response } from "express";
import { seed } from "../utils/seed.js";
async function handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (req.body.password !== process.env.SEED_PASS) {
            throw new Error('no or wrong seed password');
        }
        await seed();
        res.end();
    } catch (e) {
        console.error(e);
        next(e);
    }
}
export default handler;