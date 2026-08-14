import { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarClock, MapPin, Phone, ShieldAlert, Tag } from 'lucide-react'
import { categoriesApi, createBooking } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const SCHEDULE_TYPES = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly recurring' },
]

const CARE_TAGS = [
  'Medication Management',
  'Mobility Assistance',
  'Dementia Support',
  'Post-Surgery Care',
  'Diabetic Care',
]

export default function BookingFormPage() {
  const { categorySlug, serviceId } = useParams()
  const { session } = useSession()
  const navigate = useNavigate()

  const categories = categoriesApi.listSync()
  const category = categories.find((c) => c.slug === categorySlug)
  const service = category?.services.find((s) => s.id === serviceId)

  const [form, setForm] = useState({
    scheduleType: 'hourly',
    startDate: '',
    time: '',
    address: '',
    contactName: session?.name ?? '',
    contactPhone: session?.phone ?? '',
    emergencyContact: '',
  })
  const [tags, setTags] = useState([])
  const [submitting, setSubmitting] = useState(false)

  if (!category || !service) return <Navigate to="/services" replace />

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleTag(tag) {
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const booking = await createBooking({
      userId: session.id,
      categoryId: category.id,
      serviceId: service.id,
      serviceName: service.name,
      scheduleType: form.scheduleType,
      startDate: form.startDate,
      time: form.time,
      address: form.address,
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      emergencyContact: form.emergencyContact,
      careTags: tags,
      amount: service.priceFrom,
    })
    setSubmitting(false)
    navigate(`/user/book/${booking.id}/match`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p className="text-sm font-medium text-brand-600">{category.name}</p>
        <h1 className="text-2xl font-semibold text-slate-900">Book {service.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tell us where and when — we'll match you with the right caregiver.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <CalendarClock size={16} className="text-brand-600" />
              Schedule
            </h3>
            <div className="mb-4 flex gap-2">
              {SCHEDULE_TYPES.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => update('scheduleType', s.value)}
                  className={`cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    form.scheduleType === s.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start date"
                type="date"
                required
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
              />
              <Input
                label="Time"
                type="time"
                required
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
              />
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <MapPin size={16} className="text-brand-600" />
              Location & contact
            </h3>
            <div className="space-y-4">
              <Input
                label="Street address"
                required
                placeholder="House no, street, area, city"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Contact name"
                  required
                  value={form.contactName}
                  onChange={(e) => update('contactName', e.target.value)}
                />
                <Input
                  label="Contact phone"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={form.contactPhone}
                  onChange={(e) => update('contactPhone', e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <Input
                label="Emergency contact"
                required
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={form.emergencyContact}
                onChange={(e) => update('emergencyContact', e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Tag size={16} className="text-brand-600" />
              Specialized care requirements
              <span className="font-normal text-slate-400">(optional)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {CARE_TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    tags.includes(tag)
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-brand-200 bg-white text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3.5 py-2.5 text-xs text-amber-700">
            <ShieldAlert size={15} className="mt-0.5 shrink-0" />
            Your address and emergency contact are shared only with your matched caregiver and our
            support team.
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            <Phone size={17} />
            {submitting ? 'Finding caregivers…' : 'Find a caregiver'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
