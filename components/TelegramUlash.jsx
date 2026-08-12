// components/TelegramUlash.jsx
"use client"

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Ikon from './Ikon'

export default function TelegramUlash({ boshlangichKod = '', mustaqil = false }) {
  const [holat, setHolat] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [kod, setKod] = useState(null)
  const [band, setBand] = useState(false)
  const [botKod, setBotKod] = useState(boshlangichKod)

  useEffect(() => { holatniOl() }, [])

  async function botKodniYubor(e) {
    e?.preventDefault()
    if (!botKod.trim()) return
    setBand(true)
    try {
      const res = await fetch('/api/telegram/ulash', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kod: botKod.trim() }),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error || 'Ulanmadi')
      toast.success(data.message || 'Telegram muvaffaqiyatli ulandi!')
      setBotKod('')
      setKod(null)
      await holatniOl()
    } catch {
      toast.error('Tarmoq xatosi')
    } finally {
      setBand(false)
    }
  }

  async function holatniOl() {
    try {
      const res = await fetch('/api/telegram/ulash')
      const data = await res.json()
      if (res.ok) setHolat(data)
    } catch {
      // Ignored
    } finally {
      setYuklanmoqda(false)
    }
  }

  async function kodOl() {
    setBand(true)
    try {
      const res = await fetch('/api/telegram/ulash', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error || 'Kod olinmadi')
      setKod(data)
    } catch {
      toast.error('Tarmoq xatosi')
    } finally {
      setBand(false)
    }
  }

  async function uzish() {
    setBand(true)
    try {
      const res = await fetch('/api/telegram/ulash', { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error || 'Uzilmadi')
      toast.success('Telegram uzildi')
      setKod(null)
      await holatniOl()
    } catch {
      toast.error('Tarmoq xatosi')
    } finally {
      setBand(false)
    }
  }

  if (yuklanmoqda) {
    return mustaqil ? (
      <div className="py-6 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
        <Ikon nom="vaqt" olcham={16} className="animate-spin" />
        <span>Telegram holati yuklanmoqda...</span>
      </div>
    ) : null
  }

  if (!holat?.ishlaydi) {
    if (!mustaqil) return null
    return (
      <div className="text-xs text-[var(--v3-xira)]">
        {holat
          ? 'Telegram boti hali sozlanmagan. Keyinroq urinib ko\'ring.'
          : 'Bu sahifa uchun tizimga kirishingiz kerak.'}
      </div>
    )
  }

  return (
    <div className={mustaqil ? '' : 'pt-4 border-t border-[var(--v3-chiziq)] space-y-3'}>
      {!mustaqil && (
        <div className="v3-nishon flex items-center gap-1.5 text-[#24A1DE]">
          <Ikon nom="telegram" olcham={14} />
          <span>Telegram Integratsiyasi</span>
        </div>
      )}

      {holat.ulangan ? (
        <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-bold text-green-400 flex items-center gap-1">
              <span>✓ Telegram hisobiga ulangan</span>
            </div>
            <div className="text-[11px] text-[var(--v3-xira)] mt-1 font-mono">
              {holat.ulanish?.username ? `@${holat.ulanish.username}` : 'Ulangan akkaunt'}
              {' · '}
              Xabarlar: {holat.ulanish?.xabarlar ? 'faol' : "o'chirilgan"}
            </div>
          </div>

          <button
            type="button"
            onClick={uzish}
            disabled={band}
            className="v3-tugma text-xs py-1.5 px-3 text-red-400 hover:border-red-500/30 font-bold"
          >
            Uzish
          </button>
        </div>
      ) : kod ? (
        <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-3">
          <p className="text-xs text-[var(--v3-xira)]">
            Tugmani bosing — Telegram ochiladi va tasdiqlash kodi avtomatik yuboriladi:
          </p>

          <a
            href={kod.havola}
            target="_blank"
            rel="noopener noreferrer"
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
          >
            <Ikon nom="telegram" olcham={14} />
            <span>Telegramda ochish</span>
          </a>

          <div className="pt-2 border-t border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)]">
            <span>Yoki botga quyidagi kodni yozing:</span>
            <div className="font-mono text-base font-bold text-[var(--v3-urgu)] tracking-widest mt-1">
              {kod.kod}
            </div>
          </div>

          <button
            type="button"
            onClick={holatniOl}
            className="text-xs text-[var(--v3-urgu)] hover:underline font-semibold"
          >
            Uladim, tekshirish →
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-4">
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            Saytdagi barcha xabarlar va natijalarni Telegram botingizda qabul qiling.
          </p>

          <form onSubmit={botKodniYubor} className="space-y-2">
            <div className="text-xs font-bold text-[var(--v3-matn)]">
              Botdan olingan kod bilan ulash:
            </div>
            <div className="text-[11px] text-[var(--v3-xira)]">
              {holat.bot ? (
                <>
                  <a
                    href={`https://t.me/${holat.bot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#24A1DE] font-semibold hover:underline"
                  >
                    @{holat.bot}
                  </a>
                  {' '}ga <code className="font-mono bg-[var(--v3-yuza)] px-1 rounded">/kod</code> deb yozing va kelgan kodni kiriting:
                </>
              ) : (
                <>Botga <code className="font-mono bg-[var(--v3-yuza)] px-1 rounded">/kod</code> deb yozing.</>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={botKod}
                onChange={(e) => setBotKod(e.target.value.toUpperCase())}
                placeholder="KOD123"
                maxLength={8}
                className="v3-kiritish py-1.5 text-xs font-mono tracking-widest uppercase flex-1"
              />
              <button
                type="submit"
                disabled={band || !botKod.trim()}
                className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-4 font-bold shrink-0 disabled:opacity-40"
              >
                Ulash
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-[var(--v3-chiziq)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--v3-xira)]">Yoki to{"'"}g{"'"}ridan-to{"'"}g{"'"}ri havola orqali:</span>
            <button
              type="button"
              onClick={kodOl}
              disabled={band}
              className="v3-tugma text-xs py-1 px-3"
            >
              {band ? '...' : 'Havola olish'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
