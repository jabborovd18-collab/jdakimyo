'use client'

import Ikon from '@/components/Ikon'
import { DoskaOldindanKorish } from './DoskaKorinish'
import styles from './oyin.module.css'

export const DARAJALAR = [
  { id: 1, nom: 'Oson', ishora: 'Kimyoviy nom', tasvir: 'Formulalar' },
  { id: 2, nom: 'O‘rta', ishora: 'Trivial nom', tasvir: 'Formulalar' },
  { id: 3, nom: 'Qiyin', ishora: 'Modda nomi', tasvir: 'CPK modellari' },
  { id: 4, nom: 'Juda qiyin', ishora: 'Olim va yil', tasvir: 'CPK modellari' },
  { id: 5, nom: 'Aralash', ishora: 'Barcha turlar', tasvir: 'Formula va CPK' },
]

export const STANDART_KARTALAR = {
  kombo2x: true,
  vaqt15: true,
  yordam50: true,
  qalqon: true,
  sirli: true,
  notogriBos: true,
  muzlatish: true,
  tuman: true,
  aralashtir: true,
  bomba: true,
}

export const STANDART_SOZLAMA = {
  rejim: 'yakka',
  duelKartaTartibi: 'har-xil',
  duelJoylashuv: 'yonma-yon',
  p1Nom: '1-o‘yinchi',
  p2Nom: '2-o‘yinchi',
  harakat: 'yolak',
  tezlik: 'orta',
  kartaRitm: 'orta',
  daraja: 1,
  vaqtSekund: 90,
  savollarSoni: 7,
  kartalar: { ...STANDART_KARTALAR },
  ovozEfekt: true,
  matnDarhol: false,
}

const YAXSHI_KARTALAR = [
  { id: 'kombo2x', nom: '2× Kombo', ikon: 'chaqmoq', tur: 'kombo', tavsif: '16s davomida ballar ikki barobar' },
  { id: 'vaqt15', nom: '+15 soniya', ikon: 'vaqt', tur: 'vaqt', tavsif: 'Taymerga darhol +15s qo‘shadi' },
  { id: 'yordam50', nom: '50/50 Yordam', ikon: 'filtr', tur: 'yordam', tavsif: '12 ta noto‘g‘ri kartani o‘chiradi' },
  { id: 'qalqon', nom: 'Qalqon', ikon: 'qalqon', tur: 'qalqon', tavsif: '1 xato yoki hujumdan himoya' },
  { id: 'sirli', nom: 'Sirli karta (?)', ikon: 'uchqun', tur: 'sirli', tavsif: '+3 ball, yordam yoki hazil chiqadi' },
]

const YOMON_KARTALAR = [
  {
    id: 'notogriBos',
    nom: 'Noto‘g‘risini bos',
    ikon: 'ogohlantirish',
    tur: 'tuzoq',
    yakkaTavsif: 'Teskari sinov: noto‘g‘riga +2 ball',
    duelTavsif: 'Raqibga teskari tuzoq tashlaydi',
  },
  {
    id: 'muzlatish',
    nom: 'Muzlatish',
    ikon: 'kristall',
    tur: 'muz',
    yakkaTavsif: 'Ulgurmasa 2.5s blok tushadi',
    duelTavsif: 'Raqibni 3.5s ga muzlatadi',
  },
  {
    id: 'tuman',
    nom: 'Tuman',
    ikon: 'tolqin',
    tur: 'tuzoq',
    yakkaTavsif: 'Ulgurmasa 6s doska xiralashadi',
    duelTavsif: 'Raqib doskasini 6s xiralashtiradi',
  },
  {
    id: 'aralashtir',
    nom: 'Aralashtir',
    ikon: 'qayta',
    tur: 'tuzoq',
    yakkaTavsif: 'Ulgurmasa kartalar almashadi',
    duelTavsif: 'Raqib kartalari joyini chalkashtiradi',
  },
  {
    id: 'bomba',
    nom: 'Bomba (Bosmang!)',
    ikon: 'taqiq',
    tur: 'bomba',
    yakkaTavsif: 'Bosgan o‘yinchi -1 ball va -10s oladi',
    duelTavsif: 'Bosgan o‘yinchi -1 ball yo‘qotadi',
  },
]

const SHABLONLAR = [
  {
    nom: 'Klassik',
    izoh: 'Yo‘lak · Yaxshi kartalar',
    qism: {
      rejim: 'yakka',
      harakat: 'yolak',
      tezlik: 'orta',
      kartaRitm: 'orta',
      vaqtSekund: 90,
      kartalar: {
        kombo2x: true, vaqt15: true, yordam50: true, qalqon: true, sirli: true,
        notogriBos: false, muzlatish: false, tuman: false, aralashtir: false, bomba: false,
      },
    },
  },
  {
    nom: '3D Shar Kaos',
    izoh: '3D Shar · Shiddatli ritm',
    qism: {
      rejim: 'yakka',
      harakat: 'shar',
      tezlik: 'orta',
      kartaRitm: 'tez',
      vaqtSekund: 90,
      kartalar: { ...STANDART_KARTALAR },
    },
  },
  {
    nom: 'Atom Orbitallari',
    izoh: '3 qobiq · Tez aylanish',
    qism: {
      rejim: 'yakka',
      harakat: 'orbital',
      tezlik: 'tez',
      kartaRitm: 'orta',
      vaqtSekund: 90,
      kartalar: { ...STANDART_KARTALAR },
    },
  },
  {
    nom: 'Kvant 1v1 Duel',
    izoh: 'Zero-G · Har xil kartalar',
    qism: {
      rejim: 'duel-savol',
      duelKartaTartibi: 'har-xil',
      harakat: 'kvant',
      tezlik: 'orta',
      kartaRitm: 'tez',
      vaqtSekund: 90,
      kartalar: { ...STANDART_KARTALAR },
    },
  },
]

export default function SozlamaEkrani({ sozlama, onOzgartir, onQaytaTiklash, onBoshlash, kutilyapti }) {
  const duelmi = sozlama.rejim !== 'yakka'
  const vaqtMajburiy = sozlama.rejim === 'duel-vaqt'

  function yangila(qism) {
    onOzgartir({ ...sozlama, ...qism })
  }

  function kartaOzgartir(kalit) {
    const keyingiQiymat = !sozlama.kartalar[kalit]
    const yangiKartalar = { ...sozlama.kartalar, [kalit]: keyingiQiymat }
    if (kalit === 'vaqt15' && keyingiQiymat && sozlama.vaqtSekund === 0) {
      onOzgartir({ ...sozlama, vaqtSekund: 90, kartalar: yangiKartalar })
      return
    }
    onOzgartir({ ...sozlama, kartalar: yangiKartalar })
  }

  function kartalarToplami(rejim) {
    const k = { ...sozlama.kartalar }
    if (rejim === 'hammasi') {
      Object.keys(k).forEach((key) => { k[key] = true })
      const yangiVaqt = sozlama.vaqtSekund === 0 ? 90 : sozlama.vaqtSekund
      onOzgartir({ ...sozlama, vaqtSekund: yangiVaqt, kartalar: k })
      return
    }
    if (rejim === 'yaxshi') {
      YAXSHI_KARTALAR.forEach(({ id }) => { k[id] = true })
      YOMON_KARTALAR.forEach(({ id }) => { k[id] = false })
      const yangiVaqt = sozlama.vaqtSekund === 0 ? 90 : sozlama.vaqtSekund
      onOzgartir({ ...sozlama, vaqtSekund: yangiVaqt, kartalar: k })
      return
    }
    if (rejim === 'yomon') {
      YAXSHI_KARTALAR.forEach(({ id }) => { k[id] = false })
      YOMON_KARTALAR.forEach(({ id }) => { k[id] = true })
      onOzgartir({ ...sozlama, kartalar: k })
      return
    }
    Object.keys(k).forEach((key) => { k[key] = false })
    onOzgartir({ ...sozlama, kartalar: k })
  }

  function rejimTanla(yangiRejim) {
    const yangiVaqt = yangiRejim === 'duel-vaqt' && sozlama.vaqtSekund === 0 ? 90 : sozlama.vaqtSekund
    const yangiTartib = yangiRejim === 'duel-vaqt' ? 'har-xil' : sozlama.duelKartaTartibi
    onOzgartir({ ...sozlama, rejim: yangiRejim, vaqtSekund: yangiVaqt, duelKartaTartibi: yangiTartib })
  }

  function vaqtTanla(sekund) {
    if (vaqtMajburiy && sekund === 0) return
    const yangiKartalar = sekund === 0 ? { ...sozlama.kartalar, vaqt15: false } : sozlama.kartalar
    onOzgartir({ ...sozlama, vaqtSekund: sekund, kartalar: yangiKartalar })
  }

  const yaxshiSoni = YAXSHI_KARTALAR.filter((k) => sozlama.kartalar[k.id]).length
  const yomonSoni = YOMON_KARTALAR.filter((k) => sozlama.kartalar[k.id]).length
  const harakatNom =
    sozlama.harakat === 'shar'
      ? '3D Shar'
      : sozlama.harakat === 'orbital'
        ? 'Atom orbitallari'
        : sozlama.harakat === 'kvant'
          ? 'Kvant maydon'
          : 'Chiziqli yo‘laklar'

  return (
    <section className={`v3-panel-karta ${styles.sozlama}`}>
      {/* Bosh qism + Jonli doska namunasi */}
      <div className={styles.lobbyHero}>
        <div className={styles.lobbyHeroGrid}>
          <div className={styles.lobbyHeroMatn}>
            <span className={styles.lobbyNishon}>
              <Ikon nom="uchqun" olcham={14} /> JDA KIMYO ARENA
            </span>
            <h1>Formulani top</h1>
            <p>
              24 ta modda va 3D molekulalar orasidan to‘g‘risini toping. 4 xil harakat rejimi, yaxshi/yomon/sirli
              kartalar va 1v1 jonli bellashuv.
            </p>
            <div className={styles.shablonlar}>
              <span className={styles.ichkiYorliq}>Tezkor shablonlar:</span>
              <div className={styles.shablonGrid}>
                {SHABLONLAR.map((sh) => (
                  <button
                    key={sh.nom}
                    type="button"
                    className={styles.shablonTugma}
                    onClick={() => onOzgartir({ ...sozlama, ...sh.qism })}
                  >
                    <strong>{sh.nom}</strong>
                    <small>{sh.izoh}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DoskaOldindanKorish harakat={sozlama.harakat} tezlik={sozlama.tezlik} />
        </div>
      </div>

      <div className={styles.lobbyPanellar}>
        {/* 1. O'yin rejimi */}
        <fieldset className={styles.lobbyBlok}>
          <legend>1. O‘yin rejimi</legend>
          <div className={styles.ikkiUstun}>
            <button
              type="button"
              className={styles.tanlovKarta}
              data-faol={!duelmi ? 'true' : undefined}
              onClick={() => rejimTanla('yakka')}
            >
              <span className={styles.tanlovIkon}><Ikon nom="odam" olcham={20} /></span>
              <span>
                <strong>Yakka o‘yin</strong>
                <small>Seriya, kombo, aniqlik va unvon uchun</small>
              </span>
            </button>

            <button
              type="button"
              className={styles.tanlovKarta}
              data-faol={duelmi ? 'true' : undefined}
              onClick={() => rejimTanla(duelmi ? sozlama.rejim : 'duel-savol')}
            >
              <span className={styles.tanlovIkon}><Ikon nom="odamlar" olcham={20} /></span>
              <span>
                <strong>1v1 Duel (Ikki ekran)</strong>
                <small>Ekran ikkiga bo‘linadi, jonli bellashuv</small>
              </span>
            </button>
          </div>

          {duelmi && (
            <div className={styles.ichkiPanel}>
              <div className={styles.ichkiQator}>
                <span className={styles.ichkiYorliq}>Bellashuv qoidasi:</span>
                <div className={styles.chipGuruh}>
                  <button
                    type="button"
                    className={styles.chip}
                    data-faol={sozlama.rejim === 'duel-savol' ? 'true' : undefined}
                    onClick={() => rejimTanla('duel-savol')}
                  >
                    Bitta savolda poyga
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    data-faol={sozlama.rejim === 'duel-vaqt' ? 'true' : undefined}
                    onClick={() => rejimTanla('duel-vaqt')}
                  >
                    Vaqtga mustaqil bellashuv
                  </button>
                </div>
              </div>

              <div className={styles.ichkiQator}>
                <span className={styles.ichkiYorliq}>1v1 Karta tushishi:</span>
                <div className={styles.chipGuruh}>
                  <button
                    type="button"
                    className={styles.chip}
                    data-faol={sozlama.duelKartaTartibi === 'bir-xil' ? 'true' : undefined}
                    onClick={() => yangila({ duelKartaTartibi: 'bir-xil' })}
                  >
                    Bir xil karta (Poyga)
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    data-faol={sozlama.duelKartaTartibi === 'har-xil' ? 'true' : undefined}
                    onClick={() => yangila({ duelKartaTartibi: 'har-xil' })}
                  >
                    Ikki xil karta (Mustaqil)
                  </button>
                </div>
              </div>

              <div className={styles.ichkiQator}>
                <span className={styles.ichkiYorliq}>Ekran bo‘linishi:</span>
                <div className={styles.chipGuruh}>
                  <button
                    type="button"
                    className={styles.chip}
                    data-faol={sozlama.duelJoylashuv === 'yonma-yon' ? 'true' : undefined}
                    onClick={() => yangila({ duelJoylashuv: 'yonma-yon' })}
                  >
                    Yonma-yon (Doska / Kompyuter)
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    data-faol={sozlama.duelJoylashuv === 'qarama-qarshi' ? 'true' : undefined}
                    onClick={() => yangila({ duelJoylashuv: 'qarama-qarshi' })}
                  >
                    Qarama-qarshi (Planshet 180°)
                  </button>
                </div>
              </div>

              <div className={styles.nomlarQatori}>
                <label className={styles.nomKirit}>
                  <span>1-o‘yinchi</span>
                  <input
                    type="text"
                    maxLength={18}
                    value={sozlama.p1Nom}
                    onChange={(e) => yangila({ p1Nom: e.target.value })}
                    placeholder="1-o‘yinchi"
                  />
                </label>
                <label className={styles.nomKirit}>
                  <span>2-o‘yinchi</span>
                  <input
                    type="text"
                    maxLength={18}
                    value={sozlama.p2Nom}
                    onChange={(e) => yangila({ p2Nom: e.target.value })}
                    placeholder="2-o‘yinchi"
                  />
                </label>
              </div>
            </div>
          )}
        </fieldset>

        {/* 2. Doska harakati: 4 zamonaviy rejim */}
        <fieldset className={styles.lobbyBlok}>
          <legend>2. Doska harakati va tezlik</legend>
          <div className={styles.ikkiUstun}>
            <button
              type="button"
              className={styles.tanlovKarta}
              data-faol={sozlama.harakat === 'yolak' ? 'true' : undefined}
              onClick={() => yangila({ harakat: 'yolak' })}
            >
              <span className={styles.tanlovIkon}><Ikon nom="panjara" olcham={20} /></span>
              <span>
                <strong>Chiziqli yo‘laklar</strong>
                <small>Uzunlik bo‘ylab oqadigan 4 ta qator</small>
              </span>
            </button>

            <button
              type="button"
              className={styles.tanlovKarta}
              data-faol={sozlama.harakat === 'shar' ? 'true' : undefined}
              onClick={() => yangila({ harakat: 'shar' })}
            >
              <span className={styles.tanlovIkon}><Ikon nom="yadro" olcham={20} /></span>
              <span>
                <strong>3D Shar ichida</strong>
                <small>Fazoviy sharda aylanadi va sudrab buriladi</small>
              </span>
            </button>

            <button
              type="button"
              className={styles.tanlovKarta}
              data-faol={sozlama.harakat === 'orbital' ? 'true' : undefined}
              onClick={() => yangila({ harakat: 'orbital' })}
            >
              <span className={styles.tanlovIkon}><Ikon nom="atom" olcham={20} /></span>
              <span>
                <strong>Atom orbitallari</strong>
                <small>Yadro atrofida 3 ta qobiqda aylanadi</small>
              </span>
            </button>

            <button
              type="button"
              className={styles.tanlovKarta}
              data-faol={sozlama.harakat === 'kvant' ? 'true' : undefined}
              onClick={() => yangila({ harakat: 'kvant' })}
            >
              <span className={styles.tanlovIkon}><Ikon nom="uchqun" olcham={20} /></span>
              <span>
                <strong>Kvant maydon (Zero-G)</strong>
                <small>Erkin suzuvchi fizik pufaklar va bog‘lar</small>
              </span>
            </button>
          </div>

          <div className={styles.ichkiPanel}>
            <div className={styles.ichkiQator}>
              <span className={styles.ichkiYorliq}>Harakat tezligi:</span>
              <div className={styles.chipGuruh}>
                {[
                  ['sekin', 'Sekin'],
                  ['orta', 'O‘rtacha'],
                  ['tez', 'Tez'],
                  ['statik', 'Harakatsiz'],
                ].map(([id, nom]) => (
                  <button
                    key={id}
                    type="button"
                    className={styles.chip}
                    data-faol={sozlama.tezlik === id ? 'true' : undefined}
                    onClick={() => yangila({ tezlik: id })}
                  >
                    {nom}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* 3. Qiyinlik darajasi, Vaqt va Savollar */}
        <fieldset className={styles.lobbyBlok}>
          <legend>3. Qiyinlik darajasi, vaqt va savollar</legend>
          <div className={styles.darajalar}>
            {DARAJALAR.map(({ id, nom, ishora, tasvir }) => (
              <label key={id} className={styles.daraja}>
                <input
                  type="radio"
                  name="daraja"
                  disabled={kutilyapti}
                  checked={sozlama.daraja === id}
                  onChange={() => yangila({ daraja: id })}
                />
                <strong>{nom}</strong>
                <span>{ishora} · {tasvir}</span>
              </label>
            ))}
          </div>

          <div className={styles.ichkiPanel}>
            <div className={styles.ichkiQator}>
              <span className={styles.ichkiYorliq}>Vaqt chegarasi:</span>
              <div className={styles.chipGuruh}>
                {[
                  [0, 'Cheksiz'],
                  [60, '60 soniya'],
                  [90, '90 soniya'],
                  [120, '120 soniya'],
                ].map(([sekund, nom]) => (
                  <button
                    key={sekund}
                    type="button"
                    className={styles.chip}
                    disabled={vaqtMajburiy && sekund === 0}
                    data-faol={sozlama.vaqtSekund === sekund ? 'true' : undefined}
                    onClick={() => vaqtTanla(sekund)}
                  >
                    {nom}
                  </button>
                ))}
              </div>
            </div>

            {sozlama.rejim !== 'duel-vaqt' && (
              <div className={styles.ichkiQator}>
                <span className={styles.ichkiYorliq}>Savollar soni:</span>
                <div className={styles.chipGuruh}>
                  {[7, 10, 15].map((soni) => (
                    <button
                      key={soni}
                      type="button"
                      className={styles.chip}
                      data-faol={sozlama.savollarSoni === soni ? 'true' : undefined}
                      onClick={() => yangila({ savollarSoni: soni })}
                    >
                      {soni} ta savol
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </fieldset>

        {/* 4. Yaxshi, Sirli va Yomon kartochkalar */}
        <fieldset className={styles.lobbyBlok}>
          <div className={styles.kartalarSarlavha}>
            <legend>4. Maxsus kartochkalar ({yaxshiSoni} yaxshi · {yomonSoni} yomon)</legend>
            <div className={styles.chipGuruh}>
              <button type="button" className={styles.kichikChip} onClick={() => kartalarToplami('hammasi')}>
                Hammasi
              </button>
              <button type="button" className={styles.kichikChip} onClick={() => kartalarToplami('yaxshi')}>
                Faqat yaxshilar
              </button>
              <button type="button" className={styles.kichikChip} onClick={() => kartalarToplami('yomon')}>
                Faqat yomonlar
              </button>
              <button type="button" className={styles.kichikChip} onClick={() => kartalarToplami('yoq')}>
                O‘chirish
              </button>
            </div>
          </div>

          <div className={styles.ichkiPanel}>
            <div className={styles.ichkiQator}>
              <span className={styles.ichkiYorliq}>Kartalar chiqish ritmi:</span>
              <div className={styles.chipGuruh}>
                {[
                  ['sokin', 'Sokin'],
                  ['orta', 'O‘rtacha'],
                  ['tez', 'Shiddatli'],
                ].map(([id, nom]) => (
                  <button
                    key={id}
                    type="button"
                    className={styles.chip}
                    data-faol={sozlama.kartaRitm === id ? 'true' : undefined}
                    onClick={() => yangila({ kartaRitm: id })}
                  >
                    {nom}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.kartaGuruhNomi} data-guruh="yaxshi">Yaxshi va sirli kartalar</div>
          <div className={styles.kartalarGrid}>
            {YAXSHI_KARTALAR.map(({ id, nom, ikon, tur, tavsif }) => {
              const faol = Boolean(sozlama.kartalar[id])
              return (
                <button
                  key={id}
                  type="button"
                  className={styles.kartaTanlov}
                  data-faol={faol ? 'true' : undefined}
                  data-tur={tur}
                  onClick={() => kartaOzgartir(id)}
                >
                  <div className={styles.kartaTanlovTepa}>
                    <Ikon nom={ikon} olcham={18} />
                    <span className={styles.kartaHolatNuqta}>{faol ? 'Yoqilgan' : 'O‘chiq'}</span>
                  </div>
                  <strong>{nom}</strong>
                  <small>{id === 'vaqt15' && sozlama.vaqtSekund === 0 ? 'Bosilganda 90s taymer yoqiladi' : tavsif}</small>
                </button>
              )
            })}
          </div>

          <div className={styles.kartaGuruhNomi} data-guruh="yomon">Yomon / Xavf va tuzoq kartalar</div>
          <div className={styles.kartalarGrid}>
            {YOMON_KARTALAR.map(({ id, nom, ikon, tur, yakkaTavsif, duelTavsif }) => {
              const faol = Boolean(sozlama.kartalar[id])
              return (
                <button
                  key={id}
                  type="button"
                  className={styles.kartaTanlov}
                  data-faol={faol ? 'true' : undefined}
                  data-tur={tur}
                  onClick={() => kartaOzgartir(id)}
                >
                  <div className={styles.kartaTanlovTepa}>
                    <Ikon nom={ikon} olcham={18} />
                    <span className={styles.kartaHolatNuqta}>{faol ? 'Yoqilgan' : 'O‘chiq'}</span>
                  </div>
                  <strong>{nom}</strong>
                  <small>{duelmi ? duelTavsif : yakkaTavsif}</small>
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>

      {/* Pastki boshqaruv va boshlash */}
      <div className={styles.lobbyPast}>
        <div className={styles.qoshimchaTanlovlar}>
          <label className={styles.belgiQuti}>
            <input
              type="checkbox"
              checked={sozlama.ovozEfekt}
              onChange={(e) => yangila({ ovozEfekt: e.target.checked })}
            />
            <span>O‘yin ovoz effektlari</span>
          </label>
          <label className={styles.belgiQuti}>
            <input
              type="checkbox"
              checked={sozlama.matnDarhol}
              onChange={(e) => yangila({ matnDarhol: e.target.checked })}
            />
            <span>Ishora matnini darhol ko‘rsatish</span>
          </label>
          <button type="button" className={styles.kichikChip} onClick={onQaytaTiklash}>
            Standartga qaytarish
          </button>
        </div>

        <div className={styles.boshlashQatori}>
          <span className={styles.xulosaMatn}>
            {duelmi ? '1v1 Duel' : 'Yakka'} · {harakatNom} · {DARAJALAR.find((d) => d.id === sozlama.daraja)?.nom} ·{' '}
            {sozlama.vaqtSekund > 0 ? `${sozlama.vaqtSekund}s` : 'Cheksiz'}
          </span>
          <button type="button" className={styles.asosiy} disabled={kutilyapti} onClick={onBoshlash}>
            <Ikon nom="play" olcham={18} />
            {kutilyapti ? 'Yuklanmoqda…' : duelmi ? '1v1 Duelni boshlash' : 'O‘yinni boshlash'}
          </button>
        </div>
      </div>
    </section>
  )
}
