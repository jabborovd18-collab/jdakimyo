// app/laboratoriya/3d/lib/xona/yordamchi.js
//
// Xona modellari uchun umumiy yordamchilar.
//
// BRIF-05: `xona-modellari.js` (1707 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.




/** Butun 3D Laboratoriya Xonasi Interyerini yig'uvchi bosh funksiya */
/**
 * Guruhdagi QATTIQ sirtlarga soya tashlashni yoqadi.
 *
 * Nega kerak: BRIF-04 gacha butun 1523 qatorli faylda `castShadow`
 * ATIGI BIR MARTA uchrardi — ya'ni soya kamerasi qamrovi to'g'rilangan
 * bilan ham xonada soya tashlaydigan narsa yo'q edi.
 *
 * Nega hammasiga emas:
 *  - shaffof sirt (shisha, deraza, suyuqlik) CHETLAB O'TILADI. Soya
 *    xaritasi faqat chuqurlikni yozadi, shaffoflikni bilmaydi — shisha
 *    o'zidan qora dog' tashlardi.
 *  - `MeshBasicMaterial` ham chetlab o'tiladi: u nur chiqaradigan sirt
 *    (ekran, LED, EXIT) uchun qolgan (AGENTS.md 11.3), soya tashlashi
 *    mantiqsiz.
 *  - devor, pol va ship bu funksiyaga BERILMAYDI: ular xonaning
 *    chegarasi, o'zidan soya tashlashi faqat artefakt va narx.
 */
export function soyaTashlasin(tugun, profil) {
  if (!profil?.soya) return tugun;
  tugun.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material;
    if (!m || Array.isArray(m)) return;
    if (m.isMeshBasicMaterial) return;
    if (m.transparent || m.opacity < 1 || m.transmission > 0) return;
    o.castShadow = true;
  });
  return tugun;
}
