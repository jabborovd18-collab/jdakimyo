"use client"

import Link from "next/link"
import Ikon from "@/components/Ikon"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import HAJM from "@/lib/ilmiy-hajm.json"
import { FANLAR, ochiqFanlarSoni } from "@/lib/fanlar"
import { BAZA, YARATUVCHI, TASHKIL_YILI, RASMIY_HISOBLAR, MALUMOT_SANASI } from "@/lib/sayt-malumot"
import { FAQ, FAKTLAR } from "./malumot"

/* ═══════════════════════════════════════════════════════════════════════
   "JDA KIMYO NIMA?" — RASMIY TA'RIF SAHIFASI

   BU SAHIFA NIMA UCHUN BOR. Sun'iy intellekt qidiruvi (ChatGPT Search,
   Perplexity, Google AI Overviews) savolga javob berishdan oldin
   "JDA KIMYO nima?" degan savolga o'zi javob topishi kerak. Saytda
   bunday sahifa yo'q edi: bosh sahifa fan tanlashni taklif qiladi,
   `/ishlashi` esa bo'limlarni tushuntiradi — ikkalasi ham "bu nima"
   degan savolga bir jumlada javob bermaydi.

   `/ishlashi` DAN FARQI. U — QO'LLANMA ("qayerdan boshlash", "nima
   tayyor emas"). Bu sahifa — TA'RIF ("bu nima, kim yaratgan, nechta
   material bor"). Ikkisi bir-birini takrorlamaydi va bir-biriga havola
   beradi.

   QOIDA: bu yerdagi har bir son `lib/ilmiy-hajm.json` yoki
   `lib/sayt-malumot.js` dan keladi. Sahifaga qo'lda son yozilmaydi —
   aks holda kontent o'sganda bu sahifa yolg'on gapira boshlaydi.

   MATN `malumot.js` DA: uni JSON-LD ham o'qiydi (`page.js`), ya'ni
   ekrandagi javob bilan schema'dagi javob doim bir xil bo'ladi.
   ══════════════════════════════════════════════════════════════════════ */

/** Rasmiy hisoblarning ko'rinadigan nomi. Manzillar `lib/sayt-malumot.js` da. */
const HISOB_NOMI = {
  'https://instagram.com/jdakimyo.uz': { nom: 'Instagram · @jdakimyo.uz', ikon: 'ulashish' },
  'https://t.me/jdakimyouz': { nom: 'Telegram kanal · @jdakimyouz', ikon: 'kanal' },
  'https://t.me/jdakimyouzbot': { nom: 'Telegram bot · @jdakimyouzbot', ikon: 'bot' },
  'https://www.youtube.com/@jdakimyouz': { nom: 'YouTube · @jdakimyouz', ikon: 'video' },
}

/** Platformaning imkoniyatlari. Sonlar faqat manbadan keladi. */
const IMKONIYATLAR = [
  {
    ikon: 'kitob',
    nom: "O'quv bo'limi",
    havola: '/oquv',
    izoh:
      "Beshta bosqich: klassifikatsiya, IUPAC nomlanishi, kimyoviy bog'lanish, " +
      'izomeriya va fazoviy tuzilish. Har mavzudan keyin test.',
  },
  {
    ikon: 'mikroskop',
    nom: 'Ilmiy kutubxona',
    havola: '/ilmiy',
    izoh:
      `${HAJM.usullar} ta fiziko-kimyoviy tahlil usuli (IQ, NMR, UB-Vis, Mössbauer, ` +
      `EXAFS va boshqalar), ${HAJM.usulBirikmaTahlili} ta usul × birikma tahlili, ` +
      `${HAJM.mavzular} ta chuqurlashgan mavzu va ${HAJM.birikmalar} ta birikma sahifasi.`,
  },
  {
    ikon: 'kolba',
    nom: 'Virtual laboratoriya',
    havola: '/laboratoriya',
    izoh:
      "Brauzerdagi 3D xona: reagent tanlanadi, idishga quyiladi, natija " +
      `ko'rsatiladi. ${BAZA.reaksiyalar} reaksiya — tenglama, kuzatuv va ` +
      'xavfsizlik belgilari bilan.',
  },
  {
    ikon: 'quiz',
    nom: 'Testlar',
    havola: '/oquv/video-darsliklar/quiz',
    izoh:
      `${BAZA.savollar} savol besh yo'nalish bo'yicha. Natija saqlanadi, xatolar ` +
      "ustida ishlash mumkin. Ustozlar o'z testini tuzadi.",
  },
  {
    ikon: 'ustoz',
    nom: 'Ustoz paneli',
    havola: '/ishlashi',
    izoh:
      "Guruh ochish, o'quvchilarni qabul qilish, o'z testini tuzish (ochiq yoki " +
      "yopiq), vazifa berish va natijalarni ko'rish. Huquqni administratsiya beradi.",
  },
  {
    ikon: 'atom',
    nom: '3D modellar',
    havola: '/ilmiy/birikmalar',
    izoh:
      `${HAJM.modellar3d} ta kompleks birikmaning fazoviy modeli — oktaedrik, ` +
      'tetraedrik va kvadrat tekis tuzilishlar. Sichqoncha bilan aylantiriladi.',
  },
]

export default function Korinish() {
  const [fon, fonTanla] = useFon()
  const ochiq = ochiqFanlarSoni()

  return (
    <main data-fon={fon} className="v3 min-h-screen overflow-x-hidden">

      {/* ═══ SARLAVHA ═══ */}
      <header className="v3-header">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>
            <span className="v3-yol-ajratgich hidden sm:inline">/</span>
            <span className="hidden sm:inline text-[13px] v3-xira truncate">Platforma haqida</span>
          </div>
          <div className="flex items-center gap-2">
            <FonTanlagich fon={fon} tanla={fonTanla} />
            <Link href="/ishlashi" className="v3-tugma">Qo{"'"}llanma</Link>
          </div>
        </div>
      </header>

      {/* ═══ TA'RIF ═══ */}
      <section className="relative">
        <div className="v3-konteyner relative z-10 pt-10 pb-14 md:pt-14 md:pb-20">
          <nav className="v3-yol" aria-label="Yo'l">
            <Link href="/">Bosh sahifa</Link>
            <span className="v3-yol-ajratgich">/</span>
            <span style={{ color: "var(--v3-matn)" }}>JDA KIMYO haqida</span>
          </nav>

          <div className="v3-nishon mb-3">Rasmiy ma{"'"}lumot</div>

          <h1 className="v3-h1" style={{ fontSize: "clamp(34px, 5.5vw, 58px)", maxWidth: "14em" }}>
            JDA KIMYO nima?
          </h1>

          {/* Birinchi paragraf — savolga TO'G'RIDAN-TO'G'RI javob. AI
              qidiruvi ko'pincha aynan shu qismni keltiradi, shuning uchun
              bu yerda kirish so'zi ham, shart ham yo'q: javobning o'zi. */}
          <p className="v3-lid">
            <strong style={{ color: "var(--v3-matn)" }}>JDA KIMYO</strong> — o{"'"}zbek
            tilidagi oliy kimyo ta{"'"}lim platformasi. U koordinatsion (kompleks)
            kimyoni boshlang{"'"}ich mavzulardan chuqur darajagacha o{"'"}rgatadi:
            nazariy materiallar, {HAJM.jamiTahlilVaMavzu} ta ilmiy sahifa,
            {" "}{BAZA.savollar} test savoli, virtual laboratoriya va
            {" "}{HAJM.modellar3d} ta aylantirib ko{"'"}riladigan 3D model.
            Platformani {YARATUVCHI.nom} {TASHKIL_YILI}-yilda boshlagan;
            o{"'"}quv materiallari bepul.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px v3-sonlar">
            {[
              { son: String(HAJM.jamiTahlilVaMavzu), nom: "Ilmiy sahifa" },
              { son: BAZA.savollar, nom: "Test savoli" },
              { son: BAZA.reaksiyalar, nom: "Laboratoriya reaksiyasi" },
              { son: String(HAJM.modellar3d), nom: "3D model" },
            ].map((s) => (
              <div key={s.nom} className="v3-son">
                <div className="v3-son-qiymat">{s.son}</div>
                <div className="v3-son-nom">{s.nom}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAQSAD VA AUDITORIYA ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 01</div>
            <h2 className="v3-h2">Maqsadi va kimlar uchun</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="v3-blok">
            <div className="flex items-center gap-3 mb-3">
              <span className="v3-yonalish-ikon" style={{ marginBottom: 0, width: 38, height: 38 }}>
                <Ikon nom="atom" olcham={19} qalin={1.5} />
              </span>
              <h3 className="v3-yonalish-nom" style={{ marginBottom: 0 }}>Maqsad</h3>
            </div>
            <p className="v3-yonalish-tavsif" style={{ flex: "none" }}>
              Oliy kimyoni o{"'"}zbek tilida, tarjimasiz va soddalashtirilmagan
              holda berish. Bu darajadagi material — kristall maydon nazariyasi,
              Mössbauer va EPR spektroskopiyasi, ligand maydon nazariyasi —
              o{"'"}zbek tilida deyarli yozilmagan.
            </p>
          </div>

          <div className="v3-blok">
            <div className="flex items-center gap-3 mb-3">
              <span className="v3-yonalish-ikon" style={{ marginBottom: 0, width: 38, height: 38 }}>
                <Ikon nom="odamlar" olcham={19} qalin={1.5} />
              </span>
              <h3 className="v3-yonalish-nom" style={{ marginBottom: 0 }}>Kimlar uchun</h3>
            </div>
            <ul className="v3-royxat">
              {[
                "Kimyo yo'nalishidagi talabalar",
                "Mustaqil o'rganayotganlar",
                "Maktab va oliygoh kimyo o'qituvchilari",
                "Olimpiadaga tayyorlanayotgan o'quvchilar",
                'Magistrant va tadqiqotchilar',
              ].map((k) => (
                <li key={k}>
                  <Ikon nom="belgi" olcham={14} qalin={2} />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="v3-blok">
            <div className="flex items-center gap-3 mb-3">
              <span className="v3-yonalish-ikon" style={{ marginBottom: 0, width: 38, height: 38 }}>
                <Ikon nom="qalqon" olcham={19} qalin={1.5} />
              </span>
              <h3 className="v3-yonalish-nom" style={{ marginBottom: 0 }}>Manbalar</h3>
            </div>
            <p className="v3-yonalish-tavsif" style={{ flex: "none" }}>
              Ilmiy qism nufuzli darslik va bazalarga tayanadi: Cotton–Wilkinson,
              Miessler–Tarr, Greenwood–Earnshaw, SDBS spektr bazasi va CSD
              kristallografik bazasi. Virtual laboratoriya reaksiyalari esa hali
              mutaxassis tomonidan tasdiqlanmagan — buni laboratoriya sahifasi
              ham aytadi.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FAKTLAR ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 02</div>
            <h2 className="v3-h2">Qisqa faktlar</h2>
          </div>
          <p className="v3-bosh-izoh">
            Sonlar bazadan o{"'"}lchangan ({BAZA.olchanganSana}) va pastga
            yaxlitlangan: kontent o{"'"}sib boradi, ya{"'"}ni kam aytilgan son
            keyin ham to{"'"}g{"'"}ri bo{"'"}lib qolaveradi.
          </p>
        </div>

        <dl className="v3-faktlar">
          {FAKTLAR().map((f) => (
            <div key={f.nom} className="v3-fakt">
              <dt>{f.nom}</dt>
              <dd>{f.qiymat}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ═══ FANLAR ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 03</div>
            <h2 className="v3-h2">Qaysi fanlar bor</h2>
          </div>
          <p className="v3-bosh-izoh">
            Rejada {FANLAR.length} ta fan, hozircha {ochiq} tasi ochiq. Qolganlari
            yozilmagan va ochiq {"“"}tayyor emas{"”"} deb ko{"'"}rsatiladi —
            bo{"'"}sh sahifa ochib qo{"'"}yilmaydi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FANLAR.map((f) => {
            const ochiqmi = f.holat === 'ochiq'
            const ichi = (
              <>
                <div className="flex items-center gap-2 mb-1.5">
                  <Ikon nom={ochiqmi ? 'ochiq' : 'qulf'} olcham={15} qalin={1.8} />
                  <span className={ochiqmi ? 'v3-tag v3-tag-ochiq' : 'v3-tag v3-tag-yopiq'}>
                    {ochiqmi ? 'Ochiq' : 'Tayyor emas'}
                  </span>
                </div>
                <h3 className="v3-yonalish-nom" style={{ marginBottom: 4, fontSize: 16 }}>{f.nom}</h3>
                <p className="v3-xira text-[12.5px]">{f.qisqa}</p>
              </>
            )

            return ochiqmi ? (
              <Link key={f.slug} href={`/fan/${f.slug}`} className="v3-blok" style={{ display: 'block' }}>
                {ichi}
              </Link>
            ) : (
              <div key={f.slug} className="v3-blok">{ichi}</div>
            )
          })}
        </div>
      </section>

      {/* ═══ IMKONIYATLAR ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 04</div>
            <h2 className="v3-h2">Platforma nima qila oladi</h2>
          </div>
          <p className="v3-bosh-izoh">
            To{"'"}liq xarita va hozircha tayyor bo{"'"}lmagan narsalar
            ro{"'"}yxati — <Link href="/ishlashi">Sayt qanday ishlaydi</Link>{" "}
            sahifasida.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {IMKONIYATLAR.map((b) => (
            <div key={b.nom} className="v3-blok">
              <div className="flex items-center gap-3 mb-3">
                <span className="v3-yonalish-ikon" style={{ marginBottom: 0, width: 38, height: 38 }}>
                  <Ikon nom={b.ikon} olcham={19} qalin={1.5} />
                </span>
                <h3 className="v3-yonalish-nom" style={{ marginBottom: 0 }}>{b.nom}</h3>
              </div>
              <p className="v3-yonalish-tavsif" style={{ flex: "none", marginBottom: 14 }}>{b.izoh}</p>
              <Link href={b.havola} className="v3-blok-havola">
                Ochish
                <Ikon nom="ong" olcham={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 05</div>
            <h2 className="v3-h2">Ko{"'"}p so{"'"}raladigan savollar</h2>
          </div>
        </div>

        {/* `<details>` — javob matni HAR DOIM hujjat ichida turadi.
            Tugma bilan ochiladigan eski usulda javoblarni na qidiruv
            roboti, na ChatGPT ko'ra olardi. */}
        <div className="flex flex-col gap-2">
          {FAQ.map((item, i) => (
            <details key={item.q} className="v3-savol" open={i === 0}>
              <summary>
                <span>{item.q}</span>
                <Ikon nom="past" olcham={17} />
              </summary>
              <p className="v3-javob">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══ RASMIY MANZILLAR ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 06</div>
            <h2 className="v3-h2">Rasmiy manzillar</h2>
          </div>
          <p className="v3-bosh-izoh">
            JDA KIMYO nomidan faqat quyidagi manzillar ish yuritadi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="v3-blok">
            <div className="flex items-center gap-2 mb-1.5">
              <Ikon nom="tashqi" olcham={15} qalin={1.8} />
              <span className="v3-nishon">Rasmiy sayt</span>
            </div>
            <p className="v3-yonalish-nom" style={{ marginBottom: 0, fontSize: 15 }}>www.jdakimyo.uz</p>
          </div>

          {RASMIY_HISOBLAR.map((u) => {
            const h = HISOB_NOMI[u]
            if (!h) return null
            return (
              <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="v3-blok" style={{ display: 'block' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Ikon nom={h.ikon} olcham={15} qalin={1.8} />
                  <span className="v3-nishon">Rasmiy hisob</span>
                </div>
                <p className="v3-yonalish-nom" style={{ marginBottom: 0, fontSize: 15 }}>{h.nom}</p>
              </a>
            )
          })}
        </div>
      </section>

      {/* ═══ YARATUVCHI ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-oyoq-karta">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="v3-nishon mb-2">Yaratuvchi</div>
              <h2 className="v3-h2" style={{ fontSize: "clamp(22px, 3vw, 30px)" }}>
                {YARATUVCHI.nom}
              </h2>
              <p className="v3-yonalish-tavsif mt-2" style={{ flex: "none", maxWidth: "40em" }}>
                Platformani bir kishi yuritadi: kontent, kod va tekshiruv ham.
                Loyiha {TASHKIL_YILI}-yilda boshlangan. Xato topsangiz — qaysi
                sahifada nima noto{"'"}g{"'"}ri ekanini yozing, tezroq tuzatiladi.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <a href={YARATUVCHI.linkedin} target="_blank" rel="noopener noreferrer" className="v3-oyoq-havola">
                <Ikon nom="tashqi" olcham={15} />
                LinkedIn
              </a>
              <a href={YARATUVCHI.telegram} target="_blank" rel="noopener noreferrer" className="v3-oyoq-havola">
                <Ikon nom="telegram" olcham={15} />
                Telegram
              </a>
              <a href={`mailto:${YARATUVCHI.pochta}`} className="v3-oyoq-havola">
                <Ikon nom="pochta" olcham={15} />
                Email
              </a>
              <Link href="/hamkorlik" className="v3-oyoq-havola">
                <Ikon nom="hamkor" olcham={15} />
                Hamkorlik
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OYOQ ═══ */}
      <footer className="v3-oyoq">
        <div className="v3-konteyner py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="v3-orqa">
              <Ikon nom="ong" olcham={15} />
              Bosh sahifa
            </Link>
            <Link href="/ishlashi" className="v3-orqa">
              <Ikon nom="kitob" olcham={15} />
              Sayt qanday ishlaydi
            </Link>
          </div>
          {/* Sana AI qidiruvi uchun muhim: ma'lumot qachonligi ko'rsatilgan
              bo'lsa, u ishonch bilan keltiriladi. */}
          <p className="v3-xira text-xs">
            Ma{"'"}lumot oxirgi marta tekshirilgan:{" "}
            <time dateTime={MALUMOT_SANASI}>{MALUMOT_SANASI}</time>
          </p>
        </div>
      </footer>
    </main>
  )
}
