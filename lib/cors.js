// lib/cors.js
// CORS sarlavhalari next.config.mjs da berilgan, lekin App Router'da
// OPTIONS (preflight) so'rovi uchun route'da handler bo'lmasa 405 qaytadi.
// Shu sababli har bir /api/mobile/* route shu handler'ni eksport qiladi.
export function OPTIONS() {
  return new Response(null, { status: 204 })
}
