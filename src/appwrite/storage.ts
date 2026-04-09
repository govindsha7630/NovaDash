import { ID } from "appwrite";
import { storage } from "./config";
import env from "./env"


// Upload a file — returns file object with $id
export const uploadFile = async (file: File) => {
  try {
    return await storage.createFile({
      bucketId: env.appwriteBucketId,
      fileId: ID.unique(),
      file,
    });
  } catch (error) {
    console.error("uploadFile error:", error);
    throw error;
  }
};

// Get file URL for displaying in <img> tag
export const getFileUrl = (fileId: string): string => {
  if (!fileId) return "";
  return storage
    .getFileView({
      bucketId: env.appwriteBucketId,
      fileId,
    })
    .toString();
};

// Get file metadata (name, size, type etc)
export const getFileMeta = async (fileId: string) => {
  try {
    return await storage.getFile({
      bucketId: env.appwriteBucketId,
      fileId,
    });
  } catch (error) {
    console.error("getFileMeta error:", error);
    throw error;
  }
};

// Delete a file
export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile({
      bucketId: env.appwriteBucketId,
      fileId,
    });
    return true;
  } catch (error) {
    console.error("deleteFile error:", error);
    throw error;
  }
};
