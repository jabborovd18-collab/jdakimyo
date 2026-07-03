// app/admin/settings/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('general')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (res.ok) {
        setSettings(data.settings)
      }
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field, value) => {
    setSettings({ ...settings, [field]: value })
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 text-purple-300">
        <div className="animate-spin text-5xl mb-4">⏳</div>
        Sozlamalar yuklanmoqda...
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12 text-red-400">
        Sozlamalarni yuklashda xatolik
      </div>
    )
  }

  const sections = [
    { id: 'general', name: '🏠 Umumiy', icon: '🏠' },
    { id: 'maintenance', name: '🔧 Ta\'mirlash', icon: '🔧' },
    { id: 'gamification', name: '🎮 Gamification', icon: '🎮' },
    { id: 'quiz', name: '📝 Quiz', icon: '📝' },
    { id: 'social', name: '📱 Ijtimoiy', icon: '📱' },
    { id: 'contact', name: '📞 Kontakt', icon: '📞' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            ⚙️ Sayt Sozlamalari
            <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/50 rounded-full text-xs text-yellow-400 font-bold">
              👑 SUPER ADMIN
            </span>
          </h1>
          <p className="text-purple-300 mt-1">
            Platformani kodni o'zgartirmasdan boshqaring
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-2 sticky top-24">
            <nav className="space-y-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-purple-800/30 hover:text-white'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* ═══════════════════════════════════════ */}
          {/* UMUMIY SOZLAMALAR */}
          {/* ═══════════════════════════════════════ */}
          {activeSection === 'general' && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🏠</span> Umumiy Sozlamalar
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Sayt nomi *</label>
                  <input
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => updateField('siteName', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    placeholder="JDA KIMYO"
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Sayt tavsifi</label>
                  <textarea
                    value={settings.siteDescription || ''}
                    onChange={(e) => updateField('siteDescription', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    rows="2"
                    placeholder="Koordinatsion kimyo platformasi..."
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Logo URL</label>
                  <input
                    type="text"
                    value={settings.logo || ''}
                    onChange={(e) => updateField('logo', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Favicon URL</label>
                  <input
                    type="text"
                    value={settings.favicon || ''}
                    onChange={(e) => updateField('favicon', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    placeholder="https://.../favicon.ico"
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block">Footer matni</label>
                  <textarea
                    value={settings.footerText || ''}
                    onChange={(e) => updateField('footerText', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    rows="2"
                    placeholder="© 2026 JDA KIMYO • jdakimyo.uz"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* MAINTENANCE MODE */}
          {/* ═══════════════════════════════════════ */}
          {activeSection === 'maintenance' && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🔧</span> Ta'mirlash rejimi
              </h2>

              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="text-sm text-yellow-200">
                    <strong>Diqqat:</strong> Maintenance mode yoqilsa, barcha foydalanuvchilar (adminlardan tashqari) saytga kira olmaydi. Faqat texnik ishlar vaqtida yoqing!
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-purple-950/30 border border-purple-700/50 rounded-xl cursor-pointer hover:bg-purple-950/50">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode || false}
                    onChange={(e) => updateField('maintenanceMode', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">Maintenance Mode</div>
                    <div className="text-sm text-purple-400">Saytni vaqtincha yopish</div>
                  </div>
                  <div className={`w-14 h-7 rounded-full relative transition-all ${
                    settings.maintenanceMode ? 'bg-red-500' : 'bg-purple-800/50'
                  }`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${
                      settings.maintenanceMode ? 'translate-x-8' : 'translate-x-1'
                    }`} />
                  </div>
                </label>

                {settings.maintenanceMode && (
                  <div>
                    <label className="text-sm text-purple-300 mb-1 block">
                      Xabar (foydalanuvchilarga ko'rsatiladi)
                    </label>
                    <textarea
                      value={settings.maintenanceMessage || ''}
                      onChange={(e) => updateField('maintenanceMessage', e.target.value)}
                      className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                      rows="3"
                      placeholder="Sayt texnik ishlar sababli vaqtincha yopiq. Tez orada qayta ochiladi!"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* GAMIFICATION */}
          {/* ═══════════════════════════════════════ */}
          {activeSection === 'gamification' && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🎮</span> Gamification Sozlamalari
              </h2>

              <div className="space-y-4">
                <div className="bg-purple-950/30 border border-purple-700/30 rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-3">Yutuqlar uchun default XP</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">⚪ Oddiy</label>
                      <input
                        type="number"
                        value={settings.defaultXpCommon || 10}
                        onChange={(e) => updateField('defaultXpCommon', e.target.value)}
                        className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-blue-400 mb-1 block">🔵 Noyob</label>
                      <input
                        type="number"
                        value={settings.defaultXpRare || 50}
                        onChange={(e) => updateField('defaultXpRare', e.target.value)}
                        className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-purple-400 mb-1 block">🟣 Epik</label>
                      <input
                        type="number"
                        value={settings.defaultXpEpic || 100}
                        onChange={(e) => updateField('defaultXpEpic', e.target.value)}
                        className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-yellow-400 mb-1 block">🟡 Afsonaviy</label>
                      <input
                        type="number"
                        value={settings.defaultXpLegendary || 500}
                        onChange={(e) => updateField('defaultXpLegendary', e.target.value)}
                        className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* QUIZ SETTINGS */}
          {/* ═══════════════════════════════════════ */}
          {activeSection === 'quiz' && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📝</span> Quiz Sozlamalari
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">
                    Bir quizdagi savollar soni
                  </label>
                  <input
                    type="number"
                    value={settings.questionsPerQuiz || 20}
                    onChange={(e) => updateField('questionsPerQuiz', e.target.value)}
                    min="5"
                    max="50"
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                  />
                  <p className="text-xs text-purple-500 mt-1">
                    Maslahat: 15-25 savol eng optimal
                  </p>
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block">
                    Vaqt limiti (soniyalarda, 0 = cheksiz)
                  </label>
                  <input
                    type="number"
                    value={settings.quizTimeLimit || 0}
                    onChange={(e) => updateField('quizTimeLimit', e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                  />
                  <p className="text-xs text-purple-500 mt-1">
                    0 = cheksiz, 1800 = 30 daqiqa, 3600 = 1 soat
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* IJTIMOIY TARMOQLAR */}
          {/* ═══════════════════════════════════════ */}
          {activeSection === 'social' && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📱</span> Ijtimoiy tarmoqlar
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">✈️ Telegram guruh</label>
                  <input
                    type="text"
                    value={settings.telegramGroup || ''}
                    onChange={(e) => updateField('telegramGroup', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    placeholder="https://t.me/jdakimyo"
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block">📸 Instagram</label>
                  <input
                    type="text"
                    value={settings.instagramLink || ''}
                    onChange={(e) => updateField('instagramLink', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    placeholder="https://instagram.com/jdakimyo"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* KONTAKT */}
          {/* ═══════════════════════════════════════ */}
          {activeSection === 'contact' && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📞</span> Kontakt ma'lumotlari
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-300 mb-1 block">📧 Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail || ''}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    placeholder="info@jdakimyo.uz"
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-300 mb-1 block">📱 Telefon</label>
                  <input
                    type="tel"
                    value={settings.contactPhone || ''}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}