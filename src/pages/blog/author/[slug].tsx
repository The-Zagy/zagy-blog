import cache from "../../../utils/cache";
import { downloadGithubUser, GithubUser } from "../../../utils/github";
import { Post } from "../../../utils/mdx";

export default function Author({ posts, author }: { posts: Post[], author: GithubUser }) {
    return <div className="grid grid-rows-3 grid-flow-col w-full py-10 px-30 gap-4">
        <div className="row-span-3 col-span-1 flex flex-col justify-center items-center">
            <img className="w-56 h-56 rounded-full border-2 border-blue-900" src={author.avatar_url} />
            <span>{author.login}</span>
            <span>{author.name}</span>
            <span><a href={author.html_url}>Visit Github account</a></span>
        </div>
        <div className="col-span-2 ">posts by this guy</div>
        <div className="row-span-2 col-span-2 ">03</div>
    </div>
}
export async function getServerSideProps({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const posts = await cache.getPosts();
    const postsByThisAuthor = posts.filter(post => post.meta.contributers?.author?.login === slug);
    const author = await downloadGithubUser(slug);
    return {
        props: {
            postsByThisAuthor: JSON.parse(JSON.stringify(postsByThisAuthor)),
            author: JSON.parse(JSON.stringify(author))
        }, // will be passed to the page component as props
    }
}