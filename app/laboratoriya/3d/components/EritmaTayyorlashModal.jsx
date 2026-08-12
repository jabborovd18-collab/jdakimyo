"use client"

import { useState } from 'react'
import Ikon from '@/components/Ikon'
import {
  ERITMA_REAGENTLARI,
  OLCHOV_KOLBALARI,
  eritmaHisobla,
  kerakliMassaHisobla,
} from '../lib/eritma-tayyorlash.js'
import toast from 'react-hot-toast'

export default function EritmaTayyorlashModal({ onEritmaTayyorlandi, onYop }) {
  const [bosqich, setBosqich] = useState(1) // 1: Tanlash, 2: Tortish, 3: Suv quyish, 4: Natija

  // Parametrlar
  const [tanlanganReagent, setTanlanganReagent] = useState(ERITMA_REAGENTLARI[0].kalit)
  const [kolbaHajmi, setKolbaHajmi] = useState(100)
  const [maqsadM, setMaqsadM] = useState(0.1)

  // Tarozi holati
  const [tara, setTara] = useState(0)
  const [massaGramm, setMassaGramm] = useState(0)
  const [spatulaYuklanmoqda, setSpatulaYuklanmoqda] = useState(false)

  // Suv hajmi
  const [suvMl, setSuvMl] = useState(0)

  // Aralashtirish holati
  const [aralashtirilmoqda, setAralashtirilmoqda] = useState(false)
  const [eridi, setEridi] = useState(false)

  const reagentObj = ERITMA_REAGENTLARI.find(r => r.kalit === tanlanganReagent) || ERITMA_REAGENTLARI[0]
  const nazariyMassa = kerakliMassaHisobla(tanlanganReagent, maqsadM, kolbaHajmi)

  // Natija hisoblash
  const hisob = eritmaHisobla(tanlanganReagent, massaGramm, suvMl || kolbaHajmi, maqsadM)

  // Spatula bilan modda qo'shish
  const moddaQosh = (g) => {
    setSpatulaYuklanmoqda(true)
    setMassaGramm(prev => Number((prev + g).toFixed(3)))
    setTimeout(() => setSpatulaYuklanmoqda(false), 200)
  }

  // Suv quyish
  const suvQuy = (ml) => {
    setSuvMl(prev => Math.min(kolbaHajmi + 20, Number((prev + ml).toFixed(1))))
  }

  // Aralashtirish va eritish
  const aralashtir = () => {
    setAralashtirilmoqda(true)
    setTimeout(() => {
      setAralashtirilmoqda(false)
      setEridi(true)
      toast.success('Modda to\'liq eridi va bir jinsli eritma hosil bo\'ldi!')
    }, 1500)
  }

  // 3D stolga o'tkazish
  const stolgaOtqaz = () => {
    if (typeof onEritmaTayyorlandi === 'function') {
      onEritmaTayyorlandi({
        reagent: tanlanganReagent,
        massaGramm,
        hajmMl: suvMl,
        molyarlik: hisob.molyarlik,
        massaviyUlush: hisob.massaviyUlush,
        rang: hisob.rang,
        nom: `${hisob.molyarlik} M ${reagentObj.nom} eritmasi`
      })
    }
    toast.success(`✓ ${hisob.molyarlik} M ${reagentObj.formula} eritmasi 3D stolga joylashtirildi!`)
    onYop()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
          <div>
            <div className="v3-nishon text-[var(--v3-urgu)]">2-Bosqich: Amaliy Ko{"'"}nikma</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kolba" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Standart Eritma Tayyorlash Stoli</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onYop}
            className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="yopish" olcham={16} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
          {[
            { id: 1, nom: '1. Reagent' },
            { id: 2, nom: '2. Tarozi' },
            { id: 3, nom: '3. Kolba & Suv' },
            { id: 4, nom: '4. Natija' }
          ].map(s => (
            <div
              key={s.id}
              className={`py-2 rounded-xl border transition-all ${
                bosqich === s.id
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold border-[var(--v3-urgu)] shadow-sm'
                  : bosqich > s.id
                  ? 'bg-[var(--v3-yuza-2)] text-emerald-400 border-emerald-500/30'
                  : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq)]'
              }`}
            >
              {s.nom}
            </div>
          ))}
        </div>

        {/* ─── 1-BOSQICH: REAGENT VA MAQSAD TANLASH ─── */}
        {bosqich === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--v3-matn)]">Qattiq reagent va o{"'"}lchov kolbasini tanlang:</h3>
              <p className="text-xs text-[var(--v3-xira)]">Tayyorlamoqchi bo{"'"}lgan eritma konsentratsiyasini belgilang.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ERITMA_REAGENTLARI.map(r => (
                <button
                  key={r.kalit}
                  type="button"
                  onClick={() => setTanlanganReagent(r.kalit)}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    tanlanganReagent === r.kalit
                      ? 'bg-[var(--v3-yuza-2)] border-[var(--v3-urgu)] shadow-sm'
                      : 'bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]'
                  }`}
                >
                  <div className="font-bold text-xs text-[var(--v3-matn)]">{r.formula}</div>
                  <div className="text-[11px] text-[var(--v3-xira)] truncate">{r.nom}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="v3-yorliq">O{"'"}lchov kolbasi sig{"'"}imi</label>
                <select
                  value={kolbaHajmi}
                  onChange={(e) => setKolbaHajmi(parseInt(e.target.value))}
                  className="v3-kiritish font-mono"
                >
                  {OLCHOV_KOLBALARI.map(k => (
                    <option key={k.hajm} value={k.hajm}>{k.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="v3-yorliq">Maqsadli molyar konsentratsiya (C_M)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="5"
                  value={maqsadM}
                  onChange={(e) => setMaqsadM(parseFloat(e.target.value) || 0.1)}
                  className="v3-kiritish font-mono"
                />
              </div>
            </div>

            {/* Nazariy hisob qutisi */}
            <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-xs space-y-1.5 font-mono">
              <div className="text-[var(--v3-urgu)] font-bold">Nazariy stexiometrik hisob:</div>
              <div className="text-[var(--v3-matn)]">
                m = C_M × V × M = {maqsadM} mol/l × {(kolbaHajmi / 1000)} l × {hisob.molyarMassa} g/mol = <strong className="text-yellow-400 text-sm">{nazariyMassa} g</strong>
              </div>
              <p className="text-[10.5px] text-[var(--v3-xira)] font-sans">
                Keyingi bosqichda taroziga aynan <strong>{nazariyMassa} gramm</strong> modda tortishga harakat qiling.
              </p>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setBosqich(2)}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-6 font-bold inline-flex items-center gap-1.5"
              >
                <span>Tarozida tortishga o{"'"}tish</span>
                <Ikon nom="ong" olcham={14} />
              </button>
            </div>
          </div>
        )}

        {/* ─── 2-BOSQICH: ANALITIK TAROZIDA TORTISH ─── */}
        {bosqich === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--v3-matn)]">2. Analitik tarozida modda o{"'"}lchash</h3>
              <p className="text-xs text-[var(--v3-xira)]">
                Spatula orqali soat shishasiga <strong className="text-yellow-400 font-mono">{nazariyMassa} g</strong> {reagentObj.formula} soling.
              </p>
            </div>

            {/* Digital Scale Display */}
            <div className="p-6 rounded-2xl border border-[var(--v3-urgu)] bg-[var(--v3-fon-2)] text-center space-y-2 font-mono shadow-inner">
              <div className="text-[10px] text-[var(--v3-xira)] uppercase tracking-widest">
                Raqamli Analitik Tarozi (0.001 g aniqlik)
              </div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-wider">
                {massaGramm.toFixed(3)} <span className="text-xl text-[var(--v3-xira)]">g</span>
              </div>
              <div className="text-xs text-[var(--v3-xira)]">
                Kerakli: <strong>{nazariyMassa} g</strong> {massaGramm > 0 && `(Farq: ${(massaGramm - nazariyMassa).toFixed(3)} g)`}
              </div>
            </div>

            {/* Spatula Controls */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[var(--v3-matn)]">Spatula bilan modda qo{"'"}shish:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { g: 0.1, label: '+0.100 g (Yupqa)' },
                  { g: 0.5, label: '+0.500 g' },
                  { g: 2.0, label: '+2.000 g' },
                  { g: 5.0, label: '+5.000 g (Katta)' },
                ].map(btn => (
                  <button
                    key={btn.g}
                    type="button"
                    onClick={() => moddaQosh(btn.g)}
                    disabled={spatulaYuklanmoqda}
                    className="v3-tugma text-xs py-2 justify-center font-mono font-bold"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={() => setMassaGramm(0)}
                className="v3-tugma text-xs py-1.5 px-3 text-red-400"
              >
                Nolga tushirish (Reset)
              </button>

              <button
                type="button"
                onClick={() => setBosqich(3)}
                disabled={massaGramm <= 0}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-6 font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>Kolbaga solish va Suv quyish</span>
                <Ikon nom="ong" olcham={14} />
              </button>
            </div>
          </div>
        )}

        {/* ─── 3-BOSQICH: O'LCHOV KOLBASI VA SUV QUYISH ─── */}
        {bosqich === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--v3-matn)]">3. Distillangan suv quyish va Meniskni tekshirish</h3>
              <p className="text-xs text-[var(--v3-xira)]">
                Kolbadagi belgilangan <strong className="text-[var(--v3-urgu)] font-mono">{kolbaHajmi} ml</strong> chiziqchasigacha suv quying.
              </p>
            </div>

            {/* Visual Meniscus Flask Gauge */}
            <div className="p-6 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Kolbadagi suyuqlik:</span>
                <strong className="text-base text-cyan-400">{suvMl} / {kolbaHajmi} ml</strong>
              </div>

              <div className="relative w-full h-6 rounded-full bg-[var(--v3-yuza-2)] overflow-hidden border border-[var(--v3-chiziq)]">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (suvMl / kolbaHajmi) * 100)}%` }}
                />
                {/* 100% calibration line marker */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500 shadow-md" title="Menisk chizig'i" />
              </div>

              <div className="text-center text-xs font-mono">
                {suvMl === kolbaHajmi ? (
                  <span className="text-green-400 font-bold">✓ Menisk chizig{"'"}i bilan ideal mos keldi!</span>
                ) : suvMl > kolbaHajmi ? (
                  <span className="text-red-400 font-bold">⚠️ Belgilangan chiziqdan oshib ketdi (+{(suvMl - kolbaHajmi).toFixed(1)} ml) — eritma suyulib ketadi!</span>
                ) : (
                  <span className="text-[var(--v3-xira)]">Chiziqqacha yana {(kolbaHajmi - suvMl).toFixed(1)} ml suv kerak</span>
                )}
              </div>
            </div>

            {/* Suv quyish tugmalari */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => suvQuy(50)}
                className="v3-tugma text-xs py-2.5 justify-center font-mono font-bold"
              >
                +50 ml (Tez)
              </button>
              <button
                type="button"
                onClick={() => suvQuy(10)}
                className="v3-tugma text-xs py-2.5 justify-center font-mono font-bold"
              >
                +10 ml
              </button>
              <button
                type="button"
                onClick={() => suvQuy(1)}
                className="v3-tugma v3-tugma-asosiy text-xs py-2.5 justify-center font-mono font-bold"
              >
                +1 ml (Tomchilatish)
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={() => setSuvMl(0)}
                className="v3-tugma text-xs py-1.5 px-3 text-red-400"
              >
                Suvni tozalash
              </button>

              <button
                type="button"
                onClick={() => setBosqich(4)}
                disabled={suvMl <= 0}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-6 font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>Aralashtirish va Natija</span>
                <Ikon nom="ong" olcham={14} />
              </button>
            </div>
          </div>
        )}

        {/* ─── 4-BOSQICH: ARALASHTIRISH VA YAKUNIY ERITMA ─── */}
        {bosqich === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--v3-matn)]">4. Aralashtirish va Aniq Konsentratsiya Xulosasi</h3>
              <p className="text-xs text-[var(--v3-xira)]">
                Kolba tiqinini yopib, qattiq tuz to{"'"}liq eriguncha chayqating.
              </p>
            </div>

            {!eridi ? (
              <div className="p-8 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-center space-y-4">
                <div className="text-5xl animate-bounce" style={{ animationDuration: '1.5s' }}>
                  🧪
                </div>
                <p className="text-xs text-[var(--v3-xira)]">
                  Qattiq kristallar kolba tubida turibdi. Bir jinsli standart eritma olish uchun aralashtiring.
                </p>
                <button
                  type="button"
                  onClick={aralashtir}
                  disabled={aralashtirilmoqda}
                  className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-6 font-bold inline-flex items-center gap-2"
                >
                  {aralashtirilmoqda ? (
                    <>
                      <Ikon nom="vaqt" olcham={15} className="animate-spin" />
                      <span>Eritilmoqda...</span>
                    </>
                  ) : (
                    <span>🔄 Kolbani aralashtirish (Eritish)</span>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
                  <div className="font-bold text-sm text-green-400">
                    ✓ Standart Eritma Tayyor!
                  </div>
                  <span className="v3-tag v3-tag-ochiq font-mono font-bold">
                    Aniqlik: {hisob.aniqlikFoizi}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
                    <span className="text-[10px] text-[var(--v3-xira)] block">Aniq Molyarlik (C_M)</span>
                    <strong className="text-base text-[var(--v3-urgu)]">{hisob.molyarlik} M</strong>
                  </div>
                  <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
                    <span className="text-[10px] text-[var(--v3-xira)] block">Massaviy ulush (w)</span>
                    <strong className="text-base text-cyan-400">{hisob.massaviyUlush}%</strong>
                  </div>
                  <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
                    <span className="text-[10px] text-[var(--v3-xira)] block">Modda miqdori</span>
                    <strong className="text-base text-[var(--v3-matn)]">{hisob.molMiqdori} mol</strong>
                  </div>
                  <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
                    <span className="text-[10px] text-[var(--v3-xira)] block">Hajm</span>
                    <strong className="text-base text-[var(--v3-matn)]">{hisob.hajmMl} ml</strong>
                  </div>
                </div>

                <p className="text-xs text-[var(--v3-xira)] leading-relaxed pt-1">
                  Ushbu standart eritma 3D laboratoriyadagi keyingi barcha reaksiyalarda (cho{"'"}ktirish, neytrallanish, titrlash) aynan <strong>{hisob.molyarlik} M</strong> konsentratsiya bilan qatnashadi.
                </p>

                <div className="flex justify-end pt-3 border-t border-[var(--v3-chiziq)]">
                  <button
                    type="button"
                    onClick={stolgaOtqaz}
                    className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-8 font-bold"
                  >
                    ✓ 3D Stolga joylashtirish
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
