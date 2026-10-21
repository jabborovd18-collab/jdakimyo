# -*- coding: utf-8 -*-
"""
Mustaqil ta'lim topshirig'i (6.2) uchun qisqa ilmiy hujjat generatori.
Mavzu: Biokolloid sistemalar: oqsillar, fermentlar, nuklein kislotalar va
hujayra membranalarining kolloid-kimyoviy xususiyatlari.

Uslub va tenglama qurilmasi omml_docx.py da (yagona manba).
Ishga tushirish:  python3 biokolloid_docx.py
"""
import os

from omml_docx import Hujjat, P, V, bar, frac, omath, par, seq, sqrt, sub, subsup, sup

H = Hujjat()
p, rich, equation, bullets, table, h = H.p, H.rich, H.equation, H.bullets, H.table, H.h

# ============================================================================
# Sarlavha
# ============================================================================
H.title("Kolloid kimyo / Biofizik kimyo",
        "BIOKOLLOID SISTEMALAR: OQSILLAR, FERMENTLAR, NUKLEIN KISLOTALAR VA "
        "HUJAYRA MEMBRANALARINING KOLLOID-KIMYOVIY XUSUSIYATLARI")

rich([
    ("Annotatsiya. ", "b"),
    ("Ishda tirik sistemalarning asosiy biokolloidlari — oqsillar, fermentlar, "
     "nuklein kislotalar va lipid membranalar — liofil (gidrofil) kolloidlar va "
     "polielektrolitlar sifatida qaraladi. Ularning zaryad holati, izoelektrik "
     "nuqta, eruvchanlik va tuzlanish, osmotik va Donnan muvozanati, "
     "elektroforetik va sedimentatsion xossalari, polielektrolit tabiati "
     "(Manning kondensatsiyasi), amfifil o'z-o'zini tashkil etish (KMK, "
     "qadoqlanish parametri) va membrana potensiali kolloid kimyo tenglamalari "
     "asosida tahlil qilinadi; zamonaviy tadqiqot usullari umumlashtiriladi.", ""),
])
rich([
    ("Kalit so'zlar: ", "b"),
    ("biokolloid, liofil kolloid, polielektrolit, izoelektrik nuqta, Donnan "
     "muvozanati, tuzlash, Svedberg, Mixaelis–Menten, Manning kondensatsiyasi, "
     "lipid bikatlam, KMK, membrana potensiali.", "i"),
])

# ============================================================================
# 1. Kirish
# ============================================================================
h("1. Kirish va mavzuning dolzarbligi", 1)
p("Tirik organizm — murakkab ko'p fazali kolloid sistema: sitoplazma, qon "
  "plazmasi, limfa, hujayra membranalari va organoidlar kolloid o'lchamdagi "
  "(1–100 nm) biomakromolekulalar va ularning assotsiatlaridan tashkil topgan. "
  "Biokolloidlar klassik liofob zollardan farqli ravishda liofil: ular suv bilan "
  "kuchli solvatlanadi, o'z-o'zidan eriydi, termodinamik barqaror va qaytar "
  "sistemalar hosil qiladi. Shu bilan birga ular kolloid o'lchamga, katta "
  "solishtirma sirtga, sirt zaryadiga, past osmotik bosimga va sekin "
  "diffuziyaga ega — ya'ni kolloid sistemalarning barcha asosiy belgilarini "
  "namoyon qiladi. Oqsillar va fermentlarning tuzlanishi va denaturatsiyasi, "
  "DNKning polielektrolit xossalari, membrananing amfifil o'z-o'zini tashkil "
  "etishi va potensiali — bularning barchasi kolloid-kimyoviy qonuniyatlar "
  "bilan tavsiflanadi. Mavzuning dolzarbligi biotexnologiya (oqsil preparatlarini "
  "ajratish va barqarorlash), farmatsevtika (liposoma va lipid nanozarrachalar, "
  "mRNK vaksinalari), tibbiy diagnostika va oziq-ovqat kimyosi bilan belgilanadi.")

# ============================================================================
# 2. Maqsad va vazifalar
# ============================================================================
h("2. Ishning maqsadi va vazifalari", 1)
rich([("Maqsad: ", "b"),
      ("asosiy biokolloidlarning kolloid-kimyoviy xususiyatlarini ularning "
       "tuzilishi va biologik funksiyasi bilan bog'lab tizimlashtirish.", "")])
p("Vazifalar:", bold=True, after=2)
bullets([
    "biokolloidlarni liofil kolloid va polielektrolit sifatida tavsiflash (osmotik bosim, Donnan muvozanati);",
    "oqsillarning amfolit tabiati, izoelektrik nuqtasi, eruvchanligi, tuzlanishi, elektroforetik va sedimentatsion xossalarini yoritish;",
    "fermentlarni kolloid katalizatorlar sifatida tahlil qilish (sirt, adsorbsiya, kinetika, immobilizatsiya);",
    "nuklein kislotalarning polielektrolit xossalarini (zaryad, qarshi ion kondensatsiyasi, qovushqoqlik) ko'rsatish;",
    "hujayra membranasini assotsiativ kolloid sifatida qarab, KMK, qadoqlanish parametri va membrana potensialini tushuntirish;",
    "tadqiqot usullarini umumlashtirish.",
], style="List Number")

# ============================================================================
# 3. Reja
# ============================================================================
h("3. Ishning rejasi", 1)
bullets([
    ("Biokolloidlarning umumiy xususiyatlari: ", "liofillik, solvatlanish, osmotik bosim, Donnan muvozanati."),
    ("Oqsillar: ", "amfolit, izoelektrik nuqta, eruvchanlik va tuzlash, elektroforez, sedimentatsiya (Svedberg), denaturatsiya, gel va koatservat."),
    ("Fermentlar: ", "kolloid katalizator, faol markaz va sirt, Mixaelis–Menten kinetikasi, adsorbsiya va immobilizatsiya."),
    ("Nuklein kislotalar: ", "polielektrolit, Manning kondensatsiyasi, persistent uzunlik, qovushqoqlik, kondensatsiya va gel-elektroforez."),
    ("Hujayra membranalari: ", "amfifillar, KMK, qadoqlanish parametri, lipid bikatlam va liposomalar, sirt zaryadi, membrana potensiali, osmos."),
    ("Tadqiqot usullari ", "va amaliy ahamiyati."),
    ("Xulosa.", ""),
], style="List Number")

# ============================================================================
# 4. Asosiy qism
# ============================================================================
h("4. Asosiy qism", 1)

# ---- 4.1 ------------------------------------------------------------------
h("4.1. Biokolloidlarning umumiy kolloid-kimyoviy xususiyatlari", 2)
p("Biokolloidlar — yuqori molekulyar birikmalarning (YuMB) suvdagi eritmalari "
  "va ularning assotsiatlari. Ular gomogen (haqiqiy) eritma bo'lsa-da, "
  "makromolekula o'lchami kolloid diapazonda bo'lgani uchun Tindal effekti, "
  "sekin diffuziya, dializ membranadan o'tmaslik va past osmotik bosim kabi "
  "kolloid belgilarga ega. Liofil kolloidlar uchun asosiy barqarorlik omili — "
  "qalin gidrat (solvat) qobiq va sirt zaryadi.")
rich([("Osmotik bosim. ", "b"),
      ("YuMB eritmalari uchun Vant-Goff qonuni makromolekulalararo o'zaro "
       "ta'sirni hisobga oluvchi virial tuzatma bilan yoziladi:", "")])
equation(
    omath(frac(V("π"), V("c")), P(" = "), V("R"), V("T"),
          par(seq(frac(P("1"), V("M")), P(" + "), sub(V("A"), P("2")), V("c")))),
    where=[omath(V("c")), (" — massa konsentratsiyasi, ", ""),
           omath(V("M")), (" — molyar massa, ", ""),
           omath(sub(V("A"), P("2"))),
           (" — ikkinchi virial koeffitsient (erituvchining \"yaxshi\" yoki \"yomon\"ligini, "
            "ya'ni makromolekula–erituvchi o'zaro ta'sirini ifodalaydi). ", ""),
           omath(V("π"), P("/"), V("c")), (" ni ", ""), omath(V("c")),
           (" ga bog'lab, 0 ga ekstrapolyatsiya qilish orqali oqsilning osmometrik molyar massasi topiladi.", "")],
)
rich([("Donnan muvozanati. ", "b"),
      ("Membranadan o'tmaydigan zaryadlangan oqsil (polielektrolit) ikki tomondagi "
       "kichik ionlarning notekis taqsimlanishiga olib keladi:", "")])
equation(
    omath(sub(par(seq(sup(P("Na"), P("+")))), P("i")), P("·"),
          sub(par(seq(sup(P("Cl"), P("−")))), P("i")), P(" = "),
          sub(par(seq(sup(P("Na"), P("+")))), P("e")), P("·"),
          sub(par(seq(sup(P("Cl"), P("−")))), P("e"))),
    where=[("indekslar i va e — membrananing ichki (oqsilli) va tashqi tomonlari. "
            "Natijada ichki tomonda ortiqcha osmotik bosim (qonda ≈ 3,3 kPa onkotik bosim) "
            "va membrana potensiali hosil bo'ladi; aynan shu sababli oqsilning "
            "osmometrik molyar massasi izoelektrik nuqtada yoki yuqori ion kuchida o'lchanadi.", "")],
)

# ---- 4.2 ------------------------------------------------------------------
h("4.2. Oqsillarning kolloid-kimyoviy xususiyatlari", 2)
rich([("Amfolit tabiati va izoelektrik nuqta. ", "b"),
      ("Oqsil molekulasida –COOH va –NH₂ guruhlari bo'lgani uchun uning zaryadi "
       "muhit pH iga bog'liq. Har bir ionogen guruhning dissotsiatsiya darajasi "
       "Xenderson–Xasselbalx tenglamasi bilan aniqlanadi:", "")])
equation(
    omath(P("pH"), P(" = "), P("p"), sub(V("K"), P("a")), P(" + lg"),
          frac(seq(P("["), sup(P("A"), P("−")), P("]")), seq(P("[HA]")))),
)
p("pH < pI da oqsil kation (+), pH > pI da anion (−) shaklida bo'ladi; "
  "izoelektrik nuqtada (pH = pI) natijaviy zaryad nolga teng, gidrat qobiq eng "
  "yupqa, shuning uchun eruvchanlik, shishish, qovushqoqlik va elektroforetik "
  "harakatchanlik minimal, agregatsiya va cho'kish esa maksimal bo'ladi "
  "(kazein pI 4,6; albumin 4,9; gemoglobin 6,8; lizotsim 11,0).")
rich([("Tuzlash (salting-out). ", "b"),
      ("Past konsentratsiyali tuz oqsil eruvchanligini oshiradi (salting-in, "
       "Debay–Xyukkel ekranlash), yuqori konsentratsiyada esa ionlar gidrat "
       "qobiqni \"tortib olib\" oqsilni cho'ktiradi. Eruvchanlikning ion kuchiga "
       "bog'liqligi Kon tenglamasi bilan ifodalanadi:", "")])
equation(
    omath(P("lg"), V("S"), P(" = "), V("β"), P(" − "), sub(V("K"), P("s")), V("I")),
    where=[omath(V("S")), (" — oqsil eruvchanligi, ", ""),
           omath(V("β")), (" — gipotetik eruvchanlik (I = 0), ", ""),
           omath(sub(V("K"), P("s"))), (" — tuzlash doimiysi, ", ""),
           omath(V("I"), P(" = "), frac(P("1"), P("2")), P("Σ"), sub(V("c"), V("i")),
                 subsup(V("z"), V("i"), P("2"))),
           (" — ion kuchi. Ionlarning cho'ktirish kuchi Gofmeyster qatori bo'yicha "
            "ortadi (anionlar: SCN⁻ < I⁻ < NO₃⁻ < Cl⁻ < SO₄²⁻ < PO₄³⁻); (NH₄)₂SO₄ "
            "bilan fraksiyalash oqsil tozalashning asosiy usuli.", "")],
)
rich([("Elektroforez. ", "b"),
      ("Zaryadlangan oqsilning elektr maydondagi harakatchanligi "
       "Smoluxovskiy tenglamasi bilan ζ-potensialga bog'lanadi:", "")])
equation(
    omath(V("u"), P(" = "), frac(V("v"), V("E")), P(" = "),
          frac(seq(V("ε"), sub(V("ε"), P("0")), V("ζ")), V("η"))),
    where=[omath(V("v")), (" — harakat tezligi, ", ""),
           omath(V("E")), (" — maydon kuchlanganligi, ", ""),
           omath(V("η")), (" — muhit qovushqoqligi. Harakatchanlik pI da nolga teng — bu "
                           "izoelektrik fokuslash (IEF) usulining asosi; SDS-PAGE da esa "
                           "zaryad tenglashtirilib, ajratish faqat o'lcham bo'yicha boradi.", "")],
)
rich([("Sedimentatsiya. ", "b"),
      ("Ultratsentrifugada oqsilning cho'kish koeffitsienti (Svedberg birligi, "
       "1 S = 10⁻¹³ s) va diffuziya koeffitsienti orqali molyar massa Svedberg "
       "tenglamasidan topiladi:", "")])
equation(
    omath(V("M"), P(" = "),
          frac(seq(V("s"), V("R"), V("T")),
               seq(V("D"), par(seq(P("1 − "), bar(V("v")), V("ρ")))))),
    where=[omath(V("s"), P(" = "), frac(V("v"), seq(sup(V("ω"), P("2")), V("r")))),
           (" — sedimentatsiya koeffitsienti, ", ""),
           omath(V("D")), (" — diffuziya koeffitsienti, ", ""),
           omath(bar(V("v"))), (" — oqsilning parsial solishtirma hajmi (≈ 0,73 sm³/g), ", ""),
           omath(V("ρ")), (" — erituvchi zichligi. Ribosoma subbirliklari (30S, 50S) "
                           "aynan shu koeffitsient bilan nomlanadi.", "")],
)
bullets([
    ("Gidrat qobiq va shishish: ", "oqsil 1 g ga 0,3–0,5 g \"bog'langan\" suv tutadi; jelatin va boshqa fibrillyar oqsillar cheksiz shishib eritma, cheklangan shishib gel hosil qiladi (shishish bosimi yuzlab atm ga yetadi)."),
    ("Denaturatsiya: ", "harorat, pH, og'ir metallar, mochevina, organik erituvchilar tabiiy konformatsiyani buzadi → gidrofob guruhlar ochiladi, eruvchanlik pasayadi, koagulyatsiya (qaytmas kolloid holat) sodir bo'ladi."),
    ("Koatservatsiya va himoya ta'siri: ", "qarama-qarshi zaryadli biopolimerlar (jelatin–gummiarabik) suyuq kolloid fazaga ajraladi (mikrokapsulalash asosi); oqsillar liofob zollarni adsorbsion qobiq bilan koagulyatsiyadan himoya qiladi (\"oltin soni\")."),
])

# ---- 4.3 ------------------------------------------------------------------
h("4.3. Fermentlar — kolloid katalizatorlar", 2)
p("Fermentlar — globulyar oqsillar bo'lib, katalitik faollik ularning kolloid "
  "sirtidagi kichik bir qismida — faol markazda — jamlangan. Shu sababli "
  "fermentativ kataliz geterogen katalizga o'xshaydi: substrat avval faol "
  "markazga adsorbsiyalanadi (ES-kompleks), so'ngra kimyoviy o'zgarishga "
  "uchraydi. Kinetika Mixaelis–Menten tenglamasi bilan ifodalanadi:")
equation(
    omath(V("v"), P(" = "),
          frac(seq(sub(V("V"), P("max")), P("["), V("S"), P("]")),
               seq(sub(V("K"), P("m")), P(" + ["), V("S"), P("]")))),
    where=[omath(sub(V("V"), P("max")), P(" = "), sub(V("k"), P("kat")), P("["), V("E"), sub(P("]"), P("0"))),
           (" — maksimal tezlik, ", ""),
           omath(sub(V("K"), P("m"))),
           (" — Mixaelis doimiysi (substratga moyillik o'lchovi). Tenglama shaklan "
            "Lengmyur adsorbsiya izotermasiga aynan mos keladi — bu fermentning "
            "\"adsorbsion katalizator\" ekanini ko'rsatadi.", "")],
)
rich([("Immobilizatsiya. ", "b"),
      ("Fermentlar nanozarracha, polimer yoki g'ovak tashuvchi sirtiga "
       "adsorbsiya yoki kovalent bog'lanish orqali mahkamlanadi; adsorbsiya "
       "miqdori Lengmyur izotermasi bilan tavsiflanadi:", "")])
equation(
    omath(V("Γ"), P(" = "), sub(V("Γ"), V("∞")),
          frac(seq(V("K"), V("c")), seq(P("1 + "), V("K"), V("c")))),
    where=[omath(V("Γ")), (" — adsorbsiya, ", ""),
           omath(sub(V("Γ"), V("∞"))), (" — monoqavat sig'imi, ", ""),
           omath(V("K")), (" — adsorbsion muvozanat doimiysi. Immobilizatsiya fermentning "
                           "termik va pH barqarorligini oshiradi, qayta ishlatish imkonini beradi.", "")],
)
bullets([
    ("Kolloid holatga bog'liqlik: ", "faollik pH (zaryad holati, pI ga nisbatan optimum) va haroratga (denaturatsiya) kuchli bog'liq; ion kuchi faol markaz yaqinidagi elektrostatik maydonni o'zgartiradi."),
    ("Sirt faol moddalar ta'siri: ", "SDS kabi ionogen SFM lar fermentni denaturatsiya qiladi; noionogen SFM va teskari mitsellalar esa fermentni organik muhitda faol holda saqlaydi (mitsellyar enzimologiya)."),
    ("Nanobiokataliz: ", "Au, SiO₂, Fe₃O₄ nanozarrachalarga immobilizatsiya; ferment–nanozarracha konyugatlari biosensorlarda (glyukoza-oksidaza elektrodlari) qo'llanadi."),
])

# ---- 4.4 ------------------------------------------------------------------
h("4.4. Nuklein kislotalarning polielektrolit xossalari", 2)
p("DNK va RNK — har bir nukleotidda bitta fosfat guruhi tufayli kuchli manfiy "
  "zaryadlangan chiziqli polielektrolitlar. Ikki zanjirli DNKda zaryadlar "
  "orasidagi masofa b ≈ 0,17 nm, bu suvdagi Byerrum uzunligidan "
  "(l_B ≈ 0,71 nm) ancha kichik, shuning uchun qarshi ionlarning bir qismi "
  "zanjir sirtida \"kondensatsiyalanadi\" (Manning nazariyasi):")
equation(
    omath(V("ξ"), P(" = "), frac(sub(V("l"), P("B")), V("b")), P(" = "),
          frac(sup(V("e"), P("2")),
               seq(P("4"), V("π"), V("ε"), sub(V("ε"), P("0")), sub(V("k"), P("B")), V("T"), V("b"))),
          P(",      "),
          V("θ"), P(" = 1 − "), frac(P("1"), seq(V("z"), V("ξ")))),
    where=[omath(V("ξ")), (" — zaryad zichligi parametri (ds-DNK uchun ≈ 4,2), ", ""),
           omath(V("θ")), (" — kondensatsiyalangan qarshi ionlar ulushi, ", ""),
           omath(V("z")), (" — qarshi ion zaryadi. Na⁺ uchun θ ≈ 76 %, ya'ni DNKning "
                           "samarali zaryadi 4 marta kamayadi; Mg²⁺, spermidin³⁺ "
                           "kabi ko'p zaryadli ionlar DNKni kompakt kondensatsiyalaydi "
                           "(xromatin, virus kapsidi, gen yetkazish komplekslari).", "")],
)
rich([("Qovushqoqlik va shakl. ", "b"),
      ("DNK yarim bikr (\"chuvalchangsimon\") zanjir: persistent uzunligi ≈ 50 nm "
       "(≈ 150 juft asos). Uning eritmalari juda yuqori xarakteristik "
       "qovushqoqlikka ega; molyar massa bilan bog'liqlik Mark–Kun–Xauvink "
       "tenglamasi orqali:", "")])
equation(
    omath(P("["), V("η"), P("]"), P(" = "), V("K"), sup(V("M"), V("a"))),
    where=[omath(V("a")),
           (" — shakl ko'rsatkichi: globulyar oqsillar uchun ≈ 0 (sfera), egiluvchan "
            "koptok uchun 0,5–0,8, bikr tayoqcha (qisqa DNK) uchun ≈ 1,8. DNK eritmalari "
            "siljish tezligiga bog'liq (noyutonli) qovushqoqlik va oqimda ikkilamchi "
            "nur sinish ko'rsatadi; qovushqoqlikning keskin pasayishi — denaturatsiya "
            "(erish) belgisi.", "")],
)
bullets([
    ("Gel-elektroforez: ", "zaryad/uzunlik nisbati doimiy bo'lgani uchun erkin eritmada harakatchanlik uzunlikka bog'liq emas; agaroza/poliakrilamid gelida elakdan o'tish (reptatsiya) tufayli harakatchanlik lg(uzunlik) ga teskari proporsional — fragmentlar o'lcham bo'yicha ajraladi."),
    ("Erish (denaturatsiya) harorati: ", "Tₘ ion kuchi oshishi bilan ortadi (qarshi ionlar fosfatlar itarilishini ekranlaydi) va GC-juftlar ulushi bilan chiziqli bog'liq; gipoxrom effekt (260 nm da yutilish ≈ 40 % ortadi) orqali kuzatiladi."),
    ("Kolloid komplekslar: ", "DNK–kationli lipid (lipopleks), DNK–polikation (polipleks), DNK–Au nanozarracha konyugatlari — gen terapiyasi va biosensorikaning asosi; ularning barqarorligi DLVO va polielektrolit nazariyasi bilan tavsiflanadi."),
])

# ---- 4.5 ------------------------------------------------------------------
h("4.5. Hujayra membranalari — assotsiativ kolloidlar", 2)
p("Membrana lipidlari (fosfolipidlar, sfingolipidlar, xolesterin) — amfifil "
  "molekulalar: gidrofil \"bosh\" va gidrofob uglevodorod \"dumlar\". Suvda "
  "ular gidrofob ta'sir hisobiga kritik mitsella konsentratsiyasidan (KMK) "
  "yuqori konsentratsiyada o'z-o'zidan assotsiatlarga yig'iladi. Fosfolipidlar "
  "uchun KMK juda past (≈ 10⁻¹⁰ M), shuning uchun membrana amalda "
  "\"parchalanmaydigan\" kolloid tuzilmadir. Mitsellalanish Gibbs energiyasi:")
equation(
    omath(V("Δ"), subsup(V("G"), P("mits"), P("°")), P(" ≈ "), V("R"), V("T"), P(" ln"), P("KMK")),
)
rich([("Agregat shakli ", "b"),
      ("Israelashvili qadoqlanish parametri bilan oldindan aytiladi:", "")])
equation(
    omath(V("P"), P(" = "), frac(V("v"), seq(sub(V("a"), P("0")), sub(V("l"), P("c"))))),
    where=[omath(V("v")), (" — uglevodorod dum hajmi, ", ""),
           omath(sub(V("a"), P("0"))), (" — qutbli bosh egallagan optimal sirt, ", ""),
           omath(sub(V("l"), P("c"))), (" — dumning kritik uzunligi. P < 1/3 — sferik "
                                       "mitsella (bir dumli SFM, lizolipidlar); 1/3–1/2 — "
                                       "silindrik mitsella; 1/2–1 — bikatlam va vezikula "
                                       "(ikki dumli fosfatidilxolin); P > 1 — teskari "
                                       "tuzilmalar (fosfatidiletanolamin, geksagonal H₂ faza).", "")],
)
bullets([
    ("Lipid bikatlam va liposomalar: ", "qalinligi ≈ 4–5 nm; sun'iy vezikulalar (liposomalar, 50–200 nm) — dori va mRNK yetkazishning asosiy kolloid tashuvchisi; PEG-lipidlar sterik stabilizatsiya beradi (\"stealth\" liposomalar)."),
    ("Suyuq-mozaik model va fazaviy o'tishlar: ", "bikatlam ikki o'lchamli suyuqlik; lipidlar lateral diffuziya qiladi (D ≈ 10⁻⁸ sm²/s), gel ↔ suyuq-kristall o'tish harorati Tₘ dum uzunligi bilan ortadi, to'yinmaganlik va xolesterin bilan o'zgaradi; raftlar — kolloid mikrofazalar."),
    ("Sirt zaryadi: ", "fosfatidilserin, fosfatidilinozitol va sialik kislotalar tufayli hujayra sirti manfiy (ζ ≈ −10…−30 mV); bu hujayralar agregatsiyasini oldini oladi va kationli nanozarracha/oqsillarning adsorbsiyasini belgilaydi."),
])
rich([("Membrana potensiali. ", "b"),
      ("Membrana ionlarni tanlab o'tkazgani uchun uning ikki tomonida "
       "elektr potensiallar farqi hosil bo'ladi. Bitta ion uchun muvozanat "
       "potensiali Nernst tenglamasi bilan aniqlanadi:", "")])
equation(
    omath(sub(V("E"), P("ion")), P(" = "),
          frac(seq(V("R"), V("T")), seq(V("z"), V("F"))),
          P(" ln"),
          frac(sub(P("[C]"), P("e")), sub(P("[C]"), P("i")))),
    where=[omath(V("z")), (" — ion zaryadi, ", ""),
           omath(V("F")), (" — Faradey doimiysi. K⁺ uchun (≈ 5 mM tashqarida, 140 mM ichkarida) "
                           "E ≈ −90 mV; haqiqiy tinchlik potensiali (−70 mV) bir nechta ionning "
                           "o'tkazuvchanligini hisobga oluvchi Goldman–Xodjkin–Kats tenglamasi "
                           "bilan topiladi. Donnan muvozanati (2) ham potensialga hissa qo'shadi.", "")],
)
rich([("Osmos va membrana. ", "b"),
      ("Membrana yarim o'tkazuvchan bo'lgani uchun hujayra hajmi tashqi muhit "
       "osmolyarligi bilan boshqariladi: gipotonik muhitda shishish va gemoliz "
       "(eritrotsit), gipertonik muhitda burishish (plazmoliz); izotonik eritma "
       "(0,9 % NaCl, ≈ 300 mOsm) osmotik bosimi ≈ 7,7 atm. Suvning membrana "
       "orqali o'tishi akvaporinlar — kolloid o'lchamdagi oqsil kanallar — orqali boradi.", "")])

# ---- 4.6 ------------------------------------------------------------------
h("4.6. Tadqiqot usullari", 2)
table(
    ["Usul", "Aniqlanadigan xususiyat", "Obyekt"],
    [
        ["Elektroforez (SDS-PAGE, IEF, agaroza)", "zaryad, pI, molyar massa, DNK uzunligi", "oqsil, DNK/RNK"],
        ["Analitik ultratsentrifugalash", "s, M, shakl (tenglama 6)", "oqsil, ribosoma, virus"],
        ["Osmometriya, Donnan dializi", "M, A₂, zaryad", "oqsil, polielektrolit"],
        ["DLS / ζ-potensial", "gidrodinamik radius, agregatsiya, sirt zaryadi", "oqsil, liposoma, hujayra"],
        ["Viskozimetriya", "[η], shakl, denaturatsiya", "DNK, fibrillyar oqsil"],
        ["UV-Vis, CD, fluoressensiya", "konformatsiya, Tₘ, bog'lanish", "oqsil, nuklein kislota"],
        ["SPR, ITC, QCM", "adsorbsiya, bog'lanish doimiylari", "ferment–substrat, ligand–retseptor"],
        ["Krio-TEM, AFM, fluoressent mikroskopiya", "morfologiya, bikatlam, raftlar", "membrana, liposoma, DNK"],
        ["Patch-clamp, Lengmyur tarozisi", "membrana potensiali, monoqavat bosimi", "hujayra, lipid monoqavat"],
    ],
    widths=[5.5, 6, 5],
)

# ---- 4.7 ------------------------------------------------------------------
h("4.7. Amaliy ahamiyati", 2)
bullets([
    "Biotexnologiya: oqsillarni tuzlash, izoelektrik cho'ktirish, xromatografiya va elektroforez orqali ajratish; ferment immobilizatsiyasi va biokatalitik reaktorlar.",
    "Farmatsevtika: liposoma va lipid nanozarrachalar (mRNK vaksinalari), oqsil preparatlarini agregatsiyadan saqlash (formulyatsiya), DNK/RNK yetkazish komplekslari.",
    "Tibbiyot: qon plazmasining onkotik bosimi va shishlar, eritrotsit cho'kish tezligi (EChT), gemodializ, izotonik eritmalar; membrana potensiali buzilishi — kardiologiya va nevrologiya.",
    "Oziq-ovqat kimyosi: sut (kazein mitsellalari), jelatin gellari, emulsiyalar, oqsil ko'piklari — barchasi biokolloid sistemalar.",
])

# ============================================================================
# 5. Xulosa
# ============================================================================
h("5. Xulosa", 1)
bullets([
    "Biokolloidlar — liofil, termodinamik barqaror va qaytar kolloid sistemalar; ularning xossalari gidrat qobiq, sirt zaryadi va polielektrolit tabiati bilan belgilanadi, osmotik bosim va ion taqsimoti esa virial va Donnan tenglamalari bilan tavsiflanadi.",
    "Oqsillar amfolit bo'lib, izoelektrik nuqta ularning eruvchanligi, shishishi, qovushqoqligi va elektroforetik harakatchanligining minimumini belgilaydi; tuzlash (Kon tenglamasi, Gofmeyster qatori) va sedimentatsiya (Svedberg) — ajratish va tavsiflashning asosiy vositalari.",
    "Fermentlar — adsorbsion tipdagi kolloid katalizatorlar: Mixaelis–Menten kinetikasi Lengmyur izotermasiga mos keladi; immobilizatsiya kolloid sirt orqali faollik va barqarorlikni boshqarish imkonini beradi.",
    "Nuklein kislotalar — kuchli chiziqli polielektrolitlar: Manning kondensatsiyasi samarali zaryadni kamaytiradi, ko'p zaryadli ionlar DNKni kompaktlashtiradi; qovushqoqlik va gel-elektroforez molyar massa va konformatsiyani beradi.",
    "Hujayra membranasi — amfifil lipidlarning o'z-o'zini tashkil etgan assotsiativ kolloidi; qadoqlanish parametri bikatlam shaklini, tanlab o'tkazuvchanlik esa Nernst/Donnan potensialini va osmotik muvozanatni belgilaydi.",
    "Shunday qilib, tirik hujayradagi asosiy jarayonlar — eruvchanlik va agregatsiya, kataliz, genetik axborotni saqlash va tashish, moddalar almashinuvi — kolloid kimyo qonuniyatlari asosida tushuntiriladi va boshqariladi.",
], style="List Number")

# ============================================================================
# 6. Adabiyotlar
# ============================================================================
refs = [
    "Tanford C. Physical Chemistry of Macromolecules. – New York: Wiley, 1961.",
    "van Holde K.E., Johnson W.C., Ho P.S. Principles of Physical Biochemistry. 2nd ed. – Pearson, 2006.",
    "Israelachvili J.N. Intermolecular and Surface Forces. 3rd ed. – Academic Press, 2011.",
    "Manning G.S. Limiting laws and counterion condensation in polyelectrolyte solutions // J. Chem. Phys. – 1969. – Vol. 51. – P. 924–933.",
    "Hiemenz P.C., Rajagopalan R. Principles of Colloid and Surface Chemistry. 3rd ed. – Marcel Dekker, 1997.",
    "Nelson D.L., Cox M.M. Lehninger Principles of Biochemistry. 8th ed. – W.H. Freeman, 2021.",
    "Фролов Ю.Г. Курс коллоидной химии. Поверхностные явления и дисперсные системы. – М.: Химия, 2004.",
    "Ahmedov Q.R., Qurbonov A.R. Kolloid kimyo. – Toshkent: O'zbekiston, 2012.",
    "Qosimov R.Q. va b. Biofizik kimyo. – Toshkent: Fan, 2010.",
]
H.refs(refs)
H.save(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    "Biokolloid-sistemalar-mustaqil-ish.docx"))
