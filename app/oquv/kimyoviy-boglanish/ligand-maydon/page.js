"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const LIGAND_TURLARI = [
  { turi: "σ-donor (Faqat)", xususiyat: "Faqat metallga elektron jufti beradi, π-ta'sir yo'q", taqsimot: "t₂g orbital bog'lanmagan qoladi", delta: "O'rtacha Δₒ", misollar: "NH₃, CH₃⁻, en" },
  { turi: "π-donor (Kuchsiz maydon)", xususiyat: "To'lgan p-orbitallari orqali metallning t₂g orbitaliga elektron beradi", taqsimot: "t₂g energetik jihatdan yuqoriga suriladi", delta: "Kichik Δₒ (Kuchsiz maydon)", misollar: "I⁻, Br⁻, Cl⁻, F⁻, OH⁻, H₂O" },
  { turi: "π-akseptor (Kuchli maydon)", xususiyat: "Metallning t₂g elektronlarini o'zining bo'sh π*-orbitallariga qabul qiladi (datsiv bog')", taqsimot: "t₂g energetik jihatdan pastga tushadi", delta: "Katta Δₒ (Kuchli maydon)", misollar: "CO, CN⁻, NO⁺, phen, bpy, PPh₃" },
]

export default function LigandMaydon() {
  return (
    <MavzuLayout
      sarlavha="Ligand maydon nazariyasi (LMN)"
      tavsif="Kvant-mexanik molekulyar orbitallar (MO) yondashuvi • σ-donor, π-donor va π-akseptor ligandlar • Sinergetik bog'lanish"
      ikon="🧩"
      nishon="04-NAZARIYA"
      yol={[
        { nom: "Kimyoviy bog'lanish", havola: "/oquv/kimyoviy-boglanish" },
        { nom: "Ligand maydon nazariyasi" }
      ]}
      oldingiMavzu={{ nom: "Yan-Teller effekti", havola: "/oquv/kimyoviy-boglanish/yan-teller" }}
      keyingiMavzu={{ nom: "Izomeriyasi bo'limi", havola: "/oquv/izomeriyasi" }}
      quizHavola="/oquv/video-darsliklar/quiz/kimyoviy-boglanish"
    >
      {/* ═══ 1. LMN VA MO YONDASHUVI ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Ligand maydon nazariyasi mohiyati</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Ligand maydon nazariyasi (LMN)</strong> — Kristall maydon nazariyasi (elektrostatik) va Molekulyar orbitallar nazariyasining (kovalent) sintezidir. Unda metallning 9 ta valent orbitali (5 ta d + 1 ta s + 3 ta p) ligandlarning simmetriya moslashtirilgan guruh orbitallari (SALC) bilan qoplanib, bog&apos;lovchi, bog&apos;lanmagan va antibog&apos;lovchi molekulyar orbitallarni hosil qiladi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3.5 rounded-xl border text-center" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-matn)" }}>Bog&apos;lovchi MO (σ, π)</strong>
            <p className="v3-xira text-[11px] mt-1">Energetik jihatdan past, asosan ligand xarakteriga ega</p>
          </div>
          <div className="p-3.5 rounded-xl border text-center" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-urgu)" }}>Bog&apos;lanmagan MO (t₂g)</strong>
            <p className="v3-xira text-[11px] mt-1">Metall d-elektronlari joylashadigan markaziy soha</p>
          </div>
          <div className="p-3.5 rounded-xl border text-center" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-urgu-2)" }}>Antibog&apos;lovchi MO (e_g*, t₂g*)</strong>
            <p className="v3-xira text-[11px] mt-1">Energetik jihatdan yuqori, metall xarakteriga ega</p>
          </div>
        </div>
      </div>

      {/* ═══ 2. JADVAL ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
          Ligandlarning σ va π bog&apos;lanish turlari
        </h3>

        <InteraktivJadval
          sarlavha="Ligandlarning elektron xususiyatlari"
          ustunlar={[
            { kalit: "turi", nom: "Ligand turi", format: "kod", kenglik: "24%" },
            { kalit: "xususiyat", nom: "Elektron o'zaro ta'siri", kenglik: "30%" },
            { kalit: "delta", nom: "Δₒ qiymatiga ta'siri", kenglik: "22%" },
            { kalit: "misollar", nom: "Misollar", kenglik: "24%" }
          ]}
          qatorlar={LIGAND_TURLARI}
        />
      </div>
    </MavzuLayout>
  )
}