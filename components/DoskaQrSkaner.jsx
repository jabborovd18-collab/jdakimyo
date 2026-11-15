// components/DoskaQrSkaner.jsx
//
// Sayt ichidagi maxsus QR skaner va faol elektron doskalar boshqaruvi.
// Telegram Web "Link Desktop Device" kabi ishlaydi:
//   - Telefonda allaqachon kirilgan brauzer sessiyasi ichida kamerani ochadi
//   - BarcodeDetector (bor joyda) + jsQR (iOS Safari va barcha brauzerlarda)
//   - Kamera ruxsati berilmasa: rasm/skrinshotdan yuklash va qo'lda kiritish
//   - Ustozlar uchun hozir ulangan faol doskalarni ko'rish va masofadan uzish
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import jsQR from 'jsqr'
import Ikon from '@/components/Ikon'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import { qrMatniniTahlilQil, qurilmaQisqaNomi } from '@/lib/qr-skaner'

const SKANER_ORALIQ_MS = 120
const XATO_ORALIQ_MS = 2200
const MAX_KADR_ENI = 960

function vaqtQolganMatn(ms) {
  const jami = Math.max(0, Math.floor(ms / 1000))
  const s = jami % 60
  const d = Math.floor(jami / 60) % 60
  const h = Math.floor(jami / 3600)
  const ikki = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${ikki(d)}:${ikki(s)}` : `${d}:${ikki(s)}`
}

function kameraXatoMatni(err) {
  const nom = err?.name || ''
  if (nom === 'NotAllowedError' || nom === 'PermissionDeniedError') {
    return "Kamera ruxsati berilmadi. Brauzer manzil satridan kameraga ruxsat bering yoki pastdan rasm tanlang."
  }
  if (nom === 'NotFoundError' || nom === 'DevicesNotFoundError') {
    return "Qurilmada kamera topilmadi. Pastdan rasm yuklang yoki havolani qo'lda kiriting."
  }
  if (nom === 'NotReadableError' || nom === 'TrackStartError') {
    return "Kamera boshqa dasturda band. Uni yopib «Qayta yoqish» tugmasini bosing."
  }
  if (nom === 'SecurityError' || (typeof window !== 'undefined' && window.isSecureContext === false)) {
    return "Jonli kamera faqat xavfsiz HTTPS ulanishda ishlaydi. Rasm yuklash yoki havola kiritishdan foydalaning."
  }
  return "Kamerani ochib bo'lmadi. Pastdan rasm yuklash yoki havolani qo'lda kiritishdan foydalaning."
}

/**
 * Video kadr yoki rasmdan QR matnini ajratib oladi.
 * BarcodeDetector mavjud bo'lsa tezkor native API, bo'lmasa jsQR ishlaydi.
 */
async function kadrdanQrOqi(manba, kenglik, balandlik, canvasRef, detector) {
  if (!manba || !kenglik || !balandlik) return null

  if (detector) {
    try {
      const natijalar = await detector.detect(manba)
      const topilgan = natijalar?.find((b) => typeof b?.rawValue === 'string' && b.rawValue.trim())
      if (topilgan) return topilgan.rawValue.trim()
    } catch {
      // Native detector xato bersa jsQR zaxirasiga o'tamiz
    }
  }

  if (!canvasRef.current) {
    canvasRef.current = document.createElement('canvas')
  }
  const canvas = canvasRef.current
  const nisbat = kenglik > MAX_KADR_ENI ? MAX_KADR_ENI / kenglik : 1
  const w = Math.max(1, Math.round(kenglik * nisbat))
  const h = Math.max(1, Math.round(balandlik * nisbat))

  if (canvas.width !== w) canvas.width = w
  if (canvas.height !== h) canvas.height = h

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(manba, 0, 0, w, h)
  const imageData = ctx.getImageData(0, 0, w, h)
  const kod = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' })
  return kod?.data ? String(kod.data).trim() : null
}

function rasmFaylniYuklash(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Rasmni ochib bo\'lmadi'))
    }
    img.src = url
  })
}

export default function DoskaQrSkaner() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const detectorRef = useRef(null)
  const topildiRef = useRef(false)
  const oxirgiXatoVaqtRef = useRef(0)
  const startIdRef = useRef(0)

  const [kameraHolati, setKameraHolati] = useState('yuklanmoqda') // yuklanmoqda | ishlayapti | toxtatilgan | xato | topildi
  const [kameraXabari, setKameraXabari] = useState('')
  const [qrXabari, setQrXabari] = useState('')
  const [topilganNomi, setTopilganNomi] = useState('')

  const [kameralar, setKameralar] = useState([])
  const [tanlanganKameraId, setTanlanganKameraId] = useState('')
  const [chiroqBormi, setChiroqBormi] = useState(false)
  const [chiroqYoqilgan, setChiroqYoqilgan] = useState(false)

  const [qoldaMatn, setQoldaMatn] = useState('')
  const [faylBand, setFaylBand] = useState(false)

  // Ustozlar uchun faol doskalar ro'yxati
  const [faolDoskalar, setFaolDoskalar] = useState([])
  const [doskalarYuklanmoqda, setDoskalarYuklanmoqda] = useState(false)
  const [uzilayotganToken, setUzilayotganToken] = useState(null)
  const [hozir, setHozir] = useState(() => Date.now())

  const ustoz = Boolean(session?.user && ustozPaneliOchiqmi(session.user))
  const doskaRejimi = Boolean(session?.user?.doskaTugaydi)

  const oqimniToxtat = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop()
        } catch {
          // Track allaqachon yopilgan bo'lishi mumkin
        }
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null
      } catch {
        // ignore
      }
    }
    setChiroqBormi(false)
    setChiroqYoqilgan(false)
  }, [])

  const qrNatijaniQollash = useCallback(
    (xomMatn, qolda = false) => {
      if (topildiRef.current) return false
      const origin = typeof window !== 'undefined' ? window.location.origin : null
      const tahlil = qrMatniniTahlilQil(xomMatn, origin)

      if (!tahlil.ok) {
        const vaqt = Date.now()
        if (qolda || vaqt - oxirgiXatoVaqtRef.current >= XATO_ORALIQ_MS) {
          oxirgiXatoVaqtRef.current = vaqt
          setQrXabari(tahlil.xato)
          if (qolda) toast.error(tahlil.xato)
        }
        return false
      }

      topildiRef.current = true
      setQrXabari('')
      setTopilganNomi(tahlil.nomi)
      setKameraHolati('topildi')
      oqimniToxtat()
      toast.success(`${tahlil.nomi} topildi`)
      router.push(tahlil.manzil)
      return true
    },
    [oqimniToxtat, router]
  )

  const kameraniBoshlash = useCallback(
    async (deviceId = '') => {
      const startId = ++startIdRef.current
      topildiRef.current = false
      setQrXabari('')
      setKameraXabari('')
      setKameraHolati('yuklanmoqda')
      oqimniToxtat()

      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setKameraHolati('xato')
        setKameraXabari(kameraXatoMatni(null))
        return
      }

      // Native BarcodeDetector tayyorlash (bor brauzerlarda juda tez)
      if (!detectorRef.current && typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
          const formats = typeof window.BarcodeDetector.getSupportedFormats === 'function'
            ? await window.BarcodeDetector.getSupportedFormats()
            : ['qr_code']
          if (formats.includes('qr_code')) {
            detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] })
          }
        } catch {
          detectorRef.current = null
        }
      }

      let oqim = null
      try {
        const videoCheklov = deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        try {
          oqim = await navigator.mediaDevices.getUserMedia({ video: videoCheklov, audio: false })
        } catch (firstErr) {
          if (firstErr?.name === 'OverconstrainedError') {
            oqim = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          } else {
            throw firstErr
          }
        }
      } catch (err) {
        if (startId !== startIdRef.current) return
        setKameraHolati('xato')
        setKameraXabari(kameraXatoMatni(err))
        return
      }

      if (startId !== startIdRef.current) {
        oqim.getTracks().forEach((t) => t.stop())
        return
      }

      streamRef.current = oqim

      const track = oqim.getVideoTracks()[0]
      if (track) {
        const capabilities = typeof track.getCapabilities === 'function' ? track.getCapabilities() : null
        setChiroqBormi(Boolean(capabilities?.torch))
        const joriyId = typeof track.getSettings === 'function' ? track.getSettings()?.deviceId : ''
        if (joriyId) setTanlanganKameraId(joriyId)
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices?.()
        if (Array.isArray(devices) && startId === startIdRef.current) {
          setKameralar(devices.filter((d) => d.kind === 'videoinput'))
        }
      } catch {
        // Kamera ro'yxati bo'lmasa ham asosiy kamera ishlayveradi
      }

      const video = videoRef.current
      if (!video) {
        oqimniToxtat()
        return
      }

      video.srcObject = oqim
      try {
        await video.play()
      } catch {
        // Autoplay ba'zan tayyor bo'lgandan keyin ishlaydi
      }

      if (startId !== startIdRef.current) return
      setKameraHolati('ishlayapti')

      const sikl = async () => {
        if (startId !== startIdRef.current || topildiRef.current) return
        const el = videoRef.current
        if (el && el.readyState >= 2 && el.videoWidth > 0 && el.videoHeight > 0) {
          try {
            const qiymat = await kadrdanQrOqi(
              el,
              el.videoWidth,
              el.videoHeight,
              canvasRef,
              detectorRef.current
            )
            if (startId !== startIdRef.current) return
            if (qiymat) {
              const boldi = qrNatijaniQollash(qiymat, false)
              if (boldi) return
            }
          } catch {
            // Keyingi kadrda davom etadi
          }
        }
        if (startId === startIdRef.current && !topildiRef.current) {
          timerRef.current = setTimeout(sikl, SKANER_ORALIQ_MS)
        }
      }

      timerRef.current = setTimeout(sikl, SKANER_ORALIQ_MS)
    },
    [oqimniToxtat, qrNatijaniQollash]
  )

  useEffect(() => {
    if (doskaRejimi) {
      oqimniToxtat()
      setKameraHolati('toxtatilgan')
      return
    }
    kameraniBoshlash()
    return () => {
      startIdRef.current += 1
      oqimniToxtat()
    }
  }, [doskaRejimi, kameraniBoshlash, oqimniToxtat])

  const kameraniAlmashtir = () => {
    if (kameralar.length < 2) return
    const idx = kameralar.findIndex((c) => c.deviceId === tanlanganKameraId)
    const keyingi = kameralar[(idx + 1) % kameralar.length]
    if (keyingi?.deviceId) {
      kameraniBoshlash(keyingi.deviceId)
    }
  }

  const chiroqniAlmashtir = async () => {
    const track = streamRef.current?.getVideoTracks()?.[0]
    if (!track || typeof track.applyConstraints !== 'function') return
    const yangi = !chiroqYoqilgan
    try {
      await track.applyConstraints({ advanced: [{ torch: yangi }] })
      setChiroqYoqilgan(yangi)
    } catch {
      toast.error("Chiroqni yoqib bo'lmadi")
    }
  }

  const rasmdanSkanerlash = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setFaylBand(true)
    setQrXabari('')
    try {
      const img = await rasmFaylniYuklash(file)
      const qiymat = await kadrdanQrOqi(
        img,
        img.naturalWidth || img.width,
        img.naturalHeight || img.height,
        canvasRef,
        null // Rasm uchun jsQR barcha formatlarda ishonchliroq
      )
      if (!qiymat) {
        const matn = "Rasmda QR kod topilmadi. Kadrni yaqinroq va tiniqroq oling."
        setQrXabari(matn)
        toast.error(matn)
        return
      }
      qrNatijaniQollash(qiymat, true)
    } catch {
      toast.error("Rasmni o'qib bo'lmadi")
    } finally {
      setFaylBand(false)
    }
  }

  const qoldaYuborish = (e) => {
    e.preventDefault()
    qrNatijaniQollash(qoldaMatn, true)
  }

  // Faol doskalarni yuklash (faqat ustoz/admin va oddiy sessiyada)
  const faolDoskalarniYuklash = useCallback(async () => {
    if (!ustoz || doskaRejimi) return
    setDoskalarYuklanmoqda(true)
    try {
      const res = await fetch('/api/doska')
      const d = await res.json()
      if (res.ok && Array.isArray(d.sessiyalar)) {
        setFaolDoskalar(d.sessiyalar)
      }
    } catch {
      // Jim — skaner asosiy vazifasini davom ettiradi
    } finally {
      setDoskalarYuklanmoqda(false)
    }
  }, [ustoz, doskaRejimi])

  useEffect(() => {
    if (status === 'loading' || !ustoz || doskaRejimi) return
    faolDoskalarniYuklash()
  }, [status, ustoz, doskaRejimi, faolDoskalarniYuklash])

  useEffect(() => {
    if (faolDoskalar.length === 0) return
    const t = setInterval(() => setHozir(Date.now()), 1000)
    return () => clearInterval(t)
  }, [faolDoskalar.length])

  const doskaniUzish = async (sessiyaId) => {
    if (!sessiyaId || uzilayotganToken) return
    setUzilayotganToken(sessiyaId)
    try {
      const res = await fetch(`/api/doska?id=${encodeURIComponent(sessiyaId)}`, {
        method: 'DELETE',
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "Uzib bo'lmadi")
      setFaolDoskalar((prev) => prev.filter((s) => s.id !== sessiyaId))
      toast.success(d.message || 'Doska sessiyasi uzildi')
    } catch (err) {
      toast.error(err.message || "Doskani uzib bo'lmadi")
    } finally {
      setUzilayotganToken(null)
    }
  }

  if (doskaRejimi) {
    return (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
          <Ikon nom="ogohlantirish" olcham={30} />
        </div>
        <p className="text-sm font-bold text-[var(--v3-matn)]">
          Bu qurilma hozir doska rejimida
        </p>
        <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
          Doska sessiyasi ichidan yangi doska ochib bo&apos;lmaydi. Boshqa elektron doskani ulash uchun telefoningizdagi asosiy brauzerdan foydalaning.
        </p>
        <Link href="/doska/auth" className="v3-tugma w-full justify-center py-2.5 text-xs font-semibold">
          <Ikon nom="doska" olcham={15} />
          <span>Doska holatiga qaytish</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Jonli kamera ko'rish oynasi */}
      <div className="relative w-full aspect-square max-h-[340px] mx-auto rounded-2xl overflow-hidden border border-[var(--v3-chiziq-2)] bg-[#04081d]">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            kameraHolati === 'ishlayapti' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Skaner ramkasi (kamera ishlayotganda) */}
        {kameraHolati === 'ishlayapti' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div className="relative w-52 h-52 sm:w-56 sm:h-56">
              <span className="absolute top-0 left-0 w-7 h-7 border-t-[3px] border-l-[3px] border-[var(--v3-urgu)] rounded-tl-xl" />
              <span className="absolute top-0 right-0 w-7 h-7 border-t-[3px] border-r-[3px] border-[var(--v3-urgu)] rounded-tr-xl" />
              <span className="absolute bottom-0 left-0 w-7 h-7 border-b-[3px] border-l-[3px] border-[var(--v3-urgu)] rounded-bl-xl" />
              <span className="absolute bottom-0 right-0 w-7 h-7 border-b-[3px] border-r-[3px] border-[var(--v3-urgu)] rounded-br-xl" />
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-[var(--v3-urgu)] to-transparent opacity-80 animate-pulse" />
            </div>
            <span className="mt-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[11px] font-medium text-white">
              Doskadagi QR kodni ramkaga tuting
            </span>
          </div>
        )}

        {/* Yuklanmoqda holati */}
        {kameraHolati === 'yuklanmoqda' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-5 text-center text-[var(--v3-xira)]">
            <Ikon nom="vaqt" olcham={28} className="animate-spin text-[var(--v3-urgu)]" />
            <span className="text-xs font-medium text-[var(--v3-matn)]">Kamera ochilmoqda...</span>
            <span className="text-[11px] text-[var(--v3-xira)] max-w-[230px] leading-relaxed">
              Brauzer ruxsat so&apos;rasa &laquo;Ruxsat berish&raquo;ni bosing
            </span>
          </div>
        )}

        {/* Kamera to'xtatilgan holati */}
        {kameraHolati === 'toxtatilgan' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)]">
              <Ikon nom="skaner" olcham={26} />
            </div>
            <p className="text-xs text-[var(--v3-xira)]">Kamera to&apos;xtatildi</p>
            <button
              type="button"
              onClick={() => kameraniBoshlash(tanlanganKameraId)}
              className="v3-tugma v3-tugma-asosiy px-4 py-2 text-xs font-bold"
            >
              <Ikon nom="kamera" olcham={15} />
              <span>Kamerani yoqish</span>
            </button>
          </div>
        )}

        {/* Kamera xatosi */}
        {kameraHolati === 'xato' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Ikon nom="kamera" olcham={24} />
            </div>
            <p className="text-xs text-[var(--v3-matn)] leading-relaxed max-w-xs">
              {kameraXabari}
            </p>
            <button
              type="button"
              onClick={() => kameraniBoshlash(tanlanganKameraId)}
              className="v3-tugma px-4 py-2 text-xs font-semibold"
            >
              <Ikon nom="qayta" olcham={14} />
              <span>Qayta yoqish</span>
            </button>
          </div>
        )}

        {/* Topildi holati */}
        {kameraHolati === 'topildi' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center bg-emerald-950/70 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Ikon nom="tasdiq" olcham={28} />
            </div>
            <div className="text-sm font-bold text-white">{topilganNomi}</div>
            <div className="text-xs text-emerald-200/80">Sahifaga o&apos;tilmoqda...</div>
          </div>
        )}
      </div>

      {/* Inline QR xabari (noto'g'ri QR o'qilganda kamera o'chmasdan ogohlantiradi) */}
      {qrXabari && (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200 flex items-start gap-2"
        >
          <Ikon nom="ogohlantirish" olcham={15} className="shrink-0 mt-0.5 text-amber-300" />
          <span className="leading-relaxed">{qrXabari}</span>
        </div>
      )}

      {/* Boshqaruv tugmalari */}
      <div className="grid grid-cols-2 gap-2">
        {kameraHolati === 'ishlayapti' ? (
          <button
            type="button"
            onClick={() => {
              startIdRef.current += 1
              oqimniToxtat()
              setKameraHolati('toxtatilgan')
            }}
            className="v3-tugma justify-center py-2.5 text-xs font-semibold"
          >
            <Ikon nom="yopish" olcham={14} />
            <span>To&apos;xtatish</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => kameraniBoshlash(tanlanganKameraId)}
            disabled={kameraHolati === 'yuklanmoqda'}
            className="v3-tugma v3-tugma-asosiy justify-center py-2.5 text-xs font-bold disabled:opacity-60"
          >
            <Ikon
              nom={kameraHolati === 'yuklanmoqda' ? 'vaqt' : 'kamera'}
              olcham={15}
              className={kameraHolati === 'yuklanmoqda' ? 'animate-spin' : ''}
            />
            <span>{kameraHolati === 'yuklanmoqda' ? 'Ochilmoqda...' : 'Kamerani yoqish'}</span>
          </button>
        )}

        <label className="v3-tugma justify-center py-2.5 text-xs font-semibold cursor-pointer">
          <Ikon nom={faylBand ? 'vaqt' : 'rasm'} olcham={15} className={faylBand ? 'animate-spin' : ''} />
          <span>{faylBand ? 'O\'qilmoqda...' : 'Rasmdan o\'qish'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={rasmdanSkanerlash}
            disabled={faylBand}
            className="sr-only"
          />
        </label>

        {kameralar.length > 1 && (
          <button
            type="button"
            onClick={kameraniAlmashtir}
            className="v3-tugma justify-center py-2.5 text-xs font-semibold"
          >
            <Ikon nom="qayta" olcham={14} />
            <span>Kamera almashtirish</span>
          </button>
        )}

        {chiroqBormi && (
          <button
            type="button"
            onClick={chiroqniAlmashtir}
            className={`v3-tugma justify-center py-2.5 text-xs font-semibold ${
              chiroqYoqilgan ? '!border-[var(--v3-urgu)] text-[var(--v3-urgu)]' : ''
            }`}
          >
            <Ikon nom="chaqmoq" olcham={14} />
            <span>{chiroqYoqilgan ? 'Chiroqni o\'chirish' : 'Chiroqni yoqish'}</span>
          </button>
        )}
      </div>

      {/* Qo'lda havola / PIN / token kiritish zaxirasi */}
      <form
        onSubmit={qoldaYuborish}
        className="rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] p-3.5 space-y-2"
      >
        <label htmlFor="qr-qolda-input" className="block text-[11px] font-semibold text-[var(--v3-xira)]">
          Yoki havola / Smart Jang PIN kodini kiriting
        </label>
        <div className="flex items-stretch gap-2">
          <input
            id="qr-qolda-input"
            type="text"
            value={qoldaMatn}
            onChange={(e) => setQoldaMatn(e.target.value)}
            placeholder="https://.../doska/auth/... yoki 482910"
            className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs text-[var(--v3-matn)] placeholder:text-[var(--v3-xira)]/60 focus:border-[var(--v3-urgu)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!qoldaMatn.trim()}
            className="v3-tugma v3-tugma-asosiy px-3.5 py-2 text-xs font-bold shrink-0 disabled:opacity-50"
          >
            Ochish
          </button>
        </div>
      </form>

      {/* Ustozlar uchun faol doska sessiyalari */}
      {ustoz && (
        <div className="rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--v3-matn)]">
              <Ikon nom="doska" olcham={15} className="text-[var(--v3-urgu)]" />
              <span>Faol doskalaringiz</span>
            </div>
            <button
              type="button"
              onClick={faolDoskalarniYuklash}
              disabled={doskalarYuklanmoqda}
              className="text-[11px] font-semibold text-[var(--v3-urgu)] hover:underline inline-flex items-center gap-1 disabled:opacity-50"
            >
              <Ikon nom="qayta" olcham={12} className={doskalarYuklanmoqda ? 'animate-spin' : ''} />
              <span>Yangilash</span>
            </button>
          </div>

          {doskalarYuklanmoqda && faolDoskalar.length === 0 ? (
            <div className="text-[11px] text-[var(--v3-xira)]">Tekshirilmoqda...</div>
          ) : faolDoskalar.length === 0 ? (
            <div className="text-[11px] text-[var(--v3-xira)]">
              Hozircha hisobingizga ulangan elektron doska yo&apos;q.
            </div>
          ) : (
            <div className="space-y-2">
              {faolDoskalar.map((s) => {
                const qolganMs = s.tugaydi ? Math.max(0, new Date(s.tugaydi).getTime() - hozir) : 0
                const band = uzilayotganToken === s.id
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[var(--v3-matn)] truncate">
                        {qurilmaQisqaNomi(s.qurilma)}
                      </div>
                      <div className="text-[11px] text-[var(--v3-xira)] font-mono">
                        Qolgan vaqt: {vaqtQolganMatn(qolganMs)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => doskaniUzish(s.id)}
                      disabled={band}
                      className="px-2.5 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] font-semibold shrink-0 disabled:opacity-50"
                    >
                      {band ? 'Uzilmoqda...' : 'Uzish'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Pastki tezkor havolalar */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-1 text-xs">
        {session?.user && ustoz ? (
          <Link
            href="/ustoz"
            className="text-[var(--v3-urgu)] hover:underline font-semibold inline-flex items-center gap-1"
          >
            <Ikon nom="ustoz" olcham={14} />
            <span>Ustoz paneli</span>
          </Link>
        ) : (
          <Link
            href="/doska/auth"
            className="text-[var(--v3-urgu)] hover:underline font-semibold inline-flex items-center gap-1"
          >
            <Ikon nom="doska" olcham={14} />
            <span>Doskada QR ochish</span>
          </Link>
        )}
        <Link
          href="/doska"
          className="text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:underline inline-flex items-center gap-1"
        >
          <span>Smart Doska</span>
        </Link>
      </div>
    </div>
  )
}
