// components/ProfilPostlar.jsx
"use client"
//
// Kabinetdagi post yozish oynasi va o'z postlarim ro'yxati.
//
// Obunachilar tizimi shu uchun bor: post yozilganda obunachilarga
// bildirishnoma boradi.
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { qachon } from '@/lib/sana'

const MAX_UZUNLIK = 1000

export default function ProfilPostlar() {
  const [postlar, setPostlar] = useState([])
  const [matn, setMatn] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [ishlamoqda, setIshlamoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/profil/postlar')
      const data = await res.json()
      if (res.ok) setPostlar(data.postlar || [])
    } catch {
      // jim — kabinetning qolgan qismi ishlayveradi
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

  const yubor = async () => {
    setIshlamoqda(true)
    try {
      const res = await fetch('/api/profil/postlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matn }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setMatn('')
      setPostlar((oldin) => [data.post, ...oldin])
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIshlamoqda(false)
    }
  }

  const ochir = async (id) => {
    if (!confirm('Post o\'chirilsinmi?')) return
    try {
      const res = await fetch(`/api/profil/postlar?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPostlar((oldin) => oldin.filter((p) => p.id !== id))
      toast.success(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const qolgan = MAX_UZUNLIK - matn.length

  return (
    <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
        <span>✍️</span> Profil postlari
      </h2>
      <p className="text-xs text-purple-400 mb-4">
        Yozganingiz profilingizda ko'rinadi va obunachilaringizga xabar boradi.
        Faqat matn.
      </p>

      <textarea
        value={matn}
        onChange={(e) => setMatn(e.target.value.slice(0, MAX_UZUNLIK))}
        rows={3}
        placeholder="Nima o'rganyapsiz? Fikringizni yozing..."
        className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 outline-none focus:border-yellow-500 resize-y"
      />

      <div className="flex items-center justify-between gap-3 mt-2">
        <span className={`text-[11px] ${qolgan < 100 ? 'text-orange-400' : 'text-purple-500'}`}>
          {qolgan} belgi qoldi
        </span>
        <button
          onClick={yubor}
          disabled={ishlamoqda || !matn.trim()}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-40"
        >
          {ishlamoqda ? '⏳ Yuborilmoqda...' : 'Joylash'}
        </button>
      </div>

      {!yuklanmoqda && postlar.length > 0 && (
        <div className="mt-5 space-y-2.5">
          {postlar.map((p) => (
            <div key={p.id} className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-4">
              <p className="text-sm text-purple-100 whitespace-pre-line leading-relaxed">{p.matn}</p>
              <div className="flex items-center justify-between gap-3 mt-2">
                <span className="text-[11px] text-purple-500">{qachon(p.createdAt)}</span>
                <button
                  onClick={() => ochir(p.id)}
                  className="text-[11px] text-red-400 hover:text-red-300"
                >
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
