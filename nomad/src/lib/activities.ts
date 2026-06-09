import type { ActivityCategory, ActivityOption } from '../types'

const ACTIVITY_DATABASE: ActivityOption[] = [
  {
    name: 'Mountain Hiking Trail',
    category: 'hiking',
    description: 'Guided or self-guided hikes through scenic mountain trails.',
    bookingUrl: 'https://www.getyourguide.com/s/?q=hiking',
    popular: true,
  },
  {
    name: 'Coastal Hiking',
    category: 'hiking',
    description: 'Walk cliffside paths with ocean views.',
    bookingUrl: 'https://www.viator.com/searchResults/all?text=hiking',
    popular: true,
  },
  {
    name: 'City Walking Tour',
    category: 'sightseeing',
    description: 'Explore historic neighborhoods with a local guide.',
    bookingUrl: 'https://www.getyourguide.com/s/?q=walking+tour',
    popular: true,
  },
  {
    name: 'Museum & Gallery Pass',
    category: 'sightseeing',
    description: 'Skip-the-line access to top cultural attractions.',
    bookingUrl: 'https://www.viator.com/searchResults/all?text=museum',
    popular: true,
  },
  {
    name: 'Beach Day & Water Sports',
    category: 'beach',
    description: 'Relax on the sand or try paddleboarding and kayaking.',
    bookingUrl: 'https://www.getyourguide.com/s/?q=beach+activities',
    popular: true,
  },
  {
    name: 'Snorkeling Adventure',
    category: 'swimming',
    description: 'Discover underwater marine life with equipment included.',
    bookingUrl: 'https://www.viator.com/searchResults/all?text=snorkeling',
    popular: true,
  },
  {
    name: 'Fine Dining Experience',
    category: 'dining',
    description: 'Reserve a table at acclaimed local restaurants.',
    bookingUrl: 'https://www.opentable.com/s?term=restaurants',
    popular: true,
  },
  {
    name: 'Food & Market Tour',
    category: 'dining',
    description: 'Taste local specialties at markets and street food spots.',
    bookingUrl: 'https://www.getyourguide.com/s/?q=food+tour',
    popular: true,
  },
  {
    name: 'Ski Resort Day Pass',
    category: 'skiing',
    description: 'Hit the slopes with lift tickets and equipment rental.',
    bookingUrl: 'https://www.viator.com/searchResults/all?text=skiing',
    popular: true,
  },
  {
    name: 'Business Conference',
    category: 'business',
    description: 'Attend industry events and networking sessions.',
    bookingUrl: 'https://www.eventbrite.com/d/online/business/',
  },
  {
    name: 'Formal Gala / Event',
    category: 'formal',
    description: 'Black-tie dinners, weddings, or cultural performances.',
    bookingUrl: 'https://www.ticketmaster.com/search?q=formal+event',
  },
  {
    name: 'Rooftop Bar Crawl',
    category: 'nightlife',
    description: 'Experience the city after dark at top venues.',
    bookingUrl: 'https://www.getyourguide.com/s/?q=nightlife',
    popular: true,
  },
  {
    name: 'Wilderness Camping',
    category: 'camping',
    description: 'Overnight camping in national parks or reserves.',
    bookingUrl: 'https://www.recreation.gov/',
  },
  {
    name: 'Rock Climbing',
    category: 'hiking',
    description: 'Indoor or outdoor climbing sessions for all levels.',
    bookingUrl: 'https://www.viator.com/searchResults/all?text=rock+climbing',
  },
  {
    name: 'Hot Air Balloon Ride',
    category: 'sightseeing',
    description: 'Aerial views at sunrise over stunning landscapes.',
    bookingUrl: 'https://www.getyourguide.com/s/?q=hot+air+balloon',
  },
  {
    name: 'Spa & Wellness Day',
    category: 'formal',
    description: 'Relax with massages and thermal baths.',
    bookingUrl: 'https://www.viator.com/searchResults/all?text=spa',
  },
]

export function searchActivities(query: string, destination?: string): ActivityOption[] {
  const q = query.toLowerCase().trim()
  if (!q) return ACTIVITY_DATABASE.filter((a) => a.popular)

  return ACTIVITY_DATABASE.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.category.includes(q) ||
      a.description.toLowerCase().includes(q),
  ).map((a) => ({
    ...a,
    bookingUrl: destination
      ? `${a.bookingUrl}&destination=${encodeURIComponent(destination)}`
      : a.bookingUrl,
  }))
}

export function getPopularActivities(): ActivityOption[] {
  return ACTIVITY_DATABASE.filter((a) => a.popular)
}

export interface QuizAnswer {
  travelStyle: string
  pace: string
  interests: string[]
  budget: string
}

export function generateItineraryFromQuiz(
  answers: QuizAnswer,
  startDate: string,
  tripDays: number,
): { activity_name: string; category: ActivityCategory; date: string; time: string }[] {
  const entries: { activity_name: string; category: ActivityCategory; date: string; time: string }[] = []
  const start = new Date(startDate)

  const interestMap: Record<string, ActivityCategory[]> = {
    nature: ['hiking', 'camping', 'sightseeing'],
    culture: ['sightseeing', 'dining', 'formal'],
    adventure: ['hiking', 'swimming', 'skiing'],
    relaxation: ['beach', 'dining', 'formal'],
    nightlife: ['nightlife', 'dining'],
    business: ['business', 'formal', 'dining'],
  }

  const categories = answers.interests.flatMap((i) => interestMap[i] ?? ['sightseeing'])
  const uniqueCategories = [...new Set(categories)]

  const activitiesPerDay = answers.pace === 'relaxed' ? 1 : answers.pace === 'moderate' ? 2 : 3

  for (let day = 0; day < tripDays; day++) {
    const date = new Date(start)
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]

    for (let slot = 0; slot < activitiesPerDay; slot++) {
      const cat = uniqueCategories[(day * activitiesPerDay + slot) % uniqueCategories.length]
      const match = ACTIVITY_DATABASE.find((a) => a.category === cat)
      const time = slot === 0 ? '09:00' : slot === 1 ? '14:00' : '19:00'

      entries.push({
        activity_name: match?.name ?? `${cat.charAt(0).toUpperCase() + cat.slice(1)} Activity`,
        category: cat,
        date: dateStr,
        time,
      })
    }
  }

  return entries
}
