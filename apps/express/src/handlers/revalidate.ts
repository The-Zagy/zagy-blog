import * as path from "path";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { NUMBER_OF_POSTS_IN_A_PAGE } from "@acme/constants";
import {
    PrismaClient,
    postsCount,
    upsertCategoryToPost,
    upsertPost,
    upsertUserToPost,
} from "@acme/db";
import { downloadAndParsePosts } from "@acme/mdx";
import { Githubfile } from "@acme/utils";

const prisma = new PrismaClient();

const deletePost = async (slug: string) => {
    await prisma.post.delete({
        where: {
            slug,
        },
        include: {
            contributors: true,
            tags: true,
        },
    });
    console.log(`deleted ${slug}`);
};

// function to call next app to revalidate pages to new data
async function revalidateNextPage(filePath: string): Promise<void> {
    const url = process.env.NEXT_URL || "http://localhost:3000/";
    await axios.post(
        url + "api/revalidate/",
        {
            filePath,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.SEED_PASS,
            },
        },
    );
}

const isInContentBaseDir = (file: string) => {
    const dir = path.parse(file).dir;
    const isDirectory = path.basename(dir) === "blog";
    return isDirectory;
};

interface RevalidateReqStructure {
    added: string[];
    deleted: string[];
    modified: string[];
    renamed: string[];
}

type GithubDownloadFilter = (val: Githubfile) => boolean;
type Dict<T> = { [k: string]: T };
/**
 * return two filters one that decides what to download from github the other is to decide what should be deleted from the database
 * @param body the request body of type RevalidateReqStructure)
 * @returns
 */
export const createPostsFilter = (
    body: RevalidateReqStructure,
): {
    downloadFilterFunction: GithubDownloadFilter;
    deleteFilter: string[];
    downloadFilter: Dict<0 | 1>;
} => {
    const downloadFilter: Dict<1 | 0> = {};
    const deleteFilter: string[] = [];

    // handle added array
    for (const file of body.added) {
        if (!isInContentBaseDir(file)) {
            const dir = path.parse(file).dir;
            downloadFilter[dir] = 1;
        } else {
            downloadFilter[file] = 1;
        }
    }

    // handle modified array
    for (const file of body.modified) {
        if (!isInContentBaseDir(file)) {
            const dir = path.parse(file).dir;
            downloadFilter[dir] = 1;
        } else {
            downloadFilter[file] = 1;
        }
    }

    // handle deleted array, if in base dir add it to the delete filter, or if the "index.mdx" is deleted else only add it to the filter and in this case means only component got deleted
    for (const file of body.deleted) {
        const fileParsed = path.parse(file);
        if (!isInContentBaseDir(file)) {
            const dir = fileParsed.dir;
            if (fileParsed.ext === ".mdx") {
                downloadFilter[dir] = 0;
                deleteFilter.push(path.parse(dir).name);
            } else {
                // not in the hash or in the hash but was equal 1 => 1 * 1 = 1 will be downloaded because it's not the mdx file
                // in the hash but equals 0[.mdx file was found] => 1 * 0 = 0 will not be downloaded as we already found the mdx file
                downloadFilter[dir] = downloadFilter[dir] === 0 ? 0 : 1;
            }
        } else {
            deleteFilter.push(fileParsed.name);
        }
    }

        console.log("🪵 file \"revalidate.ts\" ~  ~ token ~ downloadFilter = ", downloadFilter);
        console.log("🪵 file \"revalidate.ts\" ~  ~ token ~ deleteFilter = ", deleteFilter);

    return {
        downloadFilterFunction: (val) => {
            return downloadFilter[val.path] === 1 || false;
        },
        deleteFilter,
        downloadFilter,
    };
};

const revalidateBlogHome = async () => {
    const pagesNumber = Math.ceil(
        (await postsCount()) / NUMBER_OF_POSTS_IN_A_PAGE,
    );
    console.log("🪵 file \"revalidate.ts\" ~  line \"128\" ~ token ~ pagesNumber = ", pagesNumber);
    const pagesArr = [...Array(pagesNumber).keys()];
    console.log("🪵 file \"revalidate.ts\" ~  line \"131\" ~ token ~ pagesArr = ", pagesArr);
    await Promise.all(
        pagesArr.map((i) =>
            revalidateNextPage(`/blog/${i + 1}`)
        ),
    );
};

/**
 * how the re-validation will work
 * if new file created or file updated download and parse this file from github
 * deleted file only delete it from the db
 */
const handler = async (req: Request, res: Response, next: NextFunction) => {
    if (
        !req.headers.authorization ||
        !(typeof req.headers.authorization === "string") ||
        req.headers.authorization !== process.env.SEED_PASS
    ) {
        return res
            .status(401)
            .json({ message: "Invalid Token | Not authorized" });
    }
    if (
        !req.body.added ||
        typeof req.body.added !== "string" ||
        !req.body.modified ||
        typeof req.body.modified !== "string" ||
        !req.body.deleted ||
        typeof req.body.deleted !== "string" ||
        !req.body.renamed ||
        typeof req.body.renamed !== "string"
    ) {
        return res.status(400).json({
            message:
                'Invalid Request Body, body MUST contain "added" as string[] stringified, "modified" as string[] stringified, "deleted" as string[] stringified, "renamed" as string[] stringified',
        });
    }

    try {
        // TODO make the conversion safer because now there's no checking for the body at all, and when this part throw the server crash
        for (const k in req.body) {
            // eslint-disable-next-line
            req.body[k] = JSON.parse(req.body[k]);
        }

        const { deleteFilter, downloadFilterFunction } = createPostsFilter(
            req.body as RevalidateReqStructure,
        );

        // remove deleted files from database and revalidate next.js cache
        await Promise.all(deleteFilter.map((slug) => deletePost(slug)));
        await Promise.all(
            deleteFilter.map((slug) =>
                revalidateNextPage(`/blog/post/${slug}`),
            ),
        );

        // download, parse, update database with the new created/modified files, and revalidate next cache for each post
        const rawMdx = await downloadAndParsePosts(downloadFilterFunction);
        await Promise.all(
            rawMdx.map(async (file) => {
                const post = await upsertPost(file);
                // add each file already exist tags
                if (file.meta.categories) {
                    await Promise.all(
                        file.meta.categories.map((tag) =>
                            upsertCategoryToPost(tag, post.slug),
                        ),
                    );
                }
                // connect posts with autohrs and contributors
                if (file.meta.contributers) {
                    // create author
                    await upsertUserToPost(file.meta.contributers, post.slug);
                }
                await revalidateNextPage(`/blog/post/${post.slug}`);
            }),
        );
        await revalidateBlogHome();
        res.status(201).end();
    } catch (e) {
        next(e);
        return;
    }
};

export default handler;
