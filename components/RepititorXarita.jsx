"use client"

import { useEffect, useRef, useState } from "react"
import Ikon from "@/components/Ikon"

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

function leafletYukla() {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"))
  if (window.L) return Promise.resolve(window.L)

  if (window.__leafletYuklanmoqda) return window.__leafletYuklanmoqda

  window.__leafletYuklanmoqda = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = LEAFLET_CSS
      document.head.appendChild(link)
    }

    const script = document.createElement("script")
    script.src = LEAFLET_JS
    script.async = true
    script.onload = () => {
      if (window.L) resolve(window.L)
      else reject(new Error("Leaflet topilmadi"))
    }
    script.onerror = () => {
      window.__leafletYuklanmoqda = null
      reject(new Error("Xarita kutubxonasini yuklab bo'lmadi"))
    }
    document.head.appendChild(script)
  })

  return window.__leafletYuklanmoqda
}

function fanBelgiVaRang(fan) {
  if (fan === "kimyo") {
    return { qisqa: "K", fon: "#f59e0b", chiziq: "#fde68a" }
  }
  if (fan === "biologiya") {
    return { qisqa: "B", fon: "#06b6d4", chiziq: "#a5f3fc" }
  }
  return { qisqa: "K+B", fon: "#10b981", chiziq: "#a7f3d0" }
}

function xavfsizMatn(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export default function RepititorXarita({
  markaz = { lat: 41.3111, lng: 69.2797, zoom: 12 },
  repititorlar = [],
  tanlanganId = null,
  onSelectRepititor,
  tanlashRejimi = false,
  tanlanganNuqta = null,
  onMapClickNuqta,
  foydalanuvchiGps = null,
}) {
  const xaritaIdRef = useRef(null)
  const mapRef = useRef(null)
  const qatlamRef = useRef(null)
  const yangiPinRef = useRef(null)
  const gpsPinRef = useRef(null)

  const [yuklandi, setYuklandi] = useState(false)
  const [xato, setXato] = useState("")

  // Xaritani ishga tushirish
  useEffect(() => {
    let bekor = false

    leafletYukla()
      .then((L) => {
        if (bekor || !xaritaIdRef.current) return
        if (mapRef.current) {
          setYuklandi(true)
          return
        }

        const map = L.map(xaritaIdRef.current, {
          center: [markaz.lat, markaz.lng],
          zoom: markaz.zoom || 12,
          zoomControl: true,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map)

        const qatlam = L.layerGroup().addTo(map)
        mapRef.current = map
        qatlamRef.current = qatlam
        setYuklandi(true)
      })
      .catch((err) => {
        if (!bekor) setXato(err?.message || "Xarita yuklanmadi")
      })

    return () => {
      bekor = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        qatlamRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Xarita bosilganda nuqta tanlash
  useEffect(() => {
    const map = mapRef.current
    if (!map || !yuklandi) return

    function bosildi(e) {
      if (!onMapClickNuqta) return
      const lat = Math.round(e.latlng.lat * 100000) / 100000
      const lng = Math.round(e.latlng.lng * 100000) / 100000
      onMapClickNuqta({ lat, lng })
    }

    map.on("click", bosildi)
    return () => {
      map.off("click", bosildi)
    }
  }, [yuklandi, onMapClickNuqta])

  // Hudud yoki markaz o'zgarganda xaritani siljitish
  const mLat = markaz?.lat
  const mLng = markaz?.lng
  const mZoom = markaz?.zoom
  useEffect(() => {
    const map = mapRef.current
    if (!map || !yuklandi) return
    if (Number.isFinite(mLat) && Number.isFinite(mLng)) {
      map.flyTo([mLat, mLng], mZoom || 12, {
        duration: 0.9,
      })
    }
  }, [yuklandi, mLat, mLng, mZoom])

  // Repititorlar pinlarini chizish
  useEffect(() => {
    const map = mapRef.current
    const qatlam = qatlamRef.current
    const L = typeof window !== "undefined" ? window.L : null
    if (!map || !qatlam || !L || !yuklandi) return

    qatlam.clearLayers()

    repititorlar.forEach((rep) => {
      if (!Number.isFinite(rep.lat) || !Number.isFinite(rep.lng)) return
      const { qisqa, fon, chiziq } = fanBelgiVaRang(rep.fan)
      const faol = rep.id === tanlanganId

      const html = `
        <div style="
          display:flex;
          align-items:center;
          justify-content:center;
          min-width:${faol ? "42px" : "36px"};
          height:${faol ? "42px" : "36px"};
          padding:0 8px;
          border-radius:9999px;
          background:${fon};
          border:3px solid ${faol ? "#fef08a" : chiziq};
          color:#041028;
          font-weight:900;
          font-size:11px;
          font-family:system-ui,-apple-system,sans-serif;
          box-shadow:0 6px 18px rgba(0,0,0,0.45), 0 0 0 ${faol ? "6px rgba(250,204,21,0.35)" : "3px rgba(16,185,129,0.2)"};
          transform:${faol ? "scale(1.12)" : "scale(1)"};
          transition:all 0.2s ease;
        ">
          <span>${qisqa}</span>
        </div>
      `

      const icon = L.divIcon({
        className: "jda-repititor-pin",
        html,
        iconSize: [faol ? 42 : 36, faol ? 42 : 36],
        iconAnchor: [faol ? 21 : 18, faol ? 21 : 18],
        popupAnchor: [0, -18],
      })

      const marker = L.marker([rep.lat, rep.lng], { icon })

      const popupHtml = `
        <div style="font-family:system-ui,-apple-system,sans-serif;min-width:210px;color:#0f172a;padding:2px;">
          <div style="font-size:11px;font-weight:700;color:#059669;text-transform:uppercase;">
            ${xavfsizMatn(rep.sertifikat || "A+")} · ${xavfsizMatn(rep.markaz || "O'quv markazi")}
          </div>
          <div style="font-size:14px;font-weight:800;margin-top:2px;color:#0f172a;">
            ${xavfsizMatn(rep.ism)}
          </div>
          ${
            rep.moljal || rep.tuman
              ? `<div style="font-size:12px;color:#334155;margin-top:4px;">📍 ${xavfsizMatn(
                  [rep.tuman, rep.moljal].filter(Boolean).join(", ")
                )}</div>`
              : ""
          }
          ${
            rep.masofaMatn
              ? `<div style="font-size:12px;font-weight:700;color:#0284c7;margin-top:4px;">🧭 Sizdan: ${xavfsizMatn(
                  rep.masofaMatn
                )}</div>`
              : ""
          }
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
            ${
              rep.telegram
                ? `<a href="https://t.me/${encodeURIComponent(
                    rep.telegram.replace(/^@/, "")
                  )}" target="_blank" rel="noopener noreferrer" style="padding:4px 9px;border-radius:8px;background:#0284c7;color:#fff;font-size:11px;font-weight:700;text-decoration:none;">Telegram</a>`
                : ""
            }
            <a href="https://www.google.com/maps?q=${rep.lat},${rep.lng}" target="_blank" rel="noopener noreferrer" style="padding:4px 9px;border-radius:8px;background:#0f172a;color:#f8fafc;font-size:11px;font-weight:700;text-decoration:none;">Yo'nalish (GPS)</a>
          </div>
        </div>
      `

      marker.bindPopup(popupHtml)
      marker.on("click", () => {
        if (onSelectRepititor) onSelectRepititor(rep)
      })

      marker.addTo(qatlam)
      if (faol) {
        marker.openPopup()
      }
    })
  }, [yuklandi, repititorlar, tanlanganId, onSelectRepititor])

  // Foydalanuvchining o'z GPS nuqtasini chizish
  useEffect(() => {
    const map = mapRef.current
    const L = typeof window !== "undefined" ? window.L : null
    if (!map || !L || !yuklandi) return

    if (gpsPinRef.current) {
      map.removeLayer(gpsPinRef.current)
      gpsPinRef.current = null
    }

    if (foydalanuvchiGps && Number.isFinite(foydalanuvchiGps.lat) && Number.isFinite(foydalanuvchiGps.lng)) {
      const icon = L.divIcon({
        className: "jda-gps-pin",
        html: `
          <div style="
            width:22px;height:22px;border-radius:9999px;
            background:#3b82f6;border:3px solid #ffffff;
            box-shadow:0 0 0 8px rgba(59,130,246,0.35), 0 4px 10px rgba(0,0,0,0.4);
          " title="Sizning joylashuvingiz"></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      })

      gpsPinRef.current = L.marker([foydalanuvchiGps.lat, foydalanuvchiGps.lng], {
        icon,
      })
        .bindPopup("<b>Sizning joylashuvingiz</b>")
        .addTo(map)
    }
  }, [yuklandi, foydalanuvchiGps])

  // Yangi qo'shilayotgan repititor nuqtasi (Oltin pin)
  useEffect(() => {
    const map = mapRef.current
    const L = typeof window !== "undefined" ? window.L : null
    if (!map || !L || !yuklandi) return

    if (yangiPinRef.current) {
      map.removeLayer(yangiPinRef.current)
      yangiPinRef.current = null
    }

    if (tanlanganNuqta && Number.isFinite(tanlanganNuqta.lat) && Number.isFinite(tanlanganNuqta.lng)) {
      const icon = L.divIcon({
        className: "jda-yangi-pin",
        html: `
          <div style="
            display:flex;align-items:center;justify-content:center;
            width:44px;height:44px;border-radius:9999px;
            background:linear-gradient(135deg,#facc15,#f59e0b);
            border:3px solid #ffffff;
            color:#0f172a;font-weight:900;font-size:18px;
            box-shadow:0 0 0 8px rgba(250,204,21,0.35), 0 8px 20px rgba(0,0,0,0.5);
          ">+</div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      })

      const marker = L.marker([tanlanganNuqta.lat, tanlanganNuqta.lng], {
        icon,
        draggable: true,
      }).addTo(map)

      marker.on("dragend", (e) => {
        const pos = e.target.getLatLng()
        if (onMapClickNuqta) {
          onMapClickNuqta({
            lat: Math.round(pos.lat * 100000) / 100000,
            lng: Math.round(pos.lng * 100000) / 100000,
          })
        }
      })

      yangiPinRef.current = marker
    }
  }, [yuklandi, tanlanganNuqta, onMapClickNuqta])

  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[460px] rounded-3xl overflow-hidden border border-cyan-500/40 bg-[#071330] shadow-2xl">
      {/* Yuqori yordamchi qalqib chiquvchi ko'rsatma */}
      <div className="absolute top-3 left-3 right-3 z-[400] pointer-events-none flex items-center justify-between gap-2 flex-wrap">
        {tanlashRejimi ? (
          <div className="px-3.5 py-2 rounded-2xl bg-amber-400 text-slate-950 font-sans text-xs font-extrabold shadow-xl flex items-center gap-2 pointer-events-auto">
            <Ikon nom="xarita" olcham={16} />
            <span>
              Xarita ustidan o&apos;quv markazingiz joylashgan nuqtani bosing (yoki oltin &quot;+&quot; belgisini suring)
            </span>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-[#07112e]/90 border border-blue-700/60 backdrop-blur-md text-blue-100 font-sans text-[11px] font-semibold shadow-lg flex items-center gap-3 pointer-events-auto">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Kimyo+Bio</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Kimyo</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              <span>Biologiya</span>
            </span>
          </div>
        )}
      </div>

      {/* Xarita konteyneri */}
      <div
        ref={xaritaIdRef}
        className={`w-full h-full min-h-[360px] sm:min-h-[460px] z-10 ${
          tanlashRejimi ? "cursor-crosshair" : ""
        }`}
      />

      {/* Yuklanish yoki Xatolik holati */}
      {!yuklandi && !xato && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#07122e]/90 text-blue-200 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 animate-pulse">
            <Ikon nom="xarita" olcham={26} />
          </div>
          <span className="text-xs sm:text-sm font-semibold">Interaktiv xarita yuklanmoqda...</span>
        </div>
      )}

      {xato && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#07122e]/95 text-center p-6 gap-3">
          <Ikon nom="ogohlantirish" olcham={28} className="text-amber-400" />
          <p className="text-sm font-bold text-white">{xato}</p>
          <p className="text-xs text-blue-200/80 max-w-md">
            Internet aloqasini tekshiring yoki quyidagi ro&apos;yxat va koordinatalar orqali repititorlarni ko&apos;ring.
          </p>
        </div>
      )}
    </div>
  )
}
