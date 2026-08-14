import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

export default function Card({ className, children, animate = true, ...props }) {
  const Comp = animate ? motion.div : 'div'
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.35, ease: 'easeOut' },
      }
    : {}

  return (
    <Comp
      className={cn(
        'rounded-2xl border border-brand-100 bg-white p-5 shadow-sm shadow-brand-900/5',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  )
}
