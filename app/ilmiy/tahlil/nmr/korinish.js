"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// YaMR SPEKTROSKOPIYA — ASOSIY NAZARIY SAHIFA (PREMIUM v2.0)
// Manbalar:
//   • Rabi I.I. (Nobel 1944) — molekulyar dastalarda YaMR
//   • Bloch F. & Purcell E.M. (Nobel 1952) — kondensatsiyalangan fazada YaMR
//   • Ernst R.R. (Nobel 1991) — FT-NMR va 2D NMR
//   • Wüthrich K. (Nobel 2002) — biomolekulalarning eritma NMR strukturasi
//   • Pople J.A. (Nobel 1998) — kvant-kimyoviy ekranlash hisoblari
//   • Ramsey N.F. (Nobel 1989) — kimyoviy siljish nazariyasi
//   • Lauterbur P. & Mansfield P. (Nobel 2003) — MRI
// Nazariya: Zeeman → Larmor → Bloch → Ramsey → Solomon-Bloembergen-Morgan
// Yadrolar: ¹H, ²H, ¹¹B, ¹³C, ¹⁴N, ¹⁵N, ¹⁷O, ¹⁹F, ²⁷Al, ²⁹Si, ³¹P, ⁵¹V, ⁵⁹Co,
//           ⁷⁷Se, ¹⁰³Rh, ¹⁰⁹Ag, ¹¹⁹Sn, ¹⁸³W, ¹⁹⁵Pt, ²⁰⁵Tl
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 1. YADRO MA'LUMOTLARI (kengaytirilgan — koordinatsion kimyo uchun)
// ─────────────────────────────────────────────────────────────────────────────
const NUCLEI_DATA = [
  {
    symbol: "¹H",
    name: "Proton",
    spin: "1/2",
    gamma: 267.522,
    frequency: 400.13,
    abundance: 99.985,
    sensitivity: 1.0,
    receptivity: 1.0,
    range: "0–12 ppm (diamagnit); ±200 ppm (paramagnit)",
    reference: "Si(CH₃)₄ — TMS (δ = 0 ppm)",
    typicalShifts: "Alifatik C–H: 0.5–3; NH₃ (koord.): 2.5–4.5; aromatik: 6.5–8.5; M–H (gidrid): −5 dan −25 ppm",
    description: "Eng sezgir I=1/2 yadro. Barcha organik va gidrid ligandlar uchun asosiy zond. Kompleks birikmalarda ligandlarning ekvivalentligi va simmetriyasini aniqlashda hal qiluvchi. Metall gidridlarida katta salbiy siljish — o'ta yuqori diamagnit ekranlash tufayli."
  },
  {
    symbol: "²H",
    name: "Deyteriy",
    spin: "1",
    gamma: 41.066,
    frequency: 61.42,
    abundance: 0.0156,
    sensitivity: 0.00965,
    receptivity: 0.00822,
    range: "0–12 ppm (¹H bilan bir xil shkala)",
    reference: "C₆D₆ yoki CDCl₃ (lock signal)",
    typicalShifts: "¹H bilan bir xil, lekin izotop effekt tufayli 0.02 ppm past",
    description: "I=1 kvadrupol yadro. NMR spektrometrida field-frequency lock uchun ishlatiladi (deyterlangan erituvchi orqali). Kvadrupol relaksatsiya tufayli signallar keng (Δν₁/₂ ~ 1–5 Hz)."
  },
  {
    symbol: "¹¹B",
    name: "Bor-11",
    spin: "3/2",
    gamma: 85.847,
    frequency: 128.38,
    abundance: 80.10,
    sensitivity: 0.165,
    receptivity: 0.132,
    range: "−120 dan +90 ppm",
    reference: "BF₃·OEt₂ (δ = 0 ppm)",
    typicalShifts: "sp³ B (BH₄⁻, BR₄⁻): −40 dan −10; sp² B (BR₃, boronatlar): +20 dan +80",
    description: "Bor komplekslari, karboranlar, N-heterotsiklik boranlar uchun. Kvadrupol yadro (I=3/2), lekin nisbatan tor signallar tufayli qulay. ¹¹B–¹H HSQC — B–H bog'larini ochish."
  },
  {
    symbol: "¹³C",
    name: "Uglerod-13",
    spin: "1/2",
    gamma: 67.283,
    frequency: 100.62,
    abundance: 1.109,
    sensitivity: 0.0159,
    receptivity: 0.000177,
    range: "0–250 ppm (diamagnit)",
    reference: "Si(CH₃)₄ — TMS (δ = 0 ppm)",
    typicalShifts: "Alifatik: 0–50; alkenlar/aromatik: 100–160; karbonil: 165–220; M–CO: 175–260; M–CN: 130–180; karbenlar Fischer/Schrock: 250–400",
    description: "Organik va organometall ligandlar uchun. Past sezgirlik va tabiiy tarqalish tufayli 1024–10240 skan kerak. Proton-decoupled (¹H{¹H}) va DEPT tajribalari standart. M–CO, M–karben, M–karbin siljishlari — bog'ning π-akseptorlik darajasini ko'rsatadi."
  },
  {
    symbol: "¹⁴N",
    name: "Azot-14",
    spin: "1",
    gamma: 19.338,
    frequency: 28.90,
    abundance: 99.632,
    sensitivity: 0.00101,
    receptivity: 0.00101,
    range: "−400 dan +1000 ppm",
    reference: "CH₃NO₂ yoki NH₃(l) (0 ppm)",
    typicalShifts: "NH₃ ligandi: −380 dan −340; nitrilllar: −150 dan −200; NO₂⁻ (N): −20; NO₃⁻: −5",
    description: "I=1 kvadrupol yadro (Q = 0.0193 fm²). Kvadrupol relaksatsiya tufayli signallar keng (10–1000 Hz), lekin yuqori simmetrik atrof-muhitda tor bo'lishi mumkin."
  },
  {
    symbol: "¹⁵N",
    name: "Azot-15",
    spin: "1/2",
    gamma: -27.116,
    frequency: 40.55,
    abundance: 0.368,
    sensitivity: 0.00104,
    receptivity: 0.00000384,
    range: "−400 dan +1000 ppm",
    reference: "NH₃(l) yoki CH₃NO₂ (belgi shartli)",
    typicalShifts: "NH₃ (koord.): 30–80; amino (en, dien): 20–50; piridin: 300; imin: 320–360; azid (M–N₃): 250–350; nitro (M–NO₂): 380–420; nitrito (M–ONO): 500–540",
    description: "I=1/2 tor signallar. Manfiy γ (γₙ<0) — NOE salbiy. Tabiiy tarqalish 0.37% — ⁱ⁵N-boyitilgan namunalar zarur. Nitro/nitrito, azid/tsianid izomerlarni bir-biridan ajratishda hal qiluvchi."
  },
  {
    symbol: "¹⁷O",
    name: "Kislorod-17",
    spin: "5/2",
    gamma: -36.281,
    frequency: 54.25,
    abundance: 0.038,
    sensitivity: 0.0291,
    receptivity: 0.0000111,
    range: "−100 dan +1600 ppm",
    reference: "H₂O (0 ppm)",
    typicalShifts: "H₂O (koord.): 0–200; OH⁻: 100–200; oksometallalar M=O: 500–1200; peroksidlar: 200–500",
    description: "I=5/2 kvadrupol yadro. Metall–aqua, okso- va perokso-komplekslar uchun yagona bevosita zond. ¹⁷O-boyitilgan H₂O bilan izotop almashinish tajribalari qo'llaniladi."
  },
  {
    symbol: "¹⁹F",
    name: "Ftor-19",
    spin: "1/2",
    gamma: 251.662,
    frequency: 376.50,
    abundance: 100.0,
    sensitivity: 0.834,
    receptivity: 0.834,
    range: "−300 dan +100 ppm",
    reference: "CFCl₃ (0 ppm)",
    typicalShifts: "M–F (terminal): −150 dan −450; PF₆⁻: −72 (dublet, ¹J(P–F)=710 Hz); BF₄⁻: −150; CF₃ guruh: −60 dan −80",
    description: "Sezgirlik ¹H ga yaqin. Ftor komplekslari, fluorofosfat/fluoroborat qarshi-ionlari, ftorli ligandlar (TFA, CF₃SO₃⁻) uchun. Kimyoviy siljish diapazoni juda keng — kichik struktura o'zgarishlariga o'ta sezgir."
  },
  {
    symbol: "²⁷Al",
    name: "Alyuminiy-27",
    spin: "5/2",
    gamma: 69.762,
    frequency: 104.26,
    abundance: 100.0,
    sensitivity: 0.207,
    receptivity: 0.207,
    range: "−50 dan +200 ppm",
    reference: "Al(H₂O)₆³⁺ (0 ppm)",
    typicalShifts: "AlO₆ (oktaedrik): 0–20; AlO₅: 30–40; AlO₄ (tetraedrik): 55–80; alyuminatlar: 60–80",
    description: "I=5/2. Koordinatsion soni bevosita siljishdan aniqlanadi (AlO₄ vs AlO₆). Alyumosilikatlar, MOF, zeolitlar tahlilida asosiy zond."
  },
  {
    symbol: "³¹P",
    name: "Fosfor-31",
    spin: "1/2",
    gamma: 108.394,
    frequency: 161.98,
    abundance: 100.0,
    sensitivity: 0.0665,
    receptivity: 0.0665,
    range: "−250 dan +250 ppm",
    reference: "85% H₃PO₄ (0 ppm)",
    typicalShifts: "PPh₃ (erkin): −6; PPh₃ (koord.): 20–60; dppe: −12→ 40 (koord.); PF₃: 106; P(OR)₃: 130–150; fosfat: 0–5",
    description: "Fosfin va fosfit ligandlari, katalizatorlar (Wilkinson, Grubbs) uchun asosiy zond. Sezgirlik 100% tabiiy tarqalish tufayli yuqori. Koordinatsiya siljishi Δδ = δ(koord.) − δ(erkin) — bog'lanish darajasini ko'rsatadi."
  },
  {
    symbol: "⁵¹V",
    name: "Vanadiy-51",
    spin: "7/2",
    gamma: 70.362,
    frequency: 105.19,
    abundance: 99.750,
    sensitivity: 0.383,
    receptivity: 0.382,
    range: "−2000 dan +800 ppm",
    reference: "VOCl₃ (0 ppm)",
    typicalShifts: "VO₄³⁻: −540; V(V) polioksometalatlar: −400 dan −600; V(V) peroksokomplekslar: −500 dan −700",
    description: "I=7/2, lekin nisbatan kichik kvadrupol moment tufayli signallar tor. Polioksovanadatlar va vanad(V) fermentlarini o'rganish uchun."
  },
  {
    symbol: "⁵⁹Co",
    name: "Kobalt-59",
    spin: "7/2",
    gamma: 63.472,
    frequency: 94.85,
    abundance: 100.0,
    sensitivity: 0.278,
    receptivity: 0.278,
    range: "−4200 dan +15000 ppm",
    reference: "K₃[Co(CN)₆] (0 ppm)",
    typicalShifts: "[Co(CN)₆]³⁻: 0 (ref); [Co(NH₃)₆]³⁺: +8120; [Co(en)₃]³⁺: +7180; [Co(H₂O)₆]³⁺: +15000; [Co(acac)₃]: ~+12500",
    description: "Diamagnit Co(III) komplekslarining eng sezgir zondi. Diapazon ~19000 ppm — kimyoning eng katta δ-oralig'i. Ramsey paramagnit hissasining lantanoid emas d-metall uchun klassik namunasi (paramagnit shielding term dominant emas — paramagnit orbital hissa)."
  },
  {
    symbol: "⁷⁷Se",
    name: "Selen-77",
    spin: "1/2",
    gamma: 51.253,
    frequency: 76.31,
    abundance: 7.63,
    sensitivity: 0.00693,
    receptivity: 0.000530,
    range: "−1000 dan +2500 ppm",
    reference: "Me₂Se (0 ppm)",
    typicalShifts: "R₂Se: 0–500; RSe⁻: −300 dan −500; SeO₃²⁻: 1300; SeO₄²⁻: 1050",
    description: "Selenat, selenit, organoselen va Se-ligandli komplekslar uchun. Tor signallar (I=1/2), ammo past sezgirlik."
  },
  {
    symbol: "¹⁰³Rh",
    name: "Rodiy-103",
    spin: "1/2",
    gamma: -8.468,
    frequency: 12.62,
    abundance: 100.0,
    sensitivity: 0.0000311,
    receptivity: 0.0000311,
    range: "−2000 dan +12000 ppm",
    reference: "Ξ(¹⁰³Rh) = 3.16 MHz (Rh(acac)₃)",
    typicalShifts: "Rh(I) kvadrat-planar: 200–1500; Rh(III) oktaedrik: 6000–10000; RhH klasterlar: −400 dan −1000",
    description: "Eng past sezgir asosiy metall yadrolaridan biri. Odatda 2D ¹H–¹⁰³Rh yoki ³¹P–¹⁰³Rh HMQC orqali bilvosita aniqlanadi. Wilkinson katalizatori va boshqa Rh katalizatorlari uchun."
  },
  {
    symbol: "¹⁰⁹Ag",
    name: "Kumush-109",
    spin: "1/2",
    gamma: -12.518,
    frequency: 18.62,
    abundance: 48.161,
    sensitivity: 0.0000488,
    receptivity: 0.0000278,
    range: "−100 dan +1200 ppm",
    reference: "AgNO₃ (0 ppm, aq)",
    typicalShifts: "Ag(I) lineer L–Ag–L: 400–800; Ag(I) tetraedrik: 900–1200",
    description: "Kumush komplekslari va MOF uchun. Manfiy γ, past sezgirlik. INEPT/HMQC bilvosita metodlar."
  },
  {
    symbol: "¹¹⁹Sn",
    name: "Qalay-119",
    spin: "1/2",
    gamma: -100.208,
    frequency: 149.21,
    abundance: 8.59,
    sensitivity: 0.0517,
    receptivity: 0.00444,
    range: "−2200 dan +2000 ppm",
    reference: "Me₄Sn (0 ppm)",
    typicalShifts: "R₄Sn: 0–200; R₃SnX: 100–200; SnCl₄: −150; SnCl₆²⁻: −730; Sn(II) komplekslar: −1000 dan −2000",
    description: "Sn(II) va Sn(IV) komplekslarini farqlashda hal qiluvchi. Mössbauer bilan komplementar. ¹J(¹¹⁹Sn–¹³C) — koordinatsion holatni ko'rsatuvchi asosiy parametr."
  },
  {
    symbol: "¹⁸³W",
    name: "Volfram-183",
    spin: "1/2",
    gamma: 11.283,
    frequency: 16.67,
    abundance: 14.31,
    sensitivity: 0.000107,
    receptivity: 0.0000107,
    range: "−4000 dan +8000 ppm",
    reference: "Na₂WO₄ (aq) (0 ppm)",
    typicalShifts: "WO₄²⁻: 0 (ref); polioksovolframatlar: −80 dan −300; W(CO)₆: −3480",
    description: "Polioksometalatlar (Keggin, Dawson strukturalari) uchun. Har bir kristallografik jihatdan mustaqil W atom o'z signalini beradi."
  },
  {
    symbol: "¹⁹⁵Pt",
    name: "Platina-195",
    spin: "1/2",
    gamma: 58.385,
    frequency: 86.05,
    abundance: 33.832,
    sensitivity: 0.00994,
    receptivity: 0.00336,
    range: "−8000 dan +7000 ppm (~15000 ppm diapazon)",
    reference: "Na₂[PtCl₆] (0 ppm)",
    typicalShifts: "Pt(II) kvadrat-planar N₄: −2800 dan −3200; PtCl₄²⁻: −1620; sisplatin [Pt(NH₃)₂Cl₂]: −2100; transplatin: −1850; Pt(IV) oktaedrik: −5000 dan −7000",
    description: "Sis/trans, tsis-trans-tsis izomerlarni farqlashda oltin standart. Trans-effekt va trans-influence bevosita ¹J(¹⁹⁵Pt–X) konstantalarida aks etadi. Karboplatin, oksaliplatin va boshqa Pt-dorilarining sifat nazorati asosi."
  },
  {
    symbol: "²⁰⁵Tl",
    name: "Talliy-205",
    spin: "1/2",
    gamma: 156.974,
    frequency: 231.10,
    abundance: 70.476,
    sensitivity: 0.192,
    receptivity: 0.135,
    range: "−6000 dan +6000 ppm",
    reference: "Tl(NO₃)₃ (aq) yoki TlClO₄",
    typicalShifts: "Tl(I) suvli: 0–500; Tl(III) komplekslar: 1500–4000; organotalliy R₃Tl: 3000–5000",
    description: "K⁺ mimika sifatida biologik tizimlarni o'rganish uchun. Yuqori γ tufayli sezgirlik yaxshi. Talliyning kimyoviy siljishi geometriya va oksidlanish darajasiga o'ta sezgir."
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 2. NAZARIY ASOSLAR (fizik-matematik)
// ─────────────────────────────────────────────────────────────────────────────
const THEORY_SECTIONS = [
  {
    id: "zeeman",
    title: "Zeeman effekti va spin energiya darajalari",
    icon: "",
    content: `Yadro I spin kvant soniga ega (I = 0, 1/2, 1, 3/2, ...). Tashqi magnit maydoni B₀ yo'q bo'lganda 2I+1 magnit kvant soni holatlari (mᵢ = −I, −I+1, ..., +I) energiya jihatidan aynan tenglashgan (degenerativ).

B₀ maydoni qo'llanilganda Zeeman effekti tufayli bu holatlar bo'linadi:
    E(mᵢ) = −mᵢ · γ · ℏ · B₀

I = 1/2 yadro uchun (¹H, ¹³C, ³¹P, ¹⁹F, ¹⁵N, ¹⁹⁵Pt) faqat ikkita holat mavjud: α (mᵢ = +1/2, past energiya) va β (mᵢ = −1/2, yuqori energiya, γ > 0 uchun). Ikki holat orasidagi energiya farqi:
    ΔE = γ · ℏ · B₀ = h · ν₀

Bu yerdan Larmor rezonans chastotasi:
    ν₀ = (γ / 2π) · B₀    yoki    ω₀ = γ · B₀ (rad/s)

Masalan, B₀ = 9.4 T (400 MHz spektrometr) uchun ¹H ν₀ = 400.13 MHz, ¹³C uchun 100.62 MHz, ³¹P uchun 161.98 MHz.`,
    formula: "ΔE = γℏB₀ = hν₀   ⟹   ν₀ = γB₀/(2π)",
    source: "Bloch (1946); Purcell (1946); Nobel 1952"
  },
  {
    id: "boltzmann",
    title: "Boltzmann taqsimoti va NMR sezgirligi",
    icon: "",
    content: `NMR signali α va β holatlar populyatsiyalari orasidagi farqga to'g'ri proporsional. Termik muvozanatda:
    Nβ/Nα = exp(−ΔE/kBT) ≈ 1 − γℏB₀/(kBT)

Populyatsiya farqi (300 K, ¹H, 9.4 T uchun):
    ΔN/N ≈ γℏB₀/(2kBT) ≈ 3.3 × 10⁻⁵

Ya'ni 100 000 yadrodan atigi ~3 tasi signalga hissa qo'shadi! Bu NMR-ning ichki past sezgirligi sababidir. Sezgirlikni oshirish yo'llari:
• Yuqori maydonli magnitlar (900–1200 MHz)
• Kriyogen probelar (CryoProbe™, ~4×)
• DNP (dynamic nuclear polarization, 10²–10⁴×)
• para-Hydrogen (PHIP, PASADENA)
• Ko'p skan yig'ish (S/N ∝ √n)

Signal intensivligi:
    S ∝ N · γ³ · B₀² · I(I+1)`,
    formula: "ΔN/N ≈ γℏB₀/(2kBT)",
    source: "Abragam A. \"Principles of Nuclear Magnetism\" (1961)"
  },
  {
    id: "chemshift",
    title: "Kimyoviy siljish nazariyasi (Ramsey formulasi)",
    icon: "",
    content: `Yadroning atrofidagi elektronlar B₀ ta'sirida induktiv toklar hosil qiladi va mahalliy maydonni o'zgartiradi:
    B_local = B₀(1 − σ)

Bu yerda σ — ekranlash konstantasi (shielding tensor). Kimyoviy siljish esa nisbiy o'lchov (referens moddaga nisbatan):
    δ (ppm) = [(ν_namuna − ν_ref) / ν_ref] × 10⁶ = (σ_ref − σ_namuna) × 10⁶

Ramsey (1950) formulasi ekranlashni ikki komponentaga ajratadi:
    σ = σ_dia + σ_para

σ_dia (Lamb hissasi) — elektronlar B₀ atrofida aylanishidan hosil bo'ladigan diamagnit ekranlash. Har doim ijobiy, sferik simmetrikda ustunlik qiladi.

σ_para (paramagnit hissa) — asosiy va qo'zg'algan elektron holatlar aralashuvidan hosil bo'ladi:
    σ_para ∝ −⟨r⁻³⟩ · Σ [(ψ₀ | L̂ | ψₙ)(ψₙ | L̂/r³ | ψ₀)] / (Eₙ − E₀)

σ_para asosan (Eₙ − E₀) — HOMO-LUMO ajratmasiga teskari proporsional. Kichik ΔE → katta paramagnit siljish. Shu sabab ⁵⁹Co(III) va ¹⁹⁵Pt kabi kichik d–d o'tishlarga ega metallar juda katta δ diapazoniga ega.

TENZOR TABIATI: σ aslida 3×3 tenzor bo'lib, ǁ va ⊥ komponentlari farq qiladi. Eritmada tez izotrop aylanish tufayli faqat izotrop qism kuzatiladi:
    σ_iso = (σ₁₁ + σ₂₂ + σ₃₃)/3

Qattiq holatda MAS (magic angle spinning, θ = 54.74°) orqali izotrop qismni ajratib olish mumkin.`,
    formula: "δ = (σ_ref − σ_namuna) × 10⁶ ;   σ = σ_dia + σ_para",
    source: "Ramsey N.F. Phys. Rev. 78, 699 (1950); Nobel 1989"
  },
  {
    id: "jcoupling",
    title: "Spin-spin bog'lanish (skalyar J-bog'lanish)",
    icon: "🔗",
    content: `J-bog'lanish (indirekt yoki skalyar bog'lanish) — bog'langan elektronlar orqali uzatiladigan yadrolararo o'zaro ta'sir. B₀ dan mustaqil, Hz da o'lchanadi. Fermi-kontakt mexanizmi ustun (bog'lovchi orbitalning yadrodagi s-xarakteri kerak).

n = bog'lar soni bo'yicha turlari:
• ¹J — bir bog' orqali (masalan, ¹J(¹³C–¹H) ~ 125–250 Hz; ¹J(¹⁹⁵Pt–³¹P) ~ 2000–4000 Hz)
• ²J — geminal (H–C–H): typik 0–15 Hz
• ³J — visinal (H–C–C–H): 0–12 Hz, KARPLUS munosabatiga bo'ysunadi
• ⁴J — meta yoki W-tuzilishli: 0–3 Hz

KARPLUS TENGLAMASI (visinal ³J):
    ³J(HH) = A cos²φ + B cosφ + C
    (Karplus 1959, tipik A=10, B=−1, C=1 Hz)

φ — dihedral burchak. Bu tenglama peptid konformatsiyasi, tsikllar geometriyasi va xelat halqalarini o'rganishda asosiy vosita.

KOORDINATSION KIMYODA MUHIM ¹J KONSTANTALAR:
• ¹J(¹⁹⁵Pt–¹H) sis: 40–65 Hz;   trans: > 3000 Hz (M–H gidridlar)
• ¹J(¹⁹⁵Pt–¹⁵N) sis-NH₃: 280 Hz;  trans-NH₃: 330 Hz
• ¹J(¹⁹⁵Pt–³¹P) trans-P (P trans P): 2400–2600 Hz
• ¹J(¹⁹⁵Pt–³¹P) trans-Cl: 3200–3600 Hz
Trans-influence darajasi: H⁻ > CH₃⁻ > PR₃ > Cl⁻ > NH₃ — Pt–L bog'ini bo'shashtiradi, ¹J(Pt–L') ni oshiradi.

MULTIPLETLIK QOIDASI (n+1 qoida):
Ekvivalent bo'lmagan qo'shni n ta I=1/2 yadro bilan bog'langan yadro n+1 multiplet beradi, intensivliklar Paskal uchburchagi bo'yicha (1:1, 1:2:1, 1:3:3:1, ...).

Umumiy holda (turli qo'shnilar): (2nI+1) qoida, har xil J qiymatlari uchun ko'paytiruv.

AX / AB / AA'BB' TIZIMLAR:
• AX (Δν/J ≫ 10) — ideal 1:1 dublet
• AB (Δν/J ~ 1) — "tom effekti" (roof effect): ichki chiziqlar balandroq
• AA'BB' — ikkinchi tartibli spektr, to'liq analiz kvant-mexanik matritsani echishni talab qiladi`,
    formula: "³J(θ) = A cos²θ + B cosθ + C   (Karplus)",
    source: "Karplus M., J. Am. Chem. Soc. 85, 2870 (1963)"
  },
  {
    id: "relaxation",
    title: "Relaksatsiya: T₁, T₂ va Bloch tenglamalari",
    icon: "⏱️",
    content: `RF impulsdan keyin magnitlanish M vektor termik muvozanatga qaytadi. Bu jarayon Bloch tenglamalari (1946) bilan tavsiflanadi:
    dMz/dt = −(Mz − M₀)/T₁
    dMx,y/dt = −Mx,y/T₂ − ω · Mx,y

T₁ — SPIN-PANJARA RELAKSATSIYA (longitudinal): Mz ning M₀ ga qaytishi. Yadrodan atrof-muhitga (panjara) energiya berish. Impuls tajribalari orasidagi kutish vaqti kamida 5·T₁ bo'lishi kerak (kvantitativ NMR uchun).

T₂ — SPIN-SPIN RELAKSATSIYA (transversal): Mx,y ning yo'qolishi. Spinlar orasida energiya almashinuvi + statik nomono'gunlik. Signal kengligi:
    Δν₁/₂ = 1/(π · T₂*)
    1/T₂* = 1/T₂ + γ·ΔB₀/2   (ΔB₀ — maydon nomono'gunligi)

T₁ ≥ T₂ har doim. Suyuqlikda ko'pincha T₁ ≈ T₂.

RELAKSATSIYA MEXANIZMLARI:
1. Dipol-dipol (DD) — yaqin magnit yadrolar orasidagi ta'sir. Molekulyar aylanish (τc) ga bog'liq.
2. Kimyoviy siljish anizotropiyasi (CSA) — σ tenzor izotrop emasligidan. Yuqori maydonlarda dominant.
3. Skalyar bog'lanish (SC) — vaqt-modulirlangan J.
4. Kvadrupol (Q) — faqat I > 1/2 yadrolar uchun (¹⁴N, ¹⁷O, ³⁵Cl, ⁵⁹Co). Odatda hukmron.
5. Paramagnit — juftlashmagan elektronli markazlar (Solomon-Bloembergen-Morgan tenglamalari).

SOLOMON-BLOEMBERGEN-MORGAN (paramagnit relaksatsiya):
    1/T₁M = (2/15) · (μ₀/4π)² · (γᵢ²gₑ²μB²S(S+1))/r⁶ · [3τc/(1+ωᵢ²τc²) + 7τc/(1+ωₑ²τc²)]

Yaqin protonlar (kichik r) juda kuchli kengayadi (1/r⁶ ga bog'liq). Bu — MRI kontrast agentlarining (Gd³⁺, Mn²⁺) ishlash mexanizmi.`,
    formula: "1/T₂* = 1/T₂ + γΔB₀/2  ;   1/T₁ᴹ ∝ 1/r⁶",
    source: "Bloch F. Phys. Rev. 70, 460 (1946); Solomon I. Phys. Rev. 99, 559 (1955)"
  },
  {
    id: "ftnmr",
    title: "FT-NMR: impuls, FID va Furye almashtirishi",
    icon: "",
    content: `Zamonaviy NMR — impuls-Furye texnikasi (Ernst 1966, Nobel 1991). Ish tartibi:

1. RF IMPULS (90° yoki 30° flip angle) — barcha rezonans chastotalarni bir vaqtda qo'zg'atadi. 90° impuls Mz→Mxy.
    90° impuls davomiyligi: τ₉₀ = π/(2γB₁), tipik 5–15 μs

2. FID (Free Induction Decay) — impulsdan keyingi vaqt sohasidagi signal. Har bir chastota o'z T₂* bilan so'nadi:
    s(t) = Σᵢ Aᵢ · cos(ωᵢt + φᵢ) · exp(−t/T₂ᵢ*)

3. FURYE ALMASHTIRISHI (FT) — vaqt sohasini chastota sohasiga o'tkazadi:
    S(ω) = ∫₀^∞ s(t) · exp(−iωt) dt

Natijada Lorenz shakldagi rezonans piklari:
    S(ω) = A · T₂* / (1 + (ω − ω₀)² · T₂*²)

APODIZATSIYA — FID ga oyna funksiyasini ko'paytirish:
• Exponential (lb=1–3 Hz) — S/N oshiradi, ammo chiziqlarni kengaytiradi
• Gaussian — o'rtacha yechim
• Sine-bell — 2D tajribalar uchun

FAZA KORREKSIYASI: 0-tartib (butun spektrga) va 1-tartib (chastota bo'yicha).

Ko'p skan yig'ish: S/N ∝ √n. 4 marta yaxshiroq S/N → 16 marta ko'p skan kerak.`,
    formula: "S(ω) = FT[s(t)]  ;   S/N ∝ √n",
    source: "Ernst R.R., Anderson W.A. Rev. Sci. Instrum. 37, 93 (1966); Nobel 1991"
  },
  {
    id: "paramagnetic",
    title: "Paramagnit NMR: Contact va Pseudocontact siljishlar",
    icon: "",
    content: `Juftlashmagan elektronli komplekslarda (d¹–d⁹, ba'zi d⁰ dan tashqari; f-elementlar) NMR signallari kuchli siljiydi va kengayadi. Umumiy paramagnit siljish:
    δ_para = δ_contact + δ_pseudocontact

FERMI-KONTAKT (isotropik):
Spin zichligining yadro joyida bo'lishi orqali. Faqat spin s-orbital orqali uzatilganida ta'sirli.
    δ_contact = (A/ℏ) · [gₑ μB S(S+1)] / [3γₙ kB T]

A — giperfayn bog'lanish konstantasi (MHz). δ_contact 1/T ga bog'liq — CURIE bog'liqlik.

PSEUDOCONTACT (dipolyar, McConnell–Robertson):
Anizotrop g-tenzorli metallarda (yoki anizotrop χ-tenzor). Bog' orqali emas, fazoviy dipol-dipol orqali.
    δ_pc = [1 / (12πN_A r³)] · [Δχ_ax(3cos²θ − 1) + (3/2)Δχ_rh sin²θ cos2φ]

Δχ_ax, Δχ_rh — magnit sezuvchanlik tenzorining aksial va rombik anizotropiyasi. r, θ, φ — yadroning metall dan sferik koordinatalari.

EVANS USULI (μeff aniqlash):
Paramagnit erituvchining referens signali diamagnit erituvchidan siljiydi. Bu siljishdan magnit sezuvchanlik χM va samarali magnit moment μeff hisoblanadi:
    χM = (3 · Δν) / (4π · ν · c) + χ₀     (SI o'lchov)
    μeff = 2.828 · √(χM · T)     (B.M.)

Amaliyot: 1) NMR probirkaga paramagnit modda + CDCl₃/D₂O + kichik miqdorda TMS. 2) Ichki kapillyarga toza erituvchi + TMS. 3) ¹H spektrda ikkita TMS pik farqi Δν (Hz) o'lchanadi. 4) Yuqoridagi formulaga qo'yiladi.

Bu — eritma holatida spin holatini aniqlashning eng qulay usuli. HS/LS Fe(II), Co(II) SCO tizimlari uchun standart.`,
    formula: "μeff = 2.828 √(χM · T)  ;   δ_pc ∝ (3cos²θ−1)/r³",
    source: "Evans D.F. J. Chem. Soc. 2003 (1959); Bertini I. \"Solution NMR of Paramagnetic Molecules\" (2001)"
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 3. KIMYOVIY SILJISHLAR JADVALI (kengaytirilgan, koordinatsion kimyo)
// ─────────────────────────────────────────────────────────────────────────────
const CHEMICAL_SHIFTS = [
  // ¹H NMR — ammin va gidrid ligandlar
  { complex: "[Co(NH₃)₆]³⁺", nucleus: "¹H", ligand: "NH₃", shift: "3.5", multiplicity: "singlet", J: "—", notes: "Diamagnit d⁶ low-spin, Oₕ, barcha 18 H ekvivalent" },
  { complex: "cis-[Pt(NH₃)₂Cl₂]", nucleus: "¹H", ligand: "NH₃", shift: "4.06", multiplicity: "s + ¹⁹⁵Pt sattelitlar", J: "²J(Pt–H) = 68 Hz", notes: "Sisplatin. Cis-N ta'sirida δ pastroq" },
  { complex: "trans-[Pt(NH₃)₂Cl₂]", nucleus: "¹H", ligand: "NH₃", shift: "4.28", multiplicity: "s + ¹⁹⁵Pt sattelitlar", J: "²J(Pt–H) = 51 Hz", notes: "Transplatin. Trans-Cl kuchsizroq trans-influence" },
  { complex: "[Rh(H)(CO)(PPh₃)₃]", nucleus: "¹H", ligand: "Rh–H", shift: "−9.2", multiplicity: "dq", J: "¹J(Rh–H)=18, ²J(P–H)=15 Hz", notes: "Gidrid ligand — juda salbiy δ. Wilkinson-tipdagi" },
  { complex: "cis-[Mo(H)₂(PMe₃)₄]", nucleus: "¹H", ligand: "Mo–H", shift: "−4.85", multiplicity: "quintet", J: "²J(P–H) = 42 Hz", notes: "Klassik gidrid, ²J barcha 4 P bilan bir xil" },

  // ¹³C NMR — karbonil va CN
  { complex: "[Cr(CO)₆]", nucleus: "¹³C", ligand: "M–CO", shift: "212.5", multiplicity: "singlet", J: "—", notes: "Neytral π-akseptor karbonil" },
  { complex: "[Mn(CO)₆]⁺", nucleus: "¹³C", ligand: "M–CO", shift: "185.4", multiplicity: "singlet", J: "—", notes: "Katyonik → past δ (π-backbonding kam)" },
  { complex: "[V(CO)₆]⁻", nucleus: "¹³C", ligand: "M–CO", shift: "225.7", multiplicity: "singlet", J: "—", notes: "Anion → yuqori δ (π-backbonding kuchli)" },
  { complex: "K₄[Fe(CN)₆]", nucleus: "¹³C", ligand: "CN⁻", shift: "177", multiplicity: "singlet", J: "—", notes: "Fe(II) LS, barcha CN ekvivalent" },
  { complex: "K₃[Fe(CN)₆]", nucleus: "¹³C", ligand: "CN⁻", shift: "~470", multiplicity: "keng", J: "—", notes: "Fe(III) LS, paramagnit contact shift" },

  // ¹⁵N NMR — linkage izomerizm
  { complex: "[Co(NH₃)₅(NO₂)]²⁺ (nitro, N-bonded)", nucleus: "¹⁵N", ligand: "M–NO₂", shift: "+412", multiplicity: "singlet", J: "—", notes: "N orqali koordinatsiya, sariq izomer" },
  { complex: "[Co(NH₃)₅(ONO)]²⁺ (nitrito, O-bonded)", nucleus: "¹⁵N", ligand: "M–ONO", shift: "+528", multiplicity: "singlet", J: "—", notes: "O orqali koordinatsiya, qizil izomer. Δδ ~ 116 ppm" },
  { complex: "[Co(NH₃)₅N₃]²⁺", nucleus: "¹⁵N", ligand: "M–Nα–Nβ–Nγ", shift: "−280 (Nα), −180 (Nβ), −140 (Nγ)", multiplicity: "3× s", J: "—", notes: "Azid ligand uch xil N atomi" },

  // ³¹P NMR — fosfin ligandlari
  { complex: "PPh₃ (erkin)", nucleus: "³¹P", ligand: "PPh₃", shift: "−4.7", multiplicity: "singlet", J: "—", notes: "Erkin ligand" },
  { complex: "cis-[PtCl₂(PPh₃)₂]", nucleus: "³¹P", ligand: "PPh₃", shift: "+14.2", multiplicity: "s + ¹⁹⁵Pt sattelit", J: "¹J(Pt–P) = 3672 Hz", notes: "Trans-Cl, kuchli trans-Cl → katta ¹J" },
  { complex: "trans-[PtCl₂(PPh₃)₂]", nucleus: "³¹P", ligand: "PPh₃", shift: "+23.4", multiplicity: "s + ¹⁹⁵Pt sattelit", J: "¹J(Pt–P) = 2634 Hz", notes: "Trans-P, kuchli trans-influence → past ¹J" },
  { complex: "[RhCl(PPh₃)₃]", nucleus: "³¹P", ligand: "PPh₃", shift: "+48.9 (trans-Cl), +32.2 (trans-P)", multiplicity: "dd, dt", J: "¹J(Rh–P)=192/145 Hz", notes: "Wilkinson katalizatori" },
  { complex: "[Pd(dppe)Cl₂]", nucleus: "³¹P", ligand: "dppe", shift: "+63.5", multiplicity: "singlet", J: "—", notes: "Koordinatsiya siljishi Δδ ≈ +76 ppm" },

  // ¹⁹F NMR
  { complex: "[PF₆]⁻", nucleus: "¹⁹F", ligand: "PF₆⁻", shift: "−72.4", multiplicity: "dublet", J: "¹J(P–F) = 710 Hz", notes: "Standart qarshi-ion" },
  { complex: "[BF₄]⁻", nucleus: "¹⁹F", ligand: "BF₄⁻", shift: "−151.6", multiplicity: "s + ¹⁰B/¹¹B sattelit", J: "¹J(B–F) = 1.4 Hz", notes: "Standart qarshi-ion" },
  { complex: "cis-[PtF₂(PPh₃)₂]", nucleus: "¹⁹F", ligand: "Pt–F", shift: "−410", multiplicity: "d + Pt sattelit", J: "¹J(Pt–F) = 490 Hz", notes: "Terminal Pt–F" },

  // Metall yadrolari
  { complex: "[Co(CN)₆]³⁻ (ref)", nucleus: "⁵⁹Co", ligand: "Co markaz", shift: "0", multiplicity: "s", J: "—", notes: "Referens standart" },
  { complex: "[Co(NH₃)₆]³⁺", nucleus: "⁵⁹Co", ligand: "Co markaz", shift: "+8120", multiplicity: "s", J: "—", notes: "Oktaedrik Co(III) NH₃₆" },
  { complex: "[Co(en)₃]³⁺", nucleus: "⁵⁹Co", ligand: "Co markaz", shift: "+7180", multiplicity: "s", J: "—", notes: "D₃ simmetriya, xelat effekti" },
  { complex: "[Co(H₂O)₆]³⁺", nucleus: "⁵⁹Co", ligand: "Co markaz", shift: "+15100", multiplicity: "s (keng)", J: "—", notes: "H₂O — kuchsiz maydon, katta ΔE⁻¹ effekt" },
  { complex: "[Co(acac)₃]", nucleus: "⁵⁹Co", ligand: "Co markaz", shift: "+12500", multiplicity: "s", J: "—", notes: "O₆ oktaedrik" },
  { complex: "[PtCl₆]²⁻", nucleus: "¹⁹⁵Pt", ligand: "Pt markaz", shift: "0 (ref)", multiplicity: "s", J: "—", notes: "Referens standart Pt(IV)" },
  { complex: "[PtCl₄]²⁻", nucleus: "¹⁹⁵Pt", ligand: "Pt markaz", shift: "−1620", multiplicity: "s", J: "—", notes: "Tekis kvadrat Pt(II)" },
  { complex: "cis-[Pt(NH₃)₂Cl₂]", nucleus: "¹⁹⁵Pt", ligand: "Pt markaz", shift: "−2100", multiplicity: "s (keng)", J: "—", notes: "Sisplatin" },
  { complex: "trans-[Pt(NH₃)₂Cl₂]", nucleus: "¹⁹⁵Pt", ligand: "Pt markaz", shift: "−1850", multiplicity: "s", J: "—", notes: "Transplatin" },
  { complex: "[Pt(NH₃)₄]²⁺", nucleus: "¹⁹⁵Pt", ligand: "Pt markaz", shift: "−2570", multiplicity: "s", J: "—", notes: "Tekis kvadrat, 4×NH₃" },
  { complex: "[Rh(acac)₃] (ref)", nucleus: "¹⁰³Rh", ligand: "Rh markaz", shift: "0", multiplicity: "s", J: "—", notes: "Ξ = 3.16 MHz referens" },
  { complex: "[Rh(NH₃)₆]³⁺", nucleus: "¹⁰³Rh", ligand: "Rh markaz", shift: "+9915", multiplicity: "s", J: "—", notes: "Oktaedrik Rh(III)" },
  { complex: "[Al(H₂O)₆]³⁺", nucleus: "²⁷Al", ligand: "Al markaz", shift: "0", multiplicity: "s", J: "—", notes: "AlO₆ oktaedrik referens" },
  { complex: "Na[Al(OH)₄]", nucleus: "²⁷Al", ligand: "Al markaz", shift: "+80", multiplicity: "s", J: "—", notes: "AlO₄ tetraedrik" },
]

// ─────────────────────────────────────────────────────────────────────────────
// 4. TRANS-INFLUENCE & SIS/TRANS FARQLASH (koordinatsion kimyo)
// ─────────────────────────────────────────────────────────────────────────────
const TRANS_INFLUENCE = [
  { ligand: "H⁻ (gidrid)", pt_p: "~1300", note: "Eng kuchli trans-influence" },
  { ligand: "CH₃⁻, aril", pt_p: "~1700", note: "σ-donor kuchli" },
  { ligand: "PR₃ (fosfin)", pt_p: "~2400", note: "trans-P holatida" },
  { ligand: "CO", pt_p: "~2600", note: "π-akseptor, o'rtacha" },
  { ligand: "NH₃, amin", pt_p: "~3200", note: "Sof σ-donor, kuchsiz trans" },
  { ligand: "Cl⁻", pt_p: "~3600", note: "Klassik trans-Cl kuchsiz ta'sir" },
  { ligand: "O-donorlar", pt_p: "~3800", note: "Eng kuchsiz trans-influence" },
]

// ─────────────────────────────────────────────────────────────────────────────
// 5. DINAMIK JARAYONLAR — VT-NMR va kinetika
// ─────────────────────────────────────────────────────────────────────────────
const DYNAMIC_PROCESSES = [
  {
    name: "Ligand almashinish (koordinatsion labillik)",
    timescale: "10⁻⁶ – 10⁹ s⁻¹",
    method: "VT-NMR, EXSY, saturation transfer",
    examples: [
      "[Cr(H₂O)₆]³⁺ — o'ta inert (kH₂O ≈ 2.4×10⁻⁶ s⁻¹)",
      "[Cu(H₂O)₆]²⁺ — o'ta labil (kH₂O ≈ 4.4×10⁹ s⁻¹, Jahn-Teller)",
      "[Co(NH₃)₆]³⁺ — inert (kNH₃ < 10⁻⁶ s⁻¹, LFSE stabilizatsiya)",
      "[Ni(H₂O)₆]²⁺ — mo'tadil (kH₂O ≈ 3.15×10⁴ s⁻¹)"
    ],
    theory: "Eigen-Wilkins mexanizmi: I_d (interchange dissociative) yoki I_a (associative). Almashinish tezligi log k qiymatlarida ~15 tartib farq qiladi. Yuqori spin d³/d⁶/d⁸ konfiguratsiyalar odatda inertroq. NMR chizig'i shakli quyidagi rejimlarga bo'linadi: sekin (2 pik), tez (1 pik), oraliq (Kubo–Anderson–Sack koalessansiya). Koalessansiya haroratida:\n    k_c = π·Δν/√2 ≈ 2.22·Δν\nEyring formulasidan ΔG‡ topiladi:\n    ΔG‡ = RTc[22.96 + ln(Tc/Δν)]  (J/mol)"
  },
  {
    name: "Fluksionallik (intramolekulyar qayta guruhlash)",
    timescale: "10² – 10⁷ s⁻¹",
    method: "VT-NMR, 2D EXSY (mixing time bilan)",
    examples: [
      "Fe(CO)₅ — Berry pseudorotation (5-koord. → axial/equatorial almashinuv)",
      "[Fe(η⁵-C₅H₅)(CO)₂(η¹-C₅H₅)] — sigmatropik 1,5-siljish",
      "[Co(acac)₃] — Bailar twist (Δ ⇌ Λ) va Ray-Dutt twist",
      "Tris(β-diketonat) M(dik)₃ komplekslarining rasemizatsiyasi",
      "Trigonal bipiramidalarda ligand almashinuvi"
    ],
    theory: "Berry mexanizmi: 5-koordinatsion TBP → SP (kvadrat piramida) → TBP', axial va equatorial ligandlar joyini almashadi. Fe(CO)₅ da RT da barcha CO ¹³C NMR da bir signal (203 ppm), 78 K da 2:3 ikki signal. Aktivatsiya energiyasi Ea ≈ 8 kJ/mol. Tris-xelat komplekslar uchun Bailar twist trigonal-prizma orqali, Ray-Dutt esa qism-qism halqalarni ochish orqali sodir bo'ladi."
  },
  {
    name: "Linkage izomerizm (bog'lanish izomeriyasi)",
    timescale: "soatlar – kunlar",
    method: "¹⁵N, ¹H NMR, IQ, UV-Vis, DSC",
    examples: [
      "[Co(NH₃)₅(NO₂)]²⁺ (sariq, nitro, N-bonded)",
      "[Co(NH₃)₅(ONO)]²⁺ (qizil, nitrito, O-bonded)",
      "Termik: ONO → NO₂ (qorong'ida sekin, kexo)",
      "Foto-kimyoviy: NO₂ → ONO (UV yorug'lik ostida)",
      "SCN⁻ / NCS⁻ ambidentat"
    ],
    theory: "Ambidentat ligandlar ikki xil donor atomiga ega (N va O; C va N; C va S). Termodinamik barqarorroq izomer HSAB tamoyili bo'yicha aniqlanadi: yumshoq metallar (Pt, Hg) — S/C tomondan, qattiq metallar (Co(III), Cr(III)) — N/O tomondan. ωB97XD/6-31+G(d,p) hisoblari [Co(NH₃)₅(NO₂/ONO)]²⁺ uchun quyidagini beradi: nitro → TS1 (ΔG‡ = 38.16 kkal/mol) → endo-nitrito → TS2 (ΔG‡ = 9.68 kkal/mol) → exo-nitrito. Yo'l intramolekulyar (Co dan uzoqlashmaydi)."
  },
  {
    name: "Konformatsion o'zgarishlar (xelat halqasining flippingi)",
    timescale: "10³ – 10⁷ s⁻¹",
    method: "VT-NMR (Karplus J bo'yicha)",
    examples: [
      "[M(en)₃] — δ ⇌ λ konformatsiyalar (etilenediamin)",
      "[M(dtc)₂] — R₂NC(S)S⁻ ligandi",
      "Kraun-efirlar va kriptandlar"
    ],
    theory: "5-, 6-a'zoli xelat halqalarining puckering (buruvchilik). δ va λ konformatsiyalar (chiral markazlar). VT-NMR da ³J(H–H) qiymatining haroratga bog'liqligi Karplus bo'yicha dihedral burchak o'zgarishini ko'rsatadi."
  },
  {
    name: "Elektron o'z-o'zini almashish (electron self-exchange)",
    timescale: "10⁻² – 10⁷ M⁻¹s⁻¹",
    method: "Line-broadening NMR (Marcus tenglamasi)",
    examples: [
      "[Co(NH₃)₆]²⁺/[Co(NH₃)₆]³⁺ — k = 8×10⁻⁶ M⁻¹s⁻¹ (o'ta sekin — spin holat o'zgarishi)",
      "[Fe(CN)₆]³⁻/[Fe(CN)₆]⁴⁻ — k ≈ 10⁴ M⁻¹s⁻¹",
      "[Ru(bpy)₃]²⁺/³⁺ — k ≈ 10⁹ M⁻¹s⁻¹ (Marcus outer-sphere)"
    ],
    theory: "Marcus nazariyasi: ΔG‡ = (λ + ΔG°)²/(4λ), λ — qayta tashkil etish energiyasi. Diamagnit va paramagnit shakllar aralashmasida NMR signal kengligi elektronni almashish tezligiga bog'liq."
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 6. PARAMAGNIT EFFEKTLAR (kengaytirilgan)
// ─────────────────────────────────────────────────────────────────────────────
const PARAMAGNETIC_EFFECTS = [
  {
    name: "Fermi-kontakt siljishi (isotropik)",
    description: "Juftlashmagan elektron spin zichligining yadro joyida delokalizatsiyasidan. Bog' orqali (through-bond) mexanizm — s-orbital ishtirokini talab qiladi. Curie qonuni bo'yicha 1/T ga bog'liq.",
    formula: "δ_FC = A · gₑ · μB · S(S+1) / [3 γₙ ℏ kB T]",
    range: "Odatda ±100 dan ±1500 ppm gacha",
    examples: [
      "[Fe(acac)₃] — HS d⁵, ¹H δ = −34 (CH), +9.4 (CH₃)",
      "[Co(acac)₂(H₂O)₂] — HS d⁷, ¹H δ_CH₃ = +14",
      "[Ni(acac)₂] — d⁸ tetraedrik HS, ¹H δ_CH ≈ +180",
      "Vanadiy(III), xrom(III) β-diketonatlari"
    ],
    distance: "Bog' soni + orbital simmetriyaga bog'liq (McConnell π-σ juftlashuv)"
  },
  {
    name: "Pseudocontact siljishi (dipolyar, anizotropik)",
    description: "Metallning anizotrop g-tenzori (yoki magnit sezuvchanlik tenzori) bilan yadro orasidagi dipol-dipol o'zaro ta'siri. Fazoviy (through-space) mexanizm. Lantanoid komplekslarida hukmron.",
    formula: "δ_PC = (1/12πN_A r³)[Δχ_ax(3cos²θ−1) + (3/2)Δχ_rh sin²θ cos2φ]",
    range: "Odatda ±5 dan ±150 ppm gacha",
    examples: [
      "[Ln(dpm)₃] va [Ln(fod)₃] — LSR (lanthanide shift reagents)",
      "[Eu(fod)₃] — enantiodifferensiatsiya uchun",
      "[Dy³⁺(DOTA)]⁻ — PARACEST MRI kontrast",
      "Yb³⁺, Tm³⁺ komplekslari — pseudocontact NMR strukturasi tahlili"
    ],
    distance: "1/r³ ga proporsional — masofa aniq o'lchash imkoni beradi"
  },
  {
    name: "Paramagnit relaksatsiya kengayishi (PRE)",
    description: "Juftlashmagan elektronlar T₁, T₂ni juda tezlashtiradi. Signal kengligi 10 Hz dan 10⁴ Hz gacha o'sishi mumkin. Solomon-Bloembergen-Morgan tenglamalari bilan tavsiflanadi.",
    formula: "1/T₁ᴹ = (2/15)(μ₀/4π)²(γᵢ²gₑ²μB²S(S+1))/r⁶ · [3τc/(1+ωᵢ²τc²) + 7τc/(1+ωₑ²τc²)]",
    range: "Signal kengligi Δν₁/₂ = 10¹ – 10⁴ Hz",
    examples: [
      "Cu²⁺, Mn²⁺, Fe³⁺, Gd³⁺ ligandlarida yaqin protonlar yo'qoladi",
      "Gd³⁺ (S=7/2, τ₁ₑ ~ 10⁻⁸ s) — MRI kontrast agent",
      "Mn²⁺-superoksid dismutaza (SOD) yaqin qoldiqlar",
      "Nitroksil radikal (TEMPO) — protein PRE tahlili"
    ],
    distance: "1/r⁶ — juda kuchli masofa bog'liqligi (Distance = r₆⁻¹ ruler)"
  },
  {
    name: "Evans usuli (μeff aniqlash)",
    description: "Paramagnit erituvchining diamagnit standart signalining siljishi orqali molyar sezuvchanlik va samarali magnit moment o'lchanadi. Eritmadagi spin holatini aniqlash uchun oltin standart.",
    formula: "χM_para = (3·Δν)/(4π·ν·c) − χ_diamagnetic;    μeff = 2.828·√(χM·T) B.M.",
    range: "μeff diapazoni: 0.5 dan 12 B.M. gacha",
    examples: [
      "[Fe(H₂O)₆]³⁺ HS: μeff = 5.92 B.M. (spin only, S=5/2)",
      "[Fe(phen)₃]²⁺ LS: μeff ≈ 0 (diamagnit d⁶)",
      "[Fe(3-Rphen)₃]²⁺ SCO: 300 K da μeff ≈ 4.9, 200 K da μeff ≈ 0.5",
      "[Ln(DOTA)]⁻ — teoretik gJ√[J(J+1)] bilan solishtirish"
    ],
    distance: "—"
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 7. 2D VA KENGAYTIRILGAN NMR TAJRIBALARI
// ─────────────────────────────────────────────────────────────────────────────
const ADVANCED_TECHNIQUES = [
  {
    name: "COSY (¹H–¹H COrrelation SpectroscopY)",
    description: "Homonuklear J-bog'lanish tarmog'ini ochish. Bir bog' orqali (¹J, ²J, ³J) yaqinlashgan protonlarni bog'laydi. Diagonal + kross piklar — bog'lanishlar tarmog'i.",
    advantages: ["Bog'lanish tarmog'ini to'liq ochadi", "Nisbatan qisqa vaqt (30 min – 2 soat)", "Barcha spin sistemasini bir tajribada ko'rish"],
    disadvantages: ["Faqat J > 2 Hz aniqlanadi", "Diagonal atrofidagi piklar yashirinishi mumkin", "Ekvivalent protonlar orasida signal yo'q"],
    bestFor: "Ligand tuzilishini aniqlash, xelat halqasi bog'lanishlari",
    examples: "1D-DQF-COSY, PS-COSY, LR-COSY (uzoq masofali). Cliff-diagonal artefaktlarni bartaraf etish uchun DQF-COSY tavsiya etiladi."
  },
  {
    name: "TOCSY (Total Correlation SpectroscopY)",
    description: "Butun spin sistemasi ichida signallarni bir-biriga bog'laydi (MLEV-17 yoki DIPSI-2 spin lock orqali). Har bir spin sistemasi (masalan, alifatik amino kislotasi tarmog'i) alohida chiziqda ko'rinadi.",
    advantages: ["Butun spin tizimini ko'rish", "Peptidlarni tahlil qilishda kuchli", "Aralashmalarni ajratish"],
    disadvantages: ["Spin lock uzoq (40–120 ms)", "Namunani qizdirishi mumkin"],
    bestFor: "Peptidli ligandlar, koordinatsion polimerlar, aralashmalar",
    examples: "1D selective TOCSY, 2D TOCSY, HSQC-TOCSY (heterogen versiya)"
  },
  {
    name: "NOESY / ROESY (Nuclear/Rotating Overhauser Effect)",
    description: "Fazoviy yaqin protonlarni (r < 5 Å) bog'laydi. J-bog'lanishga bog'liq emas — dipol-dipol o'zaro ta'sir orqali. NOESY kichik molekulalarda (ωτc « 1) ijobiy, katta molekulalarda (ωτc » 1) manfiy cross-pik. ROESY har doim ijobiy.",
    advantages: ["Fazoviy yaqinlik (< 5 Å) o'lchash", "3D struktura aniqlash", "Konformatsion tahlil"],
    disadvantages: ["Spin-diffuziya (uzoq mixing time da)", "Molekulyar o'lchamga sezgir (o'rta molekulalar uchun NOESY zaif)"],
    bestFor: "3D struktura, koordinatsion sfera geometriyasi, ligand-ligand fazoviy munosabatlari",
    examples: "NOESY (τmix 200–800 ms), ROESY (kichik molekulalar uchun), tr-NOESY (bog'langan holatda)"
  },
  {
    name: "HSQC (Heteronuclear Single Quantum Coherence)",
    description: "¹H–¹³C, ¹H–¹⁵N, ¹H–³¹P bir bog' orqali korrelyatsiya (¹J). INEPT transfer bilan sezgirlik ¹H tomonidan olinadi (γH/γX ~ 4× katta).",
    advantages: ["Yuqori sezgirlik (¹H detection)", "Har bir C–H juftini alohida ko'rish", "13C paydo bo'lgan holatlar tez"],
    disadvantages: ["Faqat ¹J bog'lar", "Kvatarnar C ko'rinmaydi"],
    bestFor: "Organik va organometall ligandlarda C–H, N–H, P–M bog'lanishlar",
    examples: "¹H–¹³C HSQC, ¹H–¹⁵N HSQC (natural abundance), ¹H–³¹P HSQC (fosfin ligandlari), edited-HSQC (CH₂ / CH,CH₃ farqlash)"
  },
  {
    name: "HMBC (Heteronuclear Multiple Bond Correlation)",
    description: "¹H–¹³C va ¹H–¹⁵N ko'p bog'lar orqali (²J, ³J) bog'lanish. Kvatarnar uglerodlar va uzoq masofali korrelyatsiyalarni ko'rish uchun.",
    advantages: ["Kvatarnar C aniqlash", "Molekulaning skelet tuzilishi", "Uzoq masofali bog'lanish"],
    disadvantages: ["¹J filtratsiya to'liq emas", "J qiymatini tanlash kerak (7 Hz standart)"],
    bestFor: "Ligandning to'liq atom-atom tarmoqi, izomerlarni farqlash",
    examples: "HMBC, LR-HSQMBC, ADEQUATE (¹³C–¹³C bog'lanishlar)"
  },
  {
    name: "INADEQUATE (INcredible Natural Abundance DoublE QUAntum Transfer)",
    description: "¹³C–¹³C skalyar bog'lanishlar orqali molekula skeletini bevosita ochish. Faqat 0.011% ehtimollikdagi qo'shni ¹³C–¹³C juftlari signal beradi — juda past sezgirlik.",
    advantages: ["Uglerod skeleti bevosita", "¹H ishtirokisiz — kvatarnar C, karbonil"],
    disadvantages: ["O'ta past sezgirlik (0.01%)", "Katta miqdorda namuna kerak (>100 mg)", "Uzoq o'lchash (12–48 soat)"],
    bestFor: "Ligandning to'liq uglerod skeletini asarlarsiz aniqlash",
    examples: "1D-INADEQUATE, 2D-INADEQUATE"
  },
  {
    name: "DOSY (Diffusion Ordered SpectroscopY)",
    description: "Gradient pulse sequence (BPP-LED, PGSTE) yordamida molekulyar diffuziya koeffitsienti D ni o'lchaydi. Stokes-Einstein: D = kBT/(6πηrH). Molekulyar radiusi rH bevosita.",
    advantages: ["O'lchamlarga ko'ra ajratish", "Agregatsiya va oligomerlanishni aniqlash", "Aralashmalar ichidan komponentlarni ajratish"],
    disadvantages: ["Yuqori barqaror harorat kerak", "Konveksiya artefaktlari", "Gradient probe zarur"],
    bestFor: "Supramolekulyar komplekslar, klasterlar, MOF fragmentlari, oligomerlanish",
    examples: "1D DOSY, 2D DOSY, 3D DOSY-HSQC"
  },
  {
    name: "VT-NMR (Variable Temperature NMR)",
    description: "Haroratni 150–400 K oralig'ida o'zgartirib dinamik jarayonlarni o'rganish. Koalessansiya haroratidan aktivatsiya energiyasi (Eyring, Arrhenius) hisoblanadi.",
    advantages: ["Dinamik jarayonlar kinetikasi", "ΔG‡, ΔH‡, ΔS‡ termodinamikasi", "Konformatsion ravnaqlar"],
    disadvantages: ["Cryogen kerak (past T)", "Erituvchi qotib qolishi", "Uzoq o'lchash"],
    bestFor: "Fluksionallik, ligand almashinish, SCO, konformatsion o'zgarishlar",
    examples: "Fe(CO)₅ Berry pseudorotation, [Co(acac)₃] Bailar twist, SCO tizimlar"
  },
  {
    name: "EXSY (EXchange SpectroscopY)",
    description: "NOESY impulslar ketma-ketligi bilan bir xil, lekin mixing time davomida kimyoviy almashinuv sodir bo'ladi. Cross-piklar almashinishning nisbiy tezligini beradi.",
    advantages: ["Sekin va o'rta almashinuvni aniqlash (10⁻¹–10² s⁻¹)", "Kinetika parametrlari"],
    disadvantages: ["NOE bilan aralashishi mumkin", "Mixing time optimizatsiyasi zarur"],
    bestFor: "Ligand almashinish, izomerizatsiya, konformatsion o'zgarishlar",
    examples: "2D EXSY, saturation transfer difference (STD) NMR"
  },
  {
    name: "Solid-state NMR (CP/MAS)",
    description: "Cross-Polarization (CP) — sezgirlikni ¹H dan olish. Magic Angle Spinning (54.74°) — dipol va CSA anizotropiyani o'rtacha hisoblab, tor chiziqlar. HR-MAS suspenziyalar uchun.",
    advantages: ["Kristall va amorf qattiq namunalar", "Erimaydigan komplekslar, MOFs", "Kristall tuzilishga hushyor"],
    disadvantages: ["Chiziqlar keng (5–200 Hz)", "Maxsus zonda (MAS rotor)", "Uzoq o'lchash"],
    bestFor: "Koordinatsion polimerlar, MOF, zeolitlar, gibrid materiallar",
    examples: "¹H, ¹³C, ¹⁵N CP/MAS; ²⁹Si, ²⁷Al MAS (materiallar), ³¹P HP-MAS (kataliz)"
  },
  {
    name: "DNP-NMR (Dynamic Nuclear Polarization)",
    description: "Elektron spin populyatsiya farqi (~660× ¹H dan katta) mikroto'lqin nurlanish orqali yadro spinlariga o'tkaziladi. Sezgirlik oshishi 10²–10⁴ marta.",
    advantages: ["10⁴× sezgirlik", "Kam miqdordagi namuna", "Boyitilmagan izotoplar"],
    disadvantages: ["Cryogen T (~100 K)", "Radikal qo'shimchalar (TEMPOL, AMUPol)", "Qimmat uskuna"],
    bestFor: "Faol markazlar, protein–ligand komplekslari, sirt kataliz",
    examples: "MAS-DNP, dissolution-DNP, Overhauser-DNP"
  },
  {
    name: "para-Hydrogen (PHIP, SABRE)",
    description: "para-vodorod (I=0, singletli) katalitik hidrogenlash orqali mahsulotning ¹H NMR signalini kuchaytiradi (10³× gacha). SABRE — hidrogenlash bo'lmagan holda katalitik almashinuv orqali.",
    advantages: ["10³× signal", "Real-time kataliz o'rganish", "Kichik konsentratsiyalar"],
    disadvantages: ["Katalizator kerak (Rh, Ir kompleks)", "para-H₂ generator", "Faqat ba'zi ligandlar (piridin, N-heterotsikllar)"],
    bestFor: "Katalitik hidrogenlash mexanizmi, biomarker NMR/MRI",
    examples: "PASADENA, ALTADENA, SABRE-Ir(IMes)(COD)Cl"
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 8. HALAQIT BERUVCHI OMILLAR
// ─────────────────────────────────────────────────────────────────────────────
const INTERFERENCES = [
  {
    source: "Paramagnit metall aralashmasi",
    effect: "Signal kengligi 10–1000 Hz gacha oshadi (PRE), δ juda siljiydi",
    severity: "Yuqori",
    solution: "Chelex-100 yoki EDTA bilan tozalash. Deoksidatsiya (Fe³⁺→Fe²⁺ almashinishi oldini olish). Ar/N₂ atmosfera. Xromatografiya (silikagel, alumina).",
    theoryNote: "Cu²⁺, Fe³⁺, Mn²⁺ kabi metallar deyterlangan erituvchilarda mavjud bo'lishi mumkin. 1/T₂ ∝ 1/r⁶ tufayli hatto 10⁻⁶ M paramagnit modda ham 5 Å radiusdagi protonlarga sezilarli ta'sir qiladi. Solomon-Bloembergen-Morgan tenglamalari orqali ta'sir hisoblanadi."
  },
  {
    source: "Erituvchining qoldiq signali (residual)",
    effect: "CHCl₃: 7.26, DMSO-d₅: 2.50, H₂O(HDO): 4.79 ppm signallari muhim ligand signallarini yashiradi",
    severity: "O'rta",
    solution: "Solvent-suppression (WATERGATE, presaturation, excitation sculpting). Alternative erituvchi tanlash. Yuqori toza deyterlangan reaktivlar (99.96%+ D).",
    theoryNote: "Har bir deyterlangan erituvchi qoldiq protonli izotopolog signaliga ega. Gottlieb, Kotlyar, Nudelman jadvali (J. Org. Chem. 1997, 62, 7512) — barcha keng tarqalgan erituvchilar uchun standart siljishlar."
  },
  {
    source: "Namunaning yetarli erimasligi / cho'kmasi",
    effect: "Signal past intensivlik, spektrometrni tuning qiyin, shim yomonlashuvi",
    severity: "O'rta",
    solution: "Boshqa erituvchi tanlash (DMSO-d₆, D₂O, THF-d₈). Filtratsiya (0.45 μm PTFE). Ultratovushli hammom. Yuqori haroratda eritish.",
    theoryNote: "Kompleks birikmalar odatda qutbli aprotik yoki qutbli protik erituvchilarda eriydi. CDCl₃ neytral, DMSO-d₆ qutbli koordinatsion, D₂O ionli komplekslar uchun. Ammo D₂O da NH₃, NH₂ protonlari almashinib yo'qolishi mumkin."
  },
  {
    source: "Harorat drift / gradient",
    effect: "Kimyoviy siljish 0.001–0.01 ppm/K siljiydi. Dinamik jarayonlar rejimi o'zgaradi.",
    severity: "O'rta",
    solution: "Namuna 15 daqiqa termostatatsiya. Methanol-d₄ yoki etilen glikol termometri bilan haroratni kalibrlash. VT-NMR nazorati.",
    theoryNote: "Amid va OH protonlari eng sezgir (−0.005 dan −0.02 ppm/K). Metanol-CH₃ va OH ning Δδ dan Van Geet formulasi bilan T = 403.0 − 29.53·Δδ − 23.87·Δδ² (K)."
  },
  {
    source: "Kislotalik / pH ta'siri",
    effect: "OH, NH, COOH protonlari pH ga bog'liq kimyoviy siljish. Tez almashinishda kengaygan signal.",
    severity: "O'rta",
    solution: "Bufer eritmalar. pH ni o'lchash va nazorat qilish. Almashinishi tez protonlar uchun ¹⁵N NMR yoki ¹³C dan foydalanish.",
    theoryNote: "Ligand protonlanishi metall koordinatsiyasiga qattiq ta'sir qiladi. pKa siljishlari NMR titratsiya orqali o'lchanadi (Bindmodel yoki Job's plot)."
  },
  {
    source: "Konsentratsiya effekti / agregatsiya",
    effect: "Yuqori konsentratsiyada π-π stacking, H-bonding, dimerlanish → siljish va kengayish",
    severity: "Past",
    solution: "Standart konsentratsiya 5–20 mM. Dilution seriyasi ko'p konsentratsiyada teskari titratsiya. DOSY orqali agregat hajmini tekshirish.",
    theoryNote: "Aromatik ligandlar (bpy, phen, porphyrin) π-π stacking hosil qiladi → RingCurrentShift. 0.1 dan 10 mM gacha aromatik protonlar 0.1–0.5 ppm siljishi mumkin."
  },
  {
    source: "T₁ noto'g'ri kutish (kvantitativ NMR)",
    effect: "Kvatarnar C va o'ziga xos protonlar past intensivlikli",
    severity: "Yuqori (kvantitativ tahlil uchun)",
    solution: "d1 (relaxation delay) = 5·T₁_max. Inversion-recovery bilan T₁ ni o'lchash. Kvantitativ ¹³C uchun invers-gated decoupling + Cr(acac)₃ relaksatsiya agenti.",
    theoryNote: "Kvantitativ NMR (qNMR) uchun integrallar to'g'ri bo'lishi uchun barcha yadrolar to'liq relaksatsiya qilishi kerak. T₁ bilan tanish bo'lmagan ligandlar uchun 30 s d1 xavfsiz starting point."
  },
  {
    source: "Radiofrequency (B₁) nomono'gunlik",
    effect: "Muhim impuls burchagi noaniq (90° → 85°), fazoviy noto'g'rilik",
    severity: "Past–O'rta",
    solution: "Har namuna uchun 90° impuls kalibrlash. Naycha to'liq berilgan (400+ μL) bo'lishi kerak. Deep-groove naychalar.",
    theoryNote: "Impuls uzunligi τ₉₀ = π/(2γB₁). 400 MHz da tipik τ₉₀ = 8–12 μs. 5% xato → 10% signal yo'qotish (sin²(0.95·π/2) = 0.994, deyarli sezilmaydi, ammo 2D-larda kuchaytiriladi)."
  },
  {
    source: "Kvadrupol relaksatsiya (I > 1/2 yadrolar)",
    effect: "¹⁴N, ¹⁷O, ³⁵Cl, ⁵⁹Co signallari juda keng (100–10⁴ Hz)",
    severity: "Yuqori (kvadrupol yadrolar uchun)",
    solution: "Yuqori simmetrik atrof-muhitda o'lchash (Oh, Td → tor signal). Yuqori maydonli spektrometr (kvadrupol relaksatsiya B₀² ga bog'liq emas, ammo signal intensivligi B₀² ga bog'liq).",
    theoryNote: "1/T₁_Q = (3π²/10) · (2I+3)/(I²(2I−1)) · (1 + η²/3) · (e²qQ/ℏ)² · τc. Kvadrupol bog'lanish konstantasi (CQ = e²qQ/h) simmetriyaga qattiq bog'liq: Td/Oh → CQ ≈ 0."
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 9. LABORATORIYA BAJARISH TARTIBI (kengaytirilgan)
// ─────────────────────────────────────────────────────────────────────────────
const LAB_PROCEDURE = [
  {
    step: 1,
    title: "️ Xavfsizlik va tayyorgarlik",
    desc: "Laboratoriya xalat, ko'zoynak, nitril qo'lqop. Kuchli magnit maydoni (5–14 T) — barcha ferromagnit predmetlarni (soat, telefon, kredit karta, tibbiy implantatlar) 5-gauss chizig'idan tashqarida qoldirish. Deyterlangan erituvchilarning MSDS ni o'qish (CDCl₃ — 2B kategoriya karsinogen; DMSO-d₆ — teri orqali oson so'riladi; benzol-d₆ — 1A karsinogen).",
    time: "10 daq",
    theoryNote: "5-gauss (0.5 mT) chizig'i — pace-maker'ga xavfli maydon oralig'i. Kriogen suyuqliklar (helium, azot) — quench holatida kislorod almashinishi mumkin, xona havolashini tekshiring. Superconducting magnit hech qachon o'chirilmaydi — magnit doim yoqilgan holatda."
  },
  {
    step: 2,
    title: "Erituvchi tanlash va namuna tayyorlash",
    desc: "Deyterlangan erituvchi tanlash: CDCl₃ (organik ligandlar), DMSO-d₆ (qutbli komplekslar, yuqori haroratlar), D₂O (ionli komplekslar), CD₃OD (metanol-eruvchi), CD₃CN (koordinatsion), THF-d₈ (past T). 5–20 mg namuna 0.55–0.65 mL erituvchida eritish (10⁻²–10⁻³ M optimal). NMR probirka (Wilmad 528-PP, 5 mm, 178 mm uzunlik) da erituvchi bilan 4–5 sm ustuni.",
    time: "10–20 daq",
    theoryNote: "Erituvchi Δδ jadvali (Gottlieb 1997): CDCl₃ CHCl₃: 7.26, ¹³C: 77.16; DMSO-d₆ DMSO-d₅: 2.50, ¹³C: 39.52; D₂O HDO: 4.79 (25°C). Namunaning to'g'ri hajmi shimming va ¹H B₀ hajm-optimallash uchun kritik."
  },
  {
    step: 3,
    title: "Spektrometrni tayyorlash: lock, shim, tune",
    desc: "1) LOCK: deyteriy signaliga qulflash — dinamik B₀ stabilizatsiyasi (drift < 1 Hz/h). Lock level 60–80% bo'lishi kerak. 2) SHIMMING: Z, Z², Z³ shims (avval avtomatik, keyin qo'lda). ¹H uchun mezon — lineshape TMS/HOD tinch 0.5% chiziq balandligida < 0.6 Hz. 3) TUNING & MATCHING: har namuna uchun probeni ¹H, X-yadroga sozlash. 4) 90° IMPULS KALIBRASYASI: pw90 = θ/90° · pw90_saved (odatda 8–12 μs at 20 dB).",
    time: "15–30 daq",
    theoryNote: "Shim kelvinlari — magnit maydonini bir jinsli qilish uchun elektromagnit rooms. Optimal shim → simmetrik Lorenzian chiziqlar, minimal skirt. Yomon shim → xamsimma chiziqlar, ko'p oyoqli 'lump'."
  },
  {
    step: 4,
    title: "¹H NMR standart tajribasi",
    desc: "Parametrlar: SW (spectral width) = 12–14 ppm (5000–6000 Hz at 400 MHz); AQ (acquisition time) = 2.5–3.5 s; d1 (relaxation delay) = 1.0 s (tez qidiruv uchun) yoki 5 s (kvantitativ); NS (number of scans) = 16–32 (konsentr.), 128–512 (past konsentr.). Impuls 30° (Ernst angle, S/N optimal).",
    time: "5–15 daq",
    theoryNote: "Ernst burchagi cos(α_E) = exp(−TR/T₁). T₁ ≈ 1 s, TR = AQ+d1 = 3.5 s uchun α_E ≈ 67°. 30° impuls — konservativ, T₁ jadvali noma'lum bo'lganda xavfsiz. Kvantitativ uchun 90° + d1 ≥ 5·T₁."
  },
  {
    step: 5,
    title: "¹³C{¹H} NMR (proton-decoupled)",
    desc: "SW = 230 ppm (23000 Hz); AQ = 1.0–1.5 s; d1 = 2 s; NS = 1024–10240 (namuna miqdoriga bog'liq); WALTZ-16 yoki GARP decoupling. Standart 30° impuls. Nuqtai nazar — dekupling ¹H bilan ¹³C ni ajratadi va nuclear Overhauser effect (nOe) orqali sezgirlikni ~3× oshiradi.",
    time: "20 daq – 4 soat",
    theoryNote: "NOE koeffitsienti η = γH/(2γC) = 1.988 (maksimal). Kvatarnar C uchun η past — kvantitativ NMR uchun inverse-gated decoupling (dekupling faqat AQ paytida) + Cr(acac)₃ 20 mM (paramagnit relaksatsiya agenti)."
  },
  {
    step: 6,
    title: "Metall yadrolari (¹⁹⁵Pt, ⁵⁹Co, ³¹P, ¹⁹F)",
    desc: "³¹P: SW = 500 ppm; NS 32–1024. ¹⁹F: SW = 400 ppm; NS 8–256. ¹⁹⁵Pt: SW = 15000 ppm (juda keng!); NS 4096–65536. ⁵⁹Co: SW = 20000 ppm; NS 1024–16384. Metall yadrolari uchun keng SW va tor observable window — signalni topish qiyin. Referens standartni bir vaqtda o'lchash tavsiya etiladi.",
    time: "30 daq – 24 soat",
    theoryNote: "¹⁹⁵Pt uchun sezgirlik ¹H dan ~10⁻⁴ marta past — ammo δ diapazon katta bo'lgani uchun signal joyi juda ma'lumotli. 6.4 mm broadband probe optimal. ⁵⁹Co uchun signal juda keng (Δν 100–5000 Hz) — SW ni to'g'ri tanlash kritik."
  },
  {
    step: 7,
    title: "Kimyoviy siljish va multipletlik tahlili",
    desc: "1) Baseline correction. 2) Referens signaliga kalibr (TMS = 0 uchun ¹H; erituvchi qoldig'i alternativa). 3) Har signal uchun δ (ppm), integrallar (nisbat), multipletlik (s, d, t, q, m, dd, ddd, ...), J (Hz) yozib olish. 4) Multipletlik simulyatsiyasi (MestReNova, Topspin). 5) Integrallarni ligand stoxiometriyasi bilan taqqoslash.",
    time: "20–60 daq",
    theoryNote: "Multipletlik n+1 qoidasi (bir turdagi qo'shni protonlar uchun). Turli qo'shnilar — (n₁+1)(n₂+1)... AB tizimi (Δν/J < 10) da roof effect: ichki chiziqlar balandroq. J qiymatlari bir bog'lanish uchun har ikki tomondan bir xil (reciprocal)."
  },
  {
    step: 8,
    title: "J-bog'lanishlarni aniqlash va tarmoq qurish",
    desc: "1) Har bir multipletdan J qiymatlarini o'lchash (Hz da, chiziqlar orasidagi masofa spektrometr chastotasi × ppm/farq). 2) Bir xil J ga ega signallar — bog'lanish. 3) COSY orqali bevosita tekshirish. 4) ¹J(M–L) ligandning trans-influence darajasini beradi. 5) Karplus tahlili ³J(H–C–C–H) uchun dihedral burchakni beradi.",
    time: "15–40 daq",
    theoryNote: "Odatiy J qiymatlari: ¹J(¹³C–¹H) = 125 Hz (sp³), 160 Hz (sp²), 250 Hz (sp); ²J(¹H–¹H) geminal = 0–15 Hz; ³J(¹H–¹H) visinal 0–12 Hz (Karplus); ¹J(¹⁹⁵Pt–³¹P) trans-P = 2400–2600, trans-Cl = 3200–3600 Hz; ¹J(¹⁹⁵Pt–¹H) 30–80 Hz (yaqin NH), 700–1300 Hz (trans-H)."
  },
  {
    step: 9,
    title: "2D tajribalar (agar zarur bo'lsa)",
    desc: "COSY (30 min–2 s): ¹H–¹H bog'lanish. HSQC (1–4 s): ¹H–¹³C bir bog'. HMBC (2–8 s): ¹H–¹³C ko'p bog'. NOESY (2–6 s, τmix 200–800 ms): fazoviy yaqinlik. Barcha 2D uchun ns=1–8 per t1 nuqta, td1=128–512. Namuna kamida 5 mg toza + tozalik yuqori (95%+).",
    time: "30 daq – 12 soat",
    theoryNote: "2D spektroskopiya vaqti t1 va t2 sohalarida ikkinchi Furye almashtirish orqali chastota × chastota xarita hosil qiladi. Rasm nima uchun 'diagonal + cross piklar'? Chunki tajribaning F₁ va F₂ o'qlari bir xil yadro tipiga tegishli (COSY, NOESY) yoki bir bog' orqali bog'langan (HSQC)."
  },
  {
    step: 10,
    title: "Xulosa, hujjatlashtirish, arxivlash",
    desc: "1) Barcha signallar ligandning har bir atomiga biriktirilgan. 2) Tuzilish ekzempliyari (SMILES yoki InChI) yozilgan. 3) Xom FID va protsessed spektr (.pdf, .png) saqlangan. 4) Metadata: sana, spektrometr, erituvchi, harorat, konsentratsiya, ns, d1, T₁ (agar o'lchangan). 5) IUPAC noman: '¹H NMR (400 MHz, CDCl₃, 298 K) δ 7.35 (m, 5H, Ph), 4.06 (s, 6H, NH₃, ²J(¹⁹⁵Pt–¹H) = 68 Hz), ...'",
    time: "20 daq",
    theoryNote: "NMR ma'lumotlarini nashr etish standarti: Journal of Organic Chemistry, JACS, Chem. Eur. J. rekomendatsiyalari. IUPAC (2001, 2008) — δ pozitiv shielded (past chastota) tomonga o'sadi. Pt/Co/Rh uchun Ξ standartlari (frequency ratio) da hisoblanishi tavsiya etiladi (BIOVIA)."
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 10. AMALIY QO'LLANMA — koordinatsion kimyoning YaMR ilovalari
// ─────────────────────────────────────────────────────────────────────────────
const APPLICATIONS = [
  {
    title: "Sis / trans izomerlarni farqlash",
    icon: "⚖️",
    method: "¹⁹⁵Pt NMR + ¹J(Pt–L) konstantalar",
    example: "cis-[Pt(NH₃)₂Cl₂] δ(¹⁹⁵Pt) = −2100 (²J(Pt–H) = 68 Hz); trans-izomer δ = −1850, ²J = 51 Hz. Cis-izomerda ²J katta chunki NH₃ trans-Cl da (kuchli σ-donor).",
    principle: "Cis-izomerda ekvivalent bo'lmagan 2 xil ligand joyi bo'lishi mumkin, trans-izomerda esa katta simmetriya (odatda C₂ᵥ). ¹J va ²J Pt–L konstantalari ligandning trans-partneriga qattiq bog'liq (trans-influence)."
  },
  {
    title: "Xelat effektining aniqlanishi",
    icon: "",
    method: "¹³C, ¹H koordinatsiya siljishi Δδ",
    example: "PPh₃ dan [Pt(PPh₃)₂Cl₂] ga o'tishda Δδ(³¹P) = +20 ppm; dppe da esa Δδ(³¹P) = +76 ppm — xelat effekti signalni kuchaytiradi.",
    principle: "Bidentat ligand koordinatsiyalanganida ligand konformatsion erkinligi cheklanadi va elektron zichlik metallga kuchliroq beriladi → koordinatsiya siljishi katta."
  },
  {
    title: "Ambidentat ligandlar (linkage izomerizm)",
    icon: "🔀",
    method: "¹⁵N NMR (SCN⁻/NCS⁻, NO₂⁻/ONO⁻ uchun)",
    example: "[Co(NH₃)₅(NO₂)]²⁺ (sariq, nitro): δ(¹⁵N_NO₂) = +412 ppm; [Co(NH₃)₅(ONO)]²⁺ (qizil, nitrito): δ(¹⁵N_ONO) = +528 ppm. Δδ ≈ 116 ppm — juda aniq farq.",
    principle: "N va O donor atomlarining elektron muhiti tubdan farq qiladi. N-koordinatsiya elektron zichlikni azotdan olib ketadi (δ paras'), O-koordinatsiya azotni bo'sh qoldiradi (δ kattaroq)."
  },
  {
    title: "Metall gidridlarini aniqlash",
    icon: "💧",
    method: "¹H NMR (o'ta salbiy δ hududi)",
    example: "HRh(CO)(PPh₃)₃: δ(Rh–H) = −9.2 ppm (dq, ¹J(Rh–H)=18, ²J(P–H)=15 Hz). Klassik gidrid bilan η²-H₂ ni farqlash uchun T₁ o'lchash (η²-H₂ da T₁ < 40 ms).",
    principle: "Metall–H bog'ida gidrid o'ta ekranlangan (yuqori elektron zichlik + katta paramagnit shielding). δ −5 dan −30 ppm gacha. Klassik/η² ajratish uchun Morris T₁ minimum metodi."
  },
  {
    title: "Paramagnit komplekslarda struktura tahlili",
    icon: "🧭",
    method: "Contact + pseudocontact siljishlar, Evans usuli",
    example: "[Fe(salen)]: ¹H NMR da Ph proton δ = +80, +50, +9; CH₃ (imin) δ = +25; salicylate CH₃ δ = −20. Har bir signal molekulaning ma'lum joyiga xos.",
    principle: "Fermi-contact (through-bond, McConnell) + pseudocontact (through-space, McConnell–Robertson). Evans usuli bilan μeff olinadi va spin holat aniqlanadi (HS/LS Fe(II) yoki Co(II))."
  },
  {
    title: "Ligand almashinish kinetikasi",
    icon: "⏳",
    method: "VT-NMR + koalessansiya + Eyring",
    example: "[Ti(η⁵-Cp)₂(NMe₂)₂] da NMe₂ ligandi 300 K da 1 pik (tez), 190 K da 2 pik (sekin). Tc = 245 K, Δν = 145 Hz. k_c = 322 s⁻¹, ΔG‡ = 47 kJ/mol.",
    principle: "Koalessansiya nuqtasida k = π·Δν/√2. Bu qiymat Eyring tenglamasiga qo'yiladi:\n    ln(k·h/kB·T) = −ΔH‡/RT + ΔS‡/R\nBir necha haroratdagi k qiymatlaridan ΔH‡ va ΔS‡ olinadi (disotsiativ mexanizm uchun ΔS‡ > 0)."
  },
  {
    title: "3D struktura (koordinatsion sfera geometriyasi)",
    icon: "",
    method: "NOESY (fazoviy yaqinlik r < 5 Å)",
    example: "Oktaedrik [Co(en)₃]³⁺ Δ va Λ enantiomerlarida NOE cross-piklar. Δ da NH proton yaqin CH₂ bilan cis-NOE ko'proq, Λ da esa boshqacha.",
    principle: "NOESY cross-pik intensivligi 1/r⁶ ga bog'liq (Solomon-Bloembergen). Kalibrlangan ma'lum masofa (masalan, geminal CH₂ 1.78 Å) orqali boshqa masofalarni o'lchash."
  },
  {
    title: "Klasterlar va nanokrupinliklar (DOSY)",
    icon: "🔗",
    method: "DOSY (diffusion coefficient orqali hydrodynamik radius)",
    example: "[Au₂₅(SR)₁₈]⁻ nanoklaster: D = 4.3×10⁻¹⁰ m²/s → rH = 1.1 nm (Stokes-Einstein). Erkin ligand SR-H: D = 12×10⁻¹⁰ m²/s → rH = 0.35 nm.",
    principle: "Stokes-Einstein: D = kBT/(6πη·rH). DOSY 2D spektrida F₁ o'qi log(D) — turli hajmdagi komponentlar turli chiziqlarda ko'rinadi. Aralashmalar va agregatlarni o'lchamlarga ko'ra ajratish."
  },
  {
    title: "Katalitik siklni real-time kuzatish",
    icon: "🔁",
    method: "In-situ NMR (para-H₂ PHIP/SABRE)",
    example: "Ir-katalizli SABRE tajribasi: piridin + para-H₂ + [Ir(IMes)(COD)Cl] → piridin ¹H signali 10³× kuchayadi. Reaksiya mexanizmi (H₂ oksidativ qo'shilishi, substrat almashuvi) real vaqtda kuzatiladi.",
    principle: "para-H₂ (I=0) nuclear singlet holatining polarizatsiya ma'lumotini katalizator orqali substratga uzatadi. J-J' bog'lanish orqali antiphase (PASADENA) yoki inphase (ALTADENA) signal."
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// UI KOMPONENTI
// ─────────────────────────────────────────────────────────────────────────────
export default function YaMRSpektroskopiya() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeNucleus, setActiveNucleus] = useState(0)
  const [activeTheory, setActiveTheory] = useState(0)
  const [activeTechnique, setActiveTechnique] = useState(0)
  const [activeInterference, setActiveInterference] = useState(0)
  const [activeLabStep, setActiveLabStep] = useState(0)
  const [activeApplication, setActiveApplication] = useState(0)
  const [shiftSlider, setShiftSlider] = useState(5)
  const [b0Slider, setB0Slider] = useState(9.4)
  const [selectedFilter, setSelectedFilter] = useState("Barchasi")

  // Larmor chastotasini interaktiv hisoblash
  const larmorFreqs = useMemo(() => ({
    "1H": (42.577 * b0Slider).toFixed(2),
    "13C": (10.708 * b0Slider).toFixed(2),
    "31P": (17.235 * b0Slider).toFixed(2),
    "19F": (40.055 * b0Slider).toFixed(2),
    "195Pt": (9.153 * b0Slider).toFixed(2),
    "59Co": (10.103 * b0Slider).toFixed(2),
  }), [b0Slider])

  // Filtrlangan siljish jadvali
  const filteredShifts = useMemo(() => {
    if (selectedFilter === "Barchasi") return CHEMICAL_SHIFTS
    return CHEMICAL_SHIFTS.filter(r => r.nucleus === selectedFilter)
  }, [selectedFilter])

  const uniqueNuclei = ["Barchasi", ...new Set(CHEMICAL_SHIFTS.map(r => r.nucleus))]

  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">

      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-br from-green-950 to-purple-950 border-2 border-green-500 rounded-2xl p-6 max-w-3xl w-full">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-3xl"></span> YaMR SPEKTROSKOPIYA — YADRO MAGNIT REZONANSI
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-green-300">YaMR (NMR)</strong> — molekulyar tuzilishni atom-atom aniqlashning eng kuchli usuli.
              Kompleks birikmalarda ligandlarning bog'lanishi, geometriya, dinamika va oksidlanish darajasini bir vaqtda beradi.
            </p>

            <div className="bg-green-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-400 font-bold mb-2"> Nazariy asos:</div>
                  <div className="text-purple-200 space-y-2">
                    <div>• <strong>Zeeman effekti</strong> — spin darajalarining ajralishi</div>
                    <div>• <strong>Larmor prekressiyasi</strong> — ν₀ = γB₀/2π</div>
                    <div>• <strong>Ramsey formulasi</strong> — σ = σ_dia + σ_para</div>
                    <div>• <strong>Bloch tenglamalari</strong> — T₁, T₂ relaksatsiya</div>
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-2"> Koordinatsion kimyoda:</div>
                  <div className="text-purple-200 space-y-2">
                    <div>• <strong>Cis / trans</strong> — ¹⁹⁵Pt NMR</div>
                    <div>• <strong>Linkage izomerlar</strong> — ¹⁵N NMR</div>
                    <div>• <strong>Trans-influence</strong> — ¹J(M–L)</div>
                    <div>• <strong>Paramagnit NMR</strong> — Evans usuli, μeff</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-green-300">🏆 Nobel mukofotlari:</strong> Rabi (1944), Bloch & Purcell (1952), Ernst (1991, FT/2D NMR), Pople (1998, ab initio ekranlash), Wüthrich (2002, protein NMR), Lauterbur & Mansfield (2003, MRI).
              </p>
            </div>

            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-200">
                <strong className="text-red-300">️ XAVFSIZLIK:</strong> Kuchli magnit maydoni (5–14 T) — ferromagnit predmetlar (soat, telefon, kredit karta) 5-gauss chizig'idan tashqarida! Pace-maker va tibbiy implantatli shaxslar taqiqlanadi. Deyterlangan erituvchilar (CDCl₃ — 2B karsinogen, benzol-d₆ — 1A karsinogen) — MSDS ni o'qing!
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
              aria-label="Modalni yopish"
            >
              Tushundim — nazariy bazaga o'tish
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-[var(--v3-chiziq)] sticky top-0 z-40 bg-[var(--v3-fon-2)]/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300"> Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <span className="text-green-400 font-semibold">YaMR spektroskopiya</span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
                  <span className="text-3xl"></span>
                  YaMR spektroskopiya
                </h1>
                <p className="text-purple-400 text-sm mt-1">Yadro magnit rezonansi • Zeeman → Larmor → Ramsey • Kimyoviy siljish • Dinamik jarayonlar</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">¹H, ¹³C, ³¹P, ¹⁹F</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">¹⁹⁵Pt, ⁵⁹Co, ¹⁰³Rh</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">2D NMR (COSY/HSQC/HMBC/NOESY)</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">VT-NMR / EXSY / DOSY</span>
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">Evans usuli • Paramagnit NMR</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-xs bg-green-600/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Birikmalar tahlili →
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-green-600 hover:bg-green-500 text-white"
        aria-label="Header ko'rsatish/yashirish"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* HERO */}
        <div className="v3-panel-karta p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">YaMR / NMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Yadro magnit rezonansi</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Kimyoviy siljish nazariyasi</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Dinamik jarayonlar</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit NMR</span>
          </div>

          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            YaMR Spektroskopiya
          </h2>

          <p className="text-purple-300 text-lg mb-4">
            Yadro magnit rezonansi — <span className="text-green-400 italic">&quot;Molekulaning atomma-atom xaritasi&quot;</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-green-400">YaMR (¹H, ¹³C, ³¹P, ¹⁹F, ¹⁵N, ¹⁹⁵Pt, ⁵⁹Co, ¹⁰³Rh, ...)</strong> — koordinatsion kimyoning eng ko'p ma'lumot beruvchi usuli.
            Bir tajriba ichida <strong className="text-green-400">ligandlar identifikatsiyasi</strong>, <strong className="text-green-400">geometriya (sis/trans)</strong>,
            <strong className="text-green-400"> trans-influence darajasi</strong>, <strong className="text-green-400">bog'lanish tipi</strong> (N vs O donor),
            <strong className="text-green-400"> dinamik jarayonlar</strong> va <strong className="text-green-400">oksidlanish darajasi</strong> aniqlanadi.
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            Fizik asosi: <strong>Zeeman effekti</strong> spin darajalarini B₀ maydonida ajratadi, <strong>Larmor prekressiyasi</strong> rezonans chastotasini beradi (ν₀ = γB₀/2π),
            <strong> Ramsey formulasi</strong> ekranlash konstantasini diamagnit va paramagnit hissalarga bo'ladi (σ = σ_dia + σ_para).
            Impuls-FT NMR (Ernst, Nobel 1991) barcha rezonanslarni bir vaqtda o'lchash imkonini beradi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center border border-[var(--v3-chiziq)]">
              <div className="text-purple-400 text-xs mb-1">Kimyoviy siljish</div>
              <div className="text-white font-bold">δ (ppm)</div>
              <div className="text-[10px] text-purple-400 mt-1">Ramsey: σ_dia + σ_para</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center border border-[var(--v3-chiziq)]">
              <div className="text-purple-400 text-xs mb-1">Skalyar bog'lanish</div>
              <div className="text-white font-bold">J (Hz)</div>
              <div className="text-[10px] text-purple-400 mt-1">Karplus: ³J(θ)</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center border border-[var(--v3-chiziq)]">
              <div className="text-purple-400 text-xs mb-1">Relaksatsiya</div>
              <div className="text-white font-bold">T₁, T₂ (s)</div>
              <div className="text-[10px] text-purple-400 mt-1">Bloch, SBM</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center border border-[var(--v3-chiziq)]">
              <div className="text-purple-400 text-xs mb-1">Metall zondi</div>
              <div className="text-white font-bold">¹⁹⁵Pt, ⁵⁹Co</div>
              <div className="text-[10px] text-purple-400 mt-1">Δ = 15 000+ ppm</div>
            </div>
          </div>
        </div>

        {/* BIRIKMALAR KARTASI */}
        <Link
          href="/ilmiy/tahlil/nmr/birikmalar"
          className="group block bg-gradient-to-r from-green-900/40 to-purple-900/40 border border-green-700/50 rounded-2xl p-6 hover:bg-green-900/60 hover:border-green-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300"></div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                Birikmalarning YaMR tahlili — Katalog
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                12 ta model kompleks: linkage izomerizm ([Co(NH₃)₅(NO₂/ONO)]²⁺), diamagnit sisplatin/transplatin, paramagnit [Fe(acac)₃], xelat [Co(en)₃]³⁺ va boshqalar. Har biri ωB97XD hisoblari, DSC, photo-salient effekt bilan.
              </p>
            </div>
            <div className="text-3xl text-green-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">¹H, ¹³C, ¹⁵N, ¹⁹⁵Pt, ⁵⁹Co</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Linkage izomerizm</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Photo-salient effekt</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">ωB97XD hisoblari</span>
          </div>
        </Link>

        {/* NAZARIY ASOSLAR */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📚 Nazariy asoslar — Zeeman dan Ramseygacha</h2>
          <p className="text-purple-300 text-sm">
            YaMR spektroskopiyasining fizik-matematik poydevori. Har bir bo'lim asosiy tenglamalar, formulalar va tarixiy manbalar bilan.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {THEORY_SECTIONS.map((sec, i) => (
              <button
                key={i}
                onClick={() => setActiveTheory(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTheory === i
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-300 border border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}
              >
                {sec.icon} {sec.title}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <h3 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">{THEORY_SECTIONS[activeTheory].icon}</span>
              {THEORY_SECTIONS[activeTheory].title}
            </h3>
            <div className="text-purple-200 text-sm leading-relaxed whitespace-pre-line mb-4">
              {THEORY_SECTIONS[activeTheory].content}
            </div>
            <div className="p-4 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] mb-3 border border-green-500/30">
              <div className="text-green-400 text-xs font-bold mb-2">🔑 Asosiy tenglama:</div>
              <div className="text-white font-mono text-sm">{THEORY_SECTIONS[activeTheory].formula}</div>
            </div>
            <div className="text-[11px] text-purple-400 italic">
              📖 Manba: {THEORY_SECTIONS[activeTheory].source}
            </div>
          </div>
        </div>

        {/* INTERAKTIV LARMOR CHASTOTASI KALKULYATORI */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">🧮 Interaktiv Larmor chastotasi kalkulyatori</h2>
          <p className="text-purple-300 text-sm">
            Magnit maydonini (B₀) o'zgartiring — turli yadrolar uchun rezonans chastotasi (MHz) real vaqtda hisoblanadi:
            <span className="text-green-400 font-mono ml-2">ν₀ = (γ / 2π) · B₀</span>
          </p>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <label className="block text-green-400 font-bold mb-2">
              Magnit maydoni B₀ = {b0Slider} T   ({(b0Slider * 42.577).toFixed(1)} MHz — ¹H shkalasida)
            </label>
            <input
              type="range"
              min="1.4"
              max="28.2"
              step="0.1"
              value={b0Slider}
              onChange={(e) => setB0Slider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Magnit maydoni B₀"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>1.4 T (60 MHz)</span>
              <span>9.4 T (400 MHz)</span>
              <span>14.1 T (600 MHz)</span>
              <span>28.2 T (1200 MHz)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(larmorFreqs).map(([nuc, freq]) => (
              <div key={nuc} className="p-4 rounded-lg bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] text-center">
                <div className="text-green-400 text-xs mb-1">{nuc.replace(/(\d+)/, "$1 → ")}</div>
                <div className="text-2xl font-mono font-bold text-white">{freq}</div>
                <div className="text-[10px] text-purple-400 mt-1">MHz</div>
              </div>
            ))}
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-xs text-purple-200">
              <strong className="text-green-400"> Fizik ma'no:</strong> γ (giromagnit nisbat) yadroga xos konstanta.
              Yuqori γ → yuqori chastota va sezgirlik. ¹H eng yuqori γ ga ega (267.522 × 10⁶ rad/T·s), shu sabab NMR shkalasi ¹H chastotasi bilan tavsiflanadi
              (masalan, &quot;400 MHz spektrometr&quot;). Manfiy γ (¹⁵N, ²⁹Si, ¹⁰³Rh, ¹⁰⁹Ag, ¹¹⁹Sn) — 180° impulsda spin qaramaqarshi tomonga o'tadi (NOE effekti belgisi ham teskari).
            </p>
          </div>
        </div>

        {/* YADROLAR MA'LUMOTLARI */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white"> YaMR-faol yadrolar — koordinatsion kimyoning periodik jadvali</h2>
          <p className="text-purple-300 text-sm">
            {NUCLEI_DATA.length} ta muhim yadro: I=1/2 (tor signallar) va kvadrupol (I &gt; 1/2, keng signallar). Sezgirlik = γ³ · N · I(I+1) formulasi bo'yicha (¹H = 1.0 referens).
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {NUCLEI_DATA.map((nuc, i) => (
              <button
                key={i}
                onClick={() => setActiveNucleus(i)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeNucleus === i
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-300 border border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}
              >
                {nuc.symbol}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-green-400 font-bold text-lg">
                {NUCLEI_DATA[activeNucleus].symbol} — {NUCLEI_DATA[activeNucleus].name}
              </h3>
              <span className="text-xs text-purple-400">I = {NUCLEI_DATA[activeNucleus].spin}</span>
            </div>
            <p className="text-purple-200 text-sm mb-4 leading-relaxed">{NUCLEI_DATA[activeNucleus].description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Spin (I)</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].spin}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">γ (10⁶ rad/T·s)</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].gamma}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">ν₀ at 9.4 T (MHz)</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].frequency}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Tabiiy tarqalish (%)</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].abundance}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Nisbiy sezgirlik (¹H=1)</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].sensitivity}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1">Retseptivlik (¹H=1)</div>
                <div className="text-white font-bold">{NUCLEI_DATA[activeNucleus].receptivity}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 col-span-2">
                <div className="text-purple-400 text-xs mb-1">δ diapazoni</div>
                <div className="text-white font-bold text-sm">{NUCLEI_DATA[activeNucleus].range}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 col-span-2 md:col-span-2">
                <div className="text-purple-400 text-xs mb-1">Referens standart</div>
                <div className="text-white font-bold text-sm">{NUCLEI_DATA[activeNucleus].reference}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 col-span-2 md:col-span-2">
                <div className="text-purple-400 text-xs mb-1">Tipik siljishlar</div>
                <div className="text-white font-bold text-xs leading-relaxed">{NUCLEI_DATA[activeNucleus].typicalShifts}</div>
              </div>
            </div>
          </div>
        </div>

        {/* KIMYOVIY SILJISHLAR JADVALI */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white"> Kimyoviy siljishlar ma'lumotlar bazasi ({CHEMICAL_SHIFTS.length} yozuv)</h2>
          <p className="text-purple-300 text-sm">
            Koordinatsion kimyoning eng muhim δ va J qiymatlari. Yadro bo'yicha filtrlash mumkin.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {uniqueNuclei.map((nuc, i) => (
              <button
                key={i}
                onClick={() => setSelectedFilter(nuc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFilter === nuc
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-300 border border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}
              >
                {nuc}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-3 text-purple-300">Kompleks</th>
                  <th className="py-3 px-3 text-purple-300">Yadro</th>
                  <th className="py-3 px-3 text-purple-300">Ligand</th>
                  <th className="py-3 px-3 text-purple-300">δ (ppm)</th>
                  <th className="py-3 px-3 text-purple-300">Multipletlik</th>
                  <th className="py-3 px-3 text-purple-300">J (Hz)</th>
                  <th className="py-3 px-3 text-purple-300">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {filteredShifts.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-mono text-green-400">{r.complex}</td>
                    <td className="py-2 px-3">{r.nucleus}</td>
                    <td className="py-2 px-3">{r.ligand}</td>
                    <td className="py-2 px-3 text-yellow-400 font-bold">{r.shift}</td>
                    <td className="py-2 px-3">{r.multiplicity}</td>
                    <td className="py-2 px-3 font-mono">{r.J}</td>
                    <td className="py-2 px-3 text-[10px] text-purple-300">{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRANS-INFLUENCE */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white"> Trans-influence seriyasi — ¹J(¹⁹⁵Pt–³¹P) orqali o'lchash</h2>
          <p className="text-purple-300 text-sm">
            Trans-influence — ligand L ning trans-partneri M–L' bog'ini bo'shashtirish qobiliyati.
            ¹J(¹⁹⁵Pt–³¹P) konstantasi trans-holatdagi ligandga qattiq bog'liq:
            <span className="text-green-400 font-mono ml-2">L trans-influence ↑  ⟹  ¹J(Pt–P) ↓</span>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Trans-ligand L</th>
                  <th className="py-3 px-4 text-purple-300">¹J(¹⁹⁵Pt–³¹P) trans-L (Hz)</th>
                  <th className="py-3 px-4 text-purple-300">Xarakteristika</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {TRANS_INFLUENCE.map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono font-bold text-green-400">{row.ligand}</td>
                    <td className="py-3 px-4 text-yellow-400 font-mono">{row.pt_p}</td>
                    <td className="py-3 px-4 text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-xs text-purple-200">
              <strong className="text-green-400">📚 Nazariy asos:</strong> Trans-influence — Pt–L bog'ining trans-partnerdagi ta'sirining <em>statik</em> (termodinamik, ground-state) ko'rsatkichi.
              Kuchli σ-donor (H⁻, CH₃⁻, aril) trans-holatdagi Pt–P bog'ini bo'shashtiradi va s-orbital orqali J-bog'lanishni pasaytiradi.
              Trans-effekt esa <em>kinetik</em> tushuncha — reaksiya tezligiga bog'liq (Chatt, Duncanson, 1955). Ular korrelyatsion, lekin bir xil emas.
            </p>
          </div>
        </div>

        {/* INTERAKTIV SPEKTR */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">📈 Interaktiv YaMR spektr — ligand tipini aniqlash</h2>
          <p className="text-purple-200 leading-relaxed">
            Kimyoviy siljish δ ni o'zgartiring va ligandning kimyoviy muhitini kuzating. Bu simulyatsiya faqat ta'lim maqsadida;
            haqiqiy spektrda multipletlik, integrallar va boshqa signallar mavjud.
          </p>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] mb-6">
            <label className="block text-green-400 font-bold mb-2">
              ¹H kimyoviy siljish δ = {shiftSlider.toFixed(1)} ppm
            </label>
            <input
              type="range"
              min="-25"
              max="15"
              step="0.1"
              value={shiftSlider}
              onChange={(e) => setShiftSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Kimyoviy siljishni o'zgartirish"
            />
            <div className="flex justify-between text-[10px] text-purple-400 mt-1">
              <span>−25 (M–H gidrid)</span>
              <span>−5</span>
              <span>0 (TMS)</span>
              <span>5</span>
              <span>10</span>
              <span>15 (COOH)</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">δ (ppm):</div>
                <div className="text-2xl font-mono font-bold text-green-400">{shiftSlider.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Ligand tipi:</div>
                <div className="text-lg font-bold text-green-400">
                  {shiftSlider < -5 ? "Metall gidrid (M–H)" :
                   shiftSlider < 0 ? "O'ta ekranlangan" :
                   shiftSlider < 2 ? "Alifatik C–H" :
                   shiftSlider < 4 ? "M–NH₃ (koord.)" :
                   shiftSlider < 6 ? "Vinil / OCH₃" :
                   shiftSlider < 8 ? "Aromatik C–H" :
                   shiftSlider < 10 ? "Aldegid / Deshildlangan" :
                   "Kislota (COOH)"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Elektron muhit:</div>
                <div className="text-sm font-bold text-green-400 leading-tight">
                  {shiftSlider < -5 ? "Katta σ_dia (elektron zichlik yuqori)" :
                   shiftSlider < 2 ? "sp³ C, σ-elektronlar" :
                   shiftSlider < 4 ? "N-donor, koord. TMδ" :
                   shiftSlider < 8 ? "π-tizim, ring current" :
                   "Elektronegativ atom + H-bog'"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-[var(--v3-chiziq)] relative h-80">
            <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" role="img" aria-label="YaMR spektr">
              <title>YaMR spektr simulyatsiyasi</title>
              {[-25, -20, -15, -10, -5, 0, 5, 10, 15].map((ppm, i) => {
                const x = 580 - ((ppm + 25) / 40) * 530
                return (
                  <g key={i}>
                    <line x1={x} y1="220" x2={x} y2="20" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={x} y="235" textAnchor="middle" fontSize="8" fill="#a78bfa">{ppm}</text>
                  </g>
                )
              })}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Kimyoviy siljish δ (ppm) — chapga o'sadi (deshildlanish)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Intensivlik</text>

              {/* Foydalanuvchi tanlagan signal */}
              <line
                x1={580 - ((shiftSlider + 25) / 40) * 530}
                y1="220"
                x2={580 - ((shiftSlider + 25) / 40) * 530}
                y2="40"
                stroke="#22c55e"
                strokeWidth="2.5"
              />
              <text x={580 - ((shiftSlider + 25) / 40) * 530} y="35" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">
                {shiftSlider.toFixed(1)} ppm
              </text>

              {/* TMS referens */}
              <line x1={580 - (25/40)*530} y1="220" x2={580 - (25/40)*530} y2="180" stroke="#fbbf24" strokeWidth="2" />
              <text x={580 - (25/40)*530} y="175" textAnchor="middle" fontSize="8" fill="#fbbf24">TMS (0 ppm)</text>

              {/* Diapazon markerlari */}
              <rect x={580 - ((15 + 25)/40)*530} y="220" width={((15-8)/40)*530} height="6" fill="#ef4444" opacity="0.3" />
              <text x={580 - ((11.5 + 25)/40)*530} y="215" textAnchor="middle" fontSize="7" fill="#ef4444">Kislota</text>

              <rect x={580 - ((8 + 25)/40)*530} y="220" width={((8-6)/40)*530} height="6" fill="#f59e0b" opacity="0.3" />
              <text x={580 - ((7 + 25)/40)*530} y="215" textAnchor="middle" fontSize="7" fill="#f59e0b">Aromatik</text>

              <rect x={580 - ((4 + 25)/40)*530} y="220" width={((4-2)/40)*530} height="6" fill="#22c55e" opacity="0.3" />
              <text x={580 - ((3 + 25)/40)*530} y="215" textAnchor="middle" fontSize="7" fill="#22c55e">M–NH₃</text>

              <rect x={580 - ((2 + 25)/40)*530} y="220" width={((2-(-1))/40)*530} height="6" fill="#3b82f6" opacity="0.3" />
              <text x={580 - ((0.5 + 25)/40)*530} y="215" textAnchor="middle" fontSize="7" fill="#3b82f6">Alifatik</text>

              <rect x={580 - ((-5 + 25)/40)*530} y="220" width={((-5-(-25))/40)*530} height="6" fill="#a855f7" opacity="0.3" />
              <text x={580 - ((-15 + 25)/40)*530} y="215" textAnchor="middle" fontSize="7" fill="#a855f7">M–H gidrid</text>
            </svg>
          </div>
        </div>

        {/* DINAMIK JARAYONLAR */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">⏱️ Dinamik jarayonlar va NMR vaqt shkalasi</h2>
          <p className="text-purple-300 text-sm">
            NMR spektroskopiyasi 10⁻⁶ dan 10⁹ s⁻¹ gacha bo'lgan tezliklarni ko'ra oladi. Signal shakli sekin/oraliq/tez almashinuv rejimlariga qarab o'zgaradi.
            Koalessansiya haroratida <span className="text-green-400 font-mono">k_c = π·Δν/√2 ≈ 2.22·Δν</span>, Eyring tenglamasi orqali ΔG‡ topiladi.
          </p>

          <div className="space-y-4">
            {DYNAMIC_PROCESSES.map((proc, i) => (
              <div key={i} className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <h3 className="text-green-400 font-bold mb-2">{i+1}. {proc.name}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="bg-purple-900/50 rounded-lg p-3">
                    <div className="text-purple-400 text-xs">⏱ Vaqt shkalasi</div>
                    <div className="text-white font-bold font-mono">{proc.timescale}</div>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-3">
                    <div className="text-purple-400 text-xs"> O'lchash usuli</div>
                    <div className="text-white font-bold text-xs">{proc.method}</div>
                  </div>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-3">
                  <div className="text-green-400 font-bold text-xs mb-2">📌 Klassik misollar:</div>
                  <ul className="text-purple-200 text-xs space-y-1">
                    {proc.examples.map((ex, j) => (
                      <li key={j}>• {ex}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                  <div className="text-yellow-400 font-bold text-xs mb-2">📚 Nazariy izoh:</div>
                  <p className="text-purple-200 text-xs leading-relaxed whitespace-pre-line">{proc.theory}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARAMAGNIT EFFEKTLAR */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white"> Paramagnit NMR — juftlashmagan elektronlar ta'siri</h2>
          <p className="text-purple-300 text-sm">
            Ochiq qobiqli komplekslarda (Fe²⁺/³⁺ HS, Co²⁺, Ni²⁺, Cu²⁺, Ln³⁺) juftlashmagan elektronlar YaMR signalini ±1000 ppm gacha siljitadi va kengaytiradi.
            Bertini I. va boshqalar (2001) tomonidan yaratilgan "Paramagnit NMR" bugungi kunda oqsillar, MOF va katalizatorlarni o'rganishning muhim vositasi.
          </p>

          <div className="space-y-4">
            {PARAMAGNETIC_EFFECTS.map((effect, i) => (
              <div key={i} className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <h3 className="text-green-400 font-bold mb-2">{effect.name}</h3>
                <p className="text-purple-200 text-sm mb-3 leading-relaxed">{effect.description}</p>
                <div className="bg-purple-950/60 rounded-lg p-3 mb-3 border border-green-500/30">
                  <div className="text-green-400 text-xs font-bold mb-1"> Formula:</div>
                  <div className="text-white font-mono text-xs">{effect.formula}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="bg-purple-900/50 rounded-lg p-3">
                    <div className="text-purple-400 text-xs">Diapazon</div>
                    <div className="text-white font-bold text-xs">{effect.range}</div>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-3">
                    <div className="text-purple-400 text-xs">Masofa bog'liqligi</div>
                    <div className="text-white font-bold text-xs">{effect.distance}</div>
                  </div>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <div className="text-green-400 font-bold text-xs mb-2">Misollar:</div>
                  <ul className="text-purple-200 text-xs space-y-1">
                    {effect.examples.map((ex, j) => (
                      <li key={j}>• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AMALIY QO'LLANMALAR */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white"> Amaliy qo'llanmalar — koordinatsion kimyoning YaMR masalalari</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {APPLICATIONS.map((app, i) => (
              <button
                key={i}
                onClick={() => setActiveApplication(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeApplication === i
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-300 border border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}
              >
                {app.icon} {app.title}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <h3 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">{APPLICATIONS[activeApplication].icon}</span>
              {APPLICATIONS[activeApplication].title}
            </h3>
            <div className="grid gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400 text-xs mb-1"> Uslub:</div>
                <div className="text-white text-sm">{APPLICATIONS[activeApplication].method}</div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                <div className="text-green-400 text-xs font-bold mb-1">📌 Klassik misol:</div>
                <div className="text-purple-200 text-sm leading-relaxed">{APPLICATIONS[activeApplication].example}</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-bold mb-1">📚 Fizik-kimyoviy tamoyil:</div>
                <div className="text-purple-200 text-sm leading-relaxed whitespace-pre-line">{APPLICATIONS[activeApplication].principle}</div>
              </div>
            </div>
          </div>
        </div>

        {/* LABORATORIYA TARTIBI */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white"> Laboratoriya tartibi — nazariy asos bilan (10 bosqich)</h2>
          <p className="text-purple-300 text-sm">
            Namunani tayyorlashdan xulosaga qadar to'liq protokol. Har bir bosqichda amaliy va nazariy komponentlar.
          </p>

          <div className="space-y-3">
            {LAB_PROCEDURE.map((step, i) => (
              <div key={i} className={`rounded-xl p-5 cursor-pointer transition-all ${
                activeLabStep === i ? "bg-green-900/40 border-2 border-green-400" : "bg-purple-800/30 border border-[var(--v3-chiziq)] hover:border-green-500/50"
              }`}
              onClick={() => setActiveLabStep(i)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeLabStep === i ? "bg-green-500 text-white" : "bg-purple-800 text-purple-400"
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-green-400 font-bold">{step.title}</p>
                  </div>
                  <div className="text-[10px] text-purple-400">⏱ {step.time}</div>
                </div>
                {activeLabStep === i && (
                  <div className="mt-3 pt-3 border-t border-[var(--v3-chiziq)]">
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">{step.desc}</p>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <div className="text-green-400 font-bold text-xs mb-1">📚 Nazariy asos:</div>
                      <p className="text-purple-200 text-xs leading-relaxed">{step.theoryNote}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HALAQIT BERUVCHI OMILLAR */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">️ Halaqit beruvchi omillar va ularni bartaraf etish</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-3 text-purple-300">Manba</th>
                  <th className="py-3 px-3 text-purple-300">Ta'siri</th>
                  <th className="py-3 px-3 text-purple-300">Jiddiylik</th>
                  <th className="py-3 px-3 text-purple-300">Yechim</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {INTERFERENCES.map((intf, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveInterference(i)}
                    className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${
                      activeInterference === i ? 'bg-green-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-xs">{intf.source}</td>
                    <td className="py-3 px-3 text-xs">{intf.effect}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded text-[10px] whitespace-nowrap ${
                        intf.severity.includes('Yuqori') ? 'bg-red-600/30 text-red-400' :
                        intf.severity.includes("O'rta") ? 'bg-yellow-600/30 text-yellow-400' :
                        'bg-green-600/30 text-green-400'
                      }`}>
                        {intf.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs">{intf.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📚</span> Tanlangan omilning nazariy izohi:
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              {INTERFERENCES[activeInterference].theoryNote}
            </p>
          </div>
        </div>

        {/* KENGAYTIRUVCHI METODLAR */}
        <div className="v3-panel-karta p-8 space-y-6">
          <h2 className="text-xl font-bold text-white"> Kengaytirilgan NMR metodlari — 1D dan DNP gacha ({ADVANCED_TECHNIQUES.length} metod)</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {ADVANCED_TECHNIQUES.map((tech, i) => (
              <button
                key={i}
                onClick={() => setActiveTechnique(i)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTechnique === i
                    ? "bg-green-600/60 text-white border border-green-400/50"
                    : "bg-purple-800/30 text-purple-300 border border-[var(--v3-chiziq)] hover:bg-purple-700/40"
                }`}
              >
                {tech.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
            <h3 className="text-green-400 font-bold mb-3">{ADVANCED_TECHNIQUES[activeTechnique].name}</h3>
            <p className="text-purple-200 text-sm mb-4 leading-relaxed">{ADVANCED_TECHNIQUES[activeTechnique].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-400 font-bold mb-2">✓ Afzalliklar</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {ADVANCED_TECHNIQUES[activeTechnique].advantages.map((adv, i) => (
                    <li key={i}>• {adv}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Kamchiliklar</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {ADVANCED_TECHNIQUES[activeTechnique].disadvantages.map((dis, i) => (
                    <li key={i}>• {dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3 mb-3">
              <div className="text-purple-400 text-xs mb-1"> Eng yaxshi qo'llanish:</div>
              <div className="text-white text-sm">{ADVANCED_TECHNIQUES[activeTechnique].bestFor}</div>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div className="text-green-400 font-bold text-xs mb-1">📌 Amaliy misollar:</div>
              <p className="text-purple-200 text-xs leading-relaxed">{ADVANCED_TECHNIQUES[activeTechnique].examples}</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4"> Asosiy xulosalar</h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li><strong className="text-green-400">Fizik asosi:</strong> Zeeman effekti → Larmor prekressiyasi (ν₀ = γB₀/2π) → Ramsey ekranlashi (σ = σ_dia + σ_para)</li>
            <li><strong className="text-green-400">Sezgirlik:</strong> S ∝ γ³·B₀²·N·I(I+1). ¹H eng sezgir, ¹⁰³Rh eng past. DNP 10⁴× oshirishi mumkin.</li>
            <li><strong className="text-green-400">Kimyoviy siljish (δ):</strong> ligandning elektron muhitini beradi. Metallar uchun (⁵⁹Co, ¹⁹⁵Pt) diapazon 15 000+ ppm.</li>
            <li><strong className="text-green-400">J-bog'lanish:</strong> Karplus ³J(θ) = A cos²θ + B cosθ + C — konformatsion tahlil uchun. ¹J(¹⁹⁵Pt–³¹P) — trans-influence indeksi.</li>
            <li><strong className="text-green-400">Sis / trans:</strong> ¹⁹⁵Pt NMR + ¹J(Pt–L) qiymatlari — cisplatin/transplatin oltin standarti.</li>
            <li><strong className="text-green-400">Linkage izomerizm:</strong> ¹⁵N NMR nitro/nitrito, N-tsianid/S-tsianid orasidagi Δδ &gt; 100 ppm.</li>
            <li><strong className="text-green-400">Paramagnit NMR:</strong> Fermi-contact (Curie 1/T) + pseudocontact (McConnell–Robertson (3cos²θ−1)/r³). Evans usuli — μeff.</li>
            <li><strong className="text-green-400">Dinamik jarayonlar:</strong> koalessansiya — k_c = π·Δν/√2; Eyring — ΔG‡, ΔH‡, ΔS‡ termodinamikasi.</li>
            <li><strong className="text-green-400">2D NMR arsenali:</strong> COSY (J-network), NOESY (r &lt; 5 Å), HSQC (¹J), HMBC (nJ), DOSY (o'lcham), EXSY (kinetika).</li>
            <li><strong className="text-green-400">Zamonaviy trend:</strong> DNP, para-H₂ hyperpolarization, ultra-yuqori maydon (1.2 GHz), quantum-enhanced NMR.</li>
          </ol>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-3 pt-6">
          <Link href="/ilmiy/tahlil/raman" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">← Raman spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold text-center">Birikmalar katalogi →</Link>
          <Link href="/ilmiy/tahlil/epr" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold text-center">EPR spektroskopiya →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500 space-y-1">
          <p>© 2026 jdakimyo.uz — Koordinatsion kimyo tahlil portali • YaMR spektroskopiya moduli v2.0</p>
          <p>Manbalar: Bloch & Purcell (Nobel 1952) • Ernst (Nobel 1991) • Wüthrich (Nobel 2002) • Ramsey (Nobel 1989) • Pople (Nobel 1998)</p>
          <p className="italic">Adabiyot: Abragam A. (1961); Bertini I. (2001); Levitt M.H. &quot;Spin Dynamics&quot; (2008); Keeler J. &quot;Understanding NMR&quot; (2010); Pregosin P.S. &quot;NMR in Organometallic Chemistry&quot; (2012)</p>
        </div>
      </footer>
    </div>
  )
}
