const PAST_BELGILAR = Object.freeze({
  0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄",
  5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉",
  "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
});

const YUQORI_BELGILAR = Object.freeze({
  0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴",
  5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
});

const FORMULA_BOLGICHI = "\uE000";

function jsonNazoratBelgilariniTuzat(matn) {
  return String(matn ?? "")
    // Model JSON ichida teskari chiziqni qochirmasa, JSON.parse bu uch
    // buyruq boshini nazorat belgisiga aylantiradi. Ularni shu yerda
    // tiklamasak brauzer, Telegram va PDF uch xil buzilgan matn oladi.
    .replace(/\f(?=rac\b)/g, "\\f")
    .replace(/\t(?=ext\b)/g, "\\t")
    .replace(/\r(?=ightarrow\b)/g, "\\r");
}

/**
 * Bitta formula maydonini KaTeX kutadigan yagona ifodaga aylantiradi.
 * Model ba'zan `$$a$$$$b$$` yuboradi: o'rtadagi to'rtta dollar aslida
 * yopilgan va darhol ochilgan ikki blok. Ular `aligned` qatorlariga aylanadi.
 */
export function latexniNormallashtir(matn = "") {
  let natija = jsonNazoratBelgilariniTuzat(matn)
    .trim()
    .replace(/^```(?:latex|tex|math)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  if (!natija) return "";

  if (natija.startsWith("$$") && natija.endsWith("$$") && natija.length >= 4) {
    natija = natija.slice(2, -2).trim();
  } else if (natija.startsWith("\\[") && natija.endsWith("\\]")) {
    natija = natija.slice(2, -2).trim();
  } else if (natija.startsWith("\\(") && natija.endsWith("\\)")) {
    natija = natija.slice(2, -2).trim();
  } else if (natija.startsWith("$") && natija.endsWith("$") && natija.length >= 2) {
    natija = natija.slice(1, -1).trim();
  }

  natija = natija
    .replace(/\$\$\s*\$\$/g, FORMULA_BOLGICHI)
    .replace(/\\\]\s*\\\[/g, FORMULA_BOLGICHI)
    .replace(/\$\$/g, FORMULA_BOLGICHI)
    .replace(/\\[\[\]()]/g, "")
    .replace(/(^|[^\\])\$/g, "$1")
    .trim();

  const qatorlar = natija
    .split(FORMULA_BOLGICHI)
    .map((qator) => qator.trim().replace(/\\\\\s*$/, ""))
    .filter(Boolean);

  if (qatorlar.length <= 1) return qatorlar[0] || "";
  return `\\begin{aligned}${qatorlar.join(" \\\\ ")}\\end{aligned}`;
}

/** Matn va formulalarni xavfsiz renderlash uchun chegaralari bo'yicha ajratadi. */
export function latexliMatnniBol(matn = "") {
  const toza = jsonNazoratBelgilariniTuzat(matn)
    // Yopuvchi va ochuvchi delimiter orasida bo'shliq bo'lmasa ham ikki
    // mustaqil blok sifatida ajratilishi kerak.
    // Callback kerak: String.replace ichida `$$` maxsus almashtirish belgisi.
    .replace(/\$\$\s*\$\$/g, () => "$$\n$$");
  const qolip = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g;
  const bolaklar = [];
  let oxiri = 0;
  let moslik;

  while ((moslik = qolip.exec(toza)) !== null) {
    if (moslik.index > oxiri) {
      bolaklar.push({ turi: "matn", matn: toza.slice(oxiri, moslik.index) });
    }
    const formula = moslik[1] ?? moslik[2] ?? moslik[3] ?? moslik[4] ?? "";
    bolaklar.push({
      turi: "formula",
      matn: latexniNormallashtir(formula),
      blok: moslik[1] !== undefined || moslik[2] !== undefined,
    });
    oxiri = qolip.lastIndex;
  }

  if (oxiri < toza.length) {
    bolaklar.push({ turi: "matn", matn: toza.slice(oxiri) });
  }

  return bolaklar.length ? bolaklar : [{ turi: "matn", matn: toza }];
}

function guruhniOl(matn, bosh) {
  if (matn[bosh] !== "{") return null;
  let chuqurlik = 0;
  for (let i = bosh; i < matn.length; i += 1) {
    if (matn[i] === "{") chuqurlik += 1;
    if (matn[i] === "}") chuqurlik -= 1;
    if (chuqurlik === 0) {
      return { ichki: matn.slice(bosh + 1, i), oxiri: i + 1 };
    }
  }
  return null;
}

function kasrlarniOgir(matn) {
  let natija = matn;
  for (let urinish = 0; urinish < 20; urinish += 1) {
    const moslik = /\\(?:d?frac)\s*\{/.exec(natija);
    if (!moslik) break;
    const surat = guruhniOl(natija, moslik.index + moslik[0].lastIndexOf("{"));
    if (!surat) break;
    let maxrajBoshi = surat.oxiri;
    while (/\s/.test(natija[maxrajBoshi] || "")) maxrajBoshi += 1;
    const maxraj = guruhniOl(natija, maxrajBoshi);
    if (!maxraj) break;
    const almashtirish = `(${kasrlarniOgir(surat.ichki)}) / (${kasrlarniOgir(maxraj.ichki)})`;
    natija = natija.slice(0, moslik.index) + almashtirish + natija.slice(maxraj.oxiri);
  }
  return natija;
}

function buyruqGuruhiniOch(matn, buyruqlar) {
  let natija = matn;
  const qolip = new RegExp(`\\\\(?:${buyruqlar.join("|")})\\s*\\{`, "i");
  for (let urinish = 0; urinish < 30; urinish += 1) {
    const moslik = qolip.exec(natija);
    if (!moslik) break;
    const guruh = guruhniOl(natija, moslik.index + moslik[0].lastIndexOf("{"));
    if (!guruh) break;
    natija = natija.slice(0, moslik.index) + guruh.ichki + natija.slice(guruh.oxiri);
  }
  return natija;
}

function belgilarniOgir(qiymat, jadval, zaxiraBelgisi) {
  const belgilar = [...String(qiymat).trim()];
  if (belgilar.length > 0 && belgilar.every((belgi) => jadval[belgi])) {
    return belgilar.map((belgi) => jadval[belgi]).join("");
  }
  return `${zaxiraBelgisi}(${qiymat})`;
}

/** KaTeX ishlamaydigan server PDF'i uchun LaTeXni yo'qotmay, o'qiladigan matnga aylantiradi. */
export function latexniOddiyMatnga(matn = "") {
  let natija = jsonNazoratBelgilariniTuzat(matn).trim();
  if (!natija) return "";

  natija = natija
    .replace(/\$\$\s*\$\$/g, "\n")
    .replace(/\$+/g, "")
    .replace(/\\(?:begin|end)\s*\{(?:aligned|align\*?|gathered|cases|matrix|pmatrix|bmatrix|vmatrix)\}/g, "")
    .replace(/\{,\}/g, ".")
    // Chegara sharti `\\rightarrow` ichidagi `\\right` qismini yutib yubormaslik uchun kerak.
    .replace(/\\(?:left|right)\b/g, "");
  natija = kasrlarniOgir(natija);
  natija = buyruqGuruhiniOch(natija, ["ce", "text", "mathrm", "mathbf", "mathit", "textbf"]);

  for (let i = 0; i < 6; i += 1) {
    const oldingi = natija;
    natija = natija
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, "√($1)");
    if (natija === oldingi) break;
  }

  natija = natija
    .replace(/_\{([^{}]+)\}/g, (_, qiymat) => belgilarniOgir(qiymat, PAST_BELGILAR, "_"))
    .replace(/_([0-9])/g, (_, qiymat) => PAST_BELGILAR[qiymat])
    .replace(/\^\{([^{}]+)\}/g, (_, qiymat) => belgilarniOgir(qiymat, YUQORI_BELGILAR, "^"))
    .replace(/\^([0-9+\-=])/g, (_, qiymat) => YUQORI_BELGILAR[qiymat])
    .replace(/\\(?:rightarrow|to)/g, " → ")
    .replace(/\\leftrightarrow/g, " ↔ ")
    .replace(/\\(?:cdot|cdotp)/g, " · ")
    .replace(/\\times/g, " × ")
    .replace(/\\div/g, " ÷ ")
    .replace(/\\approx/g, " ≈ ")
    .replace(/\\leq?/g, " ≤ ")
    .replace(/\\geq?/g, " ≥ ")
    .replace(/\\neq/g, " ≠ ")
    .replace(/<=>|⇌/g, " ↔ ")
    .replace(/->/g, " → ")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\omega/g, "ω")
    .replace(/\\nu/g, "ν")
    .replace(/\\rho/g, "ρ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\uparrow/g, "↑")
    .replace(/\\downarrow/g, "↓")
    .replace(/\\%/g, "%")
    .replace(/\\,/g, " ")
    .replace(/\\\\/g, "\n")
    .replace(/&/g, " ")
    .replace(/~/g, " ")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/[{}]/g, "")
    .replace(/\\([a-zA-Z]+)/g, "$1")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n+ */g, "\n")
    .trim();

  return natija;
}

/** Telegram va nusxalash uchun aralash matndagi barcha formulalarni o'qiladigan qiladi. */
export function latexliMatnniOddiylashtir(matn = "") {
  return latexliMatnniBol(matn)
    .map((bolak) => latexniOddiyMatnga(bolak.matn))
    .filter(Boolean)
    .join(" ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .trim();
}
