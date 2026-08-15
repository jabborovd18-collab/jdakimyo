# jdakimyo.uz — loyiha tahlili

> Sana: 2026-08-15 · Tekshirilgan commit: `db87e9c` · Muallif: Arena agent
>
> Bu hujjat **hozirgi holatning xaritasi**. Hech narsa o'zgartirilmadi —
> faqat o'qildi va sanaldi. Qayta yozish rejasi oxirgi bo'limda.

---

## 1. Bir qarashda

| Ko'rsatkich | Qiymat |
|---|---|
| Git kuzatuvidagi fayl | 1 196 |
| Kod qatori (js/jsx/css/prisma/sql) | ~571 000 |
| `page.js` sahifalar | 663 |
| API marshrutlari (`route.js`) | 123 |
| Prisma modellari | 63 |
| Migratsiyalar | 30 |
| `lib/` modullari | 60 fayl / 9 782 qator |
| Umumiy komponentlar | 26 fayl / 4 044 qator |
| 1 000+ qatorli fayl | 215 ta |
| 2 000+ qatorli fayl | 33 ta |

Texnologiya: **Next.js 16 (App Router) · React 18 · Prisma 5 + Neon
Postgres · Tailwind 3.4 · sof Three.js 0.170 · NextAuth v4 · Vercel**.
TypeScript yo'q, test freymvorki yo'q, ESLint konfiguratsiyasi yo'q.

### Kod qayerda yashaydi

```
app/ilmiy/tahlil          296 040 qator   ← 52%
app/oquv                   92 984
app/ilmiy/chuqurlashgan    61 293
app/ilmiy/birikmalar       30 468
app/api                    16 678
app/admin                  10 773
lib                         9 782
app/ustoz                   6 525
components                  4 044
app/profil                  3 298
```

**Asosiy fakt:** kodning yarmidan ko'pi — bitta bo'limdagi 239 ta
statik ilmiy sahifa. Server mantig'i (`app/api` + `lib`) atigi 26 000
qator, ya'ni butun loyihaning 4.6%.

---

## 2. Arxitektura: nima yaxshi qilingan

Bu loyihada haqiqiy muhandislik izlari bor va ularni buzmaslik kerak.

### 2.1. `AGENTS.md` — kamdan-kam uchraydigan hujjat

Qoidalar ro'yxati emas, **buzilgan qoidalar ro'yxati**: har bandda nima
sindirilgani yozilgan. Bu qayta yozishda eng qimmatli manba, chunki u
xatolarni takrorlashdan saqlaydi. Yangi arxitektura uni **kengaytirishi**
kerak, o'rniga o'tmasligi.

### 2.2. Yagona haqiqat manbai — laboratoriya qismida

`lib/lab-*.js` oilasi (`lab-modda`, `lab-birlik`, `lab-idish`,
`lab-erituvchi`, `lab-nisbat`, `lab-inventar`, `lab-tenglama`) — bu
loyihaning eng toza qismi. 242 modda, o'lchov birligi, idish sig'imi va
stexiometriya bitta joyda. `data/reactions/` 12 oilaga bo'lingan, 3 243
qator, `index.js` orqali yig'iladi.

Izohlar "nega" ni tushuntiradi:

```js
// Nega alohida fayl: rang ilgari ikki joyda, ikki xil qiymat bilan
// yashagan — "sariq" ikkalasida boshqacha chiqardi.
```

Bu uslub butun loyihaga tarqatilishi kerak.

### 2.3. Server — hakam

`lib/roles.js`, `lib/missions.js`, `lib/sovga.js`, `lib/lab-inventar.js`
da balans va inventar faqat serverda, tranzaksiya ichida shartli
`updateMany` bilan o'zgaradi. To'g'ri yondashuv.

### 2.4. Xavfsizlik asoslari joyida

- Login'da 5 xatodan keyin 15 daqiqalik to'siq (`kirishXatolari`,
  `kirishTaqiqUntil` — `User` modelida)
- Foydalanuvchi enumeratsiyasi yopilgan (yagona xato xabari)
- IP cheklovi (`lib/ip-cheklov.js`) 5 ta kirish nuqtasida
- Email tasdig'i tanga topishga shart qilib qo'yilgan — ko'p akkaunt
  ochishga asosiy to'siq
- CORS faqat `/api/mobile/*` uchun ochilgan va sababi izohda yozilgan
- `role` (akademik) va imtiyozli rol ajratilgan — ro'yxatdan o'tish
  imtiyoz bermaydi

### 2.5. SEO ishi qilingan

126 sahifada o'z `metadata`si, `sitemap.js` o'z-o'zini boqadi
(`gen-sitemap-royxat.js` → 116 manzil), canonical host `www.jdakimyo.uz`,
`page.js` + `korinish.js` naqshi 58 joyda qo'llangan, `/birikmalar` →
`/ilmiy/birikmalar` 308 bilan yo'naltirilgan (sababi `next.config.mjs`
da batafsil yozilgan).

---

## 3. Tizimli muammolar

Quyidagilar "xato" emas — bular **o'sish natijasida paydo bo'lgan
strukturaviy qarzlar**. Har biri o'lchangan.

### 3.1. ⛔ Eng katta muammo: `app/ilmiy/tahlil` — 296 000 qator nusxa

20 ta tahlil usuli × 13 birikma ≈ **239 sahifa**, har biri **1 200–2 300
qator**. Har sahifa mustaqil `page.js`, ichida:

- `const COMPOUND = { ... }` — 130 faylda aynan shu nom bilan
- 300 qator ma'lumot + ~2 000 qator JSX (namuna: NMR
  `co-nh3-5-no2` — 2 292 qator, shundan 1 979 tasi JSX)
- Har birida qayta yozilgan yordamchilar: `HeroSection` 31 marta,
  `TarixiyKontekst` 25 marta, `getStatusColor` 21 marta,
  `AmaliyQollanilish` 19 marta, `voigt` 10 marta, `drawSpectrum` 10 marta
- PDF eksporti (`PDFDocument` + `fontkit`) **38 faylda** nusxalangan

Ikkita bir xil usuldagi sahifani solishtirsak (ICP, `co-nh3-6-cl3` va
`ni-en3-cl2`): 789 va 810 noyob qator, ulardan **540 tasi bir xil** —
ya'ni ~68% takror.

**Bu nimani anglatadi.** Bitta ilmiy xato topilsa (masalan Racah
parametri formulasi), uni 239 joyda tuzatish kerak. Bitta dizayn
o'zgarishi — 239 fayl. Bu `AGENTS.md` ning 1-bandiga to'g'ridan-to'g'ri
zid: kimyo ma'lumoti 239 nusxada yashayapti.

**To'g'ri shakl:** ma'lumot (`COMPOUND`) → `data/` dagi jadval;
ko'rinish → bitta `[usul]/[birikma]` dinamik marshruti + usulga xos
vidjetlar kutubxonasi. 296 000 qator ~15 000 qatorga tushadi.

### 3.2. ⛔ Rang qoidasi butun saytda buzilgan

`AGENTS.md` 3-band: faqat `--v3-*` CSS o'zgaruvchilari.

| Holat | Fayl soni |
|---|---|
| `bg-slate-900` / `text-purple-300` kabi qattiq rang yozilgan | **734** |
| `--v3-*` o'zgaruvchilaridan foydalanadigan | **6** |

`app/globals.css` ning o'zi buni tan oladi:

```css
/* Ranglar 585 faylda to'g'ridan-to'g'ri yozilgani uchun
   mavzu almashtirib bo'lmaydi */
```

Ya'ni to'rtta fon (`tun`, `siyoh`, `grafit`, `kunduz`) amalda **faqat
bosh sahifa va bir nechta sahifada** ishlaydi. Qolgan hamma joyda
"kunduz" fonida sahifa o'qilmaydi. Eng ko'p takrorlangan qator butun
`tahlil` bo'limida:

```
562 marta: <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
```

### 3.3. Slug tartibsizligi va yetim sahifalar

`/ilmiy/birikmalar` katalogida:

- Katalogda bor, sahifasi **yo'q**: `wilkinson`, `grubbs`, `vaska`,
  `zeise` → 404
- Sahifasi bor, katalogda **yo'q** (yetim, hech qayerdan havola yo'q):
  `ag-nh3-2`, `co-cl4`, `cr-h2o6`, `cu-h2o6`, `fe-co5`, `k3-fe-cn6`,
  `k4-fe-cn6`, `ni-cn4`, `sisplatin`, `vaska-kompleksi`,
  `wilkinson-katalizatori`, `zeise-tuzi`, `zn-oh4` — **13 ta**

Ayni bir modda ikki nom bilan: `fe-co5` (304 qator, to'liq) va
`fe-co-5` (18 qator, qobiq). `k3-fe-cn6` / `k3-fe-cn-6` — xuddi shunday.

`tahlil` bo'limida **107 xil slug** bir xil moddalar uchun:
`fe-cn-6`, `fe-cn6`, `fe-cn6-3`, `fe-cn6-4`, `k3-fe-cn6`, `k3-fe-cn-6`,
`k4-fe-cn6-3h2o`… `ferrosen` va `ferrocene` ikkalasi ham bor.

Yagona modda registri yo'qligining bevosita natijasi.

### 3.4. 11 ta siniq ichki havola

```
/ilmiy/birikmalar/co-nh3-3-cl3
/ilmiy/tahlil/iq/birikmalar/co-nh3-3-cl3
/ilmiy/tahlil/iq/birikmalar/cr-h2o6
/ilmiy/tahlil/iq/birikmalar/fe-co5
/ilmiy/tahlil/nmr/birikmalar/cis-pt-cl2-nh3-2
/ilmiy/tahlil/ub-vis/birikmalar/cr-nh3-6-cl3
/kompleks/oktaedrik
/oquv/izomeriyasi/geometrik
/oquv/izomeriyasi/stereo/konformatsion
/oquv/izomeriyasi/tuzilish/boshqa
/oquv/klassifikatsiyasi/ligand/sianid
```

Hammasi 404. Hech qanday avtomatik tekshiruv bo'lmagani uchun ular
sezilmay yotibdi.

### 3.5. 🔴 `/api/admin/compounds` — himoyasiz yozuv

Fayl `app/api/admin/compounds/route.js`, izohda `// GET - ... public,
auth kerak emas` deb yozilgan va **hech qanday sessiya tekshiruvi yo'q**.
`admin` yo'lida turibdi. Hozir zarari kam (`Compound` jadvali bo'sh),
lekin jadval to'ldirilgan kuni bu ochiq eshik bo'ladi.

Umuman, 123 marshrutdan 17 tasida auth/cron/webhook belgisi topilmadi.
Ko'pchiligi haqiqatan ham ochiq bo'lishi kerak (`/api/leaderboard`,
`/api/quotes`, `/api/sertifikat/[certId]`), lekin bu **qasddanmi yoki
unutilganmi** — koddan bilinmaydi. Marshrut himoyasi deklarativ emas.

### 3.6. 🔴 `NEXT_PUBLIC_GEMINI_API_KEY` serverda o'qilyapti

`app/api/masala/yech/route.js`:

```js
process.env.GEMINI_API_KEY ||
process.env.GOOGLE_AI_KEY ||
process.env.NEXT_PUBLIC_GEMINI_API_KEY ||   // ← brauzerga chiqadi
process.env.API_KEY
```

`NEXT_PUBLIC_` prefiksli o'zgaruvchi Next.js tomonidan **client
bundle'ga jo'natiladi**. Agar Vercel'da bu nom bilan kalit qo'yilgan
bo'lsa — u hozir ochiq. Tekshirish va zaxira variantdan olib tashlash
kerak.

### 3.7. Validatsiya qatlami yo'q

`zod` `package.json` da bor (`^3.23.8`), lekin **0 ta faylda
ishlatilgan**. 123 marshrutning har biri `await request.json()` dan
kelgan ma'lumotni qo'lda tekshiradi yoki umuman tekshirmaydi.

### 3.8. Test va lint yo'q

- `package.json` da `test` skripti yo'q, freymvork o'rnatilmagan
- `scripts/test-chem-balance.js` va `test-chem-search.js` — qo'lda
  ishga tushiriladigan skriptlar, CI da hech kim chaqirmaydi
- ESLint konfiguratsiyasi yo'q (`next lint` skripti bor, konfig yo'q)
- Yagona sifat darvozasi — `npx next build`

`lib/chem-balance.js` (353 qator, tenglama muvozanatlash) va
`lib/masala-dvigatel.js` (kimyo hisob-kitobi) kabi **matematik** kod
hech qanday avtomatik sinovsiz turibdi. Bu eng xavfli joy: xato jim
o'tadi.

### 3.9. Client/server chegarasi noaniq

663 sahifadan **465 tasi `"use client"`**. Ya'ni deyarli butun sayt
brauzerda render bo'ladi, holbuki `tahlil` va `chuqurlashgan`
sahifalarining mazmuni — statik matn va jadval. Bu:

- keraksiz JS bundle (telefonda sekin)
- SEO uchun `korinish.js` qobig'i naqshini majburiy qiladi (58 joyda
  qo'lda takrorlangan)
- 200 ta sahifada esa metadata umuman yo'q (663 sahifa, 126 metadata)

React Server Components ishlatilmayapti — Next.js 16 ning asosiy
imkoniyati bo'sh turibdi.

### 3.10. Ikkilangan tuzilma qoldiqlari

- `app/ilmiy/birikmalar/` va `app/ilmiy/tahlil/*/birikmalar/` — ikki
  xil birikma daraxti, o'zaro bog'lanmagan
- `Compound` va `Molecule3D` Prisma modellari mavjud, lekin
  `Compound` bo'sh va `/birikmalar` yo'naltirishga tushgan
- `app/kochat` (1 fayl) — nima ekani noaniq, hech qayerdan havola yo'q
- `prisma.config.ts.bak` — commit qilingan zaxira fayl
- Ildizda 4 ta katta prompt hujjati (`3D-LAB-PROMPT.md` 33 KB,
  `YANGI-CHAT-PROMPT.md`, `3D-LAB-QOLGAN-4-FAYL.md`) — vaqtinchalik
  ish materiali, `AGENTS.md` ning 6-bandiga zid

### 3.11. Ma'lumot bazasi keng, lekin band emas

63 model. Ular orasida ishlatilmayotgan yoki qisman ishlatilgan:
`Compound` (bo'sh), `AnalysisMethod`, `Molecule3D`, `Plant` /
`PlantWatering` (widget bor, oqim to'liq emas). `gems` valyutasi
`User` da bor — `AGENTS.md` ga ko'ra **topish yo'li yo'q**.

`User` modeli 200+ qator, 60 dan ortiq maydon: auth, profil, valyuta,
streak, maxfiylik, interfeys, taqiq — hammasi bitta jadvalda.

---

## 4. Xavf darajasi bo'yicha ro'yxat

| # | Muammo | Xavf | Mehnat |
|---|---|---|---|
| 1 | `NEXT_PUBLIC_GEMINI_API_KEY` | 🔴 yuqori | 10 daqiqa |
| 2 | `/api/admin/compounds` himoyasiz | 🔴 yuqori | 30 daqiqa |
| 3 | Marshrut himoyasi deklarativ emas | 🟠 o'rta | 1 kun |
| 4 | Validatsiya yo'q (zod ishlatilmagan) | 🟠 o'rta | 2–3 kun |
| 5 | Kimyo mantig'ida test yo'q | 🟠 o'rta | 2 kun |
| 6 | 296 000 qator nusxa `tahlil` da | 🟠 o'rta | 3–4 hafta |
| 7 | Rang qoidasi 734 faylda buzilgan | 🟡 past | 2 hafta |
| 8 | 11 siniq havola + 13 yetim sahifa | 🟡 past | 1 kun |
| 9 | Slug registri yo'q (107 variant) | 🟡 past | 3 kun |
| 10 | 465 sahifa keraksiz `"use client"` | 🟡 past | bosqichma-bosqich |

---

## 5. Qayta yozish rejasi — taklif

Prinsip: **hech qachon hamma narsani birdan sindirmaslik**. Har bosqich
oxirida sayt ishlab turadi (`AGENTS.md` 10-band).

### 0-bosqich · Poydevor (1 hafta)

Kod yozishdan oldin himoya to'ri qurish.

1. **Vitest** o'rnatish, `lib/chem-balance.js`,
   `lib/masala-dvigatel.js`, `lib/lab-nisbat.js`, `lib/lab-birlik.js`
   uchun sinovlar. Bular sof funksiyalar — sinash oson, foyda katta.
2. **ESLint konfiguratsiyasi** + `AGENTS.md` qoidalarini avtomatlashtirish:
   - qattiq Tailwind rang sinfini taqiqlovchi qoida
   - `NEXT_PUBLIC_` ni server kodida taqiqlash
3. **Havola tekshiruvchi skript** (`scripts/havola-tekshir.js`) — 11 ta
   siniq havolani topgan mantiqni doimiy skriptga aylantirish.
4. **CI** (GitHub Actions): lint + test + `next build` + havola tekshiruvi.
5. Ikki xavfsizlik teshigini yopish (1 va 2-punkt).

### 1-bosqich · Modda registri (1–2 hafta)

Butun keyingi ishning kaliti.

- `data/moddalar/` — har modda uchun bitta yozuv: kanonik slug,
  formula (Unicode + oddiy), IUPAC nomi, CAS, molyar massa, geometriya,
  nuqta guruhi, markaziy atom, ligandlar, rang…
- Mavjud 107 slug variantini kanonik slugga **xaritalash jadvali** +
  eskisidan yangisiga 308 yo'naltirish.
- `lib/lab-modda.js` bilan bog'lash: laboratoriyadagi 242 modda va
  ilmiy bo'limdagi birikmalar bitta registrga tayanadi.
- Katalog (`/ilmiy/birikmalar`) registrdan quriladi — yetim sahifa va
  o'lik havola strukturaviy jihatdan mumkin bo'lmay qoladi.

### 2-bosqich · Tahlil bo'limini ma'lumotga aylantirish (3–4 hafta)

Eng katta yutuq shu yerda.

- `data/tahlil/<usul>/<modda>.js` — faqat ma'lumot, JSX yo'q.
- `app/ilmiy/tahlil/[usul]/birikmalar/[modda]/page.js` — **bitta**
  dinamik marshrut, `generateStaticParams` bilan statik generatsiya
  (SSG — hozirgi 465 client sahifadan tez).
- `components/ilmiy/` — qayta ishlatiladigan vidjetlar:
  `SpektrGrafik`, `XarakterlarJadvali`, `KristallMaydonPaneli`,
  `PDFEksport` (38 nusxa → 1), `TarixiyKontekst`, `AmaliyQollanilish`.
- Usulga xos qism (`voigt`, `drawSpectrum`, Bragg-Scherrer
  kalkulyatori) — `lib/spektroskopiya/` ga.
- Ko'chirish **usul bo'yicha bittalab**: avval `exafs` (eng kichigi,
  2 627 qator), keyin `rentgen`, oxirida `iq` (29 412 qator). Har
  usuldan keyin build + jonli tekshiruv.

Kutilayotgan natija: ~296 000 → ~20 000 qator, ilmiy tuzatish bitta
joyda.

### 3-bosqich · Dizayn tizimi (2 hafta, 2-bosqich bilan parallel)

- `--v3-*` o'zgaruvchilarini to'liq to'plamga yetkazish (ma'noli
  ranglar: xavf darajasi, nodirlik, spektr chizig'i).
- `components/ui/` — `Karta`, `Jadval`, `Belgi`, `Ogohlantirish`,
  `Formula`. Tailwind faqat joylashuv uchun.
- 734 faylni qo'lda emas, **codemod** bilan almashtirish
  (`bg-purple-900/40 border-purple-700/50` → `<Karta>`), chunki 562
  marta aynan bir xil qator takrorlanadi — mashina yaxshi bajaradi.
- 2-bosqichda ko'chirilgan sahifalar avtomatik yangi tizimga tushadi.

### 4-bosqich · Server qatlamini tartibga solish (2 hafta)

- `lib/api/` — `himoyalangan(handler, { rol })` o'ramchisi. Har
  marshrutning talabi kod boshida deklarativ ko'rinadi.
- Har `POST`/`PUT` uchun `zod` sxemasi. Sxemalar `lib/sxemalar/` da —
  mobil ilova va veb bitta manbadan foydalanadi.
- Xato javoblarini birlashtirish (hozir har marshrutda o'z shakli).
- `User` modelini bo'lish: `UserProfil`, `UserValyuta`, `UserMaxfiylik`
  — faqat 2-bosqich tugagach, ehtiyotkorlik bilan.

### 5-bosqich · Tozalash

- `Compound`, `AnalysisMethod` — to'ldirish yoki o'chirish (qaror
  egasiniki).
- `gems` uchun topish yo'li yoki maydonni olib tashlash.
- Ildizdagi prompt hujjatlarini `hujjatlar/` ga ko'chirish yoki
  o'chirish, `prisma.config.ts.bak` ni olib tashlash.
- `app/kochat` taqdirini hal qilish.

---

## 6. Nima o'zgarmaydi

Qayta yozish quyidagilarga **tegmaydi**:

- Mavjud manzillar (`/ilmiy/...`, `/oquv/...`) — SEO ishi saqlanadi,
  o'zgarish bo'lsa faqat 308 yo'naltirish orqali
- `lib/lab-*.js` oilasi — u allaqachon to'g'ri shaklda
- Prisma sxemasi — 4-bosqichgacha faqat qo'shiladi, o'chirilmaydi
- Ma'lumot bazasidagi hech narsa yo'qolmaydi
- O'zbek tili, "nega" izohlari, `AGENTS.md` uslubi

---

## 7. Keyingi qadam uchun savol

Reja katta va uni bir yo'nalishda boshlash kerak. Menimcha tartib
shunday bo'lishi mantiqiy:

**0-bosqich (himoya to'ri + ikki xavfsizlik teshigi) → 1-bosqich (modda
registri) → 2-bosqich (tahlil bo'limi)**

Sabab: 0-bosqichsiz har qanday katta o'zgarish ko'r-ko'rona bo'ladi
(sinov yo'q, build'dan boshqa darvoza yo'q), 1-bosqichsiz esa 2-bosqich
yana tartibsiz sluglar ustiga quriladi.

Lekin boshlash nuqtasini siz tanlaysiz.
