import { Octokit as createOctokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';

import path from 'path';
import { AsyncReturnType } from './ts-bs.js';

//Setup octakit with throttling plugin as recommended in the octakit documentation
export type PostContributors = AsyncReturnType<typeof getContributers>;

export type ParsedPost = {
    code: string
    meta: {
        title: string,
        description: string,
        readingTime: string,
        date: string,
        slug: string,
        bannerUrl: string,
        categories?: string[],
        githubPath: string,
        meta: {
            keywords: string[],
        }
        contributers: PostContributors
    }
}

const Octokit = createOctokit.plugin(throttling)
type ThrottleOptions = {
    method: string
    url: string
    request: { retryCount: number }
}
const octokit = new Octokit({
    auth: process.env.BOT_GITHUB_TOKEN,
    throttle: {
        onRateLimit: (retryAfter: number, options: ThrottleOptions) => {
            console.warn(
                `Request quota exhausted for request ${options.method} ${options.url}. Retrying after ${retryAfter} seconds.`,
            )

            return true
        },
        onAbuseLimit: (retryAfter: number, options: ThrottleOptions) => {
            // does not retry, only logs a warning
            octokit.log.warn(
                `Abuse detected for request ${options.method} ${options.url}`,
            )
        },
    },
})
export async function getContributers(path: string) {
    try {
        const commits = await octokit.repos.listCommits({
            owner: "The-Zagy",
            repo: "zagy-blog",
            path: path,
            sha: "main"
        })
        if (!commits.data || !commits.data[0]) throw new Error("Something wrong happend")
        const author = commits.data[0].author;
        const restOfContributers = commits.data.slice(1, commits.data.length).map((i) => ({ login: i.author?.login, avatar_url: i.author?.avatar_url, id: i.author?.id })).filter((val, i, arr) => { return !arr.find((i) => i.id === val.id) });
        return {
            author: {
                login: author?.login,
                avatar_url: author?.avatar_url,
                id: author?.id
            }, restOfContributers
        }
    }
    catch (err) {
    }
}

/**
 * 
 * @param path the folder relative path (relative to root of the repository) 
 * @returns an array of the files metadata in the specified path directory
 */

export async function downloadFolderMetaData(path: string) {
    const resp = await octokit.repos.getContent({
        owner: 'The-Zagy',
        repo: 'zagy-blog',
        path,
        ref: "main"
    })
    const data = resp.data

    if (!Array.isArray(data)) {
        throw new Error(
            `Tried to download content from ${path}. GitHub did not return an array of files. This should never happen...`,
        )
    }

    return data
}
/**
 * 
 * @param login user handle
 * @returns object containing info about the user
 */
export async function downloadGithubUser(login: string) {
    return (await octokit.rest.users.getByUsername({ username: login })).data;
}
export type GithubUser = AsyncReturnType<typeof downloadGithubUser>
/**
 * 
 * @param sha 
 * @returns the actual content of the file returned as a string
 */
export type FileContributors = AsyncReturnType<typeof getContributers>;
export async function downloadFileBySha(sha: string) {
    const { data } = await octokit.git.getBlob({
        owner: 'The-Zagy',
        repo: 'zagy-blog',
        file_sha: sha,
    })
    const encoding = data.encoding as Parameters<typeof Buffer.from>['1']
    return Buffer.from(data.content, encoding).toString()
}

export type RawMDX = {
    mdxFile: string,
    files?: { [k: string]: string },
    contributors: FileContributors,
    githubPath: string,
    slug: string
}
/**
 * 
 * @param fileOrDirectory (The file metadata provided from github)
 * @returns object containing the text content of the mdx file along with an object containing the other jsx/tsx/js files or null
 */
export async function downloadFileOrDirectory(fileOrDirectory: Githubfile): Promise<RawMDX | null> {
    if (fileOrDirectory.type === "file") {
        return {
            mdxFile: await downloadFileBySha(fileOrDirectory.sha),
            contributors: await getContributers(fileOrDirectory.path),
            githubPath: fileOrDirectory.path,
            slug: path.parse(fileOrDirectory.path.split("/").pop() as string).name,
        }
    }
    else if (fileOrDirectory.type === "dir") {
        const directoryContent = await downloadFolderMetaData(fileOrDirectory.path);
        const mdxFileIndex = directoryContent.findIndex(i => path.extname(i.path) === '.mdx');
        if (mdxFileIndex === -1) throw new Error(`Couldn't find an mdx file in the directory ${fileOrDirectory.path}`);
        const mdxFile = directoryContent.splice(mdxFileIndex, 1).pop();
        if (mdxFile === undefined) throw new Error(`Couldn't find an mdx file in the directory ${fileOrDirectory.path}`);
        const mdxFileContent = await downloadFileBySha(mdxFile.sha);
        const files = await Promise.all(directoryContent.map(async (file) => {
            return {
                ["./" + file.name]: await downloadFileBySha(file.sha)
            }
        }))
        return {
            mdxFile: mdxFileContent,
            contributors: await getContributers(fileOrDirectory.path),
            githubPath: fileOrDirectory.path,
            slug: path.parse(fileOrDirectory.path.split("/").pop() as string).name,
            files: files.reduce((acc, cur) => {
                return ({ ...acc, ...cur })
            }, {})
        }
    }
    else {
        return null
    }
}
export type Githubfile = AsyncReturnType<typeof downloadFolderMetaData>[0]
