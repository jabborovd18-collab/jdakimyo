// app/admin/users/page.js
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import {
  ALL_ROLES,
  ACADEMIC_ROLES,
  PRIVILEGED_ROLES,
  roleLabel,
} from '@/lib/roles'
import { sana, sanaVaqt } from '@/lib/sana'
import {
  AdminBadge,
  AdminEmpty,
  AdminLoading,
  AdminModal,
  AdminPageHeader,
  AdminPagination,
  AdminPanel,
  AdminStatCard,
} from '@/components/admin/AdminUI'

function rolRangi(rol) {
  switch (rol) {
    case 'superadmin':
      return 'primary'
    case 'admin':
      return 'accent'
    case 'moderator':
      return 'info'
    case 'editor':
    case 'teacher':
      return 'success'
    default:
      return 'neutral'
  }
}

function UsersPageContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') || 'all'
  const initialTeacher = searchParams.get('teacher') === 'true' || initialRole === 'teacher'

  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    totalPoints: 0,
    todayRegistrations: 0,
    activeUsers: 0,
    bannedUsers: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalUsers: 0,
    totalPages: 0,
  })
  const [canDelete, setCanDelete] = useState(false)
  const [canManageAdmins, setCanManageAdmins] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(initialRole)
  const [teacherOnly, setTeacherOnly] = useState(initialTeacher)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [showUnbanModal, setShowUnbanModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showParolModal, setShowParolModal] = useState(false)
  const [yangiParol, setYangiParol] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRole, setNewRole] = useState('bakalavr')
  const [banReason, setBanReason] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Qidiruv debounsi va 1-sahifaga qaytarish
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setPagination((p) => (p.page === 1 ? p : { ...p, page: 1 }))
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: '20',
        search,
        role: roleFilter,
        teacher: teacherOnly ? 'true' : '',
        status: statusFilter,
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Foydalanuvchilarni yuklashda xatolik')

      setUsers(data.users || [])
      setStats(data.stats || stats)
      setPagination(data.pagination || pagination)
      setCanDelete(Boolean(data.canDelete))
      setCanManageAdmins(Boolean(data.canManageAdmins))
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search, roleFilter, teacherOnly, statusFilter, sortBy, sortOrder])

  const filtrOzgartir = (setter) => (qiymat) => {
    setter(qiymat)
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const handleToggle = async (user, action) => {
    setIsActionLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchUsers()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsActionLoading(false)
    }
  }

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
          data: { role: newRole },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
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

  const handleParolTiklash = async () => {
    if (!selectedUser) return
    setIsActionLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, action: 'resetPassword' }),
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
          data: { reason: banReason },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
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

  const handleUnban = async () => {
    if (!selectedUser) return
    setIsActionLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, action: 'unban' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      toast.success(data.message)
      setShowUnbanModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setIsActionLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
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

  const himoyalanganAdminmi = (u) => ['admin', 'superadmin'].includes(u.role) && !canManageAdmins
  const ozimi = (u) => session?.user?.id === u.id

  const privilegedChoices = Object.entries(PRIVILEGED_ROLES).filter(
    ([key]) => canManageAdmins || !['admin', 'superadmin'].includes(key),
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Foydalanuvchilar"
        subtitle="Barcha hisoblar, rollar, ustozlik maqomi va xavfsizlik amallari"
        ikon="odamlar"
        badge={<AdminBadge tone="info">{stats.total} ta hisob</AdminBadge>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <AdminStatCard label="Jami hisoblar" value={stats.total} ikon="odamlar" tone="info" />
        <AdminStatCard
          label="Bugun ro'yxatdan"
          value={stats.todayRegistrations}
          ikon="qosh"
          tone="success"
        />
        <AdminStatCard label="Bugun faol" value={stats.activeUsers} ikon="olov" tone="warning" />
        <AdminStatCard label="Bloklangan" value={stats.bannedUsers} ikon="taqiq" tone="danger" />
      </div>

      {/* Qidiruv va filtrlar */}
      <AdminPanel className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Ikon
              nom="qidiruv"
              olcham={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--v3-xira)]"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Email, username yoki ism bo'yicha qidirish..."
              className="v3-kiritish pl-9"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              const qiymat = e.target.value
              filtrOzgartir(setRoleFilter)(qiymat)
              if (qiymat === 'teacher') setTeacherOnly(true)
            }}
            className="v3-kiritish"
          >
            <option value="all">Barcha rollar</option>
            {Object.entries(ALL_ROLES).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => filtrOzgartir(setStatusFilter)(e.target.value)}
            className="v3-kiritish"
          >
            <option value="all">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="banned">Bloklangan</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              const yangi = !teacherOnly
              setTeacherOnly(yangi)
              if (!yangi && roleFilter === 'teacher') setRoleFilter('all')
              setPagination((p) => ({ ...p, page: 1 }))
            }}
            className={`v3-tugma text-xs py-1.5 px-3 ${teacherOnly ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="ustoz" olcham={14} />
            <span>Faqat ustozlar</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--v3-xira)]">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => filtrOzgartir(setSortBy)(e.target.value)}
              className="v3-kiritish w-auto py-1.5 px-2.5 text-xs"
            >
              <option value="createdAt">Ro&apos;yxatdan o&apos;tgan sana</option>
              <option value="lastActive">Oxirgi faollik</option>
              <option value="totalPoints">Umumiy XP</option>
              <option value="level_points">Level</option>
              <option value="currentStreak">Streak</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              className="v3-tugma text-xs py-1.5 px-3"
            >
              <Ikon nom="filtr" olcham={13} />
              <span>{sortOrder === 'desc' ? 'Kamayish' : "O'sish"}</span>
            </button>
          </div>
        </div>
      </AdminPanel>

      {/* Ro'yxat */}
      {isLoading ? (
        <AdminLoading text="Foydalanuvchilar yuklanmoqda..." />
      ) : users.length === 0 ? (
        <AdminEmpty
          ikon="odamlar"
          title="Foydalanuvchilar topilmadi"
          description="Qidiruv so'zi yoki filtrlarni o'zgartirib ko'ring."
        />
      ) : (
        <AdminPanel padding="p-0" className="overflow-hidden">
          {/* Desktop jadval */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs text-[var(--v3-xira)]">
                <tr>
                  <th className="text-left p-3.5 font-semibold">Foydalanuvchi</th>
                  <th className="text-left p-3.5 font-semibold">Rol va maqom</th>
                  <th className="text-left p-3.5 font-semibold">Daraja</th>
                  <th className="text-left p-3.5 font-semibold">Oxirgi faollik</th>
                  <th className="text-left p-3.5 font-semibold">Qo&apos;shilgan</th>
                  <th className="text-right p-3.5 font-semibold">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {users.map((user) => {
                  const locked = himoyalanganAdminmi(user)
                  const self = ozimi(user)
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-[var(--v3-yuza)] transition-colors ${
                        user.isBanned ? 'bg-rose-500/5' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (user.fullName?.charAt(0) || user.username.charAt(0)).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-[var(--v3-matn)] flex items-center gap-1.5 truncate">
                              <span>{user.fullName || user.username}</span>
                              {user.isVerified && (
                                <Ikon nom="tasdiq" olcham={14} className="text-[var(--v3-urgu)] shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-[var(--v3-xira)] truncate">
                              @{user.username} · {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          <AdminBadge tone={rolRangi(user.role)}>{roleLabel(user.role)}</AdminBadge>
                          {(user.isTeacher || user.role === 'teacher') && (
                            <AdminBadge tone="info">Ustoz</AdminBadge>
                          )}
                          {user.isBanned && <AdminBadge tone="danger">Bloklangan</AdminBadge>}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-[var(--v3-matn)]">Lvl {user.level_points}</div>
                        <div className="text-xs text-[var(--v3-xira)]">
                          {user.totalPoints.toLocaleString('uz-UZ')} XP
                        </div>
                      </td>

                      <td className="p-3.5 text-xs">
                        <div className="text-[var(--v3-matn)]">{sanaVaqt(user.lastActive)}</div>
                        <div className="text-[var(--v3-xira)]">{user.currentStreak} kun streak</div>
                      </td>

                      <td className="p-3.5 text-xs text-[var(--v3-xira)]">{sana(user.createdAt)}</td>

                      <td className="p-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={locked || self || isActionLoading}
                            onClick={() => handleToggle(user, 'toggleTeacher')}
                            title={user.isTeacher ? 'Ustozlikni olish' : 'Ustozlik berish'}
                            className={`v3-ikon-tugma ${
                              user.isTeacher ? 'text-emerald-300 border-emerald-400/40' : ''
                            } disabled:opacity-35`}
                          >
                            <Ikon nom="ustoz" olcham={15} />
                          </button>

                          {canManageAdmins && (
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => handleToggle(user, 'toggleVerified')}
                              title={user.isVerified ? 'Tasdiqni olish' : 'Hisobni tasdiqlash'}
                              className={`v3-ikon-tugma ${
                                user.isVerified ? 'text-[var(--v3-urgu)] border-[var(--v3-urgu)]/40' : ''
                              } disabled:opacity-35`}
                            >
                              <Ikon nom="tasdiq" olcham={15} />
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={locked || self}
                            onClick={() => {
                              setSelectedUser(user)
                              setNewRole(user.role)
                              setShowRoleModal(true)
                            }}
                            title={locked ? 'Faqat superadmin boshqaradi' : "Rolni o'zgartirish"}
                            className="v3-ikon-tugma disabled:opacity-35"
                          >
                            <Ikon nom="qalqon" olcham={15} />
                          </button>

                          {canManageAdmins && !self && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user)
                                setYangiParol(null)
                                setShowParolModal(true)
                              }}
                              title="Parolni tiklash"
                              className="v3-ikon-tugma"
                            >
                              <Ikon nom="qulf" olcham={15} />
                            </button>
                          )}

                          {user.isBanned ? (
                            <button
                              type="button"
                              disabled={locked || self}
                              onClick={() => {
                                setSelectedUser(user)
                                setShowUnbanModal(true)
                              }}
                              title="Blokdan chiqarish"
                              className="v3-ikon-tugma text-emerald-300 disabled:opacity-35"
                            >
                              <Ikon nom="ochiq" olcham={15} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={locked || self}
                              onClick={() => {
                                setSelectedUser(user)
                                setBanReason('')
                                setShowBanModal(true)
                              }}
                              title="Bloklash"
                              className="v3-ikon-tugma text-rose-300 disabled:opacity-35"
                            >
                              <Ikon nom="taqiq" olcham={15} />
                            </button>
                          )}

                          {canDelete && !self && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowDeleteModal(true)
                              }}
                              title="Butunlay o'chirish"
                              className="v3-ikon-tugma text-rose-300"
                            >
                              <Ikon nom="ochir" olcham={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobil kartalar */}
          <div className="lg:hidden divide-y divide-[var(--v3-chiziq)]">
            {users.map((user) => {
              const locked = himoyalanganAdminmi(user)
              const self = ozimi(user)
              return (
                <div key={user.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-[var(--v3-matn)] flex items-center gap-1.5">
                        <span className="truncate">{user.fullName || user.username}</span>
                        {user.isVerified && (
                          <Ikon nom="tasdiq" olcham={14} className="text-[var(--v3-urgu)] shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-[var(--v3-xira)] truncate">
                        @{user.username} · {user.email}
                      </div>
                    </div>
                    <AdminBadge tone={rolRangi(user.role)}>{roleLabel(user.role)}</AdminBadge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--v3-xira)]">
                    <span>Lvl {user.level_points}</span>
                    <span>· {user.totalPoints} XP</span>
                    <span>· {user.currentStreak} streak</span>
                    {(user.isTeacher || user.role === 'teacher') && (
                      <AdminBadge tone="info">Ustoz</AdminBadge>
                    )}
                    {user.isBanned && <AdminBadge tone="danger">Bloklangan</AdminBadge>}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      disabled={locked || self || isActionLoading}
                      onClick={() => handleToggle(user, 'toggleTeacher')}
                      className="v3-tugma text-xs py-1 px-2.5 disabled:opacity-40"
                    >
                      <Ikon nom="ustoz" olcham={13} />
                      <span>{user.isTeacher ? 'Ustozlikni olish' : 'Ustoz'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={locked || self}
                      onClick={() => {
                        setSelectedUser(user)
                        setNewRole(user.role)
                        setShowRoleModal(true)
                      }}
                      className="v3-tugma text-xs py-1 px-2.5 disabled:opacity-40"
                    >
                      <Ikon nom="qalqon" olcham={13} />
                      <span>Rol</span>
                    </button>
                    {canManageAdmins && !self && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user)
                          setYangiParol(null)
                          setShowParolModal(true)
                        }}
                        className="v3-tugma text-xs py-1 px-2.5"
                      >
                        <Ikon nom="qulf" olcham={13} />
                        <span>Parol</span>
                      </button>
                    )}
                    {user.isBanned ? (
                      <button
                        type="button"
                        disabled={locked || self}
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUnbanModal(true)
                        }}
                        className="v3-tugma text-xs py-1 px-2.5 disabled:opacity-40"
                      >
                        Ochish
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={locked || self}
                        onClick={() => {
                          setSelectedUser(user)
                          setBanReason('')
                          setShowBanModal(true)
                        }}
                        className="v3-tugma text-xs py-1 px-2.5 disabled:opacity-40"
                      >
                        Bloklash
                      </button>
                    )}
                    {canDelete && !self && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowDeleteModal(true)
                        }}
                        className="v3-tugma text-xs py-1 px-2.5 text-rose-300"
                      >
                        <Ikon nom="ochir" olcham={13} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </AdminPanel>
      )}

      <AdminPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.totalUsers}
        onPageChange={(nextPage) => setPagination((p) => ({ ...p, page: nextPage }))}
      />

      {/* Rolni o'zgartirish */}
      <AdminModal
        open={showRoleModal && Boolean(selectedUser)}
        onClose={() => setShowRoleModal(false)}
        title="Rolni o'zgartirish"
        subtitle={selectedUser ? `@${selectedUser.username}` : null}
        ikon="qalqon"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-xs text-[var(--v3-xira)]">
              Hozirgi rol:{' '}
              <AdminBadge tone={rolRangi(selectedUser.role)}>{roleLabel(selectedUser.role)}</AdminBadge>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--v3-matn)] block">Yangi rol</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="v3-kiritish"
              >
                <optgroup label="Akademik daraja">
                  {Object.entries(ACADEMIC_ROLES).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Imtiyozli rollar">
                  {privilegedChoices.map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button type="button" onClick={() => setShowRoleModal(false)} className="v3-tugma flex-1">
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleRoleChange}
                disabled={isActionLoading || newRole === selectedUser.role}
                className="v3-tugma v3-tugma-asosiy flex-1 disabled:opacity-45"
              >
                {isActionLoading ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Bloklash */}
      <AdminModal
        open={showBanModal && Boolean(selectedUser)}
        onClose={() => setShowBanModal(false)}
        title="Foydalanuvchini bloklash"
        subtitle={selectedUser ? `@${selectedUser.username}` : null}
        ikon="taqiq"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--v3-matn)] block">
              Sabab (ixtiyoriy)
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Qoidabuzarlik, spam..."
              className="v3-kiritish"
              rows={3}
            />
          </div>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => setShowBanModal(false)} className="v3-tugma flex-1">
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleBan}
              disabled={isActionLoading}
              className="v3-tugma flex-1 bg-rose-500/20 border-rose-400/40 text-rose-200 disabled:opacity-45"
            >
              {isActionLoading ? 'Bajarilmoqda...' : 'Bloklash'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Blokdan chiqarish */}
      <AdminModal
        open={showUnbanModal && Boolean(selectedUser)}
        onClose={() => setShowUnbanModal(false)}
        title="Blokdan chiqarish"
        subtitle={selectedUser ? `@${selectedUser.username}` : null}
        ikon="ochiq"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--v3-xira)]">
            <strong className="text-[var(--v3-matn)]">
              {selectedUser?.fullName || selectedUser?.username}
            </strong>{' '}
            hisobini blokdan chiqarishni tasdiqlaysizmi?
          </p>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => setShowUnbanModal(false)} className="v3-tugma flex-1">
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleUnban}
              disabled={isActionLoading}
              className="v3-tugma v3-tugma-asosiy flex-1 disabled:opacity-45"
            >
              {isActionLoading ? 'Bajarilmoqda...' : 'Blokdan chiqarish'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Parolni tiklash (superadmin) */}
      <AdminModal
        open={showParolModal && Boolean(selectedUser)}
        onClose={() => {
          setShowParolModal(false)
          setSelectedUser(null)
          setYangiParol(null)
        }}
        title="Parolni tiklash"
        subtitle={selectedUser ? `@${selectedUser.username} · ID: ${selectedUser.userId}` : null}
        ikon="qulf"
      >
        {selectedUser &&
          (!yangiParol ? (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                Eski parol bcrypt bilan xeshlangan va ko&apos;rsatib bo&apos;lmaydi. Yangi
                vaqtinchalik parol yaratilgach, eski parol darhol ishlamay qoladi.
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowParolModal(false)
                    setSelectedUser(null)
                  }}
                  className="v3-tugma flex-1"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleParolTiklash}
                  disabled={isActionLoading}
                  className="v3-tugma v3-tugma-asosiy flex-1 disabled:opacity-45"
                >
                  {isActionLoading ? 'Yaratilmoqda...' : 'Yangi parol yaratish'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--v3-urgu)]/40 bg-[var(--v3-yuza)] p-4 text-center">
                <div className="text-[11px] text-[var(--v3-xira)] mb-1">Vaqtinchalik parol (1 marta ko&apos;rinadi)</div>
                <div className="text-xl font-mono font-bold text-[var(--v3-urgu)] select-all">
                  {yangiParol}
                </div>
              </div>
              <p className="text-xs text-[var(--v3-xira)]">
                Parol bazada faqat xesh ko&apos;rinishida saqlanadi. Nusxa olib foydalanuvchiga yetkazing.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowParolModal(false)
                  setSelectedUser(null)
                  setYangiParol(null)
                }}
                className="v3-tugma v3-tugma-asosiy w-full"
              >
                Ko&apos;chirib oldim, yopish
              </button>
            </div>
          ))}
      </AdminModal>

      {/* O'chirish (superadmin) */}
      <AdminModal
        open={showDeleteModal && Boolean(selectedUser)}
        onClose={() => setShowDeleteModal(false)}
        title="Hisobni o'chirish"
        subtitle={selectedUser ? `@${selectedUser.username}` : null}
        ikon="ogohlantirish"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[var(--v3-xira)]">
              <strong className="text-rose-300">
                {selectedUser.fullName || selectedUser.username}
              </strong>{' '}
              hisobini butunlay o&apos;chirishni tasdiqlaysizmi? Barcha natijalar va bog&apos;liq yozuvlar o&apos;chiriladi.
            </p>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => setShowDeleteModal(false)} className="v3-tugma flex-1">
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isActionLoading}
                className="v3-tugma flex-1 bg-rose-500/20 border-rose-400/40 text-rose-200 disabled:opacity-45"
              >
                {isActionLoading ? "O'chirilmoqda..." : "Butunlay o'chirish"}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<AdminLoading text="Foydalanuvchilar sahifasi yuklanmoqda..." />}>
      <UsersPageContent />
    </Suspense>
  )
}
