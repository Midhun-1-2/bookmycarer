import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Phone, ShieldCheck, ArrowLeft, Home } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import MinimalFooter from '../../components/layout/MinimalFooter'
import { useSession } from '../../lib/session'
import { generateOtp } from '../../lib/mockApi'
import { ROLE_HOME, ROLE_LABEL } from '../../app/roleConfig'

const COPY = {
  user: {
    headingKey: 'auth.user.heading',
    subKey: 'auth.user.sub',
    demoPhones: ['9700000001 (existing) or any new number'],
  },
  staff: {
    headingKey: 'auth.staff.heading',
    subKey: 'auth.staff.sub',
    demoPhones: ['9800000001', '9800000002', '9800000003'],
  },
  admin: {
    headingKey: 'auth.admin.heading',
    subKey: 'auth.admin.sub',
    demoPhones: ['9600000001'],
  },
  'super-admin': {
    headingKey: 'auth.superAdmin.heading',
    subKey: 'auth.superAdmin.sub',
    demoPhones: ['9500000001'],
  },
}

export default function LoginPage({ role }) {
  const { t } = useTranslation()
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
      setError(t('auth.errors.invalidPhone'))
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
      setError(t('auth.errors.invalidOtp'))
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
    <div className="flex min-h-svh flex-col bg-brand-50">
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <Link
          to="/"
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-slate-500 shadow-sm shadow-brand-900/5 hover:text-brand-700 sm:left-6 sm:top-6"
        >
          <Home size={15} />
          {t('nav.home')}
        </Link>
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center justify-center">
            <img src="/brand/wordmark.png" alt="Book My Carer" className="h-14 w-auto" />
          </Link>

        <Card className="p-6 sm:p-8" animate={false}>
          <span className="mb-3 inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
            {t(ROLE_LABEL[role])}
          </span>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{t(copy.headingKey)}</h1>
          <p className="mt-1 text-sm text-slate-500">{t(copy.subKey)}</p>

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
                    label={t('auth.fullNameLabel')}
                    placeholder={t('auth.fullNamePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
                <Input
                  label={t('auth.mobileLabel')}
                  placeholder={t('auth.mobilePlaceholder')}
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  error={error}
                />
                <Button type="submit" size="lg" className="mt-1">
                  <Phone size={17} />
                  {t('auth.sendOtp')}
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
                  {t('auth.demoOtpSentPrefix')} <strong>{phone}</strong>: <strong>{sentOtp}</strong>
                </div>
                <Input
                  label={t('auth.enterOtpLabel')}
                  placeholder={t('auth.otpPlaceholder')}
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  error={error}
                />
                <Button type="submit" size="lg" disabled={loading}>
                  <ShieldCheck size={17} />
                  {loading ? t('auth.verifying') : t('auth.verifyContinue')}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-brand-700"
                >
                  <ArrowLeft size={14} />
                  {t('auth.changeNumber')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {copy.demoPhones && role !== 'user' && (
            <p className="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
              {copy.demoPhones.length > 1
                ? t('auth.demoNumbersPlural', { role: t(ROLE_LABEL[role]), numbers: copy.demoPhones.join(', ') })
                : t('auth.demoNumbersSingular', { role: t(ROLE_LABEL[role]), numbers: copy.demoPhones.join(', ') })}
            </p>
          )}
          </Card>
        </div>
      </div>
      <MinimalFooter />
    </div>
  )
}
