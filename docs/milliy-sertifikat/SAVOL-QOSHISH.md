# Savol qo'shish

Faqat bitta ish kerak: savollarni sinovning faylga yozish. Sinov to'liq bo'lganda
o'zi ochiladi, kodga tegish shart emas.

| Sinov | Fayl | Savol soni |
|---|---|---:|
| Rasch diagnostika | `data/milliy-sertifikat/savollar/rasch-diagnostika.js` | 30 |
| Tayyorgarlik #1 | `data/milliy-sertifikat/savollar/milliy-sertifikat-simulyator.js` | 40 |
| Tayyorgarlik #2 | `data/milliy-sertifikat/savollar/milliy-sertifikat-simulyator-2.js` | 40 |
| Attestatsiya | `data/milliy-sertifikat/savollar/attestatsiya-sinov.js` | 50 |

Savol sonini o'zgartirish uchun `lib/milliy-sertifikat-data.js` dagi `savollarSoni`
ni tahrirlang. Rasmlar `public/images/ms/<slug>/` papkasiga qo'yiladi.

## Savol shakllari

`id` sinov ichida takrorlanmaydi va keyin **o'zgartirilmaydi**: yig'ilgan javoblar
shu raqamga bog'lanadi. Savol mazmuni jiddiy o'zgarsa, yangi `id` bering.

**Matnli.** To'g'ri javobni istalgan o'ringa yozing, variantlar har sessiyada
aralashadi. `correct` — variantning tartib raqami, 0 dan boshlanadi.

```js
{
  id: 1,
  mavzu: "Atom tuzilishi",
  soha: "Umumiy kimyo",
  daraja: "oson",
  question: "Savol matni",
  options: ["To'g'ri javob", "Xato", "Xato", "Xato"],
  correct: 0,
  explanation: "To'liq yechim",
}
```

**Rasmli.** Variantlar rasm ichida, shuning uchun aralashmaydi. To'g'ri javoblar
harflar orasida teng taqsimlansin, bitta harf yarmidan oshsa sinov ochilmaydi.

```js
{
  id: 2,
  turi: "variant",
  mavzu: "Eritmalar",
  soha: "Eritmalar",
  daraja: "orta",
  rasm: "/images/ms/milliy-sertifikat-simulyator/savol-2.jpg",
  options: ["A", "B", "C", "D"],
  correct: "C",
  explanation: "To'liq yechim",
}
```

**Ochiq.** Javob son. ±0.05 farq to'g'ri hisoblanadi.

```js
{
  id: 36,
  turi: "ochiq",
  mavzu: "Elektroliz",
  soha: "Fizik kimyo",
  daraja: "qiyin",
  rasm: "/images/ms/milliy-sertifikat-simulyator/savol-36.jpg",
  correct: "22.3",
  explanation: "To'liq yechim",
}
```

## Qiyinlik

`daraja: "oson" | "orta" | "qiyin"` yetarli. Aniqroq bilsangiz, o'rniga
`qiyinlik: 0.7` (logit, odatda -3 dan +3 gacha) yozing. Bu faqat boshlang'ich
taxmin: javoblar yig'ilgach kalibrlash uni almashtiradi.

## Tekshirish

```
npm run ms:bank
```

Har sinov uchun xato va ogohlantirishni ko'rsatadi. `XATO` bo'lsa sinov yopiq
qoladi. `Diqqat` sinovni to'xtatmaydi, lekin izohlarni to'ldirish kerak.

## Kalibrlash

Sinov ochilgach javoblar o'zi yig'iladi (`20261106120000_ms_urinish` migratsiyasi
qo'llangan bo'lishi kerak). Har savolga taxminan 100–150 ta birinchi urinish
yig'ilganda:

```
npm run ms:eksport
npm run ms:kalibrla -- rasch-diagnostika
npm run ms:kalibrla -- rasch-diagnostika --yoz
```

Birinchi buyruq faqat hisobot beradi. Unda `infit`, `outfit` yoki `ajratmaydi`
deb belgilangan savollarni ko'rib chiqing: ko'pincha javob kaliti xato yoki savol
noaniq bo'ladi. Savolni tuzatgach, unga yangi `id` bering.

Har sinov alohida kalibrlanadi, ya'ni #1 va #2 balli hali bir shkalada emas.
Ularni bog'lash uchun variantlar orasida umumiy savollar kerak (YOL-XARITASI.md).
