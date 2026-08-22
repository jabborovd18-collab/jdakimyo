// app/laboratoriya/3d/lib/kirish-usuli.js
//
// Kirish usuli (klaviatura yoki sensor) va boshqaruv ishoralarining
// YAGONA EGASI.
//
// MUAMMO (egasi 2026-08-22 da telefon skrinshotlarida ko'rsatdi).
// Telefon ekranida quyidagi matnlar chiqardi:
//
//   [E / Klik] probirkani rakovinada yuvish va tozalash
//   [E / G] probirkani stolga qo'yish
//   [H] Qo'llanma
//
// Telefonda E, G va H tugmalari YO'Q. O'quvchi nima bosishini
// bilmaydi va tajriba shu yerda to'xtaydi.
//
// ILDIZ SABAB — AGENTS.md 1-BANDI
//
// Ikkita ma'lumot ikki joyda yashardi:
//
//   1. "Bu qurilma sensorlimi" — `VirtualJoystick.jsx` ning ICHIDA,
//      lokal `useState` da. Boshqa hech kim uni ko'ra olmasdi.
//   2. "Bu amal qaysi tugma bilan bajariladi" — 25 ta matn qatorining
//      ichiga qotirib yozilgan (`useYurish.js`).
//
// Natijada joystik "men sensorli qurilmadaman" deb bilardi, matnlar
// esa bilmasdi. Endi ikkalasi ham shu fayldan oziqlanadi.

import { useEffect, useState } from "react";

export const KIRISH = Object.freeze({
  KLAVIATURA: "klaviatura",
  SENSOR: "sensor",
});

// Ishora jadvali — har amal uchun ikki xil matn.
//
// Sensor ustunida tugma nomi YO'Q: o'quvchi ekranga tegadi yoki
// ekrandagi tugmani bosadi. "Bosing" so'zi har ikkala holatni ham
// qamraydi va tarjima talab qilmaydi.
const ISHORALAR = Object.freeze({
  klaviatura: Object.freeze({
    // Nishondagi ob'ekt bilan ishlash
    amal: "[E / Klik]",
    // Qo'ldagi narsani qo'yish
    qoy: "[E / G]",
    // HUD tugmalari
    qollanma: "[H] Qo'llanma",
    ovoz: "[M] Ovoz",
    // Qarash rejimini yoqish
    qarash: "Erkin qarash uchun sahnani bosing",
    // Qo'llanma modalining sarlavhasi
    qollanmaSarlavha: "Klaviatura va Boshqaruv Qo'llanmasi",
    // Quyish satridagi bo'laklar
    qoyQisqa: "[G]",
    doza: "[1-5] Doza",
  }),
  sensor: Object.freeze({
    amal: "[Bosing]",
    qoy: "[Qo'yish]",
    qollanma: "Qo'llanma",
    ovoz: "Ovoz",
    qarash: "Atrofga qarash uchun ekranni suring",
    qollanmaSarlavha: "Boshqaruv Qo'llanmasi",
    qoyQisqa: "[Qo'yish]",
    // Sensorda aniq doza yo'q — quyish tugmasi 45 ml quyadi.
    doza: "45 ml",
  }),
});

/**
 * Qurilmaning kirish usulini aniqlaydi.
 *
 * Uch shartning bittasi yetadi:
 *   - `ontouchstart` mavjud;
 *   - `maxTouchPoints > 0` (Windows planshet, iPad);
 *   - ekran 1024 px dan tor (kichik oynali noutbuk ham sensor
 *     boshqaruvidan yutadi, chunki joystik shu kenglikda ko'rinadi).
 *
 * Uchinchi shart ataylab joystik ko'rinish shartiga TENG: agar joystik
 * ko'rinsa, matn ham sensor ishorasini ko'rsatishi shart. Ikkalasi
 * bir manbadan chiqmasa, ular yana bir-biridan uziladi.
 */
export function kirishUsuliniAniqla() {
  if (typeof window === "undefined") return KIRISH.KLAVIATURA;
  try {
    const sensor = "ontouchstart" in window
      || navigator.maxTouchPoints > 0
      || window.innerWidth < 1024;
    return sensor ? KIRISH.SENSOR : KIRISH.KLAVIATURA;
  } catch {
    return KIRISH.KLAVIATURA;
  }
}

/**
 * Berilgan kirish usuli uchun ishoralar to'plami.
 * Noma'lum usul jim klaviaturaga tushmaydi — bu xato bo'lardi.
 */
export function ishoralarniOl(usul) {
  const t = ISHORALAR[usul];
  if (!t) {
    throw new Error(
      `Noma'lum kirish usuli: ${String(usul)}. ` +
        `Kutilgan: ${Object.keys(ISHORALAR).join(", ")}`,
    );
  }
  return t;
}

/**
 * Boshqaruv amallari — klaviatura va sensor muqobili bilan.
 *
 * Ro'yxat TAXMIN EMAS, koddan olingan:
 *   useYurish.js  handleKeyDown (446-495)
 *   VirtualJoystick.jsx  tugmalar (172-208)
 *   korinish.js  [M] va [H] qisqa buyruqlari (673)
 *
 * `sensorda: null` — bu amalning sensorli qurilmada MUQOBILI YO'Q.
 * Qo'llanma modali ularni alohida ogohlantirish sifatida ko'rsatadi:
 * o'quvchi "nega menda bu ishlamayapti" deb o'ylamasin.
 *
 * Yangi tugma qo'shilsa, uning sensor muqobili shu yerda belgilanadi.
 */
export const KLAVIATURA_AMALLARI = Object.freeze([
  { tugma: "W A S D / strelkalar", amal: "Yurish", sensorda: "Chap joystik" },
  { tugma: "Sichqonchani surish", amal: "Atrofga qarash", sensorda: "Ekranni surish" },
  { tugma: "Shift", amal: "Yugurish", sensorda: "SPRINT tugmasi" },
  // E va F bir xil amalni bajaradi (useYurish.js:468).
  { tugma: "E yoki F / Klik", amal: "Olish, qo'yish, ishlatish", sensorda: "Markazdagi tugma" },
  { tugma: "G", amal: "Qo'ldagini qo'yish", sensorda: "Markazdagi tugma" },
  { tugma: "M", amal: "Ovozni yoqish / o'chirish", sensorda: "Ovoz tugmasi" },
  { tugma: "H", amal: "Shu qo'llanma", sensorda: "Qo'llanma tugmasi" },
  // Quyidagi uchtasining sensorda muqobili YO'Q.
  {
    tugma: "1 2 3 4 5",
    amal: "Aniq hajm quyish — 1, 5, 10, 25, 50 ml",
    sensorda: null,
    izoh: "Sensorli qurilmada quyish tugmasi 45 ml quyadi. Aniq hajm — masalan stexiometrik hisob uchun — hozircha faqat klaviaturada.",
  },
  { tugma: "C yoki Ctrl", amal: "Cho'kkalash", sensorda: null },
  { tugma: "Bo'sh joy", amal: "Sakrash", sensorda: null },
]);

/** Sensorli qurilmada muqobili YO'Q amallar. */
export function muqobilsizAmallar() {
  return KLAVIATURA_AMALLARI.filter((a) => !a.sensorda);
}

// ---- MATNDAGI ISHORANI MOSLASH ----
//
// Nishon matnlari (`useYurish.js`) klaviatura ishorasi bilan yozilgan
// va ular 25 ta joyda tarqalgan. Ularning HAMMASI bitta nuqtadan
// o'tadi — `setFpsKontekstMatn` — shuning uchun almashtirish shu
// yerda, bir marta bajariladi.
//
// NEGA 25 ta QATOR QAYTA YOZILMADI: ular o'zaro bog'liq interaktivlik
// mantig'i ichida (1127 qatorli fayl). Kosmetik o'zgarish uchun u
// yerga kirish regressiya xavfi tug'diradi. Almashtirish jadvali esa
// shu faylda — ya'ni ishora matni baribir bitta egaga ega.
const ALMASHTIRISH = Object.freeze([
  ["[E / Klik]", "amal"],
  ["[E / LMB]", "amal"],
  ["[E / G]", "qoy"],
  ["[1-5] Doza", "doza"],
  ["[G]", "qoyQisqa"],
]);

// Almashtirilmagan klaviatura ishorasi qolib ketmasin. Yangi matn
// qo'shilganda u JIM o'tib ketardi va telefonda yana tugma nomi
// ko'rinardi — aynan shu nuqson qaytarardi.
//
// Naqsh QAT'IY: qavs ichida FAQAT tugmaga o'xshash belgi bo'lsa
// hisoblanadi — bitta bosh harf ("[G]"), ikkita tugma ("[E / Klik]")
// yoki raqam oralig'i ("[1-5]"). Shu tufayli "[Bosing]" va
// "[Qo'yish]" kabi sensor ishoralari, "[TARA]" kabi ekran tugmalari
// noto'g'ri ushlanmaydi.
const QOLDIQ = /\[(?:[A-Z](?:\s*\/\s*[A-Za-z]{1,4})?|\d\s*[-\u2013]\s*\d)\]/;

/**
 * Matndagi klaviatura ishoralarini kirish usuliga moslaydi.
 *
 * @param {string} matn nishon matni
 * @param {string} usul `KIRISH.KLAVIATURA` yoki `KIRISH.SENSOR`
 */
export function ishorasiniMosla(matn, usul) {
  if (!matn) return matn;
  const t = ishoralarniOl(usul);
  let natija = matn;
  for (const [naqsh, kalit] of ALMASHTIRISH) {
    if (natija.includes(naqsh)) natija = natija.split(naqsh).join(t[kalit]);
  }
  // Ogohlantirish FAQAT sensor rejimida ma'noli: klaviaturada tugma
  // nomi qolishi to'g'ri va kutilgan.
  if (
    usul === KIRISH.SENSOR
    && process.env.NODE_ENV !== "production"
    && QOLDIQ.test(natija)
  ) {
    console.warn(
      `[kirish-usuli] sensorda almashtirilmagan tugma ishorasi: ${natija}\n` +
        "ALMASHTIRISH jadvaliga qo'shing (lib/kirish-usuli.js).",
    );
  }
  return natija;
}

/**
 * Kirish usulini kuzatuvchi React hook.
 *
 * SSR da har doim klaviatura qaytadi (`window` yo'q), keyin mijozda
 * aniqlanadi — shuning uchun hidratsiya mos kelmasligi bo'lmaydi.
 *
 * `resize` kuzatiladi: 1024 px chegarasi oyna o'lchamiga bog'liq va
 * foydalanuvchi oynani kichraytirsa joystik paydo bo'ladi. Matn ham
 * o'sha zahoti moslashishi kerak, aks holda ular yana ajralib qoladi.
 */
export function useKirishUsuli() {
  const [usul, setUsul] = useState(KIRISH.KLAVIATURA);
  useEffect(() => {
    const yangila = () => setUsul(kirishUsuliniAniqla());
    yangila();
    window.addEventListener("resize", yangila);
    return () => window.removeEventListener("resize", yangila);
  }, []);
  return usul;
}
