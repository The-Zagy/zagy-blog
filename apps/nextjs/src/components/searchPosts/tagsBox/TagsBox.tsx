import React, { Dispatch, SetStateAction } from 'react';
import { api } from "~/utils/api";
import { clsx } from "clsx"
import { DefaultSpinner } from '../../loaders/defaultSpinner/DefaultSpinner';
const TagsBox: React.FC<{ setSelectedTags: Dispatch<SetStateAction<string[]>>, selectedTags: string[] }> = ({ setSelectedTags, selectedTags }) => {
    const tags = api.tags.getTags.useQuery();
    if (tags.isLoading) {
        return (
            <div className='flex gap-4 justify-center flex-wrap'>
                <DefaultSpinner />
            </div>
        );
    }
    return (
        <form className='flex gap-4 justify-center flex-wrap'>
            {
                tags.data && tags.data.map(({ name }) => {
                    const isSelected = selectedTags.includes(name);
                    return (
                        <div key={name}>
                            <label htmlFor={name}
                                className={clsx("w-auto px-4 cursor-pointer select-none text-gray-600 font-mono font-semibold text-sm"
                                    , { "bg-dark-secondary-400": isSelected }, { "dark:bg-dark-primary-500 bg-gray-200": !isSelected })} >{name}</label>
                            <input type="checkbox"
                                id={name}
                                name={name}
                                value={name}
                                className="hidden"
                                onChange={(e) => {
                                    setSelectedTags(old => !old.includes(e.target.value) ?
                                        [...old, e.target.value] : old.filter(i => i !== e.target.value))
                                }} />
                        </div>
                    );
                }
                )
            }
        </form >
    );
}
export default TagsBox;
