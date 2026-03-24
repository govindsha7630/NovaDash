// ===== USER =====
export interface User {
  $id: string
  name: string
  email: string
}

// ===== TODO =====
export interface Todo {
  $id: string
  title: string
  description?: string
  completed: boolean
  priority: "high" | "medium" | "low"
  dueDate?: string
  userId: string
  tags?: string[]
}

// ===== ARTICLE =====
export interface Article {
  $id: string
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  status: "published" | "draft" | "archived"
  tags?: string[]
  userId: string
  $createdAt: string
}