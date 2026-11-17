import { randomInt } from 'node:crypto'
import { molyarMassaHisobla } from '../masala-dvigatel.js'
import { aralashtir, ochHolat, ortachaMs, qisqaId, shifrlaHolat } from './oyin-token.js'

const NOMSPACE = 'formula-konstruktor/v1'
const VAQT_GRACE_MS = 1500
const DUEL_BLOK_MS = 1200

const RUXSAT_REJIMLAR = new Set(['yakka', 'duel-savol', 'duel-vaqt'])
const RUXSAT_DARAJALAR = new Set(['oson', 'orta', 'qiyin', 'aralash'])
const RUXSAT_VAQTLAR = new Set([90, 120, 180])

export const KONSTRUKTOR_KATIONLAR = [
  { id: 'H+', form: 'H', belgi: 'H⁺', zaryad: 1, nom: 'Vodorod ioni', kopAtomli: false },
  { id: 'Na+', form: 'Na', belgi: 'Na⁺', zaryad: 1, nom: 'Natriy', kopAtomli: false },
  { id: 'K+', form: 'K', belgi: 'K⁺', zaryad: 1, nom: 'Kaliy', kopAtomli: false },
  { id: 'Ag+', form: 'Ag', belgi: 'Ag⁺', zaryad: 1, nom: 'Kumush (I)', kopAtomli: false },
  { id: 'NH4+', form: 'NH₄', belgi: 'NH₄⁺', zaryad: 1, nom: 'Ammoniy', kopAtomli: true },
  { id: 'Mg2+', form: 'Mg', belgi: 'Mg²⁺', zaryad: 2, nom: 'Magniy', kopAtomli: false },
  { id: 'Ca2+', form: 'Ca', belgi: 'Ca²⁺', zaryad: 2, nom: 'Kalsiy', kopAtomli: false },
  { id: 'Ba2+', form: 'Ba', belgi: 'Ba²⁺', zaryad: 2, nom: 'Bariy', kopAtomli: false },
  { id: 'Zn2+', form: 'Zn', belgi: 'Zn²⁺', zaryad: 2, nom: 'Rux', kopAtomli: false },
  { id: 'Cu2+', form: 'Cu', belgi: 'Cu²⁺', zaryad: 2, nom: 'Mis (II)', kopAtomli: false },
  { id: 'Fe2+', form: 'Fe', belgi: 'Fe²⁺', zaryad: 2, nom: 'Temir (II)', kopAtomli: false },
  { id: 'Pb2+', form: 'Pb', belgi: 'Pb²⁺', zaryad: 2, nom: 'Qo‘rg‘oshin (II)', kopAtomli: false },
  { id: 'Fe3+', form: 'Fe', belgi: 'Fe³⁺', zaryad: 3, nom: 'Temir (III)', kopAtomli: false },
  { id: 'Al3+', form: 'Al', belgi: 'Al³⁺', zaryad: 3, nom: 'Alyuminiy', kopAtomli: false },
]

export const KONSTRUKTOR_ANIONLAR = [
  { id: 'Cl-', form: 'Cl', belgi: 'Cl⁻', zaryad: -1, nom: 'Xlorid', kopAtomli: false },
  { id: 'Br-', form: 'Br', belgi: 'Br⁻', zaryad: -1, nom: 'Bromid', kopAtomli: false },
  { id: 'I-', form: 'I', belgi: 'I⁻', zaryad: -1, nom: 'Yodid', kopAtomli: false },
  { id: 'OH-', form: 'OH', belgi: 'OH⁻', zaryad: -1, nom: 'Gidroksid', kopAtomli: true },
  { id: 'NO3-', form: 'NO₃', belgi: 'NO₃⁻', zaryad: -1, nom: 'Nitrat', kopAtomli: true },
  { id: 'MnO4-', form: 'MnO₄', belgi: 'MnO₄⁻', zaryad: -1, nom: 'Permanganat', kopAtomli: true },
  { id: 'O2-', form: 'O', belgi: 'O²⁻', zaryad: -2, nom: 'Oksid', kopAtomli: false },
  { id: 'S2-', form: 'S', belgi: 'S²⁻', zaryad: -2, nom: 'Sulfid', kopAtomli: false },
  { id: 'SO42-', form: 'SO₄', belgi: 'SO₄²⁻', zaryad: -2, nom: 'Sulfat', kopAtomli: true },
  { id: 'CO32-', form: 'CO₃', belgi: 'CO₃²⁻', zaryad: -2, nom: 'Karbonat', kopAtomli: true },
  { id: 'Cr2O72-', form: 'Cr₂O₇', belgi: 'Cr₂O₇²⁻', zaryad: -2, nom: 'Dixromat', kopAtomli: true },
  { id: 'PO43-', form: 'PO₄', belgi: 'PO₄³⁻', zaryad: -3, nom: 'Ortofosfat', kopAtomli: true },
]

const KATION_HARITA = Object.fromEntries(KONSTRUKTOR_KATIONLAR.map((k) => [k.id, k]))
const ANION_HARITA = Object.fromEntries(KONSTRUKTOR_ANIONLAR.map((a) => [a.id, a]))

const BIRIKMALAR = [
  { nom: 'Natriy xlorid', sinf: 'Tuz', k: 'Na+', ks: 1, a: 'Cl-', as: 1, daraja: 'oson', izoh: 'Osh tuzi, hayotiy elektrolit.' },
  { nom: 'Kaliy bromid', sinf: 'Tuz', k: 'K+', ks: 1, a: 'Br-', as: 1, daraja: 'oson', izoh: 'Tibbiyot va fotografiyada qo‘llanadigan tuz.' },
  { nom: 'Kalsiy oksid', sinf: 'Oksid', k: 'Ca2+', ks: 1, a: 'O2-', as: 1, daraja: 'oson', izoh: 'So‘ndirilmagan ohak.' },
  { nom: 'Natriy gidroksid', sinf: 'Asos', k: 'Na+', ks: 1, a: 'OH-', as: 1, daraja: 'oson', izoh: 'O‘yuvchi natriy — kuchli ishqor.' },
  { nom: 'Xlorid kislota', sinf: 'Kislota', k: 'H+', ks: 1, a: 'Cl-', as: 1, daraja: 'oson', izoh: 'Me’da shirasida uchraydigan kuchli kislota.' },
  { nom: 'Nitrat kislota', sinf: 'Kislota', k: 'H+', ks: 1, a: 'NO3-', as: 1, daraja: 'oson', izoh: 'Azotli o‘g‘itlar ishlab chiqarish asosi.' },
  { nom: 'Sulfat kislota', sinf: 'Kislota', k: 'H+', ks: 2, a: 'SO42-', as: 1, daraja: 'oson', izoh: 'Kimyo sanoatining asosiy kislotasi.' },
  { nom: 'Kalsiy gidroksid', sinf: 'Asos', k: 'Ca2+', ks: 1, a: 'OH-', as: 2, daraja: 'oson', izoh: 'So‘ndirilgan ohak, ohakli suv.' },
  { nom: 'Magniy xlorid', sinf: 'Tuz', k: 'Mg2+', ks: 1, a: 'Cl-', as: 2, daraja: 'oson', izoh: 'Dengiz tuzida va magniy olishda uchraydi.' },
  { nom: 'Kaliy sulfid', sinf: 'Tuz', k: 'K+', ks: 2, a: 'S2-', as: 1, daraja: 'oson', izoh: 'Ikki asosli sulfid kislotaning kaliyli tuzi.' },
  { nom: 'Natriy sulfat', sinf: 'Tuz', k: 'Na+', ks: 2, a: 'SO42-', as: 1, daraja: 'oson', izoh: 'Glauber tuzi tarkibi.' },
  { nom: 'Natriy karbonat', sinf: 'Tuz', k: 'Na+', ks: 2, a: 'CO32-', as: 1, daraja: 'oson', izoh: 'Kalsinatsiyalangan soda, shisha ishlab chiqarishda zarur.' },
  { nom: 'Kalsiy karbonat', sinf: 'Tuz', k: 'Ca2+', ks: 1, a: 'CO32-', as: 1, daraja: 'oson', izoh: 'Marmar, bo‘r va ohaktosh formulasi.' },
  { nom: 'Kumush (I) nitrat', sinf: 'Tuz', k: 'Ag+', ks: 1, a: 'NO3-', as: 1, daraja: 'orta', izoh: 'Galogenid ionlarini aniqlovchi asosiy reaktiv.' },
  { nom: 'Mis (II) gidroksid', sinf: 'Asos', k: 'Cu2+', ks: 1, a: 'OH-', as: 2, daraja: 'orta', izoh: 'Havorang (ko‘k) cho‘kma hosil qiluvchi asos.' },
  { nom: 'Mis (II) sulfat', sinf: 'Tuz', k: 'Cu2+', ks: 1, a: 'SO42-', as: 1, daraja: 'orta', izoh: 'Suvsiz holi oq, gidrat holi ko‘k kuporos.' },
  { nom: 'Mis (II) nitrat', sinf: 'Tuz', k: 'Cu2+', ks: 1, a: 'NO3-', as: 2, daraja: 'orta', izoh: 'Misning nitrat kislota bilan reaksiyasi mahsuloti.' },
  { nom: 'Bariy sulfat', sinf: 'Tuz', k: 'Ba2+', ks: 1, a: 'SO42-', as: 1, daraja: 'orta', izoh: 'Kislotalarda ham erimaydigan oq cho‘kma.' },
  { nom: 'Temir (II) sulfid', sinf: 'Tuz', k: 'Fe2+', ks: 1, a: 'S2-', as: 1, daraja: 'orta', izoh: 'Kislota bilan H₂S gazi olishda ishlatiladi.' },
  { nom: 'Temir (II) nitrat', sinf: 'Tuz', k: 'Fe2+', ks: 1, a: 'NO3-', as: 2, daraja: 'orta', izoh: 'Ikki valentli temirning eruvchan tuzi.' },
  { nom: 'Temir (III) xlorid', sinf: 'Tuz', k: 'Fe3+', ks: 1, a: 'Cl-', as: 3, daraja: 'orta', izoh: 'Sariq-qo‘ng‘ir eritma beruvchi uch valentli temir tuzi.' },
  { nom: 'Temir (III) oksid', sinf: 'Oksid', k: 'Fe3+', ks: 2, a: 'O2-', as: 3, daraja: 'orta', izoh: 'Qizil temirtosh va zangning asosiy tarkibi.' },
  { nom: 'Temir (III) gidroksid', sinf: 'Asos', k: 'Fe3+', ks: 1, a: 'OH-', as: 3, daraja: 'orta', izoh: 'Qo‘ng‘ir-qizg‘ish jelatinasimon cho‘kma.' },
  { nom: 'Alyuminiy oksid', sinf: 'Oksid', k: 'Al3+', ks: 2, a: 'O2-', as: 3, daraja: 'orta', izoh: 'Korund, yoqut va sapfir kristallarining asosi.' },
  { nom: 'Alyuminiy nitrat', sinf: 'Tuz', k: 'Al3+', ks: 1, a: 'NO3-', as: 3, daraja: 'orta', izoh: 'Qavslangan anionga ega tuz namunasi.' },
  { nom: 'Ortofosfat kislota', sinf: 'Kislota', k: 'H+', ks: 3, a: 'PO43-', as: 1, daraja: 'orta', izoh: 'O‘rtacha kuchli uch asosli kislota.' },
  { nom: 'Qo‘rg‘oshin (II) yodid', sinf: 'Tuz', k: 'Pb2+', ks: 1, a: 'I-', as: 2, daraja: 'orta', izoh: 'Oltin yomg‘ir effekti beruvchi sariq kristallar.' },
  { nom: 'Ammoniy nitrat', sinf: 'Tuz', k: 'NH4+', ks: 1, a: 'NO3-', as: 1, daraja: 'orta', izoh: 'Ammiakli selitra — muhim azotli o‘g‘it.' },
  { nom: 'Alyuminiy sulfat', sinf: 'Tuz', k: 'Al3+', ks: 2, a: 'SO42-', as: 3, daraja: 'qiyin', izoh: 'Suv tozalashda koagulyant sifatida qo‘llanadi.' },
  { nom: 'Temir (III) sulfat', sinf: 'Tuz', k: 'Fe3+', ks: 2, a: 'SO42-', as: 3, daraja: 'qiyin', izoh: 'Uch valentli temir kationi va sulfat anioni nisbati 2:3.' },
  { nom: 'Kalsiy ortofosfat', sinf: 'Tuz', k: 'Ca2+', ks: 3, a: 'PO43-', as: 2, daraja: 'qiyin', izoh: 'Fosforit va suyak mineralining asosiy qismi.' },
  { nom: 'Magniy ortofosfat', sinf: 'Tuz', k: 'Mg2+', ks: 3, a: 'PO43-', as: 2, daraja: 'qiyin', izoh: '3:2 valentlik kesishuviga klassik misol.' },
  { nom: 'Ammoniy sulfat', sinf: 'Tuz', k: 'NH4+', ks: 2, a: 'SO42-', as: 1, daraja: 'qiyin', izoh: 'Ikki ko‘p atomli iondan tuzilgan qishloq xo‘jaligi tuzi.' },
  { nom: 'Ammoniy karbonat', sinf: 'Tuz', k: 'NH4+', ks: 2, a: 'CO32-', as: 1, daraja: 'qiyin', izoh: 'Qizdirilganda gazlarga to‘liq parchalanadigan tuz.' },
  { nom: 'Kaliy permanganat', sinf: 'Tuz', k: 'K+', ks: 1, a: 'MnO4-', as: 1, daraja: 'qiyin', izoh: 'Margantsovka — kuchli oksidlovchi va antiseptik.' },
  { nom: 'Kaliy dixromat', sinf: 'Tuz', k: 'K+', ks: 2, a: 'Cr2O72-', as: 1, daraja: 'qiyin', izoh: 'Zarg‘aldoq kristall modda, redoks reaksiyalarda ishlatiladi.' },
]

const SUB_RAQAMLAR = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']

function indeksMatni(son) {
  if (!son || son <= 1) return ''
  return String(son)
    .split('')
    .map((c) => SUB_RAQAMLAR[Number(c)] || c)
    .join('')
}

function ekub(a, b) {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

export function formulaMatnYasa(kation, kSoni, anion, aSoni) {
  if (!kation || !anion) return 'Ionlarni tanlang'
  const kQism = kSoni > 1 && kation.kopAtomli ? `(${kation.form})${indeksMatni(kSoni)}` : `${kation.form}${indeksMatni(kSoni)}`
  const aQism = aSoni > 1 && anion.kopAtomli ? `(${anion.form})${indeksMatni(aSoni)}` : `${anion.form}${indeksMatni(aSoni)}`
  return `${kQism}${aQism}`
}

function ismTozala(matn, zaxira) {
  const toza = String(matn || '').trim().replace(/\s+/g, ' ').slice(0, 24)
  return toza || zaxira
}

function shifrla(holat) {
  return shifrlaHolat(holat, NOMSPACE)
}

function och(token) {
  return ochHolat(token, NOMSPACE)
}

function birikmaToplami(daraja) {
  if (daraja === 'oson') return BIRIKMALAR.filter((b) => b.daraja === 'oson')
  if (daraja === 'orta') return BIRIKMALAR.filter((b) => b.daraja !== 'qiyin')
  return BIRIKMALAR
}

function savolYarat(daraja, oxirgiNom = null) {
  const toplam = birikmaToplami(daraja)
  const nomzodlar = toplam.filter((b) => b.nom !== oxirgiNom)
  const b = nomzodlar[randomInt(nomzodlar.length)]
  const kObj = KATION_HARITA[b.k]
  const aObj = ANION_HARITA[b.a]

  const boshqaKat = aralashtir(KONSTRUKTOR_KATIONLAR.filter((x) => x.id !== b.k)).slice(0, 5)
  const boshqaAn = aralashtir(KONSTRUKTOR_ANIONLAR.filter((x) => x.id !== b.a)).slice(0, 5)

  return {
    savolId: qisqaId(),
    nom: b.nom,
    sinf: b.sinf,
    izoh: b.izoh,
    togriK: b.k,
    togriKs: b.ks,
    togriA: b.a,
    togriAs: b.as,
    togriFormula: formulaMatnYasa(kObj, b.ks, aObj, b.as),
    kationlar: aralashtir([kObj, ...boshqaKat]).map((k) => ({
      id: k.id,
      belgi: k.belgi,
      form: k.form,
      zaryad: k.zaryad,
      nom: k.nom,
      kopAtomli: k.kopAtomli,
    })),
    anionlar: aralashtir([aObj, ...boshqaAn]).map((a) => ({
      id: a.id,
      belgi: a.belgi,
      form: a.form,
      zaryad: a.zaryad,
      nom: a.nom,
      kopAtomli: a.kopAtomli,
    })),
    ochilganVaqt: Date.now(),
  }
}

function boshOyinchi(ism) {
  return {
    ism,
    ball: 0,
    togri: 0,
    xato: 0,
    seriya: 0,
    engUzunSeriya: 0,
    blokTugaydi: 0,
    vaqtlar: [],
  }
}

function ommaviyOyinchi(p) {
  return {
    ism: p.ism,
    ball: p.ball,
    togri: p.togri,
    xato: p.xato,
    seriya: p.seriya,
    engUzunSeriya: p.engUzunSeriya,
    blokTugaydi: p.blokTugaydi,
  }
}

function ommaviySavol(s) {
  if (!s) return null
  return {
    savolId: s.savolId,
    nom: s.nom,
    sinf: s.sinf,
    kationlar: s.kationlar,
    anionlar: s.anionlar,
  }
}

function yakunXisobot(holat) {
  const p1 = holat.p1
  const p2 = holat.p2
  let golib = 'p1'
  if (holat.rejim !== 'yakka') {
    if (p1.ball > p2.ball) golib = 'p1'
    else if (p2.ball > p1.ball) golib = 'p2'
    else golib = p1.togri >= p2.togri ? (p1.togri > p2.togri ? 'p1' : 'durang') : 'p2'
  }
  return {
    golib,
    p1: { ...ommaviyOyinchi(p1), ortachaVaqtMs: ortachaMs(p1.vaqtlar) },
    p2: holat.rejim === 'yakka' ? null : { ...ommaviyOyinchi(p2), ortachaVaqtMs: ortachaMs(p2.vaqtlar) },
  }
}

function javobHolati(holat, qoshimcha = {}) {
  const tugagan = Boolean(holat.tugagan)
  return {
    ok: true,
    token: shifrla(holat),
    tugagan,
    rejim: holat.rejim,
    daraja: holat.daraja,
    zaryadHisoblagich: holat.zaryadHisoblagich,
    tugashVaqti: holat.tugashVaqti,
    p1: ommaviyOyinchi(holat.p1),
    p2: holat.rejim === 'yakka' ? null : ommaviyOyinchi(holat.p2),
    umumiySavol: holat.rejim === 'duel-savol' ? ommaviySavol(holat.umumiySavol) : null,
    p1Savol: holat.rejim !== 'duel-savol' ? ommaviySavol(holat.p1Savol) : null,
    p2Savol: holat.rejim === 'duel-vaqt' ? ommaviySavol(holat.p2Savol) : null,
    natija: tugagan ? yakunXisobot(holat) : null,
    ...qoshimcha,
  }
}

export function konstruktorBoshla(sozlama = {}) {
  const rejim = RUXSAT_REJIMLAR.has(sozlama.rejim) ? sozlama.rejim : 'yakka'
  const daraja = RUXSAT_DARAJALAR.has(sozlama.daraja) ? sozlama.daraja : 'orta'
  const vaqtSoniya = RUXSAT_VAQTLAR.has(Number(sozlama.vaqtSoniya)) ? Number(sozlama.vaqtSoniya) : 120
  const zaryadHisoblagich = sozlama.zaryadHisoblagich !== false

  const p1 = boshOyinchi(ismTozala(sozlama.p1Ism, rejim === 'yakka' ? 'Kimyogar' : '1-o‘yinchi'))
  const p2 = boshOyinchi(ismTozala(sozlama.p2Ism, '2-o‘yinchi'))
  const hozir = Date.now()

  const holat = {
    rejim,
    daraja,
    vaqtSoniya,
    zaryadHisoblagich,
    tugashVaqti: hozir + vaqtSoniya * 1000,
    tugagan: false,
    p1,
    p2,
    umumiySavol: rejim === 'duel-savol' ? savolYarat(daraja) : null,
    p1Savol: rejim !== 'duel-savol' ? savolYarat(daraja) : null,
    p2Savol: rejim === 'duel-vaqt' ? savolYarat(daraja) : null,
  }
  return javobHolati(holat)
}

export function konstruktorTekshir({ token, oyinchi = 'p1', kId, kSoni, aId, aSoni, savolId }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi yoki muddati tugagan.' }
  if (holat.tugagan) return javobHolati(holat)

  const hozir = Date.now()
  if (hozir > holat.tugashVaqti + VAQT_GRACE_MS) {
    holat.tugagan = true
    return javobHolati(holat, { yakunSabab: 'Ajratilgan vaqt tugadi.' })
  }

  const kalit = holat.rejim === 'yakka' ? 'p1' : oyinchi === 'p2' ? 'p2' : 'p1'
  const p = holat[kalit]
  if (p.blokTugaydi && hozir < p.blokTugaydi) {
    return javobHolati(holat, { natijaKod: 'blok' })
  }

  const savolMaydoni =
    holat.rejim === 'duel-savol' ? 'umumiySavol' : kalit === 'p1' ? 'p1Savol' : 'p2Savol'
  const savol = holat[savolMaydoni]
  if (!savol || savol.savolId !== savolId) {
    return javobHolati(holat, { natijaKod: 'eskirgan' })
  }

  const ks = Math.max(1, Math.min(4, Number(kSoni) || 1))
  const as = Math.max(1, Math.min(4, Number(aSoni) || 1))
  const kObj = KATION_HARITA[kId]
  const aObj = ANION_HARITA[aId]

  if (!kObj || !aObj) {
    return javobHolati(holat, { natijaKod: 'xato', javobOyinchi: kalit, xatoIzoh: 'Kation va anionni tanlang.' })
  }

  const zaryadYigindi = kObj.zaryad * ks + aObj.zaryad * as
  const togriIonlar = kId === savol.togriK && aId === savol.togriA
  const engKichikNisbat = ekub(ks, as) === 1
  const togri = togriIonlar && zaryadYigindi === 0 && engKichikNisbat && ks === savol.togriKs && as === savol.togriAs

  if (togri) {
    const sarfMs = Math.max(400, Math.min(30000, hozir - (savol.ochilganVaqt || hozir)))
    p.togri += 1
    p.seriya += 1
    if (p.seriya > p.engUzunSeriya) p.engUzunSeriya = p.seriya
    const tezBonus = sarfMs <= 5500 ? 10 : 0
    const qoshilganBall = 30 + Math.min(30, (p.seriya - 1) * 6) + tezBonus
    p.ball += qoshilganBall
    p.vaqtlar.push(sarfMs)
    if (holat.rejim === 'duel-savol') {
      holat.p1.blokTugaydi = 0
      holat.p2.blokTugaydi = 0
    }

    const formula = savol.togriFormula
    const mMassa = molyarMassaHisobla(formula)
    const mQism = mMassa > 0 ? `, M = ${mMassa.toFixed(1)} g/mol` : ''
    const izoh = `${formula} (${savol.nom}${mQism}) — ${savol.izoh}`
    holat[savolMaydoni] = savolYarat(holat.daraja, savol.nom)
    return javobHolati(holat, {
      natijaKod: 'togri',
      javobOyinchi: kalit,
      qoshilganBall,
      tasdiqIzoh: izoh,
    })
  }

  p.xato += 1
  p.seriya = 0
  p.ball = Math.max(0, p.ball - 5)

  let sabab = 'Ionlar maqsadli moddaga mos emas.'
  if (!togriIonlar) {
    if (kId !== savol.togriK && aId !== savol.togriA) sabab = 'Kation ham, anion ham boshqa moddaga tegishli.'
    else if (kId !== savol.togriK) sabab = 'Anion to‘g‘ri, lekin kation (yoki uning valentligi) boshqacha.'
    else sabab = 'Kation to‘g‘ri, lekin anion boshqa kislota qoldig‘iga tegishli.'
  } else if (zaryadYigindi !== 0) {
    sabab = `Elektroneytrallik buzilgan: umumiy zaryad ${zaryadYigindi > 0 ? `+${zaryadYigindi}` : zaryadYigindi} ga teng (0 bo‘lishi kerak).`
  } else if (!engKichikNisbat) {
    sabab = 'Zaryad 0, lekin indekslar eng kichik butun nisbatga (EKUB = 1) qisqartirilishi kerak!'
  }

  if (holat.rejim === 'duel-savol') {
    p.blokTugaydi = hozir + DUEL_BLOK_MS
  }

  return javobHolati(holat, {
    natijaKod: 'xato',
    javobOyinchi: kalit,
    xatoIzoh: sabab,
  })
}

export function konstruktorOtkaz({ token, oyinchi = 'p1', savolId }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi.' }
  if (holat.tugagan || holat.rejim === 'duel-savol') return javobHolati(holat)

  const kalit = holat.rejim === 'yakka' ? 'p1' : oyinchi === 'p2' ? 'p2' : 'p1'
  const savolMaydoni = kalit === 'p1' ? 'p1Savol' : 'p2Savol'
  const savol = holat[savolMaydoni]
  if (!savol || savol.savolId !== savolId) return javobHolati(holat)

  const javobi = `${savol.togriFormula} (${savol.nom})`
  holat[kalit].seriya = 0
  holat[savolMaydoni] = savolYarat(holat.daraja, savol.nom)
  return javobHolati(holat, {
    natijaKod: 'otkaz',
    javobOyinchi: kalit,
    xatoIzoh: `O‘tkazib yuborildi. To‘g‘ri formula: ${javobi}.`,
  })
}

export function konstruktorTugat({ token }) {
  const holat = och(token)
  if (!holat) return { ok: false, status: 400, xato: 'Sessiya topilmadi.' }
  holat.tugagan = true
  return javobHolati(holat, { yakunSabab: 'O‘yin yakunlandi.' })
}
