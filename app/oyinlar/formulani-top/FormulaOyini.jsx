'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './oyin.module.css'

const DARAJALAR = [
  { nom: 'Oson', ishora: 'Kimyoviy nom', tasvir: 'Formulalar' },
  { nom: 'O‘rta', ishora: 'Trivial nom', tasvir: 'Formulalar' },
  { nom: 'Qiyin', ishora: 'Modda nomi', tasvir: 'CPK modellari' },
  { nom: 'Juda qiyin', ishora: 'Olim va yil', tasvir: 'CPK modellari' },
]

// CPK ranglari elementni bildiradi, shuning uchun ular fon mavzusiga qarab o'zgarmaydi.
const ATOMLAR = {
  H: ['Vodorod', '#ffffff'], C: ['Uglerod', '#909090'], N: ['Azot', '#3050f8'],
  O: ['Kislorod', '#ff0d0d'], F: ['Ftor', '#90e050'], Cl: ['Xlor', '#1ff01f'],
  Br: ['Brom', '#a62929'], I: ['Yod', '#940094'], S: ['Oltingugurt', '#ffff30'],
  P: ['Fosfor', '#ff8000'], Si: ['Kremniy', '#f0c8a0'],
}

function Molekula({ tuzilma }) {
  return (
    <div className={styles.molekula} aria-hidden="true">
      {tuzilma.boglar.map(([a, b, tartib]) => {
        const [, x, y] = tuzilma.atomlar[a]
        const [, ox, oy] = tuzilma.atomlar[b]
        const dx = ox - x
        const dy = oy - y
        return (
          <span
            key={`${a}-${b}`}
            className={styles.boglar}
            style={{ left: x, top: y, width: Math.hypot(dx, dy), rotate: `${Math.atan2(dy, dx)}rad` }}
          >
            {Array.from({ length: tartib }, (_, i) => <span key={i} />)}
          </span>
        )
      })}
      {tuzilma.atomlar.map(([belgi, x, y], i) => (
        <span key={i} className={styles.atom} style={{ left: x, top: y, '--atom': ATOMLAR[belgi][1] }} />
      ))}
    </div>
  )
}

async function sorov(tana) {
  const javob = await fetch('/api/oyinlar/formulani-top', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tana),
  })
  const qiymat = await javob.json()
  if (!javob.ok) throw new Error(qiymat.xato || 'O‘yin bilan aloqa uzildi.')
  return qiymat
}

export default function FormulaOyini() {
  const [daraja, setDaraja] = useState(1)
  const [savol, setSavol] = useState(null)
  const [natija, setNatija] = useState(null)
  const [yakun, setYakun] = useState(false)
  const [tanlov, setTanlov] = useState(null)
  const [kutilyapti, setKutilyapti] = useState(false)
  const [xato, setXato] = useState('')
  const [pauza, setPauza] = useState(false)
  const [matnOchiq, setMatnOchiq] = useState(false)
  const [ovoz, setOvoz] = useState('')
  const [toliq, setToliq] = useState(false)
  const qobiq = useRef(null)
  const sorovBand = useRef(false)
  const gap = useRef(null)

  useEffect(() => {
    const yangila = () => setToliq(document.fullscreenElement === qobiq.current)
    document.addEventListener('fullscreenchange', yangila)
    return () => {
      document.removeEventListener('fullscreenchange', yangila)
      gap.current?.pause()
      gap.current = null
    }
  }, [])

  function ovozniToxtat() {
    const audio = gap.current
    gap.current = null
    audio?.pause()
    setOvoz('')
  }

  function oqi(manzil) {
    ovozniToxtat()
    if (!manzil) {
      setOvoz('Ovoz fayli hali qo‘shilmagan.')
      setMatnOchiq(true)
      return
    }

    const audio = new Audio(manzil)
    gap.current = audio
    setOvoz('Ovoz ijro etilmoqda…')

    function tugat(ishladi) {
      if (gap.current !== audio) return
      gap.current = null
      setOvoz(ishladi ? '' : 'Ovoz ijro etilmadi.')
      if (!ishladi) setMatnOchiq(true)
    }

    audio.onended = () => tugat(true)
    audio.onerror = () => tugat(false)
    audio.play().catch(() => tugat(false))
  }

  function korsat(keyingi) {
    setSavol(keyingi)
    setNatija(null)
    setTanlov(null)
    setPauza(false)
    setMatnOchiq(false)
    oqi(keyingi.audio)
  }

  async function boshlash() {
    if (sorovBand.current) return
    sorovBand.current = true
    setKutilyapti(true)
    setXato('')
    try {
      korsat(await sorov({ amal: 'boshlash', daraja }))
    } catch (e) {
      setXato(e.message)
    } finally {
      sorovBand.current = false
      setKutilyapti(false)
    }
  }

  async function bahola(id) {
    if (sorovBand.current || natija) return
    sorovBand.current = true
    ovozniToxtat()
    setKutilyapti(true)
    setTanlov(id)
    setXato('')
    try {
      setNatija(await sorov({ amal: 'javob', token: savol.token, tanlov: id }))
    } catch (e) {
      setTanlov(null)
      setXato(e.message)
    } finally {
      sorovBand.current = false
      setKutilyapti(false)
    }
  }

  function yangiRaund() {
    ovozniToxtat()
    setSavol(null)
    setNatija(null)
    setYakun(false)
    setXato('')
  }

  async function ekran() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await qobiq.current.requestFullscreen()
    } catch {
      setXato('Brauzer to‘liq ekran rejimini yoqa olmadi.')
    }
  }

  const model = daraja >= 3
  const qatorlar = savol ? Array.from({ length: 4 }, (_, i) => savol.variantlar.slice(i * 6, (i + 1) * 6)) : []

  return (
    <main ref={qobiq} data-fon="tun" className={`v3 ${styles.sahifa}`}>
      <div className={styles.fon} aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      <div className={styles.qobiq}>
        <header className={styles.sarlavha}>
          <Link href="/oyinlar" className={styles.tugma}>← O‘yinlar</Link>
          <button className={styles.tugma} onClick={ekran}>{toliq ? 'Ekrandan chiqish' : 'To‘liq ekran'}</button>
        </header>

        {xato && <p className={styles.xato} role="alert">{xato}</p>}

        {!savol && (
          <section className={`v3-panel-karta ${styles.sozlama}`}>
            <h1>Formulani top</h1>
            <p>Ishorani tinglang va doskada aylanayotgan 24 ta variant orasidan moddani toping.</p>
            <fieldset className={styles.darajalar}>
              <legend>Qiyinlik darajasi</legend>
              {DARAJALAR.map(({ nom, ishora, tasvir }, i) => (
                <label key={nom} className={styles.daraja}>
                  <input type="radio" name="daraja" disabled={kutilyapti} checked={daraja === i + 1} onChange={() => setDaraja(i + 1)} />
                  <strong>{nom}</strong>
                  <span>{ishora} · {tasvir}</span>
                </label>
              ))}
            </fieldset>
            <div className={styles.amallar}>
              <button className={styles.asosiy} disabled={kutilyapti} onClick={boshlash}>{kutilyapti ? 'Yuklanmoqda…' : 'O‘yinni boshlash'}</button>
            </div>
          </section>
        )}

        {savol && !yakun && (
          <section className={styles.oyin} aria-label="O‘yin doskasi">
            <div className={styles.hisob}>
              <h1>Formulani top</h1>
              <strong>{DARAJALAR[daraja - 1].nom} · {savol.tartib}/{savol.jami}</strong>
              <span>Ball: {natija?.ball ?? savol.ball}</span>
            </div>

            <div className={styles.amallar}>
              <button className={styles.tugma} disabled={!savol.audio || Boolean(natija) || kutilyapti} onClick={() => oqi(savol.audio)}>Qayta eshitish</button>
              <button className={styles.tugma} onClick={() => setMatnOchiq(!matnOchiq)}>{matnOchiq ? 'Ishorani yashirish' : 'Ishorani ko‘rsatish'}</button>
              <button className={styles.tugma} disabled={Boolean(natija)} onClick={() => setPauza(!pauza)}>{pauza ? 'Harakatni davom ettirish' : 'Harakatni to‘xtatish'}</button>
              <button className={styles.tugma} disabled={kutilyapti} onClick={yangiRaund}>Darajani almashtirish</button>
            </div>

            <div className={styles.ishora} role="status">
              {matnOchiq ? savol.ishora : ovoz || (natija ? '' : 'Doska ustidagi mos variantni bosing.')}
              {!savol.audio && !natija && <small>Ovoz yozuvi kutilmoqda</small>}
            </div>

            <div className={styles.doska} data-toxtagan={pauza || Boolean(natija) || kutilyapti} data-natija={Boolean(natija)} key={savol.token}>
              {qatorlar.map((qator, q) => (
                <div key={q} className={styles.yolak}>
                  <div className={styles.aylana}>
                    {[false, true].map(nusxa => (
                      <div className={styles.tasma} key={String(nusxa)} data-nusxa={nusxa} aria-hidden={nusxa || undefined}>
                        {qator.map(({ id, formula, tuzilma }, i) => (
                          <button
                            key={id}
                            className={styles.karta}
                            data-natija={id === natija?.togriId ? 'togri' : id === tanlov && natija ? 'xato' : undefined}
                            disabled={kutilyapti || Boolean(natija)}
                            tabIndex={nusxa ? -1 : undefined}
                            aria-label={model ? `${q * 6 + i + 1}-model` : undefined}
                            onClick={() => bahola(id)}
                          >
                            {model ? <Molekula tuzilma={tuzilma} /> : formula}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {model && (
              <div className={styles.ranglar} aria-label="CPK ranglari">
                {Object.entries(ATOMLAR).map(([belgi, [nom, rang]]) => (
                  <span key={belgi} title={nom} aria-label={nom}><i style={{ '--atom': rang }} />{belgi}</span>
                ))}
              </div>
            )}

            {natija ? (
              <div className={styles.natija} role="status">
                <div>
                  <strong>{natija.togrimi ? 'To‘g‘ri!' : 'To‘g‘ri javob'} {natija.javob.nom} · {natija.javob.formula}</strong>
                  {natija.manba && <p>{savol.ishora} <a href={natija.manba} target="_blank" rel="noreferrer">Tarixiy manba ↗</a></p>}
                </div>
                <button className={styles.asosiy} onClick={() => natija.keyingi ? korsat(natija.keyingi) : setYakun(true)}>
                  {natija.keyingi ? 'Keyingi savol' : 'Natijani ko‘rish'}
                </button>
              </div>
            ) : (
              <button className={styles.tugma} disabled={kutilyapti} onClick={() => bahola(null)}>Savolni o‘tkazish</button>
            )}
          </section>
        )}

        {yakun && (
          <section className={`v3-panel-karta ${styles.sozlama}`}>
            <h1>Raund yakunlandi</h1>
            <p className={styles.yakunBall}>{natija.ball} / {savol.jami}</p>
            {natija.xatolar.length > 0 && (
              <>
                <h2>Takrorlash uchun</h2>
                <ul className={styles.takrorlash}>
                  {natija.xatolar.map(({ formula, nom, trivial }) => <li key={formula}>{trivial || nom} · <strong>{formula}</strong></li>)}
                </ul>
              </>
            )}
            <button className={styles.asosiy} onClick={yangiRaund}>Yangi raund</button>
          </section>
        )}
      </div>
    </main>
  )
}
