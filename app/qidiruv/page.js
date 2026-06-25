"use client"
import Link from "next/link"
import { useState, useEffect, useMemo, useRef } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// QIDIRUV SAHIFASI — GLOBAL QIDIRUV TIZIMI
// Barcha bo'limlardan (o'quv, ilmiy, birikmalar, maqolalar, tahlil usullari)
// 100+ sahifadan tezkor qidiruv, klaviatura navigatsiyasi, kengaytirilgan filtrlar
//  ═══════════════════════════════════════════════════════════════════════════════

const ALL_CONTENT = [
  // ═══════════════════════════════════════════════════════════════
  // O'QUV BO'LIMI
  // ═══════════════════════════════════════════════════════════════
  { id: 1, title: "Kompleks birikmalarning klassifikatsiyasi", desc: "Ligand turi, sinf, zaryad bo'yicha tasniflash", path: "/oquv/klassifikatsiyasi", category: "O'quv", type: "mavzu", tags: ["ligand", "sinf", "zaryad", "tasnif"], icon: "📚" },
  { id: 2, title: "Ligandlar klassifikatsiyasi", desc: "Monodentat, bidentat, polidentat ligandlar", path: "/oquv/klassifikatsiyasi/ligand", category: "O'quv", type: "mavzu", tags: ["ligand", "monodentat", "bidentat", "polidentat"], icon: "🔗" },
  { id: 3, title: "Komplekslarning sinflari", desc: "Akva, ammin, karbonil, galogen komplekslar", path: "/oquv/klassifikatsiyasi/sinf", category: "O'quv", type: "mavzu", tags: ["akva", "ammin", "karbonil", "sinf"], icon: "🧪" },
  { id: 4, title: "Kompleks zaryadi", desc: "Kation, anion, neytral komplekslar", path: "/oquv/klassifikatsiyasi/zaryad", category: "O'quv", type: "mavzu", tags: ["zaryad", "kation", "anion", "neytral"], icon: "⚡" },
  { id: 5, title: "Komplekslarning nomlanishi", desc: "IUPAC, Werner, anion, formula nomlash qoidalari", path: "/oquv/nomlanishi", category: "O'quv", type: "mavzu", tags: ["nomlash", "iupac", "werner", "formula"], icon: "📝" },
  { id: 6, title: "IUPAC nomlash qoidalari", desc: "Zamonaviy IUPAC nomenklaturasi", path: "/oquv/nomlanishi/iupac", category: "O'quv", type: "mavzu", tags: ["iupac", "nomenklatura", "nom"], icon: "📖" },
  { id: 7, title: "Werner nomlash tizimi", desc: "Klassik Werner nomlanishi", path: "/oquv/nomlanishi/verner", category: "O'quv", type: "mavzu", tags: ["werner", "klassik", "nom"], icon: "📜" },
  { id: 8, title: "Ligandlar nomlanishi", desc: "Ligandlar uchun maxsus nomlar", path: "/oquv/nomlanishi/ligandlar", category: "O'quv", type: "mavzu", tags: ["ligand", "nom", "prefiks"], icon: "🏷️" },
  { id: 9, title: "Kimyoviy bog'lanish nazariyalari", desc: "Kristall maydon, ligand maydon, VB nazariyasi", path: "/oquv/kimyoviy-boglanish", category: "O'quv", type: "mavzu", tags: ["bog'lanish", "kristall", "maydon", "nazariya"], icon: "⚛️" },
  { id: 10, title: "Kristall maydon nazariyasi (CFSE)", desc: "Δo, Δt, CFSE, spektrokimyoviy qator", path: "/oquv/kimyoviy-boglanish/kristall-maydon", category: "O'quv", type: "mavzu", tags: ["cfse", "kristall", "maydon", "delta", "spektrokimyoviy"], icon: "🔷" },
  { id: 11, title: "Ligand maydon nazariyasi (LFT)", desc: "σ-donatsiya, π-bog'lanish, MO diagramma", path: "/oquv/kimyoviy-boglanish/ligand-maydon", category: "O'quv", type: "mavzu", tags: ["lft", "molekulyar", "orbital", "sigma", "pi"], icon: "🌐" },
  { id: 12, title: "Valent bog'lanish nazariyasi (VBT)", desc: "Gibridlanish, sp³d², d²sp³", path: "/oquv/kimyoviy-boglanish/vb-nazariyasi", category: "O'quv", type: "mavzu", tags: ["vbt", "gibridlanish", "valent"], icon: "🔬" },
  { id: 13, title: "Yahn-Teller effekti", desc: "Geometrik distorsiyalar, elongatsiya, kompressiya", path: "/oquv/kimyoviy-boglanish/yan-teller", category: "O'quv", type: "mavzu", tags: ["yan-teller", "distorsiya", "elongatsiya", "cu2+"], icon: "📐" },
  { id: 14, title: "Izomeriya turlari", desc: "Stereo va strukturaviy izomeriya", path: "/oquv/izomeriyasi", category: "O'quv", type: "mavzu", tags: ["izomeriya", "stereo", "strukturaviy"], icon: "🔄" },
  { id: 15, title: "Geometrik izomeriya", desc: "cis-trans, fac-mer izomerlar", path: "/oquv/izomeriyasi/geometrik", category: "O'quv", type: "mavzu", tags: ["geometrik", "cis", "trans", "fac", "mer"], icon: "⚗️" },
  { id: 16, title: "Optik izomeriya", desc: "Δ va Λ enantiomerlar, xirallik", path: "/oquv/izomeriyasi/optik", category: "O'quv", type: "mavzu", tags: ["optik", "enantiomer", "delta", "lambda", "xiral"], icon: "🪞" },
  { id: 17, title: "Linkage izomerizm", desc: "NO₂⁻ vs ONO⁻, NCS⁻ vs SCN⁻", path: "/oquv/izomeriyasi/boglanish", category: "O'quv", type: "mavzu", tags: ["linkage", "no2", "ono", "ambidentat"], icon: "🔀" },
  { id: 18, title: "Koordinatsion izomeriya", desc: "Ikki metalli komplekslarda", path: "/oquv/izomeriyasi/koordinatsion", category: "O'quv", type: "mavzu", tags: ["koordinatsion", "ikki", "metall"], icon: "🎯" },
  { id: 19, title: "Fazoviy geometriyalar", desc: "18 ta geometriya: chiziqli, tekis kvadrat, oktaedr va b.", path: "/oquv/fazoviy", category: "O'quv", type: "mavzu", tags: ["geometriya", "oktaedr", "tetraedr", "tekis kvadrat"], icon: "🧭" },
  { id: 20, title: "Koordinatsion son 2 (chiziqli)", desc: "Ag⁺, Au⁺, Cu⁺ komplekslari", path: "/oquv/fazoviy/chiziqli", category: "O'quv", type: "mavzu", tags: ["kch-2", "chiziqli", "ag+", "au+"], icon: "📏" },
  { id: 21, title: "Koordinatsion son 4 (tetraedr/tekis kvadrat)", desc: "Ni²⁺, Pd²⁺, Pt²⁺, Zn²⁺", path: "/oquv/fazoviy/tetraedr", category: "O'quv", type: "mavzu", tags: ["kch-4", "tetraedr", "tekis kvadrat", "ni2+", "pt2+"], icon: "⬜" },
  { id: 22, title: "Koordinatsion son 6 (oktaedr)", desc: "Eng keng tarqalgan geometriya", path: "/oquv/fazoviy/oktaedr", category: "O'quv", type: "mavzu", tags: ["kch-6", "oktaedr", "eng keng"], icon: "🎲" },
  { id: 23, title: "Video darsliklar", desc: "Interaktiv video darslar, quiz testlar", path: "/oquv/video-darsliklar", category: "O'quv", type: "mavzu", tags: ["video", "darslik", "quiz", "test"], icon: "🎥" },
  
  // ═══════════════════════════════════════════════════════════════
  // ILMIIY — BIRIKMALAR
  // ═══════════════════════════════════════════════════════════════
  { id: 30, title: "[Ag(NH₃)₂]⁺ — Diamminikumush(I)", desc: "Chiziqli geometriya, kch=2, Tollen reagenti", path: "/ilmiy/birikmalar/ag-nh3-2", category: "Birikma", type: "birikma", tags: ["ag+", "nh3", "chiziqli", "kch-2", "tollen", "kumush"], icon: "⚪" },
  { id: 31, title: "[CoCl₄]²⁻ — Tetraxlorokobaltat(II)", desc: "Tetraedr, kch=4, d⁷, paramagnit, ko'k rang", path: "/ilmiy/birikmalar/co-cl4", category: "Birikma", type: "birikma", tags: ["co2+", "cl", "tetraedr", "kch-4", "d7", "paramagnit", "kobalt"], icon: "🔵" },
  { id: 32, title: "[Co(NH₃)₆]Cl₃ — Luteo-kobalt", desc: "Oktaedr, d⁶ past spinli, diamagnit, inert", path: "/ilmiy/birikmalar/co-nh3-6-cl3", category: "Birikma", type: "birikma", tags: ["co3+", "nh3", "oktaedr", "d6", "diamagnit", "inert", "kobalt"], icon: "🟡" },
  { id: 33, title: "[Cr(H₂O)₆]³⁺ — Geksaakvaxrom(III)", desc: "Oktaedr, d³, paramagnit, binafsha rang", path: "/ilmiy/birikmalar/cr-h2o6", category: "Birikma", type: "birikma", tags: ["cr3+", "h2o", "oktaedr", "d3", "paramagnit", "xrom"], icon: "🟣" },
  { id: 34, title: "[Cu(H₂O)₆]²⁺ — Geksaakvamis(II)", desc: "Yahn-Teller distorsiyasi, d⁹, ko'k rang", path: "/ilmiy/birikmalar/cu-h2o6", category: "Birikma", type: "birikma", tags: ["cu2+", "h2o", "oktaedr", "d9", "yan-teller", "mis"], icon: "💧" },
  { id: 35, title: "[Fe(CO)₅] — Temir pentakarbonil", desc: "Trigonal bipiramidal, d⁸, kch=5, toksik", path: "/ilmiy/birikmalar/fe-co5", category: "Birikma", type: "birikma", tags: ["fe0", "co", "kch-5", "trigonal", "bipiramidal", "karbonil", "temir"], icon: "⚠️" },
  { id: 36, title: "[Fe(C₅H₅)₂] — Ferrosen", desc: "Sendvich birikma, metallosen, Nobel (Wilkinson/Fischer)", path: "/ilmiy/birikmalar/ferrosen", category: "Birikma", type: "birikma", tags: ["fe2+", "c5h5", "sendvich", "metallosen", "ferrosen", "temir"], icon: "🥪" },
  { id: 37, title: "K₃[Fe(CN)₆] — Qizil qon tuzi", desc: "Ferritsianid, Fe³⁺, d⁵ past spinli", path: "/ilmiy/birikmalar/k3-fe-cn6", category: "Birikma", type: "birikma", tags: ["fe3+", "cn", "oktaedr", "d5", "ferritsianid", "qizil", "temir"], icon: "🔴" },
  { id: 38, title: "K₄[Fe(CN)₆] — Sariq qon tuzi", desc: "Ferrosianid, Fe²⁺, d⁶ past spinli, π-backbonding", path: "/ilmiy/birikmalar/k4-fe-cn6", category: "Birikma", type: "birikma", tags: ["fe2+", "cn", "oktaedr", "d6", "ferrosianid", "sariq", "temir"], icon: "🟡" },
  { id: 39, title: "[Ni(CN)₄]²⁻ — Tetratsianonikelat(II)", desc: "Tekis kvadrat, d⁸, diamagnit", path: "/ilmiy/birikmalar/ni-cn4", category: "Birikma", type: "birikma", tags: ["ni2+", "cn", "tekis kvadrat", "d8", "diamagnit", "nikel"], icon: "⬜" },
  { id: 40, title: "cis-[PtCl₂(NH₃)₂] — Sisplatin", desc: "Saraton dori, Nobel 1973, DNK crosslink", path: "/ilmiy/birikmalar/sisplatin", category: "Birikma", type: "birikma", tags: ["pt2+", "cl", "nh3", "sisplatin", "saraton", "dori", "platin"], icon: "💊" },
  { id: 41, title: "[Zn(OH)₄]²⁻ — Tetragidroksotsinkat(II)", desc: "Tetraedr, d¹⁰, rangsiz", path: "/ilmiy/birikmalar/zn-oh4", category: "Birikma", type: "birikma", tags: ["zn2+", "oh", "tetraedr", "d10", "rux"], icon: "🔘" },
  
  // ═══════════════════════════════════════════════════════════════
  // ILMIIY — CHUQURLASHGAN MAVZULAR
  // ═══════════════════════════════════════════════════════════════
  { id: 50, title: "Koordinatsion son tushunchasi", desc: "KCH 2-12 oralig'ida barcha holatlar", path: "/ilmiy/chuqurlashgan/koordinator-son", category: "Ilmiy", type: "mavzu", tags: ["kch", "koordinatsion", "son"], icon: "🔢" },
  { id: 51, title: "KCH 2 va 4 (chiziqli, tetraedr)", desc: "Ag⁺, Au⁺, Zn²⁺, Ni²⁺ misollari", path: "/ilmiy/chuqurlashgan/koordinator-son/kch-2-4", category: "Ilmiy", type: "mavzu", tags: ["kch-2", "kch-4", "chiziqli", "tetraedr"], icon: "📏" },
  { id: 52, title: "KCH 5 va 6 (trigonal bp, oktaedr)", desc: "Fe(CO)₅, [Co(NH₃)₆]³⁺", path: "/ilmiy/chuqurlashgan/koordinator-son/kch-5-6", category: "Ilmiy", type: "mavzu", tags: ["kch-5", "kch-6", "trigonal", "oktaedr"], icon: "🎲" },
  { id: 53, title: "KCH 7-12 (yuqori koordinatsiya)", desc: "Lantanidlar, aktinidlar, Zr, Hf komplekslari", path: "/ilmiy/chuqurlashgan/koordinator-son/kch-7-12", category: "Ilmiy", type: "mavzu", tags: ["kch-7", "kch-8", "kch-9", "kch-12", "lantanid", "aktinid"], icon: "🎯" },
  { id: 54, title: "Kepert modeli", desc: "Ligand-ligand elektrostatik itarilish", path: "/ilmiy/chuqurlashgan/koordinator-son/kepert-modeli", category: "Ilmiy", type: "mavzu", tags: ["kepert", "elektrostatik", "itarilish"], icon: "📐" },
  { id: 55, title: "VSEPR nazariyasi komplekslarda", desc: "Valent qobig'i elektron juftlari itarilishi", path: "/ilmiy/chuqurlashgan/koordinator-son/vsepr", category: "Ilmiy", type: "mavzu", tags: ["vsepr", "elektron", "juft"], icon: "⚛️" },
  { id: 56, title: "Berry psevdorotatsiyasi", desc: "Trigonal bipiramidal komplekslarda almashinish", path: "/ilmiy/chuqurlashgan/koordinator-son/berry-psevdorotatsiya", category: "Ilmiy", type: "mavzu", tags: ["berry", "psevdorotatsiya", "trigonal"], icon: "🔄" },
  { id: 57, title: "Yahn-Teller geometriyasi", desc: "Cu²⁺, Cr²⁺, Mn³⁺ distorsiyalari", path: "/ilmiy/chuqurlashgan/koordinator-son/yahn-teller-geometriya", category: "Ilmiy", type: "mavzu", tags: ["yan-teller", "cu2+", "distorsiya"], icon: "📊" },
  { id: 58, title: "Izomeriya — to'liq qo'llanma", desc: "Barcha izomeriya turlari", path: "/ilmiy/chuqurlashgan/izomeriya", category: "Ilmiy", type: "mavzu", tags: ["izomeriya", "tasnif"], icon: "🔀" },
  { id: 59, title: "Ionlanish izomeriyasi", desc: "[Co(NH₃)₅Br]SO₄ vs [Co(NH₃)₅SO₄]Br", path: "/ilmiy/chuqurlashgan/izomeriya/ionlanish", category: "Ilmiy", type: "mavzu", tags: ["ionlanish", "izomeriya", "co", "br", "so4"], icon: "⚡" },
  { id: 60, title: "Geometrik izomeriya (chuqur)", desc: "fac/mer, cis/trans, 3D interaktiv modellar", path: "/ilmiy/chuqurlashgan/izomeriya/geometrik", category: "Ilmiy", type: "mavzu", tags: ["geometrik", "fac", "mer", "cis", "trans", "3d"], icon: "🧊" },
  { id: 61, title: "Optik izomeriya (chuqur)", desc: "Δ/Λ, D/L, R/S, CD spektroskopiya", path: "/ilmiy/chuqurlashgan/izomeriya/optik", category: "Ilmiy", type: "mavzu", tags: ["optik", "delta", "lambda", "xiral", "cd"], icon: "🪞" },
  { id: 62, title: "Zaryad ko'chishi (Charge Transfer)", desc: "LMCT, MLCT, IVCT", path: "/ilmiy/chuqurlashgan/zaryad-kochishi", category: "Ilmiy", type: "mavzu", tags: ["lmct", "mlct", "ivct", "zaryad", "kochish"], icon: "🌈" },
  { id: 63, title: "Elektron konfiguratsiyasi", desc: "d¹-d¹⁰ barcha holatlar, Tanabe-Sugano", path: "/ilmiy/chuqurlashgan/elektron-konfiguratsiya", category: "Ilmiy", type: "mavzu", tags: ["elektron", "konfiguratsiya", "d1", "d10", "tanabe-sugano"], icon: "⚛️" },
  { id: 64, title: "Koordinatsion kimyo fotokimyosi", desc: "Jablonski diagrammasi, MLCT, OLED", path: "/ilmiy/chuqurlashgan/fotokimyo", category: "Ilmiy", type: "mavzu", tags: ["fotokimyo", "jablonski", "oled", "mlct"], icon: "💡" },
  { id: 65, title: "MLCT holatlari", desc: "[Ru(bpy)₃]²⁺, [Ir(ppy)₃] kabi emissiv komplekslar", path: "/ilmiy/chuqurlashgan/fotokimyo/mlct-holati", category: "Ilmiy", type: "mavzu", tags: ["mlct", "ru", "ir", "emissiya"], icon: "✨" },
  { id: 66, title: "Lantanidlar fotokimyosi", desc: "Eu³⁺, Tb³⁺, antenna effekti", path: "/ilmiy/chuqurlashgan/fotokimyo/lantanidlar", category: "Ilmiy", type: "mavzu", tags: ["lantanid", "eu", "tb", "antenna"], icon: "🌟" },
  { id: 67, title: "OLED materiallari", desc: "Ir, Pt komplekslari, fosforesensiya", path: "/ilmiy/chuqurlashgan/fotokimyo/oled", category: "Ilmiy", type: "mavzu", tags: ["oled", "ir", "pt", "fosforesensiya"], icon: "📺" },
  { id: 68, title: "Koordinatsion reaksiyalar", desc: "Ligand almashinish, redoks, katalitik", path: "/ilmiy/chuqurlashgan/reaksiyalar", category: "Ilmiy", type: "mavzu", tags: ["reaksiya", "almashinish", "redoks", "kataliz"], icon: "⚗️" },
  { id: 69, title: "Ligand almashinish mexanizmlari", desc: "Dissotsiativ, assotsiativ, I mexanizmlar", path: "/ilmiy/chuqurlashgan/reaksiyalar/ligand-almashinish", category: "Ilmiy", type: "mavzu", tags: ["dissotsiativ", "assotsiativ", "mexanizm"], icon: "🔄" },
  { id: 70, title: "Katalitik sikllar", desc: "Wilkinson, Monsanto, Wacker, Ziegler-Natta", path: "/ilmiy/chuqurlashgan/reaksiyalar/katalitik-sikllar", category: "Ilmiy", type: "mavzu", tags: ["kataliz", "wilkinson", "monsanto", "wacker"], icon: "⚙️" },
  { id: 71, title: "Metall asosidagi dorilar", desc: "Sisplatin, karboplatin, oksaliplatin, Au, Ru", path: "/ilmiy/chuqurlashgan/metall-dorilar", category: "Ilmiy", type: "mavzu", tags: ["dori", "saraton", "platina", "ruteniy", "oltin"], icon: "💊" },
  { id: 72, title: "Platina dorilari", desc: "Sisplatin, karboplatin, oksaliplatin mexanizmi", path: "/ilmiy/chuqurlashgan/metall-dorilar/platina", category: "Ilmiy", type: "mavzu", tags: ["platina", "sisplatin", "karboplatin", "oksaliplatin"], icon: "💉" },
  { id: 73, title: "Ruteniy dorilari", desc: "NAMI-A, KP1019, RAPTA", path: "/ilmiy/chuqurlashgan/metall-dorilar/ruteniy", category: "Ilmiy", type: "mavzu", tags: ["ruteniy", "nami-a", "k p1019", "rapta"], icon: "💊" },
  { id: 74, title: "Supramolekulyar kimyo", desc: "Host-guest, MOF, molekulyar mashinalar", path: "/ilmiy/chuqurlashgan/supramolekulyar", category: "Ilmiy", type: "mavzu", tags: ["supramolekulyar", "host-guest", "mof", "mashina"], icon: "🧬" },
  { id: 75, title: "MOF (Metal-Organic Frameworks)", desc: "G'ovakli materiallar, gaz saqlash", path: "/ilmiy/chuqurlashgan/supramolekulyar/mof", category: "Ilmiy", type: "mavzu", tags: ["mof", "govakli", "gaz", "saqlash"], icon: "🏗️" },
  { id: 76, title: "Molekulyar mashinalar", desc: "Nobel 2016, rotaxane, catenane", path: "/ilmiy/chuqurlashgan/supramolekulyar/molekulyar-mashinalar", category: "Ilmiy", type: "mavzu", tags: ["mashina", "rotaxane", "catenane", "nobel"], icon: "⚙️" },
  { id: 77, title: "Ko'p yadroli komplekslar", desc: "MM bog'lar, klasterlar, aralash valentli", path: "/ilmiy/chuqurlashgan/kop-yadroli", category: "Ilmiy", type: "mavzu", tags: ["kop", "yadroli", "klaster", "mm"], icon: "🎯" },
  { id: 78, title: "Karbonil klasterlar", desc: "Fe₃(CO)₁₂, Os₅(CO)₁₆, Ru₆(CO)₁₈", path: "/ilmiy/chuqurlashgan/kop-yadroli/karbonil-klasterlar", category: "Ilmiy", type: "mavzu", tags: ["klaster", "karbonil", "fe", "os", "ru"], icon: "⚗️" },
  { id: 79, title: "Magnit klasterlar (SMM)", desc: "Single-molecule magnets, Mn₁₂", path: "/ilmiy/chuqurlashgan/kop-yadroli/magnit-klasterlar", category: "Ilmiy", type: "mavzu", tags: ["smm", "magnit", "mn12"], icon: "🧲" },
  { id: 80, title: "Atom tuzilishi", desc: "d-orbital shakllari, kvant sonlar", path: "/ilmiy/chuqurlashgan/atom-tuzilishi", category: "Ilmiy", type: "mavzu", tags: ["atom", "d-orbital", "kvant", "son"], icon: "⚛️" },
  { id: 81, title: "d-orbital shakllari (3D)", desc: "dxy, dxz, dyz, dx²-y², dz² interaktiv", path: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli", category: "Ilmiy", type: "mavzu", tags: ["d-orbital", "3d", "shakl"], icon: "🧊" },
  { id: 82, title: "Simmetriya va nuqtaviy guruhlar", desc: "Cₙᵥ, Dₙₕ, Tₐ, Oₕ, Iₕ", path: "/ilmiy/chuqurlashgan/simmetriya", category: "Ilmiy", type: "mavzu", tags: ["simmetriya", "nuqtaviy", "guruh", "cv", "dh"], icon: "📐" },
  { id: 83, title: "Termodinamika", desc: "Barqarorlik konstantalari, xelat effekti", path: "/ilmiy/chuqurlashgan/termodinamika", category: "Ilmiy", type: "mavzu", tags: ["termodinamika", "barqarorlik", "xelat"], icon: "🌡️" },
  { id: 84, title: "Kinetika", desc: "Inert/labil, Eyring, Arrhenius", path: "/ilmiy/chuqurlashgan/kinetika", category: "Ilmiy", type: "mavzu", tags: ["kinetika", "inert", "labil", "eyring"], icon: "⏱️" },
  
  // ═══════════════════════════════════════════════════════════════
  // ILMIIY — TAHLIL USULLARI (20 ta)
  // ═══════════════════════════════════════════════════════════════
  { id: 100, title: "YaMR spektroskopiya", desc: "¹H, ¹³C, ¹⁹⁵Pt, ²⁷Al, ³¹P yadrolari", path: "/ilmiy/tahlil/nmr", category: "Tahlil", type: "usul", tags: ["nmr", "yamr", "yadro", "magnit", "rezonans"], icon: "🧲" },
  { id: 101, title: "IQ (Infra-qizil) spektroskopiya", desc: "Tebranish chastotalari, M-L bog'lari", path: "/ilmiy/tahlil/iq", category: "Tahlil", type: "usul", tags: ["iq", "ir", "infra-qizil", "tebranish"], icon: "📊" },
  { id: 102, title: "Raman spektroskopiya", desc: "Simmetrik tebranishlar, depolarizatsiya", path: "/ilmiy/tahlil/raman", category: "Tahlil", type: "usul", tags: ["raman", "simmetrik", "tebranish"], icon: "💎" },
  { id: 103, title: "UV-Vis spektroskopiya", desc: "d-d o'tishlar, MLCT, Beer-Lambert", path: "/ilmiy/tahlil/ub-vis", category: "Tahlil", type: "usul", tags: ["uv", "vis", "elektron", "beer-lambert"], icon: "🌈" },
  { id: 104, title: "Rentgen difraksiyasi (XRD)", desc: "SCXRD, PXRD, Bragg tenglamasi", path: "/ilmiy/tahlil/rentgen", category: "Tahlil", type: "usul", tags: ["xrd", "rentgen", "bragg", "difraksiya"], icon: "💠" },
  { id: 105, title: "Mass-spektrometriya", desc: "ESI-MS, MALDI, izotop taqsimoti", path: "/ilmiy/tahlil/mass", category: "Tahlil", type: "usul", tags: ["mass", "ms", "esi", "maldi", "izotop"], icon: "⚖️" },
  { id: 106, title: "EPR spektroskopiya", desc: "Elektron paramagnit rezonans, g-faktor", path: "/ilmiy/tahlil/epr", category: "Tahlil", type: "usul", tags: ["epr", "esr", "elektron", "paramagnit"], icon: "📡" },
  { id: 107, title: "Mössbauer spektroskopiya", desc: "⁵⁷Fe, isomer siljish, kvadrupol", path: "/ilmiy/tahlil/mossbauer", category: "Tahlil", type: "usul", tags: ["mossbauer", "fe57", "temir"], icon: "⚛️" },
  { id: 108, title: "EXAFS/XANES", desc: "Rentgen yutilish, Fourier transform", path: "/ilmiy/tahlil/exafs", category: "Tahlil", type: "usul", tags: ["exafs", "xanes", "rentgen", "yutilish"], icon: "🔮" },
  { id: 109, title: "XPS spektroskopiya", desc: "Elektron spektroskopiya, bog'lanish energiyasi", path: "/ilmiy/tahlil/xps", category: "Tahlil", type: "usul", tags: ["xps", "elektron", "bog'lanish", "energiya"], icon: "🎯" },
  { id: 110, title: "Elektrokimyo (CV)", desc: "Siklik voltammetriya, E½, Randles-Ševčik", path: "/ilmiy/tahlil/elektrokimyo", category: "Tahlil", type: "usul", tags: ["elektrokimyo", "cv", "voltammetriya", "redoks"], icon: "⚡" },
  { id: 111, title: "Magnit xususiyatlar (SQUID)", desc: "μ_eff, spin-crossover, Curie qonuni", path: "/ilmiy/tahlil/magnit", category: "Tahlil", type: "usul", tags: ["magnit", "squid", "curie", "spin"], icon: "🧲" },
  { id: 112, title: "Termik tahlil (TGA/DSC)", desc: "Massa yo'qotish, entalpiya", path: "/ilmiy/tahlil/termik", category: "Tahlil", type: "usul", tags: ["tga", "dsc", "termik", "entalpiya"], icon: "🔥" },
  { id: 113, title: "Element analiz", desc: "C, H, N, S miqdoriy tahlil", path: "/ilmiy/tahlil/element-analiz", category: "Tahlil", type: "usul", tags: ["element", "analiz", "chn"], icon: "🧪" },
  { id: 114, title: "Fluoressensiya", desc: "Kvant unumdorligi, Stern-Volmer, FRET", path: "/ilmiy/tahlil/fluoressensiya", category: "Tahlil", type: "usul", tags: ["fluoressensiya", "emissiya", "kvant"], icon: "✨" },
  { id: 115, title: "CD spektroskopiya", desc: "Circular dichroism, xirallik", path: "/ilmiy/tahlil/cd", category: "Tahlil", type: "usul", tags: ["cd", "xiral", "enantiomer"], icon: "🪞" },
  { id: 116, title: "AAS spektroskopiya", desc: "Atom yutilish, metall konsentratsiyasi", path: "/ilmiy/tahlil/aas", category: "Tahlil", type: "usul", tags: ["aas", "atom", "yutilish", "konsentratsiya"], icon: "🔬" },
  { id: 117, title: "ICP-MS/OES", desc: "Plazma mass-spektrometriya, ko'p elementli", path: "/ilmiy/tahlil/icp", category: "Tahlil", type: "usul", tags: ["icp", "ms", "oes", "plazma"], icon: "🌡️" },
  { id: 118, title: "Konduktometriya", desc: "Λm, elektrolit turi (1:1, 1:2, 1:3)", path: "/ilmiy/tahlil/konduktometriya", category: "Tahlil", type: "usul", tags: ["konduktometriya", "lambda", "elektrolit"], icon: "📊" },
  { id: 119, title: "Spektrofotometrik titrlash", desc: "Job usuli, log β, muvozanat", path: "/ilmiy/tahlil/titrlash", category: "Tahlil", type: "usul", tags: ["titrlash", "job", "muvozanat"], icon: "⚗️" },
  
  // ═══════════════════════════════════════════════════════════════
  // MAQOLALAR
  // ═══════════════════════════════════════════════════════════════
  { id: 130, title: "Maqolalar bazasi", desc: "Koordinatsion kimyo bo'yicha ilmiy maqolalar", path: "/ilmiy/maqolalar", category: "Maqola", type: "maqola", tags: ["maqola", "ilmiy", "baza"], icon: "📄" },
  { id: 131, title: "Yangi maqolalar", desc: "So'nggi ilmiy nashrlar", path: "/ilmiy/maqolalar/yangi", category: "Maqola", type: "maqola", tags: ["yangi", "nashr"], icon: "🆕" },
  { id: 132, title: "Maqola yaratish", desc: "O'z maqolangizni qo'shing", path: "/ilmiy/maqolalar/yaratish", category: "Maqola", type: "sahifa", tags: ["yaratish", "qoshish", "muallif"], icon: "✍️" },
]

// Ommabop qidiruvlar
const POPULAR_SEARCHES = [
  "sisplatin", "ferrosen", "yan-teller", "cfse", "spektrokimyoviy qator",
  "kristall maydon", "linkage izomerizm", "mlct", "lmct", "18 elektron qoidasi",
  "kelat effekti", "trans-effekt", "werner", "nmr", "ir spektroskopiya",
  "oktaedr", "tetraedr", "tekis kvadrat", "spin crossover", "mof"
]

// Kategoriyalar
const CATEGORIES = [
  { id: "all", name: "Barchasi", icon: "🌐", color: "purple" },
  { id: "O'quv", name: "O'quv", icon: "📚", color: "blue" },
  { id: "Ilmiy", name: "Ilmiy", icon: "🔬", color: "cyan" },
  { id: "Birikma", name: "Birikmalar", icon: "🧪", color: "yellow" },
  { id: "Tahlil", name: "Tahlil usullari", icon: "📊", color: "green" },
  { id: "Maqola", name: "Maqolalar", icon: "📄", color: "pink" },
]

// View mode turlari
const VIEW_MODES = [
  { id: "cards", name: "Kartalar", icon: "🎴" },
  { id: "list", name: "Ro'yxat", icon: "📋" },
  { id: "grid", name: "Grid", icon: "⊞" },
]

export default function QidiruvPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState("cards")
  const [recentSearches, setRecentSearches] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    metal: "",
    ligand: "",
    geometry: "",
    coordinationNumber: "",
  })
  const inputRef = useRef(null)

  // LocalStorage dan so'nggi qidiruvlarni yuklash
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jdakimyo_recent_searches")
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    } catch (e) {
      console.log("LocalStorage xatosi:", e)
    }
  }, [])

  // Klaviatura yorliqlari (Ctrl+K - fokus, Esc - tozalash)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setSearchQuery("")
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Qidiruv natijalarini filtrlash
  const filteredResults = useMemo(() => {
    let results = ALL_CONTENT

    // Kategoriya filtri
    if (activeCategory !== "all") {
      results = results.filter(item => item.category === activeCategory)
    }

    // Matn qidiruvi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      results = results.filter(item => {
        const searchable = [
          item.title,
          item.desc,
          ...(item.tags || []),
          item.category,
          item.type,
        ].join(" ").toLowerCase()
        return searchable.includes(query)
      })
    }

    // Kengaytirilgan filtrlar
    if (advancedFilters.metal) {
      results = results.filter(item => 
        (item.tags || []).some(tag => 
          tag.toLowerCase().includes(advancedFilters.metal.toLowerCase())
        )
      )
    }

    // Natijalarni ahamiyatga qarab saralash
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      results = results.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(query) ? 2 : 0
        const bTitle = b.title.toLowerCase().includes(query) ? 2 : 0
        const aTags = (a.tags || []).some(t => t.toLowerCase() === query) ? 1 : 0
        const bTags = (b.tags || []).some(t => t.toLowerCase() === query) ? 1 : 0
        return (bTitle + bTags) - (aTitle + aTags)
      })
    }

    return results
  }, [searchQuery, activeCategory, advancedFilters])

  // Qidiruvni saqlash
  const saveSearch = (query) => {
    if (!query.trim()) return
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 8)
    setRecentSearches(updated)
    try {
      localStorage.setItem("jdakimyo_recent_searches", JSON.stringify(updated))
    } catch (e) {
      console.log("LocalStorage xatosi:", e)
    }
  }

  // So'nggi qidiruvni o'chirish
  const removeRecentSearch = (query) => {
    const updated = recentSearches.filter(s => s !== query)
    setRecentSearches(updated)
    try {
      localStorage.setItem("jdakimyo_recent_searches", JSON.stringify(updated))
    } catch (e) {
      console.log("LocalStorage xatosi:", e)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      saveSearch(searchQuery.trim())
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    saveSearch(suggestion)
    inputRef.current?.focus()
  }

  const clearSearch = () => {
    setSearchQuery("")
    inputRef.current?.focus()
  }

  const resultCount = filteredResults.length
  const hasQuery = searchQuery.trim().length > 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-blue-950 text-white">
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">Qidiruv</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">🔍</span>
                Global Qidiruv Tizimi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {ALL_CONTENT.length}+ sahifa, {CATEGORIES.length - 1} kategoriya
              </p>
            </div>
            <Link href="/" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* HERO — QIDIRUV INPUT */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🔍</span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Nima qidirmoqchisiz?
                </h2>
                <p className="text-purple-300 text-sm mt-1">
                  Kompleks birikmalar, tahlil usullari, nazariyalar, maqolalar
                </p>
              </div>
            </div>

            {/* ASOSIY QIDIRUV INPUT */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center bg-purple-950/70 border-2 border-purple-600/50 rounded-2xl overflow-hidden focus-within:border-yellow-400 transition-colors">
                <span className="pl-5 text-2xl">🔍</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masalan: sisplatin, kristall maydon, nmr, d-orbital..."
                  className="flex-1 bg-transparent px-4 py-5 text-white placeholder-purple-500 outline-none text-lg"
                  autoComplete="off"
                  spellCheck="false"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-3 text-purple-400 hover:text-white transition-colors"
                    aria-label="Tozalash"
                  >
                    ✕
                  </button>
                )}
                <div className="hidden md:flex items-center gap-2 pr-5 text-xs text-purple-400">
                  <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono">Ctrl+K</kbd>
                </div>
              </div>
              <button type="submit" className="sr-only">Qidirish</button>
            </form>

            {/* TEZKOR STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-3">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-xl font-bold text-yellow-400">23</div>
                <div className="text-xs text-purple-400">O'quv mavzular</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-3">
                <div className="text-2xl mb-1">🧪</div>
                <div className="text-xl font-bold text-yellow-400">12</div>
                <div className="text-xs text-purple-400">Birikmalar</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-3">
                <div className="text-2xl mb-1">🔬</div>
                <div className="text-xl font-bold text-yellow-400">35</div>
                <div className="text-xs text-purple-400">Ilmiy mavzular</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-3">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-xl font-bold text-yellow-400">20</div>
                <div className="text-xs text-purple-400">Tahlil usullari</div>
              </div>
            </div>
          </div>
        </div>

        {/* KATEGORIYA FILTRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🏷️</span> Kategoriyalar
            </h3>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                showAdvanced
                  ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              <span>⚙️</span>
              Kengaytirilgan filtrlar
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? `bg-${cat.color}-600/60 text-white border border-${cat.color}-400/50 shadow-lg shadow-${cat.color}-500/20`
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* KENGAYTIRILGAN FILTRLAR */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-purple-700/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-purple-400 mb-1">Metall ioni</label>
                <input
                  type="text"
                  value={advancedFilters.metal}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, metal: e.target.value })}
                  placeholder="Masalan: Fe²⁺, Pt²⁺"
                  className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-purple-600 focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-400 mb-1">Ligand</label>
                <input
                  type="text"
                  value={advancedFilters.ligand}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, ligand: e.target.value })}
                  placeholder="Masalan: CN⁻, NH₃"
                  className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-purple-600 focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-400 mb-1">Geometriya</label>
                <select
                  value={advancedFilters.geometry}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, geometry: e.target.value })}
                  className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                >
                  <option value="">Barchasi</option>
                  <option value="oktaedr">Oktaedr</option>
                  <option value="tetraedr">Tetraedr</option>
                  <option value="tekis kvadrat">Tekis kvadrat</option>
                  <option value="chiziqli">Chiziqli</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-purple-400 mb-1">Koordinatsion son</label>
                <select
                  value={advancedFilters.coordinationNumber}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, coordinationNumber: e.target.value })}
                  className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                >
                  <option value="">Barchasi</option>
                  <option value="2">KCH = 2</option>
                  <option value="4">KCH = 4</option>
                  <option value="5">KCH = 5</option>
                  <option value="6">KCH = 6</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* SO'NGGI VA OMMABOP QIDIRUVLAR (faqat query bo'sh bo'lsa) */}
        {!hasQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SO'NGGI QIDIRUVLAR */}
            {recentSearches.length > 0 && (
              <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🕐</span> So'nggi qidiruvlar
                  </h3>
                  <button
                    onClick={() => {
                      setRecentSearches([])
                      try {
                        localStorage.removeItem("jdakimyo_recent_searches")
                      } catch (e) {
                        console.log("LocalStorage xatosi:", e)
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Tozalash
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((query, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-2 bg-purple-800/30 border border-purple-700/50 rounded-lg px-3 py-1.5 hover:bg-purple-700/40 transition-colors"
                    >
                      <button
                        onClick={() => handleSuggestionClick(query)}
                        className="text-sm text-purple-200 hover:text-yellow-400"
                      >
                        {query}
                      </button>
                      <button
                        onClick={() => removeRecentSearch(query)}
                        className="text-xs text-purple-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="O'chirish"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OMMABOP QIDIRUVLAR */}
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span>🔥</span> Ommabop qidiruvlar
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.slice(0, 12).map((query, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(query)}
                    className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-lg px-3 py-1.5 text-sm hover:bg-yellow-500/30 hover:border-yellow-400/50 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAVSIYA ETILGAN QIDIRUVLAR (query boshlanganda) */}
        {hasQuery && filteredResults.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
              <span>💡</span> Tavsiyalar
            </h3>
            <div className="flex flex-wrap gap-2">
              {[...new Set(
                filteredResults
                  .slice(0, 5)
                  .flatMap(r => r.tags || [])
              )].slice(0, 8).map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-purple-800/30 text-purple-300 border border-purple-700/50 rounded-lg px-3 py-1 text-xs hover:bg-purple-700/40 hover:text-yellow-400 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NATIJALAR HEADER */}
        {hasQuery && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {resultCount === 0 ? (
                  <span className="text-red-400">Hech narsa topilmadi</span>
                ) : (
                  <>
                    <span className="text-yellow-400">{resultCount}</span>
                    <span className="text-purple-300"> ta natija</span>
                    <span className="text-purple-500 text-sm ml-2">
                      &quot;{searchQuery}&quot; uchun
                    </span>
                  </>
                )}
              </h2>
            </div>
            <div className="flex gap-2">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    viewMode === mode.id
                      ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                      : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span className="hidden sm:inline">{mode.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BO'SH HOLAT */}
        {hasQuery && filteredResults.length === 0 && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-10 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Hech narsa topilmadi
            </h3>
            <p className="text-purple-300 mb-6">
              <span className="text-yellow-400">&quot;{searchQuery}&quot;</span> uchun natija yo&apos;q.
              Boshqa kalit so&apos;zlarni sinab ko&apos;ring.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <p className="text-purple-400 text-sm mb-2 w-full">Ehtimol, shularni qidiryapsizmi?</p>
              {POPULAR_SEARCHES.slice(0, 6).map((query, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(query)}
                  className="bg-purple-800/30 text-purple-300 border border-purple-700/50 rounded-lg px-3 py-1.5 text-sm hover:bg-yellow-600/30 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NATIJALAR — KARTALAR */}
        {hasQuery && filteredResults.length > 0 && viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="group bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all transform hover:-translate-y-1"
                onClick={() => saveSearch(searchQuery.trim())}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.category === "O'quv" ? "bg-blue-600/30 text-blue-400 border border-blue-600/50" :
                    item.category === "Ilmiy" ? "bg-cyan-600/30 text-cyan-400 border border-cyan-600/50" :
                    item.category === "Birikma" ? "bg-yellow-600/30 text-yellow-400 border border-yellow-600/50" :
                    item.category === "Tahlil" ? "bg-green-600/30 text-green-400 border border-green-600/50" :
                    "bg-pink-600/30 text-pink-400 border border-pink-600/50"
                  }`}>
                    {item.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-purple-300 text-xs mb-3 line-clamp-2">
                  {item.desc}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(item.tags || []).slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 bg-purple-950/50 border border-purple-700/50 rounded-full text-purple-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-purple-700/30">
                  <span className="text-[10px] text-purple-500 font-mono">
                    {item.path}
                  </span>
                  <span className="text-yellow-400 text-sm group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* NATIJALAR — RO'YXAT */}
        {hasQuery && filteredResults.length > 0 && viewMode === "list" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl overflow-hidden">
            {filteredResults.map((item, i) => (
              <Link
                key={item.id}
                href={item.path}
                className={`group flex items-center gap-4 p-4 hover:bg-purple-800/40 transition-colors ${
                  i !== filteredResults.length - 1 ? "border-b border-purple-700/30" : ""
                }`}
                onClick={() => saveSearch(searchQuery.trim())}
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.category === "O'quv" ? "bg-blue-600/30 text-blue-400" :
                      item.category === "Ilmiy" ? "bg-cyan-600/30 text-cyan-400" :
                      item.category === "Birikma" ? "bg-yellow-600/30 text-yellow-400" :
                      item.category === "Tahlil" ? "bg-green-600/30 text-green-400" :
                      "bg-pink-600/30 text-pink-400"
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-purple-500">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-purple-300 text-xs truncate">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-purple-500 font-mono hidden md:block">
                    {item.path}
                  </span>
                  <span className="text-yellow-400 text-xl group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* NATIJALAR — GRID */}
        {hasQuery && filteredResults.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="group bg-purple-900/40 border border-purple-700/50 rounded-xl p-4 hover:border-yellow-400/50 transition-all text-center"
                onClick={() => saveSearch(searchQuery.trim())}
                title={item.title}
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xs font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  item.category === "O'quv" ? "bg-blue-600/30 text-blue-400" :
                  item.category === "Ilmiy" ? "bg-cyan-600/30 text-cyan-400" :
                  item.category === "Birikma" ? "bg-yellow-600/30 text-yellow-400" :
                  item.category === "Tahlil" ? "bg-green-600/30 text-green-400" :
                  "bg-pink-600/30 text-pink-400"
                }`}>
                  {item.category}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* KLAVIATURA YORLIQLARI */}
        <div className="bg-purple-900/30 border border-purple-700/30 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
            <span>⌨️</span> Klaviatura yorliqlari
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono text-yellow-400">Ctrl+K</kbd>
              <span className="text-purple-400">Qidiruvga fokus</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono text-yellow-400">Esc</kbd>
              <span className="text-purple-400">Tozalash</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono text-yellow-400">Enter</kbd>
              <span className="text-purple-400">Qidirish</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono text-yellow-400">↑ ↓</kbd>
              <span className="text-purple-400">Navigatsiya</span>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="flex justify-between pt-6">
          <Link href="/" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Bosh sahifa
          </Link>
          <Link href="/oquv" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">
            O'quv bo'limi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/30 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • JDA KIMYO</p>
          <p className="mt-1">
            🔍 Global qidiruv tizimi • {ALL_CONTENT.length}+ sahifadan tezkor qidiruv
          </p>
        </div>
      </footer>
    </main>
  )
}