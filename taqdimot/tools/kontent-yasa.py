"""Taqdimot kontentini yasash — PPTX manbadan olingan mazmun.

NEGA SKRIPT, QO'LDA JSON EMAS: matn uzun va apostroflar aralash
(ʻ, ʼ, '). Qo'lda yozilgan JSON'da bitta qochirilmagan belgi butun
faylni buzadi. Bu yerda matn Python satri sifatida yoziladi va
json.dump o'zi to'g'ri shakllantiradi.

MANBA: sirt_hodisalari_adsorbsiya.pptx (17 mavzu, 33 rasm).
Mazmun saqlanadi; quyidagilar tuzatildi:
  · terilish xatolari (dinagmik → dinamik, gipofobik → gidrofob,
    tezgini → tezligi, zaqarlantiruvchi → zaharli, KOLLEID → Kolloid)
  · sarlavhalardan indeksli belgilar olib tashlandi — sarlavha
    shriftida (Manrope) ular yo'q va jimgina yo'qolib qolardi
"""

import json
import os

CHIQISH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "kontent", "taqdimot.json")

META = {
    "mavzu": "Sirt hodisalari va adsorbsiya",
    "kolontitul": "Kolloid kimyo · Sirt hodisalari va adsorbsiya",
    "muallif": "",
    "tashkilot": "",
    "sana": "2026",
    "mavzu_kalit": "neon",
    "shrift": "times",
}

SLAYDLAR = [
    # ── 1. Muqova ──────────────────────────────────────────────────
    {
        "tur": "muqova",
        "yorliq": "Kolloid kimyo · Maʼruza",
        "sarlavha": "Sirt hodisalari va adsorbsiya",
        "kichik": "Sirt hodisalari termodinamikasi, adsorbsiya izotermalari va amaliy tizimlar",
        "illustratsiya": {
            "fayl": "rasmlar/gen-sirt-tarangligi.jpg",
            "izoh": "Suv sirtidagi parda: sirt tarangligi qoʼshimcha bosimni koʼtaradi",
        },
    },
    # ── 2. Reja ────────────────────────────────────────────────────
    {
        "tur": "reja",
        "kichik": "Mavzu rejasi",
        "sarlavha": "Ilmiy programma",
        "bandlar": [
            "Sirt erkin energiyasi, sirt tarangligi va termodinamik asoslar (Gibbs tenglamasi)",
            "Sirt tarangligiga taʼsir etuvchi omillar va Antonov qoidasi",
            "Egri sirtlar termodinamikasi: Laplas va Kelvin (Tomson) tenglamalari",
            "Sorbsiya jarayonlari: fizikaviy adsorbsiya, xemosorbsiya va kapillyar kondensatlanish",
            "Sirt-aktiv (SAM), sirt-inert (SIM) va sirt-nofaol (SNM) moddalar. Traube-Dyuklo qoidasi",
            "Monomolekulyar adsorbsiya nazariyalari: Gibbs va Lengmyur izotermalari",
            "Polimolekulyar modellar: Freyndlih, Polyani va BET (Brunauer–Emmett–Teller)",
            "Qattiq adsorbentlar va eritmalardan adsorbsiya: Panet-Fayans, Rebinder, xromatografiya",
        ],
    },
    # ══ 1-BO'LIM ══
    {
        "tur": "bolim",
        "raqam": "01",
        "yorliq": "Birinchi qism",
        "sarlavha": "Sirt termodinamikasi",
        "izoh": "Sirt energiyasi, sirt tarangligi, sirt-aktiv moddalar va egri sirtlar",
        "illustratsiya": {"fayl": "rasmlar/bolim-1-termodinamika.jpg", "izoh": "Yuzaki parda — sirt tarangligi kuchi"},
    },
    {
        "tur": "mavzu",
        "bolim": "Sirt termodinamikasi",
        "raqam": 1,
        "sarlavha": "Sirt qatlamidagi ortiqcha erkin energiya",
        "bandlar": [
            {"bosh": "Molekulalararo oʼzaro taʼsir",
             "matn": "Hajmdagi molekula (A) barcha yoʼnalishlarda teng kuchlar bilan tortiladi (ΣF = 0). Sirt qatlamidagi molekula (B) esa faqat suyuqlik ichiga tortiladi — uning kuch maydoni kompensatsiyalanmagan."},
            {"bosh": "Sirt erkin energiyasi (Gs)",
             "matn": "Molekulani hajmdan sirtga chiqarish uchun tortishish kuchlariga qarshi ish bajarilishi kerak. Bu ish sirtda ortiqcha erkin energiya koʼrinishida toʼplanadi."},
            {"bosh": "Sirt tarangligi (σ)",
             "matn": "Sirt yuzasini 1 m² ga oshirish uchun sarflanadigan solishtirma erkin sirt energiyasi yoki sirtga urinma yoʼnalishda taʼsir etuvchi kuch [mN/m yoki J/m²]."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image1.png", "izoh": "Sirt erkin energiyasi tenglamasi"},
            {"fayl": "rasmlar/image2.png", "izoh": "Termodinamikaning I va II qonuni birlashuvi"},
            {"fayl": "rasmlar/image3.png", "izoh": "Sirt tarangligining termodinamik taʼrifi"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Sirt termodinamikasi",
        "raqam": 2,
        "sarlavha": "Sirt tarangligiga taʼsir etuvchi omillar",
        "bandlar": [
            {"bosh": "Modda tabiati va qutbliligi",
             "matn": "Molekulalararo bogʼlanish qancha kuchli boʼlsa (vodorod bogʼlar, ionli bogʼlar), sirt tarangligi shuncha yuqori boʼladi: suvda σ = 72,8 mN/m, simobda σ = 475 mN/m."},
            {"bosh": "Harorat taʼsiri (T)",
             "matn": "Harorat ortishi bilan molekulalarning issiqlik harakati kuchayadi, molekulalararo tortishish zaiflashadi va sirt tarangligi chiziqli kamayadi. Kritik haroratda (Tk) σ = 0 boʼladi."},
            {"bosh": "Antonov qoidasi",
             "matn": "Oʼzaro cheklangan eruvchan ikki suyuqlik chegarasidagi sirt tarangligi ularning toʼyingan faza sirt tarangliklari ayirmasiga teng."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image4.png", "izoh": "Sirt tarangligining haroratga bogʼliqligi"},
            {"fayl": "rasmlar/image5.png", "izoh": "Antonov qoidasi tenglamasi"},
            {"fayl": "rasmlar/image6.png", "izoh": "Sirt va hajm molekulalariga taʼsir etuvchi kuchlar"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Sirt termodinamikasi",
        "raqam": 3,
        "sarlavha": "Sirt-aktiv moddalar va Traube-Dyuklo qoidasi",
        "bandlar": [
            {"bosh": "Sirt aktivligi (g)",
             "matn": "Erigan moddaning sirt tarangligini pasaytirish qobiliyati. Chegarada g = −dσ/dC (C → 0 sharoitida) koʼrinishida aniqlanadi."},
            {"bosh": "Traube-Dyuklo qoidasi",
             "matn": "Bir xil gomologik qatordagi sirt-aktiv moddalarning (spirtlar, yogʼ kislotalari) uglevodorod zanjiri bitta −CH₂− guruhga uzayganda, ularning sirt aktivligi 3,0–3,5 baravar ortadi."},
            {"bosh": "Fizikaviy sababi",
             "matn": "Uglevodorod radikali suv muhitidan sirt qatlamiga gidrofob kuchlar taʼsirida siqib chiqariladi — molekula sirtda «dumini koʼtarib» joylashadi."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image7.png", "izoh": "Rebinder boʼyicha sirt aktivlik taʼrifi"},
            {"fayl": "rasmlar/image8.png", "izoh": "Traube-Dyuklo koeffitsiyenti"},
            {"fayl": "rasmlar/image9.png", "izoh": "Spirtlar gomologik qatorida sirt tarangligi"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Sirt termodinamikasi",
        "raqam": 4,
        "sarlavha": "Egri sirtlar: Laplas va Kelvin tenglamalari",
        "bandlar": [
            {"bosh": "Kapillyar bosim (Laplas)",
             "matn": "Suyuqlik sirti egrilanganda (tomchi, pufakcha, kapillyar menisk) sirt taranglik kuchlari natijasida qoʼshimcha Laplas bosimi ΔP hosil boʼladi."},
            {"bosh": "Botiq va qabariq menisklar",
             "matn": "Qabariq sirtda (tomchi) ichki bosim ortadi (ΔP > 0). Botiq sirtda (kapillyar) bosim pasayadi (ΔP < 0) — bu kapillyar koʼtarilishga sabab boʼladi."},
            {"bosh": "Kelvin (Tomson) tenglamasi",
             "matn": "Kichik tomchilar ustidagi toʼyingan bugʼ bosimi (Pr) tekis sirt ustidagi bosimdan (P₀) yuqori boʼladi. Botiq kapillyarlarda esa bugʼ bosimi pasayadi — kapillyar kondensatlanish shu asosda kechadi."},
        ],
        "illustratsiya": {
            "fayl": "rasmlar/gen-kapillyar.jpg",
            "izoh": "Kapillyar koʼtarilish: botiq menisk va Laplas bosimi",
        },
        "rasmlar": [
            {"fayl": "rasmlar/egri-sirt-kapillyar.jpg", "izoh": "Kapillyar koʼtarilish va menisk"},
            {"fayl": "rasmlar/image10.png", "izoh": "Laplas tenglamasi (sferik sirt)"},
            {"fayl": "rasmlar/image11.png", "izoh": "Kelvin (Tomson) tenglamasi"},
        ],
    },
    # ══ 2-BO'LIM ══
    {
        "tur": "bolim",
        "raqam": "02",
        "yorliq": "Ikkinchi qism",
        "sarlavha": "Sorbsiya va adsorbsiya asoslari",
        "izoh": "Jarayonlar tasnifi, miqdoriy koʼrsatkichlar va Gibbs tenglamasi",
        "illustratsiya": {"fayl": "rasmlar/bolim-2-sorbsiya.jpg", "izoh": "Gʼovak adsorbent sirtida toʼplanish"},
    },
    {
        "tur": "kartochka",
        "kichik": "Sorbsiya va adsorbsiya asoslari",
        "sarlavha": "Sorbsiya hodisalarining mexanizmi",
        "kartalar": [
            {"belgi": "01", "sarlavha": "Adsorbsiya (sirtqi)",
             "matn": "Moddaning fazalar ajralish sirtida (qattiq/gaz, qattiq/suyuqlik) toʼplanishi. Sirtqi hodisa; tez muvozanatga erishadi; qaytar — desorbsiya kuzatiladi."},
            {"belgi": "02", "sarlavha": "Absorbsiya (hajmiy)",
             "matn": "Yutilayotgan moddaning ikkinchi faza (suyuqlik yoki qattiq jism) hajmi boʼylab tekis tarqalishi. Diffuziya bilan bogʼliq, sekin boradi."},
            {"belgi": "03", "sarlavha": "Kapillyar kondensatlanish",
             "matn": "Gʼovak adsorbentlarda botiq menisklar hosil boʼlishi natijasida bugʼning P < P₀ bosimda suyuqlikka aylanishi. Kelvin tenglamasi va histerezis sirtlari bilan tavsiflanadi."},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Sorbsiya va adsorbsiya asoslari",
        "raqam": 6,
        "sarlavha": "Miqdoriy koʼrsatkichlar va absolyut adsorbsiya",
        "bandlar": [
            {"bosh": "Asosiy tushunchalar",
             "matn": "Adsorbent — sirtida adsorbsiya sodir boʼladigan qattiq yoki suyuq modda. Adsorbtiv — adsorbsiyalanuvchi modda. Adsorbat — sirtda ushlanib qolgan modda."},
            {"bosh": "Absolyut adsorbsiya (a)",
             "matn": "Adsorbentning birlik massasi (m) yoki birlik sirt yuzasida (S) toʼplangan adsorbatning mol miqdori."},
            {"bosh": "Gibbs ortiqcha adsorbsiyasi (G)",
             "matn": "Sirt qatlamidagi modda miqdorining hajm konsentratsiyasiga nisbatan ortiqcha qismi [mol/m²]."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image12.png", "izoh": "Absolyut adsorbsiya (a)"},
            {"fayl": "rasmlar/image13.png", "izoh": "Gibbs ortiqcha adsorbsiyasi (G)"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Sorbsiya va adsorbsiya asoslari",
        "raqam": 7,
        "sarlavha": "Gibbsning fundamental adsorbsiya tenglamasi",
        "bandlar": [
            {"bosh": "Tenglamaning mohiyati",
             "matn": "Sirt tarangligining konsentratsiyaga qarab oʼzgarishi (dσ/dC) bilan sirtda modda toʼplanishi (G) oʼrtasidagi fundamental termodinamik bogʼliqlik."},
            {"bosh": "Musbat adsorbsiya (G > 0)",
             "matn": "dσ/dC < 0 boʼlsa (sirt-aktiv moddalar), G > 0 — modda sirtda toʼplanadi va sirt tarangligini pasaytiradi."},
            {"bosh": "Manfiy adsorbsiya (G < 0)",
             "matn": "dσ/dC > 0 boʼlsa (sirt-inert moddalar), G < 0 — modda hajmga oʼtadi, sirt qatlamida kamayadi."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image14.png", "izoh": "Gibbs tenglamasi (konsentratsiyali)"},
            {"fayl": "rasmlar/image15.png", "izoh": "Gibbs tenglamasi (aktivlikli)"},
            {"fayl": "rasmlar/image16.png", "izoh": "SAM, SIM va SNM moddalar uchun σ(C) egri chiziqlari"},
        ],
    },
    # ══ 3-BO'LIM ══
    {
        "tur": "bolim",
        "raqam": "03",
        "yorliq": "Uchinchi qism",
        "sarlavha": "Monomolekulyar adsorbsiya",
        "izoh": "Shishkovskiy tenglamasi, Lengmyur nazariyasi va izoterma sohalari",
        "illustratsiya": {"fayl": "rasmlar/bolim-3-monomolekulyar.jpg", "izoh": "Tartiblangan monoqavat"},
    },
    {
        "tur": "mavzu",
        "bolim": "Monomolekulyar adsorbsiya",
        "raqam": 8,
        "sarlavha": "Shishkovskiy tenglamasi va molekula oʼlchamlari",
        "bandlar": [
            {"bosh": "Shishkovskiy tenglamasi (1908)",
             "matn": "Sirt-aktiv moddalar konsentratsiyasi ortishi bilan sirt tarangligi pasayishini empirik ravishda ifodalaydi."},
            {"bosh": "Gibbs va Lengmyur bilan bogʼlanishi",
             "matn": "Shishkovskiy konstantasi B = Gmax·RT ekanligi isbotlandi — bu Gibbs tenglamasidan Lengmyur izotermasiga oʼtish imkonini berdi."},
            {"bosh": "Molekula parametrlari",
             "matn": "Gmax qiymatidan molekulaning sirtda egallagan koʼndalang kesim yuzasi (S₀) va sirt qatlamining qalinligi (l) aniqlanadi."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image17.png", "izoh": "Shishkovskiy empirik tenglamasi"},
            {"fayl": "rasmlar/image18.png", "izoh": "Gibbs-Lengmyur birlashgan tenglamasi"},
            {"fayl": "rasmlar/image19.png", "izoh": "Molekula oʼlchamlari formulalari"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Monomolekulyar adsorbsiya",
        "raqam": 9,
        "sarlavha": "Lengmyurning monomolekulyar nazariyasi",
        "bandlar": [
            {"bosh": "Lengmyur postulatlari (1915)",
             "matn": "1. Adsorbsiya adsorbent sirtidagi diskret faol markazlarda sodir boʼladi. 2. Har bir faol markaz faqat bitta adsorbat molekulasini tuta oladi (monoqavat). 3. Faol markazlar energetik jihatdan teng va bir-biriga taʼsir etmaydi. 4. Jarayon dinamik muvozanatda: adsorbsiya tezligi = desorbsiya tezligi."},
            {"bosh": "Izoterma shakli",
             "matn": "Adsorbsiya toʼyingan qiymatga intiladi: past konsentratsiyada keskin oʼsadi, yuqorisida esa gorizontalga yaqinlashadi."},
            {"bosh": "Sirt toʼlish darajasi (θ)",
             "matn": "θ = G/Gmax — sirtning qancha qismi monoqavat bilan qoplanganini koʼrsatadi (0 ≤ θ ≤ 1)."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/sam-monomolekulyar.jpg", "izoh": "Monoqavat: sirt-aktiv molekulalar"},
            {"fayl": "rasmlar/image20.png", "izoh": "Lengmyur adsorbsiya izotermasi"},
            {"fayl": "rasmlar/image21.png", "izoh": "Sirt toʼlish darajasi (θ)"},
            {"fayl": "rasmlar/image22.png", "izoh": "Lengmyur izotermasi grafigi va sohalari"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Monomolekulyar adsorbsiya",
        "raqam": 10,
        "sarlavha": "Lengmyur izotermasining sohalari va linearizatsiyasi",
        "bandlar": [
            {"bosh": "Genri sohasi (C → 0)",
             "matn": "Juda kam konsentratsiyada KC ≪ 1, shunda G = Gmax·K·C = KH·C. Adsorbsiya konsentratsiyaga toʼgʼri mutanosib."},
            {"bosh": "Toʼyinish sohasi (C → ∞)",
             "matn": "Yuqori konsentratsiyada KC ≫ 1, shunda G = Gmax. Adsorbent sirti toʼliq monoqavat bilan qoplanadi."},
            {"bosh": "Linearizatsiya",
             "matn": "Tajriba maʼlumotlaridan Gmax va K doimiylarini grafik usulda aniqlash uchun 1/G ga nisbatan 1/C grafigi chiziladi."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image23.png", "izoh": "Lengmyur tenglamasining chiziqli shakli"},
            {"fayl": "rasmlar/image24.png", "izoh": "Genri sohasi chegarasi"},
            {"fayl": "rasmlar/image25.png", "izoh": "Toʼyinish sohasi chegarasi"},
        ],
    },
    # ══ 4-BO'LIM ══
    {
        "tur": "bolim",
        "raqam": "04",
        "yorliq": "Toʼrtinchi qism",
        "sarlavha": "Polimolekulyar modellar va adsorbentlar",
        "izoh": "Freyndlih, BET nazariyasi, gʼovaklik tasnifi va Rebinder qoidasi",
        "illustratsiya": {"fayl": "rasmlar/bolim-4-polimolekulyar.jpg", "izoh": "Mikro, mezo va makrogʼovaklar"},
    },
    {
        "tur": "mavzu",
        "bolim": "Polimolekulyar modellar",
        "raqam": 11,
        "sarlavha": "Freyndlihning empirik izotermasi",
        "bandlar": [
            {"bosh": "Tenglama (1909)",
             "matn": "Gʼovak va energetik jihatdan bir jinsli boʼlmagan adsorbentlarda oʼrtacha konsentratsiyalar sohasida adsorbsiyani ifodalovchi empirik darajali tenglama."},
            {"bosh": "Tenglama doimiylari",
             "matn": "β — adsorbsion sigʼim koeffitsiyenti; 1/n — sirtning energetik bir jinsli emaslik koeffitsiyenti (0,1 < 1/n < 0,7)."},
            {"bosh": "Qoʼllanish chegarasi",
             "matn": "Juda kichik va juda yuqori konsentratsiyalarda (toʼyinishda) bajarilmaydi — bu uning asosiy cheklovi."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image26.png", "izoh": "Freyndlih darajali tenglamasi"},
            {"fayl": "rasmlar/image27.png", "izoh": "Logarifmik chiziqli shakli"},
            {"fayl": "rasmlar/image28.png", "izoh": "Freyndlih izotermasi (logarifmik koordinatalar)"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Polimolekulyar modellar",
        "raqam": 12,
        "sarlavha": "BET polimolekulyar modeli",
        "bandlar": [
            {"bosh": "BET nazariyasi (1938)",
             "matn": "Brunauer, Emmett va Teller taklif etgan model: 1. Adsorbsiya polimolekulyar (koʼp qatlamli) xarakterga ega. 2. Birinchi qatlam energiyasi (E₁) adsorbent bilan taʼsirga bogʼliq. 3. Ikkinchi va keyingi qatlamlar kondensatlanish issiqligiga (EL) teng deb qaraladi."},
            {"bosh": "S-simon izoterma",
             "matn": "Past bosimda bir qatlam, oʼrta bosimda koʼp qatlam, yuqori bosimda kapillyar kondensatlanish — egri chiziq S shaklini oladi."},
            {"bosh": "Amaliy ahamiyati",
             "matn": "Kukun va gʼovak adsorbentlarning solishtirma sirt yuzasini (Ssol) aniqlashda standart xalqaro usul hisoblanadi."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image29.png", "izoh": "BET chiziqli tenglamasi"},
            {"fayl": "rasmlar/image30.png", "izoh": "BET polimolekulyar izotermasi"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Polimolekulyar modellar",
        "raqam": 13,
        "sarlavha": "Qattiq adsorbentlar va gʼovaklik strukturasi",
        "bandlar": [
            {"bosh": "Gidrofil (qutbli) adsorbentlar",
             "matn": "Silikagel SiO₂, alyumogel Al₂O₃, gil minerallari. Suv va qutbli moddalarni yaxshi adsorbsiyalaydi."},
            {"bosh": "Gidrofob (qutbsiz) adsorbentlar",
             "matn": "Aktivlangan koʼmir, soot, grafit. Organik moddalarni suvli eritmalardan yaxshi tutadi."},
            {"bosh": "IUPAC boʼyicha gʼovaklar tasnifi",
             "matn": "Mikrogʼovaklar r < 2 nm; mezogʼovaklar 2 nm < r < 50 nm; makrogʼovaklar r > 50 nm."},
            {"bosh": "Rebinder qoidasi",
             "matn": "Adsorbsiya faza chegaralarining qutbliliklari farqi kamayishi yoʼnalishida boradi."},
        ],
        "illustratsiya": {
            "fayl": "rasmlar/gen-adsorbent.jpg",
            "izoh": "Gʼovak adsorbent kesimi: mikrokovaklar va tutilgan molekulalar",
        },
        "rasmlar": [
            {"fayl": "rasmlar/image31.png", "izoh": "Rebinder qutblar tenglashtirish qoidasi"},
        ],
    },
    # ══ 5-BO'LIM ══
    {
        "tur": "bolim",
        "raqam": "05",
        "yorliq": "Beshinchi qism",
        "sarlavha": "Eritmalardan adsorbsiya va qoʼllanish",
        "izoh": "Ionli adsorbsiya, xromatografiya, tibbiyot va sanoat",
        "illustratsiya": {"fayl": "rasmlar/bolim-5-qollanish.jpg", "izoh": "Xromatografik ustun"},
    },
    {
        "tur": "mavzu",
        "bolim": "Eritmalardan adsorbsiya",
        "raqam": 14,
        "sarlavha": "Ionli adsorbsiya va Panet-Fayans qoidasi",
        "bandlar": [
            {"bosh": "Ionli adsorbsiya xususiyatlari",
             "matn": "Qattiq adsorbent sirtida elektrod potensiali va elektr ikki qatlami (EDL) hosil boʼlishi bilan kechadigan tanlanma (selektiv) adsorbsiya."},
            {"bosh": "Panet-Fayans selektivlik qoidasi",
             "matn": "Qattiq kristall adsorbent sirtiga birinchi navbatda uning kristall panjarasi tarkibiga kiruvchi yoki u bilan qiyin eriydigan birikma hosil qiluvchi ionlar adsorbsiyalanadi."},
            {"bosh": "Liotrop (Hofmeyster) qatorlar",
             "matn": "Bir xil valentli ionlarning gidratlanish radiusi kamayishi bilan ularning adsorbsiyalanish qobiliyati ortadi."},
            {"bosh": "Ionitlar",
             "matn": "Kationitlar (kation almashuvchi) va anionitlar (anion almashuvchi) — gʼovak polimer va minerallar."},
        ],
        "rasmlar": [
            {"fayl": "rasmlar/image32.png", "izoh": "Liotrop kationlar qatori"},
            {"fayl": "rasmlar/image33.png", "izoh": "Liotrop anionlar qatori"},
        ],
    },
    {
        "tur": "mavzu",
        "bolim": "Xromatografiya",
        "raqam": 15,
        "sarlavha": "Xromatografik ajratish usullari",
        "bandlar": [
            {"bosh": "M.S. Tsvet kashfiyoti (1903)",
             "matn": "Oʼsimlik pigmentlarini (xlorofill, karotin) boʼr ustunida (CaCO₃) adsorbsion ajratib, xromatografiya usuliga asos soldi."},
            {"bosh": "Klassifikatsiya",
             "matn": "Adsorbsion (Gmax va K farqi), taqsimlash (eruvchanlik farqi), ion almashinish va eksklyuzion (gel-filtratsiya) xromatografiyalari."},
            {"bosh": "Zamonaviy usullar",
             "matn": "Yuqori samarali suyuqlik (HPLC) va gaz xromatografiyasi — analitik kimyoning eng sezgir usullari."},
            {"bosh": "Ustun mexanizmi",
             "matn": "Harakatchan faza (eluyent) va qoʼzgʼalmas faza (adsorbent) oʼrtasida uzluksiz adsorbsiya-desorbsiya boradi: koeffitsiyenti kichik modda ustundan birinchi chiqadi."},
        ],
        "illustratsiya": {
            "fayl": "rasmlar/gen-xromatografiya.jpg",
            "izoh": "Ajralish ustuni: komponentlar rangli zonalarga boʼlinadi",
        },
    },
    {
        "tur": "mavzu",
        "bolim": "Amaliy tatbiq",
        "raqam": 16,
        "sarlavha": "Adsorbsiyaning tibbiyotdagi roli",
        "bandlar": [
            {"bosh": "Entero- va gemosorbsiya",
             "matn": "Oshqozon-ichak yoʼlidan va qondan toksinlar, zaharli moddalar, allergenlar hamda ogʼir metallarni ajratib olish."},
            {"bosh": "Biologik membranalar",
             "matn": "Hujayra membranasi lipid ikki qavat va oqsil qatlamlaridan tuzilgan: fermentativ va retseptor jarayonlari sirt hodisalariga asoslanadi."},
            {"bosh": "Dori tashuvchilari",
             "matn": "Preparatlarning soʼrilishini oshirish uchun ular mikrogʼovak tashuvchilarda immobilizatsiyalanadi."},
            {"bosh": "Tibbiy sorbentlar",
             "matn": "Aktivlangan koʼmir, smekta va politrepan, silikagelli enterosorbentlar (Polisorb), selektiv immunasorbentlar."},
        ],
        "illustratsiya": {
            "fayl": "rasmlar/gen-tibbiyot.jpg",
            "izoh": "Enterosorbent: gʼovak yuza toksinlarni ushlab qoladi",
        },
    },
    {
        "tur": "mavzu",
        "bolim": "Amaliy tatbiq",
        "raqam": 17,
        "sarlavha": "Sanoat va ekologiyadagi amaliy roli",
        "bandlar": [
            {"bosh": "Gazlarni tozalash",
             "matn": "Chiqindi gazlarni H₂S, SO₂, CO₂ va zaharli moddalardan tozalash; sanoat protivogazlarida gazlarni tutib qolish."},
            {"bosh": "Suvni tozalash",
             "matn": "Ichimlik suvi va oqova suvlarni neft mahsulotlari, boʼyoqlar, fenollar hamda sirt-aktiv moddalardan tozalash."},
            {"bosh": "Geterogen kataliz",
             "matn": "Sanoat sintez reaksiyalarining 80% gacha qismi katalizator sirtidagi adsorbsiya orqali boradi."},
            {"bosh": "Sanoat texnologiyalari",
             "matn": "Koks gazidan benzol va toluol ajratish, shakar va moylarni rangsizlantirish, molekulyar elaklar (seolitlar) bilan gazlarni quritish."},
        ],
        "illustratsiya": {
            "fayl": "rasmlar/gen-sanoat.jpg",
            "izoh": "Adsorbsion tozalash minorasi: iflos gaz — toza gaz",
        },
    },
    # ── Yakun ──────────────────────────────────────────────────────
    {
        "tur": "yakun",
        "yorliq": "Xulosa",
        "sarlavha": "Asosiy xulosalar",
        "bandlar": [
            "Sirt energiyasi — barcha sirt hodisalarining manbai",
            "Izotermalar (Lengmyur, Freyndlih, BET) adsorbsiyani miqdoriy tavsiflaydi",
            "Adsorbsiya tibbiyot, sanoat va ekologiyada hal qiluvchi jarayon",
        ],
        "izoh": "Savollar uchun rahmat",
    },
]


def main():
    os.makedirs(os.path.dirname(CHIQISH), exist_ok=True)
    with open(CHIQISH, "w", encoding="utf-8") as f:
        json.dump({"meta": META, "slaydlar": SLAYDLAR}, f, ensure_ascii=False, indent=1)

    turlar = {}
    for s in SLAYDLAR:
        turlar[s["tur"]] = turlar.get(s["tur"], 0) + 1
    print(f"✅ {len(SLAYDLAR)} slayd -> {CHIQISH}")
    print("   turlar:", ", ".join(f"{k}={v}" for k, v in turlar.items()))
    rasm = sum(len(s.get("rasmlar") or []) for s in SLAYDLAR)
    print(f"   rasmlar: {rasm} ta joylashtirilgan")


if __name__ == "__main__":
    main()
