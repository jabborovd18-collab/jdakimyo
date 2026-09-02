"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const BOLIMLAR = [
  ["dashboard", "Umumiy holat"],
  ["routing", "Model yo'llari"],
  ["limit", "Limit va vaqt"],
  ["xotira", "Kesh va xotira"],
  ["sifat", "Sifat nazorati"],
];

const panelUslubi = {
  background: "color-mix(in srgb, var(--v3-yuza) 92%, transparent)",
  border: "1px solid var(--v3-chiziq)",
  color: "var(--v3-matn)",
};
const xiraUslub = { color: "var(--v3-xira)" };
const inputUslubi = {
  background: "var(--v3-fon)",
  border: "1px solid var(--v3-chiziq)",
  color: "var(--v3-matn)",
};
const urguTugma = {
  background: "var(--v3-urgu)",
  color: "var(--v3-urgu-matn)",
};

function Panel({ children, className = "" }) {
  return <section className={`rounded-2xl p-5 ${className}`} style={panelUslubi}>{children}</section>;
}

function Stat({ nom, qiymat, izoh }) {
  return (
    <div className="rounded-xl p-4" style={panelUslubi}>
      <div className="text-xs" style={xiraUslub}>{nom}</div>
      <div className="mt-1 text-2xl font-black">{qiymat}</div>
      {izoh && <div className="mt-1 text-[11px]" style={xiraUslub}>{izoh}</div>}
    </div>
  );
}

function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl p-3" style={panelUslubi}>
      <span className="text-sm font-semibold">{label}</span>
      <input type="checkbox" checked={Boolean(checked)} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5" />
    </label>
  );
}

function SonMaydoni({ label, value, onChange, min = 0, max, disabled }) {
  return (
    <label className="space-y-1 text-xs" style={xiraUslub}>
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg px-3 py-2 outline-none"
        style={inputUslubi}
      />
    </label>
  );
}

function holatRangi(holat) {
  if (holat === "ishlayapti" || holat === "success") return "#22c55e";
  if (holat === "kalit_yoq") return "#f59e0b";
  return "#ef4444";
}

export default function JdaKimyoAiAdminPage() {
  const [malumot, setMalumot] = useState(null);
  const [draft, setDraft] = useState(null);
  const [bolim, setBolim] = useState("dashboard");
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [amal, setAmal] = useState("");
  const [soat, setSoat] = useState(24);
  const [izoh, setIzoh] = useState("");
  const [korik, setKorik] = useState([]);

  const yukla = useCallback(async (davr = 24) => {
    setYuklanmoqda(true);
    try {
      const response = await fetch(`/api/admin/jdakimyo-ai?soat=${davr}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.xato || "Ma'lumotni olib bo'lmadi.");
      setMalumot(data);
      setDraft(structuredClone(data.faolSozlama.config));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setYuklanmoqda(false);
    }
  }, []);

  useEffect(() => { yukla(24); }, [yukla]);

  const post = async (action, body = {}) => {
    setAmal(action);
    try {
      const response = await fetch("/api/admin/jdakimyo-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.xato || "Amal bajarilmadi.");
      return data;
    } finally {
      setAmal("");
    }
  };

  const configOzgar = (yol, qiymat) => {
    setDraft((oldingi) => {
      const nusxa = structuredClone(oldingi);
      const qismlar = yol.split(".");
      let nishon = nusxa;
      for (const qism of qismlar.slice(0, -1)) nishon = nishon[qism];
      nishon[qismlar.at(-1)] = qiymat;
      return nusxa;
    });
  };

  const nashrQil = async () => {
    try {
      await post("publish", { config: draft, note: izoh, expectedRevision: malumot.faolSozlama.revision });
      toast.success("AI sozlamasi yangi versiya sifatida nashr qilindi.");
      setIzoh("");
      await yukla();
    } catch (error) { toast.error(error.message); }
  };

  const korikniBoshla = async () => {
    try {
      const data = await post("korik");
      setKorik(data.hisobot || []);
      toast.success("Barcha sozlangan provayderlar tekshirildi.");
    } catch (error) { toast.error(error.message); }
  };

  const sifatniSinash = async () => {
    try {
      const data = await post("eval");
      toast.success(`${data.natija.passed}/${data.natija.totalCases} sifat sinovi o'tdi.`);
      await yukla();
    } catch (error) { toast.error(error.message); }
  };

  const aliaslar = useMemo(() => Object.keys(malumot?.reyestr?.modellar || {}), [malumot]);
  const yozishMumkin = Boolean(malumot?.huquqlar?.sozlash);

  if (yuklanmoqda && !malumot) {
    return <div className="rounded-2xl p-8 text-center" style={panelUslubi}>AI boshqaruvi yuklanmoqda...</div>;
  }
  if (!malumot || !draft) return null;

  const dashboard = malumot.dashboard;
  const config = draft;

  return (
    <div className="space-y-5" style={{ color: "var(--v3-matn)" }}>
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center" style={{ borderColor: "var(--v3-chiziq)" }}>
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs" style={xiraUslub}>
            <span className="rounded-full px-2 py-1" style={panelUslubi}>AI Control Center</span>
            <span>Faol versiya: v{malumot.faolSozlama.revision}</span>
            <span>Manba: {malumot.faolSozlama.source}</span>
          </div>
          <h1 className="mt-2 text-2xl font-black">JDA Kimyo AI boshqaruvi</h1>
          <p className="mt-1 text-sm" style={xiraUslub}>Model yo‘llari, tezlik, limit, sifat, xotira siyosati va texnik sog‘liq bitta joyda.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/masala" target="_blank" className="rounded-xl px-4 py-2 text-sm font-bold" style={panelUslubi}>Foydalanuvchi ko‘rinishi</Link>
          {malumot.huquqlar.favqulodda && <button
            onClick={async () => {
              const yangiHolat = !malumot.faolSozlama.config.enabled;
              if (!window.confirm(yangiHolat ? "JDA Kimyo AI ni qayta yoqasizmi?" : "JDA Kimyo AI ni barcha kanallarda darhol to‘xtatasizmi?")) return;
              try { await post("favqulodda", { enabled: yangiHolat }); toast.success(yangiHolat ? "AI yoqildi." : "AI to‘xtatildi."); await yukla(); } catch (e) { toast.error(e.message); }
            }}
            disabled={Boolean(amal)}
            className="rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50"
            style={{ ...panelUslubi, color: malumot.faolSozlama.config.enabled ? "#ef4444" : "#22c55e" }}
          >{malumot.faolSozlama.config.enabled ? "Favqulodda to‘xtatish" : "AI ni qayta yoqish"}</button>}
          {malumot.huquqlar.sinash && <button onClick={korikniBoshla} disabled={Boolean(amal)} className="rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50" style={urguTugma}>{amal === "korik" ? "Tekshirilmoqda..." : "Provayderlarni tekshirish"}</button>}
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-1">
        {BOLIMLAR.map(([id, nom]) => (
          <button key={id} onClick={() => setBolim(id)} className="shrink-0 rounded-xl px-4 py-2 text-sm font-bold" style={bolim === id ? urguTugma : panelUslubi}>{nom}</button>
        ))}
      </nav>

      {bolim === "dashboard" && (
        <div className="space-y-5">
          {malumot.ogohlantirishlar?.length > 0 && <div className="space-y-2">{malumot.ogohlantirishlar.map((ogohlantirish, indeks) => <div key={`${ogohlantirish.turi}-${indeks}`} className="rounded-xl p-3 text-sm font-bold" style={{ ...panelUslubi, borderColor: "#ef4444", color: "#ef4444" }}>⚠ {ogohlantirish.xabar}</div>)}</div>}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm" style={xiraUslub}>Texnik hodisalar davri</p>
            <select value={soat} onChange={(e) => { const qiymat = Number(e.target.value); setSoat(qiymat); yukla(qiymat); }} className="rounded-lg px-3 py-2 text-sm" style={inputUslubi}>
              <option value={24}>24 soat</option><option value={168}>7 kun</option><option value={720}>30 kun</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
            <Stat nom="Jami urinish" qiymat={dashboard.jami} izoh={`Namuna: ${dashboard.namunaSoni}`} />
            <Stat nom="Muvaffaqiyat" qiymat={`${dashboard.muvaffaqiyatFoizi}%`} />
            <Stat nom="Xato" qiymat={`${dashboard.xatoFoizi}%`} />
            <Stat nom="Fallback" qiymat={`${dashboard.fallbackFoizi}%`} />
            <Stat nom="P50" qiymat={`${dashboard.p50Ms} ms`} />
            <Stat nom="P95" qiymat={`${dashboard.p95Ms} ms`} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <h2 className="font-bold">Provayderlar</h2>
              <div className="mt-3 space-y-2">
                {Object.entries(malumot.reyestr.modellar).map(([alias, model]) => {
                  const provayder = alias.replace(/(Murakkab|Zaxira|Tezkor|Asosiy|Matn|Rasm)$/, "").toLowerCase();
                  const tekshiruv = korik.find((qator) => qator.provayder === provayder);
                  return <div key={alias} className="flex items-center justify-between gap-3 rounded-lg p-3" style={panelUslubi}>
                    <div className="min-w-0"><div className="text-sm font-bold">{alias}</div><div className="truncate text-xs" style={xiraUslub}>{model}</div></div>
                    <span className="text-xs font-bold" style={{ color: tekshiruv ? holatRangi(tekshiruv.holat) : "var(--v3-xira)" }}>{tekshiruv ? `${tekshiruv.holat} · ${tekshiruv.sarfMs} ms` : "tekshirilmagan"}</span>
                  </div>;
                })}
              </div>
            </Panel>
            <Panel>
              <h2 className="font-bold">Oxirgi xatolar</h2>
              <div className="mt-3 space-y-2">
                {dashboard.oxirgiXatolar.length === 0 && <p className="text-sm" style={xiraUslub}>Tanlangan davrda xato qayd etilmagan.</p>}
                {dashboard.oxirgiXatolar.map((xato, indeks) => <div key={`${xato.createdAt}-${indeks}`} className="rounded-lg p-3 text-xs" style={panelUslubi}>
                  <div className="flex justify-between gap-3"><b style={{ color: "#ef4444" }}>{xato.errorCode || xato.status}</b><span style={xiraUslub}>{xato.durationMs} ms</span></div>
                  <div className="mt-1" style={xiraUslub}>{xato.provider || "gateway"} · {xato.model || "modelsiz"}</div>
                </div>)}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {bolim === "routing" && <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(config.channels).map(([kanal, ochiq]) => <Toggle key={kanal} label={`${kanal} kanali`} checked={ochiq} disabled={!yozishMumkin} onChange={(qiymat) => configOzgar(`channels.${kanal}`, qiymat)} />)}
        </div>
        {Object.entries(config.routing).map(([yol, nomzodlar]) => <Panel key={yol}>
          <div className="flex items-center justify-between"><h2 className="font-bold capitalize">{yol} yo‘li</h2><span className="text-xs" style={xiraUslub}>Chapdan o‘ngga fallback</span></div>
          <div className="mt-3 flex flex-wrap gap-2">
            {nomzodlar.map((alias, indeks) => <div key={`${yol}-${indeks}`} className="flex items-center gap-1">
              <select value={alias} disabled={!yozishMumkin} onChange={(e) => { const yangi = [...nomzodlar]; yangi[indeks] = e.target.value; configOzgar(`routing.${yol}`, yangi); }} className="rounded-lg px-3 py-2 text-sm" style={inputUslubi}>
                {aliaslar.map((nom) => <option key={nom} value={nom}>{nom}</option>)}
              </select>
              {nomzodlar.length > 1 && yozishMumkin && <button onClick={() => configOzgar(`routing.${yol}`, nomzodlar.filter((_, i) => i !== indeks))} className="rounded-lg px-2 py-2" style={panelUslubi}>×</button>}
            </div>)}
            {nomzodlar.length < 6 && yozishMumkin && <button onClick={() => configOzgar(`routing.${yol}`, [...nomzodlar, aliaslar.find((alias) => !nomzodlar.includes(alias)) || aliaslar[0]])} className="rounded-lg px-3 py-2 text-sm" style={panelUslubi}>+ zaxira</button>}
          </div>
        </Panel>)}
      </div>}

      {bolim === "limit" && <div className="space-y-4">
        {Object.entries(config.directions).map(([yol, qiymatlar]) => <Panel key={yol}>
          <h2 className="mb-3 font-bold capitalize">{yol} yo‘nalishi</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SonMaydoni label="Urinishlar" value={qiymatlar.urinishChegarasi} min={1} max={4} disabled={!yozishMumkin} onChange={(v) => configOzgar(`directions.${yol}.urinishChegarasi`, v)} />
            <SonMaydoni label="Bitta urinish (ms)" value={qiymatlar.urinishVaqtiMs} min={2000} disabled={!yozishMumkin} onChange={(v) => configOzgar(`directions.${yol}.urinishVaqtiMs`, v)} />
            <SonMaydoni label="Umumiy vaqt (ms)" value={qiymatlar.umumiyVaqtMs} min={4000} disabled={!yozishMumkin} onChange={(v) => configOzgar(`directions.${yol}.umumiyVaqtMs`, v)} />
            <SonMaydoni label="Token chegarasi" value={qiymatlar.tokenChegarasi} min={200} disabled={!yozishMumkin} onChange={(v) => configOzgar(`directions.${yol}.tokenChegarasi`, v)} />
          </div>
        </Panel>)}
        <Panel><h2 className="mb-3 font-bold">Kunlik foydalanuvchi limitlari</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{Object.entries(config.quotas).map(([rol, limit]) => <SonMaydoni key={rol} label={rol} value={limit} min={1} disabled={!yozishMumkin} onChange={(v) => configOzgar(`quotas.${rol}`, v)} />)}</div></Panel>
      </div>}

      {bolim === "xotira" && <div className="grid gap-4 lg:grid-cols-2">
        <Panel><h2 className="font-bold">Kesh</h2><div className="mt-3 grid grid-cols-2 gap-3"><Stat nom="Joriy hajm" qiymat={malumot.kesh.hajm} /><Stat nom="Samaradorlik" qiymat={malumot.kesh.samaradorlikFoizi} /></div><div className="mt-4 space-y-3"><Toggle label="Kesh faol" checked={config.cache.enabled} disabled={!yozishMumkin} onChange={(v) => configOzgar("cache.enabled", v)} /><SonMaydoni label="Saqlash muddati (ms)" value={config.cache.ttlMs} min={60000} disabled={!yozishMumkin} onChange={(v) => configOzgar("cache.ttlMs", v)} /><SonMaydoni label="Maksimal yozuv" value={config.cache.maxItems} min={50} disabled={!yozishMumkin} onChange={(v) => configOzgar("cache.maxItems", v)} /></div><p className="mt-3 text-xs" style={xiraUslub}>{malumot.kesh.izoh}</p>{yozishMumkin && <button onClick={async () => { if (!window.confirm("Joriy server nusxasidagi AI keshini tozalaysizmi?")) return; try { await post("cache_clear"); toast.success("Kesh tozalandi."); await yukla(); } catch (e) { toast.error(e.message); } }} className="mt-4 rounded-lg px-4 py-2 text-sm font-bold" style={panelUslubi}>Joriy keshni tozalash</button>}</Panel>
        <Panel><h2 className="font-bold">Foydalanuvchi xotirasi</h2><div className="mt-4 space-y-3 text-sm"><div className="rounded-xl p-3" style={panelUslubi}><b>Brauzer:</b> {malumot.xotira.brauzer}</div><div className="rounded-xl p-3" style={panelUslubi}><b>Akkaunt:</b> {malumot.xotira.akkaunt}</div><div className="rounded-xl p-3" style={panelUslubi}><b>Maxfiylik:</b> admin xom suhbatni ko‘rmaydi, telemetriya ham uni saqlamaydi.</div></div></Panel>
      </div>}

      {bolim === "sifat" && <div className="space-y-4">
        <Panel><h2 className="mb-3 font-bold">Sifat siyosati va ogohlantirish chegaralari</h2><div className="grid gap-3 sm:grid-cols-2"><Toggle label="Deterministik server tekshiruvi" checked={config.quality.deterministicCheck} disabled={!yozishMumkin} onChange={(v) => configOzgar("quality.deterministicCheck", v)} /><Toggle label="Formula normalizatsiyasi" checked={config.quality.formulaNormalization} disabled={!yozishMumkin} onChange={(v) => configOzgar("quality.formulaNormalization", v)} /></div><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><SonMaydoni label="Xato foizi" value={config.alerts.errorRatePercent} min={1} max={100} disabled={!yozishMumkin} onChange={(v) => configOzgar("alerts.errorRatePercent", v)} /><SonMaydoni label="Fallback foizi" value={config.alerts.fallbackRatePercent} min={1} max={100} disabled={!yozishMumkin} onChange={(v) => configOzgar("alerts.fallbackRatePercent", v)} /><SonMaydoni label="Tezkor P95 (ms)" value={config.alerts.quickP95Ms} min={1000} disabled={!yozishMumkin} onChange={(v) => configOzgar("alerts.quickP95Ms", v)} /><SonMaydoni label="Oddiy P95 (ms)" value={config.alerts.normalP95Ms} min={1000} disabled={!yozishMumkin} onChange={(v) => configOzgar("alerts.normalP95Ms", v)} /><SonMaydoni label="Chuqur P95 (ms)" value={config.alerts.deepP95Ms} min={1000} disabled={!yozishMumkin} onChange={(v) => configOzgar("alerts.deepP95Ms", v)} /></div></Panel>
        <Panel><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-bold">Deterministik kimyo va formula sinovlari</h2><p className="mt-1 text-sm" style={xiraUslub}>Molyar massa, Pearson kresti, server dalili va LaTeX qatorlari bazasiz tekshiriladi.</p></div>{malumot.huquqlar.sinash && <button onClick={sifatniSinash} disabled={Boolean(amal)} className="rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50" style={urguTugma}>{amal === "eval" ? "Sinov ketmoqda..." : "Sifat sinovini boshlash"}</button>}</div></Panel>
        <Panel><h2 className="font-bold">Sinovlar tarixi</h2><div className="mt-3 space-y-2">{malumot.oxirgiSinovlar.length === 0 && <p className="text-sm" style={xiraUslub}>Hali sinov bajarilmagan.</p>}{malumot.oxirgiSinovlar.map((sinov) => <div key={sinov.id} className="flex items-center justify-between rounded-lg p-3 text-sm" style={panelUslubi}><span>v{sinov.revision} · {new Date(sinov.createdAt).toLocaleString("uz-UZ")}</span><b style={{ color: sinov.failed ? "#ef4444" : "#22c55e" }}>{sinov.passed}/{sinov.totalCases} o‘tdi</b></div>)}</div></Panel>
      </div>}

      {yozishMumkin && <Panel className="sticky bottom-3 z-20">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><label className="flex-1 space-y-1 text-xs" style={xiraUslub}><span>Versiya izohi</span><input value={izoh} onChange={(e) => setIzoh(e.target.value)} maxLength={500} placeholder="Nima va nega o‘zgardi?" className="w-full rounded-lg px-3 py-2" style={inputUslubi} /></label><div className="flex gap-2"><button onClick={() => setDraft(structuredClone(malumot.faolSozlama.config))} className="rounded-xl px-4 py-2 text-sm font-bold" style={panelUslubi}>Bekor qilish</button><button onClick={nashrQil} disabled={Boolean(amal)} className="rounded-xl px-5 py-2 text-sm font-black disabled:opacity-50" style={urguTugma}>{amal === "publish" ? "Nashr qilinmoqda..." : `v${malumot.faolSozlama.revision + 1} ni nashr qilish`}</button></div></div>
        {malumot.versiyalar.length > 0 && <div className="mt-3 flex flex-wrap gap-2 text-xs" style={xiraUslub}><span>Rollback:</span>{malumot.versiyalar.slice(0, 5).map((v) => <button key={v.id} onClick={async () => { if (!window.confirm(`v${v.revision} sozlamasiga qaytasizmi?`)) return; try { await post("rollback", { revision: v.revision, expectedRevision: malumot.faolSozlama.revision }); toast.success("Oldingi sozlama yangi versiya sifatida tiklandi."); await yukla(); } catch (e) { toast.error(e.message); } }} className="underline">v{v.revision}</button>)}</div>}
      </Panel>}
    </div>
  );
}
