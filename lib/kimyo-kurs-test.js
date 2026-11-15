import { kunKaliti, toshkentSanaParsla } from './sana.js'

export const KURS_SAVOL_SONI = 20

const KUN_MS = 86_400_000

export function yakshanbaVaqti(sana) {
  if (typeof sana !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(sana)) return null
  const ochiladi = toshkentSanaParsla(`${sana}T00:00`)
  if (!ochiladi || kunKaliti(ochiladi) !== sana || new Date(`${sana}T00:00:00Z`).getUTCDay() !== 0) return null
  return { ochiladi, yopiladi: new Date(ochiladi.getTime() + KUN_MS) }
}

export function yaqinYakshanba(vaqt = new Date()) {
  const kun = new Date(`${kunKaliti(vaqt)}T00:00:00Z`)
  kun.setUTCDate(kun.getUTCDate() + (7 - kun.getUTCDay()) % 7)
  return kun.toISOString().slice(0, 10)
}

export function kursTestHolati(test, hozir = new Date()) {
  if (!test.nashrVaqti) return 'qoralama'
  if (hozir < new Date(test.ochiladi)) return 'kutilmoqda'
  return hozir < new Date(test.yopiladi) ? 'ochiq' : 'yopiq'
}

function matn(qiymat, engKop) {
  if (typeof qiymat !== 'string') return ''
  const toza = qiymat.trim()
  return toza.length <= engKop ? toza : ''
}

export function kursTestKodiniTekshir(qiymat) {
  const kod = matn(qiymat, 24).toUpperCase()
  return /^[A-Z0-9-]{4,24}$/.test(kod) ? kod : ''
}

export function kursTestniTekshir(tana) {
  const sarlavha = matn(tana?.sarlavha, 120)
  const mavzular = matn(tana?.mavzular, 240)
  const vaqt = yakshanbaVaqti(tana?.sana)
  const kod = kursTestKodiniTekshir(tana?.kod)
  if (tana?.kod && !kod) return { xato: 'Kod uchun 4–24 ta lotin harfi, raqam yoki chiziqcha kiriting.' }
  if (!sarlavha || !mavzular || !vaqt) return { xato: 'Sarlavha, mavzular va yakshanba sanasini kiriting.' }
  if (!Array.isArray(tana.savollar) || tana.savollar.length > 100) return { xato: '100 tagacha savol qo‘shish mumkin.' }

  const savollar = []
  for (const [i, savol] of tana.savollar.entries()) {
    const nom = matn(savol?.matn, 2000)
    const variantlar = Array.isArray(savol?.variantlar) ? savol.variantlar.map(v => matn(v, 600)) : []
    const togri = savol?.togri
    if (!nom || variantlar.length !== 4 || variantlar.some(v => !v) ||
        new Set(variantlar).size !== 4 || !Number.isInteger(togri) || togri < 0 || togri >= variantlar.length) {
      return { xato: `${i + 1}-savol matnini, to‘rtta turli variantini va to‘g‘ri javobini tekshiring.` }
    }
    savollar.push({ matn: nom, variantlar, togri })
  }

  return { data: { sana: tana.sana, sarlavha, mavzular, savollar, kod: kod || null, ...vaqt } }
}

export function kursIsminiTekshir(qiymat) {
  const ism = matn(qiymat, 80).replace(/\s+/g, ' ').normalize('NFC')
  return /^[\p{L}\p{M}][\p{L}\p{M} .’‘ʻʼ'-]*$/u.test(ism) ? ism : ''
}

export function kursJavoblariniBahola(bank, javoblar, savolTartibi = null) {
  const savollar = savolTartibi ? savolTartibi.map(i => bank[i]) : bank
  if (!Array.isArray(javoblar) || javoblar.length !== savollar.length) return null
  const xatolar = []
  for (const [i, savol] of savollar.entries()) {
    if (!savol) return null
    const javob = javoblar[i]
    if (javob !== null && (!Number.isInteger(javob) || javob < 0 || javob >= savol.variantlar.length)) return null
    if (javob !== savol.togri) {
      xatolar.push({
        tartib: i + 1,
        savol: savol.matn,
        tanlangan: javob === null ? null : savol.variantlar[javob],
        togri: savol.variantlar[savol.togri],
      })
    }
  }
  return { ball: savollar.length - xatolar.length, jami: savollar.length, xatolar }
}
