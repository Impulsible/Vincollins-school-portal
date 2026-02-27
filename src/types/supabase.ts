export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'student' | 'staff' | 'admin' | 'parent'
          first_name: string
          last_name: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'student' | 'staff' | 'admin' | 'parent'
          first_name: string
          last_name: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'student' | 'staff' | 'admin' | 'parent'
          first_name?: string
          last_name?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          admission_number: string
          class_id: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          address: string | null
          parent_name: string | null
          parent_phone: string | null
          parent_email: string | null
          enrollment_date: string
          current_cgpa: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          admission_number: string
          class_id: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          address?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_email?: string | null
          enrollment_date?: string
          current_cgpa?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          admission_number?: string
          class_id?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other'
          address?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_email?: string | null
          enrollment_date?: string
          current_cgpa?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          user_id: string
          staff_number: string
          department: string
          designation: string
          qualification: string | null
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          address: string | null
          emergency_contact: string | null
          employment_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          staff_number: string
          department: string
          designation: string
          qualification?: string | null
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          address?: string | null
          emergency_contact?: string | null
          employment_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          staff_number?: string
          department?: string
          designation?: string
          qualification?: string | null
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other'
          address?: string | null
          emergency_contact?: string | null
          employment_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          section: 'creche' | 'nursery' | 'primary' | 'college'
          code: string
          academic_year: string
          form_teacher_id: string | null
          capacity: number
          current_enrollment: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          section: 'creche' | 'nursery' | 'primary' | 'college'
          code: string
          academic_year: string
          form_teacher_id?: string | null
          capacity: number
          current_enrollment?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          section?: 'creche' | 'nursery' | 'primary' | 'college'
          code?: string
          academic_year?: string
          form_teacher_id?: string | null
          capacity?: number
          current_enrollment?: number
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          code: string
          section: 'creche' | 'nursery' | 'primary' | 'college'
          is_core: boolean
          credit_units: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          section: 'creche' | 'nursery' | 'primary' | 'college'
          is_core?: boolean
          credit_units?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          section?: 'creche' | 'nursery' | 'primary' | 'college'
          is_core?: boolean
          credit_units?: number
          created_at?: string
          updated_at?: string
        }
      }
      class_subjects: {
        Row: {
          id: string
          class_id: string
          subject_id: string
          teacher_id: string
          academic_term: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          subject_id: string
          teacher_id: string
          academic_term: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string
          academic_term?: string
          created_at?: string
          updated_at?: string
        }
      }
      results: {
        Row: {
          id: string
          student_id: string
          class_id: string
          subject_id: string
          academic_term: string
          ca_score: number
          exam_score: number
          total_score: number
          grade: string
          remark: string | null
          entered_by: string
          approved_by: string | null
          approved_at: string | null
          status: 'draft' | 'pending' | 'approved' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          class_id: string
          subject_id: string
          academic_term: string
          ca_score: number
          exam_score: number
          total_score: number
          grade: string
          remark?: string | null
          entered_by: string
          approved_by?: string | null
          approved_at?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          class_id?: string
          subject_id?: string
          academic_term?: string
          ca_score?: number
          exam_score?: number
          total_score?: number
          grade?: string
          remark?: string | null
          entered_by?: string
          approved_by?: string | null
          approved_at?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          class_id: string
          subject_id: string
          teacher_id: string
          due_date: string
          file_url?: string | null
          total_marks: number
          status?: 'draft' | 'published' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string
          due_date?: string
          file_url?: string | null
          total_marks?: number
          status?: 'draft' | 'published' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
      assignment_submissions: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          submission_date?: string
          file_url?: string | null
          comments?: string | null
          marks_obtained?: number | null
          graded_by?: string | null
          graded_at?: string | null
          status?: 'submitted' | 'graded' | 'late'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          submission_date?: string
          file_url?: string | null
          comments?: string | null
          marks_obtained?: number | null
          graded_by?: string | null
          graded_at?: string | null
          status?: 'submitted' | 'graded' | 'late'
          created_at?: string
          updated_at?: string
        }
      }
      timetable_entries: {
        Row: {
          id: string
          class_id: string
          subject_id: string
          teacher_id: string
          day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6
          start_time: string
          end_time: string
          room: string | null
          academic_term: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          subject_id: string
          teacher_id: string
          day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6
          start_time: string
          end_time: string
          room?: string | null
          academic_term: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string
          day_of_week?: 0 | 1 | 2 | 3 | 4 | 5 | 6
          start_time?: string
          end_time?: string
          room?: string | null
          academic_term?: string
          created_at?: string
          updated_at?: string
        }
      }
      cbt_exams: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          class_id: string
          subject_id: string
          teacher_id: string
          duration_minutes: number
          total_marks: number
          pass_mark: number
          scheduled_start: string
          scheduled_end: string
          instructions?: string | null
          status?: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'graded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          class_id?: string
          subject_id?: string
          teacher_id?: string
          duration_minutes?: number
          total_marks?: number
          pass_mark?: number
          scheduled_start?: string
          scheduled_end?: string
          instructions?: string | null
          status?: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'graded'
          created_at?: string
          updated_at?: string
        }
      }
      cbt_questions: {
        Row: {
          id: string
          exam_id: string
          question_text: string
          question_type: 'objective' | 'theory'
          options: Json | null
          correct_answer: string | null
          marks: number
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          question_text: string
          question_type: 'objective' | 'theory'
          options?: Json | null
          correct_answer?: string | null
          marks: number
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          question_text?: string
          question_type?: 'objective' | 'theory'
          options?: Json | null
          correct_answer?: string | null
          marks?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      cbt_submissions: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          answers: Json
          objective_score: number | null
          theory_score: number | null
          total_score: number | null
          started_at: string
          submitted_at: string | null
          graded_by: string | null
          graded_at: string | null
          status: 'in_progress' | 'submitted' | 'graded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          answers: Json
          objective_score?: number | null
          theory_score?: number | null
          total_score?: number | null
          started_at?: string
          submitted_at?: string | null
          graded_by?: string | null
          graded_at?: string | null
          status?: 'in_progress' | 'submitted' | 'graded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          answers?: Json
          objective_score?: number | null
          theory_score?: number | null
          total_score?: number | null
          started_at?: string
          submitted_at?: string | null
          graded_by?: string | null
          graded_at?: string | null
          status?: 'in_progress' | 'submitted' | 'graded'
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'document' | 'video' | 'link'
          file_url: string | null
          class_id: string | null
          subject_id: string | null
          uploaded_by: string
          status: 'draft' | 'published'
            created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'document' | 'video' | 'link'
          file_url?: string | null
          class_id?: string | null
          subject_id?: string | null
          uploaded_by: string
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'document' | 'video' | 'link'
          file_url?: string | null
          class_id?: string | null
          subject_id?: string | null
          uploaded_by?: string
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_gpa: {
        Args: {
          student_id_param: string
          term_param: string
        }
        Returns: number
      }
      calculate_cgpa: {
        Args: {
          student_id_param: string
        }
        Returns: number
      }
      generate_admission_number: {
        Args: {
          class_code: string
        }
        Returns: string
      }
      generate_staff_number: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      user_role: 'student' | 'staff' | 'admin' | 'parent'
      gender: 'male' | 'female' | 'other'
      section: 'creche' | 'nursery' | 'primary' | 'college'
      result_status: 'draft' | 'pending' | 'approved' | 'published'
      assignment_status: 'draft' | 'published' | 'closed'
      submission_status: 'submitted' | 'graded' | 'late'
      cbt_status: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'graded'
      question_type: 'objective' | 'theory'
      resource_type: 'document' | 'video' | 'link'
      resource_status: 'draft' | 'published'
    }
  }
}