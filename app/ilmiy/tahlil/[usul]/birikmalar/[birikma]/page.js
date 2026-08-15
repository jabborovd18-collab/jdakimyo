// app/ilmiy/tahlil/[usul]/birikmalar/[birikma]/page.js
//
// BITTA marshrut — barcha "usul × birikma" tahlil sahifalari uchun.
//
// NEGA. Ilgari har kesishma o'z faylida yashagan: YaMR bo'limida 12 ta
// sahifa, jami 20 796 qator, ularning 68% i bir-birining nusxasi edi.
// Bitta ilmiy xatoni tuzatish uchun 12 faylni ochish kerak bo'lardi va
// amalda ular bir-biridan uzilib ketgan: `HeroSection` 31 xil nusxada,
// PDF eksporti 38 faylda takrorlangan.
//
// Endi ma'lumot `data/ilmiy/tahlil/` da, ko'rinish esa shu yerda.
//
// NEGA SERVER KOMPONENT. Eski sahifalar butunlay `"use client"` edi —
// 1 700 qatorlik komponent har bir tashrifchiga JS sifatida yuklanardi,
// holbuki mazmuni statik matn va jadval. Bu yerda `generateStaticParams`
// build paytida HTML yasaydi: telefonda tez ochiladi va Google to'liq
// matnni birinchi so'rovda oladi. Interaktiv qism (spektr simulyatori)
// keyinchalik alohida `"use client"` orolcha sifatida qo'shiladi.
//
// NEGA `[usul]` DINAMIK, LEKIN 19 TA USUL HALI ESKICHA ISHLAYAPTI.
// Next.js'da statik papka dinamik segmentdan ustun turadi. Ya'ni
// `app/ilmiy/tahlil/raman/` mavjud ekan, bu marshrut raman uchun ishga
// tushmaydi. Usulni ko'chirib bo'lgach eski papka o'chiriladi va
// marshrut o'sha usul uchun "yonadi". Har usul mustaqil ko'chadi,
// oradagi holatda sayt hech qachon buzilmaydi.

import { notFound } from 'next/navigation'
import { USULLAR, USUL_KALITLARI } from '@/data/ilmiy/tahlil/_usullar'
import { MALUMOTLAR, birikmaniOl } from '@/data/ilmiy/tahlil/indeks'
import IlmiyBoshPanel from '@/components/ilmiy/IlmiyBoshPanel'
import {
  Blok,
  Panel,
  Grid,
  Lavha,
  Jadval,
  Tarif,
  Belgi,
  Eslatma,
  Qadamlar,
  Navigatsiya,
  Formula,
  htmlBormi,
  NOMLAR,
} from '@/components/ilmiy/Qobiq'

/**
 * Build paytida yasaladigan sahifalar ro'yxati.
 *
 * Faqat ma'lumoti KO'CHIRILGAN usullar tushadi — `MALUMOTLAR` da
 * bo'lmagan usul bu yerga umuman kelmaydi.
 */
export function generateStaticParams() {
  const natija = []
  for (const usul of Object.keys(MALUMOTLAR)) {
    for (const birikma of Object.keys(MALUMOTLAR[usul])) {
      natija.push({ usul, birikma })
    }
  }
  return natija
}

/**
 * Ro'yxatda yo'q manzil 404 bersin.
 *
 * Nega muhim: aks holda `/ilmiy/tahlil/nmr/birikmalar/xato-nom` bo'sh,
 * lekin 200 javobli sahifa qaytarardi va Google uni indekslab olardi.
 */
export const dynamicParams = false

/** HTML teglarini olib tashlaydi — metadata'da ular matn bo'lib ko'rinadi. */
function sof(matn) {
  return String(matn || '').replace(/<[^>]*>/g, '')
}

export async function generateMetadata({ params }) {
  const { usul, birikma } = await params
  const u = USULLAR[usul]
  const m = birikmaniOl(usul, birikma)
  if (!u || !m) return {}

  const formula = sof(m.formulaHTML)
  return {
    title: `${formula} — ${u.nom} tahlili`,
    description:
      `${formula} (${m.iupac}) birikmasining ${u.toliqNom.toLowerCase()} tahlili: ` +
      `${sof(m.nmrNucleus || m.structure)}, simmetriya ${m.pointGroup}, ` +
      `kristall maydon parametrlari va laboratoriya tartibi.`,
    alternates: {
      canonical: `/ilmiy/tahlil/${usul}/birikmalar/${birikma}`,
    },
  }
}

export default async function TahlilSahifasi({ params }) {
  const { usul, birikma } = await params
  const u = USULLAR[usul]
  const m = birikmaniOl(usul, birikma)
  if (!u || !m) notFound()

  // Oldingi/keyingi — `_usullar.js` dagi o'quv tartibi bo'yicha.
  // Alifbo tartibida emas: mavzu Verner klassikasidan murakkabroq
  // holatlarga qarab o'sadi va havolalar shu yo'lni saqlashi kerak.
  const tartib = u.tartib || Object.keys(MALUMOTLAR[usul])
  const orin = tartib.indexOf(birikma)
  const qoshni = (i) => {
    const k = tartib[i]
    if (!k) return null
    const b = birikmaniOl(usul, k)
    if (!b) return null
    return { nom: b.formulaHTML, havola: `/ilmiy/tahlil/${usul}/birikmalar/${k}` }
  }

  return (
    <main className="v3-ilmiy">
      <IlmiyBoshPanel
        bandlar={[
          { nom: 'Ilmiy', havola: '/ilmiy' },
          { nom: 'Tahlil usullari', havola: '/ilmiy/tahlil' },
          { nom: u.nom, havola: `/ilmiy/tahlil/${usul}` },
          { nom: 'Birikmalar', havola: `/ilmiy/tahlil/${usul}/birikmalar` },
          { nom: sof(m.formulaHTML) },
        ]}
      />

      {/* ─── Hero ─── */}
      <header className="v3-ilmiy-hero">
        <div className="v3-ilmiy-formula">
          <Formula html={m.formulaHTML} />
        </div>
        <p className="v3-ilmiy-iupac">{m.iupac}</p>
        {m.commonName && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Belgi turi="urgu">{m.commonName}</Belgi>
            {m.color && <Belgi>{m.color}</Belgi>}
            {m.structure && <Belgi turi="ikkinchi">{m.structure}</Belgi>}
          </div>
        )}

        <Grid ustun={4} className="mt-5" >
          <Lavha nom="Molyar massa" qiymat={`${m.molarMass} g/mol`} />
          <Lavha nom="CAS raqami" qiymat={m.casNumber} />
          <Lavha nom="Nuqta guruhi" qiymat={m.pointGroup} />
          <Lavha nom="Elektrolit turi" qiymat={m.electrolyteType} />
        </Grid>
      </header>

      {/* ─── Asosiy ko'rsatkichlar ─── */}
      <Blok sarlavha="Asosiy ma'lumot" ikon="royxat">
        <Tarif
          nomlar={{
            formulaPlain: 'Oddiy yozuvda',
            metalLigand: 'Metall–ligand bog\'i',
            molarConductivity: 'Molyar elektr o\'tkazuvchanligi',
            solubility: 'Eruvchanligi',
            saltFormulaHTML: 'Tuz shakli',
            saltMolarMass: 'Tuzning molyar massasi',
            molarMassWithCl3: 'Xlorid tuzining molyar massasi',
            color: 'Rangi',
            structure: 'Tuzilishi',
            nmrNucleus: 'O\'lchanadigan yadrolar',
            chemicalShift: 'Kimyoviy siljish',
            multiplicity: 'Multipletlik',
            jCoupling: 'Bog\'lanish doimiysi J',
          }}
          bandlar={[
            ['structure', m.structure],
            ['metalLigand', m.metalLigand],
            ['color', m.color],
            ['formulaPlain', m.formulaPlain],
            ['molarConductivity', m.molarConductivity],
            ['solubility', m.solubility],
            ['saltFormulaHTML', m.saltFormulaHTML],
            ['saltMolarMass', m.saltMolarMass ? `${m.saltMolarMass} g/mol` : null],
            ['molarMassWithCl3', m.molarMassWithCl3 ? `${m.molarMassWithCl3} g/mol` : null],
            // Quyidagi to'rttasi faqat ba'zi birikmalarda bor (5/12).
            // Ular usulning qisqa xulosasi — nazariya blokidan oldin
            // o'qilishi kerak, shuning uchun shu yerda.
            ['nmrNucleus', m.nmrNucleus],
            ['chemicalShift', m.chemicalShift],
            ['multiplicity', m.multiplicity],
            ['jCoupling', m.jCoupling],
          ]}
        />
      </Blok>

      {/* ─── Tarix ─── */}
      {m.history && (
        <Blok sarlavha="Tarixiy kontekst" ikon="kitob">
          <Grid ustun={Object.keys(m.history).length >= 3 ? 3 : 2}>
            {Object.entries(m.history).map(([kalit, qiymat]) => (
              <Panel key={kalit} sarlavha={chiroyli(kalit)}>
                {typeof qiymat === 'object' ? (
                  <Tarif bandlar={qiymat} nomlar={NOMLAR} />
                ) : (
                  <p style={{ fontSize: 12.5, lineHeight: 1.6 }}>{qiymat}</p>
                )}
              </Panel>
            ))}
          </Grid>
        </Blok>
      )}

      {/* ─── Kristall maydon ─── */}
      {m.crystalField && (
        <Blok sarlavha="Kristall maydon nazariyasi" ikon="kristall">
          <Grid ustun={4} className="mb-4">
            <Lavha nom="Metall ioni" qiymat={m.crystalField.metalIon} />
            <Lavha nom="Konfiguratsiya" qiymat={m.crystalField.electronConfig} />
            <Lavha nom="Spin holati" qiymat={m.crystalField.spinState} />
            <Lavha
              nom="Juftlashmagan e⁻"
              qiymat={String(m.crystalField.unpairedElectrons ?? '—')}
            />
          </Grid>
          <Tarif bandlar={qolganlari(m.crystalField, ['metalIon', 'electronConfig', 'spinState', 'unpairedElectrons'])} nomlar={NOMLAR} />
        </Blok>
      )}

      {/* ─── Simmetriya ─── */}
      {m.symmetry && (
        <Blok sarlavha="Simmetriya va tanlash qoidalari" ikon="simmetriya">
          {m.symmetry.symmetryElements && (
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
              {m.symmetry.symmetryElements.map((e, i) => (
                <Belgi key={i} turi="ikkinchi">{e}</Belgi>
              ))}
            </div>
          )}
          <Tarif
            bandlar={qolganlari(m.symmetry, ['symmetryElements', 'characterTable'])}
            nomlar={NOMLAR}
          />
          {m.symmetry.characterTable && (
            <div style={{ marginTop: 18 }}>
              <h3>Xarakterlar jadvali</h3>
              <XarakterlarJadvali jadval={m.symmetry.characterTable} />
            </div>
          )}
        </Blok>
      )}

      {/* ─── Usulga xos nazariya (YaMR yadrolari) ─── */}
      {m.nmrTheory && (
        <Blok sarlavha={`${u.nom} nazariyasi`} ikon={u.ikon}>
          {Object.entries(m.nmrTheory).map(([yadro, malumot]) => (
            <div key={yadro} style={{ marginBottom: 20 }}>
              <h3>{malumot.nucleus || chiroyli(yadro)}</h3>
              <Tarif bandlar={qolganlari(malumot, ['nucleus'])} nomlar={NOMLAR} />
            </div>
          ))}
        </Blok>
      )}

      {/* ─── Signal jadvali ─── */}
      {m.nmrSignals?.length > 0 && (
        <Blok sarlavha="Signallar jadvali" ikon="jadval">
          <Jadval
            ustunlar={jadvalUstunlari(m.nmrSignals, {
              nucleus: 'Yadro',
              ligand: 'Ligand',
              shift: 'δ (ppm)',
              multiplicity: 'Multipletlik',
              jCoupling: 'J (Hz)',
              integration: 'Integratsiya',
              notes: 'Izoh',
              assignment: 'Tayinlash',
            })}
            qatorlar={m.nmrSignals}
          />
        </Blok>
      )}

      {/* ─── Strukturaviy parametrlar ─── */}
      {(m.structuralData || m.structural) && (
        <Blok sarlavha="Strukturaviy parametrlar" ikon="olcham">
          {Object.entries(m.structuralData || m.structural).map(([bolim, qiymat]) => (
            <div key={bolim} style={{ marginBottom: 18 }}>
              <h3>{NOMLAR[bolim] || chiroyli(bolim)}</h3>
              {typeof qiymat === 'object' ? (
                <Tarif bandlar={qiymat} nomlar={NOMLAR} />
              ) : (
                <p style={{ fontSize: 12.5, lineHeight: 1.6 }}>{qiymat}</p>
              )}
            </div>
          ))}
        </Blok>
      )}

      {/* ─── Termodinamika ─── */}
      {m.thermodynamics && (
        <Blok sarlavha="Termodinamika va kinetika" ikon="harorat">
          {Object.entries(m.thermodynamics).map(([bolim, qiymat]) => (
            <div key={bolim} style={{ marginBottom: 18 }}>
              <h3>{NOMLAR[bolim] || chiroyli(bolim)}</h3>
              {typeof qiymat === 'object' ? (
                <Tarif bandlar={qiymat} nomlar={NOMLAR} />
              ) : (
                <p style={{ fontSize: 12.5, lineHeight: 1.6 }}>{qiymat}</p>
              )}
            </div>
          ))}
        </Blok>
      )}

      {/* ─── Taqqoslash ─── */}
      {Array.isArray(m.comparison) && m.comparison.length > 0 && (
        <Blok sarlavha="Boshqa komplekslar bilan taqqoslash" ikon="tarozi">
          <Jadval
            ustunlar={jadvalUstunlari(m.comparison, {
              compound: 'Birikma',
              ligand: 'Ligand',
              color: 'Rangi',
              symmetry: 'Simmetriya',
              nmrShift: 'δ (ppm)',
              stability: 'Barqarorlik',
              note: 'Izoh',
            })}
            qatorlar={m.comparison}
          />
        </Blok>
      )}

      {/* ─── Halaqit beruvchi omillar ─── */}
      {Array.isArray(m.interferences) && m.interferences.length > 0 && (
        <Blok sarlavha="Halaqit beruvchi omillar" ikon="ogohlantirish">
          <Jadval
            ustunlar={jadvalUstunlari(m.interferences, {
              source: 'Manba',
              effect: 'Ta\'siri',
              severity: 'Darajasi',
              solution: 'Yechim',
              theoryNote: 'Nazariy izoh',
            })}
            qatorlar={m.interferences}
          />
        </Blok>
      )}

      {/* ─── Laboratoriya tartibi ─── */}
      {Array.isArray(m.labProcedure) && m.labProcedure.length > 0 && (
        <Blok sarlavha="Laboratoriya tartibi" ikon="kolba">
          <ol className="v3-ilmiy-qadamlar">
            {m.labProcedure.map((q, i) => (
              <li className="v3-ilmiy-qadam" key={i}>
                <span className="v3-ilmiy-qadam-raqam" aria-hidden="true" />
                <div className="v3-ilmiy-qadam-matn">
                  {q.title && <strong>{q.title}</strong>}
                  {q.time && <Belgi>{q.time}</Belgi>}
                  {q.desc && <p style={{ marginTop: 4 }}>{q.desc}</p>}
                  {/*
                    `theoryNote` va `theory` — bir xil ma'nodagi ikki
                    nom. Ular 12 birikmada aralash ishlatilgan (ba'zisi
                    biri bilan, ba'zisi ikkinchisi). Faqat bittasini
                    chizganimda 19 ta nazariy izoh sahifadan yo'qolgan
                    edi. Nomlarni ma'lumot faylida birlashtirmadim:
                    bosqich vazifasi — ko'chirish, mazmunni tahrirlash
                    emas.
                  */}
                  {(q.theoryNote || q.theory) && (
                    <p style={{ marginTop: 6, opacity: 0.72, fontSize: 11.5 }}>
                      {q.theoryNote || q.theory}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Blok>
      )}

      {/* ─── Kengaytiruvchi metodlar ─── */}
      {Array.isArray(m.advancedTechniques) && m.advancedTechniques.length > 0 && (
        <Blok sarlavha="Kengaytiruvchi metodlar" ikon="mikroskop">
          <Grid ustun={2}>
            {m.advancedTechniques.map((t, i) => (
              <Panel key={i} sarlavha={t.name}>
                {t.description && (
                  <p style={{ fontSize: 12.5, lineHeight: 1.6, marginBottom: 10 }}>{t.description}</p>
                )}
                <Tarif
                  nomlar={{
                    advantages: 'Afzalligi',
                    disadvantages: 'Kamchiligi',
                    bestFor: 'Qachon qo\'llanadi',
                    examples: 'Misollar',
                  }}
                  bandlar={qolganlari(t, ['name', 'description'])}
                />
              </Panel>
            ))}
          </Grid>
        </Blok>
      )}

      {/* ─── Qattiq holat YaMR ─── */}
      {m.solidStateNMR && (
        <Blok sarlavha="Qattiq holat YaMR" ikon="panjara">
          <Tarif bandlar={m.solidStateNMR} nomlar={NOMLAR} />
        </Blok>
      )}

      {/* ─── Spektr jadvallari ─── */}
      {SPEKTR_KALITLARI.filter((k) => Array.isArray(m[k]) && m[k].length).map((k) => (
        <Blok key={k} sarlavha={SPEKTR_NOMLARI[k] || chiroyli(k)} ikon="spektr">
          <Jadval
            ustunlar={jadvalUstunlari(m[k], {
              ppm: 'δ (ppm)',
              intensity: 'Intensivlik',
              notes: 'Izoh',
              assignment: 'Tayinlash',
            })}
            qatorlar={m[k]}
          />
        </Blok>
      ))}

      {/*
        ─── Qolgan barcha bo'limlar ───

        NEGA UMUMIY CHIZG'ICH. Yuqoridagi bloklar 12 birikmaning
        HAMMASIDA bor. Lekin har birikmada o'ziga xos bo'limlar ham
        bor: sisplatinda `clinical`, Wilkinson katalizatorida
        `catalysis`, [Co(en)₃]³⁺ da `chirality`, [Al(H₂O)₆]³⁺ da
        `hydrolysis`. Ularni qo'lda sanab chiqsam, yangi birikma
        qo'shilganda uning o'ziga xos bo'limi jimgina yo'qolardi —
        aynan shu hol birinchi urinishda yuz berdi va
        `scripts/tahlil-matn-surat.mjs` uni 344 ta matn bo'yicha
        tutdi.

        Endi tartib teskari: nima ATAYLAB chizilgani ro'yxatga
        olinadi, qolgani esa avtomatik chiqadi. Shunda yo'qotish
        strukturaviy jihatdan mumkin emas.
      */}
      {qolganBolimlar(m).map(([kalit, qiymat]) => (
        <Blok key={kalit} sarlavha={NOMLAR[kalit] || chiroyli(kalit)} ikon="bolim">
          {Array.isArray(qiymat) ? (
            typeof qiymat[0] === 'object' ? (
              <Jadval ustunlar={jadvalUstunlari(qiymat, NOMLAR)} qatorlar={qiymat} />
            ) : (
              <ul className="v3-ilmiy-tarif">
                {qiymat.map((x, i) => (
                  <li key={i} style={{ fontSize: 12.5, lineHeight: 1.6 }}>
                    {String(x)}
                  </li>
                ))}
              </ul>
            )
          ) : (
            <IchkiBolim qiymat={qiymat} />
          )}
        </Blok>
      ))}

      <Navigatsiya oldingi={qoshni(orin - 1)} keyingi={qoshni(orin + 1)} />
    </main>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Yordamchilar
   ───────────────────────────────────────────────────────────────── */

/** Spektr nuqtalari jadvali sifatida chiziladigan kalitlar. */
const SPEKTR_KALITLARI = ['nmrSpectrum', 'pt195Spectrum', 'al27Spectrum', 'p31Spectrum']

const SPEKTR_NOMLARI = {
  nmrSpectrum: '¹H spektr nuqtalari',
  pt195Spectrum: '¹⁹⁵Pt spektr nuqtalari',
  al27Spectrum: '²⁷Al spektr nuqtalari',
  p31Spectrum: '³¹P spektr nuqtalari',
}

/**
 * Yuqorida ATAYLAB chizilgan kalitlar.
 *
 * Bu ro'yxat "oq ro'yxat" emas, aksincha — u faqat TAKRORLANMASLIK
 * uchun kerak. Bu yerda bo'lmagan har qanday kalit sahifa oxirida
 * o'z-o'zidan chiqadi.
 */
const CHIZILGAN = new Set([
  'formulaHTML', 'formulaPlain', 'iupac', 'commonName', 'molarMass', 'casNumber',
  'color', 'structure', 'metalLigand', 'pointGroup', 'electrolyteType',
  'molarConductivity', 'solubility', 'saltFormulaHTML', 'saltMolarMass',
  'molarMassWithCl3', 'crystalField', 'symmetry', 'nmrTheory', 'nmrSignals',
  'structuralData', 'structural', 'thermodynamics', 'comparison', 'interferences',
  'labProcedure', 'advancedTechniques', 'solidStateNMR', 'history',
  ...SPEKTR_KALITLARI,
  // Hero va "Asosiy ma'lumot" da ko'rsatilgan qisqa maydonlar
  'nmrNucleus', 'chemicalShift', 'multiplicity', 'jCoupling',
])

/** Hali chizilmagan yuqori darajali bo'limlarni qaytaradi. */
function qolganBolimlar(m) {
  return Object.entries(m).filter(([k, v]) => {
    if (CHIZILGAN.has(k)) return false
    if (v === null || v === undefined || v === '') return false
    return true
  })
}

/**
 * Ichma-ich joylashgan bo'limni chizadi.
 *
 * Ma'lumotning chuqurligi bir xil emas: `catalysis.mechanism` — bu
 * obyekt ichida obyekt, `clinical.sideEffects` esa massiv. Shuning
 * uchun tur bo'yicha rekursiv chiziladi, aks holda `[object Object]`
 * chiqardi.
 */
function IchkiBolim({ qiymat, chuqurlik = 0 }) {
  if (qiymat === null || qiymat === undefined) return null

  if (typeof qiymat !== 'object') {
    return <p style={{ fontSize: 12.5, lineHeight: 1.6 }}>{String(qiymat)}</p>
  }

  if (Array.isArray(qiymat)) {
    if (typeof qiymat[0] === 'object' && qiymat[0] !== null) {
      return <Jadval ustunlar={jadvalUstunlari(qiymat, NOMLAR)} qatorlar={qiymat} />
    }
    return (
      <ul className="v3-ilmiy-tarif">
        {qiymat.map((x, i) => (
          <li key={i} style={{ fontSize: 12.5, lineHeight: 1.6 }}>
            {String(x)}
          </li>
        ))}
      </ul>
    )
  }

  // Obyekt: sodda qiymatlar ta'rif ro'yxatiga, murakkablari ichki
  // panelga ajratiladi. Aks holda uzun matn jadval katakchasiga
  // siqilib, o'qib bo'lmas holga kelardi.
  const sodda = []
  const murakkab = []
  for (const [k, v] of Object.entries(qiymat)) {
    if (v === null || v === undefined || v === '') continue
    if (typeof v === 'object') murakkab.push([k, v])
    else sodda.push([k, v])
  }

  return (
    <>
      {sodda.length > 0 && <Tarif bandlar={sodda} nomlar={NOMLAR} />}
      {murakkab.map(([k, v]) => (
        <div key={k} style={{ marginTop: 16 }}>
          {chuqurlik === 0 ? (
            <Panel sarlavha={NOMLAR[k] || chiroyli(k)}>
              <IchkiBolim qiymat={v} chuqurlik={chuqurlik + 1} />
            </Panel>
          ) : (
            <>
              <h3>{NOMLAR[k] || chiroyli(k)}</h3>
              <IchkiBolim qiymat={v} chuqurlik={chuqurlik + 1} />
            </>
          )}
        </div>
      ))}
    </>
  )
}

/** Obyektdan sanab o'tilgan kalitlarni olib tashlaydi. */
function qolganlari(obyekt, tashlanadigan) {
  const natija = []
  for (const [k, v] of Object.entries(obyekt || {})) {
    if (tashlanadigan.includes(k)) continue
    if (v === null || v === undefined || v === '') continue
    natija.push([k, Array.isArray(v) ? v.join(' · ') : v])
  }
  return natija
}

/** `camelCase` → "Camel case". */
function chiroyli(kalit) {
  return kalit.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (s) => s.toUpperCase())
}

/**
 * Jadval ustunlarini QATORLARDAN aniqlaydi.
 *
 * Nega qattiq ro'yxat emas: 12 birikmaning jadvallarida maydonlar
 * to'plami har xil (masalan `integration` faqat ba'zilarida bor).
 * Qattiq yozilsa, ba'zi sahifada bo'sh ustun, boshqasida esa
 * ko'rinmay qolgan ma'lumot paydo bo'lardi.
 */
function jadvalUstunlari(qatorlar, nomlar) {
  const kalitlar = []
  for (const q of qatorlar) {
    for (const k of Object.keys(q)) {
      if (!kalitlar.includes(k)) kalitlar.push(k)
    }
  }
  return kalitlar.map((k) => ({ kalit: k, nom: nomlar[k] || chiroyli(k) }))
}

/** Xarakterlar jadvali — simmetriya guruhining tasvirlari. */
function XarakterlarJadvali({ jadval }) {
  const qatorlar = Object.entries(jadval)
  if (!qatorlar.length) return null

  // Ustunlar birinchi qatordan olinadi: har guruhda simmetriya
  // amallari to'plami boshqacha (Oₕ da 10 ta, C₄ᵥ da 5 ta).
  const ustunlar = Object.keys(qatorlar[0][1])

  return (
    <div className="v3-ilmiy-jadval-qobiq">
      <table className="v3-ilmiy-jadval">
        <thead>
          <tr>
            <th>Tasvir</th>
            {ustunlar.map((u) => (
              <th key={u}>{u === 'functions' ? 'Funksiyalar' : u}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {qatorlar.map(([nom, qiymatlar]) => (
            <tr key={nom}>
              <td style={{ fontWeight: 700 }}>{nom}</td>
              {ustunlar.map((u) => (
                <td key={u} className={u === 'functions' ? undefined : 'son'}>
                  {String(qiymatlar[u] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
