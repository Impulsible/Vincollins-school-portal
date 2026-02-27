'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStaffId } from '@/hooks/use-staff-id'
import { useToast } from '@/hooks/use-toast'
import { Copy, Download, RefreshCw } from 'lucide-react'

export function StaffIdGenerator() {
  const [count, setCount] = useState(5)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { generateBulkStaffIds } = useStaffId()
  const { success, error } = useToast()

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const ids = await generateBulkStaffIds({
        format: 'standard',
        count,
        year: new Date().getFullYear().toString().slice(-2)
      })
      setGeneratedIds(ids)
      success?.('Staff IDs generated successfully')
    } catch (err) {
      error?.('Failed to generate staff IDs')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      success?.('Copied to clipboard')
    } catch {
      error?.('Failed to copy')
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(generatedIds.join('\n'))
      success?.('All IDs copied to clipboard')
    } catch {
      error?.('Failed to copy')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff ID Generator</CardTitle>
        <CardDescription>
          Generate unique staff IDs for new employees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4">
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate New ID'}
            </Button>
            
            {generatedIds.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Generated ID:</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedIds[0])}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <code className="text-lg font-mono">{generatedIds[0]}</code>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="count">Number of IDs to generate</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : `Generate ${count} IDs`}
            </Button>
            
            {generatedIds.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Generated IDs ({generatedIds.length})</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                    <Copy className="h-4 w-4 mr-1" /> Copy All
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4 max-h-60 overflow-y-auto">
                  {generatedIds.map((id, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                      <code className="text-sm font-mono">{id}</code>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(id)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}