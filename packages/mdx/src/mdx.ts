
import { bundleMDX } from 'mdx-bundler';
import { PluggableList } from 'unified';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm'
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import { RawMDX, downloadFolderMetaData, downloadFileOrDirectory, type ParsedPost, Githubfile } from '@acme/utils';
import calculateReadingTime from 'reading-time';
import path from 'path';
import { readFile, readdir } from 'fs/promises';

const remarkPlugins: PluggableList = [remarkGfm];
const rehypePlugins: PluggableList = [slug, toc, rehypePrism]
export const parsePost = async (source: RawMDX) => {
    //todo add reading time row in database
    const readingTime = calculateReadingTime(source.mdxFile);
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
                readingTime: readingTime.text,
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
        filter = (_) => true;
    }
    if (process.env.APP_ENV === "development") {
        const files = [];
        const dirs = [];
        const rawmdx: RawMDX[] = [];
        const paths: string[] = [];
        console.log(path.resolve());
        const contentPath = path.resolve(path.resolve(), "../../content/blog");
        console.log(contentPath, "---------------------------")
        const filesAndDirs = await readdir(contentPath);
        for (const dirOrFile of filesAndDirs) {
            if (path.extname(dirOrFile) === "") dirs.push(dirOrFile);
            else files.push(dirOrFile);
        }
        for (const file of files) {
            const pathTemp = path.resolve(contentPath, file)
            paths.push(pathTemp)
            rawmdx.push({
                mdxFile: await readFile(pathTemp, { encoding: "utf-8" }),
                githubPath: pathTemp,
                slug: path.parse(pathTemp).name,
                contributors: {
                    author: {
                        avatar_url: "https://avatars.githubusercontent.com/u/61756360?v=4",
                        login: "sandstone991",
                        id: 61756360
                    },
                    restOfContributers: []
                }
            })
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
                githubPath: pathTemp,
                slug: path.parse(pathTemp).name,
                contributors: {
                    author: {
                        avatar_url: "https://avatars.githubusercontent.com/u/61756360?v=4",
                        login: "sandstone991",
                        id: 61756360
                    },
                    restOfContributers: []
                },
                files: files.reduce((acc, cur) => {
                    return ({ ...acc, ...cur })
                }, {})
            })
        }

        const posts = await Promise.all(rawmdx.map(async (source, i) => await parsePost(source))) as ParsedPost[];
        console.dir(posts, { depth: 5 })
        return (posts).sort((a, b) => {
            const dateA = new Date(a.meta.date);
            const dateB = new Date(b.meta.date);
            if (dateA < dateB) return 1;
            if (dateA > dateB) return -1;
            return 0;
        });
    }

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
