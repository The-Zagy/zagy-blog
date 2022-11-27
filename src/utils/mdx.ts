import { Octokit as createOctokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';
import { env } from '../env/server.mjs';
import { AsyncReturnType } from './ts-bs';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';

//Setup octakit with throttling plugin as recommended in the octakit documentation
const Octokit = createOctokit.plugin(throttling)
type ThrottleOptions = {
    method: string
    url: string
    request: { retryCount: number }
}
const octokit = new Octokit({
    auth: env.BOT_GITHUB_TOKEN,
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
            sha: "MDX"
        })
        if (!commits.data || !commits.data[0]) throw new Error("Something wrong happend")
        const author = commits.data[0].author;
        const restOfContributers = commits.data.slice(1, commits.data.length).map((i) => i.author);
        return { author, restOfContributers }
    }
    catch (err) {
    }
}
export async function downloadDirList(path: string) {
    const resp = await octokit.repos.getContent({
        owner: 'The-Zagy',
        repo: 'zagy-blog',
        path,
        ref: "MDX"
    })
    const data = resp.data

    if (!Array.isArray(data)) {
        throw new Error(
            `Tried to download content from ${path}. GitHub did not return an array of files. This should never happen...`,
        )
    }

    return data
}

export async function downloadFileBySha(sha: string) {
    const { data } = await octokit.git.getBlob({
        owner: 'The-Zagy',
        repo: 'zagy-blog',
        file_sha: sha,
    })
    const encoding = data.encoding as Parameters<typeof Buffer.from>['1']
    return Buffer.from(data.content, encoding).toString()
}
export type Githubfile = AsyncReturnType<typeof downloadDirList>[0]
export type Post = {
    code: string
    meta: {
        title: string,
        description: string,
        date: string,
        slug: string,
        bannerUrl: string,
        categories?: string[]
        meta: {
            keywords: string[],
        }
        contributers: AsyncReturnType<typeof getContributers>
    }
}
const downloadAndParsePosts = async () => {
    const dir = await downloadDirList("/src/content/blog");
    const actualPosts = await Promise.all(dir.map(async (file) => downloadFileBySha(file.sha)));
    const posts = Promise.all(actualPosts.map(async (post, i) => {
        const contributers = await getContributers(dir[i]?.path as string);
        const { code, frontmatter } = await bundleMDX({ source: post });
        return (
            {
                code,
                meta: {
                    ...frontmatter,
                    slug: path.parse(dir[i]?.name as string).name,
                    contributers
                }
            }
        )

    }));
    return posts as Promise<Post[]>;
}

class GithubFilesCache {
    private githubFiles: Post[];
    private ranFirstTime: boolean;
    constructor() {
        this.githubFiles = [];
        this.ranFirstTime = false;
    }
    public async getPosts() {
        const ONE_HOUR = 1000 * 60 * 60;
        if (this.ranFirstTime === false) {
            console.log("first fetc ---------------------------")
            this.ranFirstTime = true;
            this.githubFiles = await downloadAndParsePosts();
            setInterval(() => {
                this.updatePosts();
            }, ONE_HOUR)
        }
        return this.githubFiles;
    }
    public async getCount() {
        const posts = await this.getPosts();
        return posts.length;
    }
    private async updatePosts() {
        //We can later update this to only update if a signal has been recieved that the repo was updated;
        console.log("updated")
        this.githubFiles = await downloadAndParsePosts();
    }



}
export default new GithubFilesCache();