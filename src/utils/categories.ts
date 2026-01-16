import { HabitCategory } from '../types'

export const HABIT_CATEGORIES: Array<{
  value: HabitCategory
  label: string
  color: string
  icon: string
}> = [
  { value: 'health', label: 'Health', color: '#10B981', icon: 'HL' },
  { value: 'fitness', label: 'Fitness', color: '#F59E0B', icon: 'FT' },
  { value: 'learning', label: 'Learning', color: '#3B82F6', icon: 'LR' },
  { value: 'productivity', label: 'Productivity', color: '#8B5CF6', icon: 'PR' },
  { value: 'social', label: 'Social', color: '#EC4899', icon: 'SO' },
  { value: 'mindfulness', label: 'Mindfulness', color: '#14B8A6', icon: 'MN' },
  { value: 'creativity', label: 'Creativity', color: '#F97316', icon: 'CR' },
  { value: 'finance', label: 'Finance', color: '#06B6D4', icon: 'FN' },
  { value: 'sleep', label: 'Sleep', color: '#6366F1', icon: 'SL' },
  { value: 'nutrition', label: 'Nutrition', color: '#84CC16', icon: 'NU' },
  { value: 'reading', label: 'Reading', color: '#A855F7', icon: 'RD' },
  { value: 'hobby', label: 'Hobby', color: '#EAB308', icon: 'HB' },
]

export const CATEGORY_COLORS: Record<HabitCategory, string> = HABIT_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.value] = category.color
    return acc
  },
  {} as Record<HabitCategory, string>
)

export function getCategoryLabel(category: HabitCategory): string {
  return HABIT_CATEGORIES.find((c) => c.value === category)?.label ?? 'Habit'
}

export function getCategoryIcon(category: HabitCategory): string {
  return HABIT_CATEGORIES.find((c) => c.value === category)?.icon ?? 'ST'
}
