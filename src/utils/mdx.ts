
import { bundleMDX } from 'mdx-bundler';
import { PluggableList } from 'unified';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm'
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import { AsyncReturnType } from './ts-bs';
import { RawMDX, downloadFolderMetaData, downloadFileBySha, downloadFileOrDirectory, getContributers } from './github';
import calculateReadingTime from 'reading-time';

export type Githubfile = AsyncReturnType<typeof downloadFolderMetaData>[0]
export type PostContributors = AsyncReturnType<typeof getContributers>; 
export type ParsedPost = {
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
        contributers: PostContributors
    }
}

const remarkPlugins: PluggableList = [remarkGfm];
const rehypePlugins: PluggableList = [slug, toc, rehypePrism]
export const parsePost = async (source: RawMDX) => {
    //todo add reading time row in database
    // const readingTime = calculateReadingTime(source.mdxFile);
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
                slug: source.slug,
                contributers: source.contributors,
                githubPath: source.githubPath
            }
        }
    )

}
export const downloadAndParsePosts = async (filter?: (val: Githubfile) => boolean) => {
    // if no filter function provided assume user want all folder content
    if (filter === undefined) {
        filter = (val) => true;
    }
    // if (env.NODE_ENV === "test") {
    //     const files = [];
    //     const dirs = [];
    //     const rawmdx: RawMDX[] = [];
    //     const paths: string[] = [];
    //     const contentPath = path.resolve(__dirname, "../../../../content/blog")
    //     const filesAndDirs = await readdir(contentPath);
    //     for (const dirOrFile of filesAndDirs) {
    //         if (path.extname(dirOrFile) === "") dirs.push(dirOrFile);
    //         else files.push(dirOrFile);
    //     }
    //     for (const file of files) {
    //         const pathTemp = path.resolve(contentPath, file)
    //         paths.push(pathTemp)
    //         rawmdx.push({ mdxFile: await readFile(pathTemp, { encoding: "utf-8" }) })
    //     }
    //     for (const dir of dirs) {
    //         const pathTemp = path.resolve(contentPath, dir);
    //         paths.push(pathTemp);
    //         const dirContent = await readdir(pathTemp);

    //         const mdxFileIndex = dirContent.findIndex((i => path.extname(i) === ".mdx"));
    //         if (mdxFileIndex === -1) throw new Error("I don't know 1");
    //         const mdxFile = dirContent.splice(mdxFileIndex, 1).pop();
    //         if (mdxFile === undefined) throw new Error("I don't know 2");
    //         const mdxFileContent = await readFile(path.resolve(contentPath, dir, mdxFile), { encoding: "utf-8" });
    //         const files = await Promise.all(dirContent.map(async (i) => ({
    //             [i]: await readFile(path.resolve(contentPath, dir, i), { encoding: "utf-8" })
    //         })))
    //         console.log(files);
    //         rawmdx.push({
    //             mdxFile: mdxFileContent,
    //             files: files.reduce((acc, cur) => {
    //                 return ({ ...acc, ...cur })
    //             }, {})
    //         })
    //     }

    //     const posts = await Promise.all(rawmdx.map(async (source, i) => await parsePost(source, { path: paths[i], name: "blog" } as Githubfile))) as Post[];
    //     console.dir(posts, { depth: 5 })
    //     return (posts).sort((a, b) => {
    //         const dateA = new Date(a.meta.date);
    //         const dateB = new Date(b.meta.date);
    //         if (dateA < dateB) return 1;
    //         if (dateA > dateB) return -1;
    //         return 0;
    //     });
    // }

    const dir = await downloadFolderMetaData("/content/blog");
    const filesAndDirs = (await Promise.all(dir.filter(filter).map(async (file) => downloadFileOrDirectory(file))))
        .filter((i): i is RawMDX => i !== null);
    console.dir(filesAndDirs, { depth: 5 })
    const posts = Promise.all(filesAndDirs.map(async (source) => await parsePost(source))) as Promise<ParsedPost[]>;
    console.dir(await posts, { depth: 5 })
    return (await posts).sort((a, b) => {
        const dateA = new Date(a.meta.date);
        const dateB = new Date(b.meta.date);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
    });
}
