import React, { Dispatch, SetStateAction } from 'react';
export const SearchBox: React.FC<{ searchInput: string, setSearchInput: Dispatch<SetStateAction<string>> }> = ({ searchInput, setSearchInput }) => {

    return (
        <input placeholder="Search posts" className="px-2 py-1 outline-none border focus:border-blue-500" />
    )
}