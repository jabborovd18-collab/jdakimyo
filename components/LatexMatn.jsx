// components/LatexMatn.jsx
//
// JDA KIMYO — KaTeX Formulalarni Xavfsiz va Chiroyli Renderlash Komponenti
// Dollar ($) belgilarini va LaTeX sintaksisini tozalab, 0% qizil xatosiz render qiladi.

"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function LatexMatn({ matn = "", inline = true, className = "" }) {
  const html = useMemo(() => {
    if (!matn) return "";
    
    let toza = String(matn).trim();

    // Atrofdagi $ va $$ belgilarini olib tashlash (chunki katex.renderToString sof formula kutadi)
    if (toza.startsWith("$$") && toza.endsWith("$$")) {
      toza = toza.slice(2, -2).trim();
    } else if (toza.startsWith("$") && toza.endsWith("$")) {
      toza = toza.slice(1, -1).trim();
    }

    try {
      return katex.renderToString(toza, {
        displayMode: !inline,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    } catch (e) {
      return toza;
    }
  }, [matn, inline]);

  if (!matn) return null;

  return (
    <span
      className={`katex-render inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
