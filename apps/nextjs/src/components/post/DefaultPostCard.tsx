import clsx from "clsx";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";
type PostMeta = RouterOutputs["posts"]["getPosts"][0]
export const PostCard: React.FC<PostMeta & { big: boolean }> =
    ({ title, contributors, tags = [], description, big, slug }) => {
        // contributors is array because of prisma return array not one 
        const author = contributors[0]?.contributor;
        return (
            <article className={clsx('flex flex-col w-full p-6 gap-3 group', { "md:col-span-2 lg:col-span-2 row-span-2": big }, { "shadow-sm border dark:border-dark-muted-500 hover:shadow-lg hover:translate-y-px transition-all border-gray-100": !big })}>
                <div className="flex flex-row gap-2 relative items-center before:mr-3 before:bg-gray-300 before:h-9 before:relative before:rotate-12 before:w-px ">
                    <img alt={`The Author of the article: ${author?.handle || "author"}}`} src={author?.image} className="rounded-full w-8 h-8 " />
                    {/* Todo add author profile link */}
                    <address className='font-bold text-gray-700 dark:text-dark-text-700 text-sm'><Link href={`/blog/author/${String(author?.handle)}`} rel="author">{author?.handle}</Link></address>
                </div>
                <header>
                    {<h2 className={clsx('font-bold group-hover:text-blue-500 dark:group-hover:text-dark-secondary-500 dark:hover:text-dark-secondary-500', { "text-4xl md:text-6xl": big }, { "text-xl": !big })}>
                        <Link href={`/blog/post/${slug}`}>{title}</Link>
                    </h2>}
                </header>
                <div className='flex flex-row flex-wrap gap-2'>
                    {tags.map((tag => {
                        return (
                            <div key={tag.tag.name} className=' w-auto px-2 cursor-pointer dark:bg-dark-primary-500 bg-gray-200 text-gray-600 font-mono font-semibold text-sm'>{tag.tag.name}</div>
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