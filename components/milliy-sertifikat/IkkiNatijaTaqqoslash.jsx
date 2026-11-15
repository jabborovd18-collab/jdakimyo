// components/milliy-sertifikat/IkkiNatijaTaqqoslash.jsx
"use client"

import Ikon from "@/components/Ikon"

export default function IkkiNatijaTaqqoslash({ natija }) {
  if (!natija || !natija.oddiyNatija || !natija.taqqoslash) return null

  const { oddiyNatija: oddiy, taqqoslash, kohort } = natija
  const farq = Number(taqqoslash.farqBall) || 0
  const farqMatn = `${farq > 0 ? "+" : ""}${farq} ball`

  const foydaliRang =
    taqqoslash.foydaliTomon === "rasch"
      ? "border-emerald-300/60 bg-emerald-400/15 text-emerald-200"
      : taqqoslash.foydaliTomon === "oddiy"
      ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-200"
      : "border-amber-300/60 bg-amber-400/15 text-amber-200"

  const guruhlar = [
    { nom: "Oson savollar (b < -0.5)", rang: "from-emerald-400 to-teal-300", d: taqqoslash.qiyinlikGuruhlari?.oson },
    { nom: "O'rta savollar (-0.5 .. +0.5)", rang: "from-sky-400 to-cyan-300", d: taqqoslash.qiyinlikGuruhlari?.orta },
    { nom: "Qiyin savollar (b > +0.5)", rang: "from-amber-400 to-orange-400", d: taqqoslash.qiyinlikGuruhlari?.qiyin },
  ].filter((g) => g.d && g.d.jami > 0)

  const qismlar = [
    { nom: "Yopiq test (A–D)", d: taqqoslash.bolimlar?.yopiq },
    { nom: "Moslashtirish (A–F)", d: taqqoslash.bolimlar?.moslashtirish },
    { nom: "Ochiq sonli masala", d: taqqoslash.bolimlar?.ochiq },
  ].filter((q) => q.d && q.d.jami > 0)

  return (
    <section className="space-y-4">
      {/* Kohort statistikasi qatori */}
      {kohort && (kohort.total || kohort.yaroqliKohort > 0) && (
        <div className="ms-karta p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 font-bold">
              Kohort
            </span>
            <span className="text-sky-100">
              <strong className="text-white font-mono">
                {kohort.kalibrlashUsuli === "cml_kohort"
                  ? "CML T-shkala"
                  : kohort.kalibrlashUsuli === "cml_bazaviy"
                  ? "CML"
                  : "Bazaviy Rasch"}
              </strong>
            </span>
            {kohort.ishonchlilik !== null && kohort.ishonchlilik !== undefined && (
              <span className="text-sky-200">
                R: <strong className="text-emerald-300 font-mono">{kohort.ishonchlilik}</strong>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            {kohort.rank && (
              <span className="px-2.5 py-1 rounded-xl bg-sky-500/20 border border-sky-400/45 text-white font-bold">
                #{kohort.rank}/{kohort.total}
                {kohort.percentile !== null ? ` · Top ${Math.max(1, Math.round(101 - kohort.percentile))}%` : ""}
              </span>
            )}
            {kohort.ortachaRaschBall !== null && (
              <span className="text-sky-200">
                O&apos;rtacha: <strong className="text-amber-300">{kohort.ortachaRaschBall}</strong> ·{" "}
                <strong className="text-cyan-300">{kohort.ortachaOddiyFoiz}%</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Yonma-yon ikki xil natija */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. RASCH MODELI ASOSIDAGI NATIJA */}
        <div className="ms-karta-oltin p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Rasch IRT
              </h3>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-[#091642]/90 border border-amber-300/60 text-center shrink-0">
              <div className="text-[10px] text-amber-300 uppercase">Daraja</div>
              <div className="text-2xl font-extrabold text-amber-200 font-mono leading-tight">
                {natija.daraja}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="ms-karta-ichki p-3 rounded-2xl">
              <div className="text-sky-200/85">Shkala balli</div>
              <div className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">
                {natija.shkalaBalli} <span className="text-xs font-normal text-sky-200">/ 100</span>
              </div>
              <div className="text-[10px] text-sky-300 font-mono mt-0.5">
                {natija.ballPast}–{natija.ballYuqori}
              </div>
            </div>

            <div className="ms-karta-ichki p-3 rounded-2xl">
              <div className="text-sky-200/85">Logit (θ)</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
                {natija.theta > 0 ? `+${natija.theta}` : natija.theta}
              </div>
              <div className="text-[10px] text-cyan-200 font-mono mt-0.5">
                ±{natija.se} · Outfit {natija.outfitMNSQ}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-sky-100/90 pt-2 border-t border-amber-300/25">
            {natija.darajaNomi} — {natija.imtiyoz}
          </div>
        </div>

        {/* 2. RASCH MODELISIZ ODDIY BALL TIZIMI NATIJASI */}
        <div className="ms-karta p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Oddiy baho
              </h3>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-[#091642]/90 border border-cyan-300/55 text-center shrink-0">
              <div className="text-[10px] text-cyan-300 uppercase">Baho</div>
              <div className="text-lg font-extrabold text-white font-mono leading-tight mt-0.5">
                {oddiy.oddiyBaho}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="ms-karta-ichki p-3 rounded-2xl">
              <div className="text-sky-200/85">Oddiy ball</div>
              <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-0.5">
                {oddiy.oddiyBall} <span className="text-xs font-normal text-sky-200">/ 100</span>
              </div>
              <div className="text-[10px] text-sky-200 font-mono mt-0.5">
                {oddiy.oddiyFoiz}%
              </div>
            </div>

            <div className="ms-karta-ichki p-3 rounded-2xl">
              <div className="text-sky-200/85">To&apos;g&apos;ri</div>
              <div className="text-2xl font-extrabold text-emerald-300 font-mono mt-0.5">
                {oddiy.rawScore} <span className="text-xs font-normal text-sky-200">/ {oddiy.jamiSavollar}</span>
              </div>
              <div className="text-[10px] text-sky-200 font-mono mt-0.5">
                Ekvivalent: {oddiy.shkalaDaraja}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-sky-100/90 pt-2 border-t border-sky-400/20">
            86%+ A&apos;lo (5) · 71–85% Yaxshi (4) · 56–70% Qoniqarli (3)
          </div>
        </div>
      </div>

      {/* Solishtirma Xulosa */}
      <div className="ms-karta p-5 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/50 text-amber-300 flex items-center justify-center shrink-0">
              <Ikon nom="kuzatuv" olcham={18} />
            </div>
            <h4 className="text-base font-bold text-white">{taqqoslash.sarlavha}</h4>
          </div>

          <div className={`px-4 py-1.5 rounded-2xl border font-mono text-sm font-extrabold shrink-0 text-center ${foydaliRang}`}>
            Farq: {farqMatn}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
          {taqqoslash.xulosaMatni}
        </p>

        {/* Qiyinlik guruhlari va test bo'limlari kesimida */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-sky-400/20">
          {guruhlar.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-sky-200">
                Qiyinlik kesimi
              </div>
              {guruhlar.map((g) => (
                <div key={g.nom} className="ms-karta-ichki p-2.5 rounded-xl space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-sky-100">{g.nom}</span>
                    <strong className="font-mono text-white">
                      {g.d.togri} / {g.d.jami} ({g.d.foiz}%)
                    </strong>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#071133] overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${g.rang}`}
                      style={{ width: `${g.d.foiz}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {qismlar.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-sky-200">
                Topshiriq turlari
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {qismlar.map((q) => (
                  <div key={q.nom} className="ms-karta-ichki p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-sky-100">{q.nom}</span>
                    <span className="font-mono font-bold text-amber-300">
                      {q.d.togri} / {q.d.jami} ({q.d.foiz}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
