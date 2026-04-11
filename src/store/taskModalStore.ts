import { create } from "zustand"
import type { Todo } from "@/types"

interface TaskModalStore {
    isOpen: boolean
    editData: Partial<Todo> | null   // null = create mode, data = edit mode

    openModal: (editData?: Partial<Todo>) => void
    closeModal: () => void
}

export const useTaskModalStore = create<TaskModalStore>((set) => ({
    isOpen: false,
    editData: null,

    openModal: (editData ) => {
        set({ isOpen: true, editData })
        // Prevent background scroll
        document.body.style.overflow = "hidden"
    },

    closeModal: () => {
        set({ isOpen: false, editData: null })
        // Restore scroll
        document.body.style.overflow = ""
    },
}))