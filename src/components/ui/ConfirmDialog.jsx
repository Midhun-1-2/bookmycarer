import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = 'primary',
  loading,
  onConfirm,
  onClose,
}) {
  const { t } = useTranslation()
  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-sm">
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
          {cancelLabel ?? t('common.cancel')}
        </Button>
        <Button type="button" variant={tone} onClick={onConfirm} disabled={loading}>
          {confirmLabel ?? t('common.confirm')}
        </Button>
      </div>
    </Modal>
  )
}
