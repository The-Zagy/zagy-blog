import React, { useEffect, useRef, useState } from "react";
import { ArrowLongUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

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
                }, 2500);
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
            onClick={() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }}
            className={clsx(
                "fixed bottom-10 right-8 w-12 h-12 p-1 bg-slate-400 dark:bg-dark-background-400",
                { block: visiable, hidden: !visiable },
            )}
        >
            <ArrowLongUpIcon className="text-lg" />
        </button>
    );
};
export default GotToTopButton;
