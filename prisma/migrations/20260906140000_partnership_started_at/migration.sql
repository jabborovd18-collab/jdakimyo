-- PartnershipAttempt jadvaliga boshlangan vaqtni saqlash uchun startedAt ustuni
ALTER TABLE "PartnershipAttempt" ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP WITH TIME ZONE;
