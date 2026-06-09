import {
  Landmark,
  Flag,
  Flower2,
  Shirt,
  Footprints,
  Laptop,
  Droplets,
  ShoppingBag,
  Package,
  Camera,
  UtensilsCrossed,
  Mountain,
  Umbrella,
  Waves,
  MapPin,
  type LucideIcon,
} from 'lucide-react'
import type { BannerTheme, ItemCategory } from '../types'

interface IconProps {
  size?: number
  className?: string
}

export const bannerThemeIcons: Record<BannerTheme, LucideIcon> = {
  landmark: Landmark,
  flag: Flag,
  national_flower: Flower2,
}

export const closetCategoryIcons: Record<ItemCategory, LucideIcon> = {
  clothing: Shirt,
  footwear: Footprints,
  tech: Laptop,
  toiletry: Droplets,
  accessory: ShoppingBag,
  other: Package,
}

const activityCategoryIcons: Record<string, LucideIcon> = {
  sightseeing: Camera,
  formal: UtensilsCrossed,
  dining: UtensilsCrossed,
  hiking: Mountain,
  beach: Umbrella,
  swimming: Waves,
  camping: Mountain,
  business: Laptop,
  nightlife: UtensilsCrossed,
  skiing: Mountain,
  default: MapPin,
}

export function ActivityCategoryIcon({
  category,
  size = 14,
  className = 'shrink-0 text-gray-500',
}: IconProps & { category: string }) {
  const Icon = activityCategoryIcons[category] ?? activityCategoryIcons.default
  return <Icon size={size} className={className} strokeWidth={1.75} />
}

export function ClosetCategoryIcon({
  category,
  size = 14,
  className = 'shrink-0 text-gray-500',
}: IconProps & { category: ItemCategory | string }) {
  const Icon = closetCategoryIcons[category as ItemCategory] ?? Package
  return <Icon size={size} className={className} strokeWidth={1.75} />
}

export function BannerThemeIcon({
  theme,
  size = 22,
  className = 'text-gray-700',
}: IconProps & { theme: BannerTheme }) {
  const Icon = bannerThemeIcons[theme]
  return <Icon size={size} className={className} strokeWidth={1.75} />
}
