const UserCard = () => {
    return (
        <div className="flex gap-6">
        <img src={"https://via.placeholder.com/50x50"} alt={"userPic"} className={"rounded-full w-15 h-15"} />
        <div className={"authorName flex-col"} >
            <span className={"font-thin"}>Written By</span>
            <p>Nagy Nabil</p>
        </div>
        <div className={"postDate flex-col"} >
            <span className="font-thin">Posted On</span>
            <p>October 4, 2022</p>
        </div>
        </div>
    );
}
const PostHeader = () => {
    return (
        <div className={"flex flex-col gap-y-3  items-center justify-center "}>
            <h1 className="text-center text-4xl ">Want Someone to Keep Reading Your Blog Post? A Guide to Get Readers Glued to the Screen</h1>
            <UserCard />
            <img src={"https://via.placeholder.com/500x200"} alt="postImage" className="w-4/6" />
        </div>
    );
}
const Post = () => {
    return (
        <div className=" w-8/12 flex flex-col gap-y-6 items-center justify-center" >
            <PostHeader />
            <main className="postContent text-center font-light">
                Typically, some sessions fly by and others quickly make you decide:

“Now’s a good time to go to the bathroom and get a snack.”

That thought’s also common during online conferences or webinars.

While a number of factors influence whether you’re paying attention or daydreaming, a common reason for the Bathroom-Snack-Train-of-Thought is that the speaker didn’t make their presentation audience-focused.

They didn’t distance themselves from their topic and find ways to make an audience member’s experience a fascinating one. The words they chose to lead with may have been relevant and informative, but they didn’t stir up the desire to keep listening.

This scenario is directly related to your job as a content writer … how do you stir up the desire to keep reading?

How to persuade someone to keep reading
Content editors structure writing like a killer presentation.

And how you shape that presentation determines whether someone wants to learn from you — or from someone else.

“Action” in our writing introductions can take a variety of forms, but it’s one of the main elements of engaging writing that keeps a reader glued to the screen. When a reader has an “active” experience, rather than a “passive” experience, you stir up the desire to keep reading.

Let’s look at three of these “Action Types” that help you avoid common content marketing mistakes. They place your reader front and center of the presentation that you’ve crafted for them.</main>  
        </div>
    );
}
export default Post;