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

/** Sarlavhali bo'lim kartasi. */
export function Blok({ sarlavha, ikon, children, id }) {
  return (
    <section className="v3-ilmiy-blok" id={id}>
      {sarlavha && (
        <h2>
          {ikon && <span aria-hidden="true">{ikon}</span>}
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
  return (
    <dl className="v3-ilmiy-tarif">
      {toza.map(([k, v]) => (
        <div key={k}>
          <dt>{nomlar[k] || chiroyliNom(k)}</dt>
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
function chiroyliNom(kalit) {
  return kalit
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
}

/** Eng ko'p uchraydigan kalitlarning o'zbekcha nomi. */
export const NOMLAR = {
  metalIon: 'Metall ioni',
  electronConfig: 'Elektron konfiguratsiya',
  dElectrons: 'd-elektronlar soni',
  spinState: 'Spin holati',
  orbitalOccupancy: 'Orbital bandligi',
  unpairedElectrons: 'Juftlashmagan elektronlar',
  magneticMoment: 'Magnit momenti',
  crystalFieldSplitting: 'Kristall maydon bo\'linishi',
  racahParameter: 'Rakah parametri',
  nephelauxeticRatio: 'Nefelauksetik nisbat',
  pairingEnergy: 'Juftlanish energiyasi',
  cfse: 'CFSE',
  cFSE: 'CFSE',
  cfseNet: 'CFSE (netto)',
  spectrochemicalSeries: 'Spektrokimyoviy qator',
  whyLowSpin: 'Nega past spinli',
  whySquarePlanar: 'Nega tekis kvadrat',
  colorOrigin: 'Rangning kelib chiqishi',
  chargeTransfer: 'Zaryad ko\'chishi',
  jahnTellerNote: 'Yan-Teller effekti',
  pointGroup: 'Nuqta guruhi',
  order: 'Guruh tartibi',
  symmetryElements: 'Simmetriya elementlari',
  parentGroup: 'Ona guruh',
  descentInSymmetry: 'Simmetriyaning pasayishi',
  dOrbitalReduction: 'd-orbitallarning yoyilishi',
  nmrEquivalence: 'YaMR ekvivalentligi',
  irActive: 'IQ-faol',
  ramanActive: 'Raman-faol',
  mutualExclusion: 'O\'zaro istisno qoidasi',
  nucleus: 'Yadro',
  spin: 'Spin',
  gamma: 'Gyromagnit nisbat γ',
  naturalAbundance: 'Tabiiy tarqalishi',
  larmor400: 'Larmor chastotasi (9.4 T)',
  shift: 'Kimyoviy siljish',
  referens: 'Referens',
  referencing: 'Referens',
  whyThisShift: 'Nega aynan shunday siljish',
  multiplicity: 'Multipletlik',
  linewidth: 'Chiziq kengligi',
  t1Relaxation: 'T₁ relaksatsiya',
  t2Relaxation: 'T₂ relaksatsiya',
  coupling: 'Bog\'lanish (J)',
  integration: 'Integratsiya',
  solvent: 'Erituvchi',
  sensitivity: 'Sezgirlik',
  csa: 'Kimyoviy siljish anizotropiyasi',
  quadrupoleMoment: 'Kvadrupol momenti',
  quadrupolarBroadening: 'Kvadrupol kengayish',
  detection: 'Qayd etish',
  applications: 'Qo\'llanilishi',
  bondLengths: 'Bog\' uzunliklari',
  bondAngles: 'Bog\' burchaklari',
  transEffect: 'Trans-effekt',
  hydrogenBonding: 'Vodorod bog\'lanishi',
  definition: 'Ta\'rifi',
  mechanism: 'Mexanizmi',
  consequence: 'Natijasi',
  source: 'Manba',
  reaction: 'Reaksiya',
  direction: 'Yo\'nalishi',
  deltaH: 'ΔH°',
  deltaS: 'ΔS°',
  deltaG298: 'ΔG° (298 K)',
  activationEnergy: 'Faollanish energiyasi',
  rateConstant298: 'Tezlik doimiysi (298 K)',
  halfLife: 'Yarim yemirilish davri',
  eyring: 'Eyring parametrlari',
  why: 'Sababi',
  comparison: 'Taqqoslash',
  waterExchange: 'Suv almashinuvi',
  inertness: 'Inertlik',
  isomerization: 'Izomerizatsiya',
  significance: 'Ahamiyati',
  discovery: 'Kashf etilishi',
  synthesisRef: 'Sintez manbai',
  method: 'Usul',
  clinical: 'Klinik ahamiyati',
  catalysis: 'Kataliz',
  kinetics: 'Kinetika',
  hydrolysis: 'Gidroliz',
  chirality: 'Xirallik',
  chelateEffect: 'Xelat effekti',
  redoxProperties: 'Redoks xossalari',
  solidStateNMR: 'Qattiq holat YaMR',
  solventModel: 'Erituvchi modeli',
  frequencies: 'Chastotalar',
}
