-- Maqola ko'rish/yuklash sanoqchilari.
-- Avval bu raqamlar public/data/maqolalar.json ichida statik yozilgan edi.

CREATE TABLE IF NOT EXISTS "ArticleStat" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleStat_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ArticleStat_articleId_key" ON "ArticleStat"("articleId");
CREATE INDEX IF NOT EXISTS "ArticleStat_views_idx" ON "ArticleStat"("views");
