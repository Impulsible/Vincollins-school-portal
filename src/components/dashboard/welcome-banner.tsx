'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface WelcomeBannerProps {
  user: any
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive'
      case 'staff':
        return 'bg-portal-blue'
      case 'student':
        return 'bg-success'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold">
              {getGreeting()}, {user?.first_name}!
            </h1>
            <p className="text-muted-foreground">
              Welcome back to Vincollins School Portal. Here's what's happening with your account today.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Badge className={getRoleBadgeColor(user?.role)}>
                {user?.role?.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Term</p>
              <p className="text-2xl font-bold text-primary">Second Term 2024</p>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.role === 'student' && 'Next term ends: June 15, 2024'}
                {user?.role === 'staff' && 'Results deadline: June 10, 2024'}
                {user?.role === 'admin' && '12 pending approvals'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}