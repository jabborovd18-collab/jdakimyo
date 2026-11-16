'use client'

import Link from 'next/link'
import Ikon from '@/components/Ikon'
import styles from '../oyin-umumiy.module.css'

export async function oyinApiPost(manzil, tana) {
  const javob = await fetch(manzil, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tana),
  })
  const malumot = await javob.json().catch(() => ({}))
  if (!javob.ok || !malumot.ok) {
    throw new Error(malumot.xato || 'Server bilan bog‘lanishda xatolik yuz berdi.')
  }
  return malumot
}

export function darajaTop(natija, duel) {
  if (!natija) return 'Yosh Kimyogar'
  if (duel) {
    const ball = Math.max(natija.p1?.ball || 0, natija.p2?.ball || 0)
    if (ball >= 700) return 'Olimpiada Chempioni'
    if (ball >= 420) return 'Reaksiya Ustasi'
    if (ball >= 220) return 'Tadqiqotchi'
    return 'Duel Ishtirokchisi'
  }
  const p = natija.p1 || {}
  const aniqlik = p.togri + p.xato > 0 ? Math.round((p.togri / (p.togri + p.xato)) * 100) : 0
  if (p.ball >= 650 && aniqlik >= 85) return 'Kimyo Akademigi'
  if (p.ball >= 400 && aniqlik >= 70) return 'Laboratoriya Masteri'
  if (p.ball >= 200) return 'Tajribali Tadqiqotchi'
  return 'Yosh Kimyogar'
}

export function vaqtFormat(ms) {
  if (!ms || ms <= 0) return '00:00'
  const soniya = Math.ceil(ms / 1000)
  const daqiqa = Math.floor(soniya / 60)
  const qoldiq = soniya % 60
  return `${String(daqiqa).padStart(2, '0')}:${String(qoldiq).padStart(2, '0')}`
}

export function OyinSarlavha({
  nomi,
  izoh,
  ovozYoqilgan,
  ovozAlmashtir,
  qaytishManzili = '/oyinlar',
  amallar = null,
}) {
  return (
    <header className={styles.sarlavha}>
      <div className={styles.sarlavhaChap}>
        <Link href={qaytishManzili} className="v3-ikon-tugma" aria-label="O‘yinlar ro‘yxatiga qaytish">
          <Ikon nom="chap" olcham={18} />
        </Link>
        <div className={styles.sarlavhaMatn}>
          <h1 className={styles.sarlavhaNom}>{nomi}</h1>
          {izoh ? <p className={styles.sarlavhaIzoh}>{izoh}</p> : null}
        </div>
      </div>

      <div className={styles.amallar}>
        <button
          type="button"
          className={styles.tugma}
          onClick={ovozAlmashtir}
          aria-pressed={ovozYoqilgan}
          title={ovozYoqilgan ? 'Ovoz effektlarini o‘chirish' : 'Ovoz effektlarini yoqish'}
        >
          <Ikon nom="ovoz" olcham={16} />
          <span>{ovozYoqilgan ? 'Ovoz yoqilgan' : 'Ovoz o‘chiq'}</span>
        </button>
        {amallar}
      </div>
    </header>
  )
}

export function UstunlikBar({ p1Ism, p1Ball, p2Ism, p2Ball }) {
  const jami = Math.max(1, (p1Ball || 0) + (p2Ball || 0))
  const chapFoiz = p1Ball === p2Ball ? 50 : Math.min(88, Math.max(12, Math.round(((p1Ball || 0) / jami) * 100)))
  const ongFoiz = 100 - chapFoiz

  return (
    <div className={styles.ustunlikQobiq} aria-label="1v1 ustunlik shkalasi">
      <div className={styles.ustunlikMatn}>
        <span>{p1Ism}: {p1Ball} ball</span>
        <span>{p2Ism}: {p2Ball} ball</span>
      </div>
      <div className={styles.ustunlikChiziq}>
        <div className={styles.ustunlikChap} style={{ width: `${chapFoiz}%` }} />
        <div className={styles.ustunlikOng} style={{ width: `${ongFoiz}%` }} />
      </div>
    </div>
  )
}

export function YakunPanel({
  natija,
  duel,
  yakunSabab = '',
  qaytaBoshlash,
  sozlamagaQaytish,
}) {
  if (!natija) return null
  const unvon = darajaTop(natija, duel)
  const p1 = natija.p1 || {}
  const p2 = natija.p2 || {}
  const golib = natija.golib

  const sarlavhaMatn = duel
    ? golib === 'durang'
      ? 'Durang natija!'
      : `${golib === 'p1' ? p1.ism : p2.ism} g‘alaba qozondi!`
    : 'Natijalar yakuni'

  const statistikQator = (oyinchi) => {
    const jami = (oyinchi.togri || 0) + (oyinchi.xato || 0)
    const aniqlik = jami > 0 ? Math.round(((oyinchi.togri || 0) / jami) * 100) : 0
    const ortacha = oyinchi.ortachaVaqtMs
      ? `${(oyinchi.ortachaVaqtMs / 1000).toFixed(1)} s`
      : '—'
    return (
      <>
        <div style={{ fontSize: '1.75rem', fontWeight: 850 }}>{oyinchi.ball ?? 0} ball</div>
        <div style={{ fontSize: '.9rem', color: 'var(--v3-xira)' }}>
          To‘g‘ri: {oyinchi.togri ?? 0} · Xato: {oyinchi.xato ?? 0} · Aniqlik: {aniqlik}%
        </div>
        <div style={{ fontSize: '.86rem', color: 'var(--v3-xira)' }}>
          Eng uzun seriya: ×{oyinchi.engUzunSeriya ?? 0} · O‘rtacha tezlik: {ortacha}
        </div>
      </>
    )
  }

  return (
    <section className={styles.yakunKarta} aria-label="O‘yin yakuni">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <span className={styles.oltinYorliq}>
            <Ikon nom="toj" olcham={15} /> {unvon}
          </span>
          <h2 style={{ margin: '10px 0 4px', fontSize: 'clamp(1.35rem, 2.6vw, 1.9rem)', fontWeight: 850 }}>
            {sarlavhaMatn}
          </h2>
          {yakunSabab ? <p style={{ margin: 0, color: 'var(--v3-xira)' }}>{yakunSabab}</p> : null}
        </div>
        <Ikon nom="kubok" olcham={42} />
      </div>

      <div className={styles.yakunGrid}>
        <article className={styles.oyinchiYakun} data-golib={String(!duel || golib === 'p1')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{p1.ism || '1-o‘yinchi'}</strong>
            {duel && golib === 'p1' ? <span className={styles.oltinYorliq}>G‘olib</span> : null}
          </div>
          {statistikQator(p1)}
        </article>

        {duel ? (
          <article className={styles.oyinchiYakun} data-golib={String(golib === 'p2')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{p2.ism || '2-o‘yinchi'}</strong>
              {golib === 'p2' ? <span className={styles.oltinYorliq}>G‘olib</span> : null}
            </div>
            {statistikQator(p2)}
          </article>
        ) : null}
      </div>

      <div className={styles.amallar}>
        <button type="button" className={styles.asosiy} onClick={qaytaBoshlash}>
          <Ikon nom="qayta" olcham={17} /> Qayta o‘ynash
        </button>
        <button type="button" className={styles.tugma} onClick={sozlamagaQaytish}>
          <Ikon nom="sozlama" olcham={17} /> Sozlamalarga qaytish
        </button>
        <Link href="/oyinlar" className={styles.tugma}>
          <Ikon nom="chap" olcham={17} /> O‘yinlar katalogi
        </Link>
      </div>
    </section>
  )
}
