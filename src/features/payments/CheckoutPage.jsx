import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Smartphone, Landmark, CheckCircle2, IndianRupee } from 'lucide-react'
import { bookingsApi, staffApi, payForBooking } from '../../lib/mockApi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'netbanking', label: 'Netbanking', icon: Landmark },
]

export default function CheckoutPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [staffName, setStaffName] = useState('')
  const [method, setMethod] = useState('upi')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    async function load() {
      const b = await bookingsApi.get(bookingId)
      setBooking(b)
      if (b?.staffId) {
        const s = await staffApi.get(b.staffId)
        setStaffName(s?.name ?? '')
      }
    }
    load()
  }, [bookingId])

  async function handlePay() {
    setStatus('processing')
    await new Promise((r) => setTimeout(r, 1400))
    await payForBooking(bookingId, booking.payment.amount)
    setStatus('success')
  }

  if (!booking) return null

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Complete payment</h1>
      <p className="mt-1 text-sm text-slate-500">Secured by Razorpay (simulated for this prototype).</p>

      <Card className="mt-6" animate={false}>
        <div className="flex items-center justify-between border-b border-brand-50 pb-3">
          <div>
            <p className="text-sm font-medium text-slate-900">{booking.serviceName}</p>
            <p className="text-xs text-slate-500">Caregiver: {staffName || 'Assigned'}</p>
          </div>
          <p className="flex items-center text-lg font-semibold text-brand-700">
            <IndianRupee size={16} />
            {booking.payment.amount}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-6 text-center"
            >
              <CheckCircle2 size={44} className="text-emerald-500" />
              <p className="mt-3 font-semibold text-slate-900">Payment successful</p>
              <p className="mt-1 text-sm text-slate-500">
                A WhatsApp confirmation and invoice have been sent to your registered number.
              </p>
              <Button className="mt-5 w-full" onClick={() => navigate(`/user/bookings/${bookingId}`)}>
                View booking
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Choose payment method
              </p>
              <div className="space-y-2">
                {METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition-colors ${
                      method === id
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-brand-100 text-slate-600 hover:bg-brand-50'
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                ))}
              </div>
              <Button
                className="mt-5 w-full"
                size="lg"
                onClick={handlePay}
                disabled={status === 'processing'}
              >
                {status === 'processing' ? 'Processing…' : `Pay ₹${booking.payment.amount}`}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
