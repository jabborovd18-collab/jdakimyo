// Rasm borligi kimyo turini oldindan bilmasligimizni anglatadi, ammo OCRdan
// keyin hisob chiqishi mumkin. Shu sabab rasmli vazifada barcha deterministik
// vositalar ochiq qoladi, majburiylik esa faqat ishonchli matn belgilariga tayanadi.

export function aiVazifaSiyosatiniTuz({ rasm = null, matndanAniqlanganTur = "suhbat", yonalishId = "oddiy", matn = "" } = {}) {
  const masalaTuri = rasm && matndanAniqlanganTur === "suhbat"
    ? "umumiy"
    : matndanAniqlanganTur;
  const tenglamaVositaKerak = /\b(?:tengla|tenglashtir|koeffitsiyent|redoks)\w*/i.test(String(matn || ""));
  const vositalarFaol = Boolean(rasm)
    || yonalishId === "murakkab"
    || ["olimpiada", "organik", "eritmalar"].includes(masalaTuri)
    || tenglamaVositaKerak;
  const vositaMajburiy = yonalishId === "murakkab"
    || masalaTuri === "olimpiada"
    || tenglamaVositaKerak;
  return { masalaTuri, vositalarFaol, vositaMajburiy, tenglamaVositaKerak };
}
