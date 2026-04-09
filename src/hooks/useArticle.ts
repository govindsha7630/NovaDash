import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { Article } from "@/types";

// Import from API layer — NOT from Appwrite directly

import {
  fetchArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/appwrite/article";

const ARTICLE_KEY = ["articles"];

// READ
export function useArticles() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ARTICLE_KEY,
    queryFn: () => fetchArticle(user!.$id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}

// CREATE
export function useArticleTodo() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (newArticle: {
      title: string;
      content: string;
      excerpt?: string;
      coverImage?: string;
      status: "published" | "draft" | "archived";
      tags?: string[];
    }) => createArticle({ ...newArticle, userId: user!.$id }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLE_KEY });
      toast.success("Article Created!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// UPDATE
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Article> }) =>
      updateArticle(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLE_KEY });
      toast.success("Article Updated!");
    },
    onError:(error: Error) => {
      toast.error(error.message);
    },
  });
}

// DELETE
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ARTICLE_KEY,
      });
      toast.success("Article Deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
