"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sana } from '@/lib/sana'
import Ikon from '@/components/Ikon'

const VIEWS = {
  teachers: { title: 'Ustozlarim', subtitle: 'Siz a’zo bo‘lgan guruhlardagi ustozlar', ikon: 'ustoz' },
  assignments: { title: 'Vazifalar', subtitle: 'Sizga berilgan topshiriqlar ro\'yxati', ikon: 'kitob' },
  announcements: { title: 'Xabarnomalar', subtitle: 'Ustozlaringizdan so‘nggi e’lonlar', ikon: 'kanal' },
  lessons: { title: 'Darslar va testlar', subtitle: 'Siz uchun ochiq quizlar hamda video darslar', ikon: 'video' }
}

const formatDate = (date) => sana(date)

export default function ProfileLearning({ view }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const info = VIEWS[view] || VIEWS.assignments

  useEffect(() => {
    fetch('/api/profil/learning')
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'Ma’lumot yuklanmadi')
        setData(payload)
      })
      .catch((err) => setError(err.message))
  }, [])

  if (!data && !error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={28} className="animate-spin" />
          <span className="text-xs">Ma{"'"}lumotlar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="v3-panel-karta p-6 text-center text-xs text-red-400">
        {error}
      </div>
    )
  }

  const cards = view === 'teachers' ? data.memberships : view === 'assignments' ? data.assignments : view === 'announcements' ? data.announcements : data.quizzes

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Ta{"'"}lim bo{"'"}limi</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom={info.ikon} olcham={22} className="text-[var(--v3-urgu)]" />
            <span>{info.title}</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">{info.subtitle}</p>
        </div>

        {view === 'lessons' && (
          <Link href="/oquv/video-darsliklar" className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto">
            <span>Video darslarga o{"'"}tish</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom={info.ikon} olcham={20} />
          </div>
          <p>Hozircha ma{"'"}lumotlar mavjud emas.</p>
        </div>
      ) : (
        <div className="grid gap-3.5 md:grid-cols-2">
          {cards.map((card) => <LearningCard key={card.id} card={card} view={view} />)}
        </div>
      )}
    </div>
  )
}

function LearningCard({ card, view }) {
  if (view === 'teachers') {
    const ism = card.teacher.fullName || card.teacher.username || 'Ustoz'

    return (
      <Link
        href={`/ustoz-profil/${card.teacher.id}`}
        className="v3-panel-karta p-4 flex items-center gap-3.5 hover:border-[var(--v3-chiziq-2)] transition-all group"
      >
        <div className="w-11 h-11 flex-shrink-0 grid place-items-center overflow-hidden rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-xs font-bold text-[var(--v3-urgu)]">
          {card.teacher.avatar
            ? <img src={card.teacher.avatar} alt="" className="h-full w-full object-cover" />
            : ism[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-bold text-xs text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
            {ism}
          </h2>
          <p className="mt-0.5 truncate text-[11px] text-[var(--v3-xira)] font-mono">
            {card.group?.name || 'Guruh'} · {card.teacher.university || 'O\'qituvchi'}
          </p>
        </div>
        <Ikon nom="ong" olcham={14} className="text-[var(--v3-xira)] group-hover:text-[var(--v3-urgu)] transition-colors" />
      </Link>
    )
  }

  if (view === 'assignments') {
    const submission = card.submissions?.[0]
    const fayllar = Array.isArray(card.attachments) ? card.attachments : []

    return (
      <article className="v3-panel-karta p-5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-bold text-sm text-[var(--v3-matn)] line-clamp-1">{card.title}</h2>
          <span className={`v3-tag text-[10px] ${submission ? 'v3-tag-ochiq' : 'v3-tag-yopiq'}`}>
            {submission ? 'Topshirilgan' : 'Topshirilmagan'}
          </span>
        </div>

        <p className="text-xs text-[var(--v3-xira)]">
          Guruh: <strong className="text-[var(--v3-matn)]">{card.group?.name}</strong> · Ustoz: {card.teacher?.fullName || card.teacher?.username}
        </p>

        <div className="text-[11px] font-mono text-[var(--v3-urgu-2)]">
          Muddat: {formatDate(card.deadline)}
        </div>

        {fayllar.length > 0 && (
          <div className="pt-2 border-t border-[var(--v3-chiziq)] space-y-1.5">
            {fayllar.map((f, i) => (
              <a
                key={i}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] px-2.5 py-1.5 text-xs text-[var(--v3-matn)] hover:border-[var(--v3-urgu)] transition-all"
              >
                <Ikon nom="fayl" olcham={13} />
                <span className="truncate flex-1">{f.name}</span>
                {f.size ? <span className="text-[10px] text-[var(--v3-xira)] font-mono">{f.size} KB</span> : null}
              </a>
            ))}
          </div>
        )}
      </article>
    )
  }

  if (view === 'announcements') {
    return (
      <article className="v3-panel-karta p-5 space-y-2">
        <div className="flex items-center justify-between gap-2 text-[10.5px] text-[var(--v3-xira)] font-mono">
          <span className="v3-tag v3-tag-ochiq">{card.group?.name}</span>
          <span>{formatDate(card.createdAt)}</span>
        </div>
        <h2 className="font-bold text-sm text-[var(--v3-matn)]">{card.title}</h2>
        <p className="text-xs text-[var(--v3-matn)] line-clamp-3 opacity-85 whitespace-pre-wrap leading-relaxed">
          {card.content}
        </p>
      </article>
    )
  }

  return (
    <Link
      href={`/oquv/video-darsliklar/ustoz-quiz/${card.id}`}
      className="v3-panel-karta p-5 hover:border-[var(--v3-chiziq-2)] transition-all block space-y-2 group"
    >
      <h2 className="font-bold text-sm text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
        {card.title}
      </h2>
      <p className="text-xs text-[var(--v3-xira)] font-mono">
        {card.teacher?.fullName || card.teacher?.username} · {card._count?.questions || 0} ta savol
      </p>
      <p className="text-xs text-[var(--v3-urgu)] font-bold pt-1">
        {card.attempts?.[0] ? `${card.attempts[0].percentage}% natija` : 'Quizni boshlash →'}
      </p>
    </Link>
  )
}
