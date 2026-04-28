import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
        createNew: vi.fn(),
        update: vi.fn(),
        deleteOne: vi.fn(),
    },
}))

import anecdoteService from '../services/anecdotes'
import useAnecdoteStore, {
    useAnecdoteActions,
    useAnecdotes,
} from './anecdoteStore'

beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
    it('initialize loads anecdotes from service', async () => {
        const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useAnecdoteActions())

        await act(async () => {
            await result.current.initialize()
        })

        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual(mockAnecdotes)
    })

    it('component receives anecdotes sorted by votes', async () => {
        const mockAnecdotes = [
            { id: 1, content: 'Test1', votes: 0 },
            { id: 2, content: 'Test2', votes: 200 },
            { id: 3, content: 'Test3', votes: 10 },
        ]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useAnecdoteActions())

        await act(async () => {
            await result.current.initialize()
        })

        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current.map((a) => a.id)).toEqual([2, 3, 1])
    })

    it('component receives a properly filtered list of anecdotes', async () => {
        const mockAnecdotes = [
            { id: 1, content: 'Dragon', votes: 0 },
            { id: 2, content: 'Monkey', votes: 200 },
            { id: 3, content: 'Pig', votes: 10 },
        ]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

        const { result } = renderHook(() => useAnecdoteActions())

        await act(async () => {
            await result.current.initialize()
            await result.current.setFilter('Mon')
        })

        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current.map((a) => a.id)).toEqual([2])
    })

    it('voting increases the number of votes for an anecdote.', async () => {
        const mockAnecdote = { id: 1, content: 'To be tested', votes: 0 }
        anecdoteService.getAll.mockResolvedValue([mockAnecdote])
        anecdoteService.update.mockResolvedValue({
            ...mockAnecdote,
            votes: 1,
        })
        const { result } = renderHook(() => useAnecdoteActions())

        await act(async () => {
            await result.current.initialize()
            await result.current.vote(mockAnecdote.id)
        })

        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current.map((a) => a.votes)).toEqual([1])
    })
})
