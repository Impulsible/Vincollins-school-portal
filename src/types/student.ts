import { SECTION_CODES, CLASS_CODES } from '@/lib/utils/generate-student-id'

export interface StudentGenerationOptions {
  format?: 'standard' | 'year-only' | 'section' | 'legacy'
  classCode?: string
  className?: string
  section?: 'creche' | 'nursery' | 'primary' | 'college'
  year?: number
  count?: number
  originalId?: string
}

export interface ParsedStudentId {
  isValid: boolean
  format?: 'standard' | 'year-only' | 'section' | 'legacy'
  year?: number
  classCode?: string
  className?: string
  section?: string
  sectionName?: string
  sequence?: number
  originalId?: string
  isLegacy?: boolean
  fullId: string
}

export interface StudentBulkGenerationResult {
  ids: string[]
  startSequence: number
  endSequence: number
  count: number
  format: string
  classCode?: string
  section?: string
  year: number
  timestamp: Date
}

export interface StudentClassInfo {
  code: string
  name: string
  section: 'creche' | 'nursery' | 'primary' | 'college'
  sectionCode: string
}

export const STUDENT_CLASSES: StudentClassInfo[] = [
  // Creche
  { code: 'CRE1', name: 'Creche 1', section: 'creche', sectionCode: 'CRE' },
  { code: 'CRE2', name: 'Creche 2', section: 'creche', sectionCode: 'CRE' },
  
  // Nursery
  { code: 'NUR1', name: 'Nursery 1', section: 'nursery', sectionCode: 'NUR' },
  { code: 'NUR2', name: 'Nursery 2', section: 'nursery', sectionCode: 'NUR' },
  { code: 'NUR3', name: 'Nursery 3', section: 'nursery', sectionCode: 'NUR' },
  
  // Primary
  { code: 'PRY1', name: 'Primary 1', section: 'primary', sectionCode: 'PRY' },
  { code: 'PRY2', name: 'Primary 2', section: 'primary', sectionCode: 'PRY' },
  { code: 'PRY3', name: 'Primary 3', section: 'primary', sectionCode: 'PRY' },
  { code: 'PRY4', name: 'Primary 4', section: 'primary', sectionCode: 'PRY' },
  { code: 'PRY5', name: 'Primary 5', section: 'primary', sectionCode: 'PRY' },
  { code: 'PRY6', name: 'Primary 6', section: 'primary', sectionCode: 'PRY' },
  
  // College (Junior)
  { code: 'JSS1', name: 'JSS 1', section: 'college', sectionCode: 'COL' },
  { code: 'JSS2', name: 'JSS 2', section: 'college', sectionCode: 'COL' },
  { code: 'JSS3', name: 'JSS 3', section: 'college', sectionCode: 'COL' },
  
  // College (Senior)
  { code: 'SSS1', name: 'SSS 1', section: 'college', sectionCode: 'COL' },
  { code: 'SSS2', name: 'SSS 2', section: 'college', sectionCode: 'COL' },
  { code: 'SSS3', name: 'SSS 3', section: 'college', sectionCode: 'COL' },
]

export const SECTIONS = [
  { code: 'CRE', name: 'Creche/Playgroup', value: 'creche' },
  { code: 'NUR', name: 'Nursery', value: 'nursery' },
  { code: 'PRY', name: 'Primary', value: 'primary' },
  { code: 'COL', name: 'College', value: 'college' },
] as const