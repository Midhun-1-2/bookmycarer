import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ShieldCheck, ArrowLeft, HeartHandshake } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useSession } from '../../lib/session'
import { generateOtp } from '../../lib/mockApi'
import { ROLE_HOME, ROLE_LABEL } from '../../app/roleConfig'

const COPY = {
  user: {
    heading: 'Book trusted care at home',
    sub: 'Log in as a Care Seeker to browse services and manage bookings.',
    demoPhones: ['9700000001 (existing) or any new number'],
  },
  staff: {
    heading: 'Caregiver Staff Login',
    sub: 'Log in to view your engagements and manage check-in/out.',
    demoPhones: ['9800000001', '9800000002', '9800000003'],
  },
  admin: {
    heading: 'Admin Portal',
    sub: 'Manage staff accounts, service categories, and bookings.',
    demoPhones: ['9600000001'],
  },
  'super-admin': {
    heading: 'Super Admin Portal',
    sub: 'Full system access — manage admins, staff, and platform settings.',
    demoPhones: ['9500000001'],
  },
}

export default function LoginPage({ role }) {
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { loginUser, loginStaff, loginAdmin } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const copy = COPY[role]

  function handleSendOtp(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    const code = generateOtp()
    setSentOtp(code)
    setStep('otp')
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setError('')
    if (otp.length < 4) {
      setError('Enter the OTP sent to your phone.')
      return
    }
    setLoading(true)
    let result
    if (role === 'user') {
      result = await loginUser(phone, name)
    } else if (role === 'staff') {
      result = await loginStaff(phone)
    } else {
      result = await loginAdmin(phone, role)
    }
    setLoading(false)

    if (!result.ok) {
      setError(result.message)
      return
    }
    const dest = location.state?.from?.pathname ?? ROLE_HOME[result.session.role]
    navigate(dest, { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-brand-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <HeartHandshake size={20} />
          </div>
          <span className="text-lg font-semibold text-slate-900">Book My Carers</span>
        </Link>

        <Card className="p-6 sm:p-8" animate={false}>
          <span className="mb-3 inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
            {ROLE_LABEL[role]}
          </span>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{copy.heading}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.sub}</p>

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSendOtp}
                className="mt-6 flex flex-col gap-4"
              >
                {role === 'user' && (
                  <Input
                    label="Full name"
                    placeholder="e.g. Priya Varma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
                <Input
                  label="Mobile number"
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  error={error}
                />
                <Button type="submit" size="lg" className="mt-1">
                  <Phone size={17} />
                  Send OTP
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleVerifyOtp}
                className="mt-6 flex flex-col gap-4"
              >
                <div className="rounded-lg bg-brand-50 px-3.5 py-2.5 text-sm text-brand-700">
                  Demo OTP sent to <strong>{phone}</strong>: <strong>{sentOtp}</strong>
                </div>
                <Input
                  label="Enter OTP"
                  placeholder="4-digit code"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  error={error}
                />
                <Button type="submit" size="lg" disabled={loading}>
                  <ShieldCheck size={17} />
                  {loading ? 'Verifying…' : 'Verify & Continue'}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-brand-700"
                >
                  <ArrowLeft size={14} />
                  Change number
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {copy.demoPhones && role !== 'user' && (
            <p className="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
              Demo {ROLE_LABEL[role]} number{copy.demoPhones.length > 1 ? 's' : ''}: {copy.demoPhones.join(', ')}
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
