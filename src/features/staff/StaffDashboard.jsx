import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarClock, MapPin, Star, ArrowRight, CheckCircle2 } from 'lucide-react'
import { bookingsApi, staffApi, getStaffAverageRating } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import { revenueByDay, bookingsByStatus } from '../../lib/chartData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import RevenueTrendChart from '../../components/charts/RevenueTrendChart'
import StatusBarChart from '../../components/charts/StatusBarChart'
import DayRangeSelect from '../../components/charts/DayRangeSelect'

export default function StaffDashboard() {
  const { t } = useTranslation()
  const { session } = useSession()
  const [bookings, setBookings] = useState(null)
  const [seedRating, setSeedRating] = useState(0)
  const [revenueDays, setRevenueDays] = useState(14)

  useEffect(() => {
    async function load() {
      const all = await bookingsApi.list()
      setBookings(all.filter((b) => b.staffId === session.id))
      const profile = await staffApi.get(session.id)
      setSeedRating(profile?.rating ?? 0)
    }
    load()
  }, [session.id])

  if (bookings === null) return null

  const upcoming = bookings.filter((b) => ['confirmed', 'in-progress'].includes(b.status))
  const completed = bookings.filter((b) => b.status === 'completed')

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-slate-900">{t('staffDashboard.welcome', { name: session.name.split(' ')[0] })}</h1>
      <p className="mt-1 text-sm text-slate-500">{t('staffDashboard.subtitle')}</p>

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
        <Card animate={false} className="flex flex-col items-center justify-center text-center">
          <p className="flex items-center gap-1 text-xl font-semibold text-gold-500">
            <Star size={16} fill="currentColor" /> {getStaffAverageRating(session.id, bookings, seedRating) || '—'}
          </p>
          <p className="text-xs text-slate-500">{t('staffDashboard.rating')}</p>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" animate={false}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{t('staffDashboard.earningsChartTitle')}</h3>
            <DayRangeSelect value={revenueDays} onChange={setRevenueDays} />
          </div>
          <RevenueTrendChart data={revenueByDay(bookings, revenueDays)} />
        </Card>
        <Card animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">{t('staffDashboard.statusChartTitle')}</h3>
          <StatusBarChart data={bookingsByStatus(bookings, t)} />
        </Card>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{t('staffDashboard.upcomingEngagements')}</h2>
        <Link to="/staff/engagements" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
          {t('staffDashboard.viewAll')} <ArrowRight size={14} />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <Card className="mt-3 text-center text-sm text-slate-500">{t('staffDashboard.noUpcoming')}</Card>
      ) : (
        <div className="mt-3 space-y-3">
          {upcoming.map((b) => (
            <Link key={b.id} to={`/staff/engagements/${b.id}`}>
              <Card className="flex items-center justify-between transition-shadow hover:shadow-md hover:shadow-brand-900/10">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{b.serviceName}</p>
                    <Badge tone={STATUS_TONE[b.status]}>{t(STATUS_LABEL[b.status])}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <CalendarClock size={12} /> {b.startDate} · {b.time}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} /> {b.address}
                  </p>
                </div>
                <ArrowRight size={16} className="text-brand-400" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
