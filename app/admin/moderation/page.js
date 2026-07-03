// app/admin/moderation/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'spam', name: '🗑️ Spam', color: 'gray' },
  { id: 'harassment', name: '😤 Tazyiq', color: 'red' },
  { id: 'inappropriate', name: '🚫 Nojo\'ya', color: 'orange' },
  { id: 'cheating', name: '🎭 Firibgarlik', color: 'purple' },
  { id: 'other', name: '📦 Boshqa', color: 'blue' }
]

const PRIORITIES = [
  { id: 'low', name: 'Past', color: 'gray' },
  { id: 'medium', name: "O'rta", color: 'yellow' },
  { id: 'high', name: 'Yuqori', color: 'orange' },
  { id: 'urgent', name: 'Zarur', color: 'red' }
]

const STATUSES = [
  { id: 'pending', name: '⏳ Kutilmoqda', color: 'yellow' },
  { id: 'reviewed', name: '👁️ Ko\'rib chiqilgan', color: 'blue' },
  { id: 'resolved', name: '✅ Hal qilingan', color: 'green' },
  { id: 'dismissed', name: '❌ Rad etilgan', color: 'gray' }
]

export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState('reports') // reports, banned, logs
  const [reports, setReports] = useState([])
  const [bannedUsers, setBannedUsers] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('pending')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // Resolve modal
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [resolution, setResolution] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (activeTab === 'reports') fetchReports()
    else if (activeTab === 'banned') fetchBanned()
    else if (activeTab === 'logs') fetchLogs()
  }, [activeTab, statusFilter, priorityFilter, categoryFilter])

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter
      })
      const res = await fetch(`/api/admin/moderation/reports?${params}`)
      const data = await res.json()
      if (res.ok) {
        setReports(data.reports)
        setStats(data.stats)
      }
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBanned = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/moderation/banned')
      const data = await res.json()
      if (res.ok) setBannedUsers(data.users)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/moderation/logs')
      const data = await res.json()
      if (res.ok) setAuditLogs(data.logs)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolve = async (action) => {
    if (!selectedReport) return
    setIsProcessing(true)
    try {
      const res = await fetch('/api/admin/moderation/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: selectedReport.id,
          action,
          resolution: action === 'resolve' ? resolution : null
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setShowResolveModal(false)
      setSelectedReport(null)
      setResolution('')
      fetchReports()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnban = async (userId, username) => {
    if (!confirm(`"${username}" ni ochmoqchimisiz?`)) return
    try {
      const res = await fetch('/api/admin/moderation/banned', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchBanned()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString('uz-UZ', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const getPriorityBadge = (priority) => {
    const p = PRIORITIES.find(p => p.id === priority)
    if (!p) return 'bg-gray-600/20 text-gray-400'
    return `bg-${p.color}-600/20 text-${p.color}-400 border-${p.color}-600/30`
  }

  const getCategoryBadge = (category) => {
    const c = CATEGORIES.find(c => c.id === category)
    if (!c) return 'bg-gray-600/20 text-gray-400'
    return `bg-${c.color}-600/20 text-${c.color}-400 border-${c.color}-600/30`
  }

  const tabs = [
    { id: 'reports', name: '📋 Reportlar', count: stats.pending || 0 },
    { id: 'banned', name: '🚫 Bloklangan', count: bannedUsers.length || 0 },
    { id: 'logs', name: '📊 Audit Log' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            🛡️ Moderatsiya
            {stats.pending > 0 && (
              <span className="px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full text-sm text-red-400 font-bold animate-pulse">
                {stats.pending} kutilmoqda
              </span>
            )}
          </h1>
          <p className="text-purple-300 mt-1">Platforma xavfsizligi va qoidalarga rioya qilish</p>
        </div>
      </div>

      {/* Stats */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-xl">⏳</div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{stats.pending || 0}</div>
                <div className="text-xs text-yellow-300/70">Kutilmoqda</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-xl">🚨</div>
              <div>
                <div className="text-2xl font-bold text-red-400">{stats.urgent || 0}</div>
                <div className="text-xs text-red-300/70">Zarur</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">📅</div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{stats.todayReports || 0}</div>
                <div className="text-xs text-blue-300/70">Bugun</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-xl">✅</div>
              <div>
                <div className="text-2xl font-bold text-green-400">{stats.resolved || 0}</div>
                <div className="text-xs text-green-300/70">Hal qilingan</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-2">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/50'
              }`}
            >
              <span>{tab.name}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-purple-600/30'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters (Reports tab) */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
            >
              <option value="all">Barcha holatlar</option>
              {STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
            >
              <option value="all">Barcha ustuvorliklar</option>
              {PRIORITIES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
            >
              <option value="all">Barcha kategoriyalar</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-300">⏳ Yuklanmoqda...</div>
      ) : (
        <>
          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 border border-purple-800/50 rounded-xl">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-white mb-2">Reportlar yo'q!</h3>
                  <p className="text-purple-300">Hamma narsa tinch va osoyishta</p>
                </div>
              ) : (
                reports.map(report => (
                  <div
                    key={report.id}
                    className={`bg-slate-900/50 border rounded-xl p-5 hover:border-purple-600/50 transition-all ${
                      report.priority === 'urgent' ? 'border-red-600/50' :
                      report.priority === 'high' ? 'border-orange-600/50' :
                      'border-purple-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl flex-shrink-0">
                        🚨
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityBadge(report.priority)}`}>
                            {PRIORITIES.find(p => p.id === report.priority)?.name}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getCategoryBadge(report.category)}`}>
                            {CATEGORIES.find(c => c.id === report.category)?.name}
                          </span>
                          <span className="text-xs text-purple-400">
                            {formatDate(report.createdAt)}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm text-purple-300 mb-1">
                            <span className="text-purple-400">Reporter:</span> {report.reporter.fullName || report.reporter.username}
                          </div>
                          <div className="text-sm text-red-300">
                            <span className="text-red-400">Target:</span>{' '}
                            <Link href={`/profil/${report.target.userId}`} className="text-yellow-400 hover:underline">
                              {report.target.fullName || report.target.username}
                            </Link>
                            {report.target.isBanned && (
                              <span className="ml-2 text-xs text-red-400">(bloklangan)</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-purple-950/50 rounded-lg p-3 mb-3">
                          <div className="text-sm text-purple-200">{report.reason}</div>
                        </div>

                        {report.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setSelectedReport(report); setShowResolveModal(true) }}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white text-sm font-semibold rounded-lg"
                            >
                              ✅ Hal qilish
                            </button>
                            <button
                              onClick={() => handleResolve('dismiss')}
                              className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 text-purple-300 text-sm rounded-lg"
                            >
                              ❌ Rad etish
                            </button>
                            <Link
                              href={`/profil/${report.target.userId}`}
                              className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 text-blue-400 text-sm rounded-lg"
                            >
                              👁️ Profilni ko'rish
                            </Link>
                          </div>
                        )}

                        {report.status !== 'pending' && (
                          <div className="text-xs text-purple-400">
                            ✓ {report.status} • {formatDate(report.reviewedAt)}
                            {report.resolution && (
                              <span className="ml-2 text-purple-300">| {report.resolution}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* BANNED TAB */}
          {activeTab === 'banned' && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl overflow-hidden">
              {bannedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-white mb-2">Bloklangan foydalanuvchilar yo'q</h3>
                  <p className="text-purple-300">Platformada hammasi joyida</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-950/50 border-b border-purple-800/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-purple-300">Foydalanuvchi</th>
                        <th className="text-left p-4 text-sm font-semibold text-purple-300">Sabab</th>
                        <th className="text-left p-4 text-sm font-semibold text-purple-300">Sana</th>
                        <th className="text-left p-4 text-sm font-semibold text-purple-300">Statistika</th>
                        <th className="text-right p-4 text-sm font-semibold text-purple-300">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bannedUsers.map(user => (
                        <tr key={user.id} className="border-b border-purple-800/30 hover:bg-purple-950/30">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                                {user.avatar ? (
                                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{user.fullName || user.username}</div>
                                <div className="text-xs text-purple-400">@{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-red-300 max-w-xs truncate">
                              {user.bannedReason || 'Sabab ko\'rsatilmagan'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-purple-300">{formatDate(user.bannedAt)}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-3 text-xs">
                              <span className="text-purple-400">📝 {user._count.quizResults}</span>
                              <span className="text-purple-400">🏆 {user._count.achievements}</span>
                              <span className="text-red-400">🚨 {user._count.reportsReceived}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/profil/${user.userId}`}
                                className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400"
                              >
                                👁️
                              </Link>
                              <button
                                onClick={() => handleUnban(user.id, user.username)}
                                className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-xs text-green-400"
                              >
                                🔓 Ochish
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl overflow-hidden">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-white mb-2">Audit loglar yo'q</h3>
                  <p className="text-purple-300">Hali hech qanday admin harakati qayd etilmagan</p>
                </div>
              ) : (
                <div className="divide-y divide-purple-800/30">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-4 hover:bg-purple-950/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-800/50 flex items-center justify-center text-sm flex-shrink-0">
                          {log.action.includes('ban') ? '🚫' :
                           log.action.includes('unban') ? '🔓' :
                           log.action.includes('report') ? '📋' :
                           log.action.includes('role') ? '🎭' : '⚙️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold text-white">{log.action}</span>
                            <span className="text-xs text-purple-400">
                              by {log.admin.fullName || log.admin.username}
                            </span>
                          </div>
                          {log.details && (
                            <div className="text-xs text-purple-300 mb-1">{log.details}</div>
                          )}
                          <div className="text-xs text-purple-500">{formatDate(log.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* RESOLVE MODAL */}
      {showResolveModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              ✅ Reportni hal qilish
            </h3>

            <div className="bg-purple-950/50 rounded-lg p-4 mb-4">
              <div className="text-sm text-purple-300 mb-2">
                <strong>Reporter:</strong> {selectedReport.reporter.fullName || selectedReport.reporter.username}
              </div>
              <div className="text-sm text-purple-300 mb-2">
                <strong>Target:</strong> {selectedReport.target.fullName || selectedReport.target.username}
              </div>
              <div className="text-sm text-purple-200 mt-3 p-2 bg-purple-900/30 rounded">
                "{selectedReport.reason}"
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-purple-300 mb-2 block">Qaror tafsiloti (ixtiyoriy):</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                rows="3"
                placeholder="Nima uchun bu qaror qabul qilindi..."
              />
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4">
              <div className="text-xs text-yellow-300">
                💡 <strong>Maslahat:</strong> Reportni hal qilishdan oldin target profilini ko'rib chiqing va kerak bo'lsa, foydalanuvchini bloklash haqida o'ylang.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowResolveModal(false); setSelectedReport(null) }}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleResolve('resolve')}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {isProcessing ? '⏳...' : '✓ Hal qilish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}