// components/BoyitilganMatn.jsx
//
// JDA KIMYO — MIXED MARKDOWN & KATEX FORMULALAR RENDERERI
// Matn ichidagi $...$ va $$...$$ KaTeX formulalari hamda **qalin** so'zlarni chiroyli render qiladi.

"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function BoyitilganMatn({ matn = "", className = "" }) {
  const renderedElements = useMemo(() => {
    if (!matn || typeof matn !== "string") return null;

    // 1. Qatorlarga ajratish
    const qatorlar = matn.split("\n");

    return qatorlar.map((qator, qIdx) => {
      const qatorTrimmed = qator.trim();

      if (!qatorTrimmed) {
        return <div key={qIdx} className="h-2" />;
      }

      // Display Math: Butun qator $$...$$ bo'lsa
      if (qatorTrimmed.startsWith("$$") && qatorTrimmed.endsWith("$$")) {
        const raw = qatorTrimmed.slice(2, -2).trim();
        try {
          const html = katex.renderToString(raw, {
            displayMode: true,
            throwOnError: false,
            output: "htmlAndMathml",
          });
          return (
            <div
              key={qIdx}
              className="my-2 p-2.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] overflow-x-auto text-center font-mono font-bold text-[var(--v3-urgu)] shadow-2xs"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <div key={qIdx} className="my-1.5 p-2 font-mono text-xs overflow-x-auto">
              {raw}
            </div>
          );
        }
      }

      // Inline formulalarni ($...$ va $$...$$) ajratish
      const qismlar = qator.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g);

      return (
        <p key={qIdx} className="leading-relaxed">
          {qismlar.map((qism, pIdx) => {
            if (!qism) return null;

            // Display math fragment
            if (qism.startsWith("$$") && qism.endsWith("$$")) {
              const raw = qism.slice(2, -2).trim();
              try {
                const html = katex.renderToString(raw, {
                  displayMode: true,
                  throwOnError: false,
                  output: "htmlAndMathml",
                });
                return (
                  <span
                    key={pIdx}
                    className="block my-2 p-2 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] overflow-x-auto text-center font-mono font-bold text-[var(--v3-urgu)]"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (e) {
                return <code key={pIdx} className="font-mono">{raw}</code>;
              }
            }

            // Inline math fragment: $...$
            if (qism.startsWith("$") && qism.endsWith("$")) {
              const raw = qism.slice(1, -1).trim();
              try {
                const html = katex.renderToString(raw, {
                  displayMode: false,
                  throwOnError: false,
                  output: "htmlAndMathml",
                });
                return (
                  <span
                    key={pIdx}
                    className="inline-block px-0.5 font-mono font-bold text-[var(--v3-urgu)]"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (e) {
                return <span key={pIdx} className="font-mono">{raw}</span>;
              }
            }

            // Oddiy matn ichidagi **qalin** qismlar
            return <span key={pIdx}>{renderMarkdownQalin(qism)}</span>;
          })}
        </p>
      );
    });
  }, [matn]);

  return <div className={`boyitilgan-matn space-y-1 ${className}`}>{renderedElements}</div>;
}

function renderMarkdownQalin(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-[var(--v3-matn)]">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return p;
  });
}
