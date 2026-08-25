"use client"

import { useState } from "react"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const SECTIONS = [
  { id: "kirish", label: "Kirish", icon: "📋" },
  { id: "muammo", label: "Tarixiy muammo", icon: "🔍" },
  { id: "kashfiyot", label: "Verner kashfiyoti", icon: "💡" },
  { id: "valentlik", label: "Ikki valentlik", icon: "⚛️" },
  { id: "ichki-tashqi", label: "Ichki va tashqi sfera", icon: "🔲" },
  { id: "geometriya", label: "Oktaedrik geometriya", icon: "💎" },
  { id: "meros", label: "Nobel va meros", icon: "🏆" },
]

const KOBALT_KOMPLEKSLARI = [
  {
    formula: "[Co(NH₃)₆]Cl₃",
    nomi: "Luteo-kobalt",
    rangi: "Zarg'aldoq-sariq",
    rangHex: "#f59e0b",
    agcl: "3 mol",
    izoh: "Barcha 3 ta Cl⁻ tashqi sferada — suvda eriydi va Ag⁺ bilan darhol to'liq cho'kadi",
    ichki: "[Co(NH₃)₆]³⁺",
    tashqi: "3Cl⁻",
    rangSabab: "6 ta NH₃ kuchli maydon ligandi → Δₒ katta → ko'k nur yutiladi → sariq ko'rinadi"
  },
  {
    formula: "[Co(NH₃)₅Cl]Cl₂",
    nomi: "Purpureo-kobalt",
    rangi: "Pushti-binafsha",
    rangHex: "#ec4899",
    agcl: "2 mol",
    izoh: "1 ta Cl⁻ ichki sferada (Co ga mustahkam koordinatsiyalangan), 2 ta Cl⁻ tashqarida",
    ichki: "[Co(NH₃)₅Cl]²⁺",
    tashqi: "2Cl⁻",
    rangSabab: "1 ta Cl⁻ maydonni biroz kuchsizlantiradi → Δₒ kichiklashadi → pushti-binafsha"
  },
  {
    formula: "[Co(NH₃)₄Cl₂]Cl",
    nomi: "Praseo-kobalt",
    rangi: "Yashil",
    rangHex: "#10b981",
    agcl: "1 mol",
    izoh: "2 ta Cl⁻ ichki sferada, faqat 1 ta Cl⁻ tashqarida erkin ion holatida",
    ichki: "[Co(NH₃)₄Cl₂]⁺",
    tashqi: "Cl⁻",
    rangSabab: "2 ta Cl⁻ ligand → Δₒ yanada kamayadi → yashil nur qaytariladi"
  },
  {
    formula: "[Co(NH₃)₃Cl₃]",
    nomi: "Neytral kompleks",
    rangi: "Yashil-kulrang",
    rangHex: "#6b7280",
    agcl: "0 mol",
    izoh: "3 ta Cl⁻ ham ichki sferada — tashqi sferada Cl⁻ yo'q, AgNO₃ bilan AgCl cho'kmasi bermaydi",
    ichki: "[Co(NH₃)₃Cl₃]",
    tashqi: "yo'q",
    rangSabab: "3 ta Cl⁻ ligand → Δₒ eng kichik qiymatda"
  }
]

export default function VernerNazariyasi() {
  const [faolBolim, setFaolBolim] = useState("kirish")
  const [showHistory, setShowHistory] = useState(false)
  const [selectedComplex, setSelectedComplex] = useState(0)

  return (
    <MavzuLayout
      sarlavha="Verner nazariyasi"
      tavsif="Alfred Verner (1866–1919) • Koordinatsion birikmalar asoslari • Asosiy va qo'shimcha valentlik • Nobel 1913"
      ikon="🏛️"
      nishon="01-MAVZU"
      yol={[
        { nom: "Nomlanishi", havola: "/oquv/nomlanishi" },
        { nom: "Verner nazariyasi" }
      ]}
      bolimlar={SECTIONS}
      faolBolim={faolBolim}
      onBolimTanla={setFaolBolim}
      keyingiMavzu={{ nom: "Formula yozish", havola: "/oquv/nomlanishi/formula" }}
      quizHavola="/oquv/video-darsliklar/quiz/nomlanishi"
    >
      {/* ═══ 1. KIRISH ═══ */}
      {faolBolim === "kirish" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
              <span>📋</span>
              <span>Kompleks birikmalar haqida tushuncha</span>
            </h2>

            <div
              className="rounded-2xl p-5 border mb-6"
              style={{
                background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
                borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
              }}
            >
              <h3 className="font-bold mb-2 text-sm sm:text-base" style={{ color: "var(--v3-urgu)" }}>
                💡 Nima uchun &quot;kompleks&quot; deb ataladi?
              </h3>
              <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-3">
                <strong style={{ color: "var(--v3-matn)" }}>Koordinatsion (kompleks) birikmalar</strong> — tarkibida markaziy metall atomi (yoki ioni) bilan koordinatsion bog&apos;langan ligandlar tutgan murakkab tuzilishga ega moddalardir.
              </p>
              <div
                className="rounded-xl p-3.5 border text-xs sm:text-sm font-medium"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <strong style={{ color: "var(--v3-urgu)" }}>Oddiy misol:</strong> CoCl₃ oddiy tuz. Lekin CoCl₃ + 6NH₃ qo&apos;shilganda hosil bo&apos;ladigan{" "}
                <KimyoFormula formula="[Co(NH₃)₆]Cl₃" ajratilgan={true} olcham="kichik" /> — bu endi oddiy tuz emas, balki barqaror <strong style={{ color: "var(--v3-urgu)" }}>kompleks birikma</strong>!
              </div>
            </div>

            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "var(--v3-yuza-2)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <h3 className="font-bold text-sm sm:text-base mb-2" style={{ color: "var(--v3-matn)" }}>
                📜 Tarixiy kontekst
              </h3>
              <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-4">
                Dastlabki kompleks birikmalar XVIII asr boshlarida ma&apos;lum bo&apos;lsa-da, ularning tabiati va tuzilishi uzoq vaqt sir bo&apos;lib qoldi. <strong style={{ color: "var(--v3-matn)" }}>1893-yili</strong> 27 yoshli shveytsariyalik kimyogar <strong style={{ color: "var(--v3-urgu)" }}>Alfred Verner</strong> kobalt(III) ammiakatlari ustidagi tajribalarga tayanib, yangi koordinatsion nazariyani e&apos;lon qildi.
              </p>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all hover:scale-105"
                style={{
                  background: "var(--v3-urgu)",
                  color: "var(--v3-urgu-matn)",
                  borderColor: "var(--v3-urgu)"
                }}
              >
                {showHistory ? "▲ Alfred Verner haqida (yashirish)" : "▶ Alfred Verner kim edi? (batafsil)"}
              </button>

              {showHistory && (
                <div
                  className="mt-4 rounded-xl p-4 border text-xs sm:text-sm space-y-2.5 leading-relaxed animate-fade-in"
                  style={{
                    background: "color-mix(in srgb, var(--v3-fon) 60%, var(--v3-yuza))",
                    borderColor: "var(--v3-chiziq)"
                  }}
                >
                  <p>
                    <strong style={{ color: "var(--v3-urgu)" }}>Alfred Verner (1866–1919)</strong> — koordinatsion kimyoning asoschisi. O&apos;sha paytdagi klassik valentlik qonunlari CoCl₃ · 6NH₃ kabi birikmalarni tushuntira olmas edi, chunki kobaltning valentligi 3 ga teng bo&apos;lsa, u qanday qilib qo&apos;shimcha 6 ta neytral ammiak molekulasini ushlab turishi noma&apos;lum edi.
                  </p>
                  <p>
                    Verner fanga <strong style={{ color: "var(--v3-matn)" }}>asosiy (birlamchi)</strong> va <strong style={{ color: "var(--v3-matn)" }}>qo&apos;shimcha (ikkilamchi)</strong> valentlik tushunchalarini kiritib, noorganik kimyoda stereokimyo (fazoviy geometriya) poydevorini qurdi.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ 2. TARIXIY MUAMMO ═══ */}
      {faolBolim === "muammo" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
              <span>🔍</span>
              <span>Tarixiy muammo: Jørgensen va Kobalt ammiakatlari</span>
            </h2>

            <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-6">
              Daniyalik mashhur kimyogar Sophus Jørgensen kobalt(III) xloridining ammiakli birikmalarini sintez qilganda quyidagi 4 ta birikmani olgan. Bir xil elementlardan tashkil topgan bo&apos;lsa-da, ularning ranglari va reaksiyaga kirishishi butunlay boshqacha edi:
            </p>

            {/* Kobalt komplekslari interaktiv kartasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {KOBALT_KOMPLEKSLARI.map((k, i) => {
                const faol = selectedComplex === i
                return (
                  <button
                    key={k.formula}
                    onClick={() => setSelectedComplex(i)}
                    className="rounded-2xl p-4 border text-left transition-all hover:scale-[1.02]"
                    style={{
                      background: faol
                        ? "color-mix(in srgb, var(--v3-urgu) 12%, var(--v3-yuza))"
                        : "var(--v3-yuza-2)",
                      borderColor: faol ? "var(--v3-urgu)" : "var(--v3-chiziq)"
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-xs"
                        style={{ background: k.rangHex }}
                      />
                      <span className="text-[11px] font-bold" style={{ color: "var(--v3-urgu)" }}>
                        {k.agcl} cho&apos;kma
                      </span>
                    </div>
                    <div className="font-mono text-sm font-semibold mb-1" style={{ color: "var(--v3-matn)" }}>
                      {k.formula}
                    </div>
                    <div className="v3-xira text-xs">{k.nomi}</div>
                  </button>
                )
              })}
            </div>

            {/* Tanlangan kompleks tafsilotlari */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "var(--v3-yuza-2)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ background: KOBALT_KOMPLEKSLARI[selectedComplex].rangHex }}
                />
                <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--v3-matn)" }}>
                  {KOBALT_KOMPLEKSLARI[selectedComplex].nomi} ({KOBALT_KOMPLEKSLARI[selectedComplex].rangi})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div className="p-3 rounded-xl border" style={{ borderColor: "var(--v3-chiziq)", background: "var(--v3-yuza)" }}>
                  <div className="v3-xira text-[11px] mb-1">Ichki koordinatsion sfera:</div>
                  <KimyoFormula formula={KOBALT_KOMPLEKSLARI[selectedComplex].ichki} olcham="kichik" />
                </div>
                <div className="p-3 rounded-xl border" style={{ borderColor: "var(--v3-chiziq)", background: "var(--v3-yuza)" }}>
                  <div className="v3-xira text-[11px] mb-1">Tashqi sfera (ionli):</div>
                  <KimyoFormula formula={KOBALT_KOMPLEKSLARI[selectedComplex].tashqi} olcham="kichik" />
                </div>
                <div className="p-3 rounded-xl border" style={{ borderColor: "var(--v3-chiziq)", background: "var(--v3-yuza)" }}>
                  <div className="v3-xira text-[11px] mb-1">AgNO₃ bilan reaksiya:</div>
                  <strong style={{ color: "var(--v3-urgu)" }}>{KOBALT_KOMPLEKSLARI[selectedComplex].agcl} AgCl↓</strong>
                </div>
              </div>

              <p className="v3-xira text-xs leading-relaxed">
                <strong>Izoh:</strong> {KOBALT_KOMPLEKSLARI[selectedComplex].izoh}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 3. KASHFIYOT ═══ */}
      {faolBolim === "kashfiyot" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
              <span>💡</span>
              <span>Verner kashfiyoti: Ichki va tashqi sfera</span>
            </h2>

            <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-6">
              Verner AgNO₃ tajribalari natijasini tahlil qilib, kompleks birikmada ligandlar va ionlar metall atrofida ikki xil fazoda joylashishini isbotladi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
                  borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
                }}
              >
                <h3 className="font-bold text-sm sm:text-base mb-2 flex items-center gap-2" style={{ color: "var(--v3-urgu)" }}>
                  <span>🔲</span>
                  <span>Ichki sfera — [ Markaziy atom + Ligandlar ]</span>
                </h3>
                <p className="v3-xira text-xs leading-relaxed">
                  Markaziy metall kationiga kovalent yoki donor-akseptor bog&apos;lar orqali mustahkam birikkan qism. Suvda eriganda ionlarga ajralmaydi (dissotsilanmaydi). Formulada kvadrat qavs <strong style={{ color: "var(--v3-matn)" }}>[ ]</strong> ichida yoziladi.
                </p>
              </div>

              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <h3 className="font-bold text-sm sm:text-base mb-2 flex items-center gap-2" style={{ color: "var(--v3-urgu-2)" }}>
                  <span>🔓</span>
                  <span>Tashqi sfera — Ionli bog&apos;langan zaryadlar</span>
                </h3>
                <p className="v3-xira text-xs leading-relaxed">
                  Ichki kompleks ionning zaryadini neytrallovchi qarama-qarshi ishorali ionlar. Ular metall bilan elektrostatik (ion) bog&apos;lanadi, suvda to&apos;liq dissotsilanadi va cho&apos;ktirish reaksiyalariga darhol kirishadi.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl p-5 border text-center"
              style={{
                background: "var(--v3-yuza-2)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div className="text-xs v3-xira mb-2">Namuna tahlili:</div>
              <div className="mb-3">
                <KimyoFormula formula="[Co(NH₃)₆]Cl₃" ajratilgan={true} olcham="katta" />
              </div>
              <div className="flex items-center justify-center gap-6 text-xs v3-xira flex-wrap">
                <div>
                  <span className="font-semibold" style={{ color: "var(--v3-urgu)" }}>[Co(NH₃)₆]³⁺</span> — Ichki kation sfera
                </div>
                <div>
                  <span className="font-semibold" style={{ color: "var(--v3-urgu-2)" }}>3Cl⁻</span> — Tashqi anion sfera
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 4. IKKI VALENTLIK ═══ */}
      {faolBolim === "valentlik" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
              <span>⚛️</span>
              <span>Asosiy va qo&apos;shimcha valentlik</span>
            </h2>

            <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-6">
              Verner nazariyasining eng buyuk yangiligi — metall atomi birikmalarda bir vaqtning o&apos;zida ikki xil valentlik namoyon qilishi mumkinligini isbotlaganidir:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className="rounded-2xl p-5 border space-y-2.5"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--v3-urgu)", color: "var(--v3-urgu-matn)" }}
                  >
                    1
                  </span>
                  <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--v3-matn)" }}>
                    Asosiy (Birlamchi) valentlik
                  </h3>
                </div>
                <p className="v3-xira text-xs leading-relaxed">
                  Markaziy metallning <strong style={{ color: "var(--v3-matn)" }}>oksidlanish darajasi</strong>ga mos keladi. Faqat manfiy ionlar (anionlar) bilan to&apos;yinadi. Ionli bog&apos; hosil qiladi va yo&apos;nalishga ega emas (fazoda burchak hosil qilmaydi).
                </p>
                <div className="text-xs p-2.5 rounded-lg border font-mono" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
                  Co³⁺ ning asosiy valentligi = 3 (3 ta Cl⁻ anioniga teng)
                </div>
              </div>

              <div
                className="rounded-2xl p-5 border space-y-2.5"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--v3-urgu)", color: "var(--v3-urgu-matn)" }}
                  >
                    2
                  </span>
                  <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--v3-matn)" }}>
                    Qo&apos;shimcha (Ikkilamchi) valentlik
                  </h3>
                </div>
                <p className="v3-xira text-xs leading-relaxed">
                  Markaziy metallning <strong style={{ color: "var(--v3-urgu)" }}>koordinatsion soni (KS)</strong>ga mos keladi. Neytral molekulalar (NH₃, H₂O) yoki anionlar (Cl⁻, CN⁻) bilan to&apos;yinadi. Fazoda aniq yo&apos;nalishga (geometriyaga) ega.
                </p>
                <div className="text-xs p-2.5 rounded-lg border font-mono" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
                  Co³⁺ ning qo&apos;shimcha valentligi = 6 (KS = 6 ta ligand)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 5. ICHKI/TASHQI SFERA YOZILISHI ═══ */}
      {faolBolim === "ichki-tashqi" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
              <span>🔲</span>
              <span>Ichki va tashqi sferaning yozilish qoidalari</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <h3 className="font-bold mb-2" style={{ color: "var(--v3-urgu)" }}>
                  1. Kation komplekslar:
                </h3>
                <p className="v3-xira mb-2">
                  Kompleks ion musbat zaryadli bo&apos;lsa, u oldinda kvadrat qavsda yoziladi, tashqi sferadagi anion esa orqada turadi:
                </p>
                <div className="p-3 rounded-xl border font-mono text-center" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
                  <KimyoFormula formula="[Co(NH₃)₆]Cl₃" ajratilgan={true} /> → <span style={{ color: "var(--v3-urgu)" }}>[Co(NH₃)₆]³⁺</span> + <span style={{ color: "var(--v3-urgu-2)" }}>3Cl⁻</span>
                </div>
              </div>

              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <h3 className="font-bold mb-2" style={{ color: "var(--v3-urgu)" }}>
                  2. Anion komplekslar:
                </h3>
                <p className="v3-xira mb-2">
                  Kompleks ion manfiy zaryadli bo&apos;lsa, tashqi sferadagi ishqoriy metallar (kationlar) oldinda, kompleks ion esa orqada kvadrat qavsda yoziladi:
                </p>
                <div className="p-3 rounded-xl border font-mono text-center" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
                  <KimyoFormula formula="K₄[Fe(CN)₆]" ajratilgan={true} /> → <span style={{ color: "var(--v3-urgu-2)" }}>4K⁺</span> + <span style={{ color: "var(--v3-urgu)" }}>[Fe(CN)₆]⁴⁻</span>
                </div>
              </div>

              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <h3 className="font-bold mb-2" style={{ color: "var(--v3-urgu)" }}>
                  3. Neytral komplekslar:
                </h3>
                <p className="v3-xira mb-2">
                  Kompleksning umumiy zaryadi nolga teng bo&apos;lsa, tashqi sfera bo&apos;lmaydi va butun birikma bitta kvadrat qavs ichida yoziladi:
                </p>
                <div className="p-3 rounded-xl border font-mono text-center" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
                  <KimyoFormula formula="[Pt(NH₃)₂Cl₂]" /> (suvda ionlarga ajralmaydi)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 6. OKTAEDRIK GEOMETRIYA ═══ */}
      {faolBolim === "geometriya" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
              <span>💎</span>
              <span>Geometriya: Nima uchun Oktaedr?</span>
            </h2>

            <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-6">
              Verner qo&apos;shimcha valentlik fazoda aniq yo&apos;nalishga ega ekanini bashorat qildi. 6 ta ligand markaziy atom atrofida o&apos;zaro minimal itarilish holatida bo&apos;lishi uchun <strong style={{ color: "var(--v3-urgu)" }}>muntazam oktaedr</strong> uchlariga yo&apos;naladi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs sm:text-sm">
              <div
                className="rounded-2xl p-5 border space-y-2"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <h3 className="font-bold text-sm" style={{ color: "var(--v3-urgu)" }}>
                  Oktaedr xususiyatlari:
                </h3>
                <ul className="space-y-1.5 v3-xira">
                  <li>• 6 ta cho&apos;qqi (6 ta ligand o&apos;rni);</li>
                  <li>• Markaziy atom oktaedr markazida joylashadi;</li>
                  <li>• Ekvatorial ligandlar burchagi: <strong>90°</strong>;</li>
                  <li>• Aksial ligandlar burchagi: <strong>180°</strong>.</li>
                </ul>
              </div>

              <div
                className="rounded-2xl p-5 border space-y-2"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <h3 className="font-bold text-sm" style={{ color: "var(--v3-matn)" }}>
                  Stereoizomeriyani tushuntirishi:
                </h3>
                <p className="v3-xira leading-relaxed">
                  Aynan oktaedrik model orqali Verner <strong style={{ color: "var(--v3-matn)" }}>cis-</strong> va <strong style={{ color: "var(--v3-matn)" }}>trans-</strong> [Co(NH₃)₄Cl₂]⁺ izomerlarining mavjudligini va optik faollikni to&apos;liq tushuntirib berdi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 7. NOBEL VA MEROS ═══ */}
      {faolBolim === "meros" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
              <span>🏆</span>
              <span>Alfred Verner merosi va Nobel mukofoti</span>
            </h2>

            <div
              className="rounded-2xl p-5 border mb-6"
              style={{
                background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
                borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
              }}
            >
              <h3 className="font-bold text-base mb-2" style={{ color: "var(--v3-urgu)" }}>
                🥇 1913-yilgi Kimyo bo&apos;yicha Nobel mukofoti
              </h3>
              <p className="v3-xira text-xs sm:text-sm leading-relaxed">
                1913-yilda Alfred Vernerga <strong style={{ color: "var(--v3-matn)" }}>&quot;Molekulalardagi atomlarning bog&apos;lanishini o&apos;rganish orqali noorganik kimyoda yangi sohalarni ochgani uchun&quot;</strong> Nobel mukofoti berildi. Bu noorganik kimyo sohasidagi ilk Nobel mukofotlaridan biri bo&apos;ldi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="font-bold text-sm mb-1" style={{ color: "var(--v3-matn)" }}>1. Koordinatsion son</div>
                <div className="v3-xira">Fanga metallarning KS tushunchasi kiritildi.</div>
              </div>
              <div className="p-4 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="font-bold text-sm mb-1" style={{ color: "var(--v3-matn)" }}>2. Stereokimyo</div>
                <div className="v3-xira">Noorganik birikmalarning fazoviy shakllari isbotlandi.</div>
              </div>
              <div className="p-4 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="font-bold text-sm mb-1" style={{ color: "var(--v3-matn)" }}>3. Zamonaviy kimyo</div>
                <div className="v3-xira">Kataliz, bioanorganik va materialshunoslik poydevori bo&apos;ldi.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MavzuLayout>
  )
}