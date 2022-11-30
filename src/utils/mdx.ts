import { Octokit as createOctokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';
import { bundleMDX } from 'mdx-bundler';
import { PluggableList } from 'unified';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm'
import path from 'path';
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import { env } from '../env/server.mjs';
import { AsyncReturnType } from './ts-bs';

import { NUMBER_OF_POSTS_IN_A_PAGE } from '../env/constants';

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
        categories?: string[],
        githubPath: string,
        meta: {
            keywords: string[],
        }
        contributers: AsyncReturnType<typeof getContributers>
    }
}

const remarkPlugins: PluggableList = [remarkGfm];
const rehypePlugins: PluggableList = [slug, toc, rehypePrism]
const downloadAndParsePosts = async () => {
    const dir = await downloadDirList("/content/blog");
    const actualPosts = await Promise.all(dir.map(async (file) => downloadFileBySha(file.sha)));
    const posts = Promise.all(actualPosts.map(async (post, i) => {
        const contributers = await getContributers(dir[i]?.path as string);
        const { code, frontmatter } = await bundleMDX({
            source: post,
            mdxOptions(options) {
                options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins];
                options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins]
                return options;
            }
        });
        return (
            {
                code,
                meta: {
                    ...frontmatter,
                    slug: path.parse(dir[i]?.name as string).name,
                    contributers,
                    githubPath: dir[i]?.path
                }
            }
        )

    })) as Promise<Post[]>;

    return (await posts).sort((a, b) => {
        const dateA = new Date(a.meta.date);
        const dateB = new Date(b.meta.date);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
    });
}

class Cache {
    private githubFiles: Post[];
    private ranFirstTime: boolean;
    private tags: string[];
    private static _instance: Cache;
    constructor() {
        this.githubFiles = [];
        this.ranFirstTime = false;
        this.tags = [];
    }
    // switch all logic of getting posts to this class only to keep crud based interface
    private async initCache() {
        // const ONE_HOUR = 1000 * 60 * 60;
        if (this.ranFirstTime === false && this.githubFiles.length === 0) {
            this.ranFirstTime = true;
            console.log("first fetc --------------------------- (miss)")
            // init posts
            this.githubFiles = await downloadAndParsePosts();
            // init tags
            const tagsTemp = new Set<string>;
            for (const post of this.githubFiles) {
                if (post.meta.categories === undefined) continue;
                for (const tag of post.meta.categories) 
                tagsTemp.add(tag);
            }
            this.tags = Array.from(tagsTemp);
            console.log('im out');
        }
        return ;
    }
    public async getCount() {
        await this.initCache();
        return this.githubFiles.length;
    }
    public async updatePosts(...slugs: string[]) {
        //We can later update this to only update if a signal has been recieved that the repo was updated;

    }
    public async getPost(id: string): Promise<Post> {
        // constructor can't be async, and function get posts already check if it's the first run so only get posts in each crud to not fail in first hit
        await this.initCache();
        // console.log('length', this.githubFiles.length)
        const target = this.githubFiles.find((i) => {
            if (i.meta.slug === id) return i;
        })
        // console.log(target, typeof target);
        //TODO why in prod always throwing this error
        if (typeof target === "undefined") {
            throw new Error("Page isn't found")
        }
        // console.log('return from getPost')
        return target;
    }

    public async getPostsByTag(...tags: string[]): Promise<Post[]> {
        await this.initCache();
        return this.githubFiles.filter((post) => {
            for (const tag of tags) {
                if (post.meta.categories?.findIndex(item => tag.toLowerCase() === item.toLowerCase()) !== -1) return true;
            }
            return false;
        })
    }
    public async getPostsByPage(pageNum: number): Promise<Post[]> {
        await this.initCache();
        const take = NUMBER_OF_POSTS_IN_A_PAGE;
        const skip = pageNum * NUMBER_OF_POSTS_IN_A_PAGE;
        return this.githubFiles.slice(skip, skip + take);
    }
    public async getTags(): Promise<string[]> {
        await this.initCache();
        return this.tags;
    }
    public async getPosts() {
        await this.initCache();
        return this.githubFiles;
    }
    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new Cache();
        return this._instance;
    }
}
export default Cache;