import React, { useState, useContext, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
// import { OutputPostsContext } from '../../pages';
const TagsBox: React.FC = () => {
    return <div></div>
    // const [selected, setSelected] = useState<string[]>([])
    // const [_, setOutputPosts] = useContext(OutputPostsContext)
    // const tags = trpc.tags.getTags.useQuery();    
    // const posts = trpc.postsByTag.getPostsByTag.useQuery(selected);
    // if (posts.isError) {
    //     console.log('error happend', posts.error);
    // } else if (posts.data && posts.data.length > 0) {
    //     console.log(posts.data)
    //     setOutputPosts(posts.data);
    // }
    // useEffect(() => {
    //     console.log(selected);
    // }, [selected])   
    // if (tags.isLoading) {
    //     return (
    //         <>
    //         laoding
    //         </>
    //     );
    // }
    // // TODO change function setSelected to remove item if exist 
    // return (
    //     <form className='flex gap-4 justify-center flex-wrap'>
    //         {tags.data && tags.data.map((tag) => {
    //             return (
    //                 <>
    //                 <label htmlFor={tag} className="w-auto px-4 cursor-pointer dark:bg-dark-primary-500 bg-gray-200 text-gray-600 font-mono font-semibold text-sm">{tag}</label>
    //                 <input type="checkbox" id={tag} name={tag} value={tag} className="hidden " onChange={(e) => {setSelected(old => !old.includes(e.target.value) ? [...old, e.target.value] : old)}}/>
    //                 </>
    //             );
    //         }
    //         )}
    //     </form>
    // );
}
export default TagsBox;
