// components/TelegramUlash.jsx
//
// Sozlamalardagi Telegram bo'limi: hisobni botga ulash va uzish.
//
// NEGA ALOHIDA KOMPONENT. sozlama/page.js allaqachon 900 qatordan
// oshgan va o'z holati bilan ishlaydi. Telegram holati (kod, muddat)
// boshqa sozlamalar bilan birga saqlanmaydi — u darhol ta'sir qiladi,
// "Saqlash" tugmasini kutmaydi.
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

/**
 * @param {object} p
 * @param {string} [p.boshlangichKod] Botdan kelgan havoladagi kod
 *   (`/profil/telegram?kod=...`). Bo'lsa, maydon to'ldiriladi va
 *   odam hech narsa termaydi.
 */
export default function TelegramUlash({ boshlangichKod = '', mustaqil = false }) {
  const [holat, setHolat] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [kod, setKod] = useState(null)
  const [band, setBand] = useState(false)
  // Ikkinchi usul: botdan olingan kod
  const [botKod, setBotKod] = useState(boshlangichKod)

  useEffect(() => { holatniOl() }, [])

  /**
   * Botdan olingan kodni yuborish.
   *
   * Ikki usul ATAYLAB birga qoldirildi: odam ishni qayerdan
   * boshlagani oldindan ma'lum emas — kimdir saytda o'tiradi,
   * kimdir Telegramda.
   */
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
      toast.success(data.message || 'Ulandi')
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
      // Jim: bu bo'lim sahifaning asosiy qismi emas, xato tost
      // chiqarib sozlamalarni ochgan odamni bezovta qilmaydi
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
    return mustaqil ? <div className="text-sm text-purple-400">Yuklanmoqda...</div> : null
  }

  // Bot sozlanmagan bo'lsa bo'lim UMUMAN chizilmaydi: ishlamaydigan
  // tugmani ko'rsatib qo'yish "bosdim, hech narsa bo'lmadi" degan
  // eng yomon tajribani beradi.
  //
  // MUSTAQIL sahifada esa aksincha — u yerga odam ataylab kelgan
  // (bot havolasi bo'yicha), bo'sh sahifa ko'rsatish sababsiz
  // tupikka olib borardi.
  if (!holat?.ishlaydi) {
    if (!mustaqil) return null
    return (
      <div className="text-sm text-purple-300">
        {holat
          ? 'Telegram boti hali sozlanmagan. Keyinroq urinib ko\'ring.'
          : 'Bu sahifa uchun tizimga kirishingiz kerak.'}
      </div>
    )
  }

  return (
    <div className={mustaqil ? '' : 'pt-4 border-t border-purple-800/50'}>
      {!mustaqil && <h4 className="text-sm font-bold text-yellow-300 mb-2">✈️ Telegram</h4>}

      {holat.ulangan ? (
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-sm text-green-400 font-semibold">✓ Ulangan</div>
              <div className="text-xs text-purple-300 mt-1">
                {holat.ulanish?.username ? `@${holat.ulanish.username}` : 'Telegram hisobi'}
                {' · '}
                Xabarlar: {holat.ulanish?.xabarlar ? 'yoqilgan' : "o'chirilgan"}
              </div>
              <div className="text-xs text-purple-400 mt-1">
                Botda <span className="font-mono">/xabarlar</span> yozib oqimni to'xtatish mumkin.
              </div>
            </div>
            <button
              onClick={uzish}
              disabled={band}
              className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/40 text-red-300 text-sm hover:bg-red-600/30 disabled:opacity-50 transition-all"
            >
              Uzish
            </button>
          </div>
        </div>
      ) : kod ? (
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4">
          <div className="text-xs text-purple-300 mb-3">
            Quyidagi tugmani bosing — Telegram ochiladi va kod o'zi yuboriladi.
          </div>

          <a
            href={kod.havola}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all"
          >
            ✈️ Telegramda ochish
          </a>

          <div className="text-xs text-purple-400 mt-3">
            Tugma ishlamasa, botga shu kodni yuboring:
          </div>
          <div className="font-mono text-lg tracking-widest text-yellow-300 mt-1">{kod.kod}</div>
          <div className="text-xs text-purple-500 mt-1">
            Kod {kod.daqiqa} daqiqa amal qiladi.
          </div>

          <button
            onClick={holatniOl}
            className="mt-3 text-xs text-purple-300 underline hover:text-purple-200"
          >
            Uladim, holatni yangilash
          </button>
        </div>
      ) : (
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4">
          <div className="text-xs text-purple-300 mb-4">
            Saytdagi bildirishnomalarni Telegramda ham oling — do'stlik so'rovi,
            ustoz taklifi, vazifa va sovg'a.
          </div>

          {/* USUL 1 — botdan kod olish. Birinchi turibdi, chunki odam
              odatda Telegramni allaqachon ochib turadi va saytda
              faqat kodni kiritishi kerak bo'ladi. */}
          <form onSubmit={botKodniYubor} className="mb-4">
            <div className="text-xs font-semibold text-purple-200 mb-1.5">
              1-usul: botdan kod oling
            </div>
            <div className="text-[11px] text-purple-400 mb-2">
              {holat.bot ? (
                <>
                  <a
                    href={`https://t.me/${holat.bot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 underline"
                  >
                    @{holat.bot}
                  </a>
                  {' '}ga <span className="font-mono">/kod</span> yozing va kodni shu yerga kiriting.
                </>
              ) : (
                <>Botga <span className="font-mono">/kod</span> yozing.</>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={botKod}
                onChange={(e) => setBotKod(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={8}
                className="flex-1 min-w-0 bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-white placeholder-purple-600 outline-none focus:border-yellow-500/50"
              />
              <button
                type="submit"
                disabled={band || !botKod.trim()}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm disabled:opacity-40 transition-all whitespace-nowrap"
              >
                Ulash
              </button>
            </div>
          </form>

          {/* USUL 2 — saytdan kod olish (eski yo'l) */}
          <div className="pt-3 border-t border-purple-800/40">
            <div className="text-xs font-semibold text-purple-200 mb-1.5">
              2-usul: saytdan kod oling
            </div>
            <div className="text-[11px] text-purple-400 mb-2">
              Kod olasiz, tugma bosilganda Telegram ochiladi va kod o'zi yuboriladi.
            </div>
            <button
              onClick={kodOl}
              disabled={band}
              className="px-4 py-2 rounded-lg bg-purple-800/50 border border-purple-600/50 text-purple-200 text-sm hover:bg-purple-700/50 disabled:opacity-50 transition-all"
            >
              {band ? 'Kutilmoqda...' : 'Kod olish'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
