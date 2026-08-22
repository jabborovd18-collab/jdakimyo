"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import Ikon from "@/components/Ikon"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import HAJM from "@/lib/ilmiy-hajm.json"
import { BAZA } from "@/lib/sayt-malumot"
import { FANLAR, ochiqFanlarSoni } from "@/lib/fanlar"
import { FAQ } from "./faq"

/* ─────────────────────────────────────────────────────────────────────
   SONLAR

   Fayldan keladiganlar `HAJM` orqali — ular sahifa qo'shilganda o'zi
   yangilanadi (`scripts/count-ilmiy.js`).

   Bazadan o'lchanganlar `BAZA` orqali (`lib/sayt-malumot.js`). Ilgari
   ular shu faylda qo'lda yozilardi; "JDA KIMYO nima?" sahifasi ham
   aynan shu sonlarni ko'rsatgani uchun ikkinchi nusxa paydo bo'lardi
   va ikkalasi ajralib ketardi (AGENTS.md 1-band).
   ──────────────────────────────────────────────────────────────────── */

/* Platformaning xaritasi. Har bir blok — sayt haqiqatan nima qila
   olishini aytadi, va'da emas. `tayyor: false` bo'lgan qatorlar ochiq
   "hali yo'q" deb belgilanadi. */
const XARITA = [
  {
    ikon: "atom",
    nom: "Fanlar",
    izoh:
      "Sayt oliy kimyoni fanlarga bo'lib beradi. Har bir fanning o'z o'quv va ilmiy daraxti bor.",
    havola: "/#fanlar",
    havolaNom: "Fanlarni ko'rish",
    qatorlar: [
      { matn: "Koordinatsion kimyo — o'quv va ilmiy daraxti bilan to'liq ochiq", tayyor: true },
      { matn: "Anorganik, organik, analitik, fizikaviy, kolloid kimyo, biokimyo", tayyor: false },
    ],
  },
  {
    ikon: "kitob",
    nom: "O'quv bo'lim",
    izoh:
      "Asoslardan boshlanadigan qism. Mavzular bir-birining ustiga quriladi, har birida sxema va 3D model bor.",
    havola: "/oquv",
    havolaNom: "O'quv bo'limga o'tish",
    qatorlar: [
      { matn: "Klassifikatsiya va IUPAC nomlanishi", tayyor: true },
      { matn: "Kimyoviy bog'lanish nazariyalari", tayyor: true },
      { matn: "Izomeriya va fazoviy tuzilish", tayyor: true },
      { matn: `${HAJM.modellar3d} ta aylantirib ko'riladigan 3D model`, tayyor: true },
    ],
  },
  {
    ikon: "grafik",
    nom: "Ilmiy kutubxona",
    izoh:
      "Tadqiqotchi uchun qism. Har bir tahlil usuli quruq nazariya emas, aniq birikmada qanday o'qilishi bilan ko'rsatilgan.",
    havola: "/ilmiy",
    havolaNom: "Kutubxonaga o'tish",
    qatorlar: [
      { matn: `${HAJM.usullar} ta tahlil usuli, ${HAJM.usulBirikmaTahlili} ta usul × birikma tahlili`, tayyor: true },
      { matn: `${HAJM.mavzular} ta chuqurlashgan mavzu (${HAJM.mavzuSahifalari} sahifa)`, tayyor: true },
      { matn: `${HAJM.birikmalar} ta birikmaning to'liq sahifasi`, tayyor: true },
      { matn: "Maqolalar bazasi va o'z maqolangizni DOCX bilan yuklash", tayyor: true },
    ],
  },
  {
    ikon: "quiz",
    nom: "Testlar",
    izoh:
      "Bilimni sinash qismi. Natijalar hisobingizda saqlanadi, har birini PDF qilib olsa bo'ladi.",
    havola: "/oquv/video-darsliklar",
    havolaNom: "Testlarga o'tish",
    qatorlar: [
      { matn: `${BAZA.savollar} savol, 5 yo'nalish bo'yicha`, tayyor: true },
      { matn: "Natijalar tarixi va PDF hisobot", tayyor: true },
      { matn: "Ustozlar tuzgan ochiq va yopiq testlar", tayyor: true },
      { matn: "Video darsliklar — tayyorlanmoqda", tayyor: false },
    ],
  },
  {
    ikon: "kolba",
    nom: "Virtual laboratoriya",
    izoh:
      "Sayt ichidagi alohida dunyo: reagent yig'asiz, jihoz olasiz va tajriba o'tkazasiz. Reaksiya nima berishini oldindan aytib bo'lmaydi — ko'rasiz.",
    havola: "/laboratoriya",
    havolaNom: "Laboratoriyaga kirish",
    qatorlar: [
      { matn: `${BAZA.katalog} modda va jihoz katalogi`, tayyor: true },
      { matn: `${BAZA.reaksiyalar} reaksiya, tenglama va kuzatuv bilan`, tayyor: true },
      { matn: "Inventar, do'kon, sandiqlar va ichki valyuta", tayyor: true },
      { matn: "Uch o'lchamli laboratoriya xonasi (faqat kompyuterda)", tayyor: true },
    ],
  },
  {
    ikon: "ustoz",
    nom: "Ustoz va guruh",
    izoh:
      "O'qituvchi uchun ish o'rni. Guruh tuzasiz, vazifa berasiz va kim nima qilganini bir joyda ko'rasiz.",
    havola: "/ustoz",
    havolaNom: "Ustoz paneli",
    qatorlar: [
      { matn: "Guruhlar, talabalar va ularning natijalari", tayyor: true },
      { matn: "Vazifa berish va topshiriqlarni tekshirish", tayyor: true },
      { matn: "O'z testingizni tuzish — ochiq yoki yopiq", tayyor: true },
      { matn: "E'lonlar va ustozning ommaviy profili", tayyor: true },
    ],
  },
  {
    ikon: "doska",
    nom: "Elektron doska",
    izoh:
      "Auditoriya uchun. Doskaga QR kod chiqadi, talabalar telefonidan qo'shiladi — hisob ochish shart emas.",
    havola: "/doska",
    havolaNom: "Doskani ochish",
    qatorlar: [
      { matn: "QR orqali sessiyaga qo'shilish", tayyor: true },
      { matn: "Katta ekran uchun mo'ljallangan ko'rinish", tayyor: true },
    ],
  },
  {
    ikon: "muhokama",
    nom: "Jamoa",
    izoh:
      "Sayt yolg'iz o'qish joyi emas. Savol berish, ulashish va bir-birini kuzatish shu yerda.",
    havola: "/ilmiy/maqolalar/muhokama",
    havolaNom: "Dolzarb mavzular",
    qatorlar: [
      { matn: "Dolzarb mavzular — savol-javob va muhokama", tayyor: true },
      { matn: "Do'stlar, obuna, shaxsiy yozishmalar", tayyor: true },
      { matn: "Ustoz va tashkilotlarning kanallari", tayyor: true },
    ],
  },
  {
    ikon: "yulduz",
    nom: "Hisob va yutuqlar",
    izoh:
      "Hisob ochilgach sayt sizni eslab qoladi: nimani o'qidingiz, qaysi testni topshirdingiz, qancha kun ketma-ket kirdingiz.",
    havola: "/profil",
    havolaNom: "Shaxsiy kabinet",
    qatorlar: [
      { matn: `${BAZA.yutuqlar} turdagi yutuq va reyting`, tayyor: true },
      { matn: "Kunlik missiyalar, ketma-ketlik va sovg'a", tayyor: true },
      { matn: "Sertifikatlar va bildirishnomalar", tayyor: true },
      { matn: "Tasdiq belgisi va profil bezaklari", tayyor: true },
    ],
  },
  {
    ikon: "bot",
    nom: "Telegram bot",
    izoh:
      "@jdakimyouzbot hisobingizga ulanadi va saytdan chiqmasdan xabar oladigan qiladi. Guruhga qo'shilsa, guruhga ham ishlaydi.",
    havola: "https://t.me/jdakimyouzbot",
    havolaNom: "Botni ochish",
    tashqi: true,
    qatorlar: [
      { matn: "Hisobni ulash va bildirishnomalarni Telegramda olish", tayyor: true },
      { matn: "Guruhga kunlik iqtibos va yangiliklar", tayyor: true },
      { matn: "Guruhda test javoblarini qabul qilish", tayyor: true },
    ],
  },
]

/* Kim qayerdan boshlashi kerak. Eski sahifadagi "5 qadam" hamma uchun
   bir xil edi va shuning uchun hech kimga to'g'ri kelmasdi. */
const YOLLAR = [
  {
    ikon: "kitob",
    kim: "Talaba",
    tavsif: "Birinchi marta koordinatsion kimyo o'qiyapsiz",
    qadamlar: [
      { matn: "Hisob oching — natijalaringiz saqlanib boradi", havola: "/register" },
      { matn: "O'quv bo'limdan boshlang: klassifikatsiya va nomlanish", havola: "/oquv" },
      { matn: "Har mavzudan keyin testdan o'ting", havola: "/oquv/video-darsliklar/quiz" },
      { matn: "Laboratoriyada o'rgangan reaksiyangizni sinab ko'ring", havola: "/laboratoriya" },
    ],
  },
  {
    ikon: "ustoz",
    kim: "O'qituvchi",
    tavsif: "Guruhingiz bilan ishlamoqchisiz",
    qadamlar: [
      { matn: "Hisob oching va ustozlik huquqini so'rang", havola: "/register" },
      { matn: "Ustoz panelida guruh tuzing va talabalarni qo'shing", havola: "/ustoz" },
      { matn: "O'z testingizni tuzing yoki vazifa bering", havola: "/ustoz/open-quiz" },
      { matn: "Darsda elektron doskadan foydalaning", havola: "/doska" },
    ],
  },
  {
    ikon: "grafik",
    kim: "Tadqiqotchi",
    tavsif: "Aniq birikma yoki usul kerak",
    qadamlar: [
      { matn: "Qidiruvdan boshlang — Ctrl+K butun saytni qamraydi", havola: "/qidiruv" },
      { matn: "Tahlil usullarini aniq birikmalarda ko'ring", havola: "/ilmiy/tahlil" },
      { matn: "Chuqurlashgan mavzular: nazariya va hisob-kitob", havola: "/ilmiy/chuqurlashgan" },
      { matn: "O'z maqolangizni joylang yoki muhokamaga qo'shiling", havola: "/ilmiy/maqolalar" },
    ],
  },
]

/* Ochiq aytiladigan cheklovlar.
   Bu bo'lim ataylab qo'shildi. Eski sahifaning asosiy nuqsoni — hamma
   narsani tayyor qilib ko'rsatgani edi; odam kirib ko'rgach yolg'onni
   sezardi. Cheklovni o'zing aytsang, qolgan hamma gapingga ishonch
   ortadi. */
const CHEKLOVLAR = [
  {
    nom: "Oltita fan hali yopiq",
    izoh:
      "Hozircha faqat koordinatsion kimyo to'liq yozilgan. Qolgan fanlar bosh sahifada qulf bilan turadi va tayyor bo'lgani sari ochiladi.",
  },
  {
    nom: "Video darsliklar tayyor emas",
    izoh:
      "Testlar bo'limida video darsliklar \"tez kunda\" deb belgilangan. Hozir u yerda faqat testlar ishlaydi.",
  },
  {
    nom: "Mobil qurilmada 3D bo'limlar og'ir",
    izoh:
      "Sayt telefonda ochiladi va o'qiladi, lekin 3D modellar hamda laboratoriya xonasi kompyuter uchun yozilgan. Telefonda ular sekin ishlaydi yoki umuman ochilmaydi.",
  },
  {
    nom: "Laboratoriya reaksiyalari hali tasdiqlanmagan",
    izoh:
      "Reaksiyalar va ularning kuzatuvlari kimyogar tomonidan bir-bir ko'rib chiqilmagan. Tajriba natijasida bu haqda yozuv chiqadi — ularga darslik sifatida tayanmang.",
  },
]


export default function Korinish() {
  const { data: session } = useSession()
  const [fon, fonTanla] = useFon()

  const yopiqFanlar = FANLAR.length - ochiqFanlarSoni()

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
            <span className="hidden sm:inline text-[13px] v3-xira truncate">Qo{"'"}llanma</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link href="/" className="v3-orqa mr-1 hidden md:inline-flex">
              <Ikon nom="ong" olcham={15} />
              Bosh sahifa
            </Link>

            <FonTanlagich fon={fon} tanla={fonTanla} />

            <Link href="/qidiruv" className="v3-qidiruv">
              <Ikon nom="qidiruv" olcham={17} />
              <span className="hidden lg:inline">Qidiruv</span>
            </Link>

            {session ? (
              <Link href="/profil" className="v3-ikon-tugma" title="Shaxsiy kabinet">
                <Ikon nom="odam" olcham={17} />
              </Link>
            ) : (
              <Link href="/register" className="v3-tugma-asosiy">Boshlash</Link>
            )}
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="v3-nur v3-nur-a" aria-hidden="true" />
        <div className="v3-tor-fon" aria-hidden="true" />

        <div className="v3-konteyner relative z-10 pt-10 pb-14 md:pt-14 md:pb-20">
          <nav className="v3-yol" aria-label="Yo'l">
            <Link href="/">Bosh sahifa</Link>
            <span className="v3-yol-ajratgich">/</span>
            <span style={{ color: "var(--v3-matn)" }}>Sayt qanday ishlaydi</span>
          </nav>

          <div className="v3-nishon mb-3">Qo{"'"}llanma</div>

          <h1 className="v3-h1" style={{ fontSize: "clamp(34px, 5.5vw, 58px)", maxWidth: "16em" }}>
            Bu yerda nima bor va undan qanday foydalaniladi
          </h1>

          <p className="v3-lid">
            JDA KIMYO — o{"'"}zbek tilidagi oliy kimyo platformasi
            (<Link href="/jda-kimyo">platforma haqida to{"'"}liqroq</Link>).
            Quyida saytning to{"'"}liq xaritasi: qaysi bo{"'"}lim nima qiladi,
            kim qayerdan boshlashi kerak va <strong style={{ color: "var(--v3-matn)" }}>hozircha
            nima tayyor emas</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px v3-sonlar">
            {[
              { son: String(HAJM.jamiTahlilVaMavzu), nom: "Ilmiy sahifa" },
              { son: BAZA.savollar, nom: "Test savoli" },
              { son: BAZA.reaksiyalar, nom: "Laboratoriya reaksiyasi" },
              { son: `${ochiqFanlarSoni()}/${FANLAR.length}`, nom: "Fan ochiq" },
            ].map((s) => (
              <div key={s.nom} className="v3-son">
                <div className="v3-son-qiymat">{s.son}</div>
                <div className="v3-son-nom">{s.nom}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLATFORMA XARITASI ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 01</div>
            <h2 className="v3-h2">Platformada nima bor</h2>
          </div>
          <p className="v3-bosh-izoh">
            O{"'"}n bo{"'"}lim. Har birida faqat haqiqatan ishlaydigan narsalar
            sanalgan — tayyor bo{"'"}lmagani alohida belgilangan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {XARITA.map((blok) => (
            <div key={blok.nom} className="v3-blok">
              <div className="flex items-center gap-3 mb-3">
                <span className="v3-yonalish-ikon" style={{ marginBottom: 0, width: 38, height: 38 }}>
                  <Ikon nom={blok.ikon} olcham={19} qalin={1.5} />
                </span>
                <h3 className="v3-yonalish-nom" style={{ marginBottom: 0 }}>{blok.nom}</h3>
              </div>

              <p className="v3-yonalish-tavsif" style={{ flex: "none", marginBottom: 14 }}>
                {blok.izoh}
              </p>

              <ul className="v3-royxat">
                {blok.qatorlar.map((q) => (
                  <li key={q.matn} className={q.tayyor ? "" : "is-yoq"}>
                    <Ikon nom={q.tayyor ? "belgi" : "qulf"} olcham={14} qalin={2} />
                    <span>{q.matn}</span>
                  </li>
                ))}
              </ul>

              {blok.tashqi ? (
                <a href={blok.havola} target="_blank" rel="noopener noreferrer" className="v3-blok-havola">
                  {blok.havolaNom}
                  <Ikon nom="tashqi" olcham={14} />
                </a>
              ) : (
                <Link href={blok.havola} className="v3-blok-havola">
                  {blok.havolaNom}
                  <Ikon nom="ong" olcham={15} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ QAYERDAN BOSHLASH ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 02</div>
            <h2 className="v3-h2">Qayerdan boshlash</h2>
          </div>
          <p className="v3-bosh-izoh">
            Hamma uchun bitta yo{"'"}l yo{"'"}q. O{"'"}zingizga yaqinini tanlang.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {YOLLAR.map((yol) => (
            <div key={yol.kim} className="v3-blok">
              <div className="flex items-center gap-3 mb-2">
                <span className="v3-yonalish-ikon" style={{ marginBottom: 0, width: 38, height: 38 }}>
                  <Ikon nom={yol.ikon} olcham={19} qalin={1.5} />
                </span>
                <div>
                  <h3 className="v3-yonalish-nom" style={{ marginBottom: 0, fontSize: 17 }}>{yol.kim}</h3>
                  <p className="v3-xira text-[12px]">{yol.tavsif}</p>
                </div>
              </div>

              <ol className="v3-qadamlar">
                {yol.qadamlar.map((q, i) => (
                  <li key={q.matn}>
                    <span className="v3-qadam-raqam">{i + 1}</span>
                    <Link href={q.havola}>{q.matn}</Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOZIRCHA NIMA TAYYOR EMAS ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 03</div>
            <h2 className="v3-h2">Hozircha nima tayyor emas</h2>
          </div>
          <p className="v3-bosh-izoh">
            Kirib ko{"'"}rgach bilib qolgandan ko{"'"}ra, oldindan aytgan
            yaxshiroq. {yopiqFanlar} ta fan qulf ostida va yana bir nechta
            cheklov bor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {CHEKLOVLAR.map((c) => (
            <div key={c.nom} className="v3-ogoh">
              <div className="flex items-start gap-3">
                <span className="v3-ogoh-ikon">
                  <Ikon nom="qulf" olcham={16} qalin={1.7} />
                </span>
                <div>
                  <h3 className="font-semibold text-[15px] mb-1.5">{c.nom}</h3>
                  <p className="v3-yonalish-tavsif" style={{ flex: "none" }}>{c.izoh}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 04</div>
            <h2 className="v3-h2">Ko{"'"}p so{"'"}raladigan savollar</h2>
          </div>
        </div>

        {/* `<details>` — javob matni HAR DOIM hujjatda turadi.
            Ilgari javob faqat tugma bosilganda DOM ga qo'shilardi va
            2026-08-22 da tekshirilganda serverdan kelgan HTML ichida
            bironta javob yo'q edi: qidiruv roboti ham, ChatGPT ham
            ularni ko'rmagan. */}
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

      {/* ═══ ALOQA ═══ */}
      <section className="v3-konteyner pb-16 md:pb-20">
        <div className="v3-oyoq-karta">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="v3-nishon mb-2">Aloqa</div>
              <h2 className="v3-h2" style={{ fontSize: "clamp(22px, 3vw, 30px)" }}>
                Xato topdingizmi yoki taklifingiz bormi?
              </h2>
              <p className="v3-yonalish-tavsif mt-2" style={{ flex: "none", maxWidth: "38em" }}>
                Platformani Diyorbek Jabborov yuritadi. Qaysi sahifada nima
                noto{"'"}g{"'"}ri ekanini yozsangiz — tezroq tuzatiladi.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <a href="https://t.me/diyorbek_jabborov" target="_blank" rel="noopener noreferrer" className="v3-oyoq-havola">
                <Ikon nom="telegram" olcham={15} />
                Telegram
              </a>
              <a href="mailto:jabborovd18@gmail.com" className="v3-oyoq-havola">
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
          <Link href="/" className="v3-orqa">
            <Ikon nom="ong" olcham={15} />
            Bosh sahifaga qaytish
          </Link>
          <p className="v3-xira text-xs">© 2026 JDA KIMYO · Oliy kimyo platformasi · v3.0.0</p>
        </div>
      </footer>
    </main>
  )
}
