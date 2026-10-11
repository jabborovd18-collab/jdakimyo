# Sirt hodisalari va adsorbsiya — premium slayd to'plami

Asl PPTX (18 slayd, to'q ko'k fon, bo'sh kartochkalar) **25 slaydli premium
taqdimotga** aylantirildi: uch mavzu uslubi, formulalar va grafiklar
saqlangan, LPU/ilmiy ko'rinish uchun standart `siyoh` mavzusi.

Sayt loyihasidan **mustaqil** papka: `npm`, Prisma va Next.js kerak emas.

---

## Tayyor natijalar (`chiqish/`)

| Fayl | Ko'rinish | Qachon tanlanadi |
|---|---|---|
| `sirt-hodisalari-siyoh.pdf` | To'q fon, oltin urg'u | Ma'ruza, himoya, auditoriya |
| `sirt-hodisalari-oq.pdf` | Oq fon, bordo urg'u | Ilmiy jurnal uslubi, chop etish |
| `sirt-hodisalari-neon.pdf` | Binafsha gradient | Konferensiya-zal, zamonaviy |

Yordamchi fayllar:
- `umumiy-*.png` — butun taqdimot bitta varaqda (tez ko'rib chiqish)
- `mavzular-taqqos.png` — uchala mavzu yonma-yon (tanlash uchun)

Slaydlar **vektor PDF**: matn haqiqiy matn bo'lib qoladi (nusxa ko'chirish,
qidirish mumkin), formulalar esa piksellashtirilmaydi.

---

## Nima o'zgardi (asl → yangi)

| Asl PPTX muammosi | Yechim |
|---|---|
| Kartochkalar ichi bo'sh, matn tepada to'planib pastda 60% bo'sh | Har bir blok mazmunga qarab o'lchanadi, bo'sh joy teng taqsimlanadi |
| 17 ta bir xil tuzilishdagi slayd (zerikarli ritm) | 10 xil slayd turi: muqova, reja, bo'lim, mavzu, kartochka, raqam, ikki ustun, sitata |
| Muqovada faqat 24 ta punkt ro'yxati | Muqova + 2 ustunli «Ilmiy programma» slaydi |
| Bo'limlar ajratilmagan | 5 ta bo'lim ajratgichi (katta raqam, o'z ohangi) |
| Sarlavhalar 28pt — proyektorda o'qilmaydi | Uzunlikka qarab 36–86pt; ramkadan chiqmaydi |
| Formulalar matn ichida yopishgan | Oq «formula taxtasi» kartalarida, izohli |
| Grafiklar oq fonda to'q fonda «teshik» bo'lgan | Soya bilan ko'tarilgan oq kartalar, ustunda tartiblangan |
| Imlo: dinagmik, gipofobik, tezgini, KOLLEID | Tuzatildi: dinamik, gidrofob, tezligi, Kolloid |
| Indeksli belgilar sarlavhada yo'qolgan | Sarlavhalar sof matn; indekslar asosiy matnda (zaxira shrift bilan kafolatlanadi) |

Mazmun **to'liq saqlandi**: 17 mavzu, 33 rasm (laTeX formulalari va
matplotlib grafiklari), barcha ta'riflar va qonunlar.

---

## Yasash (qayta ishlab chiqarish)

```bash
cd taqdimot
./ornat.sh                                    # kutubxonalar + shriftlar (bir marta)

python3 tools/render.py kontent/taqdimot.json -o chiqish/yangi.pdf --mavzu siyoh
python3 tools/preview.py chiqish/yangi.pdf --umumiy chiqish/yangi-umumiy.png
```

| Fayl | Nima uchun |
|---|---|
| `tools/theme.py` | Rang, shrift, o'lcham — **yagona manba**. Mavzular shu yerda |
| `tools/render.py` | JSON → PDF dvigateli (10 slayd turi) |
| `tools/fontlar.py` | Variable shriftdan kerakli og'irliklarni kesib oladi |
| `tools/preview.py` | PDF → PNG: tekshirish varaqlari |
| `tools/pptx-oqi.py` | PPTX mazmunini o'qish (manba bilan solishtirish uchun) |
| `tools/kontent-yasa.py` | Kontentni yasaydi — **matn shu yerda tahrirlanadi** |
| `kontent/taqdimot.json` | Yasalgan kontent (render.py shuni o'qiydi) |
| `kontent/rasmlar/` | PPTX dan olingan 33 rasm |
| `manba/` | Asl PDF va PPTX (solishtirish uchun) |

> **Matnni tahrirlash:** `tools/kontent-yasa.py` dagi matnni o'zgartirib,
> `python3 tools/kontent-yasa.py` ni qayta ishga tushiring, keyin render
> qiling. Kontentni to'g'ridan-to'g'ri JSON'da ham tahrirlash mumkin.

---

## Dizayn tizimi

**Mavzular** (`tools/theme.py` → `MAVZULAR`): `siyoh`, `oq`, `neon`.
Yangi mavzu — bitta lug'at yozish kifoya, dvigatelga tegish shart emas.

**Shriftlar** (barchasi ochiq litsenziya, SIL OFL):

| Rol | Shrift | Nega |
|---|---|---|
| Sarlavha | Manrope | Geometrik, ekranda premium ohang |
| Asosiy matn | Inter | Kichik o'lchamda toza, raqamlari teng kenglikda |
| Urg'u (katta raqam, iqtibos) | Playfair Display | Serif — to'q fonda olijanob |
| Zaxira (belgi) | Noto Sans Math | ∠ ⇌ ≡ → ≈ — asosiy shriftlarda yo'q, kimyo matnida kerak |

**Slayd turlari:** `muqova`, `reja`, `bolim`, `mavzu`, `kartochka`, `matn`,
`raqam`, `ikki`, `sitata`, `yakun`.

**Dvigatel o'zi bajaradigan qoidalar:**
- Sarlavha uzunligiga qarab o'lcham tanlanadi — ramkadan chiqmaydi
- Karta va ustun balandligi mazmunga qarab hisoblanadi
- Matn sig'masa shrift bir pog'ona kichrayadi (kolontitulga tegmaydi)
- Bo'sh joy bloklar orasiga teng taqsimlanadi
- Pastdagi chiziq taqdimotning qancha qismi o'tganini ko'rsatadi
- Shriftda yo'q belgi zaxira shriftdan olinadi; topilmasa — ogohlantiradi

---

## Bog'liqliklar

- Python: `reportlab`, `pypdfium2`, `pillow`, `fonttools`, `brotli` (`./ornat.sh` o'rnatadi)
- Shriftlar: `fonts/` da (Google Fonts, SIL OFL)
- Tarmoq kerak emas — yasash butunlay mahalliy ishlaydi
