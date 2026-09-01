const SVG_KENGLIK = 660;
const SVG_BALANDLIK = 310;
const MARKAZ_X = 330;
const MARKAZ_Y = 142;
const BULUT_RADIUSI = 122;
const NUQTA_SONI = 560;

function svgHimoya(qiymat) {
  return String(qiymat ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function urugYarat(matn) {
  let urug = 2166136261;
  for (const belgi of String(matn)) {
    urug ^= belgi.charCodeAt(0);
    urug = Math.imul(urug, 16777619);
  }
  return urug >>> 0;
}

function tasodifGeneratori(urug) {
  let holat = urug || 1;
  return () => {
    holat ^= holat << 13;
    holat ^= holat >>> 17;
    holat ^= holat << 5;
    return (holat >>> 0) / 4294967296;
  };
}

function orbitalAmplitudasi(turi, x, y) {
  const r = Math.sqrt(x * x + y * y);
  switch (turi) {
    case "1s":
      return Math.exp(-1.55 * r);
    case "2s":
      return (1.72 - r) * Math.exp(-0.72 * r);
    case "2p_x":
      return x * Math.exp(-0.82 * r);
    case "2p_y":
    case "2p_z":
      return y * Math.exp(-0.82 * r);
    case "3d_xy":
    case "3d_xz":
    case "3d_yz":
      return x * y * Math.exp(-0.72 * r);
    case "3d_x2-y2":
      return (x * x - y * y) * Math.exp(-0.72 * r);
    case "3d_z2":
      return (2 * y * y - x * x) * Math.exp(-0.72 * r);
    default:
      return 0;
  }
}

function engKattaZichlik(turi) {
  let engKatta = 0;
  for (let ix = -40; ix <= 40; ix += 1) {
    for (let iy = -40; iy <= 40; iy += 1) {
      const x = (ix / 40) * 4;
      const y = (iy / 40) * 4;
      const amplituda = orbitalAmplitudasi(turi, x, y);
      engKatta = Math.max(engKatta, amplituda * amplituda);
    }
  }
  return engKatta || 1;
}

function bulutNuqtalari(orbital) {
  const tasodif = tasodifGeneratori(urugYarat(`${orbital.turi}:${orbital.atom}`));
  const engKatta = engKattaZichlik(orbital.turi);
  const nuqtalar = [];
  let urinish = 0;

  while (nuqtalar.length < NUQTA_SONI && urinish < 40000) {
    urinish += 1;
    const x = tasodif() * 8 - 4;
    const y = tasodif() * 8 - 4;
    const amplituda = orbitalAmplitudasi(orbital.turi, x, y);
    const nisbiyZichlik = (amplituda * amplituda) / engKatta;
    if (tasodif() > Math.min(1, nisbiyZichlik * 1.55)) continue;

    nuqtalar.push({
      x: MARKAZ_X + (x / 4) * BULUT_RADIUSI,
      y: MARKAZ_Y - (y / 4) * BULUT_RADIUSI,
      musbat: amplituda >= 0,
      radius: 0.75 + Math.sqrt(nisbiyZichlik) * 1.25,
      opacity: 0.26 + Math.sqrt(nisbiyZichlik) * 0.58,
    });
  }

  return nuqtalar;
}

function tugunChiziqlari(turi) {
  const chap = MARKAZ_X - BULUT_RADIUSI;
  const ong = MARKAZ_X + BULUT_RADIUSI;
  const tepa = MARKAZ_Y - BULUT_RADIUSI;
  const past = MARKAZ_Y + BULUT_RADIUSI;
  const chiziq = (x1, y1, x2, y2) => (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="pdf-orbital-tugun" />`
  );

  if (turi === "2s") {
    return `<circle cx="${MARKAZ_X}" cy="${MARKAZ_Y}" r="52" class="pdf-orbital-tugun" />`;
  }
  if (turi === "2p_x") return chiziq(MARKAZ_X, tepa, MARKAZ_X, past);
  if (turi === "2p_y" || turi === "2p_z") return chiziq(chap, MARKAZ_Y, ong, MARKAZ_Y);
  if (turi === "3d_xy" || turi === "3d_xz" || turi === "3d_yz") {
    return `${chiziq(MARKAZ_X, tepa, MARKAZ_X, past)}${chiziq(chap, MARKAZ_Y, ong, MARKAZ_Y)}`;
  }
  if (turi === "3d_x2-y2") {
    return `${chiziq(chap, tepa, ong, past)}${chiziq(chap, past, ong, tepa)}`;
  }
  if (turi === "3d_z2") {
    return `${chiziq(MARKAZ_X - 86, tepa, MARKAZ_X + 86, past)}${chiziq(MARKAZ_X + 86, tepa, MARKAZ_X - 86, past)}`;
  }
  return "";
}

function orbitalNomi(turi) {
  return turi
    .replace("_x2-y2", "x²-y²")
    .replace("_z2", "z²")
    .replace("_xy", "xy")
    .replace("_xz", "xz")
    .replace("_yz", "yz")
    .replace("_x", "ₓ")
    .replace("_y", "ᵧ")
    .replace("_z", "z");
}

function orbitalYozuviniTuzat(matn) {
  return String(matn ?? "")
    .replace(/2p_x/g, "2pₓ")
    .replace(/2p_y/g, "2pᵧ")
    .replace(/2p_z/g, "2pz")
    .replace(/3d_xy/g, "3dxy")
    .replace(/3d_xz/g, "3dxz")
    .replace(/3d_yz/g, "3dyz")
    .replace(/3d_x2-y2/g, "3dx²-y²")
    .replace(/3d_z2/g, "3dz²");
}

/** Tasvir AI chizmasi emas: bir xil orbital har safar bir xil zichlik kesimini beradi. */
export function orbitalSvgYarat(orbital) {
  const nuqtalar = bulutNuqtalari(orbital);
  const id = `orb-${urugYarat(`${orbital.turi}:${orbital.atom}`).toString(16)}`;
  const atom = svgHimoya(orbital.atom || "Atom");
  const nom = svgHimoya(orbitalNomi(orbital.turi));
  const sarlavha = svgHimoya(orbitalYozuviniTuzat(orbital.sarlavha) || `${atom}: ${nom} elektron buluti`);
  const doiralar = nuqtalar.map((nuqta) => (
    `<circle cx="${nuqta.x.toFixed(2)}" cy="${nuqta.y.toFixed(2)}" r="${nuqta.radius.toFixed(2)}" fill="${nuqta.musbat ? "#2563eb" : "#e11d48"}" fill-opacity="${nuqta.opacity.toFixed(2)}" />`
  )).join("");

  const dz2Halqa = orbital.turi === "3d_z2"
    ? `<ellipse cx="${MARKAZ_X}" cy="${MARKAZ_Y}" rx="57" ry="18" class="pdf-orbital-halqa" />`
    : "";
  const gorizontalOq = orbital.turi === "3d_yz" ? "y" : "x";
  const vertikalOq = ["2p_z", "3d_xz", "3d_yz", "3d_z2"].includes(orbital.turi) ? "z" : "y";

  return `<figure class="pdf-orbital">
    <h3>${sarlavha}</h3>
    <svg viewBox="0 0 ${SVG_KENGLIK} ${SVG_BALANDLIK}" role="img" aria-label="${sarlavha}">
      <defs><clipPath id="${id}"><rect x="185" y="12" width="290" height="260" rx="14" /></clipPath></defs>
      <rect x="185" y="12" width="290" height="260" rx="14" class="pdf-orbital-fon" />
      <line x1="195" y1="${MARKAZ_Y}" x2="465" y2="${MARKAZ_Y}" class="pdf-orbital-oq" />
      <line x1="${MARKAZ_X}" y1="22" x2="${MARKAZ_X}" y2="262" class="pdf-orbital-oq" />
      <g clip-path="url(#${id})">${doiralar}${dz2Halqa}${tugunChiziqlari(orbital.turi)}</g>
      <circle cx="${MARKAZ_X}" cy="${MARKAZ_Y}" r="4" class="pdf-orbital-yadro" />
      <text x="458" y="${MARKAZ_Y - 7}" class="pdf-orbital-belgi">${gorizontalOq}</text>
      <text x="${MARKAZ_X + 8}" y="29" class="pdf-orbital-belgi">${vertikalOq}</text>
      <text x="30" y="64" class="pdf-orbital-nom">${atom}</text>
      <text x="30" y="92" class="pdf-orbital-turi">${nom}</text>
      <circle cx="32" cy="132" r="5" fill="#2563eb" /><text x="45" y="136" class="pdf-orbital-izoh">musbat faza</text>
      <circle cx="32" cy="158" r="5" fill="#e11d48" /><text x="45" y="162" class="pdf-orbital-izoh">manfiy faza</text>
      <line x1="27" y1="184" x2="39" y2="184" class="pdf-orbital-tugun" /><text x="45" y="188" class="pdf-orbital-izoh">tugun sathi</text>
      <text x="30" y="234" class="pdf-orbital-eslatma">|ψ|² ning 2D kesimi</text>
      <text x="30" y="253" class="pdf-orbital-eslatma">zichlik nisbiy ko'rsatilgan</text>
    </svg>
  </figure>`;
}
