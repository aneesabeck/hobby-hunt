/*
  Warnings:

  - You are about to drop the column `createdAt` on the `QuestionUserAnswers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuestionUserAnswers" DROP COLUMN "createdAt",
ADD COLUMN     "questionId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "QuestionUserAnswers" ADD CONSTRAINT "QuestionUserAnswers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
