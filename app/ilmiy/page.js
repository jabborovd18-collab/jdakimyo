import Korinish from "./korinish";
import HAJM from "@/lib/ilmiy-hajm.json";

// SONLAR TAVSIFDA HAM MANBADAN OLINADI. Ilgari bu yerda "350+ kompleks
// birikmalar bazasi" deb yozilgan edi — bunday baza yo'q, sahifaning
// o'zi 34 ta birikma sahifasini ko'rsatadi. Qidiruv natijasida
// ko'rinadigan tavsif sahifadagi haqiqatdan farq qilsa, saytga bo'lgan
// ishonch birinchi bosishdayoq yo'qoladi (AGENTS.md 1-band).
export const metadata = {
  alternates: { canonical: '/ilmiy' },
  title: "Kompleks birikmalar kutubxonasi — Oliy Ilmiy Tadqiqot Platformasi",
  description:
    `To'rt yo'nalish: ${HAJM.usullar} ta fiziko-kimyoviy tahlil usuli, ` +
    `${HAJM.mavzular} ta chuqurlashgan mavzu (${HAJM.mavzuSahifalari} sahifa), ` +
    `${HAJM.birikmalar} ta kompleks birikma sahifasi va ilmiy maqolalar. ` +
    "Kristall maydon nazariyasidan Mössbauer spektroskopiyasigacha.",
};

export default function IlmiySahifasi() {
  return <Korinish />;
}
