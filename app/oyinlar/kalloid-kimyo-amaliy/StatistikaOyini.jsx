'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Ikon from '@/components/Ikon'
import styles from './kalloid.module.css'

function vaqtniFormatla(soniya) {
  const s = Math.max(0, Math.round(Number(soniya) || 0))
  return `${s} s`
}

export default function StatistikaOyini({ kirgan, ustozRuxsati, ustozIsm }) {
  const konteynerRef = useRef(null)
  const jadvalRef = useRef(null)
  const [kod, setKod] = useState('')
  const [holat, setHolat] = useState(
    !kirgan ? 'kirish_kerak' : !ustozRuxsati ? 'ustoz_emas' : 'tekshirilmoqda',
  )
  const [xato, setXato] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [stat, setStat] = useState(null)
  const [toliqEkran, setToliqEkran] = useState(false)
  const [jadvalToliqEkran, setJadvalToliqEkran] = useState(false)
  const [tozalashTasdiq, setTozalashTasdiq] = useState(false)
  const [tozalanmoqda, setTozalanmoqda] = useState(false)
  const [oxirgiYangilanish, setOxirgiYangilanish] = useState(null)

  const statistikaniOlish = useCallback(async (jim = false) => {
    if (!kirgan || !ustozRuxsati) return
    if (!jim) setXato('')
    try {
      const javob = await fetch('/api/oyinlar/kalloid-kimyo-amaliy/statistika', {
        cache: 'no-store',
      })
      const malumot = await javob.json().catch(() => ({}))

      if (javob.ok && malumot.ok) {
        setStat(malumot)
        setHolat('ochiq')
        setOxirgiYangilanish(new Date())
        return
      }

      if (malumot.holat === 'kirish_kerak' || javob.status === 401) {
        setHolat('kirish_kerak')
      } else if (malumot.holat === 'ustoz_emas') {
        setHolat('ustoz_emas')
      } else if (malumot.holat === 'kod_kerak') {
        setStat(null)
        setHolat('kod_kerak')
      } else {
        setXato(malumot.xato || 'Statistikani yuklab bo‘lmadi.')
      }
    } catch {
      if (!jim) setXato('Server bilan ulanishda xatolik yuz berdi.')
    }
  }, [kirgan, ustozRuxsati])

  useEffect(() => {
    if (kirgan && ustozRuxsati) {
      statistikaniOlish(false)
    }
  }, [kirgan, ustozRuxsati, statistikaniOlish])

  useEffect(() => {
    if (holat !== 'ochiq') return undefined
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        statistikaniOlish(true)
      }
    }, 2000)
    return () => clearInterval(timer)
  }, [holat, statistikaniOlish])

  useEffect(() => {
    const kuzat = () => {
      const el = document.fullscreenElement
      setToliqEkran(Boolean(el))
      if (!el) {
        setJadvalToliqEkran(false)
      }
    }
    document.addEventListener('fullscreenchange', kuzat)
    return () => document.removeEventListener('fullscreenchange', kuzat)
  }, [])

  const toliqEkranniAlmashtir = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setToliqEkran(false)
        setJadvalToliqEkran(false)
      } else if (konteynerRef.current?.requestFullscreen) {
        setJadvalToliqEkran(false)
        await konteynerRef.current.requestFullscreen()
        setToliqEkran(true)
      } else {
        setToliqEkran((v) => !v)
      }
    } catch {
      setToliqEkran((v) => !v)
    }
  }

  const jadvalToliqEkranniAlmashtir = async () => {
    const yangi = !jadvalToliqEkran
    setJadvalToliqEkran(yangi)
    try {
      if (yangi && !document.fullscreenElement && jadvalRef.current?.requestFullscreen) {
        await jadvalRef.current.requestFullscreen()
      } else if (!yangi && document.fullscreenElement === jadvalRef.current) {
        await document.exitFullscreen()
      }
    } catch {
      // CSS fullscreen orqali ishlayveradi
    }
  }

  const natijalarniTozalash = async (ishtirokchiId = 'barchasi') => {
    if (tozalanmoqda) return
    setTozalanmoqda(true)
    setXato('')
    try {
      const javob = await fetch('/api/oyinlar/kalloid-kimyo-amaliy/statistika', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amal: 'natijalarni_tozalash',
          ishtirokchiId,
        }),
      })
      const malumot = await javob.json().catch(() => ({}))
      if (javob.ok && malumot.ok) {
        setStat(malumot)
        setTozalashTasdiq(false)
        setOxirgiYangilanish(new Date())
      } else {
        setXato(malumot.xato || 'Natijalarni tozalab bo‘lmadi.')
      }
    } catch {
      setXato('Server bilan ulanishda xatolik yuz berdi.')
    } finally {
      setTozalanmoqda(false)
    }
  }

  const kodniTasdiqlash = async (e) => {
    e.preventDefault()
    if (!kod.trim() || yuklanmoqda) return
    setYuklanmoqda(true)
    setXato('')
    try {
      const javob = await fetch('/api/oyinlar/kalloid-kimyo-amaliy/statistika', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kirishKodi: kod.trim() }),
      })
      const malumot = await javob.json().catch(() => ({}))
      if (!javob.ok || !malumot.ok) {
        setXato(malumot.xato || 'Kirish kodi noto‘g‘ri.')
        return
      }
      setStat(malumot)
      setHolat('ochiq')
      setKod('')
      setOxirgiYangilanish(new Date())
    } catch {
      setXato('Server bilan bog‘lanishda xatolik yuz berdi.')
    } finally {
      setYuklanmoqda(false)
    }
  }

  const ekranniQulflash = async () => {
    await fetch('/api/oyinlar/kalloid-kimyo-amaliy/statistika', { method: 'DELETE' }).catch(() => {})
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {})
    }
    setStat(null)
    setHolat('kod_kerak')
  }

  return (
    <main ref={konteynerRef} data-fon="tun" className={`v3 ${styles.sahifa}`}>
      <div className={styles.fon} aria-hidden="true">
        <span className={styles.fonNur} />
      </div>

      <div className={styles.qobiq}>
        <header className={styles.sarlavha}>
          <div className={styles.sarlavhaChap}>
            {!toliqEkran ? (
              <Link href="/oyinlar" className="v3-ikon-tugma" aria-label="O‘yinlar ro‘yxatiga qaytish">
                <Ikon nom="chap" olcham={18} />
              </Link>
            ) : null}
            <div>
              <div className={styles.sarlavhaUst}>
                <span className={styles.mavsumiyBelgisi}>Mavsumiy ochiq dars</span>
                {holat === 'ochiq' ? (
                  <span className={styles.jonliBelgisi}>
                    <span className={styles.jonliNuqta} aria-hidden="true" />
                    JONLI STATISTIKA
                  </span>
                ) : null}
              </div>
              <h1 className={styles.sarlavhaNom}>Kalloid Kimyo amaliy</h1>
            </div>
          </div>

          <div className={styles.amallar}>
            {holat === 'ochiq' ? (
              <>
                <button
                  type="button"
                  onClick={toliqEkranniAlmashtir}
                  className={styles.tugmaAsosiy}
                >
                  <Ikon nom={toliqEkran ? 'kichraytirish' : 'kengaytirish'} olcham={16} />
                  {toliqEkran ? 'Oddiy ekran' : 'To‘liq ekran'}
                </button>
                <button
                  type="button"
                  onClick={ekranniQulflash}
                  className={styles.tugma}
                  title="Statistika oynasini kod bilan qulflash"
                >
                  <Ikon nom="qulf" olcham={16} />
                  <span className={styles.tugmaMatn}>Qulflash</span>
                </button>
              </>
            ) : null}
            {!toliqEkran && ustozRuxsati ? (
              <Link href="/ustoz/ochiq-dars" className={styles.tugma}>
                <Ikon nom="sozlama" olcham={16} />
                <span className={styles.tugmaMatn}>QR boshqaruvi</span>
              </Link>
            ) : null}
          </div>
        </header>

        {holat === 'kirish_kerak' ? (
          <section className={styles.markazKarta} aria-label="Profilga kirish talab qilinadi">
            <div className={styles.kartaIkon}>
              <Ikon nom="qulf" olcham={28} />
            </div>
            <h2 className={styles.kartaSarlavha}>Profilga kirish talab qilinadi</h2>
            <p className={styles.kartaMatn}>
              «Kalloid Kimyo amaliy» ochiq darsi statistika oynasi faqat profiliga kirgan ustozlar uchun ochiladi.
            </p>
            <Link
              href="/login?callbackUrl=/oyinlar/kalloid-kimyo-amaliy"
              className={styles.tugmaAsosiy}
            >
              Profilga kirish
              <Ikon nom="ong" olcham={16} />
            </Link>
          </section>
        ) : null}

        {holat === 'ustoz_emas' ? (
          <section className={styles.markazKarta} aria-label="Ruxsat cheklangan">
            <div className={styles.kartaIkonXavf}>
              <Ikon nom="ogohlantirish" olcham={28} />
            </div>
            <h2 className={styles.kartaSarlavha}>Faqat ustozlar uchun yopiq oyna</h2>
            <p className={styles.kartaMatn}>
              Ushbu jonli natijalar ekrani faqat ustoz paneli ochiq bo‘lgan hisoblarga ko‘rsatiladi.
            </p>
            <Link href="/oyinlar" className={styles.tugma}>
              <Ikon nom="chap" olcham={16} />
              O‘yinlarga qaytish
            </Link>
          </section>
        ) : null}

        {holat === 'tekshirilmoqda' ? (
          <section className={styles.markazKarta} aria-busy="true">
            <p className={styles.kartaMatn}>Statistika ruxsati tekshirilmoqda...</p>
          </section>
        ) : null}

        {holat === 'kod_kerak' ? (
          <section className={styles.markazKarta} aria-label="Kirish kodi">
            <div className={styles.kartaIkon}>
              <Ikon nom="qulf" olcham={28} />
            </div>
            <h2 className={styles.kartaSarlavha}>Statistika uchun kirish kodi</h2>
            <p className={styles.kartaMatn}>
              Salom, <strong>{ustozIsm}</strong>! Dars statistikasi ekranini ochish uchun maxsus kirish kodini kiriting.
            </p>

            <form onSubmit={kodniTasdiqlash} className={styles.kodForma}>
              <input
                type="password"
                value={kod}
                onChange={(e) => setKod(e.target.value)}
                placeholder="Kirish kodini kiriting..."
                className={styles.kodInput}
                autoFocus
                autoComplete="off"
                aria-label="Ochiq dars kirish kodi"
              />
              {xato ? <p className={styles.xatoMatn}>{xato}</p> : null}
              <button
                type="submit"
                disabled={yuklanmoqda || !kod.trim()}
                className={styles.tugmaAsosiy}
              >
                {yuklanmoqda ? 'Tekshirilmoqda...' : 'Statistikani ochish'}
              </button>
            </form>
          </section>
        ) : null}

        {holat === 'ochiq' && stat ? (
          <section className={styles.statHududi} aria-label="Dars jonli statistikasi">
            <div className={styles.kpiTor}>
              <article className={`${styles.kpiKarta} ${styles.kpiUrguli}`}>
                <span className={styles.kpiYorliq}>Boshlaganlar soni</span>
                <strong className={styles.kpiRaqam}>{stat.boshlaganSoni}</strong>
                <span className={styles.kpiIzoh}>
                  {stat.hozirYechmoqdaSoni > 0
                    ? `Hozir ${stat.hozirYechmoqdaSoni} nafar ishtirokchi yechmoqda`
                    : `Jami QR egasi: ${stat.jamiIshtirokchi}`}
                </span>
              </article>

              <article className={styles.kpiKarta}>
                <span className={styles.kpiYorliq}>Yakunlaganlar</span>
                <strong className={styles.kpiRaqam}>{stat.yakunlaganSoni}</strong>
                <span className={styles.kpiIzoh}>{stat.savolSoni} ta savol · {Math.round(stat.vaqtLimitSoniya / 60)} daqiqa</span>
              </article>

              <article className={styles.kpiKarta}>
                <span className={styles.kpiYorliq}>O‘rtacha natija</span>
                <strong className={styles.kpiRaqam}>
                  {stat.ortachaFoiz !== null ? `${stat.ortachaFoiz}%` : '—'}
                </strong>
                <span className={styles.kpiIzoh}>Yakunlaganlar bo‘yicha</span>
              </article>

              <article className={styles.kpiKarta}>
                <span className={styles.kpiYorliq}>O‘rtacha vaqt</span>
                <strong className={styles.kpiRaqam}>
                  {stat.ortachaSoniya !== null ? vaqtniFormatla(stat.ortachaSoniya) : '—'}
                </strong>
                <span className={styles.kpiIzoh}>
                  {oxirgiYangilanish
                    ? `Yangilandi: ${oxirgiYangilanish.toLocaleTimeString('uz-UZ')}`
                    : 'Jonli holat'}
                </span>
              </article>
            </div>

            <div
              ref={jadvalRef}
              className={`${styles.natijaPaneli} ${jadvalToliqEkran ? styles.jadvalToliqRejim : ''}`}
            >
              <div className={styles.natijaSarlavha}>
                <div className={styles.natijaSarlavhaChap}>
                  <h2>Yakunlangan natijalar</h2>
                  <span className={styles.natijaSanoq}>
                    {stat.natijalar.length} ta natija
                  </span>
                </div>

                <div className={styles.jadvalAmallar}>
                  {!tozalashTasdiq ? (
                    <button
                      type="button"
                      onClick={() => setTozalashTasdiq(true)}
                      disabled={tozalanmoqda || (stat.boshlaganSoni === 0 && stat.natijalar.length === 0)}
                      className={styles.xavfKichikTugma}
                      title="Barcha natijalarni nolga tushirish"
                    >
                      <Ikon nom="ochir" olcham={15} />
                      <span>Natijalarni o‘chirish</span>
                    </button>
                  ) : (
                    <div className={styles.tasdiqGuruh}>
                      <span className={styles.tasdiqSavol}>Barcha natijalar o‘chirilsinmi?</span>
                      <button
                        type="button"
                        onClick={() => natijalarniTozalash('barchasi')}
                        disabled={tozalanmoqda}
                        className={styles.xavfTasdiqTugma}
                      >
                        {tozalanmoqda ? 'O‘chirilmoqda...' : 'Ha, o‘chirish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTozalashTasdiq(false)}
                        disabled={tozalanmoqda}
                        className={styles.kichikTugma}
                      >
                        Bekor
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={jadvalToliqEkranniAlmashtir}
                    className={styles.kichikTugma}
                    title="Jadvalni to‘liq ekran qilish"
                  >
                    <Ikon nom={jadvalToliqEkran ? 'kichraytirish' : 'kengaytirish'} olcham={15} />
                    <span>{jadvalToliqEkran ? 'Jadvalni kichraytirish' : 'Jadval to‘liq ekran'}</span>
                  </button>
                </div>
              </div>

              {stat.natijalar.length === 0 ? (
                <div className={styles.boshHolat}>
                  <p className={styles.boshMatn}>
                    Hozircha testni yakunlagan ishtirokchilar yo‘q.
                  </p>
                  <p className={styles.boshIzoh}>
                    Ishtirokchilar o‘z QR kodlari orqali testni topshirishi bilan foiz va soniyasi shu ekranda darhol ko‘rinadi.
                  </p>
                </div>
              ) : (
                <div className={styles.jadvalQobiq}>
                  <table className={styles.jadval}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ishtirokchi</th>
                        <th>Natija (%)</th>
                        <th>Vaqt (soniya)</th>
                        <th className={styles.amalKatak}>Amal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stat.natijalar.map((qator, indeks) => (
                        <tr
                          key={qator.id}
                          className={indeks < 3 ? styles.topQator : undefined}
                        >
                          <td className={styles.orinKatak}>
                            <span className={`${styles.orinBelgisi} ${indeks === 0 ? styles.oltin : indeks === 1 ? styles.kumush : indeks === 2 ? styles.bronza : ''}`}>
                              {indeks + 1}
                            </span>
                          </td>
                          <td className={styles.ismKatak}>{qator.ism}</td>
                          <td className={styles.foizKatak}>
                            <span className={styles.foizBadge}>{qator.foiz}%</span>
                          </td>
                          <td className={styles.vaqtKatak}>{qator.sarflanganSoniya} s</td>
                          <td className={styles.amalKatak}>
                            <button
                              type="button"
                              onClick={() => natijalarniTozalash(qator.id)}
                              disabled={tozalanmoqda}
                              className={styles.qatorOchirTugma}
                              title={`${qator.ism} natijasini o‘chirish`}
                              aria-label={`${qator.ism} natijasini o‘chirish`}
                            >
                              <Ikon nom="ochir" olcham={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
