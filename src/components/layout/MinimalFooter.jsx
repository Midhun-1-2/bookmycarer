import { useTranslation } from 'react-i18next'

export default function MinimalFooter() {
  const { t } = useTranslation()
  return (
    <footer className="mt-auto border-t border-brand-100 bg-white px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
      <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      <p className="mt-0.5">{t('footer.poweredBy')}</p>
    </footer>
  )
}
