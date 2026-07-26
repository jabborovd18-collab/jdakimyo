"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sana } from '@/lib/sana'

const VIEWS = {
  teachers: { title: 'Ustozlarim', subtitle: 'Siz a’zo bo‘lgan guruhlardagi ustozlar', icon: '👨‍🏫' },
  assignments: { title: 'Vazifalar', subtitle: 'Sizga berilgan topshiriqlar', icon: '📋' },
  announcements: { title: 'Xabarlar', subtitle: 'Ustozlaringizdan so‘nggi e’lonlar', icon: '🔔' },
  lessons: { title: 'Darslar va quizlar', subtitle: 'Siz uchun ochiq quizlar hamda video darslar', icon: '🎬' }
}

const formatDate = (date) => sana(date)

export default function ProfileLearning({ view }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const info = VIEWS[view]

  useEffect(() => {
    fetch('/api/profil/learning')
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'Ma’lumot yuklanmadi')
        setData(payload)
      })
      .catch((err) => setError(err.message))
  }, [])

  if (!data && !error) return <div className="h-52 animate-pulse rounded-2xl bg-purple-900/30" />
  if (error) return <p className="text-red-300">{error}</p>

  const cards = view === 'teachers' ? data.memberships : view === 'assignments' ? data.assignments : view === 'announcements' ? data.announcements : data.quizzes
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 text-3xl">{info.icon}</div>
        <div><h1 className="text-3xl font-bold text-white">{info.title}</h1><p className="text-purple-300">{info.subtitle}</p></div>
      </div>
      {view === 'lessons' && <Link href="/oquv/video-darsliklar" className="inline-flex rounded-xl bg-purple-700 px-4 py-2 font-semibold text-white hover:bg-purple-600">Video darslarga o‘tish →</Link>}
      {cards.length === 0 ? <div className="rounded-2xl border border-purple-700/40 bg-purple-900/20 p-10 text-center text-purple-300">Hozircha ma’lumot yo‘q.</div> : (
        <div className="grid gap-3 md:grid-cols-2">
          {cards.map((card) => <LearningCard key={card.id} card={card} view={view} />)}
        </div>
      )}
    </div>
  )
}

function LearningCard({ card, view }) {
  // Ustoz kartasi oddiy matn edi — talaba ustozining ommaviy profiliga
  // o'ta olmasdi. Endi karta /ustoz-profil/{id} ga olib boradi.
  if (view === 'teachers') return (
    <Link
      href={`/ustoz-profil/${card.teacher.id}`}
      className="flex items-center gap-3.5 rounded-2xl border border-purple-700/40 bg-slate-900/50 p-5 transition hover:border-yellow-500/60 hover:bg-slate-900/70"
    >
      <div className="grid h-12 w-12 flex-shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-lg font-bold text-black">
        {card.teacher.avatar
          ? <img src={card.teacher.avatar} alt="" className="h-full w-full object-cover" />
          : (card.teacher.fullName || card.teacher.username || '?')[0].toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-white">{card.teacher.fullName || card.teacher.username}</h2>
        <p className="mt-1 truncate text-sm text-purple-300">{card.group?.name || 'Guruhsiz'} · {card.teacher.university || 'Ustoz'}</p>
      </div>
      <span className="flex-shrink-0 text-purple-500">→</span>
    </Link>
  )
  if (view === 'assignments') {
    const submission = card.submissions[0]
    return <article className="rounded-2xl border border-purple-700/40 bg-slate-900/50 p-5"><h2 className="font-semibold text-white">{card.title}</h2><p className="mt-1 text-sm text-purple-300">{card.group.name} · {card.teacher.fullName || card.teacher.username}</p><p className="mt-3 text-sm text-yellow-300">Muddat: {formatDate(card.deadline)}</p><p className="mt-2 text-xs text-purple-300">{submission ? `Holat: ${submission.status}` : 'Hali topshirilmagan'}</p></article>
  }
  if (view === 'announcements') return <article className="rounded-2xl border border-purple-700/40 bg-slate-900/50 p-5"><h2 className="font-semibold text-white">{card.title}</h2><p className="mt-2 text-sm text-purple-300 line-clamp-3">{card.content}</p><p className="mt-3 text-xs text-yellow-300">{card.group.name} · {formatDate(card.createdAt)}</p></article>
  return <Link href={`/oquv/video-darsliklar/ustoz-quiz/${card.id}`} className="rounded-2xl border border-purple-700/40 bg-slate-900/50 p-5 transition hover:border-yellow-500/60"><h2 className="font-semibold text-white">{card.title}</h2><p className="mt-1 text-sm text-purple-300">{card.teacher.fullName || card.teacher.username} · {card._count.questions} savol</p><p className="mt-3 text-sm text-yellow-300">{card.attempts[0] ? `${card.attempts[0].percentage}% natija` : 'Quizni boshlash →'}</p></Link>
}
