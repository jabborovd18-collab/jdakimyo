"use client"

import { useEffect, useState } from "react"
import { getRandomQuestions, getPreviousIds } from "./utils/storage"
import { ASOSIY_QUIZ_SLUGLARI } from "./quiz-config"

/**
 * Quiz savollarini bazadan yuklab, kerakli to'plamni tuzadi.
 *
 * Oddiy mavzuda qiyinlik muvozanati saqlanadi. Aralash testda esa har
 * asosiy yo'nalishdan teng miqdor olinadi; shunda bazadagi eng katta
 * kategoriya butun testni egallab olmaydi.
 */
export function useQuizBank(category, count = 20) {
  const [state, setState] = useState({
    questions: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch(
          `/api/quiz/bank?category=${encodeURIComponent(category)}`,
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Savollarni yuklab bo'lmadi")
        }
        if (cancelled) return

        if (!Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error("Bu mavzuda hali savol yo'q")
        }

        const previousIds = getPreviousIds(category)
        let questions

        if (category === "aralash") {
          const harBiridan = Math.floor(count / ASOSIY_QUIZ_SLUGLARI.length)
          const tanlangan = ASOSIY_QUIZ_SLUGLARI.flatMap((slug) => {
            const bank = data.questions.filter((q) => q.category === slug)
            if (bank.length < harBiridan) {
              throw new Error(`${slug} mavzusida aralash test uchun savol yetarli emas`)
            }
            return getRandomQuestions(bank, harBiridan, previousIds)
          })
          // Yig'ilgan to'rtta blok ketma-ket turmasligi uchun yakuniy
          // tanlov yana aralashtiriladi. Qiyinlik bu bosqichda o'zgarmaydi.
          questions = aralashtir(tanlangan)
        } else {
          questions = getRandomQuestions(data.questions, count, previousIds)
        }

        setState({ questions, isLoading: false, error: null })
      } catch (error) {
        if (!cancelled) {
          setState({ questions: [], isLoading: false, error: error.message })
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

function aralashtir(array) {
  const nusxa = [...array]
  for (let i = nusxa.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nusxa[i], nusxa[j]] = [nusxa[j], nusxa[i]]
  }
  return nusxa
}
