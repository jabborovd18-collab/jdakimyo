# BRIF-F03 — d-orbital modeli + qolgan 7 ta ulkan sahifa

**Agent:** Gemini · **Xavf:** o'rta (ilmiy mazmun xavf ostida)
**Hudud:** `app/oquv/fazoviy/`, `lib/fazoviy/`

---

## Ikki ish, tartibi majburiy

### 1-QISM — d-orbital ajralishi modeli (AVVAL BU)

`lib/fazoviy/FazoviyKoruvchi.jsx:741` da:

```js
{geometryInfo.ks === 6 ? (oktaedrik ajralishi) : (tetraedrik ajralishi)}
```

Bu **ikkilik shart**. Hozirgi ikkita sahifa uchun to'g'ri, chunki
oktaedrik `ks=6` va tetraedrik `ks=4`.

Qolgan sahifalar uchun **ilmiy jihatdan xato**:

| Geometriya | KS | `ks===6` nima berardi | Haqiqat |
|---|---:|---|---|
| Chiziqli | 2 | tetraedrik | ✗ |
| Uchburchak | 3 | tetraedrik | ✗ |
| Tekis kvadrat | 4 | tetraedrik | ✗ — dx²-y² ≫ dxy > dz² |
| Kvadrat piramida | 5 | tetraedrik | ✗ |
| Trigonal prizma | 6 | **oktaedrik** | ✗ — oktaedrikdan farqli |
| Dodekaedrik | 8 | tetraedrik | ✗ |

**Tuzatish:** ajralish naqshi geometriyaning **o'z ma'lumotidan**
kelsin, `ks` sonidan emas. Har sahifa o'z `GEOMETRY_INFO` ida
ajralish sathlarini bersin; `FazoviyKoruvchi` faqat ko'rsatsin.

**MUHIM — ma'lumot bo'lmasa TO'QIB CHIQARMA.** Eski sahifada ajralish
ma'lumoti yo'q bo'lsa, panelni ko'rsatma va sababini yoz. Bu ta'lim
platformasi: noto'g'ri fizika yo'q fizikadan yomonroq.

### 2-QISM — qolgan 7 ta ulkan sahifani ko'chir

| Sahifa | Qator |
|---|---:|
| `sendvich` | 4 611 |
| `dodekaedrik` | 4 417 |
| `kvadrat-piramida` | 4 321 |
| `tekis-kvadrat` | 4 163 |
| `chiziqli` | 4 046 |
| `trigonal-prizma` | 2 776 |
| `uchburchak` | 2 504 |
| **jami** | **26 838** |

`oktaedrik` da qilganingdek: `lib/fazoviy/` ni ishlat, sahifada faqat
o'ziga xos narsa qolsin (geometriya ta'rifi, birikmalar, matn,
d-orbital ma'lumoti).

**Manzillar o'zgarmasin** — hammasi SEO da indekslangan.

8 ta kichik sahifa **bu brifda emas** — keyingisida.

---

## F01 dan olingan saboq — MAZMUN o'lchanadi

BRIF-F01 da `oktaedrik` texnik jihatdan a'lo ko'chirildi, lekin PDF
hisobotidan spektroskopiya bo'limi **tushib qoldi** va buni faqat
egasi ko'zi bilan topdi. Mening mezonim "PDF ishlaydi" degan edi —
ishlashini so'rab, to'liqligini so'ramaganman.

Bu safar har sahifa uchun **hisob-kitob** talab qilinadi.

Har bir ko'chirilgan sahifa uchun:

```
git show 287e804:app/oquv/fazoviy/<nom>/3d/page.js > /tmp/eski-<nom>.js
```

va quyidagi jadval:

| Sahifa | `cm⁻¹` oldin | keyin | matn satri oldin | keyin | yo'qolgan |
|---|---:|---:|---:|---:|---|

"Matn satri" — uzunligi 20 belgidan katta bo'lgan satrlar
(`"..."` yoki `` `...` `` ichida).

**Har yo'qolgan satr uchun sabab yoz:** takroriy edi / o'lik kod edi /
umumiy modulga ko'chdi / **tiklandi**.

---

## Qabul mezonlari

1. **7 ta manzil ham `200`** qaytaradi.
2. **Mazmun jadvali** to'liq — 7 qator, yuqoridagi ustunlar bilan.
   Yo'qolgan har satr izohlangan.
3. **`cm⁻¹` yig'indisi kamaymasin** — barcha sahifalar va
   `lib/fazoviy/` bo'ylab, ko'chirishdan oldingi holatga nisbatan.
4. **d-orbital paneli har geometriyada to'g'ri** — qaysi sahifada
   qanday ajralish ko'rsatilishini jadval qilib ber. Ma'lumot yo'q
   bo'lgan sahifalarni ham ko'rsat.
5. **Vizual ayniylik** — sen rasm ko'rasan. Kamida 3 ta sahifaning
   oldin/keyin skrinshotini solishtir va hisobotga qo'sh.
6. **PDF ishlaydi** — kamida 3 ta sahifada PDF yasab ko'r, sahifa
   soni va bo'lim sarlavhalarini eski versiya bilan solishtir.
7. **Qator soni tushsin** — 7 sahifa + `lib/fazoviy/` yig'indisi
   hozirgi 26 838 + mavjud `lib/fazoviy/` dan kam bo'lsin. Sonlarni
   ko'rsat.
8. `npm run build` → `exit 0`.
9. **Tegilmagan sahifalar buzilmasin** — 8 ta kichik sahifa hamon
   `200` qaytarsin.
10. `dispose` har sahifada ishlasin.

---

## Tegilmaydi

- `app/laboratoriya/3d/` — boshqa agent
- `.github/` — boshqa agent
- `lib/sayt.js` va bazaviy manzil — boshqa agent
- 8 ta kichik fazoviy sahifa — keyingi brifda
- Kimyo ma'lumotini **o'zgartirish yoki to'qish** — faqat ko'chirish
  va tiklash

---

## Ish tartibi

```
git checkout main && git pull
git checkout -b gemini/fazoviy-ulkan
```

Tugagach push qil va **TO'XTA**. `main` ga merge qilma.

Agar ish juda katta bo'lsa — **bo'lib bajar**: avval 1-qism va 2-3 ta
sahifa, push, hisobot. Qolganini keyingi bosqichda. Bu **ma'qul**;
mazmun yo'qolishidan ko'ra sekin borish yaxshi.
