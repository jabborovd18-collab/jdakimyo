# BRIF-03 — Sifat darajalari va 4K

**Qavat:** 0 · **Xavf:** past · **BRIF-01 bilan parallel bo'lishi mumkin**
(turli fayllar, konflikt yo'q)

---

## Muammo

Hozir sifat **ikki holatli**: `kuchsizQurilmaniAniqla()` `true` yoki `false`
qaytaradi va shunga qarab soya, antialias, shisha turi, postprocessing
birdaniga yoqiladi yoki o'chiriladi. Ikki muammo:

1. **4K ekranda 4K chiqmaydi.** `useSahna.js:186`:
   `renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))`
   — chegara 1.5 da qotib qolgan. 4K monitorda sahna doim pastroq
   rezolyutsiyada chiziladi va yuqoriga cho'ziladi. Loyihaning maqsadi
   "4K sifatli simulyator" ekan, bu to'g'ridan-to'g'ri qarshi turadi.
2. **Taxmin bilan tanlash.** Daraja `navigator.hardwareConcurrency` va
   `deviceMemory` dan taxmin qilinadi. Bu ko'rsatkichlar GPU haqida hech
   narsa aytmaydi: 2 yadroli MacBook kuchli GPU ga ega bo'lishi mumkin,
   8 yadroli ofis kompyuteri esa integratsiyalangan grafikaga.

---

## Vazifa

### 1. To'rt pog'ona — `app/laboratoriya/3d/lib/sifat.js`

| Pog'ona | pixelRatio | Soya | Antialias | Postprocessing | Shisha |
|---|---|---|---|---|---|
| `past` | 1.0 | yo'q | yo'q | yo'q | arzon |
| `orta` | min(dpr, 1.25) | 1024 | FXAA | yo'q | arzon |
| `yuqori` | min(dpr, 2.0) | 2048 | MSAA | bloom | haqiqiy |
| `ultra` | dpr (chegarasiz) | 4096 | MSAA | to'liq | haqiqiy |

Jadvaldagi sonlar boshlang'ich taklif — o'lchab tuzating va **nega**
o'zgartirganingizni izohda yozing.

### 2. Foydalanuvchi tanlovi

Sozlamalarda pog'onani qo'lda tanlash. Tanlov `localStorage` da saqlanadi
va avtomatik aniqlashdan **ustun** turadi. Sukut bo'yicha — `avto`.

### 3. Dinamik rezolyutsiya (DRS)

Kadr vaqtini o'lchang (silliqlangan o'rtacha, 60 kadr oynasi):
- 16.7 ms dan sekin bo'lsa → renderer masshtabini 0.1 qadam bilan
  0.6 gacha tushiring.
- 12 ms dan tez bo'lsa → 1.0 gacha ko'taring.
- Pog'onani **o'zgartirmang** — faqat masshtabni. Pog'ona almashishi
  sahnani qayta qurishga olib keladi va sakrash bo'ladi.
- Chegaralarni sekundiga bir martadan tez o'zgartirmang (tebranish).

### 4. Avtomatik aniqlash

`hardwareConcurrency` o'rniga **haqiqiy o'lchov**: sahna qurilgach
birinchi 2 soniyada kadr vaqtini o'lchab pog'onani tanlang. Mobil
qurilma — doim `past` yoki `orta` dan boshlansin.

---

## Qabul mezonlari

- 4K monitorda `ultra` da `renderer.getPixelRatio()` = ekranning haqiqiy
  `devicePixelRatio` si.
- Har pog'onada FPS o'lchovi yozilgan (bir xil kamera nuqtasida).
- Sun'iy sekinlashtirilgan sahnada DRS masshtabni tushirib, FPS ni
  55+ ga qaytaradi — grafik yoki log bilan isbot.
- Pog'ona almashganda xotira o'smaydi (`renderer.info`).

## Tegilmaydi

Yorug'lik qiymatlari (BRIF-01), asset (BRIF-02), xona geometriyasi (BRIF-04).

## Dalil

Har pog'onadan bittadan skrinshot + FPS jadvali; 4K ekranda `ultra`
skrinshoti (piksel o'lchami ko'rinadigan qirqim bilan).
