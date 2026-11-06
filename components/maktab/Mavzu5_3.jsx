'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 5-BOB, 5.3-MAVZU
// "Indikatorlar" (Darslik 83-bet)
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

const TAKROPI_5_2 = [
    {
        savol: "Suvda yaxshi eriydigan asoslar (NaOH, KOH, Ba(OH)₂, Ca(OH)₂) qanday umumiy nom bilan ataladi?",
        variantlar: ["Ishqorlar", "Kislotalar", "Oksidlar", "Indikatorlar"],
        togriJavob: "Ishqorlar",
        izoh: "Suvda eriydigan asoslar ishqorlar deyiladi va eritmada OH⁻ ionlarini hosil qiladi."
    },
    {
        savol: "Mis (II) gidroksid — Cu(OH)₂ qanday rangli cho'kma hisoblanadi va qizdirilganda nimaga parchalanadi?",
        variantlar: [
            "Havorang (moviy) cho'kma; qizdirilganda qora CuO va H₂O ga parchalanadi",
            "Qo'ng'ir cho'kma; qizdirilganda Cu va O₂ ga parchalanadi",
            "Oq cho'kma; suvda eriydi",
            "Sariq cho'kma; parchalanmaydi"
        ],
        togriJavob: "Havorang (moviy) cho'kma; qizdirilganda qora CuO va H₂O ga parchalanadi",
        izoh: "Cu(OH)₂ moviy iviq cho'kma bo'lib, qizdirilsa Cu(OH)₂ → CuO (qora) + H₂O ga parchalanadi."
    },
    {
        savol: "Tiniq ohakli suv — Ca(OH)₂ orqali karbonat angidrid (CO₂) o'tkazilsa nima sodir bo'ladi?",
        variantlar: [
            "Oq rangli CaCO₃↓ cho'kmasi tushib, eritma loyqalanadi",
            "Eritma malina rangga kiradi",
            "Vodorod gazi ajralib chiqadi",
            "Hech qanday o'zgarish bo'lmaydi"
        ],
        togriJavob: "Oq rangli CaCO₃↓ cho'kmasi tushib, eritma loyqalanadi",
        izoh: "Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O reaksiyasi CO₂ gazini aniqlashning sifat reaksiyasidir."
    }
]

// ============================================================
// 1-KO'RGAZMA: 3 TA ASOSIY INDIKATOR (LAKMUS, METILORANJ, FENOLFTALEIN)
// ============================================================
const INDIKATORLAR = [
    {
        id: 'lakmus',
        nom: 'Lakmus eritmasi',
        aslRang: 'Binafsha',
        ranglar: {
            kislota: { nom: 'QIZIL', hex: '#EF4444' },
            neytral: { nom: 'BINAFSHA', hex: '#8B5CF6' },
            ishqor: { nom: "KO'K", hex: '#2563EB' }
        },
        izoh: 'Lishaynik o\'simligidan olinadigan tabiiy indikator. Kislotada QIZIL, toza suvda BINAFSHA, ishqorda esa KO\'K rangga kiradi!'
    },
    {
        id: 'metiloranj',
        nom: 'Metiloranj (Metil zarg\'aldog\'i)',
        aslRang: 'To\'q sariq (Zarg\'aldoq)',
        ranglar: {
            kislota: { nom: 'QIZIL-PUSHTI', hex: '#F43F5E' },
            neytral: { nom: "TO'Q SARIQ", hex: '#F97316' },
            ishqor: { nom: 'SARIQ', hex: '#FACC15' }
        },
        izoh: 'Sun\'iy sintetik indikator. Kislotali muhitda QIZIL-PUSHTI, neytral suvda TO\'Q SARIQ, ishqoriy muhitda esa och SARIQ rang beradi.'
    },
    {
        id: 'fenolftalein',
        nom: 'Fenolftalein',
        aslRang: 'Rangsiz (Shaffof)',
        ranglar: {
            kislota: { nom: 'RANGSIZ', hex: 'rgba(226, 232, 240, 0.22)' },
            neytral: { nom: 'RANGSIZ', hex: 'rgba(226, 232, 240, 0.22)' },
            ishqor: { nom: 'MALINA RANG', hex: '#EC4899' }
        },
        izoh: 'Faqat ISHQORLARNI aniqlovchi eng mashhur indikator! Kislota va suvda RANGSIZ qoladi, faqat ishqorda yorqin MALINA (to\'q pushti) rangga kiradi!'
    }
]

function UchIndikatorSimulatorCanvas() {
    const [ind, setInd] = useState(INDIKATORLAR[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let t = 0

        const muhitlar = [
            { kalit: 'kislota', sarlavha: '1. Kislota (HCl)', ost: 'H⁺ ionlari ko\'p', x: 115 },
            { kalit: 'neytral', sarlavha: '2. Neytral (H₂O)', ost: 'Toza suv', x: 280 },
            { kalit: 'ishqor', sarlavha: '3. Ishqor (NaOH)', ost: 'OH⁻ ionlari ko\'p', x: 445 },
        ]

        const chiz = () => {
            t += 0.05
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#070D19'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            muhitlar.forEach((m, i) => {
                const r = ind.ranglar[m.kalit]

                // Tomizgichdan tomayotgan tomchi
                const tomchiY = 52 + ((t * 35 + i * 20) % 52)
                ctx.fillStyle = r.hex
                ctx.beginPath()
                ctx.arc(m.x, tomchiY, 5, 0, Math.PI * 2)
                ctx.fill()

                // Kolba / Stakan ichidagi suyuqlik
                ctx.fillStyle = r.hex
                ctx.beginPath()
                ctx.roundRect(m.x - 46, 118, 92, 105, [0, 0, 26, 26])
                ctx.fill()

                // Stakan devori
                ctx.strokeStyle = '#94A3B8'
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.roundRect(m.x - 48, 82, 96, 143, [0, 0, 28, 28])
                ctx.stroke()

                // Rang yozuvi
                ctx.fillStyle = '#FFFFFF'
                ctx.font = 'bold 14px "Times New Roman", serif'
                ctx.textAlign = 'center'
                ctx.fillText(r.nom, m.x, 175)

                ctx.fillStyle = '#E2E8F0'
                ctx.font = 'bold 14px "Times New Roman", serif'
                ctx.fillText(m.sarlavha, m.x, 248)
                ctx.fillStyle = '#94A3B8'
                ctx.font = '12px "Times New Roman", serif'
                ctx.fillText(m.ost, m.x, 266)
            })

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(`Tanlangan indikator: ${ind.nom} (Asl rangi: ${ind.aslRang})`, 280, 30)

            animId = requestAnimationFrame(chiz)
        }
        chiz()
        return () => cancelAnimationFrame(animId)
    }, [ind])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">1. Laboratoriyaning 3 ta asosiy indikatori: Lakmus, Metiloranj, Fenolftalein</h3>
                <p className="text-sm text-slate-400 font-serif">Indikator ("ko'rsatkich") — kislota va ishqor ta'sirida o'z rangini o'zgartiruvchi moddadir</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={285} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2.5 font-serif">
                    {INDIKATORLAR.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { tovushChiqar('click'); setInd(item) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                                ind.id === item.id
                                    ? 'bg-pink-500/20 border-pink-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{item.nom}</div>
                            <div className="text-xs text-pink-300 mt-0.5">
                                Kislota: {item.ranglar.kislota.nom} | Suv: {item.ranglar.neytral.nom} | Ishqor: {item.ranglar.ishqor.nom}
                            </div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {ind.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 2-KO'RGAZMA: TABIIY INDIKATOR — QIZIL KARAM SHARBATI KAMALAGI
// ============================================================
const KARAM_MUHITLAR = [
    { id: 0, nom: 'Kuchli kislota (HCl)', rang: '#EF4444', rangNomi: 'Qip-qizil', izoh: 'Kuchli kislotali muhitda qizil karam tarkibidagi antotsian pigmenti yorqin qizil rangga kiradi.' },
    { id: 1, nom: 'Limon va Sirka (CH₃COOH)', rang: '#EC4899', rangNomi: 'Pushti-malina', izoh: 'Kuchsiz organik kislotalarda qizil karam sharbati och pushti-malina rang beradi.' },
    { id: 2, nom: 'Toza suv (Neytral H₂O)', rang: '#8B5CF6', rangNomi: 'Binafsha (Asl rangi)', izoh: 'Neytral muhitda qizil karam qaynatmasi o\'zining tabiiy to\'q binafsha rangini saqlaydi.' },
    { id: 3, nom: 'Ichimlik sodasi (NaHCO₃)', rang: '#0284C7', rangNomi: 'Moviy-ko\'k', izoh: 'Kuchsiz ishqoriy muhitda (ichimlik sodasi eritmasida) sharbat moviy-ko\'k rangga o\'tadi.' },
    { id: 4, nom: 'Kuchli ishqor (NaOH)', rang: '#22C55E', rangNomi: 'Yashil-sariq!', izoh: 'O\'yuvchi ishqor (NaOH yoki KOH) qo\'shilganda binafsha karam sharbati zumrad-yashil va sariq rangga aylanadi!' },
]

function QizilKaramIndikatorCanvas() {
    const [tanlov, setTanlov] = useState(KARAM_MUHITLAR[2])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 5 ta probirka kamalagi
        KARAM_MUHITLAR.forEach((m, idx) => {
            const px = 76 + idx * 102
            const faol = m.id === tanlov.id

            ctx.fillStyle = m.rang
            ctx.beginPath()
            ctx.roundRect(px - 26, 100, 52, 118, [0, 0, 24, 24])
            ctx.fill()

            ctx.strokeStyle = faol ? '#FACC15' : '#64748B'
            ctx.lineWidth = faol ? 4 : 2
            ctx.beginPath()
            ctx.roundRect(px - 28, 65, 56, 155, [0, 0, 26, 26])
            ctx.stroke()

            ctx.fillStyle = faol ? '#FACC15' : '#CBD5E1'
            ctx.font = 'bold 12px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(m.rangNomi, px, 242)
        })

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(`Tabiiy indikator: Qizil karam sharbati — ${tanlov.nom} da: ${tanlov.rangNomi}`, 280, 36)

        ctx.fillStyle = '#94A3B8'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText("Uy sharoitida qizil karam, lavlagi, qora choy va atirgul barglaridan indikator tayyorlash mumkin!", 280, 274)
    }, [tanlov])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">2. Tabiiy indikator mo'jizasi: Qizil karam sharbatining 5 xil rangi</h3>
                <p className="text-sm text-slate-400 font-serif">Qizil karam qaynatmasiga turli uy moddalarini qo'shib, ranglar kamalagini hosil qiling</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={290} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    {KARAM_MUHITLAR.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => { tovushChiqar('click'); setTanlov(m) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                tanlov.id === m.id
                                    ? 'bg-purple-500/20 border-purple-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <span className="font-bold text-sm">{m.nom}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: m.rang, color: '#fff' }}>
                                {m.rangNomi}
                            </span>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {tanlov.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 3-KO'RGAZMA: ROBERT BOYL KASHFIYOTI VA LAKMUS QOG'OZI (1663-YIL)
// ============================================================
function RobertBoylKashfiyotiCanvas() {
    const [botirildi, setBotirildi] = useState('ishqor') // 'kislota' | 'ishqor'
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const kislota = botirildi === 'kislota'

        // Stakan
        ctx.fillStyle = 'rgba(148, 163, 184, 0.18)'
        ctx.fillRect(195, 135, 170, 105)
        ctx.strokeStyle = '#94A3B8'
        ctx.lineWidth = 3.5
        ctx.strokeRect(195, 95, 170, 145)

        // Lakmus qog'oz tasmasi (yuqori yarmi binafsha, botirilgan pastki yarmi qizil yoki ko'k)
        ctx.fillStyle = '#8B5CF6'
        ctx.fillRect(262, 50, 36, 85)

        ctx.fillStyle = kislota ? '#EF4444' : '#2563EB'
        ctx.fillRect(262, 135, 36, 75)

        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.strokeRect(262, 50, 36, 160)

        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(
            kislota
                ? "Kislotaga botirilgan lakmus qog'ozi darhol QIZIL rangga kirdi!"
                : "Ishqorga botirilgan lakmus qog'ozi darhol KO'K rangga kirdi!",
            280,
            32
        )

        ctx.fillStyle = '#CBD5E1'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText("1663-yilda ingliz olimi Robert Boyl binafsha gul va lishaynikdan ilk indikator qog'ozini yaratgan.", 280, 270)
    }, [botirildi])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">3. Robert Boyl kashfiyoti va Lakmus qog'ozi</h3>
                    <p className="text-sm text-slate-400 font-serif">Qog'oz tasmasiga shimdirilgan lakmus eritmasi tezkor tahlil uchun eng qulay vositadir</p>
                </div>
                <div className="flex gap-2 font-serif">
                    <button
                        onClick={() => { tovushChiqar('click'); setBotirildi('kislota') }}
                        className={`px-4 py-1.5 rounded-xl font-bold text-sm border ${
                            botirildi === 'kislota'
                                ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        Kislotaga botirish (Qizil)
                    </button>
                    <button
                        onClick={() => { tovushChiqar('click'); setBotirildi('ishqor') }}
                        className={`px-4 py-1.5 rounded-xl font-bold text-sm border ${
                            botirildi === 'ishqor'
                                ? 'bg-blue-500/25 border-blue-400 text-blue-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        Ishqorga botirish (Ko'k)
                    </button>
                </div>
            </div>

            <canvas ref={canvasRef} width={560} height={285} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
        </div>
    )
}

// ============================================================
// 4-KO'RGAZMA: UNIVERSAL INDIKATOR QOG'OZI (BIR NECHA INDIKATOR ARALASHMASI)
// ============================================================
const UNIVERSAL_NAMUNALAR = [
    { nom: 'Akkumulyator kislotasi (H₂SO₄)', rang: '#DC2626', muhit: 'Kuchli kislotali (To\'q qizil)' },
    { nom: 'Limon sharbati', rang: '#F97316', muhit: 'O\'rtacha kislotali (To\'q sariq)' },
    { nom: 'Toza distillangan suv (H₂O)', rang: '#84CC16', muhit: 'Neytral muhit (Sarg\'ish-yashil)' },
    { nom: 'Ichimlik sodasi eritmasi', rang: '#0284C7', muhit: 'Kuchsiz ishqoriy (Ko\'k)' },
    { nom: 'O\'yuvchi natriy (NaOH)', rang: '#4C1D95', muhit: 'Kuchli ishqoriy (To\'q binafsha)' },
]

function UniversalQogozCanvas() {
    const [namuna, setNamuna] = useState(UNIVERSAL_NAMUNALAR[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Etalon shkala (yuqorida)
        const etalonRanglar = ['#DC2626', '#F97316', '#FACC15', '#84CC16', '#10B981', '#0284C7', '#4C1D95']
        etalonRanglar.forEach((r, i) => {
            ctx.fillStyle = r
            ctx.fillRect(85 + i * 56, 55, 52, 34)
        })

        // Sinov qog'ozi
        ctx.fillStyle = '#FDE047'
        ctx.fillRect(160, 145, 120, 44)
        ctx.fillStyle = namuna.rang
        ctx.fillRect(280, 145, 120, 44)
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2.5
        ctx.strokeRect(160, 145, 240, 44)

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(`Universal indikator: ${namuna.nom}`, 280, 34)

        ctx.fillStyle = '#38BDF8'
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText(`Natija: ${namuna.muhit}`, 280, 238)

        ctx.fillStyle = '#94A3B8'
        ctx.font = '13px "Times New Roman", serif'
        ctx.fillText("Universal indikator — bir nechta indikatorlar aralashmasi bo'lib, muhit kuchini ham ko'rsatadi!", 280, 270)
    }, [namuna])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">4. Universal indikator qog'ozi va Etalon ranglar shkalasi</h3>
                <p className="text-sm text-slate-400 font-serif">Oddiy indikator faqat kislota yoki ishqorligini aytsa, universal indikator uning kuchini ham ko'rsatadi</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={285} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    {UNIVERSAL_NAMUNALAR.map((n) => (
                        <button
                            key={n.nom}
                            onClick={() => { tovushChiqar('click'); setNamuna(n) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                                namuna.nom === n.nom
                                    ? 'bg-sky-500/20 border-sky-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{n.nom}</div>
                            <div className="text-xs text-sky-300">{n.muhit}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 5-KO'RGAZMA: 3 TA NOMA'LUM PROBIRKANI BITTA INDIKATOR BILAN ANIQLASH
// ============================================================
function UchProbirkaDetektivCanvas() {
    const [indikator, setIndikator] = useState('lakmus') // 'lakmus' | 'fenolftalein'
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const lakmus = indikator === 'lakmus'
        const probirkalar = [
            { nom: 'A probirka (HCl)', rang: lakmus ? '#EF4444' : 'rgba(226,232,240,0.2)', yozuv: lakmus ? 'QIZIL → Kislota!' : 'Rangsiz (?)' },
            { nom: 'B probirka (H₂O)', rang: lakmus ? '#8B5CF6' : 'rgba(226,232,240,0.2)', yozuv: lakmus ? 'BINAFSHA → Suv!' : 'Rangsiz (?)' },
            { nom: 'C probirka (NaOH)', rang: lakmus ? '#2563EB' : '#EC4899', yozuv: lakmus ? "KO'K → Ishqor!" : 'MALINA → Ishqor!' },
        ]

        probirkalar.forEach((p, i) => {
            const px = 115 + i * 165
            ctx.fillStyle = p.rang
            ctx.beginPath()
            ctx.roundRect(px - 42, 105, 84, 108, [0, 0, 26, 26])
            ctx.fill()

            ctx.strokeStyle = '#94A3B8'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.roundRect(px - 44, 70, 88, 145, [0, 0, 28, 28])
            ctx.stroke()

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 13px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(p.yozuv, px, 165)
            ctx.fillText(p.nom, px, 238)
        })

        ctx.fillStyle = lakmus ? '#10B981' : '#F59E0B'
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText(
            lakmus
                ? "Lakmus (yoki Metiloranj) 3 xil muhitda 3 XIL RANG bergani uchun barcha 3 ta probirkani bir urinishda aniqlaydi!"
                : "Fenolftalein kislota va suvda bir xil RANGSIZ qolgani uchun faqat ishqorni (NaOH) ajratib bera oladi!",
            280,
            272
        )
    }, [indikator])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">5. Olimpiada masalasi: 3 ta yozuvsiz probirkani (HCl, H₂O, NaOH) qanday aniqlaymiz?</h3>
                    <p className="text-sm text-slate-400 font-serif">Nega bitta lakmus yetarli, ammo fenolftaleinning bir o'zi yetarli emas?</p>
                </div>
                <div className="flex gap-2 font-serif">
                    <button
                        onClick={() => { tovushChiqar('success'); setIndikator('lakmus') }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${
                            indikator === 'lakmus'
                                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        Lakmus tomizish (3 xil rang!)
                    </button>
                    <button
                        onClick={() => { tovushChiqar('click'); setIndikator('fenolftalein') }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${
                            indikator === 'fenolftalein'
                                ? 'bg-pink-500/25 border-pink-400 text-pink-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        Fenolftalein tomizish (2 tasi rangsiz)
                    </button>
                </div>
            </div>

            <canvas ref={canvasRef} width={560} height={285} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
        </div>
    )
}

// ============================================================
// 6-KO'RGAZMA: OSHXONADAGI INDIKATOR — QORA CHOY + LIMON YOKI SODA
// ============================================================
function ChoyLimonIndikatorCanvas() {
    const [qoShimcha, setQoShimcha] = useState('oddiy') // 'oddiy' | 'limon' | 'soda'
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const rang = qoShimcha === 'limon' ? '#FACC15' : qoShimcha === 'soda' ? '#451A03' : '#9A3412'

        // Piyola / Stakan
        ctx.fillStyle = rang
        ctx.beginPath()
        ctx.roundRect(190, 110, 180, 115, [0, 0, 55, 55])
        ctx.fill()

        ctx.strokeStyle = '#E2E8F0'
        ctx.lineWidth = 3.5
        ctx.beginPath()
        ctx.roundRect(188, 80, 184, 147, [0, 0, 56, 56])
        ctx.stroke()

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(
            qoShimcha === 'limon'
                ? "Choyga LIMON (kislota H⁺) solindi → Choy och SARIQ rangga ochildi!"
                : qoShimcha === 'soda'
                ? "Choyga ICHIMLIK SODASI (ishqoriy OH⁻) solindi → Choy TO'Q QO'NG'IR bo'ldi!"
                : "Damlama qora choy — tabiiy indikator!",
            280,
            38
        )

        ctx.fillStyle = '#CBD5E1'
        ctx.font = '14px "Times New Roman", serif'
        ctx.fillText("Choy tarkibidagi tearubigin pigmentlari kislota (limon) ta'sirida och sariq rangga o'tadi.", 280, 268)
    }, [qoShimcha])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">6. Nima uchun choyga limon solinsa rangi oqaradi?</h3>
                    <p className="text-sm text-slate-400 font-serif">Har kuni ichadigan choyimiz ham kislota va ishqorni farqlovchi tabiiy indikatordir!</p>
                </div>
                <div className="flex gap-2 font-serif">
                    <button
                        onClick={() => { tovushChiqar('click'); setQoShimcha('limon') }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${
                            qoShimcha === 'limon' ? 'bg-amber-500/25 border-amber-400 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        + Limon (Kislota)
                    </button>
                    <button
                        onClick={() => { tovushChiqar('click'); setQoShimcha('oddiy') }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${
                            qoShimcha === 'oddiy' ? 'bg-orange-500/25 border-orange-400 text-orange-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        Oddiy choy
                    </button>
                    <button
                        onClick={() => { tovushChiqar('click'); setQoShimcha('soda') }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${
                            qoShimcha === 'soda' ? 'bg-sky-500/25 border-sky-400 text-sky-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        + Ichimlik sodasi (Ishqoriy)
                    </button>
                </div>
            </div>

            <canvas ref={canvasRef} width={560} height={285} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
        </div>
    )
}

// ============================================================
// 1-O'YIN: INDIKATOR RANGINI TOP (9 TA KOMBINATSIYA)
// ============================================================
const RANG_SAVOLLAR = [
    { savol: "Ishqor (NaOH) eritmasiga FENOLFTALEIN tomizilsa qanday rang hosil bo'ladi?", javob: "Malina rang (to'q pushti)", variantlar: ["Rangsiz qoladi", "Malina rang (to'q pushti)", "Sariq", "Ko'k"] },
    { savol: "Kislota (HCl) eritmasiga LAKMUS tomizilsa qanday rangga kiradi?", javob: "Qizil", variantlar: ["Qizil", "Ko'k", "Binafsha", "Rangsiz"] },
    { savol: "Ishqor (KOH) eritmasiga LAKMUS tomizilsa qanday rangga kiradi?", javob: "Ko'k", variantlar: ["Qizil", "Ko'k", "Sariq", "Rangsiz"] },
    { savol: "Kislota (H₂SO₄) eritmasiga FENOLFTALEIN tomizilsa rangi qanday bo'ladi?", javob: "Rangsizligicha qoladi!", variantlar: ["Malina rang bo'ladi", "Rangsizligicha qoladi!", "Ko'k bo'ladi", "Sariq bo'ladi"] },
    { savol: "Ishqor (NaOH) eritmasiga METILORANJ tomizilsa qanday rangga o'tadi?", javob: "Sariq", variantlar: ["Qizil-pushti", "Sariq", "Ko'k", "Binafsha"] },
    { savol: "Kislota (HNO₃) eritmasiga METILORANJ tomizilsa qanday rang beradi?", javob: "Qizil-pushti", variantlar: ["Qizil-pushti", "Sariq", "Ko'k", "Rangsiz"] },
    { savol: "Neytral toza suvda (H₂O) LAKMUS qanday rangda bo'ladi?", javob: "Binafsha", variantlar: ["Qizil", "Binafsha", "Ko'k", "Malina"] },
]

function IndikatorRangOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = RANG_SAVOLLAR[idx]

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

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 font-serif">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">1-o'yin: Indikator Rangini Toping</h3>
                    <p className="text-sm text-slate-400">Lakmus, Metiloranj va Fenolftaleinning uch xil muhitdagi rangini sinang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    Ball: {ball} | {idx + 1}/{RANG_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.savol}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {joriy.variantlar.map((v) => (
                    <button
                        key={v}
                        onClick={() => tekshir(v)}
                        className={`p-4 rounded-xl border text-left font-bold transition-all ${
                            !tanlov
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-pink-400'
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
                            setIdx((i) => (i + 1) % RANG_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-pink-500 text-white font-bold"
                    >
                        Keyingi savol →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 2-O'YIN: LABORATORIYA DETEKTIVI — NOMA'LUM ERITMA
// ============================================================
const DETEKTIV_SAVOLLAR = [
    { vazifa: "Noma'lum rangsiz eritmaga fenolftalein tomizilganda eritma yorqin MALINA rangga kirdi. Probirkada qaysi modda bor?", javob: "NaOH (Ishqor eritmasi)", variantlar: ["HCl (Xlorid kislota)", "H₂O (Distillangan suv)", "NaOH (Ishqor eritmasi)", "NaCl (Osh tuzi eritmasi)"] },
    { vazifa: "Noma'lum eritmaga binafsha lakmus tomizilganda u QIZIL rangga kirdi. Probirkada qaysi modda bor?", javob: "H₂SO₄ (Sulfat kislota)", variantlar: ["KOH (Ishqor)", "H₂SO₄ (Sulfat kislota)", "H₂O (Toza suv)", "NaCl (Osh tuzi)"] },
    { vazifa: "3 ta probirkada HCl, H₂O va NaOH bor. Faqat BITTA indikator yordamida uchalasini ham aniqlash uchun qaysi indikatorni tanlaysiz?", javob: "Lakmus yoki Metiloranj (3 xil muhitda 3 xil rang beradi)", variantlar: ["Faqat Fenolftalein", "Lakmus yoki Metiloranj (3 xil muhitda 3 xil rang beradi)", "Osh tuzi eritmasi", "Kraxmal eritmasi"] },
    { vazifa: "Nima uchun suvda ERIMAYDIGAN asoslar — masalan Cu(OH)₂ yoki Fe(OH)₃ cho'kmasi fenolftaleinni malina rangga bo'yamaydi?", javob: "Chunki ular suvda erimaydi va eritmaga erkin OH⁻ ionlarini bermaydi!", variantlar: ["Chunki ular kislotadir", "Chunki ular suvda erimaydi va eritmaga erkin OH⁻ ionlarini bermaydi!", "Chunki ular gazdir", "Chunki ularda OH guruhi yo'q"] },
    { vazifa: "Metiloranj tomizilganda eritma SARIQ rangga kirsa, muhit qanday?", javob: "Ishqoriy muhit (OH⁻)", variantlar: ["Kislotali muhit (H⁺)", "Neytral muhit", "Ishqoriy muhit (OH⁻)", "Gazli muhit"] },
]

function DetektivOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = DETEKTIV_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">2-o'yin: Laboratoriya Detektivi — Noma'lum Probirka</h3>
                    <p className="text-sm text-slate-400">Indikator ko'rsatgan rangga qarab probirkadagi moddani aniqlang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    Ball: {ball} | {idx + 1}/{DETEKTIV_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.vazifa}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {joriy.variantlar.map((v) => (
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
                            setIdx((i) => (i + 1) % DETEKTIV_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                    >
                        Keyingi topshiriq →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 3-O'YIN: TABIIY INDIKATORLAR VA TARIX
// ============================================================
const TABIIY_IND_SAVOLLAR = [
    { savol: "1663-yilda o'simliklardan ilk kislota-ishqor indikatorini (lakmusni) kashf etgan olim kim?", javob: "Robert Boyl", variantlar: ["Dmitriy Mendeleyev", "Robert Boyl", "Antuan Lavuazye", "Jon Dalton"] },
    { savol: "Tabiiy lakmus indikatori qaysi tirik organizmdan olinadi?", javob: "Lishayniklardan", variantlar: ["Lishayniklardan", "Dengiz baliqlaridan", "Toshko'mirdan", "Qarag'ay daraxtidan"] },
    { savol: "To'q damlangan choyga limon bo'lagi tashlanganda choy rangi nima uchun och sariq bo'lib qoladi?", javob: "Limon kislotasi choydagi tabiiy indikator pigmentlariga ta'sir qilgani uchun", variantlar: ["Limon choyni sovutgani uchun", "Limon kislotasi choydagi tabiiy indikator pigmentlariga ta'sir qilgani uchun", "Shakar erigani uchun", "Kislorod chiqqani uchun"] },
    { savol: "Qizil karamning binafsha qaynatmasiga kuchli ishqor (NaOH) qo'shilsa qanday rangga kiradi?", javob: "Yashil-sariq rangga", variantlar: ["Yashil-sariq rangga", "Qip-qizil rangga", "Qora rangga", "Oq cho'kmaga"] },
]

function TabiiyIndikatorOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = TABIIY_IND_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">3-o'yin: Tabiiy Indikatorlar va Kashfiyot Tarixi</h3>
                    <p className="text-sm text-slate-400">O'simlik indikatorlari va Robert Boyl tajribalari</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
                    Ball: {ball} | {idx + 1}/{TABIIY_IND_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.savol}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {joriy.variantlar.map((v) => (
                    <button
                        key={v}
                        onClick={() => tekshir(v)}
                        className={`p-4 rounded-xl border text-left font-bold transition-all ${
                            !tanlov
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-purple-400'
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
                            setIdx((i) => (i + 1) % TABIIY_IND_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-bold"
                    >
                        Keyingi savol →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH)
// ============================================================
const DUEL_5_3 = [
    { savol: "'Indikator' so'zining lotinchadan ma'nosi nima?", variantlar: ["Erituvchi", "Ko'rsatkich", "Oksidlovchi", "Katalizator"], javob: 1 },
    { savol: "Fenolftalein ishqoriy muhitda qanday rangga kiradi?", variantlar: ["Ko'k", "Malina rang", "Sariq", "Rangsiz"], javob: 1 },
    { savol: "Lakmus kislotali muhitda qanday rangga kiradi?", variantlar: ["Qizil", "Ko'k", "Sariq", "Yashil"], javob: 0 },
    { savol: "Metiloranj ishqoriy muhitda qanday rangga kiradi?", variantlar: ["Sariq", "Ko'k", "Binafsha", "Rangsiz"], javob: 0 },
    { savol: "Fenolftalein kislotali muhitda qanday rangda bo'ladi?", variantlar: ["Qizil", "Rangsiz", "Ko'k", "Sariq"], javob: 1 },
    { savol: "Bir nechta indikatorlar aralashmasidan tayyorlangan indikator qog'ozi nima deyiladi?", variantlar: ["Universal indikator", "Filtr qog'ozi", "Pergament", "Folga"], javob: 0 },
]

function JamoalarDueli5_3() {
    const [idx, setIdx] = useState(0)
    const [ball1, setBall1] = useState(0)
    const [ball2, setBall2] = useState(0)
    const [navbat, setNavbat] = useState(1)
    const [natija, setNatija] = useState(null)

    const joriy = DUEL_5_3[idx]

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
                            setIdx((i) => (i + 1) % DUEL_5_3.length)
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
// ASOSIY KOMPONENT: MAVZU 5.3
// ============================================================
export default function Mavzu5_3() {
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
        { nom: "1. 3 ta Asosiy Indikator", ikon: 'kolba' },
        { nom: "2. Qizil karam kamalagi", ikon: 'tomchi' },
        { nom: "3. Lakmus qog'ozi (Boyl)", ikon: 'kitob' },
        { nom: "4. Universal indikator", ikon: 'yulduz' },
        { nom: "5. 3 ta probirka detektivi", ikon: 'mikroskop' },
        { nom: "6. Choy + Limon tajribasi", ikon: 'kristall' },
    ]

    const oyinlar = [
        { nom: "1. Indikator Rangini Top", ikon: 'tomchi' },
        { nom: "2. Laboratoriya Detektivi", ikon: 'mikroskop' },
        { nom: "3. Tabiiy Indikatorlar", ikon: 'yulduz' },
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
                mavzuRaqam="5.3"
                mavzuNom="Indikatorlar"
                bobNom="5-bob. Kislotalar va asoslar"
                sahifa={83}
                oldingiRaqam="5.2"
                asosiyBolim={asosiyBolim}
                setAsosiyBolim={setAsosiyBolim}
                toliqEkran={toliqEkran}
                toliqEkranniUlash={toliqEkranniUlash}
            />

            {asosiyBolim === 'takrorlash' && (
                <OtganDarsniTakrorlash
                    oldingiRaqam="5.2"
                    oldingiNom="Asoslar"
                    savollar={TAKROPI_5_2}
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

                    {faolKorgazma === 0 && <UchIndikatorSimulatorCanvas />}
                    {faolKorgazma === 1 && <QizilKaramIndikatorCanvas />}
                    {faolKorgazma === 2 && <RobertBoylKashfiyotiCanvas />}
                    {faolKorgazma === 3 && <UniversalQogozCanvas />}
                    {faolKorgazma === 4 && <UchProbirkaDetektivCanvas />}
                    {faolKorgazma === 5 && <ChoyLimonIndikatorCanvas />}
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

                    {faolOyin === 0 && <IndikatorRangOyini />}
                    {faolOyin === 1 && <DetektivOyini />}
                    {faolOyin === 2 && <TabiiyIndikatorOyini />}
                    {faolOyin === 3 && <JamoalarDueli5_3 />}
                </div>
            )}
        </div>
    )
}
