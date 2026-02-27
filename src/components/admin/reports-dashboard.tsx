'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Calendar,
  DownloadCloud,
  Printer,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

const COLORS = ['#8B7355', '#E2725B', '#87A96B', '#2D6CDF', '#F59E0B', '#C2413A']

interface ReportFilters {
  academicYear: string
  term: string
  classId: string
  subjectId: string
  dateRange: 'today' | 'week' | 'month' | 'term' | 'year'
}

export function ReportsDashboard() {
  const [filters, setFilters] = useState<ReportFilters>({
    academicYear: '2023/2024',
    term: 'all',
    classId: 'all',
    subjectId: 'all',
    dateRange: 'term',
  })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({
    studentStats: { total: 0, byClass: [], byGender: [], newThisMonth: 0 },
    resultStats: { total: 0, published: 0, pending: 0, averageScore: 0 },
    performanceData: [],
    classPerformance: [],
    subjectPerformance: [],
    attendanceStats: { average: 0, byClass: [] },
  })

  useEffect(() => {
    fetchReportData()
  }, [filters])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Fetch student statistics
      const { count: totalStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })

      const { data: studentsByClass } = await supabase
        .from('students')
        .select(`
          class:classes(name),
          count
        `)
        .group('class_id')

      const { data: studentsByGender } = await supabase
        .from('students')
        .select('gender, count')
        .group('gender')

      // Fetch result statistics
      const { data: results } = await supabase
        .from('results')
        .select('status, total_score')
        .eq('academic_term', filters.term !== 'all' ? filters.term : undefined)

      const publishedResults = results?.filter(r => r.status === 'published') || []
      const averageScore = publishedResults.length > 0
        ? publishedResults.reduce((sum, r) => sum + (r.total_score || 0), 0) / publishedResults.length
        : 0

      // Fetch performance trends (last 6 months)
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i)
        return format(date, 'MMM yyyy')
      }).reverse()

      const performanceData = months.map(month => ({
        month,
        average: Math.floor(Math.random() * 20) + 60, // Placeholder - replace with actual data
        passRate: Math.floor(Math.random() * 15) + 75,
      }))

      // Fetch class performance
      const { data: classes } = await supabase
        .from('classes')
        .select('id, name')

      const classPerformance = await Promise.all(
        (classes || []).map(async (cls) => {
          const { data: classResults } = await supabase
            .from('results')
            .select('total_score')
            .eq('class_id', cls.id)
            .eq('status', 'published')

          const avg = classResults && classResults.length > 0
            ? classResults.reduce((sum, r) => sum + (r.total_score || 0), 0) / classResults.length
            : 0

          return {
            className: cls.name,
            average: Math.round(avg * 100) / 100,
          }
        })
      )

      setStats({
        studentStats: {
          total: totalStudents || 0,
          byClass: studentsByClass || [],
          byGender: studentsByGender || [],
          newThisMonth: Math.floor(Math.random() * 50) + 20, // Placeholder
        },
        resultStats: {
          total: results?.length || 0,
          published: publishedResults.length,
          pending: results?.filter(r => r.status === 'pending').length || 0,
          averageScore: Math.round(averageScore * 100) / 100,
        },
        performanceData,
        classPerformance,
        subjectPerformance: [], // Add subject performance data
        attendanceStats: {
          average: 92, // Placeholder
          byClass: [],
        },
      })
    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: 'pdf' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}...`)
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Customize the data displayed in the reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select
              value={filters.academicYear}
              onValueChange={(value) => setFilters({ ...filters, academicYear: value })}
            >
              <SelectTrigger>
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023/2024">2023/2024</SelectItem>
                <SelectItem value="2022/2023">2022/2023</SelectItem>
                <SelectItem value="2021/2022">2021/2022</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.term}
              onValueChange={(value) => setFilters({ ...filters, term: value })}
            >
              <SelectTrigger>
                <BookOpen className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="First Term 2024">First Term</SelectItem>
                <SelectItem value="Second Term 2024">Second Term</SelectItem>
                <SelectItem value="Third Term 2024">Third Term</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.classId}
              onValueChange={(value) => setFilters({ ...filters, classId: value })}
            >
              <SelectTrigger>
                <Users className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="jss1">JSS 1</SelectItem>
                <SelectItem value="jss2">JSS 2</SelectItem>
                <SelectItem value="jss3">JSS 3</SelectItem>
                <SelectItem value="sss1">SSS 1</SelectItem>
                <SelectItem value="sss2">SSS 2</SelectItem>
                <SelectItem value="sss3">SSS 3</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.subjectId}
              onValueChange={(value) => setFilters({ ...filters, subjectId: value })}
            >
              <SelectTrigger>
                <Award className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="eng">English</SelectItem>
                <SelectItem value="sci">Science</SelectItem>
                <SelectItem value="sos">Social Studies</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(value: any) => setFilters({ ...filters, dateRange: value })}
            >
              <SelectTrigger>
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="term">This Term</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => exportReport('excel')}>
              <DownloadCloud className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={printReport}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studentStats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.studentStats.newThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Results Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resultStats.published}</div>
            <p className="text-xs text-muted-foreground">
              {stats.resultStats.pending} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resultStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceStats.average}%</div>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic Performance</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Average scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="#8B7355"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="passRate"
                      stroke="#87A96B"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Class Performance</CardTitle>
                <CardDescription>Average by class</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.classPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="className" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#E2725B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#2D6CDF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Breakdown by grade</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'A', value: 25 },
                        { name: 'B', value: 35 },
                        { name: 'C', value: 20 },
                        { name: 'D', value: 12 },
                        { name: 'E', value: 5 },
                        { name: 'F', value: 3 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.performanceData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Students by Gender</CardTitle>
                <CardDescription>Gender distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.studentStats.byGender}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="gender"
                    >
                      <Cell fill="#2D6CDF" />
                      <Cell fill="#E2725B" />
                      <Cell fill="#87A96B" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students by Class</CardTitle>
                <CardDescription>Class size distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.studentStats.byClass}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class.name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B7355" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Over Time</CardTitle>
              <CardDescription>6-month performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={stats.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8B7355"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="passRate"
                    stroke="#87A96B"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
          <CardDescription>Latest published results</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add results table here */}
        </CardContent>
      </Card>
    </div>
  )
}