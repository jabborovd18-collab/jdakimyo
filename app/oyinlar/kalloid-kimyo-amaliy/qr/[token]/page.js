import QrTestOyini from './QrTestOyini'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kalloid Kimyo amaliy — Shaxsiy QR test | JDA KIMYO',
  description: 'Ochiq dars ishtirokchisi uchun shaxsiy QR test oynasi.',
  robots: { index: false, follow: false },
}

export default async function KalloidQrTestSahifa({ params }) {
  const { token } = await params
  return <QrTestOyini token={decodeURIComponent(String(token || ''))} />
}
