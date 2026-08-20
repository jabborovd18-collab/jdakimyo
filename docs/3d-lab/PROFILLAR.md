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
| `pikselNisbati` | 1.5 | 1.5 | 1.5 |
| `soya` | false | true | true |
| `IBL` | true | true | true |
| `transmission` | false | true | true |
| `postprocessing.bloom` | false | true | true |
| `postprocessing.ssao` | false | false | false |
| `teksturaOlchami.yogoch` | 512 | 512 | 512 |
| `teksturaOlchami.pol` | 512 | 512 | 512 |
| `teksturaOlchami.devor` | 256 | 256 | 256 |
| `antialias` | false | true | true |

`ilova` kelajakdagi desktop mahsulot profilidir. Hozir render xatti-
harakati `desktop` bilan bir xil; 4K qiymatlarni oldindan yoqish BRIF-00C
ning “xatti-harakat o'zgarmasin” shartini buzardi.

---

## Maydonlar nimani boshqaradi

| Maydon | Iste'molchi | Ma'nosi |
|---|---|---|
| `nom` | UI va o'lchagich | Faol profil identifikatori |
| `chiroqBudjeti` | O'lchagich, keyin BRIF-01 | Maqsad chiroq soni; hozir chiroqni majburan kesmaydi |
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

## Boshlang'ich qiymatlar qayerdan olindi

BRIF-00C optimallashtirish emas, quvur ishi. Shu sabab qiymatlar yangi
taxminlardan emas, oldingi ikki yo'ldan ko'chirildi:

- `telefon` — oldingi `arzonRejim=true`: antialias, soya va bloom o'chiq;
  transmission o'rniga `MeshStandardMaterial`.
- `desktop` — oldingi `arzonRejim=false`: antialias, soya, bloom va
  transmission yoqilgan.
- `IBL` uchalasida ham `true`, chunki oldingi kod `RoomEnvironment`ni
  arzon yo'lda ham shartsiz yaratgan. Uni hozir o'chirish tezlashtirish va
  tasvir o'zgarishi bo'lardi.
- Piksel nisbati uchalasida ham oldingi `min(devicePixelRatio, 1.5)`.
- Tekstura o'lchamlari mavjud canvaslardan: yog'och 512, pol 512, devor
  256. Profilga ko'chirildi, sonlar o'zgarmadi.
- SSAO oldingi `SSAO_YOQIQ=false` holatidan uchalasida ham o'chiq.
- `chiroqBudjeti` istisno: `3/8/16` — haqiqiy maqsad. U hozir faqat
  o'lchanadi; BRIF-01 chiroq to'plamini shu chegaraga moslaydi.

Natijada bugungi telefon o'lchovi ataylab `chiroqSoni=13`,
`chiroqBudjeti=3`, `chiroqBudjetiBuzildi=true` ko'rsatadi.

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
`group.userData.profil`da saqlaydi. Xona profilni olsa ham BRIF-00C da
8 ta `RectAreaLight`ni o'chirmaydi — bu BRIF-01 ning o'lchanadigan ishi.

---

## Profil va kelajak sifat darajasi boshqa tushuncha

Uch profil — **muhit**: telefon brauzeri, desktop brauzeri, desktop ilova.
BRIF-03 dagi `past/orta/yuqori/ultra` esa shu muhit ichidagi keyingi
**dinamik render darajasi**. Masalan, desktop profil keyinchalik kadr
vaqtiga qarab `yuqori` yoki `ultra` darajada ishlashi mumkin. Shu sabab
uch profil yo'l xaritasidagi to'rt sifat darajasini almashtirmaydi.
