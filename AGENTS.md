# QAT'IY QOIDALAR — bu loyihada ishlaydigan har qanday AI agent uchun

**O'qimasdan kod yozmang.** Bu fayl loyihaning tarixidan chiqqan: quyidagi
qoidalarning har biri ALLAQACHON BUZILGAN va uni tuzatishga vaqt ketgan.
Har bandda buzilganda nima bo'lgani yozilgan — takrorlamang.

Agar qoida sizga ortiqcha tuyulsa, avval **nega** yozilganini o'qing.

---

## 0. Til va izohlar

- Interfeys, izoh va commit xabari — **o'zbek tilida**.
- Izoh **nima** qilinayotganini emas, **nega** qilinayotganini yozadi.
  `// sonni ikkiga bo'lamiz` foydasiz; `// nega 2: idish yarmigacha
  to'ldiriladi, aks holda qaynaganda toshadi` foydali.
- Lotin yozuvi. Kirill harflarini tasodifan aralashtirib yubormang
  (`о`, `а`, `к` — bular kirill; ular qidiruvni buzadi).

## 1. Yagona haqiqat manbai — eng muhim qoida

**Bir ma'lumot ikki joyda yozilmaydi.** Ikkinchi nusxa vaqt o'tishi bilan
birinchisidan uzilib qoladi va qaysi biri to'g'ri ekanini keyin aniqlab
bo'lmaydi.

Mavjud yagona manbalar — yangi jadval yaratishdan oldin shularni tekshiring:

| Fayl | Nimaning manbai |
|---|---|
| `lib/lab-modda.js` | 242 modda: rang, agregat holat, shaffoflik |
| `lib/lab-birlik.js` | O'lchov birligi va ulush (1 dona = 25 ml / 5 g) |
| `lib/lab-idish.js` | Idish sig'imi, materiali, yaroqsiz bo'lishi |
| `lib/lab-erituvchi.js` | Suv turlari va ularning ta'siri |
| `lib/lab-nisbat.js` | Stexiometrik baho (server hakami) |
| `lib/lab-inventar.js` | Inventarni o'zgartirishning YAGONA yo'li |
| `lib/lab-tenglama.js` | Tenglamadan kalit ajratish |
| `data/reactions/` → `Reaction` jadvali | Kimyoning o'zi: tenglama, kuzatuv, `hazards`, harorat |

**Buzilganda nima bo'lgan:**
- `portlash.js` kimyoni qo'lda takrorlagan (`2Na + 2H₂O` tenglamasi va
  xavfsizlik matni), holbuki baza uni GHS kodlari bilan biladi.
- Sig'im 3D modellarida yashagan, server ko'rmagan — 25 ml probirkaga
  500 ml quyish mumkin edi.
- Rang ikki lug'atda bo'lgan: matndan chiqqan "sariq" bilan K₂CrO₄ ning
  sarig'i har xil qiymat olardi.

**Xulosa:** yangi qoida yozishdan oldin so'rang — "bu ma'lumot allaqachon
qayerdadir bormi?" Odatda bor.

## 2. Server — yagona hakam. Client hech narsa hal qilmaydi

Balans, XP, inventar, ball — **hammasi serverda** hisoblanadi. Client
faqat ko'rsatadi.

- Client yuborgan songa ishonilmaydi. U faqat NIMA SO'RALAYOTGANINI
  bildiradi; borligini tranzaksiya ichidagi shartli `updateMany`
  tekshiradi.
- Mukofotni ekranda ko'rsatish — uni BERISH degani emas. Agar UI
  "+200 XP va +60 🪙" deb yozsa, o'sha so'rov serverga ketishi va server
  qaytargan qiymat ko'rsatilishi shart.
- Topshiriq javoblari client bo'lagiga tushmasin — o'quvchi ularni
  manbadan o'qib oladi.

**Buzilganda nima bo'lgan:** sifat analizi paneli ballni brauzerda
hisoblab, "+200 XP va +60 🪙" deb yozardi va hech qayerga yubormasdi.
Sandiq modali `Math.random()` bilan "mukofot" tanlab, hech narsa
bermasdi va katalogda yo'q moddalarni ko'rsatardi.

## 3. Rang sinf ichida yozilmaydi

Sayt to'rtta fonda ishlaydi (`tun`, `siyoh`, `grafit`, `kunduz`).

- Faqat `--v3-*` CSS o'zgaruvchilari: `--v3-fon`, `--v3-yuza`,
  `--v3-chiziq`, `--v3-matn`, `--v3-xira`, `--v3-urgu`, `--v3-urgu-matn`.
- Tailwind faqat joylashuv uchun (flex, grid, spacing).
- `bg-slate-900`, `text-purple-300` yozilgan zahoti sahifa "kunduz"
  fonida buziladi.
- Istisno: **ma'noga** bog'liq ranglar (nodirlik darajasi, xavf) qolishi
  mumkin — lekin ular yorug' fonda ham o'qilishi shart.

**Tuzoq:** `backdrop-filter` stacking context yaratadi. Ichkaridagi
`z-50` faqat o'sha element ichida ishlaydi — ota elementga ham
`relative z-*` kerak, aks holda ochiladigan ro'yxat canvas ortida
yo'qoladi.

## 4. Generatsiya qilingan fayllarni qo'lda tahrirlamang

`data/laboratoriya/reagentlar.js` sarlavhasida "AVTOMATIK YARATILGAN"
deb yozilgan. Uni tahrirlash bekor ketadi.

```
node scripts/gen-lab-reagentlar.js    # katalogni qayta yasaydi
node scripts/seed-lab-katalog.js      # bazaga yozadi
```

Qo'lda qo'shiladigan narsa (masalan suv variantlari) `lib/` dagi
moduldan seed skripti orqali tushadi.

## 5. Migratsiya tartibi

```
npx prisma migrate deploy
node scripts/seed-lab-katalog.js
node scripts/lab-miqdor-toldir.js     # kerak bo'lsa
```

Migratsiya SQL'i faqat **ustun qo'shadi**. Ma'lumotni to'ldirish
skriptda bo'ladi — chunki qiymat `lib/` dagi qoidadan chiqadi va uni
SQL ichida qayta yozish ikkinchi manba yaratardi.

## 6. Vaqtinchalik fayl commit qilinmaydi

Sinov uchun sahifa yasasangiz (`oldindan-korish` kabi), **commitdan
oldin o'chiring**. Bir marta u commit bo'lib, jonli manzil bo'lib
qolgan.

## 7. Muhim ma'lumot shakllari

Bularni yodda tuting — noto'g'ri maydon o'qish jim buzilishga olib
keladi (xato bermaydi, shunchaki `undefined` bo'ladi):

```js
// Idishdagi modda — lib/idish-holati.js
holat.moddalar[kalit] = { ml: 50, mol: 0.025 }
//   `.hajm` yoki `.konsentratsiya` YO'Q.
//   Konsentratsiya kerak bo'lsa: mol / (ml / 1000)

// Inventar — LabItem
{ miqdor: 75, soni: 3 }
//   `miqdor` — HAQIQAT (ml yoki gramm)
//   `soni`   — undan hosila, PASTGA yaxlitlangan, faqat eski interfeys uchun
//   Mavjudlikni `miqdor` bo'yicha tekshiring: 12.5 ml qolganda `soni` 0 bo'ladi
```

**Buzilganda nima bo'lgan:** pH-metr va tarozi `.hajm` ni o'qigan —
bunday maydon yo'q. Natijada 50 ml kislota quyilganda ham pH 7.0
"Neytral" ko'rsatgan, tarozi esa suyuqlik massasini 0 deb turgan.

## 8. Tekshirish

- **Da'vo qilishdan oldin ishga tushiring.** "Tuzatdim" deyish uchun
  natijani ko'rish kerak.
- **Prisma `select` ni o'zgartirsangiz, bazaga bitta so'rov yuboring.**
  Noto'g'ri maydon nomi build'da TUTILMAYDI — u faqat ish vaqtida
  "Unknown field ... for select statement" bo'lib chiqadi va butun
  so'rovni yiqitadi. Maydon nomini sxemadan o'qing, taxmin qilmang:
  loyihada nomlar o'zbekcha va inglizcha aralash (`User.fullName`,
  `User.username` bor, `User.name` YO'Q).
- `npx next build` — ishlab turgan dev serverni yiqitadi (Windows,
  `.next` to'qnashuvi). Build'dan keyin qayta ishga tushiring.
- 3D laboratoriya sahifasi login talab qiladi. Uni brauzerda ko'rish
  uchun vaqtinchalik sahifa yasab, sahna grafini `window.__sahna` ga
  chiqarib tekshirish mumkin — **keyin o'chiring** (6-band).
- Neon bazasi uxlab qoladi: birinchi so'rov xato bersa, 3–4 soniyadan
  keyin qayta urining.

## 9. Vercel deploy ba'zan sababsiz yiqiladi

Bir xil daraxt bir marta qizil, keyin yashil tushgan. Kodni qidirmang —
avval **qayta deploy** qiling. Tekshirilgan va sabab EMASligi
aniqlangan: mahalliy build, `prisma generate`, xotira chegarasi,
paket versiyalari, `vercel.json`.

Jonli saytda kod chiqqanini tekshirish: sahifadan chunk yo'llarini olib,
ularni yangi qo'shilgan matn bo'yicha qidiring. HTML ni qidirish yetmaydi
— satr client bo'lagida yashaydi.

## 10. Ishning ko'lami

- So'ralgan ishni qiling. Yo'l-yo'lakay topilgan nuqsonni **ayting**,
  lekin so'ralmagan joyni qayta yozmang.
- Katta o'zgarishni bosqichga bo'ling va har bosqichdan keyin sayt
  ishlab turishini ta'minlang. Eski maydonni darrov o'chirmang — avval
  yangisi hamma joyda ishlasin.
- Xato topsangiz, uni **isbotlang** (kichik skript, haqiqiy ma'lumot),
  keyin tuzating.

## 11. 3D grafika — ko'z bilan ko'rmasdan tegilmaydi

Bu band 2026-08-19 dan keyin yozildi. O'sha kuni sahna grafikasini
yaxshilash uchun 6 ta kommit qilindi: bloom, qo'shimcha `RectAreaLight`,
protsedural teksturalar. Har biri "dev server 200 qaytardi" deb tasdiqlandi.
Jonli saytda esa **pol butunlay oq kuyib**, ship qop-qora bo'lib chiqdi —
ya'ni oltita kommit sahnani yaxshilamadi, buzdi.

Sabab: sahna allaqachon 3–4 barobar ortiq yoritilgan edi, bloom esa aynan
ortiqcha yorug'likni kuchaytiradi. Buni `grep` bilan topib bo'lmaydi.

### 11.1 Grafik o'zgarish O'LCHOVSIZ tugallanmagan hisoblanadi

Bu band avval "skrinshotsiz tugallanmagan" deb yozilgan edi. **Xato
qoida edi:** loyihada ishlaydigan agentlarning bir qismi rasm ko'ra
olmaydi, ya'ni qoidani strukturaviy bajara olmaydi. Bajarib bo'lmaydigan
qoida bajarilmaydi — 19-avgustda aynan shunday bo'ldi.

Dalil **son** bo'lishi kerak, ko'z emas:

- `npm run lab3d:olcham` — 4 mavzu × 3 kamera nuqtasida kuygan piksel
  ulushi, o'rtacha luma, ship/pol farqi, FPS va `renderer.info`.
  Asbob va chegaralar: `docs/3d-lab/OLCHOV.md`.
- **Oldin va keyin o'lchang.** Bitta "keyin" jadvali dalil emas —
  taqqoslash dalil.
- Kompilyatsiya o'tgani, `200` qaytgani va konsol toza bo'lgani grafik
  uchun dalil EMAS. Bu uchtasi 19-avgustdagi olti kommitning hammasida
  yashil edi.
- Skrinshot baribir foydali, lekin u **odamning** tekshiruvi: son
  chegarada turgani bilan sahna xunuk bo'lishi mumkin. Ko'ra oladigan
  ishtirokchi rasmga qaraydi; ko'ra olmaydigani sonni keltiradi.
- O'lchov asbobi ishlamasa, ishni **tugallanmagan** deb belgilang.
  "Ehtimol yaxshi bo'ldi" deb commit qilinmaydi.

### 11.2 Yorug'likning yagona egasi bor

Hozir yorug'lik **ikki joydan** qo'shiladi va ikkalasi bir-birini bilmaydi:
`hooks/useSahna.js` (ambient + 2 directional) va `lib/xona-modellari.js`
(yana bitta directional 1.4, `RectAreaLight` lar 1.4, `PointLight` 1.0).
Ustiga `scene.environment` (RoomEnvironment IBL) qo'shiladi. Jami byudjet
hech qayerda yozilmagan — shuning uchun hech kim uni oshirib yuborganini
sezmagan. Bu 1-bandning yorug'likka tushirilgan ko'rinishi.

- Yangi yorug'lik manbai **faqat** yorug'lik byudjeti faylidan qo'shiladi.
- Model yasovchi fayl (`*-modellari.js`) yorug'lik yaratmaydi. U geometriya
  va material qaytaradi, xolos.
- Ekspozitsiya (`toneMappingExposure`) — bitta joyda, bitta son.
- three.js r165 dan beri fizik jihatdan to'g'ri yorug'lik **majburiy**
  (`useLegacyLights` olib tashlangan). Eski qo'llanmalardan ko'chirilgan
  `intensity` qiymatlari 3–5 barobar oshiq bo'ladi.

### 11.3 `MeshBasicMaterial` — yoritiladigan sirtga ishlatilmaydi

`MeshBasicMaterial` yorug'likka umuman bo'ysunmaydi: u har doim to'liq
yorqinlikda turadi. Shift chiroq panellari `0xf8fafc` bilan aynan shunday
yozilgan va bloom ostonasidan doim yuqori bo'lgani uchun jonli sahnada
"yonib" ketgan.

- Faqat chinakam nur chiqaradigan narsaga (EXIT belgisi, LED, ekran) va
  faqat bloom ostonasi bilan kelishilgan holda ishlatiladi.
- Boshqa hamma joyda `MeshStandardMaterial` + kerak bo'lsa `emissive`.

### 11.4 Postprocessing kalibrlanmagan sahnaga qo'shilmaydi

Bloom, SSAO, SSR — bular sahnaning **kamchiligini yashirmaydi, kattalashtiradi**.

- Bloom ostonasi sahnaning o'rtacha yorqinligidan **yuqori** bo'lishi shart.
  Sahna o'rtachasi 1.0 bo'lsa, 0.55 ostona butun kadrni yoritadi.
- Tartib: avval ekspozitsiya kalibrovkasi → keyin material → keyin effekt.
  `docs/3d-lab/YOL-XARITASI.md` dagi piramida shu tartibni belgilaydi.

### 11.5 Soya qamrovi xona o'lchamiga mos bo'lishi shart

Xona 16 × 12 m, soya kamerasi esa ±2.6 m ni qamragan — ya'ni pol yuzasining
**14%**. Qolgan hamma narsa (javon, rakovina, deraza) soyasiz qolgan va
shuning uchun devorga yopishtirilgandek ko'ringan. Bundan tashqari
`xona-modellari.js` ning 1523 qatorida `castShadow` atigi **bir marta**
uchraydi: xonadagi hech narsa soya tashlamaydi.

- Soya kamerasining chegarasi xona o'lchamidan hisoblanadi, qo'lda
  yozilmaydi.
- Yangi ob'ekt qo'shsangiz, `castShadow` va `receiveShadow` ni ataylab
  qaror qiling. Sukut bo'yicha `false` — ya'ni yozmaslik "soya yo'q" degani.

### 11.6 Asset qoidalari

- 3D modellar `public/3d/` da, `.glb` (Draco siqilgan). Teksturalar KTX2.
- Yangi asset qo'shishdan oldin hajmini yozing. Sahifaning 3D yuki
  jami **12 MB** dan oshmasin — mobil internetda sahifa ochilmay qoladi.
- Har yuklangan asset uchun `dispose()` yo'li bo'lishi shart. Xotira
  sizishi 3D da darrov sezilmaydi — u 10 daqiqadan keyin tab'ni yiqitadi.
- Asset yuklovchi bitta bo'ladi (kesh bilan). Ikkinchi `GLTFLoader`
  yozilmaydi.

### 11.7 Fayl hajmi — parallel ishlash sharti

`xona-modellari.js` 1523 qator, `korinish.js` 1260, `jihoz-modellari.js`
1158. Bunday fayllarda ikki agent bir vaqtda ishlay olmaydi — har safar
konflikt chiqadi.

- 3D fayl **600 qatordan** oshsa, keyingi ish uni bo'lishdan boshlanadi.
- Bo'lish chegarasi mazmun bo'yicha: bitta fayl — bitta ob'ekt oilasi.

---

## Loyiha haqida qisqacha

Next.js 16 (App Router) · Prisma 5 + PostgreSQL (Neon) · sof Three.js
(`@react-three/fiber` YO'Q, sahna imperativ yoziladi) · TypeScript yo'q.

3D laboratoriya: `app/laboratoriya/3d/` — sahna, hooklar va interfeys.
Kimyo mantig'i va server hakamligi esa `lib/lab-*.js` da.
