'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import styles from './ochiq-dars.module.css'

function htmlQochir(matn) {
  return String(matn ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function faylNomiTozala(ism) {
  return String(ism || 'talaba')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'talaba'
}

export default function OchiqDarsBoshqaruvi() {
  const [dars, setDars] = useState(null)
  const [ishtirokchilar, setIshtirokchilar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xato, setXato] = useState('')
  const [kirishKodi, setKirishKodi] = useState('')
  const [royxatMatni, setRoyxatMatni] = useState('')
  const [hammasiniTozalashTasdiq, setHammasiniTozalashTasdiq] = useState(false)

  const yuklash = useCallback(async () => {
    setXato('')
    try {
      const res = await fetch('/api/ustoz/ochiq-dars', { cache: 'no-store' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setXato(json.xato || 'Ochiq dars ma’lumotlarini yuklab bo‘lmadi.')
        return
      }
      setDars(json.dars)
      setKirishKodi(json.dars?.kirishKodi || '')
      setIshtirokchilar(Array.isArray(json.ishtirokchilar) ? json.ishtirokchilar : [])
    } catch {
      setXato('Server bilan ulanishda xatolik yuz berdi.')
    } finally {
      setYuklanmoqda(false)
    }
  }, [])

  useEffect(() => {
    yuklash()
  }, [yuklash])

  const amalYubor = async (payload, muvaffaqiyatXabari) => {
    setSaqlanmoqda(true)
    setXato('')
    try {
      const res = await fetch('/api/ustoz/ochiq-dars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        toast.error(json.xato || 'Amal bajarilmadi.')
        return false
      }
      setDars(json.dars)
      setKirishKodi(json.dars?.kirishKodi || '')
      setIshtirokchilar(Array.isArray(json.ishtirokchilar) ? json.ishtirokchilar : [])
      if (muvaffaqiyatXabari) toast.success(muvaffaqiyatXabari)
      return true
    } catch {
      toast.error('Tarmoq xatosi yuz berdi.')
      return false
    } finally {
      setSaqlanmoqda(false)
    }
  }

  const kodniSaqlash = async (e) => {
    e.preventDefault()
    await amalYubor(
      { amal: 'sozlash', kirishKodi: kirishKodi.trim(), faol: dars?.faol ?? true },
      'Kirish kodi saqlandi',
    )
  }

  const holatAlmashtir = async () => {
    if (!dars) return
    const yangiFaol = !dars.faol
    await amalYubor(
      { amal: 'sozlash', kirishKodi: dars.kirishKodi, faol: yangiFaol },
      yangiFaol ? 'Test faollashtirildi' : 'Test vaqtincha yopildi',
    )
  }

  const talabalarniQoshish = async (e) => {
    e.preventDefault()
    if (!royxatMatni.trim()) {
      toast.error('Ismlarni kiriting')
      return
    }
    const ok = await amalYubor(
      { amal: 'qoshish', royxatMatni },
      'Shaxsiy QR kodlar yaratildi',
    )
    if (ok) setRoyxatMatni('')
  }

  const pngYuklabOl = (item) => {
    if (!item?.qrDataUrl?.startsWith('data:image/')) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 480
      canvas.height = 590
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 4
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

      ctx.fillStyle = '#0284c7'
      ctx.font = '700 18px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('JDA KIMYO · KALLOID KIMYO AMALIY', canvas.width / 2, 48)

      ctx.fillStyle = '#0f172a'
      ctx.font = '800 30px system-ui, sans-serif'
      ctx.fillText(item.ism.slice(0, 28), canvas.width / 2, 92)

      ctx.drawImage(img, 70, 114, 340, 340)

      ctx.fillStyle = '#475569'
      ctx.font = '500 18px system-ui, sans-serif'
      ctx.fillText('QR kodni skanerlang va testni boshlang', canvas.width / 2, 500)
      ctx.fillText('20 ta savol · 10 daqiqa', canvas.width / 2, 534)

      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `qr-${faylNomiTozala(item.ism)}.png`
      a.click()
    }
    img.src = item.qrDataUrl
  }

  const a4ChopEtish = () => {
    if (ishtirokchilar.length === 0) {
      toast.error('Avval kamida bitta o‘quvchi qo‘shing')
      return
    }
    const oyna = window.open('', '_blank', 'width=1024,height=760')
    if (!oyna) {
      toast.error('Brauzer yangi oynani blokladi. Ruxsat bering.')
      return
    }
    const tozaRo = ishtirokchilar.filter((x) => x.qrDataUrl?.startsWith('data:image/'))
    const sahifalar = []
    for (let i = 0; i < tozaRo.length; i += 8) {
      const bolak = tozaRo.slice(i, i + 8)
      const kartalarHtml = bolak
        .map((x, idx) => `
          <article class="card">
            <div class="tag">#${String(i + idx + 1).padStart(2, '0')} · KALLOID KIMYO AMALIY</div>
            <div class="name">${htmlQochir(x.ism)}</div>
            <img src="${x.qrDataUrl}" alt="${htmlQochir(x.ism)}" />
            <div class="hint">Skanerlang · 20 savol · 10 daqiqa</div>
          </article>
        `)
        .join('')
      sahifalar.push(`<section class="page">${kartalarHtml}</section>`)
    }

    oyna.document.write(`<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8" />
<title>Kalloid Kimyo amaliy — QR kartochkalar (A4 · 8 tadan)</title>
<style>
  @page { size: A4 portrait; margin: 8mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background: #fff; }
  .page {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;
    height: 281mm;
    page-break-after: always;
    break-after: page;
  }
  .page:last-child { page-break-after: auto; break-after: auto; }
  .card {
    border: 1.5px dashed #64748b;
    border-radius: 12px;
    padding: 8px 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .tag { font-size: 9px; font-weight: 800; letter-spacing: 0.06em; color: #0284c7; margin-bottom: 3px; }
  .name { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 6px; line-height: 1.2; word-break: break-word; }
  .card img { width: 146px; height: 146px; display: block; margin: 0 auto 6px; }
  .hint { font-size: 10px; color: #475569; }
  @media screen {
    body { padding: 16px; background: #f8fafc; }
    .toolbar { margin-bottom: 16px; display: flex; justify-content: flex-end; }
    .btn { padding: 10px 18px; border-radius: 10px; border: none; background: #0f172a; color: #fff; font-weight: 700; cursor: pointer; }
  }
  @media print { .toolbar { display: none; } }
</style>
</head>
<body>
  <div class="toolbar"><button class="btn" onclick="window.print()">Chop etish (A4 · 8 tadan)</button></div>
  ${sahifalar.join('')}
</body>
</html>`)
    oyna.document.close()
  }

  return (
    <div className={styles.sahifa}>
      <div className={styles.sarlavha}>
        <div>
          <span className={styles.yorliq}>Mavsumiy ochiq dars</span>
          <h1 className={styles.sarlavhaNom}>Kalloid Kimyo amaliy — QR boshqaruvi</h1>
          <p className={styles.sarlavhaIzoh}>
            40 ta ma’ruza savolidan har bir ishtirokchiga 20 ta tasodifiy test va 10 daqiqa vaqt beriladi.
          </p>
        </div>

        <div className={styles.amallar}>
          <Link
            href="/oyinlar/kalloid-kimyo-amaliy"
            target="_blank"
            className={styles.asosiyTugma}
          >
            <Ikon nom="tashqi" olcham={16} />
            Live Statistika (Proyektor)
          </Link>
          <a
            href="/oyinlar/kalloid-kimyo-amaliy/kalloid-kimyo-qr-kartochkalar.pdf"
            download="kalloid-kimyo-qr-kartochkalar.pdf"
            className={styles.tugma}
          >
            <Ikon nom="chopEt" olcham={16} />
            Tayyor A4 PDF (28 talaba)
          </a>
          <button
            type="button"
            onClick={a4ChopEtish}
            disabled={ishtirokchilar.length === 0}
            className={styles.tugma}
          >
            <Ikon nom="chopEt" olcham={16} />
            A4 QR kartochkalar
          </button>
        </div>
      </div>

      {xato ? <div className={styles.xatoBlok}>{xato}</div> : null}

      <div className={styles.panellar}>
        <section className={styles.panel}>
          <h2 className={styles.panelSarlavha}>Statistika kirish kodi va holat</h2>
          <p className={styles.panelIzoh}>
            Live statistika oynasi faqat ustoz paneli ochiq profillar va shu kirish kodi bilan ochiladi.
          </p>

          <form onSubmit={kodniSaqlash} className={styles.kodForma}>
            <input
              type="text"
              value={kirishKodi}
              onChange={(e) => setKirishKodi(e.target.value)}
              placeholder="Masalan: KALLOID-2026"
              className={styles.input}
            />
            <button type="submit" disabled={saqlanmoqda} className={styles.asosiyTugma}>
              <Ikon nom="saqlash" olcham={16} />
              Saqlash
            </button>
          </form>

          <div className={styles.holatQatori}>
            <button
              type="button"
              onClick={holatAlmashtir}
              disabled={saqlanmoqda || !dars}
              className={`${styles.holatTugma} ${dars?.faol ? styles.faolHolat : styles.yopiqHolat}`}
            >
              <Ikon nom={dars?.faol ? 'ochiq' : 'qulf'} olcham={15} />
              {dars?.faol ? 'Test ochiq (QR ishlayapti)' : 'Test yopiq'}
            </button>

            {!hammasiniTozalashTasdiq ? (
              <button
                type="button"
                onClick={() => setHammasiniTozalashTasdiq(true)}
                disabled={ishtirokchilar.length === 0 || saqlanmoqda}
                className={styles.xavfMatnTugma}
              >
                <Ikon nom="qayta" olcham={15} />
                Darsdan oldin natijalarni nolga tushirish
              </button>
            ) : (
              <div className={styles.tasdiqQator}>
                <span>Barcha urinishlar qayta tiklansinmi?</span>
                <button
                  type="button"
                  onClick={async () => {
                    await amalYubor(
                      { amal: 'qayta_boshlash', ishtirokchiId: 'barchasi' },
                      'Barcha urinishlar qayta tiklandi',
                    )
                    setHammasiniTozalashTasdiq(false)
                  }}
                  className={styles.xavfTugma}
                >
                  Ha, tiklash
                </button>
                <button
                  type="button"
                  onClick={() => setHammasiniTozalashTasdiq(false)}
                  className={styles.tugma}
                >
                  Bekor
                </button>
              </div>
            )}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelSarlavha}>Ishtirokchilarni qo‘shish</h2>
          <p className={styles.panelIzoh}>
            Har bir qatorga 1 tadan ism yozing. Tizim har bir o‘quvchi uchun alohida QR kod va shaxsiy havola yaratadi.
          </p>

          <form onSubmit={talabalarniQoshish} className={styles.qoshishForma}>
            <textarea
              rows={4}
              value={royxatMatni}
              onChange={(e) => setRoyxatMatni(e.target.value)}
              placeholder={'Shoxjahon\nMadina\nAzizbek\nDilnoza'}
              className={styles.textarea}
            />
            <button type="submit" disabled={saqlanmoqda || !royxatMatni.trim()} className={styles.asosiyTugma}>
              <Ikon nom="qosh" olcham={16} />
              Shaxsiy QR kodlarni yaratish
            </button>
          </form>
        </section>
      </div>

      <section className={styles.royxatBolim}>
        <div className={styles.royxatSarlavha}>
          <h2>Shaxsiy QR kodlar ({ishtirokchilar.length} ta)</h2>
        </div>

        {yuklanmoqda ? (
          <p className={styles.panelIzoh}>Yuklanmoqda...</p>
        ) : ishtirokchilar.length === 0 ? (
          <div className={styles.boshBlok}>
            Hozircha o‘quvchilar qo‘shilmagan. Yuqoridagi maydonga ismlarni kiriting va QR kodlarni yarating.
          </div>
        ) : (
          <div className={styles.qrTor}>
            {ishtirokchilar.map((item) => (
              <article key={item.id} className={styles.qrKarta}>
                <div className={styles.qrRasmQuti}>
                  <img src={item.qrDataUrl} alt={`${item.ism} QR kodi`} className={styles.qrRasm} />
                </div>

                <div className={styles.qrMalumot}>
                  <h3 className={styles.talabaIsm}>{item.ism}</h3>

                  {item.holat === 'yakunlandi' ? (
                    <span className={`${styles.holatPill} ${styles.yakunPill}`}>
                      Yakunladi · {item.foiz}% · {item.sarflanganSoniya} s
                    </span>
                  ) : item.holat === 'boshlandi' ? (
                    <span className={`${styles.holatPill} ${styles.jarayonPill}`}>
                      Hozir ishlamoqda
                    </span>
                  ) : (
                    <span className={`${styles.holatPill} ${styles.kutishPill}`}>
                      Kutmoqda
                    </span>
                  )}

                  <div className={styles.kartaAmallar}>
                    <button
                      type="button"
                      onClick={() => pngYuklabOl(item)}
                      className={styles.kichikTugma}
                      title="Ism bilan PNG QR kartochka yuklab olish"
                    >
                      <Ikon nom="rasm" olcham={14} />
                      PNG
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.qrHavola)
                        toast.success(`${item.ism} havolasi nusxalandi`)
                      }}
                      className={styles.kichikTugma}
                      title="Shaxsiy test havolasini nusxalash"
                    >
                      <Ikon nom="nusxa" olcham={14} />
                      Havola
                    </button>

                    <button
                      type="button"
                      onClick={() => amalYubor(
                        { amal: 'qayta_boshlash', ishtirokchiId: item.id },
                        `${item.ism} testi qayta tiklandi`,
                      )}
                      disabled={saqlanmoqda || item.holat === 'kutmoqda'}
                      className={styles.kichikTugma}
                      title="Shu o‘quvchining urinishini qayta boshlash"
                    >
                      <Ikon nom="qayta" olcham={14} />
                      Qayta
                    </button>

                    <button
                      type="button"
                      onClick={() => amalYubor(
                        { amal: 'ochirish', ishtirokchiId: item.id },
                        `${item.ism} o‘chirildi`,
                      )}
                      disabled={saqlanmoqda}
                      className={`${styles.kichikTugma} ${styles.ochirishTugma}`}
                      title="O‘quvchini ro‘yxatdan o‘chirish"
                    >
                      <Ikon nom="ochir" olcham={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
