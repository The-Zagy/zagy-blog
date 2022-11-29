import React, {useEffect, useState} from 'react';
import Link from 'next/link';
// import { trpc } from '../../utils/trpc';
const TagsBox: React.FC = () => {
    const [tags, setTags] = useState<string[]>([])
    const fetching = async (): Promise<void> => {
        //fetch won't let you use relative path so that's why using local host but this will change anyway with trpc all of that is placeholding
        const res = await fetch('http://localhost:3000/api/tags');
        const data = await res.json()
        setTags(data.data);
    }
    useEffect(() => {
        fetching();
    }, [])
    if (tags.length <= 0) {
        return (
            <>
            laoding
            </>
        );
    } else {
        return (
            <ul className='flex gap-4 justify-center'>
                {/* TODO change href to go to right page that will show posts with that tag IDEA THO TO MAKE THEM SELECTABLE THEN USER CLICK SEARCH FOR EXAMPLE AND WE RESPOND WITH ALL POSTS MATCH TAGS*/}
                {tags.map((tag) => (<li key={tag} className=" w-auto px-4 cursor-pointer dark:bg-dark-primary-500 bg-gray-200 text-gray-600 font-mono font-semibold text-sm"><Link href="#">{tag}</Link></li>))}
            </ul>
        );
    }
}
export default TagsBox;
