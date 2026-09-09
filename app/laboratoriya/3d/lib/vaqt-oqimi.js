// app/laboratoriya/3d/lib/vaqt-oqimi.js
//
// SAHNA VAQT OQIMI — slow-motion uchun yagona koeffitsiyent.
//
// X-Ray sho'ng'ishida (kamera-dolly + XRayMolekulaModal) sahna
// animatsiyalari (alanga tebranishi, qaynash pufakchalari) sekinlashadi
// — "Mortal Kombat X-Ray" hissi. `useSahna` animatsiya sikli har kadrda
// shu koeffitsiyentni o'qiydi.
//
// Nega modul-darajali obyekt: rAF sikli React holatidan o'qiy olmaydi
// (qayta render kerak bo'lardi), ref esa hookdan tashqariga chiqmaydi.
// Bitta yozuvchi (korinish.js) va bitta o'quvchi (useSahna) bor.

export const vaqtOqimi = { koeff: 1 };

/** Sahna vaqtini sekinlashtiradi (0 < k <= 1). */
export function vaqtniSekinlashtir(k = 0.25) {
  vaqtOqimi.koeff = Math.min(1, Math.max(0.05, k));
}

/** Vaqt oqimini me'yorga qaytaradi. */
export function vaqtniTikla() {
  vaqtOqimi.koeff = 1;
}
