'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentIdGenerator } from '@/components/student/student-id-generator'
import { useStudentId } from '@/hooks/use-student-id'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Loader2, RefreshCw, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { AlertDescription } from '@/components/ui/alert'

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  classId: z.string().min(1, 'Class is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().optional(),
  parentName: z.string().min(2, 'Parent name is required'),
  parentPhone: z.string().min(10, 'Parent phone is required'),
  parentEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
})

type StudentFormData = z.infer<typeof studentSchema>

export default function CreateStudentPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const { 
    generateNewStudentId, 
    generateStudentCredentials, 
    getClassOptions,
    getClassesBySection,
    getSectionOptions,
    validateStudentId 
  } = useStudentId()
  
  const [isLoading, setIsLoading] = useState(false)
  const [classes, setClasses] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string
    badgeNumber: string
    tempPassword: string
    studentId: string
    admissionYear?: number
    classCode?: string
  } | null>(null)

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: 'male',
      enrollmentDate: new Date().toISOString().split('T')[0],
    },
  })

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('classes')
        .select('id, name, code')
        .order('name')
      
      if (data) {
        setClasses(data)
      }
    }

    fetchClasses()
  }, [])

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Check if admission number already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('admission_number')
        .eq('admission_number', data.admissionNumber)
        .maybeSingle()

      if (existingStudent) {
        error('Admission number already exists')
        setIsLoading(false)
        return
      }

      // Get class details for ID parsing
      const selectedClass = classes.find(c => c.id === data.classId)
      
      // Generate credentials
      const credentials = await generateStudentCredentials(
        data.firstName,
        data.lastName,
        data.admissionNumber,
        selectedClass?.name
      )

      // Create auth user (optional - students might not need login initially)
      let authUserId = null
      
      if (data.email) {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: credentials.email,
          password: credentials.tempPassword,
          email_confirm: true,
          user_metadata: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'student',
          },
        })

        if (authError) throw authError
        authUserId = authData.user.id
      }

      // Create user record if we created auth user
      if (authUserId) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authUserId,
            email: credentials.email,
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'student',
            phone: data.phone || null,
            is_active: true,
          })

        if (userError) throw userError
      }

      // Create student record
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: authUserId,
          admission_number: data.admissionNumber,
          class_id: data.classId,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          address: data.address || null,
          parent_name: data.parentName,
          parent_phone: data.parentPhone,
          parent_email: data.parentEmail || null,
          enrollment_date: data.enrollmentDate,
        })

      if (studentError) throw studentError

      setGeneratedCredentials(credentials)
      success('Student record created successfully')

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/admin/users/students')
      }, 3000)

    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create student')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStudentId = async () => {
    const selectedClassId = form.getValues('classId')
    if (!selectedClassId) {
      error('Please select a class first')
      return
    }

    const selectedClass = classes.find(c => c.id === selectedClassId)
    if (!selectedClass) return

    const newId = await generateNewStudentId({
      format: 'standard',
      classCode: selectedClass.code,
      year: new Date().getFullYear(),
    })

    if (newId) {
      form.setValue('admissionNumber', newId)
    }
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users/students">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-serif font-bold">Register New Student</h1>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Register Student</TabsTrigger>
          <TabsTrigger value="generate">Generate Student ID</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                Enter the student details to create their record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="student@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Required for portal access
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 XXX XXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="admissionNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admission Number</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                placeholder="VSP-24-JSS1-0001" 
                                {...field} 
                                className="font-mono"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={refreshStudentId}
                              title="Generate new admission number"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormDescription>
                            Unique student identification number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="classId"
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
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enrollmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enrollment Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Parent's full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 XXX XXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Email (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="parent@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Residential Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Home address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register Student
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <StudentIdGenerator />
        </TabsContent>
      </Tabs>

      {/* Generated Credentials Display */}
      {generatedCredentials && (
        <Card className="border-success">
          <CardHeader>
            <CardTitle className="text-success flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Student Record Created Successfully!
            </CardTitle>
            <CardDescription>
              Please save these credentials. They will not be shown again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Admission Number</p>
                <p className="font-mono">{generatedCredentials.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Badge Number</p>
                <p className="font-mono">{generatedCredentials.badgeNumber}</p>
              </div>
              {generatedCredentials.admissionYear && (
                <div>
                  <p className="text-sm font-medium">Admission Year</p>
                  <p className="font-mono">{generatedCredentials.admissionYear}</p>
                </div>
              )}
              {generatedCredentials.classCode && (
                <div>
                  <p className="text-sm font-medium">Class Code</p>
                  <p className="font-mono">{generatedCredentials.classCode}</p>
                </div>
              )}
              {generatedCredentials.email && (
                <>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="font-mono">{generatedCredentials.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Temporary Password</p>
                    <p className="font-mono">{generatedCredentials.tempPassword}</p>
                  </div>
                </>
              )}
            </div>
            <Alert>
              <AlertDescription>
                {generatedCredentials.email 
                  ? "The student will be required to change their password on first login."
                  : "No email was provided. Portal access will not be available."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}