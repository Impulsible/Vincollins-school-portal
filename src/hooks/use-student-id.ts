import { useState } from 'react'

export interface StudentGenerationData {
  section: 'creche' | 'nursery' | 'primary' | 'college'
  year?: string
  sequence?: number
}

export interface BulkStudentGenerationData extends StudentGenerationData {
  count: number
  startingNumber?: number
}

export interface ParsedStudentId {
  year: string
  section: string
  sectionCode: string
  sequence: string
  className?: string
  sectionName?: string
}

export function useStudentId() {
  const [isLoading, setIsLoading] = useState(false)

  const getSectionCode = (section: string): string => {
    const codes: Record<string, string> = {
      creche: 'CR',
      nursery: 'NS',
      primary: 'PR',
      college: 'CL',
    }
    return codes[section] || 'XX'
  }

  const generateStudentId = async (data: StudentGenerationData): Promise<string> => {
    setIsLoading(true)
    try {
      const year = data.year || new Date().getFullYear().toString().slice(-2)
      const sectionCode = getSectionCode(data.section)
      const sequence = (data.sequence || 1).toString().padStart(4, '0')
      
      return `VSP-${year}-${sectionCode}-${sequence}`
    } finally {
      setIsLoading(false)
    }
  }

  const generateBulkStudentIds = async (data: BulkStudentGenerationData): Promise<string[]> => {
    setIsLoading(true)
    try {
      const ids: string[] = []
      const year = data.year || new Date().getFullYear().toString().slice(-2)
      const sectionCode = getSectionCode(data.section)
      const startingNumber = data.startingNumber || 1

      for (let i = 0; i < data.count; i++) {
        const sequence = (startingNumber + i).toString().padStart(4, '0')
        ids.push(`VSP-${year}-${sectionCode}-${sequence}`)
      }

      return ids
    } finally {
      setIsLoading(false)
    }
  }

  const validateStudentId = (studentId: string): boolean => {
    const pattern = /^VSP-\d{2}-[A-Z]{2}-\d{4}$/
    return pattern.test(studentId)
  }

  const parseStudentId = (studentId: string): ParsedStudentId | null => {
    if (!validateStudentId(studentId)) return null

    const [, year, sectionCode, sequence] = studentId.split('-')
    
    const sectionMap: Record<string, { name: string; className: string }> = {
      CR: { name: 'Creche', className: 'Creche/Playgroup' },
      NS: { name: 'Nursery', className: 'Nursery' },
      PR: { name: 'Primary', className: 'Primary' },
      CL: { name: 'College', className: 'College' },
    }

    const section = sectionMap[sectionCode] || { name: 'Unknown', className: 'Unknown' }

    return {
      year,
      section: section.name,
      sectionCode,
      sequence,
      className: section.className,
      sectionName: section.name,
    }
  }

  return {
    generateStudentId,
    generateBulkStudentIds,
    validateStudentId,
    parseStudentId,
    isLoading,
  }
}