// Web Audio API faqat brauzerda mavjud. Shu modul sahna kodi ulanmaganida
// ham xavfsiz import qilinadi, chunki serverda `window` yoki AudioContext yo'q.

export const LABORATORIYA_OVOZ_PARAMETRLARI = Object.freeze({
  ventilatsiya: Object.freeze({ gain: 0.035, filtrHz: 180, turi: 'lowpass' }),
  spirtovka: Object.freeze({ gain: 0.022, filtrHz: 1250, turi: 'bandpass' }),
  reaksiya: Object.freeze({ gain: 0.018, filtrHz: 2600, turi: 'highpass' }),
});

function oraliqqaChekla(qiymat, min, max, zaxira) {
  const son = Number(qiymat);
  return Number.isFinite(son) ? Math.min(max, Math.max(min, son)) : zaxira;
}

/** Client yuborgan ovoz darajalari eshitishga zarar bermaydigan oraliqda qoladi. */
export function laboratoriyaOvozSozlamasiniTayyorla(sozlama = {}) {
  const natija = {};
  for (const [nom, zaxira] of Object.entries(LABORATORIYA_OVOZ_PARAMETRLARI)) {
    const berilgan = sozlama?.[nom] || {};
    natija[nom] = {
      ...zaxira,
      gain: oraliqqaChekla(berilgan.gain, 0, 0.08, zaxira.gain),
      filtrHz: oraliqqaChekla(berilgan.filtrHz, 40, 8_000, zaxira.filtrHz),
    };
  }
  return natija;
}

export function webAudioMavjudmi() {
  return typeof globalThis !== 'undefined' && Boolean(globalThis.AudioContext || globalThis.webkitAudioContext);
}

function shovqinManbasiniYarat(kontekst, sekund = 2) {
  const buffer = kontekst.createBuffer(1, Math.ceil(kontekst.sampleRate * sekund), kontekst.sampleRate);
  const kanal = buffer.getChannelData(0);
  for (let indeks = 0; indeks < kanal.length; indeks += 1) kanal[indeks] = Math.random() * 2 - 1;
  const manba = kontekst.createBufferSource();
  manba.buffer = buffer;
  manba.loop = true;
  return manba;
}

/** Ventilyatsiya, spirtovka va reaksiya shovqinlarini bitta boshqaruvchiga yig'adi. */
export function laboratoriyaFonOvoziniYarat({ kontekst = null, sozlama = {} } = {}) {
  const AudioKontekst = globalThis?.AudioContext || globalThis?.webkitAudioContext;
  if (!kontekst && !AudioKontekst) return { mavjud: false, boshla: () => false, toxta: () => {} };

  const audio = kontekst || new AudioKontekst();
  const parametrlar = laboratoriyaOvozSozlamasiniTayyorla(sozlama);
  const master = audio.createGain();
  master.gain.value = 1;
  master.connect(audio.destination);
  const tugunlar = Object.entries(parametrlar).map(([nom, parametr]) => {
    const manba = shovqinManbasiniYarat(audio);
    const filtr = audio.createBiquadFilter();
    const gain = audio.createGain();
    filtr.type = parametr.turi;
    filtr.frequency.value = parametr.filtrHz;
    gain.gain.value = parametr.gain;
    manba.connect(filtr);
    filtr.connect(gain);
    gain.connect(master);
    return { nom, manba, filtr, gain };
  });
  let boshlandi = false;

  return {
    mavjud: true,
    parametrlar,
    boshla: async () => {
      if (boshlandi) return true;
      if (audio.state === 'suspended') await audio.resume();
      tugunlar.forEach(({ manba }) => manba.start());
      boshlandi = true;
      return true;
    },
    darajaniOzgartir: (nom, gain) => {
      const tugun = tugunlar.find((qiymat) => qiymat.nom === nom);
      if (!tugun) return false;
      tugun.gain.gain.value = oraliqqaChekla(gain, 0, 0.08, tugun.gain.gain.value);
      return true;
    },
    toxta: async () => {
      tugunlar.forEach(({ manba }) => manba.stop());
      if (audio.state !== 'closed') await audio.close();
      boshlandi = false;
    },
  };
}
