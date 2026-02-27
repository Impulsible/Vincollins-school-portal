'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react'
import { useTimetable } from '@/hooks/use-timetable'
import { DAYS_OF_WEEK, TIME_SLOTS } from '@/types/timetable'
import { cn } from '@/lib/utils/cn'

interface WeeklyViewProps {
  classId?: string
  teacherId?: string
  isEditable?: boolean
  onEntryClick?: (entry: any) => void
}

export function WeeklyView({ classId, teacherId, isEditable, onEntryClick }: WeeklyViewProps) {
  const [selectedTerm, setSelectedTerm] = useState('2024 First Term')
  [timetableData, setTimetableData] = useState<any>({})
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { getClassTimetable, getTeacherTimetable, organizeTimetableByDay, isLoading } = useTimetable()

  const terms = ['2024 First Term', '2024 Second Term', '2024 Third Term']

  useEffect(() => {
    fetchTimetable()
  }, [classId, teacherId, selectedTerm])

  const fetchTimetable = async () => {
    let data
    if (classId) {
      data = await getClassTimetable(classId, selectedTerm)
    } else if (teacherId) {
      data = await getTeacherTimetable(teacherId, selectedTerm)
    }

    if (data) {
      const organized = organizeTimetableByDay(data)
      setTimetableData(organized)
    }
  }

  const getCurrentWeekDates = () => {
    const start = new Date(currentWeek)
    start.setDate(start.getDate() - start.getDay()) // Start from Sunday
    const dates = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    
    return dates
  }

  const weekDates = getCurrentWeekDates()

  const getSubjectColor = (subjectCode: string) => {
    const colors = {
      MATH: 'bg-portal-blue/10 border-portal-blue',
      ENGL: 'bg-secondary/10 border-secondary',
      SCI: 'bg-success/10 border-success',
      SOS: 'bg-accent/10 border-accent',
      default: 'bg-primary/10 border-primary',
    }
    return colors[subjectCode as keyof typeof colors] || colors.default
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Weekly Timetable</CardTitle>
            <CardDescription>
              {classId ? 'Class schedule' : teacherId ? 'Teacher schedule' : 'Timetable'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[180px]">
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
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDate = new Date(currentWeek)
                  newDate.setDate(currentWeek.getDate() - 7)
                  setCurrentWeek(newDate)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDate = new Date(currentWeek)
                  newDate.setDate(currentWeek.getDate() + 7)
                  setCurrentWeek(newDate)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grid">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-8 gap-2 mb-2">
                  <div className="text-sm font-medium text-muted-foreground">Time</div>
                  {weekDates.map((date, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium">{DAYS_OF_WEEK[date.getDay()]}</div>
                      <div className="text-xs text-muted-foreground">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                {TIME_SLOTS.map((time, slotIndex) => (
                  <div key={time} className="grid grid-cols-8 gap-2 mb-2">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(time)}
                    </div>
                    
                    {[0,1,2,3,4,5,6].map((day) => {
                      const entries = timetableData[day]?.filter((e: any) => 
                        e.start_time <= time && e.end_time > time
                      ) || []

                      return (
                        <div
                          key={`${day}-${time}`}
                          className={cn(
                            "min-h-[80px] rounded-lg border p-2",
                            entries.length > 0 ? 'cursor-pointer hover:shadow-md transition-shadow' : 'bg-muted/50',
                            entries.length > 0 && getSubjectColor(entries[0]?.subject?.code)
                          )}
                          onClick={() => entries.length > 0 && onEntryClick?.(entries[0])}
                        >
                          {entries.map((entry: any) => (
                            <div key={entry.id} className="space-y-1">
                              <div className="font-medium text-sm">
                                {entry.subject?.name}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                {entry.teacher?.user?.first_name} {entry.teacher?.user?.last_name}
                              </div>
                              {entry.room && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {entry.room}
                                </div>
                              )}
                              {isEditable && (
                                <Badge variant="outline" className="text-xs">
                                  {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-4">
              {[0,1,2,3,4,5,6].map((day) => {
                const dayEntries = timetableData[day] || []
                if (dayEntries.length === 0) return null

                return (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">{DAYS_OF_WEEK[day]}</h3>
                    <div className="space-y-2">
                      {dayEntries.map((entry: any) => (
                        <div
                          key={entry.id}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow",
                            getSubjectColor(entry.subject?.code)
                          )}
                          onClick={() => onEntryClick?.(entry)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{entry.subject?.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                              </div>
                            </div>
                            <Badge variant="outline">
                              {entry.subject?.code}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {entry.teacher?.user?.first_name} {entry.teacher?.user?.last_name}
                            </span>
                            {entry.room && (
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {entry.room}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}