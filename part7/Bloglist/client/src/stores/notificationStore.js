import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
    message: null,
    severity: null,
    timer: null,
    actions: {
        setNotification: (message, severity) => {
            const currentTimer = get().timer
            if (currentTimer) clearTimeout(currentTimer)
            const newTimer = setTimeout(() => {
                set({ message: null, timer: null })
            }, 4000)

            set({ message, severity, timer: newTimer })
        },
    },
}))

export const useNotification = () => {
    const message = useNotificationStore((state) => state.message)
    const severity = useNotificationStore((state) => state.severity)

    return { message, severity }
}

export const useNotificationActions = () => {
    return useNotificationStore((state) => state.actions)
}
