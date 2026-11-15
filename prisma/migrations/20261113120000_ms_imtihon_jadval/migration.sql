-- CreateTable: Milliy Sertifikat scheduled exam configuration & cohort calibration
CREATE TABLE "MsImtihon" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sarlavha" TEXT NOT NULL,
    "tavsif" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "rejim" TEXT NOT NULL DEFAULT 'jadval',
    "vaqtMin" INTEGER NOT NULL DEFAULT 100,
    "faol" BOOLEAN NOT NULL DEFAULT true,
    "isAnnounced" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "kalibrlanganAt" TIMESTAMP(3),
    "kalibrlashUsuli" TEXT,
    "kalibrlashStats" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MsImtihon_pkey" PRIMARY KEY ("id")
);

-- AlterTable: Add scheduled exam reference, dual score fields, and publication state to MsUrinish
ALTER TABLE "MsUrinish"
ADD COLUMN "imtihonId" TEXT,
ADD COLUMN "infitMNSQ" DOUBLE PRECISION,
ADD COLUMN "outfitMNSQ" DOUBLE PRECISION,
ADD COLUMN "ishonchsiz" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "oddiyFoiz" DOUBLE PRECISION,
ADD COLUMN "oddiyBall" DOUBLE PRECISION,
ADD COLUMN "oddiyDaraja" TEXT,
ADD COLUMN "cohortRank" INTEGER,
ADD COLUMN "cohortTotal" INTEGER,
ADD COLUMN "percentile" DOUBLE PRECISION,
ADD COLUMN "certId" TEXT,
ADD COLUMN "holat" TEXT NOT NULL DEFAULT 'topshirildi';

-- AlterTable: Add question ID string and student's submitted answer value for post-publication review
ALTER TABLE "MsJavob"
ADD COLUMN "savolId" TEXT,
ADD COLUMN "berilganJavob" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MsImtihon_slug_key" ON "MsImtihon"("slug");
CREATE INDEX "MsImtihon_slug_idx" ON "MsImtihon"("slug");
CREATE INDEX "MsImtihon_faol_idx" ON "MsImtihon"("faol");
CREATE INDEX "MsImtihon_isAnnounced_idx" ON "MsImtihon"("isAnnounced");

CREATE UNIQUE INDEX "MsUrinish_certId_key" ON "MsUrinish"("certId");
CREATE INDEX "MsUrinish_imtihonId_idx" ON "MsUrinish"("imtihonId");
CREATE INDEX "MsUrinish_userId_imtihonId_idx" ON "MsUrinish"("userId", "imtihonId");

-- AddForeignKey
ALTER TABLE "MsUrinish" ADD CONSTRAINT "MsUrinish_imtihonId_fkey" FOREIGN KEY ("imtihonId") REFERENCES "MsImtihon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
