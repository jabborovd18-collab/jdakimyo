// lib/ovoz-pleyer.js
//
// 100% Bepul, yuqori sifatli O'zbekcha TTS Audio Pleyeri.
// Google Translate TTS (tl=uz) audio oqimi va Web Speech API zaxira mexanizmi bilan.

import { matnniGaplargaBol, kimyoMatniniFonetikQil } from "./kimyo-fonetika.js";

class OvozPleyeri {
  constructor() {
    this.audio = null;
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
  }

  /**
   * Yangi matnni ijro etishni boshlash.
   */
  boshla(matn, { onBoshlandi, onTugadi, onQadam, onXato, tezlik = 1.0 } = {}) {
    this.toxtat();

    this.tinglovchilar = {
      boshlandi: onBoshlandi,
      tugadi: onTugadi,
      qadam: onQadam,
      xato: onXato,
    };
    this.tezlik = tezlik;

    const gaplar = matnniGaplargaBol(matn);
    if (!gaplar || gaplar.length === 0) return;

    this.navbat = gaplar;
    this.faolIndeks = 0;
    this.ijroEtilmoqda = true;
    this.toxtatilgan = false;

    if (typeof this.tinglovchilar.boshlandi === "function") {
      this.tinglovchilar.boshlandi();
    }

    this._keyingiGapniOyna();
  }

  _keyingiGapniOyna() {
    if (!this.ijroEtilmoqda || this.toxtatilgan) return;

    if (this.faolIndeks >= this.navbat.length) {
      this.ijroEtilmoqda = false;
      if (typeof this.tinglovchilar.tugadi === "function") {
        this.tinglovchilar.tugadi();
      }
      return;
    }

    const joriyMatn = this.navbat[this.faolIndeks];
    if (typeof this.tinglovchilar.qadam === "function") {
      this.tinglovchilar.qadam(this.faolIndeks, this.navbat.length, joriyMatn);
    }

    // Google Translate TTS URL
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      joriyMatn
    )}&tl=uz&client=tw-ob`;

    this.audio = new Audio(url);
    this.audio.playbackRate = this.tezlik;

    this.audio.onended = () => {
      this.faolIndeks++;
      this._keyingiGapniOyna();
    };

    this.audio.onerror = () => {
      // Agar Google TTS yuklanmasa (oflayn bo'lsa), zaxira Web Speech API ga o'tamiz
      this._zaxiraSpeechSynthesis(joriyMatn);
    };

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        this._zaxiraSpeechSynthesis(joriyMatn);
      });
    }
  }

  _zaxiraSpeechSynthesis(matn) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.faolIndeks++;
      this._keyingiGapniOyna();
      return;
    }

    const ut = new SpeechSynthesisUtterance(matn);
    ut.lang = "uz-UZ";
    ut.rate = this.tezlik;

    ut.onend = () => {
      this.faolIndeks++;
      this._keyingiGapniOyna();
    };

    ut.onerror = () => {
      this.faolIndeks++;
      this._keyingiGapniOyna();
    };

    window.speechSynthesis.speak(ut);
  }

  pausa() {
    if (!this.ijroEtilmoqda) return;
    this.toxtatilgan = true;
    if (this.audio) {
      this.audio.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  }

  davomEttir() {
    if (!this.ijroEtilmoqda || !this.toxtatilgan) return;
    this.toxtatilgan = false;
    if (this.audio && this.audio.paused) {
      this.audio.play().catch(() => {});
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.resume();
      }
    }
  }

  toxtat() {
    this.ijroEtilmoqda = false;
    this.toxtatilgan = false;
    this.navbat = [];
    this.faolIndeks = 0;

    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  tezlikniOrnat(rate) {
    this.tezlik = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }
}

// Yagona singleton instansiya
export const ovozPleyeri = new OvozPleyeri();
