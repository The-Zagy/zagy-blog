import { GithubUser } from "@acme/utils";
import { prisma } from "@acme/db";
import type { Post } from "@prisma/client";
export default function Author({ author }: { posts: Post[], author: GithubUser }) {
    return <div className="grid grid-rows-3 grid-flow-col w-full py-10 px-30 gap-4">
        <div className="row-span-3 col-span-1 flex flex-col justify-center items-center">
            <img className="w-56 h-56 rounded-full border-2 border-blue-900" src={author.avatar_url} alt="Picture of author" />
            <span>{author.login}</span>
            <span>{author.name}</span>
            <span><a href={author.html_url}>Visit Github account</a></span>
        </div>
        <div className="col-span-2 ">posts by this guy</div>
        <div className="row-span-2 col-span-2 ">03</div>
    </div>
}
const getPostsByUser = async (handle: string) => {
    return await prisma.user.findFirst({
        where: {
            handle
        },
        select: {
            handle: true,
            image: true,
            posts: {
                where: {
                    isAuthor: true,
                },
                include: {
                    post: true,
                }
            }
        }
    })
}
export async function getServerSideProps({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const user = await getPostsByUser(slug);
    return {
        props: {
            postsByThisAuthor: JSON.parse(JSON.stringify(user?.posts)) as Post[],
            author: JSON.parse(JSON.stringify(user)) as GithubUser
        }, // will be passed to the page component as props
    }
}