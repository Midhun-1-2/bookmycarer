import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarClock, MapPin, Phone, ShieldAlert, IndianRupee, ArrowLeft, KeyRound, MessageSquareText } from 'lucide-react'
import { bookingsApi, staffApi, requestCheckInOtp, submitReview } from '../../lib/mockApi'
import { STATUS_TONE, STATUS_LABEL } from '../../lib/bookingStatus'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import StarRating, { StarRatingDisplay } from '../../components/ui/StarRating'

export default function BookingDetailPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [staff, setStaff] = useState(null)
  const [otp, setOtp] = useState(null)
  const [generatingOtp, setGeneratingOtp] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  async function load() {
    const b = await bookingsApi.get(bookingId)
    setBooking(b)
    if (b?.staffId) setStaff(await staffApi.get(b.staffId))
  }

  useEffect(() => {
    load()
  }, [bookingId])

  async function handleGenerateOtp() {
    setGeneratingOtp(true)
    const code = await requestCheckInOtp(bookingId)
    setOtp(code)
    setGeneratingOtp(false)
  }

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!reviewRating) return
    setSubmittingReview(true)
    await submitReview(bookingId, { rating: reviewRating, comment: reviewComment.trim() })
    setSubmittingReview(false)
    await load()
  }

  if (!booking) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/user/bookings" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
        <ArrowLeft size={14} /> My Bookings
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

      {staff && (
        <Card className="mt-4" animate={false}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Your caregiver</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
              {staff.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="font-medium text-slate-900">{staff.name}</p>
              <p className="text-xs text-slate-500">{staff.skills.join(', ')}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="mt-4" animate={false}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Invoice amount</p>
          <p className="flex items-center text-lg font-semibold text-brand-700">
            <IndianRupee size={16} />
            {booking.payment.amount}
          </p>
        </div>
        <p className="mt-1 text-xs capitalize text-slate-400">Payment {booking.payment.status}</p>
        {booking.payment.status === 'pending' && booking.staffId && (
          <Link to={`/user/book/${booking.id}/checkout`}>
            <Button className="mt-3 w-full">Pay now</Button>
          </Link>
        )}
        {booking.status === 'pending' && !booking.staffId && (
          <Link to={`/user/book/${booking.id}/match`}>
            <Button className="mt-3 w-full" variant="outline">View caregiver matches</Button>
          </Link>
        )}
      </Card>

      {(booking.status === 'confirmed' || booking.status === 'in-progress') && (
        <Card className="mt-4" animate={false}>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <KeyRound size={13} />
            {booking.status === 'confirmed' ? 'Check-in passcode' : 'Check-out passcode'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Generate a code when your caregiver arrives and share it with them verbally to verify presence.
          </p>
          {otp ? (
            <p className="mt-3 text-3xl font-bold tracking-[0.3em] text-brand-700">{otp}</p>
          ) : (
            <Button className="mt-3" variant="outline" onClick={handleGenerateOtp} disabled={generatingOtp}>
              {generatingOtp ? 'Generating…' : 'Generate passcode'}
            </Button>
          )}
        </Card>
      )}

      {(booking.checkIn || booking.checkOut) && (
        <Card className="mt-4" animate={false}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Shift verification</p>
          <div className="mt-2 space-y-1 text-sm text-slate-700">
            {booking.checkIn && <p>Checked in: {new Date(booking.checkIn).toLocaleString()}</p>}
            {booking.checkOut && <p>Checked out: {new Date(booking.checkOut).toLocaleString()}</p>}
          </div>
        </Card>
      )}

      {booking.status === 'completed' && (
        <Card className="mt-4" animate={false}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <MessageSquareText size={16} className="text-brand-600" />
            {booking.review ? 'Your review' : 'Rate your caregiver'}
          </h3>
          {booking.review ? (
            <div className="mt-3">
              <StarRatingDisplay value={booking.review.rating} size={16} />
              {booking.review.comment && (
                <p className="mt-2 text-sm text-slate-600">{booking.review.comment}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="mt-3 space-y-3">
              <StarRating value={reviewRating} onChange={setReviewRating} />
              <textarea
                rows={3}
                placeholder="How was your experience? (optional)"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full rounded-lg border border-brand-200 bg-white p-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
              <Button type="submit" disabled={!reviewRating || submittingReview}>
                {submittingReview ? 'Submitting…' : 'Submit review'}
              </Button>
            </form>
          )}
        </Card>
      )}
    </div>
  )
}
