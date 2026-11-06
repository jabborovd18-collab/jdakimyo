// app/hamkorlik/[slug]/page.js
// Barcha eski hamkorlik testlari to'liq yangi Milliy Sertifikat markaziga yo'naltirilgan.
import { redirect } from "next/navigation"

export default function HamkorlikTestiRedirect() {
  redirect("/milliy-sertifikat")
}
