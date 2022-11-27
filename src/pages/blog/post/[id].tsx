import { GetStaticPaths, GetStaticProps } from 'next';
import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from "react";
import { AsyncReturnType } from '../../../utils/ts-bs';
import { isValidDateString, dateFormat } from '../../../utils/date';
// import { ArticleJsonLd } from 'next-seo';
import DisqusComments from '../../../components/disqus-comments/DisqusComments';
import { CalcAverageReadTime, Minute } from '../../../utils/misc';
import { contentDirCache, downloadFileBySha } from '../../../utils/mdx';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
async function getPost(id: string) {
    const allPosts = await contentDirCache.getDirList();
    const target = allPosts.find((i) => {
        if (path.parse(i.name).name === id) return i;
    })
    if (typeof target === "undefined") {
        throw new Error("Page isn't found")
    }
    const { code, frontmatter } = await bundleMDX({ source: await downloadFileBySha(target.sha) });
    return { code, frontmatter };
}
type PostData = AsyncReturnType<typeof getPost>;
const UserCard: React.FC<{ userName: string, userImage: string, createdAt: Date, avgReadingTime: Minute }> = ({ userName, userImage, createdAt, avgReadingTime }) => {
    return (
        <div className="flex justify-start items-center gap-6 ">
            <img src={userImage} alt={"userPic"} className={"rounded-full w-12 h-12"} />
            <div>
                <p>{userName}</p>
                <div className=' text-gray-500 text-sm'>
                    {isValidDateString(createdAt.toString()) && <time>{dateFormat(createdAt)}</time>}
                    <span>{` . ${avgReadingTime} min read`}</span>
                </div>
            </div>
        </div>
    );
}
const PostHeader: React.FC<{ post: PostData }> = ({ post }) => {
    // const avgReadingTime = CalcAverageReadTime(post.content);
    const avgReadingTime = 1;
    return (
        <div className={"flex flex-col gap-y-10 justify-center "}>
            <div className='flex flex-col gap-2'>
                <UserCard avgReadingTime={avgReadingTime} userImage={"https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"} userName={"Zaza"} createdAt={new Date()} />
                <h1 className="text-7xl ">{post.frontmatter.title}</h1>
            </div>
            <img src={"https://media.sproutsocial.com/uploads/2017/01/Instagram-Post-Ideas.png"} alt="postImage" className="h-min rounded-md" />
        </div>
    );
}
const PostPage: React.FC<{ post: PostData }> = ({ post }) => {
    const Component = useMemo(() => getMDXComponent(post.code), [post.code])
    return (
        <>
            {/* <ArticleJsonLd
                authorName={post.author.userName}
                datePublished={dateFormat(post.createdAt)}
                description={post.breif}
                title={post.title}
                images={[post.image]}
                url={''}
            /> */}
            <div className="m-auto w-11/12 md:w-5/6 lg:w-4/6 text-xl flex flex-col py-20 gap-y-16 item-center justify-center" >
                <PostHeader post={post} />
                <main className="postContent font-light" ><Component /></main>
                <DisqusComments pageUrl={`/blog/post/test`} pageId={post.frontmatter.title} />
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (params === undefined || typeof params.id !== "string") {
        return {
            notFound: true,
        }
    }
    const post = await getPost(params.id);
    return {
        props: { post: JSON.parse(JSON.stringify(post)) },
    }
}