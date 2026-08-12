"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'

export default function QuizUlashishModal({ quiz, onClose }) {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sendingId, setSendingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!session) {
      setIsLoading(false)
      return
    }

    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chat')
        const data = await res.json()
        if (res.ok) {
          setConversations(data.faol || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchChats()
  }, [session])

  const copyLink = () => {
    const url = `${window.location.origin}/oquv/video-darsliklar/ustoz-quiz/${quiz.id}`
    navigator.clipboard.writeText(url)
    toast.success('Test havolasi nusxalandi!')
  }

  const sendToChat = async (convId, friendName) => {
    setSendingId(convId)
    try {
      const shareUrl = `/oquv/video-darsliklar/ustoz-quiz/${quiz.id}`
      const messageText = `🧪 [quiz:${quiz.id}:${quiz.title}]\n${shareUrl}`

      const res = await fetch(`/api/chat/${convId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matn: messageText })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yuborib bo\'lmadi')

      toast.success(`${friendName} ga test yuborildi!`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSendingId(null)
    }
  }

  const filtered = conversations.filter(c => {
    const name = (c.odam?.fullName || c.odam?.username || '').toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="v3-nishon">Ulashish</div>
            <h3 className="font-bold text-base text-[var(--v3-matn)]">
              Testni do{"'"}stlar bilan ulashish
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="yopish" olcham={16} />
          </button>
        </div>

        {/* Quiz Info Card */}
        <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1">
          <div className="text-xs font-bold text-[var(--v3-matn)] line-clamp-1">
            {quiz.title}
          </div>
          <div className="text-[11px] text-[var(--v3-xira)] flex items-center gap-2">
            <span>Ustoz: {quiz.teacher?.fullName || quiz.teacher?.username || 'O\'qituvchi'}</span>
            <span>•</span>
            <span>{quiz._count?.questions || quiz.totalQuestions || 0} ta savol</span>
          </div>
        </div>

        {/* Copy Link Button */}
        <div>
          <button
            type="button"
            onClick={copyLink}
            className="w-full v3-tugma py-2 text-xs flex items-center justify-center gap-2"
          >
            <Ikon nom="nusxa" olcham={15} />
            Havolani nusxalash
          </button>
        </div>

        {/* Shaxsiy chatda ulashish */}
        <div className="space-y-3 pt-3 border-t border-[var(--v3-chiziq)]">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--v3-xira)] flex items-center justify-between">
            <span>Shaxsiy chatga yuborish</span>
            <Ikon nom="xabar" olcham={14} />
          </div>

          {!session ? (
            <div className="text-center py-4 text-xs text-[var(--v3-xira)]">
              Chatda yuborish uchun tizimga kirishingiz kerak
            </div>
          ) : isLoading ? (
            <div className="py-6 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
              <Ikon nom="vaqt" olcham={16} className="animate-spin" />
              <span>Suhbatlar yuklanmoqda...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-4 text-xs text-[var(--v3-xira)]">
              Hozircha faol chatlar yo{"'"}q. Do{"'"}stlaringizga profil orqali yozishingiz mumkin.
            </div>
          ) : (
            <>
              {conversations.length > 3 && (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Do'stni qidirish..."
                  className="v3-kiritish text-xs py-1.5"
                />
              )}

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {filtered.map((c) => {
                  const odam = c.odam
                  const name = odam?.fullName || odam?.username || 'Do\'st'
                  const isSending = sendingId === c.id

                  return (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex items-center justify-between gap-3 hover:border-[var(--v3-chiziq-2)] transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center font-bold text-xs text-[var(--v3-urgu)] overflow-hidden shrink-0">
                          {odam?.avatar ? (
                            <img src={odam.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (name[0] || 'U').toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[var(--v3-matn)] truncate">{name}</div>
                          <div className="text-[10px] text-[var(--v3-xira)] font-mono">@{odam?.username}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => sendToChat(c.id, name)}
                        disabled={isSending}
                        className="v3-tugma v3-tugma-asosiy text-[11px] py-1 px-3 font-bold shrink-0"
                      >
                        {isSending ? '...' : 'Yuborish'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
