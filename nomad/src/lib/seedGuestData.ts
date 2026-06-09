const GUEST_SEED_KEY = 'nomad-guest-seeded'

export function hasGuestSeed(): boolean {
  return localStorage.getItem(GUEST_SEED_KEY) === '1'
}

export function seedGuestData() {
  if (hasGuestSeed()) return

  const tripMontreal = 'trip-montreal'
  const tripBarcelona = 'trip-barcelona'

  const data = {
    bannerTheme: 'landmark',
    trips: [
      {
        id: tripMontreal,
        user_id: 'guest-user-id',
        destination_name: 'Montreal',
        start_date: '2026-06-10',
        end_date: '2026-06-19',
        lat_long: { lat: 45.5017, lng: -73.5673, display_name: 'Montreal, Quebec, Canada' },
        image_url: 'https://images.unsplash.com/photo-1519172366-7eecced21468?w=800&q=80',
        country_code: 'CA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: tripBarcelona,
        user_id: 'guest-user-id',
        destination_name: 'Barcelona, Spain',
        start_date: '2026-05-01',
        end_date: '2026-05-07',
        lat_long: { lat: 41.3874, lng: 2.1686, display_name: 'Barcelona, Spain' },
        image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
        country_code: 'ES',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    closet: [
      { id: 'c1', user_id: 'guest-user-id', item_name: 'Hoodie', category: 'clothing', created_at: new Date().toISOString() },
      { id: 'c2', user_id: 'guest-user-id', item_name: 'Jeans', category: 'clothing', created_at: new Date().toISOString() },
      { id: 'c3', user_id: 'guest-user-id', item_name: 'Socks (5 pairs)', category: 'clothing', created_at: new Date().toISOString() },
      { id: 'c4', user_id: 'guest-user-id', item_name: 'T-shirt', category: 'clothing', created_at: new Date().toISOString() },
      { id: 'c5', user_id: 'guest-user-id', item_name: 'Rain jacket', category: 'clothing', created_at: new Date().toISOString() },
      { id: 'c6', user_id: 'guest-user-id', item_name: 'Hiking boots', category: 'footwear', created_at: new Date().toISOString() },
      { id: 'c7', user_id: 'guest-user-id', item_name: 'Sandals', category: 'footwear', created_at: new Date().toISOString() },
      { id: 'c8', user_id: 'guest-user-id', item_name: 'Phone charger', category: 'tech', created_at: new Date().toISOString() },
      { id: 'c9', user_id: 'guest-user-id', item_name: 'Toothbrush', category: 'toiletry', created_at: new Date().toISOString() },
    ],
    tripItems: [
      { id: 'ti1', trip_id: tripMontreal, item_name: 'Nice outfit', is_packed: false, is_suggested: true, category: 'formal', created_at: new Date().toISOString() },
      { id: 'ti2', trip_id: tripMontreal, item_name: 'T-shirt', is_packed: false, is_suggested: false, category: 'clothing', created_at: new Date().toISOString() },
      { id: 'ti3', trip_id: tripMontreal, item_name: 'Rain jacket', is_packed: true, is_suggested: true, category: 'clothing', created_at: new Date().toISOString() },
      { id: 'ti4', trip_id: tripMontreal, item_name: 'Hiking boots', is_packed: false, is_suggested: true, category: 'footwear', created_at: new Date().toISOString() },
      { id: 'ti5', trip_id: tripMontreal, item_name: 'Water bottle', is_packed: false, is_suggested: true, category: 'accessory', created_at: new Date().toISOString() },
      { id: 'ti6', trip_id: tripMontreal, item_name: 'Umbrella', is_packed: false, is_suggested: true, category: 'accessory', created_at: new Date().toISOString() },
      { id: 'ti7', trip_id: tripMontreal, item_name: 'Camera', is_packed: false, is_suggested: true, category: 'tech', created_at: new Date().toISOString() },
      { id: 'ti8', trip_id: tripMontreal, item_name: 'Comfortable shoes', is_packed: false, is_suggested: true, category: 'footwear', created_at: new Date().toISOString() },
      { id: 'ti9', trip_id: tripMontreal, item_name: 'Sunscreen', is_packed: false, is_suggested: true, category: 'toiletry', created_at: new Date().toISOString() },
      { id: 'ti10', trip_id: tripMontreal, item_name: 'Portable charger', is_packed: true, is_suggested: true, category: 'tech', created_at: new Date().toISOString() },
    ],
    itinerary: [
      { id: 'it1', trip_id: tripMontreal, activity_name: 'Explore Old Montreal', category: 'sightseeing', date: '2026-06-10', time: '14:00', booking_url: null, created_at: new Date().toISOString() },
      { id: 'it2', trip_id: tripMontreal, activity_name: 'Dinner at Toqué!', category: 'formal', date: '2026-06-11', time: '19:00', booking_url: null, created_at: new Date().toISOString() },
      { id: 'it3', trip_id: tripMontreal, activity_name: 'Shopping on Rue Saint-Catherine', category: 'sightseeing', date: '2026-06-12', time: '11:00', booking_url: null, created_at: new Date().toISOString() },
      { id: 'it4', trip_id: tripMontreal, activity_name: 'Visit the Montreal Museum of Fine Arts', category: 'sightseeing', date: '2026-06-13', time: '10:00', booking_url: null, created_at: new Date().toISOString() },
      { id: 'it5', trip_id: tripMontreal, activity_name: 'Royal Mountain Hiking', category: 'hiking', date: '2026-06-14', time: '08:00', booking_url: null, created_at: new Date().toISOString() },
      { id: 'it6', trip_id: tripBarcelona, activity_name: 'Sagrada Família Tour', category: 'sightseeing', date: '2026-05-02', time: '10:00', booking_url: null, created_at: new Date().toISOString() },
    ],
  }

  localStorage.setItem('nomad-demo-data', JSON.stringify(data))
  localStorage.setItem(GUEST_SEED_KEY, '1')
}
