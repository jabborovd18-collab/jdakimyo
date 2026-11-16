'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import Ikon from '@/components/Ikon'
import { sfxChal } from '@/lib/oyinlar/sfx'
import {
  OyinSarlavha,
  UstunlikBar,
  YakunPanel,
  oyinApiPost,
  vaqtFormat,
} from '../_umumiy/OyinQobiq'
import umumiy from '../oyin-umumiy.module.css'
import styles from './balans.module.css'

function hisoblaAtomTarozini(savol, chapK, ongK) {
  const chap = {}
  const ong = {}
  savol.chap.forEach((q, idx) => {
    const k = chapK[idx] || 1
    Object.entries(q.atomlar || {}).forEach(([el, soni]) => {
      chap[el] = (chap[el] || 0) + soni * k
    })
  })
  savol.ong.forEach((q, idx) => {
    const k = ongK[idx] || 1
    Object.entries(q.atomlar || {}).forEach(([el, soni]) => {
      ong[el] = (ong[el] || 0) + soni * k
    })
  })
  const elSet = [...new Set([...Object.keys(chap), ...Object.keys(ong)])].sort()
  return elSet.map((el) => ({
    el,
    chap: chap[el] || 0,
    ong: ong[el] || 0,
    teng: (chap[el] || 0) === (ong[el] || 0),
  }))
}

export default function ReaksiyaBalansOyini() {
  const [faza, setFaza] = useState('sozlama')
  const [rejim, setRejim] = useState('yakka')
  const [daraja, setDaraja] = useState('orta')
  const [vaqtSoniya, setVaqtSoniya] = useState(120)
  const [hisoblagich, setHisoblagich] = useState(true)
  const [p1Ism, setP1Ism] = useState('Kimyogar')
  const [p2Ism, setP2Ism] = useState('Raqib')
  const [ovoz, setOvoz] = useState(true)

  const [oyin, setOyin] = useState(null)
  const [koeffHolat, setKoeffHolat] = useState({
    p1: { savolId: '', chap: [], ong: [] },
    p2: { savolId: '', chap: [], ong: [] },
  })
  const [qolganMs, setQolganMs] = useState(0)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [xatoMatn, setXatoMatn] = useState('')
  const [izohlar, setIzohlar] = useState({ p1: null, p2: null })

  const savolgaMosla = useCallback((javob) => {
    setKoeffHolat((eski) => {
      const s1 = javob.rejim === 'duel-savol' ? javob.umumiySavol : javob.p1Savol
      const s2 = javob.rejim === 'duel-savol' ? javob.umumiySavol : javob.p2Savol
      return {
        p1:
          s1 && s1.savolId !== eski.p1.savolId
            ? { savolId: s1.savolId, chap: s1.chap.map(() => 1), ong: s1.ong.map(() => 1) }
            : eski.p1,
        p2:
          s2 && s2.savolId !== eski.p2.savolId
            ? { savolId: s2.savolId, chap: s2.chap.map(() => 1), ong: s2.ong.map(() => 1) }
            : eski.p2,
      }
    })
  }, [])

  const yakunla = useCallback(async (token) => {
    if (!token) return
    try {
      const javob = await oyinApiPost('/api/oyinlar/reaksiya-balans', { amal: 'tugat', token })
      setOyin(javob)
      setFaza('yakun')
      sfxChal('galaba', ovoz)
    } catch {
      // Tugma orqali qayta yakunlash mumkin.
    }
  }, [ovoz])

  const boshlash = useCallback(async () => {
    setYuklanmoqda(true)
    setXatoMatn('')
    setIzohlar({ p1: null, p2: null })
    try {
      const javob = await oyinApiPost('/api/oyinlar/reaksiya-balans', {
        amal: 'boshlash',
        sozlama: { rejim, daraja, vaqtSoniya, hisoblagich, p1Ism, p2Ism },
      })
      setOyin(javob)
      savolgaMosla(javob)
      setQolganMs(Math.max(0, javob.tugashVaqti - Date.now()))
      setFaza('oyin')
      sfxChal('kartaOlindi', ovoz)
    } catch (e) {
      setXatoMatn(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [daraja, hisoblagich, ovoz, p1Ism, p2Ism, rejim, savolgaMosla, vaqtSoniya])

  const koeffOzgartir = (kalit, tomon, indeks, farq) => {
    sfxChal('qadam', ovoz)
    setKoeffHolat((eski) => {
      const joriy = eski[kalit]
      const royxat = [...(joriy[tomon] || [])]
      royxat[indeks] = Math.max(1, Math.min(20, (royxat[indeks] || 1) + farq))
      return {
        ...eski,
        [kalit]: { ...joriy, [tomon]: royxat },
      }
    })
  }

  const nolgaQaytar = (kalit, savol) => {
    if (!savol) return
    setKoeffHolat((eski) => ({
      ...eski,
      [kalit]: {
        savolId: savol.savolId,
        chap: savol.chap.map(() => 1),
        ong: savol.ong.map(() => 1),
      },
    }))
  }

  const tekshir = async (kalit, savol) => {
    if (!oyin?.token || oyin.tugagan || yuklanmoqda || !savol) return
    const k = koeffHolat[kalit]
    setYuklanmoqda(true)
    try {
      const javob = await oyinApiPost('/api/oyinlar/reaksiya-balans', {
        amal: 'tekshir',
        token: oyin.token,
        oyinchi: kalit,
        savolId: savol.savolId,
        chapKoeff: k.chap,
        ongKoeff: k.ong,
      })
      setOyin(javob)
      savolgaMosla(javob)

      if (javob.tugagan) {
        setFaza('yakun')
        sfxChal('galaba', ovoz)
        return
      }
      if (javob.natijaKod === 'togri') {
        const seriya = javob[kalit]?.seriya || 1
        sfxChal(seriya >= 3 ? 'kombo' : 'togri', ovoz, seriya)
        setIzohlar((e) => ({
          ...e,
          [kalit]: { turi: 'togri', matn: `+${javob.qoshilganBall} ball · ${javob.tasdiqIzoh}` },
        }))
      } else if (javob.natijaKod === 'xato') {
        sfxChal('xato', ovoz)
        setIzohlar((e) => ({
          ...e,
          [kalit]: { turi: 'xato', matn: javob.xatoIzoh },
        }))
      }
    } catch (e) {
      setXatoMatn(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }

  const otkaz = async (kalit, savol) => {
    if (!oyin?.token || oyin.tugagan || yuklanmoqda || !savol) return
    setYuklanmoqda(true)
    try {
      const javob = await oyinApiPost('/api/oyinlar/reaksiya-balans', {
        amal: 'otkaz',
        token: oyin.token,
        oyinchi: kalit,
        savolId: savol.savolId,
      })
      setOyin(javob)
      savolgaMosla(javob)
      sfxChal('qadam', ovoz)
      setIzohlar((e) => ({ ...e, [kalit]: { turi: 'neytral', matn: javob.xatoIzoh } }))
    } catch (e) {
      setXatoMatn(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }

  useEffect(() => {
    if (faza !== 'oyin' || !oyin?.tugashVaqti || oyin.tugagan) return undefined
    const interval = setInterval(() => {
      const qoldi = Math.max(0, oyin.tugashVaqti - Date.now())
      setQolganMs(qoldi)
      if (qoldi <= 0) {
        clearInterval(interval)
        yakunla(oyin.token)
      }
    }, 250)
    return () => clearInterval(interval)
  }, [faza, oyin?.token, oyin?.tugagan, oyin?.tugashVaqti, yakunla])

  const panelChiz = (kalit, savol, oyinchiMalumot) => {
    if (!savol || !oyinchiMalumot) return null
    const k = koeffHolat[kalit]
    const tarozi = oyin.hisoblagich ? hisoblaAtomTarozini(savol, k.chap, k.ong) : []
    const izoh = izohlar[kalit]

    const qismKartalar = (qismlar, tomon) =>
      qismlar.map((q, idx) => {
        const qiymat = k[tomon][idx] || 1
        return (
          <Fragment key={`${tomon}-${idx}-${q.formula}`}>
            {idx > 0 ? <span className={styles.operator}>+</span> : null}
            <div className={styles.qismKarta}>
              <button
                type="button"
                className={styles.stepBtn}
                disabled={qiymat <= 1}
                aria-label={`${q.formula} koeffitsientini kamaytirish`}
                onClick={() => koeffOzgartir(kalit, tomon, idx, -1)}
              >
                −
              </button>
              <span className={styles.koeffQiymat} data-katta={String(qiymat > 1)}>
                {qiymat}
              </span>
              <button
                type="button"
                className={styles.stepBtn}
                disabled={qiymat >= 20}
                aria-label={`${q.formula} koeffitsientini oshirish`}
                onClick={() => koeffOzgartir(kalit, tomon, idx, 1)}
              >
                +
              </button>
              <span className={styles.formulaBelgisi}>{q.formula}</span>
            </div>
          </Fragment>
        )
      })

    return (
      <section className={umumiy.oyinchiPanel} data-holat={izoh?.turi || 'neytral'}>
        <div className={umumiy.oyinchiSarlavha}>
          <div>
            <div className={umumiy.oyinchiNom}>{oyinchiMalumot.ism}</div>
            <div style={{ fontSize: '.84rem', color: 'var(--v3-xira)' }}>
              {oyinchiMalumot.ball} ball · Seriya ×{oyinchiMalumot.seriya}
            </div>
          </div>
          {oyin.rejim !== 'duel-savol' ? (
            <button type="button" className={umumiy.tugma} onClick={() => otkaz(kalit, savol)}>
              O‘tkazish
            </button>
          ) : null}
        </div>

        <div className={styles.reaksiyaBosh}>
          <strong style={{ fontSize: '1.02rem' }}>{savol.nom}</strong>
          <span className={styles.toifaBadge}>{savol.toifa}</span>
        </div>

        <div className={styles.tenglamaMaydon}>
          {qismKartalar(savol.chap, 'chap')}
          <span className={styles.operator}>{savol.strelka}</span>
          {qismKartalar(savol.ong, 'ong')}
        </div>

        {oyin.hisoblagich ? (
          <div className={styles.atomTarozi} aria-label="Jonli atomlar hisobi">
            {tarozi.map((a) => (
              <span key={a.el} className={styles.atomChip} data-teng={String(a.teng)}>
                {a.el}: {a.chap} / {a.ong} {a.teng ? '✓' : ''}
              </span>
            ))}
          </div>
        ) : null}

        <div className={umumiy.amallar}>
          <button type="button" className={umumiy.asosiy} onClick={() => tekshir(kalit, savol)}>
            <Ikon nom="chaqmoq" olcham={17} /> Balansni tekshirish
          </button>
          <button type="button" className={umumiy.tugma} onClick={() => nolgaQaytar(kalit, savol)}>
            <Ikon nom="qayta" olcham={16} /> 1 ga tiklash
          </button>
        </div>

        {izoh ? (
          <div className={umumiy.xabarQuti} data-turi={izoh.turi}>
            {izoh.matn}
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <main data-fon="tun" className={`v3 ${umumiy.sahifa}`}>
      <div className={umumiy.fon} aria-hidden="true">
        <div className={umumiy.fonNur} />
      </div>

      <div className={umumiy.qobiq}>
        <OyinSarlavha
          nomi="Reaksiyani tenglashtir"
          izoh="Haqiqiy kimyoviy reaksiyalar bazasida stexiometrik koeffitsientlarni tezlikda toping"
          ovozYoqilgan={ovoz}
          ovozAlmashtir={() => setOvoz((v) => !v)}
          amallar={
            faza === 'oyin' ? (
              <button type="button" className={umumiy.xavfTugma} onClick={() => yakunla(oyin?.token)}>
                <Ikon nom="yopish" olcham={16} /> Tugatish
              </button>
            ) : null
          }
        />

        {xatoMatn ? (
          <div className={umumiy.xabarQuti} data-turi="xato" style={{ marginBottom: 14 }}>
            {xatoMatn}
          </div>
        ) : null}

        {faza === 'sozlama' ? (
          <div className={umumiy.sozlamaUstun}>
            <section className={umumiy.karta} style={{ display: 'grid', gap: 18 }}>
              <div>
                <h2 className={umumiy.bolimSar}>1. O‘yin rejimi</h2>
                <div className={umumiy.rejimGrid}>
                  {[
                    { id: 'yakka', nom: 'Yakka trenajyor', izoh: 'Jonli atom tarozisi bilan reaksiyalarni tez tenglang' },
                    { id: 'duel-savol', nom: '1v1 Tenglama jangi', izoh: 'Ikkala o‘yinchi aynan bitta tenglamani kim birinchi tenglashtirishga' },
                    { id: 'duel-vaqt', nom: '1v1 Mustaqil poyga', izoh: 'Har kim o‘z tenglamalari ketma-ketligini yechadi' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={umumiy.tanlovKarta}
                      data-tanlangan={String(rejim === r.id)}
                      onClick={() => setRejim(r.id)}
                    >
                      <span className={umumiy.tanlovBosh}>
                        <Ikon nom={r.id === 'yakka' ? 'chaqmoq' : 'odamlar'} olcham={17} />
                        {r.nom}
                      </span>
                      <span className={umumiy.tanlovIzoh}>{r.izoh}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className={umumiy.bolimSar}>2. Murakkablik va atom tarozisi</h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div className={umumiy.chipQator}>
                    {[
                      ['oson', 'Oson (koeff ≤ 3)'],
                      ['orta', 'O‘rta (almashinish va metallar)'],
                      ['qiyin', 'Qiyin (Redoks va KMnO₄)'],
                    ].map(([id, nom]) => (
                      <button
                        key={id}
                        type="button"
                        className={umumiy.chip}
                        data-faol={String(daraja === id)}
                        onClick={() => setDaraja(id)}
                      >
                        {nom}
                      </button>
                    ))}
                  </div>
                  <div className={umumiy.chipQator}>
                    {[90, 120, 180].map((v) => (
                      <button
                        key={v}
                        type="button"
                        className={umumiy.chip}
                        data-faol={String(vaqtSoniya === v)}
                        onClick={() => setVaqtSoniya(v)}
                      >
                        {v} soniya
                      </button>
                    ))}
                    <button
                      type="button"
                      className={umumiy.chip}
                      data-faol={String(hisoblagich)}
                      onClick={() => setHisoblagich((v) => !v)}
                    >
                      {hisoblagich ? 'Atom tarozisi: Yoniq' : 'Atom tarozisi: Yopiq (Imtihon)'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className={umumiy.bolimSar}>3. Ishtirokchilar</h2>
                <div className={umumiy.ismGrid}>
                  <label className={umumiy.maydonYorliq}>
                    {rejim === 'yakka' ? 'Ismingiz' : '1-o‘yinchi'}
                    <input className={umumiy.input} value={p1Ism} onChange={(e) => setP1Ism(e.target.value)} maxLength={24} />
                  </label>
                  {rejim !== 'yakka' ? (
                    <label className={umumiy.maydonYorliq}>
                      2-o‘yinchi
                      <input className={umumiy.input} value={p2Ism} onChange={(e) => setP2Ism(e.target.value)} maxLength={24} />
                    </label>
                  ) : null}
                </div>
              </div>

              <div>
                <button type="button" className={umumiy.asosiy} disabled={yuklanmoqda} onClick={boshlash}>
                  <Ikon nom="play" olcham={18} />
                  {yuklanmoqda ? 'Yuklanmoqda...' : 'Musobaqani boshlash'}
                </button>
              </div>
            </section>

            <aside className={umumiy.karta} style={{ display: 'grid', gap: 12 }}>
              <h2 className={umumiy.bolimSar}>Stexiometriya qoidasi</h2>
              <p style={{ margin: 0, color: 'var(--v3-xira)', lineHeight: 1.55, fontSize: '.92rem' }}>
                Chap va o‘ng tomondagi har bir element atomlari soni teng bo‘lishi, shuningdek koeffitsientlar <strong>eng kichik butun sonlar (EKUB = 1)</strong> nisbatida tanlanishi shart.
              </p>
              <div className={umumiy.xabarQuti}>
                <strong>135+ haqiqiy reaksiya:</strong> Saytimizning tekshirilgan reaksiyalar bazasidan olingan real tenglamalar — oddiy neytrallanishdan tortib redoks janglarigacha!
              </div>
            </aside>
          </div>
        ) : null}

        {faza === 'oyin' && oyin ? (
          <div>
            <div className={umumiy.hudQator}>
              <div className={umumiy.hudGuruh}>
                <span className={umumiy.hudChip}><Ikon nom="vaqt" olcham={16} /> {vaqtFormat(qolganMs)}</span>
                <span className={umumiy.hudChip}><Ikon nom="chaqmoq" olcham={16} /> Tarozisi: {oyin.hisoblagich ? 'Yoniq' : 'Yopiq'}</span>
              </div>
              <div className={umumiy.hudGuruh}>
                <span className={umumiy.hudChip}>{oyin.p1.ism}: {oyin.p1.ball} ball</span>
                {oyin.p2 ? <span className={umumiy.hudChip}>{oyin.p2.ism}: {oyin.p2.ball} ball</span> : null}
              </div>
            </div>

            {oyin.rejim !== 'yakka' && oyin.p2 ? (
              <UstunlikBar p1Ism={oyin.p1.ism} p1Ball={oyin.p1.ball} p2Ism={oyin.p2.ism} p2Ball={oyin.p2.ball} />
            ) : null}

            {oyin.rejim === 'yakka' ? (
              <div className={umumiy.yakkaPanel}>
                {panelChiz('p1', oyin.p1Savol, oyin.p1)}
              </div>
            ) : (
              <div className={umumiy.duelPanellar}>
                {panelChiz('p1', oyin.rejim === 'duel-savol' ? oyin.umumiySavol : oyin.p1Savol, oyin.p1)}
                {panelChiz('p2', oyin.rejim === 'duel-savol' ? oyin.umumiySavol : oyin.p2Savol, oyin.p2)}
              </div>
            )}
          </div>
        ) : null}

        {faza === 'yakun' && oyin ? (
          <YakunPanel
            natija={oyin.natija}
            duel={oyin.rejim !== 'yakka'}
            yakunSabab={oyin.yakunSabab || 'Reaksiya tenglashtirish musobaqasi tugadi.'}
            qaytaBoshlash={boshlash}
            sozlamagaQaytish={() => {
              setOyin(null)
              setFaza('sozlama')
            }}
          />
        ) : null}
      </div>
    </main>
  )
}
