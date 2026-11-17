"use client"

import Link from "next/link"
import { Suspense, useState, useEffect, useMemo, useRef, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ALL_CONTENT,
  POPULAR_SEARCHES,
  CATEGORIES,
  VIEW_MODES,
  HOLAT_FILTRLARI,
  DARAJA_FILTRLARI,
  BOSH_FILTRLAR,
  filtrlaQidiruvNatijalari,
} from "@/lib/qidiruv-katalog"

const KATEGORIYA_TUGMA_KLASSLARI = {
  all: "bg-purple-600/60 text-white border border-purple-400/50 shadow-lg shadow-purple-500/20",
  "Ta'lim": "bg-blue-600/60 text-white border border-blue-400/50 shadow-lg shadow-blue-500/20",
  Testlar: "bg-cyan-600/60 text-white border border-cyan-400/50 shadow-lg shadow-cyan-500/20",
  "O'yinlar": "bg-violet-600/60 text-white border border-violet-400/50 shadow-lg shadow-violet-500/20",
  Vositalar: "bg-yellow-600/60 text-white border border-yellow-400/50 shadow-lg shadow-yellow-500/20",
  Jamoa: "bg-green-600/60 text-white border border-green-400/50 shadow-lg shadow-green-500/20",
}

const KATEGORIYA_TUGMA_NOFAOL =
  "bg-purple-800/30 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"

const KATEGORIYA_NISHON_KLASSLARI = {
  "Ta'lim": "bg-blue-600/30 text-blue-300 border border-blue-500/40",
  Testlar: "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40",
  "O'yinlar": "bg-violet-600/30 text-violet-300 border border-violet-500/40",
  Vositalar: "bg-yellow-600/30 text-yellow-300 border border-yellow-500/40",
  Jamoa: "bg-green-600/30 text-green-300 border border-green-500/40",
}

const KATEGORIYA_NISHON_STANDART = "bg-pink-600/30 text-pink-300 border border-pink-500/40"

function kategoriyaNishonKlassi(category) {
  return KATEGORIYA_NISHON_KLASSLARI[category] || KATEGORIYA_NISHON_STANDART
}

function HolatNishon({ status }) {
  if (status !== "tez-kunda") return null
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-600/25 text-amber-300 border border-amber-500/40">
      Tez kunda
    </span>
  )
}

function QidiruvYuklanmoqda() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-blue-950 text-white flex items-center justify-center p-6">
      <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl px-6 py-4 text-sm text-purple-200">
        Qidiruv tizimi yuklanmoqda...
      </div>
    </main>
  )
}

function QidiruvKontent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const urlQ = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(urlQ)
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState("cards")
  const [recentSearches, setRecentSearches] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState(BOSH_FILTRLAR)
  const [forumResults, setForumResults] = useState([])
  const [forumLoading, setForumLoading] = useState(false)

  const inputRef = useRef(null)
  const oxirgiUrlQRef = useRef(urlQ)

  // URL dagi `?q=` parametri bosh sahifa yoki brauzer navigatsiyasidan o'zgarganda sinxronlash
  useEffect(() => {
    if (urlQ !== oxirgiUrlQRef.current) {
      oxirgiUrlQRef.current = urlQ
      setSearchQuery(urlQ)
    }
  }, [urlQ])

  // LocalStorage dan so'nggi qidiruvlarni yuklash
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jdakimyo_recent_searches")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed)
        }
      }
    } catch {
      // Brauzer xotirasi yopiq bo'lsa jim o'tkazib yuboriladi
    }
  }, [])

  const urlQidiruvniYangila = useCallback(
    (yangiQiymat) => {
      const toza = yangiQiymat.trim()
      oxirgiUrlQRef.current = toza
      if (toza) {
        router.replace(`${pathname}?q=${encodeURIComponent(toza)}`, { scroll: false })
      } else {
        router.replace(pathname, { scroll: false })
      }
    },
    [pathname, router]
  )

  // Klaviatura yorliqlari (Ctrl+K - fokus, Esc - tozalash)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setSearchQuery("")
        if (oxirgiUrlQRef.current) {
          urlQidiruvniYangila("")
        }
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [urlQidiruvniYangila])

  // Dolzarb mavzular bo'yicha jonli qidiruv
  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2 || (activeCategory !== "all" && activeCategory !== "Jamoa")) {
      setForumResults([])
      setForumLoading(false)
      return
    }

    let bekor = false
    const taymer = setTimeout(async () => {
      setForumLoading(true)
      try {
        const res = await fetch(`/api/forum/posts?q=${encodeURIComponent(q)}&limit=6`)
        const d = await res.json()
        if (!bekor && res.ok) {
          setForumResults(d.posts || [])
        }
      } catch {
        if (!bekor) setForumResults([])
      } finally {
        if (!bekor) setForumLoading(false)
      }
    }, 300)

    return () => {
      bekor = true
      clearTimeout(taymer)
    }
  }, [searchQuery, activeCategory])

  // Qidiruv natijalarini filtrlash
  const filteredResults = useMemo(
    () =>
      filtrlaQidiruvNatijalari({
        searchQuery,
        activeCategory,
        filters: advancedFilters,
      }),
    [searchQuery, activeCategory, advancedFilters]
  )

  const saveSearch = (query) => {
    const toza = query.trim()
    if (!toza) return
    const updated = [toza, ...recentSearches.filter((s) => s !== toza)].slice(0, 8)
    setRecentSearches(updated)
    try {
      localStorage.setItem("jdakimyo_recent_searches", JSON.stringify(updated))
    } catch {
      // Brauzer xotirasi cheklangan holatlarda jim o'tiladi
    }
  }

  const removeRecentSearch = (query) => {
    const updated = recentSearches.filter((s) => s !== query)
    setRecentSearches(updated)
    try {
      localStorage.setItem("jdakimyo_recent_searches", JSON.stringify(updated))
    } catch {
      // Brauzer xotirasi cheklangan holatlarda jim o'tiladi
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const toza = searchQuery.trim()
    if (toza) {
      saveSearch(toza)
    }
    urlQidiruvniYangila(toza)
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    saveSearch(suggestion)
    urlQidiruvniYangila(suggestion)
    inputRef.current?.focus()
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (urlQ || oxirgiUrlQRef.current) {
      urlQidiruvniYangila("")
    }
    inputRef.current?.focus()
  }

  const faolFiltrlarSoni =
    (advancedFilters.status !== "all" ? 1 : 0) +
    (advancedFilters.audience !== "all" ? 1 : 0) +
    (advancedFilters.tagQuery.trim() ? 1 : 0)

  const hasQuery = searchQuery.trim().length > 0
  const hasAnyFilter = activeCategory !== "all" || faolFiltrlarSoni > 0
  const shouldShowResults = hasQuery || hasAnyFilter
  const resultCount = filteredResults.length

  const resetAllFilters = () => {
    setActiveCategory("all")
    setAdvancedFilters(BOSH_FILTRLAR)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-blue-950 text-white overflow-x-hidden">
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">Qidiruv</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">🔍</span>
                Global Qidiruv Tizimi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                {ALL_CONTENT.length} ta bo&apos;lim, {CATEGORIES.length - 1} ta kategoriya
              </p>
            </div>
            <Link href="/" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* HERO — QIDIRUV INPUT */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🔍</span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Nima qidirmoqchisiz?
                </h2>
                <p className="text-purple-300 text-sm mt-1">
                  Darslar, testlar, o&apos;yinlar, repititorlar, vositalar va jamoa bo&apos;limlari
                </p>
              </div>
            </div>

            {/* ASOSIY QIDIRUV INPUT */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center bg-purple-950/70 border-2 border-purple-600/50 rounded-2xl overflow-hidden focus-within:border-yellow-400 transition-colors">
                <span className="pl-5 text-2xl">🔍</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masalan: maktab, formulani top, milliy sertifikat, repititor..."
                  className="flex-1 bg-transparent px-4 py-5 text-white placeholder-purple-400/70 outline-none text-lg min-w-0"
                  autoComplete="off"
                  spellCheck="false"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-3 text-purple-400 hover:text-white transition-colors"
                    aria-label="Tozalash"
                  >
                    ✕
                  </button>
                )}
                <div className="hidden md:flex items-center gap-2 pr-5 text-xs text-purple-400">
                  <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono">Ctrl+K</kbd>
                </div>
              </div>
              <button type="submit" className="sr-only">Qidirish</button>
            </form>
          </div>
        </div>

        {/* KATEGORIYA FILTRLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🏷️</span> Kategoriyalar
            </h3>
            <div className="flex items-center gap-2">
              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900/30 text-red-300 border border-red-700/40 hover:bg-red-800/40 transition-colors"
                >
                  Filtrlarni tozalash
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  showAdvanced || faolFiltrlarSoni > 0
                    ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                    : "bg-purple-800/30 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <span>⚙️</span>
                <span>Kengaytirilgan filtrlar</span>
                {faolFiltrlarSoni > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-bold">
                    {faolFiltrlarSoni}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? KATEGORIYA_TUGMA_KLASSLARI[cat.id] || KATEGORIYA_TUGMA_KLASSLARI.all
                    : KATEGORIYA_TUGMA_NOFAOL
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* KENGAYTIRILGAN V4 FILTRLAR */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-purple-700/50 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-purple-300 mb-1">Bo&apos;lim holati</label>
                <select
                  value={advancedFilters.status}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, status: e.target.value })}
                  className="w-full bg-purple-950/70 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                >
                  {HOLAT_FILTRLARI.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-purple-300 mb-1">Mo&apos;ljallangan yo&apos;nalish</label>
                <select
                  value={advancedFilters.audience}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, audience: e.target.value })}
                  className="w-full bg-purple-950/70 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                >
                  {DARAJA_FILTRLARI.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-purple-300 mb-1">Kalit so&apos;z / teg</label>
                <input
                  type="text"
                  value={advancedFilters.tagQuery}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, tagQuery: e.target.value })}
                  placeholder="Masalan: rasch, 7-sinf, gps, qr"
                  className="w-full bg-purple-950/70 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-purple-400/60 focus:border-yellow-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* SO'NGGI VA OMMABOP QIDIRUVLAR (faqat filtr va query bo'sh bo'lsa) */}
        {!shouldShowResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SO'NGGI QIDIRUVLAR */}
            {recentSearches.length > 0 && (
              <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🕐</span> So&apos;nggi qidiruvlar
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setRecentSearches([])
                      try {
                        localStorage.removeItem("jdakimyo_recent_searches")
                      } catch {
                        // Jim o'tiladi
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Tozalash
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((query, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-2 bg-purple-800/30 border border-purple-700/50 rounded-lg px-3 py-1.5 hover:bg-purple-700/40 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(query)}
                        className="text-sm text-purple-200 hover:text-yellow-400"
                      >
                        {query}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRecentSearch(query)}
                        className="text-xs text-purple-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="O'chirish"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OMMABOP QIDIRUVLAR */}
            <div className={`bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 ${recentSearches.length === 0 ? "md:col-span-2" : ""}`}>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span>🔥</span> Ommabop qidiruvlar
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((query, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleSuggestionClick(query)}
                    className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-lg px-3 py-1.5 text-sm hover:bg-yellow-500/30 hover:border-yellow-400/50 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAVSIYA ETILGAN QIDIRUVLAR (query boshlanganda) */}
        {hasQuery && filteredResults.length > 0 && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
              <span>💡</span> Tavsiyalar
            </h3>
            <div className="flex flex-wrap gap-2">
              {[...new Set(
                filteredResults
                  .slice(0, 5)
                  .flatMap((r) => r.tags || [])
              )].slice(0, 8).map((tag, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSuggestionClick(tag)}
                  className="bg-purple-800/30 text-purple-300 border border-purple-700/50 rounded-lg px-3 py-1 text-xs hover:bg-purple-700/40 hover:text-yellow-400 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NATIJALAR HEADER */}
        {shouldShowResults && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {resultCount + forumResults.length === 0 && !forumLoading ? (
                  <span className="text-red-400">Hech narsa topilmadi</span>
                ) : (
                  <>
                    <span className="text-yellow-400">{resultCount + forumResults.length}</span>
                    <span className="text-purple-300"> ta natija</span>
                    {hasQuery && (
                      <span className="text-purple-400 text-sm ml-2">
                        &quot;{searchQuery}&quot; uchun
                      </span>
                    )}
                  </>
                )}
              </h2>
            </div>
            <div className="flex gap-2">
              {VIEW_MODES.map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    viewMode === mode.id
                      ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                      : "bg-purple-800/30 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span className="hidden sm:inline">{mode.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BO'SH HOLAT */}
        {shouldShowResults && filteredResults.length === 0 && !forumLoading && forumResults.length === 0 && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-10 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Hech narsa topilmadi
            </h3>
            <p className="text-purple-300 mb-6">
              {hasQuery ? (
                <>
                  <span className="text-yellow-400">&quot;{searchQuery}&quot;</span> uchun natija yo&apos;q.
                  Boshqa kalit so&apos;zlarni sinab ko&apos;ring.
                </>
              ) : (
                "Tanlangan filtrlar bo'yicha mos bo'lim topilmadi."
              )}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <p className="text-purple-400 text-sm mb-2 w-full">Ehtimol, shularni qidiryapsizmi?</p>
              {POPULAR_SEARCHES.slice(0, 6).map((query, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSuggestionClick(query)}
                  className="bg-purple-800/30 text-purple-300 border border-purple-700/50 rounded-lg px-3 py-1.5 text-sm hover:bg-yellow-600/30 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DOLZARB MAVZULARDAN NATIJALAR */}
        {hasQuery && (forumLoading || forumResults.length > 0) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
                <span>💬</span>
                <span>Dolzarb mavzular ({forumResults.length})</span>
              </h3>
              <Link href="/dolzarb" className="text-xs text-yellow-400 hover:underline">
                Barcha mavzular →
              </Link>
            </div>
            {forumLoading ? (
              <div className="text-xs text-purple-400">Muhokamalar qidirilmoqda...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {forumResults.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dolzarb/${p.id}`}
                    className="bg-purple-900/35 border border-purple-700/50 rounded-xl p-4 hover:border-yellow-400/50 transition-colors space-y-1.5"
                    onClick={() => saveSearch(searchQuery)}
                  >
                    <div className="text-sm font-bold text-white line-clamp-1">
                      {p.title || "Muhokama mavzusi"}
                    </div>
                    <p className="text-xs text-purple-300 line-clamp-2">{p.content}</p>
                    <div className="text-[11px] text-purple-400 pt-1">
                      {p.author?.fullName || p.author?.username} · {p.replyCount} javob · {p.likes} layk
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NATIJALAR — KARTALAR */}
        {shouldShowResults && filteredResults.length > 0 && viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="group bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all transform hover:-translate-y-1 flex flex-col justify-between"
                onClick={() => saveSearch(searchQuery)}
              >
                <div>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="text-3xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <HolatNishon status={item.status} />
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${kategoriyaNishonKlassi(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-purple-300 text-xs mb-3 line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(item.tags || []).slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 bg-purple-950/50 border border-purple-700/50 rounded-full text-purple-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-purple-700/30">
                  <span className="text-[10px] text-purple-400 font-mono">
                    {item.path}
                  </span>
                  <span className="text-yellow-400 text-sm group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* NATIJALAR — RO'YXAT */}
        {shouldShowResults && filteredResults.length > 0 && viewMode === "list" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl overflow-hidden">
            {filteredResults.map((item, i) => (
              <Link
                key={item.id}
                href={item.path}
                className={`group flex items-center gap-4 p-4 hover:bg-purple-800/40 transition-colors ${
                  i !== filteredResults.length - 1 ? "border-b border-purple-700/30" : ""
                }`}
                onClick={() => saveSearch(searchQuery)}
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${kategoriyaNishonKlassi(item.category)}`}>
                      {item.category}
                    </span>
                    <HolatNishon status={item.status} />
                    <span className="text-[10px] text-purple-400">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-purple-300 text-xs truncate">
                    {item.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-purple-400 font-mono hidden md:block">
                    {item.path}
                  </span>
                  <span className="text-yellow-400 text-xl group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* NATIJALAR — GRID */}
        {shouldShowResults && filteredResults.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="group bg-purple-900/40 border border-purple-700/50 rounded-xl p-4 hover:border-yellow-400/50 transition-all text-center flex flex-col items-center justify-between"
                onClick={() => saveSearch(searchQuery)}
                title={item.title}
              >
                <div>
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xs font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  <HolatNishon status={item.status} />
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${kategoriyaNishonKlassi(item.category)}`}>
                    {item.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* KLAVIATURA YORLIQLARI */}
        <div className="bg-purple-900/30 border border-purple-700/30 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
            <span>⌨️</span> Klaviatura yorliqlari
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono text-yellow-400">Ctrl+K</kbd>
              <span className="text-purple-400">Qidiruvga fokus</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono text-yellow-400">Esc</kbd>
              <span className="text-purple-400">Tozalash</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono text-yellow-400">Enter</kbd>
              <span className="text-purple-400">Qidirish va saqlash</span>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="flex justify-between pt-6">
          <Link href="/" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Bosh sahifa
          </Link>
          <Link href="/maktabkimyo" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">
            Maktab kimyosi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/30 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 O&apos;zbek tilidagi maktab va oliy kimyo ta&apos;lim platformasi • JDA KIMYO</p>
          <p className="mt-1">
            🔍 Global qidiruv tizimi • {ALL_CONTENT.length} ta bo&apos;limdan tezkor qidiruv
          </p>
        </div>
      </footer>
    </main>
  )
}

export default function QidiruvPage() {
  return (
    <Suspense fallback={<QidiruvYuklanmoqda />}>
      <QidiruvKontent />
    </Suspense>
  )
}
