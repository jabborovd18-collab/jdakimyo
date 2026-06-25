"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import QRCode from "qrcode"

// ═══════════════════════════════════════════════════════════
// TOAST NOTIFICATION COMPONENT
// ═══════════════════════════════════════════════════════════
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: "from-green-500 to-emerald-600",
    error: "from-red-500 to-rose-600",
    warning: "from-yellow-500 to-orange-500",
    info: "from-blue-500 to-cyan-600"
  }

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  }

  return (
    <div className={`fixed top-4 right-4 z-50 bg-gradient-to-r ${colors[type]} text-white px-6 py-3 rounded-xl shadow-2xl animate-slide-in flex items-center gap-3`}>
      <span className="text-xl">{icons[type]}</span>
      <span className="font-semibold">{message}</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════
const formatDate = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ]
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
}

const generateCertificateNumber = (daraja) => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `JDA-${daraja}-${year}-${random}`
}

const getDaraja = (score) => {
  const numScore = parseInt(score)
  if (numScore >= 95) return { daraja: "A+", nomi: "Oltin+", rang: "purple" }
  if (numScore >= 85) return { daraja: "A", nomi: "Oltin", rang: "yellow" }
  if (numScore >= 75) return { daraja: "B", nomi: "Ilmiy", rang: "blue" }
  return { daraja: "C", nomi: "Asosiy", rang: "green" }
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function SertifikatYasash() {
  const [showCertificate, setShowCertificate] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [formData, setFormData] = useState({ name: "", date: "", score: "" })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const certificateRef = useRef(null)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sertifikat-form")
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        console.error("LocalStorage parse error:", e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (formData.name || formData.date || formData.score) {
      localStorage.setItem("sertifikat-form", JSON.stringify(formData))
    }
  }, [formData])

  // Generate QR code when certificate is shown
  useEffect(() => {
    if (showCertificate && formData.name) {
      const certNumber = generateCertificateNumber(getDaraja(formData.score).daraja)
      const qrData = `https://jda-kimyo.uz/sertifikat/verify/${certNumber}`
      
      QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: "#10b981",
          light: "#ffffff"
        }
      }).then(url => {
        setQrCodeDataUrl(url)
      }).catch(err => {
        console.error("QR code error:", err)
      })
    }
  }, [showCertificate, formData])

  // ═══════════════════════════════════════════════════════════
  // FORM VALIDATION
  // ═══════════════════════════════════════════════════════════
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Ism-familiya kiritilishi shart"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Ism kamida 3 ta harfdan iborat bo'lishi kerak"
    }

    if (!formData.date) {
      newErrors.date = "Sana tanlanishi shart"
    }

    if (!formData.score) {
      newErrors.score = "Natija kiritilishi shart"
    } else {
      const numScore = parseInt(formData.score)
      if (isNaN(numScore) || numScore < 0 || numScore > 100) {
        newErrors.score = "Natija 0-100 oralig'ida bo'lishi kerak"
      } else if (numScore < 70) {
        newErrors.score = "Sertifikat uchun kamida 70% kerak"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ═══════════════════════════════════════════════════════════
  // GENERATE CERTIFICATE
  // ═══════════════════════════════════════════════════════════
  const handleGenerate = () => {
    if (validateForm()) {
      setShowCertificate(true)
      setToast({ message: "Sertifikat yaratildi!", type: "success" })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setToast({ message: "Iltimos, xatoliklarni tuzating", type: "error" })
    }
  }

  // ═══════════════════════════════════════════════════════════
  // DOWNLOAD PDF
  // ═══════════════════════════════════════════════════════════
  const downloadPDF = async () => {
    const element = certificateRef.current
    if (!element || isDownloading) return
    
    setIsDownloading(true)
    setToast({ message: "PDF yaratilmoqda...", type: "info" })

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: "#1a1a2e",
        logging: false,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL("image/png", 1.0)
      const pdf = new jsPDF("landscape", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      
      const fileName = formData.name 
        ? `JDA-Sertifikat-${formData.name.replace(/\s+/g, "-")}.pdf`
        : "JDA-Sertifikat.pdf"
      
      pdf.save(fileName)
      setToast({ message: "PDF muvaffaqiyatli yuklandi!", type: "success" })
    } catch (error) {
      console.error("PDF xatolik:", error)
      setToast({ message: "PDF yaratishda xatolik yuz berdi", type: "error" })
    } finally {
      setIsDownloading(false)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // RESET FORM
  // ═══════════════════════════════════════════════════════════
  const handleReset = () => {
    setFormData({ name: "", date: "", score: "" })
    setErrors({})
    setShowCertificate(false)
    setQrCodeDataUrl("")
    localStorage.removeItem("sertifikat-form")
    setToast({ message: "Forma tozalandi", type: "info" })
  }

  const darajaInfo = getDaraja(formData.score)
  const certNumber = showCertificate ? generateCertificateNumber(darajaInfo.daraja) : ""

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* HEADER */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/sertifikat" className="hover:text-purple-300">Sertifikat</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Yaratish</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-3">
                <span className="text-3xl">🏅</span>
                Sertifikat yaratish
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                JDA KIMYO platforma sertifikatini yarating va yuklab oling
              </p>
            </div>
            <Link 
              href="/sertifikat"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Orqaga
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-8">
        
        {!showCertificate ? (
          /* ═══════════════════════════════════════════════════════════ */
          /* FORM */
          /* ═══════════════════════════════════════════════════════════ */
          <div className="max-w-md mx-auto bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <span>📝</span> Sertifikat ma'lumotlari
            </h2>
            
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-purple-300 mb-2 text-sm font-semibold">
                  Ism-familiya <span className="text-red-400">*</span>
                </label>
                <input 
                  id="name"
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value})
                    if (errors.name) setErrors({...errors, name: ""})
                  }} 
                  placeholder="Diyorbek Jabborov" 
                  className={`w-full px-4 py-3 rounded-xl bg-purple-800/50 border ${
                    errors.name ? 'border-red-500' : 'border-purple-600'
                  } text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400 transition-colors`}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-purple-300 mb-2 text-sm font-semibold">
                  Sana <span className="text-red-400">*</span>
                </label>
                <input 
                  id="date"
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => {
                    setFormData({...formData, date: e.target.value})
                    if (errors.date) setErrors({...errors, date: ""})
                  }} 
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 rounded-xl bg-purple-800/50 border ${
                    errors.date ? 'border-red-500' : 'border-purple-600'
                  } text-white focus:outline-none focus:border-yellow-400 transition-colors`}
                  aria-describedby={errors.date ? "date-error" : undefined}
                  aria-invalid={!!errors.date}
                />
                {errors.date && (
                  <p id="date-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Score */}
              <div>
                <label htmlFor="score" className="block text-purple-300 mb-2 text-sm font-semibold">
                  Natija (%) <span className="text-red-400">*</span>
                </label>
                <input 
                  id="score"
                  type="number" 
                  value={formData.score} 
                  onChange={(e) => {
                    setFormData({...formData, score: e.target.value})
                    if (errors.score) setErrors({...errors, score: ""})
                  }} 
                  placeholder="85" 
                  max="100" 
                  min="0" 
                  className={`w-full px-4 py-3 rounded-xl bg-purple-800/50 border ${
                    errors.score ? 'border-red-500' : 'border-purple-600'
                  } text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400 transition-colors`}
                  aria-describedby={errors.score ? "score-error" : "score-help"}
                  aria-invalid={!!errors.score}
                />
                {errors.score ? (
                  <p id="score-error" className="text-red-400 text-xs mt-1" role="alert">
                    {errors.score}
                  </p>
                ) : (
                  <p id="score-help" className="text-purple-500 text-xs mt-1">
                    Kamida 70% kerak (C sertifikat uchun)
                  </p>
                )}

                {/* Daraja preview */}
                {formData.score && parseInt(formData.score) >= 70 && (
                  <div className={`mt-3 p-3 rounded-lg bg-${darajaInfo.rang}-600/10 border border-${darajaInfo.rang}-500/30`}>
                    <p className={`text-${darajaInfo.rang}-400 text-sm font-semibold`}>
                      🏅 {darajaInfo.daraja} - {darajaInfo.nomi} sertifikat
                    </p>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button 
                onClick={handleGenerate} 
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-extrabold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all mt-4 shadow-lg hover:shadow-xl"
                aria-label="Sertifikat yaratish"
              >
                ✨ Sertifikat yaratish
              </button>
            </div>

            {/* Help text */}
            <div className="mt-6 p-4 bg-purple-800/30 rounded-xl border border-purple-700/30">
              <p className="text-purple-300 text-xs leading-relaxed">
                💡 <strong>Eslatma:</strong> Sertifikat yaratish uchun barcha maydonlarni to'ldiring.
                Ma'lumotlar brauzeringizda saqlanadi va sahifa yangilanganda yo'qolmaydi.
              </p>
            </div>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════ */
          /* CERTIFICATE PREVIEW */
          /* ═══════════════════════════════════════════════════════════ */
          <div className="space-y-6">
            
            {/* Certificate */}
            <div className="overflow-x-auto">
              <div 
                ref={certificateRef} 
                className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border-4 border-green-500/50 p-6 md:p-12 mx-auto"
                style={{ 
                  minHeight: "450px",
                  width: "100%",
                  maxWidth: "900px"
                }}
              >
                {/* Top border */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-${darajaInfo.rang}-600 via-${darajaInfo.rang}-400 to-${darajaInfo.rang}-600`} />
                
                {/* Bottom border */}
                <div className={`absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-${darajaInfo.rang}-600 via-${darajaInfo.rang}-400 to-${darajaInfo.rang}-600`} />

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <div className="text-[200px] font-black text-white">JDA</div>
                </div>

                <div className="text-center pt-4 relative z-10">
                  {/* Header */}
                  <div className={`text-2xl md:text-3xl font-extrabold text-${darajaInfo.rang}-400 mb-2`}>
                    🧪 JDA KIMYO
                  </div>
                  <div className={`text-sm md:text-lg text-${darajaInfo.rang}-300 uppercase tracking-[0.3em] mb-6`}>
                    Platforma sertifikati
                  </div>
                  
                  {/* Divider */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-${darajaInfo.rang}-500/50 to-transparent`} />
                    <span className={`text-${darajaInfo.rang}-500`}>◆</span>
                    <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-${darajaInfo.rang}-500/50 to-transparent`} />
                  </div>

                  {/* Certificate text */}
                  <p className="text-gray-300 text-base md:text-lg mb-3">Ushbu sertifikat</p>
                  
                  {/* Name */}
                  <div className={`border-2 border-${darajaInfo.rang}-500/30 inline-block px-6 md:px-8 py-3 mb-5`}>
                    <p className="text-xl md:text-2xl font-bold text-white">{formData.name}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm md:text-base mb-1">
                    Kompleks birikmalar kimyosi bo'yicha platforma testlarini o'rtacha
                  </p>
                  <p className={`text-2xl md:text-3xl font-extrabold text-${darajaInfo.rang}-400 my-3`}>
                    {formData.score}%
                  </p>
                  <p className="text-gray-300 text-sm md:text-base mb-6">
                    natija bilan muvaffaqiyatli topshirganligini tasdiqlaydi.
                  </p>

                  {/* Info grid */}
                  <div className={`grid grid-cols-3 gap-2 md:gap-4 text-center border-t border-${darajaInfo.rang}-500/20 pt-5`}>
                    <div>
                      <p className={`text-${darajaInfo.rang}-400 text-xs font-bold mb-1`}>Daraja</p>
                      <p className={`text-white font-bold bg-${darajaInfo.rang}-600/20 border border-${darajaInfo.rang}-500/30 rounded-full px-2 md:px-3 py-1 inline-block text-xs md:text-sm`}>
                        {darajaInfo.daraja} ({darajaInfo.nomi})
                      </p>
                    </div>
                    <div>
                      <p className={`text-${darajaInfo.rang}-400 text-xs font-bold mb-1`}>Raqami / Sana</p>
                      <p className="text-gray-300 font-mono text-[10px] md:text-xs">{certNumber}</p>
                      <p className="text-gray-300 font-mono text-[10px] md:text-xs">
                        {formatDate(formData.date)}
                      </p>
                    </div>
                    <div>
                      <p className={`text-${darajaInfo.rang}-400 text-xs font-bold mb-1`}>Muddati</p>
                      <p className="text-white font-bold text-sm md:text-base">
                        {darajaInfo.daraja === "A+" ? "Umrbod" : darajaInfo.daraja === "A" ? "5 yil" : darajaInfo.daraja === "B" ? "3 yil" : "1 yil"}
                      </p>
                    </div>
                  </div>

                  {/* QR and signature */}
                  <div className="grid grid-cols-2 gap-4 md:gap-6 mt-6 items-center">
                    <div>
                      {qrCodeDataUrl ? (
                        <img 
                          src={qrCodeDataUrl} 
                          alt="QR Code" 
                          className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-lg bg-white p-1"
                        />
                      ) : (
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg mx-auto flex items-center justify-center">
                          <span className="text-purple-500 text-xs">QR</span>
                        </div>
                      )}
                      <p className="text-gray-400 text-[10px] md:text-xs mt-1">QR kod</p>
                    </div>
                    <div className="text-right">
                      <div className={`h-px w-20 md:w-24 bg-${darajaInfo.rang}-500/50 ml-auto mb-1`} />
                      <p className="text-gray-400 text-xs md:text-sm">✍️ Diyorbek J.</p>
                      <p className="text-gray-500 text-[10px] md:text-xs">Asoschi</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <p className="text-gray-500 text-[10px] md:text-xs mt-4">
                    Platformaning ichki baholash tizimi asosida beriladi
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={downloadPDF} 
                disabled={isDownloading} 
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                aria-label="PDF yuklab olish"
              >
                {isDownloading ? "⏳ Yuklanmoqda..." : "📥 PDF yuklab olish"}
              </button>
              <button 
                onClick={handleReset} 
                className="px-8 py-4 border-2 border-purple-500 rounded-xl font-bold hover:bg-purple-800/50 transition-all"
                aria-label="Qayta yaratish"
              >
                🔄 Qayta yaratish
              </button>
            </div>

            {/* Info box */}
            <div className="max-w-2xl mx-auto bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>ℹ️</span> Sertifikat haqida
              </h3>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>PDF formatida yuklab olishingiz mumkin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>QR kod orqali onlayn tekshirish imkoniyati</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Unikal sertifikat raqami: <span className="font-mono text-yellow-400">{certNumber}</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">⚠</span>
                  <span>Bu platformaning ichki sertifikati, rasmiy hujjat emas</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </section>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #certificate, #certificate * {
            visibility: visible;
          }
          #certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </main>
  )
}