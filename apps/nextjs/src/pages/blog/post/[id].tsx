import { access } from "fs/promises";
import path from "path";
import { useMemo } from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ArticleJsonLd, NextSeo } from "next-seo";
import { prisma } from "@acme/db";
import { readAndParsePost } from "@acme/mdx";
import { AsyncReturnType, dateFormat, isValidDateString } from "@acme/utils";
import dynamic from "next/dynamic";
import { getMDXComponent } from "~/utils/mdx-client";
import MdxComponents from "~/components/mdx-components";
import Comments from "../../../components/comments/comments";
import Link from "next/link";
const GotToTopButton = dynamic(() => import('../../../components/goToTopButton/GoToTopButton'), {ssr: false});

const getPostBySlug = async (slug: string) => {
    return await prisma.post.findFirst({
        where: {
            slug,
        },
        include: {
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            contributors: {
                where: {
                    isAuthor: true,
                },

                take: 1,
                select: {
                    contributor: {
                        select: {
                            handle: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });
};

// the nonNull type from it must be the return from "getStaticProps" and the input to "postPage"
type PostData = AsyncReturnType<typeof getPostBySlug>;
type NonNullType<T> = Exclude<T, null | undefined>; // Remove null and undefined from T
type NonNullPostData = NonNullType<PostData>;

async function fileExists(path: string) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}


const UserCard: React.FC<{
    userName: string;
    userImage: string;
    createdAt: string;
    avgReadingTime: string;
}> = ({ userName, userImage, createdAt, avgReadingTime }) => {
    return (
        <div className="flex justify-start items-center gap-6 ">
            <img
                src={userImage}
                alt={"userPic"}
                className={"rounded-full w-12 h-12"}
            />
            <div>
                <Link href={`/blog/author/${userName}`}><p className="md:text-xl text-sm ">{userName}</p></Link>
                <div className=" text-gray-500 text-sm">
                    {isValidDateString(createdAt.toString()) && (
                        <time>{dateFormat(new Date(createdAt))}</time>
                    )}
                    <span>{" -  " + avgReadingTime}</span>
                </div>
            </div>
        </div>
    );
};

const PostHeader: React.FC<{ post: NonNullPostData }> = ({ post }) => {
    return (
        <>
            <div className={"flex flex-col gap-y-10 justify-center "}>
                <div className="flex flex-col gap-2">
                    <UserCard
                        avgReadingTime={post.readingTime}
                        userImage={
                            (post.contributors[0]?.contributor.image as string)
                        }
                        userName={
                            post.contributors &&
                            (post.contributors[0]?.contributor.handle as string)
                        }
                        createdAt={String(post?.createdAt)}
                    />
                    <h1 className="lg:text-7xl md:text-5xl text-xl  ">
                        {post.title}
                    </h1>
                </div>
                <img
                    src={
                        post.bannerUrl ||
                        "https://media.sproutsocial.com/uploads/2017/01/Instagram-Post-Ideas.png"
                    }
                    alt="postImage"
                    className="rounded-md object-cover object-center"
                    style={{ maxHeight: "500px" }}
                />
            </div>
        </>
    );
};

// next page
//? NOTE the context type is hard coded so if we changed the getstaticprops return type we should change here too
const PostPage: NextPage<NonNullPostData> = (post) => {
    const Component = useMemo(() => getMDXComponent(post.code), [post.code]);
    return (
        <>
            <NextSeo
                title={`Zagy Blog - ${post.title}`}
                description={post.description}
                openGraph={{
                    title: `Zagy Blog - ${post.title}`,
                    description: post.description,
                    images: [
                        {
                            url:
                                post.bannerUrl ||
                                "https://media.sproutsocial.com/uploads/2017/01/Instagram-Post-Ideas.png",
                        },
                    ],
                    type: "article",
                    url: `https://zagy.tech/blog/post/${post.slug}`,
                    siteName: "zagy-blog",
                }}
            />
            <ArticleJsonLd
                type="BlogPosting"
                authorName={post.contributors[0]?.contributor.handle}
                datePublished={new Date(post.createdAt).toUTCString()}
                description={post.description}
                images={[
                    post.bannerUrl,
                    "https://media.sproutsocial.com/uploads/2017/01/Instagram-Post-Ideas.png",
                ]}
                title={post.title}
                url={`https://zagy.tech/blog/post/${post.slug}`}
                isAccessibleForFree={true}
                publisherName={post.contributors[0]?.contributor.handle}
                publisherLogo={post.contributors[0]?.contributor.image}
            />
            <div className="m-auto w-11/12 md:w-4/6 lg:w-3/6 text-xl flex flex-col py-20 gap-y-16 item-center justify-center">
                <PostHeader post={post} />
                <main className="prose lg:prose-xl md:prose-md dark:prose-invert prose-pre:text-xl prose-pre:md:text-base break-words max-w-none">
                    <Component components={MdxComponents} />
                </main>
                <div className="flex border-b-2 border-gray-50">
                    <a
                        href={`${"https://github.com/The-Zagy/zagy-blog/edit/main"}/${
                            post.githubPath
                        }`}
                    >
                        Edit this on github
                    </a>
                </div>
                <Comments />
                <GotToTopButton />
            </div>
        </>
    );
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

// TODO fix the error date not serialzable to not do all this JSON.PARSE(JSON.STRINGIFY())
export const getStaticProps: GetStaticProps<NonNullPostData> = async ({ params }) => {
    if (params === undefined || typeof params.id !== "string") {
        return {
            notFound: true,
        };
    }

    if (process.env.APP_ENV === "development") {
        const filePath = path.resolve(
            path.resolve(path.resolve(), "../../content/blog"),
            params.id,
        );
        let content: AsyncReturnType<typeof readAndParsePost>;
        if (await fileExists(filePath)) {
            content = await readAndParsePost(filePath);
        } else if (await fileExists(filePath + ".mdx")) {
            content = await readAndParsePost(filePath + ".mdx");
        } else {
            return {
                notFound: true,
            };
        }

        // a lot of place holders but it's way easy this way instead of checking for each undefined and that shit while we're doing it right in the database for the production
        return {
            props: JSON.parse(JSON.stringify({
                ...content.meta,
                code: content.code,
                id: 'idfromdatabase',
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
                contributors: [{contributor: {handle: 'nagy-nabil', image: 'https://avatars.githubusercontent.com/u/61756360?v=4'}}],
                tags: [{tag: {name: 'tagfordevelopment'}}],
                keyWords: [] 
            })) as NonNullPostData
        }
    }

    const post = await getPostBySlug(params.id);

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: JSON.parse(JSON.stringify(post)) as NonNullPostData
    };
};

export default PostPage;
