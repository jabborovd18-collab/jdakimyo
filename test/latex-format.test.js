import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import "katex/contrib/mhchem";
import {
  latexliMatnniBol,
  latexliMatnniOddiylashtir,
  latexniNormallashtir,
} from "../lib/latex-oddiy-matn.js";

test("ketma-ket dollar bloklari bitta yaroqli aligned formulaga aylanadi", () => {
  const xom = String.raw`$$\frac{(4-x)(8+x)}{(4+x)(4+x)}=1$$$$32+4x-8x-x^2=16+8x+x^2$$$$x=-3+\sqrt{17}$$`;
  const toza = latexniNormallashtir(xom);

  assert.match(toza, /\\begin\{aligned\}/);
  assert.doesNotMatch(toza, /\$/);
  assert.doesNotThrow(() => katex.renderToString(toza, { throwOnError: true }));
});

test("aralash chat matnidagi yopishgan formulalar ikkita blok bo'lib renderlanadi", () => {
  const bolaklar = latexliMatnniBol(String.raw`Hisob: $$x^2=4$$$$x=2$$. Tayyor.`);
  assert.deepEqual(bolaklar.filter((x) => x.turi === "formula").map((x) => x.matn), ["x^2=4", "x=2"]);
});

test("Telegram matnida xom LaTeX va dollar belgilari qolmaydi", () => {
  const toza = latexliMatnniOddiylashtir(
    String.raw`Natija: $$\frac{C_0}{2}=0.4$$$$t=\frac{\ln 2}{k}\approx2.77\text{ s}$$`,
  );

  assert.doesNotMatch(toza, /\$|\\frac|\\text|\\approx/);
  assert.match(toza, /C₀/);
  assert.match(toza, /≈/);
});

test("JSON nazorat belgisiga aylangan frac va text buyruqlari tiklanadi", () => {
  const buzilgan = "\frac{1}{2} \\text{ mol}".replace("\\f", "\f").replace("\\t", "\t");
  const toza = latexniNormallashtir(buzilgan);
  assert.equal(toza, String.raw`\frac{1}{2} \text{ mol}`);
});
