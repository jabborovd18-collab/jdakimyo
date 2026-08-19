# Loyiha audit — 2026-08-19

Salom. Loyihani kovlab chiqdim va quyidagi muammolarni topdim. Hammasi
skript / sitemap / fayl tuzilmasi bilan **isbotlangan** — taxminiy emas.

Tekshirilgan va **toza** bo'lgan joylar (muammo yo'q):

- `scripts/check-reactions.js` — 238 reaksiya, 0 xato (muvozanat, maydonlar).
- `scripts/audit-chuqurlashgan.js` — `/ilmiy/chuqurlashgan` da 0 buzuq havola.
- `/oquv/fazoviy/chiziqli/3d/page.js` — eski "0 qator" qarzi YO'Q, to'liq (206 KB).

---

## 1. Birikmalar katalogida buzilgan havolalar — ✅ TUZATILDI (3 tasi)

`/ilmiy/birikmalar` katalogidagi kartochkalar `href=/ilmiy/birikmalar/{slug}`
bilan quriladi, lekin ba'zi `slug` sahifa papkasiga mos kelmaydi yoki
umuman sahifa yo'q. Sitemap (avtomatik generator) to'g'ri manzillarni
ko'rsatadi — demak katalogdagi qiymat xato:

| Katalogdagi eski slug | Haqiqiy sahifa | Holat |
|---|---|---|
| `vaska` | `vaska-kompleksi` | ✅ tuzatildi |
| `wilkinson` | `wilkinson-katalizatori` | ✅ tuzatildi |
| `zeise` | `zeise-tuzi` | ✅ tuzatildi |
| `grubbs` | — (sahifa umuman yo'q) | ⚠️ qaror kerak |

Qolgan 3 tasi tuzatildi (`app/ilmiy/birikmalar/korinish.js`).

**Grubbs muammosi:** katalogda Grubbs katalizatori kartochkasi bor, lekin
`/ilmiy/birikmalar/grubbs` sahifasi mavjud emas — karta 404 ga boradi,
sitemapda ham yo'q. Ikki yo'l bor:
- **Grubbs uchun sahifa yaratish** (katalogdagi boshqa birikmalar singari
  boy sahifa) — yoki
- **kartani katalogdan olib tashlash** (sahifa yo'q ekan).

---

## 2. Element-analizda molar massa xatolari — ⚠️ tuzatish kerak

Loyihaning o'z validator `scripts/check-element-analiz.js` 4 ta xato topdi
(katalog `app/ilmiy/tahlil/element-analiz/birikmalar/page.js` da e'lon
qilingan `M` formuladagi atomlardan hisoblangan qiymatga mos kelmaydi):

| Birikma | E'lon M (katalog) | To'g'ri M | Individual sahifa |
|---|---|---|---|
| `[Fe(H₂O)₆]SO₄` | 246.02 | **259.99** | 246.022 (noto'g'ri) |
| `[Ni(en)₃]Cl₂` | 345.83 | **309.89** | 309.905 (to'g'ri) |
| `[Ru(bipy)₃]Cl₂·6H₂O` | 733.59 | **748.62** | 748.624 (to'g'ri) |
| `K₃[Cu(CN)₄]` | 341.86 | **284.91** | 280.289 (ham noto'g'ri) |

Eslatma: `M` noto'g'ri bo'lgani uchun undan hisoblangan `theoretical`
foizlar va `delta`/`status` ham xato bo'lishi mumkin. Bundan tashqari
katalog va individual sahifalar **bir-biriga mos emas** (`ni-en3-cl2`,
`ru-bipy3` sahifada to'g'ri, katalogda noto'g'ri).

---

## 3. Takroriy / yashirin birikma sahifalari — ⚠️ qaror kerak

`/ilmiy/birikmalar` da eski soddalashtirilgan nusxalar bor. Ular katalogda
ham, sitemapda ham ko'rinmaydi (faqat to'g'ridan-to'g'ri URL bilan
ochiladi) — takroriy SEO kontent:

| Eski (yashirin) sahifa | Kanonik (asl) sahifa |
|---|---|
| `k3-fe-cn6` | `k3-fe-cn-6` |
| `k4-fe-cn6` | `k4-fe-cn-6` |
| `fe-co5` | `fe-co-5` |
| `sisplatin` | `cis-pt-nh3-2-cl2` |

Ularni o'chirib, kanonik manzilga yo'naltirish kerak bo'lishi mumkin.

---

## 4. Katalogda ko'rsatilmayotgan mavjud sahifalar — ⚠️ kichik

Qurilgan va sitemapda bor, lekin birikmalar katalogida kartochkasi yo'q:
`ag-nh3-2`, `co-cl4`, `cr-h2o6`, `cu-h2o6`, `ni-cn4`, `zn-oh4`.
Katalogga qo'shilsa foydalanuvchi ularni topa oladi.

---

## 5. Orphan sahifalar (chuqurlashgan) — ⚠️ kichik

`scripts/audit-chuqurlashgan.js` shularga hech kim havola qilmasligini
ko'rsatdi (Google ularni faqat sitemap orqali topadi):
- `/ilmiy/chuqurlashgan/biorganometallik`
- `/ilmiy/chuqurlashgan/elektron-konfiguratsiya`
- `/ilmiy/chuqurlashgan/zaryad-kochishi/mlct/fotofizika`

---

## Qisqa xulosa

- **Darhol, xavfsiz tuzatilgan:** 3 ta buzuq katalog havolasi.
- **Qaror so'raladi:** Grubbs sahifasi (yaratish yoki olib tashlash),
  molar massa xatolarini tuzatish, takroriy sahifalarni tozalash.
