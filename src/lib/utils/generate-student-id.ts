/**
 * Student ID Format Options:
 * 
 * 1. Standard: VSP-YY-CLASS-XXXX
 *    VSP: Vincollins School Portal
 *    YY: Last two digits of admission year
 *    CLASS: Class code (e.g., JSS1, SSS2, PRY5, NUR2, CRE)
 *    XXXX: Sequential number (padded to 4 digits)
 *    Example: VSP-24-JSS1-0045
 * 
 * 2. Year Only: VSP-YY-XXXXX
 *    YY: Last two digits of admission year
 *    XXXXX: 5-digit sequential number
 *    Example: VSP-24-00123
 * 
 * 3. Section Based: VSP-SEC-YY-XXXX
 *    SEC: Section code (CRE, NUR, PRY, COL)
 *    YY: Last two digits of admission year
 *    XXXX: 4-digit sequential number
 *    Example: VSP-PRY-24-0123
 * 
 * 4. Legacy: VSP-L-ORIGINAL-ID
 *    For students migrated from existing system
 *    Example: VSP-L-20201234
 */

export interface StudentIdOptions {
  format?: 'standard' | 'year-only' | 'section' | 'legacy'
  classCode?: string
  section?: 'creche' | 'nursery' | 'primary' | 'college'
  year?: number
  startSequence?: number
  originalId?: string
}

export interface ParsedStudentId {
  isValid: boolean
  prefix?: string
  format?: 'standard' | 'year-only' | 'section' | 'legacy'
  year?: number
  classCode?: string
  section?: string
  sequence?: number
  originalId?: string
  isLegacy?: boolean
}

// Section to code mapping
export const SECTION_CODES = {
  creche: 'CRE',
  nursery: 'NUR',
  primary: 'PRY',
  college: 'COL',
} as const

// Class code mappings
export const CLASS_CODES = {
  // Creche
  'Creche 1': 'CRE1',
  'Creche 2': 'CRE2',
  
  // Nursery
  'Nursery 1': 'NUR1',
  'Nursery 2': 'NUR2',
  'Nursery 3': 'NUR3',
  
  // Primary
  'Primary 1': 'PRY1',
  'Primary 2': 'PRY2',
  'Primary 3': 'PRY3',
  'Primary 4': 'PRY4',
  'Primary 5': 'PRY5',
  'Primary 6': 'PRY6',
  
  // College (Junior)
  'JSS 1': 'JSS1',
  'JSS 2': 'JSS2',
  'JSS 3': 'JSS3',
  
  // College (Senior)
  'SSS 1': 'SSS1',
  'SSS 2': 'SSS2',
  'SSS 3': 'SSS3',
} as const

export type ClassCode = keyof typeof CLASS_CODES

/**
 * Generate student ID in standard format
 * VSP-YY-CLASS-XXXX
 */
export function generateStandardStudentId(
  classCode: string,
  year?: number
): string {
  const currentYear = year || new Date().getFullYear()
  const yearSuffix = currentYear.toString().slice(-2)
  const classCodeUpper = classCode.toUpperCase()
  
  const sequence = getNextStudentSequence('standard', `${yearSuffix}-${classCodeUpper}`)
  
  return `VSP-${yearSuffix}-${classCodeUpper}-${sequence.toString().padStart(4, '0')}`
}

/**
 * Generate student ID in year-only format
 * VSP-YY-XXXXX
 */
export function generateYearOnlyStudentId(year?: number): string {
  const currentYear = year || new Date().getFullYear()
  const yearSuffix = currentYear.toString().slice(-2)
  
  const sequence = getNextStudentSequence('year-only', yearSuffix)
  
  return `VSP-${yearSuffix}-${sequence.toString().padStart(5, '0')}`
}

/**
 * Generate student ID in section format
 * VSP-SEC-YY-XXXX
 */
export function generateSectionStudentId(
  section: 'creche' | 'nursery' | 'primary' | 'college',
  year?: number
): string {
  const currentYear = year || new Date().getFullYear()
  const yearSuffix = currentYear.toString().slice(-2)
  const sectionCode = SECTION_CODES[section]
  
  const sequence = getNextStudentSequence('section', `${sectionCode}-${yearSuffix}`)
  
  return `VSP-${sectionCode}-${yearSuffix}-${sequence.toString().padStart(4, '0')}`
}

/**
 * Generate legacy student ID
 * VSP-L-ORIGINAL-ID
 */
export function generateLegacyStudentId(originalId: string): string {
  // Remove any existing VSP prefix to avoid duplication
  const cleanId = originalId.replace(/^VSP-?/i, '')
  return `VSP-L-${cleanId}`
}

/**
 * Main function to generate student ID based on options
 */
export function generateStudentId(options: StudentIdOptions): string {
  const { format = 'standard', classCode, section, year, originalId } = options

  switch (format) {
    case 'standard':
      if (!classCode) {
        throw new Error('Class code is required for standard format')
      }
      return generateStandardStudentId(classCode, year)
    
    case 'year-only':
      return generateYearOnlyStudentId(year)
    
    case 'section':
      if (!section) {
        throw new Error('Section is required for section format')
      }
      return generateSectionStudentId(section, year)
    
    case 'legacy':
      if (!originalId) {
        throw new Error('Original ID is required for legacy format')
      }
      return generateLegacyStudentId(originalId)
    
    default:
      throw new Error('Invalid format specified')
  }
}

/**
 * Parse and validate a student ID
 */
export function parseStudentId(studentId: string): ParsedStudentId {
  // Standard format: VSP-YY-CLASS-XXXX
  const standardPattern = /^VSP-(\d{2})-([A-Z0-9]{3,4})-(\d{4})$/
  // Year-only format: VSP-YY-XXXXX
  const yearOnlyPattern = /^VSP-(\d{2})-(\d{5})$/
  // Section format: VSP-SEC-YY-XXXX
  const sectionPattern = /^VSP-([A-Z]{3})-(\d{2})-(\d{4})$/
  // Legacy format: VSP-L-*
  const legacyPattern = /^VSP-L-(.+)$/

  if (standardPattern.test(studentId)) {
    const [, year, classCode, sequence] = studentId.match(standardPattern)!
    return {
      isValid: true,
      format: 'standard',
      year: parseInt(`20${year}`),
      classCode,
      sequence: parseInt(sequence),
      isLegacy: false
    }
  }

  if (yearOnlyPattern.test(studentId)) {
    const [, year, sequence] = studentId.match(yearOnlyPattern)!
    return {
      isValid: true,
      format: 'year-only',
      year: parseInt(`20${year}`),
      sequence: parseInt(sequence),
      isLegacy: false
    }
  }

  if (sectionPattern.test(studentId)) {
    const [, section, year, sequence] = studentId.match(sectionPattern)!
    return {
      isValid: true,
      format: 'section',
      section,
      year: parseInt(`20${year}`),
      sequence: parseInt(sequence),
      isLegacy: false
    }
  }

  if (legacyPattern.test(studentId)) {
    const [, originalId] = studentId.match(legacyPattern)!
    return {
      isValid: true,
      format: 'legacy',
      originalId,
      isLegacy: true
    }
  }

  return { isValid: false }
}

/**
 * Generate batch of student IDs
 */
export function generateBatchStudentIds(
  count: number,
  options: StudentIdOptions
): string[] {
  const ids: string[] = []
  const { format = 'standard', classCode, section, year } = options
  
  for (let i = 0; i < count; i++) {
    let id: string
    
    switch (format) {
      case 'standard':
        if (!classCode) throw new Error('Class code required')
        id = generateStandardStudentId(classCode, year)
        break
      case 'year-only':
        id = generateYearOnlyStudentId(year)
        break
      case 'section':
        if (!section) throw new Error('Section required')
        id = generateSectionStudentId(section, year)
        break
      default:
        throw new Error('Invalid format for batch generation')
    }
    
    ids.push(id)
  }
  
  return ids
}

/**
 * Generate username from student ID and name
 */
export function generateStudentUsername(
  firstName: string,
  lastName: string,
  studentId: string
): string {
  const first = firstName.toLowerCase().replace(/[^a-z]/g, '')
  const last = lastName.toLowerCase().replace(/[^a-z]/g, '')
  
  // Extract the last part of the ID (sequence number)
  const parsed = parseStudentId(studentId)
  const sequence = parsed.sequence || studentId.split('-').pop() || '0000'
  
  return `${first}.${last}.${sequence}@vincollins.edu.ng`
}

/**
 * Generate student ID card/badge number
 */
export function generateStudentBadgeNumber(studentId: string): string {
  const parsed = parseStudentId(studentId)
  if (!parsed.isValid) return 'INVALID'
  
  if (parsed.format === 'legacy') {
    return `VC-L-${parsed.originalId?.slice(-6)}`
  }
  
  // Format: VC-YYYY-XXXXX
  const year = parsed.year || new Date().getFullYear()
  const seq = parsed.sequence?.toString().padStart(5, '0') || '00000'
  
  return `VC-${year}-${seq}`
}

/**
 * Get class name from class code
 */
export function getClassNameFromCode(classCode: string): string | undefined {
  const entry = Object.entries(CLASS_CODES).find(([, code]) => code === classCode)
  return entry ? entry[0] : undefined
}

/**
 * Get class code from class name
 */
export function getClassCodeFromName(className: string): string | undefined {
  return CLASS_CODES[className as ClassCode]
}

/**
 * Get section from class code
 */
export function getSectionFromClassCode(classCode: string): string | undefined {
  if (classCode.startsWith('CRE')) return 'creche'
  if (classCode.startsWith('NUR')) return 'nursery'
  if (classCode.startsWith('PRY')) return 'primary'
  if (classCode.startsWith('JSS') || classCode.startsWith('SSS')) return 'college'
  return undefined
}

// In-memory sequence tracker (in production, this would be in database)
const studentSequenceTracker: Map<string, number> = new Map()

function getNextStudentSequence(format: string, key: string): number {
  const trackerKey = `${format}-${key}`
  const currentSeq = studentSequenceTracker.get(trackerKey) || 0
  const nextSeq = currentSeq + 1
  studentSequenceTracker.set(trackerKey, nextSeq)
  return nextSeq
}

// Initialize with some sequences (for testing/development)
export function initializeStudentSequences(
  initialData: Array<{ key: string; sequence: number }>
) {
  initialData.forEach(({ key, sequence }) => {
    studentSequenceTracker.set(key, sequence)
  })
}

// Reset sequences (for testing)
export function resetStudentSequences() {
  studentSequenceTracker.clear()
}

// Get current sequence for a key
export function getStudentSequence(key: string): number {
  return studentSequenceTracker.get(key) || 0
}