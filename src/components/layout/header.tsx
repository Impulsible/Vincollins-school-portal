'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mainNavItems } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A2472] text-white shadow-xl">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo with Badge - Straight alignment */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* School Badge - Replace with your actual image */}
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm ring-2 ring-white/20 group-hover:ring-white/40 transition-all flex-shrink-0">
            <Image
              src="/images/logo.png" // ← REPLACE WITH YOUR ACTUAL BADGE PATH
              alt="Vincollins Schools Badge"
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>
          
          {/* Text container - perfectly aligned */}
          <div className="flex flex-col justify-center">
            <span className="font-serif text-xl font-bold text-white leading-none">
              Vincollins Schools
            </span>
            <span className="font-script text-sm text-secondary leading-tight mt-0.5">
              Geared Towards Success
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-secondary after:group-hover:w-full after:transition-all"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions - Beautiful Portal Login Button */}
        <div className="hidden items-center md:flex">
          <Button 
            className="relative overflow-hidden bg-gradient-to-r from-[#E2725B] to-[#C45D48] text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40"
            asChild
          >
            <Link href="/login" className="flex items-center gap-2.5">
              <div className="relative">
                <LogIn className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="text-sm tracking-wide">Portal Login</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10 transition-all rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'fixed inset-0 top-20 z-50 bg-[#0A2472]/95 backdrop-blur-md p-6 transition-transform duration-300 md:hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col space-y-6">
          {/* Mobile Logo - Straight alignment */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/20">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/10 flex-shrink-0">
              <Image
                src="/images/school-badge.png"
                alt="Vincollins Schools Badge"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-serif text-base font-bold text-white leading-none">
                Vincollins Schools
              </span>
              <span className="font-script text-xs text-secondary leading-tight mt-0.5">
                Geared Towards Success
              </span>
            </div>
          </div>
          
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-medium text-white/90 hover:text-secondary transition-colors border-b border-white/10 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          <div className="pt-4">
            <Button 
              className="w-full bg-gradient-to-r from-[#E2725B] to-[#C45D48] text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20"
              asChild
            >
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3">
                <LogIn className="h-5 w-5" />
                <span className="text-base">Portal Login</span>
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}