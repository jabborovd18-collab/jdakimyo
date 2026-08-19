# 3D LABORATORIYA — bepul AI chatlar uchun to'liq prompt

> **Ishlatish tartibi:** quyidagi `---` chizig'idan keyingi HAMMA matnni
> nusxalab, bepul AI chatiga (LMArena, Gemini, DeepSeek, Qwen — farqi yo'q)
> bitta xabar qilib tashlang. AI fayllarni tartib bilan yozadi. Javob
> uzilib qolsa **"davom et"** deb yozing.
>
> Kod 4 ta bosqichga bo'lingan. Bitta chatda 1-bosqichni oling, natijani
> loyihaga qo'ying, keyin yangi chat oching va promptni yana tashlab
> oxiriga qo'shing: *"1-bosqich tayyor, 2-bosqichdan boshla."*
> Chat kontekstі to'lib qolishining oldi shunday olinadi.
>
> Fayllar `app/laboratoriya/3d/` ichidagi tayyor papkalarga tushadi.

---

Salom. Sen katta tajribali Three.js + Next.js dasturchisisan. Men senga
ishlab turgan real loyihaning yangi bo'limini yozib berishingni so'rayman.
Taxmin qilma — quyida hamma narsa aniq yozilgan. Yozilmagan joyda eng
oddiy yechimni tanla. Agar biror talab texnik jihatdan imkonsiz deb
hisoblasang, kod yozishdan oldin **to'xta va sababini ayt**.

# 1. VAZIFA

`jdakimyo.uz` — o'zbek tilidagi kimyo o'quv platformasi. Unda ishlab
turgan **virtual laboratoriya** bor: foydalanuvchi jihoz sotib oladi,
reagent yig'adi va tajriba o'tkazadi. Hozir u **2 o'lchamli** — tugmalar
va ro'yxatlar.

Sening vazifang: shu laboratoriyaning **3 o'lchamli ko'rinishini** yozish.
Foydalanuvchi stol ustidagi probirka va kolbalarni ko'radi, reagent
shishasini qo'lga oladi va **bosib ushlab turib quyadi** — tomchilab.
Qancha quyilgani muhim: kam quysa reaksiya chala qoladi, ko'p quysa
boshqa natija chiqadi. Keyin reaksiyani o'z ko'zi bilan kuzatadi —
pufakcha ko'tariladi, cho'kma tushadi, eritma rangi o'zgaradi.

Oxirida **laboratoriya daftari** ochiladi: nima qilgani, qancha
quygani, qayerda xato qilgani va nima uchun shunday bo'lgani yozib
beriladi.

## Ikkita hal qiluvchi qoida

**(A) 3D — faqat ko'rinish qatlami.** O'yin mantig'i (reagent
sarflash, mahsulot berish, tajriba ochkosi) allaqachon serverda
yozilgan va **unga umuman tegilmaydi**. Sen yozadigan kod faqat
brauzerda ishlaydi. Natijani client tomonda hisoblasang, foydalanuvchi
brauzer konsolidan istalgan moddani "yasab" olardi.

**(B) Miqdor — o'qitish quroli, o'yin valyutasi emas.** Foydalanuvchi
quygan millilitr **inventardan nima sarflanishini o'zgartirmaydi** — uni
server hal qiladi. Millilitr **animatsiyani va hisobotni** belgilaydi:
"5 ml kerak edi, siz 12.4 ml quydingiz — shuning uchun cho'kma qaytadan
erib ketdi". Bu ikkisini aralashtirma.

# 2. QAT'IY TEXNIK CHEKLOVLAR

Bularni buzsang kod loyihaga tushmaydi:

1. **Next.js 16 App Router**, React 18. Fayl kengaytmasi: `.js` va
   `.jsx`. **TypeScript YO'Q** — sof JavaScript.
2. **Sof Three.js, versiya 0.170.0.** Import:
   `import * as THREE from "three"` va
   `import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"`.
3. **`@react-three/fiber` va `@react-three/drei` O'RNATILMAGAN va
   o'rnatilmaydi.** `<Canvas>`, `<mesh>`, `<meshPhysicalMaterial>`,
   `useFrame`, `dpr={[1,1.5]}`, `frameloop` — bularning **hech biri
   ishlamaydi**. Sahna imperativ yoziladi: `new THREE.Mesh(...)`,
   `scene.add(...)`, `requestAnimationFrame`. Bu loyihadagi mavjud 17
   ta 3D sahifa bilan bir xil uslub.
4. **Boshqa yangi npm paket ham qo'shilmaydi** — `gsap`, `zustand`,
   `cannon`, `rapier`, `postprocessing` yo'q. Fizika dvigateli kerak
   emas: quyish va cho'kish oddiy qo'lda yozilgan matematik
   yaqinlashish bilan qilinadi.
5. **`.glb` / `.gltf` / `.obj` / `.fbx` model fayllari YO'Q.** Barcha
   jihozlar protsedural geometriyadan yasaladi
   (`CylinderGeometry`, `SphereGeometry`, `LatheGeometry`,
   `TorusGeometry`, `ExtrudeGeometry`). Sabab: Vercel trafigi,
   telefonda yuklanish tezligi, va rangni dinamik boshqarish zarurati.
6. **Tailwind CSS 3.4** — HTML qismi faqat Tailwind sinflari bilan
   bezatiladi. Alohida `.css` fayl yozma.
7. **Bildirishnoma:** `import toast from 'react-hot-toast'` (o'rnatilgan).
8. **Server kodiga tegma.** `lib/`, `prisma/`, `app/api/` ichidagi
   hech narsani o'zgartirma, yangi API route va yangi Prisma modeli
   yozma. Migratsiya kerak bo'ladigan yechim taklif qilma.
9. **Barcha matn — o'zbek tilida.** Tugmalar, xabarlar, sarlavhalar.
10. **Izohlar — o'zbek tilida va "NEGA" ni tushuntiradi**, "nima
    qilinganini" emas. Yomon izoh: `// Sahnani yaratamiz`. Yaxshi izoh:
    `// Sahna ref ichida saqlanadi, state'da emas: har kadrda`
    `// o'zgaradigan obyektni state'ga qo'ysak React sekundiga 60 marta`
    `// qayta chizardi.`
11. **Xotira tozalanadi.** `useEffect` qaytaruvchi funksiyasida har bir
    `geometry.dispose()`, `material.dispose()`, `texture.dispose()`,
    `renderer.dispose()`, `cancelAnimationFrame`, `removeEventListener`
    bajariladi.
12. **Har fayl mustaqil va to'liq** — `// ... qolgani o'zgarmaydi`
    kabi qisqartirish yozma.

# 3. ARXITEKTURA PRINSIPLARI

Bular kodning shakli haqida. Ularni buzgan kod qayta yozdiriladi.

1. **Reagent nomi komponent ichida qattiq yozilmaydi.**
   `if (reagent === 'NH₃')` — arxitektura buzilishi. Moddaga xos
   hamma narsa `lib/` dagi jadvallarda yashaydi, komponent uni faqat
   o'qiydi.
2. **Rang state'da saqlanmaydi.** `useState('#1E3A8A')` — noto'g'ri.
   Rang har doim idishdagi moddalar tarkibidan **hisoblab chiqariladi**.
   Sabab: rang state'ga tushsa, ikkita haqiqat manbai paydo bo'ladi va
   ular albatta bir-biridan ajralib ketadi.
3. **Foydalanuvchi xatosi bloklanmaydi.** "Bu miqdorda quya olmaysiz"
   ogohlantirishi, o'chirilgan tugma, avtomatik to'g'rilash — yo'q.
   Noto'g'ri harakat **amalga oshadi va boshqacha natija beradi**.
   O'quvchi xatodan o'rganadi, taqiqdan emas.
   *Yagona istisno:* serverning o'zi qo'ygan chegara — bir tajribada
   ko'pi bilan **6 xil** reagent. Bu 7-chisini yubormaslik uchun
   client tomonda ham ushlab turiladi.
4. **Diskret porsiya yo'q.** `+5 ml` tugmasi taqiqlanadi. Faqat
   uzluksiz oqim: bosib ushlab turiladi, qo'yib yuborilganda to'xtaydi.
5. **Toza funksiyalar.** `quy()` faqat moddani qo'shadi — rang va
   cho'kma haqida hech narsa bilmaydi. `baho()` faqat o'qiydi —
   holatni o'zgartirmaydi.

# 4. HOZIRGI LABORATORIYA QANDAY ISHLAYDI

Buni tushunmasdan 3D yozib bo'lmaydi.

**Inventar.** Foydalanuvchida `LabItem` ro'yxati bor: har biri
`kalit` (masalan `probirka` yoki `H₂SO₄`), `soni`, `turi`
(`reagent` | `jihoz` | `texnika`) va `nodirlik`
(`oddiy` | `kam` | `nodir` | `noyob`).

**Reagent kalitlari — kimyoviy formulaning o'zi**, pastki indekslar
Unicode belgilar bilan: `H₂O`, `NaOH`, `H₂SO₄`, `CuSO₄`, `KMnO₄`,
`FeCl₃`, `CaCO₃`, `NH₃`. **Kalitni o'zgartirma, tarjima qilma,
`H2O` deb yozma** — server aynan shu satrni kutadi. Bazada 242 ta
modda va ~250 ta muvozanatlangan reaksiya bor.

**Tajriba qanday o'tkaziladi.** Foydalanuvchi reaksiyani RO'YXATDAN
TANLAMAYDI. U reagentlarni qo'shadi va nima bo'lishini ko'radi.
Server tanlangan to'plamga mos reaksiyani **o'zi topadi**
(tenglamaning chap tomoni bo'yicha). Mos reaksiya bo'lmasa — bu xato
emas, bu natija: "aralashma qoldi, hech narsa sarflanmadi".

**Kashfiyot.** Reaksiya ilk marta o'tkazilsa qo'shimcha ochko beriladi
va tenglama ochiladi. Shu paytgacha foydalanuvchi mahsulotni bilmaydi.
**Shuning uchun 3D animatsiya tenglamani emas, KUZATUVNI ko'rsatadi.**

# 5. API SHARTNOMALARI (aynan shunday, o'zgartirilmaydi)

## 5.1. `GET /api/laboratoriya`

```json
{
  "success": true,
  "lab": {
    "id": "clx...", "nom": "Mening laboratoriyam",
    "daraja": 3, "tajriba": 145,
    "darajaHolati": { "daraja": 3, "joriy": 65, "kerak": 100, "foiz": 65 }
  },
  "balans": { "coins": 320, "gems": 4, "stars": 12 },
  "inventar": [
    { "kalit": "probirka", "soni": 3, "nom": "Probirka",
      "turi": "jihoz", "guruh": "shisha", "icon": "🧪",
      "nodirlik": "oddiy", "sotishNarxi": 3,
      "sarflanadi": false, "tavsif": "Eng asosiy idish..." },
    { "kalit": "CuSO₄", "soni": 5, "nom": "CuSO₄",
      "turi": "reagent", "guruh": null, "icon": null,
      "nodirlik": "kam", "sotishNarxi": 6,
      "sarflanadi": false, "tavsif": null }
  ]
}
```

`401` — tizimga kirmagan. Bu holatda 3D sahifa ochilmaydi, "Kirish"
taklifi ko'rsatiladi.

## 5.2. `GET /api/laboratoriya/tajriba`

```json
{ "success": true,
  "mumkin": { "jami": 12, "kashfEtilgan": 8, "jamiReaksiya": 214,
              "royxat": [ /* pastda */ ] },
  "jurnal": [ { "id": "...", "equation": "...", "tajriba": 25,
                "birinchi": true, "createdAt": "..." } ] }
```

`royxat` elementi:

```json
{
  "id": "rx_123", "equation": "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
  "name": "Mis gidroksidining cho'kishi", "category": "Cho'ktirish",
  "kashfEtilgan": true, "isVerified": true, "kerakliDaraja": 1,
  "reagentlar": [
    { "kalit": "CuSO₄", "nom": "CuSO₄", "koef": 1 },
    { "kalit": "NaOH", "nom": "NaOH", "koef": 2 }
  ],
  "jihozlar": [ { "kalit": "probirka", "nom": "Probirka", "icon": "🧪" } ]
}
```

**Bu — stexiometriyaning kaliti.** `kashfEtilgan: false` bo'lganda
`equation` va `name` — `null` (mahsulotni oshkor qilmaslik uchun),
lekin **`reagentlar[].koef` HAR DOIM beriladi**. Ya'ni to'g'ri
nisbatni (`CuSO₄ : NaOH = 1 : 2`) mahsulotni oshkor qilmasdan
oldindan bilasan. Aynan shundan foydalan.

## 5.3. `POST /api/laboratoriya/tajriba`

So'rov: `{ "kalitlar": ["CuSO₄", "NaOH"], "reactionId": null }`

**Diqqat: so'rovda hajm YO'Q va bo'lmaydi.** Server integer
koeffitsient bilan ishlaydi. Millilitr faqat client tomonda yashaydi.

Uch xil javob — uchalasini ham qayta ishlash SHART:

**(a) Muvaffaqiyat (200):**

```json
{
  "success": true,
  "reaksiya": {
    "id": "rx_123",
    "equation": "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
    "name": "Mis gidroksidining cho'kishi",
    "category": "Cho'ktirish",
    "observations": "Och ko'k jelesimon cho'kma tushadi, eritma rangsizlanadi.",
    "hazards": ["Ishqor teriga tegsa kuydiradi"],
    "temperature": "xona harorati", "catalyst": null,
    "environment": "suvli eritma", "isVerified": true
  },
  "sarflandi": [ { "kalit": "CuSO₄", "nom": "CuSO₄", "soni": 1 } ],
  "olindi": [ { "kalit": "Cu(OH)₂", "nom": "Cu(OH)₂", "soni": 1,
                "nodirlik": "nodir", "icon": null } ],
  "birinchi": true, "olinganXP": 25,
  "yangiDaraja": 4, "darajaOshdi": true,
  "daraja": { "daraja": 4, "joriy": 10, "kerak": 140, "foiz": 7 }
}
```

**(b) Tanlov kerak (200)** — bir xil reagentlardan sharoitga qarab
har xil mahsulot chiqadi:

```json
{ "success": true, "tanlov": [
  { "id": "rx_1", "name": "Natriy digidrofosfat hosil bo'lishi",
    "temperature": "xona harorati", "catalyst": null,
    "environment": "suvli eritma",
    "reagentlar": [ { "kalit": "H₃PO₄", "nom": "H₃PO₄", "koef": 1 } ] }
] }
```

Bu holatda reaksiya BOSHLANMAYDI — foydalanuvchidan sharoit so'raladi,
keyin tanlangan `id` `reactionId` sifatida qayta yuboriladi.
Tenglama ko'rsatilmaydi: tanlov sharoit bo'yicha qilinadi.

**(c) Xato:** `{ "error": "..." }`
`400` — foydalanuvchi ko'radigan oddiy natija (reaksiya bo'lmadi,
reagent yetmadi). Qizil "sistema xatosi" qilib ko'rsatma — idishda
xira aralashma qolganini ko'rsatuvchi yumshoq animatsiya qil.
`409` — baza band, "qayta urinish" tugmasi.

# 6. STEXIOMETRIYA — 3D ning asosiy yangiligi

Bu 2D versiyada yo'q va aynan shuning uchun 3D qilinyapti.

## Qanday ishlaydi

1. Foydalanuvchi reagent shishasini idish ustiga olib boradi va
   **bosib ushlab turadi**. Har kadrda `oqim × dt` millilitr quyiladi
   (`oqim ≈ 0.8 ml/s`, idish qanchalik qiya bo'lsa shuncha tez).
2. Quyilgan hajm mol miqdoriga aylantiriladi. Konsentratsiya bazada
   yo'q, shuning uchun **shartli standart** olinadi: har bir reagent
   `0.5 M` (`lib/sozlama.js` da bitta o'zgaruvchi). Bu soddalashtirish
   — izohda shu ochiq yozilsin, chunki bu kimyoviy da'vo emas, o'yin
   shartidir.
3. `GET /api/laboratoriya/tajriba` dagi `reagentlar[].koef` dan
   **kerakli nisbat** olinadi.
4. Haqiqiy nisbat kerakligiga solishtiriladi va **holat** chiqadi:

| Holat | Shart | Ma'nosi |
|---|---|---|
| `chala` | eng kam reagent 60% dan kam | Reaksiya to'liq ketmadi |
| `togri` | ±20% ichida | Stexiometrik nisbat |
| `ortiqcha` | biror reagent 1.5 barobardan ko'p | Ortiqcha reagent qoldi |
| `keskin-ortiqcha` | 3 barobardan ko'p | Mahsulot qaytadan o'zgarishi mumkin |

5. **Holat NIMA HOSIL BO'LISHINI o'zgartirmaydi** (uni server hal
   qiladi), lekin quyidagilarni o'zgartiradi:
   - cho'kma qatlamining qalinligi (`chala` da yupqa)
   - eritmaning loyqaligi
   - rangning to'yinganligi
   - hisobotdagi baho va tushuntirish
6. Cheklovchi reagent (limiting reagent) hisoblanadi, ortiqchasi
   `qoldiq` sifatida holatda saqlanadi va hisobotda ko'rsatiladi.

## Nima uchun shunday

Talaba "ammiakni ko'p quysam cho'kma erib ketadi" degan haqiqatni
faqat miqdor bilan o'ynaganda o'rganadi. Tugma bosish buni bermaydi.
Lekin serverni miqdorga o'tkazish butun iqtisodni qayta yozishni
talab qiladi — shuning uchun birinchi bosqichda miqdor **ko'rinish
va baho** darajasida qoladi.

# 7. MA'LUMOT RO'YXATLARI

## 7.1. Jihoz kalitlari (3D model kerak bo'lganlari)

| kalit | nom | guruh |
|---|---|---|
| `probirka` | Probirka | shisha |
| `kolba` | Kolba | shisha |
| `konussimon-kolba` | Konussimon kolba (Erlenmeyer) | shisha |
| `dumaloq-tubli-kolba` | Dumaloq tubli kolba | shisha |
| `stakan` | Kimyoviy stakan | shisha |
| `kristallizator` | Kristallizator | shisha |
| `probirka-shtativi` | Probirka shtativi | tayanch |
| `shtativ` | Shtativ | tayanch |
| `aralashtirgich` | Aralashtirgich | tayanch |
| `tigel-qisqichi` | Tigel qisqichi | tayanch |
| `spirtovka` | Spirtovka | isitish |
| `suv-hammomi` | Suv hammomi | isitish |
| `pech` | Muffel pechi | isitish |
| `voronka` | Voronka | ajratish |
| `tomizuvchi-voronka` | Tomizuvchi voronka | ajratish |
| `qaytar-sovutgich` | Qaytar sovutgich | ajratish |
| `haydash-apparati` | Haydash apparati | ajratish |
| `tomizgich` | Tomizgich | olchov |
| `pipetka` | Pipetka | olchov |
| `byuretka` | Byuretka | olchov |
| `termometr` | Termometr | olchov |
| `ph-metr` | pH-metr | olchov |
| `chinni-kosacha` | Chinni kosacha | chinni |
| `shamotli-tigel` | Shamotli tigel | chinni |
| `kvars-naycha` | Kvars naycha | gaz |
| `kipp-apparati` | Kipp apparati | gaz |
| `himoya-ekrani` | Himoya ekrani | himoya |

Bundan tashqari `sanoat` guruhida 11 ta zavod qurilmasi bor
(`elektrolizyor`, `domna-pechi`, `konvertor`, `kontakt-apparati`,
`absorbsion-minora`, `yuqori-bosim`, `kompressor`,
`issiqlik-almashtirgich`, `elektr-yoyi-pechi`, `sanoat-pechi`,
`elektrodlar`). **Ularga alohida model yozma** — umumiy "quti +
quvur" ko'rinishidagi zaxira model yetarli.

**Byuretka alohida ahamiyatli** — uzluksiz quyishning asosiy asbobi.
Unda jo'mrak (`TorusGeometry` + tutqich) bo'lsin, tutqich burchagi
oqim tezligini belgilasin.

## 7.2. Kuzatuv (`observations`) lug'ati

Server matn qaytaradi, sen undan effekt chiqarasan. Bazadagi haqiqiy
iboralar:

- `cho'kma`, `cho'kadi`, `jelesimon cho'kma` → **cho'kma**
- `gaz`, `pufakcha`, `ajraladi`, `ko'pik` → **gaz pufakchalari**
- `bug'`, `hovur` → **bug'**
- `hid` (`ammiak hidi`, `o'tkir hid`) → **hid to'lqini**
- `issiqlik ajraladi`, `qiziydi`, `isiydi` → **qizish**
- `eriydi`, `qattiqlashadi` → **holat o'zgarishi**
- `loyqa`, `xiralashadi` → **loyqalanish**
- `tiniqlashadi` → **tiniqlashish**
- `alanga`, `yonadi`, `shiddatli` → **alanga**
- `lakmus qizaradi`, `fenolftalein pushti`, `pH ≈ 4.5` → **indikator**
- Rang so'zlari: `oq`, `qora`, `qizil`, `sariq`, `yashil`, `ko'k`,
  `pushti`, `jigarrang`, `binafsha`, `och`, `to'q`, `rangsiz`,
  `qizil-jigarrang`, `yashil-ko'k` → **rang o'zgarishi**

Matn o'zbekcha va apostroflar har xil bo'lishi mumkin (`'`, `'`, `‘`).
Taqqoslashdan oldin kichik harfga o'tkaz va apostroflarni birxillashtir.

## 7.3. Dizayn tili (loyihaning mavjud uslubi)

- Fon: `bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950`
- Panellar: `bg-slate-900/60 border border-purple-800/50 rounded-2xl`
- Asosiy tugma: `bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl`
- Ikkilamchi tugma: `bg-slate-800/70 border border-purple-800/50`
- Matn: oq / `text-purple-300` / izohlar `text-purple-500 text-[11px]`
- Nodirlik: oddiy — `slate`, kam — `green`, nodir — `blue`, noyob — `purple`
- Tanga `🪙 amber`, olmos `💎 cyan`

# 8. YOZILADIGAN FAYLLAR

Hammasi `app/laboratoriya/3d/` ichida, **19 ta fayl, 4 bosqichda**.

---

## 1-BOSQICH — mantiq (UI yo'q, Three.js yo'q)

Bu bosqich sof JavaScript. Uni brauzersiz ham sinab ko'rish mumkin.

### FAYL 1/19 — `lib/sozlama.js`

Sahnaning barcha sonli qiymatlari BITTA joyda. Boshqa fayllar
raqamlarni o'zidan yozmaydi.

- `KAMERA` — `{ fov: 45, yaqin: 0.1, uzoq: 100, boshlangich: [0, 1.6, 3.2], nishon: [0, 0.95, 0] }`
- `BOSHQARUV` — `{ engYaqin: 1.2, engUzoq: 6, engKattaBurchak: Math.PI / 2.05 }`
  (oxirgisi kamerani stol ostiga tushishdan saqlaydi)
- `STOL` — `{ eni: 3.2, boyi: 1.6, qalinligi: 0.08, balandligi: 0.9 }`
- `SLOTLAR` — stol ustidagi 6 ta joy koordinatasi (2 qator × 3 ustun)
- `RANGLAR` — `{ stol: 0x2a2438, shisha: 0xcfe8ff, metall: 0x9aa4b2, fon: 0x0b0714 }`
- `QUYISH` — `{ oqim: 0.8, engKopHajm: 150, standartKonsentratsiya: 0.5 }`
- `NISBAT_CHEGARALARI` — `{ chala: 0.6, togri: 0.2, ortiqcha: 1.5, keskin: 3 }`
- `EFFEKT_DAVOMIYLIGI`, `ZARRA_SONI` — `{ pufak: 60, chokma: 120, bug: 40 }`

### FAYL 2/19 — `lib/idish-holati.js`

Idishning ichida nima borligi. **Toza funksiyalar, Three.js yo'q.**

```js
export function idishYarat(kalit, hajm = 0)       // → holat
export function quy(holat, reagentKaliti, ml)     // → YANGI holat (mutatsiya yo'q)
export function tozala(holat)                     // → bo'sh holat
export function molMiqdori(holat, kalit)          // ml → mol
export function jamiHajm(holat)
```

Holat shakli:

```js
{
  idish: 'probirka',
  moddalar: { 'CuSO₄': { ml: 20, mol: 0.01 }, 'NaOH': { ml: 5, mol: 0.0025 } },
  hajm: 25,
  harorat: 20,
}
```

`quy()` **faqat moddani qo'shadi** — rang, cho'kma, reaksiya haqida
hech narsa bilmaydi. Nega: shu ajratish bo'lmasa, keyinchalik
"quyish" ni sinash uchun butun 3D sahnani ishga tushirish kerak
bo'lardi.

### FAYL 3/19 — `lib/stexiometriya.js`

6-bo'limdagi hisob.

```js
// koeflar: [{ kalit, koef }] — API dan kelgan reagentlar
export function nisbatniBaho(holat, koeflar, sozlama)
// → { holat: 'chala'|'togri'|'ortiqcha'|'keskin-ortiqcha',
//      cheklovchi: 'CuSO₄',
//      qoldiq: { 'NaOH': 0.004 },
//      togrilikFoizi: 0.82,
//      izoh: "Ammiak 2.4 barobar ortiqcha quyildi" }
```

Ichida:
- Har bir reagent uchun `mol / koef` hisoblanadi — eng kichigi
  **cheklovchi reagent**.
- Boshqalarining cheklovchiga nisbati `1.0` dan qanchalik uzoqligi
  holatni beradi.
- `izoh` — o'zbekcha, bitta jumla, aybsiz ohangda.

Sof funksiya. Test yozish oson bo'lishi kerak.

### FAYL 4/19 — `lib/modda-korinishi.js`

`export function moddaKorinishi(kalit)` →
`{ rang: 0x38bdf8, holat: 'suyuq'|'qattiq'|'gaz', shaffoflik: 0.7 }`

Ikki bosqichli:

1. **Aniq jadval** — eng ko'p uchraydigan ~40 modda qo'lda:
   `H₂O` rangsiz, `CuSO₄` to'q ko'k, `KMnO₄` binafsha,
   `FeCl₃` sariq-jigarrang, `NaOH` rangsiz, `K₂Cr₂O₇` to'q sariq,
   `NiSO₄` yashil, `CoCl₂` pushti, `I₂` binafsha-qora, `S` sariq,
   `C` qora, `Cu` qizil-jigarrang, `Fe` kulrang.
2. **Taxmin** — jadvalda yo'q bo'lsa formuladan: `Cu` → ko'k,
   `Fe` → sarg'ish-jigarrang, `Mn` → binafsha, `Cr` → yashil,
   `Ni` → yashil, `Co` → pushti, hech biri yo'q → rangsiz.

Izohda **nega ikki bosqich** kerakligini yoz: bazada 242 ta modda bor,
hammasiga qo'lda rang berish real emas, lekin ko'p ishlatiladiganlari
noto'g'ri rangda ko'rinsa o'quvchi noto'g'ri narsa yodlab qoladi.

### FAYL 5/19 — `lib/rang-aralashtirish.js`

```js
export function aralashmaRangi(holat)   // → { rang, shaffoflik, loyqalik }
export function rangGaOt(hozirgi, nishon, dt, davomiylik = 0.6)
```

Rang **har doim shu yerda hisoblanadi**, hech qayerda saqlanmaydi.
Aralashtirish hajm bo'yicha og'irlikli: 20 ml ko'k + 5 ml rangsiz =
och ko'k. `THREE.Color` ishlatmaydi — oddiy `{r,g,b}` bilan ishlaydi,
shunda bu fayl Three.js ga bog'liq bo'lmaydi.

### FAYL 6/19 — `lib/kuzatuv-tahlil.js`

`export function effektlarniAniqla(observations, nisbatBahosi)` →
effekt tavsiflari massivi:

```js
[ { turi: 'chokma', rang: 0x88bbee, kuch: 0.4, kechikish: 0.4 },
  { turi: 'rang', rang: 0xffffff, kechikish: 0 } ]
```

Qoidalar:
- Matnni kichik harfga o'tkaz, apostroflarni birxillashtir.
- 7.2-bo'limdagi kalit so'zlarni qidir.
- Rang so'zi topilsa eng yaqin effektga bog'la ("sariq cho'kma" →
  cho'kma sariq rangda).
- **`kuch` — `nisbatBahosi` dan keladi**: `chala` bo'lsa cho'kma
  yupqa (0.3), `togri` bo'lsa to'liq (1.0).
- Hech narsa topilmasa **bo'sh massiv EMAS**,
  `[{ turi: 'aralashish' }]` qaytar — foydalanuvchi har doim biror
  harakat ko'rishi kerak, aks holda "tugma ishlamadi" deb o'ylaydi.
- Ko'pi bilan 4 ta effekt.

Sof funksiya — Three.js import qilmaydi.

### FAYL 7/19 — `lib/jurnal.js`

Laboratoriya daftari.

```js
export function jurnalYarat()
export function yoz(jurnal, yozuv)
// yozuv: { vaqt: 47.3, amal: 'quyish', reagent: 'NH₃', ml: 12.4 }
export function hisobot(jurnal, natija, nisbatBahosi)
// → { qadamlar: [...], xulosa: '...', ogohlantirishlar: [...] }
```

`hisobot()` jurnalni va stexiometriya bahosini o'zbekcha
tushuntirishga aylantiradi:

```
2-qadam. Siz 12.4 ml NH₃ quydingiz — kerakli nisbatdan 2.4 barobar ko'p.
Shu sababli hosil bo'lgan Cu(OH)₂ cho'kmasi qaytadan erib, kompleksga
o'tdi. Kamroq quysangiz cho'kma idish tubida qolardi.
```

**Ball qo'yilmaydi.** Sabab: ball serverda tekshirilishi kerak, server
esa hajmni bilmaydi. Ball o'rniga tushuntirish beriladi — o'quv
qiymati baribir shunda.

---

## 2-BOSQICH — 3D sahna (statik, interaktivlik yo'q)

### FAYL 8/19 — `lib/materiallar.js`

Materiallar BIR MARTA yaratiladi va qayta ishlatiladi — har bir
probirka uchun alohida material yaratish 20 ta idishda sezilarli
sekinlashtiradi.

`export function materiallarniYarat()` →
- `shisha` — `MeshPhysicalMaterial`: `transparent: true, opacity: 0.25,
  roughness: 0.05, metalness: 0, transmission: 0.9, thickness: 0.4,
  ior: 1.5, side: THREE.DoubleSide`
- `shishaArzon` — `MeshStandardMaterial` `transparent, opacity: 0.3`
  (**`transmission` mobil GPU da juda qimmat** — kuchsiz qurilmada
  shu ishlatiladi, tanlov `useSahna` da)
- `metall` — `{ roughness: 0.3, metalness: 0.85 }`
- `chinni` — oq, `roughness: 0.6`
- `yogoch` — stol
- `suyuqlikYasa(rang, shaffoflik)` — har bir eritma uchun yangi

`export function materiallarniTozala(m)` — hammasini `dispose()`.

### FAYL 9/19 — `lib/jihoz-modellari.js`

Eng katta fayl. `export function jihozYasa(kalit, materiallar)` →
`THREE.Group`.

```js
group.userData = {
  kalit,
  sigim: 50,             // ml
  suyuqlikMesh: null,    // eritma
  chokmaMesh: null,      // cho'kma qatlami (alohida!)
  ogizBalandligi: 0.18,  // oqim shu nuqtaga tushadi
  tanlanadi: true,
}
```

Aniq yoziladigan modellar:

- **`probirka`** — `CylinderGeometry` (r=0.045, h=0.28) + yarim shar
  tubi. Suyuqlik `scale.y` va `position.y` **birga** o'zgaradi, aks
  holda suyuqlik tubdan ajralib qoladi.
- **`stakan`** — ochiq silindr + disk tub.
- **`konussimon-kolba`** — `LatheGeometry`, keng tubdan tor bo'g'izga.
- **`dumaloq-tubli-kolba`** — sfera + tor bo'yin.
- **`kolba`**, **`kristallizator`**.
- **`byuretka`** — uzun ingichka naycha + **jo'mrak** (`TorusGeometry`
  + tutqich). `userData.jomrakBurchagi` oqim tezligini belgilaydi.
- **`tomizgich`** — rezina balon + ingichka naycha.
- **`spirtovka`** — metall idish + pilik + **alanga mesh'i**
  (`ConeGeometry`, `MeshBasicMaterial`, boshida `visible: false`),
  `userData.alanga` ga saqlanadi.
- **`shtativ`**, **`probirka-shtativi`**, **`termometr`**, **`voronka`**.
- Qolganlari uchun `zaxiraModel(kalit)` — quti + quvur + yorliq.

**Segment soni 32 dan oshmasin** — telefonda muhim.

**Matn yorlig'i** uchun `CanvasTexture` yordamchisi: canvas 256×64,
`bold 48px sans-serif`, `SpriteMaterial`, `sprite.scale.set(0.3, 0.075, 1)`.

Har bir model funksiyasi tepasida bitta qatorli izoh: bu idish nima
uchun ishlatiladi (kimyoviy ma'no).

### FAYL 10/19 — `hooks/useSahna.js`

`export function useSahna(konteynerRef)` →
`{ tayyor, sahnaRef, jihozQosh, jihozOlib, hammaJihozlar, kuchsizQurilma }`

- Scene, PerspectiveCamera, WebGLRenderer (`antialias: true`,
  `powerPreference: 'high-performance'`),
  `setPixelRatio(Math.min(devicePixelRatio, 1.5))`
- OrbitControls: `enableDamping`, `maxPolarAngle` cheklangan,
  `enablePan: false` (telefonda panning tasodifan ishlaydi)
- Yorug'lik: `AmbientLight(0x404060, 0.9)` + **ko'pi bilan 2 ta**
  `DirectionalLight`, faqat bittasi `castShadow`
- Stol, orqa devor, `scene.fog` — chekka joylar qorayib e'tibor
  stolga tushadi
- **Kuchsiz qurilma aniqlash**: `hardwareConcurrency <= 4` yoki
  `deviceMemory <= 4` bo'lsa `shishaArzon` materiali va soyasiz rejim
- `ResizeObserver` (window `resize` emas — panel yig'ilganda ham
  canvas o'lchami o'zgaradi)
- `document.visibilitychange` — sahifa fonga o'tsa render to'xtaydi
- To'liq tozalash

### FAYL 11/19 — `components/MobilOgohlantirish.jsx`

Ekran eni < 768px **yoki** `hardwareConcurrency <= 4` **yoki** WebGL
kontekst olinmadi → modal: "Bu sahifa kuchli qurilma talab qiladi.
Oddiy laboratoriya har qanday telefonda ishlaydi." Ikki tugma:
**"Baribir ochish"** va **"Oddiy laboratoriyaga o'tish"** (`/laboratoriya`).

Tanlov `localStorage` da eslab qolinadi — har safar so'ramaydi.

---

## 3-BOSQICH — interaktivlik va quyish

### FAYL 12/19 — `hooks/useSudrash.js`

`Raycaster` + `Vector2`:
- Ustiga kelganda idishni yoritadi (`emissive`), kursor `pointer`
- Bosilganda idish tanlanadi
- Hodisalar `renderer.domElement` ga qo'yiladi, `window` ga emas
- Teginish (`pointerdown/move/up`) va sichqoncha bitta yo'l bilan

### FAYL 13/19 — `hooks/useQuyish.js`

**Eng muhim hook.** Uzluksiz oqim.

```js
export function useQuyish({ sahnaRef, holatRef, jurnalRef, onOzgarish })
// → { quyishBoshla(reagentKaliti, idishGroup), quyishToxtat(), quyilmoqda, hajm }
```

Ishlash tartibi:
- `pointerdown` → shisha idish ustiga uchadi, `rotation.z` bilan
  egiladi (~50°)
- Har kadrda: `quy(holat, reagent, OQIM * dt)`; oqim byuretka
  jo'mragi burchagiga ko'paytiriladi
- Oqim ko'rinishi: ingichka `CylinderGeometry` shishadan idish
  og'zigacha, uchida tomchilar (`Points`)
- Idishdagi suyuqlik sathi real vaqtda ko'tariladi, rangi
  `aralashmaRangi()` dan qayta hisoblanadi
- `pointerup` yoki `pointerleave` → to'xtaydi, shisha joyiga qaytadi
- Har bir quyish jurnalga yoziladi

**Hech qanday oldindan belgilangan porsiya yo'q. Hech qanday
"juda ko'p quydingiz" ogohlantirishi yo'q.** 150 ml quysa ham
qabul qilinadi — idish to'lib toshadi va bu ham natija.

### FAYL 14/19 — `lib/effektlar.js`

Har bir effekt bir xil shartnomaga bo'ysunadi:

```js
export function pufakEffekti(sahna, idish, sozlama) {
  return {
    yangila(dt, otganVaqt) {},
    tugadimi() {},
    tozala() {},   // dispose + sahnadan olib tashlash
  }
}
```

Effektlar: `pufakEffekti` (`Points`, yuqoriga), `chokmaEffekti`
(tepadan tushib tubda to'planadi, qalinligi `kuch` ga bog'liq),
`rangEffekti` (`lerp`, ~0.6s — keskin almashtirish sun'iy ko'rinadi),
`bugEffekti`, `alangaEffekti` (spirtovka alangasi, `Math.sin` bilan
tebranadi), `qizishEffekti` (qizil `PointLight`), `loyqaEffekti`,
`hidEffekti` (shaffof halqalar), `aralashishEffekti` (zaxira).

`export function effektlarniIshgaTushir(sahna, idish, tavsiflar)` —
kechikishlarni hisobga olib yoqadi, bitta boshqaruvchi qaytaradi.

### FAYL 15/19 — `hooks/useTajriba.js`

API bilan bog'lanish va ketma-ketlik.

```js
export function useTajriba({ sahnaRef, holatRef, jurnalRef, holatniYangila })
// → { otkaz, otkazilmoqda, natija, tanlov, xato, nisbatBahosi, hisobotMatni }
```

`otkaz(reactionId = null)`:

1. `otkazilmoqda = true`, ikki marta bosishdan himoya
2. Idishdagi moddalar ro'yxatidan `kalitlar` yig'iladi
3. **So'rov darrov yuboriladi**, animatsiya bir vaqtda o'ynaydi
   (`Promise.all` emas — so'rovni oldin boshla). Aks holda
   foydalanuvchi ikki marta kutadi.
4. Javobga qarab:
   - `tanlov` → animatsiyani to'xtat, tanlov panelini ko'rsat
   - `error` (400) → suyuqlikni xira kulrang qil, yumshoq xabar
   - muvaffaqiyat → `nisbatniBaho(...)` → `effektlarniAniqla(observations, baho)`
     → `effektlarniIshgaTushir(...)` → tugagach natija va hisobot
5. `holatniYangila()` — inventarni qayta yuklash

---

## 4-BOSQICH — interfeys

### FAYL 16/19 — `components/ReagentJavoni.jsx`

Props: `{ reagentlar, faol, onTanla, quyilgan }`

- Kartochka: rang doirasi (`moddaKorinishi(kalit).rang` dan),
  formula, `×soni`
- Bosilganda **faol reagent** bo'ladi — keyin idish ustida bosib
  ushlab turiladi
- Quyilganlari yonida real vaqtda `12.4 ml` ko'rsatiladi
- 6 xildan ko'p quyilmaydi (server chegarasi) — 6 ta bo'lganda
  qolganlari xira va tepada sabab yozilgan
- Qidiruv maydoni (242 ta modda)
- Nodirlik bo'yicha rangli chegara

### FAYL 17/19 — `components/JihozJavoni.jsx`

Props: `{ jihozlar, stolda, onQosh, onOlib }`

Inventardagi jihozlar, guruh bo'yicha yig'ilgan. Bosilganda stolga
qo'yiladi (bo'sh slot bo'lsa), yana bosilganda olinadi. 6 ta slot.

### FAYL 18/19 — `components/NatijaPaneli.jsx`

Props: `{ natija, tanlov, xato, hisobot, nisbatBahosi, onYop, onTanlovTanla, onQaytaUrin }`

To'rt holat:
1. **Natija** — tenglama, nomi, "Nima ko'rindi" (`observations`),
   xavfsizlik ogohlantirishlari, "Sarflandi" / "Inventarga tushdi",
   `+XP`, "🎉 Birinchi kashfiyot", "N-daraja"
2. **Hisobot** — `lib/jurnal.js` dan kelgan qadamma-qadam tahlil.
   Xato qadam qizil emas, **sariq** bo'lsin va yonida "nega shunday
   bo'ldi" yozilsin. Ayblov ohangi yo'q.
3. **Tanlov** — sharoit tugmalari (harorat, katalizator, muhit).
   **Tenglama ko'rsatilmaydi.**
4. **Xato** — yumshoq ohangda

Panel o'ngdan sirg'aladi, telefonda pastdan ko'tariladi.

### FAYL 19/19 — `page.js` va `korinish.js`

**`page.js`** (server komponent, ~25 qator) — loyihada `"use client"`
sahifalar ikkiga bo'linadi: `page.js` faqat SEO metadata beradi:

```js
import Korinish from "./korinish"
export const metadata = {
  title: "3D Laboratoriya",
  description: "...",  // o'zbekcha, 150–160 belgi
}
export default function Sahifa() { return <Korinish /> }
```

**`korinish.js`** (`"use client"`) — hammasini yig'adi:

```
┌─ ← Laboratoriya | 🔬 3D Laboratoriya | daraja chizig'i | 🪙 💎
├─────────────┬────────────────────────────┬──────────────┐
│ ReagentJavoni│      3D CANVAS             │ NatijaPaneli │
│ JihozJavoni  │  stol, jihozlar, oqim      │ + Hisobot    │
├─────────────┴────────────────────────────┴──────────────┤
└─ Idishdagi aralashma (real vaqtda) + "🔥 Tajriba" + "Tozalash"
```

- `useEffect` da `GET /api/laboratoriya` — `401` bo'lsa "Kirish" taklifi
- Yuklanayotganda skelet; xato bo'lsa "Qayta urinish" tugmasi.
  **"Laboratoriya bo'sh" deb ko'rsatma** — foydalanuvchi hamma
  narsasini yo'qotdim deb o'ylaydi.
- Telefonda panellar canvas ustiga sirg'aluvchi varaq bo'lib chiqadi
- Pastda havola: "2D ko'rinishga qaytish → /laboratoriya"

---

# 9. YOZISH TARTIBI

1. Fayllarni **1 dan 19 gacha tartib bilan** yoz.
2. Har bir fayl oldidan sarlavha: `## FAYL N/19 — yo'l/nom.js`
3. Kod bloki tilini `js` yoki `jsx` deb belgila.
4. **Har bosqich tugagach to'xta** va bir necha jumla bilan nima
   yozilganini ayt. Men "davom et" desam keyingi bosqichga o't.
5. Javob o'rtada uzilib qolsa to'xta — men "davom et" deyman, sen
   uzilgan **faylning boshidan** qaytadan yozasan (yarim fayl foydasiz).
6. Fayl orasida uzun tushuntirish yozma.
7. Agar biror reaksiya yoki talab bu sxemaga sig'masa — **to'xta va
   ayt**, o'zingcha aylanib o'tma.

# 10. YAKUNIY TEKSHIRUV

Kod topshirishdan oldin o'zingni tekshir:

- [ ] Hech qayerda `@react-three/fiber`, `<Canvas>`, `useFrame` yo'q
- [ ] Hech qayerda `.glb` yoki `.gltf` yo'q
- [ ] Yangi npm paket yo'q, yangi API route yo'q, Prisma modeli yo'q
- [ ] Komponentlarda birorta reagent nomi qattiq yozilmagan
- [ ] Rang hech qayerda `useState` da saqlanmagan — hisoblanadi
- [ ] Foydalanuvchi 100 ml NH₃ quya oladi va dastur buni qabul qiladi
- [ ] `+5 ml` kabi diskret tugma yo'q — faqat bosib ushlash
- [ ] `H₂O` yozilgan, `H2O` emas
- [ ] Kashf etilmagan reaksiyaning tenglamasi ko'rsatilmagan
- [ ] Har bir `geometry` / `material` / `texture` uchun `dispose()`
- [ ] Interfeys va izohlar o'zbek tilida

Boshla: **1-BOSQICH, FAYL 1/19**.
