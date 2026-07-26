"use client"

import { useCallback, useEffect, useState } from 'react'

const CONFIG = {
  achievements: { title: 'Yutuqlar', subtitle: 'Qo‘lga kiritgan yutuqlaringiz', icon: '🏆' },
  certificates: { title: 'Sertifikatlar', subtitle: 'Sizning sertifikatlaringiz', icon: '📜' },
  quizzes: { title: 'Quiz natijalari', subtitle: 'So‘nggi topshirilgan quizlar', icon: '📝' },
  friends: { title: "Do‘stlar", subtitle: "Do‘stlaringiz ro‘yxati", icon: '👥' },
  followers: { title: 'Obunachilar', subtitle: 'Sizga obuna bo‘lganlar', icon: '👤' },
  following: { title: 'Obunalar', subtitle: 'Siz obuna bo‘lgan foydalanuvchilar', icon: '👁️' }
}

const FETCH_TIMEOUT_MS = 15000
const PAGE_SIZE = 20

function nameOf(item) {
  return item.name || item.fullName || item.username || item.quizName || item.examName || 'Noma’lum'
}

export default function ProfileCollection({ type }) {
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
  }, [loadPage])

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    loadPage(page + 1)
  }

  if (!config) return null

  if (error && items.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-red-300">{error}</p>
        <button
          onClick={() => { setIsLoading(true); loadPage(1) }}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-xl text-white text-sm font-semibold"
        >
          🔄 Qayta urinib ko'rish
        </button>
      </div>
    )
  }

  if (isLoading) return <div className="h-48 animate-pulse rounded-2xl bg-purple-900/30" />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 text-3xl">{config.icon}</div>
        <div>
          <h1 className="text-3xl font-bold text-white">{config.title}</h1>
          <p className="text-purple-300">{config.subtitle}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-purple-700/40 bg-purple-900/20 p-10 text-center text-purple-300">
          <div className="mb-3 text-4xl">{config.icon}</div>
          Hali bu yerda ma’lumot yo‘q.
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-purple-700/40 bg-slate-900/50 p-5 transition hover:border-yellow-500/50">
                <h2 className="font-semibold text-white">{nameOf(item)}</h2>
                {item.description && <p className="mt-1 text-sm text-purple-300">{item.description}</p>}
                <div className="mt-3 text-sm text-yellow-300">
                  {item.percentage !== undefined ? `${item.percentage}%` : item.rarity || item.grade || item.username || ''}
                </div>
              </article>
            ))}
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
    </div>
  )
}
