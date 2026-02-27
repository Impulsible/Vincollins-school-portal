import { Database } from './supabase'
import { Staff } from './user'

export type Class = Database['public']['Tables']['classes']['Row']
export type Subject = Database['public']['Tables']['subjects']['Row']
export type ClassSubject = Database['public']['Tables']['class_subjects']['Row']

export interface ClassWithDetails extends Class {
  formTeacher?: Staff
  subjects?: Subject[]
  studentCount?: number
}

export interface SubjectWithTeachers extends Subject {
  teachers?: Staff[]
  classes?: Class[]
}

export interface AcademicTerm {
  id: string
  name: string
  code: string
  academicYear: string
  startDate: string
  endDate: string
  isCurrent: boolean
}