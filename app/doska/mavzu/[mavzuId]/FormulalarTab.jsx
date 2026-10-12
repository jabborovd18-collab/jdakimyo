// app/doska/mavzu/[mavzuId]/FormulalarTab.jsx
//
// Smart Doska — Chuqur Ilmiy Laboratoriya & Formulalar Tahlili (Premium Universitet Standarti).
// 7 ta fundamental ilmiy modul:
// 1. Lengmyur & Chiziqli Regressiya (Hanes-Woolf, Lineweaver-Burk, Eadie-Hofstee)
// 2. Freyndlix & Logarifmik Regressiya (1/n Geterogenlik tahlili)
// 3. BET Ko'p Qatlamli Modeli & N₂ (77 K) Solishtirma Sirti (S_BET)
// 4. Gibbs Adsorbsiya Tenglamasi & Shishkovskiy Sirt Tarangligi (s₀ molekula maydoni)
// 5. Kelvin Tenglamasi & Mezog'ovaklar Kapillyar Gisterezisi (IUPAC IV tur)
// 6. Adsorbsiya Termodinamikasi & Izosterik Issiqlik (q_st, ΔH, ΔG, ΔS)
// 7. Dyuklo-Traube Qoidasi & Gomologik Qator Sirt Faolligi (β ≈ 3.2)
"use client";

import { useState, useMemo, useEffect } from "react";
import LatexMatn from "@/components/LatexMatn";
import {
  LENGMYUR_PRESETLARI,
  FREYNDLIX_PRESETLARI,
  LengmyurIzotermaGrafik,
  FreyndlixIzotermaGrafik,
  BetIzotermaGrafik,
  KelvinGisterezisGrafik,
  TermodinamikaIzosterikGrafik,
  TraubeIzotermaGrafik,
  TRAUBE_KISLOTALAR,
} from "./IzotermaGrafiklar";

// Turli modullarning ob'ekt kalitlarini aniqlash (universitet darajasidagi barqarorlik)
function getMaydonlar(qator) {
  if (!qator) return { xKey: "x", yKey: "y" };
  if (qator.ce !== undefined) return { xKey: "ce", yKey: "a" };
  if (qator.pNisbiy !== undefined && qator.a !== undefined) return { xKey: "pNisbiy", yKey: "a" };
  if (qator.c !== undefined) return { xKey: "c", yKey: "sigma" };
  if (qator.r !== undefined) return { xKey: "r", yKey: "pNisbiy" };
  if (qator.tK !== undefined) return { xKey: "tK", yKey: "p" };
  if (qator.n !== undefined) return { xKey: "n", yKey: "g" };
  const keys = Object.keys(qator);
  return { xKey: keys[0] || "x", yKey: keys[1] || "y" };
}

// ═══ 7 TA ILMIY MODULNING CHUQUR NAZARIY MA'LUMOTLAR LUG'ATI ═══
const CHUQUR_NAZARIYA_LUGATI = {
  "lengmyur-regressiya": {
    nomi: "Lengmyur Monomolekulyar Adsorbsiya Nazariyasi",
    keltiribChiqarilishi:
      "Irving Lengmyur (1916, Nobel mukofoti 1932) gaz va qattiq jism chegarasidagi kinetik muvozanatni tahlil qildi. Adsorbsiya tezligi erkin markazlar ulushi (1 - θ) va konsentratsiyaga to'g'ri mutanosib: v_ads = k_a · C · (1 - θ). Desorbsiya tezligi esa band markazlar ulushiga mutanosib: v_des = k_d · θ · e^(-E/RT). Dinamik muvozanatda v_ads = v_des tenglashib, θ = (K·C) / (1 + K·C) kelib chiqadi. Bu yerda K = k_a / k_d muvozanat doimiysi. Monoqavat to'yinish sig'imi a_m bo'lganda: a = (a_m · K · C) / (1 + K · C).",
    hadlar: [
      { belgi: "C_e", nom: "Muvozanat konsentratsiyasi (yoki P gaz bosimi)", birlik: "mmol/L (yoki Pa)", izoh: "Eritmadagi erkin qolgan adsorbat miqdori" },
      { belgi: "a", nom: "Adsorbsiya miqdori", birlik: "mmol/g", izoh: "1 gramm adsorbent yuzasiga birikkan modda mol miqdori" },
      { belgi: "a_m", nom: "Maksimal monoqavat sig'imi", birlik: "mmol/g", izoh: "Barcha faol markazlar to'lgandagi chegaraviy plato" },
      { belgi: "K", nom: "Lengmyur adsorbsiya doimiysi", birlik: "L/mmol", izoh: "Adsorbent va adsorbatning o'zaro yaqinlik (affinitet) o'lchovi" },
      { belgi: "θ", nom: "Sirtning qoplanish darajasi", birlik: "0..1 (yoki %)", izoh: "θ = a / a_m nisbati" },
    ],
    amaliyot:
      "Tibbiyotda gematsorbsiya (qonni zaharli toksinlardan tozalash), sanoatda faollashtirilgan ko'mir yordamida zaharli gazlarni yutish va fermentativ kinetikada Mixaelis-Menten modeli sifatida keng qo'llaniladi.",
    iupacTasnifi:
      "IUPAC tasnifi bo'yicha I turdagi izoterma. Faqat mikrog'ovakli (r < 2 nm) adsorbentlar yoki kimyosorbtsiyada qat'iy to'yinish platosiga ega bo'ladi.",
    metodikTavsiya:
      "O'quvchilarga C_e → ∞ ga intilganda a qiymati a_m platosiga intilishini, Hanes-Woolf chiziqli grafigida esa qiyalik burchagi aynan 1/a_m ga teng ekanini ko'rsating.",
  },
  "freyndlix-regressiya": {
    nomi: "Freyndlix Empirik va Geterogen Sirt Modeli",
    keltiribChiqarilishi:
      "Gerbert Freyndlix (1909) real adsorbentlar yuzasi energetik jihatdan nobirjinsli ekanini ko'rsatdi. Zeldovich va Temkin nazariyasiga ko'ra, sirt markazlarining adsorbsiya energiyasi eksponentsial taqsimotga bo'ysunganda (q_i = q_0 - α·ln θ), barcha markazlar bo'yicha integrallash natijasida a = K_F · C^(1/n) logarifmik darajali tenglamasi kelib chiqadi. Chiziqlashtirilgan shakli: lg a = lg K_F + (1/n) · lg C_e.",
    hadlar: [
      { belgi: "K_F", nom: "Freyndlix sig'im doimiysi", birlik: "(mmol/g)·(L/mmol)^(1/n)", izoh: "Adsorbentning shartli adsorbsion sig'imi" },
      { belgi: "1/n", nom: "Geterogenlik ko'rsatkichi (qiyalik)", birlik: "0..1 (o'lchovsiz)", izoh: "0.1 < 1/n < 0.5 — qulay yuqori adsorbsiya; 1/n = 1 — chiziqli Genri sohasi; 1/n > 1 — noqulay" },
      { belgi: "n", nom: "Adsorbsiya intensivligi", birlik: "n > 1", izoh: "Jarayonning o'z-o'zidan termodinamik borish qobiliyati" },
    ],
    amaliyot:
      "Oqova suvlarni bo'yoqlardan, og'ir metall kationlaridan (Pb²⁺, Cd²⁺, Cu²⁺) tozalashda tabiiy minerallar (bentonit, tseolit, montmorillonit gillar) tahlilida standart model hisoblanadi.",
    iupacTasnifi:
      "Chegaraviy to'yinish platosiga ega emas. Faqat o'rtacha konsentratsiyalarda tajribaga mos keladi (C → 0 da hosila cheksizga intilishi, C → ∞ da esa cheksiz o'sishi uning fizik chegarasi hisoblanadi).",
    metodikTavsiya:
      "Doskada energetik relyefni namoyish qiling: konsentratsiya past bo'lganda avval chuqur potensial o'ralar (65 kJ/mol), konsentratsiya oshgach esa sayoz o'ralar to'lishini ta'kidlang.",
  },
  "bet-modeli": {
    nomi: "BET (Brunauer-Emmett-Teller) Ko'p Qatlamli Adsorbsiya Modeli",
    keltiribChiqarilishi:
      "1938 yilda S. Brunauer, P. Emmett va E. Teller tomonidan taklif etilgan. Gaz molekulalari faqat qattiq jism bilan emas, balki bir-biri bilan ham Van-der-Vaals kuchlari orqali ta'sirlashib, ko'p qatlamli kondensatsiyani yuzaga keltiradi. 1-qavat adsorbsiya issiqligi E_1, keyingi barcha qatlamlar esa gazning kondensatsiya issiqligiga (E_L) teng deb olinadi. Cheksiz qatlamlar geometrik progressiya yig'indisi orqali: p / [a·(p_0 - p)] = 1/(a_m · C) + [(C - 1)/(a_m · C)] · (p / p_0).",
    hadlar: [
      { belgi: "p / p_0", nom: "Nisbiy to'yingan bug' bosimi", birlik: "0..1 (o'lchovsiz)", izoh: "Gaz bosimining to'yingan bug' bosimiga nisbati" },
      { belgi: "a_m", nom: "Monomolekulyar qatlam sig'imi", birlik: "mmol/g", izoh: "Sirt to'liq bitta molekula qatlami bilan qoplangandagi miqdor" },
      { belgi: "C_BET", nom: "BET doimiysi", birlik: "C ≈ e^((E_1 - E_L)/RT)", izoh: "1-qatlam va keyingi qatlamlar adsorbsiya energiyasi farqi" },
      { belgi: "S_BET", nom: "Haqiqiy solishtirma sirt maydoni", birlik: "m²/g", izoh: "S_BET = a_m · N_A · ω (azot uchun ω = 0.162 nm²)" },
      { belgi: "ω_(N2)", nom: "Azot molekulasi ko'ndalang kesim yuzi", birlik: "0.162 nm²", izoh: "77 K dagi suyuq azot molekulasining xalqaro standarti" },
    ],
    amaliyot:
      "Dunyo bo'ylab barcha nanomateriallar (MOF metall-organik karkaslar, grafen, nanotrubkalar, aerogellar, silikagellar va neftni qayta ishlash kreking katalizatorlari) sirtini o'lchashning yagona rasmiy standarti.",
    iupacTasnifi:
      "IUPAC II turdagi (makrog'ovaklar) va IV turdagi (mezog'ovaklar) izotermalarning boshlang'ich qismiga mos keladi. ISO 9277 standarti bo'yicha chiziqlilik faqat 0.05 ≤ p/p_0 ≤ 0.35 oralig'ida kafolatlanadi.",
    metodikTavsiya:
      "O'quvchilarga C_BET > 50 bo'lganda II tur (keskin tizza nuqtasi), C_BET < 2 bo'lganda esa III tur (egriliksiz to'g'ridan-to'g'ri ko'p qatlam) hosil bo'lishini slayderda ko'rsating.",
  },
  "gibbs-sirt-taranglik": {
    nomi: "Gibbs Fundamental Sirt Adsorbsiyasi & Shishkovskiy Tenglamasi",
    keltiribChiqarilishi:
      "J. Willard Gibbs (1878) sirt fazasi termodinamikasidan kelib chiqib, dG = -S dT + V dP + σ ds + Σ μ_i dn_i tenglamasini taklif qildi. Izotermik holatda sirt bosimi dσ = -Σ Γ_i dμ_i ga teng. Eritmadagi erkin SFM uchun dμ = RT · d(ln C) bo'lgani sababli: Γ = -(C / RT) · (dσ / dC). B. Shishkovskiy (1908) tajribada σ = σ_0 - B · ln(1 + A·C) qonuniyatini kashf etdi. Uning hosilasi dσ/dC = -(A·B)/(1 + A·C) ni Gibbs tenglamasiga qo'ysak, Lengmyur izotermasi formulasi kelib chiqadi: Γ = Γ_∞ · (A·C)/(1 + A·C).",
    hadlar: [
      { belgi: "Γ", nom: "Sirt ortiqchaligi (adsorbsiya)", birlik: "µmol/m²", izoh: "Sirt qatlamidagi modda konsentratsiyasining hajmga nisbatan ortiqchaligi" },
      { belgi: "σ", nom: "Sirt taranglik koeffitsiyenti", birlik: "mN/m (yoki dyn/sm)", izoh: "Toza suv: 72.8 mN/m (298 K da)" },
      { belgi: "dσ/dC", nom: "Sirt faolligi hosilasi", birlik: "mN·L/(m·mol)", izoh: "SFM konsentratsiyasi ortishi bilan sirt taranglik pasayish tezligi" },
      { belgi: "s_0", nom: "Bitta molekula egallagan minimal yuza", birlik: "nm² (yoki Å²)", izoh: "s_0 = 1 / (Γ_∞ · N_A) zich monoqatlamda" },
      { belgi: "KBM (CMC)", nom: "Kritik misella hosil bo'lish konsentratsiyasi", birlik: "mol/L", izoh: "Sirt to'yib, eritmada sferik misellalar shakllanish boshlanishi" },
    ],
    amaliyot:
      "Dori vositalarini organizmga nishonli yetkazuvchi misellyar eritmalar, shampun va yuvish vositalari, oziq-ovqat emulsiyalari (mayonez, sut) va flotatsiya orqali rudalarni boyitish sanoati.",
    iupacTasnifi:
      "Suyuqlik-gaz va suyuqlik-suyuqlik chegarasidagi hodisa. KBM ga qadar sirt taranglik keskin pasayadi, KBM dan keyin esa deyarli doimiy (plato) bo'lib qoladi.",
    metodikTavsiya:
      "Dyu Nui halqasini uzish kuchi F = 4πRσ ekanini va C ≥ 0.05 mol/L bo'lganda sirtda palisad tik turib, suv ichida sferik misellalar aylana boshlashini vizual ko'rsating.",
  },
  "kelvin-kapillyar": {
    nomi: "Kelvin Tenglamasi & Mezog'ovaklar Kapillyar Gisterezisi",
    keltiribChiqarilishi:
      "Uilyam Tomson (Lord Kelvin, 1871) botiq menisk ostidagi suyuqlik ustuni tekis sirtga nisbatan manfiy Laplas bosimiga ega ekanini isbotladi: ΔP = -(2σ / r) · cos θ. Kimyoviy potensiallar tengligidan RT · ln(p / p_0) = -ΔP · V_m kelib chiqadi. Natijada Kelvin tenglamasi: ln(p / p_0) = -(2σ · V_m) / (r · R · T) · cos θ. Bu tenglama botiq meniskda to'yingan bug' bosimi tekis sirtdagiga qaraganda sezilarli past ekanini va bug' p/p_0 < 1 da suyuqlikka aylanishini (kapillyar kondensatsiya) tushuntiradi.",
    hadlar: [
      { belgi: "r", nom: "Mezog'ovakning samarali radiusi", birlik: "nm (10⁻⁹ m)", izoh: "Mezog'ovaklar o'lchami: 2 nm ≤ r ≤ 50 nm" },
      { belgi: "V_m", nom: "Suyuqlikning molyar hajmi", birlik: "18·10⁻⁶ m³/mol (suv uchun)", izoh: "1 mol suyuqlik egallagan hajm" },
      { belgi: "θ", nom: "Ho'llashning chekka burchagi", birlik: "gradus", izoh: "To'liq ho'llaganda θ = 0°, cos θ = 1" },
      { belgi: "p / p_0", nom: "Kondensatsiya nisbiy bosimi", birlik: "0..1", izoh: "G'ovak ichida suyuqlik paydo bo'ladigan bosim" },
      { belgi: "2/r", nom: "Meniskning o'rtacha egriligi", birlik: "nm⁻¹", izoh: "Radius qancha kichik bo'lsa, egrilik va tortishish shuncha kuchli" },
    ],
    amaliyot:
      "Silikagelli nam quritgichlar, gaz separatorlari, binolarning g'ovakli devorlarida namlik to'planishini hisoblash hamda BJH usuli bilan materiallarning g'ovak o'lchamlari taqsimotini aniqlash.",
    iupacTasnifi:
      "IUPAC IV va V turdagi izotermalar. Adsorbsiya va desorbsiya egri chiziqlari bir-biriga to'g'ri kelmasdan, gisterezis halqasini (H1 silindr, H2 butilka, H3/H4 yoriqsimon g'ovaklar) hosil qiladi.",
    metodikTavsiya:
      "Adsorbsiyada silindrsimon plyonka qalinlashishi (egrilik radiusi r), desorbsiyada esa yarimsferik menisk (egrilik radiusi 2r) orqali bug'lanish ro'y berishini va shuning uchun desorbsiya har doim pastroq bosimda kechishini ta'kidlang.",
  },
  "termodinamika-izosterik": {
    nomi: "Adsorbsiya Termodinamikasi & Izosterik Issiqlik (q_st)",
    keltiribChiqarilishi:
      "Adsorbsiya jarayoni doimiy adsorbsiya miqdorida (a = const) Klauzius-Klapeyron tenglamasiga bo'ysunadi: (∂ ln P / ∂ T)_a = q_st / (R·T²). Bu yerdan (∂ ln P / ∂(1/T))_a = -q_st / R. Ikki xil harorat (T_1 va T_2) dagi muvozanat bosimlari p_1 va p_2 ma'lum bo'lsa, izosterik issiqlik integral formulasi: q_st = R · [T_1 · T_2 / (T_2 - T_1)] · ln(p_2 / p_1). Termodinamik funksiyalar: ΔH = -q_st (doimo ekzotermik ΔH < 0); ΔG° = -RT·ln K < 0 (spontan); ΔS = (ΔH - ΔG) / T < 0 (gaz molekulalari sirtga bog'langach, erkinlik darajasi 3D dan 2D ga tushadi, tartiblilik ortadi).",
    hadlar: [
      { belgi: "q_st", nom: "Izosterik adsorbsiya issiqligi", birlik: "kJ/mol", izoh: "Doimiy qoplanishda sirtga birikish paytida ajraladigan haqiqiy issiqlik" },
      { belgi: "ΔH", nom: "Adsorbsiya entalpiyasi", birlik: "kJ/mol", izoh: "ΔH = -q_st (Fizisorbtsiya: < 42 kJ/mol; Xemiksorbtsiya: > 84 kJ/mol)" },
      { belgi: "ΔG", nom: "Gibbs erkin energiyasi", birlik: "kJ/mol", izoh: "O'z-o'zidan borishi uchun har doim ΔG < 0 bo'lishi shart" },
      { belgi: "ΔS", nom: "Adsorbsiya entropiyasi", birlik: "J/(mol·K)", izoh: "Erkinlik darajalari kamaygani uchun doimo manfiy (ΔS < 0)" },
    ],
    amaliyot:
      "Sanoatda adsorbentlarni regeneratsiya (qayta tiklash) qilish haroratini tanlash, gaz niqoblarining qizib ketish xavfini hisoblash va kalorimetrik reaktorlar loyihalash.",
    iupacTasnifi:
      "Fizikaviy va kimyoviy adsorbsiyani bir-biridan ajratishning bosh mezonidir. Harorat oshirilganda Le Shatelye printsipiga binoan ekzotermik adsorbsiya muvozanati desorbsiya tomon siljiydi.",
    metodikTavsiya:
      "Simobli termometr ustuni q_st ga qarab ko'tarilishini va Le Shatelye printsipiga ko'ra T_1 dan T_2 ga qizdirilganda nima sababdan bosim p_1 dan p_2 ga oshib, gaz desorbsiyalanishini tushuntiring.",
  },
  "dyuklo-traube-qoidasi": {
    nomi: "Dyuklo-Traube Qoidasi & Sirt Faolligi Gomologiyasi",
    keltiribChiqarilishi:
      "E. Dyuklo (1871) va I. Traube (1891) bir asosli to'yingan yog' kislotalari, alifatik spirtlar va aminlarning suvli eritmalarini o'rganib, sirt faolligi G = -lim(C→0) (dσ/dC) har bir qo'shimcha -CH₂- guruhi hisobiga β ≈ 3.0–3.5 (o'rtacha 3.2) barobar ortishini kashf etdilar: G_(n+1) / G_n = β ≈ 3.2. I. Lengmyur bunga termodinamik tushuntirish berdi: bitta -CH₂- guruhini suv hajmidan sirtga o'tkazishdagi erkin energiya yutug'i W = Δ(ΔG°) = -RT · ln β ≈ -8.314 · 298 · ln(3.2) ≈ -3.2 kJ/mol ga teng.",
    hadlar: [
      { belgi: "G_0", nom: "Boshlang'ich sirt faolligi", birlik: "mN·L/(m·mol)", izoh: "G = -dσ/dC (C → 0 dagi boshlang'ich qiyalik tangensi)" },
      { belgi: "β", nom: "Traube koeffitsiyenti", birlik: "≈ 3.2 karra", izoh: "Gomologik qatorda har bir keyingi a'zoning sirt faolligi ortish karraligi" },
      { belgi: "W (ΔΔG°)", nom: "-CH₂- guruhining adsorbsiya ishi", birlik: "≈ -3.2 kJ/mol", izoh: "Gidrofob zanjir uzayganda suvdan siqib chiqarilish termodinamik yutug'i" },
      { belgi: "n", nom: "Uglevodorod zanjiridagi uglerodlar soni", birlik: "dona", izoh: "Chumoli (1), Sirka (2), Propion (3), Moy (4), Valerian (5)" },
    ],
    amaliyot:
      "Biotexnologiyada va farmakologiyada dorilarning hujayra membranalaridan o'tuvchanligini (Overton qoidasi), antiseptiklar va gerbitsidlarning biologik faolligini prognozlash.",
    iupacTasnifi:
      "Faqat suvli (qutbli) eritmalarda amal qiladi. Qutbsiz organik erituvchilarda (benzol, geksan) aksincha teskari Traube effekti (qutbli boshchalar sirtga intilishi) kuzatiladi.",
    metodikTavsiya:
      "Suvning vodorod bog'lari kuchli ekani, uzun uglevodorod zanjiri suv strukturasiga xalaqit bergani sababli termodinamika uni 'tashqariga' (sirtga) itarib chiqarishini (gidrofob samara) ta'kidlang.",
  },
};

// ═══ 7 TA ILMIY MODUL UCHUN INTERAKTIV LABORATORIYA YO'RIQNOMALARI & PROTOKOLLARI ═══
const MODUL_LAB_YORIQNOMALARI = {
  "lengmyur-regressiya": {
    nomi: "1-Modul: Lengmyur Monomolekulyar Adsorbsiya Tajribasi",
    qadamlar: [
      { raqam: 1, sarlavha: "Adsorbent namunasini tanlang", matn: "Tepadagi 4 ta real presetdan birini tanlang (masalan, BAU-A ko'mir + Benzol yoki Tseolit + CO₂). Har birining o'z a_m va K parametrlari bor." },
      { raqam: 2, sarlavha: "Konsentratsiya va Haroratni o'zgartiring", matn: "Konsentratsiya (C) slayderini suring: past konsentratsiyada chiziqli Genri sohasi, yuqori konsentratsiyada gorizontal to'yinish platosini kuzating." },
      { raqam: 3, sarlavha: "Sirt to'lishi va Kinetik muvozanat", matn: "16 ta faol markazning to'lishini (θ) va adsorbsiya (v_ads) hamda desorbsiya (v_des) tezliklari tenglashgan dinamik muvozanat holatini tekshiring." },
      { raqam: 4, sarlavha: "Freyndlix bilan taqqoslang", matn: "⚖️ Freyndlix bilan solishtirish tugmasini yoqing: geterogen modelda platoga ega emasligini Lengmyur bilan solishtiring." },
    ],
    xulosa: "Maksimal monoqavat to'lgach (θ = 1.0), yangi qatlam hosil bo'lmaydi va adsorbsiya a_m platosiga chiqadi.",
  },
  "freyndlix-regressiya": {
    nomi: "2-Modul: Freyndlix Geterogen Sirt Tajribasi",
    qadamlar: [
      { raqam: 1, sarlavha: "Tuproq yoki Mineralli Sorbentni tanlang", matn: "Qora tuproq gumusi, daryo loyqasi yoki torf filtrini tanlang." },
      { raqam: 2, sarlavha: "1/n intensivlik darajasini sinang", matn: "1/n < 1 bo'lganda egri chiziq qabariq bo'ladi: avval yuqori energiyali chuqur markazlar (65 kJ/mol), keyin sayoz markazlar to'ladi." },
      { raqam: 3, sarlavha: "Energetik relyefni kuzating", matn: "Pastdagi 16 ta potensial o'ralar profilida sirtning notekis to'lish dinamikasini ko'ring." },
    ],
    xulosa: "Sirt energetik jihatdan bir xil emasligi sababli qat'iy to'yinish platosi mavjud emas, adsorbsiya logarifmik o'sadi.",
  },
  "bet-modeli": {
    nomi: "3-Modul: BET Ko'p Qatlamli Adsorbsiya & Solishtirma Sirt Maydoni (S_BET)",
    qadamlar: [
      { raqam: 1, sarlavha: "Nisbiy bug' bosimini (p/p₀) oshiring", matn: "p/p₀ slayderini 0.01 dan 0.95 gacha suring: 1-qatlam, 2-qatlam va 3-qatlamlarning ketma-ket to'planishini kuzating." },
      { raqam: 2, sarlavha: "B nuqtasini aniqlang", matn: "p/p₀ ≈ 0.15 atrofidagi B nuqtada monomolekulyar qatlam to'liq to'ladi (θ = 1.0). Undan so'ng polimolekulyar kondensatsiya boshlanadi." },
      { raqam: 3, sarlavha: "ISO 9277 standart zonasini tekshiring", matn: "Chiziqli regressiya darchasi aynan 0.05 ≤ p/p₀ ≤ 0.35 oralig'ida bo'lgandagina S_BET aniq chiqishiga e'tibor bering." },
    ],
    xulosa: "Azot gazi (77 K, ω = 0.162 nm²) orqali nanog'ovak adsorbentning haqiqiy solishtirma sirti (m²/g) topiladi.",
  },
  "gibbs-sirt-taranglik": {
    nomi: "4-Modul: Gibbs Sirt Taranglik & KBM Mitsellalari Tajribasi",
    qadamlar: [
      { raqam: 1, sarlavha: "SFM konsentratsiyasini oshiring", matn: "Konsentratsiya (C) oshishi bilan suv sirt tarangligi 72.8 mN/m dan 28 mN/m gacha pasayishini kuzating." },
      { raqam: 2, sarlavha: "Palisad va Sirt ortiqchaligini ko'ring", matn: "SFM molekulalari sirtga joylashib, gidrofil boshchasi suvda, gidrofob dumi havoda tik turishini kuzating." },
      { raqam: 3, sarlavha: "KBM (Kritik Mitsella Hosil Bo'lishi) nuqtasini toping", matn: "C ≥ 0.05 mol/L da sirt to'yingach, suv ichida aylanuvchi sferik mitsellalar paydo bo'lishini ko'ring." },
    ],
    xulosa: "dσ/dC < 0 bo'lgani sababli sirt ortiqchaligi musbat (Γ > 0). KBM dan keyin sirt taranglik o'zgarmas bo'lib qoladi.",
  },
  "kelvin-kapillyar": {
    nomi: "5-Modul: Kelvin Kapillyar Kondensatsiya & Gisterezis Tajribasi",
    qadamlar: [
      { raqam: 1, sarlavha: "G'ovak morfologiyasini tanlang", matn: "Silindrsimon (H1), Butilka bo'g'zi (H2) yoki Yoriqsimon (H3/H4) mezog'ovak turini tanlang." },
      { raqam: 2, sarlavha: "Radius (r) slayderini o'zgartiring", matn: "Radius qancha tor (kichik) bo'lsa, kondensatsiya shuncha past nisbiy bosimda (p/p₀ < 1) boshlanadi." },
      { raqam: 3, sarlavha: "Gisterezis sirtmog'ini tahlil qiling", matn: "Adsorbsiya silindr plyonkasi orqali, Desorbsiya esa botiq yarimsferik menisk orqali kechishi sababli ikkita shox hosil bo'ladi." },
    ],
    xulosa: "Botiq menisk ustida to'yingan bug' bosimi tekis sirtdagidan past bo'lgani sababli gaz p/p₀ < 1 dayoq suyuqlikka aylanadi.",
  },
  "termodinamika-izosterik": {
    nomi: "6-Modul: Adsorbsiya Termodinamikasi & Mikrokalorimetriya",
    qadamlar: [
      { raqam: 1, sarlavha: "T₁ va T₂ haroratlarini belgilang", matn: "Birinchi izoterma (T₁) va ikkinchi izoterma (T₂) haroratlarini o'zgartiring." },
      { raqam: 2, sarlavha: "Klapeyron-Klauzius izosterasini tahlil qiling", matn: "a = 2.0 mmol/g darajasidagi gorizontal kesimda bosim p₁ dan p₂ ga siljishini kuzating." },
      { raqam: 3, sarlavha: "Termodinamik kattaliklarni baholang", matn: "q_st (izosterik issiqlik), ΔH (entalpiya < 0), ΔG (erkin energiya < 0) va ΔS (entropiya < 0) o'zgarishini ko'ring." },
      { raqam: 4, sarlavha: "Mikrokalorimetr va Termometrni kuzating", matn: "Adsorbsiya paytida ajralgan issiqlik tufayli simobli termometr ustuni ko'tarilishini kuzating." },
    ],
    xulosa: "Adsorbsiya har doim ekzotermik (ΔH < 0, q_st > 0). Harorat oshganda Le Shatelye printsipiga ko'ra desorbsiya kuchayadi.",
  },
  "dyuklo-traube-qoidasi": {
    nomi: "7-Modul: Dyuklo-Traube Qoidasi & Sirt Faolligi Gomologik Tajribasi",
    qadamlar: [
      { raqam: 1, sarlavha: "Gomologik kislotani tanlang", matn: "Chumoli (n=1), Sirka (n=2), Propion (n=3), Moy (n=4) yoki Valerian (n=5) kislotalaridan birini bosing. Molekula dumi uzunligi o'zgarishini ko'ring." },
      { raqam: 2, sarlavha: "Konsentratsiya (C) slayderini suring", matn: "Konsentratsiya ortishi bilan suv-havo chegarasida palisad zichlashishi va sirt taranglik pasayishini kuzating." },
      { raqam: 3, sarlavha: "Stalagmometr tomchilarini hisoblang", matn: "Sirt taranglik pasayganda tomchilar massasi kamayib, tomish tezligi va tomchilar soni keskin ko'payishini ko'ring." },
      { raqam: 4, sarlavha: "Traube koeffitsiyenti β ≈ 3.2 ni isbotlang", matn: "Har bir -CH₂- guruhi qo'shilganda suv molekulalari dumni siqib chiqarishi tufayli sirt faolligi 3.2 barobar ortadi (W ≈ 3.2 kJ/mol)." },
    ],
    xulosa: "Gidrofob samara: uglevodorod zanjiri uzayishi bilan molekulaning suvdan sirtga itarib chiqarilishi geometrik progressiyada kuchayadi.",
  },
};

export default function FormulalarTab({ mavzu }) {
  const modullar = mavzu.chuqurModullar || [];
  const [faolModulId, setFaolModulId] = useState(modullar[0]?.id || "");
  const [ichkiRejim, setIchkiRejim] = useState("animatsiya"); // "animatsiya" | "jadval" | "regressiya" | "nazariya"
  const [yoriqnomaOchiq, setYoriqnomaOchiq] = useState(true);

  const faolModul = modullar.find((m) => m.id === faolModulId) || modullar[0];

  // Tajriba jadvali holati (foydalanuvchi tahrirlashi mumkin)
  const [jadvalMalumotlar, setJadvalMalumotlar] = useState(() => {
    const boshlangich = {};
    modullar.forEach((m) => {
      if (m.tajribaNamunasi) {
        boshlangich[m.id] = JSON.parse(JSON.stringify(m.tajribaNamunasi));
      }
    });
    return boshlangich;
  });

  // Simulyatsiya slayderlari va sozlamalari
  const [lengmyurTransformatsiya, setLengmyurTransformatsiya] = useState("hanes"); // "hanes" | "lineweaver" | "eadie"
  const [lengmyurPresetIdx, setLengmyurPresetIdx] = useState(0);
  const [lengmyurC, setLengmyurC] = useState(0.05); // mol/L (konsentratsiya)
  const [lengmyurT, setLengmyurT] = useState(298); // K (harorat)
  const [lengmyurBonusMol, setLengmyurBonusMol] = useState(0); // doskadan qo'lda qo'shilgan
  const [lengmyurTaqqosla, setLengmyurTaqqosla] = useState(false); // Freyndlix bilan solishtirish
  const [freyndlixPresetIdx, setFreyndlixPresetIdx] = useState(0);
  const [freyndlixC, setFreyndlixC] = useState(0.05); // mol/L
  const [freyndlixN, setFreyndlixN] = useState(0.55); // 1/n geterogenlik darajasi
  const [freyndlixTaqqosla, setFreyndlixTaqqosla] = useState(false); // Lengmyur bilan solishtirish
  const [betPnisbiy, setBetPnisbiy] = useState(0.18); // p / p0
  const [betCParam, setBetCParam] = useState(120); // C parametri
  const [gibbsC, setGibbsC] = useState(0.02); // mol/L
  const [kelvinR, setKelvinR] = useState(4); // nm
  const [kelvinGovakTuri, setKelvinGovakTuri] = useState("silindr"); // "silindr" | "butilka" | "yoriq"
  const [termoT1, setTermoT1] = useState(273); // K
  const [traubeKislotaIdx, setTraubeKislotaIdx] = useState(2); // Propion kislota
  const [traubeC, setTraubeC] = useState(0.02); // mol/L
  const [traubeTomchilarSoni, setTraubeTomchilarSoni] = useState(0);
  const [traubeAvtoTomizish, setTraubeAvtoTomizish] = useState(false);

  // Tajriba jadvalini o'zgartirish
  const qatorOzgartir = (modulId, index, maydon, yangiQiymat) => {
    setJadvalMalumotlar((old) => {
      const nusxa = [...(old[modulId] || [])];
      if (nusxa[index]) {
        nusxa[index] = {
          ...nusxa[index],
          [maydon]: Number(yangiQiymat) || 0,
        };
      }
      return { ...old, [modulId]: nusxa };
    });
  };

  // Namuna tajribani qayta tiklash
  const namunaniTikla = (modulId) => {
    const modul = modullar.find((m) => m.id === modulId);
    if (modul && modul.tajribaNamunasi) {
      setJadvalMalumotlar((old) => ({
        ...old,
        [modulId]: JSON.parse(JSON.stringify(modul.tajribaNamunasi)),
      }));
    }
  };

  // ─── ENG KICHIK KVADRATLAR REGRESSIYASI (LEAST SQUARES) ───
  const regressiyaNatijasi = useMemo(() => {
    if (!faolModul) return null;

    const qatorlar = jadvalMalumotlar[faolModul.id] || [];
    if (qatorlar.length < 2) return null;

    let getX = faolModul.regressiyaX;
    let getY = faolModul.regressiyaY;
    let xNomi = faolModul.regressiyaXNomi;
    let yNomi = faolModul.regressiyaYNomi;
    let doimiylarFn = faolModul.doimiylarniTop;

    // Lengmyur uchun transformatsiya almashtirish
    if (faolModul.id === "lengmyur-regressiya") {
      if (lengmyurTransformatsiya === "lineweaver") {
        getX = (ce) => (ce > 0 ? 1 / ce : 0);
        getY = (ce, a) => (a > 0 ? 1 / a : 0);
        xNomi = "1 / C_e";
        yNomi = "1 / a";
        doimiylarFn = (qiyalik, kesim) => {
          const am = kesim > 0 ? 1 / kesim : 0;
          const k = am > 0 && qiyalik > 0 ? kesim / qiyalik : 0;
          return [
            { nom: "Maksimal monoqavat sig'imi (a_m)", qiymat: am, birlik: "mmol/g", izoh: "a_m = 1 / kesim" },
            { nom: "Lengmyur doimiysi (K)", qiymat: k, birlik: "L/mmol", izoh: "K = kesim / qiyalik" },
          ];
        };
      } else if (lengmyurTransformatsiya === "eadie") {
        getX = (ce, a) => (ce > 0 ? a / ce : 0);
        getY = (ce, a) => a;
        xNomi = "a / C_e";
        yNomi = "a";
        doimiylarFn = (qiyalik, kesim) => {
          const am = kesim;
          const k = qiyalik < 0 ? -1 / qiyalik : 0;
          return [
            { nom: "Maksimal monoqavat sig'imi (a_m)", qiymat: am, birlik: "mmol/g", izoh: "a_m = kesim" },
            { nom: "Lengmyur doimiysi (K)", qiymat: k, birlik: "L/mmol", izoh: "K = -1 / qiyalik" },
          ];
        };
      }
    }

    if (!getX || !getY) return null;

    const nuqtalar = qatorlar
      .map((q) => {
        const { xKey, yKey } = getMaydonlar(q);
        const xXom = q[xKey];
        const yXom = q[yKey];
        const x = getX(xXom, yXom);
        const y = getY(xXom, yXom);
        return { x, y, xXom, yXom };
      })
      .filter((n) => isFinite(n.x) && isFinite(n.y) && !isNaN(n.x) && !isNaN(n.y));

    if (nuqtalar.length < 2) return null;

    const N = nuqtalar.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    nuqtalar.forEach((p) => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
    });

    const maxraj = N * sumX2 - sumX * sumX;
    if (Math.abs(maxraj) < 1e-12) return null;

    const qiyalik = (N * sumXY - sumX * sumY) / maxraj;
    const kesim = (sumY - qiyalik * sumX) / N;

    // R^2 (determinatsiya koeffitsiyenti)
    const avgY = sumY / N;
    let ssTot = 0, ssRes = 0;
    nuqtalar.forEach((p) => {
      const yBashorat = qiyalik * p.x + kesim;
      ssTot += Math.pow(p.y - avgY, 2);
      ssRes += Math.pow(p.y - yBashorat, 2);
    });
    const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1;

    // Doimiylarni hisoblash
    const doimiylar = doimiylarFn ? doimiylarFn(qiyalik, kesim) : [];

    return {
      nuqtalar,
      qiyalik,
      kesim,
      r2,
      doimiylar,
      xNomi,
      yNomi,
      getX,
      getY,
    };
  }, [faolModul, jadvalMalumotlar, lengmyurTransformatsiya]);

  // Lengmyur dinamik muvozanat hisoblari
  const faolLengmyurPreset = LENGMYUR_PRESETLARI[lengmyurPresetIdx] || LENGMYUR_PRESETLARI[0];
  const lengmyurAm = faolLengmyurPreset.am;

  const lengmyurK = useMemo(() => {
    const K0 = faolLengmyurPreset.K || 30; // 298 K da muvozanat doimiysi
    const Q = 25000; // J/mol (adsorbsiya issiqligi)
    const R = 8.314;
    return K0 * Math.exp((Q / R) * (1 / (lengmyurT || 298) - 1 / 298));
  }, [lengmyurT, faolLengmyurPreset.K]);

  const lengmyurTheta = useMemo(() => {
    const baza = (lengmyurK * lengmyurC) / (1 + lengmyurK * lengmyurC);
    return Math.min(1, Math.max(0, baza + lengmyurBonusMol * 0.04));
  }, [lengmyurK, lengmyurC, lengmyurBonusMol]);

  const lengmyurA = useMemo(() => {
    return (lengmyurAm * lengmyurK * lengmyurC) / (1 + lengmyurK * lengmyurC);
  }, [lengmyurAm, lengmyurK, lengmyurC]);

  const lengmyurVads = useMemo(() => (40 * lengmyurC * (1 - lengmyurTheta)).toFixed(2), [lengmyurC, lengmyurTheta]);
  const lengmyurVdes = useMemo(() => {
    const k_d = (40 / (lengmyurK || 1)) * (lengmyurT / 298);
    return (k_d * lengmyurTheta).toFixed(2);
  }, [lengmyurK, lengmyurT, lengmyurTheta]);

  // Freyndlix energetik relyef markazlari va hisoblari
  const faolFreyndlixPreset = FREYNDLIX_PRESETLARI[freyndlixPresetIdx] || FREYNDLIX_PRESETLARI[0];
  const freyndlixA = useMemo(() => {
    return faolFreyndlixPreset.Kf * Math.pow(Math.max(0.0001, freyndlixC), freyndlixN);
  }, [faolFreyndlixPreset.Kf, freyndlixC, freyndlixN]);

  const freyndlixMarkazlar = useMemo(() => {
    const n = freyndlixN || 1.8;
    return Array.from({ length: 16 }).map((_, idx) => {
      const ulush = idx / 15;
      const energiya = Math.round(65 - Math.pow(ulush, 1 / n) * 50);
      const kritikC = 0.005 + Math.pow(ulush, 1 / n) * 0.12;
      const band = freyndlixC >= kritikC;
      return { idx, energiya, band, kritikC };
    });
  }, [freyndlixC, freyndlixN]);

  // BET ko'p qatlamli qoplanishi
  const betTheta = useMemo(() => {
    const x = Math.min(0.96, Math.max(0.01, betPnisbiy));
    const C = betCParam;
    return (C * x) / ((1 - x) * (1 + (C - 1) * x));
  }, [betPnisbiy, betCParam]);

  // Gibbs hisobi
  const gibbsNatija = faolModul?.id === "gibbs-sirt-taranglik" ? faolModul.hisobla(gibbsC) : null;
  // Kelvin hisobi
  const kelvinNatija = faolModul?.id === "kelvin-kapillyar" ? faolModul.hisobla(kelvinR) : null;
  // Termodinamika hisobi (273 K va 298 K dagi p1 va p2)
  const termoNatija = faolModul?.id === "termodinamika-izosterik"
    ? faolModul.hisobla(12.4, 38.6, termoT1, termoT2)
    : null;
  // Traube hisobi
  const traubeNatija = faolModul?.id === "dyuklo-traube-qoidasi"
    ? faolModul.hisobla(traubeKislotaIdx, traubeC)
    : null;

  // Traube avtomatik tomizish taymeri (sirt taranglikka proporsional chastota)
  useEffect(() => {
    if (!traubeAvtoTomizish || faolModul?.id !== "dyuklo-traube-qoidasi") return;
    const sigma = traubeNatija?.sigma || 72.8;
    // Sirt taranglik qancha past bo'lsa, tomchi shuncha tez uziladi (320ms .. 1100ms)
    const intervalMs = Math.max(320, Math.round((sigma / 72.8) * 1100));
    const timer = setInterval(() => {
      setTraubeTomchilarSoni((s) => s + 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [traubeAvtoTomizish, faolModul?.id, traubeNatija?.sigma]);

  if (!faolModul) {
    return <div className="text-slate-400 p-8 text-center">Modul mavjud emas</div>;
  }

  return (
    <div className="space-y-6">
      {/* ═══ 1. 7 TA CHUQUR ILMIY MODUL NAVIGATSIYASI ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {modullar.map((m, idx) => {
          const faol = m.id === faolModul.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setFaolModulId(m.id);
                setIchkiRejim("animatsiya");
              }}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                faol
                  ? "bg-emerald-950/60 border-emerald-500 text-white shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-500/40"
                  : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center justify-between">
                <span>Modul {idx + 1}</span>
                {faol && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <div className="font-bold text-xs text-white line-clamp-1 mb-0.5">
                {m.nomi.split(" ")[0]} {m.nomi.split(" ")[1] || ""}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {m.belgi}
              </div>
            </button>
          );
        })}
      </div>

      {/* ═══ 2. TANLANGAN MODUL KARTASI ═══ */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* MODUL SARLAVHASI VA FORMULA */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800 mb-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Chuqur Ilmiy Laboratoriya Moduli
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {faolModul.nomi}
            </h2>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {faolModul.tavsif}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-inner flex items-center justify-center shrink-0">
            <LatexMatn matn={faolModul.formulaLatex} inline={false} className="text-emerald-300 text-base sm:text-lg font-bold" />
          </div>
        </div>

        {/* ═══ 3. ICHKI REJIMLAR (ANIMATSIYA, JADVAL, REGRESSIYA, NAZARIYA) ═══ */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 w-fit mb-8">
          <button
            onClick={() => setIchkiRejim("animatsiya")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              ichkiRejim === "animatsiya"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🔬 Molekulyar Animatsiya & Simulyator</span>
          </button>

          {faolModul.tajribaNamunasi && (
            <button
              onClick={() => setIchkiRejim("jadval")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                ichkiRejim === "jadval"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📋 Tajriba Jadvali</span>
            </button>
          )}

          {faolModul.regressiyaX && (
            <button
              onClick={() => setIchkiRejim("regressiya")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                ichkiRejim === "regressiya"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📈 Chiziqli Regressiya (R²)</span>
            </button>
          )}

          <button
            onClick={() => setIchkiRejim("nazariya")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              ichkiRejim === "nazariya"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>📖 Ilmiy Farazlar & Tahlil</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            REJIM 1: MOLEKULYAR ANIMATSIYA & SIMULYATOR
           ═══════════════════════════════════════════════════════════════════ */}
        {ichkiRejim === "animatsiya" && (
          <div className="space-y-6">
            {/* 🧪 LABORATORIYA YO'RIQNOMASI VA AMALIY TOPSHIRIQLAR PROTOKOLI */}
            {MODUL_LAB_YORIQNOMALARI[faolModul.id] && (() => {
              const yoriq = MODUL_LAB_YORIQNOMALARI[faolModul.id];
              return (
                <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        🧪
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                          {yoriq.nomi}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Smart Doska laboratoriya mashg&apos;uloti bosqichlari & amaliy yo&apos;riqnoma
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setYoriqnomaOchiq(!yoriqnomaOchiq)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 font-medium transition flex items-center gap-1.5"
                    >
                      <span>{yoriqnomaOchiq ? "Yig'ish ▲" : "Ko'rsatish ▼"}</span>
                    </button>
                  </div>

                  {yoriqnomaOchiq && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {yoriq.qadamlar.map((q) => (
                          <div
                            key={q.raqam}
                            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 relative overflow-hidden group hover:border-emerald-500/40 transition"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600/40 text-[11px] font-bold flex items-center justify-center shrink-0">
                                {q.raqam}
                              </span>
                              <span className="text-xs font-bold text-slate-200 truncate">
                                {q.sarlavha}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {q.matn}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-2.5 text-xs text-emerald-200">
                        <span className="text-emerald-400 font-bold mt-0.5">🎯 Xulosa:</span>
                        <span className="leading-relaxed">{yoriq.xulosa}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* 1: LENGMYUR DINAMIK MUVOZANAT KINETIKASI (v_ads = v_des) */}
            {faolModul.id === "lengmyur-regressiya" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      Dinamik Muvozanat Kinetikasi: v_ads = v_des va Plato To&apos;yinishi
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Energetik bir jinsli sirtda har bir faol markazga faqat bitta molekula birikishi mumkin.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLengmyurBonusMol((b) => Math.min(10, b + 1))}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                    >
                      <span>+ Molekula tashlash</span>
                    </button>
                    <button
                      onClick={() => setLengmyurBonusMol(0)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 font-bold text-xs transition"
                      title="Qayta tiklash"
                    >
                      <span>Tozalash</span>
                    </button>
                  </div>
                </div>

                {/* 1.1 Haqiqiy laboratoriya tizimi shablonlari */}
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span>⚗️ Haqiqiy Laboratoriya Tizimi:</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {faolLengmyurPreset.tavsif}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LENGMYUR_PRESETLARI.map((pr, idx) => (
                      <button
                        key={pr.id}
                        type="button"
                        onClick={() => {
                          setLengmyurPresetIdx(idx);
                          setLengmyurC(pr.C);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition ${
                          lengmyurPresetIdx === idx
                            ? "bg-emerald-950 border-emerald-400 text-white ring-2 ring-emerald-500/40"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                        }`}
                      >
                        <div className="text-xs font-bold text-white truncate">{pr.nom.split("+")[0]}</div>
                        <div className="text-[10px] text-emerald-400 font-medium truncate">+{pr.nom.split("+")[1]}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-1">a_m={pr.am} • K={pr.K}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slayderlar bloki */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Konsentratsiya / Bosim (C yoki P):</span>
                      <span className="font-mono text-emerald-400 font-bold">{lengmyurC} mol/L</span>
                    </div>
                    <input
                      type="range"
                      min="0.005"
                      max="0.25"
                      step="0.005"
                      value={lengmyurC}
                      onChange={(e) => setLengmyurC(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.005 (Sayoz eritma)</span>
                      <span>0.25 (To&apos;yingan eritma)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Harorat (T):</span>
                      <span className="font-mono text-cyan-400 font-bold">{lengmyurT} K ({lengmyurT - 273} °C)</span>
                    </div>
                    <input
                      type="range"
                      min="273"
                      max="373"
                      step="2"
                      value={lengmyurT}
                      onChange={(e) => setLengmyurT(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>273 K (0 °C — Kuchli adsorbsiya)</span>
                      <span>373 K (100 °C — Desorbsiya ustun)</span>
                    </div>
                  </div>
                </div>

                {/* 1.2 Jonli SVG Izoterma grafigi & Solishtirish */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setLengmyurTaqqosla(!lengmyurTaqqosla)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                        lengmyurTaqqosla
                          ? "bg-amber-950/80 border-amber-500 text-amber-300 ring-2 ring-amber-500/30"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>⚖️ Freyndlix bilan solishtirish (Overlay)</span>
                      <span className="font-mono text-[10px]">{lengmyurTaqqosla ? "Yoqilgan" : "O'chiq"}</span>
                    </button>
                  </div>

                  <LengmyurIzotermaGrafik
                    am={lengmyurAm}
                    K={Math.round(lengmyurK)}
                    joriyC={lengmyurC}
                    joriyA={lengmyurA}
                    theta={lengmyurTheta}
                    taqqosla={lengmyurTaqqosla}
                    nInv={freyndlixN}
                  />
                </div>

                {/* Dinamik tezliklar & muvozanat indikatori */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Adsorbsiya tezligi (v_ads)</div>
                    <div className="text-2xl font-mono font-black text-sky-400 my-1">
                      {lengmyurVads} <span className="text-xs font-normal text-slate-400">mol/(m²·s)</span>
                    </div>
                    <div className="text-[10px] text-slate-400">v_ads = k_a · C · (1 − θ)</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Desorbsiya tezligi (v_des)</div>
                    <div className="text-2xl font-mono font-black text-rose-400 my-1">
                      {lengmyurVdes} <span className="text-xs font-normal text-slate-400">mol/(m²·s)</span>
                    </div>
                    <div className="text-[10px] text-slate-400">v_des = k_d · θ · e^(−E/RT)</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Qoplanish darajasi (θ)</div>
                    <div className="text-2xl font-mono font-black text-emerald-400 my-1">
                      {(lengmyurTheta * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400">θ = a / a_max ({Math.round(lengmyurTheta * 16)}/16 markaz)</div>
                  </div>
                </div>

                {/* Dinamik muvozanat holati banner */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-slate-300 font-medium">Kinetik holat:</span>
                  </div>
                  <span className="font-bold text-emerald-400">
                    {Math.abs(Number(lengmyurVads) - Number(lengmyurVdes)) < 0.6
                      ? "⚖️ Dinamik muvozanat qaror topgan (v_ads ≈ v_des)"
                      : Number(lengmyurVads) > Number(lengmyurVdes)
                      ? "📥 Adsorbsiya ustun — yangi molekulalar sirtga yopishmoqda"
                      : "📤 Desorbsiya ustun — harorat tufayli molekulalar uzilmoqda"}
                  </span>
                </div>

                {/* Sirt animatsiyasi (2D mikroskopik kataklar) */}
                <div className="relative w-full aspect-[16/7] bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden p-6 flex flex-col justify-end">
                  {/* Gaz / Eritma fazasidagi erkin molekulalar */}
                  <div className="absolute inset-x-0 top-2 h-28 overflow-hidden pointer-events-none">
                    {Array.from({ length: Math.min(24, Math.round(lengmyurC * 100) + 4) }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute w-3.5 h-3.5 rounded-full bg-sky-400/80 shadow-lg shadow-sky-400/50 animate-bounce"
                        style={{
                          left: `${(i * 4.3 + 3) % 94}%`,
                          top: `${(i % 3) * 22 + 6}px`,
                          animationDuration: `${Math.max(0.6, 2.2 - (lengmyurT - 273) * 0.012)}s`,
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Qattiq adsorbent sirti va faol markazlar */}
                  <div className="relative z-10">
                    <div className="text-[11px] font-bold text-slate-400 mb-2 flex justify-between">
                      <span>Adsorbent kristalli sirti (16 ta bir jinsli markaz):</span>
                      <span className="text-emerald-400 font-mono">
                        {Math.round(lengmyurTheta * 16)} ta band • {16 - Math.round(lengmyurTheta * 16)} ta erkin
                      </span>
                    </div>

                    <div className="grid grid-cols-8 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const band = i < Math.round(lengmyurTheta * 16);
                        return (
                          <div
                            key={i}
                            className={`h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-300 ${
                              band
                                ? "bg-gradient-to-t from-emerald-600 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300"
                                : "bg-slate-900 text-slate-400 border border-dashed border-slate-700"
                            }`}
                          >
                            <span className="text-sm">{band ? "●" : "○"}</span>
                            <span className="text-[8px] font-mono mt-0.5 opacity-80">
                              {band ? "Band" : "Bo'sh"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  💡 <b>Lengmyur qoidasi:</b> Konsentratsiyani qancha oshirmang, barcha 16 ta markaz to&apos;lgach, sirt to&apos;yinadi va adsorbsiya gorizontal platoga ($\Gamma_\infty$) chiqadi. Yangi qatlam hosil bo&apos;lmaydi.
                </div>
              </div>
            )}

            {/* 2: FREYNDLIX GETEROGEN SIRTI & POTENSIAL O'RALAR (ENERGY LANDSCAPE) */}
            {faolModul.id === "freyndlix-regressiya" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    Geterogen Sirt: Energetik Potensial Relyef va 1/n Koeffitsiyenti
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real adsorbentlar sirti nobirjinsli bo&apos;lib, dastlab eng chuqur (yuqori energiyali) markazlar to&apos;ladi, keyin sayoz markazlar band bo&apos;ladi.
                  </p>
                </div>

                {/* 2.1 Haqiqiy laboratoriya tizimi shablonlari */}
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <span>⚗️ Haqiqiy Geterogen Laboratoriya Tizimi:</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {faolFreyndlixPreset.tavsif}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FREYNDLIX_PRESETLARI.map((pr, idx) => (
                      <button
                        key={pr.id}
                        type="button"
                        onClick={() => {
                          setFreyndlixPresetIdx(idx);
                          setFreyndlixC(pr.C);
                          setFreyndlixN(pr.nInv);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition ${
                          freyndlixPresetIdx === idx
                            ? "bg-amber-950 border-amber-400 text-white ring-2 ring-amber-500/40"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                        }`}
                      >
                        <div className="text-xs font-bold text-white truncate">{pr.nom.split("+")[0]}</div>
                        <div className="text-[10px] text-amber-400 font-medium truncate">+{pr.nom.split("+")[1]}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-1">K_F={pr.Kf} • 1/n={pr.nInv}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slayderlar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Konsentratsiya (C):</span>
                      <span className="font-mono text-amber-400 font-bold">{freyndlixC} mol/L</span>
                    </div>
                    <input
                      type="range"
                      min="0.005"
                      max="0.15"
                      step="0.005"
                      value={freyndlixC}
                      onChange={(e) => setFreyndlixC(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.005 (Faqat chuqur o&apos;ralar to&apos;ladi)</span>
                      <span>0.15 (Sayoz o&apos;ralar ham to&apos;ladi)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Geterogenlik darajasi (1/n):</span>
                      <span className="font-mono text-emerald-400 font-bold">{freyndlixN}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.3"
                      step="0.05"
                      value={freyndlixN}
                      onChange={(e) => setFreyndlixN(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>1/n &lt; 1 (Qulay geterogen sirt)</span>
                      <span>1/n = 1 (Ideal Lengmyur)</span>
                    </div>
                  </div>
                </div>

                {/* 2.2 Jonli SVG Izoterma grafigi & Solishtirish */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setFreyndlixTaqqosla(!freyndlixTaqqosla)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                        freyndlixTaqqosla
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>⚖️ Lengmyur bilan solishtirish (Overlay)</span>
                      <span className="font-mono text-[10px]">{freyndlixTaqqosla ? "Yoqilgan" : "O'chiq"}</span>
                    </button>
                  </div>

                  <FreyndlixIzotermaGrafik
                    kf={faolFreyndlixPreset.Kf}
                    nInv={freyndlixN}
                    joriyC={freyndlixC}
                    joriyA={freyndlixA}
                    taqqosla={freyndlixTaqqosla}
                  />
                </div>

                {/* POTENSIAL O'RALAR RELYEFI (ENERGY LANDSCAPE VIZUALI) */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                    <span>Faol markazlarning potensial energiyasi E (kJ/mol):</span>
                    <span className="text-amber-400 font-mono">
                      {freyndlixMarkazlar.filter((m) => m.band).length} / 16 markaz band
                    </span>
                  </div>

                  {/* 16 ta ustunlik energetik profil */}
                  <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 items-end h-44 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {freyndlixMarkazlar.map((m) => {
                      const balandlikFoiz = Math.max(15, Math.min(100, (m.energiya / 65) * 100));
                      return (
                        <div key={m.idx} className="flex flex-col items-center justify-end h-full">
                          {m.band && (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow shadow-amber-400/80 mb-1 animate-pulse" />
                          )}
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              m.band
                                ? "bg-gradient-to-t from-amber-600 to-yellow-400 border-t-2 border-yellow-200"
                                : "bg-slate-800/80 border-t-2 border-slate-600"
                            }`}
                            style={{ height: `${balandlikFoiz}%` }}
                            title={`Markaz #${m.idx + 1}: E = ${m.energiya} kJ/mol (${m.band ? "Band" : "Bo'sh"})`}
                          />
                          <span className="text-[8px] font-mono text-slate-500 mt-1">{m.energiya}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                    <span>← Eng kuchli faol markazlar (E ≈ 65 kJ/mol)</span>
                    <span>Zaif markazlar (E ≈ 15 kJ/mol) →</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  💡 <b>Freyndlix siri:</b> Sirt bir jinsli bo&apos;lmagani sababli adsorbsiya issiqligi doimiy emas, balki qoplanish darajasi oshgani sari logarifmik kamayadi. Shu sababli Freyndlix tenglamasida qat&apos;iy to&apos;yinish platosi mavjud emas.
                </div>
              </div>
            )}

            {/* 3: BET KO'P QATLAMLI MODELI & ISO 9277 O'LCHOV OYNASI */}
            {faolModul.id === "bet-modeli" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    Azot Gazi (77 K) Ko&apos;p Qatlamli Kondensatsiyasi & Solishtirma Sirt Maydoni (S_BET)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Birinchi qatlam to&apos;lgach, adsorbat molekulalari bir-biri ustiga minib, ko&apos;p qatlamli fizik kondensatsiyani yuzaga keltiradi.
                  </p>
                </div>

                {/* Slayderlar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Nisbiy bug&apos; bosimi (p / p₀):</span>
                      <span className="font-mono text-cyan-400 font-bold">{betPnisbiy}</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.95"
                      step="0.01"
                      value={betPnisbiy}
                      onChange={(e) => setBetPnisbiy(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.01 (Monoqavat oldi)</span>
                      <span>0.15 (Monoqavat to&apos;ldi)</span>
                      <span>0.95 (Kapillyar toshish)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>C_BET parametri (Energetik tortishish):</span>
                      <span className="font-mono text-emerald-400 font-bold">{betCParam}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="250"
                      step="5"
                      value={betCParam}
                      onChange={(e) => setBetCParam(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>C &lt; 2 (III tur izoterma)</span>
                      <span>C &gt; 50 (Klassik II tur izoterma)</span>
                    </div>
                  </div>
                </div>

                {/* ISO 9277 O'lchov oynasi bildirishnomasi */}
                {betPnisbiy >= 0.05 && betPnisbiy <= 0.35 ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                    <span className="font-bold">
                      ✓ IUPAC & ISO 9277 standarti: Solishtirma sirt maydonini (S_BET) hisoblash uchun qat&apos;iy chiziqli interval (0.05 ≤ p/p₀ ≤ 0.35).
                    </span>
                    <span className="font-mono font-bold bg-emerald-900/60 px-2 py-0.5 rounded text-[11px]">
                      θ = {betTheta.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center justify-between">
                    <span>
                      {betPnisbiy < 0.05
                        ? "Bosim past: birinchi monoqavat hali yetarli to'lmagan."
                        : "Bosim yuqori: ko'p qatlamli kondensatsiya va g'ovaklar to'lishi BET chiziqliligini buzadi."}
                    </span>
                    <span className="font-mono text-slate-300 text-[11px]">θ = {betTheta.toFixed(2)}</span>
                  </div>
                )}

                {/* BET Jonli SVG Izoterma grafigi */}
                <BetIzotermaGrafik betPnisbiy={betPnisbiy} betCParam={betCParam} betTheta={betTheta} />

                {/* QATLAMLI KO'RGALMA ANIMATSIYASI */}
                <div className="relative w-full aspect-[16/8] bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-end">
                  <div className="space-y-2">
                    {/* 3-qavat */}
                    {betPnisbiy > 0.45 && (
                      <div className="flex justify-center gap-3 transition-opacity duration-300 opacity-60">
                        {Array.from({ length: Math.min(6, Math.round((betPnisbiy - 0.45) * 12)) }).map((_, i) => (
                          <div key={i} className="w-10 h-7 rounded-lg bg-indigo-300 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow">
                            N₂ (3)
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2-qavat */}
                    {betPnisbiy > 0.25 && (
                      <div className="flex justify-center gap-3 transition-opacity duration-300 opacity-80">
                        {Array.from({ length: Math.min(10, Math.round((betPnisbiy - 0.2) * 14)) }).map((_, i) => (
                          <div key={i} className="w-10 h-7 rounded-lg bg-sky-400 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow">
                            N₂ (2)
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 1-monoqavat */}
                    <div className="flex justify-center gap-2.5">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const band = i / 12 <= Math.min(1, betPnisbiy / 0.18);
                        return (
                          <div
                            key={i}
                            className={`w-9 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                              band
                                ? "bg-emerald-400 text-slate-950 shadow-lg ring-2 ring-emerald-300"
                                : "bg-slate-900 text-slate-500 border border-dashed border-slate-700"
                            }`}
                          >
                            {band ? "N₂" : "○"}
                          </div>
                        );
                      })}
                    </div>

                    {/* Adsorbent qattiq yuzasi */}
                    <div className="h-5 bg-slate-950 border-t-2 border-slate-700 rounded text-center text-[10px] text-slate-400 font-mono flex items-center justify-center">
                      Adsorbent qattiq sirti (S_BET = a_m · N_A · σ_N2)
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  💡 <b>BET modeli postulati:</b> Birinchi qatlamdagi issiqlik $q_1$ adsorbent-adsorbat ta&apos;siriga teng bo&apos;lsa, 2- va undan keyingi barcha qatlamlardagi issiqlik adsorbatning sof suyuqlanish (kondensatsiya) issiqligiga ($q_L$) teng hisoblanadi.
                </div>
              </div>
            )}

            {/* 4: GIBBS SIRT TARANGLIK, SFM PALISADI VA KBM MITSELLALARI */}
            {faolModul.id === "gibbs-sirt-taranglik" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Gibbs Adsorbsiya Tenglamasi, Langmyur Palisadi va KBM (Mitsellalar)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    SFM konsentratsiyasi ortishi bilan suvning sirt tarangligi pasayadi. Sirt to&apos;yingach (KBM), eritma ichida sferik mitsellalar paydo bo&apos;ladi.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>SFM Konsentratsiyasi (C):</span>
                        <span className="font-mono text-emerald-400 font-bold text-sm">
                          {gibbsC} mol/L
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.001"
                        max="0.1"
                        step="0.002"
                        value={gibbsC}
                        onChange={(e) => setGibbsC(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>0.001 (Yotgan molekulalar)</span>
                        <span>0.05 (KBM / CMC chegarasi)</span>
                        <span>0.1 (Mitsellalar to&apos;ri)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt taranglik (σ)</div>
                        <div className="text-xl font-mono font-black text-amber-400 my-1">
                          {(gibbsNatija?.sigma ?? 72.8).toFixed(1)} <span className="text-[10px] font-normal text-slate-400">mN/m</span>
                        </div>
                        <div className="text-[9px] text-slate-400">Suv: 72.8 mN/m</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt bosimi (π)</div>
                        <div className="text-xl font-mono font-black text-sky-400 my-1">
                          {(72.8 - (gibbsNatija?.sigma ?? 72.8)).toFixed(1)} <span className="text-[10px] font-normal text-slate-400">mN/m</span>
                        </div>
                        <div className="text-[9px] text-slate-400">π = σ₀ − σ</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt ortiqchaligi (Γ)</div>
                        <div className="text-xl font-mono font-black text-emerald-400 my-1">
                          {(gibbsNatija?.gammaMkmol ?? 3.4).toFixed(2)} <span className="text-[10px] font-normal text-slate-400">µmol/m²</span>
                        </div>
                        <div className="text-[9px] text-slate-400">s = {(gibbsNatija?.s0 ?? 0.35).toFixed(2)} nm²</div>
                      </div>
                    </div>

                    {/* Dyuy Nui halqasining uzilish kuchi */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 font-bold block">Dyuy Nui halqasi uzilish kuchi (F):</span>
                        <span className="text-[10px] text-slate-500">R = 1 sm (F = 4πRσ)</span>
                      </div>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {(4 * Math.PI * 0.01 * (gibbsNatija?.sigma || 72.8)).toFixed(2)} mN
                      </span>
                    </div>

                    {gibbsC >= 0.05 ? (
                      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                        ✨ KBM (CMC) oshildi! Sirt to&apos;liq to&apos;yindi. Yangi SFM molekulalari suv ichida Mitsellalar hosil qilmoqda.
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                        KBM gacha bo&apos;lgan soha: konsentratsiya oshgani sari SFM sirtda tik turib, Langmyur palisadini qurmoqda.
                      </div>
                    )}
                  </div>

                  {/* SFM molekulalari va suv tubidagi Mitsellalar animatsiyasi */}
                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 text-center">
                    <div className="text-xs font-bold text-slate-300 mb-3 flex justify-between">
                      <span>Suv-havo chegarasi & Suv hajmi:</span>
                      <span className="text-emerald-400 font-mono">
                        {gibbsC >= 0.05 ? "Sirt to'yingan + Mitsellalar" : "Palisad shakllanishi"}
                      </span>
                    </div>

                    <div className="relative w-full h-56 bg-gradient-to-b from-blue-950/40 via-blue-900/30 to-slate-950 border-t-2 border-cyan-400 rounded-b-2xl overflow-hidden flex flex-col justify-between p-3">
                      {/* Sirt qatlamidagi SFM (Gidrofil boshcha + Gidrofob dumcha) */}
                      <div className="flex items-start justify-center gap-2 pt-0.5">
                        {Array.from({ length: 14 }).map((_, i) => {
                          const faol = i / 14 < Math.min(1, (gibbsC / 0.05) * 1.05);
                          return (
                            <div
                              key={i}
                              className="flex flex-col items-center transition-all duration-300"
                              style={{ opacity: faol ? 1 : 0.2 }}
                            >
                              <div
                                className="w-1 bg-amber-400 rounded transition-all"
                                style={{ height: faol ? "24px" : "12px" }}
                              />
                              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white shadow" />
                            </div>
                          );
                        })}
                      </div>

                      {/* Suv ichidagi sferik Mitsellalar (agar C >= 0.05 bo'lsa) */}
                      {gibbsC >= 0.05 ? (
                        <div className="flex justify-around items-center py-4 transition-all duration-500">
                          {[1, 2, 3].map((mIdx) => (
                            <div
                              key={mIdx}
                              className="relative w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center animate-spin"
                              style={{ animationDuration: `${6 + mIdx * 2}s` }}
                              title="Sferik Mitsella (Gidrofob yadro ichkarida, gidrofil boshchalar tashqarida)"
                            >
                              {/* 8 ta boshcha aylanada */}
                              {Array.from({ length: 8 }).map((_, bIdx) => {
                                const burchak = (bIdx / 8) * 2 * Math.PI;
                                const bx = Math.cos(burchak) * 24;
                                const by = Math.sin(burchak) * 24;
                                return (
                                  <div
                                    key={bIdx}
                                    className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white shadow"
                                    style={{
                                      transform: `translate(${bx}px, ${by}px)`,
                                    }}
                                  />
                                );
                              })}
                              <span className="text-[8px] font-bold text-amber-300 font-mono">Mitsella</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 italic py-6">
                          Suv hajmi: Hali mitsellalar yo&apos;q (C &lt; KBM)
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between">
                        <span>Havo (Gidrofob dumi) ↑</span>
                        <span>Suv (Gidrofil boshi) ↓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5: KELVIN KAPILYAR KONDENSATSIYA & G'OVAK MORFOLOGIYASI */}
            {faolModul.id === "kelvin-kapillyar" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                    Kelvin Tenglamasi, Botiq Menisk & Kapillyar Gisterezis (IUPAC IV Tur)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Botiq menisk ustida to&apos;yingan bug&apos; bosimi past bo&apos;lgani sababli bug&apos; p/p₀ &lt; 1 nisbiy bosimdayoq suyuqlikka aylanadi.
                  </p>
                </div>

                {/* G'ovak turi tanlash */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-400">G&apos;ovak morfologiyasi:</span>
                  {[
                    { id: "silindr", nom: "Silindrsimon (H1)", tavsif: "Klassik trubka" },
                    { id: "butilka", nom: "Butilka bo'g'zi (H2)", tavsif: "Ink-bottle" },
                    { id: "yoriq", nom: "Yoriqsimon (H3/H4)", tavsif: "Slit-pore" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setKelvinGovakTuri(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        kelvinGovakTuri === t.id
                          ? "bg-sky-950 border-sky-400 text-white ring-2 ring-sky-500/40"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.nom}
                    </button>
                  ))}
                </div>

                {/* Kelvin Jonli SVG Gisterezis grafigi */}
                <KelvinGisterezisGrafik
                  r={kelvinR}
                  pNisbiy={kelvinNatija?.pNisbiy || 0.58}
                  govakTuri={kelvinGovakTuri}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>Mezog&apos;ovak radiusi (r):</span>
                        <span className="font-mono text-emerald-400 font-bold text-sm">
                          {kelvinR} nm (Mezog&apos;ovak 2–50 nm)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1.5"
                        max="20"
                        step="0.5"
                        value={kelvinR}
                        onChange={(e) => setKelvinR(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>1.5 nm (Tor — past p/p₀ da to&apos;ladi)</span>
                        <span>20 nm (Keng — p/p₀ ≈ 1 ga yaqinlashadi)</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 uppercase font-bold">
                        Kondensatsiya boshlanadigan nisbiy bosim (p / p₀):
                      </div>
                      <div className="text-4xl font-mono font-black text-emerald-400 my-2">
                        {(kelvinNatija?.pNisbiy ?? 0.58).toFixed(3)}
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        Botiq menisk tufayli bug&apos; {(kelvinNatija?.pNisbiy ?? 0.58).toFixed(2)} nisbiy bosimdayoq suyuqlikka aylanadi!
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      💡 <b>Gisterezis siri:</b> Adsorbsiya devor plyonkasi qalinlashishi ($r_k$) orqali boradi; Desorbsiya esa yarimsferik botiq menisk ($2 r_k$) orqali kechadi. Shuning uchun desorbsiya doimo pastroq bosimda sodir bo&apos;ladi!
                    </div>
                  </div>

                  {/* Kapillyar trubka & g'ovak vizuali */}
                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
                    <div className="text-xs font-bold text-slate-300 mb-3">
                      {kelvinGovakTuri === "silindr"
                        ? "Silindrsimon mezog'ovak (Botiq menisk):"
                        : kelvinGovakTuri === "butilka"
                        ? "Butilka bo'g'zi (Ink-bottle) mezog'ovagi:"
                        : "Yoriqsimon mezog'ovak (Parallel devorlar):"}
                    </div>

                    <div className="w-36 h-48 mx-auto border-x-4 border-slate-600 bg-slate-950 relative rounded-b-xl overflow-hidden flex flex-col justify-end">
                      {kelvinGovakTuri === "butilka" && (
                        <div className="absolute top-0 inset-x-0 h-10 border-x-[12px] border-slate-700 pointer-events-none" />
                      )}
                      <div
                        className="bg-sky-600/80 relative transition-all duration-300"
                        style={{ height: `${Math.min(90, Math.max(30, (1 - (kelvinNatija?.pNisbiy || 0.5)) * 120))}%` }}
                      >
                        {/* Botiq menisk egriligi */}
                        <div className="absolute -top-3 inset-x-0 h-6 bg-slate-950 rounded-b-[100%]" />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-3 font-mono">
                      Radius r = {kelvinR} nm • Menisk egriligi = {(2 / kelvinR).toFixed(2)} nm⁻¹
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6: ADSORBSIYA TERMODINAMIKASI & VIRTUAL KALORIMETR */}
            {faolModul.id === "termodinamika-izosterik" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      Adsorbsiya Termodinamikasi & Mikrokalorimetr (q_st, ΔH, ΔG, ΔS)
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Klapeiron-Klauzius tenglamasi orqali ikki xil izotermadan izosterik adsorbsiya issiqligi (q_st) hisoblanadi.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/40">
                    Ekzotermik: ΔH &lt; 0, q_st &gt; 0
                  </span>
                </div>

                {/* Klapeyron-Klauzius Ikkita Izoterma grafigi (T1 vs T2) */}
                <TermodinamikaIzosterikGrafik
                  t1={termoT1}
                  t2={termoT2}
                  qst={termoNatija?.qst || 32.4}
                  p1={12.4}
                  p2={38.6}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                          <span>1-Izoterma harorati (T₁):</span>
                          <span className="font-mono text-cyan-400">{termoT1} K ({termoT1 - 273} °C)</span>
                        </div>
                        <input
                          type="range"
                          min="250"
                          max="310"
                          value={termoT1}
                          onChange={(e) => setTermoT1(Math.min(termoT2 - 5, Number(e.target.value)))}
                          className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                          <span>2-Izoterma harorati (T₂):</span>
                          <span className="font-mono text-rose-400">{termoT2} K ({termoT2 - 273} °C)</span>
                        </div>
                        <input
                          type="range"
                          min="280"
                          max="360"
                          value={termoT2}
                          onChange={(e) => setTermoT2(Math.max(termoT1 + 5, Number(e.target.value)))}
                          className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Natijaviy Energetik Kartalar */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Izosterik Issiqlik (q_st)</div>
                        <div className="text-2xl font-mono font-black text-amber-400 my-1">
                          {(termoNatija?.qst ?? 32.4).toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
                          {(termoNatija?.qst ?? 32.4) < 42 ? "Fizisorbtsiya (Van-der-Vaals)" : "Ximisorbtsiya (Kimyoviy)"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Entalpiya (ΔH)</div>
                        <div className="text-2xl font-mono font-black text-rose-400 my-1">
                          {(termoNatija?.deltaH ?? -32.4).toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                        </div>
                        <div className="text-[10px] text-slate-400">ΔH = −q_st (Ekzotermik)</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Erkin energiya (ΔG)</div>
                        <div className="text-2xl font-mono font-black text-purple-400 my-1">
                          {(termoNatija?.deltaG ?? -18.2).toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                        </div>
                        <div className="text-[10px] text-slate-400">&lt; 0 (Spontan / O&apos;z-o&apos;zidan)</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Entropiya (ΔS)</div>
                        <div className="text-2xl font-mono font-black text-sky-400 my-1">
                          {(termoNatija?.deltaS ?? -47.6).toFixed(1)} <span className="text-xs text-slate-400 font-normal">J/(mol·K)</span>
                        </div>
                        <div className="text-[10px] text-slate-400">&lt; 0 (Erkinlik yo&apos;qoladi)</div>
                      </div>
                    </div>
                  </div>

                  {/* VIRTUAL MIKROKALORIMETR & TERMOMETR */}
                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
                    <div className="text-xs font-bold text-slate-300 mb-4 flex justify-between">
                      <span>Mikrokalorimetrik ampula:</span>
                      <span className="text-amber-400 font-mono">Issiqlik ajralishi</span>
                    </div>

                    <div className="flex items-center justify-center gap-8 py-3">
                      {/* Adsorbent kolbasi */}
                      <div className="relative w-28 h-36 border-4 border-slate-600 rounded-b-3xl bg-slate-950 p-2 flex flex-col justify-end items-center">
                        <div className="w-full h-14 bg-gradient-to-t from-emerald-900/60 to-emerald-700/40 rounded-b-2xl border-t border-emerald-500/50 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                          Adsorbent
                        </div>
                        <div className="absolute top-2 w-16 h-1 bg-amber-400/80 rounded animate-ping" />
                      </div>

                      {/* Simobli termometr ustuni */}
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-36 bg-slate-950 border-2 border-slate-600 rounded-full relative flex flex-col justify-end p-0.5">
                          <div
                            className="w-full bg-gradient-to-t from-rose-600 to-amber-400 rounded-full transition-all duration-500"
                            style={{ height: `${Math.min(95, Math.max(25, (((termoNatija?.qst ?? 32.4) || 30) / 60) * 80))}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 mt-2">
                          q_st = {(termoNatija?.qst ?? 32.4).toFixed(1)} kJ
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-2">
                      💡 <b>Le Shatelye printsipi:</b> Adsorbsiya ekzotermik bo&apos;lgani sababli, harorat T₁ dan T₂ ga oshirilganda adsorbent yuzasidagi molekulalar ajralib ketadi (desorbsiya kuchayadi).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7: DYUKLO-TRAUBE QOIDASI & GOMOLOGIK QATOR SIRT FAOLLIGI */}
            {faolModul.id === "dyuklo-traube-qoidasi" && (() => {
              const tanlanganKislota = TRAUBE_KISLOTALAR[traubeKislotaIdx] || TRAUBE_KISLOTALAR[2];
              const stalagmometrN = Math.round((72.8 / (traubeNatija?.sigma || 72.8)) * 25);
              const tomchiMassasi = (((traubeNatija?.sigma || 72.8) / 72.8) * 50).toFixed(1);
              const sirtMolekulalarSoni = Math.min(18, Math.max(3, Math.round(traubeC * 180) + tanlanganKislota.n * 2));

              return (
                <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      Dyuklo-Traube Qoidasi: Har bir -CH₂- guruhi sirt faolligini 3.2 barobar oshiradi
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Yog&apos; kislotalari gomologik qatorida uglevodorod zanjiri qancha uzun bo&apos;lsa, suv uni shuncha kuchli sirtga itarib chiqaradi (Gidrofob samara).
                    </p>
                  </div>

                  {/* 7.1 Kislotani tanlash */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {TRAUBE_KISLOTALAR.map((k, idx) => {
                      const faol = traubeKislotaIdx === idx;
                      return (
                        <button
                          key={k.formula}
                          type="button"
                          onClick={() => setTraubeKislotaIdx(idx)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            faol
                              ? "border-emerald-400 bg-emerald-950/70 text-white ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                              style={{ color: k.rang, backgroundColor: `${k.rang}18` }}
                            >
                              n = {k.n}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">{k.beta}</span>
                          </div>
                          <div className="font-bold text-xs text-white truncate">{k.nom}</div>
                          <div className="text-[10px] font-mono text-slate-300 mt-0.5">{k.formula}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* 7.2 Jonli SVG Traube Izoterma Grafigi (5 ta egri chiziq va real vaqt nuqtasi) */}
                  <TraubeIzotermaGrafik
                    kislotaIndex={traubeKislotaIdx}
                    joriyC={traubeC}
                    joriySigma={traubeNatija?.sigma || 47.8}
                    faollik={traubeNatija?.faollik || 1120}
                  />

                  {/* 7.3 Slayder va hisob-kitob kartalari */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>Eritma konsentratsiyasi (C):</span>
                        <span className="font-mono text-emerald-400 text-sm font-bold">{traubeC} mol/L</span>
                      </div>
                      <input
                        type="range"
                        min="0.002"
                        max="0.08"
                        step="0.002"
                        value={traubeC}
                        onChange={(e) => setTraubeC(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>0.002 mol/L (Suyultirilgan)</span>
                        <span>0.080 mol/L (Konsentrlangan)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt taranglik (σ)</div>
                        <div className="text-xl font-mono font-black text-amber-400 my-0.5">
                          {(traubeNatija?.sigma ?? 72.8).toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">mN/m</span>
                        </div>
                        <div className="text-[10px] text-slate-500">Sof suv: 72.8 mN/m</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt Faolligi (G₀)</div>
                        <div className="text-xl font-mono font-black text-emerald-400 my-0.5">
                          {traubeNatija?.faollik} <span className="text-[10px] text-slate-400 font-normal">mN·L/(m·mol)</span>
                        </div>
                        <div className="text-[10px] text-slate-500">G = −(dσ/dC)₀</div>
                      </div>
                    </div>
                  </div>

                  {/* 7.4 Ikki ta interaktiv laboratoriya animatsiyasi */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* ANIMATSIYA 1: SUV-HAVO CHEGARASI VA GIDROFOB ZANJIR TEBRANISHI */}
                    <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            <span>Molekulyar Suv-Havo Palisadi ({tanlanganKislota.nom})</span>
                          </span>
                          <span className="font-mono text-[11px] text-cyan-400">
                            n = {tanlanganKislota.n} ta -CH₂-
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Gidrofil qutbli boshcha (-COOH) suvda qoladi; gidrofob uglevodorod dumi esa suvning vodorod bog&apos;lari itarishi hisobiga havoga chiqadi.
                        </p>
                      </div>

                      {/* 2D Molekulyar Chegara Ko'rinishi */}
                      <div className="relative w-full h-44 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-end">
                        {/* Havo fazasi (Yuqori) */}
                        <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-500 tracking-wider">
                          HAVO FAZASI (QUTBSIZ)
                        </div>
                        <div className="absolute top-2 right-3 text-[10px] font-mono text-emerald-400/80">
                          ↑ Gidrofob itarilish kuchi: W ≈ −{(tanlanganKislota.n * 3.2).toFixed(1)} kJ/mol
                        </div>

                        {/* Sirtda joylashgan kislota molekulalari palisadi */}
                        <div className="relative z-10 w-full px-4 flex items-end justify-around pb-12">
                          {Array.from({ length: sirtMolekulalarSoni }).map((_, mIdx) => (
                            <div
                              key={mIdx}
                              className="flex flex-col items-center animate-pulse"
                              style={{
                                animationDuration: `${1.4 + (mIdx % 3) * 0.4}s`,
                                animationDelay: `${mIdx * 0.08}s`,
                              }}
                            >
                              {/* Gidrofob uglevodorod zanjiri dumi (n ta bo'g'in) */}
                              <div className="flex flex-col items-center space-y-0.5 mb-0.5">
                                {Array.from({ length: tanlanganKislota.n }).map((_, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                                    style={{
                                      backgroundColor: tanlanganKislota.rang,
                                      transform: `rotate(${cIdx % 2 === 0 ? -12 : 12}deg)`,
                                    }}
                                    title={`-CH2- bo'g'in ${cIdx + 1}`}
                                  />
                                ))}
                              </div>

                              {/* Gidrofil boshcha (-COOH) */}
                              <div
                                className="w-4 h-4 rounded-full bg-rose-500 border border-white/60 shadow-md flex items-center justify-center text-[7px] font-black text-white"
                                title="-COOH karboksil boshchasi"
                              >
                                O
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Suv fazasi (Pastki qism to'lqini) */}
                        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-sky-950 via-sky-900/60 to-cyan-800/40 border-t-2 border-cyan-400/50 flex items-center justify-between px-3 text-[10px] font-bold text-cyan-300">
                          <span>SUV FAZASI (H₂O klasterlari)</span>
                          <span className="font-mono text-[9px] text-cyan-400/70">
                            Zichlik: {sirtMolekulalarSoni} ta molekula sirtda
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        💡 <b>Traube qoidasi mexanizmi:</b> Zanjir n={tanlanganKislota.n} ga teng bo&apos;lganda, har bir -CH₂- suv vodorod bog&apos;larini kamroq buzish uchun sirtga siqib chiqariladi (W ≈ {tanlanganKislota.beta} barobar kuchli sirt faollik).
                      </div>
                    </div>

                    {/* ANIMATSIYA 2: VIRTUAL TRAUBE STALAGMOMETRI (TOMCHI SANAGICH) */}
                    <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Virtual Traube Stalagmometri (Tomchi usuli)</span>
                          </span>
                          <span className="font-mono text-[11px] text-emerald-400">
                            Tate qonuni: P = 2πr·σ
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Sirt taranglik (σ) pasayganda, tomchini ushlab turuvchi kuch kamayadi — tomchilar kichrayib, 1 ml hajmdagi tomchilar soni keskin ortadi!
                        </p>
                      </div>

                      {/* Stalagmometr Kapillyar & Qabul qiluvchi Menzurka Vizuali */}
                      <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-slate-800 p-3 flex items-center justify-around overflow-hidden">
                        {/* Shisha Stalagmometr va Tomizgich */}
                        <div className="flex flex-col items-center">
                          {/* Keng rezervuar ampulasi */}
                          <div className="w-11 h-14 rounded-full border-2 border-slate-500 bg-slate-900 relative flex items-center justify-center overflow-hidden shadow-inner">
                            <div
                              className="w-full bg-gradient-to-t from-emerald-600/70 to-cyan-500/50 transition-all duration-300"
                              style={{ height: `${Math.max(25, 80 - Math.min(60, (traubeTomchilarSoni / stalagmometrN) * 55))}%` }}
                            />
                            <div className="absolute text-[8px] font-mono text-white/80 font-bold">V₁..V₂</div>
                          </div>

                          {/* Ingichka shisha kapillyar naycha */}
                          <div className="w-2.5 h-8 border-x-2 border-slate-500 bg-slate-900/60 relative">
                            <div className="w-full h-full bg-emerald-500/40" />
                          </div>

                          {/* Kapillyar uchi va tomchi uzilishi */}
                          <div className="relative w-8 h-8 flex flex-col items-center justify-start">
                            {/* Hosil bo'layotgan tomchi */}
                            <div
                              className={`rounded-full bg-gradient-to-b from-emerald-400 to-cyan-300 border border-white/80 shadow-md ${
                                traubeAvtoTomizish ? "animate-pulse" : ""
                              }`}
                              style={{
                                width: `${Math.max(8, Math.min(18, (traubeNatija?.sigma || 72.8) * 0.24))}px`,
                                height: `${Math.max(10, Math.min(22, (traubeNatija?.sigma || 72.8) * 0.28))}px`,
                              }}
                            />

                            {/* Havoda uchayotgan tomchi animatsiyasi */}
                            {traubeAvtoTomizish && (
                              <div
                                className="absolute top-4 w-2.5 h-3 rounded-full bg-cyan-300/90 shadow-sm animate-bounce"
                                style={{ animationDuration: "0.55s" }}
                              />
                            )}
                          </div>

                          {/* Pastki o'lchov kolbasi / menzurkasi (Qabul qiluvchi idish) */}
                          <div className="w-14 h-14 border-2 border-slate-600 rounded-b-2xl bg-slate-900/80 relative flex flex-col justify-end p-1 overflow-hidden shadow-lg mt-1">
                            {/* Suyuqlik sathi (yig'ilgan hajmga qarab ko'tariladi) */}
                            <div
                              className="w-full bg-gradient-to-t from-emerald-600 to-cyan-500 rounded-b-xl transition-all duration-300 relative flex items-center justify-center"
                              style={{
                                height: `${Math.min(95, Math.max(10, (traubeTomchilarSoni / stalagmometrN) * 85))}%`,
                              }}
                            >
                              {traubeAvtoTomizish && (
                                <div className="absolute top-0 w-8 h-1 bg-white/60 rounded-full animate-ping" />
                              )}
                            </div>
                            <div className="absolute top-1 left-1 text-[7px] font-mono text-slate-500">1.0 ml</div>
                            <div className="absolute top-4 left-1 text-[7px] font-mono text-slate-500">0.5 ml</div>
                          </div>
                        </div>

                        {/* Tomchilar sanog'i va parametrlari */}
                        <div className="space-y-2 font-mono text-xs w-48">
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Sanab olingan (N):</span>
                              <span className="text-emerald-400 font-bold">{traubeTomchilarSoni} ta</span>
                            </div>
                            <div className="text-lg font-black text-emerald-400 mt-0.5">
                              {stalagmometrN} <span className="text-[10px] text-slate-400 font-normal">ta/ml (nazariy)</span>
                            </div>
                            <div className="text-[9px] text-slate-500 mt-0.5">
                              (Toza suvda 25 ta, σ pasayganda N ortadi)
                            </div>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-400">Yig&apos;ilgan hajm:</div>
                            <div className="text-base font-bold text-cyan-300 mt-0.5">
                              {((traubeTomchilarSoni / stalagmometrN) * 1.0).toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">ml</span>
                            </div>
                            <div className="text-[9px] text-slate-500">
                              1 tomchi: {tomchiMassasi} mg
                            </div>
                          </div>

                          {/* INTERAKTIV BOSHQARUV TUGMALARI */}
                          <div className="flex flex-col gap-1.5 pt-1">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setTraubeAvtoTomizish(!traubeAvtoTomizish)}
                                className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold text-[10px] transition shadow flex items-center justify-center gap-1 ${
                                  traubeAvtoTomizish
                                    ? "bg-amber-600 hover:bg-amber-500 text-white animate-pulse"
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                                }`}
                              >
                                <span>{traubeAvtoTomizish ? "⏸ To'xtatish" : "▶ Avto-tomizish"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setTraubeTomchilarSoni((s) => s + 1)}
                                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] transition"
                                title="Qo'lda bitta tomizish"
                              >
                                💧 +1
                              </button>

                              {traubeTomchilarSoni > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTraubeTomchilarSoni(0);
                                    setTraubeAvtoTomizish(false);
                                  }}
                                  className="py-1.5 px-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-[10px]"
                                  title="Qayta nolga tushirish"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            <span className="text-[9px] text-slate-400 text-center font-sans">
                              {traubeAvtoTomizish
                                ? `⏱️ Tomish tezligi: har ${Math.round(((traubeNatija?.sigma || 72.8) / 72.8) * 1100)} ms da 1 tomchi`
                                : "Avto rejimni yoqing yoki '+1' ni bosing"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        💧 <b>Laboratoriya xulosasi:</b> {tanlanganKislota.nom} eritmasida sirt taranglik σ = {(traubeNatija?.sigma ?? 72.8).toFixed(1)} mN/m bo&apos;lgani sababli tomchi tezroq uziladi va tomchilar soni {stalagmometrN} taga ko&apos;payadi!
                      </div>
                    </div>
                  </div>

                  {/* 7.5 BARCHA 5 TA GOMOLOGIK KISLOTANING TAQQOSLASH JADVALI */}
                  <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                          Dyuklo-Traube Gomologik Qator Tahlili & Sirt Faolligi Qiyosi (C = {traubeC} mol/L da)
                        </h5>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        β = G_(n+1) / G_n ≈ 3.2
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono">
                            <th className="p-3">Kislota</th>
                            <th className="p-3">Formula</th>
                            <th className="p-3 text-center">-CH₂- zanjir (n)</th>
                            <th className="p-3 text-center">Sirt taranglik (σ)</th>
                            <th className="p-3 text-center">1 ml tomchilar (N)</th>
                            <th className="p-3 text-center">Sirt faolligi (G₀)</th>
                            <th className="p-3 text-center">Traube karraligi (β)</th>
                            <th className="p-3 text-center">Gidrofob ish (W)</th>
                            <th className="p-3 text-right">Amal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {TRAUBE_KISLOTALAR.map((k, idx) => {
                            const hisob = faolModul.hisobla(idx, traubeC);
                            const sigma = hisob?.sigma || 72.8;
                            const tomchiN = Math.round((72.8 / sigma) * 25);
                            const tanlangan = traubeKislotaIdx === idx;
                            const w = (idx * -3.2).toFixed(1);

                            return (
                              <tr
                                key={k.formula}
                                onClick={() => setTraubeKislotaIdx(idx)}
                                className={`cursor-pointer transition-colors ${
                                  tanlangan
                                    ? "bg-emerald-950/50 text-white font-bold"
                                    : "hover:bg-slate-900/60 text-slate-300"
                                }`}
                              >
                                <td className="p-3 flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: k.rang }} />
                                  <span>{k.nom}</span>
                                  {tanlangan && (
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-sans">
                                      Faol
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-cyan-300">{k.formula}</td>
                                <td className="p-3 text-center text-slate-400">{k.n}</td>
                                <td className="p-3 text-center text-amber-400 font-bold">{sigma.toFixed(1)} mN/m</td>
                                <td className="p-3 text-center text-emerald-400 font-bold">{tomchiN} ta</td>
                                <td className="p-3 text-center text-slate-300">{hisob?.faollik}</td>
                                <td className="p-3 text-center text-emerald-300 font-bold">{k.beta}</td>
                                <td className="p-3 text-center text-rose-300">{w} kJ/mol</td>
                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTraubeKislotaIdx(idx);
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                                      tanlangan
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-800 text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    {tanlangan ? "Tanlangan" : "Sinash"}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      💡 <b>Xulosa:</b> Gomologik qatorda har bir -CH₂- guruhi ortishi bilan suvning vodorod bog&apos;lari qutbsiz dumchalarni sirtga itarib chiqaradi. Natijada sirt faolligi o&apos;rtacha <b>3.2 barobar</b> oshib, tomchilar soni keskin ortadi va sirt taranglik pasayadi!
                    </div>
                  </div>
                </div>
              );
            })()}
            {/* HAR BIR MODULGA MOS TEZKOR ILMIY GLOSSARIY & PARAMETRLAR */}
            {(() => {
              const nazariya = CHUQUR_NAZARIYA_LUGATI[faolModul.id] || CHUQUR_NAZARIYA_LUGATI["lengmyur-regressiya"];
              return (
                <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📖</span> Formuladagi fizik parametrlar va o&apos;lchov birliklari:
                    </span>
                    <button
                      onClick={() => setIchkiRejim("nazariya")}
                      className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition"
                    >
                      Batafsil nazariya & keltirib chiqarilishi →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {nazariya.hadlar.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-mono font-bold text-emerald-400 text-sm">{h.belgi}</span>
                          <span className="font-mono text-[10px] text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">{h.birlik}</span>
                        </div>
                        <div className="font-semibold text-slate-200 text-[11px]">{h.nom}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{h.izoh}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            REJIM 2: INTERAKTIV TAJRIBA JADVALI (EKSPERIMENT)
           ═══════════════════════════════════════════════════════════════════ */}
        {ichkiRejim === "jadval" && faolModul.tajribaNamunasi && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tajriba ma&apos;lumotlari jadvali (Tahrirlash mumkin):
              </h4>
              <button
                onClick={() => namunaniTikla(faolModul.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>🔄 Namunaviy qiymatlarni tiklash</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                    <th className="p-3">№</th>
                    <th className="p-3">{faolModul.xNomi} ({faolModul.xBirlik})</th>
                    <th className="p-3">{faolModul.yNomi} ({faolModul.yBirlik})</th>
                    {faolModul.regressiyaX && (
                      <>
                        <th className="p-3 font-mono text-emerald-400">Regressiya X ({regressiyaNatijasi?.xNomi || faolModul.regressiyaXNomi})</th>
                        <th className="p-3 font-mono text-emerald-400">Regressiya Y ({regressiyaNatijasi?.yNomi || faolModul.regressiyaYNomi})</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(jadvalMalumotlar[faolModul.id] || []).map((qator, idx) => {
                    const { xKey, yKey } = getMaydonlar(qator);
                    const xVal = qator[xKey];
                    const yVal = qator[yKey];

                    const getX = regressiyaNatijasi?.getX || faolModul.regressiyaX;
                    const getY = regressiyaNatijasi?.getY || faolModul.regressiyaY;

                    const regX = getX ? getX(xVal, yVal) : null;
                    const regY = getY ? getY(xVal, yVal) : null;

                    return (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="any"
                            value={xVal}
                            onChange={(e) => qatorOzgartir(faolModul.id, idx, xKey, e.target.value)}
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="any"
                            value={yVal}
                            onChange={(e) => qatorOzgartir(faolModul.id, idx, yKey, e.target.value)}
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500"
                          />
                        </td>
                        {faolModul.regressiyaX && (
                          <>
                            <td className="p-3 text-slate-300 font-semibold">{regX != null ? regX.toFixed(3) : "—"}</td>
                            <td className="p-3 text-emerald-400 font-bold">{regY != null ? regY.toFixed(3) : "—"}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              💡 Jadvaldagi istalgan katakchani o&apos;zgartirishingiz mumkin — chiziqli regressiya grafigi va fizik doimiylar avtomatik qayta hisoblanadi!
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            REJIM 3: CHIZIQLI REGRESSIYA GRAFIGI & DOIMIYLARNI TOPISH
           ═══════════════════════════════════════════════════════════════════ */}
        {ichkiRejim === "regressiya" && regressiyaNatijasi && (
          <div className="space-y-6">
            {/* LENGMYUR TRANSFORMASIYA TANLOVCHI (HANES-WOOLF / LINEWEAVER-BURK / EADIE-HOFSTEE) */}
            {faolModul.id === "lengmyur-regressiya" && (
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 px-2">Chiziqlashtirish usuli:</span>
                <button
                  onClick={() => setLengmyurTransformatsiya("hanes")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    lengmyurTransformatsiya === "hanes"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Hanes-Woolf (C_e/a vs C_e) ★ Tavsiya etiladi
                </button>
                <button
                  onClick={() => setLengmyurTransformatsiya("lineweaver")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    lengmyurTransformatsiya === "lineweaver"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Lineweaver-Burk (1/a vs 1/C_e)
                </button>
                <button
                  onClick={() => setLengmyurTransformatsiya("eadie")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    lengmyurTransformatsiya === "eadie"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Eadie-Hofstee (a vs a/C_e)
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* SVG REGRESSIYA CHIZMASI */}
              <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                <div className="relative w-full aspect-[16/11]">
                  <svg className="w-full h-full" viewBox="0 0 500 320">
                    <line x1="50" y1="20" x2="50" y2="280" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="50" y1="280" x2="480" y2="280" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="50" y1="150" x2="480" y2="150" stroke="#1e293b" strokeDasharray="4" />
                    <line x1="265" y1="20" x2="265" y2="280" stroke="#1e293b" strokeDasharray="4" />

                    {(() => {
                      const pts = regressiyaNatijasi.nuqtalar;
                      const minX = Math.min(...pts.map((p) => p.x));
                      const maxX = Math.max(...pts.map((p) => p.x));
                      const y1_line = regressiyaNatijasi.qiyalik * minX + regressiyaNatijasi.kesim;
                      const y2_line = regressiyaNatijasi.qiyalik * maxX + regressiyaNatijasi.kesim;

                      const allY = [...pts.map((p) => p.y), y1_line, y2_line].filter(isFinite);
                      const minY = Math.min(...allY);
                      const maxY = Math.max(...allY);

                      const spanX = Math.max(0.001, maxX - minX);
                      const spanY = Math.max(0.001, maxY - minY);

                      const toSvg = (x, y) => ({
                        cx: 60 + ((x - minX) / spanX) * 400,
                        cy: 260 - ((y - minY) / spanY) * 220,
                      });

                      const p1 = toSvg(minX, y1_line);
                      const p2 = toSvg(maxX, y2_line);

                      return (
                        <>
                          <line
                            x1={p1.cx}
                            y1={p1.cy}
                            x2={p2.cx}
                            y2={p2.cy}
                            stroke="#10b981"
                            strokeWidth="3"
                          />

                          {pts.map((p, i) => {
                            const { cx, cy } = toSvg(p.x, p.y);
                            return (
                              <g key={i}>
                                <circle cx={cx} cy={cy} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}

                    <text x="475" y="305" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="end">
                      {regressiyaNatijasi.xNomi}
                    </text>
                    <text x="15" y="25" fill="#94a3b8" fontSize="11" fontWeight="bold">
                      {regressiyaNatijasi.yNomi}
                    </text>
                  </svg>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-2 border-t border-slate-900">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Eksperimental nuqtalar
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-4 h-1 bg-emerald-400 rounded" /> Eng kichik kvadratlar to&apos;g&apos;ri chizig&apos;i
                  </span>
                </div>
              </div>

              {/* HISOBLANGAN FIZIKAVIY DOIMIYLAR KARTASI */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    To&apos;g&apos;ri chiziq tenglamasi: y = m·x + b
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block">Qiyalik (m):</span>
                      <span className="text-base font-mono font-bold text-white">
                        {regressiyaNatijasi.qiyalik.toFixed(4)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block">Erkin had (b):</span>
                      <span className="text-base font-mono font-bold text-white">
                        {regressiyaNatijasi.kesim.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Ishonchlilik (R²):</span>
                    <span className="text-emerald-400 font-bold">{(regressiyaNatijasi.r2 * 100).toFixed(2)}% ({regressiyaNatijasi.r2.toFixed(4)})</span>
                  </div>
                </div>

                {/* DOIMIYLAR */}
                <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Keltirib chiqarilgan fizik doimiylar:
                  </div>

                  {regressiyaNatijasi.doimiylar.map((d, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div className="text-[11px] text-slate-300 font-medium">{d.nom}:</div>
                      <div className="text-xl font-mono font-black text-white my-0.5">
                        {typeof d.qiymat === "number" ? d.qiymat.toFixed(3) : d.qiymat} <span className="text-xs font-normal text-slate-400">{d.birlik}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">💡 {d.izoh}</div>
                    </div>
                  ))}

                  {/* FREYNDLIX INTERPRETATSIYA INDIKATORI */}
                  {faolModul.id === "freyndlix-regressiya" && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs leading-relaxed">
                      {regressiyaNatijasi.qiyalik >= 0.1 && regressiyaNatijasi.qiyalik <= 0.5 ? (
                        <span className="text-emerald-300">
                          ✨ <b>Optimal adsorbsiya (0.1 &lt; 1/n &lt; 0.5):</b> Sirt yuqori geterogenlikka ega, jarayon juda samarali va qulay kechadi.
                        </span>
                      ) : regressiyaNatijasi.qiyalik <= 1.0 ? (
                        <span className="text-sky-300">
                          📊 <b>O&apos;rtacha adsorbsiya (0.5 &lt; 1/n ≤ 1.0):</b> Psevdo-chiziqli oraliq, Genri qonuniga yaqin.
                        </span>
                      ) : (
                        <span className="text-rose-300">
                          ⚠️ <b>Noqulay adsorbsiya (1/n &gt; 1):</b> Kooperativ ta&apos;sir mavjud.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            REJIM 4: ILMIY FARAZLAR VA METODIK TAHLIL
           ═══════════════════════════════════════════════════════════════════ */}
        {ichkiRejim === "nazariya" && (() => {
          const nazariya = CHUQUR_NAZARIYA_LUGATI[faolModul.id] || CHUQUR_NAZARIYA_LUGATI["lengmyur-regressiya"];
          return (
            <div className="space-y-6">
              {/* 1. KELTIRIB CHIQARILISHI VA FIZIK MANTIQ */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <span>🔬 Fundamental Nazariy Keltirib Chiqarilishi:</span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  {nazariya.nomi}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  {nazariya.keltiribChiqarilishi}
                </p>
              </div>

              {/* 2. FORMULADAGI FIZIK HADLAR VA O'LCHOV BIRLIKLARI (GLOSSARIY) */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Formuladagi Fizik Parametrlar, Hadlar va SI Birliklari:
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono">
                        <th className="p-3 w-28">Belgi</th>
                        <th className="p-3">Fizik Kattalik Nomi</th>
                        <th className="p-3 w-36">O&apos;lchov Birligi</th>
                        <th className="p-3">Ilmiy Ma&apos;nosi & Izoh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {nazariya.hadlar.map((h, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="p-3 font-mono font-bold text-emerald-400 text-sm">{h.belgi}</td>
                          <td className="p-3 font-bold text-white">{h.nom}</td>
                          <td className="p-3 font-mono text-cyan-300 text-xs">{h.birlik}</td>
                          <td className="p-3 text-slate-300 text-xs">{h.izoh}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. MODELNING NAZARIY FARAZLARI (POSTULATLAR) */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
                  Modelning Asosiy Farazlari va Cheklovlari (Postulatlar):
                </h4>

                <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  {faolModul.farazlar.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. MODULGA XOS AMALIYOT, IUPAC TASNIFI VA METODIKA (DINAMIK KARTALAR) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span>🏭 Amaliyotda qo&apos;llanishi:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{nazariya.amaliyot}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <span>📐 IUPAC & Standart tasnifi:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{nazariya.iupacTasnifi}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <span>🎓 O&apos;qituvchiga metodik tavsiya:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{nazariya.metodikTavsiya}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
