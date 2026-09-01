const BAZA_NOMI = "jda-kimyo-ai-xotira";
const BAZA_VERSIYASI = 1;
const CHATLAR = "chatlar";
const SOZLAMALAR = "sozlamalar";
const PROFIL = "oquv-profili";

function sorovniKut(sorov) {
  return new Promise((resolve, reject) => {
    sorov.onsuccess = () => resolve(sorov.result);
    sorov.onerror = () => reject(sorov.error);
  });
}

function tranzaksiyaniKut(tranzaksiya) {
  return new Promise((resolve, reject) => {
    tranzaksiya.oncomplete = () => resolve();
    tranzaksiya.onerror = () => reject(tranzaksiya.error);
    tranzaksiya.onabort = () => reject(tranzaksiya.error);
  });
}

function bazaniOch() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("Bu brauzer IndexedDB xotirasini qo'llab-quvvatlamaydi"));
  }

  return new Promise((resolve, reject) => {
    const sorov = indexedDB.open(BAZA_NOMI, BAZA_VERSIYASI);
    sorov.onupgradeneeded = () => {
      const baza = sorov.result;
      if (!baza.objectStoreNames.contains(CHATLAR)) {
        const chatlar = baza.createObjectStore(CHATLAR, { keyPath: "id" });
        chatlar.createIndex("yangilanganAt", "yangilanganAt");
      }
      if (!baza.objectStoreNames.contains(SOZLAMALAR)) {
        baza.createObjectStore(SOZLAMALAR, { keyPath: "kalit" });
      }
      if (!baza.objectStoreNames.contains(PROFIL)) {
        baza.createObjectStore(PROFIL, { keyPath: "id" });
      }
    };
    sorov.onsuccess = () => resolve(sorov.result);
    sorov.onerror = () => reject(sorov.error);
  });
}

function tozaSarlavha(xabarlar) {
  const birinchi = xabarlar.find((xabar) => xabar.rol === "user");
  const matn = birinchi?.matn?.replace(/\s+/g, " ").trim();
  if (matn) return matn.length > 54 ? `${matn.slice(0, 51)}...` : matn;
  if (birinchi?.rasm) return "Rasmli kimyo masalasi";
  return "Yangi suhbat";
}

function masofagaMosXabar(xabar) {
  // Base64 rasm bir nechta megabayt bo'lishi mumkin. U brauzerda qoladi,
  // akkaunt nusxasiga esa faqat nomi tushadi — matnli tarix tez va arzon qoladi.
  if (!xabar?.rasm) return xabar;
  const { rasm, ...qolgan } = xabar;
  return { ...qolgan, rasmSaqlandi: false };
}

export function yangiAiChatId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function brauzerXotirasiniBarqarorQil() {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function aiChatniSaqlash({ id, xabarlar, yaratilganAt, yangilanganAt }) {
  if (!id) return;
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction(CHATLAR, "readwrite");
  const store = tranzaksiya.objectStore(CHATLAR);
  const eski = await sorovniKut(store.get(id));
  const hozir = yangilanganAt || new Date().toISOString();
  store.put({
    id,
    sarlavha: tozaSarlavha(xabarlar),
    xabarlar,
    yaratilganAt: yaratilganAt || eski?.yaratilganAt || hozir,
    yangilanganAt: hozir,
  });
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
}

export async function aiChatniOl(id) {
  if (!id) return null;
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction(CHATLAR, "readonly");
  const chat = await sorovniKut(tranzaksiya.objectStore(CHATLAR).get(id));
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
  return chat || null;
}

export async function aiChatlarRoyxatiniOl() {
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction(CHATLAR, "readonly");
  const chatlar = await sorovniKut(tranzaksiya.objectStore(CHATLAR).getAll());
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
  return chatlar
    .sort((a, b) => String(b.yangilanganAt).localeCompare(String(a.yangilanganAt)))
    .map(({ xabarlar, ...chat }) => ({ ...chat, xabarSoni: xabarlar?.length || 0 }));
}

export async function aiChatniOchirish(id) {
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction(CHATLAR, "readwrite");
  tranzaksiya.objectStore(CHATLAR).delete(id);
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
}

export async function aiSozlamaniOl(kalit, standart = null) {
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction(SOZLAMALAR, "readonly");
  const yozuv = await sorovniKut(tranzaksiya.objectStore(SOZLAMALAR).get(kalit));
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
  return yozuv?.qiymat ?? standart;
}

export async function aiSozlamaniSaqlash(kalit, qiymat) {
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction(SOZLAMALAR, "readwrite");
  tranzaksiya.objectStore(SOZLAMALAR).put({ kalit, qiymat });
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
}

export async function oquvProfiliniYangila(masalaTuri) {
  if (!masalaTuri) return;
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction(PROFIL, "readwrite");
  const store = tranzaksiya.objectStore(PROFIL);
  const eski = await sorovniKut(store.get("asosiy"));
  const mavzular = { ...(eski?.mavzular || {}) };
  mavzular[masalaTuri] = (mavzular[masalaTuri] || 0) + 1;
  store.put({
    id: "asosiy",
    mavzular,
    oxirgiFaollik: new Date().toISOString(),
  });
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
}

export async function oquvProfiliniOl() {
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction(PROFIL, "readonly");
  const profil = await sorovniKut(tranzaksiya.objectStore(PROFIL).get("asosiy"));
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
  return profil || null;
}

export async function aiXotiraNusxasiniOl() {
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction([CHATLAR, PROFIL], "readonly");
  const [chatlar, profil] = await Promise.all([
    sorovniKut(tranzaksiya.objectStore(CHATLAR).getAll()),
    sorovniKut(tranzaksiya.objectStore(PROFIL).get("asosiy")),
  ]);
  await tranzaksiyaniKut(tranzaksiya);
  baza.close();

  return {
    versiya: 1,
    yangilanganAt: new Date().toISOString(),
    chatlar: chatlar
      .sort((a, b) => String(b.yangilanganAt).localeCompare(String(a.yangilanganAt)))
      .slice(0, 100)
      .map((chat) => ({
        ...chat,
        xabarlar: (chat.xabarlar || []).slice(-300).map(masofagaMosXabar),
      })),
    profil: profil || null,
  };
}

export async function aiXotiraNusxasiniQosh(nusxa) {
  if (nusxa?.versiya !== 1 || !Array.isArray(nusxa.chatlar)) return;
  const baza = await bazaniOch();
  const tranzaksiya = baza.transaction([CHATLAR, PROFIL], "readwrite");
  const chatStore = tranzaksiya.objectStore(CHATLAR);

  for (const masofadagi of nusxa.chatlar) {
    const mahalliy = await sorovniKut(chatStore.get(masofadagi.id));
    if (!mahalliy || String(masofadagi.yangilanganAt) > String(mahalliy.yangilanganAt)) {
      chatStore.put(masofadagi);
    }
  }

  if (nusxa.profil) {
    const profilStore = tranzaksiya.objectStore(PROFIL);
    const mahalliyProfil = await sorovniKut(profilStore.get("asosiy"));
    const mavzular = { ...(nusxa.profil.mavzular || {}) };
    for (const [mavzu, soni] of Object.entries(mahalliyProfil?.mavzular || {})) {
      mavzular[mavzu] = Math.max(Number(mavzular[mavzu]) || 0, Number(soni) || 0);
    }
    profilStore.put({
      id: "asosiy",
      mavzular,
      oxirgiFaollik: [nusxa.profil.oxirgiFaollik, mahalliyProfil?.oxirgiFaollik]
        .filter(Boolean)
        .sort()
        .at(-1) || new Date().toISOString(),
    });
  }

  await tranzaksiyaniKut(tranzaksiya);
  baza.close();
}
