'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './use-toast'
import { type Resource, type ResourceWithDetails } from '@/types/resource'

export function useResources() {
  const [isLoading, setIsLoading] = useState(false)
  const [resources, setResources] = useState<ResourceWithDetails[]>([])
  const { success, error } = useToast()

  const uploadResource = useCallback(async (
    resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: insertError } = await supabase
        .from('resources')
        .insert(resourceData)
        .select()
        .single()

      if (insertError) throw insertError

      success('Resource uploaded successfully')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to upload resource')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const uploadFile = useCallback(async (file: File, path: string) => {
    try {
      const supabase = createClient()
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${path}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to upload file')
      return null
    }
  }, [error])

  const getClassResources = useCallback(async (
    classId?: string,
    subjectId?: string
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('resources')
        .select(`
          *,
          class:classes(name, code),
          subject:subjects(name, code),
          uploader:users(first_name, last_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (classId) {
        query = query.eq('class_id', classId)
      }

      if (subjectId) {
        query = query.eq('subject_id', subjectId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setResources(data || [])
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch resources')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const deleteResource = useCallback(async (resourceId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Get file URL first to delete from storage
      const { data: resource } = await supabase
        .from('resources')
        .select('file_url')
        .eq('id', resourceId)
        .single()

      if (resource?.file_url) {
        // Extract path from URL
        const path = resource.file_url.split('/').pop()
        if (path) {
          await supabase.storage.from('resources').remove([path])
        }
      }

      const { error: deleteError } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId)

      if (deleteError) throw deleteError

      success('Resource deleted')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to delete resource')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const updateResource = useCallback(async (
    resourceId: string,
    updates: Partial<Resource>
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: updateError } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', resourceId)
        .select()
        .single()

      if (updateError) throw updateError

      success('Resource updated')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update resource')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const publishResource = useCallback(async (resourceId: string) => {
    return updateResource(resourceId, { status: 'published' })
  }, [updateResource])

  const unpublishResource = useCallback(async (resourceId: string) => {
    return updateResource(resourceId, { status: 'draft' })
  }, [updateResource])

  const getResourceStats = useCallback(async () => {
    try {
      const supabase = createClient()
      
      const { data: total } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })

      const { data: byType } = await supabase
        .from('resources')
        .select('type, count')
        .group('type')

      const { data: recent } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      return {
        total: total?.length || 0,
        byType: byType || [],
        recent: recent || [],
      }
    } catch (err) {
      console.error('Failed to get stats:', err)
      return null
    }
  }, [])

  return {
    isLoading,
    resources,
    uploadResource,
    uploadFile,
    getClassResources,
    deleteResource,
    updateResource,
    publishResource,
    unpublishResource,
    getResourceStats,
  }
}