import { HeartHandshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="mt-auto border-t border-brand-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <HeartHandshake size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Book My Carers</p>
            <p className="text-xs text-slate-400">{t('footer.tagline')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-2 font-medium text-slate-800">{t('footer.careType')}</p>
            <ul className="space-y-1.5 text-slate-500">
              <li>{t('footer.agedCare')}</li>
              <li>{t('footer.personalCare')}</li>
              <li>{t('footer.nursingServices')}</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-slate-800">{t('footer.services')}</p>
            <ul className="space-y-1.5 text-slate-500">
              <li>{t('footer.domesticAssistance')}</li>
              <li>{t('footer.socialCompanionship')}</li>
              <li>{t('footer.transportAssistance')}</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-slate-800">{t('footer.company')}</p>
            <ul className="space-y-1.5 text-slate-500">
              <li>{t('footer.aboutUs')}</li>
              <li>{t('footer.careers')}</li>
              <li>{t('footer.contact')}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-100 px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </div>
    </footer>
  )
}
