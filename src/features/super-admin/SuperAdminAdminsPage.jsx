import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { adminsApi, createAdminAccount } from '../../lib/mockApi'
import { Table, TableHead, TableBody, Th, Td, Tr } from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

const emptyForm = { name: '', phone: '' }

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setAdmins(await adminsApi.list())
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    await createAdminAccount({ name: form.name, phone: form.phone })
    setSaving(false)
    setForm(emptyForm)
    setOpen(false)
    load()
  }

  if (!admins) return null

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Accounts</h1>
          <p className="mt-1 text-sm text-slate-500">Manage who has Admin access to the platform.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={17} />
          Create admin
        </Button>
      </div>

      <div className="mt-6">
        <Table>
          <TableHead>
            <Th>Name</Th>
            <Th>Phone</Th>
            <Th>Role</Th>
          </TableHead>
          <TableBody>
            {admins.map((a) => (
              <Tr key={a.id}>
                <Td className="font-medium text-slate-800">{a.name}</Td>
                <Td>{a.phone}</Td>
                <Td>
                  <Badge tone={a.role === 'super-admin' ? 'brand' : 'neutral'}>
                    {a.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create admin account">
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
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Creating…' : 'Create admin account'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
