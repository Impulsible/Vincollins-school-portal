'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Printer, TrendingUp, Award, BookOpen } from 'lucide-react'
import { useResults } from '@/hooks/use-results'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell 
} from 'recharts'

interface ResultViewProps {
  studentId?: string // Optional for admin/staff viewing
}

export function ResultView({ studentId }: ResultViewProps) {
  const [selectedTerm, setSelectedTerm] = useState<string>('')
  [terms, setTerms] = useState<string[]>([])
  const [resultSummary, setResultSummary] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const { getStudentResults, generateResultSummary, calculateStudentGPA } = useResults()
  const { profile } = useAuth()

  const currentStudentId = studentId || profile?.student?.id

  useEffect(() => {
    if (currentStudentId) {
      fetchTerms()
      if (selectedTerm) {
        fetchResults()
      }
    }
  }, [currentStudentId, selectedTerm])

  const fetchTerms = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('results')
      .select('academic_term')
      .eq('student_id', currentStudentId)
      .eq('status', 'published')
      .order('academic_term', { ascending: false })

    if (data) {
      const uniqueTerms = [...new Set(data.map(r => r.academic_term))]
      setTerms(uniqueTerms)
      if (uniqueTerms.length > 0 && !selectedTerm) {
        setSelectedTerm(uniqueTerms[0])
      }
    }
  }

  const fetchResults = async () => {
    const summary = await generateResultSummary(currentStudentId, selectedTerm)
    setResultSummary(summary)

    if (summary) {
      // Prepare chart data
      const chart = summary.subjects.map((s: any) => ({
        subject: s.subject_code,
        CA: s.ca_score,
        Exam: s.exam_score,
        Total: s.total_score,
      }))
      setChartData(chart)
    }
  }

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case 'A': return 'bg-success'
      case 'B': return 'bg-portal-blue'
      case 'C': return 'bg-accent'
      case 'D': return 'bg-warning'
      case 'E': return 'bg-orange-500'
      default: return 'bg-portal-red'
    }
  }

  const COLORS = ['#10B981', '#2D6CDF', '#87A96B', '#F59E0B', '#EF4444', '#8B7355']

  if (!resultSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Available</CardTitle>
          <CardDescription>
            No published results found for this student.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Term Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-serif">
                {resultSummary.student_name}
              </CardTitle>
              <CardDescription>
                Admission: {resultSummary.admission_number} • Class: {resultSummary.class_name}
              </CardDescription>
            </div>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">GPA</p>
                <p className="text-3xl font-bold text-portal-blue">{resultSummary.gpa}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-portal-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CGPA</p>
                <p className="text-3xl font-bold text-secondary">{resultSummary.cgpa}</p>
              </div>
              <Award className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Subjects</p>
                <p className="text-3xl font-bold text-accent">{resultSummary.subjects.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Result Table</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="line">Performance Trend</TabsTrigger>
          <TabsTrigger value="pie">Grade Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">CA (40)</TableHead>
                    <TableHead className="text-center">Exam (60)</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead>Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultSummary.subjects.map((subject: any) => (
                    <TableRow key={subject.subject_id}>
                      <TableCell className="font-medium">
                        {subject.subject_name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({subject.subject_code})
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{subject.ca_score.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{subject.exam_score.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-bold">
                        {subject.total_score.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getGradeColor(subject.grade)}>
                          {subject.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{subject.remark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="CA" fill="#87A96B" />
                  <Bar dataKey="Exam" fill="#2D6CDF" />
                  <Bar dataKey="Total" fill="#8B7355" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="CA" stroke="#87A96B" strokeWidth={2} />
                  <Line type="monotone" dataKey="Exam" stroke="#2D6CDF" strokeWidth={2} />
                  <Line type="monotone" dataKey="Total" stroke="#8B7355" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={resultSummary.subjects.map((s: any) => ({
                      name: s.subject_code,
                      value: s.total_score
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resultSummary.subjects.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Teacher's and Principal's Remarks */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Teacher's Remark</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {resultSummary.teacher_remark || "No remark provided."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Principal's Remark</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {resultSummary.principal_remark || "No remark provided."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Signature Area */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Class Teacher</p>
              <div className="mt-4 h-12 w-48 border-b border-dashed" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Principal</p>
              <div className="mt-4 h-12 w-48 border-b border-dashed" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <div className="mt-4 h-12 w-32 border-b border-dashed" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}