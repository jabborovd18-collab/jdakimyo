"use client";

import AmaliyMashgulotModal from "./AmaliyMashgulotModal.jsx";
import DavriyJadvalModal from "./DavriyJadvalModal.jsx";
import EkspertXulosaModal from "./EkspertXulosaModal.jsx";
import ElektrolizStendiUI from "./ElektrolizStendiUI.jsx";
import MolekulaZoomModal from "./MolekulaZoomModal.jsx";
import TitrlashStendiUI from "./TitrlashStendiUI.jsx";
import XRayMolekulaModal from "./XRayMolekulaModal.jsx";

import { INDIKATORLAR } from "../lib/javon-3d.js";
import { jurnaldanAmallar } from "../lib/mashgulot-kuzatuvi.js";
import { labDaftariPdfYukla } from "../lib/pdf-hisobot.js";

// MODALLAR JAVONI — 3D ob'ektga yaqinlashib bosilganda ochiladigan
// oynalar: davriy jadval, titrlash, elektroliz, ekspert xulosasi,
// rentgen, molekula va amaliy mashg'ulot.
//
// `korinish.js` dan ajratildi (BRIF-05).
//
// Hammasi bitta faylda, chunki ular bir xil naqshda ishlaydi: bayroq
// rost bo'lsa ochiladi, `onYop` uni yolg'onga qaytaradi. Modal
// qo'shish endi shu faylni ochishni talab qiladi, 900 qatorlik
// komponentni emas.
//
// [H] qo'llanma modali bu yerda YO'Q: u sahna holatiga umuman
// bog'lanmagan va o'z faylida turadi (`YordamModali.jsx`).

export default function LabModallari({
  davriyJadvalOchilgan,
  setDavriyJadvalOchilgan,
  titrlashOchilgan,
  setTitrlashOchilgan,
  elektrolizOchilgan,
  setElektrolizOchilgan,
  ekspertModalOchilgan,
  setEkspertModalOchilgan,
  xrayModalOchilgan,
  setXrayModalOchilgan,
  molekulaModalKalit,
  setMolekulaModalKalit,
  mashgulotOchilgan,
  setMashgulotOchilgan,
  natija,
  nisbatBahosi,
  kinetika,
  labMaLumot,
  jurnalRef,
  amallar,
}) {
  return (
    <>
      {davriyJadvalOchilgan && (
        <DavriyJadvalModal onYop={() => setDavriyJadvalOchilgan(false)} />
      )}

      {titrlashOchilgan && (
        <TitrlashStendiUI onYop={() => setTitrlashOchilgan(false)} />
      )}

      {elektrolizOchilgan && (
        <ElektrolizStendiUI onYop={() => setElektrolizOchilgan(false)} />
      )}

      {ekspertModalOchilgan && (
        <EkspertXulosaModal
          natija={natija}
          nisbat={nisbatBahosi}
          kinetika={kinetika}
          jurnal={jurnalRef?.current?.yozuvlar}
          foydalanuvchiNom={labMaLumot?.foydalanuvchi?.ism || "Talaba"}
          onYop={() => setEkspertModalOchilgan(false)}
          onXRayOch={() => {
            setEkspertModalOchilgan(false);
            setXrayModalOchilgan(true);
          }}
          onPdfYukla={async () => {
            await labDaftariPdfYukla({
              foydalanuvchiNom: labMaLumot?.foydalanuvchi?.ism || "Talaba",
              tenglama: natija?.reaksiya?.equation,
              observations: natija?.reaksiya?.observations,
              nisbat: nisbatBahosi,
              kinetika,
              jurnal: jurnalRef?.current?.yozuvlar,
            });
          }}
        />
      )}

      {xrayModalOchilgan && (
        <XRayMolekulaModal
          reaksiyaTenglamasi={natija?.reaksiya?.equation || "HCl + NaOH"}
          onYop={() => setXrayModalOchilgan(false)}
        />
      )}

      {molekulaModalKalit && (
        <MolekulaZoomModal
          kalit={molekulaModalKalit}
          onYop={() => setMolekulaModalKalit(null)}
        />
      )}

      {/* --- AMALIY MASHG'ULOT MODALI --- */}
      {mashgulotOchilgan && (
        <AmaliyMashgulotModal
          // Quyish amallari JURNALDAN keladi (u ikkala quyish yo'lini
          // ham yozadi), qolgan harakatlar esa `amallar` holatidan.
          // Ikkalasi birlashtiriladi — har biri o'z sohasida yagona
          // manba.
          amallar={[
            ...jurnaldanAmallar(jurnalRef?.current, INDIKATORLAR),
            ...amallar,
          ]}
          onYop={() => setMashgulotOchilgan(false)}
        />
      )}
    </>
  );
}
