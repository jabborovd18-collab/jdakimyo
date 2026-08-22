import { notFound } from "next/navigation";
import OlchamMijoz from "./olcham-mijoz";

export const metadata = {
  alternates: { canonical: '/laboratoriya/3d/olcham' },
  title: "3D o'lchagich",
  robots: { index: false, follow: false },
};

export default function OlchamSahifa() {
  // Jonli saytda bu manzil ochilmasligi shart — o'lchagich kirishsiz
  // sahnani chiqaradi. next build NODE_ENV=production qiladi, shuning
  // uchun `npm start` ham 404 qaytaradi.
  if (process.env.NODE_ENV === "production") notFound();
  return <OlchamMijoz />;
}
