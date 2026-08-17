export const STATUS_TONE = {
  pending: 'warning',
  confirmed: 'accent',
  'in-progress': 'accent',
  completed: 'success',
  cancelled: 'danger',
}

// Values are i18next translation keys (not display text) — resolve with t(STATUS_LABEL[status])
// at render time. The object KEYS above/below must stay in English; they're used in comparisons.
export const STATUS_LABEL = {
  pending: 'bookingStatus.pending',
  confirmed: 'bookingStatus.confirmed',
  'in-progress': 'bookingStatus.inProgress',
  completed: 'bookingStatus.completed',
  cancelled: 'bookingStatus.cancelled',
}
