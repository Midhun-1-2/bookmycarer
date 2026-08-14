import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { categoriesApi } from '../../lib/mockApi'
import { getCategoryIcon } from '../../lib/icons'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

const ICONS = ['HeartHandshake', 'HandHeart', 'Stethoscope', 'Sparkles', 'Car']
const emptyCategory = { name: '', description: '', icon: 'HeartHandshake' }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyCategory)
  const [serviceDrafts, setServiceDrafts] = useState({})

  async function load() {
    setCategories(await categoriesApi.list())
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAddCategory(e) {
    e.preventDefault()
    await categoriesApi.create({
      id: `cat-${Date.now()}`,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: form.name,
      description: form.description,
      icon: form.icon,
      services: [],
    })
    setForm(emptyCategory)
    setOpen(false)
    load()
  }

  async function handleAddService(cat) {
    const draft = serviceDrafts[cat.id]
    if (!draft?.name || !draft?.priceFrom) return
    await categoriesApi.update(cat.id, {
      services: [
        ...cat.services,
        { id: `svc-${Date.now()}`, name: draft.name, priceFrom: Number(draft.priceFrom) },
      ],
    })
    setServiceDrafts((d) => ({ ...d, [cat.id]: { name: '', priceFrom: '' } }))
    load()
  }

  async function handleRemoveService(cat, serviceId) {
    await categoriesApi.update(cat.id, {
      services: cat.services.filter((s) => s.id !== serviceId),
    })
    load()
  }

  if (!categories) return null

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Service Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Manage care categories and their individual services.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={17} />
          Add category
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon)
          const draft = serviceDrafts[cat.id] ?? { name: '', priceFrom: '' }
          return (
            <Card key={cat.id} animate={false}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Icon size={19} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>
              </div>

              <ul className="mt-4 divide-y divide-brand-50 border-t border-brand-50">
                {cat.services.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-slate-700">{s.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">₹{s.priceFrom}/hr</span>
                      <button
                        onClick={() => handleRemoveService(cat, s.id)}
                        className="cursor-pointer text-slate-400 hover:text-rose-600"
                        aria-label="Remove service"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-2">
                <input
                  placeholder="New service name"
                  value={draft.name}
                  onChange={(e) =>
                    setServiceDrafts((d) => ({ ...d, [cat.id]: { ...draft, name: e.target.value } }))
                  }
                  className="h-9 flex-1 rounded-lg border border-brand-200 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <input
                  placeholder="₹/hr"
                  type="number"
                  value={draft.priceFrom}
                  onChange={(e) =>
                    setServiceDrafts((d) => ({ ...d, [cat.id]: { ...draft, priceFrom: e.target.value } }))
                  }
                  className="h-9 w-24 rounded-lg border border-brand-200 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <Button size="sm" variant="outline" onClick={() => handleAddService(cat)}>
                  <Plus size={14} /> Add
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add service category">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Category name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Description"
            required
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Icon</p>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((iconName) => {
                const Icon = getCategoryIcon(iconName)
                return (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => setForm((f) => ({ ...f, icon: iconName }))}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-colors ${
                      form.icon === iconName
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-brand-200 text-brand-700 hover:bg-brand-50'
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                )
              })}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add category
          </Button>
        </form>
      </Modal>
    </div>
  )
}
