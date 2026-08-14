import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STATUS_COLORS = {
  pending: '#ffc046',
  confirmed: '#2fb0b5',
  'in-progress': '#33408f',
  completed: '#48bd69',
  cancelled: '#ec2828',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-brand-100 bg-white px-3 py-2 text-xs shadow-lg shadow-brand-900/10">
      <p className="font-medium text-slate-700">{label}</p>
      <p className="text-brand-700">{payload[0].value} bookings</p>
    </div>
  )
}

export default function StatusBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0fa" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#dde1f5' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eef0fa' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#3699f5'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
