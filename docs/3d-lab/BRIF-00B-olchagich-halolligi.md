# BRIF-00B — O'lchagichni HALOL qilish

**Qavat:** 0 · **Navbat: BRIF-01 dan OLDIN** · **Xavf:** past
**Oldingi ish:** BRIF-00 (`872d391`, merge `fe7c050`) — asbob qurildi va qabul qilindi

---

## Nega bu brif bor

BRIF-00 dagi asbob ishlaydi va qabul qilindi. Lekin ko'rikda **asbob
bilan haqiqat bir-biriga zid chiqdi.**

Dalil: preview deploy (`jdakimyo-bec7dwhs7-…/laboratoriya/3d`) skrinshoti.
U `tun` mavzusi — jonli sahifadagi yagona erishiladigan mavzu (pastda F4).
Skrinshotda pol o'rtasida ko'zga tashlanadigan oq kuygan ko'lmak bor va
rakovina butunlay oq porlab turibdi.

O'lchov esa `tun` uchun **`kuygan = 0.00`** dedi.

Ikkalasi ham yolg'on emas — asbob shunchaki noto'g'ri joyga qaraydi va
noto'g'ri narsani o'lchaydi.

**Bu holatda BRIF-01 boshlanmaydi.** Agar boshlansa, arena "mezon
bajarildi" deb hisobot beradi va pol kuygan qoladi — 19-avgustning
aynan o'zi, faqat endi avtomatlashtirilgan va shuning uchun
ishonchliroq ko'rinadi. Yolg'on ko'rsatadigan asbob asbobsizlikdan
yomonroq: u ishonch beradi.

---

## F3 — Qat'iy 3 nuqta qamrov emas, namuna  ⬅ ENG MUHIMI

Bu yagona ISBOTLANGAN nuqson — yuqoridagi skrinshot uni ko'rsatadi.
`stol`, `xona`, `ship` nuqtalari foydalanuvchi turgan joyga qaramaydi.

**Ikkalasi ham kerak, biri ikkinchisini almashtirmaydi:**

1. **Nomli nuqtalar** — oldin/keyin solishtirish uchun. Ular qat'iy
   qoladi, aks holda BRIF-01 da taqqoslash imkonsiz.
2. **Supurish (sweep)** — qamrov uchun. Xona chegarasi ichida `N = 24`
   tasodifiy joy, ko'z balandligida (`y = 1.6`), tasodifiy gorizontal
   burilish va `-30°…+10°` vertikal qiyalik.

Supurish uchun **urug' (seed) qat'iy bo'lsin** — aks holda barqarorlik
sinovi yiqiladi. `LAB3D_SEED` muhit o'zgaruvchisi bilan boshqarilsin,
sukut qiymati qat'iy son.

Supurish natijasi:
- `sweepEngYomon` — eng katta `kuygan` foizi
- `sweepJoy` — o'sha joyning koordinatasi va burchagi
- PNG `.olcham/<mavzu>-sweep-worst.png` nomi bilan saqlansin

**Qabul:** supurish `tun` mavzusida `kuygan > 1%` bo'lgan kamida bitta
joyni topsin. Topmasa — supurish ishlamayapti, chunki skrinshot bunday
joy borligini isbotlagan.

---

## F1 — `shipLuma` / `polLuma` ship va polni o'lchamaydi

`olcham-hisob.js:56-64` da ular **ekran sohalari**: kadrning yuqori 15%
va quyi 35% qatorlari. Geometriya emas.

Oqibati: `xona` kadrida kamera gorizontal, FOV 45°, ship balandligi
4.2 m — kadrning yuqori 15% i **devor**, ship emas. `ship` kadrida esa
ikkala soha ham ship. Ya'ni metrika devorni devor bilan solishtiradi:

| | shipLuma | polLuma | farq |
|---|---|---|---|
| tun/xona | 0.5034 | 0.4817 | 0.02 |
| kunduz/xona | 0.9822 | 0.9922 | 0.01 |

BRIF-01 dagi mezon *"ship va pol farqi 0.5 dan kam (hozir ~0.95)"* shu
metrika bo'yicha **allaqachon bajarilgan** ko'rinadi — sahna buzuq
turgan holda.

**Tuzatish — to'rtinchi nomli nuqta qo'shish:**

| Nuqta | Qarash |
|---|---|
| `stol` | Stol oldida, jihozlarga (mavjud) |
| `xona` | Xona markazida, gorizontal (mavjud) |
| `ship` | Tepaga (mavjud) — **sof ship** |
| `pol` | **YANGI** — pastga, sof pol |

Shunda mezon to'g'ridan-to'g'ri va noaniqliksiz:

```
shipPolFarq = | ship-kadr.ortacha  -  pol-kadr.ortacha |
```

`shipLuma`/`polLuma` maydonlari **qolsin, lekin qayta nomlansin**:
`yuqoriSoha` / `quyiSoha`. Ular kadr ichidagi gradientni ko'rsatadi va
foydali, lekin nomi geometriya deb adashtirmasligi kerak.

O'lchovlar soni: **4 mavzu × 4 nuqta = 16**, ustiga har mavzuga bitta
supurish = **20 qator**.

---

## F2 — Bitta oraliq to'rtala nuqtaga qo'llanmaydi

To'rtala `ship` o'lchovi 0.069–0.086. Yoritilmagan shipga qaragan kamera
**qorong'i bo'lishi kerak**. Yagona 0.18–0.45 oralig'ini unga
qo'llasangiz, BRIF-01 uni "tuzatish" uchun shipni sun'iy yoritishi
mumkin — ahvol yomonlashadi.

Har nuqta uchun alohida oraliq `OLCHOV.md` da yozilsin. Boshlang'ich
taklif (BRIF-01 da aniqlashtiriladi):

| Nuqta | ortacha | kuygan | qora |
|---|---|---|---|
| `stol` | 0.18–0.45 | < 1% | < 5% |
| `xona` | 0.18–0.45 | < 1% | < 5% |
| `pol` | 0.15–0.50 | < 1% | < 5% |
| `ship` | 0.03–0.25 | < 0.5% | — |
| `sweep` (eng yomon) | — | **< 2%** | — |

Bu sonlar dalil emas, boshlang'ich nuqta. Ularni o'zgartirsang —
sababini `OLCHOV.md` da yoz.

---

## F5 — FPS raqami haqiqiy qurilmaga taalluqli emas

41.5–52.7 — bu headless Chromium, ehtimol dasturiy GL (SwiftShader).
Haqiqiy GPU bilan solishtirib bo'lmaydi.

- `WEBGL_debug_renderer_info` orqali GL renderer satrini o'qib,
  har o'lchov qatoriga `renderer` maydoni sifatida qo'sh.
- Jadval tagida ogohlantirish chiqsin: dasturiy GL aniqlansa
  "FPS raqamlari dasturiy renderdan — haqiqiy GPU emas".
- `OLCHOV.md` da alohida band.

Aks holda BRIF-01 yoki BRIF-03 mavjud bo'lmagan unumdorlik muammosini
quvlaydi.

---

## F4 — Jonli sahifa faqat `tun` ni ko'rsata oladi

Sen buni BRIF-00 da topding va to'g'ri qilding — tuzatmading, yozib
qo'yding (10-band). Endi tuzatish vaqti keldi, chunki u BRIF-01 ni
to'sadi.

`korinish.js:90`:
```js
useSahna(konteynerRef, yuklanmoqda, "zamonaviy")
```
`FONLAR` da bunday kalit yo'q → `fonOl` `SUKUT_FON = "tun"` ga tushadi.

Men davomini topdim: **3D laboratoriyada fon almashtirgich UI umuman
yo'q.** Ya'ni `siyoh`, `grafit`, `kunduz` foydalanuvchi uchun
erishib bo'lmaydigan.

**Vazifa — minimal:** o'lik `"zamonaviy"` satrini olib tashla,
`SUKUT_FON` ni aniq uzat. **UI qurma** — fon almashtirgich kerakmi
degan qaror egasiniki, bu brifning ishi emas (10-band). Faqat
`YOL-XARITASI.md` ga yoz: uch mavzu kod bor lekin ulanmagan.

---

## F6 — O'lchagich mobil sahnani hech qachon ko'rmaydi

BRIF-00 da `arzonRejim` o'lchagichda majburan `false` qilingan:

```js
const arzonRejim = olchamRef.current ? false : kuchsizQurilmaniAniqla();
```

Sabab to'g'ri edi — 2 yadroli CI'da desktop sifatini o'lchash kerak.
Lekin oqibati: **asbob telefon ko'radigan sahnani hech qachon
o'lchamaydi.**

Bu endi amaliy muammo. Egasi telefonda sinab ko'rdi va qurilma jiddiy
sekinlashdi; sabab `xona-modellari.js:246-260` dagi **8 ta
RectAreaLight** (batafsil BRIF-01 da). BRIF-01 ga "mobilda
RectAreaLight ishlatilmasin" vazifasi qo'shildi — lekin uni
tekshiradigan raqam yo'q.

**Tuzatish — sifat pog'onasi o'lchov o'lchami bo'lsin:**

- `LAB3D_SIFAT=toliq|arzon` muhit o'zgaruvchisi, sukut `toliq`.
  `arzon` bo'lganda `arzonRejim` majburan `true`.
- Har o'lchov qatoriga `sifat` maydoni qo'shilsin.
- Har qatorga `chiroqSoni` qo'shilsin — sahnadagi `THREE.Light`
  merosxo'rlarini `scene.traverse` bilan sanab. Bu BRIF-01 ning
  asosiy metrikasi bo'ladi va uni sanash arzon.

**Nima kutiladi:** hozirgi kodda `toliq` va `arzon` da `chiroqSoni`
BIR XIL chiqadi (~13). Aynan shu nuqson: arzon rejim antialias,
soya va bloom ni o'chiradi, lekin yorug'likka tegmaydi, chunki
`xonaInteryeriniYasa(materiallar)` `arzonRejim` ni qabul qilmaydi.

Bu sonni **tuzatma** — bu BRIF-01 ning ishi. Sen faqat o'lchashni
qo'sh, toki BRIF-01 tuzatganda farq ko'rinadigan bo'lsin.

**Diqqat:** headless dasturiy GL'da `arzon`/`toliq` FPS farqi haqiqiy
qurilmani ko'rsatmaydi (F5). Lekin `chiroqSoni`, `uchburchak` va
`chaqiruv` — ko'rsatadi. `OLCHOV.md` da shu farq yozilsin.

---

## Qabul mezonlari

1. `npm run lab3d:olcham` **20 qator** chiqaradi (16 nomli + 4 supurish),
   `exit 0`.
2. Har qatorda `renderer` maydoni bor.
3. `shipPolFarq` `ship` va `pol` kadrlari orasidan hisoblanadi va
   XULOSA qatorida ko'rsatiladi. Hozirgi sahnada u **0.4 dan katta**
   chiqishi kutiladi (buzuqligi shundan bilinadi).
4. Supurish `tun` mavzusida `kuygan > 1%` joyni topadi.
5. Ketma-ket ikki ishga tushirishda sonlar barqaror
   (`|Δortacha|` < 0.02) — supurish urug'i qat'iy bo'lgani uchun
   supurish qatorlari ham barqaror bo'lishi shart.
6. `korinish.js` da `"zamonaviy"` yo'q.
7. `LAB3D_SIFAT=arzon` bilan ham to'liq jadval chiqadi; har qatorda
   `sifat` va `chiroqSoni` maydonlari bor.
8. Dalilda `toliq` va `arzon` ning ikkalasidan bittadan chiqish
   ko'rsatiladi. Hozirgi kodda `chiroqSoni` ikkalasida bir xil
   chiqishi kutiladi — bu nuqson BRIF-01 da tuzatiladi, sen emas.
9. Production'da `/laboratoriya/3d/olcham` hamon **404**.
10. `OLCHOV.md` da: har nuqta uchun oraliq, supurish qanday ishlashi,
   FPS ogohlantirishi.

---

## Tegilmaydi

Yorug'lik, material, geometriya, postprocessing — **hech biri**.
Bu brif ham o'lchagich brifi. O'lchagich sahnani o'zgartirsa, u
o'lchagich emas.

Yagona istisno — F4 dagi bitta satr, va u yorug'likka tegmaydi.

---

## Dalil

`npm run lab3d:olcham` ning to'liq chiqishi (20 qator), ketma-ket ikki
ishga tushirish, va supurish topgan eng yomon joyning koordinatasi.
Skrinshot kerak emas — asbobning o'zi dalil.
