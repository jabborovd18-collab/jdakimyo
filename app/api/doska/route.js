// app/api/doska/route.js
//
// Elektron doska sessiyasi: QR yaratish, holatni so'rash, tasdiqlash.
// Mantiq va sabablar lib/doska.js da.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import {
  sessiyaYarat, sessiyaniOl, tasdiqla, bekorQil, faolSessiyalar,
} from '@/lib/doska'
import { ustozPaneliOchiqmi } from '@/lib/roles'
import { soravchiIp, chekloqniTekshir, urinishniQayd, kutishMatni } from '@/lib/ip-cheklov'

/** So'rovdan qurilma va IP — telefonda "kim so'rayapti" ni ko'rsatish uchun */
function manba(request) {
  return {
    qurilma: request.headers.get('user-agent') || null,
    ip: soravchiIp(request),
  }
}

// POST — doska yangi QR so'raydi. Kirish TALAB QILINMAYDI: bu login
// oqimining boshlanishi, doskada hali hech kim kirmagan.
export async function POST(request) {
  try {
    const ip = soravchiIp(request)
    const cheklov = await chekloqniTekshir('doskaqr', ip)
    if (!cheklov.ok) {
      return NextResponse.json(
        { error: `Juda ko'p QR so'raldi. ${kutishMatni(cheklov.kutish)} dan keyin urinib ko'ring.` },
        { status: 429 }
      )
    }
    await urinishniQayd('doskaqr', ip)

    const { token, amalQiladi } = await sessiyaYarat(manba(request))
    return NextResponse.json({ success: true, token, amalQiladi })
  } catch (error) {
    // XATO MATNI CHIQARILMAYDI. Bu javob AUDITORIYADAGI EKRANGA
    // boradi: baza manzili yoki ichki yo'llar proyektorda ko'rinib
    // qolmasligi kerak. Batafsil xato faqat jurnalga yoziladi.
    console.error('[Doska POST]', error)
    return NextResponse.json(
      { error: 'Hozircha ulanib bo\'lmadi. Bir necha soniyadan keyin qayta urinib ko\'ring.' },
      { status: 503 }
    )
  }
}

// GET — holatni so'rash.
//
// `?token=` bilan: doska o'z sessiyasining holatini so'rab turadi.
// Tokensiz: telefonda kirgan odamning faol doskalari.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // ── Doska so'rayapti ──
    if (token) {
      const s = await sessiyaniOl(token)
      if (!s) return NextResponse.json({ error: 'QR topilmadi' }, { status: 404 })

      // TOKENNING O'ZI QAYTARILMAYDI: bu javob doska ekranida ochiq
      // turadigan sahifaga boradi. Faqat holat kerak.
      return NextResponse.json({
        success: true,
        holat: s.holat,
        amalQiladi: s.amalQiladi,
        tugaydi: s.tugaydi,
        // Telefonda "kim so'rayapti" ni ko'rsatish uchun. Bu doskaning
        // o'z brauzer qatori — maxfiy ma'lumot emas, lekin odam nima
        // tasdiqlayotganini bilishi kerak.
        qurilma: s.qurilma,
      })
    }

    // ── Telefon so'rayapti: mening faol doskalarim ──
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!ustozPaneliOchiqmi(session.user)) {
      return NextResponse.json({ error: 'Elektron doska faqat ustozlar uchun' }, { status: 403 })
    }

    const royxat = await faolSessiyalar(session.user.id)

    return NextResponse.json({ success: true, sessiyalar: royxat })
  } catch (error) {
    // POST bilan bir xil sabab: javob doska ekranida ko'rinishi mumkin
    console.error('[Doska GET]', error)
    return NextResponse.json(
      { error: 'Hozircha ulanib bo\'lmadi. Qayta urinib ko\'ring.' },
      { status: 503 }
    )
  }
}

// PUT — telefon egasi tasdiqlaydi
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // DOSKA SESSIYASIDAN YANGI DOSKA OCHIB BO'LMAYDI. Aks holda
    // auditoriyadagi ekrandan yana bir ekranga kirish zanjiri
    // qurilar va muddat cheklovi ma'nosini yo'qotardi.
    if (session.user.doskaTugaydi) {
      return NextResponse.json(
        { error: 'Doska rejimida yangi doska ocha olmaysiz' },
        { status: 403 }
      )
    }

    // Doska — ma'ruza uchun. Ustoz paneli huquqi bo'lmagan odamga
    // bu kerak emas va uni ochiq qoldirish ortiqcha xavf.
    if (!ustozPaneliOchiqmi(session.user)) {
      return NextResponse.json(
        { error: 'Elektron doska faqat ustozlar uchun' },
        { status: 403 }
      )
    }

    const { token, soat } = await request.json()
    if (!token) {
      return NextResponse.json({ error: 'Token kerak' }, { status: 400 })
    }

    const { davomiylik } = await tasdiqla(token, session.user.id, soat)

    return NextResponse.json({
      success: true,
      message: `✓ Doska ochildi — ${davomiylik} soat`,
      davomiylik,
    })
  } catch (error) {
    console.error('[Doska PUT]', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// DELETE — sessiyani bekor qilish (doskadan yoki telefondan)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const token = searchParams.get('token')
    if (!id && !token) {
      return NextResponse.json({ error: 'Sessiya identifikatori kerak' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)

    // `id` orqali uzish faqat oddiy (telefon) sessiyasida ruxsat etiladi.
    if (id) {
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (session.user.doskaTugaydi) {
        return NextResponse.json({ error: 'Doska rejimida boshqa doskani uza olmaysiz' }, { status: 403 })
      }
      const ok = await bekorQil(null, session.user.id, id)
      if (!ok) {
        return NextResponse.json({ error: 'Sessiya topilmadi' }, { status: 404 })
      }
      return NextResponse.json({ success: true, message: '✓ Doska sessiyasi tugatildi' })
    }

    // Telefondan yoki doskaning o'zidan uzilganda (`session?.user?.id` bor);
    // kirmagan doskada taymer tugaganda faqat `'kutilmoqda'` QR bekor qilinadi.
    const ok = await bekorQil(token, session?.user?.id || null, null)

    if (!ok) {
      return NextResponse.json({ error: 'Sessiya topilmadi' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: '✓ Doska sessiyasi tugatildi' })
  } catch (error) {
    console.error('[Doska DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
