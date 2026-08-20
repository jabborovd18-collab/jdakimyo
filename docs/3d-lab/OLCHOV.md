# 3D laboratoriya — o'lchov asbobi

Grafikani ko'z bilan emas, **son** bilan tekshirish. 19-avgustda oltita
kommit "dev server 200 qaytardi" deb qabul qilindi va sahna oqarib ketdi.
Bu asbob o'sha tuzoqni yopadi (AGENTS.md 11.1).

Sahna o'zgarmaydi. Asbob faqat kadrni o'qiydi.

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

`--json` — `console.table` o'rniga sof JSON (oldin/keyin taqqoslash uchun):

```bash
npm run lab3d:olcham -- --json > /tmp/olcham-oldin.json
```

PNG lar `.olcham/<mavzu>-<nuqta>.png` ga tushadi. Bu papka gitignore'da:
rasm odam ko'rigi uchun, repo uchun emas.

Production (`npm start`) da `/laboratoriya/3d/olcham` **404** qaytaradi.
O'lchagich kirish talab qilmaydi, shuning uchun jonli saytda ochilmaydi.

---

## 12 o'lchov

4 mavzu (`tun`, `siyoh`, `grafit`, `kunduz`) × 3 kamera nuqtasi:

| Nuqta | Qayerda |
|---|---|
| `stol` | Stol oldida, jihozlarga qaragan (`sozlama.js` dagi boshlang'ich nigoh) |
| `xona` | Xona markazida, gorizontal, orqa javonga qaragan |
| `ship` | Xona markazida, yuqoriga qaragan |

Nuqta koordinatalari `app/laboratoriya/3d/olcham/olcham-nuqtalar.js` da —
yagona manba. Qo'lda ikkinchi nusxa yozilmaydi.

Sahifa `?mavzu=tun&nuqta=stol` ni o'qiydi. Sahna `useSahna` orqali
yuklanadi (korinish.js dagi HUD va login yo'q: o'lchagich kadrga
interfeys chizmasligi kerak, aks holda luma yolg'on chiqadi).

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
| `p50` | Median luma — o'rtacha outlier dan kam ta'sirlanadi. |
| `p95` | Eng yorqin 5% ostidagi luma. Bloom ostonasi shundan **yuqori** bo'lishi kerak. |
| `shipLuma` | Kadrning yuqori 15% i. |
| `polLuma` | Kadrning quyi 35% i. |
| `fps` | Oxirgi 120 kadrning o'rtachasi. |
| `uchburchak` | `renderer.info.render.triangles` |
| `chaqiruv` | `renderer.info.render.calls` |
| `teksturaXotira` | `renderer.info.memory.textures` |

O'lchashdan oldin kamida 60 kadr kutiladi: birinchi kadrlar
yuklanmagan tekstura bilan chiqishi mumkin.

Ikki marta ketma-ket ishga tushirilganda `ortacha` farqi **0.02 dan
kam** bo'lishi shart. Katta bo'lsa — kutish yetarli emas.

---

## Chegaralar qayerdan

Asbobning o'zi "yaxshi/yomon" deb sahnani tuzatmaydi. `XULOSA` qatori
faqat BRIF-01 dagi maqsadni eslatadi:

| Ko'rsatkich | BRIF-01 talabi | Hozirgi holat |
|---|---|---|
| `kuygan` | < 1% | kalibrovka qilinmagan |
| `qora` | < 5% | kalibrovka qilinmagan |
| `ortacha` | 0.18 – 0.45 | kalibrovka qilinmagan |
| \|`shipLuma` − `polLuma`\| | < 0.5 | hozir ~0.95 (qora ship + oq pol) |

Manba: [BRIF-01](BRIF-01-yoruglik-byudjeti.md). Chegarani o'zgartirish
kerak bo'lsa avval o'sha brifni yangilang — skriptdagi sonlar shu
brifning ishchi nusxasi.

0-qavat tugadi deb hisoblanadi, qachonki 12 qatorning **hech biri**
chegaradan chiqmasa. Bu BRIF-00 ning ishi emas — BRIF-00 faqat o'lchagich.

---

## Dalil qanday ko'rsatiladi

Grafik o'zgarishdan **oldin** va **keyin** `npm run lab3d:olcham`
chiqishini saqlang. Bitta "keyin" jadvali dalil emas.

```bash
npm run lab3d:olcham -- --json > /tmp/olcham-oldin.json
# ... o'zgarish ...
npm run lab3d:olcham -- --json > /tmp/olcham-keyin.json
```

Kompilyatsiya, HTTP 200 va toza konsol grafik dalil emas.
