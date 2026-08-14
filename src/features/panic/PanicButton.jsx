import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function PanicButton() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)

  function handleClose() {
    setOpen(false)
    setTimeout(() => setSent(false), 300)
  }

  function handleTrigger() {
    setSent(true)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40"
        aria-label="Emergency alert"
      >
        <AlertTriangle size={22} />
      </motion.button>

      <Modal open={open} onClose={handleClose} title={sent ? undefined : 'Emergency Alert'}>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-4 text-center"
            >
              <CheckCircle2 size={44} className="text-emerald-500" />
              <p className="mt-3 font-semibold text-slate-900">Alert sent</p>
              <p className="mt-1 text-sm text-slate-500">
                Our support team and your emergency contact have been notified with your last known
                location. Stay safe — someone will reach out shortly.
              </p>
              <Button className="mt-5 w-full" onClick={handleClose}>
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm text-slate-600">
                This will immediately notify Book My Carers support and your registered emergency
                contact that you need help. Only use this in a genuine emergency.
              </p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" onClick={handleTrigger}>
                  Send alert
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  )
}
