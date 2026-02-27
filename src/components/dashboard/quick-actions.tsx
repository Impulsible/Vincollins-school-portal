'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  ClipboardList,
  Calendar,
  BookOpen,
  Brain,
  Users,
  Settings,
  Download,
  GraduationCap,
  Award,
  Clock,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'

interface QuickActionsProps {
  role: 'student' | 'staff' | 'admin' | 'super_admin'
}

export function QuickActions({ role }: QuickActionsProps) {
  const getActions = () => {
    switch (role) {
      case 'student':
        return [
          { label: 'View Results', icon: FileText, href: '/student/results', color: 'text-blue-500' },
          { label: 'Assignments', icon: ClipboardList, href: '/student/assignments', color: 'text-green-500' },
          { label: 'Timetable', icon: Calendar, href: '/student/timetable', color: 'text-purple-500' },
          { label: 'Resources', icon: BookOpen, href: '/student/resources', color: 'text-amber-500' },
          { label: 'CBT Exams', icon: Brain, href: '/student/cbt', color: 'text-red-500' },
          { label: 'My Profile', icon: Users, href: '/student/profile', color: 'text-indigo-500' },
        ]
      case 'staff':
        return [
          { label: 'Enter Results', icon: FileText, href: '/staff/results/enter', color: 'text-blue-500' },
          { label: 'Assignments', icon: ClipboardList, href: '/staff/assignments', color: 'text-green-500' },
          { label: 'Upload Resources', icon: BookOpen, href: '/staff/resources/upload', color: 'text-amber-500' },
          { label: 'Create CBT', icon: Brain, href: '/staff/cbt/create', color: 'text-red-500' },
          { label: 'Timetable', icon: Calendar, href: '/staff/timetable', color: 'text-purple-500' },
          { label: 'My Classes', icon: GraduationCap, href: '/staff/classes', color: 'text-indigo-500' },
        ]
      case 'admin':
      case 'super_admin':
        return [
          { label: 'Manage Users', icon: Users, href: '/admin/users', color: 'text-blue-500' },
          { label: 'Add Student', icon: UserPlus, href: '/admin/users/students/create', color: 'text-green-500' },
          { label: 'Add Staff', icon: UserPlus, href: '/admin/users/staff/create', color: 'text-amber-500' },
          { label: 'Academic', icon: BookOpen, href: '/admin/academics', color: 'text-purple-500' },
          { label: 'Results', icon: FileText, href: '/admin/results', color: 'text-red-500' },
          { label: 'Reports', icon: Download, href: '/admin/exports', color: 'text-indigo-500' },
          { label: 'Timetable', icon: Calendar, href: '/admin/timetable', color: 'text-pink-500' },
          { label: 'Settings', icon: Settings, href: '/admin/system/settings', color: 'text-gray-500' },
        ]
      default:
        return []
    }
  }

  const actions = getActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.href}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5"
                asChild
              >
                <Link href={action.href}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                  <span className="text-xs text-center">{action.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}