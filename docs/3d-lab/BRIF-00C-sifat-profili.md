# BRIF-00C — Sifat profili: quvurni tuzatish

**Qavat:** 0 · **Navbat: BRIF-01 dan OLDIN** · **Xavf:** past
**Oldingi ish:** BRIF-00 (`fe7c050`), BRIF-00B (`cb4cfa3`)

---

## Nega bu brif bor

Egasi telefonda sinab ko'rdi — qurilma cho'kdi. Sabab o'lchandi:
`xona-modellari.js:246-260` da 8 ta `RectAreaLight`. Lekin ildiz sabab
chuqurroq va u **arxitekturaviy**.

Hozir "telefonmi yoki desktopmi" degan savol bitta `boolean` bilan
ifodalangan:

```js
const arzonRejim = kuchsizQurilmaniAniqla();   // true / false
```

Bitta `boolean` "nechta chiroq", "qaysi material", "qanday tekstura
o'lchami" degan savollarga javob bera olmaydi. Natijada u antialias,
soya va bloom ni o'chiradi — **8 ta RectAreaLight esa qoladi.** Eng
arzon narsalar o'chib, eng qimmati ishlaydi.

Va u umuman yetib bormaydi:

```
materiallarniYarat(fonKaliti, arzonRejim)   <- biladi
javon3dYasa(materiallar, arzonRejim)        <- biladi
xonaInteryeriniYasa(materiallar)            <- BILMAYDI  ← ildiz nuqson
```

Xonaning yorug'liklari shu uchinchi faylda tug'iladi.

**Bu brif hech narsani tezlashtirmaydi.** U faqat quvurni quradi —
toki BRIF-01 yorug'likni pog'ona bo'yicha kesa olsin. Tuzatishdan
oldin ko'rish kerak; ko'rishdan oldin o'lchash kerak.

---

## Uch pog'ona (egasi qarori, 2026-08-20)

| Profil | Muhit | Maqsad |
|---|---|---|
| `telefon` | Mobil brauzer va WebView | **60 FPS, yurish saqlanadi** |
| `desktop` | Kompyuter brauzeri | Yuqori sifat |
| `ilova` | Desktop ilova (kelajak, G2) | 4K fotorealizm |

**Yurish uch pog'onada ham qoladi.** Telefon funksiyani emas,
ortiqcha yukni yo'qotadi.

---

## Vazifa

### 1. `app/laboratoriya/3d/lib/sifat-profili.js` — yagona manba

```js
export const PROFILLAR = {
  telefon: { nom, chiroqBudjeti, pikselNisbati, soya, IBL,
             transmission, postprocessing, teksturaOlchami, antialias },
  desktop: { ... },
  ilova:   { ... },
};
export function profilniAniqla()   // qurilmadan avtomatik
export function profilniOl(kalit)  // aniq kalit bo'yicha, noto'g'risi -> xato
```

**Boshlang'ich qiymatlar hozirgi xatti-harakatni AYNAN saqlasin.**
`desktop` = hozirgi to'liq rejim, `telefon` = hozirgi arzon rejim,
`ilova` = hozircha `desktop` bilan bir xil.

Yagona istisno — `chiroqBudjeti`. U **haqiqiy maqsadni** yozadi
(taklif: `telefon: 3`, `desktop: 8`, `ilova: 16`) va hozircha
**majburlanmaydi**. Nega: BRIF-01 uni bajaradi, bu brif esa buzilishni
ko'rinadigan qiladi.

### 2. `arzonRejim` o'rniga profil

`useSahna.js` da `arzonRejim` boolean o'chiriladi. Uning o'rniga
`profil` obyekti. Hozirgi `arzonRejim` ishlatiladigan har joyda
profilning tegishli maydoni o'qiladi (`profil.soya`, `profil.antialias`,
`profil.postprocessing.bloom`, ...).

`kuchsizQurilma` state'i qoladi (UI uni ishlatadi), lekin u endi
`profil.nom === "telefon"` dan kelib chiqadi.

### 3. Profil HAR BIR quruvchiga uzatilsin

```js
xonaInteryeriniYasa(materiallar, profil)   // <- ildiz nuqson shu yerda
materiallarniYarat(fonKaliti, profil)
javon3dYasa(materiallar, profil)
jihozYasa(kalit, materiallar, profil)
```

Bu brifda ular profilni **qabul qiladi va saqlaydi**, lekin xatti-
harakatini o'zgartirmaydi. Bitta istisno pastda.

### 4. Buzilishni ko'rinadigan qil

`window.__olcham()` javobiga uch maydon qo'shilsin:

| Maydon | Ma'nosi |
|---|---|
| `profil` | Faol profil nomi |
| `chiroqBudjeti` | Shu profilning chegarasi |
| `chiroqBudjetiBuzildi` | `chiroqSoni > chiroqBudjeti` |

**Kutilgan natija:** `telefon` profilida `chiroqSoni ≈ 13`,
`chiroqBudjeti = 3`, `chiroqBudjetiBuzildi = true`.

Bu nuqsonni **TUZATMA.** Sening ishing uni o'lchanadigan qilish.
Tuzatish BRIF-01 da.

### 5. O'lchagich yangi profilni bilsin

`LAB3D_PROFIL=telefon|desktop|ilova` qo'shilsin.

`LAB3D_SIFAT` **buzilmasin** — u alias bo'lib qolsin
(`arzon` → `telefon`, `toliq` → `desktop`). BRIF-00B endigina merge
qilingan, uni sindirish 1-bandning buzilishi bo'lardi.

Jadval endi uch profilni ham qamrasin yoki `LAB3D_PROFIL` bilan
alohida ishga tushirilsin — qaysi biri arzonroq bo'lsa, `OLCHOV.md`
da tushuntir.

---

## Qabul mezonlari

1. `grep -rn "arzonRejim" app/laboratoriya/3d/` — natija **bo'sh**.
2. `xonaInteryeriniYasa`, `materiallarniYarat`, `javon3dYasa`,
   `jihozYasa` — hammasi `profil` qabul qiladi.
3. `LAB3D_PROFIL=telefon` bilan o'lchov: `chiroqBudjetiBuzildi = true`,
   `chiroqSoni` va `chiroqBudjeti` sonlari ko'rsatilgan.
4. `LAB3D_SIFAT=arzon` hamon ishlaydi (alias).
5. **Xatti-harakat o'zgarmagani isbotlansin:** BRIF-00B dan keyingi
   o'lchov bilan yangi o'lchov solishtirilsin — `kuygan`, `ortacha`,
   `uchburchak`, `chaqiruv` **o'zgarmasligi** shart
   (`|Δortacha| < 0.02`). Bu brif tezlashtirmaydi, quvur quradi.
6. Production'da `/laboratoriya/3d/olcham` hamon **404**.
7. `docs/3d-lab/PROFILLAR.md` — uch profil, har maydonning ma'nosi,
   qiymatlar qayerdan olingani.

---

## Tegilmaydi

- **Yorug'lik qiymatlari** — chiroq soni, intensivlik, joylashuv.
  Hammasi BRIF-01.
- Material, geometriya, postprocessing parametrlari.
- Xona o'lchami (BRIF-04), asset (BRIF-02).
- Yurish rejimi — **u uch pog'onada ham qoladi**, tegma.

Yo'l-yo'lakay nuqson ko'rsang, tuzatma — `YOL-XARITASI.md` ga yoz
(10-band).

---

## Dalil

1. `grep -rn "arzonRejim" app/laboratoriya/3d/` — bo'sh natija.
2. `LAB3D_PROFIL=telefon` o'lchovi — `chiroqBudjetiBuzildi = true`
   ko'rinadigan qator.
3. BRIF-00B dagi va hozirgi o'lchovning yonma-yon taqqoslashi —
   sonlar o'zgarmaganini ko'rsatish uchun.
