import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Users,
  Headphones,
} from 'lucide-react'
import { categoriesApi } from '../../lib/mockApi'
import { getCategoryPhotoUrl, HERO_PHOTO_URL } from '../../lib/categoryImages'
import CategoryCard from '../../components/CategoryCard'
import Button from '../../components/ui/Button'

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}
const revealUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function FeaturedBanner({ slides }) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)
  const pausedRef = useRef(false)

  const goTo = useCallback((next) => setIndex((next + slides.length) % slides.length), [slides.length])
  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) next()
    }, 4500)
    return () => clearInterval(timerRef.current)
  }, [next, slides.length])

  if (!slides.length) return null
  const slide = slides[index]

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={revealUp}
      className="relative overflow-hidden rounded-3xl bg-brand-50/70 shadow-sm shadow-brand-900/5"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:py-14 lg:pr-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {t('home.featuredBadge')}
          </span>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            {t('home.featuredTitle')}
          </h2>
          <p className="mt-3 max-w-md text-sm text-slate-500 sm:text-base">{t('home.featuredSubtitle')}</p>
          <Link to="/services" className="mt-6 inline-block">
            <Button size="lg">
              {t('home.featuredCta')}
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="relative h-64 sm:h-80 lg:h-[24rem]">
          <div className="absolute inset-0 hidden bg-brand-600 lg:block" />
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 lg:[clip-path:polygon(9%_0,100%_0,100%_100%,0_100%)]"
          />

          {slides.length > 1 && (
            <>
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 lg:left-[18%]">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                      i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={t('carousel.goToSlide', { number: i + 1 })}
                  />
                ))}
              </div>
              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                <button
                  onClick={prev}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
                  aria-label={t('carousel.previousSlide')}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
                  aria-label={t('carousel.nextSlide')}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const categories = categoriesApi.listSync()

  const TRUST_POINTS = [
    { icon: ShieldCheck, label: t('trust.verified') },
    { icon: Clock, label: t('trust.flexible') },
    { icon: Star, label: t('trust.rated') },
  ]

  const STATS = [
    { icon: Users, label: t('trust.familiesTitle') },
    { icon: ShieldCheck, label: t('trust.verifiedTitle') },
    { icon: Star, label: t('trust.ratedTitle') },
    { icon: Headphones, label: t('trust.supportTitle') },
  ]

  const CTA_TRUST = [
    { icon: ShieldCheck, title: t('home.ctaTrust1'), desc: t('home.ctaTrust1Desc') },
    { icon: Clock, title: t('home.ctaTrust2'), desc: t('home.ctaTrust2Desc') },
    { icon: Star, title: t('home.ctaTrust3'), desc: t('home.ctaTrust3Desc') },
  ]

  const bannerSlides = categories.slice(0, 4).map((cat) => ({
    id: cat.id,
    title: cat.name,
    image: getCategoryPhotoUrl(cat.icon, { w: 900 }),
  }))

  return (
    <div>
      <section className="relative overflow-hidden pb-14 sm:pb-20">
        <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pt-16 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div variants={heroStagger} initial="hidden" animate="show">
              <motion.span
                variants={heroItem}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700"
              >
                <Heart size={12} className="fill-brand-600 text-brand-600" />
                {t('hero.badge')}
              </motion.span>
              <motion.h1
                variants={heroItem}
                className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-[3.4rem]"
              >
                {t('hero.title1')}
                <br />
                <span className="text-brand-600">{t('hero.title2')}</span>
              </motion.h1>
              <motion.p variants={heroItem} className="mt-5 max-w-lg text-base text-slate-500 sm:text-lg">
                {t('hero.subtitle')}
              </motion.p>
              <motion.div variants={heroItem} className="mt-7 flex flex-wrap gap-3">
                <Link to="/login/user">
                  <Button size="lg">
                    {t('hero.cta1')}
                    <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline">
                    {t('hero.cta2')}
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={heroItem} className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
                {TRUST_POINTS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon size={16} className="text-brand-600" />
                    {label}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute -inset-6 -z-10 rounded-full bg-brand-200/50 blur-3xl" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <img
                  src={HERO_PHOTO_URL}
                  alt={t('home.heroImageAlt')}
                  className="mx-auto aspect-[4/5] w-full max-w-md rounded-tl-3xl rounded-tr-[4.5rem] rounded-br-3xl rounded-bl-3xl object-cover shadow-xl shadow-brand-900/15 sm:aspect-square"
                />
                <div className="pointer-events-none absolute left-10 top-12 hidden sm:block">
                  <p
                    className="rotate-[-6deg] text-3xl leading-[1.15] text-white"
                    style={{ fontFamily: "'Caveat', cursive", textShadow: '0 2px 10px rgba(35,31,32,0.45)' }}
                  >
                    {t('home.heroCaption1')}
                    <br />
                    <span className="inline-flex items-center gap-1.5">
                      {t('home.heroCaption2')}
                      <Heart size={16} className="fill-white text-white" />
                    </span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <svg
          className="absolute inset-x-0 bottom-0 h-14 w-full text-brand-600 sm:h-20"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,85 C200,80 400,88 600,82 C800,76 950,55 1100,40 C1250,25 1350,15 1440,10 L1440,100 L0,100 Z"
          />
        </svg>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <FeaturedBanner slides={bannerSlides} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{t('browse.title')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('browse.subtitle')}</p>
          </div>
          <Link to="/services" className="hidden text-sm font-medium text-brand-700 hover:underline sm:block">
            {t('browse.viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={revealUp}
        className="border-y border-brand-100 bg-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col lg:flex-row lg:items-stretch">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid flex-1 grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8"
          >
            {STATS.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={heroItem}
                className="group flex flex-col items-center gap-2 text-center lg:items-start lg:text-left"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={20} />
                </span>
                <p className="text-sm font-semibold leading-snug text-slate-800">{label}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="relative flex items-center overflow-hidden bg-brand-600 px-8 py-8 lg:w-80 lg:px-10">
            <div className="absolute inset-y-0 -left-10 hidden w-16 -skew-x-12 bg-brand-600 lg:block" />
            <p className="font-serif text-lg italic leading-snug text-white">{t('trust.quote')}</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={revealUp}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-brand-900/10">
          <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
            <div className="relative hidden min-h-[16rem] lg:block">
              <img
                src={getCategoryPhotoUrl('HeartHandshake', { w: 700 })}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative overflow-hidden bg-brand-600 px-6 py-10 sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/5" />
              <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-100">
                    <Heart size={12} className="fill-white text-white" />
                    {t('home.ctaEyebrow')}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {t('home.ctaTitle')}
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-brand-100 sm:text-base">{t('home.ctaSubtitle')}</p>
                  <Link to="/login/user" className="mt-6 inline-block">
                    <Button size="lg" variant="secondary">
                      {t('home.ctaButton')}
                      <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4 border-t border-white/15 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                  {CTA_TRUST.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                        <Icon size={15} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="text-xs text-brand-100">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
