import { HeartHandshake } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <HeartHandshake size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Book My Carers</p>
            <p className="text-xs text-slate-400">Care you can trust, at home.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-2 font-medium text-slate-800">Care Type</p>
            <ul className="space-y-1.5 text-slate-500">
              <li>Aged Care</li>
              <li>Personal Care</li>
              <li>Nursing Services</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-slate-800">Services</p>
            <ul className="space-y-1.5 text-slate-500">
              <li>Domestic Assistance</li>
              <li>Social Companionship</li>
              <li>Transport Assistance</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-slate-800">Company</p>
            <ul className="space-y-1.5 text-slate-500">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-100 px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Book My Carers. All rights reserved.
      </div>
    </footer>
  )
}
