import React from 'react';
import Link from 'next/link';
import { trpc } from '../../utils/trpc';
const TagsBox: React.FC = () => {
    const tags = trpc.tags.getTags.useQuery();    
    if (tags.isLoading) {
        return (
            <>
            laoding
            </>
        );
    } 
    return (
        <ul className='flex gap-4 justify-center flex-wrap'>
            {/* TODO change href to go to right page that will show posts with that tag IDEA THO TO MAKE THEM SELECTABLE THEN USER CLICK SEARCH FOR EXAMPLE AND WE RESPOND WITH ALL POSTS MATCH TAGS*/}
            {tags.data && tags.data.map((tag) => (<li key={tag} className=" w-auto px-4 cursor-pointer dark:bg-dark-primary-500 bg-gray-200 text-gray-600 font-mono font-semibold text-sm"><Link href="#">{tag}</Link></li>))}
        </ul>
    );
    
}
export default TagsBox;
