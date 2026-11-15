'use client'

import { useEffect, useRef, useState } from 'react'
import { sanaVaqt } from '@/lib/sana'
import { KURS_SAVOL_SONI, yaqinYakshanba } from '@/lib/kimyo-kurs-test'

const API = '/api/admin/kimyo-0-dan'
const maydon = 'w-full rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] px-3 py-2'
const tugma = 'rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] px-3 py-2 disabled:opacity-50'
const asosiy = 'rounded-lg bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] px-4 py-2 font-semibold disabled:opacity-50'
const holatlar = { qoralama: 'Qoralama', kutilmoqda: 'Rejalashtirilgan', ochiq: 'Ochiq', yopiq: 'Yopilgan' }

function yangiTest(birinchi) {
  return { sarlavha: 'Haftalik test', mavzular: birinchi ? '1–5-mavzular' : '', sana: yaqinYakshanba(), kod: '', savollar: [] }
}

async function sorov(url, tana, signal) {
  const res = await fetch(url, tana
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tana) }
    : { signal })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || 'So‘rov bajarilmadi. Qayta urinib ko‘ring.')
  return data
}

export default function KursBoshqaruvi() {
  const [testlar, setTestlar] = useState(null)
  const [forma, setForma] = useState(null)
  const [tafsilot, setTafsilot] = useState(null)
  const [sahifa, setSahifa] = useState(1)
  const [band, setBand] = useState(false)
  const [xato, setXato] = useState('')
  const [xabar, setXabar] = useState('')
  const [ulashMatni, setUlashMatni] = useState('')
  const [tugatishOchiq, setTugatishOchiq] = useState(false)
  const bandRef = useRef(false)

  useEffect(() => {
    const nazorat = new AbortController()
    sorov(API, null, nazorat.signal).then(d => setTestlar(d.testlar)).catch(e => {
      if (!nazorat.signal.aborted) setXato(e.message)
    })
    return () => nazorat.abort()
  }, [])

  async function bajar(ish) {
    if (bandRef.current) return
    bandRef.current = true
    setBand(true)
    setXato('')
    setXabar('')
    try {
      await ish()
    } catch (e) {
      setXato(e.message)
    } finally {
      bandRef.current = false
      setBand(false)
    }
  }

  async function tanla(id, raqam = 1) {
    const d = await sorov(`${API}?id=${encodeURIComponent(id)}&sahifa=${raqam}`)
    setTafsilot(d)
    setUlashMatni('')
    setTugatishOchiq(false)
    setSahifa(raqam)
    setForma(d.test.holat === 'qoralama' ? d.test : null)
  }

  async function yangila() {
    setTestlar((await sorov(API)).testlar)
  }

  function saqla(e) {
    e.preventDefault()
    return bajar(async () => {
      const { id } = await sorov(API, { ...forma, amal: 'saqlash' })
      await yangila()
      await tanla(id)
      setXabar('Qoralama saqlandi.')
    })
  }

  function nashr() {
    return bajar(async () => {
      const { id } = await sorov(API, { amal: 'nashr', id: tafsilot.test.id })
      await yangila()
      await tanla(id)
      setXabar('Test jadvalga qo‘yildi.')
    })
  }

  function tugat() {
    return bajar(async () => {
      const { id } = await sorov(API, { amal: 'tugatish', id: tafsilot.test.id })
      await yangila()
      await tanla(id)
      setXabar('Test tugatildi. Topshirilgan natijalar saqlandi.')
    })
  }

  function ulash() {
    const test = tafsilot.test
    setTugatishOchiq(false)
    setXabar('')
    setUlashMatni([
      `Kimyo 0 dan kursi · ${test.sarlavha} · ${test.mavzular}`,
      `Test kodi: ${test.kod}`,
      `Ochiq vaqt: ${sanaVaqt(test.ochiladi)} – ${sanaVaqt(test.yopiladi)} (Toshkent)`,
      new URL('/testlar/kimyo-0-dan', window.location.href).href,
    ].join('\n'))
  }

  async function nusxala() {
    setXabar('')
    try {
      await navigator.clipboard.writeText(ulashMatni)
      setXabar('Havola va test kodi nusxalandi.')
    } catch {
      setXabar('Matnni belgilab, qo‘lda nusxalashingiz mumkin.')
    }
  }

  function maydonniYoz(nom, qiymat) {
    setForma(old => ({ ...old, [nom]: qiymat }))
  }

  function savolniYoz(indeks, ozgartir) {
    setForma(old => ({ ...old, savollar: old.savollar.map((s, i) => i === indeks ? ozgartir(s) : s) }))
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Kimyo 0 dan kursi</h1><p className="v3-xira">Yakshanba testlari va natijalar</p></div>
        <button className={asosiy} disabled={band || !testlar} onClick={() => {
          setTafsilot(null); setUlashMatni(''); setTugatishOchiq(false); setXato(''); setXabar(''); setForma(yangiTest(testlar.length === 0))
        }}>Yangi test</button>
      </header>
      {xato && <p role="alert" className="v3-panel-karta p-3">{xato}</p>}
      {xabar && <p role="status">{xabar}</p>}
      <section className="v3-panel-karta space-y-2 p-4">
        <h2 className="font-bold">Haftalar</h2>
        {testlar === null && <button className={tugma} disabled={band} onClick={() => bajar(yangila)}>Ro‘yxatni yangilash</button>}
        {testlar?.length === 0 && <p className="v3-xira">Haftalik test hali yaratilmagan.</p>}
        {testlar?.map(t => (
          <button key={t.id} disabled={band} aria-pressed={tafsilot?.test.id === t.id}
            className={`${tugma} flex w-full flex-wrap items-center justify-between gap-2 text-left`}
            onClick={() => bajar(() => tanla(t.id))}>
            <span>{t.sana} · {t.sarlavha} · {t.mavzular}</span>
            <span className="v3-xira">{holatlar[t.holat]} · {t._count.urinishlar} ta natija</span>
          </button>
        ))}
      </section>

      {forma && (
        <form className="v3-panel-karta space-y-4 p-4 sm:p-5" onSubmit={saqla}>
          <h2 className="text-lg font-bold">Test qoralamasi</h2>
          <fieldset disabled={band} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <label>Yakshanba sanasi<input required type="date" className={maydon} value={forma.sana} onChange={e => maydonniYoz('sana', e.target.value)} /></label>
              <label>Sarlavha<input required maxLength={120} className={maydon} value={forma.sarlavha} onChange={e => maydonniYoz('sarlavha', e.target.value)} /></label>
              <label>Mavzular<input required maxLength={240} className={maydon} placeholder="Masalan, 1–5-mavzular" value={forma.mavzular} onChange={e => maydonniYoz('mavzular', e.target.value)} /></label>
            </div>
            <label className="block max-w-xs">Test kodi
              <input maxLength={24} className={maydon} value={forma.kod ?? ''}
                onChange={e => maydonniYoz('kod', e.target.value.toUpperCase())} />
            </label>
            <p className="v3-xira">Bankda {forma.savollar.length} ta savol. Har urinishga tasodifiy {KURS_SAVOL_SONI} tasi tushadi.</p>
            <p className="v3-xira">Nashr qilingan test yakshanba 00:00 dan dushanba 00:00 gacha ochiq. Toshkent vaqti.</p>
            {forma.savollar.map((s, i) => (
              <div key={i} className="space-y-3 rounded-lg border border-[var(--v3-chiziq)] p-3">
                <label className="block font-semibold">{i + 1}-savol
                  <textarea required rows={2} maxLength={2000} className={maydon} value={s.matn}
                    onChange={e => savolniYoz(i, old => ({ ...old, matn: e.target.value }))} />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {s.variantlar.map((v, j) => (
                    <label key={j}>{'ABCD'[j]} varianti
                      <input required maxLength={600} className={maydon} value={v}
                        onChange={e => savolniYoz(i, old => ({ ...old, variantlar: old.variantlar.map((x, k) => k === j ? e.target.value : x) }))} />
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <label>To‘g‘ri javob
                    <select required className={maydon} value={s.togri ?? ''} onChange={e => savolniYoz(i, old => ({ ...old, togri: e.target.value === '' ? null : Number(e.target.value) }))}>
                      <option value="">Tanlang</option>
                      {s.variantlar.map((_, j) => <option key={j} value={j}>{'ABCD'[j]}</option>)}
                    </select>
                  </label>
                  <button className={tugma} type="button" onClick={() => maydonniYoz('savollar', forma.savollar.filter((_, k) => k !== i))}>Savolni olib tashlash</button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <button className={tugma} type="button" disabled={forma.savollar.length >= 100}
                onClick={() => maydonniYoz('savollar', [...forma.savollar, { matn: '', variantlar: ['', '', '', ''], togri: null }])}>+ Savol qo‘shish</button>
              <button className={asosiy}>Qoralamani saqlash</button>
              <button type="button" className={tugma}
                disabled={!tafsilot?.test.kod || tafsilot.test.savollar.length < KURS_SAVOL_SONI || JSON.stringify(forma) !== JSON.stringify(tafsilot.test)}
                onClick={nashr}>Nashr qilish</button>
            </div>
          </fieldset>
        </form>
      )}

      {tafsilot && (
        <section className="v3-panel-karta space-y-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">{tafsilot.test.sarlavha} · {tafsilot.jami} ta natija</h2>
            <button className={tugma} disabled={band} onClick={() => bajar(() => tanla(tafsilot.test.id, sahifa))}>Natijalarni yangilash</button>
          </div>
          {tafsilot.test.kod && <p>Test kodi <strong className="font-mono">{tafsilot.test.kod}</strong></p>}
          {['ochiq', 'kutilmoqda'].includes(tafsilot.test.holat) && (
            <div className="flex flex-wrap gap-2">
              {tafsilot.test.kod && <button className={tugma} disabled={band}
                aria-expanded={Boolean(ulashMatni)} onClick={() => ulashMatni ? setUlashMatni('') : ulash()}>
                Testni ulashish
              </button>}
              {tafsilot.test.holat === 'ochiq' && <button className={tugma} disabled={band}
                aria-expanded={tugatishOchiq} onClick={() => {
                  setUlashMatni('')
                  setTugatishOchiq(!tugatishOchiq)
                }}>Testni tugatish</button>}
            </div>
          )}
          {ulashMatni && (
            <div className="space-y-2 rounded-lg border border-[var(--v3-chiziq)] p-3">
              <label className="block">Ulashish matni
                <textarea readOnly rows={4} value={ulashMatni} className={maydon} onFocus={e => e.target.select()} />
              </label>
              <button className={asosiy} onClick={nusxala}>Havola va kodni nusxalash</button>
            </div>
          )}
          {tugatishOchiq && (
            <div className="space-y-2 rounded-lg border border-[var(--v3-urgu)] p-3">
              <p>Tasdiqlasangiz, test yopiladi va yangi javoblar qabul qilinmaydi. Topshirilgan natijalar saqlanadi.</p>
              <div className="flex flex-wrap gap-2">
                <button className={asosiy} disabled={band} onClick={tugat}>Tugatishni tasdiqlash</button>
                <button className={tugma} disabled={band} onClick={() => setTugatishOchiq(false)}>Bekor qilish</button>
              </div>
            </div>
          )}
          {tafsilot.test.holat === 'yopiq' && <p className="v3-xira">Yopilgan vaqt: {sanaVaqt(tafsilot.test.yopiladi)}</p>}
          <p className="v3-xira">Topshirish vaqti Toshkent vaqti bilan ko‘rsatiladi.</p>
          {tafsilot.urinishlar.length === 0 && <p>Hali natija yo‘q.</p>}
          {tafsilot.urinishlar.map(r => (
            <details key={r.id} className="rounded-lg border border-[var(--v3-chiziq)] p-3">
              <summary className="cursor-pointer font-semibold">{r.ism} {r.familiya} · {r.ball}/{r.jami} · {sanaVaqt(r.topshirildi)} · {r.xatolar.length} ta xato</summary>
              {r.xatolar.length === 0 ? <p className="mt-2">Barcha javoblar to‘g‘ri.</p> : (
                <ol className="mt-3 space-y-3">
                  {r.xatolar.map(x => <li key={x.tartib}>
                    <p className="font-semibold">{x.tartib}. {x.savol}</p>
                    <p>Tanlangan: {x.tanlangan ?? 'Javob berilmagan'}</p><p>To‘g‘ri javob: {x.togri}</p>
                  </li>)}
                </ol>
              )}
            </details>
          ))}
          {tafsilot.sahifalar > 1 && <div className="flex items-center gap-3">
            <button className={tugma} disabled={band || sahifa <= 1} onClick={() => bajar(() => tanla(tafsilot.test.id, sahifa - 1))}>Oldingi</button>
            <span>{sahifa} / {tafsilot.sahifalar}</span>
            <button className={tugma} disabled={band || sahifa >= tafsilot.sahifalar} onClick={() => bajar(() => tanla(tafsilot.test.id, sahifa + 1))}>Keyingi</button>
          </div>}
        </section>
      )}
    </div>
  )
}
