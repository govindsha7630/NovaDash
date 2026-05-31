import { createSlug } from "@/components/utils/miniUtils";
import { useArticles } from "@/hooks/useArticle";
import { useTodos } from "@/hooks/useTodos";
import { useMemo } from "react";

// ✅ Exported — other files can import this type
export type ActivityEvent = {
  id: string;
  type: "todo" | "article";
  title: string;
  action: string;
  timestamp: string;
  link: string;
};

export function useActivityEvents(limit = 20, lastChecked: string) {
  // ✅ Hooks INSIDE the function
  const { data: todos, isLoading: todosLoading } = useTodos();
  const { data: articles, isLoading: articlesLoading } = useArticles();

  // ✅ useMemo back in with correct dependencies
  const events = useMemo<ActivityEvent[]>(() => {
    const todoEvents: ActivityEvent[] = (todos ?? []).map((todo) => ({
      id: todo.$id,
      type: "todo",
      title: todo.title,
      action: todo.completed ? "Completed task" : "Created task",
      timestamp: todo.$updatedAt ?? todo.$createdAt,
      link: `/todos/${todo.$id}`,
    }));

    const articleEvents: ActivityEvent[] = (articles ?? []).map((article) => ({
      id: article.$id,
      type: "article",
      title: article.title,
      action:
        article.status === "published"
          ? "Published article"
          : article.status === "archived"
            ? "Archived article"
            : "Saved draft",
      timestamp: article.$updatedAt ?? article.$createdAt,
      link: `/articles/${createSlug(article.title, article.$id)}`,
    }));

    return [...todoEvents, ...articleEvents]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      // .slice(0, limit);
  }, [todos, articles, limit]); // ✅ limit added to deps

  // ✅ Unread count — events newer than last time notification panel was opened
  // const lastChecked = localStorage.getItem("notif_last_checked") ?? ""?
  const unreadCount = events.filter(
    (e) => !lastChecked || new Date(e.timestamp) > new Date(lastChecked ),
  ).length;

  // ✅ Combined loading state
  const isLoading = todosLoading || articlesLoading;
  const limited = events.slice(0, limit);
  // ✅ Returns named object not bare array
  return { limited, unreadCount, isLoading };
}
