import Image from 'next/image'
import Link from 'next/link'
import Ikon from '@/components/Ikon'
import { YARATUVCHI } from '@/lib/sayt-malumot'
import styles from './katalog.module.css'

export const metadata = { title: 'Kimyoviy o‘yinlar' }

const OYINLAR_ROYXATI = [
  {
    id: "element-duel",
    nom: "Elementlar dueli",
    ikon: "atom",
    tavsif:
      "Davriy jadvaldagi kimyoviy elementlarning belgisi, tartib raqami, nisbiy atom massasi va guruhini 60 soniya ichida topish musobaqasi.",
  },
  {
    id: "formula-konstruktor",
    nom: "Formula konstruktori",
    ikon: "formula",
    tavsif:
      "Kation va anionlarni birlashtirib, valentlik hamda oksidlanish darajalariga mos ravishda tuz, oksid, kislota va asoslarning to'g'ri formulasini yig'ish o'yini.",
  },
  {
    id: "reaksiya-balans",
    nom: "Reaksiyani tenglashtir",
    ikon: "chaqmoq",
    tavsif:
      "Oddiy birikish reaksiyalaridan tortib murakkab oksidlanish-qaytarilish tenglamalarigacha stexiometrik koeffitsientlarni eng qisqa vaqtda topish.",
  },
  {
    id: "sifat-detektiv",
    nom: "Sifat reaksiyalar detektivi",
    ikon: "kolba",
    tavsif:
      "Raqamlangan noma'lum probirkalardagi eritmalarni indikatorlar, cho'kma rangi va ajralayotgan gaz belgilariga qarab aniqlash.",
  },
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

      <div className="v3-konteyner space-y-9 py-5 sm:space-y-12 sm:py-9">
        <section className={styles.muqova} aria-labelledby="formula-nomi">
          <div className={styles.rasm}>
            <Image src="/oyinlar/formulani-top/muqova.webp" alt="" fill unoptimized
              sizes="(max-width: 1180px) 100vw, 1180px" className={styles.muqovaRasmi} />
          </div>
          <div className={styles.muqovaMatni}>
            <h2 id="formula-nomi" className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Formulani top</h2>
            <p className="v3-xira text-base sm:text-lg">Ovozli ishorani tinglang va aylanayotgan 24 ta formula yoki model orasidan moddani toping.</p>
            <Link href="/oyinlar/formulani-top" className={styles.asosiyTugma}>
              O‘yinni ochish <Ikon nom="ong" olcham={18} />
            </Link>
          </div>
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
