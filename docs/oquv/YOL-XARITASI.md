# Koordinatsion Kimyo O'quv Bo'limi — Yo'l Xaritasi

> **Ushbu hujjat yagona manba.** `app/oquv/` bo'limidagi barcha sahifalarni
> V3 dizayn tizimiga o'tkazish, ilmiy sifatini oshirish va modullashtirish
> rejalari faqat shu yerda yuritiladi.

**Bosh maqsad:** Koordinatsion kimyo o'quv bo'limini zamonaviy, 4 ta fon
mavzusida (`tun`, `siyoh`, `grafit`, `kunduz`) benuqson ishlaydigan,
mobil qurilmalarga mos, interaktiv va ilmiy jihatdan chuqur platformaga
aylantirish.

---

## 1. Joriy holat va asosiy kamchiliklar

O'rganish natijasida aniqlangan tizimli nuqsonlar:

| Muammo | Qayerda | Nega xato |
|---|---|---|
| **Eski qattiq ranglar (`purple-950`, `blue-900`)** | Deyarli barcha `korinish.js` fayllarida | `AGENTS.md` 3-bandi buzilgan. Kunduzgi yoki grafit mavzusida sahifa buziladi. |
| **Takrorlanuvchi UI kodlari** | 100 dan ortiq sahifalarda | Har bir sahifada header, nav, breadcrumb qo'lda qayta yozilgan. |
| **Mobil moslashuvchanlik zaifligi** | Jadvallar va formulalar | Katta jadvallar kichik ekranlarda sig'maydi yoki gorizontal scroll chiqmaydi. |
| **Statik matnlar va interaktivlik yetishmasligi** | Nomlanishi va Bog'lanish bo'limlari | O'quvchi faqat matn o'qiydi; formula konstruktori, interaktiv ligand tanlagich yo'q. |
| **`localStorage` ga bog'langan soxta progress** | `nomlanishi`, `izomeriyasi` | Serverga bog'lanmagan, profil bilan sinxronlashmaydi. |

---

## 2. Yangilanish Bosqichlari (Piramida)

```
        ┌──────────────────────────────────────────────┐
   5    │  INTERAKTIVLIK — Konstruktorlar, Quizlar     │   eng yuqori
        ├──────────────────────────────────────────────┤
   4    │  IZOMERIYA VA 3D MODELLAR — Stereo/Tuzilish  │
        ├──────────────────────────────────────────────┤
   3    │  KIMYOVIY BOG'LANISH — VB, KM, LM, Yan-Teller│
        ├──────────────────────────────────────────────┤
   2    │  KLASSIFIKATSIYA — 21 ta mavzu (V3 dizayn)   │
        ├──────────────────────────────────────────────┤
   1    │  NOMLANISHI — Verner, Formula, IUPAC, Ligand │
        ├──────────────────────────────────────────────┤
   0    │  POYDEVOR — Umumiy V3 komponentlar, Layout   │   birinchi qadam
        └──────────────────────────────────────────────┘
```

---

## 3. Bosqichma-bosqich reja

### 0-BOSQICH: POYDEVOR VA UMUMIY KOMPONENTLAR
* `components/oquv/` papkasida umumiy V3 komponentlar yaratish:
  * `OquvHeader.jsx` — yagona qidiruv va fon-mos header;
  * `OquvBreadcrumb.jsx` — avtomatik yo'l ko'rsatgich;
  * `MavzuLayout.jsx` — barcha mavzular uchun standart V3 shablon;
  * `KimyoFormula.jsx` — indekslar, zaryadlar va ligandlarni to'g'ri ko'rsatuvchi formatlagich;
  * `InteraktivJadval.jsx` — mobil qurilmada qulay ochiladigan jadval.
* `app/oquv/korinish.js` (Asosiy o'quv portali) ni `--v3-*` tizimiga to'liq o'tkazish.

### 1-BOSQICH: NOMLANISHI BO'LIMI (5 ta asosiy mavzu)
* **1.1 Verner nazariyasi (`/oquv/nomlanishi/verner`):**
  * Tarixiy tajribalar (AgCl cho'kishi) interaktiv simulyatori;
  * Ichki va tashqi sfera animatsiyasi.
* **1.2 Formula yozish (`/oquv/nomlanishi/formula`):**
  * Qavslar, ligandlar ketma-ketligi va zaryad balansi interaktiv yordamchisi.
* **1.3 IUPAC qoidalari (`/oquv/nomlanishi/iupac`):**
  * 11 ta qoidani bosqichma-bosqich interaktiv kartalarda taqdim etish.
* **1.4 Ligandlar (`/oquv/nomlanishi/ligandlar`):**
  * 5.3-jadvalni qidiruvli, filtrli va monodentat/bidentat/polidentat bo'yicha saralanadigan qilish.
* **1.5 Anion komplekslar (`/oquv/nomlanishi/anion`):**
  * Lotincha nomlar generatori va markaziy atom qo'shimchalari.

### 2-BOSQICH: KLASSIFIKATSIYA BO'LIMI (21 ta mavzu)
* **2.1 Sinf bo'yicha (`kislota`, `asos`, `tuz`):** V3 dizayn va dissotsilanish sxemalari.
* **2.2 Ligand turi bo'yicha (`akva`, `ammin`, `karbonil`, `xelat`, va h.k. — 11 ta mavzu):**
  * Har bir ligand sinfi uchun barqarorlik konstantalari va rang namunalari.
* **2.3 Zaryad bo'yicha (`kation`, `anion`, `neytral`):** Elektroforez va harakatchanlik tushuntirishlari.

### 3-BOSQICH: KIMYOVIY BOG'LANISH BO'LIMI (5 ta mavzu)
* **3.1 Valent bog'lar nazariyasi (VB) (`/vb-nazariyasi`):** gibridlanish turlari ($sp^3, d^2sp^3, sp^3d^2$) va magnit xossalari.
* **3.2 Kristall maydon nazariyasi (KM) (`/kristall-maydon`):** $e_g$ va $t_{2g}$ energetik ajralish diagrammasi (High-spin / Low-spin interaktiv selektori).
* **3.3 Ligand maydon nazariyasi (LM) (`/ligand-maydon`):** $\pi$-donor va $\pi$-akseptor ligandlar ta'siri, spektrokimyoviy qator.
* **3.4 Yan-Teller effekti (`/yan-teller`):** Oktaedrik komplekslarning cho'zilishi va siqilishi (Cu²⁺ misolida).

### 4-BOSQICH: IZOMERIYA VA 3D MODELLAR BO'LIMI (26 ta mavzu)
* **4.1 Tuzilish izomeriyasi (10 ta sahifa):** Bog'lanish, koordinatsion, ionlanish, gidrat va h.k.
* **4.2 Stereoizomeriya (Geometrik va Optik):** *cis/trans*, *fac/mer* va enantiomerlar 3D namoyishi.
* **4.3 3D interfeyslar:** Three.js yengil va optimallashtirilgan molekula vizualizatorlari.

### 5-BOSQICH: VIDEO VA TESTLAR (Quiz & Baholash)
* `lib/oquv-quiz.js` yagona manbaga ulanish;
* Har bir mavzu oxirida 5-10 talik testlar;
* Natijalarni to'g'ridan-to'g'ri foydalanuvchi profiliga (XP va yutuqlar) yozish.

### 6-BOSQICH: JDA KIMYO AI — MASALA GENERATORI VA TRENAJYOR
* **6.1 Mavzuli Masalalar Generatori:**
  * 3 xil qiyinchilik (Maktab, DTM/Milliy Sertifikat, Olimpiada);
  * 8 ta asosiy mavzu (Eritmalar, Kristallogidrat, Stexiometriya, Gazlar, Elektroliz, Organik, Muvozanat, Termokimyo).
* **6.2 "Analog Masala Kloni" (Clone & Mutate):**
  * Kiritilgan 1 ta masala andozasi asosida 3-5 ta yangi o'xshash masala generatsiya qilish.
* **6.3 Aqlli DTM Distractor Generatori:**
  * 1 ta to'g'ri + 3 ta tipik xato xulosalar bilan 4 talik mukammal test yaratish.
* **6.4 PDF Test & Worksheet Eksport:**
  * Ustozlar va abituriyentlar uchun bir bosishda chop etiladigan savolnoma va javoblar kaliti.

---

## 4. Qabul Mezonlari (Har bir sahifa uchun)

1. **Dizayn:** Hech qanday `bg-slate-900` yoki `text-purple-300` yo'q; faqat `--v3-*` o'zgaruvchilari.
2. **Responsiveness:** Telefonda (360px) ham, 4K ekranda ham matn va jadvallar buzilmasdan o'qiladi.
3. **Ilmiy aniqlik:** Barcha formulalar, zaryadlar va izohlar IUPAC 2005/2020 standartiga mos.
4. **Metadata:** Har bir sahifada qidiruv tizimlari uchun alohida server `page.js` va metadata mavjud.
5. **Build:** `npm run build` va `npm test` exit code 0 bilan yakunlanadi.
