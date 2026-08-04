// lib/og-maket.jsx
//
// Havola ulashilganda ko'rinadigan rasmning maketi.
//
// NEGA KERAK EDI. Saytda `og:image` UMUMAN yo'q edi, lekin
// `twitter:card = summary_large_image` turardi — ya'ni katta rasm
// va'da qilinib, hech narsa berilmasdi. Telegramga tashlangan har
// bir jdakimyo.uz havolasi quruq matn bo'lib chiqardi, holbuki
// O'zbekistonda havola aynan Telegramda tarqaladi.
//
// NEGA CHIZILADI, TAYYOR PNG EMAS. Rasm sahifaga qarab o'zgarishi
// kerak (sarlavha har xil). Tayyor rasm bo'lsa, har sahifa uchun
// qo'lda chizishga to'g'ri kelardi va birinchi sarlavha
// o'zgarishidayoq eskirardi.
//
// DIQQAT: bu yerda to'liq CSS ishlamaydi. Rasmni satori chizadi va u
// faqat flexbox'ni tushunadi — `display: grid`, `position: absolute`
// bilan murakkab joylashuv va ko'p CSS xossasi e'tiborsiz qoladi.
// Bir nechta bolasi bor har bir `div` ga `display: flex` YOZILISHI
// SHART, aks holda chizish xato bilan tugaydi.

export const OG_OLCHAM = { width: 1200, height: 630 }

/**
 * @param {object} p
 * @param {string} p.sarlavha Katta yozuv
 * @param {string} [p.tavsif] Ostidagi qator
 */
export function OgMaket({ sarlavha, tavsif }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // Gradient — brend rangi. Telegram rasmni kichraytirib
        // ko'rsatadi, shuning uchun fon sodda va to'q: matn ustida
        // aniq o'qilsin.
        backgroundColor: '#1a1030',
        backgroundImage:
          'linear-gradient(135deg, #2e1065 0%, #1a1030 55%, #0f0a1e 100%)',
        padding: '64px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Yuqori qator: brend */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: '#fbbf24',
            color: '#2e1065',
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          JDA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#ffffff' }}>
            JDA KIMYO
          </div>
          <div style={{ fontSize: 20, color: '#a78bfa' }}>jdakimyo.uz</div>
        </div>
      </div>

      {/* O'rta: sahifa sarlavhasi */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: sarlavha.length > 46 ? 56 : 68,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.15,
          }}
        >
          {sarlavha}
        </div>
        {tavsif ? (
          <div
            style={{
              fontSize: 28,
              color: '#c4b5fd',
              marginTop: 22,
              lineHeight: 1.35,
            }}
          >
            {tavsif}
          </div>
        ) : null}
      </div>

      {/* Pastki qator: koordinatsion tugun — oktaedr ishorasi.
          Rasm emas, oddiy doiralar: tashqi fayl yuklash satori'da
          ishonchsiz va build'ni sekinlashtiradi.

          OLTITA ligand, beshta emas: oktaedrik komplekste markaziy
          atom atrofida aynan olti ligand turadi. Kimyo saytida
          noto'g'ri sanoq bilan rasm tarqatish yaramaydi.

          Yozuv sarlavhani TAKRORLAMAYDI — u sahifadan sahifaga
          o'zgaradi, bu qator esa doim bir xil. */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: '#fbbf24',
          }}
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: '#7c3aed',
              marginLeft: 14,
            }}
          />
        ))}
        <div
          style={{
            display: 'flex',
            marginLeft: 28,
            fontSize: 22,
            color: '#8b7cb8',
          }}
        >
          Oktaedrik kompleks: markaziy atom va olti ligand
        </div>
      </div>
    </div>
  )
}
