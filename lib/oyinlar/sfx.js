// Brauzer Web Audio API orqali umumiy kimyoviy o'yin ovoz effektlari.

let audioKontekst = null

function kontekstOl() {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  if (!audioKontekst) {
    audioKontekst = new Ctx()
  }
  if (audioKontekst.state === 'suspended') {
    audioKontekst.resume().catch(() => {})
  }
  return audioKontekst
}

export function ohangChal(notalar, turi = 'sine', hajm = 0.08) {
  const ctx = kontekstOl()
  if (!ctx) return
  try {
    const boshlanish = ctx.currentTime
    notalar.forEach(([chastota, kechikish, davom]) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = turi
      osc.frequency.setValueAtTime(chastota, boshlanish + kechikish)
      gain.gain.setValueAtTime(0.001, boshlanish + kechikish)
      gain.gain.exponentialRampToValueAtTime(hajm, boshlanish + kechikish + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, boshlanish + kechikish + davom)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(boshlanish + kechikish)
      osc.stop(boshlanish + kechikish + davom + 0.02)
    })
  } catch {
    // Ovoz bloklangan brauzerlarda o'yin to'xtab qolmasin.
  }
}

export function sfxChal(nom, yoqilgan, seriya = 1) {
  if (!yoqilgan) return
  const koef = Math.pow(1.05946, Math.min(8, Math.max(0, seriya - 1)))

  if (nom === 'togri') {
    ohangChal([[523.25 * koef, 0, 0.11], [659.25 * koef, 0.07, 0.15]], 'triangle', 0.09)
  } else if (nom === 'kombo') {
    ohangChal([[587.33 * koef, 0, 0.09], [783.99 * koef, 0.06, 0.11], [1046.5 * koef, 0.12, 0.19]], 'triangle', 0.1)
  } else if (nom === 'xato') {
    ohangChal([[220, 0, 0.12], [175, 0.09, 0.16]], 'sawtooth', 0.055)
  } else if (nom === 'bomba') {
    ohangChal([[140, 0, 0.16], [95, 0.06, 0.24], [65, 0.12, 0.28]], 'sawtooth', 0.09)
  } else if (nom === 'kartaChiqdi') {
    ohangChal([[740, 0, 0.07], [987.77, 0.07, 0.12]], 'sine', 0.065)
  } else if (nom === 'kartaOlindi') {
    ohangChal([[659.25, 0, 0.08], [880, 0.06, 0.09], [1174.66, 0.12, 0.16]], 'triangle', 0.09)
  } else if (nom === 'qalqon') {
    ohangChal([[440, 0, 0.08], [659.25, 0.05, 0.1], [880, 0.1, 0.18]], 'sine', 0.09)
  } else if (nom === 'yordam50') {
    ohangChal([[880, 0, 0.07], [1174.66, 0.05, 0.12]], 'sine', 0.08)
  } else if (nom === 'sirli') {
    ohangChal([[523.25, 0, 0.07], [622.25, 0.06, 0.07], [783.99, 0.12, 0.08], [1046.5, 0.18, 0.18]], 'triangle', 0.09)
  } else if (nom === 'tuzoq' || nom === 'muz') {
    ohangChal([[349.23, 0, 0.09], [277.18, 0.08, 0.12], [207.65, 0.16, 0.18]], 'square', 0.048)
  } else if (nom === 'tomchi') {
    ohangChal([[698.46, 0, 0.05], [932.33, 0.04, 0.09]], 'sine', 0.065)
  } else if (nom === 'reaksiya') {
    ohangChal([[440, 0, 0.08], [587.33, 0.05, 0.09], [783.99, 0.1, 0.14]], 'triangle', 0.075)
  } else if (nom === 'qadam') {
    ohangChal([[540, 0, 0.05]], 'sine', 0.04)
  } else if (nom === 'galaba') {
    ohangChal([[523.25, 0, 0.1], [659.25, 0.09, 0.1], [783.99, 0.18, 0.12], [1046.5, 0.28, 0.3]], 'triangle', 0.1)
  }
}
