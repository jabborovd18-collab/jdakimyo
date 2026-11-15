# Milliy sertifikatga tayyorgarlik: yo'l xaritasi

Bu bo'lim davlat sertifikati bermaydi. U o'quvchini imtihonga tayyorlaydi va
**taxminiy** daraja ko'rsatadi. Hujjat va ekranlarda davlat idoralari nomi
ishlatilmaydi.

## Tuzilma

| Fayl | Vazifasi |
|---|---|
| `lib/rasch-model.js` | Theta, SE, fit, ball. `DARAJA_CHEGARALARI` — darajalarning yagona manbai |
| `lib/milliy-sertifikat-data.js` | Sinovlar katalogi, ogohlantirish matni |
| `data/milliy-sertifikat/` | Savollar va javoblar. **Faqat serverda** import qilinadi |
| `lib/milliy-sertifikat-sessiya.js` | Imzolangan sessiya tokeni |
| `lib/milliy-sertifikat-aralashtirish.js` | Variantlarni sessiya bo'yicha aralashtirish |
| `lib/milliy-sertifikat-yakunlash.js` | Baholash, sertifikat, urinishni yozish |
| `lib/milliy-sertifikat-bank.js` | Savol bankining sifat darvozasi |
| `lib/milliy-sertifikat-eksport.js` | Kalibrlash uchun 0/1 matritsa |
| `lib/milliy-sertifikat-katalog.js` | Sinov holati: bank to'liq bo'lsa o'zi ochiladi |
| `lib/rasch-kalibrlash.js` | Qiyinlikni javoblardan hisoblash (CML) |
| `data/milliy-sertifikat/kalibrlash.js` | Hisoblangan qiyinliklar, avtomatik yaratiladi |

## Buyruqlar

```
npm run ms:bank      # savol banki holati
npm run ms:eksport   # javoblarni output/ ga chiqaradi (bazadan faqat o'qiydi)
npm run ms:kalibrla -- <slug> [--yoz]   # qiyinlikni hisoblaydi
```

## Bosqichlar

**1. Xavfsizlik va shkala — bajarildi.** Hisob serverda, rasmiy chegaralar,
rasmiy da'volar olib tashlangan.

**2. Javob yig'ish — kod tayyor, migratsiya qo'llanmagan.**
`20261106120000_ms_urinish` migratsiyasi v4 chiqishidan oldin qo'llanadi:

```
npx prisma migrate deploy
```

Migratsiyasiz ham sinov ishlaydi: urinish yozilmaydi va logda xato chiqadi.

**3. Savollarni tayyorlash — o'qituvchi ishi.**
Eski savollar olib tashlangan, bank bo'sh va hamma sinov yopiq.
Qo'llanma: `SAVOL-QOSHISH.md`. Bank to'liq bo'lib, darvozadan o'tgach sinov o'zi ochiladi.
- Rasmiy kimyo imtihoni tuzilishini manbadan aniqlash kerak.

Eslatma: `public/images/milliy-sertifikat-1` va `-2` rasmlarini
`data/hamkorlik/` sinovlari ishlatadi, ular shu bo'limga tegishli emas.

**4. Pilot.** Har savolga taxminan 100–150 ta birinchi urinish javobi, ishonchli
natija uchun 250+. Bu amaliy mo'ljal, aniq qoida emas.

**5. Kalibrlash — vosita tayyor.** `npm run ms:eksport`, keyin `npm run ms:kalibrla`.
Tekshiruv: infit/outfit 0.7–1.3, savolning ajratish kuchi, ishonchlilik 0.8 dan yuqori.
Bir o'lchamlilik va DIF hali hisoblanmaydi.

**6. Variantlarni bog'lash.** Variantlar orasida 20–25% umumiy savol. Shkala
formulasi (`SHKALA_MARKAZ`, `SHKALA_QADAM`) shu bosqichda qayta tanlanadi.

## Ma'lum cheklov

Savollar har doim bir xil va natijada to'g'ri javoblar ko'rsatiladi. Qayta
topshirgan odam yuqori daraja olishi mumkin, shuning uchun avtomatik sertifikat
bilimning qat'iy isboti emas. Kalibrlash faqat birinchi urinishlarni oladi.
