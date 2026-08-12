// components/DailyQuoteCard.jsx
"use client"

import { useState, useEffect } from 'react'
import Ikon from './Ikon'

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
      <div className="v3-panel-karta p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[var(--v3-yuza-2)] rounded w-1/3"></div>
          <div className="h-16 bg-[var(--v3-yuza)] rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!quote) return null

  return (
    <div className="v3-panel-karta p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center text-[var(--v3-urgu)] shrink-0">
          <Ikon nom="kitob" olcham={18} />
        </div>
        <div>
          <div className="v3-nishon">Kunlik iqtibos</div>
          <h3 className="text-sm font-bold text-[var(--v3-matn)]">Bugungi gap</h3>
        </div>
      </div>

      <blockquote className="text-xs sm:text-sm text-[var(--v3-matn)] italic leading-relaxed border-l-2 border-[var(--v3-urgu)] pl-3.5 my-1">
        “{quote.textUz || quote.text}”
      </blockquote>

      {(quote.authorUz || quote.author) && (
        <div className="text-right text-[11px] font-mono text-[var(--v3-urgu-2)]">
          — {quote.authorUz || quote.author}
        </div>
      )}
    </div>
  )
}
