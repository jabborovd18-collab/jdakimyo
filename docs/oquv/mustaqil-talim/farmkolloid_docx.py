# -*- coding: utf-8 -*-
"""
Mustaqil ta'lim topshirig'i (6.3) uchun qisqa ilmiy hujjat generatori.
Mavzu: Farmatsevtik kolloid sistemalar: nanosuspenziyalar, liposomalar,
nanoemulsiyalar va dori moddalarning yetkazib berilish mexanizmlari.

Uslub va tenglama qurilmasi omml_docx.py da (yagona manba).
Ishga tushirish:  python3 farmkolloid_docx.py   →  .docx + .pdf
"""
import os

from omml_docx import Hujjat, P, V, bar, frac, omath, par, seq, sqrt, sub, subsup, sup

H = Hujjat()
p, rich, equation, bullets, table, h = H.p, H.rich, H.equation, H.bullets, H.table, H.h

# ============================================================================
# Sarlavha
# ============================================================================
H.title("Kolloid kimyo / Farmatsevtik nanotexnologiya",
        "FARMATSEVTIK KOLLOID SISTEMALAR: NANOSUSPENZIYALAR, LIPOSOMALAR, "
        "NANOEMULSIYALAR VA DORI MODDALARNING YETKAZIB BERILISH MEXANIZMLARI")

rich([
    ("Annotatsiya. ", "b"),
    ("Ishda dori moddalarning kolloid tashuvchi sistemalari — nanosuspenziyalar, "
     "liposomalar (shu jumladan lipid nanozarrachalar) va nanoemulsiyalar — "
     "tuzilishi, olinish usullari, barqarorligi va sifat ko'rsatkichlari "
     "nuqtayi nazaridan qisqa tahlil qilinadi. Noyes–Uitni, Ostvald–Freyndlix, "
     "Lifshits–Slyozov–Vagner, Laplas, Stoks tenglamalari, HLB tizimi va "
     "DLVO nazariyasi asosida \"kolloid parametr → biofarmatsevtik natija\" "
     "bog'liqligi ko'rsatiladi; dori yetkazishning passiv (EPR), faol va "
     "stimulga javob beruvchi mexanizmlari, hujayraga kirish yo'llari va "
     "ajralib chiqish kinetikasi (Xiguchi, Korsmeyer–Peppas) umumlashtiriladi.", ""),
])
rich([
    ("Kalit so'zlar: ", "b"),
    ("nanosuspenziya, liposoma, lipid nanozarracha, nanoemulsiya, SNEDDS, "
     "bioavailablik, Ostvald yetilishi, HLB, ζ-potensial, EPR effekti, "
     "faol nishonlash, endotsitoz, ajralib chiqish kinetikasi.", "i"),
])

# ============================================================================
# 1. Kirish
# ============================================================================
h("1. Kirish va mavzuning dolzarbligi", 1)
p("Zamonaviy dori kashfiyotidagi yangi faol moddalarning 40 % dan ortig'i "
  "suvda yomon eriydi (Biofarmatsevtik tasnif tizimi — BCS II va IV sinflar), "
  "ko'plari esa organizmda tez parchalanadi yoki nishon to'qimaga tanlab "
  "yetib bormaydi. Bu muammolarning yechimi kolloid kimyo doirasida topildi: "
  "dori moddani 10–500 nm o'lchamli zarracha, vezikula yoki tomchi ko'rinishida "
  "dispers holatga keltirish eruvchanlik va erish tezligini keskin oshiradi, "
  "moddani fermentativ parchalanishdan himoya qiladi, qonda aylanish vaqtini "
  "uzaytiradi va uni kasal to'qimada tanlab to'plash imkonini beradi. "
  "Farmatsevtik kolloidlar — dori turlari texnologiyasining alohida sinfi: "
  "Doxil (liposomal doksorubitsin, 1995), Rapamune (sirolimus nanokristallari), "
  "Diprivan (propofol nanoemulsiyasi), Abraxane (albumin–paklitaksel) va "
  "Comirnaty/Spikevax (mRNK lipid nanozarrachalari) kabi preparatlar "
  "klinik amaliyotda mustahkam o'rin egalladi. Shu sababli kolloid "
  "tashuvchilarning fizik-kimyoviy asoslarini va yetkazish mexanizmlarini "
  "bilish farmatsevt va kimyogar uchun zaruriy kompetensiyadir.")

# ============================================================================
# 2. Maqsad va vazifalar
# ============================================================================
h("2. Ishning maqsadi va vazifalari", 1)
rich([("Maqsad: ", "b"),
      ("asosiy farmatsevtik kolloid sistemalarning tuzilishi, barqarorligi va "
       "biofarmatsevtik xossalari o'rtasidagi kolloid-kimyoviy qonuniyatlarni "
       "hamda dori yetkazish mexanizmlarini tizimlashtirish.", "")])
p("Vazifalar:", bold=True, after=2)
bullets([
    "farmatsevtik kolloidlarga qo'yiladigan talablar va o'lcham effektining eruvchanlik/erish tezligiga ta'sirini asoslash;",
    "nanosuspenziyalarning olinishi, stabilizatsiyasi va Ostvald yetilishini tahlil qilish;",
    "liposomalar va lipid nanozarrachalarning tuzilishi, dori yuklash (passiv/faol) va \"stealth\" xossalarini yoritish;",
    "nanoemulsiyalarning termodinamik/kinetik barqarorligi, HLB tizimi va beqarorlik mexanizmlarini ko'rsatish;",
    "passiv (EPR), faol va stimulga javob beruvchi yetkazish mexanizmlari, hujayraga kirish yo'llari va ajralib chiqish kinetikasini umumlashtirish;",
    "sifat nazorati usullarini va tashuvchilarni qiyosiy baholashni keltirish.",
], style="List Number")

# ============================================================================
# 3. Reja
# ============================================================================
h("3. Ishning rejasi", 1)
bullets([
    ("Farmatsevtik kolloidlar: ", "tasnif, talablar, o'lcham–eruvchanlik–erish tezligi (Noyes–Uitni, Ostvald–Freyndlix)."),
    ("Nanosuspenziyalar: ", "top-down/bottom-up usullar, stabilizatorlar, DLVO, Ostvald yetilishi (LSW), misollar."),
    ("Liposomalar va lipid nanozarrachalar: ", "tuzilish, tarkib, olinish, passiv va faol yuklash, PEG-\"stealth\", mRNK-LNP."),
    ("Nanoemulsiyalar: ", "mikro- va nanoemulsiya farqi, HLB, yuqori/past energiyali usullar, Laplas bosimi, beqarorlik, SNEDDS."),
    ("Dori yetkazish mexanizmlari: ", "EPR, faol nishonlash, stimulga javob, endotsitoz, ajralib chiqish kinetikasi, farmakokinetika."),
    ("Sifat nazorati ", "va tashuvchilarning qiyosiy tavsifi."),
    ("Xulosa.", ""),
], style="List Number")

# ============================================================================
# 4. Asosiy qism
# ============================================================================
h("4. Asosiy qism", 1)

# ---- 4.1 ------------------------------------------------------------------
h("4.1. Farmatsevtik kolloid sistemalarning umumiy tavsifi", 2)
p("Farmatsevtik kolloidlar dispers faza tabiatiga ko'ra uch guruhga bo'linadi: "
  "(1) qattiq zarrachalar — nanosuspenziyalar (nanokristallar), polimer va "
  "qattiq lipid nanozarrachalar; (2) vezikulyar sistemalar — liposomalar, "
  "niosomalar, lipid nanozarrachalar; (3) suyuq dispersiyalar — nano- va "
  "mikroemulsiyalar, mitsellyar eritmalar. Ularning barchasiga umumiy talablar: "
  "o'lcham 10–500 nm (parenteral yo'l uchun < 220 nm — sterillovchi filtrlash), "
  "tor taqsimot (PDI < 0,3), yetarli sirt zaryadi (|ζ| > 20–30 mV) yoki sterik "
  "qobiq, saqlashda fizik va kimyoviy barqarorlik, biouyg'unlik va biodegradatsiya.")
rich([("O'lcham va erish tezligi. ", "b"),
      ("Qattiq dori zarrachasining erish tezligi Noyes–Uitni (Nernst–Brunner) "
       "tenglamasi bilan ifodalanadi:", "")])
equation(
    omath(frac(seq(V("d"), V("C")), seq(V("d"), V("t"))), P(" = "),
          frac(seq(V("D"), V("A")), seq(V("h"), V("V"))),
          par(seq(sub(V("C"), P("s")), P(" − "), V("C")))),
    where=[omath(V("A")), (" — zarrachalarning umumiy sirti, ", ""),
           omath(V("D")), (" — diffuziya koeffitsienti, ", ""),
           omath(V("h")), (" — diffuzion qatlam qalinligi, ", ""),
           omath(sub(V("C"), P("s"))), (" — to'yingan eruvchanlik, ", ""),
           omath(V("V")), (" — muhit hajmi. Zarracha 5 mkm dan 200 nm gacha "
                           "maydalansa, A 25 marta ortadi, h esa nanozarrachalar uchun "
                           "kamayadi — erish tezligi o'nlab marta oshadi.", "")],
)
rich([("To'yingan eruvchanlikning o'zi ham o'lchamga bog'liq (Ostvald–Freyndlix):", "")])
equation(
    omath(frac(sub(V("C"), P("s")), subsup(V("C"), P("s"), V("∞"))), P(" = exp"),
          par(frac(seq(P("2"), V("γ"), sub(V("V"), P("m"))),
                   seq(V("R"), V("T"), V("r"))))),
    where=[omath(V("γ")), (" — qattiq–suyuqlik sirt tarangligi, ", ""),
           omath(sub(V("V"), P("m"))), (" — molyar hajm. Ta'sir 100 nm dan kichik "
                                        "zarrachalarda sezilarli (10–15 % gacha); shu bilan "
                                        "birga u Ostvald yetilishining ham sababidir.", "")],
)

# ---- 4.2 ------------------------------------------------------------------
h("4.2. Nanosuspenziyalar (nanokristallar)", 2)
p("Nanosuspenziya — sof dori moddaning 100–1000 nm o'lchamli kristall "
  "zarrachalarining stabilizator yordamida suvda dispersiyasi. Tashuvchi "
  "matritsa yo'qligi tufayli dori yuklanishi ≈ 100 % — bu yuqori dozali "
  "BCS II/IV preparatlar uchun eng samarali yondashuv.")
bullets([
    ("Top-down usullar: ", "ho'l sharli maydalash (NanoCrystal®, 1–3 kun, 0,1–0,5 mm ZrO₂ sharlar) va yuqori bosimli gomogenizatsiya (DissoCubes®, 1500 bar, 10–20 sikl; kavitatsiya va zarbalar hisobiga maydalanish)."),
    ("Bottom-up usullar: ", "antierituvchi cho'ktirish (nukleatsiya–o'sishni nazorat qilish), superkritik CO₂, purkab quritish; afzalligi — energiya tejamkorligi, kamchiligi — amorf va metastabil shakllar hosil bo'lishi."),
    ("Stabilizatsiya: ", "elektrostatik (SDS, lesitin), sterik (poloksamer 188/407, PVP K30, HPMC, TPGS) yoki elektrosterik; stabilizator dori sirtiga adsorbsiyalanib DLVO to'sig'ini hosil qiladi; tanlov dori sirtining gidrofobligi va stabilizatorning moyilligi bilan belgilanadi."),
])
rich([("Ostvald yetilishi. ", "b"),
      ("Polidispers suspenziyada kichik zarrachalar (yuqori eruvchanlik, tenglama 2) "
       "eriydi, yiriklari o'sadi. Lifshits–Slyozov–Vagner (LSW) nazariyasiga ko'ra "
       "o'rtacha radius kubi vaqt bo'yicha chiziqli ortadi:", "")])
equation(
    omath(sup(bar(V("r")), P("3")), P(" − "), subsup(bar(V("r")), P("0"), P("3")),
          P(" = "),
          frac(seq(P("8"), V("γ"), V("D"), subsup(V("C"), P("s"), V("∞")), sub(V("V"), P("m"))),
               seq(P("9"), V("R"), V("T"))),
          P("·"), V("t")),
    where=[("tezlik eruvchanlik va diffuziya koeffitsientiga proporsional. Oldini olish "
            "choralari: tor dastlabki taqsimot (PDI < 0,2), eruvchanlikni kamaytirish "
            "(harorat, pH, ikkinchi erituvchini chiqarish), sirt tarangligini "
            "pasaytiruvchi stabilizator va liofilizatsiya (krioprotektor — trehaloza, mannit).", "")],
)
rich([("Sedimentatsiya. ", "b"),
      ("Stoks tenglamasiga ko'ra cho'kish tezligi ", ""),
      omath(V("v"), P(" ∝ "), sup(V("r"), P("2")), par(seq(V("ρ"), P(" − "), sub(V("ρ"), P("0"))))),
      (" — 200 nm li zarrachalar uchun Broun harakati ustun bo'lib, suspenziya "
       "amalda cho'kmaydi; yirikroq zarrachalar uchun qovushqoqlikni oshiruvchi "
       "(glitserin, selluloza hosilalari) qo'shiladi. ", ""),
      ("Misollar: ", "b"),
      ("Rapamune (sirolimus), Emend (aprepitant, bioavailablik 3 marta oshgan), "
       "Tricor (fenofibrat), Invega Sustenna (paliperidon palmitat — oyiga bir "
       "marta mushakka yuboriladigan depo).", "")])

# ---- 4.3 ------------------------------------------------------------------
h("4.3. Liposomalar va lipid nanozarrachalar", 2)
p("Liposoma — bir yoki bir necha fosfolipid bikatlamidan iborat, ichida suvli "
  "bo'shliq bo'lgan vezikula (SUV 20–100 nm, LUV 100–500 nm, MLV > 500 nm). "
  "Gidrofil dori ichki suvli hajmga, lipofil dori bikatlam ichiga joylashadi — "
  "bu liposomani universal tashuvchi qiladi. Standart tarkib: fosfatidilxolin "
  "(HSPC, DSPC) — bikatlam asosi, xolesterin (30–40 mol %) — qattiqlik va "
  "o'tkazuvchanlikni kamaytirish, DSPE-PEG₂₀₀₀ (5 mol %) — sterik qobiq.")
bullets([
    ("Olinish: ", "yupqa lipid plyonkani gidratlash → ultratovush yoki ekstruziya (100 nm polikarbonat membrana orqali) → tor taqsimotli LUV; etanol in'yeksiyasi; mikrofluidika (LNP uchun asosiy usul — oqimlarning tez aralashishi, 50–100 nm, PDI < 0,1)."),
    ("Passiv yuklash: ", "dori gidratlash eritmasida bo'ladi; gidrofil moddalar uchun samaradorlik past (5–20 %)."),
    ("Faol (remote) yuklash: ", "pH yoki ammoniy sulfat gradienti; neytral shakldagi kuchsiz asos membranadan o'tib, kislotali ichki muhitda protonlanadi va \"qamalib\" qoladi (Doxil: (NH₄)₂SO₄ gradienti, doksorubitsin-sulfat kristallari, yuklash > 95 %)."),
])
rich([("Kuchsiz asos uchun muvozanat taqsimoti pH gradienti bilan aniqlanadi:", "")])
equation(
    omath(frac(sub(P("[D]"), P("ichki")), sub(P("[D]"), P("tashqi"))), P(" = "),
          frac(sub(P("[H⁺]"), P("ichki")), sub(P("[H⁺]"), P("tashqi"))),
          P(" = "), sup(P("10"), seq(P("Δ"), P("pH")))),
    where=[("3 birlik pH gradienti (ichki 4,0 / tashqi 7,0) nazariy jihatdan 1000 marta "
            "to'planishni beradi.", "")],
)
rich([("Yuklash samaradorligi (EE) va yuklash sig'imi (LC):", "")])
equation(
    omath(P("EE"), P(" = "),
          frac(seq(sub(V("m"), P("yuklangan"))), seq(sub(V("m"), P("umumiy")))),
          P("·100 %,      "),
          P("LC"), P(" = "),
          frac(seq(sub(V("m"), P("yuklangan"))),
               seq(sub(V("m"), P("yuklangan")), P(" + "), sub(V("m"), P("lipid")))),
          P("·100 %")),
)
bullets([
    ("Barqarorlik va ajralib chiqish: ", "bikatlam o'tkazuvchanligi lipid fazaviy o'tish haroratiga (DSPC Tₘ = 55 °C) va xolesteringa bog'liq; Tₘ yaqinida o'tkazuvchanlik keskin ortadi — termosensitiv liposomalar (ThermoDox, lizolipid, Tₘ ≈ 41 °C) asosi. Lipid gidrolizi va oksidlanishi — kimyoviy beqarorlik; saqlash 2–8 °C."),
    ("\"Stealth\" effekti: ", "PEG qobiq opsoninlar adsorbsiyasini va mononuklear fagotsitar sistema (MPS) tomonidan tutilishini kamaytiradi: doksorubitsinning yarim chiqarilish davri 10 daqiqadan (erkin) 55 soatgacha (Doxil) uzayadi, kardiotoksiklik kamayadi."),
    ("Lipid nanozarrachalar (LNP): ", "ionlanuvchi lipid (pKₐ 6,2–6,7; DLin-MC3-DMA, ALC-0315, SM-102), DSPC, xolesterin va PEG-lipid (50:10:38,5:1,5). pH 4 da musbat zaryadlanib mRNK (N/P ≈ 6) bilan kompleks hosil qiladi, fiziologik pH da neytral — kam toksik; endosomada qayta protonlanib membrana bilan birikadi va mRNK sitoplazmaga chiqadi (Onpattro 2018, mRNK vaksinalari 2020)."),
])

# ---- 4.4 ------------------------------------------------------------------
h("4.4. Nanoemulsiyalar", 2)
p("Nanoemulsiya — tomchi o'lchami 20–200 nm bo'lgan moy/suv (M/S) yoki suv/moy "
  "dispersiyasi; shaffof yoki opalessent, kinetik barqaror, lekin termodinamik "
  "beqaror. Mikroemulsiyadan farqi: mikroemulsiya o'z-o'zidan hosil bo'ladi va "
  "termodinamik barqaror (sirt tarangligi ≈ 0, yuqori SFM miqdori), "
  "nanoemulsiya esa energiya sarfi bilan olinadi va vaqt o'tishi bilan "
  "buziladi, ammo SFM miqdori kam (5–10 %).")
rich([("Laplas bosimi. ", "b"),
      ("Tomchi ichidagi ortiqcha bosim radiusga teskari proporsional:", "")])
equation(
    omath(V("Δ"), V("P"), P(" = "), frac(seq(P("2"), V("γ")), V("r"))),
    where=[("100 nm li tomchi uchun (γ ≈ 10 mN/m) ΔP ≈ 2 atm — shuning uchun maydalash "
            "uchun yuqori energiya (gomogenizator 500–2000 bar, ultratovush) yoki sirt "
            "tarangligini keskin pasaytiruvchi past energiyali usullar (fazaviy inversiya "
            "harorati — PIT, fazaviy inversiya tarkibi — PIC, o'z-o'zidan emulsiyalanish) kerak.", "")],
)
rich([("Emulgatorni tanlash — HLB tizimi. ", "b"),
      ("Griffin bo'yicha noionogen SFM uchun HLB = 20·(1 − S/A) (S — efir soni, "
       "A — kislota soni); M/S nanoemulsiyalar uchun kerakli HLB 10–16, S/M uchun "
       "3–6. Aralash emulgatorning HLB qiymati additiv:", "")])
equation(
    omath(sub(P("HLB"), P("aralash")), P(" = "), P("Σ"), sub(V("x"), V("i")), P("·"),
          sub(P("HLB"), V("i"))),
    where=[omath(sub(V("x"), V("i"))), (" — har bir SFM ning massa ulushi. Tween 80 (HLB 15) "
                                        "+ Span 80 (HLB 4,3) juftligi moyning \"kerakli HLB\" "
                                        "qiymatiga moslashtiriladi; ko'pincha lesitin, poloksamer "
                                        "va Cremophor/Kolliphor ishlatiladi.", "")],
)
bullets([
    ("Beqarorlik mexanizmlari: ", [("qaymoqlanish (Stoks: ", ""), omath(V("v"), P(" ∝ "), sup(V("r"), P("2"))), (", 100 nm da ahamiyatsiz), flokulyatsiya va koalessensiya (DLVO + Gibbs–Marangoni elastikligi), Ostvald yetilishi — nanoemulsiyada ASOSIY mexanizm (tenglama 3), chunki moy suvda ozroq eriydi; oldini olish — suvda umuman erimaydigan uzun zanjirli moy (MCT ga 10–20 % LCT yoki skvalen) qo'shish.", "")]),
    ("Parenteral nanoemulsiyalar: ", "Intralipid (soya moyi 10–20 %, tuxum lesitini, 250–350 nm), Diprivan (propofol 1 %), Cleviprex (klevidipin), Vitalipid; talab — o'lcham < 500 nm, PFAT₅ < 0,05 %."),
    ("Peroral SEDDS/SNEDDS: ", "moy + SFM + ko-SFM izotrop aralashmasi (kapsulada) oshqozon-ichak suyuqligida o'z-o'zidan nanoemulsiya hosil qiladi; lipaz gidrolizi, mitsellyar solubilizatsiya va limfatik so'rilish orqali bioavailablik ortadi (Neoral — siklosporin, Fortovase — sakvinavir, Vitamin D, kannabinoidlar)."),
    ("Boshqa yo'llar: ", "oftalmik (Restasis — siklosporin 0,05 %), intranazal (miyaga olfaktor yo'l), transdermal (penetratsiya kuchaytiruvchi)."),
])

# ---- 4.5 ------------------------------------------------------------------
h("4.5. Dori moddalarning yetkazib berilish mexanizmlari", 2)
rich([("Passiv nishonlash — EPR effekti. ", "b"),
      ("O'sma va yallig'langan to'qimalarda qon tomir endoteliysi orasida "
       "100–800 nm teshiklar bo'ladi va limfatik drenaj buzilgan; shu sababli "
       "10–200 nm li kolloid tashuvchilar u yerda tanlab to'planadi va ushlanib "
       "qoladi (Enhanced Permeability and Retention, Maeda, 1986). Shartlar: "
       "o'lcham > 5,5 nm (buyrak filtratsiyasidan katta) va < 200 nm (MPS dan "
       "qochish), uzoq sirkulyatsiya (PEG), neytral yoki kuchsiz manfiy zaryad. "
       "Odamda EPR geterogen — shu bois tanlash biomarkerlar (masalan, "
       "ferumoksitol-MRT) bilan yo'naltiriladi.", "")])
rich([("Faol nishonlash. ", "b"),
      ("Tashuvchi sirtiga ligand biriktiriladi: folat (FR-α), transferrin, "
       "RGD-peptid (integrin αvβ3), antitelo yoki uning fragmenti (anti-HER2), "
       "aptamer, galaktoza/GalNAc (gepatotsit ASGPR retseptori — Givlaari). "
       "Ligand to'planishni emas, balki hujayra ichiga kirishni (retseptor "
       "vositasidagi endotsitoz) kuchaytiradi; ligand zichligi va PEG uzunligi "
       "optimallashtirilishi lozim.", "")])
rich([("Stimulga javob beruvchi (\"aqlli\") tashuvchilar. ", "b"),
      ("Ichki stimul: pH (o'sma 6,5, endosoma 5,0–5,5 — pH-sezgir lipidlar, gidrazon "
       "bog'), redoks (glutation 1–10 mM hujayra ichida — disulfid bog'), fermentlar "
       "(MMP-2/9, fosfolipaza A₂). Tashqi stimul: harorat (ThermoDox 40–42 °C), "
       "ultratovush (mikropufakchalar), yorug'lik, magnit maydon.", "")])
rich([("Hujayraga kirish. ", "b"),
      ("Nanotashuvchilar, erkin molekulalardan farqli, membranadan diffuziya "
       "qilmaydi, balki endotsitoz orqali kiradi: klatrin-bog'liq (≈ 120 nm "
       "vezikula), kaveolin-bog'liq (≈ 60 nm), makropinotsitoz (> 500 nm), "
       "fagotsitoz (makrofaglar). Keyingi hal qiluvchi bosqich — endosomadan "
       "chiqish: \"proton nasos\" effekti (PEI), ionlanuvchi lipidlarning "
       "endosomal membrana bilan birikishi, pH-sezgir peptidlar; aks holda tashuvchi "
       "lizosomada parchalanadi. Nanozarrachaning in vivo \"shaxsi\"ni qon "
       "oqsillaridan hosil bo'lgan oqsil koronasi belgilaydi.", "")])
rich([("Ajralib chiqish kinetikasi. ", "b"),
      ("Matritsadan diffuzion ajralib chiqish Xiguchi tenglamasi bilan, umumiy "
       "holda esa Korsmeyer–Peppas empirik modeli bilan tavsiflanadi:", "")])
equation(
    omath(V("Q"), P(" = "), sub(V("k"), P("H")), sqrt(V("t")), P(" = "),
          sqrt(seq(V("D"), par(seq(P("2"), sub(V("C"), P("0")), P(" − "), sub(V("C"), P("s")))),
                   sub(V("C"), P("s")), V("t")))),
)
equation(
    omath(frac(sub(V("M"), V("t")), sub(V("M"), V("∞"))), P(" = "), V("k"), sup(V("t"), V("n"))),
    where=[omath(V("Q")), (" — birlik sirtdan ajralgan miqdor, ", ""),
           omath(sub(V("C"), P("0"))), (" — matritsadagi boshlang'ich konsentratsiya, ", ""),
           omath(sub(V("M"), V("t")), P("/"), sub(V("M"), V("∞"))),
           (" — ajralgan ulush, ", ""),
           omath(V("n")), (" — mexanizm ko'rsatkichi: sferik zarracha uchun n = 0,43 — Fik "
                           "diffuziyasi, 0,43 < n < 0,85 — anomal (diffuziya + eroziya/shishish), "
                           "n = 0,85 — nol tartibli (II tur) transport. Liposomalar uchun "
                           "ko'pincha birinchi tartibli model, nanokristallar uchun esa "
                           "Noyes–Uitni (1) bo'yicha tez erish xos.", "")],
)
rich([("Farmakokinetik natija. ", "b"),
      ("Kolloid tashuvchi dorining taqsimlanish hajmini kamaytiradi, yarim "
       "chiqarilish davrini va AUC ni oshiradi, Cₘₐₓ ga bog'liq toksiklikni "
       "pasaytiradi (liposomal amfoteritsin B — AmBisome: nefrotoksiklik 5–10 "
       "marta kam). Nanosuspenziya va SNEDDS peroral yo'lda ovqatga bog'liqlikni "
       "va bemorlararo o'zgaruvchanlikni kamaytiradi.", "")])

# ---- 4.6 ------------------------------------------------------------------
h("4.6. Sifat nazorati va tashuvchilarning qiyosiy tavsifi", 2)
table(
    ["Ko'rsatkich", "Usul", "Talab / izoh"],
    [
        ["O'lcham, PDI", "DLS, NTA, lazer difraksiyasi", "< 200 nm (in'yeksiya), PDI < 0,3"],
        ["Morfologiya, lamellarlik", "Krio-TEM, AFM", "bikatlam soni, shakl, agregatlar"],
        ["Sirt zaryadi", "ζ-potensial (ELS)", "|ζ| > 20–30 mV yoki sterik qobiq"],
        ["Yuklash (EE, LC)", "Ultrafiltratsiya/dializ + HPLC", "tenglama (5); erkin dori ulushi"],
        ["Ajralib chiqish", "Dializ, Franz kamerasi, USP IV", "model: Xiguchi / Korsmeyer–Peppas"],
        ["Kristall holat", "XRD, DSC", "polimorf o'zgarishlar, amorfizatsiya"],
        ["Lipid fazaviy holati", "DSC, fluoressent zond", "Tₘ, xolesterin ta'siri"],
        ["Barqarorlik", "ICH Q1A, muzlatish–eritish, 40 °C/75 % RH", "o'lcham, EE, peroksid/gidroliz"],
        ["Sterillik, endotoksin", "0,22 mkm filtrlash, LAL-test", "parenteral shakllar uchun"],
    ],
    widths=[4.5, 5.5, 6.5],
)
table(
    ["Mezon", "Nanosuspenziya", "Liposoma / LNP", "Nanoemulsiya"],
    [
        ["Dispers faza", "qattiq kristall", "lipid bikatlam + suvli yadro", "suyuq moy tomchisi"],
        ["O'lcham", "100–1000 nm", "50–200 nm", "20–200 nm"],
        ["Dori turi", "yomon eriydigan (BCS II/IV)", "gidrofil va lipofil, nuklein kislotalar", "lipofil, moyda eriydigan"],
        ["Dori yuklanishi", "≈ 100 %", "5–20 % passiv, > 90 % faol", "moyda eruvchanlikka bog'liq"],
        ["Asosiy beqarorlik", "Ostvald yetilishi, agregatsiya", "lipid gidrolizi/oksidlanishi, sizish", "Ostvald yetilishi, koalessensiya"],
        ["Barqarorlik turi", "kinetik", "kinetik", "kinetik (mikroemulsiya — termodinamik)"],
        ["Yetkazish afzalligi", "erish tezligi, depo-in'yeksiya", "EPR, faol nishonlash, stealth, endosomal chiqish", "limfatik so'rilish, parenteral oziqlantirish"],
        ["Misollar", "Rapamune, Emend, Invega Sustenna", "Doxil, AmBisome, Onpattro, Comirnaty", "Diprivan, Intralipid, Neoral (SNEDDS)"],
    ],
    widths=[3.6, 4.3, 4.6, 4.0],
)

# ============================================================================
# 5. Xulosa
# ============================================================================
h("5. Xulosa", 1)
bullets([
    "Farmatsevtik kolloid sistemalar yomon eruvchanlik, beqarorlik va noselektivlik muammolarini dori moddani 10–500 nm dispers holatga keltirish orqali hal qiladi; natija zarracha o'lchami, sirt holati va tashuvchi tuzilishi bilan belgilanadi.",
    "Nanosuspenziyalar sirtni oshirish hisobiga erish tezligini (Noyes–Uitni) va to'yingan eruvchanlikni (Ostvald–Freyndlix) oshiradi; ularning asosiy kolloid muammosi — Ostvald yetilishi (LSW) va agregatsiya — stabilizator va tor taqsimot bilan boshqariladi.",
    "Liposomalar va LNP universal vezikulyar tashuvchilar: faol pH-gradientli yuklash > 90 % samaradorlik beradi, PEG qobiq sirkulyatsiya vaqtini o'nlab marta uzaytiradi, ionlanuvchi lipidlar nuklein kislotalarni hujayra ichiga yetkazish muammosini hal qildi.",
    "Nanoemulsiyalar kinetik barqaror suyuq dispersiyalar bo'lib, tomchi o'lchami Laplas bosimi va emulgator HLB qiymati bilan nazorat qilinadi; Ostvald yetilishi asosiy beqarorlik mexanizmi, SNEDDS esa peroral bioavailablikni oshirishning eng amaliy yo'li.",
    "Yetkazish mexanizmlari ierarxik: to'qima darajasida passiv (EPR) va faol nishonlash, hujayra darajasida endotsitoz va endosomal chiqish, molekulyar darajada stimulga javob va ajralib chiqish kinetikasi (Xiguchi, Korsmeyer–Peppas).",
    "Kolloid parametrlar (o'lcham, PDI, ζ, EE, ajralib chiqish profili) — farmatsevtik nanotizimlarning sifatini belgilovchi kritik ko'rsatkichlar; ularni DLS–krio-TEM–HPLC–DSC kompleksida nazorat qilish sanoat va regulyator talabidir.",
], style="List Number")

# ============================================================================
# 6. Adabiyotlar
# ============================================================================
refs = [
    "Florence A.T., Attwood D. Physicochemical Principles of Pharmacy. 6th ed. – London: Pharmaceutical Press, 2016.",
    "Müller R.H., Jacobs C., Kayser O. Nanosuspensions as particulate drug formulations in therapy // Adv. Drug Deliv. Rev. – 2001. – Vol. 47. – P. 3–19.",
    "Torchilin V.P. Recent advances with liposomes as pharmaceutical carriers // Nat. Rev. Drug Discov. – 2005. – Vol. 4. – P. 145–160.",
    "Barenholz Y. Doxil® — the first FDA-approved nano-drug: lessons learned // J. Control. Release. – 2012. – Vol. 160. – P. 117–134.",
    "Hou X., Zaks T., Langer R., Dong Y. Lipid nanoparticles for mRNA delivery // Nat. Rev. Mater. – 2021. – Vol. 6. – P. 1078–1094.",
    "McClements D.J. Nanoemulsions versus microemulsions: terminology, differences, and similarities // Soft Matter. – 2012. – Vol. 8. – P. 1719–1729.",
    "Maeda H., Wu J., Sawa T., Matsumura Y., Hori K. Tumor vascular permeability and the EPR effect in macromolecular therapeutics // J. Control. Release. – 2000. – Vol. 65. – P. 271–284.",
    "Siepmann J., Peppas N.A. Modeling of drug release from delivery systems based on HPMC // Adv. Drug Deliv. Rev. – 2001. – Vol. 48. – P. 139–157.",
    "Mitchell M.J., Billingsley M.M., Haley R.M. et al. Engineering precision nanoparticles for drug delivery // Nat. Rev. Drug Discov. – 2021. – Vol. 20. – P. 101–124.",
    "Краснюк И.И., Михайлова Г.В., Чижова Е.Т. Фармацевтическая технология. Технология лекарственных форм. – М.: Академия, 2004.",
    "Ahmedov Q.R., Qurbonov A.R. Kolloid kimyo. – Toshkent: O'zbekiston, 2012.",
]
H.refs(refs)
H.save(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    "Farmatsevtik-kolloid-sistemalar-mustaqil-ish.docx"))
