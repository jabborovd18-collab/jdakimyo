// components/FriendRequests.jsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

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

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      
      // Profilni yangilash
      if (onUpdate) {
        await onUpdate()
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(prev => ({ ...prev, [requestId]: null }))
    }
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/30 rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">📥</span>
        <span>Do'stlik so'rovlari ({requests.length})</span>
      </h2>
      <div className="space-y-3">
        {requests.map(request => (
          <div 
            key={request.id} 
            className="bg-purple-950/50 rounded-xl p-4 flex items-center gap-4 border border-purple-700/30 hover:border-yellow-500/50 transition-all"
          >
            <Link href={`/profil/${request.sender.userId}`} className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-lg font-bold text-black flex-shrink-0">
                {request.sender.fullName?.charAt(0)?.toUpperCase() || request.sender.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {request.sender.fullName || request.sender.username}
                </div>
                <div className="text-xs text-purple-400">
                  @{request.sender.username} • ID: {request.sender.userId}
                </div>
                {request.message && (
                  <div className="text-xs text-purple-300 mt-1 italic">
                    "{request.message}"
                  </div>
                )}
              </div>
            </Link>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleRequest(request.id, 'accept')
                }}
                disabled={loading[request.id]}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {loading[request.id] === 'accept' ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <span>✓</span>
                )}
                <span className="hidden sm:inline">Qabul</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleRequest(request.id, 'reject')
                }}
                disabled={loading[request.id]}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {loading[request.id] === 'reject' ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <span>✗</span>
                )}
                <span className="hidden sm:inline">Rad</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}