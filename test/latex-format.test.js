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

test("izohdagi delimitersiz mhchem formulasi xom buyruq bo'lib qolmaydi", () => {
  const bolaklar = latexliMatnniBol(String.raw`Aspirin formulasi \ce{C9H8O4} bo'lgani uchun molyar massa hisoblanadi.`);
  assert.deepEqual(bolaklar.filter((x) => x.turi === "formula").map((x) => x.matn), [String.raw`\ce{C9H8O4}`]);
  assert.doesNotMatch(bolaklar.filter((x) => x.turi === "matn").map((x) => x.matn).join(""), /\\ce/);
  assert.doesNotThrow(() => katex.renderToString(bolaklar[1].matn, { throwOnError: true }));
});

test("izohdagi delimitersiz amal va indekslar KaTeX bo'laklariga ajraladi", () => {
  const bolaklar = latexliMatnniBol(String.raw`m = n \times M_{aspirin} formulasi qo'llaniladi.`);
  assert.deepEqual(bolaklar.filter((x) => x.turi === "formula").map((x) => x.matn), [String.raw`\times`, String.raw`M_{aspirin}`]);
  assert.doesNotMatch(bolaklar.filter((x) => x.turi === "matn").map((x) => x.matn).join(""), /\\times|M_\{/);
  for (const bolak of bolaklar.filter((x) => x.turi === "formula")) {
    assert.doesNotThrow(() => katex.renderToString(bolak.matn, { throwOnError: true }));
  }
});

test("delimitersiz kasr va ichki zaryadli mhchem ham to'liq ajratiladi", () => {
  const bolaklar = latexliMatnniBol(String.raw`Nisbat \frac{m}{M}, ion esa \ce{Fe^{3+}}.`);
  assert.deepEqual(bolaklar.filter((x) => x.turi === "formula").map((x) => x.matn), [String.raw`\frac{m}{M}`, String.raw`\ce{Fe^{3+}}`]);
  for (const bolak of bolaklar.filter((x) => x.turi === "formula")) {
    assert.doesNotThrow(() => katex.renderToString(bolak.matn, { throwOnError: true }));
  }
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
