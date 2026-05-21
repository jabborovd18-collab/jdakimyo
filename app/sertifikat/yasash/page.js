"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

export default function Sertifikat() {
  const [showCertificate, setShowCertificate] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [formData, setFormData] = useState({ name: "", date: "", score: "" })
  const certificateRef = useRef(null)

  const handleGenerate = () => {
    if (formData.name && formData.date && formData.score) {
      setShowCertificate(true)
    } else {
      alert("Iltimos, barcha maydonlarni to'ldiring!")
    }
  }

  const downloadPDF = async () => {
    const element = certificateRef.current
    if (!element || isDownloading) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#1a1a2e",
        logging: false
      })
      
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("landscape", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      
      const fileName = formData.name 
        ? `JDA-Sertifikat-${formData.name.replace(/\s+/g, "-")}.pdf`
        : "JDA-Sertifikat.pdf"
      
      pdf.save(fileName)
    } catch (error) {
      console.error("PDF xatolik:", error)
      alert("PDF yaratishda xatolik yuz berdi")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/" className="text-purple-400 hover:text-purple-300 text-lg">← Bosh sahifa</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🏅 Sertifikat</h1>
          <p className="text-purple-400 text-sm">JDA KIMYO platforma sertifikati</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {!showCertificate ? (
          <div className="max-w-md mx-auto bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Sertifikat ma'lumotlari</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-300 mb-2">Ism-familiya</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Diyorbek Jabborov" className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Sana</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white focus:outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Natija (%)</label>
                <input type="number" value={formData.score} onChange={(e) => setFormData({...formData, score: e.target.value})} placeholder="85" max="100" min="0" className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400" />
              </div>
              <button onClick={handleGenerate} className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-extrabold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all mt-4">
                ✨ Sertifikat yaratish
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div ref={certificateRef} className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border-4 border-green-500/50 p-8 md:p-12" style={{ minHeight: "450px" }}>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-green-400 to-green-600" />
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-green-400 to-green-600" />

              <div className="text-center pt-4">
                <div className="text-3xl font-extrabold text-green-400 mb-2">🧪 JDA KIMYO</div>
                <div className="text-lg text-green-300 uppercase tracking-[0.3em] mb-6">Platforma sertifikati</div>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                  <span className="text-green-500">◆</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                </div>

                <p className="text-gray-300 text-lg mb-3">Ushbu sertifikat</p>
                
                <div className="border-2 border-green-500/30 inline-block px-8 py-3 mb-5">
                  <p className="text-2xl font-bold text-white">{formData.name}</p>
                </div>

                <p className="text-gray-300 text-base mb-1">Kompleks birikmalar kimyosi bo'yicha platforma testlarini o'rtacha</p>
                <p className="text-3xl font-extrabold text-green-400 my-3">{formData.score}%</p>
                <p className="text-gray-300 text-base mb-6">natija bilan muvaffaqiyatli topshirganligini tasdiqlaydi.</p>

                <div className="grid grid-cols-3 gap-4 text-center border-t border-green-500/20 pt-5">
                  <div>
                    <p className="text-green-400 text-xs font-bold mb-1">Daraja</p>
                    <p className="text-white font-bold bg-green-600/20 border border-green-500/30 rounded-full px-3 py-1 inline-block text-sm">C (Asosiy)</p>
                  </div>
                  <div>
                    <p className="text-green-400 text-xs font-bold mb-1">Raqami / Sana</p>
                    <p className="text-gray-300 font-mono text-xs">JDA-C-{new Date().getFullYear()}-0042</p>
                    <p className="text-gray-300 font-mono text-xs">{formData.date}</p>
                  </div>
                  <div>
                    <p className="text-green-400 text-xs font-bold mb-1">Muddati</p>
                    <p className="text-white font-bold">1 yil</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6 items-center">
                  <div>
                    <div className="w-16 h-16 bg-white rounded-lg mx-auto" />
                    <p className="text-gray-400 text-xs mt-1">QR kod</p>
                  </div>
                  <div className="text-right">
                    <div className="h-px w-24 bg-green-500/50 ml-auto mb-1" />
                    <p className="text-gray-400 text-sm">✍️ Diyorbek J.</p>
                    <p className="text-gray-500 text-xs">Asoschi</p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs mt-4">Platformaning ichki baholash tizimi asosida beriladi</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={downloadPDF} disabled={isDownloading} className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50">
                {isDownloading ? "⏳ Yuklanmoqda..." : "📥 PDF yuklab olish"}
              </button>
              <button onClick={() => setShowCertificate(false)} className="px-8 py-4 border-2 border-purple-500 rounded-xl font-bold hover:bg-purple-800/50 transition-all">
                🔄 Qayta yaratish
              </button>
            </div>
          </div>
        )}

      </section>
    </main>
  )
}