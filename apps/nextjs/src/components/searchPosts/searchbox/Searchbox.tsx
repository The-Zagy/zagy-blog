import React, { Dispatch, SetStateAction } from 'react';
export const SearchBox: React.FC<{ searchInput: string, setSearchInput: Dispatch<SetStateAction<string>> }> = ({ searchInput, setSearchInput }) => {

    return (
        <input placeholder="Search posts" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="px-2 py-1 outline-none border dark:border-none rounded-md focus:border-blue-500" />
    )
}