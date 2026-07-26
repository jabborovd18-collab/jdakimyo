ALTER TABLE "User"
  ADD COLUMN "notificationSettings" JSONB,
  ADD COLUMN "interfaceSettings" JSONB,
  ADD COLUMN "learningPreferences" JSONB;

ALTER TABLE "DailyActivity"
  ADD COLUMN "compoundCount" INTEGER NOT NULL DEFAULT 0;
