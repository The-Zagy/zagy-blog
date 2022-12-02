import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import TagsBox from "../tagsBox/TagsBox";
const SearchBar: React.FC = () => {
    return (
        <>
        <form className='flex gap-3 justify-center'>
            <input type="text" placeholder='Search' className='w-5/6 md:w-2/3 lg:w-2/5 h-12 p-4'></input>
            <button type='submit'><MagnifyingGlassIcon className='h-6 w-6 dark:fill-white dark:text-white' /></button>
        </form>
        <TagsBox />
        </>
    );
}
export default SearchBar;