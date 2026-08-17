import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, ClipboardList, IndianRupee } from 'lucide-react'
import { categoriesApi, servicePagesApi } from '../../lib/mockApi'
import { getCategoryIcon } from '../../lib/icons'
import { useSession } from '../../lib/session'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function ServiceDetailPage() {
  const { t } = useTranslation()
  const { categorySlug, serviceId } = useParams()
  const { session } = useSession()
  const categories = categoriesApi.listSync()
  const category = categories.find((c) => c.slug === categorySlug)
  if (!category) return <Navigate to="/services" replace />

  const service = category.services.find((s) => s.id === serviceId)
  if (!service) return <Navigate to={`/services/${categorySlug}`} replace />

  const pages = servicePagesApi.listSync()
  const page = pages.find((p) => p.serviceId === serviceId && p.status === 'published')
  const Icon = getCategoryIcon(category.icon)

  const description = page?.description ?? t('serviceDetail.defaultDescription', { serviceName: service.name, categoryName: category.name })
  const features = page?.features ?? [t('serviceDetail.defaultFeature1'), t('serviceDetail.defaultFeature2'), t('serviceDetail.defaultFeature3')]
  const requirements = page?.requirements ?? [t('serviceDetail.defaultRequirement')]
  const pricing = page?.pricing ?? (service.priceFrom != null ? [{ label: t('serviceDetail.hourly'), price: service.priceFrom, unit: t('common.perHourUnit') }] : [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={`/services/${categorySlug}`} className="text-sm font-medium text-brand-700 hover:underline">
        ← {category.name}
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <Icon size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{service.name}</h1>
          <p className="text-sm text-slate-500">{page?.shortDescription ?? category.name}</p>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-slate-600">{description}</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <CheckCircle2 size={16} className="text-brand-600" />
            {t('serviceDetail.featuresAndBenefits')}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {f}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ClipboardList size={16} className="text-brand-600" />
            {t('serviceDetail.requirements')}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {requirements.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-5">
        <h3 className="text-sm font-semibold text-slate-900">{t('serviceDetail.pricing')}</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          {pricing.map((p) => (
            <div key={p.label} className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
              <p className="text-xs text-slate-500">{p.label}</p>
              <p className="flex items-center text-lg font-semibold text-brand-700">
                <IndianRupee size={15} />
                {p.price}
                <span className="ml-0.5 text-sm font-normal text-slate-500">{p.unit}</span>
              </p>
            </div>
          ))}
        </div>
        <Link
          to={
            session?.role === 'user'
              ? `/user/book/${category.slug}/${service.id}`
              : '/login/user'
          }
          className="mt-5 inline-block"
        >
          <Button size="lg">{t('serviceDetail.bookThisService')}</Button>
        </Link>
      </Card>
    </div>
  )
}
