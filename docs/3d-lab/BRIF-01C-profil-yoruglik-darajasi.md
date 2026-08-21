# BRIF-01C — Telefon xira: byudjet sonni chekladi, darajani ham tushirdi

**Qavat:** 0 · **Navbat: keyingi** · **Xavf:** past (bir necha son)
**Oldingi ish:** BRIF-01B (`aa54710`) — desktopda yaxshilandi, telefonda yetarli emas

---

## Muammo

Egasi jonli saytda ko'rdi: desktop yaxshi, **telefon hamon juda xira**.

## Sabab — arxitekturaviy, sozlash emas

`yoruglik.js` da chiroq **kuchlari hamma profil uchun bir xil**
(`ASOSIY_YORUGLIK` konstantasidan). Profil faqat **qaysi chiroqlar
mavjudligini** hal qiladi:

```js
if (profil.nom !== "telefon") { toldiruvchi ... }   // fill yo'q
panelNurlari = telefon ? [] : [...]                 // panel nurlari yo'q
if (profil.nom !== "telefon") { derazaNuri 1.4 }    // deraza nuri yo'q
```

Natijada umumiy yorug'lik (taxminiy yig'indi, yo'nalish va susayishsiz):

| Profil | Manbalar | Jami |
|---|---|---:|
| `telefon` | ambient 0.3 + asosiy 1.4 | **1.7** |
| `desktop` | 0.3 + 1.4 + fill 0.4 + deraza 1.4 + 3×panel 1.4 | **7.7** |
| `ilova` | yuqoridagi + yana 5×panel 1.4 | ~14.7 |

**Desktop telefondan ~4.5 barobar ko'p yorug'lik oladi**, ekspozitsiya
esa ikkalasida bir xil (0.95).

BRIF-01B da ambient 0.9 → 0.3 ga tushirildi. Desktopda bu to'g'ri
qaror edi — u yerda fill, deraza va panel nurlari kompensatsiya
qiladi. Telefonda esa **ambientning o'zi kompensatsiya edi**, va uni
tushirish telefonni eng ko'p urdi. O'lchov buni ko'rsatgan ham:
yiqilgan yagona qator `telefon stol p95 = 0.6372` edi.

## Xato mening brifimda

BRIF-01 da "telefon 3 chiroq, desktop 8" deb yozganman. Arena buni
harfma-harf bajardi: chiroqlarni olib tashladi, qolganlarini
kuchaytirmadi.

**Byudjetning ma'nosi — chiroq SONI, chiroq DARAJASI emas.** Kamroq
chiroq **kuchliroq** bo'lishi kerak, aks holda "arzon" degani
"qorong'i" degani bo'lib qoladi. Byudjetning butun maqsadi —
*bir xil ko'rinish, arzonroq narx*.

---

## Vazifa

### 1. Chiroq kuchlari profilga bog'lansin

`ASOSIY_YORUGLIK` hozir bitta global konstanta. U profil bo'yicha
bo'linsin — har profil o'z qiymatlarini olsin.

`telefon` uchun boshlang'ich yo'nalish (o'lchov aniqlashtiradi):

- `muhit` (ambient): 0.3 → **~0.7–0.9**. Telefonda ambient yagona
  to'ldiruvchi manba, u desktopdagi fill + deraza + panel o'rnini
  bosishi kerak.
- `asosiy` (directional): 1.4 → **~1.8–2.2**.

`desktop` va `ilova` **o'zgarmasin** — ular hozir to'g'ri.

Diqqat: ambientni ko'tarish kontrastni pasaytiradi (BRIF-01B da
aynan shu sababdan tushirilgandi). Shuning uchun ambient bilan
`asosiy` orasidagi nisbatni o'lchov bilan top: ambient qancha
kam bo'lsa shuncha yaxshi, lekin telefon desktopdan qorong'i
bo'lmasligi shart.

### 2. Kerak bo'lsa profil bo'yicha ekspozitsiya

Agar chiroq kuchlari bilan yetib bo'lmasa, `TONE_MAPPING_EKSPOZITSIYA`
ni ham profilga bog'lash mumkin. Lekin **avval chiroq kuchini sina** —
ekspozitsiya butun kadrni bir xil ko'taradi va kontrastni yaxshilamaydi.

Qaysi yo'lni tanlaganingni va sababini yoz.

---

## Qabul mezoni — NISBIY, mutlaq emas

Bu brifning asosiy mezoni bitta va u avvalgilardan farq qiladi:

> **`telefon` ning `ortacha` va `p95` qiymatlari `desktop` nikidan
> ±0.05 dan ko'p farq qilmasin** — har uch nuqtada (`stol`, `xona`,
> `pol`).

Nega nisbiy: "bir xil ko'rinish, arzonroq narx" degan maqsadni
to'g'ridan-to'g'ri ifodalaydi. Mutlaq chegaralar (`ortacha ≤ 0.42`)
kontrast yetishmasligi sababli hozircha erishib bo'lmaydi va ular
1-qavat maqsadi ekani `OLCHOV.md` da yozilgan.

### Saqlanadigan qorovullar

- `kuygan < 1%` — uch profilda ham
- `sweep < 2%` — uch profilda ham
- `qora < 5%` — **ayniqsa telefonda**: ambient ko'tarilsa bu
  yaxshilanadi, lekin tekshir
- `chiroqBudjetiBuzildi = false` — **chiroq SONI o'zgarmaydi**
  (telefon 3, desktop 8, ilova 13)

---

## Tegilmaydi

- Chiroq **soni** va byudjet raqamlari.
- Material, geometriya, soya sozlamalari, SSAO, bloom.
- Yurish rejimi.
- `desktop` va `ilova` profillarining qiymatlari.

---

## Dalil

1. `npm run lab3d:olcham` uch profilda — oldingi va keyingi.
2. `telefon` va `desktop` qatorlarini **yonma-yon** jadval: `ortacha`,
   `p95`, farq. Har uch nuqta uchun.
3. Tanlangan qiymatlar va ularga qanday kelinganini qisqa izoh.
4. `qora` telefonda oldin va keyin.
