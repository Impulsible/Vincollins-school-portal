import { Container } from '@/components/layout/container'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-20">
      <Container className="flex items-center justify-center">
        {children}
      </Container>
    </div>
  )
}