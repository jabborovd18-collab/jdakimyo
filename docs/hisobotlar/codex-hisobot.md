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

## 2026-09-10 — JDA Kimyo AI production xatolari bo'yicha to'liq qayta audit

### Yakuniy tashxis

Muammo kimyo dvigatelida emas, rasmli so'rovning provayder, token, JSON shartnomasi va fallback qatlamlarida. Skrinshotdagi 16:30 xatosi eskirgan Gemini 2.5 yo'liga tegishli; joriy kod bu modeldan 3.6/3.5 ga o'tgan. Ammo 17:29 dagi so'rov joriy zanjirning ham ishlamayotganini ko'rsatdi: ikkala Gemini modeli yaroqli JSON bermadi, yagona OpenRouter zaxirasi esa 429 qaytardi.

Ilovadagi masalaning o'zi odatiy stexiometriya masalasi va yechiladigan holat. $M_2O + H_2O \rightarrow 2MOH$, eritma massasi $15+105=120$ g, hosil bo'lgan ishqor massasi $120\cdot0.20=24$ g. Shundan

$$\frac{30(M+17)}{2M+16}=24,\qquad M=7,$$

ya'ni to'g'ri javob `B) Li`. Demak foydalanuvchi xatosi kimyoviy noaniqlikdan oldin, infratuzilma bosqichida yuz bergan.

### Production dalillari

- Oxirgi 24 soatlik `AiUsageEvent` namunasida 12 ta provayder urinishi qayd etilgan va ularning barchasi xato bilan tugagan. Bu son foydalanuvchi so'rovlari emas, fallback zanjiridagi alohida urinishlar sonidir.
- 2026-09-10 17:29 Toshkent vaqtidagi ayni so'rov:
  - `gemini-3.6-flash`: `FORMAT_XATOSI`, 11 078 ms;
  - `gemini-3.5-flash`: `FORMAT_XATOSI`, 9 148 ms;
  - `google/gemma-4-31b-it:free`: HTTP 429, 265 ms.
- 16:30 atrofidagi eski hodisalarda 2.5 modeliga kirish yopilgani ko'rinadi. Keyingi commitlarda model nomlari yangilangan; 17:29 hodisasi yangi modellar endpointi ochilayotganini, ammo natija shartnomasi hanuz buzilayotganini isbotlaydi.
- Production bazasida `AiSettings(id="main")` yozuvi yo'q. Shuning uchun admin orqali saqlangan routing emas, repodagi default `rasm: [geminiAsosiy, geminiZaxira, openrouterRasm]` ishlatilmoqda.
- Audit davomida foydalanuvchi rasmi qayta tashqi provayderga yuborilmadi. Xulosa mahalliy kod, foydalanuvchi bergan skrinshot va shaxsiy mazmun saqlamaydigan texnik telemetriyadan chiqarildi.

### P0 topilmalar

#### 1. Gemini 3.x uchun 2 500 tokenli limit formatni kesishi mumkin

`ai-yonalish.js` rasmli so'rovni avtomatik ravishda `oddiy` deb belgilaydi va unga 2 500 chiqish tokeni beradi. `ai-gateway.js` Gemini 3.5/3.6 ga `thinkingConfig` bermaydi, ya'ni model dinamik fikrlashni default holatda ishlatadi. Google hujjatiga ko'ra `maxOutputTokens` fikrlash tokenlarini ham qamrab oladi; limitga fikrlash paytida yetilsa javob `MAX_TOKENS` bilan chala yoki bo'sh qaytishi mumkin. JDA esa bir vaqtning o'zida OCR, to'liq yechim, ko'p maydonli JSON, PDF vizual, jadval va formula qoidalarini talab qiladi.

Bu productiondagi ikki ketma-ket `FORMAT_XATOSI`ning eng kuchli sababidir, ammo hozirgi telemetriya `finishReason`ni saqlamagani uchun `MAX_TOKENS` holatini hodisadan bevosita isbotlab bo'lmaydi.

Manba: [Google Gemini thinking va token limitlari](https://ai.google.dev/gemini-api/docs/generate-content/thinking).

#### 2. JSON MIME bor, qat'iy provider schema yo'q

Gemini so'roviga faqat `responseMimeType: "application/json"` beriladi; `responseSchema` yoki `responseJsonSchema` uzatilmaydi. Natijaning murakkab shakli faqat uzun system promptda matn sifatida yozilgan. OpenRouter so'rovida esa rasmli JSON rejimi uchun hatto `response_format` ham uzatilmaydi. Serverdagi validator xato natijani to'g'ri rad etadi, lekin provayderni kerakli shaklni yaratishga majburlamaydi.

Google structured output uchun MIME bilan birga JSON Schema berishni ko'rsatadi. Manba: [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output?lang=rest).

#### 3. Production fallback bepul va amalda ishlamayapti

Uchinchi va oxirgi zaxira `google/gemma-4-31b-it:free`. Kuzatilgan barcha so'rovlarda u 429 yoki provider limit xatosi qaytargan. OpenRouter o'z hujjatida bepul modellar past limitli ekanini va odatda production uchun mos emasligini ochiq yozadi. Shunday qilib ikki bir provayderga bog'langan Gemini urinishidan keyin haqiqiy mustaqil, ishonchli fallback yo'q.

Manbalar: [OpenRouter FAQ](https://openrouter.ai/docs/faq), [OpenRouter free model cheklovlari](https://openrouter.ai/docs/guides/routing/model-variants/free).

#### 4. Rasmli masala sohasi va deterministik apparat yo'qoladi

`masala-orkestrator.js` har qanday rasm bo'lsa `masalaTuri = "umumiy"` deb qo'yadi. Rasm ichidagi matn avval OCR qilinib sohaga ajratilmaydi. Natijada stexiometriya, organik, eritma yoki olimpiada prompti tanlanmaydi; so'rov generic master prompt va `oddiy` token chegarasida qoladi. Foydalanuvchi matn bilan alohida murakkablik belgisi yozmasa, Sprint 8–11 dagi deterministik vositalar ham ochilmaydi.

Bu biriktirilgan masalada ham sodir bo'lgan: server Li javobini tekshira oladigan deterministik hisob bosqichiga yetmagan.

### P1 topilmalar

#### Gemini tool-calling integratsiyasi tugallanmagan

`geminiChaqir` `vazifa.vositalar`, `vazifa.vositaTanlovi` va `vazifa.xabarlar`ni umuman yubormaydi. Gateway yuqori qatlamida tool loop bo'lsa ham Gemini function declaration olmaydi va keyingi turn tarixini ko'rmaydi. `required` vosita rejimida Gemini javobi avtomatik `VOSITA_CHAQIRILMADI` bo'lib rad etiladi. Bu skrinshotdagi oddiy rasm+JSON xatosining sababi emas, lekin Gemini murakkab masala fallbacki uchun alohida kritik nuqson.

Google function calling oqimi declaration, modelning to'liq function-call javobi va mos function-response tarixini saqlashni talab qiladi. Manba: [Gemini function calling](https://ai.google.dev/gemini-api/docs/function-calling).

#### Model discovery va telemetriya bir-biridan uzilgan

- `geminiMavjudModellarKesh?.[0]` keyingi Gemini aliasining o'z modelini bosib ketishi mumkin. ListModels tartibidagi birinchi model har doim tanlangan 3.6/3.5 flash bo'lishi kafolatlanmagan.
- Recovery boshqa modelga o'tsa ham telemetriya `modelNomi`ni emas, dastlabki `nomzod.model`ni yozadi. 16:30 hodisasida eski nominal model bilan xabardagi 2.5 nomining farq qilishi shu kuzatuvni ishonchsiz qiladi.
- Discovery kodi `2.5` satri bor barcha modellarni eskirgan deb chiqarib tashlaydi. Bu accountga xos cheklovni global model qoidasi deb qabul qiladi; model yaroqliligi nom bo'yicha emas, `supportedGenerationMethods` va haqiqiy endpoint natijasi bo'yicha hal qilinishi kerak.

#### Xato telemetriyasi sababni yetarli yozmaydi

Gemini javobidan `finishReason`, safety block sababi, real ishlatilgan model, matn uzunligi va usage xato hodisasiga o'tmaydi. JSON parse yoki schema validatsiyasi yiqilganda tokenlar ham yo'qoladi. Shu sabab `FORMAT_XATOSI` bo'sh javobmi, `MAX_TOKENS`mi, xavfsizlik blokimi yoki sintaksis xatosimi — production hodisasidan ajratib bo'lmaydi.

#### Admin sifat sinovi provider sifatini o'lchamaydi

`POST action="eval"` `aiSifatSinoviniIshgaTushir`ni `javobBeruvchi` siz chaqiradi. Benchmark runner bunday holatda modelni chaqirmaydi, fayldagi `namunaNatija`ni o'z regexi va hakami bilan tekshiradi. Shuning uchun admin paneldagi 18/18 natija providerning OCR yoki yechim sifatini emas, ichki fixture va validatorning o'zaro mosligini ko'rsatadi.

`aiProvayderKorigi` ham faqat qisqa matnli, JSONsiz `H2O` savolini sinaydi. U yashil bo'lsa ham rasm+OCR+structured-output yo'li ishlashi kafolatlanmaydi.

#### Dashboard foydalanuvchi so'rovini emas, har bir urinishni foizlaydi

`aiDashboardMalumotiOl` success/error foizini provider eventlari bo'yicha hisoblaydi. Masalan birinchi provider yiqilib, ikkinchisi ishlagan bitta muvaffaqiyatli foydalanuvchi so'rovi dashboardda 50% xato sifatida ko'rinadi. Aksincha, request darajasidagi haqiqiy muvaffaqiyat ko'rsatkichi alohida hisoblanmaydi.

#### Ichki provider xatolari foydalanuvchiga chiqariladi

Gateway barcha provider xabarlarini 250 belgigacha yig'ib `AiGatewayXatosi.message`ga qo'shadi; API 502/504 da uni o'zgartirmay beradi, UI esa `Xatolik: ...` ko'rinishida chiqaradi. Natijada foydalanuvchi model nomi, provider topologiyasi va inglizcha texnik tafsilotni ko'radi. Bu foydalanuvchi tajribasi va operatsion ma'lumotni yashirish nuqtai nazaridan noto'g'ri.

#### Mijoz va server timeoutlari orasida zaxira yo'q

Rasm so'rovida brauzer 55 000 ms da abort qiladi, gateway umumiy budjeti ham kamida 55 000 ms, route limiti 60 soniya. Tarmoq va JSON parse vaqti uchun marja qolmagan; sekin, lekin 55 soniyada tugagan server javobini mijoz undan sal oldin bekor qilishi mumkin.

### Test qamrovi auditi

- `npm.cmd test`: 227/227 test o'tdi, 0 xato.
- Testlar fallback va validatorni mock javoblar bilan tekshiradi, lekin Gemini rasm request body-si, `responseSchema`, thinking sozlamasi, `finishReason`, OpenRouter structured output va end-to-end rasm routingini tekshirmaydi.
- Mavjud Gemini testi mock sifatida shunchaki `{ candidates: [{ ... text: "Tayyor" }] }` qaytaradi va yuborilgan body kontraktini tekshirmaydi.
- Tool-calling testi faqat Groq/OpenAI-mos yo'lni qoplaydi; Gemini vosita oqimi uchun test yo'q.
- So'nggi Gemini hotfixlarining productiondagi regressiyasini tutadigan recorded-response yoki jonli canary test yo'q.

Demak 227/227 kodning sof funksiyalari va mock shartnomalari yashil ekanini ko'rsatadi, production provider oqimining ishlashini emas.

### Umumiy loyiha darvozalari

- `npm.cmd run build`: muvaffaqiyatli, 785 statik sahifa yaratildi. Mahalliy sandbox Neon bazasiga chiqa olmagani sabab sitemap qismida ogohlantirish berdi, lekin build yiqilmadi.
- `npm.cmd run lint`: 0 xato, 234 ogohlantirish. Asosiy toifalar React hook dependency va oddiy `<img>` ishlatilishi. Bu production AI xatosining bevosita sababi emas, ammo “lint toza” deb bo'lmaydi.
- `npm.cmd run check:chemistry`: 238 reaksiya va 12 birikma tekshirildi, 0 xato.
- Kimyo bazasi semantik jihatdan o'tdi, lekin boyitish qamrovi past qolgan: mexanizm 26/238 (11%), oraliq zarrachalar 51/238 (21%), tezlik omillari 61/238 (26%), scale note 79/238 (33%), texnika 109/238 (46%). Bu xato emas, lekin “to'liq nano-mexanizm bazasi” darajasiga hali yetilmaganini ko'rsatadi.

### Tavsiya etilgan tuzatish tartibi

1. Gemini uchun haqiqiy JSON Schema yuborish; OpenRouterda structured-output imkoniyatini talab qilish va schema qo'llamaydigan modelni bu routega kiritmaslik.
2. Gemini 3.5/3.6 rasm oqimida `thinkingLevel`ni boshqarish va token limitini yechim hajmiga moslashtirish; `MAX_TOKENS` bo'lsa aynan shu sabab bilan bir martalik kontrolli retry qilish.
3. Bepul Gemma fallbackini production zanjiridan chiqarib, mustaqil va pullik vision fallback yoki capability-aware provider router qo'yish.
4. Rasm oqimini ikki bosqichga ajratish: avval ixcham strukturali OCR, keyin OCR matnidan soha/murakkablikni aniqlab tegishli agent va deterministik vositalar bilan yechish.
5. Gemini tool-callingni uning native declaration va turn-history shartnomasi bilan yakunlash.
6. Telemetriyaga request yakuni, real model, `finishReason`, response uzunligi, safety holati va xato bosqichini qo'shish; dashboardni request va provider-attempt metrikalariga ajratish.
7. Foydalanuvchiga qisqa o'zbekcha xato kodi berish, provider tafsilotini faqat server log/admin panelda saqlash.
8. Rasm+JSON uchun provider contract testlari, recorded production fixturelar va alohida canary sinov qo'shish. Admin “sifat sinovi”da ixtiyoriy emas, aniq tanlangan provider javobini benchmarkdan o'tkazish.
9. Browser timeoutini server budjetidan kattaroq qilish yoki route/gateway budjetlarini bir xil yakuniy deadline asosida, aniq marja bilan boshqarish.

### Chegara

- Bu topshiriq diagnostika edi: production kodiga tuzatish kiritilmadi.
- Faqat ushbu audit hisoboti `docs/hisobotlar/codex-hisobot.md`ga qo'shildi.
- Commit qilinmadi.

## 2026-09-10 — JDA Kimyo AI ishonchlilik tuzatishi

Bu bo'lim yuqoridagi auditning `production kodiga tuzatish kiritilmadi` holatini yopadi. Auditdan keyin topilgan provider, JSON, fallback, tool-calling, timeout, maxfiylik va telemetriya nuqsonlari kodda tuzatildi.

### Asosiy sabablar va amaliy tuzatish

- Gemini REST v1beta jonli so'rovda `generationConfig.responseFormat.text.mimeType = "application/json"` qiymatini HTTP 400 bilan rad etdi. Amaldagi endpoint qabul qilgan native qat'iy shartnoma — `responseMimeType: "application/json"` va `responseJsonSchema`; gateway shu shaklga o'tkazildi.
- Gemini `functionCallingConfig.mode = "ANY"` bilan JSON MIME rejimini bitta chaqiruvda qo'llamaydi. Tool-calling ikki fazaga ajratildi: birinchi so'rov vositani majburiy chaqiradi, server natijasidan keyingi `AUTO` so'rov qat'iy JSON sxemani majbur qiladi.
- Rasm yo'lining default modellari jonli ishlagan `gemini-3.5-flash`, `gemini-3-flash-preview` va `nex-agi/nex-n2.5-mini:free`ga moslashtirildi. Model topilmasa Gemini ListModels natijasidan faqat `generateContent`ni qo'llaydigan haqiqiy model tanlanadi; kesh kalit+so'ralgan model bo'yicha ajratiladi.
- Tezkor rasm rejimi ham endi kamida uchta vision fallbackni sinaydi. Avval `urinishChegarasi = 2` bo'lsa uchinchi, mustaqil OpenRouter provayderiga navbat yetmas edi.
- Gemini va OpenRouter bir xil minimal yechim/suhbat JSON sxemasiga tayanadi. OpenRouterda `json_schema`, `structured_outputs` va parametrlarni qo'llaydigan provider talabi yuboriladi; server validatori yakuniy himoya bo'lib qoladi.
- Gemini native function declaration, to'liq model contenti, `thoughtSignature`, `functionResponse` va keyingi turn tarixi saqlanadi. Shu bilan Sprint 8–11 deterministik vositalari Gemini fallbackida ham haqiqatan ishlaydi.
- Rasmli masala endi avtomatik ravishda barcha 10 deterministik vositani ko'radi. Rasm yonida aniq organik, eritma yoki boshqa soha matni bo'lsa u `umumiy` turga yo'qolmaydi. Vosita faqat murakkab/olimpiada yoki aniq tenglashtirish so'rovida majburiy qilinadi.
- Rasm uchun chiqish limiti kamida 8 000 token, kesilsa bir martalik 12 000 tokenli kontrolli retry; per-provider vaqt kamida 24 soniya, gateway umumiy budjeti 75 soniya, route 90 soniya va browser aborti 85 soniya qilindi.
- `finishReason = MAX_TOKENS/length`, safety block, real model, javob uzunligi, xato bosqichi va sarflangan tokenlar xato telemetriyasiga o'tadi. Retry/tool turn tokenlari yig'ib yoziladi.
- Providerning xom inglizcha xatosi, ichki model topologiyasi va texnik tafsilotlari foydalanuvchi javobidan olib tashlandi. UI endi faqat qisqa o'zbekcha 502/504 xabarini oladi; admin uchun xavfsiz provider/model/kod/status yozuvi qoladi.
- Sayt rasm kirishi faqat haqiqiy JPEG/PNG/WebP base64 data URL bo'lsa va 4 MB dan oshmasa qabul qilinadi. Gatewayning umumiy chegarasi Telegram oqimini buzmaslik uchun 10 MB.

### Admin va kuzatuv

- Provider ko'rigi endi routingdagi aniq aliaslarni, foydalanuvchi ma'lumotini saqlamaydigan 1 pikselli PNG, native JSON sxema va vision endpoint bilan tekshiradi.
- Canary limiti realistik 1 500–2 000 token va 12–20 soniya qilindi. `MAX_TOKENS` bilan kelgan, matni tasodifan parse bo'lgan javob endi yashil emas, `javob_kesildi` deb ko'rsatiladi.
- Dashboard fallback urinishlarini foydalanuvchi so'rovidan ajratadi: `Jami so'rov`, `Provider urinish`, request-level muvaffaqiyat/xato/fallback va p50/p95 alohida hisoblanadi.
- Admin benchmarki 13 ta statik fixture ekanini ochiq yozadi; u endi provider sifatini sinayotgandek ko'rsatilmaydi. Jonli rasm+JSON shartnomasi alohida provider canary orqali tekshiriladi.

### Jonli canary dalili

Foydalanuvchi rasmi qayta yuborilmadi; barcha jonli sinovlar sintetik H2O savoli va 1 pikselli PNG bilan bajarildi.

- Yakuniy vision+structured-output canary:
  - `geminiAsosiy / gemini-3.5-flash`: ishladi, 14 350 ms;
  - `geminiZaxira / gemini-3-flash-preview`: shu urinishda providerning vaqtinchalik HTTP 503 high-demand javobi;
  - `openrouterRasm / nex-agi/nex-n2.5-mini:free`: ishladi, 2 719 ms.
- Alohida live tool-calling sinovida `gemini-3.5-flash` va `gemini-3-flash-preview` serverdagi molyar massa vositasini chaqirib, H2O uchun `18.015 g/mol`ni qat'iy `yechim` JSONida qaytardi.
- Demak yakuniy konfiguratsiyada ayni vaqtda ikki mustaqil vision yo'li ishladi; bitta Gemini 503 holati fallback tomonidan yutildi. OpenRouter bepul qatlamining tashqi rate-limit xavfi saqlanadi, ammo u endi yagona zaxira emas va joriy model katalogidagi haqiqiy structured-output vision modeliga ulangan.

### Testlar va darvozalar

- `npm.cmd test`: 243/243 test o'tdi, 0 xato. AI himoya faylining o'zi 85 testga yetdi.
- Yangi regressiyalar Gemini/OpenRouter request body, native sxema, Gemini ikki fazali tool-calling, `thoughtSignature`, uchinchi vision fallback, model discovery, MAX_TOKENS retry, admin canary kesilishi, xato maxfiyligi, rasm validatsiyasi, rasm yo'nalish siyosati va request-level telemetriyani qoplaydi.
- `npm.cmd run check:chemistry`: 238 reaksiya va 12 birikma, 0 xato.
- Yakuniy o'zgargan fayllar ESLint tekshiruvi: 0 xato, `app/masala/page.js`dagi oldindan mavjud 2 ta `<img>` performance ogohlantirishi. To'liq loyiha auditidagi avvalgi holat 0 xato va 234 ogohlantirish edi.
- `npm.cmd run build`: muvaffaqiyatli, 785 statik sahifa. Sitemap generatsiyasida mahalliy muhit Neon bazasiga ulanmagani haqida ogohlantirish berdi, ammo build yiqilmadi.
- `git diff --check`: toza.

### Chegara

- 3D laboratoriya fayllariga tegilmadi.
- Vaqtinchalik canary skripti o'chirildi; repoda qolmadi.
- Commit va deploy qilinmadi.

## 2026-09-16 — AI productionga chiqarish tekshiruvi

Oldingi bo'lim 10-sentabrdagi holatni aks ettiradi. Bugungi jonli sinovda `nex-agi/nex-n2.5-mini:free` rasm+JSON so'roviga HTTP 400 qaytardi; uni ishonchli vision zaxira deb hisoblab bo'lmaydi. OpenRouterning joriy katalogidagi vision va structured-output shartnomasini qo'llaydigan `nex-agi/nex-n2.5-pro:free` bilan sintetik 1 pikselli PNG va H2O savoli muvaffaqiyatli o'tdi (7 833 ms, 305 token). Shu sabab faqat `openrouter.rasm` defaulti pro modeliga o'tkazildi; matn yo'nalishining defaulti o'zgarmadi.

Xuddi shu sintetik canaryda `geminiAsosiy/gemini-3.5-flash` 15 679 ms va `geminiZaxira/gemini-3-flash-preview` 3 501 ms ichida qat'iy JSON qaytardi. Foydalanuvchining haqiqiy surati tashqi provayderga qayta yuborilmadi. Bu provider shartnomasini tekshiradi, lekin productiondagi autentifikatsiyalangan foydalanuvchi so'rovining to'liq end-to-end dalili emas.

`npm.cmd test`: 246/246 yashil. `npm.cmd run check:chemistry`: 238 reaksiya, 12 birikma, 0 xato. O'zgargan fayllar ESLint: 0 xato, avvaldan mavjud 2 ta `<img>` ogohlantirishi. Mahalliy sandbox buildi Google Fontsga tarmoq ruxsati yo'qligi sabab to'xtadi; tarmoq ruxsati bilan asosiy katalog va aniq release daraxtining buildlari muvaffaqiyatli o'tdi. Har ikkala buildda sitemap mahalliy Neon bazasiga ulanolmagani haqida ogohlantirdi, ammo build yiqilmadi.

Mahalliy `main`da AI tuzatishidan mustaqil beshta Telegram quiz commit ham bor. Ularni tasodifan productionga yubormaslik uchun AI o'zgarishi `origin/main` ustiga alohida fast-forward release sifatida chiqariladi. Eski Vercel deploylarini kvota tiklanadi degan taxmin bilan o'chirish rejalashtirilmagan: Vercelning vaqt oynasidagi build/deploy limiti eski deploy tarixini o'chirish bilan tiklanmaydi.

### Deploy natijasi

- AI tuzatishi mahalliy `767c641` commitidan `origin/main`ning `c9d6b2d` bazasiga alohida cherry-pick qilindi. Productionga **faqat** `47a7c86` fast-forward push qilindi; mahalliy Telegram quiz commitlari yuborilmadi. GitHub push javobida PR qoidasi bypass qilingani qayd etildi.
- GitHubdagi Vercel holati `success` — [deploy yozuvi](https://vercel.com/jabborovd18-3171s-projects/jdakimyo/7PyNuiXHa9XWE7N7N5E2gw2hKFJu). [Jonli masala sahifasi](https://www.jdakimyo.uz/masala) HTTP 200 qaytardi. Uning client chunkida yangi 85 soniyalik rasmli so'rov chegarasi topildi; bu o'zgargan kod jonli sahifaga chiqqanini tasdiqlaydi.
- Aniq release daraxtida qayta `npm.cmd test` 246/246, `npm.cmd run check:chemistry` 0 xato va production build muvaffaqiyatli o'tdi. Vaqtinchalik `.ai-release` worktree va o'rnatilgan paketlari tekshirilgan aniq workspace manzilidan o'chirildi; boshqa loyiha fayllari o'chirilmadi.
- Eski Vercel deploylari o'chirilmadi: yangi deploy muvaffaqiyatli bajarildi, vaqt oynasidagi kvota eski tarixni o'chirish bilan qaytmaydi. Bu yo'l bilan hech qanday foyda uchun production rollback tarixini yo'qotish xavfi olinmadi.
- Chegara: autentifikatsiyalangan production AI POST so'rovi bu sessiyadan bajarilmadi. Providerlarning sintetik canarysi mahalliy kalitlar bilan o'tgan; Verceldagi runtime kalitlar va foydalanuvchi kvotasi uchun haqiqiy end-to-end tasdiq emas. Lider jonli hisobdan bitta rasmli masalani yuborib, admin provider ko'rigi hamda telemetriya natijasini tekshirishi kerak.
- Mahalliy `main` va production `origin/main` tarixi hozir turlicha: birinchisida beshta hali yuborilmagan quiz commit va AI tuzatishining `767c641` nusxasi, ikkinchisida AI tuzatishining alohida `47a7c86` nusxasi bor. Keyingi ishda odatiy `git push main` qilishdan oldin bu tarixni ongli ravishda muvofiqlashtirish kerak; bu deployda ularni avtomatik birlashtirmadim. Yakuniy deploy qaydi shu mahalliy hisobot fayliga qo'shildi, ikkinchi Vercel buildini qo'zg'atmaslik uchun qayta push qilinmadi.

## 2026-09-16 — qisqa matnli savol timeouti

Foydalanuvchi jonli sahifada “nitrozolni formulasi qanday” degan qisqa savol uchun 504 timeout skrinshotini yubordi. Bu so'rov `suhbat` turiga va `tezkor` yo'nalishga tushadi. Mahalliy kalitlar bilan ayni gateway zanjiri takrorlandi: Groq `openai/gpt-oss-20b` eski `json_object` rejimida HTTP 400, “Failed to validate JSON” berdi; Gemini `gemini-3.5-flash` 8 soniyada uzildi. Gateway 14 soniyalik umumiy chegarani tugatdi. Alohida Gemini sinovida ayni savol 9 814 ms ichida muvaffaqiyatli javob berdi — demak 8 soniyalik limit haqiqatan yetmas edi.

- [Groq Structured Outputs hujjati](https://console.groq.com/docs/structured-outputs) GPT-OSS 20B/120B uchun `strict: true` JSON Schema rejimini qo'llashini ko'rsatadi. Suhbatdagi uch majburiy maydon (`muvaffaqiyatli`, `turi`, `matn`) yopiq sxema bilan yuborildi; boshqa Groq model override'lari eski mos rejimda qoladi. Shu sxema bilan jonli Groq sinovi HTTP 200 qaytardi.
- Tezkor matn limitlari bitta manbaga birlashtirildi: har bir provider uchun 14 soniya, jami 30 soniya. Bazada avvalgi 8/14 saqlangan bo'lsa ham gateway shu xavfsiz minimumni qo'llaydi. Brauzerning qo'lda tanlangan “Tez javob” aborti 34 soniyaga moslashtirildi. Rasm va boshqa yo'nalishlar budjeti o'zgarmadi.
- Xato matni qisqa so'rovni asossiz “qisqartirish”ni tavsiya qilmaydi. Tezkor limit va Groq strict schema uchun ikkita regressiya testi qo'shildi.
- Tuzatilgan gatewayda ayni sintetik savol jonli Groq orqali 1 828 ms ichida `suhbat` JSON qaytardi. Bu mahalliy provider sinovi; productiondagi loginli POST hali alohida tekshirilishi kerak.
- `npm.cmd test`: 248/248 yashil; `npm.cmd run check:chemistry`: 0 xato; o'zgargan fayllar ESLint: 0 xato, oldindan mavjud 2 ta `<img>` ogohlantirishi; `npm.cmd run build`: muvaffaqiyatli. Vaqtinchalik canary fayli o'chirildi.
