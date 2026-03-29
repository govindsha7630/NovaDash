import { account } from "./config"
import { ID } from "appwrite"
import type { User } from "@/types"

// SIGN UP
export const createAccount = async (
    name: string,
    email: string,
    password: string
) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        )
        if (newAccount) {
            return login(email, password)
        }
    } catch (error) {
        console.error("createAccount error:", error)
        throw error
    }
}

// LOGIN
export const login = async (
    email: string,
    password: string
) => {
    try {
        return await account.createEmailPasswordSession(
            email,
            password
        )
    } catch (error) {
        console.error("login error: ", error)
        throw error
    }
}

// GET CURRENT USER
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const user = await account.get()
        return {
            $id: user.$id,
            name: user.name,
            email: user.email,
        }
    } catch {
        return null
    }
}

// LOGOUT
export const logout = async () => {
    try {
        await account.deleteSession("current")
    } catch (error) {
        console.error("logout error:", error)
        throw error
    }
}