# BRIF-F01 — Fazoviy ko'ruvchini umumiylashtirish (PILOT)

**Agent:** Gemini (Antigravity, lokal) · **Xavf:** o'rta (mavjud sahifalar)
**Hudud:** `app/oquv/fazoviy/`, `lib/fazoviy/` — boshqa joyga tegilmaydi

---

## Holat — o'lchangan

`app/oquv/fazoviy/` da **17 ta 3D sahifa**, jami **32 142 qator**.
Taqqoslash uchun: butun 3D laboratoriya 15 400 qator.

Ular ikki guruhga bo'linadi va bu bo'linish tasodifiy:

| Guruh | Soni | Qator | Nimasi bor |
|---|---|---|---|
| Ulkan | 8 | 2 504 – 4 611 | CPK ranglar, `COMPLEXES`, `ATOM_INFO`, matn sprite, ansambl joylashuvi, **PDF eksporti** |
| Kichik | 9 | 99 – 191 | Sahna, kamera, OrbitControls, geometriya. Tamom. |

Ulkanlar: `sendvich` 4611, `dodekaedrik` 4417, `kvadrat-piramida` 4321,
`tekis-kvadrat` 4163, `oktaedrik` 4126, `chiziqli` 4046,
`trigonal-prizma` 2776, `uchburchak` 2504.

**Muammo:** bitta molekulyar ko'ruvchi **sakkiz marta** yozilgan.
CPK rang jadvali, `pdf-lib` eksporti, sprite yasovchisi — hammasi
har faylda qaytadan. Bu AGENTS.md 1-bandining ochiq buzilishi: bitta
xatoni tuzatish uchun sakkiz joyni ochish kerak.

**Ikkinchi muammo:** foydalanuvchi uchun nomutanosiblik. Oktaedrik
geometriyada PDF hisobot, atom ma'lumoti va yorliqlar bor;
tetraedrikda yo'q. Foydalanuvchi bu farqning sababini bilmaydi va
bilishi ham kerak emas.

---

## Bu brif PILOT — hammasi emas

29 000 qatorni bir pasda qayta yozish katta xavf. Shuning uchun bu
brifda **ikkita sahifa** ko'chiriladi:

| Sahifa | Qator | Nega bu |
|---|---|---|
| `oktaedrik/3d` | 4126 | Eng keng tarqalgan koordinatsion geometriya, to'liq imkoniyatli |
| `tetraedrik/3d` | 99 | Uning kichik hamkori — umumiy modul unga nima berishini ko'rsatadi |

Qolgan 15 tasi keyingi brifda, bu ikkisi ishlagandan keyin.

---

## Vazifa

### 1. `lib/fazoviy/` — umumiy modul

Sakkizta ulkan sahifada takrorlanadigan hamma narsa shu yerga chiqadi.
Kamida:

- `cpk.js` — CPK rang jadvali
- `atom-malumot.js` — `ATOM_INFO`
- `matn-sprite.js` — `makeTextSprite`
- `pdf-hisobot.js` — `pdf-lib` + `fontkit` eksporti
- `sahna.js` — sahna, kamera, renderer, OrbitControls qurilishi va
  tozalash (`dispose`)
- `korlanuvchi.jsx` — React komponenti: yuqoridagilarni yig'adi

**Bo'linish o'zing hal qil.** Yuqoridagi ro'yxat — taklif, buyruq emas.
Lekin har faylning bitta mas'uliyati bo'lsin.

### 2. Ikki sahifani ko'chirish

`oktaedrik/3d/page.js` va `tetraedrik/3d/page.js` umumiy modulni
ishlatsin. Sahifada faqat **o'ziga xos narsa** qolsin: geometriya
ta'rifi, birikmalar ro'yxati, matn.

### 3. Manzillar O'ZGARMASIN

`/oquv/fazoviy/oktaedrik/3d` va `/oquv/fazoviy/tetraedrik/3d` —
xuddi shu manzillarda qolishi **shart**.

Sabab: bu sahifalar SEO da indekslangan. Manzil o'zgarsa, Google
ro'yxatidan tushadi va qayta indekslash oylar oladi.

### 4. `tetraedrik` ni tenglashtirish

Kichik sahifa umumiy moduldan **nima olishi mumkinligini** ko'rsat:
CPK ranglar, atom yorliqlari, PDF eksporti. Nimani qo'shganingni va
nimani qo'shmaganingni sababi bilan yoz.

Bu brifning yashirin maqsadi shu: umumiy modul faqat kod tejamaydi,
u **9 ta sahifani ham yaxshilaydi**.

---

## Qabul mezonlari

1. **Ikkala manzil ham `200`** qaytaradi:
   `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/oquv/fazoviy/oktaedrik/3d`
2. **Vizual ayniylik.** Sen rasm ko'rasan — `oktaedrik/3d` ni
   o'zgarishdan oldin va keyin skrinshot qilib solishtir. Molekula
   shakli, ranglar, yorliqlar, kamera boshlang'ich holati — bir xil.
   Ikkala skrinshotni hisobotga qo'sh.
3. **PDF eksporti ishlaydi.** `oktaedrik` da PDF yasab ko'r, ochilsin
   va ichida matn bo'lsin. Bayt hajmini yoz.
4. **Qator soni tushsin.** Ikki sahifaning yig'indisi hozir 4 225.
   Yangi holatda sahifalar + `lib/fazoviy/` yig'indisi undan **kam**
   bo'lsin. Sonlarni ko'rsat.
5. **`npm run build`** — `exit 0`, yangi ogohlantirishsiz.
6. **Konsol toza** — ikkala sahifada ham xato yo'q.
7. **Xotira oqmasin.** Sahifadan chiqilganda `renderer.dispose()`,
   geometriya va materiallar bo'shatilsin. Bu 8 sahifada takrorlangan
   xato bo'lishi mumkin — tekshir va yoz.

---

## Tegilmaydi

- `app/laboratoriya/3d/` — **boshqa agent u yerda ishlayapti.**
- Boshqa 15 ta fazoviy sahifa — keyingi brifda.
- Server yo'llari, `app/api/`, Prisma, autentifikatsiya.
- Sahifalarning **matni va kimyo mazmuni** — faqat kod tuzilishi
  o'zgaradi, ma'lumot emas.
- `app/globals.css`, umumiy dizayn tizimi.

Yo'l-yo'lakay nuqson ko'rsang — **tuzatma**, hisobotda ayt
(AGENTS.md 10-band).

---

## Ish tartibi — MUHIM

Sen **lokal papkada** ishlaysan, ya'ni ko'rikchi bilan bir xil
ishchi daraxtda.

1. **`main` da ISHLAMA.** Boshlashdan oldin:
   ```
   git checkout main && git pull
   git checkout -b gemini/fazoviy-pilot
   ```
2. Ishni shu shoxda qil.
3. Tugagach commit qil va push qil:
   ```
   git push -u origin gemini/fazoviy-pilot
   ```
4. **`main` ga merge QILMA.** PR ochsang ham o'zing tasdiqlama.
   `main` da "main himoyasi" ruleset'i bor va u seni bloklaydi —
   bu xato emas, ko'rik darvozasi.
5. Push qilgach **TO'XTA** va hisobot ber.

Sabab: 2026-08-19 da lokal `main` da 78 kommit to'planib qolgan va
boshqa agent ularni ko'rmagan — butun kun shuni tuzatishga ketgan.

---

## Dalil (hisobotda)

1. Ikkala manzilning HTTP kodi.
2. `oktaedrik/3d` ning oldin va keyingi skrinshoti.
3. PDF fayl hajmi va ochilgani.
4. Qator soni: oldin / keyin, fayl bo'yicha.
5. `npm run build` chiqishi.
6. `tetraedrik` ga nima qo'shilgani va nega.
7. Yo'l-yo'lakay ko'rgan, lekin tuzatmagan nuqsonlar ro'yxati.
