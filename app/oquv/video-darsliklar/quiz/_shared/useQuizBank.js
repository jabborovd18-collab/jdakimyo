"use client"

import { useEffect, useState } from "react"
import { getPreviousIds } from "./utils/storage"

/** Server tanlagan javobsiz savollar va shu to'plamga bog'langan urinish. */
export function useQuizBank(category, count = 20) {
  const [state, setState] = useState({
    questions: [],
    attemptToken: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/quiz/bank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            count,
            previousIds: getPreviousIds(category),
          }),
        })
        const data = await response.json()

        if (!response.ok) throw new Error(data.error || "Savollarni yuklab bo'lmadi")
        if (cancelled) return
        if (!Array.isArray(data.questions) || data.questions.length !== count || !data.attemptToken) {
          throw new Error("Server to'liq quiz urinishini qaytarmadi")
        }

        setState({ questions: data.questions, attemptToken: data.attemptToken, isLoading: false, error: null })
      } catch (error) {
        if (!cancelled) {
          setState({ questions: [], attemptToken: null, isLoading: false, error: error.message })
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [category, count])

  return state
}
