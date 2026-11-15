// lib/pdf-baytlar.js
//
// Node.js (server / test) va brauzer muhitlarida bir xil ishlaydigan
// shrift, rasm va QR-kod bayt yuklovchisi.

export async function yuklaPdfBaytlar(url) {
  if (!url || typeof url !== 'string') {
    throw new Error("PDF resurs manzili ko'rsatilmagan")
  }

  // Data URL (masalan QR-kod PNG)
  if (url.startsWith('data:')) {
    const [, base64 = ''] = url.split(',')
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(base64, 'base64'))
    }
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  }

  // Tashqi HTTP(S) manzil (masalan Vercel Blob muhr rasmi)
  if (/^https?:\/\//i.test(url)) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fayl yuklanmadi: ${url}`)
    return new Uint8Array(await res.arrayBuffer())
  }

  // Node.js (serverless API / test) muhitida public/ katalogidan o'qish
  if (typeof window === 'undefined') {
    const [{ readFileSync }, path] = await Promise.all([
      import(/* webpackIgnore: true */ 'node:fs'),
      import(/* webpackIgnore: true */ 'node:path'),
    ])
    const tozaUrl = url.replace(/^\/+/, '')
    const publicRoot = path.resolve(process.cwd(), 'public')
    const fullPath = path.resolve(publicRoot, tozaUrl)
    if (!fullPath.startsWith(publicRoot + path.sep) && fullPath !== publicRoot) {
      throw new Error(`Ruxsat etilmagan fayl yo'li: ${url}`)
    }
    return new Uint8Array(readFileSync(fullPath))
  }

  // Brauzer muhiti
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fayl topilmadi: ${url}`)
  return new Uint8Array(await res.arrayBuffer())
}
