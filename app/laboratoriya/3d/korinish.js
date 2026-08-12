"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";
import { useSahna } from "./hooks/useSahna.js";
import { useSudrash } from "./hooks/useSudrash.js";
import { useQuyish } from "./hooks/useQuyish.js";
import { useTajriba } from "./hooks/useTajriba.js";
import ReagentJavoni from "./components/ReagentJavoni.jsx";
import JihozJavoni from "./components/JihozJavoni.jsx";
import NatijaPaneli from "./components/NatijaPaneli.jsx";
import MobilOgohlantirish from "./components/MobilOgohlantirish.jsx";
import SifatAnalizPaneli from "./components/SifatAnalizPaneli.jsx";
import MolekulaZoomModal from "./components/MolekulaZoomModal.jsx";
import PHMeterUI from "./components/PHMeterUI.jsx";
import TaroziUI from "./components/TaroziUI.jsx";
import EritmaTayyorlashModal from "./components/EritmaTayyorlashModal.jsx";
import XonaNavigatsiyaUI from "./components/XonaNavigatsiyaUI.jsx";
import SandiqOchishModal from "./components/SandiqOchishModal.jsx";
import XavfsizlikModal from "./components/XavfsizlikModal.jsx";
import KristallPanjaraModal from "./components/KristallPanjaraModal.jsx";
import { zonagaOt } from "./lib/xona-zonalari.js";
import { portlashniAniqla } from "./lib/portlash.js";
import { labDaftariPdfYukla } from "./lib/pdf-hisobot.js";
import { pufakchaChiqishi } from "./lib/ovoz.js";
import { idishYarat, tozala, jamiHajm } from "./lib/idish-holati.js";
import { jurnalYarat } from "./lib/jurnal.js";
import { suyuqlikSathiniYangila } from "./lib/jihoz-modellari.js";
import { moddaKorinishi } from "./lib/modda-korinishi.js";
import { reagentBirligi, hajmniBirlikka, miqdorniFormatla } from "@/lib/lab-birlik.js";

function hexDanCss(hex) {
  return `#${Number(hex || 0xffffff).toString(16).padStart(6, "0")}`;
}

const YUZA = {
  background: "var(--v3-yuza)",
  borderColor: "var(--v3-chiziq)",
  color: "var(--v3-matn)",
};

export default function Korinish() {
  const [labMaLumot, setLabMaLumot] = useState(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [kirilmagan, setKirilmagan] = useState(false);
  const [yuklashXatosi, setYuklashXatosi] = useState(false);

  // Faol tanlovlar va holatlar
  const [faolReagent, setFaolReagent] = useState(null);
  const [aralashmaOzgarish, setAralashmaOzgarish] = useState(0);
  const [mobilJavon, setMobilJavon] = useState(null);
  const [sifatAnalizOchilgan, setSifatAnalizOchilgan] = useState(false);
  const [molekulaModalKalit, setMolekulaModalKalit] = useState(null);
  const [isitimoda, setIsitimoda] = useState(false);
  const [harorat, setHarorat] = useState(25);
  const [phMeterOchilgan, setPhMeterOchilgan] = useState(false);
  const [taroziOchilgan, setTaroziOchilgan] = useState(false);
  const [eritmaOchilgan, setEritmaOchilgan] = useState(false);
  const [sandiqOchilgan, setSandiqOchilgan] = useState(false);
  const [portlashMaLumot, setPortlashMaLumot] = useState(null);
  const [kristallPanjaraOchilgan, setKristallPanjaraOchilgan] = useState(false);
  const [faolZona, setFaolZona] = useState('asosiy');

  const handleZonaTanlandi = (zonaKaliti) => {
    setFaolZona(zonaKaliti);
    if (kameraRef?.current && controlsRef?.current) {
      zonagaOt(kameraRef.current, controlsRef.current, zonaKaliti);
    }
  };

  // Spirtovkada isitish
  useEffect(() => {
    let timer = null;
    if (isitimoda) {
      pufakchaChiqishi();
      timer = setInterval(() => {
        setHarorat((prev) => {
          if (prev >= 100) {
            pufakchaChiqishi();
            return 100;
          }
          return prev + 5;
        });
      }, 800);
    } else {
      setHarorat(25);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isitimoda]);

  const [fonKaliti, fonniOzgartir] = useFon();

  const holatRef = useRef(idishYarat("probirka", 0));
  const jurnalRef = useRef(jurnalYarat());
  const konteynerRef = useRef(null);

  // 1. 3D Sahna
  const {
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    jihozQosh,
    jihozOlib,
    hammaJihozlar,
    kuchsizQurilma,
  } = useSahna(konteynerRef, yuklanmoqda, fonKaliti);

  // 2. Erkin Ko'tarish va Sudrash hooki (1-Bosqich)
  const handleIdishTanlandi = useCallback((group) => {
    if (group && group.userData?.kalit) {
      holatRef.current.idish = group.userData.kalit;
    }
  }, []);

  const {
    tanlanganIdish,
    setTanlanganIdish,
    kotarilganIdish,
    kursorIdish,
    yaqinNishon,
    sudralmoqda,
    idishniJoyigaQoy,
  } = useSudrash({
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    onIdishTanlandi: handleIdishTanlandi,
  });

  const nishonIdishGroup = yaqinNishon || tanlanganIdish || hammaJihozlar[0] || null;

  // 3. O'zgaruvchan tezlikdagi quyish hooki (1-Bosqich)
  const handleHolatOzgardimi = useCallback(() => {
    setAralashmaOzgarish((s) => s + 1);
  }, []);

  const {
    quyishBoshla,
    quyishToxtat,
    burchakniOrnat,
    egishBurchagi,
    quyilmoqda,
    quyishTezligiMl,
  } = useQuyish({
    sahnaRef,
    holatRef,
    jurnalRef,
    onOzgarish: handleHolatOzgardimi,
  });

  // 4. Lab ma'lumotlarini yuklash
  const yuklaLab = useCallback(async () => {
    setYuklanmoqda(true);
    setKirilmagan(false);
    setYuklashXatosi(false);

    try {
      const res = await fetch("/api/laboratoriya");
      if (res.status === 401) {
        setKirilmagan(true);
        setYuklanmoqda(false);
        return;
      }
      if (!res.ok) {
        setYuklashXatosi(true);
        setYuklanmoqda(false);
        return;
      }
      const data = await res.json();
      setLabMaLumot(data);
    } catch (e) {
      setYuklashXatosi(true);
    } finally {
      setYuklanmoqda(false);
    }
  }, []);

  useEffect(() => {
    yuklaLab();
  }, [yuklaLab]);

  // 5. Tajriba o'tkazish
  const {
    otkaz,
    otkazilmoqda,
    natija,
    tanlov,
    xato,
    nisbatBahosi,
    hisobotMatni,
    kinetika,
    setNatija,
    setTanlov,
    setXato,
  } = useTajriba({
    sahnaRef,
    holatRef,
    jurnalRef,
    holatniYangila: yuklaLab,
  });

  useEffect(() => {
    if (!natija?.reaksiya) return;
    const res = portlashniAniqla(natija.reaksiya, harorat);
    if (res.portladi) setPortlashMaLumot(res);
  }, [natija, harorat]);

  const handleTozalash = () => {
    holatRef.current = tozala(holatRef.current);
    jurnalRef.current = jurnalYarat();
    if (nishonIdishGroup) {
      suyuqlikSathiniYangila(nishonIdishGroup, 0, null, 0);
    }
    setNatija(null);
    setTanlov(null);
    setXato(null);
    setAralashmaOzgarish((s) => s + 1);
  };

  // 2-BOSQICH: Yangi tayyorlangan standart eritmani 3D stolga va holatga joylashtirish
  const handleEritmaTayyorlandi = (eritmaData) => {
    let target = nishonIdishGroup;
    if (!target) {
      target = jihozQosh('kolba');
    }
    if (target) {
      const qoshilganMl = eritmaData.hajmMl || 100;
      const qoshilganMol = Number((qoshilganMl * (eritmaData.molyarlik / 1000)).toFixed(6));

      const yangiModdalar = {
        ...holatRef.current.moddalar,
        [eritmaData.reagent]: {
          ml: qoshilganMl,
          mol: qoshilganMol,
          konsentratsiya: eritmaData.molyarlik,
        }
      };

      holatRef.current = {
        ...holatRef.current,
        idish: target.userData?.kalit || 'kolba',
        moddalar: yangiModdalar,
        hajm: qoshilganMl,
      };

      suyuqlikSathiniYangila(target, qoshilganMl, { rang: eritmaData.rang, shaffoflik: 0.85 });

      yoz(jurnalRef.current, {
        amal: "eritma_tayyorlash",
        reagent: eritmaData.reagent,
        ml: qoshilganMl,
        molyarlik: eritmaData.molyarlik,
      });

      setAralashmaOzgarish((s) => s + 1);
    }
  };

  const inventar = labMaLumot?.inventar || [];
  const reagentlar = inventar.filter((i) => i.turi === "reagent");
  const jihozlar = inventar.filter((i) => i.turi === "jihoz");

  const quyilganModdalar = holatRef.current?.moddalar || {};
  const quyilganKalitlar = Object.keys(quyilganModdalar);
  const jamiMl = jamiHajm(holatRef.current);

  if (kirilmagan) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center p-6 text-[var(--v3-matn)] bg-[var(--v3-fon)]"
      >
        <div className="v3-panel-karta max-w-sm w-full text-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="qulf" olcham={24} />
          </div>
          <h2 className="text-xl font-bold text-[var(--v3-matn)]">
            Tizimga Kirish Talab Etiladi
          </h2>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            3D virtual laboratoriyadan erkin foydalanish va tajribalarni o{"'"}tkazish uchun hisobingizga kiring.
          </p>
          <a
            href="/login?callbackUrl=/laboratoriya/3d"
            className="v3-tugma v3-tugma-asosiy w-full justify-center text-xs py-2.5 font-bold"
          >
            Kirish →
          </a>
          <a href="/laboratoriya" className="text-xs text-[var(--v3-xira)] hover:underline block pt-2">
            ← 2D Laboratoriyaga qaytish
          </a>
        </div>
      </div>
    );
  }

  if (yuklanmoqda) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-[var(--v3-matn)] bg-[var(--v3-fon)]">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">3D Laboratoriya sahnasi yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (yuklashXatosi) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-[var(--v3-matn)] bg-[var(--v3-fon)]">
        <div className="v3-panel-karta max-w-sm w-full text-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Ikon nom="taqiq" olcham={24} />
          </div>
          <h2 className="text-lg font-bold text-[var(--v3-matn)]">
            Ma{"'"}lumot Yuklanmadi
          </h2>
          <p className="text-xs text-[var(--v3-xira)]">
            Laboratoriya serveri bilan bog{"'"}lanishda xatolik yuz berdi.
          </p>
          <button
            type="button"
            onClick={yuklaLab}
            className="v3-tugma v3-tugma-asosiy w-full justify-center text-xs py-2.5 font-bold"
          >
            Qayta Urinish
          </button>
        </div>
      </div>
    );
  }

  const balans = labMaLumot?.balans || { coins: 0, gems: 0, stars: 0 };
  const lab = labMaLumot?.lab || {};
  const daraja = lab.darajaHolati || { daraja: 1, joriy: 0, kerak: 100, foiz: 0 };

  return (
    <div
      data-fon={fonKaliti}
      className="v3 flex h-screen w-screen flex-col overflow-hidden text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200"
    >
      <MobilOgohlantirish />

      {/* --- YUQORI HEADER --- */}
      <header
        className="relative z-40 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 backdrop-blur-md bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq)]"
      >
        <div className="flex items-center gap-3">
          <Link href="/laboratoriya" className="v3-tugma text-xs py-1.5 px-3">
            <Ikon nom="chap" olcham={14} />
            <span>2D Lab</span>
          </Link>
          <h1 className="flex items-center gap-2 text-sm font-bold tracking-wide sm:text-base">
            <Ikon nom="kolba" olcham={18} className="text-[var(--v3-urgu)]" />
            <span>3D Laboratoriya</span>
            {kuchsizQurilma && <span className="v3-tag text-[10px]">Ixcham rejim</span>}
          </h1>
        </div>

        {/* Asboblar va vidjetlar tugmalari */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPhMeterOchilgan(!phMeterOchilgan)}
            className={`v3-tugma text-xs font-bold transition ${
              phMeterOchilgan ? "v3-tugma-asosiy" : ""
            }`}
          >
            <Ikon nom="atom" olcham={13} />
            pH-Metr
          </button>

          <button
            type="button"
            onClick={() => setTaroziOchilgan(!taroziOchilgan)}
            className={`v3-tugma text-xs font-bold transition ${
              taroziOchilgan ? "v3-tugma-asosiy" : ""
            }`}
          >
            <Ikon nom="orin" olcham={13} />
            Tarozi
          </button>

          <button
            type="button"
            onClick={() => setKristallPanjaraOchilgan(!kristallPanjaraOchilgan)}
            className={`v3-tugma text-xs font-bold transition ${
              kristallPanjaraOchilgan ? "v3-tugma-asosiy" : ""
            }`}
          >
            <Ikon nom="doska" olcham={13} />
            Kristall Panjara
          </button>

          <button
            type="button"
            onClick={() => setSandiqOchilgan(!sandiqOchilgan)}
            className="v3-tugma text-xs font-bold text-yellow-400"
          >
            <Ikon nom="orin" olcham={13} />
            Sandiqlar
          </button>

          <button
            type="button"
            onClick={() => setEritmaOchilgan(true)}
            className="v3-tugma v3-tugma-asosiy text-xs font-bold"
            title="Qattiq moddalarni tortib aniq molyar eritma tayyorlash"
          >
            <Ikon nom="kolba" olcham={13} />
            Eritma Tayyorlash
          </button>

          <button
            type="button"
            onClick={() => setSifatAnalizOchilgan(!sifatAnalizOchilgan)}
            className={`v3-tugma text-xs font-bold ${
              sifatAnalizOchilgan ? "v3-tugma-asosiy" : ""
            }`}
          >
            <Ikon nom="quiz" olcham={13} />
            Sifat Analizi
          </button>

          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />

          {/* Balans */}
          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-1 text-xs font-mono font-bold bg-[var(--v3-yuza)] border-[var(--v3-chiziq)]"
          >
            <span className="flex items-center gap-1 text-yellow-400">
              <span>🪙</span> {balans.coins || 0}
            </span>
            <span className="text-[var(--v3-chiziq)]">|</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span>💎</span> {balans.gems || 0}
            </span>
          </div>
        </div>
      </header>

      {/* --- ASOSIY ISH MAYDONI --- */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Chap panel: Javonlar */}
        <aside
          className="hidden w-80 shrink-0 flex-col gap-3 border-r p-3 md:flex border-[var(--v3-chiziq)] bg-[var(--v3-fon)]"
        >
          <div className="h-1/2 overflow-hidden">
            <ReagentJavoni
              reagentlar={reagentlar}
              faol={faolReagent}
              onTanla={setFaolReagent}
              quyilgan={quyilganModdalar}
            />
          </div>
          <div className="h-1/2 overflow-hidden">
            <JihozJavoni
              jihozlar={jihozlar}
              stolda={hammaJihozlar}
              onQosh={(kalit) => jihozQosh(kalit)}
              onOlib={(kalit) => jihozOlib(kalit)}
            />
          </div>
        </aside>

        {/* Mobil javon tugmalari */}
        <div
          className="flex gap-2 border-b p-2 md:hidden bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)]"
        >
          <button
            type="button"
            onClick={() => setMobilJavon(mobilJavon === "reagentlar" ? null : "reagentlar")}
            className="v3-tugma flex-1 justify-center text-xs"
          >
            Reagentlar ({reagentlar.length})
          </button>
          <button
            type="button"
            onClick={() => setMobilJavon(mobilJavon === "jihozlar" ? null : "jihozlar")}
            className="v3-tugma flex-1 justify-center text-xs"
          >
            Jihozlar ({hammaJihozlar.length}/6)
          </button>
        </div>

        {/* Mobil ochiluvchi javon */}
        {mobilJavon && (
          <div
            className="absolute inset-x-0 top-12 z-40 h-80 p-3 shadow-2xl md:hidden bg-[var(--v3-fon-2)]"
          >
            {mobilJavon === "reagentlar" ? (
              <ReagentJavoni
                reagentlar={reagentlar}
                faol={faolReagent}
                onTanla={(kalit) => {
                  setFaolReagent(kalit);
                  setMobilJavon(null);
                }}
                quyilgan={quyilganModdalar}
              />
            ) : (
              <JihozJavoni
                jihozlar={jihozlar}
                stolda={hammaJihozlar}
                onQosh={(kalit) => {
                  jihozQosh(kalit);
                  setMobilJavon(null);
                }}
                onOlib={(kalit) => jihozOlib(kalit)}
              />
            )}
          </div>
        )}

        {/* --- 3D CANVAS VA HUD MAYDONI --- */}
        <main className="relative h-full min-h-[350px] w-full flex-1 overflow-hidden">
          <div ref={konteynerRef} className="absolute inset-0 h-full w-full" />

          {/* 4-BOSQICH: XONA ZONALARI NAVIGATSIYASI */}
          <XonaNavigatsiyaUI
            faolZona={faolZona}
            onZonaTanlandi={handleZonaTanlandi}
          />

          {/* 1-BOSQICH: 3D Interaktiv Ko'rsatma / Status */}
          <div
            className="pointer-events-none absolute left-4 top-4 z-20 rounded-xl border px-3 py-1.5 text-xs backdrop-blur-md bg-[var(--v3-fon-2)]/90 border-[var(--v3-chiziq)] space-y-0.5"
          >
            <div className="font-bold text-[var(--v3-matn)] flex items-center gap-1.5">
              <Ikon nom="kolba" olcham={14} className="text-[var(--v3-urgu)]" />
              <span>
                {kotarilganIdish
                  ? `${kotarilganIdish.userData?.kalit || "Idish"} ko'tarildi`
                  : faolReagent
                  ? `${faolReagent} tanlandi`
                  : "Idishni bosing yoki sudrang"}
              </span>
            </div>
            {yaqinNishon && (
              <div className="text-[11px] text-emerald-400 font-mono">
                🎯 Nishon: {yaqinNishon.userData?.kalit || "Idish"}
              </div>
            )}
          </div>

          {/* 1-BOSQICH: ERKIN KO'TARISH VA QUYISH BOSHQARUVI (FLOATING HUD) */}
          {(kotarilganIdish || faolReagent) && nishonIdishGroup && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md rounded-2xl border p-4 shadow-2xl backdrop-blur-xl bg-[var(--v3-fon-2)]/95 border-[var(--v3-urgu)] space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--v3-urgu)]">
                    1-Bosqich: Aniq Quyish va Egish
                  </div>
                  <div className="text-xs font-bold text-[var(--v3-matn)] truncate">
                    {kotarilganIdish ? kotarilganIdish.userData?.kalit : faolReagent} ➔ {nishonIdishGroup.userData?.kalit || "Probirka"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {quyishTezligiMl > 0 && (
                    <span className="v3-tag v3-tag-ochiq font-mono font-bold">
                      {quyishTezligiMl} ml/s
                    </span>
                  )}
                  {kotarilganIdish && (
                    <button
                      type="button"
                      onClick={() => idishniJoyigaQoy()}
                      className="v3-tugma text-[11px] py-1 px-2.5"
                    >
                      Stolga qo{"'"}yish
                    </button>
                  )}
                </div>
              </div>

              {/* Egish Burchagi Slideri */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-[var(--v3-xira)]">
                  <span>Egish burchagi:</span>
                  <strong className="text-[var(--v3-matn)]">{egishBurchagi}°</strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="80"
                  value={egishBurchagi}
                  onChange={(e) => {
                    const b = parseInt(e.target.value) || 0;
                    burchakniOrnat(b);
                    if (b > 18 && !quyilmoqda) {
                      quyishBoshla(faolReagent, nishonIdishGroup, kotarilganIdish, b);
                    } else if (b <= 18 && quyilmoqda) {
                      quyishToxtat();
                    }
                  }}
                  className="w-full accent-[var(--v3-urgu)] cursor-pointer"
                />
              </div>

              {/* Tezkor burchak bosqichlari */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { b: 0, nom: "Tekis (0°)" },
                  { b: 24, nom: "Tomchi (24°)" },
                  { b: 48, nom: "O'rtacha (48°)" },
                  { b: 76, nom: "Tez (76°)" },
                ].map(({ b, nom }) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      burchakniOrnat(b);
                      if (b > 18) {
                        quyishBoshla(faolReagent, nishonIdishGroup, kotarilganIdish, b);
                      } else {
                        quyishToxtat();
                      }
                    }}
                    className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                      egishBurchagi === b
                        ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)]"
                        : "bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]"
                    }`}
                  >
                    {nom}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* O'ng panel: Natija va Jurnal */}
        <NatijaPaneli
          natija={natija}
          tanlov={tanlov}
          xato={xato}
          hisobot={hisobotMatni}
          nisbatBahosi={nisbatBahosi}
          kinetika={kinetika}
          onYop={() => {
            setNatija(null);
            setTanlov(null);
            setXato(null);
          }}
          onTanlovTanla={(reactionId) => otkaz(reactionId, nishonIdishGroup)}
          onQaytaUrin={() => {
            setXato(null);
            otkaz(null, nishonIdishGroup);
          }}
          onMolekulaZoom={(kalit) => setMolekulaModalKalit(kalit || "H₂O")}
          onPdfYukla={async () => {
            const res = await labDaftariPdfYukla({
              foydalanuvchiNom: labMaLumot?.foydalanuvchi?.ism || "Talaba",
              tenglama: natija?.reaksiya?.equation,
              observations: natija?.reaksiya?.observations,
              nisbat: nisbatBahosi,
              jurnal: jurnalRef?.current?.yozuvlar,
            });
            if (res && !res.ochildi && res.sabab !== "server") {
              setXato(res.sabab);
            }
          }}
        />
      </div>

      {/* --- PASTKI BOSHQARUV PANELI --- */}
      <footer
        className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 backdrop-blur-md bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="v3-nishon">
              Joriy idish: {nishonIdishGroup?.userData?.kalit || "Probirka"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-[var(--v3-urgu)]">
                {jamiMl.toFixed(1)} ml
              </span>
              <span className="text-xs text-[var(--v3-xira)] font-mono">({quyilganKalitlar.length} xil modda)</span>
            </div>
          </div>

          <div className="hidden flex-wrap gap-1 sm:flex">
            {quyilganKalitlar.map((kalit) => {
              const ml = quyilganModdalar[kalit]?.ml || 0;
              const birlik = reagentBirligi(kalit);
              const rang = hexDanCss(moddaKorinishi(kalit).rang);
              return (
                <span
                  key={kalit}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs bg-[var(--v3-yuza)] border-[var(--v3-chiziq)]"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: rang }} />
                  {kalit}{" "}
                  <strong className="text-[var(--v3-urgu)] font-mono">
                    {miqdorniFormatla(hajmniBirlikka(ml, birlik), birlik)}
                  </strong>
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Spirtovka bilan isitish */}
          <button
            type="button"
            onClick={() => setIsitimoda(!isitimoda)}
            className={`v3-tugma text-xs font-bold transition ${
              isitimoda ? "border-amber-500 bg-amber-500/20 text-amber-400" : ""
            }`}
          >
            🔥 {isitimoda ? `Isitilmoqda (${harorat}°C)` : "Isitish (Spirtovka)"}
          </button>

          {/* Reaksiyani tekshirish */}
          <button
            type="button"
            disabled={jamiMl <= 0 || otkazilmoqda}
            onClick={() => otkaz(null, nishonIdishGroup)}
            className="v3-tugma v3-tugma-asosiy text-xs font-bold disabled:opacity-40"
          >
            <Ikon nom="atom" olcham={14} />
            <span>{otkazilmoqda ? "O'tkazilmoqda..." : "Tajriba o'tkazish"}</span>
          </button>

          {/* Tozalash */}
          <button
            type="button"
            disabled={jamiMl <= 0 && !natija && !xato}
            onClick={handleTozalash}
            className="v3-tugma text-xs text-red-400 hover:border-red-500/30"
          >
            <Ikon nom="ochir" olcham={14} />
            Tozalash
          </button>
        </div>
      </footer>

      {/* MODALLAR */}
      {molekulaModalKalit && (
        <MolekulaZoomModal
          kalit={molekulaModalKalit}
          onYop={() => setMolekulaModalKalit(null)}
        />
      )}

      {phMeterOchilgan && (
        <PHMeterUI
          moddalar={quyilganModdalar}
          onYop={() => setPhMeterOchilgan(false)}
        />
      )}

      {taroziOchilgan && (
        <TaroziUI
          idishKaliti={nishonIdishGroup?.userData?.kalit || "probirka"}
          moddalar={quyilganModdalar}
          onYop={() => setTaroziOchilgan(false)}
          onEritmaOch={() => {
            setTaroziOchilgan(false);
            setEritmaOchilgan(true);
          }}
        />
      )}

      {/* 2-BOSQICH: ERITMA TAYYORLASH STENDI */}
      {eritmaOchilgan && (
        <EritmaTayyorlashModal
          onEritmaTayyorlandi={handleEritmaTayyorlandi}
          onYop={() => setEritmaOchilgan(false)}
        />
      )}

      {sandiqOchilgan && (
        <SandiqOchishModal
          onYop={() => setSandiqOchilgan(false)}
          onOchildi={() => yuklaLab()}
        />
      )}

      {sifatAnalizOchilgan && (
        <SifatAnalizPaneli
          onYop={() => setSifatAnalizOchilgan(false)}
          onTopshiriqBoshla={() => setSifatAnalizOchilgan(false)}
        />
      )}

      {portlashMaLumot && (
        <XavfsizlikModal
          malumot={portlashMaLumot}
          onYop={() => setPortlashMaLumot(null)}
        />
      )}

      {kristallPanjaraOchilgan && (
        <KristallPanjaraModal
          onYop={() => setKristallPanjaraOchilgan(false)}
        />
      )}
    </div>
  );
}
