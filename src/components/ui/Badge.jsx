import { cn } from '../../lib/cn'

const tones = {
  brand: 'bg-brand-100 text-brand-700',
  accent: 'bg-accent-100 text-accent-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  neutral: 'bg-slate-100 text-slate-600',
}

export default function Badge({ tone = 'brand', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
