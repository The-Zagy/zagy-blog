import Link from "next/link";
import Image from "next/image";
import React from "react";
import ThemeSwtich from "../themeSwitch/ThemeSwitch";
import SearchModal from "../searchModal/SearchModal";
import { useTheme } from "next-themes";
// import { trpc } from "../../utils/trpc";
export default function Navbar() {
    const { resolvedTheme } = useTheme();
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
        <header className="w-full px-20 items-center flex flex-row justify-between h-16">
            <section className="text-3xl font-bold text-gray-700 select-none ">
                <Link href="/">
                <Image src={src} alt='logo' width="200" height="200" />
                </Link>
            </section>
            <section className="flex flex-row justify-center gap-10 w-3/4 text-gray-500">
                <Link href="/blog/1" className="hover:text-dark-secondary-500">Blog</Link>
                <Link href="" className="hover:text-dark-secondary-500">Arcade</Link>
                <Link href="/about" className="hover:text-dark-secondary-500">About Us</Link>
            </section>
            <SearchModal />
            <ThemeSwtich />
        </header>
    )

}
