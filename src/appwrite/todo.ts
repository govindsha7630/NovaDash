import { tablesDB } from "./config"
import { ID, Query } from "appwrite"
import env from "./env"
import type { Todo } from "@/types"

// Fetch all todos for a specific user
export const fetchTodos = async (userId: string): Promise<Todo[]> => {
    const response = await tablesDB.listRows({
        databaseId: env.appwriteDatabaseId,
        tableId: env.appwriteCollectionTodos,
        queries: [
            Query.equal("userId", userId),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
        ]
    })
    return response.rows as unknown as Todo[]
    }

// Create a new todo
export const createTodo = async (data: {
    title: string
    description?: string
    priority: "high" | "medium" | "low"
    dueDate?: string
    tags?: string[]
    userId: string
}) => {
    return await tablesDB.createRow({
        databaseId: env.appwriteDatabaseId,
        tableId: env.appwriteCollectionTodos,
        rowId: ID.unique(),
        data: {
            ...data,
            completed: false,
        }
    })
}

// Update any fields on a todo
export const updateTodo = async (id: string, data: Partial<Todo>) => {
    return await tablesDB.updateRow({
        databaseId: env.appwriteDatabaseId,
        tableId: env.appwriteCollectionTodos,
        rowId: id,
        data,
        })
}

// Delete a todo
export const deleteTodo = async (id: string) => {
    await tablesDB.deleteRow({
        databaseId: env.appwriteDatabaseId,
        tableId: env.appwriteCollectionTodos,
        rowId: id,
    })
}