# Agentlarni loyihada ishlatish — yo'riqnoma

Bu fayl loyiha egasi uchun: arena AI va shunga o'xshash agentlarga ishni
qanday topshirish, ularni qanday parallel yugurtirish va natijani qanday
qabul qilish.

---

## 0. Har topshiriqdan OLDIN — bitta buyruq

```bash
git status -sb
```

`ahead` noldan katta bo'lsa — **avval push qiling**, keyin topshiring.

**Nega:** agentlar shoxni GitHub'dagi `origin/main` dan ochadi, sizning
diskingizdagi `main` dan emas. 2026-08-19 da `origin/main` bir hafta
yangilanmay qolgan edi (78 ta kommit faqat diskda). Ikki agent o'sha
eskirgan bazadan shox ochib ishladi va 3D laboratoriyaning butun ishini
ko'rmasdan kod yozdi — natijada ikki oqim paydo bo'ldi va uni qo'lda
birlashtirishga vaqt ketdi.

Agent ko'rmagan narsani hisobga ololmaydi. Bu uning aybi emas.

---

## 1. Bitta agent = bitta brif = bitta shox

Bir agentga ikkita brif bermang. Brif ataylab shunday yozilgan: unda
maqsad, tegilmaydigan joylar, o'lchanadigan qabul mezoni va talab
qilinadigan dalil bor. Ikkita brif bitta shoxda aralashsa, biri
yiqilganda ikkinchisini ham orqaga qaytarish kerak bo'ladi.

## 2. Agentga beriladigan xabar shakli

```
jdakimyo.uz loyihasida ishlaymiz.

1. Avval AGENTS.md ni to'liq o'qi — u qoidalar ro'yxati emas, allaqachon
   qilingan xatolar ro'yxati.
2. Keyin docs/3d-lab/YOL-XARITASI.md ni o'qi — umumiy manzarani ko'rish
   uchun.
3. Vazifang: docs/3d-lab/BRIF-01-yoruglik-byudjeti.md

Faqat shu brifni bajar. "Tegilmaydi" bo'limidagi joylarga tegma.
Brifdagi qabul mezonlarining har birini raqam bilan javobingda ko'rsat.
Dalil bo'limida so'ralgan skrinshotlarni ilova qil — ularsiz ish
tugallanmagan hisoblanadi (AGENTS.md 11.1).

Agar brifda xato yoki ziddiyat ko'rsang — kod yozishdan oldin ayt.
```

Brif nomini almashtiring, qolgani o'zgarmaydi.

## 3. Parallel ishlatish — qaysilari birga bo'ladi

Konflikt fayl darajasida bo'ladi. Quyidagi jadval kim qayerga tegishini
ko'rsatadi:

| Brif | Asosiy fayllar | Parallel bo'ladimi |
|---|---|---|
| BRIF-01 yorug'lik | `lib/yoruglik.js` (yangi), `useSahna.js`, `xona-modellari.js` | — |
| BRIF-02 asset | `lib/asset-yuklovchi.js` (yangi), `public/3d/` | ✅ 01 bilan |
| BRIF-03 sifat | `lib/sifat.js` (yangi), `useSahna.js` | ⚠️ 01 bilan `useSahna.js` da to'qnashadi |
| BRIF-04 xona | `xona-modellari.js`, `sozlama.js`, `useYurish.js` | ❌ 01 va 05 bilan to'qnashadi |
| BRIF-05 monolit | hamma katta fayllar | ❌ hech kim bilan |

**Tavsiya etilgan tartib:**

1. **BRIF-01 + BRIF-02** — birga yuborish mumkin (turli fayllar).
2. **BRIF-03** — 01 birlashgandan keyin.
3. **BRIF-04** — 01 va 03 birlashgandan keyin, yolg'iz.
4. **BRIF-05** — oxirida, boshqa hech kim 3D ga tegmayotgan paytda.

BRIF-05 ni birinchi qilish vasvasasi bor (fayllar kichrayadi, keyingi ish
oson bo'ladi). **Qilmang.** U hamma faylga tegadi va o'sha paytda ketayotgan
har qanday boshqa ishni yiqitadi.

## 4. Natijani qabul qilish

Agent shoxni push qilgach, birlashtirishdan oldin:

1. **Shox nuqtasini tekshiring** — eskirgan bazadan ochilmaganmi:
   ```bash
   git merge-base main origin/arena/<shox>
   ```
   Natija `main` ning uchi bo'lishi kerak. Bo'lmasa — agent eski kodni
   ko'rgan, ishi ishonchsiz.

2. **Qabul mezonlarini raqam bilan so'rang.** "Yaxshi bo'ldi" javob emas.
   Brifda "kuygan piksel < 1%" deb yozilgan bo'lsa, javobda foiz bo'lishi
   shart.

3. **Skrinshotni o'zingiz ko'ring.** 19-avgustda oltita grafik kommiti
   "dev server 200 qaytardi" degan asosda qabul qilingan va hammasi
   sahnani buzgan. Kompilyatsiya o'tgani — grafik dalil emas.

4. **Jonli tekshiruv** birlashgandan keyin:
   ```bash
   curl -sL -o /dev/null -w "%{http_code}\n" https://www.jdakimyo.uz/laboratoriya/3d
   ```
   `-L` shart — `jdakimyo.uz` 307 bilan `www` ga yo'naltiradi.

## 5. Nima uchun brif bu qadar batafsil

Kuchli agent ham loyihaning tarixini bilmaydi. Brifda uch narsa bo'lsa,
u yaxshi ishlaydi:

- **Muammoning o'lchangan holati** — "pol oq" emas, "kuygan piksel 34%,
  `useSahna.js:266` va `xona-modellari.js:278` ikki manba".
- **Tegilmaydigan chegara** — aks holda agent yo'l-yo'lakay boshqa joyni
  ham "yaxshilaydi" va diff o'qib bo'lmas holga keladi.
- **O'lchanadigan qabul mezoni** — "chiroyli bo'lsin" tekshirib
  bo'lmaydigan talab. "O'rtacha luma 0.18–0.45" tekshiriladi.

Yangi brif yozganda shu uchtasi borligini tekshiring.

## 6. Brif tugagach

`docs/3d-lab/YOL-XARITASI.md` dagi jadvalda ⬜ ni ✅ ga o'zgartiring va
qavat tugagan bo'lsa keyingisiga o'ting. Reja **faqat o'sha faylda**
yuritiladi — ikkinchi reja fayli paydo bo'lsa, AGENTS.md 1-band buzilgan
bo'ladi (`docs/arxiv-promptlar/` shu xatoning qoldig'i).
