# BRIF-03 — Dinamik rezolyutsiya

**Qavat:** 0 (poydevor) · **Navbat:** `0.2` va o'lchov asbobidan keyin
**Xavf:** o'rta (ish vaqtida o'zgaruvchi holat qo'shiladi)

---

## Bu brif 2026-08-22 da QAYTA YOZILDI

Eski matn `BRIF-00C` (sifat profili) va o'lchov asbobi tuzatilishidan
oldin yozilgan edi va uchta joyda hozirgi kodga zid edi. Zidliklarni
yozib qoldiramiz, chunki har biri bir xil naqshning ko'rinishi.

### Zid 1 — ikkinchi sifat tizimi

Eski brif `lib/sifat.js` da to'rt pog'ona so'ragan:
`past / orta / yuqori / ultra`.

Lekin `lib/sifat-profili.js` allaqachon mavjud va unda uch profil bor:
`telefon / desktop / ilova`. U shunchaki fayl emas — u YAGONA MANBA:

- `lib/yoruglik.js` chiroq byudjetini shundan oladi (3 / 8 / 16);
- o'lchagich profilni shundan o'qiydi (`OLCHOV.md`, `olcham-nuqtalar.js`);
- `docs/3d-lab/PROFILLAR.md` shuni hujjatlashtiradi;
- barcha model quruvchilar `profil` obyektini argument sifatida oladi.

Ikkinchi pog'ona tizimi qo'shilsa, "sifat darajasi" ikki joyda
yashaydi va ular albatta bir-biridan uziladi — AGENTS.md 1-bandi.
**Yangi tizim qo'shilmaydi.** Mavjud profilga maydon qo'shiladi.

### Zid 2 — bajarib bo'lmaydigan mezon

Eski mezon: *"DRS masshtabni tushirib, FPS ni 55+ ga qaytaradi"* va
*"Har pog'onada FPS o'lchovi yozilgan"*.

2026-08-22 da o'lchandi va yozildi (`OLCHOV.md`): **FPS bu loyihada
o'lchov emas.** Telefon profilida yuk ikki baravar oshganda FPS
pasaymadi, balki 44.3 dan 45.9 ga KO'TARILDI; bir xil holatdagi
tarqoqlik 49%.

Ya'ni eski mezon bajarilganini ham, bajarilmaganini ham isbotlab
bo'lmasdi. Mezon shunday yozilsa, agent uni "bajarildi" deb hisobot
qiladi va hech kim tekshira olmaydi.

### Zid 3 — 4K ni qattiq son bilan ochish

Eski brif `ultra` da `pixelRatio` ni **chegarasiz** qo'ymoqchi edi.
4K ekranda bu 4 barobar piksel degani. Loyiha tarixida 4K maqsadi
allaqachon bir marta yorug'lik falokatiga olib kelgan (`YOL-XARITASI`).

Chegarani olib tashlash o'rniga DRS ning O'ZI 4K ni ochadi: kadr
arzon bo'lsa rezolyutsiya ko'tariladi, qimmatlashsa tushadi. Bu
xavfsiz, chunki qaror o'lchovdan chiqadi, taxmindan emas.

---

## Muammo

Sifat profili **bir marta**, sahna qurilishida tanlanadi va shundan
keyin o'zgarmaydi. Ya'ni:

- telefon qiynalsa — hech narsa yengillashmaydi;
- kuchli kompyuterda kadr 1 ms bo'lsa ham rezolyutsiya `1.5` da
  qotib turadi va ekranning qolgan imkoniyati ishlatilmaydi;
- bir qurilmaning o'zi issiqdan sekinlashsa (termal), sahna shunga
  javob bermaydi.

Egasi 2026-08-22 da telefonda sekinlashuvni xabar qildi. Shu bandning
sababi shu.

---

## Vazifa

### 1. Profilga rezolyutsiya oralig'i qo'shiladi

`lib/sifat-profili.js` da har profilga:

```js
pikselNisbati: 1.0,                       // boshlang'ich (mavjud)
pikselOraligi: { past: 0.6, yuqori: 1.0 } // YANGI — DRS chegarasi
```

Taklif qilingan qiymatlar (o'lchab tuzating va **nega** o'zgartirganingizni
izohda yozing):

| profil | boshlang'ich | past | yuqori |
|---|---:|---:|---:|
| `telefon` | 1.0 | 0.6 | 1.0 |
| `desktop` | 1.5 | 0.8 | `min(dpr, 2.0)` |
| `ilova` | 1.5 | 0.8 | `min(dpr, 2.0)` |

`yuqori` chegarasi 4K ekranda 2.0 gacha ko'tariladi — lekin faqat
kadr arzon bo'lsa. Bu 3-zidga javob.

### 2. Boshqaruvchi — `lib/dinamik-rezolyutsiya.js`

Yangi fayl, yagona ega. Ichida **sof funksiya** bo'lishi shart:

```js
export function keyingiNisbat(holat, kadrVaqti, oraliq) -> yangiHolat
```

Sof, chunki uni GPU siz, brauzersiz, sun'iy sonlar bilan sinash
mumkin. Butun mezon shunga tayanadi (pastga qarang).

Xulq:

- **Signal** — `requestAnimationFrame` oralig'ining medianasi, 30
  kadrli oyna. (Ha, `OLCHOV.md` FPS ga ishonmaslikni aytadi. Farqni
  o'qing: o'lchagich SAHNANI taqqoslaydi va unga `gl.finish()` bilan
  aniq vaqt kerak; DRS esa FOYDALANUVCHI ko'rayotgan kadrni kuzatadi
  va aynan rAF oralig'i shuni bildiradi. Har biri o'z joyida to'g'ri.)
- Median > `nishon * 1.25` bo'lsa — nisbatni **bir** qadam tushir.
- Median < `nishon * 0.7` bo'lsa — **bir** qadam ko'tar.
- Qadam `0.1`. Bir vaqtda bittadan ko'p qadam tashlanmaydi.
- Ikki o'zgarish orasida kamida **1 soniya** kutiladi (tebranishga qarshi).
- Ko'tarilish tushishdan **sekinroq**: ko'tarish uchun ketma-ket
  **uch** oyna arzon bo'lishi shart, tushirish uchun bitta yetadi.
  Sabab: sekin sahna darhol sezilaradi, past rezolyutsiya esa yo'q.
- Chegaradan chiqmaydi (`pikselOraligi`).
- Profil **almashtirilmaydi** — faqat rezolyutsiya. Profil almashishi
  sahnani qayta qurishga va ko'rinadigan sakrashga olib keladi.

Nishon kadr vaqti profildan: telefon `33.3` ms (30 FPS), desktop va
ilova `16.7` ms (60 FPS).

### 3. O'lchagichda DRS O'CHIQ

`sozlama.olcham` rost bo'lganda boshqaruvchi ishga tushmaydi.

Sabab: o'lchagichning butun vazifasi — oldin/keyin taqqoslash. Agar
rezolyutsiya o'lchov paytida o'zgarsa, har qator boshqa sharoitda
o'lchanadi va taqqoslash ma'nosini yo'qotadi.

O'lchagich `pikselNisbati` ni natijaga qo'shsin — u profilning
boshlang'ich qiymatiga teng ekani tekshiriladi.

---

## Qabul mezonlari

### 1. Boshqaruvchi sun'iy sonlar bilan sinaladi

`window.__rezolyutsiyaSinovi()` qo'shiladi (faqat `next dev`, xuddi
o'lchagich kabi). U `keyingiNisbat` ni GPU siz sinaydi va natijani
qaytaradi:

| sinov | kirish | kutilgan |
|---|---|---|
| `sekin` | 30 oyna × 50 ms, nishon 16.7 | nisbat `past` chegaraga tushadi |
| `tez` | 90 oyna × 5 ms | nisbat `yuqori` chegaraga ko'tariladi |
| `chegara` | 200 oyna × 50 ms | `past` dan PASTGA tushmaydi |
| `tebranish` | navbatma-navbat 50/5 ms | 10 oynada 2 tadan ko'p o'zgarish yo'q |
| `sekin_kotarilish` | 2 oyna arzon | o'zgarish YO'Q (uch oyna kerak) |

Har sinov `true`/`false` emas, **kutilgan va olingan sonni**
qaytarsin — "o'tdi" degan yagona so'z hech narsa isbotlamaydi.

`npm run lab3d:olcham` bu sinovni chaqiradi va bittasi yiqilsa
**exit 1** beradi. Ya'ni buzilgan boshqaruvchi jim o'tmaydi.

### 2. Ulanish haqiqatan ishlaydi

Sun'iy sinov boshqaruvchining MANTIG'INI tekshiradi, uning
ulanganini emas. Shuning uchun alohida:

- jonli sahifada (o'lchagichda emas) `renderer.getPixelRatio()`
  boshqaruvchi qaroriga ergashishi ko'rsatilsin — konsolga bir
  qatorli jurnal yoki qisqa yozuv bilan.

### 3. O'lchov o'zgarmaydi

Uch profil × barcha nuqtada `kuygan`, `ortacha`, `p95`,
`shipPolFarq`, `chaqiruv`, `uchburchak` — oldingi qiymatlardan
**±0.02** (son maydonlari uchun) yoki aynan bir xil (chaqiruv,
uchburchak) bo'lsin.

DRS o'lchagichda o'chiq bo'lgani uchun bu avtomatik kutiladi —
lekin AYNAN SHUNI tekshirish 3-band o'chirish haqiqatan
ishlaganini isbotlaydi.

### 4. `pikselNisbati` natijaga qo'shiladi

O'lchagich uni chiqarsin va u profilning boshlang'ich qiymatiga teng
bo'lsin (telefon 1.0, desktop 1.5, ilova 1.5).

### 5. `npm run build` → `exit 0`

---

## Tegilmaydi

- Yorug'lik qiymatlari va chiroq soni (`0.1`, `0.1C`)
- Geometriya, material, xona o'lchami
- Profil aniqlash mantig'i (`profilniAniqla`) — u alohida band
- Postprocessing (bloom hamon o'chiq, 3-qavatda o'lchov bilan qaytadi)
- Foydalanuvchi uchun qo'lda sifat tanlash — bu **alohida ish**.
  Eski brifda u shu bandda edi; ajratildi, chunki u interfeys ishi
  va DRS bilan hech qanday umumiy kodi yo'q.

---

## Dalil

1. `__rezolyutsiyaSinovi()` beshta sinovning kutilgan/olingan sonlari.
2. Jonli sahifada `getPixelRatio()` boshqaruvchiga ergashgani.
3. Uch profil × barcha nuqta: o'lchov oldin/keyin jadvali.
4. `pikselNisbati` uch profilda.
5. `npm run build` chiqishi.
