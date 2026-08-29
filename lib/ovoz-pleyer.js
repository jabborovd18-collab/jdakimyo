// lib/ovoz-pleyer.js
//
// JDA KIMYO AI — YUQORI SIFATLI O'ZBEKCHA OVOZ PLEYERI (TTS)
// Web Speech API, fonetik normalizatsiya va mobil brauzerlar uchun to'liq optimallashtirilgan.

import { kimyoMatniniFonetikQil, matnniGaplargaBol } from "./kimyo-fonetika.js";

class OvozPleyeri {
  constructor() {
    this.navbat = [];
    this.faolIndeks = 0;
    this.ijroEtilmoqda = false;
    this.toxtatilgan = false;
    this.tezlik = 1.0;
    this.tinglovchilar = {
      boshlandi: null,
      tugadi: null,
      qadam: null,
      xato: null,
    };
    this._pingInterval = null;
    this._faolUtterance = null;
  }

  _engYaxshiOvozniTop() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length === 0) return null;

    // 1. O'zbek tili
    const uz = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("uz"));
    if (uz) return uz;

    // 2. Turk tili (fonetik jihatdan eng yaqin turkiy til)
    const tr = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("tr"));
    if (tr) return tr;

    // 3. Rus tili
    const ru = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("ru"));
    if (ru) return ru;

    // 4. Default tizim ovozi
    return voices.find((v) => v.default) || voices[0];
  }

  /**
   * Ovoz ijrosini boshlash
   */
  boshla(matn, { onBoshlandi, onTugadi, onQadam, onXato, tezlik = 1.0 } = {}) {
    this.toxtat();

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (typeof onXato === "function") {
        onXato("Brauzeringiz ovozli o'qishni qo'llab-quvvatlamaydi.");
      }
      return;
    }

    this.tinglovchilar = {
      boshlandi: onBoshlandi,
      tugadi: onTugadi,
      qadam: onQadam,
      xato: onXato,
    };
    this.tezlik = tezlik;

    // Fonetik tozalash (LaTeX, formulalar va belgilarni o'zbekcha so'zga aylantirish)
    const fonetikMatn = kimyoMatniniFonetikQil(matn);
    const gaplar = matnniGaplargaBol(fonetikMatn);

    if (!gaplar || gaplar.length === 0) {
      if (typeof this.tinglovchilar.tugadi === "function") this.tinglovchilar.tugadi();
      return;
    }

    this.navbat = gaplar;
    this.faolIndeks = 0;
    this.ijroEtilmoqda = true;
    this.toxtatilgan = false;

    if (typeof this.tinglovchilar.boshlandi === "function") {
      this.tinglovchilar.boshlandi();
    }

    // Chrome brauzerida 15 soniyadan keyin ovoz to'xtab qolish xatosini oldini olish uchun ping
    if (this._pingInterval) clearInterval(this._pingInterval);
    this._pingInterval = setInterval(() => {
      if (this.ijroEtilmoqda && !this.toxtatilgan && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    this._keyingiGapniOyna();
  }

  _keyingiGapniOyna() {
    if (!this.ijroEtilmoqda || this.toxtatilgan) return;

    if (this.faolIndeks >= this.navbat.length) {
      this.ijroEtilmoqda = false;
      if (this._pingInterval) clearInterval(this._pingInterval);
      if (typeof this.tinglovchilar.tugadi === "function") {
        this.tinglovchilar.tugadi();
      }
      return;
    }

    const joriyMatn = this.navbat[this.faolIndeks];
    if (typeof this.tinglovchilar.qadam === "function") {
      this.tinglovchilar.qadam(this.faolIndeks, this.navbat.length, joriyMatn);
    }

    try {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(joriyMatn);
      
      const ovoz = this._engYaxshiOvozniTop();
      if (ovoz) {
        ut.voice = ovoz;
        ut.lang = ovoz.lang;
      } else {
        ut.lang = "uz-UZ";
      }

      ut.rate = Math.max(0.7, Math.min(1.5, this.tezlik));
      ut.pitch = 1.0;

      ut.onend = () => {
        this.faolIndeks++;
        this._keyingiGapniOyna();
      };

      ut.onerror = (e) => {
        console.warn("[TTS Xatolik]:", e);
        this.faolIndeks++;
        this._keyingiGapniOyna();
      };

      this._faolUtterance = ut;
      window.speechSynthesis.speak(ut);
    } catch (err) {
      console.error("[TTS Boshlash xatosi]:", err);
      this.faolIndeks++;
      this._keyingiGapniOyna();
    }
  }

  pausa() {
    if (!this.ijroEtilmoqda) return;
    this.toxtatilgan = true;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  }

  davomEttir() {
    if (!this.ijroEtilmoqda || !this.toxtatilgan) return;
    this.toxtatilgan = false;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
  }

  toxtat() {
    this.ijroEtilmoqda = false;
    this.toxtatilgan = false;
    this.navbat = [];
    this.faolIndeks = 0;
    this._faolUtterance = null;

    if (this._pingInterval) {
      clearInterval(this._pingInterval);
      this._pingInterval = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  tezlikniOrnat(rate) {
    this.tezlik = rate;
  }
}

// Yagona singleton instansiya
export const ovozPleyeri = new OvozPleyeri();
