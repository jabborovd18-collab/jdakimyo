"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'

export default function UstozTalabalarPage() {
  const { data: session } = useSession()
  const [students, setStudents] = useState([])
  const [kutilayotgan, setKutilayotgan] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('faol') // 'faol' | 'sorov'

  // Add Student Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [groupFilter, search])

  useEffect(() => {
    if (searchQuery.length >= 2 && selectedGroupId) {
      const timeout = setTimeout(() => searchUsers(), 300)
      return () => clearTimeout(timeout)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, selectedGroupId])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        groupId: groupFilter,
        search
      })
      const res = await fetch(`/api/ustoz/talaba?${params}`)
      const data = await res.json()

      if (res.ok) {
        setStudents(data.students || [])
        setKutilayotgan(data.kutilayotgan || [])
        setGroups(data.groups || [])
      } else {
        toast.error(data.error || 'Yuklab bo\'lmadi')
      }
    } catch (error) {
      toast.error('Talabalarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const searchUsers = async () => {
    if (!searchQuery || searchQuery.length < 2 || !selectedGroupId) return

    setIsSearching(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        groupId: selectedGroupId
      })
      const res = await fetch(`/api/ustoz/talaba/qidiruv?${params}`)
      const data = await res.json()

      if (res.ok) {
        setSearchResults(data.users || [])
      }
    } catch (error) {
      console.error('Qidiruvda xatolik:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddStudent = async (studentId, studentName) => {
    if (!selectedGroupId) {
      toast.error('Guruhni tanlang!')
      return
    }

    setIsAdding(true)
    try {
      const res = await fetch('/api/ustoz/talaba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, groupId: selectedGroupId })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || 'Taklif yuborildi!')
      setSearchQuery('')
      setSearchResults([])
      setShowAddModal(false)
      fetchStudents()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveStudent = async (id, studentName, groupName) => {
    if (!confirm(`"${studentName}" ni "${groupName}" guruhidan olib tashlamoqchimisiz?`)) {
      return
    }

    try {
      const res = await fetch(`/api/ustoz/talaba?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || 'Guruhdan chiqarildi')
      fetchStudents()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openAddModal = () => {
    if (groups.length === 0) {
      toast.error('Avval "Guruhlar" bo\'limida guruh yarating!')
      return
    }
    setSelectedGroupId(groups[0].id)
    setSearchQuery('')
    setSearchResults([])
    setShowAddModal(true)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Talabalar jamoasi</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
            Mening Talabalarim
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">
            Guruhlar bo{"'"}yicha talabalar ro{"'"}yxati, yuborilgan takliflar va o{"'"}zlashtirish statistikasi.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 inline-flex items-center gap-2 self-start sm:self-auto font-bold"
        >
          <Ikon nom="qosh" olcham={15} />
          Talaba qo{"'"}shish
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="v3-panel-karta p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('faol')}
            className={`v3-tugma text-xs py-1.5 px-3.5 whitespace-nowrap ${activeTab === 'faol' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="odamlar" olcham={14} />
            Faol talabalar ({students.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sorov')}
            className={`v3-tugma text-xs py-1.5 px-3.5 whitespace-nowrap ${activeTab === 'sorov' ? 'v3-tugma-asosiy' : ''}`}
          >
            <Ikon nom="vaqt" olcham={14} />
            Kutilayotgan takliflar ({kutilayotgan.length})
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism yoki username..."
              className="v3-kiritish text-xs py-1.5 pl-8"
            />
            <span className="absolute left-2.5 top-2.5 text-[var(--v3-xira)]">
              <Ikon nom="qidiruv" olcham={13} />
            </span>
          </div>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="v3-kiritish text-xs py-1.5 md:w-44"
          >
            <option value="all">Barcha guruhlar</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── TAB 1: FAOL TALABALAR ─── */}
      {activeTab === 'faol' && (
        <div>
          {isLoading ? (
            <div className="py-20 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
              <Ikon nom="vaqt" olcham={18} className="animate-spin" />
              <span>Talabalar yuklanmoqda...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="v3-panel-karta py-20 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
                <Ikon nom="odamlar" olcham={24} />
              </div>
              <h3 className="font-bold text-base text-[var(--v3-matn)]">
                {search ? 'Talaba topilmadi' : 'Hali faol talabalar yo\'q'}
              </h3>
              <p className="text-xs text-[var(--v3-xira)] max-w-sm mx-auto">
                {search ? 'Qidiruv so\'zini o\'zgartirib ko\'ring' : 'Guruhlaringizga talabalarni taklif qiling.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((ts) => (
                <div
                  key={ts.id}
                  className="v3-panel-karta p-5 flex flex-col justify-between space-y-4 group hover:border-[var(--v3-chiziq-2)] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-sm font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0">
                      {ts.student?.avatar ? (
                        <img src={ts.student.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (ts.student?.fullName?.[0] || ts.student?.username?.[0] || 'U').toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/profil/${ts.student?.userId}`}
                        className="font-bold text-sm text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors line-clamp-1"
                      >
                        {ts.student?.fullName || ts.student?.username}
                      </Link>
                      <div className="text-[11px] text-[var(--v3-xira)] font-mono">
                        @{ts.student?.username}
                      </div>
                      {ts.student?.university && (
                        <div className="text-[10px] text-[var(--v3-xira)] truncate mt-0.5">
                          🏛️ {ts.student.university}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(
                        ts.id,
                        ts.student?.fullName || ts.student?.username,
                        ts.group?.name
                      )}
                      className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-red-400 hover:border-red-500/30 transition-colors shrink-0"
                      title="Guruhdan chiqarish"
                    >
                      <Ikon nom="ochir" olcham={13} />
                    </button>
                  </div>

                  <div>
                    <span className="v3-tag v3-tag-yopiq text-[10.5px]">
                      <Ikon nom="kitob" olcham={11} />
                      {ts.group?.name || 'Guruh'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--v3-chiziq)] text-center font-mono">
                    <div>
                      <span className="text-[10px] text-[var(--v3-xira)] block">Topshiriq</span>
                      <strong className="text-xs text-[var(--v3-matn)]">{ts.stats?.submissions || 0}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--v3-xira)] block">O{"'"}rtacha</span>
                      <strong className="text-xs text-[var(--v3-urgu)]">
                        {ts.stats?.avgScore > 0 ? `${ts.stats.avgScore.toFixed(0)}%` : '—'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--v3-xira)] block">Daraja</span>
                      <strong className="text-xs text-[var(--v3-matn)]">Lvl {ts.student?.level_points || 1}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: KUTILAYOTGAN TAKLIFLAR ─── */}
      {activeTab === 'sorov' && (
        <div>
          {kutilayotgan.length === 0 ? (
            <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)]">
              Kutilayotgan takliflar mavjud emas
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kutilayotgan.map((ts) => (
                <div
                  key={ts.id}
                  className="v3-panel-karta p-5 flex flex-col justify-between space-y-4 border-dashed"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-xira)] overflow-hidden shrink-0">
                      {ts.student?.avatar ? (
                        <img src={ts.student.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (ts.student?.fullName?.[0] || ts.student?.username?.[0] || 'U').toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-[var(--v3-matn)] truncate">
                        {ts.student?.fullName || ts.student?.username}
                      </div>
                      <div className="text-[10.5px] text-[var(--v3-xira)] font-mono">
                        @{ts.student?.username}
                      </div>
                      <div className="text-[10px] text-[var(--v3-urgu)] mt-1">
                        Taklif yuborilgan: {ts.group?.name}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(
                        ts.id,
                        ts.student?.fullName || ts.student?.username,
                        ts.group?.name
                      )}
                      className="p-1.5 rounded-lg border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-red-400"
                      title="Taklifni bekor qilish"
                    >
                      <Ikon nom="yopish" olcham={13} />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-[11px] text-[var(--v3-xira)]">
                    Talaba qabul qilgach faol a{"'"}zoga aylanadi.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--v3-chiziq-2)] bg-[var(--v3-fon-2)] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--v3-chiziq)]">
              <h3 className="font-bold text-base text-[var(--v3-matn)] flex items-center gap-2">
                <Ikon nom="odamlar" olcham={16} />
                Talabani guruhga taklif qilish
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="v3-yorliq">Guruhni tanlang *</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => {
                    setSelectedGroupId(e.target.value)
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="v3-kiritish"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="v3-yorliq">Talabani qidirish (username yoki ism) *</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masalan: akmal yoki olim..."
                  className="v3-kiritish"
                  autoFocus
                />
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <span className="text-[11px] text-[var(--v3-urgu)] mt-1 block">
                    Kamida 2 ta harf kiriting
                  </span>
                )}
              </div>

              {/* Natijalar */}
              <div className="min-h-[160px]">
                {isSearching ? (
                  <div className="py-8 text-center text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
                    <Ikon nom="vaqt" olcham={16} className="animate-spin" />
                    <span>Qidirilmoqda...</span>
                  </div>
                ) : searchQuery.length < 2 ? (
                  <div className="py-8 text-center text-xs text-[var(--v3-xira)]">
                    Qidiruvni boshlash uchun talaba ismini yozing
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--v3-xira)]">
                    Foydalanuvchi topilmadi
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] text-[var(--v3-xira)] font-mono">
                      {searchResults.length} ta foydalanuvchi topildi:
                    </div>
                    {searchResults.map(user => (
                      <div
                        key={user.id}
                        className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (user.fullName?.[0] || user.username?.[0] || 'U').toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[var(--v3-matn)] truncate">
                              {user.fullName || user.username}
                            </div>
                            <div className="text-[10.5px] text-[var(--v3-xira)] font-mono">
                              @{user.username}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddStudent(user.id, user.fullName || user.username)}
                          disabled={isAdding}
                          className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold shrink-0"
                        >
                          {isAdding ? '...' : '+ Taklif qilish'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--v3-chiziq)] flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="v3-tugma text-xs py-2 px-4"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
