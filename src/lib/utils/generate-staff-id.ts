/**
 * Staff ID Format: VSP-STF-YYYY-XXXX
 * VSP: Vincollins School Portal
 * STF: Staff
 * YYYY: Year of joining
 * XXXX: Sequential number (padded to 4 digits)
 * 
 * Examples: VSP-STF-2024-0001, VSP-STF-2024-0045, VSP-STF-2025-0001
 */

export function generateStaffId(year?: number): string {
  const currentYear = year || new Date().getFullYear()
  const yearStr = currentYear.toString()
  
  // Get the latest sequence number for the year
  // In production, this would query the database
  const sequence = getNextStaffSequence(yearStr)
  
  return `VSP-STF-${yearStr}-${sequence.toString().padStart(4, '0')}`
}

/**
 * Staff ID Format (Alternative with Department):
 * VSP-STF-DEPT-YYYY-XXXX
 * DEPT: Department code (2-3 letters)
 * 
 * Examples: VSP-STF-TCH-2024-0001 (Teaching), 
 *          VSP-STF-ADM-2024-0001 (Administrative),
 *          VSP-STF-SPT-2024-0001 (Support)
 */

export function generateStaffIdWithDepartment(departmentCode: string, year?: number): string {
  const currentYear = year || new Date().getFullYear()
  const yearStr = currentYear.toString()
  const deptCode = departmentCode.toUpperCase().substring(0, 3)
  
  const sequence = getNextStaffSequence(yearStr, deptCode)
  
  return `VSP-STF-${deptCode}-${yearStr}-${sequence.toString().padStart(4, '0')}`
}

/**
 * Staff ID Format (Simplified):
 * VSP-STF-XXXXX
 * XXXXX: 5-digit sequential number
 * 
 * Examples: VSP-STF-00001, VSP-STF-00123, VSP-STF-99999
 */

export function generateSimplifiedStaffId(): string {
  const sequence = getNextStaffSequence()
  return `VSP-STF-${sequence.toString().padStart(5, '0')}`
}

/**
 * Staff ID Format (Legacy/Existing Staff):
 * VSP-STF-L-YYYY-XXXX
 * L: Legacy indicator for existing staff migrated to the system
 * 
 * Examples: VSP-STF-L-2020-0123, VSP-STF-L-2019-0456
 */

export function generateLegacyStaffId(originalYear: number, originalNumber: number): string {
  const yearStr = originalYear.toString()
  return `VSP-STF-L-${yearStr}-${originalNumber.toString().padStart(4, '0')}`
}

/**
 * Parse and validate a staff ID
 * Returns: {
 *   isValid: boolean,
 *   prefix?: string,
 *   type?: string,
 *   department?: string,
 *   year?: number,
 *   sequence?: number,
 *   isLegacy?: boolean
 * }
 */

export function parseStaffId(staffId: string): {
  isValid: boolean
  prefix?: string
  type?: string
  department?: string
  year?: number
  sequence?: number
  isLegacy?: boolean
} {
  // Pattern: VSP-STF-YYYY-XXXX
  const standardPattern = /^VSP-STF-(\d{4})-(\d{4})$/
  // Pattern: VSP-STF-DEPT-YYYY-XXXX
  const deptPattern = /^VSP-STF-([A-Z]{2,3})-(\d{4})-(\d{4})$/
  // Pattern: VSP-STF-XXXXX
  const simplifiedPattern = /^VSP-STF-(\d{5})$/
  // Pattern: VSP-STF-L-YYYY-XXXX
  const legacyPattern = /^VSP-STF-L-(\d{4})-(\d{4})$/

  if (standardPattern.test(staffId)) {
    const [, year, sequence] = staffId.match(standardPattern)!
    return {
      isValid: true,
      prefix: 'VSP',
      type: 'STF',
      year: parseInt(year),
      sequence: parseInt(sequence),
      isLegacy: false
    }
  }

  if (deptPattern.test(staffId)) {
    const [, dept, year, sequence] = staffId.match(deptPattern)!
    return {
      isValid: true,
      prefix: 'VSP',
      type: 'STF',
      department: dept,
      year: parseInt(year),
      sequence: parseInt(sequence),
      isLegacy: false
    }
  }

  if (simplifiedPattern.test(staffId)) {
    const [, sequence] = staffId.match(simplifiedPattern)!
    return {
      isValid: true,
      prefix: 'VSP',
      type: 'STF',
      sequence: parseInt(sequence),
      isLegacy: false
    }
  }

  if (legacyPattern.test(staffId)) {
    const [, year, sequence] = staffId.match(legacyPattern)!
    return {
      isValid: true,
      prefix: 'VSP',
      type: 'STF',
      year: parseInt(year),
      sequence: parseInt(sequence),
      isLegacy: true
    }
  }

  return { isValid: false }
}

/**
 * Generate a batch of staff IDs
 */

export function generateBatchStaffIds(
  count: number,
  options?: {
    departmentCode?: string
    year?: number
    startSequence?: number
  }
): string[] {
  const ids: string[] = []
  const startSeq = options?.startSequence || 1
  const year = options?.year || new Date().getFullYear()
  
  for (let i = 0; i < count; i++) {
    const sequence = startSeq + i
    if (options?.departmentCode) {
      ids.push(generateStaffIdWithDepartment(options.departmentCode, year))
    } else {
      ids.push(generateStaffId(year))
    }
    // In production, you'd need to ensure sequence numbers are tracked properly
  }
  
  return ids
}

/**
 * Generate staff ID from full name (for display/email)
 */

export function generateStaffUsername(firstName: string, lastName: string, staffId: string): string {
  const first = firstName.toLowerCase().replace(/[^a-z]/g, '')
  const last = lastName.toLowerCase().replace(/[^a-z]/g, '')
  const idPart = staffId.split('-').pop() // Get the last part (sequence)
  
  return `${first}.${last}.${idPart}@vincollins.edu.ng`
}

/**
 * Generate staff card/badge number
 */

export function generateStaffBadgeNumber(staffId: string): string {
  const parsed = parseStaffId(staffId)
  if (!parsed.isValid) return 'INVALID'
  
  // Format: VC-XXXXX (for badge/ID card)
  return `VC-${parsed.sequence?.toString().padStart(5, '0') || '00000'}`
}

// In-memory sequence tracker (in production, this would be in database)
const sequenceTracker: Map<string, number> = new Map()

function getNextStaffSequence(year?: string, department?: string): number {
  const key = department ? `${year}-${department}` : year || 'global'
  const currentSeq = sequenceTracker.get(key) || 0
  const nextSeq = currentSeq + 1
  sequenceTracker.set(key, nextSeq)
  return nextSeq
}

// Initialize with some sequences (in production, load from database)
export function initializeStaffSequences(initialData: Array<{ key: string; sequence: number }>) {
  initialData.forEach(({ key, sequence }) => {
    sequenceTracker.set(key, sequence)
  })
}

// Reset sequences (for testing)
export function resetStaffSequences() {
  sequenceTracker.clear()
}

// Get current sequence for a key
export function getStaffSequence(key: string): number {
  return sequenceTracker.get(key) || 0
}