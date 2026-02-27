import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'
import { footerNavItems } from '@/lib/constants/navigation'
import { siteConfig } from '@/lib/constants/site'

export function Footer() {
  return (
    <footer className="border-t bg-primary/5">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-serif text-xl font-bold text-primary">Vincollins</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Geared Towards Excellence — Providing quality education since 1995.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href={siteConfig.links.facebook} className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href={siteConfig.links.twitter} className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href={siteConfig.links.instagram} className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Academics */}
          <div>
            <h3 className="font-serif text-lg font-semibold">Academics</h3>
            <ul className="mt-4 space-y-2">
              {footerNavItems.academics.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-serif text-lg font-semibold">About</h3>
            <ul className="mt-4 space-y-2">
              {footerNavItems.about.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal */}
          <div>
            <h3 className="font-serif text-lg font-semibold">Portal Access</h3>
            <ul className="mt-4 space-y-2">
              {footerNavItems.portal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vincollins Schools, Lagos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}