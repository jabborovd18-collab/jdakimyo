"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

/**
 * Ustozning ommaviy profili — talabalar va hamkasblar ko'radigan sahifa.
 *
 * Bu sahifa yo'q edi. Ustoz panelidagi sozlash bo'limi profilni to'liq
 * to'ldirish imkonini berardi va ikki joyda `/ustoz-profil/{id}` ga havola
 * qilardi, lekin bunday yo'l mavjud emasdi — ya'ni "Ommaviy profilni ko'rish"
 * tugmasi 404 ga olib borardi va sozlangan profil hech kimga ko'rinmasdi.
 * API (/api/ustoz-profil/[id]) esa allaqachon hamma narsani qaytarardi.
 */

// Sozlash sahifasidagi THEME_COLORS bilan bir xil bo'lishi shart
const MAVZU = {
  purple: "from-purple-600 to-indigo-600",
  blue: "from-blue-600 to-cyan-600",
  green: "from-green-600 to-emerald-600",
  indigo: "from-indigo-600 to-blue-700",
  amber: "from-amber-600 to-orange-600",
  rose: "from-rose-600 to-pink-600",
}

const HAVOLALAR = [
  { kalit: "website", nom: "Shaxsiy sayt", belgi: "🌐" },
  { kalit: "googleScholar", nom: "Google Scholar", belgi: "🎓" },
  { kalit: "researchGate", nom: "ResearchGate", belgi: "🔬" },
  { kalit: "orcid", nom: "ORCID", belgi: "🆔" },
  { kalit: "scopus", nom: "Scopus", belgi: "📚" },
]

/** JSON maydonlar bo'sh yoki noto'g'ri turda bo'lishi mumkin. */
const royxat = (q) => (Array.isArray(q) ? q : [])

/**
 * TeacherQuiz.description ustunida odamga mo'ljallangan matn emas, JSON
 * metama'lumot saqlanadi (app/api/ustoz/open-quiz/route.js: originalDescription,
 * category, tags, ...). Uni to'g'ridan-to'g'ri chiqarsak, talaba xom JSON
 * ko'radi. Eski yozuvlarda oddiy matn bo'lishi mumkin — shuning uchun parse
 * ishlamasa, matnning o'zi qaytariladi.
 */
function quizTavsifi(xom) {
  if (!xom) return ""
  try {
    const meta = JSON.parse(xom)
    return typeof meta?.originalDescription === "string" ? meta.originalDescription : ""
  } catch {
    return xom
  }
}

function Bolim({ sarlavha, belgi, children }) {
  return (
    <section className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>{belgi}</span> {sarlavha}
      </h2>
      {children}
    </section>
  )
}

export default function UstozProfili() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [xato, setXato] = useState("")
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  useEffect(() => {
    let bekor = false

    fetch(`/api/ustoz-profil/${id}`)
      .then(async (r) => {
        const d = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(d.error || "Profilni yuklab bo'lmadi")
        return d
      })
      .then((d) => { if (!bekor) setData(d) })
      .catch((e) => { if (!bekor) setXato(e.message) })
      .finally(() => { if (!bekor) setYuklanmoqda(false) })

    return () => { bekor = true }
  }, [id])

  if (yuklanmoqda) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-purple-300">Yuklanmoqda...</div>
      </main>
    )
  }

  if (xato || !data?.profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">👨‍🏫</div>
          <h1 className="text-lg font-bold text-white mb-2">
            {xato || "Profil topilmadi"}
          </h1>
          <p className="text-purple-400 text-sm mb-5">
            Ustoz profilini yashirgan bo'lishi yoki hali to'ldirmagan bo'lishi mumkin.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-purple-800/60 border border-purple-600/50 rounded-xl inline-block text-white text-sm"
          >
            Bosh sahifa
          </Link>
        </div>
      </main>
    )
  }

  const { profile, stats, activeCourses, publicQuizzes } = data
  const u = profile.user
  const gradient = MAVZU[profile.themeColor] || MAVZU.purple
  const ism = profile.displayName || u.fullName || u.username

  const havolalar = HAVOLALAR.filter((h) => profile[h.kalit])
  const ilmiySon =
    profile.publications || profile.citations || profile.hIndex

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">

      {/* BANNER */}
      <div className={`relative bg-gradient-to-br ${gradient}`}>
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-10">
          <Link href="/" className="text-white/70 hover:text-white text-sm">
            ← Bosh sahifa
          </Link>

          <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-purple-950/60 border-4 border-white/20 grid place-items-center text-4xl font-bold overflow-hidden flex-shrink-0">
              {u.avatar ? (
                <img src={u.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                ism[0].toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">{ism}</h1>
                {profile.isVerified && (
                  <span
                    title="Admin tomonidan tasdiqlangan"
                    className="text-xs bg-white/20 border border-white/30 px-2 py-0.5 rounded-full"
                  >
                    ✓ Tasdiqlangan
                  </span>
                )}
              </div>

              {profile.title && (
                <p className="text-white/90 mt-1">{profile.title}</p>
              )}

              <p className="text-white/70 text-sm mt-1.5">
                {[profile.position, profile.department, profile.university || u.university]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>

          {profile.bannerQuote && (
            <p className="mt-6 text-white/90 italic text-sm sm:text-base border-l-2 border-white/40 pl-4">
              “{profile.bannerQuote}”
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* STATISTIKA */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { son: stats.students, nom: "Talaba", belgi: "👥" },
              { son: stats.groups, nom: "Guruh", belgi: "🏫" },
              { son: stats.quizzes, nom: "Quiz", belgi: "📝" },
              { son: stats.assignments, nom: "Faol vazifa", belgi: "📋" },
            ].map((s) => (
              <div
                key={s.nom}
                className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-1">{s.belgi}</div>
                <div className="text-2xl font-bold text-white tabular-nums">{s.son}</div>
                <div className="text-xs text-purple-400">{s.nom}</div>
              </div>
            ))}
          </div>
        )}

        {profile.bio && (
          <Bolim sarlavha="Ustoz haqida" belgi="📖">
            <p className="text-purple-200 text-sm leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          </Bolim>
        )}

        {royxat(profile.specialties).length > 0 && (
          <Bolim sarlavha="Mutaxassislik" belgi="🎯">
            <div className="flex flex-wrap gap-2">
              {royxat(profile.specialties).map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 bg-purple-800/50 border border-purple-700/50 rounded-full text-purple-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </Bolim>
        )}

        {profile.showPublications && ilmiySon && (
          <Bolim sarlavha="Ilmiy faoliyat" belgi="📊">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { son: profile.publications, nom: "Maqola" },
                { son: profile.citations, nom: "Iqtibos" },
                { son: profile.hIndex, nom: "h-indeks" },
              ].map((s) => (
                <div key={s.nom} className="bg-purple-950/40 rounded-xl p-4">
                  <div className="text-2xl font-bold text-yellow-400 tabular-nums">
                    {s.son ?? "—"}
                  </div>
                  <div className="text-xs text-purple-400 mt-1">{s.nom}</div>
                </div>
              ))}
            </div>
            {profile.experienceYears ? (
              <p className="text-purple-300 text-sm mt-4">
                Pedagogik tajriba: <strong className="text-white">{profile.experienceYears} yil</strong>
              </p>
            ) : null}
          </Bolim>
        )}

        {royxat(profile.researchAreas).length > 0 && (
          <Bolim sarlavha="Tadqiqot yo'nalishlari" belgi="🔬">
            <div className="space-y-3">
              {royxat(profile.researchAreas).map((r, i) => (
                <div key={i} className="bg-purple-950/40 rounded-xl p-4">
                  <h3 className="font-semibold text-white text-sm">{r.name}</h3>
                  {r.description && (
                    <p className="text-purple-300 text-sm mt-1 leading-relaxed">{r.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Bolim>
        )}

        {royxat(activeCourses).length > 0 && (
          <Bolim sarlavha="Dars beradigan kurslar" belgi="📚">
            <div className="grid sm:grid-cols-2 gap-3">
              {royxat(activeCourses).map((k, i) => (
                <div key={i} className="bg-purple-950/40 rounded-xl p-4">
                  <h3 className="font-semibold text-white text-sm">{k.name}</h3>
                  <p className="text-xs text-purple-400 mt-1">
                    {[k.semester && `${k.semester}-semestr`, k.credits && `${k.credits} kredit`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {k.description && (
                    <p className="text-purple-300 text-sm mt-2 leading-relaxed">{k.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Bolim>
        )}

        {royxat(profile.education).length > 0 && (
          <Bolim sarlavha="Ta'lim" belgi="🎓">
            <div className="space-y-3">
              {royxat(profile.education).map((e, i) => (
                <div key={i} className="flex gap-3 items-baseline">
                  <span className="text-yellow-400 text-sm tabular-nums w-14 flex-shrink-0">
                    {e.year || "—"}
                  </span>
                  <div>
                    <div className="text-white text-sm font-semibold">{e.degree}</div>
                    {e.university && (
                      <div className="text-purple-400 text-xs">{e.university}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Bolim>
        )}

        {royxat(profile.awards).length > 0 && (
          <Bolim sarlavha="Mukofotlar" belgi="🏆">
            <div className="space-y-3">
              {royxat(profile.awards).map((a, i) => (
                <div key={i} className="flex gap-3 items-baseline">
                  <span className="text-yellow-400 text-sm tabular-nums w-14 flex-shrink-0">
                    {a.year || "—"}
                  </span>
                  <div>
                    <div className="text-white text-sm font-semibold">{a.title}</div>
                    {a.organization && (
                      <div className="text-purple-400 text-xs">{a.organization}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Bolim>
        )}

        {royxat(publicQuizzes).length > 0 && (
          <Bolim sarlavha="Ochiq quizlar" belgi="📝">
            <div className="grid sm:grid-cols-2 gap-3">
              {royxat(publicQuizzes).map((q) => {
                const tavsif = quizTavsifi(q.description)
                return (
                <Link
                  key={q.id}
                  href={`/oquv/video-darsliklar/ustoz-quiz/${q.id}`}
                  className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/40 hover:border-yellow-500/50 transition-colors"
                >
                  <h3 className="font-semibold text-white text-sm">{q.title}</h3>
                  {tavsif && (
                    <p className="text-purple-300 text-xs mt-1 line-clamp-2">{tavsif}</p>
                  )}
                  <p className="text-xs text-yellow-400 mt-2">
                    {q._count.questions} savol
                    {q.timeLimit ? ` · ${q.timeLimit} daqiqa` : ""} · Boshlash →
                  </p>
                </Link>
                )
              })}
            </div>
          </Bolim>
        )}

        {(havolalar.length > 0 || (profile.showEmail && u.email)) && (
          <Bolim sarlavha="Akademik havolalar" belgi="🔗">
            <div className="flex flex-wrap gap-2">
              {havolalar.map((h) => (
                <a
                  key={h.kalit}
                  href={profile[h.kalit]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-xl text-purple-200 hover:border-yellow-500/50 transition-colors"
                >
                  {h.belgi} {h.nom}
                </a>
              ))}
              {/* Email faqat ustoz sozlamada ruxsat bergan bo'lsa keladi */}
              {profile.showEmail && u.email && (
                <a
                  href={`mailto:${u.email}`}
                  className="text-sm px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-xl text-purple-200 hover:border-yellow-500/50 transition-colors"
                >
                  ✉️ {u.email}
                </a>
              )}
            </div>
          </Bolim>
        )}

        <p className="text-center text-xs text-purple-600 pt-2">
          👁 {profile.views} marta ko'rilgan
        </p>
      </div>
    </main>
  )
}
