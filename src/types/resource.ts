export interface Resource {
  id: string
  title: string
  description: string | null
  type: 'document' | 'video' | 'link'
  file_url: string | null
  class_id: string | null
  subject_id: string | null
  uploaded_by: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface ResourceWithDetails extends Resource {
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
  uploader?: {
    first_name: string
    last_name: string
  }
}

export interface ResourceCategory {
  id: string
  name: string
  description: string | null
  parent_id: string | null
}

export const RESOURCE_TYPES = [
  { value: 'document', label: 'Document', icon: '📄' },
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'link', label: 'Link', icon: '🔗' },
] as const