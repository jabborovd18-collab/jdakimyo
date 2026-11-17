import fs from 'node:fs/promises'
import path from 'node:path'
import QRCode from 'qrcode'
import { chromium as playwrightChromium } from 'playwright-core'
import { KALLOID_STANDART_TALABALAR, KALLOID_DARS_SLUG } from '../lib/oyinlar/kalloid-amaliy-server.js'
import { DOMEN } from '../lib/sayt-malumot.js'

function htmlQochir(matn) {
  return String(matn ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function faylBormi(manzil) {
  if (!manzil) return false
  try {
    await fs.access(manzil)
    return true
  } catch {
    return false
  }
}

async function mahalliyChromiumYoli() {
  const nomzodlar = [
    process.env.PDF_CHROMIUM_PATH,
    path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    playwrightChromium.executablePath(),
  ].filter(Boolean)

  for (const nomzod of nomzodlar) {
    if (await faylBormi(nomzod)) return nomzod
  }
  throw new Error('Mahalliy Chrome yoki Edge topilmadi.')
}

async function main() {
  const tayyorTalabalar = await Promise.all(
    KALLOID_STANDART_TALABALAR.map(async (t) => {
      const qrHavola = `${DOMEN}/oyinlar/${KALLOID_DARS_SLUG}/qr/${t.qrToken}`
      const qrSvg = await QRCode.toString(qrHavola, {
        type: 'svg',
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#0b101d',
          light: '#ffffff',
        },
      })
      const qrDataUrl = `data:image/svg+xml;base64,${Buffer.from(qrSvg).toString('base64')}`
      return {
        ...t,
        qrHavola,
        qrDataUrl,
      }
    }),
  )

  const sahifalar = []
  for (let i = 0; i < tayyorTalabalar.length; i += 8) {
    sahifalar.push(tayyorTalabalar.slice(i, i + 8))
  }

  const sahifalarHtml = sahifalar
    .map((bolak, sahifaIndeks) => {
      const kataklar = Array.from({ length: 8 }, (_, kIdx) => {
        const x = bolak[kIdx]
        if (!x) {
          return `<article class="card empty-card" aria-hidden="true"></article>`
        }
        return `
          <article class="card">
            <div class="card-top">
              <div class="badge">#${String(x.tartib).padStart(2, '0')} · KALLOID KIMYO AMALIY</div>
              <div class="student-name">${htmlQochir(x.ism)}</div>
            </div>
            <div class="qr-box">
              <img src="${x.qrDataUrl}" alt="${htmlQochir(x.ism)}" />
            </div>
            <div class="card-bottom">
              <span class="hint">Skanerlang · 20 ta savol · 10 daqiqa</span>
            </div>
          </article>
        `
      }).join('')

      return `<section class="a4-page" id="sahifa-${sahifaIndeks + 1}">${kataklar}</section>`
    })
    .join('\n')

  const html = `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8" />
<title>Kalloid Kimyo amaliy — Shaxsiy QR kartochkalar (25 talaba)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 210mm;
    background: #ffffff;
    color: #0f172a;
    font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .a4-page {
    width: 210mm;
    height: 297mm;
    padding: 8mm;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 4mm;
    background: #ffffff;
    page-break-after: always;
    break-after: page;
  }
  .a4-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  .card {
    border: 1.6px dashed #475569;
    border-radius: 10px;
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    background: #ffffff;
    overflow: hidden;
  }
  .empty-card {
    border-color: #e2e8f0;
  }
  .card-top {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .badge {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: #0284c7;
    text-transform: uppercase;
  }
  .student-name {
    font-size: 16.5px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.18;
    padding: 1px 4px;
    border-bottom: 1.5px solid #e2e8f0;
    width: 94%;
  }
  .qr-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
  }
  .qr-box img {
    width: 39mm;
    height: 39mm;
    display: block;
  }
  .card-bottom {
    width: 100%;
  }
  .hint {
    font-size: 9.5px;
    font-weight: 600;
    color: #475569;
  }
</style>
</head>
<body>
${sahifalarHtml}
</body>
</html>`

  const execPath = await mahalliyChromiumYoli()
  const browser = await playwrightChromium.launch({
    executablePath: execPath,
    headless: true,
  })

  try {
    const page = await browser.newPage({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: 2,
    })
    await page.setContent(html, { waitUntil: 'networkidle' })

    const pdfBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    })

    const publicDir = path.join('D:\\Projects\\jda-kimyo', 'public', 'oyinlar', 'kalloid-kimyo-amaliy')
    const desktopDir = 'C:\\Users\\MixCom\\Desktop\\jda-kimyo'
    const slaydDir = 'D:\\Desktop\\KK-slayd'
    await fs.mkdir(publicDir, { recursive: true })
    await fs.mkdir(desktopDir, { recursive: true })
    await fs.mkdir(slaydDir, { recursive: true })

    const pdfPublicPath = path.join(publicDir, 'kalloid-kimyo-qr-kartochkalar.pdf')
    const pdfDesktopPath = path.join(desktopDir, 'kalloid-kimyo-qr-kartochkalar.pdf')
    const pdfSlaydPath = path.join(slaydDir, 'kalloid-kimyo-qr-kartochkalar.pdf')

    await fs.writeFile(pdfPublicPath, pdfBytes)
    await fs.writeFile(pdfDesktopPath, pdfBytes)
    await fs.writeFile(pdfSlaydPath, pdfBytes)

    for (let i = 0; i < sahifalar.length; i += 1) {
      const locator = page.locator(`#sahifa-${i + 1}`)
      const pngBytes = await locator.screenshot({ type: 'png' })
      const pngPublicPath = path.join(publicDir, `kalloid-qr-a4-${i + 1}-sahifa.png`)
      const pngDesktopPath = path.join(desktopDir, `kalloid-qr-a4-${i + 1}-sahifa.png`)
      const pngSlaydPath = path.join(slaydDir, `kalloid-qr-a4-${i + 1}-sahifa.png`)
      await fs.writeFile(pngPublicPath, pngBytes)
      await fs.writeFile(pngDesktopPath, pngBytes)
      await fs.writeFile(pngSlaydPath, pngBytes)
    }

    console.log('PDF va 4 ta A4 rasm muvaffaqiyatli yaratildi!')
    console.log('PDF (Desktop):', pdfDesktopPath)
    console.log('PDF (Public):', pdfPublicPath)
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
