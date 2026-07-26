"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Co: 0xF090A0, Cr: 0x8A99C7, Cu: 0xC88033, Pt: 0xD0D0E0, Ni: 0x50D050,
  Fe: 0xE06633, Zn: 0x7D80B0,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  Cl: 0x1FF01F, Br: 0xA62929, S: 0xFFFF30,
  bond: 0x8B9DC3, hbond: 0x66CCFF, highlight: 0xFFD700,
  cation: 0xFF88DD, anion: 0x66CCFF
}

// ═══════════════════════════════════════════════════════════════════════════
// FORMAL IZOMERLAR DATABASE
// Formal (struktur) izomeriya — bir xil empirik formula, lekin atomlar
// va ionlarning turlicha taqsimoti
// ═══════════════════════════════════════════════════════════════════════════
const FORMAL_ISOMERS = {

  // ── 1. KOORDINATSION IZOMERIYA — CoCr sistemasi ─────────
  CoCrCyanoAmine: {
    id: "CoCrCyanoAmine",
    type: "coordination",
    typeName: "Koordinatsion izomeriya",
    title: "[Co(NH₃)₆][Cr(CN)₆] ⇌ [Cr(NH₃)₆][Co(CN)₆]",
    empiricalFormula: "CoCr(NH₃)₆(CN)₆",
    description: "Kation va anion kompleks o'rtasida ligandlarning almashishi. Ikki xil metall va ikki xil ligand mavjud bo'lganda ligandlar metallar orasida qayta taqsimlanadi.",
    isomerA: {
      formula: "[Co(NH₃)₆][Cr(CN)₆]",
      name: "Geksaamminkobalt(III) geksatsianoxromat(III)",
      cation: {
        center: "Co", centerColor: CPK.Co, centerCharge: "+3", centerHyb: "d²sp³",
        ligand: "NH₃", ligandDonor: "N", ligandDonorColor: CPK.N,
        bondLength: 1.94, count: 6, formula: "[Co(NH₃)₆]³⁺",
        color: "Sariq-jigarrang"
      },
      anion: {
        center: "Cr", centerColor: CPK.Cr, centerCharge: "+3", centerHyb: "d²sp³",
        ligand: "CN⁻", ligandDonor: "C", ligandDonorColor: CPK.C,
        bondLength: 2.05, count: 6, formula: "[Cr(CN)₆]³⁻",
        color: "Sariq"
      },
      color: "Sariq-jigarrang kristall",
      colorHex: "#c68a3a"
    },
    isomerB: {
      formula: "[Cr(NH₃)₆][Co(CN)₆]",
      name: "Geksaamminxrom(III) geksatsianokobaltat(III)",
      cation: {
        center: "Cr", centerColor: CPK.Cr, centerCharge: "+3", centerHyb: "d²sp³",
        ligand: "NH₃", ligandDonor: "N", ligandDonorColor: CPK.N,
        bondLength: 2.06, count: 6, formula: "[Cr(NH₃)₆]³⁺",
        color: "Sariq"
      },
      anion: {
        center: "Co", centerColor: CPK.Co, centerCharge: "+3", centerHyb: "d²sp³",
        ligand: "CN⁻", ligandDonor: "C", ligandDonorColor: CPK.C,
        bondLength: 1.89, count: 6, formula: "[Co(CN)₆]³⁻",
        color: "Rangsiz"
      },
      color: "Och sariq kristall",
      colorHex: "#ded694"
    },
    discovery: "Werner koordinatsion nazariyasining bevosita natijasi sifatida 1900-yillarda A. Miolati va Werner tomonidan aniqlangan. Bu izomeriya turi ligandlarning turli metallar orasidagi barqarorlik farqini ko'rsatadi.",
    experiment: "Ikkala izomerni sof ajratish uchun ligand almashinuv kinetikasi (Co(III) va Cr(III) ikkalasi ham inert, d²sp³) — bu shakllarni turg'un qilib beradi. UV-Vis spektrida ular butunlay boshqacha yutilish polosalariga ega.",
    keyPrinciple: "Bir xil ligandlar to'plami (6 NH₃ + 6 CN⁻) ikki metall (Co va Cr) o'rtasida turli usulda taqsimlanadi.",
    magneticProp: "Ikkala izomer ham diamagnit — Co(III) d⁶ LS va Cr(III) d³ ikkalasi kuchli maydonda past-spin (kutubli javob).",
    stability: "[Co(NH₃)₆][Cr(CN)₆] termodinamik jihatdan biroz barqarorroq — chunki Cr(III) qattiqroq metall, CN⁻ (yumshoq donor) uchun kamroq mos keladi."
  },

  // ── 2. KOORDINATSION IZOMERIYA — CuPt sistemasi ─────────
  CuPtSquare: {
    id: "CuPtSquare",
    type: "coordination",
    typeName: "Koordinatsion izomeriya (kvadrat-planar)",
    title: "[Cu(NH₃)₄][PtCl₄] ⇌ [Pt(NH₃)₄][CuCl₄]",
    empiricalFormula: "CuPt(NH₃)₄Cl₄",
    description: "Ikki metall d⁸/d⁹ o'ziga xos kvadrat-planar geometriya beradi. Ligandlar Cu va Pt orasida qayta taqsimlanishi mumkin.",
    isomerA: {
      formula: "[Cu(NH₃)₄][PtCl₄]",
      name: "Tetraamminmis(II) tetraxloroplatinatat(II)",
      cation: {
        center: "Cu", centerColor: CPK.Cu, centerCharge: "+2", centerHyb: "dsp²",
        ligand: "NH₃", ligandDonor: "N", ligandDonorColor: CPK.N,
        bondLength: 2.03, count: 4, formula: "[Cu(NH₃)₄]²⁺",
        color: "To'q ko'k"
      },
      anion: {
        center: "Pt", centerColor: CPK.Pt, centerCharge: "+2", centerHyb: "dsp²",
        ligand: "Cl⁻", ligandDonor: "Cl", ligandDonorColor: CPK.Cl,
        bondLength: 2.32, count: 4, formula: "[PtCl₄]²⁻",
        color: "Qizil"
      },
      color: "To'q ko'k / binafsha aralash",
      colorHex: "#5a4a95"
    },
    isomerB: {
      formula: "[Pt(NH₃)₄][CuCl₄]",
      name: "Tetraamminplatina(II) tetraxloromissat(II)",
      cation: {
        center: "Pt", centerColor: CPK.Pt, centerCharge: "+2", centerHyb: "dsp²",
        ligand: "NH₃", ligandDonor: "N", ligandDonorColor: CPK.N,
        bondLength: 2.03, count: 4, formula: "[Pt(NH₃)₄]²⁺",
        color: "Rangsiz"
      },
      anion: {
        center: "Cu", centerColor: CPK.Cu, centerCharge: "+2", centerHyb: "dsp²",
        ligand: "Cl⁻", ligandDonor: "Cl", ligandDonorColor: CPK.Cl,
        bondLength: 2.26, count: 4, formula: "[CuCl₄]²⁻",
        color: "Yashil-sariq"
      },
      color: "Yashil-sariq kristall",
      colorHex: "#a8b04a"
    },
    discovery: "Kvadrat-planar komplekslarning koordinatsion izomeriyasi 20-asr o'rtalarida sintez qilingan. Pt(II) va Cu(II) ikkalasi ham d⁸/d⁹ konfiguratsiyasi bilan kvadrat-planar geometriyani afzal ko'radi.",
    experiment: "HSAB nazariyasi bo'yicha Pt²⁺ — yumshoq kislota, Cl⁻ ga yaxshi bog'lanadi; Cu²⁺ — o'rta kislota, NH₃ ga mos keladi. Shuning uchun [Cu(NH₃)₄][PtCl₄] termodinamik jihatdan afzalroq.",
    keyPrinciple: "Bir xil ligandlar (4 NH₃ + 4 Cl⁻) ikki metall (Cu va Pt) o'rtasida turli usulda taqsimlanadi.",
    magneticProp: "[Cu(NH₃)₄]²⁺ — paramagnit (d⁹, 1 juftlashmagan e⁻); [Pt(NH₃)₄]²⁺ — diamagnit (d⁸ kvadrat-planar).",
    stability: "[Cu(NH₃)₄][PtCl₄] termodinamik jihatdan barqarorroq (HSAB moslik)."
  },

  // ── 3. IONIZATSION IZOMERIYA — Sulfat/Bromid ────────────
  CoSO4Br: {
    id: "CoSO4Br",
    type: "ionization",
    typeName: "Ionizatsion izomeriya",
    title: "[Co(NH₃)₅Br]SO₄ ⇌ [Co(NH₃)₅SO₄]Br",
    empiricalFormula: "Co(NH₃)₅BrSO₄",
    description: "Ichki koordinatsion sferada Br⁻ yoki SO₄²⁻ ligand sifatida bo'lishi mumkin. Boshqasi tashqi ion sifatida qoladi. Eritmada tekshirilsa ionlar farqi aniqlanadi.",
    isomerA: {
      formula: "[Co(NH₃)₅Br]SO₄",
      name: "Bromopentaamminkobalt(III) sulfat",
      cation: {
        center: "Co", centerColor: CPK.Co, centerCharge: "+3", centerHyb: "d²sp³",
        ligand: "NH₃ + Br⁻", ligandDonor: "mix", ligandDonorColor: CPK.N,
        bondLength: 1.94, count: 6, formula: "[Co(NH₃)₅Br]²⁺",
        color: "Binafsha"
      },
      counterIon: {
        formula: "SO₄²⁻",
        name: "Sulfat ioni (tashqi sfera)",
        test: "BaCl₂ bilan BaSO₄ oq cho'kmasi"
      },
      color: "Qizil-binafsha",
      colorHex: "#a4326b",
      agNO3Test: "Bunda AgNO₃ hech qanday cho'kma bermaydi (Br⁻ ichki sferada)",
      baCl2Test: "BaCl₂ qo'shilsa darhol BaSO₄ oq cho'kmasi hosil bo'ladi (SO₄²⁻ tashqi sferada)"
    },
    isomerB: {
      formula: "[Co(NH₃)₅SO₄]Br",
      name: "Sulfatopentaamminkobalt(III) bromid",
      cation: {
        center: "Co", centerColor: CPK.Co, centerCharge: "+3", centerHyb: "d²sp³",
        ligand: "NH₃ + SO₄²⁻", ligandDonor: "mix", ligandDonorColor: CPK.O,
        bondLength: 1.99, count: 6, formula: "[Co(NH₃)₅SO₄]⁺",
        color: "Qizil"
      },
      counterIon: {
        formula: "Br⁻",
        name: "Bromid ioni (tashqi sfera)",
        test: "AgNO₃ bilan AgBr sarg'ish cho'kma"
      },
      color: "Qizil-jigarrang",
      colorHex: "#c94a2a",
      agNO3Test: "AgNO₃ qo'shilsa darhol AgBr sarg'ish cho'kmasi hosil bo'ladi (Br⁻ tashqi sferada)",
      baCl2Test: "BaCl₂ hech qanday cho'kma bermaydi (SO₄²⁻ ichki sferada)"
    },
    discovery: "Werner (1893-1911) tomonidan taxminan bir necha koordinatsion birikma juftliklari orasida topilgan. Bu izomeriya ionizatsiya usulida ionlarga ajralishida farq qiladi.",
    experiment: "Klassik tanib olish tajribasi: AgNO₃ + BaCl₂ testlari yordamida qaysi anion tashqi sferada ekanligini aniqlash mumkin. Bu — 100 yildan ortiq davomida universitet laboratoriyalarida o'tkaziladigan namoyish tajribasi.",
    keyPrinciple: "Br⁻ va SO₄²⁻ anionlari ichki ↔ tashqi sfera orasida joylashuvi bilan farq qiladi.",
    magneticProp: "Ikkala izomer ham diamagnit — Co(III) d⁶ LS.",
    stability: "[Co(NH₃)₅Br]SO₄ ba'zi sharoitlarda barqarorroq. Ammo SO₄²⁻ bidentat ligand bo'lib xelat halqa hosil qilmasa, monodentat bog'lanadi."
  },

  // ── 4. POLIMERLANISH IZOMERIYA — Pt kompleksi ───────────
  PtPolymerization: {
    id: "PtPolymerization",
    type: "polymerization",
    typeName: "Polimerlanish izomeriyasi",
    title: "[Pt(NH₃)₂Cl₂] (n=1) ⇌ [Pt(NH₃)₄][PtCl₄] (n=2)",
    empiricalFormula: "Pt(NH₃)₂Cl₂ (formula birligi)",
    description: "Bir xil empirik formulaga ega bo'lgan ammo turli molekulyar massaga ega bo'lgan komplekslar. Formula birligi (Pt(NH₃)₂Cl₂) bir yoki bir necha marta takrorlanishi mumkin.",
    isomerA: {
      formula: "[Pt(NH₃)₂Cl₂]",
      name: "cis-Diaminodixloroplatina(II) — 'monomer'",
      cation: {
        center: "Pt", centerColor: CPK.Pt, centerCharge: "+2", centerHyb: "dsp²",
        ligand: "NH₃ + Cl⁻", ligandDonor: "mix", ligandDonorColor: CPK.N,
        bondLength: 2.02, count: 4, formula: "[Pt(NH₃)₂Cl₂]",
        color: "Sariq"
      },
      molecularUnit: "1 (monomer)",
      molecularMass: "300.05 g/mol",
      color: "Sariq (sisplatin)",
      colorHex: "#e0c060"
    },
    isomerB: {
      formula: "[Pt(NH₃)₄][PtCl₄]",
      name: "Tetraamminplatina(II) tetraxloroplatinatat(II) — 'Magnus tuzi'",
      cation: {
        center: "Pt", centerColor: CPK.Pt, centerCharge: "+2", centerHyb: "dsp²",
        ligand: "NH₃", ligandDonor: "N", ligandDonorColor: CPK.N,
        bondLength: 2.03, count: 4, formula: "[Pt(NH₃)₄]²⁺",
        color: "Rangsiz"
      },
      anion: {
        center: "Pt", centerColor: CPK.Pt, centerCharge: "+2", centerHyb: "dsp²",
        ligand: "Cl⁻", ligandDonor: "Cl", ligandDonorColor: CPK.Cl,
        bondLength: 2.32, count: 4, formula: "[PtCl₄]²⁻",
        color: "Qizil-jigarrang"
      },
      molecularUnit: "2 (dimer)",
      molecularMass: "600.10 g/mol",
      color: "Yashil (Magnus yashil tuzi)",
      colorHex: "#3a7a4c"
    },
    discovery: "Magnus tuzi 1828-yilda Berlin universitetida Heinrich Gustav Magnus tomonidan sintez qilingan — bu tarixdagi eng qadimgi platina komplekslaridan biri. XX asrda uning sisplatin bilan bir xil empirik formulaga ega ekanligi aniqlangan.",
    experiment: "Molekulyar massa ostmometrik (osmometriya), kriosokopik (muzlash haroratini pasayishi) yoki mass-spektrometrik usullar bilan aniqlanadi. Magnus tuzi 2x og'ir bo'lishi ustma-ust joylashgan zanjir tuzilishi bilan izohlanadi.",
    keyPrinciple: "'Polimerlanish' atamasi Werner nomlanishida ishlatilgan. Aslida bu haqiqiy polimerlanish emas — chunki monomerlar orasida kovalent bog' yo'q. Bu koordinatsion izomeriya turining alohida shakli.",
    magneticProp: "Ikkala izomer ham diamagnit (Pt d⁸).",
    stability: "Magnus tuzi qattiq holatda zanjir tuzilishi bilan turg'un: Pt···Pt (2.9 Å) qisqa masofa — metall-metall o'zaro ta'sir mavjud.",
    specialNote: "Magnus yashil tuzida qattiq holatdagi Pt-Pt zanjir masofasi 3.24 Å, elektr o'tkazuvchan ('molekulyar sim')! 1D anizotrop kristall — birinchi organik metall/o'tkazgichlardan biri."
  },

  // ── 5. LIGAND IZOMERIYA — 1,2-pn vs 1,3-pn ────────────
  LigandIsomer: {
    id: "LigandIsomer",
    type: "ligand",
    typeName: "Ligand izomeriya",
    title: "[Co(1,2-pn)₃]³⁺ ⇌ [Co(1,3-pn)₃]³⁺",
    empiricalFormula: "Co(C₃H₁₀N₂)₃³⁺",
    description: "Ligandning o'zi turli izomer shakllarida bo'lishi mumkin. Masalan, 1,2-diaminopropan (1,2-pn) va 1,3-diaminopropan (1,3-pn) bir xil empirik formulaga ega, ammo NH₂ guruhlari uglerod zanjirining turli joylarida.",
    isomerA: {
      formula: "[Co(1,2-pn)₃]³⁺",
      name: "Tris(1,2-diaminopropan)kobalt(III) — 5 a'zoli xelat halqa",
      cation: {
        center: "Co", centerColor: CPK.Co, centerCharge: "+3", centerHyb: "d²sp³",
        ligand: "1,2-pn", ligandDonor: "N-N", ligandDonorColor: CPK.N,
        bondLength: 1.98, count: 3, formula: "[Co(1,2-pn)₃]³⁺",
        color: "To'q sariq",
        ligandFormula: "CH₃-CH(NH₂)-CH₂-NH₂",
        chelateSize: 5,
        bite: "≈ 2.85 Å"
      },
      color: "To'q sariq",
      colorHex: "#c88030",
      chelateInfo: "5-a'zoli halqa: Co-N-C-C-N (eng barqaror halqa hajmi)"
    },
    isomerB: {
      formula: "[Co(1,3-pn)₃]³⁺",
      name: "Tris(1,3-diaminopropan)kobalt(III) — 6 a'zoli xelat halqa",
      cation: {
        center: "Co", centerColor: CPK.Co, centerCharge: "+3", centerHyb: "d²sp³",
        ligand: "1,3-pn", ligandDonor: "N-N", ligandDonorColor: CPK.N,
        bondLength: 1.98, count: 3, formula: "[Co(1,3-pn)₃]³⁺",
        color: "Sariq",
        ligandFormula: "H₂N-CH₂-CH₂-CH₂-NH₂",
        chelateSize: 6,
        bite: "≈ 3.10 Å"
      },
      color: "Sariq",
      colorHex: "#e0c848",
      chelateInfo: "6-a'zoli halqa: Co-N-C-C-C-N (2-a'zo katta, kuchsizroq)"
    },
    discovery: "1,2-diaminopropan (propilendiamin) va 1,3-diaminopropan (trimetilendiamin) N-donor xelat ligandlar sifatida 20-asr o'rtalarida keng o'rganildi. Ular xelat halqa o'lchamining ta'sirini o'rganish uchun modelli ligandlar.",
    experiment: "Xelat effekti va halqa o'lchami ta'sirini ko'rsatuvchi klassik misol. UV-Vis va IR spektrlarida farqlar aniq ko'rinadi. Termodinamik barqarorlik konstantalari o'lchanadi (log K).",
    keyPrinciple: "Ligand konstitutsiyasidagi (NH₂ guruhlari pozitsiyasi) farq — xelat halqa o'lchamini va shuning uchun kompleksning barqarorligini o'zgartiradi.",
    magneticProp: "Ikkala izomer ham diamagnit (Co(III) d⁶ LS, kuchli maydon).",
    stability: "5-a'zoli halqa (1,2-pn) 6-a'zoli halqa (1,3-pn) dan tabiiy ravishda barqarorroq (Baeyer taranglik nazariyasi va sterik effektlar bilan)."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁶ 4s²", oxidation: "+3", role: "Markaziy ion (d⁶ LS)", color: "#F090A0" },
  Cr: { name: "Xrom (Cr)", atomic: 24, mass: "52.00 u", config: "[Ar] 3d³ 4s¹", oxidation: "+3", role: "Markaziy ion (d³)", color: "#8A99C7" },
  Cu: { name: "Mis (Cu)", atomic: 29, mass: "63.55 u", config: "[Ar] 3d⁹", oxidation: "+2", role: "Markaziy ion (d⁹ paramagnit)", color: "#C88033" },
  Pt: { name: "Platina (Pt)", atomic: 78, mass: "195.08 u", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", oxidation: "+2", role: "Markaziy ion (d⁸ diamagnit)", color: "#D0D0E0" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "NH₃, en, pn donor", hybridization: "sp³", color: "#3050F8" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "CN⁻ donor, ligand tarkibi", hybridization: "sp/sp³", color: "#909090" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "Ligand tarkibi", color: "#FFFFFF" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "SO₄²⁻ donor", hybridization: "sp³", color: "#FF0D0D" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁶", charge: "-1", role: "Ligand yoki tashqi ion", color: "#1FF01F" },
  Br: { name: "Brom (Br⁻)", atomic: 35, mass: "79.90 u", config: "[Ar] 3d¹⁰ 4s² 4p⁶", charge: "-1", role: "Ligand yoki tashqi ion", color: "#A62929" },
  S:  { name: "Oltingugurt (S)", atomic: 16, mass: "32.06 u", config: "[Ne] 3s² 3p⁴", role: "SO₄²⁻ markazi", hybridization: "sp³", color: "#FFFF30" }
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE
// ═══════════════════════════════════════════════════════════════════════════
function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64, fontFamily = "Arial, sans-serif",
    color = "#ffffff", bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa", padding = 14, scale = 0.5
  } = options
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  const textWidth = ctx.measureText(text).width
  canvas.width = textWidth + padding * 2
  canvas.height = fontSize + padding * 2
  ctx.fillStyle = bgColor
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 3
  const r = 12
  ctx.beginPath()
  ctx.moveTo(r, 0); ctx.lineTo(canvas.width - r, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r)
  ctx.lineTo(canvas.width, canvas.height - r)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height)
  ctx.lineTo(r, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r)
  ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath(); ctx.fill(); ctx.stroke()
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"; ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function FormalIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const leftGroupRef = useRef(null)
  const rightGroupRef = useRef(null)
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const swapAnimRef = useRef({ active: false, progress: 0 })

  // ── UI STATE'lari ───────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentSystem, setCurrentSystem] = useState("CoCrCyanoAmine")
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [viewMode, setViewMode] = useState("both") // both | A | B
  const [showLabels, setShowLabels] = useState(true)
  const [showHydrogens, setShowHydrogens] = useState(true)
  const [showCationAnionColor, setShowCationAnionColor] = useState(true)
  const [runSwapAnimation, setRunSwapAnimation] = useState(false)
  const [activePanel, setActivePanel] = useState(null)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, types: true, structure: true, experiment: true,
    hsab: true, magnetic: true, history: true, table: true, references: true
  })

  // Ko'chiriladigan panel
  const [panelPos, setPanelPos] = useState({ x: 12, y: 12 })
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const panelRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const handlePanelDragStart = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    dragOffsetRef.current = { x: clientX - rect.left, y: clientY - rect.top }
    setIsPanelDragging(true)
  }, [])
  const handlePanelDragMove = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const container = panelRef.current.parentElement
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const pW = panelRef.current.offsetWidth
    const pH = panelRef.current.offsetHeight
    let nx = clientX - cRect.left - dragOffsetRef.current.x
    let ny = clientY - cRect.top - dragOffsetRef.current.y
    nx = Math.max(0, Math.min(cRect.width - pW, nx))
    ny = Math.max(0, Math.min(cRect.height - pH, ny))
    setPanelPos({ x: nx, y: ny })
  }, [])
  const handlePanelDragEnd = useCallback(() => setIsPanelDragging(false), [])

  useEffect(() => {
    if (!isPanelDragging) return
    const onMouseMove = (e) => handlePanelDragMove(e.clientX, e.clientY)
    const onMouseUp = () => handlePanelDragEnd()
    const onTouchMove = (e) => {
      if (e.touches.length > 0) { e.preventDefault(); handlePanelDragMove(e.touches[0].clientX, e.touches[0].clientY) }
    }
    const onTouchEnd = () => handlePanelDragEnd()
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchcancel", onTouchEnd)
    const prevCursor = document.body.style.cursor
    const prevSelect = document.body.style.userSelect
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevSelect
    }
  }, [isPanelDragging, handlePanelDragMove, handlePanelDragEnd])

  const togglePanel = (name) => setActivePanel(activePanel === name ? null : name)

  const system = FORMAL_ISOMERS[currentSystem]

  // ═══════════════════════════════════════════════════════════
  // BOG'LANISH YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.06, opacity = 0.75) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
    const material = new THREE.MeshStandardMaterial({
      color, roughness: 0.4, metalness: 0.3, transparent: true, opacity
    })
    const bond = new THREE.Mesh(geometry, material)
    bond.position.copy(midpoint)
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
    bond.userData = { type: 'bond' }
    parent.add(bond)
    bondsRef.current.push(bond)
    return bond
  }, [])

  const createDoubleBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.04) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const up = new THREE.Vector3(0, 1, 0)
    const perp = new THREE.Vector3().crossVectors(direction, Math.abs(direction.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize().multiplyScalar(0.1)
    ;[perp, perp.clone().negate()].forEach(offset => {
      const geo = new THREE.CylinderGeometry(radius, radius, length, 12)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3, transparent: true, opacity: 0.75 })
      const bond = new THREE.Mesh(geo, mat)
      bond.position.copy(midpoint).add(offset)
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
      parent.add(bond)
      bondsRef.current.push(bond)
    })
  }, [])

  // ═══════════════════════════════════════════════════════════
  // NH₃ LIGAND
  // ═══════════════════════════════════════════════════════════
  const createNH3 = useCallback((parent, nPos, centerPos, showH, ligandLabel = 'NH₃') => {
    const nGeo = new THREE.SphereGeometry(0.24, 32, 32)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: ligandLabel, sphere: 'inner' }
    parent.add(nMesh)
    atomsRef.current.push(nMesh)
    createBond(parent, centerPos, nPos, CPK.bond, 0.06)

    if (showH) {
      const outward = nPos.clone().sub(centerPos).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const perp1 = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
      const perp2 = new THREE.Vector3().crossVectors(outward, perp1).normalize()
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3
        const hDir = outward.clone().multiplyScalar(0.32)
          .add(perp1.clone().multiplyScalar(0.38 * Math.cos(angle)))
          .add(perp2.clone().multiplyScalar(0.38 * Math.sin(angle)))
        const hPos = nPos.clone().add(hDir)
        const hGeo = new THREE.SphereGeometry(0.11, 20, 20)
        const hMat = new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
        const hMesh = new THREE.Mesh(hGeo, hMat)
        hMesh.position.copy(hPos)
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, ligandName: ligandLabel + ' tarkibi', sphere: 'inner' }
        parent.add(hMesh)
        atomsRef.current.push(hMesh)
        createBond(parent, nPos, hPos, 0x666677, 0.03, 0.5)
      }
    }
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // CN⁻ LIGAND
  // ═══════════════════════════════════════════════════════════
  const createCN = useCallback((parent, dir, centerPos, bondLen) => {
    const cPos = centerPos.clone().add(dir.clone().multiplyScalar(bondLen))
    const nPos = centerPos.clone().add(dir.clone().multiplyScalar(bondLen + 1.16))

    const cMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.3, metalness: 0.2, emissive: CPK.C, emissiveIntensity: 0.1 })
    )
    cMesh.position.copy(cPos)
    cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: 'CN⁻ (siano) donor', sphere: 'inner', isDonor: true }
    parent.add(cMesh)
    atomsRef.current.push(cMesh)

    const nMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 28, 28),
      new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
    )
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, ligandName: 'CN⁻ (terminal)', sphere: 'inner' }
    parent.add(nMesh)
    atomsRef.current.push(nMesh)

    createBond(parent, centerPos, cPos, CPK.bond, 0.07, 0.85)
    createDoubleBond(parent, cPos, nPos, 0x556699, 0.04)
    createBond(parent, cPos, nPos, 0x556699, 0.045, 0.7)
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // Halogenid Cl⁻ yoki Br⁻ (koordinatsion)
  // ═══════════════════════════════════════════════════════════
  const createHalide = useCallback((parent, pos, centerPos, halide = "Cl") => {
    const color = halide === "Cl" ? CPK.Cl : CPK.Br
    const radius = halide === "Cl" ? 0.32 : 0.38
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.2, emissive: color, emissiveIntensity: 0.15 })
    )
    mesh.position.copy(pos)
    mesh.userData = { type: 'atom', element: halide, info: ATOM_INFO[halide], ligandName: `${halide}⁻ ligand`, sphere: 'inner', isDonor: true }
    parent.add(mesh)
    atomsRef.current.push(mesh)
    createBond(parent, centerPos, pos, halide === "Cl" ? 0x448844 : 0x884444, 0.06)
    return mesh
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // SO₄²⁻ ligand (monodentat, O orqali)
  // ═══════════════════════════════════════════════════════════
  const createSO4 = useCallback((parent, dir, centerPos, bondLen) => {
    // Koordinatsiya: M-O-S(=O)₃
    const oCoordPos = centerPos.clone().add(dir.clone().multiplyScalar(bondLen))
    const oCoord = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
    )
    oCoord.position.copy(oCoordPos)
    oCoord.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'SO₄²⁻ donor O', sphere: 'inner', isDonor: true }
    parent.add(oCoord)
    atomsRef.current.push(oCoord)
    createBond(parent, centerPos, oCoordPos, CPK.bond, 0.07)

    // S markaz
    const sPos = oCoordPos.clone().add(dir.clone().multiplyScalar(1.55))
    const sMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 32),
      new THREE.MeshStandardMaterial({ color: CPK.S, roughness: 0.3, metalness: 0.3, emissive: CPK.S, emissiveIntensity: 0.2 })
    )
    sMesh.position.copy(sPos)
    sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, ligandName: 'SO₄²⁻ tarkibi', sphere: 'inner' }
    parent.add(sMesh)
    atomsRef.current.push(sMesh)
    createDoubleBond(parent, oCoordPos, sPos, 0xaa4444, 0.04)

    // 3 ta boshqa O (tetraedr)
    const up = new THREE.Vector3(0, 1, 0)
    const perp1 = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1,0,0) : up).normalize()
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    const tetrahedronAngle = (109.5 * Math.PI) / 180
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3
      const oDir = dir.clone().multiplyScalar(Math.cos(tetrahedronAngle))
        .add(perp1.clone().multiplyScalar(Math.sin(tetrahedronAngle) * Math.cos(angle)))
        .add(perp2.clone().multiplyScalar(Math.sin(tetrahedronAngle) * Math.sin(angle)))
      const oPos = sPos.clone().add(oDir.multiplyScalar(1.48))
      const oMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 24, 24),
        new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.15 })
      )
      oMesh.position.copy(oPos)
      oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'SO₄²⁻ tarkibi', sphere: 'inner' }
      parent.add(oMesh)
      atomsRef.current.push(oMesh)
      // Kombinatsiyalangan qo'sh/yakka bog' (rezonans)
      createBond(parent, sPos, oPos, 0xaa4444, 0.045, 0.7)
    }
  }, [createBond, createDoubleBond])

  // ═══════════════════════════════════════════════════════════
  // Xelat ligand (1,2-pn yoki 1,3-pn)
  // form: 5 (1,2-pn — 5 a'zoli halqa) yoki 6 (1,3-pn — 6 a'zoli halqa)
  // ═══════════════════════════════════════════════════════════
  const createChelateProp = useCallback((parent, n1Pos, n2Pos, centerPos, showH, form = 5) => {
    // Ikkala N
    ;[n1Pos, n2Pos].forEach((nPos) => {
      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 32, 32),
        new THREE.MeshStandardMaterial({ color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15 })
      )
      nMesh.position.copy(nPos)
      nMesh.userData = {
        type: 'atom', element: 'N', info: ATOM_INFO.N,
        ligandName: form === 5 ? '1,2-pn N donor' : '1,3-pn N donor',
        sphere: 'inner', isDonor: true
      }
      parent.add(nMesh)
      atomsRef.current.push(nMesh)
      createBond(parent, centerPos, nPos, CPK.bond, 0.06)
    })

    // C uglerodlar — halqani hosil qilish
    const mid = new THREE.Vector3().addVectors(n1Pos, n2Pos).multiplyScalar(0.5)
    const bulge = mid.clone().sub(centerPos).normalize().multiplyScalar(0.7).add(mid)
    const carbons = []
    if (form === 5) {
      // 1,2-pn: N-C-C-N (2 ta C)
      carbons.push(n1Pos.clone().lerp(bulge, 0.5))
      carbons.push(n2Pos.clone().lerp(bulge, 0.5))
    } else {
      // 1,3-pn: N-C-C-C-N (3 ta C)
      const p1 = n1Pos.clone().lerp(bulge, 0.4)
      const p2 = bulge.clone()
      const p3 = n2Pos.clone().lerp(bulge, 0.4)
      carbons.push(p1, p2, p3)
    }

    carbons.forEach((cPos) => {
      const cMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 24, 24),
        new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      )
      cMesh.position.copy(cPos)
      cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: (form === 5 ? '1,2-pn' : '1,3-pn') + ' C', sphere: 'inner' }
      parent.add(cMesh)
      atomsRef.current.push(cMesh)
    })

    // Bog'lanishlar
    createBond(parent, n1Pos, carbons[0], 0x777788, 0.04, 0.7)
    for (let i = 0; i < carbons.length - 1; i++) {
      createBond(parent, carbons[i], carbons[i + 1], 0x777788, 0.04, 0.7)
    }
    createBond(parent, carbons[carbons.length - 1], n2Pos, 0x777788, 0.04, 0.7)

    if (showH) {
      // 1,2-pn — birinchi C da CH₃ (metil), boshqa C da 2 ta H
      // 1,3-pn — barcha C larda 2 ta H
      carbons.forEach((cPos, idx) => {
        const outward = cPos.clone().sub(centerPos).normalize()
        const up = new THREE.Vector3(0, 1, 0)
        const perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
        // 1,2-pn: idx=0 (birinchi C) da metil, idx=1 da CH₂
        if (form === 5 && idx === 0) {
          // CH(CH₃) — 1 ta H va 1 ta CH₃
          const hPos = cPos.clone().add(outward.clone().multiplyScalar(0.2)).add(perp.clone().multiplyScalar(0.3))
          const hMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 16, 16),
            new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
          )
          hMesh.position.copy(hPos)
          hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, ligandName: '1,2-pn CH', sphere: 'inner' }
          parent.add(hMesh); atomsRef.current.push(hMesh)
          createBond(parent, cPos, hPos, 0x555566, 0.025, 0.45)

          // CH₃ metil guruhi
          const meCPos = cPos.clone().add(outward.clone().multiplyScalar(0.55)).add(perp.clone().multiplyScalar(-0.35))
          const meCMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 24, 24),
            new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
          )
          meCMesh.position.copy(meCPos)
          meCMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, ligandName: '1,2-pn CH₃', sphere: 'inner' }
          parent.add(meCMesh); atomsRef.current.push(meCMesh)
          createBond(parent, cPos, meCPos, 0x777788, 0.04, 0.7)
          // 3 ta H metilda
          const meUp = new THREE.Vector3().crossVectors(outward, perp).normalize()
          for (let j = 0; j < 3; j++) {
            const ang = (j * 2 * Math.PI) / 3
            const meHPos = meCPos.clone()
              .add(outward.clone().multiplyScalar(0.25))
              .add(perp.clone().multiplyScalar(0.32 * Math.cos(ang)))
              .add(meUp.clone().multiplyScalar(0.32 * Math.sin(ang)))
            const meHMesh = new THREE.Mesh(
              new THREE.SphereGeometry(0.08, 16, 16),
              new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
            )
            meHMesh.position.copy(meHPos)
            meHMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, ligandName: '1,2-pn CH₃', sphere: 'inner' }
            parent.add(meHMesh); atomsRef.current.push(meHMesh)
            createBond(parent, meCPos, meHPos, 0x555566, 0.025, 0.4)
          }
        } else {
          // CH₂ — 2 ta H
          ;[+1, -1].forEach(sign => {
            const hPos = cPos.clone().add(perp.clone().multiplyScalar(0.3 * sign)).add(outward.clone().multiplyScalar(0.2))
            const hMesh = new THREE.Mesh(
              new THREE.SphereGeometry(0.09, 16, 16),
              new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
            )
            hMesh.position.copy(hPos)
            hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, ligandName: 'CH₂ tarkibi', sphere: 'inner' }
            parent.add(hMesh); atomsRef.current.push(hMesh)
            createBond(parent, cPos, hPos, 0x555566, 0.025, 0.45)
          })
        }
      })

      // N atomlarida NH₂ (har birida 2 ta H)
      ;[n1Pos, n2Pos].forEach((nPos) => {
        const outward = nPos.clone().sub(centerPos).normalize()
        const up = new THREE.Vector3(0, 1, 0)
        const perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
        ;[+1, -1].forEach(sign => {
          const hPos = nPos.clone().add(outward.clone().multiplyScalar(0.28)).add(perp.clone().multiplyScalar(0.28 * sign))
          const hMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
          )
          hMesh.position.copy(hPos)
          hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H, ligandName: 'NH₂ tarkibi', sphere: 'inner' }
          parent.add(hMesh); atomsRef.current.push(hMesh)
          createBond(parent, nPos, hPos, 0x555566, 0.025, 0.45)
        })
      })
    }
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // Tashqi ion (SO₄²⁻ yoki Br⁻) — kompleksdan uzoqda
  // ═══════════════════════════════════════════════════════════
  const createOuterIon = useCallback((parent, pos, ionType) => {
    if (ionType === "SO4") {
      // Kichik SO₄²⁻ ko'rinishi
      const sMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 24, 24),
        new THREE.MeshStandardMaterial({ color: CPK.S, roughness: 0.4, metalness: 0.3, emissive: CPK.S, emissiveIntensity: 0.2, transparent: true, opacity: 0.9 })
      )
      sMesh.position.copy(pos)
      sMesh.userData = { type: 'atom', element: 'S', info: ATOM_INFO.S, ligandName: 'SO₄²⁻ tashqi ion', sphere: 'outer' }
      parent.add(sMesh); atomsRef.current.push(sMesh)
      // 4 ta O tetraedrda
      const oOffsets = [
        [1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]
      ]
      oOffsets.forEach(([x, y, z]) => {
        const oPos = pos.clone().add(new THREE.Vector3(x, y, z).normalize().multiplyScalar(0.55))
        const oMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 20, 20),
          new THREE.MeshStandardMaterial({ color: CPK.O, roughness: 0.3, metalness: 0.2, emissive: CPK.O, emissiveIntensity: 0.1, transparent: true, opacity: 0.85 })
        )
        oMesh.position.copy(oPos)
        oMesh.userData = { type: 'atom', element: 'O', info: ATOM_INFO.O, ligandName: 'SO₄²⁻ tashqi ion', sphere: 'outer' }
        parent.add(oMesh); atomsRef.current.push(oMesh)
        createBond(parent, pos, oPos, 0xaa4444, 0.035, 0.6)
      })
    } else {
      // Br⁻ yoki Cl⁻ tashqi ion (yakka)
      const isCl = ionType === "Cl"
      const color = isCl ? CPK.Cl : CPK.Br
      const radius = isCl ? 0.34 : 0.4
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 28, 28),
        new THREE.MeshStandardMaterial({
          color, roughness: 0.4, metalness: 0.2,
          emissive: color, emissiveIntensity: 0.2, transparent: true, opacity: 0.9
        })
      )
      mesh.position.copy(pos)
      mesh.userData = { type: 'atom', element: ionType, info: ATOM_INFO[ionType], ligandName: `${ionType}⁻ tashqi ion`, sphere: 'outer' }
      parent.add(mesh); atomsRef.current.push(mesh)
    }
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // Bitta kompleks quramiz — kation yoki anion
  // ═══════════════════════════════════════════════════════════
  const buildComplex = useCallback((group, offsetPos, complexData, complexType, ligandConfig = null) => {
    const center = new THREE.Vector3().copy(offsetPos)
    const { center: cData, bondLength, count } = complexData
    const chargeStr = cData.centerCharge || complexData.centerCharge

    // Markaziy metall
    const centerRadius = 0.4
    const cGeo = new THREE.SphereGeometry(centerRadius, 64, 64)
    const cMat = new THREE.MeshStandardMaterial({
      color: cData.centerColor, roughness: 0.15, metalness: 0.9,
      emissive: cData.centerColor, emissiveIntensity: 0.15
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(center)
    cMesh.userData = {
      type: 'atom', element: cData.center,
      info: ATOM_INFO[cData.center],
      isCenter: true, sphere: 'inner',
      ligandName: `${complexType === 'cation' ? '⊕ Kation' : '⊖ Anion'} markazi`
    }
    group.add(cMesh); atomsRef.current.push(cMesh)

    // Oktaedrik yoki kvadrat-planar
    let dirs
    if (count === 6) {
      dirs = [
        new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
      ]
    } else {
      // Kvadrat-planar 4
      dirs = [
        new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
      ]
    }

    // ligandConfig: {nh3: N, cn: N, cl: N, br: N, so4: N, chelate: [...]}
    const cfg = ligandConfig || { nh3: count, cn: 0, cl: 0, br: 0, so4: 0, chelate: [] }
    let dIdx = 0

    for (let i = 0; i < cfg.nh3; i++) {
      const pos = center.clone().add(dirs[dIdx].clone().multiplyScalar(bondLength))
      createNH3(group, pos, center, showHydrogens)
      dIdx++
    }
    for (let i = 0; i < cfg.cn; i++) {
      createCN(group, dirs[dIdx], center, bondLength)
      dIdx++
    }
    for (let i = 0; i < cfg.cl; i++) {
      const pos = center.clone().add(dirs[dIdx].clone().multiplyScalar(bondLength + 0.3))
      createHalide(group, pos, center, "Cl")
      dIdx++
    }
    for (let i = 0; i < cfg.br; i++) {
      const pos = center.clone().add(dirs[dIdx].clone().multiplyScalar(bondLength + 0.4))
      createHalide(group, pos, center, "Br")
      dIdx++
    }
    for (let i = 0; i < cfg.so4; i++) {
      createSO4(group, dirs[dIdx], center, bondLength)
      dIdx++
    }
    // Xelat halqalar
    if (cfg.chelate && cfg.chelate.length > 0) {
      cfg.chelate.forEach((chelateSize) => {
        // 2 ta N pozitsiyasini olish
        const n1Pos = center.clone().add(dirs[dIdx].clone().multiplyScalar(bondLength))
        dIdx++
        const n2Pos = center.clone().add(dirs[dIdx].clone().multiplyScalar(bondLength))
        dIdx++
        createChelateProp(group, n1Pos, n2Pos, center, showHydrogens, chelateSize)
      })
    }

    // Rangli halo — kation/anion belgisi
    if (showCationAnionColor) {
      const haloColor = complexType === 'cation' ? CPK.cation : CPK.anion
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(centerRadius * 5.5, 32, 32),
        new THREE.MeshBasicMaterial({
          color: haloColor, transparent: true, opacity: 0.05,
          side: THREE.DoubleSide, depthWrite: false
        })
      )
      halo.position.copy(center)
      halo.userData = { isHalo: true, sphere: complexType }
      group.add(halo)
    }
  }, [showHydrogens, showCationAnionColor, createNH3, createCN, createHalide, createSO4, createChelateProp])

  // ═══════════════════════════════════════════════════════════
  // ASOSIY MOLEKULA QURISH — sistemaga qarab
  // ═══════════════════════════════════════════════════════════
  const buildIsomerSide = useCallback((group, isomer, offsetX) => {
    const sysType = system.type
    // Ikki kompleks: kation va anion — vertikal joylashadi
    // yoki bitta neytral kompleks + tashqi ion(lar)

    if (sysType === "coordination") {
      // Kation yuqorida, anion pastda
      const cationPos = new THREE.Vector3(offsetX, 1.8, 0)
      const anionPos = new THREE.Vector3(offsetX, -1.8, 0)

      // Kation
      const cationLigCount = isomer.cation.count
      const cationCfg = {
        nh3: isomer.cation.ligand === "NH₃" ? cationLigCount : 0,
        cn: isomer.cation.ligand === "CN⁻" ? cationLigCount : 0,
        cl: isomer.cation.ligand === "Cl⁻" ? cationLigCount : 0,
        br: 0, so4: 0, chelate: []
      }
      buildComplex(group, cationPos, {
        ...isomer.cation,
        center: { center: isomer.cation.center, centerColor: isomer.cation.centerColor, centerCharge: isomer.cation.centerCharge },
        bondLength: isomer.cation.bondLength, count: cationLigCount
      }, 'cation', cationCfg)

      // Anion
      const anionLigCount = isomer.anion.count
      const anionCfg = {
        nh3: isomer.anion.ligand === "NH₃" ? anionLigCount : 0,
        cn: isomer.anion.ligand === "CN⁻" ? anionLigCount : 0,
        cl: isomer.anion.ligand === "Cl⁻" ? anionLigCount : 0,
        br: 0, so4: 0, chelate: []
      }
      buildComplex(group, anionPos, {
        ...isomer.anion,
        center: { center: isomer.anion.center, centerColor: isomer.anion.centerColor, centerCharge: isomer.anion.centerCharge },
        bondLength: isomer.anion.bondLength, count: anionLigCount
      }, 'anion', anionCfg)

      // Yorliqlar
      if (showLabels) {
        const cationSprite = makeTextSprite(isomer.cation.formula, {
          fontSize: 42, color: "#ffffff",
          bgColor: "rgba(150, 40, 100, 0.85)",
          borderColor: "#ff88dd", scale: 0.4
        })
        cationSprite.position.set(offsetX, 3.5, 0)
        group.add(cationSprite); labelsRef.current.push(cationSprite)

        const anionSprite = makeTextSprite(isomer.anion.formula, {
          fontSize: 42, color: "#ffffff",
          bgColor: "rgba(30, 90, 140, 0.85)",
          borderColor: "#66ccff", scale: 0.4
        })
        anionSprite.position.set(offsetX, -3.5, 0)
        group.add(anionSprite); labelsRef.current.push(anionSprite)
      }
    }
    else if (sysType === "ionization") {
      // Ionizatsion — kompleks va tashqi ion
      const complexPos = new THREE.Vector3(offsetX, 0.5, 0)
      // Bu kompleks 6 ligandli oktaedrik: 5 NH₃ + 1 (Br yoki SO₄)
      const cfg = {
        nh3: 5,
        cn: 0,
        cl: 0,
        br: isomer.cation.ligand.includes('Br') ? 1 : 0,
        so4: isomer.cation.ligand.includes('SO₄') ? 1 : 0,
        chelate: []
      }
      buildComplex(group, complexPos, {
        ...isomer.cation,
        center: { center: isomer.cation.center, centerColor: isomer.cation.centerColor, centerCharge: isomer.cation.centerCharge },
        bondLength: isomer.cation.bondLength, count: 6
      }, 'cation', cfg)

      // Tashqi ion (SO₄ yoki Br)
      const outerPos = new THREE.Vector3(offsetX, -3, 0)
      if (isomer.counterIon.formula === "SO₄²⁻") {
        createOuterIon(group, outerPos, "SO4")
      } else {
        // 1 ta Br⁻
        createOuterIon(group, outerPos, "Br")
      }

      if (showLabels) {
        const cationSprite = makeTextSprite(isomer.cation.formula, {
          fontSize: 42, color: "#ffffff",
          bgColor: "rgba(150, 40, 100, 0.85)",
          borderColor: "#ff88dd", scale: 0.4
        })
        cationSprite.position.set(offsetX, 3.5, 0)
        group.add(cationSprite); labelsRef.current.push(cationSprite)

        const outerSprite = makeTextSprite(isomer.counterIon.formula, {
          fontSize: 40, color: "#ffffff",
          bgColor: "rgba(90, 30, 30, 0.85)",
          borderColor: "#ff9966", scale: 0.38
        })
        outerSprite.position.set(offsetX, -4.2, 0)
        group.add(outerSprite); labelsRef.current.push(outerSprite)
      }
    }
    else if (sysType === "polymerization") {
      // Polimerlanish: A = 1 ta [Pt(NH₃)₂Cl₂]; B = 2 ta kompleks (kation+anion)
      if (isomer.formula.includes("Pt(NH₃)₂Cl₂")) {
        // Monomer — cis-[Pt(NH₃)₂Cl₂]
        const mainPos = new THREE.Vector3(offsetX, 0, 0)
        const cfg = { nh3: 2, cn: 0, cl: 2, br: 0, so4: 0, chelate: [] }
        buildComplex(group, mainPos, {
          ...isomer.cation,
          center: { center: isomer.cation.center, centerColor: isomer.cation.centerColor, centerCharge: isomer.cation.centerCharge },
          bondLength: isomer.cation.bondLength, count: 4
        }, 'cation', cfg)
        if (showLabels) {
          const sp = makeTextSprite("Monomer (n=1)", {
            fontSize: 44, color: "#ffff88",
            bgColor: "rgba(90, 70, 20, 0.85)",
            borderColor: "#ffdd66", scale: 0.42
          })
          sp.position.set(offsetX, 3, 0)
          group.add(sp); labelsRef.current.push(sp)

          const sp2 = makeTextSprite(isomer.formula, {
            fontSize: 42, color: "#ffffff",
            bgColor: "rgba(30, 50, 90, 0.85)",
            borderColor: "#88bbff", scale: 0.4
          })
          sp2.position.set(offsetX, 2.4, 0)
          group.add(sp2); labelsRef.current.push(sp2)
        }
      } else {
        // Dimer — Magnus tuzi [Pt(NH₃)₄][PtCl₄]
        const cationPos = new THREE.Vector3(offsetX, 1.8, 0)
        const anionPos = new THREE.Vector3(offsetX, -1.8, 0)

        buildComplex(group, cationPos, {
          ...isomer.cation,
          center: { center: isomer.cation.center, centerColor: isomer.cation.centerColor, centerCharge: isomer.cation.centerCharge },
          bondLength: isomer.cation.bondLength, count: 4
        }, 'cation', { nh3: 4, cn: 0, cl: 0, br: 0, so4: 0, chelate: [] })

        buildComplex(group, anionPos, {
          ...isomer.anion,
          center: { center: isomer.anion.center, centerColor: isomer.anion.centerColor, centerCharge: isomer.anion.centerCharge },
          bondLength: isomer.anion.bondLength, count: 4
        }, 'anion', { nh3: 0, cn: 0, cl: 4, br: 0, so4: 0, chelate: [] })

        // Pt···Pt bog'lanish belgisi (Magnus tuzi xarakterli xususiyati)
        createBond(group, cationPos, anionPos, CPK.highlight, 0.03, 0.4)

        if (showLabels) {
          const sp = makeTextSprite("Dimer (n=2) — Magnus tuzi", {
            fontSize: 44, color: "#ffff88",
            bgColor: "rgba(90, 70, 20, 0.85)",
            borderColor: "#ffdd66", scale: 0.42
          })
          sp.position.set(offsetX, 3.7, 0)
          group.add(sp); labelsRef.current.push(sp)

          const cationSprite = makeTextSprite(isomer.cation.formula, {
            fontSize: 40, color: "#ffffff",
            bgColor: "rgba(150, 40, 100, 0.85)",
            borderColor: "#ff88dd", scale: 0.38
          })
          cationSprite.position.set(offsetX, 3.1, 0)
          group.add(cationSprite); labelsRef.current.push(cationSprite)

          const anionSprite = makeTextSprite(isomer.anion.formula, {
            fontSize: 40, color: "#ffffff",
            bgColor: "rgba(30, 90, 140, 0.85)",
            borderColor: "#66ccff", scale: 0.38
          })
          anionSprite.position.set(offsetX, -3.6, 0)
          group.add(anionSprite); labelsRef.current.push(anionSprite)
        }
      }
    }
    else if (sysType === "ligand") {
      // Ligand izomer: bitta neytral kompleks (3 ta xelat)
      const complexPos = new THREE.Vector3(offsetX, 0, 0)
      const chelateSize = isomer.cation.chelateSize
      const cfg = {
        nh3: 0, cn: 0, cl: 0, br: 0, so4: 0,
        chelate: [chelateSize, chelateSize, chelateSize] // 3 ta xelat, oktaedrik
      }
      buildComplex(group, complexPos, {
        ...isomer.cation,
        center: { center: isomer.cation.center, centerColor: isomer.cation.centerColor, centerCharge: isomer.cation.centerCharge },
        bondLength: isomer.cation.bondLength, count: 6
      }, 'cation', cfg)

      if (showLabels) {
        const sp = makeTextSprite(isomer.cation.formula, {
          fontSize: 42, color: "#ffffff",
          bgColor: "rgba(150, 40, 100, 0.85)",
          borderColor: "#ff88dd", scale: 0.42
        })
        sp.position.set(offsetX, 3.3, 0)
        group.add(sp); labelsRef.current.push(sp)

        const sp2 = makeTextSprite(`${chelateSize}-a'zoli xelat halqa`, {
          fontSize: 38, color: "#ffff88",
          bgColor: "rgba(60, 40, 10, 0.85)",
          borderColor: "#ffdd66", scale: 0.4
        })
        sp2.position.set(offsetX, 2.7, 0)
        group.add(sp2); labelsRef.current.push(sp2)
      }
    }
  }, [system, showLabels, buildComplex, createOuterIon, createBond])

  // ═══════════════════════════════════════════════════════════
  // SCENE'ni tozalash va qayta qurish
  // ═══════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    if (leftGroupRef.current) {
      scene.remove(leftGroupRef.current)
      leftGroupRef.current.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
          else o.material.dispose()
        }
      })
    }
    if (rightGroupRef.current) {
      scene.remove(rightGroupRef.current)
      rightGroupRef.current.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
          else o.material.dispose()
        }
      })
    }

    atomsRef.current = []
    bondsRef.current = []
    labelsRef.current = []

    const leftGroup = new THREE.Group()
    const rightGroup = new THREE.Group()
    leftGroupRef.current = leftGroup
    rightGroupRef.current = rightGroup

    if (viewMode === "both") {
      buildIsomerSide(leftGroup, system.isomerA, -4)
      buildIsomerSide(rightGroup, system.isomerB, 4)
    } else if (viewMode === "A") {
      buildIsomerSide(leftGroup, system.isomerA, 0)
    } else if (viewMode === "B") {
      buildIsomerSide(rightGroup, system.isomerB, 0)
    }

    scene.add(leftGroup)
    scene.add(rightGroup)

    // Almashish belgisi (⇌)
    if (viewMode === "both") {
      const swap = makeTextSprite("⇌", {
        fontSize: 96, color: "#FFD700",
        bgColor: "rgba(60, 40, 5, 0.9)",
        borderColor: "#FFD700", scale: 0.65
      })
      swap.position.set(0, 0, 0)
      scene.add(swap)
      labelsRef.current.push(swap)

      // "Ligandlar almashinuvi" belgisi
      const info = makeTextSprite("Ligandlar almashinishi", {
        fontSize: 36, color: "#ffcc66",
        bgColor: "rgba(50, 30, 10, 0.85)",
        borderColor: "#ffcc66", scale: 0.35
      })
      info.position.set(0, 0.9, 0)
      scene.add(info)
      labelsRef.current.push(info)
    }
  }, [system, viewMode, buildIsomerSide])

  // ═══════════════════════════════════════════════════════════
  // THREE.JS SETUP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Fon
    const bgGeo = new THREE.SphereGeometry(50, 32, 32)
    const bgMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        color1: { value: new THREE.Color(0x0a0520) },
        color2: { value: new THREE.Color(0x1a0f38) }
      },
      vertexShader: `varying vec3 vWorldPosition;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `uniform vec3 color1; uniform vec3 color2;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y * 0.5 + 0.5;
          gl_FragColor = vec4(mix(color1, color2, h), 1.0);
        }`
    })
    scene.add(new THREE.Mesh(bgGeo, bgMat))

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 4, 13)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0520, 1)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 5
    controls.maxDistance = 28
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.6
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(6, 8, 6); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88aaff, 0.5); l2.position.set(-5, -3, -4); scene.add(l2)
    const l3 = new THREE.PointLight(0xffaadd, 0.6, 30); l3.position.set(0, 6, 0); scene.add(l3)

    // Yulduzlar
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(700 * 3)
    for (let i = 0; i < 700 * 3; i += 3) {
      const r = 20 + Math.random() * 15
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      sp[i] = r * Math.sin(ph) * Math.cos(th)
      sp[i + 1] = r * Math.sin(ph) * Math.sin(th)
      sp[i + 2] = r * Math.cos(ph)
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.06, transparent: true, opacity: 0.6, sizeAttenuation: true
    })))

    // Raycaster
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(atomsRef.current, false)
      if (intersects.length > 0) {
        const obj = intersects[0].object
        if (obj.userData && obj.userData.type === 'atom') {
          setSelectedAtom(obj.userData)
        }
      } else {
        setSelectedAtom(null)
      }
    }
    renderer.domElement.addEventListener('click', onClick)

    // Animatsiya
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      controls.update()

      // Ligand almashinuv animatsiyasi — chap va o'ng gruppalarni bir-biriga yaqinlashtirish
      if (swapAnimRef.current.active) {
        swapAnimRef.current.progress += 0.008
        const p = swapAnimRef.current.progress
        const wave = Math.sin(p * Math.PI * 2) * 0.5
        if (leftGroupRef.current) {
          leftGroupRef.current.position.x = wave * 0.8
          leftGroupRef.current.rotation.y = wave * 0.15
        }
        if (rightGroupRef.current) {
          rightGroupRef.current.position.x = -wave * 0.8
          rightGroupRef.current.rotation.y = -wave * 0.15
        }
        if (p >= 2) {
          swapAnimRef.current.progress = 0
        }
      } else {
        if (leftGroupRef.current) { leftGroupRef.current.position.x = 0; leftGroupRef.current.rotation.y = 0 }
        if (rightGroupRef.current) { rightGroupRef.current.position.x = 0; rightGroupRef.current.rotation.y = 0 }
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    setTimeout(() => setLoading(false), 400)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener('click', onClick)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { rebuildScene() }, [rebuildScene])
  useEffect(() => { if (controlsRef.current) controlsRef.current.autoRotate = autoRotate }, [autoRotate])
  useEffect(() => { swapAnimRef.current.active = runSwapAnimation; if (runSwapAnimation) swapAnimRef.current.progress = 0 }, [runSwapAnimation])

  // ═══════════════════════════════════════════════════════════
  // PDF GENERATSIYA
  // ═══════════════════════════════════════════════════════════
  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      let regularFont, boldFont, italicFont
      try {
        const [rBytes, bBytes, iBytes] = await Promise.all([
          fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular"); return r.arrayBuffer() }),
          fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold"); return r.arrayBuffer() }),
          fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic"); return r.arrayBuffer() })
        ])
        regularFont = await pdfDoc.embedFont(rBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(bBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(iBytes, { subset: true })
      } catch (e) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false); return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98), purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), red: rgb(0.80, 0.20, 0.20),
        green: rgb(0.08, 0.55, 0.31), blue: rgb(0.08, 0.31, 0.75),
        yellow: rgb(0.75, 0.60, 0.10), cyan: rgb(0.15, 0.55, 0.75),
        pink: rgb(0.85, 0.35, 0.60),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.90), bgRed: rgb(1.0, 0.94, 0.94),
        bgPink: rgb(1.0, 0.95, 0.98), bgCyan: rgb(0.92, 0.98, 1.0),
        white: rgb(1, 1, 1)
      }

      const PAGE_W = 595.28, PAGE_H = 841.89
      const MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      const measure = (t, f, s) => f.widthOfTextAtSize(String(t), s)
      const truncate = (t, f, s, w) => {
        const str = String(t)
        if (measure(str, f, s) <= w) return str
        let lo = 0, hi = str.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(str.slice(0, mid) + "…", f, s) <= w) lo = mid
          else hi = mid - 1
        }
        return str.slice(0, lo) + "…"
      }
      const wrapText = (t, f, s, w) => {
        if (!t) return [""]
        const words = String(t).split(/\s+/)
        const lines = []
        let cur = ""
        for (const wd of words) {
          const test = cur ? cur + " " + wd : wd
          if (measure(test, f, s) > w && cur) { lines.push(cur); cur = wd }
          else cur = test
          if (measure(cur, f, s) > w) {
            let piece = ""
            for (const ch of cur) {
              if (measure(piece + ch, f, s) > w) { lines.push(piece); piece = ch }
              else piece += ch
            }
            cur = piece
          }
        }
        if (cur) lines.push(cur)
        return lines
      }

      const addFooter = () => {
        const left = truncate(
          `Formal izomeriyasi 3D Lab  •  ${cleanText(system.empiricalFormula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(left, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pStr = `${pageNum}`
        const w = measure(pStr, regularFont, 8)
        page.drawText(pStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine
        })
      }
      const addNewPage = () => { addFooter(); page = pdfDoc.addPage([PAGE_W, PAGE_H]); pageNum++; y = PAGE_H - MARGIN }
      const checkBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }

      const drawSectionHeader = (num, title) => {
        checkBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple })
        page.drawText(`${num}.`, { x: MARGIN + 10, y: y - 14, size: 14, font: boldFont, color: C.purple })
        page.drawText(title, { x: MARGIN + 30, y: y - 14, size: 14, font: boldFont, color: C.textDark })
        y -= 30
      }

      const drawParagraph = (text, opts = {}) => {
        const { size = 10, font = regularFont, color = C.textDark, indent = 0 } = opts
        const lines = wrapText(cleanText(text), font, size, CONTENT_W - indent)
        for (const line of lines) {
          checkBreak(size + 4)
          page.drawText(line, { x: MARGIN + indent, y, size, font, color })
          y -= size + 4
        }
        y -= 4
      }

      const drawBulletPoint = (text, color = C.purple) => {
        const size = 10, indent = 20
        checkBreak(size + 6)
        page.drawCircle({ x: MARGIN + 7, y: y - 3, size: 2, color })
        const lines = wrapText(cleanText(text), regularFont, size, CONTENT_W - indent)
        lines.forEach((line, i) => {
          if (i > 0) checkBreak(size + 3)
          page.drawText(line, { x: MARGIN + indent, y, size, font: regularFont, color: C.textDark })
          y -= size + 3
        })
        y -= 2
      }

      const drawInfoBox = (title, body, bgColor, borderColor) => {
        const size = 10, titleSize = 11, pad = 10
        const bodyLines = wrapText(cleanText(body), regularFont, size, CONTENT_W - 2 * pad)
        const boxH = titleSize + 8 + bodyLines.length * (size + 3) + 2 * pad
        checkBreak(boxH + 8)
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH, color: bgColor })
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: 3, height: boxH, color: borderColor })
        page.drawText(cleanText(title), { x: MARGIN + pad, y: y - pad - titleSize + 4, size: titleSize, font: boldFont, color: borderColor })
        let by = y - pad - titleSize - 8
        bodyLines.forEach(line => {
          page.drawText(line, { x: MARGIN + pad, y: by, size, font: regularFont, color: C.textDark })
          by -= size + 3
        })
        y -= boxH + 10
      }

      // ═══════════════════════════════════════════════════════
      // MUQOVA
      // ═══════════════════════════════════════════════════════
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })

      const title = "FORMAL IZOMERIYASI"
      const tW = measure(title, boldFont, 26)
      page.drawText(title, { x: (PAGE_W - tW) / 2, y: PAGE_H - 88, size: 26, font: boldFont, color: C.white })

      const subtitle = "Struktur izomeriya — atomlar taqsimlanishida farq"
      const sW = measure(subtitle, italicFont, 12)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 113, size: 12, font: italicFont, color: C.purpleLight })

      const formulaText = `${cleanText(system.isomerA.formula)}  ⇌  ${cleanText(system.isomerB.formula)}`
      const fW = measure(formulaText, boldFont, 14)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 155, size: 14, font: boldFont, color: C.white })

      y = PAGE_H - 240
      drawInfoBox("Tanlangan tizim", `${system.title} — ${system.typeName}`, C.bgPurple, C.purple)

      const meta = [
        ["Izomer turi:", system.typeName],
        ["Empirik formula:", system.empiricalFormula],
        ["Asosiy prinsip:", system.keyPrinciple],
      ]
      meta.forEach(([k, v]) => {
        checkBreak(20)
        page.drawText(cleanText(k), { x: MARGIN + 10, y, size: 10.5, font: boldFont, color: C.purple })
        const wrapped = wrapText(cleanText(v), regularFont, 10.5, CONTENT_W - 170)
        wrapped.forEach((ln, li) => {
          if (li > 0) checkBreak(15)
          page.drawText(ln, { x: MARGIN + 160, y, size: 10.5, font: regularFont, color: C.textDark })
          y -= 15
        })
      })
      y -= 12

      // ── 1. Kirish ──
      if (pdfSections.intro) {
        drawSectionHeader(1, "Kirish — Formal izomeriya nima?")
        drawParagraph(
          "Formal izomeriya (struktur yoki konstitutsiyaviy izomeriya) — bir xil molekulyar formulaga ega bo'lgan koordinatsion birikmalarning atomlar va ligandlarning fazoviy joylashuvida (atomlar orasidagi bog'lanish tartibida) turlicha bo'lish hodisasidir. Bu — stereoizomeriyadan (fazoviy izomeriya) farq qiladi: stereoizomerlarda atomlar joylashuvi bir xil, faqat orientatsiyasi turli xil bo'ladi."
        )
        drawParagraph("Formal izomeriya quyidagi asosiy sinflarga bo'linadi:")
        drawBulletPoint("Koordinatsion izomeriya — ligandlar ikkita kompleks (kation va anion) orasida qayta taqsimlanadi.")
        drawBulletPoint("Ionizatsion izomeriya — ichki va tashqi sfera orasida anionlar almashinadi.")
        drawBulletPoint("Gidrat izomeriya — H₂O ichki yoki tashqi sferada.")
        drawBulletPoint("Bog'lanish izomeriya — ambidentat ligand turli donor atom orqali bog'lanadi.")
        drawBulletPoint("Ligand izomeriya — ligandning o'zi izomer shakllarda mavjud.")
        drawBulletPoint("Polimerlanish izomeriya — empirik formula bir xil, ammo molekulyar massa turli.")
      }

      // ── 2. Izomer turlari batafsil ──
      if (pdfSections.types) {
        drawSectionHeader(2, `${system.typeName} — batafsil tahlil`)
        drawInfoBox(system.typeName, system.description, C.bgYellow, C.yellow)

        drawInfoBox(
          `A-izomer: ${cleanText(system.isomerA.formula)}`,
          `${system.isomerA.name}. Rang: ${system.isomerA.color}.`,
          C.bgGreen, C.green
        )
        drawInfoBox(
          `B-izomer: ${cleanText(system.isomerB.formula)}`,
          `${system.isomerB.name}. Rang: ${system.isomerB.color}.`,
          C.bgRed, C.red
        )
        drawParagraph(
          "Asosiy prinsip: " + system.keyPrinciple
        )
      }

      // ── 3. Struktur tahlil ──
      if (pdfSections.structure) {
        drawSectionHeader(3, "Fazoviy tuzilish va koordinatsion parametrlar")
        // A izomer
        if (system.isomerA.cation) {
          drawInfoBox(
            `A: Kation ${cleanText(system.isomerA.cation.formula)}`,
            `Markaziy metall: ${system.isomerA.cation.center}(${system.isomerA.cation.centerCharge || ''}). ` +
            `Ligand: ${system.isomerA.cation.ligand}. Bog' uzunligi: ${system.isomerA.cation.bondLength} Å. Gibridlanish: ${system.isomerA.cation.centerHyb || 'd²sp³'}.`,
            C.bgPurple, C.purple
          )
        }
        if (system.isomerA.anion) {
          drawInfoBox(
            `A: Anion ${cleanText(system.isomerA.anion.formula)}`,
            `Markaziy metall: ${system.isomerA.anion.center}(${system.isomerA.anion.centerCharge || ''}). ` +
            `Ligand: ${system.isomerA.anion.ligand}. Bog' uzunligi: ${system.isomerA.anion.bondLength} Å. Gibridlanish: ${system.isomerA.anion.centerHyb || 'd²sp³'}.`,
            C.bgCyan, C.cyan
          )
        }
        // B izomer
        if (system.isomerB.cation) {
          drawInfoBox(
            `B: Kation ${cleanText(system.isomerB.cation.formula)}`,
            `Markaziy metall: ${system.isomerB.cation.center}(${system.isomerB.cation.centerCharge || ''}). ` +
            `Ligand: ${system.isomerB.cation.ligand}. Bog' uzunligi: ${system.isomerB.cation.bondLength} Å.`,
            C.bgPink, C.pink
          )
        }
        if (system.isomerB.anion) {
          drawInfoBox(
            `B: Anion ${cleanText(system.isomerB.anion.formula)}`,
            `Markaziy metall: ${system.isomerB.anion.center}(${system.isomerB.anion.centerCharge || ''}). ` +
            `Ligand: ${system.isomerB.anion.ligand}. Bog' uzunligi: ${system.isomerB.anion.bondLength} Å.`,
            C.bgOrange, C.orange
          )
        }
      }

      // ── 4. Eksperimental farqlash ──
      if (pdfSections.experiment) {
        drawSectionHeader(4, "Eksperimental farqlash usullari")
        drawParagraph(system.experiment)
        if (system.type === "ionization") {
          drawInfoBox(
            "A-izomer AgNO₃ testi",
            system.isomerA.agNO3Test || "N/A",
            C.bgYellow, C.yellow
          )
          drawInfoBox(
            "A-izomer BaCl₂ testi",
            system.isomerA.baCl2Test || "N/A",
            C.bgBlue, C.blue
          )
          drawInfoBox(
            "B-izomer AgNO₃ testi",
            system.isomerB.agNO3Test || "N/A",
            C.bgYellow, C.yellow
          )
          drawInfoBox(
            "B-izomer BaCl₂ testi",
            system.isomerB.baCl2Test || "N/A",
            C.bgBlue, C.blue
          )
        }
        drawParagraph(
          "Umumiy analitik usullar: UV-Vis spektrоskopiya (yutilish polosalarining farqi), IR spektroskopiya (ligand tebranishlari), konduktometriya (elektrolit turi), mass-spektrometriya (molekulyar massa), rentgen difraksiya (fazoviy tuzilish)."
        )
      }

      // ── 5. HSAB va tanlanish ──
      if (pdfSections.hsab) {
        drawSectionHeader(5, "HSAB va termodinamik afzallik")
        drawInfoBox(
          "Pearson HSAB nazariyasi",
          "Qattiq kislotalar qattiq asoslar bilan, yumshoq kislotalar yumshoq asoslar bilan tanlab bog'lanadi. Bu koordinatsion izomerlarda ligand taqsimlanishini bashorat qiladi.",
          C.bgOrange, C.orange
        )
        drawInfoBox(
          `Barqarorlik tahlili`,
          system.stability || "Ma'lumot mavjud emas",
          C.bgYellow, C.yellow
        )
      }

      // ── 6. Magnit xossalari ──
      if (pdfSections.magnetic) {
        drawSectionHeader(6, "Magnit xossalari va d-elektronlar konfiguratsiyasi")
        drawInfoBox(
          "Magnit xarakteri",
          system.magneticProp || "Ma'lumot mavjud emas",
          C.bgBlue, C.blue
        )
        drawParagraph(
          "Magnit qabuliyat o'lchamlari (Gouy metodi, SQUID magnetometriya) izomerlarni farqlashda muhim vosita. Kation va anion turli spin holatida bo'lishi mumkin — bu qattiq maydonlar farqidan kelib chiqadi (masalan, CN⁻ kuchli maydon, NH₃ o'rta, Cl⁻ zaif)."
        )
      }

      // ── 7. Tarixiy nuqta ──
      if (pdfSections.history) {
        drawSectionHeader(7, "Kashfiyot va tarixiy ma'lumot")
        drawParagraph(system.discovery)
        drawInfoBox(
          "Werner koordinatsion nazariyasi",
          "Alfred Werner (1866-1919) 1893-yildan boshlab koordinatsion birikmalarning tuzilish nazariyasini rivojlantirdi. U 'ichki sfera' va 'tashqi sfera' tushunchalarini kiritdi, koordinatsion izomeriyani sistematik ravishda tavsiflagan birinchi olim edi. 1913-yilda Nobel mukofoti oldi — noorganik kimyoda birinchi Nobel.",
          C.bgPurple, C.purple
        )
        if (system.type === "polymerization") {
          drawInfoBox(
            "Magnus tuzi tarixi (1828)",
            "Heinrich Gustav Magnus Berlin universitetida 20 yoshida bu birikmani birinchi bor sintez qilgan. XX asrda uning strukturasi rentgen difraksiyasi bilan aniqlangan — Pt···Pt zanjir tuzilishi (3.24 Å oralig'i) kashf etildi. Bu birikma zamonaviy 1D molekulyar o'tkazgichlarning kashfiyoti uchun ilhom bo'ldi.",
            C.bgGreen, C.green
          )
        }
      }

      // ── 8. Solishtirish jadvali ──
      if (pdfSections.table) {
        drawSectionHeader(8, "A/B izomerlarning solishtirish jadvali")
        const rows = [
          ["Xususiyat", "A-izomer", "B-izomer"],
          ["Formula", cleanText(system.isomerA.formula), cleanText(system.isomerB.formula)],
          ["Nomi", cleanText(system.isomerA.name).slice(0, 40), cleanText(system.isomerB.name).slice(0, 40)],
          ["Rang", system.isomerA.color, system.isomerB.color]
        ]
        if (system.isomerA.cation && system.isomerB.cation) {
          rows.push(["Kation metalli", `${system.isomerA.cation.center}(${system.isomerA.cation.centerCharge || ''})`, `${system.isomerB.cation.center}(${system.isomerB.cation.centerCharge || ''})`])
          rows.push(["Kation ligandi", system.isomerA.cation.ligand, system.isomerB.cation.ligand])
        }
        if (system.isomerA.anion && system.isomerB.anion) {
          rows.push(["Anion metalli", `${system.isomerA.anion.center}(${system.isomerA.anion.centerCharge || ''})`, `${system.isomerB.anion.center}(${system.isomerB.anion.centerCharge || ''})`])
          rows.push(["Anion ligandi", system.isomerA.anion.ligand, system.isomerB.anion.ligand])
        }

        const colW = [CONTENT_W * 0.28, CONTENT_W * 0.36, CONTENT_W * 0.36]
        const rowH = 26
        checkBreak(rows.length * rowH + 10)
        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          } else if (ri % 2 === 0) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          }
          let cx = MARGIN + 6
          row.forEach((cell, ci) => {
            const font = isHeader ? boldFont : regularFont
            const fs = isHeader ? 9 : 8.5
            const txt = truncate(cleanText(cell), font, fs, colW[ci] - 12)
            page.drawText(txt, {
              x: cx, y: y - rowH + 9, size: fs, font,
              color: isHeader ? C.white : C.textDark
            })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 10
      }

      // ── 9. Adabiyotlar ──
      if (pdfSections.references) {
        drawSectionHeader(9, "Adabiyotlar")
        const refs = [
          "Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Zeitschrift für Anorganische Chemie, 3(1), 267–330.",
          "Werner, A., Miolati, A. (1893-1894). Beiträge zur Konstitution anorganischer Verbindungen. Zeitschrift für Physikalische Chemie, 12, 35 (koordinatsion izomerlar).",
          "Magnus, H.G. (1828). Ueber einige neue Verbindungen des Platinchlorürs. Poggendorff's Annalen der Physik und Chemie, 14, 239–242.",
          "Pearson, R.G. (1963). Hard and Soft Acids and Bases. Journal of the American Chemical Society, 85(22), 3533–3539.",
          "Housecroft, C.E., Sharpe, A.G. (2018). Inorganic Chemistry (5th ed.). Pearson. Chapter 20 — d-block Metal Chemistry, Isomerism.",
          "Miessler, G.L., Fischer, P.J., Tarr, D.A. (2014). Inorganic Chemistry (5th ed.). Pearson. Chapter 9 — Coordination Compounds.",
          "Cotton, F.A., Wilkinson, G., Murillo, C.A., Bochmann, M. (1999). Advanced Inorganic Chemistry (6th ed.). Wiley-Interscience.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — Recommendations 2005. RSC Publishing.",
          "Kauffman, G.B. (1966). Alfred Werner: Founder of Coordination Chemistry. Springer-Verlag Berlin Heidelberg.",
          "Cesari, C., et al. (2021). Polymerization Isomerism in Co-M (M = Cu, Ag, Au) Carbonyl Clusters. Chemistry - A European Journal, 27, 5449."
        ]
        refs.forEach((r, i) => {
          const size = 8.5
          const lines = wrapText(r, regularFont, size, CONTENT_W - 20)
          lines.forEach((ln, li) => {
            checkBreak(size + 3)
            const prefix = li === 0 ? `[${i + 1}]` : ""
            if (prefix) page.drawText(prefix, { x: MARGIN, y, size, font: boldFont, color: C.purple })
            page.drawText(ln, { x: MARGIN + 20, y, size, font: regularFont, color: C.textDark })
            y -= size + 3
          })
          y -= 3
        })
      }

      addFooter()

      pdfDoc.setTitle(`Formal izomeriyasi — ${cleanText(system.empiricalFormula)}`)
      pdfDoc.setSubject("Koordinatsion birikmalarning formal (struktur) izomeriyasi")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["formal izomeriya", "koordinatsion izomeriya", "ionizatsion", "polimerlanish"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `formal-izomeriya-${system.id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">

      {/* HEADER */}
      {!fullscreenMode && (
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/oquv/izomeriyasi/tuzilish/formal"
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-fuchsia-300 flex items-center gap-2 truncate">
              <span>🔮</span>
              <span className="hidden sm:inline">Formal izomeriyasi — 3D Laboratoriya</span>
              <span className="sm:hidden">Formal 3D</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">
              {system.empiricalFormula} • {system.typeName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select
            value={currentSystem}
            onChange={(e) => setCurrentSystem(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[280px]"
          >
            <option value="CoCrCyanoAmine">[Co][Cr] — Koordinatsion (CN/NH₃)</option>
            <option value="CuPtSquare">[Cu][Pt] — Koordinatsion (kvadrat)</option>
            <option value="CoSO4Br">[Co(NH₃)₅Br]SO₄ — Ionizatsion</option>
            <option value="PtPolymerization">Pt — Polimerlanish (Magnus tuzi)</option>
            <option value="LigandIsomer">[Co(pn)₃]³⁺ — Ligand izomer</option>
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Avtomatik aylantirish"
          >🔄</button>

          <button
            onClick={() => togglePanel("info")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Ma'lumot paneli"
          >ℹ️</button>

          <button
            onClick={() => togglePanel("types")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "types" ? 'bg-fuchsia-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Barcha formal izomeriya turlari"
          >📚</button>

          {system.type === "ionization" && (
            <button
              onClick={() => togglePanel("experiment")}
              className={`p-2 rounded-lg transition-all text-sm ${activePanel === "experiment" ? 'bg-yellow-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
              title="Analitik tajribalar (AgNO₃, BaCl₂)"
            >🧪</button>
          )}

          <button
            onClick={() => togglePanel("hsab")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "hsab" ? 'bg-orange-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="HSAB va barqarorlik"
          >⚖️</button>

          <button
            onClick={() => togglePanel("compare")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "compare" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Solishtirish jadvali"
          >📊</button>

          <button
            onClick={() => togglePanel("history")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "history" ? 'bg-amber-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Tarixiy ma'lumot"
          >📜</button>

          <button
            onClick={() => togglePanel("test")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "test" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Test"
          >🧠</button>

          <button
            onClick={() => setPdfModalOpen(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="PDF eksport"
          >📄</button>

          <button
            onClick={() => setFullscreenMode(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="To'liq ekran"
          >🖥️</button>
        </div>
      </header>
      )}

      {fullscreenMode && (
        <button
          onClick={() => setFullscreenMode(false)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/70 backdrop-blur-md text-white hover:bg-purple-700/80 transition-all shadow-2xl border border-purple-500/40"
          title="Fullscreen rejimidan chiqish"
        >
          <span className="text-lg">✕</span>
        </button>
      )}

      {/* ASOSIY SCENE */}
      <div className="flex-1 flex flex-row relative overflow-hidden">

        {/* CHAP — Boshqaruv paneli */}
        {!fullscreenMode && (
        <div
          ref={panelRef}
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[285px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
        >
          <div
            onMouseDown={(e) => { if (e.button !== 0) return; e.preventDefault(); handlePanelDragStart(e.clientX, e.clientY) }}
            onTouchStart={(e) => { if (e.touches.length > 0) handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY) }}
            className={`flex items-center justify-between px-3 py-2 border-b border-purple-700/40 rounded-t-xl ${isPanelDragging ? 'cursor-grabbing bg-purple-800/60' : 'cursor-grab bg-purple-900/40 hover:bg-purple-800/50'} transition-colors select-none touch-none`}
            title="Ushlab siljiting"
          >
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-400">⋮⋮</span>
              <span>🎛️</span> Boshqaruv paneli
            </h3>
            <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
          </div>
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1">

            {/* — TIP KATEGORIYASI — */}
            <div
              className="mb-3 p-2.5 rounded-lg border-l-4"
              style={{
                backgroundColor: `${system.isomerA.colorHex}22`,
                borderLeftColor: system.isomerA.colorHex
              }}
            >
              <div className="text-[10px] text-purple-300 uppercase tracking-wide mb-1">Izomeriya turi</div>
              <div className="text-sm text-white font-bold">{system.typeName}</div>
              <div className="text-[10px] text-purple-200 italic mt-1">{system.title}</div>
            </div>

            {/* — KO'RINISH — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>👁️</span> Ko'rinish</span>
              <span>{expandedSection === "view" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "view" && (
              <div className="space-y-2 mb-3 px-1">
                <div className="text-[11px] text-purple-400 mb-1">Rejim:</div>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => setViewMode("both")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "both" ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>Ikkalasi</button>
                  <button onClick={() => setViewMode("A")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "A" ? 'bg-green-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>A shakl</button>
                  <button onClick={() => setViewMode("B")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "B" ? 'bg-red-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>B shakl</button>
                </div>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Yorliqlar</span>
                  <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Vodorodlar (H)</span>
                  <input type="checkbox" checked={showHydrogens} onChange={(e) => setShowHydrogens(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Kation/Anion rang gale</span>
                  <input type="checkbox" checked={showCationAnionColor} onChange={(e) => setShowCationAnionColor(e.target.checked)} className="accent-pink-500" />
                </label>
              </div>
            )}

            {/* — ANIMATSIYA — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "anim" ? null : "anim")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>🎬</span> Animatsiya</span>
              <span>{expandedSection === "anim" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "anim" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setRunSwapAnimation(!runSwapAnimation)}
                  className={`w-full text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-all ${runSwapAnimation ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}
                >
                  <span className="flex items-center gap-2"><span>🔀</span> Ligandlar almashinuvi</span>
                  <span>{runSwapAnimation ? "⏸" : "▶"}</span>
                </button>
                <p className="text-[10px] text-purple-400 italic px-1">
                  Ikkala izomer bir-biriga qanday transformlanishi mumkinligini vizual ko'rsatadi (nazariy modelling).
                </p>
              </div>
            )}

            {/* — TARKIB HISOBI — */}
            <div className="bg-gradient-to-r from-pink-900/30 to-blue-900/30 rounded-lg p-2.5 border border-purple-700/40 mb-2">
              <div className="text-[10px] text-purple-300 mb-1.5 uppercase tracking-wide">🔬 Formula tarkibi</div>
              <div className="space-y-1.5 text-[10px]">
                <div className="bg-pink-900/30 rounded p-1.5 border border-pink-700/30">
                  <div className="text-pink-300 font-bold text-[9px] uppercase">A izomer</div>
                  <div className="text-pink-100 mt-0.5 font-mono">{system.isomerA.formula}</div>
                  <div className="text-pink-200 text-[9px] italic">{system.isomerA.color}</div>
                </div>
                <div className="bg-blue-900/30 rounded p-1.5 border border-blue-700/30">
                  <div className="text-blue-300 font-bold text-[9px] uppercase">B izomer</div>
                  <div className="text-blue-100 mt-0.5 font-mono">{system.isomerB.formula}</div>
                  <div className="text-blue-200 text-[9px] italic">{system.isomerB.color}</div>
                </div>
              </div>
            </div>

            {/* — EKSPORT — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "export" ? null : "export")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>📤</span> Eksport</span>
              <span>{expandedSection === "export" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "export" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="w-full text-xs px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all"
                >📄 PDF hisobot yaratish</button>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-purple-800/40">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💡 Maslahat</div>
              <p className="text-[10px] text-purple-400 leading-relaxed">
                <span className="text-pink-400">Pushti gale</span> — kation kompleks.
                <span className="text-blue-400"> Ko'k gale</span> — anion kompleks.
                🔀 tugmasi ligandlar orasidagi almashinuvni ko'rsatadi.
                📚 tugmasi barcha formal izomeriya turlarini tushuntiradi.
              </p>
            </div>
          </div>
        </div>
        )}

        {/* 3D Container */}
        <div ref={containerRef} className="flex-1 w-full relative" />

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-fuchsia-400 mx-auto"></div>
              <p className="mt-4 text-fuchsia-300 text-sm">3D sahna yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Tanlangan atom */}
        {selectedAtom && !fullscreenMode && (
          <div className="absolute bottom-4 right-4 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-purple-200 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: selectedAtom.info?.color || '#888' }}></span>
                {selectedAtom.info?.name || selectedAtom.element}
              </h4>
              <button onClick={() => setSelectedAtom(null)} className="text-purple-400 hover:text-purple-200 text-lg leading-none">×</button>
            </div>
            <div className="space-y-1 text-xs text-purple-300">
              {selectedAtom.info?.atomic && <div><span className="text-purple-500">Atom raqami:</span> {selectedAtom.info.atomic}</div>}
              {selectedAtom.info?.mass && <div><span className="text-purple-500">Atom massasi:</span> {selectedAtom.info.mass}</div>}
              {selectedAtom.info?.config && <div><span className="text-purple-500">Konfiguratsiya:</span> <span className="font-mono">{selectedAtom.info.config}</span></div>}
              {selectedAtom.info?.role && <div><span className="text-purple-500">Roli:</span> {selectedAtom.info.role}</div>}
              {selectedAtom.info?.hybridization && <div><span className="text-purple-500">Gibridlanish:</span> {selectedAtom.info.hybridization}</div>}
              {selectedAtom.ligandName && <div><span className="text-purple-500">Ligand:</span> <span className="text-cyan-300">{selectedAtom.ligandName}</span></div>}
              {selectedAtom.sphere === 'inner' && <div className="mt-2 text-green-400 font-bold">💎 Ichki koordinatsion sferada</div>}
              {selectedAtom.sphere === 'outer' && <div className="mt-2 text-red-400 font-bold">🔴 Tashqi ionli sferada</div>}
              {selectedAtom.isDonor && <div className="text-yellow-400 font-bold">⚡ Donor atomi</div>}
              {selectedAtom.isCenter && <div className="mt-2 text-pink-400 font-bold">🌟 Markaziy metall</div>}
            </div>
          </div>
        )}

        {/* — MA'LUMOT PANELI — */}
        {activePanel === "info" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-sm w-[340px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>ℹ️</span> {system.title}
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-fuchsia-900/40 rounded-lg p-3 border border-fuchsia-700/40">
                <div className="text-fuchsia-300 text-[10px] uppercase tracking-wide mb-1 font-bold">Izomer turi</div>
                <div className="text-white text-sm">{system.typeName}</div>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Empirik formula</div>
                <div className="font-mono text-lg text-white text-center">{system.empiricalFormula}</div>
              </div>

              <div
                className="rounded-lg p-3 border-2"
                style={{
                  backgroundColor: `${system.isomerA.colorHex}22`,
                  borderColor: system.isomerA.colorHex
                }}
              >
                <div className="text-[10px] uppercase tracking-wide mb-1 font-bold" style={{ color: system.isomerA.colorHex }}>
                  A izomer
                </div>
                <div className="font-mono text-sm text-white">{system.isomerA.formula}</div>
                <div className="text-[10px] text-purple-200 mt-1 italic">{system.isomerA.name}</div>
                <div className="text-[10px] mt-1" style={{ color: system.isomerA.colorHex }}>
                  🎨 {system.isomerA.color}
                </div>
              </div>

              <div
                className="rounded-lg p-3 border-2"
                style={{
                  backgroundColor: `${system.isomerB.colorHex}22`,
                  borderColor: system.isomerB.colorHex
                }}
              >
                <div className="text-[10px] uppercase tracking-wide mb-1 font-bold" style={{ color: system.isomerB.colorHex }}>
                  B izomer
                </div>
                <div className="font-mono text-sm text-white">{system.isomerB.formula}</div>
                <div className="text-[10px] text-purple-200 mt-1 italic">{system.isomerB.name}</div>
                <div className="text-[10px] mt-1" style={{ color: system.isomerB.colorHex }}>
                  🎨 {system.isomerB.color}
                </div>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 text-[10px] uppercase tracking-wide mb-1 font-bold">🎯 Asosiy prinsip</div>
                <div className="text-yellow-100 text-[11px] leading-relaxed">{system.keyPrinciple}</div>
              </div>

              {system.specialNote && (
                <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                  <div className="text-cyan-300 text-[10px] uppercase tracking-wide mb-1 font-bold">🌟 Maxsus e'tibor</div>
                  <div className="text-cyan-100 text-[10px] leading-relaxed">{system.specialNote}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* — TURLARI PANELI — */}
        {activePanel === "types" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-fuchsia-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-fuchsia-200 flex items-center gap-2 text-sm">
                <span>📚</span> Formal izomeriya turlari
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-fuchsia-950/40 rounded-lg p-3 border border-fuchsia-700/40">
                <p className="text-fuchsia-100 text-[11px] leading-relaxed">
                  <strong>Formal (struktur) izomeriya</strong> — bir xil molekulyar formulaga ega, ammo atomlarning fazoviy joylashuvi va bog'lanish tartibi turli xil bo'lgan izomerlar. Bu — stereoizomerdan farq qiladi.
                </p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1">1️⃣ Koordinatsion izomeriya</div>
                <p className="text-purple-100 text-[10px] leading-relaxed">
                  Kation va anion kompleks o'rtasida ligandlar taqsimlanishida farq. Misol: <span className="font-mono">[Co(NH₃)₆][Cr(CN)₆]</span> ⇌ <span className="font-mono">[Cr(NH₃)₆][Co(CN)₆]</span>
                </p>
              </div>

              <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">2️⃣ Ionizatsion izomeriya</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">
                  Anionlarning ichki (koordinatsion) va tashqi (ionli) sferada joylashuvi farqi. Misol: <span className="font-mono">[Co(NH₃)₅Br]SO₄</span> ⇌ <span className="font-mono">[Co(NH₃)₅SO₄]Br</span>
                </p>
              </div>

              <div className="bg-cyan-900/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 font-bold text-[11px] mb-1">3️⃣ Gidrat izomeriya (solvat)</div>
                <p className="text-cyan-100 text-[10px] leading-relaxed">
                  Suv molekulasining ichki koordinatsion sferada yoki tashqi kristall sferasidagi holati. Alohida sahifada batafsil o'rgangansiz.
                </p>
              </div>

              <div className="bg-pink-900/40 rounded-lg p-3 border border-pink-700/40">
                <div className="text-pink-300 font-bold text-[11px] mb-1">4️⃣ Bog'lanish izomeriya</div>
                <p className="text-pink-100 text-[10px] leading-relaxed">
                  Ambidentat ligandning turli donor atom orqali bog'lanishi. Alohida sahifada o'rgangansiz (nitro/nitrito, SCN/NCS).
                </p>
              </div>

              <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-1">5️⃣ Ligand izomeriya</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">
                  Ligandning o'zi turli izomer shakllarda mavjud. Misol: 1,2-propilendiamin (5-a'zoli xelat) va 1,3-propilendiamin (6-a'zoli xelat).
                </p>
              </div>

              <div className="bg-green-900/40 rounded-lg p-3 border border-green-700/40">
                <div className="text-green-300 font-bold text-[11px] mb-1">6️⃣ Polimerlanish izomeriya</div>
                <p className="text-green-100 text-[10px] leading-relaxed">
                  Bir xil empirik formula, lekin turli molekulyar massa. Misol: <span className="font-mono">[Pt(NH₃)₂Cl₂]</span> (monomer) ⇌ <span className="font-mono">[Pt(NH₃)₄][PtCl₄]</span> (dimer, Magnus tuzi).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — TAJRIBA PANELI (AgNO₃/BaCl₂) — */}
        {activePanel === "experiment" && !fullscreenMode && system.type === "ionization" && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-yellow-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-yellow-200 flex items-center gap-2 text-sm">
                <span>🧪</span> AgNO₃ va BaCl₂ tajribalari
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-2">📖 Analitik farqlash</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">
                  Ionizatsion izomerlar suvda eritilganda turli anion'larni tashqi sferada beradi. AgNO₃ va BaCl₂ testlari ionni aniqlashning klassik usullari.
                </p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1">⚗️ Reaksiyalar</div>
                <div className="space-y-1.5 mt-2">
                  <div className="p-2 bg-purple-950/60 rounded font-mono text-[10px] text-yellow-100">
                    Ag⁺ + Br⁻ → AgBr↓ <span className="text-yellow-400">(sarg'ish oq)</span>
                  </div>
                  <div className="p-2 bg-purple-950/60 rounded font-mono text-[10px] text-blue-100">
                    Ba²⁺ + SO₄²⁻ → BaSO₄↓ <span className="text-blue-400">(oq)</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-900/40 rounded-lg p-3 border border-green-700/40">
                <div className="text-green-300 font-bold text-[11px] mb-1">🟢 A: {system.isomerA.formula}</div>
                <div className="space-y-1.5 mt-2">
                  <div className="p-2 bg-green-950/60 rounded text-[10px] text-green-100">
                    <span className="text-yellow-300 font-bold">AgNO₃:</span> {system.isomerA.agNO3Test}
                  </div>
                  <div className="p-2 bg-green-950/60 rounded text-[10px] text-green-100">
                    <span className="text-blue-300 font-bold">BaCl₂:</span> {system.isomerA.baCl2Test}
                  </div>
                </div>
              </div>

              <div className="bg-red-900/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 font-bold text-[11px] mb-1">🔴 B: {system.isomerB.formula}</div>
                <div className="space-y-1.5 mt-2">
                  <div className="p-2 bg-red-950/60 rounded text-[10px] text-red-100">
                    <span className="text-yellow-300 font-bold">AgNO₃:</span> {system.isomerB.agNO3Test}
                  </div>
                  <div className="p-2 bg-red-950/60 rounded text-[10px] text-red-100">
                    <span className="text-blue-300 font-bold">BaCl₂:</span> {system.isomerB.baCl2Test}
                  </div>
                </div>
              </div>

              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <div className="text-cyan-300 font-bold text-[11px] mb-1">💡 Xulosa</div>
                <p className="text-cyan-100 text-[10px] leading-relaxed">
                  Har bir izomer sof analitik testda faqat bitta cho'kma beradi. Bu tajriba Werner 1893-yilda koordinatsion nazariyasini yaratishda foydalangan asosiy usul.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — HSAB PANELI — */}
        {activePanel === "hsab" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-orange-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-orange-200 flex items-center gap-2 text-sm">
                <span>⚖️</span> HSAB va termodinamik afzallik
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-orange-950/40 rounded-lg p-3 border border-orange-700/40">
                <p className="text-orange-100 text-[11px] leading-relaxed">
                  <strong className="text-orange-300">Pearson qonuni (1963):</strong> Koordinatsion izomerlar orasidagi termodinamik afzallikni HSAB nazariyasi bashorat qiladi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-950/50 rounded-lg p-2.5 border border-blue-700/50">
                  <div className="text-blue-300 font-bold text-[11px] mb-1">🧱 QATTIQ</div>
                  <div className="text-blue-100 text-[10px] leading-tight">
                    <strong>Kislotalar:</strong> Cr³⁺, <strong>Co³⁺</strong>, Fe³⁺, Al³⁺
                    <br/><br/>
                    <strong>Asoslar:</strong> F⁻, OH⁻, H₂O, NH₃, N-donor
                  </div>
                </div>
                <div className="bg-orange-950/50 rounded-lg p-2.5 border border-orange-700/50">
                  <div className="text-orange-300 font-bold text-[11px] mb-1">☁️ YUMSHOQ</div>
                  <div className="text-orange-100 text-[10px] leading-tight">
                    <strong>Kislotalar:</strong> Cu⁺, Ag⁺, <strong>Pt²⁺</strong>, Pd²⁺, Hg²⁺
                    <br/><br/>
                    <strong>Asoslar:</strong> I⁻, CN⁻ (C-donor), S-donor
                  </div>
                </div>
              </div>

              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-1">📊 Barqarorlik tahlili</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">{system.stability || "N/A"}</p>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">🧲 Magnit xossalari</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">{system.magneticProp || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {/* — SOLISHTIRISH — */}
        {activePanel === "compare" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-md w-[400px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>📊</span> Solishtirish jadvali
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] border-collapse">
                <thead>
                  <tr className="bg-purple-800/50">
                    <th className="border border-purple-700/50 px-2 py-1.5 text-left text-purple-100">Xususiyat</th>
                    <th className="border border-purple-700/50 px-2 py-1.5 text-left text-green-300">A izomer</th>
                    <th className="border border-purple-700/50 px-2 py-1.5 text-left text-red-300">B izomer</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  <tr>
                    <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Formula</td>
                    <td className="border border-purple-800/50 px-2 py-1.5 font-mono text-[9.5px]">{system.isomerA.formula}</td>
                    <td className="border border-purple-800/50 px-2 py-1.5 font-mono text-[9.5px]">{system.isomerB.formula}</td>
                  </tr>
                  <tr className="bg-purple-900/30">
                    <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Rang</td>
                    <td className="border border-purple-800/50 px-2 py-1.5">
                      <span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{ backgroundColor: system.isomerA.colorHex }}></span>
                      {system.isomerA.color}
                    </td>
                    <td className="border border-purple-800/50 px-2 py-1.5">
                      <span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{ backgroundColor: system.isomerB.colorHex }}></span>
                      {system.isomerB.color}
                    </td>
                  </tr>
                  {system.isomerA.cation && system.isomerB.cation && (
                    <>
                      <tr>
                        <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Kation metalli</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerA.cation.center}{system.isomerA.cation.centerCharge || ''}</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerB.cation.center}{system.isomerB.cation.centerCharge || ''}</td>
                      </tr>
                      <tr className="bg-purple-900/30">
                        <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Kation ligandi</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerA.cation.ligand}</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerB.cation.ligand}</td>
                      </tr>
                    </>
                  )}
                  {system.isomerA.anion && system.isomerB.anion && (
                    <>
                      <tr>
                        <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Anion metalli</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerA.anion.center}{system.isomerA.anion.centerCharge || ''}</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerB.anion.center}{system.isomerB.anion.centerCharge || ''}</td>
                      </tr>
                      <tr className="bg-purple-900/30">
                        <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Anion ligandi</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerA.anion.ligand}</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerB.anion.ligand}</td>
                      </tr>
                    </>
                  )}
                  {system.isomerA.molecularUnit && (
                    <>
                      <tr>
                        <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Molekulyar birlik</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerA.molecularUnit}</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerB.molecularUnit}</td>
                      </tr>
                      <tr className="bg-purple-900/30">
                        <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Molekulyar massa</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerA.molecularMass}</td>
                        <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerB.molecularMass}</td>
                      </tr>
                    </>
                  )}
                  {system.isomerA.chelateInfo && (
                    <tr>
                      <td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Xelat halqa</td>
                      <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerA.chelateInfo}</td>
                      <td className="border border-purple-800/50 px-2 py-1.5">{system.isomerB.chelateInfo}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-[10px] text-purple-400 leading-relaxed">
              💡 <strong>Xulosa:</strong> {system.keyPrinciple}
            </div>
          </div>
        )}

        {/* — TARIX — */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 max-w-md w-[370px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm">
                <span>📜</span> Kashfiyot tarixi
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <p className="text-amber-100 text-[11px] leading-relaxed">{system.discovery}</p>
              </div>

              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-purple-300 font-bold text-[11px]">1828 — Magnus tuzi</div>
                <p className="text-purple-200 text-[10px] leading-relaxed">H.G. Magnus Berlin universitetida <span className="font-mono">[Pt(NH₃)₄][PtCl₄]</span>ni birinchi bor sintez qildi. Bu tarixdagi eng qadimgi platina komplekslaridan biri.</p>
              </div>

              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-blue-300 font-bold text-[11px]">1866 — Blomstrand zanjir nazariyasi</div>
                <p className="text-blue-200 text-[10px] leading-relaxed">Christian Blomstrand ammiakli komplekslar zanjir hosil qiladi degan noto'g'ri gipoteza taklif etdi.</p>
              </div>

              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-green-300 font-bold text-[11px]">1893 — Werner koordinatsion nazariyasi</div>
                <p className="text-green-200 text-[10px] leading-relaxed">Alfred Werner (26 yosh) koordinatsion nazariyasini taklif qildi va formal izomeriyaning barcha turlarini sistematik ravishda ochib berdi. Ichki va tashqi sfera tushunchalarini kiritdi.</p>
              </div>

              <div className="border-l-2 border-yellow-500 pl-3">
                <div className="text-yellow-300 font-bold text-[11px]">1893-1911 — Miolati va Werner</div>
                <p className="text-yellow-200 text-[10px] leading-relaxed">Andreotti Miolati bilan hamkorlikda koordinatsion izomerlarning ko'plab misollarini eksperimental jihatdan tasdiqladilar.</p>
              </div>

              <div className="border-l-2 border-red-500 pl-3">
                <div className="text-red-300 font-bold text-[11px]">1913 — Nobel mukofoti</div>
                <p className="text-red-200 text-[10px] leading-relaxed">Werner Kimyo bo'yicha Nobel mukofotini oldi — noorganik kimyoda birinchi Nobel.</p>
              </div>

              <div className="border-l-2 border-pink-500 pl-3">
                <div className="text-pink-300 font-bold text-[11px]">1963 — Pearson HSAB</div>
                <p className="text-pink-200 text-[10px] leading-relaxed">Ralph Pearson HSAB nazariyasini taklif qildi — koordinatsion izomerlar orasidagi termodinamik afzallikni tushuntirdi.</p>
              </div>

              <div className="border-l-2 border-cyan-500 pl-3">
                <div className="text-cyan-300 font-bold text-[11px]">2021 — Zamonaviy tadqiqotlar</div>
                <p className="text-cyan-200 text-[10px] leading-relaxed">Cesari va boshqalar Co-M (M = Cu, Ag, Au) karbonil klasterlarida yangi polimerlanish izomerlarini kashf etdilar (Chem. Eur. J.).</p>
              </div>
            </div>
          </div>
        )}

        {/* — TEST — */}
        {activePanel === "test" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[370px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
                <span>🧠</span> O'z-o'zini sinash
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <TestQuestion
                q="Formal izomeriya nima?"
                a="Bir xil molekulyar formulaga ega bo'lgan komplekslarning atomlar orasidagi bog'lanish tartibida farq qilishi. U 5-6 turga bo'linadi: koordinatsion, ionizatsion, gidrat, bog'lanish, ligand, polimerlanish."
              />
              <TestQuestion
                q="[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆] qanday izomerlar?"
                a="Koordinatsion izomerlar — bir xil ligandlar (6 NH₃ + 6 CN⁻) ikki metall (Co va Cr) o'rtasida turli usulda taqsimlanishi bilan farq qiladi."
              />
              <TestQuestion
                q="[Co(NH₃)₅Br]SO₄ eritmasiga BaCl₂ qo'shsak nima kuzatiladi?"
                a="Darhol BaSO₄ oq cho'kmasi hosil bo'ladi — chunki SO₄²⁻ tashqi sferada, u tez suvda dissotsiyalanib erkin ion sifatida turadi."
              />
              <TestQuestion
                q="Nima uchun Magnus tuzi [Pt(NH₃)₄][PtCl₄] va cis-[Pt(NH₃)₂Cl₂] polimerlanish izomerlari deb hisoblanadi?"
                a="Ular bir xil empirik formulaga (Pt(NH₃)₂Cl₂) ega, ammo molekulyar massa Magnus tuzida ikki barobar katta (600 g/mol vs 300 g/mol). Bu formula birligining takrorlanishi ma'nosida 'polimerlanish' deb nomlanadi (aslida haqiqiy polimer emas)."
              />
              <TestQuestion
                q="[Co(1,2-pn)₃]³⁺ va [Co(1,3-pn)₃]³⁺ qanday izomerlar?"
                a="Ligand izomerlar — 1,2-diaminopropan (5-a'zoli xelat halqa hosil qiladi) va 1,3-diaminopropan (6-a'zoli xelat halqa) bir xil molekulyar formulaga ega, ammo NH₂ guruhlari uglerod zanjirida turli joylarda."
              />
              <TestQuestion
                q="Nima uchun 5-a'zoli xelat halqa 6-a'zoli halqadan barqarorroq?"
                a="5-a'zoli halqada Baeyer tarangligi minimal, N-M-N burchagi va C-C-N-M dihedral burchak eng optimal. 6-a'zoli halqada sterik xalallik va konformatsion barqarorsizlik ortadi."
              />
              <TestQuestion
                q="HSAB nazariyasi koordinatsion izomerlarni qanday bashorat qiladi?"
                a="Qattiq kislota (Cr³⁺, Co³⁺) qattiq donorlarga (N, NH₃) tortiladi; yumshoq kislota (Pt²⁺, Cu⁺) yumshoq donorlarga (S, C-donor CN⁻, Cl⁻) tortiladi. Bu izomerlar orasidagi termodinamik afzallikni bashorat qiladi."
              />
              <TestQuestion
                q="Formal izomeriya stereoizomeriyadan qanday farq qiladi?"
                a="Formal (struktur) izomerlarda ATOMLAR joylashuvi va bog'lanish tartibi turli xil. Stereoizomerlarda ATOMLAR joylashuvi bir xil, faqat fazoviy ORIENTATSIYA turli xil (masalan, sis/trans yoki Δ/Λ)."
              />
            </div>
          </div>
        )}

        {/* — PDF MODAL — */}
        {pdfModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPdfModalOpen(false)}>
            <div className="bg-purple-950 rounded-2xl border border-purple-600/50 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/50">
                <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2">
                  <span>📄</span> PDF hisobot yaratish
                </h3>
                <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-purple-200 text-2xl leading-none">×</button>
              </div>
              <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-xs text-purple-400 mb-2">Qaysi bo'limlarni PDFga qo'shishni tanlang:</p>
                {[
                  { k: "intro", label: "1. Kirish — formal izomeriya", icon: "📖" },
                  { k: "types", label: "2. Izomer turlari batafsil", icon: "📚" },
                  { k: "structure", label: "3. Fazoviy tuzilish", icon: "📐" },
                  { k: "experiment", label: "4. Eksperimental farqlash", icon: "🧪" },
                  { k: "hsab", label: "5. HSAB va termodinamika", icon: "⚖️" },
                  { k: "magnetic", label: "6. Magnit xossalari", icon: "🧲" },
                  { k: "history", label: "7. Werner tarixi (1893-1913)", icon: "📜" },
                  { k: "table", label: "8. Solishtirish jadvali", icon: "📊" },
                  { k: "references", label: "9. Adabiyotlar", icon: "📚" }
                ].map(({ k, label, icon }) => (
                  <label key={k} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-900/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfSections[k]}
                      onChange={(e) => setPdfSections({ ...pdfSections, [k]: e.target.checked })}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span className="text-sm">{icon}</span>
                    <span className="text-sm text-purple-200">{label}</span>
                  </label>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-purple-800/50 flex gap-2 justify-end">
                <button
                  onClick={() => setPdfModalOpen(false)}
                  className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 rounded-lg text-sm text-purple-200"
                  disabled={pdfGenerating}
                >Bekor qilish</button>
                <button
                  onClick={generatePDF}
                  disabled={pdfGenerating}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-lg text-sm text-white font-medium flex items-center gap-2"
                >
                  {pdfGenerating ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Yaratilmoqda...</>
                  ) : (
                    <>📄 PDFni yuklab olish</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PASTKI RANG LEGENDA */}
      {!fullscreenMode && (
        <div className="flex justify-center gap-3 py-3 px-4 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#F090A0]"></div><span className="text-purple-300">Co</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#8A99C7]"></div><span className="text-purple-300">Cr</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#C88033]"></div><span className="text-purple-300">Cu</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#D0D0E0]"></div><span className="text-purple-300">Pt</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#3050F8]"></div><span className="text-purple-300">N</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#909090]"></div><span className="text-purple-300">C</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FF0D0D]"></div><span className="text-purple-300">O</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#FFFF30]"></div><span className="text-purple-300">S</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#1FF01F]"></div><span className="text-purple-300">Cl</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#A62929]"></div><span className="text-purple-300">Br</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-white"></div><span className="text-purple-300">H</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-pink-400 bg-pink-400/20"></div><span className="text-purple-300">Kation</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 bg-blue-400/20"></div><span className="text-purple-300">Anion</span></div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(88, 28, 135, 0.1); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.4); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.6); }
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────
// KICHIK KOMPONENT: Test savoli
// ─────────────────────────────────────────────────────────────
function TestQuestion({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-cyan-950/30 rounded-lg border border-cyan-800/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 hover:bg-cyan-900/30 transition-colors flex items-start gap-2"
      >
        <span className="text-cyan-400 flex-shrink-0">❓</span>
        <span className="text-cyan-100 text-[11px] leading-relaxed">{q}</span>
        <span className="ml-auto text-cyan-500 text-xs flex-shrink-0">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="px-3 py-2 bg-cyan-950/50 border-t border-cyan-800/40">
          <div className="flex items-start gap-2">
            <span className="text-green-400 flex-shrink-0">✓</span>
            <span className="text-green-100 text-[11px] leading-relaxed">{a}</span>
          </div>
        </div>
      )}
    </div>
  )
}
