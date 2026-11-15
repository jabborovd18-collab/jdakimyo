import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prismaPkg from '@prisma/client'
import {
  adminUsersSortQuery,
  msDashboardHolatInfo,
  isValidMissionType,
  MISSION_VALID_TYPES,
  normalizeLogTargetWhere,
  buildSiteSettingsData,
} from '../lib/admin-yordamchi.js'
import { toshkentDatetimeLocal, toshkentSanaParsla } from '../lib/sana.js'

const { Prisma } = prismaPkg
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('adminUsersSortQuery validates allowlisted columns and falls back safely', () => {
  assert.deepEqual(adminUsersSortQuery('totalPoints', 'asc'), { totalPoints: 'asc' })
  assert.deepEqual(adminUsersSortQuery('lastActive', 'desc'), { lastActive: 'desc' })
  assert.deepEqual(adminUsersSortQuery('password', 'asc'), { createdAt: 'asc' })
  assert.deepEqual(adminUsersSortQuery('__proto__', 'INVALID'), { createdAt: 'desc' })
})

test('msDashboardHolatInfo covers jadvalHolatiAniqlash states', () => {
  assert.equal(msDashboardHolatInfo('ochiq').tone, 'success')
  assert.equal(msDashboardHolatInfo('kutilmoqda').tone, 'info')
  assert.equal(msDashboardHolatInfo('tekshirilmoqda').tone, 'warning')
  assert.equal(msDashboardHolatInfo('elon_qilindi').tone, 'primary')
  assert.equal(msDashboardHolatInfo('yopiq').tone, 'neutral')
  assert.equal(msDashboardHolatInfo('belgilanmagan').tone, 'neutral')
})

test('mission type allowlist excludes obsolete v3 types', () => {
  assert.deepEqual(MISSION_VALID_TYPES.sort(), ['friend', 'muhokama', 'post', 'quiz'])
  assert.equal(isValidMissionType('quiz'), true)
  assert.equal(isValidMissionType('muhokama'), true)
  assert.equal(isValidMissionType('video'), false)
  assert.equal(isValidMissionType('compound'), false)
  assert.equal(isValidMissionType('mission'), false)
})

test('normalizeLogTargetWhere maps logical filters to canonical and legacy DB types', () => {
  assert.equal(normalizeLogTargetWhere('all'), undefined)
  assert.deepEqual(normalizeLogTargetWhere('user'), { in: ['User', 'user'] })
  assert.equal(normalizeLogTargetWhere('MsImtihon'), 'MsImtihon')
  assert.deepEqual(normalizeLogTargetWhere('ai_gateway'), { in: ['ai_gateway', 'ai_cache', 'ai_settings'] })
})

test('buildSiteSettingsData whitelists fields and strips unexpected keys', () => {
  const cleaned = buildSiteSettingsData({
    siteName: '  JDA KIMYO  ',
    id: 'hacked-id',
    updatedAt: '1999-01-01',
    questionsPerQuiz: '200',
    quizTimeLimit: '',
    maintenanceMode: 1,
  })
  assert.equal('id' in cleaned, false)
  assert.equal('updatedAt' in cleaned, false)
  assert.equal(cleaned.siteName, 'JDA KIMYO')
  assert.equal(cleaned.questionsPerQuiz, 100)
  assert.equal(cleaned.quizTimeLimit, null)
  assert.equal(cleaned.maintenanceMode, true)
})

test('toshkentDatetimeLocal and toshkentSanaParsla round-trip cleanly in UTC+5', () => {
  const isoUtc = '2026-11-13T10:00:00.000Z' // 15:00 Tashkent
  assert.equal(toshkentDatetimeLocal(isoUtc), '2026-11-13T15:00')
  const parsed = toshkentSanaParsla('2026-11-13T15:00')
  assert.equal(parsed.toISOString(), isoUtc)
})

function jsFayllarniYig(dir) {
  const topildi = []
  if (!fs.existsSync(dir)) return topildi
  for (const kirish of fs.readdirSync(dir, { withFileTypes: true })) {
    const manzil = path.join(dir, kirish.name)
    if (kirish.isDirectory()) {
      topildi.push(...jsFayllarniYig(manzil))
    } else if (kirish.name.endsWith('.js') || kirish.name.endsWith('.jsx')) {
      topildi.push(manzil)
    }
  }
  return topildi
}

test('admin sahifalari va API laridagi barcha prisma modellari schema bilan mos', () => {
  const mavjudModellar = new Set(
    Prisma.dmmf.datamodel.models.map((m) => m.name[0].toLowerCase() + m.name.slice(1))
  )
  const amallar =
    'findMany|findUnique|findFirst|count|aggregate|groupBy|create|update|updateMany|delete|deleteMany|upsert'
  const naqsh = new RegExp(`\\bprisma\\.([a-zA-Z0-9_]+)\\.(${amallar})\\b`, 'g')

  const xatolar = []
  for (const papka of ['app/admin', 'app/api/admin', 'components/admin']) {
    for (const fayl of jsFayllarniYig(path.join(ROOT_DIR, papka))) {
      const matn = fs.readFileSync(fayl, 'utf8')
      for (const m of matn.matchAll(naqsh)) {
        if (!mavjudModellar.has(m[1])) {
          xatolar.push(`${path.relative(ROOT_DIR, fayl)}: prisma.${m[1]}.${m[2]}`)
        }
      }
    }
  }

  assert.deepEqual(xatolar, [])
})
