import { useTranslation } from 'react-i18next'

const OPTIONS = [7, 14, 30, 90]

export default function DayRangeSelect({ value, onChange }) {
  const { t } = useTranslation()
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 shrink-0 rounded-lg border border-brand-200 bg-white px-2 text-xs font-medium text-slate-600 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
    >
      {OPTIONS.map((d) => (
        <option key={d} value={d}>
          {t('charts.lastNDays', { days: d })}
        </option>
      ))}
    </select>
  )
}
