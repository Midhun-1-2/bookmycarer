import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { getCategoryIcon } from '../lib/icons'
import { getCategoryPhotoUrl } from '../lib/categoryImages'
import Card from './ui/Card'

export default function CategoryCard({ category, showServices = false }) {
  const { t } = useTranslation()
  const Icon = getCategoryIcon(category.icon)

  return (
    <Link to={`/services/${category.slug}`}>
      <Card
        className="group h-full overflow-hidden p-0 transition-shadow hover:shadow-md hover:shadow-brand-900/10"
      >
        <div className="relative h-36 w-full bg-brand-100">
          <img
            src={getCategoryPhotoUrl(category.icon, { w: 500 })}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-brand-900/5 to-transparent" />
          <div className="absolute bottom-0 left-4 flex h-11 w-11 translate-y-1/2 items-center justify-center rounded-xl border-4 border-white bg-brand-600 text-white shadow-sm">
            <Icon size={20} />
          </div>
        </div>
        <div className="p-5 pt-8">
          <h3 className="text-base font-semibold text-slate-900">{category.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{category.description}</p>
          {showServices && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {category.services.slice(0, 3).map((s) => (
                <li key={s.id} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700">
                  {s.name}
                </li>
              ))}
            </ul>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
            {t('browse.explore')} <ArrowRight size={14} />
          </span>
        </div>
      </Card>
    </Link>
  )
}
