import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef } from "react";
import ThemeSwtich from "../themeSwitch/ThemeSwitch";
import { useTheme } from "next-themes";
import { Bars2Icon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import useOnClickOutside from "../../hooks/useOutsideListner";
// import { trpc } from "../../utils/trpc";
export default function Navbar() {
    const { resolvedTheme } = useTheme();
    const [mobileMenuOpend, setMobileMenuOpened] = useState<boolean>(false);
    const navBarRef = useRef<HTMLDivElement>(null)
    useOnClickOutside(navBarRef, () => setMobileMenuOpened(false));
    let src: string;
    switch (resolvedTheme) {
        case 'light':
            src = '/images/Zagy-logos_black.png'
            break
        case 'dark':
            src = '/images/Zagy-logos_white.png'
            break
        default:
            src = '/images/Zagy-logos_black.png'
            break
    }
    return (
        <>
            <header className="md:w-full md:px-10 px-5 items-center flex flex-row justify-between h-16 gap-10">
                <section className="md:text-3xl font-bold text-gray-700 select-none ">
                    <Link href="/">
                        <Image src={src} alt='logo' width="200" height="200" />
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
                <div className="hidden sm:block">
                    <ThemeSwtich />
                </div>
            </header>
            <div ref={navBarRef} className={clsx("fixed z-10 h-full border-r top-0 sm:hidden shadow-sm border-r-gray-100 w-1/2 transition-transform bg-white px-5 py-10 dark:bg-dark-background-500"
                , { "hidden": !mobileMenuOpend })}>
                <section className="flex-col flex gap-4 text-gray-500">
                    <Link href="/blog/1" className="hover:text-dark-secondary-500">All Posts</Link>
                    <Link href="" className="hover:text-dark-secondary-500">Arcade</Link>
                    <Link href="/about" className="hover:text-dark-secondary-500">About Us</Link>
                    <ThemeSwtich />
                </section>

            </div>
        </>
    )

}
