/*
  Warnings:

  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `breif` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `TagsOnPosts` table. All the data in the column will be lost.
  - You are about to drop the column `brief` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - Added the required column `bannerUrl` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubPath` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handle` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_authorId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_userName_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
DROP COLUMN "breif",
DROP COLUMN "content",
DROP COLUMN "image",
ADD COLUMN     "bannerUrl" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "githubPath" TEXT NOT NULL,
ADD COLUMN     "keyWords" TEXT[];

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "authorId",
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TagsOnPosts" DROP COLUMN "assignedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "brief",
DROP COLUMN "description",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "userName",
ADD COLUMN     "handle" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "contributorsOnPosts" (
    "postId" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "isAuthor" BOOLEAN NOT NULL,

    CONSTRAINT "contributorsOnPosts_pkey" PRIMARY KEY ("postId","contributorId","isAuthor")
);

-- AddForeignKey
ALTER TABLE "contributorsOnPosts" ADD CONSTRAINT "contributorsOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributorsOnPosts" ADD CONSTRAINT "contributorsOnPosts_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
