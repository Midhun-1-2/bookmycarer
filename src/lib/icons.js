import {
  HeartHandshake,
  HandHeart,
  Stethoscope,
  Sparkles,
  Car,
} from 'lucide-react'

export const CATEGORY_ICONS = {
  HeartHandshake,
  HandHeart,
  Stethoscope,
  Sparkles,
  Car,
}

export function getCategoryIcon(name) {
  return CATEGORY_ICONS[name] ?? HeartHandshake
}
