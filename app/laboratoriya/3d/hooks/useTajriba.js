"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { reagentBirligi, hajmniBirlikka, birlikdanHajmga } from "@/lib/lab-birlik.js";
import { effektlarniAniqla } from "../lib/kuzatuv-tahlil.js";
import { effektlarniIshgaTushir, aralashishEffekti } from "../lib/effektlar.js";
import { hisobot, yoz } from "../lib/jurnal.js";
import { PALITRA } from "@/lib/lab-modda.js";
import { suyuqlikSathiniYangila } from "../lib/jihoz-modellari.js";
import { jamiHajm, idishHolatiniOl, idishHolatiniYoz } from "../lib/idish-holati.js";
import { aralashmaRangi } from "../lib/rang-aralashtirish.js";
import { moddaKorinishi } from "../lib/modda-korinishi.js";
import { pufakchaChiqishi, chokmaTushishi } from "../lib/ovoz.js";
import { kinetikaniBaho } from "../lib/reaksiya-kinetikasi.js";

// Reaksiyadan keyin idish tarkibini serverdan kelgan mahsulotlarga almashtiradi
// va suyuqlik/cho'kma sathini yangi tarkibga moslaydi.
//
// Miqdor SERVERNIKI: `olindi[].miqdor` unum bilan hisoblangan haqiqiy chiqim
// (lib/tajriba.js), client uni faqat ml ga o'tkazib ko'rsatadi. Harorat
// saqlanadi — issiq idish reaksiyadan keyin sovib qolmaydi.
function mahsulotgaAlmashtir(group, eskiHolat, olindi) {
  if (!group) return;

  const moddalar = {};
  for (const m of olindi) {
    if (!m?.kalit) continue;
    // Gaz idishda QOLMAYDI — u pufak effekti bilan chiqib ketdi. Holatga
    // yozilsa keyingi reaksiya qidiruviga "sharpa reagent" bo'lib kirardi.
    if (moddaKorinishi(m.kalit).holat === "gaz") continue;
    const ml = birlikdanHajmga(m.miqdor ?? 0, m.birlik ?? "ml");
    if (ml <= 0) continue;
    moddalar[m.kalit] = { ml: Number(ml.toFixed(3)), mol: 0 };
  }

  const jami = Object.values(moddalar).reduce((j, m) => j + m.ml, 0);
  const yangiHolat = {
    ...eskiHolat,
    idish: group.userData?.kalit || eskiHolat?.idish || "probirka",
    moddalar,
    hajm: Number(jami.toFixed(3)),
  };
  idishHolatiniYoz(group, yangiHolat);

  // Suyuqlik va cho'kma sathi yangi tarkibdan hisoblanadi: qattiq mahsulot
  // (Cu(OH)₂↓) cho'kma qatlami bo'lib qoladi, suyuqlik (Na₂SO₄ eritmasi)
  // rangini aralashma qoidasi beradi. Effekt tugagach qatlam YO'QOLMAYDI —
  // ilgari cho'kma faqat animatsiya umri davomida ko'rinardi.
  let suyuqMl = 0;
  let chokmaMl = 0;
  let chokmaRang = null;
  for (const [kalit, m] of Object.entries(moddalar)) {
    const korinish = moddaKorinishi(kalit);
    if (korinish.holat === "qattiq") {
      chokmaMl += m.ml;
      chokmaRang = korinish.rang;
    } else if (korinish.holat !== "gaz") {
      suyuqMl += m.ml;
    }
  }

  const suyuqHolat = { ...yangiHolat, moddalar: {} };
  for (const [kalit, m] of Object.entries(moddalar)) {
    if (moddaKorinishi(kalit).holat === "suyuq") suyuqHolat.moddalar[kalit] = m;
  }
  const rangObj = suyuqMl > 0 ? aralashmaRangi(suyuqHolat) : null;

  suyuqlikSathiniYangila(
    group,
    suyuqMl,
    rangObj,
    chokmaMl,
    chokmaRang ?? undefined,
  );

  return yangiHolat;
}

// Reaksiya o'tkazishni, API bilan bog'lanishni va 3D effektlar ketma-ketligini
// boshqaruvchi asosiy hook.
// Nega so'rov darrov yuboriladi va Promise.all ishlatilmaydi: tarmoq so'rovi va 3D
// animatsiya bir vaqtda parallel o'ynashi kerak; so'rov kutib turilsa, foydalanuvchi
// ikki karra uzoq vaqt kutadi va interfeys qotib qolgandek ko'rinadi.
export function useTajriba({ sahnaRef, jurnalRef, holatniYangila }) {
  const [otkazilmoqda, setOtkazilmoqda] = useState(false);
  const [natija, setNatija] = useState(null);
  const [tanlov, setTanlov] = useState(null);
  const [xato, setXato] = useState(null);
  const [nisbatBahosi, setNisbatBahosi] = useState(null);
  const [hisobotMatni, setHisobotMatni] = useState(null);
  const [kinetika, setKinetika] = useState(null);

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

    // Reaksiya faqat tanlangan idishning O'Z holatiga asoslanadi — global
    // holat emas. Shunday qilib boshqa idishdagi tarkib aralashmaydi.
    const idishHolat = idishHolatiniOl(tanlanganIdishGroup, tanlanganIdishGroup?.userData?.kalit);
    const moddalarObj = idishHolat?.moddalar || {};
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
          idish: idishHolat?.idish ?? null,
          // Idishning hozirgi harorati. Termik reaksiya (Cu(OH)₂ → CuO)
          // sovuq idishda boshlanmasligini SERVER hal qiladi — client
          // faqat o'lchov yuboradi (AGENTS.md 2).
          harorat: idishHolat?.harorat ?? null,
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
        } else if (ma_lumot.kod === "sovuq") {
          // Idish hali qizimagan — bu buzilish EMAS, kutish. Aralashma
          // o'z rangida qoladi: foydalanuvchi spirtovkani yoqib qayta
          // urinadi va o'shanda reaksiya boshlanadi (Cu(OH)₂ → CuO).
          setXato(ma_lumot.error);
        } else if (
          ma_lumot.kod === "kirishmadi" &&
          kalitlar.filter((k) => k !== "H₂O" && k !== "H₂O-oddiy").length <= 1
        ) {
          // Suv + ko'pi bilan bitta modda = bu ERITMA (CuSO₄ suvda),
          // buzilgan aralashma emas. Rang o'z holida qoladi: och moviy
          // eritmani kulrang qilish o'quvchiga "xato qildim" degan
          // noto'g'ri signal berardi. Xato paneli ham ochilmaydi —
          // eritish reaksiya emas, jim davom etiladi.
        } else {
          // 400 va boshqalar: idishdagi suyuqlikni xira kulrang qilamiz
          const hajm = jamiHajm(idishHolat);
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
        const baho = ma_lumot.nisbat || null;
        setNisbatBahosi(baho);

        // 3-BOSQICH: Kinetika, unum foizi va harorat ta'siri
        const kin = kinetikaniBaho({
          reaksiya: ma_lumot.reaksiya,
          moddalar: moddalarObj,
          harorat: idishHolat?.harorat || 25,
          nisbatBahosi: baho,
        });
        setKinetika(kin);

        // Kuzatuv matnidan effektlar massivini chiqarib, ishga tushiramiz.
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
        // Harorat qancha yuqori bo'lsa, reaksiya shuncha tez kechadi (Vant-Goff qoidasi)
        const tezlikKoef = kin?.haroratTezligiKoef || 1.0;
        const maxKutishMs = Math.max(1200, Math.round(5000 / tezlikKoef));
        const boshlanishMs = vaqt;

        const asosiySikl = () => {
          const hozir = Date.now();
          const dt = ((hozir - vaqt) / 1000) * Math.min(3.0, tezlikKoef);
          vaqt = hozir;

          boshqaruvchi.yangila(dt);

          if (boshqaruvchi.tugadimi() || hozir - boshlanishMs > maxKutishMs) {
            animatsiyaniTozala();

            // Idish tarkibi MAHSULOTGA almashadi — server qancha chiqqanini
            // aytdi (`olindi`), client faqat ko'rsatadi.
            //
            // Ilgari bu qadam YO'Q edi: reaksiyadan keyin idishda eski
            // reagent kalitlari qolardi. Oqibati — Cu(OH)₂ hosil bo'lgach
            // uni qizdirib CuO ga aylantirib bo'lmasdi, chunki idish
            // "CuSO₄ + NaOH" deb turardi va ikkinchi reaksiya topilmasdi.
            mahsulotgaAlmashtir(tanlanganIdishGroup, idishHolat, ma_lumot.olindi || []);

            // Jurnal hisobotini shakllantirish
            if (jurnalRef?.current) {
              yoz(jurnalRef.current, {
                amal: "reaksiya",
                reagent: ma_lumot.reaksiya.name || "Tajriba",
                harorat: idishHolat?.harorat || 25,
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
  }, [otkazilmoqda, sahnaRef, jurnalRef, holatniYangila, animatsiyaniTozala]);

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
    kinetika,
    setNatija,
    setTanlov,
    setXato,
  };
}