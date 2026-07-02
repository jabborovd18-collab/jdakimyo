export function SectionHeader({ label, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all mb-1 ${
        isOpen ? 'bg-purple-700/50 text-white border border-purple-500/50' : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40 border border-purple-800/30'
      }`}
    >
      <span>{label}</span>
      <span className="text-sm">{isOpen ? "▼" : "▶"}</span>
    </button>
  )
}

export function ToggleRow({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer hover:bg-purple-900/30 px-1 py-1 rounded">
      <span className="text-[11px] text-purple-200">{label}</span>
      <div
        onClick={() => onChange(!value)}
        className={`w-8 h-4 rounded-full transition-all relative cursor-pointer flex-shrink-0 ${
          value ? 'bg-purple-500' : 'bg-purple-900'
        }`}
      >
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
          value ? 'left-4' : 'left-0.5'
        }`}></div>
      </div>
    </label>
  )
}

export function InfoRow({ label, value, mono, small }) {
  return (
    <div className="bg-purple-900/50 rounded-lg p-2">
      <p className="text-purple-400 text-[10px] mb-0.5 uppercase">{label}</p>
      <p className={`text-white ${mono ? 'font-mono' : ''} ${small ? 'text-xs' : 'text-sm'}`}>{value}</p>
    </div>
  )
}

export function Stat({ label, value, mono }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-purple-400 mb-0.5 uppercase">{label}</div>
      <div className={`text-base sm:text-lg font-bold text-white ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}

export function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full shadow-md border border-white/20" style={{ backgroundColor: color }}></div>
      <span className="text-purple-300">{label}</span>
    </div>
  )
}