export interface GradePoint {
  grade: string
  minScore: number
  maxScore: number
  gradePoint: number
  remark: string
}

export const gradingScale: GradePoint[] = [
  { grade: 'A', minScore: 70, maxScore: 100, gradePoint: 4.0, remark: 'Excellent' },
  { grade: 'B', minScore: 60, maxScore: 69, gradePoint: 3.5, remark: 'Very Good' },
  { grade: 'C', minScore: 50, maxScore: 59, gradePoint: 3.0, remark: 'Good' },
  { grade: 'D', minScore: 45, maxScore: 49, gradePoint: 2.5, remark: 'Fair' },
  { grade: 'E', minScore: 40, maxScore: 44, gradePoint: 2.0, remark: 'Pass' },
  { grade: 'F', minScore: 0, maxScore: 39, gradePoint: 0.0, remark: 'Fail' },
]

export function getGradeAndRemark(score: number): { grade: string; remark: string; gradePoint: number } {
  const gradeInfo = gradingScale.find(
    (g) => score >= g.minScore && score <= g.maxScore
  ) || gradingScale[gradingScale.length - 1]
  
  return {
    grade: gradeInfo.grade,
    remark: gradeInfo.remark,
    gradePoint: gradeInfo.gradePoint,
  }
}

export function calculateGPA(
  results: Array<{ score: number; creditUnits: number }>
): number {
  if (!results.length) return 0

  let totalGradePoints = 0
  let totalCredits = 0

  results.forEach((result) => {
    const { gradePoint } = getGradeAndRemark(result.score)
    totalGradePoints += gradePoint * result.creditUnits
    totalCredits += result.creditUnits
  })

  return totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0
}

export function calculateCGPA(
  semesters: Array<{ gpa: number; credits: number }>
): number {
  if (!semesters.length) return 0

  let totalGradePoints = 0
  let totalCredits = 0

  semesters.forEach((semester) => {
    totalGradePoints += semester.gpa * semester.credits
    totalCredits += semester.credits
  })

  return totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0
}