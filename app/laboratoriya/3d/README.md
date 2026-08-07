# 3D Laboratoriya — kod tushadigan papka

Bu bo'lim hali yozilmagan. Kod bepul AI chatlarida yoziladi,
buyruq matni: loyiha ildizidagi **`3D-LAB-PROMPT.md`**.

## Fayl qayerga tushadi (19 ta fayl, 4 bosqich)

```
app/laboratoriya/3d/
├── page.js                        FAYL 19 — metadata (server komponent)
├── korinish.js                    FAYL 19 — asosiy ko'rinish ("use client")
├── lib/
│   ├── sozlama.js                 FAYL 1   1-bosqich: mantiq
│   ├── idish-holati.js            FAYL 2   (UI yo'q, Three.js yo'q)
│   ├── stexiometriya.js           FAYL 3
│   ├── modda-korinishi.js         FAYL 4
│   ├── rang-aralashtirish.js      FAYL 5
│   ├── kuzatuv-tahlil.js          FAYL 6
│   ├── jurnal.js                  FAYL 7
│   ├── materiallar.js             FAYL 8   2-bosqich: statik sahna
│   ├── jihoz-modellari.js         FAYL 9
│   └── effektlar.js               FAYL 14  3-bosqich: interaktivlik
├── hooks/
│   ├── useSahna.js                FAYL 10
│   ├── useSudrash.js              FAYL 12
│   ├── useQuyish.js               FAYL 13  ← uzluksiz oqim, eng muhimi
│   └── useTajriba.js              FAYL 15
└── components/
    ├── MobilOgohlantirish.jsx     FAYL 11
    ├── ReagentJavoni.jsx          FAYL 16  4-bosqich: interfeys
    ├── JihozJavoni.jsx            FAYL 17
    └── NatijaPaneli.jsx           FAYL 18
```

**Bosqichlar:** 1 — sof mantiq (brauzersiz sinaladi) · 2 — statik 3D
sahna · 3 — quyish va effektlar · 4 — interfeys. Har bosqichni alohida
chatda oling.

## Diqqat — build to'xtab qolmasin

`page.js` ni **bo'sh holda yaratmang**. Bo'sh `page.js`
(`export default` siz) `npx next build` ni butunlay to'xtatadi va
xato xabari qaysi fayl aybdorligini ko'rsatmaydi.

Shu sababli bu papkada hozir `page.js` yo'q — u eng oxirida
yaratiladi. Papkaning `page.js` siz turgani Next.js uchun muammo
emas: hech qanday yo'l yaratilmaydi.

Yarim yozilgan holatda commit qilish kerak bo'lsa:

```bash
git stash push -- app/laboratoriya/3d/page.js
```

## Qoidalar (AI qaysi biriga rioya qilmasa — qaytarib yozdiring)

- **Sof Three.js.** `@react-three/fiber` va `@react-three/drei`
  o'rnatilmagan — `<Canvas>`, `useFrame`, `<meshPhysicalMaterial>`
  ishlamaydi. Sahna imperativ yoziladi.
- Yangi npm paket yo'q, `.glb`/`.gltf` model fayllari yo'q —
  hamma jihoz protsedural geometriyadan.
- TypeScript yo'q — sof `.js` / `.jsx`.
- Server mantig'iga tegilmaydi: nima sarflanishi va nima hosil
  bo'lishini faqat `POST /api/laboratoriya/tajriba` hal qiladi.
  Millilitr faqat client tomonda yashaydi — u animatsiya va
  hisobotni belgilaydi, inventarni emas.
- Rang `useState` da saqlanmaydi, tarkibdan hisoblanadi.
- Foydalanuvchi xatosi bloklanmaydi: 100 ml quysa ham qabul qilinadi.
- Interfeys va izohlar o'zbek tilida, izoh **nega** shunday
  qilinganini tushuntiradi.
- Har bir `geometry` / `material` / `texture` uchun `dispose()`.

## Tayyor bo'lgach

1. `npx next build` — dev server yopiq holda (aks holda EPERM)
2. `npm run dev` → `http://localhost:3000/laboratoriya/3d`
3. 2D sahifadagi "🧪 Tajriba" tabiga 3D ga o'tish havolasini qo'shish
4. `page.js` metadata bilan chiqqach sitemap o'zi yangilanadi
