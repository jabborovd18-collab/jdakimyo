"use client"
import Link from "next/link"
import { useState, useEffect, useMemo, useRef } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// QIDIRUV SAHIFASI — GLOBAL QIDIRUV TIZIMI
// Saytning asosiy bo'limlari bo'yicha tezkor qidiruv va klaviatura navigatsiyasi
//  ═══════════════════════════════════════════════════════════════════════════════

const ALL_CONTENT = [
  { id: 1, title: "Maktab kimyosi", desc: "Sinflar bo'yicha darslar va mavzular", path: "/maktabkimyo", category: "Ta'lim", type: "bo'lim", tags: ["maktab", "darslik", "7-sinf", "8-sinf"], icon: "📚" },
  { id: 2, title: "Oliy kimyo", desc: "Anorganik, organik, analitik va fizikaviy kimyo fanlari", path: "/oliykimyo", category: "Ta'lim", type: "bo'lim", tags: ["oliy", "anorganik", "organik", "analitik", "fizikaviy"], icon: "🎓" },
  { id: 3, title: "Laboratoriya mashg'ulotlari", desc: "Sinflar bo'yicha tajribalar va amaliy ishlar", path: "/laboratoriya", category: "Ta'lim", type: "bo'lim", tags: ["tajriba", "amaliy", "reaktiv"], icon: "🧪" },
  { id: 4, title: "Testlar markazi", desc: "Ustoz testlari, yozma ishlar va tayyorgarlik sinovlari", path: "/testlar", category: "Testlar", type: "bo'lim", tags: ["test", "quiz", "sinov"], icon: "📝" },
  { id: 5, title: "Ustoz testlari", desc: "Ustozlaringiz va ochiq testlar", path: "/testlar/ustoz", category: "Testlar", type: "bo'lim", tags: ["ustoz", "test", "quiz"], icon: "📝" },
  { id: 6, title: "Yozma testlar", desc: "Ustoz yuborgan yozma nazorat ishlari", path: "/testlar/yozma", category: "Testlar", type: "bo'lim", tags: ["yozma", "nazorat"], icon: "✍️" },
  { id: 7, title: "Milliy sertifikatga tayyorgarlik", desc: "Rasch modeli asosidagi tayyorgarlik sinovlari", path: "/milliy-sertifikat", category: "Testlar", type: "bo'lim", tags: ["milliy sertifikat", "rasch", "tayyorgarlik"], icon: "🏅" },
  { id: 8, title: "Masala yechish", desc: "Kimyoviy masalalarni bosqichma-bosqich yechish", path: "/masala", category: "Vositalar", type: "bo'lim", tags: ["masala", "hisoblash", "yechim"], icon: "🧮" },
  { id: 9, title: "Elektron doska", desc: "Dars va ma'ruzalar uchun sensor doska", path: "/doska", category: "Vositalar", type: "bo'lim", tags: ["doska", "dars", "proyektor"], icon: "🖥️" },
  { id: 10, title: "Do'kon", desc: "Jihozlar tez kunda qo'shiladi — laboratoriya sotuvi bo'limi", path: "/dokon", category: "Vositalar", type: "bo'lim", tags: ["do'kon", "jihoz", "reaktiv"], icon: "🛒" },
  { id: 11, title: "Dolzarb mavzular", desc: "Savol-javob va muhokama", path: "/dolzarb", category: "Jamoa", type: "bo'lim", tags: ["muhokama", "savol", "forum"], icon: "💬" },
  { id: 12, title: "Kanallar", desc: "Ustoz va tashkilotlarning kanallari", path: "/kanallar", category: "Jamoa", type: "bo'lim", tags: ["kanal", "yangilik"], icon: "📢" },
  { id: 13, title: "Hamkorlar", desc: "Hamkor tashkilotlar va ularning sinovlari", path: "/hamkorlar", category: "Jamoa", type: "bo'lim", tags: ["hamkor"], icon: "🤝" },
  { id: 14, title: "Sayt qanday ishlaydi", desc: "Bo'limlar xaritasi va qo'llanma", path: "/ishlashi", category: "Jamoa", type: "bo'lim", tags: ["qo'llanma", "yordam"], icon: "🧭" },
]

// Ommabop qidiruvlar
const POPULAR_SEARCHES = [
  "maktab", "oliy kimyo", "milliy sertifikat", "test", "masala", "doska",
  "ustoz", "laboratoriya", "muhokama", "do'kon",
]

// Kategoriyalar
const CATEGORIES = [
  { id: "all", name: "Barchasi", icon: "🌐", color: "purple" },
  { id: "Ta'lim", name: "Ta'lim", icon: "📚", color: "blue" },
  { id: "Testlar", name: "Testlar", icon: "📝", color: "cyan" },
  { id: "Vositalar", name: "Vositalar", icon: "🧮", color: "yellow" },
  { id: "Jamoa", name: "Jamoa", icon: "💬", color: "green" },
]

// View mode turlari
const VIEW_MODES = [
  { id: "cards", name: "Kartalar", icon: "🎴" },
  { id: "list", name: "Ro'yxat", icon: "📋" },
  { id: "grid", name: "Grid", icon: "⊞" },
]

export default function QidiruvPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState("cards")
  const [recentSearches, setRecentSearches] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    metal: "",
    ligand: "",
    geometry: "",
    coordinationNumber: "",
  })
  const [forumResults, setForumResults] = useState([])
  const [forumLoading, setForumLoading] = useState(false)
  const inputRef = useRef(null)

  // LocalStorage dan so'nggi qidiruvlarni yuklash
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jdakimyo_recent_searches")
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    } catch (e) {
      console.log("LocalStorage xatosi:", e)
    }
  }, [])

  // Klaviatura yorliqlari (Ctrl+K - fokus, Esc - tozalash)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setSearchQuery("")
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

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
  const filteredResults = useMemo(() => {
    let results = ALL_CONTENT

    // Kategoriya filtri
    if (activeCategory !== "all") {
      results = results.filter(item => item.category === activeCategory)
    }

    // Matn qidiruvi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      results = results.filter(item => {
        const searchable = [
          item.title,
          item.desc,
          ...(item.tags || []),
          item.category,
          item.type,
        ].join(" ").toLowerCase()
        return searchable.includes(query)
      })
    }

    // Kengaytirilgan filtrlar
    if (advancedFilters.metal) {
      results = results.filter(item => 
        (item.tags || []).some(tag => 
          tag.toLowerCase().includes(advancedFilters.metal.toLowerCase())
        )
      )
    }

    // Natijalarni ahamiyatga qarab saralash
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      results = results.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(query) ? 2 : 0
        const bTitle = b.title.toLowerCase().includes(query) ? 2 : 0
        const aTags = (a.tags || []).some(t => t.toLowerCase() === query) ? 1 : 0
        const bTags = (b.tags || []).some(t => t.toLowerCase() === query) ? 1 : 0
        return (bTitle + bTags) - (aTitle + aTags)
      })
    }

    return results
  }, [searchQuery, activeCategory, advancedFilters])

  // Qidiruvni saqlash
  const saveSearch = (query) => {
    if (!query.trim()) return
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 8)
    setRecentSearches(updated)
    try {
      localStorage.setItem("jdakimyo_recent_searches", JSON.stringify(updated))
    } catch (e) {
      console.log("LocalStorage xatosi:", e)
    }
  }

  // So'nggi qidiruvni o'chirish
  const removeRecentSearch = (query) => {
    const updated = recentSearches.filter(s => s !== query)
    setRecentSearches(updated)
    try {
      localStorage.setItem("jdakimyo_recent_searches", JSON.stringify(updated))
    } catch (e) {
      console.log("LocalStorage xatosi:", e)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      saveSearch(searchQuery.trim())
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    saveSearch(suggestion)
    inputRef.current?.focus()
  }

  const clearSearch = () => {
    setSearchQuery("")
    inputRef.current?.focus()
  }

  const resultCount = filteredResults.length
  const hasQuery = searchQuery.trim().length > 0

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
                {ALL_CONTENT.length} ta bo'lim, {CATEGORIES.length - 1} kategoriya
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
                  Darslar, testlar, vositalar va jamoa bo'limlari
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
                  placeholder="Masalan: maktab, test, masala, doska..."
                  className="flex-1 bg-transparent px-4 py-5 text-white placeholder-purple-500 outline-none text-lg"
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🏷️</span> Kategoriyalar
            </h3>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                showAdvanced
                  ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              <span>⚙️</span>
              Kengaytirilgan filtrlar
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? `bg-${cat.color}-600/60 text-white border border-${cat.color}-400/50 shadow-lg shadow-${cat.color}-500/20`
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* KENGAYTIRILGAN FILTRLAR */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-purple-700/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-purple-400 mb-1">Metall ioni</label>
                <input
                  type="text"
                  value={advancedFilters.metal}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, metal: e.target.value })}
                  placeholder="Masalan: Fe²⁺, Pt²⁺"
                  className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-purple-600 focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-400 mb-1">Ligand</label>
                <input
                  type="text"
                  value={advancedFilters.ligand}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, ligand: e.target.value })}
                  placeholder="Masalan: CN⁻, NH₃"
                  className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-purple-600 focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-400 mb-1">Geometriya</label>
                <select
                  value={advancedFilters.geometry}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, geometry: e.target.value })}
                  className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                >
                  <option value="">Barchasi</option>
                  <option value="oktaedr">Oktaedr</option>
                  <option value="tetraedr">Tetraedr</option>
                  <option value="tekis kvadrat">Tekis kvadrat</option>
                  <option value="chiziqli">Chiziqli</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-purple-400 mb-1">Koordinatsion son</label>
                <select
                  value={advancedFilters.coordinationNumber}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, coordinationNumber: e.target.value })}
                  className="w-full bg-purple-950/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                >
                  <option value="">Barchasi</option>
                  <option value="2">KCH = 2</option>
                  <option value="4">KCH = 4</option>
                  <option value="5">KCH = 5</option>
                  <option value="6">KCH = 6</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* SO'NGGI VA OMMABOP QIDIRUVLAR (faqat query bo'sh bo'lsa) */}
        {!hasQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SO'NGGI QIDIRUVLAR */}
            {recentSearches.length > 0 && (
              <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🕐</span> So'nggi qidiruvlar
                  </h3>
                  <button
                    onClick={() => {
                      setRecentSearches([])
                      try {
                        localStorage.removeItem("jdakimyo_recent_searches")
                      } catch (e) {
                        console.log("LocalStorage xatosi:", e)
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
                        onClick={() => handleSuggestionClick(query)}
                        className="text-sm text-purple-200 hover:text-yellow-400"
                      >
                        {query}
                      </button>
                      <button
                        onClick={() => removeRecentSearch(query)}
                        className="text-xs text-purple-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span>🔥</span> Ommabop qidiruvlar
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.slice(0, 12).map((query, i) => (
                  <button
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
                  .flatMap(r => r.tags || [])
              )].slice(0, 8).map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-purple-800/30 text-purple-300 border border-purple-700/50 rounded-lg px-3 py-1 text-xs hover:bg-purple-700/40 hover:text-yellow-400 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NATIJALAR HEADER */}
        {hasQuery && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {resultCount + forumResults.length === 0 && !forumLoading ? (
                  <span className="text-red-400">Hech narsa topilmadi</span>
                ) : (
                  <>
                    <span className="text-yellow-400">{resultCount + forumResults.length}</span>
                    <span className="text-purple-300"> ta natija</span>
                    <span className="text-purple-500 text-sm ml-2">
                      &quot;{searchQuery}&quot; uchun
                    </span>
                  </>
                )}
              </h2>
            </div>
            <div className="flex gap-2">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    viewMode === mode.id
                      ? "bg-yellow-600/60 text-white border border-yellow-400/50"
                      : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
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
        {hasQuery && filteredResults.length === 0 && !forumLoading && forumResults.length === 0 && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-10 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Hech narsa topilmadi
            </h3>
            <p className="text-purple-300 mb-6">
              <span className="text-yellow-400">&quot;{searchQuery}&quot;</span> uchun natija yo&apos;q.
              Boshqa kalit so&apos;zlarni sinab ko&apos;ring.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <p className="text-purple-400 text-sm mb-2 w-full">Ehtimol, shularni qidiryapsizmi?</p>
              {POPULAR_SEARCHES.slice(0, 6).map((query, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(query)}
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
                    onClick={() => saveSearch(searchQuery.trim())}
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
        {hasQuery && filteredResults.length > 0 && viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="group bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-5 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all transform hover:-translate-y-1"
                onClick={() => saveSearch(searchQuery.trim())}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.category === "Ta'lim" ? "bg-blue-600/30 text-blue-400 border border-blue-600/50" :
                    item.category === "Testlar" ? "bg-cyan-600/30 text-cyan-400 border border-cyan-600/50" :
                    item.category === "Vositalar" ? "bg-yellow-600/30 text-yellow-400 border border-yellow-600/50" :
                    item.category === "Jamoa" ? "bg-green-600/30 text-green-400 border border-green-600/50" :
                    "bg-pink-600/30 text-pink-400 border border-pink-600/50"
                  }`}>
                    {item.category}
                  </span>
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
                <div className="flex items-center justify-between pt-3 border-t border-purple-700/30">
                  <span className="text-[10px] text-purple-500 font-mono">
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
        {hasQuery && filteredResults.length > 0 && viewMode === "list" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl overflow-hidden">
            {filteredResults.map((item, i) => (
              <Link
                key={item.id}
                href={item.path}
                className={`group flex items-center gap-4 p-4 hover:bg-purple-800/40 transition-colors ${
                  i !== filteredResults.length - 1 ? "border-b border-purple-700/30" : ""
                }`}
                onClick={() => saveSearch(searchQuery.trim())}
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.category === "Ta'lim" ? "bg-blue-600/30 text-blue-400" :
                      item.category === "Testlar" ? "bg-cyan-600/30 text-cyan-400" :
                      item.category === "Vositalar" ? "bg-yellow-600/30 text-yellow-400" :
                      item.category === "Jamoa" ? "bg-green-600/30 text-green-400" :
                      "bg-pink-600/30 text-pink-400"
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-purple-500">
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
                  <span className="text-[10px] text-purple-500 font-mono hidden md:block">
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
        {hasQuery && filteredResults.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredResults.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="group bg-purple-900/40 border border-purple-700/50 rounded-xl p-4 hover:border-yellow-400/50 transition-all text-center"
                onClick={() => saveSearch(searchQuery.trim())}
                title={item.title}
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xs font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  item.category === "Ta'lim" ? "bg-blue-600/30 text-blue-400" :
                  item.category === "Testlar" ? "bg-cyan-600/30 text-cyan-400" :
                  item.category === "Vositalar" ? "bg-yellow-600/30 text-yellow-400" :
                  item.category === "Jamoa" ? "bg-green-600/30 text-green-400" :
                  "bg-pink-600/30 text-pink-400"
                }`}>
                  {item.category}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* KLAVIATURA YORLIQLARI */}
        <div className="bg-purple-900/30 border border-purple-700/30 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
            <span>⌨️</span> Klaviatura yorliqlari
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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
              <span className="text-purple-400">Qidirish</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-purple-800/60 rounded border border-purple-700 font-mono text-yellow-400">↑ ↓</kbd>
              <span className="text-purple-400">Navigatsiya</span>
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
          <p>© 2026 Koordinatsion kimyo tahlil portali • JDA KIMYO</p>
          <p className="mt-1">
            🔍 Global qidiruv tizimi • {ALL_CONTENT.length}+ sahifadan tezkor qidiruv
          </p>
        </div>
      </footer>
    </main>
  )
}