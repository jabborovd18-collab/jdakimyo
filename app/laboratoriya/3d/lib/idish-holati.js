import { QUYISH } from "./sozlama.js";

// Idish holati obyektini yaratish: mutatsiyaning oldini olish uchun har safar yangi 
// obyekt qaytariladi, chunki React va 3D render kadrlarida holat kuzatuvchan bo'lishi shart.
export function idishYarat(kalit = "probirka", hajm = 0) {
  return {
    idish: kalit,
    moddalar: {},
    hajm: Math.max(0, hajm),
    harorat: 20, // standart xona harorati (selsiy)
  };
}

// quy() funksiyasi faqat moddani va uning hajmini qo'shadi — rang, cho'kma yoki reaksiya haqida
// hech narsa bilmaydi. Nega: shu ajratish bo'lmasa, keyinchalik "quyish" ni sinash uchun
// butun 3D sahnani ishga tushirish va grafik kontekstni chaqirish kerak bo'lardi.
export function quy(holat, reagentKaliti, ml) {
  if (!reagentKaliti || ml <= 0) return holat;

  const qoshiladiganMl = Number(ml) || 0;
  const eskirganningMl = holat.moddalar[reagentKaliti]?.ml || 0;
  const yangiMl = eskirganningMl + qoshiladiganMl;

  // Konsentratsiya bazada yo'q bo'lgani uchun shartli standart (0.5 M) olinadi: bu kimyoviy
  // da'vo emas, balki stexiometriyaning o'quv mantig'i uchun o'yin shartidir.
  // 1 litr = 1000 ml -> mol = ml * (0.5 / 1000)
  const yangiMol = yangiMl * (QUYISH.standartKonsentratsiya / 1000);

  const yangiModdalar = {
    ...holat.moddalar,
    [reagentKaliti]: {
      ml: Number(yangiMl.toFixed(3)),
      mol: Number(yangiMol.toFixed(6)),
    },
  };

  const yangiJamiHajm = Object.values(yangiModdalar).reduce(
    (jami, modda) => jami + (modda.ml || 0),
    0
  );

  return {
    ...holat,
    moddalar: yangiModdalar,
    hajm: Number(yangiJamiHajm.toFixed(3)),
  };
}

// Idishni tozalash: yangi bo'sh holat qaytaradi. Mutatsiya o'rniga yangi obyekt yaratiladi,
// shunda avvalgi render kadrlarida xotiradagi ma'lumot buzilmaydi.
export function tozala(holat) {
  return {
    idish: holat?.idish || "probirka",
    moddalar: {},
    hajm: 0,
    harorat: holat?.harorat || 20,
  };
}

// BARCHA idishlarning holatlari xaritasi. Nega bitta `holat` emas, xarita kerak:
// avval idish almashtirilganda eski idishning moddalari/hajmi yangi idishga "ergashib"
// yurardi — foydalanuvchi probirkaga quyib, stakanni bosganda footer stakanda ham
// o'sha ml ni ko'rsatardi, vizual esa eski idishda qolardi. Endi har bir idish o'z
// holatini (moddalar, hajm) alohida saqlaydi va idishga qaytilsa, o'zi qaytadi.
export function holatlarYarat() {
  return { probirka: idishYarat("probirka", 0) };
}

// Kalit bo'yicha idish holatini oladi; hali mavjud bo'lmasa yangisini yaratadi.
// Ref xaritasini (useRef) o'zi mutatsiya qiladi, lekin React'ga signal bermaydi —
// qayta chizishni chaqiruvchi `setTanlanganIdish` / `onOzgarish` orqali qiladi.
export function holatniOl(holatlar, kalit) {
  const k = kalit || "probirka";
  if (!holatlar) return idishYarat(k, 0);
  if (!holatlar[k]) holatlar[k] = idishYarat(k, 0);
  return holatlar[k];
}

// Idishdagi ma'lum bir reagentning mol miqdorini o'qish: aniq hisob kitoblar uchun
// xavfsiz o'qish funksiyasi.
export function molMiqdori(holat, kalit) {
  if (!holat || !holat.moddalar || !kalit) return 0;
  return holat.moddalar[kalit]?.mol || 0;
}

// Idishdagi barcha moddalar hajmini yig'ib qaytarish.
export function jamiHajm(holat) {
  if (!holat || !holat.moddalar) return 0;
  const yigindi = Object.values(holat.moddalar).reduce(
    (jami, modda) => jami + (modda.ml || 0),
    0
  );
  return Number(yigindi.toFixed(3));
}