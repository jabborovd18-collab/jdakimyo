# 3D laboratoriya — o'lchov asbobi

Grafikani ko'z bilan emas, **son** bilan tekshirish. 19-avgustda oltita
kommit "dev server 200 qaytardi" deb qabul qilindi va sahna oqarib ketdi.
Bu asbob o'sha tuzoqni yopadi (AGENTS.md 11.1).

Sahna o'zgarmaydi. Asbob faqat kadr va sahna grafini o'qiydi.

---

## Ishga tushirish

Boshqa terminalda dev server ishlab tursin:

```bash
npm run dev
```

Keyin:

```bash
npm run lab3d:olcham
```

Birinchi marta Chromium kerak (ikkala yo'ldan biri):

```bash
npx playwright install chromium
```

Agar `cdn.playwright.dev` yopiq bo'lsa, skript `devDependencies` dagi
`@sparticuz/chromium` ga o'tadi (SwiftShader, WebGL ishlaydi).

Dev server ishlamasa skript **jim qolmaydi** — `XATO: dev server ...
ishlamayapti` deb chiqadi va 1 bilan tugaydi.

`--json` — `console.table` o'rniga JSON (oldin/keyin taqqoslash uchun):

```bash
npm run lab3d:olcham -- --json > /tmp/olcham-oldin.json
```

PNG lar `.olcham/<mavzu>-<nuqta>.png` ga tushadi. Supurish rasmi
`.olcham/<mavzu>-sweep-worst.png`; u faqat eng katta kuygan ulush topilgan
joyni ko'rsatadi. Papka gitignore'da: rasm odam ko'rigi uchun, repo uchun
emas.

Production (`npm start`) da `/laboratoriya/3d/olcham` **404** qaytaradi.
O'lchagich kirish talab qilmaydi, shuning uchun jonli saytda ochilmaydi.

---

## 20 o'lchov

4 mavzu (`tun`, `siyoh`, `grafit`, `kunduz`) × 4 nomli kamera nuqtasi,
ustiga har mavzu uchun bittadan supurish xulosasi:

| Nuqta | Qayerda |
|---|---|
| `stol` | Stol oldida, jihozlarga qaragan (`sozlama.js` dagi boshlang'ich nigoh) |
| `xona` | Xona markazida, gorizontal, orqa javonga qaragan |
| `ship` | Xona markazida, yuqoriga qaragan — sof ship kadri |
| `pol` | Markaziy stol to'smaydigan ochiq yo'lakda, pastga qaragan — sof pol kadri |
| `sweep` | Quyidagi 24 nuqtaning eng katta `kuygan` qiymati |

Nuqta koordinatalari, nuqta nomlari va supurish generatori
`app/laboratoriya/3d/olcham/olcham-nuqtalar.js` da; mavzu kalitlari esa
`app/laboratoriya/3d/lib/fonlar.js` da — mavjud yagona manbalar.
Playwright ularni ikkinchi marta yozmaydi, sahifadan o'qiydi.

Sahifa `?mavzu=tun&nuqta=stol&sifat=toliq` ni o'qiydi. Sahna `useSahna`
orqali yuklanadi (`korinish.js` dagi HUD va login yo'q: interfeys luma
hisobiga aralashmasligi kerak).

### Supurish qamrovi

Har mavzuda xona ichidagi **24 ta** joy tekshiriladi:

- kamera ko'z balandligida (`y = 1.6`);
- joy va gorizontal burilish tasodifiy;
- vertikal qiyalik `-30°…+10°`;
- generator oddiy `Math.random()` emas, qat'iy 32-bit urug' bilan ishlaydi.

Sukut urug'i `olcham-nuqtalar.js` da qat'iy. Boshqa urug'ni tekshirish:

```bash
LAB3D_SEED=12345 npm run lab3d:olcham
```

`sweepEngYomon` — 24 namuna ichidagi eng katta `kuygan`; `sweepJoy` —
namuna raqami, `x/y/z`, gorizontal (`yaw`) va vertikal (`pitch`) burchak.
Qat'iy urug' sabab oldin/keyin o'lchov aynan bir joylarga qaraydi.

---

## Sonlar nimani anglatadi

Kadr har pikseli uchun Rec.709:

```
luma = 0.2126*R + 0.7152*G + 0.0722*B     // 0..1
```

| Maydon | Ma'nosi |
|---|---|
| `kuygan` | `luma > 0.98` piksellar ulushi, **foiz**. Pol "oq kuygan" shu yerda ko'rinadi. |
| `qora` | `luma < 0.02` piksellar ulushi, **foiz**. Qop-qora ship shu yerda. |
| `ortacha` | Butun kadrning o'rtacha lumasi. |
| `p50` | Median luma — o'rtacha outlier'dan kam ta'sirlanadi. |
| `p95` | Eng yorqin 5% ostidagi luma. Bloom ostonasi shundan **yuqori** bo'lishi kerak. |
| `yuqoriSoha` | Kadrning yuqori 15% qatori. Bu ship geometriyasi degani emas. |
| `quyiSoha` | Kadrning quyi 35% qatori. Bu pol geometriyasi degani emas. |
| `fps` | Oxirgi 120 tagacha brauzer kadrining o'rtachasi. |
| `renderer` | `WEBGL_debug_renderer_info` bergan haqiqiy GL renderer satri (kengaytma bo'lmasa oddiy `GL_RENDERER`). |
| `chiroqSoni` | `scene.traverse` topgan barcha `THREE.Light` merosxo'rlari. |
| `uchburchak` | `renderer.info.render.triangles`. |
| `chaqiruv` | `renderer.info.render.calls`. |
| `teksturaXotira` | `renderer.info.memory.textures`. |

Birinchi o'lchovda 60 kadr yoki sekin dasturiy GL uchun kamida 8 kadr
va 2 soniya kutiladi. Keyingi nomli kamera ikki kadr kutadi. Supurish
har joyni sinxron qayta chizadi: sahna allaqachon yuklangan, kamera
matritsasi darhol yangilanadi. Shu yo'l 96 ta qamrov kadrini kutish
sikliga aylantirmaydi.

Ikki marta ketma-ket ishga tushirilganda har nomli qator va supurishning
`ortacha` farqi **0.02 dan kam** bo'lishi shart.

### `shipPolFarq`

Ekranning yuqori/quyi qatorlari ship va pol emas. Haqiqiy farq ikki sof
kadrdan olinadi:

```
shipPolFarq = | ship-kadr.ortacha - pol-kadr.ortacha |
```

Har mavzu qiymati `XULOSA` qatorida chiqadi. BRIF-01 boshlanishidagi
mezon `< 0.5`; kalibrovkadan oldingi katta son asbob nuqsoni emas, sahna
nuqsonini ko'rsatadi.

---

## Har nuqta uchun chegaralar

Bitta `ortacha` oralig'i hamma kameraga qo'llanmaydi. Yoritilmagan ship
qorong'i bo'lishi kerak; uni stol oralig'iga majburlash BRIF-01 ni shipni
sun'iy yoritishga undaydi.

| Nuqta | `ortacha` | `kuygan` | `qora` |
|---|---:|---:|---:|
| `stol` | 0.18–0.45 | < 1% | < 5% |
| `xona` | 0.18–0.45 | < 1% | < 5% |
| `pol` | 0.15–0.50 | < 1% | < 5% |
| `ship` | 0.03–0.25 | < 0.5% | qo'llanmaydi |
| `sweep` (eng yomon) | qo'llanmaydi | < 2% | qo'llanmaydi |

Bular BRIF-01 uchun boshlang'ich oraliqlar. Asbob sahnani chegaraga
moslash uchun o'zgartirmaydi; faqat qaysi qator chiqqanini yozadi.

---

## Renderer va FPS ogohlantirishi

`SwiftShader`, `llvmpipe`, `softpipe` yoki boshqa dasturiy renderer
aniqlansa, jadval tagida:

> FPS raqamlari dasturiy renderdan — haqiqiy GPU emas.

ogohlantirishi chiqadi. Bunday FPS telefon yoki videokarta unumdorligi
bilan solishtirilmaydi. `chiroqSoni`, `uchburchak` va `chaqiruv` esa
sahna grafidan keladi va dasturiy GL'da ham taqqoslashga yaroqli.

---

## To'liq va arzon sifat

Sukut — desktop sahnasi (`toliq`). Telefon ko'radigan yo'lni o'lchash:

```bash
LAB3D_SIFAT=arzon npm run lab3d:olcham
```

Faqat `toliq` va `arzon` qabul qilinadi. Har qatordagi `sifat` qaysi yo'l
o'lchanganini ko'rsatadi. `arzon` o'lchovda antialias, soya va bloom
jonli mobil yo'ldagidek o'chadi.

Hozir `xonaInteryeriniYasa(materiallar)` sifatni olmaydi. Shu sabab
`toliq` va `arzon`da `chiroqSoni` bir xil chiqishi kutiladi — bu BRIF-01
o'lchaydigan mavjud nuqson; BRIF-00B uni tuzatmaydi.

---

## Dalil qanday ko'rsatiladi

Grafik o'zgarishdan **oldin** va **keyin** chiqishni saqlang. Bitta
"keyin" jadvali dalil emas:

```bash
npm run lab3d:olcham -- --json > /tmp/olcham-oldin.json
# ... o'zgarish ...
npm run lab3d:olcham -- --json > /tmp/olcham-keyin.json
```

Barqarorlik uchun keyingi ishga tushirish ham saqlanadi. BRIF-00B dalili
`toliq` rejimdagi ketma-ket ikki natija va `arzon` rejimdagi bitta natija.
Kompilyatsiya, HTTP 200 va toza konsol grafik dalil emas.
