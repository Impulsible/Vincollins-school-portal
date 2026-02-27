import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface ExportOptions {
  title: string
  filename: string
  headers: string[]
  data: any[][]
  orientation?: 'portrait' | 'landscape'
  pageSize?: 'a4' | 'letter'
}

export async function exportToPDF(options: ExportOptions) {
  const doc = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: options.pageSize || 'a4',
  })

  // Add title
  doc.setFontSize(16)
  doc.text(options.title, 14, 20)
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27)

  // Add table
  autoTable(doc, {
    head: [options.headers],
    body: options.data,
    startY: 30,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [139, 115, 85],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })

  // Save the PDF
  doc.save(`${options.filename}.pdf`)
}

export function exportToExcel(options: ExportOptions) {
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([options.headers, ...options.data])

  // Set column widths
  const colWidths = options.headers.map(() => ({ wch: 15 }))
  ws['!cols'] = colWidths

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
  saveAs(data, `${options.filename}.xlsx`)
}

export function exportToCSV(options: ExportOptions) {
  const csvContent = [
    options.headers.join(','),
    ...options.data.map(row => 
      row.map(cell => {
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`
        }
        return cell
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${options.filename}.csv`)
}

export function exportResultCard(student: any, results: any[], term: string) {
  const options: ExportOptions = {
    title: `Result Card - ${student.name} - ${term}`,
    filename: `result_${student.admission_number}_${term.replace(/\s/g, '_')}`,
    headers: ['Subject', 'CA (40)', 'Exam (60)', 'Total', 'Grade', 'Remark'],
    data: results.map(r => [
      r.subject_name,
      r.ca_score.toFixed(2),
      r.exam_score.toFixed(2),
      r.total_score.toFixed(2),
      r.grade,
      r.remark,
    ]),
    orientation: 'portrait',
  }

  return exportToPDF(options)
}

export function exportClassResults(className: string, term: string, results: any[]) {
  const options: ExportOptions = {
    title: `Class Results - ${className} - ${term}`,
    filename: `class_results_${className}_${term.replace(/\s/g, '_')}`,
    headers: ['Admission No.', 'Student Name', ...results[0]?.subjects || []],
    data: results.map(r => [
      r.admission_number,
      r.student_name,
      ...r.scores,
    ]),
    orientation: 'landscape',
  }

  return exportToExcel(options)
}

export function exportAttendanceReport(
  className: string,
  month: string,
  attendance: any[]
) {
  const options: ExportOptions = {
    title: `Attendance Report - ${className} - ${month}`,
    filename: `attendance_${className}_${month.replace(/\s/g, '_')}`,
    headers: ['Date', 'Present', 'Absent', 'Late', 'Total', 'Rate %'],
    data: attendance.map(a => [
      a.date,
      a.present,
      a.absent,
      a.late,
      a.total,
      a.rate.toFixed(2),
    ]),
  }

  return exportToPDF(options)
}