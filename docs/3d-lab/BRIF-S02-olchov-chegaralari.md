# BRIF-S02 — O'lchov chegaralari yagona manbaga

**Qavat:** 0 (asbob) · **Xavf:** past · **Rasm kerak emas**
**Hudud:** `scripts/`, `docs/3d-lab/OLCHOV.md`, `package.json` — boshqa
hech qayer

---

## Muammo

Chegara sonlari ikki joyda yozilgan va ular **mos emas** (AGENTS.md
1-band buzilgan). Bu `YOL-XARITASI.md` da 2-nuqson sifatida qayd
etilgan, lekin tuzatilmagan:

| Nuqta | `docs/3d-lab/OLCHOV.md` jadvali | `scripts/lab3d-olcham.js:61` |
|---|---|---|
| `stol` | ortacha 0.28–0.42, p95 0.65–0.85 | ortacha 0.18–0.45, p95 **tekshirilmaydi** |
| `xona` | ortacha 0.28–0.42, p95 0.55–0.85 | ortacha 0.18–0.45, p95 **tekshirilmaydi** |
| `pol` | ortacha 0.22–0.45, p95 0.50–0.85 | ortacha 0.15–0.50, p95 **tekshirilmaydi** |

Ya'ni hujjatni o'qigan odam "sahna chegarada" deb o'ylaydi, asbob esa
boshqa sonlar bo'yicha baho beradi. Qaysi biri haqiqat ekani
hujjatdan bilinmaydi.

## Qaror — bu bahs emas, u allaqachon hal qilingan

Ikkala son ham to'g'ri, lekin **rollari har xil**. Buni `OLCHOV.md`
ning "DIQQAT — bu jadval 1-QAVATNING maqsadi" bo'limi allaqachon
tushuntiradi:

- **MAJBURIY (darvoza).** Hozir skriptda turgan keng oraliqlar +
  `kuygan`, `qora`, `sweep`, `yorliqToqnashuvi`. Bular 0-qavatning
  kuyish qorovuli va ular bajarilgan.
- **MAQSAD (kuzatuv).** `OLCHOV.md` jadvalidagi tor oraliqlar va `p95`.
  Ular BRIF-04 (soya), 0.6 (pishirilgan GI) va 1-qavat (PBR
  materiallar) dan keyin o'lchanadi.

**Sonlar o'zgartirilmaydi — faqat ko'chiriladi va rollari yoziladi.**
Yangi son o'ylab topish bu brifning vazifasi EMAS.

---

## Vazifa

### 1. `scripts/lab3d-chegaralar.js` — yagona manba (CJS)

Ichida:

- `MAJBURIY` — nuqta bo'yicha `{ ortacha: [min, maks] | null, kuygan,
  qora: son | null }` va `yorliqToqnashuvi > 0` qoidasi. Qiymatlar
  `lab3d-olcham.js` dagi hozirgi `CHEGARALAR` dan **aynan** ko'chiriladi.
- `MAQSAD` — `OLCHOV.md` jadvalidagi tor `ortacha` va `p95` oraliqlari.
- `bahola(qator)` — **sof funksiya**, hech nima chop etmaydi:
  `{ majburiy: [sabab...], maqsad: [sabab...] }`. Bo'sh massiv = o'tdi.
- `jadvalMatni()` — ikkala darajani matn jadval qilib qaytaradi.
- `if (require.main === module)` bo'lsa jadvalni chop etadi.

### 2. `lab3d-olcham.js` moduldan foydalanadi

- O'zidagi `CHEGARALAR` va `chegaradanChiqdimi` **o'chiriladi**,
  o'rniga `require("./lab3d-chegaralar.js")`.
- **Exit kodi mantig'i o'zgarmaydi:** faqat `majburiy` bo'sh bo'lmasa
  yiqiladi.
- `maqsad` sabablari jadval tagida `MAQSAD (1-qavat, kuzatuv):` deb
  chiqadi va **exit kodga ta'sir qilmaydi**.
- `--json` chiqishining maydonlari **o'zgarmaydi** — o'lchov tarixi
  shu shakl bo'yicha taqqoslanadi.

### 3. `scripts/lab3d-chegara-sinov.js` — sinov

Qat'iy yozilgan qatorlar bilan `bahola()` ni tekshiradi, xato bo'lsa
`exit 1`. Kamida shu 8 holat:

1. `stol` — hamma chegarada, ikkala daraja ham bo'sh.
2. `stol` — `kuygan` chegaradan yuqori → `majburiy` bo'sh emas.
3. `stol` — `ortacha` **0.44**: MAJBURIY oralig'i (0.18–0.45) ichida,
   MAQSAD oralig'idan (0.28–0.42) tashqarida. Ya'ni `majburiy` bo'sh,
   `maqsad` bo'sh emas. Bu holat butun brifning mohiyati: MAQSAD
   buzilishi darvozani yiqitmaydi.
4. `ship` — `qora` 40%: `qora: null` bo'lgani uchun sabab yo'q.
5. `sweep` — `kuygan` 1.5%: o'tadi (chegara 2), `ortacha` umuman
   tekshirilmaydi.
6. `sweep` — `kuygan` 2.5%: yiqiladi.
7. `pol` — `yorliqToqnashuvi = 2` → `majburiy` bo'sh emas.
8. Noma'lum nuqta (`nuqta: "yoq"`) → aniq xato sababi.

### 4. `package.json`

```
"lab3d:chegaralar": "node scripts/lab3d-chegaralar.js",
"lab3d:chegara-sinov": "node scripts/lab3d-chegara-sinov.js"
```

### 5. `docs/3d-lab/OLCHOV.md`

"Har nuqta uchun chegaralar" jadvali **o'chiriladi** va o'rniga manba
fayl nomi hamda `npm run lab3d:chegaralar` buyrug'i yoziladi.
"DIQQAT — bu jadval 1-QAVATNING maqsadi" bo'limi **qoladi**: u sabab,
jadval emas.

---

## Qabul mezonlari

1. Chegara soni butun repoda **bitta** faylda:
   `grep -rn "0\.28\|0\.42\|0\.18\|0\.45\|0\.65" scripts docs/3d-lab/OLCHOV.md`
   faqat `lab3d-chegaralar.js` ni ko'rsatsin.
2. `node scripts/lab3d-chegara-sinov.js` → exit 0, 8 holat ham bor.
3. MAQSAD buzilishi exit kodni o'zgartirmasligi sinovda **ko'rsatilgan**
   (3-holat).
4. `--json` chiqishining maydon ro'yxati o'zgarmagan.
5. `git diff --name-only origin/main` — faqat `scripts/`,
   `docs/3d-lab/OLCHOV.md`, `package.json`. **`app/` va `lib/` da bitta
   ham fayl o'zgarmasin** (o'sha papkalarda boshqa agent ishlayapti —
   tegsang ishi yo'qoladi).
6. Yangi fayllar 300 qatordan oshmasin; izohlar o'zbekcha va **nega**
   ni yozsin (AGENTS.md 0-band).

## Tegilmaydi

O'lchov mexanikasi, `app/laboratoriya/3d/olcham/` sahifasi, Playwright
qismi, chegara **sonlarining o'zi**. Yo'l-yo'lakay nuqson ko'rsang —
tuzatma, hisobotingda ayt (AGENTS.md 10-band).

## Sening imkoniyating — buni oldindan bil

Senda GPU ham, dev server ham yo'q; `npm run lab3d:olcham` ni ishga
tushira olmaysan va bu **talab qilinmaydi**. Aynan shuning uchun butun
tekshiruv sof funksiya sinoviga o'ralgan — u brauzersiz ishlaydi.

`node scripts/lab3d-chegara-sinov.js` va `node -c` darajasidagi
tekshiruvlarni o'zing ishga tushir, natijasini hisobotga qo'y.

## Dalil (hisobotga kirishi shart)

- `node scripts/lab3d-chegara-sinov.js` to'liq chiqishi;
- `npm run lab3d:chegaralar` jadvali;
- `git diff --name-only origin/main` ro'yxati.

## Ish oqimi

Shox: `arena/olchov-chegaralari`, `origin/main` dan ochiladi.
Ishingni shoxga **commit va push bilan TUGAT**. `main` ga merge qilma,
PR ni o'zing tasdiqlama, deploy qilma — bu qadamlar sendan
kutilmaydi va bloklangan. Push qilganingdan keyin to'xta va nima
qilganingni hisobot qil.
