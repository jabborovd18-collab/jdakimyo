'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useFon } from '@/components/FonTanlagich'
import { sana, sanaVaqt } from '@/lib/sana'
import { KURS_SAVOL_SONI } from '@/lib/kimyo-kurs-test'

const API = '/api/testlar/kimyo-0-dan'
const maydon = 'w-full min-h-12 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] px-3 py-2 text-base'
const tugma = 'min-h-12 rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] px-4 py-2 font-semibold disabled:opacity-50'
const oddiy = 'min-h-12 rounded-xl border border-[var(--v3-chiziq)] px-4 py-2 font-semibold disabled:opacity-50'

async function sorov(tana, signal) {
  const res = await fetch(API, tana
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tana) }
    : { signal })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || 'So‘rov bajarilmadi. Qayta urinib ko‘ring.')
  return data
}

export default function KursTest() {
  const [fon] = useFon()
  const [jadval, setJadval] = useState(null)
  const [ism, setIsm] = useState('')
  const [kod, setKod] = useState('')
  const [test, setTest] = useState(null)
  const [indeks, setIndeks] = useState(0)
  const [javoblar, setJavoblar] = useState([])
  const [natija, setNatija] = useState(null)
  const [band, setBand] = useState(false)
  const [xato, setXato] = useState('')
  const sorovBand = useRef(false)
  const savolSarlavhasi = useRef(null)

  useEffect(() => {
    const nazorat = new AbortController()
    sorov(null, nazorat.signal).then(setJadval).catch(e => {
      if (!nazorat.signal.aborted) setXato(e.message)
    })
    return () => nazorat.abort()
  }, [])

  useEffect(() => { savolSarlavhasi.current?.focus() }, [indeks, test])

  async function bajar(ish) {
    if (sorovBand.current) return
    sorovBand.current = true
    setBand(true)
    setXato('')
    try {
      await ish()
    } catch (e) {
      setXato(e.message)
    } finally {
      sorovBand.current = false
      setBand(false)
    }
  }

  function boshla(e) {
    e.preventDefault()
    return bajar(async () => {
      const keyingi = await sorov({ amal: 'boshlash', ism, kod })
      setJavoblar(keyingi.savollar.map(() => null))
      setTest(keyingi)
    })
  }

  function topshir() {
    return bajar(async () => {
      const hisob = await sorov({ amal: 'topshirish', token: test.token, javoblar })
      setNatija(hisob)
      window.scrollTo(0, 0)
    })
  }

  const savol = test?.savollar[indeks]
  const jami = test?.savollar.length ?? KURS_SAVOL_SONI
  const javobBerilgan = javoblar.filter(j => j !== null).length
  const javobsiz = javoblar.indexOf(null)

  return (
    <main data-fon={fon} className="v3 min-h-screen">
      <div className="v3-konteyner max-w-xl space-y-4 py-5">
        <Link href="/testlar" className="v3-xira">← Testlar markazi</Link>
        <header>
          <h1 className="text-2xl font-bold sm:text-3xl">Kimyo 0 dan kursi</h1>
          <p className="v3-xira mt-1">{test?.mavzular ?? 'Yakshanba · haftalik nazorat'}</p>
        </header>
        {xato && <p role="alert" className="v3-panel-karta p-3">{xato}</p>}

        {natija ? (
          <section className="v3-panel-karta space-y-4 p-4 sm:p-5">
            <div aria-live="polite">
              <h2 className="text-xl font-bold">Test natijasi</h2>
              <p>{ism.trim()}</p>
              <p className="text-3xl font-bold">{natija.ball} / {natija.jami}</p>
              <p className="v3-xira">{sanaVaqt(natija.topshirildi)} · Toshkent vaqti</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold">Xato javoblar · {natija.xatolar.length} ta</h3>
              {natija.xatolar.length === 0 && <p>Barcha javoblar to‘g‘ri.</p>}
              {natija.xatolar.map(x => (
                <article key={x.tartib} className="space-y-1 rounded-xl border border-[var(--v3-chiziq)] p-3">
                  <h4 className="font-semibold">{x.tartib}. {x.savol}</h4>
                  <p>Sizning javobingiz: {x.tanlangan}</p>
                  <p>To‘g‘ri javob: <strong>{x.togri}</strong></p>
                </article>
              ))}
            </div>
          </section>
        ) : savol ? (
          <section className="v3-panel-karta space-y-4 p-4 sm:p-5">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span>Savol {indeks + 1} / {jami}</span>
              <span className="v3-xira">Belgilangan {javobBerilgan} / {jami}</span>
            </div>
            <progress aria-label="Belgilangan savollar" max={jami} value={javobBerilgan} className="w-full accent-[var(--v3-urgu)]" />
            <h2 ref={savolSarlavhasi} tabIndex={-1} className="text-xl font-bold focus:outline-none">{savol.matn}</h2>
            <fieldset aria-label="Javob variantlari" disabled={band} className="space-y-2">
              {savol.variantlar.map((variant, j) => (
                <label key={j} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[var(--v3-chiziq)] p-3 has-[:checked]:border-[var(--v3-urgu)] has-[:checked]:bg-[var(--v3-yuza-2)]">
                  <input type="radio" name={`savol-${indeks}`} checked={javoblar[indeks] === j}
                    className="h-5 w-5 shrink-0 accent-[var(--v3-urgu)]"
                    onChange={() => setJavoblar(old => old.map((v, k) => k === indeks ? j : v))} />
                  <span><strong>{'ABCD'[j]}.</strong> {variant}</span>
                </label>
              ))}
            </fieldset>
            <div className="grid grid-cols-2 gap-2">
              <button className={oddiy} disabled={band || indeks === 0} onClick={() => setIndeks(indeks - 1)}>Oldingi</button>
              {indeks < jami - 1 ? (
                <button className={tugma} disabled={band} onClick={() => setIndeks(indeks + 1)}>Keyingi</button>
              ) : javobsiz !== -1 ? (
                <button className={tugma} disabled={band} onClick={() => setIndeks(javobsiz)}>Javobsiz savolga o‘tish</button>
              ) : (
                <button className={tugma} disabled={band} onClick={topshir}>{band ? 'Saqlanmoqda…' : 'Testni topshirish'}</button>
              )}
            </div>
          </section>
        ) : jadval?.ochiq ? (
          <form className="v3-panel-karta space-y-4 p-4 sm:p-5" onSubmit={boshla}>
            <div>
              <h2 className="text-xl font-bold">{jadval.ochiq.sarlavha}</h2>
              <p className="v3-xira">{jadval.ochiq.mavzular} · {jami} ta savol</p>
            </div>
            <label className="block space-y-1"><span>Ismingiz</span>
              <input required maxLength={80} autoComplete="name" className={maydon} value={ism} onChange={e => setIsm(e.target.value)} />
            </label>
            <label className="block space-y-1"><span>Test kodi</span>
              <input required minLength={4} maxLength={24} autoComplete="off" autoCapitalize="characters" spellCheck={false}
                className={maydon} value={kod} onChange={e => setKod(e.target.value.toUpperCase())} />
            </label>
            <button className={`${tugma} w-full`} disabled={band}>{band ? 'Ochilyapti…' : 'Testni boshlash'}</button>
          </form>
        ) : jadval || xato ? (
          <section className="v3-panel-karta space-y-2 p-5">
            {jadval && <h2 className="font-bold">Hozir ochiq test yo‘q</h2>}
            {jadval?.keyingi && <>
              <p>{jadval.keyingi.sarlavha} · {jadval.keyingi.mavzular}</p>
              <p className="v3-xira">Keyingi test {sana(jadval.keyingi.ochiladi)}, yakshanba kuni ochiladi.</p>
            </>}
            <button className={oddiy} disabled={band} onClick={() => bajar(async () => setJadval(await sorov()))}>Yangilash</button>
          </section>
        ) : <p role="status">Yuklanmoqda…</p>}
      </div>
    </main>
  )
}
