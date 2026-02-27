export interface TimetableEntry {
  id: string
  class_id: string
  subject_id: string
  teacher_id: string
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6
  start_time: string
  end_time: string
  room: string | null
  academic_term: string
}

export interface TimetableWithDetails extends TimetableEntry {
  class?: {
    id: string
    name: string
    code: string
  }
  subject?: {
    id: string
    name: string
    code: string
  }
  teacher?: {
    id: string
    user: {
      first_name: string
      last_name: string
    }
  }
}

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]

export interface TimetableGrid {
  [day: number]: {
    [time: string]: TimetableWithDetails[]
  }
}