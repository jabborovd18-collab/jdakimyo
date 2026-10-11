# Sirt hodisalari va adsorbsiya — premium slayd to'plami

Asl PPTX (18 slayd, to'q ko'k fon, bo'sh kartochkalar) **25 slaydli premium
taqdimotga** aylantirildi: uch mavzu uslubi, **Times New Roman** shrifti,
formulalar va grafiklar saqlangan, oltita yangi illyustratsiya qo'shilgan.

Sayt loyihasidan **mustaqil** papka: Next.js, Prisma va bazasi kerak emas.
PDF tomoni sof Python; PPTX tomoni esa bitta Node kutubxonasi
(`pptxgenjs`) bilan ishlaydi.

---

## Tayyor natijalar (`chiqish/`)

| Fayl | Ko'rinish |
|---|---|
| `sirt-hodisalari-siyoh.pdf` | To'q fon, oltin urg'u — ma'ruza, himoya |
| `sirt-hodisalari-oq.pdf` | Oq fon, bordo urg'u — ilmiy jurnal, chop etish |
| `sirt-hodisalari-neon.pdf` | Binafsha gradient, moviy urg'u — konferensiya-zal |

**Tahrirlanadigan PPTX** (`sirt-hodisalari-{siyoh,oq,neon}.pptx`) — xuddi shu
dizayn, lekin PowerPoint'da tahrirlash mumkin: matn, rasm va shakllar alohida
obyektlar. Mazmunni qo'lda tuzatish kerak bo'lganda shu nusxa olinadi.
Shrift profili, illyustratsiyalar va ranglar PDF bilan **bir manbadan**
(`tools/theme.py`, `kontent/taqdimot.json`) olinadi.

Yordamchi fayllar:
- `umumiy-*.png` — butun taqdimot bitta varaqda (tez ko'rib chiqish)
- `mavzular-taqqos.png` — uchala mavzu yonma-yon (tanlash uchun)
- `pptx-varaq-{siyoh,oq,neon}.png` — PPTX ning sxematik ko'rinishi
  (PowerPoint'siz ko'z bilan tekshirish uchun)
- `fonlar/fon-*.png` — PPTX ga qo'yiladigan gradient fonlar (PDF dvigateli
  yasaydi, shuning uchun ikki nusxadagi fon bir xil)

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
python3 tools/render.py kontent/taqdimot.json -o chiqish/yangi.pdf --mavzu neon --shrift times
python3 tools/ustma-ust.py chiqish/yangi.pdf          # joylashuvni tekshirish
python3 tools/preview.py chiqish/yangi.pdf --umumiy chiqish/umumiy.png

python3 tools/pptx-rasm.py                             # kichraytirilgan rasmlar
node tools/pptx-yasa.mjs --mavzu neon --shrift times  # tahrirlanadigan nusxa
python3 tools/pptx-tekshir.py chiqish/sirt-hodisalari-neon.pptx --kontent kontent/taqdimot.json
```

| Fayl | Nima uchun |
|---|---|
| `tools/theme.py` | Rang, shrift profillari, o'lcham — **yagona manba** |
| `tools/render.py` | JSON → PDF dvigateli (10 slayd turi) |
| `tools/fontlar.py` | Variable shriftdan og'irliklarni kesadi, Tinos/Noto nusxalaydi |
| `tools/ustma-ust.py` | Ustma-ust tushish va rasm↔matn to'qnashuvini topadi |
| `tools/preview.py` | PDF → PNG: sahifalar, umumiy varaq, taqqoslash |
| `tools/pptx-yasa.mjs` | JSON → tahrirlanadigan PPTX (pptxgenjs, Node) |
| `tools/pptx-tekshir.py` | PPTX geometriyasini o'lchaydi (chegara, ustma-ust, bosish) |
| `tools/pptx-korinish.py` | PPTX → sxematik varaq rasm |
| `tools/pptx-fon.py` | PPTX uchun gradient fon rasmi (PDF dvigatelidan) |
| `tools/rasm-fon.py` | Rasm fonining to'qligini o'lchaydi (`kontent/rasm-fon.json`) |
| `tools/pptx-rasm.py` | PPTX uchun rasm nusxalarini kichraytiradi (hajm uchun) |
| `tools/pptx-oqi.py` | PPTX mazmunini o'qish (manba bilan solishtirish) |
| `tools/kontent-yasa.py` | Kontentni yasaydi — **matn shu yerda tahrirlanadi** |
| `kontent/rasmlar/` | 33 asl + 6 yangi illyustratsiya |
| `manba/` | Asl PDF va PPTX |

---

## PPTX (tahrirlanadigan nusxa)

```bash
npm run pptx -- --mavzu neon --shrift times      # tayyorlash
npm run pptx -- --mavzu oq                       # shrift: sukut (times)

python3 tools/pptx-tekshir.py chiqish/sirt-hodisalari-neon.pptx \
    --kontent kontent/taqdimot.json              # geometriya o'lchovi
python3 tools/pptx-korinish.py chiqish/sirt-hodisalari-neon.pptx \
    --varaq chiqish/varaq.png                    # 25 slayd bitta rasmda
```

**Bir manba, ikki chiqish.** Rang va shrift faqat `tools/theme.py` da yoziladi;
`tools/theme-chiqar.py` uni `kontent/theme.json` ga chiqaradi va Node tomoni
shundan o'qiydi. `--shrift times` da PPTX **Times New Roman** oilasini
ishlatadi (PowerPoint'da o'rnatilgan bo'ladi; yetishmagan ⇌ ∠ belgisini
PowerPoint o'zi zaxira shriftdan oladi), o'lchamlar esa PDF dagi kabi 1,10
koeffitsiyent bilan kattalashtiriladi. Shu tufayli ikki nusxa bir xil
ko'rinadi.

**Illyustratsiyalar.** Muqovadagi va mavzu slaydlaridagi rasmlar PPTX'ga ham
tushadi. To'q fonli illyustratsiya oq karta ichiga solinmaydi: u rasm
qutisining ichida `cover` rejimida kesiladi (PDF dagi piksel kesish bilan bir
xil natija). Rasmning fon to'qligini Node o'zi o'lchay olmaydi — shuning
uchun `tools/rasm-fon.py` buni bir marta o'lchab, `kontent/rasm-fon.json` ga
yozadi.

**Hajm.** Illyustratsiyalar 1408×768 va ~2 MB (PNG) — PPTX ularni ichiga
olsa fayl 16 MB bo'lardi. `tools/pptx-rasm.py` slaydda ko'rinadigan
o'lchamdan kattaroq rasmlarni kichraytirib (JPEG, sifat 88)
`chiqish/rasm-kichik/` ga yozadi va PPTX ularni ishlatadi: fayl **~4 MB**,
slaydda ko'zga farq yo'q. Nusxa bo'lmasa asl rasm ishlatiladi.

**Nega ikki xil tekshiruv.** PowerPoint bu muhitda yo'q, shuning uchun PPTX
ko'z bilan ko'rilmaydi. `pptx-tekshir.py` slayd XML'idagi haqiqiy
koordinatalarni o'lchaydi va uch turdagi nuqsonni topadi: shakl slayd
chegarasidan chiqib ketishi, matn qutilarining ustma-ust tushishi, matnning
shakl yoki rasmni bosishi. `pptx-korinish.py` esa shu koordinatalardan
sxematik rasm chizadi — joylashuvni ko'z bilan chamalash uchun; matn o'rashi
taxminiy, shuning uchun u faqat geometriya mezoni.

Uchala mavzu uchun javob: **25 slayd, 0 nuqson**.

---

## Dizayn tizimi

**Mavzular:** `siyoh`, `oq`, `neon` (`tools/theme.py` → `MAVZULAR`).
Yangi mavzu — bitta lug'at yozish kifoya.

**Shriftlar:** Manrope/Inter/Playfair (zamonaviy), Tinos (times),
Noto Sans Math (zaxira: ∠ ⇌ ≡ → ≈). Hammasi ochiq litsenziyada.
PPTX tomonida "times" profili `Times New Roman` nomini ishlatadi —
foydalanuvchi so'ragan shriftning o'zi.

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
