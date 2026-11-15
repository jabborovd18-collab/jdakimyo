-- AlterTable: Add explicit turi, structured metadata JSON, and fullNameLocked flag to Certificate
ALTER TABLE "Certificate"
ADD COLUMN "turi" TEXT NOT NULL DEFAULT 'admin_maxsus',
ADD COLUMN "metadata" JSONB,
ADD COLUMN "fullNameLocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Certificate_turi_idx" ON "Certificate"("turi");

-- Data Backfill: classify existing rows cleanly without breaking legacy text descriptions
UPDATE "Certificate"
SET "turi" = 'milliy_sertifikat'
WHERE "certId" LIKE 'JDA-MS-%'
   OR (
     "description" IS NOT NULL
     AND ("description" LIKE '%"examSlug"%' OR "description" LIKE '%"shkalaBalli"%')
   );

UPDATE "Certificate"
SET "turi" = 'mavsumiy_hamkor'
WHERE "turi" = 'admin_maxsus'
  AND (
    "certId" LIKE 'AK-%'
    OR "fan" LIKE '%Mavsumiy Hamkorlik%'
    OR "fan" LIKE '%DTM sinov testi%'
    OR ("seals" IS NOT NULL AND "seals"::text LIKE '%partnerName%')
  );

DO $$
DECLARE
  rec RECORD;
  parsed JSONB;
BEGIN
  FOR rec IN
    SELECT "id", "description"
    FROM "Certificate"
    WHERE "metadata" IS NULL
      AND "description" IS NOT NULL
      AND left(btrim("description"), 1) = '{'
      AND right(btrim("description"), 1) = '}'
  LOOP
    BEGIN
      parsed := rec."description"::jsonb;
      IF jsonb_typeof(parsed) = 'object' THEN
        UPDATE "Certificate"
        SET "metadata" = parsed,
            "fullNameLocked" = COALESCE(
              CASE
                WHEN jsonb_typeof(parsed->'fullNameLocked') = 'boolean'
                  THEN (parsed->>'fullNameLocked')::boolean
                ELSE false
              END,
              false
            )
        WHERE "id" = rec."id";
      END IF;
    EXCEPTION WHEN OTHERS THEN
      -- Noto'g'ri JSON ko'rinishidagi oddiy matn bo'lsa migratsiya to'xtamasin
      NULL;
    END;
  END LOOP;
END $$;
