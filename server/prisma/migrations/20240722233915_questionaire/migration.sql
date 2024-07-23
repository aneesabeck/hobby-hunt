-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOptions" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "questionOption" TEXT NOT NULL,

    CONSTRAINT "QuestionOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionUserAnswers" (
    "id" SERIAL NOT NULL,
    "questionOptionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "QuestionUserAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionWeights" (
    "id" SERIAL NOT NULL,
    "weight" INTEGER NOT NULL,
    "qoId" INTEGER NOT NULL,
    "hobbyId" INTEGER NOT NULL,

    CONSTRAINT "OptionWeights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionOptions" ADD CONSTRAINT "QuestionOptions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserAnswers" ADD CONSTRAINT "QuestionUserAnswers_questionOptionId_fkey" FOREIGN KEY ("questionOptionId") REFERENCES "QuestionOptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserAnswers" ADD CONSTRAINT "QuestionUserAnswers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionWeights" ADD CONSTRAINT "OptionWeights_qoId_fkey" FOREIGN KEY ("qoId") REFERENCES "QuestionOptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionWeights" ADD CONSTRAINT "OptionWeights_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
