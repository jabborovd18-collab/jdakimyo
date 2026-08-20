# BRIF-01 — Yorug'lik byudjeti va ekspozitsiya kalibrovkasi

**Qavat:** 0 · **Navbat: keyingi** · **Xavf:** o'rta (sahnaning ko'rinishi o'zgaradi)
**Oldingi ishlar:** BRIF-00 (`fe7c050`), BRIF-00B (`cb4cfa3`), BRIF-00C (`950543e`)

> Bu hujjat 2026-08-20 da **qaytadan yozildi**. Eski matn to'rt qatlamdan
> iborat bo'lib qolgan va o'zi bilan o'zi ziddiyatga kirgan edi: asosiy
> qismi "to'rt mavzu, mavzu almashganda" deyar, keyingi bo'limlar esa
> "pog'ona bo'yicha byudjet" der edi. 1-band.

---

## Bir jumlada

Sahna 13 ta chiroq bilan yoritilgan, ulardan 8 tasi three.js'dagi eng
qimmat turdan. Shu bitta sabab **ikkita** ko'rinadigan nuqsonni beradi:
ekran oq kuyadi va telefon cho'kadi.

---

## O'lchangan holat

### Chiroqlar — jami 13 ta, ikki faylda

| Joy | Tur | Soni |
|---|---|---|
| `useSahna.js:238` | `AmbientLight` | 1 |
| `useSahna.js:244` | `DirectionalLight` (asosiy) | 1 |
| `useSahna.js:269` | `DirectionalLight` (to'ldiruvchi) | 1 |
| `xona-modellari.js:256` | **`RectAreaLight`** — `trofferYlar` sikli | **8** |
| `xona-modellari.js:278` | `DirectionalLight` (`daylight`) | 1 |
| `xona-modellari.js:595` | `PointLight` (`ichkiChiroq`) | 1 |

Ustiga `scene.environment` — `RoomEnvironment` + PMREM
(`useSahna.js:215-219`).

**`RectAreaLight` nega qimmat:** u LTC (Linearly Transformed Cosines)
usulida ishlaydi va har piksel uchun, har chiroqdan **ikkitadan tekstura
o'qishi** kerak. Soyani qo'llab-quvvatlamaydi. Sakkiztasi mobil GPU
uchun ko'tarib bo'lmaydigan yuk.

### Nima o'lchandi

BRIF-00B asbobi bilan:

- `kunduz` mavzusi olib tashlanishidan oldin: `stol` nuqtasida kuygan
  piksel **89.53%**, o'rtacha luma **0.9831**.
- `tun` (hozirgi yagona ko'rinish): qat'iy nuqtalar `kuygan = 0.00`
  desa ham, 24 nuqtali supurish **7.33%** kuygan joyni topdi.
- Barcha o'lchovlarda `qora = 0` — ya'ni **soya tomonida hech narsa
  kesilmagan**. Muammo faqat yuqori uchida. Bu yaxshi xabar:
  ekspozitsiyani tushirish yo'qolgan tafsilotni qaytaradi.

### Nega bu hol yuzaga keldi

`three@0.170`. r165 dan beri `useLegacyLights` **olib tashlangan** —
fizik yorug'lik majburiy. Eski qo'llanmalardan olingan `intensity`
qiymatlari 3–5 barobar oshiq bo'ladi.

Va 19-avgustda bloom qo'shildi (`301db13`) — bloom aynan ortiqcha
yorqinlikni kuchaytiradi, ya'ni allaqachon yoritilgan sahnaga ustiga
qo'yildi.

---

## Vazifa

### 1. `lib/yoruglik.js` — yorug'likning yagona egasi

Hozir yorug'lik **ikki faylda** tug'iladi va ular bir-birini bilmaydi.
`useSahna.js` dagi izoh "maksimal 2 ta DirectionalLight" deydi —
aslida uchta, chunki uchinchisi boshqa faylda.

- Barcha `Light` yaratish `lib/yoruglik.js` ga ko'chadi.
- Imzo: `yoruglikniQur(scene, profil)`. **Mavzu argumenti yo'q** —
  sahna bitta ko'rinishga ega (BRIF-00C).
- `useSahna.js` va `xona-modellari.js` dan chiroq yaratish **butunlay**
  chiqadi. `xona-modellari.js` faqat panel *yuzasini* (mesh) yasaydi,
  uning nurini emas.
- `scene.environment` (IBL) ham shu faylning mas'uliyatida.

### 2. Byudjetni majburlash

`lib/sifat-profili.js` da `chiroqBudjeti` allaqachon bor va o'lchanadi:

| Profil | Budjet | Hozirgi holat |
|---|---|---|
| `telefon` | 3 | 13 — **buzilgan** |
| `desktop` | 8 | 13 — **buzilgan** |
| `ilova` | 16 | 13 — joyida |

BRIF-00C uni faqat **o'lchadi**. Endi **majburlash** kerak:
`yoruglikniQur` budjetdan oshib ketmasin.

Telefonda 8 ta `RectAreaLight` ni qanday almashtirish — sening
qaroring, lekin taklif: panel yuzasiga `emissive` material berib,
atrofni bitta yumshoq umumiy manba yoritsin. `emissive` fragment narxi
nolga teng.

**Yurishga tegma.** Uch pog'onada ham yurish qoladi — bu mahsulotning
o'zi, egasi buni aniq aytdi.

### 3. Ekspozitsiya kalibrovkasi — TAXMIN BILAN EMAS

`renderer.toneMappingExposure` hozir `1.05`.

Usul: qiymatni o'zgartir → `npm run lab3d:olcham` → jadvalga qara →
takrorla. Ko'z bilan emas, gistogramma bilan. Sen rasm ko'rmaysan va
bu ish uchun ko'rish shart emas — asbob shuning uchun qurilgan.

Boshlang'ich nuqta sifatida chiroq kuchlarini ham ko'rib chiq: 13 ta
manbani 3–8 ga tushirganingdan keyin ekspozitsiya boshqacha talab
qiladi. Avval **son**, keyin ekspozitsiya.

### 4. `MeshBasicMaterial` — 20 ta

| Fayl | Soni |
|---|---|
| `xona-modellari.js` | 13 |
| `jihoz-modellari.js` | 6 |
| `effektlar.js` | 1 |

`MeshBasicMaterial` yorug'likka **umuman bo'ysunmaydi** — doim to'liq
yorqinlikda turadi va bloom ostonasidan doim yuqori bo'ladi.

Eng ko'rinadigan qurboni — **rakovina**: jonli saytdagi skrinshotlarda
u atrofdagi yorug'likdan qat'i nazar bir tekis oq porlab turadi.

Har birini ko'rib chiq. Ba'zilari o'rinli (HUD sprite, effekt), lekin
xonaning qattiq sirtlari `MeshStandardMaterial` bo'lishi kerak.

### 5. `pikselNisbati` — telefonda 1.0

Profilda hozir `telefon: pikselNisbati 1.5`. Zamonaviy telefonda DPR 3;
1.5 da render qilish piksel sonini 2.25 barobar oshiradi.

`telefon` uchun `1.0` qilib, o'lchov bilan tasdiqla.

---

## Qabul mezonlari

Chegaralar `docs/3d-lab/OLCHOV.md` da nuqta bo'yicha yozilgan. Uch
profilning **har birida**, barcha nuqtalarda:

1. `chiroqBudjetiBuzildi = false` — **hamma qatorda**.
2. Kuygan piksel: `stol`/`xona`/`pol` da < 1%, `ship` da < 0.5%.
3. **Supurishning eng yomon nuqtasida kuygan < 2%.** Bu eng muhim
   mezon — qat'iy nuqtalar 7.33% ni o'tkazib yuborgan edi.
4. Qora piksel < 5%. Hozir 0 — yomonlashmasin.
5. O'rtacha luma nuqta oralig'ida (`OLCHOV.md`).
6. `shipPolFarq` < 0.5 (hozirgi holatda ~0.9).
7. Yorug'lik yaratish `lib/yoruglik.js` dan tashqarida qolmasin:
   `grep -rn "new THREE\..*Light(" app/laboratoriya/3d/` — natija
   faqat `lib/yoruglik.js` da.

---

## Tegilmaydi

- **Yurish rejimi** — uch pog'onada ham qoladi.
- Xona o'lchami va joylashuvi — BRIF-04.
- Yangi asset (`.glb`, HDRI, lightmap) — BRIF-02. Pishirilgan
  yorug'lik 0.6 da, bu brifda emas.
- Kimyo mantig'i, `lib/lab-*.js`, server yo'llari.
- O'lchov asbobining o'zi — u endi ishonchli, unga tegilmaydi.

Bloom hozircha **o'chiq** qolsin. U kalibrovkadan keyin, 3-qavatda
qayta yoqiladi.

Yo'l-yo'lakay nuqson ko'rsang — tuzatma, `YOL-XARITASI.md` ga yoz
(10-band).

---

## Dalil

1. `npm run lab3d:olcham` — **oldingi** to'liq jadval (uch profil).
2. Xuddi shu jadvalning **keyingi** holati.
3. Har mezon uchun raqam: qaysi qator qaysi chegaradan chiqqan edi va
   endi qayerda.
4. Chiroqlar ro'yxati: qaysi profilda nechta va nima turdagi.
5. `toneMappingExposure` ning oxirgi qiymati va unga qanday
   kelinganini qisqa izoh (nechta urinish, qaysi son nima berdi).

Skrinshot kerak emas — sonlar dalil (AGENTS.md 11.1). `.olcham/`
dagi PNG'lar odam ko'rigi uchun avtomatik saqlanadi.
