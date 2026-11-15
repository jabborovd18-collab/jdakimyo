'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 5-BOB, 5.1-MAVZU
// "Kislotalar" (Darslik 76-bet)
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

const TAKROPI_4_3 = [
    {
        savol: "Oshxonada xamirni ko'pchitish uchun ishlatiladigan ichimlik sodasining kimyoviy formulasi qaysi?",
        variantlar: ["NaHCO₃", "Na₂CO₃", "CaCO₃", "NaCl"],
        togriJavob: "NaHCO₃",
        izoh: "Ichimlik sodasi — natriy gidrokarbonat (NaHCO₃) bo'lib, kislota yoki issiqlik ta'sirida CO₂ gazini chiqaradi."
    },
    {
        savol: "Tabiiy gaz (CH₄) havo yetishmaganda chala yonsa qaysi zaharli gaz hosil bo'ladi?",
        variantlar: ["CO₂ (Karbonat angidrid)", "CO (Is gazi)", "O₂ (Kislorod)", "H₂ (Vodorod)"],
        togriJavob: "CO (Is gazi)",
        izoh: "Chala yonishda rangsiz va hidsiz o'ta zaharli is gazi (uglerod (II) oksid — CO) ajraladi."
    },
    {
        savol: "So'ndirilmagan ohak (CaO) ustiga suv quyilganda qanday modda hosil bo'ladi?",
        variantlar: [
            "SiO₂ — Kvars qumi",
            "Na₂CO₃ — Kir sodasi",
            "Ca(OH)₂ — So'ndirilgan ohak",
            "CaCO₃ — Ohaktosh",
        ],
        togriJavob: "Ca(OH)₂ — So'ndirilgan ohak",
        izoh: "CaO + H₂O → Ca(OH)₂ + Q reaksiyasida ko'p issiqlik ajralib, so'ndirilgan ohak hosil bo'ladi."
    }
]

// ============================================================
// 1-KO'RGAZMA: TABIIY (ORGANIK) KISLOTALAR OLAMI
// ============================================================
const TABIIY_KISLOTALAR = [
    { id: 'limon', manba: 'Limon va Sitrus mevalar', kislota: 'Limon kislotasi (C₆H₈O₇)', tam: 'Kuchli nordon', rang: '#FACC15', izoh: 'Limon tarkibida 5–8% gacha limon kislotasi bo\'ladi. Qandolatchilikda va choynak qasmog\'ini tozalashda ishlatiladi.' },
    { id: 'olma', manba: 'Ko\'k olma va Uzum', kislota: 'Olma va Vino kislotalari', tam: 'Yoqimli nordon', rang: '#4ADE80', izoh: 'Mevalarga tetiklantiruvchi nordon ta\'m beradi va moddalar almashinuvida qatnashadi.' },
    { id: 'qatiq', manba: 'Qatiq, Suzma va Kefir', kislota: 'Sut kislotasi (C₃H₆O₃)', tam: 'Yumshoq nordon', rang: '#F8FAFC', izoh: 'Sut achiganda foydali bakteriyalar sut shakarini (laktozani) sut kislotasiga aylantiradi. Yugurganda mushaklarda ham hosil bo\'ladi!' },
    { id: 'chumoli', manba: 'Chumoli, Ari va Qichitqi o\'t', kislota: 'Chumoli kislotasi (HCOOH)', tam: 'Kuydiruvchi va achituvchi!', rang: '#F43F5E', izoh: 'Chumoli chaqqanda yoki qichitqi o\'t qo\'lga tekkanda teri ostiga chumoli kislotasi (HCOOH) kirib achishtiradi.' },
    { id: 'shovul', manba: 'Shovul va Otquloq bargi', kislota: 'Shovul (oksalat) kislotasi (H₂C₂O₄)', tam: 'O\'tkir nordon', rang: '#10B981', izoh: 'Bahorgi ko\'kat — shovulga o\'ziga xos nordon ta\'m beruvchi ikki negizli organik kislota.' },
    { id: 'sirka', manba: 'Oshxona sirkasi (3–9%)', kislota: 'Sirka kislotasi (CH₃COOH)', tam: 'O\'tkir hidli nordon', rang: '#38BDF8', izoh: 'Sabzavotlarni konservalash va marinadlashda mikroblar ko\'payishini to\'xtatuvchi kislotali muhit yaratadi.' },
]

function TabiiyKislotalarCanvas() {
    const [tanlangan, setTanlangan] = useState(TABIIY_KISLOTALAR[0])
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

            // Markaziy manba doirasi
            const cx = 195
            const cy = 148
            const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 78)
            grad.addColorStop(0, tanlangan.rang)
            grad.addColorStop(1, 'rgba(15, 23, 42, 0.2)')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(cx, cy, 72, 0, Math.PI * 2)
            ctx.fill()

            ctx.strokeStyle = tanlangan.rang
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.arc(cx, cy, 52, 0, Math.PI * 2)
            ctx.stroke()

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(tanlangan.manba, cx, cy + 5)

            // Ajralib chiqayotgan H+ protonlari (nordon ta'm sababchisi)
            for (let i = 0; i < 8; i++) {
                const px = 285 + ((t * 45 + i * 32) % 210)
                const py = 80 + (i % 4) * 42 + Math.sin(t * 2 + i) * 6

                ctx.fillStyle = '#F43F5E'
                ctx.beginPath()
                ctx.arc(px, py, 14, 0, Math.PI * 2)
                ctx.fill()

                ctx.fillStyle = '#FFFFFF'
                ctx.font = 'bold 12px "Times New Roman", serif'
                ctx.fillText('H⁺', px, py + 4)
            }

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(tanlangan.kislota, 280, 34)

            ctx.fillStyle = '#38BDF8'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText("Barcha kislotalarga nordon ta'm beruvchi zarracha — vodorod kationi (H⁺)!", 280, 276)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [tanlangan])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">1. Tabiatdagi organik kislotalar va nordon ta'm siri (H⁺)</h3>
                    <p className="text-sm text-slate-400 font-serif">Meva, sut mahsulotlari va hasharotlarda uchraydigan tabiiy kislotalarni o'rganing</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-bold font-serif">
                    {tanlangan.tam}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={295} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    <div className="grid grid-cols-2 gap-2">
                        {TABIIY_KISLOTALAR.map((k) => (
                            <button
                                key={k.id}
                                onClick={() => { tovushChiqar('click'); setTanlangan(k) }}
                                className={`p-2.5 rounded-xl border text-left transition-all ${
                                    tanlangan.id === k.id
                                        ? 'bg-amber-500/20 border-amber-400 text-white'
                                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                            >
                                <div className="font-bold text-xs sm:text-sm">{k.manba}</div>
                            </button>
                        ))}
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                        <div className="text-amber-400 font-bold text-sm mb-1">{tanlangan.kislota}</div>
                        <p className="text-slate-200 text-sm leading-relaxed">{tanlangan.izoh}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 2-KO'RGAZMA: MINERAL KISLOTALAR TUZILISHI (H⁺ + KISLOTA QOLDIG'I)
// ============================================================
const MINERAL_KISLOTALAR = [
    { id: 'HCl', formula: 'HCl', nom: 'Xlorid kislota', hSoni: 1, qoldiq: 'Cl⁻ (xlorid)', negiz: '1 negizli, kislorodsiz', oksid: 'Yo\'q (H₂ + Cl₂ → 2HCl)', izoh: 'Inson oshqozon shirasida ~0.5% xlorid kislota bor: u ovqat hazm bo\'lishiga yordam beradi va mikroblarni o\'ldiradi!' },
    { id: 'HNO3', formula: 'HNO₃', nom: 'Nitrat kislota', hSoni: 1, qoldiq: 'NO₃⁻ (nitrat)', negiz: '1 negizli, kislorodli', oksid: 'N₂O₅ + H₂O → 2HNO₃', izoh: 'Kuchli oksidlovchi kislota. Mineral o\'g\'itlar (selitra) va portlovchi moddalar ishlab chiqarishda qo\'llaniladi.' },
    { id: 'H2SO4', formula: 'H₂SO₄', nom: 'Sulfat kislota', hSoni: 2, qoldiq: 'SO₄²⁻ (sulfat)', negiz: '2 negizli, kislorodli', oksid: 'SO₃ + H₂O → H₂SO₄', izoh: '"Kimyo sanoatining noni"! Avtomobil akkumulyatorlarida elektrolit sifatida ishlatiladigan og\'ir moysimon suyuqlik.' },
    { id: 'H2CO3', formula: 'H₂CO₃', nom: 'Karbonat kislota', hSoni: 2, qoldiq: 'CO₃²⁻ (karbonat)', negiz: '2 negizli, kuchsiz kislota', oksid: 'CO₂ + H₂O ⇌ H₂CO₃', izoh: 'Gazli ichimliklar tarkibida bo\'ladi. Beqaror bo\'lgani uchun shisha qopqog\'i ochilganda CO₂↑ va H₂O ga parchalanadi.' },
    { id: 'H3PO4', formula: 'H₃PO₄', nom: 'Ortofosfat kislota', hSoni: 3, qoldiq: 'PO₄³⁻ (fosfat)', negiz: '3 negizli, kislorodli', oksid: 'P₂O₅ + 3H₂O → 2H₃PO₄', izoh: 'O\'rtacha kuchdagi qattiq kristall kislota. Fosforli o\'g\'itlar olishda va zangni tozalashda ishlatiladi.' },
]

function MineralKislotalarCanvas() {
    const [kislota, setKislota] = useState(MINERAL_KISLOTALAR[2]) // H2SO4
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

            // Markazda kislota qoldig'i anioni
            const cx = 310
            const cy = 148
            ctx.fillStyle = '#0284C7'
            ctx.strokeStyle = '#38BDF8'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.arc(cx, cy, 48, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(kislota.qoldiq.split(' ')[0], cx, cy + 5)

            // Atrofida H+ ionlari (negizliligi = H atomlari soni)
            for (let i = 0; i < kislota.hSoni; i++) {
                const burchak = (i / kislota.hSoni) * Math.PI * 1.4 - 0.7 + Math.sin(t + i) * 0.1
                const hx = cx - 125 + i * 25
                const hy = 90 + i * 55 + Math.sin(t * 2 + i) * 6

                // Bog' chizig'i
                ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)'
                ctx.lineWidth = 2.5
                ctx.setLineDash([5, 5])
                ctx.beginPath()
                ctx.moveTo(hx + 22, hy)
                ctx.lineTo(cx - 44, cy)
                ctx.stroke()
                ctx.setLineDash([])

                ctx.fillStyle = '#E11D48'
                ctx.strokeStyle = '#FDA4AF'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(hx, hy, 22, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()

                ctx.fillStyle = '#FFFFFF'
                ctx.font = 'bold 16px "Times New Roman", serif'
                ctx.fillText('H⁺', hx, hy + 6)
            }

            // Yuqori formula va kislotoli oksid
            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.fillText(`${kislota.formula} — ${kislota.nom} (${kislota.negiz})`, 280, 34)

            ctx.fillStyle = '#38BDF8'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(`Olinishi: ${kislota.oksid}   |   Valentligi = ${kislota.hSoni}`, 280, 276)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [kislota])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">2. Kislota tuzilishi: Vodorod atomlari (H⁺) + Kislota qoldig'i</h3>
                <p className="text-sm text-slate-400 font-serif">Kislota qoldig'ining valentligi uning tarkibidagi vodorod atomlari soniga (negizliligiga) teng</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={295} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    {MINERAL_KISLOTALAR.map((k) => (
                        <button
                            key={k.id}
                            onClick={() => { tovushChiqar('click'); setKislota(k) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                kislota.id === k.id
                                    ? 'bg-rose-500/20 border-rose-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <span className="font-bold text-sm">{k.formula} — {k.nom}</span>
                            <span className="text-xs text-rose-300 font-bold">{k.hSoni} negizli</span>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {kislota.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 3-KO'RGAZMA: KISLORODLI VA KISLORODSIZ KISLOTALAR (OKSID + SUV)
// ============================================================
const OKSID_KISLOTA_JUFTLAR = [
    { id: 'so3', oksid: 'SO₃ (Oltingugurt (VI) oksid)', reaksiya: 'SO₃ + H₂O → H₂SO₄ (Sulfat kislota)', tur: 'Kislorodli (2 negizli)', rang: '#F59E0B', izoh: 'Oltingugurt (VI) oksid suv bilan shiddatli reaksiyaga kirishib, kuchli sulfat kislota hosil qiladi.' },
    { id: 'co2', oksid: 'CO₂ (Karbonat angidrid)', reaksiya: 'CO₂ + H₂O ⇌ H₂CO₃ (Karbonat kislota)', tur: 'Kislorodli (2 negizli)', rang: '#38BDF8', izoh: 'CO₂ gazi bosim ostida suvda eritilganda kuchsiz karbonat kislota (gazli suv) hosil bo\'ladi.' },
    { id: 'p2o5', oksid: 'P₂O₅ (Fosfor (V) oksid)', reaksiya: 'P₂O₅ + 3H₂O → 2H₃PO₄ (Fosfat kislota)', tur: 'Kislorodli (3 negizli)', rang: '#10B981', izoh: 'Oq qorsimon P₂O₅ kukuni suvni juda kuchli tortadi va uch negizli ortofosfat kislotaga aylanadi.' },
    { id: 'hcl', oksid: 'HCl gazi (Vodorod xlorid)', reaksiya: 'H₂ + Cl₂ → 2HCl(gaz) → HCl(eritma)', tur: 'Kislorodsiz (1 negizli)', rang: '#F43F5E', izoh: 'Kislorodsiz kislotalar (HCl, H₂S, HBr) oksiddan emas, vodorod va metallmas birikmasining suvda erishidan olinadi!' },
]

function KislotaTasnifiCanvas() {
    const [juft, setJuft] = useState(OKSID_KISLOTA_JUFTLAR[0])
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

            // Suvli menzurka
            ctx.fillStyle = 'rgba(56, 189, 248, 0.22)'
            ctx.fillRect(160, 120, 240, 125)
            ctx.strokeStyle = '#64748B'
            ctx.lineWidth = 3.5
            ctx.strokeRect(160, 80, 240, 165)

            // Tushayotgan oksid/gaz molekulalari
            for (let i = 0; i < 10; i++) {
                const mx = 200 + i * 18
                const my = 65 + ((t * 35 + i * 16) % 160)
                ctx.fillStyle = juft.rang
                ctx.beginPath()
                ctx.arc(mx, my, 8, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(juft.reaksiya, 280, 38)

            ctx.fillStyle = juft.rang
            ctx.font = 'bold 15px "Times New Roman", serif'
            ctx.fillText(`Tasnifi: ${juft.tur}`, 280, 275)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [juft])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">3. Kislotalarning olinishi va tasnifi: Kislorodli hamda Kislorodsiz</h3>
                <p className="text-sm text-slate-400 font-serif">Kislotali oksidlar (metallmas oksidlari) suv bilan birikib kislorodli kislota hosil qiladi</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={295} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2.5 font-serif">
                    {OKSID_KISLOTA_JUFTLAR.map((j) => (
                        <button
                            key={j.id}
                            onClick={() => { tovushChiqar('click'); setJuft(j) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                                juft.id === j.id
                                    ? 'bg-sky-500/20 border-sky-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{j.oksid}</div>
                            <div className="text-xs text-sky-400">{j.reaksiya}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {juft.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 4-KO'RGAZMA: KISLOTA + METALL REAKSIYASI (Mg, Zn, Fe, Cu + HCl)
// ============================================================
const METALL_SINOVLAR = [
    { id: 'Mg', nom: 'Magniy (Mg)', tezlik: 18, reaksiya: 'Mg + 2HCl → MgCl₂ + H₂↑ (Shiddatli!)', rang: '#E2E8F0', izoh: 'Magniy juda faol metall bo\'lgani uchun kislotadan vodorodni (H₂↑) shiddatli ko\'piklanish bilan siqib chiqaradi.' },
    { id: 'Zn', nom: 'Rux (Zn)', tezlik: 10, reaksiya: 'Zn + 2HCl → ZnCl₂ + H₂↑ (Laboratoriya usuli)', rang: '#94A3B8', izoh: 'Laboratoriyada toza vodorod gazi (H₂↑) olish uchun aynan rux va xlorid/sulfat kislota reaksiyasidan foydalaniladi.' },
    { id: 'Fe', nom: 'Temir (Fe)', tezlik: 4, reaksiya: 'Fe + 2HCl → FeCl₂ + H₂↑ (Sekin)', rang: '#64748B', izoh: 'Temir ruxdan sustroq bo\'lgani uchun vodorod pufakchalari asta-sekin ajralib chiqadi.' },
    { id: 'Cu', nom: 'Mis (Cu)', tezlik: 0, reaksiya: 'Cu + HCl → Reaksiya bormaydi! (H₂ chiqmaydi)', rang: '#F97316', izoh: 'Mis (Cu), Kumush (Ag) va Oltin (Au) faollik qatorida vodoroddan KEYIN turgani uchun kislotadan vodorodni siqib chiqara olmaydi!' },
]

function KislotaMetallCanvas() {
    const [metall, setMetall] = useState(METALL_SINOVLAR[1])
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

            // 4 ta probirkani yonma-yon ko'rsatish
            METALL_SINOVLAR.forEach((m, idx) => {
                const px = 95 + idx * 120
                const tanlanganmi = m.id === metall.id

                // Probirka
                ctx.strokeStyle = tanlanganmi ? '#FACC15' : '#475569'
                ctx.lineWidth = tanlanganmi ? 3.5 : 2
                ctx.beginPath()
                ctx.roundRect(px - 28, 60, 56, 165, [0, 0, 26, 26])
                ctx.stroke()

                // HCl eritmasi
                ctx.fillStyle = 'rgba(56, 189, 248, 0.22)'
                ctx.beginPath()
                ctx.roundRect(px - 25, 110, 50, 112, [0, 0, 24, 24])
                ctx.fill()

                // Metall bo'lagi
                ctx.fillStyle = m.rang
                ctx.beginPath()
                ctx.arc(px, 204, 13, 0, Math.PI * 2)
                ctx.fill()
                ctx.fillStyle = '#0F172A'
                ctx.font = 'bold 12px "Times New Roman", serif'
                ctx.textAlign = 'center'
                ctx.fillText(m.id, px, 208)

                // H2 pufakchalari
                for (let b = 0; b < m.tezlik; b++) {
                    const bx = px - 14 + ((b * 9) % 28)
                    const by = 195 - ((t * (18 + m.tezlik * 2) + b * 13) % 110)
                    ctx.fillStyle = '#E0F2FE'
                    ctx.beginPath()
                    ctx.arc(bx, by, 3.5, 0, Math.PI * 2)
                    ctx.fill()
                }

                ctx.fillStyle = tanlanganmi ? '#FACC15' : '#CBD5E1'
                ctx.font = 'bold 13px "Times New Roman", serif'
                ctx.fillText(m.nom, px, 246)
            })

            ctx.fillStyle = metall.tezlik > 0 ? '#10B981' : '#F43F5E'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(metall.reaksiya, 280, 34)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [metall])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">4. Kislotalarning metallar bilan ta'siri: Mg, Zn, Fe va Cu + HCl</h3>
                <p className="text-sm text-slate-400 font-serif">Faol metallar kislotadan vodorod gazini (H₂↑) siqib chiqaradi, mis (Cu) esa reaksiyaga kirishmaydi</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={275} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2.5 font-serif">
                    <div className="grid grid-cols-2 gap-2">
                        {METALL_SINOVLAR.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => { tovushChiqar('click'); setMetall(m) }}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    metall.id === m.id
                                        ? 'bg-amber-500/20 border-amber-400 text-white'
                                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                            >
                                <div className="font-bold text-sm">{m.nom}</div>
                                <div className="text-xs text-amber-300">
                                    {m.tezlik > 0 ? 'H₂↑ ajraladi' : 'Reaksiya yo\'q'}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {metall.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 5-KO'RGAZMA: SULFAT KISLOTANI (H₂SO₄) SUYULTIRISH OLTIN QOIDASI
// ============================================================
function KislotaSuyultirishCanvas() {
    const [usul, setUsul] = useState('togri') // 'togri' = suvga kislota, 'xato' = kislotaga suv
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

            const togri = usul === 'togri'

            // Stakan
            ctx.strokeStyle = togri ? '#10B981' : '#EF4444'
            ctx.lineWidth = 3.5
            ctx.strokeRect(190, 110, 180, 135)

            // Stakandagi suyuqlik
            ctx.fillStyle = togri ? 'rgba(56, 189, 248, 0.30)' : 'rgba(245, 158, 11, 0.45)'
            ctx.fillRect(194, 150, 172, 91)

            // Yuqoridan quyilayotgan oqim
            ctx.strokeStyle = togri ? '#F59E0B' : '#38BDF8'
            ctx.lineWidth = 6
            ctx.beginPath()
            ctx.moveTo(280, 50)
            ctx.lineTo(280, 155)
            ctx.stroke()

            if (togri) {
                // Og'ir H2SO4 (1.84 g/cm3) pastga cho'kib issiqlik tekis tarqaladi
                for (let i = 0; i < 8; i++) {
                    const y = 155 + ((t * 25 + i * 10) % 75)
                    ctx.fillStyle = '#FACC15'
                    ctx.beginPath()
                    ctx.arc(280 + Math.sin(t + i) * 35, y, 5, 0, Math.PI * 2)
                    ctx.fill()
                }
            } else {
                // XAVFLI: Yengil suv (1.0 g/cm3) og'ir kislota sirtida qaynab, atrofga sachraydi!
                for (let i = 0; i < 14; i++) {
                    const burchak = -Math.PI * 0.15 - (i / 14) * Math.PI * 0.7
                    const masofa = (t * 45 + i * 12) % 95
                    ctx.fillStyle = '#EF4444'
                    ctx.beginPath()
                    ctx.arc(280 + Math.cos(burchak) * masofa, 150 + Math.sin(burchak) * masofa, 6, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            ctx.textAlign = 'center'
            ctx.fillStyle = togri ? '#10B981' : '#F43F5E'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.fillText(
                togri
                    ? "TO'G'RI QOIDA: Suv ustiga og'ir kislota (ρ = 1.84 g/cm³) ingichka oqimda quyiladi!"
                    : "TAQIQLANADI! Konsentrlangan H₂SO₄ ustiga suv quyilsa, sirtda qaynab sachraydi!",
                280,
                32
            )

            ctx.fillStyle = '#CBD5E1'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(
                togri
                    ? "Og'ir kislota suv tubiga cho'kadi va ajralgan issiqlik (+Q) butun suv hajmiga tekis tarqaladi."
                    : "Suv kislotadan yengil bo'lgani uchun yuzada qolib, 100°C ga yetib portlab sachraydi!",
                280,
                272
            )

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [usul])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">5. Texnika xavfsizligi oltin qoidasi: H₂SO₄ ni qanday suyultiramiz?</h3>
                    <p className="text-sm text-slate-400 font-serif">"Avval suv, keyin kislota — aks holda bo'lar xato!" Nega bundayligini zichlik orqali ko'ring</p>
                </div>
                <div className="flex gap-2 font-serif">
                    <button
                        onClick={() => { tovushChiqar('success'); setUsul('togri') }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm border ${
                            usul === 'togri'
                                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        To'g'ri: Suvga → Kislota quyish
                    </button>
                    <button
                        onClick={() => { tovushChiqar('error'); setUsul('xato') }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm border ${
                            usul === 'xato'
                                ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                    >
                        Xato: Kislotaga → Suv quyish
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto w-0 min-w-full">
              <canvas ref={canvasRef} width={560} height={290} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
            </div>
        </div>
    )
}

// ============================================================
// 6-KO'RGAZMA: KISLOTA + OHAKTOSH / BO'R (CaCO₃ + 2HCl → CO₂↑)
// ============================================================
function KislotaKarbonatCanvas() {
    const [tomizildi, setTomizildi] = useState(true)
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

            // Marmar / Bo'r toshi (CaCO3)
            ctx.fillStyle = '#E2E8F0'
            ctx.strokeStyle = '#94A3B8'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.roundRect(190, 165, 180, 65, 14)
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = '#0F172A'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText("Marmar / Bo'r (CaCO₃)", 280, 203)

            if (tomizildi) {
                // Kislota tomchilari va CO2 vijillashi
                for (let i = 0; i < 16; i++) {
                    const bx = 215 + ((i * 11) % 130)
                    const by = 162 - ((t * 38 + i * 12) % 105)
                    ctx.fillStyle = '#38BDF8'
                    ctx.beginPath()
                    ctx.arc(bx, by, 5 + (i % 3), 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.fillText("CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑ (Vijillab gaz ajralishi!)", 280, 36)

            ctx.fillStyle = '#94A3B8'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText("Geologlar dala sharoitida ohaktosh va marmarni ustiga kislota tomizib CO₂ chiqishidan aniqlaydilar!", 280, 268)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [tomizildi])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">6. Kislotalarning karbonat tuzlariga (bo'r, marmar, sodaga) ta'siri</h3>
                    <p className="text-sm text-slate-400 font-serif">Marmar haykallar nega kislotali yomg'irdan yemirilib ketadi?</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('click'); setTomizildi(!tomizildi) }}
                    className="px-4 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400 text-sky-300 font-bold font-serif text-sm"
                >
                    {tomizildi ? "Reaksiyani to'xtatish" : "Bo'r ustiga HCl tomizish"}
                </button>
            </div>

            <div className="overflow-x-auto w-0 min-w-full">
              <canvas ref={canvasRef} width={560} height={285} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
            </div>
        </div>
    )
}

// ============================================================
// 1-O'YIN: TABIIY KISLOTA MANBASINI TOPING
// ============================================================
const MANBA_SAVOLLAR = [
    { manba: "Inson oshqozon shirasida ovqatni hazm qilish va mikroblarni o'ldirish uchun qaysi kislota bor?", javob: "Xlorid kislota (HCl — 0.5%)", variantlar: ["Xlorid kislota (HCl — 0.5%)", "Nitrat kislota (HNO₃)", "Fosfat kislota (H₃PO₄)", "Sulfat kislota (H₂SO₄)"] },
    { manba: "Chumoli chaqqanda yoki qichitqi o't qo'lga tekkanda achishtiruvchi kislota qaysi?", javob: "Chumoli kislotasi (HCOOH)", variantlar: ["Karbonat kislota", "Chumoli kislotasi (HCOOH)", "Sut kislotasi", "Limon kislotasi"] },
    { manba: "Qatiq, suzma, kefir va tuzlangan karam tarkibida qaysi tabiiy kislota bor?", javob: "Sut kislotasi", variantlar: ["Sirka kislotasi", "Shovul kislotasi", "Sut kislotasi", "Xlorid kislota"] },
    { manba: "Avtomobil akkumulyatorlariga elektrolit sifatida quyiladigan kislota qaysi?", javob: "Sulfat kislota (H₂SO₄)", variantlar: ["Karbonat kislota (H₂CO₃)", "Sirka kislotasi", "Olma kislotasi", "Sulfat kislota (H₂SO₄)"] },
    { manba: "Gazli ichimliklarga CO₂ gazi yuborilganda hosil bo'ladigan beqaror kislota:", javob: "Karbonat kislota (H₂CO₃)", variantlar: ["Karbonat kislota (H₂CO₃)", "Sulfat kislota (H₂SO₄)", "Xlorid kislota (HCl)", "Nitrat kislota (HNO₃)"] },
    { manba: "Bahorgi ko'kat — shovul va otquloq barglariga nordon ta'm beruvchi kislota:", javob: "Shovul (oksalat) kislotasi", variantlar: ["Nitrat kislota", "Shovul (oksalat) kislotasi", "Sut kislotasi", "Chumoli kislotasi"] },
]

function TabiiyManbaOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = MANBA_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">1-o'yin: Tabiiy va Texnik Kislota Manbasini Toping</h3>
                    <p className="text-sm text-slate-400">Har bir tabiiy yoki texnik jarayonda qaysi kislota ishtirok etadi?</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    Ball: {ball} | {idx + 1}/{MANBA_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.manba}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
                            setIdx((i) => (i + 1) % MANBA_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
                    >
                        Keyingi savol →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 2-O'YIN: KISLOTA PASPORTI (FORMULA, NEGIZLILIK, KISLOROD)
// ============================================================
const PASPORT_SAVOLLAR = [
    { savol: "Ortofosfat kislotaning (H₃PO₄) negizliligi va kislota qoldig'i valentligi nechaga teng?", javob: "3 negizli (PO₄ qoldig'i III valentli)", variantlar: ["3 negizli (PO₄ qoldig'i III valentli)", "4 negizli (IV valentli)", "1 negizli (I valentli)", "2 negizli (II valentli)"] },
    { savol: "Quyidagilardan qaysi biri KISLORODSIZ kislotalar qatoriga kiradi?", javob: "HCl, H₂S, HBr, HF", variantlar: ["H₂SO₄, HNO₃, H₃PO₄", "HCl, H₂S, HBr, HF", "H₂CO₃, H₂SO₃, H₂SiO₃", "HNO₂, HClO₄"] },
    { savol: "Sulfat kislota (H₂SO₄) qaysi kislotali oksidning suv bilan birikishidan hosil bo'ladi?", javob: "SO₃ + H₂O → H₂SO₄", variantlar: ["P₂O₅ + H₂O → H₂SO₄", "SO₂ + H₂O → H₂SO₄", "SO₃ + H₂O → H₂SO₄", "CO₂ + H₂O → H₂SO₄"] },
    { savol: "Nitrat kislota (HNO₃) tarkibidagi NO₃ kislota qoldig'ining valentligi nechaga teng?", javob: "I valentli (chunki 1 ta H atomi bor)", variantlar: ["II valentli", "III valentli", "IV valentli", "I valentli (chunki 1 ta H atomi bor)"] },
    { savol: "Vodorod sulfid kislotaning (H₂S) negizliligi va turi qanday?", javob: "2 negizli, kislorodsiz kislota", variantlar: ["2 negizli, kislorodsiz kislota", "3 negizli, kislorodli", "2 negizli, kislorodli", "1 negizli, kislorodli"] },
    { savol: "Barcha kislotalarning suvli eritmasida nordon ta'm va umumiy xossalarni beruvchi ion qaysi?", javob: "Vodorod kationi (H⁺)", variantlar: ["Gidroksid anioni (OH⁻)", "Vodorod kationi (H⁺)", "Natriy kationi (Na⁺)", "Xlorid anioni (Cl⁻)"] },
]

function KislotaPasportiOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = PASPORT_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">2-o'yin: Kislota Pasporti — Formula va Valentlik</h3>
                    <p className="text-sm text-slate-400">Kislotalarning negizliligi va tarkibini aniqlang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    Ball: {ball} | {idx + 1}/{PASPORT_SAVOLLAR.length}
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
                            setIdx((i) => (i + 1) % PASPORT_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                    >
                        Keyingi pasport →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 3-O'YIN: LABORATORIYA REAKSIYALARI VA XAVFSIZLIK
// ============================================================
const REAKSIYA_SAVOLLAR = [
    { vazifa: "Konsentrlangan sulfat kislotani (H₂SO₄) suyultirishning yagona xavfsiz qoidasi qaysi?", javob: "Sovuq suv ustiga kislotani ingichka oqim bilan aralashtirib quyish kerak", variantlar: ["Sovuq suv ustiga kislotani ingichka oqim bilan aralashtirib quyish kerak", "Qaynoq suvga quyish kerak", "Aralashtirmasdan yopiq idishda chayqatish kerak", "Kislota ustiga suvni birdan quyish kerak"] },
    { vazifa: "Rux metali ustiga xlorid kislota quyilganda (Zn + 2HCl) qaysi gaz ajralib chiqadi?", javob: "Vodorod gazi (H₂↑)", variantlar: ["Kislorod (O₂↑)", "Vodorod gazi (H₂↑)", "Karbonat angidrid (CO₂↑)", "Xlor (Cl₂↑)"] },
    { vazifa: "Qaysi metall suyultirilgan xlorid kislota (HCl) bilan reaksiyaga KIRISHMAYDI?", javob: "Mis (Cu)", variantlar: ["Rux (Zn)", "Temir (Fe)", "Mis (Cu)", "Magniy (Mg)"] },
    { vazifa: "Bo'r yoki marmar (CaCO₃) ustiga kislota tomizilganda vijillab qaysi gaz chiqadi?", javob: "Karbonat angidrid (CO₂↑)", variantlar: ["Vodorod (H₂↑)", "Azot (N₂↑)", "Kislorod (O₂↑)", "Karbonat angidrid (CO₂↑)"] },
    { vazifa: "Teriga kislota tomchisi sachraganda birinchi tibbiy yordam qanday ko'rsatiladi?", javob: "Ko'p oqar suv bilan yuvib, so'ng 2% li ichimlik sodasi (NaHCO₃) eritmasi surtiladi", variantlar: ["Ko'p oqar suv bilan yuvib, so'ng 2% li ichimlik sodasi (NaHCO₃) eritmasi surtiladi", "Ustiga o'yuvchi ishqor (NaOH) quyiladi", "Spirt bilan kuydiriladi", "Quruq latta bilan ishqalanadi"] },
]

function LaboratoriyaXavfsizlikOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = REAKSIYA_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">3-o'yin: Kislotalar Reaksiyasi va Texnika Xavfsizligi</h3>
                    <p className="text-sm text-slate-400">Laboratoriya tajribasi natijasini to'g'ri toping</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold">
                    Ball: {ball} | {idx + 1}/{REAKSIYA_SAVOLLAR.length}
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
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-rose-400'
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
                            setIdx((i) => (i + 1) % REAKSIYA_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
                    >
                        Keyingi tajriba →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH)
// ============================================================
const DUEL_5_1 = [
    { savol: "Sulfat kislotaning kimyoviy formulasi qaysi?", variantlar: ["H₂SO₄", "H₂S", "HNO₃", "H₂SO₃"], javob: 0 },
    { savol: "Qaysi kislota 3 negizli kislota hisoblanadi?", variantlar: ["H₂SO₄", "H₃PO₄", "HNO₃", "HCl"], javob: 1 },
    { savol: "Inson oshqozon shirasida qaysi kislota mavjud?", variantlar: ["Fosfat kislota (H₃PO₄)", "Nitrat kislota (HNO₃)", "Xlorid kislota (HCl)", "Sulfat kislota (H₂SO₄)"], javob: 2 },
    { savol: "P₂O₅ + 3H₂O reaksiyasida qaysi kislota hosil bo'ladi?", variantlar: ["H₂SO₄", "2HNO₃", "H₂CO₃", "2H₃PO₄"], javob: 3 },
    { savol: "Zn + 2HCl → ZnCl₂ + ? reaksiyasida qaysi gaz ajraladi?", variantlar: ["H₂↑", "CO₂↑", "Cl₂↑", "O₂↑"], javob: 0 },
    { savol: "Qatiq va kefir tarkibida qaysi organik kislota bor?", variantlar: ["Limon kislotasi", "Sut kislotasi", "Chumoli kislotasi", "Shovul kislotasi"], javob: 1 },
]

function JamoalarDueli5_1() {
    const [idx, setIdx] = useState(0)
    const [ball1, setBall1] = useState(0)
    const [ball2, setBall2] = useState(0)
    const [navbat, setNavbat] = useState(1)
    const [natija, setNatija] = useState(null)

    const xomJoriy = DUEL_5_1[idx]
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
                            setIdx((i) => (i + 1) % DUEL_5_1.length)
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
// ASOSIY KOMPONENT: MAVZU 5.1
// ============================================================
export default function Mavzu5_1() {
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
        { nom: "1. Tabiiy kislotalar", ikon: 'tomchi' },
        { nom: "2. H⁺ va Kislota qoldig'i", ikon: 'atom' },
        { nom: "3. Oksid + H₂O → Kislota", ikon: 'kolba' },
        { nom: "4. Kislota + Metall (H₂↑)", ikon: 'chaqmoq' },
        { nom: "5. H₂SO₄ suyultirish qoidasi", ikon: 'qalqon' },
        { nom: "6. Bo'r + Kislota (CO₂↑)", ikon: 'kristall' },
    ]

    const oyinlar = [
        { nom: "1. Tabiiy Manbani Top", ikon: 'yulduz' },
        { nom: "2. Kislota Pasporti", ikon: 'kitob' },
        { nom: "3. Xavfsizlik va Reaksiya", ikon: 'qalqon' },
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
                mavzuRaqam="5.1"
                mavzuNom="Kislotalar"
                bobNom="5-bob. Kislotalar va asoslar"
                sahifa={76}
                oldingiRaqam="4.3"
                asosiyBolim={asosiyBolim}
                setAsosiyBolim={setAsosiyBolim}
                toliqEkran={toliqEkran}
                toliqEkranniUlash={toliqEkranniUlash}
            />

            {asosiyBolim === 'takrorlash' && (
                <OtganDarsniTakrorlash
                    oldingiRaqam="4.3"
                    oldingiNom="Kundalik hayotda foydalaniladigan moddalar va ularning xossalari"
                    savollar={TAKROPI_4_3}
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

                    {faolKorgazma === 0 && <TabiiyKislotalarCanvas />}
                    {faolKorgazma === 1 && <MineralKislotalarCanvas />}
                    {faolKorgazma === 2 && <KislotaTasnifiCanvas />}
                    {faolKorgazma === 3 && <KislotaMetallCanvas />}
                    {faolKorgazma === 4 && <KislotaSuyultirishCanvas />}
                    {faolKorgazma === 5 && <KislotaKarbonatCanvas />}
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

                    {faolOyin === 0 && <TabiiyManbaOyini />}
                    {faolOyin === 1 && <KislotaPasportiOyini />}
                    {faolOyin === 2 && <LaboratoriyaXavfsizlikOyini />}
                    {faolOyin === 3 && <JamoalarDueli5_1 />}
                </div>
            )}
        </div>
    )
}
