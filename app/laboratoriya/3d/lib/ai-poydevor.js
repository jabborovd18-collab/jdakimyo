// AI Assistent uchun poydevor va kelajakdagi Prompt/Context tayyorlovchi modul.
// Hozircha UI ga ulangan emas, lekin kelajakda Gemini API yoki LLM integratsiyasi
// uchun tayyor arxitektura bo'lib xizmat qiladi.

export function aiKontekstTayyorla(holat, jurnal, reaksiyaNatijasi) {
  const moddalar = holat?.moddalar || {};
  const sarflanganReagentlar = Object.entries(moddalar).map(
    ([kalit, m]) => `${kalit}: ${m.hajm} ml (${m.konsentratsiya} M)`
  );

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
