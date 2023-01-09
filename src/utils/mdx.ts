
import { bundleMDX } from 'mdx-bundler';
import { PluggableList } from 'unified';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm'
import path from 'path';
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import { AsyncReturnType } from './ts-bs';
import { RawMDX, downloadDirList, downloadFileBySha, downloadFileOrDirectory, getContributers } from './github';
import { env } from '../env/server.mjs';
import { readFile, readdir } from 'fs/promises';

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
export const parsePost = async (source: RawMDX, githubMeta: Githubfile) => {
    //todo contributers to files in directories
    const contributers = await getContributers(githubMeta?.path as string);
    const { code, frontmatter } = await bundleMDX({
        source: source.mdxFile,
        files: source.files,
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
                slug: path.parse(githubMeta?.path.split("/").pop() as string).name,
                contributers,
                githubPath: githubMeta?.path
            }
        }
    )

}
export const downloadAndParsePosts = async () => {
    if (env.NODE_ENV === "test") {
        const files = [];
        const dirs = [];
        const rawmdx: RawMDX[] = [];
        const paths: string[] = [];
        const contentPath = path.resolve(__dirname, "../../../../content/blog")
        const filesAndDirs = await readdir(contentPath);
        for (const dirOrFile of filesAndDirs) {
            if (path.extname(dirOrFile) === "") dirs.push(dirOrFile);
            else files.push(dirOrFile);
        }
        for (const file of files) {
            const pathTemp = path.resolve(contentPath, file)
            paths.push(pathTemp)
            rawmdx.push({ mdxFile: await readFile(pathTemp, { encoding: "utf-8" }) })
        }
        for (const dir of dirs) {
            const pathTemp = path.resolve(contentPath, dir);
            paths.push(pathTemp);
            const dirContent = await readdir(pathTemp);

            const mdxFileIndex = dirContent.findIndex((i => path.extname(i) === ".mdx"));
            if (mdxFileIndex === -1) throw new Error("I don't know 1");
            const mdxFile = dirContent.splice(mdxFileIndex, 1).pop();
            if (mdxFile === undefined) throw new Error("I don't know 2");
            const mdxFileContent = await readFile(path.resolve(contentPath, dir, mdxFile), { encoding: "utf-8" });
            const files = await Promise.all(dirContent.map(async (i) => ({
                [i]: await readFile(path.resolve(contentPath, dir, i), { encoding: "utf-8" })
            })))
            console.log(files);
            rawmdx.push({
                mdxFile: mdxFileContent,
                files: files.reduce((acc, cur) => {
                    return ({ ...acc, ...cur })
                }, {})
            })
        }

        const posts = await Promise.all(rawmdx.map(async (source, i) => await parsePost(source, { path: paths[i], name: "blog" } as Githubfile))) as Post[];
        console.dir(posts, { depth: 5 })
        return (posts).sort((a, b) => {
            const dateA = new Date(a.meta.date);
            const dateB = new Date(b.meta.date);
            if (dateA < dateB) return 1;
            if (dateA > dateB) return -1;
            return 0;
        });
    }

    else {
        const dir = await downloadDirList("/content/blog");
        const filesAndDirs = (await Promise.all(dir.map(async (file) => downloadFileOrDirectory(file))))
            .filter((i): i is RawMDX => i !== null);
        console.dir(filesAndDirs, { depth: 5 })
        const posts = Promise.all(filesAndDirs.map(async (source, i) => await parsePost(source, dir[i] as Githubfile))) as Promise<Post[]>;
        console.dir(await posts, { depth: 5 })
        return (await posts).sort((a, b) => {
            const dateA = new Date(a.meta.date);
            const dateB = new Date(b.meta.date);
            if (dateA < dateB) return 1;
            if (dateA > dateB) return -1;
            return 0;
        });
    }
}
