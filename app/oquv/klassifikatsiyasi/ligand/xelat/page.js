"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const XELAT_KOMPLEKSLAR = [
  { formula: "[Cu(en)₂]SO₄", nomi: "Bis(etilendiamin)mis(II) sulfat", ligand: "en (bidentat)", halqa: "2 ta 5 a'zoli halqa", barqarorlik: "Juda yuqori (xelat effekti)" },
  { formula: "[Co(en)₃]Cl₃", nomi: "Tris(etilendiamin)kobalt(III) xlorid", ligand: "en (bidentat)", halqa: "3 ta 5 a'zoli halqa", barqarorlik: "Optik faol chiral kompleks" },
  { formula: "Na₂[Ca(EDTA)]", nomi: "Natriy etilendiamintetraatsetatokaltsiat(II)", ligand: "EDTA⁴⁻ (geksadentat)", halqa: "5 ta tutash halqa", barqarorlik: "Suvning qattiqligini yo'qotish va titrlash" },
  { formula: "[Fe(acac)₃]", nomi: "Tris(atsetilatsetonato)temir(III)", ligand: "acac⁻ (bidentat)", halqa: "3 ta 6 a'zoli halqa", barqarorlik: "To'q qizil, organik erituvchilarda eriydi" },
  { formula: "K₃[Fe(C₂O₄)₃]", nomi: "Kaliy trioksalatoferrat(III)", ligand: "ox²⁻ (bidentat)", halqa: "3 ta 5 a'zoli halqa", barqarorlik: "Yashil kristall, fotokimyoviy sezgir" },
]

export default function XelatKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Xelatlar (Ichki kompleks birikmalar)"
      tavsif="Polidentat ligandlar hosil qiluvchi siklik halqalar, xelat effekti va yuqori termodinamik barqarorlik"
      ikon="🦞"
      nishon="XELAT LIGANDLARI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Xelat komplekslar" }
      ]}
      oldingiMavzu={{ nom: "Nitrit komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/nitrit" }}
      keyingiMavzu={{ nom: "Metallosenlar", havola: "/oquv/klassifikatsiyasi/ligand/metallosen" }}
      quizHavola="/oquv/video-darsliklar/quiz/klassifikatsiyasi"
    >
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Xelat effekti va uning sabablari</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Xelatlar</strong> (grekcha <em>chele</em> — qisqichbaqa changali) — polidentat (ikki yoki undan ortiq donor atomli) ligandlarning bitta markaziy atom atrofida <strong style={{ color: "var(--v3-urgu)" }}>5 yoki 6 a&apos;zoli barqaror halqalar</strong> hosil qilishi natijasida yuzaga keladi. Xelat komplekslari o&apos;ziga o&apos;xshash monodentat komplekslarga qaraganda ancha barqaror bo&apos;lib, bu holat <strong style={{ color: "var(--v3-urgu)" }}>Xelat effekti</strong> (entropiya oshishi) deb ataladi.
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
          Muhim xelat komplekslari
        </h3>

        <InteraktivJadval
          sarlavha="Xelatlovchi birikmalar jadvali"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "22%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "30%" },
            { kalit: "halqa", nom: "Halqa tuzilishi", kenglik: "24%" },
            { kalit: "barqarorlik", nom: "Xususiyati va qo'llanishi", kenglik: "24%" }
          ]}
          qatorlar={XELAT_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}