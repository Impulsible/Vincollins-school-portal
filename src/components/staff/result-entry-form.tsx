'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Send, Plus, Trash2 } from 'lucide-react'
import { useResults } from '@/hooks/use-results'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

const resultEntrySchema = z.object({
  class_id: z.string().min(1, 'Class is required'),
  subject_id: z.string().min(1, 'Subject is required'),
  academic_term: z.string().min(1, 'Term is required'),
  results: z.array(z.object({
    student_id: z.string(),
    ca_score: z.number().min(0).max(40),
    exam_score: z.number().min(0).max(60),
    remark: z.string().optional(),
  })),
})

type ResultEntryFormData = z.infer<typeof resultEntrySchema>

interface Student {
  id: string
  admission_number: string
  user: {
    first_name: string
    last_name: string
  }
}

export function ResultEntryForm() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [terms] = useState(['2024 First Term', '2024 Second Term', '2024 Third Term'])
  
  const { enterBatchResults, isLoading } = useResults()
  const { success } = useToast()

  const form = useForm<ResultEntryFormData>({
    resolver: zodResolver(resultEntrySchema),
    defaultValues: {
      results: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'results',
  })

  const selectedClass = form.watch('class_id')
  const selectedSubject = form.watch('subject_id')

  // Fetch classes for teacher
  useEffect(() => {
    const fetchClasses = async () => {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      
      const { data } = await supabase
        .from('class_subjects')
        .select(`
          class:classes(id, name, code),
          subject:subjects(id, name, code)
        `)
        .eq('teacher_id', userData.user?.id)

      if (data) {
        const uniqueClasses = Array.from(new Map(data.map(item => [item.class.id, item.class])).values())
        setClasses(uniqueClasses)
      }
    }

    fetchClasses()
  }, [])

  // Fetch subjects when class changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClass) return

      const supabase = createClient()
      const { data } = await supabase
        .from('class_subjects')
        .select(`
          subject:subjects(id, name, code)
        `)
        .eq('class_id', selectedClass)

      if (data) {
        setSubjects(data.map(item => item.subject))
      }
    }

    fetchSubjects()
  }, [selectedClass])

  // Fetch students when class changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return

      setIsLoadingStudents(true)
      const supabase = createClient()
      
      const { data } = await supabase
        .from('students')
        .select(`
          id,
          admission_number,
          user:users(first_name, last_name)
        `)
        .eq('class_id', selectedClass)
        .order('admission_number')

      if (data) {
        setStudents(data)
        
        // Initialize results array with all students
        const initialResults = data.map(student => ({
          student_id: student.id,
          ca_score: 0,
          exam_score: 0,
          remark: '',
        }))
        
        form.setValue('results', initialResults)
      }
      
      setIsLoadingStudents(false)
    }

    fetchStudents()
  }, [selectedClass, form])

  const onSubmit = async (data: ResultEntryFormData) => {
    const results = await enterBatchResults(
      data.results.map(r => ({
        ...r,
        class_id: data.class_id,
        subject_id: data.subject_id,
        academic_term: data.academic_term,
      }))
    )

    if (results) {
      success('Results saved successfully')
    }
  }

  const calculateTotal = (ca: number, exam: number) => {
    return (ca || 0) + (exam || 0)
  }

  const getGradeColor = (total: number) => {
    if (total >= 70) return 'text-success'
    if (total >= 60) return 'text-portal-blue'
    if (total >= 50) return 'text-accent'
    if (total >= 40) return 'text-warning'
    return 'text-portal-red'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Results</CardTitle>
        <CardDescription>
          Enter CA (max 40) and Exam (max 60) scores for students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} ({cls.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!selectedClass}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academic_term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Term</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedClass && selectedSubject && (
              <>
                {isLoadingStudents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Admission No.</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead className="w-24">CA (40)</TableHead>
                          <TableHead className="w-24">Exam (60)</TableHead>
                          <TableHead className="w-24">Total</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Remark</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => {
                          const student = students.find(s => s.id === field.student_id)
                          const caScore = form.watch(`results.${index}.ca_score`) || 0
                          const examScore = form.watch(`results.${index}.exam_score`) || 0
                          const total = calculateTotal(caScore, examScore)
                          
                          return (
                            <TableRow key={field.id}>
                              <TableCell className="font-mono">
                                {student?.admission_number}
                              </TableCell>
                              <TableCell>
                                {student?.user.first_name} {student?.user.last_name}
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`results.${index}.ca_score`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min="0"
                                          max="40"
                                          step="0.01"
                                          {...field}
                                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                          className="w-20"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`results.${index}.exam_score`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min="0"
                                          max="60"
                                          step="0.01"
                                          {...field}
                                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                          className="w-20"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <span className={`font-bold ${getGradeColor(total)}`}>
                                  {total.toFixed(2)}
                                </span>
                              </TableCell>
                              <TableCell>
                                {total >= 70 && <Badge className="bg-success">A</Badge>}
                                {total >= 60 && total < 70 && <Badge variant="info">B</Badge>}
                                {total >= 50 && total < 60 && <Badge variant="accent">C</Badge>}
                                {total >= 40 && total < 50 && <Badge variant="warning">D</Badge>}
                                {total < 40 && <Badge variant="destructive">F</Badge>}
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`results.${index}.remark`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="Optional"
                                          {...field}
                                          className="w-32"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <Alert>
                  <AlertDescription>
                    Ensure CA scores do not exceed 40 and Exam scores do not exceed 60.
                    Total will be calculated automatically.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Results
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}