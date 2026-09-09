// app/laboratoriya/3d/components/LabHUD.jsx
//
// 3D sahna USTIDAGI HUD qatlami: ko'zoynak/niqob vizual filtrlari,
// yuqori burchak paneli (brend, harorat, tarozi holati), boshqaruv
// tugmalari (sezgirlik, yorliqlar, ovoz, mashg'ulot, yordam, chiqish),
// markaziy crosshair + kontekst yordamchisi, mobil joystik ulanishi
// va qo'ldagi idish kartasi.
//
// BRIF-05 (2-bosqich): `korinish.js` (1474 qator) dan JSX AYNAN
// ko'chirildi — bironta klass yoki tuzilma o'zgarmadi. Barcha holat
// va handlerlar prop orqali keladi: bu komponent o'z holatini
// saqlamaydi, faqat chizadi.
//
// DIQQAT (10-band): `setFpsQolIdish` asl kodda ham aniqlanmagan edi
// ("[G] Javonga" tugmasi bosilsa ReferenceError). Xatti-harakat
// saqlanadi — prop sifatida kelmasa, avvalgidek xato beradi.
// `YOL-XARITASI.md` ga yozildi.

"use client";

import Link from "next/link";
import Ikon from "@/components/Ikon";
import VirtualJoystick from "./VirtualJoystick.jsx";

export default function LabHUD({
  kozoynakTaqilgan,
  gazNiqobiTaqilgan,
  harorat,
  tarozidagiIdish,
  sezgirlik,
  sezgirlikniOzgartir,
  yorliqlarYoqilgan,
  yorliqlarniAlmashtir,
  ovozYoqilgan,
  setOvozYoqilgan,
  setMashgulotOchilgan,
  setYordamOchilgan,
  ISH,
  fpsKontekstMatn,
  fpsKontekstTuri,
  qarashXabari,
  qarashRejimi,
  handleJoystickHarakat,
  handleJoystickBurilish,
  fpsQaralganIdish,
  fpsQolIdish,
  qolgaOlYokiQoy,
  quyishBoshla,
  aniqHajmQuy,
  javongaQaytar,
  setFpsQolIdish,
  spatulaKukun,
  nishonIdishGroup,
  quyilganKalitlar,
  quyilganModdalar,
  jamiMl,
}) {
  return (
    <>
        {/* --- BIRINCHI SHAXS KO'ZOYNAK / GAZ NIQOBI FPS HUD QATLAMI --- */}
        {kozoynakTaqilgan && (
          <div className="pointer-events-none absolute inset-0 z-10 border-[16px] sm:border-[28px] border-cyan-950/30 ring-1 ring-cyan-400/20 shadow-[inset_0_0_100px_rgba(6,182,212,0.15)] backdrop-brightness-105" />
        )}

        {gazNiqobiTaqilgan && (
          <div className="pointer-events-none absolute inset-0 z-10 border-[24px] sm:border-[44px] border-slate-950/80 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] ring-2 ring-amber-500/30">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 border border-amber-500/40 text-[10px] font-mono text-amber-400 font-bold tracking-widest uppercase">
              ● RESPIRATOR HAZMAT FILTR FAOL (O₂: 99.8%)
            </div>
          </div>
        )}

        {/* --- SLEEK MINIMAL CYBER-HUD (YUQORI BURCHAKLAR) --- */}
        {/* Yuqori chap: Brend va Rejim */}
        <div className="absolute top-3 left-4 z-30 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400">
              JDA KIMYO · 3D LAB
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md text-[10px] font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{harorat}°C</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${tarozidagiIdish ? "bg-emerald-400" : "bg-slate-500"}`} />
              <span>{tarozidagiIdish ? "Tarozi band" : "Tarozi bo'sh"}</span>
            </span>
            {kozoynakTaqilgan && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400 font-bold">🥽 Ko{"'"}zoynak</span>
              </>
            )}
            {gazNiqobiTaqilgan && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400 font-bold">🎭 Respirator</span>
              </>
            )}
          </div>
        </div>

        {/* Yuqori o'ng: 3 ta Minimalist Favqulodda Tugmalar */}
        <div className="absolute top-3 right-4 z-30 flex items-center gap-2">
          {/* Sezgirlik sozlagichi */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md text-[10px] font-mono">
            <span className="text-slate-400">Sezgirlik:</span>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={sezgirlik}
              onChange={(e) => sezgirlikniOzgartir(e.target.value)}
              className="w-14 accent-cyan-400 cursor-pointer h-1"
              title="Sichqoncha sezgirligi"
            />
            <span className="font-bold text-cyan-400">{sezgirlik.toFixed(1)}x</span>
          </div>

          {/* O'rganuvchi rejimidagi 3D yorliqlar */}
          <button
            type="button"
            onClick={() => yorliqlarniAlmashtir()}
            aria-pressed={yorliqlarYoqilgan}
            className={`h-8 px-2.5 rounded-xl flex items-center gap-1.5 border shadow-lg backdrop-blur-md transition-all bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] ${
              yorliqlarYoqilgan
                ? "text-[var(--v3-urgu)]"
                : "text-[var(--v3-xira)] opacity-70"
            }`}
            title="3D jihoz yorliqlarini yoqish / o'chirish"
          >
            <Ikon nom={yorliqlarYoqilgan ? "belgi" : "taqiq"} olcham={13} />
            <span className="text-[10px] font-mono font-bold">Yorliqlar</span>
          </button>

          {/* Ovoz tugmasi */}
          <button
            type="button"
            onClick={() => setOvozYoqilgan(!ovozYoqilgan)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-lg backdrop-blur-md transition-all ${
              ovozYoqilgan
                ? "bg-slate-950/80 border-slate-800 text-cyan-400 hover:border-cyan-400"
                : "bg-red-950/60 border-red-800 text-red-400"
            }`}
            title="Ovozni yoqish / o'chirish (M)"
          >
            <Ikon nom={ovozYoqilgan ? "kanal" : "taqiq"} olcham={14} />
          </button>

          {/* Amaliy mashg'ulot tugmasi.
              ILGARI BU TUGMA YO'Q EDI: `AmaliyMashgulotModal` yozilgan,
              lekin uni hech kim chaqirmasdi — ya'ni butun amaliy
              mashg'ulotlar tizimi ochib bo'lmaydigan holatda edi. */}
          <button
            type="button"
            onClick={() => setMashgulotOchilgan(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg text-[11px] font-mono font-bold text-amber-400 hover:border-amber-400 backdrop-blur-md flex items-center gap-1.5 transition-all"
            title="Amaliy mashg'ulotlar"
          >
            <Ikon nom="quiz" olcham={13} />
            <span>Mashg{"'"}ulot</span>
          </button>

          {/* Yordam & Boshqaruv qo'llanmasi tugmasi */}
          <button
            type="button"
            onClick={() => setYordamOchilgan(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg text-[11px] font-mono font-bold text-emerald-400 hover:border-emerald-400 backdrop-blur-md flex items-center gap-1.5 transition-all"
            title={ISH.qollanmaSarlavha}
          >
            <Ikon nom="kitob" olcham={13} />
            <span>{ISH.qollanma}</span>
          </button>

          {/* 2D Labga qaytish / Chiqish */}
          <Link
            href="/laboratoriya"
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg text-[11px] font-mono font-bold text-slate-300 hover:text-white hover:border-slate-600 backdrop-blur-md flex items-center gap-1 transition-all"
            title="2D Laboratoriyaga qaytish (ESC)"
          >
            <Ikon nom="chap" olcham={12} />
            <span>2D Lab</span>
          </Link>
        </div>

        {/* --- EKRAN MARKAZIDAGI CROSSHAIR VA JISMONIY CYBER-HUD PROMPT --- */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-20">
          {/* Markaziy nishoncha (Crosshair) */}
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ${
              fpsKontekstMatn
                ? "bg-cyan-400 scale-150 shadow-[0_0_14px_#38bdf8] ring-2 ring-cyan-300/40"
                : "bg-white/80 scale-100 shadow-[0_0_8px_#ffffff]"
            }`}
          />

          {qarashXabari && (
            <div className="mt-3 px-3 py-1 rounded-lg border border-amber-400/60 bg-slate-950/90 text-amber-200 text-[10px] font-mono font-bold shadow-lg backdrop-blur-md">
              {qarashXabari}
              {qarashRejimi === "zaxira" ? " · zaxira" : ""}
            </div>
          )}

          {/* Dinamik In-World Kontekst Yordamchisi */}
          {fpsKontekstMatn && (
            <div
              className={`mt-4 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2 ${
                fpsKontekstTuri === "urgu"
                  ? "bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : fpsKontekstTuri === "yuvish"
                  ? "bg-sky-950/90 border-sky-400 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                  : fpsKontekstTuri === "quyish"
                  ? "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                  : fpsKontekstTuri === "olish"
                  ? "bg-purple-950/90 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                  : "bg-slate-950/90 border-slate-700 text-slate-200"
              }`}
            >
              <span>{fpsKontekstMatn}</span>
            </div>
          )}
        </div>

        {/* --- MOBIL PUBG USLUBIDAGI DUAL SENSORLI ANALOG JOYSTIK --- */}
        <VirtualJoystick
          onHarakat={handleJoystickHarakat}
          onBurilish={handleJoystickBurilish}
          qaralganIdish={fpsQaralganIdish}
          qolIdish={fpsQolIdish}
          onQolgaOlYokiQoy={qolgaOlYokiQoy}
          onQuyish={() => {
            if (fpsQolIdish && fpsQaralganIdish) {
              quyishBoshla(fpsQolIdish.userData?.kalit, fpsQaralganIdish, fpsQolIdish, 45);
            }
          }}
          // Aniq doza — klaviaturadagi 1..5 bilan AYNI yo'ldan ketadi
          // (`aniqHajmQuy`), shuning uchun server tekshiruvi va
          // stexiometriya ikkalasida ham bir xil ishlaydi.
          onAniqDoza={(ml) => {
            if (fpsQolIdish && fpsQaralganIdish) {
              aniqHajmQuy(fpsQolIdish.userData?.kalit, fpsQaralganIdish, ml);
            }
          }}
        />

        {/* --- O'NG PASTKI BURCHAK: QO'LDAGI IDISH HUD KARTASI --- */}
        {fpsQolIdish && (
          <div className="absolute bottom-4 right-4 z-30 w-72 rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl bg-slate-950/90 border-slate-800/90 space-y-2 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Ikon nom="kolba" olcham={14} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Qo{"'"}lda ushlab turilgan:
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {fpsQolIdish.userData?.nom || fpsQolIdish.userData?.kalit}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {fpsQolIdish.userData?.devorShishasi ? (
                  <button
                    type="button"
                    onClick={() => {
                      javongaQaytar();
                      setFpsQolIdish(null);
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                    title="Shishani devor javoniga qaytarish [G]"
                  >
                    [G] Javonga
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => qolgaOlYokiQoy("stolga_qoy")}
                    className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all"
                    title="Stolga qo'yish [G]"
                  >
                    [G] Stolga
                  </button>
                )}
              </div>
            </div>

            {/* Spatula yoki Shisha tayoqcha holati */}
            {fpsQolIdish.userData?.kalit === "spatula" && (
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono">
                {spatulaKukun ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span>🧂</span> Spatulada: 1.0g {spatulaKukun} kukuni
                  </span>
                ) : (
                  <span className="text-slate-400">🧂 Spatula bo{"'"}sh (Tuz shishasidan kukun oling)</span>
                )}
              </div>
            )}

            {fpsQolIdish.userData?.kalit === "shisha-tayoqcha" && (
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">
                🌀 Shisha tayoqcha (Probirkani aralashtirish uchun bosing)
              </div>
            )}

            {/* Agar devor reagent shishasi bo'lsa -> Tezkor doza klavishlari */}
            {fpsQolIdish.userData?.devorShishasi && (
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="text-[9px] font-mono text-slate-400 flex justify-between">
                  <span>Aniq hajm quyish:</span>
                  <span className="text-cyan-400 font-bold">Klavishlar: 1 - 5</span>
                </div>
                <div className="grid grid-cols-5 gap-1 font-mono text-[10px] text-center">
                  {[
                    { ml: 1, k: "1" },
                    { ml: 5, k: "2" },
                    { ml: 10, k: "3" },
                    { ml: 25, k: "4" },
                    { ml: 50, k: "5" },
                  ].map(({ ml, k }) => (
                    <button
                      key={ml}
                      type="button"
                      onClick={() => {
                        if (nishonIdishGroup) {
                          aniqHajmQuy(fpsQolIdish.userData?.kalit, nishonIdishGroup, ml);
                        }
                      }}
                      className="py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition-all"
                    >
                      +{ml}ml
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Agar idishda moddalar bo'lsa */}
            {quyilganKalitlar.length > 0 && !fpsQolIdish.userData?.devorShishasi && (
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Tarkib:</span>
                  <span className="text-emerald-400 font-bold">{jamiMl.toFixed(1)} ml</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {quyilganKalitlar.map((k) => (
                    <span
                      key={k}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {k}: {quyilganModdalar[k]?.ml?.toFixed(1)}ml
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
    </>
  );
}
