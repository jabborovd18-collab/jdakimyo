// components/milliy-sertifikat/VirtualSonlarKlaviatura.jsx
"use client"

import Ikon from "@/components/Ikon"

/**
 * Ochiq sonli masalalar (36-40) uchun teginishga qulay virtual raqamlar klaviaturasi.
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
    <div className="ms-karta w-full max-w-xs mx-auto p-3.5 rounded-2xl select-none">
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((raqam) => (
          <button
            key={raqam}
            type="button"
            onClick={() => raqamBosing(raqam)}
            className="h-11 rounded-xl bg-[#13296b]/90 hover:bg-[#1b3a94] border border-sky-400/35 hover:border-amber-300/70 text-white font-mono font-bold text-lg active:scale-95 transition-all shadow-sm"
          >
            {raqam}
          </button>
        ))}

        {/* Minus / plyus ishorasi */}
        <button
          type="button"
          onClick={() => raqamBosing("-")}
          className="h-11 rounded-xl bg-[#13296b]/90 hover:bg-[#1b3a94] border border-sky-400/35 hover:border-amber-300/70 text-sky-100 font-mono font-bold text-lg active:scale-95 transition-all"
          title="Manfiy ishora"
        >
          ±
        </button>

        {/* Nol */}
        <button
          type="button"
          onClick={() => raqamBosing("0")}
          className="h-11 rounded-xl bg-[#13296b]/90 hover:bg-[#1b3a94] border border-sky-400/35 hover:border-amber-300/70 text-white font-mono font-bold text-lg active:scale-95 transition-all"
        >
          0
        </button>

        {/* O'nlik nuqta */}
        <button
          type="button"
          onClick={() => raqamBosing(".")}
          className="h-11 rounded-xl bg-[#13296b]/90 hover:bg-[#1b3a94] border border-sky-400/35 hover:border-amber-300/70 text-amber-300 font-mono font-bold text-xl active:scale-95 transition-all"
          title="O'nlik nuqta"
        >
          .
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-sky-400/20">
        <button
          type="button"
          onClick={ochirish}
          className="h-10 rounded-xl bg-[#0c1d52]/80 hover:bg-rose-900/60 border border-sky-400/30 hover:border-rose-400/70 text-sky-100 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <Ikon nom="ochir" olcham={14} />
          <span>Bitta o&apos;chirish (⌫)</span>
        </button>

        <button
          type="button"
          onClick={onTozalash}
          className="h-10 rounded-xl bg-[#0c1d52]/80 hover:bg-rose-900/60 border border-sky-400/30 hover:border-rose-400/70 text-sky-100 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <Ikon nom="qayta" olcham={14} />
          <span>Tozalash</span>
        </button>
      </div>
    </div>
  )
}
