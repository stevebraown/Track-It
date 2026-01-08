import { useEffect } from 'react'
import { useHabitStore } from '../stores'
import { checkAndSendReminders } from '../utils/habitReminders'

/**
 * Component that checks for habit reminders periodically
 * This runs in the background to send notifications
 */
export default function ReminderChecker() {
  const habits = useHabitStore((state) => state.habits)

  useEffect(() => {
    // Check immediately on load
    checkAndSendReminders(habits)

    // Check every minute for reminders
    const interval = setInterval(() => {
      checkAndSendReminders(habits)
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [habits])

  return null // This component doesn't render anything
}
