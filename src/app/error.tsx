'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-serif text-6xl font-bold text-portal-red">Error</h1>
      <h2 className="mt-4 font-serif text-2xl">Something went wrong!</h2>
      <p className="mt-2 text-muted-foreground">
        We apologize for the inconvenience. Please try again.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try Again
      </Button>
    </Container>
  )
}