import { GetStaticPaths } from 'next';
import Link from 'next/link';
import React from 'react';
import { prisma } from '../../server/db/client';

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
            author: true,
            breif: true,
        }
    })
    return posts;
}
const getPostsCount = async () => {
    const count = await prisma.post.count()
    return count;
}
const PostsHome: React.FC<{
    posts: {
        title: string;
        image: string;
        author: string;
        tags: string[];
        createdAt: string;
        breif: string;
    }[],
    count: number,
    pageNumber: number
}> = ({ posts, count, pageNumber }) => {
    return (
        <div>

        </div>
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
    let posts = await getAllPosts(+pageNumber * 10, 10);
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
        revalidate: DAY_IN_SECONDS
    }
}
export default PostsHome