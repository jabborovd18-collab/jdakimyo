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
  });
}

const HOZIRGI_TEKSTURA_OLCHAMI = {
  yogoch: 512,
  pol: 512,
  devor: 256,
};

export const PROFILLAR = Object.freeze({
  telefon: profilYarat({
    nom: "telefon",
    chiroqBudjeti: 3,
    // DPR 3 telefonda 1.5 cap 2.25 barobar ortiq piksel chizardi.
    pikselNisbati: 1.0,
    soya: false,
    // Eski arzon yo'l ham RoomEnvironment yaratgan; false qilish bu brifda
    // tezlashtirish bo'lib, oldin/keyin tasvirini o'zgartirib yuborardi.
    IBL: true,
    transmission: false,
    postprocessing: { bloom: false, ssao: false },
    teksturaOlchami: HOZIRGI_TEKSTURA_OLCHAMI,
    antialias: false,
  }),
  desktop: profilYarat({
    nom: "desktop",
    chiroqBudjeti: 8,
    pikselNisbati: 1.5,
    soya: true,
    IBL: true,
    transmission: true,
    // Bloom kalibrlangan sahnaga 3-qavatda qaytadi.
    postprocessing: { bloom: false, ssao: false },
    teksturaOlchami: HOZIRGI_TEKSTURA_OLCHAMI,
    antialias: true,
  }),
  ilova: profilYarat({
    nom: "ilova",
    chiroqBudjeti: 16,
    pikselNisbati: 1.5,
    soya: true,
    IBL: true,
    transmission: true,
    postprocessing: { bloom: false, ssao: false },
    teksturaOlchami: HOZIRGI_TEKSTURA_OLCHAMI,
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
