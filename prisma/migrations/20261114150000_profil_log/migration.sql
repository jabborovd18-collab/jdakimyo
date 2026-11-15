-- Shaxsiy profil harakatlari, xavfsizlik va sozlamalar jurnali
CREATE TABLE IF NOT EXISTS "ProfilLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "toifa" TEXT NOT NULL,
  "amal" TEXT NOT NULL,
  "sarlavha" TEXT NOT NULL,
  "tafsilot" TEXT,
  "holat" TEXT NOT NULL DEFAULT 'muvaffaqiyat',
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProfilLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProfilLog_userId_createdAt_idx" ON "ProfilLog"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "ProfilLog_userId_toifa_idx" ON "ProfilLog"("userId", "toifa");
CREATE INDEX IF NOT EXISTS "ProfilLog_amal_idx" ON "ProfilLog"("amal");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ProfilLog_userId_fkey'
  ) THEN
    ALTER TABLE "ProfilLog"
      ADD CONSTRAINT "ProfilLog_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
