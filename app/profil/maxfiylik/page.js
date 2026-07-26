import PrivacySettings from '@/components/PrivacySettings'

export default function MaxfiylikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Maxfiylik</h1>
        <p className="mt-1 text-purple-300">Profilingizdagi ma'lumotlar kimga ko'rinishini belgilang.</p>
      </div>
      <PrivacySettings />
    </div>
  )
}
