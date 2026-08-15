# `/ilmiy/tahlil` bo'limini qayta yozish — reja

> Holat: **tasdiq kutilmoqda**. Kod yozilmadi.
> Asos: `TAHLIL.md` · Qoidalar: `AGENTS.md`

---

## 1. Nima aniqlandi

Bo'limda **241 311 qator**, 19 usul, 241 sahifa. Lekin ular bir xil
emas — kodda **uchta avlod** yashaydi:

| Avlod | Usullar | Sahifa | Qator | O'rtacha | Tavsif |
|---|---|---|---|---|---|
| **A** — ma'lumot ajratilgan | `exafs` | 12 | 1 188 | **99** | `data/*.js` + `components/*.jsx` + yupqa `page.js` |
| **B** — kichik monolit | `rentgen` | 12 | 3 370 | 280 | bitta fayl, lekin ixcham |
| **C** — katta monolit | qolgan 17 | 217 | 236 753 | ~1 200 | ma'lumot, grafik, kalkulyator, JSX — hammasi bitta faylda |

**Bu eng muhim topilma:** to'g'ri yo'nalish loyihada allaqachon bor.
`exafs` sahifasi 99 qator, `nmr` sahifasi 1 733 qator — **mazmuni bir
xil darajada boy**. Farq faqat tashkilotda.

Ya'ni men yangi arxitektura o'ylab topmayman. `exafs` naqshini
oxirigacha yetkazaman va qolgan 18 usulni unga keltiraman.

### A avlodda hali tugallanmagan joy

`exafs` da `components/` har birikma papkasida **qayta nusxalangan**:
`EXAFSSimulator.jsx` 12 nusxada (95–323 qator), `XANESPreEdge.jsx` 12
nusxada. Ularni solishtirdim — `XANESPreEdge` da farq atigi **import
qatori va ma'lumot obyekti**. Ya'ni komponent ham ma'lumotdan
ajratilishi kerak edi, lekin bir qadam qolgan.

Demak maqsad — A avlodning **tugallangan** shakli.

---

## 2. Maqsad arxitektura

```
data/ilmiy/
  moddalar.js               ← KANONIK MODDA REGISTRI (barcha bo'limlar uchun)
  tahlil/
    _usullar.js             ← 20 usul: nom, ikon, tavsif, bog'liq usullar
    exafs/
      _usul.js              ← usulga xos umumiy matn (hozir 262 qatorli landing)
      ni-cn4.js             ← FAQAT shu modda + shu usul kesishmasi
      k3-fe-cn6.js
    nmr/
      ...

components/ilmiy/
  Karta.jsx  Jadval.jsx  Belgi.jsx  Formula.jsx      ← qobiq
  HeroSarlavha.jsx  TarixiyKontekst.jsx              ← 31 va 25 nusxa o'rniga
  AmaliyQollanilish.jsx  SolishtirishJadvali.jsx     ← 19 va 14 nusxa
  PdfEksport.jsx                                     ← 38 nusxa o'rniga
  spektr/SpektrGrafik.jsx  DifraktogrammaGrafik.jsx  ← ma'lumotdan chizadi
  hisob/BraggScherrer.jsx  SpinOnly.jsx  Nernst.jsx  ← kalkulyatorlar

lib/spektroskopiya/
  voigt.js  gauss.js  chizish.js  ← 10 nusxadagi matematika

app/ilmiy/tahlil/
  [usul]/birikmalar/[modda]/page.js   ← BITTA dinamik marshrut
  [usul]/birikmalar/page.js           ← ro'yxat, registrdan quriladi
  [usul]/page.js                      ← usul sahifasi
```

### Uchta qat'iy qoida

**(1) Ma'lumot JSX bilmaydi.** `data/ilmiy/` dagi fayllarda React yo'q,
`className` yo'q, rang yo'q. Faqat kimyo. Shunda uni tekshirish,
qidirish va keyinchalik bazaga ko'chirish mumkin.

**(2) Sahifa server komponenti.** `generateStaticParams` bilan build
paytida statik yasaladi. Interaktiv qismlar (simulyator, kalkulyator)
— alohida `"use client"` orolchalari. Hozir 465 sahifa butunlay client;
bu telefonda sekin va `korinish.js` qobig'ini majburiy qiladi.

**(3) Rang faqat `--v3-*`.** Yangi kod eski qoidani takrorlamaydi.
Ma'noli ranglar (xavf, oksidlanish darajasi, spektr chizig'i) —
`components/ilmiy/` ichidagi nomlangan doimiylar, sahifada emas.

---

## 3. Migratsiya usuli: dinamik marshrut statik papka ostida kutadi

Next.js App Router'da **statik segment dinamikdan ustun turadi**.
`app/ilmiy/tahlil/exafs/` papkasi bor ekan, `[usul]` marshruti EXAFS
uchun ishlamaydi.

Bu bizga bepul, xavfsiz migratsiya beradi:

1. `[usul]/birikmalar/[modda]/page.js` yoziladi — **hech narsani
   buzmaydi**, chunki 19 ta statik papka uni to'sib turadi.
2. Bitta usulning ma'lumoti `data/` ga ko'chiriladi.
3. O'sha usulning statik papkasi **o'chiriladi** → dinamik marshrut
   o'sha usul uchun "yonadi".
4. Tekshiriladi. Buzilsa — `git revert` bitta papkani qaytaradi.

Ya'ni har qadam mustaqil, orqaga qaytariladigan va sayt hech qachon
buzilmaydi.

---

## 4. Kontent yo'qolmasligining kafolati

241 000 qator ilmiy matnni ko'chirishda eng katta xavf — **jimgina
yo'qolgan paragraf**. Uni build ham, ko'z ham tutmaydi.

Shuning uchun ko'chirishdan **oldin** o'lchov asbobi yasaladi:

`scripts/tahlil-matn-surat.js`
- eski sahifani render qiladi (yoki JSX dan matnni ajratadi),
- ko'rinadigan matnni normallashtirib `.` faylga yozadi,
- ko'chirishdan keyin yangi sahifadan xuddi shunday surat oladi,
- ikkalasini solishtiradi va **yo'qolgan qatorlarni ko'rsatadi**.

Kutilayotgan natija: 0 yo'qotish. Ataylab olib tashlangan narsa (masalan
takroriy "Umumiy xulosalar" bloki) ro'yxatga qo'lda kiritiladi.

Bu skript CI ga tushadi va keyingi usullarda avtomatik ishlaydi.

---

## 5. Bosqichlar

### 2.0 · Poydevor (kod yozilmaydi, tuzilma yaratiladi)

- `data/ilmiy/moddalar.js` — kanonik registr. 107 tartibsiz slug
  (`fe-cn6` / `fe-cn-6` / `k4-fe-cn6-3h2o`, `ferrosen` / `ferrocene`)
  → kanonik slug + eski nomlar xaritasi.
  **Bu 2-bosqichning ichida bajariladi**, chunki dinamik marshrut
  slugsiz qurilmaydi.
- `data/ilmiy/tahlil/_usullar.js` — 20 usul (hozir
  `tahlil/korinish.js` ichida 340 qator qattiq yozilgan).
- `components/ilmiy/` qobiq komponentlari + `lib/spektroskopiya/`.
- `scripts/tahlil-matn-surat.js` + eski sahifalarning **suratlari**
  (bazaviy holat).
- `[usul]/birikmalar/[modda]/page.js` — dinamik marshrut (uxlab yotadi).

Natija: sayt o'zgarmaydi, hech narsa o'chirilmaydi.

### 2.1 · Pilot: `rentgen` (12 sahifa, 3 370 qator)

Nega aynan u: monolit (C avlodning kichik nusxasi), lekin hajmi kichik
— naqsh bir kunda sinaladi. Ichida `DifraktogrammaGrafik`,
`BraggScherrerKalkulyator`, `CRYSTAL` ma'lumot obyekti — ya'ni
kelajakdagi hamma element bor.

Natija: ~3 370 → ~900 qator. **Sizga ko'rsataman va tasdiqlatib olaman
— keyingi 17 usul aynan shu shaklda ketadi.**

### 2.2 · `exafs` ni tugatish (12 sahifa)

Allaqachon yarim yo'lda. `components/` nusxalarini
(`EXAFSSimulator` ×12, `XANESPreEdge` ×12) bitta ma'lumot bilan
boshqariladigan komponentga yig'ish.

### 2.3 · Qolgan 17 usul, hajm bo'yicha o'sib borish

`epr` (3 k) → `cd` (10 k) → `xps` → `fluoressensiya` → `mass` →
`magnit` → `aas` → `konduktometriya` → `termik` → `titrlash` →
`elektrokimyo` → `ub-vis` → `icp` → `raman` → `mossbauer` → `iq` (27 k)
→ `nmr` (21 k).

Har usuldan keyin: matn-surat solishtiruvi + `next build` + jonli
tekshiruv + alohida commit.

### 2.4 · Yakun

- `/ilmiy/tahlil` bosh sahifasi registrdan quriladi.
- 6 ta siniq havola (`tahlil` ichidagilar) o'z-o'zidan yo'qoladi —
  registrda bo'lmagan moddaga havola yozib bo'lmaydi.
- Eski manzillar: kanonik slugga 308 yo'naltirish. **Bironta ham
  mavjud manzil 404 bermaydi** — SEO ishi saqlanadi.

---

## 6. Kutilayotgan natija

| | Hozir | Keyin |
|---|---|---|
| `app/ilmiy/tahlil` qatorlari | 241 311 | ~18 000 |
| `data/ilmiy/tahlil` qatorlari | 0 | ~35 000 (sof kimyo) |
| Sahifa fayllari | 241 | 3 dinamik marshrut |
| PDF eksport nusxasi | 38 | 1 |
| `HeroSection` nusxasi | 31 | 1 |
| Client sahifa | 241 | 0 (SSG) + orolchalar |
| Ilmiy xatoni tuzatish | 239 joyda | 1 joyda |

---

## 7. Xavflar va ularga javob

| Xavf | Javob |
|---|---|
| Matn yo'qoladi | Matn-surat solishtiruvi, har usulda majburiy |
| Manzil o'zgarib SEO yiqiladi | Kanonik slug + 308 yo'naltirish jadvali; sitemap qayta yasaladi |
| Dinamik marshrut sekin | `generateStaticParams` → build paytida statik HTML |
| Ish yarmida qolib ketadi | Har usul mustaqil; qolgan usullar eski holida ishlayveradi |
| Ma'lumotda ilmiy xato bor | Ko'chirishda **hech narsa tuzatilmaydi** — shubhali joy ro'yxatga yoziladi, siz hal qilasiz |

---

## 8. Tasdiq kerak bo'lgan uch nuqta

Quyidagilar hal bo'lgach, `2.0` va `2.1` ni bajaraman.
