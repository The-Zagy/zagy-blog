import { NextPage } from "next";
import Head from "next/head";
const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>About Us</title>
                <meta name="description" content="Who Are We?" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
                <h1 className="text-2xl">Wanna write or edit a post? open a pull request <a href="https://github.com/The-Zagy/zagy-blog/tree/main/content/blog" className="dark:text-dark-secondary-500 text-dark-primary-700">here!</a></h1>
            </main>
        </>
    );
};

export default Home;