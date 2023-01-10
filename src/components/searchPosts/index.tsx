import OutputPosts from "./outputPosts/OutputPosts";
import SearchBar from "./searchBar/SearchBar";
import { useState } from "react";
import TagsBox from "./tagsBox/TagsBox";
import { trpc } from "../../utils/trpc";
import { DefaultSpinner } from "../defaultSpinner/DefaultSpinner";


export const SearchPosts = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    // const [searchInput, setSearchInput] = useState<string>("");
    const posts = trpc.posts.getPostsByTags.useQuery(selectedTags);
    function Output() {
        if (posts.isLoading) {
            return <DefaultSpinner />;
        }
        if (posts.isError) {
            return <div>Something went wrong please try again</div>
        }
        if (posts.isSuccess) {
            return <OutputPosts posts={posts.data} />
        }

        return <div></div>

    }

    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <SearchBar >
                <TagsBox selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                {/* <SearchBox searchInput={searchInput} setSearchInput={setSearchInput}/> */}
            </SearchBar >
            <Output />
        </div>
    )
}