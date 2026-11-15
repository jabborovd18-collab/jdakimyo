// lib/hikoya-turlari.js
//
// 24 soatlik "Ilmiy Hikoyalar" (Stories) turlari, gradient uslublari
// va mualliflar bo'yicha guruhlash/saralash mantiqi.

export const HIKOYA_MUDDATI_SOAT = 24
export const MAX_FAOL_HIKOYA = 10
export const MAX_HIKOYA_MATN = 320

export const HIKOYA_TURLARI = [
  {
    kalit: 'dolzarb',
    nom: 'Dolzarb mavzu',
    qisqa: 'Dolzarb',
    ikon: 'olov',
    maslahat: 'Bugungi eng muhim kimyoviy mavzu, yangilik yoki muhokama...',
  },
  {
    kalit: 'formula',
    nom: 'Kunlik formula',
    qisqa: 'Formula',
    ikon: 'atom',
    maslahat: "Eslab qolish kerak bo'lgan reaksiya tenglamasi yoki qoida...",
  },
  {
    kalit: 'eslatma',
    nom: 'Muhim konspekt',
    qisqa: 'Eslatma',
    ikon: 'kitob',
    maslahat: "Imtihon yoki olimpiadada ko'p tushadigan muhim nuqta...",
  },
  {
    kalit: 'maqsad',
    nom: 'Bugungi maqsad',
    qisqa: 'Maqsad',
    ikon: 'kubok',
    maslahat: 'Bugun nechta masala yechdingiz yoki qanday marra belgiladingiz?',
  },
  {
    kalit: 'savol',
    nom: 'Tezkor savol',
    qisqa: 'Savol',
    ikon: 'xabar',
    maslahat: "Obunachilaringiz va tengdoshlaringizdan tezkor javob so'rang...",
  },
  {
    kalit: 'repost',
    nom: 'Tavsiya etilgan post',
    qisqa: 'Post tavsiyasi',
    ikon: 'ulashish',
    maslahat: 'Shu post haqida qisqacha fikringiz yoki eslatmangiz (ixtiyoriy)...',
  },
]

export const HIKOYA_USLUBLARI = [
  {
    kalit: 'kosmik',
    nom: 'Kosmik safir',
    fonClass: 'bg-gradient-to-br from-[#0b1536] via-[#13255c] to-[#070d24]',
    halqaStyle: 'linear-gradient(135deg, #38bdf8, #818cf8, #c084fc)',
    urguRang: '#38bdf8',
    namuna: ['#0b1536', '#38bdf8'],
  },
  {
    kalit: 'zumrad',
    nom: 'Zumrad laboratoriya',
    fonClass: 'bg-gradient-to-br from-[#052923] via-[#0b473e] to-[#041916]',
    halqaStyle: 'linear-gradient(135deg, #34d399, #10b981, #2dd4bf)',
    urguRang: '#34d399',
    namuna: ['#052923', '#34d399'],
  },
  {
    kalit: 'oltin',
    nom: 'Oltin rezonans',
    fonClass: 'bg-gradient-to-br from-[#2d1a05] via-[#4f2e0a] to-[#1a0f03]',
    halqaStyle: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fb7185)',
    urguRang: '#fbbf24',
    namuna: ['#2d1a05', '#fbbf24'],
  },
  {
    kalit: 'safir',
    nom: 'Binafsha plazma',
    fonClass: 'bg-gradient-to-br from-[#1d1036] via-[#341c5e] to-[#10081f]',
    halqaStyle: 'linear-gradient(135deg, #c084fc, #a855f7, #ec4899)',
    urguRang: '#c084fc',
    namuna: ['#1d1036', '#c084fc'],
  },
  {
    kalit: 'alvon',
    nom: 'Alvon energiya',
    fonClass: 'bg-gradient-to-br from-[#330c18] via-[#59152b] to-[#1c060d]',
    halqaStyle: 'linear-gradient(135deg, #fb7185, #f43f5e, #fbbf24)',
    urguRang: '#fb7185',
    namuna: ['#330c18', '#fb7185'],
  },
]

const TUR_MAP = Object.fromEntries(HIKOYA_TURLARI.map((t) => [t.kalit, t]))
const USLUB_MAP = Object.fromEntries(HIKOYA_USLUBLARI.map((u) => [u.kalit, u]))

export function hikoyaTuriniTekshir(turi) {
  if (!turi || typeof turi !== 'string') return 'dolzarb'
  const toza = turi.trim().toLowerCase()
  return TUR_MAP[toza] ? toza : 'dolzarb'
}

export function hikoyaTuriHaqida(turi) {
  return TUR_MAP[hikoyaTuriniTekshir(turi)] || HIKOYA_TURLARI[0]
}

export function hikoyaUslubiniTekshir(uslub) {
  if (!uslub || typeof uslub !== 'string') return 'kosmik'
  const toza = uslub.trim().toLowerCase()
  return USLUB_MAP[toza] ? toza : 'kosmik'
}

export function hikoyaUslubiHaqida(uslub) {
  return USLUB_MAP[hikoyaUslubiniTekshir(uslub)] || HIKOYA_USLUBLARI[0]
}

/**
 * Tekis hikoyalar ro'yxatini mualliflar bo'yicha guruhlaydi va saralaydi:
 * 1. Joriy foydalanuvchining o'z hikoyalari (doim 1-o'rinda);
 * 2. Ko'rilmagan (yangi) hikoyasi bor obunalar/do'stlar/ustozlar;
 * 3. Barcha hikoyalari ko'rilgan mualliflar.
 */
export function hikoyalarniGuruhla(hikoyalar = [], joriyUserId = null) {
  if (!Array.isArray(hikoyalar) || hikoyalar.length === 0) return []

  const guruhMap = new Map()

  // Hikoyalarni muallif ichida eskidan yangiga qarab joylashtiramiz (ketma-ket ko'rish uchun)
  const vaqtBoyicha = [...hikoyalar].sort(
    (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
  )

  for (const h of vaqtBoyicha) {
    const muallif = h?.muallif
    const muallifId = muallif?.id || h?.userId
    if (!muallifId) continue

    if (!guruhMap.has(muallifId)) {
      guruhMap.set(muallifId, {
        muallifId,
        ozimniki: Boolean(joriyUserId && muallifId === joriyUserId),
        muallif: muallif || { id: muallifId, username: 'foydalanuvchi' },
        hikoyalar: [],
        yangiSoni: 0,
        oxirgiVaqt: 0,
      })
    }

    const guruh = guruhMap.get(muallifId)
    guruh.hikoyalar.push(h)
    if (!h.korildimi && !guruh.ozimniki) {
      guruh.yangiSoni += 1
    }
    const vaqt = new Date(h.createdAt || 0).getTime()
    if (vaqt > guruh.oxirgiVaqt) {
      guruh.oxirgiVaqt = vaqt
    }
  }

  return [...guruhMap.values()].sort((a, b) => {
    if (a.ozimniki !== b.ozimniki) return a.ozimniki ? -1 : 1
    const aYangi = a.yangiSoni > 0
    const bYangi = b.yangiSoni > 0
    if (aYangi !== bYangi) return aYangi ? -1 : 1
    if (Boolean(a.muallif?.dostmi) !== Boolean(b.muallif?.dostmi)) {
      return a.muallif?.dostmi ? -1 : 1
    }
    if (Boolean(a.muallif?.obunami) !== Boolean(b.muallif?.obunami)) {
      return a.muallif?.obunami ? -1 : 1
    }
    if (Boolean(a.muallif?.isTeacher) !== Boolean(b.muallif?.isTeacher)) {
      return a.muallif?.isTeacher ? -1 : 1
    }
    return b.oxirgiVaqt - a.oxirgiVaqt
  })
}
