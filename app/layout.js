import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
    default: "JDA KIMYO — Kompleks birikmalar kimyosi",
    template: "%s | JDA KIMYO",
  },
  description:
    "O'zbek tilida kompleks birikmalarni o'rganish platformasi. IUPAC nomlanishi, izomeriya, fazoviy tuzilish, video darsliklar va testlar.",
  keywords: [
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
  metadataBase: new URL("https://jdakimyo.uz"),
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://jdakimyo.uz",
    siteName: "JDA KIMYO",
    title: "JDA KIMYO — Kompleks birikmalar kimyosi",
    description:
      "O'zbek tilida kompleks birikmalarni o'rganish platformasi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JDA KIMYO — Kompleks birikmalar kimyosi",
    description:
      "O'zbek tilida kompleks birikmalarni o'rganish platformasi.",
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}