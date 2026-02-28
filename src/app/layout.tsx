import type { Metadata } from 'next'
import { Playfair_Display, Open_Sans, Dancing_Script } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuthProvider } from '@/components/providers/auth-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { siteConfig } from '@/lib/constants/site'
import { cn } from '@/lib/utils/cn'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(playfair.variable, openSans.variable, dancingScript.variable)} suppressHydrationWarning>
      <body className={cn(openSans.className, 'flex min-h-screen flex-col antialiased')}>
        <AuthProvider>
          <QueryProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastProvider />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}