/*
  Warnings:

  - A unique constraint covering the columns `[qoId]` on the table `OptionInterestWeights` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OptionInterestWeights_qoId_key" ON "OptionInterestWeights"("qoId");
