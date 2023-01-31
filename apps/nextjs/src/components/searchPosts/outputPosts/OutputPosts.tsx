import React from 'react';
import { PostCard } from '../../../pages/blog/[pageNumber]';
import { PostsFromQuery } from '@acme/api';
const OutputPosts: React.FC<{ posts: PostsFromQuery }> = ({ posts }) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
            {posts.map((post: PostsFromQuery[0]) => {
                return (<PostCard {...(post)} big={false} key={post.title} />);
            })}
        </div>
    );
}
export default OutputPosts;
