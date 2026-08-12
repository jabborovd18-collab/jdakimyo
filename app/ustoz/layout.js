// app/ustoz/layout.js
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import UstozShell from './UstozShell'

export const metadata = {
  title: "O'qituvchi paneli | JDA KIMYO",
  description: "Ustoz boshqaruv paneli: testlar yaratish, talabalar va natijalar tahlili",
  robots: { index: false, follow: false },
}

export default async function UstozLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login?callbackUrl=/ustoz')
  }

  if (!ustozPaneliOchiqmi(session.user)) {
    redirect('/')
  }

  return (
    <UstozShell user={session.user}>
      {children}
    </UstozShell>
  )
}
