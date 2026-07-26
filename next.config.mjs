/** @type {import('next').NextConfig} */
const nextConfig = {
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
