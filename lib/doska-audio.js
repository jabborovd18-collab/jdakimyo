// lib/doska-audio.js
//
// Smart Doska uchun brauzer Web Audio API generatori.
// Tashqi audio fayllar yuklanmaydi (0 bayt trafik, 100% oflayn ishlaydi).
// Darsda bolalarni chalg'itmaydigan shinam, yoqimli va professional ohanglar.

class DoskaAudioTizimi {
  constructor() {
    this.ctx = null;
    this.yoqilgan = true;
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  holatniAlmashtir() {
    this.yoqilgan = !this.yoqilgan;
    return this.yoqilgan;
  }

  // 1) Musobaqa boshlanish ohangi (3 ta ko'tariluvchi nozik nota)
  chalStart() {
    if (!this.yoqilgan) return;
    this.init();
    if (!this.ctx) return;

    const notalar = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notalar.forEach((chastota, i) => {
      const t = this.ctx.currentTime + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(chastota, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // 2) To'g'ri javob yoki ball qo'shilish ohangi (mayin jiringlash)
  chalBall() {
    if (!this.yoqilgan) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, t); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.1); // E6

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 3) G'oliblik va taqdirlash tantanasi (Fanfare)
  chalGolib() {
    if (!this.yoqilgan) return;
    this.init();
    if (!this.ctx) return;

    const akkord = [
      { f: 523.25, t: 0.0 }, // C5
      { f: 659.25, t: 0.15 }, // E5
      { f: 783.99, t: 0.3 }, // G5
      { f: 1046.5, t: 0.45 }, // C6
      { f: 1318.51, t: 0.6 }, // E6
      { f: 1567.98, t: 0.75 }, // G6
    ];

    akkord.forEach(({ f, t: kechikish }) => {
      const t = this.ctx.currentTime + kechikish;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.2, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.55);
    });
  }

  // 4) Taymer tugashi yaqinlashganda ogohlantiruvchi qisqa chertish
  chalChertish() {
    if (!this.yoqilgan) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, t);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }
}

export const doskaAudio = new DoskaAudioTizimi();
