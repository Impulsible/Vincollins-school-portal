/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogIn, ChevronRight, Home, Info, BookOpen, Phone, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mainNavItems } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none' // Prevent touch scrolling
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }
  }, [isMenuOpen])

  // Close menu on escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Map icons to navigation items
  const getIconForItem = (title: string) => {
    switch(title.toLowerCase()) {
      case 'home': return Home
      case 'about us': return Info
      case 'academics': return BookOpen
      case 'portal': return LogIn
      case 'contact': return Phone
      default: return ChevronRight
    }
  }

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full bg-[#0A2472] text-white transition-all duration-300',
      scrolled ? 'shadow-2xl' : 'shadow-lg'
    )}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="container relative flex h-16 sm:h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group z-10" onClick={() => setIsMenuOpen(false)}>
          <div className="relative flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md ring-2 ring-white/30 group-hover:ring-white/60 transition-all shadow-xl flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Vincollins Schools Badge"
              fill
              className="object-contain p-1.5 sm:p-2 transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="font-serif text-sm sm:text-base lg:text-xl font-bold text-white leading-none tracking-tight">
              Vincollins Schools
            </span>
            <span className="font-script text-xs sm:text-sm bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent leading-tight mt-0.5">
              Geared Towards Success
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  'hover:bg-white hover:text-[#0A2472] hover:scale-105',
                  isActive 
                    ? 'text-white bg-white/20 shadow-lg font-semibold' 
                    : 'text-white/80'
                )}
              >
                {item.title}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Login Button */}
        <div className="hidden items-center md:flex">
          <Button 
            className="relative overflow-hidden bg-white text-[#0A2472] hover:bg-secondary hover:text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white group"
            asChild
          >
            <Link href="/login" className="flex items-center gap-2.5">
              <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              <span className="text-sm tracking-wide">Portal Login</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button - Fixed Hamburger with larger touch target */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-20 touch-manipulation"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {/* Hamburger Icon */}
          <div className="relative w-6 h-6">
            {/* Top line */}
            <span 
              className={cn(
                "absolute left-0 block h-0.5 bg-white transform transition-all duration-300 ease-in-out",
                isMenuOpen 
                  ? "top-3 rotate-45 w-6" 
                  : "top-1 rotate-0 w-6"
              )}
            />
            {/* Middle line */}
            <span 
              className={cn(
                "absolute left-0 block h-0.5 bg-white transform transition-all duration-300 ease-in-out top-3",
                isMenuOpen 
                  ? "opacity-0 w-0" 
                  : "opacity-100 w-6"
              )}
            />
            {/* Bottom line */}
            <span 
              className={cn(
                "absolute left-0 block h-0.5 bg-white transform transition-all duration-300 ease-in-out",
                isMenuOpen 
                  ? "top-3 -rotate-45 w-6" 
                  : "top-5 rotate-0 w-6"
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu - Improved styling */}
      <div
        className={cn(
          'fixed inset-0 top-16 sm:top-20 z-40 md:hidden transition-all duration-500 ease-in-out',
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Backdrop with blur */}
        <div 
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500',
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full max-w-sm bg-[#0A2472] shadow-2xl transition-all duration-500 ease-out',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Mobile Logo Section */}
            <div className="flex items-center gap-3 p-6 border-b border-white/20">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex-shrink-0 shadow-lg ring-2 ring-white/30">
                <Image
                  src="/images/logo.png"
                  alt="Vincollins Schools Badge"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif text-lg font-bold text-white leading-tight">
                  Vincollins Schools
                </span>
                <span className="font-script text-sm text-secondary leading-tight flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Geared Towards Success
                </span>
              </div>
            </div>
            
            {/* Navigation Items */}
            <div className="flex-1 py-6 px-4 space-y-1">
              {mainNavItems.map((item, index) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                const Icon = getIconForItem(item.title)
                
                return (
                  <Link
                    key={`mobile-${item.href}`}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-300',
                      'hover:bg-white hover:text-[#0A2472] active:scale-[0.98]',
                      isActive 
                        ? 'bg-white/20 text-white shadow-lg font-semibold border-l-4 border-secondary' 
                        : 'text-white/80 hover:translate-x-1',
                    )}
                    style={{ 
                      transitionDelay: `${index * 50}ms`,
                      transform: isMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                      opacity: isMenuOpen ? 1 : 0,
                      transition: 'all 300ms ease-out'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        isActive ? 'bg-secondary text-[#0A2472]' : 'bg-white/10'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className={cn(
                      'h-4 w-4 transition-all',
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-1'
                    )} />
                  </Link>
                )
              })}
            </div>

            {/* Mobile Footer */}
            <div className="p-6 border-t border-white/20 space-y-4">
              <Button 
                className="w-full bg-white text-[#0A2472] hover:bg-secondary hover:text-white font-semibold py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2 border-white group relative overflow-hidden touch-manipulation"
                asChild
              >
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center justify-center gap-3"
                >
                  <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <span className="text-base tracking-wide">Portal Login</span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </Button>
              
              <p className="text-xs text-center text-white/50">
                © 2024 Vincollins Schools. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}