/*
  Warnings:

  - Added the required column `qoId` to the `OptionHobbyWeights` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptionHobbyWeights" ADD COLUMN     "qoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OptionHobbyWeights" ADD CONSTRAINT "OptionHobbyWeights_qoId_fkey" FOREIGN KEY ("qoId") REFERENCES "QuestionOptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
