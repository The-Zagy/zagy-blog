import { api } from "~/utils/api"
import { DefaultSpinner } from "../defaultSpinner/DefaultSpinner";
import { PostCard } from "../post/FeaturedPostCard";
export default function LatestPosts() {
    const posts = api.posts.getLatestPosts.useQuery();
    const Posts = () => {
        if (posts.isLoading) {
            return <div className="py-4"><DefaultSpinner /></div>
        }
        if (posts.isError) {
            return <span>Something went wrong :( </span>
        }
        if (posts.isSuccess) {
            return <div
                className="relative grid justify-center grid-cols-3 sm:grid-cols-6 gap-x-4 md:grid-cols-9 lg:grid-cols-12 lg:gap-x-6 mx-auto max-w-7xl py-3">
                {posts.data.map(post => <PostCard post={post} key={post.slug} />)}</div>
        }
        return <></>
    }
    return (
        <div className="border-t font-mono border-b w-full flex flex-col justify-center">
            <h2 className="text-xl text-center">Latest</h2>
            <Posts />
        </div>
    )
}