'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 4-BOB, 4.3-MAVZU
// "Kundalik hayotda foydalaniladigan moddalar va ularning xossalari" (Darslik 62-bet)
// 6 ta interaktiv Canvas Ko'rgazma + 4 ta Smart-doska O'yini
// ============================================================
import { kadrSora, kadrniBekorQil, umumiyAudio, variantlarniAralashtir, indekslanganVariantlarniAralashtir } from "@/lib/maktab-animatsiya"
import { useState, useEffect, useRef } from 'react'
import Ikon from '@/components/Ikon'
import OtganDarsniTakrorlash from '@/components/maktab/OtganDarsniTakrorlash'
import { SmartDoskaNavigatsiya } from '@/components/maktab/SmartDoskaYordamchi'

function tovushChiqar(turi) {
    if (typeof window === 'undefined') return
    try {
        const ctx = umumiyAudio()
        if (!ctx) return
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

const TAKROPI_4_2 = [
    {
        savol: "Barcha metallar ichida elektr tokini va issiqlikni 1-o'rinda eng yaxshi o'tkazadigan metall qaysi?",
        variantlar: ["Kumush (Ag)", "Oltin (Au)", "Alyuminiy (Al)", "Mis (Cu)"],
        togriJavob: "Kumush (Ag)",
        izoh: "Kumush (Ag) elektr va issiqlik o'tkazuvchanlik bo'yicha 1-o'rinda (100%), Mis (Cu) esa 2-o'rinda turadi."
    },
    {
        savol: "Metallarni shartli ravishda yengil va og'ir metallarga ajratuvchi zichlik chegarasi necha g/cm³?",
        variantlar: ["1.0 g/cm³", "5.0 g/cm³", "10.0 g/cm³", "13.6 g/cm³"],
        togriJavob: "5.0 g/cm³",
        izoh: "Zichligi 5 g/cm³ dan kichik metallar (Li, Na, Mg, Al, Ti) yengil metallar, 5 g/cm³ dan kattalari (Fe, Cu, Pb, Au, Os) og'ir metallar deyiladi."
    },
    {
        savol: "Bronza qotishmasi qaysi metallardan tarkib topgan?",
        variantlar: [
            "Temir (Fe) va Uglerod (C)",
            "Alyuminiy (Al) va Magniy (Mg)",
            "Mis (Cu) va Qalay (Sn)",
            "Mis (Cu) va Rux (Zn)",
        ],
        togriJavob: "Mis (Cu) va Qalay (Sn)",
        izoh: "Bronza — Mis (Cu) va Qalay (Sn) qotishmasi bo'lib, qadimdan haykallar va qo'ng'iroqlar quyishda ishlatiladi."
    }
]

// ============================================================
// 1-KO'RGAZMA: OSHXONA LABORATORIYASI (SODA + SIRKA, TUZ, SHAKAR)
// ============================================================
const OSHXONA_TAJRIBALAR = [
    {
        id: 'soda_sirka',
        nom: "Ichimlik sodasi + Sirka (NaHCO₃ + CH₃COOH)",
        formula: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑",
        hodisa: "Kuchli ko'piklanish va CO₂ gazi ajralishi (sharni shishiradi va xamirni ko'pchitadi)!",
        gaz: true,
        rang: '#38BDF8',
        izoh: "Xamirga qo'shilgan ichimlik sodasi (NaHCO₃) qatiq yoki sirka kislotasi bilan reaksiyaga kirishib, karbonat angidrid (CO₂↑) pufakchalarini chiqaradi — shu gaz pishiriqni g'ovak va yumshoq qiladi!"
    },
    {
        id: 'osh_tuzi',
        nom: "Osh tuzi (NaCl) ni 800°C gacha qizdirish",
        formula: "NaCl (qattiq kristall, T_erish = 801°C)",
        hodisa: "Qoraymaydi va yonmaydi! 801°C dagina rangsiz suyuqlikka eriydi.",
        gaz: false,
        rang: '#E2E8F0',
        izoh: "Osh tuzi (natriy xlorid NaCl) — ion kristall panjarali noorganik modda. Tovada qizdirilganda kuymaydi, suvda yaxshi eriydi va eritmasi elektr tokini o'tkazadi."
    },
    {
        id: 'shakar',
        nom: "Shakar (C₁₂H₂₂O₁₁) ni 180°C da qizdirish",
        formula: "C₁₂H₂₂O₁₁ → 12C (ko'mir) + 11H₂O↑",
        hodisa: "Avval sarg'ayib karamelga aylanadi, so'ng qorayib ko'mirga (C) parchalanadi!",
        gaz: true,
        rang: '#D97706',
        izoh: "Shakar (saxaroza C₁₂H₂₂O₁₁) — molekulyar tuzilishli organik modda. 160–180°C da erib karamelga aylanadi, kuchliroq qizdirilsa suv bug'i ajralib, qora ko'mir (C) qoladi."
    }
]

function OshxonaKimyosiCanvas() {
    const [tajriba, setTajriba] = useState(OSHXONA_TAJRIBALAR[0])
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
            const ky = 200
            ctx.strokeStyle = '#94A3B8'
            ctx.lineWidth = 3.5
            ctx.beginPath()
            ctx.moveTo(kx - 22, 95)
            ctx.lineTo(kx - 22, 130)
            ctx.lineTo(kx - 75, 240)
            ctx.lineTo(kx + 75, 240)
            ctx.lineTo(kx + 22, 130)
            ctx.lineTo(kx + 22, 95)
            ctx.stroke()

            // Kolba ichidagi modda
            ctx.fillStyle = tajriba.rang
            ctx.beginPath()
            ctx.moveTo(kx - 55, 200)
            ctx.lineTo(kx - 70, 236)
            ctx.lineTo(kx + 70, 236)
            ctx.lineTo(kx + 55, 200)
            ctx.closePath()
            ctx.fill()

            // Soda + Sirka bo'lsa, kolba og'zidagi rezina shar CO2 dan shishadi
            if (tajriba.id === 'soda_sirka') {
                const sharRadius = 36 + Math.sin(t * 2) * 5
                ctx.fillStyle = '#F43F5E'
                ctx.beginPath()
                ctx.arc(kx, 58, sharRadius, 0, Math.PI * 2)
                ctx.fill()
                ctx.fillStyle = '#FFFFFF'
                ctx.font = 'bold 14px "Times New Roman", serif'
                ctx.textAlign = 'center'
                ctx.fillText('CO₂↑', kx, 63)

                // Pufakchalar
                ctx.fillStyle = '#E0F2FE'
                for (let i = 0; i < 14; i++) {
                    const px = kx - 35 + ((i * 19) % 70)
                    const py = 225 - ((t * 40 + i * 15) % 120)
                    ctx.beginPath()
                    ctx.arc(px, py, 4 + (i % 3), 0, Math.PI * 2)
                    ctx.fill()
                }
            } else if (tajriba.id === 'shakar') {
                // Bug' va qoraygan karamel
                ctx.fillStyle = 'rgba(148, 163, 184, 0.35)'
                for (let i = 0; i < 8; i++) {
                    const bx = kx + Math.sin(t + i) * 20
                    const by = 160 - ((t * 25 + i * 18) % 110)
                    ctx.beginPath()
                    ctx.arc(bx, by, 10, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            // Formula yozuvi
            ctx.fillStyle = '#38BDF8'
            ctx.font = 'bold 15px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(tajriba.formula, kx, 278)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [tajriba])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">1. Oshxona kimyosi: Ichimlik sodasi (NaHCO₃), Sirka, Osh tuzi va Shakar</h3>
                <p className="text-sm text-slate-400 font-serif">Har kuni oshxonada ishlatadigan moddalarimizning kimyoviy xossalarini sinab ko'ring</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={300} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2.5 font-serif">
                    {OSHXONA_TAJRIBALAR.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => { tovushChiqar('click'); setTajriba(t) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                                tajriba.id === t.id
                                    ? 'bg-sky-500/20 border-sky-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{t.nom}</div>
                            <div className="text-xs text-sky-400 mt-0.5">{t.hodisa}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {tajriba.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 2-KO'RGAZMA: QURILISH KIMYOSI — OHAK AYLANISH ZANJIRI (CaCO₃ → CaO → Ca(OH)₂)
// ============================================================
const OHAK_BOSQICHLAR = [
    {
        id: 0,
        nom: "1-bosqich: Ohaktoshni kuydirish (1000°C)",
        reaksiya: "CaCO₃ (ohaktosh) → CaO (so'ndirilmagan ohak) + CO₂↑",
        rang: '#94A3B8',
        bug: true,
        izoh: "Tabiiy ohaktosh yoki marmar (CaCO₃) xumdonda 1000°C da qizdirilganda karbonat angidrid gazi (CO₂↑) uchib chiqadi va oq g'ovak tosh — so'ndirilmagan ohak (CaO) qoladi."
    },
    {
        id: 1,
        nom: "2-bosqich: Ohakni suv bilan so'ndirish (+Q issiqlik!)",
        reaksiya: "CaO + H₂O → Ca(OH)₂ (so'ndirilgan ohak) + Q↑",
        rang: '#F8FAFC',
        bug: true,
        izoh: "So'ndirilmagan ohak (CaO) ustiga suv quyilsa, suv shiddat bilan qaynab bug'lanadi va ko'p issiqlik (+Q) ajralib, oppoq bo'tqasimon so'ndirilgan ohak — Ca(OH)₂ hosil bo'ladi!"
    },
    {
        id: 2,
        nom: "3-bosqich: Devordagi ohakning qotishi",
        reaksiya: "Ca(OH)₂ + CO₂ (havodan) → CaCO₃↓ (qattiq qobiq) + H₂O↑",
        rang: '#E2E8F0',
        bug: false,
        izoh: "Devor oqlanganda so'ndirilgan ohak Ca(OH)₂ havodagi CO₂ gazini yutib, yana toshdek mustahkam CaCO₃ ga aylanadi va suv bug'lanib chiqadi!"
    }
]

function QurilishOhakCanvas() {
    const [bosqich, setBosqich] = useState(OHAK_BOSQICHLAR[1])
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

            // Reaksiya idishi / xumdon
            ctx.strokeStyle = '#64748B'
            ctx.lineWidth = 4
            ctx.strokeRect(150, 85, 260, 145)

            // Ichidagi ohak moddasi
            ctx.fillStyle = bosqich.rang
            ctx.fillRect(156, 155, 248, 70)

            // Bug' / CO2 pufaklari
            if (bosqich.bug) {
                ctx.fillStyle = bosqich.id === 1 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(251, 146, 60, 0.45)'
                for (let i = 0; i < 12; i++) {
                    const bx = 180 + i * 18 + Math.sin(t + i) * 6
                    const by = 155 - ((t * 32 + i * 14) % 95)
                    ctx.beginPath()
                    ctx.arc(bx, by, 9, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            ctx.fillStyle = '#0F172A'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(
                bosqich.id === 0 ? 'CaCO₃ → CaO' : bosqich.id === 1 ? 'CaO + H₂O → Ca(OH)₂ + Q↑' : 'Ca(OH)₂ + CO₂ → CaCO₃',
                280,
                195
            )

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 15px "Times New Roman", serif'
            ctx.fillText(bosqich.reaksiya, 280, 268)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [bosqich])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">2. Qurilish kimyosi: Ohaktosh (CaCO₃) → So'ndirilmagan ohak (CaO) → So'ndirilgan ohak Ca(OH)₂</h3>
                <p className="text-sm text-slate-400 font-serif">Qurilishda ishlatiladigan ohakning 3 bosqichli aylanish zanjirini kuzating</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={300} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2.5 font-serif">
                    {OHAK_BOSQICHLAR.map((b) => (
                        <button
                            key={b.id}
                            onClick={() => { tovushChiqar('click'); setBosqich(b) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                                bosqich.id === b.id
                                    ? 'bg-amber-500/20 border-amber-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{b.nom}</div>
                            <div className="text-xs text-amber-300 mt-0.5">{b.reaksiya}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {bosqich.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 3-KO'RGAZMA: SOVUN VA KIR YUVISH MEXANIZMI (MITSELLA)
// ============================================================
function SovunMitsellaCanvas() {
    const [sovunBor, setSovunBor] = useState(false)
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
            ctx.fillStyle = '#071526'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Mato tolasi (pastda)
            ctx.fillStyle = '#334155'
            ctx.fillRect(40, 235, 480, 28)
            ctx.fillStyle = '#CBD5E1'
            ctx.font = 'bold 13px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText('Kiyim matosi yuzasi', 280, 254)

            // Yog' dog'i markazi
            const yogX = 280
            const yogY = sovunBor ? 130 + Math.sin(t * 2) * 8 : 210

            ctx.fillStyle = '#FACC15'
            ctx.strokeStyle = '#CA8A04'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.arc(yogX, yogY, 38, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = '#0F172A'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText("Yog' dog'i", yogX, yogY + 5)

            // Sovun molekulalari (Gidrofil bosh + Gidrofob dum)
            if (sovunBor) {
                for (let i = 0; i < 12; i++) {
                    const burchak = (i / 12) * Math.PI * 2 + t * 0.3
                    const ichkiX = yogX + Math.cos(burchak) * 32
                    const ichkiY = yogY + Math.sin(burchak) * 32
                    const tashqiX = yogX + Math.cos(burchak) * 62
                    const tashqiY = yogY + Math.sin(burchak) * 62

                    // Gidrofob dum (yog' ichiga kiradi)
                    ctx.strokeStyle = '#F97316'
                    ctx.lineWidth = 3
                    ctx.beginPath()
                    ctx.moveTo(ichkiX, ichkiY)
                    ctx.lineTo(tashqiX, tashqiY)
                    ctx.stroke()

                    // Gidrofil bosh (suvni tortadi)
                    ctx.fillStyle = '#38BDF8'
                    ctx.beginPath()
                    ctx.arc(tashqiX, tashqiY, 7, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            ctx.fillStyle = sovunBor ? '#10B981' : '#F43F5E'
            ctx.font = 'bold 15px "Times New Roman", serif'
            ctx.fillText(
                sovunBor
                    ? "MITSELLA HOSIL BO'LDI: Sovun dumi yog'ni ushlab, boshi suvga tortib matodan uzib oldi!"
                    : "Faqat suvning o'zi yog'ni erita olmaydi (yog' gidrofob — suvdan qochadi)",
                280,
                32
            )

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [sovunBor])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">3. Sovun (C₁₇H₃₅COONa) qanday qilib yog'li kirni yuvadi?</h3>
                    <p className="text-sm text-slate-400 font-serif">Sovun molekulasining 2 qismi bor: suvni sevuvchi (gidrofil) bosh va yog'ni sevuvchi (gidrofob) dum</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('click'); setSovunBor(!sovunBor) }}
                    className={`px-4 py-2 rounded-xl font-bold font-serif text-sm border transition-all ${
                        sovunBor
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-sky-500 text-slate-950 border-sky-400'
                    }`}
                >
                    {sovunBor ? "Faqat suvda ko'rish" : "+ Suvga Sovun qo'shish (Mitsella)"}
                </button>
            </div>

            <div className="overflow-x-auto w-0 min-w-full">
              <canvas ref={canvasRef} width={560} height={280} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
            </div>
        </div>
    )
}

// ============================================================
// 4-KO'RGAZMA: UY DORIXONASI (H₂O₂, FAOLLASHTIRILGAN KO'MIR, YOD, KMnO₄)
// ============================================================
const DORIXONA_MODDALAR = [
    {
        id: 'h2o2',
        nom: "Vodorod peroksid (3% li H₂O₂)",
        reaksiya: "2H₂O₂ → 2H₂O + O₂↑ (Katalaza fermenti ishtirokida)",
        rang: '#38BDF8',
        izoh: "Yaraga tomizilganda qondagi katalaza fermenti H₂O₂ ni bir lahzada suv va atomar kislorodga (O₂↑) parchalaydi. Chiqayotgan oq ko'pik yarani mikrob va kirlardan mexanik hamda kimyoviy tozalaydi!"
    },
    {
        id: 'komir',
        nom: "Faollashtirilgan ko'mir (C — Adsorbent)",
        reaksiya: "Adsorbsiya: g'ovak sirtga zahar va gazlarni yutish",
        rang: '#475569',
        izoh: "1 gramm faollashtirilgan ko'mirning mikro-g'ovaklari yuzasi 1000 m² ga yetadi! Ovqatdan zaharlanganda oshqozondagi toksinlarni o'z sirtiga shimib (adsorbsiyalab) zararsizlantiradi."
    },
    {
        id: 'kmno4',
        nom: "Kaliy permanganat — Margansovka (KMnO₄)",
        reaksiya: "To'q binafsha kristall → Kuchli antiseptik oksidlovchi",
        rang: '#A855F7',
        izoh: "Suvda eriganda pushti-binafsha rang beruvchi kuchli oksidlovchi tuz. Tibbiyotda dezinfeksiya uchun, laboratoriyada esa qizdirib toza kislorod (O₂) olishda ishlatiladi."
    }
]

function UyDorixonasiCanvas() {
    const [dori, setDori] = useState(DORIXONA_MODDALAR[0])
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

            if (dori.id === 'h2o2') {
                // Yara yuzasida O2 ko'piklanishi
                ctx.fillStyle = '#991B1B'
                ctx.fillRect(120, 210, 320, 32)
                for (let i = 0; i < 22; i++) {
                    const px = 140 + ((i * 14) % 280)
                    const py = 205 - ((t * 35 + i * 11) % 130)
                    ctx.fillStyle = '#E0F2FE'
                    ctx.beginPath()
                    ctx.arc(px, py, 7 + (i % 4) * 2, 0, Math.PI * 2)
                    ctx.fill()
                }
            } else if (dori.id === 'komir') {
                // G'ovak ko'mir tabletkasi zahar zarrachalarini tortib olmoqda
                ctx.fillStyle = '#1E293B'
                ctx.strokeStyle = '#94A3B8'
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(280, 150, 65, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()

                // G'ovaklar va yutilayotgan toksinlar
                for (let i = 0; i < 10; i++) {
                    const burchak = (i / 10) * Math.PI * 2
                    const masofa = 50 + Math.sin(t * 2 + i) * 18
                    ctx.fillStyle = '#10B981'
                    ctx.beginPath()
                    ctx.arc(280 + Math.cos(burchak) * masofa, 150 + Math.sin(burchak) * masofa, 6, 0, Math.PI * 2)
                    ctx.fill()
                }
            } else {
                // KMnO4 binafsha diffuziya
                const grad = ctx.createRadialGradient(280, 155, 10, 280, 155, 95 + Math.sin(t) * 15)
                grad.addColorStop(0, 'rgba(168, 85, 247, 0.95)')
                grad.addColorStop(1, 'rgba(168, 85, 247, 0.05)')
                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.arc(280, 155, 105, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(dori.reaksiya, 280, 38)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [dori])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">4. Uy dorixonasi kimyosi: Vodorod peroksid (H₂O₂), Faol ko'mir (C) va KMnO₄</h3>
                <p className="text-sm text-slate-400 font-serif">Birinchi tibbiy yordam vositalarining molekulyar ta'sir mexanizmi</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={280} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2.5 font-serif">
                    {DORIXONA_MODDALAR.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => { tovushChiqar('click'); setDori(d) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                                dori.id === d.id
                                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{d.nom}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {dori.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 5-KO'RGAZMA: TABIIY GAZ (CH₄) YONISHI VA IS GAZI (CO) XAVFI
// ============================================================
function TabiiyGazAlangaCanvas() {
    const [kislorodFoiz, setKislorodFoiz] = useState(100) // 100% = to'liq yonish (moviy), <60% = chala yonish (CO)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let t = 0

        const chiz = () => {
            t += 0.08
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#070D19'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const toliq = kislorodFoiz >= 70

            // Gaz gorelkasi asosi
            ctx.fillStyle = '#334155'
            ctx.fillRect(210, 220, 140, 26)

            // Alanga tillari
            for (let i = -2; i <= 2; i++) {
                const ax = 280 + i * 22
                const balandlik = 75 + Math.sin(t + i) * 10
                ctx.fillStyle = toliq ? 'rgba(56, 189, 248, 0.85)' : 'rgba(245, 158, 11, 0.88)'
                ctx.beginPath()
                ctx.moveTo(ax - 12, 220)
                ctx.quadraticCurveTo(ax, 220 - balandlik, ax + 12, 220)
                ctx.fill()
            }

            // Reaksiya tenglamasi va xavf detektori
            ctx.textAlign = 'center'
            ctx.fillStyle = toliq ? '#38BDF8' : '#F43F5E'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.fillText(
                toliq
                    ? "TO'LIQ YONISH (Moviy alanga): CH₄ + 2O₂ → CO₂↑ + 2H₂O + Q"
                    : "XAVFLI CHALA YONISH (Sariq alanga): 2CH₄ + 3O₂ → 2CO↑ (IS GAZI!) + 4H₂O",
                280,
                38
            )

            ctx.fillStyle = toliq ? '#10B981' : '#EF4444'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(
                toliq
                    ? "Xavfsiz: Mo'ri ochiq, havo yetarli — zaharli is gazi (CO) chiqmayapti."
                    : "DIQQAT! Havo yetishmagani uchun rangsiz va hidsiz zaharli IS GAZI (CO) ajralmoqda!",
                280,
                274
            )

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [kislorodFoiz])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">5. Tabiiy gaz (Metan — CH₄) yonishi: Moviy alanga vs Is gazi (CO) xavfi</h3>
                    <p className="text-sm text-slate-400 font-serif">Nima uchun gaz plitasi alangasi moviy bo'lishi shart? Havo klapanini o'zgartirib ko'ring!</p>
                </div>
                <span className={`px-3 py-1 rounded-lg font-bold font-serif text-sm border ${
                    kislorodFoiz >= 70
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-rose-500/25 border-rose-400 text-rose-300'
                }`}>
                    Havo oqimi: {kislorodFoiz}%
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={290} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-4 font-serif">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <label className="block text-sm font-bold text-slate-200 mb-2">
                            Xonaga kirayotgan toza havo (O₂) miqdori:
                        </label>
                        <input
                            type="range"
                            min={20}
                            max={100}
                            value={kislorodFoiz}
                            onChange={(e) => setKislorodFoiz(Number(e.target.value))}
                            className="w-full accent-sky-400 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>20% (Mo'ri yopiq — CO!)</span>
                            <span>100% (To'liq yonish — CO₂)</span>
                        </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        Tabiiy gazning 95% i <strong className="text-sky-400">Metan (CH₄)</strong> bo'lib, u aslida hidsiz gaz. Gaz sizib chiqqanini sezish uchun unga maxsus o'tkir hidli modda (<strong className="text-amber-400">merkaptan</strong>) qo'shiladi.
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 6-KO'RGAZMA: SHISHA ISHLAB CHIQARISH (SiO₂ + Na₂CO₃ + CaCO₃)
// ============================================================
const SHISHA_TURLARI = [
    { id: 'oddiy', nom: "Oddiy deraza shishasi", qoshimcha: "SiO₂ (75%) + Na₂CO₃ (15%) + CaCO₃ (10%)", rang: 'rgba(186, 230, 253, 0.55)', izoh: "Kvars qumi (SiO₂), kir sodasi (Na₂CO₃) va ohaktosh (CaCO₃) 1500°C da eritilganda shaffof deraza shishasi hosil bo'ladi." },
    { id: 'kok', nom: "Ko'k vitraj shishasi (+ CoO)", qoshimcha: "+ Kobalt (II) oksid (CoO)", rang: 'rgba(37, 99, 235, 0.78)', izoh: "Shisha eritmasiga ozgina kobalt oksidi (CoO) qo'shilsa, chuqur moviy-ko'k rangli badiiy shisha olinadi." },
    { id: 'yashil', nom: "Zumrad-yashil shisha (+ Cr₂O₃)", qoshimcha: "+ Xrom (III) oksid (Cr₂O₃)", rang: 'rgba(16, 185, 129, 0.75)', izoh: "Xrom (III) oksidi (Cr₂O₃) shishaga chiroyli zumrad-yashil tus beradi." },
    { id: 'yoqut', nom: "Yoqut-qizil Kreml shishasi (+ Au)", qoshimcha: "+ Oltin nanozarrachalari (Au)", rang: 'rgba(225, 29, 72, 0.80)', izoh: "Shisha eritmasiga juda oz miqdorda oltin (Au) qo'shilsa, yoqutdek qip-qizil qimmatbaho shisha hosil bo'ladi!" },
]

function ShishaPolimerCanvas() {
    const [shisha, setShisha] = useState(SHISHA_TURLARI[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 3 ta xomashyo qutisi (chapda)
        const xomashyo = ['Kvars qumi (SiO₂)', 'Soda (Na₂CO₃)', 'Ohaktosh (CaCO₃)']
        xomashyo.forEach((nom, i) => {
            ctx.fillStyle = '#1E293B'
            ctx.strokeStyle = '#475569'
            ctx.lineWidth = 2
            ctx.fillRect(30, 45 + i * 65, 155, 48)
            ctx.strokeRect(30, 45 + i * 65, 155, 48)
            ctx.fillStyle = '#E2E8F0'
            ctx.font = 'bold 13px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(nom, 107, 74 + i * 65)
        })

        // 1500°C Pech (o'rtada)
        ctx.fillStyle = '#7C2D12'
        ctx.strokeStyle = '#F97316'
        ctx.lineWidth = 3
        ctx.fillRect(220, 85, 115, 110)
        ctx.strokeRect(220, 85, 115, 110)
        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText('PECH', 277, 132)
        ctx.fillText('1500 °C', 277, 155)

        // Tayyor shisha (o'ngda)
        ctx.fillStyle = shisha.rang
        ctx.strokeStyle = '#F8FAFC'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(375, 65, 150, 150, 14)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillText(shisha.nom, 450, 145)

        ctx.fillStyle = '#38BDF8'
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText(`Tarkib: ${shisha.qoshimcha}`, 280, 265)
    }, [shisha])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">6. Qumdan shishagacha: Shisha sintezi (SiO₂ + Na₂CO₃ + CaCO₃)</h3>
                <p className="text-sm text-slate-400 font-serif">Oddiy kvars qumidan qanday qilib tiniq va rangli shishalar olinadi?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={290} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2.5 font-serif">
                    {SHISHA_TURLARI.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => { tovushChiqar('click'); setShisha(s) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                                shisha.id === s.id
                                    ? 'bg-sky-500/20 border-sky-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{s.nom}</div>
                            <div className="text-xs text-sky-400">{s.qoshimcha}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {shisha.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 1-O'YIN: KUNDALIK MODDA VA KIMYOVIY FORMULA (10 TA SAVOL)
// ============================================================
const TRIVIAL_SAVOLLAR = [
    { nom: "Osh tuzi (ovqatga solinadigan tuz)", formula: "NaCl (Natriy xlorid)", variantlar: ["NaCl (Natriy xlorid)", "NaHCO₃", "CaCO₃", "NaOH"] },
    { nom: "Ichimlik sodasi (xamir ko'pchituvchi)", formula: "NaHCO₃ (Natriy gidrokarbonat)", variantlar: ["Na₂CO₃", "NaHCO₃ (Natriy gidrokarbonat)", "CaO", "KMnO₄"] },
    { nom: "Kir sodasi (shisha ishlab chiqarish va kir yuvishda)", formula: "Na₂CO₃ (Natriy karbonat)", variantlar: ["Ca(OH)₂", "CH₃COOH", "Na₂CO₃ (Natriy karbonat)", "NaCl"] },
    { nom: "Ohaktosh, bo'r va marmarning asosiy moddasi", formula: "CaCO₃ (Kalsiy karbonat)", variantlar: ["CaSO₄", "SiO₂", "CaO", "CaCO₃ (Kalsiy karbonat)"] },
    { nom: "So'ndirilmagan ohak (suv qo'shilsa qaynaydi)", formula: "CaO (Kalsiy oksid)", variantlar: ["CaO (Kalsiy oksid)", "Ca(OH)₂", "CaCO₃", "MgO"] },
    { nom: "So'ndirilgan ohak (devor oqlashda ishlatiladi)", formula: "Ca(OH)₂ (Kalsiy gidroksid)", variantlar: ["CaCO₃", "Ca(OH)₂ (Kalsiy gidroksid)", "NaOH", "CaO"] },
    { nom: "Sirka kislotasi (marinad va oshxonada)", formula: "CH₃COOH", variantlar: ["HCl", "C₁₂H₂₂O₁₁", "CH₃COOH", "H₂SO₄"] },
    { nom: "Tabiiy gazning asosiy (95%) tarkibiy qismi", formula: "CH₄ (Metan)", variantlar: ["CO", "H₂", "CO₂", "CH₄ (Metan)"] },
    { nom: "Kvars qumi (shisha ishlab chiqarish asosi)", formula: "SiO₂ (Kremniy (IV) oksid)", variantlar: ["SiO₂ (Kremniy (IV) oksid)", "Al₂O₃", "CaCO₃", "Na₂CO₃"] },
    { nom: "Margansovka (antiseptik va kislorod manbai)", formula: "KMnO₄ (Kaliy permanganat)", variantlar: ["AgNO₃", "KMnO₄ (Kaliy permanganat)", "H₂O₂", "NaClO"] },
]

function TrivialFormulaOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = TRIVIAL_SAVOLLAR[idx]

    const tekshir = (v) => {
        if (tanlov) return
        setTanlov(v)
        if (v === joriy.formula) {
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
                    <h3 className="text-xl font-bold text-white">1-o'yin: Xalqona Nomdan Kimyoviy Formulani Toping</h3>
                    <p className="text-sm text-slate-400">Ro'zg'ordagi moddalarning aniq kimyoviy formulasini belgilang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    Ball: {ball} | {idx + 1}/{TRIVIAL_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-4">
                <div className="text-xs text-slate-400 uppercase mb-1">Kundalik hayotdagi nomi:</div>
                <div className="text-2xl font-bold text-amber-400">{joriy.nom}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {variantlarniAralashtir(joriy.variantlar, joriy.savol || joriy.vazifa || joriy.nom || joriy.qotishma || joriy.reaksiya || '', idx).map(({ item: v }) => (
                    <button
                        key={v}
                        onClick={() => tekshir(v)}
                        className={`p-4 rounded-xl border text-left font-bold transition-all ${
                            !tanlov
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-sky-400'
                                : v === joriy.formula
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
                            setIdx((i) => (i + 1) % TRIVIAL_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
                    >
                        Keyingi modda →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 2-O'YIN: HAYOTIY VAZIYAT VA MODDA TANLASH
// ============================================================
const VAZIYAT_SAVOLLAR = [
    { vazifa: "Choynak tubida hosil bo'lgan ohak qasmoqni (CaCO₃) uy sharoitida eritib tozalash uchun nima ishlatiladi?", javob: "Sirka yoki limon kislotasi eritmasi", variantlar: ["Sirka yoki limon kislotasi eritmasi", "Shakar eritmasi", "Kvars qumi (SiO₂)", "Osh tuzi (NaCl)"] },
    { vazifa: "Yarani mikroblardan ko'piklantirib (O₂↑ chiqarib) tozalash uchun qaysi eritma quyiladi?", javob: "3% li Vodorod peroksid (H₂O₂)", variantlar: ["Sirka kislotasi", "3% li Vodorod peroksid (H₂O₂)", "Osh tuzi eritmasi", "Ohakli suv Ca(OH)₂"] },
    { vazifa: "Ovqatdan zaharlanganda oshqozondagi zaharli toksinlarni shimib (adsorbsiyalab) oluvchi vosita:", javob: "Faollashtirilgan ko'mir (C)", variantlar: ["Gips (CaSO₄·2H₂O)", "Bo'r (CaCO₃)", "Faollashtirilgan ko'mir (C)", "Shakar (C₁₂H₂₂O₁₁)"] },
    { vazifa: "Suyak singanda gips bog'lami qo'yish uchun ishlatiladigan, suv bilan qorilganda tez qotadigan oq kukun:", javob: "Kalsiy sulfat yarimgidrati — Alebastr (Gips)", variantlar: ["Osh tuzi (NaCl)", "Ichimlik sodasi (NaHCO₃)", "Kvars qumi (SiO₂)", "Kalsiy sulfat yarimgidrati — Alebastr (Gips)"] },
    { vazifa: "Asalari chaqqanda (kislotali zahar) teridagi achishishni neytrallash uchun nima surtiladi?", javob: "Ichimlik sodasi (NaHCO₃) bo'tqasi", variantlar: ["Ichimlik sodasi (NaHCO₃) bo'tqasi", "Limon sharbati", "O'simlik yog'i", "Sirka kislotasi"] },
    { vazifa: "Deraza shishasi ishlab chiqarish uchun pechda 1500°C da eritiladigan 3 ta asosiy xomashyo:", javob: "Kvars qumi (SiO₂) + Soda (Na₂CO₃) + Ohaktosh (CaCO₃)", variantlar: ["Gips + Bo'r + Suv", "Kvars qumi (SiO₂) + Soda (Na₂CO₃) + Ohaktosh (CaCO₃)", "Osh tuzi + Shakar + Sirka", "Temir + Ko'mir + Ohak"] },
]

function HayotiyVaziyatOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = VAZIYAT_SAVOLLAR[idx]

    const tekshir = (v) => {
        if (tanlov) return
        setTanlov(v)
        if (v === joriy.javob) {
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
                    <h3 className="text-xl font-bold text-white">2-o'yin: Kundalik Muammoni Kimyo Bilan Hal Qiling</h3>
                    <p className="text-sm text-slate-400">Har bir hayotiy vaziyat uchun eng to'g'ri kimyoviy yechimni tanlang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    Ball: {ball} | {idx + 1}/{VAZIYAT_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.vazifa}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {variantlarniAralashtir(joriy.variantlar, joriy.savol || joriy.vazifa || joriy.nom || joriy.qotishma || joriy.reaksiya || '', idx).map(({ item: v }) => (
                    <button
                        key={v}
                        onClick={() => tekshir(v)}
                        className={`p-4 rounded-xl border text-left font-bold transition-all ${
                            !tanlov
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-400'
                                : v === joriy.javob
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
                            setIdx((i) => (i + 1) % VAZIYAT_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                    >
                        Keyingi vaziyat →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 3-O'YIN: XAVFSIZ XONADON EKSPERTI
// ============================================================
const XAVFSIZLIK_SAVOLLAR = [
    { holat: "Xonada gaz hidi (merkaptan) sezilganda BIRINCHI navbatda nima qilish taqiqlanadi?", togri: "Elektr chiroqni yoqish va gugurt chaqish qat'iyan man etiladi (oynani ochib, gaz jo'mragini yopish kerak)!", xato: "Chiroqni yoqib gaz qayerdan chiqayotganini gugurt bilan tekshirish kerak" },
    { holat: "Gaz plitasi yoki isitish pechining alangasi moviy emas, to'q sariq va tutunli yonayotgan bo'lsa:", togri: "Chala yonish ketmoqda va o'ta zaharli is gazi (CO) ajralmoqda — darhol mo'rini va havo yo'lini tekshirish shart!", xato: "Sariq alanga ko'proq issiqlik beradi, xavotirga o'rin yo'q" },
    { holat: "Xlorli oqartirgich (NaClO) bilan kislotali tozalash vositasini aralashtirib yuborilsa nima sodir bo'ladi?", togri: "O'tkir bo'g'uvchi zaharli Xlor gazi (Cl₂↑) ajralib chiqadi — ularni aslo aralashtirmaslik kerak!", xato: "Ikkalasi qo'shilsa ikki barobar yaxshi tozalaydi" },
    { holat: "So'ndirilmagan ohak (CaO) ustiga suv quyilganda qanday ehtiyot chorasi ko'riladi?", togri: "Aralashma kuchli qaynashi va sachrashi sababli himoya ko'zoynagi va qo'lqop kiyish shart!", xato: "Ustiga engashib qo'l bilan aralashtirish mumkin" },
]

function XavfsizXonadonOyini() {
    const [idx, setIdx] = useState(0)
    const [raund, setRaund] = useState(0)
    const [ball, setBall] = useState(0)
    const [javob, setJavob] = useState(null)

    const joriy = XAVFSIZLIK_SAVOLLAR[idx]
    const tanlovlar = variantlarniAralashtir(
        [
            { matn: joriy.togri, togri: true },
            { matn: joriy.xato, togri: false },
        ],
        joriy.holat,
        raund
    ).map((x) => x.item)

    const tanla = (togrimi) => {
        if (javob !== null) return
        setJavob(togrimi)
        if (togrimi) {
            tovushChiqar('success')
            setBall((b) => b + 20)
        } else {
            tovushChiqar('error')
        }
    }

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 font-serif">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">3-o'yin: Xavfsiz Xonadon Kimyosi Eksperti</h3>
                    <p className="text-sm text-slate-400">Turmushda kimyoviy moddalar bilan ishlashning to'g'ri qoidasini tanlang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold">
                    Ball: {ball} | {idx + 1}/{XAVFSIZLIK_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.holat}</p>
            </div>

            <div className="space-y-3 mb-4">
                {tanlovlar.map((t) => (
                    <button
                        key={t.matn}
                        onClick={() => tanla(t.togri)}
                        className={`w-full p-4 rounded-xl border text-left font-bold transition-all ${
                            javob === null
                                ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-sky-400'
                                : t.togri
                                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                : 'bg-rose-500/25 border-rose-400 text-rose-200'
                        }`}
                    >
                        {t.matn}
                    </button>
                ))}
            </div>

            {javob !== null && (
                <div className="flex justify-end">
                    <button
                        onClick={() => {
                            tovushChiqar('click')
                            setJavob(null)
                            if (idx + 1 >= XAVFSIZLIK_SAVOLLAR.length) setRaund((r) => r + 1)
                            setIdx((i) => (i + 1) % XAVFSIZLIK_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
                    >
                        Keyingi qoida →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH)
// ============================================================
const DUEL_4_3 = [
    { savol: "Ichimlik sodasining kimyoviy formulasi qaysi?", variantlar: ["NaHCO₃", "Na₂CO₃", "NaOH", "NaCl"], javob: 0 },
    { savol: "Tabiiy gaz chala yonganda qaysi o'ta zaharli gaz hosil bo'ladi?", variantlar: ["CO₂ (Karbonat angidrid)", "CO (Is gazi)", "O₂ (Kislorod)", "N₂ (Azot)"], javob: 1 },
    { savol: "Vodorod peroksid (H₂O₂) yaraga tekkanda qaysi gaz pufakchalari ajralib chiqadi?", variantlar: ["Xlor (Cl₂)", "Vodorod (H₂)", "Kislorod (O₂)", "Azot (N₂)"], javob: 2 },
    { savol: "So'ndirilmagan ohak (CaO) suv bilan reaksiyaga kirishsa nima hosil bo'ladi?", variantlar: ["CaCl₂", "CaSO₄", "CaCO₃", "Ca(OH)₂ — So'ndirilgan ohak"], javob: 3 },
    { savol: "Deraza shishasining 75% ini tashkil etuvchi asosiy tabiiy oksid qaysi?", variantlar: ["Kvars qumi (SiO₂)", "Ohaktosh (CaCO₃)", "Temir oksidi (Fe₂O₃)", "Osh tuzi (NaCl)"], javob: 0 },
    { savol: "Sovun molekulasining yog' tomchisini o'rab olgan sharsimon tuzilmasi nima deyiladi?", variantlar: ["Kristall", "Mitsella", "Izotop", "Allotrop"], javob: 1 },
]

function JamoalarDueli4_3() {
    const [idx, setIdx] = useState(0)
    const [ball1, setBall1] = useState(0)
    const [ball2, setBall2] = useState(0)
    const [navbat, setNavbat] = useState(1)
    const [natija, setNatija] = useState(null)

    const xomJoriy = DUEL_4_3[idx]
    const aralash = indekslanganVariantlarniAralashtir(xomJoriy, idx)
    const joriy = { ...xomJoriy, variantlar: aralash.variantlar, javob: aralash.togri }

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
                    <button
                        onClick={() => {
                            tovushChiqar('click')
                            setNatija(null)
                            setNavbat((n) => (n === 1 ? 2 : 1))
                            setIdx((i) => (i + 1) % DUEL_4_3.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
                    >
                        Keyingi guruhga navbat →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// ASOSIY KOMPONENT: MAVZU 4.3
// ============================================================
export default function Mavzu4_3() {
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
        { nom: "1. Oshxona kimyosi (Soda + Sirka)", ikon: 'kolba' },
        { nom: "2. Qurilish: Ohak aylanishi", ikon: 'kristall' },
        { nom: "3. Sovun va Mitsella", ikon: 'tomchi' },
        { nom: "4. Uy dorixonasi (H₂O₂, C)", ikon: 'yulduz' },
        { nom: "5. Tabiiy gaz va Is gazi (CO)", ikon: 'olov' },
        { nom: "6. Qumdan Shishagacha (SiO₂)", ikon: 'kristall' },
    ]

    const oyinlar = [
        { nom: "1. Xalqona Nom va Formula", ikon: 'kitob' },
        { nom: "2. Hayotiy Vaziyatlar", ikon: 'yulduz' },
        { nom: "3. Xavfsiz Xonadon Eksperti", ikon: 'qalqon' },
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
                mavzuRaqam="4.3"
                mavzuNom="Kundalik hayotda foydalaniladigan moddalar va ularning xossalari"
                bobNom="4-bob. Moddalar va ularning xossalari"
                sahifa={62}
                oldingiRaqam="4.2"
                asosiyBolim={asosiyBolim}
                setAsosiyBolim={setAsosiyBolim}
                toliqEkran={toliqEkran}
                toliqEkranniUlash={toliqEkranniUlash}
            />

            {asosiyBolim === 'takrorlash' && (
                <OtganDarsniTakrorlash
                    oldingiRaqam="4.2"
                    oldingiNom="Metall va metallmaslarning fizik xossalari"
                    savollar={TAKROPI_4_2}
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

                    {faolKorgazma === 0 && <OshxonaKimyosiCanvas />}
                    {faolKorgazma === 1 && <QurilishOhakCanvas />}
                    {faolKorgazma === 2 && <SovunMitsellaCanvas />}
                    {faolKorgazma === 3 && <UyDorixonasiCanvas />}
                    {faolKorgazma === 4 && <TabiiyGazAlangaCanvas />}
                    {faolKorgazma === 5 && <ShishaPolimerCanvas />}
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

                    {faolOyin === 0 && <TrivialFormulaOyini />}
                    {faolOyin === 1 && <HayotiyVaziyatOyini />}
                    {faolOyin === 2 && <XavfsizXonadonOyini />}
                    {faolOyin === 3 && <JamoalarDueli4_3 />}
                </div>
            )}
        </div>
    )
}
