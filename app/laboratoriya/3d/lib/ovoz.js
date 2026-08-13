// Sof brauzer Web Audio API yordamida shisha, liquid flow (oqim),
// pufakchalar, cho'kma va qadam ovozlarini nolinchi kechikish (zero latency) bilan
// va tashqi audio fayllarsiz generatsiya qiluvchi dvigatel.

let audioCtx = null;

// AudioContext-ni foydalanuvchining birinchi bosishidan keyin faollashtirish
function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Shisha idish urilishi / tanlanishi ovozi (Glass Clink)
export function shishaUrilishi(chastota = 2200) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(chastota, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(chastota * 0.4, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Audio xatolarini bostiramiz
  }
}

// 2. Uzluksiz oqim va suv shildirashi ovozi (Liquid Flowing)
let oqimManba = null;
let oqimGain = null;
let oqimFilter = null;

export function oqimBoshla() {
  const ctx = getAudioContext();
  if (!ctx || oqimManba) return;

  try {
    // Pink noise buffer yaratamiz (1 soniyalik halqa)
    const bufferSize = ctx.sampleRate * 1;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.08;
      b6 = white * 0.115926;
    }

    oqimManba = ctx.createBufferSource();
    oqimManba.buffer = noiseBuffer;
    oqimManba.loop = true;

    oqimFilter = ctx.createBiquadFilter();
    oqimFilter.type = "bandpass";
    oqimFilter.frequency.setValueAtTime(800, ctx.currentTime);
    oqimFilter.Q.setValueAtTime(1.5, ctx.currentTime);

    oqimGain = ctx.createGain();
    oqimGain.gain.setValueAtTime(0.01, ctx.currentTime);
    oqimGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);

    oqimManba.connect(oqimFilter);
    oqimFilter.connect(oqimGain);
    oqimGain.connect(ctx.destination);

    oqimManba.start();
  } catch (e) {
    // Audio xatosini bostiramiz
  }
}

export function oqimToxtat() {
  if (oqimManba && oqimGain && audioCtx) {
    try {
      oqimGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      setTimeout(() => {
        if (oqimManba) {
          try { oqimManba.stop(); } catch (e) {}
          oqimManba = null;
          oqimGain = null;
          oqimFilter = null;
        }
      }, 90);
    } catch (e) {
      oqimManba = null;
      oqimGain = null;
      oqimFilter = null;
    }
  }
}

// 3. Pufakcha va gaz ajralishi ovozi (Gas Bubbling / Fizzing)
export function pufakchaChiqishi() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const soni = 4;
    for (let i = 0; i < soni; i++) {
      const kechikish = i * 0.04 + Math.random() * 0.02;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const boshChastota = 600 + Math.random() * 900;
      osc.type = "sine";
      osc.frequency.setValueAtTime(boshChastota, ctx.currentTime + kechikish);
      osc.frequency.exponentialRampToValueAtTime(boshChastota * 1.6, ctx.currentTime + kechikish + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + kechikish);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + kechikish + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + kechikish);
      osc.stop(ctx.currentTime + kechikish + 0.06);
    }
  } catch (e) {
    // Audio xatolarini bostiramiz
  }
}

// 4. Cho'kma tushishi ovozi (Precipitate Chime)
export function chokmaTushishi() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const parda = [1200, 1600, 2000];
    parda.forEach((freq, idx) => {
      const kechikish = idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + kechikish);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + kechikish);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + kechikish + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + kechikish);
      osc.stop(ctx.currentTime + kechikish + 0.16);
    });
  } catch (e) {
    // Audio xatolarini bostiramiz
  }
}

// 5. Laboratoriyada qadam tovushi (Footstep sound)
export function qadamTovushi() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}
