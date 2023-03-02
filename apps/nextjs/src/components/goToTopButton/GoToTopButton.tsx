import React, { useEffect, useRef, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
//todo progress read

const GotToTopButton: React.FC = () => {
    const [visiable, setVisiable] = useState<boolean>(false);
    const setTimeOutRef = useRef<NodeJS.Timeout | number>();
    const progessCircle = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handler = () => {
            const scrollValue = document.documentElement.scrollTop;
            if (scrollValue > 500) {
                setVisiable(true);
                const pageHeight = document.documentElement.offsetHeight;
                const clientHeight = document.documentElement.clientHeight;
                const progress = scrollValue / (pageHeight - clientHeight) * 100;
                if (progessCircle.current) {
                    progessCircle.current.style.background = "conic-gradient(rgb(3, 133, 255) " +
                        progress +
                        "%,rgb(242, 242, 242) " +
                        progress +
                        "%)";
                }
                // if the user didn't scroll for time hide the button for better visuls in small screens, and clear the previous setTimeout using "useRef.current"
                clearTimeout(setTimeOutRef.current);
                setTimeOutRef.current = setTimeout(() => {
                    const cur = document.documentElement.scrollTop;
                    if (cur === scrollValue) {
                        setVisiable(false);
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
        };
    }, []);

    return (
        <button

            type="button"
            id="backToTop"
            onClick={() => {
                if (!visiable) return
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }}
            className={clsx(
                "reading-progress-circle dark:shadow-none shadow-sm fixed bottom-10 right-8 flex justify-center items-center rounded-full transition-opacity dark:bg-dark-primary-700",
                { "opacity-100": visiable, "opacity-0 cursor-auto": !visiable },
            )}
        >
            <div className="absolute bg-white dark:bg-dark-muted-700 rounded-full flex justify-center w-8 h-8 items-center">
                <ChevronUpIcon className="fill-slate-900 dark:fill-white" /></div>
            <div className="rounded-full w-10 h-10" ref={progessCircle}></div>
        </button>
    );
};
export default GotToTopButton;
