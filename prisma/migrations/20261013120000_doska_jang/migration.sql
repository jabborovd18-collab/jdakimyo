-- Smart Doska — Jamoalar Jangi xonalarini xotiradan bazaga ko'chirish.
-- Sabab: Vercel serverless'da xotiradagi xona boshqa nusxadan ko'rinmaydi
-- va o'quvchilar tasodifiy 404 oladi. Batafsil: schema.prisma'dagi izoh.
CREATE TABLE IF NOT EXISTS "DoskaXona" (
  "xonaId" TEXT NOT NULL,
  "mavzuId" TEXT NOT NULL,
  "holat" TEXT NOT NULL DEFAULT 'lobby',
  "jamoalarSoni" INTEGER NOT NULL,
  "jamoalar" JSONB NOT NULL,
  "jonliLenta" JSONB NOT NULL DEFAULT '[]',
  "ustozKalitHash" TEXT NOT NULL,
  "boshlanganVaqt" TIMESTAMP WITH TIME ZONE,
  "yaratilganVaqt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DoskaXona_pkey" PRIMARY KEY ("xonaId")
);

CREATE INDEX IF NOT EXISTS "DoskaXona_yaratilganVaqt_idx" ON "DoskaXona"("yaratilganVaqt");

CREATE TABLE IF NOT EXISTS "DoskaQatnashchi" (
  "id" TEXT NOT NULL,
  "xonaId" TEXT NOT NULL,
  "ism" TEXT NOT NULL,
  "jamoaId" INTEGER NOT NULL,
  "ball" INTEGER NOT NULL DEFAULT 0,
  "sarflanganVaqt" INTEGER NOT NULL DEFAULT 0,
  "qoidabuzarliklar" INTEGER NOT NULL DEFAULT 0,
  "boshlanganVaqt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "oxirgiSavolVaqti" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "savollar" JSONB NOT NULL,
  "chetlatildi" BOOLEAN NOT NULL DEFAULT false,
  "tugatdi" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "DoskaQatnashchi_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DoskaQatnashchi_xonaId_fkey" FOREIGN KEY ("xonaId") REFERENCES "DoskaXona"("xonaId") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "DoskaQatnashchi_xonaId_idx" ON "DoskaQatnashchi"("xonaId");

CREATE TABLE IF NOT EXISTS "DoskaJavob" (
  "id" TEXT NOT NULL,
  "qatnashchiId" TEXT NOT NULL,
  "savolId" INTEGER NOT NULL,
  "tanlanganIndex" INTEGER NOT NULL,
  "togri" BOOLEAN NOT NULL,
  "ball" INTEGER NOT NULL,
  "sarflangan" INTEGER NOT NULL DEFAULT 0,
  "qoidaBuzildi" BOOLEAN NOT NULL DEFAULT false,
  "vaqt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DoskaJavob_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DoskaJavob_qatnashchiId_fkey" FOREIGN KEY ("qatnashchiId") REFERENCES "DoskaQatnashchi"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "DoskaJavob_qatnashchiId_savolId_key" UNIQUE ("qatnashchiId", "savolId")
);

CREATE INDEX IF NOT EXISTS "DoskaJavob_qatnashchiId_idx" ON "DoskaJavob"("qatnashchiId");
