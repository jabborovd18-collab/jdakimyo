'use client'

import Ikon from '@/components/Ikon'
import { DARAJALAR } from './SozlamaEkrani'
import styles from './oyin.module.css'

function unvonAniqlash(togri, urinish, engUzunSeriya) {
  const foiz = urinish > 0 ? Math.round((togri / urinish) * 100) : 0
  if (foiz >= 90 && engUzunSeriya >= 4) return 'Kvant Alkimyogari'
  if (foiz >= 75) return 'Laboratoriya Ustasi'
  if (foiz >= 50) return 'Kimyo Izlanuvchisi'
  return 'Kimyo Shogirdi'
}

export default function YakunEkrani({ sozlama, yakun, onQayta, onSozlama }) {
  const darajaNom = DARAJALAR.find((d) => d.id === sozlama.daraja)?.nom || 'Oson'

  if (yakun.rejim === 'yakka') {
    const urinish = yakun.urinishlarSoni || yakun.jami || yakun.togriSoni || 0
    const aniqlik = urinish > 0 ? Math.min(100, Math.round((yakun.togriSoni / urinish) * 100)) : 0
    const unvon = unvonAniqlash(yakun.togriSoni, urinish, yakun.engUzunSeriya)
    const tezlikText = yakun.ortachaVaqtMs ? `${(yakun.ortachaVaqtMs / 1000).toFixed(1)}s` : '—'

    return (
      <section className={`v3-panel-karta ${styles.yakunPanel}`}>
        <div className={styles.yakunBosh}>
          <span className={styles.yakunKubok}><Ikon nom="kubok" olcham={30} /></span>
          <div>
            <span className={styles.unvonNishon}>{unvon}</span>
            <h1>{yakun.vaqtTugadi ? 'Vaqt tugadi!' : 'Raund yakunlandi'}</h1>
            <p className={styles.yakunIzoh}>Daraja: {darajaNom} · Aniqlik: {aniqlik}%</p>
          </div>
        </div>

        <div className={styles.yakunRaqamlar}>
          <div className={styles.statKarta}>
            <span>Umumiy ball</span>
            <strong>{yakun.ball}</strong>
          </div>
          <div className={styles.statKarta}>
            <span>To‘g‘ri javoblar</span>
            <strong>{yakun.togriSoni}{yakun.jami ? ` / ${yakun.jami}` : ''}</strong>
          </div>
          <div className={styles.statKarta}>
            <span>Eng uzun seriya</span>
            <strong>{yakun.engUzunSeriya}×</strong>
          </div>
          <div className={styles.statKarta}>
            <span>O‘rtacha tezlik</span>
            <strong>{tezlikText}</strong>
          </div>
          <div className={styles.statKarta}>
            <span>Maxsus kartalar</span>
            <strong>{yakun.kartalarSoni || 0}</strong>
          </div>
        </div>

        {yakun.xatolar?.length > 0 && (
          <div className={styles.xatolarBlok}>
            <h2>Takrorlash uchun ({yakun.xatolar.length})</h2>
            <ul className={styles.takrorlash}>
              {yakun.xatolar.map(({ formula, nom, trivial }, idx) => (
                <li key={`${formula}-${idx}`}>
                  {trivial || nom} · <strong>{formula}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.amallar}>
          <button type="button" className={styles.asosiy} onClick={onQayta}>
            <Ikon nom="qayta" olcham={18} /> Qayta o‘ynash
          </button>
          <button type="button" className={styles.tugma} onClick={onSozlama}>
            <Ikon nom="sozlama" olcham={18} /> Sozlamalar
          </button>
        </div>
      </section>
    )
  }

  const p1Nom = sozlama.p1Nom?.trim() || '1-o‘yinchi'
  const p2Nom = sozlama.p2Nom?.trim() || '2-o‘yinchi'
  const p1Kartalar = yakun.p1Kartalar ?? yakun.p1?.kartalarSoni ?? 0
  const p2Kartalar = yakun.p2Kartalar ?? yakun.p2?.kartalarSoni ?? 0
  const golib =
    yakun.p1.ball > yakun.p2.ball
      ? `${p1Nom} g‘olib!`
      : yakun.p2.ball > yakun.p1.ball
        ? `${p2Nom} g‘olib!`
        : 'Durang natija!'

  return (
    <section className={`v3-panel-karta ${styles.yakunPanel}`}>
      <div className={styles.yakunBosh}>
        <span className={styles.yakunKubok}><Ikon nom="kubok" olcham={30} /></span>
        <div>
          <h1>{golib}</h1>
          <p className={styles.yakunIzoh}>
            {sozlama.rejim === 'duel-savol' ? 'Bitta savolda poyga' : 'Vaqtga mustaqil bellashuv'} · {darajaNom}
          </p>
        </div>
      </div>

      <div className={styles.duelYakunGrid}>
        {[
          {
            nom: p1Nom,
            malumot: yakun.p1,
            kartalar: p1Kartalar,
            golibmi: yakun.p1.ball > yakun.p2.ball,
            tomon: 'p1',
          },
          {
            nom: p2Nom,
            malumot: yakun.p2,
            kartalar: p2Kartalar,
            golibmi: yakun.p2.ball > yakun.p1.ball,
            tomon: 'p2',
          },
        ].map(({ nom, malumot, kartalar, golibmi, tomon }) => (
          <div key={tomon} className={styles.duelYakunKarta} data-tomon={tomon} data-golib={golibmi ? 'true' : undefined}>
            <div className={styles.duelYakunSar}>
              <strong>{nom}</strong>
              {golibmi && <span className={styles.golibNishon}><Ikon nom="toj" olcham={16} /> G‘olib</span>}
            </div>
            <div className={styles.duelYakunBall}>{malumot.ball} ball</div>
            <div className={styles.duelYakunMeta}>
              <span>To‘g‘ri: <b>{malumot.togriSoni}</b></span>
              <span>Seriya: <b>{malumot.engUzunSeriya}×</b></span>
              <span>Kartalar: <b>{kartalar}</b></span>
              {malumot.ortachaVaqtMs && (
                <span>Tezlik: <b>{(malumot.ortachaVaqtMs / 1000).toFixed(1)}s</b></span>
              )}
            </div>
          </div>
        ))}
      </div>

      {yakun.xatolar?.length > 0 && (
        <div className={styles.xatolarBlok}>
          <h2>Takrorlash uchun ({yakun.xatolar.length})</h2>
          <ul className={styles.takrorlash}>
            {yakun.xatolar.map(({ formula, nom, trivial }, idx) => (
              <li key={`${formula}-${idx}`}>
                {trivial || nom} · <strong>{formula}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.amallar}>
        <button type="button" className={styles.asosiy} onClick={onQayta}>
          <Ikon nom="qayta" olcham={18} /> Revansh o‘ynash
        </button>
        <button type="button" className={styles.tugma} onClick={onSozlama}>
          <Ikon nom="sozlama" olcham={18} /> Sozlamalar
        </button>
      </div>
    </section>
  )
}
