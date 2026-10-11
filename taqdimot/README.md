# Sirt hodisalari va adsorbsiya — premium slayd to'plami

Asl PPTX (18 slayd, to'q ko'k fon, bo'sh kartochkalar) **25 slaydli premium
taqdimotga** aylantirildi: uch mavzu uslubi, **Times New Roman** shrifti,
formulalar va grafiklar saqlangan, oltita yangi illyustratsiya qo'shilgan.

Sayt loyihasidan **mustaqil** papka: `npm`, Prisma va Next.js kerak emas.

---

## Tayyor natijalar (`chiqish/`)

| Fayl | Ko'rinish |
|---|---|
| `sirt-hodisalari-siyoh.pdf` | To'q fon, oltin urg'u — ma'ruza, himoya |
| `sirt-hodisalari-oq.pdf` | Oq fon, bordo urg'u — ilmiy jurnal, chop etish |
| `sirt-hodisalari-neon.pdf` | Binafsha gradient, moviy urg'u — konferensiya-zal |

Yordamchi fayllar:
- `umumiy-*.png` — butun taqdimot bitta varaqda (tez ko'rib chiqish)
- `mavzular-taqqos.png` — uchala mavzu yonma-yon (tanlash uchun)

Slaydlar **vektor PDF**: matn haqiqiy matn bo'lib qoladi (nusxa ko'chirish,
qidirish mumkin), formulalar piksellashtirilmaydi.

---

## Shrift: Times New Roman

`--shrift times` (sukut bo'yicha yoqilgan). Bu rejimda **Tinos** shrifti
ishlatiladi — u Times New Roman bilan **metrik mos** (Monotype metrikasi):
harf kengliklari va satr uzunligi bir xil, shu sababli matn Word'dagi
Times nusxasi bilan bir xil joylashadi. Tinos — ochiq litsenziya (Apache 2.0),
Times New Roman esa tijoriy; natija ko'zga farq qilmaydi.

```bash
python3 tools/render.py kontent/taqdimot.json -o chiqish/times.pdf --shrift times
python3 tools/render.py kontent/taqdimot.json -o chiqish/sans.pdf  --shrift zamonaviy
```

| Profil | Sarlavha | Matn | Nega |
|---|---|---|---|
| `times` | Tinos Bold | Tinos | Ilmiy ish, himoya, nashr talablari |
| `zamonaviy` | Manrope | Inter | Ekran, zamonaviy konferensiya |

Times torroq va x-balandligi kichikroq, shuning uchun profilda
`olcham-koeff: 1.10` bor — bir xil nuqtada u sans shriftdan kichikroq
ko'rinadi. Koeffitsiyent barcha o'lchamlarga birdek qo'llanadi.

---

## Ustma-ust tushish: asbob bilan tekshiriladi

Slaydda matn kesishishi **xato bermaydi**: PDF yasaladi, hatto 200 ham
qaytaradi — faqat proyektorda ko'rinadi. Shuning uchun bu ish o'lchovga
aylantirildi:

```bash
python3 tools/ustma-ust.py chiqish/sirt-hodisalari-neon.pdf
# ✅ sirt-hodisalari-neon.pdf: ustma-ust tushish yo'q
```

Asbob uch narsani tekshiradi:
1. **Matn ↔ matn** — har xil asos chizig'idagi belgilar kesishsa xato
2. **Rasm ↔ matn** — formula kartasi matnni bosib qolsa xato
3. Bir qatordagi qo'shni belgilar (masalan qiyshiq `/`) tabiiy tegiladi —
   ular hisobga olinmaydi

Ilgari topilgan va tuzatilgan nuqsonlar:

| Nuqson | Sabab | Yechim |
|---|---|---|
| Muqovada yorliq sarlavha ostida qolgan | Yorliqdan keyingi oraliq qat'iy 46pt edi, sarlavha 74pt | Oraliq sarlavha o'lchamidan hisoblanadi (`yorliqOraligi`) |
| Muqova izohi rasmni bosgan | Sarlavha kengligi foizda olinardi | Rasmning chap chegarasidan hisoblanadi |
| 11/21-slaydlarda matn kolontitulga tushgan | Times profili matnni 10% kattalashtirdi | Matn maydoni `PAST + 14` gacha; kichraytirish zanjiri kengaytirildi |
| Karta sarlavhani bosib ketgan | 4 ta uzun karta qat'iy balandlikka sig'magan | Balandlik mazmunga qarab; matn sig'masa shrift bir pog'ona kichrayadi |

---

## Illyustratsiyalar

Oltita yangi rasm (`kontent/rasmlar/gen-*.png`) qo'shildi:

| Rasm | Qaysi slaydda |
|---|---|
| Suv sirtidagi parda (suv qo'ng'izi) | Muqova — sirt tarangligi |
| Kapillyar ko'tarilish | 4-mavzu — Laplas va Kelvin |
| G'ovak adsorbent kesimi | 13-mavzu — adsorbentlar |
| Xromatografiya ustuni | 15-mavzu — xromatografiya |
| Enterosorbent | 16-mavzu — tibbiyot |
| Tozalash minorasi | 17-mavzu — sanoat |

Dvigatel rasm fonini **o'zi aniqlaydi**: oq fondagi formula/grafik oq
kartaga joylanadi, to'q fondagi illyustratsiya esa kartasiz — to'liq
qoplab, urg'u rangidagi ingichka kontur bilan chiziladi. Illyustratsiya
piksel darajasida kerakli nisbatga kesiladi (quti = karta), shuning uchun
qirqilgan rasm hech qaysi ko'rish dasturida ham, eksportda ham
kartadan tashqariga chiqmaydi.

---

## Nima o'zgardi (asl PPTX → yangi)

| Asl muammo | Yechim |
|---|---|
| Kartochkalar ichi bo'sh, pastda 60% bo'shliq | Har blok mazmunga qarab o'lchanadi, bo'sh joy teng taqsimlanadi |
| 17 slayd bir xil tuzilishda | 10 xil tur: muqova, reja, bo'lim, mavzu, kartochka, raqam, ikki ustun, sitata |
| Muqovada 24 ta punkt | Muqova (illyustratsiyali) + 2 ustunli «Ilmiy programma» |
| Bo'limlar ajratilmagan | 5 ta bo'lim ajratgichi (01–05) |
| Sarlavhalar 28pt | 36–86pt, uzunlikka qarab; ramkadan chiqmaydi |
| Formulalar matnga yopishgan | Oq «formula taxtasi» kartalarida, izohli |
| Grafiklar to'q fonda «teshik» | Soyalangan oq kartalar, ustunda tartiblangan |
| Imlo: dinagmik, gipofobik, tezgini, KOLLEID | Tuzatildi |

Mazmun **to'liq saqlandi**: 17 mavzu, 33 asl rasm (LaTeX + matplotlib),
barcha ta'riflar va qonunlar.

---

## Yasash

```bash
cd taqdimot
./ornat.sh                       # kutubxonalar + shriftlar (bir marta)

python3 tools/kontent-yasa.py    # kontent -> kontent/taqdimot.json (matn shu yerda)
python3 tools/render.py kontent/taqdimot.json -o chiqish/yangi.pdf --mavzu neon
python3 tools/ustma-ust.py chiqish/yangi.pdf          # joylashuvni tekshirish
python3 tools/preview.py chiqish/yangi.pdf --umumiy chiqish/umumiy.png
```

| Fayl | Nima uchun |
|---|---|
| `tools/theme.py` | Rang, shrift profillari, o'lcham — **yagona manba** |
| `tools/render.py` | JSON → PDF dvigateli (10 slayd turi) |
| `tools/fontlar.py` | Variable shriftdan og'irliklarni kesadi, Tinos/Noto nusxalaydi |
| `tools/ustma-ust.py` | Ustma-ust tushish va rasm↔matn to'qnashuvini topadi |
| `tools/preview.py` | PDF → PNG: sahifalar, umumiy varaq, taqqoslash |
| `tools/pptx-oqi.py` | PPTX mazmunini o'qish (manba bilan solishtirish) |
| `tools/kontent-yasa.py` | Kontentni yasaydi — **matn shu yerda tahrirlanadi** |
| `kontent/rasmlar/` | 33 asl + 6 yangi illyustratsiya |
| `manba/` | Asl PDF va PPTX |

---

## Dizayn tizimi

**Mavzular:** `siyoh`, `oq`, `neon` (`tools/theme.py` → `MAVZULAR`).
Yangi mavzu — bitta lug'at yozish kifoya.

**Shriftlar:** Manrope/Inter/Playfair (zamonaviy), Tinos (times),
Noto Sans Math (zaxira: ∠ ⇌ ≡ → ≈). Hammasi ochiq litsenziyada.

**Slayd turlari:** `muqova`, `reja`, `bolim`, `mavzu`, `kartochka`,
`matn`, `raqam`, `ikki`, `sitata`, `yakun`.

**Dvigatel o'zi bajaradigan qoidalar:**
- Sarlavha uzunligiga qarab o'lcham tanlanadi
- Karta va ustun balandligi mazmunga qarab hisoblanadi
- Matn sig'masa shrift pog'onali kichrayadi (kolontitulga tegmaydi)
- Yorliq va sarlavha orasidagi oraliq sarlavha o'lchamidan hisoblanadi
- Rasm foni to'qmi — o'zi aniqlaydi (karta chizish yoki chizmaslik)
- Shriftda yo'q belgi zaxira shriftdan olinadi; topilmasa — ogohlantiradi

---

## Bog'liqliklar

- Python: `reportlab`, `pypdfium2`, `pillow`, `fonttools`, `brotli` (`./ornat.sh`)
- Shriftlar: `fonts/` da (Google Fonts, SIL OFL / Apache 2.0)
- Tarmoq kerak emas — yasash butunlay mahalliy ishlaydi
