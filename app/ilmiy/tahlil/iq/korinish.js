"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// IQ SPEKTROSKOPIYA — ASOSIY NAZARIY SAHIFA (PREMIUM SCIENTIFIC)
// Manbalar:
//   • K. Nakamoto — Infrared and Raman Spectra of Inorganic and Coordination Compounds (Part A & B, 6th ed.)
//   • F. A. Cotton — Chemical Applications of Group Theory (3rd ed.)
//   • G. Herzberg — Molecular Spectra and Molecular Structure (Vol. II)
//   • P. Atkins — Physical Chemistry (Molecular Spectroscopy bo'limi)
//   • E. B. Wilson, J. C. Decius, P. C. Cross — Molecular Vibrations
//   • Housecroft & Sharpe — Inorganic Chemistry (4th ed.)
// Xususiyat: Kvant nazariyasi, guruh nazariyasi, tanlash qoidalari, kuch konstantasi,
//            izotopik almashinuv, ambidentat/geometrik izomerlar, FT-IR/ATR/DRIFTS
// Til: 100% o'zbek (lotin)
// ═══════════════════════════════════════════════════════════════════════════════

const IQ_DATA = {
  // ─── Elektromagnit spektrda IQ ning o'rni
  emRegions: [
    { name: "Yaqin IQ (NIR)", range: "12500–4000", wavelength: "0.8–2.5 mkm", energy: "1.55–0.50 eV", note: "Yuqori tebranish oberton, C–H, O–H, N–H kombinatsiyalari" },
    { name: "O'rta IQ (MIR)", range: "4000–400", wavelength: "2.5–25 mkm", energy: "0.50–0.05 eV", note: "Asosiy tebranishlar — funksional guruhlar va molekula «barmoq izi»" },
    { name: "Uzoq IQ (FIR)", range: "400–10", wavelength: "25–1000 mkm", energy: "50–1.2 meV", note: "Metall–ligand tebranishlari, panjara tebranishlari, torsion" },
  ],

  // ─── Tebranish turlari (normal modalar)
  vibrationTypes: [
    { symbol: "ν", uz: "Cho'zilish (stretching)", desc: "Bog' uzunligining davriy o'zgarishi", sub: [
      { name: "νₛ — simmetrik", desc: "Ikki bog' bir vaqtda cho'ziladi/qisqaradi", example: "H₂O: νₛ(O–H) = 3657 cm⁻¹" },
      { name: "νₐₛ — asimmetrik", desc: "Bir bog' cho'zilganda, ikkinchi qisqaradi", example: "H₂O: νₐₛ(O–H) = 3756 cm⁻¹" },
    ]},
    { symbol: "δ", uz: "Egilish (bending, deformation)", desc: "Bog'lar orasidagi burchakning o'zgarishi", sub: [
      { name: "δ — qaychili (scissoring)", desc: "Ikki bog' bir tekislikda yaqinlashadi/uzoqlashadi", example: "H₂O: δ(H–O–H) = 1595 cm⁻¹" },
      { name: "ρ — chayqalish (rocking)", desc: "Bog'lar bir tomonga birga siljiydi", example: "–CH₂– guruhida 720 cm⁻¹" },
    ]},
    { symbol: "ω", uz: "Silkinish (wagging)", desc: "Atomlar tekislikdan chiqib tebranadi (tekislikka nisbatan simmetrik)", sub: [
      { name: "ω — wag", desc: "Ikki atom bir vaqtda tekislikdan chiqadi", example: "–CH₂– guruhida 1300 cm⁻¹" },
    ]},
    { symbol: "τ", uz: "Buralish (twisting)", desc: "Atomlar tekislikdan chiqib qarama-qarshi tebranadi", sub: [
      { name: "τ — twist", desc: "Bir atom yuqoriga, ikkinchisi pastga", example: "–CH₂– guruhida 1250 cm⁻¹" },
    ]},
    { symbol: "γ", uz: "Tekislikdan tashqari egilish (out-of-plane)", desc: "Atom tekislikka perpendikulyar chiqadi", sub: [
      { name: "γ(C–H)", desc: "Aromatik halqadagi C–H tebranishi", example: "Benzol: 675 cm⁻¹" },
    ]},
  ],

  // ─── Kuch konstantasi va chastota (Hooke qonuni)
  forceConstants: [
    { bond: "C–C (yagona)", k: 4.5, freq: "~1000", note: "Yumshoq bog'" },
    { bond: "C=C (qo'sh)", k: 9.6, freq: "~1650", note: "Kuchliroq" },
    { bond: "C≡C (uch)", k: 15.6, freq: "~2200", note: "Eng qattiq C–C" },
    { bond: "C–H", k: 5.0, freq: "~3000", note: "Yengil H tufayli yuqori" },
    { bond: "O–H", k: 7.7, freq: "~3600", note: "Vodorod bog'lanish ta'sirlanadi" },
    { bond: "N–H", k: 6.3, freq: "~3400", note: "Ammin komplekslar" },
    { bond: "C≡N (erkin)", k: 17.7, freq: "~2100", note: "Nakamoto" },
    { bond: "C≡O (erkin)", k: 18.6, freq: "~2143", note: "Erkin CO molekulasi" },
    { bond: "M–N (Co(III))", k: 2.2, freq: "~500", note: "Metall og'ir → past ν" },
    { bond: "M–Cl (Pt(II))", k: 1.9, freq: "~320", note: "Og'ir metall, og'ir ligand" },
  ],

  // ─── Metall-ligand tebranish chastotalari
  metalLigandVibrations: [
    { complex: "[Co(NH₃)₆]³⁺", bond: "ν(Co–N)", freq: "500–450", type: "Oh, T₁ᵤ, IQ faol", color: "text-blue-400" },
    { complex: "[Co(NH₃)₅Cl]²⁺", bond: "ν(Co–N)", freq: "490–470", type: "C₄ᵥ, A₁+E, IQ faol", color: "text-blue-400" },
    { complex: "[Co(NH₃)₅Cl]²⁺", bond: "ν(Co–Cl)", freq: "330–310", type: "C₄ᵥ, A₁, IQ faol", color: "text-orange-400" },
    { complex: "[Fe(CN)₆]³⁻", bond: "ν(Fe–C)", freq: "510", type: "Oh, T₁ᵤ", color: "text-blue-400" },
    { complex: "[Fe(CN)₆]³⁻", bond: "ν(C≡N)", freq: "2135", type: "π-akseptor kuchli", color: "text-blue-400" },
    { complex: "[Fe(CN)₆]⁴⁻", bond: "ν(Fe–C)", freq: "490", type: "d⁶ past spin", color: "text-blue-400" },
    { complex: "[Fe(CN)₆]⁴⁻", bond: "ν(C≡N)", freq: "2044", type: "π-back-donation kuchli", color: "text-blue-400" },
    { complex: "[Ni(CO)₄]", bond: "ν(Ni–C)", freq: "422", type: "Td, T₂, IQ faol", color: "text-blue-400" },
    { complex: "[Ni(CO)₄]", bond: "ν(C≡O)", freq: "2057", type: "Td, T₂ (A₁ Raman)", color: "text-blue-400" },
    { complex: "[Cr(H₂O)₆]³⁺", bond: "ν(Cr–O)", freq: "490", type: "Oh, T₁ᵤ", color: "text-blue-400" },
    { complex: "[Cu(NH₃)₄]²⁺", bond: "ν(Cu–N)", freq: "450–420", type: "D₄ₕ, Eᵤ", color: "text-orange-400" },
    { complex: "[PtCl₄]²⁻", bond: "ν(Pt–Cl)", freq: "330–320", type: "D₄ₕ, Eᵤ", color: "text-orange-400" },
    { complex: "[Fe(acac)₃]", bond: "ν(Fe–O)", freq: "560–530", type: "D₃, xelat halqa", color: "text-orange-400" },
    { complex: "[Cu(salen)]", bond: "ν(Cu–N)", freq: "450", type: "Schiff asos", color: "text-orange-400" },
    { complex: "[Cu(salen)]", bond: "ν(Cu–O)", freq: "420", type: "Fenolat kislorod", color: "text-orange-400" },
    { complex: "[Zn(phen)₃]²⁺", bond: "ν(Zn–N)", freq: "420–380", type: "D₃, aromatik", color: "text-orange-400" },
  ],

  // ─── Ambidentat ligandlar
  ambidentateLigands: [
    {
      name: "NO₂⁻ (Nitro/Nitrito)",
      hsab: "Chegara ligand — qattiq/yumshoq",
      bonded: [
        { type: "Nitro (M–NO₂, N orqali)", formula: "M–NO₂", freq_as: "1430–1360", freq_s: "1340–1310", color: "text-green-400", example: "[Co(NH₃)₅NO₂]²⁺ (sariq)", note: "νₐₛ va νₛ oralig'i ~100 cm⁻¹" },
        { type: "Nitrito (M–ONO, O orqali)", formula: "M–ONO", freq_as: "1485–1400", freq_s: "1110–1050", color: "text-red-400", example: "[Co(NH₃)₅ONO]²⁺ (qizil)", note: "ν(N=O) va ν(N–O) → oralig'i ~350 cm⁻¹" },
      ],
      diagnostic: "Farq: nitro shaklda ikki polosa yaqin, nitrito shaklda uzoq (350 cm⁻¹ farq)",
      isomerism: "Linkage izomerizm — Jorgensen (1894) tomonidan kashf etilgan"
    },
    {
      name: "SCN⁻ (Tio-/Izotio-siano)",
      hsab: "Ambidentat — HSAB nazariyasiga bo'ysunadi",
      bonded: [
        { type: "Tiosianato (M–SCN, S orqali)", formula: "M–SCN", freq_cn: "2120–2080", freq_cs: "720–690", freq_bend: "420–400", color: "text-green-400", example: "[Pd(SCN)₄]²⁻ (yumshoq Pd²⁺)", note: "ν(C–S) yuqoriroq (~700), δ(NCS) past" },
        { type: "Izotiosianato (M–NCS, N orqali)", formula: "M–NCS", freq_cn: "2100–2040", freq_cs: "860–780", freq_bend: "490–450", color: "text-blue-400", example: "[Cr(NCS)₆]³⁻ (qattiq Cr³⁺)", note: "ν(C–S) pastroq (~800), δ(NCS) yuqori" },
      ],
      diagnostic: "Asosiy farq: ν(C–S) polosasi. M–SCN < 720 cm⁻¹, M–NCS > 780 cm⁻¹",
      isomerism: "HSAB: yumshoq (Pd, Pt, Hg) → S; qattiq (Cr, Fe, Al) → N"
    },
    {
      name: "CN⁻ (Siano/Izosiano)",
      hsab: "Kuchli π-akseptor, ko'pincha C orqali",
      bonded: [
        { type: "Siano (M–CN, C orqali)", formula: "M–CN", freq_cn: "2200–2050", freq_cn2: "π-back-donation borligida past", color: "text-green-400", example: "[Fe(CN)₆]⁴⁻ (2044), K₃[Fe(CN)₆] (2135)", note: "Oksidlanish darajasi ↑ → ν(CN) ↑" },
        { type: "Izosiano (M–NC, N orqali)", formula: "M–NC", freq_cn: "2180–2100", freq_cn2: "N-orqali kamdan-kam uchraydi", color: "text-blue-400", example: "[(Ph₃P)₂Pt(NC)₂]", note: "N–bog'langan CN yuqoriroq chastotada" },
      ],
      diagnostic: "M–CN chastotasi π-back-donation kuchiga bog'liq (Cotton-Kraihanzel modeli)",
      isomerism: "Preysian-Cheselka ma'lumotlari asosida"
    },
  ],

  // ─── Sis-trans izomerlar (guruh nazariyasi bilan)
  cisTransIsomers: [
    {
      name: "[Pt(NH₃)₂Cl₂] — Sisplatin",
      isomers: [
        { type: "sis-[Pt(NH₃)₂Cl₂]", color: "text-blue-400", symmetry: "C₂ᵥ", vibModes: "2A₁ + B₁ + B₂ — barchasi IQ faol", 
          freq_MN: "510, 495 cm⁻¹ (νₐₛ + νₛ, 2 polosa)", 
          freq_MCl: "330, 315 cm⁻¹ (νₐₛ + νₛ, 2 polosa)",
          diagnostic: "IQ da 4 ta cho'qqi (2 ta M–N + 2 ta M–Cl)" },
        { type: "trans-[Pt(NH₃)₂Cl₂]", color: "text-orange-400", symmetry: "D₂ₕ", vibModes: "Aₘ (Raman) + B₃ᵤ (IQ)", 
          freq_MN: "500 cm⁻¹ (faqat 1 ta νₐₛ IQ faol)", 
          freq_MCl: "320 cm⁻¹ (faqat 1 ta νₐₛ IQ faol)",
          diagnostic: "IQ da 2 ta cho'qqi (νₛ IQ noaktiv, faqat Ramanda)" },
      ],
      groupTheory: "sis: C₂ᵥ dan barcha tebranishlar aktiv. trans: D₂ₕ da simmetrik cho'zilishlar (g-simmetriya) faqat Ramanda ko'rinadi (mutual exclusion qoidasi).",
      biologicalNote: "Sis-izomer (sisplatin) — DNK ga bog'lanadi, saraton davolash uchun. Trans-izomer biologik faol emas."
    },
    {
      name: "[Co(en)₂Cl₂]⁺",
      isomers: [
        { type: "sis-[Co(en)₂Cl₂]⁺ (binafsha)", color: "text-blue-400", symmetry: "C₂", vibModes: "Barcha modalar IQ+Raman faol", 
          freq_MN: "550, 500, 480 cm⁻¹ (3 ta)", 
          freq_MCl: "355, 310 cm⁻¹ (2 ta)",
          diagnostic: "Ko'p cho'qqi (past simmetriya)" },
        { type: "trans-[Co(en)₂Cl₂]⁺ (yashil)", color: "text-orange-400", symmetry: "C₂ₕ", vibModes: "gerade modalar faqat Raman", 
          freq_MN: "540, 495 cm⁻¹ (2 ta)", 
          freq_MCl: "365 cm⁻¹ (1 ta νₐₛ)",
          diagnostic: "Kam cho'qqi (yuqori simmetriya)" },
      ],
      groupTheory: "Trans-izomerda C₂ₕ simmetriyasidan gerade (g) tebranishlar mutual exclusion qoidasi bo'yicha IQ da ko'rinmaydi.",
      biologicalNote: "Rang farqi: sis (Δ/Λ enantiomer, binafsha), trans (yashil) — CD spektroskopiya bilan tasdiqlanadi."
    },
    {
      name: "[M(CO)₄L₂] tipidagi karbonillar",
      isomers: [
        { type: "sis-[M(CO)₄L₂]", color: "text-blue-400", symmetry: "C₂ᵥ", vibModes: "2A₁ + B₁ + B₂ — 4 ta IQ faol", 
          freq_MN: "—", 
          freq_MCl: "ν(C≡O): 4 ta polosa (2050, 1990, 1980, 1940 cm⁻¹)",
          diagnostic: "4 ta ν(CO) polosasi — sis izomerni tasdiqlaydi" },
        { type: "trans-[M(CO)₄L₂]", color: "text-orange-400", symmetry: "D₄ₕ", vibModes: "A₁g + B₁g + Eᵤ; faqat Eᵤ IQ faol", 
          freq_MN: "—", 
          freq_MCl: "ν(C≡O): 1 ta polosa (~1990 cm⁻¹)",
          diagnostic: "1 ta ν(CO) polosasi — trans izomerni tasdiqlaydi" },
      ],
      groupTheory: "Cotton-Kraihanzel usuli: ν(CO) sonini hisoblab, geometriya aniqlanadi. fac-[M(CO)₃L₃] (C₃ᵥ) → 2A₁+E, 2 polosa; mer-[M(CO)₃L₃] (C₂ᵥ) → 2A₁+B₁, 3 polosa.",
      biologicalNote: "Metall karbonil kimyoda IQ eng informativ usul — ν(CO) polosalari soni geometriyani bir aniqlaydi."
    },
  ],

  // ─── Funksional guruhlar (kengaytirilgan)
  functionalGroups: [
    { group: "ν(O–H)", freq: "3650–3200", type: "Keng, kuchli", example: "Suv, gidroksid, akvakomplekslar", note: "H-bog'lanish chastotani pasaytiradi" },
    { group: "ν(N–H)", freq: "3500–3100", type: "O'rta, ko'p polosa", example: "Ammin, amid, amino kislotalar", note: "NH₃ — 2 polosa (νₐₛ+νₛ); NH₂ — 2 polosa; NH — 1 polosa" },
    { group: "ν(C–H) alifatik", freq: "3000–2800", type: "O'rta", example: "Alkil ligandlar (Me, Et)", note: "2960 (νₐₛCH₃), 2870 (νₛCH₃), 2925 (νₐₛCH₂)" },
    { group: "ν(C–H) aromatik", freq: "3100–3000", type: "O'rta", example: "phen, bpy, py komplekslar", note: "Alifatikdan yuqoriroq (sp² gibrid)" },
    { group: "ν(C≡N) nitril", freq: "2260–2200", type: "O'rta-kuchli", example: "Erkin RC≡N, koordinatsion RC≡N–M", note: "Koordinatsiya chastotani ~30–50 cm⁻¹ oshiradi" },
    { group: "ν(C≡N) siano", freq: "2200–2050", type: "Kuchli", example: "[Fe(CN)₆]⁴⁻, [Ag(CN)₂]⁻", note: "Oksidlanish darajasi ↑ → ν ↑" },
    { group: "ν(C≡O) karbonil", freq: "2150–1800", type: "Juda kuchli", example: "[Ni(CO)₄], [Fe(CO)₅], [Mn₂(CO)₁₀]", note: "Terminal 2100–2000, ko'prikli 1900–1750" },
    { group: "ν(N=O) nitrozil", freq: "1900–1500", type: "Kuchli", example: "[Fe(NO)(CN)₅]²⁻ (Nitroprussid)", note: "Bukilgan (~1500) yoki chiziqli (~1800) M–N–O" },
    { group: "ν(C=O) ester/karboksilat", freq: "1750–1550", type: "Kuchli", example: "[Fe(acac)₃], asetat komplekslar", note: "Xelat halqada ~1580" },
    { group: "ν(C=N) imin", freq: "1690–1580", type: "O'rta", example: "Schiff asoslar, salen, salphen", note: "Koordinatsiya chastotani ~20 cm⁻¹ pasaytiradi" },
    { group: "νₐₛ(NO₃⁻)", freq: "1500–1250", type: "Splitting", example: "Erkin — 1 polosa; koordinatsion — 2 polosa", note: "Bidentat NO₃ — Δν ~200 cm⁻¹" },
    { group: "νₐₛ(SO₄²⁻)", freq: "1130–1080", type: "Splitting", example: "Erkin — Td simmetriya, 1 polosa; koordinatsion — 2–3 polosa", note: "Monodentat 1050+970, bidentat 1200+1100+1050" },
    { group: "ν(M–N)", freq: "600–350", type: "O'rta", example: "Ammin, amin, py, phen komplekslar", note: "3d metallar 500–400, 4d/5d 400–350" },
    { group: "ν(M–O)", freq: "650–300", type: "O'rta", example: "Akvakomplekslar, oksokomplekslar", note: "Terminal M=O ~950–1000 (yuqori)" },
    { group: "ν(M–Cl)", freq: "400–200", type: "O'rta-kuchli", example: "Xlorokomplekslar", note: "Terminal 350–300, ko'prikli 250–200" },
    { group: "ν(M–Br)", freq: "300–170", type: "O'rta", example: "Bromokomplekslar", note: "Cl dan pastroq (og'ir Br)" },
    { group: "ν(M–I)", freq: "250–140", type: "O'rta", example: "Yodokomplekslar", note: "Uzoq IQ da o'lchanadi" },
  ],

  // ─── Nakamoto ma'lumotnomasi (klassik komplekslar)
  nakamotoReference: [
    { region: "4000–2500", assignment: "X–H cho'zilish", details: "N–H, O–H, C–H — vodorod ishtirokidagi bog'lar" },
    { region: "2500–2000", assignment: "Uch bog'li cho'zilishlar", details: "C≡N, C≡O, N≡N, C≡C — kichik yaqin polosa" },
    { region: "2000–1500", assignment: "Ikki bog'li cho'zilishlar", details: "C=O, C=N, C=C, N=O — «karbonil» zonasi" },
    { region: "1500–1300", assignment: "Egilish + oksianion", details: "δ(C–H), NO₂⁻, NO₃⁻, ClO₄⁻ oksianionlari" },
    { region: "1300–900", assignment: "Yagona bog' cho'zilish", details: "C–C, C–O, C–N, S=O, P=O; oksianion νₛ" },
    { region: "900–600", assignment: "Aromatik CH out-of-plane", details: "γ(C–H) — o'rin bosuvchilar sonini aniqlaydi" },
    { region: "600–400", assignment: "M–N, M–O cho'zilish", details: "Ammin, akvakomplekslarning asosiy diagnostik sohasi" },
    { region: "400–200", assignment: "M–Cl, M–Br, M–S", details: "Og'ir ligandlar bilan bog'lar" },
    { region: "200–10", assignment: "M–I, panjara, torsion", details: "Faqat uzoq IQ (FT-FIR) da o'lchanadi" },
  ],

  // ─── FT-IR va namuna tayyorlash usullari
  samplingMethods: [
    { name: "KBr tabletka (Pellet)", pros: "Klassik, arzon, keng qo'llaniladi", cons: "KBr gigroskopik, suvli namuna uchun yaramaydi", freq: "4000–400 cm⁻¹", best: "Qattiq organik va koordinatsion komplekslar" },
    { name: "Nujol mull", pros: "Suvsiz, oson tayyorlash", cons: "Nujol o'zi C–H sohasida cho'qqi beradi (2900, 1460, 1380)", freq: "4000–400 cm⁻¹", best: "Suvga sezgir, gigroskopik namunalar" },
    { name: "CsI tabletka", pros: "400 cm⁻¹ dan pastroqda ham shaffof", cons: "Qimmat, gigroskopik", freq: "4000–200 cm⁻¹", best: "M–L past chastotali tebranishlarni ko'rish" },
    { name: "ATR (Attenuated Total Reflectance)", pros: "Namuna tayyorlash oson, suyuqlik/gel/kukun", cons: "Sirt ta'siri, past chastotada susayadi", freq: "4000–650 cm⁻¹", best: "Zamonaviy ekspress-tahlil, kutubxona qidiruvi" },
    { name: "DRIFTS (Diffuz aks etish)", pros: "Kukun namuna to'g'ridan-to'g'ri", cons: "Kubelka-Munk konversiya kerak", freq: "4000–400 cm⁻¹", best: "Katalizator, sirt turlari" },
    { name: "Nafis plyonka (Thin film)", pros: "Suyuq namuna, film osongina hosil qilinadi", cons: "Plyonka qalinligini nazorat qilish qiyin", freq: "4000–400 cm⁻¹", best: "Yog', suyuq organik, polimer" },
    { name: "Gaz kyuvetasi", pros: "Molekulyar rotatsion-tebranish spektri (P, Q, R shoxlar)", cons: "Uzun optik yo'l kerak (10 sm)", freq: "4000–400 cm⁻¹", best: "CO, N₂O, gazsimon komplekslar" },
  ],

  // ─── Guruh nazariyasi va tanlash qoidalari
  selectionRules: [
    { rule: "IQ faol tebranish sharti", math: "(∂μ/∂Q)₀ ≠ 0", uz: "Tebranish davomida dipol moment o'zgarishi zarur" },
    { rule: "Raman faol tebranish sharti", math: "(∂α/∂Q)₀ ≠ 0", uz: "Tebranish davomida qutblanuvchanlik (α) o'zgarishi zarur" },
    { rule: "Mutual exclusion qoidasi", math: "i (inversiya markazi) bor bo'lsa", uz: "gerade (g) tebranishlar faqat Raman, ungerade (u) faqat IQ da faol" },
    { rule: "Kvant tanlash qoidasi", math: "Δv = ±1 (asosiy)", uz: "Δv = ±2, ±3 — obertonlar (kuchsizroq)" },
    { rule: "Tebranishlar soni", math: "3N − 6 (chiziqsiz), 3N − 5 (chiziqli)", uz: "N — atomlar soni; H₂O: 3×3−6 = 3 tebranish; CO₂: 3×3−5 = 4 tebranish" },
  ],

  // ─── Kompleks izomerlar geometriya turlari
  geometryModes: [
    { geom: "Oktaedr Oh [ML₆]", modes: "2A₁g + Eg + 2T₁ᵤ + T₂g + T₂ᵤ", irActive: "2 T₁ᵤ (νₐₛ M–L + δ M–L–M)", ramanActive: "A₁g + Eg + T₂g", note: "Yuqori simmetriya — kam IQ polosa" },
    { geom: "Tetraedr Td [ML₄]", modes: "A₁ + E + 2T₂", irActive: "2 T₂ (ν va δ)", ramanActive: "A₁ + E + 2T₂", note: "Barcha 4 modasi Raman faol" },
    { geom: "Kvadrat tekislik D₄ₕ [ML₄]", modes: "A₁g + B₁g + B₂g + A₂ᵤ + Eᵤ", irActive: "A₂ᵤ + Eᵤ (2 ta)", ramanActive: "A₁g + B₁g + B₂g", note: "Mutual exclusion (i markaz)" },
    { geom: "sis-[ML₄X₂] C₂ᵥ", modes: "3A₁ + A₂ + 2B₁ + 2B₂ (M–L uchun)", irActive: "A₁ + B₁ + B₂ (barchasi)", ramanActive: "Barchasi", note: "Ko'p polosa (past simmetriya)" },
    { geom: "trans-[ML₄X₂] D₄ₕ", modes: "A₁g + Eg + A₂ᵤ + Eᵤ", irActive: "A₂ᵤ + Eᵤ (2 ta)", ramanActive: "A₁g + Eg", note: "Simmetriya yuqori — kam polosa" },
    { geom: "fac-[ML₃X₃] C₃ᵥ", modes: "2A₁ + 2E", irActive: "2 A₁ + 2 E (barchasi)", ramanActive: "Barchasi", note: "ν(CO): 2 polosa" },
    { geom: "mer-[ML₃X₃] C₂ᵥ", modes: "2A₁ + B₁ + B₂ (M–X)", irActive: "3 ta (2A₁ + B₁)", ramanActive: "Barchasi", note: "ν(CO): 3 polosa (fac dan farqli)" },
  ],

  // ─── Muhim izotopik almashishlar (kuch konstantasini tasdiqlash)
  isotopeShifts: [
    { bond: "N–H → N–D", nuFactor: "√(μH/μD) ≈ 1.374", shift: "3400 → 2475 cm⁻¹", use: "N–H tayinlashlarni tasdiqlash" },
    { bond: "O–H → O–D", nuFactor: "≈ 1.374", shift: "3600 → 2620 cm⁻¹", use: "Akvakomplekslar" },
    { bond: "¹²C≡O → ¹³C≡O", nuFactor: "√(μ₁₂/μ₁₃) ≈ 1.023", shift: "2057 → 2010 cm⁻¹", use: "CO tebranishini tasdiqlash" },
    { bond: "⁵⁸Ni → ⁶²Ni", nuFactor: "≈ 1.017", shift: "422 → 415 cm⁻¹", use: "M–L tayinlashlarni tasdiqlash" },
    { bond: "³⁵Cl → ³⁷Cl", nuFactor: "≈ 1.028", shift: "330 → 321 cm⁻¹", use: "M–Cl bog'ini tasdiqlash" },
  ],
}

export default function IQSpektroskopiya() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [activeAmbidentate, setActiveAmbidentate] = useState(0)
  const [activeCisTrans, setActiveCisTrans] = useState(0)
  const [activeFunctionalGroup, setActiveFunctionalGroup] = useState(0)
  const [activeVibType, setActiveVibType] = useState(0)
  const [activeGeom, setActiveGeom] = useState(0)
  const [activeSampling, setActiveSampling] = useState(0)
  const [freqSlider, setFreqSlider] = useState(2000)

  const currentZone = useMemo(() => {
    const f = freqSlider
    if (f >= 3200) return { name: "X–H cho'zilish sohasi", bond: "O–H, N–H, C–H", color: "text-cyan-400", desc: "Yengil vodorod atomi tufayli chastota eng yuqori. Vodorod bog'lanish O–H ni pasaytiradi va kengaytiradi." }
    if (f >= 2500) return { name: "Uch bog' zonasi", bond: "C≡N, C≡O, N≡N, C≡C", color: "text-blue-400", desc: "Karbonil (2050), sianid (2100), nitril (2250) polosalari — π-back-donation diagnostikasi." }
    if (f >= 1500) return { name: "Ikki bog' zonasi", bond: "C=O, C=N, C=C, N=O", color: "text-yellow-400", desc: "Schiff asoslar (C=N ~1620), asetilasetonat (C=O ~1580), nitrozil (~1600–1800)." }
    if (f >= 1000) return { name: "Barmoq izi sohasi", bond: "C–C, C–O, C–N, oksianion", color: "text-purple-400", desc: "NO₃⁻ splitting, SO₄²⁻ ionlari koordinatsiyasi. Molekula «barmoq izi» — birinchi identifikatsiya." }
    if (f >= 600) return { name: "M–L asosiy sohasi", bond: "ν(M–N), ν(M–O)", color: "text-green-400", desc: "Metall-ligand cho'zilishlarining eng informativ sohasi. Ammin va akva komplekslar diagnostikasi." }
    if (f >= 300) return { name: "M–Cl / M–S zonasi", bond: "ν(M–Cl), ν(M–S)", color: "text-orange-400", desc: "Halogenokomplekslar (PtCl₄²⁻, CoCl₄²⁻) — sis/trans ajratish uchun asosiy." }
    return { name: "Uzoq IQ zonasi", bond: "ν(M–Br), ν(M–I), panjara", color: "text-red-400", desc: "Faqat FT-FIR ni talab qiladi. Kristall panjara tebranishlari, torsion modalar." }
  }, [freqSlider])

  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">

      {/* ═══════════════ OGOHLANTIRISH MODALI ═══════════════ */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-blue-950 to-purple-950 border-2 border-blue-500 rounded-2xl p-6 max-w-3xl w-full">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="text-3xl"></span> IQ SPEKTROSKOPIYA — TEBRANISH KVANT MEXANIKASI
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-blue-300">Infraqizil spektroskopiya</strong> — molekulaning tebranish holatlari orasidagi
              kvantlangan energiya o'tishlarini o'lchaydi. Bu koordinatsion kimyoda <strong className="text-yellow-300">metall–ligand
              bog'lanishini, ligand denticity va geometriyani</strong> aniqlashning eng asosiy usuli.
            </p>

            <div className="p-4 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-blue-400 font-bold mb-2"> Fizik asos</div>
                  <div className="text-purple-200">Kvantlangan tebranish energiyasi: E<sub>v</sub> = ℏω(v+½)</div>
                  <div className="text-purple-200 mt-1">Δv = ±1 asosiy o'tish, foton yutiladi</div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold mb-2"> Tanlash qoidasi</div>
                  <div className="text-purple-200">IQ faol: (∂μ/∂Q)₀ ≠ 0 — dipol moment o'zgarishi</div>
                  <div className="text-purple-200 mt-1">3N−6 normal moda (chiziqsiz molekula)</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-200">
                <strong> Diqqat:</strong> M–L tebranishlari 600–200 cm⁻¹ oralig'ida — bu <em>uzoq IQ</em> (FT-FIR) sohasi.
                Oddiy KBr tabletkada 400 cm⁻¹ dan past yo'qoladi — <strong>CsI</strong> yoki <strong>polietilen</strong> derazasi kerak.
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — sahifani ochish
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="border-b border-[var(--v3-chiziq)] sticky top-0 z-40 bg-[var(--v3-fon-2)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs mb-1.5 text-[var(--v3-xira)] flex-wrap">
              <Link href="/ilmiy" className="hover:text-[var(--v3-matn)]">Ilmiy Bo{"'"}lim</Link>
              <span>›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-[var(--v3-matn)]">Tahlil usullari</Link>
              <span>›</span>
              <span className="text-[var(--v3-urgu)] font-semibold">IQ (FT-IR) Spektroskopiya</span>
            </nav>

            <h1 className="text-xl md:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="grafik" olcham={22} className="text-[var(--v3-urgu)]" />
              <span>IQ (Infraqizil / FT-IR) Spektroskopiyasi</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ilmiy/tahlil/iq/birikmalar"
              className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold flex items-center gap-1.5"
            >
              <span>Birikmalar Bazasini Ko{"'"}rish</span>
              <Ikon nom="ong" olcham={13} />
            </Link>
            <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════ 0. BIRIKMALAR KARTASI ═══════════════ */}
        <Link
          href="/ilmiy/tahlil/iq/birikmalar"
          className="group block bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-[var(--v3-chiziq)] rounded-2xl p-6 hover:bg-blue-900/60 hover:border-blue-500/60 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300"></div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                Birikmalarning IQ tahlili — 20 ta kompleks
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Werner klassik komplekslaridan tortib metall karbonillar va Schiff asoslarigacha. Har biri uchun
                simulyatsiyalangan spektr, cho'qqilar jadvali, simmetriya tahlili va guruh nazariyasi.
              </p>
            </div>
            <div className="text-3xl text-blue-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">20 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Cho'qqi jadvali</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Simmetriya tahlili</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Nakamoto ma'lumotlari</span>
          </div>
        </Link>

        {/* ═══════════════ 1. NAZARIY ASOS — KVANT MEXANIKASI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">📚</span> 1. Nazariy asos — molekulyar tebranishlarning kvant mexanikasi
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Manba: P. Atkins — Physical Chemistry, G. Herzberg — Molecular Spectra Vol. II</p>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">IQ (Infraqizil) spektroskopiya</strong> — molekulaning tebranish darajalari
              orasidagi <strong className="text-yellow-400">kvantlangan energiya o'tishlarini</strong> o'lchashga asoslangan
              spektroskopik usul. Molekulaga IQ diapazondagi (4000–400 cm⁻¹) elektromagnit nurlanish yuborilganda,
              foton energiyasi tebranish darajalari orasidagi <em>ΔE</em> farqiga to'g'ri kelsa, molekula fotonni yutadi
              va yuqori tebranish holatiga o'tadi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Garmonik osillator */}
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-blue-300 font-bold mb-3"> Garmonik osillator modeli</h3>
              <p className="text-purple-200 text-sm mb-3">
                Ikki atomli molekulani <strong>ideal prujina</strong> bilan bog'langan ikki massa deb tasavvur qilamiz.
                Hooke qonuni: <em>F = −kx</em>.
              </p>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs text-cyan-300 mb-3">
                <div>Klassik chastota:</div>
                <div className="text-yellow-300 my-2 text-sm">ν̃ = (1/2πc) · √(k/μ)</div>
                <div className="text-purple-300 text-[11px]">bu yerda:</div>
                <div>• k — bog' kuch konstantasi (N/m)</div>
                <div>• μ — keltirilgan massa: μ = m₁m₂/(m₁+m₂)</div>
                <div>• c — yorug'lik tezligi</div>
              </div>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs text-cyan-300">
                <div>Kvantlangan energiya:</div>
                <div className="text-yellow-300 my-2 text-sm">E<sub>v</sub> = ℏω(v + ½)</div>
                <div className="text-purple-300 text-[11px]">v = 0, 1, 2, 3, ... — tebranish kvant soni</div>
              </div>
            </div>

            {/* Anharmonik effekti */}
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-blue-300 font-bold mb-3">🌀 Anharmonik osillator (Morse potensiali)</h3>
              <p className="text-purple-200 text-sm mb-3">
                Real molekulalarda bog' uzunligi kattalashganda parchalanish sodir bo'ladi.
                <strong> Morse funksiyasi</strong> haqiqiy potensial energiyani yaxshiroq tasvirlaydi:
              </p>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs text-cyan-300 mb-3">
                <div>Morse potensiali:</div>
                <div className="text-yellow-300 my-2 text-sm">V(r) = D<sub>e</sub>[1 − exp(−a(r−r<sub>e</sub>))]²</div>
                <div className="text-purple-300 text-[11px]">D<sub>e</sub> — dissotsiatsiya energiyasi</div>
              </div>
              <div className="bg-purple-950/60 rounded-lg p-3 font-mono text-xs text-cyan-300">
                <div>Anharmonik energiya:</div>
                <div className="text-yellow-300 my-2 text-sm">E<sub>v</sub> = ℏω(v+½) − ℏωx<sub>e</sub>(v+½)²</div>
                <div className="text-purple-300 text-[11px]">x<sub>e</sub> — anharmonizm konstantasi (~0.01–0.05)</div>
              </div>
              <p className="text-yellow-300 text-[11px] mt-3 italic">
                Natija: obertonlar (Δv = 2, 3) ham kuzatiladi, lekin kuchsizroq.
              </p>
            </div>
          </div>

          {/* To'lqin soni tushunchasi */}
          <div className="bg-yellow-900/10 border border-yellow-700/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-2">📏 To'lqin soni (wavenumber) — nima uchun cm⁻¹?</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              IQ spektrida chastota o'rniga <strong>to'lqin soni</strong> ν̃ = 1/λ (birligi <strong>cm⁻¹</strong>) ishlatiladi,
              chunki u energiyaga to'g'ri proporsional: <em>E = hcν̃</em>. Masalan, 1000 cm⁻¹ = 12.4 kJ/mol,
              bu tebranish energiyasining tabiiy tartibida. Bu <strong>Kayser (K)</strong> birligi ham deb ataladi.
            </p>
          </div>
        </div>

        {/* ═══════════════ 2. ELEKTROMAGNIT SPEKTRDA IQ ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 2. IQ ning elektromagnit spektrdagi o'rni
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">IQ = ko'rinadigan qizil (700 nm) va mikroto'lqinlar orasida</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Soha</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Chastota (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">To'lqin uzunligi</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Energiya</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Qanday hodisalar?</th>
                </tr>
              </thead>
              <tbody className="text-purple-200 text-sm">
                {IQ_DATA.emRegions.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-400">{r.name}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{r.range}</td>
                    <td className="py-3 px-4 font-mono">{r.wavelength}</td>
                    <td className="py-3 px-4 font-mono text-cyan-300">{r.energy}</td>
                    <td className="py-3 px-4 text-xs">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-blue-900/20 border border-[var(--v3-chiziq)] rounded-xl p-4">
            <p className="text-purple-200 text-sm">
              <strong className="text-blue-300">Koordinatsion kimyo uchun eng muhim soha:</strong> O'rta IQ (4000–400 cm⁻¹) —
              funksional guruh identifikatsiyasi va Uzoq IQ (400–100 cm⁻¹) — <em>metall–ligand</em> tebranishlari.
              Zamonaviy FT-IR asboblari 4000–100 cm⁻¹ oralig'ini birdaniga skanlaydi.
            </p>
          </div>
        </div>

        {/* ═══════════════ 3. TEBRANISHLAR TURLARI (NORMAL MODALAR) ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🎼</span> 3. Molekulyar tebranishlar turlari — normal modalar
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">3N−6 (yoki chiziqli molekulada 3N−5) ta mustaqil tebranish mavjud</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {IQ_DATA.vibrationTypes.map((v, i) => (
              <button
                key={i}
                onClick={() => setActiveVibType(i)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  activeVibType === i
                    ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20"
                    : "bg-purple-950/40 border-[var(--v3-chiziq)] hover:border-blue-500/50"
                }`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-yellow-400 font-mono">{v.symbol}</span>
                  <span className="text-blue-300 text-sm font-semibold">{v.uz}</span>
                </div>
                <p className="text-purple-300 text-xs">{v.desc}</p>
              </button>
            ))}
          </div>

          {IQ_DATA.vibrationTypes.map((v, i) => activeVibType === i && (
            <div key={i} className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-mono text-yellow-400 font-bold">{v.symbol}</span>
                <div>
                  <h3 className="text-blue-300 font-bold">{v.uz}</h3>
                  <p className="text-purple-300 text-xs">{v.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {v.sub.map((s, j) => (
                  <div key={j} className="bg-purple-950/50 rounded-lg p-4">
                    <p className="text-green-400 font-mono text-sm mb-1">{s.name}</p>
                    <p className="text-purple-200 text-xs mb-2">{s.desc}</p>
                    <p className="text-yellow-300 text-xs italic">📍 {s.example}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Muhim izoh */}
          <div className="mt-4 bg-green-900/10 border border-green-700/30 rounded-xl p-4">
            <p className="text-purple-200 text-sm">
              <strong className="text-green-300">Normal modalar (Wilson, Decius, Cross):</strong> Har bir mustaqil
              tebranish — barcha atomlar bir vaqtda, bir chastotada, faza jihatidan bir xil harakatlanadi.
              Masalan, H₂O molekulasida 3 ta normal moda: νₛ (3657), νₐₛ (3756), δ(H–O–H) (1595 cm⁻¹).
            </p>
          </div>
        </div>

        {/* ═══════════════ 4. GURUH NAZARIYASI VA TANLASH QOIDALARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🔷</span> 4. Guruh nazariyasi va tanlash qoidalari
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Manba: F. A. Cotton — Chemical Applications of Group Theory</p>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Guruh nazariyasi</strong> — molekula simmetriyasidan uning IQ va Raman
              spektrida qaysi tebranishlar <strong>faol</strong> bo'lishini oldindan aytish imkonini beradi.
              Har bir normal moda molekulaning nuqtaviy guruhida ma'lum bir <strong className="text-yellow-400">simmetriya
              tasviri (irreducible representation)</strong> ga tegishli — masalan A₁, B₁, T₁ᵤ, Eg.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {IQ_DATA.selectionRules.map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-3">
                    <p className="text-blue-300 font-bold text-sm">{r.rule}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-yellow-400 font-mono text-sm bg-purple-950/60 rounded p-2 text-center">{r.math}</p>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-purple-200 text-xs">{r.uz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Geometriya tanlash */}
          <h3 className="text-blue-300 font-bold text-lg mb-3">Kompleks geometriyalar bo'yicha tanlash qoidalari</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {IQ_DATA.geometryModes.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveGeom(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  activeGeom === i
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-purple-950/50 border-[var(--v3-chiziq)] text-purple-400 hover:border-blue-500"
                }`}
              >
                {g.geom}
              </button>
            ))}
          </div>

          {IQ_DATA.geometryModes.map((g, i) => activeGeom === i && (
            <div key={i} className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h4 className="text-yellow-400 font-bold mb-3 font-mono">{g.geom}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-cyan-300 font-bold mb-1 text-xs uppercase">Normal modalar</p>
                  <p className="text-purple-200 font-mono">{g.modes}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-green-400 font-bold mb-1 text-xs uppercase">IQ faol</p>
                  <p className="text-purple-200 font-mono">{g.irActive}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-orange-400 font-bold mb-1 text-xs uppercase">Raman faol</p>
                  <p className="text-purple-200 font-mono">{g.ramanActive}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-bold mb-1 text-xs uppercase">Izoh</p>
                  <p className="text-purple-200 text-xs">{g.note}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 bg-yellow-900/10 border border-yellow-700/30 rounded-xl p-4">
            <p className="text-yellow-200 text-sm">
              <strong> Mutual exclusion qoidasi:</strong> Agar molekulada <em>inversiya markazi</em> (i) bo'lsa
              (masalan D₂ₕ, D₄ₕ, Oh guruhlarida), gerade (g) simmetriya modalari faqat Ramanda,
              ungerade (u) faqat IQ da ko'rinadi. Bu <strong>sis va trans izomerlarni</strong> osongina ajratish uchun
              asos beradi — trans izomer inversiya markaziga ega, sis izomer esa yo'q.
            </p>
          </div>
        </div>

        {/* ═══════════════ 5. KUCH KONSTANTASI VA HOOKE QONUNI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">💪</span> 5. Kuch konstantasi va chastota bog'liqligi
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Hooke qonuni: kuchli va yengil bog' — yuqori chastota</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-blue-300 font-bold mb-2">Kuch konstantasi ↑ → chastota ↑</h3>
              <p className="text-purple-200 text-sm">
                Bog' qanchalik <strong>mustahkam</strong> (k katta) bo'lsa, tebranish chastotasi shuncha yuqori bo'ladi.
                Yagona (C–C) &lt; qo'sh (C=C) &lt; uch bog' (C≡C).
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-blue-300 font-bold mb-2">Massa ↑ → chastota ↓</h3>
              <p className="text-purple-200 text-sm">
                Atomlar <strong>og'irroq</strong> (μ katta) bo'lsa, chastota pastroq. Shuning uchun M–Cl (330) &lt; M–N (500)
                &lt; C–H (3000 cm⁻¹).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Bog'</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">k (mdyn/Å)</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">ν̃ (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200 text-sm">
                {IQ_DATA.forceConstants.map((f, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400">{f.bond}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{f.k}</td>
                    <td className="py-3 px-4 font-mono text-cyan-300">{f.freq}</td>
                    <td className="py-3 px-4 text-xs">{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-cyan-900/10 border border-cyan-700/30 rounded-xl p-4">
            <p className="text-purple-200 text-sm">
              <strong className="text-cyan-300">Cotton–Kraihanzel modeli:</strong> Metall karbonillar (M–CO) uchun
              ν(CO) chastotasi <strong>π-back-donation</strong> kuchini o'lchash uchun ishlatiladi. Metal→π*(CO) elektron
              berilishi kuchli bo'lsa, C≡O bog'i <strong>kuchsizlanadi</strong>, ν(CO) <em>pasayadi</em>.
              Masalan, [Fe(CN)₆]⁴⁻ da ν(CN) = 2044 cm⁻¹ (kuchli back-donation), [Fe(CN)₆]³⁻ da 2135 cm⁻¹.
            </p>
          </div>
        </div>

        {/* ═══════════════ 6. METALL-LIGAND TEBRANISHLARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🔗</span> 6. Metall–ligand tebranish chastotalari
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">
            IQ spektroskopiyaning koordinatsion kimyo uchun eng muhim sohasi (600–200 cm⁻¹)
          </p>

          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Nakamoto</strong> ma'lumotnomasiga ko'ra, metall–ligand cho'zilish
            tebranishlari <strong>600–200 cm⁻¹</strong> oralig'ida. Bu soha <em>uzoq IQ</em> yoki <em>past
            chastotali IQ</em> deb ataladi. Uni o'lchash uchun <strong>CsI derazasi</strong> yoki
            <strong> polietilen plyonka</strong> ishlatiladi (KBr faqat 400 cm⁻¹ gacha shaffof).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Bog' / tebranish</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">ν̃ (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Simmetriya / izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200 text-sm">
                {IQ_DATA.metalLigandVibrations.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400">{r.complex}</td>
                    <td className="py-3 px-4 font-mono">{r.bond}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold font-mono">{r.freq}</td>
                    <td className={`py-3 px-4 text-xs ${r.color}`}>{r.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ 7. NAKAMOTO ZONA JADVALI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">📖</span> 7. Nakamoto zona ma'lumotnomasi — cho'qqilarni tayinlash
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">
            IQ spektrni to'g'ri talqin qilishning asosiy jadvali (Nakamoto, Infrared and Raman Spectra, 6-nashr)
          </p>

          <div className="space-y-2">
            {IQ_DATA.nakamotoReference.map((z, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] hover:border-blue-500/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-2">
                    <p className="text-yellow-400 font-mono font-bold text-lg">{z.region}</p>
                    <p className="text-purple-400 text-[10px]">cm⁻¹</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-blue-300 font-semibold text-sm">{z.assignment}</p>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-purple-200 text-xs">{z.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 8. AMBIDENTAT LIGANDLAR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🔀</span> 8. Ambidentat ligandlarni IQ orqali farqlash
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Linkage izomerizm — bir xil ligand, turli koordinatsion atom</p>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ambidentat ligand</strong> — bir necha koordinatsion atomga ega bo'lgan
              ligand, u metallga turli atom orqali bog'lanishi mumkin. IQ spektroskopiya <strong>bog'lanish shakli</strong>ni
              (linkage izomerizm) aniqlashning eng ishonchli usuli. <strong className="text-yellow-400">HSAB nazariyasi</strong>
              (Pearson): yumshoq metallar yumshoq atom bilan, qattiq metallar qattiq atom bilan bog'lanadi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {IQ_DATA.ambidentateLigands.map((lig, i) => (
              <button
                key={i}
                onClick={() => setActiveAmbidentate(i)}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all border ${
                  activeAmbidentate === i
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-purple-950/50 border-[var(--v3-chiziq)] text-purple-400 hover:border-blue-500"
                }`}
              >
                {lig.name}
              </button>
            ))}
          </div>

          {IQ_DATA.ambidentateLigands.map((lig, i) => activeAmbidentate === i && (
            <div key={i} className="space-y-4">
              <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                  <h3 className="text-yellow-400 font-bold text-lg">{lig.name}</h3>
                  <span className="text-cyan-300 text-xs bg-cyan-900/30 border border-cyan-700/30 px-3 py-1 rounded-full">
                    {lig.hsab}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  {lig.bonded.map((bonded, j) => (
                    <div key={j} className="bg-purple-900/50 rounded-lg p-4 border border-[var(--v3-chiziq)]">
                      <p className={`${bonded.color} font-bold mb-2`}>{bonded.type}</p>
                      <p className="text-purple-200 text-sm mb-1">Formula: <span className="font-mono text-yellow-300">{bonded.formula}</span></p>
                      {bonded.freq_as && <p className="text-purple-200 text-xs">νₐₛ: <span className="font-mono text-cyan-300">{bonded.freq_as} cm⁻¹</span></p>}
                      {bonded.freq_s && <p className="text-purple-200 text-xs">νₛ: <span className="font-mono text-cyan-300">{bonded.freq_s} cm⁻¹</span></p>}
                      {bonded.freq_cn && <p className="text-purple-200 text-xs">ν(C≡N): <span className="font-mono text-cyan-300">{bonded.freq_cn} cm⁻¹</span></p>}
                      {bonded.freq_cs && <p className="text-purple-200 text-xs">ν(C–S): <span className="font-mono text-cyan-300">{bonded.freq_cs} cm⁻¹</span></p>}
                      {bonded.freq_bend && <p className="text-purple-200 text-xs">δ(NCS): <span className="font-mono text-cyan-300">{bonded.freq_bend} cm⁻¹</span></p>}
                      {bonded.freq_cn2 && <p className="text-purple-200 text-xs italic">{bonded.freq_cn2}</p>}
                      <p className="text-purple-300 mt-2 text-[10px] italic">📍 {bonded.example}</p>
                      {bonded.note && <p className="text-yellow-300 mt-1 text-[10px]"> {bonded.note}</p>}
                    </div>
                  ))}
                </div>

                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 mb-2">
                  <p className="text-green-300 text-xs">
                    <strong> Diagnostik:</strong> {lig.diagnostic}
                  </p>
                </div>
                <div className="bg-purple-950/50 border border-[var(--v3-chiziq)] rounded-lg p-3">
                  <p className="text-purple-300 text-xs italic">📚 {lig.isomerism}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════ 9. SIS-TRANS / FAC-MER IZOMERLAR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🔄</span> 9. Geometrik izomerlar — guruh nazariyasi tahlili
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">
            Sis/trans, fac/mer — simmetriya farqi orqali IQ da yaqqol ajratiladi
          </p>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Sis va trans izomerlar <strong>bir xil kimyoviy tarkibga</strong> ega, lekin <strong className="text-yellow-400">simmetriyalari
              tubdan farq qiladi</strong>. Trans izomerda odatda <em>inversiya markazi</em> mavjud, shuning uchun
              <strong> mutual exclusion</strong> qoidasi ishlaydi va IQ da kamroq polosa ko'rinadi.
              Sis izomerda esa inversiya markazi yo'q — barcha tebranishlar IQ faol.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {IQ_DATA.cisTransIsomers.map((iso, i) => (
              <button
                key={i}
                onClick={() => setActiveCisTrans(i)}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all border ${
                  activeCisTrans === i
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-purple-950/50 border-[var(--v3-chiziq)] text-purple-400 hover:border-blue-500"
                }`}
              >
                {iso.name}
              </button>
            ))}
          </div>

          {IQ_DATA.cisTransIsomers.map((isomer, i) => activeCisTrans === i && (
            <div key={i}>
              <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
                <h3 className="text-yellow-400 font-bold text-lg mb-4">{isomer.name}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  {isomer.isomers.map((iso, j) => (
                    <div key={j} className={`bg-purple-900/50 rounded-xl p-4 border ${iso.color === 'text-blue-400' ? 'border-blue-500/40' : 'border-orange-500/40'}`}>
                      <p className={`${iso.color} font-bold mb-2 text-base`}>{iso.type}</p>
                      <div className="space-y-2 text-xs">
                        <div className="bg-purple-950/60 rounded p-2">
                          <span className="text-cyan-300 font-semibold">Simmetriya: </span>
                          <span className="text-yellow-300 font-mono">{iso.symmetry}</span>
                        </div>
                        <div className="bg-purple-950/60 rounded p-2">
                          <span className="text-cyan-300 font-semibold">Modalar: </span>
                          <span className="text-purple-200 font-mono">{iso.vibModes}</span>
                        </div>
                        {iso.freq_MN && iso.freq_MN !== "—" && (
                          <div className="bg-purple-950/60 rounded p-2">
                            <span className="text-cyan-300 font-semibold">ν(M–L): </span>
                            <span className="text-purple-200 font-mono">{iso.freq_MN}</span>
                          </div>
                        )}
                        {iso.freq_MCl && (
                          <div className="bg-purple-950/60 rounded p-2">
                            <span className="text-cyan-300 font-semibold">{isomer.name.includes("CO") ? "ν(CO): " : "ν(M–X): "}</span>
                            <span className="text-purple-200 font-mono">{iso.freq_MCl}</span>
                          </div>
                        )}
                        <div className="bg-green-900/20 border border-green-700/30 rounded p-2">
                          <span className="text-green-300"> </span>
                          <span className="text-purple-200 italic">{iso.diagnostic}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-900/10 border border-yellow-700/30 rounded-lg p-4 mb-2">
                  <p className="text-yellow-200 text-xs">
                    <strong>🧮 Guruh nazariyasi:</strong> {isomer.groupTheory}
                  </p>
                </div>
                <div className="bg-purple-950/50 border border-[var(--v3-chiziq)] rounded-lg p-3">
                  <p className="text-purple-300 text-xs italic">💊 {isomer.biologicalNote}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════ 10. FUNKSIONAL GURUHLAR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 10. Funksional guruhlar chastotalari
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Koordinatsion kimyoda uchraydigan barcha asosiy tebranishlar</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {IQ_DATA.functionalGroups.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveFunctionalGroup(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  activeFunctionalGroup === i
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-purple-950/50 border-[var(--v3-chiziq)] text-purple-400 hover:border-blue-500"
                }`}
              >
                {g.group}
              </button>
            ))}
          </div>

          {IQ_DATA.functionalGroups.map((g, i) => activeFunctionalGroup === i && (
            <div key={i} className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-yellow-400 font-bold text-lg mb-4 font-mono">{g.group}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-cyan-300 font-bold mb-1 text-xs uppercase">Chastota</p>
                  <p className="text-yellow-300 font-mono text-lg">{g.freq} cm⁻¹</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-cyan-300 font-bold mb-1 text-xs uppercase">Polosa turi</p>
                  <p className="text-purple-200">{g.type}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-cyan-300 font-bold mb-1 text-xs uppercase">Misol</p>
                  <p className="text-purple-200 text-xs">{g.example}</p>
                </div>
              </div>
              {g.note && (
                <div className="bg-blue-900/20 border border-[var(--v3-chiziq)] rounded-lg p-3">
                  <p className="text-blue-200 text-xs">
                    <strong> Diagnostika:</strong> {g.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ═══════════════ 11. IZOTOPIK ALMASHISH ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">⚛️</span> 11. Izotopik almashish — tayinlashlarni tasdiqlash
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">
            Kimyoviy o'ziga xoslik saqlanadi, faqat massa o'zgaradi → chastota siljishi Hooke qonuni bilan bashorat qilinadi
          </p>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Izotopik almashish (masalan H→D, ¹²C→¹³C) <strong>kuch konstantasini o'zgartirmaydi</strong>, faqat
              keltirilgan massani <em>μ</em> ni o'zgartiradi. Yangi chastota Hooke qonuni bo'yicha aniq bashorat qilinadi:
            </p>
            <div className="mt-3 bg-purple-950/60 rounded-lg p-3 font-mono text-center text-yellow-300 text-sm">
              ν̃(D) / ν̃(H) = √(μ<sub>H</sub> / μ<sub>D</sub>)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Bog' almashishi</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Nazariy koeffitsient</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Chastota siljishi</th>
                  <th className="py-3 px-4 text-purple-300 text-xs uppercase">Foydalanish</th>
                </tr>
              </thead>
              <tbody className="text-purple-200 text-sm">
                {IQ_DATA.isotopeShifts.map((iz, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400">{iz.bond}</td>
                    <td className="py-3 px-4 font-mono text-cyan-300">{iz.nuFactor}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{iz.shift}</td>
                    <td className="py-3 px-4 text-xs">{iz.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ 12. INTERAKTIV SPEKTR ZONALARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 12. Interaktiv IQ zonasi tanlash
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Slayderni harakatlantiring — chastotaga mos zona va bog' turi ko'rsatiladi</p>

          <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] mb-6">
            <label className="block text-blue-400 font-bold mb-3">
              To'lqin soni: <span className="text-yellow-400 font-mono text-2xl">{freqSlider}</span> cm⁻¹
            </label>
            <input
              type="range"
              min="200"
              max="4000"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>200</span>
              <span>1000</span>
              <span>2000</span>
              <span>3000</span>
              <span>4000</span>
            </div>
          </div>

          <div className={`bg-gradient-to-r from-purple-900/60 to-blue-900/60 rounded-xl p-6 border-2 ${currentZone.color.replace('text-', 'border-')}/50`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400 uppercase font-semibold mb-1">Soha</div>
                <div className={`text-xl font-bold ${currentZone.color}`}>{currentZone.name}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400 uppercase font-semibold mb-1">Xarakterli bog'</div>
                <div className="text-lg text-yellow-300 font-mono">{currentZone.bond}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400 uppercase font-semibold mb-1">To'lqin soni</div>
                <div className="text-xl text-blue-400 font-mono">{freqSlider} cm⁻¹</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--v3-chiziq)]">
              <p className="text-purple-200 text-sm leading-relaxed">{currentZone.desc}</p>
            </div>
          </div>
        </div>

        {/* ═══════════════ 13. NAMUNA TAYYORLASH USULLARI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> 13. Namuna tayyorlash usullari
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Har xil namuna turlari uchun turli texnikalar</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {IQ_DATA.samplingMethods.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveSampling(i)}
                className={`text-left p-3 rounded-lg text-xs font-semibold transition-all border ${
                  activeSampling === i
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-purple-950/50 border-[var(--v3-chiziq)] text-purple-300 hover:border-blue-500"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {IQ_DATA.samplingMethods.map((s, i) => activeSampling === i && (
            <div key={i} className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] space-y-3">
              <h3 className="text-yellow-400 font-bold text-lg">{s.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                  <p className="text-green-400 font-bold text-xs uppercase mb-1">✓ Afzalliklari</p>
                  <p className="text-purple-200 text-xs">{s.pros}</p>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                  <p className="text-red-400 font-bold text-xs uppercase mb-1">✗ Kamchiliklari</p>
                  <p className="text-purple-200 text-xs">{s.cons}</p>
                </div>
                <div className="bg-blue-900/20 border border-[var(--v3-chiziq)] rounded-lg p-3">
                  <p className="text-blue-400 font-bold text-xs uppercase mb-1">Chastota diapazoni</p>
                  <p className="text-yellow-300 font-mono text-sm">{s.freq}</p>
                </div>
                <div className="bg-purple-950/50 border border-[var(--v3-chiziq)] rounded-lg p-3">
                  <p className="text-cyan-300 font-bold text-xs uppercase mb-1">Eng yaxshi qo'llash</p>
                  <p className="text-purple-200 text-xs">{s.best}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════ 14. FT-IR APPARATI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🔧</span> 14. FT-IR spektrometr — ish printsipi
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Zamonaviy IQ spektroskopiya asosidagi Michelson interferometri</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-blue-300 font-bold mb-3"> Asosiy qismlar</h3>
              <ol className="space-y-2 text-xs text-purple-200">
                <li><strong className="text-yellow-300">1. Nurlanish manbai:</strong> Globar (SiC) — IQ chiqaruvchi qizdirilgan tayoq</li>
                <li><strong className="text-yellow-300">2. Michelson interferometri:</strong> beam splitter (KBr/Ge) + statsionar oyna + harakatlanuvchi oyna</li>
                <li><strong className="text-yellow-300">3. Namuna kompartmenti:</strong> ATR kristal (olmos, ZnSe, Ge) yoki KBr deraza</li>
                <li><strong className="text-yellow-300">4. Detektor:</strong> DTGS (piroelektrik) yoki MCT (HgCdTe) sovutilgan detektor</li>
                <li><strong className="text-yellow-300">5. Fourier transformatsiya:</strong> interferogramma → spektr</li>
              </ol>
            </div>
            <div className="p-5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]">
              <h3 className="text-blue-300 font-bold mb-3"> FT-IR ning ustunliklari</h3>
              <ul className="space-y-2 text-xs text-purple-200">
                <li><strong className="text-green-400">Fellgett afzalligi:</strong> barcha chastotalar bir vaqtda o'lchanadi (S/N ↑)</li>
                <li><strong className="text-green-400">Jacquinot afzalligi:</strong> yorug'lik oqimi katta (dispersion asboblarga nisbatan)</li>
                <li><strong className="text-green-400">Connes afzalligi:</strong> lazer bilan chastota o'lchash yuqori aniqlik (±0.01 cm⁻¹)</li>
                <li><strong className="text-green-400">Tez skanlash:</strong> 1 spektr ~1 sekundda (dispersion asboblar: 5 daqiqa)</li>
                <li><strong className="text-green-400">Yuqori aniqlik:</strong> 0.1–0.5 cm⁻¹ (dispersion: 4 cm⁻¹)</li>
              </ul>
            </div>
          </div>

          <div className="bg-cyan-900/10 border border-cyan-700/30 rounded-xl p-4">
            <p className="text-purple-200 text-sm">
              <strong className="text-cyan-300">Fourier transformatsiyasi:</strong> Interferometr harakatlanuvchi oyna
              siljishi bilan <em>interferogramma</em> yozadi — u vaqtga bog'liq signal. Kompyuter Fourier transformatsiyasi
              orqali uni chastota domeniga (spektrga) o'tkazadi:
            </p>
            <div className="mt-2 bg-purple-950/60 rounded p-2 font-mono text-center text-cyan-300 text-sm">
              I(ν̃) = ∫ I(δ) · cos(2πν̃δ) dδ
            </div>
          </div>
        </div>

        {/* ═══════════════ 15. LABORATORIYA TARTIBI ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🥼</span> 15. Laboratoriyada 0 dan spektr olish tartibi
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">Kompleks birikma spektrini olishning bosqichma-bosqich yo'riqnomasi</p>

          <div className="space-y-3">
            {[
              { step: 1, title: "Namunani tayyorlash", desc: "Kompleksni to'liq quritish (P₂O₅ eksikkatorda 24 soat). 1–2 mg namuna oling. KBr (~200 mg) bilan agatli hovonchada 5 daqiqa yaxshilab yanchang (~2 mkm zarra o'lchami). 10 tonna bosim ostida 1 daqiqa tabletka bosing." },
              { step: 2, title: "Asbobni tayyorlash", desc: "FT-IR ni yoqing va 30–60 daqiqa isitish uchun qoldiring (Globar barqarorlashishi). Namuna kompartmentini quruq havo yoki N₂ bilan puflang (H₂O va CO₂ polosalarini bartaraf etish). Sozlamalar: 4000–400 cm⁻¹, aniqlik 4 cm⁻¹, 16–32 skanlar." },
              { step: 3, title: "Fon spektri (background)", desc: "Bo'sh KBr tabletkani joylashtiring va fon spektrini oling. Bu H₂O bug'i (~3500, 1600 cm⁻¹) va CO₂ (~2350 cm⁻¹) polosalarini avtomatik kompensatsiya qiladi." },
              { step: 4, title: "Namuna spektrini olish", desc: "Namuna tabletkasini joylashtiring. Transmissiya (T) yoki yutilish (A = −log T) rejimida spektrni yozing. Signal/shovqin nisbati past bo'lsa, skanlar sonini oshiring (64 → 128 → 256)." },
              { step: 5, title: "Spektrni ishlov berish", desc: "Bazaviy chiziqni tuzatish (baseline correction). CO₂/H₂O polosalarini avtomatik olib tashlash. Cho'qqilarni tanish (peak picking) — dastur avtomatik cho'qqi chastotalarini yozib chiqaradi." },
              { step: 6, title: "Cho'qqilarni tayinlash", desc: "Har bir cho'qqini Nakamoto jadvali bilan solishtiring. Yuqori chastotadan boshlang: N–H (~3300), C–H (~2900), C≡N (~2100), C=O (~1600), oksianion (~1400), M–L (~500). Simmetriyaga qarab modalar sonini tekshiring." },
              { step: 7, title: "Uzoq IQ (agar kerak bo'lsa)", desc: "600–200 cm⁻¹ oralig'ini o'lchash uchun CsI derazasi va polietilen namuna qo'llash kerak. Bu M–Cl, M–Br va boshqa og'ir metall–ligand tebranishlari uchun asosiy." },
              { step: 8, title: "Xulosalar va hisobot", desc: "Har bir cho'qqiga izoh yozing. Ambidentat ligandlar, sis/trans izomerlar, ligand denticity haqida xulosa chiqaring. Cotton–Kraihanzel usulini karbonillar uchun qo'llang. Kutubxona qidiruvi (spectral library search) bilan tasdiqlang." },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] hover:border-blue-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{s.step}</div>
                  <div className="flex-1">
                    <p className="text-blue-300 font-bold text-sm mb-1">{s.title}</p>
                    <p className="text-purple-200 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 16. QIZIQARLI FAKTLAR ═══════════════ */}
        <div className="v3-panel-karta p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-3xl"></span> 16. Qiziqarli va muhim faktlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Werner nazariyasining tasdig'i", text: "1893 yilda Alfred Werner koordinatsion nazariyani taklif qilgan. IQ spektroskopiya 1930-yillarda [Co(NH₃)₆]³⁺ dagi Co–N bog'ini birinchi marta bevosita ko'rsatib berdi (Nakamoto)." },
              { title: "Sisplatin va IQ", text: "1965 yilda Rosenberg tasodifan sisplatin sarolonga qarshi faolligini kashf etdi. IQ spektroskopiya sis va trans izomerlarni ajratishning eng oson usuli — trans D₂ₕ da faqat 1 ta Pt–Cl polosasi, sis C₂ᵥ da 2 ta." },
              { title: "π-back-donation daliqi", text: "[Fe(CN)₆]⁴⁻ da ν(CN) = 2044, [Fe(CN)₆]³⁻ da 2135 cm⁻¹. Farq 91 cm⁻¹ — bu Fe(II) dan CN* ga elektron berilishi kuchli ekanligini isbotlaydi. Cotton–Kraihanzel modeli asosini yaratdi." },
              { title: "«Barmoq izi» sohasi", text: "1500–500 cm⁻¹ oralig'i har bir molekula uchun noyob. Ikki bir xil molekula bu sohada bir xil spektr beradi. Zamonaviy IQ kutubxonalari 200 000+ birikma barmoq izini o'z ichiga oladi." },
              { title: "Mutual exclusion — nafis test", text: "Agar molekulada birorta ham polosa IQ va Ramanda bir vaqtda ko'rinmasa, unda inversiya markazi bor. Bu simmetriya tahlilining eng oddiy va aniq usullaridan biri." },
              { title: "Nakamoto — 60 yillik ma'lumotnoma", text: "K. Nakamoto (1928–2018) tomonidan 1963 yilda birinchi nashri chiqqan «Infrared and Raman Spectra of Inorganic and Coordination Compounds» kitobi hozirgacha 6 marta qayta nashr qilingan — koordinatsion IQ ning bibliyasi." },
              { title: "Uzoq IQ — kam o'rganilgan olam", text: "200 cm⁻¹ dan past sohada M–I, M–M, panjara va torsion tebranishlar joylashgan. Bu soha maxsus FT-FIR spektrometrlarni talab qiladi — Bruker Vertex 80v, Thermo Nicolet FIR moduli." },
              { title: "Rezolyutsiya va Rayleigh mezoni", text: "FT-IR ning aniqligi harakatlanuvchi oyna yo'lining uzunligi (L) ga teskari proporsional: Δν̃ = 1/(2L). 1 cm⁻¹ aniqlik uchun oyna 5 mm harakatlanishi kerak — bu 30 000 lazer to'lqin uzunligi!" },
              { title: "«Uch bosqichli» diagnostika", text: "Kompleks birikmani identifikatsiya qilish uchun: 1) Yuqori chastota → funksional guruh; 2) Barmoq izi → molekula turi; 3) Uzoq IQ → metall–ligand bog'lanishi. Bu uch bosqich hech qachon almashinmaydi." },
              { title: "Solvent effekti", text: "Xloroform da ν(C=O) ~1720 cm⁻¹, DMSO da ~1680 cm⁻¹. Bu 40 cm⁻¹ farq erituvchining vodorod bog'lanish qobiliyatini ko'rsatadi. Shu sababli har doim erituvchini ko'rsatish shart." },
            ].map((f, i) => (
              <div key={i} className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 hover:border-blue-400/50 transition-colors">
                <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <span>💫</span> {f.title}
                </h3>
                <p className="text-purple-200 text-xs leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 17. KENGAYTIRUVCHI USULLAR ═══════════════ */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-[var(--v3-chiziq)] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">⚗️</span> 17. Kengaytiruvchi usullar (IQ bilan birga qo'llaniladi)
          </h2>
          <p className="text-purple-400 text-xs mb-6 italic">IQ o'zi cheklangan — boshqa usullar bilan birga to'liq tavsif olinadi</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Raman spektroskopiya", link: "/ilmiy/tahlil/raman", icon: "💚", desc: "IQ da noaktiv (gerade) tebranishlarni ko'radi. Suvli eritmalarda ustuvor (H₂O Ramanda kuchsiz). Rezonans Raman — o'z ligandi tanlab kuchaytiradi.", best: "Simmetrik va totalno-simmetrik modalar" },
              { name: "EXAFS/XANES", link: "/ilmiy/tahlil/exafs-xanes", icon: "⚛️", desc: "Metall–ligand masofalarini to'g'ridan-to'g'ri o'lchaydi (±0.02 Å). Koordinatsion soni va qo'shni atomlarni aniqlaydi. Amorf va eritma namunalarida ishlaydi.", best: "Aniq bog' uzunliklari va koordinatsion soni" },
              { name: "Rentgen difraksiyasi", link: "/ilmiy/tahlil/xrd", icon: "", desc: "Kristall strukturasini to'liq aniqlaydi — barcha bog' uzunliklari va burchaklari. Faqat monokristall kerak. IQ tayinlashlarini tasdiqlaydi.", best: "To'liq 3D geometriya (bog' uzunligi, burchak)" },
              { name: "NMR spektroskopiya", link: "/ilmiy/tahlil/nmr", icon: "", desc: "Diamagnit komplekslarda H, C, P atomlari muhitini aniqlaydi. Ligandning M ga koordinatsiyasini ¹H kimyoviy siljish orqali tasdiqlaydi.", best: "Diamagnit komplekslar (d⁰, d¹⁰, past spin d⁶)" },
              { name: "DFT hisoblari", link: null, icon: "💻", desc: "Gaussian/ORCA dasturlari IQ spektrni nazariy hisoblab beradi. Har bir cho'qqini aniq tayinlashga yordam beradi. B3LYP/6-311G* darajasi standart.", best: "Tayinlashni tasdiqlash va noaniq cho'qqilar" },
              { name: "Mössbauer (Fe, Sn)", link: "/ilmiy/tahlil/mossbauer", icon: "☢️", desc: "Fe va Sn oksidlanish darajasi, spin holati aniq aniqlanadi. IQ dan olingan spinni tasdiqlaydi (masalan Fe(II) past/yuqori spin).", best: "Fe(II)/Fe(III), Sn(II)/Sn(IV) — spin va yadro atrofidagi elektron zichlik" },
            ].map((m, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-[var(--v3-chiziq)] hover:border-blue-500/50 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">{m.icon}</div>
                  <h3 className="text-blue-300 font-bold text-sm">{m.name}</h3>
                </div>
                <p className="text-purple-200 text-xs mb-3 leading-relaxed">{m.desc}</p>
                <div className="bg-green-900/20 border border-green-700/30 rounded p-2 mb-2">
                  <p className="text-green-300 text-[10px]"><strong>✓ Eng yaxshi:</strong> {m.best}</p>
                </div>
                {m.link && (
                  <Link href={m.link} className="inline-block text-xs text-blue-400 hover:text-blue-300 mt-1">
                    Batafsil →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ 18. XULOSALAR ═══════════════ */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-3xl"></span> 18. Asosiy xulosalar
          </h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside">
            <li className="pl-2"><strong className="text-yellow-400">IQ spektroskopiya — molekulyar tebranishlarning kvant o'tishlarini</strong> o'lchashga asoslangan. Tebranish energiyalari kvantlangan: E<sub>v</sub> = ℏω(v+½).</li>
            <li className="pl-2"><strong className="text-yellow-400">Chiziqsiz molekula 3N−6 ta</strong>, chiziqli 3N−5 ta normal moda beradi. Har bir moda o'ziga xos chastotada tebranadi.</li>
            <li className="pl-2"><strong className="text-yellow-400">IQ faol tebranish:</strong> (∂μ/∂Q)₀ ≠ 0 — dipol moment o'zgarishi zarur. Yuqori simmetriyali (Oh, D₄ₕ) komplekslarda ko'p tebranish IQ noaktiv.</li>
            <li className="pl-2"><strong className="text-yellow-400">Metall–ligand tebranishlari 600–200 cm⁻¹</strong> oralig'ida — uzoq IQ sohasi. Bu koordinatsion kimyoning eng ma'lumotli sohasi.</li>
            <li className="pl-2"><strong className="text-yellow-400">Ambidentat ligandlar</strong> (NO₂⁻, SCN⁻, CN⁻) IQ orqali qat'iy ajratiladi. HSAB nazariyasi bashorat qiladi: yumshoq → S, qattiq → N.</li>
            <li className="pl-2"><strong className="text-yellow-400">Sis va trans izomerlar simmetriya farqi</strong> tufayli IQ da turli sonli polosa beradi. Mutual exclusion qoidasi trans izomerni oson aniqlaydi.</li>
            <li className="pl-2"><strong className="text-yellow-400">Cotton–Kraihanzel modeli</strong> metall karbonillarda ν(CO) sonini geometriya bilan bog'laydi (fac: 2, mer: 3, sis: 4, trans: 1 polosa).</li>
            <li className="pl-2"><strong className="text-yellow-400">Izotopik almashish</strong> (H→D, ¹²C→¹³C) tayinlashlarni tasdiqlashning eng ishonchli usuli — Hooke qonuni aniq bashorat qiladi.</li>
            <li className="pl-2"><strong className="text-yellow-400">FT-IR ning ustunliklari</strong> (Fellgett, Jacquinot, Connes) tufayli zamonaviy asboblar bir sekundda spektr oladi va 0.1 cm⁻¹ aniqlikka erishadi.</li>
            <li className="pl-2"><strong className="text-yellow-400">IQ bir o'zi yetarli emas</strong> — Raman, EXAFS, XRD, NMR va DFT bilan birga to'liq tasvir olinadi. Bu <em>komplementar spektroskopiya</em> yondashuvi.</li>
          </ol>
        </div>

        {/* ═══════════════ NAVIGATSIYA ═══════════════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/ub-vis" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-colors">
            ← UV-Vis spektroskopiya
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-colors">
            IQ Birikmalar katalogi 
          </Link>
          <Link href="/ilmiy/tahlil/raman" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-colors">
            Raman spektroskopiya →
          </Link>
        </div>

      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA Kimyo • Koordinatsion kimyo tahlil portali • IQ spektroskopiya moduli (premium)</p>
          <p className="mt-2 text-purple-600">
            <strong>Asosiy manbalar:</strong> Nakamoto K. — Infrared and Raman Spectra of Inorganic and Coordination Compounds (6th ed., 2009);
            Cotton F. A. — Chemical Applications of Group Theory (3rd ed.);
            Herzberg G. — Molecular Spectra and Molecular Structure Vol. II;
            Wilson E. B., Decius J. C., Cross P. C. — Molecular Vibrations;
            Housecroft & Sharpe — Inorganic Chemistry (4th ed.)
          </p>
        </div>
      </footer>
    </div>
  )
}
