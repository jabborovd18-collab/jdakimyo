// 3D sahna ishlaydigan muhit profillari — yagona haqiqat manbai.
//
// Profil funksiyani olib tashlamaydi: yurish uchalasida ham qoladi. U faqat
// renderer va quruvchilarga mavjud sifat qarorlarini nomli maydonlar bilan
// yetkazadi. BRIF-00C da qiymatlar ataylab eski ikki holatni aynan saqlaydi;
// haqiqiy optimallashtirish BRIF-01 va BRIF-03 da o'lchov bilan qilinadi.

function profilYarat(sozlama) {
  return Object.freeze({
    ...sozlama,
    postprocessing: Object.freeze({ ...sozlama.postprocessing }),
    teksturaOlchami: Object.freeze({ ...sozlama.teksturaOlchami }),
    pikselOraligi: Object.freeze({ ...sozlama.pikselOraligi }),
  });
}

// Tekstura o'lchami endi profilga bog'liq.
//
// BRIF-00C da uchala profil AYNAN BITTA obyektni ulashardi va faylning
// o'z izohi buni ataylab deb yozgan: "haqiqiy optimallashtirish BRIF-01
// va BRIF-03 da o'lchov bilan qilinadi". Mana o'sha joy.
//
// POL eng katta ulushni oladi: u xonaning eng katta yuzasi va qiya
// burchakda ko'riladi. 20x15 m polga 512 piksel — 4K ekranda har
// tekselga o'nlab ekran pikseli to'g'ri keladi.
const TEKSTURA_TELEFON = { yogoch: 512, pol: 512, devor: 256 };
const TEKSTURA_KATTA = { yogoch: 1024, pol: 1024, devor: 512 };

export const PROFILLAR = Object.freeze({
  telefon: profilYarat({
    nom: "telefon",
    chiroqBudjeti: 3,
    // DPR 3 telefonda 1.5 cap 2.25 barobar ortiq piksel chizardi.
    pikselNisbati: 1.0,
    // BRIF-03 — dinamik rezolyutsiya chegarasi. Telefonda nishon 30 FPS:
    // 60 ni talab qilish rezolyutsiyani doim pastki chegarada ushlab
    // turardi va rasm behuda buzilardi.
    pikselOraligi: { past: 0.6, yuqori: 1.0 },
    nishonKadrVaqti: 33.3,
    // Telefonda anizotropiya 4 — undan yuqorisi mobil GPU da sezilarli
    // fragment narxi qo'shadi va kichik ekranda farqi ko'rinmaydi.
    anizotrop: 4,
    soya: false,
    // Eski arzon yo'l ham RoomEnvironment yaratgan; false qilish bu brifda
    // tezlashtirish bo'lib, oldin/keyin tasvirini o'zgartirib yuborardi.
    IBL: true,
    transmission: false,
    postprocessing: { bloom: false, ssao: false },
    teksturaOlchami: TEKSTURA_TELEFON,
    antialias: false,
  }),
  desktop: profilYarat({
    nom: "desktop",
    chiroqBudjeti: 8,
    pikselNisbati: 1.5,
    // Yuqori chegara 2.0: 4K ekranda rezolyutsiya ko'tarilishi mumkin,
    // lekin FAQAT kadr arzon bo'lsa. Eski BRIF-03 chegarani butunlay
    // olib tashlamoqchi edi — bu 4K da 4 barobar pikselni shartsiz
    // majburlardi.
    pikselOraligi: { past: 0.8, yuqori: 2.0 },
    nishonKadrVaqti: 16.7,
    // 16 — deyarli barcha desktop GPU qo'llab-quvvatlaydigan eng yuqori
    // daraja. Qurilma kamrog'ini bersa, `tekstura-sifati.js` uni
    // imkoniyat darajasiga tushiradi.
    anizotrop: 16,
    soya: true,
    IBL: true,
    transmission: true,
    // Bloom kalibrlangan sahnaga 3-qavatda qaytadi.
    postprocessing: { bloom: false, ssao: false },
    teksturaOlchami: TEKSTURA_KATTA,
    antialias: true,
  }),
  ilova: profilYarat({
    nom: "ilova",
    chiroqBudjeti: 16,
    pikselNisbati: 1.5,
    pikselOraligi: { past: 0.8, yuqori: 2.0 },
    nishonKadrVaqti: 16.7,
    anizotrop: 16,
    soya: true,
    IBL: true,
    transmission: true,
    postprocessing: { bloom: false, ssao: false },
    teksturaOlchami: TEKSTURA_KATTA,
    antialias: true,
  }),
});

export const SUKUT_PROFIL = "desktop";
export const PROFIL_NOMLARI = Object.freeze(Object.keys(PROFILLAR));

/** Aniq kalitni profilga aylantiradi; xato kalit jim boshqa sifatga tushmaydi. */
export function profilniOl(kalit) {
  const profil = PROFILLAR[kalit];
  if (!profil) {
    throw new Error(
      `Noma'lum 3D sifat profili: ${String(kalit)}. ` +
        `Kutilgan qiymat: ${PROFIL_NOMLARI.join(", ")}`,
    );
  }
  return profil;
}

/** Jonli brauzer uchun eski qurilma aniqlash xatti-harakatini saqlaydi. */
export function profilniAniqla() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return profilniOl(SUKUT_PROFIL);
  }

  try {
    const mobil = navigator.userAgentData?.mobile
      ?? /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || "");
    if (mobil) return profilniOl("telefon");

    const cpuYadrolar = Number(navigator.hardwareConcurrency || 4);
    const xotiraGb = Number(navigator.deviceMemory || 4);
    return profilniOl(
      cpuYadrolar <= 2 && xotiraGb <= 4 ? "telefon" : SUKUT_PROFIL,
    );
  } catch {
    return profilniOl(SUKUT_PROFIL);
  }
}
