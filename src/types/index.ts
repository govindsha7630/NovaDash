// ===== USER =====
export interface User {
  $id: string
  name: string
  email: string
}

// ===== BASE DOCUMENT =====
export interface BaseDoc {
  $id: string;
  $createdAt: string;
  $updatedAt?: string; // optional because not always present
}

// ===== TODO =====
export interface Todo extends BaseDoc {
  title: string;
  description?: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  userId: string;
  tags?: string[];
}

// ===== ARTICLE =====
export interface Article extends BaseDoc {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: "published" | "draft" | "archived";
  tags?: string[];
  userId: string;
}