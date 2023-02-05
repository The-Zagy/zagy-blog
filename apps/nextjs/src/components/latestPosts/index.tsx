import { api } from "~/utils/api"
import { PostCard } from "../post/FeaturedPostCard";
import PostSkeletonLoader from "../loaders/skeletonLoaders/post";
export default function LatestPosts() {
    const posts = api.posts.getLatestPosts.useQuery();
    const Posts = () => {
        if (posts.isLoading) {
            return <div
                className="relative grid  gap-y-5 justify-center grid-cols-3 sm:grid-cols-6 gap-x-4 md:grid-cols-9 lg:grid-cols-12 lg:gap-x-6 mx-auto max-w-7xl py-3">
                <div className="col-span-3"><PostSkeletonLoader uniqueKey="post-1" /> </div>
                <div className="col-span-3"><PostSkeletonLoader uniqueKey="post-2" /> </div>
                <div className="col-span-3"><PostSkeletonLoader uniqueKey="post-3" /> </div>
                <div className="col-span-3"><PostSkeletonLoader uniqueKey="post-4" /> </div>

            </div>
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