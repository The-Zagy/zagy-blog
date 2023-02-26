import { createPostsFilter } from "../handlers/revalidate";

describe("create download/delete filter", () => {
    test('add "in folder and in base dir", and delete "from base dir and from folder but not deleting the mdx from the folder"', () => {
        const test1 = {
            added: ["content/blog/post1.mdx", "content/blog/myPost/post2.mdx"],
            modified: [],
            deleted: [
                "content/blog/post3.mdx",
                "content/blog/oldPost/component.ts",
            ],
            renamed: [],
        };
        // filter contain the full path for the post
        const testDownloadFilter = {
            "content/blog/post1.mdx": 1,
            "content/blog/myPost": 1,
            "content/blog/oldPost": 1,
        };
        // delete filter contain only the slug for the post
        const testDeleteFilter = ["post3"];
        const ans = createPostsFilter(test1);
        expect(ans.deleteFilter).toStrictEqual(testDeleteFilter);
        expect(ans.downloadFilter).toStrictEqual(testDownloadFilter);
    });

    test('delete "from base dir and from folder with deleting the .mdx file"', () => {
        const test2 = {
            added: ["content/blog/myPost/com.ts"],
            modified: [],
            deleted: [
                "content/blog/myBlog/index.mdx",
                "content/blog/myBlog/com.ts",
            ],
            renamed: [],
        };
        const testDownloadFilter = {
            "content/blog/myPost": 1,
            "content/blog/myBlog": 0,
        };
        // delete filter contain only the slug for the post
        const testDeleteFilter = ["myBlog"];
        const ans = createPostsFilter(test2);
        expect(ans.deleteFilter).toStrictEqual(testDeleteFilter);
        expect(ans.downloadFilter).toStrictEqual(testDownloadFilter);
    });
});
