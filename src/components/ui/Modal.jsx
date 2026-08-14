import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export default function Modal({ open, onClose, title, children, className }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className={cn(
              'relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl shadow-brand-900/20',
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="mb-4 flex items-center justify-between">
              {title && (
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              )}
              <button
                type="button"
                onClick={onClose}
                className="ml-auto rounded-full p-1.5 text-slate-400 hover:bg-brand-50 hover:text-slate-600 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
