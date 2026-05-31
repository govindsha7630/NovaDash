import { create } from "zustand"

interface NotificationStore {
  isOpen: boolean
  lastChecked: string
  open: () => void
  close: () => void
  markAllRead: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  isOpen: false,
  // Read from localStorage on init — persists across page refreshes
  lastChecked: localStorage.getItem("notif_last_checked") ?? "",

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  markAllRead: () => {
    const now = new Date().toISOString()
    localStorage.setItem("notif_last_checked", now)
    set({ lastChecked: now })  // ← triggers re-render everywhere
  },
}))