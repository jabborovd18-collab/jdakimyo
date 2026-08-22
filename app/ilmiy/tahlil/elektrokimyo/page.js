import Korinish from "./korinish";

export const metadata = {
  alternates: { canonical: '/ilmiy/tahlil/elektrokimyo' },
  title: "Elektrokimyoviy tahlil (Siklik voltamperometriya — CV)",
  description:
    "Kompleks birikmalarning redoks potensiallari (E1/2), reversivligi (ΔEp), diffuziya koeffitsientlari va barqarorlik konstantalarini siklik voltamperometriya yordamida aniqlash.",
};

export default function ElektrokimyoSahifasi() {
  return <Korinish />;
}
