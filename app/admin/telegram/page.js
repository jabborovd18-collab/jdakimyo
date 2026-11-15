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
    return <div className="p-8 text-[var(--v3-xira)]">Yuklanmoqda...</div>
  }

  const w = holat?.webhook
  const h = holat?.holat
  const k = holat?.kopruk

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-1">Telegram bot</h1>
      <p className="text-sm text-[var(--v3-xira)] mb-5">
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
                : 'bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]'
            }`}
          >
            {nom}
          </button>
        ))}
      </div>

      {bolim === 'statistika' && (
        <>
          <Statistika />
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
      <div className="v3-panel-karta p-5 mb-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">Muhit</h2>
        <Qator nom="Bot tokeni" holat={h?.tokenBor} />
        <Qator nom="Sir kalit" holat={h?.sirBor} />
        <Qator nom="Bot nomi" matn={h?.botNomi ? `@${h.botNomi}` : 'qo\'yilmagan'} holat={Boolean(h?.botNomi)} />
      </div>

      <div className="v3-panel-karta p-5 mb-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">Webhook</h2>
        {!w ? (
          <div className="text-sm text-[var(--v3-xira)]">Token yo&apos;q — holat olinmadi.</div>
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

      {/* PDF xizmati — Render'dagi Python bot bilan bog'lanish.
          Foydalanuvchiga ko'rinadigan xabar ataylab umumiy, sabab esa
          bir nechta bo'lishi mumkin. Shu yerda aniq aytiladi. */}
      <div className="v3-panel-karta p-5 mb-5">
        <h2 className="text-sm font-bold text-yellow-300 mb-3">
          PDF xizmati (ko&apos;prik)
        </h2>
        {!k ? (
          <div className="text-sm text-[var(--v3-xira)]">Holat olinmadi.</div>
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
    } catch (e) {
      toast.error('Xatolik: ' + (e.message || 'server bilan aloqa yo\'q'))
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
    } catch (e) {
      toast.error('Xatolik: ' + (e.message || 'server bilan aloqa yo\'q'))
    } finally {
      setBand(false)
    }
  }

  if (!d) return <div className="text-sm text-[var(--v3-xira)] mb-4">Yuklanmoqda...</div>
  if (!d.success) {
    return (
      <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-5 mb-4 text-sm text-red-200">
        Guruhlar ro&apos;yxati olinmadi.
      </div>
    )
  }

  const j = d.jami || {}

  return (
    <div className="v3-panel-karta p-5 mb-5">
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
        <div className="text-xs text-[var(--v3-xira)] bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] rounded-xl p-3">
          Bot hali hech qaysi guruhga qo&apos;shilmagan. Botni guruhga
          qo&apos;shsangiz, u o&apos;zi ro&apos;yxatga tushadi.
        </div>
      ) : (
        <div className="space-y-2">
          {d.guruhlar.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between gap-3 bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] rounded-xl px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-sm text-white truncate">
                  {g.nom || `Guruh ${g.chatId}`}
                </div>
                <div className="text-[11px] text-[var(--v3-xira)]">
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
                      : 'bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-[var(--v3-xira)]'
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
                      : 'bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-[var(--v3-xira)]'
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

      <p className="text-[11px] text-[var(--v3-xira)] mt-3">
        Bot chiqarilgan guruh yozuvi saqlanadi: qayta qo&apos;shilsa,
        sozlamalari joyida qoladi. Butunlay o&apos;chirish faqat
        chiqarilgan guruhlarga ruxsat etilgan.
      </p>
    </div>
  )
}

/**
 * Botning foydalanuvchi statistikasi.
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
    return <div className="text-sm text-[var(--v3-xira)]">Yuklanmoqda...</div>
  }

  if (d?.sozlanmagan) {
    return (
      <div className="v3-panel-karta p-5 text-sm text-[var(--v3-xira)]">
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

  return (
    <div className="grid grid-cols-2 gap-3">
      <Karta nom="Botdan foydalanganlar" qiymat={h.foydalanuvchilar} belgi="👥" />
      <Karta nom="Bloklangan" qiymat={h.bloklangan} belgi="🚫" />
    </div>
  )
}

function Karta({ nom, qiymat, izoh, belgi }) {
  return (
    <div className="v3-panel-karta p-4">
      <div className="text-2xl mb-1">{belgi}</div>
      <div className="text-2xl font-bold text-white">{qiymat ?? 0}</div>
      <div className="text-[11px] text-[var(--v3-xira)]">{nom}</div>
      {izoh ? <div className="text-[10px] text-[var(--v3-xira)] mt-1">{izoh}</div> : null}
    </div>
  )
}

/**
 * Botga ulangan foydalanuvchilar.
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
    <div className="v3-panel-karta p-5">
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <h2 className="text-sm font-bold text-yellow-300">
          Ulangan foydalanuvchilar {d ? `(${d.jami} ta)` : ''}
        </h2>
        {d ? (
          <span className="text-xs text-[var(--v3-xira)]">
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
        className="v3-kiritish w-full mb-4 text-sm"
      />

      {yuklanmoqda && !d ? (
        <div className="text-sm text-[var(--v3-xira)]">Yuklanmoqda...</div>
      ) : !d?.foydalanuvchilar?.length ? (
        <div className="text-sm text-[var(--v3-xira)]">
          {qidiruv ? 'Hech kim topilmadi.' : 'Hali hech kim botga ulanmagan.'}
        </div>
      ) : (
        <div className="space-y-2">
          {d.foydalanuvchilar.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] px-3 py-2.5"
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
                <div className="text-[11px] text-[var(--v3-xira)] truncate">
                  @{f.username} · {f.tgUsername ? `TG @${f.tgUsername}` : `chatId ${f.chatId}`}
                  {' · '}
                  {new Date(f.bogladi).toLocaleDateString('uz-UZ')}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="text-amber-300 font-bold">🪙 {f.coins}</span>
                <span className={f.xabarlar ? 'text-green-400' : 'text-[var(--v3-xira)]'}>
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
            className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
          >
            ← Oldingi
          </button>
          <span className="text-xs text-[var(--v3-xira)]">
            {d.sahifa} / {d.sahifalar}
          </span>
          <button
            onClick={() => setSahifa((s) => Math.min(d.sahifalar, s + 1))}
            disabled={sahifa >= d.sahifalar}
            className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
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
    <div className="v3-panel-karta p-5 mt-6">
      <h2 className="text-sm font-bold text-yellow-300 mb-1">Kunlik iqtibos</h2>
      <p className="text-xs text-[var(--v3-xira)] mb-4">
        Har kuni ertalab (Toshkent 08:00) guruhlarga yuboriladi.
        Bazada {d.gaplar.jami} ta gap, {d.gaplar.faol} tasi faol.
      </p>

      <div className="bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] rounded-xl p-4 mb-4">
        <div className="text-[11px] text-[var(--v3-xira)] mb-2">
          Bugun ketadi — {MANBA[d.iqtibos.manba] || d.iqtibos.manba}
        </div>
        <div className="text-sm text-white italic leading-relaxed">
          {d.iqtibos.icon} {d.iqtibos.textUz}
        </div>
        <div className="text-xs text-[var(--v3-xira)] mt-2">— {d.iqtibos.author}</div>
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
        className="v3-tugma v3-tugma-asosiy text-sm disabled:opacity-40"
      >
        {band ? 'Yuborilmoqda...' : 'Bugungi iqtibosni hozir yuborish'}
      </button>
      <div className="text-[11px] text-[var(--v3-xira)] mt-2">
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
    <div className="v3-panel-karta p-5 mt-6">
      <h2 className="text-sm font-bold text-yellow-300 mb-1">E'lon yuborish</h2>
      <p className="text-xs text-[var(--v3-xira)] mb-4">
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
        className="v3-kiritish w-full text-sm resize-y"
      />
      <div className={`text-[11px] mt-1 ${oshdi ? 'text-red-400' : 'text-[var(--v3-xira)]'}`}>
        {matn.length} / {chegara}
        {rasm ? ' (rasm bilan chegara qisqaroq)' : ''}
      </div>

      <div className="mt-4">
        {rasm ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rasm.url} alt="" className="w-24 h-24 object-cover rounded-xl border border-[var(--v3-chiziq)]" />
            <div className="text-xs text-[var(--v3-xira)]">
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
          <label className="v3-tugma text-sm cursor-pointer">
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
          className="v3-kiritish text-sm"
        />
        <input
          value={havolaMatn}
          onChange={(e) => setHavolaMatn(e.target.value)}
          placeholder="Tugma yozuvi (sukut: Saytda ochish)"
          className="v3-kiritish text-sm"
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
              className="v3-tugma text-sm"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {natija && (
        <div className="mt-4 bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] rounded-xl p-4 text-sm">
          <div className="text-green-400">Yetdi: {natija.yetdi} / {natija.jami}</div>
          {natija.yetmadi > 0 && (
            <div className="text-red-300 mt-1">Yetmadi: {natija.yetmadi}</div>
          )}
          {natija.tozalandi > 0 && (
            <div className="text-[var(--v3-xira)] mt-1">
              {natija.tozalandi} ta o'lik ulanish tozalandi (bot bloklangan)
            </div>
          )}
          {natija.xatolar?.length > 0 && (
            <div className="text-[11px] text-[var(--v3-xira)] mt-2 font-mono">
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
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[var(--v3-chiziq)] last:border-0">
      <span className="text-sm text-[var(--v3-xira)]">{nom}</span>
      <span className={`text-sm font-mono ${holat ? 'text-green-400' : 'text-red-300'}`}>
        {matn ?? (holat ? 'bor' : 'yo\'q')}
      </span>
    </div>
  )
}
