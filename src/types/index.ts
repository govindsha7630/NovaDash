// ===== USER =====
export interface User {
  $id: string;
  name: string;
  email: string;
}

// ===== BASE DOCUMENT =====
export interface BaseDoc {
  $id: string;
  $createdAt: string;
  $updatedAt?: string; // optional because not always present
}
// Add this new interface
export interface Subtask {
    title: string
    completed: boolean
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
  subtasks?: string;
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
  category?: string;
  isPrivate?: boolean;
  publishAt?: string;
}

// ===== ARTICLE FORM =====
export interface ArticleForm {
  title: string;
  content: string; // JSON string from editor
  excerpt?: string;
  coverImage?: string;
  status: "draft" | "published";
  isPrivate: boolean;
  publishAt?: string; // datetime string
  tags?: string[];
  category: string;
  // userId: string;
}
// ===== ARTICLE PAYLOAD =====
// What actually gets sent to Appwrite on create/update
// = ArticleForm fields + userId (injected from authStore at submit time)
export interface ArticlePayload extends ArticleForm {
  userId: string;
}