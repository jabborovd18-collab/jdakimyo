# ELAK-V01 — CI quvuri (GitHub Actions)

**Agent:** Vibe Code (Mistral) · **Xavf:** past · **Shox:** `vibe/ci-quvuri` (tayyor)
**Hudud:** faqat `.github/` — boshqa hech qayerga tegilmaydi

---

## Nega bu topshiriq

Loyihada **CI umuman yo'q** — `.github/` papkasi mavjud emas.

Bu haqiqiy bo'shliq. 2026-08-19 da bir agent oltita kommit qildi, har
birini "dev server 200 qaytardi" deb tasdiqladi, va natijada jonli
saytda ekran oqarib ketdi. CI bo'lganda o'sha oltitasi qizil chiroqda
to'xtardi.

Hozir loyihada uchta agent ishlaydi va har birining ishini odam qo'lda
tekshiradi. **Eng kam bo'lgan resurs — ko'rik vaqti.** CI uni
kamaytiradi.

Va bu elak topshirig'i: hudud butunlay bo'sh, xavf past (buzuq
workflow ilovaga ta'sir qilmaydi, faqat qizil belgi qo'yadi), natija
esa mexanik tekshiriladi — Actions yashil bo'ladimi yoki yo'q.

---

## AVVAL — o'zingni tanishtir

Kod yozishdan **oldin** hisobotda javob ber. Bu uchta savol brifning
bir qismi:

1. **Rasm ko'rasanmi?** (skrinshot berilsa tahlil qila olasanmi)
2. **Shox ocha olasanmi?** (`git checkout -b`)
3. **Push qila olasanmi?** (`git push origin`)

Taxmin qilma — bilmasang "bilmayman" deb yoz. Bu javoblar keyingi
topshiriqlar qanday yozilishini belgilaydi.

Bu bekorga so'ralmayapti: oldingi agentga "o'z shoxingni och" deb
yozilgan edi, u esa shox ocholmas ekan — natijada ishi hech kimga
yetib bormadi.

---

## Vazifa

`.github/workflows/` da bitta workflow yarat. Nomini o'zing tanla.

### Qachon ishga tushsin

- Har shoxga push bo'lganda
- `main` ga PR ochilganda

Sabab: loyihada uchta agent `arena/*`, `gemini/*`, `qwen/*` shoxlarida
ishlaydi. Ular push qilganda CI avtomatik tekshirsin — ko'rikchi
qo'lda build qilmasin.

### Nima tekshirsin

1. `npm ci`
2. `npx prisma generate`
3. `npx next build`
4. `node scripts/check-reactions.js` — loyihadagi mavjud tekshiruv
   skripti (238 reaksiya muvozanatini tekshiradi)

### MUHIM — sir kalit YO'Q

CI da `DATABASE_URL` va boshqa sirlar **mavjud emas** va ularni
so'rama.

`next build` jonli bazasiz ham ishlaydi — statik sahifalar
generatsiyasida Neon uxlab qolgani haqida **ogohlantirish** chiqadi,
lekin build tugaydi. Buni sinab ko'r; agar biror qadam sirsiz
ishlamasa — **o'sha qadamni chiqarib tashla** va sababini yoz.

Yashil bo'lishi uchun sirni "to'qib chiqarish" yoki qadamni
`continue-on-error` bilan yashirish **taqiqlanadi**. Yashil chiroq
yolg'on bo'lsa, u chiroqsizdan yomonroq.

### Node versiyasi

`package.json` ga qara. Aniq yozilmagan bo'lsa, LTS ishlat va tanlovni
izohla.

---

## Qabul mezonlari

1. **Actions ishga tushdi va YASHIL.** `vibe/ci-quvuri` shoxiga push
   qilingandan keyin GitHub'da run paydo bo'lsin va muvaffaqiyatli
   tugasin. Run havolasini hisobotda ber.
2. **`.github/` dan tashqarida NOL o'zgarish:**
   ```
   git diff --stat main...HEAD -- . ':(exclude).github'
   ```
   bo'sh bo'lsin. `package.json` ga ham tegma.
3. Workflow **sir talab qilmasin** — `secrets.` ishlatilmasin.
4. `continue-on-error` yoki `|| true` bilan xatolar yashirilmasin.
5. Kesh ishlatilsa (`actions/cache` yoki `setup-node` ning `cache`
   parametri) — u build vaqtini kamaytirsin, lekin natijani
   o'zgartirmasin.

---

## Tegilmaydi

- `app/laboratoriya/3d/` — boshqa agent
- `app/oquv/fazoviy/`, `lib/fazoviy/` — boshqa agent
- `lib/sayt.js` va bazaviy manzil ishlari — boshqa agent
- `package.json`, `package-lock.json` — tegma
- Ilova kodi, Prisma sxemasi, sozlamalar

Yo'l-yo'lakay nuqson ko'rsang — **tuzatma**, hisobotda ayt
(AGENTS.md 10-band).

---

## Ish tartibi

Shox **allaqachon ochilgan**: `vibe/ci-quvuri`. Uni tanla.

- `main` da **ISHLAMA**
- Tugagach `vibe/ci-quvuri` ga commit va push qil
- `main` ga merge **QILMA**, PR ni o'zing tasdiqlama — `main` da
  "main himoyasi" ruleset'i bor va u seni bloklaydi. Bu xato emas,
  ko'rik darvozasi.
- Push qilgach **TO'XTA** va hisobot ber
- Push qila olmasang — **ANIQ AYT**: "push qila olmadim, ishim
  sessiyada qoldi". Ko'rinmagan ish yo'q hisoblanadi.

---

## Dalil

1. Uch savolga javob (rasm, shox, push).
2. Actions run havolasi va holati.
3. Workflow faylining to'liq mazmuni.
4. `git diff --stat` — `.github/` dan tashqarida bo'shligini isbotlash.
5. Chiqarib tashlangan qadam bo'lsa — qaysi va nega.
