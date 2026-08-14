import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../../i18n'

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
      >
        <Globe size={16} />
        {current.label}
        <ChevronDown size={13} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-brand-100 bg-white p-1.5 shadow-xl shadow-brand-900/10"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code)
                  setOpen(false)
                }}
                className={`block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm ${
                  lang.code === i18n.language
                    ? 'bg-brand-100 font-medium text-brand-700'
                    : 'text-slate-600 hover:bg-brand-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
