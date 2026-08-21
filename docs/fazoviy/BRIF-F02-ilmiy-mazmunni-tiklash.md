# BRIF-F02 — Yo'qolgan ilmiy mazmunni tiklash

**Agent:** Gemini · **Navbat: SHOSHILINCH** · **Xavf:** past
**Sabab:** BRIF-F01 (`3c38e39`) merge qilingan, lekin mazmun yo'qolgan

---

## Nima bo'ldi

BRIF-F01 pilot texnik jihatdan a'lo bajarildi: 4 225 → 2 658 qator,
build toza, marshrutlar 200, `dispose` puxta.

**Lekin egasi ko'zi bilan tekshirib mazmun yo'qolganini topdi.**

Eski `oktaedrik/3d/page.js` PDF hisobotida:

```js
[`IR (M–${complex.ligand.donor} tebranish)`, "400–600 cm⁻¹"],
["Simmetrik cho'zilish (a₁g)", "≈ 500 cm⁻¹"],
```

va "Bashorat qilingan Spektroskopik Ma'lumotlar",
"IR Spektr (simulyatsiya, 250–700 cm⁻¹ oralig'i)" bo'limlari bor edi.

Yangi `lib/fazoviy/pdf-hisobot.js` da **`cm⁻¹` bitta ham yo'q**.

O'lchov:

| | `cm⁻¹` soni |
|---|---:|
| Eski `oktaedrik/3d/page.js` | **18** |
| Yangi `lib/fazoviy/` (hammasi) | **1** |

## Ayb kimda — mening mezonimda

3-qabul mezonim shunday edi:

> "PDF eksporti ishlaydi. `oktaedrik` da PDF yasab ko'r, ochilsin va
> ichida matn bo'lsin. Bayt hajmini yoz."

Men PDF **ishlashini** so'radim, **to'liqligini** emas. Sen mezonni
to'g'ri bajarding — PDF ochiladi va matn bor. Mezon noto'g'ri edi.

Bu ta'lim platformasi: ilmiy mazmun mahsulotning o'zi. Qator soni
tejash undan muhimroq emas.

---

## Vazifa

### 1. Yo'qolgan mazmunni tikla

`git show 892dfe5:app/oquv/fazoviy/oktaedrik/3d/page.js` — bu
o'zgarishdan oldingi holat. Undagi PDF hisobotining **hamma bo'limini**
`lib/fazoviy/pdf-hisobot.js` ga qaytar.

Kamida quyidagilar bo'lishi shart (eski fayldan aniq ro'yxatni o'zing
chiqar):

- Bashorat qilingan spektroskopik ma'lumotlar
- IR tebranish chastotalari (`cm⁻¹`)
- Kristall maydon ajralishi (Δ) qiymatlari va izohi
- JDA-KIMYO ilmiy byulleteni sarlavhasi va tuzilishi

### 2. Boshqa yo'qolgan narsa bormi — TEKSHIR

PDF dan tashqari yana nima tushib qolgan bo'lishi mumkin. Usul:

```
git show 892dfe5:app/oquv/fazoviy/oktaedrik/3d/page.js > /tmp/eski.js
```

Eski fayldagi **barcha matn satrlarini** ajratib ol (uzunligi 20
belgidan katta bo'lganlar), yangi holatdagi (`page.js` +
`lib/fazoviy/*`) matnlar bilan solishtir. Yo'qolganlarni ro'yxat qil.

Ba'zilari o'rinli yo'qolgan bo'lishi mumkin (takroriy izoh, o'lik kod).
Har birini **ayt** — qaysi biri tiklandi, qaysi biri ataylab qoldirildi
va nega.

### 3. `tetraedrik` ga ham tegishlisini ber

Tiklangan bo'limlar `tetraedrik` da ham ishlasin — lekin **uning
kimyosiga mos**. Tetraedrik komplekslarning IR va Δ qiymatlari
oktaedrikникidan farq qiladi.

Agar ma'lumot yo'q bo'lsa — **to'qib chiqarma**. Bo'limni ko'rsatma
va sababini yoz.

---

## KELAJAK UCHUN OGOHLANTIRISH — qolgan 15 sahifa

`FazoviyKoruvchi.jsx:741` da d-orbital paneli shunday:

```js
{geometryInfo.ks === 6 ? (oktaedrik ajralishi) : (tetraedrik ajralishi)}
```

Bu **ikkilik shart**. Hozir ikkita sahifa uchun to'g'ri, lekin qolgan
15 tasi ko'chirilganda **ilmiy jihatdan xato** bo'ladi:

| Geometriya | Haqiqiy ajralish | Hozirgi kod nima berardi |
|---|---|---|
| Tekis kvadrat (KS 4) | dx²-y² ≫ dxy > dz² ≈ dxz,dyz | tetraedrik (xato) |
| Kvadrat piramida (KS 5) | o'ziga xos | tetraedrik (xato) |
| Trigonal prizma (KS 6) | oktaedrikdan farqli | oktaedrik (xato) |

**Bu brifda tuzatma** — faqat bilib qo'y. Keyingi brifda (qolgan 15
sahifa) ajralish naqshi **har geometriya uchun o'z ma'lumotidan**
kelishi kerak, `ks` soniga qarab emas.

---

## Qabul mezonlari — bu safar MAZMUN o'lchanadi

1. **`cm⁻¹` soni tiklangan:** yangi holatda (`page.js` + `lib/fazoviy/`)
   kamida eski `oktaedrik` dagi **18** ga teng.
2. **Matn yo'qolishi ro'yxati:** eski va yangi holatdagi 20 belgidan
   uzun matn satrlarining farqi. Har bir yo'qolgan satr uchun sabab.
3. **PDF bo'lim sarlavhalari** eski va yangi versiyada bir xil.
   PDF ni yasab, ichidagi sarlavhalarni sanab ko'rsat.
4. **PDF sahifa soni** oldin va keyin.
5. `npm run build` → `exit 0`.
6. Ikkala marshrut 200.
7. Qator soni **oshishi kutiladi va bu normal** — mazmun qaytadi.
   Lekin takrorlanish qaytmasin: tiklangan mazmun `lib/fazoviy/` da
   bir marta tursin, ikki sahifada emas.

---

## Tegilmaydi

- `app/laboratoriya/3d/` — arena hududi
- Qolgan 15 fazoviy sahifa — keyingi brifda
- `app/api/`, Prisma, autentifikatsiya
- Kimyo ma'lumotlarini **o'zgartirish yoki to'qish** — faqat tiklash

---

## Ish tartibi

Xuddi avvalgidek: `main` dan yangi shox, push, **TO'XTA**, merge qilma.

```
git checkout main && git pull
git checkout -b gemini/fazoviy-mazmun
```
