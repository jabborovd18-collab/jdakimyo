'use client'

import { useCallback, useEffect, useState } from 'react'
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
import styles from './konstruktor.module.css'

const SUB_RAQAMLAR = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']

function indeksKorinishi(n) {
  if (!n || n <= 1) return ''
  return String(n).split('').map((c) => SUB_RAQAMLAR[Number(c)] || c).join('')
}

function formulaKorinishi(kObj, kSoni, aObj, aSoni) {
  if (!kObj && !aObj) return 'Kation va anionni tanlang'
  const kMatn = !kObj
    ? '[Kation]'
    : kSoni > 1 && kObj.kopAtomli
      ? `(${kObj.form})${indeksKorinishi(kSoni)}`
      : `${kObj.form}${indeksKorinishi(kSoni)}`
  const aMatn = !aObj
    ? '[Anion]'
    : aSoni > 1 && aObj.kopAtomli
      ? `(${aObj.form})${indeksKorinishi(aSoni)}`
      : `${aObj.form}${indeksKorinishi(aSoni)}`
  return `${kMatn}${aMatn}`
}

const BOSH_TERIM = { savolId: '', kId: null, kSoni: 1, aId: null, aSoni: 1 }

export default function FormulaKonstruktorOyini() {
  const [faza, setFaza] = useState('sozlama')
  const [rejim, setRejim] = useState('yakka')
  const [daraja, setDaraja] = useState('orta')
  const [vaqtSoniya, setVaqtSoniya] = useState(120)
  const [zaryadHisoblagich, setZaryadHisoblagich] = useState(true)
  const [p1Ism, setP1Ism] = useState('Kimyogar')
  const [p2Ism, setP2Ism] = useState('Raqib')
  const [ovoz, setOvoz] = useState(true)

  const [oyin, setOyin] = useState(null)
  const [terim, setTerim] = useState({ p1: { ...BOSH_TERIM }, p2: { ...BOSH_TERIM } })
  const [qolganMs, setQolganMs] = useState(0)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [xatoMatn, setXatoMatn] = useState('')
  const [izohlar, setIzohlar] = useState({ p1: null, p2: null })

  const savolgaMosla = useCallback((javob) => {
    setTerim((eski) => {
      const s1 = javob.rejim === 'duel-savol' ? javob.umumiySavol : javob.p1Savol
      const s2 = javob.rejim === 'duel-savol' ? javob.umumiySavol : javob.p2Savol
      return {
        p1: s1 && s1.savolId !== eski.p1.savolId ? { ...BOSH_TERIM, savolId: s1.savolId } : eski.p1,
        p2: s2 && s2.savolId !== eski.p2.savolId ? { ...BOSH_TERIM, savolId: s2.savolId } : eski.p2,
      }
    })
  }, [])

  const yakunla = useCallback(async (token) => {
    if (!token) return
    try {
      const javob = await oyinApiPost('/api/oyinlar/formula-konstruktor', { amal: 'tugat', token })
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
      const javob = await oyinApiPost('/api/oyinlar/formula-konstruktor', {
        amal: 'boshlash',
        sozlama: { rejim, daraja, vaqtSoniya, zaryadHisoblagich, p1Ism, p2Ism },
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
  }, [daraja, ovoz, p1Ism, p2Ism, rejim, savolgaMosla, vaqtSoniya, zaryadHisoblagich])

  const ozgartir = (kalit, qism) => {
    setTerim((eski) => ({
      ...eski,
      [kalit]: { ...eski[kalit], ...qism },
    }))
  }

  const tekshir = async (kalit, savol) => {
    if (!oyin?.token || oyin.tugagan || yuklanmoqda || !savol) return
    const holat = terim[kalit]
    if (!holat.kId || !holat.aId) {
      sfxChal('xato', ovoz)
      setIzohlar((e) => ({ ...e, [kalit]: { turi: 'xato', matn: 'Avval bitta kation va bitta anion tanlang.' } }))
      return
    }
    setYuklanmoqda(true)
    try {
      const javob = await oyinApiPost('/api/oyinlar/formula-konstruktor', {
        amal: 'tekshir',
        token: oyin.token,
        oyinchi: kalit,
        savolId: savol.savolId,
        kId: holat.kId,
        kSoni: holat.kSoni,
        aId: holat.aId,
        aSoni: holat.aSoni,
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
      const javob = await oyinApiPost('/api/oyinlar/formula-konstruktor', {
        amal: 'otkaz',
        token: oyin.token,
        oyinchi: kalit,
        savolId: savol.savolId,
      })
      setOyin(javob)
      savolgaMosla(javob)
      sfxChal('qadam', ovoz)
      setIzohlar((e) => ({
        ...e,
        [kalit]: { turi: 'neytral', matn: javob.xatoIzoh },
      }))
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

  const workbenchChiz = (kalit, savol, oyinchiMalumot) => {
    if (!savol || !oyinchiMalumot) return null
    const holat = terim[kalit]
    const kObj = savol.kationlar.find((k) => k.id === holat.kId) || null
    const aObj = savol.anionlar.find((a) => a.id === holat.aId) || null
    const zaryad = (kObj ? kObj.zaryad * holat.kSoni : 0) + (aObj ? aObj.zaryad * holat.aSoni : 0)
    const izoh = izohlar[kalit]

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

        <div className={styles.maqsadQuti}>
          <div>
            <div style={{ fontSize: '.78rem', color: 'var(--v3-xira)', fontWeight: 700 }}>YIG‘ISH KERAK:</div>
            <strong style={{ fontSize: '1.16rem' }}>{savol.nom}</strong>
          </div>
          <span className={styles.sinfBadge}>{savol.sinf}</span>
        </div>

        <div className={styles.formulaEkran}>
          <div className={styles.formulaMatn}>
            {formulaKorinishi(kObj, holat.kSoni, aObj, holat.aSoni)}
          </div>
          {oyin.zaryadHisoblagich && kObj && aObj ? (
            <div className={styles.zaryadBadge} data-neytral={String(zaryad === 0)}>
              Zaryadlar yig‘indisi: {kObj.zaryad * holat.kSoni > 0 ? `+${kObj.zaryad * holat.kSoni}` : 0} + ({aObj.zaryad * holat.aSoni}) = {zaryad > 0 ? `+${zaryad}` : zaryad}
              {zaryad === 0 ? ' (Neytral)' : ''}
            </div>
          ) : (
            <div style={{ fontSize: '.82rem', color: 'var(--v3-xira)' }}>
              Musbat va manfiy zaryadlar yig‘indisini 0 ga keltiring
            </div>
          )}
        </div>

        <div className={styles.ustunIkki}>
          <div className={styles.ionBlok}>
            <div className={styles.ionSar}>
              <span>Kation (+)</span>
              <span>×{holat.kSoni}</span>
            </div>
            <div className={styles.ionGrid}>
              {savol.kationlar.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className={styles.ionTugma}
                  data-tanlangan={String(holat.kId === k.id)}
                  onClick={() => {
                    sfxChal('qadam', ovoz)
                    ozgartir(kalit, { kId: k.id })
                  }}
                >
                  <strong style={{ fontSize: '1rem' }}>{k.belgi}</strong>
                  <span style={{ fontSize: '.72rem', color: 'var(--v3-xira)' }}>{k.nom}</span>
                </button>
              ))}
            </div>
            <div className={styles.indeksQator}>
              <span style={{ fontSize: '.8rem', color: 'var(--v3-xira)' }}>Indeks:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className={styles.indeksBtn}
                  disabled={holat.kSoni <= 1}
                  aria-label="Kation indeksini kamaytirish"
                  onClick={() => ozgartir(kalit, { kSoni: Math.max(1, holat.kSoni - 1) })}
                >
                  −
                </button>
                <strong>{holat.kSoni}</strong>
                <button
                  type="button"
                  className={styles.indeksBtn}
                  disabled={holat.kSoni >= 4}
                  aria-label="Kation indeksini oshirish"
                  onClick={() => ozgartir(kalit, { kSoni: Math.min(4, holat.kSoni + 1) })}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className={styles.ionBlok}>
            <div className={styles.ionSar}>
              <span>Anion (−)</span>
              <span>×{holat.aSoni}</span>
            </div>
            <div className={styles.ionGrid}>
              {savol.anionlar.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={styles.ionTugma}
                  data-tanlangan={String(holat.aId === a.id)}
                  onClick={() => {
                    sfxChal('qadam', ovoz)
                    ozgartir(kalit, { aId: a.id })
                  }}
                >
                  <strong style={{ fontSize: '1rem' }}>{a.belgi}</strong>
                  <span style={{ fontSize: '.72rem', color: 'var(--v3-xira)' }}>{a.nom}</span>
                </button>
              ))}
            </div>
            <div className={styles.indeksQator}>
              <span style={{ fontSize: '.8rem', color: 'var(--v3-xira)' }}>Indeks:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className={styles.indeksBtn}
                  disabled={holat.aSoni <= 1}
                  aria-label="Anion indeksini kamaytirish"
                  onClick={() => ozgartir(kalit, { aSoni: Math.max(1, holat.aSoni - 1) })}
                >
                  −
                </button>
                <strong>{holat.aSoni}</strong>
                <button
                  type="button"
                  className={styles.indeksBtn}
                  disabled={holat.aSoni >= 4}
                  aria-label="Anion indeksini oshirish"
                  onClick={() => ozgartir(kalit, { aSoni: Math.min(4, holat.aSoni + 1) })}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={umumiy.amallar}>
          <button type="button" className={umumiy.asosiy} onClick={() => tekshir(kalit, savol)}>
            <Ikon nom="tasdiq" olcham={17} /> Formulani tekshirish
          </button>
          <button
            type="button"
            className={umumiy.tugma}
            onClick={() => ozgartir(kalit, { kId: null, kSoni: 1, aId: null, aSoni: 1 })}
          >
            <Ikon nom="qayta" olcham={16} /> Tozalash
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
          nomi="Formula konstruktori"
          izoh="Kation va anionlarni birlashtiring, indekslarni muvozanatlang va kimyoviy moddalarni yig‘ing"
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
                    { id: 'yakka', nom: 'Yakka laboratoriya', izoh: 'Tuz, oksid, kislota va asoslarni mustaqil yig‘ing' },
                    { id: 'duel-savol', nom: '1v1 Yagona topshiriq', izoh: 'Ikkala ishtirokchi bitta moddani kim tez yig‘ishga bellashadi' },
                    { id: 'duel-vaqt', nom: '1v1 Mustaqil poyga', izoh: 'Har bir ishtirokchida alohida moddalar oqimi' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={umumiy.tanlovKarta}
                      data-tanlangan={String(rejim === r.id)}
                      onClick={() => setRejim(r.id)}
                    >
                      <span className={umumiy.tanlovBosh}>
                        <Ikon nom={r.id === 'yakka' ? 'formula' : 'odamlar'} olcham={17} />
                        {r.nom}
                      </span>
                      <span className={umumiy.tanlovIzoh}>{r.izoh}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className={umumiy.bolimSar}>2. Qiyinlik, vaqt va zaryad yordamchisi</h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div className={umumiy.chipQator}>
                    {[
                      ['oson', 'Oson (oddiy tuz va kislotalar)'],
                      ['orta', 'O‘rta (gidroksid va nitratlar)'],
                      ['qiyin', 'Qiyin (Fe₂(SO₄)₃, Ca₃(PO₄)₂)'],
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
                      data-faol={String(zaryadHisoblagich)}
                      onClick={() => setZaryadHisoblagich((v) => !v)}
                    >
                      {zaryadHisoblagich ? 'Zaryad hisoblagichi: Yoniq' : 'Zaryad hisoblagichi: O‘chiq'}
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
                  {yuklanmoqda ? 'Yuklanmoqda...' : 'Konstruktorni ishga tushirish'}
                </button>
              </div>
            </section>

            <aside className={umumiy.karta} style={{ display: 'grid', gap: 12 }}>
              <h2 className={umumiy.bolimSar}>Elektroneytrallik qoidasi</h2>
              <p style={{ margin: 0, color: 'var(--v3-xira)', lineHeight: 1.55, fontSize: '.92rem' }}>
                Har qanday barqaror birikmada musbat kationlarning jami zaryadi manfiy anionlarning jami zaryadini aynan <strong>0</strong> ga tenglashtirishi kerak.
              </p>
              <div className={umumiy.xabarQuti}>
                <strong>Misol:</strong> Al³⁺ (×2 = +6) va SO₄²⁻ (×3 = −6) → <strong>Al₂(SO₄)₃</strong>! Ko‘p atomli ionlar soni 2 dan ko‘p bo‘lsa avtomatik qavsga olinadi.
              </div>
            </aside>
          </div>
        ) : null}

        {faza === 'oyin' && oyin ? (
          <div>
            <div className={umumiy.hudQator}>
              <div className={umumiy.hudGuruh}>
                <span className={umumiy.hudChip}><Ikon nom="vaqt" olcham={16} /> {vaqtFormat(qolganMs)}</span>
                <span className={umumiy.hudChip}><Ikon nom="formula" olcham={16} /> Zaryad yordamchisi: {oyin.zaryadHisoblagich ? 'Bor' : 'Yo‘q'}</span>
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
                {workbenchChiz('p1', oyin.p1Savol, oyin.p1)}
              </div>
            ) : (
              <div className={umumiy.duelPanellar}>
                {workbenchChiz('p1', oyin.rejim === 'duel-savol' ? oyin.umumiySavol : oyin.p1Savol, oyin.p1)}
                {workbenchChiz('p2', oyin.rejim === 'duel-savol' ? oyin.umumiySavol : oyin.p2Savol, oyin.p2)}
              </div>
            )}
          </div>
        ) : null}

        {faza === 'yakun' && oyin ? (
          <YakunPanel
            natija={oyin.natija}
            duel={oyin.rejim !== 'yakka'}
            yakunSabab={oyin.yakunSabab || 'Formula konstruktori sessiyasi tugadi.'}
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
