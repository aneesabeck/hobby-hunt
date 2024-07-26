/*
  Warnings:

  - You are about to drop the column `interestModelId` on the `Hobby` table. All the data in the column will be lost.
  - Added the required column `interestId` to the `Hobby` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Hobby" DROP CONSTRAINT "Hobby_interestModelId_fkey";

-- AlterTable
ALTER TABLE "Hobby" DROP COLUMN "interestModelId",
ADD COLUMN     "interestId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Hobby" ADD CONSTRAINT "Hobby_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
