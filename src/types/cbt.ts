export interface CBTExam {
  id: string
  title: string
  description: string | null
  class_id: string
  subject_id: string
  teacher_id: string
  duration_minutes: number
  total_marks: number
  pass_mark: number
  scheduled_start: string
  scheduled_end: string
  instructions: string | null
  status: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'graded'
}

export interface CBTQuestion {
  id: string
  exam_id: string
  question_text: string
  question_type: 'objective' | 'theory'
  options: string[] | null
  correct_answer: string | null
  marks: number
  order_index: number
}

export interface CBTSubmission {
  id: string
  exam_id: string
  student_id: string
  answers: {
    [questionId: string]: string | string[]
  }
  objective_score: number | null
  theory_score: number | null
  total_score: number | null
  started_at: string
  submitted_at: string | null
  status: 'in_progress' | 'submitted' | 'graded'
}

export interface CBTExamWithDetails extends CBTExam {
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
  questions?: CBTQuestion[]
  submissions?: CBTSubmission[]
}

export interface TimerState {
  minutes: number
  seconds: number
  isActive: boolean
  isPaused: boolean
}