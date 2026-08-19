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

## BOSQICH 3 — Postprocessing (o'rta xavf)

- [x] **3.1+3.2 — Bloom:** `EffectComposer` + `RenderPass` + `UnrealBloomPass`
      + `OutputPass` ulandi (kuch 0.55, radius 0.4, threshold 0.55). Arzon
      rejimda kompozitor o'chiriladi. Resize/cleanup moslashtirildi.
- [x] **3.3 — SSAO (GTAOPass):** ulandi (RenderPass dan keyin, bloom dan oldin).
      Lekin `SSAO_YOQIQ` sukut bo'yicha `false` — kuch/radius/blendIntensityni
      jonli brauzerda ko'rib sozlash kerak, keyin `true` qilib doimiy yoqiladi.

## BOSQICH 4 — Protsedural teksturalar ✅

- [x] **4.1+4.2+4.3:** `protsedural-tekstura.js` — yog'och guli, pol plitkasi,
      devor gips/beton detali. Canvas orqali, tarmoqqa chiqmaydi. Fon
      almashganda mavzuga mos qayta yaratiladi, `materiallarniTozala` map'larni
      ham bo'shatadi.

## BOSQICH 5 — Muhit va yorug'lik

- [ ] **5.1 — Real lab HDR:** `RoomEnvironment` o'rniga haqiqiy lab HDR
      kerak (tashqi rasm yuklash). Shuning uchun tashqi asset kerak — hozircha
      o'tkazib turilgan; xohlasangiz keyin qilamiz.
- [x] **5.2 — Fog:** tuman zichligi keskin kamaytirildi (0.085→0.018 gacha).
- [x] **5.3 — RectAreaLight:** shift LED panellari endi atrofni yoritadi.

---

## BOSQICH 6 — Mayda realist detallar

- [x] **6.1 — Stol ustida qog'oz bloknot va ruchka** (Chap stol).
- [ ] **6.2 — FPS qo'l modeli** — qo'ldagi idish/kolba ko'rinadigan qo'l bilan.
      Murakkab, jonli sozlash kerak.
- [ ] **6.3 — Contact Shadows** — ob'ektlar ostida yumshoq kontakt soyasi.
      SSAO'siz ham bo'ladi, lekin SSAO bilan birga jonli sozlash ma'qul.

## Joriy holat (2026-08-19)

Bajarilgan va commit qilingan bosqichlar:
- `88e7386` — 1-2-bosqich (per-idish holat, isitish qaralgan idishga, grafik).
- `301db13` — 3.1+3.2 bloom.
- `450f534` — 4-bosqich protsedural teksturalar.
- `4775a53` — 5.2 fog + 5.3 RectAreaLight.
- `98910c7` — 6.1 stol detallari (bloknot + ruchka).
- `9f1abcd` — 3.3 SSAO (GTAOPass, sukut bo'yicha o'chiq, yoqishga tayyor).

Barchasi dev serverda xatosiz kompilyatsiya qilindi (`GET /laboratoriya/3d → 200`;
faqat Google Fonts tarmoq ogohlantirishi — sandbox bilan bog'liq, kodga tegishli emas).

Jonli brauzerda vizual tekshirishni talab qiladigan (faqat sizda qilinadi):
- **SSAO yoqish** — `useSahna.js` da `SSAO_YOQIQ = true`, kuch/radius sozlash.
- **5.1 — real HDR** (tashqi asset).
- **6.2 — FPS qo'l modeli**, **6.3 — Contact Shadows**.
