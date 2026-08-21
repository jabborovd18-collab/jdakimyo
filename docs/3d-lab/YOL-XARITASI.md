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
| 0.1B | **Xiralikni tuzatish** — ekspozitsiya qaytariladi, p95 chegarasi | [BRIF-01B](BRIF-01B-xiralikni-tuzatish.md) | ⚠️ ko'rik |
| 0.1 | Yorug'lik byudjeti — **har pog'ona uchun alohida** | [BRIF-01](BRIF-01-yoruglik-byudjeti.md) | ✅ |
| 0.2 | Asset quvuri — `.glb` + KTX2 + HDRI yuklovchi, kesh, dispose | [BRIF-02](BRIF-02-asset-quvuri.md) | ⬜ |
| 0.3 | Sifat darajalari — 4 pog'ona + dinamik rezolyutsiya | [BRIF-03](BRIF-03-sifat-darajalari.md) | ⬜ |
| 0.4 | Xona miqyosi va devor geometriyasi qayta o'lchash | [BRIF-04](BRIF-04-xona-miqyosi.md) | ⬜ |
| 0.5 | Monolit fayllarni bo'lish (1523 → modul) | [BRIF-05](BRIF-05-monolitni-bolish.md) | ⬜ |
| 0.6 | **Pishirilgan yorug'lik** — bitta lightmap, telefonda 3 real-time → 1–2 | brif yozilmagan | ⬜ |
| 0.7 | **Zonali birlashtirish + LOD** — ~200 draw call → ~20 | brif yozilmagan | ⬜ |

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

| # | Ish | Nega shu joyda |
|---|---|---|
| 1 | `0.1C` telefon yorug'ligi | Egasining shikoyati, kichik, mustaqil |
| 2 | `0.7` zonali birlashtirish + LOD | ~200 → ~20 draw call, asset talab qilmaydi |
| 3 | `0.4` xona miqyosi + FOV 45→60 | Bitta raqam, darhol kengayadi |
| 4 | `0.2` asset quvuri | Qolgan hammasini ochadi |
| 5 | `0.6` pishirilgan yorug'lik | `0.2` ni talab qiladi |
| 6 | `0.3` sifat darajalari + dinamik rezolyutsiya | 60 FPS kafolati |
| 7 | `0.5` monolitni bo'lish | `korinish.js` 1523 qator, har brif unga tegadi |

`0.6` va `0.7` uchun brif hali yozilmagan.

### Kutayotgan yon-ishlar (poydevordan keyin)

- **K01** — sichqoncha erkin aylanmaydi, fokus yo'qolganda ishlaydi
  (brif yozilgan, `BRIF-K01-sichqoncha-va-fokus.md`)
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

Keyingi mustaqil ish — K01 sichqoncha/fokus. Bloom faqat 3.1 da qayta
yoqiladi.

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
