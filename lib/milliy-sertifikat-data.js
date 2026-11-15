// lib/milliy-sertifikat-data.js
//
// JDA KIMYO — RASCH IRT BAHOLASH VA MILLIY SERTIFIKAT TIZIMI
// Milliy sertifikatga tayyorgarlik sinovlari katalogi.

import { DARAJA_CHEGARALARI } from "./rasch-model.js"
import {
  RASMIY_KIMYO_MS_TUZILMASI,
  tarkibJami,
  tuzilmaMatni,
} from "./ms-format.js"

// Nega bu matn kerak: sinov davlat imtihoniga o'xshaydi, foydalanuvchi uni
// rasmiy hujjat deb o'ylamasligi shart. Matn bitta, hamma joy shundan oladi.
export const TAYYORGARLIK_OGOHLANTIRISH =
  "Bu JDA Kimyo tayyorgarlik sinovi. Natija taxminiy, davlat sertifikati emas va rasmiy imtiyoz bermaydi."

export const RASCH_BO_LIMLARI = [
  {
    id: "all",
    nom: "Barcha sinovlar",
    qisqa: "To'liq katalog",
    badge: "Rasch IRT",
    ikon: "atom",
  },
  {
    id: "diagnostika",
    nom: "Rasch Diagnostikasi",
    qisqa: "Qobiliyat (theta) va Wright Map",
    badge: "Ilmiy Model",
    tavsif: "Item Response Theory asosida savollar qiyinligi va o'quvchi bilimining logit o'lchovi.",
    ikon: "kuzatuv",
  },
  {
    id: "simulyator",
    nom: "Milliy Sertifikatga Tayyorgarlik",
    qisqa: "Milliy sertifikat formatida",
    badge: "Tayyorgarlik",
    tavsif: "Milliy sertifikat formatidagi yopiq, moslashtirish va ochiq sonli masalalar to'plami.",
    ikon: "sertifikat",
  },
  {
    id: "attestatsiya",
    nom: "Attestatsiya Sinovi",
    qisqa: "Attestatsiyaga tayyorgarlik",
    badge: "Pedagogik",
    tavsif: "O'qituvchilar attestatsiyasiga tayyorgarlik uchun chuqurlashtirilgan kimyo savollari.",
    ikon: "ustoz",
  },
  {
    id: "original",
    nom: "Original imtihonlar (2023–2026)",
    qisqa: "Imtihon variantlari arxivi",
    badge: "Arxiv",
    tavsif: "2024–2026-yillardagi imtihon sanalari va smenalari bo'yicha 40 talik tayyorgarlik variantlari.",
    ikon: "hujjat",
  },
]

// holat bu yerda doim "tayyorlanmoqda": haqiqiy holatni server bankdan hisoblaydi
// (lib/milliy-sertifikat-katalog.js). savollarSoni — bank shu songa yetganda sinov ochiladi.
const RASCH_DIAGNOSTIKA_TARKIB = { variant: 30, moslashtirish: 0, ochiq: 0 }
const MS_QISM1_TARKIB = {
  variant: RASMIY_KIMYO_MS_TUZILMASI.qism1.yopiq.soni,
  moslashtirish: RASMIY_KIMYO_MS_TUZILMASI.qism1.moslashtirish.soni,
  ochiq: RASMIY_KIMYO_MS_TUZILMASI.qism1.ochiq.soni,
}
const ATTESTATSIYA_TARKIB = { variant: 40, moslashtirish: 5, ochiq: 5 }

export const MILLIY_SERTIFIKAT_VARIANTLARI = [
  {
    id: "rasch-diag-1",
    slug: "rasch-diagnostika",
    nom: "Rasch Ilmiy Diagnostik Testi (Theta Baholash)",
    qisqa: "Item Response Theory (IRT) va Wright Map asosidagi ilmiy test",
    bolimId: "diagnostika",
    badge: "Rasch Modeli",
    badgeRang: "border-amber-300/65 bg-amber-400/20 text-amber-200 shadow-sm shadow-amber-500/15",
    tarkib: RASCH_DIAGNOSTIKA_TARKIB,
    savollarSoni: tarkibJami(RASCH_DIAGNOSTIKA_TARKIB),
    vaqtMin: 60,
    daraja: "Rasch Dichotomous (-3.0 .. +3.0 logit)",
    holat: "tayyorlanmoqda",
    tavsif: "Har bir savolning taxminiy qiyinlik darajasi (b_i) asosida bilim darajasi (theta) va standart xatolik (SE) hisoblanadi.",
    tuzilma: tuzilmaMatni(RASCH_DIAGNOSTIKA_TARKIB),
    ikon: "kuzatuv",
  },
  {
    id: "ms-simulyator-1",
    slug: "milliy-sertifikat-simulyator",
    nom: "Milliy Sertifikatga Tayyorgarlik Sinovi #1",
    qisqa: "Milliy sertifikat formatidagi 40 talik sinov",
    bolimId: "simulyator",
    badge: "Tayyorgarlik",
    badgeRang: "border-emerald-300/65 bg-emerald-400/20 text-emerald-200 shadow-sm shadow-emerald-500/15",
    tarkib: MS_QISM1_TARKIB,
    savollarSoni: tarkibJami(MS_QISM1_TARKIB),
    vaqtMin: RASMIY_KIMYO_MS_TUZILMASI.qism1.vaqtMin,
    daraja: "A, B, C darajalar",
    holat: "tayyorlanmoqda",
    tavsif: "1–32 A-D yopiq test, 33–35 moslashtirish (A-F), 36–40 qoralama daftarda yechiladigan ochiq sonli masalalar to'plami.",
    tuzilma: tuzilmaMatni(MS_QISM1_TARKIB),
    ikon: "sertifikat",
  },
  {
    id: "ms-simulyator-2",
    slug: "milliy-sertifikat-simulyator-2",
    nom: "Milliy Sertifikatga Tayyorgarlik Sinovi #2",
    qisqa: "Murakkablashtirilgan hisobiy masalalar va organik sintez",
    bolimId: "simulyator",
    badge: "Chuqurlashtirilgan",
    badgeRang: "border-cyan-300/65 bg-cyan-400/20 text-cyan-100 shadow-sm shadow-cyan-500/15",
    tarkib: MS_QISM1_TARKIB,
    savollarSoni: tarkibJami(MS_QISM1_TARKIB),
    vaqtMin: RASMIY_KIMYO_MS_TUZILMASI.qism1.vaqtMin,
    daraja: "A, B, C darajalar (yuqori)",
    holat: "tayyorlanmoqda",
    tavsif: "A+ va A darajalarini ko'zlagan abituriyentlar uchun stexiometriya va eritmalar bo'yicha tahliliy variant.",
    tuzilma: tuzilmaMatni(MS_QISM1_TARKIB),
    ikon: "kolba",
  },
  {
    id: "attestatsiya-1",
    slug: "attestatsiya-sinov",
    nom: "Kimyo Fani O'qituvchilari Attestatsiya Sinovi",
    qisqa: "Attestatsiyaga tayyorgarlik sinovi",
    bolimId: "attestatsiya",
    badge: "Tez kunda",
    badgeRang: "border-violet-300/65 bg-violet-400/20 text-violet-200 shadow-sm shadow-violet-500/15",
    tarkib: ATTESTATSIYA_TARKIB,
    savollarSoni: tarkibJami(ATTESTATSIYA_TARKIB),
    vaqtMin: 120,
    daraja: "Oliy / 1-toifa",
    holat: "tayyorlanmoqda",
    tavsif: "Pedagogik mahorat va chuqurlashtirilgan anorganik, organik hamda fizik-kimyoviy tahlil savollari.",
    tuzilma: tuzilmaMatni(ATTESTATSIYA_TARKIB),
    ikon: "ustoz",
  },
  ...[
    {
      slug: "ms-2026-02-22-2",
      nom: "2026-yil 22-fevral, II smena",
      qisqa: "2026-yil fevral imtihon varianti (II smena)",
      badge: "2026 Arxiv",
    },
    {
      slug: "ms-2026-02-21-2",
      nom: "2026-yil 21-fevral, II smena",
      qisqa: "2026-yil fevral imtihon varianti (II smena)",
      badge: "2026 Arxiv",
    },
    {
      slug: "ms-2026-02-21-1",
      nom: "2026-yil 21-fevral, I smena",
      qisqa: "2026-yil fevral imtihon varianti (I smena)",
      badge: "2026 Arxiv",
    },
    {
      slug: "ms-2025-05-04-1",
      nom: "2025-yil 4-may, I smena",
      qisqa: "2025-yil may imtihon varianti (I smena)",
      badge: "2025 Arxiv",
    },
    {
      slug: "ms-2025-05-03-2",
      nom: "2025-yil 3-may, II smena",
      qisqa: "2025-yil may imtihon varianti (II smena)",
      badge: "2025 Arxiv",
    },
    {
      slug: "ms-2025-05-03-1",
      nom: "2025-yil 3-may, I smena",
      qisqa: "2025-yil may imtihon varianti (I smena)",
      badge: "2025 Arxiv",
    },
    {
      slug: "ms-2025-03-15-2",
      nom: "2025-yil 15-mart, II smena",
      qisqa: "2025-yil mart imtihon varianti (II smena)",
      badge: "2025 Arxiv",
    },
    {
      slug: "ms-2025-03-15-1",
      nom: "2025-yil 15-mart, I smena",
      qisqa: "2025-yil mart imtihon varianti (I smena)",
      badge: "2025 Arxiv",
    },
    {
      slug: "ms-2025-01-25-1",
      nom: "2025-yil 25-yanvar, I smena",
      qisqa: "2025-yil yanvar imtihon varianti (I smena)",
      badge: "2025 Arxiv",
    },
    {
      slug: "ms-2024-09-22",
      nom: "2024-yil 22-sentabr (Aprobatsiya)",
      qisqa: "2024-yil sentabr aprobatsiya varianti",
      badge: "2024 Arxiv",
    },
  ].map((v) => ({
    id: v.slug,
    slug: v.slug,
    nom: v.nom,
    qisqa: v.qisqa,
    bolimId: "original",
    badge: v.badge,
    badgeRang: "border-sky-300/65 bg-sky-400/20 text-sky-100 shadow-sm shadow-sky-500/15",
    tarkib: MS_QISM1_TARKIB,
    savollarSoni: tarkibJami(MS_QISM1_TARKIB),
    vaqtMin: RASMIY_KIMYO_MS_TUZILMASI.qism1.vaqtMin,
    daraja: "A+, A, B+, B, C+, C",
    holat: "tayyorlanmoqda",
    tavsif: `${v.nom} sanasidagi 40 talik (1–32 yopiq, 33–35 moslashtirish, 36–40 ochiq) tayyorgarlik sinovi.`,
    tuzilma: tuzilmaMatni(MS_QISM1_TARKIB),
    ikon: "hujjat",
  })),
]

const MAKSIMAL_BALL = "Rasmiy sertifikatda ixtisoslik fanidan maksimal ball."
const PROPORSIONAL_BALL = "Rasmiy sertifikatda ixtisoslik fanidan proporsional ball."

const DARAJA_KORINISHI = {
  "A+": {
    imtiyoz: MAKSIMAL_BALL,
    chegaraRang:
      "border-amber-300/70 bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-[#0d1e54]/90 text-amber-200 shadow-lg shadow-amber-500/15",
  },
  A: {
    imtiyoz: MAKSIMAL_BALL,
    chegaraRang:
      "border-emerald-300/65 bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-[#0d1e54]/90 text-emerald-200 shadow-lg shadow-emerald-500/15",
  },
  "B+": {
    imtiyoz: PROPORSIONAL_BALL,
    chegaraRang:
      "border-sky-300/65 bg-gradient-to-br from-sky-400/25 via-blue-500/15 to-[#0d1e54]/90 text-sky-200 shadow-lg shadow-sky-500/15",
  },
  B: {
    imtiyoz: PROPORSIONAL_BALL,
    chegaraRang:
      "border-cyan-300/65 bg-gradient-to-br from-cyan-400/25 via-indigo-500/15 to-[#0d1e54]/90 text-cyan-200 shadow-lg shadow-cyan-500/15",
  },
  "C+": {
    imtiyoz: PROPORSIONAL_BALL,
    chegaraRang:
      "border-violet-300/65 bg-gradient-to-br from-violet-400/25 via-purple-500/15 to-[#0d1e54]/90 text-violet-200 shadow-lg shadow-violet-500/15",
  },
  C: {
    imtiyoz: PROPORSIONAL_BALL,
    chegaraRang:
      "border-slate-300/55 bg-gradient-to-br from-slate-400/25 via-indigo-500/15 to-[#0d1e54]/90 text-slate-100 shadow-lg shadow-slate-500/10",
  },
}

// Ball oralig'i qo'lda yozilmaydi: u chegaralar jadvalidan chiqadi, aks holda
// ko'rsatilgan oraliq hisobdan uzilib qolardi (avval aynan shunday bo'lgan).
export const SERTIFIKAT_DARAJALARI = DARAJA_CHEGARALARI.map((c, i) => {
  const yuqori = DARAJA_CHEGARALARI[i - 1]?.minBall
  return {
    daraja: c.daraja,
    shkala: yuqori ? `${c.minBall} – ${(yuqori - 0.1).toFixed(1)} ball` : `${c.minBall} ball va yuqori`,
    ...DARAJA_KORINISHI[c.daraja],
  }
})
