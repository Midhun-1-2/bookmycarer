import { useTranslation } from 'react-i18next'
import { Gift } from 'lucide-react'
import Card from './ui/Card'
import { totalPoints } from '../lib/rewardPoints'

/**
 * Reward points balance + recent accrual. `history` comes from
 * getSeekerPointsHistory / getCaregiverPointsHistory in lib/rewardPoints.
 */
export default function RewardPointsCard({ history, variant = 'seeker', className = '' }) {
  const { t } = useTranslation()
  const total = totalPoints(history)
  const recent = history.slice(0, 3)

  return (
    <Card className={className} animate={false}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Gift size={16} className="text-brand-600" />
            {t('rewards.title')}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {variant === 'caregiver' ? t('rewards.subtitleCaregiver') : t('rewards.subtitleSeeker')}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-semibold text-brand-700">{total.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400">{t('rewards.pointsLabel')}</p>
        </div>
      </div>

      {recent.length > 0 && (
        <ul className="mt-4 divide-y divide-brand-50 border-t border-brand-50">
          {recent.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="min-w-0 truncate text-slate-600">{e.serviceName}</span>
              <span className="shrink-0 font-medium text-slate-800">
                {t('rewards.pointsEarned', { points: e.points })}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[11px] text-slate-400">{t('rewards.futureNote')}</p>
    </Card>
  )
}
