# BRIF-G7 — Rakovina havoda turibdi

**Kim uchun:** Gemini (Antigravity, lokal — RASM KO'RADI)
**Shox:** `gemini/rakovina-tayanchi` · **Xavf:** past (bitta fayl)

---

## Muammo

`YOL-XARITASI.md` da 1b-nuqson sifatida yozilgan, tuzatilmagan:

`app/laboratoriya/3d/lib/xona/santexnika.js` dagi `rakovinaYasa`
faqat uchta narsadan iborat — kosa (0.6 × 0.26 × 0.45), jo'mrak va
quvur. Guruh `y = 0.9` da turadi va **ostida hech narsa yo'q**: na
tumba, na devor kronshteyni, na oyoq.

Ya'ni rakovina xonada muallaq osilib turadi. Javonlarga tumba
qo'shilgandan keyin bu yanada ko'zga tashlanadi.

## Nega aynan senga

Bu **ko'z bilan ko'riladigan** nuqson. Arena rasm ko'rmaydi, shuning
uchun unga bunday ish berilmaydi (AGENT-YORIQNOMA 12-bo'lim). Sen
ko'rasan — demak "endi normal ko'rinadimi?" degan savolga javob bera
olasan.

---

## Vazifa

`rakovinaYasa` ga tayanch qo'sh. Qaysi shakl — **sening qaroring**,
lekin ikkitasidan biri bo'lsin:

- **tumba** (pastki shkaf): xona mebeli bilan bir uslubda, eshikchali;
- **devor kronshteyni** + ochiq sifon: laboratoriya uslubiga yaqinroq.

Talablar:

1. **Yangi yorug'lik manbai QO'SHILMAYDI** (AGENTS.md 11.2). Model
   yasovchi faylda `new THREE.*Light` yozilmaydi — yorug'likning
   yagona egasi `lib/yoruglik.js`.
2. **`MeshBasicMaterial` ishlatilmaydi** (11.3). Yoritiladigan sirt
   `MeshStandardMaterial` bo'ladi. Mavjud `materiallar` to'plamidan
   foydalan — yangi material yaratishdan oldin unda mosini qidir.
3. `castShadow` va `receiveShadow` ni **ataylab** qaror qil (11.5).
   Yozmaslik "soya yo'q" degani.
4. Fayl 600 qatordan oshmasin (11.7). Hozir u ancha kichik.
5. Kosa, jo'mrak va quvurning **joyi va o'lchami o'zgarmaydi** — faqat
   ostiga tayanch qo'shiladi.

---

## Dalil — ikkalasi ham kerak

### 1. Rasm (sen ko'rasan)

Oldin va keyin, **bir xil kameradan**. O'lchagich sahifasi login
talab qilmaydi:

```
http://localhost:3001/laboratoriya/3d/olcham?profil=desktop&nuqta=xona
```

### 2. Son (AGENTS.md 11.1)

```bash
npm run dev -- -p 3001
LAB3D_URL=http://localhost:3001 npm run lab3d:olcham -- --json > oldin.json
# ... o'zgartirish ...
LAB3D_URL=http://localhost:3001 npm run lab3d:olcham -- --json > keyin.json
```

**PORT 3001 SHART.** 3000-portni ko'rikchining worktree'i egallagan.
`scripts/lab3d-ish-vaqti.cjs` da manzil 3000 deb qattiq yozilgan —
uni ishga tushirma, u boshqa daraxtni tekshiradi.

Kutilayotgan natija:

- `uchburchak` va `chaqiruv` **o'sadi** — yangi geometriya qo'shilyapti,
  bu normal. Qancha o'sganini hisobotda yoz.
- `kuygan < 1%`, `sweep kuygan < 2%`, `qora < 5%` — bular **buzilmasin**.
- `chiroqSoni` **o'zgarmasin** (desktop 8, telefon 3).

---

## Yo'l-yo'lakay: bitta kuzatuv so'rayman

Sening mashinangda **haqiqiy GPU** bor; o'lchagich esa dasturiy
renderda (SwiftShader) ishlaydi. `YOL-XARITASI.md` dagi 3-nuqson
aynan shundan tug'ilgan: `desktop/stol` kadrida `ortacha = 0.4593`
va bu darvoza chegarasidan (0.45) chiqib turibdi. Sabab dasturiy
renderdami yoki sahna haqiqatan yorqinmi — bilinmayapti.

Shu manzilni oddiy brauzerda och:

```
http://localhost:3001/laboratoriya/3d/olcham?profil=desktop&nuqta=stol
```

va bitta jumla bilan ayt: kadr **kuygandek** ko'rinadimi (oq dog'lar,
detal yo'qolgan joylar), yoki normalmi? Bu tuzatish emas — kuzatuv.
Javobing 1-qavat kalibrovkasiga kiradi.

---

## Tegilmaydi

`app/laboratoriya/3d/` dagi **boshqa hech qanday fayl**. O'sha yerda
ko'rikchi BRIF-05 (monolitlarni bo'lish) ustida ishlayapti —
`korinish.js`, `useYurish.js`, `hooks/`, `olcham/`. Sening o'zgarishing
faqat `lib/xona/santexnika.js` da bo'lsin.

`git diff --name-only main` bitta fayl ko'rsatishi kerak.

## Ishni qanday tugatasan

`gemini/rakovina-tayanchi` shoxida commit va push. `main` ga merge
qilma, PR ni o'zing tasdiqlama, deploy qilma.

Hisobotda: oldin/keyin rasm, oldin/keyin sonlar jadvali,
`git diff --name-only main`, va yuqoridagi kuzatuv jumlasi.
