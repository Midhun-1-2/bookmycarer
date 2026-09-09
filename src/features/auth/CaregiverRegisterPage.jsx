import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, UserPlus, CheckCircle2, FileText, Paperclip, Plus, X } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import MinimalFooter from '../../components/layout/MinimalFooter'
import { categoriesApi, registerCaregiver } from '../../lib/mockApi'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  city: '',
  area: '',
  experienceYears: '0',
  categories: [],
}

function genLocalId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

const emptyDocRow = () => ({ localId: genLocalId(), type: '', file: null })

export default function CaregiverRegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const categories = categoriesApi.listSync()
  const [form, setForm] = useState(emptyForm)
  const [documents, setDocuments] = useState([emptyDocRow()])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function toggleCategory(catId) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(catId)
        ? f.categories.filter((c) => c !== catId)
        : [...f.categories, catId],
    }))
  }

  function updateDocType(localId, type) {
    setDocuments((docs) => docs.map((d) => (d.localId === localId ? { ...d, type } : d)))
  }

  function updateDocFile(localId, file) {
    setDocuments((docs) => docs.map((d) => (d.localId === localId ? { ...d, file } : d)))
  }

  function addDocRow() {
    setDocuments((docs) => [...docs, emptyDocRow()])
  }

  function removeDocRow(localId) {
    setDocuments((docs) => (docs.length > 1 ? docs.filter((d) => d.localId !== localId) : docs))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{10}$/.test(form.phone)) {
      setError(t('caregiverRegister.errorPhone'))
      return
    }
    if (form.categories.length === 0) {
      setError(t('caregiverRegister.errorCategories'))
      return
    }
    const uploadedDocs = documents
      .filter((d) => d.file)
      .map((d) => ({
        id: `doc-${genLocalId()}`,
        type: d.type.trim() || d.file.name,
        fileName: d.file.name,
      }))

    setSubmitting(true)
    const result = await registerCaregiver({
      name: form.name.trim(),
      phone: form.phone,
      email: form.email.trim(),
      city: form.city.trim(),
      area: form.area.trim(),
      experienceYears: Number(form.experienceYears) || 0,
      categories: form.categories,
      skills: [],
      documents: uploadedDocs,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setDone(true)
  }

  return (
    <div className="flex min-h-svh flex-col bg-brand-50">
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <Link
          to="/"
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-slate-500 shadow-sm shadow-brand-900/5 hover:text-brand-700 sm:left-6 sm:top-6"
        >
          <Home size={15} />
          {t('nav.home')}
        </Link>

        <div className="w-full max-w-xl lg:max-w-3xl">
          <Link to="/" className="mb-6 flex items-center justify-center">
            <img src="/brand/wordmark.png" alt="Book My Carer" className="h-14 w-auto" />
          </Link>

          <Card className="p-6 sm:p-8" animate={false}>
            {done ? (
              <div className="py-4 text-center">
                <CheckCircle2 size={44} className="mx-auto text-emerald-500" />
                <h1 className="mt-3 text-xl font-semibold text-slate-900">
                  {t('caregiverRegister.successTitle')}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {t('caregiverRegister.successMessage')}
                </p>
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50 px-3.5 py-3 text-left text-xs text-brand-700">
                  <FileText size={15} className="mt-0.5 shrink-0" />
                  {t('caregiverRegister.successDocuments')}
                </div>
                <Button className="mt-5 w-full" onClick={() => navigate('/login/staff')}>
                  {t('caregiverRegister.goToLogin')}
                </Button>
              </div>
            ) : (
              <>
                <span className="mb-3 inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                  {t('caregiverRegister.badge')}
                </span>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  {t('caregiverRegister.heading')}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{t('caregiverRegister.sub')}</p>
                <p className="mt-3 rounded-lg bg-brand-50 px-3.5 py-2.5 text-xs text-brand-700">
                  {t('caregiverRegister.feeNote')}
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                    <div className="space-y-4">
                      <Input
                        label={t('caregiverRegister.fullName')}
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label={t('caregiverRegister.mobile')}
                          required
                          inputMode="numeric"
                          maxLength={10}
                          placeholder={t('auth.mobilePlaceholder')}
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                        />
                        <Input
                          label={t('caregiverRegister.email')}
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Input
                          label={t('caregiverRegister.city')}
                          required
                          value={form.city}
                          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                        />
                        <Input
                          label={t('caregiverRegister.area')}
                          required
                          value={form.area}
                          onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                        />
                        <Input
                          label={t('caregiverRegister.experienceYears')}
                          type="number"
                          min="0"
                          value={form.experienceYears}
                          onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
                        />
                      </div>

                      <div>
                        <p className="mb-1.5 text-sm font-medium text-slate-700">
                          {t('caregiverRegister.servicesOffered')}
                          <span className="ml-0.5 text-rose-500">*</span>
                        </p>
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
                    </div>

                    <div className="mt-4 border-t border-brand-100 pt-4 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                      <p className="text-sm font-medium text-slate-700">{t('caregiverRegister.documentsTitle')}</p>
                      <p className="mt-1 text-xs text-slate-500">{t('caregiverRegister.documentsSubtitle')}</p>

                      <div className="mt-3 space-y-2">
                        {documents.map((doc, i) => (
                          <div
                            key={doc.localId}
                            className="flex flex-col gap-2 rounded-lg border border-brand-100 bg-white p-2.5"
                          >
                            <input
                              type="text"
                              value={doc.type}
                              onChange={(e) => updateDocType(doc.localId, e.target.value)}
                              placeholder={t('caregiverRegister.documentTypePlaceholder')}
                              className="h-9 w-full rounded-lg border border-brand-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-shadow focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                            />
                            <div className="flex items-center gap-2">
                              <label className="flex h-9 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-brand-300 bg-brand-50/60 px-3 text-xs text-brand-700 hover:bg-brand-50">
                                <Paperclip size={14} className="shrink-0" />
                                <span className="shrink-0 font-medium">
                                  {doc.file ? t('caregiverRegister.changeFile') : t('caregiverRegister.chooseFile')}
                                </span>
                                <span className="truncate text-slate-500">
                                  {doc.file ? doc.file.name : t('caregiverRegister.noFileChosen')}
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => updateDocFile(doc.localId, e.target.files?.[0] ?? null)}
                                />
                              </label>
                              {documents.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeDocRow(doc.localId)}
                                  aria-label={t('caregiverRegister.removeDocument')}
                                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addDocRow}
                        className="mt-2.5 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
                      >
                        <Plus size={15} />
                        {t('caregiverRegister.addAnotherDocument')}
                      </button>

                      <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
                        <FileText size={14} className="mt-0.5 shrink-0" />
                        {t('caregiverRegister.documentsNote')}
                      </p>
                    </div>
                  </div>

                  {error && <p className="mt-4 text-xs text-rose-600">{error}</p>}

                  <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
                    <UserPlus size={17} />
                    {submitting ? t('caregiverRegister.submitting') : t('caregiverRegister.submit')}
                  </Button>

                  <p className="mt-4 text-center text-sm text-slate-500">
                    {t('caregiverRegister.alreadyRegistered')}{' '}
                    <Link to="/login/staff" className="font-medium text-brand-700 hover:underline">
                      {t('caregiverRegister.logInHere')}
                    </Link>
                  </p>
                </form>
              </>
            )}
          </Card>
        </div>
      </div>
      <MinimalFooter />
    </div>
  )
}
