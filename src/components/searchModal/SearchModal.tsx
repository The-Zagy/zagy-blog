import React, { useState } from  'react';
import Modal from 'react-modal';
import TagsBox from "../tagsBox/TagsBox";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
Modal.setAppElement("#__next");
const SearchModal: React.FC = () => {
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    
    // const tags = trpc.tags.getPostsByTag.useQuery();
    return (
        <>
        <button onClick={openModal} className="text-gray-500  hover:text-dark-secondary-500">search</button>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            style={{overlay:{backgroundColor: '' }}}
            className="bg-gray-500 dark:bg-dark-background-500 m-auto mt-20 h-3/4 w-11/12 md:w-3/5 p-12 flex flex-col gap-y-10 justify-center align-middle relative rounded-lg transition ease-in-out delay-200 duration-200 opacity-100 shadow-lg border-solid border-slate-500 border-2" 
            bodyOpenClassName="dark:bg-dark-background-400"
            shouldCloseOnOverlayClick={true}
        >
            <button role={'close'} onClick={closeModal}><XMarkIcon className='w-10 absolute top-5 right-5' /></button>
            <form className='flex gap-3 justify-center'>
                <input type="text" placeholder='Search' className='w-5/6 md:w-2/3 lg:w-2/5 h-12 p-4'></input>
                <button type='submit'><MagnifyingGlassIcon className='h-6 w-6 dark:fill-white dark:text-white' /></button>
            </form>
            <TagsBox />
        </Modal>
        </>
    );
}
export default SearchModal;
