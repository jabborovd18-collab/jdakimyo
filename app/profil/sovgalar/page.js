// app/profil/sovgalar/page.js
//
// Kunlik sovg'a sahifasi.
//
// Muhim jihat: sovg'a QABUL QILINGANDA tanga beriladi va u Toshkent
// vaqti bilan yarim tunda kuyadi. Ikkalasi ham sahifada ochiq yozilgan —
// odam kutib qolib, sovg'asini yo'qotmasin.
"use client"
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

/** ms ni "5 soat 12 daqiqa" ko'rinishiga keltiradi */
function qolganVaqt(ms) {
  if (ms <= 0) return 'tugadi'
  const soat = Math.floor(ms / 3600000)
  const daqiqa = Math.floor((ms % 3600000) / 60000)
  if (soat > 0) return `${soat} soat ${daqiqa} daqiqa`
  return `${daqiqa} daqiqa`
}

export default function SovgalarPage() {
  const [malumot, setMalumot] = useState(null)
  const [band, setBand] = useState(null)
  const [qidiruv, setQidiruv] = useState('')

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/sovga')
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setMalumot(d)
    } catch (e) {
      toast.error(e.message || 'Yuklashda xatolik')
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

  const yubor = async (dostId) => {
    setBand(dostId)
    try {
      const res = await fetch('/api/sovga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dostId }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message)
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(null)
    }
  }

  const qabulQil = async (id) => {
    setBand(id)
    try {
      const res = await fetch('/api/sovga', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message, { duration: 5000, icon: '🎁' })
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBand(null)
    }
  }

  if (!malumot) {
    return <div className="py-16 text-center text-purple-300">⏳ Yuklanmoqda...</div>
  }

  const { kelganlar, bugungiYuborilgan, dostlar, tanga, kunTugashigaMs } = malumot
  const filtrlangan = dostlar.filter((d) =>
    !qidiruv ||
    (d.fullName || '').toLowerCase().includes(qidiruv.toLowerCase()) ||
    d.username.toLowerCase().includes(qidiruv.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">🎁 Sovg'alar</h1>
        <p className="text-sm text-purple-300">
          Kuniga bitta do'stingizga sovg'a yuborasiz. Do'stingiz qabul qilsa,
          <span className="text-yellow-300 font-semibold"> ikkalangiz ham {tanga} tangadan </span>
          olasiz.
        </p>
      </div>

      {/* ─── KELGAN SOVG'ALAR ─── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          📬 Sizga kelgan
          {kelganlar.length > 0 && (
            <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-xs text-yellow-300">
              {kelganlar.length}
            </span>
          )}
        </h2>
        {kelganlar.length > 0 && (
          <p className="text-xs text-orange-300 mb-3">
            ⏳ Yarim tungacha {qolganVaqt(kunTugashigaMs)} qoldi — keyin sovg'alar kuyadi
          </p>
        )}

        {kelganlar.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 border border-purple-800/40 rounded-2xl">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-purple-300 text-sm">Hozircha sovg'a yo'q</p>
          </div>
        ) : (
          <div className="space-y-3">
            {kelganlar.map((s) => (
              <div
                key={s.id}
                className="bg-gradient-to-br from-yellow-900/20 to-amber-900/10 border border-yellow-700/40 rounded-2xl p-4 flex items-center gap-3"
              >
                <Avatar user={s.sender} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span className="truncate">{s.sender.fullName || s.sender.username}</span>
                    <TasdiqBelgisi tasdiqlangan={s.sender.isVerified} olcham="kichik" />
                  </div>
                  <div className="text-xs text-purple-400">@{s.sender.username}</div>
                </div>
                <button
                  onClick={() => qabulQil(s.id)}
                  disabled={band === s.id}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm disabled:opacity-50 flex-shrink-0"
                >
                  🎁 Olish
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── YUBORISH ─── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">📤 Sovg'a yuborish</h2>

        {bugungiYuborilgan ? (
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-4 flex items-center gap-3">
            <Avatar user={bugungiYuborilgan.receiver} />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-purple-300">Bugungi sovg'angiz yuborilgan:</div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span className="truncate">
                  {bugungiYuborilgan.receiver.fullName || bugungiYuborilgan.receiver.username}
                </span>
                <TasdiqBelgisi tasdiqlangan={bugungiYuborilgan.receiver.isVerified} olcham="kichik" />
              </div>
              <div className="text-xs mt-1">
                {bugungiYuborilgan.holat === 'qabul' ? (
                  <span className="text-green-400">✓ Qabul qilindi — {tanga} tanga oldingiz</span>
                ) : bugungiYuborilgan.holat === 'kuygan' ? (
                  <span className="text-red-400">Olinmadi, sovg'a kuydi</span>
                ) : (
                  <span className="text-yellow-400">⏳ Javob kutilmoqda</span>
                )}
              </div>
            </div>
          </div>
        ) : dostlar.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 border border-purple-800/40 rounded-2xl">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-purple-300 text-sm">Sovg'a yuborish uchun avval do'st qo'shing</p>
          </div>
        ) : (
          <>
            {dostlar.length > 6 && (
              <input
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="🔍 Do'st qidirish..."
                className="w-full mb-3 px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white text-sm placeholder-purple-500 focus:border-yellow-500 outline-none"
              />
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              {filtrlangan.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-3 flex items-center gap-3"
                >
                  <Avatar user={d} kichik />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                      <span className="truncate">{d.fullName || d.username}</span>
                      <TasdiqBelgisi tasdiqlangan={d.isVerified} olcham="kichik" />
                    </div>
                    <div className="text-xs text-purple-400 truncate">@{d.username}</div>
                  </div>
                  <button
                    onClick={() => yubor(d.id)}
                    disabled={band === d.id}
                    className="px-3 py-1.5 bg-purple-700/60 hover:bg-purple-600/70 border border-purple-500/50 rounded-lg text-xs font-semibold text-white disabled:opacity-50 flex-shrink-0"
                  >
                    🎁 Yuborish
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function Avatar({ user, kichik = false }) {
  const olcham = kichik ? 'w-9 h-9 text-sm' : 'w-11 h-11'
  return (
    <div className={`${olcham} rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center font-bold text-black flex-shrink-0 overflow-hidden`}>
      {user.avatar ? (
        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
      ) : (
        (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
      )}
    </div>
  )
}
