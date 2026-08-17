import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Users, FolderKanban, ClipboardList, IndianRupee, ArrowRight } from 'lucide-react'
import { staffApi, categoriesApi, bookingsApi } from '../../lib/mockApi'
import { revenueByDay, bookingsByCategory, bookingsByStatus, bookingsByStaff } from '../../lib/chartData'
import Card from '../../components/ui/Card'
import RevenueTrendChart from '../../components/charts/RevenueTrendChart'
import CategoryDonutChart from '../../components/charts/CategoryDonutChart'
import StatusBarChart from '../../components/charts/StatusBarChart'
import StaffBarChart from '../../components/charts/StaffBarChart'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [charts, setCharts] = useState(null)

  useEffect(() => {
    async function load() {
      const [staff, categories, bookings] = await Promise.all([
        staffApi.list(),
        categoriesApi.list(),
        bookingsApi.list(),
      ])
      const revenue = bookings
        .filter((b) => b.payment.status === 'paid')
        .reduce((sum, b) => sum + b.payment.amount, 0)
      setStats({
        staffCount: staff.length,
        categoryCount: categories.length,
        pendingBookings: bookings.filter((b) => b.status === 'pending').length,
        totalBookings: bookings.length,
        revenue,
      })
      setCharts({
        revenue: revenueByDay(bookings, 14),
        byCategory: bookingsByCategory(bookings, categories),
        byStatus: bookingsByStatus(bookings),
        byStaff: bookingsByStaff(bookings, staff),
      })
    }
    load()
  }, [])

  if (!stats || !charts) return null

  const cards = [
    { label: t('adminDashboard.staffAccounts'), value: stats.staffCount, icon: Users, to: '/admin/staff' },
    { label: t('adminDashboard.serviceCategories'), value: stats.categoryCount, icon: FolderKanban, to: '/admin/categories' },
    { label: t('adminDashboard.pendingBookings'), value: stats.pendingBookings, icon: ClipboardList, to: '/admin/bookings' },
    { label: t('adminDashboard.revenueCollected'), value: `₹${stats.revenue}`, icon: IndianRupee, to: '/admin/bookings' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{t('adminDashboard.title')}</h1>
      <p className="mt-1 text-sm text-slate-500">{t('adminDashboard.subtitle')}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="transition-shadow hover:shadow-md hover:shadow-brand-900/10">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Icon size={19} />
                </div>
                <ArrowRight size={15} className="text-brand-300" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">{t('adminDashboard.revenueLast14Days')}</h3>
          <RevenueTrendChart data={charts.revenue} />
        </Card>
        <Card animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">{t('adminDashboard.bookingsByCategory')}</h3>
          <CategoryDonutChart data={charts.byCategory} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">{t('adminDashboard.bookingsByStatus')}</h3>
          <StatusBarChart data={charts.byStatus} />
        </Card>
        <Card animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">{t('adminDashboard.topStaffByEngagements')}</h3>
          <StaffBarChart data={charts.byStaff} />
        </Card>
      </div>
    </div>
  )
}
