import { GetStaticPaths, GetStaticProps} from 'next';
import { prisma } from '../../../server/db/client';
import { AsyncReturnType } from '../../../utils/ts-bs';
import { isValidDateString } from '../../../utils/date';
import Image from 'next/image'
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
const UserCard: React.FC<{userName: string, userImage: string, createdAt: Date}> = ({userName, userImage, createdAt}) => {
    return (
        <div className="userCard flex gap-6">
        <Image src={userImage} alt={"userPic"} className={"rounded-full w-12 h-12"} />
        <div className={"authorName flex-col"} >
            <span className={"font-thin"}>Written By</span>
            <p>{userName}</p>
        </div>
        <div className={"postDate flex-col"} >
            <span className="font-thin">Posted On</span>
            {isValidDateString(createdAt.toString()) && <time className='block'>{Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(createdAt))}</time>} 
        </div>
        </div>
    );
}
const PostHeader: React.FC<{post: PostData}> = ({post}) => {
    return (
        <div className={"w-full flex flex-col gap-y-4  items-center justify-center "}>
            <h1 className="text-center text-7xl ">{post.title}</h1>
            <UserCard userImage={post.author.image} userName={post.author.userName} createdAt={post.createdAt} />
            <Image src={post.image} alt="postImage" className="w-11/12 h-min" />
        </div>
    );
}
const PostPage: React.FC<{post: PostData}> = ({post}) => {
    return (
        <div className=" p-10 w-full  m-auto flex flex-col gap-y-10 items-center justify-center" >
            <PostHeader post={post} />
            <main className="postContent text-center font-light">{post.content}</main>  
        </div>
    );
}
export default PostPage;
export const getStaticPaths: GetStaticPaths<{slug: string}> = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}
// function to parse page param and return post id from it
function getPostId(param: string): string {
    return param.split('-').splice(-5, 5).join('-');
}
export const getStaticProps: GetStaticProps =async ({params}) => {
    if (params === undefined || typeof params.id !== "string" ) {
        return {
            notFound: true,
        }
    }
    const id = getPostId(params.id);
    const post =await getPost(id);
    return {
        props: { post: JSON.parse(JSON.stringify(post)) },
    }
}