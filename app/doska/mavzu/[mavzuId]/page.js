// app/doska/[mavzuId]/page.js
//
// Smart Doska — Mavzuning interaktiv paneli (3 ta bo'lim):
// 1. Interaktiv Formulalar
// 2. Izotermalar & Grafik Simulyator
// 3. Jamoalar Jangi (Smart Musobaqa)
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mavzuniTop } from "@/lib/doska-mavzular";
import Ikon from "@/components/Ikon";
import FormulalarTab from "./FormulalarTab";
import IzotermalarTab from "./IzotermalarTab";
import JamoalarJangiTab from "./JamoalarJangiTab";

export default function SmartDoskaMavzuSahifa() {
  const params = useParams();
  const mavzuId = params.mavzuId;
  const mavzu = mavzuniTop(mavzuId);

  const [faolTab, setFaolTab] = useState("jang"); // standart: "jang" | "formulalar" | "izotermalar"

  if (!mavzu) {
    return (
      <main className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
          <Ikon nom="qidiruv" olcham={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Mavzu topilmadi</h2>
        <p className="text-slate-400 mb-6">Ushbu mavzu hali kiritilmagan yoki manzilda xatolik bor.</p>
        <Link
          href="/doska"
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-2"
        >
          <Ikon nom="chap" olcham={18} />
          <span>Smart Doska katalogiga qaytish</span>
        </Link>
      </main>
    );
  }

  const tablar = [
    { id: "jang", nom: "Jamoalar Jangi", ikon: "kubok", tavsif: "Musobaqa & Kolbalar" },
    { id: "formulalar", nom: "Interaktiv Formulalar", ikon: "formula", tavsif: "Kalkulyator" },
    { id: "izotermalar", nom: "Izotermalar & Simulyator", ikon: "grafik", tavsif: "Grafiklar" },
  ];

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ═══ YUQORI NAVIGATSIYA ═══ */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/doska"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            title="Katalogga qaytish"
          >
            <Ikon nom="chap" olcham={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {mavzu.fan}
              </span>
              <span className="text-xs text-slate-400">
                Ustoz:{" "}
                {mavzu.oqituvchiUserId ? (
                  <Link
                    href={`/profil/${mavzu.oqituvchiUserId}`}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    {mavzu.oqituvchi}
                  </Link>
                ) : (
                  mavzu.oqituvchi
                )}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {mavzu.nomi}
            </h1>
          </div>
        </div>

        {/* ═══ BO'LIMLARNI ALMASHTIRISH (TABLAR) ═══ */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
          {tablar.map((tab) => {
            const faol = faolTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFaolTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                  faol
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Ikon nom={tab.ikon} olcham={16} />
                <span>{tab.nom}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ═══ TANLANGAN TAB MUNDARIJASI ═══ */}
      <div className="transition-all duration-200">
        {faolTab === "jang" && <JamoalarJangiTab mavzuId={mavzu.id} />}
        {faolTab === "formulalar" && <FormulalarTab mavzu={mavzu} />}
        {faolTab === "izotermalar" && <IzotermalarTab />}
      </div>
    </main>
  );
}
