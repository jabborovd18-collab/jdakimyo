# 3D laboratoriya — o'lchov asbobi

Grafikani ko'z bilan emas, **son** bilan tekshirish. Asbob sahnani
o'zgartirmaydi; kadr, renderer va sahna grafini o'qiydi.

---

## Ishga tushirish

Boshqa terminalda dev server ishlab tursin:

```bash
npm run dev
```

Sukut profil — `desktop`:

```bash
npm run lab3d:olcham
```

Boshqa profilni o'lchash:

```bash
LAB3D_PROFIL=telefon npm run lab3d:olcham
LAB3D_PROFIL=desktop npm run lab3d:olcham
LAB3D_PROFIL=ilova npm run lab3d:olcham
```

BRIF-00B interfeysi buzilmagan. Eski nomlar alias:

```bash
LAB3D_SIFAT=arzon npm run lab3d:olcham   # telefon
LAB3D_SIFAT=toliq npm run lab3d:olcham   # desktop
```

`LAB3D_PROFIL` va `LAB3D_SIFAT` birga berilsa, aniq yangi profil ustun
keladi va qarama-qarshilik stderr'da ogohlantiriladi.

`--json` jadval o'rniga JSON beradi:

```bash
npm run lab3d:olcham -- --json > /tmp/olcham-desktop.json
```

Dev server ishlamasa skript aniq xato va exit `1` beradi. Birinchi marta
Chromium kerak bo'lishi mumkin:

```bash
npx playwright install chromium
```

Playwright Chromium ochilmasa skript `@sparticuz/chromium` va
SwiftShader'ga o'tadi.

Production (`npm start`) da `/laboratoriya/3d/olcham` **404** qaytaradi.
O'lchagich kirish talab qilmaydi, shuning uchun jonli saytda ochilmaydi.

---

## Har ishga tushirishda 5 qator

3D sahna endi bitta qat'iy ko'rinishga ega. Mavzu o'lchami olib
tashlangan; o'lchov o'lchami — **profil**. Har buyruq bitta profilni
tekshiradi:

| Nuqta | Qayerda |
|---|---|
| `stol` | Stol oldida, jihozlarga qaragan boshlang'ich nigoh |
| `xona` | Xona markazida, gorizontal, orqa javonga qaragan |
| `ship` | Xona markazida, yuqoriga qaragan — sof ship kadri |
| `pol` | Markaziy stol to'smaydigan ochiq yo'lakda, pastga qaragan — sof pol kadri |
| `sweep` | Quyidagi 24 nuqtaning eng katta `kuygan` qiymati |

Nuqta koordinatalari va supurish generatori
`app/laboratoriya/3d/olcham/olcham-nuqtalar.js` da. Profil ta'riflari
`app/laboratoriya/3d/lib/sifat-profili.js` da — yagona manbalar.
Playwright ro'yxatni sahifadan oladi, koordinata yoki profil obyektini
ikkinchi marta yozmaydi.

Sahifa `?profil=telefon&nuqta=stol` ni o'qiydi. HUD va login o'lchov
kadriga chizilmaydi.

PNG lar `.olcham/<profil>-<nuqta>.png` ga, supurish rasmi
`.olcham/<profil>-sweep-worst.png` ga tushadi. `.olcham/` gitignore'da.

---

## Supurish qamrovi

Har ishda xona ichidagi **24 ta** joy tekshiriladi:

- kamera ko'z balandligida (`y = 1.6`);
- joy va gorizontal burilish tasodifiy;
- vertikal qiyalik `-30°…+10°`;
- generator `Math.random()` emas, qat'iy 32-bit LCG urug'i bilan ishlaydi.

Sukut urug'i kamera nuqtalari faylida qat'iy. Boshqa urug' uchun:

```bash
LAB3D_SEED=12345 npm run lab3d:olcham
```

`sweepEngYomon` — 24 namuna ichidagi eng katta `kuygan`; `sweepJoy` —
namuna raqami, koordinata va burchak. Bir xil urug' oldin/keyin aynan bir
joylarni solishtirishini ta'minlaydi.

---

## Kadr va sahna maydonlari

Har piksel uchun Rec.709:

```text
luma = 0.2126*R + 0.7152*G + 0.0722*B
```

| Maydon | Ma'nosi |
|---|---|
| `profil` | Faol `telefon`, `desktop` yoki `ilova` profili |
| `kuygan` | `luma > 0.98` piksel ulushi, foiz |
| `qora` | `luma < 0.02` piksel ulushi, foiz |
| `ortacha` | Butun kadr o'rtacha lumasi |
| `p50`, `p95` | Median va 95-protsentil luma |
| `yuqoriSoha` | Ekranning yuqori 15%; ship geometriyasi degani emas |
| `quyiSoha` | Ekranning quyi 35%; pol geometriyasi degani emas |
| `fps` | Oxirgi 120 tagacha brauzer kadrining o'rtachasi |
| `renderer` | `WEBGL_debug_renderer_info` bergan GL renderer satri |
| `chiroqSoni` | `scene.traverse` topgan barcha `THREE.Light` obyektlari |
| `chiroqBudjeti` | Faol profilning maqsad chegarasi |
| `chiroqBudjetiBuzildi` | `chiroqSoni > chiroqBudjeti` |
| `uchburchak` | `renderer.info.render.triangles` |
| `chaqiruv` | `renderer.info.render.calls` |
| `teksturaXotira` | `renderer.info.memory.textures` |

`chiroqBudjeti`ni o'lchagich majburlamaydi — u faqat sahnani o'qiydi.
Byudjet `lib/yoruglik.js`da qurilish paytida tekshiriladi; joriy sahna
telefon/desktop/ilovada `3/8/13` chiroq va `false` qaytaradi.

Birinchi o'lchov 60 kadr yoki sekin dasturiy GL uchun kamida 8 kadr va
2 soniya kutadi. Keyingi nomli kamera ikki kadr kutadi. Supurish sahna
yuklangach har joyni sinxron qayta chizadi.

---

## `shipPolFarq`

Haqiqiy farq ikki sof kadrdan olinadi:

```text
shipPolFarq = | ship-kadr.ortacha - pol-kadr.ortacha |
```

Qiymat `XULOSA`da chiqadi. Boshlang'ich BRIF-01 mezoni `< 0.5`.

---

## Har nuqta uchun chegaralar

| Nuqta | `ortacha` | `kuygan` | `p95` | `qora` |
|---|---:|---:|---:|---:|
| `stol` | 0.28–0.42 | < 1% | 0.65–0.85 | < 5% |
| `xona` | 0.28–0.42 | < 1% | 0.55–0.85 | < 5% |
| `pol` | 0.22–0.45 | < 1% | 0.50–0.85 | < 5% |
| `ship` | 0.03–0.25 | < 0.5% | qo'llanmaydi | qo'llanmaydi |
| `sweep` | qo'llanmaydi | < 2% | qo'llanmaydi | qo'llanmaydi |

`p95` — xiralikning yagona mezoni: eng yorqin 5% pikselning pastki
chegarasi. `kuygan`da pastki chegara yo'q; ACES filmic tone mappingning
vazifasi luma `>0.98` bo'lgan kesilgan pikselni oldini olish.

BRIF-01B o'lchagich mexanikasiga tegmaydi. Yangi chegaralar `--json`
chiqishidagi mavjud `ortacha`, `kuygan`, `p95` va `qora` sonlariga shu
jadval bo'yicha qo'llanadi.

### DIQQAT — bu jadval 1-QAVATNING maqsadi

2026-08-20, BRIF-01B ko'rigida aniqlandi. Chegaralar oxirgi holatni
tasvirlaydi, oraliq qatlamni emas.

BRIF-01B da `ortacha` maksimumdan yuqori (stol ~0.47), `p95` esa
minimumdan past (telefon stol 0.6372) chiqdi. Ikkalasi birga bitta
ma'noni beradi: **gistogramma siqilgan**. Bu "juda yorug'" emas,
**kontrast yetishmasligi**.

Kontrastni yorug'lik bermaydi — u **soyadan, AO dan va material
xilma-xilligidan** keladi. 3 ta chiroq bilan, soyasiz, bir xil
materialli xonada gistogramma har doim siqilgan bo'ladi.

Shuning uchun:

- **0-qavatda** (yorug'lik) faqat `kuygan < 1%`, `sweep < 2%` va
  `qora < 5%` majburiy. Ular kuyish qorovuli va ular bajarildi.
- **`ortacha` va `p95`** chegaralari BRIF-04 (soya qamrovi),
  0.6 (pishirilgan GI) va 1-qavat (PBR materiallar) dan keyin
  o'lchanadi.

Oraliq qatlamga oxirgi holat mezonini qo'yish agentni erishib
bo'lmaydigan maqsad ortidan yuguritadi. Bu 2026-08-20 da to'rt marta
takrorlangan naqshning bir ko'rinishi: "nima yaxshi ko'rinadi" degan
fikrni raqamga aylantirganda, raqam fikrning faqat bir qismini
ushlaydi.

Yoritilmagan ship qorong'i bo'lishi kerak; stol oralig'ini shipga
majburlash noto'g'ri kalibrovkaga olib keladi.

---

## Renderer va barqarorlik

SwiftShader, llvmpipe, softpipe yoki lavapipe aniqlansa jadval tagida:

> FPS raqamlari dasturiy renderdan — haqiqiy GPU emas.

ogohlantirishi chiqadi. Bunday FPS telefon bilan solishtirilmaydi;
`chiroqSoni`, `uchburchak` va `chaqiruv` esa sahna grafidan keladi.

Bir profilni ketma-ket ikki marta o'lchaganda har qatorning
`|Δortacha| < 0.02` bo'lishi kerak. Quvur o'zgarishida bundan tashqari
`kuygan`, `uchburchak` va `chaqiruv` oldingi natija bilan solishtiriladi.

```bash
npm run lab3d:olcham -- --json > /tmp/olcham-oldin.json
npm run lab3d:olcham -- --json > /tmp/olcham-keyin.json
```

Kompilyatsiya, HTTP 200 va toza konsol grafik dalil emas.
