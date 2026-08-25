"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"

const RANGLAR = [
  { belgi: "H", atom: "Vodorod", rangNomi: "Oq", hex: "#FFFFFF", sabab: "Eng yengil element, gaz holatida rangsiz" },
  { belgi: "C", atom: "Uglerod", rangNomi: "Qora / To'q kulrang", hex: "#1A1A1A", sabab: "Grafit va ko'mir rangi" },
  { belgi: "N", atom: "Azot", rangNomi: "Moviy ko'k", hex: "#3050F8", sabab: "Suyuq havo va azotning ko'kimtir tusidan" },
  { belgi: "O", atom: "Kislorod", rangNomi: "Qizil", hex: "#FF0D0D", sabab: "Olov va yonish ramzi" },
  { belgi: "F", atom: "Ftor", rangNomi: "Och yashil", hex: "#90E050", sabab: "Ftor gazi och sariq-yashil rangda" },
  { belgi: "Cl", atom: "Xlor", rangNomi: "Och sariq-yashil", hex: "#1FF01F", sabab: "Yunoncha 'chloros' — och yashil" },
  { belgi: "Br", atom: "Brom", rangNomi: "To'q qizil-jigarrang", hex: "#A62929", sabab: "Suyuq brom qizil-qo'ng'ir rangda" },
  { belgi: "I", atom: "Yod", rangNomi: "Binafsha", hex: "#940094", sabab: "Yunoncha 'iodes' — binafsharang bug'" },
  { belgi: "S", atom: "Oltingugurt", rangNomi: "Sariq", hex: "#FFFF30", sabab: "Tabiiy oltingugurt kristallari rangi" },
  { belgi: "P", atom: "Fosfor", rangNomi: "To'q sariq", hex: "#FF8000", sabab: "Qizil va oq fosfor oraliq tusi" },
  { belgi: "Fe", atom: "Temir", rangNomi: "To'q kulrang / Zang", hex: "#808090", sabab: "Temir va zang rangi" },
  { belgi: "Cu", atom: "Mis", rangNomi: "Mis rang / Qizg'ish", hex: "#C88033", sabab: "Metall misning o'ziga xos rangi" },
  { belgi: "Co", atom: "Kobalt", rangNomi: "Ko'k-binafsha", hex: "#3D4B8C", sabab: "Kobalt ko'ki (kobalt shishasi)" },
  { belgi: "Ni", atom: "Nikel", rangNomi: "Yashil-kulrang", hex: "#5D8A6C", sabab: "Nikel(II) tuzlari odatda yashil" },
  { belgi: "Zn", atom: "Rux", rangNomi: "Kulrang", hex: "#7D7D8E", sabab: "Metall rux rangi" },
  { belgi: "Pt", atom: "Platina", rangNomi: "Kumushsimon kulrang", hex: "#D0D0E0", sabab: "Platina metall rangi" },
  { belgi: "Ag", atom: "Kumush", rangNomi: "Kumushrang", hex: "#C0C0D0", sabab: "Kumush yaltiroqligi" },
  { belgi: "Au", atom: "Oltin", rangNomi: "Oltinrang sariq", hex: "#FFD123", sabab: "Oltin tabiiy rangi" }
]

export default function CPKRanglar() {
  return (
    <MavzuLayout
      sarlavha="CPK ranglar jadvali"
      tavsif="Corey-Pauling-Koltun (CPK) xalqaro standarti • Molekulyar modellarda atomlar ranglanishi qoidalari"
      ikon="🎨"
      nishon="STANDART"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "CPK ranglar jadvali" }
      ]}
      oldingiMavzu={{ nom: "Sendvich komplekslar", havola: "/oquv/fazoviy/sendvich" }}
      keyingiMavzu={{ nom: "Fazoviy geometriyalar", havola: "/oquv/fazoviy" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 1. MA'LUMOT ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>CPK standartining tarixi</span>
        </h2>
        <p className="v3-xira text-xs sm:text-sm leading-relaxed">
          <strong>CPK ranglar tizimi</strong> — Robert Corey va Linus Pauling tomonidan 1952-yilda taklif qilingan va Walter Koltun tomonidan 1965-yilda takomillashtirilgan xalqaro standartdir. Ushbu ranglar kimyoviy elementlarning tabiiy rangi, fizik holati va tarixiy an&apos;analarga asoslangan bo&apos;lib, butun dunyo bo&apos;ylab 3D molekulyar modellarda qo&apos;llaniladi.
        </p>
      </div>

      {/* ═══ 2. JADVAL ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
          Elementlar va ularning CPK ranglari
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {RANGLAR.map((item) => (
            <div
              key={item.belgi}
              className="p-3 rounded-xl border flex items-center gap-3.5"
              style={{
                background: "var(--v3-yuza-2)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div
                className="w-8 h-8 rounded-full border shadow-xs shrink-0 flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: item.hex,
                  color: item.hex === "#FFFFFF" || item.hex === "#FFFF30" || item.hex === "#90E050" || item.hex === "#FFD123" ? "#000000" : "#FFFFFF",
                  borderColor: "rgba(0,0,0,0.15)"
                }}
              >
                {item.belgi}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold" style={{ color: "var(--v3-matn)" }}>
                  {item.atom} ({item.belgi})
                </div>
                <div className="v3-xira text-[11px] truncate">
                  {item.rangNomi} • {item.sabab}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MavzuLayout>
  )
}