// components/SertifikatTekshiruvKorinish.jsx
//
// Yagona V4 Safir va Oltin sertifikat tekshiruv ko'rinishi.
// /sertifikat/verify/[certId] va /milliy-sertifikat/tekshir/[id] ikkalasi ham shu
// komponentni render qiladi — eski QR kodlar ham buzilmaydi.

import Link from 'next/link'
import Ikon from './Ikon'
import SertifikatYuklab from './SertifikatYuklab'
import SertifikatNusxalaTugma from './SertifikatNusxalaTugma'
import { sana } from '@/lib/sana'
import { TAYYORGARLIK_OGOHLANTIRISH } from '@/lib/milliy-sertifikat-data'
import {
  SERTIFIKAT_TURLARI,
  ajratSertifikatMuhrlar,
  ajratSertifikatTavsifi,
  formatAmalMuddati,
  sertifikatHolati,
  sertifikatTuriAniqlash,
} from '@/lib/sertifikat-tahlil'

function qisqaKalibrlashNomi(usuli) {
  if (usuli === 'cml_kohort') return 'Kohort CML'
  if (usuli === 't_shkala') return 'T-shkala'
  return 'Rasch IRT'
}

export default function SertifikatTekshiruvKorinish({ natija, qidiruvId }) {
  const kod = String(qidiruvId || '').trim().toUpperCase() || 'JDA-0000'

  if (!natija || !natija.certificate) {
    return (
      <main className="ms-akademik ms-fon min-h-screen flex flex-col justify-between text-white relative overflow-x-hidden p-4 sm:p-6">
        <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <header className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-sky-400/25 pb-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-sky-100 hover:text-white transition px-3.5 py-1.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35"
          >
            <Ikon nom="chap" olcham={15} />
            <span>Bosh sahifa</span>
          </Link>
          <span className="text-xs font-mono text-amber-300 font-semibold">
            JDA KIMYO
          </span>
        </header>

        <div className="max-w-lg mx-auto w-full my-10 relative z-10 space-y-5">
          <div className="ms-karta p-6 sm:p-8 rounded-3xl border-2 border-rose-400/50 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/50 flex items-center justify-center mx-auto">
              <Ikon nom="taqiq" olcham={28} />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-rose-200">
                Sertifikat topilmadi
              </h1>
              <p className="font-mono text-xs sm:text-sm text-amber-300 bg-[#081236] border border-sky-400/30 rounded-xl px-3 py-1.5 inline-block">
                {kod}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-1">
              <Link
                href="/sertifikat"
                className="ms-tugma-oltin px-5 py-2.5 rounded-xl border border-amber-200/80 text-xs font-bold inline-flex items-center gap-2"
              >
                <Ikon nom="qidiruv" olcham={14} />
                <span>Qayta qidirish</span>
              </Link>
              <Link
                href="/milliy-sertifikat"
                className="px-4 py-2.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35 text-xs font-semibold text-sky-100 inline-flex items-center gap-1.5"
              >
                <Ikon nom="atom" olcham={14} />
                <span>Sinovlar</span>
              </Link>
            </div>
          </div>
        </div>

        <footer className="text-center text-[11px] text-sky-200/80 border-t border-sky-400/20 pt-4 relative z-10 flex items-center justify-center gap-2">
          <span>JDA KIMYO &copy; {new Date().getFullYear()}</span>
          <span>·</span>
          <Link href="/hamkorlik/boglanish" className="text-amber-300 hover:underline">
            Bog&apos;lanish
          </Link>
        </footer>
      </main>
    )
  }

  const s = natija.certificate
  const { isMs, meta, matn } = ajratSertifikatTavsifi(s)
  const turi = sertifikatTuriAniqlash(s)
  const isHamkor = turi === SERTIFIKAT_TURLARI.hamkor
  const turiYorligi = isMs
    ? 'Milliy Sertifikat'
    : isHamkor
      ? 'Mavsumiy Hamkorlik'
      : 'Rasmiy Sertifikat'
  const h = sertifikatHolati(s)
  const valid = Boolean(natija.valid) && h.yaroqli
  const holatSarlavha = valid ? 'Haqiqiy va faol' : natija.invalidReason || h.sabab
  const { rasmlar: seals, hamkorMuhri } = ajratSertifikatMuhrlar(s.seals)

  const muddatMatn = formatAmalMuddati(s.issuedAt, s.expiresAt)
  const theta = meta?.theta !== undefined ? Number(meta.theta) : null
  const se = meta?.se ?? '0.35'
  const shkalaBalli = meta?.shkalaBalli ?? s.score
  const oddiyFoiz = meta?.oddiyFoiz ?? s.percentage

  return (
    <main className="ms-akademik ms-fon min-h-screen flex flex-col justify-between text-white relative overflow-x-hidden p-4 sm:p-6">
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-sky-400/25 pb-4 relative z-10 gap-3">
        <Link
          href={isMs ? '/milliy-sertifikat' : '/'}
          className="inline-flex items-center gap-2 text-xs text-sky-100 hover:text-white transition px-3.5 py-1.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35"
        >
          <Ikon nom="chap" olcham={15} />
          <span>{isMs ? 'Sinovlar' : 'Bosh sahifa'}</span>
        </Link>

        <div className="text-xs font-mono text-amber-300 font-semibold">
          JDA KIMYO
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full my-8 relative z-10 space-y-6">
        <div
          className={`ms-karta p-6 sm:p-8 rounded-3xl border-2 relative overflow-hidden space-y-5 ${
            valid
              ? 'border-emerald-400/60 shadow-[0_22px_50px_-18px_rgba(2,8,34,0.9),0_0_32px_-12px_rgba(16,185,129,0.28)]'
              : 'border-rose-400/60 shadow-[0_22px_50px_-18px_rgba(2,8,34,0.9),0_0_32px_-12px_rgba(244,63,94,0.25)]'
          }`}
        >
          {/* Asosiy tasdiq holati */}
          <div className="text-center space-y-2.5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border shadow-lg ${
                valid
                  ? 'bg-emerald-400/25 text-emerald-300 border-emerald-300/60 shadow-emerald-500/20'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/55 shadow-rose-500/20'
              }`}
            >
              <Ikon nom={valid ? 'tasdiq' : 'ogohlantirish'} olcham={28} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white">{holatSarlavha}</h1>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <SertifikatYuklab sertifikat={s} />
              <SertifikatNusxalaTugma certId={s.certId} />
            </div>
          </div>

          {/* Asosiy ma'lumotlar */}
          <div className="ms-karta-ichki p-4 sm:p-5 rounded-2xl text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center gap-3 border-b border-sky-400/20 pb-2.5">
              <span className="text-sky-200">Raqami</span>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-400/15 text-sky-200 border border-sky-400/30">
                  {turiYorligi}
                </span>
                <strong className="text-amber-300 font-mono font-bold">{s.certId}</strong>
              </div>
            </div>

            <div className="flex justify-between items-start gap-3 border-b border-sky-400/20 pb-2.5">
              <span className="text-sky-200 shrink-0">Egasi</span>
              <div className="text-right">
                <div className="text-white font-bold text-sm sm:text-base">{s.fullName}</div>
                {s.username && s.profilId && (
                  <Link
                    href={`/profil/${s.profilId}`}
                    className="text-xs text-cyan-300 hover:text-amber-300 transition"
                  >
                    @{s.username}
                  </Link>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 border-b border-sky-400/20 pb-2.5">
              <span className="text-sky-200">Yo&apos;nalish</span>
              <strong className="text-white text-right">{s.fan}</strong>
            </div>

            {s.examName && (
              <div className="flex justify-between items-center gap-3 border-b border-sky-400/20 pb-2.5">
                <span className="text-sky-200">Sinov</span>
                <strong className="text-white text-right">{s.examName}</strong>
              </div>
            )}

            <div className="flex justify-between items-start gap-3 border-b border-sky-400/20 pb-2.5">
              <span className="text-sky-200 shrink-0">Asos</span>
              <span className="text-sky-50 text-right">{s.reason}</span>
            </div>

            {matn && (
              <div className="border-b border-sky-400/20 pb-2.5 space-y-1">
                <span className="text-sky-200 text-xs">Tavsif</span>
                <p className="text-sky-50/90 text-xs sm:text-sm leading-relaxed">{matn}</p>
              </div>
            )}

            {isMs ? (
              <div className="grid sm:grid-cols-2 gap-3 pt-1 pb-1">
                <div className="rounded-xl bg-[#091642]/80 border border-amber-300/35 p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-bold uppercase tracking-wider">
                      Rasch
                    </span>
                    <span className="text-cyan-300 font-mono">
                      {qisqaKalibrlashNomi(meta?.kalibrlashUsuli)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {s.grade && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-300 text-slate-950 font-extrabold text-xs">
                        {s.grade}
                      </span>
                    )}
                    <span className="text-base font-bold text-white">
                      {shkalaBalli ?? 0} ball
                    </span>
                  </div>
                  {theta !== null && !Number.isNaN(theta) && (
                    <div className="text-[11px] font-mono text-sky-200">
                      θ = {theta > 0 ? `+${theta}` : theta} ± {se}
                    </div>
                  )}
                </div>

                <div className="rounded-xl bg-[#091642]/80 border border-sky-400/30 p-3 space-y-1">
                  <div className="text-[11px] text-sky-300 font-bold uppercase tracking-wider">
                    Oddiy
                  </div>
                  <div className="text-base font-bold text-white">
                    {meta?.rawScore !== undefined && meta?.jamiSavollar !== undefined
                      ? `${meta.rawScore}/${meta.jamiSavollar}`
                      : oddiyFoiz !== null && oddiyFoiz !== undefined
                        ? `${oddiyFoiz}%`
                        : '—'}
                  </div>
                  <div className="text-[11px] font-mono text-sky-200">
                    {oddiyFoiz !== null && oddiyFoiz !== undefined ? `${oddiyFoiz}%` : ''}
                    {meta?.oddiyBall !== null && meta?.oddiyBall !== undefined
                      ? ` · Ball: ${meta.oddiyBall}`
                      : ''}
                    {s.percentile !== null && s.percentile !== undefined
                      ? ` · P${s.percentile}`
                      : ''}
                  </div>
                </div>
              </div>
            ) : (
              (s.grade || s.score !== null || s.percentage !== null || s.percentile !== null) && (
                <div className="flex flex-wrap gap-2.5 pt-1 pb-1">
                  {s.grade && (
                    <div className="px-3.5 py-2 rounded-xl bg-amber-400/15 border border-amber-300/40">
                      <div className="text-[10px] text-amber-300 uppercase tracking-wider">Daraja</div>
                      <div className="text-sm font-bold text-white">{s.grade}</div>
                    </div>
                  )}
                  {s.score !== null && s.score !== undefined && (
                    <div className="px-3.5 py-2 rounded-xl bg-sky-500/15 border border-sky-400/40">
                      <div className="text-[10px] text-sky-300 uppercase tracking-wider">Ball</div>
                      <div className="text-sm font-bold text-white">{s.score}</div>
                    </div>
                  )}
                  {s.percentage !== null && s.percentage !== undefined && (
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40">
                      <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Foiz</div>
                      <div className="text-sm font-bold text-white">{s.percentage}%</div>
                    </div>
                  )}
                  {s.percentile !== null && s.percentile !== undefined && (
                    <div className="px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40">
                      <div className="text-[10px] text-cyan-300 uppercase tracking-wider">Percentile</div>
                      <div className="text-sm font-bold text-white">{s.percentile}%</div>
                    </div>
                  )}
                </div>
              )
            )}

            {hamkorMuhri && (
              <div className="border-t border-sky-400/20 pt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs text-sky-200 flex items-center gap-1.5">
                    <Ikon nom="hamkor" olcham={14} className="text-emerald-300" />
                    <span>Hamkorlik</span>
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {[hamkorMuhri.partnerName, hamkorMuhri.partnerSignName, hamkorMuhri.jdaSignName]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </div>
                {hamkorMuhri.badgeText && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/45 text-[11px] font-bold text-emerald-200">
                    {hamkorMuhri.badgeText}
                  </span>
                )}
              </div>
            )}

            {seals.length > 0 && (
              <div className="border-t border-sky-400/20 pt-3 space-y-2">
                <div className="text-xs text-sky-200">Muhrlar</div>
                <div className="flex flex-wrap gap-3">
                  {seals.map((seal) => (
                    <div key={seal.url} className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={seal.url}
                        alt={seal.label || 'Pechat'}
                        className="w-16 h-16 object-contain bg-white/10 border border-sky-400/30 rounded-xl p-1"
                      />
                      {seal.label && (
                        <div className="text-[10px] text-sky-200 mt-1 max-w-20 truncate">
                          {seal.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-sky-400/20 pt-3 grid sm:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-sky-200/80 mb-0.5">Holat</div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full font-bold ${
                    valid
                      ? 'bg-emerald-400/25 text-emerald-200 border border-emerald-300/55'
                      : 'bg-rose-500/25 text-rose-200 border border-rose-400/55'
                  }`}
                >
                  {valid ? 'Faol' : h.belgi}
                </span>
              </div>
              <div>
                <div className="text-sky-200/80 mb-0.5">Berilgan</div>
                <div className="text-white font-mono">{sana(s.issuedAt)}</div>
              </div>
              <div>
                <div className="text-sky-200/80 mb-0.5">Muddat</div>
                <div className="text-white font-mono">{muddatMatn}</div>
              </div>
            </div>
          </div>

          {isMs && (
            <div className="p-3.5 rounded-2xl bg-amber-400/15 border border-amber-300/45 text-left flex items-center gap-2 text-xs text-sky-50">
              <Ikon nom="sertifikat" olcham={15} className="text-amber-300 shrink-0" />
              <span>{TAYYORGARLIK_OGOHLANTIRISH}</span>
            </div>
          )}

          <div className="pt-1 flex justify-center gap-3 flex-wrap">
            <Link
              href={isMs ? '/milliy-sertifikat' : '/testlar'}
              className="ms-tugma-oltin px-5 py-2.5 rounded-xl border border-amber-200 text-xs font-bold inline-flex items-center gap-2"
            >
              <Ikon nom="atom" olcham={14} />
              <span>{isMs ? 'Sinovlar' : 'Testlar'}</span>
            </Link>
            <Link
              href="/sertifikat"
              className="px-5 py-2.5 rounded-xl bg-[#102260]/85 hover:bg-[#173287] border border-sky-400/35 text-xs font-semibold text-sky-100 inline-flex items-center gap-2 transition"
            >
              <Ikon nom="qidiruv" olcham={14} />
              <span>Yana tekshirish</span>
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center text-[11px] text-sky-200/85 border-t border-sky-400/20 pt-4 relative z-10 flex items-center justify-center gap-2">
        <span>JDA KIMYO &copy; {new Date().getFullYear()}</span>
        <span>·</span>
        <Link href="/hamkorlik/boglanish" className="text-amber-300 hover:underline">
          Bog&apos;lanish
        </Link>
      </footer>
    </main>
  )
}
