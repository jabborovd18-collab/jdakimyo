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

## Sprint 8 — Deterministik AI Tool-Calling

### Bajarilgan ishlar

- `lib/ai-agents/deterministik-kimyo.js` ga OpenAI-mos function-calling schema va qat'iy server dispatcher qo'shildi. Vositlar: `kramer_yech`, `faradey_massasi`, `ph_hisobla`, `molyar_massa_hisobla`, `gaz_hisobla`, `ks_hisobla`.
- Dispatcher faqat oldindan ruxsat etilgan nomlarni bajaradi; noma'lum nom, JSON bo'lmagan argument yoki fizik jihatdan yaroqsiz parametr xavfsiz rad etiladi. Molyar massa avvaldan mavjud yagona atom-massa dvigatelidan olinadi.
- `lib/ai-agents/ai-gateway.js` OpenAI-mos provayderlarda haqiqiy aylana qo'llaydi: model `tool_calls` yuboradi, server natijani `role: tool` bilan qaytaradi, keyin model yakuniy JSON yechimni tuzadi. Murakkab masalada birinchi vosita chaqiruvi bo'lmasa urinish yaroqsiz deb rad etiladi.
- `lib/ai-agents/masala-orkestrator.js` murakkab va olimpiada yo'nalishlariga vositalarni majburiy ulaydi. Server qaytargan vosita izlari yakuniy `serverTekshiruvi.vositalar` maydonida saqlanadi.

### Testlar va tekshiruv

- `npm.cmd test` — 211 test o'tdi, 0 ta xato.
- `node --test test/ai-himoya.test.js` — 53 test o'tdi, 0 ta xato.
- Mock Groq integratsiya testi modelning `tool_call` so'rovi, server Faradey hisobi va ikkinchi so'rovdagi `role: tool` natijasini tekshiradi.
- Schema qamrovi, Kramer/Faradey/molyar massa dispatcher natijalari, noma'lum vosita rad qilinishi hamda majburiy vosita chaqiruvisiz javobning rad qilinishi unit-test bilan qoplandi.
- Maqsadli ESLint — 0 ta xato; `npm.cmd run check:chemistry` — 238 reaksiya, 0 ta xato; `git diff --check` — toza.

### Chegara

- Commit qilinmadi.

## Sprint 9 — DTM va olimpiada formulalar dvigateli

### Bajarilgan ishlar

- `organik_formula_top` vositasi qo'shildi. U CO2 va H2O massasidan C/H atom mollarini, massa ayirmasidan O ni, 1–12 ko'paytirgich bilan eng kichik butun nisbatni aniqlaydi. Berilgan molyar massa yoki H2/havoga nisbiy zichlik bilan mos bo'lsa, molekulyar formulani ham qaytaradi.
- `bufer_ph` Henderson-Hasselbalch tenglamasi orqali kislota buferining pHini yoki asos buferining pOH/pHini hisoblaydi.
- Mavjud `pearsonKrestiHisobla` `pearson_kresti` nomi bilan rasmiy tool schema va server dispatcherga ulandi.
- Tool registry 6 tadan 9 taga kengaydi. Gatewayning 8 vositalik eski uzatish limiti 12 ga oshirildi, shuning uchun to'qqizala schema modelga yuboriladi.
- Organik va eritmalar yo'nalishlari yangi vositalarni `auto` rejimda oladi; murakkab va olimpiada yo'nalishlari server vositasini majburiy chaqirish qoidasini saqlab qoldi.

### Testlar va tekshiruv

- `npm.cmd test` — 216 test o'tdi, 0 ta xato.
- `node --test test/ai-himoya.test.js` — 58 test o'tdi, 0 ta xato.
- Glyukoza, 1 : 1.33 : 1.66 dan C3H4O5, kislorodsiz uglevodorod, kislota/asos buferi va Pearson dispatcher holatlari unit-test bilan qoplandi.
- Tool-call gateway testi 9 ta schema provayderga uzatilishini ham tekshiradi.
- Maqsadli ESLint — 0 ta xato; `npm.cmd run check:chemistry` — 238 reaksiya, 0 ta xato; `git diff --check` — toza.

### Chegara

- Commit qilinmadi.

## Sprint 10 — Server hakami va xalqaro olimpiada benchmarklari

### Bajarilgan ishlar

- `aiYechiminiDeterministikTekshir` yonish masalasidan CO2, H2O va namuna massasini, ixtiyoriy molyar massani yoki H2/havoga nisbiy zichlikni faqat aniq naqshlar orqali oladi. Model keltirgan C/H/O formulasi `organikFormulaTop` natijasiga mos kelmasa `organik_formula_xatosi` qayd qilinadi.
- Bufer masalasidagi pKa/pKb hamda kislota, asos va tuz konsentratsiyalari aniq bo'lsa, hakam `buferPhHisobla` bilan pH ni mustaqil hisoblaydi. Model qiymati mos bo'lmasa `bufer_xatosi` qaytariladi.
- Benchmark baholagichi endi har bir namuna javobini uning savol matni bilan birga hakamdan o'tkazadi. Shu sabab organik va bufer tekshiruvlari test quvurida haqiqatan ishlaydi.
- Respublika/DTM/IChO to'plamiga uch holat qo'shildi: glyukoza uchun organik yonish tahlili, asetat buferi va Pearson kresti bilan HCl eritmasi. Kengaytirilgan to'plam 13 ta, admin sifat sinovi esa 18 ta holatga yetdi.

### Testlar va tekshiruv

- `npm.cmd test` — 222 test o'tdi, 0 ta xato.
- `node --test test/ai-himoya.test.js` — 64 test o'tdi, 0 ta xato.
- Noto'g'ri va to'g'ri organik formula, noto'g'ri va to'g'ri bufer pH, shuningdek uch yangi benchmarkning to'liq hakamdan o'tishi unit-test bilan qoplandi.
- `git diff --check` — toza.

### Chegara

- Faqat `lib/`, `data/`, so'ralgan test va hisobot fayli o'zgartirildi; 3D sahnaga tegilmadi.
- Commit qilinmadi.

## Sprint 11 — Deterministik reaksiya balanseri

### Bajarilgan ishlar

- `reaksiyaTengla` `chem-balance.js`ning mavjud `azoniOqi` parseridan atomlar va zaryadlarni oladi. Gauss eliminatsiyasi tenglamaning bir o'lchamli nol-fazosini topib, ratsional javobni eng kichik musbat butun koeffitsiyentlarga keltiradi.
- Natija tenglashtirilgan tenglama, koeffitsiyentlar, ularning yig'indisi, redoks turi va elektronlar berilishi/qabul qilinishining mosligini qaytaradi. Bir nechta mustaqil yechim yoki yaroqsiz formula bo'lsa vosita taxmin qilmaydi.
- `reaksiya_tengla` o'ninchi tool schema va dispatcherga ulandi. Orkestrator tenglashtirish, koeffitsiyent yoki redoks so'rovlarida ushbu vositani faollashtirib, uni majburiy chaqirishni talab qiladi.
- Gatewayning vosita reyestri testi 10 ta schema uzatilishini tasdiqlaydi.

### Testlar va tekshiruv

- `npm.cmd test` — 227 test o'tdi, 0 ta xato.
- `node --test test/ai-himoya.test.js` — 69 test o'tdi, 0 ta xato.
- KMnO4/HCl, Cu/HNO3 va K2Cr2O7/FeSO4/H2SO4 redoks tenglamalari, dispatcher hamda noaniq/yaroqsiz kirishlar unit-test bilan qoplandi.
- `git diff --check` — toza.

### Chegara

- Faqat `lib/`, so'ralgan test va hisobot fayli o'zgartirildi; 3D sahnaga tegilmadi.
- Commit qilinmadi.
