import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import "katex/contrib/mhchem";
import {
  latexliMatnniBol,
  latexliMatnniOddiylashtir,
  latexniNormallashtir,
} from "../lib/latex-oddiy-matn.js";
import { tgHtmlniChekla, tgKimyoFormatla } from "../lib/telegram-format.js";

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

test("Telegram uzun xabarni 3900 belgidan oshirmasdan HTML tegini yopadi", () => {
  const natija = tgHtmlniChekla(`<b>${"a".repeat(5000)}</b>`);
  assert.ok(natija.length <= 3900);
  assert.match(natija, /<\/b>\n\n<i>\(Javob davomi qisqartirildi\)<\/i>$/);
});

test("Telegram kesishda HTML entity yarmida qolmaydi", () => {
  const natija = tgHtmlniChekla(`${"a".repeat(3880)}&amp;${"b".repeat(100)}`);
  assert.ok(natija.length <= 3900);
  assert.doesNotMatch(natija, /&(?:a|am)?$/);
  assert.match(natija, /Javob davomi qisqartirildi/);
});

test("Telegram kimyo formatlashi LaTexni o'qiladigan formulaga aylantiradi", () => {
  const natija = tgKimyoFormatla(String.raw`$$\frac{m}{M}=2\text{ mol}$$`);
  assert.equal(natija, "(m) / (M)=2 mol");
  assert.doesNotMatch(natija, /\$|\\frac|\\text/);
});
