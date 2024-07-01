-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hobbyId" INTEGER;

-- CreateTable
CREATE TABLE "Hobby" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "interests" TEXT[],

    CONSTRAINT "Hobby_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hobby_name_key" ON "Hobby"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("id") ON DELETE SET NULL ON UPDATE CASCADE;
