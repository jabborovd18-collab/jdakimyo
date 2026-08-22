"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

import { useSession, signOut } from "next-auth/react"
import { ustozPaneliOchiqmi, isPartnerRole } from "@/lib/roles"
import HAJM from "@/lib/ilmiy-hajm.json"
import { BAZA } from "@/lib/sayt-malumot"
import { FANLAR, fanHavolasi, ochiqFanlarSoni } from "@/lib/fanlar"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"
import Ikon from "@/components/Ikon"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import { useBildirishnomaSanoq } from "@/lib/use-bildirishnoma"

/* ═══════════════════════════════════════════════════════════════════════
   BOSH SAHIFA — v3.0.0

   NIMA O'ZGARDI VA NEGA.

   1) Sayt endi "kompleks birikmalar sayti" emas. Koordinatsion kimyo —
      fanlardan bittasi. Shuning uchun bosh sahifadagi asosiy harakat
      "bo'limga kirish" emas, FAN TANLASH. Aylanuvchi [Co(NH₃)₆]³⁺ modeli
      olib tashlandi: u bitta fanning belgisi edi va butun platformani
      o'sha fan bilan tenglashtirib qo'yardi. O'rniga — yetti fan
      tugunidan iborat halqa, ya'ni sahifaning o'z mazmuni.

   2) Emoji yo'q. Sabablari `components/Ikon.jsx` da yozilgan: emoji har
      tizimda boshqacha chiziladi, rangi qattiq yozilgan va chiziq
      qalinligi yo'q. Barcha belgilar endi `currentColor` bilan
      chiziladigan SVG.

   3) Ranglar sinf ichida emas, CSS o'zgaruvchisida (`lib/sahifa-fon.js`).
      Shu sababli bu sahifada fon almashtirish ISHLAYDI — saytning qolgan
      qismida ishlamaydi va ishlay olmaydi ham (`lib/interfeys.js` dagi
      izohga qarang: ranglar 585 faylda qattiq yozilgan). v3 dan keyin
      yoziladigan sahifalar shu qoida bilan yoziladi.

   MANZILLAR KO'CHIRILMADI: `/oquv`, `/ilmiy` va ularning ostidagi 117
   sahifa o'z joyida. `/fan/koordinatsion-kimyo` — ular ustidagi qobiq.
   ══════════════════════════════════════════════════════════════════════ */

// Lentadagi formulalar. Ilgari hammasi koordinatsion birikma edi; endi
// har bir fandan bittadan — lenta ham platformaning qamrovini aytadi.
const LENTA = [
  "[Co(NH₃)₆]³⁺", "C₆H₆", "ΔG = ΔH − TΔS", "Fe₂O₃", "ATP",
  "[Fe(CN)₆]⁴⁻", "pH = pKₐ + lg([A⁻]/[HA])", "γ · dA", "CH₃COOH",
  "[Cu(H₂O)₄]²⁺", "N₂ + 3H₂ ⇌ 2NH₃", "C₆H₁₂O₆", "[PtCl₄]²⁻", "K = e^(−ΔG/RT)",
]

/**
 * Yaratuvchining rasmi.
 *
 * XATO USHLAGICHI SAQLANDI. Rasm `public/yaratuvchi.jpg` da turadi va
 * repozitoriyga qo'lda qo'yiladi. `onError` yolg'iz yetarli emas: sahifa
 * serverda chizilgani uchun brauzer rasmni React gidratlanishidan OLDIN
 * yuklashni boshlaydi va fayl yo'q bo'lsa xato ushlagich ulanmasidan
 * oldin sodir bo'ladi. `naturalWidth === 0` — yuklanib bo'lgan rasmda
 * "yiqildi" degani.
 *
 * Zaxira endi emoji emas, ikonka: qolgan sahifa bilan bir uslubda.
 */
function YaratuvchiRasmi() {
  const [xato, setXato] = useState(false)
  const rasmRef = useRef(null)

  useEffect(() => {
    const el = rasmRef.current
    if (el && el.complete && el.naturalWidth === 0) setXato(true)
  }, [])

  return (
    <div className="v3-avatar shrink-0">
      {xato ? (
        <span className="v3-avatar-zaxira">
          <Ikon nom="odam" olcham={34} qalin={1.3} />
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={rasmRef}
          src="/yaratuvchi.jpg"
          alt="Diyorbek Jabborov"
          className="w-full h-full object-cover rounded-full"
          onError={() => setXato(true)}
        />
      )}
    </div>
  )
}

/**
 * Yetti fan tuguni bo'lgan halqa — hero'ning o'ng tomoni.
 *
 * Bu bezak emas, sahifaning asosiy g'oyasining rasmi: markazda platforma,
 * atrofida fanlar, ochig'i yorqin va markazga to'liq chiziq bilan ulangan,
 * qolganlari xira va uzuq chiziq bilan. Ya'ni odam matnni o'qimasdan ham
 * "bitta fan tayyor, oltitasi kutilmoqda" degan xabarni oladi.
 *
 * Nuqtalar joyi FANLAR ro'yxatidan hisoblanadi — fan qo'shilsa halqa
 * o'zi qayta taqsimlanadi, qo'lda koordinata yozilmaydi.
 */
function FanHalqasi() {
  const R = 138
  const C = 175

  const tugunlar = FANLAR.map((fan, i) => {
    const burchak = (-90 + (360 / FANLAR.length) * i) * (Math.PI / 180)
    return {
      fan,
      x: C + R * Math.cos(burchak),
      y: C + R * Math.sin(burchak),
    }
  })

  return (
    <div className="v3-halqa" role="img" aria-label={`Yetti fan: ${ochiqFanlarSoni()} tasi ochiq, qolgani tayyorlanmoqda`}>
      <svg viewBox="0 0 350 350" className="w-full h-full">
        {/* Halqa chizig'i */}
        <circle cx={C} cy={C} r={R} className="v3-halqa-chiziq" />
        <circle cx={C} cy={C} r={R - 26} className="v3-halqa-sweep" />

        {/* Markazdan tugunlarga */}
        {tugunlar.map(({ fan, x, y }) => (
          <line
            key={`l-${fan.slug}`}
            x1={C} y1={C} x2={x} y2={y}
            className={fan.holat === "ochiq" ? "v3-nur-ochiq" : "v3-nur-yopiq"}
          />
        ))}

        {/* Markaz */}
        <circle cx={C} cy={C} r="30" className="v3-yadro-halo" />
        <circle cx={C} cy={C} r="21" className="v3-yadro" />
        <text x={C} y={C + 4} textAnchor="middle" className="v3-yadro-matn">JDA</text>

        {/* Tugunlar */}
        {tugunlar.map(({ fan, x, y }, i) => (
          <g key={fan.slug}>
            {fan.holat === "ochiq" && (
              <circle cx={x} cy={y} r="20" className="v3-tugun-halo" />
            )}
            <circle
              cx={x} cy={y} r="9"
              className={fan.holat === "ochiq" ? "v3-tugun-ochiq" : "v3-tugun-yopiq"}
              style={{ animationDelay: `${i * 260}ms` }}
            />
          </g>
        ))}
      </svg>

      <div className="v3-halqa-izoh">
        <span className="v3-nuqta" />
        <span>
          <strong>Koordinatsion kimyo</strong> — ochiq
        </span>
      </div>
    </div>
  )
}

/** Fan kartasi. Ochig'i havola, yopig'i esa izoh ochadigan tugma. */
function FanKarta({ fan, raqam, kengmi }) {
  const [izoh, setIzoh] = useState(false)
  const ochiq = fan.holat === "ochiq"

  const ichi = (
    <>
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className="v3-raqam">{String(raqam).padStart(2, "0")}</span>
        <span className={`v3-holat ${ochiq ? "is-ochiq" : ""}`}>
          <Ikon nom={ochiq ? "ochiq" : "qulf"} olcham={13} qalin={1.8} />
          {ochiq ? "Ochiq" : "Tayyorlanmoqda"}
        </span>
      </div>

      <div className={kengmi ? "md:flex md:items-end md:justify-between md:gap-10" : ""}>
        <div className={kengmi ? "md:max-w-2xl" : ""}>
          <div className="v3-nishon mb-2">{fan.qisqa}</div>
          <h3 className={`v3-fan-nom ${kengmi ? "text-2xl md:text-3xl" : "text-xl"}`}>
            {fan.nom}
          </h3>
          <p className="v3-fan-tavsif">{fan.tavsif}</p>
        </div>

        {kengmi && (
          <div className="hidden md:block shrink-0 text-right">
            <div className="v3-formula text-lg">{fan.belgi}</div>
            <div className="v3-nishon mt-2">{fan.bolimlar.length} bo{"'"}lim</div>
          </div>
        )}
      </div>

      {!kengmi && <div className="v3-formula mt-4">{fan.belgi}</div>}

      {ochiq && (
        <div className="v3-fan-oyoq">
          <span>Fanga kirish</span>
          <Ikon nom="ong" olcham={17} />
        </div>
      )}

      {!ochiq && izoh && (
        <p className="v3-fan-izoh">
          Bu fan hali yozilmagan. Materiallar tayyor bo{"'"}lgach qulf ochiladi va
          bosh sahifada e{"'"}lon qilinadi.
        </p>
      )}
    </>
  )

  if (ochiq) {
    return (
      <Link
        href={fanHavolasi(fan)}
        data-reveal
        className={`v3-fan-karta is-ochiq ${kengmi ? "lg:col-span-3" : ""}`}
      >
        {ichi}
      </Link>
    )
  }

  return (
    <button
      type="button"
      data-reveal
      onClick={() => setIzoh((v) => !v)}
      aria-expanded={izoh}
      className="v3-fan-karta is-yopiq text-left"
    >
      {ichi}
    </button>
  )
}

/** Umumiy bo'lim plitkasi */
function BolimKarta({ href, ikon, nom, tavsif, nishon, urgulimi }) {
  return (
    <Link href={href} data-reveal className={`v3-bolim ${urgulimi ? "is-urguli" : ""}`}>
      <span className="v3-bolim-ikon">
        <Ikon nom={ikon} olcham={22} qalin={1.5} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2 flex-wrap">
          <span className="v3-bolim-nom">{nom}</span>
          {nishon && <span className="v3-chip">{nishon}</span>}
        </span>
        <span className="v3-bolim-tavsif">{tavsif}</span>
      </span>
      <span className="v3-bolim-ong">
        <Ikon nom="ong" olcham={17} />
      </span>
    </Link>
  )
}

export default function Home() {
  const { data: session, status } = useSession()
  const [fon, fonTanla] = useFon()
  const [mobilOgoh, setMobilOgoh] = useState(false)
  const [menyu, setMenyu] = useState(false)
  const [mobilNav, setMobilNav] = useState(false)

  const role = session?.user?.role
  const isAdmin = ["admin", "superadmin", "moderator"].includes(role)
  // Ustozlik alohida bayroq: rol satriga qarash adminlarni panelidan
  // mahrum qilardi (rol bitta bo'lgani uchun).
  const isTeacher = ustozPaneliOchiqmi(session?.user)
  const isHamkor = isPartnerRole(role)

  // O'qilmagan xabar sanog'i sarlavhadagi chat tugmasi uchun. Mehmonlar
  // uchun o'chirilgan: ular uchun so'rov faqat 401 qaytaradi.
  const { sanoq } = useBildirishnomaSanoq(Boolean(session))
  const oqilmaganChat = sanoq.chat || 0

  useReveal()

  useEffect(() => {
    const mobil = window.innerWidth < 768
    if (mobil && !localStorage.getItem("mobileWarningDismissed")) setMobilOgoh(true)
  }, [])

  const ogohYop = () => {
    localStorage.setItem("mobileWarningDismissed", "true")
    setMobilOgoh(false)
  }

  const bosHarf = () => {
    const n = session?.user?.fullName || session?.user?.username
    return n ? n.charAt(0).toUpperCase() : "U"
  }

  // Bosh menyu — faqat UMUMIY bo'limlar. Fanga tegishli havolalar
  // (birikmalar, tahlil, chuqurlashgan) endi bu yerda emas, fan
  // sahifasining ichida: aks holda menyu bitta fanning menyusiga
  // aylanib qoladi.
  const navHavolalar = [
    { href: "/#fanlar", label: "Fanlar" },
    { href: "/masala", label: "AI Masalalar (Beta)" },
    { href: "/ilmiy/maqolalar/muhokama", label: "Dolzarb mavzular" },
    { href: "/laboratoriya", label: "Laboratoriya" },
    // Bo'lim nomi "video-darsliklar" bo'lsa ham, videolar hali TAYYOR EMAS
    // (o'sha sahifada "tez kunda" deb turibdi). Menyuda "Video" deyish —
    // bosilgach yo'q narsani va'da qilish demak.
    { href: "/oquv/video-darsliklar", label: "Testlar" },
    { href: "/kanallar", label: "Kanallar" },
  ]

  const rolPanellari = [
    isAdmin && { href: "/admin", ikon: "qalqon", label: "Admin panel" },
    isTeacher && { href: "/ustoz", ikon: "ustoz", label: "Ustoz paneli" },
    isHamkor && { href: "/hamkorlar", ikon: "hamkor", label: "Hamkor paneli" },
  ].filter(Boolean)

  const kabinet = session
    ? {
        href: "/profil",
        ikon: "odam",
        nom: "Shaxsiy kabinet",
        tavsif: "Profil, statistika, yutuqlar, do'stlar va sertifikatlar",
        nishon: null,
      }
    : {
        href: "/register",
        ikon: "yulduz",
        nom: "Ro'yxatdan o'tish",
        tavsif: "Hisob yarating, progressingizni kuzating va yutuq to'plang",
        nishon: "Bepul",
      }

  return (
    <main data-fon={fon} className="v3 min-h-screen overflow-x-hidden">

      {/* ═══ MOBIL OGOHLANTIRISH ═══ */}
      {mobilOgoh && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 v3-parda">
          <div className="v3-modal v3-tushish">
            <div className="flex items-center gap-3 mb-4">
              <span className="v3-modal-ikon">
                <Ikon nom="doska" olcham={20} />
              </span>
              <div>
                <h3 className="font-bold text-[15px]">Mobil qurilma aniqlandi</h3>
                <p className="v3-xira text-xs">Muhim ma{"'"}lumot</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed v3-xira mb-5">
              Sayt kompyuterlar uchun to{"'"}liq moslashgan. Mobil qurilmalarda
              ayrim bo{"'"}limlarda — ayniqsa 3D modellar va laboratoriyada —
              sekinlashish kuzatilishi mumkin.
            </p>

            <button onClick={ogohYop} className="v3-tugma-asosiy w-full justify-center">
              Tushundim, davom etish
            </button>
          </div>
        </div>
      )}

      {/* ═══ SARLAVHA ═══ */}
      <header className="v3-header">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3.5">

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobilNav((v) => !v)}
              className="v3-ikon-tugma md:hidden"
              aria-label="Menyu"
              aria-expanded={mobilNav}
            >
              <Ikon nom={mobilNav ? "yopish" : "menyu"} olcham={19} />
            </button>

            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-0.5">
            {navHavolalar.map((h) => (
              <Link key={h.href} href={h.href} className="v3-nav">
                {h.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {rolPanellari.map((p) => (
              <Link key={p.href} href={p.href} className="v3-rol-tugma" title={p.label}>
                <Ikon nom={p.ikon} olcham={16} />
                <span className="hidden xl:inline">{p.label}</span>
              </Link>
            ))}

            <FonTanlagich fon={fon} tanla={fonTanla} />

            <Link href="/qidiruv" className="v3-qidiruv">
              <Ikon nom="qidiruv" olcham={17} />
              <span className="hidden lg:inline">Qidiruv</span>
              <kbd className="hidden lg:inline-block">⌘K</kbd>
            </Link>

            {/* Shaxsiy chat. Sarlavhadagi umumiy menyuda emas, aynan shu
                yerda: u bo'lim emas, hisobga bog'liq harakat — mehmonga
                ko'rsatiladigan joyi yo'q. Mobilda ham qoladi (yashirilmaydi),
                chunki yangi xabar kelganini shu nishon bildiradi. */}
            {session && (
              <Link
                href="/chat"
                className="v3-ikon-tugma v3-sanoqli"
                title="Xabarlar"
                aria-label={
                  oqilmaganChat > 0
                    ? `Xabarlar — ${oqilmaganChat} ta o'qilmagan`
                    : "Xabarlar"
                }
              >
                <Ikon nom="xabar" olcham={17} />
                {oqilmaganChat > 0 && (
                  <span className="v3-sanoq">{oqilmaganChat > 99 ? "99+" : oqilmaganChat}</span>
                )}
              </Link>
            )}

            {status === "loading" ? (
              <div className="v3-yuklanmoqda" />
            ) : session ? (
              <div className="relative">
                <button onClick={() => setMenyu((v) => !v)} className="v3-profil-tugma" aria-expanded={menyu}>
                  <span className="v3-bosharf">{bosHarf()}</span>
                  <span className="hidden sm:inline max-w-[110px] truncate">
                    {session.user?.fullName || session.user?.username}
                  </span>
                  <Ikon nom="past" olcham={15} className={menyu ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>

                {menyu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenyu(false)} />
                    <div className="v3-menyu v3-tushish absolute right-0 mt-2 w-[268px] z-50 overflow-hidden">

                      <div className="v3-menyu-bosh">
                        <span className="v3-bosharf v3-bosharf-katta">{bosHarf()}</span>
                        <div className="min-w-0">
                          <div className="font-semibold truncate text-[14px]">
                            {session.user?.fullName || session.user?.username}
                          </div>
                          <div className="v3-xira text-xs truncate">@{session.user?.username}</div>
                          <div className="v3-id">ID {session.user?.userId}</div>
                        </div>
                      </div>

                      <div className="p-1.5">
                        {rolPanellari.map((p) => (
                          <Link key={p.href} href={p.href} onClick={() => setMenyu(false)} className="v3-menyu-qator is-urguli">
                            <Ikon nom={p.ikon} olcham={17} />
                            <span className="flex-1 text-[13px] font-semibold">{p.label}</span>
                            <Ikon nom="ong" olcham={15} />
                          </Link>
                        ))}

                        {[
                          { href: "/profil", ikon: "odam", label: "Shaxsiy kabinet" },
                          { href: "/chat", ikon: "xabar", label: "Xabarlarim", soni: oqilmaganChat },
                          { href: "/profil/quizlar", ikon: "quiz", label: "Test natijalarim" },
                          { href: "/profil/yutuqlar", ikon: "yulduz", label: "Yutuqlarim" },
                          { href: "/profil/dostlar", ikon: "odamlar", label: "Do'stlarim" },
                          { href: "/laboratoriya", ikon: "kolba", label: "Laboratoriyam" },
                        ].map((m) => (
                          <Link key={m.href} href={m.href} onClick={() => setMenyu(false)} className="v3-menyu-qator">
                            <Ikon nom={m.ikon} olcham={17} />
                            <span className="flex-1 text-[13px]">{m.label}</span>
                            {m.soni > 0 ? (
                              <span className="v3-sanoq is-qatorda">
                                {m.soni > 99 ? "99+" : m.soni}
                              </span>
                            ) : (
                              <Ikon nom="ong" olcham={15} className="v3-strelka" />
                            )}
                          </Link>
                        ))}
                      </div>

                      <div className="v3-menyu-oyoq">
                        <button
                          onClick={() => { setMenyu(false); signOut({ callbackUrl: "/" }) }}
                          className="v3-menyu-qator is-xavf w-full"
                        >
                          <Ikon nom="chiqish" olcham={17} />
                          <span className="flex-1 text-left text-[13px] font-semibold">Chiqish</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Elektron doska: o'qituvchi auditoriyada `jdakimyo.uz` deb
                    kiradi va shu yerga tushadi. Yo'l aynan shu yerdan
                    ko'rinmasa, QR tizimini topib bo'lmaydi. */}
                <Link href="/doska" className="v3-ikon-tugma v3-mobil-yashir" title="Elektron doska">
                  <Ikon nom="doska" olcham={17} />
                </Link>
                {/* Tor ekranda faqat asosiy harakat qoladi — "Kirish"
                    mobil menyuda. Ikkalasi ham turganda sarlavha 375px
                    ekranga sig'masdi va tugma chetdan chiqib ketardi. */}
                <Link href="/login" className="v3-tugma v3-mobil-yashir">Kirish</Link>
                <Link href="/register" className="v3-tugma-asosiy">
                  <span className="hidden sm:inline">Ro{"'"}yxatdan o{"'"}tish</span>
                  <span className="sm:hidden">Boshlash</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobil navigatsiya */}
        <div className={`md:hidden v3-mobil-nav ${mobilNav ? "is-ochiq" : ""}`}>
          <nav className="v3-konteyner flex flex-col gap-0.5 py-2.5">
            {navHavolalar.map((h) => (
              <Link key={h.href} href={h.href} onClick={() => setMobilNav(false)} className="v3-mobil-qator">
                {h.label}
              </Link>
            ))}
            {session && (
              <Link
                href="/chat"
                onClick={() => setMobilNav(false)}
                className="v3-mobil-qator flex items-center gap-2"
              >
                <span className="flex-1">Xabarlar</span>
                {oqilmaganChat > 0 && (
                  <span className="v3-sanoq is-qatorda">
                    {oqilmaganChat > 99 ? "99+" : oqilmaganChat}
                  </span>
                )}
              </Link>
            )}
            <Link href="/doska" onClick={() => setMobilNav(false)} className="v3-mobil-qator">
              Elektron doska
            </Link>
            <Link href="/hamkorlik" onClick={() => setMobilNav(false)} className="v3-mobil-qator">
              Hamkorlik
            </Link>
            {/* Sarlavhadagi "Kirish" tor ekranda yashirilgan — yo'l shu yerda */}
            {!session && status !== "loading" && (
              <Link href="/login" onClick={() => setMobilNav(false)} className="v3-mobil-qator">
                Kirish
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="v3-nur v3-nur-a" aria-hidden="true" />
        <div className="v3-nur v3-nur-b" aria-hidden="true" />
        <div className="v3-tor-fon" aria-hidden="true" />

        <div className="v3-konteyner relative z-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-10 items-center">

            <div>
              {session ? (
                <Link href="/profil" className="v3-salom">
                  <span className="v3-bosharf">{bosHarf()}</span>
                  <span>
                    Xush kelibsiz,{" "}
                    <strong>{session.user?.fullName || session.user?.username}</strong>
                  </span>
                  <Ikon nom="ong" olcham={15} />
                </Link>
              ) : (
                <div className="v3-eyebrow">
                  <span className="v3-nuqta" />
                  O{"'"}zbek tilidagi oliy kimyo platformasi
                </div>
              )}

              {/* Ikki qator ikkita BLOK span bilan berilgan, `<br>` bilan
                  emas. `<br>` da qulay o'qigich sarlavhani "Oliy
                  kimyofanlar bo'yicha" deb bir so'zga yopishtirib o'qirdi —
                  blok elementlar orasiga esa bo'shliq qo'yiladi. */}
              <h1 className="v3-h1">
                <span className="v3-urgu-matn block">Oliy kimyo</span>
                <span className="block">fanlar bo{"'"}yicha</span>
              </h1>

              <p className="v3-lid">
                Koordinatsion kimyo to{"'"}liq ochiq: nazariyadan tahlil
                usullarigacha, 3D modellar va testlar bilan. Qolgan fanlar
                navbat bilan qo{"'"}shiladi — har biri o{"'"}z daraxti bilan.
              </p>

              <div className="flex flex-wrap gap-3 mb-11">
                <a href="#fanlar" className="v3-tugma-asosiy v3-katta">
                  Fanlarni ko{"'"}rish
                  <Ikon nom="past" olcham={17} />
                </a>
                <Link href="/ishlashi" className="v3-tugma v3-katta">
                  <Ikon nom="kitob" olcham={17} />
                  Sayt qanday ishlaydi
                </Link>
                {/* "JDA KIMYO nima?" sahifasiga bosh sahifadan havola
                    BO'LISHI SHART: qidiruv roboti sayt bo'ylab havola
                    bo'yicha yuradi va eng ko'p vaznni bosh sahifadan
                    chiqqan havolaga beradi. */}
                <Link href="/jda-kimyo" className="v3-tugma v3-katta">
                  <Ikon nom="atom" olcham={17} />
                  JDA KIMYO nima?
                </Link>
              </div>

              {/* Sonlar `lib/ilmiy-hajm.json` dan — sahifa qo'shilganda
                  o'zi yangilanadi. Quiz savollari bazada bo'lgani uchun
                  (sahifa "use client") pastga yaxlitlangan son turadi:
                  o'sib borsa ham to'g'ri bo'lib qolaveradi. */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px v3-sonlar">
                {[
                  { son: String(HAJM.birikmalar), nom: "Birikma" },
                  { son: String(HAJM.usullar), nom: "Tahlil usuli" },
                  { son: String(HAJM.mavzular), nom: "Chuqur mavzu" },
                  { son: BAZA.savollar, nom: "Test savoli" },
                ].map((s) => (
                  <div key={s.nom} className="v3-son">
                    <div className="v3-son-qiymat"><CountUp value={s.son} /></div>
                    <div className="v3-son-nom">{s.nom}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <FanHalqasi />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FORMULALAR LENTASI ═══ */}
      <div className="v3-lenta-qobiq">
        <div className="v3-lenta">
          {[...LENTA, ...LENTA].map((f, i) => (
            <span key={i} className="v3-lenta-band">
              {f}
              <span className="v3-lenta-ajratgich">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ FANLAR ═══ */}
      <section id="fanlar" className="v3-konteyner py-16 md:py-24 scroll-mt-20">
        <div className="v3-bosh" data-reveal>
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 01</div>
            <h2 className="v3-h2">Fanlar</h2>
          </div>
          <p className="v3-bosh-izoh">
            Har bir fan o{"'"}z o{"'"}quv va ilmiy daraxtiga ega. Hozircha{" "}
            <strong>{ochiqFanlarSoni()} ta fan ochiq</strong>, qolgani
            tayyorlanmoqda — qulf materiallar yozilgach ochiladi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FANLAR.map((fan, i) => (
            <FanKarta
              key={fan.slug}
              fan={fan}
              raqam={i + 1}
              kengmi={fan.holat === "ochiq"}
            />
          ))}
        </div>
      </section>

      {/* ═══ UMUMIY BO'LIMLAR ═══ */}
      <section className="v3-konteyner pb-16 md:pb-24">
        <div className="v3-bosh" data-reveal>
          <div>
            <div className="v3-nishon mb-2">Bo{"'"}lim 02</div>
            <h2 className="v3-h2">Umumiy bo{"'"}limlar</h2>
          </div>
          <p className="v3-bosh-izoh">
            Bular fanga bog{"'"}liq emas — qaysi fanni o{"'"}rgansangiz ham bir xil
            ishlaydi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BolimKarta
            href={kabinet.href}
            ikon={kabinet.ikon}
            nom={kabinet.nom}
            tavsif={kabinet.tavsif}
            nishon={kabinet.nishon}
            urgulimi
          />

          {rolPanellari.map((p) => (
            <BolimKarta
              key={p.href}
              href={p.href}
              ikon={p.ikon}
              nom={p.label}
              tavsif={
                p.href === "/admin"
                  ? "Foydalanuvchilar, kontent va tizim sozlamalari"
                  : p.href === "/ustoz"
                  ? "Guruhlar, vazifalar, natijalar va talabalar"
                  : "Kanal, lenta va video darsliklaringiz"
              }
              nishon="Sizga ochiq"
              urgulimi
            />
          ))}

          <BolimKarta
            href="/masala"
            ikon="kolba"
            nom="AI Masalalar Yechuvchisi"
            tavsif="3 xil yondashuv: yashirin tuzoqlar, formulalar va to'liq master yechim"
            nishon="Beta"
            urgulimi
          />
          <BolimKarta
            href="/laboratoriya"
            ikon="kolba"
            nom="Virtual laboratoriya"
            tavsif="Reagent yig'ing, jihoz oling va tajriba o'tkazing — 200 dan ortiq reaksiya"
            nishon="3D"
          />
          <BolimKarta
            href="/oquv/video-darsliklar"
            ikon="quiz"
            nom="Testlar"
            tavsif="440+ savol, ustozlar tuzgan testlar, natijalar PDF shaklida. Video darsliklar tayyorlanmoqda"
          />
          <BolimKarta
            href="/ilmiy/maqolalar/muhokama"
            ikon="muhokama"
            nom="Dolzarb mavzular"
            tavsif="Savol bering, tajriba ulashing va boshqalar bilan muhokama qiling"
            nishon="Jonli"
          />
          <BolimKarta
            href="/kanallar"
            ikon="kanal"
            nom="Kanallar"
            tavsif="Ustoz va tashkilotlarning kanallari: postlar, videolar, obuna"
          />
          <BolimKarta
            href="/doska"
            ikon="doska"
            nom="Elektron doska"
            tavsif="Auditoriya uchun: QR orqali kiring va sinfga ko'rsating"
          />
          <BolimKarta
            href="/hamkorlik"
            ikon="hamkor"
            nom="Hamkorlik"
            tavsif="Jamoaga taklif, savol-javob, bog'lanish va yangiliklar"
          />
        </div>
      </section>

      {/* ═══ OYOQ ═══ */}
      <footer className="v3-oyoq">
        <div className="v3-konteyner py-12">
          <div className="v3-oyoq-karta">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <YaratuvchiRasmi />
                <div className="min-w-0">
                  <div className="v3-nishon mb-1.5">Yaratuvchi</div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h4 className="font-bold text-lg">Diyorbek Jabborov</h4>
                    <TasdiqBelgisi tasdiqlangan olcham="katta" jonli />
                  </div>
                  <p className="v3-xira text-sm mt-0.5">
                    Kimyo o{"'"}qituvchisi · platforma asoschisi
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                    <Link href="/profil/343229943" className="v3-oyoq-havola">
                      <Ikon nom="odam" olcham={15} />
                      Profil
                    </Link>
                    <a href="https://t.me/diyorbek_jabborov" target="_blank" rel="noopener noreferrer" className="v3-oyoq-havola">
                      <Ikon nom="telegram" olcham={15} />
                      Telegram
                    </a>
                    <a href="mailto:jabborovd18@gmail.com" className="v3-oyoq-havola">
                      <Ikon nom="pochta" olcham={15} />
                      Email
                    </a>
                    <a href="https://t.me/jdakimyouzbot" target="_blank" rel="noopener noreferrer" className="v3-oyoq-havola">
                      <Ikon nom="bot" olcham={15} />
                      Bot
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                <span className="v3-versiya">
                  <span className="v3-nuqta" />
                  v3.0.0
                </span>
                <Link href="/jda-kimyo" className="v3-oyoq-havola">
                  <Ikon nom="atom" olcham={15} />
                  JDA KIMYO nima?
                </Link>
                <p className="v3-xira text-xs">© 2026 JDA KIMYO</p>
                <p className="v3-xira text-[11px]">Oliy kimyo platformasi</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   Scroll bo'yicha ochilish
   ══════════════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]")
    if (!els.length) return

    const kam = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (kam || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("v3-korindi"))
      return
    }

    const io = new IntersectionObserver(
      (yozuvlar) => {
        yozuvlar.forEach((y) => {
          if (y.isIntersecting) {
            y.target.classList.add("v3-korindi")
            io.unobserve(y.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    els.forEach((el) => io.observe(el))

    // Zaxira: fon tabida (document.hidden) IntersectionObserver umuman
    // ishlamaydi — kontent opacity:0 holida ko'rinmay qolmasligi uchun
    // majburan ochamiz.
    const zaxira = setTimeout(() => {
      els.forEach((el) => el.classList.add("v3-korindi"))
      io.disconnect()
    }, 1500)

    return () => {
      clearTimeout(zaxira)
      io.disconnect()
    }
  }, [])
}

/* ═══════════════════════════════════════════════════════════════════════
   Ko'rinishga kirganda sanab chiqadigan raqam
   ══════════════════════════════════════════════════════════════════════ */
function CountUp({ value, duration = 1200 }) {
  const moslik = /^(\d+)(.*)$/.exec(value)
  const nishon = moslik ? parseInt(moslik[1], 10) : null
  const qoshimcha = moslik ? moslik[2] : ""

  const [ekran, setEkran] = useState(nishon === null ? value : `0${qoshimcha}`)
  const ref = useRef(null)

  useEffect(() => {
    if (nishon === null) return
    const el = ref.current
    if (!el) return

    const kam = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (kam || typeof IntersectionObserver === "undefined") {
      setEkran(`${nishon}${qoshimcha}`)
      return
    }

    let kadr = null
    let ketmoqda = false

    const io = new IntersectionObserver(
      (yozuvlar) => {
        if (!yozuvlar[0].isIntersecting) return
        io.disconnect()
        ketmoqda = true

        const bosh = performance.now()
        const qadam = (hozir) => {
          const p = Math.min((hozir - bosh) / duration, 1)
          const yumshoq = 1 - Math.pow(1 - p, 3)
          setEkran(`${Math.round(nishon * yumshoq)}${qoshimcha}`)
          if (p < 1) kadr = requestAnimationFrame(qadam)
        }
        kadr = requestAnimationFrame(qadam)
      },
      { threshold: 0.4 }
    )

    io.observe(el)

    // Zaxira: fon tabida raqam "0" bo'lib qotib qolmasligi uchun
    const zaxira = setTimeout(() => {
      if (!ketmoqda) {
        io.disconnect()
        setEkran(`${nishon}${qoshimcha}`)
      }
    }, 1500)

    return () => {
      clearTimeout(zaxira)
      io.disconnect()
      if (kadr) cancelAnimationFrame(kadr)
    }
  }, [nishon, qoshimcha, duration])

  return <span ref={ref}>{ekran}</span>
}
