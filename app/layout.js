import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { saytGrafi, ldJsonProps } from "@/lib/tuzilgan-malumot";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "JDA KIMYO — Oliy kimyo",
    template: "%s | JDA KIMYO",
  },
  description:
    "O'zbek tilida oliy kimyoni o'rganish platformasi. Kompleks birikmalar, IUPAC nomlanishi, izomeriya, fazoviy tuzilish, video darsliklar va testlar.",
  // "kompleks birikmalar" kalit so'z sifatida QOLDIRILDI: sayt endi butun
  // oliy kimyoni qamraydi, lekin mavjud sahifalarning katta qismi hamon shu
  // mavzuda va qidiruvdagi o'rin aynan shu so'z orqali kelgan.
  keywords: [
    "oliy kimyo",
    "kompleks birikmalar",
    "kimyo",
    "IUPAC",
    "koordinatsion kimyo",
    "o'zbek tilida kimyo",
    "izomeriya",
    "ligand",
  ],
  authors: [{ name: "Diyorbek Jabborov Arslonivich" }],
  creator: "Diyorbek Jabborov Arslonivich",
  // www BILAN: kontentni 200 bilan qaytaradigan yagona host shu,
  // jdakimyo.uz esa 307 bilan unga yo'naltiradi. metadataBase butun
  // saytdagi canonical manzillarning asosi — u yo'naltiriladigan hostni
  // ko'rsatsa, Google'ga "asosiy nusxa mana bu yerda" deb turib, o'sha
  // manzil boshqa joyga jo'natadi. Ikkala ishora bir xil bo'lishi kerak.
  metadataBase: new URL("https://www.jdakimyo.uz"),
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://www.jdakimyo.uz",
    siteName: "JDA KIMYO",
    title: "JDA KIMYO — Oliy kimyo",
    description: "O'zbek tilida oliy kimyoni o'rganish platformasi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JDA KIMYO — Oliy kimyo",
    description: "O'zbek tilida oliy kimyoni o'rganish platformasi.",
    creator: "@diyorbek_jabborov",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
  // Google Search Console egalikni shu teg orqali tasdiqlaydi.
  // Faqat tokenning o'zi turadi: Google bergan qatorda
  // "google-site-verification=" prefiksi ham bor, lekin u teg NOMI —
  // content ichiga tushsa tasdiqlash o'tmaydi.
  verification: {
    google: "QYVjxdNqH21Af-rF2UdeFJDHEGkn-QDtkYBzqJOOT6Y",
  },
};

// Qidiruv tizimlari uchun tuzilgan ma'lumot (JSON-LD) endi
// `lib/tuzilgan-malumot.js` da quriladi. Nega ko'chirildi: bu yerda
// tashkilot nomi va ta'rifi QO'LDA yozilgan edi, ya'ni sayt haqidagi
// ma'lumotning uchinchi nusxasi bo'lib turardi. Endi manba bitta —
// `lib/sayt-malumot.js` (AGENTS.md 1-band).

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Tashkilot, yaratuvchi va sayt tuguni — har sahifada. */}
        {/* eslint-disable-next-line react/no-danger */}
        <script {...ldJsonProps(saytGrafi())} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}