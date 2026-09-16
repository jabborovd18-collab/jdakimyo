// Bitta foydalanuvchi so'rovi bir nechta provider urinishini tug'diradi.
// Sog'liq foizini urinishlardan hisoblash fallbackni xato sifatida ikki marta
// sanaydi, shu sabab bu qatlam urinishlarni requestId bo'yicha yig'adi.

export function percentil(sonlar, foiz) {
  if (sonlar.length === 0) return 0;
  const tartiblangan = [...sonlar].sort((a, b) => a - b);
  return tartiblangan[Math.min(tartiblangan.length - 1, Math.ceil(tartiblangan.length * foiz) - 1)];
}

export function guruhla(yozuvlar, maydon) {
  const natija = {};
  for (const yozuv of yozuvlar) {
    const kalit = yozuv[maydon] || "noma'lum";
    natija[kalit] = (natija[kalit] || 0) + 1;
  }
  return Object.entries(natija)
    .map(([nom, soni]) => ({ nom, soni }))
    .sort((a, b) => b.soni - a.soni);
}

export function aiSorovlariniYig(urinishlar = []) {
  const guruhlar = new Map();
  for (const urinish of urinishlar) {
    const kalit = urinish.requestId || `eski-${guruhlar.size}`;
    const guruh = guruhlar.get(kalit) || [];
    guruh.push(urinish);
    guruhlar.set(kalit, guruh);
  }

  return [...guruhlar.entries()].map(([requestId, guruh]) => {
    const muvaffaqiyat = guruh.find((urinish) => urinish.status === "success");
    const birinchi = guruh[0] || {};
    const vaqtlar = guruh.map((urinish) => Number(urinish.durationMs) || 0);
    const vaqtlarYigindisi = vaqtlar.reduce((yigindi, son) => yigindi + son, 0);
    return {
      requestId,
      status: muvaffaqiyat ? "success" : "error",
      durationMs: vaqtlarYigindisi,
      fallbackUsed: guruh.length > 1 || guruh.some((urinish) => Number(urinish.fallbackIndex) > 0),
      cacheHit: guruh.some((urinish) => urinish.cacheHit),
      deterministicUsed: guruh.some((urinish) => urinish.deterministicUsed),
      channel: birinchi.channel,
      direction: birinchi.direction,
      createdAt: guruh.reduce((engEski, urinish) => {
        if (!engEski) return urinish.createdAt;
        return new Date(urinish.createdAt) < new Date(engEski) ? urinish.createdAt : engEski;
      }, null),
      urinishlarSoni: guruh.length,
    };
  });
}

export function yonalishMetrikalariniTuz(sorovlar) {
  const guruhlar = new Map();
  for (const sorov of sorovlar) {
    const nom = sorov.direction || "noma'lum";
    const guruh = guruhlar.get(nom) || { nom, jami: 0, xato: 0, vaqtlar: [] };
    guruh.jami += 1;
    if (sorov.status === "success") {
      if (sorov.durationMs > 0) guruh.vaqtlar.push(sorov.durationMs);
    } else {
      guruh.xato += 1;
    }
    guruhlar.set(nom, guruh);
  }
  return [...guruhlar.values()].map((guruh) => ({
    nom: guruh.nom,
    jami: guruh.jami,
    xatoFoizi: guruh.jami ? Number(((guruh.xato / guruh.jami) * 100).toFixed(1)) : 0,
    p95Ms: percentil(guruh.vaqtlar, 0.95),
  }));
}
