import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'

function CustomTooltip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-brand-100 bg-white px-3 py-2 text-xs shadow-lg shadow-brand-900/10">
      <p className="font-medium text-slate-700">{label}</p>
      <p className="text-brand-700">{t('charts.engagementsCount', { count: payload[0].value })}</p>
    </div>
  )
}

export default function StaffBarChart({ data }) {
  const { t } = useTranslation()
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0fa" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12, fill: '#475569' }}
          axisLine={false}
          tickLine={false}
          width={70}
        />
        <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: '#eef0fa' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#33408f" maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  )
}
