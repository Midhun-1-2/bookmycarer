import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function PanicButton({ variant = 'floating' }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)

  function handleClose() {
    setOpen(false)
    setTimeout(() => setSent(false), 300)
  }

  function handleTrigger() {
    setSent(true)
  }

  const trigger =
    variant === 'tab' ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-w-[68px] shrink-0 snap-start flex-col items-center justify-center gap-1 py-1"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-transform active:scale-95">
          <AlertTriangle size={18} />
        </span>
        <span className="line-clamp-2 max-w-[64px] text-center text-[9px] font-medium leading-tight text-rose-600">
          {t('panic.emergencyAlertAriaLabel')}
        </span>
      </button>
    ) : (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40"
        aria-label={t('panic.emergencyAlertAriaLabel')}
      >
        <AlertTriangle size={22} />
      </motion.button>
    )

  return (
    <>
      {trigger}

      <Modal open={open} onClose={handleClose} title={sent ? undefined : t('panic.emergencyAlertTitle')}>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-4 text-center"
            >
              <CheckCircle2 size={44} className="text-emerald-500" />
              <p className="mt-3 font-semibold text-slate-900">{t('panic.alertSentTitle')}</p>
              <p className="mt-1 text-sm text-slate-500">
                {t('panic.alertSentMessage')}
              </p>
              <Button className="mt-5 w-full" onClick={handleClose}>
                {t('panic.close')}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm text-slate-600">
                {t('panic.confirmMessage', { brand: 'Book My Carer' })}
              </p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  {t('panic.cancel')}
                </Button>
                <Button variant="danger" className="flex-1" onClick={handleTrigger}>
                  {t('panic.sendAlert')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  )
}
