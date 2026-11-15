# «Formulani top» ovoz yozuvlari

MP3 yozuvlarini `public/oyinlar/formulani-top/ovoz/` papkasiga joylang.
Fayl hali yo'q bo'lsa yoki ovoz ijro etilmasa, doskada ishora matni chiqadi.

Fayl nomi va o'qiladigan matnni savollar bankidan chiqarish uchun loyiha
ildizida quyidagi buyruqni bajaring. Jadvalning bir ustuni MP3 nomi,
ikkinchisi ovozda o'qiladigan matn.

```powershell
node --input-type=module -e "import {FORMULA_TOP_MODDALAR as bank, formulaTopAudioNomi as fayl, formulaTopIshora as ishora} from './data/formulani-top.js'; bank.forEach((modda, i) => { for (const d of [1, 2, 3, 4]) { const matn = ishora(modda, d); if (matn) console.log(fayl(d, i), matn) } })"
```

Ovoz yozuvlari qo'shilgach, mavjud fayl raqamlari o'zgarmasligi uchun savollar
bankidagi mavjud qatorlar tartibini saqlang.
