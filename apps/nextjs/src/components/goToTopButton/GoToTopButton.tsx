import React, { useEffect, useRef, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
//todo progress read
const GotToTopButton: React.FC = () => {
    const [visiable, setVisiable] = useState<boolean>(false);
    const setTimeOutRef = useRef<NodeJS.Timeout | number>();
    useEffect(() => {
        const handler = () => {
            const scrollValue = document.documentElement.scrollTop;
            if (scrollValue > 500) {
                setVisiable(true);
                // if the user didn't scroll for time hide the button for better visuls in small screens, and clear the previous setTimeout using "useRef.current"
                clearTimeout(setTimeOutRef.current);
                setTimeOutRef.current = setTimeout(() => {
                    const cur = document.documentElement.scrollTop;
                    if (cur === scrollValue) {
                        setVisiable(false);
                        console.log("still the same");
                    }
                }, 1000);
            } else {
                clearTimeout(setTimeOutRef.current);
                setVisiable(false);
            }
        };
        // if body got certian amount of scroll change the visability state
        window.addEventListener("scroll", handler);
        return () => {
            window.removeEventListener("scroll", handler);
            console.log("removed");
        };
    }, []);

    return (
        <button
            type="button"
            id="backToTop"
            onClick={() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }}
            className={clsx(
                "dark:shadow-none shadow-sm dark:border-none border  fixed bottom-10 right-8 w-12 h-12 p-1 flex justify-center items-center rounded-full transition-opacity dark:bg-dark-primary-700",
                { "opacity-100": visiable, "opacity-0": !visiable },
            )}
        >
            <ChevronUpIcon className="w-8 h-8" />
        </button>
    );
};
export default GotToTopButton;
