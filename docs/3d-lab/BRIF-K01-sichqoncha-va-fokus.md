# BRIF-K01 — Sichqoncha erkin aylanmaydi va fokus yo'qolganda ishlaydi

**Qavat:** mustaqil · **Navbat:** BRIF-01C dan keyin · **Xavf:** past
**Hudud:** `hooks/useYurish.js`, `korinish.js`, `olcham/`

---

## Kelib chiqishi

Egasi jonli saytda o'z ko'zi bilan topdi. Ikkalasi ham kamera
boshqaruviga tegishli, shuning uchun bitta brifda.

### Nuqson 1 — sichqoncha ma'lum burchakdan keyin to'xtaydi

Egasi: *"CS 1.6 kabi erkin sichqoncha ishlatish imkoni yo'q"*.

`useYurish.js` da ikki yo'l bor:

```js
513:  dx = (e.movementX || 0) * sens;     // pointer lock — cheksiz
522:  dx = (e.clientX - prevX) * sens;    // ZAXIRA — ekran chekkasida tugaydi
```

`yaw` da hech qanday cheklov yo'q (`528-qator`), demak matematik
to'siq emas. Xulosa: **pointer lock ishonchli ulanmayapti** va
boshqaruv jimgina zaxira yo'lga tushib qolyapti. `clientX` oyna
kengligi bilan chegaralangan — sichqoncha ekran chetiga yetganda
aylanish tugaydi.

Loyihada `28d5885` kommiti bor: *"CS 1.6 kabi 100% erkin sichqoncha
qarash rejimi"*. Ya'ni bu ilgari ishlagan yoki ishlashi mo'ljallangan.

### Nuqson 2 — boshqa oyna faol bo'lganda ham aylantiradi

Egasi: *"ekranda skrin olayotgandim, skrin tugagandan keyin obyekt
polga qarab qolgan"*.

`useYurish.js` da faqat `pointerlockchange` tinglanadi (`568-qator`).
**`blur` va `visibilitychange` hodisalari yo'q.**

Natijada sahifa fokusni yo'qotganda ham sichqoncha siljishlari
to'planadi va fokus qaytganda birdaniga qo'llaniladi.

---

## Vazifa

### 1. Pointer lock ishonchli bo'lsin

- Pointer lock so'ralganda **muvaffaqiyatli ulanganini tekshir**.
  Ulanmasa jimgina zaxira yo'lga o'tma — foydalanuvchiga ayt
  (masalan HUD da qisqa xabar: "Erkin qarash uchun ekranni bosing").
- Brauzer pointer lock'dan chiqarib yuborsa (Esc, fokus yo'qolishi),
  qayta ulanish **foydalanuvchi bosgandan keyin** bo'lsin. Chrome
  `exitPointerLock` dan keyin ~1 soniya davomida qayta ulanishni
  bloklaydi — buni hisobga ol.
- Zaxira `clientX` yo'li **qolsin**, lekin faqat pointer lock
  qo'llab-quvvatlanmaydigan muhit uchun, va u faol ekani
  ko'rinadigan bo'lsin.

### 2. Fokus yo'qolganda boshqaruv to'xtasin

`window` ga `blur` va `document` ga `visibilitychange` qo'sh:

- Fokus yo'qolsa: pointer lock'dan chiq, to'plangan siljishlarni
  **tashlab yubor** (qo'llama), yurish tugmalarini bo'shat.
- Fokus qaytsa: kamera **o'zgarmagan** holatda qolsin, foydalanuvchi
  o'zi qayta bossin.

Bu ikkinchi qism muhim: to'plangan siljishni "keyin qo'llash" —
aynan egasi ko'rgan nuqson.

### 3. Yorliqlar sukut qiymati (kichik)

Egasi: *"boshlayotganga yoqishi mumkin, lekin ikkinchi
boshlayotganga yoqmaydi"*.

BRIF-G6 da tugma qo'shildi va tanlov `lab-3d-yorliqlar` da saqlanadi
— bu to'g'ri ishlayapti. Lekin birinchi tashrifda hamma yorliq
ko'rinadi va bu chalkash.

Yechim: **birinchi tashrifda yoqiq, lekin faqat YAQINDAGI yorliqlar.**
Uzoq masofadagilar ko'rsatilmasin. Hozirgi masofa chegarasini
qisqartir — jonli skrinshotda uzoq stoldagi `Probirka` va `25°C`
yorliqlari ko'rinib turibdi va ular kerak emas.

Aniq son o'zing tanla va **sababini yoz**. Mezon: `yorliqSoni`
kamayishi kerak, `yorliqToqnashuvi` esa `0` bo'lib qolsin.

---

## O'lchash — sen ko'rmaysan, shuning uchun SANA

`window.__olcham()` ga qo'sh:

| Maydon | Ma'nosi |
|---|---|
| `qarashRejimi` | `"pointerlock"` yoki `"zaxira"` |
| `yawJami` | Sinov paytida to'plangan yaw (radian) |

Va sinov funksiyasi yoz (o'lchagich sahifasida, jonli sahifada emas):

- `window.__qarashSinovi(px)` — `px` piksel gorizontal siljishni
  simulyatsiya qiladi va natijadagi `yaw` o'zgarishini qaytaradi.

---

## Qabul mezonlari

1. **`qarashRejimi === "pointerlock"`** yurish rejimi yoqilganda.
2. **Erkin aylanish:** `__qarashSinovi(20000)` chaqirilganda `yaw`
   kamida **6 marta to'liq aylanish** (12π radian) o'zgarsin.
   Hozirgi zaxira yo'lda bu imkonsiz.
3. **Fokus sinovi:** `blur` hodisasi yuborilgandan keyin sichqoncha
   hodisalari `yaw` ni **o'zgartirmasin**. Oldin/keyin qiymatni
   ko'rsat.
4. `visibilitychange` (hidden) da ham xuddi shunday.
5. **`yorliqSoni` kamaydi**, `yorliqToqnashuvi` hamon `0`.
6. `fps` yomonlashmasin — `npm run lab3d:olcham` bilan solishtir.
7. `npm run build` → `exit 0`, production'da `/olcham` → `404`.

---

## Tegilmaydi

- Yorug'lik, material, geometriya — **BRIF-01C hali ochiq**, unga
  tegma, u alohida ish.
- Yurish tezligi, kolliziya, joystik mantiqi — faqat **qarash**
  boshqaruvi.
- Yorliqlarning matni va tugmasi — faqat masofa chegarasi.
- 2D modal panellar — 2.5 qatlam.

---

## Dalil

1. `qarashRejimi` qiymati yurish rejimida.
2. `__qarashSinovi(20000)` natijasi — `yaw` o'zgarishi radianda.
3. `blur` dan oldin va keyin `yaw` qiymatlari.
4. `yorliqSoni` oldin/keyin, `yorliqToqnashuvi`.
5. `fps` taqqoslashi.
6. Tanlangan masofa chegarasi va sababi.
