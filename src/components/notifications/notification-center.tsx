'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, X, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications } from '@/hooks/use-notifications'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils/cn'

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { profile } = useAuth()
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    subscribeToNotifications,
  } = useNotifications()

  useEffect(() => {
    if (profile?.id) {
      fetchNotifications(profile.id)
      const unsubscribe = subscribeToNotifications(profile.id)
      return unsubscribe
    }
  }, [profile?.id, fetchNotifications, subscribeToNotifications])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />
      case 'error':
        return <X className="h-4 w-4 text-destructive" />
      default:
        return <Info className="h-4 w-4 text-portal-blue" />
    }
  }

  const getBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-muted/50'
    switch (type) {
      case 'success':
        return 'bg-success/10'
      case 'warning':
        return 'bg-warning/10'
      case 'error':
        return 'bg-destructive/10'
      default:
        return 'bg-portal-blue/10'
    }
  }

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }
    if (notification.link) {
      window.location.href = notification.link
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => profile?.id && markAllAsRead(profile.id)}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                    getBgColor(notification.type, notification.read)
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-portal-blue flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <a href="/notifications">View all notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}