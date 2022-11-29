import Link from "next/link";
import React from "react";
import ThemeSwtich from "../themeSwitch/ThemeSwitch";
import SearchModal from "../searchModal/SearchModal";
// import { trpc } from "../../utils/trpc";
export default function Navbar() {
    return (
        <header className="w-full px-20 items-center flex flex-row justify-between h-16">
            <section className="text-3xl font-bold text-gray-700 select-none ">
                ZAGY af
            </section>
            <section className="flex flex-row justify-center gap-10 w-3/4 text-gray-500">
                <Link href="/blog/1">Blog</Link>
                <Link href="">Link 2</Link>
                <Link href="/about">About Us</Link>
            </section>
            <SearchModal />
            <ThemeSwtich />
        </header>
    )

}
