import { ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 200)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div
      className={`transition-opacity duration-200 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  )
}
