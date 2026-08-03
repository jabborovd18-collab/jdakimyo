-- Shaxsiy chat: suhbatlar, xabarlar, bloklash va shikoyat.
--
-- Do'stlar bir-biriga to'g'ridan-to'g'ri yozadi; do'st bo'lmagan odamning
-- xabari "so'rov" bo'lib tushadi (Instagram naqshi).
--
-- Xabar YUMSHOQ o'chiriladi: matn bazada qoladi, chunki o'chirilgan xabar
-- ustidan shikoyat kelishi mumkin va admin nima yozilganini ko'rishi kerak.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "chatWarnings"      INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "chatBlockedUntil"  TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "chatBlockedReason" TEXT;

CREATE TABLE IF NOT EXISTS "Conversation" (
  "id"           TEXT NOT NULL,
  "user1Id"      TEXT NOT NULL,
  "user2Id"      TEXT NOT NULL,
  "holat"        TEXT NOT NULL DEFAULT 'faol',
  "boshlovchiId" TEXT NOT NULL,
  "oxirgiXabar"  TIMESTAMP(3),
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Conversation_user1Id_user2Id_key" ON "Conversation"("user1Id", "user2Id");
CREATE INDEX IF NOT EXISTS "Conversation_user1Id_oxirgiXabar_idx" ON "Conversation"("user1Id", "oxirgiXabar");
CREATE INDEX IF NOT EXISTS "Conversation_user2Id_oxirgiXabar_idx" ON "Conversation"("user2Id", "oxirgiXabar");

CREATE TABLE IF NOT EXISTS "Message" (
  "id"             TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "senderId"       TEXT NOT NULL,
  "matn"           TEXT NOT NULL,
  "oqilgan"        BOOLEAN NOT NULL DEFAULT false,
  "ochirilgan"     BOOLEAN NOT NULL DEFAULT false,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");
CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");

CREATE TABLE IF NOT EXISTS "UserBlock" (
  "id"        TEXT NOT NULL,
  "blockerId" TEXT NOT NULL,
  "blockedId" TEXT NOT NULL,
  "sabab"     TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "UserBlock_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserBlock_blockerId_blockedId_key" ON "UserBlock"("blockerId", "blockedId");
CREATE INDEX IF NOT EXISTS "UserBlock_blockedId_idx" ON "UserBlock"("blockedId");

CREATE TABLE IF NOT EXISTS "ChatReport" (
  "id"             TEXT NOT NULL,
  "reporterId"     TEXT NOT NULL,
  "reportedId"     TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "sabab"          TEXT NOT NULL,
  "holat"          TEXT NOT NULL DEFAULT 'yangi',
  "korganAdminId"  TEXT,
  "korilganVaqt"   TIMESTAMP(3),
  "adminIzohi"     TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ChatReport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ChatReport_holat_createdAt_idx" ON "ChatReport"("holat", "createdAt");
CREATE INDEX IF NOT EXISTS "ChatReport_reportedId_idx" ON "ChatReport"("reportedId");

DO $$ BEGIN
  ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user1Id_fkey"
    FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user2Id_fkey"
    FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey"
    FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey"
    FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockerId_fkey"
    FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockedId_fkey"
    FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ChatReport" ADD CONSTRAINT "ChatReport_reporterId_fkey"
    FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ChatReport" ADD CONSTRAINT "ChatReport_reportedId_fkey"
    FOREIGN KEY ("reportedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
