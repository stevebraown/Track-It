import { useState, useEffect, useCallback } from 'react'
import {
  requestNotificationPermission,
  getNotificationPermission,
  scheduleNotification,
  cancelNotification,
  isNotificationSupported,
} from '../utils/notifications'

export function useNotifications() {
  const [permission, setPermission] = useState(getNotificationPermission())
  const [isSupported, setIsSupported] = useState(isNotificationSupported())

  useEffect(() => {
    setIsSupported(isNotificationSupported())
    setPermission(getNotificationPermission())
  }, [])

  const requestPermission = useCallback(async () => {
    const newPermission = await requestNotificationPermission()
    setPermission(newPermission)
    return newPermission
  }, [])

  const sendNotification = useCallback(
    async (title: string, options: NotificationOptions) => {
      if (!permission.granted) {
        console.warn('Notification permission not granted')
        return false
      }
      await scheduleNotification(title, options)
      return true
    },
    [permission]
  )

  const cancel = useCallback(async (tag: string) => {
    await cancelNotification(tag)
  }, [])

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    cancel,
  }
}
