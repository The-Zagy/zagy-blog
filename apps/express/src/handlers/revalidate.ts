import * as path from 'path';
import { NextFunction, Request, Response } from "express";
import { Githubfile } from '@acme/utils';
import { upsertPost, upsertCategoryToPost, upsertUserToPost, postsCount, PrismaClient } from "@acme/db";
import { downloadAndParsePosts } from '@acme/mdx';
import axios from "axios";
const prisma = new PrismaClient();
const deletePost = async (slug: string) => {
    console.log('deleteddededededd', slug)
    await prisma.post.delete({
        where: {
            slug
        },
        include: {
            contributors: true,
            tags: true,
        }
    });
}
// function to call next app to revalidate pages to new data
async function callNextApp(filePath: string): Promise<void> {
    const url = process.env.NEXT_URL || 'http://localhost:3000/';
    await axios.post(url + 'api/revalidate/', {
        filePath
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.SEED_PASS || 'test',
        }
    });
}
const isContentBaseDir = (file: string) => {
    const dir = path.parse(file).dir;
    const isDirectory = path.basename(dir) === 'blog';
    return isDirectory;
};
interface RevalidateReqStructure {
    added: string[];
    deleted: string[];
    modified: string[];
    renamed: string[];
}
// function to create filter function for downloadAndParsePosts
const createPostsFilter = (body: RevalidateReqStructure) => {
    const hash: { [k: string]: boolean } = {};
    for (const file of body.added) {
        if (!isContentBaseDir(file)) {
            const dir = path.parse(file).dir;
            hash[dir] = true;
            continue;
        }
        hash[file] = true;
    }
    for (const file of body.modified) {
        if (!isContentBaseDir(file)) {
            const dir = path.parse(file).dir;
            hash[dir] = true;
            continue;
        }
        hash[file] = true;
    }
    for (const file of body.deleted) {
        if (!isContentBaseDir(file)) {
            if (path.parse(file).ext !== '.mdx') {
                const dir = path.parse(file).dir;
                hash[dir] = true;
            }
        }
    }
    for (const file of body.deleted) {
        if (!isContentBaseDir(file)) {
            if (path.parse(file).ext === '.mdx') {
                const dir = path.parse(file).dir;
                hash[dir] = false;
            }
        }
    }
    console.log('hash filter from the req body', hash);
    return (val: Githubfile): boolean => {
        return hash[val.path] || false;
    };
};
// todo next code to revalidate
const revalidateBlogHome = async () => {
    // todo change 12 to constant
    const pagesNumber = (await postsCount()) / 12;
    const pagePromise: Promise<void>[] = [];
    for (let i = 1; i <= pagesNumber; ++i) {
        pagePromise.push(callNextApp(`/blog/${i}`));
    }
    await Promise.all(pagePromise);
};

/**
 * how the re-validation will work
 * if new file created or file updated download and parse this file from github 
 * deleted file only delete it from the db
*/
// todo the handler is copy paste from seed main function so you can use the seed function here
const handler = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || !(typeof req.headers.authorization === 'string') || req.headers.authorization !== process.env.SEED_PASS) {
        return res.status(401).json({ message: "Invalid Token | Not authorized" });
    }
    console.log('req body', req.body, 'req body type', typeof req.body, 'req body added type', typeof req.body?.added);

    // TODO make the conversion safer because now there's no checking for the body at all, and when this part throw the server crash
    for (const k in req.body) {
        // eslint-disable-next-line
        req.body[k] = JSON.parse(req.body[k]);
    }

    // remove deleted files from database and revalidate next.js cache
    for (const deletedPostPath of req.body.deleted as string[]) {
        let slug!: string;
        if (isContentBaseDir(deletedPostPath)) {
            slug = path.parse(deletedPostPath).name;
        }
        else {
            const ext = path.parse(deletedPostPath).ext;
            if (ext === '.mdx') {
                slug = path.basename(path.parse(deletedPostPath).dir);
            }
        }
        try {
            if (slug) {
                await deletePost(slug);
                console.log("done deleting");
                await callNextApp(`/blog/post/${slug}`);
            }
        } catch (e) {
            next(e);
            return;
        }
    }

    try {
        if (req.body.added.length + req.body.modified.length + req.body.deleted.length > 0) {
            // download, parse and update database with the new created/modified files, and revalidate next cache for each post
            const rawMdx = await downloadAndParsePosts(createPostsFilter(req.body as RevalidateReqStructure));
            await Promise.all(rawMdx.map(async (file) => {
                const post = await upsertPost(file);
                //update cache
                // add each file already exist tags
                if (file.meta.categories) {
                    for (const tag of file.meta.categories) {
                        await upsertCategoryToPost(tag, post.slug);
                    }
                }
                // connect posts with autohrs and contributors
                if (file.meta.contributers) {
                    // create author
                    await upsertUserToPost(file.meta.contributers, post.slug);
                }
                await callNextApp(`/blog/post/${post.slug}`);
            }));
        }
        try {
            await revalidateBlogHome();
        } catch (e) {
            next(e);
            return;
        }
        res.status(201).send('done elegantly');
    } catch (e) {
        next(e);
        return;
    }

};
export default handler;