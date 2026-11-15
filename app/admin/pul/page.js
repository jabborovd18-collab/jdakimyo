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
    return <div className="text-[var(--v3-xira)] py-10 text-center">⏳ Yuklanmoqda...</div>
  }

  const ozgartira = malumot?.ozgartira

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🪙 Pul nazorati</h1>
        <p className="text-sm text-[var(--v3-xira)] mt-1">
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
          onChange={(e) => {
            setQidiruv(e.target.value)
            setSahifa(1)
          }}
          placeholder="Ism, username, email yoki ID"
          className="v3-kiritish flex-1 min-w-[220px]"
        />
        <select
          value={saralash}
          onChange={(e) => {
            setSaralash(e.target.value)
            setSahifa(1)
          }}
          className="v3-kiritish w-auto min-w-[180px]"
        >
          <option value="coins">Tanga bo&apos;yicha</option>
          <option value="gems">Olmos bo&apos;yicha</option>
          <option value="stars">Yulduz bo&apos;yicha</option>
          <option value="createdAt">Yangi hisoblar</option>
        </select>
      </div>

      {/* v4 eslatma */}
      <div className="v3-panel-karta border-sky-400/35 bg-sky-400/10 p-3.5 text-xs text-sky-200 leading-relaxed">
        <strong>Telegram bot valyuta tizimi:</strong> v4 da sayt ichidagi do&apos;kon va sandiqlar olib
        tashlangan; foydalanuvchi balanslari (<code>coins</code> / <code>gems</code>) va sarflash taqiqi
        bevosita Telegram bot pullik xizmatlari (<code>/api/bot/tanga</code>) uchun ishlatiladi.
      </div>

      {/* Hisoblar */}
      <div className="v3-panel-karta overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs text-[var(--v3-xira)]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Foydalanuvchi</th>
                <th className="text-right px-3 py-3 font-semibold">Tanga</th>
                <th className="text-right px-3 py-3 font-semibold">Olmos</th>
                <th className="text-right px-3 py-3 font-semibold">Yulduz</th>
                <th className="text-left px-4 py-3 font-semibold">Holat</th>
                {ozgartira && <th className="text-right px-4 py-3 font-semibold">Amal</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--v3-chiziq)]">
              {(malumot?.hisoblar || []).map((h) => {
                const taqiq = h.spendBlockedUntil && new Date(h.spendBlockedUntil) > new Date()
                return (
                  <tr key={h.id} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--v3-matn)]">{h.fullName || h.username}</div>
                      <div className="text-[11px] text-[var(--v3-xira)]">
                        @{h.username} · ID {h.userId}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-amber-300">{h.coins}</td>
                    <td className="px-3 py-3 text-right font-bold text-sky-300">{h.gems}</td>
                    <td className="px-3 py-3 text-right text-[var(--v3-xira)]">{h.stars}</td>
                    <td className="px-4 py-3">
                      {h.isBanned && <div className="text-[11px] text-rose-300">Hisob bloklangan</div>}
                      {taqiq ? (
                        <div className="text-[11px] text-orange-300">
                          Bot sarflash yopiq · {sanaVaqt(h.spendBlockedUntil)}
                          {h.spendBlockedReason && (
                            <div className="text-[var(--v3-xira)]">{h.spendBlockedReason}</div>
                          )}
                        </div>
                      ) : (
                        !h.isBanned && <span className="text-[11px] text-emerald-300">Ochiq</span>
                      )}
                    </td>
                    {ozgartira && (
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setOyna({ hisob: h, amal: 'ber' })}
                            className="v3-tugma text-xs py-1 px-2.5"
                          >
                            Valyuta
                          </button>
                          {taqiq ? (
                            <button
                              type="button"
                              onClick={() => amalBajar({ userId: h.id, amal: 'taqiqniOch' })}
                              className="v3-tugma text-xs py-1 px-2.5 text-emerald-300"
                            >
                              Taqiqni ochish
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setOyna({ hisob: h, amal: 'taqiq' })}
                              className="v3-tugma text-xs py-1 px-2.5 text-rose-300"
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--v3-chiziq)] text-xs text-[var(--v3-xira)]">
            <span>
              {malumot.sahifalash.jami} ta hisob · {sahifa}/{malumot.sahifalash.sahifalar}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSahifa((n) => Math.max(1, n - 1))}
                disabled={sahifa <= 1}
                className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Oldingi
              </button>
              <button
                type="button"
                onClick={() => setSahifa((n) => n + 1)}
                disabled={sahifa >= malumot.sahifalash.sahifalar}
                className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Keyingi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin harakatlari tarixi */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--v3-xira)]">
          Oxirgi admin harakatlari
        </h2>
        {(malumot?.oxirgiHarakat || []).length === 0 ? (
          <div className="v3-panel-karta p-5 text-xs text-[var(--v3-xira)] text-center">
            Hali hech kimga valyuta berilmagan
          </div>
        ) : (
          <div className="v3-panel-karta divide-y divide-[var(--v3-chiziq)]">
            {malumot.oxirgiHarakat.map((t) => (
              <div key={t.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[var(--v3-matn)] truncate">{t.kim}</div>
                  <div className="text-[11px] text-[var(--v3-xira)] truncate">
                    {t.izoh} · {qachon(t.createdAt)}
                  </div>
                </div>
                <span
                  className={`text-sm font-bold shrink-0 ${
                    t.miqdor > 0 ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {t.miqdor > 0 ? '+' : ''}
                  {t.miqdor} {t.valyuta === 'gems' ? 'olmos' : 'tanga'}
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
        <BotTaqiqOynasi
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
    amber: 'border-amber-400/35 text-amber-300',
    cyan: 'border-sky-400/35 text-sky-300',
    yellow: 'border-amber-400/35 text-[var(--v3-urgu)]',
    red: 'border-rose-400/35 text-rose-300',
  }
  return (
    <div className={`v3-panel-karta p-4 ${RANGLAR[rang] || ''}`}>
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xl sm:text-2xl font-bold">{(qiymat ?? 0).toLocaleString('uz-UZ')}</div>
      <div className="text-xs text-[var(--v3-xira)] mt-0.5">{nom}</div>
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
    <Oyna sarlavha={`${hisob.fullName || hisob.username} — bot valyutasi`} onYopish={onYopish}>
      <div className="text-xs text-[var(--v3-xira)] mb-4">
        Hozir: {hisob.coins} tanga · {hisob.gems} olmos
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { id: 'coins', nom: 'Tanga' },
          { id: 'gems', nom: 'Olmos' },
        ].map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setValyuta(v.id)}
            className={`v3-tugma text-xs py-2 ${valyuta === v.id ? 'v3-tugma-asosiy' : ''}`}
          >
            {v.nom}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-3">
        {TEZ_MIQDOR.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMiqdor(String(m))}
            className="v3-tugma flex-1 text-xs py-1.5"
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
        className="v3-kiritish mb-3"
      />

      <input
        value={sabab}
        onChange={(e) => setSabab(e.target.value)}
        placeholder="Sabab (foydalanuvchiga ko'rinadi)"
        className="v3-kiritish mb-3"
      />

      <label className="flex items-center gap-2 mb-4 cursor-pointer text-xs text-rose-300">
        <input
          type="checkbox"
          checked={olish}
          onChange={(e) => setOlish(e.target.checked)}
          className="accent-rose-500"
        />
        <span>Berish emas, olib qo&apos;yish</span>
      </label>

      <button
        type="button"
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
        className={`v3-tugma w-full py-2.5 text-sm font-bold disabled:opacity-40 ${
          olish ? 'bg-rose-500/20 border-rose-400/40 text-rose-200' : 'v3-tugma-asosiy'
        }`}
      >
        {ishlamoqda ? 'Bajarilmoqda...' : olish ? `${son || 0} ta olib qo'yish` : `${son || 0} ta berish`}
      </button>
    </Oyna>
  )
}

function BotTaqiqOynasi({ hisob, ishlamoqda, onYopish, onYuborish }) {
  const [kunlar, setKunlar] = useState('7')
  const [sabab, setSabab] = useState('')
  const yaroqli = Number.isInteger(Number(kunlar)) && Number(kunlar) >= 1 && sabab.trim().length > 0

  return (
    <Oyna sarlavha={`${hisob.fullName || hisob.username} — bot sarflash taqiqi`} onYopish={onYopish}>
      <p className="text-xs text-[var(--v3-xira)] mb-3 leading-relaxed">
        Cheklov qo&apos;yilsa Telegram botdagi pullik xizmatlarda tanga/olmos sarflash vaqtincha
        yopiladi. O&apos;qish, quiz va missiyalar odatdagidek ishlayveradi.
      </p>
      <input
        type="number"
        min="1"
        max="365"
        value={kunlar}
        onChange={(e) => setKunlar(e.target.value)}
        placeholder="Muddat (kun)"
        className="v3-kiritish mb-3"
      />
      <textarea
        value={sabab}
        onChange={(e) => setSabab(e.target.value)}
        rows={3}
        placeholder="Sabab (majburiy — foydalanuvchiga xabar orqali yuboriladi)"
        className="v3-kiritish mb-4"
      />
      <button
        type="button"
        onClick={() =>
          onYuborish({
            userId: hisob.id,
            amal: 'taqiq',
            kunlar: Number(kunlar),
            sabab,
          })
        }
        disabled={!yaroqli || ishlamoqda}
        className="v3-tugma w-full bg-rose-500/20 border-rose-400/40 text-rose-200 disabled:opacity-40"
      >
        {ishlamoqda ? 'Saqlanmoqda...' : `${kunlar || 0} kunga cheklash`}
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
      <p className="text-xs text-[var(--v3-xira)] mb-4 leading-relaxed">
        Taqiq faqat XARIDNI yopadi: do'kon va pullik sandiqlar ishlamaydi.
        O'qish, quiz, missiya va bepul kunlik sandiq ochiq qoladi. Muddat
        tugagach taqiq o'zi ochiladi.
      </p>

      <div className="flex gap-2 mb-3">
        {TEZ_KUN.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKunlar(k)}
            className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              kunlar === k
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
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
        className="v3-kiritish w-full mb-3"
      />

      <textarea
        value={sabab}
        onChange={(e) => setSabab(e.target.value)}
        rows={3}
        placeholder="Sabab — foydalanuvchiga ko'rinadi (majburiy)"
        className="v3-kiritish w-full mb-4 resize-none"
      />

      <button
        type="button"
        onClick={() => onYuborish({ userId: hisob.id, amal: 'taqiq', kunlar, sabab })}
        disabled={!sabab.trim() || !kunlar || ishlamoqda}
        className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm disabled:opacity-40 transition-colors"
      >
        {ishlamoqda ? 'Bajarilmoqda...' : `${kunlar} kunga taqiqlash`}
      </button>
    </Oyna>
  )
}

function Oyna({ sarlavha, onYopish, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="v3-panel-karta w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border-[var(--v3-chiziq-2)]"
        style={{ background: 'var(--v3-fon-2)' }}
      >
        <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-[var(--v3-chiziq)]">
          <h3 className="font-bold text-[var(--v3-matn)]">{sarlavha}</h3>
          <button
            type="button"
            onClick={onYopish}
            className="v3-tugma px-2.5 py-1 text-xs"
          >
            Yopish
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
