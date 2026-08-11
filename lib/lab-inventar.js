// INVENTARNI O'ZGARTIRISHNING YAGONA YO'LI.
//
// NEGA KERAK. `LabItem` da ikkita maydon bor: `miqdor` (haqiqiy o'lchov —
// ml yoki gramm) va `soni` (eski, dona hisobidagi). Miqdorga o'tish bir
// necha bosqichda boradi, ya'ni ular bir muddat birga yashaydi.
//
// Inventarni oltita joy o'zgartiradi: xarid, sotish, sandiq, tajribada
// sarflash, tajribada mahsulot va nol yozuvlarni tozalash. Agar ularning
// bittasi `miqdor` ni, boshqasi `soni` ni yozsa — inventar jim ravishda
// ikkiga bo'linadi va qaysi biri to'g'ri ekanini keyin aniqlab bo'lmaydi.
// Shuning uchun hammasi shu fayldan o'tadi.
//
// QAYSI BIRI HAQIQAT: `miqdor`. `soni` undan hosila va har o'zgarishda
// qayta hisoblanadi.
//
// NEGA FLOOR, CEIL EMAS: `soni` ni yuqoriga yaxlitlasak, 12.5 ml qolgan
// reagent do'konda "1 dona" bo'lib ko'rinardi va uni 25 ml deb sotish
// mumkin bo'lardi — yo'qdan tanga yasash yo'li. Pastga yaxlitlash eng
// yomoni "bor narsa ko'rinmaydi" degani, bu esa zarar keltirmaydi.

import { ulush, EPSILON } from "./lab-birlik.js";

/**
 * `soni` ni `miqdor` dan qayta hisoblaydi va manfiy miqdorni nolga tortadi.
 *
 * Nega xom SQL: Prisma'ning tipli API'si "ustunni boshqa ustundan hisoblab
 * yoz" amalini qo'llamaydi. Ikki bosqichda (o'qib, keyin yozib) qilinsa,
 * bir vaqtda kelgan ikkita so'rov orasida qiymat eskirib qolardi — aynan
 * shu sababdan sarflash ham shartli `updateMany` bilan qilinadi.
 *
 * Manfiy miqdor arifmetik chetlanishdan chiqishi mumkin: shart
 * `gte: miqdor - EPSILON` bilan tekshiriladi, ayirish esa to'liq miqdorni
 * oladi, ya'ni natija -0.0009 bo'lib qolishi mumkin.
 */
async function soniniMoslash(tx, labId, kalit, birlik) {
  const u = ulush(birlik);
  await tx.$executeRaw`
    UPDATE "LabItem"
    SET "miqdor" = GREATEST("miqdor", 0),
        "soni"   = FLOOR(GREATEST("miqdor", 0) / ${u})::int
    WHERE "labId" = ${labId} AND "kalit" = ${kalit}
  `;
}

/**
 * Inventarga qo'shish (xarid, sandiq, tajriba mahsuloti).
 *
 * @param {number} miqdor — `birlik` dagi miqdor, dona emas
 */
export async function inventarQosh(tx, labId, kalit, miqdor, birlik) {
  const qoshiladigan = Number(miqdor) || 0;
  if (qoshiladigan <= 0) return;

  await tx.labItem.upsert({
    where: { labId_kalit: { labId, kalit } },
    create: {
      labId,
      kalit,
      miqdor: qoshiladigan,
      soni: Math.floor(qoshiladigan / ulush(birlik)),
    },
    update: { miqdor: { increment: qoshiladigan } },
  });

  await soniniMoslash(tx, labId, kalit, birlik);
}

/**
 * Inventardan sarflash (tajriba, sotish).
 *
 * Shartli `updateMany` ishlatiladi — avval o'qib, keyin ayirish bir vaqtda
 * kelgan ikkita so'rovga bitta reagentni ikki marta sarflashga imkon
 * berardi. Yetmasa `false` qaytaradi, xato tashlamaydi: chaqiruvchi
 * xabarni o'zi tuzadi (unda buyum nomi va kerakli miqdor bor).
 *
 * @returns {Promise<boolean>} — yetdimi
 */
export async function inventarSarfla(tx, labId, kalit, miqdor, birlik) {
  const sarf = Number(miqdor) || 0;
  if (sarf <= 0) return true;

  const kamaydi = await tx.labItem.updateMany({
    where: { labId, kalit, miqdor: { gte: sarf - EPSILON } },
    data: { miqdor: { decrement: sarf } },
  });

  if (kamaydi.count === 0) return false;

  await soniniMoslash(tx, labId, kalit, birlik);
  return true;
}

/**
 * Shu foydalanuvchi uchun qaysi buyumlar tugamaydigan manba.
 *
 * Ikki yo'l bilan cheksiz bo'ladi:
 *   `cheksiz`     — hamma uchun (jo'mrak suvi)
 *   `cheksizAgar` — shu kalitga ega bo'lganlar uchun (distillagich
 *                   o'rnatgan odam uchun distillangan suv)
 *
 * Nega ikkinchisi katalogda bayroq bo'lolmaydi: cheksizlik
 * FOYDALANUVCHIGA bog'liq. Bir xil yozuv apparati bor odam uchun
 * cheksiz, boshqasi uchun ulushlab sotib olinadigan bo'lib qoladi.
 *
 * @param {Array<{kalit:string, cheksiz:boolean, cheksizAgar:string|null}>} deflar
 * @param {Iterable<string>} borKalitlar — inventardagi kalitlar
 * @returns {Set<string>}
 */
export function cheksizKalitlar(deflar, borKalitlar) {
  const bor = borKalitlar instanceof Set ? borKalitlar : new Set(borKalitlar);
  const natija = new Set();
  for (const d of deflar) {
    if (d.cheksiz) natija.add(d.kalit);
    else if (d.cheksizAgar && bor.has(d.cheksizAgar)) natija.add(d.kalit);
  }
  return natija;
}

/**
 * Tugagan yozuvlarni olib tashlash.
 *
 * EPSILON bilan solishtiriladi, nol bilan emas: 0.0004 ml qolgan yozuv
 * inventarda "bor" bo'lib turadi, lekin hech nimaga yaramaydi va
 * ro'yxatni chalkashtiradi.
 */
export async function boshYozuvlarniOchir(tx, labId) {
  await tx.labItem.deleteMany({
    where: { labId, miqdor: { lte: EPSILON } },
  });
}
