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

### DATABASE_URL — TUZATILDI (2026-08-22)

**Brifning birinchi tahriri xato edi.** U shunday der edi:
*"next build jonli bazasiz ham ishlaydi"*. Vibe buni shubha ostiga
oldi va **haq chiqdi**.

Tekshirildi: `app/sitemap.js:82` da `await prisma.channel.findMany(...)`
bor — sitemap **build paytida bazaga boradi**. Lokalda `.env` mavjud,
CI da yo'q. Prisma klienti `DATABASE_URL` bo'lmasa ishga tushmaydi.

**Yechim: soxta (dummy) `DATABASE_URL`.**

Workflow'da oddiy `env` sifatida bering — **sir emas**:

```yaml
env:
  DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci"
```

Bu yolg'on emas va yashirish ham emas. Sabab:

- Prisma klienti manzilning **mavjud va to'g'ri shaklda** bo'lishini
  talab qiladi, **ishlashini** emas.
- `sitemap.js:81-97` da so'rov `try/catch` ichida va izohda aynan shu
  holat yozilgan: *"Baza javob bermasa sitemap baribir qaytadi"*.
  So'rov yiqiladi, ushlanadi, sitemap kanalsiz qaytadi.
- Bu **yagona** build-vaqt baza so'rovi (tekshirildi).

Boshqa hech qanday sir **so'ralmaydi**. `secrets.` ishlatilmaydi.

Agar shunga qaramay biror qadam ishlamasa — **o'sha qadamni chiqarib
tashla** va sababini yoz. Sirni to'qib chiqarma, `continue-on-error`
bilan yashirma.

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
