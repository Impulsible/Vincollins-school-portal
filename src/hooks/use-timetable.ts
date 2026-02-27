'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './use-toast'
import { type TimetableEntry, type TimetableWithDetails, DAYS_OF_WEEK } from '@/types/timetable'

export function useTimetable() {
  const [isLoading, setIsLoading] = useState(false)
  const [timetable, setTimetable] = useState<TimetableWithDetails[]>([])
  const { success, error } = useToast()

  const getClassTimetable = useCallback(async (
    classId: string,
    term: string
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('timetable_entries')
        .select(`
          *,
          subject:subjects(name, code),
          teacher:staff(
            user:users(first_name, last_name)
          )
        `)
        .eq('class_id', classId)
        .eq('academic_term', term)
        .order('day_of_week')
        .order('start_time')

      if (fetchError) throw fetchError

      setTimetable(data || [])
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch timetable')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const createTimetableEntry = useCallback(async (
    entry: Omit<TimetableEntry, 'id'>
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Check for conflicts
      const { data: conflicts } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('class_id', entry.class_id)
        .eq('day_of_week', entry.day_of_week)
        .eq('academic_term', entry.academic_term)
        .or(`start_time.lte.${entry.end_time},end_time.gte.${entry.start_time}`)

      if (conflicts && conflicts.length > 0) {
        throw new Error('Time slot conflict with existing entry')
      }

      const { data, error: insertError } = await supabase
        .from('timetable_entries')
        .insert(entry)
        .select()
        .single()

      if (insertError) throw insertError

      success('Timetable entry created')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create entry')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const updateTimetableEntry = useCallback(async (
    id: string,
    updates: Partial<TimetableEntry>
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: updateError } = await supabase
        .from('timetable_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      success('Timetable entry updated')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update entry')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const deleteTimetableEntry = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { error: deleteError } = await supabase
        .from('timetable_entries')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      success('Timetable entry deleted')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to delete entry')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const getTeacherTimetable = useCallback(async (
    teacherId: string,
    term: string
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('timetable_entries')
        .select(`
          *,
          class:classes(name, code),
          subject:subjects(name, code)
        `)
        .eq('teacher_id', teacherId)
        .eq('academic_term', term)
        .order('day_of_week')
        .order('start_time')

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch timetable')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const organizeTimetableByDay = useCallback((entries: TimetableWithDetails[]) => {
    const organized: { [key: string]: TimetableWithDetails[] } = {}
    
    DAYS_OF_WEEK.forEach((_, index) => {
      organized[index] = entries
        .filter(e => e.day_of_week === index)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
    })

    return organized
  }, [])

  const checkAvailability = useCallback(async (
    teacherId: string,
    day: number,
    startTime: string,
    endTime: string,
    term: string,
    excludeEntryId?: string
  ) => {
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('timetable_entries')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('day_of_week', day)
        .eq('academic_term', term)
        .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)

      if (excludeEntryId) {
        query = query.neq('id', excludeEntryId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      return data?.length === 0 // Available if no conflicts
    } catch (err) {
      console.error('Failed to check availability:', err)
      return false
    }
  }, [])

  const bulkCreateTimetable = useCallback(async (
    entries: Omit<TimetableEntry, 'id'>[]
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Check for conflicts in batch
      for (const entry of entries) {
        const { data: conflicts } = await supabase
          .from('timetable_entries')
          .select('*')
          .eq('class_id', entry.class_id)
          .eq('day_of_week', entry.day_of_week)
          .eq('academic_term', entry.academic_term)
          .or(`start_time.lte.${entry.end_time},end_time.gte.${entry.start_time}`)

        if (conflicts && conflicts.length > 0) {
          throw new Error(`Conflict found for ${entry.day_of_week} at ${entry.start_time}`)
        }
      }

      const { data, error: insertError } = await supabase
        .from('timetable_entries')
        .insert(entries)
        .select()

      if (insertError) throw insertError

      success(`Created ${data.length} timetable entries`)
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create entries')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  return {
    isLoading,
    timetable,
    getClassTimetable,
    createTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
    getTeacherTimetable,
    organizeTimetableByDay,
    checkAvailability,
    bulkCreateTimetable,
  }
}