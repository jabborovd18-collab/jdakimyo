// app/admin/layout.js
import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin-auth'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = {
  title: 'Admin Panel — JDA KIMYO',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }) {
  const { authenticated, isAdmin, huquq, user } = await checkAdminAuth()

  if (!authenticated) {
    redirect('/login?callbackUrl=/admin')
  }

  if (!isAdmin || !user) {
    redirect('/')
  }

  return (
    <AdminShell
      user={{
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      }}
      huquq={huquq}
    >
      {children}
    </AdminShell>
  )
}
