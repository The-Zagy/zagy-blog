-- DropForeignKey
ALTER TABLE "TagsOnPosts" DROP CONSTRAINT "TagsOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "contributorsOnPosts" DROP CONSTRAINT "contributorsOnPosts_postId_fkey";

-- AddForeignKey
ALTER TABLE "contributorsOnPosts" ADD CONSTRAINT "contributorsOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPosts" ADD CONSTRAINT "TagsOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
