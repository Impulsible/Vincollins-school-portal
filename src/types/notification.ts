'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './use-toast'
import { type Notification, type Announcement } from '@/types/notification'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { success, error } = useToast()

  const fetchNotifications = useCallback(async (userId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError

      setNotifications(data || [])
      setUnreadCount(data?.filter(n => !n.read).length || 0)
      return data
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ 
          read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId)

      if (updateError) throw updateError

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async (userId: string) => {
    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ 
          read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('read', false)

      if (updateError) throw updateError

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
      )
      setUnreadCount(0)
      success('All notifications marked as read')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to mark all as read')
    }
  }, [success, error])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const supabase = createClient()
      
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (deleteError) throw deleteError

      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      setUnreadCount(prev => 
        notifications.find(n => n.id === notificationId && !n.read) ? prev - 1 : prev
      )
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }, [notifications])

  const createNotification = useCallback(async (
    userId: string,
    notification: Omit<Notification, 'id' | 'read' | 'read_at' | 'created_at'>
  ) => {
    try {
      const supabase = createClient()
      
      const { data, error: insertError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          ...notification,
          read: false,
        })
        .select()
        .single()

      if (insertError) throw insertError

      setNotifications(prev => [data, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Show toast for high priority notifications
      if (notification.type === 'warning' || notification.type === 'error') {
        // Toast will be shown by the caller
      }
      
      return data
    } catch (err) {
      console.error('Failed to create notification:', err)
      return null
    }
  }, [])

  const createBulkNotifications = useCallback(async (
    userIds: string[],
    notification: Omit<Notification, 'id' | 'user_id' | 'read' | 'read_at' | 'created_at'>
  ) => {
    try {
      const supabase = createClient()
      
      const notifications = userIds.map(userId => ({
        user_id: userId,
        ...notification,
        read: false,
      }))

      const { data, error: insertError } = await supabase
        .from('notifications')
        .insert(notifications)
        .select()

      if (insertError) throw insertError

      return data
    } catch (err) {
      console.error('Failed to create bulk notifications:', err)
      return null
    }
  }, [])

  const createAnnouncement = useCallback(async (
    announcement: Omit<Announcement, 'id' | 'created_at'>
  ) => {
    try {
      const supabase = createClient()
      
      const { data, error: insertError } = await supabase
        .from('announcements')
        .insert(announcement)
        .select()
        .single()

      if (insertError) throw insertError

      // Create notifications for target users
      let targetUserIds: string[] = []

      if (announcement.audience === 'all') {
        const { data: users } = await supabase
          .from('users')
          .select('id')
        targetUserIds = users?.map(u => u.id) || []
      } else if (announcement.audience === 'students') {
        const { data: students } = await supabase
          .from('students')
          .select('user_id')
        targetUserIds = students?.map(s => s.user_id) || []
      } else if (announcement.audience === 'staff') {
        const { data: staff } = await supabase
          .from('staff')
          .select('user_id')
        targetUserIds = staff?.map(s => s.user_id) || []
      } else if (announcement.target_users.length > 0) {
        targetUserIds = announcement.target_users
      }

      if (targetUserIds.length > 0) {
        await createBulkNotifications(targetUserIds, {
          title: announcement.title,
          message: announcement.content.substring(0, 100) + '...',
          type: announcement.priority === 'urgent' ? 'error' : 
                announcement.priority === 'high' ? 'warning' : 'info',
          category: 'general',
          link: `/announcements/${data.id}`,
        })
      }

      success('Announcement created and notifications sent')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create announcement')
      return null
    }
  }, [success, error, createBulkNotifications])

  const subscribeToNotifications = useCallback((userId: string) => {
    const supabase = createClient()
    
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
          
          // Show toast for new notification
          if (newNotification.type === 'warning' || newNotification.type === 'error') {
            // Toast will be shown by the notification system
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const getNotificationPreferences = useCallback(async (userId: string) => {
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      return data
    } catch (err) {
      console.error('Failed to fetch preferences:', err)
      return null
    }
  }, [])

  const updateNotificationPreferences = useCallback(async (
    userId: string,
    preferences: Partial<NotificationPreferences>
  ) => {
    try {
      const supabase = createClient()
      
      const { data, error: upsertError } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (upsertError) throw upsertError

      success('Notification preferences updated')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update preferences')
      return null
    }
  }, [success, error])

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    createBulkNotifications,
    createAnnouncement,
    subscribeToNotifications,
    getNotificationPreferences,
    updateNotificationPreferences,
  }
}