import Image from 'next/image'
import Link from 'next/link'
import Ikon from '@/components/Ikon'
import { YARATUVCHI } from '@/lib/sayt-malumot'
import styles from './katalog.module.css'

export const metadata = { title: 'Kimyoviy o‘yinlar' }

const OCHIQ_OYINLAR = [
  {
    id: 'kalloid-kimyo-amaliy',
    manzil: '/oyinlar/kalloid-kimyo-amaliy',
    rasm: '/oyinlar/kalloid-kimyo-amaliy/muqova.webp',
    nom: 'Kalloid Kimyo amaliy',
    ikon: 'kolba',
    yorliq: 'Mavsumiy ochiq dars · Ustoz statistikasi',
    tavsif:
      'Ochiq dars uchun QR-kodli 20 savollik kolloid kimyo sinovi va ustoz paneli orqali kirish kodi bilan himoyalangan jonli statistika ekrani.',
  },
  {
    id: 'kalloid-duel',
    manzil: '/oyinlar/kalloid-duel',
    rasm: '/oyinlar/kalloid-duel/muqova.webp',
    nom: 'Kolloid kimyo: 1v1 Doska dueli',
    ikon: 'chaqmoq',
    yorliq: '1v1 Doska · 50 ta savol · 180 soniya',
    tavsif:
      'Doska ikkiga bo‘linadi: KK_M1–KK_M5 50 ta savoldan har bir ishtirokchiga alohida tasodifiy savol chiqadi. To‘g‘ri javob +1, xato javob −0.5 ball, avtomatik tezkor o‘tish.',
  },
  {
    id: 'formulani-top',
    manzil: '/oyinlar/formulani-top',
    rasm: '/oyinlar/formulani-top/muqova.webp',
    nom: 'Formulani top',
    ikon: 'yulduz',
    yorliq: 'Yakka va 1v1 · 4 rejim · +Kartalar',
    tavsif:
      'Ovozli ishorani tinglang va 4 xil harakat rejimida (yo‘laklar, 3D shar, atom orbitallari, kvant maydon) aylanayotgan 24 ta formula orasidan moddani toping.',
  },
  {
    id: 'element-duel',
    manzil: '/oyinlar/element-duel',
    rasm: '/oyinlar/element-duel/muqova.webp',
    nom: 'Elementlar dueli',
    ikon: 'atom',
    yorliq: 'Yakka va 1v1 · Davriy jadval',
    tavsif:
      'Jonli Bohr elektron qobiqlari, davriy jadval o‘rni va IUPAC nisbiy atom massalari bo‘yicha elementlarni soniyalar ichida topish dueli.',
  },
  {
    id: 'formula-konstruktor',
    manzil: '/oyinlar/formula-konstruktor',
    rasm: '/oyinlar/formula-konstruktor/muqova.webp',
    nom: 'Formula konstruktori',
    ikon: 'formula',
    yorliq: 'Yakka va 1v1 · Ion sintezi',
    tavsif:
      'Kation va anionlarni birlashtirib, elektroneytrallik va valentlik qoidasi asosida tuz, oksid, kislota hamda asos formulalarini yig‘ing.',
  },
  {
    id: 'reaksiya-balans',
    manzil: '/oyinlar/reaksiya-balans',
    rasm: '/oyinlar/reaksiya-balans/muqova.webp',
    nom: 'Reaksiyani tenglashtir',
    ikon: 'chaqmoq',
    yorliq: 'Yakka va 1v1 · 135+ reaksiya',
    tavsif:
      'Haqiqiy reaksiyalar bazasida stexiometrik koeffitsientlarni jonli atom tarozisi bilan yoki imtihon rejimida tenglashtiring.',
  },
  {
    id: 'sifat-detektiv',
    manzil: '/oyinlar/sifat-detektiv',
    rasm: '/oyinlar/sifat-detektiv/muqova.webp',
    nom: 'Sifat reaksiyalar detektivi',
    ikon: 'kolba',
    yorliq: 'Yakka va 1v1 · Virtual laboratoriya',
    tavsif:
      'Noma’lum probirkalarga reaktivlar tomizib, cho‘kma rangi, gaz pufakchalari va hid belgilariga qarab eritmadagi moddani fosh eting.',
  },
]

const OYINLAR_ROYXATI = [
  {
    id: "organik-labirint",
    nom: "Organik zanjir labirinti",
    ikon: "kristall",
    tavsif:
      "Boshlang'ich uglevodoroddan maqsadli organik birikmani olish uchun to'g'ri reagent va katalizatorlarni ketma-ket tanlab labirintdan chiqish.",
  },
  {
    id: "kimyogar-millioner",
    nom: "Kimyogar intellektual ligasi",
    ikon: "kubok",
    tavsif:
      "Eng oson maktab savollaridan boshlab xalqaro kimyo olimpiadasi darajasigacha bo'lgan 15 ta bosqichli intellektual o'yin va 3 ta yordam imkoniyati.",
  },
]

export default function KimyoviyOyinlarSahifa() {
  const telegramNomi = new URL(YARATUVCHI.telegram).pathname.slice(1)

  return (
    <main data-fon="tun" className={`v3 ${styles.sahifa}`}>
      <header className="v3-header">
        <div className="v3-konteyner flex min-h-16 items-center gap-3 py-2">
          <Link href="/" className="v3-ikon-tugma" aria-label="Bosh sahifaga qaytish">
            <Ikon nom="chap" olcham={18} />
          </Link>
          <h1 className="text-lg font-bold sm:text-xl">Kimyoviy o‘yinlar</h1>
        </div>
      </header>

      <div className="v3-konteyner space-y-8 py-5 sm:space-y-10 sm:py-9">
        <section className="space-y-5" aria-labelledby="ochiq-oyinlar">
          <h2 id="ochiq-oyinlar" className="sr-only">Ochiq kimyoviy o‘yinlar</h2>
          {OCHIQ_OYINLAR.map((o, indeks) => (
            <article key={o.id} className={styles.muqova} aria-labelledby={`${o.id}-nomi`}>
              <div className={styles.rasm}>
                <Image
                  src={o.rasm}
                  alt=""
                  fill
                  unoptimized
                  priority={indeks === 0}
                  sizes="(max-width: 1180px) 100vw, 1180px"
                  className={styles.muqovaRasmi}
                />
              </div>
              <div className={styles.muqovaMatni}>
                <span className={styles.tayyorHolat}>
                  <Ikon nom={o.ikon} olcham={15} /> {o.yorliq}
                </span>
                <h2
                  id={`${o.id}-nomi`}
                  className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
                >
                  {o.nom}
                </h2>
                <p className="v3-xira text-base sm:text-lg">{o.tavsif}</p>
                <Link href={o.manzil} className={styles.asosiyTugma}>
                  O‘yinni ochish <Ikon nom="ong" olcham={18} />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="space-y-4" aria-labelledby="yopiq-oyinlar">
          <h2 id="yopiq-oyinlar" className="text-xl font-bold sm:text-2xl">Tayyorlanayotgan o‘yinlar</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {OYINLAR_ROYXATI.map(o => (
              <article key={o.id} className={styles.yopiq}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className={styles.belgi}><Ikon nom={o.ikon} olcham={20} /></span>
                  <span className={styles.holat}>Tez kunda</span>
                </div>
                <h3 className="text-lg font-bold">{o.nom}</h3>
                <p className="v3-xira mt-2 text-sm leading-relaxed">{o.tavsif}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="v3-panel-karta flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
          <p>O‘z o‘yiningizni qo‘shish uchun Telegram orqali yozing.</p>
          <a href={YARATUVCHI.telegram} target="_blank" rel="noopener noreferrer" className={styles.telegram}>
            @{telegramNomi} <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>
    </main>
  )
}
