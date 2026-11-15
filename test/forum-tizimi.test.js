import test from 'node:test'
import assert from 'node:assert/strict'
import {
  cleanText,
  ball,
  mavzularniTartibla,
  postniTayyorla,
  royxatParametrlari,
  mavzuQidiruvWhere,
  taqiqXabari,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '../lib/forum.js'

test('cleanText matnni tozalaydi va chegaralarni tekshiradi', () => {
  const ok = cleanText('  Salom\r\n\r\n\r\n\r\nDunyo  ', { min: 2, max: 50, label: 'Matn' })
  assert.deepEqual(ok, { ok: true, value: 'Salom\n\n\nDunyo' })

  assert.equal(cleanText('a', { min: 2, max: 50 }).ok, false)
  assert.equal(cleanText('a'.repeat(11), { min: 2, max: 10 }).ok, false)
  assert.equal(cleanText(null, { min: 2, max: 50 }).ok, false)
})

test('royxatParametrlari xavfsiz sort, limit, offset va q qaytaradi', () => {
  const sp = new URLSearchParams({ sort: 'hack', limit: '999', offset: '-10', q: '  kislota  ' })
  const p = royxatParametrlari(sp)
  assert.equal(p.sort, 'dolzarb')
  assert.equal(p.limit, MAX_LIMIT)
  assert.equal(p.offset, 0)
  assert.equal(p.q, 'kislota')

  const maqola = royxatParametrlari(new URLSearchParams(), { articleId: 'art-1' })
  assert.equal(maqola.sort, 'yangi')
  assert.equal(maqola.limit, DEFAULT_LIMIT)

  const ommabop = royxatParametrlari(new URLSearchParams({ sort: 'ommabop', limit: '0' }))
  assert.equal(ommabop.sort, 'ommabop')
  assert.equal(ommabop.limit, 1)
})

test('mavzularniTartibla 200 dan ortiq mavzuda ham qadalgan va mashhur postlarni yoqotmaydi', () => {
  const hozir = Date.parse('2026-11-14T10:00:00.000Z')
  const rows = []

  // 250 ta oddiy yangi mavzu
  for (let i = 0; i < 250; i += 1) {
    rows.push({
      id: `n-${i}`,
      isPinned: false,
      createdAt: new Date(hozir - i * 60_000).toISOString(),
      _count: { likes: 0, replies: 0 },
    })
  }

  // Eng eski lekin juda mashhur va qadalgan mavzular
  rows.push({
    id: 'eski-qadalgan',
    isPinned: true,
    createdAt: new Date(hozir - 1000 * 3_600_000).toISOString(),
    _count: { likes: 1, replies: 0 },
  })
  rows.push({
    id: 'eski-ommabop',
    isPinned: false,
    createdAt: new Date(hozir - 800 * 3_600_000).toISOString(),
    _count: { likes: 40, replies: 15 },
  })

  const ommabop = mavzularniTartibla(rows, 'ommabop', hozir)
  assert.equal(ommabop[0].id, 'eski-qadalgan')
  assert.equal(ommabop[1].id, 'eski-ommabop')

  const yangi = mavzularniTartibla(rows, 'yangi', hozir)
  assert.equal(yangi[0].id, 'eski-qadalgan')
  assert.equal(yangi[1].id, 'n-0')

  const dolzarb = mavzularniTartibla(rows, 'dolzarb', hozir)
  assert.equal(dolzarb[0].id, 'eski-qadalgan')
  assert.ok(ball(rows[0], true, hozir) > ball(rows[200], true, hozir))
})

test('postniTayyorla rad etish sababini faqat rad etilgan post muallifiga ko\'rsatadi', () => {
  const bazaPost = {
    id: 'p-1',
    authorId: 'u-author',
    title: 'Mavzu',
    content: 'Matn',
    status: 'rejected',
    rejectReason: 'Reklama havolasi',
    author: { id: 'u-author', username: 'ali' },
    _count: { likes: 3, replies: 2 },
  }

  const muallifga = postniTayyorla(bazaPost, new Set(['p-1']), 'u-author')
  assert.equal('authorId' in muallifga, false)
  assert.equal(muallifga.rejectReason, 'Reklama havolasi')
  assert.equal(muallifga.likes, 3)
  assert.equal(muallifga.replyCount, 2)
  assert.equal(muallifga.likedByMe, true)

  const begona = postniTayyorla(bazaPost, new Set(), 'u-other')
  assert.equal(begona.rejectReason, null)

  const mehmon = postniTayyorla(bazaPost, new Set(), null)
  assert.equal(mehmon.rejectReason, null)

  const tasdiqlangan = postniTayyorla(
    { ...bazaPost, status: 'approved' },
    new Set(),
    'u-author'
  )
  assert.equal(tasdiqlangan.rejectReason, null)
})

test('mavzuQidiruvWhere muallifning rad etilgan/kutayotgan postlarini hamda qidiruvni to\'g\'ri quradi', () => {
  const mehmon = mavzuQidiruvWhere({})
  assert.deepEqual(mehmon.OR, [{ status: 'approved' }])

  const muallif = mavzuQidiruvWhere({ userId: 'u-1', q: 'titrlash' })
  assert.deepEqual(muallif.OR, [
    { status: 'approved' },
    { authorId: 'u-1', status: { in: ['pending', 'rejected'] } },
  ])
  assert.equal(muallif.AND[0].OR[0].title.contains, 'titrlash')
  assert.equal(muallif.AND[0].OR[1].content.contains, 'titrlash')
})

test('taqiqXabari bloklangan va vaqtincha yozish taqiqlangan hisoblarni ushlaydi', () => {
  const hozir = Date.parse('2026-11-14T10:00:00.000Z')
  assert.equal(taqiqXabari(null, hozir), 'Hisobingiz bloklangan')
  assert.equal(taqiqXabari({ isBanned: true }, hozir), 'Hisobingiz bloklangan')

  const faolTaqiq = taqiqXabari(
    {
      isBanned: false,
      chatBlockedUntil: new Date(hozir + 3_600_000).toISOString(),
      chatBlockedReason: 'Haqorat',
    },
    hozir
  )
  assert.ok(faolTaqiq.includes('Yozish vaqtincha to\'xtatilgan'))
  assert.ok(faolTaqiq.includes('Sabab: Haqorat'))

  const tugagan = taqiqXabari(
    {
      isBanned: false,
      chatBlockedUntil: new Date(hozir - 60_000).toISOString(),
      chatBlockedReason: 'Eski',
    },
    hozir
  )
  assert.equal(tugagan, null)
})
