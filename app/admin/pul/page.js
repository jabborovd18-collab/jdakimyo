// app/admin/pul/page.js
"use client"
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { sanaVaqt, qachon } from '@/lib/sana'

// Tez tanlash uchun tayyor miqdorlar — qo'lda yozish har safar shart bo'lmasin
const TEZ_MIQDOR = [10, 50, 100, 500]
const TEZ_KUN = [1, 3, 7, 30]

export default function PulNazoratiPage() {
  const [malumot, setMalumot] = useState(null)
  const [qidiruv, setQidiruv] = useState('')
  const [saralash, setSaralash] = useState('coins')
  const [sahifa, setSahifa] = useState(1)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState('')

  // Ochiq turgan amal oynasi: {hisob, amal: 'ber'|'taqiq'}
  const [oyna, setOyna] = useState(null)
  const [ishlamoqda, setIshlamoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const p = new URLSearchParams({ qidiruv, saralash, sahifa: String(sahifa) })
      const res = await fetch(`/api/admin/pul?${p}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yuklanmadi')
      setMalumot(data)
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [qidiruv, saralash, sahifa])

  // Qidiruvda har harfda so'rov yubormaslik uchun kechikish
  useEffect(() => {
    const kutish = setTimeout(yukla, 300)
    return () => clearTimeout(kutish)
  }, [yukla])

  const amalBajar = async (tana) => {
    setIshlamoqda(true)
    try {
      const res = await fetch('/api/admin/pul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tana),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setOyna(null)
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIshlamoqda(false)
    }
  }

  if (yuklanmoqda && !malumot) {
    return <div className="text-purple-300 py-10 text-center">⏳ Yuklanmoqda...</div>
  }

  const ozgartira = malumot?.ozgartira

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🪙 Pul nazorati</h1>
        <p className="text-sm text-purple-300 mt-1">
          Hisoblardagi valyuta, berish va xarid taqiqi.
          {!ozgartira && ' Ko\'rish rejimi — o\'zgartirish faqat superadminda.'}
        </p>
      </div>

      {xato && (
        <div className="rounded-xl border border-red-700/50 bg-red-950/30 p-4 text-sm text-red-300">
          {xato}
        </div>
      )}

      {/* Umumiy holat */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Karta icon="🪙" nom="Muomaladagi tanga" qiymat={malumot?.umumiy?.coins} rang="amber" />
        <Karta icon="💎" nom="Muomaladagi olmos" qiymat={malumot?.umumiy?.gems} rang="cyan" />
        <Karta icon="⭐" nom="Jami yulduz" qiymat={malumot?.umumiy?.stars} rang="yellow" />
        <Karta icon="🚫" nom="Taqiqdagi hisob" qiymat={malumot?.umumiy?.taqiqlangan} rang="red" />
      </div>

      {/* Qidiruv va saralash */}
      <div className="flex gap-2 flex-wrap">
        <input
          value={qidiruv}
          onChange={(e) => { setQidiruv(e.target.value); setSahifa(1) }}
          placeholder="🔍 Ism, username, email yoki ID"
          className="flex-1 min-w-[220px] px-4 py-2.5 bg-slate-900/60 border border-purple-800/50 rounded-xl text-white placeholder-purple-500 outline-none focus:border-yellow-500"
        />
        <select
          value={saralash}
          onChange={(e) => { setSaralash(e.target.value); setSahifa(1) }}
          className="px-4 py-2.5 bg-slate-900/60 border border-purple-800/50 rounded-xl text-white outline-none"
        >
          <option value="coins">Tanga bo'yicha</option>
          <option value="gems">Olmos bo'yicha</option>
          <option value="stars">Yulduz bo'yicha</option>
          <option value="createdAt">Yangi hisoblar</option>
        </select>
      </div>

      {/* Hisoblar */}
      <div className="rounded-2xl border border-purple-800/50 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-purple-950/60 text-purple-300 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Foydalanuvchi</th>
                <th className="text-right px-3 py-3">🪙</th>
                <th className="text-right px-3 py-3">💎</th>
                <th className="text-right px-3 py-3">⭐</th>
                <th className="text-left px-4 py-3">Holat</th>
                {ozgartira && <th className="text-right px-4 py-3">Amal</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/50">
              {(malumot?.hisoblar || []).map((h) => {
                const taqiq = h.spendBlockedUntil && new Date(h.spendBlockedUntil) > new Date()
                return (
                  <tr key={h.id} className="hover:bg-purple-950/30">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{h.fullName || h.username}</div>
                      <div className="text-[11px] text-purple-400">
                        @{h.username} · ID {h.userId}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-amber-400">{h.coins}</td>
                    <td className="px-3 py-3 text-right font-bold text-cyan-300">{h.gems}</td>
                    <td className="px-3 py-3 text-right text-purple-300">{h.stars}</td>
                    <td className="px-4 py-3">
                      {h.isBanned && (
                        <div className="text-[11px] text-red-400">⛔ Hisob bloklangan</div>
                      )}
                      {taqiq ? (
                        <div className="text-[11px] text-orange-300">
                          🚫 Xarid yopiq · {sanaVaqt(h.spendBlockedUntil)}
                          {h.spendBlockedReason && (
                            <div className="text-purple-400">{h.spendBlockedReason}</div>
                          )}
                        </div>
                      ) : (
                        !h.isBanned && <span className="text-[11px] text-green-400">✓ Ochiq</span>
                      )}
                    </td>
                    {ozgartira && (
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => setOyna({ hisob: h, amal: 'ber' })}
                            className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/40 text-amber-300 text-xs font-semibold"
                          >
                            Valyuta
                          </button>
                          {taqiq ? (
                            <button
                              onClick={() => amalBajar({ userId: h.id, amal: 'taqiqniOch' })}
                              className="px-3 py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-600/40 text-green-300 text-xs font-semibold"
                            >
                              Taqiqni ochish
                            </button>
                          ) : (
                            <button
                              onClick={() => setOyna({ hisob: h, amal: 'taqiq' })}
                              className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 text-red-300 text-xs font-semibold"
                            >
                              Taqiq
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {(malumot?.sahifalash?.sahifalar || 0) > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-purple-900/50">
            <span className="text-xs text-purple-400">
              {malumot.sahifalash.jami} ta hisob · {sahifa}/{malumot.sahifalash.sahifalar}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSahifa((n) => Math.max(1, n - 1))}
                disabled={sahifa <= 1}
                className="px-3 py-1.5 rounded-lg bg-purple-900/50 border border-purple-700/50 text-xs disabled:opacity-40"
              >
                ← Oldingi
              </button>
              <button
                onClick={() => setSahifa((n) => n + 1)}
                disabled={sahifa >= malumot.sahifalash.sahifalar}
                className="px-3 py-1.5 rounded-lg bg-purple-900/50 border border-purple-700/50 text-xs disabled:opacity-40"
              >
                Keyingi →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin bergan valyuta tarixi */}
      <div>
        <h2 className="text-sm font-bold text-purple-300 mb-2">
          📜 Oxirgi admin harakatlari
        </h2>
        {(malumot?.oxirgiHarakat || []).length === 0 ? (
          <div className="rounded-xl border border-purple-800/50 bg-slate-900/40 p-5 text-sm text-purple-400 text-center">
            Hali hech kimga valyuta berilmagan
          </div>
        ) : (
          <div className="rounded-xl border border-purple-800/50 bg-slate-900/40 divide-y divide-purple-900/50">
            {malumot.oxirgiHarakat.map((t) => (
              <div key={t.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{t.kim}</div>
                  <div className="text-[11px] text-purple-400 truncate">
                    {t.izoh} · {qachon(t.createdAt)}
                  </div>
                </div>
                <span
                  className={`text-sm font-bold flex-shrink-0 ${
                    t.miqdor > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {t.miqdor > 0 ? '+' : ''}{t.miqdor} {t.valyuta === 'gems' ? '💎' : '🪙'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {oyna?.amal === 'ber' && (
        <ValyutaOynasi
          hisob={oyna.hisob}
          ishlamoqda={ishlamoqda}
          onYopish={() => setOyna(null)}
          onYuborish={amalBajar}
        />
      )}

      {oyna?.amal === 'taqiq' && (
        <TaqiqOynasi
          hisob={oyna.hisob}
          ishlamoqda={ishlamoqda}
          onYopish={() => setOyna(null)}
          onYuborish={amalBajar}
        />
      )}
    </div>
  )
}

function Karta({ icon, nom, qiymat, rang }) {
  const RANGLAR = {
    amber: 'from-amber-900/40 to-orange-900/30 border-amber-700/50 text-amber-400',
    cyan: 'from-cyan-900/40 to-teal-900/30 border-cyan-700/50 text-cyan-300',
    yellow: 'from-yellow-900/40 to-amber-900/30 border-yellow-700/50 text-yellow-400',
    red: 'from-red-900/40 to-rose-900/30 border-red-700/50 text-red-400',
  }
  return (
    <div className={`bg-gradient-to-br border rounded-2xl p-4 ${RANGLAR[rang] || RANGLAR.amber}`}>
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold">{(qiymat ?? 0).toLocaleString('uz-UZ')}</div>
      <div className="text-[11px] text-purple-300 mt-0.5">{nom}</div>
    </div>
  )
}

/** Valyuta berish yoki olib qo'yish oynasi */
function ValyutaOynasi({ hisob, ishlamoqda, onYopish, onYuborish }) {
  const [valyuta, setValyuta] = useState('coins')
  const [miqdor, setMiqdor] = useState('')
  const [sabab, setSabab] = useState('')
  const [olish, setOlish] = useState(false)

  const son = Number(miqdor)
  const yaroqli = Number.isInteger(son) && son > 0

  return (
    <Oyna sarlavha={`${hisob.fullName || hisob.username} — valyuta`} onYopish={onYopish}>
      <div className="text-xs text-purple-400 mb-4">
        Hozir: 🪙 {hisob.coins} · 💎 {hisob.gems}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { id: 'coins', nom: '🪙 Tanga' },
          { id: 'gems', nom: '💎 Olmos' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setValyuta(v.id)}
            className={`py-2.5 rounded-xl border text-sm font-semibold ${
              valyuta === v.id
                ? 'bg-yellow-500 text-black border-yellow-400'
                : 'bg-slate-900/60 border-purple-800/50 text-purple-200'
            }`}
          >
            {v.nom}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-3">
        {TEZ_MIQDOR.map((m) => (
          <button
            key={m}
            onClick={() => setMiqdor(String(m))}
            className="flex-1 py-2 rounded-lg bg-purple-900/50 border border-purple-700/50 text-xs font-semibold"
          >
            {m}
          </button>
        ))}
      </div>

      <input
        type="number"
        min="1"
        value={miqdor}
        onChange={(e) => setMiqdor(e.target.value)}
        placeholder="Miqdor"
        className="w-full px-4 py-2.5 bg-slate-900/60 border border-purple-800/50 rounded-xl text-white mb-3 outline-none focus:border-yellow-500"
      />

      <input
        value={sabab}
        onChange={(e) => setSabab(e.target.value)}
        placeholder="Sabab (foydalanuvchiga ko'rinadi)"
        className="w-full px-4 py-2.5 bg-slate-900/60 border border-purple-800/50 rounded-xl text-white mb-3 outline-none focus:border-yellow-500"
      />

      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={olish}
          onChange={(e) => setOlish(e.target.checked)}
          className="accent-red-500"
        />
        <span className="text-sm text-red-300">Berish emas, olib qo'yish</span>
      </label>

      <button
        onClick={() =>
          onYuborish({
            userId: hisob.id,
            amal: 'ber',
            valyuta,
            miqdor: olish ? -son : son,
            sabab,
          })
        }
        disabled={!yaroqli || ishlamoqda}
        className={`w-full py-3 rounded-xl font-bold text-sm disabled:opacity-40 ${
          olish ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
        }`}
      >
        {ishlamoqda
          ? '⏳ Bajarilmoqda...'
          : olish
            ? `${son || 0} ta olib qo'yish`
            : `${son || 0} ta berish`}
      </button>
    </Oyna>
  )
}

/** Xarid taqiqi oynasi */
function TaqiqOynasi({ hisob, ishlamoqda, onYopish, onYuborish }) {
  const [kunlar, setKunlar] = useState(7)
  const [sabab, setSabab] = useState('')

  return (
    <Oyna sarlavha={`${hisob.fullName || hisob.username} — xarid taqiqi`} onYopish={onYopish}>
      <p className="text-xs text-purple-300 mb-4 leading-relaxed">
        Taqiq faqat XARIDNI yopadi: do'kon va pullik sandiqlar ishlamaydi.
        O'qish, quiz, missiya va bepul kunlik sandiq ochiq qoladi. Muddat
        tugagach taqiq o'zi ochiladi.
      </p>

      <div className="flex gap-2 mb-3">
        {TEZ_KUN.map((k) => (
          <button
            key={k}
            onClick={() => setKunlar(k)}
            className={`flex-1 py-2 rounded-lg border text-xs font-semibold ${
              kunlar === k
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-purple-900/50 border-purple-700/50 text-purple-200'
            }`}
          >
            {k} kun
          </button>
        ))}
      </div>

      <input
        type="number"
        min="1"
        max="365"
        value={kunlar}
        onChange={(e) => setKunlar(Number(e.target.value))}
        className="w-full px-4 py-2.5 bg-slate-900/60 border border-purple-800/50 rounded-xl text-white mb-3 outline-none focus:border-red-500"
      />

      <textarea
        value={sabab}
        onChange={(e) => setSabab(e.target.value)}
        rows={3}
        placeholder="Sabab — foydalanuvchiga ko'rinadi (majburiy)"
        className="w-full px-4 py-2.5 bg-slate-900/60 border border-purple-800/50 rounded-xl text-white mb-4 outline-none focus:border-red-500 resize-none"
      />

      <button
        onClick={() => onYuborish({ userId: hisob.id, amal: 'taqiq', kunlar, sabab })}
        disabled={!sabab.trim() || !kunlar || ishlamoqda}
        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm disabled:opacity-40"
      >
        {ishlamoqda ? '⏳ Bajarilmoqda...' : `${kunlar} kunga taqiqlash`}
      </button>
    </Oyna>
  )
}

function Oyna({ sarlavha, onYopish, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-br from-purple-950 to-slate-950 border border-purple-700/50 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="font-bold text-white">{sarlavha}</h3>
          <button onClick={onYopish} className="text-purple-400 hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
