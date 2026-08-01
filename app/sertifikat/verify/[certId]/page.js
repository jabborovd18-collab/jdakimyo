// app/sertifikat/verify/[certId]/page.js
//
// QR kod aynan shu sahifaga olib keladi. Sertifikatni qo'lida ushlab turgan
// odam telefonda skanerlaydi va darhol javob ko'rishi kerak — shuning uchun
// server komponenti: ma'lumot sahifa bilan birga keladi, brauzerda qo'shimcha
// so'rov kutilmaydi.
import Link from 'next/link'
import { sertifikatniTekshir } from '@/lib/sertifikat'
import { sana } from '@/lib/sana'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { certId } = await params
  const natija = await sertifikatniTekshir(certId)

  if (!natija) {
    return { title: 'Sertifikat topilmadi' }
  }

  return {
    title: `${natija.certificate.fullName} — sertifikat ${natija.certificate.certId}`,
    description: `${natija.certificate.fan} — ${natija.certificate.reason}`,
  }
}

export default async function SertifikatVerify({ params }) {
  const { certId } = await params
  const natija = await sertifikatniTekshir(certId)

  if (!natija) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-slate-900/60 border border-red-800/50 rounded-2xl p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Sertifikat topilmadi</h1>
          <p className="text-purple-300 mb-2">
            <code className="font-mono text-sm bg-purple-950/70 px-2 py-1 rounded">
              {String(certId).toUpperCase()}
            </code>
          </p>
          <p className="text-purple-400 text-sm mb-6">
            Bunday raqamli sertifikat JDA KIMYO bazasida mavjud emas. Raqamni
            tekshirib qayta urinib ko'ring.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 font-semibold transition-colors"
          >
            Bosh sahifaga
          </Link>
        </div>
      </main>
    )
  }

  const { valid, invalidReason, certificate: s } = natija
  const seals = Array.isArray(s.seals) ? s.seals : []

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
          >
            JDA KIMYO
          </Link>
          <p className="text-purple-400 text-sm mt-1">Sertifikatni tekshirish</p>
        </div>

        {/* Asosiy javob — skanerlagan odam birinchi shuni ko'radi */}
        <div
          className={`rounded-2xl border p-6 text-center ${
            valid
              ? 'bg-green-950/40 border-green-700/50'
              : 'bg-red-950/40 border-red-700/50'
          }`}
        >
          <div className="text-5xl mb-3">{valid ? '✅' : '🚫'}</div>
          <h1 className={`text-2xl font-bold ${valid ? 'text-green-300' : 'text-red-300'}`}>
            {valid ? 'Sertifikat haqiqiy' : invalidReason}
          </h1>
          <p className="text-purple-300 text-sm mt-2">
            Bu yozuv JDA KIMYO bazasida saqlanadi
          </p>
        </div>

        {/* Sertifikat ma'lumotlari */}
        <div className="bg-slate-900/60 border border-purple-800/50 rounded-2xl p-6 space-y-5">
          <div>
            <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">
              Kimga berilgan
            </div>
            <div className="text-2xl font-bold text-white">{s.fullName}</div>
            {s.username && s.profilId && (
              <Link
                href={`/profil/${s.profilId}`}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                @{s.username}
              </Link>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">Fan</div>
              <div className="text-white font-semibold">{s.fan}</div>
            </div>
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">
                Nima uchun
              </div>
              <div className="text-white font-semibold">{s.reason}</div>
            </div>
          </div>

          {s.description && (
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">Tavsif</div>
              <p className="text-purple-100 text-sm leading-relaxed">{s.description}</p>
            </div>
          )}

          {(s.grade || s.score !== null || s.percentage !== null) && (
            <div className="flex flex-wrap gap-3">
              {s.grade && (
                <div className="px-4 py-2 rounded-xl bg-yellow-900/30 border border-yellow-700/40">
                  <div className="text-[10px] text-yellow-400 uppercase tracking-wider">Daraja</div>
                  <div className="text-lg font-bold text-yellow-300">{s.grade}</div>
                </div>
              )}
              {s.score !== null && (
                <div className="px-4 py-2 rounded-xl bg-blue-900/30 border border-blue-700/40">
                  <div className="text-[10px] text-blue-400 uppercase tracking-wider">Ball</div>
                  <div className="text-lg font-bold text-blue-300">{s.score}</div>
                </div>
              )}
              {s.percentage !== null && (
                <div className="px-4 py-2 rounded-xl bg-purple-900/30 border border-purple-700/40">
                  <div className="text-[10px] text-purple-400 uppercase tracking-wider">Foiz</div>
                  <div className="text-lg font-bold text-purple-300">{s.percentage}%</div>
                </div>
              )}
            </div>
          )}

          {seals.length > 0 && (
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wider mb-2">Pechatlar</div>
              <div className="flex flex-wrap gap-4">
                {seals.map((seal) => (
                  <div key={seal.url} className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={seal.url}
                      alt={seal.label || 'Pechat'}
                      className="w-20 h-20 object-contain bg-white/5 rounded-lg"
                    />
                    {seal.label && (
                      <div className="text-[10px] text-purple-400 mt-1 max-w-20">{seal.label}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-purple-800/40 pt-4 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">Raqami</div>
              <code className="font-mono text-yellow-400">{s.certId}</code>
            </div>
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">
                Berilgan sana
              </div>
              <div className="text-purple-100">{sana(s.issuedAt)}</div>
            </div>
            {s.expiresAt && (
              <div>
                <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">
                  Amal qilish muddati
                </div>
                <div className="text-purple-100">{sana(s.expiresAt)} gacha</div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-purple-500">
          Sertifikatlarni faqat JDA KIMYO administratsiyasi beradi.
          <br />
          Shubha bo'lsa{' '}
          <Link href="/hamkorlik/boglanish" className="text-purple-400 hover:text-purple-300">
            biz bilan bog'laning
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
