"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
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
  const [activeAssignment, setActiveAssignment] = useState(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const info = VIEWS[view] || VIEWS.assignments

  const loadData = () => {
    fetch('/api/profil/learning')
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'Ma’lumot yuklanmadi')
        setData(payload)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadData()
  }, [])

  const openSubmitModal = (assignment) => {
    const latest = assignment.submissions?.[0]
    setActiveAssignment(assignment)
    setTextAnswer(latest?.textAnswer || '')
    setUploadedFiles(Array.isArray(latest?.fileUrls) ? latest.fileUrls : [])
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    try {
      for (const file of files) {
        const form = new FormData()
        form.append('file', file)
        const res = await fetch('/api/ustoz/fayl', {
          method: 'POST',
          body: form
        })
        const payload = await res.json()
        if (!res.ok) throw new Error(payload.error || 'Faylni yuklab bo\'lmadi')
        const yuklangan = payload.fayl || payload.file
        if (yuklangan) {
          setUploadedFiles((prev) => [
            ...prev,
            {
              ...yuklangan,
              nom: yuklangan.nom || yuklangan.name || file.name,
              name: yuklangan.name || yuklangan.nom || file.name,
            },
          ])
        }
      }
      toast.success('Fayl muvaffaqiyatli biriktirildi')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleAssignmentSubmit = async () => {
    if (!activeAssignment) return
    if (activeAssignment.requireFile && uploadedFiles.length === 0) {
      toast.error('Ushbu vazifa uchun fayl biriktirish shart!')
      return
    }
    if (!textAnswer.trim() && uploadedFiles.length === 0) {
      toast.error('Javob matnini yozing yoki fayl biriktiring!')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/profil/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: activeAssignment.id,
          textAnswer: textAnswer.trim(),
          fileUrls: uploadedFiles
        })
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Vazifani yuborib bo\'lmadi')

      toast.success(payload.message || 'Vazifa topshirildi!')
      setActiveAssignment(null)
      loadData()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <Link href="/testlar" className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto">
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
          {cards.map((card) => (
            <LearningCard
              key={card.id}
              card={card}
              view={view}
              onOpenSubmit={openSubmitModal}
            />
          ))}
        </div>
      )}

      {/* VAZIFA TOPSHIRISH MODALI */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
              <div>
                <div className="v3-nishon">Vazifa javobini yuborish</div>
                <h3 className="font-bold text-base text-[var(--v3-matn)]">
                  {activeAssignment.title}
                </h3>
                <p className="text-xs text-[var(--v3-xira)] mt-0.5">
                  Maksimal ball: <strong className="text-[var(--v3-urgu)]">{activeAssignment.maxPoints ?? activeAssignment.maxScore ?? 100}</strong> · Muddat: {formatDate(activeAssignment.deadline)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAssignment(null)}
                className="p-1.5 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            {(activeAssignment.description || activeAssignment.instructions) && (
              <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1.5 text-xs">
                {activeAssignment.description && (
                  <p className="text-[var(--v3-matn)] whitespace-pre-wrap">{activeAssignment.description}</p>
                )}
                {activeAssignment.instructions && (
                  <p className="text-[var(--v3-xira)] whitespace-pre-wrap pt-1 border-t border-[var(--v3-chiziq)]">
                    {activeAssignment.instructions}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="v3-yorliq">Javob matni {activeAssignment.requireFile ? '(ixtiyoriy)' : '*'}</label>
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                rows={4}
                placeholder="Vazifa bo'yicha yechim, tahlil yoki javobingizni shu yerga yozing..."
                className="v3-kiritish text-xs resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="v3-yorliq mb-0">
                  Biriktirilgan fayllar {activeAssignment.requireFile ? '(majburiy *)' : '(ixtiyoriy)'}
                </label>
                <label className="v3-tugma text-xs py-1 px-3 cursor-pointer">
                  <Ikon nom="fayl" olcham={13} />
                  <span>{isUploading ? 'Yuklanmoqda...' : 'Fayl tanlash'}</span>
                  <input
                    type="file"
                    multiple
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                  />
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5">
                  {uploadedFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs"
                    >
                      <span className="truncate text-[var(--v3-matn)]">{f.nom || f.name || `Fayl #${idx + 1}`}</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 text-[11px] shrink-0"
                      >
                        O{"'"}chirish
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={() => setActiveAssignment(null)}
                disabled={isSubmitting}
                className="v3-tugma text-xs py-2 px-4"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleAssignmentSubmit}
                disabled={isSubmitting || isUploading}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold"
              >
                {isSubmitting ? 'Yuborilmoqda...' : '✓ Javobni yuborish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LearningCard({ card, view, onOpenSubmit }) {
  if (view === 'teachers') {
    const ism = card.teacher.fullName || card.teacher.username || 'Ustoz'

    return (
      <Link
        href={`/ustoz-profil/${card.teacher?.userId || card.teacher?.id}`}
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
    const submissions = Array.isArray(card.submissions) ? card.submissions : []
    const submission = submissions[0]
    const fayllar = Array.isArray(card.attachments) ? card.attachments : []
    const isExpired = card.deadline ? new Date(card.deadline) < new Date() : false
    const maxAttempts = card.maxAttempts || 1
    const canSubmit =
      (maxAttempts === 99 || submissions.length < maxAttempts) &&
      (!isExpired || card.allowLateSubmission)

    const maxBall = card.maxPoints ?? card.maxScore ?? 100

    return (
      <article className="v3-panel-karta p-5 space-y-3 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-bold text-sm text-[var(--v3-matn)] line-clamp-1">{card.title}</h2>
            <span className={`v3-tag text-[10px] ${
              submission?.status === 'graded'
                ? 'v3-tag-ochiq'
                : submission
                ? 'v3-tag-muhlat'
                : 'v3-tag-yopiq'
            }`}>
              {submission?.status === 'graded'
                ? `Baholangan: ${submission.score}/${maxBall}`
                : submission
                ? 'Tekshirilmoqda'
                : 'Topshirilmagan'}
            </span>
          </div>

          <p className="text-xs text-[var(--v3-xira)]">
            Guruh: <strong className="text-[var(--v3-matn)]">{card.group?.name}</strong> · Ustoz: {card.teacher?.fullName || card.teacher?.username}
          </p>

          {card.description && (
            <p className="text-xs text-[var(--v3-matn)] opacity-85 line-clamp-2">
              {card.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[var(--v3-urgu-2)]">
            <span>Muddat: {formatDate(card.deadline)}</span>
            <span>Maks ball: {maxBall}</span>
          </div>

          {submission?.feedback && (
            <div className="p-2.5 rounded-lg bg-[var(--v3-fon-2)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)]">
              <strong className="text-[var(--v3-urgu)] block mb-0.5">Ustoz izohi:</strong>
              {submission.feedback}
            </div>
          )}

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
                  <span className="truncate flex-1">{f.nom || f.name || `Fayl #${i + 1}`}</span>
                  {f.size ? <span className="text-[10px] text-[var(--v3-xira)] font-mono">{f.size} KB</span> : null}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[var(--v3-chiziq)] flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-[var(--v3-xira)]">
            Urinish: {submissions.length} / {maxAttempts === 99 ? '∞' : maxAttempts}
          </span>
          {canSubmit && (
            <button
              type="button"
              onClick={() => onOpenSubmit(card)}
              className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3.5 font-bold"
            >
              {submission ? 'Qayta topshirish' : 'Vazifani topshirish'}
            </button>
          )}
        </div>
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
      href={`/testlar/ustoz/${card.id}`}
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
