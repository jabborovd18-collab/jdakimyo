// components/LatexMatn.jsx
//
// JDA KIMYO — KaTeX Formulalarni Xavfsiz va Chiroyli Renderlash Komponenti
//

"use client";

import React, { useMemo } from "react";
import katex from "katex";

export default function LatexMatn({ matn = "", inline = true, className = "" }) {
  const html = useMemo(() => {
    if (!matn) return "";
    try {
      // Agar sof LaTeX formula bo'lsa
      return katex.renderToString(String(matn), {
        displayMode: !inline,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    } catch (e) {
      return String(matn);
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
