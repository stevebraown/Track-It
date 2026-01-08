import React, { useState, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Calendar, CheckSquare, BarChart3, Settings, Moon, Sun, Menu, X } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Today', icon: Calendar },
    { path: '/habits', label: 'Habits', icon: CheckSquare },
    { path: '/history', label: 'History', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-h2 font-bold">Track It</h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-4 text-small font-medium transition-all duration-150 ${
                      location.pathname === item.path
                        ? 'bg-primary text-white shadow-sm scale-105'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] active:scale-95'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-4 hover:bg-[var(--bg-primary)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-[var(--text-primary)]" />
                ) : (
                  <Sun className="w-5 h-5 text-[var(--text-primary)]" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-4 hover:bg-[var(--bg-primary)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-[var(--text-primary)]" />
                ) : (
                  <Sun className="w-5 h-5 text-[var(--text-primary)]" />
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-4 hover:bg-[var(--bg-primary)] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[var(--text-primary)]" />
                ) : (
                  <Menu className="w-5 h-5 text-[var(--text-primary)]" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 border-t border-[var(--border-color)] pt-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-8 text-body transition-all duration-150 flex items-center gap-3 ${
                      location.pathname === item.path
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)] active:scale-95'
                    }`}
                  >
                    {React.createElement(item.icon, {
                      className: `w-5 h-5 ${location.pathname === item.path ? 'text-white' : 'text-[var(--text-primary)]'}`,
                    })}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  )
}
