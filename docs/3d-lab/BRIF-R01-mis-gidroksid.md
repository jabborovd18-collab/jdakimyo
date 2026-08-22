# BRIF-R01 — Bitta reaksiyaning to'liq simulyatsiyasi

**Reaksiya:** `CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄`
**Ikkinchi bosqich:** `Cu(OH)₂ →(t°) CuO + H₂O`

**Qavat:** 1 · **Xavf:** yuqori (laboratoriyaning asosiy vazifasi)
**Shart:** poydevorning 0.2, 0.3, 0.4, 0.7 bandlari tugagan

---

## Nega aynan shu reaksiya

Egasi tanlovni menga qoldirdi. Beshta sabab, har biri tekshirilgan:

1. **Kimyo o'ylab topilmaydi.** Ikkala tenglama ham bazada bor va
   balans tekshiruvidan o'tgan: `data/reactions/chokma.js` va
   `data/reactions/termik-parchalanish.js`. AGENTS.md 1-bandi bo'yicha
   kimyoning yagona manbai — o'sha fayllar.

2. **Reagentlar allaqachon devorda.** `CuSO₄` va `NaOH` javon
   ro'yxatida (`javon-3d.js`). Yangi asset kerak emas.

3. **X-ray asosi bor.** `xray-dvigatel.js` da `chokma_cuoh2` profili
   mavjud. Uni noldan qurmaymiz — chuqurlashtiramiz.

4. **Barcha stansiyalarni ishlatadi:** tarozi (tortish), o'lchov
   silindri (hajm), shisha tayoqcha (aralashtirish), spirtovka
   (isitish), termometr (harorat), rakovina (yuvish), planshet
   (tahlil). Ya'ni xona bekor turmaydi.

5. **Mavjud mashg'ulotning DAVOMI.** `AMALIY_MASHGULOTLAR` da
   `mashgulot_2` allaqachon bor: "Mis kuporosidan standart 0.1 M
   eritma tayyorlash". Ya'ni CuSO₄ eritmasini tayyorlash bosqichlari
   yozilgan. Bizning ishimiz o'sha eritmadan boshlanadi va zanjir
   hosil bo'ladi.

---

## TUZATISH — birinchi qoralamadagi xatom

Birinchi qoralamada "xatosi ham o'rgatadi" degan asosiy dalil sifatida
NaOH ortiqcha bo'lganda cho'kmaning erishini yozgandim. Kod yozishdan
oldin `AMALIY_MASHGULOTLAR` ni o'qib ikkita narsa aniqlandi:

**1. Bu mexanika allaqachon bor.** `mashgulot_5` — "Amfoter Metall
Gidroksidlarining Sintezi va Erishi":
`ZnSO₄ + 2NaOH → Zn(OH)₂↓ ➔ (ortiqcha NaOH) → Na₂[Zn(OH)₄]`.
Ya'ni men "yangi g'oya" deb taklif qilgan narsa loyihada yozilgan.

**2. Kimyoviy jihatdan ham men kuchaytirib yuborganman.**
Zn(OH)₂ — klassik amfoter gidroksid va u suyultirilgan ishqorda ham
eriydi. Cu(OH)₂ esa faqat **quyuq** ishqorda, sekin eriydi va
[Cu(OH)₄]²⁻ beradi. Uni "asosiy o'rgatuvchi xato" qilib ko'rsatish
o'quvchiga noto'g'ri taassurot berardi: amfoterlik darsligi — rux,
mis emas.

**Shuning uchun bu reaksiyaning haqiqiy xato yo'llari boshqacha va
ular quyida 4, 5, 6-bosqichlarda yozilgan:** stexiometriya xatosi
(to'liq cho'kmaslik), yuvilmagan cho'kma (unum noto'g'ri), va isitish
xatosi (sachrash yoki chala aylanish). Amfoterlik esa `mashgulot_5`
ning ishi va u yerda qoladi.

**Nima rad etildi va nega:**

| Nomzod | Nega emas |
|---|---|
| `AgNO₃ + NaCl → AgCl↓` | Bir bosqichli, isitish yo'q, struktura oddiy |
| Elektroliz | Stend bor, lekin bosqichlar kam va X-ray mazmuni tor |
| Titrlash (NaOH + HCl) | Jarayon boy, lekin ko'rinadigan struktura o'zgarishi yo'q |
| Efirlanish | Organik, isitish va qaytar reaksiya — birinchi to'liq simulyatsiya uchun juda murakkab |

---

## Mavjud nima — qayta qurilmaydi

Ish boshlashdan oldin bu ro'yxat tekshirilsin. Har biri ishlaydi:

| Nima | Qayerda |
|---|---|
| Kimyo hakami (server) | `lib/lab-nisbat.js`, `lib/lab-modda.js` |
| Idish holati | `lib/idish-holati.js` — `{ ml, mol }` |
| Inventar | `lib/lab-inventar.js` — yagona yo'l |
| X-ray dvigateli | `3d/lib/xray-dvigatel.js` + `XRayMolekulaModal.jsx` |
| Effektlar | `3d/lib/effektlar.js` — cho'kma, pufak, bug', rang |
| Tarozi | `3d/lib/tarozi.js` + `Tarozi_Stansiyasi` |
| Planshet / hisobot | `EkspertXulosaModal.jsx`, `lib/pdf-hisobot.js` |

**Bu ro'yxatdagi hech narsa qayta yozilmaydi.** Yetishmagani
qo'shiladi.

---

## Tajribaning bosqichlari

Har bosqichda uchta narsa bo'lishi SHART:

- **Server tekshiruvi** — client hech narsa hal qilmaydi (AGENTS.md 2);
- **Ko'rinadigan belgi** — o'quvchi nima bo'lganini ko'zi bilan ko'rsin;
- **Xato yo'li** — noto'g'ri qilinsa nima bo'ladi va u ham o'rgatadi.

### 0. Xavfsizlik

Ko'zoynak taqilmasa ogohlantirish. NaOH — korroziy (GHS bazada).

- Belgi: HUD da qizil chiziq, ko'zoynak taqilgach yashil.
- Xato yo'li: ko'zoynaksiz davom etish mumkin, lekin yakuniy
  hisobotda "xavfsizlik qoidasi buzildi" yozuvi qoladi.
- **Bloklamaydi.** Bloklash o'quvchini bezovta qiladi; yozuv esa
  o'rgatadi.

### 1. Reja — planshetda

Vazifa ko'rsatiladi: 0.02 mol CuSO₄ dan Cu(OH)₂ olish, keyin uni CuO
ga aylantirish. Kerakli miqdorlar KO'RSATILMAYDI — o'quvchi o'zi
hisoblaydi.

### 2. Tortish

CuSO₄·5H₂O ni tarozida tortish. 0.02 mol = **4.99 g**
(M = 249.68 g/mol).

- Server tekshiruvi: `massa` maydoni ±5% ichidami.
- Belgi: tarozi ekranida massa, TARA tugmasi.
- Xato yo'li: kam olsa — unum kam; ko'p olsa — NaOH yetmaydi va
  reaksiya to'liq bormaydi. Ikkalasi ham hisobotda ko'rinadi.

### 3. Eritish

50 ml distillangan suv (rakovina krani), aralashtirish (tayoqcha).

- Belgi: kristallar yo'qoladi, eritma ochiq moviy tus oladi.
  Rang `lib/lab-modda.js` dan keladi, bu yerda qayta yozilmaydi.

### 4. NaOH qo'shish — ENG MUHIM BOSQICH

0.04 mol NaOH kerak (1:2 nisbat). Byuretkadan tomchilatib qo'shiladi.

- Server tekshiruvi: `lib/lab-nisbat.js` stexiometrik bahoni beradi.
- Belgi: har tomchida moviy jelatinsimon cho'kma paydo bo'ladi va
  ko'payadi.
- **Xato yo'li — stexiometriya.** NaOH kam bo'lsa Cu²⁺ ning bir
  qismi eritmada qoladi va cho'kma kam chiqadi; ko'p bo'lsa ortiqcha
  ishqor cho'kma bilan qolib, keyingi yuvishda unum hisobini buzadi.
  Ikkalasi ham hisobotda ko'rinadi.

- Quyuq ishqorda Cu(OH)₂ sekin erib [Cu(OH)₄]²⁻ berishi mumkin. Bu
  ESLATMA sifatida planshetda aytiladi, lekin bu mashg'ulotning
  o'rgatuvchi mexanikasi EMAS — amfoterlik `mashgulot_5` da rux
  misolida o'rgatiladi. Agar bu tenglama ko'rsatilsa, u avval bazada
  bo'lishi va balans tekshiruvidan o'tishi shart.

### 5. Cho'ktirish va yuvish

Cho'kma tubiga o'tirishi kutiladi, ustidagi suyuqlik to'kiladi,
cho'kma yuviladi.

- Belgi: qatlamlar ajraladi.
- Xato yo'li: yuvilmasa, keyingi bosqichda Na₂SO₄ qoldig'i unum
  hisobini buzadi.

### 6. Isitish — ikkinchi reaksiya

Spirtovka ustida. `Cu(OH)₂ →(t°) CuO + H₂O`, ~80 °C dan boshlanadi.

- Belgi: moviy → qora, idish devorida suv tomchilari (bug').
- Server tekshiruvi: harorat va vaqt.
- Xato yo'li: juda tez isitilsa cho'kma sachraydi; harorat yetmasa
  o'zgarish tugamaydi va oraliq rang qoladi.

### 7. Xulosa

Planshet: stexiometriya jadvali, nazariy va amaliy unum, X-ray
ko'rigi, PDF hisobot. Hammasi mavjud modullardan.

---

## X-RAY ANIMATSIYASI — asosiy ish

Egasi "ancha bosh qotirib ishla" dedi. Quyida nima yetishmayotgani va
nima qo'shilishi.

### Hozirgi profilning ilmiy nuqsoni

`chokma_cuoh2` da `Cu²⁺` YALANG'OCH ion sifatida ko'rsatilgan.
Suvli eritmada bunday zarracha yo'q — u **[Cu(H₂O)₆]²⁺**. Oraliq
kompleks matnida akva-kompleks eslatiladi, lekin ko'rinishda u yo'q.

Bundan tashqari `Cu(OH)₂` diskret "H–O–Cu–O–H" molekula sifatida
chizilgan. Aslida u **qatlamli polimer** — va aynan shu uning nega
jelatinsimon cho'kma ekanini tushuntiradi.

### Yangi bosqichlar

| # | Ko'rsatiladi | Ilmiy mazmun |
|---|---|---|
| 1 | `[Cu(H₂O)₆]²⁺` oktaedri | Yan–Teller cho'zilishi: 4 ta qisqa ekvatorial va 2 ta uzun aksial Cu–O |
| 2 | OH⁻ yaqinlashadi | Ligand almashinuvi; suv ligandi siqib chiqariladi |
| 3 | Birinchi Cu–OH bog'i | Koordinatsion son saqlanadi |
| 4 | Ikkinchi OH⁻, neytral birlik | Zaryad muvozanati |
| 5 | Qatlamli polimerga birikish | CuO₄ kvadrat-tekis birliklar ko'prik bilan bog'lanadi — **nega jelatinsimon** |
| 6 | Isitish: qatlam suv yo'qotadi | Topotaktik degidratatsiya |
| 7 | CuO monoklin panjara | Kvadrat-tekis Cu; **nega qora** — tor taqiqlangan zona |

### Sonlar haqida — QAT'IY QOIDA

Bog' uzunliklari va burchaklar **manbasiz yozilmaydi.** Har son uchun
`source` maydoni to'ldiriladi. Manba topilmasa, son YOZILMAYDI va
struktura sifat jihatidan ko'rsatiladi.

Sabab AGENTS.md va `data/reactions/_umumiy.js` ning 2-qoidasi:
*"Bilinmagan maydon BO'SH qoldiriladi. Mexanizmni yoki unumni o'ylab
topish — talabaga soxta kimyo o'rgatish."*

Bu brifning eng katta xavfi shu: X-ray chiroyli ko'rinadi va chiroyli
narsaga soxta son qo'shish oson.

### Ko'rinish talablari

- Slow-mo va tezlik boshqaruvi — mavjud, saqlanadi.
- Har bosqichda **bitta jumlalik izoh** — nima bo'layotgani.
- Bosqichlar orasida to'xtash mumkin bo'lsin (o'qish uchun).
- Telefonda ishlashi shart: bosqich tugmalari barmoq uchun yetarli
  kattalikda (`lib/kirish-usuli.js` bo'yicha).

---

## O'lchanadigan qabul mezonlari

Grafik va mazmun — ikkalasi ham.

1. **Mazmun yo'qolmasin.** X-ray profilidagi NOYOB ilmiy satrlar
   (bog' nomi, struktura atamasi, son+birlik) soni oldin/keyin
   sanaladi va **kamaymasin**. Son emas, NOYOB MATN solishtiriladi.

   Sabab: 2026-08-21 da fazoviy sahifalarda ilmiy mazmun ikki marta
   yo'qolgan va buni son ushlamagan.

2. **Har son manbali.** Manbasiz son bo'lsa — ish tugallanmagan.

3. **Tenglama balansi.** Yangi tenglama qo'shilsa
   `node scripts/check-reactions.js` o'tishi shart.

4. **Server hakam.** Bosqich baholari serverdan keladi. Client
   hisoblagan ball ekranda ko'rsatilmaydi (AGENTS.md 2).

5. **3D o'lchov buzilmasin.** `npm run lab3d:olcham` uch profilda:
   `chaqiruv`, `uchburchak` va ko'rinish metrikalari poydevor
   qiymatlaridan chiqib ketmasin.

6. **Telefonda bajarilsin.** Butun tajriba sensorli qurilmada oxiriga
   yetsin. Hozir bu MUMKIN EMAS: aniq hajm quyish faqat klaviaturada
   (`lib/kirish-usuli.js`). **Shuning uchun bu brifning shartlaridan
   biri — sensorli aniq doza kiritish.**

---

## Bosqichlar QAYERGA yoziladi — yangi tuzilma YARATILMAYDI

`AMALIY_MASHGULOTLAR` (`3d/lib/amaliy-mashgulotlar.js`) allaqachon
kerakli shaklga ega:

```js
{ id, raqam, nomi, fan, daraja, qiyinlik, xp, tanga, maqsad,
  reagentlar, jihozlar, tenglama, qadamlar: [{ id, matn, kalit, minMl }],
  xulosa }
```

Bizning tajribamiz shu ro'yxatga **`mashgulot_6`** bo'lib qo'shiladi.
Yangi bosqich tizimi yaratilmaydi.

**Nega bu muhim — G5 (hamroh robot) uchun.** Yo'l xaritasidagi G5
robotning uchta vazifasidan biri: "amaliy mashg'ulotni bosqichma-
bosqich boshqarish". Robot aynan `qadamlar` ni o'qiydi. Agar biz
bosqichlarni 3D interfeysga qotirib yozsak, robot kelganda ularni
qayta yozish kerak bo'lardi — ya'ni egasi so'ragan "kelajakda halaqit
bermasin" sharti buzilardi.

Shuning uchun qat'iy qoida: **bosqich MA'LUMOT, interfeys emas.**
Bugun uni panel ko'rsatadi, ertaga robot gapiradi — manba bitta.

Buning uchun mavjud shaklga ikkita maydon YETISHMAYDI va ular
qo'shiladi:

| Maydon | Nima uchun |
|---|---|
| `tekshir` | Qadam bajarilganini SERVER qanday aniqlaydi (AGENTS.md 2) |
| `kutilganNatija` | Nima ko'rinishi kerak — robot shuni aytadi, panel shuni yozadi |

Mavjud besh mashg'ulotga bu maydonlar QO'SHILMAYDI — ular hozirgicha
ishlaydi. Yangi maydon ixtiyoriy bo'ladi.

---

## Tegilmaydi

- Poydevor bandlarining kodi (yorug'lik, DRS, birlashtirish)
- Kimyo bazasi tuzilishi — faqat yangi yozuv qo'shiladi
- Boshqa reaksiyalar
- Inventar va balans mantig'i

---

## Ochiq savollar — egasiga

1. Tajriba **majburiy ketma-ketlikmi** yoki o'quvchi erkin
   harakatlanadimi? (Erkinlik qiziqroq, lekin baholash murakkablashadi.)
2. Xato yo'llari **ball kamaytiradimi** yoki faqat hisobotda
   qayd etiladimi?
3. Bu tajriba **stars/tanga beradimi**? Laboratoriya iqtisodiyoti
   bo'yicha tajriba zarar keltirmasligi kerak edi.
