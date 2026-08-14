import { useEffect, useState } from 'react'
import { User, Phone, MapPin, FileText, IndianRupee, CheckCircle2, ShieldCheck, BadgeCheck } from 'lucide-react'
import { bookingsApi, usersApi } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function UserProfilePage() {
  const { session } = useSession()
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [saved, setSaved] = useState(false)
  const [aadharInput, setAadharInput] = useState('')
  const [aadharError, setAadharError] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    async function load() {
      const p = await usersApi.get(session.id)
      setProfile(p)
      const all = await bookingsApi.list()
      setBookings(all.filter((b) => b.userId === session.id))
    }
    load()
  }, [session.id])

  async function handleSave(e) {
    e.preventDefault()
    await usersApi.update(session.id, profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleVerifyAadhar(e) {
    e.preventDefault()
    setAadharError('')
    if (!/^\d{12}$/.test(aadharInput)) {
      setAadharError('Enter a valid 12-digit Aadhar number.')
      return
    }
    setVerifying(true)
    await new Promise((r) => setTimeout(r, 1200))
    const updated = await usersApi.update(session.id, {
      aadharLast4: aadharInput.slice(-4),
      aadharVerified: true,
    })
    setProfile(updated)
    setVerifying(false)
  }

  if (!profile) return null

  const invoices = bookings.filter((b) => b.payment.status === 'paid')
  const totalSpent = invoices.reduce((sum, b) => sum + b.payment.amount, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">Your details, bookings, and invoices.</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card animate={false} className="text-center">
          <p className="text-xl font-semibold text-brand-700">{bookings.length}</p>
          <p className="text-xs text-slate-500">Bookings</p>
        </Card>
        <Card animate={false} className="text-center">
          <p className="text-xl font-semibold text-brand-700">{invoices.length}</p>
          <p className="text-xs text-slate-500">Invoices</p>
        </Card>
        <Card animate={false} className="text-center">
          <p className="text-xl font-semibold text-brand-700">₹{totalSpent}</p>
          <p className="text-xs text-slate-500">Total spent</p>
        </Card>
      </div>

      <Card className="mt-5" animate={false}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <User size={16} className="text-brand-600" />
          Personal details
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

      <Card className="mt-5" animate={false}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <ShieldCheck size={16} className="text-brand-600" />
          Identity verification
        </h3>
        {profile.aadharVerified ? (
          <div className="mt-3 flex items-center gap-2">
            <Badge tone="success">
              <BadgeCheck size={12} className="mr-1 inline" />
              Aadhar verified
            </Badge>
            <span className="text-sm text-slate-500">•••• •••• {profile.aadharLast4}</span>
          </div>
        ) : (
          <form onSubmit={handleVerifyAadhar} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              label="Aadhar number"
              placeholder="12-digit Aadhar number"
              inputMode="numeric"
              maxLength={12}
              value={aadharInput}
              onChange={(e) => setAadharInput(e.target.value.replace(/\D/g, ''))}
              error={aadharError}
              className="flex-1"
            />
            <Button type="submit" disabled={verifying} className="sm:mb-0">
              {verifying ? 'Verifying…' : 'Verify'}
            </Button>
          </form>
        )}
      </Card>

      <Card className="mt-5" animate={false}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <FileText size={16} className="text-brand-600" />
          Invoices
        </h3>
        {invoices.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No paid invoices yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-brand-50">
            {invoices.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{b.serviceName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Phone size={11} /> {b.contactPhone} &nbsp;
                    <MapPin size={11} /> {b.startDate}
                  </p>
                </div>
                <p className="flex items-center font-semibold text-brand-700">
                  <IndianRupee size={13} />
                  {b.payment.amount}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
