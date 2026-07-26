import ActivityHeatmap from '@/components/ActivityHeatmap'

export default function FaoliyatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Faoliyat</h1>
        <p className="mt-1 text-purple-300">O'qish va testlardagi kunlik faolligingiz.</p>
      </div>
      <ActivityHeatmap />
    </div>
  )
}
