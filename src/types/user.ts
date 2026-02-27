export type UserRole = 'student' | 'staff' | 'admin' | 'super_admin'

export interface BaseUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  phone?: string
  address?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Student extends BaseUser {
  role: 'student'
  studentId: string
  classId: string
  admissionNumber: string
  dateOfBirth: Date
  gender: 'male' | 'female'
  guardianName: string
  guardianPhone: string
  guardianEmail?: string
  enrollmentDate: Date
  currentSessionId: string
  cgpa?: number
  totalCredits?: number
}

export interface Staff extends BaseUser {
  role: 'staff'
  staffId: string
  department: string
  subjects: string[]
  qualification: string
  dateOfEmployment: Date
  isClassTeacher?: boolean
  classId?: string
}

export interface Admin extends BaseUser {
  role: 'admin' | 'super_admin'
  permissions: string[]
  department?: string
}

export type User = Student | Staff | Admin