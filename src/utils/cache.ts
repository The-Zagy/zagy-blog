
import { NUMBER_OF_POSTS_IN_A_PAGE } from '../env/constants';
import { downloadDirList, downloadFileBySha } from './github';
import { downloadAndParsePosts, Githubfile, parsePost, Post } from './mdx';

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
        return;
    }
    public async getCount() {
        await this.initCache();
        return this.githubFiles.length;
    }
    public async updatePosts(...postPaths: string[]) {
        await this.initCache()
        const dir = await downloadDirList("/content/blog")
        //find post in current cache;
        //download new post with octakit from github;
        for (const path of postPaths) {
            const index = this.githubFiles.findIndex((i) => i.meta.githubPath === path);
            const target = dir.find((i) => i.path === path);
            const file = await downloadFileBySha(target?.sha as string);
            const post = await parsePost(file, target as Githubfile);
            if (index === -1) {
                this.githubFiles.push(post as Post);
                continue;
            }
            this.githubFiles[index] = post as Post;
        }

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
export default Cache.getInstance();