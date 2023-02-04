import React from "react";
import Footer from "../../components/footer/Footer";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import('../../components/navbar/NavBar'), { ssr: false })
export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            <Navbar />
            <main className="dark:bg-dark-background-500 min-h-screen dark:text-dark-text-500">
                {children}
            </main>
            <Footer />
        </div>
    )
}