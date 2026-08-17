import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, IndianRupee } from 'lucide-react'
import { categoriesApi, getServiceStartingPrice } from '../../lib/mockApi'
import { getCategoryIcon } from '../../lib/icons'
import { getCategoryPhotoUrl } from '../../lib/categoryImages'
import { useSession } from '../../lib/session'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function CategoryPage() {
  const { t } = useTranslation()
  const { categorySlug } = useParams()
  const { session } = useSession()
  const categories = categoriesApi.listSync()
  const category = categories.find((c) => c.slug === categorySlug)

  if (!category) return <Navigate to="/services" replace />

  const Icon = getCategoryIcon(category.icon)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100">
        <img
          src={getCategoryPhotoUrl(category.icon, { w: 1200 })}
          alt={category.name}
          className="h-40 w-full object-cover sm:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-brand-900/10 to-transparent" />
      </div>
      <div className="relative z-10 -mt-8 flex items-start gap-4 px-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-brand-600 text-white shadow-sm">
          <Icon size={26} />
        </div>
        <div className="pt-8">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{category.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{category.description}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {category.services.map((service) => {
          const price = service.priceFrom ?? getServiceStartingPrice(service.id)
          return (
          <Card
            key={service.id}
            className="flex w-full flex-col justify-between sm:w-[calc(50%_-_0.5rem)] lg:w-[calc(33.333%_-_0.667rem)]"
          >
            <div>
              <h3 className="text-base font-semibold text-slate-900">{service.name}</h3>
              {price != null && (
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  {t('categoryPage.startingFrom')}
                  <span className="inline-flex items-center font-medium text-brand-700">
                    <IndianRupee size={13} />
                    {price}{t('common.perHour')}
                  </span>
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`/services/${category.slug}/${service.id}`}>
                <Button variant="outline" size="sm">
                  {t('categoryPage.details')} <ArrowRight size={14} />
                </Button>
              </Link>
              <Link
                to={
                  session?.role === 'user'
                    ? `/user/book/${category.slug}/${service.id}`
                    : '/login/user'
                }
              >
                <Button variant="primary" size="sm">
                  {t('categoryPage.bookNow')}
                </Button>
              </Link>
            </div>
          </Card>
          )
        })}
      </div>
    </div>
  )
}
