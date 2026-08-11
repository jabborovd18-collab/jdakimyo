-- Erituvchi tushunchasi: suvning ikki turi.
--
-- Bugungacha laboratoriyada erituvchi degan narsa yo'q edi — `H₂O` boshqa
-- har qanday reagent kabi bitta yozuv bo'lib turardi. Endi ikkita:
-- jo'mrak suvi (bepul, cheksiz, mineral tuzli, tokni o'tkazadi) va
-- distillangan (toza, pullik).
--
-- `asos` — variantning asos moddasi. Reaksiya REAGENTLAR TO'PLAMI
-- bo'yicha topiladi, shuning uchun jo'mrak suvi qidiruvda "H₂O" ga
-- aylanishi shart; aks holda u bilan birorta reaksiya mos kelmasdi.
-- Mexanizm suvga xos emas: suyultirilgan va konsentrlangan kislota ham
-- keyinchalik shu yo'l bilan qo'shiladi.
--
-- `cheksiz` — tugamaydigan manba. Bunday buyum inventarda yozuv ochmaydi.
--
-- Yozuvlarning o'zi SQL da yaratilmaydi: ular `lib/lab-erituvchi.js` dan
-- `scripts/seed-lab-katalog.js` orqali tushadi — bitta haqiqat manbai.
ALTER TABLE "LabItemDef" ADD COLUMN "asos" TEXT;
ALTER TABLE "LabItemDef" ADD COLUMN "cheksiz" BOOLEAN NOT NULL DEFAULT false;
