'use client'

import { useCallback, useEffect, useState } from 'react'
import Ikon from '@/components/Ikon'
import { RIM_GURUHLAR, TOIFA_RANGLAR } from '@/lib/oyinlar/element-baza'
import { sfxChal } from '@/lib/oyinlar/sfx'
import {
  DuelMaydon,
  OyinSarlavha,
  UstunlikBar,
  YakunPanel,
  oyinApiPost,
  vaqtFormat,
} from '../_umumiy/OyinQobiq'
import umumiy from '../oyin-umumiy.module.css'
import styles from './element-duel.module.css'

const QISQA_KATAK_BOR = (qator, guruh8) => {
  if (qator === 1) return guruh8 === 1 || guruh8 === 8
  return true
}

function BohrAtom({ korinish }) {
  const qobiqlar = korinish?.qobiq || [2, 8]
  const rang = TOIFA_RANGLAR[korinish?.toifa] || '#38bdf8'
  const maksimalQobiq = Math.min(6, Math.max(1, qobiqlar.length))

  return (
    <svg viewBox="0 0 160 160" className={styles.bohrSvg} role="img" aria-label="Atom elektron qobig‘i modeli">
      <circle cx="80" cy="80" r="19" fill={rang} fillOpacity="0.22" stroke={rang} strokeWidth="1.8" />
      <text
        x="80"
        y="78"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize="14"
        fontWeight="800"
      >
        {korinish?.belgi || '?'}
      </text>
      <text x="80" y="92" textAnchor="middle" fill="currentColor" fillOpacity="0.7" fontSize="8.5" fontWeight="700">
        Z={korinish?.z ?? '?'}
      </text>

      {qobiqlar.slice(0, 6).map((soni, qIndeks) => {
        const radius = 25 + ((qIndeks + 1) * 49) / maksimalQobiq
        const tasvirSoni = Math.min(soni, 12)
        return (
          <g key={qIndeks}>
            <circle cx="80" cy="80" r={radius} className={styles.orbita} />
            <g className={styles.elektronHalqa} data-teskari={String(qIndeks % 2 === 1)}>
              {Array.from({ length: tasvirSoni }).map((_, elIndeks) => {
                const burchak = (elIndeks / tasvirSoni) * Math.PI * 2
                const cx = 80 + radius * Math.cos(burchak)
                const cy = 80 + radius * Math.sin(burchak)
                return <circle key={elIndeks} cx={cx} cy={cy} r="2.7" fill={rang} />
              })}
            </g>
          </g>
        )
      })}
    </svg>
  )
}

function DavriyMini({ qator, guruh8, guruhcha }) {
  const kataklar = [
    <span key="burchak" className={styles.jadvalQator} />,
    ...RIM_GURUHLAR.map((rim) => (
      <span key={`sar-${rim}`} className={styles.jadvalBosh}>
        {rim}
      </span>
    )),
  ]
  for (let r = 1; r <= 9; r += 1) {
    kataklar.push(
      <span key={`q-${r}`} className={styles.jadvalQator}>
        {r}
      </span>,
    )
    for (let g = 1; g <= 8; g += 1) {
      const mavjud = QISQA_KATAK_BOR(r, g)
      const faol = Boolean(guruh8) && r === qator && g === guruh8
      const qatorYorug = !guruh8 && r === qator && mavjud
      kataklar.push(
        <span
          key={`${r}-${g}`}
          className={styles.katak}
          data-bosh={String(!mavjud)}
          data-qator-faol={String(qatorYorug)}
          data-faol={String(faol)}
        >
          {faol ? guruhcha : ''}
        </span>,
      )
    }
  }
  return <div className={styles.jadvalMini} aria-label="Qisqa davriy jadval">{kataklar}</div>
}

export default function ElementDuelOyini() {
  const [faza, setFaza] = useState('sozlama')
  const [rejim, setRejim] = useState('yakka')
  const [daraja, setDaraja] = useState('orta')
  const [mavzu, setMavzu] = useState('barchasi')
  const [vaqtSoniya, setVaqtSoniya] = useState(90)
  const [p1Ism, setP1Ism] = useState('Kimyogar')
  const [p2Ism, setP2Ism] = useState('Raqib')
  const [ovoz, setOvoz] = useState(true)

  const [oyin, setOyin] = useState(null)
  const [qolganMs, setQolganMs] = useState(0)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [xatoMatn, setXatoMatn] = useState('')
  const [izohlar, setIzohlar] = useState({ p1: null, p2: null })

  const yakunla = useCallback(async (token) => {
    if (!token) return
    try {
      const javob = await oyinApiPost('/api/oyinlar/element-duel', { amal: 'tugat', token })
      setOyin(javob)
      setFaza('yakun')
      sfxChal('galaba', ovoz)
    } catch {
      // Vaqt tugashida qayta urinish kerak bo'lsa, foydalanuvchi tugma orqali yakunlay oladi.
    }
  }, [ovoz])

  const boshlash = useCallback(async () => {
    setYuklanmoqda(true)
    setXatoMatn('')
    setIzohlar({ p1: null, p2: null })
    try {
      const javob = await oyinApiPost('/api/oyinlar/element-duel', {
        amal: 'boshlash',
        sozlama: { rejim, daraja, mavzu, vaqtSoniya, p1Ism, p2Ism },
      })
      setOyin(javob)
      setQolganMs(Math.max(0, javob.tugashVaqti - Date.now()))
      setFaza('oyin')
      sfxChal('kartaOlindi', ovoz)
    } catch (e) {
      setXatoMatn(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [daraja, mavzu, ovoz, p1Ism, p2Ism, rejim, vaqtSoniya])

  const javobBer = useCallback(async (oyinchi, variant, savolId) => {
    if (!oyin?.token || oyin.tugagan || yuklanmoqda) return
    setYuklanmoqda(true)
    try {
      const javob = await oyinApiPost('/api/oyinlar/element-duel', {
        amal: 'javob',
        token: oyin.token,
        oyinchi,
        javob: variant,
        savolId,
      })
      setOyin(javob)

      if (javob.tugagan) {
        setFaza('yakun')
        sfxChal('galaba', ovoz)
        return
      }

      if (javob.natijaKod === 'togri') {
        const seriya = javob[oyinchi]?.seriya || 1
        sfxChal(seriya >= 3 ? 'kombo' : 'togri', ovoz, seriya)
        const el = javob.elementIzoh
        setIzohlar((eski) => ({
          ...eski,
          [oyinchi]: {
            turi: 'togri',
            matn: `+${javob.qoshilganBall} ball · ${el.belgi} (${el.nom}): ${el.izoh}`,
          },
        }))
      } else if (javob.natijaKod === 'xato') {
        sfxChal('xato', ovoz)
        setIzohlar((eski) => ({
          ...eski,
          [oyinchi]: { turi: 'xato', matn: javob.xatoIzoh || 'Noto‘g‘ri javob!' },
        }))
      }
    } catch (e) {
      setXatoMatn(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [ovoz, oyin, yuklanmoqda])

  const yordamIshlat = useCallback(async (oyinchi) => {
    if (!oyin?.token || oyin.tugagan || yuklanmoqda) return
    try {
      const javob = await oyinApiPost('/api/oyinlar/element-duel', {
        amal: 'yordam',
        token: oyin.token,
        oyinchi,
      })
      setOyin(javob)
      sfxChal('yordam50', ovoz)
    } catch (e) {
      setXatoMatn(e.message)
    }
  }, [ovoz, oyin, yuklanmoqda])

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

  useEffect(() => {
    if (faza !== 'oyin' || !oyin) return undefined
    const tugmaBosildi = (e) => {
      if (e.repeat || e.target?.tagName === 'INPUT') return
      const kalit = e.key.toLowerCase()
      if (oyin.rejim === 'yakka') {
        const idx = ['1', '2', '3', '4'].indexOf(kalit)
        const s = oyin.p1Savol
        if (idx >= 0 && s?.variantlar?.[idx] && !(oyin.p1?.yashirilgan || []).includes(s.variantlar[idx])) {
          javobBer('p1', s.variantlar[idx], s.savolId)
        }
        return
      }
      const p1Idx = ['q', 'w', 'e', 'r'].indexOf(kalit)
      const p2Idx = ['u', 'i', 'o', 'p'].indexOf(kalit)
      const s1 = oyin.rejim === 'duel-savol' ? oyin.umumiySavol : oyin.p1Savol
      const s2 = oyin.rejim === 'duel-savol' ? oyin.umumiySavol : oyin.p2Savol
      if (p1Idx >= 0 && s1?.variantlar?.[p1Idx] && !(oyin.p1?.yashirilgan || []).includes(s1.variantlar[p1Idx])) {
        javobBer('p1', s1.variantlar[p1Idx], s1.savolId)
      } else if (p2Idx >= 0 && s2?.variantlar?.[p2Idx] && !(oyin.p2?.yashirilgan || []).includes(s2.variantlar[p2Idx])) {
        javobBer('p2', s2.variantlar[p2Idx], s2.savolId)
      }
    }
    window.addEventListener('keydown', tugmaBosildi)
    return () => window.removeEventListener('keydown', tugmaBosildi)
  }, [faza, javobBer, oyin])

  const panelChiz = (kalit, savol, oyinchiMalumot, klavishlar) => {
    if (!savol || !oyinchiMalumot) return null
    const yashirilgan = oyinchiMalumot.yashirilgan || []
    const izoh = izohlar[kalit]
    const oilaRang = TOIFA_RANGLAR[savol.korinish?.toifa] || '#38bdf8'

    return (
      <section className={umumiy.oyinchiPanel} data-holat={izoh?.turi || 'neytral'}>
        <div className={umumiy.oyinchiSarlavha}>
          <div>
            <div className={umumiy.oyinchiNom}>{oyinchiMalumot.ism}</div>
            <div style={{ fontSize: '.84rem', color: 'var(--v3-xira)' }}>
              {oyinchiMalumot.ball} ball · Seriya ×{oyinchiMalumot.seriya}
            </div>
          </div>

          <button
            type="button"
            className={umumiy.tugma}
            disabled={oyinchiMalumot.yordamQoldi <= 0 || yashirilgan.length >= 2}
            onClick={() => yordamIshlat(kalit)}
          >
            <Ikon nom="filtr" olcham={15} />
            50/50 ({oyinchiMalumot.yordamQoldi})
          </button>
        </div>

        <div className={styles.bohrQobiq}>
          <BohrAtom korinish={savol.korinish} />
          <div className={styles.elementKarta}>
            <div className={styles.elementKvadrat}>
              <span className={styles.belgiBelgisi}>{savol.korinish.belgi}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{savol.korinish.nom}</div>
                <span className={styles.oilaChip}>
                  <span className={styles.oilaNuqta} style={{ background: oilaRang }} />
                  {savol.korinish.toifa}
                </span>
              </div>
            </div>
            <p className={styles.savolMatn}>{savol.savolMatni}</p>
            <div style={{ fontSize: '.84rem', color: 'var(--v3-xira)' }}>{savol.yordamMatn}</div>
            <DavriyMini
              qator={savol.korinish.qator}
              guruh8={savol.korinish.guruh8}
              guruhcha={savol.korinish.guruhcha}
            />
          </div>
        </div>

        <div className={styles.variantGrid}>
          {savol.variantlar.map((variant, indeks) => (
            <button
              key={`${savol.savolId}-${variant}`}
              type="button"
              className={styles.variantTugma}
              data-ochirilgan={String(yashirilgan.includes(variant))}
              onClick={() => javobBer(kalit, variant, savol.savolId)}
            >
              <span>{variant}</span>
              <span className={styles.klavish}>{klavishlar[indeks]}</span>
            </button>
          ))}
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
          nomi="Elementlar dueli"
          izoh="Davriy jadval, Bohr elektron qobiqlari va IUPAC atom massalari bo‘yicha tezkor musobaqa"
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
                    { id: 'yakka', nom: 'Yakka sprint', izoh: '1 o‘yinchi, 1-4 klavishlar bilan rekord qo‘yish' },
                    { id: 'duel-savol', nom: '1v1 Tezkor duel', izoh: 'Ikkala o‘yinchi bitta element uchun poygalashadi' },
                    { id: 'duel-vaqt', nom: '1v1 Mustaqil poyga', izoh: 'Ikki ekran — har kim o‘z oqimida ball yig‘adi' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={umumiy.tanlovKarta}
                      data-tanlangan={String(rejim === r.id)}
                      onClick={() => setRejim(r.id)}
                    >
                      <span className={umumiy.tanlovBosh}>
                        <Ikon nom={r.id === 'yakka' ? 'odam' : 'odamlar'} olcham={17} />
                        {r.nom}
                      </span>
                      <span className={umumiy.tanlovIzoh}>{r.izoh}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className={umumiy.bolimSar}>2. Qiyinlik va vaqt</h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div className={umumiy.chipQator}>
                    {[
                      ['oson', 'Oson (asosiy elementlar)'],
                      ['orta', 'O‘rta (d-metallar bilan)'],
                      ['qiyin', 'Qiyin (olimpiada)'],
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
                    {[
                      ['barchasi', 'Barcha elementlar'],
                      ['metall', 'Metallar'],
                      ['metallmas', 'Metallmas va gazlar'],
                    ].map(([id, nom]) => (
                      <button
                        key={id}
                        type="button"
                        className={umumiy.chip}
                        data-faol={String(mavzu === id)}
                        onClick={() => setMavzu(id)}
                      >
                        {nom}
                      </button>
                    ))}
                  </div>
                  <div className={umumiy.chipQator}>
                    {[60, 90, 120].map((v) => (
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
                  </div>
                </div>
              </div>

              <div>
                <h2 className={umumiy.bolimSar}>3. Ishtirokchilar</h2>
                <div className={umumiy.ismGrid}>
                  <label className={umumiy.maydonYorliq}>
                    {rejim === 'yakka' ? 'Ismingiz' : '1-o‘yinchi (Q W E R)'}
                    <input className={umumiy.input} value={p1Ism} onChange={(e) => setP1Ism(e.target.value)} maxLength={24} />
                  </label>
                  {rejim !== 'yakka' ? (
                    <label className={umumiy.maydonYorliq}>
                      2-o‘yinchi (U I O P)
                      <input className={umumiy.input} value={p2Ism} onChange={(e) => setP2Ism(e.target.value)} maxLength={24} />
                    </label>
                  ) : null}
                </div>
              </div>

              <div>
                <button type="button" className={umumiy.asosiy} disabled={yuklanmoqda} onClick={boshlash}>
                  <Ikon nom="play" olcham={18} />
                  {yuklanmoqda ? 'Tayyorlanmoqda...' : 'O‘yinni boshlash'}
                </button>
              </div>
            </section>

            <aside className={umumiy.karta} style={{ display: 'grid', gap: 12 }}>
              <h2 className={umumiy.bolimSar}>Qanday o‘ynaladi?</h2>
              <p style={{ margin: 0, color: 'var(--v3-xira)', lineHeight: 1.55, fontSize: '.92rem' }}>
                Har bir raundda jonli <strong>Bohr elektron modeli</strong> va <strong>davriy jadval o‘rni</strong> ko‘rsatiladi. Siz belgi, tartib raqami (Z), nisbiy atom massa (Ar), oila yoki elektron qobiqni topishingiz kerak.
              </p>
              <div className={umumiy.xabarQuti}>
                <strong>Kombo va tezlik bonusi:</strong> 3,5 soniyadan tez javob bersangiz <strong>+8 ball</strong> qo‘shiladi, uzluksiz seriya esa har qadamda +5 ball beradi!
              </div>
              <div className={umumiy.xabarQuti}>
                <strong>1v1 Klavishlar:</strong> Chap o‘yinchi <strong>Q W E R</strong>, o‘ng o‘yinchi <strong>U I O P</strong> tugmalari bilan bir vaqtda javob bera oladi.
              </div>
            </aside>
          </div>
        ) : null}

        {faza === 'oyin' && oyin ? (
          <div>
            <div className={umumiy.hudQator}>
              <div className={umumiy.hudGuruh}>
                <span className={umumiy.hudChip}>
                  <Ikon nom="vaqt" olcham={16} /> {vaqtFormat(qolganMs)}
                </span>
                <span className={umumiy.hudChip}>
                  <Ikon nom="atom" olcham={16} /> Rejim: {oyin.rejim === 'yakka' ? 'Yakka' : oyin.rejim === 'duel-savol' ? '1v1 Tezkor duel' : '1v1 Mustaqil poyga'}
                </span>
              </div>
              <div className={umumiy.hudGuruh}>
                <span className={umumiy.hudChip}>{oyin.p1?.ism}: {oyin.p1?.ball} ball</span>
                {oyin.p2 ? <span className={umumiy.hudChip}>{oyin.p2.ism}: {oyin.p2.ball} ball</span> : null}
              </div>
            </div>

            {oyin.rejim !== 'yakka' && oyin.p2 ? (
              <UstunlikBar
                p1Ism={oyin.p1.ism}
                p1Ball={oyin.p1.ball}
                p2Ism={oyin.p2.ism}
                p2Ball={oyin.p2.ball}
              />
            ) : null}

            {oyin.rejim === 'yakka' ? (
              <div className={umumiy.yakkaPanel}>
                {panelChiz('p1', oyin.p1Savol, oyin.p1, ['1', '2', '3', '4'])}
              </div>
            ) : (
              <DuelMaydon
                p1Ism={oyin.p1.ism}
                p2Ism={oyin.p2.ism}
                p1Ball={oyin.p1.ball}
                p2Ball={oyin.p2.ball}
                p1Qism={panelChiz(
                  'p1',
                  oyin.rejim === 'duel-savol' ? oyin.umumiySavol : oyin.p1Savol,
                  oyin.p1,
                  ['Q', 'W', 'E', 'R'],
                )}
                p2Qism={panelChiz(
                  'p2',
                  oyin.rejim === 'duel-savol' ? oyin.umumiySavol : oyin.p2Savol,
                  oyin.p2,
                  ['U', 'I', 'O', 'P'],
                )}
              />
            )}
          </div>
        ) : null}

        {faza === 'yakun' && oyin ? (
          <YakunPanel
            natija={oyin.natija}
            duel={oyin.rejim !== 'yakka'}
            yakunSabab={oyin.yakunSabab || 'Elementlar dueli yakunlandi.'}
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
