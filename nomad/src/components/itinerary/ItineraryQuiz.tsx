import { useState } from 'react'
import { Sparkles, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { generateItineraryFromQuiz } from '../../lib/activities'
import type { ActivityCategory } from '../../types'

interface ItineraryQuizProps {
  startDate: string
  endDate: string
  onComplete: (entries: { activity_name: string; category: ActivityCategory; date: string; time: string }[]) => void
}

const STEPS = [
  {
    id: 'style',
    question: 'What kind of traveler are you?',
    options: [
      { value: 'explorer', label: 'Explorer — I want to see everything' },
      { value: 'relaxer', label: 'Relaxer — slow pace, less stress' },
      { value: 'adventurer', label: 'Adventurer — thrills and outdoors' },
    ],
  },
  {
    id: 'pace',
    question: 'How packed should your days be?',
    options: [
      { value: 'relaxed', label: 'Relaxed — 1 activity per day' },
      { value: 'moderate', label: 'Moderate — 2 activities per day' },
      { value: 'packed', label: 'Packed — 3+ activities per day' },
    ],
  },
  {
    id: 'interests',
    question: 'What interests you? (pick multiple)',
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
      { value: 'budget', label: 'Budget-friendly' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'luxury', label: 'Luxury' },
    ],
  },
]

export function ItineraryQuiz({ startDate, endDate, onComplete }: ItineraryQuizProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [open, setOpen] = useState(false)

  const current = STEPS[step]
  const tripDays = Math.max(
    1,
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  )

  const select = (value: string) => {
    if (current.multi) {
      const existing = (answers.interests as string[]) ?? []
      const next = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value]
      setAnswers({ ...answers, interests: next })
    } else {
      setAnswers({ ...answers, [current.id]: value })
    }
  }

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      const entries = generateItineraryFromQuiz(
        {
          travelStyle: (answers.style as string) ?? 'explorer',
          pace: (answers.pace as string) ?? 'moderate',
          interests: (answers.interests as string[])?.length
            ? (answers.interests as string[])
            : ['culture'],
          budget: (answers.budget as string) ?? 'moderate',
        },
        startDate,
        tripDays,
      )
      onComplete(entries)
      setOpen(false)
      setStep(0)
      setAnswers({})
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-nomad-teal/30 bg-nomad-teal/10 p-4 text-left transition-colors hover:bg-nomad-teal/20"
      >
        <Sparkles className="text-nomad-teal-light" size={24} />
        <div>
          <p className="font-semibold">Take the Trip Quiz</p>
          <p className="text-sm text-nomad-muted">Answer a few questions to auto-build your itinerary</p>
        </div>
        <ChevronRight className="ml-auto text-nomad-muted" size={20} />
      </button>
    )
  }

  const selected = current.multi
    ? ((answers.interests as string[]) ?? [])
    : [answers[current.id] as string].filter(Boolean)

  return (
    <div className="rounded-2xl border border-slate-700 bg-nomad-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Trip Quiz</h3>
        <span className="text-xs text-nomad-muted">
          {step + 1} / {STEPS.length}
        </span>
      </div>

      <p className="mb-4 text-sm">{current.question}</p>

      <div className="space-y-2">
        {current.options.map((opt) => {
          const isSelected = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? 'border-nomad-teal-light bg-nomad-teal/20 text-white'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex gap-2">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">
            Back
          </Button>
        )}
        <Button
          onClick={next}
          disabled={selected.length === 0}
          className="flex-1"
        >
          {step < STEPS.length - 1 ? 'Next' : 'Generate Itinerary'}
        </Button>
      </div>
    </div>
  )
}
