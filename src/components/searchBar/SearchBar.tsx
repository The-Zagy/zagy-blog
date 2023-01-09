import React, { useState, useContext} from 'react';
// import { trpc } from '../../utils/trpc';
// import { OutputPostsContext } from '../../pages';
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import TagsBox from "../tagsBox/TagsBox";
const SearchBar: React.FC = () => {
    // const [title, setTitle] = useState<string>("");
    // const [_, setOutputPosts] = useContext(OutputPostsContext)
    // const posts = trpc.posts.getPostByTitle.useQuery(title);
    // if (posts.isError) {
    //     console.log('error happend', posts.error);
    // } else if (posts.data) {
    //     console.log(posts.data)
    //     setOutputPosts(posts.data);
    // }

    return (
        <>
        {/* <form className='flex gap-3 justify-center m-8'>
            <input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder='Search' className='w-5/6 md:w-2/3 lg:w-2/5 h-12 p-4'></input>
        </form> */}
        <TagsBox />
        </>
    );
}
export default SearchBar;