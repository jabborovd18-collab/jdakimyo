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
| `MeshBasicMaterial` | 22 ta | Yorug'likka bo'ysunmaydi — doim to'liq yorqin |
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
| 0.1 | Yorug'lik byudjeti — yagona manba, ekspozitsiya kalibrovkasi | [BRIF-01](BRIF-01-yoruglik-byudjeti.md) | ⬜ |
| 0.2 | Asset quvuri — `.glb` + KTX2 + HDRI yuklovchi, kesh, dispose | [BRIF-02](BRIF-02-asset-quvuri.md) | ⬜ |
| 0.3 | Sifat darajalari — 4 pog'ona + dinamik rezolyutsiya | [BRIF-03](BRIF-03-sifat-darajalari.md) | ⬜ |
| 0.4 | Xona miqyosi va devor geometriyasi qayta o'lchash | [BRIF-04](BRIF-04-xona-miqyosi.md) | ⬜ |
| 0.5 | Monolit fayllarni bo'lish (1523 → modul) | [BRIF-05](BRIF-05-monolitni-bolish.md) | ⬜ |

**Qavat tugadi deb hisoblanadi, qachonki:**
- `npm run lab3d:olcham` 20 qatorlik jadval chiqarsa va hech bir qator
  chegaradan chiqmasa.
- Sahnaning hech bir pikseli ekspozitsiya kalibrovkasidan keyin `1.0` da
  qotib qolmasa (oq kuyish yo'q).
- Shipdan polgacha yorug'lik uzluksiz bo'lsa (qora ship + oq pol yo'q).
- Bitta `.glb` va bitta `.hdr` haqiqatan yuklanib, sahnada ko'rinsa.
- 4K ekranda sifat darajasi "Ultra" da `devicePixelRatio` to'liq ishlatilsa.

---

### 1-QAVAT — MUHIT

| # | Ish | Holat |
|---|---|---|
| 1.1 | Haqiqiy laboratoriya HDRI (muhit + aks etish) | ⬜ |
| 1.2 | Soya tizimi — kaskadli yoki zonali, butun xonani qoplaydigan | ⬜ |
| 1.3 | PBR material kutubxonasi (albedo+normal+roughness+AO) | ⬜ |
| 1.4 | Deraza — teshikli devor, ram, tokcha, haqiqiy shisha | ⬜ |

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
| Rakovina va shift panellari "yonib" turadi | `MeshBasicMaterial` yorug'likka bo'ysunmaydi, doim 1.0 | 0.1 |
| Butun pol oq tumanga aylangan | Bloom ostonasi 0.55, sahna o'rtachasi undan yuqori | 0.1 → 3.1 |
| Pol o'ng tomoni siyohrang | `tun` mavzusining binafsha to'ldiruvchi nuri (0xa78bfa) | 0.1 |
| Javon, rakovina, deraza "yopishtirilgan" | Soya xaritasi xonaning 14% ini qoplaydi | 0.4 → 1.2 |
| Derazalar — tekis oq to'rtburchak | Devor bitta `PlaneGeometry`, deraza undan 2 sm oldinda | 1.4 |
| Davriy jadval devordan chiqib ketgan | Panel joylashuvi xona chegarasidan tashqarida | 0.4 |
| "Probirka", "Termometr" yorliqlari havoda | DOM/sprite yorliq, chuqurlik testi yo'q | 2.4 |
| Zal bo'm-bo'sh va juda katta | Xona 16×12 m = 192 m², stol atigi 3.2×1.6 m | 0.4 |
| `siyoh`/`grafit`/`kunduz` sahnalariga foydalanuvchi yeta olmaydi | To'rtta mavzu kodi bor, lekin 3D laboratoriyada fon almashtirgich UI ulanmagan; hozir `SUKUT_FON` (`tun`) aniq beriladi | Egasi qarori |

> **Fon almashtirgich qarori berilganda:** HUD va sahna **birga**
> almashishi kerak. `korinish.js` dagi `data-fon` atributi 2D
> interfeys ranglarini boshqaradi (`globals.css:277-350` da to'rtta
> mavzu bloki), `useSahna(fonKaliti)` esa 3D sahnani. Hozir ikkalasi
> ham `SUKUT_FON` ga qotirilgan.
>
> Nozik joyi: `--v3-fon`/`--v3-matn` faqat mavzu bloklarida
> aniqlangan, `:root` da yo'q. Ilgari `data-fon="zamonaviy"` hech
> biriga tushmagani uchun HUD ranglari `<html>` dan (foydalanuvchi
> tanlagan sayt mavzusidan) meros olardi. `SUKUT_FON` ga o'tgach
> meros bosib ketildi — ya'ni `kunduz` mavzusini tanlagan
> foydalanuvchining HUD'i endi majburan qorong'i. Bu 3D sahna bilan
> mos bo'lgani uchun qabul qilindi (`cb4cfa3`), lekin almashtirgich
> qo'shilganda ikkalasi bitta manbadan boshqarilishi shart (1-band).

---

## Joriy holat

**2026-08-20** — 0.0 bajarildi va merge qilindi (`fe7c050`). Ko'rikda
asbobning uchta nuqtasi `tun` mavzusidagi kuygan polni topmagani uchun
0.0B qo'shildi. 0.0B da uchta eski nomli nuqta saqlandi, sof `pol`
to'rtinchi nuqta bo'ldi va har mavzuga qat'iy urug'li 24 nuqtali supurish
qo'shildi. Supurish `tun`da avval ko'rinmagan kuyishni topdi
(`kuygan = 7.33%`); sof ship/pol farqi ham alohida hisoblanadi. Keyingi
navbat — 0.1 yorug'lik kalibrovkasi.

3D sahnada `siyoh`, `grafit`, `kunduz` mavzularining kodi mavjud, ammo
ularni tanlaydigan UI yo'q. 0.0B o'lik `"zamonaviy"` kalitini
`SUKUT_FON`ga almashtirdi, almashtirgich qurmadi — bu egasining alohida
mahsulot qarori.

19-avgustda arena agenti 11 ta kommit qildi (bloom, protsedural tekstura,
RectAreaLight, SSAO tayyorlash, per-idish holat). **Funksional tuzatishlari
to'g'ri va saqlanadi.** Grafik qismi esa 0-qavat sozlanmagani uchun holatni
yomonlashtirdi — bloom va qo'shimcha nurlar allaqachon oshiq ekspozitsiyani
kuchaytirdi. Bu kod tashlab yuborilmaydi, 0.1 da qayta kalibrlanadi.

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
