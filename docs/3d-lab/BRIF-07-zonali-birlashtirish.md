# BRIF-07 — Zonali birlashtirish va LOD

**Qavat:** 0 (poydevor) · **Navbat:** `0.1C` dan keyin BIRINCHI
**Xavf:** o'rta (geometriya tuzilishi o'zgaradi, ko'rinish emas)

---

## Nega bu ish poydevorda va nega hozir

Telefon endi qotmaydi va xira emas (`0.1C` ✅). Lekin sahna hamon
**~200 ta alohida mesh** dan iborat va har biri o'z draw call'ini
talab qiladi.

Mesh yaratish nuqtalari:

| Fayl | `new THREE.Mesh(` soni |
|---|---:|
| `xona-modellari.js` | 92 |
| `jihoz-modellari.js` | 66 |
| `javon-3d.js` | 9 |
| `effektlar.js` | 1 |

Ko'pi sikl ichida, ya'ni haqiqiy son bundan yuqori.

Bu ish **asset talab qilmaydi** (`0.2` dan mustaqil) va telefonga
eng katta foyda beradi — shuning uchun tartibda birinchi.

---

## Nima qilinadi

### 1. Harakatsiz geometriyani zona bo'yicha birlashtir

Xona **100% harakatsiz**: devor, pol, ship, deraza, javon karkasi,
shift panellari, eshik. Ular hech qachon qimirlamaydi.

`BufferGeometryUtils.mergeGeometries` bilan **material bo'yicha**
birlashtiriladi.

**Bitta ulkan mesh QILMA.** Fazoviy bo'lakларga bo'l — masalan
chap devor + derazalar, orqa devor + davriy jadval, ship + panellar,
pol. Sabab: bitta mesh bo'lsa frustum culling yo'qoladi va kamera
qayerga qarasa ham butun xona chiziladi.

`lib/xona-zonalari.js` da 9 ta nomli zona bor — ular kamera
nuqtalari, geometriya bo'linishi emas. Ularni **yo'riqnoma sifatida**
ishlat, majburiy emas.

### 2. Takrorlanadigan ob'ektlarga `InstancedMesh`

Aniq nomzodlar:
- 8 ta shift paneli (`trofferYlar`)
- Javon tokchalari va shishalar
- Stol oyoqlari
- Pol plitkalari (agar alohida mesh bo'lsa)

### 3. LOD — uzoqdagi mayda ob'ektlar

Uzoqdagi shishalar, yorliq karkaslari va mayda detallar soddaroq
geometriyaga o'tsin (`THREE.LOD`). Chegara masofasini o'zing tanla va
**sababini yoz**.

---

## IKKI XAVF — ikkalasi ham tekshirildi va yozib qo'yildi

### Xavf 1 — interaktivlik (raycast)

`useYurish.js:859` da:

```js
centerRaycasterRef.current.intersectObjects(sahna.children, true)
```

Nishon **butun sahna bo'ylab** qidiradi. Birlashtirilgan mesh
individual ob'ektni qaytara olmaydi.

**Shuning uchun: FAQAT INTERAKTIV BO'LMAGAN geometriya
birlashtiriladi.** Tekshirdim — `xona-modellari.js` da interaktiv
belgi (`userData`) yo'q, ya'ni devor va pol baribir tanlanmaydi.

**TEGMA:** idishlar, jihozlar, stansiyalar, javondagi shishalar,
tarozi, spirtovka, titrlash va elektroliz stendlari — ularning har
biri alohida qolishi shart.

### Xavf 2 — kolliziya (tekshirildi, xavfsiz)

`useYurish.js:9` — *"Qat'iy AABB to'siq kolliziyasi"*. Kolliziya
**konstantalarga** tayanadi, mesh tuzilishiga emas. Birlashtirish uni
buzmaydi.

Shunga qaramay sinab ko'r: birlashtirilgandan keyin devordan o'tib
ketib bo'lmasin.

---

## Qabul mezonlari

O'lchagich `chaqiruv` va `uchburchak` ni allaqachon beradi
(`olcham-mijoz.js:256-257`).

1. **`chaqiruv` (draw call) sezilarli kamaysin.** Nishon: hozirgi
   qiymatning **yarmidan kam**. Aniq sonni oldin/keyin ko'rsat.
2. **`uchburchak` deyarli o'zgarmasin (±5%).** Biz geometriyani
   birlashtirayapmiz, o'chirmayapmiz. Katta kamayish — geometriya
   yo'qolgani, bu nuqson.
3. **Ko'rinish o'zgarmasin.** Uch profil × barcha nuqtada:
   `kuygan`, `ortacha`, `p95`, `shipPolFarq` — `0.1C` dagi
   qiymatlardan **±0.02** dan ko'p farq qilmasin.
4. **Interaktivlik saqlansin.** `window.__interaktivSinovi()`
   qo'sh — u nishon bilan tanlanadigan ob'ektlarni sanaydi.
   Son **kamaymasin**. Oldin/keyin ko'rsat.
5. **Kolliziya ishlasin** — devordan va stoldan o'tib bo'lmasin.
   Qanday tekshirganingni ayt.
6. `yorliqToqnashuvi = 0` — saqlanadi.
7. `chiroqBudjetiBuzildi = false` — saqlanadi.
8. **`dispose` ishlasin.** Birlashtirilgan geometriya ham sahnadan
   chiqarilganda bo'shatilsin.
9. `npm run build` → `exit 0`, production'da `/olcham` → `404`.

**FPS haqida:** headless dasturiy GL raqami haqiqiy qurilmani
ko'rsatmaydi (`OLCHOV.md`). `chaqiruv` va `uchburchak` — ko'rsatadi.
Xulosani ularga qur.

---

## Tegilmaydi

- Yorug'lik qiymatlari va chiroq soni — `0.1C` da hal qilindi
- Material, rang, tekstura
- Xona o'lchami va joylashuvi — `0.4`
- Asset (`.glb`, HDRI) — `0.2`
- Yurish, kolliziya konstantalari, joystik
- Interaktiv ob'ektlarning tuzilishi

Yo'l-yo'lakay nuqson ko'rsang — tuzatma, `YOL-XARITASI.md` ga yoz
(10-band).

---

## Dalil

1. `chaqiruv` oldin/keyin — uch profil.
2. `uchburchak` oldin/keyin (±5% ichida ekanini ko'rsat).
3. `kuygan`, `ortacha`, `p95`, `shipPolFarq` oldin/keyin.
4. `__interaktivSinovi()` oldin/keyin.
5. Kolliziyani qanday tekshirganing.
6. Qaysi ob'ektlar birlashtirildi, qaysilari ataylab qoldirildi.
7. LOD chegarasi va sababi.
