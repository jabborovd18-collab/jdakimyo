// 2025-yil 15-mart, I smena — Milliy sertifikat CBT sinov banki (40 savol)

const MOSLASHTIRISH_KONTEKST_33_35 =
  "Ammoniy sulfat va natriy nitrit aralashmasi qizdirilganda $A$, $B$ va $D$ moddalar hosil bo'ldi.\n" +
  "• $A$ — havoda eng ko'p miqdorda uchraydigan modda.\n" +
  "• Etan yonganda $X$ va $B$ moddalari hosil bo'ladi."

const MOSLASHTIRISH_VARIANTLAR_33_35 = {
  A: "$1{,}44$",
  B: "$2{,}88$",
  C: "$2{,}74$",
  D: "$2{,}64$",
  E: "$2{,}52$",
  F: "$6{,}9$",
}

const savollar = [
  {
    id: "ms-2025-03-15-1-1",
    turi: "variant",
    mavzu: "Gazlar aralashmasining massa va hajm nisbatlari",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "$\\ce{N2O}$ va $\\ce{NO}$ dan iborat gazlar aralashmasi $22{,}4\\text{ litr}$ (n.sh.) bo'lib, aralashmadagi azot va kislorod elementlarining massalari teng bo'lsa, azot monoksidning hajmini ($\\text{l}$, n.sh.) toping.",
    options: ["$20{,}16$", "$3{,}2$", "$19{,}2$", "$16{,}8$"],
    correct: 2,
    explanation:
      "Jami gazlar $1\\text{ mol}$: $n(\\ce{N2O}) = x$, $n(\\ce{NO}) = 1 - x$. Azot atomlari $2x + (1 - x) = 1 + x\\text{ mol}$, kislorod atomlari $x + (1 - x) = 1\\text{ mol}$. Massalar tengligi: $14(1 + x) = 16 \\cdot 1 \\Rightarrow 1 + x = 8/7 \\Rightarrow x = 1/7\\text{ mol}$. Demak $n(\\ce{NO}) = 6/7\\text{ mol}$, hajmi: $(6/7) \\cdot 22{,}4 = 19{,}2\\text{ l}$.",
  },
  {
    id: "ms-2025-03-15-1-2",
    turi: "variant",
    mavzu: "Atom tarkibi va protonlar soni",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "$5{,}6\\text{ litr}$ (n.sh.) murakkab modda tarkibida $27{,}09 \\cdot 10^{23}$ ta proton bo'lsa, shu murakkab moddani aniqlang.",
    options: ["$\\ce{SiH4}$", "$\\ce{Ar}$", "$\\ce{H2O}$", "$\\ce{CH4}$"],
    correct: 0,
    explanation:
      "$5{,}6\\text{ l}$ gaz $0{,}25\\text{ mol}$, protonlar soni esa $27{,}09/6{,}02 = 4{,}5\\text{ mol}$. Bitta molekulada $4{,}5 / 0{,}25 = 18$ ta proton bo'lishi kerak. Argon ($18$) oddiy modda hisoblanadi, murakkab modda esa silan — $\\ce{SiH4}$ ($14 + 4 \\cdot 1 = 18$).",
  },
  {
    id: "ms-2025-03-15-1-3",
    turi: "variant",
    mavzu: "Metallar aralashmasining molyar massasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "Teng mol nisbatda olingan $\\ce{Ca}$, $Me$ va $\\ce{Cu}$ aralashmasi tarkibida noma'lum metall massasi kalsiy massasidan $3{,}2\\text{ g}$ og'ir, mis massasidan esa $1{,}6\\text{ g}$ kam bo'lsa, metallni aniqlang.",
    options: ["$\\ce{Fe}$", "$\\ce{Ti}$", "$\\ce{Cr}$", "$\\ce{Mg}$"],
    correct: 0,
    explanation:
      "Har bir metalldan $n\\text{ mol}$ olingan. Mis va kalsiy massalari farqi: $3{,}2 + 1{,}6 = 4{,}8\\text{ g} = n(64 - 40) = 24n \\Rightarrow n = 0{,}2\\text{ mol}$. Shunda $0{,}2(A_r - 40) = 3{,}2 \\Rightarrow A_r = 56$, bu temir ($\\ce{Fe}$).",
  },
  {
    id: "ms-2025-03-15-1-4",
    turi: "variant",
    mavzu: "Agregat holatlar va fazaviy o'tishlar",
    soha: "Umumiy kimyo",
    daraja: "oson",
    rasm: "/images/ms/ms-2025-03-15-1/savol-4.png",
    question: "Yuqoridagi fazaviy o'tish diagrammasidan sublimatsiya hodisasiga mos raqamni ko'rsating.",
    options: ["$1$", "$6$", "$5$", "$4$"],
    correct: 2,
    explanation:
      "Sublimatsiya — moddaning suyuq fazaga o'tmasdan to'g'ridan-to'g'ri qattiq holatdan gaz holatiga o'tishidir. Rasmda $5$-o'q qattiq moddadan gazga yo'nalgan ($6$ esa desublimatsiya).",
  },
  {
    id: "ms-2025-03-15-1-5",
    turi: "variant",
    mavzu: "Eritmalarning elektroneytrallik qonuni",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Eritmada $0{,}05\\text{ mol}$ $\\ce{Fe^{2+}}$, $0{,}2\\text{ mol}$ $\\ce{Al^{3+}}$, $0{,}6\\text{ mol}$ $\\ce{Br-}$, hamda jami $0{,}14\\text{ mol}$ $\\ce{NO3-}$ va $\\ce{Cl-}$ ionlari bor. Shu eritmadagi $\\ce{Ca^{2+}}$ ionlarining massasini ($\\text{mg}$) toping.",
    options: ["$600$", "$800$", "$200$", "$400$"],
    correct: 1,
    explanation:
      "Elektroneytrallik shartiga ko'ra musbat zaryadlar yig'indisi manfiy zaryadlar yig'indisiga teng: $0{,}05 \\cdot 2 + 0{,}2 \\cdot 3 + 2n(\\ce{Ca^{2+}}) = 0{,}6 \\cdot 1 + 0{,}14 \\cdot 1 \\Rightarrow 0{,}70 + 2n(\\ce{Ca^{2+}}) = 0{,}74 \\Rightarrow n(\\ce{Ca^{2+}}) = 0{,}02\\text{ mol}$. Massasi: $0{,}02 \\cdot 40 = 0{,}8\\text{ g} = 800\\text{ mg}$.",
  },
  {
    id: "ms-2025-03-15-1-6",
    turi: "variant",
    mavzu: "Elektron konfiguratsiya va oksidlovchi-qaytaruvchi xossalar",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question: "Reaksiyalarda qaytaruvchilik xossasini namoyon qila olmaydigan elementning elektron konfiguratsiyasini toping.",
    options: [
      "$1s^2 2s^1$",
      "$1s^2 2s^2 2p^5$",
      "$1s^2 2s^2 2p^6 3s^2 3p^4$",
      "$1s^2 2s^2 2p^6 3s^2 3p^5$",
    ],
    correct: 1,
    explanation:
      "Eng yuqori elektromanfiylikka ega ftor ($Z = 9$, $1s^2 2s^2 2p^5$) atomining birikmalarida faqat $-1$ oksidlanish darajasi kuzatiladi; u elektron bera olmaydi, shuning uchun hech qachon qaytaruvchi bo'la olmaydi.",
  },
  {
    id: "ms-2025-03-15-1-7",
    turi: "variant",
    mavzu: "Atomning qo'zg'algan holati elektron konfiguratsiyasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question: "Quyidagi valent pog'ona konfiguratsiyalaridan qaysi birida haqiqiy elektron qo'zg'alish hodisasi kuzatilgan?",
    options: [
      "$ns^1 np^3 nd^1$",
      "$ns^1 np^4 nd^1$",
      "$ns^1 np^4 nd^2$",
      "$ns^2 np^2 nd^2$",
    ],
    correct: 0,
    explanation:
      "V guruh $p$-elementlari (masalan, fosfor $3s^2 3p^3$) da barcha $p$-orbitallarda $1$ tadan toq elektron bo'lgani uchun qo'zg'alishda juftlashgan $ns^2$ elektronlaridan biri $nd$ pog'onachaga o'tib, $ns^1 np^3 nd^1$ ($5$ valentli) holatni hosil qiladi. Qolgan variantlarda $np$ pog'ona juftlashgan holda $ns$ ko'chishi yoki $np$ bo'shatilib $s$ qolishi energetik jihatdan noma'qul.",
  },
  {
    id: "ms-2025-03-15-1-8",
    turi: "variant",
    mavzu: "Kvant sonlari va ion konfiguratsiyasi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question: "$\\ce{Ti}$ atomi va $\\ce{Fe^{3+}}$ ioni tarkibida nechta elektronning to'rttala kvant soni o'zaro bir xil bo'ladi?",
    options: ["$22$", "$20$", "$21$", "$18$"],
    correct: 1,
    explanation:
      "$\\ce{Ti}$: $[\\ce{Ar}]\\,3d^2\\,4s^2$, $\\ce{Fe^{3+}}$: $[\\ce{Ar}]\\,3d^5$. Ikkala zarrachada ichki $[\\ce{Ar}]$ qobig'ining $18$ ta elektroni hamda Hund qoidasiga binoan $3d$-pog'onachada bir xil spinga ega dastlabki $2$ ta elektroni mos keladi: jami $18 + 2 = 20$ ta.",
  },
  {
    id: "ms-2025-03-15-1-9",
    turi: "variant",
    mavzu: "Kristallogidratlar aralashmasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    question:
      "Mis kuporosi ($\\ce{CuSO4 \\cdot 5H2O}$) va temir kuporosi ($\\ce{FeSO4 \\cdot 7H2O}$) ning $130{,}6\\text{ g}$ aralashmasi suvda eritilib, ortiqcha $\\ce{BaCl2}$ ta'sir ettirilganda $0{,}5\\text{ mol}$ oq cho'kma hosil bo'ldi. Dastlabki aralashmadagi mis kuporosining massasini ($\\text{g}$) aniqlang.",
    options: ["$75$", "$50$", "$100$", "$25$"],
    correct: 0,
    explanation:
      "$M(\\ce{CuSO4 \\cdot 5H2O}) = 250$, $M(\\ce{FeSO4 \\cdot 7H2O}) = 278\\text{ g/mol}$. $0{,}5\\text{ mol}$ $\\ce{BaSO4}$ cho'kkani uchun $x + y = 0{,}5\\text{ mol}$ va $250x + 278(0{,}5 - x) = 130{,}6 \\Rightarrow 28x = 8{,}4 \\Rightarrow x = 0{,}3\\text{ mol}$. Mis kuporosi massasi: $0{,}3 \\cdot 250 = 75\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-1-10",
    turi: "variant",
    mavzu: "Elektrolitik dissotsiatsiya va ionlar nisbati",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "Tuzlarning suvda to'liq dissotsiatsiyalanishidan hosil bo'lgan kation ($n_{\\text{kat}}$) va anion ($n_{\\text{an}}$) lar soni nisbatini to'g'ri moslang:\n" +
      "$1)$ $n_{\\text{kat}} = n_{\\text{an}}$; $2)$ $n_{\\text{kat}} > n_{\\text{an}}$; $3)$ $n_{\\text{kat}} < n_{\\text{an}}$.\n" +
      "Moddalar: $a)$ temir(II)-gidroksosulfat; $b)$ kaliy nitrat; $c)$ alyuminiy xlorid; $d)$ kaliy alyuminiy sulfat.",
    options: [
      "$1$ — $b, d$; $2$ — $a$; $3$ — $c$",
      "$1$ — $b, c$; $2$ — $a$; $3$ — $d$",
      "$1$ — $b, d$; $2$ — $c$; $3$ — $a$",
      "$1$ — $a, c$; $2$ — $b$; $3$ — $d$",
    ],
    correct: 0,
    explanation:
      "$b)$ $\\ce{KNO3 -> K+ + NO3-}$ ($1=1$); $d)$ $\\ce{KAl(SO4)2 -> K+ + Al^{3+} + 2SO4^{2-}}$ ($2=2$); $a)$ $\\ce{(FeOH)2SO4 -> 2FeOH+ + SO4^{2-}}$ ($2 > 1$); $c)$ $\\ce{AlCl3 -> Al^{3+} + 3Cl-}$ ($1 < 3$). To'g'ri moslik: $1-b,d$; $2-a$; $3-c$.",
  },
  {
    id: "ms-2025-03-15-1-11",
    turi: "variant",
    mavzu: "Kimyoviy reaksiya tezligi",
    soha: "Umumiy kimyo",
    daraja: "oson",
    question:
      "Hajmi $5\\text{ litr}$ idishdagi modda miqdori $0{,}1\\text{ minut}$ dan keyin $20\\text{ mol}$ dan $5\\text{ mol}$ gacha kamaydi. Reaksiyaning o'rtacha tezligini ($\\text{mol/(l}\\cdot\\text{s)}$) aniqlang.",
    options: ["$3/4$", "$1$", "$1/3$", "$1/2$"],
    correct: 3,
    explanation:
      "Konsentratsiya o'zgarishi $\\Delta C = (20 - 5) / 5 = 3\\text{ mol/l}$. Vaqt $\\Delta t = 0{,}1 \\cdot 60 = 6\\text{ s}$. Tezlik: $v = 3 / 6 = 1/2\\text{ mol/(l}\\cdot\\text{s)}$.",
  },
  {
    id: "ms-2025-03-15-1-12",
    turi: "variant",
    mavzu: "Muvozanat doimiysi va reaksiya tezligi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Hajmi $10\\text{ l}$ bo'lgan idishga noma'lum miqdorda $\\ce{CO2}$ va $4\\text{ mol}$ $\\ce{H2}$ solindi va $72\\text{ sekund}$ dan keyin ($\\ce{CO2_{(g)} + H2_{(g)} <=> CO_{(g)} + H2O_{(g)}}$) muvozanat qaror topdi ($K_m = 1$). Reaksiyaning o'rtacha tezligi $0{,}25\\text{ mol/(l}\\cdot\\text{min)}$ bo'lsa, $\\ce{CO2}$ ning dastlabki miqdorini ($\\text{mol}$) aniqlang.",
    options: ["$4$", "$3$", "$9$", "$12$"],
    correct: 3,
    explanation:
      "$72\\text{ s} = 1{,}2\\text{ min}$ da $\\Delta C = 0{,}25 \\cdot 1{,}2 = 0{,}3\\text{ mol/l}$, ya'ni $3\\text{ mol}$ $\\ce{CO2}$ va $\\ce{H2}$ sarflangan. Muvozanatda: $[\\ce{CO}] = [\\ce{H2O}] = 0{,}3$, $[\\ce{H2}] = 0{,}1\\text{ mol/l}$. $K_m = 0{,}3^2 / ([\\ce{CO2}] \\cdot 0{,}1) = 1 \\Rightarrow [\\ce{CO2}]_{\\text{muv}} = 0{,}9\\text{ mol/l}$ ($9\\text{ mol}$). Dastlabki miqdor: $9 + 3 = 12\\text{ mol}$.",
  },
  {
    id: "ms-2025-03-15-1-13",
    turi: "variant",
    mavzu: "Oleum tarkibini aniqlash",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Tarkibida $0{,}3\\text{ mol}$ oltingugurt saqlagan oleumni neytrallash uchun $24\\%$ li $\\ce{NaOH}$ eritmasi qo'shildi. Hosil bo'lgan eritmaga $174{,}2\\text{ g}$ suv qo'shilganda $14{,}2\\%$ li tuz eritmasi hosil bo'ldi. Dastlabki oleumdagi erituvchi va erigan modda mol nisbatini aniqlang.",
    options: ["$2 : 3$", "$1 : 5$", "$3 : 5$", "$1 : 2$"],
    correct: 3,
    explanation:
      "$0{,}3\\text{ mol}$ $\\ce{Na2SO4}$ ($42{,}6\\text{ g}$) uchun $0{,}6\\text{ mol}$ $\\ce{NaOH}$ ($100\\text{ g}$ $24\\%$ li eritma) sarflanadi. Yakuniy eritma massasi $42{,}6 / 0{,}142 = 300\\text{ g}$, oleum massasi $300 - 100 - 174{,}2 = 25{,}8\\text{ g}$. $n(\\ce{H2SO4}) + n(\\ce{SO3}) = 0{,}3$ va $98a + 80b = 25{,}8 \\Rightarrow a = 0{,}1\\text{ mol}$, $b = 0{,}2\\text{ mol}$, nisbat $1 : 2$.",
  },
  {
    id: "ms-2025-03-15-1-14",
    turi: "variant",
    mavzu: "Alkin va alkenlarning bromlanishi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Propin va propendan iborat aralashmaga yetarli miqdordagi bromli suv ta'sir ettirilganda olingan mahsulotlar massasi dastlabki aralashma massasidan $191/31$ marta katta bo'lsa, dastlabki aralashmadagi gazlarning (propin : propen) mol nisbatini aniqlang.",
    options: ["$1 : 1$", "$1 : 2$", "$2 : 3$", "$1 : 3$"],
    correct: 1,
    explanation:
      "$x\\text{ mol}$ propin ($\\ce{C3H4}$, $M=40$) $2\\text{ mol}$ $\\ce{Br2}$ biriktirib $M = 360\\text{ g/mol}$ mahsulot beradi; $y\\text{ mol}$ propen ($\\ce{C3H6}$, $M=42$) esa $1\\text{ mol}$ $\\ce{Br2}$ biriktirib $M = 202\\text{ g/mol}$ mahsulot beradi. $\\frac{360x + 202y}{40x + 42y} = \\frac{191}{31} \\Rightarrow 11160x + 6262y = 7640x + 8022y \\Rightarrow 3520x = 1760y \\Rightarrow x : y = 1 : 2$.",
  },
  {
    id: "ms-2025-03-15-1-15",
    turi: "variant",
    mavzu: "Uglevodorod formulasini aniqlash va izomeriya",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$\\ce{C_x H_y}$ uglevodorodining to'liq yonishi uchun $6{,}4\\text{ g}$ kislorod sarflanib, $2{,}7\\text{ g}$ suv hosil bo'ldi. $\\ce{C_x H_y}$ ning nechta tuzilish izomeri borligini aniqlang.",
    options: ["$3$", "$6$", "$5$", "$4$"],
    correct: 0,
    explanation:
      "Sarflangan $\\ce{O2}$: $6{,}4/32 = 0{,}2\\text{ mol}$ ($0{,}4\\text{ mol}$ $\\ce{O}$ atomi). Hosil bo'lgan suv: $2{,}7/18 = 0{,}15\\text{ mol}$ ($0{,}3\\text{ mol}$ $\\ce{H}$ va $0{,}15\\text{ mol}$ $\\ce{O}$). Qolgan $0{,}4 - 0{,}15 = 0{,}25\\text{ mol}$ $\\ce{O}$ dan $0{,}125\\text{ mol}$ $\\ce{CO2}$ hosil bo'ladi. $n(\\ce{C}) : n(\\ce{H}) = 0{,}125 : 0{,}30 = 5 : 12$, demak pentan ($\\ce{C5H12}$), uning $3$ ta izomeri mavjud.",
  },
  {
    id: "ms-2025-03-15-1-16",
    turi: "variant",
    mavzu: "Fenol va aminlar aralashmasining xossalari",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Fenol va noma'lum amin aralashmasining $15{,}95\\text{ g}$ miqdori $1568\\text{ ml}$ (n.sh.) vodorod xlorid yoki $24\\text{ g}$ $15\\%$ li natriy gidroksid eritmasi bilan to'liq ta'sirlasha oldi. Noma'lum aminni aniqlang.",
    options: ["Fenilamin", "Benzilamin", "Etilamin", "Metilamin"],
    correct: 1,
    explanation:
      "NaOH bilan faqat fenol ($M=94$) reaksiyaga kirishadi: $n(\\text{fenol}) = (24 \\cdot 0{,}15)/40 = 0{,}09\\text{ mol}$, massasi $0{,}09 \\cdot 94 = 8{,}46\\text{ g}$. Amin massasi: $15{,}95 - 8{,}46 = 7{,}49\\text{ g}$. HCl bilan amin ($1{,}568 / 22{,}4 = 0{,}07\\text{ mol}$) ta'sirlashadi. $M(\\text{amin}) = 7{,}49 / 0{,}07 = 107\\text{ g/mol}$ — bu benzilamin ($\\ce{C6H5CH2NH2}$).",
  },
  {
    id: "ms-2025-03-15-1-17",
    turi: "variant",
    mavzu: "Aminokislotalar va peptidlarga oid genetik bog'lanish",
    soha: "Organik kimyo",
    daraja: "qiyin",
    rasm: "/images/ms/ms-2025-03-15-1/savol-17.png",
    question:
      "Yuqoridagi sxema va ma'lumotlarga ko'ra $E$ moddani aniqlang:\n" +
      "• $C$ moddadagi uglerod atomlari soni $B$ moddadagidan $2$ marta ko'p;\n" +
      "• $A$, $B$ va $C$ moddalarning har biriga $\\ce{NaOH}$ qo'shilganda (suv ajralib) $E$ modda hosil bo'ladi;\n" +
      "• $A$, $B$ va $E$ moddalarda uglerod atomlari soni teng.",
    options: [
      "$\\ce{H2N-CH2-COONa}$",
      "$\\ce{CH3-COONa}$",
      "$\\ce{H2N-CH(CH3)-COONa}$",
      "$\\ce{CH3-CH2-COONa}$",
    ],
    correct: 0,
    explanation:
      "$A$ amfoter aminokislota — glitsin ($\\ce{H2N-CH2-COOH}$, $2\\text{ C}$). HCl bilan tuz $B$ ($[\\ce{H3N-CH2-COOH}]\\ce{Cl}$, $2\\text{ C}$) hosil qiladi. $C$ — glitsilglitsin dipeptidi ($\\ce{H2N-CH2-CONH-CH2-COOH}$, $4\\text{ C}$, $B$ dan $2$ marta ko'p C). Uchalasi ham ishqor ($\\ce{NaOH}$) ta'sirida natriy glitsinat $E$ ($\\ce{H2N-CH2-COONa}$) hosil qiladi.",
  },
  {
    id: "ms-2025-03-15-1-18",
    turi: "variant",
    mavzu: "Ammiakning qaytaruvchilik xossasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    question:
      "$\\ce{CuO + NH3 -> Cu + N2 + H2O}$ reaksiyasi natijasida hosil bo'lgan oddiy moddalar massa farqi $49{,}2\\text{ g}$ bo'lsa, sarflangan ammiakning hajmini ($\\text{l}$, n.sh.) toping.",
    options: ["$11{,}2$", "$6{,}72$", "$13{,}44$", "$20{,}16$"],
    correct: 2,
    explanation:
      "Tenglashtirilgan tenglama: $\\ce{3CuO + 2NH3 -> 3Cu + N2 + 3H2O}$. $2\\text{ mol}$ $\\ce{NH3}$ sarflanganda $3 \\cdot 64 = 192\\text{ g}$ $\\ce{Cu}$ va $28\\text{ g}$ $\\ce{N2}$ hosil bo'ladi, massa farqi $192 - 28 = 164\\text{ g}$. $49{,}2 / 164 = 0{,}3$ koeffitsiyent bo'yicha $n(\\ce{NH3}) = 2 \\cdot 0{,}3 = 0{,}6\\text{ mol}$, hajmi: $0{,}6 \\cdot 22{,}4 = 13{,}44\\text{ l}$.",
  },
  {
    id: "ms-2025-03-15-1-19",
    turi: "variant",
    mavzu: "Uglevodlar (glyukozani qaytarish va yondirish)",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Glyukoza $1 : 2$ mol nisbatda ikki qismga ajratildi. Birinchi qismi $60\\%$ unum bilan vodorod yordamida qaytarildi. Ikkinchi qismi to'liq yondirilganda $54\\text{ g}$ suv hosil bo'ldi. Qaytarilishdan hosil bo'lgan mahsulot massasini ($\\text{g}$) toping.",
    options: ["$109{,}2$", "$27{,}3$", "$182$", "$54{,}6$"],
    correct: 1,
    explanation:
      "$54\\text{ g}$ suv $= 3\\text{ mol}$. $\\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}$ bo'yicha ikkinchi qism $3 / 6 = 0{,}5\\text{ mol}$, birinchi qism esa $0{,}25\\text{ mol}$. $\\ce{C6H12O6 + H2 -> C6H14O6}$ (sorbitol, $M = 182\\text{ g/mol}$) reaksiyasida $60\\%$ unum bilan $0{,}25 \\cdot 0{,}6 = 0{,}15\\text{ mol}$, massasi $0{,}15 \\cdot 182 = 27{,}3\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-1-20",
    turi: "variant",
    mavzu: "Tuz eritmalari elektrolizi",
    soha: "Umumiy kimyo",
    daraja: "orta",
    question:
      "$200\\text{ g}$ $11{,}7\\%$ li $\\ce{NaCl}$ eritmasi elektroliz qilinganda elektrodlar sirtida jami $0{,}7\\text{ mol}$ gazlar ajralib chiqdi. Hosil bo'lgan kislorod massasini ($\\text{g}$) toping.",
    options: ["$1{,}6$", "$6{,}4$", "$3{,}2$", "$9{,}6$"],
    correct: 2,
    explanation:
      "Eritmada $200 \\cdot 0{,}117 / 58{,}5 = 0{,}4\\text{ mol}$ $\\ce{NaCl}$ bor. Avval tuz to'liq elektrolizlanadi: $\\ce{2NaCl + 2H2O -> 2NaOH + H2 ^ + Cl2 ^}$, bunda $0{,}2\\text{ mol }\\ce{H2} + 0{,}2\\text{ mol }\\ce{Cl2} = 0{,}4\\text{ mol}$ gaz chiqadi. Qolgan $0{,}7 - 0{,}4 = 0{,}3\\text{ mol}$ gaz suv elektrolizidan ($\\ce{2H2O -> 2H2 ^ + O2 ^}$, $2:1$ nisbat) hosil bo'ladi: $n(\\ce{O2}) = 0{,}1\\text{ mol}$, massasi $0{,}1 \\cdot 32 = 3{,}2\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-1-21",
    turi: "variant",
    mavzu: "Alkenlarni gidrogenlash va gibridlanish",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$1\\text{ mol}$ propilen qisman gidrogenlanganda sistemadagi $sp^3$-gibridlangan orbitallar soni $2{,}2$ marta ortdi. Propilenning gidrogenlanish darajasini ($\\%$) toping.",
    options: ["$60$", "$30$", "$20$", "$25$"],
    correct: 0,
    explanation:
      "$1\\text{ mol}$ propilenda $1\\text{ mol}$ $sp^3$ atom ($4\\text{ mol}$ $sp^3$ orbital), propanda esa $3\\text{ mol}$ $sp^3$ atom ($12\\text{ mol}$ orbital) mavjud. Gidrogenlanish darajasi $\\alpha$ bo'lsa: $(1 - \\alpha) \\cdot 4 + \\alpha \\cdot 12 = 4 + 8\\alpha = 2{,}2 \\cdot 4 = 8{,}8 \\Rightarrow 8\\alpha = 4{,}8 \\Rightarrow \\alpha = 0{,}6 = 60\\%$.",
  },
  {
    id: "ms-2025-03-15-1-22",
    turi: "variant",
    mavzu: "Alkanlarning yonish stexiometriyasi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "$0{,}2\\text{ mol}$ noma'lum alkan to'liq yondirilganda hosil bo'lgan mahsulotlar massa farqi $12\\text{ g}$ bo'lsa, alkanni aniqlang.",
    options: ["metan", "etan", "propan", "butan"],
    correct: 2,
    explanation:
      "$0{,}2\\text{ mol}$ $\\ce{C_n H_{2n+2}}$ yonganda $0{,}2n\\text{ mol}$ $\\ce{CO2}$ ($8{,}8n\\text{ g}$) va $0{,}2(n+1)\\text{ mol}$ $\\ce{H2O}$ ($3{,}6(n+1)\\text{ g}$) hosil bo'ladi. $8{,}8n - 3{,}6(n+1) = 12 \\Rightarrow 5{,}2n = 15{,}6 \\Rightarrow n = 3$ (propan).",
  },
  {
    id: "ms-2025-03-15-1-23",
    turi: "variant",
    mavzu: "Organik birikmalarning yonishida elektron almashinuvi",
    soha: "Organik kimyo",
    daraja: "orta",
    question: "$0{,}5\\text{ mol}$ kumol to'liq yonganda oksidlovchi qaytaruvchidan nechta ($N_A$) elektron oladi?",
    options: ["$48$", "$24$", "$36$", "$18$"],
    correct: 1,
    explanation:
      "Kumol ($\\ce{C9H12}$) yonishi: $\\ce{C9H12 + 12O2 -> 9CO2 + 6H2O}$. Har $1\\text{ mol}$ $\\ce{O2}$ molekulasi $4\\text{ mol}$ elektron biriktiradi ($\\ce{O2 + 4e- -> 2O^{2-}}$). $0{,}5\\text{ mol}$ kumol uchun $6\\text{ mol}$ $\\ce{O2}$ sarflanadi, demak oksidlovchi $6 \\cdot 4 = 24\\cdot N_A$ elektron oladi.",
  },
  {
    id: "ms-2025-03-15-1-24",
    turi: "variant",
    mavzu: "Izomer kislorodli birikmalar tuzilishini aniqlash",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "$E$ va $F$ birikmalarning umumiy formulasi $\\ce{C4H8O2}$. $E$ ning ishqoriy gidrolizida $G$ va $H$ organik moddalar olindi. $G$ qattiq ishqor bilan qizdirilganda metan chiqdi, $H$ esa $\\ce{Na}$ bilan vodorod ajratdi. $F$ «kumush ko'zgu» reaksiyasiga kirishib hosil qilgan $I$ modda ham spirtlar, ham kislotalar bilan murakkab efir beradi. $E$ va $F$ qaysilar?\n" +
      "$1)$ $\\ce{CH3CH2COOCH3}$; $2)$ $\\ce{CH3COOCH2CH3}$; $3)$ $\\ce{CH3COOCH(CH3)CH3}$;\n" +
      "$4)$ $\\ce{CH3CH(OH)CH2CHO}$; $5)$ $\\ce{CH3C(O)CH2CH2OH}$; $6)$ $\\ce{CH3C(CH3)(OH)CH2CHO}$.",
    options: [
      "$E = 2, 3$ va $F = 4, 6$",
      "$E = 2$ va $F = 4$",
      "$E = 1, 4$ va $F = 5, 6$",
      "$E = 4$ va $F = 6$",
    ],
    correct: 1,
    explanation:
      "$G$ ishqor bilan metan bergani uchun $G$ — natriy atsetat ($\\ce{CH3COONa}$), demak $E$ ($\\ce{C4H8O2}$) etil atsetat ($2$, bunda $H = \\ce{C2H5OH}$). $F$ ($\\ce{C4H8O2}$) $-\\ce{CHO}$ va $-\\ce{OH}$ guruhli aldegidospirt bo'lishi kerak ($I$ oksikislota bo'ladi): bu $4$ ($3$-gidroksibutanal, $4$ ta uglerodli). ($3$ va $6$-moddalar $5$ ta uglerodga ega).",
  },
  {
    id: "ms-2025-03-15-1-25",
    turi: "variant",
    mavzu: "Peptidlar gidrolizi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$30$ ta glitsin va $20$ ta alanin aminokislota qoldig'idan tashkil topgan $1574\\text{ g}$ polipeptid to'liq gidrolizlanishi uchun necha mol suv sarflanadi?",
    options: ["$50$", "$49$", "$25$", "$24{,}5$"],
    correct: 3,
    explanation:
      "Jami $50$ ta aminokislotadan peptid hosil bo'lganda $49$ ta peptid bog'i yuzaga kelib, $49\\text{ mol}$ $\\ce{H2O}$ ajraladi. $M(\\text{peptid}) = 30 \\cdot 75 + 20 \\cdot 89 - 49 \\cdot 18 = 4030 - 882 = 3148\\text{ g/mol}$. Peptid moli: $1574 / 3148 = 0{,}5\\text{ mol}$. Gidroliz uchun suv: $0{,}5 \\cdot 49 = 24{,}5\\text{ mol}$.",
  },
  {
    id: "ms-2025-03-15-1-26",
    turi: "variant",
    mavzu: "Organik moddalar izomeriyasi va gomologiyasi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Quyidagi qatorlarning qaysi birida barcha ma'lumotlar to'g'ri keltirilgan?\n" +
      "$1)$ Modda: buten $|$ Izomeri: penten $|$ Gomologi: geksen $|$ Xossasi: polimerlanadi\n" +
      "$2)$ Modda: etanol $|$ Izomeri: dimetil efir $|$ Gomologi: pentanol $|$ Xossasi: polimerlanadi\n" +
      "$3)$ Modda: ksilol $|$ Izomeri: etilbenzol $|$ Gomologi: propilbenzol $|$ Xossasi: polimerlanmaydi\n" +
      "$4)$ Modda: $2$-nitropropan $|$ Izomeri: glitsin $|$ Gomologi: nitrometan $|$ Xossasi: polimerlanmaydi",
    options: ["$1$", "$2$", "$3$", "$4$"],
    correct: 2,
    explanation:
      "$1$-qatorda buten ($\\ce{C4H8}$) va penten ($\\ce{C5H10}$) izomer emas. $2$-qatorda etanol polimerlanmaydi. $4$-qatorda glitsin ($\\ce{C2H5NO2}$) $2$-nitropropan ($\\ce{C3H7NO2}$) bilan izomer emas. $3$-qatorda ksilol va etilbenzol ($\\ce{C8H10}$) izomer, propilbenzol ($\\ce{C9H12}$) ularning gomologi va polimerlanmaydi.",
  },
  {
    id: "ms-2025-03-15-1-27",
    turi: "variant",
    mavzu: "Uglevodorodlar aralashmasi stexiometriyasi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "$4 : 2 : 3$ mol nisbatdagi propilen, etin va propadiendan iborat aralashma massasi $102\\text{ g}$ bo'lsa, alkinning massasini ($\\text{g}$) toping.",
    options: ["$7{,}2$", "$13$", "$15{,}6$", "$20{,}8$"],
    correct: 2,
    explanation:
      "Molyar massalar: propilen $42$, etin $26$, propadien $40\\text{ g/mol}$. $k(4 \\cdot 42 + 2 \\cdot 26 + 3 \\cdot 40) = k(168 + 52 + 120) = 340k = 102 \\Rightarrow k = 0{,}3\\text{ mol}$. Alkin (etin) massasi: $2 \\cdot 0{,}3 \\cdot 26 = 15{,}6\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-1-28",
    turi: "variant",
    mavzu: "Amin va alkan aralashmasining atom nisbatlari",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "$1\\text{ mol}$ metilaminga ma'lum miqdorda noma'lum alkan qo'shilganda sistemadagi $\\ce{C}$ atomlari soni $4$ marta, $\\ce{H}$ atomlari soni esa $3{,}4$ marta ortdi. Noma'lum alkanni toping.",
    options: ["metan", "propan", "$2$-metilbutan", "$2,2$-dimetilpropan"],
    correct: 0,
    explanation:
      "$1\\text{ mol}$ $\\ce{CH3NH2}$ da $1\\text{ mol C}$ va $5\\text{ mol H}$ bor. $x\\text{ mol}$ $\\ce{C_n H_{2n+2}}$ qo'shilganda: $1 + xn = 4$ ($xn = 3$) va $5 + x(2n + 2) = 3{,}4 \\cdot 5 = 17$ ($2xn + 2x = 12$). $6 + 2x = 12 \\Rightarrow x = 3\\text{ mol}$, demak $n = 3/3 = 1$ — metan.",
  },
  {
    id: "ms-2025-03-15-1-29",
    turi: "variant",
    mavzu: "Biuret reaksiyasi va peptidlarning rangi",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Oqsillarga xos sifat reaksiyalardan biri biuret reaksiyasi hisoblanadi. Quyidagilardan to'g'ri javobni tanlang.",
    options: [
      "dipeptid — ko'k, tripeptid — binafsha, yuqori peptid — qizil rang beradi",
      "tripeptid — ko'k, dipeptid — binafsha, yuqori peptid — qizil rang beradi",
      "yuqori peptid — ko'k, tripeptid — binafsha, dipeptid — qizil rang beradi",
      "dipeptid — ko'k, yuqori peptid — binafsha, tripeptid — qizil rang beradi",
    ],
    correct: 0,
    explanation:
      "Ishqoriy muhitda $\\ce{Cu^{2+}}$ ionlari bilan bitta peptid bog'li dipeptid ko'k, ikkita peptid bog'li tripeptid binafsha, undan uzun zanjirli yuqori peptidlar esa qizil rangli kompleks birikmalar hosil qiladi.",
  },
  {
    id: "ms-2025-03-15-1-30",
    turi: "variant",
    mavzu: "Alken va alkan aralashmasining oksidlanishi",
    soha: "Organik kimyo",
    daraja: "oson",
    question:
      "Etan va etendan iborat $89{,}6\\text{ l}$ (n.sh.) gazlar aralashmasiga $\\ce{KMnO4}$ ning suvli eritmasi ta'sir ettirilganda $62\\text{ g}$ etilenglikol olindi. Dastlabki aralashmadagi etanning mol ulushini aniqlang.",
    options: ["$0{,}5$", "$0{,}8$", "$0{,}25$", "$0{,}75$"],
    correct: 3,
    explanation:
      "Jami aralashma $89{,}6 / 22{,}4 = 4\\text{ mol}$. Etilenglikol ($\\ce{C2H4(OH)2}$, $M = 62\\text{ g/mol}$) $62 / 62 = 1\\text{ mol}$, demak eten ham $1\\text{ mol}$. Etan $4 - 1 = 3\\text{ mol}$, mol ulushi $3 / 4 = 0{,}75$.",
  },
  {
    id: "ms-2025-03-15-1-31",
    turi: "variant",
    mavzu: "Anorganik ionlarning sifat reaksiyalari",
    soha: "Anorganik kimyo",
    daraja: "oson",
    question: "$\\ce{Pb(NO3)2}$ eritmasiga tarkibida $\\ce{Na2S}$ saqlagan eritma qo'shilganda hosil bo'ladigan cho'kmaning rangi qanday?",
    options: ["oq", "qora", "yashil", "qizil"],
    correct: 1,
    explanation:
      "$\\ce{Pb(NO3)2 + Na2S -> PbS v + 2NaNO3}$. Qo'rg'oshin(II)-sulfid ($\\ce{PbS}$) suvda erimaydigan qora rangli cho'kmadir.",
  },
  {
    id: "ms-2025-03-15-1-32",
    turi: "variant",
    mavzu: "Monosaxaridlar xossalari (glyukoza va fruktoza)",
    soha: "Organik kimyo",
    daraja: "orta",
    question:
      "Glyukoza va fruktoza uchun umumiy bo'lgan ma'lumotlarni tanlang:\n" +
      "$1)$ disaxaridlar guruhiga kiradi;\n" +
      "$2)$ polimerlanish reaksiyasiga kirishadi;\n" +
      "$3)$ suvda yaxshi eriydigan shirin ta'mli moddalar;\n" +
      "$4)$ qaytarilganda $6$ atomli spirt hosil qiladi;\n" +
      "$5)$ gidrolizlanmaydi;\n" +
      "$6)$ tarkibida aldegid guruh tutadi.",
    options: ["$3, 4, 5$", "$1, 2, 6$", "$2, 3, 5$", "$3, 4, 6$"],
    correct: 0,
    explanation:
      "Glyukoza ham, fruktoza ham $\\ce{C6H12O6}$ tarkibli geksoza monosaxaridlar bo'lib, suvda yaxshi eriydi ($3$), vodorod bilan qaytarilganda olti atomli spirt — sorbitol beradi ($4$) va oddiy qandlar bo'lgani uchun gidrolizlanmaydi ($5$). Fruktoza ketoza bo'lib, aldegid guruh tutmaydi.",
  },
  {
    id: "ms-2025-03-15-1-33",
    turi: "moslashtirish",
    mavzu: "Gaz va suvning metallar bilan reaksiyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "33. $0{,}04\\text{ mol}$ $B$ modda bilan necha gramm bariy reaksiyaga kirishadi?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "C",
    explanation:
      "$\\ce{(NH4)2SO4 + 2NaNO2 ->[t] Na2SO4 + 2N2 ^ + 4H2O}$. Havoda eng ko'p uchraydigan $A = \\ce{N2}$, etan yonishida hosil bo'ladigan $B = \\ce{H2O}$ va tuz $D = \\ce{Na2SO4}$. $\\ce{Ba + 2H2O -> Ba(OH)2 + H2 ^}$ reaksiyasidan $0{,}04\\text{ mol}$ suv $0{,}02\\text{ mol}$ $\\ce{Ba}$ ($0{,}02 \\cdot 137 = 2{,}74\\text{ g}$) bilan ta'sirlashadi (C).",
  },
  {
    id: "ms-2025-03-15-1-34",
    turi: "moslashtirish",
    mavzu: "Azotning magniy bilan reaksiyasi",
    soha: "Anorganik kimyo",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "34. $784\\text{ ml}$ (n.sh.) $A$ modda bilan necha gramm magniy reaksiyaga kirishadi?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "E",
    explanation:
      "$A = \\ce{N2}$, $n(\\ce{N2}) = 0{,}784 / 22{,}4 = 0{,}035\\text{ mol}$. $\\ce{3Mg + N2 ->[t] Mg3N2}$ tenglamasiga ko'ra $n(\\ce{Mg}) = 3 \\cdot 0{,}035 = 0{,}105\\text{ mol}$. Massasi: $0{,}105 \\cdot 24 = 2{,}52\\text{ g}$ (E).",
  },
  {
    id: "ms-2025-03-15-1-35",
    turi: "moslashtirish",
    mavzu: "Tuzlar tarkibidagi atomlar soni va stexiometriya",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "orta",
    kontekstMatn: MOSLASHTIRISH_KONTEKST_33_35,
    question: "35. $D$ moddaning tarkibida $0{,}14\\cdot N_A$ ta atom bo'lsa, uni olish uchun necha gramm ammoniy sulfat kerak?",
    options: ["A", "B", "C", "D", "E", "F"],
    optionLabels: MOSLASHTIRISH_VARIANTLAR_33_35,
    correct: "D",
    explanation:
      "$D = \\ce{Na2SO4}$ ning bir formula birligida $7$ ta atom bor. Demak $n(\\ce{Na2SO4}) = 0{,}14 / 7 = 0{,}02\\text{ mol}$. Buning uchun $0{,}02\\text{ mol}$ $\\ce{(NH4)2SO4}$ ($M = 132\\text{ g/mol}$) kerak: $0{,}02 \\cdot 132 = 2{,}64\\text{ g}$ (D).",
  },
  {
    id: "ms-2025-03-15-1-36",
    turi: "ochiq",
    mavzu: "Piritning nitrat kislotada erishi va eritma tarkibi",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "Temir disulfidi ($\\ce{FeS2}$) mo'l miqdordagi nitrat kislota eritmasida to'liq eritilganda molyar massasi $30\\text{ g/mol}$ bo'lgan $0{,}15\\text{ mol}$ gaz ajralib chiqdi va $69{,}1\\text{ g}$ eritma olindi. Hosil bo'lgan eritmada nitrat kislotaning massa ulushi sulfat kislota massa ulushidan $3$ marta katta bo'lsa, olingan eritmadagi suvning massasini ($\\text{g}$) toping.",
    correct: "38.32",
    tolerance: 0.1,
    birlik: "g",
    explanation:
      "$M = 30\\text{ g/mol}$ gaz — $\\ce{NO}$. Reaksiya: $\\ce{FeS2 + 8HNO3 -> Fe(NO3)3 + 2H2SO4 + 5NO ^ + 2H2O}$. $0{,}15\\text{ mol}$ $\\ce{NO}$ dan kelib chiqib $n(\\ce{FeS2}) = 0{,}03\\text{ mol}$, demak eritmada $0{,}03\\text{ mol}$ $\\ce{Fe(NO3)3}$ ($0{,}03 \\cdot 242 = 7{,}26\\text{ g}$), $0{,}06\\text{ mol}$ $\\ce{H2SO4}$ ($0{,}06 \\cdot 98 = 5{,}88\\text{ g}$) va ortib qolgan $3 \\cdot 5{,}88 = 17{,}64\\text{ g}$ $\\ce{HNO3}$ mavjud. Suv massasi: $69{,}1 - (7{,}26 + 5{,}88 + 17{,}64) = 38{,}32\\text{ g}$.",
  },
  {
    id: "ms-2025-03-15-1-37",
    turi: "ochiq",
    mavzu: "Plastinka usuli va aldegidlarning kumush ko'zgu reaksiyasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "qiyin",
    question:
      "Kumush nitrat eritmasiga $3{,}6\\text{ g}$ temir plastinkasi botirildi (reaksiyada $\\ce{Fe(NO3)2}$ hosil bo'lgan). Plastinka massasi $10\\text{ g}$ ga yetganda jarayon to'xtatildi. Ushbu jarayonda ajralib chiqqan barcha kumushni $3{,}44\\text{ g}$ to'yingan aldegidga $\\ce{Ag2O}$ ning ammiakli eritmasini ta'sir ettirib ham olish mumkin bo'lsa, aldegidning molyar massasini ($\\text{g/mol}$) toping.",
    correct: "86",
    tolerance: 0.5,
    birlik: "g/mol",
    explanation:
      "$\\ce{Fe + 2AgNO3 -> Fe(NO3)2 + 2Ag}$. $1\\text{ mol}$ temir erib $2\\text{ mol}$ kumush o'tirganda plastinka $216 - 56 = 160\\text{ g}$ ga og'irlashadi. Massa ortishi $10 - 3{,}6 = 6{,}4\\text{ g}$, demak $n(\\ce{Fe}) = 6{,}4/160 = 0{,}04\\text{ mol}$, $n(\\ce{Ag}) = 0{,}08\\text{ mol}$. Aldegid bilan $\\ce{R-CHO -> 2Ag}$ ($1:2$), ya'ni $0{,}04\\text{ mol}$ aldegid sarflangan: $M = 3{,}44 / 0{,}04 = 86\\text{ g/mol}$ ($\\ce{C5H10O}$).",
  },
  {
    id: "ms-2025-03-15-1-38",
    turi: "ochiq",
    mavzu: "Tuzlarning termik parchalanishi va oksidlanish-qaytarilish",
    soha: "Anorganik kimyo",
    daraja: "qiyin",
    question:
      "Kaliy nitrat va kaliy xlorat aralashmasi katalizator ishtirokida to'liq parchalanganda $11{,}2\\text{ g}$ gaz ajralib chiqdi va hosil bo'lgan qattiq qoldiqda kaliyning massa ulushi $50\\%$ ni tashkil etdi. Qoldiqdagi kislorodsiz tuz kislotali muhitda $\\ce{KMnO4}$ eritmasi bilan to'liq oksidlanganda necha mol kaliy sulfat hosil bo'ladi?",
    correct: "0.12",
    tolerance: 0.01,
    birlik: "mol",
    explanation:
      "Qoldiq $\\ce{KCl}$ ($x\\text{ mol}$, $M=74{,}5$) va $\\ce{KNO2}$ ($y\\text{ mol}$, $M=85$) dan iborat. $\\frac{39(x + y)}{74{,}5x + 85y} = 0{,}5 \\Rightarrow 78x + 78y = 74{,}5x + 85y \\Rightarrow x = 2y$. Ajralgan $\\ce{O2}$: $1{,}5x + 0{,}5y = 3{,}5y = 11{,}2/32 = 0{,}35\\text{ mol} \\Rightarrow y = 0{,}1$, $x = 0{,}2\\text{ mol}$ $\\ce{KCl}$. Oksidlanish: $\\ce{10KCl + 2KMnO4 + 8H2SO4 -> 5Cl2 + 6K2SO4 + 2MnSO4 + 8H2O}$. $n(\\ce{K2SO4}) = 0{,}2 \\cdot \\frac{6}{10} = 0{,}12\\text{ mol}$.",
  },
  {
    id: "ms-2025-03-15-1-39",
    turi: "ochiq",
    mavzu: "Alkenlarni oksidlash va eritma molyar konsentratsiyasi",
    soha: "Kimyoviy tahlil va hisoblashlar",
    daraja: "oson",
    question:
      "$0{,}6\\text{ mol}$ eten $\\ce{KMnO4}$ ning neytral suvli eritmasi bilan to'liq $\\ce{C2H4(OH)2}$ gacha oksidlandi. Agar kaliy permanganat eritmasi hajmi $1{,}6\\text{ litr}$ bo'lsa, $\\ce{KMnO4}$ eritmasining molyar konsentratsiyasini ($\\text{mol/l}$) toping.",
    correct: "0.25",
    tolerance: 0.01,
    birlik: "mol/l",
    explanation:
      "$\\ce{3C2H4 + 2KMnO4 + 4H2O -> 3C2H4(OH)2 + 2MnO2 + 2KOH}$. $0{,}6\\text{ mol}$ etenni oksidlash uchun $0{,}6 \\cdot \\frac{2}{3} = 0{,}4\\text{ mol}$ $\\ce{KMnO4}$ sarflanadi. Molyar konsentratsiyasi: $C_M = 0{,}4 / 1{,}6 = 0{,}25\\text{ mol/l}$.",
  },
  {
    id: "ms-2025-03-15-1-40",
    turi: "ochiq",
    mavzu: "Gazlar aralashmasida alkan yonishi va gibridlanish",
    soha: "Organik kimyo",
    daraja: "qiyin",
    question:
      "Hajmiy nisbatlari $1 : 7 : 2$ bo'lgan alkan, kislorod va azot gazlari aralashmasi portlatildi va suv bug'lari to'liq kondensatlandi. Qolgan gazlar aralashmasi tarkibida ikkita oddiy va bitta murakkab gaz bo'lib, uning neonga nisbatan zichligi $1{,}8$ ga teng bo'lsa, dastlabki alkan molekulasidagi $sp^3$-gibridlangan orbitallar sonini toping.",
    correct: "12",
    tolerance: 0.5,
    birlik: "ta",
    explanation:
      "$1\\text{ mol}$ $\\ce{C_n H_{2n+2}}$, $7\\text{ mol}$ $\\ce{O2}$ va $2\\text{ mol}$ $\\ce{N2}$ olingan. Suv kondensatlangach $\\ce{CO2}$ ($n\\text{ mol}$), $\\ce{N2}$ ($2\\text{ mol}$) va ortgan $\\ce{O2}$ ($7 - (1{,}5n + 0{,}5) = 6{,}5 - 1{,}5n\\text{ mol}$) qoladi. $M_{\\text{o'rt}} = 1{,}8 \\cdot 20 = 36\\text{ g/mol}$. $\\frac{44n + 56 + 32(6{,}5 - 1{,}5n)}{n + 2 + 6{,}5 - 1{,}5n} = 36 \\Rightarrow \\frac{264 - 4n}{8{,}5 - 0{,}5n} = 36 \\Rightarrow 14n = 42 \\Rightarrow n = 3$ (propan, $\\ce{C3H8}$). Unda $3 \\cdot 4 = 12$ ta $sp^3$ orbital mavjud.",
  },
]

export default savollar
