export const QuoteIcons: React.FC<{ className: string }> = ({ className }) => {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24">
        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
    </svg>
}
export const Quote: React.FC<{ children: string, author: string, href?: string }> = ({ author, children, href }) => {
    return (
        <blockquote
            cite={href || ""}
            className="border-l-8 text-lg font-semibold 
        border-l-sky-400 py-4 pl-12 text-gray-500 bg-gray-100
        dark:bg-dark-muted-400
        dark:text-dark-text-600
        dark:border-l-dark-primary-500-500
        rounded-sm
        ">
            <QuoteIcons className="mb-4 dark:fill-dark-text-500" />
            <div className="mb-4">
                {children}
            </div>
            <div className="text-black dark:text-dark-text-500 font-bold not-italic">{href ? <a href={href}>{author}</a> : author}</div>
        </blockquote>
    )

}
