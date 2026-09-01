import test from "node:test";
import assert from "node:assert/strict";
import { masalaPdfHtmlYarat } from "../lib/masala-pdf-html.js";
import { pdfVizualniTayyorla } from "../lib/masala-pdf-vizual.js";

test("murakkab matematika va mhchem xom matnga tushib qolmaydi", () => {
  const html = masalaPdfHtmlYarat({
    masalaMatni: String.raw`Funksiya: \(f(x)=\int_0^x t^2\,dt\)`,
    natija: {
      tenglamalar: [String.raw`\ce{2H2 + O2 -> 2H2O}`],
      yonalish: {
        formulalar: [
          String.raw`\begin{cases}x+y=5\\2x-y=1\end{cases}`,
          String.raw`A=\begin{pmatrix}1&2\\3&4\end{pmatrix}`,
        ],
      },
      yakuniyJavob: String.raw`$$\lim_{x\to 0}\frac{\sin x}{x}=1$$`,
    },
  });

  assert.match(html, /class="katex"/);
  assert.match(html, /class="pdf-render-formula pdf-tenglama"/);
  assert.doesNotMatch(html, /class="pdf-xom-formula"/);
  assert.match(html, /<math xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML">/);
});

test("orbital turi qat'iy tekshiriladi va zichlik SVG'si yaratiladi", () => {
  const vizual = pdfVizualniTayyorla({
    vizual: {
      orbitallar: [
        { turi: "2px", atom: "C", sarlavha: "Uglerod 2p orbitali" },
        { turi: "3d_z2", atom: "Fe" },
        { turi: "9q", atom: "X" },
      ],
    },
  });
  assert.deepEqual(vizual.orbitallar.map((orbital) => orbital.turi), ["2p_x", "3d_z2"]);

  const html = masalaPdfHtmlYarat({
    masalaMatni: "Orbitalni tasvirlang",
    natija: { vizual },
  });
  assert.match(html, /pdf-orbital/);
  assert.match(html, /\|ψ\|² ning 2D kesimi/);
  assert.ok((html.match(/<circle/g) || []).length > 500);
});
