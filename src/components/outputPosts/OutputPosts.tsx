import React from 'react';
import { Post } from '../../utils/mdx';
import { PostCard } from '../../pages/blog/[pageNumber]';
import { useContext } from 'react';
// import { OutputPostsContext } from '../../pages';
const OutputPosts: React.FC = () => {
    // const [posts, _] = useContext(OutputPostsContext)
    return (
        <div className='flex flex-wrap'>
            {/* {posts.length>0 ? posts.map((post) => {
            return (<PostCard {...(post.meta)} data={post.code} big={false} key={post.meta.title} />);
        }) : <div>no posts</div>} */}
        </div>
    );
}
export default OutputPosts;
