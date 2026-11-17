// data/oyinlar/kalloid-kimyo-amaliy.js
//
// "Kalloid Kimyo amaliy" mavsumiy ochiq dars testi uchun 40 ta savol bazasi.
// Manba: KK_M1 – KK_M5 ma'ruza slaydlari (har bir moduldan 8 tadan yirik savol).
// Muhim: har bir savolda `togriIndeks` bazaviy 0..3 indeksni bildiradi;
// talaba testni boshlaganda server 20 ta savolni va A/B/C/D variantlarni
// tasodifiy tartibda aralashtirib beradi. Barcha formulalar KaTeX `$...$` bilan yozilgan.

export const KALLOID_MODULLAR = Object.freeze({
  M1: '1-ma’ruza: Kolloid kimyoga kirish',
  M2: '2-ma’ruza: Dispers sistemalar tasnifi va olinishi',
  M3: '3-ma’ruza: Sirt hodisalari va sirt energiyasi',
  M4: '4-ma’ruza: Adsorbsiya jarayonlari va izotermalar',
  M5: '5-ma’ruza: Kolloid eritmalar va liofob zollar',
})

export const KALLOID_SAVOLLAR = Object.freeze([
  // ─── 1-MA'RUZA (KK_M1): 8 ta savol ─────────────────────────────────────────
  {
    id: 'kk-01',
    modul: 'M1',
    matn: 'Tomoni $a$ bo‘lgan bitta kubik zarracha har bir qirrasidan $3$ teng bo‘lakka bo‘linib, $27$ ta bir xil kichik kubga maydalansa, sistemaning umumiy sirt yuzasi qanday o‘zgaradi?',
    variantlar: [
      'Umumiy sirt yuzasi $3$ marta ortadi ($6a^2 \\to 18a^2$)',
      'Umumiy sirt yuzasi $9$ marta ortadi ($6a^2 \\to 54a^2$)',
      'Umumiy sirt yuzasi $27$ marta ortadi ($6a^2 \\to 162a^2$)',
      'Umumiy sirt yuzasi $3$ marta kamayadi ($6a^2 \\to 2a^2$)',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-02',
    modul: 'M1',
    matn: 'Sirt erkin energiyasi tenglamasi $G_s = \\sigma \\cdot S$ ga ko‘ra, maydalanish natijasida solishtirma sirt $S$ keskin ortganda dispers sistema qanday termodinamik xususiyatga ega bo‘ladi?',
    variantlar: [
      'Sirt erkin energiyasi ortadi va sistema sirtni kamaytirish uchun agregatlanishga moyil bo‘ladi',
      'Sirt erkin energiyasi nolga tenglashib, sistema o‘z-o‘zidan cheksiz barqaror holatga o‘tadi',
      'Sirt tarangligi $\\sigma$ zarracha o‘lchamiga teskari ravishda nolga tushib ketadi',
      'Sistema entropiyasi keskin pasayib, modda bir jinsli molekulyar kristallga aylanadi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-03',
    modul: 'M1',
    matn: 'Klassik kolloid sistemani ($1\\text{--}100\\text{ nm}$) chin eritmadan ($< 1\\text{ nm}$) optik usulda ishonchli farqlash imkonini beruvchi asosiy belgi qaysi?',
    variantlar: [
      'Yon tomondan yuborilgan yorug‘lik nurining sochilishi — Tindal konusi hosil bo‘lishi',
      'Oddiy qog‘oz filtrdan mutlaqo o‘tmasdan idish tubida soniyalar ichida cho‘kishi',
      'Moddaning dispersion muhitda alohida ionlar holida kristall panjara shaklida erishi',
      'Zarrachalarning oddiy yorug‘lik mikroskopida aniq geometrik qirralar bilan ko‘rinishi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-04',
    modul: 'M1',
    matn: '1861-yilda Tomas Grem «kolloid» va «kristalloid» tushunchalarini kiritishda qaysi tajribaviy farqni asos qilib olgan va uning asosida qaysi tozalash usulini yaratgan?',
    variantlar: [
      'Yarim o‘tkazuvchan pergament membranadan o‘tish tezligi farqiga ko‘ra — dializ usulini',
      'Yuqori kuchlanishli elektr yoyida bug‘latish tezligiga ko‘ra — Bredig usulini',
      'Kapillyar naychalardagi ko‘tarilish balandligiga ko‘ra — sirt tarangligi usulini',
      'Markazdan qochma kuch ostida cho‘kish tezligiga ko‘ra — ultratsentrifugalash usulini',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-05',
    modul: 'M1',
    matn: 'Eynshteyn–Smoluxovskiy munosabati $D = \\mu k_B T$ va Braun harakati qonuniyatiga ko‘ra, kolloid zarrachalarning tartibsiz issiqlik harakati hamda diffuziyasi qaysi holda kuchayadi?',
    variantlar: [
      'Mutlaq harorat $T$ ortib, zarracha o‘lchami hamda muhit qovushqoqligi kamayganda',
      'Zarracha o‘lchami va dispers faza zichligi bir necha barobar oshirilganda',
      'Muhit harorati mutlaq nolga ($T \\to 0\\text{ K}$) yaqinlashtirilganda',
      'Dispersion muhit qovushqoqligi keskin oshirilib, eritma sovitilganda',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-06',
    modul: 'M1',
    matn: '1896-yilda Vilgelm Ostvald tavsiflagan «Ostvald pishishi» hodisasining fizik-kimyoviy mohiyati nimadan iborat?',
    variantlar: [
      'Mayda zarrachalar sirt energiyasi yuqoriligi sababli erib, yirik zarrachalar sirtiga qayta cho‘kadi',
      'Yirik zarrachalar elektrolit qo‘shilganda mayda zarrachalarga parchalanib, zol hosil qiladi',
      'Qizdirish natijasida barcha zarrachalar bir xil radiusli ideal monodispers holatga o‘tadi',
      'Zol tarkibidagi dispersion muhit bug‘lanib, kserogel strukturasi shakllanadi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-07',
    modul: 'M1',
    matn: 'DLVO nazariyasiga ($V = V_R + V_A$) ko‘ra, elektrolit konsentratsiyasi oshirilganda kolloid sistema nega koagulyatsiyalanadi?',
    variantlar: [
      'Qo‘sh elektr qavat siqilib itarilish $V_R$ kamayadi, energetik to‘siq pasayadi va van-der-Vaals tortishishi ($V_A$) ustun keladi',
      'Zarrachalar orasidagi van-der-Vaals tortishish energiyasi $V_A$ nolga tushib, energetik to‘siq cheksiz ortadi',
      'Solvat qavati qalinlashib, zarrachalar $\\zeta$-potensiali musbat ishoraga keskin ko‘tariladi',
      'Zarrachalar ikkilamchi minimumdan chiqib, cheksiz masofaga itarilib tarqaladi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-08',
    modul: 'M1',
    matn: 'Tashqi elektr maydonida kuzatiladigan elektroforez va elektroosmos hodisalari bir-biridan nimasi bilan farqlanadi?',
    variantlar: [
      'Elektroforezda zaryadlangan zarrachalar harakatlanadi, elektroosmosda esa qo‘zg‘almas g‘ovak muhit orqali suyuqlik oqadi',
      'Elektroforez faqat gaz muhitida kechadi, elektroosmos esa faqat qattiq aerozollarda kuzatiladi',
      'Elektroforez zarrachalar zaryadiga bog‘liq emas, elektroosmos esa faqat neytral molekulalarni ko‘chiradi',
      'Ikkala jarayon ham tashqi elektr maydonsiz, faqat og‘irlik kuchi hisobiga yuz beradi',
    ],
    togriIndeks: 0,
  },

  // ─── 2-MA'RUZA (KK_M2): 8 ta savol ─────────────────────────────────────────
  {
    id: 'kk-09',
    modul: 'M2',
    matn: 'Disperslik darajasi $D = \\frac{1}{d}$ formulasi bo‘yicha zarracha diametri $d = 2\\cdot 10^{-8}\\text{ m}$ ($20\\text{ nm}$) bo‘lgan kolloid zarrachaning disperslik darajasini toping.',
    variantlar: [
      '$D = 5\\cdot 10^{7}\\text{ m}^{-1}$',
      '$D = 2\\cdot 10^{8}\\text{ m}^{-1}$',
      '$D = 5\\cdot 10^{-7}\\text{ m}^{-1}$',
      '$D = 2\\cdot 10^{-8}\\text{ m}^{-1}$',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-10',
    modul: 'M2',
    matn: 'Fazalarning agregat holatiga ko‘ra tasnifda dispers fazasi suyuq tomchilar, dispersion muhiti esa gaz bo‘lgan sistema qaysi guruhga kiradi?',
    variantlar: [
      'Suyuq aerozol — tuman, bulut yoki purkagich tomchilari',
      'Qattiq aerozol — sanoat tutuni va havodagi chang',
      'Suyuq ko‘pik — sovun ko‘pigi va flotatsion pufakchalar',
      'Emulsiya — sut yoki qaymoq kabi tizimlar',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-11',
    modul: 'M2',
    matn: 'Emulgatorlar moy va suvdan tashkil topgan emulsiyalarning barqarorligini oshirishda qanday mexanizm orqali ta’sir ko‘rsatadi?',
    variantlar: [
      'Fazalararo sirt tarangligini pasaytirib, tomchilar sirtida adsorbsion himoya qavati hosil qiladi va koalessensiyani sekinlashtiradi',
      'Tomchilar sirtidagi himoya qavatini eritib, moy hamda suv qavatlarining tezroq ajralishini ta’minlaydi',
      'Moy va suv molekulalarini kovalent bog‘lab, termodinamik jihatdan bitta haqiqiy chin eritma hosil qiladi',
      'Dispersion muhitning kimyoviy tabiatini o‘zgartirmasdan faqat tomchilarning zichligini oshiradi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-12',
    modul: 'M2',
    matn: 'Gel tarkibidagi suyuq dispersion muhit quritish yo‘li bilan chiqarilganda hosil bo‘ladigan tuzilma nima deyiladi va gelning mexanik ta’sirda suyuqlanib, tinch holatda qayta qotishi qanday nomlanadi?',
    variantlar: [
      'Kserogel; bu hodisa tiksotropiya deb ataladi',
      'Organozol; bu hodisa koalessensiya deb ataladi',
      'Aerozol; bu hodisa sedimentatsiya deb ataladi',
      'Suspenziya; bu hodisa elektroosmos deb ataladi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-13',
    modul: 'M2',
    matn: 'Liofil va liofob kolloid sistemalarni o‘zaro taqqoslaganda qaysi fikr to‘g‘ri?',
    variantlar: [
      'Liofil sistemalar muhit bilan kuchli solvatlanadi va qaytar barqaror; liofob sistemalar zaif ta’sirlashadi va zaryad/stabilizator hisobiga barqaror turadi',
      'Liofob sistemalar o‘z-o‘zidan erib hosil bo‘ladi va elektrolitlarga mutlaqo chidamli bo‘ladi',
      'Liofil sistemalar faqat elektr yoy usulida olinadi va quritilgandan so‘ng erituvchida qayta erimaydi',
      'Liofil zollarda sirt energiyasi liofob zollarnikidan keskin katta bo‘lib, doimo koagulyatsiyalanadi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-14',
    modul: 'M2',
    matn: 'Yangi hosil qilingan $\\text{Fe(OH)}_3$ cho‘kmasiga oz miqdorda $\\text{FeCl}_3$ eritmasi qo‘shib chayqatilganda qizil-qo‘ng‘ir zolga aylanishi qaysi jarayonga kiradi?',
    variantlar: [
      'Peptizatsiya — peptizator ionlari cho‘kma zarrachalariga adsorbsiyalanib, bir xil zaryad berishi natijasida qayta disperslanishi',
      'Koagulyatsiya — kolloid zarrachalarning yirik agregatlarga birikib, cho‘kmaga tushishi',
      'Fizik kondensatsiya — to‘yingan bug‘ning sovib suyuq tomchilarga aylanishi',
      'Ultrafiltratsiya — membrana teshiklari orqali erituvchini bosim ostida haydash',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-15',
    modul: 'M2',
    matn: 'Kimyoviy kondensatsiya (gidroliz) yo‘li bilan $\\text{FeCl}_3 + 3\\text{H}_2\\text{O} \\to \\text{Fe(OH)}_3\\downarrow + 3\\text{HCl}$ reaksiyasidan barqaror zol olishda nima uchun suyultirilgan eritma va qizdirish ishlatiladi?',
    variantlar: [
      'Qizdirish gidroliz va yadrolanishni tezlashtiradi, suyultirish esa zarrachalarning yirik cho‘kmaga o‘sib ketishini cheklaydi',
      'Suyultirish gidroliz muvozanatini chapga surib, eritmani molekulyar chin eritma holida saqlaydi',
      'Qizdirish hosil bo‘lgan $\\text{HCl}$ ni cho‘kma ichiga kiritib, yirik kristallar o‘stiradi',
      'Bu sharoitlar zarrachalar sirtidagi zaryadni to‘liq neytrallab, zolni darhol cho‘ktiradi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-16',
    modul: 'M2',
    matn: 'Kolloid zollarni past molekulyar elektrolitlardan tozalashda elektrodializ usulining oddiy dializdan asosiy afzalligi nimada?',
    variantlar: [
      'Tashqi elektr maydoni qo‘llash orqali elektrolit ionlarining yarim o‘tkazuvchan membranadan chiqish tezligini keskin oshiradi',
      'Kolloid zarrachalarning o‘zini membranadan o‘tkazib, eritmani qattiq fazadan tozalaydi',
      'Hech qanday parda ishlatmasdan faqat markazdan qochma tezlanish yordamida ajratadi',
      'Elektrolit ionlarini qattiq zol yadrolari bilan kovalent biriktirib neytrallaydi',
    ],
    togriIndeks: 0,
  },

  // ─── 3-MA'RUZA (KK_M3): 8 ta savol ─────────────────────────────────────────
  {
    id: 'kk-17',
    modul: 'M3',
    matn: 'Nima sababdan suyuqlikning sirt qatlamidagi molekula hajmiy fazadagi molekulaga nisbatan ortiqcha potensial energiyaga (sirt erkin energiyasiga) ega bo‘ladi?',
    variantlar: [
      'Sirt molekulasi yuqoridan qo‘shni molekulalar bilan to‘liq o‘ralmaganligi uchun tortishish kuchlari muvozanatlanmagan va natijaviy kuch ichkariga yo‘nalgan',
      'Sirt qatlamidagi molekulalar issiqlik harakatida ishtirok etmay, hajmiy molekulalarga qaraganda kamroq energiyaga ega bo‘ladi',
      'Gaz fazasi molekulalari suyuqlik sirtidagi molekulalarni yuqoriga juda kuchli tortib turadi',
      'Sirt qatlamida molekulyar tortishish kuchlari yo‘qolib, molekulalar ionlarga parchalanadi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-18',
    modul: 'M3',
    matn: 'Sirt tarangligi $\\sigma$ ning termodinamik ta’rifi, o‘lchov birliklari ekvivalentligi va harorat ortganda o‘zgarishi qaysi qatorda to‘g‘ri berilgan?',
    variantlar: [
      '$\\sigma = \\left(\\frac{\\partial G^s}{\\partial S}\\right)_{T,p,n}$, $1\\text{ N/m} = 1\\text{ J/m}^2$; harorat ortganda $\\sigma$ kamayadi va kritik haroratda ($T \\to T_k$) nolga intiladi',
      '$\\sigma = G^s \\cdot S$, $1\\text{ J}\\cdot\\text{m}^2$; harorat ko‘tarilganda sirt tarangligi eksponensial ravishda ortadi',
      '$\\sigma = \\frac{l}{F}$, $1\\text{ m/N}$; kritik haroratda suyuqlik va bug‘ orasidagi sirt tarangligi maksimal bo‘ladi',
      '$\\sigma = \\frac{F}{S}$, $1\\text{ Pa}$; sof suyuqliklarning sirt tarangligi haroratga mutlaqo bog‘liq emas',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-19',
    modul: 'M3',
    matn: 'Stalagmometrik usulda bir xil hajmdan tushadigan standart ($\\sigma_2, \\rho_2, n_2$) va tekshirilayotgan ($\\sigma_1, \\rho_1, n_1$) suyuqliklar tomchilari soni orqali sirt tarangligi $\\sigma_1$ qanday nisbat bilan hisoblanadi?',
    variantlar: [
      '$\\frac{\\sigma_1}{\\sigma_2} = \\frac{\\rho_1 n_2}{\\rho_2 n_1}$',
      '$\\frac{\\sigma_1}{\\sigma_2} = \\frac{\\rho_1 n_1}{\\rho_2 n_2}$',
      '$\\frac{\\sigma_1}{\\sigma_2} = \\frac{\\rho_2 n_2}{\\rho_1 n_1}$',
      '$\\frac{\\sigma_1}{\\sigma_2} = \\frac{n_1 - n_2}{\\rho_1 + \\rho_2}$',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-20',
    modul: 'M3',
    matn: 'Du Nuüy halqasi (o‘rtacha radiusi $R$) va Vilgelmi plastinkasi (ho‘llanuvchi perimetri $P$, to‘liq ho‘llanish $\\theta = 0^\\circ$) usullarida sirt tarangligi $\\sigma$ ni aniqlovchi maksimal kuch $F$ tenglamalari qaysi?',
    variantlar: [
      'Du Nuüy halqasi: $F = 4\\pi R\\sigma$; Vilgelmi plastinkasi: $F = P\\sigma$',
      'Du Nuüy halqasi: $F = 2\\pi R^2\\sigma$; Vilgelmi plastinkasi: $F = \\frac{P}{\\sigma}$',
      'Du Nuüy halqasi: $F = \\frac{2\\sigma}{\\rho g R}$; Vilgelmi plastinkasi: $F = P\\sigma\\sin\\theta$',
      'Du Nuüy halqasi: $F = \\pi R\\sigma$; Vilgelmi plastinkasi: $F = \\frac{P\\sigma}{2}$',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-21',
    modul: 'M3',
    matn: 'Gibbs adsorbsiya tenglamasi $\\Gamma = -\\frac{c}{RT}\\frac{d\\sigma}{dc}$ ga ko‘ra, sirt-faol moddalar (SFM) eritmada konsentratsiyasi oshirilganda qanday natija beradi?',
    variantlar: [
      'Sirt tarangligi pasayadi ($\\frac{d\\sigma}{dc} < 0$), shuning uchun $\\Gamma > 0$ bo‘lib, modda sirt qatlamda musbat adsorbsiyalanadi',
      'Sirt tarangligi keskin ortadi ($\\frac{d\\sigma}{dc} > 0$), natijada $\\Gamma > 0$ hosil bo‘ladi',
      'Sirt tarangligi o‘zgarmaydi ($\\frac{d\\sigma}{dc} = 0$), natijada $\\Gamma \\to \\infty$ bo‘ladi',
      'Sirt tarangligi kamaysa ham ($\\frac{d\\sigma}{dc} < 0$), $\\Gamma < 0$ bo‘lib hajmiy fazaga siqib chiqariladi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-22',
    modul: 'M3',
    matn: 'Difil tuzilishli sirt-faol moddalar (SFM) suv–havo chegarasida qanday yo‘naladi va kritik mitsella konsentratsiyasi (KMK) dan yuqorida sirt tarangligi $\\sigma(c)$ qanday o‘zgaradi?',
    variantlar: [
      'Gidrofil bosh suvga, gidrofob dum havoga yo‘naladi; KMK dan so‘ng mitsellalar hosil bo‘lib, $\\sigma$ ning pasayishi deyarli to‘xtaydi',
      'Gidrofob dum suvga, gidrofil bosh havoga qaraydi; KMK dan keyin $\\sigma$ keskin ko‘tarila boshlaydi',
      'Molekulalar sirtga chiqmay hajmda cho‘kadi; KMK da sirt tarangligi nolga sakraydi',
      'KMK nuqtasida barcha sirt-faol molekulalar bug‘lanib, eritma sof suvga aylanadi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-23',
    modul: 'M3',
    matn: 'Qattiq jism sirtidagi tomchi muvozanati uchun Young tenglamasi $\\sigma_{q\\text{-}g} = \\sigma_{q\\text{-}s} + \\sigma_{s\\text{-}g}\\cos\\theta$ berilgan. Agar $\\theta > 90^\\circ$ (ho‘llanmaslik) bo‘lsa, qaysi xulosa o‘rinli?',
    variantlar: [
      '$\\cos\\theta < 0$ va $\\sigma_{q\\text{-}s} > \\sigma_{q\\text{-}g}$; suyuqlik ichidagi koheziya kuchi adgeziyadan ustun keladi',
      '$\\cos\\theta > 0$ va tomchi qattiq sirt bo‘ylab to‘liq yupqa parda bo‘lib yoyiladi',
      '$\\cos\\theta = 1$ bo‘lib, adgeziya kuchlari koheziya kuchlaridan cheksiz katta bo‘ladi',
      'Uch fazali chegaradagi sirt kuchlari muvozanati faqat $\\theta = 0^\\circ$ da bajariladi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-24',
    modul: 'M3',
    matn: 'Kapillyar hodisa formulasi $h = \\frac{2\\sigma\\cos\\theta}{\\rho g r}$ ga asosan ho‘llovchi ($\\theta < 90^\\circ$) va ho‘llanmaydigan ($\\theta > 90^\\circ$) suyuqliklar kapillyarda o‘zini qanday tutadi?',
    variantlar: [
      'Ho‘llovchi suyuqlik botiq menisk bilan ko‘tariladi ($h > 0$), ho‘llanmaydigan qavariq menisk bilan pasayadi ($h < 0$); radius $r$ kichrayganda $|h|$ ortadi',
      'Ho‘llovchi suyuqlik pastga tushadi, ho‘llanmaydigan esa yuqoriga ko‘tariladi; radius $r$ ortganda $|h|$ ortadi',
      'Ikkala suyuqlik ham doimo yuqoriga ko‘tariladi va $|h|$ zichlik $\\rho$ ga to‘g‘ri proporsional bo‘ladi',
      'Kapillyar ko‘tarilish balandligi kontakt burchagi $\\theta$ ga va kapillyar radiusiga bog‘liq emas',
    ],
    togriIndeks: 0,
  },

  // ─── 4-MA'RUZA (KK_M4): 8 ta savol ─────────────────────────────────────────
  {
    id: 'kk-25',
    modul: 'M4',
    matn: 'Hajmi $V = 0{,}1\\text{ L}$ va boshlang‘ich konsentratsiyasi $C_0 = 0{,}08\\text{ mol/L}$ bo‘lgan eritmaga $m = 2\\text{ g}$ adsorbent solinganda muvozanat konsentratsiyasi $C_e = 0{,}03\\text{ mol/L}$ ga kamaydi. Eritmadan adsorbsiya miqdorini ($a = \\frac{(C_0 - C_e)V}{m}$) toping.',
    variantlar: [
      '$2{,}5\\text{ mmol/g}$',
      '$5{,}0\\text{ mmol/g}$',
      '$1{,}5\\text{ mmol/g}$',
      '$0{,}25\\text{ mmol/g}$',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-26',
    modul: 'M4',
    matn: 'Fizik adsorbsiyani kimyoviy adsorbsiyadan (xemosorbsiyadan) ajratib turuvchi asosiy tavsiflar majmuasi qaysi qatorda to‘g‘ri keltirilgan?',
    variantlar: [
      'Issiqlik effekti $8\\text{--}40\\text{ kJ/mol}$, Van-der-Vaals kuchlari, ko‘p qatlamli bo‘lishi mumkin, qaytuvchan va harorat oshsa kamayadi',
      'Issiqlik effekti $40\\text{--}400\\text{ kJ/mol}$, kovalent bog‘ hosil bo‘ladi, qat’iy monoqavatli va selektiv',
      'Yuqori aktivlanish energiyasi $E_a$ ni talab qiladi va faqat yuqori haroratda keskin kuchayadi',
      'Adsorbat molekulalari adsorbentning butun hajmiga singib, qaytmas kimyoviy birikma hosil qiladi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-27',
    modul: 'M4',
    matn: 'IUPAC bo‘yicha g‘ovaklar o‘lchami tasnifi va IV–V tur izotermalaridagi kapillyar kondensatsiya hamda gisterezis xalqasi qaysi turdagi g‘ovaklar uchun xos?',
    variantlar: [
      'Mikrog‘ovak ($d < 2\\text{ nm}$), mezog‘ovak ($2\\text{--}50\\text{ nm}$), makrog‘ovak ($d > 50\\text{ nm}$); kapillyar kondensatsiya va gisterezis mezog‘ovaklarda kuzatiladi',
      'Mikrog‘ovak ($d < 20\\text{ nm}$), makrog‘ovak ($d > 500\\text{ nm}$); kapillyar kondensatsiya faqat makrog‘ovaklarda sodir bo‘ladi',
      'Mikrog‘ovak ($d > 50\\text{ nm}$), mezog‘ovak ($2\\text{--}50\\text{ nm}$); gisterezis faqat g‘ovaksiz tekis sirtlarda bo‘ladi',
      'Mezog‘ovak ($d < 0{,}3\\text{ nm}$); gisterezis faqat Genri chiziqli sohasida paydo bo‘ladi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-28',
    modul: 'M4',
    matn: 'Freyndlix tenglamasining chiziqli ko‘rinishi $\\lg a = \\lg K_F + \\frac{1}{n}\\lg C_e$ grafigida to‘g‘ri chiziq qiyaligi $0{,}5$ ga, ordinata o‘qidagi kesma $\\lg K_F$ esa $1$ ga teng bo‘lsa, $K_F$, $n$ va adsorbsiya qulayligi qanday?',
    variantlar: [
      '$K_F = 10$, $n = 2$; $0 < \\frac{1}{n} < 1$ bo‘lgani uchun adsorbsiya qulay',
      '$K_F = 1$, $n = 0{,}5$; $\\frac{1}{n} > 1$ bo‘lgani uchun adsorbsiya noqulay',
      '$K_F = 10$, $n = 0{,}5$; chiziq sirtning mutlaq bir jinsli ekanligini ko‘rsatadi',
      '$K_F = 0{,}1$, $n = 2$; bu ko‘rsatkich faqat kimyoviy bog‘lanishni tasdiqlaydi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-29',
    modul: 'M4',
    matn: 'Lengmyur monoqavatli adsorbsiya nazariyasining asosiy farazlari va chiziqli tenglamasi $\\frac{C_e}{a} = \\frac{1}{a_m K} + \\frac{C_e}{a_m}$ grafigidan $a_m$ hamda $K$ parametrlarini topish usuli qaysi?',
    variantlar: [
      'Bir jinsli sirt, monoqavatli, molekulalar o‘zaro ta’sirlashmaydi; $a_m = \\frac{1}{\\text{qiyalik}}$ va $K = \\frac{\\text{qiyalik}}{\\text{kesma}}$',
      'Geterogen sirt va ko‘p qatlamli adsorbsiya; $a_m = \\text{qiyalik}$ va $K = \\text{qiyalik} \\cdot \\text{kesma}$',
      'Faqat kapillyar kondensatsiya; $a_m = \\frac{1}{\\text{qiyalik} + \\text{kesma}}$ va $K = \\frac{\\text{kesma}}{\\text{qiyalik}}$',
      'Adsorbat molekulalari kuchli itarishadi; $a_m = \\frac{\\text{kesma}}{\\text{qiyalik}}$ va $K = \\frac{1}{\\text{kesma}}$',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-30',
    modul: 'M4',
    matn: 'Adsorbsiya izoterma modellari va ularning nazariy ma’nosi qaysi javobda to‘g‘ri juftlashtirilgan?',
    variantlar: [
      'Dubinin–Radushkevich — mikrog‘ovaklarning hajmiy to‘lishi; Temkin — qoplanish ortishi bilan issiqlikning chiziqli kamayishi; Sips — geterogen sirt va to‘yinish birlashmasi',
      'Temkin — gazlarning makrog‘ovaklarda ko‘p qatlamli kondensatsiyasi; Dubinin–Radushkevich — kapillyar ko‘tarilish',
      'Sips — $n \\neq 1$ da sirtning mutlaq bir jinsliligi; BET — faqat ion almashinish adsorbsiyasi',
      'Freyndlix — aniq chekli monoqavat to‘yinishi $a_m$; Lengmyur — ko‘p qatlamli fizik adsorbsiya',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-31',
    modul: 'M4',
    matn: 'BET tenglamasi $\\frac{p}{a(p_0 - p)} = \\frac{1}{a_m C} + \\frac{C - 1}{a_m C}\\cdot\\frac{p}{p_0}$ orqali monoqavat sig‘imi $a_m$ va solishtirma sirt $S_{\\text{BET}}$ qaysi nisbiy bosim oralig‘ida hamda qanday formulalar bilan aniqlanadi?',
    variantlar: [
      '$0{,}05 < \\frac{p}{p_0} < 0{,}30$ oralig‘ida ($\\text{N}_2$ $77\\text{ K}$ da); $a_m = \\frac{1}{\\text{qiyalik} + \\text{kesma}}$ va $S_{\\text{BET}} = \\frac{a_m N_A \\sigma}{m}$',
      '$0{,}80 < \\frac{p}{p_0} < 1{,}00$ oralig‘ida; $a_m = \\frac{1}{\\text{qiyalik}}$ va $S_{\\text{BET}} = \\frac{m}{a_m N_A \\sigma}$',
      '$\\frac{p}{p_0} > 1{,}0$ sohada; $a_m = \\text{kesma} - \\text{qiyalik}$ va $S_{\\text{BET}} = a_m \\cdot m$',
      'Faqat $p \\to 0$ bo‘lganda; $a_m = K_H \\cdot p$ formulasi bilan',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-32',
    modul: 'M4',
    matn: 'Fizik adsorbsiyaning termodinamik belgilari ($\\Delta G, \\Delta H, \\Delta S$) va harorat ko‘tarilishining adsorbsiya muvozanatiga ta’siri qanday?',
    variantlar: [
      '$\\Delta G < 0$, $\\Delta H < 0$ (ekzotermik) va $\\Delta S < 0$ (tartiblanish); harorat ortganda muvozanat desorbsiya tomonga siljiydi',
      '$\\Delta G > 0$, $\\Delta H > 0$ (endotermik) va $\\Delta S > 0$; harorat ortganda fizik adsorbsiya keskin ortadi',
      '$\\Delta G = 0$ va $\\Delta H = 0$ bo‘lgani uchun harorat muvozanat konstantasiga ta’sir etmaydi',
      'Xromatografiyada harakatchan faza bo‘lmaydi va barcha komponentlar kolonka boshida qotib qoladi',
    ],
    togriIndeks: 0,
  },

  // ─── 5-MA'RUZA (KK_M5): 8 ta savol ─────────────────────────────────────────
  {
    id: 'kk-33',
    modul: 'M5',
    matn: '$\\text{KI}$ eritmasiga mo‘l (ortiqcha) $\\text{AgNO}_3$ eritmasi qo‘shib olingan musbat zaryadlangan $\\text{AgI}$ zoli mitsellasining to‘g‘ri strukturaviy formulasi qaysi?',
    variantlar: [
      '$\\{[\\text{AgI}]_m \\cdot n\\text{Ag}^+ \\cdot (n - x)\\text{NO}_3^-\\}^{x+} \\cdot x\\text{NO}_3^-$',
      '$\\{[\\text{AgI}]_m \\cdot n\\text{I}^- \\cdot (n - x)\\text{K}^+\\}^{x-} \\cdot x\\text{K}^+$',
      '$\\{[\\text{AgI}]_m \\cdot n\\text{NO}_3^- \\cdot (n - x)\\text{Ag}^+\\}^{x-} \\cdot x\\text{Ag}^+$',
      '$\\{[\\text{KNO}_3]_m \\cdot n\\text{Ag}^+ \\cdot (n - x)\\text{I}^-\\}^{x+} \\cdot x\\text{I}^-$',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-34',
    modul: 'M5',
    matn: '$\\text{FeCl}_3$ gidrolizidan hosil bo‘lgan $\\{[\\text{Fe(OH)}_3]_m \\cdot n\\text{FeO}^+ \\cdot (n - x)\\text{Cl}^-\\}^{x+} \\cdot x\\text{Cl}^-$ mitsellasida **granula** tarkibi va umumiy **mitsella** zaryadi qanday?',
    variantlar: [
      'Granula yadro va adsorbsion qavatdan iborat ($x+$ musbat zaryadli); umumiy mitsella diffuz $x\\text{Cl}^-$ hisobiga elektr neytral',
      'Granula faqat $[\\text{Fe(OH)}_3]_m$ yadrodan iborat va neytral; umumiy mitsella esa $x+$ zaryadli',
      'Granulada potensial aniqlovchi ionlar bo‘lmaydi; barcha zaryad tashqi suv molekulalarida to‘planadi',
      'Granula va mitsella doimo bir xil manfiy zaryadga ega bo‘lib, $\\text{FeO}^+$ qarshi ion vazifasini bajaradi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-35',
    modul: 'M5',
    matn: 'Elektrokinetik potensial ($\\zeta$-potensial) qayerda aniqlanadi va qaysi qiymatlar oralig‘ida kolloid zol agregativ jihatdan yuqori barqaror hisoblanadi?',
    variantlar: [
      'Zarracha bilan harakatlanuvchi suyuqlik orasidagi sirpanish tekisligida; $|\\zeta| > 30\\text{ mV}$ bo‘lganda yuqori barqarorlik kuzatiladi',
      'Bevosita qattiq yadro markazida; $|\\zeta| < 15\\text{ mV}$ bo‘lganda eng yuqori barqarorlikka erishiladi',
      'Erkin eritma hajmining eng chetida; $\\zeta = 0\\text{ mV}$ bo‘lganda sistema hech qachon cho‘kmaydi',
      'Gidrat qavatidan tashqarida; $\\zeta$-potensialning kamayishi koagulyatsiyani butunlay to‘xtatadi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-36',
    modul: 'M5',
    matn: 'Bredig elektr yoy usulining mohiyati nimadan iborat va bu usul orqali ko‘proq qanday zollar tayyorlanadi?',
    variantlar: [
      'Sovutilgan suv ostida metall elektrodlar orasida elektr yoy hosil qilib, metall bug‘ini kondensatsiyalash orqali $\\text{Au}, \\text{Ag}, \\text{Pt}, \\text{Pd}$ zollari olinadi',
      'Yuqori bosimli rotor-stator gomogenizatorida o‘simlik moylarini maydalab, $M/S$ emulsiyalari tayyorlanadi',
      'Qaynoq suvda temir(III) xloridni gidrolizlab, gidroksid zollari olinadi',
      'Yarim o‘tkazuvchan membrana orqali ortiqcha tuzlarni elektr maydonida ajratib olinadi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-37',
    modul: 'M5',
    matn: 'Fikning birinchi qonuni $J = -D\\frac{dc}{dx}$ va Eynshteyn–Stoks tenglamasi $D = \\frac{kT}{6\\pi\\eta r}$ ga ko‘ra, minus ishora nimani bildiradi va zarracha radiusi $r$ $2$ marta ortganda $D$ qanday o‘zgaradi?',
    variantlar: [
      'Minus ishora oqim konsentratsiya yuqori sohadan past sohaga yo‘nalishini ko‘rsatadi; $r$ $2$ marta ortganda $D$ $2$ marta kamayadi',
      'Minus ishora oqim past konsentratsiyadan yuqoriga yo‘nalishini ko‘rsatadi; $r$ $2$ marta ortganda $D$ $4$ marta ortadi',
      'Minus ishora harorat pasayishini bildiradi; diffuziya koeffitsienti $D$ zarracha radiusiga bog‘liq emas',
      'Diffuziya koeffitsienti $D$ muhit qovushqoqligi $\\eta$ ga to‘g‘ri proporsional bo‘ladi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-38',
    modul: 'M5',
    matn: 'Kolloid zollarda yorug‘lik sochilishi intensivligi zarracha radiusi $r$ ga qanday bog‘liq va rangsiz zollarda opalesensiya hodisasi qanday ko‘rinadi?',
    variantlar: [
      'Sochilish intensivligi $\\propto \\text{zarrachalar soni} \\cdot r^6$; yon tomondan ko‘kimtir, o‘tuvchi nurda sarg‘ish yoki qizg‘ish tus ko‘rinadi',
      'Sochilish intensivligi $\\propto r^{-2}$; zol barcha yo‘nalishda bir xil mutlaqo tiniq ko‘rinadi',
      'Yorug‘lik sochilishi chin eritmalarda ($d < 1\\text{ nm}$) kolloid zollardan kuchliroq namoyon bo‘ladi',
      'Sochilish intensivligi zarrachalar soniga teskari proporsional bo‘lib, $r^2$ ga bog‘liq',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-39',
    modul: 'M5',
    matn: 'Liofob zollar koagulyatsiyasida «koagulyatsiya chegarasi» nimani anglatadi va qo‘shilgan elektrolit qarshi ionining valentligi ortganda jarayon qanday o‘zgaradi?',
    variantlar: [
      'Koagulyatsiyani boshlab beruvchi elektrolitning eng kichik konsentratsiyasi; qarshi ion valentligi ortgan sari koagulyatsiyalovchi ta’siri keskin kuchayadi',
      'Zolni peptizatsiyalaydigan maksimal erituvchi hajmi; qarshi ion valentligi ortganda koagulyatsiya to‘xtaydi',
      'Zarrachalar sirtidagi gidrat qavatini kengaytiruvchi sirt-faol modda miqdori; valentlik ta’sir qilmaydi',
      'Zolning kristalloidga aylanish harorati; faqat bir xil ishorali ionlar koagulyatsiya chaqiradi',
    ],
    togriIndeks: 0,
  },
  {
    id: 'kk-40',
    modul: 'M5',
    matn: 'Zollar barqarorligining ikki turi — agregativ va sedimentatsion barqarorlik hamda birlamchi gidrat qavatining roli qaysi qatorda aniq ko‘rsatilgan?',
    variantlar: [
      'Agregativ barqarorlik — zarrachalarning yopishib yiriklashishiga qarshilik (bunda sirtga kuchli bog‘langan birlamchi gidrat qavati va qo‘sh elektr qavat muhim); sedimentatsion barqarorlik — og‘irlik kuchida cho‘kishga qarshilik',
      'Agregativ barqarorlik — og‘irlik kuchida cho‘kmaslik; sedimentatsion barqarorlik — sirtdagi zaryadning nolga tushishi',
      'Ikkala turdagi barqarorlik ham faqat dag‘al suspenziyalarga ($d > 1\\text{ }\\mu\\text{m}$) xos bo‘lib, zollarga taalluqli emas',
      'Birlamchi gidrat qavati zarrachalarning bir-biriga tezkor yopishib cho‘kishini tezlashtiradi',
    ],
    togriIndeks: 0,
  },
])
