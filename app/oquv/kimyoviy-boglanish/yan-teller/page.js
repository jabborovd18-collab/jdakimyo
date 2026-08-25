"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const YAN_TELLER_KONFIGURATSIYALAR = [
  { d: "d¹ (t₂g¹ e_g⁰)", kuch: "Kuchsiz", sabab: "t₂g orbitallarda notekis taqsimot (ligandlar orasiga qaragan)", misol: "[Ti(H₂O)₆]³⁺" },
  { d: "d² (t₂g² e_g⁰)", kuch: "Kuchsiz", sabab: "t₂g orbitallarda notekis taqsimot", misol: "[V(H₂O)₆]³⁺" },
  { d: "d³ (t₂g³ e_g⁰)", kuch: "Kuzatilmaydi", sabab: "t₂g to'liq yarim to'lgan (simmetrik)", misol: "[Cr(H₂O)₆]³⁺" },
  { d: "d⁴ YS (t₂g³ e_g¹)", kuch: "Juda kuchli", sabab: "e_g orbitallar (ligandlarga to'g'ri qaragan) notekis to'lgan", misol: "[Cr(H₂O)₆]²⁺, [Mn(H₂O)₆]³⁺" },
  { d: "d⁷ QS (t₂g⁶ e_g¹)", kuch: "Kuchli", sabab: "e_g orbitallarida bitta toq elektron", misol: "[Co(NO₂)₆]⁴⁻, [Ni(CN)₄]⁻" },
  { d: "d⁸ (t₂g⁶ e_g²)", kuch: "Kuzatilmaydi", sabab: "e_g da ikkala orbital bir xil bittadan elektronga ega (simmetrik)", misol: "[Ni(H₂O)₆]²⁺" },
  { d: "d⁹ (t₂g⁶ e_g³)", kuch: "Eng kuchli (Klassik)", sabab: "e_g orbitallari 3 ta elektron bilan to'lgan (d_z² va d_x²-y² noteng)", misol: "[Cu(H₂O)₆]²⁺, [Cu(NH₃)₄(H₂O)₂]²⁺" },
]

export default function YanTeller() {
  return (
    <MavzuLayout
      sarlavha="Yan-Teller effekti"
      tavsif="Hermann Jahn & Edward Teller (1937) • Nochiziqli degenerat sistemalarda oktaedrik deformatsiya • Cu²⁺ va Cr²⁺ misoli"
      ikon="⚡"
      nishon="03-NAZARIYA"
      yol={[
        { nom: "Kimyoviy bog'lanish", havola: "/oquv/kimyoviy-boglanish" },
        { nom: "Yan-Teller effekti" }
      ]}
      oldingiMavzu={{ nom: "Kristall maydon nazariyasi", havola: "/oquv/kimyoviy-boglanish/kristall-maydon" }}
      keyingiMavzu={{ nom: "Ligand maydon nazariyasi", havola: "/oquv/kimyoviy-boglanish/ligand-maydon" }}
      quizHavola="/oquv/video-darsliklar/quiz/kimyoviy-boglanish"
    >
      {/* ═══ 1. TEOREMA VA MOHIYAT ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Yan-Teller teoremasi (1937)</span>
        </h2>

        <div
          className="rounded-2xl p-5 border text-center shadow-xs"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 10%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 30%, var(--v3-chiziq))"
          }}
        >
          <p className="font-semibold text-sm sm:text-base leading-relaxed" style={{ color: "var(--v3-urgu)" }}>
            &quot;Degenerat elektron holatga ega bo&apos;lgan har qanday nochiziqli molekula termodinamik jihatdan beqaror bo&apos;lib, degeneratlikni yo&apos;qotish va umumiy energiyasini pasaytirish uchun o&apos;z geometrik shaklini o&apos;z-o&apos;zidan deformatsiyalaydi.&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
          <div className="p-4 rounded-xl border space-y-1.5" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-urgu)" }}>Tetragonal cho&apos;zilish (Z-out):</strong>
            <p className="v3-xira text-xs leading-relaxed">
              Z o&apos;qidagi ikkita aksial ligand markaziy metall ionidan uzoqlashadi (bog&apos; uzunligi ortadi). XY tekisligidagi 4 ta ekvatorial ligand esa yaqinlashadi. Cu²⁺ (d⁹) komplekslarida eng ko&apos;p uchraydigan holat.
            </p>
          </div>
          <div className="p-4 rounded-xl border space-y-1.5" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-urgu-2)" }}>Tetragonal siqilish (Z-in):</strong>
            <p className="v3-xira text-xs leading-relaxed">
              Z o&apos;qidagi aksial ligandlar metallga yaqinlashadi, XY tekisligidagi ligandlar uzoqlashadi. Energetik jihatdan kamroq uchraydi.
            </p>
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
          d-konfiguratsiyalar bo&apos;yicha Yan-Teller effekti kuchi
        </h3>

        <InteraktivJadval
          sarlavha="Yan-Teller effekti namoyon bo'lishi"
          ustunlar={[
            { kalit: "d", nom: "d-konfiguratsiya", format: "kod", kenglik: "22%" },
            { kalit: "kuch", nom: "Effekt kuchi", kenglik: "22%" },
            { kalit: "sabab", nom: "Sababi", kenglik: "36%" },
            { kalit: "misol", nom: "Namuna", kenglik: "20%" }
          ]}
          qatorlar={YAN_TELLER_KONFIGURATSIYALAR}
        />
      </div>
    </MavzuLayout>
  )
}