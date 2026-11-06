'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 4-BOB, 4.2-MAVZU
// "Metall va metallmaslarning fizik xossalari" (Darslik 59-bet)
// 6 ta interaktiv Canvas Ko'rgazma + 4 ta Smart-doska O'yini
// ============================================================
import { useState, useEffect, useRef } from 'react'
import Ikon from '@/components/Ikon'
import OtganDarsniTakrorlash from '@/components/maktab/OtganDarsniTakrorlash'
import { SmartDoskaNavigatsiya } from '@/components/maktab/SmartDoskaYordamchi'

function tovushChiqar(turi) {
    if (typeof window === 'undefined') return
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        if (turi === 'success' || turi === 'togri') {
            osc.type = 'sine'
            osc.frequency.setValueAtTime(523.25, now)
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.18)
            gain.gain.setValueAtTime(0.18, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
            osc.start(now)
            osc.stop(now + 0.2)
        } else if (turi === 'error' || turi === 'xato') {
            osc.type = 'sawtooth'
            osc.frequency.setValueAtTime(220, now)
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.25)
            gain.gain.setValueAtTime(0.2, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28)
            osc.start(now)
            osc.stop(now + 0.28)
        } else {
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(440, now)
            gain.gain.setValueAtTime(0.1, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
            osc.start(now)
            osc.stop(now + 0.08)
        }
    } catch {
        // Audio xatosi e'tiborsiz
    }
}

const TAKROPI_4_1 = [
    {
        savol: "Moddaning birlik hajmiga to'g'ri keladigan massasi nima deyiladi?",
        variantlar: ["Zichlik (ρ = m / V)", "Moos qattiqligi", "Eruvchanlik koeffitsiyenti", "Issiqlik sig'imi"],
        togriJavob: "Zichlik (ρ = m / V)",
        izoh: "Zichlik ρ = m / V formulasi bilan hisoblanadi va g/cm³ yoki kg/m³ da o'lchanadi."
    },
    {
        savol: "Moos qattiqlik shkalasi bo'yicha eng qattiq (10 ball) tabiiy modda qaysi?",
        variantlar: ["Kvars (7)", "Korund (9)", "Olmos (10)", "Topaz (8)"],
        togriJavob: "Olmos (10)",
        izoh: "Olmos Moos shkalasida eng yuqori — 10 ballik qattiqlikka ega."
    },
    {
        savol: "Nima uchun qishda ko'l va daryolar faqat yuzasidan muzlaydi?",
        variantlar: [
            "Muzning zichligi (0.92 g/cm³) suyuq suvnikidan (1.00 g/cm³) kichik bo'lgani uchun suv yuzida qalqib turadi",
            "Muz suvdan og'ir bo'lgani uchun",
            "Suv tubidan issiq gaz chiqqani uchun",
            "Muz hech qachon erimaydi"
        ],
        togriJavob: "Muzning zichligi (0.92 g/cm³) suyuq suvnikidan (1.00 g/cm³) kichik bo'lgani uchun suv yuzida qalqib turadi",
        izoh: "Suv +4°C da eng katta zichlikka (1.00 g/cm³) ega, muz esa 0.92 g/cm³ bo'lib suv sirtini qoplaydi va tubdagi hayotni saqlaydi."
    }
]

// ============================================================
// 1-KO'RGAZMA: ELEKTR O'TKAZUVCHANLIK REYTINGI (AMPERMETR VA LAMPA)
// ============================================================
const OTKAZGICHLAR = [
    { id: 'Ag', nom: 'Kumush (Ag)', reyting: 100, qarshilik: '1.59', tur: 'Metall (1-o\'rin)', rang: '#E2E8F0', izoh: 'Barcha metallar ichida elektr va issiqlikni eng yaxshi o\'tkazuvchi rekordchi metall (100%).' },
    { id: 'Cu', nom: 'Mis (Cu)', reyting: 94, qarshilik: '1.68', tur: 'Metall (2-o\'rin)', rang: '#F97316', izoh: 'Kumushdan keyin 2-o\'rinda! Arzonroq bo\'lgani uchun barcha elektr kabellari misdan yasaladi.' },
    { id: 'Au', nom: 'Oltin (Au)', reyting: 70, qarshilik: '2.44', tur: 'Metall (3-o\'rin)', rang: '#FACC15', izoh: '3-o\'rin. Hech qachon zanglamagani uchun mikrochiplar va protsessor kontaktlarida ishlatiladi.' },
    { id: 'Al', nom: 'Alyuminiy (Al)', reyting: 60, qarshilik: '2.65', tur: 'Metall (4-o\'rin)', rang: '#94A3B8', izoh: 'Yengil (2.7 g/cm³) va yaxshi o\'tkazgich — yuqori kuchlanishli havo elektr liniyalarida ishlatiladi.' },
    { id: 'Fe', nom: 'Temir (Fe)', reyting: 17, qarshilik: '9.71', tur: 'Metall', rang: '#64748B', izoh: 'Misga nisbatan ~6 marta kam tok o\'tkazadi, qarshiligi tufayli tok o\'tganda qiziydi.' },
    { id: 'C', nom: 'Grafit (C)', reyting: 3, qarshilik: '800', tur: 'Metallmas (Istisno!)', rang: '#475569', izoh: 'Metallmas bo\'lsa ham, qatlamlar orasidagi erkin elektronlari hisobiga elektr tokini o\'tkazadi!' },
    { id: 'S', nom: 'Oltingugurt (S₈)', reyting: 0, qarshilik: '∞', tur: 'Metallmas (Izolyator)', rang: '#EAB308', izoh: 'Erkin elektronlari yo\'q — elektr tokini umuman o\'tkazmaydi (dielektrik).' },
]

function ElektrReytingiCanvas() {
    const [tanlangan, setTanlangan] = useState(OTKAZGICHLAR[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let t = 0

        const chiz = () => {
            t += 0.04
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#070D19'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Zanjir ramkasi
            ctx.strokeStyle = '#334155'
            ctx.lineWidth = 4
            ctx.strokeRect(70, 50, 420, 175)

            // Batareya (chapda)
            ctx.fillStyle = '#1E293B'
            ctx.fillRect(45, 105, 50, 65)
            ctx.fillStyle = '#EF4444'
            ctx.fillRect(58, 95, 24, 10)
            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 13px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText('12 V', 70, 142)

            // Sinov namunasi (pastda o'rtada)
            ctx.fillStyle = tanlangan.rang
            ctx.strokeStyle = '#F8FAFC'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(185, 204, 190, 42, 8)
            ctx.fill()
            ctx.stroke()

            // Elektronlar oqimi
            if (tanlangan.reyting > 0) {
                const tezlik = (tanlangan.reyting / 100) * 4.5 + 0.4
                ctx.fillStyle = '#38BDF8'
                for (let i = 0; i < 12; i++) {
                    const ex = 195 + ((i * 15 + t * 25 * tezlik) % 170)
                    const ey = 216 + (i % 2) * 16
                    ctx.beginPath()
                    ctx.arc(ex, ey, 4, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            ctx.fillStyle = '#0F172A'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(tanlangan.nom, 280, 230)

            // Ampermetr (yuqori chaproqda)
            const ax = 200
            const ay = 55
            ctx.fillStyle = '#0F172A'
            ctx.strokeStyle = '#38BDF8'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.arc(ax, ay, 42, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

            // Ampermetr shkalasi va strelkasi
            const burchak = -Math.PI * 0.8 + (tanlangan.reyting / 100) * (Math.PI * 0.6)
            ctx.strokeStyle = '#EF4444'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(ax, ay + 12)
            ctx.lineTo(ax + Math.cos(burchak) * 30, ay + 12 + Math.sin(burchak) * 30)
            ctx.stroke()

            ctx.fillStyle = '#38BDF8'
            ctx.font = 'bold 13px "Times New Roman", serif'
            ctx.fillText(`I = ${(tanlangan.reyting * 0.12).toFixed(1)} A`, ax, ay + 30)

            // Lampa (o'ngda)
            const lx = 490
            const ly = 135
            const yoruglik = tanlangan.reyting / 100
            if (yoruglik > 0) {
                const grad = ctx.createRadialGradient(lx, ly, 8, lx, ly, 30 + yoruglik * 65)
                grad.addColorStop(0, `rgba(250, 204, 21, ${0.35 + yoruglik * 0.65})`)
                grad.addColorStop(1, 'rgba(250, 204, 21, 0)')
                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.arc(lx, ly, 30 + yoruglik * 65, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.fillStyle = yoruglik > 0 ? `rgba(250, 204, 21, ${0.35 + yoruglik * 0.65})` : '#1E293B'
            ctx.strokeStyle = '#94A3B8'
            ctx.lineWidth = 2.5
            ctx.beginPath()
            ctx.arc(lx, ly, 26, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

            // Reyting ustunlari (o'ng panelda)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = 'bold 12px "Times New Roman", serif'
            ctx.fillText("Nisbiy elektr o'tkazuvchanlik (Ag = 100%):", 60, 265)

            ctx.fillStyle = '#1E293B'
            ctx.fillRect(60, 273, 440, 14)
            ctx.fillStyle = tanlangan.reyting > 50 ? '#10B981' : tanlangan.reyting > 0 ? '#F59E0B' : '#EF4444'
            ctx.fillRect(60, 273, (tanlangan.reyting / 100) * 440, 14)

            ctx.fillStyle = '#FFFFFF'
            ctx.textAlign = 'right'
            ctx.fillText(`${tanlangan.reyting}%`, 535, 285)

            animId = requestAnimationFrame(chiz)
        }
        chiz()
        return () => cancelAnimationFrame(animId)
    }, [tanlangan])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">1. Elektr o'tkazuvchanlik reytingi (Ag &gt; Cu &gt; Au &gt; Al &gt; Fe)</h3>
                    <p className="text-sm text-slate-400 font-serif">Namunani zanjirga ulang va ampermetr ko'rsatkichi hamda lampa yorqinligini solishtiring</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-sm font-bold font-serif">
                    {tanlangan.tur}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={300} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                        {OTKAZGICHLAR.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => { tovushChiqar('click'); setTanlangan(m) }}
                                className={`p-2.5 rounded-xl border text-left transition-all font-serif ${
                                    tanlangan.id === m.id
                                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">{m.nom}</span>
                                    <span className="text-xs font-bold text-sky-400">{m.reyting}%</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-serif">
                        <div className="text-amber-400 font-bold text-sm mb-1">{tanlangan.nom} — {tanlangan.reyting}%</div>
                        <p className="text-slate-200 text-sm leading-relaxed">{tanlangan.izoh}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 2-KO'RGAZMA: YENGIL VA OG'IR METALLAR (SIMOB, SUV VA KEROSINDA SUZISH)
// ============================================================
const METALL_ZICHLIK = [
    { id: 'Li', nom: 'Litiy (Li)', rho: 0.53, tur: 'Eng yengil metall', rang: '#F43F5E', izoh: 'Eng yengil metall (0.53 g/cm³)! Hatto kerosinda (0.80 g/cm³) ham cho\'kmay qalqib yuradi.' },
    { id: 'Na', nom: 'Natriy (Na)', rho: 0.97, tur: 'Yengil ishqoriy metall', rang: '#FB923C', izoh: 'Suvdan yengil (0.97 g/cm³), lekin kerosindan og\'ir — shuning uchun kerosin tubida xavfsiz saqlanadi!' },
    { id: 'Al', nom: 'Alyuminiy (Al)', rho: 2.70, tur: 'Yengil konstruksion metall', rang: '#94A3B8', izoh: 'Zichligi 2.70 g/cm³ (< 5 g/cm³ bo\'lgani uchun yengil metall). Samolyotsozlik asosi.' },
    { id: 'Fe', nom: 'Temir (Fe)', rho: 7.87, tur: 'Og\'ir metall (> 5 g/cm³)', rang: '#64748B', izoh: 'Zichligi 7.87 g/cm³. Suvda cho\'kadi, ammo suyuq simobda (13.6 g/cm³) po\'kakdek suzadi!' },
    { id: 'Pb', nom: 'Qo\'rg\'oshin (Pb)', rho: 11.34, tur: 'Og\'ir metall', rang: '#475569', izoh: 'Zichligi 11.34 g/cm³. Hatto og\'ir qo\'rg\'oshin g\'isht ham suyuq simob yuzida suzib yuradi!' },
    { id: 'Au', nom: 'Oltin (Au)', rho: 19.30, tur: 'O\'ta og\'ir metall', rang: '#FACC15', izoh: 'Zichligi 19.30 g/cm³ — suyuq simobdan ham og\'ir bo\'lgani uchun simob tubiga cho\'kadi!' },
    { id: 'Os', nom: 'Osmiy (Os)', rho: 22.60, tur: 'Eng og\'ir metall (Rekord!)', rang: '#38BDF8', izoh: 'Tabiatdagi eng zich va eng og\'ir metall (22.6 g/cm³). 1 litr osmiy 22.6 kg tosh bosadi!' },
]

const SUYUQLIKLAR = [
    { id: 'kerosin', nom: 'Kerosin (ρ = 0.80 g/cm³)', rho: 0.80, rang: 'rgba(250, 204, 21, 0.28)' },
    { id: 'suv', nom: 'Suv (ρ = 1.00 g/cm³)', rho: 1.00, rang: 'rgba(56, 189, 248, 0.30)' },
    { id: 'simob', nom: 'Suyuq Simob — Hg (ρ = 13.60 g/cm³)', rho: 13.60, rang: 'rgba(148, 163, 184, 0.78)' },
]

function YengilOgirMetallarCanvas() {
    const [metall, setMetall] = useState(METALL_ZICHLIK[3]) // Temir
    const [suyuqlik, setSuyuqlik] = useState(SUYUQLIKLAR[2]) // Simob
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let t = 0

        const chiz = () => {
            t += 0.04
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#070D19'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Menaurka idish
            const ix = 160
            const iy = 35
            const iw = 240
            const ih = 230

            // Suyuqlik
            const sY = iy + 65
            ctx.fillStyle = suyuqlik.rang
            ctx.fillRect(ix + 3, sY, iw - 6, iy + ih - sY - 3)

            // Idish devori
            ctx.strokeStyle = '#64748B'
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.moveTo(ix, iy)
            ctx.lineTo(ix, iy + ih)
            ctx.lineTo(ix + iw, iy + ih)
            ctx.lineTo(ix + iw, iy)
            ctx.stroke()

            // Suzish yoki cho'kish hisobi
            const suzadimi = metall.rho < suyuqlik.rho
            const botishUlushi = suzadimi ? Math.min(0.9, Math.max(0.25, metall.rho / suyuqlik.rho)) : 1
            const kubHajm = 56
            const maqsadY = suzadimi
                ? sY - kubHajm * (1 - botishUlushi) + Math.sin(t * 2) * 3
                : iy + ih - kubHajm - 8

            // Metall kubik
            const kx = ix + iw / 2 - kubHajm / 2
            ctx.fillStyle = metall.rang
            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 2.5
            ctx.beginPath()
            ctx.roundRect(kx, maqsadY, kubHajm, kubHajm, 8)
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = '#0F172A'
            ctx.font = 'bold 18px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(metall.id, kx + kubHajm / 2, maqsadY + 26)
            ctx.font = 'bold 12px "Times New Roman", serif'
            ctx.fillText(`${metall.rho}`, kx + kubHajm / 2, maqsadY + 44)

            // O'ng va chap ma'lumot yozuvlari
            ctx.textAlign = 'left'
            ctx.fillStyle = '#38BDF8'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(suyuqlik.nom, 20, 30)

            ctx.fillStyle = suzadimi ? '#10B981' : '#F43F5E'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.fillText(
                suzadimi
                    ? `SUZADI! (${metall.rho} < ${suyuqlik.rho} g/cm³)`
                    : `CHO'KADI! (${metall.rho} > ${suyuqlik.rho} g/cm³)`,
                160,
                286
            )

            // 5 g/cm³ chegara shkalasi (o'ng tomonda)
            ctx.fillStyle = '#94A3B8'
            ctx.font = 'bold 12px "Times New Roman", serif'
            ctx.fillText('Chegara: 5.0 g/cm³', 425, 75)
            ctx.fillStyle = metall.rho < 5 ? '#10B981' : '#F59E0B'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(metall.rho < 5 ? 'YENGIL METALL' : "OG'IR METALL", 425, 98)

            animId = requestAnimationFrame(chiz)
        }
        chiz()
        return () => cancelAnimationFrame(animId)
    }, [metall, suyuqlik])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">2. Yengil (&lt; 5 g/cm³) va Og'ir (&gt; 5 g/cm³) metallar</h3>
                    <p className="text-sm text-slate-400 font-serif">Metallarni kerosin, suv va suyuq simobga tashlab ko'ring: temir va qo'rg'oshin simobda suzadimi?</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {SUYUQLIKLAR.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => { tovushChiqar('click'); setSuyuqlik(s) }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif border transition-all ${
                                suyuqlik.id === s.id
                                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            {s.nom}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={300} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        {METALL_ZICHLIK.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => { tovushChiqar('click'); setMetall(m) }}
                                className={`p-2.5 rounded-xl border text-left transition-all font-serif ${
                                    metall.id === m.id
                                        ? 'bg-amber-500/20 border-amber-400 text-white'
                                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">{m.nom}</span>
                                    <span className="text-xs font-bold text-amber-400">{m.rho}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-serif">
                        <div className="text-emerald-400 font-bold text-sm mb-1">{metall.nom} — {metall.tur}</div>
                        <p className="text-slate-200 text-sm leading-relaxed">{metall.izoh}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 3-KO'RGAZMA: QOTISHMALAR MEXANIZMI (SOF METALL VS QOTISHMA)
// ============================================================
const QOTISHMALAR = [
    {
        id: 'sof_cu',
        nom: 'Sof Mis (100% Cu)',
        tarkib: 'Faqat Cu atomlari',
        qattiqlik: 35,
        siljish: 48,
        asosiyRang: '#F97316',
        qoshimchaRang: null,
        izoh: 'Sof metallda barcha atomlar bir xil o\'lchamda bo\'lgani uchun qatlamlar kuch ta\'sirida o\'zaro oson sirpanadi — shuning uchun sof mis va sof oltin yumshoq bo\'ladi.'
    },
    {
        id: 'bronza',
        nom: 'Bronza (Cu + Sn)',
        tarkib: '90% Mis + 10% Qalay (Sn)',
        qattiqlik: 85,
        siljish: 10,
        asosiyRang: '#F97316',
        qoshimchaRang: '#38BDF8',
        izoh: 'Mis panjarasiga yirikroq Qalay (Sn) atomlari kiritilsa, ular qatlamlarning sirpanishiga "pona" kabi to\'sqinlik qiladi. Natijada bronza sof misdan 3 barobar qattiq bo\'ladi!'
    },
    {
        id: 'latun',
        nom: 'Latun — Jez (Cu + Zn)',
        tarkib: '70% Mis + 30% Rux (Zn)',
        qattiqlik: 75,
        siljish: 14,
        asosiyRang: '#F97316',
        qoshimchaRang: '#FACC15',
        izoh: 'Mis va Rux qotishmasi oltinrang tusga, zangga chidamlilikka va yuqori mustahkamlikka ega. Jo\'mraklar, musiqa asboblari va gilzalarda ishlatiladi.'
    },
    {
        id: 'polat',
        nom: 'Po\'lat (Fe + C < 2%)',
        tarkib: '98.5% Temir + 1.5% Uglerod (C)',
        qattiqlik: 95,
        siljish: 6,
        asosiyRang: '#94A3B8',
        qoshimchaRang: '#10B981',
        izoh: 'Temir atomlari orasidagi bo\'shliqlarga kichik Uglerod (C) atomlari joylashib, kristall panjarani qulflaydi — ko\'priklar, pichoqlar va mashinalar po\'latdan yasaladi.'
    }
]

function QotishmaKristallCanvas() {
    const [tanlangan, setTanlangan] = useState(QOTISHMALAR[0])
    const [bosim, setBosim] = useState(false)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const siljishX = bosim ? tanlangan.siljish : 0

        // Yuqori qatlamga bosim strelkasi
        ctx.fillStyle = bosim ? '#EF4444' : '#475569'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = 'left'
        ctx.fillText(bosim ? 'BOSIM KUCHI (F) TA\'SIR ETMOQDA →' : 'Tinch holat (Kuchni sinab ko\'ring)', 40, 38)

        // 4 qator atomlar panjarasi
        for (let r = 0; r < 4; r++) {
            const qatorSiljish = r < 2 ? siljishX : 0
            for (let c = 0; c < 7; c++) {
                const ax = 115 + c * 52 + qatorSiljish
                const ay = 82 + r * 50

                const qoshimchami = tanlangan.qoshimchaRang && ((r === 1 && c === 2) || (r === 2 && c === 4) || (r === 1 && c === 5))
                const radius = qoshimchami ? (tanlangan.id === 'polat' ? 14 : 26) : 21

                ctx.fillStyle = qoshimchami ? tanlangan.qoshimchaRang : tanlangan.asosiyRang
                ctx.strokeStyle = '#FFFFFF'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(ax, ay, radius, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()

                ctx.fillStyle = '#0F172A'
                ctx.font = 'bold 12px "Times New Roman", serif'
                ctx.textAlign = 'center'
                const belgi = qoshimchami
                    ? (tanlangan.id === 'bronza' ? 'Sn' : tanlangan.id === 'latun' ? 'Zn' : 'C')
                    : (tanlangan.id === 'polat' ? 'Fe' : 'Cu')
                ctx.fillText(belgi, ax, ay + 4)
            }
        }

        // Qattiqlik ko'rsatkichi
        ctx.textAlign = 'left'
        ctx.fillStyle = '#94A3B8'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText(`Mustahkamlik va qattiqlik: ${tanlangan.qattiqlik}%`, 60, 278)
        ctx.fillStyle = '#1E293B'
        ctx.fillRect(280, 266, 220, 14)
        ctx.fillStyle = tanlangan.qattiqlik > 70 ? '#10B981' : '#F59E0B'
        ctx.fillRect(280, 266, (tanlangan.qattiqlik / 100) * 220, 14)
    }, [tanlangan, bosim])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">3. Qotishmalar siri: Nega bronza va po'lat sof metalldan qattiq?</h3>
                    <p className="text-sm text-slate-400 font-serif">Qotishmani tanlab, atom qatlamlariga yon tomondan bosim berib ko'ring</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('click'); setBosim(!bosim) }}
                    className={`px-4 py-2 rounded-xl font-bold font-serif text-sm border transition-all ${
                        bosim
                            ? 'bg-rose-500 text-white border-rose-400 shadow-lg'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    }`}
                >
                    {bosim ? "Kuchni to'xtatish" : "Bolg'a bilan kuch berish (F →)"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={300} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2.5">
                    {QOTISHMALAR.map((q) => (
                        <button
                            key={q.id}
                            onClick={() => { tovushChiqar('click'); setTanlangan(q) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all font-serif ${
                                tanlangan.id === q.id
                                    ? 'bg-indigo-500/20 border-indigo-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">{q.nom}</span>
                                <span className="text-xs text-indigo-300 font-bold">{q.tarkib}</span>
                            </div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-serif">
                        <p className="text-slate-200 text-sm leading-relaxed">{tanlangan.izoh}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 4-KO'RGAZMA: METALLMASLARNING RANG-BARANGLIGI VA AGREGAT HOLATI
// ============================================================
const METALLMASLAR = [
    { id: 'Br2', nom: 'Brom (Br₂)', holat: 'Suyuqlik (Yagona suyuq metallmas!)', rang: '#B91C1C', bugRang: 'rgba(239, 68, 68, 0.45)', izoh: 'Xona haroratida suyuq bo\'lgan yagona metallmas! Qizil-qo\'ng\'ir rangli, o\'tkir hidli uchuvchan suyuqlik.' },
    { id: 'I2', nom: 'Yod (I₂)', holat: 'Qattiq kristall → Sublimatsiya!', rang: '#7E22CE', bugRang: 'rgba(168, 85, 247, 0.55)', izoh: 'To\'q binafsha-qora yaltiroq kristall. Qizdirilganda suyuqlikka aylanmasdan to\'g\'ridan-to\'g\'ri binafsha bug\'ga aylanadi (sublimatsiya)!' },
    { id: 'S8', nom: 'Oltingugurt (S₈)', holat: 'Qattiq mo\'rt kristall', rang: '#FACC15', bugRang: null, izoh: 'Limon-sariq rangli mo\'rt kristall modda. Suvda erimaydi va suv yuzida suzib qoladi (flotatsiya).' },
    { id: 'Cl2', nom: 'Xlor (Cl₂)', holat: 'Gaz (Sarg\'ish-yashil)', rang: '#84CC16', bugRang: 'rgba(132, 204, 22, 0.38)', izoh: 'Sarg\'ish-yashil rangli, havodan 2.5 marta og\'ir bo\'g\'uvchi gaz.' },
    { id: 'P', nom: 'Qizil Fosfor (P)', holat: 'Qattiq kukun', rang: '#DC2626', bugRang: null, izoh: 'To\'q qizil rangli kukun, gugurt qutisining yon devoriga surtiladi.' },
]

function MetallmaslarPalitrasiCanvas() {
    const [modda, setModda] = useState(METALLMASLAR[0])
    const [qizdirish, setQizdirish] = useState(true)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let t = 0

        const chiz = () => {
            t += 0.05
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#070D19'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Kolba
            const kx = 280
            const ky = 175
            ctx.strokeStyle = '#94A3B8'
            ctx.lineWidth = 3.5
            ctx.beginPath()
            ctx.arc(kx, ky, 75, 0.25 * Math.PI, 0.75 * Math.PI, true)
            ctx.stroke()

            // Bug' yoki gaz zarrachalari
            if (modda.bugRang && (qizdirish || modda.id === 'Cl2' || modda.id === 'Br2')) {
                ctx.fillStyle = modda.bugRang
                for (let i = 0; i < 18; i++) {
                    const bx = kx + Math.sin(t + i * 1.3) * 48
                    const by = ky + 20 - ((t * 25 + i * 12) % 120)
                    ctx.beginPath()
                    ctx.arc(bx, by, 14 + (i % 5) * 3, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            // Kolba tubidagi modda
            ctx.fillStyle = modda.rang
            if (modda.id === 'Br2') {
                ctx.beginPath()
                ctx.arc(kx, ky, 70, 0.15 * Math.PI, 0.85 * Math.PI)
                ctx.fill()
            } else if (modda.id !== 'Cl2') {
                for (let i = -3; i <= 3; i++) {
                    ctx.beginPath()
                    ctx.arc(kx + i * 13, ky + 48 - Math.abs(i) * 3, 12, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            // Gorelka alangasi
            if (qizdirish) {
                ctx.fillStyle = '#F97316'
                ctx.beginPath()
                ctx.arc(kx, 268, 16 + Math.sin(t * 4) * 3, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(`${modda.nom} — ${modda.holat}`, kx, 35)

            animId = requestAnimationFrame(chiz)
        }
        chiz()
        return () => cancelAnimationFrame(animId)
    }, [modda, qizdirish])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">4. Metallmaslarning rang-barangligi va agregat holatlari</h3>
                    <p className="text-sm text-slate-400 font-serif">Metallar asosan kumushdek oq-kulrang bo'lsa, metallmaslar barcha rang va 3 xil agregat holatda uchraydi</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('click'); setQizdirish(!qizdirish) }}
                    className={`px-4 py-1.5 rounded-xl font-bold font-serif text-sm border transition-all ${
                        qizdirish
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                >
                    {qizdirish ? "Alanga yoqilgan (Sublimatsiya)" : "Alangani yoqish"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={300} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2">
                    {METALLMASLAR.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => { tovushChiqar('click'); setModda(m) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all font-serif ${
                                modda.id === m.id
                                    ? 'bg-purple-500/20 border-purple-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">{m.nom}</span>
                                <span className="text-xs text-purple-300">{m.holat}</span>
                            </div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-serif">
                        <p className="text-slate-200 text-sm leading-relaxed">{modda.izoh}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 5-KO'RGAZMA: AKUSTIK REZONANS (METALL JARANGDORLIGI)
// ============================================================
const AKUSTIK_NAMUNALAR = [
    { id: 'bronza', nom: 'Bronza qo\'ng\'iroq (Cu+Sn)', amplituda: 65, sonish: 0.008, chastota: 0.22, rang: '#F59E0B', izoh: 'Kristall panjarasi elastik bo\'lgani uchun zarba to\'lqinini uzoq vaqt so\'ndirmay jaranglaydi — qo\'ng\'iroqlar shuning uchun bronzadan quyiladi!' },
    { id: 'polat', nom: 'Po\'lat kamerton (Fe+C)', amplituda: 55, sonish: 0.012, chastota: 0.28, rang: '#38BDF8', izoh: 'Aniq va tiniq yuqori chastotali metall jarang chiqaradi — musiqa kamertonlari po\'latdan yasaladi.' },
    { id: 'qorgoshin', nom: 'Qo\'rg\'oshin plastina (Pb)', amplituda: 25, sonish: 0.14, chastota: 0.08, rang: '#64748B', izoh: 'Yumshoq va ichki ishqalanishi katta bo\'lgani uchun tovush bir lahzada so\'nadi ("bo\'g\'iq" tovush).' },
    { id: 'oltingugurt', nom: 'Oltingugurt / Ko\'mir (Metallmas)', amplituda: 15, sonish: 0.25, chastota: 0.05, rang: '#EAB308', izoh: 'Metallmaslarda metall jarangdorligi yo\'q — urilganda bo\'g\'iq taqillaydi va sinib ketadi.' },
]

function AkustikJarangCanvas() {
    const [namuna, setNamuna] = useState(AKUSTIK_NAMUNALAR[0])
    const [zarbaVaqt, setZarbaVaqt] = useState(0)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let t = 0

        const chiz = () => {
            t += 1
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#070D19'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Ossillograf to'ri
            ctx.strokeStyle = '#1E293B'
            ctx.lineWidth = 1
            for (let x = 40; x < 520; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, 250); ctx.stroke()
            }
            ctx.beginPath(); ctx.moveTo(40, 145); ctx.lineTo(520, 145); ctx.stroke()

            // Tovush to'lqini
            const joriyAmp = namuna.amplituda * Math.exp(-namuna.sonish * (t % 160))
            ctx.strokeStyle = namuna.rang
            ctx.lineWidth = 3
            ctx.beginPath()
            for (let x = 40; x <= 520; x++) {
                const dx = x - 40
                const y = 145 + Math.sin(dx * namuna.chastota - t * 0.35) * joriyAmp * Math.exp(-dx * namuna.sonish * 0.25)
                if (x === 40) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.stroke()

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 15px "Times New Roman", serif'
            ctx.textAlign = 'left'
            ctx.fillText(`Ossillogramma: ${namuna.nom}`, 45, 30)

            ctx.fillStyle = joriyAmp > 12 ? '#10B981' : '#94A3B8'
            ctx.fillText(joriyAmp > 12 ? '♪ Jarang davom etmoqda (Yuqori akustik rezonans)' : 'Tovush so\'ndi', 45, 278)

            animId = requestAnimationFrame(chiz)
        }
        chiz()
        return () => cancelAnimationFrame(animId)
    }, [namuna, zarbaVaqt])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">5. Metall jarangdorligi (Akustik rezonans ossillogrammasi)</h3>
                    <p className="text-sm text-slate-400 font-serif">Bolg'acha bilan urib ko'ring: nega qo'ng'iroqlar bronzadan yasaladi, qo'rg'oshin va oltingugurtdan emas?</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('success'); setZarbaVaqt((v) => v + 1) }}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-bold font-serif text-sm hover:bg-amber-500/30"
                >
                    Bolg'acha bilan urish
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={300} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2">
                    {AKUSTIK_NAMUNALAR.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => { tovushChiqar('click'); setNamuna(n); setZarbaVaqt((v) => v + 1) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all font-serif ${
                                namuna.id === n.id
                                    ? 'bg-amber-500/20 border-amber-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{n.nom}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-serif">
                        <p className="text-slate-200 text-sm leading-relaxed">{namuna.izoh}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 6-KO'RGAZMA: TERMIK KENGAYISH VA BIMETALL PLASTINKA (TERMOSTAT)
// ============================================================
function BimetallTermostatCanvas() {
    const [harorat, setHarorat] = useState(20) // 20°C dan 200°C gacha
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Egilish darajasi (Mis temirdan ~1.5 marta kuchliroq kengayadi)
        const egilish = ((harorat - 20) / 180) * 65
        const kontaktYopiq = harorat < 140

        // Mahkamlagich (chapda)
        ctx.fillStyle = '#334155'
        ctx.fillRect(50, 100, 40, 70)

        // Mis qatlami (ustki — ko'proq kengayadi, pastga egadi)
        ctx.strokeStyle = '#F97316'
        ctx.lineWidth = 14
        ctx.beginPath()
        ctx.moveTo(90, 128)
        ctx.quadraticCurveTo(250, 128 + egilish * 0.4, 390, 128 + egilish)
        ctx.stroke()

        // Temir qatlami (ostki — kamroq kengayadi)
        ctx.strokeStyle = '#94A3B8'
        ctx.lineWidth = 14
        ctx.beginPath()
        ctx.moveTo(90, 142)
        ctx.quadraticCurveTo(250, 142 + egilish * 0.4, 390, 142 + egilish)
        ctx.stroke()

        // Elektr kontakti (yuqori o'ngda)
        ctx.fillStyle = kontaktYopiq ? '#10B981' : '#EF4444'
        ctx.beginPath()
        ctx.arc(390, 112, 10, 0, Math.PI * 2)
        ctx.fill()

        // Yozuvlar
        ctx.fillStyle = '#F97316'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = 'left'
        ctx.fillText('Ustki qatlam: Mis (Cu) — kuchli kengayadi (α = 17)', 90, 70)
        ctx.fillStyle = '#94A3B8'
        ctx.fillText('Ostki qatlam: Temir (Fe) — kam kengayadi (α = 12)', 90, 92)

        ctx.fillStyle = kontaktYopiq ? '#10B981' : '#F43F5E'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.fillText(
            kontaktYopiq
                ? `Harorat: ${harorat}°C — Kontakt YOPIQ (Dazmol qizimoqda)`
                : `Harorat: ${harorat}°C — Plastinka egildi va kontaktni UZDI! (Avto-o'chirgich)`,
            60,
            265
        )
    }, [harorat])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">6. Metallarning issiqlikdan kengayishi: Bimetall termostat (Cu + Fe)</h3>
                    <p className="text-sm text-slate-400 font-serif">Dazmol va elektr choynak qiziganda qanday qilib o'zi avtomatik o'chadi? Haroratni oshirib ko'ring!</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold font-serif text-sm">
                    T = {harorat} °C
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={300} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-4 font-serif">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <label className="block text-sm font-bold text-slate-300 mb-2">
                            Dazmol haroratini oshiring (20°C → 200°C):
                        </label>
                        <input
                            type="range"
                            min={20}
                            max={200}
                            value={harorat}
                            onChange={(e) => setHarorat(Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>20°C (Sovuq)</span>
                            <span>140°C (Chegara)</span>
                            <span>200°C (Qaynoq)</span>
                        </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        Payvandlangan <strong className="text-amber-400">Mis (Cu)</strong> va <strong className="text-slate-300">Temir (Fe)</strong> plastinka qizdirilganda mis ko'proq uzayadi va plastinkani temir tomonga egib, 140°C da elektr zanjirini avtomatik uzadi!
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 1-O'YIN: MUHANDIS TANLOVI (10 TA AMALIY VAZIFA)
// ============================================================
const MUHANDIS_SAVOLLAR = [
    { vazifa: "Samolyot korpusini yasash uchun ham yengil (ρ = 2.7 g/cm³), ham mustahkam metall kerak:", javob: "Alyuminiy va Duralyuminiy", variantlar: ["Qo'rg'oshin (Pb)", "Alyuminiy va Duralyuminiy", "Simob (Hg)", "Oltingugurt (S)"] },
    { vazifa: "Rentgen nurlaridan va radiatsiyadan himoya qiluvchi og'ir, zich qalqon yasash uchun:", javob: "Qo'rg'oshin (Pb — 11.34 g/cm³)", variantlar: ["Litiy (Li)", "Qo'rg'oshin (Pb — 11.34 g/cm³)", "Alyuminiy (Al)", "Grafit (C)"] },
    { vazifa: "Cho'g'lanma lampochka tolasi 3422°C gacha erimasdan cho'g'lanib turishi uchun qaysi metall tanlanadi?", javob: "Volfram (W)", variantlar: ["Qalay (Sn)", "Volfram (W)", "Galliy (Ga)", "Natriy (Na)"] },
    { vazifa: "Xona haroratida suyuq bo'lgan yagona metallmas qaysi?", javob: "Brom (Br₂)", variantlar: ["Simob (Hg)", "Brom (Br₂)", "Xlor (Cl₂)", "Yod (I₂)"] },
    { vazifa: "Qizdirilganda suyuqlanmasdan to'g'ri binafsha rangli bug'ga aylanadigan (sublimatsiyalanadigan) metallmas:", javob: "Yod (I₂)", variantlar: ["Oltingugurt (S₈)", "Yod (I₂)", "Grafit (C)", "Kremniy (Si)"] },
    { vazifa: "Barcha metallar ichida elektr tokini 1-o'rinda (100%) eng yaxshi o'tkazuvchi metall:", javob: "Kumush (Ag)", variantlar: ["Temir (Fe)", "Kumush (Ag)", "Qo'rg'oshin (Pb)", "Rux (Zn)"] },
    { vazifa: "Metallmas bo'lsa ham, elektr tokini yaxshi o'tkazadigan qalam o'zagi va elektrod moddasi:", javob: "Grafit (C)", variantlar: ["Oltingugurt (S)", "Grafit (C)", "Olmos (C)", "Oq fosfor (P₄)"] },
    { vazifa: "Tabiatdagi eng yengil metall (ρ = 0.53 g/cm³) — hatto kerosinda ham suzadi:", javob: "Litiy (Li)", variantlar: ["Natriy (Na)", "Litiy (Li)", "Alyuminiy (Al)", "Magniy (Mg)"] },
    { vazifa: "Tabiatdagi eng og'ir (eng zich, ρ = 22.6 g/cm³) metall:", javob: "Osmiy (Os)", variantlar: ["Qo'rg'oshin (Pb)", "Osmiy (Os)", "Temir (Fe)", "Kumush (Ag)"] },
    { vazifa: "Mis (Cu) va Qalay (Sn) qotishmasidan yasalgan jarangdor qo'ng'iroq materiali:", javob: "Bronza", variantlar: ["Cho'yan", "Bronza", "Duralyuminiy", "Po'lat"] },
]

function MuhandisTanloviOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = MUHANDIS_SAVOLLAR[idx]

    const tekshir = (v) => {
        if (tanlov) return
        setTanlov(v)
        if (v === joriy.javob) {
            tovushChiqar('success')
            setBall((b) => b + 10)
        } else {
            tovushChiqar('error')
        }
    }

    const keyingi = () => {
        tovushChiqar('click')
        setTanlov(null)
        setIdx((i) => (i + 1) % MUHANDIS_SAVOLLAR.length)
    }

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 font-serif">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">1-o'yin: Bosh Muhandis Tanlovi</h3>
                    <p className="text-sm text-slate-400">Texnik vazifa uchun eng to'g'ri metall, metallmas yoki qotishmani tanlang</p>
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    Ball: {ball} | {idx + 1}/{MUHANDIS_SAVOLLAR.length}
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg text-white font-bold">{joriy.vazifa}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {joriy.variantlar.map((v) => {
                    const togri = v === joriy.javob
                    const bosildi = tanlov === v
                    return (
                        <button
                            key={v}
                            onClick={() => tekshir(v)}
                            className={`p-4 rounded-xl border text-left font-bold transition-all ${
                                !tanlov
                                    ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-sky-400'
                                    : togri
                                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                    : bosildi
                                    ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                            }`}
                        >
                            {v}
                        </button>
                    )
                })}
            </div>

            {tanlov && (
                <div className="flex justify-end">
                    <button
                        onClick={keyingi}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                    >
                        Keyingi vazifa →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 2-O'YIN: SIMOBDA SUZADIMI YOKI CHO'KADIMI? (ρ_Hg = 13.6 g/cm³)
// ============================================================
const SIMOB_SINOV = [
    { nom: "Temir g'isht (ρ = 7.87 g/cm³)", suzadi: true, izoh: "7.87 < 13.6 bo'lgani uchun temir g'isht suyuq simob yuzida po'kakdek suzadi!" },
    { nom: "Oltin uzuk (ρ = 19.30 g/cm³)", suzadi: false, izoh: "19.30 > 13.6 bo'lgani uchun oltin suyuq simobda darhol tubiga cho'kadi!" },
    { nom: "Qo'rg'oshin shar (ρ = 11.34 g/cm³)", suzadi: true, izoh: "Qo'rg'oshin og'ir bo'lsa ham (11.34 g/cm³), simobdan (13.6 g/cm³) yengil — simobda suzadi!" },
    { nom: "Osmiy bo'lagi (ρ = 22.60 g/cm³)", suzadi: false, izoh: "Osmiy eng zich metall (22.60 > 13.6) — simob tubiga cho'kadi." },
    { nom: "Mis tanga (ρ = 8.96 g/cm³)", suzadi: true, izoh: "8.96 < 13.6 bo'lgani uchun mis tanga simob sirtida suzib yuradi." },
    { nom: "Volfram sterjen (ρ = 19.25 g/cm³)", suzadi: false, izoh: "Volframning zichligi oltin bilan deyarli teng (19.25 > 13.6) — simobda cho'kadi." },
    { nom: "Kumush qoshiq (ρ = 10.50 g/cm³)", suzadi: true, izoh: "10.50 < 13.6 bo'lgani uchun kumush simob yuzida qalqib turadi." },
    { nom: "Platina plastina (ρ = 21.45 g/cm³)", suzadi: false, izoh: "21.45 > 13.6 bo'lgani uchun platina simobda cho'kadi." },
]

function SimobdaSuzadimiOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [javobBerildi, setJavobBerildi] = useState(null)

    const joriy = SIMOB_SINOV[idx]

    const tanla = (qiymat) => {
        if (javobBerildi !== null) return
        setJavobBerildi(qiymat)
        if (qiymat === joriy.suzadi) {
            tovushChiqar('success')
            setBall((b) => b + 10)
        } else {
            tovushChiqar('error')
        }
    }

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 font-serif">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">2-o'yin: Suyuq Simobda (ρ = 13.6 g/cm³) Suzadimi yoki Cho'kadimi?</h3>
                    <p className="text-sm text-slate-400">Metallning zichligini simob zichligi (13.6 g/cm³) bilan taqqoslab toping</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    Ball: {ball} | {idx + 1}/{SIMOB_SINOV.length}
                </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-4">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Sinovdagi metall jism:</div>
                <div className="text-2xl font-bold text-white">{joriy.nom}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                    onClick={() => tanla(true)}
                    className="p-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-bold text-lg"
                >
                    SIMOBDA SUZADI (ρ &lt; 13.6)
                </button>
                <button
                    onClick={() => tanla(false)}
                    className="p-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400 text-rose-200 font-bold text-lg"
                >
                    SIMOBDA CHO'KADI (ρ &gt; 13.6)
                </button>
            </div>

            {javobBerildi !== null && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-200">{joriy.izoh}</p>
                    <button
                        onClick={() => {
                            tovushChiqar('click')
                            setJavobBerildi(null)
                            setIdx((i) => (i + 1) % SIMOB_SINOV.length)
                        }}
                        className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-sm shrink-0 ml-4"
                    >
                        Keyingisi →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 3-O'YIN: QOTISHMA KONSTRUKTORI
// ============================================================
const QOTISHMA_SAVOLLAR = [
    { qotishma: "Bronza (haykallar va qo'ng'iroqlar)", tarkib: "Mis (Cu) + Qalay (Sn)", variantlar: ["Mis (Cu) + Qalay (Sn)", "Temir (Fe) + Uglerod (C)", "Alyuminiy (Al) + Magniy (Mg)", "Mis (Cu) + Rux (Zn)"] },
    { qotishma: "Latun — Jez (musiqa asboblari va jo'mraklar)", tarkib: "Mis (Cu) + Rux (Zn)", variantlar: ["Mis (Cu) + Rux (Zn)", "Temir (Fe) + Xrom (Cr)", "Qo'rg'oshin (Pb) + Qalay (Sn)", "Oltin (Au) + Kumush (Ag)"] },
    { qotishma: "Po'lat (pichoqlar, ko'priklar, avtomobillar)", tarkib: "Temir (Fe) + Uglerod (C < 2%)", variantlar: ["Temir (Fe) + Uglerod (C < 2%)", "Mis (Cu) + Qalay (Sn)", "Alyuminiy (Al) + Mis (Cu)", "Nikel (Ni) + Xrom (Cr)"] },
    { qotishma: "Cho'yan (qozonlar va isitish radiatorlari)", tarkib: "Temir (Fe) + Uglerod (C > 2%)", variantlar: ["Temir (Fe) + Uglerod (C > 2%)", "Mis (Cu) + Rux (Zn)", "Qalay (Sn) + Qo'rg'oshin (Pb)", "Kumush (Ag) + Mis (Cu)"] },
    { qotishma: "Duralyuminiy (samolyot va raketa korpusi)", tarkib: "Alyuminiy (Al) + Mis (Cu) + Magniy (Mg)", variantlar: ["Alyuminiy (Al) + Mis (Cu) + Magniy (Mg)", "Qo'rg'oshin (Pb) + Surma (Sb)", "Temir (Fe) + Uglerod (C)", "Mis (Cu) + Nikel (Ni)"] },
    { qotishma: "Zanglamas po'lat (jarrohlik asboblari va qoshiqlar)", tarkib: "Temir (Fe) + Xrom (Cr) + Nikel (Ni)", variantlar: ["Temir (Fe) + Xrom (Cr) + Nikel (Ni)", "Mis (Cu) + Qalay (Sn)", "Alyuminiy (Al) + Rux (Zn)", "Natriy (Na) + Kaliy (K)"] },
]

function QotishmaKonstruktoriOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = QOTISHMA_SAVOLLAR[idx]

    const tekshir = (v) => {
        if (tanlov) return
        setTanlov(v)
        if (v === joriy.tarkib) {
            tovushChiqar('success')
            setBall((b) => b + 15)
        } else {
            tovushChiqar('error')
        }
    }

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 font-serif">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">3-o'yin: Metallurgiya — Qotishma Tarkibini Yig'ing</h3>
                    <p className="text-sm text-slate-400">Berilgan mashhur qotishma qaysi kimyoviy elementlardan tashkil topgan?</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold">
                    Ball: {ball} | {idx + 1}/{QOTISHMA_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4 text-center">
                <div className="text-xs text-slate-400 uppercase mb-1">Qotishma nomi:</div>
                <div className="text-2xl font-bold text-amber-400">{joriy.qotishma}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {joriy.variantlar.map((v) => (
                    <button
                        key={v}
                        onClick={() => tekshir(v)}
                        className={`p-4 rounded-xl border text-left font-bold transition-all ${
                            !tanlov
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-indigo-400'
                                : v === joriy.tarkib
                                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                : tanlov === v
                                ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                                : 'bg-slate-950/40 border-slate-800 text-slate-500'
                        }`}
                    >
                        {v}
                    </button>
                ))}
            </div>

            {tanlov && (
                <div className="flex justify-end">
                    <button
                        onClick={() => {
                            tovushChiqar('click')
                            setTanlov(null)
                            setIdx((i) => (i + 1) % QOTISHMA_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold"
                    >
                        Keyingi qotishma →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH)
// ============================================================
const DUEL_SAVOLLAR = [
    { savol: "Metallarni yengil va og'ir metallarga ajratuvchi shartli zichlik chegarasi qancha?", variantlar: ["1.0 g/cm³", "5.0 g/cm³", "10.0 g/cm³", "13.6 g/cm³"], javob: 1 },
    { savol: "Elektr tokini eng yaxshi o'tkazadigan metall qaysi?", variantlar: ["Mis (Cu)", "Kumush (Ag)", "Oltin (Au)", "Alyuminiy (Al)"], javob: 1 },
    { savol: "Xona haroratida suyuq bo'lgan yagona metall va yagona metallmas juftligini toping:", variantlar: ["Hg va Br₂", "Ga va Cl₂", "Cs va I₂", "Na va S₈"], javob: 0 },
    { savol: "Mis va Rux qotishmasi nima deb ataladi?", variantlar: ["Bronza", "Latun (Jez)", "Cho'yan", "Duralyuminiy"], javob: 1 },
    { savol: "Qaysi metall qo'l haroratida (+29.8°C) erib ketadi?", variantlar: ["Simob (Hg)", "Galliy (Ga)", "Volfram (W)", "Qalay (Sn)"], javob: 1 },
    { savol: "Qizdirilganda suyuqlikka aylanmay, to'g'ridan-to'g'ri binafsha bug'ga aylanadigan metallmas:", variantlar: ["Oltingugurt (S₈)", "Yod (I₂)", "Brom (Br₂)", "Qizil fosfor (P)"], javob: 1 },
]

function JamoalarDueli4_2() {
    const [idx, setIdx] = useState(0)
    const [ball1, setBall1] = useState(0)
    const [ball2, setBall2] = useState(0)
    const [navbat, setNavbat] = useState(1)
    const [natija, setNatija] = useState(null)

    const joriy = DUEL_SAVOLLAR[idx]

    const javobBer = (i) => {
        if (natija !== null) return
        setNatija(i)
        if (i === joriy.javob) {
            tovushChiqar('success')
            if (navbat === 1) setBall1((b) => b + 10)
            else setBall2((b) => b + 10)
        } else {
            tovushChiqar('error')
        }
    }

    const keyingi = () => {
        tovushChiqar('click')
        setNatija(null)
        setNavbat((n) => (n === 1 ? 2 : 1))
        setIdx((i) => (i + 1) % DUEL_SAVOLLAR.length)
    }

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 font-serif">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="text-xl font-bold text-white">4-o'yin: Smart-doska Jamoalar Dueli (1-guruh vs 2-guruh)</h3>
                <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl border font-bold ${navbat === 1 ? 'bg-sky-500/25 border-sky-400 text-sky-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                        1-Guruh: {ball1} ball
                    </div>
                    <div className={`px-4 py-2 rounded-xl border font-bold ${navbat === 2 ? 'bg-amber-500/25 border-amber-400 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                        2-Guruh: {ball2} ball
                    </div>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
                    Navbat: {navbat}-Guruh javob beradi
                </div>
                <p className="text-lg font-bold text-white">{joriy.savol}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {joriy.variantlar.map((v, i) => (
                    <button
                        key={v}
                        onClick={() => javobBer(i)}
                        className={`p-4 rounded-xl border text-left font-bold transition-all ${
                            natija === null
                                ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-sky-400'
                                : i === joriy.javob
                                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                : natija === i
                                ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                                : 'bg-slate-950/40 border-slate-800 text-slate-500'
                        }`}
                    >
                        {v}
                    </button>
                ))}
            </div>

            {natija !== null && (
                <div className="flex justify-end">
                    <button onClick={keyingi} className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold">
                        Keyingi guruhga navbat →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// ASOSIY KOMPONENT: MAVZU 4.2
// ============================================================
export default function Mavzu4_2() {
    const containerRef = useRef(null)
    const [toliqEkran, setToliqEkran] = useState(false)
    const [asosiyBolim, setAsosiyBolim] = useState('animatsiyalar')
    const [faolKorgazma, setFaolKorgazma] = useState(0)
    const [faolOyin, setFaolOyin] = useState(0)

    const toliqEkranniUlash = () => {
        if (!containerRef.current) return
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen?.().catch(() => {})
            setToliqEkran(true)
        } else {
            document.exitFullscreen?.().catch(() => {})
            setToliqEkran(false)
        }
    }

    useEffect(() => {
        const fn = () => setToliqEkran(Boolean(document.fullscreenElement))
        document.addEventListener('fullscreenchange', fn)
        return () => document.removeEventListener('fullscreenchange', fn)
    }, [])

    const korgazmalar = [
        { nom: "1. Elektr reytingi (Ag > Cu)", ikon: 'chaqmoq' },
        { nom: "2. Yengil va Og'ir metallar", ikon: 'tarozi' },
        { nom: "3. Qotishmalar kristali", ikon: 'kristall' },
        { nom: "4. Metallmaslar palitrasi", ikon: 'kolba' },
        { nom: "5. Metall jarangdorligi", ikon: 'tolqin' },
        { nom: "6. Bimetall termostat", ikon: 'olov' },
    ]

    const oyinlar = [
        { nom: "1. Bosh Muhandis Tanlovi", ikon: 'yulduz' },
        { nom: "2. Simobda Suzadimi?", ikon: 'kolba' },
        { nom: "3. Qotishma Konstruktori", ikon: 'kristall' },
        { nom: "4. Jamoalar Dueli (1 vs 2)", ikon: 'kubok' },
    ]

    return (
        <div
            ref={containerRef}
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
            className={`w-full select-none transition-all duration-300 font-serif ${
                toliqEkran
                    ? 'fixed inset-0 z-50 bg-[#020617] p-4 sm:p-8 flex flex-col justify-between overflow-y-auto'
                    : 'space-y-4'
            }`}
        >
            <SmartDoskaNavigatsiya
                mavzuRaqam="4.2"
                mavzuNom="Metall va metallmaslarning fizik xossalari"
                bobNom="4-bob. Moddalar va ularning xossalari"
                sahifa={59}
                oldingiRaqam="4.1"
                asosiyBolim={asosiyBolim}
                setAsosiyBolim={setAsosiyBolim}
                toliqEkran={toliqEkran}
                toliqEkranniUlash={toliqEkranniUlash}
            />

            {asosiyBolim === 'takrorlash' && (
                <OtganDarsniTakrorlash
                    oldingiRaqam="4.1"
                    oldingiNom="Moddalarning fizik xossalari"
                    savollar={TAKROPI_4_1}
                    onYangiDarsgaOtish={() => setAsosiyBolim('animatsiyalar')}
                />
            )}

            {asosiyBolim === 'animatsiyalar' && (
                <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {korgazmalar.map((k, i) => (
                            <button
                                key={k.nom}
                                type="button"
                                onClick={() => {
                                    setFaolKorgazma(i)
                                    tovushChiqar('click')
                                }}
                                className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                                    faolKorgazma === i
                                        ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-400/30'
                                        : 'border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-yellow-400/50'
                                }`}
                            >
                                <Ikon nom={k.ikon} olcham={16} />
                                <span>{k.nom}</span>
                            </button>
                        ))}
                    </div>

                    {faolKorgazma === 0 && <ElektrReytingiCanvas />}
                    {faolKorgazma === 1 && <YengilOgirMetallarCanvas />}
                    {faolKorgazma === 2 && <QotishmaKristallCanvas />}
                    {faolKorgazma === 3 && <MetallmaslarPalitrasiCanvas />}
                    {faolKorgazma === 4 && <AkustikJarangCanvas />}
                    {faolKorgazma === 5 && <BimetallTermostatCanvas />}
                </div>
            )}

            {asosiyBolim === 'oyinlar' && (
                <div className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {oyinlar.map((o, i) => (
                            <button
                                key={o.nom}
                                type="button"
                                onClick={() => {
                                    setFaolOyin(i)
                                    tovushChiqar('click')
                                }}
                                className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                                    faolOyin === i
                                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30'
                                        : 'border-blue-900/60 bg-[#060b22] text-blue-200 hover:border-emerald-400/50'
                                }`}
                            >
                                <Ikon nom={o.ikon} olcham={16} />
                                <span>{o.nom}</span>
                            </button>
                        ))}
                    </div>

                    {faolOyin === 0 && <MuhandisTanloviOyini />}
                    {faolOyin === 1 && <SimobdaSuzadimiOyini />}
                    {faolOyin === 2 && <QotishmaKonstruktoriOyini />}
                    {faolOyin === 3 && <JamoalarDueli4_2 />}
                </div>
            )}
        </div>
    )
}
