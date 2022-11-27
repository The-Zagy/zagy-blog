import { Octokit as createOctokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';
import { env } from '../env/server.mjs';
import { AsyncReturnType } from './ts-bs';

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
const contentDirCache: {
    dirList: Githubfile[] | Promise<Githubfile[]>,
    getDirList: () => Githubfile[] | Promise<Githubfile[]>
    ranFirstTime: boolean,
    updateDirList: () => void
} = {
    dirList: [],
    ranFirstTime: false,
    getDirList() {
        const ONE_HOUR = 1000 * 60 * 60;
        if (this.ranFirstTime === false) {
            this.ranFirstTime = true;
            this.updateDirList()
            setInterval(() => {
                this.updateDirList();
            }, ONE_HOUR)
        }
        return this.dirList;
    },
    updateDirList() {
        console.log("UPDATED GITHUB DIRECTORY")
        this.dirList = downloadDirList("/src/content/blog");
    }
}

export { contentDirCache }
