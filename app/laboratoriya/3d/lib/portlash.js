// Portlovchi reaksiyalar va xavfsizlik qoidalarini aniqlovchi modul.

export function portlashniAniqla(moddalar = {}, harorat = 25) {
  const kalitlar = Object.keys(moddalar);

  // 1. Ishqoriy metallar va suv (Na + H2O, K + H2O)
  const borNa = kalitlar.some((k) => ["Na", "K"].includes(k));
  const borSuv = kalitlar.some((k) => ["H₂O", "H₂O-oddiy"].includes(k));

  if (borNa && borSuv) {
    return {
      portladi: true,
      sabab: "Ishqoriy metal (Natriy/Kaliy) suv bilan g'oyat shiddatli va ekzotermik reaksiyaga kirishdi!",
      tenglama: "2Na + 2H₂O → 2NaOH + H₂↑ + Q",
      xavfsizlik: "Ishqoriy metallarni suv bilan tajribada faqat o'ta ingichka bo'lakda va tortmali shkaf (fume hood) ichida o'tkazish shart!",
    };
  }

  // 2. Vodorod va Kislorod portlovchi qorishmasi (2H2 + O2) yuqori haroratda
  const borH2 = kalitlar.includes("H₂");
  const borO2 = kalitlar.includes("O₂");
  if (borH2 && borO2 && harorat >= 80) {
    return {
      portladi: true,
      sabab: "Vodorod va Kislorodning portlovchi qorishmasi (Tarsillatuvchi gaz) alangadan portlab ketdi!",
      tenglama: "2H₂ + O₂ → 2H₂O + Q",
      xavfsizlik: "Vodorod gazini yig'ishda idish xavfsizligini va alanga manbalari uzoqligini ta'minlang!",
    };
  }

  return { portladi: false };
}
