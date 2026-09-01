// components/LatexMatn.jsx
//
// JDA KIMYO — KaTeX Formulalarni Xavfsiz va Chiroyli Renderlash Komponenti
// Dollar ($) belgilarini va LaTeX sintaksisini tozalab, 0% qizil xatosiz render qiladi.

"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/contrib/mhchem";
import "katex/dist/katex.min.css";
import { latexniNormallashtir, latexniOddiyMatnga } from "@/lib/latex-oddiy-matn.js";

export default function LatexMatn({ matn = "", inline = true, className = "" }) {
  const render = useMemo(() => {
    if (!matn) return { html: "", zaxira: "" };

    const toza = latexniNormallashtir(matn);

    try {
      return {
        html: katex.renderToString(toza, {
          displayMode: !inline,
          throwOnError: true,
          output: "htmlAndMathml",
          trust: false,
        }),
        zaxira: "",
      };
    } catch {
      // Xom LaTeXni `dangerouslySetInnerHTML` ga berish xavfli va qizil
      // xato matnini ko'rsatadi; o'qiladigan oddiy matn zaxirasi yaxshiroq.
      return { html: "", zaxira: latexniOddiyMatnga(toza) };
    }
  }, [matn, inline]);

  if (!matn) return null;

  if (!render.html) {
    return <span className={`latex-zaxira whitespace-pre-wrap ${className}`}>{render.zaxira}</span>;
  }

  return (
    <span
      className={`katex-render inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: render.html }}
    />
  );
}
