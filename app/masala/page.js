"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";
import MasalaKiritish from "./components/MasalaKiritish.jsx";
import YechimPaneli from "./components/YechimPaneli.jsx";

const YUKLANISH_BOSQICHLARI = [
  "🔍 1-Agent (Tahlilchi): Masala sharti va fizik kattaliklar ajratilmoqda...",
  "⚗️ 2-Agent (Kimyogar): Reaksiya tenglamalari va stexiometriya hisoblanmoqda...",
  "⚖️ 3-Agent (Matematik): Birliklar va proporsiyalar tekshiruvdan o'tmoqda...",
  "👨‍🏫 4-Agent (Pedagog): KaTeX formulalari bilan master-yechim shakllantirilmoqda...",
];

export default function MasalaSahifasi() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [natija, setNatija] = useState(null);
  const [oxirgiMatn, setOxirgiMatn] = useState("");
  const [oxirgiRasm, setOxirgiRasm] = useState(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [yuklanishBosqich, setYuklanishBosqich] = useState(0);
  const [xato, setXato] = useState(null);
  const [tarix, setTarix] = useState([]);

  // Yuklanish paytida dinamik xabarlar sikli
  useEffect(() => {
    let timer = null;
    if (yuklanmoqda) {
      setYuklanishBosqich(0);
      timer = setInterval(() => {
        setYuklanishBosqich((prev) => (prev + 1) % YUKLANISH_BOSQICHLARI.length);
      }, 1200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [yuklanmoqda]);

  // Tarixni localStorage dan yuklash
  useEffect(() => {
    try {
      const saqlangan = localStorage.getItem("jda-masalalar-tarixi");
      if (saqlangan) {
        setTarix(JSON.parse(saqlangan));
      }
    } catch (e) {}
  }, []);

  const handleYechish = async (masalaMatni, rejim = "toliq", rasm = null) => {
    try {
      setYuklanmoqda(true);
      setXato(null);
      setOxirgiMatn(masalaMatni);
      setOxirgiRasm(rasm);

      const res = await fetch("/api/masala/yech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masalaMatni, rejim, rasm }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.xato || "Masalani tahlil qilishda xatolik yuz berdi.");
      }

      setNatija(data);

      // Tarixga qo'shish
      const matnPreview = (masalaMatni || data.masalaMatni || "Rasm orqali masala").slice(0, 80);
      const yangiElement = {
        id: Date.now(),
        vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        matn: matnPreview + (matnPreview.length >= 80 ? "..." : ""),
        toliqMatn: masalaMatni || data.masalaMatni || "",
        rejim,
        tenglama: data.tenglama,
      };

      const yangiTarix = [yangiElement, ...tarix.filter((t) => t.toliqMatn !== masalaMatni)].slice(0, 8);
      setTarix(yangiTarix);
      try {
        localStorage.setItem("jda-masalalar-tarixi", JSON.stringify(yangiTarix));
      } catch (e) {}
    } catch (err) {
      setXato(err.message);
    } finally {
      setYuklanmoqda(false);
    }
  };

  const handleToliqYechimgaOtish = () => {
    if (oxirgiMatn || oxirgiRasm) {
      handleYechish(oxirgiMatn, "toliq", oxirgiRasm);
    }
  };

  const tarixniTozalash = () => {
    setTarix([]);
    try {
      localStorage.removeItem("jda-masalalar-tarixi");
    } catch (e) {}
  };

  return (
    <div
      data-fon={fonKaliti}
      className="v3 min-h-screen w-full p-4 sm:p-6 md:p-8 transition-colors duration-200 bg-[var(--v3-fon)] text-[var(--v3-matn)]"
    >
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        {/* ─── YUQORI NAVIGATSIYA VA HEADER ─── */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
          <div className="flex items-center gap-3">
            <Link href="/oquv" className="v3-tugma text-xs py-1.5 px-3">
              <Ikon nom="chap" olcham={14} />
              <span>Ta{"'"}lim</span>
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs text-[var(--v3-xira)]">
                <span>Kimyoviy Masalalar Markazi</span>
                <span>/</span>
                <span className="text-[var(--v3-urgu)] font-bold">3 Xil Yondashuv</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--v3-matn)] flex items-center gap-2 mt-0.5">
                <Ikon nom="kolba" olcham={22} className="text-[var(--v3-urgu)]" />
                <span>JDA Kimyo AI</span>
                <span className="v3-tag v3-tag-ochiq text-[10px] font-bold">Beta</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
            <Link href="/laboratoriya/3d" className="v3-tugma text-xs py-1.5 px-3">
              <Ikon nom="atom" olcham={14} />
              <span>3D Lab</span>
            </Link>
          </div>
        </header>

        {/* Xatolik xabarnomasi */}
        {xato && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-400 flex items-center gap-2 animate-in fade-in duration-150">
            <Ikon nom="taqiq" olcham={16} className="shrink-0" />
            <span>{xato}</span>
          </div>
        )}

        {/* ─── ASOSIY KIRITISH PANELI (3 TA REJIM, RASM & NAMUNALAR) ─── */}
        <MasalaKiritish onYechish={handleYechish} yuklanmoqda={yuklanmoqda} />

        {/* ─── ANIMATSIYALI YUKLANISH HOLATI ("AI Masalani yechmoqda...") ─── */}
        {yuklanmoqda && (
          <div className="p-8 sm:p-12 rounded-2xl border border-[var(--v3-urgu)]/40 bg-[var(--v3-yuza)] text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative flex items-center justify-center mx-auto w-16 h-16 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)] shadow-inner">
              <Ikon nom="atom" olcham={32} className="animate-spin" style={{ animationDuration: "3s" }} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--v3-urgu)] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--v3-urgu)]" />
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-[var(--v3-matn)]">
                AI Kimyoviy Masalani Yechmoqda...
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[var(--v3-urgu)] transition-all duration-300">
                {YUKLANISH_BOSQICHLARI[yuklanishBosqich]}
              </p>
            </div>

            <div className="max-w-xs mx-auto h-1.5 rounded-full bg-[var(--v3-fon)] overflow-hidden border border-[var(--v3-chiziq)]">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${((yuklanishBosqich + 1) / YUKLANISH_BOSQICHLARI.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ─── YECHIM VA TAHLIL PANELI ─── */}
        {natija && !yuklanmoqda && (
          <YechimPaneli
            natija={natija}
            onToliqYechimgaOtish={handleToliqYechimgaOtish}
          />
        )}

        {/* ─── 4-BOSQICH: MASALALAR TARIXI VA SHAXSIY DAFTARCHA ─── */}
        {tarix.length > 0 && !yuklanmoqda && (
          <section className="p-5 rounded-2xl border bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--v3-chiziq)]">
              <div className="flex items-center gap-2">
                <Ikon nom="vaqt" olcham={16} className="text-[var(--v3-urgu)]" />
                <h4 className="text-xs font-bold text-[var(--v3-matn)]">
                  Yaqinda Ko{"'"}rilgan Masalalar Tarixi ({tarix.length})
                </h4>
              </div>
              <button
                type="button"
                onClick={tarixniTozalash}
                className="text-[11px] text-[var(--v3-xira)] hover:text-red-400 transition"
              >
                Tarixni tozalash
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tarix.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleYechish(item.toliqMatn, item.rejim)}
                  className="p-3 rounded-xl border text-left text-xs bg-[var(--v3-fon)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)] transition space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--v3-xira)]">
                    <span className="text-[var(--v3-urgu)] font-bold uppercase">{item.rejim}</span>
                    <span>{item.vaqt}</span>
                  </div>
                  <div className="text-[var(--v3-matn)] truncate font-medium">{item.matn}</div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
