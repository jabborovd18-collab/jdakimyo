-- Mijoz bir so'rovni qayta yuborsa ham XP faqat bir marta berilishi uchun
-- server yaratgan urinish kaliti natija bilan birga saqlanadi.
ALTER TABLE "QuizResult" ADD COLUMN "attemptId" TEXT;

CREATE UNIQUE INDEX "QuizResult_attemptId_key" ON "QuizResult"("attemptId");

ALTER TABLE "TeacherQuizAttempt" ADD COLUMN "attemptId" TEXT;

CREATE UNIQUE INDEX "TeacherQuizAttempt_attemptId_key" ON "TeacherQuizAttempt"("attemptId");
