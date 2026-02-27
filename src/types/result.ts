import { Database } from './supabase'

export type Result = Database['public']['Tables']['results']['Row']
export type ResultStatus = 'draft' | 'pending' | 'approved' | 'published'

export interface ResultWithDetails extends Result {
  student?: {
    id: string
    admission_number: string
    user: {
      first_name: string
      last_name: string
    }
  }
  subject?: {
    id: string
    name: string
    code: string
    credit_units: number
  }
  class?: {
    id: string
    name: string
    code: string
  }
  entered_by_user?: {
    first_name: string
    last_name: string
  }
  approved_by_user?: {
    first_name: string
    last_name: string
  }
}

export interface ResultEntryData {
  student_id: string
  subject_id: string
  class_id: string
  academic_term: string
  ca_score: number
  exam_score: number
  remark?: string
}

export interface GradingScale {
  grade: string
  min_score: number
  max_score: number
  grade_point: number
  remark: string
}

export const GRADING_SCALES: GradingScale[] = [
  { grade: 'A', min_score: 70, max_score: 100, grade_point: 4.0, remark: 'Excellent' },
  { grade: 'B', min_score: 60, max_score: 69, grade_point: 3.5, remark: 'Very Good' },
  { grade: 'C', min_score: 50, max_score: 59, grade_point: 3.0, remark: 'Good' },
  { grade: 'D', min_score: 45, max_score: 49, grade_point: 2.5, remark: 'Fair' },
  { grade: 'E', min_score: 40, max_score: 44, grade_point: 2.0, remark: 'Pass' },
  { grade: 'F', min_score: 0, max_score: 39, grade_point: 0.0, remark: 'Fail' },
]

export interface StudentResultSummary {
  student_id: string
  student_name: string
  admission_number: string
  class_name: string
  class_code: string
  term: string
  session: string
  subjects: Array<{
    subject_id: string
    subject_name: string
    subject_code: string
    ca_score: number
    exam_score: number
    total_score: number
    grade: string
    grade_point: number
    remark: string
    credit_units: number
  }>
  total_credits: number
  total_grade_points: number
  gpa: number
  cgpa: number
  class_average?: number
  position?: number
  total_students?: number
  principal_remark?: string
  teacher_remark?: string
}

export interface ResultApprovalQueue {
  id: string
  student_name: string
  admission_number: string
  class_name: string
  subject_name: string
  teacher_name: string
  entry_date: string
  status: ResultStatus
}