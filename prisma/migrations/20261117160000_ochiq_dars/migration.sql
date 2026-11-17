CREATE TABLE "OchiqDars" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "nom" TEXT NOT NULL,
  "kirishKodi" TEXT NOT NULL DEFAULT 'KALLOID-2026',
  "vaqtLimitSoniya" INTEGER NOT NULL DEFAULT 600,
  "savolSoni" INTEGER NOT NULL DEFAULT 20,
  "faol" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "OchiqDars_slug_key" ON "OchiqDars"("slug");

CREATE TABLE "OchiqDarsIshtirokchi" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "darsId" TEXT NOT NULL,
  "ism" TEXT NOT NULL,
  "qrToken" TEXT NOT NULL,
  "holat" TEXT NOT NULL DEFAULT 'kutmoqda',
  "savolIndekslari" JSONB,
  "variantTartibi" JSONB,
  "javoblar" JSONB,
  "boshlanganVaqt" TIMESTAMP(3),
  "yakunlanganVaqt" TIMESTAMP(3),
  "foiz" DOUBLE PRECISION,
  "sarflanganSoniya" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OchiqDarsIshtirokchi_darsId_fkey" FOREIGN KEY ("darsId") REFERENCES "OchiqDars"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "OchiqDarsIshtirokchi_qrToken_key" ON "OchiqDarsIshtirokchi"("qrToken");
CREATE INDEX "OchiqDarsIshtirokchi_darsId_holat_idx" ON "OchiqDarsIshtirokchi"("darsId", "holat");
CREATE INDEX "OchiqDarsIshtirokchi_darsId_ism_idx" ON "OchiqDarsIshtirokchi"("darsId", "ism");
