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

    })) as Promise<Post[]>;
    
    return (await posts).sort((a,b)=>{
        const dateA = new Date(a.meta.date);
        const dateB = new Date(b.meta.date);
        if(dateA<dateB)return 1;
        if(dateA>dateB)return -1;
        return 0;
    }) ;
}

class GithubFilesCache {
    private githubFiles: Post[];
    private ranFirstTime: boolean;
    constructor() {
        this.githubFiles = [];
        this.ranFirstTime = false;
    }
    // switch all logic of getting posts to this class only to keep crud based interface
    public async getPosts() {
        const ONE_HOUR = 1000 * 60 * 60;
        if (this.ranFirstTime === false) {
            console.log("first fetc --------------------------- (miss)")
            this.githubFiles = await downloadAndParsePosts();
            this.ranFirstTime = true;
            //! we don't update with intervals anymore instead update ondemand from webhook
            // setInterval(() => {
            //     this.updatePosts();
            // }, ONE_HOUR)
        }
        return this.githubFiles;
    }
    public async getCount() {
        const posts = await this.getPosts();
        return posts.length;
    }
    public async updatePosts() {
        //We can later update this to only update if a signal has been recieved that the repo was updated;
        console.log("updated")
        this.githubFiles = await downloadAndParsePosts();
    }
    public async getPost(id: string): Promise<Post> {
        // console.log(`first run? ${this.ranFirstTime}`);
        // constructor can't be async, and function get posts already check if it's the first run so only get posts in each crud to not fall in first hit
        await this.getPosts();
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
        console.log(tags, typeof tags);
        await this.getPosts();
        return this.githubFiles.filter((post, i ) => {
            for (const tag of tags) {
                if (post.meta.categories?.includes(tag)) return true;
            }
            return false;
        })
    }
}
export default new GithubFilesCache();