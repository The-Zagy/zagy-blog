
import { bundleMDX } from 'mdx-bundler';
import { PluggableList } from 'unified';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm'
import path from 'path';
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import { AsyncReturnType } from './ts-bs';

import { downloadDirList, downloadFileBySha, getContributers } from './github';

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
export const parsePost = async (source: string, githubMeta: Githubfile) => {
    const contributers = await getContributers(githubMeta?.path as string);
    const { code, frontmatter } = await bundleMDX({
        source: source,
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
                slug: path.parse(githubMeta?.name as string).name,
                contributers,
                githubPath: githubMeta?.path
            }
        }
    )

}
export const downloadAndParsePosts = async () => {
    const dir = await downloadDirList("/content/blog");
    const actualPosts = await Promise.all(dir.map(async (file) => downloadFileBySha(file.sha)));
    const posts = Promise.all(actualPosts.map(async (source, i) => await parsePost(source, dir[i] as Githubfile))) as Promise<Post[]>;
    return (await posts).sort((a, b) => {
        const dateA = new Date(a.meta.date);
        const dateB = new Date(b.meta.date);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
    });
}
