# 3D Laboratoriya — yo'l xaritasi

> **Bu fayl yagona manba.** 3D laboratoriya bo'yicha reja, holat va navbat
> faqat shu yerda yoziladi. Boshqa joyda ikkinchi reja paydo bo'lsa —
> AGENTS.md 1-band buzilgan bo'ladi (`docs/arxiv-promptlar/` shu xatoning
> qoldig'i).

**Maqsad:** brauzerda ishlaydigan, 4K ekranda haqiqiy fotosuratdan
ajratib bo'lmaydigan kimyo laboratoriyasi simulyatori.

---

## Nega hozirgi yo'l 4K ga olib bormaydi

O'lchangan holat (2026-08-20):

| Ko'rsatkich | Qiymat | Ma'nosi |
|---|---|---|
| 3D model fayllari (`.glb`) | **0** | Butun xona qo'lda `BoxGeometry` dan yasalgan |
| HDRI muhit fayllari | **0** | Aks etadigan haqiqiy dunyo yo'q |
| PBR tekstura xaritalari (normal/roughness/AO) | **0** | Sirtlarda mayda relyef yo'q |
| Protsedural primitivlar | **193** | 79 silindr, 56 quti, 13 shar... |
| `MeshStandardMaterial` | 100 ta | Har biri qo'lda sozlangan |
| `MeshBasicMaterial` | 16 ta | Faqat ekran, LED, alanga va effektlarda; qattiq sirtlar Standard |
| Eng katta fayl | `xona-modellari.js` — 1523 qator | Ikki agent bir vaqtda tega olmaydi |

**Xulosa:** muammo kod sifatida emas. Kod yaxshi yozilgan. Muammo shundaki,
**qo'lda yozilgan primitivlarning sifat shifti bor** va loyiha o'sha shiftga
allaqachon urilgan. `CylinderGeometry` ni 6 dan 32 segmentga ko'tarish
silliqlik beradi, lekin probirkani haqiqiy qilmaydi — haqiqiy qiladigan
narsa mayda nuqsonlar, barmoq izlari, shisha qalinligining notekisligi.
Bularni kod bilan yozib bo'lmaydi, ular **teksturada** keladi.

Shuning uchun 0-qavat — asset quvuri. Usiz yuqoridagi hamma ish bo'yoqni
karton ustiga surtish bo'lib qoladi.

---

## Piramida — pastdan yuqoriga

Qoida: **quyi qavat tugamaguncha yuqori qavatga chiqilmaydi.** Sabab
tarixiy: 19-avgustda bloom (3-qavat ishi) 0-qavat sozlanmagan sahnaga
qo'shildi va ekran butunlay oqarib ketdi — pastki qavat noto'g'ri bo'lsa,
yuqori qavat xatoni **kuchaytiradi**, yashirmaydi.

```
        ┌──────────────────────────────┐
   4    │  SAYQAL — 4K, DRS, sayqal    │   eng oxirida
        ├──────────────────────────────┤
   3    │  POSTPROCESSING — bloom,SSAO │
        ├──────────────────────────────┤
   2    │  MAZMUN — jihoz, xona, detal │
        ├──────────────────────────────┤
   1    │  MUHIT — HDRI, soya, material│
        ├──────────────────────────────┤
   0    │  POYDEVOR — asset, yorug'lik │   hozir shu yerdamiz
        │  byudjeti, sifat darajalari  │
        └──────────────────────────────┘
```

---

## Uch pog'ona — 2026-08-20 qarori

Egasi telefonda sinab ko'rdi va qurilma cho'kdi. Savol tug'ildi: hozirgi
grafikada ham telefon qotsa, 4K ga o'tganda nima bo'ladi?

Javob: **bitta sahna ta'rifi telefonga ham, 4K ga ham xizmat qila
olmaydi.** 4K ko'proq talab qiladi, telefon kamroq. Shuning uchun maqsad
bo'lindi:

| Profil | Muhit | Maqsad | Yurish |
|---|---|---|---|
| `telefon` | Mobil brauzer va WebView | **60 FPS, silliqlik** | ✅ bor |
| `desktop` | Kompyuter brauzeri | Yuqori sifat | ✅ bor |
| `ilova` | Desktop ilova (G2) | **4K fotorealizm** | ✅ bor |

Maydonlar va boshlang'ich qiymatlar: [PROFILLAR.md](PROFILLAR.md).

**Yurish uch pog'onada ham qoladi.** Bir taklif yurishni telefonda
o'chirish edi — egasi rad etdi va haqli edi: yurish bu mahsulotning
o'zi, usiz 2D laboratoriyadan farq qolmaydi. Telefon funksiyani emas,
**ortiqcha yukni** yo'qotadi.

4K fotorealizm telefon brauzerida hech qachon bo'lmaydi — bu three.js
kamchiligi emas, mobil GPU ning fizik chegarasi. U desktop ilovada
(G2) amalga oshadi: u yerda 12 MB asset byudjeti yo'qoladi,
`devicePixelRatio` cheklovsiz, GPU to'liq.

### Telefonni tejaydigan to'rt harakat

1. **Pishirilgan yorug'lik** (0.6) — xona harakatsiz; BRIF-01 gacha uni
   13 chiroq bilan yoritish isrof edi. Lightmap → 1–2 real chiroq, fragment
   narxi ~6 barobar tushadi. Hech qanday funksiya yo'qolmaydi.
2. **Xona kichrayadi va zichlashadi** (0.4) — hozir 192 m², deyarli
   bo'sh; haqiqiy o'quv laboratoriyasi 60–100 m². Kamroq geometriya,
   soya qamrovi yetadi va his-tuyg'u yaxshilanadi.
3. **Zonali birlashtirish + LOD** (0.7) — `xona-zonalari.js` da 9 ta
   zona allaqachon ta'riflangan. Zona bo'yicha birlashtirilsa draw call
   ~200 dan ~20 ga tushadi **va** ko'rinmaydigan zona chizilmaydi.
4. **Dinamik rezolyutsiya** (0.3) — kadr vaqtiga qarab render o'lchamini
   moslash. Telefon qiynalsa piksel kamayadi, sahna emas.

### Fon almashtirgich — YOPILDI (2026-08-20)

**Egasi qarori: 3D laboratoriyaga fon almashtirgich kerak emas.**
Sahna bitta ko'rinishga ega (`tun`).

Bu uch narsani soddalashtiradi:

1. **Lightmap bitta** (0.6) — to'rtta emas, ya'ni to'rt barobar arzon
   va asset byudjetiga bemalol sig'adi.
2. **O'lchov jadvali 4 barobar qisqaradi** — 20 qator o'rniga 5
   (4 nuqta + 1 supurish). Har keyingi brif tezroq tekshiriladi.
3. **`data-fon` savoli yopildi** — HUD `SUKUT_FON` da qoladi va bu
   endi qat'iy qaror, yon ta'sir emas (`cb4cfa3` ko'rigidagi topilma).

Mavzu mashinasini olib tashlash BRIF-00C ning 2-qismiga qo'shildi —
u baribir `useSahna.js` va `materiallar.js` ni ochadi, ikki marta
o'tishning ma'nosi yo'q. Tekshirildi: `fonlar.js` faqat
`app/laboratoriya/3d/` ichida ishlatiladi, saytning umumiy `data-fon`
mavzu tizimi (`globals.css`, `lib/sahifa-fon.js`) butunlay boshqa
narsa va unga tegilmaydi.

---

### 0-QAVAT — POYDEVOR  ⬅ HOZIRGI NAVBAT

> **0.0 birinchi bo'lishi shart.** Loyihada ishlaydigan agentlarning
> bir qismi rasm ko'ra olmaydi, ya'ni grafikani ko'z bilan tekshira
> olmaydi. O'lchov asbobisiz qolgan hamma grafik ish ko'r-ko'rona
> bo'ladi — 19-avgustda aynan shunday bo'lgan (AGENTS.md 11.1).

Bu qavat tugagach sahna hali **chiroyli bo'lmaydi**, lekin *to'g'ri*
bo'ladi: oq kuyish yo'qoladi, shipdan polgacha yorug'lik mantiqiy bo'ladi
va ustiga qurish mumkin bo'ladi.

| # | Ish | Brif | Holat |
|---|---|---|---|
| 0.0 | **O'lchov asbobi** — grafikani raqam bilan tekshirish | [BRIF-00](BRIF-00-olchov-asboblari.md) | ✅ |
| 0.0B | **O'lchagichni halol qilish** — supurish, sof pol/ship nuqtasi | [BRIF-00B](BRIF-00B-olchagich-halolligi.md) | ✅ |
| 0.0C | **Sahna konfiguratsiyasi** — sifat profili + mavzu o'lchami olib tashlanadi | [BRIF-00C](BRIF-00C-sifat-profili.md) | ✅ |
| 0.1C | **Telefon xira** — chiroq kuchi profilga bog'lanadi | [BRIF-01C](BRIF-01C-profil-yoruglik-darajasi.md) | ✅ |
| K01 | **Erkin qarash va fokus** — pointer lock, blur/hidden | [BRIF-K01](BRIF-K01-sichqoncha-va-fokus.md) | ✅ |
| 0.1B | **Xiralikni tuzatish** — ekspozitsiya qaytariladi, p95 chegarasi | [BRIF-01B](BRIF-01B-xiralikni-tuzatish.md) | ⚠️ ko'rik |
| 0.1 | Yorug'lik byudjeti — **har pog'ona uchun alohida** | [BRIF-01](BRIF-01-yoruglik-byudjeti.md) | ✅ |
| 0.2 | Asset quvuri — `.glb` + KTX2 + HDRI yuklovchi, kesh, dispose | [BRIF-02](BRIF-02-asset-quvuri.md) | ✅ (HDRI qolmadi) |
| 0.3 | Sifat darajalari — 4 pog'ona + dinamik rezolyutsiya | [BRIF-03](BRIF-03-sifat-darajalari.md) | ⬜ |
| 0.4 | Xona miqyosi va devor geometriyasi qayta o'lchash | [BRIF-04](BRIF-04-xona-miqyosi.md) | ✅ |
| 0.5 | Monolit fayllarni bo'lish (1523 → modul) | [BRIF-05](BRIF-05-monolitni-bolish.md) | ⬜ |
| 0.6 | **Pishirilgan yorug'lik** — bitta lightmap, telefonda 3 real-time → 1–2 | brif yozilmagan | ⬜ |
| 0.7 | **Zonali birlashtirish + LOD** — ~200 draw call → ~20 | [BRIF-07](BRIF-07-zonali-birlashtirish.md) | ✅ (1-mezon xato edi, LOD qilinmadi) |

### QOIDA — poydevor tugamaguncha yon-brif yozilmaydi

Egasi 2026-08-21 da aniq qo'ydi: *"maqsad hozir 3d labaratoriyani
kuchaytirish, poydevori yarim yo'lda to'xtaydigani kerak emas"*.

O'sha kuni poydevordan **tashqarida** to'rtta ish qilingan edi
(G6 yorliqlar, K01 sichqoncha, fazoviy pilot, F02 regressiya), va shu
paytda `0.1C` — egasining asosiy shikoyati — ochiq turgan edi.

Ularning hammasi haqiqiy nuqson edi. Muammo ularda emas, **navbatda**.

**Endi:** topilgan nuqson yo'l xaritasiga yoziladi, lekin **brif
qilinmaydi** — poydevorning 12 bandi tugamaguncha. Istisno: jonli
saytdagi regressiya yoki xavfsizlik nuqsoni.

Bu qoida ko'rikchiga (Claude) tegishli, agentga emas. Chalg'ish brif
yozishdan boshlanadi.

### Tartib

| # | Ish | Nega shu joyda | Holat |
|---|---|---|---|
| 1 | `0.1C` telefon yorug'ligi | Egasining shikoyati, kichik, mustaqil | ✅ |
| 2 | `0.7` zonali birlashtirish + LOD | ~200 → ~20 draw call, asset talab qilmaydi | ✅ |
| 3 | `0.4` xona miqyosi + FOV 45→60 | Bitta raqam, darhol kengayadi | ✅ |
| 4 | `0.2` asset quvuri | Qolgan hammasini ochadi | ✅ |
| 5 | `0.6` pishirilgan yorug'lik | `0.2` ni talab qiladi | ⬅ NAVBAT |
| 6 | `0.3` sifat darajalari + dinamik rezolyutsiya | 60 FPS kafolati | ⬜ |
| 7 | `0.5` monolitni bo'lish | `korinish.js` 1523 qator, har brif unga tegadi | ⬜ |

`0.6` va `0.7` uchun brif hali yozilmagan.

### Kutayotgan yon-ishlar (poydevordan keyin)

K01 egasining ushbu sessiyadagi aniq tartibi bilan 0.1C dan keyin
yakunlandi; bu yangi yon-brif ochish uchun istisno emas.

- **2.5** — tajribalar 2D panelda (12/20 komponent to'liq ekranli)
- **G4** — mehmon rejimi
- **G5** — hamroh robot

**Qavat tugadi deb hisoblanadi, qachonki:**
- `npm run lab3d:olcham` tanlangan profil uchun 5 qatorlik jadval
  chiqarsa va hech bir qator chegaradan chiqmasa.
- Sahnaning hech bir pikseli ekspozitsiya kalibrovkasidan keyin `1.0` da
  qotib qolmasa (oq kuyish yo'q).
- Shipdan polgacha yorug'lik uzluksiz bo'lsa (qora ship + oq pol yo'q).
- Bitta `.glb` va bitta `.hdr` haqiqatan yuklanib, sahnada ko'rinsa.
- 4K ekranda `ilova` profili `devicePixelRatio` ni to'liq ishlatsa.
- `telefon` profilida **yurish rejimida** 60 FPS ushlansa.

---

### 1-QAVAT — MUHIT

| # | Ish | Holat |
|---|---|---|
| 1.1 | Haqiqiy laboratoriya HDRI (muhit + aks etish) | ⬜ |
| 1.2 | Soya tizimi — kaskadli yoki zonali, butun xonani qoplaydigan | ⬜ |
| 1.3 | PBR material kutubxonasi (albedo+normal+roughness+AO) | ⬜ |
| 1.4 | Deraza — teshikli devor, ram, tokcha, haqiqiy shisha | ⬜ |

### 2.5 — TAJRIBALAR DUNYO ICHIGA QAYTADI  ⬅ egasi topdi (2026-08-20)

**Muammo.** 20 ta komponentdan **12 tasi** to'liq ekranli qoplama
(`fixed inset-0`). Ular orasida laboratoriyaning ikkita asosiy
tajribasi bor: `ElektrolizStendiUI` va `TitrlashStendiUI`.

Ya'ni foydalanuvchi 3D xonaga kiradi, stendga yaqinlashadi, `E` bosadi
— va **3D olamdan butunlay chiqib ketadi**. Qolgani oddiy veb-forma.

`b0c86ba` kommiti "2D tugmalardan to'liq voz kechish va 100% jismoniy
3D olamga o'tish" degan edi. Eng muhim tajribalar uchun bu da'vo
to'g'ri emas.

**Bu xonaning bo'shligini ham tushuntiradi.** Elektroliz stendi
sahnada ustun, konus va shaffof qutidan iborat — chunki tok manbai,
elektrodlar, ampermetr va stakan HTML da chizilgan. Stollarda turishi
kerak bo'lgan asboblar panelda yashiringan.

**Yechim — diegetik panel, 2D ni butunlay yo'q qilish emas.**

Faradey qonuni formulasi, hisoblangan massani kiritish, matnli
tushuntirish — bular haqiqatan matnli vazifalar. Ularni 3D ga majburan
ko'chirish yomonroq bo'lardi (3D klaviaturada `0.150 g` terishni
tasavvur qiling).

To'g'ri taqsimot:

| 3D dunyoda | Panelda |
|---|---|
| Tok regulyatorini burash | Faradey formulasi |
| Elektrodlarni ulash | Hisob-kitob va javob kiritish |
| Katodda mis qoplanishini ko'rish | Nazariy tushuntirish |
| Anodda gaz pufakchalari | Yakuniy hisobot |

Va panel **dunyo ichida** bo'lsin — stendning o'z ekranida, butun
xonani yopmasin. Bu naqsh loyihada **allaqachon bor**: stol ustidagi
"Smart Lab Monitor" aynan shunday ob'ekt. U tajribalar uchun
ishlatilmayapti, xolos.

**Qachon:** 2-qavatdan keyin. Sabab — diegetik panel o'qilishi uchun
tekstura aniqligi va material sifati kerak (1-qavat), asbob modellari
esa asset quvurini talab qiladi (0.2). Hozir qilinsa, o'qib
bo'lmaydigan ekran chiqadi.

**Diqqat:** bu qayta yozish EMAS. Mavjud mantiq (`lib/elektroliz-dvigatel.js`,
`lib/lab-*.js`) o'z joyida qoladi — faqat u qanday ko'rsatilishi
o'zgaradi.

### 2-QAVAT — MAZMUN

| # | Ish | Holat |
|---|---|---|
| 2.1 | Shisha idishlar `.glb` ga (probirka, kolba, byuretka, stakan) | ⬜ |
| 2.2 | Jihozlar `.glb` ga (tarozi, spirtovka, shtativ, pH-metr) | ⬜ |
| 2.3 | Mebel va javonlar `.glb` ga | ⬜ |
| 2.4 | 3D dunyodagi yozuvlar — DOM yorliqlar o'rniga | ⬜ |

### 3-QAVAT — POSTPROCESSING

| # | Ish | Holat |
|---|---|---|
| 3.1 | Bloom — kalibrlangan ostona bilan qayta yoqish | ⬜ |
| 3.2 | SSAO/GTAO — sozlab yoqish | ⬜ |
| 3.3 | Ekran fazosidagi aks (SSR) yoki reflektor prob | ⬜ |
| 3.4 | Rang graduatsiyasi (LUT) — laboratoriya ohangi | ⬜ |

### 4-QAVAT — SAYQAL

| # | Ish | Holat |
|---|---|---|
| 4.1 | TAA yoki FXAA + dinamik rezolyutsiya | ⬜ |
| 4.2 | FPS qo'l modeli va idish ushlash animatsiyasi | ⬜ |
| 4.3 | Suyuqlik sirtining haqiqiy sinishi | ⬜ |
| 4.4 | Ovoz muhiti (reverb, jihoz ovozlari) | ⬜ |

---

## Skrinshotdan topilgan nuqsonlar — ildizi bilan

19-avgustdagi jonli holat (`jdakimyo.uz/laboratoriya/3d`, 3 ta skrinshot):

| Ko'rinish | Ildiz sabab | Qavat |
|---|---|---|
| Pol butunlay oq, detal yo'qolgan | Yorug'lik byudjeti ~3-4 barobar oshiq | 0.1 |
| Ship qop-qora, pol oq — bir kadrda | Shipga yorug'lik tushmaydi; `RectAreaLight` bir tomonlama | 0.1 |
| Rakovina bir tekis oq porlaydi | Materiali allaqachon Standard edi; ortiqcha yorug'lik va ekspozitsiya | 0.1 ✅ |
| Shift panellari "yonib" turadi | Basic sirt + bloom; Standard emissive'ga o'tdi, bloom o'chiq | 0.1 ✅ |
| Butun pol oq tumanga aylangan | Bloom ostonasi 0.55, sahna o'rtachasi undan yuqori | 0.1 → 3.1 |
| Pol o'ng tomoni siyohrang | Binafsha fill `0xa78bfa` neytral `0xdbeafe`ga almashtirildi | 0.1B ✅ |
| Javon, rakovina, deraza "yopishtirilgan" | Soya xaritasi xonaning 14% ini qoplaydi | 0.4 → 1.2 |
| Derazalar — tekis oq to'rtburchak | Devor bitta `PlaneGeometry`, deraza undan 2 sm oldinda | 1.4 |
| Davriy jadval devordan chiqib ketgan | Panel joylashuvi xona chegarasidan tashqarida | 0.4 |
| "Probirka", "Termometr" yorliqlari havoda | Yaqinlik ustuvorligi, masofa va ekran collision boshqaruvi qo'shildi | G6 ✅ |
| **Tajribalar 2D panelda** — 20 komponentdan 12 tasi to'liq ekranli qoplama, jumladan `ElektrolizStendiUI` va `TitrlashStendiUI` | Asboblar 3D da emas, HTML da chizilgan | **2.5** |
| Yorliqlar bir-birini bosadi (`Termometr` / `Spirtovka`), termometr ko'rsatkichi ko'rinmaydi | 25°C to'siq sifatida himoyalandi, uzoq yorliq yashiriladi | G6 ✅ |
| Elektroliz stendi geometriyasi deyarli yo'q — ustun, konus, shaffof quti | Asbob 2D panelda, 3D da modellanmagan | 2.5 |
| **Qo'ldagi idish yorlig'i ulkan** | Qo'l holatida nom yorlig'i darhol yashiriladi, HUD kartasi qoladi | G6 ✅ |
| Zal bo'm-bo'sh va juda katta | Xona 16×12 m = 192 m², stol atigi 3.2×1.6 m | 0.4 |

---

## Joriy holat

**2026-08-20** — 0.0 (`fe7c050`), 0.0B (`cb4cfa3`) va 0.0C
(`950543e`) merge qilindi. 0.1 yorug'lik byudjeti bajarildi:

- barcha `Light` va RoomEnvironment IBL egasi — `lib/yoruglik.js`;
- profil bo'yicha jami chiroq `telefon=3`, `desktop=8`, `ilova=13`;
- 0.1 yakunida `toneMappingExposure=0.87`, bloom uchalasida ham o'chiq;
- uch profil × 5 qatorning hammasida kuygan `0%`, qora `<0.7%`,
  `shipPolFarq <0.39`, byudjet buzilishi yo'q;
- BRIF-00B topgan supurish kuyishi `7.33% → 0%` bo'ldi.

Ish paytida uchta eski hisob xatosi aniqlandi: PMREM renderer talab
qiladi, fume-hood chirog'i sahnaga kirmagan, yashirin spirtovka nuri esa
kirgan; rakovina materiali allaqachon Standard edi. Jami 13 soni to'g'ri,
lekin eski ro'yxat tarkibi noto'g'ri bo'lgan. Tuzatish haqiqiy sahna
grafigi bo'yicha qilindi.

0.1B da sun'iy lokal hotspotlar bilan jadvalni aldash varianti o'lchandi
va PNG'dagi "fonar doiralari" sabab rad etildi. Tabiiy yakuniy variant:
`toneMappingExposure=0.95`, ambient `0.3`, asosiy `1.4`, neytral fill
`0xdbeafe/0.4`. Chiroq soni va materiallar o'zgarmadi. Desktop/ilovada
p95 qatorlari o'tdi; telefonda `stol p95=0.6372` (minimum 0.65) qoldi.
Yangi `ortacha` maksimumlari ham tabiiy p95 bilan bir vaqtda bajarilmadi:
stol `0.4528/0.4709/0.4694`, xona `0.4255/0.4371/0.4366`. Brif ko'rsatmasiga
ko'ra materialga tegilmadi; bu sonlar egasi ko'rigiga ochiq qoldi.

0.1C da yorug'lik darajasi profilga ajratildi. Faqat telefon
`ambient=0.9`, `asosiy=2.2` bo'ldi; desktop/ilova qiymatlari o'zgarmadi.
Telefon-desktop maksimal farqi uch nuqtada `ortacha=0.0145`, `p95=0.0195`;
chiroq soni `3/8/13`, byudjet va kuyish qorovullari saqlandi.

K01 da pointer lock API bor brauzer clientX zaxirasiga jim tushmaydi;
`20000px → 56 radian`, blur/hidden holatida yaw farqi `0`. Yorliq masofasi
`8→5 m`: `xona 2→0`, sweep maksimumi `6→4`, collision `0`. Keyingi navbat
— 0.2 asset quvuri; bloom faqat 3.1 da qayta yoqiladi.

### 2026-08-22 — 0.7 o'lchandi, 1-mezon erishib bo'lmaydigan chiqdi

Birlashtirish ishlaydi va ko'rinishga tegmaydi, lekin BRIF-07 ning
1-mezoni (`chaqiruv` yarmidan kam) **bajarilmaydi va bajarilishi
mumkin emas** — brifning o'z "TEGMA" ro'yxati bilan qarama-qarshi.

Sabab o'lchandi. Sahnada 228 mesh bor; ulardan birlashtirishga
yaroqlisi — harakatsiz geometriya — atigi ~40 tasi. Qolgani
**tanlanadigan** ob'ektlar: 20 ga yaqin reagent shishasi (bitta
materialda 41 mesh), `Tarozi_Stansiyasi` 18 mesh, jihozlar. Ularning
har biri `userData.kalit` bilan nishonga javob beradi va brifda
"alohida qolishi shart" deb yozilgan.

Ya'ni harakatsiz geometriyaning **hammasini** birlashtirsak ham
`chaqiruv` yarmiga tushmaydi. Yarmi shishalarda.

Erishilgani (asosiy shox `179c8bf` ga nisbatan, uch profil × 5 nuqta):

| nuqta | telefon | desktop / ilova |
|---|---|---|
| `stol` | 137 → 121 (−11.7%) | 252 → 226 (−10.3%) |
| `xona` | 38 → 26 (−31.6%) | 86 → 66 (−23.3%) |
| `sweep` | 39 → 32 (−17.9%) | 83 → 71 (−14.5%) |
| `ship` | 10 → 10 | 31 → 31 |
| `pol` | 3 → 3 | 24 → 24 |

Ko'rinish o'zgarmadi: `kuygan` Δ=0, `ortacha`/`p95` Δ ≤ 0.001
(chegara 0.02), `shipPolFarq` Δ ≤ 0.0002, `chiroqBudjetiBuzildi=false`,
`yorliqToqnashuvi=0`. `interaktivSoni` uch profilda ham `49 → 49`.

`uchburchak` bir nuqtada chegaradan chiqdi: telefon `ship` `30 → 42`
(+40%). Mutlaq son 12 uchburchak — birlashgan meshning chegara qutisi
kattalashgani uchun ship kamerasiga tushib qolgan. Bu 2-mezonning
o'zi haqida ham gapiradi: ±5% chegarasi 30 dan boshlanadigan songa
qo'llanganda ma'no bermaydi.

**Nima o'lchash kerak edi:** umumiy `chaqiruv` emas, **harakatsiz
geometriyaning** chaqiruvi. U 40 meshdan 13 guruhga tushdi — ya'ni
o'z sohasida mezon bajarilgan. Bu BRIF-07 ni yozishdagi xato:
maqsad "harakatsiz geometriya arzonlashsin" edi, raqam esa butun
sahnani o'lchagan.

**Keyingi chinakam nishon — shishalar.** 20 ta shisha bitta materialda
41 mesh beradi va ular xonadagi eng katta qolgan blok. Ularni
`InstancedMesh` ga o'tkazish mumkin (three.js raycast `instanceId`
qaytaradi), lekin bu interaktiv ob'ektlarning tuzilishini o'zgartiradi
— alohida brif va alohida qaror talab qiladi. BRIF-07 ning o'zida ham
bu ziddiyat bor: 2-bo'lim shishalarni `InstancedMesh` nomzodi deb
sanaydi, "Tegilmaydi" bo'limi esa ularga tegishni taqiqlaydi.

**LOD qilinmadi.** Brifning 3-bo'limi (uzoqdagi mayda ob'ektlarga
`THREE.LOD`) bajarilmadi: LOD har ob'ekt uchun ikkinchi, soddaroq
geometriya talab qiladi, loyihada esa `.glb` yo'q (0.2). Protsedural
primitivning "soddaroq" varianti qo'lda yoziladi va bu 0.2 dan keyin
arzonroq bo'ladi.

### 2026-08-22 — 0.4 bosqichma-bosqich

Brif katta va xavfli (kolliziya, yurish, barcha ob'ekt joylashuvi),
shuning uchun har qadam alohida o'lchandi:

| # | Ish | Natija |
|---|---|---|
| 1 | FOV 45 → 60 | Chegaradan chiqqan qator **1 → 0**, uch profilda ham |
| 2 | Xona o'lchami yagona manbaga | Qiymat o'zgarmadi (isbot: chaqiruv/uchburchak bit-aniqlikda bir xil) |
| 3 | Soya qamrovi + soya tashlovchilar | Javon, rakovina, jadval devorga soya tashlaydi |
| 4 | Javon to'ldirildi (egasi so'rovi) | 144 mesh qo'shildi, telefonda atigi **+7 draw call** |
| 5 | Xona **kattalashdi** (egasi qarori) | 192 → 300 m², telefonda deyarli tekin |

### Xona kattalashdi — 2026-08-22 da qaror O'ZGARDI

Yuqorida (2026-08-20) "xona KICHRAYADI" deb yozilgan edi. **Egasi
2026-08-22 da teskarisini so'radi va uchta sababdan ikkitasi o'sha
kunning ishi bilan yopilgan edi:**

| Eski sabab | Holati |
|---|---|
| Soya qamrovi yetmaydi | ✅ Yopildi — qamrov endi xona o'lchamidan hisoblanadi va u bilan birga kattalashadi |
| Bo'sh 192 m² ombor bo'lib ko'rinadi | ✅ Yopildi — devorlar uzluksiz javon qatori bilan to'ldirildi |
| Telefon unumdorligi | O'lchandi — quyida |

Xona `20 × 15 × 4.6` (300 m²) bo'ldi. Bu `sozlama.js` dagi **uch
raqam** — chunki undan oldin xonaga bog'liq hamma narsa yagona
manbaga yig'ilgan edi.

**Telefonda kattalashtirish deyarli tekin chiqdi:**

| nuqta | chaqiruv | uchburchak | ortacha |
|---|---|---|---|
| stol | 180 → 188 | 19 640 → 21 324 | 0.4479 → 0.4458 |
| xona | 73 → **68** | 9 446 → **7 494** | 0.4096 → 0.3946 |
| sweep | 94 → 95 | 6 698 → 7 618 | 0.4206 → 0.4013 |

Sabab qarshi-intuitiv, lekin mantiqiy: kattaroq xonada geometriya
UZOQROQ. Ko'proq qismi frustumdan chiqadi, qolgani tumanga singadi.
`qora` ham kamaydi (0.06 → 0.03), `chiqib` 0 da qoldi.

**Desktop/ilovada narx bor:** `stol` chaqiruv 423 → 448, uchburchak
50 766 → 57 358. Sabab — soya o'tishi: soya kamerasi butun xonani
qoplaydi, ya'ni xona kattalashsa soya o'tishi ham kattalashadi.

Soya aniqligi 88 → ~70 teksel/m ga tushdi. Bu kutilgan va yozib
qo'yilgan: kaskadli soya (CSM) 1-qavatning 1.2 ishi.

**FOV kutilmagan foyda berdi.** BRIF-01B dan beri ochiq turgan yagona
buzilish (`stol ortacha` telefonda 0.4677, chegara 0.45) FOV 60 da
`0.4323` bo'ldi. Sabab mantiqiy: kengroq burchak kadrga ko'proq
qorong'i ship va devor kiritadi, ya'ni siqilgan gistogramma yoyiladi.
OLCHOV.md "kontrast yetishmasligi" deb yozgan muammoning bir qismi
material va yorug'likka tegmasdan yechildi.

**Narxi bor va u yozib qo'yilishi kerak.** FOV 0.7 tejagan narsadan
ko'proq sarfladi:

| telefon `sweep` chaqiruv | qiymat |
|---|---|
| `179bc8bf` (0.7 dan oldin) | 39 |
| 0.7 dan keyin | 32 |
| FOV 60 dan keyin | 90 |
| soya + javon dan keyin | 97 |

Javobi rejada bor: xonani kichraytirish, pishirilgan yorug'lik (0.6)
va dinamik rezolyutsiya (0.3).

**BRIF-07 o'zini oqladi.** Javonga 144 ta yangi harakatsiz mesh
qo'shilganda telefonda `chaqiruv` atigi 7 ga oshdi — chunki
birlashtiruvchi ularni material va zona bo'yicha yig'di
(`birlashdi` 40 → 184, `guruh` 13 → 29). Birlashtirish bo'lmaganda
narx +144 bo'lardi.

**Son soyani deyarli sezmadi.** Soya qo'shilganda `ortacha` atigi
0.0018 ga o'zgardi, skrinshotda esa farq aniq. Ya'ni luma o'rtachasi
soya bor-yo'qligini o'lchamaydi — u faqat kuyish qorovuli. Bu
11.1 bandning ikkinchi yarmi: son chegarani ushlaydi, ko'rinishni
odam tekshiradi.

### 2026-08-22 — 0.2 asset quvuri qurildi

Loyihada 3D asset **umuman yo'q** edi: 0 ta `.glb`, 0 ta `.hdr`,
0 ta KTX2. Endi quvur bor va u bitta namuna bilan isbotlangan.

**Model tashqaridan olinmadi, o'zimiz yasadik.** Brif CC0 kutubxonadan
olishni taklif qilgan edi, lekin quvurni isbotlash uchun tashqi fayl
shart emas — kerak bo'lgani formatning haqiqiy `.glb` bo'lishi.
`npm run lab3d:model` stakanning shisha qobig'ini yozadi: 294 vertex,
480 uchburchak, 16 KB. Litsenziya savoli ham shu bilan yopiladi.

**Farq ko'rinadi.** Eski stakan ikkita alohida silindr edi — devor va
tub, bir-biriga ulanmagan. Shisha qalinligi yo'q, jiyak yo'q; chetdan
qaralganda idish qog'oz stakanga o'xshardi. Yangi profil haqiqiy
kesim: tashqi devor → jiyak → ichki devor → tub.
`npm run lab3d:asset-taqqos` ikkala variantni bir xil kameradan
suratga oladi (`.olcham/stakan-glb.png` va `stakan-zaxira.png`).
Narxi: +864 uchburchak.

**Sahna model kelmasa YIQILMAYDI.** Jihoz avval har doim protsedural
yasaladi; model kelganda `assetlarniQollash` uni joyida almashtiradi.
Ya'ni sahna birinchi kadrdayoq ko'rinadi va model kechiksa ham,
umuman kelmasa ham hech narsa buzilmaydi. Sinov buni majburlaydi:
`.glb` so'rovi to'sib qo'yilganda `chaqiruv`, `uchburchak` va
`interaktivSoni` normal qiymatda qoladi.

**`npm run lab3d:asset-sinov` — uchta qabul mezoni.** U yozilgan
zahoti ikkita HAQIQIY nuqson topdi:

1. `useSahna` dagi asinxron `.then()` boshqa effektning `yoqilgan`
   o'zgaruvchisiga murojaat qilardi — u qamrovda yo'q edi va sahifa
   `yoqilgan is not defined` bilan yiqilardi. Endi effektning o'z
   `sahnaTirik` bayrog'i bor.
2. **Tekstura sizishi — eski, quvurga aloqasi yo'q.** `jihozOlib`
   faqat `child.isMesh` ni bo'shatardi, idish yorlig'i esa `Sprite`.
   Ya'ni har qo'yib-olishda bitta kanvas teksturasi GPU da qolardi.
   20 martalik sinov buni `tekstura +20` deb ko'rsatdi. Bunday sizish
   3D da darrov sezilmaydi — u 10 daqiqadan keyin tab'ni yiqitadi.

**HDRI qilinmadi.** U tashqi manbadan (Poly Haven, CC0) yuklab olishni
talab qiladi va bu egasining ruxsati bilan qilinadi. Sahna hozircha
`RoomEnvironment` da qoladi. HDRI kelganda `environmentIntensity`
qayta o'lchanishi shart — BRIF-01 byudjeti shunga bog'liq.

**Draco va KTX2 tayyor, lekin ishlatilmayapti.** Dekoderlar
`public/3d/dekoder/` da o'z-o'zidan turadi (CDN emas — offline va
G2 desktop ilovasi uchun). Ular faqat mos asset kelganda yuklanadi;
hozirgi model ikkalasini ham talab qilmaydi, ya'ni tarmoqdan hech
narsa tushmaydi. 16 KB modelni Draco bilan siqish foydasiz — dekoder
o'zi 250 KB.

### 2026-08-22 — bo'shlik xonadan JAVONGA ko'chdi

Egasi jonli sahifada ko'rsatdi: javon qatorlari devorni uzluksiz
qopladi, lekin ularning ICHI o'sha 20 ta reagent shishasi bo'lib
qoldi. 24 metrlik tokchada bir hovuch shisha.

**Bu men keltirib chiqargan nuqson.** Qatorni uzaytirganda uning
mazmuni o'smasligini hisobga olmaganman. "Bo'sh ombor" tuyg'usi
yo'qolmadi — u faqat xonadan javonga ko'chdi.

Yechim — `InstancedMesh`. To'ldirish uchun yuzlab idish kerak; oddiy
mesh bo'lsa har biri o'z draw call'ini talab qilardi va BRIF-07 da
erishilgan hamma narsa yo'qolardi. Instancing esa nechta nusxa
bo'lishidan qat'i nazar bitta chaqiruv beradi. BRIF-07 ning o'zi
"javon tokchalari va shishalari" ni aynan shu usulning nomzodi deb
sanagan — endi u ishlatildi.

To'ldirgich TANLANMAYDI va o'zgarmaydi: tanlanadigan reagent 20 ta va
ular `DEVOR_JAVON_REAGENTLARI` da; qolgani muhit. Joylashuv qat'iy
urug' bilan — har yuklashda ayni.

Narxi (telefon):

| nuqta | chaqiruv | uchburchak |
|---|---|---|
| stol | 190 → **196** | 22 316 → 36 524 |
| xona | 69 → 74 | 7 602 → 19 122 |
| sweep | 95 → 97 | 7 706 → 12 122 |
| ship / pol | o'zgarmadi | o'zgarmadi |

Draw call amalda o'zgarmadi. Uchburchak esa sezilarli o'sdi va buni
yozib qo'yish kerak: 36 500 uchburchak zamonaviy telefon uchun muammo
emas, lekin `chaqiruv` bilan bir xil e'tibor talab qiladi — 0.3 sifat
darajalarida to'ldirgich zichligi profilga bog'lanishi mumkin.

### 2026-08-22 — kattalashtirish uchta narsani uzib qo'ygan edi

Egasi telefonda va kompyuterda ko'rsatdi. Xona kattalashganda javon
qatorlari xona o'lchamidan hisoblandi, LEKIN ular bilan bog'liq uchta
narsa qattiq yozilganicha qoldi va havoda osilib qoldi:

| Nima | Qayerda edi | Nima bo'ldi |
|---|---|---|
| 20 reagent shishasi | `DEVOR_JAVON_REAGENTLARI[].pos` | Devordan 2.5 m narida havoda; ikkitasi polda ko'rindi |
| Rakovina | `-(eni/2 - 2.5)` | Xona o'rtasida, tayanchsiz |
| Rakovina to'sig'i | `useYurish.js` | Ko'rinmas devor bo'lib qolgan bo'lardi |

**Ildiz sabab bitta va u AGENTS.md 1-bandi:** javon qayerda ekani IKKI
joyda yozilgan edi — qator geometriyasida (hisoblanadigan) va shisha
`pos` massivida (qattiq). Ular bir-biridan uzildi.

Endi shishalar joyi `reagentJoylari()` da qatordan hisoblanadi, `pos`
esa faqat tartib va balandlikni belgilaydi. Rakovina chap devordagi
ish yuzasiga o'rnatildi (kosa yuzaga botirilgan) va unga alohida
to'siq kerak emas — devor chegarasi o'yinchini 0.38 m oldin to'xtatadi.

**Saboq:** "yagona manbaga yig'ish" ni men xona o'lchamiga qo'lladim,
lekin xona ichidagi MAZMUNGA qo'llamadim. Kattalashtirish o'zi
xavfsiz edi — xavfli narsa yarim yig'ilgan manba edi.

### To'ldirgich shaffof emas — mobil uchun

To'ldirgich idishlar avval `transparent: true` bilan yaratilgan edi.
Shaffof sirt mobil GPU da eng qimmat narsa: alohida o'tish, saralash
va depth yozmaslik, ya'ni bir-birining ustidagi yuzlab idish ekranni
qayta-qayta bo'yaydi.

**Buni hozirgi o'lchagich KO'RSATA OLMAYDI.** `chaqiruv`, `uchburchak`
va `ortacha` shaffoflik o'zgarganda umuman qimirlamadi. O'zgarish
mobil GPU ning ma'lum xossasiga tayanadi, o'lchovga emas — va aynan
shu sabab o'lchagichga fragment narxini o'lchaydigan asbob kerak
(pastdagi yozuvga qarang).

### O'lchagich tuzatildi — FPS o'rniga kadr narxi

Quyidagi nuqson topilgach asbob tuzatildi (poydevorni mustahkamlash,
2026-08-22). Yangi maydonlar: `kadrVaqti`, `kadrVaqtiTarqoq`,
`kadrVaqti4x`, `fragmentUlushi`, `narxIshonchli`.

**Kadr qo'lda chiziladi va `gl.finish()` bilan kutiladi**, guruh
bo'lib (10 tadan) — bittalab o'lchashda taymer yaxlitlanishi
natijani yeb qo'yardi. Asosiy qiymat **eng past namuna**: shovqin
faqat vaqt qo'shadi, hech qachon kamaytirmaydi.

**Fragment va geometriya ajratiladi.** Bir xil kadr 1x va 4x
pikselda chiziladi; geometriya narxi piksel soniga bog'liq emas,
fragment narxi esa proporsional. `fragmentUlushi = F / vaqt(1x)` —
mashina tezligiga bog'liq bo'lmagan son.

Nega ulush, mutlaq millisekund emas: uch ketma-ket yugurishda
`kadrVaqti` 66–118% farq berdi (mashina band), `fragmentUlushi` esa
`stol` da 7%, `xona` da 19% ichida qoldi.

**Asbob o'z ishonchini o'zi baholaydi.** `narxIshonchli = false`
bo'lsa ulush berilmaydi. Uch shart: bufer haqiqatan 4 barobar
kattalashgan bo'lsin; kadr 0.5 ms dan qimmat bo'lsin (arzon kadrda
`performance.now()` yaxlitlanishi natijani yutadi — `pol` va `ship`
da ulush 39–229% sakragan); 4x kadr 1x dan kamida 20% qimmat bo'lsin.

Bu bugungi eng muhim saboqning davomi: **son o'zining
ishonchsizligini o'zi aytishi kerak.** FPS aytmagani uchun u uzoq
vaqt ishonchli ko'rinib turdi.

**0.6 endi ochiq.** Uning mezoni: chiroq soni kamayganda
`fragmentUlushi` tushishi shart — chiroq har piksel uchun to'lanadi.

### 4K tiniqligi — o'zgarish qilindi, foydasi ISBOTLANMADI

Egasi 4K da tiniqlashtirishni so'radi. Uch to'siq topildi va
uchalasi ham tuzatildi:

| To'siq | Holati edi |
|---|---|
| Anizotropiya | Butun 3D da bitta joyda, qattiq `4` — pol va devorda UMUMAN yo'q |
| Mipmap | Katta yuzalarda o'chirilgan (`LinearFilter`) |
| Tekstura o'lchami | Uchala profil AYNAN bitta obyektni ulashardi |

Endi `lib/tekstura-sifati.js` yagona ega, anizotropiya qurilmadan
so'raladi (`getMaxAnisotropy`), desktop teksturasi 1024/1024/512.

**LEKIN FOYDASI O'LCHANMADI va buni yashirmayman.**

O'zgarish BEPUL ekani isbotlandi: `chaqiruv`, `uchburchak`,
`ortacha`, `p95` va tekstura soni oldin/keyin AYNAN bir xil.

Foydasining o'zi esa ko'rsatilmadi. Men buning uchun `tiniqlik`
metrikasini o'ylab topgandim va u NOTO'G'RI CHIQDI — pastdagi
yozuvga qarang. 1280×720 va 2560×1440 da olingan ikki juft rasm
egasiga berildi: to'liq o'lchamda faqat odam ko'zi hal qiladi.

**EGASI TASDIQLADI (2026-08-23):** "farq bor". Ya'ni o'zgarish
ishladi va uni FAQAT KO'Z ko'rdi — asbob emas. Bu AGENTS.md 11.1
ning aynan o'zi: "ko'ra oladigan ishtirokchi rasmga qaraydi,
ko'ra olmaydigani sonni keltiradi". Bu safar son yolg'on gapirdi,
ko'z esa to'g'ri.

**Ochiq savol:** anizotropiya va mipmapning foydasi statik kadrda
deyarli ko'rinmaydi — u HARAKATDA (kamera yurganda miltillash
yo'qolishi) sezilada. Bizning o'lchagich esa faqat statik kadrni
oladi. Buni o'lchash uchun ketma-ket kadrlar orasidagi farqni
(temporal aliasing) o'lchaydigan asbob kerak.

### O'ylab topgan metrikam noto'g'ri chiqdi

`tiniqlik` deb nomlagan son aslida yuqori chastotali energiyani
o'lchaydi. Filtrlash yaxshilanganda u O'SMAYDI, balki TUSHADI —
chunki aliasing ham yuqori chastotali shovqin.

  1280×720   0.00923 -> 0.00909
  2560×1440  0.00567 -> 0.00560

Nom o'zgartirildi (`yuqoriChastota`), standart jadvaldan olib
tashlandi va majburiy maydonlar ro'yxatidan chiqarildi. Kodda va
`OLCHOV.md` da "bu son nimani ko'rsata OLMAYDI" bo'limi yozildi.

**Saboq — egasining o'z saboqi, endi menda ham:** "nima yaxshi
ko'rinadi" degan fikrni raqamga aylantirganda, raqam fikrning
faqat bir qismini ushlaydi. Men buni bilib turib, ogohlantirishni
kodga oldindan yozib qo'yib, baribir shu tuzoqqa tushdim. Farqi
shundaki, ogohlantirish tufayli uni bir yugurishda ko'rdim.

### BRIF-R01 boshlandi — va uch marta to'xtab tuzatdim

Reaksiya simulyatsiyasi (`CuSO₄ + 2NaOH → Cu(OH)₂ → CuO`) ustida
ish boshlandi. Uch marta kod yozishni to'xtatib, o'zimni tuzatishga
to'g'ri keldi — uchalasi ham AGENTS.md 1-bandi.

**1. "Yangi g'oyam" allaqachon bor edi.** Brifda "ortiqcha ishqor
cho'kmani eritadi" mexanikasini asosiy dalil qilgandim. Keyin
`AMALIY_MASHGULOTLAR` ni o'qidim: `mashgulot_5` aynan shu —
`ZnSO₄ + 2NaOH → Zn(OH)₂↓ → (ortiqcha) Na₂[Zn(OH)₄]`. Kimyoviy
jihatdan ham men kuchaytirib yuborgan edim: amfoterlik darsligi
rux, mis emas.

**2. Stexiometrik nisbatni ikkinchi manba qilib yozdim.**
Mashg'ulotga `nisbat: [{CuSO₄:1},{NaOH:2}]` qo'shgandim. Server esa
allaqachon `talabniHisobla(reaksiya, ...)` orqali nisbatni
MUVOZANATLI TENGLAMANING O'ZIDAN chiqaradi (`lib/tajriba.js`).
Koeffitsient o'zgarsa nusxam eskirardi. Olib tashlandi.

**3. X-ray profillari INDEKS bilan qidirilardi.**
`xrayProfiliniTop` `XRAY_REAKSIYALAR[4]` qaytarardi. Ro'yxatga
yangi profil qo'shilsa indekslar siljib, reaksiya JIM boshqa
molekulani ko'rsatardi — xato bermasdan, noto'g'ri kimyo o'rgatib.
`id` bo'yicha qidirishga o'tkazildi va topilmasa ogohlantiradi.
O'sha ogohlantirish darhol foyda berdi: men id ni noto'g'ri
yozgandim.

**Naqsh:** uchala holatda ham "yangi narsa qo'shaman" degan qadam
aslida "mavjud narsani takrorlayman" edi. Loyihada bir ish
boshlashdan oldin uni kim allaqachon qilganini qidirish — eng arzon
tekshiruv.

### X-ray dagi ilmiy tuzatish

Cu²⁺ yalang'och ion sifatida chizilgan edi. Suvli eritmada bunday
zarracha yo'q — u `[Cu(H₂O)₆]²⁺`. Matn akva-kompleksni eslatardi,
chizma esa uni ko'rsatmasdi: o'quvchi ko'rgan narsa matn aytgan
narsaga zid edi.

Endi Yan-Teller cho'zilgan oktaedr chiziladi va u keyingi qadamni
tushuntiradi: OH⁻ eng bo'sh bog'langan AKSIAL suvni almashtiradi.

Cu(OH)₂ ham diskret molekula emas, qatlamli polimer bo'lib
ko'rsatiladi — aynan shu uning nega jelesimon ekanini tushuntiradi.

**Masofa haqida halollik:** koordinatalar angstremda emas, lekin
NISBAT saqlangan (aksial/ekvatorial ≈ 1.19, haqiqiyga mos). Aniq
sonlar matnda, `~` bilan, va `manba` maydonida ular tuzga qarab
o'zgarishi aytilgan. Chizma o'zini aniq masshtab deb da'vo qilmaydi.

### BRIF-05 boshlandi — va build yolg'on gapirdi

Ikki monolit bo'lindi: `xona-modellari.js` (1707 -> 68 + 6 modul) va
`jihoz-modellari.js` (1184 -> 160 + 4 modul).

**Xona bo'linishi birinchi urinishdayoq to'g'ri chiqdi.** Jihoz
bo'linishida esa UCHTA import tushib qoldi:

  yorliqniBelgila  -> jihoz/yordamchi.js
  idishSigimi      -> jihoz-modellari.js
  suyuqlikYasa     -> jihoz-modellari.js

**Va uchalasi ham `npx next build` dan O'TIB KETDI.** Sabab oddiy:
aniqlanmagan identifikator JavaScriptda kompilyatsiya xatosi emas —
u faqat o'sha satr BAJARILGANDA yiqiladi. Build esa kodni
bajarmaydi.

Natijada: build yashil, sahna esa umuman qurilmaydi. Buni faqat
brauzer konsoli ko'rsatdi.

**Nima qilindi.** Bo'lish paytida asl faylning import ro'yxati bilan
solishtiruvchi vaqtinchalik skript yozildi va u qolgan ikkitasini
topdi. Uni repoga doimiy asbob qilib qo'yishga urindim, lekin regex
bu ish uchun yetarli emas: obyekt metodlari (`yangila(`, `tozala(`)
va JSX dagi `useState` sozlagichlari yolg'on signal beradi. Shovqinli
asbob yo'q asbobdan yomon — o'chirildi.

**To'g'ri yechim — ESLint `no-undef`.** U haqiqiy parser bilan
ishlaydi va aynan shu xatoni topadi. Loyihada esa ESLint sozlamasi
UMUMAN YO'Q (`.eslintrc` ham, `eslint.config` ham). Shuning uchun
hech narsa ushlamagan.

CI ga lint qo'shish allaqachon Vibe Code ga topshirilgan — takrorlash
o'rniga shu yerga yozib qo'yildi: **lint kelganda `no-undef` yoqilishi
shart**, aks holda keyingi bo'lishda ham xuddi shu xato takrorlanadi.

### Uchinchi bo'lish yangi tuzoq ochdi — qayta eksport

`javon-3d.js` (868 -> 179 + 4 modul) bo'linganda index fayl
`DEVOR_JAVON_REAGENTLARI` ni `export { ... } from` bilan qayta
eksport qilardi VA o'zi ham ishlatardi.

**Qayta eksport nomni tashqariga chiqaradi, lekin faylning O'Z
ICHIGA kiritmaydi.** Ya'ni boshqa modullar uni ko'rardi, index esa
ko'rmasdi. Build yana jim o'tdi.

Shuning uchun ish vaqti tekshiruvi doimiy asbob qilindi:
`scripts/lab3d-ish-vaqti.cjs` sahifani ochib sahna qurilishini va
konsol xatolarini tekshiradi. U bu nuqsonni DARROV ushladi.

Bo'lishdan keyingi tartib endi shunday:
  1. `npx next build`          — sintaksis va import yo'llari
  2. `node scripts/lab3d-ish-vaqti.cjs` — sahna QURILADIMI
  3. `npm run lab3d:olcham`    — sahna O'ZGARMADIMI

Ikkinchi qadamsiz birinchi va uchinchisi yetarli emas: build jim
o'tadi, o'lchov esa faqat timeout deydi va sababini aytmaydi.

**Qolgan monolitlar:** `korinish.js` 1412, `useYurish.js` 1142,
`olcham-mijoz.js` 727, `useSahna.js` 616.
Birinchi ikkitasi React hook va komponent — model quruvchilarga
qaraganda ancha xavfliroq.

### 3D qahramon uchun poydevor — ikki jim to'siq olib tashlandi

Egasi so'radi: qahramonning o'zi hozir kerak emas, lekin kelajakda
to'sqinlik qiladigan narsa bo'lmasin. To'siqlar TAXMIN QILINMADI,
koddan topildi.

**To'siq 1 — animatsiya tashlanardi.** `asset-yuklovchi.js` faqat
`gltf.scene` ni keshlar, `gltf.animations` esa yo'qolardi. Qahramon
yuklanardi, lekin yurish va turish animatsiyasi bo'lmasdi — va sababi
ko'rinmasdi, chunki model o'zi to'g'ri chiqardi.

**To'siq 2 — `clone()` skeletni buzadi.** Nusxa `asl.clone(true)` bilan
olinardi. `Object3D.clone()` suyak havolalarini qayta bog'lamaydi:
nusxa ASL skeletga ishora qilib qoladi. Ikkita qahramon bir pozada
qotib turardi yoki model buzilib ko'rinardi. three.js buning uchun
`SkeletonUtils.clone` beradi.

Ikkalasi ham hozirgi jihozlarning xulqiga tegmaydi (ularda skelet va
animatsiya yo'q) — shart faqat skeletli model kelganda ishlaydi.

**Yo'l-yo'lakay ushlangan nuqson:** kesh yozuvi shakli o'zgargach
`assetlarniTozala` buzilardi — u `Group` kutardi va endi obyekt
oladi. Bu JIM xotira sizishi bo'lardi: 3D da u darrov sezilmaydi va
10 daqiqadan keyin tab'ni yiqitadi (AGENTS.md 11.6). Tuzatildi.

**Hali qilinmagan va u ATAYLAB:** o'yinchining joyi hozir
`kamera.position` da. Qahramon uchun alohida "o'yinchi tuguni" kerak
bo'ladi va kamera undan hosila bo'ladi. Bu `useYurish.js` (1127 qator)
ga tegadi — yurish, kolliziya, nishon va qo'ldagi idish hammasi
kameradan o'qiydi. Qahramonsiz bu refaktor foydasiz risk. Qahramon
brifi yozilganda birinchi qadam shu bo'ladi.

### 0.3 — dinamik rezolyutsiya: ikki nuqson GPU ga yetmasdan topildi

Boshqaruvchi ATAYLAB sof funksiya qilib yozildi (`keyingiNisbat`):
kirgan holatni o'zgartirmaydi, tashqi hech narsaga tegmaydi. Shu
tufayli uni brauzersiz, GPU siz, sun'iy sonlar bilan yugurtirish
mumkin — va aynan shu ikkita nuqsonni topdi.

**1-nuqson — vsync tuzog'i (ko'tarilish yo'li o'lik edi).**

Dastlab "tez" sharti *kadr nishonning 0.7 barobaridan tez bo'lsin*
deb yozilgan edi. Lekin 60 Hz ekranda vsync kadrni 16.7 ms dan tez
qilishga YO'L QO'YMAYDI. Ya'ni nishon 16.7 bo'lganda shart hech
qachon rost bo'lmasdi va boshqaruvchi bir tomonlama ishlardi: bir
marta tushgan rezolyutsiya abadiy past qolardi. Bitta tasodifiy
sekinlashuv sifatni doimiy buzardi.

Endi "tez" = *nishonni ushlab turibmiz* (1.05 barobar). Boshqaruvchi
eng yuqori ushlab turiladigan rezolyutsiyaga yaqinlashadi.

**2-nuqson — sekin qurilma sekin yordam olardi.**

Oyna 30 ta KADR bilan o'lchanardi. 60 FPS da bu yarim soniya, 10 FPS
da esa uch soniya. Ya'ni qurilma qanchalik qiynalsa, boshqaruvchi
shunchalik sekin javob berardi — aynan teskarisi kerak.

O'lchandi (telefon profili, 10 soniya):

| kadr | FPS | oldin | keyin |
|---|---:|---:|---:|
| 50 ms | 20 | 0.6 | 0.6 |
| 66.7 ms | 15 | 0.6 | 0.6 |
| 100 ms | 10 | **0.7** | 0.6 |
| 200 ms | 5 | — | 0.6 |

10 FPS li qurilma 15 FPS likidan YOMONROQ natija olardi. Endi oyna
30 kadr YOKI 500 ms — qaysi biri oldin kelsa.

**Saboq:** grafik kodni GPU siz sinash mumkin bo'lgan qismga ajratish
o'zini oqladi. Ikkala nuqson ham jonli sahifada ko'z bilan deyarli
sezilmasdi (biri "vaqt o'tib sifat pasayib qoladi", ikkinchisi "juda
sekin telefonda sekin tuzatiladi"), lekin sonli simulyatsiya ularni
darhol ko'rsatdi.

### Asbob desktopda fragmentni ajrata olmadi — va buni o'zi aytdi

Yangi asbob uch profilda yugurtirildi. Telefonda ajratish ishladi,
desktopda esa `narxIshonchli = false` chiqdi. Sabab jadvalda:

| nuqta | 1x, ms | 4x, ms | 4x/1x | ajratish |
|---|---:|---:|---:|---|
| `stol` | 6.87 | 8.03 | 1.17 | — |
| `xona` | 2.80 | 1.98 | 0.71 | — |
| `ship` | 0.98 | 1.03 | 1.05 | — |
| `pol` | 1.77 | 2.45 | 1.38 | 0.128 |

Piksel nisbati uchala holatda ham aynan 4.00 — ya'ni bufer haqiqatan
kattalashgan. Demak natija shovqin emas, MA'NO: **desktopda 4 barobar
piksel kadr narxiga deyarli hech narsa qo'shmaydi.**

Sabab desktop profilida soya yoqilgani: `stol` nuqtasida 461 chaqiruv
va 111 142 uchburchak (telefonda 192 va 39 556). Soya xaritasi
geometriyani ikkinchi marta chizadi va SwiftShader — CPU rasterizatori
— aynan shunga to'laydi. Fragment ulushi shovqin ostida qoladi.

**Bu 0.6 haqida muhim xabar:** pishirilgan yorug'lik fragment narxiga
ta'sir qiladi, lekin bu muhitda uning foydasini KO'RSATIB ham
bo'lmaydi. Chiroq soni telefonda allaqachon 3 ta, ya'ni pishirishdan
foyda faqat desktop va ilovada — aynan o'lchab bo'lmaydigan joyda.

Egasi shu asosda 0.6 dan oldin 0.3 (dinamik rezolyutsiya) ni tanladi.

**Yo'l-yo'lakay topilgan kamchilik (10-band):** 4x zondi qimmat
profillarda o'zini oqlamaydi — desktopda u baribir "—" berdi, lekin
o'lchov vaqtining katta qismini yedi. "Kadr allaqachon qimmat bo'lsa
zond o'tkazib yuborilsin" degan shart qo'shilishi kerak.

**Ochiq qoldi:** desktop `stol` da `ortacha = 0.4588`, chegara 0.45.
Bu 1-qavat mezoni (`OLCHOV.md` dagi DIQQAT bo'limi) va poydevorda
tuzatilmaydi.

### O'lchagichdagi FPS ishlatib bo'lmaydi

2026-08-22 da aniqlandi. Telefon profilida yuk ikki baravar oshdi
(`chaqiruv` 137 → 190, `uchburchak` 10 686 → 22 316), FPS esa
**o'sdi**: 44.3 → 45.9. Bir xil nuqtadagi o'lchovlar tarqoqligi 49%.

Ya'ni FPS haqiqiy qurilma bilan taqqoslanmasligi yetmagandek, u
**o'zi bilan ham taqqoslanmaydi**.

Bu 0.6 (pishirilgan yorug'lik) ni bloklaydi: uning butun asosi —
fragment narxi, va uni o'lchaydigan asbob yo'q. Yo'l xaritasidagi
"fragment narxi ~6 barobar tushadi" — o'lchov emas, taxmin.

**Taklif:** FPS o'rniga sinxron render vaqti (`gl.finish()` bilan N
marta chizib, median), va bir xil kadrni 1x va 4x pikselda chizib
farqdan FRAGMENT narxini ajratish. Shundan keyingina 0.6 ning mezoni
haqiqiy bo'ladi.

### Yo'l-yo'lakay topilgan nuqsonlar (10-band — yozildi, tuzatilmadi)

1. **`tortmaShkafYasa` o'lik kod.** `xona-modellari.js:555-590`,
   `Fume_Hood` nomli tortma shkaf modeli — ta'riflangan, lekin hech
   qayerdan chaqirilmagan. 4 mesh, ~37 qator. Xona rejasida tortma
   shkaf bormi degan savol 0.4 da hal qilinadi.

1b. **Rakovina havoda turibdi.** `rakovinaYasa` faqat kosa (0.6×0.26×0.45),
   jo'mrak va quvurdan iborat; hech qanday tayanch, tumba yoki devor
   kronshteyni yo'q. Guruh `y = 0.9` da, ostida bo'shliq. Javonlarga
   tumba qo'shilgandan keyin bu yanada ko'zga tashlanadi.
1c. **Zona kameralaridagi `fov` o'qilmaydi.** `xona-zonalari.js` dagi
   9 zonaning har birida `fov: 45/46` yozilgan, lekin butun loyihada
   `KAMERA.fov` dan boshqa hech qayerda `fov` o'qilmaydi. Ya'ni bu
   9 ta qiymat hech narsa qilmaydi va o'quvchini chalg'itadi.

2. **Chegaralar ikki xil joyda va mos emas** (AGENTS.md 1-band).
   `OLCHOV.md` jadvali `stol/xona ortacha 0.28–0.42`, `pol 0.22–0.45`
   va `p95` ustunini yozadi; `scripts/lab3d-olcham.js:61` esa
   `stol/xona [0.18, 0.45]`, `pol [0.15, 0.50]` va `p95` ni umuman
   tekshirmaydi. Qaysi biri haqiqat ekani hujjatdan bilinmaydi.

---

## Kelajak g'oyalari — SHARTLI, reja emas

Bu bo'lim rejaga kirmagan, lekin muhokama qilingan g'oyalar uchun.
Har birida **qachon ma'noli bo'lishi** yozilgan. Shart bajarilmaguncha
ular ish emas — shu yerda yotadi va unutilmaydi.

### G1. Qo'shimcha domenlar (`oliykimyo.uz`, `chemlab.*`)

**Hozir foydali emas.** Sabab o'lchangan: `app/layout.js:46` dagi
`metadataBase` butun saytning canonical manzilini `www.jdakimyo.uz`
ga bog'laydi — ikkinchi domen SEO vazni bermaydi. Sessiya cookie'si
host'ga bog'langan (NextAuth sukut sozlamasi), ya'ni ikkinchi domen
tizimga kirilmagan nusxa bo'ladi. Bazaviy manzil 15 faylda 22 marta
qattiq yozilgan — email, Telegram, sertifikat PDF hammasi bitta
domenni olib yuradi.

Xavfsiz shakl bugun ham bor: ikkinchi domen 301 bilan asosiysiga
**yo'naltiriladi**. Bu brend himoyasi beradi, SEO bermaydi.

**Qachon ma'noli bo'ladi:** 3D simulyator alohida MAHSULOTGA
aylanganda — o'z auditoriyasi, o'z sahifasi, o'z narxi bo'lganda.
Ya'ni G2 bilan birga.

**Oldindan shart:** bazaviy manzil bitta konstantaga yig'ilsin
(`lib/sayt.js`). Hozirgi 22 ta nusxa 1-bandning buzilishi va domen
o'zgarishini xavfli qiladi.

### G2. 3D lab — DESKTOP ilova  ⭐ tavsiya etilgan yo'nalish

**Texnik jihatdan mumkin va nisbatan oson.** Three.js to'g'ridan-to'g'ri
ishlaydi, interfeys ham o'sha DOM — sahna ham, `3d/components/` dagi
20 ta JSX ham qayta yozilmaydi.

**Nega bu 4K maqsadiga eng yaqin yo'l:**

| Brauzerdagi cheklov | Desktop'da |
|---|---|
| Asset hajmi 12 MB (AGENTS.md 11.6) — mobil internet | **Cheklov yo'q** — assetlar ilova ichida keladi |
| `devicePixelRatio` amalda cheklangan | To'liq 4K, cheklovsiz |
| GPU brauzer sandbox'i ostida | To'liq GPU, barqaror kadr |
| Har kirishda tarmoqdan yuklash | Offline ishlaydi |
| Vercel funksiya vaqti va narxi | Tegishli emas |

Birinchi qator eng muhimi: asset byudjeti yo'qolishi bilan yuqori
aniqlikdagi tekstura va model ishlatish mumkin bo'ladi. Ya'ni
"fotosuratdan ajratib bo'lmaydigan" maqsad brauzerda emas, **aynan shu
yerda** erishiladigan narsa. Brauzer versiyasi esa taklif/namoyish
bo'lib qoladi.

**Electron yoki Tauri?** Tavsiya — **Electron**, kattaroq hajmiga
qaramay. Sabab: Tauri tizimning o'z WebView'ini ishlatadi (Windows'da
WebView2, macOS'da WKWebView, Linux'da WebKitGTK) va ularning WebGL
xatti-harakati bir xil emas. 3D ilova uchun render barqarorligi —
mahsulotning o'zi. Electron Chromium'ni o'zi bilan olib yuradi, ya'ni
har uch tizimda bir xil chiziladi.

**Kirish (auth):** noldan yozilmaydi. Loyihada `app/api/mobile/*`
allaqachon Bearer token bilan ishlaydi (cookie'siz, CORS ochiq) —
desktop ilova ham o'shani ishlatadi.

**Oldindan shart:**
- 1-qavat tugagan bo'lsin. Sahna brauzerda to'g'ri ko'rinmasa, uni
  ikkinchi platformaga ko'chirish nuqsonni ikkilantiradi.
- BRIF-02 (asset quvuri) — desktop'ning butun ustunligi shunga tayanadi.
- BRIF-03 (sifat darajalari) — desktop doim `ultra` pog'onada ishlaydi.

### G3. 3D lab — mobil ilova

**Mumkin, lekin qimmat.** Sahnaning o'zi `expo-gl` orqali ko'chadi,
interfeys ko'chmaydi: `3d/components/` dagi **20 ta JSX** Tailwind
bilan yozilgan va React Native ularni tushunmaydi — butun UI qatlami
qayta yoziladi.

Arzon muqobil: mavjud mobil ilovada WebView. Bugun ham ishlaydi, lekin
3D unumdorligi pastroq va mobil allaqachon "arzon rejim" ga tushadi
(`useSahna.kuchsizQurilmaniAniqla`).

**Qachon ma'noli bo'ladi:** G2 dan keyin. Desktop qayta yozishni talab
qilmaydi, mobil talab qiladi — arzonidan boshlanadi.

### G4. Mehmon rejimi — kirmasdan xonani aylanib ko'rish

**Arxitektura buni allaqachon qo'llab-quvvatlaydi.** Tekshirildi:

| Joy | Holat |
|---|---|
| `app/laboratoriya/3d/page.js` | Auth to'sig'i **yo'q** — sahifa ochiq, metadata boy |
| 5 ta `/api/laboratoriya/*` | Hammasi **server tomonda** himoyalangan (401) |
| `korinish.js:298` -> `:789` | 401 kelganda mijoz kirish devorini chizadi |

Ya'ni to'siq serverda emas, MIJOZDA — bitta shoxda. Xavfsizlik chegarasi
to'g'ri joyda: API'lar berkitilgan, sahifa ochiq. Mehmon rejimi qayta
qurish emas: 401 kelganda kirish devori o'rniga sahnani cheklangan
holatda yuklash.

**Nega qilishga arziydi:** hozir sahifa 200 qaytaradi va metadata
"reagentlarni millilitr aniqlik bilan quying" deb va'da qiladi, lekin
ziyoratchi ham, Google ham faqat kirish devorini ko'radi — va'da bilan
mazmun mos emas. Bundan tashqari saytning eng kuchli narsasi devor
ortida turibdi: to'g'ri tartib avval hayratlantirish, keyin ro'yxatga
olish.

**Muhim dizayn sharti:** bo'sh xonada aylanish zerikarli. Mehmon
TO'LDIRILGAN, lekin o'zgartirib bo'lmaydigan xona ko'rsin — stolda
tugagan reaksiyali 2-3 idish, ishlaydigan davriy jadval, X-Ray ko'ruvi,
xavfsizlik stansiyasi. Sarflanadigan narsa (reagent, sandiq, do'kon,
sifat-analiz) yopiq. Mehmon muzeyga kiradi, bo'sh omborga emas.

**Brif yozilganda birinchi qatori:** `/api/laboratoriya/*` yo'llarining
birortasiga TEGILMAYDI. Mehmon rejimi — mijoz kamroq chizadi degani,
server ko'proq beradi degani emas. (`1e48557` da tuzatilgan nuqsonlar
aynan shu sinf edi.)

**Qachon:** 1-qavatdan keyin. Ochiq nuqsonni ko'proq odamga ko'rsatish
uni tuzatmaydi — hozir sahna oq kuygan holatda va birinchi taassurot
bir marta bo'ladi.

### G5. Laboratoriya yordamchisi — hamroh robot

G'oya egasidan: PUBG Mobile'dagi kabi qahramon yonida yuradigan kichik
robot.

**Uning "ongi" loyihada ALLAQACHON yozilgan**, faqat modal oynalarda
beriladi:

| Mavjud tizim | Hozir qanday yetkaziladi |
|---|---|
| `lib/amaliy-mashgulotlar.js` | Qalqib chiquvchi oyna |
| `lib/ekspert-xulosa.js` | Qalqib chiquvchi oyna |
| `lib/ovoz.js` + `/api/ovoz` | Alohida |

Ya'ni robot bezak emas — mavjud mazmunning **tanasi**: xulosani popup
emas, yoningizga kelib ovoz bilan aytadi. Va G4 bilan juftlashadi:
mehmon hech narsaga tegolmaydi, robot unga gid bo'ladi — "bo'sh xona
zerikarli" muammosini aynan shu hal qiladi.

**Shart: model yasashdan OLDIN uning ishi yozilsin.** Ishi bo'lmagan
mascot — har kadrda hisoblanadigan, hech narsa bermaydigan yuk.
Kamida uchta aniq vazifa bo'lsin (masalan: amaliy mashg'ulotni
bosqichma-bosqich boshqarish, xavfsizlik qoidasi buzilganda
ogohlantirish, mehmonga xonani tanishtirish).

**Qachon:** 2-qavatdan keyin. Sabab mexanik — robot 3D model talab
qiladi, loyihada esa hozir 0 ta `.glb` bor (BRIF-02).

**Ehtiyot bo'ling:** har gapini AI dan so'ramang. Gaplarning aksari
mavjud ma'lumotdan oldindan yozilgan bo'lsin; AI faqat foydalanuvchi
o'zi savol berganda chaqirilsin. Aks holda har qadam pulga tushadi.

### G6. Yorliqlar — "o'rganuvchi rejimi" · [BRIF-G6](BRIF-G6-yorliqlar.md) ✅

G'oya egasidan (2026-08-20): 3D dunyodagi `Probirka`, `Termometr`,
`Spirtovka` yorliqlari alohida funksiya bo'lsin — boshlovchi yoqib
qo'ysa ko'rinadi, bilgan odam o'chiradi.

**Bu men o'ylagandan yaxshiroq yechim.** Men yorliqlarni *olib
tashlash* kerak deb belgilagandim (yuqoridagi nuqsonlar jadvali).
Yoqib-o'chirish esa ikkala ehtiyojni ham qondiradi: talaba
"probirka" qaysi biri ekanini bilmasa — yorliq kerak; bilsa —
xalaqit.

**Loyihaga mos keladi:** bu ta'lim platformasi, foydalanuvchilarning
bir qismi birinchi marta laboratoriya ko'radi.

**G4 bilan bog'lanadi:** mehmon rejimida yorliqlar sukut bo'yicha
YOQIQ bo'lishi kerak — mehmon hech narsaga tegolmaydi, yorliq unga
xonani tanishtiradi.

**2026-08-21 bajarildi.** `lib/yorliqlar.js` yaqinlik ustuvorligi va
ekran collision'ini har 5-kadrda hisoblaydi. Qo'ldagi idish yorlig'i
darhol yashirinadi; termometrning 25°C ko'rsatkichi to'siq sifatida
himoyalangan. HUD tugmasi `lab-3d-yorliqlar` tanlovini saqlaydi, sukut
yoqiq. O'lchagich uch profil × barcha nuqtada
`yorliqToqnashuvi=0`ni tasdiqladi.
