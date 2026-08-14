import { useEffect, useState } from 'react'
import { Plus, Pencil, Archive, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { servicePagesApi, categoriesApi } from '../../lib/mockApi'
import { Table, TableHead, TableBody, Th, Td, Tr } from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

const emptyForm = {
  categoryId: '',
  serviceId: '',
  slug: '',
  title: '',
  shortDescription: '',
  description: '',
  features: '',
  requirements: '',
  priceLabel: 'Hourly',
  price: '',
  unit: '/ hr',
}

export default function AdminServicePagesPage() {
  const [pages, setPages] = useState(null)
  const categories = categoriesApi.listSync()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  async function load() {
    setPages(await servicePagesApi.list())
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setOpen(true)
  }

  function openEdit(page) {
    setForm({
      categoryId: page.categoryId,
      serviceId: page.serviceId,
      slug: page.slug,
      title: page.title,
      shortDescription: page.shortDescription,
      description: page.description,
      features: page.features.join(', '),
      requirements: page.requirements.join(', '),
      priceLabel: page.pricing[0]?.label ?? 'Hourly',
      price: page.pricing[0]?.price ?? '',
      unit: page.pricing[0]?.unit ?? '/ hr',
    })
    setEditingId(page.id)
    setOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    const payload = {
      categoryId: form.categoryId,
      serviceId: form.serviceId || `svc-${Date.now()}`,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split(',').map((s) => s.trim()).filter(Boolean),
      pricing: [{ label: form.priceLabel, price: Number(form.price), unit: form.unit }],
      updatedAt: new Date().toISOString(),
    }

    if (editingId) {
      await servicePagesApi.update(editingId, payload)
    } else {
      await servicePagesApi.create({ id: `page-${Date.now()}`, status: 'draft', ...payload })
    }
    setOpen(false)
    load()
  }

  async function toggleStatus(page) {
    await servicePagesApi.update(page.id, {
      status: page.status === 'published' ? 'draft' : 'published',
    })
    load()
  }

  if (!pages) return null

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Service Pages CMS</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, edit, and publish individual service pages without a redeploy.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={17} />
          New page
        </Button>
      </div>

      <div className="mt-6">
        <Table>
          <TableHead>
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Updated</Th>
            <Th>Actions</Th>
          </TableHead>
          <TableBody>
            {pages.map((page) => {
              const cat = categories.find((c) => c.id === page.categoryId)
              return (
                <Tr key={page.id}>
                  <Td className="font-medium text-slate-800">{page.title}</Td>
                  <Td>{cat?.name ?? '—'}</Td>
                  <Td>
                    <Badge tone={page.status === 'published' ? 'success' : 'neutral'}>{page.status}</Badge>
                  </Td>
                  <Td>{new Date(page.updatedAt).toLocaleDateString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(page)} className="cursor-pointer text-slate-400 hover:text-brand-600" aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => toggleStatus(page)} className="cursor-pointer text-slate-400 hover:text-brand-600" aria-label="Toggle status">
                        {page.status === 'published' ? <Archive size={15} /> : <CheckCircle2 size={15} />}
                      </button>
                      {cat && (
                        <Link to={`/services/${cat.slug}/${page.serviceId}`} target="_blank" className="text-slate-400 hover:text-brand-600" aria-label="Preview">
                          <ExternalLink size={15} />
                        </Link>
                      )}
                    </div>
                  </Td>
                </Tr>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editingId ? 'Edit service page' : 'New service page'} className="max-w-xl">
        <form onSubmit={handleSave} className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Category</p>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="h-11 w-full rounded-lg border border-brand-200 bg-white px-3.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input label="Service ID" placeholder="svc-example-id" value={form.serviceId} onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))} />
          <Input label="Page title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Input label="Short description" value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} />
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Full description</p>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-brand-200 bg-white p-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <Input label="Features (comma-separated)" value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} />
          <Input label="Requirements (comma-separated)" value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Price label" value={form.priceLabel} onChange={(e) => setForm((f) => ({ ...f, priceLabel: e.target.value }))} />
            <Input label="Price (₹)" type="number" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            <Input label="Unit" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} />
          </div>
          <Button type="submit" className="w-full">
            {editingId ? 'Save changes' : 'Create page (draft)'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
