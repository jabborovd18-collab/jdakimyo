# Qolgan 4 ta fayl — bepul AI chatiga tashlanadigan matn

> Yig'ilgan kodda 4 ta fayl o'rniga qo'shni faylning nusxasi tushib qolgan.
> Quyidagi matnni bepul AI chatiga bitta xabar qilib tashlang.
> **Muhim:** yangi chatda avval `3D-LAB-PROMPT.md` ning 1–7-bo'limlarini
> tashlang (kontekst uchun), keyin shu matnni.

---

Loyihaning 3D laboratoriya bo'limi deyarli tayyor. To'rtta fayl yozilmay
qolgan — ularning o'rniga xato ravishda qo'shni faylning nusxasi tushib
qolgan. **Faqat shu to'rttasini yoz**, boshqa fayllarga tegma.

Cheklovlar avvalgidek: sof Three.js 0.170 (`@react-three/fiber` YO'Q),
TypeScript yo'q, yangi npm paket yo'q, matn va izohlar o'zbek tilida,
izoh "nega" ni tushuntiradi.

---

## FAYL A — `lib/materiallar.js`

Boshqa fayllar undan **aynan shu uchta nomni** import qiladi, boshqasini
emas:

```js
export function materiallarniYarat()          // → materiallar obyekti
export function materiallarniTozala(m)        // hammasini dispose()
export function suyuqlikYasa(rang, shaffoflik) // → yangi material
```

`materiallarniYarat()` qaytaradigan obyektda shu kalitlar bo'lsin:

- `shisha` — `MeshPhysicalMaterial`: `transparent: true, opacity: 0.25,
  roughness: 0.05, metalness: 0, transmission: 0.9, thickness: 0.4,
  ior: 1.5, side: THREE.DoubleSide`
- `shishaArzon` — `MeshStandardMaterial` `{ transparent: true,
  opacity: 0.3, roughness: 0.1 }`. Nega alohida: `transmission` mobil
  GPU da eng qimmat effektlardan biri, kuchsiz qurilmada shu ishlatiladi.
- `metall` — `MeshStandardMaterial` `{ roughness: 0.3, metalness: 0.85 }`
- `chinni` — oq, `roughness: 0.6`, `metalness: 0`
- `yogoch` — stol uchun, `RANGLAR.stol` rangida
- `alanga` — `MeshBasicMaterial`, to'q sariq, `transparent: true`

`suyuqlikYasa(rang, shaffoflik)` — har bir eritma uchun **yangi**
material qaytaradi (umumiy emas): rang idishdan idishga farq qiladi va
har kadrda o'zgarishi mumkin. `MeshStandardMaterial`,
`{ transparent: true, opacity: shaffoflik, roughness: 0.15 }`.

`materiallarniTozala(m)` — obyektdagi har bir materialning `dispose()`
ini chaqiradi, `suyuqlikYasa` bilan yaratilganlarni emas (ularni
chaqiruvchi o'zi tozalaydi).

`RANGLAR` ni `./sozlama.js` dan import qil.

---

## FAYL B — `lib/modda-korinishi.js`

Faqat bitta eksport:

```js
export function moddaKorinishi(kalit)
// → { rang: 0x38bdf8, holat: 'suyuq'|'qattiq'|'gaz', shaffoflik: 0.7 }
```

Ikki bosqichli, va **nega ikki bosqich kerakligi izohda yozilsin**:
bazada 242 ta modda bor, hammasiga qo'lda rang berish real emas, lekin
ko'p ishlatiladiganlari noto'g'ri rangda ko'rinsa o'quvchi noto'g'ri
narsa yodlab qoladi.

1. **Aniq jadval** — kamida shular: `H₂O` rangsiz, `NaOH` rangsiz,
   `HCl` rangsiz, `H₂SO₄` rangsiz, `NH₃` rangsiz, `CuSO₄` to'q ko'k,
   `Cu(OH)₂` och ko'k, `CuO` qora, `Cu` qizil-jigarrang,
   `KMnO₄` binafsha, `FeCl₃` sariq-jigarrang, `Fe(OH)₃` qizil-jigarrang,
   `Fe` kulrang, `K₂Cr₂O₇` to'q sariq, `NiSO₄` yashil, `CoCl₂` pushti,
   `I₂` binafsha-qora, `S` sariq, `C` qora, `AgCl` oq, `BaSO₄` oq,
   `CaCO₃` oq, `Zn` kulrang, `Al` kulrang.
2. **Taxmin** — jadvalda yo'q bo'lsa formuladan: tarkibida `Cu` →
   ko'k, `Fe` → sarg'ish-jigarrang, `Mn` → binafsha, `Cr` → yashil,
   `Ni` → yashil, `Co` → pushti, hech biri yo'q → rangsiz (`0xdbeafe`).

Holat: metall belgisi bilan boshlanib tarkibida `O`, `H`, `S` bo'lmasa
`qattiq`; `↑` yoki ma'lum gazlar (`O₂`, `H₂`, `CO₂`, `NH₃`, `Cl₂`,
`SO₂`, `N₂`) → `gaz`; qolgani `suyuq`.

Kalitlar Unicode pastki indeks bilan yoziladi: `H₂O`, `H2O` emas.
Diqqat: jadvalda topilmagan kalit uchun ham **har doim to'liq obyekt**
qaytar, hech qachon `undefined` emas — chaqiruvchi `.rang` ni to'g'ridan
o'qiydi.

---

## FAYL C — `hooks/useQuyish.js`

```js
export function useQuyish({ sahnaRef, holatRef, jurnalRef, onOzgarish })
// → { quyishBoshla, quyishToxtat, quyilmoqda, hajm }
```

Uzluksiz oqim — bo'limning eng muhim mexanikasi.

- `quyishBoshla(reagentKaliti, idishGroup)` — `requestAnimationFrame`
  siklini boshlaydi. Har kadrda:
  `holatRef.current = quy(holatRef.current, reagentKaliti, QUYISH.oqim * dt)`
- Har kadrda idishdagi suyuqlik sathi va rangi yangilanadi:
  `aralashmaRangi(holatRef.current)` → `suyuqlikSathiniYangila(idishGroup, jamiHajm(holat), rangObyekti)`
- `onOzgarish()` **har kadrda emas**, ~100 ms da bir marta chaqirilsin:
  React ni sekundiga 60 marta qayta chizdirish shart emas.
- Oqim ko'rinishi: ingichka `CylinderGeometry` shishadan idish og'zigacha
  (`idishGroup.userData.ogizBalandligi`), unmount va to'xtaganda
  `dispose()` qilinadi.
- `quyishToxtat()` — siklni to'xtatadi, oqim mesh'ini tozalaydi va
  jurnalga bitta yozuv qo'shadi:
  `yoz(jurnalRef.current, { amal: 'quyish', reagent, ml })` — quyilgan
  **jami** hajm bilan, har kadr uchun alohida emas.
- `useEffect` tozalash funksiyasida `cancelAnimationFrame` va oqim
  mesh'ining `dispose()` i bajariladi.

**Hech qanday chegara, ogohlantirish yoki avtomatik to'xtatish yo'q.**
Foydalanuvchi 150 ml quysa ham qabul qilinadi — bu ham natija.

Import qil: `quy`, `jamiHajm` (`../lib/idish-holati.js`),
`aralashmaRangi` (`../lib/rang-aralashtirish.js`),
`suyuqlikSathiniYangila` (`../lib/jihoz-modellari.js`),
`yoz` (`../lib/jurnal.js`), `QUYISH` (`../lib/sozlama.js`).

---

## FAYL D — `components/ReagentJavoni.jsx`

```jsx
export default function ReagentJavoni({ reagentlar = [], faol, onTanla, quyilgan = {} })
```

`"use client"` bilan boshlanadi.

- `reagentlar` — `[{ kalit, nom, soni, nodirlik }]`
- `faol` — hozir tanlangan reagent kaliti (satr yoki `null`)
- `onTanla(kalit)` — bosilganda chaqiriladi; **ikkinchi marta bosilsa
  tanlov bekor qilinadi** (`onTanla(null)`)
- `quyilgan` — `{ 'CuSO₄': { ml: 12.4, mol: 0.0062 } }`

Ko'rinishi:
- Yuqorida qidiruv maydoni (242 ta modda bor, ro'yxatdan qidirish qiyin)
- Har bir kartochka: chap tomonda rang doirasi
  (`moddaKorinishi(kalit).rang` dan, `#RRGGBB` ga aylantirilgan),
  formula, o'ngda `×soni`
- Idishga quyilgan bo'lsa yonida sariq rangda `12.4 ml`
- Tanlangani sariq ramkada (`border-yellow-400`)
- Nodirlik bo'yicha chap chegara rangi: oddiy — `slate`, kam — `green`,
  nodir — `blue`, noyob — `purple`
- **6 xildan ko'p quyilmaydi** (server chegarasi): `Object.keys(quyilgan).length >= 6`
  bo'lsa, quyilmagan reagentlar `opacity-40 pointer-events-none` bo'ladi
  va tepada sababi yoziladi: "Bir tajribada ko'pi bilan 6 xil reagent
  ishlatiladi". Bu yagona bloklanadigan joy — chunki uni serverning o'zi
  rad etadi.
- Ro'yxat bo'sh bo'lsa: "Reagent yo'q — do'kondan oling yoki sandiq
  oching" va `/laboratoriya` ga havola.

Dizayn: `bg-slate-900/60 border border-purple-800/50 rounded-2xl`,
matn oq / `text-purple-300`, ro'yxat `overflow-y-auto`.

`moddaKorinishi` ni `../lib/modda-korinishi.js` dan import qil.
