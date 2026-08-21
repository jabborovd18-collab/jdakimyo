# BRIF-G6 — Yorliqlar: o'rganuvchi rejimi va uchta nuqson

**Qavat:** mustaqil · **Navbat:** BRIF-01C dan keyin · **Xavf:** past
**Hudud:** `jihoz-modellari.js`, `korinish.js`, `olcham-mijoz.js`

---

## Kelib chiqishi

Egasi jonli saytda uchta narsani ko'rdi va bittasini taklif qildi.
Ular bitta tizimga tegishli, shuning uchun bitta brifda.

### Nuqson 1 — qo'ldagi idish yorlig'i ulkan

`jihoz-modellari.js:36`:

```js
sprite.scale.set(0.3, 0.075, 1);
```

Yorliq **jahon fazosida qat'iy 30 sm**. Three.js `Sprite` perspektiva
bilan kattalashadi: 5 metrda kichkina, qo'lda ushlaganda (kamera 20 sm
da) ekranning uchdan birini egallaydi.

Ustiga u **ortiqcha**: o'ng pastdagi HUD kartasi allaqachon
"Qo'lda ushlab turilgan: probirka" deb yozib turadi.

### Nuqson 2 — yorliqlar bir-birini bosadi

`Termometr` va `Spirtovka` yorliqlari ustma-ust tushgan, natijada
termometrning ko'rsatkichi (`25°C`) ko'rinmay qolgan.

`yorliqQosh` yorliqni idish og'zidan 7 sm yuqoriga qo'yadi va
qo'shnilarni umuman hisobga olmaydi.

### Nuqson 3 — ko'rinishni boshqarish YO'Q

Tekshirildi: kodda `yorliq.visible` ni o'zgartiradigan **birorta joy
yo'q**. Yorliqlar har doim, hamma uchun ko'rinadi.

### Egasining taklifi — o'rganuvchi rejimi

> "Yorliqlar alohida funksiya bo'lsin — boshlovchilar, o'rganayotganlar
> yoqib qo'ysa ko'rinadi."

Bu nuqson 3 ning to'g'ri yechimi. Yorliqlarni **olib tashlash** emas
(men avval shuni belgilagandim), **tanlov berish**. Talaba "probirka"
qaysi biri ekanini bilmasa — yorliq kerak; bilsa — xalaqit.

---

## Vazifa

### 1. Qo'lda ushlanganda yorliq ko'rsatilmasin

Idish qo'lga olinganda uning yorlig'i `visible = false`, stolga
qo'yilganda qaytadan `true`.

HUD kartasi allaqachon nima ushlab turilganini aytadi — 3D yorliq
u yerda ortiqcha.

### 2. Yorliqlar bir-birini bosmasin

Ekran fazosida to'qnashuvni bartaraf et. Taklif etilgan usul (majburiy
emas):

- Har yorliqning ekrandagi to'rtburchagini hisobla
- Ikkitasi kesishsa — **kameradan uzoqrog'ini yashir**
- Ma'lum masofadan uzoq yorliqlar umuman ko'rsatilmasin

Bu naqsh "label priority" deb ataladi va u sodda: yaqindagi yorliq
doim o'qiladi, uzoqdagisi yo'qoladi. Har kadrda emas, sanoqli kadrda
bir marta hisoblansa yetadi (masalan har 5-kadrda) — bu FPS ni
saqlaydi.

### 3. O'rganuvchi rejimi — yoqish/o'chirish

- HUD da tugma: **`Yorliqlar`**
- Holat `localStorage` da saqlansin — foydalanuvchi har kirganda
  qaytadan yoqmasin
- **Sukut bo'yicha YOQIQ.** Sabab: platformaning ko'pchilik
  foydalanuvchisi o'quvchi. Bilgan odam bir marta o'chiradi va
  tanlovi eslab qolinadi.

**Diqqat:** nishon (crosshair) ostidagi harakat taklifi —
`[E / G] probirkani stolga qo'yish` — **har doim qoladi**. U yorliq
emas, harakat ko'rsatmasi. Tugma unga ta'sir qilmaydi.

### 4. O'lchagichga ikki maydon qo'sh

`window.__olcham()` ga:

| Maydon | Ma'nosi |
|---|---|
| `yorliqSoni` | Kadrda ko'rinayotgan yorliqlar soni |
| `yorliqToqnashuvi` | Ekran fazosida kesishayotgan yorliq juftlari soni |

Bu ikkinchisi 2-vazifaning qabul mezoni bo'ladi. Sen rasm ko'rmaysan —
to'qnashuvni **sanash** kerak.

---

## Qabul mezonlari

1. **`yorliqToqnashuvi = 0`** — uch profil × barcha kamera nuqtalarida.
2. Idish qo'lda bo'lganda uning yorlig'i `visible === false`.
   Buni ko'rsat (masalan konsolga log yoki test).
3. Tugma bosilganda yorliqlar yo'qoladi/qaytadi; sahifa qayta
   yuklanganda tanlov saqlanadi.
4. Sukut bo'yicha yoqiq — `localStorage` bo'sh bo'lganda.
5. `[E / G]` harakat taklifi tugmadan **qat'i nazar** ishlaydi.
6. **FPS yomonlashmasin** — `npm run lab3d:olcham` da `fps` va
   `chaqiruv` oldingi holat bilan solishtirilsin. To'qnashuv hisobi
   har kadrda ishlamasin.
7. `npm run build` → `exit 0`.

---

## Tegilmaydi

- Yorug'lik, material, geometriya — boshqa qatlamlar.
- Xona o'lchami, asset, postprocessing.
- Yorliqlarning **matni** — faqat ko'rinishi va joylashuvi.
- 2D modal panellar (`ElektrolizStendiUI` va boshqalar) — bu 2.5
  qatlamning ishi, bu brifda emas.

---

## Kelajakka bog'lanish

G4 (mehmon rejimi) qo'shilganda yorliqlar mehmon uchun **sukut
bo'yicha yoqiq** bo'lishi kerak — mehmon hech narsaga tegolmaydi,
yorliq unga xonani tanishtiradi. Hozir buni qurma, faqat kodni
shunga tayyor qoldir (holat bitta joydan boshqarilsin).

---

## Dalil

1. `npm run lab3d:olcham` — `yorliqSoni` va `yorliqToqnashuvi` bilan
   to'liq jadval.
2. Oldingi o'lchov bilan `fps` va `chaqiruv` taqqoslashi.
3. Qo'lda ushlangan idish yorlig'i yashirilganini qanday tekshirganing.
4. `localStorage` kaliti nomi va sukut qiymati.
