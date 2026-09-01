// app/admin/telegram/page.js
//
// Telegram botni sozlash va holatini ko'rish.
//
// NEGA SAHIFA KERAK. Webhook'ni ishlab chiqish kompyuteridan
// o'rnatish sir kalitni ikki joyda qo'lda bir xil ushlab turishni
// talab qilardi va aynan shu joyda xato bo'ldi. Bu yerdan bosilgan
// tugma esa kalitni SERVERNING o'zidan oladi — mos kelmasligi
// mumkin emas.
//
// Sahifa "bot nega jim" degan savolga ham javob beradi: Telegram
// oxirgi xatosini ko'rsatadi. Usiz xato hech qayerda ko'rinmasdi.
"use client"
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export default function AdminTelegramPage() {
  const [holat, setHolat] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [band, setBand] = useState(false)
  const [bolim, setBolim] = useState('sozlama')

  useEffect(() => { olish() }, [])

  async function olish() {
    setYuklanmoqda(true)
    try {
      const res = await fetch('/api/admin/telegram')
      const data = await res.json()
      if (res.ok) setHolat(data)
      else toast.error(data.error || 'Olinmadi')
    } catch (e) {
      toast.error('Xatolik: ' + e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }

  async function sozlash() {
    setBand(true)
    try {
      const res = await fetch('/api/admin/telegram', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error || 'Sozlanmadi')

      const yiqilgan = (data.qadamlar || []).filter((q) => !q.ok)
      if (yiqilgan.length === 0) toast.success('Bot sozlandi')
      else toast.error(`Yiqildi: ${yiqilgan.map((q) => q.nom).join(', ')}`)

      await olish()
    } catch (e) {
      toast.error('Xatolik: ' + e.message)
    } finally {
      setBand(false)
    }
  }

  if (yuklanmoqda) {
    return <div className="p-8 text-purple-300">Yuklanmoqda...</div>
  }

  const w = holat?.webhook
  const h = holat?.holat
  const k = holat?.kopruk

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-1">Telegram bot</h1>
      <p className="text-sm text-purple-300 mb-5">
        Bot sozlamalari, ulangan foydalanuvchilar va guruhlar.
      </p>

      {/* Bo'limlar. Ilgari hammasi bitta uzun ustunda edi va
          foydalanuvchilar ro'yxati qo'shilganda sahifa o'qib
          bo'lmaydigan darajada cho'zilib ketardi. */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ['sozlama', '⚙️ Sozlamalar'],
          ['statistika', '📈 Statistika'],
          ['odamlar', '👥 Foydalanuvchilar'],
          ['guruhlar', '💬 Guruhlar'],
          ['elon', '📣 E\'lon'],
        ].map(([kalit, nom]) => (
          <button
            key={kalit}
            onClick={() => setBolim(kalit)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              bolim === kalit
                ? 'bg-yellow-500 text-black'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/70'
            }`}
          >
            {nom}
          </button>
        ))}
      </div>

      {bolim === 'statistika' && (
        <>
          <Statistika />
          <AiSinov />
          <RasmSinov />
        </>
      )}
      {bolim === 'odamlar' && <Foydalanuvchilar />}
      {bolim === 'guruhlar' && (
        <>
          <Guruhlar />
          <Iqtibos ishlaydi={Boolean(h?.tokenBor)} />
        </>
      )}
      {bolim === 'elon' && <Elon ishlaydi={Boolean(h?.tokenBor)} />}

      {bolim !== 'sozlama' ? null : (
      <>
      <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">Muhit</h2>
        <Qator nom="Bot tokeni" holat={h?.tokenBor} />
        <Qator nom="Sir kalit" holat={h?.sirBor} />
        <Qator nom="Bot nomi" matn={h?.botNomi ? `@${h.botNomi}` : 'qo\'yilmagan'} holat={Boolean(h?.botNomi)} />
      </div>

      <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">Webhook</h2>
        {!w ? (
          <div className="text-sm text-purple-400">Token yo'q — holat olinmadi.</div>
        ) : w.xato ? (
          <div className="text-sm text-red-300">Telegram javob bermadi: {w.xato}</div>
        ) : (
          <>
            <Qator nom="Manzil" matn={w.manzil || 'o\'rnatilmagan'} holat={w.togriManzilmi} />
            <Qator nom="Navbatdagi xabar" matn={String(w.kutayotgan)} holat={w.kutayotgan === 0} />
            {w.oxirgiXato ? (
              <div className="mt-3 bg-red-950/40 border border-red-800/50 rounded-xl p-3">
                <div className="text-xs text-red-300 font-semibold mb-1">
                  Telegramning oxirgi xatosi
                </div>
                <div className="text-xs text-red-200 font-mono">{w.oxirgiXato}</div>
                {w.oxirgiXatoVaqti ? (
                  <div className="text-[11px] text-red-400 mt-1">{w.oxirgiXatoVaqti}</div>
                ) : null}
                <div className="text-[11px] text-red-300 mt-2">
                  «401 Unauthorized» — sir kalit mos kelmayapti. Pastdagi tugma
                  webhook'ni serverdagi kalit bilan qayta yozadi va shuni tuzatadi.
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-green-400">Xato yo'q</div>
            )}
          </>
        )}
      </div>

      {/* Quiz va PDF xizmati — Render'dagi Python bot bilan bog'lanish.
          Foydalanuvchiga ko'rinadigan xabar ataylab umumiy, sabab esa
          bir nechta bo'lishi mumkin. Shu yerda aniq aytiladi. */}
      <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">
          Quiz va PDF xizmati (ko&apos;prik)
        </h2>
        {!k ? (
          <div className="text-sm text-purple-400">Holat olinmadi.</div>
        ) : (
          <>
            <Qator
              nom="Manzil"
              matn={k.manzil || 'qo\'yilmagan'}
              holat={Boolean(k.manzil)}
            />
            <Qator nom="Holat" matn={k.holat} holat={k.holat === 'ishlayapti'} />
            <div
              className={`mt-3 rounded-xl p-3 text-xs ${
                k.holat === 'ishlayapti'
                  ? 'bg-green-950/40 border border-green-800/50 text-green-200'
                  : 'bg-red-950/40 border border-red-800/50 text-red-200'
              }`}
            >
              {k.izoh}
            </div>
          </>
        )}
      </div>

      <button
        onClick={sozlash}
        disabled={band || !h?.tokenBor || !h?.sirBor}
        className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold disabled:opacity-40 transition-all"
      >
        {band ? 'Sozlanmoqda...' : 'Botni sozlash'}
      </button>

      {(!h?.tokenBor || !h?.sirBor) && (
        <p className="text-xs text-red-300 mt-3">
          Avval Vercel sozlamalariga TELEGRAM_BOT_TOKEN va TELEGRAM_WEBHOOK_SIR
          qo'shib, qayta deploy qiling.
        </p>
      )}
      </>
      )}
    </div>
  )
}

/**
 * Bot qo'shilgan guruhlar.
 *
 * NEGA QAMROV RAQAMI BOR. Guruh nomi qaysi biri 12 kishilik sinf,
 * qaysi biri 3000 kishilik jamoa ekanini aytmaydi. Bot uchun esa
 * asosiy o'lchov shu: bitta xabar necha kishiga yetadi. Qamrovsiz
 * "e'lon yuborish" tugmasi ko'r-ko'rona bosiladi.
 */
function Guruhlar() {
  const [d, setD] = useState(null)
  const [band, setBand] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/telegram/guruhlar')
      setD(await res.json())
    } catch {
      setD({ success: false })
    }
  }, [])

  useEffect(() => {
    yukla()
  }, [yukla])

  async function almashtir(g, maydon) {
    setBand(true)
    try {
      await fetch('/api/admin/telegram/guruhlar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: g.id, [maydon]: !g[maydon] }),
      })
      await yukla()
    } finally {
      setBand(false)
    }
  }

  async function ochir(g) {
    if (!confirm(`"${g.nom || g.chatId}" ro'yxatdan o'chirilsinmi?`)) return
    setBand(true)
    try {
      const res = await fetch(`/api/admin/telegram/guruhlar?id=${g.id}`, {
        method: 'DELETE',
      })
      const j = await res.json()
      if (!res.ok) toast.error(j.error || 'O\'chirilmadi')
      await yukla()
    } finally {
      setBand(false)
    }
  }

  if (!d) return <div className="text-sm text-purple-400 mb-4">Yuklanmoqda...</div>
  if (!d.success) {
    return (
      <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-5 mb-4 text-sm text-red-200">
        Guruhlar ro&apos;yxati olinmadi.
      </div>
    )
  }

  const j = d.jami || {}

  return (
    <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mb-5">
      <h2 className="text-sm font-bold text-yellow-300 mb-3">Guruhlar</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Karta nom="Bot ichida" qiymat={j.faol} belgi="💬" />
        <Karta nom="Chiqarilgan" qiymat={(j.hammasi || 0) - (j.faol || 0)} belgi="🚪" />
        <Karta nom="Yangilik yoqilgan" qiymat={j.yangilikli} belgi="📰" />
        <Karta
          nom="Umumiy qamrov"
          qiymat={j.qamrov}
          izoh="bitta xabar necha kishiga yetadi"
          belgi="📣"
        />
      </div>

      {d.guruhlar.length === 0 ? (
        <div className="text-xs text-purple-400 bg-purple-950/40 rounded-xl p-3">
          Bot hali hech qaysi guruhga qo&apos;shilmagan. Botni guruhga
          qo&apos;shsangiz, u o&apos;zi ro&apos;yxatga tushadi.
        </div>
      ) : (
        <div className="space-y-2">
          {d.guruhlar.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between gap-3 bg-purple-950/40 border border-purple-800/40 rounded-xl px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-sm text-white truncate">
                  {g.nom || `Guruh ${g.chatId}`}
                </div>
                <div className="text-[11px] text-purple-400">
                  {typeof g.azolar === 'number' ? `${g.azolar} a'zo · ` : ''}
                  {g.qoshgan ? `${g.qoshgan} qo'shgan · ` : ''}
                  {g.faol ? 'bot ichida' : 'bot chiqarilgan'}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <button
                  onClick={() => almashtir(g, 'iqtiboslar')}
                  disabled={!g.faol || band}
                  title="Kunlik iqtibos"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40 transition-all ${
                    g.iqtiboslar
                      ? 'bg-green-600/20 border border-green-600/40 text-green-300'
                      : 'bg-slate-700/30 border border-slate-600/50 text-slate-400'
                  }`}
                >
                  📜 {g.iqtiboslar ? 'Yoqilgan' : "O'chirilgan"}
                </button>
                <button
                  onClick={() => almashtir(g, 'yangiliklar')}
                  disabled={!g.faol || band}
                  title="JDA KIMYO NEWS yangiliklari"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40 transition-all ${
                    g.yangiliklar
                      ? 'bg-sky-600/20 border border-sky-600/40 text-sky-300'
                      : 'bg-slate-700/30 border border-slate-600/50 text-slate-400'
                  }`}
                >
                  📰 {g.yangiliklar ? 'Yoqilgan' : "O'chirilgan"}
                </button>
                {!g.faol && (
                  <button
                    onClick={() => ochir(g)}
                    disabled={band}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-red-900/40 border border-red-800/50 text-red-300 disabled:opacity-40"
                  >
                    O&apos;chirish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-purple-500 mt-3">
        Bot chiqarilgan guruh yozuvi saqlanadi: qayta qo&apos;shilsa,
        sozlamalari joyida qoladi. Butunlay o&apos;chirish faqat
        chiqarilgan guruhlarga ruxsat etilgan.
      </p>
    </div>
  )
}

/**
 * Quiz va prezentatsiya statistikasi.
 *
 * Ma'lumot Python botdan HTTP orqali keladi — u alohida bazada
 * yashaydi. Shu sababli bu bo'lim servis uxlab qolganda bo'sh
 * qolishi mumkin va buni ochiq aytadi: "yuklanmadi" deb jim
 * turgan panel adminni chalg'itadi.
 */
function Statistika() {
  const [d, setD] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  useEffect(() => {
    let bekor = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/telegram/hisobot')
        const data = await res.json()
        if (!bekor) setD(data)
      } catch {
        if (!bekor) setD({ success: false, sabab: 'ulanmadi' })
      } finally {
        if (!bekor) setYuklanmoqda(false)
      }
    })()
    return () => {
      bekor = true
    }
  }, [])

  if (yuklanmoqda) {
    return <div className="text-sm text-purple-400">Yuklanmoqda...</div>
  }

  if (d?.sozlanmagan) {
    return (
      <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 text-sm text-purple-300">
        Ko&apos;prik sozlanmagan — statistika Python botdan olinadi.
        Sozlamalar bo&apos;limiga qarang.
      </div>
    )
  }

  if (!d?.success) {
    const izoh = {
      'kalit-mos-emas': 'Kalitlar mos emas — Sozlamalar bo\'limiga qarang.',
      uxlayapti: 'Servis uyg\'onmadi. Bir daqiqadan keyin sahifani yangilang.',
      ulanmadi: 'Botga ulanib bo\'lmadi.',
    }[d?.sabab] || 'Statistika olinmadi.'
    return (
      <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-5 text-sm text-red-200">
        {izoh}
      </div>
    )
  }

  const h = d.hisobot || {}
  const q = h.quiz || {}
  const t = h.taqdimot || {}

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Karta nom="Botdan foydalanganlar" qiymat={h.foydalanuvchilar} belgi="👥" />
        <Karta nom="Bloklangan" qiymat={h.bloklangan} belgi="🚫" />
        <Karta nom="Quiz yasalgan" qiymat={q.jami} izoh={`${q.hafta || 0} ta shu hafta`} belgi="🧩" />
        <Karta
          nom="Prezentatsiya"
          qiymat={t.jami}
          izoh={`${t.hafta || 0} ta shu hafta`}
          belgi="🎓"
        />
      </div>

      <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">Umumiy hajm</h2>
        <Qator nom="Yasalgan savollar" matn={`${q.savollar || 0} ta`} holat />
        <Qator nom="Yasalgan slaydlar" matn={`${t.slaydlar || 0} ta`} holat />
        <p className="text-[11px] text-purple-400 mt-3">
          Bu raqamlar botning o&apos;z bazasidan. Tanga hisobi esa saytda —
          ikkalasi ataylab alohida: biri mahsulot statistikasi, ikkinchisi
          moliyaviy hisob.
        </p>
      </div>
    </div>
  )
}

/**
 * AI (Gemini) ulanishini bir bosishda tekshirish.
 *
 * Prezentatsiya ishlamaganda sabab bir nechta bo'lishi mumkin: kalit
 * yo'q, model nomi noto'g'ri, kunlik kvota tugagan, yoki javob bo'sh
 * qaytgan. Ular Render qaydnomasida qolardi va tuzatish taxmin bilan
 * olib borilardi. Bu tugma o'sha xom ma'lumotni bevosita ko'rsatadi.
 */
function AiSinov() {
  const [natija, setNatija] = useState(null)
  const [band, setBand] = useState(false)

  async function sina() {
    setBand(true)
    setNatija(null)
    try {
      const res = await fetch('/api/admin/telegram/ai-sinov', { method: 'POST' })
      setNatija(await res.json())
    } catch (e) {
      setNatija({ success: false, sabab: 'ulanmadi', xato: e.message })
    } finally {
      setBand(false)
    }
  }

  const n = natija?.natija
  const yaxshi = n?.ok

  return (
    <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mt-4">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <h2 className="text-sm font-bold text-yellow-300">AI ulanishi (Gemini)</h2>
        <button
          onClick={sina}
          disabled={band}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold disabled:opacity-40"
        >
          {band ? 'Tekshirilmoqda...' : 'Sinab ko\'rish'}
        </button>
      </div>

      {!natija ? (
        <p className="text-xs text-purple-400">
          Prezentatsiya ishlamasa shu tugmani bosing — sabab shu yerda
          ko&apos;rinadi.
        </p>
      ) : !natija.success ? (
        <div className="text-xs text-red-200 bg-red-950/40 border border-red-800/50 rounded-xl p-3">
          {{
            'kopruk-sozlanmagan': 'Ko\'prik sozlanmagan (BOT_ISHCHI_URL / BOT_KOPRUK_SIR).',
            'kalit-mos-emas': 'Ko\'prik kaliti mos emas — Sozlamalar bo\'limiga qarang.',
            'eski-kod': 'Render eski kod bilan ishlayapti — Manual Deploy qiling.',
            uxlayapti: 'Servis javob bermadi. Bir daqiqadan keyin qayta bosing.',
          }[natija.sabab] || 'Tekshirib bo\'lmadi.'}
        </div>
      ) : (
        <div
          className={`rounded-xl p-3 text-xs border ${
            yaxshi
              ? 'bg-green-950/40 border-green-800/50 text-green-200'
              : 'bg-red-950/40 border-red-800/50 text-red-200'
          }`}
        >
          <div className="font-bold mb-2">
            {yaxshi ? '✅ AI ishlayapti' : '❌ AI javob bermadi'}
          </div>
          <Satr nom="Model" qiymat={n.model} />
          <Satr nom="Kalit uzunligi" qiymat={n.kalitUzunligi} />
          {n.ishlagan ? <Satr nom="Ishlagan sozlama" qiymat={n.ishlagan} /> : null}
          {n.javob ? <Satr nom="Javob" qiymat={n.javob} /> : null}
          {!yaxshi && n.kod ? <Satr nom="HTTP kodi" qiymat={n.kod} /> : null}
          {!yaxshi && n.xato ? <Satr nom="Xato" qiymat={n.xato} /> : null}
          {n.sabab ? <Satr nom="Sabab" qiymat={n.sabab} /> : null}

          {/* Bosqichlar: so'rov sodda tomonga qarab qisqartiriladi va
              birinchi ishlagani qaysi maydon aybdor ekanini ko'rsatadi */}
          {n.urinishlar?.length > 1 ? (
            <details className="mt-3 pt-3 border-t border-white/10">
              <summary className="cursor-pointer opacity-70">
                Bosqichlar ({n.urinishlar.length} ta sinov)
              </summary>
              <div className="mt-2 space-y-2">
                {n.urinishlar.map((u, i) => (
                  <div key={i} className="font-mono text-[11px] opacity-90">
                    <span className={u.kod === 200 ? 'text-green-400' : 'text-red-400'}>
                      [{u.kod}]
                    </span>{' '}
                    {u.bosqich}
                    {u.xato ? <div className="pl-6 opacity-70">{u.xato}</div> : null}
                    {u.tafsilot && u.tafsilot !== '[]' ? (
                      <div className="pl-6 opacity-60 break-all">{u.tafsilot}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </details>
          ) : null}
          {n.hisob ? (
            <Satr nom="Tokenlar" qiymat={JSON.stringify(n.hisob)} />
          ) : null}

          {/* Model yopilganda to'g'ri nomni taxmin qilishga hojat
              qolmasin: API o'zi aytgan ro'yxat ko'rsatiladi */}
          {n.ochiqModellar?.length ? (
            <div className="mt-3 pt-3 border-t border-red-800/50">
              <div className="opacity-70 mb-1">
                Shu kalit uchun ochiq modellar — kerakligini Render&apos;dagi{' '}
                <code className="font-mono">GEMINI_MODEL</code> ga yozing:
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {n.ochiqModellar.map((m) => (
                  <span
                    key={m}
                    className="font-mono text-[11px] bg-slate-900/70 rounded px-2 py-1"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

/**
 * Slaydlardagi rasm manbalarini tekshirish.
 *
 * NEGA AI SINOVIDAN ALOHIDA. "Slaydlarda rasm yo'q" shikoyatining uch
 * xil sababi bor va uchalasi ham foydalanuvchiga bir xil ko'rinadi:
 *   1. PubChem moddani topmagan (nom noto'g'ri shaklda so'ralgan),
 *   2. Gemini'ning RASM modeli yopilgan (matn modeli ishlab tursa ham),
 *   3. kalit umuman qo'yilmagan.
 * Yuqoridagi "AI ulanishi" tugmasi faqat MATN modelini tekshiradi va
 * u yashil bo'lsa ham rasm ishlamayotgan bo'lishi mumkin.
 */
function RasmSinov() {
  const [natija, setNatija] = useState(null)
  const [band, setBand] = useState(false)

  async function sina() {
    setBand(true)
    setNatija(null)
    try {
      const res = await fetch('/api/admin/telegram/rasm-sinov', { method: 'POST' })
      setNatija(await res.json())
    } catch (e) {
      setNatija({ success: false, sabab: 'ulanmadi', xato: e.message })
    } finally {
      setBand(false)
    }
  }

  const n = natija?.natija
  const bezak = n?.bezak

  return (
    <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mt-4">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <h2 className="text-sm font-bold text-yellow-300">
          Slayd rasmlari (PubChem + bezak)
        </h2>
        <button
          onClick={sina}
          disabled={band}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold disabled:opacity-40"
        >
          {band ? 'Tekshirilmoqda...' : 'Sinab ko\'rish'}
        </button>
      </div>

      {!natija ? (
        <p className="text-xs text-purple-400">
          Slaydlarda tuzilma yoki muqova rasmi chiqmasa shu tugmani bosing.
        </p>
      ) : !natija.success ? (
        <div className="text-xs text-red-200 bg-red-950/40 border border-red-800/50 rounded-xl p-3">
          {{
            'kopruk-sozlanmagan': 'Ko\'prik sozlanmagan (BOT_ISHCHI_URL / BOT_KOPRUK_SIR).',
            'kalit-mos-emas': 'Ko\'prik kaliti mos emas — Sozlamalar bo\'limiga qarang.',
            'eski-kod': 'Render eski kod bilan ishlayapti — Manual Deploy qiling.',
            uxlayapti: 'Servis javob bermadi. Bir daqiqadan keyin qayta bosing.',
          }[natija.sabab] || 'Tekshirib bo\'lmadi.'}
        </div>
      ) : (
        <div className="space-y-3">
          {/* ── PubChem: tuzilma formulalari ── */}
          <div
            className={`rounded-xl p-3 text-xs border ${
              n.pubchemOk
                ? 'bg-green-950/40 border-green-800/50 text-green-200'
                : 'bg-red-950/40 border-red-800/50 text-red-200'
            }`}
          >
            <div className="font-bold mb-2">
              {n.pubchemOk ? '✅ PubChem javob beryapti' : '❌ PubChem javob bermadi'}
            </div>
            {n.pubchem?.map((p, i) => (
              <div key={i} className="font-mono text-[11px] py-0.5">
                <span className={p.topildi ? 'text-green-400' : 'text-red-400'}>
                  {p.topildi ? '✓' : '✕'}
                </span>{' '}
                {p.soralgan}{' '}
                <span className="opacity-50">— {p.izoh}</span>
              </div>
            ))}
            <p className="opacity-60 mt-2 text-[11px]">
              Kvadrat qavsli formula ([Cu(NH3)4]SO4) PubChem&apos;da yo&apos;q —
              shuning uchun modelga inglizcha NOM yozish buyurilgan. Uning
              qatorida ✕ turishi normal.
            </p>
          </div>

          {/* ── Muqova fotosi (Wikimedia Commons) ──
              ASOSIY manba: kalitsiz, Gemini holatidan mustaqil. */}
          {n.foto ? (
            <div
              className={`rounded-xl p-3 text-xs border ${
                n.foto.ok
                  ? 'bg-green-950/40 border-green-800/50 text-green-200'
                  : 'bg-red-950/40 border-red-800/50 text-red-200'
              }`}
            >
              <div className="font-bold mb-2">
                {n.foto.ok
                  ? '✅ Muqova fotosi topilyapti (Wikimedia Commons)'
                  : '❌ Commons javob bermadi'}
              </div>
              {n.foto.sorovlar?.map((s, i) => (
                <div key={i} className="font-mono text-[11px] py-0.5">
                  <span className={s.topildi ? 'text-green-400' : 'text-red-400'}>
                    {s.topildi ? `${s.topildi} ta` : '0'}
                  </span>{' '}
                  {s.sorov}
                  {s.misol ? (
                    <span className="opacity-50"> — {s.misol}</span>
                  ) : null}
                </div>
              ))}
              {n.foto.xato ? <Satr nom="Xato" qiymat={n.foto.xato} /> : null}
              <p className="opacity-60 mt-2 text-[11px]">
                Faqat CC0, Public domain va CC BY olinadi. CC BY-SA rad
                etiladi: u foydalangan asarni ham shu litsenziyaga
                bog&apos;lab qo&apos;yadi.
              </p>
            </div>
          ) : null}

          {/* ── Muqova bezagi ── */}
          <div
            className={`rounded-xl p-3 text-xs border ${
              bezak?.ok
                ? 'bg-green-950/40 border-green-800/50 text-green-200'
                : 'bg-red-950/40 border-red-800/50 text-red-200'
            }`}
          >
            <div className="font-bold mb-2">
              {bezak?.ok
                ? '✅ AI bezak rasmi ishlayapti'
                : '❌ AI bezak rasmi chiqmadi (foto zaxirada)'}
            </div>
            {bezak?.model ? <Satr nom="Rasm modeli" qiymat={bezak.model} /> : null}
            {bezak?.kod ? <Satr nom="HTTP kodi" qiymat={bezak.kod} /> : null}
            {bezak?.hajm ? <Satr nom="Rasm hajmi" qiymat={`${bezak.hajm} bayt`} /> : null}
            {bezak?.xato ? <Satr nom="Xato" qiymat={bezak.xato} /> : null}
            {bezak?.sabab ? (
              <Satr
                nom="Sabab"
                qiymat={
                  {
                    'kalit-yoq': 'GEMINI_API_KEY qo\'yilmagan',
                    'model-rasm-qaytarmadi':
                      'Model javob berdi, lekin rasm emas — bu rasm modeli emas',
                  }[bezak.sabab] || bezak.sabab
                }
              />
            ) : null}

            {/* Zaxira modellar SINALGAN holda ko'rsatiladi. Ochiq
                modellar ro'yxatining o'zi yetarli emas edi: bepul
                tarifda model ochiq bo'lsa ham kunlik chegarasi nolga
                teng bo'lishi va birinchi so'rovdayoq 429 berishi
                mumkin. */}
            {bezak?.zaxiraModellar?.length ? (
              <div className="mt-3 pt-3 border-t border-red-800/50">
                {bezak.ishlaydiganModel ? (
                  <div className="text-green-300 mb-2">
                    ✅ <b>{bezak.ishlaydiganModel}</b> ishladi — shu nomni
                    Render&apos;dagi{' '}
                    <code className="font-mono">GEMINI_RASM_MODEL</code> ga
                    yozing.
                  </div>
                ) : (
                  <div className="opacity-70 mb-2">
                    Hamma modelda 429 bo&apos;lsa bu kunlik kvota emas:
                    Gemini bepul tarifida rasm generatsiyasi chegarasi
                    2025-dekabrdan beri NOLGA teng. Kutish yordam
                    bermaydi — Google Cloud loyihasida to&apos;lovni
                    yoqish kerak (Tier 1, eng kam sarfsiz). Shu holatda
                    bot muqovaga Wikimedia Commons fotosini qo&apos;yadi.
                  </div>
                )}
                <div className="space-y-0.5">
                  {bezak.zaxiraModellar.map((z) => (
                    <div key={z.model} className="font-mono text-[11px]">
                      <span className={z.ok ? 'text-green-400' : 'text-red-400'}>
                        [{z.kod}]
                      </span>{' '}
                      {z.model}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

function Satr({ nom, qiymat }) {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="opacity-60 shrink-0">{nom}:</span>
      <span className="font-mono break-all">{String(qiymat)}</span>
    </div>
  )
}

function Karta({ nom, qiymat, izoh, belgi }) {
  return (
    <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4">
      <div className="text-2xl mb-1">{belgi}</div>
      <div className="text-2xl font-bold text-white">{qiymat ?? 0}</div>
      <div className="text-[11px] text-purple-300">{nom}</div>
      {izoh ? <div className="text-[10px] text-purple-500 mt-1">{izoh}</div> : null}
    </div>
  )
}

/**
 * Botga ulangan foydalanuvchilar.
 *
 * NEGA QUIZ VA PREZENTATSIYA HISOBI YO'Q. Ular Python botning o'z
 * bazasida (Render'dagi alohida Neon bazasi) yoziladi va bu sahifa
 * saytning bazasiga qaraydi. Shu sababli bu yerda faqat sayt
 * biladigan narsa ko'rsatiladi: kim ulangan, tangasi, holati.
 */
function Foydalanuvchilar() {
  const [d, setD] = useState(null)
  const [qidiruv, setQidiruv] = useState('')
  const [sahifa, setSahifa] = useState(1)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  useEffect(() => {
    let bekor = false
    // Har harfda so'rov yubormaslik uchun kichik kechikish
    const soat = setTimeout(async () => {
      setYuklanmoqda(true)
      try {
        const q = new URLSearchParams({ sahifa: String(sahifa) })
        if (qidiruv.trim()) q.set('q', qidiruv.trim())
        const res = await fetch(`/api/admin/telegram/foydalanuvchilar?${q}`)
        const data = await res.json()
        if (!bekor && res.ok) setD(data)
      } catch {
        /* ro'yxat bo'sh qoladi, sahifa ishlashda davom etadi */
      } finally {
        if (!bekor) setYuklanmoqda(false)
      }
    }, 300)
    return () => {
      bekor = true
      clearTimeout(soat)
    }
  }, [qidiruv, sahifa])

  return (
    <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <h2 className="text-sm font-bold text-yellow-300">
          Ulangan foydalanuvchilar {d ? `(${d.jami} ta)` : ''}
        </h2>
        {d ? (
          <span className="text-xs text-purple-400">
            {d.xabarlarYoqilgan} tasi xabar oladi
          </span>
        ) : null}
      </div>

      <input
        value={qidiruv}
        onChange={(e) => {
          setQidiruv(e.target.value)
          setSahifa(1)
        }}
        placeholder="Ism, username yoki chatId bo'yicha qidirish"
        className="w-full mb-4 px-4 py-2 rounded-xl bg-slate-900/70 border border-purple-700/50 text-sm text-white placeholder-purple-500 focus:outline-none focus:border-yellow-500"
      />

      {yuklanmoqda && !d ? (
        <div className="text-sm text-purple-400">Yuklanmoqda...</div>
      ) : !d?.foydalanuvchilar?.length ? (
        <div className="text-sm text-purple-400">
          {qidiruv ? 'Hech kim topilmadi.' : 'Hali hech kim botga ulanmagan.'}
        </div>
      ) : (
        <div className="space-y-2">
          {d.foydalanuvchilar.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/50 px-3 py-2.5"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {f.fullName || f.username}
                  {f.bloklangan && (
                    <span className="ml-2 text-[10px] text-red-300">bloklangan</span>
                  )}
                  {!f.emailTasdiqlangan && (
                    <span className="ml-2 text-[10px] text-orange-300">
                      email tasdiqlanmagan
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-purple-400 truncate">
                  @{f.username} · {f.tgUsername ? `TG @${f.tgUsername}` : `chatId ${f.chatId}`}
                  {' · '}
                  {new Date(f.bogladi).toLocaleDateString('uz-UZ')}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="text-amber-300 font-bold">🪙 {f.coins}</span>
                <span className={f.xabarlar ? 'text-green-400' : 'text-purple-500'}>
                  {f.xabarlar ? '🔔' : '🔕'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {d && d.sahifalar > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setSahifa((s) => Math.max(1, s - 1))}
            disabled={sahifa <= 1}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-purple-200 text-xs disabled:opacity-40"
          >
            ← Oldingi
          </button>
          <span className="text-xs text-purple-400">
            {d.sahifa} / {d.sahifalar}
          </span>
          <button
            onClick={() => setSahifa((s) => Math.min(d.sahifalar, s + 1))}
            disabled={sahifa >= d.sahifalar}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-purple-200 text-xs disabled:opacity-40"
          >
            Keyingi →
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Kunlik iqtibos nazorati.
 *
 * Admin panelda gaplar ro'yxati allaqachon bor edi (/admin/quotes),
 * lekin BUGUN qaysi gap chiqishini oldindan ko'rish yo'li yo'q edi —
 * uni bilish uchun saytni ochib ko'rish kerak bo'lardi.
 */
function Iqtibos({ ishlaydi }) {
  const [d, setD] = useState(null)
  const [band, setBand] = useState(false)

  useEffect(() => { if (ishlaydi) ol() }, [ishlaydi])

  async function ol() {
    try {
      const res = await fetch('/api/admin/telegram/iqtibos')
      const data = await res.json()
      if (res.ok) setD(data)
    } catch { /* bo'lim ishlashda davom etadi */ }
  }

  async function yubor() {
    if (!confirm('Bugungi iqtibos hamma guruhga yuborilsinmi?')) return
    setBand(true)
    try {
      const res = await fetch('/api/admin/telegram/iqtibos', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error || 'Yuborilmadi')
      toast.success(`${data.yetdi}/${data.jami} guruhga yuborildi`)
      await ol()
    } catch (e) {
      toast.error('Xatolik: ' + e.message)
    } finally {
      setBand(false)
    }
  }

  // Guruh sozlamalari yuqoridagi "Guruhlar" bo'limiga ko'chirildi —
  // bu yerda faqat iqtibosning o'zi va yuborish qoldi.

  if (!ishlaydi || !d) return null

  const MANBA = {
    sana: 'shu sanaga belgilangan',
    aylanma: 'faol gaplar orasidan (sana bo\'yicha)',
    zaxira: 'bazada gap yo\'q — zaxira ro\'yxatidan',
  }

  return (
    <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mt-6">
      <h2 className="text-sm font-bold text-yellow-300 mb-1">Kunlik iqtibos</h2>
      <p className="text-xs text-purple-400 mb-4">
        Har kuni ertalab (Toshkent 08:00) guruhlarga yuboriladi.
        Bazada {d.gaplar.jami} ta gap, {d.gaplar.faol} tasi faol.
      </p>

      <div className="bg-purple-950/50 border border-purple-800/50 rounded-xl p-4 mb-4">
        <div className="text-[11px] text-purple-400 mb-2">
          Bugun ketadi — {MANBA[d.iqtibos.manba] || d.iqtibos.manba}
        </div>
        <div className="text-sm text-white italic leading-relaxed">
          {d.iqtibos.icon} {d.iqtibos.textUz}
        </div>
        <div className="text-xs text-purple-300 mt-2">— {d.iqtibos.author}</div>
        {d.iqtibos.manba === 'zaxira' && (
          <div className="text-[11px] text-amber-300/80 mt-3">
            Bazaga gap qo'shilsa, zaxira ro'yxati ishlatilmaydi.{' '}
            <a href="/admin/quotes" className="underline">Gaplar bo'limi</a>
          </div>
        )}
      </div>

      {/* Guruhlar ro'yxati yuqoridagi alohida bo'limda — bu yerda
          faqat iqtibosning o'zi va yuborish tugmasi qoldi. */}

      <button
        onClick={yubor}
        disabled={band || d.guruhlar.length === 0}
        className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-semibold text-sm disabled:opacity-40 transition-all"
      >
        {band ? 'Yuborilmoqda...' : 'Bugungi iqtibosni hozir yuborish'}
      </button>
      <div className="text-[11px] text-purple-500 mt-2">
        Qayta yuborish xavfsiz — iqtibos sanadan hisoblanadi, ya'ni o'sha gap ketadi.
      </div>
    </div>
  )
}

/**
 * E'lon yuborish.
 *
 * TASDIQLASH IKKI BOSQICHLI. Yuborilgan xabarni Telegramdan qaytarib
 * olib bo'lmaydi va u bir vaqtda butun auditoriyaga boradi —
 * tasodifan bosilgan tugmaning narxi juda yuqori.
 */
function Elon({ ishlaydi }) {
  const [sanoq, setSanoq] = useState(null)
  const [matn, setMatn] = useState('')
  const [rasm, setRasm] = useState(null)
  const [havolaUrl, setHavolaUrl] = useState('')
  const [havolaMatn, setHavolaMatn] = useState('')
  const [tasdiq, setTasdiq] = useState(false)
  const [band, setBand] = useState(false)
  const [natija, setNatija] = useState(null)

  useEffect(() => { if (ishlaydi) sanoqniOl() }, [ishlaydi])

  async function sanoqniOl() {
    try {
      const res = await fetch('/api/admin/telegram/elon')
      const d = await res.json()
      if (res.ok) setSanoq(d)
    } catch { /* bo'lim ishlashda davom etadi */ }
  }

  async function rasmYukla(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBand(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/telegram/rasm', { method: 'POST', body: fd })
      const d = await res.json()
      if (!res.ok) return toast.error(d.error || 'Yuklanmadi')
      setRasm(d)
      toast.success('Rasm yuklandi')
    } catch (err) {
      toast.error('Xatolik: ' + err.message)
    } finally {
      setBand(false)
      e.target.value = ''
    }
  }

  async function yubor() {
    setBand(true)
    setNatija(null)
    try {
      const res = await fetch('/api/admin/telegram/elon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matn, rasm: rasm?.url || '', havolaUrl, havolaMatn }),
      })
      const d = await res.json()
      if (!res.ok) return toast.error(d.error || 'Yuborilmadi')

      setNatija(d)
      setTasdiq(false)
      if (d.yetmadi === 0) toast.success(`${d.yetdi} ta odamga yetdi`)
      else toast.error(`${d.yetdi} yetdi, ${d.yetmadi} yetmadi`)

      setMatn('')
      setRasm(null)
      setHavolaUrl('')
      setHavolaMatn('')
      await sanoqniOl()
    } catch (err) {
      toast.error('Xatolik: ' + err.message)
    } finally {
      setBand(false)
    }
  }

  if (!ishlaydi) return null

  // Rasm bilan yuborilganda Telegram izohi to'rt baravar qisqa
  const chegara = rasm ? (sanoq?.chegara?.izoh ?? 1024) : (sanoq?.chegara?.matn ?? 4096)
  const oshdi = matn.length > chegara
  const bosholmaydi = band || oshdi || (!matn.trim() && !rasm) || !sanoq?.faol

  return (
    <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 mt-6">
      <h2 className="text-sm font-bold text-yellow-300 mb-1">E'lon yuborish</h2>
      <p className="text-xs text-purple-400 mb-4">
        {sanoq
          ? `Botga ulangan: ${sanoq.jami} ta, xabar oladigan: ${sanoq.faol} ta`
          : 'Yuklanmoqda...'}
      </p>

      {/* OLUVCHI YO'QLIGI SABABINI AYTAMIZ. Avval tugma shunchaki
          o'chiq turardi va nega bosilmasligi ko'rinmasdi — "e'lon
          yuborib bo'lmayapti" degan holat aynan shundan kelib
          chiqqan edi. */}
      {sanoq && sanoq.faol === 0 && (
        <div className="mb-4 bg-amber-950/30 border border-amber-700/40 rounded-xl p-4">
          <div className="text-sm text-amber-200 font-semibold mb-1">
            Hali hech kim botga ulanmagan
          </div>
          <div className="text-xs text-amber-300/80 leading-relaxed">
            E'lon yuborish uchun kamida bitta odam hisobini ulashi kerak.
            Botga <span className="font-mono">/kod</span> yozing va kodni{' '}
            <Link href="/profil/telegram" className="underline hover:text-amber-200">
              Sozlamalar → Telegram
            </Link>{' '}
            bo'limiga kiriting — birinchi ulanish sizniki bo'ladi.
          </div>
        </div>
      )}

      <textarea
        value={matn}
        onChange={(e) => setMatn(e.target.value)}
        rows={5}
        placeholder="E'lon matni..."
        className="w-full bg-purple-950/50 border border-purple-700/50 rounded-xl p-3 text-sm text-white placeholder-purple-500 focus:border-yellow-500/50 outline-none resize-y"
      />
      <div className={`text-[11px] mt-1 ${oshdi ? 'text-red-400' : 'text-purple-400'}`}>
        {matn.length} / {chegara}
        {rasm ? ' (rasm bilan chegara qisqaroq)' : ''}
      </div>

      <div className="mt-4">
        {rasm ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rasm.url} alt="" className="w-24 h-24 object-cover rounded-xl border border-purple-700/50" />
            <div className="text-xs text-purple-300">
              <div>{rasm.olcham} KB</div>
              <button
                onClick={() => setRasm(null)}
                className="text-red-300 underline mt-1 hover:text-red-200"
              >
                Olib tashlash
              </button>
            </div>
          </div>
        ) : (
          <label className="inline-block px-4 py-2 rounded-lg bg-purple-800/50 border border-purple-600/50 text-sm text-purple-200 cursor-pointer hover:bg-purple-700/50 transition-all">
            🖼️ Rasm qo'shish
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={rasmYukla} className="hidden" />
          </label>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <input
          value={havolaUrl}
          onChange={(e) => setHavolaUrl(e.target.value)}
          placeholder="Tugma havolasi (ixtiyoriy)"
          className="bg-purple-950/50 border border-purple-700/50 rounded-xl p-2.5 text-sm text-white placeholder-purple-500 outline-none focus:border-yellow-500/50"
        />
        <input
          value={havolaMatn}
          onChange={(e) => setHavolaMatn(e.target.value)}
          placeholder="Tugma yozuvi (sukut: Saytda ochish)"
          className="bg-purple-950/50 border border-purple-700/50 rounded-xl p-2.5 text-sm text-white placeholder-purple-500 outline-none focus:border-yellow-500/50"
        />
      </div>

      {!tasdiq ? (
        <button
          onClick={() => setTasdiq(true)}
          disabled={bosholmaydi}
          className="mt-5 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold disabled:opacity-40 transition-all"
        >
          Yuborishga tayyorlash
        </button>
      ) : (
        <div className="mt-5 bg-yellow-950/30 border border-yellow-700/50 rounded-xl p-4">
          <div className="text-sm text-yellow-200 font-semibold mb-1">
            {sanoq?.faol} ta odamga yuboriladi
          </div>
          <div className="text-xs text-yellow-300/80 mb-3">
            Yuborilgan xabarni Telegramdan qaytarib olib bo'lmaydi.
          </div>
          <div className="flex gap-3">
            <button
              onClick={yubor}
              disabled={band}
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm disabled:opacity-50 transition-all"
            >
              {band ? 'Yuborilmoqda...' : 'Ha, yuborilsin'}
            </button>
            <button
              onClick={() => setTasdiq(false)}
              disabled={band}
              className="px-5 py-2.5 rounded-lg bg-purple-800/50 border border-purple-600/50 text-purple-200 text-sm transition-all"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {natija && (
        <div className="mt-4 bg-purple-950/40 border border-purple-700/50 rounded-xl p-4 text-sm">
          <div className="text-green-400">Yetdi: {natija.yetdi} / {natija.jami}</div>
          {natija.yetmadi > 0 && (
            <div className="text-red-300 mt-1">Yetmadi: {natija.yetmadi}</div>
          )}
          {natija.tozalandi > 0 && (
            <div className="text-purple-300 mt-1">
              {natija.tozalandi} ta o'lik ulanish tozalandi (bot bloklangan)
            </div>
          )}
          {natija.xatolar?.length > 0 && (
            <div className="text-[11px] text-purple-400 mt-2 font-mono">
              {natija.xatolar.join(' · ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Qator({ nom, matn, holat }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-purple-800/30 last:border-0">
      <span className="text-sm text-purple-300">{nom}</span>
      <span className={`text-sm font-mono ${holat ? 'text-green-400' : 'text-red-300'}`}>
        {matn ?? (holat ? 'bor' : 'yo\'q')}
      </span>
    </div>
  )
}
