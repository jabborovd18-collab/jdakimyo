"use client"

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import SertifikatKarta from './SertifikatKarta'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

const CONFIG = {
  achievements: { title: 'Yutuqlar', subtitle: 'Qo‘lga kiritgan yutuqlaringiz', icon: '🏆' },
  certificates: { title: 'Sertifikatlar', subtitle: 'Sizning sertifikatlaringiz', icon: '📜' },
  quizzes: { title: 'Quiz natijalari', subtitle: 'So‘nggi topshirilgan quizlar', icon: '📝' },
  friends: { title: "Do‘stlar", subtitle: "Do‘stlaringiz ro‘yxati", icon: '👥' },
  followers: { title: 'Obunachilar', subtitle: 'Sizga obuna bo‘lganlar', icon: '👤' },
  following: { title: 'Obunalar', subtitle: 'Siz obuna bo‘lgan foydalanuvchilar', icon: '👁️' }
}

// Odamlar ro'yxati: karta profilga havola bo'lishi kerak. Avval bu turlar
// ham oddiy matnli karta bo'lgani uchun o'z do'stlar ro'yxatingizdan hech
// kimning profiliga o'tib bo'lmasdi — obuna va do'stlik tugmalari esa aynan
// o'sha yerda.
const ODAMLAR = new Set(['friends', 'followers', 'following'])

// Ro'yxat bo'sh bo'lganda nima qilish kerakligini aytadi
const BOSH_HOLAT = {
  // Ilgari foydalanuvchi sertifikatni o'zi yasab olardi. Endi uni faqat
  // administratsiya beradi, shuning uchun bo'sh ro'yxat "qayerdan olaman?"
  // degan savol qoldirmasligi kerak.
  certificates: {
    matn: 'Hali sertifikatingiz yo‘q.',
    izoh:
      'Sertifikatni JDA KIMYO administratsiyasi beradi — olimpiada, tanlov yoki ' +
      'kurs natijasi bo‘yicha. Har biri noyob raqamga ega va QR orqali tekshiriladi.',
  },
  friends: {
    matn: "Hali do'st qo'shmagansiz.",
    izoh: "Yuqoridagi qidiruvdan ism, username yoki ID bo'yicha odam toping.",
  },
  followers: {
    matn: 'Sizga hali hech kim obuna bo‘lmagan.',
    izoh: 'Faolroq bo‘lsangiz — quiz yeching, muhokamada qatnashing — sizni topishadi.',
    havola: { href: '/profil/dostlar', matn: "Do'st qidirish" },
  },
  following: {
    matn: 'Siz hali hech kimga obuna bo‘lmagansiz.',
    izoh: 'Boshqa foydalanuvchini toping va uning profilidan obuna bo‘ling.',
    havola: { href: '/profil/dostlar', matn: 'Odam qidirish' },
  },
}

const FETCH_TIMEOUT_MS = 15000
const PAGE_SIZE = 20

function nameOf(item) {
  return item.name || item.fullName || item.username || item.quizName || item.examName || 'Noma’lum'
}

/**
 * @param type      qaysi ro'yxat
 * @param actions   sarlavha ostiga qo'yiladigan qo'shimcha (masalan qidiruv)
 * @param refreshKey  qiymati o'zgarganda ro'yxat qayta yuklanadi
 */
export default function ProfileCollection({ type, actions = null, refreshKey = 0 }) {
  const config = CONFIG[type]
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const loadPage = useCallback(async (pageToLoad) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const response = await fetch(`/api/profil/collection?type=${type}&page=${pageToLoad}&limit=${PAGE_SIZE}`, {
        signal: controller.signal
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || 'Ma’lumot yuklanmadi')

      setItems(prev => (pageToLoad === 1 ? payload.items : [...prev, ...payload.items]))
      setHasMore(Boolean(payload.hasMore))
      setPage(pageToLoad)
      setError('')
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Server javob berishga juda ko‘p vaqt oldi. Qayta urinib ko‘ring.' : err.message)
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [type])

  useEffect(() => {
    setIsLoading(true)
    setItems([])
    loadPage(1)
  }, [loadPage, refreshKey])

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    loadPage(page + 1)
  }

  if (!config) return null

  // Xato va yuklanish endi faqat RO'YXAT o'rnini egallaydi. Avval ular butun
  // komponentdan oldin qaytarilardi — natijada sarlavha ham, `actions` ichidagi
  // qidiruv ham yo'qolib, ro'yxat yuklanmasa odam qidiruvdan ham mahrum bo'lardi.
  const royxat = error && items.length === 0 ? (
    <div className="space-y-4 rounded-2xl border border-red-700/40 bg-red-900/20 p-6">
      <p className="text-red-300">{error}</p>
      <button
        onClick={() => { setIsLoading(true); loadPage(1) }}
        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-xl text-white text-sm font-semibold"
      >
        🔄 Qayta urinib ko'rish
      </button>
    </div>
  ) : isLoading ? (
    <div className="h-48 animate-pulse rounded-2xl bg-purple-900/30" />
  ) : (
    <>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-purple-700/40 bg-purple-900/20 p-10 text-center text-purple-300">
          <div className="mb-3 text-4xl">{config.icon}</div>
          {BOSH_HOLAT[type] ? (
            <>
              <p className="font-semibold text-white">{BOSH_HOLAT[type].matn}</p>
              <p className="mt-1.5 text-sm text-purple-400">{BOSH_HOLAT[type].izoh}</p>
              {BOSH_HOLAT[type].havola && (
                <Link
                  href={BOSH_HOLAT[type].havola.href}
                  className="mt-4 inline-block rounded-xl bg-purple-800/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700/70"
                >
                  {BOSH_HOLAT[type].havola.matn} →
                </Link>
              )}
            </>
          ) : (
            'Hali bu yerda ma’lumot yo‘q.'
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) =>
              type === 'certificates' ? (
                <SertifikatKarta key={item.id} sertifikat={item} />
              ) : ODAMLAR.has(type) ? (
                <Link
                  key={item.id}
                  href={`/profil/${item.userId}`}
                  className="flex items-center gap-3.5 rounded-2xl border border-purple-700/40 bg-slate-900/50 p-4 transition hover:border-yellow-500/50 hover:bg-slate-900/70"
                >
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-lg font-bold text-black">
                    {item.avatar ? (
                      <img src={item.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      (item.fullName || item.username || '?')[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold text-white">{nameOf(item)}</span>
                      <TasdiqBelgisi tasdiqlangan={item.isVerified} olcham="kichik" />
                    </div>
                    {item.username && (
                      <div className="truncate text-xs text-purple-400">@{item.username}</div>
                    )}
                  </div>
                  <span className="flex-shrink-0 text-purple-500">→</span>
                </Link>
              ) : (
                <article key={item.id} className="rounded-2xl border border-purple-700/40 bg-slate-900/50 p-5 transition hover:border-yellow-500/50">
                  <h2 className="font-semibold text-white">{nameOf(item)}</h2>
                  {item.description && <p className="mt-1 text-sm text-purple-300">{item.description}</p>}
                  <div className="mt-3 text-sm text-yellow-300">
                    {/* `!= null` — sertifikatda ball ixtiyoriy, ya'ni bazadan
                        null kelishi mumkin. `!== undefined` bo'lsa "null%" chiqadi. */}
                    {item.percentage != null ? `${item.percentage}%` : item.rarity || item.grade || item.username || ''}
                  </div>
                </article>
              )
            )}
          </div>
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full py-3 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-700/50 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            >
              {isLoadingMore ? '⏳ Yuklanmoqda...' : 'Ko‘proq yuklash ↓'}
            </button>
          )}
        </>
      )}
    </>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 text-3xl">{config.icon}</div>
        <div>
          <h1 className="text-3xl font-bold text-white">{config.title}</h1>
          <p className="text-purple-300">{config.subtitle}</p>
        </div>
      </div>

      {actions}
      {royxat}
    </div>
  )
}
