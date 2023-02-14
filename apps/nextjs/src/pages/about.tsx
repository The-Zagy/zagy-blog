import { NextPage } from "next";
import Head from "next/head";
import ProjectCard, { ProjectCardMeta } from "../components/projectCard/ProjectCard";
const Home: NextPage = () => {
    const zamosMeta: ProjectCardMeta = {
        name: "zamos",
        description: "Zamos is a cpu scheduling simulator made with React, you can add arbitrary number of processes with different arrival times, execution times and IO intervals and choose a scheduling algorithm then the simulator will show you a gannt chart of the timeline of the processes",
        link: "https://zamos.zagy.tech/",
        thumbnail: 'https://picsum.photos/500/500',
    }
    const zagyMeta: ProjectCardMeta = {
        name: "zagy",
        description: "Zamos is a cpu scheduling simulator made with React, you can add arbitrary number of processes with different arrival times, execution times and IO intervals and choose a scheduling algorithm then the simulator will show you a gannt chart of the timeline of the processes",
        link: "https://github.com/the-zagy/zagy/",
        thumbnail: 'https://picsum.photos/500/500',
    }
    return (
        <>
            <Head>
                <title>About Us</title>
                <meta name="description" content="Who Are We?" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container font-mono mx-auto flex min-h-screen flex-col p-4">
                <h1 className="text-xl">Hi, were Zagy (Zam + Nagy)!</h1>
                <h2 className="text-lg">We are two Javascript developers currently studying computer engineering at Shoubra&apos;s faculty of engineering.</h2>
                <section className="mt-4 border-t py-2">
                    <h1 className="text-xl">Zam</h1>

                </section>
                <section className="mt-4 border-t py-2">
                    <h1 className="text-xl">Nagy</h1>
                </section>
                <section className="mt-4 border-t py-2">
                    <h1 className="text-xl">Other projects</h1>
                    <section>
                    <ProjectCard {...zamosMeta} direction={1} />
                    <ProjectCard {...zagyMeta} direction={2} />
                    </section>
                </section>
            </main>
        </>
    );
};

export default Home;