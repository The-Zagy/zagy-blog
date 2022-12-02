import clsx from 'clsx';
import { GetStaticPaths } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import cache from '../../utils/cache';
import { getContributers } from '../../utils/mdx'
import { AsyncReturnType } from '../../utils/ts-bs';
import { NUMBER_OF_POSTS_IN_A_PAGE } from '../../env/constants';
type MdxMeta = {
    title: string,
    description: string,
    data: string,
    slug: string,
    bannerUrl: string,
    categories?: string[]
    meta: {
        keywords: string[],
    }
    contributers: AsyncReturnType<typeof getContributers>
}
const Pages: React.FC<{ pageCount: number, currentPage: number }> = ({ pageCount, currentPage }) => {
    const list = [];
    let rightEplises = false;
    let rightBound;
    let leftElipses = false;
    let leftBound;
    if (pageCount - currentPage > 4) {
        rightBound = currentPage + 2;
        rightEplises = true;
    }
    else rightBound = pageCount;
    if (currentPage > 4) {
        leftElipses = true;
        leftBound = currentPage - 2;
    }
    else leftBound = 1;
    for (let i = leftBound; i <= rightBound; i++) {
        list.push(<li className={clsx({ "border-b-2 border-b-blue-600 text-blue-600": i === currentPage })}>{<Link href={`/blog/${i}`}>{i}</Link>}</li>)
    }
    if (leftElipses) {
        list.unshift(<li>...</li>);
        list.unshift(<li><Link href={`/blog/1`}>1</Link></li>)
    }
    if (rightEplises) {
        list.push(<li>...</li>);
        list.push(<li><Link href={`/blog/${pageCount}`}>{pageCount}</Link></li>)
    }
    return (
        <>
            {list}
        </>
    )
}
export const PostCard: React.FC<MdxMeta & { big: boolean }> =
    ({ title, contributers, categories = [], description, big, slug }) => {
        const author = contributers?.author;
        return (
            <article className={clsx('flex flex-col w-full p-6 gap-3 group', { "md:col-span-2 lg:col-span-2 row-span-2": big }, { "shadow-sm border dark:border-dark-muted-500 hover:shadow-lg hover:translate-y-px transition-all border-gray-100": !big })}>
                <div className="flex flex-row gap-2 relative items-center before:mr-3 before:bg-gray-300 before:h-9 before:relative before:rotate-12 before:w-px ">
                    <img alt={`The Author of the article: ${author?.login}}`} src={author?.avatar_url} className="rounded-full w-8 h-8 " />
                    {/* Todo add author profile link */}
                    <address className='font-bold text-gray-700 dark:text-dark-text-700 text-sm'><Link href={``} rel="author">{author?.login}</Link></address>
                </div>
                <header>
                    {<h2 className={clsx('font-bold group-hover:text-blue-500 dark:group-hover:text-dark-secondary-500 dark:hover:text-dark-secondary-500', { "text-4xl md:text-6xl": big }, { "text-xl": !big })}>
                        <Link href={`/blog/post/${slug}`}>{title}</Link>
                    </h2>}
                </header>
                <div className='flex flex-row flex-wrap gap-2'>
                    {categories.map((tag => {
                        return (
                            <div key={tag} className=' w-auto px-2 cursor-pointer dark:bg-dark-primary-500 bg-gray-200 text-gray-600 font-mono font-semibold text-sm'>{tag}</div>
                        )
                    }))}
                </div>
                {
                    big && <>
                        <p className='text-gray-600  dark:text-dark-text-600 text-xl'>
                            {description + "..."}
                        </p>
                        <button className='rounded-full w-auto self-start py-1 px-3 border-2 font-semibold border-blue-500 dark:border-dark-primary-500 '>
                            Continue Reading
                        </button>
                    </>
                }
            </article>
        )
    }
const PostsHome: React.FC<{
    count: number,
    mdPostsMeta: MdxMeta[],
    pageNumber: number
}> = ({ count, mdPostsMeta, pageNumber }) => {
    return (
        <>
            <NextSeo title={`Zagy - Home page ${pageNumber}`} description={`Zagy Home page number ${pageNumber}`} />
            <div>
                <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-14 md:px-28'>{
                    mdPostsMeta.map((post, i) => {
                        return (<PostCard key={post.title} {...post} big={i === 0 || i === 7} />)
                    })}
                </section>
                <nav className='flex m-auto justify-center items-center gap-5'>
                    {
                        pageNumber !== 1 &&
                        <button className='border-2 border-gray-400 px-2 py-1 rounded-full'>
                            <Link href={`/blog/${pageNumber - 1}`}>Previous Page</Link>
                        </button>
                    }
                    <ul className='flex flex-row list-none gap-2 text-gray-600 font-semibold items-center justify-center'>
                        <Pages pageCount={count} currentPage={pageNumber} />
                    </ul>
                    {
                        pageNumber !== count &&
                        <button className='border-2 border-gray-400 px-2 py-1 rounded-full'>
                            <Link href={`/blog/${pageNumber + 1}`}>Next Page</Link>
                        </button>
                    }
                </nav>
            </div>
        </>
    )
}
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}
export async function getStaticProps({ params }: { params: { pageNumber: string } }) {
    const { pageNumber } = params;
    const numPageNumber = Number(pageNumber) - 1;
    if (!pageNumber || Number.isNaN(numPageNumber) || numPageNumber < 0) {
        return {
            notFound: true
        }
    }
    const count = Math.ceil(await cache.getCount() / NUMBER_OF_POSTS_IN_A_PAGE);
    const postsMeta = await cache.getPostsByPage(numPageNumber);
    if (numPageNumber > count) {
        return {
            notFound: true
        }
    }
    console.log(postsMeta.length)
    const DAY_IN_SECONDS = 24 * 60 * 60;
    return {
        props: {
            mdPostsMeta: JSON.parse(JSON.stringify(postsMeta.map(i => i.meta))),
            count,
            pageNumber: numPageNumber + 1
        },
        revalidate: DAY_IN_SECONDS / 24
    }
}
export default PostsHome