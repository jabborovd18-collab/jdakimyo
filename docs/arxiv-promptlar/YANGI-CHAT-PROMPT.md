# Yangi chat uchun prompt

> Quyidagi matnni yangi chatga to'liq nusxalab tashlang.

---

Salom. jdakimyo.uz loyihasida ishlashda davom etamiz. Oldingi chat
tokeni to'lgani uchun yangi chat ochdim.

**Avval xotirangdagi yozuvlarni o'qib chiq** — `MEMORY.md` dagi
hammasi, ayniqsa `loyiha-holati-2026-08`, `xavfsizlik-holati`,
`email-va-doska`, `missiya-va-sovga`, `tasdiq-va-premium`,
`ustoz-paneli`, `admin-huquqlari`, `windows-prisma-tuzoqlari`,
`deploy-va-tekshirish`. Keyin `git log --oneline -12` va
`npx prisma migrate status` bilan holatni tasdiqla.

## Loyiha haqida

jdakimyo.uz — o'zbek tilidagi kimyo platformasi (kompleks birikmalar).
Next.js 16 + Prisma 5 + Neon Postgres, Vercel'da. `main` ga push =
deploy (~3–5 daqiqa). Migratsiyalar qo'lda: `npx prisma migrate deploy`.

Kod va izohlar **o'zbek tilida**. Izohlar "nima qilinganini" emas,
**"nega shunday qilinganini"** tushuntiradi — mavjud fayllarga qarang
(`lib/sovga.js`, `lib/doska.js`, `lib/missions.js`, `lib/roles.js`).

## 2026-08-04 da qilingan ishlar (hammasi deploy qilingan)

**SEO (1-bosqich tugadi).** 117 sahifaga o'z sarlavhasi va tavsifi
berildi. `"use client"` sahifalar `page.js` (metadata) + `korinish.js`
(ko'rinish) ga bo'lindi — **yangi client sahifaga sarlavha kerak
bo'lsa shu naqsh ishlatiladi**. Sitemap 15 → 126 manzil va o'z-o'zini
boqadi: sahifa metadata'ga ega bo'lsa ro'yxatga o'zi tushadi
(`scripts/gen-sitemap-royxat.js`). Canonical host — `www.jdakimyo.uz`.
Search Console tasdiqlangan, sitemap yuborilgan.

**Ustozlik ikkilamchi rol bo'ldi.** `User.isTeacher` — asosiy rol
o'zgarmaydi, admin ham ustoz bo'la oladi. Tekshiruv:
`ustozPaneliOchiqmi(user)` (`lib/roles.js`). Moderator ustoz paneliga
kirmaydi.

**Tasdiq belgisi (galochka) + premium bezaklar.** Faqat superadmin
beradi. Besh bezak (kosmik, guluzor, oltin, zumrad, tungi), tasdiqlangan
hisob o'zi tanlaydi. Belgi profil, do'stlar, chat va muhokamada
ko'rinadi. **Kelajakda pullik obuna bilan beriladi** — shuning uchun
premium ko'rinish jiddiy qilingan.

**Rozilik oqimi.** Ustoz talabani endi qo'shmaydi — TAKLIF qiladi.
`TeacherStudent.holat` = sorov/faol/rad. Talaba `/profil/ustozim` da
qabul qiladi yoki chiqib ketadi. **A'zolik tekshiruvi olti joyda
alohida yozilgan** — yangi joyda `holat: 'faol'` ni qo'shishni unutmang.

**Kunlik missiyalar.** 6 talik hovuzdan har kuni 3 tasi (sanadan
hisoblanadi). **Har bir missiyada `tekshir` funksiyasi majburiy** —
avval bajarilganlik umuman tekshirilmasdi va tugmani bosgan odam
bepul tanga olardi.

**Sovg'a tizimi.** Kuniga bitta, qabul qilinganda ikkalasiga 5 tanga,
Toshkent yarim tunida kuyadi. Cheklov bazada (`@@unique`).

**Email tasdig'i.** Format + bir martalik domenlar rad etiladi, keyin
6 xonali kod. **Tasdiqlanmagan hisob tanga topa olmaydi** (missiya,
sovg'a, bepul sandiq) — ko'p akkauntga asosiy to'siq shu. Pochta
Resend orqali (`lib/pochta.js`, paketsiz).

**Elektron doska (QR kirish).** `/doska` da QR chiqadi, o'qituvchi
telefondan skanerlab tasdiqlaydi, parol terilmaydi. 1/2/4 soatdan keyin
o'zi chiqadi. Yo'l bosh sahifa sarlavhasida va login sahifasida.

**Vazifaga fayl biriktirish** ishladi (Vercel Blob, oq ro'yxat, 8 MB).

**Xavfsizlik.** Login'da 5 xatodan keyin 15 daqiqalik to'siq;
foydalanuvchi enumeratsiyasi yopildi (yagona xato xabari).

## KEYINGI ISHLAR

**1. IP bo'yicha tezlik cheklovi (eng muhim, xavfsizlik).**
Ro'yxatdan o'tish va login'da IP cheklovi yo'q. Bir IP dan ko'plab
hisob ochish mumkin va har biri xat yuboradi — begona pochtani xat
bilan to'ldirish va Resend kvotasini yoqish yo'li. Batafsil:
`xavfsizlik-holati` xotirasi.

**2. SEO 3-bosqich.** OG rasm (havola ulashilganda hozir bo'sh chiqadi)
va JSON-LD (`LearningResource` / `Article`).

**3. `/birikmalar` haqida qaror.** `Compound` jadvali BO'SH,
`/api/compounds` yo'q, sahifa deyarli bo'sh — lekin sitemapda 0.9
muhimlik bilan turibdi. Uch yo'l: bazani to'ldirish, sitemapdan olib
tashlash yoki `/ilmiy/birikmalar` ga yo'naltirish. **Egasi qaror
qilishi kerak.**

**4. `app/oquv/fazoviy/chiziqli/3d/page.js` bo'sh (0 qator).**
Commit qilinmagan, lekin `npx next build` ni BUTUNLAY TO'XTATADI.
Build oldidan `git stash push -- app/oquv/fazoviy/chiziqli/3d/page.js`,
keyin `git stash pop`. **Hech qachon commitga qo'shmang.**

**5. Boshqa ochiq qarzlar:** 207 reaksiya tasdiqlanmagan
(`isVerified = false`), `gems` topish yo'li yo'q, 11 ta buzuq ichki
havola, reaksiya toifalarida takror nomlar, moderator hisobi bilan
sinovdan o'tkazilmagan.

## Ish uslubi

- Har qadamdan keyin `npx next build` (dev server ishlaganda
  `npm run build` EPERM beradi)
- Jonli sinovdan o'tkaz, keyin commit va push
- Commit xabari o'zbekcha, **nima uchun** qilinganini tushuntiradi
- **Sinov uchun bazaga tekkan bo'lsang, albatta qaytarib qo'y**
- Neon uxlaydi: birinchi so'rov `P1001` bersa, ikkinchisida uyg'onadi
- Ishchi papkada egasining commit qilinmagan 13 ta fayli bor —
  **ularga tegmang**, faqat o'zingiz tahrirlagan fayllarni stage qiling
- `curl` da har doim `-L` va `www.jdakimyo.uz` (aks holda 307)
