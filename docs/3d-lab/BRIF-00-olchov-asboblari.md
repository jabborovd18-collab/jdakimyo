# BRIF-00 — Grafikani RAQAM bilan o'lchash asbobi

**Qavat:** 0 · **Navbat: ENG BIRINCHI** — qolgan hamma grafik ish shunga tayanadi
**Xavf:** past (yangi kod, mavjud sahnaga tegmaydi)

---

## Nega bu brif bor

Arena AI **rasm ko'ra olmaydi.** Bu uning kamchiligi emas, shunchaki
qobiliyat chegarasi — lekin oqibati og'ir bo'ldi:

19-avgustda grafikani yaxshilash uchun 6 ta kommit qilindi. Har biri
"dev server 200 qaytardi" deb tasdiqlandi, chunki boshqa tekshirish
usuli yo'q edi. Jonli saytda esa pol butunlay oq kuydi va ship qop-qora
chiqdi — ya'ni oltita kommit sahnani yaxshilamadi, buzdi.

Xulosa: **"skrinshot bilan isbotla" degan qoida ishlamaydi**, chunki uni
bajaruvchi ko'ra olmaydi. Shuning uchun dalil ko'z emas, **son** bo'lishi
kerak. Loyihada bunday naqsh allaqachon bor — `scripts/check-reactions.js`
238 reaksiyani tekshirib "0 xato" deb yozadi. Grafika uchun ham xuddi
shunday asbob kerak.

**Bu brif tugamaguncha boshqa hech qanday grafik ish boshlanmaydi.**

---

## Vazifa

### 1. Dev-only o'lchov marshruti

`app/laboratoriya/3d/olcham/page.js`

- Xuddi shu 3D sahnani yuklaydi (`korinish.js` ni qayta ishlatadi,
  nusxa ko'chirmaydi — 1-band).
- **Kirish talab qilmaydi**, lekin faqat dev'da:
  `if (process.env.NODE_ENV === 'production') notFound()`.
  Jonli saytda bu manzil 404 bo'lishi SHART.
- Sahna tayyor bo'lgach `window.__olcham` funksiyasini chiqaradi.
- Mavzu va kamera nuqtasini URL parametridan oladi:
  `?mavzu=tun&nuqta=stol`

Bu vaqtinchalik hack emas, doimiy asbob — shuning uchun 6-band
(vaqtinchalik fayl commit qilinmaydi) bunga tegishli emas. Lekin
production'da ochilmasligi qat'iy shart.

### 2. `window.__olcham()` nima qaytaradi

Kadrni o'qib (`renderer.domElement` dan `getImageData`, yoki
`readRenderTargetPixels`), har piksel uchun:

```
luma = 0.2126*R + 0.7152*G + 0.0722*B     // 0..1 oralig'ida
```

Qaytaradigan JSON:

| Maydon | Ma'nosi |
|---|---|
| `kuygan` | `luma > 0.98` bo'lgan piksellar ulushi (%) |
| `qora` | `luma < 0.02` bo'lgan piksellar ulushi (%) |
| `ortacha` | o'rtacha luma |
| `p50`, `p95` | median va 95-protsentil luma |
| `shipLuma` | kadrning yuqori 15% i bo'yicha o'rtacha |
| `polLuma` | kadrning quyi 35% i bo'yicha o'rtacha |
| `fps` | oxirgi 120 kadrning o'rtachasi |
| `uchburchak` | `renderer.info.render.triangles` |
| `chaqiruv` | `renderer.info.render.calls` |
| `teksturaXotira` | `renderer.info.memory.textures` |

O'lchashdan oldin sahna **barqarorlashishini** kuting (kamida 60 kadr) —
aks holda birinchi kadrlar yuklanmagan teksturalar bilan o'lchanadi va
son yolg'on chiqadi.

### 3. Skript — `scripts/lab3d-olcham.js`

- Playwright (`devDependencies` ga qo'sh) + chromium.
- Dev server ishlab turgan deb hisoblaydi (`http://localhost:3000`).
  Ishlamayotgan bo'lsa aniq xato bersin, jim qolmasin.
- **4 mavzu × 3 kamera nuqtasi = 12 o'lchov.**

Kamera nuqtalari qat'iy va nomli bo'lsin — aks holda "oldin/keyin"
solishtirib bo'lmaydi:

| Nom | Joylashuv |
|---|---|
| `stol` | Stol oldida, jihozlarga qaragan |
| `xona` | Xona markazida, gorizontal |
| `ship` | Xona markazida, yuqoriga qaragan |

- Natijani `console.table` bilan chiqaradi.
- Har o'lchovda PNG saqlaydi: `.olcham/<mavzu>-<nuqta>.png`.
  `.olcham/` **gitignore** ga qo'shiladi — rasm odam uchun, repo uchun emas.
- `--json` bayrog'i bilan sof JSON chiqarsin (keyingi taqqoslash uchun).
- Chiqishning oxirida **XULOSA** qatori: qaysi o'lchovlar
  BRIF-01 dagi chegaralardan chiqib ketgan.

### 4. `package.json`

```
"lab3d:olcham": "node scripts/lab3d-olcham.js"
```

### 5. Hujjat

`docs/3d-lab/OLCHOV.md` — qanday ishga tushirish, sonlar nimani
anglatadi, chegaralar qayerdan olingan.

---

## Qabul mezonlari

- `npm run lab3d:olcham` 12 qatorli jadval chiqaradi, xatosiz.
- Har qatorda yuqoridagi 10 ta maydon bor.
- `.olcham/` da 12 ta PNG paydo bo'ladi va u gitignore'da.
- Ikki marta ketma-ket ishga tushirilganda sonlar **barqaror**
  (o'rtacha luma farqi 0.02 dan kam). Barqaror bo'lmasa —
  kutish vaqti yetarli emas, tuzat.
- Production build'da `/laboratoriya/3d/olcham` **404** qaytaradi.
  Buni isbotla: `npm run build && npm start` dan keyin `curl`.
- Skript dev server ishlamayotganda tushunarli xato beradi.

---

## Tegilmaydi

Sahnaning o'zi — yorug'lik, material, geometriya, postprocessing.
Bu brif faqat **o'lchagich** quradi. O'lchagich sahnani o'zgartirsa,
u o'lchagich emas.

Yo'l-yo'lakay nuqson ko'rsang, tuzatma — `YOL-XARITASI.md` ga yozib qo'y.

---

## Dalil

`npm run lab3d:olcham` ning to'liq chiqishi (12 qator jadval) va
ketma-ket ikki ishga tushirishning sonlari — barqarorlikni ko'rsatish
uchun. Bu brif uchun skrinshot kerak emas: asbobning o'zi dalil.
