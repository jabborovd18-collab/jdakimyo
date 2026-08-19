# BRIF-05 — Monolit fayllarni bo'lish

**Qavat:** 0 · **Xavf:** o'rta (xatti-harakat o'zgarmasligi shart)
**Muhim:** bu ish paytida boshqa agent 3D fayllarga tegmasin

---

## Muammo

| Fayl | Qator |
|---|---|
| `lib/xona-modellari.js` | 1523 |
| `korinish.js` | 1260 |
| `lib/jihoz-modellari.js` | 1158 |
| `hooks/useYurish.js` | 958 |

Bu to'rt fayl 3D bo'limining 15 422 qatoridan 32% ini tashkil qiladi.
Oqibati: **ikki agent bir vaqtda ishlay olmaydi.** Har safar bitta fayl
ustida konflikt chiqadi va ikkinchi agentning ishi qayta yoziladi.

Loyihada bir nechta agentni parallel ishlatish maqsad qilingan ekan, bu
poydevor darajasidagi to'siq — yorug'lik yoki tekstura kabi ko'rinadigan
nuqson emas, lekin har keyingi ishni sekinlashtiradi.

---

## Vazifa

**Bu tozalash ishi. Bitta ham piksel o'zgarmasligi kerak.**

Taklif qilinadigan bo'linish (mazmun bo'yicha, mexanik emas):

```
lib/xona/
  pol-shift-devor.js    xonaning qobig'i
  deraza.js             deraza va ram
  mebel.js              stol, javon, tokcha
  santexnika.js         rakovina, dush, ko'z yuvish
  stendlar.js           titrlash, elektroliz, tarozi stendi
  panellar.js           davriy jadval, EXIT, iqlim stansiyasi
  index.js              xonaInteryeriniYasa() — faqat yig'adi
```

`jihoz-modellari.js` uchun ham shunga o'xshash bo'linish (shisha idishlar /
o'lchov asboblari / issiqlik jihozlari).

Qoidalar:
- Har fayl **600 qatordan** oshmasin (AGENTS.md 11.7).
- Umumiy yordamchilar takrorlanmasin — ular alohida `yordamchi.js` ga.
- Tashqi API (`xonaInteryeriniYasa`, `jihozYasa`) **o'zgarmaydi** —
  chaqiruvchi kod tegilmaydi.
- Bir kommitda bitta fayl bo'linadi. 7 ta fayl = 7 ta kommit. Bu
  konfliktni ham, orqaga qaytarishni ham osonlashtiradi.

---

## Qabul mezonlari

- Bo'lishdan oldingi va keyingi skrinshotlar **piksel darajasida bir xil**
  (bir xil kamera, bir xil mavzu).
- Hech bir 3D fayl 600 qatordan oshmaydi.
- `xonaInteryeriniYasa` va `jihozYasa` imzosi o'zgarmagan.
- `renderer.info` (uchburchak, chaqiruv soni) o'zgarmagan.

## Tegilmaydi

Xatti-harakat, geometriya, material, yorug'lik — **hech narsa**.
Faqat kodning joyi o'zgaradi. Yo'l-yo'lakay nuqson ko'rsangiz, tuzatmang —
`YOL-XARITASI.md` ga yozib qo'ying (AGENTS.md 10-band).

## Dalil

Oldin/keyin skrinshot juftligi + `renderer.info` sonlari + fayl uzunliklari.
