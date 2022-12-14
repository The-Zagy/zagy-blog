import OutputPosts from "./outputPosts/OutputPosts";
import SearchBar from "./searchBar/SearchBar";
import { useState } from "react";
import TagsBox from "./tagsBox/TagsBox";
import { trpc } from "../../utils/trpc";
import { DefaultSpinner } from "../defaultSpinner/DefaultSpinner";
import { SearchBox } from "./searchbox/Searchbox";
import { useDebounce } from "use-debounce";


export const SearchPosts = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [debouncedSearchInput] = useDebounce(searchInput, 100);
    const [debouncedSelectedTags] = useDebounce(selectedTags, 200);
    const posts = trpc.posts.getPosts.useQuery({ ids: debouncedSelectedTags, searchInput: debouncedSearchInput }, { enabled: !!selectedTags || !!debouncedSearchInput });
    function Output() {
        if (posts.isInitialLoading) {
            return <div></div>
        }
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
            <div></div>
            <SearchBar >
                <SearchBox searchInput={searchInput} setSearchInput={setSearchInput} />
                <TagsBox selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            </SearchBar >
            <Output />
        </div>
    )
}