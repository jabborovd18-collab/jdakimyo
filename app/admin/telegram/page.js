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
import { useState, useEffect } from 'react'
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

      {bolim === 'odamlar' && <Foydalanuvchilar />}
      {bolim === 'guruhlar' && <Iqtibos ishlaydi={Boolean(h?.tokenBor)} />}
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

  async function almashtir(g) {
    try {
      const res = await fetch('/api/admin/telegram/iqtibos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: g.id, iqtiboslar: !g.iqtiboslar }),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      toast.success(data.message)
      await ol()
    } catch (e) {
      toast.error('Xatolik: ' + e.message)
    }
  }

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

      <div className="mb-4">
        <div className="text-xs font-semibold text-purple-200 mb-2">
          Guruhlar ({d.guruhlar.length} ta)
        </div>
        {d.guruhlar.length === 0 ? (
          <div className="text-xs text-purple-400 bg-purple-950/40 rounded-xl p-3">
            Bot hali hech qaysi guruhga qo'shilmagan. Botni guruhga qo'shsangiz,
            u o'zi ro'yxatga tushadi va har kuni iqtibos yuboradi.
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
                    {g.qoshgan ? `${g.qoshgan} qo'shgan · ` : ''}
                    {g.faol ? 'bot ichida' : 'bot chiqarilgan'}
                  </div>
                </div>
                <button
                  onClick={() => almashtir(g)}
                  disabled={!g.faol}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 disabled:opacity-40 transition-all ${
                    g.iqtiboslar
                      ? 'bg-green-600/20 border border-green-600/40 text-green-300'
                      : 'bg-slate-700/30 border border-slate-600/50 text-slate-400'
                  }`}
                >
                  {g.iqtiboslar ? 'Yoqilgan' : "O'chirilgan"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
            <a href="/profil/telegram" className="underline hover:text-amber-200">
              Sozlamalar → Telegram
            </a>{' '}
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
