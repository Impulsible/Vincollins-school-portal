'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './use-toast'
import { type CBTExam, type CBTQuestion, type CBTSubmission } from '@/types/cbt'

export function useCBT() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentExam, setCurrentExam] = useState<CBTExam | null>(null)
  const [questions, setQuestions] = useState<CBTQuestion[]>([])
  const [submission, setSubmission] = useState<CBTSubmission | null>(null)
  const { success, error } = useToast()

  const createExam = useCallback(async (examData: Omit<CBTExam, 'id' | 'status'>) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: insertError } = await supabase
        .from('cbt_exams')
        .insert({
          ...examData,
          status: 'draft',
        })
        .select()
        .single()

      if (insertError) throw insertError

      success('Exam created successfully')
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create exam')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const addQuestions = useCallback(async (questionsData: Omit<CBTQuestion, 'id'>[]) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: insertError } = await supabase
        .from('cbt_questions')
        .insert(questionsData)
        .select()

      if (insertError) throw insertError

      success(`Added ${data.length} questions`)
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to add questions')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const getExam = useCallback(async (examId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('cbt_exams')
        .select(`
          *,
          class:classes(name, code),
          subject:subjects(name, code),
          teacher:staff(
            user:users(first_name, last_name)
          ),
          questions:cbt_questions(*)
        `)
        .eq('id', examId)
        .single()

      if (fetchError) throw fetchError

      setCurrentExam(data)
      setQuestions(data.questions || [])
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch exam')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const startExam = useCallback(async (examId: string, studentId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Check if already started
      const { data: existing } = await supabase
        .from('cbt_submissions')
        .select('*')
        .eq('exam_id', examId)
        .eq('student_id', studentId)
        .single()

      if (existing) {
        setSubmission(existing)
        return existing
      }

      // Create new submission
      const { data, error: insertError } = await supabase
        .from('cbt_submissions')
        .insert({
          exam_id: examId,
          student_id: studentId,
          answers: {},
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) throw insertError

      setSubmission(data)
      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to start exam')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const saveAnswer = useCallback(async (
    submissionId: string,
    questionId: string,
    answer: string | string[]
  ) => {
    try {
      const supabase = createClient()
      
      const { data: current } = await supabase
        .from('cbt_submissions')
        .select('answers')
        .eq('id', submissionId)
        .single()

      const updatedAnswers = {
        ...(current?.answers as object || {}),
        [questionId]: answer,
      }

      const { error: updateError } = await supabase
        .from('cbt_submissions')
        .update({ answers: updatedAnswers })
        .eq('id', submissionId)

      if (updateError) throw updateError

      setSubmission(prev => prev ? { ...prev, answers: updatedAnswers } : null)
    } catch (err) {
      console.error('Failed to save answer:', err)
    }
  }, [])

  const submitExam = useCallback(async (submissionId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Calculate objective score if all questions are objective
      const exam = currentExam
      const objectiveQuestions = questions.filter(q => q.question_type === 'objective')
      
      let objectiveScore = 0
      if (objectiveQuestions.length > 0 && submission?.answers) {
        objectiveScore = objectiveQuestions.reduce((score, q) => {
          const userAnswer = submission.answers[q.id]
          if (userAnswer && q.correct_answer && userAnswer === q.correct_answer) {
            return score + q.marks
          }
          return score
        }, 0)
      }

      const { error: updateError } = await supabase
        .from('cbt_submissions')
        .update({
          submitted_at: new Date().toISOString(),
          status: 'submitted',
          objective_score: objectiveScore,
        })
        .eq('id', submissionId)

      if (updateError) throw updateError

      success('Exam submitted successfully')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to submit exam')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [currentExam, questions, submission, success, error])

  const gradeTheoryQuestions = useCallback(async (
    submissionId: string,
    grades: { [questionId: string]: number }
  ) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const theoryScore = Object.values(grades).reduce((sum, score) => sum + score, 0)
      
      const { data: submission } = await supabase
        .from('cbt_submissions')
        .select('objective_score')
        .eq('id', submissionId)
        .single()

      const totalScore = (submission?.objective_score || 0) + theoryScore

      const { error: updateError } = await supabase
        .from('cbt_submissions')
        .update({
          theory_score: theoryScore,
          total_score: totalScore,
          status: 'graded',
          graded_at: new Date().toISOString(),
          graded_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', submissionId)

      if (updateError) throw updateError

      success('Exam graded successfully')
      return true
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to grade exam')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [success, error])

  const getStudentExams = useCallback(async (studentId: string, classId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const now = new Date().toISOString()
      
      const { data, error: fetchError } = await supabase
        .from('cbt_exams')
        .select(`
          *,
          subject:subjects(name, code),
          submissions:cbt_submissions(*)
        `)
        .eq('class_id', classId)
        .gte('scheduled_end', now)
        .order('scheduled_start')

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch exams')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const getExamResults = useCallback(async (examId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('cbt_submissions')
        .select(`
          *,
          student:students(
            admission_number,
            user:users(first_name, last_name)
          )
        `)
        .eq('exam_id', examId)
        .order('total_score', { ascending: false })

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to fetch results')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [error])

  const updateExamStatus = useCallback(async (examId: string) => {
    try {
      const supabase = createClient()
      const now = new Date()
      
      const { data: exam } = await supabase
        .from('cbt_exams')
        .select('*')
        .eq('id', examId)
        .single()

      if (!exam) return

      let newStatus = exam.status
      const startTime = new Date(exam.scheduled_start)
      const endTime = new Date(exam.scheduled_end)

      if (now < startTime) {
        newStatus = 'scheduled'
      } else if (now >= startTime && now <= endTime) {
        newStatus = 'ongoing'
      } else if (now > endTime) {
        newStatus = 'completed'
      }

      if (newStatus !== exam.status) {
        await supabase
          .from('cbt_exams')
          .update({ status: newStatus })
          .eq('id', examId)
      }

      return newStatus
    } catch (err) {
      console.error('Failed to update exam status:', err)
      return null
    }
  }, [])

  return {
    isLoading,
    currentExam,
    questions,
    submission,
    createExam,
    addQuestions,
    getExam,
    startExam,
    saveAnswer,
    submitExam,
    gradeTheoryQuestions,
    getStudentExams,
    getExamResults,
    updateExamStatus,
  }
}