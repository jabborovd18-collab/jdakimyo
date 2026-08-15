// components/ilmiy/Qobiq.jsx
//
// Ilmiy tahlil sahifalarining qurilish g'ishtlari.
//
// NEGA BITTA FAYLDA. Bular mayda, bir-biriga bog'liq va HAMMASI bitta
// sahifada birga ishlatiladi. Har birini alohida faylga ajratsak, har
// sahifada o'nta import qatori paydo bo'lardi — foydasi yo'q.
//
// NEGA SERVER KOMPONENT ("use client" YO'Q). Bularning hech biri holat
// saqlamaydi va hodisa tinglamaydi — ular faqat ma'lumotni HTML ga
// aylantiradi. Server komponent bo'lgani uchun brauzerga ularning JS
// kodi umuman yuborilmaydi. Eski sahifalar butunlay "use client" edi va
// 1 700 qatorlik komponent har bir tashrifchiga yuklanardi.
//
// RANG QOIDASI (AGENTS.md 3-band). Bu yerda bironta Tailwind rang
// sinfi yo'q. Barcha ko'rinish `.v3-ilmiy-*` sinflarida, ular esa
// `--v3-*` o'zgaruvchilaridan oladi — shuning uchun to'rtala fonda ham
// to'g'ri ko'rinadi.

import Link from 'next/link'
import Ikon from '@/components/Ikon'

/**
 * HTML formulani chiqaradi ("[Fe(CN)<sub>6</sub>]³⁻").
 *
 * NEGA dangerouslySetInnerHTML. Ma'lumot manbaida formulalar `<sub>`
 * teglari bilan yozilgan (4 601 ta qiymat shu shaklda). Ularni JSX ga
 * qo'lda o'girish 12 sahifada yuzlab joyni qo'lda tahrirlashni talab
 * qilardi. Manba — o'z repozitoriyamizdagi statik fayl, foydalanuvchi
 * kiritmasi emas, shuning uchun XSS xavfi yo'q.
 */
export function Formula({ html, className = '' }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

/**
 * Matnda HAQIQIY HTML tegi bormi?
 *
 * NEGA SHUNCHAKI `includes('<')` YETMAYDI. Kimyoda "<" matematik
 * belgi sifatida ko'p uchraydi: "k < 10⁻⁴ s⁻¹", "Δo (14,000) << P",
 * "<5% crosslink". Agar bunday matn `dangerouslySetInnerHTML` ga
 * berilsa, brauzer "< 10⁻⁴ s⁻¹" ni tugallanmagan teg deb hisoblab,
 * matnning qolganini YUTIB YUBORADI — xato chiqmaydi, ma'lumot
 * shunchaki sahifadan yo'qoladi.
 *
 * Buni `scripts/tahlil-matn-surat.mjs` tutdi: 59 ta matn shu sababdan
 * ko'rinmay qolgan edi. Shuning uchun bu yerda faqat tanilgan teglar
 * (formulaning pastki/yuqori indeksi va oddiy bezaklar) HTML deb
 * hisoblanadi.
 */
export function htmlBormi(matn) {
  return /<\/?(sub|sup|b|i|strong|em|br|span)\b[^>]*>/i.test(String(matn))
}

/** Non-uskuna: sahifa yo'li (breadcrumb). */
export function Yol({ bandlar }) {
  return (
    <nav className="v3-ilmiy-yol" aria-label="Sahifa yo'li">
      {bandlar.map((b, i) => (
        <span key={i} className="contents">
          {i > 0 && <span className="ajratgich">›</span>}
          {b.havola ? (
            <Link href={b.havola}>{b.nom}</Link>
          ) : (
            <span className="joriy">{b.nom}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

/**
 * Sarlavhali bo'lim kartasi.
 *
 * `ikon` — `components/Ikon.jsx` dagi kalit (masalan "jadval").
 * Emoji QABUL QILINMAYDI: u har tizimda boshqacha chiziladi, rangi
 * qattiq yozilgan va fon almashganda moslashmaydi. SVG esa
 * `currentColor` bilan chiziladi, ya'ni --v3-* tizimiga o'zi ergashadi.
 */
export function Blok({ sarlavha, ikon, children, id }) {
  return (
    <section className="v3-ilmiy-blok" id={id}>
      {sarlavha && (
        <h2>
          {ikon && <Ikon nom={ikon} olcham={19} className="v3-ilmiy-blok-ikon" />}
          {sarlavha}
        </h2>
      )}
      {children}
    </section>
  )
}

/** Blok ichidagi ko'tarilgan panel. */
export function Panel({ sarlavha, children, className = '' }) {
  return (
    <div className={`v3-ilmiy-panel ${className}`}>
      {sarlavha && <h3>{sarlavha}</h3>}
      {children}
    </div>
  )
}

/** Ustunli tarmoq. `ustun` — 2, 3 yoki 4. */
export function Grid({ ustun = 2, children, className = '' }) {
  const nom = { 2: 'ikki', 3: 'uch', 4: 'tort' }[ustun] || 'ikki'
  return <div className={`v3-ilmiy-grid ${nom} ${className}`}>{children}</div>
}

/** Kalit-qiymat lavhasi (molyar massa, CAS raqami…). */
export function Lavha({ nom, qiymat, html = false }) {
  return (
    <dl className="v3-ilmiy-lavha">
      <dt>{nom}</dt>
      <dd>{html ? <Formula html={String(qiymat)} /> : qiymat}</dd>
    </dl>
  )
}

/**
 * Jadval.
 *
 * `ustunlar` — [{ kalit, nom, son? }]
 * `qatorlar` — obyektlar massivi
 * `son: true` — qiymat raqamli, jadval raqamlarini tekislaydi.
 */
export function Jadval({ ustunlar, qatorlar }) {
  if (!qatorlar?.length) return null
  return (
    <div className="v3-ilmiy-jadval-qobiq">
      <table className="v3-ilmiy-jadval">
        <thead>
          <tr>
            {ustunlar.map((u) => (
              <th key={u.kalit}>{u.nom}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {qatorlar.map((q, i) => (
            <tr key={i}>
              {ustunlar.map((u) => (
                <td key={u.kalit} className={u.son ? 'son' : undefined}>
                  <Katak qiymat={q[u.kalit]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Jadval katakchasining ichi.
 *
 * NEGA ALOHIDA. Ma'lumot bir xil chuqurlikda emas: `nmrSignals` da
 * qiymat oddiy satr, `dftPathways` da esa katakcha ichida yana obyekt
 * bo'ladi ({ label, energy, type }). Ilgari bunday katakcha React'ni
 * yiqitardi ("Objects are not valid as a React child"), keyinroq esa
 * `[object Object]` bo'lib chiqib, ma'lumot ko'rinmay qolgan bo'lardi.
 */
function Katak({ qiymat }) {
  if (qiymat === null || qiymat === undefined || qiymat === '') return '—'

  if (Array.isArray(qiymat)) {
    return (
      <ul style={{ margin: 0, paddingLeft: 15, listStyle: 'disc' }}>
        {qiymat.map((x, i) => (
          <li key={i}>
            <Katak qiymat={x} />
          </li>
        ))}
      </ul>
    )
  }

  if (typeof qiymat === 'object') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(qiymat).map(([k, v]) => (
          <span key={k}>
            <span style={{ opacity: 0.65 }}>{k}: </span>
            <Katak qiymat={v} />
          </span>
        ))}
      </div>
    )
  }

  const matn = String(qiymat)
  return htmlBormi(matn) ? <Formula html={matn} /> : matn
}

/**
 * Ta'rif ro'yxati: chapda kalit, o'ngda uzun izoh.
 *
 * `bandlar` — [[kalit, qiymat], ...] yoki obyekt.
 * Bo'sh qiymatlar tashlab ketiladi: ma'lumot 12 sahifada bir xil
 * to'liqlikda emas va bo'sh qator sahifada teshik qoldiradi.
 */
export function Tarif({ bandlar, nomlar = {} }) {
  const juftlar = Array.isArray(bandlar) ? bandlar : Object.entries(bandlar || {})
  const toza = juftlar.filter(([, v]) => v !== undefined && v !== null && v !== '')
  if (!toza.length) return null
  // Umumiy lug'at har doim asos: chaqiruvchi uni qo'shishni unutsa ham
  // yorliq o'zbekcha chiqadi. Ilgari buni har chaqiruv o'zi berardi va
  // unutilgan joylarda "Spin State", "Cc Bond" ko'rinardi.
  const toliqNomlar = { ...NOMLAR, ...nomlar }
  return (
    <dl className="v3-ilmiy-tarif">
      {toza.map(([k, v]) => (
        <div key={k}>
          <dt>{toliqNomlar[k] || chiroyliNom(k)}</dt>
          <dd>
            <Katak qiymat={v} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Belgi (chip). `turi`: 'oddiy' | 'urgu' | 'ikkinchi'. */
export function Belgi({ children, turi = 'oddiy' }) {
  const sinf = turi === 'oddiy' ? '' : turi
  return <span className={`v3-ilmiy-belgi ${sinf}`}>{children}</span>
}

/** Eslatma. `xavf` — qizil variant (xavfsizlik ogohlantirishi). */
export function Eslatma({ children, xavf = false }) {
  return <div className={`v3-ilmiy-eslatma ${xavf ? 'xavf' : ''}`}>{children}</div>
}

/** Raqamlangan bosqichlar (laboratoriya tartibi). */
export function Qadamlar({ bandlar }) {
  if (!bandlar?.length) return null
  return (
    <ol className="v3-ilmiy-qadamlar">
      {bandlar.map((b, i) => {
        const matn = typeof b === 'string' ? b : b.matn || b.step || b.qadam || ''
        return (
          <li className="v3-ilmiy-qadam" key={i}>
            <span className="v3-ilmiy-qadam-raqam" aria-hidden="true" />
            <span className="v3-ilmiy-qadam-matn">
              {htmlBormi(matn) ? <Formula html={String(matn)} /> : matn}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Oldingi/keyingi birikmaga o'tish. */
export function Navigatsiya({ oldingi, keyingi }) {
  return (
    <nav className="v3-ilmiy-navigatsiya">
      {oldingi ? (
        <Link href={oldingi.havola} className="v3-ilmiy-nav-tugma">
          <span aria-hidden="true">←</span>
          <Formula html={oldingi.nom} />
        </Link>
      ) : (
        <span />
      )}
      {keyingi && (
        <Link href={keyingi.havola} className="v3-ilmiy-nav-tugma">
          <Formula html={keyingi.nom} />
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </nav>
  )
}

/**
 * `camelCase` kalitni o'qiladigan sarlavhaga aylantiradi.
 *
 * Nega kerak: ma'lumot 4 601 ta bargdan iborat va ularning kalitlari
 * inglizcha (`racahParameter`). Har biriga qo'lda o'zbekcha nom yozish
 * — 4 601 qatorlik lug'at degani. Ko'p ishlatiladigan kalitlar
 * `NOMLAR` lug'atida tarjima qilingan, qolgani shu funksiya orqali
 * o'qilarli holga keladi.
 */
/**
 * Kimyoviy yorliqni formulaga o'giradi: `coN_NH3_trans` → `Co–N(NH₃) trans`.
 *
 * NEGA ALOHIDA QOIDA. Bog' uzunligi va burchak jadvallarida kalit
 * kimyoviy formulaning o'zi: `coN_NH3_cis`, `nCoN_Angle`, `ptCl`,
 * `pKa1`. Oddiy so'z ajratgich ularni "Co N NH3 cis", "P Ka1" qilib
 * buzadi — ya'ni kimyo darsligida atom belgilari so'zga aylanadi.
 *
 * Bu funksiya faqat ATOM BELGILARIDAN iborat kalitlarni tanadi va
 * ularni tire bilan bog'lab, indekslarni pastga tushiradi. Tanimasa
 * `null` qaytaradi va odatdagi yo'l davom etadi.
 */
function kimyoviyYorliq(kalit) {
  // pKa1 / pKa2 — kislota doimiysi
  const pka = kalit.match(/^pKa([0-9]?)$/i)
  if (pka) return `pKa${pastIndeks(pka[1])}`

  // t_half_1 — yarim yemirilish davri
  const yarim = kalit.match(/^t_?half_?([0-9]?)$/i)
  if (yarim) return `t½${pastIndeks(yarim[1])}`

  const ATOM = '(?:Co|Cl|Pt|Rh|Al|Ni|Fe|Cu|Cr|Mn|Zn|Ag|Au|Pd|Ir|Ru|Se|Cd|Eu|Tb|Si|[CHNOPSKFBI])'
  const bolaklar = kalit
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .split('_')
    .filter(Boolean)

  const oxirgi = bolaklar[bolaklar.length - 1]?.toLowerCase()
  const QOSHIMCHA = { cis: 'sis', trans: 'trans', angle: 'burchagi', bond: 'bog\'i', terminal: 'terminal', length: 'uzunligi' }
  const izoh = QOSHIMCHA[oxirgi] ? bolaklar.pop() : null

  // Har bo'lak atom belgisi yoki ligand formulasi bo'lishi shart —
  // aks holda bu kimyoviy yorliq emas, oddiy so'z.
  const atomlar = []
  for (const b of bolaklar) {
    const n = b[0].toUpperCase() + b.slice(1)
    if (new RegExp(`^${ATOM}$`).test(n)) atomlar.push(n)
    else if (/^(NH3|H2O|NO2|ONO|CN|CO|OH|PPh3|NH2|SCN|C2O4|acac|en|phen|bipy)[0-9]*$/i.test(b))
      atomlar.push(`(${formulaIndeks(b)})`)
    else return null
  }
  if (atomlar.length < 2) return null

  // Qavsli ligand oldingi atomga yopishadi: Co + (NH₃) → Co(NH₃)
  let matn = ''
  for (const a of atomlar) matn += a.startsWith('(') ? a : (matn ? '–' + a : a)
  return izoh ? `${matn} ${QOSHIMCHA[izoh.toLowerCase()]}` : matn
}

const PAST = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' }
const pastIndeks = (s) => String(s).replace(/[0-9]/g, (d) => PAST[d])
const formulaIndeks = (s) => s.replace(/([A-Za-z])([0-9]+)/g, (_, a, n) => a + pastIndeks(n))

function chiroyliNom(kalit) {
  // Simmetriya tasviri yoki amali (A1g, T2u, C2v, σh, S4) — bular
  // atama, so'z emas. Ularni bo'lish "A 1g" kabi axlat yasaydi.
  if (/^[A-ZΣσ][0-9a-z]?[gu]?(_[a-z]+)?$/.test(kalit) && kalit.length <= 4) return kalit

  const kimyo = kimyoviyYorliq(kalit)
  if (kimyo) return kimyo

  return kalit
    // Qisqartmalarni saqlash: pastki chiziq bo'g'in ajratgichi
    // (co59_CQ, N_Co_N_cis, h1_MAS) — u bo'shliqqa aylanadi, lekin
    // bo'lakning O'Z harf registri buzilmaydi. Ilgari `capitalize`
    // "N_co_n_cis" va "Pjt" kabi o'qib bo'lmaydigan narsa chiqarardi.
    .split('_')
    .map((b) => b.replace(/([a-z0-9])([A-Z])/g, '$1 $2'))
    .join(' ')
    .replace(/^[a-z]/, (x) => x.toUpperCase())
    .trim()
}


/**
 * Ma'lumot kalitlarining o'zbekcha nomi.
 *
 * NEGA BUNCHA KATTA. YaMR bo'limining ma'lumotida 440 xil kalit bor va
 * ularning hammasi inglizcha (ilmiy manbalardan ko'chirilgan). Ilgari
 * bu yerda 88 tasi bor edi, qolgan 350 tasi `chiroyliNom()` ga tushib,
 * ekranda "Xray Data", "Taube Classification", "Pjt" bo'lib chiqardi —
 * ya'ni o'zbek tilidagi sahifada yorliqlarning yarmi ingliz tilida
 * turardi. AGENTS.md 0-bandi: interfeys o'zbek tilida.
 *
 * TARTIB: guruhlar bo'yicha, chunki ro'yxat uzun va bir kalitni
 * qidirish kerak bo'ladi. Yangi kalit qo'shganda o'z guruhiga qo'ying.
 *
 * BU YERDA BO'LMAGAN KALIT xato emas: `chiroyliNom()` uni o'qiladigan
 * holga keltiradi. Lekin natijasi inglizcha bo'ladi, shuning uchun
 * ko'p uchraydigani shu yerga tushishi kerak.
 */
export const NOMLAR = {
  // ── Umumiy ──
  name: 'Nomi',
  nom: 'Nomi',
  title: 'Sarlavha',
  desc: 'Tavsifi',
  description: 'Tavsifi',
  note: 'Izoh',
  notes: 'Izoh',
  theory: 'Nazariy izoh',
  theoryNote: 'Nazariy izoh',
  source: 'Manba',
  sources: 'Manbalar',
  reference: 'Manba',
  referenceNote: 'Manba haqida',
  book: 'Kitob',
  year: 'Yili',
  time: 'Vaqti',
  step: 'Qadam',
  purpose: 'Maqsadi',
  method: 'Usuli',
  technique: 'Texnika',
  use: 'Qo\'llanilishi',
  usage: 'Qo\'llanilishi',
  type: 'Turi',
  label: 'Belgi',
  id: 'Kodi',
  value: 'Qiymati',
  unit: 'Birligi',
  result: 'Natija',
  consequence: 'Natijasi',
  effect: 'Ta\'siri',
  impact: 'Ta\'siri',
  evidence: 'Dalil',
  observable: 'Kuzatiladigan belgi',
  significance: 'Ahamiyati',
  keyPoint: 'Asosiy xulosa',
  keyDifference: 'Asosiy farq',
  whyImportant: 'Nega muhim',
  why: 'Sababi',
  reason: 'Sababi',
  reason1: 'Birinchi sabab',
  reason2: 'Ikkinchi sabab',
  reason3: 'Uchinchi sabab',
  reason4: 'To\'rtinchi sabab',
  solution: 'Yechim',
  severity: 'Darajasi',
  advantage: 'Afzalligi',
  advantages: 'Afzalliklari',
  advs: 'Afzalliklari',
  disadvantage: 'Kamchiligi',
  disadvantages: 'Kamchiliklari',
  disadvs: 'Kamchiliklari',
  Disadvs: 'Kamchiliklari',
  bestFor: 'Qachon qo\'llanadi',
  example: 'Misol',
  Example: 'Misol',
  examples: 'Misollar',
  application: 'Qo\'llanilishi',
  applications: 'Qo\'llanilishi',
  comparison: 'Taqqoslash',
  compound: 'Birikma',
  modern: 'Zamonaviy holat',
  isCurrent: 'Hozir amalda',
  preferred: 'Afzal ko\'riladi',
  conventions: 'Kelishuvlar',
  primary: 'Asosiy',
  secondary: 'Ikkilamchi',

  // ── Tarix ──
  scientist: 'Olim',
  scientists: 'Olimlar',
  achievement: 'Yutug\'i',
  contribution: 'Hissasi',
  discovery: 'Kashf etilishi',
  nobel: 'Nobel mukofoti',
  nobelYear: 'Nobel yili',
  nobelPrize: 'Nobel mukofoti',
  synthesisRef: 'Sintez manbai',
  luteoName: 'Luteo nomi',

  // ── Kristall maydon ──
  metalIon: 'Metall ioni',
  metal: 'Metall',
  electronConfig: 'Elektron konfiguratsiya',
  electronCount: 'Elektronlar soni',
  dElectrons: 'd-elektronlar soni',
  spinState: 'Spin holati',
  spin: 'Spin',
  orbitalOccupancy: 'Orbital bandligi',
  unpairedElectrons: 'Juftlashmagan elektronlar',
  magneticMoment: 'Magnit momenti',
  muEff: 'Effektiv magnit moment',
  crystalFieldSplitting: 'Kristall maydon bo\'linishi',
  racahParameter: 'Rakah parametri',
  nephelauxeticRatio: 'Nefelauksetik nisbat',
  pairingEnergy: 'Juftlanish energiyasi',
  cfse: 'CFSE',
  cFSE: 'CFSE',
  cfseNet: 'CFSE (netto)',
  spectrochemicalSeries: 'Spektrokimyoviy qator',
  whyLowSpin: 'Nega past spinli',
  whyHighSpin: 'Nega yuqori spinli',
  whySquarePlanar: 'Nega tekis kvadrat',
  whyOctahedral: 'Nega oktaedrik',
  colorOrigin: 'Rangning kelib chiqishi',
  chargeTransfer: 'Zaryad ko\'chishi',
  mlct: 'MLCT (metall→ligand)',
  mlctEffect: 'MLCT ta\'siri',
  lmct: 'LMCT (ligand→metall)',
  jahnTellerNote: 'Yan-Teller effekti',
  pjt: 'Psevdo-Yan-Teller',
  pjtDistortion: 'Psevdo-Yan-Teller buzilishi',
  pjteStabilization: 'PJT barqarorlashuvi',
  stabilization: 'Barqarorlashuv',
  band: 'Yutilish polosasi',
  epsilon: 'Molyar yutilish (ε)',
  oxidationState: 'Oksidlanish darajasi',
  ionicCharacter: 'Ionlik ulushi',
  piBackbonding: 'π-qaytarma bog\'lanish',

  // ── Simmetriya ──
  pointGroup: 'Nuqta guruhi',
  actualPointGroup: 'Haqiqiy nuqta guruhi',
  realSymmetry: 'Haqiqiy simmetriya',
  parentGroup: 'Ona guruh',
  order: 'Guruh tartibi',
  symmetry: 'Simmetriya',
  symmetryElements: 'Simmetriya elementlari',
  descentInSymmetry: 'Simmetriyaning pasayishi',
  dOrbitalReduction: 'd-orbitallarning yoyilishi',
  nmrEquivalence: 'YaMR ekvivalentligi',
  irActive: 'IQ-faol',
  ramanActive: 'Raman-faol',
  mutualExclusion: 'O\'zaro istisno qoidasi',
  functions: 'Funksiyalar',
  propellerShape: 'Parrak shakli',
  chirality: 'Xirallik',
  absoluteConfiguration: 'Mutlaq konfiguratsiya',
  opticalRotation: 'Optik burilish',

  // ── YaMR ──
  nucleus: 'Yadro',
  nmrNucleus: 'O\'lchanadigan yadrolar',
  gamma: 'Gyromagnit nisbat γ',
  naturalAbundance: 'Tabiiy tarqalishi',
  larmor400: 'Larmor chastotasi (9.4 T)',
  shift: 'Kimyoviy siljish',
  chemicalShift: 'Kimyoviy siljish',
  nmrShift: 'Kimyoviy siljish',
  referens: 'Referens',
  referencing: 'Referens tizimi',
  whyThisShift: 'Nega aynan shunday siljish',
  multiplicity: 'Multipletlik',
  mult: 'Multipletlik',
  linewidth: 'Chiziq kengligi',
  t1Relaxation: 'T₁ relaksatsiya',
  t2Relaxation: 'T₂ relaksatsiya',
  coupling: 'Bog\'lanish (J)',
  couplingNotes: 'Bog\'lanish haqida',
  couplingToCo: 'Ko\'balt bilan bog\'lanish',
  jCoupling: 'Bog\'lanish doimiysi J',
  integration: 'Integratsiya',
  integ: 'Integratsiya',
  solvent: 'Erituvchi',
  solventModel: 'Erituvchi modeli',
  sensitivity: 'Sezgirlik',
  detection: 'Qayd etish',
  csa: 'Kimyoviy siljish anizotropiyasi',
  quadrupolar: 'Kvadrupol xossalari',
  quadrupoleMoment: 'Kvadrupol momenti',
  quadrupolarBroadening: 'Kvadrupol kengayish',
  satellites: 'Yo\'ldosh signallar',
  exchangeBroadening: 'Almashinuv kengayishi',
  coalescenceTemp: 'Birlashish harorati',
  nmrEffect: 'YaMR ga ta\'siri',
  nmrConnection: 'YaMR bilan bog\'liqligi',
  solidStateNMR: 'Qattiq holat YaMR',
  ppm: 'δ (ppm)',
  intensity: 'Intensivlik',
  assignment: 'Tayinlash',
  field: 'Magnit maydon',
  linkageDiscrimination: 'Linkage izomerni farqlash',
  uniqueToNitrito: 'Faqat nitritoda',
  exclusiveToNitrito: 'Faqat nitritoda',

  // ── Struktura ──
  structure: 'Tuzilishi',
  geometry: 'Geometriyasi',
  bondLengths: 'Bog\' uzunliklari',
  bondAngles: 'Bog\' burchaklari',
  biteAngle: 'Qamrash burchagi',
  sumAngles: 'Burchaklar yig\'indisi',
  transEffect: 'Trans-effekt',
  transInfluence: 'Trans-ta\'sir',
  transEffectEvidence: 'Trans-effekt dalili',
  hydrogenBonding: 'Vodorod bog\'lanishi',
  firstShell: 'Birinchi qobiq',
  secondShell: 'Ikkinchi qobiq',
  xray: 'Rentgen tuzilmasi',
  xrayData: 'Rentgen ma\'lumoti',
  nmr: 'YaMR',
  computational: 'Hisoblash usuli',
  definition: 'Ta\'rifi',
  mechanism: 'Mexanizmi',
  sterics: 'Sterik omillar',
  selectivity: 'Tanlovchanligi',

  // ── Termodinamika va kinetika ──
  stability: 'Barqarorligi',
  thermalStability: 'Termik barqarorligi',
  overallStability: 'Umumiy barqarorlik',
  formationConstant: 'Hosil bo\'lish doimiysi',
  stepwiseConstants: 'Bosqichli doimiylar',
  stepwise: 'Bosqichma-bosqich',
  logBeta: 'log β',
  inertness: 'Inertligi',
  taubeClassification: 'Taube tasnifi',
  waterExchange: 'Suv almashinuvi',
  acidHydrolysis: 'Kislotali gidroliz',
  hydrolysis: 'Gidroliz',
  aquation: 'Akvatatsiya',
  reaction: 'Reaksiya',
  reaction1: 'Birinchi reaksiya',
  reaction2: 'Ikkinchi reaksiya',
  reaction3: 'Uchinchi reaksiya',
  reverseReaction: 'Teskari reaksiya',
  direction: 'Yo\'nalishi',
  deltaH: 'ΔH°',
  deltaS: 'ΔS°',
  deltaG: 'ΔG°',
  deltaG298: 'ΔG° (298 K)',
  deltaHf: 'ΔH°(hosil bo\'lish)',
  deltaGf: 'ΔG°(hosil bo\'lish)',
  deltaSf: 'ΔS°(hosil bo\'lish)',
  activationEnergy: 'Faollanish energiyasi',
  activationParameters: 'Faollanish parametrlari',
  activationVolume: 'Faollanish hajmi',
  activation: 'Faollanish',
  barrier: 'Energetik to\'siq',
  barrierUnit: 'To\'siq birligi',
  rate: 'Tezligi',
  rateConstant: 'Tezlik doimiysi',
  rateConstant298: 'Tezlik doimiysi (298 K)',
  halfLife: 'Yarim yemirilish davri',
  eyring: 'Eyring parametrlari',
  isomerization: 'Izomerizatsiya',
  isomerEnergyDiff: 'Izomerlar energiya farqi',
  metastability: 'Metabarqarorlik',
  stabilityConditions: 'Saqlash sharoiti',
  polymerization: 'Polimerlanish',
  amphoteric: 'Amfoterligi',
  aluminate: 'Alyuminat shakli',
  pKa: 'pKa',
  energy: 'Energiya',
  frequencies: 'Chastotalar',
  basisSetForCo: 'Ko\'balt uchun bazis to\'plami',
  quantum: 'Kvant hisobi',

  // ── Bioanorganik va tibbiy ──
  clinical: 'Klinik ahamiyati',
  dose: 'Dozasi',
  toxicity: 'Toksikligi',
  cancer: 'Saraton turi',
  cure: 'Davolash samarasi',
  binding: 'Bog\'lanishi',
  dnaBinding: 'DNK ga bog\'lanishi',
  crosslink: 'Ko\'ndalang bog\'lanish',
  crosslinking: 'Ko\'ndalang bog\'lanish',
  crosslinkEfficiency: 'Ko\'ndalang bog\' samarasi',
  adductRatio: 'Adduktlar nisbati',
  intracellular: 'Hujayra ichida',
  nephrotoxicity: 'Buyrak toksikligi',
  neurotoxicity: 'Nerv toksikligi',
  ototoxicity: 'Eshitishga ta\'siri',
  myelosuppression: 'Suyak iligi bosilishi',
  emesis: 'Ko\'ngil aynishi',
  generation: 'Avlodi',
  activity: 'Faolligi',
  whyInactive: 'Nega faol emas',
  catalysis: 'Kataliz',
  chelateEffect: 'Xelat effekti',
  thermodynamicOrigin: 'Termodinamik sababi',
  redoxProperties: 'Redoks xossalari',
  interferences: 'Halaqit beruvchi omillar',
  labProcedure: 'Laboratoriya tartibi',

  // ── Yakka holatlar ──
  // Bular avtomatik qoidaga tushmaydi: yo qisqartma (MAS, CQ), yo
  // formulasi nostandart yozilgan. Ro'yxat qisqa bo'lgani uchun
  // qo'lda yozilgan.
  co59_CQ: 'Kvadrupol doimiysi C_Q (⁵⁹Co)',
  co59_eta: 'Asimmetriya η (⁵⁹Co)',
  h1_MAS: '¹H MAS',
  nh_Bond: 'N–H bog\'i',
  ohBond: 'O–H bog\'i',
  oh_Bond: 'O–H bog\'i',
  hNH_Angle: 'H–N–H burchagi',
  hohAngle: 'H–O–H burchagi',
  hoh_Angle: 'H–O–H burchagi',
  oN_bond: 'O–N bog\'i',
  o_N_bond: 'O–N bog\'i',
  n_O_terminal: 'N–O (terminal)',
  on_O_terminal: 'O–N–O (terminal)',
  onO_terminal: 'O–N–O (terminal)',
  coON_angle: 'Co–O–N burchagi',
  dihedral_ONO: 'ONO dihedral burchagi',
  referenceCoN6: 'Solishtirish: Co–N₆',
  coOBondLength: 'Co–O bog\' uzunligi',
  coNBondLength: 'Co–N bog\' uzunligi',
  shift_NH3: 'δ (NH₃)',
  shift_NO2: 'δ (NO₂)',
  shift_ONO: 'δ (ONO)',
  pc_phosphine: 'Fosfin konusi burchagi',
  ionicRadius: 'Ion radiusi',
  hydrogenBonds: 'Vodorod bog\'lari',
  endoExoConformers: 'Endo va ekzo konformerlar',
  endoExoStructure: 'Endo/ekzo tuzilishi',
  comparisonWithNitro: 'Nitro izomer bilan taqqoslash',
  nitroComparison: 'Nitro izomer bilan taqqoslash',
  step1: '1-bosqich',
  step2: '2-bosqich',
  step3: '3-bosqich',
  step4: '4-bosqich',
  step5: '5-bosqich',
  jPtH: 'J(Pt–H)',
  jRhP: 'J(Rh–P)',
  nmrP: '³¹P YaMR',
  nmrPt: '¹⁹⁵Pt YaMR',
  al27: '²⁷Al',
  n15: '¹⁵N',
  co59: '⁵⁹Co',
  h1: '¹H',
  o17: '¹⁷O',
  p31: '³¹P',
  k1: 'k₁',
  k2: 'k₂',
  K: 'Muvozanat doimiysi K',
  J: 'J',
  E: 'E',

  // ── Uchinchi to'lqin: 12 sahifani to'liq skanerlash natijasi ──
  // Bu ro'yxat taxminan emas, o'lchab olingan: render qilingan
  // 2 004 ta yorliqdan hali inglizcha qolganlari.
  ligand: 'Ligand',
  metal: 'Metall',
  geometry: 'Geometriyasi',
  spinState: 'Spin holati',
  waterExchange: 'Suv almashinuvi',
  resolutionMethod: 'Ajratish usuli',
  comparisonWithNH3: 'NH₃ kompleksi bilan taqqoslash',
  conformationalAnalysis: 'Konformatsion tahlil',
  preferredConformation: 'Afzal konformatsiya',
  diastereotopicProtons: 'Diastereotop protonlar',
  cc_Bond: 'C–C bog\'i',
  cn_Bond: 'C–N bog\'i',
  ccBond: 'C–C bog\'i',
  cnBond: 'C–N bog\'i',
  ringPuckering: 'Halqaning burishishi',
  ringSize: 'Halqa o\'lchami',
  chiralRecognition: 'Xiral tanish',
  chiralInversion: 'Xiral inversiya',
  macrocyclicEffect: 'Makrosiklik effekt',
  kineticEffect: 'Kinetik effekt',
  racemicMixture: 'Rasemik aralashma',
  historicalNote: 'Tarixiy izoh',
  nitritoComparison: 'Nitrito izomer bilan taqqoslash',
  uniqueToNitrito: 'Faqat nitritoda',
  marcusLimit: 'Markus chegarasi',
  magneticAnisotropy: 'Magnit anizotropiyasi',
  rayDuttTwist: 'Rey–Datt burilishi',
  bailarTwist: 'Beylar burilishi',
  contactShift: 'Kontakt siljish',
  pseudoContactShift: 'Psevdokontakt siljish',
  curieSpin: 'Kyuri spin hissasi',
  curieConstant: 'Kyuri doimiysi',
  curieLaw: 'Kyuri qonuni',
  evansMethod: 'Evans usuli',
  muEffective: 'Effektiv magnit moment',
  muEff: 'Effektiv magnit moment',
  selectionRules: 'Tanlash qoidalari',
  logBeta: 'log β',
  logBeta3: 'log β₃',
  logBeta4: 'log β₄',
  logBeta6: 'log β₆',
  whyYellow: 'Nega sariq',
  mlctBand: 'MLCT polosasi',
  standardPotential: 'Standart potensial',
  colorChange: 'Rang o\'zgarishi',
  hmgRecognition: 'HMG oqsili tanishi',
  nmrPt: '¹⁹⁵Pt YaMR',
  xiScale: 'Ξ shkalasi',
  xiFormula: 'Ξ formulasi',
  oldConvention: 'Eski kelishuv',
}
