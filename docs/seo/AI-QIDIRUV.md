# AI qidiruvida ko'rinish — jurnal va tekshiruv ro'yxati

Bu hujjat ChatGPT Search, Perplexity va Google AI Overviews kabi
tizimlarda JDA KIMYO qanday ko'rinayotganini KUZATISH uchun. Bu yerda
sayt haqidagi faktlar YOZILMAYDI — ular `lib/sayt-malumot.js` va
`lib/ilmiy-hajm.json` da. Bu yerda faqat o'lchov natijalari turadi.

## Nima uchun bu ish qilinadi

Sun'iy intellekt qidiruvi javob berishdan oldin savolga mos manbani
topadi va undan **fakt ko'chiradi**. Ya'ni saytdan ikki narsa talab
qilinadi:

1. **Robot kira olsin** — `robots.txt`, `sitemap.xml`, 200 javob.
2. **Fakt topilsin** — "JDA KIMYO nima?" degan savolga bir jumlada
   javob beradigan sahifa, aniq sonlar va sana bilan.

Ikkinchisi og'irroq: sahifa chiroyli bo'lsa ham, javob matni faqat
tugma bosilganda paydo bo'lsa, robot uni ko'rmaydi.

## Bajarilgan ish (2026-08-22)

| Qadam | Holat | Qayerda |
|---|---|---|
| AI robotlari uchun ruxsat | bajarildi | `app/robots.js` |
| Sitemap | ishlayapti | `app/sitemap.js` |
| "JDA KIMYO nima?" sahifasi | yaratildi | `/jda-kimyo` |
| Organization + Person + WebSite schema | bajarildi | `lib/tuzilgan-malumot.js` |
| FAQPage + BreadcrumbList schema | bajarildi | `/jda-kimyo`, `/ishlashi` |
| FAQ javoblari HTML ichida | tuzatildi | `<details>` ga o'tkazildi |
| Canonical | 121 sahifada | `alternates.canonical` |
| Rasmiy hisoblar (`sameAs`) | e'lon qilindi | `lib/sayt-malumot.js` |

### Tuzatilgan nuqson

`/ishlashi` sahifasidagi savol-javoblar akkordeon ichida edi va javob
matni **serverdan kelgan HTML da umuman yo'q edi** — ya'ni to'qqizta
javobning bittasini ham na Google, na ChatGPT ko'rgan. Endi ular
`<details>` bilan chiziladi: matn hujjatda doim turadi.

Tekshirish usuli (sahifa o'zgargandan keyin takrorlanadi):

```bash
curl -s -A "OAI-SearchBot/1.0" https://www.jdakimyo.uz/ishlashi | grep -c "Sertifikatni JDA KIMYO"
```

`0` chiqsa — javob robotga ko'rinmayapti.

## Hali bajarilmagan (kod bilan hal bo'lmaydi)

- Google Search Console: `/jda-kimyo` ni URL Inspection orqali indeksga
  yuborish.
- Tashqi manbalar: YouTube, Telegram kanal, ta'lim bloglari. AI qidiruvi
  saytning o'z da'vosidan ko'ra **mustaqil manbadagi** eslatishga
  ko'proq ishonadi.
- Reddit / YouTube / Pinterest rasmiy hisoblari ochilgach ular
  `RASMIY_HISOBLAR` ga qo'shiladi (`lib/sayt-malumot.js`) — ochilmasidan
  oldin emas.

## Keyingi bosqich — tashqi manbalar yo'l xaritasi

Egasi bilan kelishildi (2026-08-22): avval Google indeksi tartibga
solinadi, keyin quyidagilar birga qilinadi. Tartib foydaga qarab:

| # | Manba | Nega aynan shu | Holat |
|---|---|---|---|
| 1 | Bing Webmaster + IndexNow | ChatGPT Search Bing indeksiga ham suyanadi; yangi sahifa soatlarda tushadi | IndexNow tayyor (`npm run indexnow`), Bing hisobi egasida |
| 2 | YouTube | subtitr matni indekslanadi, AI iqtibos oladi | kanal ochildi: @jdakimyouz |
| 3 | Wikidata | entity'ning o'zi — "bu nima" savoliga javob shu yerdan olinadi | navbatda |
| 4 | Reddit | ChatGPT ham, Google ham katta vazn beradi; qoidalar qattiq, sekin ish | navbatda |
| 5 | GitHub | ochiq repo README indekslanadi | bajarildi: uzbek-kimyo-lugat |
| 6 | Quora / Medium / Telegraph | savol-javob shakli AI uchun qulay format | navbatda |
| 7 | Instagram, Pinterest | AI qidiruvi uchun kuchsiz, lekin entity nomini mustahkamlaydi | hisob ochilyapti |

Har bir hisob ochilganda ikki ish qilinadi:
1. Havolasi `RASMIY_HISOBLAR` ga qo'shiladi (`lib/sayt-malumot.js`) —
   shundagina schema'da "bu hisob ham JDA KIMYO" degan da'vo paydo
   bo'ladi.
2. Profil tavsifiga `TARIF` dagi AYNAN o'sha jumla yoziladi. Har joyda
   boshqacha yozilgan ta'rif AI uchun ikki xil narsa bo'lib ko'rinadi.

## IndexNow

`npm run indexnow` — jonli sitemapdagi manzillarni Bing va Yandex
indeksiga xabar qiladi. Faqat o'zgargan manzillar uchun ham ishlaydi:

```bash
node scripts/indexnow.js /jda-kimyo /ishlashi
```

Kalit `public/<kalit>.txt` da; fayl nomi kalitning o'zi va ichida ham
xuddi shu satr turadi. Skript kalitni fayl nomidan o'qiydi — kod ichida
takrorlanmaydi. Fayl o'chsa yoki ichi mos kelmasa, skript ishlamaydi va
sababini aytadi.

Google IndexNow'ni qo'llamaydi — u yerda Search Console'dagi
"Запросить индексирование" qoladi (kuniga ~10 ta).

## Sinov so'rovlari

Har safar bir xil so'rovlar, turli hisoblarda va turli kunlarda:

1. JDA KIMYO nima?
2. O'zbek tilidagi oliy kimyo platformalari qaysilar?
3. O'zbekistonda kimyo o'rganish uchun onlayn platformalar bormi?
4. O'zbek tilida koordinatsion kimyoni qayerdan o'rganish mumkin?
5. Koordinatsion kimyo uchun yaxshi o'zbekcha resurslar
6. JDA KIMYO haqida ma'lumot ber

## Jurnal

Har o'lchovda: chiqdimi, qaysi URL ko'rsatildi, qaysi fakt keltirildi,
xato bo'lsa qanday xato.

| Sana | So'rov | ChatGPT | Gemini | Google | Ko'rsatilgan URL | Izoh |
|---|---|---|---|---|---|---|
| 2026-08-22 | — | — | — | — | — | O'zgarishlar hali deploy qilinmagan; birinchi o'lchov deploydan 1–2 hafta keyin ma'noli bo'ladi |

## Bajarilgan qadamlar jurnali

| Sana | Ish | Natija |
|---|---|---|
| 2026-08-22 | `/jda-kimyo`, schema, FAQ `<details>`, canonical 121 sahifada | deploy qilindi, jonli tekshirildi |
| 2026-08-22 | Search Console eksporti tahlil qilindi | 37 indeks / 101 "topilgan, indekslanmagan" |
| 2026-08-23 | `*.vercel.app` → `X-Robots-Tag: noindex` | uchinchi nusxa kraul byudjetini yeyishdan to'xtadi |
| 2026-08-23 | sitemap `lastmod` git tarixidan | yolg'on "hozir o'zgardi" signali olib tashlandi |
| 2026-08-23 | apex 307 → **308** (Vercel, egasi qildi) | bitta qadamli doimiy yo'naltirish |
| 2026-08-23 | Search Console: 10 ta asosiy manzil qo'lda navbatga qo'yildi | egasi qildi |
| 2026-08-23 | IndexNow: 129 manzil yuborildi | `202 Accepted`, kalit tasdiqlandi (200) |
| 2026-08-23 | Bing: sitemap yuborildi + 100 manzil qo'lda | Success, 129 URL topildi |
| 2026-08-23 | YouTube kanali ochildi va `sameAs` ga qo'shildi | youtube.com/@jdakimyouz |
| 2026-08-23 | Yaratuvchining LinkedIn profili `sameAs` ga qo'shildi | linkedin.com/in/diyorbek-arslonivich |
| 2026-08-23 | Ochiq lug'at GitHub'da e'lon qilindi | uzbek-kimyo-lugat, 242+34+22+39 yozuv |

Yangi qatorni **ustiga emas, pastiga** qo'shing: jurnalning qiymati
o'zgarish tarixida.
