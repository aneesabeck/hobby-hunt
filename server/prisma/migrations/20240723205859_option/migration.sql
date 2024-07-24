/*
  Warnings:

  - You are about to drop the column `qoId` on the `OptionHobbyWeights` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OptionHobbyWeights" DROP CONSTRAINT "OptionHobbyWeights_qoId_fkey";

-- AlterTable
ALTER TABLE "OptionHobbyWeights" DROP COLUMN "qoId";
