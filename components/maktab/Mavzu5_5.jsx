'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 5-BOB, 5.5-MAVZU
// "Neytrallanish reaksiyasi" (Darslik 88-bet)
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

const TAKROPI_5_4 = [
    {
        savol: "Toza distillangan suvning (neytral muhitning) pH ko'rsatkichi nechaga teng?",
        variantlar: ["pH = 0", "pH = 7", "pH = 10", "pH = 14"],
        togriJavob: "pH = 7",
        izoh: "Neytral muhitda H⁺ va OH⁻ ionlari konsentratsiyasi teng bo'lib, pH = 7.0 bo'ladi."
    },
    {
        savol: "pH < 7 va pH > 7 bo'lgan eritmalar qanday muhitga ega bo'ladi?",
        variantlar: [
            "pH < 7 — Kislotali muhit, pH > 7 — Ishqoriy muhit",
            "pH < 7 — Ishqoriy muhit, pH > 7 — Kislotali muhit",
            "Ikkalasi ham neytral",
            "pH < 7 — Qattiq, pH > 7 — Gaz"
        ],
        togriJavob: "pH < 7 — Kislotali muhit, pH > 7 — Ishqoriy muhit",
        izoh: "0 dan 7 gacha kislotali (H⁺ ko'p), 7 dan 14 gacha esa ishqoriy (OH⁻ ko'p) muhit hisoblanadi."
    },
    {
        savol: "Kislotali (nordon, pH = 4.5) tuproqning unumdorligini yaxshilash uchun tuproqqa nima solinadi?",
        variantlar: [
            "Ohaktosh (CaCO₃) yoki so'ndirilgan ohak Ca(OH)₂",
            "Sulfat kislota (H₂SO₄)",
            "Osh tuzi (NaCl)",
            "Kvars qumi (SiO₂)"
        ],
        togriJavob: "Ohaktosh (CaCO₃) yoki so'ndirilgan ohak Ca(OH)₂",
        izoh: "Agronomiyada nordon tuproqlarni neytrallash jarayoni 'tuproqni ohaklash' deyiladi."
    }
]

// ============================================================
// 1-KO'RGAZMA: TITRLASH SIMULYATORI (NaOH + FENOLFTALEIN + HCl)
// ============================================================
function TitrlashByuretkaCanvas() {
    const [hclMl, setHclMl] = useState(0) // 0 dan 30 ml gacha; 20 ml = ekvivalent nuqta!
    const canvasRef = useRef(null)

    const ph = hclMl < 18
        ? (13 - hclMl * 0.2).toFixed(1)
        : hclMl < 20
        ? '8.5'
        : hclMl === 20
        ? '7.0 (NEYTRAL!)'
        : (3.5 - (hclMl - 20) * 0.15).toFixed(1)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Byuretka (yuqorida)
        ctx.strokeStyle = '#94A3B8'
        ctx.lineWidth = 3
        ctx.strokeRect(268, 25, 24, 95)

        // Byuretkadagi HCl sathi
        const sathH = Math.max(8, 88 - hclMl * 2.6)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)'
        ctx.fillRect(270, 27 + (88 - sathH), 20, sathH)

        // Konussimon kolba (pastda)
        ctx.strokeStyle = '#E2E8F0'
        ctx.lineWidth = 3.5
        ctx.beginPath()
        ctx.moveTo(260, 138)
        ctx.lineTo(260, 165)
        ctx.lineTo(205, 245)
        ctx.lineTo(355, 245)
        ctx.lineTo(300, 165)
        ctx.lineTo(300, 138)
        ctx.stroke()

        // Kolbadagi eritma rangi (Fenolftalein: <20 ml malina, >=20 ml rangsiz!)
        const malinaAlpha = hclMl < 20 ? Math.max(0.18, 0.85 - hclMl * 0.03) : 0
        ctx.fillStyle = hclMl < 20
            ? `rgba(236, 72, 153, ${malinaAlpha})`
            : 'rgba(226, 232, 240, 0.22)'

        ctx.beginPath()
        ctx.moveTo(222, 195)
        ctx.lineTo(208, 242)
        ctx.lineTo(352, 242)
        ctx.lineTo(338, 195)
        ctx.closePath()
        ctx.fill()

        // Yozuvlar
        ctx.textAlign = 'left'
        ctx.fillStyle = '#38BDF8'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillText(`Byuretkadan quyilgan HCl: ${hclMl} ml`, 35, 65)
        ctx.fillStyle = '#FACC15'
        ctx.fillText(`Kolbadagi NaOH: 20 ml`, 35, 92)
        ctx.fillStyle = hclMl === 20 ? '#10B981' : hclMl < 20 ? '#EC4899' : '#F43F5E'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.fillText(`Joriy pH = ${ph}`, 35, 122)

        ctx.textAlign = 'center'
        ctx.fillStyle = hclMl === 20 ? '#10B981' : '#FFFFFF'
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText(
            hclMl < 20
                ? "Ishqor (NaOH) hali ortiqcha — eritma MALINA rangda (pH > 7)"
                : hclMl === 20
                ? "EKVIVALENT NUQTA (20 ml HCl)! Eritma RANGSIZLANDI: NaOH + HCl → NaCl + H₂O (pH = 7.0)"
                : "Kislota (HCl) ortib ketdi — eritma rangsiz, ammo muhit kislotali (pH < 7) bo'lib qoldi!",
            280,
            274
        )
    }, [hclMl, ph])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">1. Titrlash tajribasi: NaOH + HCl → NaCl (tuz) + H₂O (suv)</h3>
                    <p className="text-sm text-slate-400 font-serif">20 ml NaOH + fenolftalein (malina rang) ustiga byuretkadan tomchilatib HCl quying va 20 ml da rangsizlanishini tuting!</p>
                </div>
                <span className={`px-3.5 py-1 rounded-xl font-bold font-serif text-sm border ${
                    hclMl === 20
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                        : 'bg-pink-500/20 border-pink-400 text-pink-200'
                }`}>
                    HCl = {hclMl} ml | pH = {ph}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={290} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-3 font-serif">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <label className="block text-sm font-bold text-slate-200 mb-2">
                            Byuretka jo'mragini boshqaring (0 ml → 20 ml → 30 ml):
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={30}
                            step={2}
                            value={hclMl}
                            onChange={(e) => { tovushChiqar('click'); setHclMl(Number(e.target.value)) }}
                            className="w-full accent-emerald-400 cursor-pointer"
                        />
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => { tovushChiqar('click'); setHclMl(0) }}
                                className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300"
                            >
                                0 ml (Boshiga)
                            </button>
                            <button
                                onClick={() => { tovushChiqar('success'); setHclMl(20) }}
                                className="flex-1 py-2 rounded-lg bg-emerald-500/25 border border-emerald-400 text-xs font-bold text-emerald-200"
                            >
                                20 ml (Aniq Neytral!)
                            </button>
                        </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        <strong>Ta'rif:</strong> Kislota va asos o'rtasida tuz hamda suv hosil bo'lishi bilan boradigan almashinish reaksiyasi <strong className="text-emerald-400">neytrallanish reaksiyasi</strong> deyiladi.
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 2-KO'RGAZMA: IONLI MEXANIZM (H⁺ + OH⁻ → H₂O + Q) VA TUZ KRISTALLANISHI
// ============================================================
function IonNeytrallanishMexanizmCanvas() {
    const [bosqich, setBosqich] = useState(0) // 0 = oldin, 1 = H+ + OH- -> H2O, 2 = bug'latib NaCl olish
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

            if (bosqich === 0) {
                // Alohida ionlar: H+, Cl-, Na+, OH-
                const ionlar = [
                    { belgi: 'H⁺', x: 140, y: 120, rang: '#E11D48' },
                    { belgi: 'Cl⁻', x: 140, y: 185, rang: '#10B981' },
                    { belgi: 'OH⁻', x: 420, y: 120, rang: '#2563EB' },
                    { belgi: 'Na⁺', x: 420, y: 185, rang: '#F59E0B' },
                ]
                ionlar.forEach((ion) => {
                    ctx.fillStyle = ion.rang
                    ctx.beginPath()
                    ctx.arc(ion.x, ion.y + Math.sin(t * 2) * 5, 26, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.fillStyle = '#FFFFFF'
                    ctx.font = 'bold 16px "Times New Roman", serif'
                    ctx.textAlign = 'center'
                    ctx.fillText(ion.belgi, ion.x, ion.y + 5 + Math.sin(t * 2) * 5)
                })
            } else if (bosqich === 1) {
                // H+ va OH- birikib H2O molekulasini hosil qildi (+Q issiqlik!)
                ctx.fillStyle = '#0284C7'
                ctx.strokeStyle = '#38BDF8'
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(280, 120, 38, 0, Math.PI * 2)
                ctx.fill()
                ctx.stroke()
                ctx.fillStyle = '#FFFFFF'
                ctx.font = 'bold 17px "Times New Roman", serif'
                ctx.textAlign = 'center'
                ctx.fillText('H₂O + Q↑', 280, 126)

                // Na+ va Cl- eritmada suzib yuribdi
                ctx.fillStyle = '#F59E0B'
                ctx.beginPath(); ctx.arc(220, 195, 24, 0, Math.PI * 2); ctx.fill()
                ctx.fillStyle = '#FFFFFF'; ctx.fillText('Na⁺', 220, 200)

                ctx.fillStyle = '#10B981'
                ctx.beginPath(); ctx.arc(340, 195, 24, 0, Math.PI * 2); ctx.fill()
                ctx.fillStyle = '#FFFFFF'; ctx.fillText('Cl⁻', 340, 200)
            } else {
                // Suv bug'latilganda chinni kosachada oq NaCl tuzi kristallari qoladi!
                ctx.fillStyle = '#F8FAFC'
                ctx.strokeStyle = '#94A3B8'
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.roundRect(180, 150, 200, 60, [0, 0, 45, 45])
                ctx.fill()
                ctx.stroke()

                ctx.fillStyle = '#0F172A'
                ctx.font = 'bold 17px "Times New Roman", serif'
                ctx.textAlign = 'center'
                ctx.fillText('Oq NaCl tuzi kristallari!', 280, 185)
            }

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(
                bosqich === 0
                    ? "1-qadam: Eritmada H⁺, Cl⁻ va Na⁺, OH⁻ ionlari uchrashishga tayyor"
                    : bosqich === 1
                    ? "2-qadam: H⁺ + OH⁻ → H₂O + Q (Issiqlik chiqadi — ekzotermik reaksiya!)"
                    : "3-qadam: Suv bug'latilsa, idish tubida oq osh tuzi (NaCl) kristallari qoladi!",
                280,
                36
            )

            animId = requestAnimationFrame(chiz)
        }
        chiz()
        return () => cancelAnimationFrame(animId)
    }, [bosqich])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">2. Neytrallanishning molekulyar siri: H⁺ + OH⁻ → H₂O + Q</h3>
                    <p className="text-sm text-slate-400 font-serif">Nima uchun neytrallanish reaksiyasida probirka isiydi va tuzni qanday ajratib olamiz?</p>
                </div>
                <div className="flex gap-2 font-serif">
                    {[
                        { id: 0, nom: '1. Ionlar uchrashuvi' },
                        { id: 1, nom: '2. H⁺ + OH⁻ → H₂O + Q' },
                        { id: 2, nom: '3. Bug\'latib NaCl olish' },
                    ].map((b) => (
                        <button
                            key={b.id}
                            onClick={() => { tovushChiqar('click'); setBosqich(b.id) }}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm border ${
                                bosqich === b.id
                                    ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                        >
                            {b.nom}
                        </button>
                    ))}
                </div>
            </div>

            <canvas ref={canvasRef} width={560} height={275} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
        </div>
    )
}

// ============================================================
// 3-KO'RGAZMA: TUZ HOSIL QILISH KONSTRUKTORI (ASOS + KISLOTA → TUZ + SUV)
// ============================================================
const TUZ_REAKSIYALAR = [
    { id: 'nacl', asos: 'NaOH', kislota: 'HCl', tenglama: 'NaOH + HCl → NaCl + H₂O', tuzNom: 'Natriy xlorid (Osh tuzi)', izoh: '1 ta OH⁻ va 1 ta H⁺ birikib 1 molekula H₂O hosil qiladi.' },
    { id: 'k2so4', asos: '2KOH', kislota: 'H₂SO₄', tenglama: '2KOH + H₂SO₄ → K₂SO₄ + 2H₂O', tuzNom: 'Kaliy sulfat (mineral o\'g\'it)', izoh: 'H₂SO₄ ikki negizli bo\'lgani uchun 2 molekula KOH bilan reaksiyaga kirishib, 2 molekula suv hosil qiladi!' },
    { id: 'cano3', asos: 'Ca(OH)₂', kislota: '2HNO₃', tenglama: 'Ca(OH)₂ + 2HNO₃ → Ca(NO₃)₂ + 2H₂O', tuzNom: 'Kalsiy nitrat (Kalsiyli selitra)', izoh: 'Ca(OH)₂ dagi 2 ta OH⁻ guruhni neytrallash uchun 2 molekula HNO₃ sarflanadi.' },
    { id: 'na3po4', asos: '3NaOH', kislota: 'H₃PO₄', tenglama: '3NaOH + H₃PO₄ → Na₃PO₄ + 3H₂O', tuzNom: 'Natriy ortofosfat', izoh: 'Uch negizli H₃PO₄ to\'liq neytrallanishi uchun 3 molekula NaOH talab etiladi va 3H₂O chiqadi.' },
]

function TuzKonstruktorCanvas() {
    const [tanlangan, setTanlangan] = useState(TUZ_REAKSIYALAR[1])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Bloklar: ASOS + KISLOTA -> TUZ + SUV
        const bloklar = [
            { ust: 'ASOS', matn: tanlangan.asos, x: 40, rang: '#1D4ED8' },
            { ust: 'KISLOTA', matn: tanlangan.kislota, x: 175, rang: '#BE123C' },
            { ust: 'TUZ', matn: tanlangan.tenglama.split('→ ')[1].split(' + ')[0], x: 330, rang: '#047857' },
            { ust: 'SUV', matn: tanlangan.tenglama.split(' + ').pop(), x: 455, rang: '#0369A1' },
        ]

        bloklar.forEach((b) => {
            ctx.fillStyle = b.rang
            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(b.x, 95, 85, 85, 14)
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = '#CBD5E1'
            ctx.font = 'bold 11px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(b.ust, b.x + 42, 118)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.fillText(b.matn, b.x + 42, 152)
        })

        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 24px "Times New Roman", serif'
        ctx.fillText('+', 150, 145)
        ctx.fillText('→', 295, 145)
        ctx.fillText('+', 435, 145)

        ctx.font = 'bold 18px "Times New Roman", serif'
        ctx.fillText(tanlangan.tenglama, 280, 42)

        ctx.fillStyle = '#38BDF8'
        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText(`Hosil bo'lgan tuz: ${tanlangan.tuzNom}`, 280, 235)
    }, [tanlangan])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">3. Stexiometriya: Kislota + Asos → Tuz + Suv tenglamalari</h3>
                <p className="text-sm text-slate-400 font-serif">Reaksiyada vodorod atomlari (H) soni bilan gidroksoguruhlar (OH) soni tenglashishi shart!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <canvas ref={canvasRef} width={560} height={275} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    {TUZ_REAKSIYALAR.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => { tovushChiqar('click'); setTanlangan(r) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                                tanlangan.id === r.id
                                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{r.tenglama}</div>
                            <div className="text-xs text-emerald-300">{r.tuzNom}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {tanlangan.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 4-KO'RGAZMA: SUVDA ERIMAYDIGAN ASOS + KISLOTA (Cu(OH)₂ + 2HCl)
// ============================================================
function ErimaydiganAsosNeytrallanishCanvas() {
    const [kislotaQuyildi, setKislotaQuyildi] = useState(false)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Probirka
        ctx.fillStyle = kislotaQuyildi ? 'rgba(6, 182, 212, 0.38)' : 'rgba(148, 163, 184, 0.14)'
        ctx.beginPath()
        ctx.roundRect(225, 95, 110, 140, [0, 0, 48, 48])
        ctx.fill()

        if (!kislotaQuyildi) {
            // Quyuq moviy Cu(OH)2 cho'kmasi
            ctx.fillStyle = '#0284C7'
            ctx.beginPath()
            ctx.roundRect(228, 175, 104, 58, [10, 10, 45, 45])
            ctx.fill()
        }

        ctx.strokeStyle = '#E2E8F0'
        ctx.lineWidth = 3.5
        ctx.beginPath()
        ctx.roundRect(223, 60, 114, 177, [0, 0, 50, 50])
        ctx.stroke()

        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 17px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText("Cu(OH)₂↓ (moviy cho'kma) + 2HCl → CuCl₂ (tiniq eritma) + 2H₂O", 280, 34)

        ctx.fillStyle = kislotaQuyildi ? '#10B981' : '#38BDF8'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillText(
            kislotaQuyildi
                ? "Cho'kma to'liq erib ketdi! Demak, bu yerda indikatorsiz ham neytrallanish borganini ko'ramiz!"
                : "Suvda erimaydigan Cu(OH)₂ cho'kmasi ustiga HCl kislota quyib ko'ring!",
            280,
            268
        )
    }, [kislotaQuyildi])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">4. Suvda erimaydigan asoslar ham kislota bilan neytrallanadimi?</h3>
                    <p className="text-sm text-slate-400 font-serif">Ishqor + kislota reaksiyasida indikator kerak bo'lsa, cho'kma + kislotada cho'kmaning erib ketishi belgi bo'ladi!</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('success'); setKislotaQuyildi(!kislotaQuyildi) }}
                    className={`px-4 py-2 rounded-xl font-bold font-serif text-sm border ${
                        kislotaQuyildi
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-sky-500 text-slate-950 border-sky-400'
                    }`}
                >
                    {kislotaQuyildi ? "Qaytadan Cu(OH)₂ cho'kmasini solish" : "+ Ustiga HCl kislota quyish"}
                </button>
            </div>

            <canvas ref={canvasRef} width={560} height={285} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
        </div>
    )
}

// ============================================================
// 5-KO'RGAZMA: TIBBIYOT — OSHQOZON JIG'ILDON QAYNASHI VA ANTATSID DORI
// ============================================================
function OshqozonAntatsidCanvas() {
    const [doriIchildi, setDoriIchildi] = useState(false)
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Oshqozon konturi
        ctx.fillStyle = doriIchildi ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.35)'
        ctx.strokeStyle = doriIchildi ? '#10B981' : '#EF4444'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(280, 145, 72, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(doriIchildi ? 'pH = 3.5 (Me\'yor!)' : 'Ortiqcha HCl! (pH = 0.9)', 280, 142)
        ctx.font = '13px "Times New Roman", serif'
        ctx.fillText(doriIchildi ? 'MgCl₂ + 2H₂O' : 'Jig\'ildon qaynamoqda!', 280, 165)

        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 17px "Times New Roman", serif'
        ctx.fillText("Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O   yoki   Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O", 280, 34)

        ctx.fillStyle = '#CBD5E1'
        ctx.font = '14px "Times New Roman", serif'
        ctx.fillText("Antatsid dorilar tarkibidagi Mg(OH)₂ va Al(OH)₃ oshqozondagi ortiqcha HCl kislotani muloyim neytrallaydi!", 280, 268)
    }, [doriIchildi])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">5. Tibbiyotda neytrallanish: Jig'ildon qaynashi va Antatsid dorilar</h3>
                    <p className="text-sm text-slate-400 font-serif">Oshqozonda xlorid kislota (HCl) ko'payib ketganda Mg(OH)₂ va Al(OH)₃ saqlovchi dorilar yordamga keladi</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('success'); setDoriIchildi(!doriIchildi) }}
                    className={`px-4 py-2 rounded-xl font-bold font-serif text-sm border ${
                        doriIchildi
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-rose-500 text-white border-rose-400'
                    }`}
                >
                    {doriIchildi ? "Qaytadan ortiqcha HCl holati" : "+ Antatsid dori — Mg(OH)₂ yuborish"}
                </button>
            </div>

            <canvas ref={canvasRef} width={560} height={285} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
        </div>
    )
}

// ============================================================
// 6-KO'RGAZMA: HASHAROT CHAQISHI KIMYOSI (ASALARI VS QOVOQARI)
// ============================================================
const HASHAROTLAR = [
    {
        id: 'asalari',
        nom: 'Asalari va Chumoli chaqishi',
        zahar: 'KISLOTALI ZAHAR (Chumoli kislotasi — HCOOH, pH ≈ 3)',
        davo: 'Ichimlik sodasi (NaHCO₃) yoki sovunli suv (ishqoriy muhit) surtiladi!',
        rang: '#F59E0B',
        izoh: 'Asalari va chumoli chaqqanda teri ostiga kislota yuboradi. Uni neytrallash uchun kuchsiz ishqoriy eritma — ichimlik sodasi (NaHCO₃) surtiladi!'
    },
    {
        id: 'qovoqari',
        nom: 'Qovoqari (Osa) chaqishi',
        zahar: 'ISHQORIY ZAHAR (pH ≈ 10)',
        davo: 'Suyultirilgan sirka (CH₃COOH) yoki limon sharbati (kislotali muhit) surtiladi!',
        rang: '#38BDF8',
        izoh: 'Qovoqari (sariq-qora ari) zahari ishqoriy bo\'ladi! Shuning uchun unga soda emas, aksincha limon sharbati yoki olma sirkasi surtib neytrallanadi!'
    }
]

function HasharotChaqishiCanvas() {
    const [tanlov, setTanlov] = useState(HASHAROTLAR[0])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#070D19'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Chap blok: Zahar turi
        ctx.fillStyle = '#1E293B'
        ctx.strokeStyle = tanlov.rang
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(35, 85, 220, 110, 16)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = tanlov.rang
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.textAlign = 'center'
        ctx.fillText(tanlov.nom, 145, 122)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 13px "Times New Roman", serif'
        ctx.fillText(tanlov.id === 'asalari' ? 'Zahar: KISLOTA (H⁺)' : 'Zahar: ISHQOR (OH⁻)', 145, 155)

        // O'ng blok: Neytrallovchi vosita
        ctx.fillStyle = '#064E3B'
        ctx.strokeStyle = '#10B981'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(305, 85, 220, 110, 16)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#34D399'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillText('Birinchi yordam (Neytrallash):', 415, 122)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 14px "Times New Roman", serif'
        ctx.fillText(tanlov.id === 'asalari' ? 'Ichimlik sodasi (NaHCO₃)' : 'Limon yoki Sirka (CH₃COOH)', 415, 155)

        ctx.fillStyle = '#FACC15'
        ctx.font = 'bold 28px "Times New Roman", serif'
        ctx.fillText('+', 280, 148)

        ctx.font = 'bold 15px "Times New Roman", serif'
        ctx.fillText(tanlov.davo, 280, 248)
    }, [tanlov])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">6. Birinchi tibbiy yordam: Asalari (kislota) va Qovoqari (ishqor) chaqqanda</h3>
                    <p className="text-sm text-slate-400 font-serif">Nima uchun asalari chaqqanda ichimlik sodasi, qovoqari chaqqanda esa sirka surtiladi?</p>
                </div>
                <div className="flex gap-2 font-serif">
                    {HASHAROTLAR.map((h) => (
                        <button
                            key={h.id}
                            onClick={() => { tovushChiqar('click'); setTanlov(h) }}
                            className={`px-3.5 py-1.5 rounded-xl font-bold text-sm border ${
                                tanlov.id === h.id
                                    ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                        >
                            {h.nom}
                        </button>
                    ))}
                </div>
            </div>

            <canvas ref={canvasRef} width={560} height={275} className="w-full rounded-xl border border-slate-800 bg-slate-950" />
        </div>
    )
}

// ============================================================
// 1-O'YIN: TUZ FORMULASINI TOP (ASOS + KISLOTA → TUZ + SUV)
// ============================================================
const TUZ_SAVOLLAR = [
    { reaksiya: "NaOH + HCl → ? + H₂O", javob: "NaCl (Natriy xlorid)", variantlar: ["NaCl (Natriy xlorid)", "Na₂SO₄", "NaNO₃", "NaOH"] },
    { reaksiya: "2KOH + H₂SO₄ → ? + 2H₂O", javob: "K₂SO₄ (Kaliy sulfat)", variantlar: ["KCl", "K₂SO₄ (Kaliy sulfat)", "KNO₃", "K₂CO₃"] },
    { reaksiya: "Ca(OH)₂ + 2HNO₃ → ? + 2H₂O", javob: "Ca(NO₃)₂ (Kalsiy nitrat)", variantlar: ["CaCl₂", "CaSO₄", "Ca(NO₃)₂ (Kalsiy nitrat)", "CaCO₃"] },
    { reaksiya: "Cu(OH)₂ + H₂SO₄ → ? + 2H₂O", javob: "CuSO₄ (Mis (II) sulfat)", variantlar: ["CuCl₂", "CuSO₄ (Mis (II) sulfat)", "CuO", "Cu(NO₃)₂"] },
    { reaksiya: "3NaOH + H₃PO₄ → ? + 3H₂O", javob: "Na₃PO₄ (Natriy fosfat)", variantlar: ["Na₃PO₄ (Natriy fosfat)", "NaCl", "Na₂SO₄", "NaNO₃"] },
    { reaksiya: "Mg(OH)₂ + 2HCl → ? + 2H₂O", javob: "MgCl₂ (Magniy xlorid)", variantlar: ["MgSO₄", "MgCl₂ (Magniy xlorid)", "MgO", "MgCO₃"] },
]

function TuzTopishOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = TUZ_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">1-o'yin: Neytrallanish Mahsuloti — Tuzni Toping</h3>
                    <p className="text-sm text-slate-400">Asosning metali va kislotaning qoldig'idan hosil bo'ladigan tuzni belgilang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    Ball: {ball} | {idx + 1}/{TUZ_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-4">
                <div className="text-2xl font-bold text-amber-400">{joriy.reaksiya}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {joriy.variantlar.map((v) => (
                    <button
                        key={v}
                        onClick={() => tekshir(v)}
                        className={`p-4 rounded-xl border text-left font-bold transition-all ${
                            !tanlov
                                ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-emerald-400'
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
                            setIdx((i) => (i + 1) % TUZ_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                    >
                        Keyingi reaksiya →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 2-O'YIN: TITRLASH VA STEXIOMETRIYA SINOVI
// ============================================================
const TITRLASH_SAVOLLAR = [
    { savol: "NaOH va fenolftalein (malina rang) eritmasiga HCl tomchilatib quyilganda reaksiya to'liq tugaganini qanday bilamiz?", javob: "Malina rang yo'qolib, eritma to'liq rangsizlanganda (pH = 7)", variantlar: ["Eritma qora bo'lganda", "Malina rang yo'qolib, eritma to'liq rangsizlanganda (pH = 7)", "Cho'kma tushganda", "Gaz portlaganda"] },
    { savol: "1 molekula sulfat kislotani (H₂SO₄) to'liq neytrallash uchun necha molekula KOH kerak bo'ladi?", javob: "2 molekula KOH (chunki H₂SO₄ ikki negizli)", variantlar: ["1 molekula KOH", "2 molekula KOH (chunki H₂SO₄ ikki negizli)", "3 molekula KOH", "4 molekula KOH"] },
    { savol: "Neytrallanish reaksiyasida issiqlik ajraladimi yoki yutiladimi?", javob: "Issiqlik ajraladi (+Q, ekzotermik reaksiya)", variantlar: ["Issiqlik ajraladi (+Q, ekzotermik reaksiya)", "Issiqlik yutiladi (-Q)", "Harorat -50°C ga tushadi", "Energiya o'zgarmaydi"] },
    { savol: "Nima uchun Cu(OH)₂ + 2HCl → CuCl₂ + 2H₂O reaksiyasida fenolftalein indikatori qo'shish shart emas?", javob: "Chunki havorang Cu(OH)₂ cho'kmasining erib ketishi reaksiyaning borganini o'zi ko'rsatadi!", variantlar: ["Chunki reaksiya bormaydi", "Chunki havorang Cu(OH)₂ cho'kmasining erib ketishi reaksiyaning borganini o'zi ko'rsatadi!", "Chunki Cu(OH)₂ gazdir", "Chunki HCl rangli"] },
    { savol: "NaOH + HCl reaksiyasidan hosil bo'lgan rangsiz eritmadagi suv chinni kosachada bug'latilsa nima qoladi?", javob: "Oq rangli osh tuzi (NaCl) kristallari", variantlar: ["Hech narsa qolmaydi", "Oq rangli osh tuzi (NaCl) kristallari", "Qora ko'mir", "Suyuq simob"] },
]

function TitrlashSinovOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = TITRLASH_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">2-o'yin: Titrlash va Stexiometriya Sinovi</h3>
                    <p className="text-sm text-slate-400">Laboratoriya titrlash jarayonining qonuniyatlarini toping</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    Ball: {ball} | {idx + 1}/{TITRLASH_SAVOLLAR.length}
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
                            setIdx((i) => (i + 1) % TITRLASH_SAVOLLAR.length)
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
// 3-O'YIN: HAYOTDA NEYTRALLANISH TEZ YORDAMI
// ============================================================
const TEZ_YORDAM_SAVOLLAR = [
    { vazifa: "Asalari yoki chumoli chaqqanda (kislotali zahar — HCOOH) achishishni neytrallash uchun teriga nima surtiladi?", javob: "Ichimlik sodasi (NaHCO₃) bo'tqasi (kuchsiz ishqoriy)", variantlar: ["Sirka kislotasi", "Ichimlik sodasi (NaHCO₃) bo'tqasi (kuchsiz ishqoriy)", "Limon sharbati", "Osh tuzi"] },
    { vazifa: "Qovoqari (osa) chaqqanda uning zahari ISHQORIY bo'lgani uchun nima bilan neytrallanadi?", javob: "Limon sharbati yoki suyultirilgan sirka kislotasi bilan", variantlar: ["Ichimlik sodasi bilan", "Limon sharbati yoki suyultirilgan sirka kislotasi bilan", "O'yuvchi natriy bilan", "Sovun bilan"] },
    { vazifa: "Oshqozonda xlorid kislota (HCl) ko'payib jig'ildon qaynaganda ichiladigan antatsid dorilar tarkibida qaysi asoslar bo'ladi?", javob: "Mg(OH)₂ va Al(OH)₃", variantlar: ["NaOH va KOH (o'yuvchi ishqorlar)", "Mg(OH)₂ va Al(OH)₃", "H₂SO₄ va HNO₃", "CuO va Fe₂O₃"] },
    { vazifa: "Laboratoriyada qo'lga ishqor (NaOH) eritmasi sachraganda ko'p suv bilan yuvgandan so'ng nima bilan neytrallanadi?", javob: "2% li borat kislota yoki kuchsiz sirka/limon kislotasi eritmasi bilan", variantlar: ["Konsentrlangan H₂SO₄ bilan", "2% li borat kislota yoki kuchsiz sirka/limon kislotasi eritmasi bilan", "Ichimlik sodasi bilan", "Ohakli suv bilan"] },
]

function TezYordamOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = TEZ_YORDAM_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">3-o'yin: Kundalik Hayotda Neytrallanish Tez Yordami</h3>
                    <p className="text-sm text-slate-400">Tibbiyot va birinchi yordamda neytrallanish reaksiyasini qo'llang</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold">
                    Ball: {ball} | {idx + 1}/{TEZ_YORDAM_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.vazifa}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4">
                {joriy.variantlar.map((v) => (
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
                            setIdx((i) => (i + 1) % TEZ_YORDAM_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
                    >
                        Keyingi holat →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 4-O'YIN: JAMOALAR DUELI (1-GURUH VS 2-GURUH)
// ============================================================
const DUEL_5_5 = [
    { savol: "Kislota va asos orasida tuz va suv hosil bo'lish reaksiyasi nima deyiladi?", variantlar: ["Neytrallanish reaksiyasi", "Yonish reaksiyasi", "Parchalanish reaksiyasi", "Sublimatsiya"], javob: 0 },
    { savol: "Neytrallanish reaksiyasining qisqa ionli mohiyati qaysi?", variantlar: ["H⁺ + OH⁻ → H₂O", "2H₂ + O₂ → 2H₂O", "Na⁺ + Cl⁻ → NaCl", "C + O₂ → CO₂"], javob: 0 },
    { savol: "KOH + HNO₃ reaksiyasida suv bilan birga qaysi tuz hosil bo'ladi?", variantlar: ["KCl", "KNO₃ (Kaliy nitrat)", "K₂SO₄", "K₂CO₃"], javob: 1 },
    { savol: "1 mol H₃PO₄ ni to'liq neytrallash uchun necha mol NaOH kerak?", variantlar: ["1 mol", "2 mol", "3 mol", "4 mol"], javob: 2 },
    { savol: "NaOH + HCl to'liq neytrallanganda eritmaning pH ko'rsatkichi nechaga teng bo'ladi?", variantlar: ["pH = 1", "pH = 7", "pH = 12", "pH = 14"], javob: 1 },
    { savol: "Titrlashda suyuqlik hajmini tomchilatib aniq o'lchab quyadigan shisha asbob nima deyiladi?", variantlar: ["Byuretka", "Shtativ", "Tigelda", "Voronka"], javob: 0 },
]

function JamoalarDueli5_5() {
    const [idx, setIdx] = useState(0)
    const [ball1, setBall1] = useState(0)
    const [ball2, setBall2] = useState(0)
    const [navbat, setNavbat] = useState(1)
    const [natija, setNatija] = useState(null)

    const joriy = DUEL_5_5[idx]

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
                            setIdx((i) => (i + 1) % DUEL_5_5.length)
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
// ASOSIY KOMPONENT: MAVZU 5.5
// ============================================================
export default function Mavzu5_5() {
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
        { nom: "1. Titrlash (Byuretka)", ikon: 'kolba' },
        { nom: "2. H⁺ + OH⁻ → H₂O + Q", ikon: 'atom' },
        { nom: "3. Tuz + Suv Konstruktori", ikon: 'kristall' },
        { nom: "4. Cu(OH)₂↓ + 2HCl erishi", ikon: 'tomchi' },
        { nom: "5. Oshqozon va Antatsid", ikon: 'qalqon' },
        { nom: "6. Asalari vs Qovoqari", ikon: 'yulduz' },
    ]

    const oyinlar = [
        { nom: "1. Tuz Formulasini Top", ikon: 'kristall' },
        { nom: "2. Titrlash Sinovi", ikon: 'kolba' },
        { nom: "3. Neytrallanish Tez Yordam", ikon: 'qalqon' },
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
                mavzuRaqam="5.5"
                mavzuNom="Neytrallanish reaksiyasi"
                bobNom="5-bob. Kislotalar va asoslar"
                sahifa={88}
                oldingiRaqam="5.4"
                asosiyBolim={asosiyBolim}
                setAsosiyBolim={setAsosiyBolim}
                toliqEkran={toliqEkran}
                toliqEkranniUlash={toliqEkranniUlash}
            />

            {asosiyBolim === 'takrorlash' && (
                <OtganDarsniTakrorlash
                    oldingiRaqam="5.4"
                    oldingiNom="pH ko'rsatkichi"
                    savollar={TAKROPI_5_4}
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

                    {faolKorgazma === 0 && <TitrlashByuretkaCanvas />}
                    {faolKorgazma === 1 && <IonNeytrallanishMexanizmCanvas />}
                    {faolKorgazma === 2 && <TuzKonstruktorCanvas />}
                    {faolKorgazma === 3 && <ErimaydiganAsosNeytrallanishCanvas />}
                    {faolKorgazma === 4 && <OshqozonAntatsidCanvas />}
                    {faolKorgazma === 5 && <HasharotChaqishiCanvas />}
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

                    {faolOyin === 0 && <TuzTopishOyini />}
                    {faolOyin === 1 && <TitrlashSinovOyini />}
                    {faolOyin === 2 && <TezYordamOyini />}
                    {faolOyin === 3 && <JamoalarDueli5_5 />}
                </div>
            )}
        </div>
    )
}
