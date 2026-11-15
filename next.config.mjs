/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    // @sparticuz/chromium binary fayllarni fs orqali topadi; statik tracer bu
    // yo'lni ko'rmaydi, shuning uchun faqat PDF functionga aniq qo'shamiz.
    '/api/masala/pdf': ['./node_modules/@sparticuz/chromium/bin/**/*'],
    // Sertifikat PDF va Telegram bot shriftlar hamda hamkorlik rasmlarini fs orqali o'qiydi
    '/api/sertifikat/[certId]/pdf': [
      './public/fonts/**/*',
      './public/images/hamkorlik/**/*',
    ],
    '/api/telegram/webhook': [
      './public/fonts/**/*',
      './public/images/hamkorlik/**/*',
    ],
    '/api/admin/milliy-sertifikat': [
      './public/fonts/**/*',
      './public/images/hamkorlik/**/*',
    ],
    '/api/admin/certificates': [
      './public/fonts/**/*',
      './public/images/hamkorlik/**/*',
    ],
    '/api/admin/mavsumiyhamkor': [
      './public/fonts/**/*',
      './public/images/hamkorlik/**/*',
    ],
  },
  async redirects() {
    return [
      // /oquv va /ilmiy v4 da butunlay olib tashlangan.
      //
      // Yo'naltirish MAJBURIY va DOIMIY qoladi: eski manzillar bildirishnomalar
      // va chat xabarlarida MATN sifatida saqlangan va Google indeksida turibdi.
      // Tartib muhim: aniq manzillar umumiy qoidadan oldin turishi shart.
      {
        source: '/oquv/video-darsliklar/ustoz-quiz/:id',
        destination: '/testlar/ustoz/:id',
        permanent: true,
      },
      {
        source: '/oquv/video-darsliklar/ustoz-quiz',
        destination: '/testlar/ustoz',
        permanent: true,
      },
      {
        source: '/oquv/video-darsliklar/ustoz-yopiq-quiz/:id',
        destination: '/testlar/yozma/:id',
        permanent: true,
      },
      {
        source: '/oquv/video-darsliklar/ustoz-yopiq-quiz',
        destination: '/testlar/yozma',
        permanent: true,
      },
      {
        source: '/oquv/video-darsliklar/:path*',
        destination: '/testlar',
        permanent: true,
      },
      {
        source: '/oquv/:path*',
        destination: '/maktabkimyo',
        permanent: true,
      },
      {
        source: '/ilmiy/maqolalar/muhokama/:id',
        destination: '/dolzarb/:id',
        permanent: true,
      },
      {
        source: '/ilmiy/maqolalar/muhokama',
        destination: '/dolzarb',
        permanent: true,
      },
      {
        source: '/ilmiy/:path*',
        destination: '/oliykimyo',
        permanent: true,
      },
      {
        source: '/birikmalar/:path*',
        destination: '/oliykimyo',
        permanent: true,
      },
      {
        source: '/laboratoriya/3d/:path*',
        destination: '/laboratoriya',
        permanent: true,
      },
      // Chat kabinetdan chiqib, o'z bo'limiga (/chat) o'tdi.
      //
      // Yo'naltirish MAJBURIY va DOIMIY qoladi: bildirishnomalar
      // jadvalidagi `havola` ustunida `/profil/chat?suhbat=...` MATN
      // sifatida saqlangan. Ular yozilgan paytdagi manzilni bilishadi
      // va ularni qayta yozib bo'lmaydi — bazada yuzlab yozuv bor.
      // So'rov parametrlari (`?suhbat=`) Next.js tomonidan o'zi
      // saqlanadi.
      {
        source: '/profil/chat',
        destination: '/chat',
        permanent: true,
      },
      {
        source: '/hamkorlik/sea-ms-sinov',
        destination: '/sea-ms-sinov',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          // Kamera faqat o'z domenimizda (/doska/skaner QR skaneri uchun) ruxsat etiladi
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
        ],
      },
      {
        // *.vercel.app — SAYTNING UCHINCHI NUSXASI.
        //
        // `jdakimyo.vercel.app` production domeni ham xuddi shu 700
        // sahifani 200 bilan qaytaradi. Ya'ni Google uchun sayt uch
        // xil hostda turibdi: apex, www va vercel.app. Kraul byudjeti
        // uchga bo'linadi, holbuki Search Console'da 101 sahifa
        // "topilgan, lekin indekslanmagan" bo'lib turibdi — ya'ni
        // byudjet allaqachon yetishmayapti.
        //
        // Canonical teg www ga ishora qiladi va bu takroriy hujjatdan
        // saqlaydi, LEKIN u sahifa YUKLANGANDAN keyin o'qiladi: robot
        // baribir har bir manzilni so'raydi. `X-Robots-Tag` esa
        // sarlavhada keladi — robot sahifani ochmasdanoq indeksga
        // olmasligini biladi.
        //
        // Preview deploylari ham shu qoidaga tushadi va bu ATAYLAB:
        // tugallanmagan sahifa qidiruvga chiqmasligi kerak.
        source: '/:path*',
        has: [{ type: 'host', value: '.*\.vercel\.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        // Mobil ilova (Expo) saytdan boshqa origin'da ishlaydi, shuning uchun
        // /api/mobile/* uchun CORS ochiladi.
        //
        // Bu xavfsiz, chunki bu endpointlar FAQAT "Authorization: Bearer"
        // tokeni bilan ishlaydi — cookie ishlatilmaydi. Ya'ni brauzer
        // so'rovga avtomatik hech qanday maxfiy ma'lumot qo'shmaydi va
        // CSRF xavfi yo'q. Cookie sessiyasidagi qolgan /api/* yo'llari
        // ataylab ochilmagan.
        source: '/api/mobile/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ]
  },
};

export default nextConfig;
