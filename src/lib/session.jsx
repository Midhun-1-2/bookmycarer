import { createContext, useContext, useEffect, useState } from 'react'
import { usersApi, staffApi, adminsApi, bookingsApi } from './mockApi'

const SESSION_KEY = 'bmc:session'
const SessionContext = createContext(null)

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

// Gives every newly-registered care seeker 3 sample bookings so their
// "My Bookings" section isn't empty the first time they log in.
async function seedStarterBookings(account) {
  const address = [account.area, account.city].filter(Boolean).join(', ') || 'Address on file'
  const starterBookings = [
    {
      id: `booking-${account.id}-1`,
      userId: account.id,
      categoryId: 'cat-elder-disability',
      serviceId: 'svc-elder-companion-care',
      serviceName: 'Elder Companion Care',
      staffId: 'staff-4',
      scheduleType: 'weekly',
      startDate: '2026-07-15',
      time: '09:00',
      address,
      contactName: account.name,
      contactPhone: account.phone,
      emergencyContact: '',
      careTags: ['Mobility Assistance'],
      status: 'confirmed',
      payment: { status: 'paid', amount: 1200 },
      checkInOtp: null,
      checkIn: null,
      checkOut: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: `booking-${account.id}-2`,
      userId: account.id,
      categoryId: 'cat-nursing-clinical',
      serviceId: 'svc-post-operative-care',
      serviceName: 'Post-Operative Care',
      staffId: 'staff-2',
      scheduleType: 'daily',
      startDate: '2026-06-20',
      time: '18:00',
      address,
      contactName: account.name,
      contactPhone: account.phone,
      emergencyContact: '',
      careTags: ['Post-Surgery'],
      status: 'completed',
      payment: { status: 'paid', amount: 3600 },
      checkInOtp: null,
      checkIn: '2026-06-20T18:05:00Z',
      checkOut: '2026-06-20T19:00:00Z',
      createdAt: '2026-06-18T09:00:00Z',
    },
    {
      id: `booking-${account.id}-3`,
      userId: account.id,
      categoryId: 'cat-personal-daily-living',
      serviceId: 'svc-personal-hygiene-grooming',
      serviceName: 'Personal Hygiene & Grooming',
      staffId: 'staff-1',
      scheduleType: 'hourly',
      startDate: '2026-08-05',
      time: '08:00',
      address,
      contactName: account.name,
      contactPhone: account.phone,
      emergencyContact: '',
      careTags: [],
      status: 'pending',
      payment: { status: 'pending', amount: 300 },
      checkInOtp: null,
      checkIn: null,
      checkOut: null,
      createdAt: new Date().toISOString(),
    },
  ]
  for (const booking of starterBookings) {
    await bookingsApi.create(booking)
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  useEffect(() => {
    saveSession(session)
  }, [session])

  async function loginUser(phone, name) {
    const users = await usersApi.list()
    let account = users.find((u) => u.phone === phone)
    if (!account) {
      account = { id: `user-${Date.now()}`, name: name || 'New Care Seeker', phone, city: '', area: '' }
      await usersApi.create(account)
      await seedStarterBookings(account)
    }
    const next = { id: account.id, name: account.name, phone, role: 'user' }
    setSession(next)
    return { ok: true, session: next }
  }

  async function loginStaff(phone) {
    const staff = await staffApi.list()
    const account = staff.find((s) => s.phone === phone)
    if (!account) {
      return { ok: false, message: 'No staff account found for this number. Ask your Admin to create one.' }
    }
    const next = { id: account.id, name: account.name, phone, role: 'staff' }
    setSession(next)
    return { ok: true, session: next }
  }

  async function loginAdmin(phone, expectedRole) {
    const admins = await adminsApi.list()
    const account = admins.find((a) => a.phone === phone && a.role === expectedRole)
    if (!account) {
      const label = expectedRole === 'super-admin' ? 'Super Admin' : 'Admin'
      return { ok: false, message: `No ${label} account found for this number.` }
    }
    const next = { id: account.id, name: account.name, phone, role: account.role }
    setSession(next)
    return { ok: true, session: next }
  }

  function logout() {
    setSession(null)
  }

  const value = { session, loginUser, loginStaff, loginAdmin, logout }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
