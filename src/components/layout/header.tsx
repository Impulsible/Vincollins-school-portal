/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  LogIn, 
  ChevronRight, 
  Home, 
  Info, 
  BookOpen, 
  Phone, 
  Sparkles,
  GraduationCap,
  ChevronDown,
  Users,
  Calendar,
  Award,
  Shield,
  Mail,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mainNavItems } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

// Define types for navigation items
interface NavItem {
  title: string
  href: string
  description?: string
  icon?: React.ElementType
  children?: NavItem[]
}

// Extended navigation with dropdown items
const enhancedNavItems: NavItem[] = [
  { 
    title: 'Home', 
    href: '/', 
    icon: Home,
    description: 'Welcome to Vincollins Schools'
  },
  { 
    title: 'About Us', 
    href: '/about', 
    icon: Info,
    description: 'Learn about our mission and values',
    children: [
      { title: 'Our Story', href: '/about/story', icon: BookOpen },
      { title: 'Mission & Vision', href: '/about/mission', icon: Target },
      { title: 'Leadership', href: '/about/leadership', icon: Users },
      { title: 'Accreditations', href: '/about/accreditations', icon: Award },
    ]
  },
  { 
    title: 'Academics', 
    href: '/academics', 
    icon: BookOpen,
    description: 'Explore our curriculum and programs',
    children: [
      { title: 'Crèche/Playgroup', href: '/academics/creche', icon: Heart },
      { title: 'Nursery', href: '/academics/nursery', icon: Sparkles },
      { title: 'Primary', href: '/academics/primary', icon: BookOpen },
      { title: 'College', href: '/academics/college', icon: GraduationCap },
    ]
  },
  { 
    title: 'Admissions', 
    href: '/admissions', 
    icon: LogIn,
    description: 'Begin your journey with us',
    children: [
      { title: 'Admission Process', href: '/admissions/process', icon: Calendar },
      { title: 'Fee Structure', href: '/admissions/fees', icon: Shield },
      { title: 'Scholarships', href: '/admissions/scholarships', icon: Award },
      { title: 'Apply Now', href: '/admissions/apply', icon: LogIn },
    ]
  },
  { 
    title: 'Contact', 
    href: '/contact', 
    icon: Phone,
    description: 'Get in touch with us'
  },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const pathname = usePathname()
  
  // Refs for accessibility
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const navRef = React.useRef<HTMLElement>(null)
  const dropdownRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      // Focus trap inside menu
      menuRef.current?.focus()
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }
  }, [isMenuOpen])

  // Close on escape
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
        setActiveDropdown(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, itemTitle: string) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveDropdown(itemTitle)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveDropdown(null)
        break
      case 'Tab':
        if (activeDropdown) {
          const dropdown = dropdownRefs.current.get(activeDropdown)
          if (dropdown && !e.shiftKey) {
            const firstLink = dropdown.querySelector('a')
            firstLink?.focus()
            e.preventDefault()
          }
        }
        break
    }
  }

  // Get icon for navigation items
  const getIconForItem = (title: string): React.ElementType => {
    const item = enhancedNavItems.find(i => i.title === title)
    return item?.icon || ChevronRight
  }

  // Check if a route is active
  const isRouteActive = (href: string): boolean => {
    if (href === '/') return pathname === href
    return pathname?.startsWith(href) ?? false
  }

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full bg-[#0A2472] text-white transition-all duration-300',
        scrolled ? 'shadow-2xl' : 'shadow-lg'
      )}
      role="banner"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative flex h-16 sm:h-20 items-center justify-between px-4 md:px-6">
        {/* Logo - Enhanced with focus styles */}
        <Link 
          href="/" 
          className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-xl transition-all"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Vincollins Schools - Go to homepage"
        >
          <div className="relative flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md ring-2 ring-white/30 group-hover:ring-white/60 group-focus:ring-white/90 transition-all shadow-xl flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt=""
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

        {/* Desktop Navigation - Enhanced with dropdowns */}
        <nav 
          ref={navRef}
          className="hidden md:flex md:items-center md:space-x-1"
          aria-label="Main navigation"
          role="navigation"
        >
          {enhancedNavItems.map((item) => {
            const isActive = isRouteActive(item.href)
            const hasChildren = item.children && item.children.length > 0
            const isOpen = activeDropdown === item.title
            
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
                onKeyDown={(e) => handleKeyDown(e, item.title)}
              >
                {hasChildren ? (
                  <>
                    <button
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                        'hover:bg-white hover:text-[#0A2472]',
                        isActive || isOpen
                          ? 'text-white bg-white/20 shadow-lg font-semibold' 
                          : 'text-white/80',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
                      )}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls={`dropdown-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.title}
                      <ChevronDown 
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )} 
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div
                        ref={(el) => {
                          if (el) dropdownRefs.current.set(item.title, el)
                        }}
                        id={`dropdown-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2"
                        role="menu"
                        aria-label={`${item.title} submenu`}
                      >
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon || ChevronRight
                          const isChildActive = isRouteActive(child.href)
                          
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'flex items-center gap-3 px-4 py-3 text-sm transition-all',
                                'hover:bg-secondary/10 hover:text-[#0A2472]',
                                'focus:outline-none focus-visible:bg-secondary/20 focus-visible:text-[#0A2472]',
                                isChildActive && 'bg-secondary/20 text-[#0A2472] font-medium'
                              )}
                              role="menuitem"
                            >
                              <div className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center',
                                isChildActive ? 'bg-secondary text-[#0A2472]' : 'bg-[#0A2472]/10 text-[#0A2472]'
                              )}>
                                <ChildIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{child.title}</p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 inline-block',
                      'hover:bg-white hover:text-[#0A2472] hover:scale-105',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                      isActive 
                        ? 'text-white bg-white/20 shadow-lg font-semibold' 
                        : 'text-white/80'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.title}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full animate-pulse" />
                    )}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Desktop Login Button - Enhanced */}
        <div className="hidden items-center md:flex">
          <Button 
            className="relative overflow-hidden bg-white text-[#0A2472] hover:bg-secondary hover:text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white group focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
            asChild
          >
            <Link 
              href="/login" 
              className="flex items-center gap-2.5"
              aria-label="Portal Login (opens login page)"
            >
              <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              <span className="text-sm tracking-wide">Portal Login</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button - Enhanced accessibility */}
        <button
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70 z-20 touch-manipulation"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation-menu"
          aria-haspopup="true"
        >
          {/* Animated hamburger icon */}
          <div className="relative w-6 h-6" aria-hidden="true">
            <span 
              className={cn(
                "absolute left-0 block h-0.5 bg-white transform transition-all duration-300 ease-in-out",
                isMenuOpen 
                  ? "top-3 rotate-45 w-6" 
                  : "top-1 rotate-0 w-6"
              )}
            />
            <span 
              className={cn(
                "absolute left-0 block h-0.5 bg-white transform transition-all duration-300 ease-in-out top-3",
                isMenuOpen 
                  ? "opacity-0 w-0" 
                  : "opacity-100 w-6"
              )}
            />
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

      {/* Mobile Navigation Menu - Enhanced with accessibility */}
      <div
        id="mobile-navigation-menu"
        ref={menuRef}
        className={cn(
          'fixed inset-0 top-16 sm:top-20 z-40 md:hidden transition-all duration-500 ease-in-out',
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-modal="true"
        aria-label="Mobile navigation menu"
        hidden={!isMenuOpen}
        tabIndex={-1}
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
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Mobile Logo Section */}
            <div className="flex items-center gap-3 p-6 border-b border-white/20">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex-shrink-0 shadow-lg ring-2 ring-white/30">
                <Image
                  src="/images/logo.png"
                  alt=""
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif text-lg font-bold text-white leading-tight">
                  Vincollins Schools
                </span>
                <span className="font-script text-sm text-secondary leading-tight flex items-center gap-1">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Geared Towards Success
                </span>
              </div>
            </div>
            
            {/* Navigation Items with Accordion */}
            <div className="flex-1 py-6 px-4 space-y-1" role="navigation" aria-label="Mobile navigation links">
              {enhancedNavItems.map((item, index) => {
                const isActive = isRouteActive(item.href)
                const Icon = getIconForItem(item.title)
                const hasChildren = item.children && item.children.length > 0
                const [isOpen, setIsOpen] = React.useState(false)
                
                return (
                  <div key={`mobile-${item.href}`}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-300',
                            'hover:bg-white hover:text-[#0A2472] active:scale-[0.98]',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                            isActive || isOpen
                              ? 'bg-white/20 text-white shadow-lg font-semibold' 
                              : 'text-white/80'
                          )}
                          aria-expanded={isOpen}
                          aria-controls={`mobile-submenu-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                              isActive || isOpen ? 'bg-secondary text-[#0A2472]' : 'bg-white/10'
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown 
                            className={cn(
                              'h-4 w-4 transition-transform duration-300',
                              isOpen && 'rotate-180'
                            )} 
                          />
                        </button>
                        
                        {/* Mobile Submenu */}
                        {isOpen && (
                          <div 
                            id={`mobile-submenu-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                            className="ml-4 mt-2 space-y-1 border-l-2 border-white/20 pl-4"
                            role="group"
                            aria-label={`${item.title} submenu`}
                          >
                            {item.children?.map((child, childIndex) => {
                              const ChildIcon = child.icon || ChevronRight
                              const isChildActive = isRouteActive(child.href)
                              
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={cn(
                                    'flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-300',
                                    'hover:bg-white hover:text-[#0A2472] active:scale-[0.98]',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                                    isChildActive && 'bg-white/20 text-white font-medium'
                                  )}
                                  style={{
                                    animationDelay: `${(childIndex + 1) * 50}ms`,
                                    animation: isMenuOpen ? 'slideIn 300ms ease-out' : 'none'
                                  }}
                                >
                                  <div className={cn(
                                    'w-6 h-6 rounded-lg flex items-center justify-center',
                                    isChildActive ? 'bg-secondary text-[#0A2472]' : 'bg-white/10'
                                  )}>
                                    <ChildIcon className="h-3 w-3" />
                                  </div>
                                  <span>{child.title}</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-300',
                          'hover:bg-white hover:text-[#0A2472] active:scale-[0.98]',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
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
                        aria-current={isActive ? 'page' : undefined}
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
                    )}
                  </div>
                )
              })}
            </div>

            {/* Mobile Contact Info */}
            <div className="px-6 py-4 border-t border-white/20">
              <div className="space-y-3">
                <a 
                  href="tel:+2348001234567" 
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-lg px-3 py-2"
                  aria-label="Call us: +234 800 123 4567"
                >
                  <Phone className="h-4 w-4 text-secondary" aria-hidden="true" />
                  <span>+234 800 123 4567</span>
                </a>
                <a 
                  href="mailto:info@vincollins.edu.ng" 
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-lg px-3 py-2"
                  aria-label="Email us: info@vincollins.edu.ng"
                >
                  <Mail className="h-4 w-4 text-secondary" aria-hidden="true" />
                  <span>info@vincollins.edu.ng</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-white/70 px-3 py-2">
                  <MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-6 border-t border-white/20 space-y-4">
              <Button 
                className="w-full bg-white text-[#0A2472] hover:bg-secondary hover:text-white font-semibold py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2 border-white group relative overflow-hidden touch-manipulation focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
                asChild
              >
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center justify-center gap-3"
                  aria-label="Portal Login (opens login page)"
                >
                  <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  <span className="text-base tracking-wide">Portal Login</span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </Button>
              
              <p className="text-xs text-center text-white/50">
                © {new Date().getFullYear()} Vincollins Schools. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-[#0A2472] px-4 py-2 rounded-lg shadow-lg z-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
      >
        Skip to main content
      </a>
    </header>
  )
}