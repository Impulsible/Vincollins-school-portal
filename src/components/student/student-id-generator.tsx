'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Check, Loader2, Users, Hash, Calendar, Layers, GraduationCap } from 'lucide-react'
import { useStudentId } from '@/hooks/use-student-id'
import { useToast } from '@/hooks/use-toast'

const studentIdSchema = z.object({
  format: z.enum(['standard', 'year-only', 'section', 'legacy']),
  classCode: z.string().optional(),
  section: z.enum(['creche', 'nursery', 'primary', 'college']).optional(),
  year: z.string().optional(),
  originalId: z.string().optional(),
})

const bulkGenerationSchema = z.object({
  count: z.string().min(1, 'Count is required').transform(Number).refine(
    (val) => val > 0 && val <= 100,
    'Count must be between 1 and 100'
  ),
  format: z.enum(['standard', 'year-only', 'section']),
  classCode: z.string().optional(),
  section: z.enum(['creche', 'nursery', 'primary', 'college']).optional(),
  year: z.string().optional(),
})

type StudentIdFormData = z.infer<typeof studentIdSchema>
type BulkGenerationData = z.infer<typeof bulkGenerationSchema>

export function StudentIdGenerator() {
  const [generatedId, setGeneratedId] = useState<string | null>(null)
  const [bulkIds, setBulkIds] = useState<string[] | null>(null)
  const [copied, setCopied] = useState(false)
  const { 
    generateNewStudentId, 
    generateBulkStudentIds, 
    getClassOptions, 
    getSectionOptions,
    getClassesBySection,
    isGenerating 
  } = useStudentId()
  const { success } = useToast()

  const form = useForm<StudentIdFormData>({
    resolver: zodResolver(studentIdSchema),
    defaultValues: {
      format: 'standard',
    },
  })

  const bulkForm = useForm<BulkGenerationData>({
    resolver: zodResolver(bulkGenerationSchema),
    defaultValues: {
      format: 'standard',
      count: 5,
    },
  })

  const selectedFormat = form.watch('format')
  const selectedSection = form.watch('section')
  const selectedBulkFormat = bulkForm.watch('format')
  const selectedBulkSection = bulkForm.watch('section')

  const [classOptions, setClassOptions] = useState(getClassOptions())
  const sectionOptions = getSectionOptions()

  // Update class options when section changes
  useEffect(() => {
    if (selectedSection) {
      const filteredClasses = getClassesBySection(selectedSection)
      setClassOptions(filteredClasses)
    } else {
      setClassOptions(getClassOptions())
    }
  }, [selectedSection, getClassesBySection])

  useEffect(() => {
    if (selectedBulkSection) {
      const filteredClasses = getClassesBySection(selectedBulkSection)
      // Update bulk form class options logic here
    }
  }, [selectedBulkSection, getClassesBySection])

  const onSubmit = async (data: StudentIdFormData) => {
    const id = await generateNewStudentId({
      format: data.format,
      classCode: data.classCode,
      section: data.section,
      year: data.year ? parseInt(data.year) : undefined,
      originalId: data.originalId,
    })
    
    if (id) {
      setGeneratedId(id)
      setBulkIds(null)
    }
  }

  const onBulkSubmit = async (data: BulkGenerationData) => {
    const ids = await generateBulkStudentIds(data.count, {
      format: data.format,
      classCode: data.classCode,
      section: data.section,
      year: data.year ? parseInt(data.year) : undefined,
    })
    
    if (ids) {
      setBulkIds(ids)
      setGeneratedId(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const copyAllToClipboard = () => {
    if (bulkIds) {
      navigator.clipboard.writeText(bulkIds.join('\n'))
      success('All IDs copied to clipboard')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-serif flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          Student ID Generator
        </CardTitle>
        <CardDescription>
          Generate unique student IDs in various formats for Vincollins School students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Generation</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">
                            Standard (VSP-YY-CLASS-XXXX)
                          </SelectItem>
                          <SelectItem value="year-only">
                            Year Only (VSP-YY-XXXXX)
                          </SelectItem>
                          <SelectItem value="section">
                            Section Based (VSP-SEC-YY-XXXX)
                          </SelectItem>
                          <SelectItem value="legacy">
                            Legacy (VSP-L-ORIGINAL-ID)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the format for the student ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedFormat === 'section' && (
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sectionOptions.map((section) => (
                              <SelectItem key={section.value} value={section.value}>
                                {section.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the student's section
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(selectedFormat === 'standard') && (
                  <FormField
                    control={form.control}
                    name="classCode"
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
                            {classOptions.map((cls) => (
                              <SelectItem key={cls.value} value={cls.value}>
                                {cls.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the student's class
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(selectedFormat === 'standard' || selectedFormat === 'year-only' || selectedFormat === 'section') && (
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Admission</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder={new Date().getFullYear().toString()}
                            min="2000"
                            max={new Date().getFullYear() + 1}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Leave empty to use current year
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedFormat === 'legacy' && (
                  <FormField
                    control={form.control}
                    name="originalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Student ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter original ID (e.g., 20201234)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the student's ID from the previous system
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Student ID
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="bulk">
            <Form {...bulkForm}>
              <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)} className="space-y-4">
                <FormField
                  control={bulkForm.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of IDs to Generate</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="5"
                          min="1"
                          max="100"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Generate between 1 and 100 IDs at once
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bulkForm.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">
                            Standard (VSP-YY-CLASS-XXXX)
                          </SelectItem>
                          <SelectItem value="year-only">
                            Year Only (VSP-YY-XXXXX)
                          </SelectItem>
                          <SelectItem value="section">
                            Section Based (VSP-SEC-YY-XXXX)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the format for the student IDs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedBulkFormat === 'section' && (
                  <FormField
                    control={bulkForm.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sectionOptions.map((section) => (
                              <SelectItem key={section.value} value={section.value}>
                                {section.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the section for bulk generation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedBulkFormat === 'standard' && (
                  <FormField
                    control={bulkForm.control}
                    name="classCode"
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
                            {classOptions.map((cls) => (
                              <SelectItem key={cls.value} value={cls.value}>
                                {cls.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the class for bulk generation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(selectedBulkFormat === 'standard' || selectedBulkFormat === 'year-only' || selectedBulkFormat === 'section') && (
                  <FormField
                    control={bulkForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Admission</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder={new Date().getFullYear().toString()}
                            min="2000"
                            max={new Date().getFullYear() + 1}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Leave empty to use current year
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Bulk Student IDs
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {/* Results Section */}
        {generatedId && (
          <Alert className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">Generated Student ID:</h4>
                <p className="text-lg font-mono">{generatedId}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(generatedId)}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Alert>
        )}

        {bulkIds && bulkIds.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Generated {bulkIds.length} Student IDs:</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAllToClipboard}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
              <ul className="space-y-2 font-mono text-sm">
                {bulkIds.map((id, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{id}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Format Guide</Badge>
          <span>Standard: VSP-YY-CLASS-XXXX • Year Only: VSP-YY-XXXXX • Section: VSP-SEC-YY-XXXX</span>
        </div>
        <p>Student IDs are unique and cannot be changed once assigned</p>
      </CardFooter>
    </Card>
  )
}