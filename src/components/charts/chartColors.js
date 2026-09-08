// Chart colours, kept in sync by hand with the @theme scales in src/index.css
// (Recharts needs literal colours, it can't read Tailwind classes).

export const AXIS = {
  grid: '#f3f1f1', // slate-100
  line: '#e6e3e3', // slate-200
  tick: '#a49e9e', // slate-400
  tickStrong: '#5a5354', // slate-600
  cursor: '#f3f1f1', // slate-100
}

export const BRAND = '#dd222b' // brand-600
export const BRAND_SOFT = '#e86e75' // brand-400

// Categorical series: brand red first, then ink/gold/maroon so a chart stays
// on-brand without turning into a wall of red.
export const CATEGORICAL = ['#dd222b', '#4d4546', '#f2a91f', '#e86e75', '#7f1b20', '#b0a9a9']

export const STATUS_COLORS = {
  pending: '#f2a91f', // gold-500
  confirmed: '#4d4546', // accent-600 (ink)
  'in-progress': '#dd222b', // brand-600
  completed: '#3f9d6b',
  cancelled: '#7f1b20', // brand-800
  unattended: '#e07b39',
}
