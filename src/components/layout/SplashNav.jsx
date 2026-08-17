import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Menu, X, HeartHandshake, MapPin, LogIn } from 'lucide-react'
import { categoriesApi } from '../../lib/mockApi'
import { getCategoryIcon } from '../../lib/icons'
import { useSession } from '../../lib/session'
import { ROLE_HOME } from '../../app/roleConfig'
import Button from '../ui/Button'
import LanguageSwitcher from './LanguageSwitcher'

const LOCATIONS = ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Bengaluru', 'Chennai', 'Mumbai']

export default function SplashNav() {
  const { t } = useTranslation()
  const categories = categoriesApi.listSync()
  const { session } = useSession()
  const [servicesOpen, setServicesOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <HeartHandshake size={18} />
          </div>
          <span className="text-base font-semibold text-slate-900">Book My Carers</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`
            }
            end
          >
            {t('nav.home')}
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700">
              {t('nav.careTypeServices')}
              <ChevronDown size={15} className={servicesOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-full z-50 mt-2 w-[640px] -translate-x-1/2 rounded-2xl border border-brand-100 bg-white p-5 shadow-xl shadow-brand-900/10"
                >
                  <div className="grid grid-cols-3 gap-4">
                    {categories.map((cat) => {
                      const Icon = getCategoryIcon(cat.icon)
                      return (
                        <div key={cat.id}>
                          <Link
                            to={`/services/${cat.slug}`}
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-brand-700"
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                              <Icon size={14} />
                            </span>
                            {cat.name}
                          </Link>
                          <ul className="space-y-1">
                            {cat.services.slice(0, 3).map((s) => (
                              <li key={s.id}>
                                <Link
                                  to={`/services/${cat.slug}`}
                                  className="block truncate text-xs text-slate-500 hover:text-brand-600"
                                >
                                  {s.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setLocationOpen(true)}
            onMouseLeave={() => setLocationOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700">
              <MapPin size={14} />
              {t('nav.location')}
              <ChevronDown size={15} className={locationOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
            <AnimatePresence>
              {locationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-brand-100 bg-white p-2 shadow-xl shadow-brand-900/10"
                >
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {loc}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          {session ? (
            <Link to={ROLE_HOME[session.role]}>
              <Button size="sm" variant="secondary">
                {t('nav.dashboard')}
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login/staff">
                <Button size="sm" variant="outline">
                  {t('nav.caregiverLogin')}
                </Button>
              </Link>
              <Link to="/login/user">
                <Button size="sm" variant="primary">
                  <LogIn size={16} />
                  {t('nav.loginBookNow')}
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label={t('sidebar.openMenu')}
        >
          <Menu size={22} />
        </button>
      </div>
    </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-brand-950/40" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">{t('sidebar.menu')}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-brand-50"
                  aria-label={t('sidebar.closeMenu')}
                >
                  <X size={18} />
                </button>
              </div>

              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('nav.home')}
              </Link>

              <button
                onClick={() => setMobileSection(mobileSection === 'services' ? null : 'services')}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('nav.careTypeServices')}
                <ChevronDown size={16} className={mobileSection === 'services' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              <AnimatePresence>
                {mobileSection === 'services' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-3"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/services/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setMobileSection(mobileSection === 'location' ? null : 'location')}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {t('nav.location')}
                <ChevronDown size={16} className={mobileSection === 'location' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              <AnimatePresence>
                {mobileSection === 'location' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-3"
                  >
                    {LOCATIONS.map((loc) => (
                      <p key={loc} className="rounded-lg px-3 py-2 text-sm text-slate-600">
                        {loc}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-3">
                <LanguageSwitcher />
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {session ? (
                  <Link to={ROLE_HOME[session.role]} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" variant="secondary">
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login/user" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full" variant="primary">
                        {t('nav.loginBookNow')}
                      </Button>
                    </Link>
                    <Link to="/login/staff" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full" variant="outline">
                        {t('nav.caregiverLogin')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
