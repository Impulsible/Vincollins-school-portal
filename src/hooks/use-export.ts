'use client'

import { useState, useCallback } from 'react'
import { useToast } from './use-toast'
import { exportToPDF, exportToExcel, exportToCSV } from '@/lib/utils/export-utils'

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)
  const { success, error } = useToast()

  const exportData = useCallback(async (
    data: any[],
    format: 'pdf' | 'excel' | 'csv',
    options: {
      title: string
      filename: string
      headers: string[]
      mapRow: (item: any) => any[]
    }
  ) => {
    setIsExporting(true)
    try {
      const mappedData = data.map(options.mapRow)

      const exportOptions = {
        title: options.title,
        filename: options.filename,
        headers: options.headers,
        data: mappedData,
      }

      switch (format) {
        case 'pdf':
          await exportToPDF(exportOptions)
          break
        case 'excel':
          exportToExcel(exportOptions)
          break
        case 'csv':
          exportToCSV(exportOptions)
          break
      }

      success(`Data exported successfully as ${format.toUpperCase()}`)
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }, [success, error])

  const exportResults = useCallback((
    results: any[],
    format: 'pdf' | 'excel' | 'csv',
    studentName: string,
    term: string
  ) => {
    return exportData(results, format, {
      title: `Results - ${studentName} - ${term}`,
      filename: `results_${studentName.replace(/\s/g, '_')}_${term.replace(/\s/g, '_')}`,
      headers: ['Subject', 'CA', 'Exam', 'Total', 'Grade', 'Remark'],
      mapRow: (r) => [
        r.subject_name,
        r.ca_score,
        r.exam_score,
        r.total_score,
        r.grade,
        r.remark,
      ],
    })
  }, [exportData])

  const exportStudentList = useCallback((
    students: any[],
    format: 'pdf' | 'excel' | 'csv',
    className: string
  ) => {
    return exportData(students, format, {
      title: `Student List - ${className}`,
      filename: `students_${className.replace(/\s/g, '_')}`,
      headers: ['Admission No.', 'Name', 'Gender', 'Parent Name', 'Parent Phone'],
      mapRow: (s) => [
        s.admission_number,
        s.name,
        s.gender,
        s.parent_name,
        s.parent_phone,
      ],
    })
  }, [exportData])

  const exportStaffList = useCallback((
    staff: any[],
    format: 'pdf' | 'excel' | 'csv'
  ) => {
    return exportData(staff, format, {
      title: 'Staff List',
      filename: 'staff_list',
      headers: ['Staff No.', 'Name', 'Department', 'Designation', 'Email', 'Phone'],
      mapRow: (s) => [
        s.staff_number,
        s.name,
        s.department,
        s.designation,
        s.email,
        s.phone,
      ],
    })
  }, [exportData])

  const exportAttendance = useCallback((
    attendance: any[],
    format: 'pdf' | 'excel' | 'csv',
    className: string,
    month: string
  ) => {
    return exportData(attendance, format, {
      title: `Attendance - ${className} - ${month}`,
      filename: `attendance_${className.replace(/\s/g, '_')}_${month.replace(/\s/g, '_')}`,
      headers: ['Date', 'Present', 'Absent', 'Late', 'Total', 'Rate %'],
      mapRow: (a) => [
        a.date,
        a.present,
        a.absent,
        a.late,
        a.total,
        a.rate.toFixed(2),
      ],
    })
  }, [exportData])

  return {
    isExporting,
    exportResults,
    exportStudentList,
    exportStaffList,
    exportAttendance,
    exportData,
  }
}