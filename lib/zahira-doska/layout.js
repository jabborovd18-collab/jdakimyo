// app/doska/layout.js
//
// Smart Doska — O'qituvchilar va auditoriyadagi elektron doskalar uchun
// interaktiv dars, formulalar, grafiklar va jamoaviy jang maydoni.

export const metadata = {
  title: "Smart Doska — Interaktiv ta'lim",
  description:
    "O'qituvchilar va auditoriyadagi elektron doskalar uchun interaktiv kimyoviy formulalar, izotermalar va jamoalar jangi musobaqasi.",
};

export default function DoskaLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 antialiased font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {children}
    </div>
  );
}
