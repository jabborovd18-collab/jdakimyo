'use client'
// ============================================================
// JDA KIMYO V4 — 7-SINF, 5-BOB, 5.2-MAVZU
// "Asoslar" (Darslik 80-bet)
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

const TAKROPI_5_1 = [
    {
        savol: "Barcha kislotalarning suvli eritmasida nordon ta'm beruvchi va lakmusni qizartiruvchi zarracha qaysi?",
        variantlar: ["Vodorod kationi (H⁺)", "Gidroksid anioni (OH⁻)", "Xlorid ioni (Cl⁻)", "Kislorod atomi (O)"],
        togriJavob: "Vodorod kationi (H⁺)",
        izoh: "Kislotalar suvda eriganda musbat zaryadli vodorod kationlarini (H⁺) hosil qiladi."
    },
    {
        savol: "Konsentrlangan sulfat kislotani (H₂SO₄) suv bilan suyultirishning to'g'ri va xavfsiz qoidasi qaysi?",
        variantlar: [
            "Farqi yo'q",
            "Suv ustiga kislotani ingichka oqim bilan aralashtirib quyish",
            "Kislota ustiga suvni birdan quyish",
            "Yopiq probirkada qaynagan suv bilan chayqatish",
        ],
        togriJavob: "Suv ustiga kislotani ingichka oqim bilan aralashtirib quyish",
        izoh: "Avval suv, keyin kislota! Kislotaga suv quyilsa, yengil suv sirtda qaynab, kislotani atrofga sachratadi."
    },
    {
        savol: "Ortofosfat kislota (H₃PO₄) necha negizli kislota hisoblanadi?",
        variantlar: ["1 negizli", "2 negizli", "3 negizli", "4 negizli"],
        togriJavob: "3 negizli",
        izoh: "H₃PO₄ molekulasida metallga almashinishi mumkin bo'lgan 3 ta vodorod atomi bo'lgani uchun 3 negizli kislotadir."
    }
]

// ============================================================
// 1-KO'RGAZMA: ASOSLAR TUZILISHI — Me(OH)ₙ VA VALENTLIK
// ============================================================
const ASOSLAR_ROYXATI = [
    { id: 'NaOH', formula: 'NaOH', nom: 'Natriy gidroksid (O\'yuvchi natriy)', metall: 'Na⁺ (I)', ohSoni: 1, rang: '#38BDF8', izoh: 'Natriy I valentli bo\'lgani uchun bitta I valentli gidroksoguruh (-OH) birikadi. Sovun, qog\'oz va to\'qimachilik sanoatida ishlatiladi.' },
    { id: 'KOH', formula: 'KOH', nom: 'Kaliy gidroksid (O\'yuvchi kaliy)', metall: 'K⁺ (I)', ohSoni: 1, rang: '#A855F7', izoh: 'Kuchli suvda eriydigan ishqor. Suyuq sovun va ishqoriy batareyalar (akkumulyatorlar) ishlab chiqarishda qo\'llaniladi.' },
    { id: 'CaOH2', formula: 'Ca(OH)₂', nom: 'Kalsiy gidroksid (So\'ndirilgan ohak)', metall: 'Ca²⁺ (II)', ohSoni: 2, rang: '#E2E8F0', izoh: 'Kalsiy II valentli bo\'lgani uchun (OH) guruhi qavsga olinib, pastiga 2 indeksi yoziladi: Ca(OH)₂.' },
    { id: 'CuOH2', formula: 'Cu(OH)₂', nom: 'Mis (II) gidroksid', metall: 'Cu²⁺ (II)', ohSoni: 2, rang: '#0EA5E9', izoh: 'Mis o\'zgaruvchan valentli bo\'lgani uchun nomida valentligi Rim raqami bilan ko\'rsatiladi: Mis (II) gidroksid.' },
    { id: 'FeOH3', formula: 'Fe(OH)₃', nom: 'Temir (III) gidroksid', metall: 'Fe³⁺ (III)', ohSoni: 3, rang: '#D97706', izoh: 'Temir III valentli holatida 3 ta (-OH) guruhini biriktiradi: Fe(OH)₃ — qo\'ng\'ir-zang rangli suvda erimaydigan asos.' },
]

function AsosTuzilishiCanvas() {
    const [asos, setAsos] = useState(ASOSLAR_ROYXATI[2]) // Ca(OH)2
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

            // Markazda Metall atomi
            const cx = 215
            const cy = 148
            ctx.fillStyle = asos.rang
            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.arc(cx, cy, 46, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = '#0F172A'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(asos.metall, cx, cy + 6)

            // O'ng tomonda OH- gidroksoguruhlar
            for (let i = 0; i < asos.ohSoni; i++) {
                const ox = 385
                const oy = (asos.ohSoni === 1 ? 148 : asos.ohSoni === 2 ? 105 + i * 86 : 82 + i * 66) + Math.sin(t * 2 + i) * 5

                // Bog' chizig'i
                ctx.strokeStyle = '#38BDF8'
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.moveTo(cx + 44, cy)
                ctx.lineTo(ox - 32, oy)
                ctx.stroke()

                // OH guruhi kapsulasi
                ctx.fillStyle = '#1D4ED8'
                ctx.strokeStyle = '#60A5FA'
                ctx.lineWidth = 2.5
                ctx.beginPath()
                ctx.roundRect(ox - 32, oy - 22, 72, 44, 22)
                ctx.fill()
                ctx.stroke()

                ctx.fillStyle = '#FFFFFF'
                ctx.font = 'bold 16px "Times New Roman", serif'
                ctx.fillText('OH⁻ (I)', ox + 4, oy + 5)
            }

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.fillText(`Umumiy formula: Me(OH)ₙ   →   ${asos.formula} (${asos.nom})`, 280, 34)

            ctx.fillStyle = '#38BDF8'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(`Gidroksoguruh (-OH) doim I valentli! Metall valentligi = ${asos.ohSoni} → OH guruhlari soni = ${asos.ohSoni}`, 280, 276)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [asos])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">1. Asoslarning umumiy formulasi: Me(OH)ₙ va Gidroksoguruh</h3>
                <p className="text-sm text-slate-400 font-serif">Metall atomi va bir yoki bir nechta I valentli gidroksoguruhlardan (-OH) tashkil topgan murakkab moddalar asoslar deyiladi</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={295} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    {ASOSLAR_ROYXATI.map((a) => (
                        <button
                            key={a.id}
                            onClick={() => { tovushChiqar('click'); setAsos(a) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                asos.id === a.id
                                    ? 'bg-sky-500/20 border-sky-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <span className="font-bold text-sm">{a.formula} — {a.nom}</span>
                            <span className="text-xs text-sky-300 font-bold">n = {a.ohSoni}</span>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {asos.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 2-KO'RGAZMA: ISHQORLAR (SUVDA ERIYDIGAN) VS ERIMAYDIGAN ASOSLAR
// ============================================================
const ERUVCHANLIK_ASOSLAR = [
    { id: 'NaOH', formula: 'NaOH', tur: 'ISHQOR (Suvda yaxshi eriydi)', eriydi: true, rang: '#38BDF8', izoh: 'Suvda to\'liq erib, Na⁺ va OH⁻ ionlariga ajraladi. Qo\'lga tekkanda sovundek silliq tuyuladi va terini o\'yadi ("o\'yuvchi natriy")!' },
    { id: 'KOH', formula: 'KOH', tur: 'ISHQOR (Suvda yaxshi eriydi)', eriydi: true, rang: '#818CF8', izoh: 'Ishqoriy metall gidroksidi — suvda juda yaxshi eriydi va havodan namlikni yutadi (gigroskopik).' },
    { id: 'CaOH2', formula: 'Ca(OH)₂', tur: 'ISHQOR (Kam eriydi — Ohakli suv)', eriydi: true, rang: '#E2E8F0', izoh: 'Ishqoriy-yer metali gidroksidi. Tiniq eritmasi "ohakli suv", quyuq oq suspenziyasi esa "ohak suti" deyiladi.' },
    { id: 'CuOH2', formula: 'Cu(OH)₂↓', tur: 'SUVDA ERIMAYDIGAN ASOS', eriydi: false, rang: '#0284C7', izoh: 'Havorang (moviy) iviq cho\'kma! Suvda erimaydi va stakan tubiga cho\'kadi.' },
    { id: 'FeOH3', formula: 'Fe(OH)₃↓', tur: 'SUVDA ERIMAYDIGAN ASOS', eriydi: false, rang: '#B45309', izoh: 'Qo\'ng\'ir-qizg\'ish (zang rangli) cho\'kma! Suvda umuman erimaydi.' },
    { id: 'AlOH3', formula: 'Al(OH)₃↓', tur: 'SUVDA ERIMAYDIGAN ASOS (Amfoter)', eriydi: false, rang: '#F8FAFC', izoh: 'Oq jelatinsimon cho\'kma. Suvda erimaydi, ammo ham kislotada, ham ishqorda eriydi!' },
]

function IshqorEruvchanlikCanvas() {
    const [namuna, setNamuna] = useState(ERUVCHANLIK_ASOSLAR[0])
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

            // Stakan
            ctx.fillStyle = 'rgba(56, 189, 248, 0.16)'
            ctx.fillRect(170, 95, 220, 145)
            ctx.strokeStyle = '#64748B'
            ctx.lineWidth = 3.5
            ctx.strokeRect(170, 65, 220, 175)

            if (namuna.eriydi) {
                // Erkin suzib yurgan OH- ionlari
                for (let i = 0; i < 10; i++) {
                    const ix = 200 + ((i * 39 + Math.sin(t + i) * 18) % 160)
                    const iy = 115 + (i % 4) * 28 + Math.cos(t + i) * 6
                    ctx.fillStyle = '#2563EB'
                    ctx.beginPath()
                    ctx.arc(ix, iy, 13, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.fillStyle = '#FFFFFF'
                    ctx.font = 'bold 10px "Times New Roman", serif'
                    ctx.textAlign = 'center'
                    ctx.fillText('OH⁻', ix, iy + 3)
                }
            } else {
                // Stakan tubida rangli cho'kma
                ctx.fillStyle = namuna.rang
                ctx.beginPath()
                ctx.roundRect(176, 198, 208, 38, 10)
                ctx.fill()
                ctx.fillStyle = namuna.id === 'AlOH3' ? '#0F172A' : '#FFFFFF'
                ctx.font = 'bold 15px "Times New Roman", serif'
                ctx.textAlign = 'center'
                ctx.fillText(`Cho'kma: ${namuna.formula}`, 280, 222)
            }

            ctx.fillStyle = namuna.eriydi ? '#10B981' : '#F59E0B'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(`${namuna.formula} — ${namuna.tur}`, 280, 36)

            ctx.fillStyle = '#CBD5E1'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(
                namuna.eriydi
                    ? "Ishqorlar (LiOH, NaOH, KOH, Ba(OH)₂, Ca(OH)₂) suvda erib OH⁻ ionlarini beradi!"
                    : "Boshqa metallarning gidroksidlari suvda erimaydi va rangli cho'kma hosil qiladi.",
                280,
                274
            )

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [namuna])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">2. Asoslarning 2 guruhi: Ishqorlar va Suvda erimaydigan asoslar</h3>
                <p className="text-sm text-slate-400 font-serif">Suvda eriydigan asoslar "ishqorlar" deyiladi (I A va II A guruhning faol metall gidroksidlari)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={295} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    <div className="grid grid-cols-2 gap-2">
                        {ERUVCHANLIK_ASOSLAR.map((a) => (
                            <button
                                key={a.id}
                                onClick={() => { tovushChiqar('click'); setNamuna(a) }}
                                className={`p-2.5 rounded-xl border text-left transition-all ${
                                    namuna.id === a.id
                                        ? 'bg-sky-500/20 border-sky-400 text-white'
                                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                            >
                                <div className="font-bold text-sm">{a.formula}</div>
                                <div className={`text-xs font-bold ${a.eriydi ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {a.eriydi ? 'Ishqor (Eriydi)' : 'Cho\'kma'}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {namuna.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 3-KO'RGAZMA: ISHQORLARNING OLINISHI (FAOL METALL YOKI OKSID + SUV)
// ============================================================
const ISHQOR_USULLARI = [
    { id: 'na_suv', nom: '1-usul: Faol metall + Suv (2Na + 2H₂O)', tenglama: '2Na + 2H₂O → 2NaOH (ishqor) + H₂↑', gaz: true, izoh: 'Ishqoriy metallar (Li, Na, K) va Ca, Ba suv bilan bevosita reaksiyaga kirishib, ishqor eritmasi hamda vodorod gazini (H₂↑) hosil qiladi!' },
    { id: 'na2o_suv', nom: '2-usul: Asosli oksid + Suv (Na₂O + H₂O)', tenglama: 'Na₂O + H₂O → 2NaOH', gaz: false, izoh: 'Faol metallarning oksidlari (Li₂O, Na₂O, K₂O, CaO, BaO) suv bilan birikib to\'g\'ridan-to\'g\'ri ishqor hosil qiladi.' },
    { id: 'cao_suv', nom: 'Sanoat usuli: Ohakni so\'ndirish (CaO + H₂O)', tenglama: 'CaO + H₂O → Ca(OH)₂ + Q (issiqlik)', gaz: false, izoh: 'So\'ndirilmagan ohak (CaO) suvga solinganda ko\'p issiqlik chiqarib so\'ndirilgan ohak — Ca(OH)₂ hosil qiladi.' },
]

function IshqorOlinishiCanvas() {
    const [usul, setUsul] = useState(ISHQOR_USULLARI[0])
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

            // Kristallizator idish
            ctx.fillStyle = 'rgba(59, 130, 246, 0.28)'
            ctx.fillRect(140, 135, 280, 95)
            ctx.strokeStyle = '#64748B'
            ctx.lineWidth = 3.5
            ctx.strokeRect(140, 95, 280, 135)

            if (usul.gaz) {
                // Suv yuzida yugurib yurgan Na sharigi va H2 pufaklari
                const nx = 280 + Math.sin(t * 2.5) * 75
                ctx.fillStyle = '#E2E8F0'
                ctx.beginPath()
                ctx.arc(nx, 135, 14, 0, Math.PI * 2)
                ctx.fill()
                ctx.fillStyle = '#0F172A'
                ctx.font = 'bold 12px "Times New Roman", serif'
                ctx.textAlign = 'center'
                ctx.fillText('Na', nx, 139)

                for (let i = 0; i < 8; i++) {
                    ctx.fillStyle = '#FACC15'
                    ctx.beginPath()
                    ctx.arc(nx + Math.cos(t * 3 + i) * 22, 118 - (i * 5), 4, 0, Math.PI * 2)
                    ctx.fill()
                }
            } else {
                // Oksid suvda erib OH- tarqatmoqda
                ctx.fillStyle = '#F8FAFC'
                ctx.beginPath()
                ctx.roundRect(240, 195, 80, 28, 8)
                ctx.fill()
            }

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(usul.tenglama, 280, 38)

            ctx.fillStyle = '#38BDF8'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText("DIQQAT: CuO va Fe₂O₃ suvda ERIMAYDI, shuning uchun ulardan suv qo'shib asos olib bo'lmaydi!", 280, 272)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [usul])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">3. Ishqorlarning olinishi: Faol metall + Suv va Asosli oksid + Suv</h3>
                <p className="text-sm text-slate-400 font-serif">Faqat suvda eriydigan ishqorlarni metall yoki uning oksidiga suv ta'sir ettirib olish mumkin</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={290} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2.5 font-serif">
                    {ISHQOR_USULLARI.map((u) => (
                        <button
                            key={u.id}
                            onClick={() => { tovushChiqar('click'); setUsul(u) }}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                                usul.id === u.id
                                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{u.nom}</div>
                            <div className="text-xs text-emerald-300">{u.tenglama}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {usul.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 4-KO'RGAZMA: SUVDA ERIMAYDIGAN ASOSLAR SINTEZI (TUZ + ISHQOR → CHO'KMA↓)
// ============================================================
const CHOKMA_REAKSIYALAR = [
    { id: 'cu', nom: 'Mis (II) gidroksid — Moviy cho\'kma', tenglama: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄', rang: '#0284C7', eritmaRang: 'rgba(14, 165, 233, 0.25)', izoh: 'Mis (II) sulfat eritmasiga o\'yuvchi natriy (NaOH) tomizilsa, yorqin havorang (moviy) iviq Cu(OH)₂↓ cho\'kmasi tushadi!' },
    { id: 'fe3', nom: 'Temir (III) gidroksid — Qo\'ng\'ir cho\'kma', tenglama: 'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl', rang: '#B45309', eritmaRang: 'rgba(245, 158, 11, 0.22)', izoh: 'Temir (III) xlorid eritmasiga NaOH quyilsa, zang rangli qo\'ng\'ir-qizg\'ish Fe(OH)₃↓ cho\'kmasi hosil bo\'ladi.' },
    { id: 'fe2', nom: 'Temir (II) gidroksid — Yashilroq cho\'kma', tenglama: 'FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄', rang: '#15803D', eritmaRang: 'rgba(74, 222, 128, 0.18)', izoh: 'Temir (II) tuzlariga ishqor qo\'shilganda och-yashil Fe(OH)₂↓ cho\'kmasi tushadi (havoda tezda qo\'ng\'ir Fe(OH)₃ ga aylanadi).' },
    { id: 'mg', nom: 'Magniy gidroksid — Oq cho\'kma', tenglama: 'MgCl₂ + 2NaOH → Mg(OH)₂↓ + 2NaCl', rang: '#F8FAFC', eritmaRang: 'rgba(226, 232, 240, 0.15)', izoh: 'Magniy tuzlariga ishqor ta\'sir ettirilganda sutdek oppoq Mg(OH)₂↓ cho\'kmasi tushadi.' },
]

function ChokmaAsosSinteziCanvas() {
    const [reaksiya, setReaksiya] = useState(CHOKMA_REAKSIYALAR[0])
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

            // Probirka
            const px = 280
            ctx.fillStyle = reaksiya.eritmaRang
            ctx.beginPath()
            ctx.roundRect(px - 45, 95, 90, 145, [0, 0, 42, 42])
            ctx.fill()

            ctx.strokeStyle = '#94A3B8'
            ctx.lineWidth = 3.5
            ctx.beginPath()
            ctx.roundRect(px - 48, 55, 96, 188, [0, 0, 45, 45])
            ctx.stroke()

            // Cho'kayotgan iviq zarrachalar
            ctx.fillStyle = reaksiya.rang
            for (let i = 0; i < 14; i++) {
                const zx = px - 30 + ((i * 13) % 60)
                const zy = 105 + ((t * 25 + i * 11) % 105)
                ctx.beginPath()
                ctx.arc(zx, zy, 7, 0, Math.PI * 2)
                ctx.fill()
            }

            // Tubdagi cho'kma
            ctx.beginPath()
            ctx.roundRect(px - 42, 195, 84, 44, [8, 8, 40, 40])
            ctx.fill()

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(reaksiya.tenglama, 280, 32)

            ctx.fillStyle = '#CBD5E1'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText("Qoida: Suvda erimaydigan asoslarni olish uchun ERUVCHAN TUZ + ISHQOR reaksiyasi o'tkaziladi!", 280, 272)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [reaksiya])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-serif">4. Suvda erimaydigan asoslarning olinishi va sifat ranglari</h3>
                <p className="text-sm text-slate-400 font-serif">CuO suvda erimagani uchun Cu(OH)₂ ni CuSO₄ eritmasiga NaOH qo'shib cho'ktirib olamiz</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-7">
                    <div className="overflow-x-auto w-0 min-w-full">
                      <canvas ref={canvasRef} width={560} height={290} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-2 font-serif">
                    {CHOKMA_REAKSIYALAR.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => { tovushChiqar('click'); setReaksiya(r) }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                                reaksiya.id === r.id
                                    ? 'bg-sky-500/20 border-sky-400 text-white'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="font-bold text-sm">{r.nom}</div>
                            <div className="text-xs text-sky-400">{r.tenglama}</div>
                        </button>
                    ))}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                        {reaksiya.izoh}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// 5-KO'RGAZMA: ERIMAYDIGAN ASOSLARNING QIZDIRILGANDA PARCHALANISHI
// ============================================================
function AsosTermikParchalanishCanvas() {
    const [qizdirish, setQizdirish] = useState(false)
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

            // Probirka
            ctx.strokeStyle = '#94A3B8'
            ctx.lineWidth = 3.5
            ctx.beginPath()
            ctx.roundRect(215, 70, 130, 145, [0, 0, 50, 50])
            ctx.stroke()

            // Modda: Moviy Cu(OH)2 yoki Qora CuO
            ctx.fillStyle = qizdirish ? '#1E293B' : '#0284C7'
            ctx.beginPath()
            ctx.roundRect(221, 155, 118, 55, [8, 8, 44, 44])
            ctx.fill()

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 15px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText(qizdirish ? 'Qora CuO kukuni' : 'Moviy Cu(OH)₂', 280, 187)

            if (qizdirish) {
                // Gorelka alangasi
                ctx.fillStyle = '#F97316'
                ctx.beginPath()
                ctx.arc(280, 240, 18 + Math.sin(t * 4) * 3, 0, Math.PI * 2)
                ctx.fill()

                // Suv bug'i tomchilari
                for (let i = 0; i < 8; i++) {
                    ctx.fillStyle = '#38BDF8'
                    ctx.beginPath()
                    ctx.arc(250 + (i % 4) * 20, 135 - ((t * 25 + i * 12) % 60), 4, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            ctx.fillStyle = qizdirish ? '#FACC15' : '#38BDF8'
            ctx.font = 'bold 17px "Times New Roman", serif'
            ctx.fillText(
                qizdirish
                    ? "Cu(OH)₂ (moviy) → CuO (qora oksid) + H₂O↑ (suv bug'i)"
                    : "Moviy Cu(OH)₂ cho'kmasini spirtlampada qizdirib ko'ring!",
                280,
                36
            )

            ctx.fillStyle = '#CBD5E1'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText("Erimaydigan asoslar qizdirilganda OKSID va SUVGA parchalanadi (NaOH va KOH parchalanmaydi!)", 280, 276)

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [qizdirish])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">5. Termik parchalanish: Cu(OH)₂ → CuO (qora) + H₂O</h3>
                    <p className="text-sm text-slate-400 font-serif">Suvda erimaydigan asoslar qizdirilganda asosli oksid va suvga parchalanadi</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('click'); setQizdirish(!qizdirish) }}
                    className={`px-4 py-2 rounded-xl font-bold font-serif text-sm border transition-all ${
                        qizdirish
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-sky-500/20 text-sky-300 border-sky-400'
                    }`}
                >
                    {qizdirish ? "Alangani o'chirish (Qaytarish)" : "Spirtlampada qizdirish (T°C)"}
                </button>
            </div>

            <div className="overflow-x-auto w-0 min-w-full">
              <canvas ref={canvasRef} width={560} height={290} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
            </div>
        </div>
    )
}

// ============================================================
// 6-KO'RGAZMA: OHAKLI SUV VA CO₂ REAKSIYASI (Ca(OH)₂ + CO₂ → CaCO₃↓)
// ============================================================
function OhakliSuvTestCanvas() {
    const [puflash, setPuflash] = useState(true)
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

            // Stakan
            ctx.fillStyle = puflash ? 'rgba(241, 245, 249, 0.72)' : 'rgba(56, 189, 248, 0.18)'
            ctx.fillRect(185, 115, 190, 125)
            ctx.strokeStyle = '#94A3B8'
            ctx.lineWidth = 3.5
            ctx.strokeRect(185, 75, 190, 165)

            // Naycha
            ctx.strokeStyle = '#38BDF8'
            ctx.lineWidth = 5
            ctx.beginPath()
            ctx.moveTo(280, 45)
            ctx.lineTo(280, 210)
            ctx.stroke()

            if (puflash) {
                for (let i = 0; i < 12; i++) {
                    const bx = 260 + ((i * 11) % 40)
                    const by = 210 - ((t * 35 + i * 10) % 90)
                    ctx.fillStyle = '#FFFFFF'
                    ctx.beginPath()
                    ctx.arc(bx, by, 5, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            ctx.fillStyle = '#FACC15'
            ctx.font = 'bold 16px "Times New Roman", serif'
            ctx.textAlign = 'center'
            ctx.fillText("Ca(OH)₂ (tiniq ohakli suv) + CO₂ → CaCO₃↓ (oq loyqa) + H₂O", 280, 32)

            ctx.fillStyle = puflash ? '#10B981' : '#94A3B8'
            ctx.font = 'bold 14px "Times New Roman", serif'
            ctx.fillText(
                puflash
                    ? "Ohakli suv oqarib loyqalandi! Bu CO₂ gazini aniqlashning eng ishonchli sifat reaksiyasidir."
                    : "Tiniq ohakli suv Ca(OH)₂ — naycha orqali CO₂ yuborib ko'ring!",
                280,
                272
            )

            animId = kadrSora(canvas, chiz)
        }
        chiz()
        return () => kadrniBekorQil(animId)
    }, [puflash])

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white font-serif">6. Ohakli suvning CO₂ gazi ta'sirida loyqalanishi</h3>
                    <p className="text-sm text-slate-400 font-serif">Nafas chiqarganimizda CO₂ borligini tiniq ohakli suvga puflab isbotlash mumkin</p>
                </div>
                <button
                    onClick={() => { tovushChiqar('click'); setPuflash(!puflash) }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold font-serif text-sm"
                >
                    {puflash ? "Tiniq holatga qaytarish" : "Naychadan CO₂ yuborish"}
                </button>
            </div>

            <div className="overflow-x-auto w-0 min-w-full">
              <canvas ref={canvasRef} width={560} height={285} className="w-full min-w-[520px] rounded-xl border border-slate-800 bg-slate-950" />
            </div>
        </div>
    )
}

// ============================================================
// 1-O'YIN: ISHQORMI YOKI SUVDA ERIMAYDIGAN ASOS?
// ============================================================
const TASNIF_ASOS_SAVOLLAR = [
    { nom: "NaOH — Natriy gidroksid (O'yuvchi natriy)", ishqor: true, izoh: "I A guruh ishqoriy metali gidroksidi — suvda juda yaxshi eriydigan kuchli ishqor!" },
    { nom: "Cu(OH)₂ — Mis (II) gidroksid", ishqor: false, izoh: "Havorang (moviy) cho'kma — suvda erimaydigan asos!" },
    { nom: "KOH — Kaliy gidroksid (O'yuvchi kaliy)", ishqor: true, izoh: "Suvda yaxshi eriydigan kuchli ishqor." },
    { nom: "Fe(OH)₃ — Temir (III) gidroksid", ishqor: false, izoh: "Qo'ng'ir-zang rangli cho'kma — suvda erimaydigan asos." },
    { nom: "Ba(OH)₂ — Bariy gidroksid (Barit suvi)", ishqor: true, izoh: "II A guruh faol metali gidroksidi — suvda eriydigan ishqor." },
    { nom: "Al(OH)₃ — Alyuminiy gidroksid", ishqor: false, izoh: "Oq jelatinsimon cho'kma — suvda erimaydi." },
    { nom: "LiOH — Litiy gidroksid", ishqor: true, izoh: "Ishqoriy metall gidroksidi — suvda eriydigan ishqor." },
    { nom: "Fe(OH)₂ — Temir (II) gidroksid", ishqor: false, izoh: "Yashilroq cho'kma — suvda erimaydigan asos." },
]

function IshqorTasnifOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [javob, setJavob] = useState(null)

    const joriy = TASNIF_ASOS_SAVOLLAR[idx]

    const tanla = (qiymat) => {
        if (javob !== null) return
        setJavob(qiymat)
        if (qiymat === joriy.ishqor) {
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
                    <h3 className="text-xl font-bold text-white">1-o'yin: Ishqormi yoki Suvda Erimaydigan Asos?</h3>
                    <p className="text-sm text-slate-400">Berilgan gidroksid suvda eriydimi (ishqor) yoki cho'kmaga tushadimi?</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    Ball: {ball} | {idx + 1}/{TASNIF_ASOS_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-4">
                <div className="text-2xl font-bold text-amber-400">{joriy.nom}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                    onClick={() => tanla(true)}
                    className="p-4 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400 text-sky-200 font-bold text-lg"
                >
                    ISHQOR (Suvda eriydi)
                </button>
                <button
                    onClick={() => tanla(false)}
                    className="p-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-200 font-bold text-lg"
                >
                    ERIMAYDIGAN ASOS (Cho'kma↓)
                </button>
            </div>

            {javob !== null && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-200">{joriy.izoh}</p>
                    <button
                        onClick={() => {
                            tovushChiqar('click')
                            setJavob(null)
                            setIdx((i) => (i + 1) % TASNIF_ASOS_SAVOLLAR.length)
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
// 2-O'YIN: Me(OH)ₙ FORMULA KONSTRUKTORI
// ============================================================
const FORMULA_ASOS_SAVOLLAR = [
    { nom: "Temir (III) gidroksidning to'g'ri kimyoviy formulasini toping:", javob: "Fe(OH)₃", variantlar: ["Fe(OH)₃", "Fe₃OH", "FeOH", "Fe(OH)₂"] },
    { nom: "Kalsiy gidroksid (so'ndirilgan ohak) formulasini toping:", javob: "Ca(OH)₂", variantlar: ["CaOH", "Ca(OH)₂", "Ca₂OH", "CaO"] },
    { nom: "Kaliy gidroksid (o'yuvchi kaliy) formulasini toping:", javob: "KOH", variantlar: ["Ca(OH)₂", "NaOH", "KOH", "K(OH)₂"] },
    { nom: "Mis (I) gidroksid va Mis (II) gidroksid formulalari juftligini toping:", javob: "CuOH va Cu(OH)₂", variantlar: ["Cu₂OH va CuOH", "Cu(OH)₂ va Cu(OH)₃", "CoOH va Co(OH)₂", "CuOH va Cu(OH)₂"] },
    { nom: "Alyuminiy gidroksidning to'g'ri formulasi qaysi (Al — III valentli)?", javob: "Al(OH)₃", variantlar: ["Al(OH)₃", "Al₃(OH)", "AlOH", "Al(OH)₂"] },
    { nom: "Asoslar tarkibidagi gidroksoguruh (-OH) ning valentligi doim nechaga teng?", javob: "I valentli", variantlar: ["O'zgaruvchan", "I valentli", "II valentli", "III valentli"] },
]

function FormulaKonstruktorOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = FORMULA_ASOS_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">2-o'yin: Me(OH)ₙ Formula Konstruktori</h3>
                    <p className="text-sm text-slate-400">Metall valentligiga qarab gidroksid formulasini tuzing</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    Ball: {ball} | {idx + 1}/{FORMULA_ASOS_SAVOLLAR.length}
                </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-lg font-bold text-white">{joriy.nom}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
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
                            setIdx((i) => (i + 1) % FORMULA_ASOS_SAVOLLAR.length)
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                    >
                        Keyingi formula →
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 3-O'YIN: RANGLI CHO'KMALAR VA ASOSLAR REAKSIYALARI
// ============================================================
const CHOKMA_OYIN_SAVOLLAR = [
    { savol: "Mis (II) sulfat eritmasiga (CuSO₄) o'yuvchi natriy (NaOH) qo'shilganda qanday rangli cho'kma tushadi?", javob: "Havorang (moviy) Cu(OH)₂↓ cho'kmasi", variantlar: ["Havorang (moviy) Cu(OH)₂↓ cho'kmasi", "Qo'ng'ir Fe(OH)₃↓ cho'kmasi", "Oq Mg(OH)₂↓ cho'kmasi", "Qora CuO cho'kmasi"] },
    { savol: "Moviy rangli Cu(OH)₂ cho'kmasi qizdirilganda qanday moddalarga parchalanadi?", javob: "Qora rangli CuO va H₂O ga", variantlar: ["Toza Cu va O₂ ga", "Qora rangli CuO va H₂O ga", "CuSO₄ va H₂ ga", "Parchalanmaydi"] },
    { savol: "Tiniq ohakli suv — Ca(OH)₂ orqali karbonat angidrid (CO₂) o'tkazilsa nima kuzatiladi?", javob: "Oq rangli CaCO₃↓ cho'kmasi tushib, eritma loyqalanadi", variantlar: ["O'zgarish bo'lmaydi", "Eritma qizil rangga kiradi", "Oq rangli CaCO₃↓ cho'kmasi tushib, eritma loyqalanadi", "Vodorod gazi chiqadi"] },
    { savol: "Nima uchun Mis (II) oksidga (CuO) suv qo'shib Cu(OH)₂ olib bo'lmaydi?", javob: "Chunki CuO suvda erimaydi va suv bilan reaksiyaga kirishmaydi", variantlar: ["Chunki CuO kislotali oksid", "Chunki portlab ketadi", "Chunki CuO gaz modda", "Chunki CuO suvda erimaydi va suv bilan reaksiyaga kirishmaydi"] },
    { savol: "2Fe(OH)₃ qizdirilganda qaysi oksid va suvga parchalanadi?", javob: "Fe₂O₃ + 3H₂O", variantlar: ["Fe₂O₃ + 3H₂O", "2Fe + 3H₂O", "Fe₃O₄ + H₂", "FeO + H₂O"] },
]

function RangliChokmalarOyini() {
    const [idx, setIdx] = useState(0)
    const [ball, setBall] = useState(0)
    const [tanlov, setTanlov] = useState(null)

    const joriy = CHOKMA_OYIN_SAVOLLAR[idx]

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
                    <h3 className="text-xl font-bold text-white">3-o'yin: Sifat Reaksiyalari va Rangli Cho'kmalar</h3>
                    <p className="text-sm text-slate-400">Asoslarning olinishi va parchalanish reaksiyalarini toping</p>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold">
                    Ball: {ball} | {idx + 1}/{CHOKMA_OYIN_SAVOLLAR.length}
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
                            setIdx((i) => (i + 1) % CHOKMA_OYIN_SAVOLLAR.length)
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
const DUEL_5_2 = [
    { savol: "Suvda eriydigan asoslar bir so'z bilan nima deb ataladi?", variantlar: ["Ishqorlar", "Oksidlar", "Tuzlar", "Kislotalar"], javob: 0 },
    { savol: "Asoslar suvda eriganda qaysi manfiy ionni hosil qiladi?", variantlar: ["H⁺", "OH⁻ (Gidroksid ioni)", "Cl⁻", "SO₄²⁻"], javob: 1 },
    { savol: "Qaysi asos havorang (moviy) iviq cho'kma hisoblanadi?", variantlar: ["KOH", "NaOH", "Cu(OH)₂", "Fe(OH)₃"], javob: 2 },
    { savol: "2Na + 2H₂O reaksiyasida NaOH bilan birga qaysi gaz chiqadi?", variantlar: ["CO₂↑", "Cl₂↑", "O₂↑", "H₂↑"], javob: 3 },
    { savol: "Qo'ng'ir-zang rangli suvda erimaydigan asosni toping:", variantlar: ["Fe(OH)₃", "Cu(OH)₂", "Ca(OH)₂", "NaOH"], javob: 0 },
    { savol: "O'yuvchi natriyning kimyoviy formulasi qaysi?", variantlar: ["KOH", "NaOH", "Na₂CO₃", "NaHCO₃"], javob: 1 },
]

function JamoalarDueli5_2() {
    const [idx, setIdx] = useState(0)
    const [ball1, setBall1] = useState(0)
    const [ball2, setBall2] = useState(0)
    const [navbat, setNavbat] = useState(1)
    const [natija, setNatija] = useState(null)

    const xomJoriy = DUEL_5_2[idx]
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
                            setIdx((i) => (i + 1) % DUEL_5_2.length)
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
// ASOSIY KOMPONENT: MAVZU 5.2
// ============================================================
export default function Mavzu5_2() {
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
        { nom: "1. Me(OH)ₙ va Valentlik", ikon: 'atom' },
        { nom: "2. Ishqor vs Cho'kma", ikon: 'kolba' },
        { nom: "3. Ishqorlarning olinishi", ikon: 'chaqmoq' },
        { nom: "4. Rangli cho'kmalar sintezi", ikon: 'tomchi' },
        { nom: "5. Cu(OH)₂ → CuO + H₂O", ikon: 'olov' },
        { nom: "6. Ohakli suv + CO₂ testi", ikon: 'tolqin' },
    ]

    const oyinlar = [
        { nom: "1. Ishqormi yoki Cho'kma?", ikon: 'kolba' },
        { nom: "2. Me(OH)ₙ Konstruktori", ikon: 'kristall' },
        { nom: "3. Sifat Reaksiyalari", ikon: 'yulduz' },
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
                mavzuRaqam="5.2"
                mavzuNom="Asoslar"
                bobNom="5-bob. Kislotalar va asoslar"
                sahifa={80}
                oldingiRaqam="5.1"
                asosiyBolim={asosiyBolim}
                setAsosiyBolim={setAsosiyBolim}
                toliqEkran={toliqEkran}
                toliqEkranniUlash={toliqEkranniUlash}
            />

            {asosiyBolim === 'takrorlash' && (
                <OtganDarsniTakrorlash
                    oldingiRaqam="5.1"
                    oldingiNom="Kislotalar"
                    savollar={TAKROPI_5_1}
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

                    {faolKorgazma === 0 && <AsosTuzilishiCanvas />}
                    {faolKorgazma === 1 && <IshqorEruvchanlikCanvas />}
                    {faolKorgazma === 2 && <IshqorOlinishiCanvas />}
                    {faolKorgazma === 3 && <ChokmaAsosSinteziCanvas />}
                    {faolKorgazma === 4 && <AsosTermikParchalanishCanvas />}
                    {faolKorgazma === 5 && <OhakliSuvTestCanvas />}
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

                    {faolOyin === 0 && <IshqorTasnifOyini />}
                    {faolOyin === 1 && <FormulaKonstruktorOyini />}
                    {faolOyin === 2 && <RangliChokmalarOyini />}
                    {faolOyin === 3 && <JamoalarDueli5_2 />}
                </div>
            )}
        </div>
    )
}
