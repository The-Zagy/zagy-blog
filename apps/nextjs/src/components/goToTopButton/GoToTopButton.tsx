import React, {useEffect, useState} from "react";
import {ArrowLongUpIcon} from '@heroicons/react/24/solid';
import clsx from "clsx";

const GotToTopButton: React.FC = () => {
    const [visiable, setVisiable] = useState<boolean>(false);
    
    useEffect(() => {
        const handler = () => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                setVisiable(true);
            } else {
                setVisiable(false);
            }
        }
        // if body got certian amount of scroll change the visability state
        window.addEventListener('scroll', handler);
        return () => {window.removeEventListener('scroll', handler);
    console.log('removed')}
    }, []);

    return (
    <button
    onClick={() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }}
    className={clsx("fixed bottom-10 right-8 w-12 h-12 p-1 bg-slate-400 dark:bg-dark-background-400",{"block": visiable, "hidden": !visiable} )}
    >
        <ArrowLongUpIcon className="text-lg" />
    </button>
    );
}
export default GotToTopButton;