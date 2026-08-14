import { useEffect, useState } from 'react'
import { Plus, Star, IndianRupee } from 'lucide-react'
import { staffApi, bookingsApi, categoriesApi, createStaffAccount, getStaffAverageRating } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import { Table, TableHead, TableBody, Th, Td, Tr } from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

const emptyForm = { name: '', phone: '', city: '', area: '', skills: '', categories: [], hourlyRate: '300', serviceRadiusKm: '10' }

export default function AdminStaffAccountsPage() {
  const { session } = useSession()
  const [staff, setStaff] = useState(null)
  const [bookings, setBookings] = useState([])
  const categories = categoriesApi.listSync()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setStaff(await staffApi.list())
    setBookings(await bookingsApi.list())
  }

  useEffect(() => {
    load()
  }, [])

  function toggleCategory(catId) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(catId)
        ? f.categories.filter((c) => c !== catId)
        : [...f.categories, catId],
    }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    await createStaffAccount(
      {
        name: form.name,
        phone: form.phone,
        city: form.city,
        area: form.area,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        categories: form.categories,
        hourlyRate: Number(form.hourlyRate) || 300,
        serviceRadiusKm: Number(form.serviceRadiusKm) || 10,
      },
      session.id
    )
    setSaving(false)
    setForm(emptyForm)
    setOpen(false)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Staff Accounts</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage caregiver staff accounts.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={17} />
          Create staff
        </Button>
      </div>

      {staff && (
        <div className="mt-6">
          <Table>
            <TableHead>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Location</Th>
              <Th>Categories</Th>
              <Th>Rate</Th>
              <Th>Radius</Th>
              <Th>Rating</Th>
              <Th>Status</Th>
            </TableHead>
            <TableBody>
              {staff.map((s) => (
                <Tr key={s.id}>
                  <Td className="font-medium text-slate-800">{s.name}</Td>
                  <Td>{s.phone}</Td>
                  <Td>{s.area}, {s.city}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {s.categories.map((catId) => {
                        const cat = categories.find((c) => c.id === catId)
                        return cat ? <Badge key={catId} tone="brand">{cat.name}</Badge> : null
                      })}
                    </div>
                  </Td>
                  <Td>
                    <span className="flex items-center text-slate-700">
                      <IndianRupee size={12} />
                      {s.hourlyRate ?? '—'}/hr
                    </span>
                  </Td>
                  <Td>{s.serviceRadiusKm ? `${s.serviceRadiusKm} km` : '—'}</Td>
                  <Td>
                    <span className="flex items-center gap-1 text-gold-500">
                      <Star size={13} fill="currentColor" /> {getStaffAverageRating(s.id, bookings, s.rating) || '—'}
                    </span>
                  </Td>
                  <Td>
                    <Badge tone={s.status === 'active' ? 'success' : 'neutral'}>{s.status}</Badge>
                  </Td>
                </Tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create staff account">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Full name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Phone number"
            required
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              required
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
            <Input
              label="Area"
              required
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
            />
          </div>
          <Input
            label="Skills (comma-separated)"
            placeholder="Wound Care, Medication Management"
            value={form.skills}
            onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hourly rate (₹)"
              type="number"
              value={form.hourlyRate}
              onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
            />
            <Input
              label="Service radius (km)"
              type="number"
              value={form.serviceRadiusKm}
              onChange={(e) => setForm((f) => ({ ...f, serviceRadiusKm: e.target.value }))}
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Service categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.categories.includes(cat.id)
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-brand-200 bg-white text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Creating…' : 'Create staff account'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
