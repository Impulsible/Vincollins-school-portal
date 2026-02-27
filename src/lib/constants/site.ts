export const siteConfig = {
  name: 'Vincollins School Portal',
  shortName: 'VSP',
  description: 'Enterprise Academic Management System for Vincollins Schools, Lagos',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.png',
  links: {
    twitter: 'https://twitter.com/vincollinsschools',
    facebook: 'https://facebook.com/vincollinsschools',
    instagram: 'https://instagram.com/vincollinsschools',
  },
  contact: {
    address: 'Lagos, Nigeria',
    phone: '+234 XXX XXX XXXX',
    email: 'info@vincollins.edu.ng',
  },
}

export type SiteConfig = typeof siteConfig