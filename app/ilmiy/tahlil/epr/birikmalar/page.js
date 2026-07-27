"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// EPR SPEKTROSKOPIYA — BIRIKMALAR KATALOGI (PREMIUM)
// 20 ta model va amaliy markaz: g-tensor, hiperfin, ZFS, spin holati va diagnostik imzo.
// Qiymatlar "representativ" bo'lib, erituvchi, harorat, konsentratsiya, chastota diapazoni
// va namuna agregat holatiga qarab o'zgarishi mumkin.
// ═══════════════════════════════════════════════════════════════════════════════

const compounds = [
  {
    id: "dpph",
    slug: "dpph",
    formulaHTML: "DPPH<sup>•</sup>",
    formulaPlain: "DPPH radical",
    iupac: "2,2-difenil-1-pikrilgidrazil radikali",
    commonName: "DPPH — EPR g-standarti",
    family: "Organik radikal",
    structure: "Delokalizatsiyalangan π-radikal",
    metal: "Metall yo'q",
    dConfig: "π-radikal",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Qattiq yoki eritma, xona harorati",
    gValues: "g = 2.0036",
    gType: "Deyarli izotrop",
    hyperfine: "Odatda resolved emas; N/H couplinglar kengaygan",
    nuclear: "¹⁴N, ¹H",
    zfs: "Yo'q (S=1/2)",
    signature: "Tor, deyarli bitta chiziq; g-kalibrlash uchun klassik standart",
    diagnostic: "Magnit maydon kalibrovkasi va g qiymatini tekshirish",
    caution: "Kristall holat, almashinish va dipolyar coupling linewidth ni kengaytirishi mumkin",
    tags: ["radikal", "S=1/2", "g-standart", "izotrop"],
  },
  {
    id: "tempo",
    slug: "tempo",
    formulaHTML: "TEMPO<sup>•</sup>",
    formulaPlain: "TEMPO radical",
    iupac: "2,2,6,6-tetrametilpiperidin-1-oksil radikali",
    commonName: "TEMPO — nitroksid spin-label",
    family: "Nitroksid radikal",
    structure: "N–O<sup>•</sup> markazli olti a'zoli halqa",
    metal: "Metall yo'q",
    dConfig: "π*(N–O)",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Suyuq eritma yoki muzlatilgan matritsa",
    gValues: "g<sub>iso</sub> ≈ 2.006; muzlatilganda g<sub>x,y,z</sub> ajraladi",
    gType: "Eritmada izotrop, qattiqda rombik",
    hyperfine: "¹⁴N: I=1 → 3 chiziq; a<sub>N</sub> odatda ≈ 15–17 G",
    nuclear: "¹⁴N (I=1)",
    zfs: "Yo'q (S=1/2)",
    signature: "Eritmada 1:1:1 nitroksid tripleti",
    diagnostic: "Mikroviskozlik, molekulyar harakatchanlik va spin-label tajribalari",
    caution: "O<sub>2</sub> va yuqori konsentratsiya chiziqlarni kengaytiradi",
    tags: ["radikal", "S=1/2", "¹⁴N", "spin-label", "3-chiziq"],
  },
  {
    id: "cu-acac2",
    slug: "cu-acac2",
    formulaHTML: "[Cu(acac)<sub>2</sub>]",
    formulaPlain: "Cu(acac)2",
    iupac: "Bis(2,4-pentandionato)mis(II)",
    commonName: "Mis(II) atsetilatsetonat",
    family: "Cu(II) β-diketonat",
    structure: "Buzilgan kvadrat tekis / cho'zilgan oktaedrik muhit",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Muzlatilgan eritma va qattiq kukun; eritmada g<sub>iso</sub>",
    gValues: "g<sub>iso</sub> ≈ 2.13; odatda g<sub>∥</sub> > g<sub>⊥</sub> > 2",
    gType: "Aksial anizotropiya",
    hyperfine: "⁶³Cu/⁶⁵Cu: I=3/2 → 4 chiziq, A<sub>∥</sub> ko'pincha yaxshi ajraladi",
    nuclear: "⁶³Cu, ⁶⁵Cu (I=3/2)",
    zfs: "Yo'q (S=1/2)",
    signature: "Cu²⁺ uchun klassik aksial spektr, parallel sohada 4-lik hiperfin",
    diagnostic: "dx²−y² asosiy holat, koordinatsion muhit va Cu–ligand kovalentligini baholash",
    caution: "Qattiq namuna exchange coupling sabab spektrni murakkablashtirishi mumkin",
    tags: ["Cu²⁺", "d⁹", "S=1/2", "aksial", "¹⁴N emas", "4-chiziq"],
  },
  {
    id: "cu-gly2",
    slug: "cu-gly2",
    formulaHTML: "[Cu(gly)<sub>2</sub>]",
    formulaPlain: "Cu(gly)2",
    iupac: "Bis(glitsinato)mis(II)",
    commonName: "Mis(II) glitsinat",
    family: "Cu(II) aminokarboksilat",
    structure: "N<sub>2</sub>O<sub>2</sub> ekvatorial koordinatsiya, aksial suv/ligand mumkin",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Eritma va muzlatilgan eritma",
    gValues: "g<sub>∥</sub> ≈ 2.20–2.28; g<sub>⊥</sub> ≈ 2.04–2.08",
    gType: "Aksial / yengil rombik",
    hyperfine: "Cu yadrosi uchun 4-lik; ligand ¹⁴N supergiperfin yelkasi paydo bo'lishi mumkin",
    nuclear: "⁶³/⁶⁵Cu, ¹⁴N",
    zfs: "Yo'q (S=1/2)",
    signature: "Cu²⁺ g<sub>∥</sub>–A<sub>∥</sub> juftligi donor atomlar turiga sezgir",
    diagnostic: "N/O donorlar nisbati va geometriyadagi buzilishni solishtirish",
    caution: "pH, protonlanish va gidratlanish spektr parametrlarini o'zgartiradi",
    tags: ["Cu²⁺", "d⁹", "S=1/2", "aksial", "¹⁴N", "bioanorganik"],
  },
  {
    id: "vo-acac2",
    slug: "vo-acac2",
    formulaHTML: "[VO(acac)<sub>2</sub>]",
    formulaPlain: "VO(acac)2",
    iupac: "Bis(2,4-pentandionato)oksovanadiy(IV)",
    commonName: "Vanadil atsetilatsetonat",
    family: "V(IV) oksovanadiyl",
    structure: "Kvadrat piramidal / aksial V=O markazi",
    metal: "V⁴⁺ (VO²⁺)",
    dConfig: "d¹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Eritma, muzlatilgan eritma va qattiq kukun",
    gValues: "g<sub>∥</sub> ≈ 1.93–1.95; g<sub>⊥</sub> ≈ 1.97–1.99",
    gType: "Aksial; g odatda g<sub>e</sub> dan kichik",
    hyperfine: "⁵¹V: I=7/2 → 8 chiziq; A<sub>∥</sub> > A<sub>⊥</sub>",
    nuclear: "⁵¹V (I=7/2, ≈99.8%)",
    zfs: "Yo'q (S=1/2)",
    signature: "8-lik vanadiy giperfin patterni va V=O ga xos aksial tensor",
    diagnostic: "Ekvatorial donorlar tarkibi va V=O yo'nalishidagi elektron tuzilma",
    caution: "A va g birliklarini (G, mT, MHz, cm⁻¹) aralashtirmang",
    tags: ["V⁴⁺", "VO²⁺", "d¹", "S=1/2", "8-chiziq", "aksial"],
  },
  {
    id: "mn-acac3",
    slug: "mn-acac3",
    formulaHTML: "[Mn(acac)<sub>3</sub>]",
    formulaPlain: "Mn(acac)3",
    iupac: "Tris(2,4-pentandionato)mangan(III)",
    commonName: "Mangan(III) atsetilatsetonat",
    family: "Mn(III) β-diketonat",
    structure: "Yahn–Teller buzilgan oktaedr",
    metal: "Mn³⁺",
    dConfig: "d⁴ HS",
    spin: "S = 2",
    unpaired: 4,
    status: "Faol",
    statusTone: "lime",
    sample: "Past haroratdagi qattiq/muzlatilgan namuna",
    gValues: "g<sub>eff</sub> rejimga bog'liq; keng va anizotrop signal",
    gType: "Katta anizotropiya",
    hyperfine: "⁵⁵Mn coupling ko'pincha keng signal ichida to'liq ajralmaydi",
    nuclear: "⁵⁵Mn (I=5/2)",
    zfs: "Muhim: S=2, D va E parametrlar talab qilinadi",
    signature: "Keng, temperaturaga kuchli bog'liq yuqori-spin Mn(III) spektri",
    diagnostic: "Yahn–Teller buzilishi, spin holati va ZFS ni o'rganish",
    caution: "X-band spektrini faqat bitta g bilan talqin qilish noto'g'ri",
    tags: ["Mn³⁺", "d⁴ HS", "S=2", "ZFS", "Yahn-Teller", "past-harorat"],
  },
  {
    id: "cr-acac3",
    slug: "cr-acac3",
    formulaHTML: "[Cr(acac)<sub>3</sub>]",
    formulaPlain: "Cr(acac)3",
    iupac: "Tris(2,4-pentandionato)xrom(III)",
    commonName: "Xrom(III) atsetilatsetonat",
    family: "Cr(III) β-diketonat",
    structure: "Buzilgan oktaedrik, qattiqda molekulyar packing ta'siri",
    metal: "Cr³⁺",
    dConfig: "d³",
    spin: "S = 3/2",
    unpaired: 3,
    status: "Faol",
    statusTone: "lime",
    sample: "Qattiq kukun yoki muzlatilgan organik eritma",
    gValues: "g ≈ 1.98–2.00; qattiqda kengayishi mumkin",
    gType: "Zaif–o'rtacha anizotropiya",
    hyperfine: "⁵³Cr tabiiy miqdori kichik; ko'pincha resolved emas",
    nuclear: "⁵³Cr (I=3/2, ≈9.5%)",
    zfs: "S=3/2; D kichik bo'lsa X-bandda kuzatiladi",
    signature: "Cr(III) uchun g≈2 sohada nisbatan keng signal",
    diagnostic: "Ligand almashtirilganda Cr(III) lokal simmetriyasi o'zgarishini solishtirish",
    caution: "EPR parametrlari kristall solvat, polimorf va haroratga bog'liq",
    tags: ["Cr³⁺", "d³", "S=3/2", "β-diketonat", "ZFS"],
  },
  {
    id: "fe-cn6-3",
    slug: "fe-cn6-3",
    formulaHTML: "[Fe(CN)<sub>6</sub>]<sup>3−</sup>",
    formulaPlain: "[Fe(CN)6]3-",
    iupac: "Geksasiyanoferrat(III) ioni",
    commonName: "Ferrisiyanid",
    family: "Fe(III) past-spin sianokompleks",
    structure: "Oktaedrik, kuchli maydonli ligandlar",
    metal: "Fe³⁺",
    dConfig: "d⁵ LS (t<sub>2g</sub><sup>5</sup>)",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Muzlatilgan eritma; Q-band foydali bo'lishi mumkin",
    gValues: "g<sub>1</sub>, g<sub>2</sub>, g<sub>3</sub> sezilarli rombik; ko'pincha 2–3 oralig'ida",
    gType: "Rombik anizotropiya",
    hyperfine: "⁵⁷Fe: I=1/2, tabiiy miqdori ≈2.1%; odatda kuchsiz",
    nuclear: "⁵⁷Fe (I=1/2)",
    zfs: "Yo'q (S=1/2)",
    signature: "Past-spin Fe(III) uchun g-tensorli spektr; spin-orbital coupling muhim",
    diagnostic: "Fe(III) past-spin holati, ligand maydoni va simmetriya haqida axborot",
    caution: "Aniq g-tensor olish uchun namuna muzlatilishi va ko'p chastotali o'lchov foydali",
    tags: ["Fe³⁺", "d⁵ LS", "S=1/2", "CN⁻", "rombik", "anizotrop"],
  },
  {
    id: "fe-acac3",
    slug: "fe-acac3",
    formulaHTML: "[Fe(acac)<sub>3</sub>]",
    formulaPlain: "Fe(acac)3",
    iupac: "Tris(2,4-pentandionato)temir(III)",
    commonName: "Temir(III) atsetilatsetonat",
    family: "Fe(III) yuqori-spin β-diketonat",
    structure: "Buzilgan oktaedrik",
    metal: "Fe³⁺",
    dConfig: "d⁵ HS",
    spin: "S = 5/2",
    unpaired: 5,
    status: "Faol",
    statusTone: "lime",
    sample: "Past haroratdagi muzlatilgan eritma yoki qattiq holat",
    gValues: "g<sub>eff</sub> ≈ 4.3 va/yoki ≈2 signallari paydo bo'lishi mumkin",
    gType: "Katta ZFS bilan anizotrop",
    hyperfine: "⁵⁷Fe coupling tabiiy miqdorda odatda resolved emas",
    nuclear: "⁵⁷Fe (I=1/2, ≈2.1%)",
    zfs: "Katta: S=5/2 multipletlari orasida D/E muhim",
    signature: "Yuqori-spin Fe(III) uchun g≈4.3 diagnostik komponenti mumkin",
    diagnostic: "Fe(III) spin holati va ligand maydoni buzilishini ajratish",
    caution: "Signal intensivi va ko'rinishi harorat hamda ZFS ga juda sezgir",
    tags: ["Fe³⁺", "d⁵ HS", "S=5/2", "ZFS", "g≈4.3", "past-harorat"],
  },
  {
    id: "co-cl4",
    slug: "co-cl4",
    formulaHTML: "[CoCl<sub>4</sub>]<sup>2−</sup>",
    formulaPlain: "[CoCl4]2-",
    iupac: "Tetraxlorokobaltat(II) ioni",
    commonName: "Tetraxlorokobaltat(II)",
    family: "Co(II) tetraedrik galogenokompleks",
    structure: "Tetraedrik / buzilgan tetraedrik",
    metal: "Co²⁺",
    dConfig: "d⁷ HS",
    spin: "S = 3/2",
    unpaired: 3,
    status: "Faol",
    statusTone: "lime",
    sample: "Ko'pincha past haroratda qattiq yoki muzlatilgan matritsa",
    gValues: "g<sub>eff</sub> ko'pincha ≈4.3 va ≈2 komponentlari",
    gType: "Juda kuchli orbital va g-anizotropiya",
    hyperfine: "⁵⁹Co: I=7/2, ammo tez relaksatsiya sabab ko'pincha resolved emas",
    nuclear: "⁵⁹Co (I=7/2, ≈100%)",
    zfs: "Katta ZFS; S=3/2 uchun hal qiluvchi",
    signature: "Past haroratda keng, anizotrop Co(II) signal",
    diagnostic: "Tetraedrik Co²⁺ va geometriyadagi buzilishlarni aniqlash",
    caution: "Xona haroratida signal juda keng yoki deyarli ko'rinmasligi mumkin",
    tags: ["Co²⁺", "d⁷ HS", "S=3/2", "tetraedr", "ZFS", "past-harorat"],
  },
  {
    id: "co-salen",
    slug: "co-salen",
    formulaHTML: "[Co(salen)]",
    formulaPlain: "Co(salen)",
    iupac: "N,N′-bis(salitsiliden)etilendiaminkobalt(II)",
    commonName: "Kobalt(II) salen",
    family: "Co(II) Shiff asosi",
    structure: "Kvadrat tekis / aksial adduct hosil qilishi mumkin",
    metal: "Co²⁺",
    dConfig: "d⁷",
    spin: "S = 1/2 yoki S = 3/2 (muhitga bog'liq)",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Past haroratli muzlatilgan eritma tavsiya etiladi",
    gValues: "g-tensor juda anizotrop; adduct va spin holatiga sezgir",
    gType: "Rombik / aksial, muhitga bog'liq",
    hyperfine: "⁵⁹Co: I=7/2, ba'zi holatda 8-lik coupling ajralishi mumkin",
    nuclear: "⁵⁹Co (I=7/2)",
    zfs: "S=3/2 holatda muhim; S=1/2 holatda yo'q",
    signature: "Ligand/aksial donor bog'lanishi bilan keskin o'zgaruvchi Co(II) spektri",
    diagnostic: "Adduct hosil bo'lishi, spin-state o'zgarishi va koordinatsion moslashuv",
    caution: "Co(II) ni yagona oddiy g bilan tasniflamang; simulatsiya talab qilinadi",
    tags: ["Co²⁺", "d⁷", "Shiff-asosi", "spin-crossover", "anizotrop", "ZFS"],
  },
  {
    id: "ni-cl4",
    slug: "ni-cl4",
    formulaHTML: "[NiCl<sub>4</sub>]<sup>2−</sup>",
    formulaPlain: "[NiCl4]2-",
    iupac: "Tetraxloronikkolat(II) ioni",
    commonName: "Tetraxloronikkelat(II)",
    family: "Ni(II) tetraedrik galogenokompleks",
    structure: "Tetraedrik",
    metal: "Ni²⁺",
    dConfig: "d⁸",
    spin: "S = 1",
    unpaired: 2,
    status: "Faol",
    statusTone: "lime",
    sample: "Past haroratdagi qattiq yoki muzlatilgan namuna",
    gValues: "g<sub>eff</sub> anizotrop, namuna va D ga bog'liq",
    gType: "ZFS bilan boshqariladigan",
    hyperfine: "⁶¹Ni: I=3/2, tabiiy miqdori past; odatda resolved emas",
    nuclear: "⁶¹Ni (I=3/2, ≈1.1%)",
    zfs: "S=1; integer-spin sabab ZFS EPR ko'rinishini belgilaydi",
    signature: "Keng yoki past haroratda ko'rinadigan Ni(II) signal",
    diagnostic: "Tetraedrik Ni(II) va spin 1 holatini tekshirish",
    caution: "EPR signal yo'qligi diamagnitlikni isbotlamaydi — katta D bo'lishi mumkin",
    tags: ["Ni²⁺", "d⁸", "S=1", "tetraedr", "ZFS", "EPR-cheklangan"],
  },
  {
    id: "ti-h2o6-3",
    slug: "ti-h2o6-3",
    formulaHTML: "[Ti(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>",
    formulaPlain: "[Ti(H2O)6]3+",
    iupac: "Geksaakvatitan(III) ioni",
    commonName: "Titan(III) akvakompleksi",
    family: "Ti(III) d¹ akvakompleks",
    structure: "Oktaedrik, tez ligand almashinishli suvli muhit",
    metal: "Ti³⁺",
    dConfig: "d¹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "O<sub>2</sub> dan himoyalangan suvli eritma yoki muzlatilgan namuna",
    gValues: "g<sub>iso</sub> odatda 1.9–2.0 oralig'ida",
    gType: "Eritmada izotropga yaqin, qattiqda anizotrop",
    hyperfine: "⁴⁷Ti/⁴⁹Ti tabiiy miqdori past; odatda aniq ajralmaydi",
    nuclear: "⁴⁷Ti, ⁴⁹Ti",
    zfs: "Yo'q (S=1/2)",
    signature: "d¹ markaz uchun g≈2 yaqinidagi signal",
    diagnostic: "Ti(III) hosil bo'lishi va Ti(IV) → Ti(III) qaytarilish jarayonlarini kuzatish",
    caution: "Ti³⁺ havoda tez oksidlanadi; inert atmosfera talab qilinadi",
    tags: ["Ti³⁺", "d¹", "S=1/2", "redoks", "akvakompleks"],
  },
  {
    id: "mo-cn8-3",
    slug: "mo-cn8-3",
    formulaHTML: "[Mo(CN)<sub>8</sub>]<sup>3−</sup>",
    formulaPlain: "[Mo(CN)8]3-",
    iupac: "Oktasiyanomolibdat(V) ioni",
    commonName: "Molibden(V) sianokompleksi",
    family: "Mo(V) d¹ kompleks",
    structure: "Sakkiz koordinatsiyali, kuchli ligand maydoni",
    metal: "Mo⁵⁺",
    dConfig: "d¹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Muzlatilgan eritma; X/Q-band qiyosi foydali",
    gValues: "g<sub>x,y,z</sub> odatda 1.8–2.0 oralig'ida, anizotrop",
    gType: "Rombik yoki aksial g-tensor",
    hyperfine: "⁹⁵Mo/⁹⁷Mo (I=5/2) satellitlar berishi mumkin",
    nuclear: "⁹⁵Mo, ⁹⁷Mo",
    zfs: "Yo'q (S=1/2)",
    signature: "Mo(V) uchun anizotrop d¹ signal va izotop satellitlari",
    diagnostic: "Mo(V) redoks holati, ligand maydoni va metall markazdagi spin zichligi",
    caution: "Mo izotoplari aralash bo'lgani uchun hiperfin intensivligi past bo'lishi mumkin",
    tags: ["Mo⁵⁺", "d¹", "S=1/2", "anizotrop", "redoks", "sianokompleks"],
  },
  {
    id: "cu-salen",
    slug: "cu-salen",
    formulaHTML: "[Cu(salen)]",
    formulaPlain: "Cu(salen)",
    iupac: "N,N′-bis(salitsiliden)etilendiaminmis(II)",
    commonName: "Mis(II) salen",
    family: "Cu(II) Shiff asosi",
    structure: "N<sub>2</sub>O<sub>2</sub> kvadrat tekis, aksial adduct hosil qilishi mumkin",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Organik eritma yoki muzlatilgan eritma",
    gValues: "g<sub>∥</sub> ≈ 2.20–2.30; g<sub>⊥</sub> ≈ 2.04–2.08",
    gType: "Aksial; ligand/adduct bilan rombiklashishi mumkin",
    hyperfine: "⁶³/⁶⁵Cu (I=3/2) parallel yo'nalishda 4-lik; ¹⁴N supergiperfin mumkin",
    nuclear: "⁶³/⁶⁵Cu, ¹⁴N",
    zfs: "Yo'q (S=1/2)",
    signature: "Klassik Cu(II) dx²−y² aksial imzo",
    diagnostic: "Shiff asosi donorligi, aksial koordinatsiya va katalitik adductlarni tekshirish",
    caution: "g<sub>∥</sub>/A<sub>∥</sub> ni eritma va qattiq holat qiymatlari bilan aralashtirmang",
    tags: ["Cu²⁺", "d⁹", "S=1/2", "Shiff-asosi", "aksial", "4-chiziq"],
  },
  {
    id: "cu-phen2",
    slug: "cu-phen2",
    formulaHTML: "[Cu(phen)<sub>2</sub>]<sup>2+</sup>",
    formulaPlain: "[Cu(phen)2]2+",
    iupac: "Bis(1,10-fenantrolin)mis(II) ioni",
    commonName: "Cu(II)-phen kompleksi",
    family: "Cu(II) diimin kompleksi",
    structure: "Buzilgan kvadrat piramidal / oktaedrik",
    metal: "Cu²⁺",
    dConfig: "d⁹",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Eritma va muzlatilgan eritma",
    gValues: "g<sub>iso</sub> ≈ 2.1–2.2; qattiqda g<sub>∥</sub>/g<sub>⊥</sub> ajraladi",
    gType: "Aksialdan rombikkacha",
    hyperfine: "Cu yadrosi 4-lik; ligand ¹⁴N couplinglari sharoitga qarab ko'rinadi",
    nuclear: "⁶³/⁶⁵Cu, ¹⁴N",
    zfs: "Yo'q (S=1/2)",
    signature: "N-donorli Cu(II) uchun g va A sezgir aksial imzo",
    diagnostic: "Diimin ligandlari, Cu(II)/Cu(I) redoks va bioaktiv komplekslarni kuzatish",
    caution: "Cu(I) holati d¹⁰ bo'lib EPR faol emas; signal yo'qolishi redoks belgisi bo'lishi mumkin",
    tags: ["Cu²⁺", "d⁹", "S=1/2", "N-donor", "redoks", "bioaktiv"],
  },
  {
    id: "ru-bpy3-3",
    slug: "ru-bpy3-3",
    formulaHTML: "[Ru(bpy)<sub>3</sub>]<sup>3+</sup>",
    formulaPlain: "[Ru(bpy)3]3+",
    iupac: "Tris(2,2′-bipiridin)ruteniy(III) ioni",
    commonName: "Ru(bpy)₃³⁺",
    family: "Ru(III) polipiridil kompleksi",
    structure: "Oktaedrik N<sub>6</sub> koordinatsiya",
    metal: "Ru³⁺",
    dConfig: "4d⁵ LS",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Muzlatilgan eritma; past haroratda yaxshi",
    gValues: "g-tensor odatda anizotrop; 4d spin-orbital coupling sezilarli",
    gType: "Rombik/aksial anizotropiya",
    hyperfine: "⁹⁹Ru/¹⁰¹Ru izotop couplinglari ayrim sharoitda ko'rinishi mumkin",
    nuclear: "⁹⁹Ru, ¹⁰¹Ru",
    zfs: "Yo'q (S=1/2)",
    signature: "Ru(III) hosil bo'lganda MLCT redoks siklidan keyingi paramagnit signal",
    diagnostic: "Fotoredoks kataliz, Ru(II) → Ru(III) elektron almashinuvi va oraliq holatlar",
    caution: "Boshlang'ich Ru(bpy)₃²⁺ odatda diamagnit; EPR signal oksidlangan holatga tegishli",
    tags: ["Ru³⁺", "4d⁵ LS", "S=1/2", "fotoredoks", "polipiridil", "anizotrop"],
  },
  {
    id: "fe-dnic",
    slug: "fe-dnic",
    formulaHTML: "[Fe(SR)<sub>2</sub>(NO)<sub>2</sub>]<sup>−</sup>",
    formulaPlain: "DNIC thiolate",
    iupac: "Dinitrozil-temir tiolat kompleksi",
    commonName: "DNIC — dinitrosyl iron complex",
    family: "Fe–NO bioanorganik kompleksi",
    structure: "Tiolatli dinitrozil temir markazi",
    metal: "Fe–NO",
    dConfig: "Formalism murakkab; effektiv S=1/2",
    spin: "S = 1/2",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Anaerob eritma; xona harorati yoki muzlatilgan namuna",
    gValues: "g<sub>iso</sub> ≈ 2.03; muhitda rombiklashishi mumkin",
    gType: "Ko'pincha izotrop, ayrim hollarda rombik",
    hyperfine: "¹⁴N(NO) couplinglari ayrim tizimlarda ko'rinadi",
    nuclear: "¹⁴N, ⁵⁷Fe (boyitilganda)",
    zfs: "Yo'q (effektiv S=1/2)",
    signature: "g≈2.03 yaqinidagi DNIC diagnostik signali",
    diagnostic: "NO saqlanishi, tiolat koordinatsiyasi va biologik nitrozil-temir markazlari",
    caution: "NO kimyosi va redoks holatiga juda sezgir; havoda namuna o'zgarishi mumkin",
    tags: ["Fe-NO", "S=1/2", "g≈2.03", "bioanorganik", "NO", "redoks"],
  },
  {
    id: "co-salen-axial",
    slug: "co-salen-axial",
    formulaHTML: "[Co(salen)(py)]",
    formulaPlain: "Co(salen)(pyridine)",
    iupac: "Piridin-adduktli kobalt(II) salen",
    commonName: "Aksial bazali Co(II)-salen",
    family: "Co(II) Shiff asosi addukta",
    structure: "Kvadrat piramidal / aksial N-donorli muhit",
    metal: "Co²⁺",
    dConfig: "d⁷",
    spin: "S = 1/2 (past-spin komponent)",
    unpaired: 1,
    status: "Faol",
    statusTone: "lime",
    sample: "Muzlatilgan eritma, ko'pincha past haroratda",
    gValues: "g<sub>x,y,z</sub> sezilarli anizotrop; aksial donor bilan o'zgaradi",
    gType: "Rombik",
    hyperfine: "⁵⁹Co: I=7/2; yaxshi sharoitda 8-lik komponentlar",
    nuclear: "⁵⁹Co (I=7/2)",
    zfs: "Past-spin S=1/2 komponentda yo'q",
    signature: "Aksial donor bog'lanishi bilan Co(II) g-tensorining keskin siljishi",
    diagnostic: "O<sub>2</sub> bog'lanishi, aksial ligand almashinuvi va Co(II)/Co(III) sikli",
    caution: "Spin-state aralashuvi bo'lishi mumkin; temperaturali seriya o'lchovi zarur",
    tags: ["Co²⁺", "d⁷", "S=1/2", "Shiff-asosi", "aksial", "⁵⁹Co"],
  },
  {
    id: "cu2-acetate",
    slug: "cu2-acetate",
    formulaHTML: "[Cu<sub>2</sub>(OAc)<sub>4</sub>(H<sub>2</sub>O)<sub>2</sub>]",
    formulaPlain: "Cu2(OAc)4(H2O)2",
    iupac: "Tetra-μ-atsetato-diaquodimis(II)",
    commonName: "Mis(II) atsetat dimeri",
    family: "Dinuklear Cu(II) kompleksi",
    structure: "Paddlewheel Cu₂O₄ yadrosi",
    metal: "2 × Cu²⁺",
    dConfig: "2 × d⁹",
    spin: "S = 0 asosiy holat; termik triplet faol",
    unpaired: 2,
    status: "Faol",
    statusTone: "lime",
    sample: "Qattiq holat yoki temperaturali eritma seriyasi",
    gValues: "Triplet holatda g≈2.1–2.3, anizotrop",
    gType: "Aksial / almashinish bilan modifikatsiyalangan",
    hyperfine: "Ikki Cu yadrosi couplingi, ko'pincha almashinish sabab murakkab",
    nuclear: "⁶³Cu, ⁶⁵Cu",
    zfs: "Triplet S=1 holatda D va E mumkin",
    signature: "Antiferromagnit almashinishli dimer; signal temperaturaga bog'liq",
    diagnostic: "Cu–Cu exchange J, paddlewheel yadrosi va magnit xossalarni bog'lash",
    caution: "Xona haroratidagi signalni monomer Cu²⁺ sifatida noto'g'ri talqin qilmang",
    tags: ["Cu²⁺", "d⁹", "dimer", "exchange", "S=1", "ZFS"],
  },

]
const references = [
  { label: "LibreTexts — EPR Interpretation", href: "https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Spectroscopy/Magnetic_Resonance_Spectroscopies/Electron_Paramagnetic_Resonance/EPR_-_Interpretation" },
  { label: "LibreTexts — Hyperfine Splitting", href: "https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Spectroscopy/Magnetic_Resonance_Spectroscopies/Electron_Paramagnetic_Resonance/Hyperfine_Splitting" },
  { label: "Vanadyl paramagnetic spectroscopy review", href: "https://www1.udel.edu/chem/polenova/VHPO/Vanayl_complexes_Paramagn_spectr_CoordChemRev2002.pdf" },
  { label: "Bruker — EPR 101", href: "https://www.bruker.com/en/resources/library/application-notes-mr/epr-101.html" },
]

const statusStyles = {
  Faol: "bg-lime-500/15 text-lime-300 border-lime-500/35",
  Cheklangan: "bg-yellow-500/15 text-yellow-200 border-yellow-500/35",
  "Faol emas": "bg-slate-500/15 text-slate-300 border-slate-500/35",
}

function Formula({ html, className = "" }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

function StatusBadge({ status }) {
  return <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${statusStyles[status]}`}>{status}</span>
}

function SpectrumGlyph() {
  return (
    <svg viewBox="0 0 120 36" className="w-28 h-8" aria-label="Sxematik EPR spektri" role="img">
      <path d="M2 18 H118" stroke="#6d28d9" strokeWidth="1" opacity="0.8" />
      <path d="M5 18 C12 18 13 5 20 5 C27 5 28 31 35 31 C42 31 43 5 50 5 C57 5 58 31 65 31 C72 31 73 5 80 5 C87 5 88 31 95 31 C102 31 103 18 115 18" fill="none" stroke="#a3e635" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="20" cy="5" r="2" fill="#facc15" />
      <circle cx="50" cy="5" r="2" fill="#facc15" />
      <circle cx="80" cy="5" r="2" fill="#facc15" />
    </svg>
  )
}

export default function EPRBirikmalarPage() {
  const [showHeader, setShowHeader] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState("all")
  const [filterTag, setFilterTag] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedId, setSelectedId] = useState("cu-acac2")

  const allTags = useMemo(() => {
    const tags = new Set()
    compounds.forEach((item) => item.tags.forEach((tag) => tags.add(tag)))
    return Array.from(tags).sort()
  }, [])

  const filteredCompounds = useMemo(() => {
    let result = compounds

    if (filterMode === "active") result = result.filter((item) => item.status === "Faol")
    if (filterMode === "limited") result = result.filter((item) => item.status === "Cheklangan")
    if (filterMode === "silent") result = result.filter((item) => item.status === "Faol emas")
    if (filterMode === "half") result = result.filter((item) => item.spin.includes("1/2"))
    if (filterMode === "highspin") result = result.filter((item) => item.dConfig.includes("HS") || item.spin.includes("S = 2") || item.spin.includes("S = 5/2"))
    if (filterMode === "zfs") result = result.filter((item) => item.zfs.includes("ZFS") || item.zfs.includes("D va E") || item.zfs.includes("Katta"))
    if (filterMode === "metal") result = result.filter((item) => item.metal !== "Metall yo'q")
    if (filterMode === "radical") result = result.filter((item) => item.family.includes("radikal"))

    if (filterTag !== "all") result = result.filter((item) => item.tags.includes(filterTag))

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item) =>
        [item.formulaPlain, item.iupac, item.commonName, item.family, item.metal, item.dConfig, item.signature]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
    }

    return result
  }, [filterMode, filterTag, searchQuery])

  const selected = compounds.find((item) => item.id === selectedId) || compounds[0]

  const stats = useMemo(() => ({
    total: compounds.length,
    active: compounds.filter((item) => item.status === "Faol").length,
    half: compounds.filter((item) => item.spin.includes("1/2")).length,
    zfs: compounds.filter((item) => item.zfs.includes("ZFS") || item.zfs.includes("D va E") || item.zfs.includes("Katta")).length,
  }), [])

  const resetFilters = () => {
    setSearchQuery("")
    setFilterMode("all")
    setFilterTag("all")
  }

  const filterOptions = [
    { key: "all", label: `Barchasi (${compounds.length})` },
    { key: "active", label: "🟢 EPR faol" },
    { key: "half", label: "S = 1/2" },
    { key: "highspin", label: "Yuqori spin" },
    { key: "zfs", label: "ZFS / exchange" },
    { key: "metal", label: "Metall markazli" },
    { key: "radical", label: "Organik radikal" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-blue-950 text-white">
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-200">🏠 Bosh sahifa</Link>
              <span className="text-purple-700">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-200">Tahlil usullari</Link>
              <span className="text-purple-700">›</span>
              <Link href="/ilmiy/tahlil/epr" className="hover:text-purple-200">EPR spektroskopiya</Link>
              <span className="text-purple-700">›</span>
              <span className="text-lime-400 font-semibold">Birikmalar katalogi</span>
            </nav>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-lime-400 flex items-center gap-2">
                  <span className="text-3xl">📡</span>
                  EPR spektroskopiya — Birikmalar katalogi
                </h1>
                <p className="text-purple-300 text-sm mt-1">
                  {stats.active}/{stats.total} EPR-faol markaz • g-tensor • hiperfin • ZFS • spin holati • o'lchash tavsiyasi
                </p>
              </div>
              <Link href="/ilmiy/tahlil/epr" className="text-xs bg-lime-600/80 hover:bg-lime-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← EPR nazariyasi
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-lime-600 hover:bg-lime-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-2xl border border-lime-500/20 bg-gradient-to-r from-lime-600/10 via-purple-900/40 to-blue-900/30 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.22em] text-lime-300">EPR ilmiy katalogi</p>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">Har bir karta — EPR pasporti</h2>
              <p className="text-sm text-purple-100 mt-2 leading-relaxed">
                Katalogdagi qiymatlar <strong className="text-lime-300">representativ</strong>: g, A, chiziq kengligi va hatto ko'rinadigan spektr
                erituvchi, temperatura, chastota diapazoni, kontsentratsiya hamda qattiq/eritma holatiga qarab o'zgaradi.
                Shuning uchun sahifa sonlarni mutlaq identifikator emas, balki ilmiy diagnostik yo'nalish sifatida beradi.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <div className="rounded-xl bg-purple-950/45 border border-lime-500/20 px-2 py-1"><SpectrumGlyph /></div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-200">g va A</span>
                <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-200">Spin / ZFS</span>
                <span className="px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-100">O'lchash sharoiti</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-lime-900/40 to-purple-900/40 border border-lime-700/50 rounded-xl p-4">
            <div className="text-xs text-lime-300 mb-1">Jami markazlar</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/40 to-purple-900/40 border border-emerald-700/50 rounded-xl p-4">
            <div className="text-xs text-emerald-300 mb-1">EPR faol</div>
            <div className="text-3xl font-bold text-white">{stats.active}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-xl p-4">
            <div className="text-xs text-blue-200 mb-1">S = 1/2 markazlar</div>
            <div className="text-3xl font-bold text-white">{stats.half}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-700/50 rounded-xl p-4">
            <div className="text-xs text-yellow-200 mb-1">ZFS / exchange muhim</div>
            <div className="text-3xl font-bold text-white">{stats.zfs}</div>
          </div>
        </div>

        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="🔍 Formula, IUPAC nomi, metall, dⁿ, signal imzosi yoki oila bo'yicha..."
                className="w-full px-5 py-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:outline-none focus:border-lime-500 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white">✕</button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "grid", label: "▦ Grid" },
                { key: "table", label: "▤ Jadval" },
                { key: "compact", label: "☷ Ixcham" },
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setViewMode(mode.key)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === mode.key ? "bg-lime-600 text-white" : "bg-purple-900/50 text-purple-200 hover:bg-purple-800/50"}`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-purple-300 text-xs py-2">EPR holati / fizika:</span>
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterMode(filter.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterMode === filter.key ? "bg-lime-600 text-white" : "bg-purple-900/50 text-purple-200 border border-purple-700/30 hover:border-lime-500"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
            <span className="text-purple-300 text-xs py-2">Tag:</span>
            <button
              onClick={() => setFilterTag("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTag === "all" ? "bg-lime-600 text-white" : "bg-purple-900/50 text-purple-200 border border-purple-700/30 hover:border-lime-500"}`}
            >
              Barchasi
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTag === tag ? "bg-lime-600 text-white" : "bg-purple-900/50 text-purple-200 border border-purple-700/30 hover:border-lime-500"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-purple-200 text-sm"><strong className="text-lime-400">{filteredCompounds.length}</strong> ta markaz topildi</p>
          {(searchQuery || filterMode !== "all" || filterTag !== "all") && (
            <button onClick={resetFilters} className="text-xs text-purple-300 hover:text-lime-300">✕ Filtrlarni tozalash</button>
          )}
        </div>

        {filteredCompounds.length === 0 && (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">🧪</div>
            <h3 className="text-xl font-bold text-white mb-2">Mos EPR markaz topilmadi</h3>
            <p className="text-purple-300 text-sm">Boshqa nom, metall yoki tag bo'yicha qidirib ko'ring.</p>
          </div>
        )}

        <div className="rounded-2xl border border-lime-500/25 bg-gradient-to-br from-lime-600/10 to-purple-900/45 p-5 md:p-6">
          <div className="flex flex-col lg:flex-row gap-5 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Formula html={selected.formulaHTML} className="text-2xl md:text-3xl font-bold text-lime-300" />
                <StatusBadge status={selected.status} />
                <span className="text-xs px-2 py-1 rounded bg-blue-500/15 border border-blue-500/25 text-blue-200 font-mono">{selected.dConfig}</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/15 border border-purple-500/25 text-purple-100">{selected.spin}</span>
              </div>
              <p className="text-purple-100 font-semibold">{selected.iupac}</p>
              <p className="text-purple-300 text-sm italic mt-1">{selected.commonName} • {selected.family}</p>
              <p className="text-white text-lg mt-4 leading-relaxed">{selected.signature}</p>
              <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
                <div className="rounded-xl bg-purple-950/50 border border-purple-700/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-purple-400">g-tensor</p>
                  <p className="text-lime-200 mt-1" dangerouslySetInnerHTML={{ __html: selected.gValues }} />
                  <p className="text-purple-300 text-xs mt-1">{selected.gType}</p>
                </div>
                <div className="rounded-xl bg-purple-950/50 border border-purple-700/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-purple-400">Hiperfin yadrosi</p>
                  <p className="text-yellow-200 mt-1">{selected.nuclear}</p>
                  <p className="text-purple-300 text-xs mt-1" dangerouslySetInnerHTML={{ __html: selected.hyperfine }} />
                </div>
              </div>
            </div>
            <div className="lg:w-80 rounded-2xl bg-purple-950/55 border border-yellow-500/20 p-4 text-sm space-y-3">
              <div>
                <p className="text-yellow-300 font-semibold">EPR nima beradi?</p>
                <p className="text-purple-100 mt-1 leading-relaxed">{selected.diagnostic}</p>
              </div>
              <div className="border-t border-purple-700/40 pt-3">
                <p className="text-blue-300 font-semibold">Tavsiya etilgan sharoit</p>
                <p className="text-purple-100 mt-1">{selected.sample}</p>
              </div>
              <div className="border-t border-purple-700/40 pt-3">
                <p className="text-rose-300 font-semibold">Ehtiyot nuqtasi</p>
                <p className="text-purple-100 mt-1 leading-relaxed">{selected.caution}</p>
              </div>
            </div>
          </div>
        </div>
        {viewMode === "grid" && filteredCompounds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCompounds.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`group text-left bg-gradient-to-br from-purple-900/35 to-blue-900/25 border rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-lime-500/10 ${
                  selectedId === item.id ? "border-lime-400/60 ring-1 ring-lime-400/30" : "border-purple-700/45 hover:border-lime-500/50"
                }`}
              >
                <div className="flex justify-between gap-3 items-start mb-4">
                  <div className="min-w-0">
                    <Formula html={item.formulaHTML} className="text-xl font-bold text-lime-300 group-hover:text-lime-200 transition-colors" />
                    <p className="text-xs text-purple-300 mt-1 truncate">{item.iupac}</p>
                    <p className="text-[11px] text-purple-500 mt-0.5 italic truncate">{item.commonName}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-2">
                    <p className="text-[10px] text-blue-400 uppercase">Konfiguratsiya</p>
                    <p className="text-sm text-blue-200 font-mono font-bold">{item.dConfig}</p>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-2">
                    <p className="text-[10px] text-purple-400 uppercase">Spin</p>
                    <p className="text-sm text-purple-100 font-mono font-bold">{item.spin}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between gap-3"><span className="text-purple-400">Markaz</span><span className="text-yellow-200 font-mono text-right">{item.metal}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-purple-400">Geometriya</span><span className="text-cyan-200 text-right line-clamp-1" dangerouslySetInnerHTML={{ __html: item.structure }} /></div>
                  <div className="flex justify-between gap-3"><span className="text-purple-400">g-turi</span><span className="text-lime-200 text-right line-clamp-1">{item.gType}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-purple-400">ZFS</span><span className="text-purple-200 text-right line-clamp-1">{item.zfs}</span></div>
                </div>

                <div className="bg-purple-950/45 border border-purple-700/30 rounded-lg p-3 mb-3">
                  <p className="text-[10px] uppercase tracking-wider text-purple-400">g-tensor / spektr imzosi</p>
                  <p className="text-lime-200 text-xs mt-1" dangerouslySetInnerHTML={{ __html: item.gValues }} />
                  <p className="text-purple-100 text-xs mt-2 leading-relaxed line-clamp-2">{item.signature}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 mb-4">
                  <p className="text-[11px] text-yellow-100 line-clamp-2" dangerouslySetInnerHTML={{ __html: `🔬 ${item.hyperfine}` }} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-200 text-[10px] border border-purple-700/30">{tag}</span>
                  ))}
                </div>

                <div className="pt-3 border-t border-purple-700/30 flex justify-between items-center text-xs">
                  <span className="text-purple-400">{item.unpaired} ta toq e⁻</span>
                  <span className="text-lime-300 font-semibold group-hover:text-lime-200">EPR pasportini ochish →</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {viewMode === "table" && filteredCompounds.length > 0 && (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[1050px]">
              <thead>
                <tr className="border-b border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-lime-300">Formula</th>
                  <th className="py-3 px-3 text-lime-300">Markaz / dⁿ</th>
                  <th className="py-3 px-3 text-lime-300">Spin</th>
                  <th className="py-3 px-3 text-lime-300">EPR holati</th>
                  <th className="py-3 px-3 text-lime-300">g</th>
                  <th className="py-3 px-3 text-lime-300">Hiperfin</th>
                  <th className="py-3 px-3 text-lime-300">ZFS</th>
                  <th className="py-3 px-3 text-lime-300">Tanlash</th>
                </tr>
              </thead>
              <tbody className="text-purple-100">
                {filteredCompounds.map((item) => (
                  <tr key={item.id} className={`border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors ${selectedId === item.id ? "bg-lime-900/10" : ""}`}>
                    <td className="py-3 px-3"><Formula html={item.formulaHTML} className="font-bold text-lime-300 font-mono" /><p className="text-[10px] text-purple-400 mt-1">{item.commonName}</p></td>
                    <td className="py-3 px-3"><p className="text-yellow-200 font-mono">{item.metal}</p><p className="text-blue-200 font-mono mt-1">{item.dConfig}</p></td>
                    <td className="py-3 px-3 text-purple-200">{item.spin}</td>
                    <td className="py-3 px-3"><StatusBadge status={item.status} /></td>
                    <td className="py-3 px-3 text-lime-200" dangerouslySetInnerHTML={{ __html: item.gValues }} />
                    <td className="py-3 px-3 text-yellow-100" dangerouslySetInnerHTML={{ __html: item.hyperfine }} />
                    <td className="py-3 px-3 text-purple-200">{item.zfs}</td>
                    <td className="py-3 px-3"><button onClick={() => setSelectedId(item.id)} className="text-lime-300 hover:text-white font-semibold">Ochish →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === "compact" && filteredCompounds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCompounds.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`group text-left rounded-xl border p-4 transition-all flex items-center gap-4 ${selectedId === item.id ? "bg-lime-900/20 border-lime-500/45" : "bg-purple-900/30 border-purple-700/40 hover:bg-purple-800/40 hover:border-lime-500/50"}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500/25 to-blue-500/20 border border-lime-500/20 flex items-center justify-center flex-shrink-0 text-xl">{item.status === "Faol" ? "📡" : item.status === "Cheklangan" ? "⚠️" : "◌"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Formula html={item.formulaHTML} className="text-sm font-bold text-lime-300 truncate" />
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs text-purple-300 truncate">{item.iupac}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[11px]">
                    <span className="text-blue-200 font-mono">{item.dConfig}</span>
                    <span className="text-purple-100">{item.spin}</span>
                    <span className="text-yellow-200">{item.metal}</span>
                  </div>
                </div>
                <span className="text-lime-300 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            ))}
          </div>
        )}

        {filteredCompounds.length > 5 && (
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/40 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-200 mb-4">📊 EPR diagnostik taqqoslash jadvali</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[900px]">
                <thead>
                  <tr className="border-b border-blue-700/50 bg-blue-950/40">
                    <th className="py-2 px-3 text-left text-blue-300">Markaz</th>
                    <th className="py-2 px-3 text-left text-blue-300">S</th>
                    <th className="py-2 px-3 text-left text-blue-300">Asosiy yadro</th>
                    <th className="py-2 px-3 text-left text-blue-300">Kutiladigan pattern</th>
                    <th className="py-2 px-3 text-left text-blue-300">ZFS</th>
                    <th className="py-2 px-3 text-left text-blue-300">Eng yaxshi rejim</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompounds.slice(0, 20).map((item) => (
                    <tr key={item.id} className="border-b border-blue-800/30 hover:bg-blue-900/20">
                      <td className="py-2.5 px-3"><Formula html={item.formulaHTML} className="text-lime-200 font-mono" /></td>
                      <td className="py-2.5 px-3 text-purple-100">{item.spin}</td>
                      <td className="py-2.5 px-3 text-yellow-100">{item.nuclear}</td>
                      <td className="py-2.5 px-3 text-purple-100">{item.signature}</td>
                      <td className="py-2.5 px-3 text-purple-200">{item.zfs}</td>
                      <td className="py-2.5 px-3 text-blue-200">{item.sample}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-yellow-500/25 bg-yellow-500/10 p-5">
            <h3 className="text-yellow-200 font-bold text-lg">⚠️ Katalogni ilmiy to'g'ri ishlatish</h3>
            <ul className="mt-3 space-y-2 text-sm text-purple-100 list-disc pl-5 leading-relaxed">
              <li><strong>g</strong> yagona qat'iy raqam emas: eritma/qattiq holat, orientatsiya va chastota diapazoni uni ko'rinishini o'zgartiradi.</li>
              <li><strong>A</strong> qiymatini yozganda birlikni albatta ko'rsating: G, mT, MHz yoki cm⁻¹ o'zaro bir xil emas.</li>
              <li><strong>S &gt; 1/2</strong> markazlarda D va E parametrlarisiz spektr talqini to'liq bo'lmaydi.</li>
              <li><strong>"Signal yo'q"</strong> doim diamagnitlik degani emas: relaksatsiya, katta ZFS yoki mos kelmagan diapazon ham sabab bo'lishi mumkin.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-lime-500/25 bg-lime-500/10 p-5">
            <h3 className="text-lime-200 font-bold text-lg">🧭 Keyingi premium bosqich</h3>
            <p className="text-sm text-purple-100 leading-relaxed mt-3">
              Bu katalog keyinchalik har bir birikma uchun individual sahifa bilan kengaytirilishi mumkin: real/simulyatsiyalangan spektr,
              X-band va Q-band qiyosi, g/A/D/E jadvali, namunaga xos adabiyotlar, hamda EasySpin simulyatsiya parametrlari.
            </p>
            <p className="text-sm text-lime-100 mt-3">Shunda sayt “katalog”dan haqiqiy o'zbekcha koordinatsion kimyo ma'lumotlar bazasiga aylanadi.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-700/45 bg-purple-900/30 p-5">
          <h3 className="text-white font-bold text-lg">📚 Ilmiy manbalar</h3>
          <p className="text-sm text-purple-300 mt-1">Katalogdagi tipik EPR parametrlarini talqin qilish uchun asosiy manbalar.</p>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {references.map((reference) => (
              <a key={reference.href} href={reference.href} target="_blank" rel="noreferrer" className="rounded-xl border border-purple-700/35 bg-purple-950/45 p-3 hover:border-lime-500/35 transition-colors">
                <p className="text-lime-200 text-sm font-semibold">{reference.label}</p>
                <p className="text-purple-400 text-[10px] mt-1 break-all">{reference.href}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
