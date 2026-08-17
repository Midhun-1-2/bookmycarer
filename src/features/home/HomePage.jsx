import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Clock, Star, ArrowRight } from 'lucide-react'
import { categoriesApi } from '../../lib/mockApi'
import { getCategoryPhotoUrl, HERO_PHOTO_URL } from '../../lib/categoryImages'
import Carousel from '../../components/Carousel/Carousel'
import CategoryCard from '../../components/CategoryCard'
import Button from '../../components/ui/Button'

export default function HomePage() {
  const { t } = useTranslation()
  const categories = categoriesApi.listSync()

  const TRUST_POINTS = [
    { icon: ShieldCheck, label: t('trust.verified') },
    { icon: Clock, label: t('trust.flexible') },
    { icon: Star, label: t('trust.rated') },
  ]

  const slides = categories.slice(0, 3).map((cat) => ({
    id: cat.id,
    title: cat.name,
    description: cat.description,
    ctaLabel: t('carousel.exploreServices'),
    ctaTo: `/services/${cat.slug}`,
    image: getCategoryPhotoUrl(cat.icon, { w: 900 }),
  }))

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
              {t('hero.badge')}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
              {t('hero.title1')}{' '}
              <span className="text-brand-600">{t('hero.title2')}</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-slate-500 sm:text-lg">
              {t('hero.subtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login/user">
                <Button size="lg">
                  {t('hero.cta1')}
                  <ArrowRight size={17} />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline">
                  {t('hero.cta2')}
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon size={16} className="text-brand-600" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-full bg-brand-200/50 blur-3xl" />
            <img
              src={HERO_PHOTO_URL}
              alt={t('home.heroImageAlt')}
              className="mx-auto aspect-[4/5] w-full max-w-md rounded-3xl object-cover shadow-xl shadow-brand-900/15 sm:aspect-square"
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Carousel slides={slides} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{t('browse.title')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('browse.subtitle')}</p>
          </div>
          <Link to="/services" className="hidden text-sm font-medium text-brand-700 hover:underline sm:block">
            {t('browse.viewAll')}
          </Link>
        </div>

        <div className="flex flex-wrap gap-5">
          {categories.map((cat) => (
            <div key={cat.id} className="w-full sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(33.333%_-_0.834rem)]">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-100">
            {t('home.ctaSubtitle')}
          </p>
          <Link to="/login/user" className="mt-6 inline-block">
            <Button size="lg" variant="secondary">
              {t('home.ctaButton')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
