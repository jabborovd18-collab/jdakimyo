# 3D laboratoriya — sifat profillari

Profil — sahna qaysi **muhitda** ishlayotganini bildiradi. U mahsulot
funksiyasini tanlamaydi: FPS yurish `telefon`, `desktop` va `ilova`da ham
qoladi. Profil renderer va quruvchilarga bitta nomli konfiguratsiya
obyektini yetkazadi.

Yagona kod manbai:

```text
app/laboratoriya/3d/lib/sifat-profili.js
```

---

## Uch profil

| Maydon | `telefon` | `desktop` | `ilova` |
|---|---:|---:|---:|
| `nom` | `telefon` | `desktop` | `ilova` |
| `chiroqBudjeti` | 3 | 8 | 16 |
| `pikselNisbati` | 1.0 | 1.5 | 1.5 |
| `soya` | false | true | true |
| `IBL` | true | true | true |
| `transmission` | false | true | true |
| `postprocessing.bloom` | false | false | false |
| `postprocessing.ssao` | false | false | false |
| `teksturaOlchami.yogoch` | 512 | 512 | 512 |
| `teksturaOlchami.pol` | 512 | 512 | 512 |
| `teksturaOlchami.devor` | 256 | 256 | 256 |
| `antialias` | false | true | true |

`ilova` kelajakdagi desktop mahsulot profilidir. Renderer va material
yo'li hozir `desktop` bilan bir xil, lekin yorug'lik byudjeti kengroq:
ilovada 13, desktopda 8 chiroq. To'liq 4K qiymatlari BRIF-03 da keladi.

---

## Maydonlar nimani boshqaradi

| Maydon | Iste'molchi | Ma'nosi |
|---|---|---|
| `nom` | UI va o'lchagich | Faol profil identifikatori |
| `chiroqBudjeti` | `yoruglik.js` va o'lchagich | Qurilishda majburlanadigan maksimal chiroq soni |
| `pikselNisbati` | `WebGLRenderer.setPixelRatio` | Qurilma DPR'i uchun yuqori chegara |
| `soya` | renderer, asosiy nur, stol va oyoqlar | Eski soya yoqilgan/o'chiq holati |
| `IBL` | `RoomEnvironment`/PMREM | Muhit aks xaritasi yaratiladimi |
| `transmission` | materiallar va suyuqlik | Physical yoki Standard material yo'li |
| `postprocessing` | `EffectComposer` | Bloom va SSAO passlari |
| `teksturaOlchami` | protsedural materiallar | Yog'och, pol va devor canvas o'lchamlari |
| `antialias` | `WebGLRenderer` konstruktori | MSAA so'raladimi |

Profil obyektlari `Object.freeze` bilan o'zgarmas qilingan. Noto'g'ri
kalit `profilniOl(kalit)`da jim zaxira profilga tushmaydi, xato beradi.

---

## Qiymatlar qayerdan olindi

BRIF-00C profil quvurini eski ikki yo'ldan aynan ko'chirdi. BRIF-01 esa
faqat o'lchov bilan tasdiqlangan uchta o'zgarishni kiritdi:

- `telefon` avvalgidek soyasiz, antialiassiz va transmissionsiz; uning
  `pikselNisbati` 1.5 dan 1.0 ga tushdi. DPR 3 ekranda bu 2.25 barobar
  ortiq piksel chizishni to'xtatadi.
- Bloom uchalasida ham o'chiq. U kalibrlangan sahnaga 3-qavatda qaytadi;
  SSAO ham avvalgidek o'chiq.
- `chiroqBudjeti` `3/8/16` endi `yoruglikniQur`da majburlanadi. Joriy
  boshlang'ich sahna (yashirin spirtovka nuri bilan) `3/8/13` chiroq
  beradi va barcha profilda `chiroqBudjetiBuzildi=false`.

`IBL` uchalasida ham `true`: RoomEnvironment akslari shisha uchun kerak.
Tekstura o'lchamlari o'zgarmadi — yog'och 512, pol 512, devor 256.
Ekspozitsiya `lib/yoruglik.js`da yagona `0.87` qiymatida turadi.

---

## Profil qanday tanlanadi

Jonli brauzerda `profilniAniqla()` oldingi qurilma aniqlash qoidalarini
saqlaydi:

1. Mobil user-agent yoki `userAgentData.mobile` → `telefon`.
2. Ko'pi bilan 2 CPU yadrosi va ko'pi bilan 4 GB xotira → `telefon`.
3. Qolgan brauzerlar → `desktop`.
4. `ilova` faqat aniq beriladi; kelajak desktop ilovasi shuni uzatadi.

O'lchagich avtomatik taxmin qilmaydi:

```bash
LAB3D_PROFIL=telefon npm run lab3d:olcham
LAB3D_PROFIL=desktop npm run lab3d:olcham
LAB3D_PROFIL=ilova npm run lab3d:olcham
```

Orqaga mos aliaslar:

```text
LAB3D_SIFAT=arzon  -> telefon
LAB3D_SIFAT=toliq  -> desktop
```

Ikkalasi birga berilsa `LAB3D_PROFIL` ustun.

---

## Profil quvuri

`useSahna` tanlangan obyektni aynan shu quruvchilarga uzatadi:

```text
materiallarniYarat(profil)
javon3dYasa(materiallar, profil)
xonaInteryeriniYasa(materiallar, profil)
jihozYasa(kalit, materiallar, profil)
```

Materiallar profilni `materiallar.profil`da, uchta guruh quruvchisi esa
`group.userData.profil`da saqlaydi. `lib/yoruglik.js` profil bo'yicha
statik to'plamni quradi: telefon 2 + spirtovka 1, desktop 7 + 1, ilova
12 + 1. Barcha `Light` konstruktorlari ham shu yagona faylda.

---

## Profil va kelajak sifat darajasi boshqa tushuncha

Uch profil — **muhit**: telefon brauzeri, desktop brauzeri, desktop ilova.
BRIF-03 dagi `past/orta/yuqori/ultra` esa shu muhit ichidagi keyingi
**dinamik render darajasi**. Masalan, desktop profil keyinchalik kadr
vaqtiga qarab `yuqori` yoki `ultra` darajada ishlashi mumkin. Shu sabab
uch profil yo'l xaritasidagi to'rt sifat darajasini almashtirmaydi.
