const CATEGORY_PHOTO_IDS = {
  HeartHandshake: 'photo-1543333995-a78aea2eee50', // Aged Care — caregiver assisting senior at home
  HandHeart: 'photo-1587556930720-58ec521056a5', // Personal Care — caregiver helping with daily living
  Stethoscope: 'photo-1691139601099-932c01ec198b', // Nursing Services — nurse checking senior's vitals
  Sparkles: 'photo-1563453392212-326f5e854473', // Domestic Assistance — home cleaning supplies
  Car: 'photo-1764006145420-df3006edf060', // Companionship & Travel — caregiver on an outdoor outing
}

export const HERO_PHOTO_URL =
  'https://images.unsplash.com/photo-1765896387387-0538bc9f997e?w=900&q=80&auto=format&fit=crop'

export function getCategoryPhotoUrl(iconName, { w = 600, q = 75 } = {}) {
  const id = CATEGORY_PHOTO_IDS[iconName] ?? CATEGORY_PHOTO_IDS.HeartHandshake
  return `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`
}
