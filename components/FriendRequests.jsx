"use client"

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import Ikon from '@/components/Ikon'

export default function FriendRequests({ requests, onUpdate }) {
  const [loading, setLoading] = useState({})

  const handleRequest = async (requestId, action) => {
    setLoading({ ...loading, [requestId]: action })

    try {
      const response = await fetch(`/api/friends/request/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success(data.message || 'Javob berildi')
      if (onUpdate) await onUpdate()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(prev => ({ ...prev, [requestId]: null }))
    }
  }

  if (!requests || requests.length === 0) return null

  return (
    <div className="v3-panel-karta p-5 space-y-3.5 border-[var(--v3-urgu)]/40 bg-[var(--v3-yuza-2)]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--v3-matn)] flex items-center gap-2">
          <Ikon nom="odamlar" olcham={16} className="text-[var(--v3-urgu)]" />
          <span>Kelgan do{"'"}stlik so{"'"}rovlari ({requests.length})</span>
        </h2>
      </div>

      <div className="space-y-2">
        {requests.map(request => (
          <div 
            key={request.id} 
            className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] flex items-center justify-between gap-3"
          >
            <Link href={`/profil/${request.sender?.userId || request.sender?.id}`} className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-xs font-bold text-[var(--v3-urgu)] overflow-hidden shrink-0">
                {request.sender?.avatar ? (
                  <img src={request.sender.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (request.sender?.fullName?.[0] || request.sender?.username?.[0] || 'U').toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-[var(--v3-matn)] truncate flex items-center gap-1">
                  <span>{request.sender?.fullName || request.sender?.username}</span>
                  <TasdiqBelgisi tasdiqlangan={request.sender?.isVerified} olcham="kichik" />
                </div>
                <div className="text-[10.5px] text-[var(--v3-xira)] font-mono">
                  @{request.sender?.username}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleRequest(request.id, 'accept')}
                disabled={loading[request.id]}
                className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 font-bold"
              >
                {loading[request.id] === 'accept' ? '...' : 'Qabul'}
              </button>

              <button
                type="button"
                onClick={() => handleRequest(request.id, 'reject')}
                disabled={loading[request.id]}
                className="v3-tugma text-xs py-1.5 px-3 text-red-400 hover:border-red-500/30"
              >
                {loading[request.id] === 'reject' ? '...' : 'Rad'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
