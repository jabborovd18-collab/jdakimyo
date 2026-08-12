"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"

const FORMATLAR = [
  {
    raqam: "01",
    ikon: "quiz",
    href: "/oquv/video-darsliklar/quiz",
    nom: "Mavzuli quizlar",
    qisqa: "Mustaqil mashq",
    tavsif:
      "Platforma savollaridan 20 talik test. Har savoldan keyin tushuntirish yoki tezkor davom etish rejimi mavjud.",
    belgilar: ["4 asosiy mavzu", "Aralash test", "PDF hisobot"],
    amal: "Quiz markaziga kirish",
    asosiy: true,
  },
  {
    raqam: "02",
    ikon: "ustoz",
    href: "/oquv/video-darsliklar/ustoz-quiz",
    nom: "Variantli ustoz testlari",
    qisqa: "Guruh nazorati",
    tavsif:
      "Ustoz yaratgan variantli testlar. Kirish guruhi yoki ustoz bergan ruxsat orqali boshqariladi.",
    belgilar: ["Ustoz savollari", "Urinishlar nazorati", "Tezkor natija"],
    amal: "Ustoz testlarini ko'rish",
  },
  {
    raqam: "03",
    ikon: "kitob",
    href: "/oquv/video-darsliklar/ustoz-yopiq-quiz",
    nom: "Yozma ustoz testlari",
    qisqa: "Erkin javob",
    tavsif:
      "Variantsiz savollarga o'z so'zingiz bilan javob berasiz. Natijani ustoz ko'rib chiqadi va baholaydi.",
    belgilar: ["Yozma javob", "Ustoz tekshiruvi", "Shaxsiy fikr"],
    amal: "Yozma testlarni ko'rish",
  },
]

const TAQQOSLASH = [
  { nom: "Savol manbasi", qiymatlar: ["JDA KIMYO bazasi", "Ustoz yaratadi", "Ustoz yaratadi"] },
  { nom: "Javob shakli", qiymatlar: ["Variant tanlash", "Variant tanlash", "Erkin matn"] },
  { nom: "Natija", qiymatlar: ["Darhol", "Darhol", "Ustoz baholagach"] },
  { nom: "Kirish", qiymatlar: ["Hamma uchun", "Hisob va ruxsat", "Hisob va ruxsat"] },
]

export default function TestlarMarkaziPage() {
  const [fon, fonTanla] = useFon()

  return (
    <main data-fon={fon} className="v3 v3-quiz min-h-screen overflow-x-hidden">
      <div className="v3-quiz-fon" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      <header className="v3-header">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/oquv" className="v3-ikon-tugma" aria-label="O'quv bo'limiga qaytish">
              <Ikon nom="chap" olcham={18} />
            </Link>
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>
            <span className="v3-quiz-header-ajratgich hidden sm:block" />
            <div className="hidden sm:block min-w-0">
              <div className="v3-nishon">O'quv bo'limi</div>
              <div className="v3-quiz-header-nom truncate">Testlar markazi</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profil/quizlar" className="v3-tugma v3-mobil-yashir">
              <Ikon nom="grafik" olcham={16} />
              Natijalarim
            </Link>
            <FonTanlagich fon={fon} tanla={fonTanla} />
          </div>
        </div>
      </header>

      <section className="v3-konteyner relative z-10 py-14 md:py-20">
        <div className="v3-oquv-hero">
          <div>
            <div className="v3-eyebrow mb-5">
              <span className="v3-nuqta" />
              Koordinatsion kimyo · bilim nazorati
            </div>
            <h1 className="v3-quiz-h1">
              Bilimni tekshirishning
              <span className="v3-urgu-matn block">uchta aniq yo'li</span>
            </h1>
            <p className="v3-quiz-lid">
              Mustaqil mashq qiling, ustoz testini yeching yoki yozma javob yuboring.
              Bu sahifada faqat hozir ishlaydigan o'quv vositalari ko'rsatiladi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/oquv/video-darsliklar/quiz" className="v3-tugma-asosiy v3-katta">
                Mustaqil testni boshlash
                <Ikon nom="ong" olcham={17} />
              </Link>
              <a href="#formatlar" className="v3-tugma v3-katta">
                Formatlarni solishtirish
                <Ikon nom="past" olcham={16} />
              </a>
            </div>
          </div>

          <div className="v3-oquv-sxema" aria-label="Mustaqil, variantli va yozma test formatlari">
            <div className="v3-oquv-sxema-bosh">
              <span className="v3-nishon">Nazorat yo'li</span>
              <strong>TEST / 03</strong>
            </div>
            {FORMATLAR.map((format) => (
              <div key={format.raqam} className="v3-oquv-sxema-qator">
                <span>{format.raqam}</span>
                <div><strong>{format.nom}</strong><small>{format.qisqa}</small></div>
                <Ikon nom={format.ikon} olcham={19} />
              </div>
            ))}
            <div className="v3-oquv-sxema-oyoq">
              <span>Tanlash</span>
              <span>Yechish</span>
              <span>Tahlil</span>
            </div>
          </div>
        </div>
      </section>

      <div className="v3-lenta-qobiq relative z-10">
        <div className="v3-lenta">
          {[...FORMATLAR, ...FORMATLAR, ...FORMATLAR].map((format, index) => (
            <span key={`${format.raqam}-${index}`} className="v3-lenta-band">
              {format.raqam} · {format.nom}
              <span className="v3-lenta-ajratgich">/</span>
            </span>
          ))}
        </div>
      </div>

      <section id="formatlar" className="v3-konteyner relative z-10 py-14 md:py-20 scroll-mt-20">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Ochiq bo'limlar</div>
            <h2 className="v3-h2">Qaysi format sizga mos?</h2>
          </div>
          <p className="v3-bosh-izoh">
            Mashq maqsadingizga qarab tanlang. Har bir karta aynan ishlayotgan
            sahifaga olib boradi.
          </p>
        </div>

        <div className="v3-oquv-format-grid">
          {FORMATLAR.map((format) => (
            <Link
              key={format.raqam}
              href={format.href}
              className={`v3-oquv-format ${format.asosiy ? "is-asosiy" : ""}`}
            >
              <div className="v3-oquv-format-tepa">
                <span className="v3-raqam">{format.raqam}</span>
                <span className="v3-oquv-format-ikon"><Ikon nom={format.ikon} olcham={21} /></span>
              </div>
              <div className="v3-nishon mb-2">{format.qisqa}</div>
              <h3>{format.nom}</h3>
              <p>{format.tavsif}</p>
              <div className="v3-oquv-belgilar">
                {format.belgilar.map((belgi) => <span key={belgi}>{belgi}</span>)}
              </div>
              <div className="v3-oquv-format-past">
                <span>{format.amal}</span>
                <Ikon nom="ong" olcham={18} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="v3-konteyner relative z-10 pb-16 md:pb-24">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Qisqa taqqoslash</div>
            <h2 className="v3-h2">Formatlar orasidagi farq</h2>
          </div>
          <p className="v3-bosh-izoh">
            Natija qachon chiqishi va kim savol tuzishi oldindan aniq.
          </p>
        </div>

        <div className="v3-oquv-jadval" role="table" aria-label="Test formatlarini taqqoslash">
          <div className="v3-oquv-jadval-qator is-bosh" role="row">
            <span role="columnheader">Mezon</span>
            <span role="columnheader">Mavzuli quiz</span>
            <span role="columnheader">Ustoz testi</span>
            <span role="columnheader">Yozma test</span>
          </div>
          {TAQQOSLASH.map((qator) => (
            <div key={qator.nom} className="v3-oquv-jadval-qator" role="row">
              <strong role="rowheader">{qator.nom}</strong>
              {qator.qiymatlar.map((qiymat, index) => <span key={`${qator.nom}-${index}`} role="cell">{qiymat}</span>)}
            </div>
          ))}
        </div>

        <div className="v3-oquv-video-izoh">
          <span className="v3-oquv-format-ikon"><Ikon nom="video" olcham={20} /></span>
          <div>
            <strong>Video darsliklar hali nashr qilinmagan</strong>
            <p>Tayyor material paydo bo'lganda u alohida ochiq bo'lim sifatida qo'shiladi.</p>
          </div>
        </div>
      </section>

      <footer className="v3-oyoq relative z-10">
        <div className="v3-konteyner py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="v3-xira text-xs">O'quv vositalari · Koordinatsion kimyo</p>
          <p className="v3-xira text-xs">© 2026 JDA KIMYO</p>
        </div>
      </footer>
    </main>
  )
}
