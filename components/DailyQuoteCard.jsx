// components/DailyQuoteCard.jsx
"use client"
import { useState, useEffect } from 'react'

export default function DailyQuoteCard() {
  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchQuote()
  }, [])

  const fetchQuote = async () => {
    try {
      const res = await fetch('/api/quotes')
      const data = await res.json()
      if (res.ok) setQuote(data.quote)
    } catch (error) {
      console.error('Quote fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-800/50 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-purple-800/30 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!quote) return null

  const colorClasses = {
    purple: 'from-purple-600/20 to-pink-600/20 border-purple-700/50',
    blue: 'from-blue-600/20 to-cyan-600/20 border-blue-700/50',
    green: 'from-green-600/20 to-emerald-600/20 border-green-700/50',
    yellow: 'from-yellow-600/20 to-orange-600/20 border-yellow-700/50',
    pink: 'from-pink-600/20 to-rose-600/20 border-pink-700/50',
    red: 'from-red-600/20 to-orange-600/20 border-red-700/50',
    orange: 'from-orange-600/20 to-amber-600/20 border-orange-700/50',
    teal: 'from-teal-600/20 to-cyan-600/20 border-teal-700/50'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[quote.color] || colorClasses.purple} border rounded-2xl p-6 relative overflow-hidden`}>
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{quote.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">Bugungi gap</h3>
            <p className="text-xs text-purple-300">Motivatsion iqtibos</p>
          </div>
        </div>

        <blockquote className="text-white text-lg leading-relaxed mb-4 italic">
          "{quote.textUz}"
        </blockquote>

        <div className="border-t border-white/10 pt-4">
          <div className="font-semibold text-white">— {quote.author}</div>
          {quote.authorInfo && (
            <div className="text-xs text-purple-300 mt-1">{quote.authorInfo}</div>
          )}
        </div>
      </div>
    </div>
  )
}