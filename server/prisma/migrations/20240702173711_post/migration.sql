-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "hobbyId" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" TEXT[],

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;
