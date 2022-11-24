import Link from "next/link";
import React from "react";
import ThemeSwtich from "../themeSwitch/ThemeSwitch";

export default function Navbar() {
    return (
        <header className="w-full px-20 items-center flex flex-row justify-between h-16">
            <section className="text-3xl font-bold text-gray-700 select-none ">
                ZAGY af
            </section>
            <section className="flex flex-row justify-center gap-10 w-3/4 text-gray-500">
                <Link href="">Link 1</Link>
                <Link href="">Link 2</Link>
                <Link href="">Link 3</Link>
            </section>
            <ThemeSwtich />
        </header>
    )

}