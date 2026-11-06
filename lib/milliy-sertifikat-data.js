// lib/milliy-sertifikat-data.js
//
// JDA KIMYO — RASCH IRT BAHOLASH VA MILLIY SERTIFIKAT TIZIMI
// Milliy sertifikatga tayyorgarlik sinovlari katalogi.

import { DARAJA_CHEGARALARI } from "./rasch-model.js"

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
]

export const MILLIY_SERTIFIKAT_VARIANTLARI = [
  {
    id: "rasch-diag-1",
    slug: "rasch-diagnostika",
    nom: "Rasch Ilmiy Diagnostik Testi (Theta Baholash)",
    qisqa: "Item Response Theory (IRT) va Wright Map asosidagi ilmiy test",
    bolimId: "diagnostika",
    badge: "Rasch Modeli",
    badgeRang: "border-yellow-500/50 bg-yellow-500/15 text-yellow-300",
    savollarSoni: 30,
    vaqtMin: 60,
    daraja: "Rasch Dichotomous (-3.0 .. +3.0 logit)",
    holat: "ochiq",
    tavsif: "Har bir savolning taxminiy qiyinlik darajasi (b_i) asosida bilim darajasi (theta) va standart xatolik (SE) hisoblanadi.",
    tuzilma: {
      yopiq: "30 ta (A–D)",
      moslashtirish: "Yo'q",
      ochiq: "Yo'q",
    },
    ikon: "kuzatuv",
  },
  {
    id: "ms-simulyator-1",
    slug: "milliy-sertifikat-simulyator",
    nom: "Milliy Sertifikatga Tayyorgarlik Sinovi #1",
    qisqa: "Milliy sertifikat formatidagi 40 talik sinov",
    bolimId: "simulyator",
    badge: "Tayyorgarlik",
    badgeRang: "border-emerald-500/50 bg-emerald-500/20 text-emerald-300",
    savollarSoni: 40,
    vaqtMin: 100,
    daraja: "A, B, C darajalar",
    holat: "ochiq",
    tavsif: "1–32 A-D yopiq test, 33–35 moslashtirish (A-F), 36–40 qoralama daftarda yechiladigan ochiq sonli masalalar to'plami.",
    tuzilma: {
      yopiq: "32 ta (A–D)",
      moslashtirish: "3 ta (A–F)",
      ochiq: "5 ta (Sonli)",
    },
    ikon: "sertifikat",
  },
  {
    id: "ms-simulyator-2",
    slug: "milliy-sertifikat-simulyator-2",
    nom: "Milliy Sertifikatga Tayyorgarlik Sinovi #2",
    qisqa: "Murakkablashtirilgan hisobiy masalalar va organik sintez",
    bolimId: "simulyator",
    badge: "Chuqurlashtirilgan",
    badgeRang: "border-cyan-500/50 bg-cyan-500/20 text-cyan-200",
    savollarSoni: 40,
    vaqtMin: 100,
    daraja: "A, B, C darajalar (yuqori)",
    holat: "ochiq",
    tavsif: "A+ va A darajalarini ko'zlagan abituriyentlar uchun stexiometriya va eritmalar bo'yicha tahliliy variant.",
    tuzilma: {
      yopiq: "32 ta (A–D)",
      moslashtirish: "3 ta (A–F)",
      ochiq: "5 ta (Sonli)",
    },
    ikon: "kolba",
  },
  {
    id: "attestatsiya-1",
    slug: "attestatsiya-sinov",
    nom: "Kimyo Fani O'qituvchilari Attestatsiya Sinovi",
    qisqa: "Attestatsiyaga tayyorgarlik sinovi",
    bolimId: "attestatsiya",
    badge: "Toifa & Ustama",
    badgeRang: "border-purple-500/50 bg-purple-500/20 text-purple-300",
    savollarSoni: 50,
    vaqtMin: 120,
    daraja: "Oliy / 1-toifa",
    holat: "ochiq",
    tavsif: "Pedagogik mahorat va chuqurlashtirilgan anorganik, organik hamda fizik-kimyoviy tahlil savollari.",
    tuzilma: {
      yopiq: "40 ta (A–D)",
      moslashtirish: "5 ta (A–F)",
      ochiq: "5 ta (Sonli)",
    },
    ikon: "ustoz",
  },
]

const MAKSIMAL_BALL = "Rasmiy sertifikatda ixtisoslik fanidan maksimal ball."
const PROPORSIONAL_BALL = "Rasmiy sertifikatda ixtisoslik fanidan proporsional ball."

const DARAJA_KORINISHI = {
  "A+": {
    imtiyoz: MAKSIMAL_BALL,
    chegaraRang: "border-yellow-400/60 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 text-yellow-300",
  },
  A: {
    imtiyoz: MAKSIMAL_BALL,
    chegaraRang: "border-emerald-400/50 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-300",
  },
  "B+": {
    imtiyoz: PROPORSIONAL_BALL,
    chegaraRang: "border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 text-blue-300",
  },
  B: {
    imtiyoz: PROPORSIONAL_BALL,
    chegaraRang: "border-cyan-400/50 bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 text-cyan-300",
  },
  "C+": {
    imtiyoz: PROPORSIONAL_BALL,
    chegaraRang: "border-purple-400/50 bg-gradient-to-br from-purple-500/20 to-violet-500/10 text-purple-300",
  },
  C: {
    imtiyoz: PROPORSIONAL_BALL,
    chegaraRang: "border-slate-400/50 bg-gradient-to-br from-slate-500/20 to-zinc-500/10 text-slate-300",
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
