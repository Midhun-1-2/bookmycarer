import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700',
  secondary:
    'bg-brand-100 text-brand-800 hover:bg-brand-200',
  outline:
    'border border-brand-300 text-brand-700 bg-white hover:bg-brand-50',
  ghost:
    'text-brand-700 hover:bg-brand-100',
  danger:
    'bg-rose-600 text-white shadow-sm shadow-rose-600/30 hover:bg-rose-700',
}

const sizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
