"use client"

import { useState, useEffect, useRef } from "react"
import Ikon from "@/components/Ikon"

function ovoz(turi) {
  if (typeof window === "undefined") return
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    const t = ctx.currentTime
    if (turi === "togri") {
      osc.frequency.setValueAtTime(523, t)
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.18)
      gain.gain.setValueAtTime(0.14, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      osc.start(t)
      osc.stop(t + 0.2)
    } else if (turi === "xato") {
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(220, t)
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.22)
      gain.gain.setValueAtTime(0.14, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24)
      osc.start(t)
      osc.stop(t + 0.24)
    } else {
      osc.frequency.setValueAtTime(440, t)
      gain.gain.setValueAtTime(0.08, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
      osc.start(t)
      osc.stop(t + 0.1)
    }
  } catch {
    // Audio
  }
}

export const QOSHIMCHA_KORGAZMA_NOMLAR = {
  "1.3": {
    k5: { nom: "5. Choy ekstraksiyasi", ikon: "tomchi" },
    k6: { nom: "6. Vaqt-Harorat grafigi", ikon: "formula" },
  },
  "1.4": {
    k5: { nom: "5. Mo'rili shkaf", ikon: "tolqin" },
    k6: { nom: "6. Probirkani qizdirish", ikon: "olov" },
  },
  "1.5": {
    k5: { nom: "5. Bug'latish kosachasi", ikon: "olov" },
    k6: { nom: "6. Tarozi va Pipetka", ikon: "kolba" },
  },
  "2.1": {
    k5: { nom: "5. 50ml + 50ml = 97ml", ikon: "kolba" },
    k6: { nom: "6. Kristall panjara", ikon: "kristall" },
  },
  "2.2": {
    k5: { nom: "5. Kondensatsiya", ikon: "tomchi" },
    k6: { nom: "6. Tog'da qaynash (Bosim)", ikon: "harorat" },
  },
}

const MAVZU_DATA = {
  "1.3": {
    k5: {
      formula: "20°C suvda: sekin diffuziya | 90°C qaynoq suvda: tezkor ekstraksiya",
      tugma1: "Sovuq suv (20°C)",
      tugma2: "Qaynoq suv (90°C)",
    },
    k6: {
      formula: "T (harorat) ↗ bo'lganda t (erish vaqti) ↘ teskari proporsional kamayadi",
      tugma1: "Nuqtalarni chizish",
      tugma2: "Grafikni yangilash",
    },
    o3: [
      {
        savol: "Shakar sovuq suvda 120 sekundda, qaynoq suvda 25 sekundda eridi. Bog'liq o'zgaruvchi qaysi?",
        togri: "Erish vaqti (sekund)",
        variantlar: ["Erish vaqti (sekund)", "Stakan shakli", "Xona rangi", "Suv hajmi"],
      },
      {
        savol: "45.6°C haroratni aniq o'lchash uchun qaysi vosita tanlanadi?",
        togri: "Laboratoriya termometri",
        variantlar: ["Laboratoriya termometri", "Qo'l kafti", "Ko'z bilan qarash", "Sekundomer"],
      },
      {
        savol: "Quduq suviga sovun qo'shilganda ko'pik chiqmay oq cho'kma tushdi. Sababi nima?",
        togri: "Ca²⁺ va Mg²⁺ tuzlari (Qattiq suv)",
        variantlar: ["Ca²⁺ va Mg²⁺ tuzlari (Qattiq suv)", "Suv juda toza", "Sovun muzlagan", "Idish kichik"],
      },
      {
        savol: "Adolatli tajribada nechta mustaqil o'zgaruvchi o'zgartiriladi?",
        togri: "Faqat 1 ta omil",
        variantlar: ["Faqat 1 ta omil", "Barcha omillar", "3 ta omil", "Hech qaysi"],
      },
    ],
    duel: [
      { savol: "Ilmiy tadqiqotning 1-bosqichi nima?", javob: "Kuzatish", variantlar: ["Kuzatish", "Xulosa"] },
      { savol: "Ilmiy taxmin nima deb ataladi?", javob: "Gipoteza", variantlar: ["Gipoteza", "Qonun"] },
      { savol: "Eng ko'p ko'pik qaysi suvda hosil bo'ladi?", javob: "Distillangan", variantlar: ["Distillangan", "Quduq suvi"] },
      { savol: "Erish vaqtini o'lchaydigan asbob?", javob: "Sekundomer", variantlar: ["Sekundomer", "Tarozi"] },
      { savol: "Kukun shakar bo'lak shakardan qanday eriydi?", javob: "Tezroq", variantlar: ["Tezroq", "Sekinroq"] },
      { savol: "Gipoteza nima orqali tekshiriladi?", javob: "Tajriba", variantlar: ["Tajriba", "Taxmin"] },
    ],
  },
  "1.4": {
    k5: {
      formula: "Cl₂, NO₂, SO₂ kabi zaharli gazlar faqat Mo'rili shkaf (Ventilyatsiya) ichida olinadi",
      tugma1: "Ventilyatsiyani yoqish",
      tugma2: "O'chirish",
    },
    k6: {
      formula: "Probirka 45° burchak ostida, og'zi odam yo'q tomonga qaratib qizdiriladi",
      tugma1: "To'g'ri (45° burchak)",
      tugma2: "Xato (Tik va yuzga qarab)",
    },
    o3: [
      {
        savol: "Sulfat kislotani (H₂SO₄) suyultirishda qaysi harakat to'g'ri?",
        togri: "Kislotani suvga ingichka oqimda quyish",
        variantlar: ["Kislotani suvga ingichka oqimda quyish", "Suvni kislotaga quyish", "Ikkisini qaynatish", "Chayqatib quyish"],
      },
      {
        savol: "Spirt to'kilib yonib ketsa nima bilan o'chiriladi?",
        togri: "Qalin yopinchiq yoki qum bilan",
        variantlar: ["Qalin yopinchiq yoki qum bilan", "Chelakda suv sepib", "Puflab", "Qog'oz bilan"],
      },
      {
        savol: "Teriga kislota sachraganda birinchi yordam qanday?",
        togri: "10-15 daqiqa oqova suvda yuvish",
        variantlar: ["10-15 daqiqa oqova suvda yuvish", "Yog' surtish", "Quruq artish", "Spirt quyish"],
      },
      {
        savol: "Bosh suyagi va suyaklar chizilgan belgi nimani bildiradi?",
        togri: "Zaharli (Toksik) modda",
        variantlar: ["Zaharli (Toksik) modda", "Tez yonuvchi", "Radioaktiv", "O'yuvchi"],
      },
    ],
    duel: [
      { savol: "Kislota va suv qoidasi:", javob: "Avval suv, keyin kislota", variantlar: ["Avval suv, keyin kislota", "Avval kislota, keyin suv"] },
      { savol: "Moddani hidlash usuli:", javob: "Kaft bilan yelpiash", variantlar: ["Kaft bilan yelpiash", "Burun tiqib hidlash"] },
      { savol: "Laboratoriyada moddani tatib ko'rish:", javob: "Qat'iyan man etiladi", variantlar: ["Qat'iyan man etiladi", "Ozroq mumkin"] },
      { savol: "Spirtovka alangasi qanday o'chiriladi?", javob: "Qopqoq yopib", variantlar: ["Qopqoq yopib", "Og'izda puflab"] },
      { savol: "Zaharli gazlar qayerda sinaladi?", javob: "Mo'rili shkafda", variantlar: ["Mo'rili shkafda", "Ochiq partada"] },
      { savol: "Ko'zni himoyalovchi vosita:", javob: "Himoya ko'zoynagi", variantlar: ["Himoya ko'zoynagi", "Qo'lqop"] },
    ],
  },
  "1.5": {
    k5: {
      formula: "NaCl(aq) → H₂O↑ (bug'lanadi) + NaCl(s) (oq tuz kristallari kosachada qoladi)",
      tugma1: "Bug'latishni boshlash",
      tugma2: "Qayta to'ldirish",
    },
    k6: {
      formula: "Analitik tarozi: 0.01 g aniqlik | O'lchov silindri: pastki menisk bo'yicha",
      tugma1: "Modda qo'shish (+2.50 g)",
      tugma2: "Tarozini nollash (TARE)",
    },
    o3: [
      {
        savol: "Suyuqlik hajmini aniq o'lchash uchun qaysi idish ishlatiladi?",
        togri: "O'lchov silindri (Menzurka)",
        variantlar: ["O'lchov silindri (Menzurka)", "Chinni hovoncha", "Shisha tayoqcha", "Voronka"],
      },
      {
        savol: "Qattiq moddalarni maydalab kukun qilish jihozi qaysi?",
        togri: "Chinni hovoncha va dasta",
        variantlar: ["Chinni hovoncha va dasta", "Probirka", "Byuretka", "Kolba"],
      },
      {
        savol: "Spirtovka alangasining eng issiq (1000°C) qismi qaysi?",
        togri: "3-zona (Tashqi zona)",
        variantlar: ["3-zona (Tashqi zona)", "1-zona (Ichki qoramtir)", "Pilik uchi", "Idish tubi"],
      },
      {
        savol: "Qum va suv aralashmasini ajratish usuli qanday ataladi?",
        togri: "Filtratsiya (Suzish)",
        variantlar: ["Filtratsiya (Suzish)", "Sublimatsiya", "Suyuqlantirish", "Maydalash"],
      },
    ],
    duel: [
      { savol: "Meniskning qaysi qismiga qarab hajm o'qiladi?", javob: "Pastki menisk", variantlar: ["Pastki menisk", "Yuqori qirrasi"] },
      { savol: "Kichik miqdordagi reaksiyalar o'tkaziladigan shisha naycha?", javob: "Probirka", variantlar: ["Probirka", "Hovoncha"] },
      { savol: "Eritmadan tuzni ajratib olish idishi?", javob: "Bug'latish kosachasi", variantlar: ["Bug'latish kosachasi", "Voronka"] },
      { savol: "Filtr qog'ozi qaysi jihoz ichiga joylanadi?", javob: "Voronka", variantlar: ["Voronka", "Menzurka"] },
      { savol: "Probirkani qizdirishda nimada ushlanadi?", javob: "Qisqichda", variantlar: ["Qisqichda", "Qo'lda"] },
      { savol: "Alanganing eng sovuq (300°C) qismi?", javob: "Ichki 1-zona", variantlar: ["Ichki 1-zona", "Tashqi 3-zona"] },
    ],
  },
  "2.1": {
    k5: {
      formula: "50 ml Suv (H₂O) + 50 ml Spirt (C₂H₅OH) = 97 ml! (Molekulalar bo'shliqlarga joylashadi)",
      tugma1: "Spirt va suvni qo'shish",
      tugma2: "Alohida idishlarga qaytarish",
    },
    k6: {
      formula: "NaCl (Osh tuzi) kubik kristall panjarasi — tugunlarda Na⁺ va Cl⁻ ionlari tebranadi",
      tugma1: "Qizdirish (Tebranish ↗)",
      tugma2: "Sovitish (Tebranish ↘)",
    },
    o3: [
      {
        savol: "50 ml suv va 50 ml spirt aralashtirilganda hajm 97 ml chiqishi nimani isbotlaydi?",
        togri: "Zarrachalar orasida bo'shliqlar borligini",
        variantlar: ["Zarrachalar orasida bo'shliqlar borligini", "Suyuqlik bug'lanib ketganini", "Idish kengayganini", "Massa yo'qolganini"],
      },
      {
        savol: "NH₃ (17 g/mol) va HCl (36.5 g/mol) gazlaridan qaysi biri tezroq diffuziyalanadi?",
        togri: "Yengil ammiak (NH₃)",
        variantlar: ["Yengil ammiak (NH₃)", "Og'ir vodorod xlorid (HCl)", "Ikkalasi teng", "Diffuziya bo'lmaydi"],
      },
      {
        savol: "Qaysi agregat holatdagi modda shpritsda oson siqiladi?",
        togri: "Gaz (Havo)",
        variantlar: ["Gaz (Havo)", "Suyuqlik (Suv)", "Qattiq jism (Qum)", "Temir"],
      },
      {
        savol: "Broun harakati harorat oshganda qanday o'zgaradi?",
        togri: "Tezlashadi",
        variantlar: ["Tezlashadi", "To'xtaydi", "O'zgarmaydi", "Muzlaydi"],
      },
    ],
    duel: [
      { savol: "Hajm va shaklini saqlaydigan holat?", javob: "Qattiq", variantlar: ["Qattiq", "Gaz"] },
      { savol: "Hajmini saqlab, idish shaklini oladigan holat?", javob: "Suyuq", variantlar: ["Suyuq", "Qattiq"] },
      { savol: "Eng tez diffuziya qaysi muhitda boradi?", javob: "Gazlarda", variantlar: ["Gazlarda", "Qattiq jismda"] },
      { savol: "Ammiak va HCl to'qnashganda nima hosil bo'ladi?", javob: "NH₄Cl (Oq tutun)", variantlar: ["NH₄Cl (Oq tutun)", "Suv"] },
      { savol: "Zarrachalar orasidagi masofa eng katta holat?", javob: "Gaz", variantlar: ["Gaz", "Suyuq"] },
      { savol: "Broun harakatini kim kashf etgan?", javob: "Robert Broun", variantlar: ["Robert Broun", "Lavuazye"] },
    ],
  },
  "2.2": {
    k5: {
      formula: "H₂O(g) (Issiq bug') → sovuq oyna sirtida → H₂O(l) (Suv tomchilari) + Q (Ekzotermik)",
      tugma1: "Bug'ni oynaga yo'naltirish",
      tugma2: "Oynani artish",
    },
    k6: {
      formula: "Dengiz sathida (1 atm): Suv 100°C da qaynaydi | Everest tog'ida (0.33 atm): 71°C da qaynaydi",
      tugma1: "Tog' cho'qqisi (Past bosim)",
      tugma2: "Dengiz sathi (Normal bosim)",
    },
    o3: [
      {
        savol: "Muz 0°C da eriyotgan vaqtda (erish platosida) harorat nima uchun ko'tarilmaydi?",
        togri: "Issiqlik kristall panjara bog'larini uzishga sarflanadi",
        variantlar: ["Issiqlik kristall panjara bog'larini uzishga sarflanadi", "Spirtovka o'chib qoladi", "Termometr buziladi", "Suv sovib qoladi"],
      },
      {
        savol: "Qattiq yod (I₂) yoki quruq muzning (CO₂) suyuqlanmasdan gazga aylanishi nima?",
        togri: "Sublimatsiya",
        variantlar: ["Sublimatsiya", "Kondensatsiya", "Kristallanish", "Qaynash"],
      },
      {
        savol: "Toza suvga osh tuzi (NaCl) qo'shilsa, uning muzlash va qaynash nuqtasi qanday o'zgaradi?",
        togri: "Muzlash 0°C dan pasayadi, qaynash 100°C dan oshadi",
        variantlar: ["Muzlash 0°C dan pasayadi, qaynash 100°C dan oshadi", "O'zgarmaydi", "50°C da qaynaydi", "Darhol muzlaydi"],
      },
      {
        savol: "Gazning sovib suyuqlikka aylanishi qanday termodinamik jarayon?",
        togri: "Ekzotermik (Issiqlik ajraladi)",
        variantlar: ["Ekzotermik (Issiqlik ajraladi)", "Endotermik (Issiqlik yutiladi)", "Kimyoviy reaksiya", "Sublimatsiya"],
      },
    ],
    duel: [
      { savol: "Qattiqdan to'g'ri gazga o'tish?", javob: "Sublimatsiya", variantlar: ["Sublimatsiya", "Kondensatsiya"] },
      { savol: "Gazdan suyuqlikka o'tish?", javob: "Kondensatsiya", variantlar: ["Kondensatsiya", "Erish"] },
      { savol: "Sof suvning normal qaynash harorati?", javob: "100°C", variantlar: ["100°C", "90°C"] },
      { savol: "Muzning erishi qanday jarayon?", javob: "Endotermik", variantlar: ["Endotermik", "Ekzotermik"] },
      { savol: "Sirt yuzasi kattalashsa bug'lanish tezligi?", javob: "Ortadi", variantlar: ["Ortadi", "Kamayadi"] },
      { savol: "Quruq muzning kimyoviy formulasi?", javob: "CO₂ (qattiq)", variantlar: ["CO₂ (qattiq)", "H₂O (muz)"] },
    ],
  },
}

export function QoshimchaKorgazma({ mavzu, rejim }) {
  const canvasRef = useRef(null)
  const [faol, setFaol] = useState(false)
  const cfg = MAVZU_DATA[mavzu]?.[rejim]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !cfg) return
    const ctx = canvas.getContext("2d")
    let animId
    let f = 0

    const chiz = () => {
      f++
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
      }
      ctx.save()
      ctx.scale(dpr, dpr)
      const W = rect.width
      const H = rect.height
      const CX = W / 2
      const CY = H / 2

      ctx.fillStyle = "#030614"
      ctx.fillRect(0, 0, W, H)

      // Mavzu va rejimga xos jonli mexanizm chizmasi
      if (mavzu === "1.3" && rejim === "k5") {
        // 2 ta stakan: 20°C vs 90°C choy diffuziyasi
        const rAlpha = faol ? Math.min(0.75, (f % 300) / 140) : 0.15
        ;[-110, 110].forEach((dx, idx) => {
          const x = CX + dx
          ctx.strokeStyle = "#94a3b8"
          ctx.lineWidth = 3
          ctx.strokeRect(x - 50, CY - 55, 100, 125)
          const alpha = idx === 1 ? (faol ? 0.72 : 0.25) : rAlpha * 0.35
          ctx.fillStyle = `rgba(217, 119, 6, ${alpha})`
          ctx.fillRect(x - 47, CY - 25, 94, 92)
          ctx.fillStyle = "#fde047"
          ctx.font = 'bold 13px "Times New Roman", serif'
          ctx.textAlign = "center"
          ctx.fillText(idx === 0 ? "20°C (Sekin)" : "90°C (Tez ekstraksiya)", x, CY - 68)
        })
      } else if (mavzu === "1.3" && rejim === "k6") {
        // Harorat va erish vaqti egri chizig'i
        ctx.strokeStyle = "#334155"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(80, 40)
        ctx.lineTo(80, H - 55)
        ctx.lineTo(W - 60, H - 55)
        ctx.stroke()

        const pts = [
          [110, 75, "20°C (110s)"],
          [210, 135, "40°C (65s)"],
          [320, 195, "60°C (35s)"],
          [430, 240, "80°C (16s)"],
        ]
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 3
        ctx.beginPath()
        pts.forEach(([px, py], i) => {
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.stroke()
        pts.forEach(([px, py, lbl]) => {
          ctx.beginPath()
          ctx.arc(px, py, 6, 0, Math.PI * 2)
          ctx.fillStyle = faol ? "#4ade80" : "#facc15"
          ctx.fill()
          ctx.fillStyle = "#e2e8f0"
          ctx.font = 'bold 12px "Times New Roman", serif'
          ctx.fillText(lbl, px + 10, py - 8)
        })
      } else if (mavzu === "1.4" && rejim === "k5") {
        // Mo'rili shkaf
        ctx.strokeStyle = "#38bdf8"
        ctx.lineWidth = 3
        ctx.strokeRect(CX - 130, 35, 260, H - 90)
        // Quvur
        ctx.fillStyle = "#1e293b"
        ctx.fillRect(CX - 35, 10, 70, 28)
        // Gaz zarrachalari yuqoriga tortilishi
        for (let i = 0; i < 22; i++) {
          const gy = faol ? ((H - 95 - ((f * 2.2 + i * 18) % (H - 125)))) : CY + 25 - (i % 5) * 12
          const gx = CX + Math.sin(f * 0.05 + i) * (faol ? 22 : 65)
          ctx.beginPath()
          ctx.arc(gx, gy, 5, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(163, 230, 53, 0.7)"
          ctx.fill()
        }
      } else if (mavzu === "1.4" && rejim === "k6") {
        // Probirkani 45 gradus qizdirish
        ctx.save()
        ctx.translate(CX, CY + 20)
        ctx.rotate(faol ? -Math.PI / 4 : 0)
        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 3
        ctx.strokeRect(-14, -90, 28, 110)
        ctx.fillStyle = "rgba(56, 189, 248, 0.4)"
        ctx.fillRect(-11, -30, 22, 48)
        ctx.restore()

        // Olov
        ctx.beginPath()
        ctx.arc(CX - (faol ? 32 : 0), CY + 58, 14 + Math.sin(f * 0.2) * 2, 0, Math.PI * 2)
        ctx.fillStyle = "#f97316"
        ctx.fill()
      } else if (mavzu === "1.5" && rejim === "k5") {
        // Bug'latish kosachasi
        ctx.beginPath()
        ctx.arc(CX, CY, 75, 0, Math.PI)
        ctx.strokeStyle = "#f8fafc"
        ctx.lineWidth = 4
        ctx.stroke()

        if (!faol) {
          ctx.fillStyle = "rgba(56, 189, 248, 0.35)"
          ctx.beginPath()
          ctx.arc(CX, CY + 10, 68, 0, Math.PI)
          ctx.fill()
        } else {
          // Oq NaCl tuz kristallari
          for (let i = -45; i <= 45; i += 9) {
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(CX + i, CY + 52 - Math.abs(i) * 0.35, 6, 6)
          }
        }
        // Pastda alanga
        ctx.beginPath()
        ctx.arc(CX, CY + 105, 14 + Math.sin(f * 0.25) * 2, 0, Math.PI * 2)
        ctx.fillStyle = "#f97316"
        ctx.fill()
      } else if (mavzu === "1.5" && rejim === "k6") {
        // Elektron tarozi
        ctx.fillStyle = "#1e293b"
        ctx.fillRect(CX - 100, CY + 25, 200, 50)
        ctx.strokeStyle = "#38bdf8"
        ctx.strokeRect(CX - 100, CY + 25, 200, 50)
        ctx.fillStyle = "#4ade80"
        ctx.font = 'bold 22px "Times New Roman", monospace'
        ctx.textAlign = "center"
        ctx.fillText(faol ? "2.50 g" : "0.00 g", CX, CY + 57)
        if (faol) {
          ctx.fillStyle = "#38bdf8"
          ctx.beginPath()
          ctx.arc(CX, CY + 8, 16, Math.PI, 0)
          ctx.fill()
        }
      } else if (mavzu === "2.1" && rejim === "k5") {
        // 50 ml + 50 ml = 97 ml menzurka
        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 3
        ctx.strokeRect(CX - 38, 45, 76, H - 105)
        const hRatio = faol ? 0.82 : 0.45
        ctx.fillStyle = faol ? "rgba(168, 85, 247, 0.45)" : "rgba(56, 189, 248, 0.4)"
        const fH = (H - 110) * hRatio
        ctx.fillRect(CX - 35, H - 62 - fH, 70, fH)
        ctx.fillStyle = "#fde047"
        ctx.font = 'bold 16px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText(faol ? "Hajm: 97 ml (100 ml emas!)" : "50 ml H₂O + 50 ml Spirt", CX, 32)
      } else if (mavzu === "2.1" && rejim === "k6") {
        // Kristall panjara
        const amp = faol ? 4.5 : 1.0
        for (let r = -2; r <= 2; r++) {
          for (let c = -3; c <= 3; c++) {
            const x = CX + c * 42 + Math.sin(f * 0.2 + r * c) * amp
            const y = CY + r * 42 + Math.cos(f * 0.2 + r + c) * amp
            ctx.beginPath()
            ctx.arc(x, y, (r + c) % 2 === 0 ? 9 : 12, 0, Math.PI * 2)
            ctx.fillStyle = (r + c) % 2 === 0 ? "#38bdf8" : "#4ade80"
            ctx.fill()
          }
        }
      } else if (mavzu === "2.2" && rejim === "k5") {
        // Kondensatsiya
        ctx.fillStyle = "#334155"
        ctx.fillRect(CX - 90, 42, 180, 12)
        if (faol) {
          for (let i = -70; i <= 70; i += 20) {
            const ty = 58 + ((f * 1.4 + Math.abs(i) * 3) % 130)
            ctx.beginPath()
            ctx.arc(CX + i, ty, 4.5, 0, Math.PI * 2)
            ctx.fillStyle = "#38bdf8"
            ctx.fill()
          }
        }
      } else {
        // 2.2 k6: Tog'da qaynash (Bosim)
        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 3
        ctx.strokeRect(CX - 55, CY - 55, 110, 125)
        ctx.fillStyle = "rgba(56, 189, 248, 0.35)"
        ctx.fillRect(CX - 52, CY - 15, 104, 82)
        for (let i = 0; i < 14; i++) {
          const by = CY + 55 - ((f * 2 + i * 15) % 68)
          ctx.beginPath()
          ctx.arc(CX - 35 + (i % 7) * 12, by, 4, 0, Math.PI * 2)
          ctx.fillStyle = "#ffffff"
          ctx.fill()
        }
        ctx.fillStyle = "#fde047"
        ctx.font = 'bold 18px "Times New Roman", serif'
        ctx.textAlign = "center"
        ctx.fillText(
          faol ? "Everest tog'i (0.33 atm): 71°C da qaynaydi!" : "Dengiz sathi (1 atm): 100°C da qaynaydi",
          CX,
          CY - 75
        )
      }

      ctx.font = 'bold 13px "Times New Roman", serif'
      ctx.fillStyle = "#fde047"
      ctx.textAlign = "center"
      ctx.fillText(cfg.formula, CX, H - 15)

      ctx.restore()
      animId = requestAnimationFrame(chiz)
    }

    chiz()
    return () => cancelAnimationFrame(animId)
  }, [mavzu, rejim, faol, cfg])

  if (!cfg) return null

  return (
    <div className="space-y-3">
      <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-blue-900/60 bg-[#030612] shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      <div className="p-3.5 rounded-2xl border border-blue-800/50 bg-[#060b22] flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setFaol(true)
            ovoz("togri")
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm"
        >
          {cfg.tugma1}
        </button>
        <button
          type="button"
          onClick={() => {
            setFaol(false)
            ovoz("bosqich")
          }}
          className="px-4 py-2.5 rounded-xl border border-blue-800 bg-[#081236] text-blue-200 font-bold text-xs sm:text-sm"
        >
          {cfg.tugma2}
        </button>
      </div>
    </div>
  )
}

export function QoshimchaOyin({ mavzu, rejim }) {
  const data = MAVZU_DATA[mavzu]
  const [indeks, setIndeks] = useState(0)
  const [tanlov, setTanlov] = useState(null)
  const [ball, setBall] = useState(0)

  const [duelIdx, setDuelIdx] = useState(0)
  const [g1, setG1] = useState(0)
  const [g2, setG2] = useState(0)
  const [navbat, setNavbat] = useState(1)
  const [tugadi, setTugadi] = useState(false)

  if (!data) return null

  if (rejim === "o3") {
    const savollar = data.o3
    const joriy = savollar[indeks]
    return (
      <div className="p-5 sm:p-6 rounded-3xl border border-blue-800/60 bg-[#060b22] space-y-4">
        <div className="flex items-center justify-between border-b border-blue-900/50 pb-3">
          <span className="text-xs sm:text-sm font-bold text-cyan-300">
            Topshiriq: {indeks + 1} / {savollar.length}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-bold text-xs">
            Ball: {ball}
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#081236] text-center">
          <h3 className="text-base sm:text-xl font-bold text-white">{joriy.savol}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {joriy.variantlar.map((v) => {
            const togri = v === joriy.togri
            let stil = "border-blue-800 bg-[#081236] text-blue-100 hover:border-yellow-400"
            if (tanlov !== null) {
              if (togri) stil = "border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-400/40"
              else if (tanlov === v) stil = "border-rose-500 bg-rose-950/60 text-rose-200"
            }
            return (
              <button
                key={v}
                type="button"
                onClick={() => {
                  if (tanlov !== null) return
                  setTanlov(v)
                  if (togri) {
                    setBall((b) => b + 25)
                    ovoz("togri")
                  } else {
                    ovoz("xato")
                  }
                }}
                className={`p-4 rounded-2xl border font-bold text-sm sm:text-base transition text-left flex items-center justify-between ${stil}`}
              >
                <span>{v}</span>
                {tanlov !== null && togri && <Ikon nom="tasdiq" olcham={18} className="text-emerald-400" />}
              </button>
            )
          })}
        </div>

        {tanlov !== null && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (indeks + 1 < savollar.length) {
                  setIndeks((i) => i + 1)
                  setTanlov(null)
                } else {
                  setIndeks(0)
                  setTanlov(null)
                  setBall(0)
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm"
            >
              {indeks + 1 < savollar.length ? "Keyingisi →" : "Qayta boshlash"}
            </button>
          </div>
        )}
      </div>
    )
  }

  const duelSavollar = data.duel
  const joriyDuel = duelSavollar[duelIdx]
  const javobBer = (guruh, v) => {
    if (tugadi || guruh !== navbat) return
    if (v === joriyDuel.javob) {
      if (guruh === 1) setG1((b) => b + 10)
      else setG2((b) => b + 10)
      ovoz("togri")
    } else {
      ovoz("xato")
    }
    if (duelIdx + 1 < duelSavollar.length) {
      setDuelIdx((i) => i + 1)
      setNavbat(guruh === 1 ? 2 : 1)
    } else {
      setTugadi(true)
    }
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl border border-blue-800/60 bg-[#060b22] space-y-4">
      {!tugadi ? (
        <>
          <div className="p-4 rounded-2xl border border-yellow-500/40 bg-[#081236] text-center space-y-1">
            <div className="text-xs font-bold text-yellow-400">
              {duelIdx + 1} / {duelSavollar.length} — Navbat: {navbat}-GURUH
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white">{joriyDuel.savol}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`p-5 rounded-3xl border-2 space-y-3 transition ${
                navbat === 1 ? "border-cyan-400 bg-cyan-950/30 shadow-lg" : "border-blue-900/40 bg-[#04081c] opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 text-base">1-GURUH</span>
                <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 font-bold text-sm">{g1} ball</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {joriyDuel.variantlar.map((v) => (
                  <button
                    key={v}
                    type="button"
                    disabled={navbat !== 1}
                    onClick={() => javobBer(1, v)}
                    className="p-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/20 hover:bg-cyan-500/35 text-white font-bold text-sm sm:text-base transition active:scale-95"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`p-5 rounded-3xl border-2 space-y-3 transition ${
                navbat === 2 ? "border-amber-400 bg-amber-950/30 shadow-lg" : "border-blue-900/40 bg-[#04081c] opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-base">2-GURUH</span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 font-bold text-sm">{g2} ball</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {joriyDuel.variantlar.map((v) => (
                  <button
                    key={v}
                    type="button"
                    disabled={navbat !== 2}
                    onClick={() => javobBer(2, v)}
                    className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/20 hover:bg-amber-500/35 text-white font-bold text-sm sm:text-base transition active:scale-95"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6 space-y-4">
          <h3 className="text-2xl font-bold text-yellow-300">
            {g1 > g2 ? "1-GURUH G'OLIB!" : g2 > g1 ? "2-GURUH G'OLIB!" : "DURANG!"}
          </h3>
          <div className="text-lg font-bold text-white">
            1-Guruh: {g1} ball | 2-Guruh: {g2} ball
          </div>
          <button
            type="button"
            onClick={() => {
              setDuelIdx(0)
              setG1(0)
              setG2(0)
              setNavbat(1)
              setTugadi(false)
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-sm"
          >
            Qayta bellashish
          </button>
        </div>
      )}
    </div>
  )
}
