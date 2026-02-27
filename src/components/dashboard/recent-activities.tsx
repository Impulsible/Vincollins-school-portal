'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Award, BookOpen, UserPlus, Edit, CheckCircle } from 'lucide-react'

interface RecentActivitiesProps {
  userRole: string
}

export function RecentActivities({ userRole }: RecentActivitiesProps) {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    fetchActivities()
  }, [userRole])

  const fetchActivities = async () => {
    const supabase = createClient()
    
    // This would be replaced with actual activity log queries
    const mockActivities = [
      {
        id: 1,
        type: 'result',
        title: 'Results Published',
        description: 'Mathematics results for JSS 2 have been published',
        time: new Date(Date.now() - 1000 * 60 * 30),
        user: 'Mrs. Adebayo',
        icon: Award,
        color: 'text-success',
      },
      {
        id: 2,
        type: 'assignment',
        title: 'New Assignment',
        description: 'English assignment uploaded for SSS 1',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2),
        user: 'Mr. Okonkwo',
        icon: FileText,
        color: 'text-portal-blue',
      },
      {
        id: 3,
        type: 'cbt',
        title: 'CBT Exam Scheduled',
        description: 'Basic Science CBT exam for JSS 3 scheduled for tomorrow',
        time: new Date(Date.now() - 1000 * 60 * 60 * 5),
        user: 'Dr. Eze',
        icon: BookOpen,
        color: 'text-accent',
      },
      {
        id: 4,
        type: 'student',
        title: 'New Student Enrolled',
        description: '5 new students enrolled in Nursery section',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24),
        user: 'Admin',
        icon: UserPlus,
        color: 'text-secondary',
      },
      {
        id: 5,
        type: 'approval',
        title: 'Results Approved',
        description: '10 results approved by Principal',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        user: 'Principal',
        icon: CheckCircle,
        color: 'text-warning',
      },
    ]

    setActivities(mockActivities)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={activity.color}>
                  {getInitials(activity.user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(activity.time, { addSuffix: true })}</span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}