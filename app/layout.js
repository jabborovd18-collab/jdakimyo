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
  // Google Search Console egalikni shu teg orqali tasdiqlaydi.
  // Faqat tokenning o'zi turadi: Google bergan qatorda
  // "google-site-verification=" prefiksi ham bor, lekin u teg NOMI —
  // content ichiga tushsa tasdiqlash o'tmaydi.
  verification: {
    google: "QYVjxdNqH21Af-rF2UdeFJDHEGkn-QDtkYBzqJOOT6Y",
  },
};

// Qidiruv tizimlari uchun tuzilgan ma'lumot (JSON-LD).
//
// NEGA KERAK. Meta teglar sahifa NIMA HAQIDA ekanini aytadi, JSON-LD
// esa sayt KIM ekanini: nomi, egasi, logotipi. Busiz Google natijada
// sayt nomi o'rniga domenni ko'rsatadi va bilim panelini qurmaydi.
//
// NEGA `SearchAction` YO'Q. U saytdagi qidiruvni to'g'ridan-to'g'ri
// Google natijasiga chiqaradi, lekin `/qidiruv` manzil parametrini
// (`?q=`) o'qimaydi — so'rovni holatda saqlaydi. Ishlamaydigan
// harakatni e'lon qilish yo'q deyishdan yomonroq: Google uni sinab
// ko'radi va bo'sh sahifa oladi. Qidiruv `?q=` ni qo'llagan kuni
// qo'shiladi.
const TUZILGAN_MALUMOT = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://www.jdakimyo.uz/#tashkilot',
      name: 'JDA KIMYO',
      url: 'https://www.jdakimyo.uz',
      logo: 'https://www.jdakimyo.uz/opengraph-image',
      description:
        "O'zbek tilida kompleks birikmalar kimyosini o'rganish platformasi.",
      inLanguage: 'uz',
      founder: {
        '@type': 'Person',
        name: 'Diyorbek Jabborov Arslonivich',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.jdakimyo.uz/#sayt',
      url: 'https://www.jdakimyo.uz',
      name: 'JDA KIMYO',
      inLanguage: 'uz',
      publisher: { '@id': 'https://www.jdakimyo.uz/#tashkilot' },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        {/* `dangerouslySetInnerHTML` shart: JSON-LD matn bo'lib turishi
            kerak, React uni matn tuguni sifatida qochirib yuborsa
            qidiruv tizimi o'qiy olmaydi. Ichidagi qiymat bu yerda
            qattiq yozilgan, ya'ni tashqaridan hech narsa tushmaydi. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(TUZILGAN_MALUMOT) }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}