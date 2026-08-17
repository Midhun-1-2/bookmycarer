import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'

export default function Carousel({ slides, autoPlayMs = 5000 }) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef(null)
  const pausedRef = useRef(false)

  const goTo = useCallback(
    (next) => {
      setDirection(next > index ? 1 : -1)
      setIndex((next + slides.length) % slides.length)
    },
    [index, slides.length]
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) next()
    }, autoPlayMs)
    return () => clearInterval(timerRef.current)
  }, [next, autoPlayMs, slides.length])

  if (!slides.length) return null
  const slide = slides[index]

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-lg shadow-brand-900/5"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="relative h-72 sm:h-80 md:h-96">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 70, scale: 1.03 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -70, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) next()
              else if (info.offset.x > 80) prev()
            }}
            className="absolute inset-0"
          >
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-900/60 to-brand-900/20" />
            <div className="relative flex h-full flex-col items-start justify-center gap-2 p-6 text-white sm:p-10">
              <span className="mb-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                {t('carousel.featured')}
              </span>
              <h3 className="max-w-md text-2xl font-semibold sm:text-3xl">{slide.title}</h3>
              <p className="mt-2 max-w-md text-sm text-brand-50 sm:text-base">{slide.description}</p>
              <Link to={slide.ctaTo} className="mt-4">
                <Button variant="secondary" size="md">
                  {slide.ctaLabel}
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 text-brand-700 shadow-md hover:bg-white sm:flex"
            aria-label={t('carousel.previousSlide')}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 text-brand-700 shadow-md hover:bg-white sm:flex"
            aria-label={t('carousel.nextSlide')}
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
                aria-label={t('carousel.goToSlide', { number: i + 1 })}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
