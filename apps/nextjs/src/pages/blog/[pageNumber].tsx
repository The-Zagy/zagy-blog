import clsx from 'clsx';
import { GetStaticPaths } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { prisma } from "@acme/db";
import { AsyncReturnType } from "@acme/utils";
import { NUMBER_OF_POSTS_IN_A_PAGE } from '@acme/constants';
import { PostCard } from '~/components/post/DefaultPostCard';
// type MdxMeta = {
//     title: string,
//     description: string,
//     data: string,
//     slug: string,
//     bannerUrl: string,
//     categories?: string[]
//     meta: {
//         keywords: string[],
//     }
//     contributers: AsyncReturnType<typeof getContributers>
// }
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

const PostsHome: React.FC<{
    count: number,
    mdPostsMeta: PostMeta[],
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
export const getStaticPaths: GetStaticPaths<{ slug: string }> = () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}
const getPostsByPage = async (pageNumber: number) => {
    const postsMeta = await prisma.post.findMany({
        skip: pageNumber * NUMBER_OF_POSTS_IN_A_PAGE,
        take: NUMBER_OF_POSTS_IN_A_PAGE,
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            slug: true,
            title: true,
            contributors: {
                where: {
                    isAuthor: true
                },

                take: 1,
                select: {
                    contributor: {
                        select: {
                            handle: true,
                            image: true,
                        }
                    }
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true,
                        }
                    }
                }
            },
            description: true,
        }
    })
    return postsMeta;
}
type PostsMeta = AsyncReturnType<typeof getPostsByPage>;
type PostMeta = PostsMeta[0];
export async function getStaticProps({ params }: { params: { pageNumber: string } }) {
    const { pageNumber } = params;
    const numPageNumber = Number(pageNumber) - 1;
    if (!pageNumber || Number.isNaN(numPageNumber) || numPageNumber < 0) {
        return {
            notFound: true
        }
    }
    const count = Math.ceil(await prisma.post.count() / NUMBER_OF_POSTS_IN_A_PAGE);
    const postsMeta = await getPostsByPage(numPageNumber);
    // const postsMeta = await cache.getPostsByPage(numPageNumber);
    if (postsMeta.length === 0) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            mdPostsMeta: JSON.parse(JSON.stringify(postsMeta)) as PostMeta[],
            count,
            pageNumber: numPageNumber + 1
        },
    }
}
export default PostsHome