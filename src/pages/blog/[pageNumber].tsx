import clsx from 'clsx';
import { GetStaticPaths } from 'next';
import Link from 'next/link';
import React from 'react';
import { prisma } from '../../server/db/client';
import { AsyncReturnType } from '../../utils/ts-bs';
const getAllPosts = async (start: number, count: number) => {
    const posts = await prisma.post.findMany({
        skip: start,
        take: count,
        select: {
            image: true,
            title: true,
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true,
                        }
                    }
                }
            },
            createdAt: true,
            author: {
                select: {
                    name: true,
                    image: true,
                    userName: true,

                }
            },
            breif: true,
        }
    })
    return posts;
}
type PostData = AsyncReturnType<typeof getAllPosts>[0]

const getPostsCount = async () => {
    const count = await prisma.post.count()
    return count;
}
const PostCard: React.FC<PostData & { big: boolean }> = ({ image, author, title, tags, createdAt, breif, big }) => {
    console.log(author)
    return (
        <article className={clsx('flex flex-col w-full p-6 gap-3 group', { "md:col-span-2 lg:col-span-2 row-span-2": big }, { "shadow-sm border hover:shadow-lg hover:translate-y-px transition-all border-gray-100": !big })}>
            <div className="flex flex-row gap-2 relative items-center before:mr-3 before:bg-gray-300 before:h-9 before:relative before:rotate-12 before:w-px ">
                <img src={author.image} className="rounded-full w-8 h-8" />
                <address className='font-bold text-gray-700 text-sm'><Link href="" rel="author">{author.name}</Link></address>
            </div>
            <header>
                {<h2 className={clsx('font-bold group-hover:text-blue-500', { "text-6xl": big }, { "text-xl": !big })}><Link href="">{title}</Link></h2>}
            </header>

            <div className='flex flex-row flex-wrap gap-2'>
                {tags.map((tag => {
                    return (
                        <div className=' w-auto px-2 cursor-pointer bg-gray-200 text-gray-600 font-mono font-semibold text-sm'>{tag.tag.name}</div>
                    )
                }))}
            </div>
            {
                big && <>
                    <p className='text-gray-600 text-xl'>
                        {breif + "..."}
                    </p>
                    <button className='rounded-full w-auto self-start py-1 px-3 border-2 font-semibold border-blue-500 '>
                        Continue Reading
                    </button>
                </>
            }
        </article>)
}
const PostsHome: React.FC<{
    posts: PostData[],
    count: number,
    pageNumber: number
}> = ({ posts, count, pageNumber }) => {

    return (
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-14 md:px-28'>{
            posts.map((post, i) => {
                return (<PostCard {...post} big={i === 0 || i === 7} />)
            })}
        </section>
    )
}
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}
export async function getStaticProps({ params }: { params: { pageNumber: string } }) {
    let { pageNumber } = params;
    console.log(pageNumber)
    let posts = await getAllPosts(+pageNumber * 12, 12);
    if (posts.length === 0) {
        return {
            notFound: true
        }
    }
    let count = await getPostsCount()
    const DAY_IN_SECONDS = 24 * 60 * 60;
    return {
        props: {
            posts: JSON.parse(JSON.stringify(posts)),
            count,
            pageNumber
        },
        revalidate: DAY_IN_SECONDS / 24
    }
}
export default PostsHome