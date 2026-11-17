'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Ikon from '@/components/Ikon'
import LatexBoyMatn from '@/components/LatexBoyMatn'
import styles from './qr.module.css'

const HARFLAR = ['A', 'B', 'C', 'D']

function vaqtChiqar(soniya) {
  const s = Math.max(0, Math.floor(Number(soniya) || 0))
  const daq = Math.floor(s / 60)
  const qoldiq = s % 60
  return `${String(daq).padStart(2, '0')}:${String(qoldiq).padStart(2, '0')}`
}

export default function QrTestOyini({ token }) {
  const [holat, setHolat] = useState('yuklanmoqda')
  const [xato, setXato] = useState('')
  const [malumot, setMalumot] = useState(null)
  const [savollar, setSavollar] = useState([])
  const [joriyIndeks, setJoriyIndeks] = useState(0)
  const [javoblar, setJavoblar] = useState([])
  const [qolganSoniya, setQolganSoniya] = useState(600)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [tasdiqKutilmoqda, setTasdiqKutilmoqda] = useState(false)
  const [yakuniyNatija, setYakuniyNatija] = useState(null)

  const tugashMsRef = useRef(0)
  const topshirildiRef = useRef(false)
  const javoblarRef = useRef([])
  javoblarRef.current = javoblar

  useEffect(() => {
    let bekor = false
    async function yukla() {
      try {
        const res = await fetch(
          `/api/oyinlar/kalloid-kimyo-amaliy/qr?token=${encodeURIComponent(token)}`,
          { cache: 'no-store' },
        )
        const json = await res.json().catch(() => ({}))
        if (bekor) return

        if (!res.ok || !json.ok) {
          setHolat(json.holat === 'yopiq' ? 'yopiq' : 'topilmadi')
          setXato(json.xato || 'QR kod topilmadi.')
          setMalumot(json)
          return
        }

        setMalumot(json)
        if (json.holat === 'kutmoqda') {
          try {
            localStorage.removeItem(`kalloid_qr_${token}`)
          } catch {}
          setHolat('kutmoqda')
        } else if (json.holat === 'boshlandi') {
          const list = Array.isArray(json.savollar) ? json.savollar : []
          let saqlanganJavoblar = Array.from({ length: list.length }, () => -1)
          let saqlanganIndeks = 0
          try {
            const xom = localStorage.getItem(`kalloid_qr_${token}`)
            if (xom) {
              const parsed = JSON.parse(xom)
              if (Array.isArray(parsed?.javoblar) && parsed.javoblar.length === list.length) {
                saqlanganJavoblar = parsed.javoblar.map((v) =>
                  Number.isInteger(v) && v >= 0 && v <= 3 ? v : -1,
                )
              }
              if (Number.isInteger(parsed?.joriyIndeks) && parsed.joriyIndeks >= 0 && parsed.joriyIndeks < list.length) {
                saqlanganIndeks = parsed.joriyIndeks
              }
            }
          } catch {}
          setSavollar(list)
          setJavoblar(saqlanganJavoblar)
          setJoriyIndeks(saqlanganIndeks)
          setQolganSoniya(json.qolganSoniya ?? 600)
          tugashMsRef.current = Date.now() + (json.qolganSoniya ?? 600) * 1000
          setHolat('boshlandi')
        } else if (json.holat === 'yakunlandi') {
          try {
            localStorage.removeItem(`kalloid_qr_${token}`)
          } catch {}
          setYakuniyNatija({
            ism: json.ism,
            darsNom: json.darsNom,
            foiz: json.foiz,
            sarflanganSoniya: json.sarflanganSoniya,
          })
          setHolat('yakunlandi')
        }
      } catch {
        if (!bekor) {
          setHolat('topilmadi')
          setXato('Server bilan ulanishda xatolik yuz berdi.')
        }
      }
    }
    yukla()
    return () => {
      bekor = true
    }
  }, [token])

  const testniTopshir = useCallback(async (majburiy = false) => {
    if (topshirildiRef.current || yuklanmoqda) return
    const belgilangan = javoblarRef.current
    const javobsiz = belgilangan.filter((x) => x < 0).length
    if (!majburiy && javobsiz > 0 && !tasdiqKutilmoqda) {
      setTasdiqKutilmoqda(true)
      return
    }

    topshirildiRef.current = true
    setTasdiqKutilmoqda(false)
    setYuklanmoqda(true)
    setXato('')

    try {
      const res = await fetch('/api/oyinlar/kalloid-kimyo-amaliy/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amal: 'topshirish',
          token,
          javoblar: belgilangan,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        topshirildiRef.current = false
        setXato(json.xato || 'Javoblarni yuborishda xatolik yuz berdi.')
        return
      }
      try {
        localStorage.removeItem(`kalloid_qr_${token}`)
      } catch {}
      setYakuniyNatija({
        ism: json.ism,
        darsNom: json.darsNom,
        foiz: json.foiz,
        sarflanganSoniya: json.sarflanganSoniya,
      })
      setHolat('yakunlandi')
    } catch {
      topshirildiRef.current = false
      setXato('Internet aloqasini tekshirib, qayta yuboring.')
    } finally {
      setYuklanmoqda(false)
    }
  }, [token, tasdiqKutilmoqda, yuklanmoqda])

  useEffect(() => {
    if (holat !== 'boshlandi' || savollar.length === 0) return
    try {
      localStorage.setItem(
        `kalloid_qr_${token}`,
        JSON.stringify({ javoblar, joriyIndeks }),
      )
    } catch {}
  }, [holat, savollar.length, javoblar, joriyIndeks, token])

  useEffect(() => {
    if (holat !== 'boshlandi') return undefined
    const timer = setInterval(() => {
      const qoldi = Math.max(0, Math.ceil((tugashMsRef.current - Date.now()) / 1000))
      setQolganSoniya(qoldi)
      if (qoldi <= 0 && !topshirildiRef.current) {
        clearInterval(timer)
        testniTopshir(true)
      }
    }, 500)
    return () => clearInterval(timer)
  }, [holat, testniTopshir])

  const testniBoshlash = async () => {
    if (yuklanmoqda) return
    setYuklanmoqda(true)
    setXato('')
    try {
      const res = await fetch('/api/oyinlar/kalloid-kimyo-amaliy/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amal: 'boshlash', token }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setXato(json.xato || 'Testni boshlab bo‘lmadi.')
        return
      }
      if (json.holat === 'yakunlandi') {
        setYakuniyNatija({
          ism: json.ism,
          darsNom: json.darsNom,
          foiz: json.foiz,
          sarflanganSoniya: json.sarflanganSoniya,
        })
        setHolat('yakunlandi')
        return
      }
      const list = Array.isArray(json.savollar) ? json.savollar : []
      setSavollar(list)
      setJavoblar(Array.from({ length: list.length }, () => -1))
      setJoriyIndeks(0)
      setQolganSoniya(json.qolganSoniya ?? 600)
      tugashMsRef.current = Date.now() + (json.qolganSoniya ?? 600) * 1000
      setHolat('boshlandi')
    } catch {
      setXato('Tarmoq xatosi. Qayta urinib ko‘ring.')
    } finally {
      setYuklanmoqda(false)
    }
  }

  const variantTanla = (indeks) => {
    setTasdiqKutilmoqda(false)
    setJavoblar((old) => {
      const nusxa = [...old]
      nusxa[joriyIndeks] = indeks
      return nusxa
    })
  }

  const joriySavol = savollar[joriyIndeks] || null
  const belgilanganSoni = javoblar.filter((x) => x >= 0).length
  const vaqtXavf = qolganSoniya <= 30
  const vaqtOgoh = qolganSoniya > 30 && qolganSoniya <= 120

  return (
    <main data-fon="tun" className={`v3 ${styles.sahifa}`}>
      <div className={styles.fon} aria-hidden="true">
        <span className={styles.fonNur} />
      </div>

      <div className={styles.qobiq}>
        {holat === 'yuklanmoqda' ? (
          <section className={styles.markazKarta} aria-busy="true">
            <div className={styles.belgiQuti}>
              <Ikon nom="kolba" olcham={28} />
            </div>
            <p className={styles.oddiyMatn}>Shaxsiy QR sahifangiz yuklanmoqda...</p>
          </section>
        ) : null}

        {holat === 'topilmadi' || holat === 'yopiq' ? (
          <section className={styles.markazKarta}>
            <div className={styles.belgiQutiXavf}>
              <Ikon nom="ogohlantirish" olcham={28} />
            </div>
            <h1 className={styles.salomSarlavha}>
              {holat === 'yopiq' ? 'Test vaqtincha yopiq' : 'QR kod yaroqsiz'}
            </h1>
            <p className={styles.oddiyMatn}>{xato}</p>
          </section>
        ) : null}

        {holat === 'kutmoqda' && malumot ? (
          <section className={styles.markazKarta} aria-label="Testni boshlash">
            <span className={styles.darsYorligi}>{malumot.darsNom}</span>
            <div className={styles.belgiQuti}>
              <Ikon nom="kolba" olcham={30} />
            </div>
            <h1 className={styles.salomSarlavha}>
              Salom, {malumot.ism}!
            </h1>
            <p className={styles.savolBosh}>Testni boshlaymizmi?</p>

            <div className={styles.qoidaQatori}>
              <span>{malumot.savolSoni} ta tasodifiy savol</span>
              <span>A, B, C, D variantlar</span>
              <span>{Math.round((malumot.vaqtLimitSoniya || 600) / 60)} daqiqa vaqt</span>
            </div>

            <p className={styles.eslatma}>
              Test har bir ishtirokchi uchun 1 marta ishlanadi. Yakunlangach natija foizingiz va sarflagan soniyangiz darhol ko‘rsatiladi.
            </p>

            {xato ? <p className={styles.xatoMatn}>{xato}</p> : null}

            <button
              type="button"
              onClick={testniBoshlash}
              disabled={yuklanmoqda}
              className={styles.boshlashTugma}
            >
              {yuklanmoqda ? 'Tayyorlanmoqda...' : 'Boshlash'}
              <Ikon nom="ong" olcham={18} />
            </button>
          </section>
        ) : null}

        {holat === 'boshlandi' && joriySavol ? (
          <section className={styles.testHududi} aria-label="Test jarayoni">
            <header className={styles.testPanel}>
              <div className={styles.ismBelgisi}>
                <Ikon nom="odam" olcham={15} />
                <span>{malumot?.ism}</span>
              </div>

              <div className={styles.sanoqBelgisi}>
                {joriyIndeks + 1} / {savollar.length}
                <span className={styles.belgilanganMatn}>({belgilanganSoni} ta belgilandi)</span>
              </div>

              <div
                className={`${styles.vaqtBelgisi} ${vaqtXavf ? styles.vaqtXavf : vaqtOgoh ? styles.vaqtOgoh : ''}`}
                aria-live="off"
              >
                <Ikon nom="soat" olcham={16} />
                <span>{vaqtChiqar(qolganSoniya)}</span>
              </div>
            </header>

            <nav className={styles.raqamZanjir} aria-label="Savollar raqami">
              {savollar.map((s, i) => {
                const tanlangan = javoblar[i] >= 0
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setJoriyIndeks(i)
                      setTasdiqKutilmoqda(false)
                    }}
                    className={`${styles.raqamTugma} ${i === joriyIndeks ? styles.raqamAktiv : ''} ${tanlangan ? styles.raqamTanlangan : ''}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </nav>

            <article className={styles.savolKarta}>
              <div className={styles.savolUsti}>
                <span className={styles.savolRaqamPill}>{joriySavol.tartib}-savol</span>
                <span className={styles.modulBelgisi}>{joriySavol.modul}</span>
              </div>

              <div className={styles.savolMatni}>
                <LatexBoyMatn matn={joriySavol.matn} />
              </div>

              <div className={styles.variantlarRoyxati} role="radiogroup" aria-label="Javob variantlari">
                {joriySavol.variantlar.map((matn, idx) => {
                  const tanlanganmi = javoblar[joriyIndeks] === idx
                  return (
                    <button
                      key={`${joriySavol.id}-${idx}`}
                      type="button"
                      role="radio"
                      aria-checked={tanlanganmi}
                      onClick={() => variantTanla(idx)}
                      className={`${styles.variantTugma} ${tanlanganmi ? styles.variantAktiv : ''}`}
                    >
                      <span className={styles.harfBelgisi}>{HARFLAR[idx]}</span>
                      <span className={styles.variantMatni}>
                        <LatexBoyMatn matn={matn} />
                      </span>
                    </button>
                  )
                })}
              </div>
            </article>

            {tasdiqKutilmoqda ? (
              <div className={styles.tasdiqBlok} role="alert">
                <p>
                  Hali <strong>{savollar.length - belgilanganSoni} ta</strong> savol belgilanmagan. Shunday ham yakunlaysizmi?
                </p>
                <div className={styles.tasdiqAmallar}>
                  <button
                    type="button"
                    onClick={() => {
                      const boshIndeks = javoblar.findIndex((x) => x < 0)
                      if (boshIndeks >= 0) setJoriyIndeks(boshIndeks)
                      setTasdiqKutilmoqda(false)
                    }}
                    className={styles.ikkinchiTugma}
                  >
                    Belgilanmaganiga o‘tish
                  </button>
                  <button
                    type="button"
                    onClick={() => testniTopshir(true)}
                    disabled={yuklanmoqda}
                    className={styles.boshlashTugma}
                  >
                    {yuklanmoqda ? 'Yuborilmoqda...' : 'Ha, yakunlash'}
                  </button>
                </div>
              </div>
            ) : null}

            {xato ? <p className={styles.xatoMatn}>{xato}</p> : null}

            <footer className={styles.pastkiNav}>
              <button
                type="button"
                onClick={() => {
                  setJoriyIndeks((i) => Math.max(0, i - 1))
                  setTasdiqKutilmoqda(false)
                }}
                disabled={joriyIndeks === 0}
                className={styles.ikkinchiTugma}
              >
                <Ikon nom="chap" olcham={16} />
                Oldingi
              </button>

              {joriyIndeks < savollar.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setJoriyIndeks((i) => Math.min(savollar.length - 1, i + 1))
                    setTasdiqKutilmoqda(false)
                  }}
                  className={styles.keyingiTugma}
                >
                  Keyingi
                  <Ikon nom="ong" olcham={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => testniTopshir(false)}
                  disabled={yuklanmoqda}
                  className={styles.yakunlashTugma}
                >
                  <Ikon nom="tasdiq" olcham={16} />
                  {yuklanmoqda ? 'Yuborilmoqda...' : 'Yakunlash'}
                </button>
              )}
            </footer>

            {joriyIndeks < savollar.length - 1 ? (
              <div className={styles.ertaroqYakun}>
                <button
                  type="button"
                  onClick={() => testniTopshir(false)}
                  disabled={yuklanmoqda}
                  className={styles.matnliTugma}
                >
                  Testni hozir yakunlash
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        {holat === 'yakunlandi' && yakuniyNatija ? (
          <section className={styles.markazKarta} aria-label="Test natijasi">
            <span className={styles.darsYorligi}>{yakuniyNatija.darsNom}</span>
            <div className={styles.belgiQutiYashil}>
              <Ikon nom="tasdiq" olcham={30} />
            </div>
            <h1 className={styles.salomSarlavha}>
              Barakalla, {yakuniyNatija.ism}!
            </h1>
            <p className={styles.savolBosh}>Test muvaffaqiyatli yakunlandi</p>

            <div className={styles.natijaKartalari}>
              <article className={styles.natijaKarta}>
                <span className={styles.natijaYorliq}>Natija foizi</span>
                <strong className={styles.natijaQiymat}>{yakuniyNatija.foiz}%</strong>
              </article>

              <article className={styles.natijaKarta}>
                <span className={styles.natijaYorliq}>Sarflangan vaqt</span>
                <strong className={styles.natijaQiymat}>{yakuniyNatija.sarflanganSoniya} s</strong>
              </article>
            </div>

            <p className={styles.eslatma}>
              Natijangiz ustozning jonli statistika ekranida ko‘rsatildi.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  )
}
