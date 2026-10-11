// app/doska/page.js
//
// Smart Doska — Bosh sahifa va mavzular katalogi.
// Ushbu sahifa maktab va universitetlardagi katta elektron doskalarda
// (Smart Board) qulay ko'rinishi uchun yuqori kontrastli qat'iy to'q
// laboratoriya fonida ishlaydi (ranglar tashqi temalarga bog'lanmaydi).
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DOSKA_MAVZULARI } from "@/lib/doska-mavzular";
import Ikon from "@/components/Ikon";

export default function SmartDoskaBoshSahifa() {
  const [qidiruv, setQidiruv] = useState("");

  const filtrlanganMavzular = useMemo(() => {
    const q = qidiruv.toLowerCase().trim();
    if (!q) return [];
    return DOSKA_MAVZULARI.filter(
      (m) =>
        m.nomi.toLowerCase().includes(q) ||
        m.oqituvchi.toLowerCase().includes(q) ||
        m.fan.toLowerCase().includes(q) ||
        m.teglar.some((t) => t.toLowerCase().includes(q))
    );
  }, [qidiruv]);

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        {/* ═══ YUQORI NAVIGATSIYA VA LOGO ═══ */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
              title="Bosh sahifaga qaytish"
            >
              <Ikon nom="chap" olcham={20} />
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
                <Ikon nom="kolba" olcham={22} />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  SMART DOSKA
                  <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Elektron doska
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  O&apos;qituvchilar va interaktiv auditoriya darslari uchun platforma
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sensorli doskaga mos
            </span>
          </div>
        </header>

        {/* ═══ QIDIRUV PANELI ═══ */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Ikon nom="qidiruv" olcham={20} />
          </div>
          <input
            type="text"
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="Mavzu nomi, o'qituvchi yoki fan bo'yicha qidirish... (Masalan: Adsorbsiya, Nayimova, Langmyur)"
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-base sm:text-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xl transition"
          />
          {qidiruv && (
            <button
              onClick={() => setQidiruv("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
              title="Tozalash"
            >
              <Ikon nom="yopish" olcham={18} />
            </button>
          )}
        </div>

        {/* ═══ MAVZULAR RO'YXATI: FAQAT QIDIRUV KADA CHIQADI ═══ */}
        {!qidiruv.trim() ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-6 shadow-2xl">
            <span className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 inline-flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-950/50">
              <Ikon nom="qidiruv" olcham={32} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              Mavzuni topish uchun qidiring
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
              Smart Doskada darsni boshlash uchun yuqoridagi qidiruv maydoniga mavzu nomi, olim yoki fan nomini yozing, yoki quyidagi teglardan birini bosing:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                "Adsorbsiya",
                "Lengmyur",
                "Freyndlix",
                "BET",
                "Gibbs",
                "Kelvin",
                "Traube",
                "Kolloid kimyo",
                "Regressiya",
              ].map((teg) => (
                <button
                  key={teg}
                  onClick={() => setQidiruv(teg)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950/80 border border-slate-700/60 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-xs font-semibold transition"
                >
                  #{teg}
                </button>
              ))}
            </div>
          </div>
        ) : filtrlanganMavzular.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center max-w-md mx-auto my-6">
            <p className="text-sm font-bold text-slate-300 mb-1">Mos mavzu topilmadi</p>
            <p className="text-xs text-slate-400 mb-4">
              &quot;{qidiruv}&quot; so&apos;rovi bo&apos;yicha hech narsa chiqmadi. Boshqa kalit so&apos;z bilan urinib ko&apos;ring.
            </p>
            <button
              onClick={() => setQidiruv("")}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
            >
              Qidiruvni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filtrlanganMavzular.map((mavzu) => {
              const faol = mavzu.holat === "faol";
              return (
                <div
                  key={mavzu.id}
                  className={`relative flex flex-col justify-between rounded-3xl p-6 border transition-all duration-200 ${
                    faol
                      ? "bg-slate-900/80 border-slate-700/80 hover:border-emerald-500/80 hover:shadow-2xl hover:shadow-emerald-950/30 group"
                      : "bg-slate-900/40 border-slate-800/60 opacity-75"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 inline-flex items-center justify-center text-emerald-400">
                        {mavzu.rang === "emerald" ? (
                          <Ikon nom="kolba" olcham={24} />
                        ) : mavzu.rang === "purple" ? (
                          <Ikon nom="atom" olcham={24} className="text-purple-400" />
                        ) : (
                          <Ikon nom="chaqmoq" olcham={24} className="text-amber-400" />
                        )}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          faol
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {faol ? "Faol interaktiv" : "Tez kunda"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                      {mavzu.nomi}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {mavzu.qisqa}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-400 mb-5 pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Ustoz:</span>
                        {mavzu.oqituvchiUserId ? (
                          <Link
                            href={`/profil/${mavzu.oqituvchiUserId}`}
                            className="text-emerald-400 hover:underline font-medium"
                          >
                            {mavzu.oqituvchi}
                          </Link>
                        ) : (
                          <span className="text-slate-200 font-medium">{mavzu.oqituvchi}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Fan:</span>
                        <span className="text-slate-200 font-medium">{mavzu.fan}</span>
                      </div>
                      {faol && (
                        <div className="flex items-center gap-3 pt-1 text-emerald-400 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Ikon nom="tasdiq" olcham={12} />
                            <span>{mavzu.savollarSoni} ta test</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Ikon nom="tasdiq" olcham={12} />
                            <span>{mavzu.formulalar.length} ta formula</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Ikon nom="tasdiq" olcham={12} />
                            <span>Jamoalar jangi</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {mavzu.teglar.map((teg) => (
                        <span
                          key={teg}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50"
                        >
                          #{teg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {faol ? (
                      <Link
                        href={`/doska/mavzu/${mavzu.id}`}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition group"
                      >
                        <span>Doskani ochish</span>
                        <Ikon nom="ong" olcham={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-slate-800/50 border border-slate-800 text-slate-400 font-medium text-sm cursor-not-allowed"
                      >
                        Jarayonda (Tez kunda)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ UNDOV BILAN YOZILGAN ADMIN BILAN BOG'LANISH BLOKI ═══ */}
      <footer className="mt-8 pt-6 border-t border-slate-800">
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 inline-flex items-center justify-center">
              <Ikon nom="ogohlantirish" olcham={22} />
            </span>
            <div>
              <h4 className="font-bold text-base text-amber-300 flex items-center gap-2">
                O&apos;qituvchilar va kafedralar diqqatiga!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                O&apos;z faningiz yoki ma&apos;ruza mavzuingiz bo&apos;yicha yangi interaktiv formula, grafiklar va testlar panelini qo&apos;shmoqchimisiz?
                Biz bilan bepul bog&apos;laning — sizning mavzuingiz ham elektron doskaga kiritiladi!
              </p>
            </div>
          </div>

          <a
            href="https://t.me/Diyorbek_Jabborov"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition"
          >
            <Ikon nom="telegram" olcham={18} />
            <span>Admin bilan bog&apos;lanish (@diyorbek_jabborov)</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
