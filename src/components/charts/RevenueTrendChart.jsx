import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'

function CustomTooltip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-brand-100 bg-white px-3 py-2 text-xs shadow-lg shadow-brand-900/10">
      <p className="mb-1 font-medium text-slate-700">{label}</p>
      <p className="text-brand-700">{t('charts.revenueLabel', { value: payload[0].value })}</p>
    </div>
  )
}

export default function RevenueTrendChart({ data }) {
  const { t } = useTranslation()
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2fb0b5" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#2fb0b5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0fa" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={{ stroke: '#dde1f5' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<CustomTooltip t={t} />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#229397"
          strokeWidth={2.5}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
