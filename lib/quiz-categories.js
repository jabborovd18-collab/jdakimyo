// lib/quiz-categories.js
// Quiz kategoriyalari — slug bazadagi QuizQuestion.category bilan bir xil.
// "aralash" alohida: u bazada kategoriya emas, barcha savollardan aralashtiradi.
//
// DIQQAT — `resultName` nima uchun kerak:
// QuizResult jadvaliga yoziladigan nom saytdagi quiz sahifalarida uzun
// ko'rinishda yozilgan ("Koordinatsion birikmalarning nomlanishi"). Agar mobil
// ilova qisqa nom ("Nomlanishi") yozsa, bitta va o'sha quizning natijalari
// bazada IKKI xil nom ostida to'planib qolardi — statistika ikkiga bo'linardi.
// Shuning uchun `name` faqat ko'rsatish uchun, `resultName` esa saqlash uchun.
export const QUIZ_CATEGORIES = [
  {
    slug: 'nomlanishi',
    name: 'Nomlanishi',
    resultName: 'Koordinatsion birikmalarning nomlanishi',
    description: 'IUPAC nomlash qoidalari, ligandlar, formula tuzish',
    icon: '📝',
  },
  {
    slug: 'klassifikatsiyasi',
    name: 'Klassifikatsiyasi',
    resultName: 'Koordinatsion birikmalarning klassifikatsiyasi',
    description: 'Zaryad, ligand turi va sinf bo\'yicha tasnif',
    icon: '🗂️',
  },
  {
    slug: 'fazoviy',
    name: 'Fazoviy tuzilishi',
    resultName: 'Koordinatsion birikmalarning fazoviy tuzilishi',
    description: 'Geometriya, gibridlanish, VSEPR',
    icon: '🔷',
  },
  {
    slug: 'izomeriya',
    name: 'Izomeriya',
    resultName: 'Koordinatsion birikmalarning izomeriyasi',
    description: 'Tuzilish va stereoizomeriya',
    icon: '🔄',
  },
  {
    slug: 'aralash',
    name: 'Aralash',
    resultName: 'Aralash test (barcha mavzular)',
    description: 'Barcha mavzulardan aralash savollar',
    icon: '🎲',
  },
]

export const QUIZ_CATEGORY_SLUGS = QUIZ_CATEGORIES.map((c) => c.slug)

export function findQuizCategory(slug) {
  return QUIZ_CATEGORIES.find((c) => c.slug === slug) || null
}
