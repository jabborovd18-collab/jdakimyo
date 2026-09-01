"use client";

import { Fragment, useMemo } from "react";
import LatexMatn from "@/components/LatexMatn.jsx";
import { latexliMatnniBol } from "@/lib/latex-oddiy-matn.js";

/** Oddiy izoh ichidagi $...$ va $$...$$ formulalarni alohida renderlaydi. */
export default function LatexBoyMatn({ matn = "", className = "" }) {
  const bolaklar = useMemo(() => latexliMatnniBol(matn), [matn]);
  if (!matn) return null;

  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {bolaklar.map((bolak, indeks) => (
        <Fragment key={`${bolak.turi}-${indeks}`}>
          {bolak.turi === "formula" ? (
            <span className={bolak.blok ? "my-2 block max-w-full overflow-x-auto text-center" : "inline max-w-full"}>
              <LatexMatn matn={bolak.matn} inline={!bolak.blok} />
            </span>
          ) : (
            <span>{bolak.matn}</span>
          )}
        </Fragment>
      ))}
    </span>
  );
}
