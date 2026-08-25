"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const SPEKTROKIMYOVIY_QATOR = [
  { ligand: "I⁻ < Br⁻ < S²⁻ < SCN⁻ < Cl⁻ < NO₃⁻ < F⁻", maydon: "Kuchsiz maydon", spin: "Yuqori spin (High-spin)", delta: "Kichik Δ (Δ < P)", rang: "Kuchsiz ajralish" },
  { ligand: "OH⁻ < C₂O₄²⁻ < H₂O", maydon: "O'rtacha maydon", spin: "Oraliq holat", delta: "O'rtacha Δ", rang: "Rangli eritmalar" },
  { ligand: "NCS⁻ < CH₃CN < py < NH₃ < en", maydon: "Kuchli maydon", spin: "Quyi spin (Low-spin)", delta: "Katta Δ (Δ > P)", rang: "Qisqa to'lqin yutilishi" },
  { ligand: "bpy < phen < NO₂⁻ < PPh₃ < CN⁻ < CO", maydon: "Eng kuchli maydon (π-akseptor)", spin: "To'liq quyi spin / Diamagnit", delta: "Maksimal Δ", rang: "Juda kuchli ajralish" },
]

export default function KristallMaydon() {
  return (
    <MavzuLayout
      sarlavha="Kristall maydon nazariyasi (KMN)"
      tavsif="Hans Bethe elektrostatik modeli • d-orbitallarning t₂g va eg sathi bo'yicha ajralishi • Δo va Δt • KMBE hisobi"
      ikon="💎"
      nishon="02-NAZARIYA"
      yol={[
        { nom: "Kimyoviy bog'lanish", havola: "/oquv/kimyoviy-boglanish" },
        { nom: "Kristall maydon nazariyasi" }
      ]}
      oldingiMavzu={{ nom: "VB nazariyasi", havola: "/oquv/kimyoviy-boglanish/vb-nazariyasi" }}
      keyingiMavzu={{ nom: "Yan-Teller effekti", havola: "/oquv/kimyoviy-boglanish/yan-teller" }}
      quizHavola="/oquv/video-darsliklar/quiz/kimyoviy-boglanish"
    >
      {/* ═══ 1. KIRISH VA MOHIYAT ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Kristall maydon nazariyasi mohiyati</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Kristall maydon nazariyasi (KMN)</strong> (1929, Hans Bethe) — metall-ligand bog&apos;lanishini sof <strong style={{ color: "var(--v3-urgu)" }}>elektrostatik o&apos;zaro ta&apos;sir</strong> deb qaraydi. Ligandlar manfiy nuqtaviy zaryadlar sifatida markaziy metall ioni d-orbitallarini fazoda notekis itaradi, natijada 5 ta degenerat d-orbital turli energetik sathlarga ajraladi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
          <div className="p-4 rounded-xl border space-y-1.5" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-urgu)" }}>Oktaedrik maydon (Oh):</strong>
            <p className="v3-xira text-xs leading-relaxed">
              Ligandlar o&apos;qlar bo&apos;ylab keladi. Natijada <code className="font-mono text-xs">d_z²</code> va <code className="font-mono text-xs">d_x²-y²</code> (e_g sathi) <strong>+0.6Δₒ</strong> ga ko&apos;tariladi, <code className="font-mono text-xs">d_xy, d_xz, d_yz</code> (t₂g sathi) esa <strong>-0.4Δₒ</strong> ga pasayadi.
            </p>
          </div>
          <div className="p-4 rounded-xl border space-y-1.5" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-urgu-2)" }}>Tetraedrik maydon (Td):</strong>
            <p className="v3-xira text-xs leading-relaxed">
              Ligandlar burchaklar oralig&apos;idan keladi. Oktaedrga teskari ajralish: <code className="font-mono text-xs">t₂</code> yuqoriga (+0.4Δₜ), <code className="font-mono text-xs">e</code> pastga (-0.6Δₜ) tushadi. <br/>
              <strong>Δₜ ≈ 4/9 Δₒ</strong> (barcha tetraedrlar yuqori spinli bo&apos;ladi).
            </p>
          </div>
        </div>
      </div>

      {/* ═══ 2. SPEKTROKIMYOVIY QATOR ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
          Spektrokimyoviy qator va maydon kuchi
        </h3>

        <InteraktivJadval
          sarlavha="Ligandlarning maydon kuchi bo'yicha tartibi"
          ustunlar={[
            { kalit: "ligand", nom: "Ligandlar ketma-ketligi", format: "kod", kenglik: "38%" },
            { kalit: "maydon", nom: "Maydon kuchi", kenglik: "22%" },
            { kalit: "spin", nom: "Spin holati", kenglik: "22%" },
            { kalit: "delta", nom: "Δ va P nisbati", kenglik: "18%" }
          ]}
          qatorlar={SPEKTROKIMYOVIY_QATOR}
        />
      </div>
    </MavzuLayout>
  )
}