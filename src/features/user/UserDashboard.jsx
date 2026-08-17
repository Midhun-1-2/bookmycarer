import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarClock, ArrowRight, CheckCircle2, IndianRupee } from 'lucide-react'
import { categoriesApi, bookingsApi } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import CategoryCard from '../../components/CategoryCard'

export default function UserDashboard() {
  const { t } = useTranslation()
  const { session } = useSession()
  const categories = categoriesApi.listSync()
  const [bookings, setBookings] = useState(null)

  useEffect(() => {
    async function load() {
      const all = await bookingsApi.list()
      setBookings(all.filter((b) => b.userId === session.id))
    }
    load()
  }, [session.id])

  if (bookings === null) return null

  const upcoming = bookings.filter((b) => ['pending', 'confirmed', 'in-progress'].includes(b.status))
  const completed = bookings.filter((b) => b.status === 'completed')
  const totalSpent = bookings
    .filter((b) => b.payment.status === 'paid')
    .reduce((sum, b) => sum + b.payment.amount, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        {t('userDashboard.welcome', { name: session?.name?.split(' ')[0] ?? t('userDashboard.there') })}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{t('userDashboard.subtitle')}</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card animate={false} className="text-center">
          <p className="flex items-center justify-center gap-1 text-xl font-semibold text-brand-700">
            <CalendarClock size={16} /> {upcoming.length}
          </p>
          <p className="text-xs text-slate-500">{t('staffDashboard.upcoming')}</p>
        </Card>
        <Card animate={false} className="text-center">
          <p className="flex items-center justify-center gap-1 text-xl font-semibold text-brand-700">
            <CheckCircle2 size={16} /> {completed.length}
          </p>
          <p className="text-xs text-slate-500">{t('staffDashboard.completed')}</p>
        </Card>
        <Card animate={false} className="text-center">
          <p className="flex items-center justify-center gap-1 text-xl font-semibold text-brand-700">
            <IndianRupee size={16} /> {totalSpent}
          </p>
          <p className="text-xs text-slate-500">{t('userProfile.totalSpentLabel')}</p>
        </Card>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{t('userMyBookings.title')}</h2>
        <Link to="/user/bookings" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
          {t('staffDashboard.viewAll')} <ArrowRight size={14} />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <Card className="mt-3 text-center text-sm text-slate-500">{t('userMyBookings.emptyState')}</Card>
      ) : (
        <div className="mt-3 space-y-3">
          {upcoming.slice(0, 3).map((b) => (
            <Link key={b.id} to={`/user/bookings/${b.id}`}>
              <Card className="flex items-center justify-between transition-shadow hover:shadow-md hover:shadow-brand-900/10">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{b.serviceName}</p>
                    <Badge tone={STATUS_TONE[b.status]}>{t(STATUS_LABEL[b.status])}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <CalendarClock size={12} /> {b.startDate} · {b.time}
                  </p>
                </div>
                <ArrowRight size={16} className="text-brand-400" />
              </Card>
            </Link>
          ))}
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold text-slate-900">{t('userShell.browseServices')}</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}
