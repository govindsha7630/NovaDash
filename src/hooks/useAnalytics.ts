import { useMemo } from "react";
import { useTodos } from "./useTodos";
import { useArticles } from "./useArticle";
import {
  getArticleAnalytics,
  getStatsData,
  getTasksOverTime,
} from "@/components/utils/analyticsUtils";

// src/hooks/useAnalytics.ts  ← NOW correctly named, has actual hooks inside
export function useAnalytics() {
  const { data: todos, isLoading: todosLoading } = useTodos();
  const { data: articles, isLoading: articlesLoading } = useArticles();

  const tasksOverTime = useMemo(() => getTasksOverTime(todos ?? []), [todos]);
  const articleAnalytics = useMemo(
    () => getArticleAnalytics(articles ?? [], "month"),
    [articles],
  );
  const stats = useMemo(
    () => getStatsData(articles ?? [], todos ?? []),
    [articles, todos],
  );

  return {
    ...stats,
    tasksOverTime,
    articleAnalytics,
    isLoading: todosLoading || articlesLoading,
  };
}
