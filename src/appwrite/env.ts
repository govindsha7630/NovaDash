const env = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionTodos: String(import.meta.env.VITE_APPWRITE_COLLECTION_TODOS),
    appwriteCollectionArticles: String(import.meta.env.VITE_APPWRITE_COLLECTION_ARTICLES),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default env