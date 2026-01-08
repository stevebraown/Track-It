/**
 * Central export for all Zustand stores
 * This makes it easy to import stores from a single location
 */

import { useHabitStore } from './useHabitStore'
import { useEntryStore } from './useEntryStore'
import { useReflectionStore } from './useReflectionStore'

export { useHabitStore } from './useHabitStore'
export { useEntryStore } from './useEntryStore'
export { useReflectionStore } from './useReflectionStore'

/**
 * Initialize all stores by loading data from localStorage
 * Call this once on app mount
 */
export function initializeStores() {
  useHabitStore.getState().loadHabits()
  useEntryStore.getState().loadEntries()
  useReflectionStore.getState().loadReflections()
}
