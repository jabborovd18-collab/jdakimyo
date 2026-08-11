/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /birikmalar HECH QACHON ishlamagan: sahifa `/api/compounds` dan
      // ma'lumot so'rardi, lekin bunday API yozilmagan va `Compound`
      // jadvali bo'sh. Ya'ni ziyoratchi doim bo'sh ro'yxat ko'rardi,
      // sitemap esa uni 0.9 muhimlik bilan Google'ga taklif qilardi.
      //
      // Haqiqiy katalog — /ilmiy/birikmalar: 34 ta to'ldirilgan sahifa,
      // har biri o'z sarlavhasi bilan. Shu yerga yo'naltiramiz.
      //
      // `permanent: true` — Next.js buni 308 bilan qaytaradi (301 emas,
      // farqi: 308 so'rov usulini saqlaydi). Qidiruv tizimlari uchun
      // ikkisi bir xil: eski manzil ro'yxatdan o'chadi va vazni
      // yangisiga o'tadi. Vaqtinchalik (307/302) bo'lsa Google eskisini
      // saqlab qolardi.
      {
        source: '/birikmalar',
        destination: '/ilmiy/birikmalar',
        permanent: true,
      },
      // Ichki sahifalar ham. Bazasi bo'sh bo'lgani uchun bu manzillar
      // hech qachon mavjud bo'lmagan — hammasi katalogga boradi.
      {
        source: '/birikmalar/:id',
        destination: '/ilmiy/birikmalar',
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
    ]
  },
  async headers() {
    return [
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
