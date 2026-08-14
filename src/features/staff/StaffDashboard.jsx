import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, MapPin, Star, ArrowRight } from 'lucide-react'
import { bookingsApi, staffApi, getStaffAverageRating } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import { revenueByDay, bookingsByStatus } from '../../lib/chartData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import RevenueTrendChart from '../../components/charts/RevenueTrendChart'
import StatusBarChart from '../../components/charts/StatusBarChart'

export default function StaffDashboard() {
  const { session } = useSession()
  const [bookings, setBookings] = useState(null)
  const [seedRating, setSeedRating] = useState(0)

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
      <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {session.name.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-slate-500">Here's what's on your schedule.</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card animate={false} className="text-center">
          <p className="text-xl font-semibold text-brand-700">{upcoming.length}</p>
          <p className="text-xs text-slate-500">Upcoming</p>
        </Card>
        <Card animate={false} className="text-center">
          <p className="text-xl font-semibold text-brand-700">{completed.length}</p>
          <p className="text-xs text-slate-500">Completed</p>
        </Card>
        <Card animate={false} className="flex flex-col items-center justify-center text-center">
          <p className="flex items-center gap-1 text-xl font-semibold text-gold-500">
            <Star size={16} fill="currentColor" /> {getStaffAverageRating(session.id, bookings, seedRating) || '—'}
          </p>
          <p className="text-xs text-slate-500">Rating</p>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">Your earnings — last 14 days</h3>
          <RevenueTrendChart data={revenueByDay(bookings, 14)} />
        </Card>
        <Card animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">Engagements by status</h3>
          <StatusBarChart data={bookingsByStatus(bookings)} />
        </Card>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming engagements</h2>
        <Link to="/staff/engagements" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <Card className="mt-3 text-center text-sm text-slate-500">No upcoming engagements right now.</Card>
      ) : (
        <div className="mt-3 space-y-3">
          {upcoming.map((b) => (
            <Link key={b.id} to={`/staff/engagements/${b.id}`}>
              <Card className="flex items-center justify-between transition-shadow hover:shadow-md hover:shadow-brand-900/10">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{b.serviceName}</p>
                    <Badge tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status]}</Badge>
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
