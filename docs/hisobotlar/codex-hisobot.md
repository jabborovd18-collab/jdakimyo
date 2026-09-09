# Codex Hisoboti

## Sprint 7 — Sokratik repetitor va chat vizualizatsiyasi

### Bajarilgan ishlar

- `lib/ai-agents/sokratik-repetitor.js` qo'shildi. U o'quvchining "tushuntir" va "birga yechaylik" turidagi so'rovlarini aniqlaydi hamda modelga tayyor yechim o'rniga bitta yo'naltiruvchi savol berish qoidasini uzatadi.
- `lib/ai-agents/masala-orkestrator.js` follow-up chatida Sokratik rejimni yoqadi va javobga rejim holatini qo'shadi.
- `lib/chat-vizual.js` formula hamda Pearson/moddalar nisbatidan maksimal olti qatorli, tashqi resurs ishlatmaydigan SVG jadval yaratadi. XML belgilar escapelanadi; shuning uchun formula matni SVG kodi sifatida bajarilmaydi.
- API faqat kerakli oldingi yechim bo'laklarini vizual generatoriga beradi. Chat kartasi SVGni data-URL bilan render qiladi.
- Brauzerdagi follow-up tanlovi serverdagi ayni Sokratik detectoridan foydalanadi; "tushuntir" va "birga yechaylik" endi alohida yangi masala sifatida yuborilmaydi.

### Testlar va tekshiruv

- `npm.cmd test` — 206 test o'tdi, 0 ta xato.
- `node --test test/ai-himoya.test.js` — 48 test o'tdi, 0 ta xato.
- SVGning XML-injection himoyasi, Sokratik triggerlar, Sokratik prompt, formula/nisbat jadvali va bo'sh vizual holati unit-test bilan qoplandi.
- Maqsadli ESLint tekshiruvi — 0 ta xato. `app/masala/page.js`da yangi SVG uchun data-URL ishlatilgani sababli mahalliy, asoslangan `no-img-element` istisnosi qo'yildi; qolgan 2 ogohlantirish avvaldan mavjud `<img>` satrlariga tegishli.
- `git diff --check` — toza.

### Chegara

- Commit qilinmadi.
