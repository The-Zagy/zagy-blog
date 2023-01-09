import React, { useState, useContext, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import {clsx} from "clsx"
import { OutputPostsContext } from '../../pages';
const TagsBox: React.FC = () => {
    const [selected, setSelected] = useState<string[]>([])
    const [_, setOutputPosts] = useContext(OutputPostsContext)
    const tags = trpc.tags.getTags.useQuery();    
    const posts = trpc.posts.getPostsByTags.useQuery(selected);
    if (posts.isError) {
        console.log('error happend', posts.error);
    } else if (posts.data) {
        console.log(posts.data)
        setOutputPosts(posts.data);
    }
    useEffect(() => {
        console.log(selected);
    }, [selected])   
    if (tags.isLoading) {
        return (
            <>
            laoding
            </>
        );
    }
    return (
        <form className='flex gap-4 justify-center flex-wrap'>
            {tags.data && tags.data.map(({name}) => {
                const isSelected = selected.includes(name);
                return (
                    <>
                    <label htmlFor={name} 
                    className={clsx("w-auto px-4 cursor-pointer  text-gray-600 font-mono font-semibold text-sm"
                    ,{"bg-dark-secondary-400":isSelected},{"dark:bg-dark-primary-500 bg-gray-200":!isSelected})} >{name}</label>
                    <input type="checkbox"
                    id={name}
                    name={name}
                    value={name}
                    className="hidden" 
                    onChange={(e) => {setSelected(old => !old.includes(e.target.value) ?
                        [...old, e.target.value] : old.filter(i=>i!==e.target.value))}}/>
                    </>
                );
            }
            )}
        </form>
    );
}
export default TagsBox;
