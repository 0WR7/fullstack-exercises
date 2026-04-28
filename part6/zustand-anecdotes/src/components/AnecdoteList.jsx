import { useAnecdoteActions, useAnecdotes } from './anecdoteStore'
import { useNotificationActions } from './notificationStore'

const AnecdoteList = () => {
    const anecdotes = useAnecdotes()
    const { vote, deleteAnecdote } = useAnecdoteActions()
    const { setNotification } = useNotificationActions()

    const voteAnecdote = (anecdote) => {
        vote(anecdote.id)
        setNotification(`You voted for ${anecdote.content}`, 'success')
    }

    return (
        <div>
            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => voteAnecdote(anecdote)}>
                            vote
                        </button>
                    </div>
                    {anecdote.votes < 1 && (
                        <button onClick={() => deleteAnecdote(anecdote)}>
                            delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList
