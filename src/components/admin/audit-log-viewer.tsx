'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Search, Download, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_data: any
  new_data: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
  user?: {
    first_name: string
    last_name: string
    email: string
  }
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week')

  useEffect(() => {
    fetchLogs()
  }, [actionFilter, entityFilter, dateRange])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          user:users(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })

      // Apply date filter
      const now = new Date()
      if (dateRange === 'today') {
        const today = new Date(now.setHours(0, 0, 0, 0)).toISOString()
        query = query.gte('created_at', today)
      } else if (dateRange === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString()
        query = query.gte('created_at', weekAgo)
      } else if (dateRange === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString()
        query = query.gte('created_at', monthAgo)
      }

      // Apply action filter
      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter)
      }

      // Apply entity filter
      if (entityFilter !== 'all') {
        query = query.eq('entity_type', entityFilter)
      }

      const { data, error } = await query.limit(1000)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.entity_type.toLowerCase().includes(searchLower) ||
      log.user?.first_name?.toLowerCase().includes(searchLower) ||
      log.user?.last_name?.toLowerCase().includes(searchLower) ||
      log.user?.email?.toLowerCase().includes(searchLower)
    )
  })

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-success'
    if (action.includes('UPDATE')) return 'bg-warning'
    if (action.includes('DELETE')) return 'bg-destructive'
    if (action.includes('LOGIN')) return 'bg-portal-blue'
    return 'bg-secondary'
  }

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address'],
      ...filteredLogs.map(log => [
        format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
        log.user ? `${log.user.first_name} ${log.user.last_name} (${log.user.email})` : 'System',
        log.action,
        log.entity_type,
        log.entity_id || '-',
        log.ip_address || '-',
      ]),
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Track all system activities and changes
            </CardDescription>
          </div>
          <Button onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="LOGOUT">Logout</SelectItem>
            </SelectContent>
          </Select>

          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="results">Results</SelectItem>
              <SelectItem value="assignments">Assignments</SelectItem>
              <SelectItem value="cbt_exams">CBT Exams</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {log.user ? (
                        <div>
                          <div>{log.user.first_name} {log.user.last_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {log.user.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">System</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.entity_type}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.entity_id || '-'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.ip_address || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </CardContent>
    </Card>
  )
}