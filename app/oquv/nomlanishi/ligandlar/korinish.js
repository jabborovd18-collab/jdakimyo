"use client"

import { useState } from "react"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const SECTIONS = [
  { id: "anion", label: "Anion ligandlar (5.3)", icon: "🔴" },
  { id: "neytral", label: "Neytral ligandlar", icon: "🔵" },
  { id: "polidentat", label: "Polidentat & Xelatlar", icon: "🦞" },
]

const ANION_LIGANDLAR = [
  { formula: "F⁻", asli: "Ftorid", nomi: "ftorido", donor: "1 (F)" },
  { formula: "Cl⁻", asli: "Xlorid", nomi: "xlorido", donor: "1 (Cl)" },
  { formula: "Br⁻", asli: "Bromid", nomi: "bromido", donor: "1 (Br)" },
  { formula: "I⁻", asli: "Yodid", nomi: "yodido", donor: "1 (I)" },
  { formula: "CN⁻", asli: "Sianid", nomi: "tsianido (sianido)", donor: "1 (C)" },
  { formula: "OH⁻", asli: "Gidroksid", nomi: "gidroksido", donor: "1 (O)" },
  { formula: "O²⁻", asli: "Oksid", nomi: "oksido", donor: "1 (O)" },
  { formula: "CO₃²⁻", asli: "Karbonat", nomi: "karbonato", donor: "1 yoki 2 (O)" },
  { formula: "NO₂⁻", asli: "Nitrit (N-bog'langan)", nomi: "nitrito-κN (nitro)", donor: "1 (N)" },
  { formula: "ONO⁻", asli: "Nitrit (O-bog'langan)", nomi: "nitrito-κO", donor: "1 (O)" },
  { formula: "SCN⁻", asli: "Tiosianat (S-bog'langan)", nomi: "tiosianato-κS", donor: "1 (S)" },
  { formula: "NCS⁻", asli: "Izotiosianat (N-bog'langan)", nomi: "tiosianato-κN", donor: "1 (N)" },
  { formula: "C₂O₄²⁻", asli: "Oksalat (ox)", nomi: "oksalato", donor: "2 (O,O)" },
  { formula: "SO₄²⁻", asli: "Sulfat", nomi: "sulfato", donor: "1 yoki 2 (O)" },
  { formula: "CH₃COO⁻", asli: "Atsetat (AcO⁻)", nomi: "atsetato", donor: "1 (O)" },
]

const NEYTRAL_LIGANDLAR = [
  { formula: "H₂O", asli: "Suv", nomi: "akva", donor: "1 (O)" },
  { formula: "NH₃", asli: "Ammiak", nomi: "ammin", donor: "1 (N)" },
  { formula: "CO", asli: "Uglerod(II) oksidi", nomi: "karbonil", donor: "1 (C)" },
  { formula: "NO", asli: "Azot(II) oksidi", nomi: "nitrozil", donor: "1 (N)" },
  { formula: "en", asli: "Etilendiamin (C₂H₈N₂)", nomi: "etilendiamin (1,2-diaminoetan)", donor: "2 (N,N)" },
  { formula: "py", asli: "Piridin (C₅H₅N)", nomi: "piridin", donor: "1 (N)" },
  { formula: "PPh₃", asli: "Trifenilfosfin", nomi: "trifenilfosfan", donor: "1 (P)" },
]

const POLIDENTAT_LIGANDLAR = [
  { nomi: "Etilendiamin", qisqartma: "en", donor: 2, turi: "Bidentat", izoh: "5 a'zoli barqaror xelat halqa hosil qiladi" },
  { nomi: "Oksalat ioni", qisqartma: "ox (C₂O₄²⁻)", donor: 2, turi: "Bidentat", izoh: "Ikkita kislorod atomi orqali koordinatsiyalanadi" },
  { nomi: "2,2'-Bipiridin", qisqartma: "bpy", donor: 2, turi: "Bidentat", izoh: "Ikkita piridin halqasidagi azotlar orqali" },
  { nomi: "1,10-Fenantrolin", qisqartma: "phen", donor: 2, turi: "Bidentat", izoh: "Qattiq planar aromatik ligand" },
  { nomi: "Dietilentriamin", qisqartma: "dien", donor: 3, turi: "Tridentat", izoh: "Uchta amin guruhi orqali bog'lanadi" },
  { nomi: "EDTA⁴⁻", qisqartma: "edta", donor: 6, turi: "Geksadentat", izoh: "Metall ionini to'liq o'rab oluvchi kuchli xelatlovchi" },
]

export default function LigandlarNomi() {
  const [faolBolim, setFaolBolim] = useState("anion")

  return (
    <MavzuLayout
      sarlavha="Ligandlar nomlanishi"
      tavsif="Anorganik kompleks birikmalardagi anion, neytral va xelatlovchi polidentat ligandlarning 5.3-jadvali"
      ikon="🧩"
      nishon="04-MAVZU"
      yol={[
        { nom: "Nomlanishi", havola: "/oquv/nomlanishi" },
        { nom: "Ligandlar" }
      ]}
      bolimlar={SECTIONS}
      faolBolim={faolBolim}
      onBolimTanla={setFaolBolim}
      oldingiMavzu={{ nom: "IUPAC qoidalari", havola: "/oquv/nomlanishi/iupac" }}
      keyingiMavzu={{ nom: "Anion komplekslar", havola: "/oquv/nomlanishi/anion" }}
      quizHavola="/oquv/video-darsliklar/quiz/nomlanishi"
    >
      {/* ═══ 1. ANION LIGANDLAR ═══ */}
      {faolBolim === "anion" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🔴</span>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--v3-matn)" }}>
                Anion ligandlar (Manfiy zaryadli)
              </h2>
            </div>
            <p className="v3-xira text-xs sm:text-sm leading-relaxed">
              Barcha anion ligandlarning kompleksdagi nomiga <strong style={{ color: "var(--v3-urgu)" }}>&quot;-o&quot; qo&apos;shimchasi</strong> qo&apos;shiladi (xlorid → xlorido, sianid → tsianido, gidroksid → gidroksido).
            </p>

            <InteraktivJadval
              sarlavha="5.3-jadval: Anion ligandlar ro'yxati"
              ustunlar={[
                { kalit: "formula", nom: "Formula", format: "formula", kenglik: "18%" },
                { kalit: "asli", nom: "Oddiy ion nomi", kenglik: "28%" },
                { kalit: "nomi", nom: "Kompleksdagi nomi (IUPAC)", format: "kod", kenglik: "32%" },
                { kalit: "donor", nom: "Dentatligi va donor atom", kenglik: "22%" }
              ]}
              qatorlar={ANION_LIGANDLAR}
            />
          </div>
        </div>
      )}

      {/* ═══ 2. NEYTRAL LIGANDLAR ═══ */}
      {faolBolim === "neytral" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🔵</span>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--v3-matn)" }}>
                Neytral ligandlar (Maxsus va organik molekulalar)
              </h2>
            </div>
            <p className="v3-xira text-xs sm:text-sm leading-relaxed">
              4 ta eng keng tarqalgan neytral ligand (<strong style={{ color: "var(--v3-urgu)" }}>H₂O, NH₃, CO, NO</strong>) maxsus nomga ega. Qolgan barcha neytral organik molekulalar o&apos;z asl molekulyar nomi bilan o&apos;zgarishsiz ataladi.
            </p>

            <InteraktivJadval
              sarlavha="Neytral ligandlar ro'yxati"
              ustunlar={[
                { kalit: "formula", nom: "Formula", format: "formula", kenglik: "18%" },
                { kalit: "asli", nom: "Molekula nomi", kenglik: "30%" },
                { kalit: "nomi", nom: "Kompleksdagi nomi", format: "kod", kenglik: "30%" },
                { kalit: "donor", nom: "Donor markazi", kenglik: "22%" }
              ]}
              qatorlar={NEYTRAL_LIGANDLAR}
            />
          </div>
        </div>
      )}

      {/* ═══ 3. POLIDENTAT VA XELATLAR ═══ */}
      {faolBolim === "polidentat" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🦞</span>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--v3-matn)" }}>
                Polidentat (Xelatlovchi) ligandlar
              </h2>
            </div>
            <p className="v3-xira text-xs sm:text-sm leading-relaxed">
              Polidentat ligandlar bir nechta donor atomi orqali markaziy metall atrofida 5 yoki 6 a&apos;zoli barqaror halqalar hosil qiladi (<strong style={{ color: "var(--v3-urgu)" }}>Xelat effekti</strong>). Ularning soni uchun <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--v3-yuza-2)" }}>bis-</code>, <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--v3-yuza-2)" }}>tris-</code>, <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--v3-yuza-2)" }}>tetrakis-</code> prefikslari qo&apos;llanadi.
            </p>

            <InteraktivJadval
              sarlavha="Polidentat xelat agentlari"
              ustunlar={[
                { kalit: "nomi", nom: "Ligand nomi", kenglik: "25%" },
                { kalit: "qisqartma", nom: "Qisqartma", format: "kod", kenglik: "18%" },
                { kalit: "turi", nom: "Dentatligi", kenglik: "18%" },
                { kalit: "izoh", nom: "Tavsifi", kenglik: "39%" }
              ]}
              qatorlar={POLIDENTAT_LIGANDLAR}
            />
          </div>
        </div>
      )}
    </MavzuLayout>
  )
}
