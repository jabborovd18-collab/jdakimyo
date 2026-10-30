# -*- coding: utf-8 -*-
"""
Mustaqil ta'lim topshirig'i (6.4) uchun qisqa ilmiy hujjat generatori.
Mavzu: Kolloid sistemalarda reologik xossalar: nenyuton suyuqliklar,
tiksotropiya, plastiklik va gel strukturalarining mexanik barqarorligi.

Uslub va tenglama qurilmasi omml_docx.py da (yagona manba).
Ishga tushirish:  python3 reologiya_docx.py   →  .docx + .pdf
"""
import os

from omml_docx import Hujjat, P, V, bar, dot, frac, omath, par, seq, sqrt, sub, subsup, sup

H = Hujjat()
p, rich, equation, bullets, table, h = H.p, H.rich, H.equation, H.bullets, H.table, H.h


# ============================================================================
# Sarlavha
# ============================================================================
H.title("Kolloid kimyo / Fizik-kimyoviy mexanika",
        "KOLLOID SISTEMALARDA REOLOGIK XOSSALAR: NENYUTON SUYUQLIKLAR, "
        "TIKSOTROPIYA, PLASTIKLIK VA GEL STRUKTURALARINING MEXANIK BARQARORLIGI")

rich([
    ("Annotatsiya. ", "b"),
    ("Ishda kolloid va dispers sistemalarning oqish va deformatsiya "
     "qonuniyatlari — reologik xossalari — qisqa tahlil qilinadi. Nyuton, "
     "Eynshteyn va Kriger–Dogerti tenglamalari asosida qovushqoqlikning "
     "konsentratsiyaga bog'liqligi; Ostvald–de Vaale, Bingam, Gershel–Balkli va "
     "Kasson modellari asosida nenyuton oqim turlari (psevdoplastik, dilatant, "
     "plastik); tiksotropiyaning strukturaviy kinetikasi; Rebinder bo'yicha "
     "koagulyatsion va kondensatsion-kristallizatsion strukturalar hamda gellarning "
     "qovushqoq-elastik parametrlari (G′, G″, tg δ, oquvchanlik chegarasi, "
     "fraktal masshtablash) ko'rib chiqiladi. Reometrik usullar va amaliy "
     "qo'llanilish umumlashtiriladi.", ""),
])
rich([
    ("Kalit so'zlar: ", "b"),
    ("reologiya, qovushqoqlik, nenyuton suyuqlik, psevdoplastiklik, dilatansiya, "
     "Bingam jismi, oquvchanlik chegarasi, tiksotropiya, reopeksiya, gel, "
     "qovushqoq-elastiklik, saqlash moduli, Rebinder strukturalari.", "i"),
])

# ============================================================================
# 1. Kirish
# ============================================================================
h("1. Kirish va mavzuning dolzarbligi", 1)
p("Reologiya (yun. rheos — oqim) — jismlarning kuch ta'sirida oqishi va "
  "deformatsiyalanishi haqidagi fan (Bingam, 1929). Kolloid sistemalar "
  "reologiyasi alohida o'rin tutadi: dispers fazaning kolloid o'lchami va katta "
  "solishtirma sirti tufayli zarrachalararo o'zaro ta'sirlar (van-der-Vaals, "
  "elektrostatik, sterik, gidrodinamik) oqimning o'zini belgilaydi, natijada "
  "qovushqoqlik doimiy bo'lmay, siljish tezligi, vaqt va deformatsiya tarixiga "
  "bog'liq bo'lib qoladi. Bo'yoq cho'tkadan oson surtilib, devorda oqib tushmasligi, "
  "tish pastasi tyubikdan chiqib, cho'tkada shaklini saqlashi, qon kapillyarlarda "
  "oqishi, burg'ulash eritmasining shlam ushlab turishi, beton va keramik "
  "massalarning shakllanishi — bularning barchasi nenyuton reologiyaning "
  "namoyonlaridir. P.A. Rebinder asos solgan fizik-kimyoviy mexanika dispers "
  "strukturalarning hosil bo'lishi va mustahkamligini kolloid-kimyoviy "
  "omillar orqali boshqarishni o'rgatadi. Mavzuning dolzarbligi farmatsevtika "
  "(gellar, suspenziyalar, malhamlar), oziq-ovqat, qurilish materiallari, "
  "neft-gaz, kosmetika va 3D-bosma texnologiyalari uchun reologik nazorat "
  "sifatning asosiy mezoni ekanligi bilan belgilanadi.")

# ============================================================================
# 2. Maqsad va vazifalar
# ============================================================================
h("2. Ishning maqsadi va vazifalari", 1)
rich([("Maqsad: ", "b"),
      ("kolloid sistemalarning reologik xossalarini ularning strukturasi va "
       "zarrachalararo o'zaro ta'sirlar bilan bog'lab tizimlashtirish.", "")])
p("Vazifalar:", bold=True, after=2)
bullets([
    "reologiyaning asosiy tushunchalari va qovushqoqlikning konsentratsiyaga bog'liqligini (Eynshteyn, Kriger–Dogerti) yoritish;",
    "nenyuton suyuqliklarni tasniflash va ularning oqim egri chiziqlarini matematik modellar (Ostvald–de Vaale, Gershel–Balkli, Kross) bilan tavsiflash;",
    "plastiklik va oquvchanlik chegarasining strukturaviy tabiatini (Bingam, Kasson, Rebinder strukturalari) ko'rsatish;",
    "tiksotropiya va reopeksiya mexanizmlarini, ularni miqdoriy baholashni tahlil qilish;",
    "gellarning qovushqoq-elastik xossalari va mexanik barqarorligini belgilovchi omillarni umumlashtirish;",
    "reometrik usullar va amaliy ahamiyatini keltirish.",
], style="List Number")

# ============================================================================
# 3. Reja
# ============================================================================
h("3. Ishning rejasi", 1)
bullets([
    ("Reologiya asoslari: ", "siljish kuchlanishi, siljish tezligi, Nyuton qonuni, qovushqoqlikning konsentratsiyaga bog'liqligi."),
    ("Nenyuton suyuqliklar: ", "tasnif, psevdoplastik va dilatant oqim, darajali qonun, Kross modeli, mexanizmlar."),
    ("Plastiklik: ", "oquvchanlik chegarasi, Bingam va Gershel–Balkli jismlari, Kasson modeli, Rebinder strukturalari."),
    ("Tiksotropiya va reopeksiya: ", "gisterezis halqasi, strukturaviy kinetika, tiklanish vaqti, amaliy ahamiyati."),
    ("Gel strukturalarining mexanik barqarorligi: ", "qovushqoq-elastiklik, G′ va G″, chiziqli soha va yemirilish, fraktal masshtablash, sinerezis, barqarorlashtirish omillari."),
    ("Reometrik usullar ", "va amaliy qo'llanilishi."),
    ("Xulosa.", ""),
], style="List Number")

# ============================================================================
# 4. Asosiy qism
# ============================================================================
h("4. Asosiy qism", 1)

# ---- 4.1 ------------------------------------------------------------------
h("4.1. Reologiyaning asosiy tushunchalari", 2)
rich([("Ikki parallel qatlam orasidagi suyuqlik uchun siljish kuchlanishi ", ""),
      omath(V("τ")), (" (Pa) va siljish tezligi ", ""),
      omath(dot(V("γ"))), (" (s⁻¹) o'rtasidagi bog'liqlik Nyuton qonuni bilan beriladi:", "")])
equation(
    omath(V("τ"), P(" = "), V("η"), P("·"), dot(V("γ")), P(" = "), V("η"),
          frac(seq(V("d"), V("v")), seq(V("d"), V("x")))),
    where=[omath(V("η")), (" — dinamik qovushqoqlik (Pa·s); u faqat harorat va bosimga "
                          "bog'liq, siljish tezligiga bog'liq emas. Bunday suyuqliklar "
                          "(suv, glitserin, past molekulyar eritmalar, suyultirilgan zollar) ", ""),
           ("nyuton suyuqliklari", "i"), (" deyiladi; ularning oqim egri chizig'i ", ""),
           omath(V("τ"), P("–"), dot(V("γ"))), (" koordinatada koordinata boshidan o'tuvchi to'g'ri chiziq.", "")],
)
rich([("Qattiq jism uchun esa Guk qonuni o'rinli: ", ""),
      omath(V("τ"), P(" = "), V("G"), P("·"), V("γ")),
      (", bu yerda G — siljish moduli, γ — nisbiy deformatsiya. Real kolloid "
       "sistemalar ikkala chekka holat orasida — ular qovushqoq-elastik.", "")])
rich([("Qovushqoqlikning konsentratsiyaga bog'liqligi. ", "b"),
      ("Suyultirilgan (φ < 0,05) sferik zarrachali dispersiya uchun Eynshteyn tenglamasi:", "")])
equation(
    omath(sub(V("η"), P("r")), P(" = "), frac(V("η"), sub(V("η"), P("0"))),
          P(" = 1 + "), P("2,5"), V("φ")),
    where=[omath(V("φ")), (" — dispers faza hajmiy ulushi, ", ""),
           omath(sub(V("η"), P("0"))), (" — dispers muhit qovushqoqligi. Koeffitsient 2,5 "
                                        "faqat qattiq sferalar uchun; nosferik va solvatlangan "
                                        "zarrachalarda u kattaroq (ellipsoid uchun aspekt "
                                        "nisbati bilan ortadi).", "")],
)
rich([("Konsentrlangan sistemalarda gidrodinamik o'zaro ta'sir va zarrachalarning "
       "\"tiqilib qolishi\" hisobga olinadi — Kriger–Dogerti tenglamasi:", "")])
equation(
    omath(sub(V("η"), P("r")), P(" = "),
          sup(par(seq(P("1 − "), frac(V("φ"), sub(V("φ"), P("m"))))),
              seq(P("−["), V("η"), P("]"), sub(V("φ"), P("m"))))),
    where=[omath(sub(V("φ"), P("m"))),
           (" — maksimal qadoqlanish ulushi (tasodifiy zich qadoqlanish uchun ≈ 0,64), ", ""),
           omath(P("["), V("η"), P("]")),
           (" — xarakteristik qovushqoqlik (sfera uchun 2,5). φ → φₘ da qovushqoqlik "
            "cheksiz ortadi — sistema oqimini yo'qotadi. Rebinder bo'yicha strukturaga "
            "ega sistemalarda qovushqoqlikning kuchlanishga bog'liq \"effektiv\" "
            "qiymati haqida gapiriladi (strukturaviy qovushqoqlik).", "")],
)

# ---- 4.2 ------------------------------------------------------------------
h("4.2. Nenyuton suyuqliklar", 2)
p("Nenyuton suyuqliklarda effektiv qovushqoqlik siljish tezligiga (va ba'zan "
  "vaqtga) bog'liq. Ular uch guruhga bo'linadi: vaqtga bog'liq bo'lmagan "
  "(psevdoplastik, dilatant, plastik), vaqtga bog'liq (tiksotrop, reopeks) va "
  "qovushqoq-elastik sistemalar.")
table(
    ["Tur", "Oqim egri chizig'i", "Mexanizm", "Misollar"],
    [
        ["Psevdoplastik (siljishda suyuqlashuvchi)", "η siljish tezligi ortishi bilan kamayadi", "anizotrop zarrachalar oqim bo'ylab tekislanadi, flokulalar parchalanadi, polimer koptoklari cho'ziladi", "polimer eritmalari, bo'yoqlar, qon, ketchup, lateks"],
        ["Dilatant (siljishda quyuqlashuvchi)", "η siljish tezligi ortishi bilan ortadi", "zich (φ > 0,5) suspenziyada gidroklasterlar hosil bo'ladi, tartib buziladi, suyuqlik zarrachalarni \"yuvib ulgurmaydi\"", "kraxmal–suv (φ ≈ 0,5), kvarts qumi suspenziyasi, PVX plastizollar"],
        ["Plastik (Bingam)", "τ < τ₀ da oqmaydi, keyin chiziqli", "zarrachalar fazoviy to'r (karkas) hosil qiladi; to'r buzilgach oqadi", "tish pastasi, bentonit eritmasi, mayonez, sement xamiri"],
        ["Tiksotrop", "vaqt o'tishi bilan η kamayadi, tinchlikda tiklanadi", "koagulyatsion struktura qaytar parchalanadi va qayta tuziladi", "bentonit gellari, bo'yoqlar, jelatin, farmatsevtik suspenziyalar"],
        ["Reopeks (antitiksotrop)", "siljishda η vaqt bilan ortadi", "siljish zarrachalar to'qnashuvini ko'paytirib strukturalanishni tezlashtiradi", "gips pastasi, ba'zi lateks va bentonit suspenziyalari"],
    ],
    widths=[3.6, 3.6, 5.2, 4.1],
)
rich([("Darajali qonun. ", "b"),
      ("Vaqtga bog'liq bo'lmagan oqimning eng sodda modeli — Ostvald–de Vaale tenglamasi:", "")])
equation(
    omath(V("τ"), P(" = "), V("K"), P("·"), sup(dot(V("γ")), V("n")),
          P(",      "),
          sub(V("η"), P("eff")), P(" = "), V("K"), P("·"), sup(dot(V("γ")), seq(V("n"), P(" − 1")))),
    where=[omath(V("K")), (" — konsistentlik ko'rsatkichi (Pa·sⁿ), ", ""),
           omath(V("n")), (" — oqim indeksi: n = 1 — nyuton suyuqlik, n < 1 — psevdoplastik "
                           "(ko'pchilik polimer eritmalari uchun 0,3–0,7), n > 1 — dilatant. "
                           "Model o'rtacha siljish tezliklari uchun o'rinli; juda past va "
                           "juda yuqori tezliklarda qovushqoqlik chekka qiymatlarga ", ""),
           omath(sub(V("η"), P("0"))), (" va ", ""), omath(sub(V("η"), V("∞"))), (" ga intiladi.", "")],
)
rich([("Kross modeli ", "b"),
      ("butun diapazonni qamraydi:", "")])
equation(
    omath(V("η"), P(" = "), sub(V("η"), V("∞")), P(" + "),
          frac(seq(sub(V("η"), P("0")), P(" − "), sub(V("η"), V("∞"))),
               seq(P("1 + "), sup(par(seq(V("λ"), dot(V("γ")))), V("m"))))),
    where=[omath(V("λ")), (" — xarakteristik vaqt (strukturaning relaksatsiya vaqti), ", ""),
           omath(V("m")), (" — siljishda suyuqlashuv darajasi. Fizik ma'nosi: ", ""),
           omath(dot(V("γ")), P(" ≪ 1/"), V("λ")),
           (" da Broun harakati strukturani tiklab ulguradi (birinchi nyuton platosi), ", ""),
           omath(dot(V("γ")), P(" ≫ 1/"), V("λ")),
           (" da struktura to'liq buzilgan (ikkinchi plato). Bu nisbat Peklet soni ", ""),
           omath(P("Pe"), P(" = "), frac(seq(P("6"), V("π"), sub(V("η"), P("0")), sup(V("a"), P("3")), dot(V("γ"))),
                                          seq(sub(V("k"), P("B")), V("T")))),
           (" bilan ifodalanadi — Pe ≈ 1 atrofida nenyuton xususiyat eng kuchli namoyon bo'ladi.", "")],
)

# ---- 4.3 ------------------------------------------------------------------
h("4.3. Plastiklik va oquvchanlik chegarasi", 2)
p("Plastik jismlar ma'lum kritik kuchlanishga — oquvchanlik chegarasiga — "
  "qadar elastik deformatsiyalanadi (yoki umuman deformatsiyalanmaydi), undan "
  "keyin suyuqlik kabi oqadi. Kolloid sistemalarda oquvchanlik chegarasi "
  "zarrachalarning butun hajm bo'ylab uzluksiz fazoviy to'r (karkas) hosil "
  "qilishidan kelib chiqadi; to'rni buzish uchun kontaktlarni uzish kerak.")
rich([("Bingam modeli:", "b")])
equation(
    omath(V("τ"), P(" = "), sub(V("τ"), P("B")), P(" + "), sub(V("η"), P("pl")), P("·"), dot(V("γ")),
          P("      ("), V("τ"), P(" > "), sub(V("τ"), P("B")), P(")")),
    where=[omath(sub(V("τ"), P("B"))), (" — Bingam oquvchanlik chegarasi, ", ""),
           omath(sub(V("η"), P("pl"))),
           (" — plastik qovushqoqlik (to'r buzilgandan keyingi oqim qarshiligi). "
            "Umumiy holda oquvchanlik chegarasidan keyin oqim nochiziqli bo'ladi — ", ""),
           ("Gershel–Balkli", "b"), (" modeli: ", "")],
)
equation(
    omath(V("τ"), P(" = "), sub(V("τ"), P("0")), P(" + "), V("K"), P("·"), sup(dot(V("γ")), V("n"))),
)
rich([("Qon, shokolad massasi va siyohlar uchun ", ""), ("Kasson", "b"), (" modeli yaxshiroq mos keladi:", "")])
equation(
    omath(sqrt(V("τ")), P(" = "), sqrt(sub(V("τ"), P("c"))), P(" + "),
          sqrt(seq(sub(V("η"), P("c")), P("·"), dot(V("γ"))))),
    where=[("qon uchun τ_c ≈ 3–5 mPa (eritrotsitlarning \"tanga ustunlari\" — ruleaux "
            "agregatlari hisobiga), 37 °C da ηc ≈ 3–4 mPa·s.", "")],
)
rich([("Rebinder bo'yicha dispers strukturalar. ", "b"),
      ("Oquvchanlik chegarasi va mustahkamlik strukturadagi kontaktlar turi bilan belgilanadi:", "")])
bullets([
    ("Koagulyatsion strukturalar: ", "zarrachalar DLVO ikkilamchi minimumida yupqa suyuqlik qatlamchasi orqali van-der-Vaals kuchlari bilan bog'langan (kontakt mustahkamligi 10⁻¹¹–10⁻⁹ N). Mustahkamligi past (τ₀ ≈ 1–10³ Pa), lekin QAYTAR: buzilgandan keyin o'z-o'zidan tiklanadi — tiksotropiya; plastik, elastik, sinerezisga moyil (bentonit gellari, bo'yoqlar, loy massalari, farmatsevtik gellar)."),
    ("Kondensatsion-kristallizatsion strukturalar: ", "zarrachalar bevosita kimyoviy (fazaviy) kontaktlar bilan bog'langan (10⁻⁸–10⁻⁶ N). Yuqori mustahkamlik (10⁵–10⁸ Pa), elastik-mo'rt, QAYTMAS — buzilgach tiklanmaydi (sement toshi, gips, keramika, silikagel, metallar). Ular koagulyatsion strukturadan qotish jarayonida (gidratatsiya, kristallanish, polikondensatsiya) hosil bo'ladi."),
])
rich([("Oquvchanlik chegarasining masshtabi kontakt kuchi ", ""),
      omath(sub(V("F"), P("k"))), (", kontaktlar soni va zarracha o'lchami bilan baholanadi: ", ""),
      omath(sub(V("τ"), P("0")), P(" ≈ "), V("α"), P("·"),
            frac(seq(sup(V("φ"), V("m")), sub(V("F"), P("k"))), sup(V("d"), P("2")))),
      (" (m ≈ 2–4) — zarracha qancha mayda va konsentratsiya qancha yuqori bo'lsa, "
       "struktura shuncha mustahkam; shu sababli nanodispers to'ldiruvchilar "
       "(aerosil, bentonit) kam miqdorda ham kuchli strukturalovchi ta'sir ko'rsatadi.", "")])

# ---- 4.4 ------------------------------------------------------------------
h("4.4. Tiksotropiya va reopeksiya", 2)
p("Tiksotropiya (Peterfi, 1927; Freyndlix) — sistemaning mexanik ta'sirda "
  "(aralashtirish, silkitish) qaytar suyuqlashishi va tinch holatda vaqt "
  "o'tishi bilan qayta strukturalanishi. Reologik ta'rifi: doimiy siljish "
  "tezligida qovushqoqlikning vaqt bo'yicha qaytar kamayishi. Tiksotropiya "
  "koagulyatsion strukturalarga xos: siljish kontaktlarni uzadi, Broun "
  "harakati ularni qayta tiklaydi; tiklanish sekundlardan soatlargacha davom etadi.")
bullets([
    ("Miqdoriy baholash: ", "siljish tezligini oshirib-kamaytirib olingan oqim egri chiziqlari orasidagi gisterezis halqasi yuzasi (Pa/s); uch bosqichli test (3ITT: past → yuqori → past siljish) bo'yicha strukturaning tiklanish darajasi va vaqti; tinch turgandan keyingi oquvchanlik chegarasining o'sishi."),
    ("Reopeksiya (antitiksotropiya): ", "kuchsiz siljishda strukturalanish tezlashadi — zarrachalar to'qnashuv chastotasi ortadi (gips pastasi, ba'zi kraxmal va lateks suspenziyalari); yuqori siljishda yana buziladi."),
])
rich([("Strukturaviy kinetika modeli. ", "b"),
      ("Strukturaning joriy holati 0 ≤ λ ≤ 1 struktura parametri bilan ifodalanadi "
       "(λ = 1 — to'liq tiklangan, λ = 0 — to'liq buzilgan); uning o'zgarishi "
       "tiklanish va buzilish tezliklari farqiga teng (Mur, Cheng–Evans):", "")])
equation(
    omath(frac(seq(V("d"), V("λ")), seq(V("d"), V("t"))), P(" = "),
          V("a"), par(seq(P("1 − "), V("λ"))), P(" − "),
          V("b"), P("·"), V("λ"), P("·"), sup(dot(V("γ")), V("n")),
          P(",      "),
          V("η"), P(" = "), sub(V("η"), V("∞")), P(" + "), V("λ"),
          par(seq(sub(V("η"), P("0")), P(" − "), sub(V("η"), V("∞"))))),
    where=[omath(V("a")), (" — tiklanish (Broun) tezlik doimiysi, ", ""),
           omath(V("b")), (" — siljishda buzilish doimiysi. Statsionar holatda ", ""),
           omath(sub(V("λ"), P("st")), P(" = "),
                 frac(V("a"), seq(V("a"), P(" + "), V("b"), sup(dot(V("γ")), V("n"))))),
           (" — siljish tezligi qancha yuqori bo'lsa, muvozanat struktura shuncha kam; "
            "tiklanish vaqti ≈ 1/a.", "")],
)
rich([("Amaliy ahamiyati. ", "b"),
      ("Bo'yoqlar: cho'tka ostida (γ̇ ≈ 10³–10⁴ s⁻¹) suyuq, devorda tez quyuqlashib "
       "oqib tushmaydi, lekin tiklanish juda tez bo'lmasligi kerak — cho'tka izlari "
       "tekislanishi uchun. Farmatsevtik suspenziyalar: saqlashda cho'kmaydi, "
       "silkitganda bir xil doza quyiladi. Burg'ulash eritmalari (bentonit): nasos "
       "to'xtaganda shlamni muallaq ushlab turadi. Ketchup, yogurt, kosmetik kremlar, "
       "3D-bosma uchun keramik va biosiyohlar — shaklni saqlash va ekstruziya "
       "talablari tiksotropiya orqali muvofiqlashtiriladi.", "")])

# ---- 4.5 ------------------------------------------------------------------
h("4.5. Gel strukturalarining mexanik barqarorligi", 2)
p("Gel — dispers faza (polimer zanjirlari yoki kolloid zarrachalar) butun hajm "
  "bo'ylab uzluksiz uch o'lchamli to'r hosil qilgan, to'r ichida dispers muhit "
  "immobilizatsiyalangan sistema. Gel hosil bo'lishi perkolyatsiya chegarasida — "
  "birinchi cheksiz klaster paydo bo'lganda — sodir bo'ladi (gel nuqtasi). Gellar "
  "fizik (qaytar bog'lar: vodorod, ion, gidrofob, kristallitlar — jelatin, agar, "
  "alginat–Ca²⁺, bentonit) va kimyoviy (kovalent tikilgan — poliakrilamid, "
  "silikagel, vulkanlangan kauchuk) turlarga bo'linadi.")
rich([("Qovushqoq-elastiklik. ", "b"),
      ("Gel kichik sinusoidal deformatsiyada bir vaqtning o'zida energiyani "
       "saqlaydi (elastik) va tarqatadi (qovushqoq); kompleks modul:", "")])
equation(
    omath(sup(V("G"), P("*")), P(" = "), V("G"), P("′ + "), V("i"), V("G"), P("″,      "),
          P("tg"), V("δ"), P(" = "), frac(seq(V("G"), P("″")), seq(V("G"), P("′")))),
    where=[omath(V("G"), P("′")), (" — saqlash (elastik) moduli, ", ""),
           omath(V("G"), P("″")), (" — yo'qotish (qovushqoq) moduli, ", ""),
           omath(V("δ")), (" — fazalar siljishi. Gel uchun G′ > G″ (tg δ < 1) va G′ "
                           "chastotaga deyarli bog'liq emas (plato); zol uchun G″ > G′. "
                           "Gel nuqtasi — G′ = G″ kesishuvi (Vinter–Shambon mezoni). "
                           "Mustahkam gellarda tg δ ≈ 0,01–0,1, kuchsiz gellarda 0,1–0,5.", "")],
)
rich([("Relaksatsiya. ", "b"),
      ("Maksvell modelida doimiy deformatsiyadagi kuchlanish eksponensial "
       "bo'shashadi, relaksatsiya vaqti qovushqoqlikning modulga nisbatiga teng:", "")])
equation(
    omath(V("τ"), par(V("t")), P(" = "), sub(V("τ"), P("0")), P("·"),
          sup(V("e"), seq(P("−"), V("t"), P("/"), sub(V("t"), P("rel")))), P(",      "),
          sub(V("t"), P("rel")), P(" = "), frac(V("η"), V("G")), P(",      "),
          P("De"), P(" = "), frac(sub(V("t"), P("rel")), sub(V("t"), P("kuz")))),
    where=[("Debora soni De >> 1 bo'lsa sistema qattiq jismdek (elastik), De << 1 bo'lsa "
            "suyuqlikdek (qovushqoq) javob beradi: jelatin geli sekin bosimda oqadi, "
            "tez zarbda sinadi; kimyoviy gellarda ", ""),
           omath(sub(V("t"), P("rel")), P(" → ∞")), (".", "")],
)
rich([("Mustahkamlik va yemirilish. ", "b"),
      ("Amplituda bo'yicha skanerlashda G′ ma'lum kritik deformatsiyagacha "
       "(chiziqli qovushqoq-elastik soha, ", ""), omath(sub(V("γ"), P("L"))),
      (") doimiy, so'ngra pasayadi; G′ = G″ "
       "nuqtasidagi kuchlanish — oqish nuqtasi (gelning oquvchanlik chegarasi). "
       "Koagulyatsion gellar uchun ", ""), omath(sub(V("γ"), P("L")), P(" ≈ 0,1–1 %")),
      (" (mo'rt), polimer gellar uchun "
       "10–100 % (egiluvchan). Kolloid zarrachali gellarda to'r fraktal "
       "klasterlardan tuzilgan va elastiklik moduli konsentratsiyaga darajali "
       "bog'liq (Shih va b.):", "")])
equation(
    omath(V("G"), P("′ ∝ "), sup(V("φ"), frac(seq(V("d"), P(" + "), V("x")),
                                              seq(V("d"), P(" − "), sub(V("D"), P("f"))))),
          P(",      "),
          sub(V("γ"), P("L")), P(" ∝ "), sup(V("φ"), seq(P("−"), frac(seq(P("1 + "), V("x")),
                                                                     seq(V("d"), P(" − "), sub(V("D"), P("f"))))))),
    where=[omath(sub(V("D"), P("f"))), (" — klaster fraktal o'lchami (1,8–2,5), ", ""),
           omath(V("x")), (" — klaster \"umurtqasi\" fraktal o'lchami (1–1,3), ", ""),
           omath(V("d"), P(" = 3")), (". Odatda ", ""), omath(V("G"), P("′ ∝ "), sup(V("φ"), V("n"))),
           (", n ≈ 3–5 — konsentratsiyaning ikki marta ortishi modulni 8–30 marta oshiradi.", "")],
)
p("Mexanik barqarorlikni belgilovchi omillar va uni oshirish yo'llari:", bold=True, after=2)
bullets([
    ("Konsentratsiya va zarracha o'lchami: ", "φ ortishi va d kamayishi kontaktlar sonini oshiradi (tenglama 12, 4.3-bo'lim); perkolyatsiya chegarasidan past gel hosil bo'lmaydi."),
    ("Zarrachalararo o'zaro ta'sir: ", "ion kuchi va pH DLVO to'sig'ini boshqaradi — koagulyatsiya ikkilamchi minimumda bo'lsa gel tiksotrop va plastik, birlamchi minimumda bo'lsa mo'rt va qaytmas; izoelektrik nuqta yaqinida oqsil gellari (kazein, yogurt) eng mustahkam; ko'p zaryadli ionlar (Ca²⁺ — alginat \"tuxum qutisi\" modeli, pektin) ionli tikish beradi."),
    ("Harorat: ", "fizik gellar qaytar eriydi (jelatin ≈ 30 °C, agar ≈ 85 °C — gisterezis); metilselluloza va poloksamer gellari aksincha qizdirilganda hosil bo'ladi (termoqaytar \"in situ\" gellar)."),
    ("Sinerezis va qarish: ", "to'r vaqt o'tishi bilan siqilib suyuqlikni ajratadi (qatiq, jele, bo'yoqlar); sababi — kontaktlar sonining ortishi va to'rning qayta tashkillanishi. Oldini olish: tikish zichligini optimallash, gidrofil qo'shimchalar (glitserin, sorbitol), to'ldiruvchi polimerlar (ksantan, guar), ikki tarmoqli (IPN) gellar."),
    ("Mexanik ta'sir va ko'chirish: ", "tiksotrop gellar (karbomer, bentonit) pompalash va surtishda buziladi, so'ng tiklanadi — bu farmatsevtik va kosmetik gellar uchun afzallik; kimyoviy gellar esa qaytmas yemiriladi, shu sababli ularga uzilishga chidamlilik (toughness) beruvchi ikki tarmoqli yoki nanokompozit (laponit) tuzilmalar kiritiladi."),
    ("Strukturaviy-mexanik to'siq (Rebinder): ", "zarracha sirtidagi YuMB/SFM adsorbsion-gel qavat yuqori strukturaviy qovushqoqlik va elastiklikka ega bo'lib, koalessensiya va koagulyatsiyaga qarshi eng universal barqarorlik omilidir (emulsiyalar, ko'piklar, suspenziyalar)."),
])

# ---- 4.6 ------------------------------------------------------------------
h("4.6. Reometrik usullar", 2)
table(
    ["Usul / test", "O'lchanadigan kattalik", "Qo'llanilishi"],
    [
        ["Kapillyar viskozimetr (Ostvald, Ubbelode)", "kinematik qovushqoqlik", "nyuton suyuqliklar, suyultirilgan zollar, [η]"],
        ["Rotatsion reometr (konus–plastinka, silindrlar)", "τ–γ̇ oqim egri chizig'i, η(γ̇), τ₀", "nenyuton suyuqliklar, modellarga moslash"],
        ["Oqim egri chizig'i yuqoriga/pastga", "gisterezis halqasi yuzasi", "tiksotropiya miqdori"],
        ["3ITT (uch bosqichli test)", "strukturaning tiklanish % va vaqti", "bo'yoqlar, gellar, 3D-siyohlar"],
        ["Amplituda skanerlash (ossillyatsiya)", "G′, G″, chiziqli soha γₗ, oqish nuqtasi", "gel mustahkamligi, yemirilish"],
        ["Chastota skanerlash", "G′(ω), G″(ω), tg δ, relaksatsiya spektri", "gel/zol farqlash, to'r tabiati"],
        ["Krip va tiklanish", "egiluvchanlik J(t), η₀, elastik ulush", "oquvchanlik chegarasi, uzoq muddatli barqarorlik"],
        ["Parrak (vane) usuli, penetrometr, Veyler–Rebinder plastinkasi", "statik oquvchanlik chegarasi, mustahkamlik", "pastalar, loylar, oziq-ovqat gellari"],
        ["Mikroreologiya (DLS, zarracha kuzatuvi)", "mahalliy G′, G″", "biologik gellar, kichik hajmli namunalar"],
    ],
    widths=[5.5, 5.5, 5.5],
)

# ---- 4.7 ------------------------------------------------------------------
h("4.7. Amaliy ahamiyati", 2)
bullets([
    "Farmatsevtika: gellar (karbomer, HPMC) va malhamlarning surtiluvchanligi va shaklni saqlashi; suspenziyalarda dozaning bir xilligi; termoqaytar in situ gellar (ko'z, burun); in'yeksiya qilinadigan gidrogellar (siljishda suyuqlashish).",
    "Oziq-ovqat: yogurt, pishloq, mayonez, shokolad (Kasson), jele — tekstura, og'izdagi his, saqlashda sinerezis nazorati.",
    "Qurilish va keramika: sement va gips xamirlarining plastikligi, suyuqlashtiruvchi qo'shimchalar (superplastifikatorlar) orqali τ₀ ni boshqarish; loy massalarini shakllash.",
    "Neft-gaz va bo'yoq sanoati: bentonit burg'ulash eritmalari, tiksotrop bo'yoqlar va laklar, siyohlar.",
    "Biotibbiyot: qon reologiyasi (gematokrit, ruleaux, Fareus–Lindkvist effekti), sinovial suyuqlik, shilliq; to'qima muhandisligi uchun biosiyohlar.",
])

# ============================================================================
# 5. Xulosa
# ============================================================================
h("5. Xulosa", 1)
bullets([
    "Kolloid sistemalarning reologik xossalari zarrachalararo o'zaro ta'sirlar va dispers strukturaning holati bilan belgilanadi; suyultirilgan zollar nyuton suyuqlik (Eynshteyn), konsentrlanganlari esa nenyuton (Kriger–Dogerti) bo'lib, φ → φₘ da oqimini yo'qotadi.",
    "Nenyuton oqim turlari — psevdoplastiklik (strukturaning siljishda buzilishi), dilatansiya (gidroklasterlar) va plastiklik (fazoviy karkas) — darajali qonun, Kross, Bingam, Gershel–Balkli va Kasson modellari bilan miqdoriy tavsiflanadi; mexanizmlar Peklet soni orqali tushuntiriladi.",
    "Oquvchanlik chegarasi koagulyatsion yoki kondensatsion-kristallizatsion strukturaning mavjudligidan dalolat beradi (Rebinder); birinchisi kuchsiz, qaytar va tiksotrop, ikkinchisi mustahkam, mo'rt va qaytmas.",
    "Tiksotropiya — koagulyatsion strukturaning siljishda buzilishi va Broun harakati hisobiga tiklanishi; u strukturaviy kinetika tenglamasi bilan ifodalanadi va bo'yoq, dori, oziq-ovqat, burg'ulash suyuqliklarining eng muhim texnologik xossasidir.",
    "Gellarning mexanik barqarorligi qovushqoq-elastik parametrlar (G′, G″, tg δ, chiziqli soha, oqish nuqtasi, relaksatsiya vaqti) bilan baholanadi; modul konsentratsiyaga darajali (fraktal) bog'liq, barqarorlik esa zarracha o'lchami, ion kuchi, pH, harorat, tikish zichligi va strukturaviy-mexanik to'siq bilan boshqariladi.",
    "Reologik nazorat (oqim egri chiziqlari, ossillyatsion va krip testlari, 3ITT) kolloid mahsulotlar sifatini loyihalash va kafolatlashning asosiy vositasidir.",
], style="List Number")

# ============================================================================
# 6. Adabiyotlar
# ============================================================================
refs = [
    "Barnes H.A., Hutton J.F., Walters K. An Introduction to Rheology. – Amsterdam: Elsevier, 1989.",
    "Mewis J., Wagner N.J. Colloidal Suspension Rheology. – Cambridge: Cambridge University Press, 2012.",
    "Larson R.G. The Structure and Rheology of Complex Fluids. – New York: Oxford University Press, 1999.",
    "Barnes H.A. Thixotropy — a review // J. Non-Newtonian Fluid Mech. – 1997. – Vol. 70. – P. 1–33.",
    "Krieger I.M., Dougherty T.J. A mechanism for non-Newtonian flow in suspensions of rigid spheres // Trans. Soc. Rheol. – 1959. – Vol. 3. – P. 137–152.",
    "Shih W.-H., Shih W.Y., Kim S.-I., Liu J., Aksay I.A. Scaling behavior of the elastic properties of colloidal gels // Phys. Rev. A. – 1990. – Vol. 42. – P. 4772–4779.",
    "Mezger T.G. The Rheology Handbook. 4th ed. – Hanover: Vincentz Network, 2014.",
    "Урьев Н.Б. Физико-химическая динамика дисперсных систем и материалов. – М.: Интеллект, 2013.",
    "Щукин Е.Д., Перцов А.В., Амелина Е.А. Коллоидная химия. – М.: Высшая школа, 2004.",
    "Фролов Ю.Г. Курс коллоидной химии. Поверхностные явления и дисперсные системы. – М.: Химия, 2004.",
    "Ahmedov Q.R., Qurbonov A.R. Kolloid kimyo. – Toshkent: O'zbekiston, 2012.",
]
H.refs(refs)
H.save(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    "Reologik-xossalar-mustaqil-ish.docx"))
