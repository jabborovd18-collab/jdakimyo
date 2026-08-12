"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"

const MAVZU = {
  purple: "from-purple-900/50 to-indigo-950/50 border-purple-700/40",
  blue: "from-blue-900/50 to-cyan-950/50 border-blue-700/40",
  green: "from-green-900/50 to-emerald-950/50 border-green-700/40",
  indigo: "from-indigo-900/50 to-blue-950/50 border-indigo-700/40",
  amber: "from-amber-900/50 to-orange-950/50 border-amber-700/40",
  rose: "from-rose-900/50 to-pink-950/50 border-rose-700/40",
}

const HAVOLALAR = [
  { kalit: "website", nom: "Shaxsiy sayt", ikon: "doska" },
  { kalit: "googleScholar", nom: "Google Scholar", ikon: "kitob" },
  { kalit: "researchGate", nom: "ResearchGate", ikon: "kolba" },
  { kalit: "orcid", nom: "ORCID", ikon: "atom" },
  { kalit: "scopus", nom: "Scopus", ikon: "kitob" },
]

const royxat = (q) => (Array.isArray(q) ? q : [])

function quizTavsifi(xom) {
  if (!xom) return ""
  try {
    const meta = JSON.parse(xom)
    return typeof meta?.originalDescription === "string" ? meta.originalDescription : ""
  } catch {
    return xom
  }
}

function Bolim({ sarlavha, ikon, children }) {
  return (
    <section className="v3-panel-karta p-5 sm:p-6 space-y-4">
      <h2 className="text-base font-bold text-[var(--v3-matn)] flex items-center gap-2 pb-2 border-b border-[var(--v3-chiziq)]">
        <Ikon nom={ikon} olcham={16} className="text-[var(--v3-urgu)]" />
        <span>{sarlavha}</span>
      </h2>
      {children}
    </section>
  )
}

export default function UstozProfiliPage() {
  const params = useParams()
  const id = params?.id
  const [fon, fonTanla] = useFon()
  const [data, setData] = useState(null)
  const [xato, setXato] = useState("")
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  useEffect(() => {
    if (!id) return
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
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-sm">Ustoz profili yuklanmoqda...</span>
        </div>
      </main>
    )
  }

  if (xato || !data?.profile) {
    return (
      <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] flex items-center justify-center p-4">
        <div className="v3-panel-karta max-w-md w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="odam" olcham={24} />
          </div>
          <h1 className="text-base font-bold text-[var(--v3-matn)]">
            {xato || "Profil topilmadi"}
          </h1>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            Ustoz profilini yashirgan bo{"'"}lishi yoki hali to{"'"}ldirmagan bo{"'"}lishi mumkin.
          </p>
          <Link
            href="/"
            className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex font-bold"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    )
  }

  const { profile, stats, activeCourses, publicQuizzes } = data
  const u = profile.user || {}
  const themeCard = MAVZU[profile.themeColor] || MAVZU.purple
  const ism = profile.displayName || u.fullName || u.username

  const havolalar = HAVOLALAR.filter((h) => profile[h.kalit])
  const ilmiySon = profile.publications || profile.citations || profile.hIndex

  return (
    <main data-fon={fon} className="v3 min-h-screen text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      {/* Background glow & grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <span className="v3-nur v3-nur-a" />
        <span className="v3-nur v3-nur-b" />
        <span className="v3-tor-fon" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--v3-fon)]/90 backdrop-blur-xl border-b border-[var(--v3-chiziq)]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="v3-ikon-tugma" aria-label="Bosh sahifa">
              <Ikon nom="chap" olcham={18} />
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <FonTanlagich fon={fon} tanla={fonTanla} />
            <Link href="/chat" className="v3-tugma text-xs py-1.5 px-3">
              <Ikon nom="xabar" olcham={14} />
              <span className="hidden sm:inline">Xabar yozish</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Banner / Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className={`v3-panel-karta bg-gradient-to-br ${themeCard} p-6 sm:p-8 space-y-6 relative overflow-hidden`}>
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />
          )}

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[var(--v3-fon-2)] border-2 border-[var(--v3-chiziq-2)] grid place-items-center text-3xl sm:text-4xl font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0 shadow-lg">
              {u.avatar ? (
                <img src={u.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                ism[0].toUpperCase()
              )}
            </div>

            <div className="min-w-0 space-y-1.5 flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--v3-matn)]">
                  {ism}
                </h1>
                <TasdiqBelgisi tasdiqlangan={profile.isVerified || u.isVerified} olcham="katta" />
              </div>

              {profile.title && (
                <p className="text-sm font-semibold text-[var(--v3-urgu)]">
                  {profile.title}
                </p>
              )}

              <p className="text-xs text-[var(--v3-xira)]">
                {[profile.position, profile.department, profile.university || u.university]
                  .filter(Boolean)
                  .join(" · ")}
              </p>

              {profile.bannerQuote && (
                <div className="pt-2">
                  <p className="text-xs italic text-[var(--v3-matn)] border-l-2 border-[var(--v3-urgu)] pl-3">
                    “{profile.bannerQuote}”
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {stats && profile.showStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { son: stats.students, nom: "Faol talaba", ikon: "odamlar" },
              { son: stats.groups, nom: "Guruh", ikon: "kitob" },
              { son: stats.quizzes, nom: "Testlar", ikon: "quiz" },
              { son: stats.assignments, nom: "Vazifalar", ikon: "fayl" },
            ].map((s) => (
              <div key={s.nom} className="v3-panel-karta p-4 text-center">
                <div className="flex items-center justify-center text-[var(--v3-xira)] mb-1">
                  <Ikon nom={s.ikon} olcham={16} />
                </div>
                <div className="text-2xl font-bold font-mono text-[var(--v3-matn)]">{s.son}</div>
                <div className="text-[11px] text-[var(--v3-xira)]">{s.nom}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <Bolim sarlavha="Ustoz haqida" ikon="kitob">
            <p className="text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          </Bolim>
        )}

        {/* Specialties */}
        {royxat(profile.specialties).length > 0 && (
          <Bolim sarlavha="Mutaxassislik yo'nalishlari" ikon="atom">
            <div className="flex flex-wrap gap-2">
              {royxat(profile.specialties).map((s, i) => (
                <span key={i} className="v3-tag v3-tag-ochiq text-xs py-1 px-3">
                  {s}
                </span>
              ))}
            </div>
          </Bolim>
        )}

        {/* Publications & Academic Stats */}
        {profile.showPublications && ilmiySon && (
          <Bolim sarlavha="Ilmiy va akademik faoliyat" ikon="orin">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { son: profile.publications, nom: "Ilmiy maqola" },
                { son: profile.citations, nom: "Iqtiboslar" },
                { son: profile.hIndex, nom: "h-indeks" },
              ].map((s) => (
                <div key={s.nom} className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)]">
                  <div className="text-2xl font-bold font-mono text-[var(--v3-urgu)]">
                    {s.son ?? "—"}
                  </div>
                  <div className="text-[11px] text-[var(--v3-xira)] mt-1">{s.nom}</div>
                </div>
              ))}
            </div>
            {profile.experienceYears ? (
              <p className="text-xs text-[var(--v3-xira)] mt-3">
                Pedagogik tajriba: <strong className="text-[var(--v3-matn)] font-mono">{profile.experienceYears} yil</strong>
              </p>
            ) : null}
          </Bolim>
        )}

        {/* Research Areas */}
        {royxat(profile.researchAreas).length > 0 && (
          <Bolim sarlavha="Ilmiy tadqiqot mavzulari" ikon="kolba">
            <div className="space-y-3">
              {royxat(profile.researchAreas).map((r, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
                  <h3 className="font-bold text-xs text-[var(--v3-matn)]">{r.name}</h3>
                  {r.description && (
                    <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{r.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Bolim>
        )}

        {/* Courses */}
        {profile.showCourses && royxat(activeCourses).length > 0 && (
          <Bolim sarlavha="O'qitiladigan fanlar va kurslar" ikon="kitob">
            <div className="grid sm:grid-cols-2 gap-3">
              {royxat(activeCourses).map((k, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] space-y-1">
                  <h3 className="font-bold text-xs text-[var(--v3-matn)]">{k.name}</h3>
                  <div className="text-[10.5px] text-[var(--v3-urgu)] font-mono">
                    {[k.semester && `${k.semester}-semestr`, k.credits && `${k.credits} kredit`].filter(Boolean).join(" · ")}
                  </div>
                  {k.description && (
                    <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{k.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Bolim>
        )}

        {/* Education & Awards */}
        {royxat(profile.education).length > 0 && (
          <Bolim sarlavha="Akademik ta'lim" ikon="orin">
            <div className="space-y-2.5">
              {royxat(profile.education).map((e, i) => (
                <div key={i} className="flex gap-3 text-xs items-baseline">
                  <span className="font-mono font-bold text-[var(--v3-urgu)] w-14 shrink-0">
                    {e.year || "—"}
                  </span>
                  <div>
                    <div className="font-bold text-[var(--v3-matn)]">{e.degree}</div>
                    {e.university && <div className="text-[11px] text-[var(--v3-xira)]">{e.university}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Bolim>
        )}

        {/* Public Quizzes */}
        {royxat(publicQuizzes).length > 0 && (
          <Bolim sarlavha="Ustozning ochiq testlari" ikon="quiz">
            <div className="grid sm:grid-cols-2 gap-3">
              {royxat(publicQuizzes).map((q) => {
                const tavsif = quizTavsifi(q.description)
                return (
                  <Link
                    key={q.id}
                    href={`/oquv/video-darsliklar/ustoz-quiz/${q.id}`}
                    className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] hover:border-[var(--v3-urgu)] transition-all group block space-y-1.5"
                  >
                    <h3 className="font-bold text-xs text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                      {q.title}
                    </h3>
                    {tavsif && (
                      <p className="text-xs text-[var(--v3-xira)] line-clamp-1">{tavsif}</p>
                    )}
                    <div className="text-[11px] text-[var(--v3-urgu)] font-mono flex items-center justify-between pt-1">
                      <span>{q._count?.questions || 0} ta savol {q.timeLimit ? `· ${q.timeLimit} daq` : ''}</span>
                      <span>Boshlash →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Bolim>
        )}

        {/* Academic Links */}
        {(havolalar.length > 0 || (profile.showEmail && u.email)) && (
          <Bolim sarlavha="Akademik havolalar va aloqa" ikon="doska">
            <div className="flex flex-wrap gap-2">
              {havolalar.map((h) => (
                <a
                  key={h.kalit}
                  href={profile[h.kalit]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v3-tugma text-xs py-1.5 px-3"
                >
                  <Ikon nom={h.ikon} olcham={13} />
                  {h.nom}
                </a>
              ))}
              {profile.showEmail && u.email && (
                <a
                  href={`mailto:${u.email}`}
                  className="v3-tugma text-xs py-1.5 px-3"
                >
                  <Ikon nom="pochta" olcham={13} />
                  {u.email}
                </a>
              )}
            </div>
          </Bolim>
        )}

        <div className="text-center text-[11px] font-mono text-[var(--v3-xira)] pt-4">
          Profil ko{"'"}rishlar soni: {profile.views || 0}
        </div>
      </div>
    </main>
  )
}
