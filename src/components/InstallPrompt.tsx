import { usePWAInstall } from '../hooks/usePWAInstall'
import Card from './Card'
import Button from './Button'

export default function InstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWAInstall()

  if (!isInstallable || isInstalled) {
    return null
  }

  const handleInstall = async () => {
    await install()
  }

  return (
    <Card className="mb-6 bg-primary-light border-primary">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-h3 mb-1">Install Track It</h3>
          <p className="text-small text-[var(--text-secondary)]">
            Install this app on your device for a better experience. Works offline and feels like a native app!
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleInstall}>
            Install
          </Button>
        </div>
      </div>
    </Card>
  )
}
