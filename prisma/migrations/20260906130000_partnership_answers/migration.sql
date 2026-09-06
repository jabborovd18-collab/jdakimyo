-- PartnershipAttempt jadvaliga ishtirokchilarning barcha javoblarini saqlash uchun answers ustuni
ALTER TABLE "PartnershipAttempt" ADD COLUMN IF NOT EXISTS "answers" JSONB;
