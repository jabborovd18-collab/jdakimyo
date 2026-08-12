import dynamic from 'next/dynamic';

export const metadata = {
  title: "3D Laboratoriya | JDA KIMYO — Interaktiv kimyoviy tajribalar",
  description:
    "O'zbek tilidagi kimyo platformasida 3D virtual laboratoriya. Probirka va kolbalarda reagentlarni millilitr aniqlik bilan quying, cho'kma va animatsiyani kuzating.",
};

const Korinish = dynamic(() => import("./korinish"), {
  ssr: false,
  loading: () => (
    <div className="v3 min-h-screen flex items-center justify-center text-[var(--v3-matn)] bg-[var(--v3-fon)]">
      <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--v3-urgu)] border-t-transparent animate-spin" />
        <span className="text-xs font-mono">3D Laboratoriya yuklanmoqda...</span>
      </div>
    </div>
  ),
});

export default function Sahifa() {
  return <Korinish />;
}
