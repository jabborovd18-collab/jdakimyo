-- QuizResult pin/yashirish ustunlari (idempotent: DB da allaqachon bor bo'lsa o'tkazib yuboradi)
ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "isPinned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "pinnedAt" TIMESTAMP(3);
ALTER TABLE "QuizResult" ADD COLUMN IF NOT EXISTS "isHidden" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "QuizResult_userId_isHidden_isPinned_pinnedAt_completedAt_idx" ON "QuizResult"("userId", "isHidden", "isPinned", "pinnedAt", "completedAt");

-- Conversation qadash ustunlari (idempotent)
ALTER TABLE "Conversation" ADD COLUMN IF NOT EXISTS "user1PinnedAt" TIMESTAMP(3);
ALTER TABLE "Conversation" ADD COLUMN IF NOT EXISTS "user2PinnedAt" TIMESTAMP(3);

-- Message javob bog'lanishi (idempotent)
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "replyToId" TEXT;
CREATE INDEX IF NOT EXISTS "Message_replyToId_idx" ON "Message"("replyToId");
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Message_replyToId_fkey') THEN
    ALTER TABLE "Message"
      ADD CONSTRAINT "Message_replyToId_fkey"
      FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- ProfilePost ustunlari va indekslari
ALTER TABLE "ProfilePost" ADD COLUMN IF NOT EXISTS "isPinned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ProfilePost" ADD COLUMN IF NOT EXISTS "pinnedAt" TIMESTAMP(3);
ALTER TABLE "ProfilePost" ADD COLUMN IF NOT EXISTS "teg" TEXT;
CREATE INDEX IF NOT EXISTS "ProfilePost_userId_isPinned_pinnedAt_createdAt_idx" ON "ProfilePost"("userId", "isPinned", "pinnedAt", "createdAt");
CREATE INDEX IF NOT EXISTS "ProfilePost_teg_createdAt_idx" ON "ProfilePost"("teg", "createdAt");
CREATE INDEX IF NOT EXISTS "ProfilePost_createdAt_idx" ON "ProfilePost"("createdAt");

-- ProfilePostLike jadvali
CREATE TABLE IF NOT EXISTS "ProfilePostLike" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProfilePostLike_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ProfilePostLike_postId_idx" ON "ProfilePostLike"("postId");
CREATE INDEX IF NOT EXISTS "ProfilePostLike_userId_idx" ON "ProfilePostLike"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "ProfilePostLike_postId_userId_key" ON "ProfilePostLike"("postId", "userId");
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProfilePostLike_postId_fkey') THEN
    ALTER TABLE "ProfilePostLike"
      ADD CONSTRAINT "ProfilePostLike_postId_fkey"
      FOREIGN KEY ("postId") REFERENCES "ProfilePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProfilePostLike_userId_fkey') THEN
    ALTER TABLE "ProfilePostLike"
      ADD CONSTRAINT "ProfilePostLike_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ProfileStory va ProfileStoryView jadvallari (idempotent)
CREATE TABLE IF NOT EXISTS "ProfileStory" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "turi" TEXT NOT NULL DEFAULT 'dolzarb',
  "uslub" TEXT NOT NULL DEFAULT 'kosmik',
  "matn" TEXT NOT NULL,
  "postId" TEXT,
  "postMatn" TEXT,
  "postTeg" TEXT,
  "postMuallifId" TEXT,
  "postMuallifUserId" TEXT,
  "postMuallifUsername" TEXT,
  "postMuallifIsm" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProfileStory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ProfileStory_expiresAt_idx" ON "ProfileStory"("expiresAt");
CREATE INDEX IF NOT EXISTS "ProfileStory_userId_expiresAt_idx" ON "ProfileStory"("userId", "expiresAt");
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProfileStory_userId_fkey') THEN
    ALTER TABLE "ProfileStory"
      ADD CONSTRAINT "ProfileStory_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "ProfileStoryView" (
  "id" TEXT NOT NULL,
  "storyId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "yoqdi" BOOLEAN NOT NULL DEFAULT false,
  "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProfileStoryView_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ProfileStoryView_storyId_idx" ON "ProfileStoryView"("storyId");
CREATE UNIQUE INDEX IF NOT EXISTS "ProfileStoryView_storyId_userId_key" ON "ProfileStoryView"("storyId", "userId");
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProfileStoryView_storyId_fkey') THEN
    ALTER TABLE "ProfileStoryView"
      ADD CONSTRAINT "ProfileStoryView_storyId_fkey"
      FOREIGN KEY ("storyId") REFERENCES "ProfileStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ProfileStoryView_userId_fkey') THEN
    ALTER TABLE "ProfileStoryView"
      ADD CONSTRAINT "ProfileStoryView_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- TutorPin (Repititorlar xaritasi) jadvali
CREATE TABLE IF NOT EXISTS "TutorPin" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "ism" TEXT NOT NULL,
  "fan" TEXT NOT NULL DEFAULT 'kimyo_biologiya',
  "sertifikat" TEXT NOT NULL DEFAULT 'A+',
  "markaz" TEXT NOT NULL DEFAULT '',
  "hudud" TEXT NOT NULL DEFAULT 'toshkent-sh',
  "tuman" TEXT NOT NULL DEFAULT '',
  "moljal" TEXT NOT NULL DEFAULT '',
  "lat" DOUBLE PRECISION NOT NULL,
  "lng" DOUBLE PRECISION NOT NULL,
  "telefon" TEXT NOT NULL DEFAULT '',
  "telegram" TEXT NOT NULL DEFAULT '',
  "narx" TEXT NOT NULL DEFAULT '',
  "tavsif" TEXT NOT NULL DEFAULT '',
  "tasdiqlangan" BOOLEAN NOT NULL DEFAULT true,
  "holat" TEXT NOT NULL DEFAULT 'faol',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TutorPin_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "TutorPin_hudud_holat_idx" ON "TutorPin"("hudud", "holat");
