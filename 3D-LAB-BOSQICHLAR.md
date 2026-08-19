# 3D Laboratoriya — QAT'IY BOSQICHLAR REJASI

> Har bosqich: **o'zgartirish → `node --check` → dev server kompilyatsiya → keyingisiga**.
> Faqat bosqich ishlagandan keyin keyingisiga o'tiladi (AGENTS.md 10-band).

## BOSQICH 1 — Funksional xatolar (past xavf, katta foyda)

- [x] **1.1 — A1:** Isitish/reaksiya/aniq doza endi **qaralgan idishga** ishlaydi
      (`nishonIdishGroup = faolIdish || ...`, faolIdish FPS ko'rsatkichidan).
- [x] **1.2 — A3:** Spatula kukunini **gramm** bilan qo'shadi; suv yo'q bo'lsa ham
      kukun sathi ko'rinadi.
- [x] **1.3 — A2:** **Har idish o'z holatini** `group.userData.holat` da saqlaydi —
      probirka bilan stakan tarkibi endi aralashmaydi (idish-holati.js +
      useQuyish/useTajriba/korinish).
- [x] **1.4 — A4:** Idishni olib tashlashda material va tekstura ham `dispose()`.

## BOSQICH 2 — Darhol grafik yaxshilanish (past xavf)

- [x] **2.1 — B2:** Arzon rejim sharti yumshatildi — endi oddiy noutbuk to'liq
      grafik (soya, antialias, haqiqiy shisha) bilan ishlaydi.
- [x] **2.2 — B5:** Shaffof shisha endi soya tashlamaydi (qora "blob" yo'qoladi).
- [x] **2.3 — B3:** Oltiburchak (6 segment) idish tagliklari 32 segmentga — silliq.

## BOSQICH 3 — Postprocessing (o'rta xavf) — NAVBATDA

- [ ] 3.1 — `EffectComposer` + `RenderPass` + `OutputPass` ulash.
- [ ] 3.2 — Alanga/neonlarga `UnrealBloomPass` (past kuch, arzon rejimda o'chiq).
- [ ] 3.3 — SSAO yoki Contact Shadows (chuqurlik).

## BOSQICH 4 — Protsedural teksturalar (o'rta xavf)

- [ ] 4.1 — Yog'och gul (Canvas/normal map), `roughnessMap`.
- [ ] 4.2 — Pol plitka/epoxy, devor beton detali.

## BOSQICH 5 — Muhit va yorug'lik

- [ ] 5.1 — `RoomEnvironment` o'rniga real lab HDR (`PMREMGenerator`).
- [ ] 5.2 — `FogExp2` zichligini kamaytirish.
- [ ] 5.3 — Ship LED panellariga `RectAreaLight`.

---

## Joriy holat (2026-08-19)

Barcha 1 va 2-bosqichlar bajarildi va dev serverda xatosiz kompilyatsiya
qilindi (`GET /laboratoriya/3d → 200`, faqat Google Fonts tarmoq ogohlantirishi
— sandbox bilan bog'liq, kodga tegishli emas).

Keyingi bosqich: **3.1 — postprocessing (bloom)**.
