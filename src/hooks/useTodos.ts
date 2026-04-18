import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { Todo } from "@/types";

// Import from API layer — NOT from Appwrite directly
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "@/appwrite/todo";

const TODO_KEY = ["todos"];

// READ
export function useTodos() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: TODO_KEY,
    queryFn: () => fetchTodos(user!.$id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}

// CREATE
export function useCreateTodo() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (newTodo: {
      title: string;
      description?: string;
      priority: "high" | "medium" | "low";
      dueDate?: string;
      tags?: string[];
      subtasks?: string;
    }) => createTodo({ ...newTodo, userId: user!.$id }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEY });
      toast.success("Todo created!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// UPDATE
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) =>
      updateTodo(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEY });
      toast.success("Todo updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// TOGGLE COMPLETE
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateTodo(id, { completed }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEY });
    },
    onError: () => {
      toast.error("Failed to update todo ");
    },
  });
}

// DELETE
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEY });
      toast.success("Todo deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
