import { ATOM_MASSALAR } from '../masala-dvigatel.js'

const XOM_ELEMENTLAR = [
  { z: 1, belgi: 'H', nom: 'Vodorod', davr: 1, guruh: 1, toifa: 'Metallmas', qobiq: [1], daraja: 'oson', izoh: 'Koinotdagi eng yengil va eng ko‘p tarqalgan element.' },
  { z: 2, belgi: 'He', nom: 'Geliy', davr: 1, guruh: 18, toifa: 'Inert gaz', qobiq: [2], daraja: 'oson', izoh: 'Birinchi davrning yakunlovchi barqaror inert gazi.' },
  { z: 3, belgi: 'Li', nom: 'Litiy', davr: 2, guruh: 1, toifa: 'Ishqoriy metall', qobiq: [2, 1], daraja: 'oson', izoh: 'Eng yengil metall, zamonaviy akkumulyatorlar asosi.' },
  { z: 4, belgi: 'Be', nom: 'Berilliy', davr: 2, guruh: 2, toifa: 'Ishqoriy-yer metalli', qobiq: [2, 2], daraja: 'orta', izoh: 'Yengil, qattiq va amfoter xossali metall.' },
  { z: 5, belgi: 'B', nom: 'Bor', davr: 2, guruh: 13, toifa: 'Yarimo‘tkazgich', qobiq: [2, 3], daraja: 'orta', izoh: 'Borosilikat shishalar tayyorlashda ishlatiladigan metalloid.' },
  { z: 6, belgi: 'C', nom: 'Uglerod', davr: 2, guruh: 14, toifa: 'Metallmas', qobiq: [2, 4], daraja: 'oson', izoh: 'Barcha organik moddalarning asosiy skelet elementi.' },
  { z: 7, belgi: 'N', nom: 'Azot', davr: 2, guruh: 15, toifa: 'Metallmas', qobiq: [2, 5], daraja: 'oson', izoh: 'Havoning 78 foizini tashkil etuvchi ikki atomli gaz.' },
  { z: 8, belgi: 'O', nom: 'Kislorod', davr: 2, guruh: 16, toifa: 'Metallmas', qobiq: [2, 6], daraja: 'oson', izoh: 'Nafas olish va yonish jarayonlarining asosiy oksidlovchisi.' },
  { z: 9, belgi: 'F', nom: 'Ftor', davr: 2, guruh: 17, toifa: 'Galogen', qobiq: [2, 7], daraja: 'oson', izoh: 'Elektrmanfiyligi eng yuqori va eng faol metallmas.' },
  { z: 10, belgi: 'Ne', nom: 'Neon', davr: 2, guruh: 18, toifa: 'Inert gaz', qobiq: [2, 8], daraja: 'oson', izoh: 'Gaz razryadli naychalarda yorqin qizil-zarg‘aldoq nur sochadi.' },
  { z: 11, belgi: 'Na', nom: 'Natriy', davr: 3, guruh: 1, toifa: 'Ishqoriy metall', qobiq: [2, 8, 1], daraja: 'oson', izoh: 'Suv bilan shiddatli reaksiyaga kirishib vodorod ajratadi.' },
  { z: 12, belgi: 'Mg', nom: 'Magniy', davr: 3, guruh: 2, toifa: 'Ishqoriy-yer metalli', qobiq: [2, 8, 2], daraja: 'oson', izoh: 'Xlorofill molekulasi markazida turuvchi hayotiy metall.' },
  { z: 13, belgi: 'Al', nom: 'Alyuminiy', davr: 3, guruh: 13, toifa: 'Amfoter metall', qobiq: [2, 8, 3], daraja: 'oson', izoh: 'Yer qobig‘ida eng ko‘p tarqalgan metall, oksid pardasi bilan himoyalangan.' },
  { z: 14, belgi: 'Si', nom: 'Kremniy', davr: 3, guruh: 14, toifa: 'Yarimo‘tkazgich', qobiq: [2, 8, 4], daraja: 'oson', izoh: 'Mikrochiplar va quyosh batareyalarining bosh elementi.' },
  { z: 15, belgi: 'P', nom: 'Fosfor', davr: 3, guruh: 15, toifa: 'Metallmas', qobiq: [2, 8, 5], daraja: 'oson', izoh: 'DNK, ATF va mineral o‘g‘itlarning tarkibiy qismi.' },
  { z: 16, belgi: 'S', nom: 'Oltingugurt', davr: 3, guruh: 16, toifa: 'Metallmas', qobiq: [2, 8, 6], daraja: 'oson', izoh: 'Sariq kristall modda, sulfat kislota ishlab chiqarish xomashyosi.' },
  { z: 17, belgi: 'Cl', nom: 'Xlor', davr: 3, guruh: 17, toifa: 'Galogen', qobiq: [2, 8, 7], daraja: 'oson', izoh: 'Suvni zararsizlantirishda va osh tuzi tarkibida uchraydigan gaz.' },
  { z: 18, belgi: 'Ar', nom: 'Argon', davr: 3, guruh: 18, toifa: 'Inert gaz', qobiq: [2, 8, 8], daraja: 'orta', izoh: 'Havodagi uchinchi eng ko‘p gaz, payvandlashda himoya muhiti.' },
  { z: 19, belgi: 'K', nom: 'Kaliy', davr: 4, guruh: 1, toifa: 'Ishqoriy metall', qobiq: [2, 8, 8, 1], daraja: 'oson', izoh: 'Alangani binafsha rangga bo‘yaydi, o‘simliklar o‘sishi uchun zarur.' },
  { z: 20, belgi: 'Ca', nom: 'Kalsiy', davr: 4, guruh: 2, toifa: 'Ishqoriy-yer metalli', qobiq: [2, 8, 8, 2], daraja: 'oson', izoh: 'Ohaktosh, marmar, gips va suyak to‘qimasining asosi.' },
  { z: 22, belgi: 'Ti', nom: 'Titan', davr: 4, guruh: 4, toifa: 'O‘tish metalli', qobiq: [2, 8, 10, 2], daraja: 'orta', izoh: 'Aviatsiya va tibbiyot implantlarida ishlatiladigan korroziyaga chidamli metall.' },
  { z: 24, belgi: 'Cr', nom: 'Xrom', davr: 4, guruh: 6, toifa: 'O‘tish metalli', qobiq: [2, 8, 13, 1], daraja: 'qiyin', izoh: '3d⁵ 4s¹ elektron sakrashiga ega, tuzlari rang-barangligi bilan mashhur.' },
  { z: 25, belgi: 'Mn', nom: 'Marganets', davr: 4, guruh: 7, toifa: 'O‘tish metalli', qobiq: [2, 8, 13, 2], daraja: 'orta', izoh: '+2 dan +7 gacha oksidlanish darajasini namoyon etadi.' },
  { z: 26, belgi: 'Fe', nom: 'Temir', davr: 4, guruh: 8, toifa: 'O‘tish metalli', qobiq: [2, 8, 14, 2], daraja: 'oson', izoh: 'Gemoglobin markazida turadi va metallurgiyaning tayanch metallidir.' },
  { z: 27, belgi: 'Co', nom: 'Kobalt', davr: 4, guruh: 9, toifa: 'O‘tish metalli', qobiq: [2, 8, 15, 2], daraja: 'qiyin', izoh: 'B12 vitamini tarkibiga kiradi, shishaga to‘q ko‘k rang beradi.' },
  { z: 28, belgi: 'Ni', nom: 'Nikel', davr: 4, guruh: 10, toifa: 'O‘tish metalli', qobiq: [2, 8, 16, 2], daraja: 'orta', izoh: 'Gidrogenlash reaksiyalarida katalizator sifatida qo‘llanadi.' },
  { z: 29, belgi: 'Cu', nom: 'Mis', davr: 4, guruh: 11, toifa: 'O‘tish metalli', qobiq: [2, 8, 18, 1], daraja: 'oson', izoh: 'Qizg‘ish metall, elektr o‘tkazuvchanligi juda yuqori va 3d¹⁰ 4s¹ qobiqli.' },
  { z: 30, belgi: 'Zn', nom: 'Rux', davr: 4, guruh: 12, toifa: 'O‘tish metalli', qobiq: [2, 8, 18, 2], daraja: 'oson', izoh: 'Po‘latni zanglashdan saqlovchi galvanizatsiyada va vodorod olishda ishlatiladi.' },
  { z: 33, belgi: 'As', nom: 'Mishyak', davr: 4, guruh: 15, toifa: 'Yarimo‘tkazgich', qobiq: [2, 8, 18, 5], daraja: 'qiyin', izoh: 'Galliy arsenid kabi yarimo‘tkazgich birikmalarida qo‘llaniladi.' },
  { z: 35, belgi: 'Br', nom: 'Brom', davr: 4, guruh: 17, toifa: 'Galogen', qobiq: [2, 8, 18, 7], daraja: 'orta', izoh: 'Xona haroratida suyuq holda bo‘ladigan yagona metallmas.' },
  { z: 36, belgi: 'Kr', nom: 'Kripton', davr: 4, guruh: 18, toifa: 'Inert gaz', qobiq: [2, 8, 18, 8], daraja: 'qiyin', izoh: 'Maxsus fotolampalar va lazerlarda ishlatiladigan og‘ir inert gaz.' },
  { z: 38, belgi: 'Sr', nom: 'Stronsiy', davr: 5, guruh: 2, toifa: 'Ishqoriy-yer metalli', qobiq: [2, 8, 18, 8, 2], daraja: 'qiyin', izoh: 'Mushakbozlikda alangaga to‘q qirmizi rang beradi.' },
  { z: 47, belgi: 'Ag', nom: 'Kumush', davr: 5, guruh: 11, toifa: 'O‘tish metalli', qobiq: [2, 8, 18, 18, 1], daraja: 'oson', izoh: 'Barcha metallar ichida elektr va issiqlik o‘tkazuvchanligi eng yuqori.' },
  { z: 50, belgi: 'Sn', nom: 'Qalay', davr: 5, guruh: 14, toifa: 'Amfoter metall', qobiq: [2, 8, 18, 18, 4], daraja: 'qiyin', izoh: 'Bronza qotishmasi va payvandlash qorishmalari tarkibida ishlatiladi.' },
  { z: 53, belgi: 'I', nom: 'Yod', davr: 5, guruh: 17, toifa: 'Galogen', qobiq: [2, 8, 18, 18, 7], daraja: 'orta', izoh: 'Sublimatsiyalanganda binafsha bug‘ hosil qiladi, kraxmal bilan ko‘karadi.' },
  { z: 56, belgi: 'Ba', nom: 'Bariy', davr: 6, guruh: 2, toifa: 'Ishqoriy-yer metalli', qobiq: [2, 8, 18, 18, 8, 2], daraja: 'orta', izoh: 'Sulfat ionini aniqlovchi reagent manbai, alangani yashil rangga bo‘yaydi.' },
  { z: 78, belgi: 'Pt', nom: 'Platina', davr: 6, guruh: 10, toifa: 'O‘tish metalli', qobiq: [2, 8, 18, 32, 17, 1], daraja: 'qiyin', izoh: 'Kimyoviy barqaror qimmatbaho metall va kuchli katalizator.' },
  { z: 79, belgi: 'Au', nom: 'Oltin', davr: 6, guruh: 11, toifa: 'O‘tish metalli', qobiq: [2, 8, 18, 32, 18, 1], daraja: 'oson', izoh: 'Faqat zar suvida eriydigan sariq asil metall.' },
  { z: 80, belgi: 'Hg', nom: 'Simob', davr: 6, guruh: 12, toifa: 'O‘tish metalli', qobiq: [2, 8, 18, 32, 18, 2], daraja: 'oson', izoh: 'Xona haroratida suyuq holda bo‘ladigan yagona metall.' },
  { z: 82, belgi: 'Pb', nom: 'Qo‘rg‘oshin', davr: 6, guruh: 14, toifa: 'Amfoter metall', qobiq: [2, 8, 18, 32, 18, 4], daraja: 'orta', izoh: 'Zichligi yuqori metall, radiatsiyadan himoya va akkumulyatorlarda qo‘llanadi.' },
]

export const ELEMENT_BAZA = XOM_ELEMENTLAR.map((el) => {
  const aniqMassa = ATOM_MASSALAR[el.belgi]
  const yaxlitMassa = el.belgi === 'Cl' ? 35.5 : Math.round(aniqMassa)
  return {
    ...el,
    massa: aniqMassa,
    yaxlitMassa,
    elektronMatn: el.qobiq.join(', '),
  }
})

export const TOIFA_RANGLAR = {
  Metallmas: '#38bdf8',
  'Inert gaz': '#a78bfa',
  'Ishqoriy metall': '#fb7185',
  'Ishqoriy-yer metalli': '#fbbf24',
  Galogen: '#2dd4bf',
  'O‘tish metalli': '#f59e0b',
  'Amfoter metall': '#60a5fa',
  'Yarimo‘tkazgich': '#34d399',
}
