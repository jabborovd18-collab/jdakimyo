import StarsDisplay from '@/components/StarsDisplay'

export default function ReytingimPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-white">Reytingim</h1><p className="mt-1 text-purple-300">Haftalik yulduzlar bo‘yicha umumiy reyting.</p></div>
      <StarsDisplay />
    </div>
  )
}
