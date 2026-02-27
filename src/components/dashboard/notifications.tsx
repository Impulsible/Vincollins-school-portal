'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Calendar, Award, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NotificationsProps {
  userRole: string
}

export function Notifications({ userRole }: NotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
  }, [userRole])

  const fetchNotifications = async () => {
    // Mock notifications - replace with actual data
    const mockNotifications = [
      {
        id: 1,
        title: 'Result Entry Deadline',
        message: 'Results for Second Term must be entered by June 10th',
        type: 'warning',
        time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        actionable: true,
      },
      {
        id: 2,
        title: 'CBT Exam Tomorrow',
        message: 'JSS 3 Mathematics CBT exam scheduled for 10:00 AM',
        type: 'info',
        time: new Date(Date.now() + 1000 * 60 * 60 * 20),
        actionable: true,
      },
      {
        id: 3,
        title: 'Staff Meeting',
        message: 'General staff meeting in the conference room at 2:00 PM',
        type: 'info',
        time: new Date(Date.now() + 1000 * 60 * 60 * 4),
        actionable: false,
      },
      {
        id: 4,
        title: 'Results Published',
        message: 'First Term results have been published for all classes',
        type: 'success',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        actionable: true,
      },
    ]

    setNotifications(mockNotifications)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />
      case 'success':
        return <Award className="h-4 w-4 text-success" />
      case 'info':
        return <Calendar className="h-4 w-4 text-portal-blue" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTimeDisplay = (time: Date) => {
    const now = new Date()
    if (time > now) {
      return `in ${formatDistanceToNow(time)}`
    }
    return formatDistanceToNow(time, { addSuffix: true })
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No new notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => notification.actionable && router.push('/notifications')}
            >
              <div className="mt-0.5">{getIcon(notification.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {getTimeDisplay(notification.time)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}