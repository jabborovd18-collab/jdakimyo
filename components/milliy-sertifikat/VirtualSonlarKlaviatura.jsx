// components/milliy-sertifikat/VirtualSonlarKlaviatura.jsx
"use client"

import Ikon from "@/components/Ikon"

/**
 * Ochiq sonli masalalar (BMBA 36-40) uchun teginishga qulay virtual raqamlar klaviaturasi.
 * Mobil, planshet va kompyuterda bir xil barqaror ishlaydi.
 */
export default function VirtualSonlarKlaviatura({
  qiymat = "",
  onChange,
  onTozalash
}) {
  const raqamBosing = (belgi) => {
    let yangi = String(qiymat || "")

    // Minus faqat boshida kelishi mumkin
    if (belgi === "-") {
      if (yangi.startsWith("-")) {
        yangi = yangi.slice(1)
      } else {
        yangi = "-" + yangi
      }
      onChange(yangi)
      return
    }

    // Nuqta yoki vergul: agar allaqachon nuqta/vergul bo'lsa, qayta qo'shmaydi
    if (belgi === "." || belgi === ",") {
      if (yangi.includes(".") || yangi.includes(",")) return
      if (!yangi || yangi === "-") yangi += "0"
      yangi += "."
      onChange(yangi)
      return
    }

    // Oddiy raqamlar (0-9)
    if (yangi === "0" && belgi !== ".") {
      yangi = belgi
    } else {
      yangi += belgi
    }

    onChange(yangi)
  }

  const ochirish = () => {
    const yangi = String(qiymat || "").slice(0, -1)
    onChange(yangi)
  }

  return (
    <div className="w-full max-w-xs mx-auto p-3 rounded-2xl bg-[#09153a]/80 border border-blue-800/60 shadow-lg select-none">
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((raqam) => (
          <button
            key={raqam}
            type="button"
            onClick={() => raqamBosing(raqam)}
            className="h-11 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-800/60 hover:border-yellow-400/50 text-white font-mono font-bold text-lg active:scale-95 transition-all shadow-sm"
          >
            {raqam}
          </button>
        ))}

        {/* Minus / plyus ishorasi */}
        <button
          type="button"
          onClick={() => raqamBosing("-")}
          className="h-11 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-800/60 hover:border-yellow-400/50 text-blue-200 font-mono font-bold text-lg active:scale-95 transition-all"
          title="Manfiy ishora"
        >
          ±
        </button>

        {/* Nol */}
        <button
          type="button"
          onClick={() => raqamBosing("0")}
          className="h-11 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-800/60 hover:border-yellow-400/50 text-white font-mono font-bold text-lg active:scale-95 transition-all"
        >
          0
        </button>

        {/* O'nlik nuqta */}
        <button
          type="button"
          onClick={() => raqamBosing(".")}
          className="h-11 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-800/60 hover:border-yellow-400/50 text-yellow-300 font-mono font-bold text-xl active:scale-95 transition-all"
          title="O'nlik nuqta"
        >
          .
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-blue-900/50">
        <button
          type="button"
          onClick={ochirish}
          className="h-10 rounded-xl bg-blue-950/50 hover:bg-rose-950/50 border border-blue-800/50 hover:border-rose-600 text-blue-200 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <Ikon nom="ochir" olcham={14} />
          <span>Bitta o&apos;chirish (⌫)</span>
        </button>

        <button
          type="button"
          onClick={onTozalash}
          className="h-10 rounded-xl bg-blue-950/50 hover:bg-rose-950/50 border border-blue-800/50 hover:border-rose-600 text-blue-200 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <Ikon nom="qayta" olcham={14} />
          <span>Tozalash</span>
        </button>
      </div>
    </div>
  )
}
