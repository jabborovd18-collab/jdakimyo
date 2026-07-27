// app/admin/users/page.js
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ACADEMIC_ROLES, PRIVILEGED_ROLES, ALL_ROLES, roleInfo, roleLabel } from '@/lib/roles'

export default function AdminUsersPage() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  // Parolni tiklash — faqat superadminda. Server tomonda ham tekshiriladi,
  // bu yerdagisi shunchaki tugmani yashiradi.
  const isSuperAdmin = session?.user?.role === 'superadmin'
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    todayRegistrations: 0,
    activeUsers: 0,
    bannedUsers: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  
  // Modal state
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  // Parolni tiklash oynasi. yangiParol — server qaytargan vaqtinchalik parol;
  // u faqat shu javobda keladi, bazada xesh saqlanadi.
  const [showParolModal, setShowParolModal] = useState(false)
  const [yangiParol, setYangiParol] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRole, setNewRole] = useState('bakalavr')
  const [banReason, setBanReason] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, search, roleFilter, statusFilter, sortBy, sortOrder])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '20',
        search,
        role: roleFilter,
        status: statusFilter,
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setUsers(data.users)
      setStats(data.stats)
      setPagination(data.pagination)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Amallar
  const handleRoleChange = async () => {
    if (!selectedUser) return
    setIsActionLoading(true)
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: 'changeRole',
          data: { role: newRole }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      setShowRoleModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsActionLoading(false)
    }
  }

  /**
   * Parolni tiklash.
   *
   * Eski parolni ko'rsatish imkonsiz — u bcrypt bilan xeshlangan. Server
   * yangi vaqtinchalik parol yaratib, uni javobda BIR MARTA qaytaradi;
   * bazada faqat xesh saqlanadi. Shuning uchun oyna yopilgach, parolni
   * hech qayerdan qayta ko'rib bo'lmaydi — qayta tiklash kerak bo'ladi.
   */
  const handleParolTiklash = async () => {
    if (!selectedUser) return
    setIsActionLoading(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: 'resetPassword',
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setYangiParol(data.temporaryPassword)
      toast.success(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleBan = async () => {
    if (!selectedUser) return
    setIsActionLoading(true)
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: 'ban',
          data: { reason: banReason }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      setShowBanModal(false)
      setSelectedUser(null)
      setBanReason('')
      fetchUsers()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUnban = async (user) => {
    if (!confirm(`${user.username} ni ochishni xohlaysizmi?`)) return
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'unban'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      fetchUsers()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setIsActionLoading(true)
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      setShowDeleteModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsActionLoading(false)
    }
  }

  // Yordamchi funksiyalar
  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Rol nomlari va ranglari lib/roles.js dan — barcha sahifalar bir xil ko'rsatishi uchun
  const getRoleBadge = (role) => roleInfo(role).badge
  const getRoleLabel = (role) => roleLabel(role)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Foydalanuvchilar</h1>
          <p className="text-purple-300 mt-1">Barcha ro'yxatdan o'tgan foydalanuvchilarni boshqarish</p>
        </div>
        <div className="text-sm text-purple-400">
          Jami: <span className="text-white font-bold">{stats.total}</span> foydalanuvchi
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-purple-400">Jami</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center text-xl">
              🆕
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.todayRegistrations}</div>
              <div className="text-xs text-purple-400">Bugun ro'yxatdan</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center text-xl">
              🔥
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{stats.activeUsers}</div>
              <div className="text-xs text-purple-400">Bugun faol</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center text-xl">
              🚫
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{stats.bannedUsers}</div>
              <div className="text-xs text-purple-400">Bloklangan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Qidiruv */}
          <div className="md:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Email, username yoki ism bo'yicha qidirish..."
              className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white placeholder-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Rol filtri */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white focus:border-purple-500 outline-none"
          >
            <option value="all">Barcha rollar</option>
            {Object.entries(ALL_ROLES).map(([key, info]) => (
              <option key={key} value={key}>{info.icon} {info.label}</option>
            ))}
          </select>

          {/* Status filtri */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white focus:border-purple-500 outline-none"
          >
            <option value="all">Barcha statuslar</option>
            <option value="active">Faol</option>
            <option value="banned">Bloklangan</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="text-purple-400">Saralash:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white text-sm"
          >
            <option value="createdAt">Ro'yxatdan o'tgan sana</option>
            <option value="lastActive">Oxirgi faollik</option>
            <option value="totalPoints">Umumiy ball</option>
            <option value="level_points">Level</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white text-sm"
          >
            {sortOrder === 'desc' ? '↓ Kamayish' : '↑ O\'sish'}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 border border-purple-800/50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-purple-300">Yuklanmoqda...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Foydalanuvchilar topilmadi</h3>
            <p className="text-purple-300">Qidiruv yoki filtrlarni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-950/50 border-b border-purple-800/50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Foydalanuvchi</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Rol</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Daraja</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Faollik</th>
                  <th className="text-left p-4 text-sm font-semibold text-purple-300">Ro'yxatdan</th>
                  <th className="text-right p-4 text-sm font-semibold text-purple-300">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-purple-800/30 hover:bg-purple-950/30 transition-colors ${
                      user.isBanned ? 'bg-red-950/10' : ''
                    }`}
                  >
                    {/* Foydalanuvchi */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black flex-shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                              (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
                            )}
                          </div>
                          {user.isBanned && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs border-2 border-slate-900">
                              🚫
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">
                            {user.fullName || user.username}
                          </div>
                          <div className="text-xs text-purple-400 truncate">
                            @{user.username} • {user.email}
                          </div>
                          {user.university && (
                            <div className="text-xs text-purple-500 truncate">
                              🏛️ {user.university}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadge(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>

                    {/* Daraja */}
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="text-white font-semibold">Lvl {user.level_points}</div>
                        <div className="text-xs text-purple-400">{user.totalPoints} XP</div>
                      </div>
                    </td>

                    {/* Faollik */}
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="text-white">{formatDateTime(user.lastActive)}</div>
                        <div className="text-xs text-purple-400">
                          🔥 {user.currentStreak} kun streak
                        </div>
                      </div>
                    </td>

                    {/* Ro'yxatdan */}
                    <td className="p-4">
                      <div className="text-sm text-white">{formatDate(user.createdAt)}</div>
                    </td>

                    {/* Amallar */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/profil/${user.userId}`}
                          target="_blank"
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-xs text-blue-400 transition-all"
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setNewRole(user.role)
                            setShowRoleModal(true)
                          }}
                          className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 rounded-lg text-xs text-purple-400 transition-all"
                        >
                          🎭
                        </button>
                        {user.isBanned ? (
                          <button
                            onClick={() => handleUnban(user)}
                            className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-xs text-green-400 transition-all"
                          >
                            ✅
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setBanReason('')
                              setShowBanModal(true)
                            }}
                            className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 rounded-lg text-xs text-orange-400 transition-all"
                          >
                            🚫
                          </button>
                        )}
                        {/* Parolni tiklash — faqat superadmin.
                            Parolni KO'RSATIB bo'lmaydi (bcrypt bir tomonlama),
                            shuning uchun yangi vaqtinchalik parol beriladi. */}
                        {isSuperAdmin && (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setYangiParol(null)
                              setShowParolModal(true)
                            }}
                            title="Parolni tiklash"
                            className="px-3 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/50 rounded-lg text-xs text-yellow-400 transition-all"
                          >
                            🔑
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteModal(true)
                          }}
                          className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-xs text-red-400 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-purple-800/50">
            <div className="text-sm text-purple-400">
              {pagination.totalUsers} ta foydalanuvchidan {(pagination.page - 1) * 20 + 1}-{Math.min(pagination.page * 20, pagination.totalUsers)} ko'rsatilmoqda
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Oldingi
              </button>
              <span className="text-sm text-white font-semibold">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keyingi →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* MODALS */}
      {/* ═══════════════════════════════════════════ */}

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">🎭 Rolni o'zgartirish</h3>
            <div className="mb-4">
              <div className="text-sm text-purple-300 mb-1">Foydalanuvchi:</div>
              <div className="text-white font-semibold">
                {selectedUser.fullName || selectedUser.username}
              </div>
              <div className="text-xs text-purple-400">@{selectedUser.username}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-purple-300 mb-1">Hozirgi rol:</div>
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadge(selectedUser.role)}`}>
                {getRoleLabel(selectedUser.role)}
              </span>
            </div>
            <div className="mb-6">
              <label className="text-sm text-purple-300 mb-2 block">Yangi rol:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white focus:border-purple-500 outline-none"
              >
                <optgroup label="Akademik daraja (imtiyozsiz)">
                  {Object.entries(ACADEMIC_ROLES).map(([key, info]) => (
                    <option key={key} value={key}>{info.icon} {info.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Imtiyozli rollar (panelga kirish)">
                  {Object.entries(PRIVILEGED_ROLES).map(([key, info]) => (
                    <option key={key} value={key}>{info.icon} {info.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleRoleChange}
                disabled={isActionLoading || newRole === selectedUser.role}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isActionLoading ? '⏳...' : '✓ Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">🚫 Bloklash</h3>
            <div className="mb-4">
              <div className="text-sm text-purple-300 mb-1">Foydalanuvchi:</div>
              <div className="text-white font-semibold">
                {selectedUser.fullName || selectedUser.username}
              </div>
            </div>
            <div className="mb-6">
              <label className="text-sm text-purple-300 mb-2 block">Sabab (ixtiyoriy):</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Qoidabuzarlik, spam, va h.k."
                className="w-full px-4 py-2 bg-purple-950/50 border border-purple-700/50 rounded-lg text-white focus:border-purple-500 outline-none"
                rows="3"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBanModal(false)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleBan}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isActionLoading ? '⏳...' : '🚫 Bloklash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {/* PAROLNI TIKLASH — faqat superadmin */}
      {showParolModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-yellow-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🔑 Parolni tiklash</h3>

            {!yangiParol ? (
              <>
                <div className="bg-purple-950/40 border border-purple-700/30 rounded-lg p-3 mb-4">
                  <p className="text-white font-semibold">
                    {selectedUser.fullName || selectedUser.username}
                  </p>
                  <p className="text-purple-400 text-sm">
                    @{selectedUser.username} · ID: {selectedUser.userId}
                  </p>
                </div>

                <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-3 mb-5">
                  <p className="text-blue-300 text-sm leading-relaxed">
                    Eski parolni ko&apos;rsatib bo&apos;lmaydi — u xeshlangan holda
                    saqlanadi va uni ochish imkonsiz. Buning o&apos;rniga yangi
                    vaqtinchalik parol yaratiladi.
                  </p>
                </div>

                <p className="text-purple-300 text-sm mb-5">
                  Foydalanuvchining eski paroli darhol ishlamay qoladi. Yangi parolni
                  unga o&apos;zingiz yetkazasiz.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowParolModal(false); setSelectedUser(null) }}
                    className="flex-1 py-3 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-xl text-white font-semibold transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleParolTiklash}
                    disabled={isActionLoading}
                    className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-black font-bold transition-all disabled:opacity-50"
                  >
                    {isActionLoading ? 'Yaratilmoqda...' : 'Yangi parol yaratish'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-purple-300 text-sm mb-3">
                  <strong className="text-white">
                    {selectedUser.fullName || selectedUser.username}
                  </strong>{' '}
                  uchun yangi parol:
                </p>

                <div className="bg-black/50 border border-yellow-600/40 rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono font-bold text-yellow-400 text-center tracking-wider select-all">
                    {yangiParol}
                  </p>
                </div>

                <div className="bg-red-950/30 border border-red-700/40 rounded-lg p-3 mb-5">
                  <p className="text-red-300 text-sm leading-relaxed">
                    ⚠️ Bu parol boshqa ko&apos;rsatilmaydi — bazada faqat xeshi
                    saqlanadi. Hozir ko&apos;chirib oling. Yo&apos;qotsangiz, qaytadan
                    tiklash kerak bo&apos;ladi.
                  </p>
                </div>

                <p className="text-purple-400 text-xs mb-4">
                  Foydalanuvchi kirgach, sozlamalardan o&apos;z parolini
                  o&apos;zgartirishi kerak.
                </p>

                <button
                  onClick={() => {
                    setShowParolModal(false)
                    setSelectedUser(null)
                    setYangiParol(null)
                  }}
                  className="w-full py-3 bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-white font-semibold transition-all"
                >
                  Ko&apos;chirib oldim, yopish
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ O'chirishni tasdiqlang</h3>
            <div className="mb-6">
              <p className="text-purple-200 mb-2">
                Quyidagi foydalanuvchini <strong className="text-red-400">butunlay o'chirmoqchimisiz</strong>?
              </p>
              <div className="bg-red-950/30 border border-red-700/30 rounded-lg p-3">
                <div className="text-white font-semibold">
                  {selectedUser.fullName || selectedUser.username}
                </div>
                <div className="text-xs text-purple-400">@{selectedUser.username} • {selectedUser.email}</div>
              </div>
              <p className="text-xs text-red-400 mt-3">
                ⚠️ Bu amal qaytarib bo'lmaydi! Barcha ma'lumotlar (quizlar, yutuqlar, do'stlar) o'chiriladi.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-white transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDelete}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isActionLoading ? '⏳...' : '🗑️ O\'chirish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}