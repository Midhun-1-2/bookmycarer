import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarClock, MapPin, Phone, ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'
import { bookingsApi, verifyCheckIn, verifyCheckOut } from '../../lib/mockApi'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function StaffEngagementDetailPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)

  async function load() {
    setBooking(await bookingsApi.get(bookingId))
  }

  useEffect(() => {
    load()
  }, [bookingId])

  async function handleVerify() {
    setError('')
    setVerifying(true)
    const action = booking.status === 'confirmed' ? verifyCheckIn : verifyCheckOut
    const result = await action(bookingId, code)
    setVerifying(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setCode('')
    await load()
  }

  if (!booking) return null

  const canVerify = booking.status === 'confirmed' || booking.status === 'in-progress'

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/staff/engagements" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
        <ArrowLeft size={14} /> Engagements
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">{booking.serviceName}</h1>
        <Badge tone={STATUS_TONE[booking.status]}>{STATUS_LABEL[booking.status]}</Badge>
      </div>

      <Card className="mt-5 space-y-4" animate={false}>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CalendarClock size={16} className="text-brand-600" />
          {booking.startDate} at {booking.time} · <span className="capitalize">{booking.scheduleType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <MapPin size={16} className="text-brand-600" />
          {booking.address}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Phone size={16} className="text-brand-600" />
          {booking.contactName} · {booking.contactPhone}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <ShieldAlert size={16} className="text-brand-600" />
          Emergency contact: {booking.emergencyContact}
        </div>
        {booking.careTags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {booking.careTags.map((t) => (
              <Badge key={t} tone="neutral">{t}</Badge>
            ))}
          </div>
        )}
      </Card>

      {canVerify && (
        <Card className="mt-4" animate={false}>
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <KeyRound size={16} className="text-brand-600" />
            {booking.status === 'confirmed' ? 'Check in to this shift' : 'Check out of this shift'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Ask the care seeker for the passcode generated at the venue and enter it below.
          </p>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Enter passcode"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              error={error}
              className="flex-1"
            />
            <Button onClick={handleVerify} disabled={verifying || code.length < 4}>
              {verifying ? 'Verifying…' : 'Verify'}
            </Button>
          </div>
        </Card>
      )}

      {booking.status === 'completed' && (
        <Card className="mt-4 flex items-center gap-2 text-sm text-emerald-700" animate={false}>
          <CheckCircle2 size={17} />
          Shift completed. Checked in {new Date(booking.checkIn).toLocaleTimeString()}, checked out{' '}
          {new Date(booking.checkOut).toLocaleTimeString()}.
        </Card>
      )}
    </div>
  )
}
