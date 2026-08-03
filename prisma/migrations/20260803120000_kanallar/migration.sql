-- Hamkor kanallari: lenta, video darsliklar va obunalar.
--
-- Kanalni faqat superadmin ochadi va egasini tayinlaydi (egaId).
-- Hamkor uni to'ldiradi. Shu sababli bu yerda "so'rov" yoki "tasdiqlash"
-- holati yo'q — kanal yaratilgan bo'lsa, u allaqachon tasdiqlangan.

CREATE TABLE IF NOT EXISTS "Channel" (
  "id"        TEXT NOT NULL,
  "slug"      TEXT NOT NULL,
  "nom"       TEXT NOT NULL,
  "tavsif"    TEXT,
  "avatar"    TEXT,
  "banner"    TEXT,
  "turi"      TEXT NOT NULL DEFAULT 'talim',

  "ochiq"     BOOLEAN NOT NULL DEFAULT true,
  "tavsiyada" BOOLEAN NOT NULL DEFAULT false,
  "faol"      BOOLEAN NOT NULL DEFAULT true,

  "egaId"     TEXT NOT NULL,

  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Channel_slug_key" ON "Channel"("slug");
CREATE INDEX IF NOT EXISTS "Channel_ochiq_faol_idx" ON "Channel"("ochiq", "faol");
CREATE INDEX IF NOT EXISTS "Channel_egaId_idx" ON "Channel"("egaId");
CREATE INDEX IF NOT EXISTS "Channel_tavsiyada_idx" ON "Channel"("tavsiyada");

CREATE TABLE IF NOT EXISTS "ChannelPost" (
  "id"        TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "sarlavha"  TEXT NOT NULL,
  "matn"      TEXT NOT NULL,
  "rasm"      TEXT,
  "nashr"     BOOLEAN NOT NULL DEFAULT true,
  "korishlar" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ChannelPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ChannelPost_channelId_createdAt_idx" ON "ChannelPost"("channelId", "createdAt");

CREATE TABLE IF NOT EXISTS "ChannelVideo" (
  "id"        TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "sarlavha"  TEXT NOT NULL,
  "tavsif"    TEXT,
  "videoUrl"  TEXT NOT NULL,
  "thumbnail" TEXT,
  "tartib"    INTEGER NOT NULL DEFAULT 0,
  "nashr"     BOOLEAN NOT NULL DEFAULT true,
  "korishlar" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ChannelVideo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ChannelVideo_channelId_tartib_idx" ON "ChannelVideo"("channelId", "tartib");

CREATE TABLE IF NOT EXISTS "ChannelSubscription" (
  "id"        TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ChannelSubscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ChannelSubscription_channelId_userId_key" ON "ChannelSubscription"("channelId", "userId");
CREATE INDEX IF NOT EXISTS "ChannelSubscription_userId_idx" ON "ChannelSubscription"("userId");

DO $$
BEGIN
  ALTER TABLE "Channel" ADD CONSTRAINT "Channel_egaId_fkey"
    FOREIGN KEY ("egaId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "ChannelPost" ADD CONSTRAINT "ChannelPost_channelId_fkey"
    FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "ChannelVideo" ADD CONSTRAINT "ChannelVideo_channelId_fkey"
    FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "ChannelSubscription" ADD CONSTRAINT "ChannelSubscription_channelId_fkey"
    FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "ChannelSubscription" ADD CONSTRAINT "ChannelSubscription_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
