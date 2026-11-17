'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Ikon from '@/components/Ikon'
import LatexBoyMatn from '@/components/LatexBoyMatn'
import { KK_DUEL_SAVOLLAR } from '@/data/oyinlar/kk-savollar-duel'
import { sfxChal } from '@/lib/oyinlar/sfx'
import styles from './duel.module.css'

const HARFLAR = ['A', 'B', 'C', 'D']
const DUEL_VAQT_SONIYA = 180
const AVTO_OTISH_MS = 360

function royxatAralashtir(massiv) {
  const nusxa = [...massiv]
  for (let i = nusxa.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const vaqtincha = nusxa[i]
    nusxa[i] = nusxa[j]
    nusxa[j] = vaqtincha
  }
  return nusxa
}

function savolTayyorla(savol) {
  const tartib = royxatAralashtir([0, 1, 2, 3])
  return {
    id: savol.id,
    modul: savol.modul,
    matn: savol.matn,
    variantlar: tartib.map((aslIdx) => savol.variantlar[aslIdx]),
    togriIndeks: tartib.indexOf(savol.togriIndeks),
  }
}

function yangiSavolNavbati(oldingiOxirgiId = null) {
  const aralashtirilgan = royxatAralashtir(KK_DUEL_SAVOLLAR)
  if (aralashtirilgan.length > 1 && aralashtirilgan[0].id === oldingiOxirgiId) {
    const birinchi = aralashtirilgan.shift()
    aralashtirilgan.push(birinchi)
  }
  return aralashtirilgan.map(savolTayyorla)
}

function boshlangichOyinchi(standartIsm) {
  const navbat = yangiSavolNavbati()
  return {
    ism: standartIsm,
    ball: 0,
    togriSoni: 0,
    xatoSoni: 0,
    navbat,
    indeks: 0,
    joriySavol: navbat[0],
    tanlov: null, // { indeks, togrimi }
  }
}

function vaqtFormatla(soniya) {
  const s = Math.max(0, Math.ceil(Number(soniya) || 0))
  const daq = Math.floor(s / 60)
  const qoldiq = s % 60
  return `${String(daq).padStart(2, '0')}:${String(qoldiq).padStart(2, '0')}`
}

function ballFormatla(ball) {
  const yaxlit = Math.round(ball * 10) / 10
  return Number.isInteger(yaxlit) ? String(yaxlit) : yaxlit.toFixed(1)
}

export default function KalloidDuelOyini() {
  const sahifaRef = useRef(null)
  const [holat, setHolat] = useState('tayyor') // 'tayyor' | 'oyin' | 'yakun'
  const [qolganSoniya, setQolganSoniya] = useState(DUEL_VAQT_SONIYA)
  const [ovoz, setOvoz] = useState(true)
  const [toliqEkran, setToliqEkran] = useState(false)

  const [p1, setP1] = useState(() => boshlangichOyinchi('1-ishtirokchi'))
  const [p2, setP2] = useState(() => boshlangichOyinchi('2-ishtirokchi'))

  const tugashMsRef = useRef(0)
  const p1TimerRef = useRef(null)
  const p2TimerRef = useRef(null)

  const tozalashTimerlar = useCallback(() => {
    if (p1TimerRef.current) {
      clearTimeout(p1TimerRef.current)
      p1TimerRef.current = null
    }
    if (p2TimerRef.current) {
      clearTimeout(p2TimerRef.current)
      p2TimerRef.current = null
    }
  }, [])

  useEffect(() => () => tozalashTimerlar(), [tozalashTimerlar])

  useEffect(() => {
    const kuzat = () => setToliqEkran(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', kuzat)
    return () => document.removeEventListener('fullscreenchange', kuzat)
  }, [])

  const toliqEkranniAlmashtir = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setToliqEkran(false)
      } else if (sahifaRef.current?.requestFullscreen) {
        await sahifaRef.current.requestFullscreen()
        setToliqEkran(true)
      } else {
        setToliqEkran((v) => !v)
      }
    } catch {
      setToliqEkran((v) => !v)
    }
  }

  const duelniBoshlash = () => {
    tozalashTimerlar()
    setP1((eski) => ({
      ...boshlangichOyinchi(eski.ism.trim() || '1-ishtirokchi'),
    }))
    setP2((eski) => ({
      ...boshlangichOyinchi(eski.ism.trim() || '2-ishtirokchi'),
    }))
    setQolganSoniya(DUEL_VAQT_SONIYA)
    tugashMsRef.current = Date.now() + DUEL_VAQT_SONIYA * 1000
    setHolat('oyin')
    sfxChal('boshlash', ovoz)
  }

  useEffect(() => {
    if (holat !== 'oyin') return undefined
    const interval = setInterval(() => {
      const qoldi = Math.max(0, Math.ceil((tugashMsRef.current - Date.now()) / 1000))
      setQolganSoniya(qoldi)
      if (qoldi <= 0) {
        clearInterval(interval)
        tozalashTimerlar()
        setHolat('yakun')
        sfxChal('galaba', ovoz)
      }
    }, 250)
    return () => clearInterval(interval)
  }, [holat, ovoz, tozalashTimerlar])

  const keyingiSavolgaOt = (eski) => {
    let yangiIndeks = eski.indeks + 1
    let yangiNavbat = eski.navbat
    if (yangiIndeks >= yangiNavbat.length) {
      yangiNavbat = yangiSavolNavbati(eski.joriySavol?.id)
      yangiIndeks = 0
    }
    return {
      ...eski,
      navbat: yangiNavbat,
      indeks: yangiIndeks,
      joriySavol: yangiNavbat[yangiIndeks],
      tanlov: null,
    }
  }

  const variantBosildi = (oyinchiRaqam, variantIndeks) => {
    if (holat !== 'oyin') return
    const setter = oyinchiRaqam === 1 ? setP1 : setP2
    const timerRef = oyinchiRaqam === 1 ? p1TimerRef : p2TimerRef

    setter((eski) => {
      if (eski.tanlov !== null || !eski.joriySavol) return eski
      const togrimi = variantIndeks === eski.joriySavol.togriIndeks
      const yangiBall = Math.round((eski.ball + (togrimi ? 1 : -0.5)) * 10) / 10

      sfxChal(togrimi ? 'togri' : 'xato', ovoz)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setter((joriy) => keyingiSavolgaOt(joriy))
      }, AVTO_OTISH_MS)

      return {
        ...eski,
        ball: yangiBall,
        togriSoni: eski.togriSoni + (togrimi ? 1 : 0),
        xatoSoni: eski.xatoSoni + (togrimi ? 0 : 1),
        tanlov: { indeks: variantIndeks, togrimi },
      }
    })
  }

  const golibKim =
    p1.ball > p2.ball ? 1 : p2.ball > p1.ball ? 2 : 0

  return (
    <main
      ref={sahifaRef}
      data-fon="tun"
      className={`v3 ${styles.sahifa} ${toliqEkran ? styles.toliqEkran : ''}`}
    >
      <header className={styles.tepaPanel}>
        <div className={styles.tepaChap}>
          {!toliqEkran && (
            <Link href="/oyinlar" className="v3-ikon-tugma" aria-label="O‘yinlar ro‘yxatiga qaytish">
              <Ikon nom="chap" olcham={18} />
            </Link>
          )}
          <div>
            <span className={styles.kichikYorliq}>KK_M1–KK_M5 · 50 ta savol · +1 / −0.5 ball</span>
            <h1 className={styles.sarlavha}>Kolloid kimyo · 1v1 Doska dueli</h1>
          </div>
        </div>

        <div className={styles.markazVaqt}>
          <div
            className={`${styles.vaqtQuti} ${
              qolganSoniya <= 20 ? styles.vaqtXavf : qolganSoniya <= 45 ? styles.vaqtOgoh : ''
            }`}
          >
            <Ikon nom="soat" olcham={18} />
            <span>{vaqtFormatla(qolganSoniya)}</span>
          </div>

          {holat === 'oyin' ? (
            <button type="button" onClick={duelniBoshlash} className={styles.ikkinchiTugma}>
              <Ikon nom="qayta" olcham={16} />
              <span>Qayta boshlash</span>
            </button>
          ) : (
            <button type="button" onClick={duelniBoshlash} className={styles.boshlashTugma}>
              <Ikon nom="chaqmoq" olcham={17} />
              <span>{holat === 'yakun' ? 'Yana o‘ynash (180 s)' : 'Duelni boshlash (180 s)'}</span>
            </button>
          )}
        </div>

        <div className={styles.tepaOng}>
          <button
            type="button"
            onClick={() => setOvoz((v) => !v)}
            className={styles.ikkinchiTugma}
            title={ovoz ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}
          >
            <Ikon nom={ovoz ? 'ovoz' : 'ovozOchiq'} olcham={16} />
          </button>
          <button
            type="button"
            onClick={toliqEkranniAlmashtir}
            className={styles.ikkinchiTugma}
          >
            <Ikon nom={toliqEkran ? 'kichraytirish' : 'kengaytirish'} olcham={16} />
            <span>{toliqEkran ? 'Oddiy ekran' : 'To‘liq ekran'}</span>
          </button>
        </div>
      </header>

      {holat === 'yakun' && (
        <section className={styles.yakunBanner} aria-live="polite">
          <div className={styles.yakunIchki}>
            <span className={styles.yakunNishon}>180 SONIYA YAKUNLANDI</span>
            <h2 className={styles.yakunSarlavha}>
              {golibKim === 1
                ? `🏆 ${p1.ism} g‘olib bo‘ldi!`
                : golibKim === 2
                  ? `🏆 ${p2.ism} g‘olib bo‘ldi!`
                  : '🤝 Jangovar durang!'}
            </h2>
            <p className={styles.yakunHisob}>
              <strong>{p1.ism}: {ballFormatla(p1.ball)} ball</strong> ({p1.togriSoni} ta to‘g‘ri, {p1.xatoSoni} ta xato)
              {' · '}
              <strong>{p2.ism}: {ballFormatla(p2.ball)} ball</strong> ({p2.togriSoni} ta to‘g‘ri, {p2.xatoSoni} ta xato)
            </p>
            <button type="button" onClick={duelniBoshlash} className={styles.boshlashTugma}>
              <Ikon nom="qayta" olcham={17} />
              Yangi duel boshlash (180 s)
            </button>
          </div>
        </section>
      )}

      <section className={styles.ikkiDoska} aria-label="Ikki o‘yinchilik doska">
        {[
          { raqam: 1, data: p1, setData: setP1, rangKlass: styles.chapTomon },
          { raqam: 2, data: p2, setData: setP2, rangKlass: styles.ongTomon },
        ].map(({ raqam, data, setData, rangKlass }) => {
          const savol = data.joriySavol
          const tanlov = data.tanlov

          return (
            <div key={raqam} className={`${styles.oyinchiQism} ${rangKlass}`}>
              <div className={styles.oyinchiTepa}>
                <div className={styles.ismQuti}>
                  <span className={styles.oyinchiRaqam}>{raqam}</span>
                  <input
                    type="text"
                    value={data.ism}
                    maxLength={22}
                    disabled={holat === 'oyin'}
                    onChange={(e) =>
                      setData((eski) => ({ ...eski, ism: e.target.value }))
                    }
                    className={styles.ismInput}
                    aria-label={`${raqam}-ishtirokchi ismi`}
                  />
                </div>

                <div className={styles.statQator}>
                  <span className={styles.togriPill} title="To‘g‘ri javoblar (+1)">
                    ✓ {data.togriSoni}
                  </span>
                  <span className={styles.xatoPill} title="Noto‘g‘ri javoblar (-0.5)">
                    ✕ {data.xatoSoni}
                  </span>
                  <div className={styles.ballQuti}>
                    <span className={styles.ballYorliq}>BALL</span>
                    <strong className={styles.ballQiymat}>{ballFormatla(data.ball)}</strong>
                  </div>
                </div>
              </div>

              {holat === 'tayyor' ? (
                <div className={styles.kutishKarta}>
                  <div className={styles.qoidaBelgilar}>
                    <span className={styles.qoidaYashil}>To‘g‘ri javob: +1 ball</span>
                    <span className={styles.qoidaQizil}>Xato javob: −0.5 ball</span>
                  </div>
                  <p className={styles.kutishMatn}>
                    Har bir ishtirokchiga <strong>50 ta kolloid kimyo savolidan</strong> alohida tasodifiy savol chiqadi. Javob bosilishi bilan yashil yoki qizil yonib, avtomatik keyingi savolga o‘tadi!
                  </p>
                  <button type="button" onClick={duelniBoshlash} className={styles.boshlashTugma}>
                    <Ikon nom="chaqmoq" olcham={18} />
                    Boshlash (180 soniya)
                  </button>
                </div>
              ) : savol ? (
                <div className={styles.savolMaydoni}>
                  <div className={styles.savolTepa}>
                    <span className={styles.modulBadge}>{savol.modul}</span>
                    {tanlov && (
                      <span
                        className={
                          tanlov.togrimi ? styles.natijaPopYashil : styles.natijaPopQizil
                        }
                      >
                        {tanlov.togrimi ? 'To‘g‘ri! +1' : 'Xato! −0.5'}
                      </span>
                    )}
                  </div>

                  <div className={styles.savolMatn}>
                    <LatexBoyMatn matn={savol.matn} />
                  </div>

                  <div className={styles.variantlarTor}>
                    {savol.variantlar.map((matn, idx) => {
                      const bosilganShu = tanlov?.indeks === idx
                      const holatKlass = bosilganShu
                        ? tanlov.togrimi
                          ? styles.variantTogri
                          : styles.variantXato
                        : ''

                      return (
                        <button
                          key={`${savol.id}-${idx}`}
                          type="button"
                          disabled={holat !== 'oyin' || tanlov !== null}
                          onClick={() => variantBosildi(raqam, idx)}
                          className={`${styles.variantTugma} ${holatKlass}`}
                        >
                          <span className={styles.harfDoira}>{HARFLAR[idx]}</span>
                          <span className={styles.variantMatn}>
                            <LatexBoyMatn matn={matn} />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </section>
    </main>
  )
}
