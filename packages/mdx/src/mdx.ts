
import { bundleMDX } from 'mdx-bundler';
import { PluggableList } from 'unified';
import remarkGfm from 'remark-gfm'
import codeHighlighter, { Options } from "remark-shiki-twoslash"
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import rehypeRaw from 'rehype-raw'
import { RawMDX, downloadFolderMetaData, downloadFileOrDirectory, type ParsedPost, Githubfile } from '@acme/utils';
import calculateReadingTime from 'reading-time';
import path from 'path';
import { nodeTypes } from "@mdx-js/mdx"
import { access, readFile, readdir } from 'fs/promises';
import betterRemarkEmbedder from "better-remark-embedder"

function handleEmbedderError({ url }: { url: string }) {
    return `<p>Error embedding <a href="${url}">${url}</a></p>.`
}

type GottenHTML = string | null
function handleEmbedderHtml(html: GottenHTML, info: any) {
    if (!html) return null

    const url = new URL(info.url)
    // matches youtu.be and youtube.com
    if (/youtu\.?be/.test(url.hostname)) {
        // this allows us to set youtube embeds to 100% width and the
        // height will be relative to that width with a good aspect ratio
        return makeEmbed(html, 'youtube')
    }
    if (url.hostname.includes('codesandbox.io')) {
        return makeEmbed(html, 'codesandbox', '80%')
    }
    return html
}

function makeEmbed(html: string, type: string, heightRatio = '56.25%') {
    return `
    <div class="embed-${type}" data-embed-type="${type}">
        ${html}
    </div>
  `
}

const remarkPlugins: PluggableList = [[betterRemarkEmbedder, {
    enableOembed: true,
    transformers: [],
    handleHTML: handleEmbedderHtml,
    handleError: handleEmbedderError
    //@ts-ignore
}], [codeHighlighter.default, { theme: "dark-plus" }], remarkGfm];
const rehypePlugins: PluggableList = [[rehypeRaw, { passThrough: nodeTypes }], slug, toc]
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

async function fileExists(path: string) {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}
const isDirectory = (dirOrFilePath: string) => {
    return path.extname(dirOrFilePath) === ""
}
const readlocalMdxFileOrDirectory = async (filePath: string) => {
    if (!(await fileExists(filePath))) throw new Error(`file or directory at ${filePath} does not exist`);
    try {
        if (isDirectory(filePath)) {
            const dirContent = await readdir(filePath);
            const mdxFileIndex = dirContent.findIndex((i => path.extname(i) === ".mdx"));
            if (mdxFileIndex === -1) throw new Error("I don't know 1");
            const mdxFile = dirContent.splice(mdxFileIndex, 1).pop();
            if (mdxFile === undefined) throw new Error("I don't know 2");
            const mdxFileContent = await readFile(path.resolve(filePath, mdxFile), { encoding: "utf-8" });
            const files = await Promise.all(dirContent.map(async (i) => ({
                [i]: await readFile(path.resolve(filePath, i), { encoding: "utf-8" })
            })))
            return ({
                mdxFile: mdxFileContent,
                githubPath: filePath,
                slug: path.parse(filePath).name,
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
        } else {

            return ({
                mdxFile: await readFile(filePath, { encoding: "utf-8" }),
                githubPath: filePath,
                slug: path.parse(filePath).name,
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
    } catch (err) {
        throw err as Error;
    }
}
const readLocalMdxFiles = async () => {
    const contentPath = path.resolve(path.resolve(), "../../content/blog");
    const promises: Promise<RawMDX>[] = []
    const filesAndDirs = await readdir(contentPath);
    for (const fileOrDir of filesAndDirs) {
        const pathTemp = path.resolve(contentPath, fileOrDir);
        promises.push(readlocalMdxFileOrDirectory(pathTemp));
    }
    return await Promise.all(promises);
}
export const downloadAndParsePosts = async (filter?: (val: Githubfile) => boolean) => {
    // if no filter function provided assume user want all folder content
    let filesAndDirs: RawMDX[];
    if (filter === undefined) {
        filter = (_) => true;
    }
    if (process.env.NODE_ENV === "development") {
        filesAndDirs = await readLocalMdxFiles();
    }
    else {
        const dir = await downloadFolderMetaData("/content/blog");
        filesAndDirs = (await Promise.all(dir.filter(filter).map(async (file) => downloadFileOrDirectory(file))))
            .filter((i): i is RawMDX => i !== null);
    }
    const posts = await Promise.all(filesAndDirs.map(async (source) => await parsePost(source))) as ParsedPost[];
    console.dir(posts, { depth: 5 })
    return posts.sort((a, b) => {
        const dateA = new Date(a.meta.date);
        const dateB = new Date(b.meta.date);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
    });
}

export const readAndParsePost = async (filePath: string) => {
    const rawMdx = await readlocalMdxFileOrDirectory(filePath);
    return await parsePost(rawMdx);
}