/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-serif text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 font-serif text-2xl">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </Container>
  )
}