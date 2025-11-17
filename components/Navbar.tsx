'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'

interface NavbarProps {
  isHorizontal?: boolean
}

export default function Navbar({ isHorizontal = false }: NavbarProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Resume', path: '/resume' },
    { name: 'Contact', path: '/contact' },
    { name: 'Game', path: '/game' },
  ]

  return (
    <nav className={`${isHorizontal ? 'fixed top-0 left-0 right-0 z-50 bg-bg-secondary/80 backdrop-blur-md border-b border-accent/20' : 'fixed left-0 top-0 bottom-0 z-50 w-20 flex flex-col items-center justify-center bg-bg-secondary/80 backdrop-blur-md border-r border-accent/20'}`}>
      {isHorizontal ? (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-accent font-bold text-xl hover:text-accent-hover transition-colors">
              Portfolio
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    pathname === item.path ? 'text-accent' : 'text-text-secondary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium"
              aria-label="Toggle theme"
            >
              {theme === 'professional' ? '🎮' : '💼'}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-text-primary"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors hover:text-accent ${
                    pathname === item.path ? 'text-accent' : 'text-text-secondary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative group transition-all ${
                  pathname === item.path ? 'text-accent' : 'text-text-secondary hover:text-accent'
                }`}
                title={item.name}
              >
                <span className="text-2xl">
                  {item.name === 'Home' && '🏠'}
                  {item.name === 'About' && '👤'}
                  {item.name === 'Projects' && '💼'}
                  {item.name === 'Resume' && '📄'}
                  {item.name === 'Contact' && '📧'}
                  {item.name === 'Game' && '🎮'}
                </span>
                {pathname === item.path && (
                  <span className="absolute left-full ml-4 whitespace-nowrap text-sm bg-bg-secondary px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
          
          <button
            onClick={toggleTheme}
            className="mt-auto mb-8 text-2xl hover:scale-110 transition-transform"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'professional' ? '🎮' : '💼'}
          </button>
        </>
      )}
    </nav>
  )
}

