import { useEffect, useState } from 'react'
import { fetchLocationImage } from '../../lib/geocoding'
import type { BannerTheme, Trip } from '../../types'

interface TripBannerProps {
  trip: Trip
  bannerTheme: BannerTheme
  className?: string
}

export function TripBanner({ trip, bannerTheme, className = 'h-full w-full object-cover grayscale-[20%]' }: TripBannerProps) {
  const [src, setSrc] = useState(trip.image_url ?? '')
  const [loading, setLoading] = useState(!trip.image_url)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      const img = await fetchLocationImage(
        trip.destination_name,
        bannerTheme,
        trip.country_code ?? undefined,
      )
      if (!cancelled) {
        setSrc(img)
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [trip.destination_name, trip.country_code, bannerTheme])

  if (loading && !src) {
    return <div className={`${className} animate-pulse bg-gray-200 dark:bg-neutral-800`} />
  }

  return (
    <img
      src={src}
      alt={trip.destination_name}
      className={className}
      onError={() => {
        fetchLocationImage(trip.destination_name, 'landmark', trip.country_code ?? undefined).then(setSrc)
      }}
    />
  )
}
