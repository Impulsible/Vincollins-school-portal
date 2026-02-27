'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import { useCBT } from '@/hooks/use-cbt'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils/cn'

interface ExamInterfaceProps {
  examId: string
}

export function ExamInterface({ examId }: ExamInterfaceProps) {
  const router = useRouter()
  const { profile } = useAuth()
  const {
    getExam,
    startExam,
    saveAnswer,
    submitExam,
    submission,
    currentExam,
    questions,
    isLoading,
  } = useCBT()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    const initExam = async () => {
      const exam = await getExam(examId)
      if (exam && profile?.student) {
        const submission = await startExam(examId, profile.student.id)
        if (submission) {
          setAnswers(submission.answers || {})
        }
      }
    }

    initExam()
  }, [examId, profile])

  useEffect(() => {
    if (currentExam) {
      const endTime = new Date(currentExam.scheduled_end).getTime()
      const now = new Date().getTime()
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
      setTimeRemaining(remaining)

      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentExam])

  const handleAutoSubmit = async () => {
    if (submission && !isSubmitted) {
      await submitExam(submission.id)
      setIsSubmitted(true)
      setWarning('Time expired! Your exam has been auto-submitted.')
    }
  }

  const handleAnswerChange = useCallback(async (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    if (submission) {
      await saveAnswer(submission.id, questionId, answer)
    }
  }, [submission, saveAnswer])

  const handleSubmit = async () => {
    if (submission) {
      const confirmed = window.confirm('Are you sure you want to submit? This action cannot be undone.')
      if (confirmed) {
        await submitExam(submission.id)
        setIsSubmitted(true)
      }
    }
  }

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'text-portal-red' // Less than 5 minutes
    if (timeRemaining < 600) return 'text-warning' // Less than 10 minutes
    return 'text-success'
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((Object.keys(answers).length) / questions.length) * 100

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="h-6 w-6" />
            Exam Submitted Successfully
          </CardTitle>
          <CardDescription>
            Your answers have been recorded. You can close this window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {warning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4">
            <Button onClick={() => router.push('/student/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Question Navigation Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Questions</CardTitle>
          <CardDescription>
            {Object.keys(answers).length} of {questions.length} answered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id]
              const isFlagged = flaggedQuestions.has(q.id)
              const isCurrent = index === currentQuestionIndex

              return (
                <Button
                  key={q.id}
                  variant="outline"
                  className={cn(
                    "h-10 w-10 p-0",
                    isAnswered && "bg-success/10 border-success",
                    isFlagged && "border-warning",
                    isCurrent && "ring-2 ring-primary"
                  )}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              )
            })}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 bg-success/20 border border-success rounded" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 border border-warning rounded" />
              <span>Flagged for review</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Exam Area */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{currentExam?.title}</CardTitle>
              <CardDescription>
                {currentExam?.subject?.name} • Question {currentQuestionIndex + 1} of {questions.length}
              </CardDescription>
            </div>
            <div className={cn("flex items-center gap-2 text-xl font-mono", getTimeColor())}>
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {warning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}

          {currentQuestion && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {currentQuestion.question_type === 'objective' ? 'Objective' : 'Theory'} • {currentQuestion.marks} marks
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={flaggedQuestions.has(currentQuestion.id) ? 'text-warning' : ''}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {flaggedQuestions.has(currentQuestion.id) ? 'Flagged' : 'Flag for review'}
                  </Button>
                </div>
                
                <p className="text-lg">{currentQuestion.question_text}</p>
              </div>

              {currentQuestion.question_type === 'objective' && currentQuestion.options && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.question_type === 'theory' && (
                <Textarea
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  rows={10}
                />
              )}
            </>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              variant="default"
              onClick={handleSubmit}
              className="bg-success hover:bg-success/90"
            >
              Submit Exam
            </Button>

            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}