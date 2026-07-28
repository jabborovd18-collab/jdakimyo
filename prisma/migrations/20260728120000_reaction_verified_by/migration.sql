-- Reaksiyani kim va qachon tasdiqlagani.
--
-- Avval faqat isVerified bayrog'i bor edi: yozuv "tasdiqlangan" deb ko'rinardi,
-- lekin kim tasdiqlagani ma'lum emasdi. Talabaga ko'rsatiladigan kimyoviy
-- ma'lumot uchun bu yetarli emas — tasdiq javobgarlik bilan kelishi kerak.

ALTER TABLE "Reaction" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);
ALTER TABLE "Reaction" ADD COLUMN IF NOT EXISTS "verifiedById" TEXT;

CREATE INDEX IF NOT EXISTS "Reaction_verifiedById_idx" ON "Reaction"("verifiedById");

-- Foydalanuvchi o'chirilsa bog'lanish uziladi, tasdiq sanasi qoladi
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Reaction_verifiedById_fkey'
  ) THEN
    ALTER TABLE "Reaction"
      ADD CONSTRAINT "Reaction_verifiedById_fkey"
      FOREIGN KEY ("verifiedById") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
