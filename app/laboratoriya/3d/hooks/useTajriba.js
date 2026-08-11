"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { reagentBirligi, hajmniBirlikka } from "@/lib/lab-birlik.js";
import { effektlarniAniqla } from "../lib/kuzatuv-tahlil.js";
import { effektlarniIshgaTushir, aralashishEffekti } from "../lib/effektlar.js";
import { hisobot, yoz } from "../lib/jurnal.js";
import { PALITRA } from "@/lib/lab-modda.js";
import { suyuqlikSathiniYangila } from "../lib/jihoz-modellari.js";
import { jamiHajm } from "../lib/idish-holati.js";

// Reaksiya o'tkazishni, API bilan bog'lanishni va 3D effektlar ketma-ketligini
// boshqaruvchi asosiy hook.
// Nega so'rov darrov yuboriladi va Promise.all ishlatilmaydi: tarmoq so'rovi va 3D
// animatsiya bir vaqtda parallel o'ynashi kerak; so'rov kutib turilsa, foydalanuvchi
// ikki karra uzoq vaqt kutadi va interfeys qotib qolgandek ko'rinadi.
export function useTajriba({ sahnaRef, holatRef, jurnalRef, holatniYangila }) {
  const [otkazilmoqda, setOtkazilmoqda] = useState(false);
  const [natija, setNatija] = useState(null);
  const [tanlov, setTanlov] = useState(null);
  const [xato, setXato] = useState(null);
  const [nisbatBahosi, setNisbatBahosi] = useState(null);
  const [hisobotMatni, setHisobotMatni] = useState(null);

  const kadrIdRef = useRef(null);
  const faolEffektRef = useRef(null);

  // Animatsiya siklini tozalash yordamchisi
  const animatsiyaniTozala = useCallback(() => {
    if (kadrIdRef.current) {
      cancelAnimationFrame(kadrIdRef.current);
      kadrIdRef.current = null;
    }
    if (faolEffektRef.current && typeof faolEffektRef.current.tozala === "function") {
      faolEffektRef.current.tozala();
      faolEffektRef.current = null;
    }
  }, []);

  // Tajribani o'tkazish funksiyasi
  const otkaz = useCallback(async (reactionId = null, tanlanganIdishGroup = null) => {
    if (otkazilmoqda) return; // Ikki marta bosishdan himoya
    setOtkazilmoqda(true);
    setNatija(null);
    setTanlov(null);
    setXato(null);
    setNisbatBahosi(null);
    setHisobotMatni(null);

    const moddalarObj = holatRef?.current?.moddalar || {};
    const kalitlar = Object.keys(moddalarObj);

    // Haqiqatda quyilgan miqdor. Sahnada hamma narsa ml bilan quyiladi,
    // qattiq modda esa grammda o'lchanadi — o'tkazish lib/lab-birlik.js da.
    //
    // Ilgari serverga faqat KALITLAR ketardi: 5 ml quysang ham, 50 ml
    // quysang ham javob bir xil bo'lardi va stexiometriya bahosi ekranda
    // qolib, natijaga ta'sir qilmasdi.
    const miqdorlar = {};
    for (const kalit of kalitlar) {
      const ml = moddalarObj[kalit]?.ml || 0;
      miqdorlar[kalit] = hajmniBirlikka(ml, reagentBirligi(kalit));
    }

    if (kalitlar.length === 0) {
      setXato("Idishda reagent yo'q, avval tajriba uchun moddalardan quying.");
      setOtkazilmoqda(false);
      return;
    }

    // 1. Dastlabki yengil aralashib turish animatsiyasini yoqamiz
    animatsiyaniTozala();
    const vaqtinchaEffekt = aralashishEffekti(sahnaRef?.current, tanlanganIdishGroup, { davomiylik: 2.0 });
    faolEffektRef.current = vaqtinchaEffekt;
    let oldingiVaqt = Date.now();

    const vaqtinchaSikl = () => {
      kadrIdRef.current = requestAnimationFrame(vaqtinchaSikl);
      const hozir = Date.now();
      const dt = (hozir - oldingiVaqt) / 1000;
      oldingiVaqt = hozir;
      vaqtinchaEffekt.yangila(dt, hozir);
    };
    kadrIdRef.current = requestAnimationFrame(vaqtinchaSikl);

    try {
      // 2. Tarmoq so'rovini darrov yuboramiz
      const sorovJavobi = await fetch("/api/laboratoriya/tajriba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kalitlar,
          reactionId,
          miqdorlar,
          // Qaysi idishda ishlanayotgani. Server sig'imni tekshiradi va
          // reaksiya idishni yaroqsiz qilgan-qilmaganini hal qiladi.
          idish: holatRef?.current?.idish ?? null,
        }),
      });

      const ma_lumot = await sorovJavobi.json().catch(() => ({}));

      // Animatsiyani to'xtatamiz
      animatsiyaniTozala();

      // 3(a). Tanlov kerak bo'lsa (sharoit: harorat, katalizator)
      if (ma_lumot.tanlov && Array.isArray(ma_lumot.tanlov) && ma_lumot.tanlov.length > 0) {
        setTanlov(ma_lumot.tanlov);
        setOtkazilmoqda(false);
        return;
      }

      // 3(b). Error 400 yoki 409 holatlari: xatoni qizil sistema xatosi sifatida emas,
      // yumshoq va o'quvchi tushunadigan ohangda ko'rsatamiz
      if (!sorovJavobi.ok || ma_lumot.error) {
        const status = sorovJavobi.status;
        if (status === 409) {
          setXato("Baza band yoki server band bo'lib qoldi. Qayta urinib ko'ring.");
        } else {
          // 400 va boshqalar: idishdagi suyuqlikni xira kulrang qilamiz
          const hajm = jamiHajm(holatRef?.current);
          suyuqlikSathiniYangila(tanlanganIdishGroup, hajm, {
            rang: PALITRA.kulrang,
            shaffoflik: 0.25,
            loyqalik: 0.8,
          });

          setXato(
            ma_lumot.error ||
              "Aralashmadan kutilgan reaksiya sodir bo'lmadi, idishda xira aralashma qoldi."
          );
        }
        setOtkazilmoqda(false);
        if (typeof holatniYangila === "function") holatniYangila();
        return;
      }

      // 3(c). Muvaffaqiyatli reaksiya
      if (ma_lumot.success && ma_lumot.reaksiya) {
        // Stexiometrik baho SERVERDAN keladi.
        //
        // Ilgari uni client o'zi hisoblardi (3d/lib/stexiometriya.js) va
        // natijaga hech qanday ta'siri yo'q edi — ekranda "ortiqcha
        // quyildingiz" deb yozilardi, lekin mahsulot ham, XP ham
        // o'zgarmasdi. Endi hakam serverda: u nima sarflanishini va
        // qancha mahsulot chiqishini ham shu baho bilan hal qiladi.
        const baho = ma_lumot.nisbat || null;
        setNisbatBahosi(baho);

        // Kuzatuv matnidan effektlar massivini chiqarib, ishga tushiramiz.
        // `olindi` ham uzatiladi: kuzatuv matnida cho'kmaning rangi
        // aytilmagan bo'lsa, mahsulotning o'z rangi ishlatiladi.
        const tavsiflar = effektlarniAniqla(
          ma_lumot.reaksiya.observations,
          baho,
          ma_lumot.olindi || [],
        );
        const boshqaruvchi = effektlarniIshgaTushir(
          sahnaRef?.current,
          tanlanganIdishGroup,
          tavsiflar
        );
        faolEffektRef.current = boshqaruvchi;

        let vaqt = Date.now();
        const maxKutishMs = 5500;
        const boshlanishMs = vaqt;

        const asosiySikl = () => {
          const hozir = Date.now();
          const dt = (hozir - vaqt) / 1000;
          vaqt = hozir;

          boshqaruvchi.yangila(dt);

          if (boshqaruvchi.tugadimi() || hozir - boshlanishMs > maxKutishMs) {
            animatsiyaniTozala();
            // Jurnal hisobotini shakllantirish
            if (jurnalRef?.current) {
              yoz(jurnalRef.current, {
                amal: "reaksiya",
                reagent: ma_lumot.reaksiya.name || "Tajriba",
              });
            }
            const yakuniyHisobot = hisobot(jurnalRef?.current, ma_lumot.reaksiya, baho);
            setHisobotMatni(yakuniyHisobot);
            setNatija(ma_lumot);
            setOtkazilmoqda(false);
            if (typeof holatniYangila === "function") holatniYangila();
          } else {
            kadrIdRef.current = requestAnimationFrame(asosiySikl);
          }
        };

        kadrIdRef.current = requestAnimationFrame(asosiySikl);
      } else {
        setXato("Reaksiyani qayta ishlashda kutilmagan holat yuz berdi.");
        setOtkazilmoqda(false);
      }
    } catch (err) {
      animatsiyaniTozala();
      setXato("Tarmoq bilan aloqada xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      setOtkazilmoqda(false);
    }
  }, [otkazilmoqda, sahnaRef, holatRef, jurnalRef, holatniYangila, animatsiyaniTozala]);

  useEffect(() => {
    return () => {
      animatsiyaniTozala();
    };
  }, [animatsiyaniTozala]);

  return {
    otkaz,
    otkazilmoqda,
    natija,
    tanlov,
    xato,
    nisbatBahosi,
    hisobotMatni,
    setNatija,
    setTanlov,
    setXato,
  };
}