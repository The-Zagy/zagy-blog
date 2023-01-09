import { GetStaticPaths, GetStaticProps } from 'next';
import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from "react";
import { AsyncReturnType } from '../../../utils/ts-bs';
import { isValidDateString, dateFormat } from '../../../utils/date';
// import { ArticleJsonLd } from 'next-seo';
import DisqusComments from '../../../components/disqus-comments/DisqusComments';
import { prisma } from "../../../server/db/client";
import { CalcAverageReadTime, Minute } from '../../../utils/misc';
const UserCard: React.FC<{ userName: string, userImage: string, createdAt: string, avgReadingTime: Minute }> = ({ userName, userImage, createdAt, avgReadingTime }) => {
    return (
        <div className="flex justify-start items-center gap-6 ">
            <img src={userImage} alt={"userPic"} className={"rounded-full w-12 h-12"} />
            <div>
                <p>{userName}</p>
                <div className=' text-gray-500 text-sm'>
                    {isValidDateString(createdAt.toString()) && <time>{dateFormat(new Date(createdAt))}</time>}
                    <span>{` . ${avgReadingTime} min read`}</span>
                </div>
            </div>
        </div>
    );
}
const PostHeader: React.FC<{ post: NonNullType<PostData> }> = ({ post }) => {
    // const avgReadingTime = CalcAverageReadTime(post.content);
    const avgReadingTime = 1;
    return (
        <div className={"flex flex-col gap-y-10 justify-center "}>
            <div className='flex flex-col gap-2'>
                <UserCard avgReadingTime={avgReadingTime}
                    userImage={post.contributors[0]?.contributor.image as string}
                    userName={post.contributors[0]?.contributor.handle as string} createdAt={post?.createdAt.toString()} />
                <h1 className="text-7xl ">{post.title}</h1>
            </div>
            <img src={"https://media.sproutsocial.com/uploads/2017/01/Instagram-Post-Ideas.png"} alt="postImage" className="h-min rounded-md" />
        </div>
    );
}
const PostPage: React.FC<{ post: NonNullType<PostData> }> = ({ post }) => {
    const Component = useMemo(() => getMDXComponent(post.code), [post.code])
    return (
        <>

            <div className="m-auto w-11/12 md:w-5/6 lg:w-4/6 text-xl flex flex-col py-20 gap-y-16 item-center justify-center" >
                <PostHeader post={post} />
                <main className="prose lg:prose-2xl md:prose-md dark:prose-invert prose-pre:text-xl prose-pre:md:text-base max-w-none" ><Component /></main>
                <div className="flex border-b-2 border-gray-50">
                    <a href={`${"https://github.com/The-Zagy/zagy-blog/edit/main"}/${post.githubPath}`}>Edit this on github</a>
                </div>
                <DisqusComments pageUrl={`/blog/post/${post.slug}`} pageId={post.title} />
            </div>
        </>
    );
}
export default PostPage;
export const getStaticPaths: GetStaticPaths<{ slug: string }> = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}
const getPostBySlug = async (slug: string) => {
    return await prisma.post.findFirst({
        where: {
            slug
        },
        include: {
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true,
                        }
                    }
                },

            },
            contributors: {
                select: {
                    contributor:{
                        select: {
                            handle: true,
                            image: true,
                        }
                    }
                }
            }
        }
    })
}

type PostData = AsyncReturnType<typeof getPostBySlug>;
type NonNullType<T> = Exclude<T, null | undefined>;  // Remove null and undefined from T
export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (params === undefined || typeof params.id !== "string") {
        return {
            notFound: true,
        }
    }
    const post = await getPostBySlug(params.id);
    if (!post) {
        return {
            notFound: true
        }
    }
    console.dir(post, {depth: 4})
    return {
        props: { post: JSON.parse(JSON.stringify(post)) },
    }
}