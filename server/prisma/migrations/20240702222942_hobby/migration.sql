/*
  Warnings:

  - You are about to drop the column `api` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hobby" ADD COLUMN     "api" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "api";
