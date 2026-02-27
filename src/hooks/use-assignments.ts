'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './use-toast'
import { type Assignment, type AssignmentSubmission, type AssignmentWithDetails } from '@/types/assignment'

export function useAssignments() {
  const [isLoading, setIsLoading] = useState(false)
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([])
  const { success, error } = useToast()

  const createAssignment = useCallback(async (
    assignmentData: Omit<Assignment, 'id' | 'status'>
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: insertError } = await supabase
        .from('assignments')
        .insert({
          ...assignmentData,
          status: 'draft',
        })
        .select()
        .single()

      if (insertError) throw insertError

      success('Assignment created successfully')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create assignment')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const publishAssignment = useCallback(async (assignmentId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('assignments')
        .update({ status: 'published' })
        .eq('id', assignmentId)

      if (updateError) throw updateError

      success('Assignment published')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to publish assignment')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const getClassAssignments = useCallback(async (
    classId: string,
    status?: 'draft' | 'published' | 'closed'
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('assignments')
        .select(`
          *,
          subject:subjects(name, code),
          teacher:staff(
            user:users(first_name, last_name)
          )
        `)
        .eq('class_id', classId)
        .order('due_date', { ascending: true })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setAssignments(data || [])
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch assignments')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const getStudentAssignments = useCallback(async (studentId: string, classId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('assignments')
        .select(`
          *,
          subject:subjects(name, code),
          teacher:staff(
            user:users(first_name, last_name)
          ),
          submissions:assignment_submissions(*)
        `)
        .eq('class_id', classId)
        .eq('status', 'published')
        .order('due_date', { ascending: true })

      if (fetchError) throw fetchError

      // Add submission status for this student
      const assignmentsWithStatus = data?.map(assignment => ({
        ...assignment,
        studentSubmission: assignment.submissions?.find(
          (s: any) => s.student_id === studentId
        ),
      }))

      setAssignments(assignmentsWithStatus || [])
      return assignmentsWithStatus
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch assignments')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const submitAssignment = useCallback(async (
    assignmentId: string,
    studentId: string,
    fileUrl?: string,
    comments?: string
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Check if already submitted
      const { data: existing } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .single()

      if (existing) {
        throw new Error('You have already submitted this assignment')
      }

      // Check if due date has passed
      const { data: assignment } = await supabase
        .from('assignments')
        .select('due_date')
        .eq('id', assignmentId)
        .single()

      const isLate = assignment && new Date() > new Date(assignment.due_date)

      const { data, error: insertError } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: assignmentId,
          student_id: studentId,
          file_url: fileUrl,
          comments,
          status: isLate ? 'late' : 'submitted',
        })
        .select()
        .single()

      if (insertError) throw insertError

      success('Assignment submitted successfully')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to submit assignment')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const gradeSubmission = useCallback(async (
    submissionId: string,
    marks: number,
    comments?: string
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id
      
      const { error: updateError } = await supabase
        .from('assignment_submissions')
        .update({
          marks_obtained: marks,
          graded_by: userId,
          graded_at: new Date().toISOString(),
          status: 'graded',
        })
        .eq('id', submissionId)

      if (updateError) throw updateError

      success('Submission graded')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to grade submission')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const getSubmissions = useCallback(async (assignmentId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('assignment_submissions')
        .select(`
          *,
          student:students(
            admission_number,
            user:users(first_name, last_name)
          )
        `)
        .eq('assignment_id', assignmentId)
        .order('submission_date', { ascending: false })

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch submissions')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const closeAssignment = useCallback(async (assignmentId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('assignments')
        .update({ status: 'closed' })
        .eq('id', assignmentId)

      if (updateError) throw updateError

      success('Assignment closed')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to close assignment')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const getAssignmentStats = useCallback(async (assignmentId: string) => {
    try {
      const supabase = createClient()
      
      const { data: assignment } = await supabase
        .from('assignments')
        .select(`
          *,
          class:classes(current_enrollment)
        `)
        .eq('id', assignmentId)
        .single()

      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('status')
        .eq('assignment_id', assignmentId)

      const totalStudents = assignment?.class?.current_enrollment || 0
      const submitted = submissions?.length || 0
      const graded = submissions?.filter(s => s.status === 'graded').length || 0
      const late = submissions?.filter(s => s.status === 'late').length || 0

      return {
        totalStudents,
        submitted,
        graded,
        late,
        pending: totalStudents - submitted,
        submissionRate: totalStudents > 0 ? (submitted / totalStudents) * 100 : 0,
      }
    } catch (err) {
      console.error('Failed to get stats:', err)
      return null
    }
  }, [])

  return {
    isLoading,
    assignments,
    createAssignment,
    publishAssignment,
    getClassAssignments,
    getStudentAssignments,
    submitAssignment,
    gradeSubmission,
    getSubmissions,
    closeAssignment,
    getAssignmentStats,
  }
}