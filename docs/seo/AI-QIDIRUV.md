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

Yangi qatorni **ustiga emas, pastiga** qo'shing: jurnalning qiymati
o'zgarish tarixida.
