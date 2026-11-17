import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { register } from 'node:module'

const ROOT = path.resolve('.')

// `@/` Next.js aliasini hamda test muhitida `@/lib/prisma` va `.json` importlarini
// hal qiluvchi yengil Node ESM loader hook.
const HOOK_KOD = `
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = ${JSON.stringify(ROOT)}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@/lib/prisma') {
    return { shortCircuit: true, url: 'virtual:prisma-stub' }
  }
  if (specifier.startsWith('@/')) {
    const manzil = path.join(ROOT, specifier.slice(2))
    const nomzod = fs.existsSync(manzil) ? manzil : manzil + '.js'
    return { shortCircuit: true, url: pathToFileURL(nomzod).href }
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url === 'virtual:prisma-stub') {
    return {
      shortCircuit: true,
      format: 'module',
      source: 'export const prisma = { articleStat: {} };',
    }
  }
  if (url.endsWith('.json')) {
    return {
      shortCircuit: true,
      format: 'json',
      source: fs.readFileSync(new URL(url), 'utf8'),
    }
  }
  return nextLoad(url, context)
}
`

register(`data:text/javascript,${encodeURIComponent(HOOK_KOD)}`, import.meta.url)

const { maqolalar, maqolaFayliBormi, statQoshilgan } = await import('../lib/maqolalar.js')
const { sanoqchiOshir } = await import('../lib/maqola-stat.js')

describe('Maqolalar katalogi va yuklash sanoqchisi himoyasi', () => {
  test("public/data/maqolalar.json va statQoshilgan({}) da o‘lik (404) fayl havolalari yo‘q", () => {
    const xomJson = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'public', 'data', 'maqolalar.json'), 'utf8'),
    )
    assert.ok(Array.isArray(xomJson) && xomJson.length > 0)

    const natija = statQoshilgan({})
    assert.equal(natija.length, maqolalar.length)

    for (const m of natija) {
      for (const maydon of [
        'id',
        'sarlavha',
        'muallif',
        'sana',
        'qisqacha',
        'kalitSozlar',
        'korishlar',
        'yuklashlar',
        'faylMavjud',
      ]) {
        assert.ok(maydon in m, `Maqolada '${maydon}' maydoni bo‘lishi kerak (id=${m.id})`)
      }

      if (m.fayl) {
        const nisbiy = String(m.fayl).replace(/^\/+/, '')
        const diskYoli = path.join(ROOT, 'public', nisbiy)
        assert.ok(
          fs.existsSync(diskYoli),
          `public/data/maqolalar.json da mavjud bo'lmagan fayl havolasi topildi: ${m.fayl}`,
        )
        assert.equal(m.faylMavjud, true)
      } else {
        assert.equal(m.fayl, null)
        assert.equal(m.faylMavjud, false)
        assert.equal(maqolaFayliBormi(m), false)
      }
    }
  })

  test("sanoqchiOshir fayli yo‘q maqola uchun 'yuklash' so‘rovini 404 bilan rad etadi", async () => {
    let dbChaqirildi = false
    const mockDb = {
      articleStat: {
        async findUnique() {
          dbChaqirildi = true
          return null
        },
        async upsert() {
          dbChaqirildi = true
          return { views: 0, downloads: 1 }
        },
      },
    }

    const res = await sanoqchiOshir(1, 'yuklash', 'test-ip-yuklash', mockDb)
    assert.equal(res.ok, false)
    assert.equal(res.status, 404)
    assert.equal(res.xato, 'Maqola fayli hali yuklanmagan')
    assert.equal(dbChaqirildi, false, 'Faylsiz yuklash bazaga yozilmasligi kerak')

    const notFound = await sanoqchiOshir('999999', 'yuklash', 'test-ip-yuklash', mockDb)
    assert.equal(notFound.ok, false)
    assert.equal(notFound.status, 404)

    const badType = await sanoqchiOshir(1, 'notogri_tur', 'test-ip-yuklash', mockDb)
    assert.equal(badType.ok, false)
    assert.equal(badType.status, 400)
  })

  test("sanoqchiOshir 'korish' turida bazaga yozadi va takror so‘rovni himoyalaydi", async () => {
    let views = 0
    const mockDb = {
      articleStat: {
        async findUnique() {
          return { views, downloads: 0 }
        },
        async upsert() {
          views += 1
          return { views, downloads: 0 }
        },
      },
    }

    const kim = `test-ip-korish-${Date.now()}`
    const birinchi = await sanoqchiOshir(1, 'korish', kim, mockDb)
    assert.deepEqual(birinchi, { ok: true, views: 1, downloads: 0 })

    const ikkinchi = await sanoqchiOshir(1, 'korish', kim, mockDb)
    assert.deepEqual(ikkinchi, { ok: true, takror: true, views: 1, downloads: 0 })
    assert.equal(views, 1)
  })
})
