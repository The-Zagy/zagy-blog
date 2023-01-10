import React from 'react';
const SearchBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex flex-col justify-center items-center'>
            {children}
        </div>
    );
}
export default SearchBar;