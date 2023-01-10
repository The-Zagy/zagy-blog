import React from 'react';
import { PostCard } from '../../../pages/blog/[pageNumber]';
import { PostsFromQuery } from '../../../server/trpc/router/posts';
const OutputPosts: React.FC<{ posts: PostsFromQuery }> = ({ posts }) => {
    return (
        <div className='flex flex-col justify-center items-center w-3/4'>
            {posts.map((post: PostsFromQuery[0]) => {
                return (<PostCard {...(post)} big={false} key={post.title} />);
            })}
        </div>
    );
}
export default OutputPosts;
