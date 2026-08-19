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
| 0.0 | **O'lchov asbobi** — grafikani raqam bilan tekshirish | [BRIF-00](BRIF-00-olchov-asboblari.md) | ⬜ |
| 0.1 | Yorug'lik byudjeti — yagona manba, ekspozitsiya kalibrovkasi | [BRIF-01](BRIF-01-yoruglik-byudjeti.md) | ⬜ |
| 0.2 | Asset quvuri — `.glb` + KTX2 + HDRI yuklovchi, kesh, dispose | [BRIF-02](BRIF-02-asset-quvuri.md) | ⬜ |
| 0.3 | Sifat darajalari — 4 pog'ona + dinamik rezolyutsiya | [BRIF-03](BRIF-03-sifat-darajalari.md) | ⬜ |
| 0.4 | Xona miqyosi va devor geometriyasi qayta o'lchash | [BRIF-04](BRIF-04-xona-miqyosi.md) | ⬜ |
| 0.5 | Monolit fayllarni bo'lish (1523 → modul) | [BRIF-05](BRIF-05-monolitni-bolish.md) | ⬜ |

**Qavat tugadi deb hisoblanadi, qachonki:**
- `npm run lab3d:olcham` 12 qatorlik jadval chiqarsa va hech bir qator
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

---

## Joriy holat

**2026-08-20** — 0-qavat boshlanmagan. Kod `main` da `4333617`.

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

### G2. 3D lab — desktop yoki mobil ilova

**Texnik jihatdan mumkin, ikkalasi ham.**

- **Desktop** (Electron yoki Tauri): oson. Three.js to'g'ridan-to'g'ri
  ishlaydi, interfeys ham o'sha DOM. Foydasi real: to'liq GPU, katta
  ekran, offline, `devicePixelRatio` cheklovsiz — 4K maqsadiga eng
  yaqin yo'l aynan shu.
- **Mobil**: mumkin, lekin qimmat. Sahnaning o'zi `expo-gl` orqali
  ko'chadi, ammo interfeys ko'chmaydi — `3d/components/` da **20 ta
  JSX** komponent Tailwind bilan yozilgan va React Native ularni
  tushunmaydi. Ya'ni butun UI qatlami qayta yoziladi.
  Arzon muqobil: mavjud mobil ilovada WebView. Ishlaydi, lekin 3D
  unumdorligi pastroq va mobil allaqachon "arzon rejim" ga tushadi.

**Qachon ma'noli bo'ladi:** 1-qavat tugagandan keyin. Hozir sahna
brauzerda ham to'g'ri ko'rinmayapti — uni ikkinchi platformaga
ko'chirish nuqsonni ikkilantiradi, tuzatmaydi. Desktop birinchi
navbatda: u sahnani qayta yozishni talab qilmaydi.
