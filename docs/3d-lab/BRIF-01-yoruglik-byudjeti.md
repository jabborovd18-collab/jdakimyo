# BRIF-01 — Yorug'lik byudjeti va ekspozitsiya kalibrovkasi

**Qavat:** 0 (poydevor) · **Navbat:** birinchi · **Xavf:** o'rta
**Oldindan o'qish:** `AGENTS.md` (ayniqsa 1 va 11-bandlar),
`docs/3d-lab/YOL-XARITASI.md`

---

## Muammo

Jonli saytda (`jdakimyo.uz/laboratoriya/3d`) pol butunlay oq kuyib ketgan,
ship qop-qora, rakovina va shift panellari "yonib" turadi. Sabab —
sahnaga tushayotgan yorug'lik miqdorini hech kim hisoblamagan.

Hozirgi manbalar (ikki fayldan, bir-biridan bexabar):

| Fayl:qator | Manba | Kuch |
|---|---|---|
| `useSahna.js:266` | `AmbientLight` | 0.9 – 1.5 (mavzuga qarab) |
| `useSahna.js:272` | `DirectionalLight` (asosiy) | 1.4 – 1.6 |
| `useSahna.js:297` | `DirectionalLight` (to'ldiruvchi) | 0.5 – 0.6 |
| `xona-modellari.js:278` | `DirectionalLight` (daylight) | 1.4 |
| `xona-modellari.js:256` | `RectAreaLight` × N | har biri 1.4 |
| `xona-modellari.js:595` | `PointLight` | 1.0 |
| `useSahna.js` (env) | `RoomEnvironment` IBL | `environmentIntensity` = 1.0 |

`useSahna.js` dagi izohda "maksimal 2 ta DirectionalLight" deb yozilgan —
aslida uchta. Uchinchisi boshqa faylda tug'ilgan va izoh yolg'onga aylangan.

Muhim: three.js r165 dan boshlab `useLegacyLights` olib tashlangan, ya'ni
fizik jihatdan to'g'ri yorug'lik majburiy. Loyihada `three@0.170`. Yuqoridagi
`intensity` qiymatlari eski (legacy) modelga mo'ljallangan qiymatlarga
o'xshaydi va shu tufayli 3–5 barobar oshiq.

---

## Vazifa

### 1. Yagona yorug'lik byudjeti fayli

`app/laboratoriya/3d/lib/yoruglik.js` yarating. Unda:

- Barcha yorug'lik manbalarining ta'rifi **bitta ob'ektda**.
- `yoruglikniQur(scene, mavzu, sifatDarajasi)` — hamma nurni shu yerdan
  qo'shadi va ro'yxatini qaytaradi.
- `yoruglikniYangila(...)` — mavzu almashganda faqat qiymatni o'zgartiradi.
- Faylning boshida jadval izoh: qaysi manba, qancha, **nega shuncha**.

`xona-modellari.js` dan `DirectionalLight`, `RectAreaLight`, `PointLight`
yaratishni **butunlay chiqaring**. U faqat geometriya va material qaytarsin;
chiroq korpusi (troffer) qolsin, nur manbai yangi faylga ko'chsin.

### 2. Ekspozitsiya kalibrovkasi

O'lchash asboblarisiz sozlamang. Kalibrovka tartibi:

1. Vaqtinchalik o'lchov qo'shing: har 60 kadrda canvas'dan piksel o'qib,
   `luma = 0.2126R + 0.7152G + 0.0722B` bo'yicha gistogramma yig'ing va
   `console.table` ga chiqaring. Kerakli uchta son:
   - **kuygan ulush** — `luma > 0.98` bo'lgan piksellar %
   - **qora ulush** — `luma < 0.02` bo'lgan piksellar %
   - **o'rtacha luma**
2. Kamerani sahnaning uch nuqtasiga qo'yib o'lchang: stol oldida, xona
   markazida, shipga qaragan holda.
3. Nur kuchlarini va `toneMappingExposure` ni shu uch nuqtada quyidagi
   maqsadga yetguncha kamaytiring.
4. **O'lchov kodini commit qilmang** (AGENTS.md 6-band). Uni oxirgi
   kommitdan oldin olib tashlang, faqat topilgan sonlar qolsin.

### 3. `MeshBasicMaterial` larni tekshirib chiqing

Kod bazasida 22 ta bor. Har biri uchun qaror qiling:
- Chinakam nur chiqaradimi (EXIT, LED, ekran)? → qoldiring, lekin rangini
  bloom ostonasi bilan kelishing.
- Yo'qmi (shift paneli korpusi, davriy jadval, rakovina)? →
  `MeshStandardMaterial` ga o'tkazing.

`xona-modellari.js:241` dagi `trofferMat` (`0xf8fafc`) — birinchi nomzod.

---

## Qabul mezonlari (o'lchanadigan)

Uch kamera nuqtasining **har birida**, to'rt mavzuning **har birida**:

| Ko'rsatkich | Talab |
|---|---|
| Kuygan piksel (`luma > 0.98`) | **< 1%** |
| Qora piksel (`luma < 0.02`) | **< 5%** |
| O'rtacha luma | **0.18 – 0.45** |
| Ship va pol lumasi farqi | **< 0.5** (hozir ~0.95) |

Qo'shimcha:
- `xona-modellari.js` da `Light` so'zi qidirilganda **0 natija**.
- Yorug'lik manbalari soni va kuchi `lib/yoruglik.js` da bitta jadvalda.
- Bloom hozircha **o'chirilgan** qolsin (`useSahna.js`) — u 3.1 da,
  kalibrovkadan keyin qayta yoqiladi. Bu brifning ishi emas.

---

## Tegilmaydi

- Bloom/SSAO parametrlarini sozlash (3-qavat ishi).
- Yangi tekstura, model yoki HDRI qo'shish (BRIF-02).
- Xona o'lchamini o'zgartirish (BRIF-04).
- Kimyo mantig'i, `lib/lab-*.js`, server yo'llari.

---

## Dalil (ishni topshirishda shart)

BRIF-00 dagi asbob bilan:

1. `npm run lab3d:olcham` ning **kalibrovkadan oldingi** to'liq jadvali
   (12 qator).
2. Xuddi shu jadvalning **keyingi** holati.
3. Qaysi qator qaysi chegaradan chiqib ketgani va nima qilinganini
   qisqa izoh.

`.olcham/` dagi PNG'lar odam ko'rigi uchun avtomatik saqlanadi —
ularni sen ko'rishing shart emas, sonlar yetarli (AGENTS.md 11.1).

**BRIF-00 bajarilmagan bo'lsa, bu brifni boshlama** — o'lchamasdan
kalibrlab bo'lmaydi.

---

## Qo'shimcha topilma (2026-08-20) — mobil qurilma cho'kadi

Egasi telefonda sinab ko'rdi: qurilma jiddiy sekinlashdi. Sabab
o'lchandi va u shu brifning mavzusi — yorug'lik byudjeti faqat
ekspozitsiya haqida emas, **fragment narxi** haqida ham.

### 8 ta RectAreaLight

`xona-modellari.js:246-260` — `trofferYlar` massivida 8 ta shift
paneli bor va **har biriga bittadan `RectAreaLight(1.4)`** beriladi.

RectAreaLight three.js'dagi eng qimmat yorug'lik turi: LTC usulida
ishlaydi va har piksel uchun, har chiroqdan **ikkitadan tekstura
o'qishi** kerak. Soyani ham qo'llab-quvvatlamaydi. Sakkiztasi mobil
GPU uchun ko'tarib bo'lmaydigan yuk.

Umumiy hisob — telefon har piksel uchun ~13 manbani hisoblaydi:
2 Directional + Ambient (`useSahna`), 1 Directional + 8 RectArea +
1 Point (`xona-modellari`), ustiga `scene.environment` IBL.

### Arzon rejim bularga TA'SIR QILMAYDI

```
materiallarniYarat(fonKaliti, arzonRejim)   <- biladi
javon3dYasa(materiallar, arzonRejim)        <- biladi
xonaInteryeriniYasa(materiallar)            <- BILMAYDI
```

`xona-modellari.js` arzon rejim borligini umuman eshitmagan. Telefonda
o'chadigan narsalar — antialias, soya xaritasi, bloom, qimmat shisha.
**Sakkizta RectAreaLight o'chmaydi.** Ya'ni arzon rejim eng arzon
narsalarni o'chirib, eng qimmatini qoldiradi.

### Shu brifga qo'shiladigan vazifalar

1. `lib/yoruglik.js` **`arzonRejim` ni argument sifatida qabul qilsin.**
   Yagona egalik shuning uchun ham kerak: hozir yorug'lik ikki faylda
   tug'iladi va biri sifat pog'onasini bilmaydi.
2. Mobilda RectAreaLight **umuman ishlatilmasin**. O'rniga arzon
   muqobil: panel yuzasi `emissive` + bitta yumshoq umumiy manba.
   Yoki 8 tadan 2 taga tushirish.
3. `setPixelRatio` mobilda **1.0** bo'lsin (hozir `min(DPR, 1.5)` —
   DPR 3 bo'lgan telefonda piksel soni 2.25 barobar ortiq).
4. Har sifat pog'onasi uchun **yorug'lik soni chegarasi** yozilsin va
   `OLCHOV.md` da qayd etilsin.

### Sabab EMAS — vaqt sarflamang

Protsedural teksturalar 512x512 va 256x256. Telefon buni bemalol
ko'taradi. ~193 ta alohida mesh (draw call) ikkinchi darajali —
yuqoridagi shader yuki ustiga tushadi, lekin asosiy sabab emas.

### Kelib chiqishi

`4775a53` (19-avgust, "muhit yorug'ligi — RectAreaLight") — o'sha
oltita kommitdan biri. Telefon og'irligi ham, oq kuyish ham bitta
manbadan: sozlanmagan yorug'lik byudjetidan.
