import { GetStaticPaths, GetStaticProps } from 'next';
import { prisma } from '../../../server/db/client';
import { AsyncReturnType } from '../../../utils/ts-bs';
import { isValidDateString, dateFormat } from '../../../utils/date';
import { ArticleJsonLd } from 'next-seo';
import DisqusComments from '../../../components/disqus-comments/DisqusComments';
import { CalcAverageReadTime, Minute } from '../../../utils/misc';
async function getPost(id: string) {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            author: {
                select: {
                    userName: true,
                    image: true
                }
            }
        }
    });
    return post;
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
    const avgReadingTime = CalcAverageReadTime(post.content);
    return (
        <div className={"flex flex-col gap-y-10 justify-center "}>
            <div className='flex flex-col gap-2'>
                <UserCard avgReadingTime={avgReadingTime} userImage={post.author.image} userName={post.author.userName} createdAt={post.createdAt} />
                <h1 className="text-7xl ">{post.title}</h1>
            </div>
            <img src={post.image} alt="postImage" className="h-min rounded-md" />
        </div>
    );
}
const PostPage: React.FC<{ post: PostData }> = ({ post }) => {
    return (
        <>
            <ArticleJsonLd
                authorName={post.author.userName}
                datePublished={dateFormat(post.createdAt)}
                description={post.breif}
                title={post.title}
                images={[post.image]}
                url={''}
            />
            <div className="m-auto w-11/12 md:w-5/6 lg:w-4/6 text-xl flex flex-col py-20 gap-y-16 item-center justify-center" >
                <PostHeader post={post} />
                <main className="postContent font-light" dangerouslySetInnerHTML={{ __html: post.content }}></main>
                <DisqusComments pageUrl={`/blog/post/${post.title.split(" ").join("-")}-${post.id}`} pageId={post.id} />
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
// function to parse page param and return post id from it
function getPostId(param: string): string {
    return param.split('-').splice(-5, 5).join('-');
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (params === undefined || typeof params.id !== "string") {
        return {
            notFound: true,
        }
    }
    const id = getPostId(params.id);
    const post = await getPost(id);
    return {
        props: { post: JSON.parse(JSON.stringify(post)) },
    }
}