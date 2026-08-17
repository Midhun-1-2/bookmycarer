import { useState } from 'react'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'

export function StarRatingDisplay({ value, size = 14, className }) {
  return (
    <span className={cn('flex items-center gap-1 text-gold-500', className)}>
      <Star size={size} fill="currentColor" />
      <span className="font-medium">{value ? value.toFixed(1) : '—'}</span>
    </span>
  )
}

export default function StarRating({ value, onChange, size = 24 }) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer text-gold-500"
          aria-label={t('starRating.rateStars', { count: n })}
        >
          <Star size={size} fill={(hovered || value) >= n ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  )
}
