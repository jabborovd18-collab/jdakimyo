"use client"
//
// Shaxsiy chatning ko'rinishi.
//
// Yangi xabar SO'ROV bilan olinadi (WebSocket emas): Vercel funksiyalari
// so'rov-javob asosida ishlaydi, uzoq turadigan ulanish ochib bo'lmaydi.
// Suhbat ochiq turganda 4 soniyada bir marta so'raladi va faqat oyna
// ko'rinib turganda — fondagi yorliq serverni bekorga bezovta qilmasin.
//
// Ranglar app/globals.css dagi "SHAXSIY CHAT" bo'limida `--v3-*`
// o'zgaruvchilari orqali beriladi (yakka V4 Safir foni).
import { Suspense, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { kunKaliti, kunSarlavhasi, sanaQisqa, soatDaqiqa } from '@/lib/sana'
import { MAX_UZUNLIK } from '@/lib/chat-chegara'
import { ODDIY_FON } from '@/lib/sahifa-fon'
import { roleInfo } from '@/lib/roles'
import { xavfsizTashqiHavola } from '@/lib/profil-tahrir'
import {
  chatKirishHavolasi,
  chatQatorFiltr,
  chatRoyxatOzgardimi,
  dostVaQidiruvBirlashtir,
  ichkiXabarQidir,
  suhbatBolimi,
  suhbatOzgardimi,
  suhbatQadalganmi,
  suhbatTartibla,
  xabarQisqaMatn,
  xavfsizProfilQaytishManzili,
} from '@/lib/chat-interfeys'
import Ikon from '@/components/Ikon'
import { useFon } from '@/components/FonTanlagich'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'

const SOROV_ORALIGI = 4000

/** Belgilar sanagichi shu chegaradan keyin ko'rinadi */
const SANAGICH_QOLGAN = 200

/** Ketma-ket xabarlar shu oraliqda bitta guruh bo'ladi (5 daqiqa) */
const GURUH_ORALIGI = 5 * 60 * 1000

const SHIKOYAT_ANDAZALAR = [
  'Spam yoki ruxsatsiz reklama',
  "Haqorat va noo'rin xabar",
  'Firibgarlik yoki shubhali havola',
]

const IJTIMOIY_HAVOLALAR = [
  { kalit: 'telegram', nom: 'Telegram', ikon: 'telegram' },
  { kalit: 'instagram', nom: 'Instagram', ikon: 'kanal' },
  { kalit: 'twitter', nom: 'X', ikon: 'xabar' },
  { kalit: 'github', nom: 'GitHub', ikon: 'kitob' },
  { kalit: 'linkedin', nom: 'LinkedIn', ikon: 'odam' },
  { kalit: 'googleScholar', nom: 'Scholar', ikon: 'kitob' },
  { kalit: 'orcid', nom: 'ORCID', ikon: 'atom' },
  { kalit: 'website', nom: 'Sayt', ikon: 'doska' },
]

export default function Korinish() {
  return (
    <Suspense fallback={<Yuklanish />}>
      <Chat />
    </Suspense>
  )
}

function Yuklanish() {
  return (
    <div className="v3 chat-sahifa" data-fon={ODDIY_FON}>
      <div className="chat-bosh-holat">
        <span className="chat-bosh-ikon"><Ikon nom="xabar" olcham={26} /></span>
        <span>Yuklanmoqda...</span>
      </div>
    </div>
  )
}

const Avatar = memo(function Avatar({ odam, olcham = 42 }) {
  const harf = (odam?.fullName || odam?.username || 'U')[0].toUpperCase()
  return (
    <span className="chat-avatar" style={{ width: olcham, height: olcham, fontSize: olcham * 0.4 }}>
      {odam?.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={odam.avatar} alt="" decoding="async" loading="lazy" />
      ) : (
        harf
      )}
    </span>
  )
})

function BelgilanganMatn({ matn, sorov }) {
  const q = typeof sorov === 'string' ? sorov.trim() : ''
  if (!q || !matn) return <span style={{ whiteSpace: 'pre-line' }}>{matn}</span>

  const kichikMatn = matn.toLowerCase()
  const kichikSorov = q.toLowerCase()
  if (!kichikMatn.includes(kichikSorov)) {
    return <span style={{ whiteSpace: 'pre-line' }}>{matn}</span>
  }

  const bolaklar = []
  let bosh = 0
  let qadam = 0
  while (bosh < matn.length) {
    const idx = kichikMatn.indexOf(kichikSorov, bosh)
    if (idx === -1) {
      bolaklar.push(matn.slice(bosh))
      break
    }
    if (idx > bosh) bolaklar.push(matn.slice(bosh, idx))
    bolaklar.push(
      <mark key={`${qadam}-${idx}`} className="chat-belgi-matn">
        {matn.slice(idx, idx + q.length)}
      </mark>,
    )
    bosh = idx + q.length
    qadam += 1
  }

  return <span style={{ whiteSpace: 'pre-line' }}>{bolaklar}</span>
}

function XabarMazmuni({ matn, qidiruvSorovi }) {
  if (!matn) return null

  // Test ulashilgan xabarlarni aniqlash: [quiz:ID:Title] yoki havola
  const quizMatch = matn.match(/\[quiz:([a-zA-Z0-9_\-]+):([^\]]+)\]/)
  const linkMatch = matn.match(/\/(?:oquv\/video-darsliklar\/ustoz-quiz|testlar\/ustoz)\/([a-zA-Z0-9_\-]+)/)

  if (quizMatch || linkMatch) {
    const quizId = quizMatch ? quizMatch[1] : linkMatch[1]
    const quizTitle = quizMatch ? quizMatch[2] : 'Ustoz Testi'
    const cleanText = matn
      .replace(/🧪?\s*\[quiz:[a-zA-Z0-9_\-]+:[^\]]+\]/g, '')
      .replace(/https?:\/\/[^\s]+\/(?:oquv\/video-darsliklar\/ustoz-quiz|testlar\/ustoz)\/[a-zA-Z0-9_\-]+/g, '')
      .replace(/\/(?:oquv\/video-darsliklar\/ustoz-quiz|testlar\/ustoz)\/[a-zA-Z0-9_\-]+/g, '')
      .trim()

    return (
      <div>
        {cleanText && (
          <div style={{ marginBottom: '8px' }}>
            <BelgilanganMatn matn={cleanText} sorov={qidiruvSorovi} />
          </div>
        )}
        <Link href={`/testlar/ustoz/${quizId}`} className="chat-quiz-karta">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[var(--v3-urgu)] uppercase tracking-wider">
            <Ikon nom="quiz" olcham={13} />
            <span>Ustoz testi</span>
          </div>
          <div className="chat-quiz-karta-sarlavha">{quizTitle}</div>
          <div className="chat-quiz-karta-tugma">
            <span>Testni yechish</span>
            <Ikon nom="ong" olcham={13} />
          </div>
        </Link>
      </div>
    )
  }

  return <BelgilanganMatn matn={matn} sorov={qidiruvSorovi} />
}

/** Ro'yxatdagi vaqt: bugungi suhbat — soat, eskisi — sana */
function royxatVaqti(qiymat) {
  if (!qiymat) return ''
  return kunKaliti(qiymat) === kunKaliti(new Date()) ? soatDaqiqa(qiymat) : sanaQisqa(qiymat)
}

/** Chap suhbatlar ustuni — matn terish va scroll paytida qayta render bo'lmasligi uchun izolyatsiyalangan */
const ChatChapYon = memo(function ChatChapYon({
  dostPanel,
  onDostPanelYop,
  dostQidiruv,
  onDostQidiruvOzgarish,
  nomzodRoyxati,
  qidirilmoqda,
  ochilayotganUserId,
  onDostBilanYoz,
  onDostPanelniOch,
  qidiruv,
  onQidiruvOzgarish,
  faqatOqilmagan,
  onToggleOqilmagan,
  onOqilmaganYop,
  bolimlar,
  bolim,
  onBolimTanla,
  royxat,
  joriyRoyxat,
  tanlangan,
  onSuhbatniTanla,
}) {
  return (
    <aside className="chat-yon">
      {dostPanel ? (
        <>
          <div className="chat-yon-bosh">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDostPanelYop}
                className="v3-ikon-tugma"
                aria-label="Orqaga"
              >
                <Ikon nom="chap" olcham={16} />
              </button>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>Yangi suhbat boshlash</span>
            </div>
            <input
              className="chat-kirit"
              value={dostQidiruv}
              onChange={(e) => onDostQidiruvOzgarish(e.target.value)}
              placeholder="Ism, @username yoki ID bo'yicha qidiring"
              autoFocus
            />
          </div>

          <div className="chat-royxat">
            {nomzodRoyxati === null ? (
              <div className="chat-bosh-holat">Yuklanmoqda...</div>
            ) : nomzodRoyxati.length === 0 ? (
              <div className="chat-bosh-holat">
                <span className="chat-bosh-ikon"><Ikon nom="odamlar" olcham={24} /></span>
                <span>
                  {qidirilmoqda
                    ? 'Qidirilmoqda...'
                    : dostQidiruv.trim().length === 1
                      ? 'Kamida 2 ta belgi yozing'
                      : dostQidiruv
                        ? 'Foydalanuvchi topilmadi'
                        : "Hali do'stingiz yo'q — yuqorida ism yoki @username yozib qidiring"}
                </span>
                <Link href="/profil/dostlar" className="v3-tugma">Do{"'"}st qidirish</Link>
              </div>
            ) : (
              <>
                {nomzodRoyxati.map((d) => {
                  const yuk = ochilayotganUserId === d.userId
                  return (
                    <button
                      key={d.userId}
                      type="button"
                      disabled={Boolean(ochilayotganUserId)}
                      onClick={() => onDostBilanYoz(d)}
                      className="chat-qator"
                    >
                      <Avatar odam={d} olcham={38} />
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span className="chat-qator-nom">
                          <span className="truncate">{d.fullName || d.username}</span>
                          <TasdiqBelgisi tasdiqlangan={d.isVerified} olcham="kichik" />
                        </span>
                        <span className="chat-qator-matn" style={{ display: 'block' }}>
                          @{d.username} · {d.dostmi ? "Do'stingiz" : "So'rov orqali"}
                        </span>
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--v3-xira)', flexShrink: 0 }}>
                        {yuk ? '...' : <Ikon nom="jonat" olcham={15} />}
                      </span>
                    </button>
                  )
                })}
                {qidirilmoqda && (
                  <div style={{ textAlign: 'center', padding: '10px', fontSize: 12, color: 'var(--v3-xira)' }}>
                    Boshqa foydalanuvchilar qidirilmoqda...
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="chat-yon-bosh">
            <button
              type="button"
              onClick={onDostPanelniOch}
              className="v3-tugma-asosiy"
              style={{ justifyContent: 'center' }}
            >
              <Ikon nom="xabar" olcham={16} />
              Yangi suhbat
            </button>

            <div className="flex items-center gap-1.5">
              <input
                className="chat-kirit"
                value={qidiruv}
                onChange={(e) => onQidiruvOzgarish(e.target.value)}
                placeholder="Suhbat yoki xabarlardan qidirish"
              />
              <button
                type="button"
                onClick={onToggleOqilmagan}
                className={`chat-filtr-chip ${faqatOqilmagan ? 'is-faol' : ''}`}
                title="Faqat o'qilmagan suhbatlarni ko'rsatish"
                aria-pressed={faqatOqilmagan}
              >
                <span>O{"'"}qilmagan</span>
              </button>
            </div>

            <div className="chat-tablar">
              {bolimlar.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onBolimTanla(b.id)}
                  className={`chat-tab ${bolim === b.id ? 'is-faol' : ''}`}
                >
                  <span>{b.nom}</span>
                  {b.ogoh > 0 ? (
                    <span className="chat-tab-son is-ogoh">{b.ogoh > 99 ? '99+' : b.ogoh}</span>
                  ) : b.royxat.length > 0 ? (
                    <span className="chat-tab-son">{b.royxat.length}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-royxat">
            {!royxat ? (
              <div className="chat-bosh-holat">Yuklanmoqda...</div>
            ) : joriyRoyxat.length === 0 ? (
              <div className="chat-bosh-holat">
                <span className="chat-bosh-ikon"><Ikon nom="xabar" olcham={24} /></span>
                <span>
                  {faqatOqilmagan
                    ? "O'qilmagan suhbatlar yo'q"
                    : qidiruv
                      ? 'Hech narsa topilmadi'
                      : bolim === 'faol'
                        ? "Hali suhbat yo'q — yangi suhbat boshlang"
                        : bolim === 'sorov'
                          ? "Kiruvchi so'rovlar yo'q"
                          : "Yuborilgan so'rovlar yo'q"}
                </span>
                {faqatOqilmagan ? (
                  <button type="button" onClick={onOqilmaganYop} className="v3-tugma">
                    Barchasini ko{"'"}rish
                  </button>
                ) : !qidiruv && bolim === 'faol' ? (
                  <button type="button" onClick={onDostPanelniOch} className="v3-tugma">
                    <Ikon nom="qidiruv" olcham={14} />
                    Kimnidir topish
                  </button>
                ) : null}
              </div>
            ) : (
              joriyRoyxat.map((s) => {
                const pinmi = suhbatQadalganmi(s)
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSuhbatniTanla(s.id)}
                    className={`chat-qator ${tanlangan === s.id ? 'is-tanlangan' : ''} ${
                      s.oqilmagan > 0 ? 'is-oqilmagan' : ''
                    } ${pinmi ? 'is-qadalgan' : ''}`}
                  >
                    <Avatar odam={s.odam} olcham={42} />
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span className="flex items-center justify-between gap-2">
                        <span className="chat-qator-nom">
                          <span className="truncate">{s.odam.fullName || s.odam.username}</span>
                          <TasdiqBelgisi tasdiqlangan={s.odam.isVerified} olcham="kichik" />
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          {pinmi && (
                            <span className="chat-qadash-belgi" title="Qadalgan suhbat">
                              <Ikon nom="qadash" olcham={12} />
                            </span>
                          )}
                          <span className="chat-qator-vaqt">{royxatVaqti(s.updatedAt)}</span>
                        </span>
                      </span>
                      <span className="flex items-center justify-between gap-2" style={{ marginTop: 2 }}>
                        <span className="chat-qator-matn">
                          {s.oxirgiXabar
                            ? (s.oxirgiXabar.meniki ? 'Siz: ' : '') +
                              (s.oxirgiXabar.ochirilgan ? "xabar o'chirildi" : s.oxirgiXabar.matn)
                            : "Hali xabar yo'q"}
                        </span>
                        {s.oqilmagan > 0 && <span className="chat-nishon">{s.oqilmagan}</span>}
                      </span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </>
      )}
    </aside>
  )
})

const ChatXabarBand = memo(function ChatXabarBand({
  x,
  yangiKun,
  yangiChegara,
  guruhOxiri,
  iqtibosMuallif,
  qidiruvSorovi,
  ajratilganmi,
  onXabargaOt,
  onJavobBer,
  onNusxaOl,
  onXabarOchir,
}) {
  return (
    <div data-xabar-id={x.id}>
      {yangiKun && (
        <div className="chat-kun"><span>{kunSarlavhasi(x.createdAt)}</span></div>
      )}

      {yangiChegara && (
        <div className="chat-yangi-ajratgich">
          <span>Yangi xabarlar</span>
        </div>
      )}

      <div className={`chat-satr ${x.meniki ? 'is-meniki' : ''} ${guruhOxiri ? 'is-oxirgi' : ''}`}>
        <div
          className={`chat-pufak ${x.meniki ? 'is-meniki' : 'is-uniki'} ${
            x.ochirilgan ? 'is-ochirilgan' : ''
          } ${ajratilganmi ? 'is-ajratilgan' : ''}`}
        >
          {!x.ochirilgan && x.replyTo && (
            <button
              type="button"
              onClick={() => onXabargaOt(x.replyTo.id)}
              className="chat-iqtibos"
              title="Asl xabarga o'tish"
            >
              <div className="chat-iqtibos-muallif">{iqtibosMuallif}</div>
              <div className="chat-iqtibos-matn">{xabarQisqaMatn(x.replyTo)}</div>
            </button>
          )}

          {x.ochirilgan ? (
            <span>Xabar o{"'"}chirildi</span>
          ) : (
            <XabarMazmuni matn={x.matn} qidiruvSorovi={qidiruvSorovi} />
          )}

          <span className="chat-pufak-oyoq">
            {!x.ochirilgan && (
              <span className="chat-pufak-amallar">
                <button
                  type="button"
                  onClick={() => onJavobBer(x)}
                  className="chat-amal-tugma"
                  title="Javob berish"
                  aria-label="Javob berish"
                >
                  <Ikon nom="javob" olcham={12} />
                </button>
                <button
                  type="button"
                  onClick={() => onNusxaOl(x.matn)}
                  className="chat-amal-tugma"
                  title="Matnni nusxalash"
                  aria-label="Matnni nusxalash"
                >
                  <Ikon nom="nusxa" olcham={12} />
                </button>
                {x.meniki && (
                  <button
                    type="button"
                    onClick={() => onXabarOchir(x.id)}
                    className="chat-ochir"
                    title="Xabarni o'chirish"
                    aria-label="Xabarni o'chirish"
                  >
                    <Ikon nom="ochir" olcham={12} />
                  </button>
                )}
              </span>
            )}
            <span>{soatDaqiqa(x.createdAt)}</span>
            {x.meniki && !x.ochirilgan && (
              <span title={x.oqilgan ? "O'qildi" : 'Yuborildi'}>
                {x.oqilgan ? '✓✓' : '✓'}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  )
})

const ChatXabarLenta = memo(function ChatXabarLenta({
  xabarlar,
  odam,
  birinchiOqilmaganId,
  qidiruvSorovi,
  ajratilganXabarId,
  oynaRef,
  oxirgiRef,
  onSiljish,
  onXabargaOt,
  onJavobBer,
  onNusxaOl,
  onXabarOchir,
}) {
  const sherikIsm = odam?.fullName || odam?.username || ''
  return (
    <div ref={oynaRef} onScroll={onSiljish} className="chat-lenta">
      {xabarlar.length === 0 && (
        <div className="chat-bosh-holat">
          <span className="chat-bosh-ikon"><Ikon nom="jonat" olcham={24} /></span>
          <span>Birinchi xabarni yozing</span>
        </div>
      )}

      {xabarlar.map((x, i) => {
        const oldingi = xabarlar[i - 1]
        const keyingi = xabarlar[i + 1]
        const yangiKun = !oldingi || kunKaliti(oldingi.createdAt) !== kunKaliti(x.createdAt)
        const yangiChegara = Boolean(birinchiOqilmaganId && x.id === birinchiOqilmaganId)
        const guruhOxiri =
          !keyingi ||
          keyingi.meniki !== x.meniki ||
          kunKaliti(keyingi.createdAt) !== kunKaliti(x.createdAt) ||
          new Date(keyingi.createdAt) - new Date(x.createdAt) > GURUH_ORALIGI

        const iqtibosMuallif = x.replyTo
          ? x.replyTo.meniki
            ? 'Siz'
            : sherikIsm
          : ''

        return (
          <ChatXabarBand
            key={x.id}
            x={x}
            yangiKun={yangiKun}
            yangiChegara={yangiChegara}
            guruhOxiri={guruhOxiri}
            iqtibosMuallif={iqtibosMuallif}
            qidiruvSorovi={qidiruvSorovi}
            ajratilganmi={ajratilganXabarId === x.id}
            onXabargaOt={onXabargaOt}
            onJavobBer={onJavobBer}
            onNusxaOl={onNusxaOl}
            onXabarOchir={onXabarOchir}
          />
        )
      })}
      <div ref={oxirgiRef} />
    </div>
  )
})

/** Yozish maydoni: `matn` state'ini lokal ushlab turadi va textarea balandligini rAF orqali moslaydi */
const ChatYozishQatori = memo(function ChatYozishQatori({
  tanlangan,
  draftMatn,
  blokMeniBlokladi,
  blokMenBlokladim,
  suhbatHolat,
  menBoshladim,
  odamIsm,
  javobXabar,
  yuborilmoqda,
  maydonRef,
  matnRef,
  onYubor,
  onBlokniOch,
  onSorovga,
  onJavobBekor,
}) {
  const [matn, setMatn] = useState(draftMatn || '')
  const balandlikRafRef = useRef(0)
  const oxirgiBalandlikRef = useRef(0)

  const balandlikniMosla = useCallback(
    (boshmi) => {
      if (balandlikRafRef.current) {
        cancelAnimationFrame(balandlikRafRef.current)
        balandlikRafRef.current = 0
      }
      if (boshmi) {
        const el = maydonRef.current
        if (el && oxirgiBalandlikRef.current !== 0) {
          el.style.height = 'auto'
          oxirgiBalandlikRef.current = 0
        }
        return
      }
      balandlikRafRef.current = requestAnimationFrame(() => {
        balandlikRafRef.current = 0
        const el = maydonRef.current
        if (!el) return
        el.style.height = 'auto'
        const yangi = Math.min(el.scrollHeight, 148)
        oxirgiBalandlikRef.current = yangi
        el.style.height = `${yangi}px`
      })
    },
    [maydonRef],
  )

  useEffect(() => {
    const bosh = draftMatn || ''
    matnRef.current = bosh
    setMatn(bosh)
    oxirgiBalandlikRef.current = 0
    if (maydonRef.current) maydonRef.current.style.height = 'auto'
    if (bosh) balandlikniMosla(false)
  }, [tanlangan, draftMatn, matnRef, maydonRef, balandlikniMosla])

  useEffect(() => {
    return () => {
      if (balandlikRafRef.current) cancelAnimationFrame(balandlikRafRef.current)
    }
  }, [])

  const yuborishniBajar = async () => {
    const toza = matn.trim()
    if (!toza || yuborilmoqda) return
    const muvaffaqiyat = await onYubor(toza)
    if (muvaffaqiyat) {
      matnRef.current = ''
      setMatn('')
      balandlikniMosla(true)
    }
  }

  const qolgan = MAX_UZUNLIK - matn.length

  return (
    <div className="chat-yozish">
      {blokMeniBlokladi ? (
        <p style={{ textAlign: 'center', color: 'var(--v3-xira)', fontSize: 13 }}>
          Bu suhbatda xabar yuborib bo{"'"}lmaydi
        </p>
      ) : blokMenBlokladim ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span style={{ color: 'var(--v3-xira)', fontSize: 13 }}>
            Siz bu foydalanuvchini bloklagansiz
          </span>
          <button type="button" onClick={onBlokniOch} className="v3-tugma text-xs py-1.5 px-3">
            <Ikon nom="ochiq" olcham={14} />
            Blokni ochish
          </button>
        </div>
      ) : suhbatHolat === 'sorov' && !menBoshladim ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <p style={{ textAlign: 'center', color: 'var(--v3-xira)', fontSize: 12.5 }}>
            Bu do{"'"}st bo{"'"}lmagan foydalanuvchining so{"'"}rovi. Javob bersangiz
            suhbat ochiladi.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => onSorovga('qabul')}
              className="v3-tugma-asosiy"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Qabul qilish
            </button>
            <button
              type="button"
              onClick={() => onSorovga('rad')}
              className="v3-tugma"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Rad etish
            </button>
          </div>
        </div>
      ) : (
        <>
          {javobXabar && (
            <div className="chat-javob-paneli">
              <div className="min-w-0 flex-1">
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--v3-urgu)' }}>
                  {javobXabar.meniki
                    ? 'O‘z xabaringizga javob'
                    : `${odamIsm} xabariga javob`}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'var(--v3-xira)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {xabarQisqaMatn(javobXabar, 96)}
                </div>
              </div>
              <button
                type="button"
                onClick={onJavobBekor}
                className="v3-ikon-tugma"
                aria-label="Javobni bekor qilish"
              >
                <Ikon nom="yopish" olcham={14} />
              </button>
            </div>
          )}

          <div className="chat-quti">
            <textarea
              ref={maydonRef}
              rows={1}
              className="chat-matn"
              value={matn}
              maxLength={MAX_UZUNLIK}
              onChange={(e) => {
                const qiymat = e.target.value
                matnRef.current = qiymat
                setMatn(qiymat)
                balandlikniMosla(qiymat.length === 0)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  yuborishniBajar()
                }
              }}
              placeholder={
                suhbatHolat === 'sorov'
                  ? "So'rov yuborilgan — javobni kuting"
                  : 'Xabar yozing...'
              }
            />
            <button
              type="button"
              onClick={yuborishniBajar}
              disabled={yuborilmoqda || !matn.trim()}
              className="chat-jonat"
              aria-label="Yuborish"
              title="Yuborish (Enter)"
            >
              <Ikon nom="jonat" olcham={17} />
            </button>
          </div>
          {qolgan <= SANAGICH_QOLGAN && (
            <div
              style={{
                textAlign: 'right',
                fontSize: 11,
                marginTop: 4,
                color: qolgan <= 0 ? '#f87171' : 'var(--v3-xira)',
              }}
            >
              {qolgan} belgi qoldi
            </div>
          )}
        </>
      )}
    </div>
  )
})

function Chat() {
  const { data: session, status } = useSession()
  const [fon] = useFon()
  const qidiruvParam = useSearchParams()

  const suhbatParam = qidiruvParam.get('suhbat')
  const yozishParam = qidiruvParam.get('yozish')
  const qaytishParam = qidiruvParam.get('qaytish')

  const qaytishManzil = useMemo(
    () => xavfsizProfilQaytishManzili(qaytishParam),
    [qaytishParam],
  )

  const joriyChatUrl = useMemo(() => {
    if (suhbatParam) return chatKirishHavolasi({ suhbatId: suhbatParam, qaytish: qaytishParam })
    if (yozishParam) return chatKirishHavolasi({ yozishUserId: yozishParam, qaytish: qaytishParam })
    return chatKirishHavolasi({ qaytish: qaytishParam })
  }, [suhbatParam, yozishParam, qaytishParam])

  const [royxat, setRoyxat] = useState(null)
  const [tanlangan, setTanlangan] = useState(suhbatParam || null)
  const [suhbat, setSuhbat] = useState(null)
  const [suhbatYuklanmoqda, setSuhbatYuklanmoqda] = useState(false)
  const [draftMatn, setDraftMatn] = useState('')
  const [javobXabar, setJavobXabar] = useState(null)
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [bolim, setBolim] = useState('faol')
  const [qidiruv, setQidiruv] = useState('')
  const [faqatOqilmagan, setFaqatOqilmagan] = useState(false)
  const [amalMenyu, setAmalMenyu] = useState(false)
  const [pastdaTuribdi, setPastdaTuribdi] = useState(true)
  const [yangiKeldi, setYangiKeldi] = useState(0)
  const [birinchiOqilmaganId, setBirinchiOqilmaganId] = useState(null)
  const [qadashJarayoni, setQadashJarayoni] = useState(false)
  const [ajratilganXabarId, setAjratilganXabarId] = useState(null)

  // Suhbat ichidan qidirish
  const [ichkiQidiruvOchiq, setIchkiQidiruvOchiq] = useState(false)
  const [ichkiQidiruvMatn, setIchkiQidiruvMatn] = useState('')
  const [faolTopilmaIdx, setFaolTopilmaIdx] = useState(0)

  // Yozishayotgan odamning tezkor profili
  const [profilOchiq, setProfilOchiq] = useState(false)
  const [profilData, setProfilData] = useState(null)
  const [profilYuklanmoqda, setProfilYuklanmoqda] = useState(false)
  const [profilAmalBand, setProfilAmalBand] = useState(false)

  // Yangi suhbat (do'stlar + platformadan qidiruv)
  const [dostPanel, setDostPanel] = useState(false)
  const [dostlar, setDostlar] = useState(null)
  const [dostQidiruv, setDostQidiruv] = useState('')
  const [qidiruvNatija, setQidiruvNatija] = useState([])
  const [qidirilmoqda, setQidirilmoqda] = useState(false)
  const [ochilayotganUserId, setOchilayotganUserId] = useState(null)

  // Ichki modal: xabar o'chirish / bloklash / shikoyat
  const [modalHolat, setModalHolat] = useState(null)
  const [shikoyatSababi, setShikoyatSababi] = useState('')
  const [modalBajarilmoqda, setModalBajarilmoqda] = useState(false)

  const oxirgiRef = useRef(null)
  const oynaRef = useRef(null)
  const maydonRef = useRef(null)
  const ichkiQidiruvRef = useRef(null)
  const matnRef = useRef('')
  const tanlanganRef = useRef(suhbatParam || null)
  const suhbatRef = useRef(null)
  const javobXabarRef = useRef(null)
  const pastdaRef = useRef(true)
  const yangiKeldiRef = useRef(0)
  const yuborilmoqdaRef = useRef(false)
  const scrollRafRef = useRef(0)
  const dostlarRef = useRef(null)
  const ochilayotganUserIdRef = useRef(null)
  const suhbatSorovRef = useRef(0)
  const avvalgiTanlanganRef = useRef(null)
  const avvalgiOxirgiIdRef = useRef(null)
  const oxirgiSuhbatParamRef = useRef(suhbatParam)
  const oxirgiUrlSuhbatRef = useRef(suhbatParam || null)
  const ochilganYozishRef = useRef('')
  const avvalgiMosTanlanganRef = useRef(null)
  const qoralamalarRef = useRef({})
  const oqilmaganTekshirildiRef = useRef(null)
  const profilKeshRef = useRef({})

  useEffect(() => {
    tanlanganRef.current = tanlangan
    suhbatRef.current = suhbat
    javobXabarRef.current = javobXabar
    yangiKeldiRef.current = yangiKeldi
    dostlarRef.current = dostlar
    ochilayotganUserIdRef.current = ochilayotganUserId
  }, [tanlangan, suhbat, javobXabar, yangiKeldi, dostlar, ochilayotganUserId])

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
    }
  }, [])

  const kirgan = status === 'authenticated'

  const urlYangila = useCallback(
    (id) => {
      oxirgiUrlSuhbatRef.current = id || null
      if (typeof window === 'undefined') return
      const keyingi = chatKirishHavolasi({ suhbatId: id || null, qaytish: qaytishParam })
      const hozirgi = window.location.pathname + window.location.search
      if (hozirgi !== keyingi) {
        window.history.replaceState(null, '', keyingi)
      }
    },
    [qaytishParam],
  )

  const suhbatniTanla = useCallback(
    (id, yangiBolim) => {
      // Hozirgi suhbat qoralamasini vaqtincha saqlab qo'yamiz (state bog'liqligisiz ref orqali)
      const joriyId = tanlanganRef.current
      const joriyMatn = matnRef.current
      const joriyJavob = javobXabarRef.current
      if (joriyId) {
        if (joriyMatn || joriyJavob) {
          qoralamalarRef.current[joriyId] = { matn: joriyMatn, javobXabar: joriyJavob }
        } else {
          delete qoralamalarRef.current[joriyId]
        }
      }
      tanlanganRef.current = id || null
      setTanlangan(id || null)
      if (!id) setSuhbat(null)
      if (yangiBolim) setBolim(yangiBolim)
      urlYangila(id || null)
    },
    [urlYangila],
  )

  // Tashqi query o'zgarganda (`?suhbat=`) sinxronlash (mahalliy replaceState aks sadosisiz)
  useEffect(() => {
    if (
      suhbatParam &&
      suhbatParam !== oxirgiSuhbatParamRef.current &&
      suhbatParam !== oxirgiUrlSuhbatRef.current
    ) {
      oxirgiUrlSuhbatRef.current = suhbatParam
      tanlanganRef.current = suhbatParam
      setTanlangan(suhbatParam)
    }
    oxirgiSuhbatParamRef.current = suhbatParam
  }, [suhbatParam])

  const royxatniYukla = useCallback(async () => {
    if (!kirgan) return
    try {
      const res = await fetch('/api/chat')
      const data = await res.json()
      if (res.ok) {
        setRoyxat((prev) => (chatRoyxatOzgardimi(prev, data) ? data : prev))
      }
    } catch {
      // jim — keyingi so'rovda qayta urinadi
    }
  }, [kirgan])

  const suhbatniYukla = useCallback(
    async (id, { jim = false } = {}) => {
      if (!id) return
      const sorovId = ++suhbatSorovRef.current
      const allaqachonYuklangan = suhbatRef.current?.suhbat?.id === id
      if (!jim && !allaqachonYuklangan) setSuhbatYuklanmoqda(true)
      try {
        const res = await fetch(`/api/chat/${id}`)
        const data = await res.json().catch(() => ({}))
        if (sorovId !== suhbatSorovRef.current) return

        if (!res.ok) {
          if (res.status === 401 || res.status === 403 || res.status === 404) {
            if (!jim) toast.error(data.error || 'Suhbat topilmadi')
            suhbatniTanla(null)
            return
          }
          if (!jim) throw new Error(data.error || 'Suhbat yuklanmadi')
          return
        }

        if (oqilmaganTekshirildiRef.current !== id) {
          oqilmaganTekshirildiRef.current = id
          const birinchi = (data.xabarlar || []).find((x) => !x.meniki && !x.oqilgan)
          setBirinchiOqilmaganId(birinchi ? birinchi.id : null)
        }

        setSuhbat((prev) => (suhbatOzgardimi(prev, data) ? data : prev))
      } catch (e) {
        if (sorovId !== suhbatSorovRef.current) return
        if (!jim) {
          toast.error(e.message || 'Suhbat yuklanmadi')
        }
      } finally {
        if (sorovId === suhbatSorovRef.current) {
          setSuhbatYuklanmoqda(false)
        }
      }
    },
    [suhbatniTanla],
  )

  useEffect(() => {
    royxatniYukla()
  }, [royxatniYukla])

  useEffect(() => {
    if (tanlangan) {
      suhbatniYukla(tanlangan, { jim: false })
    } else {
      setSuhbat(null)
      setSuhbatYuklanmoqda(false)
    }
  }, [tanlangan, suhbatniYukla])

  // `?yozish=<userId>` havolasi bilan kirganda darhol suhbat ochish
  useEffect(() => {
    if (!kirgan || !yozishParam) return
    if (ochilganYozishRef.current === yozishParam) return
    ochilganYozishRef.current = yozishParam

    let bekor = false
    const och = async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: yozishParam }),
        })
        const data = await res.json().catch(() => ({}))
        if (bekor) return
        if (!res.ok) throw new Error(data.error || 'Suhbat ochilmadi')
        setDostPanel(false)
        suhbatniTanla(data.suhbatId, data.holat === 'sorov' ? 'yuborilgan' : 'faol')
        royxatniYukla()
      } catch (e) {
        if (!bekor) toast.error(e.message || 'Suhbat ochilmadi')
      }
    }
    och()
    return () => {
      bekor = true
    }
  }, [kirgan, yozishParam, royxatniYukla, suhbatniTanla])

  // Ochiq suhbat qaysi bo'limga (`faol` / `sorov` / `yuborilgan`) tegishli ekanini bir marta moslash
  useEffect(() => {
    if (!royxat || !tanlangan) return
    if (avvalgiMosTanlanganRef.current === tanlangan) return
    const barcha = [
      ...(royxat.faol || []),
      ...(royxat.sorovlar || []),
      ...(royxat.yuborilgan || []),
    ]
    const topildi = barcha.find((s) => s.id === tanlangan)
    if (topildi) {
      setBolim(suhbatBolimi(topildi))
      avvalgiMosTanlanganRef.current = tanlangan
    }
  }, [royxat, tanlangan])

  // Davriy yangilash (jim rejimda — vaqtinchalik uzilish oynani yopmaydi)
  useEffect(() => {
    if (!kirgan) return
    const oraliq = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      royxatniYukla()
      if (tanlangan) suhbatniYukla(tanlangan, { jim: true })
    }, SOROV_ORALIGI)
    return () => clearInterval(oraliq)
  }, [kirgan, tanlangan, royxatniYukla, suhbatniYukla])

  // Aqlli pastga tushish va yangi xabar indikatori
  useEffect(() => {
    const xabarlar = suhbat?.xabarlar || []
    const yangiSuhbatmi = avvalgiTanlanganRef.current !== tanlangan
    const oxirgiId = xabarlar.length > 0 ? xabarlar[xabarlar.length - 1].id : null
    const oxirgiMeniki = xabarlar.length > 0 ? Boolean(xabarlar[xabarlar.length - 1].meniki) : false

    if (yangiSuhbatmi && suhbat?.suhbat?.id === tanlangan) {
      avvalgiTanlanganRef.current = tanlangan
      avvalgiOxirgiIdRef.current = oxirgiId
      pastdaRef.current = true
      setPastdaTuribdi(true)
      setYangiKeldi(0)
      oxirgiRef.current?.scrollIntoView({ block: 'end' })
      return
    }

    if (oxirgiId && oxirgiId !== avvalgiOxirgiIdRef.current) {
      avvalgiOxirgiIdRef.current = oxirgiId
      if (pastdaRef.current || oxirgiMeniki) {
        oxirgiRef.current?.scrollIntoView({ block: 'end' })
        setYangiKeldi(0)
      } else {
        setYangiKeldi((n) => n + 1)
      }
    }
  }, [tanlangan, suhbat?.suhbat?.id, suhbat?.xabarlar])

  // Suhbat almashganda qoralamani tiklash va panel holatlarini tozalash
  useEffect(() => {
    pastdaRef.current = true
    setPastdaTuribdi(true)
    setYangiKeldi(0)
    const saqlangan = tanlangan ? qoralamalarRef.current[tanlangan] : null
    const saqlanganMatn = saqlangan?.matn || ''
    const saqlanganJavob = saqlangan?.javobXabar || null
    matnRef.current = saqlanganMatn
    javobXabarRef.current = saqlanganJavob
    setDraftMatn(saqlanganMatn)
    setJavobXabar(saqlanganJavob)
    setAmalMenyu(false)
    setModalHolat(null)
    setProfilOchiq(false)
    setProfilData(null)
    setIchkiQidiruvOchiq(false)
    setIchkiQidiruvMatn('')
    setFaolTopilmaIdx(0)
    setAjratilganXabarId(null)
  }, [tanlangan])

  // Escape va Ctrl/Cmd+F klaviatura qisqa yo'llari
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && tanlangan && suhbat) {
        e.preventDefault()
        setIchkiQidiruvOchiq(true)
        setTimeout(() => ichkiQidiruvRef.current?.focus(), 20)
        return
      }
      if (e.key === 'Escape') {
        if (modalHolat) setModalHolat(null)
        else if (profilOchiq) setProfilOchiq(false)
        else if (amalMenyu) setAmalMenyu(false)
        else if (ichkiQidiruvOchiq) {
          setIchkiQidiruvOchiq(false)
          setIchkiQidiruvMatn('')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalHolat, profilOchiq, amalMenyu, ichkiQidiruvOchiq, tanlangan, suhbat])

  // Tezkor profil ochilganda `/api/users/[userId]` dan maxfiylikka mos yuklash
  const sherikProfiliniYukla = useCallback(async (publicUserId, { majburiy = false } = {}) => {
    if (!publicUserId) return
    if (!majburiy && profilKeshRef.current[publicUserId]) {
      setProfilData(profilKeshRef.current[publicUserId])
      return
    }
    setProfilYuklanmoqda(true)
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(publicUserId)}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Profil yuklab bo'lmadi")
      profilKeshRef.current[publicUserId] = data
      setProfilData(data)
    } catch (e) {
      toast.error(e.message || "Profil yuklanmadi")
    } finally {
      setProfilYuklanmoqda(false)
    }
  }, [])

  useEffect(() => {
    const uid = suhbat?.suhbat?.odam?.userId
    if (profilOchiq && uid) {
      sherikProfiliniYukla(uid)
    }
  }, [profilOchiq, suhbat?.suhbat?.odam?.userId, sherikProfiliniYukla])

  // Global foydalanuvchilardan qidiruv (debounce)
  useEffect(() => {
    if (!dostPanel || !kirgan) return
    const toza = dostQidiruv.trim()
    if (toza.length < 2) {
      setQidiruvNatija([])
      setQidirilmoqda(false)
      return
    }
    let bekor = false
    setQidirilmoqda(true)
    const taymer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(toza)}`)
        const data = await res.json().catch(() => ({}))
        if (!bekor && res.ok) {
          setQidiruvNatija(Array.isArray(data.users) ? data.users : [])
        }
      } catch {
        if (!bekor) setQidiruvNatija([])
      } finally {
        if (!bekor) setQidirilmoqda(false)
      }
    }, 280)

    return () => {
      bekor = true
      clearTimeout(taymer)
    }
  }, [dostPanel, dostQidiruv, kirgan])

  // Suhbat ichidagi qidiruv topilmalari
  const ichkiTopilmalar = useMemo(
    () => (ichkiQidiruvOchiq ? ichkiXabarQidir(suhbat?.xabarlar, ichkiQidiruvMatn) : []),
    [ichkiQidiruvOchiq, suhbat?.xabarlar, ichkiQidiruvMatn],
  )

  const xabargaOt = useCallback((xabarId) => {
    if (!xabarId || !oynaRef.current) return
    const el = Array.from(oynaRef.current.querySelectorAll('[data-xabar-id]')).find(
      (node) => node.getAttribute('data-xabar-id') === xabarId,
    )
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setAjratilganXabarId(xabarId)
    setTimeout(() => {
      setAjratilganXabarId((hozir) => (hozir === xabarId ? null : hozir))
    }, 1800)
  }, [])

  const ichkiQidiruvniYangila = useCallback(
    (yangiMatn) => {
      setIchkiQidiruvMatn(yangiMatn)
      const topilmalar = ichkiXabarQidir(suhbatRef.current?.xabarlar, yangiMatn)
      if (topilmalar.length > 0) {
        const oxirgiIdx = topilmalar.length - 1
        setFaolTopilmaIdx(oxirgiIdx)
        xabargaOt(topilmalar[oxirgiIdx].id)
      } else {
        setFaolTopilmaIdx(0)
      }
    },
    [xabargaOt],
  )

  const qidiruvSiljit = (yonalish) => {
    if (ichkiTopilmalar.length === 0) return
    const yangi =
      (faolTopilmaIdx + yonalish + ichkiTopilmalar.length) % ichkiTopilmalar.length
    setFaolTopilmaIdx(yangi)
    xabargaOt(ichkiTopilmalar[yangi].id)
  }

  const siljish = useCallback(() => {
    if (scrollRafRef.current) return
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0
      const el = oynaRef.current
      if (!el) return
      const pastda = el.scrollHeight - el.scrollTop - el.clientHeight < 80
      if (pastda !== pastdaRef.current) {
        pastdaRef.current = pastda
        setPastdaTuribdi(pastda)
      }
      if (pastda && yangiKeldiRef.current !== 0) {
        setYangiKeldi(0)
      }
    })
  }, [])

  const pastgaTushir = () => {
    pastdaRef.current = true
    setPastdaTuribdi(true)
    setYangiKeldi(0)
    oxirgiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  const yubor = useCallback(
    async (matnQiymat) => {
      const joriyId = tanlanganRef.current
      const toza = (typeof matnQiymat === 'string' ? matnQiymat : matnRef.current).trim()
      if (!toza || !joriyId || yuborilmoqdaRef.current) return false
      yuborilmoqdaRef.current = true
      setYuborilmoqda(true)
      const yuborilayotganJavobId = javobXabarRef.current?.id || null
      try {
        const res = await fetch(`/api/chat/${joriyId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matn: toza,
            ...(yuborilayotganJavobId ? { replyToId: yuborilayotganJavobId } : {}),
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        javobXabarRef.current = null
        setJavobXabar(null)
        delete qoralamalarRef.current[joriyId]
        pastdaRef.current = true
        setPastdaTuribdi(true)
        setYangiKeldi(0)
        setSuhbat((s) => (s ? { ...s, xabarlar: [...s.xabarlar, data.xabar] } : s))
        royxatniYukla()
        return true
      } catch (e) {
        toast.error(e.message)
        return false
      } finally {
        yuborilmoqdaRef.current = false
        setYuborilmoqda(false)
      }
    },
    [royxatniYukla],
  )

  const qadashniAlmashtir = async () => {
    if (!tanlangan || !suhbat?.suhbat || qadashJarayoni) return
    const hozirQadalgan = suhbatQadalganmi(suhbat.suhbat)
    const amal = hozirQadalgan ? 'qadashdan_ol' : 'qada'
    setQadashJarayoni(true)
    setAmalMenyu(false)
    try {
      const res = await fetch(`/api/chat/${tanlangan}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amal }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Amal bajarilmadi')

      toast.success(data.message)
      setSuhbat((s) =>
        s
          ? {
              ...s,
              suhbat: {
                ...s.suhbat,
                qadalgan: Boolean(data.qadalgan),
                qadalganVaqt: data.qadalganVaqt || null,
              },
            }
          : s,
      )
      setRoyxat((r) => {
        if (!r) return r
        const yangila = (arr) =>
          suhbatTartibla(
            (arr || []).map((item) =>
              item.id === tanlangan
                ? {
                    ...item,
                    qadalgan: Boolean(data.qadalgan),
                    qadalganVaqt: data.qadalganVaqt || null,
                  }
                : item,
            ),
          )
        return {
          ...r,
          faol: yangila(r.faol),
          sorovlar: yangila(r.sorovlar),
          yuborilgan: yangila(r.yuborilgan),
        }
      })
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setQadashJarayoni(false)
    }
  }

  const sorovga = useCallback(
    async (amal) => {
      const joriyId = tanlanganRef.current
      if (!joriyId) return
      try {
        const res = await fetch(`/api/chat/${joriyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amal }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        toast.success(data.message)
        if (amal === 'rad') suhbatniTanla(null)
        else suhbatniYukla(joriyId, { jim: true })
        royxatniYukla()
      } catch (e) {
        toast.error(e.message)
      }
    },
    [suhbatniTanla, suhbatniYukla, royxatniYukla],
  )

  const nusxaOl = useCallback(async (matnQiymat, xabarNom = 'Xabar nusxalandi') => {
    if (!matnQiymat) return
    try {
      await navigator.clipboard.writeText(matnQiymat)
      toast.success(xabarNom)
    } catch {
      toast.error("Nusxa olib bo'lmadi")
    }
  }, [])

  const xabarniOchirTasdiq = async (xabarId) => {
    if (!xabarId || modalBajarilmoqda) return
    setModalBajarilmoqda(true)
    try {
      const res = await fetch(`/api/chat/${tanlangan}?xabarId=${xabarId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setModalHolat(null)
      suhbatniYukla(tanlangan, { jim: true })
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setModalBajarilmoqda(false)
    }
  }

  const bloklaTasdiq = async () => {
    const odam = suhbat?.suhbat?.odam
    if (!odam || modalBajarilmoqda) return
    setModalBajarilmoqda(true)
    try {
      const res = await fetch('/api/chat/bloklash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: odam.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setModalHolat(null)
      setProfilOchiq(false)
      suhbatniYukla(tanlangan, { jim: true })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setModalBajarilmoqda(false)
    }
  }

  const blokniOch = useCallback(async () => {
    const joriyId = tanlanganRef.current
    const sherikDbId = suhbatRef.current?.suhbat?.odam?.id
    if (!joriyId || !sherikDbId) return
    setAmalMenyu(false)
    try {
      const res = await fetch(`/api/chat/bloklash?userId=${sherikDbId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      suhbatniYukla(joriyId, { jim: true })
    } catch (e) {
      toast.error(e.message)
    }
  }, [suhbatniYukla])

  const shikoyatTasdiq = async (e) => {
    e?.preventDefault()
    const sabab = shikoyatSababi.trim()
    if (!sabab || modalBajarilmoqda) return
    setModalBajarilmoqda(true)
    try {
      const res = await fetch('/api/chat/shikoyat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suhbatId: tanlangan, sabab }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setShikoyatSababi('')
      setModalHolat(null)
    } catch (e2) {
      toast.error(e2.message)
    } finally {
      setModalBajarilmoqda(false)
    }
  }

  // Tezkor profil ichidan obuna/do'st amallari
  const obunaAlmashtir = async () => {
    const u = profilData?.user
    if (!u || profilAmalBand) return
    const obunami = profilData?.followStatus === 'following'
    setProfilAmalBand(true)
    try {
      const res = await fetch('/api/follow', {
        method: obunami ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: u.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Amal bajarilmadi')
      toast.success(obunami ? 'Obuna bekor qilindi' : "Obuna bo'lindi")
      await sherikProfiliniYukla(u.userId, { majburiy: true })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setProfilAmalBand(false)
    }
  }

  const dostTaklifYubor = async () => {
    const u = profilData?.user
    if (!u || profilAmalBand) return
    setProfilAmalBand(true)
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: u.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Taklif yuborilmadi')
      toast.success("Do'stlik taklifi yuborildi")
      await sherikProfiliniYukla(u.userId, { majburiy: true })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setProfilAmalBand(false)
    }
  }

  const dostTaklifJavob = async (action) => {
    const u = profilData?.user
    const reqId = profilData?.requestId
    if (!u || !reqId || profilAmalBand) return
    setProfilAmalBand(true)
    try {
      const res = await fetch(`/api/friends/request/${reqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Amal bajarilmadi')
      toast.success(action === 'accept' ? "Do'stlik qabul qilindi" : 'Taklif rad etildi')
      await sherikProfiliniYukla(u.userId, { majburiy: true })
      royxatniYukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setProfilAmalBand(false)
    }
  }

  // ─── Yangi suhbat paneli ───

  const dostlarniYukla = useCallback(async () => {
    try {
      const res = await fetch('/api/profil/collection?type=friends&limit=50')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDostlar(data.items || [])
    } catch (e) {
      toast.error(e.message || "Do'stlar yuklanmadi")
      setDostlar([])
    }
  }, [])

  const dostPanelniOch = useCallback(() => {
    setDostPanel(true)
    setDostQidiruv('')
    setQidiruvNatija([])
    if (dostlarRef.current === null) dostlarniYukla()
  }, [dostlarniYukla])

  const dostPanelYop = useCallback(() => setDostPanel(false), [])
  const oqilmaganToggle = useCallback(() => setFaqatOqilmagan((v) => !v), [])
  const oqilmaganYop = useCallback(() => setFaqatOqilmagan(false), [])

  const javobBer = useCallback((x) => {
    javobXabarRef.current = x
    setJavobXabar(x)
    maydonRef.current?.focus()
  }, [])

  const javobBekor = useCallback(() => {
    javobXabarRef.current = null
    setJavobXabar(null)
  }, [])

  const xabarOchirOch = useCallback((xabarId) => {
    setModalHolat({ tur: 'xabar-ochir', xabarId })
  }, [])

  const dostBilanYoz = useCallback(
    async (odam) => {
      if (!odam?.userId || ochilayotganUserIdRef.current) return
      ochilayotganUserIdRef.current = odam.userId
      setOchilayotganUserId(odam.userId)
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: odam.userId }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setDostPanel(false)
        suhbatniTanla(data.suhbatId, data.holat === 'sorov' ? 'yuborilgan' : 'faol')
        royxatniYukla()
      } catch (e) {
        toast.error(e.message)
      } finally {
        ochilayotganUserIdRef.current = null
        setOchilayotganUserId(null)
      }
    },
    [suhbatniTanla, royxatniYukla],
  )

  const nomzodRoyxati = useMemo(() => {
    if (dostlar === null) return null
    const q = dostQidiruv.trim().toLowerCase()
    const toza = q.startsWith('@') ? q.slice(1) : q
    const filtrlanganDostlar = !toza
      ? dostlar
      : dostlar.filter((d) =>
          [d.fullName, d.username, d.userId].some((x) => {
            if (!x) return false
            const s = String(x).toLowerCase()
            return s.includes(q) || s.includes(toza)
          }),
        )
    return dostVaQidiruvBirlashtir(
      filtrlanganDostlar,
      dostQidiruv.trim().length >= 2 ? qidiruvNatija : [],
      session?.user?.userId,
    )
  }, [dostlar, dostQidiruv, qidiruvNatija, session?.user?.userId])

  // ─── Ro'yxat ───

  const bolimlar = useMemo(() => {
    if (!royxat) return []
    const faolOqilmagan = (royxat.faol || []).reduce((yig, s) => yig + (s.oqilmagan || 0), 0)
    const sorovSoni = (royxat.sorovlar || []).length
    return [
      { id: 'faol', nom: 'Suhbatlar', royxat: suhbatTartibla(royxat.faol || []), ogoh: faolOqilmagan },
      { id: 'sorov', nom: "So'rovlar", royxat: suhbatTartibla(royxat.sorovlar || []), ogoh: sorovSoni },
      { id: 'yuborilgan', nom: 'Yuborilgan', royxat: suhbatTartibla(royxat.yuborilgan || []), ogoh: 0 },
    ]
  }, [royxat])

  const joriyRoyxat = useMemo(() => {
    const b = bolimlar.find((x) => x.id === bolim)
    if (!b) return []
    return chatQatorFiltr(b.royxat, qidiruv, { faqatOqilmagan })
  }, [bolimlar, bolim, qidiruv, faqatOqilmagan])

  // ─── Kirish talabi ───

  if (status === 'loading') return <Yuklanish />

  if (!session) {
    const encodedCallback = encodeURIComponent(joriyChatUrl)
    return (
      <div className="v3 chat-sahifa" data-fon={fon}>
        <header className="chat-bosh">
          <Link href="/" className="flex items-center gap-2.5" title="Bosh sahifa">
            <span className="v3-logo" aria-hidden="true" />
            <span className="chat-bosh-nom">Xabarlar</span>
          </Link>
          <span style={{ flex: 1 }} />
          <Link href="/" className="chat-bosh-profil">
            <Ikon nom="chap" olcham={15} />
            <span>Bosh sahifa</span>
          </Link>
        </header>

        <div className="chat-bosh-holat">
          <span className="chat-bosh-ikon"><Ikon nom="qulf" olcham={26} /></span>
          <div style={{ maxWidth: 340 }}>
            <div style={{ color: 'var(--v3-matn)', fontWeight: 600, fontSize: 16 }}>
              Shaxsiy chatga kirish
            </div>
            <p style={{ marginTop: 6, lineHeight: 1.55 }}>
              Yozishmalarni ochish va do{"'"}stlaringizga yozish uchun hisobingizga kiring. Kirgandan so{"'"}ng darhol shu sahifaga qaytasiz.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link href={`/login?callbackUrl=${encodedCallback}`} className="v3-tugma-asosiy">
              Hisobga kirish
            </Link>
            <Link href={`/register?callbackUrl=${encodedCallback}`} className="v3-tugma">
              Ro{"'"}yxatdan o{"'"}tish
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const odam = suhbat?.suhbat?.odam
  const qadalganmi = suhbatQadalganmi(suhbat?.suhbat)
  const jamiOqilmagan = royxat?.oqilmagan || 0

  return (
    <div className="v3 chat-sahifa" data-fon={fon}>
      {/* ─── Sarlavha ─── */}
      <header className="chat-bosh">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" title="Bosh sahifa">
          <span className="v3-logo" aria-hidden="true" />
          <span className="chat-bosh-nom">Xabarlar</span>
        </Link>
        {jamiOqilmagan > 0 && (
          <span className="chat-nishon" title="O'qilmagan xabarlar">
            {jamiOqilmagan > 99 ? '99+' : jamiOqilmagan}
          </span>
        )}

        <span style={{ flex: 1 }} />

        <Link
          href="/profil/dostlar"
          className="chat-bosh-link"
          title="Do'stlar va qidiruv"
          aria-label="Do'stlar"
        >
          <Ikon nom="odamlar" olcham={15} />
          <span className="hidden sm:inline">Do{"'"}stlar</span>
        </Link>

        <Link
          href={qaytishManzil}
          className="chat-bosh-profil"
          title="Profilga qaytish"
        >
          <Ikon nom="chap" olcham={15} />
          <span className="hidden sm:inline">Profilga qaytish</span>
          <span className="sm:hidden">Profil</span>
        </Link>
      </header>

      <div className="chat-tana" data-korinish={tanlangan ? 'suhbat' : 'royxat'}>

        {/* ─── Chap ustun ─── */}
        <ChatChapYon
          dostPanel={dostPanel}
          onDostPanelYop={dostPanelYop}
          dostQidiruv={dostQidiruv}
          onDostQidiruvOzgarish={setDostQidiruv}
          nomzodRoyxati={nomzodRoyxati}
          qidirilmoqda={qidirilmoqda}
          ochilayotganUserId={ochilayotganUserId}
          onDostBilanYoz={dostBilanYoz}
          onDostPanelniOch={dostPanelniOch}
          qidiruv={qidiruv}
          onQidiruvOzgarish={setQidiruv}
          faqatOqilmagan={faqatOqilmagan}
          onToggleOqilmagan={oqilmaganToggle}
          onOqilmaganYop={oqilmaganYop}
          bolimlar={bolimlar}
          bolim={bolim}
          onBolimTanla={setBolim}
          royxat={royxat}
          joriyRoyxat={joriyRoyxat}
          tanlangan={tanlangan}
          onSuhbatniTanla={suhbatniTanla}
        />

        {/* ─── O'ng ustun ─── */}
        <section className="chat-oyna">
          {!tanlangan ? (
            <div className="chat-bosh-holat">
              <span className="chat-bosh-ikon"><Ikon nom="xabar" olcham={26} /></span>
              <div>
                <div style={{ color: 'var(--v3-matn)', fontWeight: 600, fontSize: 15 }}>
                  Yozishmani tanlang
                </div>
                <p style={{ marginTop: 4 }}>
                  Chapdagi ro{"'"}yxatdan suhbat tanlang yoki do{"'"}stingizga yangi xabar yozing.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button type="button" onClick={dostPanelniOch} className="v3-tugma-asosiy">
                  <Ikon nom="odamlar" olcham={16} />
                  Yangi suhbat
                </button>
                <Link href={qaytishManzil} className="v3-tugma">
                  <Ikon nom="chap" olcham={15} />
                  Profilga qaytish
                </Link>
              </div>
            </div>
          ) : !suhbat || suhbat.suhbat?.id !== tanlangan || suhbatYuklanmoqda ? (
            <div className="chat-bosh-holat">
              <span className="chat-bosh-ikon"><Ikon nom="xabar" olcham={26} /></span>
              <span>Suhbat yuklanmoqda...</span>
            </div>
          ) : (
            <>
              <div className="chat-oyna-bosh">
                <button
                  type="button"
                  onClick={() => suhbatniTanla(null)}
                  className="v3-ikon-tugma chat-orqaga"
                  aria-label="Ro'yxatga qaytish"
                  title="Suhbatlar ro'yxatiga qaytish"
                >
                  <Ikon nom="chap" olcham={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setProfilOchiq(true)}
                  className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
                  style={{ minWidth: 0, flex: 1 }}
                  title="Foydalanuvchi profilini ko'rish"
                >
                  <Avatar odam={odam} olcham={38} />
                  <span style={{ minWidth: 0 }}>
                    <span className="chat-qator-nom">
                      <span className="truncate">{odam.fullName || odam.username}</span>
                      <TasdiqBelgisi tasdiqlangan={odam.isVerified} olcham="orta" />
                    </span>
                    <span className="chat-qator-matn" style={{ display: 'block' }}>
                      {suhbat.suhbat.holat === 'sorov' ? "So'rov holatida" : `@${odam.username}`}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIchkiQidiruvOchiq((v) => {
                      const keyingi = !v
                      if (!keyingi) setIchkiQidiruvMatn('')
                      else setTimeout(() => ichkiQidiruvRef.current?.focus(), 20)
                      return keyingi
                    })
                  }}
                  className={`v3-ikon-tugma ${ichkiQidiruvOchiq ? 'chat-oyna-ikon-faol' : ''}`}
                  aria-label="Suhbat ichidan qidirish"
                  title="Xabarlardan qidirish (Ctrl+F)"
                >
                  <Ikon nom="qidiruv" olcham={16} />
                </button>

                <button
                  type="button"
                  disabled={qadashJarayoni}
                  onClick={qadashniAlmashtir}
                  className={`v3-ikon-tugma ${qadalganmi ? 'chat-oyna-ikon-faol' : ''}`}
                  aria-label={qadalganmi ? 'Qadashdan olish' : 'Suhbatni qadash'}
                  aria-pressed={qadalganmi}
                  title={qadalganmi ? 'Suhbatni qadashdan olish' : 'Suhbatni yuqoriga qadash'}
                >
                  <Ikon nom="qadash" olcham={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setProfilOchiq(true)}
                  className="chat-oyna-profil"
                  title="Yozishayotgan odam profilini ko'rish"
                >
                  <Ikon nom="odam" olcham={14} />
                  <span className="hidden sm:inline">Profilini ko{"'"}rish</span>
                  <span className="sm:hidden">Profil</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAmalMenyu((v) => !v)}
                    className="v3-ikon-tugma"
                    aria-label="Qo'shimcha amallar"
                    aria-expanded={amalMenyu}
                  >
                    <Ikon nom="kop" olcham={17} />
                  </button>

                  {amalMenyu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAmalMenyu(false)} />
                      <div className="v3-menyu v3-tushish absolute right-0 mt-2 w-60 z-50 p-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setAmalMenyu(false)
                            setProfilOchiq(true)
                          }}
                          className="v3-menyu-qator w-full text-left"
                        >
                          <Ikon nom="odam" olcham={16} />
                          <span className="flex-1 text-[13px]">Qisqacha profil</span>
                        </button>
                        <Link
                          href={`/profil/${odam.userId}?qaytishChat=${encodeURIComponent(tanlangan)}`}
                          onClick={() => setAmalMenyu(false)}
                          className="v3-menyu-qator"
                        >
                          <Ikon nom="tashqi" olcham={16} />
                          <span className="flex-1 text-[13px]">To{"'"}liq profilga o{"'"}tish</span>
                        </Link>
                        <button
                          type="button"
                          disabled={qadashJarayoni}
                          onClick={qadashniAlmashtir}
                          className="v3-menyu-qator w-full text-left"
                        >
                          <Ikon nom="qadash" olcham={16} />
                          <span className="flex-1 text-[13px]">
                            {qadalganmi ? 'Qadashdan olish' : 'Chatni yuqoriga qadash'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAmalMenyu(false)
                            setShikoyatSababi('')
                            setModalHolat({ tur: 'shikoyat' })
                          }}
                          className="v3-menyu-qator w-full text-left"
                        >
                          <Ikon nom="bayroq" olcham={16} />
                          <span className="flex-1 text-[13px]">Shikoyat qilish</span>
                        </button>
                        {suhbat.blok.menBlokladim ? (
                          <button type="button" onClick={blokniOch} className="v3-menyu-qator w-full text-left">
                            <Ikon nom="ochiq" olcham={16} />
                            <span className="flex-1 text-[13px]">Blokni ochish</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAmalMenyu(false)
                              setModalHolat({ tur: 'bloklash' })
                            }}
                            className="v3-menyu-qator is-xavf w-full text-left"
                          >
                            <Ikon nom="taqiq" olcham={16} />
                            <span className="flex-1 text-[13px]">Bloklash</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Suhbat ichidan qidirish paneli */}
              {ichkiQidiruvOchiq && (
                <div className="chat-qidiruv-paneli">
                  <input
                    ref={ichkiQidiruvRef}
                    className="chat-kirit"
                    value={ichkiQidiruvMatn}
                    onChange={(e) => ichkiQidiruvniYangila(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        qidiruvSiljit(e.shiftKey ? -1 : 1)
                      }
                    }}
                    placeholder="Yozishma ichidan so'z qidiring..."
                  />
                  <span style={{ fontSize: 12, color: 'var(--v3-xira)', whiteSpace: 'nowrap', minWidth: 44, textAlign: 'center' }}>
                    {ichkiQidiruvMatn.trim()
                      ? ichkiTopilmalar.length > 0
                        ? `${faolTopilmaIdx + 1}/${ichkiTopilmalar.length}`
                        : '0/0'
                      : ''}
                  </span>
                  <button
                    type="button"
                    disabled={ichkiTopilmalar.length === 0}
                    onClick={() => qidiruvSiljit(-1)}
                    className="v3-ikon-tugma disabled:opacity-40"
                    aria-label="Oldingi topilma"
                  >
                    <Ikon nom="tepa" olcham={15} />
                  </button>
                  <button
                    type="button"
                    disabled={ichkiTopilmalar.length === 0}
                    onClick={() => qidiruvSiljit(1)}
                    className="v3-ikon-tugma disabled:opacity-40"
                    aria-label="Keyingi topilma"
                  >
                    <Ikon nom="past" olcham={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIchkiQidiruvOchiq(false)
                      setIchkiQidiruvMatn('')
                    }}
                    className="v3-ikon-tugma"
                    aria-label="Qidiruvni yopish"
                  >
                    <Ikon nom="yopish" olcham={15} />
                  </button>
                </div>
              )}

              {/* Xabarlar */}
              <ChatXabarLenta
                xabarlar={suhbat.xabarlar}
                odam={odam}
                birinchiOqilmaganId={birinchiOqilmaganId}
                qidiruvSorovi={ichkiQidiruvOchiq ? ichkiQidiruvMatn : ''}
                ajratilganXabarId={ajratilganXabarId}
                oynaRef={oynaRef}
                oxirgiRef={oxirgiRef}
                onSiljish={siljish}
                onXabargaOt={xabargaOt}
                onJavobBer={javobBer}
                onNusxaOl={nusxaOl}
                onXabarOchir={xabarOchirOch}
              />

              {!pastdaTuribdi && (
                <button
                  type="button"
                  onClick={pastgaTushir}
                  className="chat-pastga-tugma"
                  aria-label="Eng pastga tushish"
                >
                  <Ikon nom="past" olcham={15} />
                  <span>{yangiKeldi > 0 ? `${yangiKeldi} yangi` : 'Pastga'}</span>
                </button>
              )}

              {/* Yozish qatori */}
              <ChatYozishQatori
                tanlangan={tanlangan}
                draftMatn={draftMatn}
                blokMeniBlokladi={Boolean(suhbat.blok?.meniBlokladi)}
                blokMenBlokladim={Boolean(suhbat.blok?.menBlokladim)}
                suhbatHolat={suhbat.suhbat.holat}
                menBoshladim={Boolean(suhbat.suhbat.menBoshladim)}
                odamIsm={odam.fullName || odam.username}
                javobXabar={javobXabar}
                yuborilmoqda={yuborilmoqda}
                maydonRef={maydonRef}
                matnRef={matnRef}
                onYubor={yubor}
                onBlokniOch={blokniOch}
                onSorovga={sorovga}
                onJavobBekor={javobBekor}
              />
            </>
          )}
        </section>
      </div>

      {/* ─── Yozishayotgan odamning tezkor profil modali ─── */}
      {profilOchiq && odam && (
        <div
          className="chat-modal-fon"
          role="dialog"
          aria-modal="true"
          aria-label="Foydalanuvchi profili"
          onClick={() => setProfilOchiq(false)}
        >
          <div className="chat-modal-quti chat-profil-quti" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const u = profilData?.user || odam
              const rolLabel = roleInfo(u.role).label
              const ijtimoiy = IJTIMOIY_HAVOLALAR
                .map((h) => ({ ...h, manzil: xavfsizTashqiHavola(h.kalit, u[h.kalit]) }))
                .filter((h) => h.manzil)

              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar odam={u} olcham={58} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-base truncate">{u.fullName || u.username}</h3>
                          <TasdiqBelgisi tasdiqlangan={u.isVerified} olcham="orta" />
                        </div>
                        <div className="text-xs font-mono text-[var(--v3-xira)] mt-0.5">
                          @{u.username}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="v3-tag v3-tag-ochiq text-[10.5px]">{rolLabel}</span>
                          {u.isTeacher && (
                            <span className="v3-tag text-[10.5px] border-[var(--v3-urgu)]/40 text-[var(--v3-urgu)]">
                              Ustoz
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => nusxaOl(u.userId, `ID nusxalandi: ${u.userId}`)}
                            className="v3-tag v3-tag-yopiq text-[10.5px] font-mono hover:border-[var(--v3-urgu)] transition-colors"
                            title="ID ni nusxalash"
                          >
                            ID: {u.userId}
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfilOchiq(false)}
                      className="v3-ikon-tugma shrink-0"
                      aria-label="Profil oynasini yopish"
                    >
                      <Ikon nom="yopish" olcham={16} />
                    </button>
                  </div>

                  {profilYuklanmoqda && !profilData ? (
                    <div className="py-6 text-center text-xs text-[var(--v3-xira)]">
                      Profil ma{"'"}lumotlari yuklanmoqda...
                    </div>
                  ) : profilData?.isPrivate ? (
                    <div className="p-3.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex items-center gap-2.5 text-xs text-[var(--v3-xira)]">
                      <Ikon nom="qulf" olcham={16} className="text-[var(--v3-urgu)] shrink-0" />
                      <span>Bu foydalanuvchi profilini maxfiy qilib belgilagan.</span>
                    </div>
                  ) : profilData ? (
                    <>
                      {u.bio && (
                        <p className="text-xs leading-relaxed text-[var(--v3-matn)] bg-[var(--v3-yuza)] p-3 rounded-xl border border-[var(--v3-chiziq)]">
                          {u.bio}
                        </p>
                      )}

                      {(u.university || u.location || u.academicDegree) && (
                        <div className="space-y-1.5 text-xs text-[var(--v3-xira)]">
                          {u.university && (
                            <div className="flex items-center gap-2">
                              <Ikon nom="oliy" olcham={14} className="text-[var(--v3-urgu-2)] shrink-0" />
                              <span>{u.university}{u.faculty ? ` • ${u.faculty}` : ''}</span>
                            </div>
                          )}
                          {u.location && (
                            <div className="flex items-center gap-2">
                              <Ikon nom="orin" olcham={14} className="shrink-0" />
                              <span>{u.location}</span>
                            </div>
                          )}
                          {u.academicDegree && (
                            <div className="flex items-center gap-2">
                              <Ikon nom="maktab" olcham={14} className="shrink-0" />
                              <span>{u.academicDegree}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-center">
                          <div className="font-bold text-sm font-mono">{u.totalPoints || 0}</div>
                          <div className="text-[10.5px] text-[var(--v3-xira)]">Ball</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-center">
                          <div className="font-bold text-sm font-mono">{u.currentStreak || 0}</div>
                          <div className="text-[10.5px] text-[var(--v3-xira)]">Streak</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-center">
                          <div className="font-bold text-sm font-mono">
                            {profilData?.korinadi?.obunachilar === false
                              ? '—'
                              : (profilData?.followersCount ?? u._count?.followers ?? 0)}
                          </div>
                          <div className="text-[10.5px] text-[var(--v3-xira)]">Obunachi</div>
                        </div>
                      </div>

                      {ijtimoiy.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {ijtimoiy.map((h) => (
                            <a
                              key={h.kalit}
                              href={h.manzil}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="v3-tugma text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                            >
                              <Ikon nom={h.ikon} olcham={12} />
                              <span>{h.nom}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          disabled={profilAmalBand}
                          onClick={obunaAlmashtir}
                          className={`v3-tugma text-xs py-1.5 px-3 flex-1 justify-center ${
                            profilData.followStatus === 'following' ? '' : 'v3-tugma-asosiy font-bold'
                          }`}
                        >
                          {profilData.followStatus === 'following' ? 'Obunani bekor qilish' : "+ Obuna bo'lish"}
                        </button>

                        {profilData.friendshipStatus === 'none' && (
                          <button
                            type="button"
                            disabled={profilAmalBand}
                            onClick={dostTaklifYubor}
                            className="v3-tugma text-xs py-1.5 px-3 flex-1 justify-center"
                          >
                            <Ikon nom="odamlar" olcham={13} />
                            <span>Do{"'"}stlashish</span>
                          </button>
                        )}
                        {profilData.friendshipStatus === 'sent' && (
                          <span className="v3-tag v3-tag-yopiq py-1.5 px-3 flex-1 justify-center">
                            Taklif yuborilgan
                          </span>
                        )}
                        {profilData.friendshipStatus === 'received' && (
                          <button
                            type="button"
                            disabled={profilAmalBand}
                            onClick={() => dostTaklifJavob('accept')}
                            className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3 flex-1 justify-center font-bold"
                          >
                            Taklifni qabul qilish
                          </button>
                        )}
                        {profilData.friendshipStatus === 'friend' && (
                          <span className="v3-tag v3-tag-ochiq py-1.5 px-3 inline-flex items-center gap-1">
                            <Ikon nom="tasdiq" olcham={13} />
                            <span>Do{"'"}stingiz</span>
                          </span>
                        )}
                      </div>
                    </>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--v3-chiziq)]">
                    <button
                      type="button"
                      disabled={qadashJarayoni}
                      onClick={qadashniAlmashtir}
                      className={`v3-tugma text-xs py-2 px-3 ${
                        qadalganmi ? 'border-[var(--v3-urgu)] text-[var(--v3-urgu)]' : ''
                      }`}
                    >
                      <Ikon nom="qadash" olcham={14} />
                      <span>{qadalganmi ? 'Qadalgan' : 'Chatni qadash'}</span>
                    </button>
                    <Link
                      href={`/profil/${u.userId}?qaytishChat=${encodeURIComponent(tanlangan)}`}
                      onClick={() => setProfilOchiq(false)}
                      className="v3-tugma-asosiy text-xs py-2 px-3 flex-1 justify-center"
                    >
                      <span>To{"'"}liq profilni ochish</span>
                      <Ikon nom="ong" olcham={14} />
                    </Link>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ─── Ichki modal (confirm / prompt o'rniga) ─── */}
      {modalHolat && (
        <div
          className="chat-modal-fon"
          role="dialog"
          aria-modal="true"
          onClick={() => !modalBajarilmoqda && setModalHolat(null)}
        >
          <div className="chat-modal-quti" onClick={(e) => e.stopPropagation()}>
            {modalHolat.tur === 'xabar-ochir' && (
              <>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>Xabarni o{"'"}chirish</h3>
                <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--v3-xira)', lineHeight: 1.55 }}>
                  Bu xabar ikkala tomonda ham o{"'"}chiriladi. Davom etasizmi?
                </p>
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    type="button"
                    disabled={modalBajarilmoqda}
                    onClick={() => setModalHolat(null)}
                    className="v3-tugma text-xs"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    disabled={modalBajarilmoqda}
                    onClick={() => xabarniOchirTasdiq(modalHolat.xabarId)}
                    className="v3-tugma-asosiy text-xs"
                    style={{ background: '#ef4444', color: '#fff' }}
                  >
                    {modalBajarilmoqda ? 'O‘chirilmoqda...' : "O'chirish"}
                  </button>
                </div>
              </>
            )}

            {modalHolat.tur === 'bloklash' && odam && (
              <>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>
                  {odam.fullName || odam.username} bloklansinmi?
                </h3>
                <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--v3-xira)', lineHeight: 1.55 }}>
                  Bloklangan foydalanuvchi sizga xabar yoza olmaydi va profilingizni ko{"'"}ra olmaydi.
                </p>
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    type="button"
                    disabled={modalBajarilmoqda}
                    onClick={() => setModalHolat(null)}
                    className="v3-tugma text-xs"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    disabled={modalBajarilmoqda}
                    onClick={bloklaTasdiq}
                    className="v3-tugma-asosiy text-xs"
                    style={{ background: '#ef4444', color: '#fff' }}
                  >
                    {modalBajarilmoqda ? 'Bajarilmoqda...' : 'Bloklash'}
                  </button>
                </div>
              </>
            )}

            {modalHolat.tur === 'shikoyat' && (
              <form onSubmit={shikoyatTasdiq}>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>Suhbat ustidan shikoyat</h3>
                <p style={{ marginTop: 6, fontSize: 13, color: 'var(--v3-xira)', lineHeight: 1.5 }}>
                  Sababni tanlang yoki yozing — administrator ko{"'"}rib chiqadi.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {SHIKOYAT_ANDAZALAR.map((andaza) => (
                    <button
                      key={andaza}
                      type="button"
                      onClick={() => setShikoyatSababi(andaza)}
                      className="v3-tugma"
                      style={{
                        padding: '5px 10px',
                        fontSize: 11.5,
                        borderColor:
                          shikoyatSababi === andaza ? 'var(--v3-urgu)' : 'var(--v3-chiziq)',
                      }}
                    >
                      {andaza}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={shikoyatSababi}
                  onChange={(e) => setShikoyatSababi(e.target.value)}
                  placeholder="Shikoyat sababini batafsil yozing..."
                  className="chat-kirit mt-3"
                  style={{ resize: 'vertical' }}
                  maxLength={500}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    disabled={modalBajarilmoqda}
                    onClick={() => setModalHolat(null)}
                    className="v3-tugma text-xs"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={modalBajarilmoqda || !shikoyatSababi.trim()}
                    className="v3-tugma-asosiy text-xs"
                  >
                    {modalBajarilmoqda ? 'Yuborilmoqda...' : 'Yuborish'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
