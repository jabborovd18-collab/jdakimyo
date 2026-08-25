"use client"

/**
 * Koordinatsion kimyo formulalarini V3 dizaynda chiroyli va ilmiy aniq formatlovchi komponent.
 * 
 * @param {string} formula - Masalan: "[Co(NH₃)₆]Cl₃", "[Fe(CN)₆]⁴⁻", "cis-[Pt(NH₃)₂Cl₂]"
 * @param {string} [olcham="odatiy"] - "kichik" | "odatiy" | "katta" | "ulkan"
 * @param {boolean} [ajratilgan=false] - Ichki va tashqi sferani ajratib ko'rsatish
 */
export default function KimyoFormula({
  formula = "",
  olcham = "odatiy",
  ajratilgan = false,
  className = ""
}) {
  if (!formula) return null

  // O'lcham sinflari
  const olchamSinflari = {
    kichik: "text-xs tracking-normal font-mono",
    odatiy: "text-sm md:text-base font-mono font-medium",
    katta: "text-lg md:text-xl font-mono font-semibold",
    ulkan: "text-2xl md:text-3xl font-mono font-bold"
  }

  // Raqamlar va belgilarni formatlash (subscript / superscript)
  const formatFormat = (matn) => {
    return matn
      .replace(/([0-9]+)/g, "<sub>$1</sub>")
      .replace(/(\+|\-)/g, "<sup>$1</sup>")
      .replace(/<sub>([0-9]+)<\/sub><sup>(\+|\-)<\/sup>/g, "<sup>$1$2</sup>")
  }

  if (ajratilgan && formula.includes("[") && formula.includes("]")) {
    const start = formula.indexOf("[")
    const end = formula.indexOf("]")
    const oldi = formula.slice(0, start)
    const ichki = formula.slice(start, end + 1)
    const orqa = formula.slice(end + 1)

    return (
      <span
        className={`inline-flex items-center gap-1 ${olchamSinflari[olcham] || olchamSinflari.odatiy} ${className}`}
        style={{ letterSpacing: "0.02em" }}
      >
        {oldi && <span dangerouslySetInnerHTML={{ __html: formatFormat(oldi) }} />}
        <span
          className="px-1.5 py-0.5 rounded border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 30%, var(--v3-chiziq))",
            color: "var(--v3-urgu)"
          }}
          title="Ichki koordinatsion sfera"
          dangerouslySetInnerHTML={{ __html: formatFormat(ichki) }}
        />
        {orqa && (
          <span
            className="opacity-90"
            style={{ color: "var(--v3-urgu-2)" }}
            title="Tashqi sfera"
            dangerouslySetInnerHTML={{ __html: formatFormat(orqa) }}
          />
        )}
      </span>
    )
  }

  return (
    <span
      className={`inline-block ${olchamSinflari[olcham] || olchamSinflari.odatiy} ${className}`}
      style={{ color: "var(--v3-matn)", letterSpacing: "0.02em" }}
      dangerouslySetInnerHTML={{ __html: formatFormat(formula) }}
    />
  )
}
