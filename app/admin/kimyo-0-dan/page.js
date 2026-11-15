import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin-auth'
import KursBoshqaruvi from './KursBoshqaruvi'

export default async function KimyoKursAdminSahifa() {
  const { isAdmin } = await checkAdminAuth('kontent')
  if (!isAdmin) redirect('/admin')
  return <KursBoshqaruvi />
}
