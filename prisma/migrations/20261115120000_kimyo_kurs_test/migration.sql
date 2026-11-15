CREATE TABLE "KimyoKursTest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sana" TEXT NOT NULL,
  "sarlavha" TEXT NOT NULL,
  "mavzular" TEXT NOT NULL,
  "savollar" JSONB NOT NULL,
  "ochiladi" TIMESTAMP(3) NOT NULL,
  "yopiladi" TIMESTAMP(3) NOT NULL,
  "nashrVaqti" TIMESTAMP(3)
);

CREATE UNIQUE INDEX "KimyoKursTest_sana_key" ON "KimyoKursTest"("sana");
CREATE INDEX "KimyoKursTest_nashrVaqti_ochiladi_idx" ON "KimyoKursTest"("nashrVaqti", "ochiladi");

CREATE TABLE "KimyoKursUrinish" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "testId" TEXT NOT NULL,
  "topshirishId" TEXT NOT NULL,
  "ism" TEXT NOT NULL,
  "familiya" TEXT NOT NULL,
  "javoblar" JSONB NOT NULL,
  "ball" INTEGER NOT NULL,
  "topshirildi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "KimyoKursUrinish_testId_fkey" FOREIGN KEY ("testId") REFERENCES "KimyoKursTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "KimyoKursUrinish_testId_topshirishId_key" ON "KimyoKursUrinish"("testId", "topshirishId");
CREATE INDEX "KimyoKursUrinish_testId_topshirildi_id_idx" ON "KimyoKursUrinish"("testId", "topshirildi", "id");
