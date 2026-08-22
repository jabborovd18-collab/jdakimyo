# `public/3d/` — asset manbalari va litsenziyalari

**Har yangi fayl shu yerga yoziladi: manba, muallif, litsenziya, hajm.**
Yozilmagan asset qo'shilmaydi (BRIF-02 qabul mezoni).

## Byudjet

Sahifaning 3D yuki jami **12 MB** dan oshmasin (AGENTS.md 11.6).
Dekoderlar bu byudjetga KIRMAYDI — ular faqat mos asset ishlatilganda
yuklanadi va hozircha hech qaysi asset ularni talab qilmaydi.

| Bo'lim | Hajm | Byudjetga kiradimi |
|---|---:|---|
| `modellar/` | 16 KB | ha |
| `teksturalar/` | 0 | ha |
| `muhit/` | 0 | ha |
| `dekoder/` | 1.3 MB | yo'q — talabga ko'ra yuklanadi |

## Modellar

### `modellar/stakan.glb` — 16 KB

- **Manba:** loyihaning o'z ishi. `scripts/lab3d-model-yasa.js` yasaydi.
- **Litsenziya:** loyiha bilan bir xil.
- **Nima uchun tashqi model olinmadi:** quvurni isbotlash uchun tashqi
  fayl shart emas — kerak bo'lgani formatning haqiqiy `.glb` bo'lishi.
  O'zimiz yasaganda litsenziya savoli yopiladi va natija qat'iy: har
  ishga tushirishda aynan bir xil bayt chiqadi.
- **Geometriya:** 294 vertex, 480 uchburchak. Aylantirilgan profil —
  tashqi devor, jiyak, ichki devor, tub. Bitta yopiq qobiq.
- **Nega protseduraldan yaxshiroq:** eski model ikkita alohida silindr
  edi (devor va tub). Ular ulanmagan, ya'ni shisha qalinligi yo'q va
  idish "qog'ozdan" ko'rinardi. Yangi profilda jiyak va tub ko'rinadi.
- **Siqilish:** siqilmagan. Draco 16 KB uchun foyda bermaydi
  (dekoder o'zi 250 KB). Draco quvuri tayyor va kattaroq modelda
  ishlatiladi.

## Dekoderlar

`node_modules/three/examples/jsm/libs/` dan ko'chirilgan. Ular
three.js bilan keladi va uning litsenziyasi ostida.

| Fayl | Hajm | Manba | Litsenziya |
|---|---:|---|---|
| `dekoder/draco/draco_decoder.wasm` | 188 KB | Google Draco | Apache-2.0 |
| `dekoder/draco/draco_decoder.js` | 500 KB | Google Draco | Apache-2.0 |
| `dekoder/draco/draco_wasm_wrapper.js` | 57 KB | Google Draco | Apache-2.0 |
| `dekoder/basis/basis_transcoder.wasm` | 515 KB | Binomial Basis Universal | Apache-2.0 |
| `dekoder/basis/basis_transcoder.js` | 56 KB | Binomial Basis Universal | Apache-2.0 |

**Nega CDN emas:** CDN tashqi bog'liqlik va offline ishlamaydi.
Desktop ilova (G2) rejasida assetlar ilova ichida keladi — CDN u yerda
umuman ishlamas edi.

`draco_encoder.js` (954 KB) ATAYLAB olib tashlangan: u faqat siqish
uchun kerak va brauzerda hech qachon ishlatilmaydi.

## Muhit (HDRI)

Hozircha **yo'q**. Sahna `RoomEnvironment` (three.js protsedural muhiti)
ishlatadi.

Haqiqiy laboratoriya HDRI si tashqi manbadan (Poly Haven, CC0) yuklab
olishni talab qiladi — bu egasining ruxsati bilan qilinadi va u
kelganda `environmentIntensity` qayta o'lchanishi shart (BRIF-01
byudjeti shunga bog'liq).
