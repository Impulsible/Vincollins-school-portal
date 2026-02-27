'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './use-toast'
import { GRADING_SCALES, type ResultEntryData, type ResultWithDetails } from '@/types/result'

export function useResults() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ResultWithDetails[]>([])
  const { success, error } = useToast()

  const calculateGrade = (totalScore: number): { grade: string; grade_point: number; remark: string } => {
    const scale = GRADING_SCALES.find(
      s => totalScore >= s.min_score && totalScore <= s.max_score
    ) || GRADING_SCALES[GRADING_SCALES.length - 1]
    
    return {
      grade: scale.grade,
      grade_point: scale.grade_point,
      remark: scale.remark,
    }
  }

  const enterResult = useCallback(async (data: ResultEntryData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const totalScore = data.ca_score + data.exam_score
      const { grade, grade_point, remark } = calculateGrade(totalScore)

      const { data: result, error: insertError } = await supabase
        .from('results')
        .insert({
          student_id: data.student_id,
          subject_id: data.subject_id,
          class_id: data.class_id,
          academic_term: data.academic_term,
          ca_score: data.ca_score,
          exam_score: data.exam_score,
          total_score: totalScore,
          grade,
          remark: data.remark || remark,
          entered_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'draft',
        })
        .select()
        .single()

      if (insertError) throw insertError

      success('Result entered successfully')
      return result
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to enter result')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const enterBatchResults = useCallback(async (resultsData: ResultEntryData[]) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id

      const resultsToInsert = resultsData.map(data => {
        const totalScore = data.ca_score + data.exam_score
        const { grade, remark } = calculateGrade(totalScore)
        
        return {
          student_id: data.student_id,
          subject_id: data.subject_id,
          class_id: data.class_id,
          academic_term: data.academic_term,
          ca_score: data.ca_score,
          exam_score: data.exam_score,
          total_score: totalScore,
          grade,
          remark: data.remark || remark,
          entered_by: userId,
          status: 'draft',
        }
      })

      const { data, error: insertError } = await supabase
        .from('results')
        .insert(resultsToInsert)
        .select()

      if (insertError) throw insertError

      success(`Successfully entered ${data.length} results`)
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to enter batch results')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const getClassResults = useCallback(async (
    classId: string,
    subjectId: string,
    term: string
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('results')
        .select(`
          *,
          student:students(
            admission_number,
            user:users(first_name, last_name)
          )
        `)
        .eq('class_id', classId)
        .eq('subject_id', subjectId)
        .eq('academic_term', term)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setResults(data || [])
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch results')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const getStudentResults = useCallback(async (studentId: string, term?: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('results')
        .select(`
          *,
          subject:subjects(name, code, credit_units)
        `)
        .eq('student_id', studentId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (term) {
        query = query.eq('academic_term', term)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch results')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const calculateStudentGPA = useCallback((results: any[]) => {
    if (!results.length) return 0

    let totalGradePoints = 0
    let totalCredits = 0

    results.forEach(result => {
      const creditUnits = result.subject?.credit_units || 1
      const { grade_point } = calculateGrade(result.total_score)
      
      totalGradePoints += grade_point * creditUnits
      totalCredits += creditUnits
    })

    return totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0
  }, [])

  const submitForApproval = useCallback(async (resultIds: string[]) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('results')
        .update({ status: 'pending' })
        .in('id', resultIds)
        .eq('status', 'draft')

      if (updateError) throw updateError

      success('Results submitted for approval')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to submit results')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const approveResults = useCallback(async (resultIds: string[]) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id
      
      const { error: updateError } = await supabase
        .from('results')
        .update({ 
          status: 'approved',
          approved_by: userId,
          approved_at: new Date().toISOString(),
        })
        .in('id', resultIds)
        .eq('status', 'pending')

      if (updateError) throw updateError

      success('Results approved')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to approve results')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const publishResults = useCallback(async (resultIds: string[]) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('results')
        .update({ status: 'published' })
        .in('id', resultIds)
        .eq('status', 'approved')

      if (updateError) throw updateError

      success('Results published successfully')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to publish results')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const getPendingApprovalCount = useCallback(async () => {
    try {
      const supabase = createClient()
      
      const { count, error: countError } = await supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (countError) throw countError
      return count || 0
    } catch (err) {
      console.error('Failed to get pending count:', err)
      return 0
    }
  }, [])

  const generateResultSummary = useCallback(async (
    studentId: string,
    term: string
  ): Promise<StudentResultSummary | null> => {
    try {
      const supabase = createClient()
      
      // Get student details
      const { data: student } = await supabase
        .from('students')
        .select(`
          *,
          user:users(first_name, last_name),
          class:classes(name, code)
        `)
        .eq('id', studentId)
        .single()

      if (!student) return null

      // Get results for the term
      const results = await getStudentResults(studentId, term)
      if (!results) return null

      // Calculate GPA and prepare subject details
      let totalCredits = 0
      let totalGradePoints = 0
      const subjects = []

      for (const result of results) {
        const creditUnits = result.subject?.credit_units || 1
        const { grade_point } = calculateGrade(result.total_score)
        
        totalCredits += creditUnits
        totalGradePoints += grade_point * creditUnits
        
        subjects.push({
          subject_id: result.subject_id,
          subject_name: result.subject?.name || 'Unknown',
          subject_code: result.subject?.code || 'UNK',
          ca_score: result.ca_score,
          exam_score: result.exam_score,
          total_score: result.total_score,
          grade: result.grade,
          grade_point,
          remark: result.remark,
          credit_units: creditUnits,
        })
      }

      const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0

      // Get student's CGPA
      const { data: cgpaData } = await supabase
        .rpc('calculate_cgpa', { student_id_param: studentId })

      return {
        student_id: studentId,
        student_name: `${student.user?.first_name} ${student.user?.last_name}`,
        admission_number: student.admission_number,
        class_name: student.class?.name,
        class_code: student.class?.code,
        term,
        session: term.split(' ')[0], // Extract session from term
        subjects,
        total_credits: totalCredits,
        total_grade_points: totalGradePoints,
        gpa: Number(gpa.toFixed(2)),
        cgpa: cgpaData || 0,
      }
    } catch (err) {
      console.error('Failed to generate summary:', err)
      return null
    }
  }, [getStudentResults])

  return {
    isLoading,
    results,
    enterResult,
    enterBatchResults,
    getClassResults,
    getStudentResults,
    calculateStudentGPA,
    calculateGrade,
    submitForApproval,
    approveResults,
    publishResults,
    getPendingApprovalCount,
    generateResultSummary,
  }
}