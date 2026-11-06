// data/milliy-sertifikat/savollar-ombromi.js
//
// JDA KIMYO — MILLIY SERTIFIKAT VA RASCH SINOV SAVOLLARI OMBORI
// Barcha savollar Georg Rasch logit qiyinligi (b_i), soha, mavzu va
// tekshirish mexanizmiga ega.

import { RASCH_DIAGNOSTIKA_SAVOLLARI } from "./rasch-30-savollar.js"

// ─── 1. MILLIY SERTIFIKAT SIMULYATORI #1 (40 TA SAVOL - BMBA STANDARTI) ───
export const MS_SIMULYATOR_1_SAVOLLAR = [
  // 1-32: Yopiq testlar (A, B, C, D)
  {
    id: 1,
    turi: "variant",
    mavzu: "Atom tuzilishi va elektron qavatlar",
    soha: "Umumiy kimyo",
    qiyinlik: -1.8,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-1.jpg",
    options: ["A", "B", "C", "D"],
    correct: "C",
    explanation: "Atom tuzilishi va energetik pog'onalar qonuniyatiga ko'ra to'g'ri javob C varianti hisoblanadi."
  },
  {
    id: 2,
    turi: "variant",
    mavzu: "Davriy sistema va elementlar xossasi",
    soha: "Umumiy kimyo",
    qiyinlik: -1.6,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-2.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "Davriy sistemada guruh va davr bo'ylab o'zgaruvchi xossalar tahlili bo'yicha javob D."
  },
  {
    id: 3,
    turi: "variant",
    mavzu: "Kimyoviy bog'lanish va modda tuzilishi",
    soha: "Umumiy kimyo",
    qiyinlik: -1.4,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-3.jpg",
    options: ["A", "B", "C", "D"],
    correct: "C",
    explanation: "Kovalent va ionli bog'lanish xususiyatlariga ko'ra C varianti to'g'ri."
  },
  {
    id: 4,
    turi: "variant",
    mavzu: "Oksidlanish darajasi va valentlik",
    soha: "Umumiy kimyo",
    qiyinlik: -1.2,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-4.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Elementlarning birikmalardagi oksidlanish darajalarini hisoblash qoidasi asosida javob B."
  },
  {
    id: 5,
    turi: "variant",
    mavzu: "Oddiy va murakkab moddalar",
    soha: "Umumiy kimyo",
    qiyinlik: -1.1,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-5.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Allotropik shakllar va moddalar tasnifi bo'yicha to'g'ri javob B."
  },
  {
    id: 6,
    turi: "variant",
    mavzu: "Anorganik moddalar sinflari: Oksidlar",
    soha: "Anorganik kimyo",
    qiyinlik: -0.9,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-6.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Asosli, kislotali va amfoter oksidlarning kimyoviy reaksiyalari bo'yicha javob B."
  },
  {
    id: 7,
    turi: "variant",
    mavzu: "Kislotalar va asoslar kimyoviy xossalari",
    soha: "Anorganik kimyo",
    qiyinlik: -0.8,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-7.jpg",
    options: ["A", "B", "C", "D"],
    correct: "A",
    explanation: "Neytrallanish va kislota-asos o'zaro ta'siri bo'yicha javob A."
  },
  {
    id: 8,
    turi: "variant",
    mavzu: "Tuzlarning olinishi va xossalari",
    soha: "Anorganik kimyo",
    qiyinlik: -0.7,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-8.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "O'rta, nordon va asosli tuzlarning eruvchanlik hamda parchalanish xossalari bo'yicha javob D."
  },
  {
    id: 9,
    turi: "variant",
    mavzu: "Modda miqdori va Avogadro qonuni",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: -0.5,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-9.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Normal sharoitdagi gaz hajmi va molyar massa munosabatlari bo'yicha javob B."
  },
  {
    id: 10,
    turi: "variant",
    mavzu: "Gazlar aralashmasi va zichlik",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: -0.4,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-10.jpg",
    options: ["A", "B", "C", "D"],
    correct: "C",
    explanation: "Gazlar nisbiy zichligi va o'rtacha molyar massa hisob-kitobi bo'yicha javob C."
  },
  {
    id: 11,
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi",
    soha: "Fizik kimyo",
    qiyinlik: -0.2,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-11.jpg",
    options: ["A", "B", "C", "D"],
    correct: "C",
    explanation: "Konsentratsiya va haroratning reaksiya tezligiga ta'siri (Vant-Goff qoidasi) bo'yicha javob C."
  },
  {
    id: 12,
    turi: "variant",
    mavzu: "Kimyoviy muvozanat va Le-Shatelye prinsipi",
    soha: "Fizik kimyo",
    qiyinlik: 0.0,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-12.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Bosim va harorat o'zgarishida kimyoviy muvozanatning siljish yo'nalishi bo'yicha javob B."
  },
  {
    id: 13,
    turi: "variant",
    mavzu: "Eritmalar: massa ulush va konsentratsiya",
    soha: "Eritmalar",
    qiyinlik: 0.1,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-13.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "Eritma konsentratsiyasini aralashtirish yoki suyultirishdagi massa ulush hisobi bo'yicha javob D."
  },
  {
    id: 14,
    turi: "variant",
    mavzu: "Molyar konsentratsiya va titrlash",
    soha: "Eritmalar",
    qiyinlik: 0.3,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-14.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Eritmaning hajm va molyar konsentratsiyasi bo'yicha stexiometrik munosabat — javob B."
  },
  {
    id: 15,
    turi: "variant",
    mavzu: "Elektrolitik dissotsilanish va ion almashinuv",
    soha: "Eritmalar",
    qiyinlik: 0.4,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-15.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "Cho'kma, gaz va kam dissotsilanuvchi modda hosil bo'lish shartlari bo'yicha javob D."
  },
  {
    id: 16,
    turi: "variant",
    mavzu: "Tuzlar gidrolizi va eritma muhiti (pH)",
    soha: "Anorganik kimyo",
    qiyinlik: 0.5,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-16.jpg",
    options: ["A", "B", "C", "D"],
    correct: "C",
    explanation: "Kation va anion bo'yicha gidroliz tahlili hamda indikatorlar rangining o'zgarishi — javob C."
  },
  {
    id: 17,
    turi: "variant",
    mavzu: "Oksidlanish-qaytarilish reaksiyalari (OVR)",
    soha: "Umumiy kimyo",
    qiyinlik: 0.6,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-17.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "Elektron balans usuli orqali koeffitsiyentlar yig'indisini aniqlash bo'yicha javob D."
  },
  {
    id: 18,
    turi: "variant",
    mavzu: "Galogenlar va ularning birikmalari",
    soha: "Anorganik kimyo",
    qiyinlik: 0.7,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-18.jpg",
    options: ["A", "B", "C", "D"],
    correct: "A",
    explanation: "Galogenlarning oksidlovchilik faolligi va siljitish reaksiyalari bo'yicha javob A."
  },
  {
    id: 19,
    turi: "variant",
    mavzu: "Kislorod va oltingugurt birikmalari",
    soha: "Anorganik kimyo",
    qiyinlik: 0.8,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-19.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "Sulfat kislotaning konsentrlangan holda metallar bilan ta'sirlashishi — javob D."
  },
  {
    id: 20,
    turi: "variant",
    mavzu: "Azot va fosfor birikmalari",
    soha: "Anorganik kimyo",
    qiyinlik: 0.9,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-20.jpg",
    options: ["A", "B", "C", "D"],
    correct: "A",
    explanation: "Nitrat kislotaning konsentratsiyasiga qarab turli qaytarilish mahsulotlari berishi — javob A."
  },
  {
    id: 21,
    turi: "variant",
    mavzu: "Metallar umumiy xossalari va korroziya",
    soha: "Anorganik kimyo",
    qiyinlik: 1.0,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-21.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "Metallarning kuchlanishlar qatori va elektrokimyoviy korroziya qonuniyatlari — javob D."
  },
  {
    id: 22,
    turi: "variant",
    mavzu: "d-elementlar kimyosi: Xrom va Marganets",
    soha: "Anorganik kimyo",
    qiyinlik: 1.1,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-22.jpg",
    options: ["A", "B", "C", "D"],
    correct: "A",
    explanation: "KMnO₄ ning kislotali, neytral va ishqoriy muhitda turli darajalargacha qaytarilishi — javob A."
  },
  {
    id: 23,
    turi: "variant",
    mavzu: "Organik kimyo asoslari: Izomeriya",
    soha: "Organik kimyo",
    qiyinlik: 0.8,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-23.jpg",
    options: ["A", "B", "C", "D"],
    correct: "A",
    explanation: "Skelet, holat va sinflararo izomerlar sonini topish bo'yicha javob A."
  },
  {
    id: 24,
    turi: "variant",
    mavzu: "To'yingan uglevodorodlar: Alkanlar",
    soha: "Organik kimyo",
    qiyinlik: 0.9,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-24.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "Vyurs reaksiyasi va radikal almashinish mahsulotlari bo'yicha to'g'ri variant D."
  },
  {
    id: 25,
    turi: "variant",
    mavzu: "To'yinmagan uglevodorodlar: Alkenlar va Alkinlar",
    soha: "Organik kimyo",
    qiyinlik: 1.0,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-25.jpg",
    options: ["A", "B", "C", "D"],
    correct: "D",
    explanation: "Kucherov reaksiyasi va elektrofil birikish qonuniyati — javob D."
  },
  {
    id: 26,
    turi: "variant",
    mavzu: "Aromatik uglevodorodlar: Arenlar",
    soha: "Organik kimyo",
    qiyinlik: 1.1,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-26.jpg",
    options: ["A", "B", "C", "D"],
    correct: "A",
    explanation: "Benzol yadrosida o'rinbosarlarning yo'naltiruvchi ta'siri (I va II tur) — javob A."
  },
  {
    id: 27,
    turi: "variant",
    mavzu: "Kislorodli organik moddalar: Spirtlar va fenollar",
    soha: "Organik kimyo",
    qiyinlik: 1.2,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-27.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Ko'p atomli spirtlarning Cu(OH)₂ bilan sifat reaksiyasi va fenol xossalari — javob B."
  },
  {
    id: 28,
    turi: "variant",
    mavzu: "Aldegidlar, ketonlar va karbon kislotalar",
    soha: "Organik kimyo",
    qiyinlik: 1.3,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-28.jpg",
    options: ["A", "B", "C", "D"],
    correct: "C",
    explanation: "Oksidlanish va efirlanish reaksiyalari bo'yicha to'g'ri variant C."
  },
  {
    id: 29,
    turi: "variant",
    mavzu: "Murakkab efirlar va yog'lar",
    soha: "Organik kimyo",
    qiyinlik: 1.3,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-29.jpg",
    options: ["A", "B", "C", "D"],
    correct: "C",
    explanation: "Gidroliz (sovunlanish) va vodorodlash jarayonlari — javob C."
  },
  {
    id: 30,
    turi: "variant",
    mavzu: "Azotli organik moddalar: Aminlar va aminokislotalar",
    soha: "Organik kimyo",
    qiyinlik: 1.4,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-30.jpg",
    options: ["A", "B", "C", "D"],
    correct: "A",
    explanation: "Aminokislotalarning peptid bog' hosil qilishi va amfoterlik xususiyati — javob A."
  },
  {
    id: 31,
    turi: "variant",
    mavzu: "Uglevodlar: Monosaxaridlar va Polisaxaridlar",
    soha: "Organik kimyo",
    qiyinlik: 1.4,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-31.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Glyukoza, saxaroza va kraxmalning gidroliz hamda sifat reaksiyalari — javob B."
  },
  {
    id: 32,
    turi: "variant",
    mavzu: "Yuqori molekulyar birikmalar: Polimerlar",
    soha: "Organik kimyo",
    qiyinlik: 1.5,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-32.jpg",
    options: ["A", "B", "C", "D"],
    correct: "B",
    explanation: "Polimerlanish va polikondensatlanish reaksiyalarining farqlari bo'yicha javob B."
  },

  // 33-35: Moslashtirish testlari (A-F variantlar)
  {
    id: 33,
    turi: "variant",
    mavzu: "Moslashtirish: Stexiometrik hisob va gaz hajmi",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 1.6,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-33.jpg",
    kontekstRasm: "/images/milliy-sertifikat-1/savollar/savol-33-35-kontekst.jpg",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: { A: "8,1", B: "1,68", C: "6,4", D: "16,2", E: "3,36", F: "16,0" },
    correct: "F",
    explanation: "Masala shartidagi birinchi moddaning hosil bo'lish massasi 16,0 g ni tashkil etadi (F javob)."
  },
  {
    id: 34,
    turi: "variant",
    mavzu: "Moslashtirish: Reaksiya unumi va sarflangan modda",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 1.7,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-34.jpg",
    kontekstRasm: "/images/milliy-sertifikat-1/savollar/savol-33-35-kontekst.jpg",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: { A: "8,1", B: "1,68", C: "6,4", D: "16,2", E: "3,36", F: "16,0" },
    correct: "D",
    explanation: "Ikkinchi jarayon bo'yicha hisoblangan massa 16,2 g ga to'g'ri keladi (D javob)."
  },
  {
    id: 35,
    turi: "variant",
    mavzu: "Moslashtirish: Qoldiq moddalar va gazlar tahlili",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 1.8,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-35.jpg",
    kontekstRasm: "/images/milliy-sertifikat-1/savollar/savol-33-35-kontekst.jpg",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: { A: "8,1", B: "1,68", C: "6,4", D: "16,2", E: "3,36", F: "16,0" },
    correct: "B",
    explanation: "Uchinchi talab qilingan gaz miqdori 1,68 litrni tashkil etadi (B javob)."
  },

  // 36-40: Ochiq sonli masalalar (qoralama daftarda yechilib kiritiladi)
  {
    id: 36,
    turi: "ochiq",
    mavzu: "Ochiq masala: Gazlar aralashmasi va zichlik",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 1.9,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-36.jpg",
    correct: "64",
    birlik: "%",
    explanation: "Aralashma tarkibidagi gazning hajmiy ulushi stexiometrik tahlil va tenglamalar sistemasidan 64% chiqadi."
  },
  {
    id: 37,
    turi: "ochiq",
    mavzu: "Ochiq masala: Kristallogidrat va to'yingan eritmalar",
    soha: "Eritmalar",
    qiyinlik: 2.1,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-37.jpg",
    correct: "22.3",
    altCorrect: "22,3",
    birlik: "g",
    explanation: "Harorat o'zgarishi va eruvchanlik koeffitsiyenti bo'yicha hisoblangan quruq tuz massasi 22.3 g (yoki 22,3) ga teng."
  },
  {
    id: 38,
    turi: "ochiq",
    mavzu: "Ochiq masala: Elektroliz va Faradey qonuni",
    soha: "Fizik kimyo",
    qiyinlik: 2.2,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-38.jpg",
    correct: "960",
    birlik: "soniya / g",
    explanation: "Elektroliz davomida o'tgan tok miqdori va ajralgan moddalar stexiometriyasi orqali natija 960 chiqadi."
  },
  {
    id: 39,
    turi: "ochiq",
    mavzu: "Ochiq masala: Organik sintez va reaksiyalar unumi",
    soha: "Organik kimyo",
    qiyinlik: 2.4,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-39.jpg",
    correct: "54.8",
    altCorrect: "54,8",
    birlik: "g",
    explanation: "Bosqichma-bosqich organik o'zgarishlar va amaliy unumni inobatga olgan holda yakuniy massaning qiymati 54.8 (yoki 54,8) ga teng."
  },
  {
    id: 40,
    turi: "ochiq",
    mavzu: "Ochiq masala: Murakkab aralashmalar va plastinka masalasi",
    soha: "Kimyoviy hisoblashlar",
    qiyinlik: 2.5,
    rasm: "/images/milliy-sertifikat-1/savollar/savol-40.jpg",
    correct: "60",
    birlik: "% yoki g",
    explanation: "Eritmaga botirilgan metall plastinka massasining o'zgarishi Δm orqali tuzilgan tenglama natijasida so'ralgan kattalik 60 ga teng bo'ladi."
  }
]

// ─── 2. MILLIY SERTIFIKAT SIMULYATORI #2 (40 TA SAVOL - 2-VARIANT) ───
export const MS_SIMULYATOR_2_SAVOLLAR = [
  { id: 1, turi: "variant", mavzu: "Atom tuzilishi", soha: "Umumiy kimyo", qiyinlik: -1.8, rasm: "/images/milliy-sertifikat-2/savollar/savol-1.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 2, turi: "variant", mavzu: "Davriy sistema", soha: "Umumiy kimyo", qiyinlik: -1.6, rasm: "/images/milliy-sertifikat-2/savollar/savol-2.jpg", options: ["A", "B", "C", "D"], correct: "A" },
  { id: 3, turi: "variant", mavzu: "Bog'lanish turlari", soha: "Umumiy kimyo", qiyinlik: -1.4, rasm: "/images/milliy-sertifikat-2/savollar/savol-3.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 4, turi: "variant", mavzu: "Oksidlanish darajasi", soha: "Umumiy kimyo", qiyinlik: -1.2, rasm: "/images/milliy-sertifikat-2/savollar/savol-4.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 5, turi: "variant", mavzu: "Moddalar klassifikatsiyasi", soha: "Umumiy kimyo", qiyinlik: -1.0, rasm: "/images/milliy-sertifikat-2/savollar/savol-5.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 6, turi: "variant", mavzu: "Oksidlar va gidroksidlar", soha: "Anorganik kimyo", qiyinlik: -0.9, rasm: "/images/milliy-sertifikat-2/savollar/savol-6.jpg", options: ["A", "B", "C", "D"], correct: "B" },
  { id: 7, turi: "variant", mavzu: "Kislotalar xossalari", soha: "Anorganik kimyo", qiyinlik: -0.8, rasm: "/images/milliy-sertifikat-2/savollar/savol-7.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 8, turi: "variant", mavzu: "Tuzlar va eruvchanlik", soha: "Anorganik kimyo", qiyinlik: -0.6, rasm: "/images/milliy-sertifikat-2/savollar/savol-8.jpg", options: ["A", "B", "C", "D"], correct: "C" },
  { id: 9, turi: "variant", mavzu: "Avogadro va mol tushunchasi", soha: "Kimyoviy hisoblashlar", qiyinlik: -0.5, rasm: "/images/milliy-sertifikat-2/savollar/savol-9.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 10, turi: "variant", mavzu: "Gaz qonunlari", soha: "Kimyoviy hisoblashlar", qiyinlik: -0.3, rasm: "/images/milliy-sertifikat-2/savollar/savol-10.jpg", options: ["A", "B", "C", "D"], correct: "C" },
  { id: 11, turi: "variant", mavzu: "Reaksiya tezligi", soha: "Fizik kimyo", qiyinlik: -0.1, rasm: "/images/milliy-sertifikat-2/savollar/savol-11.jpg", options: ["A", "B", "C", "D"], correct: "B" },
  { id: 12, turi: "variant", mavzu: "Kimyoviy muvozanat", soha: "Fizik kimyo", qiyinlik: 0.1, rasm: "/images/milliy-sertifikat-2/savollar/savol-12.jpg", options: ["A", "B", "C", "D"], correct: "C" },
  { id: 13, turi: "variant", mavzu: "Eritmalar konsentratsiyasi", soha: "Eritmalar", qiyinlik: 0.2, rasm: "/images/milliy-sertifikat-2/savollar/savol-13.jpg", options: ["A", "B", "C", "D"], correct: "B" },
  { id: 14, turi: "variant", mavzu: "Molyar konsentratsiya", soha: "Eritmalar", qiyinlik: 0.3, rasm: "/images/milliy-sertifikat-2/savollar/savol-14.jpg", options: ["A", "B", "C", "D"], correct: "B" },
  { id: 15, turi: "variant", mavzu: "Elektrolitlar", soha: "Eritmalar", qiyinlik: 0.4, rasm: "/images/milliy-sertifikat-2/savollar/savol-15.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 16, turi: "variant", mavzu: "Gidroliz jarayoni", soha: "Anorganik kimyo", qiyinlik: 0.5, rasm: "/images/milliy-sertifikat-2/savollar/savol-16.jpg", options: ["A", "B", "C", "D"], correct: "C" },
  { id: 17, turi: "variant", mavzu: "Redoks muvozanati", soha: "Umumiy kimyo", qiyinlik: 0.6, rasm: "/images/milliy-sertifikat-2/savollar/savol-17.jpg", options: ["A", "B", "C", "D"], correct: "A" },
  { id: 18, turi: "variant", mavzu: "Galogenlar kimyosi", soha: "Anorganik kimyo", qiyinlik: 0.7, rasm: "/images/milliy-sertifikat-2/savollar/savol-18.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 19, turi: "variant", mavzu: "Xalkogenlar (S, O)", soha: "Anorganik kimyo", qiyinlik: 0.8, rasm: "/images/milliy-sertifikat-2/savollar/savol-19.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 20, turi: "variant", mavzu: "Pniktogenlar (N, P)", soha: "Anorganik kimyo", qiyinlik: 0.9, rasm: "/images/milliy-sertifikat-2/savollar/savol-20.jpg", options: ["A", "B", "C", "D"], correct: "C" },
  { id: 21, turi: "variant", mavzu: "Metallar elektrokimyosi", soha: "Anorganik kimyo", qiyinlik: 1.0, rasm: "/images/milliy-sertifikat-2/savollar/savol-21.jpg", options: ["A", "B", "C", "D"], correct: "C" },
  { id: 22, turi: "variant", mavzu: "O'tish metallari", soha: "Anorganik kimyo", qiyinlik: 1.1, rasm: "/images/milliy-sertifikat-2/savollar/savol-22.jpg", options: ["A", "B", "C", "D"], correct: "B" },
  { id: 23, turi: "variant", mavzu: "Organik izomeriya", soha: "Organik kimyo", qiyinlik: 0.8, rasm: "/images/milliy-sertifikat-2/savollar/savol-23.jpg", options: ["A", "B", "C", "D"], correct: "A" },
  { id: 24, turi: "variant", mavzu: "Alkanlar va sikloalkanlar", soha: "Organik kimyo", qiyinlik: 0.9, rasm: "/images/milliy-sertifikat-2/savollar/savol-24.jpg", options: ["A", "B", "C", "D"], correct: "D" },
  { id: 25, turi: "variant", mavzu: "Alkenlar reaksiyalari", soha: "Organik kimyo", qiyinlik: 1.0, rasm: "/images/milliy-sertifikat-2/savollar/savol-25.jpg", options: ["A", "B", "C", "D"], correct: "B" },
  { id: 26, turi: "variant", mavzu: "Arenlar xossalari", soha: "Organik kimyo", qiyinlik: 1.1, rasm: "/images/milliy-sertifikat-2/savollar/savol-26.jpg", options: ["A", "B", "C", "D"], correct: "B" },
  { id: 27, turi: "variant", mavzu: "Spirtlar va fenollar", soha: "Organik kimyo", qiyinlik: 1.2, rasm: "/images/milliy-sertifikat-2/savollar/savol-27.jpg", options: ["A", "B", "C", "D"], correct: "A" },
  { id: 28, turi: "variant", mavzu: "Aldegidlar reaksiyalari", soha: "Organik kimyo", qiyinlik: 1.2, rasm: "/images/milliy-sertifikat-2/savollar/savol-28.jpg", options: ["A", "B", "C", "D"], correct: "A" },
  { id: 29, turi: "variant", mavzu: "Karbon kislotalar", soha: "Organik kimyo", qiyinlik: 1.3, rasm: "/images/milliy-sertifikat-2/savollar/savol-29.jpg", options: ["A", "B", "C", "D"], correct: "A" },
  { id: 30, turi: "variant", mavzu: "Aminlar va oqsillar", soha: "Organik kimyo", qiyinlik: 1.4, rasm: "/images/milliy-sertifikat-2/savollar/savol-30.jpg", options: ["A", "B", "C", "D"], correct: "C" },
  { id: 31, turi: "variant", mavzu: "Uglevodlar kimyosi", soha: "Organik kimyo", qiyinlik: 1.4, rasm: "/images/milliy-sertifikat-2/savollar/savol-31.jpg", options: ["A", "B", "C", "D"], correct: "A" },
  { id: 32, turi: "variant", mavzu: "Polimer birikmalar", soha: "Organik kimyo", qiyinlik: 1.5, rasm: "/images/milliy-sertifikat-2/savollar/savol-32.jpg", options: ["A", "B", "C", "D"], correct: "D" },

  // Moslashtirish
  { id: 33, turi: "variant", mavzu: "Moslashtirish: Molyar hisob", soha: "Kimyoviy hisoblashlar", qiyinlik: 1.6, rasm: "/images/milliy-sertifikat-2/savollar/savol-33-35.jpg", options: ["A", "B", "C", "D", "E", "F"], optionLabels: { A: "0,08", B: "0,14", C: "1,6", D: "9,64", E: "0,04", F: "0,02" }, correct: "F" },
  { id: 34, turi: "variant", mavzu: "Moslashtirish: Gazlar aralashmasi", soha: "Kimyoviy hisoblashlar", qiyinlik: 1.7, rasm: "/images/milliy-sertifikat-2/savollar/savol-33-35.jpg", options: ["A", "B", "C", "D", "E", "F"], optionLabels: { A: "0,08", B: "0,14", C: "1,6", D: "9,64", E: "0,04", F: "0,02" }, correct: "C" },
  { id: 35, turi: "variant", mavzu: "Moslashtirish: Reaksiya unumi", soha: "Kimyoviy hisoblashlar", qiyinlik: 1.8, rasm: "/images/milliy-sertifikat-2/savollar/savol-33-35.jpg", options: ["A", "B", "C", "D", "E", "F"], optionLabels: { A: "0,08", B: "0,14", C: "1,6", D: "9,64", E: "0,04", F: "0,02" }, correct: "B" },

  // Ochiq masalalar
  { id: 36, turi: "ochiq", mavzu: "Ochiq masala: Gazlar muvozanati", soha: "Kimyoviy hisoblashlar", qiyinlik: 1.9, rasm: "/images/milliy-sertifikat-2/savollar/savol-36.jpg", correct: "4.8", altCorrect: "4,8" },
  { id: 37, turi: "ochiq", mavzu: "Ochiq masala: Eritmalar titrlash", soha: "Eritmalar", qiyinlik: 2.1, rasm: "/images/milliy-sertifikat-2/savollar/savol-37.jpg", correct: "0.9", altCorrect: "0,9" },
  { id: 38, turi: "ochiq", mavzu: "Ochiq masala: Elektroliz hisobi", soha: "Fizik kimyo", qiyinlik: 2.2, rasm: "/images/milliy-sertifikat-2/savollar/savol-38.jpg", correct: "37.6", altCorrect: "37,6" },
  { id: 39, turi: "ochiq", mavzu: "Ochiq masala: Organik sintez", soha: "Organik kimyo", qiyinlik: 2.3, rasm: "/images/milliy-sertifikat-2/savollar/savol-39.jpg", correct: "25" },
  { id: 40, turi: "ochiq", mavzu: "Ochiq masala: Plastinka va cho'kmalar", soha: "Kimyoviy hisoblashlar", qiyinlik: 2.5, rasm: "/images/milliy-sertifikat-2/savollar/savol-40.jpg", correct: "88" }
]

// ─── 3. ATTESTATSIYA VA TOIFA SINOVI (CHUQURLASHTIRILGAN KIMYO) ───
// 30 ta Rasch savollari va BMBA ochiq masalalarini o'z ichiga olgan pedagogik to'plam
export const ATTESTATSIYA_SAVOLLARI = [
  ...RASCH_DIAGNOSTIKA_SAVOLLARI.map((s) => ({
    ...s,
    turi: "variant",
    qiyinlik: Number((s.qiyinlik + 0.3).toFixed(2)) // O'qituvchilar uchun qiyinlik balandroq kalibrlanadi
  }))
]

/**
 * Slug bo'yicha savollar to'plamini qaytaruvchi yagona funksiya
 */
export function getSavollarBySlug(slug) {
  if (slug === "rasch-diagnostika") {
    return RASCH_DIAGNOSTIKA_SAVOLLARI
  }
  if (slug === "milliy-sertifikat-simulyator") {
    return MS_SIMULYATOR_1_SAVOLLAR
  }
  if (slug === "milliy-sertifikat-simulyator-2") {
    return MS_SIMULYATOR_2_SAVOLLAR
  }
  if (slug === "attestatsiya-sinov") {
    return ATTESTATSIYA_SAVOLLARI
  }
  // Standart qaytish
  return MS_SIMULYATOR_1_SAVOLLAR
}

/**
 * Javobning to'g'ri yoki noto'g'ri ekanini tekshiruvchi universal funksiya.
 * Harflar (A-D, A-F), indekslar (0-3) va sonli oraliqlar (±0.05) bilan to'liq ishlaydi.
 */
export function tekshirJavob(savol, berilganJavob) {
  if (!savol || berilganJavob === undefined || berilganJavob === null || berilganJavob === "") {
    return false
  }

  // OCHIQ SONLI SAVOLLAR
  if (savol.turi === "ochiq") {
    const tozaBerilgan = String(berilganJavob).trim().replace(",", ".")
    const tozaKutilgan = String(savol.correct).trim().replace(",", ".")
    const bSon = parseFloat(tozaBerilgan)
    const kSon = parseFloat(tozaKutilgan)

    if (!isNaN(bSon) && !isNaN(kSon)) {
      return Math.abs(bSon - kSon) <= 0.05001
    }
    // Agar altCorrect bo'lsa
    if (savol.altCorrect) {
      const altSon = parseFloat(String(savol.altCorrect).trim().replace(",", "."))
      if (!isNaN(bSon) && !isNaN(altSon)) {
        return Math.abs(bSon - altSon) <= 0.05001
      }
    }
    return tozaBerilgan === tozaKutilgan
  }

  // VARIANTLI VA MOSLASHTIRISH SAVOLLARI
  const kutilgan = savol.correct

  // Agar kutilgan raqam (0, 1, 2, 3) bo'lsa (rasch-diagnostika)
  if (typeof kutilgan === "number") {
    // Berilgan javob raqam bo'lsa
    if (typeof berilganJavob === "number") {
      return kutilgan === berilganJavob
    }
    // Berilgan javob 'A', 'B', 'C', 'D' bo'lsa
    const harf = String(berilganJavob).trim().toUpperCase()
    const harfIndeks = ["A", "B", "C", "D"].indexOf(harf)
    if (harfIndeks !== -1) {
      return kutilgan === harfIndeks
    }
    // Berilgan javob matn bo'lsa
    if (savol.options && savol.options[kutilgan]) {
      return String(savol.options[kutilgan]).trim().toLowerCase() === String(berilganJavob).trim().toLowerCase()
    }
  }

  // Agar kutilgan harf ('A', 'B', 'C', 'D', 'E', 'F') bo'lsa
  const kutilganHarf = String(kutilgan).trim().toUpperCase()
  if (typeof berilganJavob === "number") {
    const harflar = ["A", "B", "C", "D", "E", "F"]
    return harflar[berilganJavob] === kutilganHarf
  }

  return String(berilganJavob).trim().toUpperCase() === kutilganHarf
}
