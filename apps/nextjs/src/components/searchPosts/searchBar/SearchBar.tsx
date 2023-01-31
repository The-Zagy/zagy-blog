import React from 'react';
const SearchBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex flex-col justify-center items-center gap-10'>
            {children}
        </div>
    );
}
export default SearchBar;