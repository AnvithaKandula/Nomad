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

const LUXURY_ACTIVITIES = new Set(['Fine Dining Experience', 'Hot Air Balloon Ride', 'Spa & Wellness Day', 'Ski Resort Day Pass'])
const BUDGET_ACTIVITIES = new Set([
  'City Walking Tour',
  'Food & Market Tour',
  'Coastal Hiking',
  'Beach Day & Water Sports',
])

const STYLE_BOOST: Record<string, ActivityCategory[]> = {
  explorer: ['sightseeing', 'dining', 'hiking'],
  relaxer: ['beach', 'dining', 'formal'],
  adventurer: ['hiking', 'swimming', 'camping'],
}

function getTimeForCategory(category: ActivityCategory, slot: number): string {
  if (category === 'nightlife') return '20:00'
  if (category === 'dining' && slot > 0) return '19:00'
  if (category === 'formal' && slot > 0) return '18:30'
  if (slot === 0) return '09:30'
  if (slot === 1) return '14:00'
  return '17:30'
}

function formatActivityName(name: string, destination?: string): string {
  if (!destination) return name
  return `${name} — ${destination}`
}

function buildActivityPool(answers: QuizAnswer): ActivityOption[] {
  const interestMap: Record<string, ActivityCategory[]> = {
    nature: ['hiking', 'camping', 'sightseeing'],
    culture: ['sightseeing', 'dining', 'formal'],
    adventure: ['hiking', 'swimming', 'skiing'],
    relaxation: ['beach', 'dining', 'formal'],
    nightlife: ['nightlife', 'dining'],
    business: ['business', 'formal', 'dining'],
  }

  const categories = [
    ...new Set([
      ...answers.interests.flatMap((i) => interestMap[i] ?? ['sightseeing']),
      ...(STYLE_BOOST[answers.travelStyle] ?? []),
    ]),
  ]

  let pool = ACTIVITY_DATABASE.filter((a) => categories.includes(a.category))

  if (answers.budget === 'budget') {
    const budgetPool = pool.filter((a) => BUDGET_ACTIVITIES.has(a.name))
    if (budgetPool.length > 0) pool = budgetPool
  } else if (answers.budget === 'luxury') {
    const luxuryPool = pool.filter((a) => LUXURY_ACTIVITIES.has(a.name))
    pool = luxuryPool.length > 0 ? [...luxuryPool, ...pool] : pool
  }

  return pool.length > 0 ? pool : ACTIVITY_DATABASE.filter((a) => a.popular)
}

export function generateItineraryFromQuiz(
  answers: QuizAnswer,
  startDate: string,
  tripDays: number,
  destination?: string,
): { activity_name: string; category: ActivityCategory; date: string; time: string }[] {
  const entries: { activity_name: string; category: ActivityCategory; date: string; time: string }[] = []
  const start = new Date(startDate + 'T12:00:00')
  const pool = buildActivityPool(answers)
  const activitiesPerDay = answers.pace === 'relaxed' ? 1 : answers.pace === 'moderate' ? 2 : 3
  const usedNames = new Set<string>()
  let poolIndex = 0

  const pickActivity = (day: number, slot: number): ActivityOption => {
    for (let attempt = 0; attempt < pool.length; attempt++) {
      const activity = pool[(poolIndex + attempt) % pool.length]
      const key = `${activity.name}-${day}`
      if (!usedNames.has(key)) {
        usedNames.add(key)
        poolIndex = (poolIndex + attempt + 1) % pool.length
        return activity
      }
    }
    return pool[(day * activitiesPerDay + slot) % pool.length]
  }

  for (let day = 0; day < tripDays; day++) {
    const date = new Date(start)
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]

    for (let slot = 0; slot < activitiesPerDay; slot++) {
      const activity = pickActivity(day, slot)
      entries.push({
        activity_name: formatActivityName(activity.name, destination),
        category: activity.category,
        date: dateStr,
        time: getTimeForCategory(activity.category, slot),
      })
    }
  }

  return entries
}
