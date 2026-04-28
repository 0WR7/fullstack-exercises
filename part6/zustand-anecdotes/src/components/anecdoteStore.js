import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import AnecdoteService from '../services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
    anecdotes: [],
    filter: '',
    actions: {
        vote: async (id) => {
            const anecdote = get().anecdotes.find(
                (anecdote) => anecdote.id === id
            )
            const updated = await AnecdoteService.update(id, {
                ...anecdote,
                votes: anecdote.votes + 1,
            })
            set((state) => ({
                anecdotes: state.anecdotes.map((anecdote) =>
                    anecdote.id === id ? updated : anecdote
                ),
            }))
        },
        add: async (anecdote) => {
            const newAnecdote = await AnecdoteService.createNew(anecdote)
            set((state) => ({
                anecdotes: state.anecdotes.concat(newAnecdote),
            }))
        },
        deleteAnecdote: async (anecdote) => {
            if (anecdote.votes < 1) {
                await AnecdoteService.deleteOne(anecdote.id)
                set((state) => ({
                    anecdotes: state.anecdotes.filter(
                        (item) => item.id !== anecdote.id
                    ),
                }))
            }
        },

        setFilter: (value) => set(() => ({ filter: value })),
        initialize: async () => {
            const anecdotes = await AnecdoteService.getAll()
            set(() => ({ anecdotes }))
        },
    },
}))

export const useAnecdotes = () =>
    useAnecdoteStore(
        useShallow(({ anecdotes, filter }) => {
            const visible = filter
                ? anecdotes.filter((anecdote) =>
                      anecdote.content
                          .toLowerCase()
                          .includes(filter.toLowerCase())
                  )
                : anecdotes

            return visible.toSorted((a, b) => b.votes - a.votes)
        })
    )

export const useAnecdoteActions = () => {
    return useAnecdoteStore((state) => state.actions)
}

//testing
export default useAnecdoteStore
