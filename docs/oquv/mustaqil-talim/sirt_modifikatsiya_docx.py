# -*- coding: utf-8 -*-
"""
Mustaqil ta'lim topshirig'i (6.5) uchun qisqa ilmiy hujjat generatori.
Mavzu: Kolloid sistemalarda sirtni modifikatsiyalash: gidrofoblash,
funksionallashtirish va stabilizatorlarning ta'sir mexanizmlari.

Uslub va tenglama qurilmasi omml_docx.py da (yagona manba).
Ishga tushirish:  python3 sirt_modifikatsiya_docx.py   →  .docx + .pdf
"""
import os

from omml_docx import Hujjat, P, V, bar, dot, frac, omath, par, seq, sqrt, sub, subsup, sup

H = Hujjat()
p, rich, equation, bullets, table, h = H.p, H.rich, H.equation, H.bullets, H.table, H.h

# ============================================================================
# Sarlavha
# ============================================================================
H.title("Kolloid kimyo / Sirt hodisalari",
        "KOLLOID SISTEMALARDA SIRTNI MODIFIKATSIYALASH: GIDROFOBLASH, "
        "FUNKSIONALLASHTIRISH VA STABILIZATORLARNING TA'SIR MEXANIZMLARI")

rich([
    ("Annotatsiya. ", "b"),
    ("Ishda kolloid zarrachalar sirtini maqsadli o'zgartirishning fizik-kimyoviy "
     "asoslari — adsorbsiya (Gibbs, Lengmyur), ho'llash (Yung, Ventsel, Kassi–Bakster) "
     "va Rebinder qutblilik tenglashuvi qoidasi — qisqa bayon qilinadi. "
     "Gidrofoblash (SFM monoqavatlari, silanlash, yog' kislotalari, tiollar, "
     "supergidrofob sirtlar, flotatsiya), funksionallashtirish (silan, tiol, fosfonat, "
     "katexol \"yakorlari\", polimer cho'tkalar, biokonyugatsiya, qavatma-qavat "
     "qoplash) va stabilizatorlarning ta'sir mexanizmlari (DLVO — elektrostatik, "
     "sterik, elektrosterik, strukturaviy-mexanik to'siq, Pikering, Gibbs–Marangoni; "
     "depletsion va ko'prikli flokulyatsiya) tenglamalar va misollar bilan "
     "tizimlashtiriladi; nazorat usullari umumlashtiriladi.", ""),
])
rich([
    ("Kalit so'zlar: ", "b"),
    ("sirt modifikatsiyasi, adsorbsiya, ho'llash burchagi, gidrofoblash, silanlash, "
     "o'z-o'zidan yig'iluvchi monoqavat, funksional guruhlar, polimer cho'tka, "
     "DLVO, elektrostatik va sterik stabilizatsiya, Pikering emulsiyasi, flokulyatsiya.", "i"),
])

# ============================================================================
# 1. Kirish
# ============================================================================
h("1. Kirish va mavzuning dolzarbligi", 1)
p("Kolloid zarrachaning \"taqdiri\" — u qaysi muhitda dispersiyalanishi, "
  "agregatlanishi yoki barqaror qolishi, qanday sirt bilan bog'lanishi, "
  "organizmda qancha aylanishi — uning hajmiy tarkibi bilan emas, sirtining "
  "kimyosi bilan belgilanadi. Shu sababli sirt modifikatsiyasi zamonaviy "
  "kolloid kimyoning markaziy texnologik vositasiga aylandi: gidrofil kremnezem "
  "yoki bo'rni polimer matritsaga kiritish uchun gidrofoblanadi, oltin "
  "nanozarrachaga antitelo \"tikish\" uchun u funksionallashtiriladi, "
  "bo'yoq pigmenti yoki dori suspenziyasini yillab cho'ktirmaslik uchun "
  "stabilizator tanlanadi. P.A. Rebinder sirt-faol moddalarning adsorbsion "
  "qavatlari strukturasini boshqarish orqali dispers sistemalarning xossalarini "
  "o'zgartirish g'oyasini asoslagan; bugun bu g'oya o'z-o'zidan yig'iluvchi "
  "monoqavatlar, polimer cho'tkalar va \"klik\"-kimyo darajasida amalga "
  "oshirilmoqda. Mavzuning dolzarbligi kompozit materiallar, flotatsion boyitish, "
  "farmatsevtik nanotizimlar, biosensorlar, qoplamalar va suvni tozalash "
  "texnologiyalarida sirt holatini aniq boshqarish zarurati bilan belgilanadi.")

# ============================================================================
# 2. Maqsad va vazifalar
# ============================================================================
h("2. Ishning maqsadi va vazifalari", 1)
rich([("Maqsad: ", "b"),
      ("kolloid zarrachalar sirtini modifikatsiyalash usullarini va "
       "stabilizatorlarning ta'sir mexanizmlarini fizik-kimyoviy qonuniyatlar "
       "asosida tizimlashtirish.", "")])
p("Vazifalar:", bold=True, after=2)
bullets([
    "sirt modifikatsiyasining termodinamik asoslarini (adsorbsiya, ho'llash, qutblilik tenglashuvi) yoritish;",
    "gidrofoblash mexanizmlari va usullarini, supergidrofoblik va flotatsiya bilan bog'liqligini ko'rsatish;",
    "funksionallashtirish strategiyalarini (\"yakor\" guruhlar, polimer cho'tkalar, biokonyugatsiya, qobiqlar) tahlil qilish;",
    "stabilizatorlarning ta'sir mexanizmlarini DLVO va uning kengaytmalari doirasida tasniflash, flokulyatsiya holatlarini ajratish;",
    "modifikatsiyalangan sirtni tavsiflash usullarini va amaliy qo'llanilishini umumlashtirish.",
], style="List Number")

# ============================================================================
# 3. Reja
# ============================================================================
h("3. Ishning rejasi", 1)
bullets([
    ("Sirt modifikatsiyasining fizik-kimyoviy asoslari: ", "sirt energiyasi, adsorbsiya (Gibbs, Lengmyur), ho'llash (Yung), Rebinder qoidasi, modifikatsiya turlari."),
    ("Gidrofoblash: ", "SFM monoqavatlari, silanlash, yog' kislotalari va tiollar, Ventsel va Kassi–Bakster rejimlari, flotatsiya, qo'llanilishi."),
    ("Funksionallashtirish: ", "\"yakor\" guruhlar, polimer cho'tkalar (grafting-to/from), bioconyugatsiya, core–shell va qavatma-qavat qoplash."),
    ("Stabilizatorlarning ta'sir mexanizmlari: ", "DLVO, elektrostatik, sterik, elektrosterik, strukturaviy-mexanik to'siq, Pikering, Gibbs–Marangoni; depletsion va ko'prikli flokulyatsiya."),
    ("Tavsiflash usullari ", "va amaliy ahamiyati."),
    ("Xulosa.", ""),
], style="List Number")

# ============================================================================
# 4. Asosiy qism
# ============================================================================
h("4. Asosiy qism", 1)

# ---- 4.1 ------------------------------------------------------------------
h("4.1. Sirt modifikatsiyasining fizik-kimyoviy asoslari", 2)
rich([("Adsorbsiya. ", "b"),
      ("Har qanday modifikatsiya sirtda modifikatorning to'planishidan boshlanadi. "
       "Eruvchan modifikator (SFM, polimer) uchun sirt tarangligining pasayishi va "
       "adsorbsiya Gibbs tenglamasi bilan bog'langan:", "")])
equation(
    omath(V("Γ"), P(" = −"), frac(V("c"), seq(V("R"), V("T"))),
          P("·"), frac(seq(V("d"), V("σ")), seq(V("d"), V("c")))),
    where=[omath(V("Γ")), (" — ortiqcha adsorbsiya (mol/m²), ", ""),
           omath(V("σ")), (" — sirt tarangligi. Qattiq sirtda monoqavat hosil bo'lishi "
                           "Lengmyur izotermasi bilan tavsiflanadi:", "")],
)
equation(
    omath(V("Γ"), P(" = "), sub(V("Γ"), V("∞")),
          frac(seq(V("K"), V("c")), seq(P("1 + "), V("K"), V("c"))),
          P(",      "),
          sub(V("S"), P("0")), P(" = "), frac(P("1"), seq(sub(V("Γ"), V("∞")), sub(V("N"), P("A"))))),
    where=[omath(sub(V("Γ"), V("∞"))), (" — monoqavat sig'imi, ", ""),
           omath(sub(V("S"), P("0"))), (" — bitta molekula egallagan sirt (yog' kislotalari "
                                        "uchun ≈ 0,20 nm², alkilsilanlar uchun ≈ 0,22–0,25 nm²). "
                                        "Fizik adsorbsiya (van-der-Vaals, vodorod bog', 10–40 kJ/mol) "
                                        "qaytar; kimyoviy adsorbsiya va kovalent payvandlash "
                                        "(100–400 kJ/mol) barqaror modifikatsiya beradi.", "")],
)
rich([("Ho'llash. ", "b"),
      ("Sirtning gidrofilligi/gidrofobligi suv tomchisining ho'llash burchagi "
       "bilan baholanadi — Yung tenglamasi:", "")])
equation(
    omath(P("cos"), V("θ"), P(" = "),
          frac(seq(sub(V("σ"), P("qg")), P(" − "), sub(V("σ"), P("qs"))), sub(V("σ"), P("sg")))),
    where=[omath(sub(V("σ"), P("qg")), P(", "), sub(V("σ"), P("qs")), P(", "), sub(V("σ"), P("sg"))),
           (" — qattiq–gaz, qattiq–suyuqlik va suyuqlik–gaz fazalararo tarangliklar. "
            "θ < 90° — gidrofil, θ > 90° — gidrofob, θ > 150° — supergidrofob sirt. "
            "Modifikatsiya aynan ", ""), omath(sub(V("σ"), P("qg"))),
           (" ni o'zgartiradi: toza kremnezem (θ ≈ 0°) oktadetsilsilan bilan qoplansa "
            "θ ≈ 110° ga yetadi.", "")],
)
rich([("Rebinder qutblilik tenglashuvi qoidasi: ", "b"),
      ("adsorbsiyada SFM molekulasi shunday joylashadiki, uning qutbli qismi "
       "qutbli fazaga, qutbsiz qismi qutbsiz fazaga qaraydi va natijada "
       "fazalar orasidagi qutblilik farqi (sirt tarangligi) kamayadi. Shundan "
       "muhim xulosa: gidrofil sirtga adsorbsiyalangan SFM monoqavati uni "
       "GIDROFOBLAYDI (uglevodorod radikallar tashqariga), gidrofob sirtga "
       "adsorbsiyalangan monoqavat esa GIDROFILLAYDI — ya'ni bir xil modda "
       "sirt tabiatiga qarab teskari ta'sir ko'rsatadi.", "")])
p("Modifikatsiya turlari:", bold=True, after=2)
bullets([
    ("Adsorbsion (fizik): ", "SFM, polimer, polielektrolit — oson, qaytar, muhit o'zgarsa desorbsiyalanadi."),
    ("Kovalent (kimyoviy payvandlash): ", "silanlar, tiollar, fosfonatlar, diazoniy tuzlari, polimer cho'tkalar — barqaror, desorbsiyalanmaydi."),
    ("Qobiq hosil qilish: ", "core–shell (SiO₂, Au, polimer qobiq), qavatma-qavat (LbL) polielektrolitlar, polidofamin."),
    ("Sirtni fizik qayta ishlash: ", "plazma, UV/ozon, korona razryadi — oksidlanish, funksional guruhlar, gidrofillash."),
])

# ---- 4.2 ------------------------------------------------------------------
h("4.2. Gidrofoblash", 2)
p("Gidrofoblash — gidrofil (qutbli, yuqori energiyali) sirtni past energiyali, "
  "suv bilan yomon ho'llanadigan sirtga aylantirish. Maqsad: zarrachani qutbsiz "
  "muhitga (polimer, moy, organik erituvchi) o'tkazish, suv yutilishini kamaytirish, "
  "flotatsiyada havo pufakchasiga yopishishini ta'minlash, Pikering emulgatori olish.")
bullets([
    ("SFM monoqavatlari: ", "kationli SFM (CTAB) manfiy zaryadli kremnezem/loyga, anionli (oleat, stearat) musbat zaryadli oksidlarga bosh guruhi bilan adsorbsiyalanadi, radikallar tashqariga qaraydi — sirt gidrofoblanadi. KMK yaqinida va undan yuqorida ikkinchi qavat (admitsella, bikatlam) hosil bo'lib, sirt yana gidrofillashadi — shuning uchun SFM miqdori monoqavatga mos tanlanadi (Lengmyur, tenglama 2)."),
    ("Yog' kislotalari va ularning tuzlari: ", "CaCO₃ ni stearin kislota bilan ishlash (1–3 % mas.) — polimerlar uchun to'ldiruvchi (PVX, polipropilen), gidrofob bo'r; TiO₂, Fe₃O₄ ni oleat bilan qoplash — organozollar, magnit suyuqliklar. Bog'lanish — karboksilat–metall ion kompleksi (kimyoviy adsorbsiya)."),
    ("Silanlash: ", "R–Si(OR′)₃ (OTS, ODTMS, metil-, fenil-, ftoralkilsilanlar) gidrolizlanib silanol hosil qiladi, u sirt ≡Si–OH guruhlari bilan kondensatsiyalanib ≡Si–O–Si–R kovalent bog' beradi (va qo'shni molekulalar bilan to'rlanadi). Kremnezem, shisha, oksidlar, loylar uchun asosiy usul; gidrofob aerosil (R972, R805), xromatografik C18 fazalar, suv qaytaruvchi qoplamalar."),
    ("Tiollar va boshqa yakorlar: ", "alkantiollar Au, Ag, Cu sirtida o'z-o'zidan yig'iluvchi zich monoqavat (SAM) hosil qiladi (Au–S ≈ 200 kJ/mol); ftorlangan tiollar θ > 115° beradi. Polimerlar uchun — plazmali polimerlash, ftoruglerodli qoplamalar."),
])
rich([("G'adir-budurlik va supergidrofoblik. ", "b"),
      ("Real sirtda ho'llash burchagi g'adir-budurlikka bog'liq. Suyuqlik notekisliklarni "
       "to'ldirsa (Ventsel rejimi), havo cho'ntaklari qolsa (Kassi–Bakster rejimi):", "")])
equation(
    omath(P("cos"), sub(V("θ"), P("W")), P(" = "), V("r"), P("·cos"), V("θ"),
          P(",      "),
          P("cos"), sub(V("θ"), P("CB")), P(" = "), sub(V("f"), P("s")),
          par(seq(P("cos"), V("θ"), P(" + 1"))), P(" − 1")),
    where=[omath(V("r"), P(" ≥ 1")), (" — haqiqiy sirtning proyeksiyaga nisbati, ", ""),
           omath(sub(V("f"), P("s"))), (" — suyuqlik bilan kontaktdagi qattiq sirt ulushi. "
                                         "Ventsel: g'adir-budurlik gidrofobni yanada gidrofob, "
                                         "gidrofilni yanada gidrofil qiladi; Kassi–Bakster: "
                                         "fₛ → 0 da θ → 180° (lotus effekti, θ > 150°, sirpanish "
                                         "burchagi < 10°). Shuning uchun supergidrofob qoplama = "
                                         "past sirt energiyali kimyo (ftoralkilsilan) + ierarxik "
                                         "mikro/nano g'adir-budurlik (nanokremnezem, ZnO nayzalar).", "")],
)
rich([("Flotatsiya. ", "b"),
      ("Minerallarni flotatsion boyitish — gidrofoblashning eng yirik sanoat "
       "qo'llanilishi: kollektor (sulfidlar uchun ksantogenat, oksidlar uchun yog' "
       "kislotalari, aminlar) foydali mineral sirtini tanlab gidrofoblaydi, u havo "
       "pufakchasiga yopishib ko'pik qatlamiga ko'tariladi, bo'sh jins (gidrofil) "
       "cho'kadi. Zarrachaning pufakchaga yopishish ishi Dyupre–Yung bo'yicha ", ""),
      omath(sub(V("W"), P("ad")), P(" = "), sub(V("σ"), P("sg")), par(seq(P("1 − cos"), V("θ")))),
      (" — θ qancha katta bo'lsa, yopishish shuncha mustahkam; amalda θ ≈ 60–90° "
       "yetarli. Depressorlar (sianid, ohak, suyuq shisha) aksincha ayrim minerallarni "
       "gidrofillab ajratishni tanlab boshqaradi.", "")])

# ---- 4.3 ------------------------------------------------------------------
h("4.3. Funksionallashtirish", 2)
p("Funksionallashtirish — sirtga ma'lum kimyoviy guruhlar (–COOH, –NH₂, –SH, "
  "–OH, epoksi, azid, alkin, biotin) yoki makromolekulalar (PEG, antitelo, DNK, "
  "ferment) kiritish. Natijada zarracha yangi vazifa oladi: tanlab bog'lanish, "
  "kataliz, signal berish, stimulga javob, biouyg'unlik. Strategiya ikki bosqichli: "
  "(1) sirtga mos \"yakor\" guruh bilan birlamchi qavat hosil qilish, (2) "
  "yakorning terminal guruhiga kerakli molekulani ulash.")
table(
    ["Sirt (zarracha)", "\"Yakor\" guruh / reagent", "Bog'lanish tabiati", "Terminal guruhlar"],
    [
        ["SiO₂, shisha, TiO₂, Al₂O₃, loylar", "trialkoksisilanlar: APTES (–NH₂), GPTMS (epoksi), MPTMS (–SH)", "≡Si–O–Si kovalent", "–NH₂, –SH, epoksi, vinil"],
        ["Au, Ag, Pt, kvant nuqtalar", "tiollar, disulfidlar, ditiolanlar (lipoat)", "Au–S kimyoviy adsorbsiya", "–COOH, –OH, PEG, biotin"],
        ["Fe₃O₄, TiO₂, ZrO₂, ZnO", "fosfonatlar, karboksilatlar, katexollar (dofamin, DOPA)", "koordinatsion/xelat", "–COOH, –NH₂, PEG"],
        ["Polimerlar, uglerod (CNT, grafen)", "diazoniy tuzlari, plazma oksidlash, π–π stacking (piren)", "kovalent C–C / nokovalent", "–COOH, –OH, –N₃"],
        ["Deyarli har qanday sirt", "polidofamin (dofamin o'z-o'zidan polimerlanishi, pH 8,5)", "yopishqoq ko'p funksiyali qobiq", "–OH, –NH₂, xinon (Mixael/Shiff)"],
    ],
    widths=[4.0, 5.0, 3.5, 4.0],
)
rich([("Polimer cho'tkalar. ", "b"),
      ("Polimerni sirtga bir uchi bilan payvandlash ikki yo'l bilan amalga "
       "oshiriladi: ", ""), ("grafting-to", "i"),
      (" — tayyor funksional polimer (PEG-silan, PEG-tiol) sirtga ulanadi (oson, "
       "lekin zichlik cheklangan), ", ""), ("grafting-from", "i"),
      (" — sirtga initsiator biriktirilib polimerlanish sirtdan boshlanadi "
       "(SI-ATRP, RAFT; zichlik yuqori). Payvandlash zichligi ", ""),
      omath(V("σ")), (" (zanjir/nm²) zanjirlar orasidagi masofani ", ""),
      omath(V("D"), P(" = "), sqrt(seq(P("1/"), V("σ")))),
      (" belgilaydi; u Flori radiusidan kichik bo'lsa zanjirlar cho'zilib \"cho'tka\", "
       "katta bo'lsa \"qo'ziqorin\" konformatsiyasini oladi:", "")])
equation(
    omath(V("D"), P(" < 2"), sub(V("R"), P("F")), P(":  cho'tka,      "),
          V("D"), P(" > 2"), sub(V("R"), P("F")), P(":  qo'ziqorin,      "),
          sub(V("R"), P("F")), P(" ≈ "), V("a"), P("·"), sup(V("N"), seq(P("3/5")))),
    where=[omath(V("N")), (" — monomer zvenolar soni, ", ""),
           omath(V("a")), (" — zveno o'lchami. Cho'tka rejimi oqsillar adsorbsiyasini "
                           "eng samarali to'xtatadi (\"stealth\" nanozarrachalar, "
                           "antibioko'payish qoplamalari). Payvandlash zichligi TGA "
                           "bo'yicha organik qavat massasi yo'qotilishidan hisoblanadi:", "")],
)
equation(
    omath(V("σ"), P(" = "), frac(seq(V("Δ"), V("m"), P("·"), sub(V("N"), P("A"))),
                                 seq(sub(V("M"), P("n")), P("·"), sub(V("S"), P("sol")), P("·"), sub(V("m"), P("zar"))))),
    where=[omath(V("Δ"), V("m")), (" — polimer qavat massasi, ", ""),
           omath(sub(V("M"), P("n"))), (" — polimerning o'rtacha molyar massasi, ", ""),
           omath(sub(V("S"), P("sol"))), (" — zarrachalarning solishtirma sirti (BET), ", ""),
           omath(sub(V("m"), P("zar"))), (" — zarrachalar massasi.", "")],
)
bullets([
    ("Bioconyugatsiya: ", "–COOH + –NH₂ → amid (EDC/NHS karbodiimid usuli); maleimid + –SH (tiol-en); azid + alkin (\"klik\", CuAAC/SPAAC); streptavidin–biotin (dissotsiatsiya doimiysi ≈ 10⁻¹⁴ M); Ni-NTA–His-teg. Ligand yo'nalishi va zichligi faollikni belgilaydi (antitelo Fc-qismi orqali yo'naltirilgan ulansa Fab faol qoladi)."),
    ("Ligand almashinuvi: ", "sintezdagi gidrofob ligand (oleat, TOPO) gidrofil yoki funksional ligandga (DMSA, MPA, PEG-fosfonat) almashtiriladi — kvant nuqtalar va magnit nanozarrachalarni suvga o'tkazish."),
    ("Qobiqlar: ", "Shtober usulida SiO₂ qobiq (TEOS, NH₃, etanol) — keyin silan kimyosi; LbL — qarama-qarshi zaryadli polielektrolitlar (PSS/PAH, xitozan/alginat) navbatma-navbat adsorbsiyasi, har qavatda ζ ishorasi almashadi; qavat soni va qalinlik nm aniqlikda boshqariladi."),
    ("Stimulga javob beruvchi sirtlar: ", "PNIPAM (LCST 32 °C — haroratga), PAA/PDMAEMA (pH ga), spiropiran (yorug'likka) cho'tkalari ho'llash, adsorbsiya va agregatsiyani qaytar boshqaradi."),
])

# ---- 4.4 ------------------------------------------------------------------
h("4.4. Stabilizatorlarning ta'sir mexanizmlari", 2)
rich([("DLVO nazariyasi. ", "b"),
      ("Liofob zollarning agregativ barqarorligi zarrachalar orasidagi natijaviy "
       "o'zaro ta'sir energiyasi bilan belgilanadi:", "")])
equation(
    omath(V("U"), par(V("h")), P(" = "), sub(V("U"), P("el")), P(" + "), sub(V("U"), P("A")),
          P(" ≈ 2"), V("π"), V("ε"), sub(V("ε"), P("0")), V("r"), subsup(V("ψ"), P("δ"), P("2")),
          P(" ln"), par(seq(P("1 + "), sup(V("e"), seq(P("−"), V("κ"), V("h"))))),
          P(" − "), frac(seq(V("A"), V("r")), seq(P("12"), V("h")))),
    where=[omath(sub(V("ψ"), P("δ"))), (" — diffuz qavat potensiali (≈ ζ), ", ""),
           omath(V("A")), (" — Gamaker doimiysi, ", ""),
           omath(sup(V("κ"), P("−1"))), (" — Debay uzunligi. Stabilizatorning vazifasi — "
                                         "energetik to'siqni ", ""),
           omath(sub(V("U"), P("max")), P(" > 15–25 "), sub(V("k"), P("B")), V("T")),
           (" darajada ushlab turish yoki zarrachalarni birlamchi minimum "
            "masofasiga yaqinlashtirmaslik. Elektrolit qo'shilganda to'siq yo'qoladi; "
            "koagulyatsiya ostonasi Shulse–Gardi qoidasiga bo'ysunadi:", "")],
)
equation(
    omath(sub(V("c"), P("k")), P(" ∝ "),
          frac(seq(sup(V("ε"), P("3")), sup(par(seq(sub(V("k"), P("B")), V("T"))), P("5"))),
               seq(sup(V("A"), P("2")), sup(V("z"), P("6"))))),
    where=[omath(V("z")), (" — qarshi ion zaryadi: Na⁺ : Ca²⁺ : Al³⁺ uchun ostonalar "
                           "≈ 1 : 1/64 : 1/729 (Deryagin–Landau).", "")],
)
p("Stabilizatsiya mexanizmlari:", bold=True, after=2)
bullets([
    ("Elektrostatik (ionli) stabilizatsiya: ", "ionogen SFM (SDS, CTAB), kichik ionlar (sitrat, fosfat), zaryadli polielektrolitlar qo'sh elektr qavat hosil qiladi; mezon |ζ| > 30 mV. Kamchiligi — elektrolit, pH va qutbsiz muhitga sezgir (suvsiz muhitda κ⁻¹ katta, lekin zaryad kam)."),
    ("Sterik stabilizatsiya: ", "sirtga adsorbsiyalangan yoki payvandlangan polimer qavatlari (PEG, PVP, PVA, poloksamerlar, kazein, gummiarabik) yaqinlashganda ikki ta'sir yuzaga keladi — aralashish (osmotik) va elastik (konformatsion) itarilish:"),
])
equation(
    omath(V("Δ"), sub(V("G"), P("mix")), P(" = "),
          frac(seq(P("4"), V("π"), V("r"), sub(V("k"), P("B")), V("T"), subsup(V("φ"), P("p"), P("2"))),
               seq(sub(V("V"), P("1")))),
          par(seq(frac(P("1"), P("2")), P(" − "), V("χ"))),
          sup(par(seq(V("δ"), P(" − "), frac(V("h"), P("2")))), P("2")),
          P(",      "), V("h"), P(" < 2"), V("δ")),
    where=[omath(V("δ")), (" — adsorbsion qavat qalinligi (samarali himoya uchun ≥ 5–10 nm), ", ""),
           omath(sub(V("φ"), P("p"))), (" — qavatdagi polimer hajmiy ulushi, ", ""),
           omath(sub(V("V"), P("1"))), (" — erituvchi molyar hajmi, ", ""),
           omath(V("χ")), (" — Flori–Xaggins parametri. χ < 0,5 (yaxshi erituvchi) da "
                           "itarilish, χ > 0,5 (yomon erituvchi) da tortishish — tizim "
                           "Θ-haroratda (kritik flokulyatsiya harorati) keskin flokulyatsiyalanadi. "
                           "Sterik himoya ion kuchiga sezgir emas, qutbsiz muhitda ham ishlaydi, "
                           "yuqori konsentratsiyalarda samarali va qaytar.", "")],
)
bullets([
    ("Elektrosterik stabilizatsiya: ", "polielektrolitlar (PAA, PMAA, xitozan, kazein, lignosulfonat, superplastifikatorlar — polikarboksilat efirlari) ikkala mexanizmni birlashtiradi; pH ga bog'liq, ammo juda samarali (sement, pigmentlar, keramik shlikerlar)."),
    ("Strukturaviy-mexanik to'siq (Rebinder): ", "YuMB, oqsillar, ba'zi SFM lar sirtda yuqori qovushqoqlik va elastiklikka ega gelsimon adsorbsion qavat hosil qiladi; u mexanik jihatdan yemirilmaydi va qaytar tiklanadi — emulsiya, ko'pik va suspenziyalar uchun eng universal omil (jelatin, kazein, saponinlar, metilselluloza)."),
    ("Qattiq zarrachalar (Pikering) stabilizatsiyasi: ", ["qisman gidrofoblangan kolloid zarrachalar (SiO₂, loylar, Fe₃O₄, kraxmal) fazalar chegarasiga qaytmas tarzda o'rnashadi — ajratish energiyasi ", omath(V("Δ"), sub(V("G"), P("d")), P(" = "), V("π"), sup(V("r"), P("2")), sub(V("σ"), P("sm")), sup(par(seq(P("1 − |cos"), V("θ"), P("|"))), P("2"))), ("; 10 nm li zarracha uchun ≈ 10³ kT, ya'ni desorbsiya amalda yo'q. θ < 90° — M/S, θ > 90° — S/M emulsiya (Finkl qoidasi); SFM siz, juda barqaror emulsiya va ko'piklar.", "")]),
    ("Gibbs–Marangoni effekti: ", "emulsiya va ko'pik plyonkasi cho'zilganda SFM konsentratsiyasi mahalliy kamayib sirt tarangligi ortadi; natijada hosil bo'lgan gradient suyuqlikni yupqalashgan joyga qaytaradi (\"o'z-o'zini davolash\"). Bankroft qoidasi: emulgator yaxshi eriydigan faza tashqi bo'ladi (gidrofil SFM → M/S, HLB 8–18; lipofil → S/M, HLB 3–6)."),
])
p("Stabilizator noto'g'ri tanlansa flokulyatsiya kuchayadi:", bold=True, after=2)
bullets([
    ("Ko'prikli flokulyatsiya: ", "uzun zanjirli polimer sirtni to'liq qoplamaganda (θ ≈ 0,5, La Mer) bir molekula ikki zarrachaga adsorbsiyalanib ularni bog'laydi — suvni tozalashda flokulyant (PAA, poliakrilamid, 10⁶–10⁷ Da) sifatida ataylab ishlatiladi; stabilizatsiya uchun esa to'liq qoplama kerak."),
    ("Depletsion flokulyatsiya: ", ["adsorbsiyalanmaydigan erkin polimer yoki mitsellalar zarrachalar orasidagi tor bo'shliqdan siqib chiqariladi, osmotik bosim zarrachalarni bir-biriga itaradi (Asakura–Oosava): ", omath(sub(V("U"), P("dep")), P(" ≈ −"), sub(V("Π"), P("osm")), P("·"), sub(V("V"), P("ustma-ust"))), ("; erkin polimer konsentratsiyasini cheklash yoki uning o'lchamini zarrachadan katta qilish bilan oldi olinadi.", "")]),
    ("Zaryad neytrallanishi: ", "qarama-qarshi zaryadli polielektrolit yoki SFM kam miqdorda ζ ni nolga yaqinlashtirib koagulyatsiya chaqiradi; ortiqcha miqdorda qayta zaryadlab (overcharging) yana barqarorlaydi — ζ–konsentratsiya egri chizig'i bo'yicha optimal doza tanlanadi."),
])
table(
    ["Mexanizm", "Stabilizator misoli", "Qulay sharoit", "Sezgirligi"],
    [
        ["Elektrostatik", "SDS, CTAB, sitrat", "suvli muhit, past ion kuchi", "elektrolit, pH, muzlatish"],
        ["Sterik", "PEG, PVP, poloksamer, PVA", "har qanday muhit, yuqori φ", "harorat (Θ-nuqta), erituvchi sifati"],
        ["Elektrosterik", "PAA, kazein, polikarboksilatlar", "suvli, o'rtacha ion kuchi", "pH"],
        ["Strukturaviy-mexanik", "jelatin, kazein, metilselluloza", "emulsiya, ko'pik, suspenziya", "harorat, fermentlar"],
        ["Pikering", "gidrofoblangan SiO₂, loy, kraxmal", "yirik tomchi, SFM siz tizimlar", "ho'llash burchagi, zarracha o'lchami"],
    ],
    widths=[3.6, 4.6, 4.4, 4.0],
)

# ---- 4.5 ------------------------------------------------------------------
h("4.5. Modifikatsiyalangan sirtni tavsiflash usullari", 2)
table(
    ["Usul", "Aniqlanadigan ko'rsatkich", "Izoh"],
    [
        ["Ho'llash burchagi (sessil tomchi, Vilgelmi, Uoshbern)", "θ, gidrofoblik darajasi, sirt energiyasi (OWRK)", "plyonka va kukunlar uchun"],
        ["ζ-potensial, pH titrlash", "sirt zaryadi, IEN siljishi, LbL qavatlar", "modifikatsiya muvaffaqiyatining tez mezoni"],
        ["FTIR (ATR, DRIFT), Raman", "funksional guruhlar, Si–O–Si, C–H, amid bog'lar", "sifatli tasdiq"],
        ["XPS", "sirt elementlar tarkibi, bog'lanish holati (2–10 nm)", "qoplama qalinligi va to'liqligi"],
        ["TGA, elementar analiz", "organik qavat miqdori → payvandlash zichligi", "tenglama (6)"],
        ["DLS, TEM, AFM", "gidrodinamik/haqiqiy o'lcham, qobiq qalinligi",
         omath(sub(V("d"), P("H")), P(" − "), sub(V("d"), P("TEM")), P(" = 2"), V("δ"))],
        ["BET, adsorbsiya izotermalari", "solishtirma sirt, monoqavat sig'imi", "modifikator dozasini hisoblash"],
        ["QCM-D, ellipsometriya, SPR", "adsorbsiya kinetikasi, qavat massasi va qalinligi", "in situ, nm aniqlik"],
        ["Kolloid zond AFM, sirt kuchlari apparati", "U(h) — to'g'ridan-to'g'ri kuch egri chizig'i", "DLVO va sterik to'siqni tekshirish"],
    ],
    widths=[5.5, 6, 5],
)

# ---- 4.6 ------------------------------------------------------------------
h("4.6. Amaliy ahamiyati", 2)
bullets([
    "Kompozit materiallar: silan bog'lovchi agentlar (shisha tola–epoksid), stearat bilan gidrofoblangan CaCO₃ va kaolin — to'ldiruvchi–matritsa adgeziyasi va dispersligi.",
    "Qoplamalar va bo'yoqlar: pigmentlarning dispergatorlar (polikarboksilat, polimer dispergatorlar) bilan barqarorlashtirilishi; o'z-o'zini tozalovchi supergidrofob va antiikonik sirtlar.",
    "Farmatsevtika va biotexnologiya: PEGillangan nanozarrachalar va liposomalar, antitelo bilan funksionallashtirilgan Au/magnit zarrachalar (diagnostika, immunoseparatsiya), funksional xromatografik sorbentlar.",
    "Foydali qazilmalarni boyitish va ekologiya: flotatsiya kollektorlari va depressorlari; suvni tozalashda koagulyant/flokulyant dozasini ζ-potensial bo'yicha optimallash; neft to'kilmalarini yig'uvchi gidrofob sorbentlar.",
    "Oziq-ovqat va kosmetika: oqsil–polisaxarid emulgatorlar, Pikering emulsiyalari (kraxmal, selluloza nanokristallari), SFM siz \"toza yorliq\" mahsulotlar.",
])

# ============================================================================
# 5. Xulosa
# ============================================================================
h("5. Xulosa", 1)
bullets([
    "Sirt modifikatsiyasi — kolloid zarrachaning muhit bilan o'zaro ta'sirini boshqarishning asosiy vositasi; uning termodinamik asosi adsorbsiya (Gibbs, Lengmyur) va ho'llash (Yung) qonuniyatlari hamda Rebinder qutblilik tenglashuvi qoidasidir.",
    "Gidrofoblash SFM monoqavatlari, yog' kislotalari, silanlar va tiollar orqali sirt energiyasini pasaytiradi; g'adir-budurlik bilan birga (Ventsel, Kassi–Bakster) supergidrofoblikka olib keladi va flotatsiya, polimer to'ldiruvchilar, Pikering emulgatorlari asosini tashkil etadi.",
    "Funksionallashtirish ikki bosqichli: sirtga mos \"yakor\" (silan, tiol, fosfonat, katexol) va terminal guruh orqali maqsadli molekula; polimer cho'tkalar zichligi (cho'tka/qo'ziqorin rejimi) va bioconyugatsiya kimyosi (EDC/NHS, klik) zarrachaning funksional sifatini belgilaydi.",
    "Stabilizatorlar DLVO to'sig'ini oshirish (elektrostatik), zarrachalarni masofada ushlash (sterik, elektrosterik), mexanik mustahkam adsorbsion qavat hosil qilish (Rebinder to'sig'i), fazalar chegarasini qattiq zarrachalar bilan band qilish (Pikering) va plyonkani o'z-o'zidan tiklash (Gibbs–Marangoni) orqali ta'sir qiladi.",
    "Stabilizator dozasi va tabiati noto'g'ri tanlansa, aksincha, ko'prikli, depletsion yoki zaryad neytrallanishi hisobiga flokulyatsiya yuz beradi — shu sababli tanlov ζ-potensial, adsorbsiya izotermasi va to'siq balandligi asosida optimallashtiriladi.",
    "Modifikatsiya natijasi ho'llash burchagi, ζ-potensial, FTIR/XPS, TGA, DLS/TEM va bevosita kuch o'lchash (AFM) kompleksida tasdiqlanadi; bu kompozitlar, qoplamalar, farmatsevtika, flotatsiya va ekologiya texnologiyalarining sifat asosidir.",
], style="List Number")

# ============================================================================
# 6. Adabiyotlar
# ============================================================================
refs = [
    "Israelachvili J.N. Intermolecular and Surface Forces. 3rd ed. – Academic Press, 2011.",
    "Napper D.H. Polymeric Stabilization of Colloidal Dispersions. – London: Academic Press, 1983.",
    "Rosen M.J., Kunjappu J.T. Surfactants and Interfacial Phenomena. 4th ed. – Wiley, 2012.",
    "Love J.C., Estroff L.A., Kriebel J.K., Nuzzo R.G., Whitesides G.M. Self-assembled monolayers of thiolates on metals as a form of nanotechnology // Chem. Rev. – 2005. – Vol. 105. – P. 1103–1170.",
    "Quéré D. Wetting and roughness // Annu. Rev. Mater. Res. – 2008. – Vol. 38. – P. 71–99.",
    "Binks B.P. Particles as surfactants — similarities and differences // Curr. Opin. Colloid Interface Sci. – 2002. – Vol. 7. – P. 21–41.",
    "Sperling R.A., Parak W.J. Surface modification, functionalization and bioconjugation of colloidal inorganic nanoparticles // Phil. Trans. R. Soc. A. – 2010. – Vol. 368. – P. 1333–1383.",
    "Zoppe J.O., Ataman N.C., Mocny P. et al. Surface-initiated controlled radical polymerization: polymer brushes // Chem. Rev. – 2017. – Vol. 117. – P. 1105–1318.",
    "Щукин Е.Д., Перцов А.В., Амелина Е.А. Коллоидная химия. – М.: Высшая школа, 2004.",
    "Фролов Ю.Г. Курс коллоидной химии. Поверхностные явления и дисперсные системы. – М.: Химия, 2004.",
    "Ahmedov Q.R., Qurbonov A.R. Kolloid kimyo. – Toshkent: O'zbekiston, 2012.",
]
H.refs(refs)
H.save(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    "Sirt-modifikatsiyasi-mustaqil-ish.docx"))
