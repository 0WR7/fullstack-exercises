import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUser from '../services/persistentUser'

const useUserStore = create((set) => ({
    user: null,
    actions: {
        login: async ({ username, password }) => {
            const user = await loginService.login({ username, password })
            persistentUser.saveUser(user)
            blogService.setToken(user.token)
            set({ user })
        },
        logout: () => {
            set({ user: null })
            blogService.setToken(null)
            persistentUser.removeUser()
        },
        initialize: () => {
            const user = persistentUser.getUser()

            if (user) {
                blogService.setToken(user.token)
                set({ user })
            }
        },
    },
}))

export const useUser = () => {
    const user = useUserStore((state) => state.user)
    return { user }
}

export const useUserActions = () => {
    return useUserStore((state) => state.actions)
}
