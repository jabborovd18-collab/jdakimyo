// AI Assistent uchun poydevor va kelajakdagi Prompt/Context tayyorlovchi modul.
// Hozircha UI ga ulangan emas, lekin kelajakda Gemini API yoki LLM integratsiyasi
// uchun tayyor arxitektura bo'lib xizmat qiladi.

export function aiKontekstTayyorla(holat, jurnal, reaksiyaNatijasi) {
  const moddalar = holat?.moddalar || {};
  // Holat moddani `{ ml, mol }` bo'lib saqlaydi (lib/idish-holati.js).
  // Konsentratsiya alohida saqlanmaydi — u moldan va hajmdan chiqadi.
  const sarflanganReagentlar = Object.entries(moddalar).map(([kalit, m]) => {
    const ml = m?.ml || 0;
    const mol = m?.mol || 0;
    const M = ml > 0 ? mol / (ml / 1000) : 0;
    return `${kalit}: ${ml.toFixed(1)} ml (${M.toFixed(2)} M)`;
  });

  return {
    tizimPrompt:
      "Siz jdakimyo.uz virtual 3D laboratoriyasining professional va do'stona kimyo o'qituvchisisiz. Talabaga o'tkazgan tajribasi va stexiometrik xatolarini sodda va ilmiy tushuntirib bering.",
    kontekst: {
      idishdagiModdalar: sarflanganReagentlar,
      jurnalTarixi: (jurnal || []).slice(-5),
      reaksiya: reaksiyaNatijasi
        ? {
            tenglama: reaksiyaNatijasi.reaksiya?.equation,
            observations: reaksiyaNatijasi.reaksiya?.observations,
            nisbatBahosi: reaksiyaNatijasi.nisbat,
          }
        : null,
    },
  };
}

export async function aiTahlilOlish(kontekstData) {
  // Hozircha poydevor sifatida simulyatsiya qilingan javob qaytaradi
  return {
    mavjud: false,
    xabar: "AI Assistent moduli kelajakda faollashtirish uchun poydevor holatida tayyorlandi.",
  };
}
