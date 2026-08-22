# BRIF-S01 — Server hakamini sinovga o'rash

**Kim uchun:** arena AI · **Xavf:** past (kod o'zgarmaydi, sinov qo'shiladi)
**Shox:** `arena/hakam-sinovlari`

---

## Muammo — son bilan

`lib/` da **2408 qator** server tomonidagi kimyo hakami turibdi:

| Fayl | Qator | Nima hal qiladi |
|---|---:|---|
| `lib/tajriba.js` | 740 | Butun tajriba natijasi, unum, XP |
| `lib/lab-modda.js` | 473 | 242 modda: rang, holat, shaffoflik |
| `lib/lab-erituvchi.js` | 260 | Suv turi natijaga ta'siri |
| `lib/lab-idish.js` | 217 | Idish sig'imi, materiali, yaroqsizligi |
| `lib/lab-birlik.js` | 184 | O'lchov birligi va ulush |
| `lib/lab-nisbat.js` | 154 | Stexiometrik baho |
| `lib/lab-inventar.js` | 130 | Inventarni o'zgartirishning yagona yo'li |
| `lib/lab-tenglama.js` | 104 | Tenglamadan kalit ajratish |

**Bularning HECH BIRIDA sinov yo'q.** `package.json` da `test`
skripti yo'q, jest/vitest ham o'rnatilmagan.

Nega bu jiddiy: AGENTS.md 2-bandi *"server — yagona hakam"* deydi.
Balans, XP, inventar, ball — hammasi shu koddan chiqadi. Ya'ni
loyihaning eng mas'uliyatli qismi butunlay sinovsiz.

---

## Vazifa

### 1. Sinov quvuri

`node --test` (Node o'rnatilgan sinov ishga tushirgichi) ishlatiladi.
Yangi paket qo'shilmaydi — loyihada allaqachon Node 20+ bor.

- `package.json` ga: `"test": "node --test test/"`
- `.github/workflows/ci.yml` ga `npm test` qadami qo'shiladi
  (mavjud qadamlar o'zgartirilmaydi, faqat yangisi qo'shiladi)

### 2. Sinovlar

Har fayl uchun alohida sinov fayli: `test/lab-nisbat.test.js` kabi.

Quyidagi funksiyalar qamralsin (nomlar koddan olingan, taxmin emas):

| Fayl | Funksiyalar |
|---|---|
| `lab-nisbat.js` | `nisbatniBaho`, `xpKoeffitsiyenti` |
| `lab-tenglama.js` | `azoniKalitla`, `tenglamaniAjrat`, `toplamKaliti` |
| `lab-birlik.js` | `ulush`, `donadanMiqdor`, `hajmniBirlikka`, `birlikdanHajmga`, `yetadimi` |
| `lab-idish.js` | `idishmi`, `idishSigimi`, `idishXavfi` |
| `lab-erituvchi.js` | `erituvchimi`, `asosKaliti`, `erituvchiBahosi` |

`lib/tajriba.js` va `lib/lab-inventar.js` bu brifga KIRMAYDI —
ular bazaga tegadi va alohida yondashuv talab qiladi.

### 3. Har sinov nimani tekshirsin

Faqat "ishlaydi" emas — **chegara holatlari**:

- nol va manfiy kirish;
- yo'q kalit (noma'lum modda, noma'lum idish);
- bo'sh obyekt va `undefined`;
- juda katta son;
- `nisbatniBaho` uchun to'rt holatning HAMMASI:
  `togri`, `ortiqcha`, `keskin-ortiqcha`, `chala`.

---

## MUHIM QOIDA — xato topsangiz TUZATMANG

Sinov yozayotganda kodda xato topishingiz mumkin. **Uni jim
tuzatmang.**

Sabab: sinov "hozir kod nima qilyapti" ni qayd etadi. Agar siz bir
vaqtda kodni ham o'zgartirsangiz, sinov o'z o'zgarishingizni
tasdiqlaydi va hech narsa isbotlanmaydi.

Nima qilish kerak:

1. O'sha holat uchun sinov yozing va uni `test.skip` bilan
   O'CHIRIB qo'ying;
2. Yonida izoh qoldiring: kutilgan qiymat nima, olingan qiymat nima;
3. Hisobotingizda alohida ro'yxat qiling.

Qaror ko'rikchida va egasida.

---

## Qabul mezonlari

1. `npm test` → **exit 0**, barcha sinovlar o'tadi.
2. Sinov soni **kamida 40 ta**. Sonni hisobotda ko'rsating.
3. Yuqoridagi jadvaldagi **har bir funksiya** kamida bitta sinovga ega.
4. `nisbatniBaho` ning to'rtta holati ham qamralgan.
5. CI da `npm test` qadami bor va yashil.
6. **`lib/` dagi hech bir fayl o'zgarmagan.** `git diff --stat` bilan
   isbotlang — o'zgargan fayllar faqat `test/`, `package.json` va
   `.github/workflows/ci.yml` bo'lsin.
7. `npm run build` → exit 0 (sinov qo'shish build'ni buzmasin).

---

## Tegilmaydi

- `lib/` dagi mantiq — bir qator ham
- `app/laboratoriya/3d/**` — bu yerda boshqa ish ketmoqda
- `app/robots.js`, `app/sitemap.js`, `lib/sayt-malumot.js`,
  `scripts/indexnow.js`, `docs/seo/**` — SEO ishi ketmoqda
- `data/reactions/**` — kimyo mazmuni, alohida mavzu
- `prisma/`, migratsiyalar

---

## Ishni qanday tugatasiz

Shoxga **commit va push** bilan tugating. `main` ga merge qilmang,
PR ni o'zingiz tasdiqlamang, deploy qilmang — bu qadamlar sizdan
kutilmaydi va bloklangan.

Push qilganingizdan keyin to'xtang va hisobot qiling:

1. Sinovlar soni va `npm test` chiqishi;
2. `git diff --stat` (6-mezon isboti);
3. Topilgan, lekin TUZATILMAGAN xatolar ro'yxati — har biri uchun
   kutilgan va olingan qiymat.
