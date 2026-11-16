'use client'

import { useEffect, useRef, useState } from 'react'
import Ikon from '@/components/Ikon'
import styles from './oyin.module.css'

// CPK ranglari kimyoviy elementni bildiradi, shuning uchun mavzuga qarab o'zgarmaydi.
export const ATOMLAR = {
  H: ['Vodorod', '#ffffff'],
  C: ['Uglerod', '#909090'],
  N: ['Azot', '#3050f8'],
  O: ['Kislorod', '#ff0d0d'],
  F: ['Ftor', '#90e050'],
  Cl: ['Xlor', '#1ff01f'],
  Br: ['Brom', '#a62929'],
  I: ['Yod', '#940094'],
  S: ['Oltingugurt', '#ffff30'],
  P: ['Fosfor', '#ff8000'],
  Si: ['Kremniy', '#f0c8a0'],
}

// 24 ta karta shar yuzasida qutblarga yig'ilib qolmasligi uchun Fibonacci panjarasi.
const FIBONACCI_NUQTALAR = Array.from({ length: 24 }, (_, i) => {
  const y = 1 - (2 * i + 1) / 24
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const burchak = Math.PI * (3 - Math.sqrt(5)) * i
  return { x: Math.cos(burchak) * r, y, z: Math.sin(burchak) * r }
})

// Atom orbitallari qobiqlari: 4 + 8 + 12 = 24 karta konteyner eniga mos elliptik qobiqlarda aylanadi.
const ORBITA_QOBIQLAR = [
  { bosh: 0, soni: 4, nisbat: 0.34, yonalish: 1.15 },
  { bosh: 4, soni: 8, nisbat: 0.67, yonalish: -0.78 },
  { bosh: 12, soni: 12, nisbat: 1.0, yonalish: 0.52 },
]

const YOLAK_TEZLIK = {
  sekin: ['38s', '44s'],
  orta: ['24s', '29s'],
  tez: ['14s', '17s'],
}

const SHAR_TEZLIK = { sekin: 0.24, orta: 0.45, tez: 0.85, statik: 0 }
const ORBITA_TEZLIK = { sekin: 0.24, orta: 0.48, tez: 0.9, statik: 0 }
const KVANT_TEZLIK = { sekin: 26, orta: 48, tez: 88, statik: 0 }

const NAMUNA_FORMULALAR = ['H₂SO₄', 'CH₄', 'CaCO₃', 'NH₃', 'H₂O', 'NaCl', 'O₃', 'CO₂', 'HNO₃', 'Fe₂O₃', 'KNO₃', 'CuSO₄']

function kartaBezakOl(turi, duelMi) {
  switch (turi) {
    case 'kombo2x':
      return { nom: '2× Kombo', izoh: '16 soniya davomida ikki hissa ball', ikon: 'chaqmoq', tur: 'kombo' }
    case 'vaqt15':
      return { nom: '+15 soniya', izoh: 'Taymerga darhol +15 soniya qo‘shadi', ikon: 'vaqt', tur: 'vaqt' }
    case 'yordam50':
      return { nom: '50/50 Yordam', izoh: '12 ta noto‘g‘ri variantni o‘chiradi', ikon: 'filtr', tur: 'yordam' }
    case 'qalqon':
      return { nom: 'Qalqon', izoh: '1 ta xato yoki raqib tuzog‘idan asraydi', ikon: 'qalqon', tur: 'qalqon' }
    case 'sirli':
      return {
        nom: 'Sirli karta (?)',
        izoh: 'Kutilmagan bonus yoki hazil chiqadi!',
        ikon: 'uchqun',
        tur: 'sirli',
      }
    case 'notogriBos':
      return {
        nom: 'Noto‘g‘risini bos!',
        izoh: duelMi ? 'Raqibga teskari tuzoq tashlash' : 'Teskari sinov: +2 bonus imkon',
        ikon: 'ogohlantirish',
        tur: 'tuzoq',
      }
    case 'muzlatish':
      return {
        nom: duelMi ? 'Raqibni muzlatish' : 'Muz bo‘roni!',
        izoh: duelMi ? 'Raqib doskasini 3.5s ga muzlatadi' : 'Tez bosing — aks holda 2.5s muzlaysiz!',
        ikon: 'kristall',
        tur: 'muz',
      }
    case 'tuman':
      return {
        nom: duelMi ? 'Raqibga tuman' : 'Tuman xavfi!',
        izoh: duelMi ? 'Raqib kartalarini 6s xiralashtiradi' : 'Tez bosing — aks holda 6s tuman tushadi!',
        ikon: 'tolqin',
        tur: 'tuzoq',
      }
    case 'aralashtir':
      return {
        nom: duelMi ? 'Raqibni chalkashtir' : 'Shamol xavfi!',
        izoh: duelMi ? 'Raqib kartalari joyini almashtiradi' : 'Tez bosing — aks holda kartalar almashadi!',
        ikon: 'qayta',
        tur: 'tuzoq',
      }
    case 'bomba':
    default:
      return {
        nom: 'BOMBA! Bosmang!',
        izoh: 'Xavfli karta: bossangiz -1 ball va jarima!',
        ikon: 'taqiq',
        tur: 'bomba',
      }
  }
}

export function Molekula({ tuzilma }) {
  if (!tuzilma) return null
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
            {Array.from({ length: tartib }, (_, i) => (
              <span key={i} />
            ))}
          </span>
        )
      })}
      {tuzilma.atomlar.map(([belgi, x, y], i) => (
        <span
          key={i}
          className={styles.atom}
          style={{ left: x, top: y, '--atom': ATOMLAR[belgi]?.[1] || '#cbd5e1' }}
        />
      ))}
    </div>
  )
}

export function CpKLegend() {
  return (
    <div className={styles.ranglar} aria-label="CPK ranglari">
      {Object.entries(ATOMLAR).map(([belgi, [nom, rang]]) => (
        <span key={belgi} title={nom} aria-label={nom}>
          <i style={{ '--atom': rang }} />
          {belgi}
        </span>
      ))}
    </div>
  )
}

function kartaHolati(id, natijaTogriId, xatoTanlovId, teskariJuftlik) {
  if (id === natijaTogriId) return 'togri'
  if (id === xatoTanlovId) return 'xato'
  if (teskariJuftlik?.includes(id)) return 'teskari'
  return undefined
}

function KartaTugma({
  variant,
  indeks,
  model,
  natijaTogriId,
  xatoTanlovId,
  teskariJuftlik,
  ochirilganlar,
  ochirilgan,
  nusxa,
  className,
  onTanla,
}) {
  const holat = kartaHolati(variant.id, natijaTogriId, xatoTanlovId, teskariJuftlik)
  const teskariFaol = Boolean(teskariJuftlik?.length)
  const juftlikTashqarida = teskariFaol && !teskariJuftlik.includes(variant.id)
  const yordamdaOchirildi = Boolean(ochirilganlar?.includes(variant.id))

  return (
    <button
      type="button"
      className={className}
      data-natija={holat === 'togri' || holat === 'xato' ? holat : undefined}
      data-teskari={holat === 'teskari' ? 'true' : undefined}
      data-xira={juftlikTashqarida ? 'true' : undefined}
      data-ochirilgan={yordamdaOchirildi ? 'true' : undefined}
      disabled={ochirilgan || juftlikTashqarida || yordamdaOchirildi}
      tabIndex={nusxa ? -1 : undefined}
      aria-label={model ? `${indeks + 1}-model` : variant.formula}
      onClick={() => onTanla(variant.id)}
    >
      {model ? <Molekula tuzilma={variant.tuzilma} /> : variant.formula}
    </button>
  )
}

export function YolakDoska({
  variantlar,
  model,
  tezlik = 'orta',
  pauza = false,
  ochirilgan = false,
  ixcham = false,
  tuman = false,
  muzlagan = false,
  ochirilganlar = null,
  natijaTogriId = null,
  xatoTanlovId = null,
  teskariJuftlik = null,
  onTanla,
}) {
  const statik = tezlik === 'statik'
  const qatorlar = Array.from({ length: 4 }, (_, i) => variantlar.slice(i * 6, (i + 1) * 6))
  const [vaqt1, vaqt2] = YOLAK_TEZLIK[tezlik] || YOLAK_TEZLIK.orta

  return (
    <div
      className={`${styles.doska} ${ixcham ? styles.doskaIxcham : ''}`}
      data-statik={statik ? 'true' : undefined}
      data-tuman={tuman ? 'true' : undefined}
      data-muz={muzlagan ? 'true' : undefined}
      data-toxtagan={pauza || Boolean(natijaTogriId) || statik ? 'true' : undefined}
      data-natija={Boolean(natijaTogriId) ? 'true' : undefined}
      style={{ '--yolak-vaqt-1': vaqt1, '--yolak-vaqt-2': vaqt2 }}
    >
      {qatorlar.map((qator, q) => (
        <div key={q} className={styles.yolak}>
          <div className={styles.aylana}>
            {(statik ? [false] : [false, true]).map((nusxa) => (
              <div
                className={styles.tasma}
                key={String(nusxa)}
                data-nusxa={nusxa ? 'true' : undefined}
                aria-hidden={nusxa || undefined}
              >
                {qator.map((variant, i) => (
                  <KartaTugma
                    key={variant.id}
                    variant={variant}
                    indeks={q * 6 + i}
                    model={model}
                    natijaTogriId={natijaTogriId}
                    xatoTanlovId={xatoTanlovId}
                    teskariJuftlik={teskariJuftlik}
                    ochirilganlar={ochirilganlar}
                    ochirilgan={ochirilgan}
                    nusxa={nusxa}
                    className={styles.karta}
                    onTanla={onTanla}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SharDoska({
  variantlar,
  model,
  tezlik = 'orta',
  pauza = false,
  ochirilgan = false,
  ixcham = false,
  tuman = false,
  muzlagan = false,
  ochirilganlar = null,
  natijaTogriId = null,
  xatoTanlovId = null,
  teskariJuftlik = null,
  onTanla,
}) {
  const sahnaRef = useRef(null)
  const kartaReflar = useRef([])
  const burchakRef = useRef({ x: 0.24, y: 0 })
  const olchamRef = useRef({ radius: 135 })
  const ustidaRef = useRef(false)
  const sudrashRef = useRef({ faol: false, startX: 0, startY: 0, oxirgiX: 0, oxirgiY: 0, siljidi: false })
  const holatRef = useRef({ tezlik, pauza, natija: Boolean(natijaTogriId) })

  holatRef.current = { tezlik, pauza, natija: Boolean(natijaTogriId) }

  useEffect(() => {
    const el = sahnaRef.current
    if (!el) return undefined

    const yangilaOlcham = () => {
      const rect = el.getBoundingClientRect()
      const minTomon = Math.min(rect.width, rect.height)
      olchamRef.current.radius = Math.max(80, minTomon * 0.325)
    }

    yangilaOlcham()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(yangilaOlcham) : null
    observer?.observe(el)

    let oxirgiVaqt = performance.now()
    let kadrId = 0
    const kamHarakat =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const chiz = (hozir) => {
      const dt = Math.min(0.05, (hozir - oxirgiVaqt) / 1000)
      oxirgiVaqt = hozir

      const { tezlik: jTezlik, pauza: jPauza, natija: jNatija } = holatRef.current
      if (!kamHarakat && !jPauza && !jNatija && !sudrashRef.current.faol) {
        const asosTezlik = SHAR_TEZLIK[jTezlik] ?? SHAR_TEZLIK.orta
        const sekinlashuv = ustidaRef.current ? 0.22 : 1
        burchakRef.current.y += asosTezlik * sekinlashuv * dt
        burchakRef.current.x = 0.24 * Math.sin(hozir * 0.00045)
      }

      const cosY = Math.cos(burchakRef.current.y)
      const sinY = Math.sin(burchakRef.current.y)
      const cosX = Math.cos(burchakRef.current.x)
      const sinX = Math.sin(burchakRef.current.x)
      const radius = olchamRef.current.radius
      const istiqbol = 2.65

      for (let i = 0; i < FIBONACCI_NUQTALAR.length; i += 1) {
        const tugun = kartaReflar.current[i]
        if (!tugun) continue
        const p = FIBONACCI_NUQTALAR[i]

        const x1 = p.x * cosY + p.z * sinY
        const z1 = -p.x * sinY + p.z * cosY
        const y2 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX

        const chuqurlik = istiqbol / (istiqbol - z2)
        const px = x1 * radius * chuqurlik
        const py = y2 * radius * chuqurlik
        const masshtab = Math.max(0.56, Math.min(1.16, 0.56 + (z2 + 1) * 0.29))
        const shaffoflik = Math.max(0.32, Math.min(1, 0.32 + (z2 + 1) * 0.36))

        tugun.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%) scale(${masshtab.toFixed(3)})`
        tugun.style.opacity = shaffoflik.toFixed(2)
        tugun.style.zIndex = String(Math.round((z2 + 1.2) * 100))
      }

      kadrId = requestAnimationFrame(chiz)
    }

    kadrId = requestAnimationFrame(chiz)
    return () => {
      cancelAnimationFrame(kadrId)
      observer?.disconnect()
    }
  }, [])

  function pointerBoshlandi(e) {
    if (e.button && e.button !== 0) return
    sudrashRef.current = {
      faol: true,
      startX: e.clientX,
      startY: e.clientY,
      oxirgiX: e.clientX,
      oxirgiY: e.clientY,
      siljidi: false,
    }
  }

  function pointerHarakat(e) {
    if (!sudrashRef.current.faol) return
    const dx = e.clientX - sudrashRef.current.oxirgiX
    const dy = e.clientY - sudrashRef.current.oxirgiY
    if (Math.hypot(e.clientX - sudrashRef.current.startX, e.clientY - sudrashRef.current.startY) > 6) {
      sudrashRef.current.siljidi = true
    }
    burchakRef.current.y += dx * 0.0085
    burchakRef.current.x = Math.max(-1.15, Math.min(1.15, burchakRef.current.x - dy * 0.0085))
    sudrashRef.current.oxirgiX = e.clientX
    sudrashRef.current.oxirgiY = e.clientY
  }

  function pointerTugadi() {
    sudrashRef.current.faol = false
    setTimeout(() => {
      sudrashRef.current.siljidi = false
    }, 0)
  }

  return (
    <div
      ref={sahnaRef}
      className={`${styles.sharSahna} ${ixcham ? styles.sharSahnaIxcham : ''}`}
      data-tuman={tuman ? 'true' : undefined}
      data-muz={muzlagan ? 'true' : undefined}
      data-natija={Boolean(natijaTogriId) ? 'true' : undefined}
      onPointerDown={pointerBoshlandi}
      onPointerMove={pointerHarakat}
      onPointerUp={pointerTugadi}
      onPointerCancel={pointerTugadi}
      onPointerLeave={() => {
        ustidaRef.current = false
        pointerTugadi()
      }}
      onClickCapture={(e) => {
        if (sudrashRef.current.siljidi) {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
    >
      <div className={styles.sharQobiq} aria-hidden="true">
        <svg viewBox="0 0 200 200" className={styles.sharTori}>
          <circle cx="100" cy="100" r="94" />
          <ellipse cx="100" cy="100" rx="94" ry="34" />
          <ellipse cx="100" cy="100" rx="94" ry="68" />
          <ellipse cx="100" cy="100" rx="38" ry="94" />
          <ellipse cx="100" cy="100" rx="72" ry="94" />
        </svg>
      </div>

      <span className={styles.sharIzoh}>Sudrab aylantirish mumkin</span>

      <div
        className={styles.sharKartalar}
        onPointerEnter={() => { ustidaRef.current = true }}
        onPointerLeave={() => { ustidaRef.current = false }}
      >
        {variantlar.map((variant, i) => (
          <div
            key={variant.id}
            ref={(el) => { kartaReflar.current[i] = el }}
            className={styles.sharNuqta}
          >
            <KartaTugma
              variant={variant}
              indeks={i}
              model={model}
              natijaTogriId={natijaTogriId}
              xatoTanlovId={xatoTanlovId}
              teskariJuftlik={teskariJuftlik}
              ochirilganlar={ochirilganlar}
              ochirilgan={ochirilgan}
              nusxa={false}
              className={styles.sharKarta}
              onTanla={onTanla}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function OrbitalDoska({
  variantlar,
  model,
  tezlik = 'orta',
  pauza = false,
  ochirilgan = false,
  ixcham = false,
  tuman = false,
  muzlagan = false,
  ochirilganlar = null,
  natijaTogriId = null,
  xatoTanlovId = null,
  teskariJuftlik = null,
  onTanla,
}) {
  const sahnaRef = useRef(null)
  const kartaReflar = useRef([])
  const fazaRef = useRef(0)
  const olchamRef = useRef({ rx: 220, ry: 130 })
  const ustidaRef = useRef(false)
  const holatRef = useRef({ tezlik, pauza, natija: Boolean(natijaTogriId) })

  holatRef.current = { tezlik, pauza, natija: Boolean(natijaTogriId) }

  useEffect(() => {
    const el = sahnaRef.current
    if (!el) return undefined

    const yangilaOlcham = () => {
      const rect = el.getBoundingClientRect()
      olchamRef.current = {
        rx: Math.max(115, rect.width * 0.405),
        ry: Math.max(105, rect.height * 0.395),
      }
    }

    yangilaOlcham()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(yangilaOlcham) : null
    observer?.observe(el)

    let oxirgiVaqt = performance.now()
    let kadrId = 0
    const kamHarakat =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const chiz = (hozir) => {
      const dt = Math.min(0.05, (hozir - oxirgiVaqt) / 1000)
      oxirgiVaqt = hozir

      const { tezlik: jTezlik, pauza: jPauza, natija: jNatija } = holatRef.current
      if (!kamHarakat && !jPauza && !jNatija) {
        const asos = ORBITA_TEZLIK[jTezlik] ?? ORBITA_TEZLIK.orta
        const sekinlashuv = ustidaRef.current ? 0.25 : 1
        fazaRef.current += asos * sekinlashuv * dt
      }

      const { rx: maxRx, ry: maxRy } = olchamRef.current
      for (const qobiq of ORBITA_QOBIQLAR) {
        const rx = qobiq.nisbat * maxRx
        const ry = qobiq.nisbat * maxRy
        for (let k = 0; k < qobiq.soni; k += 1) {
          const indeks = qobiq.bosh + k
          const tugun = kartaReflar.current[indeks]
          if (!tugun) continue
          const burchak = fazaRef.current * qobiq.yonalish + (2 * Math.PI * k) / qobiq.soni
          const px = Math.cos(burchak) * rx
          const py = Math.sin(burchak) * ry
          tugun.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%)`
        }
      }

      kadrId = requestAnimationFrame(chiz)
    }

    kadrId = requestAnimationFrame(chiz)
    return () => {
      cancelAnimationFrame(kadrId)
      observer?.disconnect()
    }
  }, [])

  return (
    <div
      ref={sahnaRef}
      className={`${styles.orbitalSahna} ${ixcham ? styles.orbitalSahnaIxcham : ''}`}
      data-tuman={tuman ? 'true' : undefined}
      data-muz={muzlagan ? 'true' : undefined}
      data-natija={Boolean(natijaTogriId) ? 'true' : undefined}
    >
      <div className={styles.orbitalHalqalar} aria-hidden="true">
        <span className={styles.orbitalHalqa1} />
        <span className={styles.orbitalHalqa2} />
        <span className={styles.orbitalHalqa3} />
        <span className={styles.orbitalYadro}>
          <Ikon nom="atom" olcham={ixcham ? 16 : 20} />
        </span>
      </div>

      <span className={styles.sharIzoh}>3 qobiqli atom orbitallari</span>

      <div
        className={styles.orbitalKartalar}
        onPointerEnter={() => { ustidaRef.current = true }}
        onPointerLeave={() => { ustidaRef.current = false }}
      >
        {variantlar.map((variant, i) => (
          <div
            key={variant.id}
            ref={(el) => { kartaReflar.current[i] = el }}
            className={styles.orbitalNuqta}
          >
            <KartaTugma
              variant={variant}
              indeks={i}
              model={model}
              natijaTogriId={natijaTogriId}
              xatoTanlovId={xatoTanlovId}
              teskariJuftlik={teskariJuftlik}
              ochirilganlar={ochirilganlar}
              ochirilgan={ochirilgan}
              nusxa={false}
              className={styles.orbitalKarta}
              onTanla={onTanla}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function KvantMaydonDoska({
  variantlar,
  model,
  tezlik = 'orta',
  pauza = false,
  ochirilgan = false,
  ixcham = false,
  tuman = false,
  muzlagan = false,
  ochirilganlar = null,
  natijaTogriId = null,
  xatoTanlovId = null,
  teskariJuftlik = null,
  onTanla,
}) {
  const sahnaRef = useRef(null)
  const canvasRef = useRef(null)
  const kartaReflar = useRef([])
  const olchamRef = useRef({ w: 600, h: 380 })
  const zarrachalarRef = useRef([])
  const kursorRef = useRef({ faol: false, x: 0, y: 0 })
  const ustidaRef = useRef(false)
  const holatRef = useRef({ tezlik, pauza, natija: Boolean(natijaTogriId), ixcham })

  holatRef.current = { tezlik, pauza, natija: Boolean(natijaTogriId), ixcham }

  useEffect(() => {
    const el = sahnaRef.current
    if (!el) return undefined

    const boshlaZarrachalar = (w, h) => {
      const padX = ixcham ? 44 : 62
      const padY = ixcham ? 30 : 38
      const ustun = 6
      const qator = 4
      const qadamX = (w - padX * 2) / (ustun - 1 || 1)
      const qadamY = (h - padY * 2) / (qator - 1 || 1)

      zarrachalarRef.current = Array.from({ length: 24 }, (_, i) => {
        const c = i % ustun
        const r = Math.floor(i / ustun)
        const burchak = (i * 2.39996) % (Math.PI * 2)
        return {
          x: padX + c * qadamX - w / 2,
          y: padY + r * qadamY - h / 2,
          vx: Math.cos(burchak),
          vy: Math.sin(burchak),
        }
      })
    }

    const yangilaOlcham = () => {
      const rect = el.getBoundingClientRect()
      const w = Math.max(260, rect.width)
      const h = Math.max(240, rect.height)
      olchamRef.current = { w, h }
      const canvas = canvasRef.current
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      if (zarrachalarRef.current.length === 0) {
        boshlaZarrachalar(w, h)
      }
    }

    yangilaOlcham()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(yangilaOlcham) : null
    observer?.observe(el)

    let oxirgiVaqt = performance.now()
    let kadrId = 0
    const kamHarakat =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const chiz = (hozir) => {
      const dt = Math.min(0.035, (hozir - oxirgiVaqt) / 1000)
      oxirgiVaqt = hozir

      const { w, h } = olchamRef.current
      const { tezlik: jTezlik, pauza: jPauza, natija: jNatija, ixcham: jIxcham } = holatRef.current
      const zlar = zarrachalarRef.current
      const padX = jIxcham ? 46 : 64
      const padY = jIxcham ? 28 : 38
      const chegaraX = Math.max(40, w / 2 - padX)
      const chegaraY = Math.max(40, h / 2 - padY)
      const minW = jIxcham ? 78 : 112
      const minH = jIxcham ? 44 : 58

      if (!kamHarakat && !jPauza && !jNatija) {
        const asosTezlik = (KVANT_TEZLIK[jTezlik] ?? KVANT_TEZLIK.orta) * (ustidaRef.current ? 0.25 : 1)
        for (let i = 0; i < zlar.length; i += 1) {
          const z = zlar[i]
          z.x += z.vx * asosTezlik * dt
          z.y += z.vy * asosTezlik * dt

          if (z.x < -chegaraX) {
            z.x = -chegaraX
            z.vx = Math.abs(z.vx)
          } else if (z.x > chegaraX) {
            z.x = chegaraX
            z.vx = -Math.abs(z.vx)
          }
          if (z.y < -chegaraY) {
            z.y = -chegaraY
            z.vy = Math.abs(z.vy)
          } else if (z.y > chegaraY) {
            z.y = chegaraY
            z.vy = -Math.abs(z.vy)
          }
        }

        // Kartalar bir-birini ustidan bosib ketmasligi uchun yumshoq elastik itarish.
        for (let i = 0; i < zlar.length; i += 1) {
          for (let j = i + 1; j < zlar.length; j += 1) {
            const a = zlar[i]
            const b = zlar[j]
            const dx = (b.x - a.x) / minW
            const dy = (b.y - a.y) / minH
            const d2 = dx * dx + dy * dy
            if (d2 > 0.0001 && d2 < 1) {
              const d = Math.sqrt(d2)
              const kuch = (1 - d) * 0.45
              const nx = dx / d
              const ny = dy / d
              a.x -= nx * kuch * minW
              a.y -= ny * kuch * minH
              b.x += nx * kuch * minW
              b.y += ny * kuch * minH
              a.vx -= nx * 0.25
              a.vy -= ny * 0.25
              b.vx += nx * 0.25
              b.vy += ny * 0.25
              // Tezlik vektorini normallashtirish energiya ortib ketishini to'xtatadi.
              const normA = Math.hypot(a.vx, a.vy) || 1
              const normB = Math.hypot(b.vx, b.vy) || 1
              a.vx /= normA
              a.vy /= normA
              b.vx /= normB
              b.vy /= normB
            }
          }
        }
      }

      for (let i = 0; i < zlar.length; i += 1) {
        const tugun = kartaReflar.current[i]
        if (!tugun) continue
        tugun.style.transform = `translate3d(${zlar[i].x.toFixed(1)}px, ${zlar[i].y.toFixed(1)}px, 0) translate(-50%, -50%)`
      }

      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const dpr = canvas.width / (w || 1)
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.clearRect(0, 0, w, h)
          const ox = w / 2
          const oy = h / 2
          const chegaraMasofa = jIxcham ? 125 : 165

          ctx.lineWidth = 1
          for (let i = 0; i < zlar.length; i += 1) {
            for (let j = i + 1; j < zlar.length; j += 1) {
              const dist = Math.hypot(zlar[i].x - zlar[j].x, zlar[i].y - zlar[j].y)
              if (dist < chegaraMasofa) {
                const alpha = (1 - dist / chegaraMasofa) * 0.28
                ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`
                ctx.beginPath()
                ctx.moveTo(ox + zlar[i].x, oy + zlar[i].y)
                ctx.lineTo(ox + zlar[j].x, oy + zlar[j].y)
                ctx.stroke()
              }
            }

            if (kursorRef.current.faol) {
              const kd = Math.hypot(zlar[i].x - kursorRef.current.x, zlar[i].y - kursorRef.current.y)
              if (kd < chegaraMasofa) {
                const alpha = (1 - kd / chegaraMasofa) * 0.48
                ctx.strokeStyle = `rgba(250, 204, 21, ${alpha.toFixed(3)})`
                ctx.beginPath()
                ctx.moveTo(ox + zlar[i].x, oy + zlar[i].y)
                ctx.lineTo(ox + kursorRef.current.x, oy + kursorRef.current.y)
                ctx.stroke()
              }
            }
          }
        }
      }

      kadrId = requestAnimationFrame(chiz)
    }

    kadrId = requestAnimationFrame(chiz)
    return () => {
      cancelAnimationFrame(kadrId)
      observer?.disconnect()
    }
  }, [ixcham])

  return (
    <div
      ref={sahnaRef}
      className={`${styles.kvantSahna} ${ixcham ? styles.kvantSahnaIxcham : ''}`}
      data-tuman={tuman ? 'true' : undefined}
      data-muz={muzlagan ? 'true' : undefined}
      data-natija={Boolean(natijaTogriId) ? 'true' : undefined}
      onPointerMove={(e) => {
        const rect = sahnaRef.current?.getBoundingClientRect()
        if (!rect) return
        kursorRef.current = {
          faol: true,
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2,
        }
      }}
      onPointerLeave={() => {
        kursorRef.current.faol = false
      }}
    >
      <canvas ref={canvasRef} className={styles.kvantTarmoq} aria-hidden="true" />
      <span className={styles.sharIzoh}>Zero-G kvant maydoni</span>

      <div
        className={styles.kvantKartalar}
        onPointerEnter={() => { ustidaRef.current = true }}
        onPointerLeave={() => { ustidaRef.current = false }}
      >
        {variantlar.map((variant, i) => (
          <div
            key={variant.id}
            ref={(el) => { kartaReflar.current[i] = el }}
            className={styles.kvantNuqta}
          >
            <KartaTugma
              variant={variant}
              indeks={i}
              model={model}
              natijaTogriId={natijaTogriId}
              xatoTanlovId={xatoTanlovId}
              teskariJuftlik={teskariJuftlik}
              ochirilganlar={ochirilganlar}
              ochirilgan={ochirilgan}
              nusxa={false}
              className={styles.kvantKarta}
              onTanla={onTanla}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DoskaOldindanKorish({ harakat = 'yolak', tezlik = 'orta' }) {
  const nuqtaReflar = useRef([])
  const holatRef = useRef({ harakat, tezlik })
  holatRef.current = { harakat, tezlik }

  useEffect(() => {
    if (harakat === 'yolak') return undefined
    let faza = 0
    let oxirgi = performance.now()
    let kadr = 0

    const chiz = (hozir) => {
      const dt = Math.min(0.05, (hozir - oxirgi) / 1000)
      oxirgi = hozir
      const { harakat: h, tezlik: t } = holatRef.current
      const mult = t === 'statik' ? 0 : t === 'sekin' ? 0.55 : t === 'tez' ? 1.8 : 1
      faza += dt * mult

      for (let i = 0; i < 8; i += 1) {
        const el = nuqtaReflar.current[i]
        if (!el) continue
        if (h === 'shar') {
          const y = 1 - (2 * i + 1) / 8
          const r = Math.sqrt(Math.max(0, 1 - y * y))
          const th = Math.PI * (3 - Math.sqrt(5)) * i + faza * 0.9
          const x = Math.cos(th) * r
          const z = Math.sin(th) * r
          const px = x * 52
          const py = y * 44
          const sc = 0.72 + (z + 1) * 0.2
          el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%) scale(${sc.toFixed(2)})`
          el.style.opacity = String((0.45 + (z + 1) * 0.27).toFixed(2))
          el.style.zIndex = String(Math.round((z + 1.2) * 10))
        } else if (h === 'orbital') {
          const ichki = i < 3
          const rx = ichki ? 38 : 74
          const ry = ichki ? 26 : 48
          const b = faza * (ichki ? 1.25 : -0.75) + (i * Math.PI * 2) / (ichki ? 3 : 5)
          el.style.transform = `translate3d(${(Math.cos(b) * rx).toFixed(1)}px, ${(Math.sin(b) * ry).toFixed(1)}px, 0) translate(-50%, -50%)`
          el.style.opacity = '1'
          el.style.zIndex = '5'
        } else if (h === 'kvant') {
          const bx = Math.sin(faza * (0.9 + i * 0.13) + i * 1.4) * 68
          const by = Math.cos(faza * (0.75 + i * 0.17) + i * 2.1) * 42
          el.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0) translate(-50%, -50%)`
          el.style.opacity = '1'
          el.style.zIndex = '5'
        }
      }
      kadr = requestAnimationFrame(chiz)
    }

    kadr = requestAnimationFrame(chiz)
    return () => cancelAnimationFrame(kadr)
  }, [harakat])

  if (harakat === 'yolak') {
    const vaqt = tezlik === 'sekin' ? '14s' : tezlik === 'tez' ? '5s' : '9s'
    return (
      <div className={styles.previewKarta} aria-hidden="true">
        <div className={styles.previewYolak} data-statik={tezlik === 'statik' ? 'true' : undefined} style={{ '--pv-vaqt': vaqt }}>
          {[0, 1].map((q) => (
            <div key={q} className={styles.previewQator}>
              <div className={styles.previewTasma}>
                {[...NAMUNA_FORMULALAR.slice(q * 4, q * 4 + 4), ...NAMUNA_FORMULALAR.slice(q * 4, q * 4 + 4)].map((f, idx) => (
                  <span key={`${q}-${idx}`} className={styles.previewChip}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <small className={styles.previewYorliq}>Jonli namuna: Chiziqli yo‘laklar</small>
      </div>
    )
  }

  return (
    <div className={styles.previewKarta} aria-hidden="true">
      <div className={styles.previewSahna}>
        {harakat === 'shar' && <span className={styles.previewSharDoira} />}
        {harakat === 'orbital' && (
          <>
            <span className={styles.previewOrbita1} />
            <span className={styles.previewOrbita2} />
          </>
        )}
        <div className={styles.previewMarkaz}>
          {NAMUNA_FORMULALAR.slice(0, 8).map((f, i) => (
            <span
              key={f}
              ref={(el) => { nuqtaReflar.current[i] = el }}
              className={styles.previewChipAbs}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      <small className={styles.previewYorliq}>
        Jonli namuna: {harakat === 'shar' ? '3D Shar' : harakat === 'orbital' ? 'Atom orbitallari' : 'Kvant maydon'}
      </small>
    </div>
  )
}

export function ZarrachaEffekt({ hodisa }) {
  if (!hodisa) return null
  return (
    <div key={hodisa.id} className={styles.effektOram} data-tur={hodisa.tur} aria-hidden="true">
      <span className={styles.uchuvchiMatn}>{hodisa.matn}</span>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={styles.zarracha} style={{ '--burchak': `${i * 36}deg` }} />
      ))}
    </div>
  )
}

export function MaxsusKartaTaklif({ taklif, duelMi = false, pauza = false, band = false, onBosish }) {
  const [qolganMs, setQolganMs] = useState(() => taklif?.davomiylikMs || 0)

  useEffect(() => {
    if (!taklif) return undefined
    setQolganMs(Math.max(0, taklif.tugaydi - Date.now()))
    if (pauza) return undefined

    const id = setInterval(() => {
      setQolganMs(Math.max(0, taklif.tugaydi - Date.now()))
    }, 50)
    return () => clearInterval(id)
  }, [taklif, pauza])

  if (!taklif || qolganMs <= 0) return null
  const bezak = kartaBezakOl(taklif.turi, duelMi)
  const foiz = Math.max(0, Math.min(100, (qolganMs / taklif.davomiylikMs) * 100))

  return (
    <button
      type="button"
      disabled={band}
      onClick={() => onBosish(taklif.id)}
      className={styles.maxsusKarta}
      data-tur={bezak.tur}
    >
      <span className={styles.maxsusKartaIkon}>
        <Ikon nom={bezak.ikon} olcham={20} />
      </span>
      <span className={styles.maxsusKartaMatn}>
        <strong>{bezak.nom}</strong>
        <small>{bezak.izoh}</small>
      </span>
      <span className={styles.maxsusKartaVaqt}>{(qolganMs / 1000).toFixed(1)}s</span>
      <span className={styles.maxsusKartaChiziq} style={{ width: `${foiz}%` }} aria-hidden="true" />
    </button>
  )
}
