'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import Ikon from '@/components/Ikon'
import {
  CpKLegend,
  KvantMaydonDoska,
  MaxsusKartaTaklif,
  OrbitalDoska,
  SharDoska,
  YolakDoska,
  ZarrachaEffekt,
} from './DoskaKorinish'
import SozlamaEkrani, { DARAJALAR, STANDART_KARTALAR, STANDART_SOZLAMA } from './SozlamaEkrani'
import YakunEkrani from './YakunEkrani'
import { sfxChal } from './ovozEfektlari'
import styles from './oyin.module.css'

const SOZLAMA_KALITI = 'jda-formulani-top-sozlama-v2'
const HARAKAT_TARTIBI = ['yolak', 'shar', 'orbital', 'kvant']
const HARAKAT_NOMI = {
  yolak: 'Yo‘laklar',
  shar: '3D Shar',
  orbital: 'Orbitallar',
  kvant: 'Kvant maydon',
}
const HARAKAT_IKON = {
  yolak: 'panjara',
  shar: 'yadro',
  orbital: 'atom',
  kvant: 'uchqun',
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

function vaqtMatni(ms) {
  if (ms === null || ms === undefined) return '∞'
  const jamiSek = Math.max(0, Math.ceil(ms / 1000))
  const min = Math.floor(jamiSek / 60)
  const sek = jamiSek % 60
  return `${String(min).padStart(2, '0')}:${String(sek).padStart(2, '0')}`
}

function taklifYasash(kartaTaklif, hozir) {
  if (!kartaTaklif) return null
  return {
    id: kartaTaklif.id,
    turi: kartaTaklif.turi,
    davomiylikMs: kartaTaklif.davomiylikMs,
    paydoBoladi: hozir + kartaTaklif.kechikishMs,
    tugaydi: hozir + kartaTaklif.kechikishMs + kartaTaklif.davomiylikMs,
  }
}

function muddatlarYasa(malumot, hozir = Date.now()) {
  return {
    vaqtTugaydi: malumot.qolganMs != null ? hozir + malumot.qolganMs : null,
    kombo2xTugaydi: malumot.kombo2xQolganMs > 0 ? hozir + malumot.kombo2xQolganMs : 0,
    teskariTugaydi: malumot.teskariQolganMs > 0 ? hozir + malumot.teskariQolganMs : 0,
    blokTugaydi: malumot.blokQolganMs > 0 ? hozir + malumot.blokQolganMs : 0,
    tumanTugaydi: malumot.tumanQolganMs > 0 ? hozir + malumot.tumanQolganMs : 0,
    taklif: taklifYasash(malumot.kartaTaklif, hozir),
  }
}

function duelOyinchiMuddat(p, hozir = Date.now()) {
  return {
    kombo2xTugaydi: p.kombo2xQolganMs > 0 ? hozir + p.kombo2xQolganMs : 0,
    teskariTugaydi: p.teskariQolganMs > 0 ? hozir + p.teskariQolganMs : 0,
    blokTugaydi: p.blokQolganMs > 0 ? hozir + p.blokQolganMs : 0,
    tumanTugaydi: p.tumanQolganMs > 0 ? hozir + p.tumanQolganMs : 0,
    taklif: taklifYasash(p.kartaTaklif, hozir),
  }
}

function muddatSiljit(m, delta) {
  if (!m) return m
  const siljit = (ts) => (ts && ts > 0 ? ts + delta : ts)
  return {
    ...m,
    vaqtTugaydi: m.vaqtTugaydi != null ? m.vaqtTugaydi + delta : null,
    kombo2xTugaydi: siljit(m.kombo2xTugaydi),
    teskariTugaydi: siljit(m.teskariTugaydi),
    blokTugaydi: siljit(m.blokTugaydi),
    tumanTugaydi: siljit(m.tumanTugaydi),
    taklif: m.taklif
      ? { ...m.taklif, paydoBoladi: m.taklif.paydoBoladi + delta, tugaydi: m.taklif.tugaydi + delta }
      : null,
  }
}

function DoskaTanla({ harakat, ...qolgan }) {
  if (harakat === 'shar') return <SharDoska {...qolgan} />
  if (harakat === 'orbital') return <OrbitalDoska {...qolgan} />
  if (harakat === 'kvant') return <KvantMaydonDoska {...qolgan} />
  return <YolakDoska {...qolgan} />
}

function UstunlikChizigi({ p1Nom, p1Ball, p2Nom, p2Ball }) {
  const jami = p1Ball + p2Ball
  const p1Ulush = jami === 0 ? 50 : Math.max(12, Math.min(88, Math.round((p1Ball / jami) * 100)))
  return (
    <div className={styles.ustunlikOram} aria-label="Hisob muvozanati">
      <div className={styles.ustunlikMatn}>
        <span data-tomon="p1">{p1Nom}: <b>{p1Ball}</b></span>
        <small>{p1Ball === p2Ball ? 'Teng kurash' : p1Ball > p2Ball ? `${p1Nom} oldinda` : `${p2Nom} oldinda`}</small>
        <span data-tomon="p2">{p2Nom}: <b>{p2Ball}</b></span>
      </div>
      <div className={styles.ustunlikChiziq}>
        <span className={styles.ustunlikP1} style={{ width: `${p1Ulush}%` }} />
      </div>
    </div>
  )
}

function sirliXabar(natija, duelMi) {
  switch (natija) {
    case 'bonus3':
      return '+3 bonus ball!'
    case 'kombo2x':
      return '2× Kombo!'
    case 'vaqt15':
      return '+15 soniya!'
    case 'yordam50':
      return '50/50 Yordam!'
    case 'qalqon':
      return 'Qalqon!'
    case 'tuman':
      return duelMi ? 'Raqibga tuman!' : 'Kutilmagan tuman!'
    case 'aralashtir':
      return duelMi ? 'Raqib aralashtirildi!' : 'Kartalar aralashdi!'
    default:
      return 'Sirli sovg‘a!'
  }
}

function kartaXabarMatni(res, duelMi, ijrochiNom = '') {
  const bosh = duelMi && ijrochiNom ? `${ijrochiNom}: ` : ''
  if (res.qalqonHimoya) return `${bosh}Qalqon yomon zarbani qaytardi!`
  if (res.zararsizlantirildi) return `${bosh}Xavf vaqtida zararsizlantirildi!`
  if (res.turi === 'sirli') return `${bosh}Sirli karta (?): ${sirliXabar(res.sirliNatija, duelMi)}`
  switch (res.turi) {
    case 'kombo2x':
      return `${bosh}2× Kombo faollashdi (16 soniya)!`
    case 'vaqt15':
      return `${bosh}Taymerga +15 soniya qo‘shildi!`
    case 'yordam50':
      return `${bosh}50/50 yordam: 12 ta xato karta o‘chirildi!`
    case 'qalqon':
      return `${bosh}Qalqon faollashdi!`
    case 'notogriBos':
      return duelMi
        ? `${bosh}Raqibga "Noto‘g‘risini bos!" tuzog‘i tashlandi!`
        : 'Teskari sinov: ajratilgan 2 kartadan NOTO‘G‘RISINI bosing (+2 ball)!'
    case 'muzlatish':
      return `${bosh}Raqib doskasi 3.5 soniyaga muzlatildi!`
    case 'tuman':
      return `${bosh}Raqib doskasiga 6s tuman tushirildi!`
    case 'aralashtir':
      return `${bosh}Raqibning 24 ta kartasi aralashtirib yuborildi!`
    case 'bomba':
      return `${bosh}BOMBA! -1 ball va jarima tushdi!`
    default:
      return ''
  }
}

function kartaSfxNomi(res) {
  if (res.qalqonHimoya || res.turi === 'qalqon') return 'qalqon'
  if (res.turi === 'bomba') return 'bomba'
  if (res.turi === 'yordam50') return 'yordam50'
  if (res.turi === 'sirli') return 'sirli'
  if (res.turi === 'muzlatish') return 'muz'
  if (['notogriBos', 'tuman', 'aralashtir'].includes(res.turi)) return 'tuzoq'
  return 'kartaOlindi'
}

export default function FormulaOyini() {
  const [sozlama, setSozlama] = useState(STANDART_SOZLAMA)
  const [harakat, setHarakat] = useState(STANDART_SOZLAMA.harakat)
  const [tezlik, setTezlik] = useState(STANDART_SOZLAMA.tezlik)
  const [ekranHolati, setEkranHolati] = useState('sozlama')

  const [savol, setSavol] = useState(null)
  const [natija, setNatija] = useState(null)
  const [tanlov, setTanlov] = useState(null)
  const [xatoKartalar, setXatoKartalar] = useState({ p1: null, p2: null })
  const [muddat, setMuddat] = useState(null)
  const [duelMuddat, setDuelMuddat] = useState({ p1: null, p2: null })

  const [vaqtDuel, setVaqtDuel] = useState({ p1: null, p2: null })
  const [vaqtMuddat, setVaqtMuddat] = useState({ p1: null, p2: null })
  const [vaqtXabar, setVaqtXabar] = useState({ p1: '', p2: '' })
  const [vaqtTugagan, setVaqtTugagan] = useState({ p1: null, p2: null })

  const [effektlar, setEffektlar] = useState({ yakka: null, p1: null, p2: null })
  const [silkinish, setSilkinish] = useState({ yakka: false, p1: false, p2: false })

  const [yakun, setYakun] = useState(null)
  const [kutilyapti, setKutilyapti] = useState(false)
  const [xato, setXato] = useState('')
  const [pauza, setPauza] = useState(false)
  const [matnOchiq, setMatnOchiq] = useState(false)
  const [ovozHolat, setOvozHolat] = useState('')
  const [kartaXabar, setKartaXabar] = useState('')
  const [toliq, setToliq] = useState(false)
  const [hozir, setHozir] = useState(() => Date.now())

  const qobiqRef = useRef(null)
  const gapRef = useRef(null)
  const pauzaBoshlandiRef = useRef(0)

  const umumiyNavbatRef = useRef(Promise.resolve())
  const p1NavbatRef = useRef(Promise.resolve())
  const p2NavbatRef = useRef(Promise.resolve())

  const savolRef = useRef(null)
  const natijaRef = useRef(null)
  const vaqtDuelRef = useRef({ p1: null, p2: null })
  const vaqtTugaganRef = useRef({ p1: null, p2: null })
  const taklifOvozRef = useRef(new Set())
  const taklifMuddatRef = useRef(new Set())
  const taklifSorovRef = useRef(new Set())
  const tugatSorovRef = useRef(new Set())
  const yuklandiRef = useRef(false)

  savolRef.current = savol
  natijaRef.current = natija
  vaqtDuelRef.current = vaqtDuel
  vaqtTugaganRef.current = vaqtTugagan

  // Sozlamalarni localStorage da xavfsiz saqlash (qayta kirganda tanlovlar saqlanadi).
  useEffect(() => {
    try {
      const saqlangan = localStorage.getItem(SOZLAMA_KALITI)
      if (saqlangan) {
        const parsed = JSON.parse(saqlangan)
        if (parsed && typeof parsed === 'object') {
          setSozlama({
            ...STANDART_SOZLAMA,
            ...parsed,
            kartalar: { ...STANDART_KARTALAR, ...(parsed.kartalar || {}) },
          })
        }
      }
    } catch {
      // Maxfiy rejimda localStorage bo'lmasligi mumkin.
    }
    yuklandiRef.current = true
  }, [])

  useEffect(() => {
    if (!yuklandiRef.current) return
    try {
      localStorage.setItem(SOZLAMA_KALITI, JSON.stringify(sozlama))
    } catch {
      // Saqlanmasa ham o'yin davom etadi.
    }
  }, [sozlama])

  function navbatgaQoy(ref, vazifa) {
    const keyingi = ref.current.then(vazifa, vazifa)
    ref.current = keyingi.catch(() => {})
    return keyingi
  }

  function effektYoq(kalit, tur, matn) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setEffektlar((prev) => ({ ...prev, [kalit]: { id, tur, matn } }))
    setTimeout(() => {
      setEffektlar((prev) => (prev[kalit]?.id === id ? { ...prev, [kalit]: null } : prev))
    }, 950)
  }

  function silkit(kalit) {
    setSilkinish((prev) => ({ ...prev, [kalit]: true }))
    setTimeout(() => {
      setSilkinish((prev) => ({ ...prev, [kalit]: false }))
    }, 450)
  }

  useEffect(() => {
    const yangila = () => setToliq(document.fullscreenElement === qobiqRef.current)
    document.addEventListener('fullscreenchange', yangila)
    return () => {
      document.removeEventListener('fullscreenchange', yangila)
      gapRef.current?.pause()
      gapRef.current = null
    }
  }, [])

  const ovozniToxtat = useCallback(() => {
    const audio = gapRef.current
    gapRef.current = null
    audio?.pause()
    setOvozHolat('')
  }, [])

  const oqi = useCallback((manzil, matnniOchish = true) => {
    ovozniToxtat()
    if (!manzil) {
      setOvozHolat('Ovoz fayli hali qo‘shilmagan.')
      if (matnniOchish) setMatnOchiq(true)
      return
    }
    const audio = new Audio(manzil)
    gapRef.current = audio
    setOvozHolat('Ovoz ijro etilmoqda…')

    function tugat(ishladi) {
      if (gapRef.current !== audio) return
      gapRef.current = null
      setOvozHolat(ishladi ? '' : 'Ovoz ijro etilmadi.')
      if (!ishladi && matnniOchish) setMatnOchiq(true)
    }

    audio.onended = () => tugat(true)
    audio.onerror = () => tugat(false)
    audio.play().catch(() => tugat(false))
  }, [ovozniToxtat])

  useEffect(() => {
    if (ekranHolati !== 'oyin' || pauza) return undefined
    const id = setInterval(() => {
      setHozir(Date.now())
    }, 100)
    return () => clearInterval(id)
  }, [ekranHolati, pauza])

  const yakkaKorsat = useCallback((keyingi, saqlashMatn = false, sinxronVaqt = Date.now()) => {
    setSavol(keyingi)
    savolRef.current = keyingi
    setNatija(null)
    natijaRef.current = null
    setTanlov(null)
    setXatoKartalar({ p1: null, p2: null })
    setMatnOchiq(saqlashMatn)
    setKartaXabar('')
    setMuddat(muddatlarYasa(keyingi, sinxronVaqt))
    if (keyingi.rejim === 'duel-savol') {
      setDuelMuddat({
        p1: duelOyinchiMuddat(keyingi.p1, sinxronVaqt),
        p2: duelOyinchiMuddat(keyingi.p2, sinxronVaqt),
      })
    }
    oqi(keyingi.audio, true)
  }, [oqi])

  async function oyinniBoshlash(tanlanganSozlama = sozlama) {
    if (kutilyapti) return
    setKutilyapti(true)
    setXato('')
    setKartaXabar('')
    setPauza(false)
    pauzaBoshlandiRef.current = 0
    taklifOvozRef.current.clear()
    taklifMuddatRef.current.clear()
    taklifSorovRef.current.clear()
    tugatSorovRef.current.clear()
    setEffektlar({ yakka: null, p1: null, p2: null })
    setHarakat(tanlanganSozlama.harakat)
    setTezlik(tanlanganSozlama.tezlik)

    try {
      const bosh = await sorov({
        amal: 'boshlash',
        sozlama: {
          daraja: tanlanganSozlama.daraja,
          rejim: tanlanganSozlama.rejim,
          duelKartaTartibi: tanlanganSozlama.duelKartaTartibi,
          kartaRitm: tanlanganSozlama.kartaRitm,
          savollarSoni: tanlanganSozlama.savollarSoni,
          vaqtSekund: tanlanganSozlama.vaqtSekund,
          kartalar: tanlanganSozlama.kartalar,
        },
      })

      const t = Date.now()
      setHozir(t)
      setYakun(null)

      if (bosh.rejim === 'duel-vaqt') {
        setSavol(null)
        setNatija(null)
        setVaqtDuel({ p1: bosh.p1, p2: bosh.p2 })
        vaqtDuelRef.current = { p1: bosh.p1, p2: bosh.p2 }
        setVaqtMuddat({
          p1: muddatlarYasa(bosh.p1, t),
          p2: muddatlarYasa(bosh.p2, t),
        })
        setVaqtXabar({ p1: '', p2: '' })
        setVaqtTugagan({ p1: null, p2: null })
        vaqtTugaganRef.current = { p1: null, p2: null }
        ovozniToxtat()
      } else {
        setVaqtDuel({ p1: null, p2: null })
        yakkaKorsat(bosh, tanlanganSozlama.matnDarhol, t)
      }

      setEkranHolati('oyin')
    } catch (e) {
      setXato(e.message)
    } finally {
      setKutilyapti(false)
    }
  }

  function yakkaJavob(id) {
    if (pauza || natijaRef.current) return
    navbatgaQoy(umumiyNavbatRef, async () => {
      if (natijaRef.current || !savolRef.current) return
      setTanlov(id)
      setXato('')
      try {
        const res = await sorov({ amal: 'javob', token: savolRef.current.token, tanlov: id })
        if (res.blokda || res.tuzoqKutilyapti) {
          setTanlov(null)
          setSavol((prev) => (prev ? { ...prev, token: res.token } : prev))
          return
        }
        if (res.qalqonIshladi) {
          sfxChal('qalqon', sozlama.ovozEfekt)
          effektYoq('yakka', 'qalqon', 'QALQON!')
          setTanlov(null)
          setKartaXabar('Qalqon xato bosishdan saqlab qoldi!')
          setSavol((prev) =>
            prev ? { ...prev, token: res.token, qalqon: res.qalqon, ochirilganlar: res.ochirilganlar } : prev
          )
          return
        }
        ovozniToxtat()
        if (res.vaqtTugadi) {
          sfxChal('galaba', sozlama.ovozEfekt)
          setYakun({ rejim: 'yakka', ...res, jami: savolRef.current.jami })
          setEkranHolati('yakun')
          return
        }
        sfxChal(res.togrimi ? (res.seriya >= 3 ? 'kombo' : 'togri') : 'xato', sozlama.ovozEfekt, res.seriya || 1)
        if (res.togrimi) {
          effektYoq('yakka', res.qoshilganBall >= 2 ? 'kombo' : 'togri', `+${res.qoshilganBall} ball!`)
        } else {
          silkit('yakka')
        }
        const tayyorNatija = { ...res, _olinganVaqt: Date.now() }
        setNatija(tayyorNatija)
        natijaRef.current = tayyorNatija
        setSavol((prev) => (prev ? { ...prev, ball: res.ball, seriya: res.seriya, qalqon: res.qalqon } : prev))
      } catch (e) {
        setTanlov(null)
        setXato(e.message)
      }
    })
  }

  function duelSavolJavob(oyinchi, id) {
    if (pauza || natijaRef.current) return
    const kalit = oyinchi === 1 ? 'p1' : 'p2'
    navbatgaQoy(umumiyNavbatRef, async () => {
      if (natijaRef.current || !savolRef.current) return
      setXato('')
      try {
        const res = await sorov({
          amal: 'javob',
          token: savolRef.current.token,
          tanlov: id,
          oyinchi,
        })
        if (res.vaqtTugadi) {
          ovozniToxtat()
          sfxChal('galaba', sozlama.ovozEfekt)
          setYakun({ rejim: 'duel-savol', ...res })
          setEkranHolati('yakun')
          return
        }

        const t = Date.now()
        if (res.blokda || res.tuzoqKutilyapti) {
          setSavol((prev) => (prev ? { ...prev, token: res.token } : prev))
          return
        }

        if (res.halQilindi) {
          ovozniToxtat()
          sfxChal(res.otkazildi ? 'xato' : 'kombo', sozlama.ovozEfekt, res.golib ? savolRef.current[kalit].seriya + 1 : 1)
          if (res.golib === 1 || res.golib === 2) {
            effektYoq(res.golib === 1 ? 'p1' : 'p2', 'kombo', `+${res.qoshilganBall} ball!`)
          }
          const tayyorNatija = { ...res, _olinganVaqt: t }
          setNatija(tayyorNatija)
          natijaRef.current = tayyorNatija
          setSavol((prev) =>
            prev ? { ...prev, p1: { ...prev.p1, ...res.p1 }, p2: { ...prev.p2, ...res.p2 } } : prev
          )
          return
        }

        if (res.qalqonIshladi) {
          sfxChal('qalqon', sozlama.ovozEfekt)
          effektYoq(kalit, 'qalqon', 'QALQON!')
          setKartaXabar(`${oyinchi === 1 ? p1Nom : p2Nom}: Qalqon xatodan asradi!`)
        } else if (res.tuzoqYechimi) {
          sfxChal(res.tuzoqYechimi === 'tushdi' ? 'tuzoq' : 'qalqon', sozlama.ovozEfekt)
          if (res.tuzoqYechimi === 'tushdi') silkit(kalit)
          setKartaXabar(
            res.tuzoqYechimi === 'qutuldi'
              ? `${oyinchi === 1 ? p1Nom : p2Nom} tuzoqdan qutuldi!`
              : res.tuzoqYechimi === 'qalqon'
                ? `${oyinchi === 1 ? p1Nom : p2Nom}: Qalqon tuzoqni qaytardi!`
                : `${oyinchi === 1 ? p1Nom : p2Nom} tuzoqqa tushdi (-1 ball)!`
          )
        } else if (res.xatoOyinchi) {
          sfxChal('xato', sozlama.ovozEfekt)
          const xKalit = res.xatoOyinchi === 1 ? 'p1' : 'p2'
          silkit(xKalit)
          setXatoKartalar((prev) => ({ ...prev, [xKalit]: res.xatoKartaId }))
          setTimeout(() => {
            setXatoKartalar((prev) => (prev[xKalit] === res.xatoKartaId ? { ...prev, [xKalit]: null } : prev))
          }, 1200)
        }

        setSavol((prev) =>
          prev ? { ...prev, token: res.token, p1: { ...prev.p1, ...res.p1 }, p2: { ...prev.p2, ...res.p2 } } : prev
        )
        setDuelMuddat({
          p1: duelOyinchiMuddat(res.p1, t),
          p2: duelOyinchiMuddat(res.p2, t),
        })
      } catch (e) {
        setXato(e.message)
      }
    })
  }

  const yopVaqtDuelTomon = useCallback((tomon, yakuniyMalumot) => {
    const yangiTugagan = { ...vaqtTugaganRef.current, [tomon]: yakuniyMalumot }
    vaqtTugaganRef.current = yangiTugagan
    setVaqtTugagan(yangiTugagan)

    if (yangiTugagan.p1 && yangiTugagan.p2) {
      sfxChal('galaba', sozlama.ovozEfekt)
      const barchaXatolar = [...(yangiTugagan.p1.xatolar || []), ...(yangiTugagan.p2.xatolar || [])]
      setYakun({
        rejim: 'duel-vaqt',
        p1: yangiTugagan.p1,
        p2: yangiTugagan.p2,
        xatolar: barchaXatolar,
      })
      setEkranHolati('yakun')
    }
  }, [sozlama.ovozEfekt])

  function vaqtDuelJavob(tomon, id) {
    if (pauza || vaqtTugaganRef.current[tomon]) return
    const navbatRef = tomon === 'p1' ? p1NavbatRef : p2NavbatRef
    navbatgaQoy(navbatRef, async () => {
      const joriy = vaqtDuelRef.current[tomon]
      if (!joriy || vaqtTugaganRef.current[tomon]) return
      try {
        const res = await sorov({ amal: 'javob', token: joriy.token, tanlov: id })
        if (res.blokda || res.tuzoqKutilyapti) {
          setVaqtDuel((prev) => ({ ...prev, [tomon]: prev[tomon] ? { ...prev[tomon], token: res.token } : null }))
          return
        }
        if (res.qalqonIshladi) {
          sfxChal('qalqon', sozlama.ovozEfekt)
          effektYoq(tomon, 'qalqon', 'QALQON!')
          setVaqtXabar((prev) => ({ ...prev, [tomon]: 'Qalqon xatodan saqladi!' }))
          setVaqtDuel((prev) => ({
            ...prev,
            [tomon]: prev[tomon]
              ? { ...prev[tomon], token: res.token, qalqon: res.qalqon, ochirilganlar: res.ochirilganlar }
              : null,
          }))
          return
        }
        if (res.vaqtTugadi) {
          yopVaqtDuelTomon(tomon, res)
          return
        }
        sfxChal(res.togrimi ? (res.seriya >= 3 ? 'kombo' : 'togri') : 'xato', sozlama.ovozEfekt, res.seriya || 1)
        if (res.togrimi) {
          effektYoq(tomon, res.qoshilganBall >= 2 ? 'kombo' : 'togri', `+${res.qoshilganBall}!`)
        } else {
          silkit(tomon)
        }
        setVaqtXabar((prev) => ({
          ...prev,
          [tomon]: res.togrimi ? `+${res.qoshilganBall} ball!` : `Xato: ${res.javob.formula}`,
        }))

        if (res.keyingi) {
          const t = Date.now()
          setVaqtDuel((prev) => ({ ...prev, [tomon]: res.keyingi }))
          vaqtDuelRef.current = { ...vaqtDuelRef.current, [tomon]: res.keyingi }
          setVaqtMuddat((prev) => ({ ...prev, [tomon]: muddatlarYasa(res.keyingi, t) }))
        }
      } catch (e) {
        setXato(e.message)
      }
    })
  }

  function maxsusKartaBosish(kartaId, oyinchi = null, tomon = null) {
    if (pauza) return
    if (tomon) {
      const navbatRef = tomon === 'p1' ? p1NavbatRef : p2NavbatRef
      const raqibTomon = tomon === 'p1' ? 'p2' : 'p1'
      const raqibNavbat = tomon === 'p1' ? p2NavbatRef : p1NavbatRef

      navbatgaQoy(navbatRef, async () => {
        const joriy = vaqtDuelRef.current[tomon]
        if (!joriy || vaqtTugaganRef.current[tomon]) return
        try {
          const res = await sorov({ amal: 'karta', token: joriy.token, kartaId })
          const t = Date.now()
          const yangi = {
            ...joriy,
            token: res.token,
            ...(res.ball !== undefined ? { ball: res.ball } : {}),
            ...(res.seriya !== undefined ? { seriya: res.seriya } : {}),
            ...(res.qalqon !== undefined ? { qalqon: res.qalqon } : {}),
            ...(res.ochirilganlar ? { ochirilganlar: res.ochirilganlar } : {}),
            ...(res.variantlar ? { variantlar: res.variantlar } : {}),
            ...(res.qolganMs != null ? { qolganMs: res.qolganMs } : {}),
            ...(res.kombo2xQolganMs != null ? { kombo2xQolganMs: res.kombo2xQolganMs } : {}),
            ...(res.blokQolganMs !== undefined ? { blokQolganMs: res.blokQolganMs } : {}),
            ...(res.tumanQolganMs !== undefined ? { tumanQolganMs: res.tumanQolganMs } : {}),
            ...(res.teskariJuftlik !== undefined ? { teskariJuftlik: res.teskariJuftlik } : {}),
            ...(res.teskariQolganMs !== undefined ? { teskariQolganMs: res.teskariQolganMs } : {}),
            kartaTaklif: res.kartaTaklif,
          }
          setVaqtDuel((prev) => ({ ...prev, [tomon]: yangi }))
          vaqtDuelRef.current = { ...vaqtDuelRef.current, [tomon]: yangi }
          setVaqtMuddat((prev) => ({ ...prev, [tomon]: muddatlarYasa(yangi, t) }))

          if (res.qabul) {
            sfxChal(kartaSfxNomi(res), sozlama.ovozEfekt)
            if (res.turi === 'bomba' && !res.qalqonHimoya) {
              silkit(tomon)
              effektYoq(tomon, 'bomba', 'BOMBA -1!')
            } else {
              effektYoq(tomon, 'kombo', res.turi === 'sirli' ? sirliXabar(res.sirliNatija, true) : '+KARTA!')
            }
            setVaqtXabar((prev) => ({ ...prev, [tomon]: kartaXabarMatni(res, true) }))

            if (sozlama.duelKartaTartibi === 'bir-xil' && !vaqtTugaganRef.current[raqibTomon]) {
              navbatgaQoy(raqibNavbat, async () => {
                const raqib = vaqtDuelRef.current[raqibTomon]
                if (!raqib || vaqtTugaganRef.current[raqibTomon]) return
                if (raqib.kartaTaklif?.id === kartaId) {
                  const bekor = await sorov({ amal: 'karta-bekor', token: raqib.token }).catch(() => null)
                  if (bekor?.token) {
                    const tb = Date.now()
                    const rYangi = { ...raqib, token: bekor.token, kartaTaklif: bekor.kartaTaklif }
                    setVaqtDuel((prev) => ({ ...prev, [raqibTomon]: rYangi }))
                    vaqtDuelRef.current = { ...vaqtDuelRef.current, [raqibTomon]: rYangi }
                    setVaqtMuddat((prev) => ({
                      ...prev,
                      [raqibTomon]: { ...prev[raqibTomon], taklif: taklifYasash(bekor.kartaTaklif, tb) },
                    }))
                  }
                }
              })
            }

            if (res.raqibTuzoqToken && !vaqtTugaganRef.current[raqibTomon]) {
              navbatgaQoy(raqibNavbat, async () => {
                const raqib = vaqtDuelRef.current[raqibTomon]
                if (!raqib || vaqtTugaganRef.current[raqibTomon]) return
                const tuzoqRes = await sorov({
                  amal: 'tuzoq-qabul',
                  token: raqib.token,
                  tuzoqToken: res.raqibTuzoqToken,
                })
                const t2 = Date.now()
                const yangiRaqib = {
                  ...raqib,
                  token: tuzoqRes.token,
                  qalqon: tuzoqRes.qalqon,
                  variantlar: tuzoqRes.variantlar || raqib.variantlar,
                  teskariJuftlik: tuzoqRes.teskariJuftlik,
                  teskariQolganMs: tuzoqRes.teskariQolganMs,
                }
                setVaqtDuel((prev) => ({ ...prev, [raqibTomon]: yangiRaqib }))
                vaqtDuelRef.current = { ...vaqtDuelRef.current, [raqibTomon]: yangiRaqib }
                setVaqtMuddat((prev) => ({
                  ...prev,
                  [raqibTomon]: {
                    ...prev[raqibTomon],
                    blokTugaydi: tuzoqRes.blokQolganMs > 0 ? t2 + tuzoqRes.blokQolganMs : prev[raqibTomon]?.blokTugaydi || 0,
                    tumanTugaydi: tuzoqRes.tumanQolganMs > 0 ? t2 + tuzoqRes.tumanQolganMs : prev[raqibTomon]?.tumanTugaydi || 0,
                    teskariTugaydi: tuzoqRes.teskariQolganMs > 0 ? t2 + tuzoqRes.teskariQolganMs : 0,
                  },
                }))
                setVaqtXabar((prev) => ({
                  ...prev,
                  [raqibTomon]: tuzoqRes.qalqonHimoya
                    ? 'Qalqon raqib hujumini qaytardi!'
                    : tuzoqRes.hujumTuri === 'muzlatish'
                      ? 'Raqib sizni muzlatdi!'
                      : tuzoqRes.hujumTuri === 'tuman'
                        ? 'Raqib doskaga tuman tushirdi!'
                        : tuzoqRes.hujumTuri === 'aralashtir'
                          ? 'Raqib kartalarni aralashtirdi!'
                          : 'Tuzoq! Noto‘g‘risini bosing!',
                }))
                sfxChal(tuzoqRes.qalqonHimoya ? 'qalqon' : 'tuzoq', sozlama.ovozEfekt)
              })
            }
          }
        } catch {
          // Vaqt o'tib ketgan karta jim yopiladi.
        }
      })
      return
    }

    navbatgaQoy(umumiyNavbatRef, async () => {
      if (!savolRef.current || natijaRef.current) return
      try {
        const res = await sorov({
          amal: 'karta',
          token: savolRef.current.token,
          kartaId,
          ...(oyinchi ? { oyinchi } : {}),
        })
        const t = Date.now()
        if (!res.qabul) {
          setSavol((prev) => (prev ? { ...prev, token: res.token, kartaTaklif: null } : prev))
          setMuddat((prev) => (prev ? { ...prev, taklif: null } : prev))
          return
        }

        sfxChal(kartaSfxNomi(res), sozlama.ovozEfekt)
        const eKalit = oyinchi ? (oyinchi === 1 ? 'p1' : 'p2') : 'yakka'
        if (res.turi === 'bomba' && !res.qalqonHimoya) {
          silkit(eKalit)
          effektYoq(eKalit, 'bomba', 'BOMBA!')
        } else {
          effektYoq(
            eKalit,
            res.qalqonHimoya || res.turi === 'qalqon' ? 'qalqon' : 'kombo',
            res.turi === 'sirli' ? sirliXabar(res.sirliNatija, Boolean(oyinchi)) : '+KARTA!'
          )
        }

        if (savolRef.current.rejim === 'duel-savol') {
          const ijrochi = oyinchi === 1 ? p1Nom : p2Nom
          setKartaXabar(kartaXabarMatni(res, true, ijrochi))
          const yangiSavol = {
            ...savolRef.current,
            token: res.token,
            qolganMs: res.qolganMs,
            kartaTaklif: res.kartaTaklif,
            p1: { ...savolRef.current.p1, ...res.p1 },
            p2: { ...savolRef.current.p2, ...res.p2 },
          }
          setSavol(yangiSavol)
          setMuddat((prev) => ({
            ...muddatlarYasa(yangiSavol, t),
            vaqtTugaydi: yangiSavol.qolganMs != null ? t + yangiSavol.qolganMs : prev?.vaqtTugaydi ?? null,
          }))
          setDuelMuddat({
            p1: duelOyinchiMuddat(yangiSavol.p1, t),
            p2: duelOyinchiMuddat(yangiSavol.p2, t),
          })
        } else {
          setKartaXabar(kartaXabarMatni(res, false))
          const yangiSavol = {
            ...savolRef.current,
            token: res.token,
            ball: res.ball ?? savolRef.current.ball,
            seriya: res.seriya ?? savolRef.current.seriya,
            qalqon: res.qalqon ?? savolRef.current.qalqon,
            ochirilganlar: res.ochirilganlar ?? savolRef.current.ochirilganlar,
            variantlar: res.variantlar ?? savolRef.current.variantlar,
            qolganMs: res.qolganMs,
            kombo2xQolganMs: res.kombo2xQolganMs,
            blokQolganMs: res.blokQolganMs,
            tumanQolganMs: res.tumanQolganMs,
            teskariJuftlik: res.teskariJuftlik,
            teskariQolganMs: res.teskariQolganMs,
            kartaTaklif: res.kartaTaklif,
          }
          setSavol(yangiSavol)
          setMuddat(muddatlarYasa(yangiSavol, t))
        }
      } catch {
        // Karta muddati tugagan bo'lsa xato chiqarmaymiz.
      }
    })
  }

  useEffect(() => {
    if (ekranHolati !== 'oyin' || pauza) return
    const faolKartaBormi = Object.values(sozlama.kartalar).some(Boolean)

    const taklifOvozTekshir = (t) => {
      if (!t || hozir < t.paydoBoladi || hozir >= t.tugaydi) return
      if (!taklifOvozRef.current.has(t.id)) {
        taklifOvozRef.current.add(t.id)
        sfxChal('kartaChiqdi', sozlama.ovozEfekt)
      }
    }

    if (sozlama.rejim === 'duel-vaqt') {
      ;(['p1', 'p2']).forEach((tomon) => {
        const m = vaqtMuddat[tomon]
        const joriy = vaqtDuel[tomon]
        if (!m || !joriy || vaqtTugagan[tomon]) return
        taklifOvozTekshir(m.taklif)

        if (m.vaqtTugaydi != null && hozir >= m.vaqtTugaydi && !tugatSorovRef.current.has(tomon)) {
          tugatSorovRef.current.add(tomon)
          const navbat = tomon === 'p1' ? p1NavbatRef : p2NavbatRef
          navbatgaQoy(navbat, async () => {
            try {
              const res = await sorov({ amal: 'tugat', token: vaqtDuelRef.current[tomon].token })
              yopVaqtDuelTomon(tomon, res)
            } catch {
              tugatSorovRef.current.delete(tomon)
            }
          })
          return
        }

        if (m.taklif && hozir >= m.taklif.tugaydi + 2000 && !taklifSorovRef.current.has(m.taklif.id) && faolKartaBormi) {
          taklifSorovRef.current.add(m.taklif.id)
          const navbat = tomon === 'p1' ? p1NavbatRef : p2NavbatRef
          navbatgaQoy(navbat, async () => {
            const oqim = vaqtDuelRef.current[tomon]
            if (!oqim || vaqtTugaganRef.current[tomon]) return
            try {
              const res = await sorov({ amal: 'karta-yangi', token: oqim.token })
              const t = Date.now()
              const yangi = { ...oqim, token: res.token, kartaTaklif: res.kartaTaklif }
              setVaqtDuel((prev) => ({ ...prev, [tomon]: yangi }))
              vaqtDuelRef.current = { ...vaqtDuelRef.current, [tomon]: yangi }
              setVaqtMuddat((prev) => ({
                ...prev,
                [tomon]: { ...prev[tomon], taklif: taklifYasash(res.kartaTaklif, t) },
              }))
            } catch {
              // Keyingi javobda yangilanadi.
            }
          })
        }
      })
      return
    }

    if (!savol || !muddat) return
    taklifOvozTekshir(muddat.taklif)
    if (savol.rejim === 'duel-savol' && savol.duelKartaTartibi === 'har-xil') {
      taklifOvozTekshir(duelMuddat.p1?.taklif)
      taklifOvozTekshir(duelMuddat.p2?.taklif)
    }

    if (muddat.vaqtTugaydi != null && hozir >= muddat.vaqtTugaydi && !tugatSorovRef.current.has('asosiy')) {
      tugatSorovRef.current.add('asosiy')
      navbatgaQoy(umumiyNavbatRef, async () => {
        if (!savolRef.current) return
        try {
          const res = await sorov({ amal: 'tugat', token: savolRef.current.token })
          ovozniToxtat()
          sfxChal('galaba', sozlama.ovozEfekt)
          setYakun({ rejim: savolRef.current.rejim, ...res, jami: savolRef.current.jami })
          setEkranHolati('yakun')
        } catch {
          tugatSorovRef.current.delete('asosiy')
        }
      })
      return
    }

    if (
      !natija &&
      savol.rejim === 'yakka' &&
      muddat.taklif &&
      ['muzlatish', 'tuman', 'aralashtir'].includes(muddat.taklif.turi) &&
      hozir >= muddat.taklif.tugaydi &&
      !taklifMuddatRef.current.has(muddat.taklif.id)
    ) {
      taklifMuddatRef.current.add(muddat.taklif.id)
      const tugaganId = muddat.taklif.id
      navbatgaQoy(umumiyNavbatRef, async () => {
        if (!savolRef.current || natijaRef.current) return
        try {
          const res = await sorov({ amal: 'karta-muddat', token: savolRef.current.token, kartaId: tugaganId })
          const t = Date.now()
          const yangiSavol = {
            ...savolRef.current,
            token: res.token,
            qalqon: res.qalqon ?? savolRef.current.qalqon,
            variantlar: res.variantlar ?? savolRef.current.variantlar,
            kartaTaklif: res.kartaTaklif,
          }
          if (res.qalqonHimoya) {
            sfxChal('qalqon', sozlama.ovozEfekt)
            effektYoq('yakka', 'qalqon', 'QALQON!')
            setKartaXabar('Qalqon yomon karta ta’sirini qaytardi!')
          } else if (res.qollandi) {
            sfxChal('muz', sozlama.ovozEfekt)
            silkit('yakka')
            setKartaXabar(
              res.qollandiTuri === 'muzlatish'
                ? 'Ulgurmadingiz! Doska 2.5 soniyaga muzladi!'
                : res.qollandiTuri === 'tuman'
                  ? 'Ulgurmadingiz! 6 soniyalik tuman tushdi!'
                  : 'Ulgurmadingiz! Kartalar joyi almashib ketdi!'
            )
          }
          setSavol(yangiSavol)
          setMuddat((prev) =>
            prev
              ? {
                  ...prev,
                  blokTugaydi: res.blokQolganMs > 0 ? t + res.blokQolganMs : prev.blokTugaydi,
                  tumanTugaydi: res.tumanQolganMs > 0 ? t + res.tumanQolganMs : prev.tumanTugaydi,
                  taklif: taklifYasash(res.kartaTaklif, t),
                }
              : prev
          )
        } catch {
          // Keyingi siklda yangilanadi.
        }
      })
      return
    }

    if (
      !natija &&
      savol.rejim === 'duel-savol' &&
      savol.duelKartaTartibi === 'har-xil' &&
      faolKartaBormi
    ) {
      const p1Tugadi = duelMuddat.p1?.taklif && hozir >= duelMuddat.p1.taklif.tugaydi + 2000
      const p2Tugadi = duelMuddat.p2?.taklif && hozir >= duelMuddat.p2.taklif.tugaydi + 2000
      const sorovKalit = p1Tugadi ? duelMuddat.p1.taklif.id : p2Tugadi ? duelMuddat.p2.taklif.id : null
      if (sorovKalit && !taklifSorovRef.current.has(sorovKalit)) {
        taklifSorovRef.current.add(sorovKalit)
        navbatgaQoy(umumiyNavbatRef, async () => {
          if (!savolRef.current || natijaRef.current) return
          try {
            const res = await sorov({ amal: 'karta-yangi', token: savolRef.current.token })
            const t = Date.now()
            const yangiSavol = {
              ...savolRef.current,
              token: res.token,
              p1: { ...savolRef.current.p1, ...res.p1 },
              p2: { ...savolRef.current.p2, ...res.p2 },
            }
            setSavol(yangiSavol)
            setDuelMuddat({
              p1: duelOyinchiMuddat(yangiSavol.p1, t),
              p2: duelOyinchiMuddat(yangiSavol.p2, t),
            })
          } catch {
            // Keyingi javobda yangilanadi.
          }
        })
      }
      return
    }

    if (!natija && muddat.taklif && hozir >= muddat.taklif.tugaydi + 2200 && !taklifSorovRef.current.has(muddat.taklif.id) && faolKartaBormi) {
      taklifSorovRef.current.add(muddat.taklif.id)
      navbatgaQoy(umumiyNavbatRef, async () => {
        if (!savolRef.current || natijaRef.current) return
        try {
          const res = await sorov({ amal: 'karta-yangi', token: savolRef.current.token })
          const t = Date.now()
          const yangiSavol = { ...savolRef.current, token: res.token, kartaTaklif: res.kartaTaklif }
          setSavol(yangiSavol)
          setMuddat((prev) => (prev ? { ...prev, taklif: taklifYasash(res.kartaTaklif, t) } : prev))
        } catch {
          // Keyingi javobda yangilanadi.
        }
      })
    }
  }, [duelMuddat, ekranHolati, hozir, muddat, natija, ovozniToxtat, pauza, savol, sozlama, vaqtDuel, vaqtMuddat, vaqtTugagan, yopVaqtDuelTomon])

  const pauzaAlmashtir = useCallback(async () => {
    const yangiPauza = !pauza
    setPauza(yangiPauza)
    if (yangiPauza) {
      pauzaBoshlandiRef.current = Date.now()
      ovozniToxtat()
    } else {
      const delta = pauzaBoshlandiRef.current ? Date.now() - pauzaBoshlandiRef.current : 0
      pauzaBoshlandiRef.current = 0
      setHozir(Date.now())
      setMuddat((m) => muddatSiljit(m, delta))
      setDuelMuddat((d) => ({ p1: muddatSiljit(d.p1, delta), p2: muddatSiljit(d.p2, delta) }))
      setVaqtMuddat((d) => ({ p1: muddatSiljit(d.p1, delta), p2: muddatSiljit(d.p2, delta) }))
    }

    const amal = yangiPauza ? 'pauza' : 'davom'
    if (sozlama.rejim === 'duel-vaqt') {
      ;(['p1', 'p2']).forEach((tomon) => {
        const navbat = tomon === 'p1' ? p1NavbatRef : p2NavbatRef
        navbatgaQoy(navbat, async () => {
          const joriy = vaqtDuelRef.current[tomon]
          if (!joriy || vaqtTugaganRef.current[tomon]) return
          const res = await sorov({ amal, token: joriy.token }).catch(() => null)
          if (res?.token) {
            setVaqtDuel((prev) => ({ ...prev, [tomon]: prev[tomon] ? { ...prev[tomon], token: res.token } : null }))
          }
        })
      })
    } else if (savolRef.current) {
      navbatgaQoy(umumiyNavbatRef, async () => {
        if (!savolRef.current) return
        const res = await sorov({ amal, token: savolRef.current.token }).catch(() => null)
        if (res?.token) {
          setSavol((prev) => (prev ? { ...prev, token: res.token } : prev))
        }
      })
    }
  }, [ovozniToxtat, pauza, sozlama.rejim])

  // Tezkor klaviatura boshqaruvi (Enter = Keyingi savol, Space = Eshitish, H = Ishora, P = Pauza).
  useEffect(() => {
    if (ekranHolati !== 'oyin') return undefined
    const tugmaBosildi = (e) => {
      const teg = e.target?.tagName
      if (teg === 'INPUT' || teg === 'TEXTAREA') return
      if (e.code === 'KeyP') {
        e.preventDefault()
        pauzaAlmashtir()
      } else if (e.code === 'KeyH' && savolRef.current) {
        e.preventDefault()
        setMatnOchiq((v) => !v)
      } else if (e.code === 'Space' && savolRef.current && !natijaRef.current && savolRef.current.audio) {
        e.preventDefault()
        oqi(savolRef.current.audio, false)
      } else if (e.code === 'Enter' && natijaRef.current && savolRef.current) {
        e.preventDefault()
        const n = natijaRef.current
        if (n.keyingi) {
          yakkaKorsat(n.keyingi, sozlama.matnDarhol, n._olinganVaqt || Date.now())
        } else {
          sfxChal('galaba', sozlama.ovozEfekt)
          if (savolRef.current.rejim === 'duel-savol') {
            setYakun({ rejim: 'duel-savol', p1: n.p1, p2: n.p2, xatolar: n.xatolar })
          } else {
            setYakun({ rejim: 'yakka', ...n, jami: savolRef.current.jami })
          }
          setEkranHolati('yakun')
        }
      }
    }
    window.addEventListener('keydown', tugmaBosildi)
    return () => window.removeEventListener('keydown', tugmaBosildi)
  }, [ekranHolati, oqi, pauzaAlmashtir, sozlama.matnDarhol, sozlama.ovozEfekt, yakkaKorsat])

  function harakatAlmashtir() {
    setHarakat((h) => HARAKAT_TARTIBI[(HARAKAT_TARTIBI.indexOf(h) + 1) % HARAKAT_TARTIBI.length])
  }

  function sozlamagaQaytish() {
    ovozniToxtat()
    setSavol(null)
    setNatija(null)
    setVaqtDuel({ p1: null, p2: null })
    setYakun(null)
    setXato('')
    setPauza(false)
    setEkranHolati('sozlama')
  }

  async function ekran() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await qobiqRef.current.requestFullscreen()
    } catch {
      setXato('Brauzer to‘liq ekran rejimini yoqa olmadi.')
    }
  }

  const faolTaklifKorinishi = (m) => {
    if (!m?.taklif) return null
    if (hozir < m.taklif.paydoBoladi || hozir >= m.taklif.tugaydi) return null
    return m.taklif
  }

  const p1Nom = sozlama.p1Nom?.trim() || '1-o‘yinchi'
  const p2Nom = sozlama.p2Nom?.trim() || '2-o‘yinchi'
  const darajaNom = DARAJALAR.find((d) => d.id === sozlama.daraja)?.nom || 'Oson'
  const keyingiHarakat = HARAKAT_TARTIBI[(HARAKAT_TARTIBI.indexOf(harakat) + 1) % HARAKAT_TARTIBI.length]

  return (
    <main ref={qobiqRef} data-fon="tun" className={`v3 ${styles.sahifa}`}>
      <div className={styles.fon} aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      <div className={styles.qobiq}>
        <header className={styles.sarlavha}>
          <Link href="/oyinlar" className={styles.tugma}>
            <Ikon nom="chap" olcham={18} /> O‘yinlar
          </Link>
          <div className={styles.amallar}>
            {ekranHolati === 'oyin' && (
              <>
                <button type="button" className={styles.tugma} onClick={harakatAlmashtir}>
                  <Ikon nom={HARAKAT_IKON[keyingiHarakat]} olcham={18} />
                  {HARAKAT_NOMI[keyingiHarakat]}
                </button>
                <button type="button" className={styles.tugma} onClick={pauzaAlmashtir}>
                  <Ikon nom={pauza ? 'play' : 'soat'} olcham={18} />
                  {pauza ? 'Davom ettirish' : 'Pauza'}
                </button>
                <button type="button" className={styles.tugma} onClick={sozlamagaQaytish}>
                  <Ikon nom="sozlama" olcham={18} /> Sozlamalar
                </button>
              </>
            )}
            <button type="button" className={styles.tugma} onClick={ekran}>
              <Ikon nom={toliq ? 'kichraytirish' : 'kengaytirish'} olcham={18} />
              {toliq ? 'Chiqish' : 'To‘liq ekran'}
            </button>
          </div>
        </header>

        {xato && <p className={styles.xato} role="alert">{xato}</p>}

        {ekranHolati === 'sozlama' && (
          <SozlamaEkrani
            sozlama={sozlama}
            onOzgartir={setSozlama}
            onQaytaTiklash={() => setSozlama(STANDART_SOZLAMA)}
            onBoshlash={() => oyinniBoshlash(sozlama)}
            kutilyapti={kutilyapti}
          />
        )}

        {/* 1. YAKKA O'YIN */}
        {ekranHolati === 'oyin' && savol && savol.rejim === 'yakka' && (
          <section
            className={styles.oyin}
            data-kombo-faol={muddat?.kombo2xTugaydi > hozir ? 'true' : undefined}
            data-silkinish={silkinish.yakka ? 'true' : undefined}
            aria-label="O‘yin doskasi"
          >
            <div className={styles.hisobPanel}>
              <div className={styles.hisobChap}>
                <h1>Formulani top</h1>
                <span className={styles.holatChip}>{darajaNom} · {savol.tartib}/{savol.jami}</span>
                {savol.seriya >= 2 && (
                  <span className={styles.seriyaChip}>
                    <Ikon nom="olov" olcham={15} /> {savol.seriya}× seriya
                  </span>
                )}
                {savol.qalqon && (
                  <span className={styles.qalqonChip}>
                    <Ikon nom="qalqon" olcham={15} /> Qalqon
                  </span>
                )}
                {muddat?.kombo2xTugaydi > hozir && (
                  <span className={styles.komboChip}>
                    <Ikon nom="chaqmoq" olcham={15} /> 2× · {Math.ceil((muddat.kombo2xTugaydi - hozir) / 1000)}s
                  </span>
                )}
                {muddat?.tumanTugaydi > hozir && (
                  <span className={styles.tumanChip}>
                    Tuman · {Math.ceil((muddat.tumanTugaydi - hozir) / 1000)}s
                  </span>
                )}
              </div>

              <div className={styles.hisobOng}>
                {muddat?.vaqtTugaydi != null && (
                  <span
                    className={styles.taymerChip}
                    data-shoshilinch={muddat.vaqtTugaydi - hozir <= 15000 ? 'true' : undefined}
                  >
                    <Ikon nom="vaqt" olcham={16} /> {vaqtMatni(muddat.vaqtTugaydi - hozir)}
                  </span>
                )}
                <span className={styles.ballChip}>Ball: {natija?.ball ?? savol.ball}</span>
              </div>
            </div>

            <div className={styles.amallar}>
              <button
                type="button"
                className={styles.tugma}
                disabled={!savol.audio || Boolean(natija)}
                onClick={() => oqi(savol.audio, false)}
              >
                <Ikon nom="ovoz" olcham={17} /> Qayta eshitish
              </button>
              <button type="button" className={styles.tugma} onClick={() => setMatnOchiq((v) => !v)}>
                <Ikon nom={matnOchiq ? 'kuzatuvYopiq' : 'kuzatuv'} olcham={17} />
                {matnOchiq ? 'Ishorani yashirish' : 'Ishorani ko‘rsatish'}
              </button>
              {!natija && (
                <button type="button" className={styles.tugma} onClick={() => yakkaJavob(null)}>
                  Savolni o‘tkazish
                </button>
              )}
            </div>

            <div className={styles.ishora} role="status">
              <span>{matnOchiq ? savol.ishora : ovozHolat || (natija ? '' : 'Doska ustidagi mos variantni bosing.')}</span>
              {kartaXabar && <small className={styles.kartaXabar}>{kartaXabar}</small>}
            </div>

            {muddat?.teskariTugaydi > hozir && savol.teskariJuftlik && !natija && (
              <div className={styles.teskariBanner} role="alert">
                <Ikon nom="ogohlantirish" olcham={18} />
                <span>
                  TESKARI SINOV ({Math.ceil((muddat.teskariTugaydi - hozir) / 1000)}s): Ajratilgan 2 ta kartadan{' '}
                  <strong>NOTO‘G‘RISINI</strong> bosing! (+2 bonus ball)
                </span>
              </div>
            )}

            {muddat?.blokTugaydi > hozir && !natija && (
              <div className={styles.blokBanner}>
                Muzlatish bloki: {((muddat.blokTugaydi - hozir) / 1000).toFixed(1)}s
              </div>
            )}

            <div className={styles.doskaOram}>
              <ZarrachaEffekt hodisa={effektlar.yakka} />
              {!natija && (
                <div className={styles.taklifJoy}>
                  <MaxsusKartaTaklif
                    taklif={faolTaklifKorinishi(muddat)}
                    duelMi={false}
                    pauza={pauza}
                    onBosish={(kartaId) => maxsusKartaBosish(kartaId)}
                  />
                </div>
              )}

              <DoskaTanla
                harakat={harakat}
                tezlik={tezlik}
                pauza={pauza}
                tuman={muddat?.tumanTugaydi > hozir && !natija}
                muzlagan={muddat?.blokTugaydi > hozir && !natija}
                variantlar={savol.variantlar}
                model={savol.model}
                ochirilgan={Boolean(natija) || muddat?.blokTugaydi > hozir}
                ochirilganlar={savol.ochirilganlar}
                natijaTogriId={natija?.togriId || null}
                xatoTanlovId={natija && !natija.togrimi ? tanlov : null}
                teskariJuftlik={muddat?.teskariTugaydi > hozir && !natija ? savol.teskariJuftlik : null}
                onTanla={yakkaJavob}
              />
            </div>

            {savol.model && <CpKLegend />}

            {natija && (
              <div className={styles.natija} role="status">
                <div>
                  <strong>
                    {natija.togrimi
                      ? `To‘g‘ri! +${natija.qoshilganBall} ball · `
                      : natija.teskariNatija === 'tuzoqqa-tushdi'
                        ? 'Tuzoqqa tushdingiz! To‘g‘ri javob: '
                        : 'To‘g‘ri javob: '}
                    {natija.javob.nom} · {natija.javob.formula}
                  </strong>
                  {natija.manba && (
                    <p>
                      {savol.ishora}{' '}
                      <a href={natija.manba} target="_blank" rel="noreferrer">
                        Tarixiy manba ↗
                      </a>
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.asosiy}
                  onClick={() => {
                    if (natija.keyingi) {
                      yakkaKorsat(natija.keyingi, sozlama.matnDarhol, natija._olinganVaqt || Date.now())
                    } else {
                      sfxChal('galaba', sozlama.ovozEfekt)
                      setYakun({ rejim: 'yakka', ...natija, jami: savol.jami })
                      setEkranHolati('yakun')
                    }
                  }}
                >
                  {natija.keyingi ? 'Keyingi savol' : 'Natijani ko‘rish'}
                </button>
              </div>
            )}
          </section>
        )}

        {/* 2. 1v1 — BITTA SAVOLDA POYGA */}
        {ekranHolati === 'oyin' && savol && savol.rejim === 'duel-savol' && (
          <section className={styles.oyin} aria-label="1v1 poyga doskasi">
            <div className={styles.hisobPanel}>
              <div className={styles.hisobChap}>
                <h1>1v1 Poyga</h1>
                <span className={styles.holatChip}>
                  {darajaNom} · {savol.tartib}/{savol.jami} · {savol.duelKartaTartibi === 'har-xil' ? 'Ikki xil karta' : 'Bir xil karta'}
                </span>
              </div>
              <div className={styles.hisobOng}>
                {muddat?.vaqtTugaydi != null && (
                  <span
                    className={styles.taymerChip}
                    data-shoshilinch={muddat.vaqtTugaydi - hozir <= 15000 ? 'true' : undefined}
                  >
                    <Ikon nom="vaqt" olcham={16} /> {vaqtMatni(muddat.vaqtTugaydi - hozir)}
                  </span>
                )}
              </div>
            </div>

            <UstunlikChizigi p1Nom={p1Nom} p1Ball={savol.p1.ball} p2Nom={p2Nom} p2Ball={savol.p2.ball} />

            <div className={styles.ishoraDuel}>
              <div className={styles.amallar}>
                <button
                  type="button"
                  className={styles.tugma}
                  disabled={!savol.audio || Boolean(natija)}
                  onClick={() => oqi(savol.audio, false)}
                >
                  <Ikon nom="ovoz" olcham={17} /> Eshitish
                </button>
                <button type="button" className={styles.tugma} onClick={() => setMatnOchiq((v) => !v)}>
                  <Ikon nom={matnOchiq ? 'kuzatuvYopiq' : 'kuzatuv'} olcham={17} />
                  {matnOchiq ? 'Yashirish' : 'Matn'}
                </button>
                {!natija && (
                  <button type="button" className={styles.tugma} onClick={() => duelSavolJavob(0, null)}>
                    O‘tkazish
                  </button>
                )}
              </div>
              <div className={styles.ishoraMatn} role="status">
                <strong>{matnOchiq ? savol.ishora : ovozHolat || 'Kim birinchi to‘g‘ri kartani bossa ball oladi!'}</strong>
                {kartaXabar && <small className={styles.kartaXabar}>{kartaXabar}</small>}
              </div>
            </div>

            {natija && (
              <div className={styles.natija} role="status">
                <div>
                  <strong>
                    {natija.golib === 1
                      ? `${p1Nom} topdi (+${natija.qoshilganBall} ball)! `
                      : natija.golib === 2
                        ? `${p2Nom} topdi (+${natija.qoshilganBall} ball)! `
                        : 'Savol o‘tkazildi. '}
                    {natija.javob.nom} · {natija.javob.formula}
                  </strong>
                </div>
                <button
                  type="button"
                  className={styles.asosiy}
                  onClick={() => {
                    if (natija.keyingi) {
                      yakkaKorsat(natija.keyingi, sozlama.matnDarhol, natija._olinganVaqt || Date.now())
                    } else {
                      sfxChal('galaba', sozlama.ovozEfekt)
                      setYakun({
                        rejim: 'duel-savol',
                        p1: natija.p1,
                        p2: natija.p2,
                        xatolar: natija.xatolar,
                      })
                      setEkranHolati('yakun')
                    }
                  }}
                >
                  {natija.keyingi ? 'Keyingi savol' : 'Yakuniy natija'}
                </button>
              </div>
            )}

            <div className={styles.duelGrid} data-joylashuv={sozlama.duelJoylashuv}>
              {[
                { kalit: 'p1', raqam: 1, nom: p1Nom, p: savol.p1, pm: duelMuddat.p1, togriId: natija?.togriId1 },
                { kalit: 'p2', raqam: 2, nom: p2Nom, p: savol.p2, pm: duelMuddat.p2, togriId: natija?.togriId2 },
              ].map(({ kalit, raqam, nom, p, pm, togriId }) => {
                const blokda = pm?.blokTugaydi > hozir
                const tuman = pm?.tumanTugaydi > hozir
                const teskari = pm?.teskariTugaydi > hozir && p.teskariJuftlik?.length
                const kombo = pm?.kombo2xTugaydi > hozir
                const taklif = natija
                  ? null
                  : savol.duelKartaTartibi === 'har-xil'
                    ? faolTaklifKorinishi(pm)
                    : faolTaklifKorinishi(muddat)

                return (
                  <div
                    key={kalit}
                    className={styles.duelTomon}
                    data-tomon={kalit}
                    data-kombo-faol={kombo ? 'true' : undefined}
                    data-silkinish={silkinish[kalit] ? 'true' : undefined}
                    data-teskari-ekran={raqam === 1 && sozlama.duelJoylashuv === 'qarama-qarshi' ? 'true' : undefined}
                  >
                    <div className={styles.duelSar}>
                      <strong>{nom}</strong>
                      <div className={styles.duelBadgeLar}>
                        {p.seriya >= 2 && <span className={styles.seriyaChip}>{p.seriya}×</span>}
                        {p.qalqon && (
                          <span className={styles.qalqonChip}><Ikon nom="qalqon" olcham={14} /></span>
                        )}
                        {kombo && (
                          <span className={styles.komboChip}>
                            2× · {Math.ceil((pm.kombo2xTugaydi - hozir) / 1000)}s
                          </span>
                        )}
                        {tuman && (
                          <span className={styles.tumanChip}>
                            Tuman · {Math.ceil((pm.tumanTugaydi - hozir) / 1000)}s
                          </span>
                        )}
                        <span className={styles.ballChip}>{p.ball} ball</span>
                      </div>
                    </div>

                    {teskari && !natija && (
                      <div className={styles.teskariBanner}>
                        <Ikon nom="ogohlantirish" olcham={16} />
                        <span>TUZOQ! Ajratilgan 2 kartadan NOTO‘G‘RISINI bosing!</span>
                      </div>
                    )}

                    {blokda && !natija && (
                      <div className={styles.blokBanner}>
                        Muzlatish / Blok: {((pm.blokTugaydi - hozir) / 1000).toFixed(1)}s
                      </div>
                    )}

                    <div className={styles.doskaOram}>
                      <ZarrachaEffekt hodisa={effektlar[kalit]} />
                      {taklif && (
                        <div className={styles.taklifJoy}>
                          <MaxsusKartaTaklif
                            taklif={taklif}
                            duelMi
                            pauza={pauza}
                            onBosish={(kartaId) => maxsusKartaBosish(kartaId, raqam)}
                          />
                        </div>
                      )}
                      <DoskaTanla
                        harakat={harakat}
                        tezlik={tezlik}
                        pauza={pauza}
                        ixcham
                        tuman={tuman && !natija}
                        muzlagan={blokda && !natija}
                        variantlar={p.variantlar}
                        model={savol.model}
                        ochirilgan={Boolean(natija) || blokda}
                        ochirilganlar={p.ochirilganlar}
                        natijaTogriId={togriId || null}
                        xatoTanlovId={xatoKartalar[kalit]}
                        teskariJuftlik={teskari && !natija ? p.teskariJuftlik : null}
                        onTanla={(id) => duelSavolJavob(raqam, id)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {savol.model && <CpKLegend />}
          </section>
        )}

        {/* 3. 1v1 — VAQTGA MUSTAQIL BELLASHUV */}
        {ekranHolati === 'oyin' && sozlama.rejim === 'duel-vaqt' && vaqtDuel.p1 && vaqtDuel.p2 && (
          <section className={styles.oyin} aria-label="1v1 mustaqil bellashuv">
            <div className={styles.hisobPanel}>
              <div className={styles.hisobChap}>
                <h1>1v1 Vaqtga bellashuv</h1>
                <span className={styles.holatChip}>
                  {darajaNom} · {sozlama.duelKartaTartibi === 'bir-xil' ? 'Bir xil karta' : 'Ikki xil karta'}
                </span>
              </div>
            </div>

            <UstunlikChizigi
              p1Nom={p1Nom}
              p1Ball={vaqtTugagan.p1 ? vaqtTugagan.p1.ball : vaqtDuel.p1.ball}
              p2Nom={p2Nom}
              p2Ball={vaqtTugagan.p2 ? vaqtTugagan.p2.ball : vaqtDuel.p2.ball}
            />

            <div className={styles.duelGrid} data-joylashuv={sozlama.duelJoylashuv}>
              {[
                { kalit: 'p1', raqam: 1, nom: p1Nom, s: vaqtDuel.p1, m: vaqtMuddat.p1, tugagan: vaqtTugagan.p1 },
                { kalit: 'p2', raqam: 2, nom: p2Nom, s: vaqtDuel.p2, m: vaqtMuddat.p2, tugagan: vaqtTugagan.p2 },
              ].map(({ kalit, raqam, nom, s, m, tugagan }) => {
                const qolgan = m?.vaqtTugaydi != null ? m.vaqtTugaydi - hozir : 0
                const kombo = m?.kombo2xTugaydi > hozir
                const blokda = m?.blokTugaydi > hozir
                const tuman = m?.tumanTugaydi > hozir
                const teskari = m?.teskariTugaydi > hozir && s.teskariJuftlik?.length
                const taklif = !tugagan ? faolTaklifKorinishi(m) : null

                return (
                  <div
                    key={kalit}
                    className={styles.duelTomon}
                    data-tomon={kalit}
                    data-kombo-faol={kombo ? 'true' : undefined}
                    data-silkinish={silkinish[kalit] ? 'true' : undefined}
                    data-teskari-ekran={raqam === 1 && sozlama.duelJoylashuv === 'qarama-qarshi' ? 'true' : undefined}
                  >
                    <div className={styles.duelSar}>
                      <strong>{nom}</strong>
                      <div className={styles.duelBadgeLar}>
                        {s.seriya >= 2 && <span className={styles.seriyaChip}>{s.seriya}×</span>}
                        {s.qalqon && (
                          <span className={styles.qalqonChip}><Ikon nom="qalqon" olcham={14} /></span>
                        )}
                        {kombo && (
                          <span className={styles.komboChip}>
                            2× · {Math.ceil((m.kombo2xTugaydi - hozir) / 1000)}s
                          </span>
                        )}
                        {tuman && (
                          <span className={styles.tumanChip}>
                            Tuman · {Math.ceil((m.tumanTugaydi - hozir) / 1000)}s
                          </span>
                        )}
                        <span
                          className={styles.taymerChip}
                          data-shoshilinch={!tugagan && qolgan <= 15000 ? 'true' : undefined}
                        >
                          {vaqtMatni(qolgan)}
                        </span>
                        <span className={styles.ballChip}>{tugagan ? tugagan.ball : s.ball} ball</span>
                      </div>
                    </div>

                    {tugagan ? (
                      <div className={styles.vaqtTugadiBox}>
                        <strong>Vaqt tugadi!</strong>
                        <p>Natijangiz: {tugagan.ball} ball ({tugagan.togriSoni} ta to‘g‘ri)</p>
                        <small>Raqib o‘yinni yakunlashini kuting…</small>
                      </div>
                    ) : (
                      <>
                        <div className={styles.duelIshoraQuti}>
                          <span>{s.ishora}</span>
                          {vaqtXabar[kalit] && <small className={styles.kartaXabar}>{vaqtXabar[kalit]}</small>}
                        </div>

                        {teskari && (
                          <div className={styles.teskariBanner}>
                            <Ikon nom="ogohlantirish" olcham={16} />
                            <span>TUZOQ! Ajratilgan 2 kartadan NOTO‘G‘RISINI bosing!</span>
                          </div>
                        )}

                        {blokda && (
                          <div className={styles.blokBanner}>
                            Muzlatildi: {((m.blokTugaydi - hozir) / 1000).toFixed(1)}s
                          </div>
                        )}

                        <div className={styles.doskaOram}>
                          <ZarrachaEffekt hodisa={effektlar[kalit]} />
                          {taklif && (
                            <div className={styles.taklifJoy}>
                              <MaxsusKartaTaklif
                                taklif={taklif}
                                duelMi
                                pauza={pauza}
                                onBosish={(kartaId) => maxsusKartaBosish(kartaId, raqam, kalit)}
                              />
                            </div>
                          )}
                          <DoskaTanla
                            harakat={harakat}
                            tezlik={tezlik}
                            pauza={pauza}
                            ixcham
                            tuman={tuman}
                            muzlagan={blokda}
                            variantlar={s.variantlar}
                            model={s.model}
                            ochirilgan={blokda}
                            ochirilganlar={s.ochirilganlar}
                            teskariJuftlik={teskari ? s.teskariJuftlik : null}
                            onTanla={(id) => vaqtDuelJavob(kalit, id)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {(vaqtDuel.p1.model || vaqtDuel.p2.model) && <CpKLegend />}
          </section>
        )}

        {ekranHolati === 'yakun' && yakun && (
          <YakunEkrani
            sozlama={sozlama}
            yakun={yakun}
            onQayta={() => oyinniBoshlash(sozlama)}
            onSozlama={sozlamagaQaytish}
          />
        )}
      </div>
    </main>
  )
}
