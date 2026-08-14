import { useEffect, useState } from 'react'
import { User, CheckCircle2, Star, IndianRupee, MapPinned, MessageSquareText } from 'lucide-react'
import { staffApi, bookingsApi, categoriesApi, getStaffAverageRating } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function StaffProfilePage() {
  const { session } = useSession()
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [saved, setSaved] = useState(false)
  const [ratesSaved, setRatesSaved] = useState(false)
  const categories = categoriesApi.listSync()

  useEffect(() => {
    async function load() {
      setProfile(await staffApi.get(session.id))
      setBookings(await bookingsApi.list())
    }
    load()
  }, [session.id])

  async function handleSave(e) {
    e.preventDefault()
    await staffApi.update(session.id, profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSaveRates(e) {
    e.preventDefault()
    await staffApi.update(session.id, {
      hourlyRate: Number(profile.hourlyRate) || 0,
      serviceRadiusKm: Number(profile.serviceRadiusKm) || 0,
    })
    setRatesSaved(true)
    setTimeout(() => setRatesSaved(false), 2000)
  }

  if (!profile) return null

  const averageRating = getStaffAverageRating(session.id, bookings, profile.rating)
  const reviews = bookings
    .filter((b) => b.staffId === session.id && b.review)
    .sort((a, b) => new Date(b.review.createdAt) - new Date(a.review.createdAt))

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">Your caregiver profile, rates, and reviews.</p>

      <Card className="mt-6" animate={false}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700">
            {profile.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{profile.name}</p>
            <p className="flex items-center gap-1 text-sm text-gold-500">
              <Star size={13} fill="currentColor" /> {averageRating || '—'} · {profile.experienceYears} yrs experience
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.categories.map((catId) => {
            const cat = categories.find((c) => c.id === catId)
            return cat ? <Badge key={catId} tone="brand">{cat.name}</Badge> : null
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {profile.skills.map((s) => (
            <Badge key={s} tone="neutral">{s}</Badge>
          ))}
        </div>
      </Card>

      <Card className="mt-4" animate={false}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <IndianRupee size={16} className="text-brand-600" />
          Rate & service area
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Set your own hourly rate and how far you're willing to travel for bookings.
        </p>
        <form onSubmit={handleSaveRates} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hourly rate (₹)"
              type="number"
              value={profile.hourlyRate ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, hourlyRate: e.target.value }))}
            />
            <Input
              label="Service radius (km)"
              type="number"
              value={profile.serviceRadiusKm ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, serviceRadiusKm: e.target.value }))}
            />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPinned size={13} />
            Bookings from care seekers up to {profile.serviceRadiusKm || 0} km away will show your profile.
          </p>
          <Button type="submit">{ratesSaved ? <><CheckCircle2 size={16} /> Saved</> : 'Save rate & radius'}</Button>
        </form>
      </Card>

      <Card className="mt-4" animate={false}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <User size={16} className="text-brand-600" />
          Contact details
        </h3>
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <Input
            label="Full name"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
          />
          <Input label="Phone number" value={profile.phone} disabled />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={profile.city}
              onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
            />
            <Input
              label="Area"
              value={profile.area}
              onChange={(e) => setProfile((p) => ({ ...p, area: e.target.value }))}
            />
          </div>
          <Button type="submit">{saved ? <><CheckCircle2 size={16} /> Saved</> : 'Save changes'}</Button>
        </form>
      </Card>

      <Card className="mt-4" animate={false}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <MessageSquareText size={16} className="text-brand-600" />
          Reviews from care seekers
        </h3>
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No reviews yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-brand-50">
            {reviews.map((b) => (
              <li key={b.id} className="py-3">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1 text-sm font-medium text-gold-500">
                    <Star size={13} fill="currentColor" /> {b.review.rating}.0
                  </p>
                  <p className="text-xs text-slate-400">{b.serviceName}</p>
                </div>
                {b.review.comment && <p className="mt-1 text-sm text-slate-600">{b.review.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
