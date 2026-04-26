import { useAnecdoteActions, useAnecdotes } from "../store";

const AnecdoteList = () => {
	const rawAnecdotes = useAnecdotes();
	const { vote } = useAnecdoteActions();

	const anecdotes = rawAnecdotes.toSorted((a, b) => b.votes - a.votes);

	return (
		<div>
			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => vote(anecdote.id)}>vote</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default AnecdoteList;
