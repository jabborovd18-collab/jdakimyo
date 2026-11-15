// components/admin/AdminUI.jsx
"use client"

import Ikon from '@/components/Ikon'

/** Statik holat ranglari — dinamik Tailwind klass interpolatsiyasisiz */
const TONE_MAP = {
  neutral: 'border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-[var(--v3-xira)]',
  primary: 'border-amber-400/40 bg-amber-400/15 text-amber-200',
  info: 'border-sky-400/40 bg-sky-400/15 text-sky-200',
  success: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200',
  warning: 'border-orange-400/40 bg-orange-400/15 text-orange-200',
  danger: 'border-rose-400/40 bg-rose-400/15 text-rose-200',
  accent: 'border-indigo-400/40 bg-indigo-400/15 text-indigo-200',
}

const STAT_ICON_TONE = {
  neutral: 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] border-[var(--v3-chiziq)]',
  primary: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  info: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
  success: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  warning: 'bg-orange-400/15 text-orange-300 border-orange-400/30',
  danger: 'bg-rose-400/15 text-rose-300 border-rose-400/30',
  accent: 'bg-indigo-400/15 text-indigo-300 border-indigo-400/30',
}

export function AdminBadge({ children, tone = 'neutral', className = '' }) {
  const style = TONE_MAP[tone] || TONE_MAP.neutral
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-tight ${style} ${className}`}
    >
      {children}
    </span>
  )
}

export function AdminPageHeader({
  title,
  subtitle,
  ikon = 'sozlama',
  badge = null,
  actions = null,
}) {
  return (
    <div className="flex flex-col gap-4 pb-5 border-b border-[var(--v3-chiziq)] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)]">
            <Ikon nom={ikon} olcham={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--v3-matn)]">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

export function AdminStatCard({
  label,
  value,
  sub = null,
  ikon = 'grafik',
  tone = 'primary',
}) {
  const iconCls = STAT_ICON_TONE[tone] || STAT_ICON_TONE.primary
  return (
    <div className="v3-panel-karta p-4 flex items-center gap-3.5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconCls}`}
      >
        <Ikon nom={ikon} olcham={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--v3-matn)] truncate">
          {value}
        </div>
        <div className="text-xs font-medium text-[var(--v3-xira)] truncate">{label}</div>
        {sub && <div className="text-[11px] text-[var(--v3-xira)]/80 mt-0.5 truncate">{sub}</div>}
      </div>
    </div>
  )
}

export function AdminPanel({ children, className = '', padding = 'p-4 sm:p-5' }) {
  return <div className={`v3-panel-karta ${padding} ${className}`}>{children}</div>
}

export function AdminLoading({ text = "Ma'lumotlar yuklanmoqda..." }) {
  return (
    <div className="v3-panel-karta py-16 text-center">
      <div className="inline-flex flex-col items-center gap-3 text-[var(--v3-xira)]">
        <Ikon nom="vaqt" olcham={30} className="animate-spin text-[var(--v3-urgu)]" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  )
}

export function AdminEmpty({
  ikon = 'qidiruv',
  title = "Ma'lumot topilmadi",
  description = '',
  action = null,
}) {
  return (
    <div className="v3-panel-karta py-12 px-4 text-center space-y-3">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza-2)] text-[var(--v3-xira)]">
        <Ikon nom={ikon} olcham={22} />
      </div>
      <div className="text-base font-bold text-[var(--v3-matn)]">{title}</div>
      {description && <p className="text-xs sm:text-sm text-[var(--v3-xira)] max-w-md mx-auto">{description}</p>}
      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  )
}

export function AdminTabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] p-1.5">
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              isActive
                ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm'
                : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]'
            }`}
          >
            {tab.ikon && <Ikon nom={tab.ikon} olcham={14} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count !== null && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  isActive
                    ? 'bg-black/15 text-[var(--v3-urgu-matn)]'
                    : 'bg-[var(--v3-yuza-2)] text-[var(--v3-matn)]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function AdminModal({
  open = true,
  onClose,
  title,
  subtitle = null,
  ikon = null,
  maxWidth = 'max-w-lg',
  children,
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose()
      }}
    >
      <div
        className={`v3-panel-karta w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden border-[var(--v3-chiziq-2)]`}
        style={{ background: 'var(--v3-fon-2)' }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--v3-chiziq)] px-5 py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {ikon && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)]">
                <Ikon nom={ikon} olcham={16} />
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-[var(--v3-matn)] truncate">
                {title}
              </h2>
              {subtitle && <p className="text-xs text-[var(--v3-xira)] truncate">{subtitle}</p>}
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Yopish"
              className="v3-ikon-tugma shrink-0"
            >
              <Ikon nom="yopish" olcham={16} />
            </button>
          )}
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

export function AdminPagination({ page, totalPages, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div className="text-xs text-[var(--v3-xira)]">
        Sahifa <strong className="text-[var(--v3-matn)]">{page}</strong> / {totalPages}
        {typeof total === 'number' ? ` · jami ${total} ta` : ''}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
        >
          <Ikon nom="chap" olcham={14} />
          Oldingi
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="v3-tugma text-xs py-1.5 px-3 disabled:opacity-40"
        >
          Keyingi
          <Ikon nom="ong" olcham={14} />
        </button>
      </div>
    </div>
  )
}
