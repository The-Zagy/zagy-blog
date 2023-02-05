import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>About Us</title>
                <meta name="description" content="Who Are We?" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container font-mono mx-auto flex min-h-screen flex-col p-4">
                <h1 className="text-xl">Hi, we're Zagy (Zam + Nagy)!</h1>
                <h2 className="text-lg">We're two Javascript developers currently studying computer engineering at Shoubra's faculty of engineering.</h2>
                <section className="mt-4 border-t py-2">
                    <h1 className="text-xl">Zam</h1>

                </section>
                <section className="mt-4 border-t py-2">
                    <h1 className="text-xl">Nagy</h1>
                </section>
                <section className="mt-4 border-t py-2">
                    <h1 className="text-xl">Other projects</h1>
                    <section>
                        <h2 className="text-lg font-bold text-sky-700 dark:text-dark-primary-500 hover:text-dark-secondary-600"><Link href="https://zamos.zagy.tech/">Zamos</Link></h2>
                        <div className="italic">
                            Zamos is a cpu scheduling simulator made with React, you can add arbitrary number of processes with different arrival times, execution times and IO intervals and choose a scheduling algorithm then the simulator will show you a gannt chart of the timeline of the processes
                            <div>
                                You can check it <Link className="font-bold text-sky-700 dark:text-dark-primary-500 hover:text-dark-secondary-600" href="https://zamos.zagy.tech/">here</Link>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </>
    );
};

export default Home;