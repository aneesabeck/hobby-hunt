/*
  Warnings:

  - You are about to drop the `OptionWeights` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OptionWeights" DROP CONSTRAINT "OptionWeights_hobbyId_fkey";

-- DropForeignKey
ALTER TABLE "OptionWeights" DROP CONSTRAINT "OptionWeights_qoId_fkey";

-- DropTable
DROP TABLE "OptionWeights";

-- CreateTable
CREATE TABLE "OptionHobbyWeights" (
    "id" SERIAL NOT NULL,
    "weight" INTEGER NOT NULL,
    "qoId" INTEGER NOT NULL,
    "hobbyId" INTEGER NOT NULL,

    CONSTRAINT "OptionHobbyWeights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionInterestWeights" (
    "id" SERIAL NOT NULL,
    "weight" INTEGER NOT NULL,
    "qoId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,

    CONSTRAINT "OptionInterestWeights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Interests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OptionHobbyWeights" ADD CONSTRAINT "OptionHobbyWeights_qoId_fkey" FOREIGN KEY ("qoId") REFERENCES "QuestionOptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionHobbyWeights" ADD CONSTRAINT "OptionHobbyWeights_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionInterestWeights" ADD CONSTRAINT "OptionInterestWeights_qoId_fkey" FOREIGN KEY ("qoId") REFERENCES "QuestionOptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionInterestWeights" ADD CONSTRAINT "OptionInterestWeights_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
