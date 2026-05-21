"use client"

import Link from "next/link"
import { useState } from "react"

export default function MaqolaYaratish() {
  const [formData, setFormData] = useState({
    sarlavha: "",
    muallif: "",
    ilmiyDaraja: "",
    muassasa: "",
    annotatsiya: "",
    kalitSozlar: "",
    til: "uz"
  })
  const [fayl, setFayl] = useState(null)
  const [yuborildi, setYuborildi] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith(".docx")) {
        alert("Faqat DOCX formatidagi fayllar qabul qilinadi!")
        e.target.value = ""
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Fayl hajmi 10 MB dan oshmasligi kerak!")
        e.target.value = ""
        return
      }
      setFayl(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.sarlavha || !formData.muallif || !formData.annotatsiya || !fayl) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!")
      return
    }

    // Hozircha ma'lumotlarni konsolga chiqaramiz
    // Keyin Supabase ga saqlaymiz
    console.log("Yangi maqola:", { ...formData, fayl: fayl.name })
    
    setYuborildi(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/maqolalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Maqolalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">✍️ O'z maqolangizni yarating</h1>
          <p className="text-purple-400 text-sm">DOCX formatida maqola yuklang • Admin tasdiqlaydi • Plagiat tekshiriladi</p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        
        {yuborildi ? (
          /* MUVAFFAQIYATLI */
          <div className="text-center py-16">
            <div className="text-8xl mb-6">✅</div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Maqola yuborildi!</h2>
            <p className="text-purple-200 mb-8 text-lg">
              Maqolangiz admin tekshiruviga yuborildi.<br/>
              Tasdiqlangandan so'ng saytda chop etiladi.
            </p>
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="text-yellow-400 font-bold mb-3">📋 Jarayon:</h3>
              <ul className="space-y-3 text-purple-200 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✅</span> Maqola yuborildi
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">⏳</span> Plagiat tekshirilmoqda
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-400">⏳</span> Admin ko'rib chiqmoqda
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">⏳</span> Saytda chop etiladi
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setYuborildi(false)
                  setFormData({ sarlavha: "", muallif: "", ilmiyDaraja: "", muassasa: "", annotatsiya: "", kalitSozlar: "", til: "uz" })
                  setFayl(null)
                }}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all"
              >
                ✍️ Yana maqola yaratish
              </button>
              <Link href="/ilmiy/maqolalar" className="px-8 py-4 border-2 border-purple-500 rounded-xl font-semibold hover:bg-purple-800/50 transition-all">
                ← Maqolalar bo'limi
              </Link>
            </div>
          </div>
        ) : (
          /* FORMA */
          <>
            {/* Forma kartochkasi */}
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">📝 Maqola ma'lumotlari</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Sarlavha */}
                <div>
                  <label className="block text-purple-300 mb-2">
                    Sarlavha <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text"
                    name="sarlavha"
                    value={formData.sarlavha}
                    onChange={handleChange}
                    placeholder="Masalan: [Co(NH₃)₆]³⁺ kompleksining spektroskopik tahlili"
                    className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400 transition-all"
                    required
                  />
                </div>

                {/* Muallif + Ilmiy daraja */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-300 mb-2">
                      Muallif <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text"
                      name="muallif"
                      value={formData.muallif}
                      onChange={handleChange}
                      placeholder="Ism Familiya"
                      className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-purple-300 mb-2">Ilmiy daraja</label>
                    <select 
                      name="ilmiyDaraja"
                      value={formData.ilmiyDaraja}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white focus:outline-none focus:border-yellow-400 transition-all"
                    >
                      <option value="">Tanlang...</option>
                      <option value="talaba">Talaba (BSc)</option>
                      <option value="magistr">Magistr (MSc)</option>
                      <option value="phd">PhD doktorant</option>
                      <option value="dsc">Fan doktori (DSc)</option>
                      <option value="professor">Professor</option>
                    </select>
                  </div>
                </div>

                {/* Muassasa */}
                <div>
                  <label className="block text-purple-300 mb-2">Muassasa</label>
                  <input 
                    type="text"
                    name="muassasa"
                    value={formData.muassasa}
                    onChange={handleChange}
                    placeholder="Masalan: SamDU, Kimyo fakulteti"
                    className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400 transition-all"
                  />
                </div>

                {/* Til */}
                <div>
                  <label className="block text-purple-300 mb-2">Maqola tili</label>
                  <select 
                    name="til"
                    value={formData.til}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white focus:outline-none focus:border-yellow-400 transition-all"
                  >
                    <option value="uz">O'zbek tili</option>
                    <option value="ru">Rus tili</option>
                    <option value="en">Ingliz tili</option>
                  </select>
                </div>

                {/* Annotatsiya */}
                <div>
                  <label className="block text-purple-300 mb-2">
                    Annotatsiya <span className="text-red-400">*</span>
                    <span className="text-purple-500 text-xs ml-2">(100-200 so'z)</span>
                  </label>
                  <textarea 
                    name="annotatsiya"
                    value={formData.annotatsiya}
                    onChange={handleChange}
                    placeholder="Maqolangizning qisqacha mazmunini yozing..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400 transition-all resize-none"
                    required
                  />
                </div>

                {/* Kalit so'zlar */}
                <div>
                  <label className="block text-purple-300 mb-2">
                    Kalit so'zlar
                    <span className="text-purple-500 text-xs ml-2">(vergul bilan ajrating, 5-10 ta)</span>
                  </label>
                  <input 
                    type="text"
                    name="kalitSozlar"
                    value={formData.kalitSozlar}
                    onChange={handleChange}
                    placeholder="Masalan: kobalt, spektroskopiya, UB-Vis, kristall maydon"
                    className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400 transition-all"
                  />
                </div>

                {/* Fayl yuklash */}
                <div>
                  <label className="block text-purple-300 mb-2">
                    Maqola fayli (DOCX) <span className="text-red-400">*</span>
                    <span className="text-purple-500 text-xs ml-2">(max 10 MB)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="file"
                      accept=".docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileInput"
                    />
                    <label 
                      htmlFor="fileInput"
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                        fayl 
                          ? "border-green-500 bg-green-600/10" 
                          : "border-purple-600 bg-purple-800/30 hover:border-yellow-400/50"
                      }`}
                    >
                      <span className="text-2xl">{fayl ? "📄" : "📁"}</span>
                      <span className={fayl ? "text-green-400" : "text-purple-400"}>
                        {fayl ? fayl.name : "DOCX fayl tanlash uchun bosing..."}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-extrabold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105 mt-6 text-lg"
                >
                  📤 Maqolani yuborish
                </button>
              </form>
            </div>

            {/* Standartlar eslatmasi */}
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📋 Maqola standartlari:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-purple-200 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span>Sarlavha aniq va tushunarli bo'lishi kerak</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span>Annotatsiya 100-200 so'z</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span>Kalit so'zlar 5-10 ta</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span>Faqat DOCX formati</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span>Plagiat 80%+ original bo'lishi kerak</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span>Hajmi 3-15 bet</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span>Adabiyotlar ro'yxati shart</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✅</span>
                  <span>Admin tasdiqlashi kerak</span>
                </div>
              </div>
            </div>
          </>
        )}

      </section>
    </main>
  )
}