# BRIF-01B — Sahna xira ko'rinadi

**Qavat:** 0 · **Navbat: keyingi** · **Xavf:** past (bir necha son)
**Oldingi ish:** BRIF-01 (`6a33aa3`) — qabul qilindi, kuyish yo'qoldi

---

## Muammo

Egasi jonli saytda ko'rdi: **"sal xiralashgan"**. Telefon endi
qotmaydi, oq kuyish yo'q — lekin sahna zerikarli va tumanli tuyuladi.

## Sabab — sahna IKKI marta pasaytirildi

BRIF-01 da:

1. Chiroq soni 13 → 8 (desktop), 13 → 3 (telefon)
2. `TONE_MAPPING_EKSPOZITSIYA` 1.05 → **0.87**

Kuyish **chiroq sonidan** kelib chiqqan edi. U tuzalgandan keyin
ekspozitsiyani ham tushirishning keragi yo'q edi — ikkalasi ustma-ust
tushdi.

## Va mening mezonim buni rag'batlantirdi

`kuygan < 1%` deb yozgandim. Arena uni **0%** ga olib chiqdi — ya'ni
mezondan ham qat'iyroq bajardi.

Lekin **yorug' sahnada bir oz kuygan piksel BO'LISHI KERAK**: shishadagi
aks, metall yaltirashi, panel yuzasi, kran. Gistogrammaning yuqori
o'ndaligida hech narsa bo'lmasa, tasvir aynan "xira" bo'lib ko'rinadi.
Bu fotografiyaning eski qoidasi — oq nuqtasi yo'q surat yuvilgan
ko'rinadi.

`ortacha` oralig'i ham juda keng edi (0.18–0.45). Pastki uchida turish
texnik jihatdan "o'tdi", vizual jihatdan xira.

---

## Vazifa

### 1. Ekspozitsiyani qaytar

`TONE_MAPPING_EKSPOZITSIYA` ni 0.87 dan ko'tar. Boshlang'ich taxmin
~1.0–1.1, lekin **o'lchov aytadi**, taxmin emas.

Chiroq kuchlarini ham ko'rib chiq (`muhit` 0.9, `asosiy` 1.4,
`toldiruvchi` 0.6). Ekspozitsiya bilan chiroq kuchi bir xil natijaga
ikki yo'ldan boradi — qaysi biri tabiiyroq ko'rinsa, shuni tanla va
sababini yoz.

### 2. `toldiruvchi` chirog'ining rangi

`0xa78bfa` — binafsha. Jonli saytdagi skrinshotda pol o'ng tomonida
siyohrang dog' beryapti va u sun'iy ko'rinadi.

Neytral yoki biroz salqin oq rangga o'zgartir (masalan `0xdbeafe`
atrofida). Bu badiiy qaror — variant tanlab, sababini yoz.

### 3. `OLCHOV.md` chegaralarini toraytir

Hozirgi chegaralar xira sahnani o'tkazib yuboradi. Yangilari:

| Nuqta | `ortacha` | `kuygan` | `p95` | `qora` |
|---|---:|---:|---:|---:|
| `stol` | **0.28–0.42** | **0.05–1%** | **0.65–0.85** | < 5% |
| `xona` | **0.28–0.42** | **0.05–1%** | **0.65–0.85** | < 5% |
| `pol` | 0.22–0.45 | 0.02–1% | 0.55–0.85 | < 5% |
| `ship` | 0.03–0.25 | < 0.5% | qo'llanmaydi | qo'llanmaydi |
| `sweep` | qo'llanmaydi | **< 2%** | qo'llanmaydi | qo'llanmaydi |

Ikkita yangilik:

- **`kuygan` ning PASTKI chegarasi bor.** 0% endi muvaffaqiyat emas,
  nuqson. Sahnada yorqin nuqta bo'lishi kerak.
- **`p95` chegara sifatida qo'shildi.** U "xiralik" ni to'g'ridan-to'g'ri
  o'lchaydi: kadrning eng yorqin 5% i qayerda turibdi. Past `p95` =
  yuvilgan tasvir. Asbob uni allaqachon hisoblaydi, faqat chegara
  yo'q edi.

`sweep < 2%` **o'zgarmaydi** — supurish hamon kuyishning qorovuli.

---

## Qabul mezonlari

1. Uch profil × barcha nuqtalarda yangi chegaralar bajarilsin.
2. `kuygan` hech bir `stol`/`xona` qatorida **0.00 bo'lmasin**.
3. `sweep` eng yomon nuqtasida `kuygan < 2%` — saqlanadi.
4. `chiroqBudjetiBuzildi = false` — saqlanadi.
5. `qora < 5%` — saqlanadi (hozir 0.7%, yomonlashmasin).
6. Telefon profilida ham chegaralar bajarilsin. Telefonda 3 ta chiroq
   bor, shuning uchun u ekspozitsiyaga ko'proq tayanadi — alohida
   tekshir.

---

## Tegilmaydi

- Chiroq **soni** va byudjet — BRIF-01 da hal qilindi, saqlanadi.
- Soya, SSAO, materiallar, geometriya, deraza, ship — bular
  boshqa qatlamlar (BRIF-04, 1-qavat, 0.6).
- Yurish rejimi.
- O'lchov asbobining o'zi — faqat `OLCHOV.md` dagi chegara jadvali.

Egasi yana to'rtta narsani sanadi (soya yo'qligi, yassi yoritish, qora
ship, tekis derazalar). **Ular bu brifda emas** — ular material va soya
qatlamiga tegishli va rejada o'z o'rni bor. Bu brif faqat **xiralikni**
tuzatadi.

---

## Dalil

1. `npm run lab3d:olcham` — oldingi va keyingi jadval, uch profil.
2. Har qatorda `ortacha`, `kuygan`, `p95` yangi chegaraga nisbatan.
3. `TONE_MAPPING_EKSPOZITSIYA` ning oxirgi qiymati va unga qanday
   kelinganini qisqa izoh: nechta urinish, qaysi son nima berdi.
4. `toldiruvchi` uchun tanlangan rang va sababi.
