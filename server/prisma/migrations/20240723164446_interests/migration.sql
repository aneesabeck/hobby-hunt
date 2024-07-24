-- AlterTable
ALTER TABLE "Hobby" ADD COLUMN     "interestModelId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Hobby" ADD CONSTRAINT "Hobby_interestModelId_fkey" FOREIGN KEY ("interestModelId") REFERENCES "Interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
