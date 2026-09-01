function elektronlarniJoyla(elektronSoni, orbitalSoni) {
  const orbitallar = Array.from({ length: orbitalSoni }, () => [])

  // Hund qoidasi sabab juftlashdan oldin har orbitalga bittadan elektron
  // joylanadi; aks holda yuqori-spin holatdagi magnit natija noto'g'ri chiqadi.
  for (let index = 0; index < Math.min(elektronSoni, orbitalSoni); index += 1) {
    orbitallar[index].push('↑')
  }

  const qolgan = Math.max(0, elektronSoni - orbitalSoni)
  for (let index = 0; index < Math.min(qolgan, orbitalSoni); index += 1) {
    orbitallar[index].push('↓')
  }

  return orbitallar
}

function OrbitalQatori({ nom, elektronSoni, orbitalSoni }) {
  const orbitallar = elektronlarniJoyla(elektronSoni, orbitalSoni)

  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-right text-xs font-mono" style={{ color: 'var(--v3-xira)' }}>
        {nom}
      </span>
      <div className="flex gap-1" aria-label={`${nom} orbitalida ${elektronSoni} ta elektron`}>
        {orbitallar.map((elektronlar, index) => (
          <span
            key={`${nom}-${index}`}
            className="flex h-8 w-10 items-center justify-center rounded-sm border font-mono text-sm"
            style={{
              background: 'var(--v3-yuza)',
              borderColor: 'var(--v3-chiziq)',
              color: 'var(--v3-urgu)',
            }}
          >
            {elektronlar.join('')}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function DOrbitalDiagram({ t2g, eg, unpaired }) {
  return (
    <div
      className="space-y-2 rounded-lg border p-2"
      style={{ background: 'var(--v3-fon)', borderColor: 'var(--v3-chiziq)' }}
      aria-label={`d-orbital diagrammasi, ${unpaired} ta juftlashmagan elektron`}
    >
      <OrbitalQatori nom="e_g" elektronSoni={eg} orbitalSoni={2} />
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="w-8" />
        <span className="h-px flex-1" style={{ background: 'var(--v3-chiziq)' }} />
        <span className="text-[10px] font-mono" style={{ color: 'var(--v3-xira)' }}>Δ_o</span>
      </div>
      <OrbitalQatori nom="t₂g" elektronSoni={t2g} orbitalSoni={3} />
    </div>
  )
}
