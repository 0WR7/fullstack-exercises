const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)

    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }

    return await response.json()
}

const createNew = async (anecdote) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: anecdote, votes: 0 }),
    })

    if (!response.ok) {
        throw new Error('Failed to create anecdote')
    }

    return await response.json()
}

const update = async (id, anecdote) => {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: anecdote.content,
            votes: anecdote.votes,
        }),
    })

    if (!response.ok) {
        throw new Error('Failed to update anecdote')
    }

    return await response.json()
}

const deleteOne = async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
        throw new Error('Failed to delete anecdote')
    }

    return response.status
}

export default { getAll, createNew, update, deleteOne }
