import React from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/NavBar";


export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <main className="dark:bg-dark-main-200">
                {children}
            </main>
            <Footer />
        </div>
    )
}