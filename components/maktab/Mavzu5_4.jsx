'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 5-BOB, 5.4-MAVZU
// "pH ko'rsatkichi" (Darslik 85-bet)
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

const TAKROPI_5_3 = [
    {
        savol: "Fenolftalein indikatori ishqoriy muhitda (masalan, NaOH eritmasida) qanday rangga kiradi?",
        variantlar: ["Malina rang (to'q pushti)", "Rangsiz", "Ko'k", "Sariq"],
        togriJavob: "Malina rang (to'q pushti)",
        izoh: "Fenolftalein kislota va neytral suvda rangsiz bo'lib, faqat ishqoriy muhitda yorqin malina rangga kiradi."
    },
    {
        savol: "Binafsha lakmus eritmasi kislotali va ishqoriy muhitlarda qanday ranglarga o'tadi?",
        variantlar: [
            "Har ikkalasida binafsha qoladi",
            "Kislotada — Qizil, Ishqorda — Ko'k",
            "Kislotada — Ko'k, Ishqorda — Qizil",
            "Kislotada — Sariq, Ishqorda — Rangsiz",
        ],
        togriJavob: "Kislotada — Qizil, Ishqorda — Ko'k",
        izoh: "Lakmus kislotada qizil, neytral suvda binafsha, ishqoriy muhitda esa ko'k rang beradi."
    },
    {
        savol: "Metiloranj indikatori kislotali va ishqoriy eritmalarda qanday rangda bo'ladi?",
        variantlar: [
            "Kislotada — Ko'k, Ishqorda — Yashil",
            "Har doim qora",
            "Kislotada — Qizil-pushti, Ishqorda — Sariq",
            "Kislotada — Rangsiz, Ishqorda — Malina",
        ],
        togriJavob: "Kislotada — Qizil-pushti, Ishqorda — Sariq",
        izoh: "Metiloranj kislotali muhitda qizil-pushti, neytral muhitda to'q sariq, ishqoriy muhitda esa sariq rangga kiradi."
    }
]

// ============================================================
// 1-KO'RGAZMA: pH SHKALASI (0 DAN 14 GACHA) VA KUNDALIK MODDALAR
// ============================================================
const PH_MODDALAR = [
    { ph: 0, nom: 'Akkumulyator kislotasi (H₂SO₄)', muhit: 'Kuchli kislotali', rang: '#B91C1C', izoh: 'pH = 0..1 — o\'ta kuchli kislotali muhit. Vodorod ionlari (H⁺) konsentratsiyasi eng yuqori!' },
    { ph: 1, nom: 'Inson oshqozon shirasi (0.5% HCl)', muhit: 'Kuchli kislotali', rang: '#DC2626', izoh: 'pH ≈ 1.5 — oshqozonimizdagi xlorid kislota ovqatni parchalaydi va bakteriyalarni zararsizlantiradi.' },
    { ph: 2, nom: 'Limon sharbati', muhit: 'Kislotali', rang: '#EF4444', izoh: 'pH ≈ 2.2 — limon kislotasi tufayli kuchli nordon ta\'mga ega.' },
    { ph: 3, nom: 'Oshxona sirkasi va Olma sharbati', muhit: 'Kislotali', rang: '#F97316', izoh: 'pH ≈ 3.0 — olma va sirka kislotali muhitga ega.' },
    { ph: 4, nom: 'Pomidor sharbati', muhit: 'Kuchsizroq kislotali', rang: '#F59E0B', izoh: 'pH ≈ 4.2 — pomidor va nordon mevalar sohasi.' },
    { ph: 5, nom: 'Qora qahva va Toza yomg\'ir suvi', muhit: 'Kuchsiz kislotali', rang: '#EAB308', izoh: 'pH ≈ 5.5 — havodagi CO₂ erigani sababli hatto toza tabiiy yomg\'ir suvi ham biroz kislotali (pH 5.6) bo\'ladi.' },
    { ph: 6, nom: 'Yangi sog\'ilgan sigir suti', muhit: 'Juda kuchsiz kislotali', rang: '#84CC16', izoh: 'pH ≈ 6.5 — neytralga juda yaqin kuchsiz kislotali muhit.' },
    { ph: 7, nom: 'Toza distillangan suv (H₂O)', muhit: 'NEYTRAL MUHIT (pH = 7)', rang: '#22C55E', izoh: 'pH = 7.0 — oltin muvozanat nuqtasi! H⁺ va OH⁻ ionlari soni bir-biriga mutlaqo teng!' },
    { ph: 8, nom: 'Dengiz suvi va Tish pastasi', muhit: 'Kuchsiz ishqoriy', rang: '#14B8A6', izoh: 'pH ≈ 8.0–8.5 — og\'izdagi kislotani neytrallab tish emalini asrash uchun tish pastasi kuchsiz ishqoriy qilinadi!' },
    { ph: 9, nom: 'Ichimlik sodasi eritmasi (NaHCO₃)', muhit: 'Kuchsiz ishqoriy', rang: '#06B6D4', izoh: 'pH ≈ 8.5–9.0 — oshqozon jig\'ildon qaynashini va ari chaqishini neytrallashda ishlatiladi.' },
    { ph: 10, nom: 'Qo\'l yuvish sovuni eritmasi', muhit: 'Ishqoriy', rang: '#0284C7', izoh: 'pH ≈ 10.0 — yog\' va kirlarni yuvuvchi ishqoriy muhit.' },
    { ph: 11, nom: 'Nashatir spirti — Ammiak eritmasi (NH₃·H₂O)', muhit: 'Ishqoriy', rang: '#2563EB', izoh: 'pH ≈ 11.5 — o\'tkir hidli ishqoriy eritma, oynalarni tozalashda va tibbiyotda ishlatiladi.' },
    { ph: 12, nom: 'Ohakli suv — Ca(OH)₂ va Oqartirgich', muhit: 'Kuchli ishqoriy', rang: '#4F46E5', izoh: 'pH ≈ 12.4 — qurilish ohagi va maishiy oqartirgichlar kuchli ishqoriy muhitga ega.' },
    { ph: 13, nom: 'Quvurlarni tozalovchi ishqor ("Krot")', muhit: 'Kuchli ishqoriy', rang: '#6D28D9', izoh: 'pH ≈ 13.5 — yog\' va soch tiqinlarini eritib yuboruvchi o\'yuvchi ishqor.' },
    { ph: 14, nom: 'Konsentrlangan O\'yuvchi natriy (NaOH)', muhit: 'Maksimal kuchli ishqoriy', rang: '#4C1D95', izoh: 'pH = 14.0 — shkalaning eng yuqori chegarasi! OH⁻ gidroksid ionlari konsentratsiyasi maksimal.' },
]

function PhShkalaCanvas() {
    const [phQiymat, setPhQiymat] = useState(7)
    const canvasRef = useRef(null)
    const joriy = PH_MODDALAR[phQiymat]

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 0 dan 14 gacha 15 ta ustun
        PH_MODDALAR.forEach((m, i) => {
            const x = 26 + i * 34
            const tanlangan = i === phQiymat
            const y = tanlangan ? 65 : 85
            const h = tanlangan ? 115 : 85

            ctx.fillStyle = m.rang
            ctx.beginPath()
            ctx.roundRect(x, y, 30, h, 6)
            ctx.fill()

            if (tanlangan) {
                ctx.strokeStyle = '#FFFFFF'
                ctx.lineWidth = 3
                ctx.stroke()
            }

            ctx.fillStyle = '#FFFFFF'
            ctx.font = `${tanlangan ? 'bold 15px' : 'bold 12px'} "Times New Roman", serif`
            ctx.textAlign = 'center'
            ctx.fillText(String(i), x + 15, y + h / 2 + 5)
        })

        // Chegara chiziqlari
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillStyle = '#F87171'
        ctx.fillText('← KISLOTALI MUHIT (pH < 7)', 135, 208)
        ctx.fillStyle = '#4ADE80'
        ctx.fillText('NEYTRAL (7)', 280, 208)
        ctx.fillStyle = '#60A5FA'
        ctx.fillText('ISHQORIY MUHIT (pH > 7) →', 430, 208)

        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 18px "Times New Roman", serif'
        ctx.fillText(`pH = ${joriy.ph}   |   ${joriy.nom}`, 280, 38)

        ctx.fillStyle = '#E2E8F0'
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText(`Muhit turi: ${joriy.muhit}`, 280, 255)
    }, [phQiymat, joriy])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">1. pH shkalasi (0 dan 14 gacha) — Kundalik moddalar xaritasi</h3>
                    <p className="text-sm text-slate-400 font-serif">1909-yilda daniyalik kimyogar S.P. Syorensen kiritgan vodorod ko'rsatkichi (pH) shkalasi</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl font-bold font-serif text-sm text-white" style={{ backgroundColor: joriy.rang }}>
                    pH = {joriy.ph} ({joriy.muhit})
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={280} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-4 font-serif">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <label className="block text-sm font-bold text-slate-200 mb-2">
                            pH qiymatini surib tanlang (0 → 7 → 14):
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={14}
                            step={1}
                            value={phQiymat}
                            onChange={(e) => { tovushChiqar('click'); setPhQiymat(Number(e.target.value)) }}
                            className="w-full accent-emerald-400 cursor-pointer"
                        />
                        <div className="grid grid-cols-5 gap-1.5 mt-3">
                            {[1, 2, 7, 9, 14].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => { tovushChiqar('click'); setPhQiymat(p) }}
                                    className={`py-1.5 rounded-lg text-xs font-bold border ${
                                        phQiymat === p
                                            ? 'bg-sky-500/25 border-sky-400 text-white'
                                            : 'bg-slate-900 border-slate-800 text-slate-400'
                                    }`}
                                >
                                    pH {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800">
                        <div className="text-amber-400 font-bold text-base mb-1">{joriy.nom}</div>
                        <p className="text-slate-200 text-sm leading-relaxed">{joriy.izoh}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 2-KO'RGAZMA: [H⁺] VA [OH⁻] IONLARI TAROZISI VA 10 KARRA QOIDASI
// ============================================================
function IonMuvozanatTarozisiCanvas() {
    const [ph, setPh] = useState(7)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const hSoni = Math.max(1, 15 - ph)
        const ohSoni = Math.max(1, ph + 1)

        // Chap idish: H+ kationlari
        ctx.fillStyle = 'rgba(244, 63, 94, 0.16)'
        ctx.strokeStyle = '#F43F5E'
        ctx.lineWidth = 3
        ctx.fillRect(55, 65, 190, 150)
        ctx.strokeRect(55, 65, 190, 150)

        for (let i = 0; i < hSoni; i++) {
            const hx = 80 + (i % 5) * 34
            const hy = 100 + Math.floor(i / 5) * 40
            ctx.fillStyle = '#E11D48'
            ctx.beginPath()
            ctx.arc(hx, hy, 13, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 11px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText('H⁺', hx, hy + 4)
        }

        // O'rtada taqqoslash belgisi
        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 34px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(ph < 7 ? '>' : ph === 7 ? '=' : '<', 280, 150)

        // O'ng idish: OH- anionlari
        ctx.fillStyle = 'rgba(59, 130, 246, 0.16)'
        ctx.strokeStyle = '#3B82F6'
        ctx.lineWidth = 3
        ctx.fillRect(315, 65, 190, 150)
        ctx.strokeRect(315, 65, 190, 150)

        for (let i = 0; i < ohSoni; i++) {
            const ox = 340 + (i % 5) * 34
            const oy = 100 + Math.floor(i / 5) * 40
            ctx.fillStyle = '#2563EB'
            ctx.beginPath()
            ctx.arc(ox, oy, 13, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 10px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText('OH⁻', ox, oy + 4)
        }

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 17px "Times New Roman", serif'
        ctx.fillText(
            ph < 7
                ? `pH = ${ph} (KISLOTALI): [H⁺] > [OH⁻] — Vodorod ionlari ko'p!`
                : ph === 7
                ? `pH = 7 (NEYTRAL): [H⁺] = [OH⁻] — Ionlar soni teng!`
                : `pH = ${ph} (ISHQORIY): [H⁺] < [OH⁻] — Gidroksid ionlari ko'p!`,
            280,
            36
        )

        ctx.fillStyle = '#38BDF8'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillText("Muhim qonuniyat: pH 1 birlikka kamaysa, kislotalilik 10 MARTA ortadi (pH=2 eritma pH=4 dan 100 marta nordon)!", 280, 258)
    }, [ph])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">2. Molekulyar tarozi: [H⁺] va [OH⁻] ionlari nisbati</h3>
                    <p className="text-sm text-slate-400 font-serif">Har qanday suvli eritmada ham H⁺, ham OH⁻ ionlari bo'ladi — muhitni ularning qaysi biri ko'pligi belgilaydi</p>
                </div>
                <div className="flex gap-2 font-serif">
                    <button
                        onClick={() => { tovushChiqar('click'); setPh(2) }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${ph < 7 ? 'bg-rose-500/25 border-rose-400 text-rose-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                        Kislotali (pH = 2)
                    </button>
                    <button
                        onClick={() => { tovushChiqar('click'); setPh(7) }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${ph === 7 ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                        Neytral (pH = 7)
                    </button>
                    <button
                        onClick={() => { tovushChiqar('click'); setPh(12) }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${ph > 7 ? 'bg-blue-500/25 border-blue-400 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                        Ishqoriy (pH = 12)
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto w-0 min-w-full">
              <canvas ref={canvasRef} width={560} height={280} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
            </div>
        </div>
    )
}

// ============================================================
// 3-KO'RGAZMA: RAQAMLI ELEKTRON pH-METR ASBOBI
// ============================================================
const PH_METR_ERITMALAR = [
    { nom: 'Oshqozon shirasi (0.5% HCl)', ph: '1.52', rang: 'rgba(239, 68, 68, 0.25)', xulosa: 'Kuchli kislotali (pH < 7)' },
    { nom: 'Yangi siqilgan limon sharbati', ph: '2.24', rang: 'rgba(250, 204, 21, 0.28)', xulosa: 'Kislotali muhit (pH < 7)' },
    { nom: 'Gazlangan mineral suv (H₂CO₃)', ph: '4.85', rang: 'rgba(56, 189, 248, 0.22)', xulosa: 'Kuchsiz kislotali (pH < 7)' },
    { nom: 'Distillangan toza suv (H₂O)', ph: '7.00', rang: 'rgba(34, 197, 94, 0.20)', xulosa: 'Aniq Neytral muhit (pH = 7.00)' },
    { nom: 'Ichimlik sodasi eritmasi (NaHCO₃)', ph: '8.45', rang: 'rgba(14, 165, 233, 0.25)', xulosa: 'Kuchsiz ishqoriy (pH > 7)' },
    { nom: 'O\'yuvchi natriy eritmasi (NaOH)', ph: '13.60', rang: 'rgba(139, 92, 246, 0.28)', xulosa: 'Kuchli ishqoriy (pH > 7)' },
]

function RaqamliPhMetrCanvas() {
    const [eritma, setEritma] = useState(PH_METR_ERITMALAR[3])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Stakan
        ctx.fillStyle = eritma.rang
        ctx.fillRect(110, 125, 160, 115)
        ctx.strokeStyle = '#94A3B8'
        ctx.lineWidth = 3.5
        ctx.strokeRect(110, 85, 160, 155)

        // Shisha elektrod zondi (stakan ichida)
        ctx.fillStyle = '#334155'
        ctx.fillRect(180, 45, 20, 160)
        ctx.fillStyle = '#38BDF8'
        ctx.beginPath()
        ctx.arc(190, 210, 12, 0, Math.PI * 2)
        ctx.fill()

        // Kabel
        ctx.strokeStyle = '#64748B'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(190, 45)
        ctx.lineTo(395, 45)
        ctx.lineTo(395, 75)
        ctx.stroke()

        // Raqamli pH-metr korpusi (o'ngda)
        ctx.fillStyle = '#1E293B'
        ctx.strokeStyle = '#38BDF8'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(315, 75, 185, 155, 16)
        ctx.fill()
        ctx.stroke()

        // LCD ekran
        ctx.fillStyle = '#064E3B'
        ctx.fillRect(335, 98, 145, 64)
        ctx.fillStyle = '#34D399'
        ctx.font = 'bold 32px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(`pH ${eritma.ph}`, 407, 142)

        ctx.fillStyle = '#E2E8F0'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText('RAQAMLI pH-METR', 407, 192)
        ctx.fillStyle = '#38BDF8'
        ctx.fillText(eritma.xulosa, 407, 212)

        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText(`Tekshirilayotgan namuna: ${eritma.nom}`, 280, 270)
    }, [eritma])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">3. Zamonaviy elektron pH-metr bilan 0.01 aniqlikda o'lchash</h3>
                <p className="text-sm text-slate-400 font-serif">Shisha elektrodli pH-metr eritmadagi H⁺ ionlari konsentratsiyasini darhol raqamli ekranda ko'rsatadi</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={290} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    {PH_METR_ERITMALAR.map((e) => (
                        <button
                            key={e.nom}
                            onClick={() => { tovushChiqar('click'); setEritma(e) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                eritma.nom === e.nom
                                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <span className="font-bold text-sm">{e.nom}</span>
                            <span className="text-xs font-bold text-emerald-400">pH {e.ph}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 4-KO'RGAZMA: INSON ORGANIZMI pH XARITASI (QON, OSHQOZON, TISH EMALI)
// ============================================================
const ORGAN_PH = [
    { id: 'qon', nom: 'Inson qoni (pH = 7.35 – 7.45)', ph: '7.40', muhit: 'Kuchsiz ishqoriy (Qat\'iy doimiy!)', rang: '#EF4444', izoh: 'Inson qonining pH ko\'rsatkichi doimo 7.35–7.45 oralig\'ida saqlanadi. Uning hatto 0.3 ga o\'zgarishi ham hayot uchun xavfli!' },
    { id: 'oshqozon', nom: 'Oshqozon shirasi (pH = 1.5 – 2.0)', ph: '1.70', muhit: 'Kuchli kislotali (HCl)', rang: '#F59E0B', izoh: 'Oqsillarni parchalovchi pepsin fermenti faqat kuchli kislotali muhitda (pH 1.5–2.0) ishlaydi.' },
    { id: 'tish', nom: 'Og\'iz bo\'shlig\'i va So\'lak (pH = 6.8 – 7.2)', ph: '7.00', muhit: 'Neytral (Shirinlikdan keyin pH < 5.5 ga tushadi!)', rang: '#38BDF8', izoh: 'Shirinlik yegandan keyin bakteriyalar shakarni sut kislotasiga aylantiradi. pH 5.5 dan pastga tushsa tish emali yemirila boshlaydi — tish pastasi (pH 8.5) uni neytrallaydi!' },
    { id: 'teri', nom: 'Inson terisi yuzasi (pH = 5.5)', ph: '5.50', muhit: 'Kuchsiz kislotali himoya mantiyasi', rang: '#10B981', izoh: 'Sog\'lom teri yuzasi pH = 5.5 kuchsiz kislotali bo\'lib, zararli bakteriyalar ko\'payishiga yo\'l qo\'ymaydi.' },
]

function InsonOrganizmiPhCanvas() {
    const [organ, setOrgan] = useState(ORGAN_PH[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Markaziy diagnostika doirasi
        ctx.fillStyle = organ.rang
        ctx.beginPath()
        ctx.arc(280, 138, 66, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 28px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(`pH ${organ.ph}`, 280, 147)

        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 17px "Times New Roman", serif'
        ctx.fillText(organ.nom, 280, 38)

        ctx.fillStyle = '#38BDF8'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillText(organ.muhit, 280, 248)
    }, [organ])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">4. Tibbiyot va Salomatlik: Inson organizmining pH xaritasi</h3>
                <p className="text-sm text-slate-400 font-serif">Nima uchun tish pastasi ishqoriy bo'ladi va qonning pH ko'rsatkichi qancha?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={280} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    {ORGAN_PH.map((o) => (
                        <button
                            key={o.id}
                            onClick={() => { tovushChiqar('click'); setOrgan(o) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                                organ.id === o.id
                                    ? 'bg-sky-500/20 border-sky-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{o.nom}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {organ.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 5-KO'RGAZMA: QISHLOQ XO'JALIGI — TUPROQ pH VA OHAKLASH
// ============================================================
function TuproqPhAgronomCanvas() {
    const [ohaklandi, setOhaklandi] = useState(false)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Tuproq qatlami
        ctx.fillStyle = ohaklandi ? '#3F2E21' : '#7C2D12'
        ctx.fillRect(60, 175, 440, 68)

        // O'simlik
        const boyi = ohaklandi ? 95 : 35
        ctx.strokeStyle = ohaklandi ? '#22C55E' : '#EAB308'
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.moveTo(280, 175)
        ctx.lineTo(280, 175 - boyi)
        ctx.stroke()

        // Barglar
        ctx.fillStyle = ohaklandi ? '#22C55E' : '#CA8A04'
        ctx.beginPath()
        ctx.arc(280, 175 - boyi, ohaklandi ? 26 : 12, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = ohaklandi ? '#10B981' : '#F43F5E'
        ctx.font = 'bold 17px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(
            ohaklandi
                ? "Tuproqqa Ohak (CaCO₃ / Ca(OH)₂) solindi → pH = 6.8 (Neytral va yuqori hosil!)"
                : "Kislotali (nordon) tuproq: pH = 4.5 — Bug'doy va g'o'za yaxshi o'smayapti!",
            280,
            38
        )

        ctx.fillStyle = '#CBD5E1'
        ctx.font = '14px "Times New Roman", serif'
        ctx.fillText("Agronomiya qoidasi: Kislotali (pH < 5.5) tuproqlarni neytrallash uchun ohaklash (CaCO₃ yoki Ca(OH)₂) qo'llaniladi.", 280, 268)
    }, [ohaklandi])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">5. Agronomiya: Tuproqning pH ko'rsatkichi va Tuproqni ohaklash</h3>
                    <p className="text-sm text-slate-400 font-serif">Madaniy ekinlarning ko'pchiligi neytral tuproqda (pH 6.5–7.0) mo'l hosil beradi</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('success'); setOhaklandi(!ohaklandi) }}
                    className={`px-4 py-2 rounded-xl font-bold font-serif text-sm border transition-all ${
                        ohaklandi
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-amber-500 text-slate-950 border-amber-400'
                    }`}
                >
                    {ohaklandi ? "Kislotali tuproqni ko'rish (pH 4.5)" : "+ Tuproqqa Ohak (Ca(OH)₂) qo'shish"}
                </button>
            </div>

            <div className="overflow-x-auto w-0 min-w-full">
              <canvas ref={canvasRef} width={560} height={285} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
            </div>
        </div>
    )
}

// ============================================================
// 6-KO'RGAZMA: EKOLOGIYA — ODDIY YOMG'IR (pH 5.6) VS KISLOTALI YOMG'IR (pH < 4.2)
// ============================================================
function KislotaliYomgirPhCanvas() {
    const [zavodTutuni, setZavodTutuni] = useState(false)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let t = 0

        const chiz = () => {
            t += 0.06
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#070D19'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Bulut
            ctx.fillStyle = zavodTutuni ? '#475569' : '#94A3B8'
            ctx.beginPath()
            ctx.roundRect(160, 48, 240, 46, 22)
            ctx.fill()

            ctx.fillStyle = '#0F172A'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(zavodTutuni ? 'SO₂ + NO₂ + H₂O → H₂SO₄ (pH = 4.0)' : 'Toza yomg\'ir: CO₂ + H₂O (pH = 5.6)', 280, 76)

            // Yomg'ir tomchilari
            for (let i = 0; i < 16; i++) {
                const rx = 175 + i * 14
                const ry = 100 + ((t * 45 + i * 17) % 105)
                ctx.fillStyle = zavodTutuni ? '#F43F5E' : '#38BDF8'
                ctx.fillRect(rx, ry, 2.5, 10)
            }

            // Ko'l suvi
            ctx.fillStyle = zavodTutuni ? 'rgba(244, 63, 94, 0.25)' : 'rgba(14, 165, 233, 0.28)'
            ctx.fillRect(100, 205, 360, 40)

            ctx.fillStyle = zavodTutuni ? '#F43F5E' : '#10B981'
            ctx.font = 'bold 15px "Times New Roman", serif'
            ctx.fillText(
                zavodTutuni
                    ? "KISLOTALI YOMG'IR (pH = 4.0): Baliqlar, o'rmonlar va marmar obidalarga zarar yetkazadi!"
                    : "Me'yoriy tabiiy yomg'ir (pH = 5.6): Ekotizim va suv havzalari xavfsiz.",
                280,
                270
            )

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [zavodTutuni])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">6. Ekologiya: Nima uchun pH &lt; 5.6 bo'lgan yomg'ir "kislotali yomg'ir" deyiladi?</h3>
                    <p className="text-sm text-slate-400 font-serif">Zavod va avtomobillardan chiqqan SO₂ va NO₂ gazlari bulutdagi suv bilan kislota hosil qiladi</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('click'); setZavodTutuni(!zavodTutuni) }}
                    className={`px-4 py-1.5 rounded-xl font-bold font-serif text-sm border ${
                        zavodTutuni
                            ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                            : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    }`}
                >
                    {zavodTutuni ? "Filtrlarni yoqish (Toza yomg'ir)" : "SO₂ va NO₂ chiqindisi (Kislotali yomg'ir)"}
                </button>
            </div>

            <div className="overflow-x-auto w-0 min-w-full">
              <canvas ref={canvasRef} width={560} height={285} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
            </div>
        </div>
    )
}

// ============================================================
// 1-O'YIN: pH MUHITINI TOP (KISLOTALI, NEYTRAL, ISHQORIY)
// ============================================================
const PH_OYIN_SAVOLLAR = [
    { nom: "Limon sharbati (pH = 2.2)", muhit: "Kislotali (pH < 7)" },
    { nom: "Distillangan toza suv (pH = 7.0)", muhit: "Neytral (pH = 7)" },
    { nom: "O'yuvchi natriy eritmasi — NaOH (pH = 14.0)", muhit: "Ishqoriy (pH > 7)" },
    { nom: "Inson oshqozon shirasi — HCl (pH = 1.5)", muhit: "Kislotali (pH < 7)" },
    { nom: "Qo'l sovuni va kir yuvish kukuni eritmasi (pH = 10.0)", muhit: "Ishqoriy (pH > 7)" },
    { nom: "Osh tuzi (NaCl) ning toza suvdagi eritmasi (pH = 7.0)", muhit: "Neytral (pH = 7)" },
    { nom: "Ichimlik sodasi eritmasi — NaHCO₃ (pH = 8.5)", muhit: "Ishqoriy (pH > 7)" },
    { nom: "Oshxona sirkasi — CH₃COOH (pH = 3.0)", muhit: "Kislotali (pH < 7)" },
]

function PhMuhitTopOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = PH_OYIN_SAVOLLAR[idx]
    const variantlar = ["Kislotali (pH < 7)", "Neytral (pH = 7)", "Ishqoriy (pH > 7)"]

    const tekshir = (v) => {
        if (tanlov) return
        setTanlov(v)
        if (v === joriy.muhit) {
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
                    <h3 className="text-xl font-bold text-white">1-o'yin: pH Ko'rsatkichi Bo'yicha Muhitni Toping</h3>
                    <p className="text-sm text-slate-400">Eritma kislotali (pH &lt; 7), neytral (pH = 7) yoki ishqoriy (pH &gt; 7) ekanini belgilang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    Ball: {ball} | {idx + 1}/{PH_OYIN_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-4">
                <div className="text-2xl font-bold text-amber-400">{joriy.nom}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {variantlar.map((v) => (
                    <button
                        key={v}
                        onClick={() => tekshir(v)}
                        className={`p-4 rounded-xl border text-center font-bold transition-all ${
                            !tanlov
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-sky-400'
                                : v === joriy.muhit
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
                            setIdx((i) => (i + 1) % PH_OYIN_SAVOLLAR.length)
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
// 2-O'YIN: [H⁺] VA [OH⁻] HAMDA 10 KARRA QOIDASI
// ============================================================
const ION_SAVOLLAR = [
    { savol: "pH = 3 bo'lgan eritmada qaysi ionlar konsentratsiyasi ko'proq?", javob: "[H⁺] > [OH⁻] (Vodorod ionlari ko'p)", variantlar: ["[H⁺] > [OH⁻] (Vodorod ionlari ko'p)", "[H⁺] = [OH⁻]", "[H⁺] < [OH⁻]", "Hech qanday ion yo'q"] },
    { savol: "pH = 2 bo'lgan kislota eritmasi pH = 3 bo'lgan eritmadan necha marta kuchliroq (nordonroq)?", javob: "10 marta kuchliroq", variantlar: ["2 marta", "10 marta kuchliroq", "1000 marta", "1 marta"] },
    { savol: "pH = 12 bo'lgan eritmada lakmus va fenolftalein qanday rangga kiradi?", javob: "Lakmus — ko'k, Fenolftalein — malina rang", variantlar: ["Ikkalasi ham rangsiz", "Lakmus — qizil, Fenolftalein — rangsiz", "Lakmus — ko'k, Fenolftalein — malina rang", "Ikkalasi ham sariq"] },
    { savol: "Kislotali eritmaga ko'p miqdorda toza suv qo'shib suyultirilsa, uning pH ko'rsatkichi qanday o'zgaradi?", javob: "pH ortib, 7 ga yaqinlashadi (masalan 2 dan 5 ga o'tadi)", variantlar: ["pH 14 bo'lib ketadi", "Umuman o'zgarmaydi", "pH 0 ga tushib ketadi", "pH ortib, 7 ga yaqinlashadi (masalan 2 dan 5 ga o'tadi)"] },
    { savol: "1909-yilda fanga pH (vodorod ko'rsatkichi) tushunchasini kiritgan daniyalik olim kim?", javob: "Syoren Syorensen", variantlar: ["Syoren Syorensen", "Robert Boyl", "Dmitriy Mendeleyev", " Svante Arrenius"] },
]

function IonHisobOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = ION_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">2-o'yin: [H⁺] vs [OH⁻] va 10 Karra Qoidasi</h3>
                    <p className="text-sm text-slate-400">pH shkalasining matematik va ionli mohiyatini toping</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    Ball: {ball} | {idx + 1}/{ION_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.savol}</p>
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
                            setIdx((i) => (i + 1) % ION_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                    >
                        Keyingi savol →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 3-O'YIN: TIBBIYOT VA AGRONOMIYA pH EKSPERTI
// ============================================================
const AMALIY_PH_SAVOLLAR = [
    { vazifa: "Sog'lom inson qonining doimiy pH ko'rsatkichi qaysi oraliqda bo'ladi?", javob: "pH = 7.35 – 7.45 (kuchsiz ishqoriy)", variantlar: ["pH = 7.35 – 7.45 (kuchsiz ishqoriy)", "pH = 12.0 – 13.0", "pH = 4.0 – 5.0", "pH = 1.5 – 2.0"] },
    { vazifa: "Kislotali (pH = 4.5) tuproqning unumdorligini oshirish va pH ni 7 ga yaqinlashtirish uchun tuproqqa nima solinadi?", javob: "Ohaktosh (CaCO₃) yoki so'ndirilgan ohak Ca(OH)₂", variantlar: ["Sulfat kislota (H₂SO₄)", "Ohaktosh (CaCO₃) yoki so'ndirilgan ohak Ca(OH)₂", "Osh tuzi (NaCl)", "Sirka kislotasi"] },
    { vazifa: "Nima uchun shirinlik yegandan keyin tishni tish pastasi (pH ≈ 8.5) bilan yuvish kerak?", javob: "Og'izda hosil bo'lgan kislotali muhitni (pH < 5.5) neytrallab, tish emalini yemirilishdan saqlash uchun", variantlar: ["pH ni 1 ga tushirish uchun", "Og'izni yanada nordon qilish uchun", "Og'izda hosil bo'lgan kislotali muhitni (pH < 5.5) neytrallab, tish emalini yemirilishdan saqlash uchun", "Tishni yumshatish uchun"] },
    { vazifa: "Yomg'ir suvining pH ko'rsatkichi necha bo'lganda u ekologik xavfli 'kislotali yomg'ir' hisoblanadi?", javob: "pH < 5.6 (masalan, pH 4.0)", variantlar: ["pH = 8.5", "pH = 14.0", "pH = 7.0", "pH < 5.6 (masalan, pH 4.0)"] },
]

function AmaliyPhEkspertOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = AMALIY_PH_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">3-o'yin: Tibbiyot, Ekologiya va Agronomiyada pH Eksperti</h3>
                    <p className="text-sm text-slate-400">Amaliy hayotdagi pH muammolariga yechim toping</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold">
                    Ball: {ball} | {idx + 1}/{AMALIY_PH_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.vazifa}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4">
                {variantlarniAralashtir(joriy.variantlar, joriy.savol || joriy.vazifa || joriy.nom || joriy.qotishma || joriy.reaksiya || '', idx).map(({ item: v }) => (
                    <button
                        key={v}
                        onClick={() => tekshir(v)}
                        className={`p-4 rounded-xl border text-left font-bold transition-all ${
                            !tanlov
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-sky-400'
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
                            setIdx((i) => (i + 1) % AMALIY_PH_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
                    >
                        Keyingi vaziyat →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH)
// ============================================================
const DUEL_5_4 = [
    { savol: "Toza distillangan suvning (neytral muhitning) pH ko'rsatkichi nechaga teng?", variantlar: ["pH = 7", "pH = 10", "pH = 14", "pH = 0"], javob: 0 },
    { savol: "pH < 7 bo'lgan eritma qanday muhitga ega?", variantlar: ["Quruq", "Kislotali", "Neytral", "Ishqoriy"], javob: 1 },
    { savol: "pH > 7 bo'lgan eritma qanday muhitga ega?", variantlar: ["Kislotali", "Neytral", "Ishqoriy", "Gazli"], javob: 2 },
    { savol: "Quyidagilardan qaysi biri eng kuchli kislotali muhitga ega?", variantlar: ["pH = 5", "pH = 7", "pH = 13", "pH = 1"], javob: 3 },
    { savol: "Quyidagilardan qaysi biri eng kuchli ishqoriy muhitga ega?", variantlar: ["pH = 14", "pH = 2", "pH = 7", "pH = 9"], javob: 0 },
    { savol: "Eritmaning pH qiymatini 0.01 aniqlikda o'lchaydigan elektron asbob nima deyiladi?", variantlar: ["Ampermetr", "pH-metr", "Barometr", "Termometr"], javob: 1 },
]

function JamoalarDueli5_4() {
    const [idx, setIdx] = useState(0)
    const [ball1, setBall1] = useState(0)
    const [ball2, setBall2] = useState(0)
    const [navbat, setNavbat] = useState(1)
    const [natija, setNatija] = useState(null)

    const xomJoriy = DUEL_5_4[idx]
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
                            setIdx((i) => (i + 1) % DUEL_5_4.length)
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
// ASOSIY KOMPONENT: MAVZU 5.4
// ============================================================
export default function Mavzu5_4() {
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
        { nom: "1. pH Shkalasi (0..14)", ikon: 'tolqin' },
        { nom: "2. [H⁺] va [OH⁻] tarozisi", ikon: 'tarozi' },
        { nom: "3. Raqamli pH-metr", ikon: 'chaqmoq' },
        { nom: "4. Inson organizmi pH", ikon: 'yulduz' },
        { nom: "5. Tuproq pH va Ohaklash", ikon: 'kristall' },
        { nom: "6. Kislotali yomg'ir (pH<5.6)", ikon: 'tomchi' },
    ]

    const oyinlar = [
        { nom: "1. pH Muhitini Top", ikon: 'tolqin' },
        { nom: "2. [H⁺] vs [OH⁻] Hisobi", ikon: 'tarozi' },
        { nom: "3. Tibbiyot va Agronomiya", ikon: 'yulduz' },
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
                mavzuRaqam="5.4"
                mavzuNom="pH ko'rsatkichi"
                bobNom="5-bob. Kislotalar va asoslar"
                sahifa={85}
                oldingiRaqam="5.3"
                asosiyBolim={asosiyBolim}
                setAsosiyBolim={setAsosiyBolim}
                toliqEkran={toliqEkran}
                toliqEkranniUlash={toliqEkranniUlash}
            />

            {asosiyBolim === 'takrorlash' && (
                <OtganDarsniTakrorlash
                    oldingiRaqam="5.3"
                    oldingiNom="Indikatorlar"
                    savollar={TAKROPI_5_3}
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

                    {faolKorgazma === 0 && <PhShkalaCanvas />}
                    {faolKorgazma === 1 && <IonMuvozanatTarozisiCanvas />}
                    {faolKorgazma === 2 && <RaqamliPhMetrCanvas />}
                    {faolKorgazma === 3 && <InsonOrganizmiPhCanvas />}
                    {faolKorgazma === 4 && <TuproqPhAgronomCanvas />}
                    {faolKorgazma === 5 && <KislotaliYomgirPhCanvas />}
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

                    {faolOyin === 0 && <PhMuhitTopOyini />}
                    {faolOyin === 1 && <IonHisobOyini />}
                    {faolOyin === 2 && <AmaliyPhEkspertOyini />}
                    {faolOyin === 3 && <JamoalarDueli5_4 />}
                </div>
            )}
        </div>
    )
}
