import { useEffect, useState } from 'react'
import { Sparkles, X, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { generateItineraryFromQuiz } from '../../lib/activities'
import type { ActivityCategory } from '../../types'

interface ItineraryQuizProps {
  open: boolean
  onClose: () => void
  startDate: string
  endDate: string
  destination?: string
  onComplete: (entries: { activity_name: string; category: ActivityCategory; date: string; time: string }[]) => void | Promise<void>
}

const STEPS = [
  {
    id: 'style',
    question: 'What kind of traveler are you?',
    options: [
      { value: 'explorer', label: 'Explorer', hint: 'See everything the destination offers' },
      { value: 'relaxer', label: 'Relaxer', hint: 'Slow pace, less stress' },
      { value: 'adventurer', label: 'Adventurer', hint: 'Thrills and the outdoors' },
    ],
  },
  {
    id: 'pace',
    question: 'How packed should your days be?',
    options: [
      { value: 'relaxed', label: 'Relaxed', hint: '1 activity per day' },
      { value: 'moderate', label: 'Moderate', hint: '2 activities per day' },
      { value: 'packed', label: 'Packed', hint: '3+ activities per day' },
    ],
  },
  {
    id: 'interests',
    question: 'What interests you?',
    subtitle: 'Pick as many as you like',
    multi: true,
    options: [
      { value: 'nature', label: 'Nature & Outdoors' },
      { value: 'culture', label: 'Culture & History' },
      { value: 'adventure', label: 'Adventure Sports' },
      { value: 'relaxation', label: 'Beach & Relaxation' },
      { value: 'nightlife', label: 'Nightlife & Dining' },
      { value: 'business', label: 'Business & Networking' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your budget style?',
    options: [
      { value: 'budget', label: 'Budget-friendly', hint: 'Free walks, markets, and local gems' },
      { value: 'moderate', label: 'Moderate', hint: 'Mix of tours and experiences' },
      { value: 'luxury', label: 'Luxury', hint: 'Fine dining, spas, and premium tours' },
    ],
  },
]

export function ItineraryQuiz({ open, onClose, startDate, endDate, destination, onComplete }: ItineraryQuizProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [generating, setGenerating] = useState(false)

  const current = STEPS[step]
  const tripDays = Math.max(
    1,
    Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
  )

  useEffect(() => {
    if (!open) {
      setStep(0)
      setAnswers({})
      setGenerating(false)
    }
  }, [open])

  if (!open) return null

  const select = (value: string) => {
    if (current.multi) {
      const existing = (answers.interests as string[]) ?? []
      const next = existing.includes(value) ? existing.filter((v) => v !== value) : [...existing, value]
      setAnswers({ ...answers, interests: next })
    } else {
      setAnswers({ ...answers, [current.id]: value })
    }
  }

  const selected = current.multi
    ? ((answers.interests as string[]) ?? [])
    : [answers[current.id] as string].filter(Boolean)

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      return
    }

    setGenerating(true)
    const entries = generateItineraryFromQuiz(
      {
        travelStyle: (answers.style as string) ?? 'explorer',
        pace: (answers.pace as string) ?? 'moderate',
        interests: (answers.interests as string[])?.length ? (answers.interests as string[]) : ['culture'],
        budget: (answers.budget as string) ?? 'moderate',
      },
      startDate,
      tripDays,
      destination,
    )

    await onComplete(entries)
    setGenerating(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl border border-gray-200 bg-white shadow-xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              <Sparkles size={18} className="text-black" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-black">Trip Quiz</h3>
              <p className="text-xs text-gray-500">Build your perfect itinerary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={generating}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="mb-4 flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-black' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {generating ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-gray-400" />
              <p className="font-semibold text-black">Building your itinerary...</p>
              <p className="mt-1 text-sm text-gray-500">
                Planning {tripDays} day{tripDays !== 1 ? 's' : ''} in {destination ?? 'your destination'}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-1 font-semibold text-black">{current.question}</p>
              {'subtitle' in current && current.subtitle && (
                <p className="mb-4 text-sm text-gray-500">{current.subtitle}</p>
              )}
              {!('subtitle' in current) && <div className="mb-4" />}

              <div className="space-y-2">
                {current.options.map((opt) => {
                  const isSelected = selected.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      onClick={() => select(opt.value)}
                      className={`w-full rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <p className="text-sm font-medium">{opt.label}</p>
                      {'hint' in opt && opt.hint && (
                        <p className={`mt-0.5 text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                          {opt.hint}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {!generating && (
          <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={selected.length === 0} className="flex-1">
              {step < STEPS.length - 1 ? 'Next' : 'Generate Itinerary'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
