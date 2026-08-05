// app/profil/telegram/page.js
//
// Telegramni ulash uchun alohida sahifa.
//
// NEGA ALOHIDA SAHIFA KERAK. Bot xabarida havola beriladi va u
// bosilganda odam TO'G'RIDAN-TO'G'RI ulash joyiga tushishi kerak.
// Sozlamalar sahifasi katta va Telegram bo'limi uning pastida —
// odam uni qidirib topishi kerak bo'lardi. Manzil ham qisqa
// (`/profil/telegram`), ya'ni bot matnida aytish oson.
//
// NEGA SERVER KOMPONENTI. `?kod=` ni o'qish uchun `useSearchParams`
// ishlatilsa, Next.js butun daraxtni Suspense bilan o'rashni talab
// qiladi. Server komponenti buni bir qatorda hal qiladi va kod
// mijozga tayyor holda beriladi.
import Link from 'next/link'
import TelegramUlash from '@/components/TelegramUlash'

export const metadata = {
  title: 'Telegramni ulash — JDA KIMYO',
  description:
    'JDA KIMYO hisobingizni Telegram botga ulang va bildirishnomalarni telefoningizda oling.',
  // Shaxsiy sahifa — qidiruv tizimiga kerak emas
  robots: { index: false, follow: false },
}

export default async function TelegramSahifa({ searchParams }) {
  const sp = await searchParams
  // Kod faqat harf va raqamdan iborat. Boshqa narsa kelsa, uni
  // maydonga qo'ymaymiz — manzilga istalgan matn yozib yuborish
  // mumkin va u ekranda ko'rinardi.
  const xom = String(sp?.kod || '').toUpperCase()
  const kod = /^[A-Z0-9]{4,8}$/.test(xom) ? xom : ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1030] to-[#0f0a1e] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/profil/sozlama"
          className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
        >
          ← Sozlamalar
        </Link>

        <h1 className="text-2xl font-bold text-white mt-4 mb-1">
          Telegramni ulash
        </h1>
        <p className="text-sm text-purple-300 mb-6">
          Bildirishnomalar telefoningizga kelib turadi — do'stlik so'rovi,
          ustoz taklifi, vazifa va sovg'a.
        </p>

        {kod ? (
          <div className="mb-4 bg-green-950/30 border border-green-700/40 rounded-xl p-3 text-sm text-green-300">
            Botdan kelgan kod tayyor. <b>Ulash</b> tugmasini bosing.
          </div>
        ) : null}

        <div className="bg-purple-900/20 border border-purple-800/40 rounded-2xl p-5">
          <TelegramUlash boshlangichKod={kod} mustaqil />
        </div>
      </div>
    </div>
  )
}
