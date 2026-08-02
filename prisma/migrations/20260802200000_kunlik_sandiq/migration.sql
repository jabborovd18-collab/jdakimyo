-- Kunlik sandiq oxirgi marta qachon olingani.
--
-- Kun chegarasi UTC yarim tuni — kunlik missiyalar bilan bir xil.
-- Aks holda "bugun" tizimning ikki qismida ikki xil ma'no anglatardi.

ALTER TABLE "Lab" ADD COLUMN IF NOT EXISTS "oxirgiKunlikSandiq" TIMESTAMP(3);
