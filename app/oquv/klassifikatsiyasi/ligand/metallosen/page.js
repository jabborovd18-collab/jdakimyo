"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const METALLOSEN_KOMPLEKSLAR = [
  { formula: "Fe(C₅H₅)₂", nomi: "Bis(η⁵-siklopentadienil)temir(II) (Ferrosen)", rang: "To'q to'q sariq (apelsin rang)", xossasi: "Eng barqaror 18-elektronli sendvich birikma (kashfiyot 1951 yil)" },
  { formula: "Co(C₅H₅)₂", nomi: "Bis(η⁵-siklopentadienil)kobalt(II) (Kobaltotsen)", rang: "Qora-binafsha kristall", xossasi: "19-elektronli, kuchli bir elektronli qaytaruvchi" },
  { formula: "Ni(C₅H₅)₂", nomi: "Bis(η⁵-siklopentadienil)nikel(II) (Nikelotsen)", rang: "To'q yashil kristall", xossasi: "20-elektronli, paramagnit" },
  { formula: "Cr(C₆H₆)₂", nomi: "Bis(η⁶-benzol)xrom(0)", rang: "To'q jigarrang", xossasi: "Benzolli sendvich birikma" },
  { formula: "U(C₈H₈)₂", nomi: "Bis(η⁸-siklooktatetraenil)uran(IV) (Uranotsen)", rang: "Yashil kristall", xossasi: "Aktinoidlarning f-orbital ishtirokidagi sendvich birikmasi" },
]

export default function MetallosenKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Metallosenlar (Sendvich birikmalar)"
      tavsif="Aromatik organik halqalar (siklopentadienil, benzol) orasida joylashgan metall atomining π-komplekslari"
      ikon="🥪"
      nishon="METALLOSENLAR"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Metallosenlar" }
      ]}
      oldingiMavzu={{ nom: "Xelat komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/xelat" }}
      keyingiMavzu={{ nom: "Aralash ligandli", havola: "/oquv/klassifikatsiyasi/ligand/aralash" }}
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
          <span>Metallosenlarning &quot;Sendvich&quot; tuzilishi</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Metallosenlar</strong> — markaziy o&apos;tish metall atomi ikkita parallel tekislikda joylashgan siklopentadienil (<code className="font-mono text-xs px-1 rounded" style={{ background: "var(--v3-yuza-2)" }}>C₅H₅⁻, Cp</code>) halqalari orasida siqilgan &quot;sendvich&quot; shaklidagi organometall birikmalardir. Galogenlar va havo kislorodiga nisbatan kutilmagan darajada barqaror bo&apos;lib, Ernst Otto Fischer va Geoffrey Wilkinson ushbu kashfiyot uchun 1973-yilda Nobel mukofotiga sazovor bo&apos;lganlar.
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
          Klassik metallosenlar oilasi
        </h3>

        <InteraktivJadval
          sarlavha="Metallosen birikmalari jadvali"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "20%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "32%" },
            { kalit: "rang", nom: "Rangi", kenglik: "20%" },
            { kalit: "xossasi", nom: "Xususiyati", kenglik: "28%" }
          ]}
          qatorlar={METALLOSEN_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}