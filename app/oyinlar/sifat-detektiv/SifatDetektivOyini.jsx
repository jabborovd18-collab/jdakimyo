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
import styles from './detektiv.module.css'

function Probirka({ boshRang, oxirgi }) {
  const suyuqlik = oxirgi?.suyuqlikRang || boshRang || 'rgba(186, 230, 253, 0.28)'
  const chokma = oxirgi?.chokmaRang || null
  const gaz = Boolean(oxirgi?.gaz)

  return (
    <svg viewBox="0 0 110 200" className={styles.probirkaSvg} role="img" aria-label="Kimyoviy probirka">
      <defs>
        <clipPath id="probirkaIchki">
          <path d="M31 24 H79 V146 A24 24 0 0 1 31 146 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#probirkaIchki)">
        <rect x="28" y="82" width="54" height="94" fill={suyuqlik} />
        <ellipse cx="55" cy="82" rx="24" ry="5" fill={suyuqlik} fillOpacity="0.85" />
        {chokma ? (
          <>
            <path d="M31 144 Q55 135 79 144 V176 H31 Z" fill={chokma} />
            <circle cx="44" cy="146" r="2.2" fill={chokma} />
            <circle cx="63" cy="149" r="2" fill={chokma} />
          </>
        ) : null}
        {gaz ? (
          <>
            <circle cx="45" cy="136" r="3" fill="#ffffff" fillOpacity="0.8" className={styles.pufakcha} />
            <circle cx="56" cy="142" r="2.4" fill="#ffffff" fillOpacity="0.85" className={styles.pufakcha} data-kechik="1" />
            <circle cx="64" cy="134" r="3.2" fill="#ffffff" fillOpacity="0.75" className={styles.pufakcha} data-kechik="2" />
            <circle cx="51" cy="128" r="2.2" fill="#ffffff" fillOpacity="0.8" className={styles.pufakcha} data-kechik="3" />
          </>
        ) : null}
      </g>

      <path
        d="M30 22 H80 V146 A25 25 0 0 1 30 146 Z"
        fill="none"
        stroke="rgba(226, 232, 240, 0.72)"
        strokeWidth="2.5"
      />
      <rect x="25" y="18" width="60" height="6" rx="3" fill="rgba(226, 232, 240, 0.65)" />
      <line x1="36" y1="68" x2="43" y2="68" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <line x1="36" y1="98" x2="45" y2="98" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <line x1="36" y1="128" x2="43" y2="128" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    </svg>
  )
}

export default function SifatDetektivOyini() {
  const [faza, setFaza] = useState('sozlama')
  const [rejim, setRejim] = useState('yakka')
  const [daraja, setDaraja] = useState('orta')
  const [vaqtSoniya, setVaqtSoniya] = useState(180)
  const [p1Ism, setP1Ism] = useState('Detektiv')
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
      const javob = await oyinApiPost('/api/oyinlar/sifat-detektiv', { amal: 'tugat', token })
      setOyin(javob)
      setFaza('yakun')
      sfxChal('galaba', ovoz)
    } catch {
      // Tugma orqali yakunlash mumkin.
    }
  }, [ovoz])

  const boshlash = useCallback(async () => {
    setYuklanmoqda(true)
    setXatoMatn('')
    setIzohlar({ p1: null, p2: null })
    try {
      const javob = await oyinApiPost('/api/oyinlar/sifat-detektiv', {
        amal: 'boshlash',
        sozlama: { rejim, daraja, vaqtSoniya, p1Ism, p2Ism },
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
  }, [daraja, ovoz, p1Ism, p2Ism, rejim, vaqtSoniya])

  const reagentQoy = async (kalit, reagentId, namunaId) => {
    if (!oyin?.token || oyin.tugagan || yuklanmoqda) return
    setYuklanmoqda(true)
    try {
      const javob = await oyinApiPost('/api/oyinlar/sifat-detektiv', {
        amal: 'sinov',
        token: oyin.token,
        oyinchi: kalit,
        reagentId,
        namunaId,
      })
      setOyin(javob)
      sfxChal(javob.natijaKod === 'reaksiya' ? 'reaksiya' : 'tomchi', ovoz)
    } catch (e) {
      setXatoMatn(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }

  const aniqla = async (kalit, tanlovId, namunaId) => {
    if (!oyin?.token || oyin.tugagan || yuklanmoqda) return
    setYuklanmoqda(true)
    try {
      const javob = await oyinApiPost('/api/oyinlar/sifat-detektiv', {
        amal: 'aniqla',
        token: oyin.token,
        oyinchi: kalit,
        tanlovId,
        namunaId,
      })
      setOyin(javob)
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
        setIzohlar((e) => ({ ...e, [kalit]: { turi: 'xato', matn: javob.xatoIzoh } }))
      }
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

  const stendChiz = (kalit, namuna, oyinchiMalumot) => {
    if (!namuna || !oyinchiMalumot) return null
    const tarix = oyin.rejim === 'duel-savol'
      ? (namuna.sinovTarixi || []).filter((s) => s.oyinchi === kalit)
      : (namuna.sinovTarixi || [])
    const oxirgi = tarix[tarix.length - 1] || null
    const izoh = izohlar[kalit]

    return (
      <section className={umumiy.oyinchiPanel} data-holat={izoh?.turi || 'neytral'}>
        <div className={umumiy.oyinchiSarlavha}>
          <div>
            <div className={umumiy.oyinchiNom}>{oyinchiMalumot.ism}</div>
            <div style={{ fontSize: '.84rem', color: 'var(--v3-xira)' }}>
              {oyinchiMalumot.ball} ball · Sinovlar: {tarix.length} ta
            </div>
          </div>
          <span className={umumiy.hudChip}>Namuna #{namuna.namunaId.slice(0, 4)}</span>
        </div>

        <div className={styles.stendGrid}>
          <Probirka boshRang={namuna.boshRang} oxirgi={oxirgi} />
          <div style={{ display: 'grid', gap: 8, minWidth: 0 }}>
            <div>
              <div style={{ fontSize: '.76rem', color: 'var(--v3-xira)', fontWeight: 700 }}>DASTLABKI KO‘RINISH</div>
              <strong>{namuna.boshIzoh}</strong>
            </div>

            <div>
              <div style={{ fontSize: '.76rem', color: 'var(--v3-xira)', fontWeight: 700, marginBottom: 4 }}>
                Kuzatuv jurnali:
              </div>
              {tarix.length === 0 ? (
                <div className={styles.jurnalYozuv}>
                  Hali reaktiv tomizilmadi. Pastdagi javondan reaktiv tanlang.
                </div>
              ) : (
                <div className={styles.jurnal}>
                  {tarix.map((t) => (
                    <div key={t.reagentId} className={styles.jurnalYozuv}>
                      <strong>+ {t.reagentFormula}:</strong> {t.xulosa}
                      {t.hid && t.hid !== 'Yo‘q' ? ` (Hid: ${t.hid})` : ''}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className={umumiy.bolimSar} style={{ marginBottom: 6 }}>Reaktivlar javoni (tomizish)</div>
          <div className={styles.reaktivQator}>
            {(oyin.reagentlar || []).map((r) => {
              const sinalgan = tarix.some((t) => t.reagentId === r.id)
              return (
                <button
                  key={r.id}
                  type="button"
                  className={styles.reaktivBtn}
                  data-sinalgan={String(sinalgan)}
                  onClick={() => reagentQoy(kalit, r.id, namuna.namunaId)}
                >
                  <span className={styles.reaktivNuqta} style={{ background: r.rang }} />
                  <span>{r.formula}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className={umumiy.bolimSar} style={{ marginBottom: 6 }}>Detektiv xulosasi (moddani aniqlang)</div>
          <div className={styles.xulosaGrid}>
            {namuna.tanlovlar.map((tanlov) => (
              <button
                key={tanlov.id}
                type="button"
                className={styles.xulosaBtn}
                onClick={() => aniqla(kalit, tanlov.id, namuna.namunaId)}
              >
                <strong style={{ fontSize: '1.04rem' }}>{tanlov.formula}</strong>
                <span style={{ fontSize: '.82rem', color: 'var(--v3-xira)' }}>{tanlov.nom}</span>
              </button>
            ))}
          </div>
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
          nomi="Sifat reaksiyalar detektivi"
          izoh="Noma’lum eritmalarga reaktiv tomizing: cho‘kma, gaz va rang belgilari bo‘yicha moddani fosh eting"
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
                    { id: 'yakka', nom: 'Yakka laboratoriya', izoh: 'Kam reaktiv sarflab har bir namunani aniqlang' },
                    { id: 'duel-savol', nom: '1v1 Bir xil namuna', izoh: 'Ikki detektiv bir xil noma’lum eritmani mustaqil tekshiradi' },
                    { id: 'duel-vaqt', nom: '1v1 Paralel laboratoriya', izoh: 'Har bir detektivda alohida noma’lum probirkalar' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={umumiy.tanlovKarta}
                      data-tanlangan={String(rejim === r.id)}
                      onClick={() => setRejim(r.id)}
                    >
                      <span className={umumiy.tanlovBosh}>
                        <Ikon nom={r.id === 'yakka' ? 'kolba' : 'odamlar'} olcham={17} />
                        {r.nom}
                      </span>
                      <span className={umumiy.tanlovIzoh}>{r.izoh}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className={umumiy.bolimSar}>2. Tahlil murakkabligi va vaqt</h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div className={umumiy.chipQator}>
                    {[
                      ['oson', 'Oson (Cl⁻, SO₄²⁻, Fe³⁺, Cu²⁺)'],
                      ['orta', 'O‘rta (Pb²⁺, Fe²⁺, S²⁻, I⁻)'],
                      ['qiyin', 'Qiyin (CuCl₂ vs CuSO₄, SO₃²⁻, NH₄⁺)'],
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
                    {[120, 180, 240].map((v) => (
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
                <h2 className={umumiy.bolimSar}>3. Detektivlar</h2>
                <div className={umumiy.ismGrid}>
                  <label className={umumiy.maydonYorliq}>
                    {rejim === 'yakka' ? 'Ismingiz' : '1-detektiv'}
                    <input className={umumiy.input} value={p1Ism} onChange={(e) => setP1Ism(e.target.value)} maxLength={24} />
                  </label>
                  {rejim !== 'yakka' ? (
                    <label className={umumiy.maydonYorliq}>
                      2-detektiv
                      <input className={umumiy.input} value={p2Ism} onChange={(e) => setP2Ism(e.target.value)} maxLength={24} />
                    </label>
                  ) : null}
                </div>
              </div>

              <div>
                <button type="button" className={umumiy.asosiy} disabled={yuklanmoqda} onClick={boshlash}>
                  <Ikon nom="play" olcham={18} />
                  {yuklanmoqda ? 'Probirkalar tayyorlanmoqda...' : 'Tahlilni boshlash'}
                </button>
              </div>
            </section>

            <aside className={umumiy.karta} style={{ display: 'grid', gap: 12 }}>
              <h2 className={umumiy.bolimSar}>Snayper tahlil siri</h2>
              <p style={{ margin: 0, color: 'var(--v3-xira)', lineHeight: 1.55, fontSize: '.92rem' }}>
                Namunani <strong>1–2 ta aniq tasdiqlovchi sinov</strong> bilan fosh etsangiz maksimal <strong>+65 ball</strong> olasiz. Ortiqcha reaktiv sarflash ballni pasaytiradi!
              </p>
              <div className={umumiy.xabarQuti}>
                <strong>Muhim eslatma:</strong> Masalan, havorang eritma Cu²⁺ ekanini ko‘rsatsa, uning CuSO₄ yoki CuCl₂ ekanini ajratish uchun BaCl₂ hamda AgNO₃ bilan tekshiring!
              </div>
            </aside>
          </div>
        ) : null}

        {faza === 'oyin' && oyin ? (
          <div>
            <div className={umumiy.hudQator}>
              <div className={umumiy.hudGuruh}>
                <span className={umumiy.hudChip}><Ikon nom="vaqt" olcham={16} /> {vaqtFormat(qolganMs)}</span>
                <span className={umumiy.hudChip}><Ikon nom="kolba" olcham={16} /> Sifat tahlili</span>
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
                {stendChiz('p1', oyin.p1Namuna, oyin.p1)}
              </div>
            ) : (
              <div className={umumiy.duelPanellar}>
                {stendChiz('p1', oyin.rejim === 'duel-savol' ? oyin.umumiyNamuna : oyin.p1Namuna, oyin.p1)}
                {stendChiz('p2', oyin.rejim === 'duel-savol' ? oyin.umumiyNamuna : oyin.p2Namuna, oyin.p2)}
              </div>
            )}
          </div>
        ) : null}

        {faza === 'yakun' && oyin ? (
          <YakunPanel
            natija={oyin.natija}
            duel={oyin.rejim !== 'yakka'}
            yakunSabab={oyin.yakunSabab || 'Sifat tahlili yakunlandi.'}
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
