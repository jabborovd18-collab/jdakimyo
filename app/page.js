"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ─── Molekulyar fon animatsiyasi ───────────────────────────────────────────
function MoleculeCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let w, h

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 3 + 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // Ulanishlar
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(134,239,172,${0.12 * (1 - dist / 160)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      // Atomlar
      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(134,239,172,0.35)"
        ctx.fill()
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

// ─── Type badge ─────────────────────────────────────────────────────────────
const TYPE_META = {
  birikma: { label: "Birikma", color: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10", icon: "🧪" },
  maqola:  { label: "Maqola",  color: "text-sky-300   border-sky-500/40   bg-sky-500/10",   icon: "📄" },
  tahlil:  { label: "Tahlil",  color: "text-violet-300 border-violet-500/40 bg-violet-500/10", icon: "📊" },
  chuqur:  { label: "Chuqur",  color: "text-amber-300  border-amber-500/40  bg-amber-500/10",  icon: "🔬" },
  oquv:    { label: "O'quv",   color: "text-cyan-300   border-cyan-500/40   bg-cyan-500/10",   icon: "📖" },
  umumiy:  { label: "Umumiy",  color: "text-rose-300   border-rose-500/40   bg-rose-500/10",   icon: "📌" },
}

// ─── Stats ───────────────────────────────────────────────────────────────────
const STATS = [
  { value: "200+", label: "Kompleks birikma" },
  { value: "50+",  label: "Video darslik" },
  { value: "1000+",label: "O'quvchi" },
  { value: "4",    label: "Ta'lim bo'limi" },
]

// ─── Nav items ───────────────────────────────────────────────────────────────
const NAV = [
  { href: "/qollanma",             label: "Qo'llanma",   icon: "📖" },
  { href: "/hamkorlik/boglanish",  label: "Bog'lanish",  icon: "📞" },
  { href: "/hamkorlik/yangiliklar",label: "Yangiliklar", icon: "🔔" },
  { href: "/sertifikat",           label: "Sertifikat",  icon: "🏅" },
  { href: "/hamkorlik",            label: "Hamkorlik",   icon: "🤝" },
]

// ─── Cards ───────────────────────────────────────────────────────────────────
const CARDS = [
  {
    href: "/oquv", icon: "📚", tag: "Bepul",
    title: "O'quv bo'limi",
    desc: "IUPAC nomlanishi, izomeriya, fazoviy tuzilish va boshqa asosiy mavzular",
    accent: "from-emerald-500/20 to-teal-500/10",
    border: "hover:border-emerald-400/60",
    glow: "hover:shadow-emerald-500/20",
  },
  {
    href: "/ilmiy", icon: "🔬", tag: "Ilmiy",
    title: "Ilmiy bo'lim",
    desc: "Tadqiqotchilar uchun chuqur nazariy va amaliy materiallar",
    accent: "from-sky-500/20 to-blue-500/10",
    border: "hover:border-sky-400/60",
    glow: "hover:shadow-sky-500/20",
  },
  {
    href: "/sertifikat", icon: "🏅", tag: "Premium",
    title: "Sertifikat",
    desc: "Bilim darajangizni tasdiqlang va sertifikat oling",
    accent: "from-amber-500/20 to-yellow-500/10",
    border: "hover:border-amber-400/60",
    glow: "hover:shadow-amber-500/20",
  },
  {
    href: "/hamkorlik", icon: "🤝", tag: "Ochiq",
    title: "Hamkorlik",
    desc: "Ilmiy tadqiqotchilar va o'qituvchilar bilan birgalikda rivojlaning",
    accent: "from-violet-500/20 to-purple-500/10",
    border: "hover:border-violet-400/60",
    glow: "hover:shadow-violet-500/20",
  },
]

// ═══════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [qidiruv, setQidiruv] = useState("")
  const [barchaMalumotlar, setBarchaMalumotlar] = useState([])
  const [natijalar, setNatijalar] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetch("/data/search-index.json")
      .then(r => r.json())
      .then(d => setBarchaMalumotlar(d))
      .catch(() => setBarchaMalumotlar([]))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Tashqariga bosganda yopish
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleQidiruv = (value) => {
    setQidiruv(value)
    if (value.length < 2) { setNatijalar([]); setShowResults(false); return }
    const q = value.toLowerCase()
    const filtered = barchaMalumotlar.filter(m =>
      m.title?.toLowerCase().includes(q) ||
      m.desc?.toLowerCase().includes(q) ||
      m.keys?.toLowerCase().includes(q)
    )
    setNatijalar(filtered.slice(0, 10))
    setShowResults(true)
  }

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:    #060a10;
          --surf:  #0d1520;
          --surf2: #111c2d;
          --border:#1e3045;
          --green: #4ade80;
          --green2:#86efac;
          --text:  #e2f0ff;
          --muted: #5b7898;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── HEADER ── */
        .header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(16px, 5vw, 48px);
          height: 64px;
          transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
        }
        .header.scrolled {
          background: rgba(6,10,16,0.85);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px);
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          background: linear-gradient(120deg, #4ade80, #22d3ee, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          text-decoration: none;
        }

        .nav-links {
          display: flex; align-items: center; gap: 4px;
        }
        .nav-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }
        .nav-btn:hover { color: var(--text); background: var(--surf2); }
        .nav-icon { font-size: 1rem; }
        .nav-label { display: none; }
        @media (min-width: 640px) { .nav-label { display: inline; } }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 100px clamp(16px, 5vw, 48px) 60px;
          position: relative;
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px;
          border: 1px solid rgba(74,222,128,0.25);
          border-radius: 999px;
          background: rgba(74,222,128,0.07);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--green2);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease both;
        }
        .dot-pulse {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--green);
          animation: pulse 1.8s ease-in-out infinite;
        }

        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 8vw, 6rem);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-title .grad {
          background: linear-gradient(135deg, #4ade80 0%, #22d3ee 50%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-title .white { color: #fff; }

        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: var(--muted);
          max-width: 520px;
          line-height: 1.65;
          margin-bottom: 44px;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        /* ── SEARCH ── */
        .search-box {
          display: flex; align-items: center;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .search-box:focus-within {
          border-color: var(--green);
          box-shadow: 0 0 0 4px rgba(74,222,128,0.1);
        }
        .search-icon {
          padding: 0 16px 0 20px;
          font-size: 1.2rem;
          color: var(--muted);
          flex-shrink: 0;
        }
        .search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          padding: 18px 0;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-clear {
          padding: 0 18px;
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          font-size: 1.1rem;
          transition: color 0.2s;
        }
        .search-clear:hover { color: var(--text); }

        .search-hint {
          font-size: 0.78rem;
          color: var(--muted);
          margin-top: 12px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          flex-wrap: wrap;
        }
        .hint-tag {
          padding: 2px 10px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--surf);
          color: var(--muted);
          font-size: 0.75rem;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .hint-tag:hover { color: var(--green2); border-color: rgba(74,222,128,0.4); }

        /* ── DROPDOWN ── */
        .dropdown {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          background: var(--surf);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 48px rgba(0,0,0,0.7);
          z-index: 9999;
        }
        .dropdown-empty {
          padding: 28px;
          text-align: center;
          color: var(--muted);
          font-size: 0.9rem;
        }
        .dropdown-list { max-height: 380px; overflow-y: auto; }
        .dropdown-list::-webkit-scrollbar { width: 4px; }
        .dropdown-list::-webkit-scrollbar-track { background: transparent; }
        .dropdown-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .result-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px;
          text-decoration: none;
          color: var(--text);
          transition: background 0.15s;
          border-bottom: 1px solid var(--border);
        }
        .result-item:last-child { border-bottom: none; }
        .result-item:hover { background: var(--surf2); }
        .result-icon { font-size: 1.3rem; flex-shrink: 0; width: 36px; text-align: center; }
        .result-body { flex: 1; min-width: 0; }
        .result-badge {
          display: inline-flex;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 500;
          border-width: 1px;
          border-style: solid;
          margin-bottom: 4px;
        }
        .result-title { font-weight: 600; font-size: 0.92rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .result-desc { font-size: 0.8rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .result-arrow { color: var(--muted); font-size: 0.85rem; flex-shrink: 0; }

        /* ── STATS ── */
        .stats {
          display: flex; flex-wrap: wrap; gap: 0;
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          margin: 56px auto 0;
          max-width: 680px;
          width: 100%;
          background: var(--surf);
          animation: fadeUp 0.6s 0.4s ease both;
        }
        .stat {
          flex: 1; min-width: 130px;
          padding: 22px 16px;
          text-align: center;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .stat:nth-child(2n) { border-right: none; }
        @media (min-width: 640px) {
          .stat { min-width: 0; border-bottom: none; }
          .stat:nth-child(2n) { border-right: 1px solid var(--border); }
          .stat:last-child { border-right: none; }
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #4ade80, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label { font-size: 0.78rem; color: var(--muted); margin-top: 4px; }

        /* ── CARDS ── */
        .cards-section {
          padding: 80px clamp(16px, 5vw, 48px);
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--green2);
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 800;
          margin-bottom: 36px;
          letter-spacing: -0.02em;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .card {
          display: block;
          text-decoration: none;
          padding: 28px 24px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--surf);
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .card:hover {
          transform: translateY(-4px);
        }
        .card-glow {
          position: absolute; inset: 0;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .card:hover .card-glow { opacity: 1; }

        .card-tag {
          display: inline-flex;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(74,222,128,0.1);
          color: var(--green2);
          border: 1px solid rgba(74,222,128,0.25);
          margin-bottom: 18px;
        }
        .card-icon { font-size: 2.2rem; margin-bottom: 14px; display: block; }
        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .card-desc {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.6;
        }
        .card-arrow {
          position: absolute; right: 22px; bottom: 22px;
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
          font-size: 0.85rem;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .card:hover .card-arrow {
          background: var(--green);
          border-color: var(--green);
          color: #000;
        }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid var(--border);
          padding: 40px clamp(16px, 5vw, 48px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        .footer-name {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }
        .footer-muted { font-size: 0.8rem; color: var(--muted); }
        .footer-tg {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 6px;
          padding: 8px 18px;
          border: 1px solid var(--border);
          border-radius: 999px;
          color: var(--green2);
          font-size: 0.85rem;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .footer-tg:hover {
          border-color: rgba(74,222,128,0.5);
          background: rgba(74,222,128,0.07);
        }
      `}</style>

      {/* Fon animatsiyasi */}
      <MoleculeCanvas />

      {/* HEADER */}
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="logo">JDA KIMYO</Link>
        <nav className="nav-links">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="nav-btn">
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-eyebrow">
            <span className="dot-pulse" />
            O'zbek tilidagi kimyo platformasi
          </div>

          <h1 className="hero-title">
            <span className="grad">Kompleks</span><br />
            <span className="white">birikmalar</span><br />
            <span className="grad">kimyosi</span>
          </h1>

          <p className="hero-sub">
            IUPAC nomlanishi, izomeriya, fazoviy tuzilish va video darsliklar —
            barchasi o'zbek tilida, bir joyda.
          </p>

          {/* Search — alohida blok, dropdown overflow uchun */}
          <div style={{ width: "100%", maxWidth: 620, position: "relative", zIndex: 50 }}>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                value={qidiruv}
                onChange={e => handleQidiruv(e.target.value)}
                placeholder="Birikma, mavzu yoki tahlil usulini qidiring..."
              />
              {qidiruv && (
                <button
                  className="search-clear"
                  onClick={() => { setQidiruv(""); setNatijalar([]); setShowResults(false) }}
                >✕</button>
              )}
            </div>

            {showResults && (
              <div className="dropdown" ref={dropdownRef}>
                {natijalar.length === 0 ? (
                  <div className="dropdown-empty">Hech narsa topilmadi 🔎</div>
                ) : (
                  <div className="dropdown-list">
                    {natijalar.map((n, i) => {
                      const meta = TYPE_META[n.type] || TYPE_META.umumiy
                      return (
                        <Link
                          key={i} href={n.href} className="result-item"
                          onClick={() => { setQidiruv(""); setShowResults(false) }}
                        >
                          <span className="result-icon">{meta.icon}</span>
                          <div className="result-body">
                            <span className={`result-badge ${meta.color}`}>{meta.label}</span>
                            <div className="result-title">{n.title}</div>
                            <div className="result-desc">{n.desc}</div>
                          </div>
                          <span className="result-arrow">→</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hint — dropdowndan tashqarida, z-index past */}
          <div className="search-hint" style={{ position: "relative", zIndex: 1 }}>
            <span>Masalan:</span>
            {["qizil qon tuzi", "sisplatin", "Yan-Teller"].map(h => (
              <button key={h} className="hint-tag" onClick={() => handleQidiruv(h)}>
                {h}
              </button>
            ))}
          </div>

          {/* Stats — har doim dropdown ostida */}
          <div className="stats" style={{ position: "relative", zIndex: 1 }}>
            {STATS.map(s => (
              <div key={s.label} className="stat">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CARDS ── */}
        <section className="cards-section">
          <div className="section-label">Bo'limlar</div>
          <h2 className="section-title">Nima o'rganmoqchisiz?</h2>

          <div className="cards-grid">
            {CARDS.map((c, i) => (
              <Link key={i} href={c.href} className="card"
                style={{
                  "--card-delay": `${i * 0.08}s`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div
                  className="card-glow"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${
                      i === 0 ? "rgba(74,222,128,0.08)" :
                      i === 1 ? "rgba(34,211,238,0.08)" :
                      i === 2 ? "rgba(251,191,36,0.08)" :
                                "rgba(167,139,250,0.08)"
                    } 0%, transparent 70%)`,
                  }}
                />
                <span className="card-tag">{c.tag}</span>
                <span className="card-icon">{c.icon}</span>
                <div className="card-title">{c.title}</div>
                <div className="card-desc">{c.desc}</div>
                <div className="card-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer" style={{ position: "relative", zIndex: 1 }}>
        <div className="footer-muted">Yaratuvchi</div>
        <div className="footer-name">Diyorbek Jabborov Arslonivich</div>
        <a href="https://t.me/diyorbek_jabborov" target="_blank" rel="noreferrer" className="footer-tg">
          <span>✈️</span> @diyorbek_jabborov
        </a>
      </footer>
    </>
  )
}
