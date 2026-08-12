"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { getQuizStats } from "./_shared/utils/storage"
import { QUIZLAR } from "./_shared/quiz-config"

export default function QuizMarkaziPage() {
  const [fon, fonTanla] = useFon()
  const [stats, setStats] = useState({})

  useEffect(() => {
    setStats(Object.fromEntries(QUIZLAR.map((quiz) => [quiz.slug, getQuizStats(quiz.slug)])))
  }, [])

  const yozuvlar = Object.values(stats).filter(Boolean)
  const totalTests = yozuvlar.reduce((sum, item) => sum + (item.totalTests || 0), 0)
  const totalCorrect = yozuvlar.reduce((sum, item) => sum + (item.correctAnswers || 0), 0)
  const totalQuestions = yozuvlar.reduce((sum, item) => sum + (item.totalQuestions || 0), 0)
  const averageScore = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0

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
            <Link href="/oquv/video-darsliklar" className="v3-ikon-tugma" aria-label="Testlar bo'limiga qaytish">
              <Ikon nom="chap" olcham={18} />
            </Link>
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>
            <span className="v3-quiz-header-ajratgich hidden sm:block" />
            <div className="hidden sm:block">
              <div className="v3-nishon">O'quv bo'limi</div>
              <div className="v3-quiz-header-nom">Quiz markazi</div>
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

      <section className="relative z-10 overflow-hidden">
        <div className="v3-konteyner py-14 md:py-20">
          <div className="v3-quiz-menyu-hero">
            <div>
              <div className="v3-eyebrow mb-5">
                <span className="v3-nuqta" />
                Koordinatsion kimyo · bilim diagnostikasi
              </div>
              <h1 className="v3-quiz-h1">
                Yodlash emas,
                <span className="v3-urgu-matn block">tushunishni tekshiring</span>
              </h1>
              <p className="v3-quiz-lid">
                Har bir urinishda savollar qiyinlik bo'yicha muvozanatlanadi va oldingi
                to'plam imkon qadar takrorlanmaydi. Yakunda xatolar tahlili va PDF hisobot olasiz.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/oquv/video-darsliklar/quiz/aralash" className="v3-tugma-asosiy v3-katta">
                  Aralash testni boshlash
                  <Ikon nom="ong" olcham={17} />
                </Link>
                <a href="#mavzular" className="v3-tugma v3-katta">
                  Mavzuni tanlash
                  <Ikon nom="past" olcham={16} />
                </a>
              </div>
            </div>

            <div className="v3-quiz-diagramma" aria-label="Test tuzilishi: to'rt mavzu, yigirma savol va bitta natija">
              <div className="v3-quiz-diagramma-markaz">
                <strong>20</strong>
                <span>savol</span>
              </div>
              {QUIZLAR.filter((quiz) => !quiz.aralash).map((quiz, index) => (
                <div key={quiz.slug} className={`v3-quiz-diagramma-tugun is-${index + 1}`}>
                  <span>{quiz.qisqa}</span>
                  <small>{quiz.nom}</small>
                </div>
              ))}
              <div className="v3-quiz-diagramma-halqa" />
            </div>
          </div>
        </div>
      </section>

      <div className="v3-lenta-qobiq relative z-10">
        <div className="v3-lenta">
          {[...QUIZLAR, ...QUIZLAR, ...QUIZLAR].map((quiz, index) => (
            <span key={`${quiz.slug}-${index}`} className="v3-lenta-band">
              {quiz.formula}
              <span className="v3-lenta-ajratgich">/</span>
            </span>
          ))}
        </div>
      </div>

      <section className="v3-konteyner relative z-10 py-12 md:py-16">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Sizning ko'rsatkichlaringiz</div>
            <h2 className="v3-h2">Mahalliy statistika</h2>
          </div>
          <p className="v3-bosh-izoh">
            Bu qurilmada yakunlangan testlar asosida hisoblanadi. Hisobga kirsangiz,
            natijalar profilingizda ham saqlanadi.
          </p>
        </div>

        <div className="v3-quiz-stat-grid mb-16">
          <div className="v3-quiz-stat"><span>Yakunlangan test</span><strong>{totalTests}</strong></div>
          <div className="v3-quiz-stat is-yaxshi"><span>To'g'ri javob</span><strong>{totalCorrect}</strong></div>
          <div className="v3-quiz-stat"><span>Ko'rilgan savol</span><strong>{totalQuestions}</strong></div>
          <div className="v3-quiz-stat"><span>O'rtacha aniqlik</span><strong>{averageScore}%</strong></div>
        </div>

        <div id="mavzular" className="v3-bosh scroll-mt-24">
          <div>
            <div className="v3-nishon mb-2">Test katalogi</div>
            <h2 className="v3-h2">Mavzuni tanlang</h2>
          </div>
          <p className="v3-bosh-izoh">
            To'rtta yo'nalishni alohida mustahkamlang yoki aralash testda umumiy
            tayyorgarligingizni tekshiring.
          </p>
        </div>

        <div className="v3-quiz-katalog">
          {QUIZLAR.map((quiz) => {
            const stat = stats[quiz.slug]
            const aniqlik = stat ? Math.round(stat.averageScore * 100) : 0

            return (
              <Link
                key={quiz.slug}
                href={`/oquv/video-darsliklar/quiz/${quiz.slug}`}
                className={`v3-quiz-katalog-karta ${quiz.aralash ? "is-aralash" : ""}`}
              >
                <div className="v3-quiz-katalog-tepa">
                  <span className="v3-raqam">{quiz.raqam}</span>
                  <span className="v3-quiz-kod">{quiz.qisqa}</span>
                </div>
                <div className="v3-quiz-katalog-ichi">
                  <h3>{quiz.nom}</h3>
                  <p>{quiz.tavsif}</p>
                  <div className="v3-quiz-formula">{quiz.formula}</div>
                </div>
                <div className="v3-quiz-katalog-past">
                  <span>{stat ? `${stat.totalTests} urinish · ${aniqlik}%` : "Birinchi urinishga tayyor"}</span>
                  <span className="v3-quiz-katalog-ong"><Ikon nom="ong" olcham={18} /></span>
                </div>
                {stat && (
                  <div className="v3-quiz-katalog-progress" aria-label={`O'rtacha aniqlik ${aniqlik} foiz`}>
                    <span style={{ width: `${aniqlik}%` }} />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      <section className="v3-konteyner relative z-10 pb-16 md:pb-24">
        <div className="v3-quiz-qanday">
          <div className="v3-quiz-qanday-bosh">
            <div className="v3-nishon mb-2">Ishlash tartibi</div>
            <h2 className="v3-quiz-h2">Uch qadamli o'quv sikli</h2>
          </div>
          <ol className="v3-quiz-qadam-grid">
            <li><span>01</span><div><strong>To'plam tuziladi</strong><p>20 ta savol qiyinlik va oldingi tarix asosida tanlanadi.</p></div></li>
            <li><span>02</span><div><strong>Javob va tahlil</strong><p>Oddiy rejimda har savol izohini o'qing, tezkor rejimda esa uzluksiz davom eting.</p></div></li>
            <li><span>03</span><div><strong>Natijani mustahkamlang</strong><p>Xatolarni qayta ko'ring, PDF hisobot oling va keyingi urinishda o'sishni solishtiring.</p></div></li>
          </ol>
        </div>
      </section>

      <footer className="v3-oyoq relative z-10">
        <div className="v3-konteyner py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="v3-xira text-xs text-center sm:text-left">
            Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari
          </p>
          <p className="v3-xira text-xs">© 2026 JDA KIMYO</p>
        </div>
      </footer>
    </main>
  )
}
