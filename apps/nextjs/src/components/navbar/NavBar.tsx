import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Bars2Icon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import useOnClickOutside from "../../hooks/useOutsideListner";
import ThemeSwitch from "../themeSwitch/ThemeSwitch";
const GithubIcon = () => {
    return <svg className="dark:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
}
// import { trpc } from "../../utils/trpc";
export default function Navbar() {
    const { resolvedTheme } = useTheme();
    const [logoSrc, setLogoSrc] = useState(() => resolvedTheme === "light" ? '/images/Zagy-logos_black.png' : '/images/Zagy-logos_white.png')
    const [mobileMenuOpend, setMobileMenuOpened] = useState<boolean>(false);
    const navBarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        switch (resolvedTheme) {
            case 'light':
                setLogoSrc('/images/Zagy-logos_black.png');
                break;
            case 'dark':
                setLogoSrc('/images/Zagy-logos_white.png');
                break;
        }
        return;
    }, [resolvedTheme]);
    useOnClickOutside(navBarRef, () => setMobileMenuOpened(false));

    return (
        <>
            <header className="md:w-full md:px-10 px-5 items-center flex flex-row justify-between h-16 gap-10">
                <section className="md:text-3xl font-bold text-gray-700 select-none ">
                    <Link href="/">
                        <Image src={logoSrc} alt='logo' width="200" height="200" />
                    </Link>
                </section>
                <section className="sm:flex hidden flex-row justify-center gap-10 md:w-full text-gray-500">
                    <Link href="/blog/1" className="hover:text-dark-secondary-500">All Posts</Link>
                    <Link href="" className="hover:text-dark-secondary-500">Arcade</Link>
                    <Link href="/about" className="hover:text-dark-secondary-500">About Us</Link>
                </section>
                {/* <SearchModal /> */}
                <div className="sm:hidden visible">
                    <Bars2Icon
                        onClick={() => setMobileMenuOpened((prev => !prev))}
                        className="text-black dark:text-dark-text-500 cursor-pointer w-7 h-7" />
                </div>
                <div className="hidden sm:flex flex-row gap-4">
                    <ThemeSwitch />
                    <Link href="https://github.com/The-Zagy/zagy-blog"><GithubIcon /></Link>
                </div>
            </header>
            <div ref={navBarRef} className={clsx("fixed z-10 h-full border-r top-0 sm:hidden shadow-sm border-r-gray-100 w-1/2 transition-transform bg-white px-5 py-10 dark:bg-dark-background-500"
                , { "hidden": !mobileMenuOpend })}>
                <section className="flex-col flex gap-4 text-gray-500">
                    <Link href="/blog/1" className="hover:text-dark-secondary-500">All Posts</Link>
                    <Link href="" className="hover:text-dark-secondary-500">Arcade</Link>
                    <Link href="/about" className="hover:text-dark-secondary-500">About Us</Link>
                    <div className="flex flex-row">
                        <ThemeSwitch />
                        <Link href="https://github.com/The-Zagy/zagy-blog"><GithubIcon /></Link>
                    </div>
                </section>

            </div>
        </>
    )

}
