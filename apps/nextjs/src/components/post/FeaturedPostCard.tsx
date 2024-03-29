import { dateFormat } from "@acme/utils";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";
type PostMeta = RouterOutputs['posts']['getLatestPosts'][0]
export const PostCard: React.FC<{ post: PostMeta }> = ({ post }) => {
    return (<article className="col-span-3 ">
        <img alt="Article cover" src={post.bannerUrl || "https://picsum.photos/800/1200"} className="rounded-lg w-full h-96
        object-cover object-center" />
        <header className="flex flex-col">
            <p className="text-gray-700 dark:text-dark-text-900 text-lg
            "> {<time>{dateFormat(post.createdAt)}</time>}
                <span>{" -  " + post.readingTime}</span></p>
            <h3 className="text-xl hover:text-dark-secondary-700"><Link href={`/blog/post/${post.slug}`}>{post.title}</Link></h3>
        </header>
    </article>)
}