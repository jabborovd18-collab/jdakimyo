-- Sertifikat endi faqat admin tomonidan beriladi.
--
-- Avval sertifikat bazaga umuman yozilmasdi: foydalanuvchi sahifada o'z ismini
-- va ballini o'zi kiritib PDF yasab olardi. Ya'ni "sertifikat" hech narsani
-- tasdiqlamasdi va uni tekshirib bo'lmasdi.
--
-- Endi hamma ma'lumotni admin kiritadi, jumladan ism-familyani ham —
-- foydalanuvchi profilida taxallus yozgan bo'lishi mumkin, sertifikatda esa
-- rasmiy ism turishi shart. Ism sertifikatning o'zida saqlanadi, shuning uchun
-- profil keyin o'zgarsa ham berilgan sertifikat o'zgarmaydi.

-- ─── Sertifikatda chop etiladigan yangi maydonlar ───
-- NOT NULL ustunlar vaqtincha default bilan qo'shiladi, keyin default olinadi:
-- shunda jadvalda yozuv bo'lsa ham migratsiya to'xtamaydi, lekin bo'sh qiymat
-- bilan yangi yozuv kiritish yo'li ochiq qolmaydi.
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "fullName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Certificate" ALTER COLUMN "fullName" DROP DEFAULT;

ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "fan" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Certificate" ALTER COLUMN "fan" DROP DEFAULT;

ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "reason" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Certificate" ALTER COLUMN "reason" DROP DEFAULT;

ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "seals" JSONB;

-- ─── Kim berdi ───
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "issuedById" TEXT;

-- ─── Baho endi ixtiyoriy ───
-- Admin qo'lda bergan sertifikatda (masalan olimpiada g'olibi) ball bo'lmasligi
-- mumkin. Muddat ham majburiy emas — muddatsiz sertifikat bo'sh qoldiriladi.
ALTER TABLE "Certificate" ALTER COLUMN "examName" DROP NOT NULL;
ALTER TABLE "Certificate" ALTER COLUMN "grade" DROP NOT NULL;
ALTER TABLE "Certificate" ALTER COLUMN "score" DROP NOT NULL;
ALTER TABLE "Certificate" ALTER COLUMN "percentage" DROP NOT NULL;
ALTER TABLE "Certificate" ALTER COLUMN "percentile" DROP NOT NULL;
ALTER TABLE "Certificate" ALTER COLUMN "expiresAt" DROP NOT NULL;

-- ─── Indekslar ───
CREATE INDEX IF NOT EXISTS "Certificate_userId_idx" ON "Certificate"("userId");
CREATE INDEX IF NOT EXISTS "Certificate_fan_idx" ON "Certificate"("fan");
CREATE INDEX IF NOT EXISTS "Certificate_issuedById_idx" ON "Certificate"("issuedById");
CREATE INDEX IF NOT EXISTS "Certificate_status_idx" ON "Certificate"("status");

-- Admin o'chirilsa bog'lanish uziladi, sertifikat va berilgan sanasi qoladi
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Certificate_issuedById_fkey'
  ) THEN
    ALTER TABLE "Certificate"
      ADD CONSTRAINT "Certificate_issuedById_fkey"
      FOREIGN KEY ("issuedById") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
