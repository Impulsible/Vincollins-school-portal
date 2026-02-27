export interface Assignment {
  id: string
  title: string
  description: string
  class_id: string
  subject_id: string
  teacher_id: string
  due_date: string
  file_url: string | null
  total_marks: number
  status: 'draft' | 'published' | 'closed'
}

export interface AssignmentSubmission {
  id: string
  assignment_id: string
  student_id: string
  submission_date: string
  file_url: string | null
  comments: string | null
  marks_obtained: number | null
  graded_by: string | null
  graded_at: string | null
  status: 'submitted' | 'graded' | 'late'
}

export interface AssignmentWithDetails extends Assignment {
  class?: {
    id: string
    name: string
    code: string
  }
  subject?: {
    id: string
    name: string
    code: string
  }
  teacher?: {
    user: {
      first_name: string
      last_name: string
    }
  }
  submissions?: AssignmentSubmission[]
  submissionCount?: number
  gradedCount?: number
}