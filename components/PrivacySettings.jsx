"use client"
//
// Maxfiylik sozlamalari — har bir bo'lim uchun uch daraja.
//
// O'zgarish darhol saqlanadi: bu yerda "Saqlash" tugmasi bo'lsa, uni
// bosmasdan chiqib ketgan odam maxfiyligini o'zgartirdim deb o'ylab
// qolardi.
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const DARAJA_USLUBI = {
  hamma: 'bg-green-600 text-white border-green-500',
  dostlar: 'bg-blue-600 text-white border-blue-500',
  'hech-kim': 'bg-slate-700 text-white border-slate-500',
}

export default function PrivacySettings() {
  const [sozlama, setSozlama] = useState(null)
  const [bolimlar, setBolimlar] = useState([])
  const [darajalar, setDarajalar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState('')
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/profil/privacy')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sozlamalar yuklanmadi')
      setSozlama(data.sozlama)
      setBolimlar(data.bolimlar)
      setDarajalar(data.darajalar)
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  useEffect(() => { yukla() }, [yukla])

  const ozgart = async (kalit, daraja) => {
    const oldingi = sozlama
    const yangi = { ...sozlama, [kalit]: daraja }
    setSozlama(yangi)
    setSaqlanmoqda(true)

    try {
      const res = await fetch('/api/profil/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sozlama: yangi }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSozlama(data.sozlama)
    } catch (e) {
      // Saqlanmasa eski holatga qaytariladi — aks holda ekranda
      // saqlanmagan sozlama turib, foydalanuvchi uni haqiqiy deb bilardi
      setSozlama(oldingi)
      toast.error(e.message)
    } finally {
      setSaqlanmoqda(false)
    }
  }

  if (yuklanmoqda) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-purple-800/50 rounded w-1/3" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-purple-800/30 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (xato) {
    return (
      <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-2">⚠️</div>
        <p className="text-sm text-red-300 mb-4">{xato}</p>
        <button
          onClick={() => { setYuklanmoqda(true); yukla() }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm"
        >
          🔄 Qayta urinish
        </button>
      </div>
    )
  }

  const profilYopiq = sozlama.profil === 'hech-kim'

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
            🔒
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Maxfiylik sozlamalari</h2>
            <p className="text-sm text-purple-300">
              Har bir bo'lim uchun alohida: kim ko'radi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-[11px]">
          {darajalar.map((d) => (
            <span key={d.id} className="flex items-center gap-1.5 text-purple-300">
              <span className={`w-3 h-3 rounded-full ${DARAJA_USLUBI[d.id].split(' ')[0]}`} />
              {d.icon} {d.nom} — {d.tavsif}
            </span>
          ))}
        </div>
      </div>

      {/* Profil sahifasi — asosiy kalit, shuning uchun alohida turadi */}
      {bolimlar.filter((b) => b.asosiy).map((b) => (
        <Qator
          key={b.kalit}
          bolim={b}
          qiymat={sozlama[b.kalit]}
          darajalar={darajalar}
          onOzgart={ozgart}
          saqlanmoqda={saqlanmoqda}
          asosiy
        />
      ))}

      {profilYopiq && (
        <div className="bg-orange-900/20 border border-orange-700/40 rounded-xl p-4 text-sm text-orange-200 leading-relaxed">
          <strong className="text-orange-300">Profil sahifangiz yopiq.</strong> Boshqa
          odam profilingizni ochsa faqat ismingizni ko'radi — pastdagi
          sozlamalar esa hozircha ta'sir qilmaydi.
        </div>
      )}

      <div className={profilYopiq ? 'opacity-50 pointer-events-none' : ''}>
        <div className="space-y-3">
          {bolimlar.filter((b) => !b.asosiy).map((b) => (
            <Qator
              key={b.kalit}
              bolim={b}
              qiymat={sozlama[b.kalit]}
              darajalar={darajalar}
              onOzgart={ozgart}
              saqlanmoqda={saqlanmoqda}
            />
          ))}
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-blue-200 leading-relaxed">
            <strong className="text-blue-400">Eslatma:</strong> o'zingiz har doim
            hamma narsani ko'rasiz. Sertifikatning tekshirish havolasi (QR)
            esa har doim ochiq qoladi — u sertifikat haqiqiyligini
            isbotlash uchun kerak, shuning uchun bu yerdan yopilmaydi.
          </div>
        </div>
      </div>
    </div>
  )
}

function Qator({ bolim, qiymat, darajalar, onOzgart, saqlanmoqda, asosiy }) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        asosiy
          ? 'bg-purple-900/40 border-purple-600/50'
          : 'bg-purple-950/50 border-purple-700/30'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl">{bolim.icon}</span>
        <div className="min-w-0">
          <div className="font-semibold text-white">{bolim.nom}</div>
          <div className="text-[12px] text-purple-300">{bolim.tavsif}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {darajalar.map((d) => (
          <button
            key={d.id}
            onClick={() => onOzgart(bolim.kalit, d.id)}
            disabled={saqlanmoqda}
            className={`py-2 rounded-lg border text-xs font-semibold transition-all disabled:opacity-60 ${
              qiymat === d.id
                ? DARAJA_USLUBI[d.id]
                : 'bg-purple-950/40 border-purple-800/50 text-purple-300 hover:border-purple-600'
            }`}
          >
            {d.icon} {d.nom}
          </button>
        ))}
      </div>
    </div>
  )
}
