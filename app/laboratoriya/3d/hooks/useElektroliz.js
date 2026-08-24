"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { pufakchaChiqishi } from "../lib/ovoz.js";
import { elektrolizHisobla } from "../lib/elektroliz-dvigatel.js";

// ELEKTROLIZ STANSIYASI — tok manbai, vaqt sanagichi va stend
// ko'rsatkichi.
//
// `korinish.js` dan ajratildi (BRIF-05). Sabab titrlashnikiga o'xshash:
// tugma, holat va sikl bitta stansiyaga tegishli.
//
// `elektrolizVaqt` tashqariga chiqadi, chunki uni ekrandagi panel
// ko'rsatadi; `setElektrolizVaqt` esa chiqmaydi — vaqtni faqat shu
// yerdagi sikl o'zgartiradi.

export function useElektroliz({ sahnaRef, amalYoz }) {
  const [elektrolizFaol, setElektrolizFaol] = useState(false);
  const [elektrolizVaqt, setElektrolizVaqt] = useState(0);

  const handleElektrolizTok = useCallback(() => {
    setElektrolizFaol((prev) => {
      const yangi = !prev;
      if (yangi) {
        pufakchaChiqishi();
        amalYoz({ turi: "amal", kalit: "tok" });
        toast.success("⚡ DC Tok Manbai faollashdi (2.5 A). Elektroliz jarayoni boshlandi!");
      } else {
        toast("⚡ Tok manbai o'chirildi", { icon: "🔌" });
      }
      return yangi;
    });
  }, [amalYoz]);


  // Elektroliz jonli simulyatsiya sikli
  useEffect(() => {
    let timer = null;
    const stend = sahnaRef?.current?.getObjectByName("Elektroliz_Stansiyasi");

    if (elektrolizFaol) {
      pufakchaChiqishi();
      timer = setInterval(() => {
        setElektrolizVaqt((prev) => {
          const yangi = prev + 1;
          const data = elektrolizHisobla("cuso4_grafit", 2.5, yangi);

          if (stend?.userData?.stendniYangila) {
            stend.userData.stendniYangila(2.5, true, true);
          }

          if (yangi % 5 === 0) {
            pufakchaChiqishi();
          }
          return yangi;
        });
      }, 1000);
    } else {
      if (stend?.userData?.stendniYangila) {
        stend.userData.stendniYangila(0, false, false);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [elektrolizFaol, sahnaRef]);

  return { elektrolizFaol, elektrolizVaqt, handleElektrolizTok };
}
