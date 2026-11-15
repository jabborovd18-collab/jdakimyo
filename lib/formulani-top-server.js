import { createCipheriv, createDecipheriv, createHmac, randomBytes, randomInt, randomUUID } from 'node:crypto'
import { authMaxfiyKaliti } from '@/lib/auth-maxfiy-kalit'
import { FORMULA_TOP_MODDALAR, formulaTopAudioNomi, formulaTopIshora } from '@/data/formulani-top'

const VARIANTLAR_SONI = 24
const RAUND_UZOQLIGI = 45 * 60 * 1000
const SAVOLLAR_SONI = 7

function kalit() {
  return createHmac('sha256', authMaxfiyKaliti()).update('formulani-top/v1').digest()
}

function shifrla(holat) {
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', kalit(), nonce)
  const tana = Buffer.concat([cipher.update(JSON.stringify(holat)), cipher.final()])
  // Savol javobi va raund hisobi klient ko'ra oladigan matnga tushmasin.
  return Buffer.concat([nonce, cipher.getAuthTag(), tana]).toString('base64url')
}

function och(token) {
  if (typeof token !== 'string' || token.length > 8192) return null
  try {
    const baytlar = Buffer.from(token, 'base64url')
    const cipher = createDecipheriv('aes-256-gcm', kalit(), baytlar.subarray(0, 12))
    cipher.setAuthTag(baytlar.subarray(12, 28))
    const holat = JSON.parse(Buffer.concat([cipher.update(baytlar.subarray(28)), cipher.final()]))
    return Date.now() < holat.tugaydi ? holat : null
  } catch {
    return null
  }
}

function aralashtir(royxat) {
  const nusxa = [...royxat]
  for (let i = nusxa.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1)
    const qiymat = nusxa[i]
    nusxa[i] = nusxa[j]
    nusxa[j] = qiymat
  }
  return nusxa
}

function savolBer(holat) {
  const togri = holat.savollar[holat.indeks]
  const audio = `/oyinlar/formulani-top/ovoz/${formulaTopAudioNomi(holat.daraja, togri)}`
  const model = holat.daraja >= 3
  const nomzodlar = FORMULA_TOP_MODDALAR.flatMap((modda, indeks) =>
    indeks !== togri && (!model || modda.tuzilma) ? [indeks] : [])

  const variantlar = aralashtir([togri, ...aralashtir(nomzodlar).slice(0, VARIANTLAR_SONI - 1)])
    .map(indeks => ({ indeks, id: randomUUID() }))

  return {
    token: shifrla({ ...holat, variantlar }),
    ishora: formulaTopIshora(FORMULA_TOP_MODDALAR[togri], holat.daraja),
    audio,
    tartib: holat.indeks + 1,
    jami: holat.savollar.length,
    ball: holat.ball,
    variantlar: variantlar.map(({ indeks, id }) => ({
      id,
      ...(model ? { tuzilma: FORMULA_TOP_MODDALAR[indeks].tuzilma } : { formula: FORMULA_TOP_MODDALAR[indeks].formula }),
    })),
  }
}

export function oyinniBoshla(daraja) {
  if (![1, 2, 3, 4].includes(daraja)) return null
  const mosSavollar = FORMULA_TOP_MODDALAR.flatMap((modda, indeks) =>
    formulaTopIshora(modda, daraja) ? [indeks] : [])

  return savolBer({
    daraja,
    savollar: aralashtir(mosSavollar).slice(0, SAVOLLAR_SONI),
    indeks: 0,
    ball: 0,
    xatolar: [],
    tugaydi: Date.now() + RAUND_UZOQLIGI,
  })
}

export function javobniBaho(token, tanlov) {
  const holat = och(token)
  if (!holat) return null
  const tanlangan = holat.variantlar.find(({ id }) => id === tanlov)
  if (tanlov !== null && !tanlangan) return null

  const togri = holat.savollar[holat.indeks]
  const modda = FORMULA_TOP_MODDALAR[togri]
  const togrimi = tanlangan?.indeks === togri
  const javob = { nom: modda.nom, formula: modda.formula, trivial: modda.trivial }
  const ball = holat.ball + Number(togrimi)
  const xatolar = togrimi ? holat.xatolar : [...holat.xatolar, javob]
  const indeks = holat.indeks + 1

  return {
    javob,
    togrimi,
    togriId: holat.variantlar.find(({ indeks }) => indeks === togri).id,
    manba: holat.daraja === 4 ? modda.tarix.manba : null,
    ball,
    xatolar,
    keyingi: indeks < holat.savollar.length
      ? savolBer({ daraja: holat.daraja, savollar: holat.savollar, indeks, ball, xatolar, tugaydi: holat.tugaydi })
      : null,
  }
}
