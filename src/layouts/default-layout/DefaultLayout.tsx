import React from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/NavBar";


export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="dark:bg-dark-background-500 dark:text-dark-text-500">
                {children}
            </main>
            <Footer />
        </div>
    )
}