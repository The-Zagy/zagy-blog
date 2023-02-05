import OutputPosts from "./outputPosts/OutputPosts";
import SearchBar from "./searchBar/SearchBar";
import { useState } from "react";
import TagsBox from "./tagsBox/TagsBox";
import { api } from "~/utils/api";
import { DefaultSpinner } from "../defaultSpinner/DefaultSpinner";
import { SearchBox } from "./searchbox/Searchbox";
import { useDebounce } from "use-debounce";
import LatestPosts from "../latestPosts";


export const SearchPosts = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [debouncedSearchInput] = useDebounce(searchInput, 100);
    const [debouncedSelectedTags] = useDebounce(selectedTags, 200);
    const posts = api.posts.getPosts.useQuery({ ids: debouncedSelectedTags, searchInput: debouncedSearchInput }, { enabled: !!selectedTags || !!debouncedSearchInput });
    function Output() {
        if (debouncedSearchInput === "" && debouncedSelectedTags.length === 0) return (
            <LatestPosts />
        )
        if (posts.isLoading) {
            return <div><DefaultSpinner /></div>;
        }
        if (posts.isError) {
            return <div>Something went wrong please try again</div>
        }
        if (posts.isSuccess) {
            if (posts.data.length === 0) {
                return <div>No posts matched this query</div>
            }
            return <OutputPosts posts={posts.data} />
        }

        return <div></div>

    }

    return (
        <div className="flex flex-col justify-center items-center max-w-7xl gap-5">
            <div></div>
            <SearchBar >
                <SearchBox searchInput={searchInput} setSearchInput={setSearchInput} />
                <TagsBox selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            </SearchBar >
            <Output />
        </div>
    )
}