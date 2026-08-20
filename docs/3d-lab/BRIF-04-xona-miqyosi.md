# BRIF-04 — Xona miqyosi, devor va soya qamrovi

**Qavat:** 0 · **Navbat:** BRIF-01 dan keyin · **Xavf:** yuqori
(kolliziya va yurish tizimiga tegadi — ehtiyot bo'ling)

---

## Muammo

### 1. Xona juda katta va bo'sh

`xona-modellari.js:221-223`:
```js
const XONA_W = 16.0;
const XONA_H = 4.2;
const XONA_D = 12.0;
```

16 × 12 m = **192 m²**, shipi 4.2 m. Ichida esa atigi bitta 3.2 × 1.6 m
stol. Haqiqiy maktab/universitet kimyo laboratoriyasi odatda 7 × 9 m
atrofida, shipi 3.0–3.2 m. Skrinshotdagi "bo'm-bo'sh oq zal" tuyg'usi
grafik nuqson emas — **fazoviy nisbat** nuqsoni. Yorug'likni qanchalik
to'g'rilamang, bo'sh 192 m² baribir ombor bo'lib ko'rinadi.

### 2. Soya xonaning 14% ini qoplaydi

`useSahna.js` da soya kamerasi ±2.6 m, `far = 15`. Ya'ni 5.2 × 5.2 m
maydon — 16 × 12 xonaning **14%** i. Javon, rakovina, deraza, davriy
jadval — hammasi soya zonasidan tashqarida. Shuning uchun ular devorga
yopishtirilgan qog'ozdek ko'rinadi.

Yomonrog'i: `xona-modellari.js` ning 1523 qatorida `castShadow` **bir
marta** uchraydi (`receiveShadow` — 9 marta). Ya'ni xonadagi buyumlar
soya **tashlamaydi ham**.

### 3. Devorlar — qalinliksiz tekislik

Devorlar bitta `PlaneGeometry`. Derazalar ham `PlaneGeometry(2.0, 2.4)`
bo'lib, devordan 0.02 m oldinda turadi. Natijada skrinshotda deraza —
devordagi tekis oq to'rtburchak: ram yo'q, tokcha yo'q, chuqurlik yo'q.

### 4. Davriy jadval xonadan chiqib ketgan

Skrinshotda panel devor chetidan tashqariga chiqib turibdi
(`PlaneGeometry(4.12, 2.02)`, joylashuvi xona chegarasiga tekshirilmagan).

---

## Vazifa

1. **Xona o'lchamini `sozlama.js` ga ko'chiring** (hozir modellar faylida
   qattiq yozilgan — 1-band buzilishi) va haqiqiy nisbatga keltiring:
   taklif `9.0 × 7.0 × 3.2`. Aniq sonni o'zingiz tanlang, lekin
   **nega** shu son ekanini izohda asoslang.
2. **Soya qamrovini xona o'lchamidan hisoblang.** Qattiq yozilgan ±2.6
   olib tashlanadi. Bitta soya kamerasi butun xonani qoplasa sifat
   yetmasa — ikki zonali yechim taklif qiling (stol atrofi aniq, xona
   umumiy), lekin murakkablikni asoslang.
3. **Xonadagi buyumlarga `castShadow` bering** — javon, rakovina,
   stollar, jihozlar. Shaffof shisha bundan mustasno (qora dog' beradi).
4. **Devorga qalinlik bering** va derazani devor teshigiga o'tkazing:
   ram, tokcha, chuqurlik. Bu 1.4 ishining boshlanishi — bu brifda
   faqat geometriya, tekstura keyin.
5. **Xona chegarasi tekshiruvi:** har devor buyumi uchun kichik
   yordamchi funksiya — ob'ekt xona ichida turibdimi. Davriy jadval
   shu tekshiruvdan o'tsin.

---

## DIQQAT — buzilishi mumkin bo'lgan joylar

Xona o'lchami o'zgarsa quyidagilar birga o'zgarishi shart. **Har birini
tekshiring**, aks holda foydalanuvchi devordan o'tib ketadi yoki
ko'rinmas devorga urilib qoladi:

- `hooks/useYurish.js` (958 qator) — yurish kolliziyasi, devor to'siqlari
- `lib/xona-zonalari.js` — zona chegaralari
- Kamera boshlang'ich joyi va `KAMERA.uzoq`
- Javon, stend, stansiyalarning joylashuvi
- `FogExp2` zichligi (kichikroq xonada tuman kuchliroq bilinadi)

---

## Qabul mezonlari

- Xona o'lchami `sozlama.js` da, `xona-modellari.js` da son yo'q.
- Soya xona polining **95%** idan ko'prog'ini qoplaydi.
- Javon, rakovina va stol pol yoki devorga aniq soya tashlaydi (skrinshot).
- Yurish rejimida to'rt burchak va to'rt devorga borib tekshirilgan:
  hech qayerda devordan o'tib ketilmaydi, ko'rinmas to'siq yo'q.
- Davriy jadval to'liq devor ichida.

## Tegilmaydi

Yorug'lik kuchlari (BRIF-01), tekstura va material (1-qavat), jihozlar.

## Dalil

Yurish rejimida xonaning to'rt burchagidan 4 skrinshot + soya ko'rinadigan
yaqin plan; kolliziya sinovining qadamma-qadam bayoni.

---

## Qo'shimcha topilma (2026-08-20) — xona TOR EMAS, kamera tor

Egasi "xona tor ko'rinadi, kattalashtiraylikmi?" deb so'radi. O'lchandi:

```
xona-modellari.js:221   XONA_W = 16.0
xona-modellari.js:222   XONA_H = 4.2      <- ship balandligi
xona-modellari.js:223   XONA_D = 12.0
```

192 m², shipi 4.2 m. Haqiqiy universitet laboratoriyasi odatda
60-100 m², shipi ~3 m. **Xona kichik emas — real hayotdagidan katta.**

Torlik tuyg'usining sababi boshqa joyda:

```
sozlama.js:5   fov: 45
```

Three.js'da `fov` VERTIKAL. 16:9 ekranda 45° vertikal ≈ 73° gorizontal.
FPS o'yinlari 90-103° gorizontal ishlatadi. 45° — mahsulotni suratga
olish burchagi, ichida yurish burchagi emas: u fazoni siqadi va
devorlarni yaqin ko'rsatadi.

Qo'shimcha uch sabab: bo'sh xonada masofani chamalaydigan ob'ekt yo'q;
oq kuygan pol chuqurlik idrokini yo'q qiladi (BRIF-01); tuman uzoq
devorni yashiradi.

**XONA KATTALASHTIRILMAYDI.** Sabablari:

1. Bo'sh 192 m² kattalashtirilsa laboratoriya emas, ombor bo'ladi.
   Xonani TO'LDIRISH uni kattaroq ko'rsatadi, kichikroq emas.
2. Soya qamrovi allaqachon yetishmaydi (soya kamerasi ±2.6 birlik,
   xona 16x12) — kattalashtirish bu brifning asosiy muammosini
   og'irlashtiradi.
3. FOV bitta raqam va u geometriyaga tegmasdan darhol kengaytiradi.

**Bu brifga qo'shiladigan vazifa:** FOV ni 45 dan ~60-65 (vertikal)
gacha ko'tarish va uch kamera nuqtasida BRIF-00 o'lchovi bilan
tekshirish. Diqqat: FOV o'zgarishi kadrga ko'proq geometriya
kiritadi — `renderer.info.render.triangles` va FPS ni oldin/keyin
solishtiring. FOV ni yurish rejimida va orbit rejimida alohida
sozlash kerak bo'lishi mumkin.
