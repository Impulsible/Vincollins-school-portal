import { Container } from '@/components/layout/container'

export default function Loading() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </Container>
  )
}