import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { getCategoryIcon } from '../lib/icons'
import { getCategoryPhotoUrl } from '../lib/categoryImages'
import Card from './ui/Card'

export default function CategoryCard({ category, showServices = false, index }) {
  const { t } = useTranslation()
  const Icon = getCategoryIcon(category.icon)

  return (
    <Link to={`/services/${category.slug}`}>
      <Card
        className="group h-full overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-brand-900/10"
        {...(typeof index === 'number'
          ? { transition: { duration: 0.4, ease: 'easeOut', delay: Math.min(index * 0.07, 0.42) } }
          : {})}
      >
        <div className="relative h-40 w-full overflow-hidden bg-brand-100">
          <img
            src={getCategoryPhotoUrl(category.icon, { w: 500 })}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/25 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon size={17} />
          </div>
        </div>
        <div className="p-5">
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
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 transition-transform duration-200 group-hover:gap-1.5">
            {t('browse.explore')} <ArrowRight size={14} />
          </span>
        </div>
      </Card>
    </Link>
  )
}
