# BRIF-02 — Asset quvuri (`.glb` + KTX2 + HDRI)

**Qavat:** 0 · **Navbat:** BRIF-01 dan keyin · **Xavf:** past (yangi kod, eskisiga tegmaydi)

---

## Muammo

Loyihada 3D asset **umuman yo'q**: 0 ta `.glb`, 0 ta `.hdr`, 0 ta KTX2.
Butun laboratoriya 193 ta protsedural primitivdan yasalgan (79 silindr,
56 quti, 13 shar, 13 tekislik...). Bu yo'lning sifat shifti bor —
`CylinderGeometry` ni qancha silliqlamang, probirka haqiqiy bo'lmaydi,
chunki haqiqiylikni geometriya emas, **tekstura** beradi: shisha
qalinligining notekisligi, barmoq izlari, mayda tirnalishlar, yorliq qog'ozi.

4K maqsadi qo'yilgan ekan, bu quvur usiz qurib bo'lmaydigan poydevor.

---

## Vazifa

Bu brifda **bitta ham jihoz almashtirilmaydi**. Faqat quvur quriladi va
uning ishlashi bitta namuna bilan isbotlanadi.

### 1. Papka tuzilmasi

```
public/3d/
  modellar/     .glb  (Draco siqilgan)
  teksturalar/  .ktx2
  muhit/        .hdr yoki .env
```

### 2. Yuklovchi — `app/laboratoriya/3d/lib/asset-yuklovchi.js`

- Bitta `GLTFLoader` + `DRACOLoader` + `KTX2Loader` nusxasi (singleton).
  Ikkinchi yuklovchi yozilmaydi (AGENTS.md 11.6).
- `Map` orqali kesh: bir model ikki marta so'ralsa, tarmoqqa bir marta
  chiqiladi.
- `modelOl(yol)` → `Promise<THREE.Group>`; nusxa qaytaradi, keshdagi
  originalni bermaydi.
- `assetlarniTozala()` — kesh, geometriya, material va teksturani
  `dispose()` qiladi. `useSahna` ning cleanup qismiga ulanadi.
- Yuklanish holati (`yuklandi / jami`) hisoblanadi — yuklash ekrani uchun.
- Xato bo'lsa sahna **yiqilmasin**: model kelmasa, hozirgi protsedural
  variant zaxira sifatida ishlatiladi.

### 3. Namuna — bitta idish

Bitta idishni (tavsiya: **kimyoviy stakan**) `.glb` ga o'tkazing va
yuklovchi orqali sahnaga qo'ying. Qolgan idishlar protsedural qoladi —
ular 2-qavatda ko'chiriladi.

Model manbai: CC0 kutubxonalar (Poly Haven, Kenney, ambientCG) yoki
Blender'da o'zingiz yasang. **Litsenziyani** `public/3d/LITSENZIYA.md`
ga yozing — manba, muallif, litsenziya turi.

### 4. HDRI

Bitta ichki xona HDRI si (`.hdr`, 1–2K, CC0) qo'shing va uni
`RoomEnvironment` o'rniga `PMREMGenerator` ga bering. Shu bilan
BRIF-01 dagi `environmentIntensity` qayta o'lchanishi kerak —
byudjet jadvalini yangilang.

---

## Qabul mezonlari

| Ko'rsatkich | Talab |
|---|---|
| Jami 3D asset hajmi | **< 6 MB** (bu brifda; umumiy shift 12 MB) |
| Stakan `.glb` sahnada ko'rinadi | ha, skrinshot bilan |
| Model kelmaganda sahna | yiqilmaydi, protsedural zaxiraga tushadi |
| 20 marta idish qo'yib/olib tashlaganda | `renderer.info.memory` o'smaydi |
| Ikkinchi `GLTFLoader` | kod bazasida yo'q |
| `LITSENZIYA.md` | har asset uchun manba va litsenziya yozilgan |

---

## Tegilmaydi

- Qolgan idish va jihozlarni ko'chirish (2-qavat).
- Yorug'lik kuchlarini o'zgartirish — HDRI qo'shgach `environmentIntensity`
  ni qayta o'lchang, lekin boshqa nurlarga tegmang.
- `korinish.js` dagi tajriba mantig'i.

## Dalil

Stakanning protsedural va `.glb` variantlari yonma-yon skrinshot;
`renderer.info` ning 20 martalik sinovdan oldingi va keyingi holati.
