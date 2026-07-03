// app/admin/logs/page.js
"use client"
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const ACTION_ICONS = {
  'ban_user': '🚫',
  'unban_user': '🔓',
  'change_role': '🎭',
  'resolve_report': '✅',
  'dismiss_report': '❌',
  'update_settings': '⚙️',
  'cleanup_logs': '🧹',
  'create_quiz': '📝',
  'delete_quiz': '🗑️',
  'create_compound': '🧪',
  'delete_compound': '🗑️',
  'create_mission': '🎯',
  'create_achievement': '🏆',
  'award_achievement': '🎁',
  'default': '📋'
}

const ACTION_COLORS = {
  'ban': 'text-red-400 bg-red-600/20 border-red-600/30',
  'unban': 'text-green-400 bg-green-600/20 border-green-600/30',
  'delete': 'text-red-400 bg-red-600/20 border-red-600/30',
  'create': 'text-green-400 bg-green-600/20 border-green-600/30',
  'update': 'text-blue-400 bg-blue-600/20 border-blue-600/30',
  'change': 'text-yellow-400 bg-yellow-600/20 border-yellow-600/30',
  'award': 'text-purple-400 bg-purple-600/20 border-purple-600/30',
  'resolve': 'text-green-400 bg-green-600/20 border-green-600/30',
  'dismiss': 'text-gray-400 bg-gray-600/20 border-gray-600/30',
  'cleanup': 'text-orange-400 bg-orange-600/20 border-orange-600/30',
  'default': 'text-purple-400 bg-purple-600/20 border-purple-600/30'
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({})
  const [admins, setAdmins] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [actionFilter, setActionFilter] = useState('all')
  const [adminFilter, setAdminFilter] = useState('all')
  const [targetTypeFilter, setTargetTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  // Cleanup modal
  const [showCleanupModal, setShowCleanupModal] = useState(false)
  const [cleanupDays, setCleanupDays] = useState(90)
  const [isCleaning, setIsCleaning] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [actionFilter, adminFilter, targetTypeFilter, pagination.page, dateFrom, dateTo])

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        action: actionFilter,
        adminId: adminFilter,
        targetType: targetTypeFilter,
        search,
        dateFrom,
        dateTo
      })
      
      const res = await fetch(`/api/admin/moderation/logs?${params}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setLogs(data.logs)
      setStats(data.stats)
      setAdmins(data.admins)
      setPagination(data.pagination)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(p => ({ ...p, page: 1 }))
    fetchLogs()
  }

  const handleCleanup = async () => {
    if (!confirm(`Haqiqatan ham ${cleanupDays} kundan eski loglarni o'chirmoqchimisiz?\nBu amal qaytarib bo'lmaydi!`)) return
    
    setIsCleaning(true)
    try {
      const res = await fetch(`/api/admin/moderation/logs?daysOld=${cleanupDays}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      toast.success(data.message)
      setShowCleanupModal(false)
      fetchLogs()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsCleaning(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatRelativeTime = (date) => {
    const now = new Date()
    const then = new Date(date)
    const diff = Math.floor((now - then) / 1000)
    
    if (diff < 60) return `${diff} soniya oldin`
    if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`
    if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`
    if (diff < 604800) return `${Math.floor(diff / 86400)} kun oldin`
    return formatDate(date)
  }

  const getActionIcon = (action) => {
    for (const key of Object.keys(ACTION_ICONS)) {
      if (action.includes(key)) return ACTION_ICONS[key]
    }
    return ACTION_ICONS.default
  }

  const getActionColor = (action) => {
    for (const key of Object.keys(ACTION_COLORS)) {
      if (action.includes(key)) return ACTION_COLORS[key]
    }
    return ACTION_COLORS.default
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
      case 'admin':
        return 'bg-orange-600/20 text-orange-400 border-orange-600/30'
      case 'moderator':
        return 'bg-purple-600/20 text-purple-400 border-purple-600/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    }
  }

  // Export logs to CSV
  const exportToCSV = () => {
    const headers = ['Sana', 'Admin', 'Rol', 'Amal', 'Target', 'Tafsilotlar']
    const rows = logs.map(log => [
      formatDate(log.createdAt),
      log.admin.fullName || log.admin.username,
      log.admin.role,
      log.action,
      `${log.targetType} ${log.targetId ? `#${log.targetId}` : ''}`,
      log.details || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('✓ CSV fayl yuklab olindi')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            📋 Tizim Loglari
            <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/50 rounded-full text-xs text-yellow-400 font-bold">
              👑 SUPER ADMIN
            </span>
          </h1>
          <p className="text-purple-300 mt-1">
            Barcha admin harakatlarini kuzatish va audit qilish
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>📥</span> CSV
          </button>
          <button
            onClick={() => setShowCleanupModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>🧹</span> Tozalash
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">📊</div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats.totalLogs || 0}</div>
              <div className="text-xs text-blue-300/70">Jami loglar</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-xl">📅</div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.todayLogs || 0}</div>
              <div className="text-xs text-green-300/70">Bugun</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">👥</div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.uniqueAdmins || 0}</div>
              <div className="text-xs text-purple-300/70">Faol adminlar</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-xl">⚡</div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {stats.topActions?.[0]?._count || 0}
              </div>
              <div className="text-xs text-yellow-300/70 truncate">
                {stats.topActions?.[0]?.action || 'Top amal'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Amal, admin yoki tafsilot bo'yicha qidirish..."
            className="flex-1 px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-yellow-500 outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
          >
            Qidirish
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          <select
            value={adminFilter}
            onChange={(e) => { setAdminFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">👤 Barcha adminlar</option>
            {admins.map(a => (
              <option key={a.id} value={a.id}>
                {a.fullName || a.username} ({a.role})
              </option>
            ))}
          </select>

          <select
            value={targetTypeFilter}
            onChange={(e) => { setTargetTypeFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
          >
            <option value="all">📦 Barcha turlar</option>
            <option value="user">👤 Foydalanuvchi</option>
            <option value="report">📋 Report</option>
            <option value="settings">⚙️ Sozlamalar</option>
            <option value="quiz">📝 Quiz</option>
            <option value="compound">🧪 Birikma</option>
            <option value="system">🖥️ Tizim</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
            placeholder="Dan"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
            placeholder="Gacha"
          />

          {(adminFilter !== 'all' || targetTypeFilter !== 'all' || search || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setAdminFilter('all')
                setTargetTypeFilter('all')
                setSearch('')
                setDateFrom('')
                setDateTo('')
                setPagination(p => ({ ...p, page: 1 }))
              }}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 text-sm"
            >
              ✕ Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-purple-300">⏳ Yuklanmoqda...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">Loglar topilmadi</h3>
            <p className="text-purple-300">Filtrlarni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="divide-y divide-purple-800/30">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-purple-950/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-purple-500">
                        {log.targetType} {log.targetId && `#${log.targetId.substring(0, 8)}`}
                      </span>
                      <span className="text-xs text-purple-400 ml-auto" title={formatDate(log.createdAt)}>
                        {formatRelativeTime(log.createdAt)}
                      </span>
                    </div>

                    {/* Admin info */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-black flex-shrink-0 overflow-hidden">
                        {log.admin.avatar ? (
                          <img src={log.admin.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (log.admin.fullName?.charAt(0) || log.admin.username.charAt(0)).toUpperCase()
                        )}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {log.admin.fullName || log.admin.username}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getRoleBadge(log.admin.role)}`}>
                        {log.admin.role}
                      </span>
                    </div>

                    {/* Details */}
                    {log.details && (
                      <div className="text-sm text-purple-300 bg-purple-950/30 rounded-lg p-2 mt-2">
                        {log.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-purple-800/50">
            <div className="text-sm text-purple-400">
              {pagination.total} ta logdan {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} ko'rsatilmoqda
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Oldingi
              </button>
              <span className="px-3 py-1 text-sm font-semibold">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keyingi →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Actions */}
      {stats.topActions && stats.topActions.length > 0 && (
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Eng ko'p bajarilgan amallar (Top 10)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {stats.topActions.map((action, idx) => (
              <div key={idx} className="bg-purple-950/30 rounded-lg p-3 border border-purple-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getActionIcon(action.action)}</span>
                  <span className="text-xs text-purple-400 truncate">{action.action}</span>
                </div>
                <div className="text-xl font-bold text-white">{action._count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLEANUP MODAL */}
      {showCleanupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🧹</span> Eski loglarni tozalash
            </h3>

            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 mb-4">
              <div className="text-xs text-red-300">
                ⚠️ <strong>Diqqat:</strong> Bu amal qaytarib bo'lmaydi! O'chirilgan loglarni tiklab bo'lmaydi.
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-purple-300 mb-2 block">
                Necha kundan eski loglarni o'chirish?
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[30, 60, 90, 180].map(days => (
                  <button
                    key={days}
                    onClick={() => setCleanupDays(days)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      cleanupDays === days
                        ? 'bg-red-600 text-white'
                        : 'bg-purple-800/50 text-purple-300 hover:bg-purple-700/50'
                    }`}
                  >
                    {days} kun
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={cleanupDays}
                onChange={(e) => setCleanupDays(parseInt(e.target.value) || 90)}
                min="1"
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white outline-none"
                placeholder="Yoki o'z soningizni kiriting..."
              />
            </div>

            <div className="bg-purple-950/30 rounded-lg p-3 mb-4 text-sm text-purple-300">
              💡 <strong>Maslahat:</strong> Odatda 90 kunlik loglar saqlanadi. Disk joyini tejash uchun eski loglarni muntazam tozalab turing.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCleanupModal(false)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCleanup}
                disabled={isCleaning}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {isCleaning ? '⏳...' : '🗑️ O\'chirish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}