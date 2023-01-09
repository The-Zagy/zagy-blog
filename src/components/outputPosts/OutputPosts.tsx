import React from 'react';
import { PostCard } from '../../pages/blog/[pageNumber]';
import { useContext } from 'react';
import { OutputPostsContext } from '../../pages';
import { PostsFromQuery } from '../../server/trpc/router/posts';
const OutputPosts: React.FC = () => {
    const [posts, _] = useContext(OutputPostsContext)
    return (
        <div className='flex flex-wrap'>
            {posts.length>0 ? posts.map((post: PostsFromQuery[0]) => {
            return (<PostCard {...(post)} big={false} key={post.title}  />);
        }) : <div>no posts</div>}
        </div>
    );
}
export default OutputPosts;
