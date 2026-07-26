// components/TeachersPanel.jsx
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TeachersPanel({ userId }) {
  const [data, setData] = useState({ teachers: [], stats: {} })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`/api/profil/ustozlar?userId=${userId}`)
      const result = await res.json()
      if (res.ok) setData(result)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-purple-300">Yuklanmoqda...</div>
  }

  if (data.teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👨‍🏫</div>
        <h3 className="text-xl font-bold mb-2">Hali ustozlar yo'q</h3>
        <p className="text-purple-300">Siz hali biror guruhga qo'shilmagansiz</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.teachers.map(teacher => (
        <div key={teacher.id} className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-lg font-bold text-black overflow-hidden">
              {teacher.avatar ? (
                <img src={teacher.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                (teacher.fullName?.charAt(0) || '?').toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold text-white">{teacher.fullName}</div>
              <div className="text-xs text-purple-400">
                {teacher.university || 'O\'qituvchi'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-yellow-400">
                {teacher.activeQuizzes} 📝
              </div>
              <div className="text-xs text-purple-400">faol quiz</div>
            </div>
          </div>

          {teacher.recentQuizzes.length > 0 && (
            <div className="space-y-2 mt-3 pt-3 border-t border-purple-800/30">
              <div className="text-xs text-purple-400 mb-2">So'nggi quizlar:</div>
              {teacher.recentQuizzes.map(quiz => (
                <Link
                  key={quiz.id}
                  href={`/oquv/video-darsliklar/ustoz-quiz/${quiz.id}`}
                  className="flex items-center justify-between p-2 bg-purple-900/30 hover:bg-purple-800/40 rounded-lg transition-all text-sm"
                >
                  <span className="text-white truncate">{quiz.title}</span>
                  <span className="text-xs text-purple-400 flex-shrink-0 ml-2">
                    {quiz._count?.questions || 0} savol →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      <Link
        href="/oquv/video-darsliklar/ustoz-quiz"
        className="block w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-center font-semibold transition-all"
      >
        📚 Barcha quizlarni ko'rish →
      </Link>
    </div>
  )
}