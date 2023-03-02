import { AsyncReturnType, GithubUser, downloadGithubUser } from "@acme/utils";
import { prisma } from "@acme/db";
import Link from "next/link";

export default function Author({ posts, author }: { posts: Posts, author: GithubUser }) {
    return <div className="md:grid grid-flow-col w-full py-10 px-30 gap-4
    flex flex-col
    ">
        <div className="row-span-3 col-span-2 flex flex-col items-center">
            <img className="w-56 h-56 rounded-full border-2 border-gray-400" src={author.avatar_url} />
            <span className="md:text-3xl text-xl">{author.login}</span>
            <span>{author.name}</span>
            <span className="text-blue-700 "><a href={author.html_url}>Visit Github account</a></span>
        </div>
        <div className="col-span-2 flex flex-col pt-20 px-12">Posts by this person:
            <div className="flex flex-col mt-3">
                {posts && posts.map(i => <Link key={i.post.slug} className="text-blue-700" href={`/blog/post/${i.post.slug}`}>{i.post.title}</Link>)}
            </div></div>

    </div>
}
const getPostsByUser = async (handle: string) => {
    return (await prisma.user.findFirst({
        where: {
            handle
        },
        select: {
            posts: {
                select: {
                    post: {
                        select: {
                            title: true,
                            slug: true
                        }
                    }
                },
                where: {
                    isAuthor: true,
                },
            }
        }
    }))?.posts
}
type Posts = AsyncReturnType<typeof getPostsByUser>
export async function getServerSideProps({ params }: { params: { id: string } }) {
    const { id } = params;
    const posts = await getPostsByUser(id);
    if (!posts) return ({
        notFound: true,
    });
    const author = await downloadGithubUser(id);
    console.log(author);
    return {
        props: {
            posts: JSON.parse(JSON.stringify(posts)),
            author: JSON.parse(JSON.stringify(author))
        }, // will be passed to the page component as props
    }
}