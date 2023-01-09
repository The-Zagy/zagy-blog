/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[githubPath]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TagsOnPosts" DROP CONSTRAINT "TagsOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "contributorsOnPosts" DROP CONSTRAINT "contributorsOnPosts_postId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id", "githubPath");

-- CreateIndex
CREATE UNIQUE INDEX "Post_githubPath_key" ON "Post"("githubPath");

-- AddForeignKey
ALTER TABLE "contributorsOnPosts" ADD CONSTRAINT "contributorsOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("githubPath") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPosts" ADD CONSTRAINT "TagsOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("githubPath") ON DELETE RESTRICT ON UPDATE CASCADE;
