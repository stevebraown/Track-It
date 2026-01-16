import React, { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { CheckSquare, BarChart3, Settings, Moon, Sun, Timer, ChevronLeft } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { path: '/', label: 'Timer', icon: Timer },
    { path: '/habits', label: 'Tasks', icon: CheckSquare },
    { path: '/history', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  const activeItem = navItems.find((item) => item.path === location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-[var(--bg-primary)]/90 border-b border-[var(--border-color)] sticky top-0 z-50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center hover:shadow-[var(--card-shadow-hover)]"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
                </button>
              )}
              <div>
                <p className="text-small uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Track It
                </p>
                <h1 className="text-h2 font-bold">
                  {activeItem?.label ?? 'Overview'}
                </h1>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center hover:shadow-[var(--card-shadow-hover)]"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[var(--text-primary)]" />
              ) : (
                <Sun className="w-5 h-5 text-[var(--text-primary)]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)]/95 border-t border-[var(--border-color)] backdrop-blur z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="grid grid-cols-4 gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 rounded-16 px-2 py-2 transition-all ${
                    isActive
                      ? 'text-white bg-[var(--accent-gradient)] shadow-[var(--accent-shadow)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                  }`}
                >
                  {React.createElement(item.icon, {
                    className: `w-5 h-5 ${isActive ? 'text-white' : 'text-[var(--text-secondary)]'}`,
                  })}
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
