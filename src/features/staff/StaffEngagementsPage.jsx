import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarClock, MapPin, ArrowRight } from 'lucide-react'
import { bookingsApi } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

export default function StaffEngagementsPage() {
  const { t } = useTranslation()
  const { session } = useSession()
  const [bookings, setBookings] = useState(null)

  useEffect(() => {
    async function load() {
      const all = await bookingsApi.list()
      setBookings(
        all
          .filter((b) => b.staffId === session.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .reverse()
      )
    }
    load()
  }, [session.id])

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-slate-900">{t('staffEngagements.title')}</h1>
      <p className="mt-1 text-sm text-slate-500">{t('staffEngagements.subtitle')}</p>

      {bookings === null ? (
        <p className="mt-6 text-sm text-slate-400">{t('staffEngagements.loading')}</p>
      ) : bookings.length === 0 ? (
        <Card className="mt-6 text-center text-sm text-slate-500">{t('staffEngagements.empty')}</Card>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((b) => (
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
