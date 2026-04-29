import { create } from 'zustand'
import usersService from '../services/users'

const useUsersStore = create((set) => ({
    users: [],
    initialized: false,
    actions: {
        initialize: async () => {
            const users = await usersService.getAll()
            if (!Array.isArray(users)) {
                throw new Error('Expected users API to return an array')
            }
            set(() => ({ users, initialized: true }))
        },
    },
}))

export const useUsers = () => {
    const users = useUsersStore((state) => state.users)
    const initialized = useUsersStore((state) => state.initialized)
    return { users, initialized }
}

export const useUsersActions = () => {
    return useUsersStore((state) => state.actions)
}
