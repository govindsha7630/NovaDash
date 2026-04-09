import { tablesDB } from "./config";
import { ID, Query } from "appwrite";
import env from "./env";
import type { Article } from "@/types";

export const fetchArticle = async (userId: string): Promise<Article[]> => {
  const response = await tablesDB.listRows({
    databaseId: env.appwriteDatabaseId,
    tableId: env.appwriteCollectionArticles,
    queries: [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ],
  });
  console.log(response)
  return response.rows as unknown as Article[];
};

// Create a new Article
export const createArticle = async (data: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: "published" | "draft" | "archived";
  tags?: string[];
  userId: string;
}) => {
  return await tablesDB.createRow({
    databaseId: env.appwriteDatabaseId,
    tableId: env.appwriteCollectionArticles,
    rowId: ID.unique(),
    data: {
      ...data,
      status: "draft",
    },
  });
};

// Update any fields on a Article

export const updateArticle = async (id: string, data: Partial<Article>) => {
  return await tablesDB.updateRow({
    databaseId: env.appwriteDatabaseId,
    tableId: env.appwriteCollectionArticles,
    rowId: id,
    data,
  });
};

// Delete a Article

export const deleteArticle = async (id: string) => {
  return await tablesDB.deleteRow({
    databaseId: env.appwriteDatabaseId,
    tableId: env.appwriteCollectionArticles,
    rowId: id,
  });
};
