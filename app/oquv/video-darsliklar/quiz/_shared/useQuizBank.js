"use client"
import { useEffect, useState } from "react"
import { getRandomQuestions, getPreviousIds } from "./utils/storage"

/**
 * Quiz savollarini bazadan yuklab, 20 tasini tanlaydi.
 *
 * Avval har bir sahifa `data.js` faylini import qilardi va savollar kod ichida
 * qotib qolgan edi — admin paneldan qo'shilgan savol saytda ko'rinmasdi.
 * Endi manba bitta: QuizQuestion jadvali (/api/quiz/bank).
 *
 * Tanlash mantig'i o'zgarmadi — getRandomQuestions o'sha-o'sha:
 * oxirgi safar chiqqan savollarni chetlab o'tadi va qiyinlik bo'yicha
 * proporsional tanlaydi (30% oson / 50% o'rta / 20% qiyin).
 *
 * @param {string} category — kategoriya slug'i (nomlanishi, aralash, ...)
 * @param {number} count — nechta savol kerak
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
        setState({
          questions: getRandomQuestions(data.questions, count, previousIds),
          isLoading: false,
          error: null,
        })
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
