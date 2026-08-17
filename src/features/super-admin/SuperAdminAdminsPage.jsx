import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { adminsApi, createAdminAccount } from '../../lib/mockApi'
import { Table, TableHead, TableBody, Th, Td, Tr } from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

const emptyForm = { name: '', phone: '' }

export default function SuperAdminAdminsPage() {
  const { t } = useTranslation()
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
          <h1 className="text-2xl font-semibold text-slate-900">{t('superAdminAdmins.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('superAdminAdmins.subtitle')}</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={17} />
          {t('superAdminAdmins.createAdmin')}
        </Button>
      </div>

      <div className="mt-6">
        <Table>
          <TableHead>
            <Th>{t('superAdminAdmins.tableName')}</Th>
            <Th>{t('superAdminAdmins.tablePhone')}</Th>
            <Th>{t('superAdminAdmins.tableRole')}</Th>
          </TableHead>
          <TableBody>
            {admins.map((a) => (
              <Tr key={a.id}>
                <Td className="font-medium text-slate-800">{a.name}</Td>
                <Td>{a.phone}</Td>
                <Td>
                  <Badge tone={a.role === 'super-admin' ? 'brand' : 'neutral'}>
                    {a.role === 'super-admin' ? t('superAdminAdmins.roleSuperAdmin') : t('superAdminAdmins.roleAdmin')}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t('superAdminAdmins.modalTitle')}>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label={t('superAdminAdmins.fullName')}
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label={t('superAdminAdmins.phoneNumber')}
            required
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
          />
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? t('superAdminAdmins.creating') : t('superAdminAdmins.submitButton')}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
