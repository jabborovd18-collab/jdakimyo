import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import StatistikaOyini from './StatistikaOyini'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kalloid Kimyo amaliy — Live Statistika | JDA KIMYO',
  description: 'Mavsumiy ochiq dars uchun ustozlar jonli statistika ekrani.',
  robots: { index: false, follow: false },
}

export default async function KalloidKimyoAmaliySahifa() {
  const session = await getServerSession(authOptions)
  const kirgan = Boolean(session?.user?.id)
  const ustozRuxsati = kirgan && ustozPaneliOchiqmi(session.user)
  const ustozIsm = session?.user?.fullName || session?.user?.username || 'Ustoz'

  return (
    <StatistikaOyini
      kirgan={kirgan}
      ustozRuxsati={ustozRuxsati}
      ustozIsm={ustozIsm}
    />
  )
}
